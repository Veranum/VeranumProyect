// src/modules/reportes/reportes.controller.js
const mongoose = require('mongoose');
const Reserva = mongoose.model('Reserva');
const Habitacion = mongoose.model('Habitacion');

// @desc    Generar un reporte de gestión general
// @route   GET /api/reportes/general
// @access  Private (Admin, Gerente)
exports.generarReporteGeneral = async (req, res, next) => {
    try {
        const hoy = new Date();
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

        // 1. Ocupación Actual
        const inicioDeHoy = new Date();
        inicioDeHoy.setHours(0, 0, 0, 0);
        const inicioDeManana = new Date(inicioDeHoy);
        inicioDeManana.setDate(inicioDeManana.getDate() + 1);

        const reservasActivasHoy = await Reserva.find({
            fecha_inicio: { $lt: inicioDeManana },
            fecha_fin: { $gt: inicioDeHoy }
        });
        const totalHabitaciones = await Habitacion.countDocuments();
        const ocupacion = totalHabitaciones > 0 ? (reservasActivasHoy.length / totalHabitaciones) * 100 : 0;

        // 2. Ingresos del Mes
        const ingresos = await Reserva.aggregate([
            { $match: { createdAt: { $gte: inicioMes, $lte: finMes }, estado: 'Confirmado' } },
            { $group: { _id: null, total: { $sum: "$precio_final" } } }
        ]);

        // 3. Nuevas Reservas del Mes
        const nuevasReservas = await Reserva.countDocuments({
             createdAt: { $gte: inicioMes, $lte: finMes }
        });

        // 4. Ingresos por tipo de habitación
        const ingresosPorHabitacion = await Reserva.aggregate([
            { $match: { estado: 'Confirmado' } },
            {
                $lookup: {
                    from: 'habitaciones',
                    localField: 'habitacion_id',
                    foreignField: '_id',
                    as: 'habitacion'
                }
            },
            { $unwind: '$habitacion' },
            {
                $group: {
                    _id: '$habitacion.nombre',
                    totalIngresos: { $sum: '$precio_final' }
                }
            },
            {
                $project: {
                    nombre: '$_id',
                    ingresos: '$totalIngresos',
                    _id: 0
                }
            }
        ]);


        const reporte = {
            ocupacion: Math.round(ocupacion),
            ingresosMesActual: ingresos.length > 0 ? ingresos[0].total : 0,
            nuevasReservasMes: nuevasReservas,
            ingresosPorHabitacion: ingresosPorHabitacion
        };

        res.status(200).json({ success: true, data: reporte });

    } catch (error) {
        next(error);
    }
};
