// src/pages/RoomMatrimonialPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './RoomDetailPage.module.css'; // Estilo compartido

const RoomMatrimonialPage = () => {
  return (
    <div className="container">
      <div className={styles.roomDetailCard}>
        <div className={styles.roomImage}>
          <img src="https://placehold.co/1200x600/0d47a1/ffffff?text=Habitacion+Matrimonial" alt="Habitación matrimonial de lujo" />
        </div>
        <div className={styles.roomInfo}>
          <h1>Habitación Matrimonial Superior</h1>
          <p className={styles.roomPrice}>$90.000 / noche</p>
          <p className={styles.roomDescription}>
            Un refugio de elegancia y confort, con una cama King-size, vistas a la ciudad y un baño de lujo para una estadía romántica. Ideal para parejas que buscan una experiencia inolvidable.
          </p>
          <h3>Servicios Incluidos</h3>
          <ul className={styles.amenitiesList}>
            <li>Cama King-size</li>
            <li>Bañera de hidromasaje</li>
            <li>Smart TV 55" con Netflix</li>
            <li>Minibar de cortesía</li>
            <li>Cafetera Nespresso</li>
          </ul>
          <Link to="/reservar">
            <button className={styles.reserveButton}>Reservar Ahora</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomMatrimonialPage;
