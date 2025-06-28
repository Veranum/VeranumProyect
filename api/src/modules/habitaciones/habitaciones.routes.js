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

// Este archivo de rutas ahora solo se encarga de las operaciones CRUD de habitaciones.
// La lógica de disponibilidad se movió a /reservas, que es donde corresponde.

router.route('/')
  .get(getHabitaciones)
  .post(protect, authorize('admin', 'gerente'), createHabitacion);

router.route('/:id')
  .get(getHabitacion)
  .put(protect, authorize('admin', 'gerente'), updateHabitacion)
  .delete(protect, authorize('admin', 'gerente'), deleteHabitacion);

module.exports = router;
