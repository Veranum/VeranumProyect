import React from 'react';
import styles from './ServiciosPage.module.css';

// Datos de los servicios con todos los elementos incluidos
const servicios = [
  {
    nombre: 'Gimnasio Moderno',
    descripcion: 'Mantén tu rutina de ejercicios en nuestro gimnasio totalmente equipado con máquinas de última generación y un ambiente energizante.',
    imagenUrl: 'https://media.revistagq.com/photos/65b12cd1df908a3c3a4d7373/16:9/w_2560%2Cc_limit/fitness%2520portada.jpg'
  },
  {
    nombre: 'Piscina Temperada',
    descripcion: 'Relájate y disfruta de un baño en nuestra piscina temperada, ideal para desconectar después de un largo día. Disponible todo el año.',
    imagenUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/84/74/ff/cabana-del-lago-hotel.jpg?w=1200&h=-1&s=1'
  },
  {
    nombre: 'Spa y Bienestar',
    descripcion: 'Renueva tu cuerpo y mente en nuestro spa. Ofrecemos una variedad de masajes, tratamientos faciales y corporales para tu máximo relax.',
    imagenUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/f7/03/67/cabina-duo-de-spa-del.jpg?w=700&h=400&s=1'
  },
  {
    nombre: 'Canchas de Tenis',
    descripcion: 'Desafía a tus amigos o practica tu saque en nuestras canchas de tenis profesionales, disponibles para todos nuestros huéspedes.',
    imagenUrl: 'https://www.deportestvc.com/wp-content/uploads/2023/02/principal_cancha-de-tenis.jpg'
  },
  {
    nombre: 'Restaurante Gourmet',
    descripcion: 'Deleita tu paladar con la alta cocina de nuestro restaurante, que fusiona ingredientes locales con técnicas internacionales.',
    imagenUrl: 'https://www.elcalafate.tur.ar/img/anunciantes/310/4restaurant-gourmet-la-bahia.jpg'
  },
  {
    // --- SERVICIO REINCORPORADO ---
    nombre: 'Salones de Eventos',
    descripcion: 'Organiza tus conferencias, reuniones o celebraciones en nuestros salones versátiles y equipados con la mejor tecnología.',
    imagenUrl: 'https://cache.marriott.com/content/dam/marriott-renditions/SCLWH/sclwh-wedding-5860-hor-wide.jpg?output-quality=70&interpolation=progressive-bilinear&downsize=1920px:*'
  }
];

const ServiciosPage = () => {
  return (
    <div className="container">
      <header className={styles.header}>
        <h1>Nuestros Servicios</h1>
        <p>Descubre las experiencias y comodidades que hemos diseñado para hacer tu estadía inolvidable.</p>
      </header>

      <div className={styles.servicesContainer}>
        {servicios.map((servicio, index) => (
          <div key={index} className={`${styles.serviceRow} ${index % 2 !== 0 ? styles.rowReverse : ''}`}>
            <div className={styles.imageWrapper}>
              <img src={servicio.imagenUrl} alt={servicio.nombre} className={styles.serviceImage} />
            </div>
            <div className={styles.textContent}>
              <h2 className={styles.serviceTitle}>{servicio.nombre}</h2>
              <p className={styles.serviceDescription}>{servicio.descripcion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiciosPage;