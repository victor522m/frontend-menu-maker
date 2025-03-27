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
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '10px', 
        padding: '30px',
        boxShadow: '0 2px 15px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          borderBottom: '2px solid #eee',
          paddingBottom: '20px'
        }}>
          <h1 style={{ 
            margin: 0, 
            color: '#2c3e50', 
            fontSize: '28px',
            fontWeight: '600'
          }}>
            Acceso al Sistema
          </h1>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#ff4444',
            color: 'white',
            padding: '15px',
            borderRadius: '5px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#2c3e50',
              fontWeight: '500'
            }}>
              Usuario:
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Introduce tu usuario"
              autoComplete="username"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px 15px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                fontSize: '16px',
                transition: 'border-color 0.3s',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#2c3e50',
              fontWeight: '500'
            }}>
              Contraseña:
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Introduce tu contraseña"
              autoComplete="current-password"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px 15px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                fontSize: '16px',
                transition: 'border-color 0.3s',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading || !credentials.username || !credentials.password}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: isLoading ? '#bdc3c7' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.3s, transform 0.2s',
              ':hover': {
                backgroundColor: isLoading ? null : '#45a049',
                transform: isLoading ? null : 'translateY(-1px)'
              }
            }}
          >
            {isLoading ? (
              <span>Verificando...</span>
            ) : (
              <span>Ingresar</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
