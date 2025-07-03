// src/modules/usuarios/usuarios.controller.js
const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');

// @desc    Obtener todos los usuarios (para Admin)
exports.getAllUsersAdmin = async (req, res, next) => {
    try {
        const usuarios = await Usuario.aggregate([
            { $lookup: { from: 'reservas', localField: '_id', foreignField: 'cliente_id', as: 'reservasInfo' } },
            { $project: { _id: 1, nombre: 1, email: 1, rol: 1, createdAt: 1, numeroDeReservas: { $size: '$reservasInfo' } } }
        ]);
        res.status(200).json({ success: true, count: usuarios.length, data: usuarios });
    } catch (error) { next(error); }
};

// @desc    Crear un nuevo usuario (para Admin)
exports.createUserAdmin = async (req, res, next) => {
    const { _id, nombre, email, password, rol } = req.body;
    try {
        const userExists = await Usuario.findOne({ $or: [{ _id }, { email }] });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'El RUN o el email ya están registrados.' });
        }
        const user = await Usuario.create({ _id, nombre, email, password, rol });
        res.status(201).json({ success: true, data: user });
    } catch (error) { next(error); }
};

// --- NUEVA FUNCIÓN PARA ACTUALIZAR ---
// @desc    Actualizar un usuario (para Admin)
exports.updateUserAdmin = async (req, res, next) => {
    const { nombre, email, rol, password } = req.body;
    try {
        const user = await Usuario.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        user.nombre = nombre || user.nombre;
        user.email = email || user.email;
        user.rol = rol || user.rol;

        // Solo actualizar la contraseña si se proporciona una nueva
        if (password && password.length > 0) {
            user.password = password;
        }

        const updatedUser = await user.save();
        res.status(200).json({ success: true, data: updatedUser });

    } catch (error) {
        next(error);
    }
};

// --- NUEVA FUNCIÓN PARA ELIMINAR ---
// @desc    Eliminar un usuario (para Admin)
exports.deleteUserAdmin = async (req, res, next) => {
    try {
        const user = await Usuario.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        // Opcional: Aquí se podría añadir lógica para manejar las reservas del usuario eliminado
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};