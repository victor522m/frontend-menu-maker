import React, { useState } from 'react';
import api from '../services/api.js';
import { toast } from 'react-toastify';

function CreateMenu({ onMenuCreated }) {
  const [menu, setMenu] = useState({ nombre: '', descripcion: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenu((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!menu.nombre.trim() || !menu.descripcion.trim()) {
      toast.info('Por favor, completa todos los campos obligatorios.');
      return;
    }

    try {
      const response = await api.post('/api/menus', menu, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        }
      });

      if (response.status === 201) {
        toast.success('Menú creado con éxito');
        setMenu({ nombre: '', descripcion: '' });

        // Recarga la lista de menús desde la API
        // const nuevosMenus = await api.get('/api/menus', {
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        //   }
        // });

        if (onMenuCreated) { 
          onMenuCreated(response.data); // Se lo mandamos al padre
        }
      }

    } catch (error) {
      console.error('Error al crear el menú:', error);
      toast.error('Hubo un problema al crear el menú.');
    }
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
