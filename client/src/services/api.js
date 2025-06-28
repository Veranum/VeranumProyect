// src/services/api.js
import axios from 'axios';

// Crea una instancia de Axios con la URL base de la API
const api = axios.create({
  baseURL: 'http://localhost:5001/api', // Asegúrate de que coincida con el puerto del backend
});

// Interceptor para añadir el token JWT a cada petición autenticada
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;