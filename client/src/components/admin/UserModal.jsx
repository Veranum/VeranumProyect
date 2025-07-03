// src/components/admin/UserModal.jsx
import React, { useState, useEffect } from 'react';
import styles from './ReservaModal.module.css';

const UserModal = ({ show, onClose, onSave, user }) => {
    const [formData, setFormData] = useState({
        _id: '',
        nombre: '',
        email: '',
        password: '',
        rol: 'cliente',
    });

    useEffect(() => {
        if (show && user) {
            // Modo Edición: Llenar el formulario con los datos del usuario existente
            setFormData({
                _id: user._id || '',
                nombre: user.nombre || '',
                email: user.email || '',
                password: '', // La contraseña se deja en blanco por seguridad al editar
                rol: user.rol || 'cliente',
            });
        } else {
            // Modo Creación: Resetear el formulario
            setFormData({ _id: '', nombre: '', email: '', password: '', rol: 'cliente' });
        }
    }, [user, show]);

    if (!show) return null;

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSave = { ...formData };
        // Si no se ingresó una nueva contraseña al editar, la eliminamos para no enviarla vacía
        if (user && !dataToSave.password) {
            delete dataToSave.password;
        }
        onSave(dataToSave);
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={`${styles.modalContent} ${styles.smallModal}`}>
                <h2>{user ? `Editar Usuario: ${user.nombre}` : 'Crear Nuevo Usuario'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label>RUN (ID de Usuario)</label>
                        {/* El RUN no se puede editar */}
                        <input type="text" name="_id" value={formData._id} onChange={handleChange} required disabled={!!user} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Nombre Completo</label>
                        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                    </div>
                     <div className={styles.inputGroup}>
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                     <div className={styles.inputGroup}>
                        <label>Contraseña {user ? '(Dejar en blanco para no cambiar)' : ''}</label>
                        {/* La contraseña solo es requerida al crear un nuevo usuario */}
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required={!user} minLength="6" placeholder={user ? 'Nueva contraseña' : ''} />
                    </div>
                     <div className={styles.inputGroup}>
                        <label>Rol</label>
                        <select name="rol" value={formData.rol} onChange={handleChange}>
                            <option value="cliente">Cliente</option>
                            <option value="gerente">Gerente</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className={styles.buttonGroup}>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>Cancelar</button>
                        <button type="submit">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;