// src/components/reservations/DateRangePicker.jsx
import React from 'react';
import styles from './DateRangePicker.module.css';

const DateRangePicker = ({ fechas, onDateChange }) => {
    
    const handleDateChange = (e) => {
        const { name, value } = e.target;
        
        // Creamos una copia de las fechas actuales
        const newFechas = { ...fechas };

        // Validamos que la fecha de salida no sea anterior a la de llegada
        if (name === 'fin' && newFechas.inicio && value < newFechas.inicio) {
            // Si lo es, ajustamos la fecha de llegada para que sea la misma que la de salida
            newFechas.inicio = value;
        }

        // Actualizamos el valor que cambió
        newFechas[name] = value;

        // Pasamos el objeto de fechas actualizado al componente padre
        onDateChange(newFechas);
    };

    return (
        <div className={styles.dateRangeContainer}>
            <div className={styles.dateInputGroup}>
                <label htmlFor="checkin">Check-in</label>
                <input
                    id="checkin"
                    type="date"
                    name="inicio"
                    value={fechas.inicio}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split('T')[0]} // No se puede reservar en el pasado
                    required
                />
            </div>
            <div className={styles.separator}>→</div>
            <div className={styles.dateInputGroup}>
                <label htmlFor="checkout">Check-out</label>
                <input
                    id="checkout"
                    type="date"
                    name="fin"
                    value={fechas.fin}
                    onChange={handleDateChange}
                    min={fechas.inicio || new Date().toISOString().split('T')[0]} // La salida no puede ser antes de la llegada
                    required
                />
            </div>
        </div>
    );
};

export default DateRangePicker;
