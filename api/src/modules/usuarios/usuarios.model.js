// src/modules/usuarios/usuarios.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema({
  // --- CAMBIO: Se reemplaza el _id por defecto ---
  _id: {
    type: String,
    alias: 'run_cliente', // Podemos usar 'run_cliente' en el código para más claridad
    required: [true, 'El RUN del cliente es requerido.'],
    uppercase: true,
    trim: true,
    // Validación con Expresión Regular para el formato del RUN chileno
    validate: {
        validator: function(v) {
            return /^[0-9]{7,8}-[0-9K]$/.test(v);
        },
        message: props => `${props.value} no es un formato de RUN válido.`
    }
  },
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido.'],
  },
  email: {
    type: String,
    required: [true, 'El email es requerido.'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor, ingrese un email válido.',
    ],
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida.'],
    minlength: 6,
    select: false,
  },
  rol: {
    type: String,
    enum: ['cliente', 'gerente', 'admin'],
    default: 'cliente',
  },
}, { timestamps: true });

// Encriptar contraseña antes de guardar
UsuarioSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar contraseñas
UsuarioSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Usuario', UsuarioSchema);
