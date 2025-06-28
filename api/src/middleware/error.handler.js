// src/middleware/error.handler.js
const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log del error en consola para debugging
  
    let error = { ...err };
    error.message = err.message;
    
    // Error de clave duplicada en Mongoose
    if (err.code === 11000) {
      const message = 'Valor de campo duplicado ingresado.';
      error = { statusCode: 400, message };
    }
  
    // Error de validación de Mongoose
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(val => val.message).join(', ');
      error = { statusCode: 400, message };
    }
  
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Error del Servidor',
    });
  };
  
  module.exports = errorHandler;