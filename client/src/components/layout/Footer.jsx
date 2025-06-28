// src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

// --- Íconos SVG como componentes de React ---
const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const InstagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;


const Footer = () => (
    <footer className={styles.footer}>
        <div className={`${styles.footerContainer} container`}>
            {/* --- Columna 1: Información de Confianza --- */}
            <div className={styles.footerColumn}>
                <h3 className={styles.logo}>VERANUM</h3>
                <p className={styles.description}>30 años de hospitalidad, ahora con la comodidad que mereces.</p>
                <div className={styles.contactInfo}>
                    <p><LocationIcon /> <span>Av. Libertador 123, Santiago, Chile</span></p>
                    <p><PhoneIcon /> <span>+56 2 1234 5678</span></p>
                    <p><MailIcon /> <span>contacto@veranum.cl</span></p>
                </div>
            </div>

            {/* --- Columna 2: Navegación --- */}
            <div className={styles.footerColumn}>
                <h3>Hotel</h3>
                <ul>
                    <li><Link to="/">Sobre Nosotros</Link></li>
                    <li><Link to="/habitaciones">Habitaciones</Link></li>
                    <li><Link to="/">Restaurante</Link></li>
                    <li><Link to="/">Servicios</Link></li>
                </ul>
            </div>
            
            {/* --- Columna 3: Reservas y Eventos --- */}
            <div className={styles.footerColumn}>
                <h3>Reservas</h3>
                <ul>
                    <li><Link to="/reservar">Realizar Reserva</Link></li>
                    <li><Link to="/">Mis Reservas</Link></li>
                    <li><Link to="/">Ofertas y Promociones</Link></li>
                    <li><Link to="/">Eventos Corporativos</Link></li>
                </ul>
            </div>

            {/* --- Columna 4: Comunidad y Marketing --- */}
            <div className={styles.footerColumn}>
                <h3>Síguenos</h3>
                <p>Recibe nuestras promociones exclusivas y novedades.</p>
                <form className={styles.newsletterForm}>
                    <input type="email" placeholder="Tu correo electrónico" />
                    <button type="submit">Suscribirse</button>
                </form>
                <div className={styles.socialIcons}>
                    {/* CORRECCIÓN: Se reemplaza '#' por '/' para que sea un enlace válido */}
                    <a href="/" aria-label="Instagram"><InstagramIcon /></a>
                    <a href="/" aria-label="Facebook"><FacebookIcon /></a>
                </div>
            </div>
        </div>
        <div className={styles.footerBottom}>
            <p>© {new Date().getFullYear()} Hotel VERANUM. Todos los derechos reservados.</p>
            <div className={styles.legalLinks}>
                {/* CORRECCIÓN: Se reemplaza '#' por '/' para que sea un enlace válido */}
                <Link to="/">Política de Privacidad</Link>
                <span>•</span>
                <Link to="/">Términos y Condiciones</Link>
            </div>
        </div>
    </footer>
);

export default Footer;
