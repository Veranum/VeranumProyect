// src/pages/ManageServiciosPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
    getAllHotelesAdmin, 
    getServiciosByHotelAdmin,
    createServicio,
    updateServicio,
    deleteServicio
} from '../services/adminService';
import ServicioModal from '../components/admin/ServicioModal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import Notification from '../components/common/Notification';
import styles from './ManageReservasPage.module.css';

const ManageServiciosPage = () => {
    const [hoteles, setHoteles] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState('');
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingServicio, setEditingServicio] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingServicio, setDeletingServicio] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        if (notification.show) {
            const timer = setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    useEffect(() => {
        const fetchHoteles = async () => {
            try {
                const response = await getAllHotelesAdmin();
                setHoteles(response.data);
                if (response.data.length > 0) {
                    setSelectedHotel(response.data[0]._id);
                } else {
                    setLoading(false);
                }
            } catch (err) {
                setError('No se pudieron cargar los hoteles.');
                setLoading(false);
            }
        };
        fetchHoteles();
    }, []);

    const fetchServicios = useCallback(async () => {
        if (!selectedHotel) return;
        setLoading(true);
        try {
            const response = await getServiciosByHotelAdmin(selectedHotel);
            setServicios(response.data);
            setError('');
        } catch (err) {
            setError('No se pudieron cargar los servicios.');
        } finally {
            setLoading(false);
        }
    }, [selectedHotel]);

    useEffect(() => {
        fetchServicios();
    }, [fetchServicios]);

    const handleOpenModal = (servicio = null) => {
        setEditingServicio(servicio);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingServicio(null);
        setIsModalOpen(false);
    };

    const handleSaveServicio = async (formData) => {
        try {
            if (editingServicio) {
                await updateServicio(editingServicio._id, formData);
                setNotification({ show: true, message: 'Servicio actualizado.', type: 'success' });
            } else {
                await createServicio({ ...formData, hotel_id: selectedHotel });
                setNotification({ show: true, message: 'Servicio creado.', type: 'success' });
            }
            fetchServicios();
            handleCloseModal();
        } catch (err) {
            setNotification({ show: true, message: `Error: ${err.response?.data?.message || err.message}`, type: 'error' });
        }
    };

    const handleDeleteClick = (servicio) => {
        setDeletingServicio(servicio);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!deletingServicio) return;
        try {
            await deleteServicio(deletingServicio._id);
            setNotification({ show: true, message: 'Servicio eliminado.', type: 'success' });
            fetchServicios();
        } catch (err) {
            setNotification({ show: true, message: `Error al eliminar: ${err.response?.data?.message || err.message}`, type: 'error' });
        } finally {
            setShowDeleteModal(false);
            setDeletingServicio(null);
        }
    };

    return (
        <>
            <Notification {...notification} />
            <div className="container">
                <div className={styles.header}>
                    <h1>Gestión de Servicios Adicionales</h1>
                    <button onClick={() => handleOpenModal(null)} className={styles.addButton} disabled={!selectedHotel}>
                        Crear Nuevo Servicio
                    </button>
                </div>

                <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                    <label htmlFor="hotel-selector" style={{ fontWeight: 700, marginRight: '1rem', fontSize: '1.1rem' }}>
                        Gestionando Servicios del Hotel:
                    </label>
                    <select id="hotel-selector" value={selectedHotel} onChange={(e) => setSelectedHotel(e.target.value)}>
                        {hoteles.map(hotel => (
                            <option key={hotel._id} value={hotel._id}>{hotel.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.tableContainer}>
                    {loading ? <p>Cargando servicios...</p> : error ? <p className={styles.errorMessage}>{error}</p> : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre del Servicio</th>
                                    <th>Descripción</th>
                                    <th>Precio Diario</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {servicios.length > 0 ? servicios.map(s => (
                                    <tr key={s._id}>
                                        <td data-label="Nombre">{s.nombre}</td>
                                        <td data-label="Descripción">{s.descripcion}</td>
                                        <td data-label="Precio">${s.precio_diario.toLocaleString('es-CL')}</td>
                                        <td data-label="Acciones">
                                            <div className={styles.actionsContainer}>
                                                <button onClick={() => handleOpenModal(s)} className={styles.actionButton}>Editar</button>
                                                <button onClick={() => handleDeleteClick(s)} className={`${styles.actionButton} ${styles.deleteButton}`}>Eliminar</button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="4">No hay servicios definidos para este hotel.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                <ServicioModal
                    show={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveServicio}
                    servicio={editingServicio}
                />
                <ConfirmationModal
                    show={showDeleteModal}
                    title="Confirmar Eliminación"
                    message={`¿Seguro que quieres eliminar el servicio "${deletingServicio?.nombre}"?`}
                    onConfirm={confirmDelete}
                    onCancel={() => setShowDeleteModal(false)}
                />
            </div>
        </>
    );
};

export default ManageServiciosPage;