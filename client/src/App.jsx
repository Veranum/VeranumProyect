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
import AdminReportsPage from './pages/AdminReportsPage'; // <-- Se importa la nueva página

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { ReservationProvider } from './context/ReservationContext';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, backgroundColor: 'var(--light-gray-color)' }}>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/habitaciones" element={<HabitacionesPage />} />
          <Route 
            path="/reservar" 
            element={
              <ReservationProvider>
                <ReservationsPage />
              </ReservationProvider>
            } 
          />
          
          {/* Rutas de Administración */}
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/reservas" element={<ManageReservasPage />} />
          <Route path="/admin/habitaciones" element={<ManageHabitacionesPage />} />
          <Route path="/admin/reportes" element={<AdminReportsPage />} /> {/* <-- Se añade la nueva ruta */}

        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
