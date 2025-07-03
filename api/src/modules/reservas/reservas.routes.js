// src/modules/reservas/reservas.routes.js
const express = require('express');
const router = express.Router();
// --- CORRECCIÓN: Se importan todas las funciones necesarias ---
const { 
    createReserva, 
    getMisReservas, 
    getAllReservasAdmin,
    updateReservaAdmin,
    deleteReservaAdmin,
    createReservaAdmin,
    getReservasPorUsuarioAdmin
} = require('./reservas.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');

const adminRoles = ['admin', 'gerente'];

// --- Rutas Públicas y para Clientes ---
router.post('/', protect, createReserva);
router.get('/mis-reservas', protect, getMisReservas);

// --- Rutas para Administradores ---
router.route('/admin/all').get(protect, authorize(...adminRoles), getAllReservasAdmin);

// Ruta para obtener el historial de un usuario específico
router.route('/admin/usuario/:run').get(protect, authorize(...adminRoles), getReservasPorUsuarioAdmin);

// Ruta para que el admin cree una reserva
router.route('/admin').post(protect, authorize(...adminRoles), createReservaAdmin);

// Rutas para actualizar y eliminar una reserva por su ID
router.route('/admin/:id')
    .put(protect, authorize(...adminRoles), updateReservaAdmin)
    .delete(protect, authorize(...adminRoles), deleteReservaAdmin);

module.exports = router;