// src/components/admin/ReservaModal.jsx
import React, { useState, useEffect } from 'react';
import styles from './ReservaModal.module.css';

const ReservaModal = ({ show, onClose, onSave, reserva }) => {
    const [formData, setFormData] = useState({
        cliente_id: '',
        habitacion_id: '',
        fecha_inicio: '',
        fecha_fin: '',
        estado: 'Confirmado',
        precio_final: ''
    });

    useEffect(() => {
        if (reserva) {
            setFormData({
                cliente_id: reserva.cliente_id?._id || '',
                habitacion_id: reserva.habitacion_id?._id || '',
                fecha_inicio: new Date(reserva.fecha_inicio).toISOString().split('T')[0],
                fecha_fin: new Date(reserva.fecha_fin).toISOString().split('T')[0],
                estado: reserva.estado || 'Confirmado',
                precio_final: reserva.precio_final || ''
            });
        } else {
            setFormData({
                cliente_id: '',
                habitacion_id: '',
                fecha_inicio: '',
                fecha_fin: '',
                estado: 'Confirmado',
                precio_final: ''
            });
        }
    }, [reserva, show]);

    if (!show) {
        return null;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const renderFormContent = () => {
        if (reserva) {
            // --- MODO EDICIÓN ---
            return (
                <>
                    <div className={styles.infoGroup}>
                        <span>Cliente:</span>
                        <strong>{reserva.cliente_id?.nombre || 'N/A'}</strong>
                    </div>
                    <div className={styles.infoGroup}>
                        <span>Habitación:</span>
                        <strong>{reserva.habitacion_id?.nombre || 'N/A'}</strong>
                    </div>
                    <div className={styles.formGrid}>
                        <div className={styles.inputGroup}>
                            <label>Fecha de Check-in</label>
                            <input type="date" name="fecha_inicio" value={formData.fecha_inicio} onChange={handleChange} required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Fecha de Check-out</label>
                            <input type="date" name="fecha_fin" value={formData.fecha_fin} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Costo Total ($)</label>
                        <input type="number" name="precio_final" value={formData.precio_final} onChange={handleChange} required min="0"/>
                    </div>
                     <div className={styles.inputGroup}>
                        <label>Estado</label>
                        <select name="estado" value={formData.estado} onChange={handleChange}>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Confirmado">Confirmado</option>
                            <option value="Cancelado">Cancelado</option>
                        </select>
                    </div>
                </>
            );
        } else {
            // --- MODO CREACIÓN ---
            return (
                <>
                    <div className={styles.inputGroup}>
                        <label>ID del Cliente</label>
                        <input type="text" name="cliente_id" value={formData.cliente_id} onChange={handleChange} placeholder="ID del cliente registrado" required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>ID de la Habitación</label>
                        <input type="text" name="habitacion_id" value={formData.habitacion_id} onChange={handleChange} placeholder="ID de la habitación a reservar" required />
                    </div>
                    <div className={styles.formGrid}>
                        <div className={styles.inputGroup}>
                            <label>Fecha de Check-in</label>
                            <input type="date" name="fecha_inicio" value={formData.fecha_inicio} onChange={handleChange} required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Fecha de Check-out</label>
                            <input type="date" name="fecha_fin" value={formData.fecha_fin} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Estado</label>
                        <select name="estado" value={formData.estado} onChange={handleChange}>
                            <option value="Confirmado">Confirmado</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Cancelado">Cancelado</option>
                        </select>
                    </div>
                </>
            );
        }
    };


    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>{reserva ? `Editar Reserva Nº ${reserva.numeroReserva}` : 'Crear Nueva Reserva'}</h2>
                <form onSubmit={handleSubmit}>
                    {renderFormContent()}
                    <div className={styles.buttonGroup}>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>Cancelar</button>
                        <button type="submit">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReservaModal;
