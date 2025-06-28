// src/modules/auth/auth.routes.js
const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('./auth.controller.js');
const { protect } = require('../../middleware/auth.middleware.js');

// Ruta para registrar un nuevo usuario: POST /api/auth/register
router.post('/register', register);

// Ruta para iniciar sesión: POST /api/auth/login
router.post('/login', login);

// Ruta para obtener los datos del usuario autenticado (protegida)
// GET /api/auth/me
router.get('/me', protect, getMe);

module.exports = router;
