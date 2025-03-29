import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function EmployedDashboard() {
  const [menus, setMenus] = useState([]);
  const navigate = useNavigate();
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
        const response = await fetch('/api/menus', {
          headers: {
            'Authorization': localStorage.getItem('authToken'),
          },
        });

        if (!response.ok) throw new Error('Error obteniendo menús');

        const data = await response.json();
        setMenus(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchMenus();
  }, []);

  const handleGeneratePDF = async (menuId) => {
    try {
      const porcentajeIva = 10; // Puedes ajustar este valor según tus necesidades
      const url = `/api/menus/pdf/${menuId}/${porcentajeIva}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': localStorage.getItem('authToken'),
        },
      });

      if (!response.ok) throw new Error('Error generando PDF');

      // Descargar el PDF
      const blob = await response.blob();
      const pdfUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `menu_${menuId}.pdf`;
      link.click();
    } catch (error) {
      console.error('Error al generar PDF:', error);
    }
  };

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
                    <span style={{ fontWeight: 'bold' }}>{plato.nombre}</span> - ${plato.precio} - {plato.descripcion}
                  </li>
                ))}
              </ul>

              {(() => {
                const precioBase = menu.platos.reduce((total, plato) => total + plato.precio, 0);
                const iva = precioBase * 0.10; //si avanzo en este proyecto esto no lo puedo hardkorear
                const precioTotal = precioBase + iva;
                return (
                  <>
                    <p>Precio base: ${precioBase.toFixed(2)}</p>
                    <p>IVA (10%): ${iva.toFixed(2)}</p>
                    <p>Precio total: ${precioTotal.toFixed(2)}</p>
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


