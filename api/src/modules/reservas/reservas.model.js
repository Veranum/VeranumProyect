// src/modules/reservas/reservas.model.js
const mongoose = require('mongoose');
const Counter = require('../counters/counters.model');

const ReservaSchema = new mongoose.Schema({
  numeroReserva: { type: Number, unique: true },
  cliente_id: { type: String, ref: 'Usuario', required: true },
  habitacion_id: { type: Number, ref: 'Habitacion', required: true },
  hotel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  
  // --- NUEVO CAMPO PARA GUARDAR LOS SERVICIOS ---
  servicios_adicionales: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Servicio'
  }],
  
  fecha_inicio: { type: Date, required: true },
  fecha_fin: { type: Date, required: true },
  precio_final: { type: Number, required: true },
  estado: { type: String, enum: ['Pendiente', 'Confirmado', 'Cancelado'], default: 'Confirmado' }
}, { timestamps: true });

// El hook pre-save para el contador se mantiene sin cambios
ReservaSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'reservaId' },
                { $inc: { sequence_value: 1 } },
                { new: true, upsert: true }
            );
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