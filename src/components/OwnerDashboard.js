import React, { useState, useEffect } from 'react';
//import CreateMenu from './CreateMenu';
import { useNavigate } from 'react-router-dom';
import ManageMenus from './ManageMenus';
//import CreatePlate from './CreatePlate';
import ManagePlates from './ManagePlates';
import '../css/styles.css';
import api from '../services/api.js';

function OwnerDashboard() {
  const [username, setUsername] = useState('');
  const [menus, setMenus] = useState([]); // Estado para los menús
  const [plates, setPlates] = useState([]); // Estado para los platos

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    fetchData(); // Al cargar, obtenemos los datos iniciales
  }, []); // Llamamos solo una vez cuando se carga el componente

  const fetchData = async () => {
    try {
      const menuResponse = await api.get('/api/menus', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      setMenus(menuResponse.data);

      const plateResponse = await api.get('/api/platos', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      setPlates(plateResponse.data);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };



// dentro del componente:
const navigate = useNavigate();

const handleLogout = async () => {
  try {
    await api.get('/api/logout', {
      method: 'POST',
      headers: {
        'Authorization': localStorage.getItem('authToken')
      }
    });
  } catch (error) {
    console.error('Error de logout:', error);
  } finally {
    localStorage.clear();
    navigate('/'); // redirige al login (si usas HashRouter, se adapta automáticamente)
  }
};


  // Funciones de actualización cuando se crean menús o platos
  const handleMenuCreated = async () => {
    await fetchData(); // Actualizamos menús y platos
  };

  const handlePlateCreated = async () => {
    await fetchData(); // Actualizamos menús y platos
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '20px' }}>
        <h1 style={{ margin: 0, color: '#2c3e50', fontSize: '28px', fontWeight: '600' }}>
          Bienvenido {username}
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

      <h1>Panel de Administración</h1>

      <div>
        <h2>Gestión de Menús</h2>
        <ManageMenus menus={menus} onMenuCreated={handleMenuCreated} />
      </div>

      <div>
        <h2>Gestión de Platos</h2>
        <ManagePlates plates={plates} onPlateCreated={handlePlateCreated} />
      </div>
    </div>
  );
}

export default OwnerDashboard;

