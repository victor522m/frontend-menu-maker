import React, { useState, useEffect } from 'react';

function ManageMenus() {
  const [menus, setMenus] = useState([]);
  const [platos, setPlatos] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedPlate, setSelectedPlate] = useState(null);
  const [newMenuName, setNewMenuName] = useState('');
  const [menuPlates, setMenuPlates] = useState([]); // Estado para platos del menú seleccionado

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch('/api/menus', {
          headers: {
            'Authorization': localStorage.getItem('authToken')
          }
        });

        if (!response.ok) throw new Error('Error obteniendo menús');
        
        const data = await response.json();
        setMenus(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const fetchPlates = async () => {
      try {
        const response = await fetch('/api/platos', {
          headers: {
            'Authorization': localStorage.getItem('authToken')
          }
        });

        if (!response.ok) throw new Error('Error obteniendo platos');
        
        const data = await response.json();
        setPlatos(data);
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
          const response = await fetch(`/api/menus/${selectedMenu.id}/platos`, {
            headers: {
              'Authorization': localStorage.getItem('authToken')
            }
          });

          if (!response.ok) throw new Error('Error obteniendo platos del menú');
          
          const data = await response.json();
          setMenuPlates(data);
        } catch (error) {
          console.error('Error:', error);
        }
      };

      fetchMenuPlates();
    }
  }, [selectedMenu]);

  const handleUpdateMenu = async (menuId, updatedMenu) => {
    try {
      const response = await fetch(`/api/menus/${menuId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('authToken')
        },
        body: JSON.stringify(updatedMenu)
      });

      if (!response.ok) throw new Error('Error al actualizar menú');
      alert('Menú actualizado con éxito');
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteMenu = async (menuId) => {
    try {
      const response = await fetch(`/api/menus/${menuId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': localStorage.getItem('authToken')
        }
      });

      if (!response.ok) throw new Error('Error al eliminar menú');
      alert('Menú eliminado con éxito');
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
  };
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

  const handleAddPlateToMenu = async (menuId, plateId) => {
    try {
      const response = await fetch(`/api/menus/${menuId}/platos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('authToken')
        },
        body: JSON.stringify([plateId]),
      });

      if (!response.ok) throw new Error('Error al agregar plato al menú');
      alert('Plato agregado al menú con éxito');
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRemovePlateFromMenu = async (menuId, plateId) => {
    alert(`/api/menus/${menuId}/platos/${plateId}`);
    console.log('menu.id:', menuId);
    console.log('plate.id:', plateId);
    try {
      const response = await fetch(`/api/menus/${menuId}/platos/${plateId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': localStorage.getItem('authToken')
        }
      });

      if (!response.ok) throw new Error('Error al eliminar plato del menú');
      alert('Plato eliminado del menú con éxito');
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

  const handleUpdateMenuName = async () => {
    if (!selectedMenu) return;
    try {
      const updatedMenu = { ...selectedMenu, nombre: newMenuName };
      await handleUpdateMenu(selectedMenu.id, updatedMenu);
      setNewMenuName('');
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h3>Menús existentes:</h3>
      <ul>
        {menus.map(menu => (
          <li key={menu.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
            <h4 onClick={() => handleSelectMenu(menu)}>{menu.nombre}</h4>
            <p>Precio: ${parseFloat(menu.precioTotal).toFixed(2)}</p>
            <p>Precio con IVA: ${parseFloat(menu.precioConIva).toFixed(2)}</p>
            </div>
            
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
                height: 'fit-content',
                marginLeft: '15px'
              }}
            >
              Generar PDF
            </button>
          </div>
            <button onClick={() => handleDeleteMenu(menu.id)}>
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
                      <span>{plate.nombre}</span>
                      <button onClick={() => handleRemovePlateFromMenu(menu.id, plate.id)}>
                        Quitar
                      </button>
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
