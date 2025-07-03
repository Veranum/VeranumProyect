// src/pages/ManageHotelesPage.jsx
import React, { useState, useEffect } from 'react';
import { getAllHotelesAdmin, createHotel, updateHotel, deleteHotel } from '../services/adminService';
import HotelModal from '../components/admin/HotelModal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import Notification from '../components/common/Notification';
import styles from './ManageReservasPage.module.css';

const ManageHotelesPage = () => {
    const [hoteles, setHoteles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHotel, setEditingHotel] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingHotel, setDeletingHotel] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    
    useEffect(() => {
        if (notification.show) {
            const timer = setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const fetchHoteles = async () => {
        try {
            setLoading(true);
            const response = await getAllHotelesAdmin();
            setHoteles(response.data);
            setError('');
        } catch (err) {
            setError('No se pudieron cargar los hoteles.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchHoteles(); }, []);

    const handleOpenModal = (hotel = null) => {
        setEditingHotel(hotel);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingHotel(null);
        setIsModalOpen(false);
    };

    const handleSaveHotel = async (formData) => {
        try {
            if (editingHotel) {
                await updateHotel(editingHotel._id, formData);
                setNotification({ show: true, message: 'Hotel actualizado exitosamente.', type: 'success' });
            } else {
                await createHotel(formData);
                setNotification({ show: true, message: 'Hotel creado exitosamente.', type: 'success' });
            }
            fetchHoteles();
            handleCloseModal();
        } catch (err) {
            setNotification({ show: true, message: `Error: ${err.response?.data?.message || err.message}`, type: 'error' });
        }
    };
    
    const handleDeleteClick = (hotel) => {
        setDeletingHotel(hotel);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!deletingHotel) return;
        try {
            await deleteHotel(deletingHotel._id);
            setNotification({ show: true, message: 'Hotel eliminado exitosamente.', type: 'success' });
            fetchHoteles();
        } catch(err) {
            setNotification({ show: true, message: `Error al eliminar: ${err.response?.data?.message || err.message}`, type: 'error' });
        } finally {
            setShowDeleteModal(false);
            setDeletingHotel(null);
        }
    };

    return (
        <>
            <Notification {...notification} />
            <div className="container">
                <div className={styles.header}>
                    <h1>Gestión de Hoteles</h1>
                    <button onClick={() => handleOpenModal(null)} className={styles.addButton}>Crear Nuevo Hotel</button>
                </div>
                <div className={styles.tableContainer}>
                     {loading ? <p>Cargando...</p> : error ? <p className={styles.errorMessage}>{error}</p> : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre del Hotel</th>
                                    <th>Ubicación</th>
                                    <th>Servicios Extras</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hoteles.map(hotel => (
                                    <tr key={hotel._id}>
                                        <td data-label="Nombre">{hotel.nombre}</td>
                                        <td data-label="Ubicación">{`${hotel.ubicacion.direccion}, ${hotel.ubicacion.ciudad}`}</td>
                                        <td data-label="Servicios">{hotel.servicios_extras.join(', ')}</td>
                                        <td data-label="Acciones">
                                            <div className={styles.actionsContainer} style={{flexDirection: 'row'}}>
                                                <button onClick={() => handleOpenModal(hotel)} className={styles.actionButton}>Editar</button>
                                                <button onClick={() => handleDeleteClick(hotel)} className={`${styles.actionButton} ${styles.deleteButton}`}>Eliminar</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     )}
                </div>
                <HotelModal show={isModalOpen} onClose={handleCloseModal} onSave={handleSaveHotel} hotel={editingHotel} />
                <ConfirmationModal 
                    show={showDeleteModal}
                    title="Confirmar Eliminación"
                    message={`¿Seguro que quieres eliminar el hotel ${deletingHotel?.nombre}? Se borrarán también sus habitaciones y reservas asociadas (lógica futura).`}
                    onConfirm={confirmDelete}
                    onCancel={() => setShowDeleteModal(false)}
                />
            </div>
        </>
    );
};

export default ManageHotelesPage;