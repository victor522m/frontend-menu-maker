import React, { useState } from 'react';

function CreateMenu() {
  const [menu, setMenu] = useState({ nombre: '', descripcion: '', precio: 0 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/menus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('authToken')
        },
        body: JSON.stringify(menu)
      });

      if (!response.ok) throw new Error('Error al crear menú');
      alert('Menú creado con éxito');
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
    
  };

  const handleChange = (e) => {
    setMenu(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nombre del menú:</label>
        <input type="text" name="nombre" value={menu.nombre} onChange={handleChange} />
      </div>
      <div>
        <label>Descripción:</label>
        <textarea name="descripcion" value={menu.descripcion} onChange={handleChange} />
      </div>
      <button type="submit">Crear Menú</button>
    </form>
  );
}

export default CreateMenu;