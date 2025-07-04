import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { getMyProfile } from '../services/usuarioService';
import styles from './MiCuentaPage.module.css';

// --- Iconos para la UI ---
const UserAvatarIcon = () => (
    <svg className={styles.avatarIcon} xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);
const FieldUserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const FieldIdIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="M6 10h4m-4 4h4m4-4h4m-4 4h4"></path></svg>;
const FieldMailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const FieldCalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;


const MiCuentaPage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const response = await getMyProfile();
                setProfile(response.data);
            } catch (err) {
                setError('No se pudo cargar la información de tu perfil.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    if (loading) {
        return <div className="container"><p className={styles.loadingMessage}>Cargando perfil...</p></div>;
    }

    if (error) {
        return <div className="container"><p className={styles.errorMessage}>{error}</p></div>;
    }

    if (!profile) {
        return <div className="container"><p className={styles.centeredMessage}>No se encontró la información del perfil.</p></div>;
    }

    return (
        <div className="container">
            <div className={styles.header}>
                <h1>Mi Cuenta</h1>
                <p>Gestiona tu información personal y preferencias.</p>
            </div>
            
            <div className={styles.profileLayout}>
                {/* Columna Izquierda: Avatar e Info Básica */}
                <div className={`${styles.avatarCard} card`}>
                    <div className={styles.avatarCircle}>
                        <UserAvatarIcon />
                    </div>
                    <h2>{profile.nombre}</h2>
                    <p>{profile.email}</p>
                    <span className={styles.role}>{profile.rol}</span>
                </div>

                {/* Columna Derecha: Detalles de la Cuenta */}
                <div className={`${styles.detailsCard} card`}>
                    <h3>Detalles de la Cuenta</h3>
                    <div className={styles.profileField}>
                        <div className={styles.fieldIcon}><FieldUserIcon /></div>
                        <label>Nombre Completo</label>
                        <span>{profile.nombre}</span>
                    </div>
                    <div className={styles.profileField}>
                        <div className={styles.fieldIcon}><FieldIdIcon /></div>
                        <label>RUN</label>
                        <span>{profile._id}</span>
                    </div>
                    <div className={styles.profileField}>
                        <div className={styles.fieldIcon}><FieldMailIcon /></div>
                        <label>Email</label>
                        <span>{profile.email}</span>
                    </div>
                    <div className={styles.profileField}>
                        <div className={styles.fieldIcon}><FieldCalendarIcon /></div>
                        <label>Miembro desde</label>
                        <span>{new Date(profile.createdAt).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MiCuentaPage;