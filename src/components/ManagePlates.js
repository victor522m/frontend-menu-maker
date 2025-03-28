import React, { useState, useEffect } from 'react';

function ManagePlates() {
  const [plates, setPlates] = useState([]);

  useEffect(() => {
    const fetchPlates = async () => {
      try {
        const response = await fetch('/api/platos', {
          headers: {
            'Authorization': localStorage.getItem('authToken')
          }
        });

        if (!response.ok) throw new Error('Error obteniendo platos');
        
        const data = await response.json();
        setPlates(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchPlates();
  }, []);

  const handleUpdatePlate = async (plateId, updatedPlate) => {
    try {
      const response = await fetch(`/api/platos/${plateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('authToken')
        },
        body: JSON.stringify(updatedPlate)
      });

      if (!response.ok) throw new Error('Error al actualizar plato');
      alert('Plato actualizado con éxito');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeletePlate = async (plateId) => {
    try {
      const response = await fetch(`/api/platos/${plateId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': localStorage.getItem('authToken')
        }
      });

      if (!response.ok) throw new Error('Error al eliminar plato');
      alert('Plato eliminado con éxito');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h3>Platos existentes:</h3>
      <ul>
        {plates.map(plate => (
          <li key={plate.id}>
            <h4>{plate.nombre}</h4>
            <p>{plate.descripcion}</p>
            <p>Precio: ${plate.precio}</p>

            <button onClick={() => handleUpdatePlate(plate.id, { ...plate, nombre: 'Nuevo nombre' })}>
              Actualizar
            </button>

            <button onClick={() => handleDeletePlate(plate.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManagePlates;
