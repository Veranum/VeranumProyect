// src/modules/reservas/reservas.controller.js
const mongoose = require('mongoose');
const Reserva = mongoose.model('Reserva');
const Habitacion = mongoose.model('Habitacion');
const Precio = mongoose.model('Precio');
const Servicio = mongoose.model('Servicio');    

// --- FUNCIÓN HELPER ---
const checkAvailability = async (habitacion_id, fecha_inicio, fecha_fin, excludeReservaId = null) => {
    const query = {
        habitacion_id: habitacion_id,
        estado: 'Confirmado',
        $or: [ { fecha_inicio: { $lt: fecha_fin }, fecha_fin: { $gt: fecha_inicio } } ]
    };
    if (excludeReservaId) {
        query._id = { $ne: excludeReservaId };
    }
    const existingReservation = await Reserva.findOne(query);
    return !existingReservation;
};

// @desc    Crear una reserva (para Clientes)
exports.createReserva = async (req, res, next) => {
    req.body.cliente_id = req.user.id;
    const { habitacion_id, fecha_inicio, fecha_fin, servicios_adicionales = [] } = req.body;
    
    try {
        const isAvailable = await checkAvailability(habitacion_id, fecha_inicio, fecha_fin);
        if (!isAvailable) return res.status(409).json({ success: false, message: 'Conflicto: La habitación ya se encuentra reservada para estas fechas.' });
        
        const habitacion = await Habitacion.findById(habitacion_id);
        if (!habitacion) return res.status(404).json({ message: 'Habitación no encontrada.' });
        
        const inicioReserva = new Date(fecha_inicio);
        inicioReserva.setHours(0, 0, 0, 0);

        const precioVigente = await Precio.findOne({
            habitacion_id: habitacion_id,
            fecha_vigencia: { $lte: inicioReserva }
        }).sort({ fecha_vigencia: -1 });

        if (!precioVigente) {
            return res.status(400).json({ success: false, message: 'La habitación no tiene un precio definido para estas fechas.' });
        }

        const dias = Math.ceil((new Date(fecha_fin) - new Date(fecha_inicio)) / (1000 * 60 * 60 * 24));
        if (dias <= 0) return res.status(400).json({ message: 'Fechas inválidas.' });

        const costoHabitacion = dias * precioVigente.valor;
        let costoServicios = 0;

        if (servicios_adicionales.length > 0) {
            const serviciosDb = await Servicio.find({ '_id': { $in: servicios_adicionales } });
            const precioTotalDiarioServicios = serviciosDb.reduce((total, s) => total + s.precio_diario, 0);
            costoServicios = precioTotalDiarioServicios * dias;
        }
        
        req.body.precio_final = costoHabitacion + costoServicios;
        req.body.hotel_id = habitacion.hotel_id;
        req.body.servicios_adicionales = servicios_adicionales;

        const reserva = await Reserva.create(req.body);
        res.status(201).json({ success: true, data: reserva });
    } catch (error) {
        next(error);
    }
};

// --- FUNCIÓN RESTAURADA ---
exports.createReservaAdmin = async (req, res, next) => {
    const { cliente_id, habitacion_id, fecha_inicio, fecha_fin, estado } = req.body;
    try {
        const isAvailable = await checkAvailability(habitacion_id, fecha_inicio, fecha_fin);
        if (!isAvailable) return res.status(409).json({ success: false, message: 'Conflicto: La habitación ya se encuentra reservada para las fechas seleccionadas.' });
        
        const habitacion = await Habitacion.findById(habitacion_id);
        if (!habitacion) return res.status(404).json({ message: 'Habitación no encontrada.' });

        const precioVigente = await Precio.findOne({
            habitacion_id: habitacion_id,
            fecha_vigencia: { $lte: new Date(fecha_inicio) }
        }).sort({ fecha_vigencia: -1 });

        if (!precioVigente) {
            return res.status(400).json({ success: false, message: 'La habitación no tiene un precio definido para estas fechas.' });
        }

        const dias = Math.ceil((new Date(fecha_fin) - new Date(fecha_inicio)) / (1000 * 60 * 60 * 24));
        if (dias <= 0) return res.status(400).json({ message: 'La fecha de fin debe ser posterior a la fecha de inicio.'});
        
        const precio_final = dias * precioVigente.valor;
        const hotel_id = habitacion.hotel_id;
        
        const reserva = await Reserva.create({ cliente_id, habitacion_id, hotel_id, fecha_inicio, fecha_fin, estado, precio_final });
        res.status(201).json({ success: true, data: reserva });
    } catch (error) {
        next(error);
    }
};

exports.getMisReservas = async (req, res, next) => {
    try {
        const reservas = await Reserva.find({ cliente_id: req.user.id }).populate('habitacion_id', 'nombre').populate('hotel_id', 'nombre');
        res.status(200).json({ success: true, data: reservas });
    } catch (error) { next(error); }
};

exports.getAllReservasAdmin = async (req, res, next) => {
    try {
        const reservas = await Reserva.find()
            .sort({ createdAt: -1 })
            .populate('cliente_id', 'nombre email _id')
            .populate('habitacion_id', 'nombre precio')
            .populate('hotel_id', 'nombre')
            // --- CAMBIO: Se popula la información de los servicios adicionales ---
            .populate('servicios_adicionales', 'nombre precio_diario');
            
        res.status(200).json({ success: true, count: reservas.length, data: reservas });
    } catch (error) {
        next(error);
    }
};

exports.getReservasPorUsuarioAdmin = async (req, res, next) => {
    try {
        const reservas = await Reserva.find({ cliente_id: req.params.run })
            .populate('habitacion_id', 'nombre')
            .sort({ fecha_inicio: -1 }); 
        res.status(200).json({ success: true, count: reservas.length, data: reservas });
    } catch (error) {
        next(error);
    }
};

exports.updateReservaAdmin = async (req, res, next) => {
    try {
        if (req.body.fecha_inicio && req.body.fecha_fin && req.body.habitacion_id) {
            const precioVigente = await Precio.findOne({
                habitacion_id: req.body.habitacion_id,
                fecha_vigencia: { $lte: new Date(req.body.fecha_inicio) }
            }).sort({ fecha_vigencia: -1 });
            if (precioVigente) {
                const dias = (new Date(req.body.fecha_fin) - new Date(req.body.fecha_inicio)) / (1000 * 60 * 60 * 24);
                req.body.precio_final = dias * precioVigente.valor;
            }
        }
        const reserva = await Reserva.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!reserva) return res.status(404).json({ success: false, message: 'Reserva no encontrada' });
        res.status(200).json({ success: true, data: reserva });
    } catch (error) { next(error); }
};

exports.deleteReservaAdmin = async (req, res, next) => {
    try {
        const reserva = await Reserva.findByIdAndDelete(req.params.id);
        if (!reserva) return res.status(404).json({ success: false, message: 'Reserva no encontrada' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) { next(error); }
};