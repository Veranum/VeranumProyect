// src/modules/promociones/promociones.routes.js
const express = require('express');
const router = express.Router();
const { getPromocionByCode } = require('./promociones.controller');
router.get('/:codigo', getPromocionByCode);
module.exports = router;