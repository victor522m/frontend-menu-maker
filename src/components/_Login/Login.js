import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (!credentials.username || !credentials.password) {
        throw new Error('Por favor completa todos los campos');
      }

      const authHeader = `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`;
      
      const authCheck = await fetch('/api/menus', {
        headers: { 'Authorization': authHeader }
      });

      if (!authCheck.ok) {
        throw new Error('Credenciales inválidas');
      }

      const userResponse = await fetch('/api/user-info', {
        headers: { 'Authorization': authHeader }
      });
      
      if (!userResponse.ok) {
        throw new Error('Error al obtener información del usuario');
      }

      const userData = await userResponse.json();
      
      localStorage.setItem('authToken', authHeader);
      localStorage.setItem('userRoles', JSON.stringify(userData.roles));
      
      onLogin(userData.roles);
      navigate('/dashboard', { replace: true });

    } catch (error) {
      setError(error.message || 'Error de autenticación');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="login-container">
      <h2>Acceso al Sistema</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Usuario:</label>
          <input
            id="username"
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            placeholder="Introduce tu usuario"
            autoComplete="username"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            id="password"
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Introduce tu contraseña"
            autoComplete="current-password"
            disabled={isLoading}
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading || !credentials.username || !credentials.password}
          className="submit-button"
        >
          {isLoading ? 'Verificando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}

export default Login;
