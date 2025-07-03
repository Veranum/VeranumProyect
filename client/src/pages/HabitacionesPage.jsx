import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllHabitaciones } from '../services/habitacionesService';
import styles from './HabitacionesPage.module.css';

// Función para obtener la URL de la imagen correcta según el nombre
const getRoomImageUrl = (roomName) => {
    const name = roomName.toLowerCase();
    if (name.includes('doble')) {
        return 'https://images-new.pxsol.com/0yXQIHHgg6QPIqHMdt5cFppRjSdRImPYVZKA8Zjp0F0/rs:fill:600:400:1/q:80/plain/https://files-public-web.s3-us-west-2.amazonaws.com/1217/company/library/user/209394497137de94aa9d4ab3e8a7f395b32600345c1.jpeg@jpeg';
    } else if (name.includes('individual')) {
        return 'https://www.abbahoteles.com/idb/72372/hotel_balmoral_individual-600x400.jpg';
    } else if (name.includes('matrimonial')) {
        return 'https://images-new.pxsol.com/9FLpVy6oyn3sqdLXN3zlaXcw1fwR07w8RFspDLvB3L8/rs:fill:600:400:1/q:80/plain/https://files-public-web.s3-us-west-2.amazonaws.com/1278/company/library/user/275619112326a7a9457806ca4155c6aebba80e43004.jpg@jpg';
    } else {
        return `https://placehold.co/600x400/005f73/ffffff?text=${roomName.replace(' ', '+')}`;
    }
};

// Componente para la Tarjeta de Resumen de Habitación
const RoomSummaryCard = ({ habitacion, onViewDetails }) => {
    const roomImage = getRoomImageUrl(habitacion.nombre);

    return (
        <div className={`${styles.summaryCard} ${!habitacion.disponible ? styles.notAvailableSummary : ''}`}>
            <div className={styles.summaryImageContainer}>
                <img src={roomImage} alt={habitacion.nombre} />
                {!habitacion.disponible && <div className={styles.notAvailableBadge}>Reservada</div>}
            </div>
            <div className={styles.summaryInfo}>
                <h3>{habitacion.nombre}</h3>
                <p className={styles.summaryPrice}>${(habitacion.precio || 0).toLocaleString('es-CL')} / noche</p>
                <button onClick={() => onViewDetails(habitacion)} className={styles.detailsButton}>
                    Ver Detalles
                </button>
            </div>
        </div>
    );
};

