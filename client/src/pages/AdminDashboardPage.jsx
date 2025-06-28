// src/pages/AdminDashboardPage.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import styles from './AdminDashboardPage.module.css';

const AdminDashboardPage = () => {
    const { user } = useContext(AuthContext);

    // Protección de la ruta para asegurar que solo usuarios autorizados puedan verla
    if (!user || (user.rol !== 'admin' && user.rol !== 'gerente')) {
        return (
            <div className="container">
                <div className="card" style={{textAlign: 'center'}}>
                    <h2>Acceso Denegado</h2>
                    <p>Necesitas privilegios de Administrador o Gerente para ver esta página.</p>
                    <Link to="/login"><button>Iniciar Sesión</button></Link>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.dashboardContainer} container`}>
            <h1>Panel de Administración</h1>
            <p>Bienvenido, {user.nombre}. Desde aquí puedes gestionar las operaciones del hotel.</p>

            <div className={styles.dashboardGrid}>
                {/* Tarjeta de Gestionar Reservas */}
                <div className={`${styles.dashboardCard} ${styles.cardReservas}`}>
                    <h3>Gestionar Reservas</h3>
                    <p>Ver, modificar y cancelar las reservas de los clientes.</p>
                    <Link to="/admin/reservas">
                        <button>Ir a Reservas</button>
                    </Link>
                </div>
                
                {/* Tarjeta de Gestionar Habitaciones */}
                <div className={`${styles.dashboardCard} ${styles.cardHabitaciones}`}>
                    <h3>Gestionar Habitaciones</h3>
                    <p>Añadir nuevas habitaciones, editar precios y disponibilidad.</p>
                    <Link to="/admin/habitaciones">
                      <button>Ir a Habitaciones</button>
                    </Link>
                </div>

                {/* Tarjeta de Ver Reportes */}
                <div className={`${styles.dashboardCard} ${styles.cardReportes}`}>
                    <h3>Ver Reportes</h3>
                    <p>Analizar la ocupación, ingresos y otras métricas clave.</p>
                    <Link to="/admin/reportes">
                        <button>Generar Reporte</button>
                    </Link>
                </div>
                
                {/* Tarjeta de Crear Promociones */}
                 <div className={`${styles.dashboardCard} ${styles.cardPromociones}`}>
                    <h3>Crear Promociones</h3>
                    <p>Lanzar nuevas ofertas y descuentos para atraer clientes.</p>
                    <Link to="#">
                        <button>Ir a Promociones</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
