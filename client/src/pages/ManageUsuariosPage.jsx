// src/pages/ManageUsuariosPage.jsx
import React, { useState, useEffect } from 'react';
// --- CAMBIO: Ya no se necesita 'getReservasByRun' ---
import { getAllUsers, createUserAdmin, updateUserAdmin, deleteUserAdmin } from '../services/adminService'; 
// --- CAMBIO: Ya no se necesita 'UserReservationsModal' ---
import UserModal from '../components/admin/UserModal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import Notification from '../components/common/Notification';
import styles from './ManageReservasPage.module.css';

const ManageUsuariosPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [reservasSort, setReservasSort] = useState('default');
    const [antiguedadSort, setAntiguedadSort] = useState('default');

    // --- CAMBIO: Se eliminan los estados del modal de historial de reservas ---
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingUser, setDeletingUser] = useState(null);

    useEffect(() => {
        if (notification.show) {
            const timer = setTimeout(() => {
                setNotification({ show: false, message: '', type: '' });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getAllUsers();
            setUsers(response.data);
            setError('');
        } catch (err) {
            setError('No se pudieron cargar los usuarios.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    useEffect(() => {
        let result = [...users];
        if (searchTerm) result = result.filter(user => user._id.toLowerCase().includes(searchTerm.toLowerCase().trim()));
        if (roleFilter !== 'all') result = result.filter(user => user.rol === roleFilter);
        
        if (reservasSort !== 'default') {
            result.sort((a, b) => reservasSort === 'desc' ? b.numeroDeReservas - a.numeroDeReservas : a.numeroDeReservas - b.numeroDeReservas);
        } else if (antiguedadSort !== 'default') {
            result.sort((a, b) => antiguedadSort === 'asc' ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt));
        }
        
        setFilteredUsers(result);
    }, [users, searchTerm, roleFilter, reservasSort, antiguedadSort]);

    const handleClearFilters = () => {
        setSearchTerm(''); setRoleFilter('all'); setReservasSort('default'); setAntiguedadSort('default');
    };

    // --- CAMBIO: Se eliminan las funciones handleOpenReservasModal y handleCloseReservasModal ---

    const handleOpenUserModal = (user = null) => {
        setEditingUser(user); setIsUserModalOpen(true);
    };

    const handleCloseUserModal = () => {
        setEditingUser(null); setIsUserModalOpen(false);
    };

    const handleSaveUser = async (formData) => {
        try {
            if (editingUser) {
                await updateUserAdmin(editingUser._id, formData);
                setNotification({ show: true, message: 'Usuario actualizado exitosamente.', type: 'success' });
            } else {
                await createUserAdmin(formData);
                setNotification({ show: true, message: 'Usuario creado exitosamente.', type: 'success' });
            }
            fetchUsers();
            handleCloseUserModal();
        } catch (err) {
            setNotification({ show: true, message: `Error: ${err.response?.data?.message || err.message}`, type: 'error' });
        }
    };

    const handleDeleteClick = (user) => {
        setDeletingUser(user);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!deletingUser) return;
        try {
            await deleteUserAdmin(deletingUser._id);
            setNotification({ show: true, message: 'Usuario eliminado exitosamente.', type: 'success' });
            fetchUsers();
        } catch (err) {
            setNotification({ show: true, message: `Error al eliminar: ${err.response?.data?.message || err.message}`, type: 'error' });
        } finally {
            setShowDeleteModal(false);
            setDeletingUser(null);
        }
    };

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('es-CL');

    return (
        <>
            <Notification show={notification.show} message={notification.message} type={notification.type} />
            <div className="container">
                <div className={styles.header}>
                    <h1>Gestión de Usuarios</h1>
                    <button onClick={() => handleOpenUserModal(null)} className={styles.addButton}>Crear Nuevo Usuario</button>
                </div>
                
                <div className={`card ${styles.filtersCard}`}>
                    <div className={styles.searchContainer}>
                        <div className={styles.filterGroup}>
                            <label htmlFor="search">Buscar por RUN</label>
                            <input id="search" type="text" placeholder="Ingrese RUN del cliente..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <button onClick={handleClearFilters} className={styles.clearFiltersButton}>Borrar Filtros</button>
                    </div>
                    <div className={styles.filterGroup}>
                        <label htmlFor="roleFilter">Filtrar por Rol</label>
                        <select id="roleFilter" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                            <option value="all">Todos los Roles</option>
                            <option value="cliente">Cliente</option>
                            <option value="gerente">Gerente</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className={styles.filterGroup}>
                        <label htmlFor="antiguedadSort">Filtrar por Antigüedad</label>
                        <select id="antiguedadSort" value={antiguedadSort} onChange={(e) => setAntiguedadSort(e.target.value)}>
                            <option value="default">Por Defecto</option>
                            <option value="desc">Más Nuevo</option>
                            <option value="asc">Más Antiguo</option>
                        </select>
                    </div>
                </div>

                <div className={styles.tableContainer}>
                    {loading ? <p>Cargando...</p> : error ? <p className={styles.errorMessage}>{error}</p> : (
                        <table>
                            <thead>
                                <tr>
                                    <th>RUN Cliente</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Rol</th>
                                    <th>Miembro Desde</th>
                                    {/* --- CAMBIO: Se elimina la cabecera de la columna --- */}
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length > 0 ? filteredUsers.map(user => (
                                    <tr key={user._id}>
                                        <td data-label="RUN Cliente">{user._id}</td>
                                        <td data-label="Nombre">{user.nombre}</td>
                                        <td data-label="Email">{user.email}</td>
                                        <td data-label="Rol">{user.rol}</td>
                                        <td data-label="Miembro Desde">{formatDate(user.createdAt)}</td>
                                        {/* --- CAMBIO: Se elimina la celda de la columna --- */}
                                        <td data-label="Acciones">
                                            <div className={styles.actionsContainer}>
                                                <button onClick={() => handleOpenUserModal(user)} className={styles.actionButton}>Editar</button>
                                                <button onClick={() => handleDeleteClick(user)} className={`${styles.actionButton} ${styles.deleteButton}`}>Eliminar</button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    // --- CAMBIO: Se ajusta el colSpan ---
                                    <tr><td colSpan="6">No se encontraron usuarios.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
                {/* --- CAMBIO: Se elimina el modal de historial de reservas --- */}
                <UserModal show={isUserModalOpen} onClose={handleCloseUserModal} onSave={handleSaveUser} user={editingUser} />
                <ConfirmationModal 
                    show={showDeleteModal}
                    title="Confirmar Eliminación"
                    message={`¿Estás seguro de que quieres eliminar al usuario ${deletingUser?.nombre}? Esta acción es irreversible.`}
                    onConfirm={confirmDelete}
                    onCancel={() => setShowDeleteModal(false)}
                />
            </div>
        </>
    );
};

export default ManageUsuariosPage;