// Componente para el Modal con los Detalles Completos
const RoomDetailModal = ({ habitacion, onClose }) => {
    const roomImage = getRoomImageUrl(habitacion.nombre);
    
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button className={styles.closeModalButton} onClick={onClose}>&times;</button>
                <div className={styles.modalImage}><img src={roomImage} alt={habitacion.nombre} /></div>
                <div className={styles.modalInfo}>
                    <h2>{habitacion.nombre}</h2>
                    <p className={styles.modalPrice}>${(habitacion.precio || 0).toLocaleString('es-CL')} / noche</p>
                    <p className={styles.modalDescription}>{habitacion.descripcion}</p>
                    <h3>Servicios Incluidos</h3>
                    <ul className={styles.amenitiesList}>{habitacion.servicios?.map((servicio, index) => (<li key={index}>{servicio}</li>))}</ul>
                    <Link to="/reservar" state={{ preselectedRoom: habitacion }}>
                        <button className={styles.reserveButton} disabled={!habitacion.disponible}>
                            {habitacion.disponible ? 'Reservar Esta Habitación' : 'No Disponible'}
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

// --- CONSTANTE MOVIDA FUERA DEL COMPONENTE ---
const ciudadesDisponibles = ['Santiago', 'Viña del Mar'];

// Componente Principal de la Página
const HabitacionesPage = () => {
    const [habitaciones, setHabitaciones] = useState([]);
    const [filteredHabitaciones, setFilteredHabitaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedRoom, setSelectedRoom] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [disponibilidad, setDisponibilidad] = useState('todas');
    const [ciudad, setCiudad] = useState('todas');
    const [orden, setOrden] = useState('precio-asc');
    
    useEffect(() => {
        const fetchHabitaciones = async () => {
            setLoading(true);
            try {
                const result = await getAllHabitaciones();
                if (result && Array.isArray(result.data)) {
                    const habitacionesConCiudad = result.data.map((hab, index) => ({
                        ...hab,
                        ciudad: ciudadesDisponibles[index % ciudadesDisponibles.length]
                    }));
                    setHabitaciones(habitacionesConCiudad);
                } else {
                    setError('No se pudo obtener la lista de habitaciones.');
                }
            } catch (err) {
                setError('No se pudieron cargar las habitaciones en este momento.');
            } finally {
                setLoading(false);
            }
        };
        fetchHabitaciones();
    }, []); // El arreglo de dependencias ahora está correcto porque 'ciudadesDisponibles' es estable.

    useEffect(() => {
        let result = [...habitaciones];

        if (searchTerm) {
            result = result.filter(hab =>
                hab.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                hab.ciudad.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (disponibilidad !== 'todas') {
            result = result.filter(hab => 
                (disponibilidad === 'disponible' ? hab.disponible : !hab.disponible)
            );
        }

        if (ciudad !== 'todas') {
            result = result.filter(hab => hab.ciudad === ciudad);
        }

        switch (orden) {
            case 'precio-asc':
                result.sort((a, b) => a.precio - b.precio);
                break;
            case 'precio-desc':
                result.sort((a, b) => b.precio - a.precio);
                break;
            case 'categoria':
                result.sort((a, b) => a.nombre.localeCompare(b.nombre));
                break;
            default:
                break;
        }

        setFilteredHabitaciones(result);
    }, [searchTerm, disponibilidad, ciudad, orden, habitaciones]);

    return (
        <div className="container">
            <div className={styles.header}>
                <h1>Nuestras Habitaciones</h1>
                <p>Encuentra el espacio perfecto diseñado para tu confort y descanso.</p>
            </div>

            <div className={`card ${styles.filterContainer}`}>
                <div className={styles.searchGroup}>
                    <label htmlFor="search-input">Buscar</label>
                    <input
                        id="search-input"
                        type="text"
                        placeholder="Buscar por nombre o ciudad..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className={styles.filterGroup}>
                    <label htmlFor="disponibilidad">Disponibilidad</label>
                    <select id="disponibilidad" value={disponibilidad} onChange={(e) => setDisponibilidad(e.target.value)}>
                        <option value="todas">Todas</option>
                        <option value="disponible">Disponible</option>
                        <option value="no-disponible">No Disponible</option>
                    </select>
                </div>
                <div className={styles.filterGroup}>
                    <label htmlFor="ciudad">Ciudad</label>
                    <select id="ciudad" value={ciudad} onChange={(e) => setCiudad(e.target.value)}>
                        <option value="todas">Todas las ciudades</option>
                        {ciudadesDisponibles.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div className={styles.filterGroup}>
                    <label htmlFor="orden">Ordenar por</label>
                    <select id="orden" value={orden} onChange={(e) => setOrden(e.target.value)}>
                        <option value="precio-asc">Precio (menor a mayor)</option>
                        <option value="precio-desc">Precio (mayor a menor)</option>
                        <option value="categoria">Categoría (A-Z)</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className={styles.loadingContainer}><p>Cargando habitaciones...</p></div>
            ) : error ? (
                 <p className={styles.noResults}>{error}</p>
            ) : (
                <div className={styles.roomList}>
                    {filteredHabitaciones.length > 0 ? (
                        filteredHabitaciones.map(h =>
                            <RoomSummaryCard
                                key={h._id}
                                habitacion={h}
                                onViewDetails={setSelectedRoom}
                            />
                        )
                    ) : (
                        <p className={styles.noResults}>No se encontraron habitaciones que coincidan con tus criterios.</p>
                    )}
                </div>
            )}

            {selectedRoom && <RoomDetailModal habitacion={selectedRoom} onClose={() => setSelectedRoom(null)} />}
        </div>
    );
};

export default HabitacionesPage;