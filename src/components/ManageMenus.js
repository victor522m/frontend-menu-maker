import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import CreateMenu from './CreateMenu';
import CreatePlate from './CreatePlate'; // Ajusta la ruta si está en otra carpeta


function ManageMenus() {
  const [menus, setMenus] = useState([]);
  const [platos, setPlatos] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [newMenuName, setNewMenuName] = useState('');
  const [menuPlates, setMenuPlates] = useState([]);
  const [selectedPlate, setSelectedPlate] = useState(null);
  const handlePlateCreated = (newPlate) => {
    setPlatos((prevPlates) => [...prevPlates, newPlate]);
  };
  useEffect(() => {
    const fetchMenusAndPlates = async () => {
      try {
        const menuResponse = await api.get('/api/menus', {
          headers: { 'Authorization': localStorage.getItem('authToken') }
        });
        setMenus(menuResponse.data);  // Establecer la lista de menús
  
        const plateResponse = await api.get('/api/platos', {
          headers: { 'Authorization': localStorage.getItem('authToken') }
        });
        setPlatos(plateResponse.data);  // Establecer la lista de platos
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchMenusAndPlates();
  }, []); // Solo ejecutar una vez al cargar el componente
  
  // Función que se pasa al componente CreateMenu
  const handleMenuCreated = (newMenu) => {
    setMenus((prevMenus) => [...prevMenus, newMenu]);
  };

  // Select a menu to view its plates
  const handleSelectMenu = (menu) => {
    setSelectedMenu(menu);
    const fetchMenuPlates = async () => {
      try {
        const response = await api.get(`/api/menus/${menu.id}/platos`, {
          headers: { 'Authorization': localStorage.getItem('authToken') }
        });
        setMenuPlates(response.data);
      } catch (error) {
        console.error('Error fetching plates for menu:', error);
      }
    };
    fetchMenuPlates();
  };

  const handleAddPlateToMenu = async (menuId, plateId) => {
    if (!plateId) return;
  
    try {
      // Agregar plato al menú
      await api.post(`/api/menus/${menuId}/platos`, [plateId], {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('authToken')
        }
      });
      toast.success('Plato agregado al menú');
  
      // Actualizar la lista local de platos para no volver a agregar el plato
      const updatedPlates = platos.filter(plate => plate.id !== plateId);
      setPlatos(updatedPlates);
  
      // Obtener el menú actualizado con los platos y precios actualizados
      const updatedMenu = await api.get(`/api/menus/${menuId}`, {
        headers: { 'Authorization': localStorage.getItem('authToken') }
      });
  
      // Actualizamos el estado de menús con el menú actualizado
      setMenus(prevMenus =>
        prevMenus.map(menu =>
          menu.id === menuId ? { ...updatedMenu.data } : menu
        )
      );
  
      // Actualizamos la lista de platos del menú
      setMenuPlates(updatedMenu.data.platos);
  
    } catch (error) {
      console.error('Error adding plate:', error);
      toast.error('Error al agregar el plato al menú');
    }
  };
 
  const handleRemovePlateFromMenu = async (menuId, plateId) => {
    try {
      // Eliminar plato del menú
      await api.delete(`/api/menus/${menuId}/platos/${plateId}`, {
        headers: { 'Authorization': localStorage.getItem('authToken') }
      });
      toast.success('Plato eliminado del menú');
  
      // Restauramos el plato a la lista global de platos
      const removedPlate = menuPlates.find(plate => plate.id === plateId);
      setPlatos(prevPlates => [...prevPlates, removedPlate]);
  
      // Obtener el menú actualizado con los platos y precios actualizados
      const updatedMenu = await api.get(`/api/menus/${menuId}`, {
        headers: { 'Authorization': localStorage.getItem('authToken') }
      });
  
      // Actualizamos el estado de menús con el menú actualizado
      setMenus(prevMenus =>
        prevMenus.map(menu =>
          menu.id === menuId ? { ...updatedMenu.data } : menu
        )
      );
  
      // Actualizamos la lista de platos del menú
      setMenuPlates(updatedMenu.data.platos);
  
    } catch (error) {
      console.error('Error removing plate:', error);
      toast.error('Error al eliminar el plato del menú');
    }
  };

  const handleUpdateMenuName = async () => {
    if (!selectedMenu) return;
    try {
      const updated = { ...selectedMenu, nombre: newMenuName };
      await api.put(`/api/menus/${selectedMenu.id}`, updated, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('authToken')
        }
      });
      toast.success('Menú actualizado con éxito');
      setMenus(prev => prev.map(menu => (menu.id === selectedMenu.id ? { ...menu, nombre: newMenuName } : menu)));
      setSelectedMenu(prev => (prev && prev.id === selectedMenu.id ? { ...prev, nombre: newMenuName } : prev));
      setNewMenuName('');
    } catch (error) {
      console.error('Error updating menu name:', error);
      toast.error('Error al actualizar el nombre del menú');
    }
  };

  const handleDeleteMenu = async (menuId) => {
    try {
      await api.delete(`/api/menus/${menuId}`, {
        headers: { 'Authorization': localStorage.getItem('authToken') }
      });
      toast.success('Menú eliminado con éxito');
      setMenus(prev => prev.filter(menu => menu.id !== menuId));
      if (selectedMenu?.id === menuId) {
        setSelectedMenu(null);
        setMenuPlates([]);
      }
    } catch (error) {
      console.error('Error deleting menu:', error);
      toast.error('Error al eliminar el menú');
    }
  };

  // Handle PDF generation
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

  return (
    <div>
      <CreateMenu onMenuCreated={handleMenuCreated} />

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
            <button onClick={() => handleSelectMenu(menu)} className="btn-edit">
            Editar
            </button>
            <button onClick={() => handleDeleteMenu(menu.id)} className="btn-delete">
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
                <button onClick={handleUpdateMenuName} disabled={!newMenuName.trim()}>
                  Actualizar nombre
                </button>
                
                <select value={selectedPlate?.id || ''} onChange={(e) => setSelectedPlate(platos.find(p => p.id === parseInt(e.target.value)))}>
                  <option value="">Seleccione un plato</option>
                  {platos.map(plate => (
                    <option key={plate.id} value={plate.id}>{plate.nombre}</option>
                  ))}
                </select>

                <button
                  onClick={() => handleAddPlateToMenu(menu.id, selectedPlate?.id)}
                  disabled={!selectedPlate?.id}
                >
                  Agregar plato
                </button>

                <h4>Platos del menú:</h4>
                <ul>
                  {menuPlates.map(plate => (
                    <li key={plate.id}>
                      <button onClick={() => handleRemovePlateFromMenu(menu.id, plate.id)} className="btn-delete">
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
