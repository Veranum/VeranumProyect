const mongoose = require('mongoose');
const Habitacion = mongoose.model('Habitacion');
const Reserva = mongoose.model('Reserva');
const Precio = mongoose.model('Precio');

// @desc    Obtener todas las habitaciones, su precio vigente y su disponibilidad
// @access  Público
exports.getHabitaciones = async (req, res, next) => {
    try {
        const query = req.query.hotelId ? { hotel_id: req.query.hotelId } : {};
        
        const todasLasHabitaciones = await Habitacion.find(query).sort({ _id: 1 }).lean();

        const habitacionesConPrecio = await Promise.all(
            todasLasHabitaciones.map(async (habitacion) => {
                const precioVigente = await Precio.findOne({
                    habitacion_id: habitacion._id,
                    fecha_vigencia: { $lte: new Date() }
                }).sort({ fecha_vigencia: -1 });

                return {
                    ...habitacion,
                    precio: precioVigente ? precioVigente.valor : 0
                };
            })
        );
        
        const inicioDeHoy = new Date();
        inicioDeHoy.setHours(0, 0, 0, 0);

        const reservasActivasOFuturas = await Reserva.find({
            estado: 'Confirmado',
            fecha_fin: { $gt: inicioDeHoy }
        }).select('habitacion_id');

        const habitacionesNoDisponiblesIds = new Set(reservasActivasOFuturas.map(r => String(r.habitacion_id)));

        const resultadoFinal = habitacionesConPrecio.map(habitacion => ({
            ...habitacion,
            disponible: !habitacionesNoDisponiblesIds.has(String(habitacion._id))
        }));

        res.status(200).json({ success: true, count: resultadoFinal.length, data: resultadoFinal });

    } catch (error) {
        next(error);
    }
};

// @desc    Obtener una sola habitación (también con su precio vigente)
// @access  Público
exports.getHabitacion = async (req, res, next) => {
     try {
        const habitacion = await Habitacion.findById(req.params.id).lean();
        if (!habitacion) {
            return res.status(404).json({ success: false, message: 'Habitación no encontrada' });
        }
        
        const precioVigente = await Precio.findOne({
            habitacion_id: habitacion._id,
            fecha_vigencia: { $lte: new Date() }
        }).sort({ fecha_vigencia: -1 });

        const habitacionConPrecio = {
            ...habitacion,
            precio: precioVigente ? precioVigente.valor : 0
        };

        res.status(200).json({ success: true, data: habitacionConPrecio });
    } catch (error) {
        next(error);
    }
};

// @desc    Crear una nueva habitación
// @access  Admin
exports.createHabitacion = async (req, res, next) => {
    try {
        const habitacion = await Habitacion.create(req.body);
        res.status(201).json({ success: true, data: habitacion });
    } catch (error) {
        next(error);
    }
};

// @desc    Actualizar una habitación
// @access  Admin
exports.updateHabitacion = async (req, res, next) => {
     try {
        const habitacion = await Habitacion.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!habitacion) {
            return res.status(404).json({ success: false, message: 'Habitación no encontrada' });
        }
        res.status(200).json({ success: true, data: habitacion });
    } catch (error) {
        next(error);
    }
};

// @desc    Eliminar una habitación
// @access  Admin
exports.deleteHabitacion = async (req, res, next) => {
    try {
        const habitacion = await Habitacion.findById(req.params.id);
         if (!habitacion) {
            return res.status(404).json({ success: false, message: 'Habitación no encontrada' });
        }

        await Precio.deleteMany({ habitacion_id: habitacion._id });
        await habitacion.deleteOne();
        
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};