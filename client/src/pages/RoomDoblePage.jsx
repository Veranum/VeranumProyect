// src/pages/RoomDoblePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './RoomDetailPage.module.css'; // Usaremos un estilo compartido

const RoomDoblePage = () => {
  return (
    <div className="container">
      <div className={styles.roomDetailCard}>
        <div className={styles.roomImage}>
          <img src="https://placehold.co/1200x600/1565c0/ffffff?text=Habitacion+Doble" alt="Habitación con dos camas" />
        </div>
        <div className={styles.roomInfo}>
          <h1>Habitación Doble Clásica</h1>
          <p className={styles.roomPrice}>$75.000 / noche</p>
          <p className={styles.roomDescription}>
            Una habitación espaciosa y luminosa, equipada con dos cómodas camas individuales, perfecta para amigos o colegas que viajan juntos. El diseño funcional y el ambiente acogedor garantizan una estadía placentera y reparadora.
          </p>
          <h3>Servicios Incluidos</h3>
          <ul className={styles.amenitiesList}>
            <li>WiFi de alta velocidad</li>
            <li>TV Cable HD</li>
            <li>Aire Acondicionado</li>
            <li>Servicio a la habitación</li>
            <li>Baño privado con amenities</li>
          </ul>
          <Link to="/reservar">
            <button className={styles.reserveButton}>Reservar Ahora</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomDoblePage;
