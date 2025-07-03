// src/modules/reportes/reportes.routes.js
const express = require('express');
const router = express.Router();
const { generarReporteGeneral } = require('./reportes.controller');
const { protect, authorize } = require('../../middleware/auth.middleware.js');

router.get('/general', protect, authorize('admin', 'gerente'), generarReporteGeneral);

module.exports = router;