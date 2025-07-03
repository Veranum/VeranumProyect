// src/pages/AdminDashboardPage.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import styles from './AdminDashboardPage.module.css';

// Ícono para las tarjetas de navegación
const ArrowIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>;

const AdminDashboardPage = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className={`${styles.dashboardContainer} container`}>
            <div className={styles.header}>
                <h1>Panel de Administración</h1>
                <p>Bienvenido, {user?.nombre}. Desde aquí puedes gestionar las operaciones del hotel.</p>
            </div>

            {/* --- La sección de estadísticas ha sido removida --- */}

            <div className={styles.managementSection}>
                <h2>Módulos de Gestión</h2>
                <div className={styles.managementGrid}>
                    <Link to="/admin/reservas" className={`${styles.managementCard} card`}>
                        <div><h3>Gestionar Reservas</h3><p>Ver, modificar y cancelar las reservas de los clientes.</p></div>
                        <ArrowIcon />
                    </Link>
                    <Link to="/admin/habitaciones" className={`${styles.managementCard} card`}>
                        <div><h3>Gestionar Habitaciones</h3><p>Añadir nuevas habitaciones, editar precios y disponibilidad.</p></div>
                        <ArrowIcon />
                    </Link>
                     <Link to="/admin/usuarios" className={`${styles.managementCard} card`}>
                        <div><h3>Gestionar Usuarios</h3><p>Ver, editar y gestionar los roles de los usuarios registrados.</p></div>
                        <ArrowIcon />
                    </Link>
                     <Link to="/admin/hoteles" className={`${styles.managementCard} card`}>
                        <div><h3>Gestionar Hoteles</h3><p>Añadir nuevos hoteles y configurar sus servicios.</p></div>
                        <ArrowIcon />
                    </Link>
                     <Link to="/admin/servicios" className={`${styles.managementCard} card`}>
                        <div><h3>Gestionar Servicios</h3><p>Definir los servicios adicionales que cada hotel ofrece.</p></div>
                        <ArrowIcon />
                    </Link>
                    {/* --- La tarjeta de reportes ahora es igual a las demás --- */}
                     <Link to="/admin/reportes" className={`${styles.managementCard} card`}>
                        <div><h3>Ver Reportes</h3><p>Analizar la ocupación, ingresos y otras métricas clave.</p></div>
                        <ArrowIcon />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;