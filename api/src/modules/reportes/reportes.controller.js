// src/modules/reportes/reportes.controller.js
const mongoose = require('mongoose');
const Reserva = mongoose.model('Reserva');
const Habitacion = mongoose.model('Habitacion');

exports.generarReporteGeneral = async (req, res, next) => {
    try {
        const ahora = new Date();
        // --- CAMBIO: Se lee el año y el mes de la consulta, con el actual como defecto ---
        const year = parseInt(req.query.year) || ahora.getFullYear();
        const month = req.query.month ? parseInt(req.query.month) - 1 : ahora.getMonth();

        const inicioMes = new Date(year, month, 1);
        const finMes = new Date(year, month + 1, 0, 23, 59, 59);

        // La lógica de ocupación siempre es para el día de HOY, así que no cambia.
        const inicioDeHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
        const inicioDeManana = new Date(inicioDeHoy);
        inicioDeManana.setDate(inicioDeManana.getDate() + 1);

        const ocupacionPromise = async () => {
            const totalHabitaciones = await Habitacion.countDocuments();
            if (totalHabitaciones === 0) return 0;
            const habitacionesOcupadas = await Reserva.distinct('habitacion_id', {
                estado: 'Confirmado',
                fecha_inicio: { $lt: inicioDeManana },
                fecha_fin: { $gt: inicioDeHoy }
            });
            return (habitacionesOcupadas.length / totalHabitaciones) * 100;
        };

        // --- Las métricas ahora usan el rango de fecha dinámico ---
        const metricasMesPromise = Reserva.aggregate([
            { $match: { createdAt: { $gte: inicioMes, $lte: finMes } } },
            {
                $group: {
                    _id: null,
                    ingresosMesActual: { $sum: { $cond: [{ $eq: ['$estado', 'Confirmado'] }, '$precio_final', 0] } },
                    nuevasReservasMes: { $sum: 1 }
                }
            }
        ]);
        
        // ... (El resto del controlador se mantiene igual)
        const [ocupacionCalculada, metricasMes] = await Promise.all([
            ocupacionPromise(),
            metricasMesPromise,
        ]);

        const reporte = {
            ocupacion: Math.round(ocupacionCalculada),
            ingresosMesActual: metricasMes[0]?.ingresosMesActual || 0,
            nuevasReservasMes: metricasMes[0]?.nuevasReservasMes || 0,
            ingresosPorHabitacion: [] // Mantener simple por ahora
        };
        
        res.status(200).json({ success: true, data: reporte });

    } catch (error) {
        console.error("Error al generar el reporte:", error);
        next(error);
    }
};