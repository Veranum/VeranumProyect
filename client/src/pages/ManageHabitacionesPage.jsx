// src/pages/ManageHabitacionesPage.jsx
import React, { useState, useEffect } from 'react';
import { getAllHabitaciones } from '../services/habitacionesService';
import { createHabitacion, updateHabitacion, deleteHabitacion } from '../services/adminService';
import HabitacionModal from '../components/admin/HabitacionModal';
import styles from './ManageReservasPage.module.css';

const ManageHabitacionesPage = () => {
    const [habitaciones, setHabitaciones] = useState([]);
    const [filteredHabitaciones, setFilteredHabitaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHabitacion, setEditingHabitacion] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [availabilityFilter, setAvailabilityFilter] = useState('all');

    const fetchHabitaciones = async () => {
        try {
            setLoading(true);
            const response = await getAllHabitaciones();
            setHabitaciones(response.data);
            setFilteredHabitaciones(response.data);
        } catch (err) {
            setError('No se pudieron cargar las habitaciones.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchHabitaciones();
    }, []);

    useEffect(() => {
        let result = habitaciones;
        if (searchTerm) {
            const lowercasedTerm = searchTerm.toLowerCase();
            result = result.filter(h => 
                h.nombre.toLowerCase().includes(lowercasedTerm) ||
                h.numeroHabitacion?.toString().includes(lowercasedTerm)
            );
        }
        if (availabilityFilter !== 'all') {
            result = result.filter(h => h.disponible === (availabilityFilter === 'true'));
        }
        setFilteredHabitaciones(result);
    }, [searchTerm, availabilityFilter, habitaciones]);

    const handleOpenModal = (habitacion = null) => {
        setEditingHabitacion(habitacion);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingHabitacion(null);
    };

    const handleSaveHabitacion = async (formData) => {
        try {
            if (editingHabitacion) {
                await updateHabitacion(editingHabitacion._id, formData);
            } else {
                await createHabitacion(formData);
            }
            fetchHabitaciones();
            handleCloseModal();
        } catch (err) {
            alert('Error al guardar la habitación.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta habitación?')) {
            try {
                await deleteHabitacion(id);
                fetchHabitaciones();
            } catch (err) {
                alert('No se pudo eliminar la habitación.');
            }
        }
    };
    
    return (
        <div className="container">
            <div className={styles.header}>
                <h1>Gestión de Habitaciones</h1>
                <button onClick={() => handleOpenModal()} className={styles.addButton}>
                    Crear Nueva Habitación
                </button>
            </div>
            <div className={`card ${styles.filtersCard}`}>
                <input type="text" placeholder="Buscar por Nº Habitación o Nombre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <select value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)}>
                    <option value="all">Toda Disponibilidad</option>
                    <option value="true">Disponible</option>
                    <option value="false">No Disponible</option>
                </select>
            </div>
            <div className={styles.tableContainer}>
                {loading && <p>Cargando...</p>}
                {error && <p className={styles.errorMessage}>{error}</p>}
                {!loading && !error && (
                    <table>
                        <thead>
                            <tr>
                                <th>Nº Habitación</th>
                                <th>Nombre</th>
                                <th>Capacidad</th>
                                <th>Piso</th>
                                <th>Precio / Noche</th>
                                <th>Estado Hoy</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHabitaciones.length > 0 ? filteredHabitaciones.map(h => (
                                <tr key={h._id}>
                                    <td data-label="Nº Habitación">{h.numeroHabitacion}</td>
                                    <td data-label="Nombre">{h.nombre}</td>
                                    <td data-label="Capacidad">{h.capacidad}</td>
                                    <td data-label="Piso">{h.piso}</td>
                                    <td data-label="Precio">${h.precio_noche.toFixed(0)}</td>
                                    <td data-label="Estado Hoy"><span className={`${styles.status} ${h.disponible ? styles.status_confirmado : styles.status_cancelado}`}>{h.disponible ? 'Disponible' : 'No Disponible'}</span></td>
                                    <td data-label="Acciones">
                                        <button onClick={() => handleOpenModal(h)} className={styles.actionButton}>Editar</button>
                                        <button onClick={() => handleDelete(h._id)} className={`${styles.actionButton} ${styles.deleteButton}`}>Eliminar</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="7">No se encontraron habitaciones.</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
            <HabitacionModal show={isModalOpen} onClose={handleCloseModal} onSave={handleSaveHabitacion} habitacion={editingHabitacion} />
        </div>
    );
};

export default ManageHabitacionesPage;
