// src/modules/habitaciones/habitaciones.model.js
const mongoose = require('mongoose');
const Counter = require('../counters/counters.model');

const HabitacionSchema = new mongoose.Schema({
  numeroHabitacion: {
    type: Number,
    unique: true
  },
  nombre: {
    type: String,
    required: [true, 'El nombre de la habitación es requerido.'],
    trim: true
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es requerida.'],
  },
  categoria: {
    type: String,
    enum: ['individual', 'doble', 'matrimonial'],
    required: [true, 'La categoría es requerida.']
  },
  capacidad: {
    type: Number,
    required: [true, 'La capacidad es requerida.'],
    min: [1, 'La capacidad no puede ser menor a 1.'],
    max: [4, 'La capacidad no puede ser mayor a 4.']
  },
  piso: {
      type: Number,
      required: [true, 'El número de piso es requerido.'],
      min: [1, 'El piso no puede ser menor a 1.'],
      max: [3, 'El piso no puede ser mayor a 3.']
  },
  precio_noche: {
    type: Number,
    required: [true, 'El precio por noche es requerido.'],
  },
  servicios: [String],
  // El campo 'disponible' ha sido eliminado de este esquema.
}, { 
    timestamps: true,
    collection: 'habitaciones' 
});


// Lógica auto-incremental (sin cambios)
HabitacionSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'habitacionId' },
                { $inc: { sequence_value: 10 } },
                { new: true, upsert: true }
            );
            
            this.numeroHabitacion = counter.sequence_value === 10 ? 100 : counter.sequence_value;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});


module.exports = mongoose.model('Habitacion', HabitacionSchema);
