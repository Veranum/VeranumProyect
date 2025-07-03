// src/modules/servicios/servicio.model.js
const mongoose = require('mongoose');

const ServicioSchema = new mongoose.Schema({
    hotel_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    nombre: {
        type: String,
        required: [true, 'El nombre del servicio es requerido.'],
        trim: true
    },
    descripcion: {
        type: String,
        required: true,
    },
    // El precio es por día, como se indica en el caso de estudio
    precio_diario: {
        type: Number,
        required: true
    }
}, { timestamps: true, collection: 'servicios' });

module.exports = mongoose.model('Servicio', ServicioSchema);