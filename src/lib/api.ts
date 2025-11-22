import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Автоматически добавляем токен
api.interceptors.request.use((config) => {
  // Проверяем, что мы в браузере, так как на сервере localStorage нет
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Обработка 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Просто пробрасываем ошибку дальше — ничего не делаем автоматически
    return Promise.reject(error);
  }
);

export default api;