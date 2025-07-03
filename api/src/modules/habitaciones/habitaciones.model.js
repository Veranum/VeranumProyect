// src/modules/habitaciones/habitaciones.model.js
const mongoose = require('mongoose');
const Counter = require('../counters/counters.model');

const HabitacionSchema = new mongoose.Schema({
  _id: { type: Number, alias: 'numeroHabitacion' },
  hotel_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  nombre: { type: String, required: true, trim: true },
  descripcion: { type: String, required: true },
  categoria: { type: String, enum: ['individual', 'doble', 'matrimonial'], required: true },
  capacidad: { type: Number, required: true },
  piso: { type: Number, required: true },
  servicios: [String],
  // --- CAMBIO: El campo 'precio' se elimina de este modelo ---
}, { 
    timestamps: true,
    collection: 'habitaciones',
    _id: false 
});

// El hook de auto-incremento se mantiene sin cambios
HabitacionSchema.pre('save', async function(next) { /* ... */ });

module.exports = mongoose.model('Habitacion', HabitacionSchema);