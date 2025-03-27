import React from 'react';
const handleLogout = async () => {
  try {
    await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Authorization': localStorage.getItem('authToken')
      }
    });
  } catch (error) {
    console.error('Error de logout:', error);
  } finally {
    localStorage.clear();
    window.location.href = '/login'; // Forzar recarga y limpiar estado
  }
};





function OwnerDashboard() {
  return (
    <div>
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h1>Bienvenido Empleado</h1>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
      <h1>Panel de Administración</h1>
      <div>
        <h2>Gestión de Menús</h2>
        {/* Aquí puedes añadir componentes para crear, editar y eliminar menús */}
      </div>
      <div>
        <h2>Gestión de Platos</h2>
        {/* Aquí puedes añadir componentes para crear, editar y eliminar platos */}
      </div>
      <div>
        <h2>Generación de PDF</h2>
        {/* Componente para generar PDF de menús */}
      </div>
    </div>
  );
}

export default OwnerDashboard;
