// src/modules/reservas/reservas.routes.js
const express = require('express');
const router = express.Router();
const { 
    createReserva, 
    getMisReservas, 
    findAvailableRooms,
    // --- NUEVOS CONTROLADORES ---
    getAllReservasAdmin,
    updateReservaAdmin,
    deleteReservaAdmin,
    createReservaAdmin
} = require('./reservas.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');

// --- Rutas Públicas y para Clientes ---
router.get('/disponibles', findAvailableRooms);
router.post('/', protect, createReserva);
router.get('/mis-reservas', protect, getMisReservas);


// --- NUEVAS RUTAS PARA ADMINISTRADORES ---
// Deben estar protegidas y autorizadas para los roles correctos
const adminRoles = ['admin', 'gerente'];
router.route('/admin')
    .post(protect, authorize(...adminRoles), createReservaAdmin);
// ----------------------------

router.route('/admin/all')
    .get(protect, authorize(...adminRoles), getAllReservasAdmin);

router.route('/admin/:id')
    .put(protect, authorize(...adminRoles), updateReservaAdmin)
    .delete(protect, authorize(...adminRoles), deleteReservaAdmin);


module.exports = router;
