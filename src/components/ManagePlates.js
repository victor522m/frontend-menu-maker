import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import CreatePlate from './CreatePlate';
import { toast } from 'react-toastify';

function ManagePlates() {
  const [plates, setPlatos] = useState([]);
  const [editingPlateId, setEditingPlateId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    tipo_plato: 'PRIMEROS',
    esVegetariano: false,
    tiempoPreparacion: 10,
    tipoCarne: '',
    guarnicion: '',
    tipoPostre: '',
    aptoCeliaco: false
  });
  const handlePlateCreated = (newPlate) => {
    setPlatos((prevPlatos) => [...prevPlatos, newPlate]);
  };
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
  const fetchPlates = async () => {
    try {
      const response = await api.get('/api/platos', {
        headers: {
          'Authorization': localStorage.getItem('authToken')
        }
      });
      setPlatos(response.data); // Actualiza el estado con los datos obtenidos
    } catch (error) {
      console.error('Error obteniendo platos:', error);
    }
  };

  useEffect(() => {
    fetchPlates();
  }, []);

  const handleEditClick = (plate) => {
    setEditingPlateId(plate.id);
    setEditFormData({
      nombre: plate.nombre,
      descripcion: plate.descripcion,
      precio: plate.precio,
      tipo_plato: plate.tipo_plato,
      esVegetariano: plate.esVegetariano || false,
      tiempoPreparacion: plate.tiempoPreparacion || 10,
      tipoCarne: plate.tipoCarne || '',
      guarnicion: plate.guarnicion || '',
      tipoPostre: plate.tipoPostre || '',
      aptoCeliaco: plate.aptoCeliaco || false
    });
  };

  const handleCancelEdit = () => {
    setEditingPlateId(null);
    setEditFormData({
      nombre: '',
      descripcion: '',
      precio: 0,
      tipo_plato: 'PRIMEROS',
      esVegetariano: false,
      tiempoPreparacion: 10,
      tipoCarne: '',
      guarnicion: '',
      tipoPostre: '',
      aptoCeliaco: false
    });
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "tipo_plato") {
      setEditFormData(prev => ({
        ...prev,
        [name]: value,
        esVegetariano: false,
        tiempoPreparacion: 10,
        tipoCarne: "",
        guarnicion: "",
        tipoPostre: "",
        aptoCeliaco: false
      }));
    } else {
      setEditFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  const handleUpdatePlate = async (e, plateId) => {
    e.preventDefault();
    try {
      const plateData = {
        nombre: editFormData.nombre,
        descripcion: editFormData.descripcion,
        precio: parseFloat(editFormData.precio),
        tipo_plato: editFormData.tipo_plato,
        ...(editFormData.tipo_plato === 'PRIMEROS' && {
          esVegetariano: editFormData.esVegetariano,
          tiempoPreparacion: parseInt(editFormData.tiempoPreparacion)
        }),
        ...(editFormData.tipo_plato === 'SEGUNDOS' && {
          tipoCarne: editFormData.tipoCarne,
          guarnicion: editFormData.guarnicion
        }),
        ...(editFormData.tipo_plato === 'POSTRE' && {
          tipoPostre: editFormData.tipoPostre,
          aptoCeliaco: editFormData.aptoCeliaco
        })
      };

      await api.put(`/api/platos/${plateId}`, plateData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('authToken')
        }
      });

      // Actualizamos el estado para reflejar los cambios en la UI sin necesidad de recargar
      setPlatos(prevPlates => 
        prevPlates.map(plate => 
          plate.id === plateId ? { ...plate, ...plateData } : plate
        )
      );
      await fetchMenusAndPlates(); // Actualiza platos y menús
      toast.success('Plato actualizado con éxito');
      setEditingPlateId(null); // Salimos del modo de edición
    } catch (error) {
      console.error('Error actualizando plato:', error);
      toast.error(error.message);
    }
  };

  const handleDeletePlate = async (plateId) => {
    try {
      await api.delete(`/api/platos/${plateId}`, {
        headers: {
          'Authorization': localStorage.getItem('authToken')
        }
      });

      // Eliminamos el plato del estado sin necesidad de recargar
      setPlatos(prevPlates => prevPlates.filter(plate => plate.id !== plateId));
      await fetchMenusAndPlates(); // Actualiza platos y menús

      toast.success('Plato eliminado con éxito');
    } catch (error) {
      toast.error(error);
      console.error('Error eliminando plato:', error);
    }
  };

  // Agrupar platos por tipo
  const groupedPlates = plates.reduce((acc, plate) => {
    if (!acc[plate.tipo_plato]) {
      acc[plate.tipo_plato] = [];
    }
    acc[plate.tipo_plato].push(plate);
    return acc;
  }, {});

  return (
    <div className="plates-container">
      <h3>Platos existentes:</h3>
      <CreatePlate onPlateCreated={handlePlateCreated} />
      {/* Mostrar platos agrupados */}
      {Object.keys(groupedPlates).map(tipo => (
        <div key={tipo} className="plate-group">
          <h4>{tipo === 'PRIMEROS' ? 'Primeros platos' : tipo === 'SEGUNDOS' ? 'Segundos platos' : 'Postres'}</h4>
          <ul className="plates-list">
            {groupedPlates[tipo].map(plate => (
              <li key={plate.id} className="plate-item">
                {editingPlateId === plate.id ? (
                  <form onSubmit={(e) => handleUpdatePlate(e, plate.id)} className="edit-form">
                    <div className="form-group">
                      <label>Tipo de Plato:</label>
                      <select name="tipo_plato" value={editFormData.tipo_plato} onChange={handleFormChange} className="form-control">
                        <option value="PRIMEROS">Primer plato</option>
                        <option value="SEGUNDOS">Segundo plato</option>
                        <option value="POSTRE">Postre</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Nombre:</label>
                      <input type="text" name="nombre" value={editFormData.nombre} onChange={handleFormChange} className="form-control" />
                    </div>

                    <div className="form-group">
                      <label>Descripción:</label>
                      <textarea name="descripcion" value={editFormData.descripcion} onChange={handleFormChange} className="form-control"></textarea>
                    </div>

                    <div className="form-group">
                      <label>Precio:</label>
                      <input type="number" name="precio" value={editFormData.precio} step="0.01" onChange={handleFormChange} className="form-control" />
                    </div>

                    {/* Campos específicos del tipo de plato */}
                    {editFormData.tipo_plato === 'PRIMEROS' && (
                      <>
                        <div className="form-group">
                          <label>
                            <input type="checkbox" name="esVegetariano" checked={editFormData.esVegetariano} onChange={handleFormChange} />
                            Vegetariano
                          </label>
                        </div>

                        <div className="form-group">
                          <label>Tiempo preparación (min):</label>
                          <input type="number" name="tiempoPreparacion" value={editFormData.tiempoPreparacion} onChange={handleFormChange} className="form-control" />
                        </div>
                      </>
                    )}

                    {editFormData.tipo_plato === 'SEGUNDOS' && (
                      <>
                        <div className="form-group">
                          <label>Tipo de Carne:</label>
                          <input type="text" name="tipoCarne" value={editFormData.tipoCarne} onChange={handleFormChange} className="form-control" />
                        </div>

                        <div className="form-group">
                          <label>Guarnición:</label>
                          <input type="text" name="guarnicion" value={editFormData.guarnicion} onChange={handleFormChange} className="form-control" />
                        </div>
                      </>
                    )}

                    {editFormData.tipo_plato === 'POSTRE' && (
                      <>
                        <div className="form-group">
                          <label>Tipo de Postre:</label>
                          <select name="tipoPostre" value={editFormData.tipoPostre} onChange={handleFormChange} className="form-control">
                            <option value="">Seleccione tipo</option>
                            <option value="Tarta">Tarta</option>
                            <option value="Helado">Helado</option>
                            <option value="Fruta">Fruta</option>
                            <option value="Brownie">Brownie</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>
                            <input type="checkbox" name="aptoCeliaco" checked={editFormData.aptoCeliaco} onChange={handleFormChange} />
                            Apto para celíacos
                          </label>
                        </div>
                      </>
                    )}

                    <div className="form-actions">
                      <button type="submit" className="btn-save">Guardar</button>
                      <button type="button" onClick={handleCancelEdit} className="btn-cancel">Cancelar</button>
                    </div>
                  </form>
                ) : (
                  <div className="plate-info">
                    <h5>{plate.nombre}</h5>
                    <p>{plate.descripcion}</p>
                    <p>Precio: {plate.precio} €</p>

                    {plate.tipo_plato === 'PRIMEROS' && (
                      <p>Vegetariano: {plate.esVegetariano ? 'Sí' : 'No'} | Tiempo: {plate.tiempoPreparacion} min</p>
                    )}
                    {plate.tipo_plato === 'SEGUNDOS' && (
                      <p>Carne: {plate.tipoCarne} | Guarnición: {plate.guarnicion}</p>
                    )}
                    {plate.tipo_plato === 'POSTRE' && (
                      <p>Tipo: {plate.tipoPostre} | Celiacos: {plate.aptoCeliaco ? 'Apto' : 'No apto'}</p>
                    )}

                    <div className="plate-actions">
                      <button onClick={() => handleEditClick(plate)} className="btn-edit">Editar</button>
                      <button onClick={() => handleDeletePlate(plate.id)} className="btn-delete">Eliminar</button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default ManagePlates;
