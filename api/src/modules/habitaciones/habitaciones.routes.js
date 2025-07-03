// src/modules/habitaciones/habitaciones.routes.js
const express = require('express');
const router = express.Router();
const { 
  getHabitaciones, 
  getHabitacion, 
  createHabitacion, 
  updateHabitacion, 
  deleteHabitacion 
} = require('./habitaciones.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');

const adminRoles = ['admin', 'gerente'];

// La ruta raíz ahora maneja GET para todos y POST para admin
router.route('/')
  .get(getHabitaciones)
  .post(protect, authorize(...adminRoles), createHabitacion);

// --- CORRECCIÓN: Se unifican todas las operaciones por ID en una sola ruta ---
// La protección de authorize() se encarga de la seguridad para PUT y DELETE
router.route('/:id')
  .get(getHabitacion)
  .put(protect, authorize(...adminRoles), updateHabitacion)
  .delete(protect, authorize(...adminRoles), deleteHabitacion);

module.exports = router;