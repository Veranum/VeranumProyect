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

    const fetchReservas = async () => {
        try {
            setLoading(true);
            const response = await getReservas();
            setReservas(response.data || []); // Aseguramos que sea un array
            setFilteredReservas(response.data || []);
        } catch (err) {
            setError('No se pudieron cargar las reservas.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => { fetchReservas(); }, []);

    useEffect(() => {
        let result = reservas;
        if (searchTerm) {
            const lowercasedTerm = searchTerm.toLowerCase().trim();
            result = result.filter(r => 
                r.numeroReserva?.toString().includes(lowercasedTerm)
            );
        }
        if (statusFilter !== 'all') {
            result = result.filter(r => r.estado === statusFilter);
        }
        setFilteredReservas(result);
    }, [searchTerm, statusFilter, reservas]);

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
        const { cliente_id, habitacion_id, ...dataToSave } = formData;
        try {
            if (editingReserva) {
                await updateReserva(editingReserva._id, dataToSave);
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
                <div className={styles.filterGroup}>
                    <label htmlFor="search">Buscar Reserva</label>
                    <input id="search" type="text" placeholder="Nº de Reserva..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
            </div>
            <div className={styles.tableContainer}>
                {loading && <p>Cargando...</p>}
                {error && <p className={styles.errorMessage}>{error}</p>}
                {!loading && !error && (
                    <table>
                        <thead>
                            <tr>
                                <th>Nº Reserva</th>
                                <th>Cliente</th>
                                <th>Habitación</th>
                                <th>Check-in</th>
                                <th>Check-out</th>
                                <th>Costo</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReservas.length > 0 ? filteredReservas.map(reserva => {
                                // --- LÓGICA DE CORRECCIÓN ---
                                const estadoClassName = reserva.estado ? reserva.estado.toLowerCase() : 'desconocido';
                                const estadoTexto = reserva.estado || 'N/A';
                                return (
                                    <tr key={reserva._id}>
                                        <td data-label="Nº Reserva">{reserva.numeroReserva}</td>
                                        <td data-label="Cliente">{reserva.cliente_id?.nombre}</td>
                                        <td data-label="Habitación">{reserva.habitacion_id?.nombre}</td>
                                        <td data-label="Check-in">{formatDate(reserva.fecha_inicio)}</td>
                                        <td data-label="Check-out">{formatDate(reserva.fecha_fin)}</td>
                                        <td data-label="Costo">${reserva.precio_final.toFixed(0)}</td>
                                        <td data-label="Estado">
                                            <span className={`${styles.status} ${styles[`status_${estadoClassName}`]}`}>
                                                {estadoTexto}
                                            </span>
                                        </td>
                                        <td data-label="Acciones">
                                            <button onClick={() => handleOpenModal(reserva)} className={styles.actionButton}>Editar</button>
                                            <button onClick={() => handleDeleteClick(reserva._id)} className={`${styles.actionButton} ${styles.deleteButton}`}>Eliminar</button>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr><td colSpan="8">No se encontraron reservas.</td></tr>
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
