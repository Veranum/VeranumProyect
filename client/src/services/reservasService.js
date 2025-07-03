// src/services/reservasService.js
import api from './api';

export const getAvailableRooms = async (fecha_inicio, fecha_fin) => {
  // CORRECCIÓN: La ruta correcta es /reservas/disponibles
  const response = await api.get('/reservas/disponibles', {
    params: { fecha_inicio, fecha_fin }
  });
  return response.data;
};

export const createReservation = async (reservationData) => {
  const response = await api.post('/reservas', reservationData);
  return response.data;
};

export const getServiciosByHotel = async (hotelId) => {
    if (!hotelId) return { data: [] };
    const response = await api.get(`/servicios/hotel/${hotelId}`);
    return response.data;
};
