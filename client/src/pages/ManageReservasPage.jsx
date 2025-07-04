import React, { useState, useEffect } from 'react';
import { getReservas, deleteReserva } from '../services/adminService';
import { Link } from 'react-router-dom';
import styles from './ManageReservasPage.module.css';
import Notification from '../components/common/Notification';
import ConfirmationModal from '../components/common/ConfirmationModal';
import ReservaModal from '../components/admin/ReservaModal';

// --- Iconos para la UI ---
const KeyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const DollarSignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const ClearIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>;

const ManageReservasPage = () => {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        search: '',
        estado: 'Todos',
        fecha: '',
        sortBy: 'precio_desc'
    });
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedReserva, setSelectedReserva] = useState(null);

    const loadReservas = async () => {
        try {
            setLoading(true);
            const response = await getReservas();
            setReservas(response.data);
            setError('');
        } catch (err) {
            setError('No se pudieron cargar las reservas.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReservas();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleClearFilters = () => setFilters({ search: '', estado: 'Todos', fecha: '', sortBy: 'precio_desc' });
    
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('es-CL');

    const filteredAndSortedReservas = reservas
        .filter(reserva => {
            const searchLower = filters.search.toLowerCase();
            const cliente = reserva.cliente_id;
            const matchesSearch = !filters.search || (reserva.numeroReserva?.toString().includes(searchLower)) || (cliente?.nombre?.toLowerCase().includes(searchLower)) || (cliente?._id?.toLowerCase().includes(searchLower));
            const matchesEstado = filters.estado === 'Todos' || reserva.estado === filters.estado;
            const matchesFecha = !filters.fecha || new Date(reserva.fecha_inicio) >= new Date(filters.fecha);
            return matchesSearch && matchesEstado && matchesFecha;
        })
        .sort((a, b) => {
            const [field, direction] = filters.sortBy.split('_');
            const factor = direction === 'asc' ? 1 : -1;
            return (a.precio_final - b.precio_final) * factor;
        });

    const handleEditClick = (reserva) => {
        setSelectedReserva(reserva);
        setShowEditModal(true);
    };

    const handleDeleteClick = (reserva) => {
        setSelectedReserva(reserva);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedReserva) return;
        try {
            await deleteReserva(selectedReserva._id);
            setNotification({ show: true, message: 'Reserva eliminada con éxito', type: 'success' });
            loadReservas();
        } catch (err) {
            setNotification({ show: true, message: 'Error al eliminar la reserva', type: 'error' });
        } finally {
            setShowDeleteModal(false);
            setSelectedReserva(null);
        }
    };

    return (
        <div className="container">
            <Notification {...notification} onClose={() => setNotification({ show: false, message: '', type: '' })} />
            <ConfirmationModal
                show={showDeleteModal}
                title="Confirmar Eliminación"
                message={`¿Seguro que quieres eliminar la reserva N°${selectedReserva?.numeroReserva}?`}
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
            {showEditModal && (
                <ReservaModal
                    show={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onSave={() => { 
                        setShowEditModal(false);
                        loadReservas();
                    }}
                    reserva={selectedReserva}
                />
            )}

            <div className={styles.header}>
                <h1>Gestión de Reservas</h1>
                <button onClick={() => handleEditClick(null)} className={styles.createButton}>Crear Nueva Reserva</button>
            </div>

            <div className={`${styles.filtersContainer} card`}>
                <div className={styles.searchWrapper}>
                    <label htmlFor="search">Búsqueda General</label>
                    <div className={styles.inputIconWrapper}>
                        <SearchIcon />
                        <input id="search" type="text" name="search" placeholder="Buscar por N° Reserva, RUN o Nombre..." value={filters.search} onChange={handleFilterChange} />
                    </div>
                </div>
                <div className={styles.filterGroup}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="estado">Estado Reserva</label>
                        <select id="estado" name="estado" value={filters.estado} onChange={handleFilterChange}>
                            <option value="Todos">Todos</option>
                            <option value="Confirmado">Confirmado</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Cancelado">Cancelado</option>
                        </select>
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="sortBy">Ordenar por precio</label>
                        <select id="sortBy" name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
                            <option value="precio_desc">Mayor a Menor</option>
                            <option value="precio_asc">Menor a Mayor</option>
                        </select>
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="fecha">Buscar por Fecha</label>
                        <input id="fecha" type="date" name="fecha" value={filters.fecha} onChange={handleFilterChange} title="Mostrar reservas a partir de esta fecha"/>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>&nbsp;</label> 
                        <button onClick={handleClearFilters} className={styles.clearFiltersButton} title="Limpiar todos los filtros">
                            <ClearIcon />
                        </button>
                    </div>
                </div>
            </div>

            {loading && <p>Cargando...</p>}
            {error && <p className={styles.errorMessage}>{error}</p>}
            {!loading && !error && (
                <div className={styles.reservasGrid}>
                    {filteredAndSortedReservas.map(reserva => (
                        <div key={reserva._id} className={`${styles.reservaCard} card`}>
                            <div className={styles.cardHeader}>
                                <span className={styles.reservaId}><KeyIcon /> Reserva N°{reserva.numeroReserva}</span>
                                <span className={`${styles.status} ${styles[`status_${reserva.estado?.toLowerCase()}`]}`}>{reserva.estado}</span>
                            </div>
                            <div className={styles.cardBody}>
                                <div className={styles.infoItem}><UserIcon /> <strong>Cliente:</strong> {reserva.cliente_id?.nombre || 'N/A'} ({reserva.cliente_id?._id || 'N/A'})</div>
                                <div className={styles.infoItem}><HomeIcon /> <strong>Hotel:</strong> {reserva.hotel_id?.nombre || 'N/A'}</div>
                                <div className={styles.infoItem}><CalendarIcon /> <strong>Fechas:</strong> {formatDate(reserva.fecha_inicio)} al {formatDate(reserva.fecha_fin)}</div>
                            </div>
                            <div className={styles.cardFooter}>
                                <span className={styles.price}><DollarSignIcon /> Total: ${reserva.precio_final?.toLocaleString('es-CL')}</span>
                                <div className={styles.actions}>
                                    <button onClick={() => handleEditClick(reserva)} className={styles.editButton}><EditIcon /></button>
                                    <button onClick={() => handleDeleteClick(reserva)} className={styles.deleteButton}><TrashIcon /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {!loading && filteredAndSortedReservas.length === 0 && <p className={styles.noResults}>No se encontraron reservas con los filtros actuales.</p>}
        </div>
    );
};

export default ManageReservasPage;