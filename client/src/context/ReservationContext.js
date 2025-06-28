// src/context/ReservationContext.js
import React, { createContext, useState } from 'react';

const ReservationContext = createContext(null);

export const ReservationProvider = ({ children }) => {
  const [reservationDetails, setReservationDetails] = useState({
    fechas: null,
    habitacion: null,
    huespedes: 1,
  });

  const setFechas = (fechas) => {
    setReservationDetails(prev => ({ ...prev, fechas }));
  };
  
  const setHabitacion = (habitacion) => {
    setReservationDetails(prev => ({ ...prev, habitacion }));
  };

  return (
    <ReservationContext.Provider value={{ reservationDetails, setFechas, setHabitacion }}>
      {children}
    </ReservationContext.Provider>
  );
};

export default ReservationContext;