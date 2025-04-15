import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { toast } from 'react-toastify';

function EmployedDashboard() {
  const [menus, setMenus] = useState([]);
  //const navigate = useNavigate();
  const [username, setUsername] = useState('');

  // Recuperar el nombre del usuario desde localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await api.get('/api/menus', {
          headers: {
            'Authorization': localStorage.getItem('authToken'),
          },
        });
    
        // Axios maneja automáticamente la conversión a JSON
        setMenus(response.data);
      } catch (error) {
        console.error('Error obteniendo menús:', error);
    
        // Puedes imprimir detalles adicionales si la API devuelve un mensaje de error
        if (error.response) {
          console.error('Detalles del error:', error.response.data);
        }
      }
    };
    

    fetchMenus();
  }, []);

  const handleGeneratePDF = async (menuId) => {
    try {
      const porcentajeIva = 10; // Puedes ajustar este valor según tus necesidades
      const url = `/api/menus/pdf/${menuId}/${porcentajeIva}`;
  
      const response = await api.get(url, {
        headers: {
          'Authorization': localStorage.getItem('authToken'),
        },
        responseType: 'blob', // Importante para recibir archivos binarios
      });
  
      // Crear un enlace para descargar el PDF
      const pdfUrl = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `menu_${menuId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(pdfUrl); // Liberar memoria
  
    } catch (error) {
      console.error('Error al generar PDF:', error);
    }
  };



// dentro del componente:
const navigate = useNavigate();

const handleLogout = async () => {
  try {
    // Llamada a la API para cerrar sesión
    await api.post('/api/logout');
    toast.success('Sesión cerrada correctamente');
  } catch (error) {
    // Manejo de error si la API falla
    toast.error('Error al cerrar sesión');
    console.error('Logout error:', error);
  } finally {
    // Limpiar los datos del usuario del almacenamiento local
    localStorage.clear();
    
    // Redirigir al login
    window.location.href = 'https://victor522m.github.io/frontend-menu-maker/#/';
  // Redirige explícitamente al login
  }
};



  




  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Bienvenido Empleado {username}</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            background: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Cerrar Sesión
        </button>
      </div>

      <div>
        <h2>Menús Disponibles</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {menus.map((menu) => (
            <li
              key={menu.id}
              style={{
                margin: '10px 0',
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{menu.nombre}</h3>
                <button
                  onClick={() => handleGeneratePDF(menu.id)}
                  style={{
                    textDecoration: 'none',
                    padding: '8px 15px',
                    background: '#4CAF50',
                    color: 'white',
                    borderRadius: '5px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Generar PDF
                </button>
              </div>

              <p>{menu.descripcion}</p>
              <h4>Platos incluidos:</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {menu.platos.map((plato) => (
                  <li key={plato.id} style={{ marginBottom: '5px' }}>
                    <span style={{ fontWeight: 'bold' }}>{plato.nombre}</span> - {plato.precio} € - {plato.descripcion}
                  </li>
                ))}
              </ul>

              {(() => {
                const precioBase = menu.platos.reduce((total, plato) => total + plato.precio, 0);
                const iva = precioBase * 0.10; //si avanzo en este proyecto esto no lo puedo hardkorear
                const precioTotal = precioBase + iva;
                return (
                  <>
                    <p>Precio base: {precioBase.toFixed(2)} €</p>
                    <p>IVA (10%): {iva.toFixed(2)} €</p>
                    <p>Precio total: {precioTotal.toFixed(2)} €</p>
                  </>
                );
              })()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EmployedDashboard;


