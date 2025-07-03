// src/components/admin/HotelModal.jsx
import React, { useState, useEffect } from 'react';
import styles from './ReservaModal.module.css'; // Reutilizamos los estilos

const HotelModal = ({ show, onClose, onSave, hotel }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        direccion: '',
        ciudad: '',
        pais: '',
        servicios_extras: ''
    });

    useEffect(() => {
        if (show) {
            if (hotel) {
                // Modo Edición: Llenar el formulario con los datos del hotel existente
                setFormData({
                    nombre: hotel.nombre || '',
                    direccion: hotel.ubicacion?.direccion || '',
                    ciudad: hotel.ubicacion?.ciudad || '',
                    pais: hotel.ubicacion?.pais || '',
                    servicios_extras: hotel.servicios_extras?.join(', ') || ''
                });
            } else {
                // Modo Creación: Resetear el formulario
                setFormData({ nombre: '', direccion: '', ciudad: '', pais: '', servicios_extras: '' });
            }
        }
    }, [hotel, show]);

    if (!show) {
        return null;
    }

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Preparamos los datos con la estructura correcta que espera el backend
        const dataToSave = {
            nombre: formData.nombre,
            ubicacion: {
                direccion: formData.direccion,
                ciudad: formData.ciudad,
                pais: formData.pais
            },
            servicios_extras: formData.servicios_extras.split(',').map(s => s.trim()).filter(Boolean)
        };
        onSave(dataToSave);
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>{hotel ? 'Editar Hotel' : 'Crear Nuevo Hotel'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label>Nombre del Hotel</label>
                        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Dirección</label>
                        <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Ciudad</label>
                        <input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>País</label>
                        <input type="text" name="pais" value={formData.pais} onChange={handleChange} required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Servicios Extras (separados por coma)</label>
                        <input type="text" name="servicios_extras" value={formData.servicios_extras} onChange={handleChange} placeholder="Piscina, Gimnasio, Spa..." />
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>Cancelar</button>
                        <button type="submit">Guardar Hotel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HotelModal;