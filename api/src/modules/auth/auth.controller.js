// src/modules/auth/auth.controller.js
const Usuario = require('../usuarios/usuarios.model');
const jwt = require('jsonwebtoken');

// @desc    Registrar un nuevo usuario
exports.register = async (req, res, next) => {
    const { nombre, email, password, rol } = req.body;
    try {
        if (!nombre || !email || !password) {
            return res.status(400).json({ success: false, message: 'Por favor, complete todos los campos.' });
        }
        const usuario = await Usuario.create({ nombre, email, password, rol });
        sendTokenResponse(usuario, 201, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Iniciar sesión
exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Por favor, ingrese email y contraseña.' });
        }

        const usuario = await Usuario.findOne({ email }).select('+password');

        if (!usuario || !(await usuario.matchPassword(password))) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas.' });
        }

        sendTokenResponse(usuario, 200, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Obtener datos del usuario actual
exports.getMe = async (req, res, next) => {
    const usuario = await Usuario.findById(req.user.id);
    res.status(200).json({ success: true, data: usuario });
};


// --- Helper para generar y enviar token ---
const sendTokenResponse = (user, statusCode, res) => {
    // --- LA LÍNEA CLAVE DE LA SOLUCIÓN ---
    // Añadimos 'nombre: user.nombre' al contenido del token.
    const token = jwt.sign(
        { id: user._id, rol: user.rol, nombre: user.nombre }, // <-- CAMBIO AQUÍ
        process.env.JWT_SECRET, 
        { expiresIn: '30d' }
    );

    res.status(statusCode).json({
        success: true,
        token
    });
};
