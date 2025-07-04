// src/components/layout/Navbar.jsx
import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import ConfirmationModal from '../common/ConfirmationModal';
import styles from './Navbar.module.css';

// --- Íconos SVG para la UI (sin cambios) ---
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const ChevronDown = () => <svg className={styles.chevronIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;


const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false); // <-- NUEVO ESTADO
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    
    const userDropdownRef = useRef(null); // <-- NUEVO REF

    // Hook para cerrar el dropdown si se hace clic afuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setIsUserDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [userDropdownRef]);

    const handleLogoutClick = () => {
        setIsUserDropdownOpen(false); // Cierra el dropdown
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        logout();
        setShowLogoutModal(false);
        navigate('/');
    };

    const closeAllMenus = () => {
        setIsMobileMenuOpen(false);
        setIsUserDropdownOpen(false);
    };

    return (
        <>
            <header className={styles.navbar}>
                <div className={`${styles.navContainer} container`}>
                    <Link to="/" className={styles.navLogo}>VERANUM</Link>

                    <div className={styles.navRight}>
                        <nav className={styles.desktopMenu}>
                            <Link to="/habitaciones" className={styles.navLink}>Habitaciones</Link>
                            <Link to="/servicios" className={styles.navLink}>Servicios</Link>
                            <Link to="/nosotros" className={styles.navLink}>Nosotros</Link>
                            
                            {user && (user.rol === 'admin' || user.rol === 'gerente') && (
                                <Link to="/admin" className={styles.navLink}>Dashboard</Link>
                            )}
                        </nav>

                        <div className={styles.navActions}>
                            <div className={styles.separator}></div>
                            <div className={styles.userSection}>
                                {user ? (
                                    // --- INICIO: SECCIÓN DE USUARIO MODIFICADA ---
                                    <div className={styles.dropdown} ref={userDropdownRef}>
                                        <button onClick={() => setIsUserDropdownOpen(prev => !prev)} className={styles.userInfoButton}>
                                            <UserIcon />
                                            <span>{user.nombre}</span>
                                            <ChevronDown />
                                        </button>
                                        {isUserDropdownOpen && (
                                            <div className={styles.dropdownContent}>
                                                <Link to="/mi-cuenta" onClick={() => setIsUserDropdownOpen(false)}>Mi Perfil</Link>
                                                <Link to="/mis-reservas" onClick={() => setIsUserDropdownOpen(false)}>Mis Reservas</Link>
                                                <div className={styles.dropdownSeparator}></div>
                                                <button onClick={handleLogoutClick} className={styles.dropdownButton}>
                                                    <LogoutIcon />
                                                    <span>Cerrar Sesión</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    // --- FIN: SECCIÓN DE USUARIO MODIFICADA ---
                                ) : (
                                    <Link to="/login" className={styles.loginLink}>
                                        <UserIcon />
                                        <span>Iniciar Sesión</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    <button className={styles.mobileMenuButton} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                </div>
            </header>

            <div className={`${styles.mobileMenuOverlay} ${isMobileMenuOpen ? styles.open : ''}`}>
                 <Link to="/habitaciones" onClick={closeAllMenus}>Habitaciones</Link>
                 <Link to="/servicios" onClick={closeAllMenus}>Servicios</Link>
                 <Link to="/nosotros" onClick={closeAllMenus}>Nosotros</Link>
                 {user && (user.rol === 'admin' || user.rol === 'gerente') && (
                    <Link to="/admin" onClick={closeAllMenus}>Dashboard</Link>
                 )}
            </div>

            <ConfirmationModal
                show={showLogoutModal}
                title="Cerrar Sesión"
                message="¿Estás seguro de que quieres cerrar la sesión?"
                onConfirm={confirmLogout}
                onCancel={() => setShowLogoutModal(false)}
            />
        </>
    );
};

export default Navbar;