import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { getMisReservas, cancelarReserva } from '../services/reservasService';
import styles from './MisReservasPage.module.css';
import { Link } from 'react-router-dom';
import ConfirmationModal from '../components/common/ConfirmationModal';
import Notification from '../components/common/Notification';

// --- Iconos ---
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const HotelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const BedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h20v11H2z"></path><path d="M2 14v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5"></path><path d="M6 11V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"></path></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2z"></path></svg>;

const MisReservasPage = () => {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);

    // --- ESTADO PARA MODALES Y NOTIFICACIONES ---
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [reservaToCancel, setReservaToCancel] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        const fetchReservas = async () => {
            if (!user) return;
            try {
                const response = await getMisReservas();
                const sortedReservas = response.data.sort((a, b) => new Date(b.fecha_inicio) - new Date(a.fecha_inicio));
                setReservas(sortedReservas);
            } catch (err) {
                setError('No se pudieron cargar tus reservas. Por favor, inténtalo de nuevo más tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchReservas();
    }, [user]);

    const handleCancelClick = (reserva) => {
        setReservaToCancel(reserva);
        setShowCancelModal(true);
    };

    const confirmCancel = async () => {
        if (!reservaToCancel) return;
        try {
            await cancelarReserva(reservaToCancel._id);
            setReservas(prevReservas =>
                prevReservas.map(r =>
                    r._id === reservaToCancel._id ? { ...r, estado: 'Cancelado' } : r
                )
            );
            setNotification({ show: true, message: 'Reserva cancelada con éxito.', type: 'success' });
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Error al cancelar la reserva.';
            setNotification({ show: true, message: errorMessage, type: 'error' });
        } finally {
            setShowCancelModal(false);
            setReservaToCancel(null);
        }
    };

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const renderContent = () => {
        if (loading) return <p className={styles.centeredMessage}>Cargando tus reservas...</p>;
        if (error) return <p className={`${styles.centeredMessage} ${styles.errorMessage}`}>{error}</p>;
        
        if (reservas.length === 0) {
            return (
                <div className={styles.noReservas}>
                    <h3>No tienes reservas aún</h3>
                    <p>Parece que todavía no has realizado ninguna reserva con nosotros.</p>
                    <Link to="/habitaciones" className={styles.exploreButton}>Explorar Habitaciones</Link>
                </div>
            );
        }

        return (
            <div className={styles.reservasGrid}>
                {reservas.map((reserva) => {
                    const isCancelable = reserva.estado === 'Confirmado' && new Date(reserva.fecha_inicio) > new Date();
                    return (
                        <div key={reserva._id} className={`${styles.reservaCard} card`}>
                            <div className={styles.cardHeader}>
                                <div className={styles.hotelInfo}>
                                    <HotelIcon />
                                    <h4>{reserva.hotel_id?.nombre || 'Hotel no especificado'}</h4>
                                </div>
                                <span className={`${styles.status} ${styles[`status_${reserva.estado?.toLowerCase()}`]}`}>
                                    {reserva.estado}
                                </span>
                            </div>
                            <div className={styles.cardBody}>
                                <div className={styles.roomInfo}>
                                    <BedIcon />
                                    <p>{reserva.habitacion_id?.nombre || 'Habitación no especificada'}</p>
                                </div>
                                <div className={styles.dateInfo}>
                                    <CalendarIcon />
                                    <p>{formatDate(reserva.fecha_inicio)}</p>
                                    <span>→</span>
                                    <p>{formatDate(reserva.fecha_fin)}</p>
                                </div>
                                {reserva.servicios_adicionales && reserva.servicios_adicionales.length > 0 && (
                                    <>
                                        <hr className={styles.serviceDivider} />
                                        <div className={styles.servicesInfo}>
                                            <SparklesIcon />
                                            <ul className={styles.servicesList}>
                                                {reserva.servicios_adicionales.map(servicio => (
                                                    <li key={servicio._id} className={styles.serviceItem}>{servicio.nombre}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className={styles.cardFooter}>
                                <span>Reserva N°{reserva.numeroReserva}</span>
                                <div className={styles.footerActions}>
                                    {isCancelable && (
                                        <button onClick={() => handleCancelClick(reserva)} className={styles.cancelButton}>
                                            Cancelar Reserva
                                        </button>
                                    )}
                                    <span className={styles.price}>
                                        Total: ${(reserva.precio_final || 0).toLocaleString('es-CL')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <>
            <Notification
                show={notification.show}
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ ...notification, show: false })}
            />
            <ConfirmationModal
                show={showCancelModal}
                title="Confirmar Cancelación"
                message="¿Estás seguro de que quieres cancelar esta reserva? Esta acción no se puede deshacer."
                onConfirm={confirmCancel}
                onCancel={() => setShowCancelModal(false)}
                confirmText="Sí, Cancelar"
                cancelText="No, Mantener"
            />
            <div className="container">
                <div className={styles.header}>
                    <h1>Mis Reservas</h1>
                    <p>Aquí puedes ver el historial completo de tus estadías con nosotros.</p>
                </div>
                {renderContent()}
            </div>
        </>
    );
};

export default MisReservasPage;