// src/pages/LoginPage.jsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import styles from './LoginPage.module.css'; // Usaremos un archivo de estilos dedicado

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // --- INICIO: NUEVO ESTADO PARA VER CONTRASEÑA ---
  const [showPassword, setShowPassword] = useState(false);
  // --- FIN: NUEVO ESTADO ---
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/'); // Redirigir al dashboard tras el login exitoso
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión. Verifique sus credenciales.');
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formCard}>
        <h2>Bienvenido de Vuelta</h2>
        <p>Accede a tu cuenta para gestionar tus reservas y perfil.</p>
        <form onSubmit={handleSubmit}>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <div className={styles.inputGroup}>
            <label htmlFor="email">Correo Electrónico</label>
            <input 
              type="email" 
              id="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="tu@email.com" 
              required 
            />
          </div>
          {/* --- INICIO: CAMPO DE CONTRASEÑA ACTUALIZADO --- */}
          <div className={styles.inputGroup}>
            <label htmlFor="password">Contraseña</label>
            <div className={styles.passwordInputContainer}>
              <input 
                type={showPassword ? "text" : "password"}
                id="password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className={styles.passwordToggle}
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>
          {/* --- FIN: CAMPO DE CONTRASEÑA ACTUALIZADO --- */}
          <button type="submit" className={styles.submitButton}>Iniciar Sesión</button>
        </form>
        <div className={styles.switchFormLink}>
          <p>¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;