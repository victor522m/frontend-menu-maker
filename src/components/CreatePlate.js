import React, { useState } from 'react';

function CreatePlate() {
  const [plate, setPlate] = useState({ nombre: '', descripcion: '', precio: 0 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/platos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('authToken')
        },
        body: JSON.stringify(plate)
      });

      if (!response.ok) throw new Error('Error al crear plato');
      alert('Plato creado con éxito');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = (e) => {
    setPlate(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nombre del plato:</label>
        <input type="text" name="nombre" value={plate.nombre} onChange={handleChange} />
      </div>
      <div>
        <label>Descripción:</label>
        <textarea name="descripcion" value={plate.descripcion} onChange={handleChange} />
      </div>
      <div>
        <label>Precio:</label>
        <input type="number" name="precio" value={plate.precio} onChange={handleChange} />
      </div>
      <button type="submit">Crear Plato</button>
    </form>
  );
}

export default CreatePlate;
