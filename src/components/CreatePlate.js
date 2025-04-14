import React, { useState } from 'react';
import api from '../services/api.js';
const initialPlate = {
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
};
//const [plate, setPlate] = useState(initialPlate);

function CreatePlate() {
  const [plate, setPlate] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    tipo_plato: 'PRIMEROS',  // Campo nuevo para el tipo de plato
    // Campos específicos para cada tipo
    esVegetariano: false,
    tiempoPreparacion: 10,
    tipoCarne: '',
    guarnicion: '',
    tipoPostre: '',
    aptoCeliaco: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Construir el objeto según el tipo de plato
      const plateData = {
        nombre: plate.nombre,
        descripcion: plate.descripcion,
        precio: parseFloat(plate.precio),
        tipo_plato: plate.tipo_plato,
        ...(plate.tipo_plato === 'PRIMEROS' && {
          esVegetariano: plate.esVegetariano,
          tiempoPreparacion: parseInt(plate.tiempoPreparacion)
        }),
        ...(plate.tipo_plato === 'SEGUNDOS' && {
          tipoCarne: plate.tipoCarne,
          guarnicion: plate.guarnicion
        }),
        ...(plate.tipo_plato === 'POSTRE' && {
          tipoPostre: plate.tipoPostre,
          aptoCeliaco: plate.aptoCeliaco
        })
      };

      const response = await api.post('/api/platos', plateData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      

      if (response.status < 200 || response.status >= 300) {
        throw new Error('Error al crear plato');
      }
      
      alert('Plato creado con éxito');
      setPlate(initialPlate); // Reset parcial
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPlate(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="plate-form">
      <div className="form-group">
        <label>Tipo de Plato:</label>
        <select 
          name="tipo_plato" 
          value={plate.tipo_plato} 
          onChange={handleChange}
          className="form-control"
        >
          <option value="PRIMEROS">Primer plato</option>
          <option value="SEGUNDOS">Segundo plato</option>
          <option value="POSTRE">Postre</option>
        </select>
      </div>

      <div className="form-group">
        <label>Nombre del plato:</label>
        <input 
          type="text" 
          name="nombre" 
          value={plate.nombre} 
          onChange={handleChange} 
          className="form-control"
          required
        />
      </div>

      <div className="form-group">
        <label>Descripción:</label>
        <textarea 
          name="descripcion" 
          value={plate.descripcion} 
          onChange={handleChange} 
          className="form-control"
          required
        />
      </div>

      <div className="form-group">
        <label>Precio (€):</label>
        <input 
          type="number" 
          name="precio" 
          value={plate.precio} 
          onChange={handleChange} 
          step="0.01"
          className="form-control"
          required
        />
      </div>

      {/* Campos específicos para PRIMEROS */}
      {plate.tipo_plato === 'PRIMEROS' && (
        <div className="specific-fields">
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="esVegetariano"
                checked={plate.esVegetariano}
                onChange={handleChange}
              /> Vegetariano
            </label>
          </div>

          <div className="form-group">
            <label>Tiempo preparación (min):</label>
            <input
              type="number"
              name="tiempoPreparacion"
              value={plate.tiempoPreparacion}
              onChange={handleChange}
              className="form-control"
              min="1"
              required
            />
          </div>
        </div>
      )}

      {/* Campos específicos para SEGUNDOS */}
      {plate.tipo_plato === 'SEGUNDOS' && (
        <div className="specific-fields">
          <div className="form-group">
            <label>Tipo de Carne:</label>
            <input
              type="text"
              name="tipoCarne"
              value={plate.tipoCarne}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>Guarnición:</label>
            <input
              type="text"
              name="guarnicion"
              value={plate.guarnicion}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
        </div>
      )}

      {/* Campos específicos para POSTRE */}
      {plate.tipo_plato === 'POSTRE' && (
        <div className="specific-fields">
          <div className="form-group">
            <label>Tipo de Postre:</label>
            <select
              name="tipoPostre"
              value={plate.tipoPostre}
              onChange={handleChange}
              className="form-control"
              required
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
                checked={plate.aptoCeliaco}
                onChange={handleChange}
              /> Apto para celíacos
            </label>
          </div>
        </div>
      )}

      <button type="submit" className="submit-button">
        Crear Plato
      </button>
    </form>
  );
}

export default CreatePlate;

