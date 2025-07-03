// src/modules/servicios/servicios.routes.js
const express = require('express');
const router = express.Router();
const { 
    getServiciosByHotel, 
    createServicio, 
    updateServicio, 
    deleteServicio 
} = require('./servicios.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');

const adminRoles = ['admin', 'gerente'];

// Ruta pública para que la página de reservas pueda obtener los servicios
router.get('/hotel/:hotelId', getServiciosByHotel);

// Rutas de Administración
router.post('/', protect, authorize(...adminRoles), createServicio);

router.route('/:id')
    .put(protect, authorize(...adminRoles), updateServicio)
    .delete(protect, authorize(...adminRoles), deleteServicio);

module.exports = router;