// src/modules/promociones/promociones.model.js
const mongoose = require('mongoose');
const PromocionSchema = new mongoose.Schema({
  codigo: { type: String, required: true, unique: true },
  descripcion: { type: String, required: true },
  porcentaje_descuento: { type: Number, required: true },
  activa: { type: Boolean, default: true }
});
module.exports = mongoose.model('Promocion', PromocionSchema);