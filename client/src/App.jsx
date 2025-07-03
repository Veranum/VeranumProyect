// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ReservationsPage from './pages/ReservationsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import HabitacionesPage from './pages/HabitacionesPage'; 
import ManageReservasPage from './pages/ManageReservasPage';
import ManageHabitacionesPage from './pages/ManageHabitacionesPage';
import ManageUsuariosPage from './pages/ManageUsuariosPage';
import ManageHotelesPage from './pages/ManageHotelesPage';
import ManageServiciosPage from './pages/ManageServiciosPage'; // <-- AÑADIR
import NosotrosPage from './pages/NosotrosPage'; // <-- AÑADIR
import ServiciosPage from './pages/ServiciosPage';


import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { AuthProvider } from './context/AuthContext'; // Asegúrate de tener AuthProvider
import { ReservationProvider } from './context/ReservationContext';
import AdminReportsPage from './pages/AdminReportsPage';


function App() {
  return (
    <AuthProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1, backgroundColor: 'var(--light-gray-color)' }}>
          <Routes>
            {/* --- Rutas Públicas --- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Esta es la ruta correcta para la vista de cliente */}
            <Route path="/habitaciones" element={<HabitacionesPage />} /> 
            <Route path="/nosotros" element={<NosotrosPage />} /> {/* <-- AÑADIR ESTA LÍNEA */}
            <Route path="/servicios" element={<ServiciosPage />} />
            <Route 
              path="/reservar" 
              element={
                <ReservationProvider>
                  <ReservationsPage />
                </ReservationProvider>
              } 
            />
            
            {/* --- Rutas de Administración --- */}
            {/* Aquí podrías envolver cada ruta con un componente AdminRoute para mayor seguridad */}
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/reservas" element={<ManageReservasPage />} />
            {/* Esta es la ruta correcta para la vista de administrador */}
            <Route path="/admin/habitaciones" element={<ManageHabitacionesPage />} />
            <Route path="/admin/servicios" element={<ManageServiciosPage />} /> {/* <-- AÑADIR */}
            <Route path="/admin/usuarios" element={<ManageUsuariosPage />} />
            <Route path="/admin/hoteles" element={<ManageHotelesPage />} />
            <Route path="/admin/reportes"element={<AdminReportsPage  />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;