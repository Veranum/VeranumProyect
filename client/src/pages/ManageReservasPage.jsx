// src/pages/ManageReservasPage.jsx
import React, { useState, useEffect } from 'react';
import { getReservas, deleteReserva, createReservaAdmin, updateReserva } from '../services/adminService'; 
import ReservaModal from '../components/admin/ReservaModal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import styles from './ManageReservasPage.module.css';

const ManageReservasPage = () => {
    const [reservas, setReservas] = useState([]);
    const [filteredReservas, setFilteredReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReserva, setEditingReserva] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('');
    const [sortDirection, setSortDirection] = useState('desc');
    

    const fetchReservas = async () => {
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
    
    useEffect(() => { fetchReservas(); }, []);

    useEffect(() => {
        let result = [...reservas];

        if (searchTerm) {
            const lowercasedTerm = searchTerm.toLowerCase().trim();
            result = result.filter(r => 
                (r.numeroReserva?.toString().includes(lowercasedTerm)) ||
                (r.cliente_id?.nombre.toLowerCase().includes(lowercasedTerm)) ||
                (r.cliente_id?._id.toLowerCase().includes(lowercasedTerm)) ||
                (r.habitacion_id?.nombre?.toLowerCase().includes(lowercasedTerm)) ||
                (r.hotel_id?.nombre?.toLowerCase().includes(lowercasedTerm))
            );
        }
        
        if (statusFilter !== 'all') {
            result = result.filter(r => r.estado === statusFilter);
        }

        if (dateFilter) {
            const selectedDate = new Date(dateFilter);
            selectedDate.setMinutes(selectedDate.getMinutes() + selectedDate.getTimezoneOffset());
            selectedDate.setHours(0,0,0,0);

            result = result.filter(r => {
                const checkinDate = new Date(r.fecha_inicio);
                const checkoutDate = new Date(r.fecha_fin);
                checkinDate.setHours(0,0,0,0);
                checkoutDate.setHours(0,0,0,0);
                return selectedDate >= checkinDate && selectedDate < checkoutDate;
            });
        }

        if (sortDirection !== 'none') {
            result.sort((a, b) => {
                return sortDirection === 'asc' 
                    ? a.numeroReserva - b.numeroReserva 
                    : b.numeroReserva - a.numeroReserva;
            });
        }
        
        setFilteredReservas(result);
    }, [searchTerm, statusFilter, dateFilter, reservas, sortDirection]);

    const handleClearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setDateFilter('');
        setSortDirection('desc');
    };

    const handleDeleteClick = (id) => {
        setDeletingId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (deletingId) {
            try {
                await deleteReserva(deletingId);
                fetchReservas();
            } catch (err) {
                alert('No se pudo eliminar la reserva.');
            } finally {
                setShowDeleteModal(false);
                setDeletingId(null);
            }
        }
    };

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('es-CL');
    
    const handleOpenModal = (reserva = null) => {
        setEditingReserva(reserva);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingReserva(null);
    };

    const handleSaveReserva = async (formData) => {
        try {
            if (editingReserva) {
                await updateReserva(editingReserva._id, formData);
            } else {
                await createReservaAdmin(formData);
            }
            fetchReservas();
            handleCloseModal();
        } catch (err) {
            alert('Error al guardar la reserva.');
        }
    };
    
    return (
        <div className="container">
            <div className={styles.header}>
                <h1>Gestión de Reservas</h1>
                <button onClick={() => handleOpenModal()} className={styles.addButton}>Crear Nueva Reserva</button>
            </div>
            
            <div className={`card ${styles.filtersCard}`}>
                <div className={styles.searchContainer}>
                     <div className={styles.filterGroup}>
                        <label htmlFor="search">Buscar Reserva</label>
                        <input 
                            id="search"
                            type="text" 
                            placeholder="RUN, Nº Reserva o Nombre..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>
                     <button onClick={handleClearFilters} className={styles.clearFiltersButton}>
                        Borrar Filtros
                    </button>
                </div>
                <div className={styles.filterGroup}>
                    <label htmlFor="status">Filtrar por Estado</label>
                    <select id="status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="all">Todos los Estados</option>
                        <option value="Confirmado">Confirmado</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Cancelado">Cancelado</option>
                    </select>
                </div>
                <div className={styles.filterGroup}>
                    <label htmlFor="sort">Ordenar por Nº Reserva</label>
                    <select id="sort" value={sortDirection} onChange={(e) => setSortDirection(e.target.value)}>
                        <option value="desc">Mayor a Menor</option>
                        <option value="asc">Menor a Mayor</option>
                        <option value="none">Por Defecto</option>
                    </select>
                </div>
                <div className={styles.filterGroup}>
                    <label htmlFor="dateFilter">Buscar por Fecha</label>
                    <input 
                        id="dateFilter"
                        type="date" 
                        value={dateFilter} 
                        onChange={(e) => setDateFilter(e.target.value)} 
                    />
                </div>
            </div>

            <div className={styles.tableContainer}>
                {loading ? <p>Cargando...</p> : error ? <p className={styles.errorMessage}>{error}</p> : (
                    <table>
                        <thead>
                            <tr>
                                <th>Nº Reserva</th>
                                <th>Hotel</th>
                                <th>Cliente</th>
                                <th>RUN Cliente</th>
                                <th>Habitación</th>
                                <th>Check-in</th>
                                <th>Check-out</th>
                                <th>Costo</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReservas.length > 0 ? (
                                filteredReservas.map(reserva => {
                                    // El costo ya viene calculado con los servicios desde el backend.
                                    const costoTotal = reserva.precio_final;

                                    return (
                                        <tr key={reserva._id}>
                                            <td data-label="Nº Reserva">{reserva.numeroReserva}</td>
                                            <td data-label="Hotel">{reserva.hotel_id?.nombre || 'N/A'}</td>
                                            <td data-label="Cliente">{reserva.cliente_id?.nombre}</td>
                                            <td data-label="RUN Cliente">{reserva.cliente_id?._id}</td>
                                            <td data-label="Habitación">{reserva.habitacion_id?.nombre || '(Eliminada)'}</td>
                                            <td data-label="Check-in">{formatDate(reserva.fecha_inicio)}</td>
                                            <td data-label="Check-out">{formatDate(reserva.fecha_fin)}</td>
                                            <td data-label="Costo">
                                                <strong>${new Intl.NumberFormat('es-CL').format(costoTotal)}</strong>
                                                {/* --- NUEVO: Se muestra la lista de servicios --- */}
                                                {reserva.servicios_adicionales && reserva.servicios_adicionales.length > 0 && (
                                                    <ul className={styles.servicesList}>
                                                        {reserva.servicios_adicionales.map(servicio => (
                                                            <li key={servicio._id}>+ {servicio.nombre}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </td>
                                            <td data-label="Estado"><span className={`${styles.status} ${styles[`status_${reserva.estado?.toLowerCase()}`]}`}>{reserva.estado}</span></td>
                                            <td data-label="Acciones">
                                                <div className={styles.actionsContainer}>
                                                    <button onClick={() => handleOpenModal(reserva)} className={styles.actionButton}>Editar</button>
                                                    <button onClick={() => handleDeleteClick(reserva._id)} className={`${styles.actionButton} ${styles.deleteButton}`}>Eliminar</button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr><td colSpan="10">No se encontraron reservas.</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
            <ReservaModal show={isModalOpen} onClose={handleCloseModal} onSave={handleSaveReserva} reserva={editingReserva} />
            <ConfirmationModal 
                show={showDeleteModal}
                title="Confirmar Eliminación"
                message="¿Estás seguro de que quieres eliminar esta reserva de forma permanente?"
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </div>
    );
};

export default ManageReservasPage;