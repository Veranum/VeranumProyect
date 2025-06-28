// src/config/index.js
// Este archivo se usaría para exportar de manera centralizada
// las variables de entorno si el proyecto crece en complejidad.

// Por ahora, el uso de process.env es suficiente para el MVP.
// Ejemplo de cómo se podría usar:

require('dotenv').config();

module.exports = {
  port: process.env.PORT,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
};