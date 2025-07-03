// src/services/adminService.js
import api from './api';

// --- GESTIÓN DE HOTELES ---
export const getAllHotelesAdmin = async () => {
    const response = await api.get('/hoteles');
    return response.data;
};
export const createHotel = async (hotelData) => {
    const response = await api.post('/hoteles', hotelData);
    return response.data;
};
export const updateHotel = async (id, hotelData) => {
    const response = await api.put(`/hoteles/${id}`, hotelData);
    return response.data;
};
export const deleteHotel = async (id) => {
    const response = await api.delete(`/hoteles/${id}`);
    return response.data;
};


// --- GESTIÓN DE HABITACIONES ---
export const getHabitacionesByHotel = async (hotelId) => {
    const response = await api.get(`/habitaciones?hotelId=${hotelId || ''}`);
    return response.data;
};
export const createHabitacion = async (data) => {
    const response = await api.post('/habitaciones', data);
    return response.data;
};
// --- CORRECCIÓN: Se elimina el prefijo /admin de la ruta ---
export const updateHabitacion = async (id, data) => {
    const response = await api.put(`/habitaciones/${id}`, data);
    return response.data;
};
// --- CORRECCIÓN: Se elimina el prefijo /admin de la ruta ---
export const deleteHabitacion = async (id) => {
    const response = await api.delete(`/habitaciones/${id}`);
    return response.data;
};

// --- GESTIÓN DE PRECIOS ---
export const setNuevoPrecioHabitacion = async (datosPrecio) => {
    // datosPrecio debe ser un objeto como { habitacion_id: 100, valor: 55000 }
    const response = await api.post('/precios', datosPrecio);
    return response.data;
};


// --- GESTIÓN DE RESERVAS ---
export const getReservas = async () => {
  const response = await api.get('/reservas/admin/all');
  return response.data;
};
export const getReservasByRun = async (run) => {
    const response = await api.get(`/reservas/admin/usuario/${run}`);
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
export const createReservaAdmin = async (data) => {
  const response = await api.post('/reservas/admin', data);
  return response.data;
};


// --- GESTIÓN DE USUARIOS ---
export const getAllUsers = async () => {
    const response = await api.get('/usuarios/admin/all');
    return response.data;
};
export const createUserAdmin = async (userData) => {
    const response = await api.post('/usuarios/admin/create', userData);
    return response.data;
};
export const updateUserAdmin = async (id, userData) => {
    const response = await api.put(`/usuarios/admin/${id}`, userData);
    return response.data;
};
export const deleteUserAdmin = async (id) => {
    const response = await api.delete(`/usuarios/admin/${id}`);
    return response.data;
};

// --- GESTIÓN DE SERVICIOS (NUEVA SECCIÓN) ---
export const getServiciosByHotelAdmin = async (hotelId) => {
    if (!hotelId) return { data: [] };
    const response = await api.get(`/servicios/hotel/${hotelId}`);
    return response.data;
};
export const createServicio = async (data) => {
    const response = await api.post('/servicios', data);
    return response.data;
};
export const updateServicio = async (id, data) => {
    const response = await api.put(`/servicios/${id}`, data);
    return response.data;
};
export const deleteServicio = async (id) => {
    const response = await api.delete(`/servicios/${id}`);
    return response.data;
};

// --- NUEVA FUNCIÓN REPORTES ---
// --- CAMBIO: La función ahora acepta el mes y el año como parámetros ---
export const getReporteGeneral = async (year, month) => {
    // Se construyen los parámetros de la URL si se proporcionan los valores
    const params = new URLSearchParams();
    if (year) params.append('year', year);
    if (month) params.append('month', month);

    const response = await api.get(`/reportes/general?${params.toString()}`);
    return response.data;
};