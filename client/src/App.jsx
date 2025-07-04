// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Componentes y Páginas
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute'; // <-- AÑADIR IMPORTACIÓN

// Contexto
import { AuthProvider } from './context/AuthContext';
import { ReservationProvider } from './context/ReservationContext';

// Páginas Públicas
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HabitacionesPage from './pages/HabitacionesPage'; 
import NosotrosPage from './pages/NosotrosPage';
import ServiciosPage from './pages/ServiciosPage';

// Páginas de Usuario
import ReservationsPage from './pages/ReservationsPage';
import MisReservasPage from './pages/MisReservasPage'; // <-- AÑADIR IMPORTACIÓN
import MiCuentaPage from './pages/MiCuentaPage'; // <-- AÑADIR IMPORTACIÓN

// Páginas de Administración
import AdminDashboardPage from './pages/AdminDashboardPage';
import ManageReservasPage from './pages/ManageReservasPage';
import ManageHabitacionesPage from './pages/ManageHabitacionesPage';
import ManageUsuariosPage from './pages/ManageUsuariosPage';
import ManageHotelesPage from './pages/ManageHotelesPage';
import ManageServiciosPage from './pages/ManageServiciosPage';
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
            <Route path="/habitaciones" element={<HabitacionesPage />} /> 
            <Route path="/nosotros" element={<NosotrosPage />} />
            <Route path="/servicios" element={<ServiciosPage />} />
            
            {/* --- Rutas Protegidas de Usuario --- */}
            <Route path="/reservar" element={<ProtectedRoute><ReservationProvider><ReservationsPage /></ReservationProvider></ProtectedRoute>} />
            <Route path="/mis-reservas" element={<ProtectedRoute><MisReservasPage /></ProtectedRoute>} />
            <Route path="/mi-cuenta" element={<ProtectedRoute><MiCuentaPage /></ProtectedRoute>} />
            
            {/* --- Rutas de Administración (idealmente proteger con rol) --- */}
            <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
            <Route path="/admin/reservas" element={<ProtectedRoute><ManageReservasPage /></ProtectedRoute>} />
            <Route path="/admin/habitaciones" element={<ProtectedRoute><ManageHabitacionesPage /></ProtectedRoute>} />
            <Route path="/admin/servicios" element={<ProtectedRoute><ManageServiciosPage /></ProtectedRoute>} />
            <Route path="/admin/usuarios" element={<ProtectedRoute><ManageUsuariosPage /></ProtectedRoute>} />
            <Route path="/admin/hoteles" element={<ProtectedRoute><ManageHotelesPage /></ProtectedRoute>} />
            <Route path="/admin/reportes"element={<ProtectedRoute><AdminReportsPage /></ProtectedRoute>} />

          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;