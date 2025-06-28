// src/modules/reservas/reservas.model.js
const mongoose = require('mongoose');
const Counter = require('../counters/counters.model'); // Importamos el contador

const ReservaSchema = new mongoose.Schema({
  // --- NUESTRO ID AMIGABLE Y AUTO-INCREMENTAL ---
  numeroReserva: {
    type: Number,
    unique: true
  },
  cliente_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  habitacion_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Habitacion',
    required: true,
  },
  fecha_inicio: {
    type: Date,
    required: true,
  },
  fecha_fin: {
    type: Date,
    required: true,
  },
  precio_final: {
    type: Number,
    required: true,
  },
  estado: {
    type: String,
    enum: ['Pendiente', 'Confirmado', 'Cancelado'],
    default: 'Confirmado',
  }
}, { timestamps: true });


// --- LÓGICA AUTO-INCREMENTAL ---
// Se ejecuta ANTES de que un nuevo documento 'Reserva' se guarde
ReservaSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            // Buscamos nuestro contador específico y lo incrementamos en 1
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'reservaId' },
                { $inc: { sequence_value: 1 } },
                { new: true, upsert: true }
            );
            // Asignamos el nuevo valor al campo 'numeroReserva'
            this.numeroReserva = counter.sequence_value;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});


module.exports = mongoose.model('Reserva', ReservaSchema);
