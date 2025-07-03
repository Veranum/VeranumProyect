// src/components/admin/UserReservationsModal.jsx
import React from 'react';
import styles from './ReservaModal.module.css';

const UserReservationsModal = ({ show, onClose, user, reservations, loading }) => {
    if (!show) {
        return null;
    }

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('es-CL');

    return (
        <div className={styles.modalOverlay}>
            <div className={`${styles.modalContent} ${styles.largeModal}`}>
                <h2>Historial de Reservas de {user?.nombre}</h2>
                {loading ? (
                    <p>Cargando historial...</p>
                ) : reservations.length > 0 ? (
                    <div className={styles.tableContainerModal}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Nº Reserva</th>
                                    <th>Habitación (Nº)</th>
                                    <th>Check-in</th>
                                    <th>Check-out</th>
                                    <th>Costo</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.map(reserva => (
                                    <tr key={reserva._id}>
                                        <td>{reserva.numeroReserva}</td>
                                        {/* --- CAMBIO: Ahora muestra el ID de la habitación --- */}
                                        <td>{reserva.habitacion_id}</td>
                                        <td>{formatDate(reserva.fecha_inicio)}</td>
                                        <td>{formatDate(reserva.fecha_fin)}</td>
                                        <td>${new Intl.NumberFormat('es-CL').format(reserva.precio_final)}</td>
                                        <td>
                                            <span className={`${styles.status} ${styles[`status_${reserva.estado?.toLowerCase()}`]}`}>
                                                {reserva.estado}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>Este usuario no tiene reservas en su historial.</p>
                )}
                <div className={styles.buttonGroup}>
                    <button type="button" onClick={onClose}>Cerrar</button>
                </div>
            </div>
        </div>
    );
};

export default UserReservationsModal;