// src/components/admin/ServicioModal.jsx
import React, { useState, useEffect } from 'react';
import styles from './ReservaModal.module.css';

const ServicioModal = ({ show, onClose, onSave, servicio }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio_diario: ''
    });

    useEffect(() => {
        if (show) {
            if (servicio) {
                setFormData({
                    nombre: servicio.nombre || '',
                    descripcion: servicio.descripcion || '',
                    precio_diario: servicio.precio_diario || ''
                });
            } else {
                setFormData({ nombre: '', descripcion: '', precio_diario: '' });
            }
        }
    }, [servicio, show]);

    if (!show) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, precio_diario: parseFloat(formData.precio_diario) });
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>{servicio ? 'Editar Servicio' : 'Crear Nuevo Servicio'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label>Nombre del Servicio</label>
                        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Descripción</label>
                        <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="4" required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Precio Diario</label>
                        <input type="number" name="precio_diario" value={formData.precio_diario} onChange={handleChange} required min="0" />
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>Cancelar</button>
                        <button type="submit">Guardar Servicio</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServicioModal;