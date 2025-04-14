// src/utils/plateUtils.js
import api from '../services/api';

export const fetchPlates = async () => {
  try {
    const response = await api.get('/api/platos', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error obteniendo platos:', error);
    return [];
  }
};
