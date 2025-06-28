// src/pages/HabitacionesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllHabitaciones } from '../services/habitacionesService';
import styles from './HabitacionesPage.module.css';

// --- Componente Interno para la Tarjeta de Habitación ---
const RoomDetailCard = ({ habitacion }) => {
  // Lógica para obtener detalles específicos de la habitación (imágenes, etc.)
  const roomDetails = {
    "Doble Clásica": { image: 'https://placehold.co/1200x600/1565c0/ffffff?text=Habitacion+Doble' },
    "Matrimonial Superior": { image: 'https://placehold.co/1200x600/0d47a1/ffffff?text=Habitacion+Matrimonial' },
    "Individual Ejecutiva": { image: 'https://placehold.co/1200x600/6c757d/ffffff?text=Habitacion+Individual' },
  };
  const details = roomDetails[habitacion.nombre] || {};

  return (
    <div className={`${styles.roomDetailCard} ${!habitacion.disponible ? styles.notAvailable : ''}`}>
      <div className={styles.roomImage}>
        <img src={details.image || `https://placehold.co/1200x600/333/fff?text=${habitacion.nombre.replace(' ', '+')}`} alt={habitacion.nombre} />
        {!habitacion.disponible && <div className={styles.notAvailableOverlay}>Reservado Hoy</div>}
      </div>
      <div className={styles.roomInfo}>
        <h2>{habitacion.nombre}</h2>
        <p className={styles.roomPrice}>${habitacion.precio_noche.toFixed(0)} / noche</p>
        <p className={styles.roomDescription}>{habitacion.descripcion}</p>
        <h3>Servicios Incluidos</h3>
        <ul className={styles.amenitiesList}>
          {habitacion.servicios.map((servicio, index) => (<li key={index}>{servicio}</li>))}
        </ul>
        
        {/* --- CORRECCIÓN CLAVE --- */}
        {/* El componente Link ahora apunta a "/reservar" y pasa los datos de la habitación */}
        <Link to="/reservar" state={{ preselectedRoom: habitacion }}>
          <button className={styles.reserveButton} disabled={!habitacion.disponible}>
            {habitacion.disponible ? 'Reservar Esta Habitación' : 'No Disponible Hoy'}
          </button>
        </Link>
      </div>
    </div>
  );
};


// --- Componente Principal de la Página ---
const HabitacionesPage = () => {
  const [habitaciones, setHabitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHabitaciones = async () => {
      try {
        const result = await getAllHabitaciones();
        if (result && Array.isArray(result.data)) {
          const sortedHabitaciones = result.data.sort((a, b) => a.precio_noche - b.precio_noche);
          setHabitaciones(sortedHabitaciones);
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
  }, []);

  if (loading) return <div className="container"><p>Cargando habitaciones...</p></div>;
  if (error) return <div className="container"><p style={{color: 'red', textAlign: 'center'}}>{error}</p></div>;

  return (
    <div className="container">
      <div className={styles.header}>
        <h1>Nuestras Habitaciones</h1>
        <p>Encuentra el espacio perfecto diseñado para tu confort y descanso.</p>
      </div>
      <div className={styles.roomList}>
        {habitaciones.length > 0 ? (
          habitaciones.map(h => <RoomDetailCard key={h._id} habitacion={h} />)
        ) : (
          <p style={{textAlign: 'center'}}>No hay habitaciones para mostrar en este momento.</p>
        )}
      </div>
    </div>
  );
};

export default HabitacionesPage;
