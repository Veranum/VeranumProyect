// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

const HomePage = () => {
  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <header className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          {/* --- TEXTO ACTUALIZADO --- */}
          <h1>Bienvenido a Hoteles VERANUM</h1>
          <p>Tu refugio de confort y elegancia. Modernizando la tradición para tu mejor estadía.</p>
          <Link to="/reservar">
            <button className={styles.heroButton}>Reservar Ahora</button>
          </Link>
        </div>
      </header>

      {/* --- SECCIÓN DE SERVICIOS --- */}
      <section className={`${styles.features} container`}>
        <h2>Una Experiencia Completa</h2>
        <div className={styles.featuresGrid}>

          <div className={styles.featureCard}>
            <h3>Habitaciones de Lujo</h3>
            <p>Espacios diseñados para tu máximo confort, con vistas y amenidades de primer nivel.</p>
            <Link to="/habitaciones">
              <button className={styles.detailsButton}>Ver más detalles</button>
            </Link>
          </div>

          <div className={styles.featureCard}>
            <h3>Gastronomía Exquisita</h3>
            <p>Sabores que deleitan tu paladar en nuestros restaurantes de autor.</p>
             <Link to="/">
              <button className={styles.detailsButton}>Descubrir Menú</button>
            </Link>
          </div>

          <div className={styles.featureCard}>
            <h3>Eventos Inolvidables</h3>
            <p>Salones y personal experto para tus celebraciones y reuniones corporativas.</p>
             <Link to="/">
              <button className={styles.detailsButton}>Cotizar Evento</button>
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
};

export default HomePage;
