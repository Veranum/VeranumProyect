// src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
// CORRECCIÓN: La ruta correcta desde la carpeta 'middleware' es subir un nivel a 'src'
// y luego bajar a 'modules/usuarios/usuarios.model'
const Usuario = require('../modules/usuarios/usuarios.model');

// Proteger rutas verificando el token
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'No autorizado para acceder a esta ruta. Token no proporcionado.' });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Adjuntar el usuario al objeto de la petición (req)
    req.user = await Usuario.findById(decoded.id);
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'No autorizado. El token no es válido.' });
  }
};

// Autorizar acceso basado en el rol del usuario
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ success: false, message: `El rol de usuario '${req.user.rol}' no está autorizado para realizar esta acción.` });
    }
    next();
  };
};
