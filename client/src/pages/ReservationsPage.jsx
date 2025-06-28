// src/pages/ReservationsPage.jsx
import React, { useState, useContext, useEffect } from 'react';
import { createReservation } from '../services/reservasService';
import AuthContext from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import DateRangePicker from '../components/reservations/DateRangePicker';
import styles from './ReservationsPage.module.css';

const ReservationsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Leemos la habitación preseleccionada que viene desde la página anterior
    const preselectedRoom = location.state?.preselectedRoom;

    const [fechas, setFechas] = useState({ inicio: '', fin: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);

    // Si un usuario llega a esta página sin haber seleccionado una habitación,
    // lo redirigimos de vuelta a la página de habitaciones.
    useEffect(() => {
        if (!preselectedRoom) {
            navigate('/habitaciones');
        }
    }, [preselectedRoom, navigate]);

    const handleConfirm = async () => {
        if (!user) {
            // Si el usuario no está logueado, lo mandamos a iniciar sesión
            // y guardamos esta página para que pueda volver después.
            navigate('/login', { state: { from: location } });
            return;
        }
        if (!fechas.inicio || !fechas.fin) {
            setError('Por favor, selecciona las fechas de tu estadía.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const reservationData = {
                habitacion_id: preselectedRoom._id,
                fecha_inicio: fechas.inicio,
                fecha_fin: fechas.fin,
                estado: 'Confirmado' // Las reservas de clientes siempre entran como confirmadas
            };
            await createReservation(reservationData);
            // Mostramos un mensaje de éxito y lo enviamos al inicio
            alert('¡Reserva Exitosa! Hemos enviado una confirmación a tu correo.');
            navigate('/');
        } catch (err) {
            if (err.response && err.response.status === 409) {
                setError(err.response.data.message);
            } else {
                setError('No se pudo procesar la reserva en este momento. Intente más tarde.');
            }
        }
        setLoading(false);
    };

    // Calculamos los días y el total solo si tenemos todos los datos
    const diasEstadia = fechas.inicio && fechas.fin ? 
        Math.max(1, (new Date(fechas.fin) - new Date(fechas.inicio)) / (1000 * 60 * 60 * 24))
        : 0;
    const precioTotal = diasEstadia * (preselectedRoom?.precio_noche || 0);

    // Si no hay habitación, no renderizamos nada hasta que la redirección ocurra
    if (!preselectedRoom) {
        return <div className="container"><p>Redirigiendo...</p></div>;
    }

    return (
        <div className="container">
            <div className={styles.reservationWrapper}>
                {/* Columna Izquierda: Resumen de la Habitación */}
                <div className={styles.roomSummary}>
                    <img src={`https://placehold.co/600x400/005f73/FFF?text=${preselectedRoom.nombre.replace(' ', '+')}`} alt={preselectedRoom.nombre} />
                    <h2>{preselectedRoom.nombre}</h2>
                    <p>{preselectedRoom.descripcion}</p>
                </div>
                {/* Columna Derecha: Formulario de Reserva */}
                <div className={styles.bookingForm}>
                    <h3>Completa tu reserva</h3>
                    <p className={styles.formSubtitle}>Selecciona las fechas de tu estadía.</p>
                    
                    <DateRangePicker fechas={fechas} onDateChange={setFechas} />
                    
                    {error && <p className={styles.errorMessage}>{error}</p>}
                    
                    {fechas.inicio && fechas.fin && (
                        <div className={styles.summary}>
                            <div className={styles.summaryLine}>
                                <span>Duración:</span>
                                <strong>{diasEstadia} {diasEstadia > 1 ? 'noches' : 'noche'}</strong>
                            </div>
                            <div className={styles.summaryLine_total}>
                                <span>Total a Pagar:</span>
                                <strong>${precioTotal.toLocaleString('es-CL')}</strong>
                            </div>
                        </div>
                    )}

                    <div className={styles.buttonContainer}>
                        <button onClick={handleConfirm} disabled={loading || !fechas.inicio || !fechas.fin}>
                            {loading ? 'Confirmando...' : 'Confirmar y Reservar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservationsPage;
