// src/pages/AdminReportsPage.jsx
import React, { useState, useEffect } from 'react';
import { getReporteGeneral } from '../services/adminService';
import ConfirmationModal from '../components/common/ConfirmationModal';
import styles from './AdminReportsPage.module.css';

// --- Íconos para las tarjetas ---
const OccupancyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const RevenueIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const BookingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>;
const ExportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;


const AdminReportsPage = () => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const ahora = new Date();
    const [selectedYear, setSelectedYear] = useState(ahora.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(ahora.getMonth() + 1);

    const [showExportModal, setShowExportModal] = useState(false);
    const [exportFormat, setExportFormat] = useState('');

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                setLoading(true);
                // Simular un pequeño retraso para ver la animación de carga
                await new Promise(res => setTimeout(res, 300));
                const response = await getReporteGeneral(selectedYear, selectedMonth);
                setReportData(response.data);
                setError('');
            } catch (err) {
                setError('No se pudo cargar el reporte para la fecha seleccionada.');
                setReportData(null);
            } finally {
                setLoading(false);
            }
        };
        fetchReportData();
    }, [selectedYear, selectedMonth]);

    const years = Array.from({ length: 5 }, (_, i) => ahora.getFullYear() - i);
    const months = [
        { value: 1, name: 'Enero' }, { value: 2, name: 'Febrero' }, { value: 3, name: 'Marzo' },
        { value: 4, name: 'Abril' }, { value: 5, name: 'Mayo' }, { value: 6, name: 'Junio' },
        { value: 7, name: 'Julio' }, { value: 8, name: 'Agosto' }, { value: 9, name: 'Septiembre' },
        { value: 10, name: 'Octubre' }, { value: 11, name: 'Noviembre' }, { value: 12, name: 'Diciembre' },
    ];

    const handleExportClick = (format) => {
        setExportFormat(format);
        setShowExportModal(true);
    };

    const confirmExport = () => {
        alert(`Funcionalidad para exportar a .${exportFormat} pendiente de implementación.`);
        setShowExportModal(false);
        setExportFormat('');
    };
    
    const renderContent = () => {
        if (loading) return <div className={styles.loadingState}><div className={styles.spinner}></div><p>Generando reporte...</p></div>;
        if (error) return <div className="container"><p style={{ color: 'red', textAlign: 'center' }}>{error}</p></div>;
        if (!reportData) return <div className="container"><p>No hay datos para mostrar para el período seleccionado.</p></div>;

        const maxIngresos = Math.max(...(reportData.ingresosPorHabitacion || []).map(h => h.ingresos), 1);

        return (
            <>
                <div className={styles.statsGrid}>
                    <div className={`card ${styles.statCard}`}>
                        <div className={styles.statIcon} style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--veranum-blue)' }}><OccupancyIcon /></div>
                        <div className={styles.statInfo}>
                            <span className={styles.statValue}>{reportData.ocupacion}%</span>
                            <span className={styles.statLabel}>Ocupación Hoy</span>
                        </div>
                    </div>
                    <div className={`card ${styles.statCard}`}>
                         <div className={styles.statIcon} style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}><RevenueIcon /></div>
                         <div className={styles.statInfo}>
                            <span className={styles.statValue}>${reportData.ingresosMesActual.toLocaleString('es-CL')}</span>
                            <span className={styles.statLabel}>Ingresos del Mes</span>
                        </div>
                    </div>
                    <div className={`card ${styles.statCard}`}>
                         <div className={styles.statIcon} style={{ backgroundColor: '#fff3e0', color: '#ef6c00' }}><BookingsIcon /></div>
                         <div className={styles.statInfo}>
                            <span className={styles.statValue}>{reportData.nuevasReservasMes}</span>
                            <span className={styles.statLabel}>Nuevas Reservas (Mes)</span>
                        </div>
                    </div>
                </div>

                {reportData.ingresosPorHabitacion && reportData.ingresosPorHabitacion.length > 0 && (
                    <div className="card">
                        <h3 className={styles.chartTitle}>Ingresos por Tipo de Habitación (Mes Seleccionado)</h3>
                        <div className={styles.chartContainer}>
                            {reportData.ingresosPorHabitacion.map((item, index) => (
                                <div key={item.nombre} className={styles.chartBarGroup}>
                                    <div className={styles.chartLabel}>{item.nombre}</div>
                                    <div className={styles.chartBarWrapper}>
                                        <div 
                                            className={styles.chartBar} 
                                            style={{ 
                                                width: `${(item.ingresos / maxIngresos) * 100}%`,
                                                '--animation-delay': `${index * 100}ms`
                                            }}
                                        />
                                    </div>
                                    <div className={styles.chartValue}>
                                        ${item.ingresos.toLocaleString('es-CL')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </>
        );
    };

    return (
        <>
            <div className="container">
                <div className={styles.header}>
                    <h1>Reportes de Gestión</h1>
                    <p>Una vista general y dinámica del rendimiento del hotel.</p>
                </div>

                <div className={styles.layoutContainer}>
                    <aside className={styles.sidebar}>
                        <div className={`card ${styles.sidebarCard}`}>
                            <h4>Filtros y Acciones</h4>
                            <div className={styles.filterGroup}>
                                <label htmlFor="year-select">Año</label>
                                <select id="year-select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                            <div className={styles.filterGroup}>
                                <label htmlFor="month-select">Mes</label>
                                <select id="month-select" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                                    {months.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
                                </select>
                            </div>

                            <hr className={styles.divider} />

                            <div className={styles.exportButtons}>
                                <button onClick={() => handleExportClick('xlsx')} className={`${styles.exportButton} ${styles.exportXLSX}`}>
                                    <ExportIcon />
                                    <span>Exportar a .XLSX</span>
                                </button>
                                <button onClick={() => handleExportClick('pdf')} className={`${styles.exportButton} ${styles.exportPDF}`}>
                                    <ExportIcon />
                                    <span>Exportar a .PDF</span>
                                </button>
                            </div>
                        </div>
                    </aside>

                    <main className={styles.mainContent}>
                        {renderContent()}
                    </main>
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