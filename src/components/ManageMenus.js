import React, { useState, useEffect } from 'react';
import api from '../services/api.js';

function ManageMenus() {
  const [menus, setMenus] = useState([]);
  const [platos, setPlatos] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedPlate, setSelectedPlate] = useState(null);
  const [newMenuName, setNewMenuName] = useState('');  
  const [menuPlates, setMenuPlates] = useState([]);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await api.get('/api/menus', {
          headers: { 'Authorization': localStorage.getItem('authToken') }
        });
        setMenus(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const fetchPlates = async () => {
      try {
        const response = await api.get('/api/platos', {
          headers: { 'Authorization': localStorage.getItem('authToken') }
        });
        setPlatos(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchMenus();
    fetchPlates();
  }, []);

  useEffect(() => {
    if (selectedMenu) {
      const fetchMenuPlates = async () => {
        try {
          const response = await api.get(`/api/menus/${selectedMenu.id}/platos`, {
            headers: { 'Authorization': localStorage.getItem('authToken') }
          });
          setMenuPlates(response.data);
        } catch (error) {
          console.error('Error:', error);
        }
      };
      fetchMenuPlates();
    }
  }, [selectedMenu]);

  const handleUpdateMenu = async (menuId, updatedMenu) => {
    try {
      await api.put(`/api/menus/${menuId}`, updatedMenu, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('authToken')
        }
      });
      alert('Menú actualizado con éxito');
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteMenu = async (menuId) => {
    try {
      await api.delete(`/api/menus/${menuId}`, {
        headers: { 'Authorization': localStorage.getItem('authToken') }
      });
      alert('Menú eliminado con éxito');
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleGeneratePDF = async (menuId) => {
    try {
      const porcentajeIva = 10;
      const response = await api.get(`/api/menus/pdf/${menuId}/${porcentajeIva}`, {
        headers: { 'Authorization': localStorage.getItem('authToken') },
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `menu_${menuId}.pdf`;
      link.click();
    } catch (error) {
      console.error('Error al generar PDF:', error);
    }
  };

  const handleAddPlateToMenu = async (menuId, plateId) => {
    try {
      await api.post(`/api/menus/${menuId}/platos`, [plateId], {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('authToken')
        }
      });
      alert('Plato agregado al menú con éxito');
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRemovePlateFromMenu = async (menuId, plateId) => {
    try {
      await api.delete(`/api/menus/${menuId}/platos/${plateId}`, {
        headers: { 'Authorization': localStorage.getItem('authToken') }
      });
      alert('Plato eliminado del menú con éxito');
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const handleUpdateMenuName = async () => {
    if (!selectedMenu) return;
    try {
      await handleUpdateMenu(selectedMenu.id, { ...selectedMenu, nombre: newMenuName });
      setNewMenuName('');
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSelectMenu = (menu) => {
    setSelectedMenu(menu);
  };

  const handleSelectPlate = (plate) => {
    setSelectedPlate(plate);
  };



  return (
    <div>
      <h3>Menús existentes:</h3>
      <ul>
        {menus.map(menu => (
          <li key={menu.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 onClick={() => handleSelectMenu(menu)} style={{ cursor: 'pointer' }}>
                  {menu.nombre} <span style={{ fontSize: '0.8em', color: 'grey' }}>Editar</span>
                </h4>

                <p>Precio: {parseFloat(menu.precioTotal).toFixed(2)} €</p>
                <p>Precio con IVA: {parseFloat(menu.precioConIva).toFixed(2)} €</p>
              </div>

              <button
                onClick={() => handleGeneratePDF(menu.id)}
                className="pdf-button"
              >
                Generar PDF
              </button>
            </div>
            <button onClick={() => handleDeleteMenu(menu.id)}
              className="btn-delete"
            >
              Eliminar
            </button>

            {selectedMenu && selectedMenu.id === menu.id && (
              <div>
                <input
                  type="text"
                  value={newMenuName}
                  onChange={(e) => setNewMenuName(e.target.value)}
                  placeholder="Nuevo nombre del menú"
                />
                <button onClick={handleUpdateMenuName}>
                  Actualizar nombre
                </button>

                <select value={selectedPlate?.id || ''} onChange={(e) => handleSelectPlate(platos.find(p => p.id === parseInt(e.target.value)))}>
                  <option value="">Seleccione un plato</option>
                  {platos.map(plate => (
                    <option key={plate.id} value={plate.id}>{plate.nombre}</option>
                  ))}
                </select>

                <button onClick={() => handleAddPlateToMenu(menu.id, selectedPlate?.id)}>
                  Agregar plato
                </button>

                <h4>Platos del menú:</h4>
                <ul>
                  {menuPlates.map(plate => (
                    <li key={plate.id}>

                      <button onClick={() => handleRemovePlateFromMenu(menu.id, plate.id)}
                        className='btn-delete'
                      >
                        Quitar
                      </button>
                      <span>{plate.nombre}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageMenus;
