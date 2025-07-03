// src/modules/hoteles/hotel.model.js
const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del hotel es requerido.'],
        unique: true,
        trim: true
    },
    ubicacion: {
        direccion: { type: String, required: true },
        ciudad: { type: String, required: true },
        pais: { type: String, required: true }
    },
    servicios_extras: [String] // Ej: ["Piscina", "Gimnasio", "Spa"]
}, { timestamps: true });

module.exports = mongoose.model('Hotel', HotelSchema);