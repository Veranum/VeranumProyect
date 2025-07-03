// src/modules/hoteles/hoteles.routes.js
const express = require('express');
const router = express.Router();
const { 
    getAllHoteles, 
    createHotel, 
    updateHotel, 
    deleteHotel 
} = require('./hoteles.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');

const adminRoles = ['admin', 'gerente'];

router.route('/')
    .get(getAllHoteles) // Ruta pública para que los clientes vean los hoteles
    .post(protect, authorize(...adminRoles), createHotel);

router.route('/:id')
    .put(protect, authorize(...adminRoles), updateHotel)
    .delete(protect, authorize(...adminRoles), deleteHotel);

module.exports = router;