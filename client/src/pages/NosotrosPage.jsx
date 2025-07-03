import React from 'react';
import styles from './NosotrosPage.module.css';

// --- Íconos para las secciones ---
const TargetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const DiamondIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z"/></svg>;
const BedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4v16h20V4Z"/><path d="M2 10h20"/><path d="M6 14v-4"/></svg>;
const RocketIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.3.05-3.11.65-.9.09-2.3-.05-3.1S8.68 8.46 8.4 8c-1.26-1.5-5-2-5-2s.5 3.74 2 5c.84.71 2.3.7 3.1.05.9-.65 2.3-.09 3.1.05s1.65 1.48 1.5 2.24c1.26 1.5 2 5 2 5s-3.74-.5-5-2c-.71-.84-.7-2.3-.05-3.11-.65-.9-.09-2.3.05-3.1s1.48-1.65 2.24-1.5Z"/></svg>;
// --- NUEVO ÍCONO PARA LA HISTORIA ---
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M7 14h2"/><path d="M12 14h2"/><path d="M17 14h2"/><path d="M7 9h2"/><path d="M12 9h2"/><path d="M17 9h2"/></svg>;


const NosotrosPage = () => {
    return (
        <div className={styles.nosotrosPage}>
            {/* HERO SECTION */}
            <header className={styles.heroSection}>
                <div className={styles.heroOverlay}></div>
                <div className="container">
                    <h1 className={styles.heroTitle}>30 Años Modernizando la Tradición Hotelera</h1>
                    <p className={styles.heroSubtitle}>En Hoteles VERANUM, combinamos décadas de experiencia con una visión fresca para ofrecerte una estadía inolvidable.</p>
                </div>
            </header>

            {/* SECCIÓN DE HISTORIA CON ICONO */}
            <section className={styles.storySection}>
                <div className="container">
                    <div className={styles.storyGrid}>
                        <div className={styles.storyIconWrapper}>
                            <HistoryIcon />
                        </div>
                        <div className={styles.storyContent}>
                            <h2>Nuestra Historia</h2>
                            <p>
                                Fundada hace 30 años, VERANUM nació con la misión de ser más que un simple alojamiento; aspiramos a ser un segundo hogar para nuestros huéspedes. Desde nuestros inicios en Santiago y la V Región, nos hemos destacado por ser una empresa cercana, manteniendo un contacto fluido y una relación de confianza con cada cliente que nos visita.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* NUEVA SECCIÓN DE VALORES */}
            <section className={styles.valuesSection}>
                <div className="container">
                    <div className={styles.valuesGrid}>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}><DiamondIcon /></div>
                            <h3>Calidad Superior</h3>
                            <p>Compromiso con la excelencia en cada detalle de tu estadía.</p>
                        </div>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}><BedIcon /></div>
                            <h3>Confort Absoluto</h3>
                            <p>Espacios diseñados para tu máximo descanso y bienestar.</p>
                        </div>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}><RocketIcon /></div>
                            <h3>Innovación Constante</h3>
                            <p>Modernizamos la tradición para ofrecerte siempre lo mejor.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* MISSION & VISION SECTION */}
            <section className={styles.missionVisionSection}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Nuestros Principios</h2>
                    <div className={styles.missionVisionGrid}>
                        <div className={styles.card}>
                            <div className={styles.cardIcon}><TargetIcon /></div>
                            <h3>Nuestra Misión</h3>
                            <p>Ofrecer una experiencia de hospitalidad excepcional, donde cada huésped se sienta valorado y cuidado, combinando confort, servicios de calidad y una atención personalizada.</p>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.cardIcon}><EyeIcon /></div>
                            <h3>Nuestra Visión</h3>
                            <p>Ser la cadena hotelera líder en Chile reconocida por nuestra capacidad de innovar sin perder la calidez de la tradición, optimizando nuestra gestión a través de la tecnología.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default NosotrosPage;