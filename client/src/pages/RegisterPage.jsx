// src/pages/RegisterPage.jsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { register } from '../services/authService';
import styles from './LoginPage.module.css'; // Reutilizaremos los estilos del login

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext); // Usaremos el login para iniciar sesión automáticamente
  const navigate = useNavigate();

  const { nombre, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      // Registra al usuario
      await register({ nombre, email, password });
      
      // Inicia sesión automáticamente después del registro
      await login(email, password);

      navigate('/'); // Redirige al inicio después del registro y login exitosos
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la cuenta. Intente con otro correo.');
    }
    setLoading(false);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h2>Crear una Cuenta</h2>
        <p>Regístrate para reservar de forma más rápida y sencilla.</p>
        <form onSubmit={handleSubmit}>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <div className={styles.inputGroup}>
            <label htmlFor="nombre">Nombre Completo</label>
            <input type="text" id="nombre" name="nombre" value={nombre} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Correo Electrónico</label>
            <input type="email" id="email" name="email" value={email} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" name="password" value={password} onChange={handleChange} required minLength="6" />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={handleChange} required />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>
        <div className={styles.registerLink}>
          <p>¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
