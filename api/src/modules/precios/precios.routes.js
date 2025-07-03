// src/modules/precios/precios.routes.js
const express = require('express');
const router = express.Router();
const { setNewPrice } = require('./precios.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');

router.post('/', protect, authorize('admin', 'gerente'), setNewPrice);

module.exports = router;