// src/modules/usuarios/usuarios.routes.js
const express = require('express');
const router = express.Router();
const { 
    getAllUsersAdmin, 
    createUserAdmin,
    updateUserAdmin,
    deleteUserAdmin
} = require('./usuarios.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');

const adminRoles = ['admin', 'gerente'];

router.route('/admin/all')
    .get(protect, authorize(...adminRoles), getAllUsersAdmin);

router.route('/admin/create')
    .post(protect, authorize(...adminRoles), createUserAdmin);

// --- NUEVAS RUTAS PARA EDITAR Y ELIMINAR ---
router.route('/admin/:id')
    .put(protect, authorize(...adminRoles), updateUserAdmin)
    .delete(protect, authorize(...adminRoles), deleteUserAdmin);

module.exports = router;