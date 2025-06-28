// src/app.js
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/error.handler.js');

// --- Precarga de Modelos ---
require('./modules/usuarios/usuarios.model');
require('./modules/habitaciones/habitaciones.model');
require('./modules/reservas/reservas.model');
require('./modules/promociones/promociones.model');

// --- Importación de Rutas ---
const authRoutes = require('./modules/auth/auth.routes.js');
const habitacionesRoutes = require('./modules/habitaciones/habitaciones.routes.js');
const promocionesRoutes = require('./modules/promociones/promociones.routes.js');
const reportesRoutes = require('./modules/reportes/reportes.routes.js');
const reservasRoutes = require('./modules/reservas/reservas.routes.js');
const usuariosRoutes = require('./modules/usuarios/usuarios.routes.js');

const app = express();

app.use(cors());
app.use(express.json());

// --- Uso de Rutas ---
app.use('/api/auth', authRoutes);
app.use('/api/habitaciones', habitacionesRoutes);
app.use('/api/promociones', promocionesRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/usuarios', usuariosRoutes);
require('./modules/counters/counters.model');

app.use(errorHandler);

module.exports = app;