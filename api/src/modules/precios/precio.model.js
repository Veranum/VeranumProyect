// src/modules/precios/precio.model.js
const mongoose = require('mongoose');

const PrecioSchema = new mongoose.Schema({
    habitacion_id: {
        type: Number,
        ref: 'Habitacion',
        required: true
    },
    valor: {
        type: Number,
        required: true
    },
    fecha_vigencia: {
        type: Date,
        required: true,
        default: Date.now
    }
}, { timestamps: true, collection: 'precios' }); // Especificamos el nombre de la colección

module.exports = mongoose.model('Precio', PrecioSchema);