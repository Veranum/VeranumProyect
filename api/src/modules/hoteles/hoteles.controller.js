// src/modules/hoteles/hoteles.controller.js
const Hotel = require('./hotel.model');

// @desc    Obtener todos los hoteles
exports.getAllHoteles = async (req, res, next) => {
    try {
        const hoteles = await Hotel.find();
        res.status(200).json({ success: true, count: hoteles.length, data: hoteles });
    } catch (error) {
        next(error);
    }
};

// @desc    Crear un hotel
exports.createHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.create(req.body);
        res.status(201).json({ success: true, data: hotel });
    } catch (error) {
        next(error);
    }
};

// @desc    Actualizar un hotel
exports.updateHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!hotel) return res.status(404).json({ success: false, message: 'Hotel no encontrado' });
        res.status(200).json({ success: true, data: hotel });
    } catch (error) {
        next(error);
    }
};

// @desc    Eliminar un hotel
exports.deleteHotel = async (req, res, next) => {
    try {
        // Añadir lógica para verificar que no tenga habitaciones antes de borrar
        const hotel = await Hotel.findByIdAndDelete(req.params.id);
        if (!hotel) return res.status(404).json({ success: false, message: 'Hotel no encontrado' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};