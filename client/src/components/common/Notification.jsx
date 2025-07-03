import React, { useEffect } from 'react';
import styles from './Notification.module.css';

const Notification = ({ message, type = 'success', show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // La notificación se cierra sola después de 3 segundos

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) {
    return null;
  }

  // El ícono cambia según el tipo de notificación
  const icon = type === 'success' 
    ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;

  return (
    <div className={`${styles.notification} ${styles[type]} ${show ? styles.show : ''}`}>
      <div className={styles.icon}>{icon}</div>
      <p>{message}</p>
      <button onClick={onClose} className={styles.closeButton}>&times;</button>
    </div>
  );
};

export default Notification;