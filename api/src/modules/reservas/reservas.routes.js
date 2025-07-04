// api/src/modules/reservas/reservas.routes.js
const express = require('express');
const router = express.Router();

const {
    createReserva,
    getMisReservas,
    cancelarMiReserva,
    getAllReservasAdmin,
    createReservaAdmin,
    updateReservaAdmin,
    deleteReservaAdmin,
    getReservasPorUsuarioAdmin
} = require('./reservas.controller');

const { protect, authorize } = require('../../middleware/auth.middleware');

const adminRoles = ['admin', 'gerente'];

// --- Rutas para Clientes ---
router.route('/')
    .post(protect, createReserva);

router.route('/mis-reservas')
    .get(protect, getMisReservas);

router.route('/mis-reservas/:id/cancelar')
    .patch(protect, cancelarMiReserva);

// --- Rutas para Administradores ---

// CORRECCIÓN: Se restaura la ruta /admin/all para obtener todas las reservas
router.route('/admin/all')
    .get(protect, authorize(...adminRoles), getAllReservasAdmin);

// Ruta para que el admin cree una reserva
router.route('/admin')
    .post(protect, authorize(...adminRoles), createReservaAdmin);
    
// Rutas para acciones específicas de admin sobre una reserva
router.route('/admin/:id')
    .put(protect, authorize(...adminRoles), updateReservaAdmin)
    .delete(protect, authorize(...adminRoles), deleteReservaAdmin);

// Ruta para obtener el historial de un usuario específico
router.route('/admin/usuario/:run')
    .get(protect, authorize(...adminRoles), getReservasPorUsuarioAdmin);

module.exports = router;