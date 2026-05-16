import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzeCode = async (code, language = 'python') => {
  try {
    const response = await apiClient.post('/analyze', {
      code,
      language,
    });
    return response.data;
  } catch (error) {
    console.error('Error analyzing code:', error);
    throw error;
  }
};

export const fixCode = async (code, language = 'python') => {
  try {
    const response = await apiClient.post('/fix', {
      code,
      language,
    });
    return response.data;
  } catch (error) {
    console.error('Error fixing code:', error);
    throw error;
  }
};

export default apiClient;

// Made with Bob
