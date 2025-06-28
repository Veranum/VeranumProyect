// src/components/admin/HabitacionModal.jsx
import React, { useState, useEffect } from 'react';
import styles from './ReservaModal.module.css'; // Reutilizamos estilos

const HabitacionModal = ({ show, onClose, onSave, habitacion }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        categoria: 'individual',
        capacidad: '1', // Valor por defecto
        piso: '1',      // Valor por defecto
        precio_noche: '',
        servicios: ''
    });

    useEffect(() => {
        if (habitacion) {
            setFormData({
                nombre: habitacion.nombre || '',
                descripcion: habitacion.descripcion || '',
                categoria: habitacion.categoria || 'individual',
                capacidad: habitacion.capacidad || '1',
                piso: habitacion.piso || '1',
                precio_noche: habitacion.precio_noche || '',
                servicios: habitacion.servicios ? habitacion.servicios.join(', ') : ''
            });
        } else {
            setFormData({
                nombre: '',
                descripcion: '',
                categoria: 'individual',
                capacidad: '1',
                piso: '1',
                precio_noche: '',
                servicios: ''
            });
        }
    }, [habitacion, show]);


    if (!show) {
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            servicios: formData.servicios.split(',').map(s => s.trim()).filter(s => s)
        };
        onSave(dataToSave);
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={`${styles.modalContent} ${styles.smallModal}`}>
                <h2>{habitacion ? 'Editar Habitación' : 'Crear Nueva Habitación'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label>Nombre</label>
                        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Descripción</label>
                        <textarea 
                            name="descripcion" 
                            value={formData.descripcion} 
                            onChange={handleChange} 
                            rows="4" 
                            required 
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Categoría</label>
                        <select name="categoria" value={formData.categoria} onChange={handleChange}>
                            <option value="individual">Individual</option>
                            <option value="doble">Doble</option>
                            <option value="matrimonial">Matrimonial</option>
                        </select>
                    </div>

                    {/* --- CAMBIO A SELECT PARA CAPACIDAD --- */}
                    <div className={styles.inputGroup}>
                        <label>Capacidad (personas)</label>
                        <select name="capacidad" value={formData.capacidad} onChange={handleChange} required>
                            <option value="1">1 persona</option>
                            <option value="2">2 personas</option>
                            <option value="3">3 personas</option>
                            <option value="4">4 personas</option>
                        </select>
                    </div>

                    {/* --- CAMBIO A SELECT PARA PISO --- */}
                    <div className={styles.inputGroup}>
                        <label>Piso</label>
                        <select name="piso" value={formData.piso} onChange={handleChange} required>
                            <option value="1">Piso 1</option>
                            <option value="2">Piso 2</option>
                            <option value="3">Piso 3</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Precio por Noche</label>
                        <input type="number" name="precio_noche" value={formData.precio_noche} onChange={handleChange} required min="0" />
                    </div>
                     <div className={styles.inputGroup}>
                        <label>Servicios (separados por coma)</label>
                        <input type="text" name="servicios" value={formData.servicios} onChange={handleChange} placeholder="WiFi, TV Cable, etc." />
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>Cancelar</button>
                        <button type="submit">Guardar Habitación</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HabitacionModal;
