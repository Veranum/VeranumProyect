// src/modules/reservas/reservas.controller.js
const mongoose = require('mongoose');
const Reserva = require('./reservas.model');
const Habitacion = mongoose.model('Habitacion');

const checkAvailability = async (habitacion_id, fecha_inicio, fecha_fin, excludeReservaId = null) => {
    const query = {
        habitacion_id: habitacion_id,
        $or: [
            { fecha_inicio: { $lt: fecha_fin }, fecha_fin: { $gt: fecha_inicio } }
        ]
    };
    if (excludeReservaId) {
        query._id = { $ne: excludeReservaId };
    }
    const existingReservation = await Reserva.findOne(query);
    return !existingReservation;
};

// @desc    Crear una nueva reserva (para el usuario logueado)
exports.createReserva = async (req, res, next) => {
    req.body.cliente_id = req.user.id; // El ID del cliente se toma del token
    const { habitacion_id, fecha_inicio, fecha_fin } = req.body;
    try {
        const isAvailable = await checkAvailability(habitacion_id, fecha_inicio, fecha_fin);
        if (!isAvailable) {
            return res.status(409).json({ success: false, message: 'Conflicto: La habitación ya se encuentra reservada para las fechas seleccionadas.' });
        }
        
        const habitacion = await Habitacion.findById(habitacion_id);
        if (!habitacion) return res.status(404).json({ message: 'Habitación no encontrada.' });
        
        const dias = (new Date(fecha_fin) - new Date(fecha_inicio)) / (1000 * 60 * 60 * 24);
        if (dias <= 0) return res.status(400).json({ message: 'La fecha de fin debe ser posterior a la fecha de inicio.'});
        
        req.body.precio_final = dias * habitacion.precio_noche;
        const reserva = await Reserva.create(req.body);
        res.status(201).json({ success: true, data: reserva });
    } catch (error) {
        next(error);
    }
};

// @desc    Crear una reserva (como Admin)
exports.createReservaAdmin = async (req, res, next) => {
    const { cliente_id, habitacion_id, fecha_inicio, fecha_fin, estado } = req.body;
    try {
        const isAvailable = await checkAvailability(habitacion_id, fecha_inicio, fecha_fin);
        if (!isAvailable) {
            return res.status(409).json({ success: false, message: 'Conflicto: La habitación ya se encuentra reservada para las fechas seleccionadas.' });
        }
        const habitacion = await Habitacion.findById(habitacion_id);
        if (!habitacion) return res.status(404).json({ message: 'Habitación no encontrada.' });

        const dias = (new Date(fecha_fin) - new Date(fecha_inicio)) / (1000 * 60 * 60 * 24);
        if (dias <= 0) return res.status(400).json({ message: 'La fecha de fin debe ser posterior a la fecha de inicio.'});
        
        const precio_final = dias * habitacion.precio_noche;
        const reserva = await Reserva.create({ cliente_id, habitacion_id, fecha_inicio, fecha_fin, estado, precio_final });
        res.status(201).json({ success: true, data: reserva });
    } catch (error) {
        next(error);
    }
};

// @desc    Obtener mis reservas (Cliente)
exports.getMisReservas = async (req, res, next) => {
    try {
        const reservas = await Reserva.find({ cliente_id: req.user.id }).populate('habitacion_id');
        res.status(200).json({ success: true, data: reservas });
    } catch (error) { next(error); }
};

// @desc    Encontrar habitaciones disponibles
exports.findAvailableRooms = async (req, res, next) => {
    const { fecha_inicio, fecha_fin } = req.query;
    if (!fecha_inicio || !fecha_fin) return res.status(400).json({ message: 'Las fechas de inicio y fin son requeridas.' });
    try {
        const conflictingReservations = await Reserva.find({ $or: [ { fecha_inicio: { $lt: fecha_fin }, fecha_fin: { $gt: fecha_inicio } } ] }).select('habitacion_id');
        const conflictingRoomIds = conflictingReservations.map(reserva => reserva.habitacion_id);
        const availableRooms = await Habitacion.find({ _id: { $nin: conflictingRoomIds } });
        res.status(200).json({ success: true, count: availableRooms.length, data: availableRooms });
    } catch (error) { next(error); }
};

// @desc    Obtener TODAS las reservas (Admin)
exports.getAllReservasAdmin = async (req, res, next) => {
    try {
        const reservas = await Reserva.find().sort({ createdAt: -1 }).populate('cliente_id', 'nombre email').populate('habitacion_id', 'nombre numeroHabitacion');
        res.status(200).json({ success: true, count: reservas.length, data: reservas });
    } catch (error) { next(error); }
};

// @desc    Actualizar una reserva por ID (Admin)
exports.updateReservaAdmin = async (req, res, next) => {
    try {
        const reserva = await Reserva.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!reserva) return res.status(404).json({ success: false, message: 'Reserva no encontrada' });
        res.status(200).json({ success: true, data: reserva });
    } catch (error) { next(error); }
};

// @desc    Eliminar una reserva por ID (Admin)
exports.deleteReservaAdmin = async (req, res, next) => {
    try {
        const reserva = await Reserva.findByIdAndDelete(req.params.id);
        if (!reserva) return res.status(404).json({ success: false, message: 'Reserva no encontrada' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) { next(error); }
};
