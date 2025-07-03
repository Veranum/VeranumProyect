// src/components/admin/HabitacionModal.jsx
import React, { useState, useEffect } from 'react';
import styles from './ReservaModal.module.css';

const HabitacionModal = ({ show, onClose, onSave, habitacion, hoteles, defaultHotelId }) => {
    const [formData, setFormData] = useState({
        hotel_id: '',
        nombre: '',
        descripcion: '',
        categoria: 'individual',
        capacidad: '1',
        piso: '1',
        precio: '',
        servicios: ''
    });

    useEffect(() => {
        if (show) {
            if (habitacion) {
                // Modo Edición
                setFormData({
                    hotel_id: habitacion.hotel_id || '',
                    nombre: habitacion.nombre || '',
                    descripcion: habitacion.descripcion || '',
                    categoria: habitacion.categoria || 'individual',
                    capacidad: habitacion.capacidad?.toString() || '1',
                    piso: habitacion.piso?.toString() || '1',
                    precio: habitacion.precio || '',
                    servicios: habitacion.servicios ? habitacion.servicios.join(', ') : ''
                });
            } else {
                // Modo Creación
                setFormData({
                    hotel_id: defaultHotelId || (hoteles && hoteles.length > 0 ? hoteles[0]._id : ''),
                    nombre: '',
                    descripcion: '',
                    categoria: 'individual',
                    capacidad: '1',
                    piso: '1',
                    precio: '',
                    servicios: ''
                });
            }
        }
    }, [habitacion, show, hoteles, defaultHotelId]);

    if (!show) {
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.hotel_id) {
            alert('Error: Debe seleccionar un hotel de pertenencia antes de guardar.');
            return;
        }

        // Se preparan los datos con los tipos correctos
        const dataToSave = {
            hotel_id: formData.hotel_id,
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            categoria: formData.categoria,
            capacidad: parseInt(formData.capacidad, 10),
            piso: parseInt(formData.piso, 10),
            precio: parseFloat(formData.precio),
            servicios: formData.servicios.split(',').map(s => s.trim()).filter(Boolean)
        };
        
        // --- CORRECCIÓN: Se envía el objeto 'dataToSave' con los tipos correctos ---
        onSave(dataToSave);
    };

    const isSaveDisabled = !formData.hotel_id || !formData.precio;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>{habitacion ? `Editar Habitación Nº ${habitacion._id}` : 'Crear Nueva Habitación'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label>Hotel de Pertenencia</label>
                        <select name="hotel_id" value={formData.hotel_id} onChange={handleChange} required>
                            {hoteles?.map(hotel => (
                                <option key={hotel._id} value={hotel._id}>{hotel.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Nombre</label>
                        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Descripción</label>
                        <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="4" required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Categoría</label>
                        <select name="categoria" value={formData.categoria} onChange={handleChange}>
                            <option value="individual">Individual</option>
                            <option value="doble">Doble</option>
                            <option value="matrimonial">Matrimonial</option>
                        </select>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Capacidad (personas)</label>
                        <select name="capacidad" value={formData.capacidad} onChange={handleChange} required>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Piso</label>
                        <select name="piso" value={formData.piso} onChange={handleChange} required>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Precio por Noche</label>
                        <input type="number" name="precio" value={formData.precio} onChange={handleChange} required min="0" />
                        {habitacion && <small>Si cambia el precio, se creará un nuevo registro histórico.</small>}
                    </div>
                     <div className={styles.inputGroup}>
                        <label>Servicios (separados por coma)</label>
                        <input type="text" name="servicios" value={formData.servicios} onChange={handleChange} placeholder="WiFi, TV Cable, etc." />
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>Cancelar</button>
                        <button type="submit" disabled={isSaveDisabled}>Guardar Habitación</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HabitacionModal;