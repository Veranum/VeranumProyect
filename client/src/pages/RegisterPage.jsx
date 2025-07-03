// src/pages/RegisterPage.jsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { register } from '../services/authService';
import styles from './LoginPage.module.css'; // Reutilizamos los mismos estilos

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    run_cliente: '',
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // --- INICIO: NUEVO ESTADO PARA VER CONTRASEÑAS ---
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false
  });
  // --- FIN: NUEVO ESTADO ---
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { run_cliente, nombre, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- INICIO: FUNCIÓN PARA ALTERNAR VISIBILIDAD ---
  const toggleShowPassword = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };
  // --- FIN: FUNCIÓN ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register({ run_cliente, nombre, email, password });
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la cuenta. Intente con otro correo.');
    }
    setLoading(false);
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formCard}>
        <h2>Crea tu Cuenta en VERANUM</h2>
        <p>Regístrate para reservar de forma más rápida y sencilla.</p>
        <form onSubmit={handleSubmit}>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <div className={styles.inputGroup}>
            <label htmlFor="run_cliente">RUN</label>
            <input type="text" id="run_cliente" name="run_cliente" value={run_cliente} onChange={handleChange} placeholder="Ej: 12345678-9" required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="nombre">Nombre Completo</label>
            <input type="text" id="nombre" name="nombre" value={nombre} onChange={handleChange} placeholder="Ej: Juan Pérez" required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Correo Electrónico</label>
            <input type="email" id="email" name="email" value={email} onChange={handleChange} placeholder="tu@email.com" required />
          </div>
          {/* --- INICIO: CAMPO DE CONTRASEÑA ACTUALIZADO --- */}
          <div className={styles.inputGroup}>
            <label htmlFor="password">Contraseña</label>
            <div className={styles.passwordInputContainer}>
              <input type={showPasswords.password ? "text" : "password"} id="password" name="password" value={password} onChange={handleChange} required minLength="6" />
              <button type="button" onClick={() => toggleShowPassword('password')} className={styles.passwordToggle}>
                {showPasswords.password ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>
          {/* --- FIN: CAMPO DE CONTRASEÑA ACTUALIZADO --- */}
          {/* --- INICIO: CAMPO DE CONFIRMAR CONTRASEÑA ACTUALIZADO --- */}
          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <div className={styles.passwordInputContainer}>
              <input type={showPasswords.confirmPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={handleChange} required />
              <button type="button" onClick={() => toggleShowPassword('confirmPassword')} className={styles.passwordToggle}>
                {showPasswords.confirmPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>
          {/* --- FIN: CAMPO DE CONFIRMAR CONTRASEÑA ACTUALIZADO --- */}
          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>
        <div className={styles.switchFormLink}>
          <p>¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;