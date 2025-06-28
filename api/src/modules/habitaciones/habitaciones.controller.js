// src/modules/habitaciones/habitaciones.controller.js
const mongoose = require('mongoose');
const Habitacion = require('./habitaciones.model');
const Reserva = mongoose.model('Reserva');

// @desc    Obtener todas las habitaciones y su disponibilidad para HOY
exports.getHabitaciones = async (req, res, next) => {
    try {
        const inicioDeHoy = new Date();
        inicioDeHoy.setHours(0, 0, 0, 0);
        const inicioDeManana = new Date(inicioDeHoy);
        inicioDeManana.setDate(inicioDeManana.getDate() + 1);

        const reservasDeHoy = await Reserva.find({
            fecha_inicio: { $lt: inicioDeManana },
            fecha_fin: { $gt: inicioDeHoy }
        }).select('habitacion_id');

        const habitacionesOcupadasIds = new Set(reservasDeHoy.map(r => r.habitacion_id.toString()));
        const todasLasHabitaciones = await Habitacion.find().sort({ numeroHabitacion: 1 }).lean();

        const habitacionesConDisponibilidad = todasLasHabitaciones.map(habitacion => ({
            ...habitacion,
            disponible: !habitacionesOcupadasIds.has(habitacion._id.toString())
        }));

        res.status(200).json({ success: true, count: habitacionesConDisponibilidad.length, data: habitacionesConDisponibilidad });
    } catch (error) {
        next(error);
    }
};

// @desc    Obtener una sola habitación por su ID
exports.getHabitacion = async (req, res, next) => {
     try {
        const habitacion = await Habitacion.findById(req.params.id);
        if (!habitacion) {
            return res.status(404).json({ success: false, message: 'Habitación no encontrada' });
        }
        res.status(200).json({ success: true, data: habitacion });
    } catch (error) {
        next(error);
    }
};

// @desc    Crear una nueva habitación
exports.createHabitacion = async (req, res, next) => {
    try {
        const habitacion = await Habitacion.create(req.body);
        res.status(201).json({ success: true, data: habitacion });
    } catch (error) {
        next(error);
    }
};

// @desc    Actualizar una habitación
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
exports.deleteHabitacion = async (req, res, next) => {
    try {
        const habitacion = await Habitacion.findByIdAndDelete(req.params.id);
         if (!habitacion) {
            return res.status(404).json({ success: false, message: 'Habitación no encontrada' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};
