// src/services/adminService.js
import api from './api';

// --- RESERVATIONS MANAGEMENT ---

export const getReservas = async () => {
  const response = await api.get('/reservas/admin/all');
  return response.data;
};

export const updateReserva = async (id, data) => {
  const response = await api.put(`/reservas/admin/${id}`, data);
  return response.data;
};

export const deleteReserva = async (id) => {
  const response = await api.delete(`/reservas/admin/${id}`);
  return response.data;
};


// --- NUEVAS FUNCIONES PARA GESTIÓN DE HABITACIONES ---

export const createHabitacion = async (data) => {
    const response = await api.post('/habitaciones', data);
    return response.data;
};

export const updateHabitacion = async (id, data) => {
    const response = await api.put(`/habitaciones/${id}`, data);
    return response.data;
};

export const deleteHabitacion = async (id) => {
    const response = await api.delete(`/habitaciones/${id}`);
    return response.data;
};

export const createReservaAdmin = async (data) => {
  const response = await api.post('/reservas/admin', data);
  return response.data;
};

export const getReporteGeneral = async () => {
    const response = await api.get('/reportes/general');
    return response.data;
};