import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
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

  // useEffect para obtener platos  
  useEffect(() => {
    const fetchPlates = async () => {
      try {
        const response = await api.get('/api/platos', {
          headers: {
            'Authorization': localStorage.getItem('authToken')
          }
        });

        setPlatos(response.data); // Axios maneja la conversión a JSON automáticamente
      } catch (error) {
        console.error('Error obteniendo platos:', error);
      }
    };

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

    // Actualizar lista de platos
    const updatedPlates = plates.map(plate =>
      plate.id === plateId ? { ...plate, ...plateData } : plate
    );

    setPlatos(updatedPlates);
    setEditingPlateId(null);
    alert('Plato actualizado con éxito');
    window.location.reload();

  } catch (error) {
    console.error('Error:', error);
    alert(error.message);
  }
};

const handleDeletePlate = async (plateId) => {
  try {
    await api.delete(`/api/platos/${plateId}`, {
      headers: {
        'Authorization': localStorage.getItem('authToken')
      }
    });

    alert('Plato eliminado con éxito');
    window.location.reload();
  } catch (error) {
    console.error('Error:', error);
  }
};


  return (
    <div className="plates-container">
      <h3>Platos existentes:</h3>
      <ul className="plates-list">
        {plates.map(plate => (
          <li key={plate.id} className="plate-item">
            {editingPlateId === plate.id ? (
              <form onSubmit={(e) => handleUpdatePlate(e, plate.id)} className="edit-form">
                <div className="form-group">
                  <label>Tipo de Plato:</label>
                  <select
                    name="tipo_plato"
                    value={editFormData.tipo_plato}
                    onChange={handleFormChange}
                    className="form-control"
                    enabled // Opcional: evitar cambiar el tipo de plato
                  >
                    <option value="PRIMEROS">Primer plato</option>
                    <option value="SEGUNDOS">Segundo plato</option>
                    <option value="POSTRE">Postre</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Nombre:</label>
                  <input
                    type="text"
                    name="nombre"
                    value={editFormData.nombre}
                    onChange={handleFormChange}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>Descripción:</label>
                  <textarea
                    name="descripcion"
                    value={editFormData.descripcion}
                    onChange={handleFormChange}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>Precio:</label>
                  <input
                    type="number"
                    name="precio"
                    value={editFormData.precio}
                    onChange={handleFormChange}
                    className="form-control"
                    step="0.01"
                  />
                </div>

                {/* Campos específicos del tipo de plato */}
                {editFormData.tipo_plato === 'PRIMEROS' && (
                  <div className="specific-fields">
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          name="esVegetariano"
                          checked={editFormData.esVegetariano}
                          onChange={handleFormChange}
                        /> Vegetariano
                      </label>
                    </div>

                    <div className="form-group">
                      <label>Tiempo preparación (min):</label>
                      <input
                        type="number"
                        name="tiempoPreparacion"
                        value={editFormData.tiempoPreparacion}
                        onChange={handleFormChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                )}

                {editFormData.tipo_plato === 'SEGUNDOS' && (
                  <div className="specific-fields">
                    <div className="form-group">
                      <label>Tipo de Carne:</label>
                      <input
                        type="text"
                        name="tipoCarne"
                        value={editFormData.tipoCarne}
                        onChange={handleFormChange}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label>Guarnición:</label>
                      <input
                        type="text"
                        name="guarnicion"
                        value={editFormData.guarnicion}
                        onChange={handleFormChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                )}

                {editFormData.tipo_plato === 'POSTRE' && (
                  <div className="specific-fields">
                    <div className="form-group">
                      <label>Tipo de Postre:</label>
                      <select
                        name="tipoPostre"
                        value={editFormData.tipoPostre}
                        onChange={handleFormChange}
                        className="form-control"
                      >
                        <option value="">Seleccione tipo</option>
                        <option value="Tarta">Tarta</option>
                        <option value="Helado">Helado</option>
                        <option value="Fruta">Fruta</option>
                        <option value="Brownie">Brownie</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          name="aptoCeliaco"
                          checked={editFormData.aptoCeliaco}
                          onChange={handleFormChange}
                        /> Apto para celíacos
                      </label>
                    </div>
                  </div>
                )}

                <div className="form-actions">
                  <button type="submit" className="btn-save">Guardar</button>
                  <button type="button" onClick={handleCancelEdit} className="btn-cancel">Cancelar</button>
                </div>
              </form>
            ) : (
              <div className="plate-info">
                <h4>{plate.nombre}</h4>
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
                  <button
                    onClick={() => handleEditClick(plate)}
                    className="btn-edit"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeletePlate(plate.id)}
                    className="btn-delete"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManagePlates;
