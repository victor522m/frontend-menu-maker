import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateMenu from './CreateMenu';
import CreatePlate from './CreatePlate';
import ManageMenus from './ManageMenus';
import ManagePlates from './ManagePlates';
import '../css/styles.css';
function OwnerDashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  // Recuperar el nombre del usuario desde localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': localStorage.getItem('authToken')
        }
      });
    } catch (error) {
      console.error('Error de logout:', error);
    } finally {
      localStorage.clear();
      window.location.href = '/login'; // Forzar recarga y limpiar estado
    }
  };
  

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',
        borderBottom: '2px solid #eee',
        paddingBottom: '20px'
      }}>
        <h1 style={{ margin: 0, color: '#2c3e50', fontSize: '28px', fontWeight: '600' }}>
          Bienvenido  {username}
        </h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            background: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Cerrar Sesión
        </button>
      </div>

      <h1>
        Panel de Administración
      </h1>

      <div>
        <h2>
          Gestión de Menús
        </h2>
        <CreateMenu />
        <ManageMenus />
      </div>

      <div>
        <h2>
          Gestión de Platos
        </h2>
        <CreatePlate />
        <ManagePlates />
      </div>
    </div>
  );
}

export default OwnerDashboard;
