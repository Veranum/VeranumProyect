// src/services/usuarioService.js
import api from './api';

// Obtiene los datos del perfil del usuario logueado desde el endpoint /auth/me
export const getMyProfile = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};