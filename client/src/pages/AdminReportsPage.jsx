// src/pages/AdminReportsPage.jsx
import React, { useState, useEffect } from 'react';
import { getReporteGeneral } from '../services/adminService';
import ConfirmationModal from '../components/common/ConfirmationModal'; // Importamos la modal
import styles from './AdminReportsPage.module.css';

// --- Íconos para las tarjetas ---
const OccupancyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const RevenueIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const BookingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;


const AdminReportsPage = () => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- Estados para la modal de exportación ---
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportFormat, setExportFormat] = useState('');

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                setLoading(true);
                const response = await getReporteGeneral();
                setReportData(response.data);
            } catch (err) {
                setError('No se pudo cargar el reporte.');
            } finally {
                setLoading(false);
            }
        };
        fetchReportData();
    }, []);

    const handleExportClick = (format) => {
        setExportFormat(format);
        setShowExportModal(true);
    };

    const confirmExport = () => {
        // En un futuro, esta función llamaría a la API para generar el archivo
        alert(`Funcionalidad para exportar a .${exportFormat} pendiente de implementación.`);
        setShowExportModal(false);
        setExportFormat('');
    };

    if (loading) return <div className="container"><p>Generando reporte...</p></div>;
    if (error) return <div className="container"><p style={{ color: 'red' }}>{error}</p></div>;
    if (!reportData) return <div className="container"><p>No hay datos para mostrar.</p></div>;

    const maxIngresos = Math.max(...reportData.ingresosPorHabitacion.map(h => h.ingresos), 1);

    return (
        <>
            <div className="container">
                <div className={styles.header}>
                    <h1>Reportes de Gestión</h1>
                    <p>Una vista general del rendimiento del hotel este mes.</p>
                </div>

                <div className={styles.statsGrid}>
                    <div className="card">
                        <div className={styles.statCard}>
                            <div className={styles.statIcon} style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--veranum-blue)' }}><OccupancyIcon /></div>
                            <div className={styles.statInfo}>
                                <span className={styles.statValue}>{reportData.ocupacion}%</span>
                                <span className={styles.statLabel}>Ocupación Hoy</span>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                         <div className={styles.statCard}>
                            <div className={styles.statIcon} style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}><RevenueIcon /></div>
                            <div className={styles.statInfo}>
                                <span className={styles.statValue}>${reportData.ingresosMesActual.toLocaleString('es-CL')}</span>
                                <span className={styles.statLabel}>Ingresos del Mes</span>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                         <div className={styles.statCard}>
                            <div className={styles.statIcon} style={{ backgroundColor: '#fff3e0', color: '#ef6c00' }}><BookingsIcon /></div>
                            <div className={styles.statInfo}>
                                <span className={styles.statValue}>{reportData.nuevasReservasMes}</span>
                                <span className={styles.statLabel}>Nuevas Reservas</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card">
                        <div className={styles.statCard}>
                            <div className={styles.statIcon} style={{ backgroundColor: '#e3f2fd', color: '#1565c0' }}><DownloadIcon /></div>
                            <div className={styles.statInfo}>
                                 <span className={styles.statLabel} style={{fontSize: '1.2rem', fontWeight: '700', color: 'var(--color-text-header)'}}>Generar Reporte</span>
                                 <div className={styles.exportButtons}>
                                    <button onClick={() => handleExportClick('xlsx')} className={styles.exportXLSX}>.xlsx</button>
                                    <button onClick={() => handleExportClick('pdf')} className={styles.exportPDF}>.pdf</button>
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3>Ingresos por Tipo de Habitación</h3>
                    <div className={styles.chartContainer}>
                        {reportData.ingresosPorHabitacion.map(item => (
                            <div key={item.nombre} className={styles.chartBarGroup}>
                                <div className={styles.chartLabel}>{item.nombre}</div>
                                <div className={styles.chartBarWrapper}>
                                    <div 
                                        className={styles.chartBar} 
                                        style={{ width: `${(item.ingresos / maxIngresos) * 100}%` }}
                                    >
                                        <span>${item.ingresos.toLocaleString('es-CL')}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ConfirmationModal
                show={showExportModal}
                title={`Confirmar Exportación`}
                message={`¿Estás seguro de que quieres generar y descargar el reporte en formato .${exportFormat}?`}
                onConfirm={confirmExport}
                onCancel={() => setShowExportModal(false)}
            />
        </>
    );
};

export default AdminReportsPage;
