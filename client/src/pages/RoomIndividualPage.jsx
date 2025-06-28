// src/pages/RoomIndividualPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './RoomDetailPage.module.css'; // Estilo compartido

const RoomIndividualPage = () => {
  return (
    <div className="container">
      <div className={styles.roomDetailCard}>
        <div className={styles.roomImage}>
          <img src="https://placehold.co/1200x600/6c757d/ffffff?text=Habitacion+Individual" alt="Habitación individual ejecutiva" />
        </div>
        <div className={styles.roomInfo}>
          <h1>Habitación Individual Ejecutiva</h1>
          <p className={styles.roomPrice}>$60.000 / noche</p>
          <p className={styles.roomDescription}>
            Un espacio funcional y moderno, diseñado para el viajero de negocios. Cuenta con un amplio escritorio, silla ergonómica y todas las comodidades para asegurar productividad y descanso.
          </p>
          <h3>Servicios Incluidos</h3>
          <ul className={styles.amenitiesList}>
            <li>WiFi de alta velocidad</li>
            <li>Escritorio de trabajo</li>
            <li>Caja de seguridad para laptop</li>
            <li>Plancha y tabla de planchar</li>
            <li>Acceso a business center</li>
          </ul>
          <Link to="/reservar">
            <button className={styles.reserveButton}>Reservar Ahora</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomIndividualPage;
