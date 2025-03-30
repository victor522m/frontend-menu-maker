import React from 'react';
import api from '../services/api.js';
function GeneratePdf() {
  const [menuId, setMenuId] = React.useState('');
  const [porcentajeIva, setPorcentajeIva] = React.useState(21);

  const handleGeneratePdf = async () => {
    try {
      const url = `/api/menus/pdf/${menuId}/${porcentajeIva}`;

      const response = await api.get(url, {
        headers: {
          'Authorization': localStorage.getItem('authToken'),
        },
      });

      if (!response.ok) throw new Error('Error generando PDF');

      // Descargar el PDF
      const blob = await response.blob();
      const pdfUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `menu_${menuId}.pdf`;
      link.click();
    } catch (error) {
      console.error('Error al generar PDF:', error);
    }
  };

  return (
    <div>
      <h2>Generar PDF de Menú</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleGeneratePdf();
      }}>
        <div>
          <label>Id del Menú:</label>
          <input type="number" value={menuId} onChange={(e) => setMenuId(e.target.value)} />
        </div>
        <div>
          <label>Porcentaje de IVA:</label>
          <input type="number" value={porcentajeIva} onChange={(e) => setPorcentajeIva(e.target.value)} />
        </div>
        <button type="submit">Generar PDF</button>
      </form>
    </div>
  );
}

export default GeneratePdf;
