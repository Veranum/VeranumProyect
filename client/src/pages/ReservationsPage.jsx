import React, { useState, useEffect, useContext } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import styles from './ReservarPage.module.css';
import { createReservation } from '../services/reservasService';
import AuthContext from '../context/AuthContext';
import { getServiciosByHotelAdmin } from '../services/adminService'; 
import Notification from '../components/common/Notification';

const getRoomImageUrl = (roomName) => {
    const name = roomName ? roomName.toLowerCase() : '';
    if (name.includes('doble')) return 'https://images-new.pxsol.com/0yXQIHHgg6QPIqHMdt5cFppRjSdRImPYVZKA8Zjp0F0/rs:fill:600:400:1/q:80/plain/https://files-public-web.s3-us-west-2.amazonaws.com/1217/company/library/user/209394497137de94aa9d4ab3e8a7f395b32600345c1.jpeg@jpeg';
    if (name.includes('individual')) return 'https://www.abbahoteles.com/idb/72372/hotel_balmoral_individual-600x400.jpg';
    if (name.includes('matrimonial')) return 'https://www.hotelterrano.cl/wp-content/uploads/2021/10/suite-1.jpg';
    return `https://placehold.co/600x400/005f73/ffffff?text=${(roomName || '').replace(' ', '+')}`;
};

const ReservationsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { preselectedRoom } = location.state || {};

    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [noches, setNoches] = useState(0);
    const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
    const [serviciosSeleccionados, setServiciosSeleccionados] = useState(new Set());
    const [costoAlojamiento, setCostoAlojamiento] = useState(0);
    const [costoServicios, setCostoServicios] = useState(0);
    const [costoTotal, setCostoTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        if (preselectedRoom?.hotel_id) {
            getServiciosByHotelAdmin(preselectedRoom.hotel_id)
                .then(response => {
                    if (response.data) {
                        setServiciosDisponibles(response.data);
                    }
                })
                .catch(err => {
                    console.error("Error al cargar servicios adicionales:", err);
                });
        }
    }, [preselectedRoom]);

    useEffect(() => {
        if (checkIn && checkOut) {
            const date1 = new Date(checkIn);
            const date2 = new Date(checkOut);
            if (date2 > date1) {
                const diffTime = Math.abs(date2 - date1);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                setNoches(diffDays);
                setCostoAlojamiento(diffDays * (preselectedRoom?.precio || 0));
                return;
            }
        }
        setNoches(0);
        setCostoAlojamiento(0);
    }, [checkIn, checkOut, preselectedRoom]);
    
    useEffect(() => {
        let totalDiarioServicios = 0;
        serviciosSeleccionados.forEach(servicioId => {
            const servicio = serviciosDisponibles.find(s => s._id === servicioId);
            if (servicio) {
                totalDiarioServicios += servicio.precio_diario;
            }
        });
        setCostoServicios(totalDiarioServicios * noches);
    }, [serviciosSeleccionados, noches, serviciosDisponibles]);

    useEffect(() => {
        setCostoTotal(costoAlojamiento + costoServicios);
    }, [costoAlojamiento, costoServicios]);

    const handleServicioChange = (id) => {
        const nuevosServicios = new Set(serviciosSeleccionados);
        nuevosServicios.has(id) ? nuevosServicios.delete(id) : nuevosServicios.add(id);
        setServiciosSeleccionados(nuevosServicios);
    };

    const handleConfirm = async () => {
        if (!user) {
            navigate('/login', { state: { from: location } });
            return;
        }
        if (noches <= 0) {
            setError('Por favor, selecciona fechas válidas.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const reservationData = {
                habitacion_id: preselectedRoom._id,
                fecha_inicio: checkIn,
                fecha_fin: checkOut,
                estado: 'Confirmado',
                servicios_adicionales: Array.from(serviciosSeleccionados),
            };
            await createReservation(reservationData);
            setNotification({ show: true, message: '¡Su reserva se ha realizado con éxito!', type: 'success' });
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'No se pudo completar la reserva.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    const getMinCheckOutDate = () => {
        if (!checkIn) return new Date().toISOString().split('T')[0];
        const checkInDate = new Date(checkIn);
        checkInDate.setDate(checkInDate.getDate() + 1);
        return checkInDate.toISOString().split('T')[0];
    };

    const handleCheckInChange = (e) => {
        const newCheckIn = e.target.value;
        setCheckIn(newCheckIn);
        if (checkOut && new Date(checkOut) <= new Date(newCheckIn)) {
            setCheckOut('');
        }
    };

    if (!preselectedRoom) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
                <h1>Error</h1>
                <p>No se ha seleccionado ninguna habitación. Por favor, <Link to="/habitaciones">vuelve a la página de habitaciones</Link>.</p>
            </div>
        );
    }
    
    const roomImage = getRoomImageUrl(preselectedRoom.nombre);

    return (
        <>
            {/* --- AQUÍ VA EL COMPONENTE DE NOTIFICACIÓN --- */}
            <Notification 
                show={notification.show} 
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ show: false, message: '', type: '' })}
            />

            <div className={`container ${styles.bookingPageLayout}`}>
                <div className={styles.roomInfoColumn}>
                    <img src={roomImage} alt={preselectedRoom.nombre} className={styles.roomImage} />
                    <div className={styles.roomDetails}>
                        <h1>{preselectedRoom.nombre}</h1>
                        <p className={styles.roomDescription}>{preselectedRoom.descripcion}</p>
                        <div className={styles.roomCapacity}>
                            <span>{preselectedRoom.capacidad} personas</span>
                        </div>
                    </div>
                </div>

                <div className={styles.bookingFormColumn}>
                    <div className={styles.bookingCard}>
                        <h2>Completa tu reserva</h2>
                        <div className={styles.datePickerGroup}>
                            <div className={styles.dateInput}>
                                <label htmlFor="checkin">Check-in</label>
                                <input type="date" id="checkin" value={checkIn} onChange={handleCheckInChange} min={new Date().toISOString().split('T')[0]}/>
                            </div>
                            <div className={styles.arrow}>→</div>
                            <div className={styles.dateInput}>
                                <label htmlFor="checkout">Check-out</label>
                                <input type="date" id="checkout" value={checkOut} onChange={e => setCheckOut(e.target.value)} min={getMinCheckOutDate()} disabled={!checkIn} />
                            </div>
                        </div>

                        <div className={styles.servicesSection}>
                            <h3>Mejora tu estadía <span className={styles.costoPorDia}>(costo por día)</span></h3>
                            <div className={styles.servicesList}>
                                {serviciosDisponibles.map(servicio => (
                                    <label key={servicio._id} className={styles.serviceItem}>
                                        <input type="checkbox" checked={serviciosSeleccionados.has(servicio._id)} onChange={() => handleServicioChange(servicio._id)} />
                                        <span>{servicio.nombre}</span>
                                        <span className={styles.servicePrice}>+${(servicio.precio_diario || 0).toLocaleString('es-CL')}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {noches > 0 && (
                         <div className={`${styles.bookingCard} ${styles.priceSummary}`}>
                            <h3>Resumen de tu estadía</h3>
                            <div className={styles.priceRow}>
                                <span>${(preselectedRoom?.precio || 0).toLocaleString('es-CL')} x {noches} noches</span>
                                <span>${costoAlojamiento.toLocaleString('es-CL')}</span>
                            </div>
                            {costoServicios > 0 && (
                                <div className={styles.priceRow}>
                                    <span>Servicios adicionales</span>
                                    <span>${costoServicios.toLocaleString('es-CL')}</span>
                                </div>
                            )}
                            <hr className={styles.divider} />
                            <div className={`${styles.priceRow} ${styles.totalRow}`}>
                                <span>Total</span>
                                <span>${costoTotal.toLocaleString('es-CL')}</span>
                            </div>
                        </div>
                    )}
                    
                    {error && <p className={styles.errorMessage}>{error}</p>}

                    <div className={styles.buttonContainer}>
                        <button onClick={handleConfirm} disabled={loading || noches <= 0} className={styles.confirmButton}>
                            {loading ? 'Procesando...' : 'Confirmar y Reservar'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReservationsPage;