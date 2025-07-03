// src/pages/ManageHabitacionesPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
    getAllHotelesAdmin, 
    getHabitacionesByHotel, 
    getReservas,
    createHabitacion, 
    updateHabitacion, 
    deleteHabitacion,
    setNuevoPrecioHabitacion
} from '../services/adminService';
import HabitacionModal from '../components/admin/HabitacionModal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import Notification from '../components/common/Notification';
import styles from './ManageReservasPage.module.css';

const ManageHabitacionesPage = () => {
    const [hoteles, setHoteles] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState('');
    const [habitaciones, setHabitaciones] = useState([]);
    const [filteredHabitaciones, setFilteredHabitaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHabitacion, setEditingHabitacion] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingHabitacion, setDeletingHabitacion] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    const [searchTerm, setSearchTerm] = useState('');
    const [availabilityFilter, setAvailabilityFilter] = useState('all');
    const [priceSort, setPriceSort] = useState('none');

    useEffect(() => {
        if (notification.show) {
            const timer = setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const fetchHotelData = useCallback(async (hotelId) => {
        const idToFetch = hotelId || '';
        setLoading(true);
        try {
            const [habitacionesRes, reservasRes] = await Promise.all([
                getHabitacionesByHotel(idToFetch),
                getReservas()
            ]);
            
            const hoy = new Date();
            const inicioDeHoy = new Date();
            inicioDeHoy.setHours(0, 0, 0, 0);

            const habitacionesConDatos = habitacionesRes.data.map(hab => {
                const reservasParaHabitacion = reservasRes.data.filter(res =>
                    res.habitacion_id?._id === hab._id && res.estado === 'Confirmado' && new Date(res.fecha_fin) > inicioDeHoy
                ).sort((a, b) => new Date(a.fecha_inicio) - new Date(b.fecha_inicio));

                let reservaRelevante = null;
                let estadoCalculado = 'Disponible';
                let estaOcupadaHoy = false; // Para el filtro de disponibilidad

                if (reservasParaHabitacion.length > 0) {
                    // La reserva más relevante es la próxima en el tiempo
                    reservaRelevante = reservasParaHabitacion[0];
                    // --- CAMBIO EN LA LÓGICA DE ESTADO ---
                    // Ahora, cualquier habitación con una reserva activa o futura se marca como "Reservada"
                    estadoCalculado = 'Reservada'; 
                    
                    // Verificamos si está ocupada hoy para el filtro y la lógica interna
                    const reservaActivaHoy = reservasParaHabitacion.find(res => new Date(res.fecha_inicio) <= hoy && new Date(res.fecha_fin) > hoy);
                    if (reservaActivaHoy) {
                        estaOcupadaHoy = true;
                    }
                }
                
                return { 
                    ...hab, 
                    estadoCalculado, 
                    // Mantenemos la lógica de 'disponible' internamente para el filtro de "No Disponible"
                    disponible: !estaOcupadaHoy,
                    clienteActualRUN: reservaRelevante?.cliente_id?._id || null 
                };
            });

            setHabitaciones(habitacionesConDatos);
            setError('');
        } catch (err) {
            setError('No se pudieron cargar los datos de las habitaciones.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const fetchHoteles = async () => {
            try {
                const response = await getAllHotelesAdmin();
                setHoteles(response.data);
            } catch (err) {
                setError('No se pudieron cargar los hoteles.');
            }
        };
        fetchHoteles();
    }, []);
    
    useEffect(() => {
        fetchHotelData(selectedHotel);
    }, [selectedHotel, fetchHotelData]);

    useEffect(() => {
        let result = [...habitaciones];
        if (searchTerm) {
            const lowercasedTerm = searchTerm.toLowerCase();
            result = result.filter(h => h.nombre.toLowerCase().includes(lowercasedTerm) || h._id.toString().includes(lowercasedTerm));
        }
        // --- CAMBIO EN LÓGICA DE FILTRO ---
        if (availabilityFilter !== 'all') {
            if (availabilityFilter === 'Disponible') {
                result = result.filter(h => h.estadoCalculado === 'Disponible');
            } else if (availabilityFilter === 'Reservada') {
                result = result.filter(h => h.estadoCalculado === 'Reservada');
            } else if (availabilityFilter === 'No Disponible') {
                // 'No disponible' se basa en la propiedad booleana 'disponible'
                result = result.filter(h => !h.disponible);
            }
        }
        if (priceSort !== 'none') {
            result.sort((a, b) => priceSort === 'desc' ? b.precio - a.precio : a.precio - b.precio);
        }
        setFilteredHabitaciones(result);
    }, [habitaciones, searchTerm, availabilityFilter, priceSort]);

    const handleOpenModal = (habitacion = null) => {
        setEditingHabitacion(habitacion);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingHabitacion(null);
        setIsModalOpen(false);
    };

    const handleSaveHabitacion = async (formData) => {
        try {
            const { precio, ...detallesHabitacion } = formData;
            const numericPrice = parseFloat(precio);

            if (editingHabitacion) {
                await updateHabitacion(editingHabitacion._id, detallesHabitacion);
                if (numericPrice && numericPrice !== editingHabitacion.precio) {
                    await setNuevoPrecioHabitacion({ 
                        habitacion_id: editingHabitacion._id, 
                        valor: numericPrice 
                    });
                }
                setNotification({ show: true, message: 'Habitación actualizada exitosamente.', type: 'success' });
            } else {
                const { _id, ...newRoomDetails } = detallesHabitacion;
                const nuevaHabitacionRes = await createHabitacion(newRoomDetails);
                const nuevaHabitacionId = nuevaHabitacionRes.data._id;
                if (numericPrice > 0) {
                    await setNuevoPrecioHabitacion({
                        habitacion_id: nuevaHabitacionId,
                        valor: numericPrice
                    });
                }
                setNotification({ show: true, message: 'Habitación creada exitosamente.', type: 'success' });
            }
            fetchHotelData(selectedHotel);
            handleCloseModal();
        } catch (err) {
            setNotification({ show: true, message: `Error al guardar: ${err.response?.data?.message || err.message}`, type: 'error' });
        }
    };

    const handleDeleteClick = (habitacion) => {
        setDeletingHabitacion(habitacion);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!deletingHabitacion) return;
        try {
            await deleteHabitacion(deletingHabitacion._id);
            setNotification({ show: true, message: 'Habitación eliminada exitosamente.', type: 'success' });
            fetchHotelData(selectedHotel);
        } catch (err) {
            setNotification({ show: true, message: `Error al eliminar: ${err.response?.data?.message || err.message}`, type: 'error' });
        } finally {
            setShowDeleteModal(false);
            setDeletingHabitacion(null);
        }
    };

    return (
        <>
            <Notification show={notification.show} message={notification.message} type={notification.type} />
            <div className="container">
                <div className={styles.header}>
                    <h1>Gestión de Habitaciones</h1>
                    <button onClick={() => handleOpenModal(null)} className={styles.addButton} disabled={!selectedHotel}>
                        Crear Nueva Habitación
                    </button>
                </div>

                <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                    <label htmlFor="hotel-selector" style={{ fontWeight: 700, marginRight: '1rem', fontSize: '1.1rem' }}>
                        Gestionando Hotel:
                    </label>
                    <select id="hotel-selector" value={selectedHotel} onChange={(e) => setSelectedHotel(e.target.value)}>
                        <option value="">Todos los hoteles</option>
                        {hoteles.map(hotel => (
                            <option key={hotel._id} value={hotel._id}>{hotel.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className={`card ${styles.filtersCard}`}>
                    <div className={styles.filterGroup}>
                        <label>Buscar</label>
                        <input type="text" placeholder="Por Nº Habitación o Nombre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <div className={styles.filterGroup}>
                        <label>Filtrar por Disponibilidad</label>
                        <select value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)}>
                            <option value="all">Toda Disponibilidad</option>
                            <option value="Disponible">Disponible</option>
                            <option value="No Disponible">No Disponible</option>
                            <option value="Reservada">Reservada</option>
                        </select>
                    </div>
                    <div className={styles.filterGroup}>
                        <label>Ordenar por Precio</label>
                        <select value={priceSort} onChange={(e) => setPriceSort(e.target.value)}>
                            <option value="none">Por Defecto</option>
                            <option value="desc">Mayor a Menor</option>
                            <option value="asc">Menor a Mayor</option>
                        </select>
                    </div>
                </div>

                <div className={styles.tableContainer}>
                    {loading ? <p>Cargando habitaciones...</p> : error ? <p className={styles.errorMessage}>{error}</p> : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Nº Habitación</th>
                                    <th>Nombre</th>
                                    <th>Capacidad</th>
                                    <th>Piso</th>
                                    <th>Precio / Noche</th>
                                    <th>Estado</th>
                                    <th>Cliente Actual</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredHabitaciones.length > 0 ? filteredHabitaciones.map(h => (
                                    <tr key={h._id}>
                                        <td data-label="Nº Habitación">{h._id}</td>
                                        <td data-label="Nombre">{h.nombre}</td>
                                        <td data-label="Capacidad">{h.capacidad}</td>
                                        <td data-label="Piso">{h.piso}</td>
                                        <td data-label="Precio">${new Intl.NumberFormat('es-CL').format(h.precio)}</td>
                                        <td data-label="Estado"><span className={`${styles.status} ${styles[`status_${h.estadoCalculado.toLowerCase().replace(' ', '_')}`]}`}>{h.estadoCalculado}</span></td>
                                        <td data-label="Cliente Actual">{h.clienteActualRUN || 'N/A'}</td>
                                        <td data-label="Acciones">
                                            <div className={styles.actionsContainer}>
                                                <button onClick={() => handleOpenModal(h)} className={styles.actionButton}>Editar</button>
                                                <button onClick={() => handleDeleteClick(h)} className={`${styles.actionButton} ${styles.deleteButton}`}>Eliminar</button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="8">No se encontraron habitaciones para la selección actual.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                <HabitacionModal 
                    show={isModalOpen} 
                    onClose={handleCloseModal} 
                    onSave={handleSaveHabitacion} 
                    habitacion={editingHabitacion}
                    hoteles={hoteles}
                    defaultHotelId={selectedHotel}
                />
                <ConfirmationModal 
                    show={showDeleteModal}
                    title="Confirmar Eliminación"
                    message={`¿Seguro que quieres eliminar la habitación ${deletingHabitacion?._id}? Esta acción es irreversible y eliminará su historial de precios.`}
                    onConfirm={confirmDelete}
                    onCancel={() => setShowDeleteModal(false)}
                />
            </div>
        </>
    );
};

export default ManageHabitacionesPage;