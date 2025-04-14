import React, { useState } from 'react';
import api from '../services/api.js';
import { toast } from 'react-toastify';


function CreateMenu() {
  const [menu, setMenu] = useState({ nombre: '', descripcion: '', precio: 0 });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de campos
    if (!menu.nombre || !menu.descripcion) {
      toast.info('Por favor, completa todos los campos.');
      return;
    }

    try {
      const response = await api.post(
        '/api/menus',
        menu,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      if (response.status < 200 || response.status >= 300) {
        throw new Error('Error al crear menú');
      }

      toast.success('Menú creado con éxito');
      setMenu({ nombre: '', descripcion: '', precio: 0 }); // Reiniciamos el formulario
    } catch (error) {
      console.error('Error:', error);
      toast.error('Hubo un problema al crear el menú. Por favor, intenta de nuevo.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenu((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="menu-form">
      <div className="form-group">
        <label>Nombre del menú:</label>
        <input
          type="text"
          name="nombre"
          value={menu.nombre}
          onChange={handleChange}
          className="form-control"
          placeholder="Introduce el nombre del menú"
        />
      </div>
      <div className="form-group">
        <label>Descripción:</label>
        <textarea
          name="descripcion"
          value={menu.descripcion}
          onChange={handleChange}
          className="form-control"
          placeholder="Describe el menú brevemente"
        />
      </div>
      <button type="submit" className="submit-button">
        Crear Menú
      </button>
    </form>
  );
}

export default CreateMenu;
