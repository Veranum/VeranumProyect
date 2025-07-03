// src/modules/precios/precios.controller.js
const Precio = require('./precio.model');

// @desc    Establecer un nuevo precio para una habitación
// @route   POST /api/precios
// @access  Admin/Gerente
exports.setNewPrice = async (req, res, next) => {
    try {
        // El body debe contener habitacion_id y el nuevo valor
        const nuevoPrecio = await Precio.create(req.body);
        res.status(201).json({ success: true, data: nuevoPrecio });
    } catch (error) {
        next(error);
    }
};