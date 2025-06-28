// src/server.js

// LA LÍNEA MÁS IMPORTANTE:
// Esto carga las variables de .env en process.env.
// DEBE ESTAR EN LA PRIMERA LÍNEA.
require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/database');

// Ahora sí podemos usar la variable de entorno
const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Servidor de la API corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error.message);
    process.exit(1);
  }
};

startServer();
