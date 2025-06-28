// src/components/common/ConfirmationModal.jsx
import React from 'react';
import styles from './ConfirmationModal.module.css';

const ConfirmationModal = ({ show, title, message, onConfirm, onCancel }) => {
    if (!show) {
        return null;
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3>{title}</h3>
                <p>{message}</p>
                <div className={styles.buttonGroup}>
                    <button onClick={onCancel} className={styles.cancelButton}>
                        Cancelar
                    </button>
                    <button onClick={onConfirm} className={styles.confirmButton}>
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
