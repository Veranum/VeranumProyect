// src/app.js
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/error.handler.js');

// --- Precarga de Modelos ---
require('./modules/usuarios/usuarios.model');
require('./modules/habitaciones/habitaciones.model');
require('./modules/reservas/reservas.model');
require('./modules/promociones/promociones.model');
require('./modules/counters/counters.model');
require('./modules/hoteles/hotel.model');
require('./modules/precios/precio.model.js');
require('./modules/servicios/servicio.model.js');

// --- PASO 2: Importación del Enrutador Principal ---
const mainApiRouter = require('./routes'); // Usamos el index.js de la carpeta routes

const app = express();

// --- Middlewares Generales ---
app.use(cors());
app.use(express.json());

// --- PASO 3: Uso de Rutas de la API ---
app.use('/api', mainApiRouter);

// --- Middleware de Manejo de Errores (Siempre al final) ---
app.use(errorHandler);

module.exports = app;