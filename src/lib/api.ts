import axios from 'axios';

// Определяем базовый URL в зависимости от окружения
const getBaseURL = () => {
  // Проверяем, что мы в браузере
  if (typeof window !== 'undefined') {
    // Используем переменную из .env.production или .env
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  }
  
  // Для серверной стороны используем переменную из окружения
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000, // 10 секунд таймаут
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
  
  // Устанавливаем Content-Type только если это не FormData
  // (axios автоматически установит правильный Content-Type для FormData)
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  
  return config;
});

// Обработка 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Логируем ошибки в development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error);
    }
    
    // Просто пробрасываем ошибку дальше — ничего не делаем автоматически
    return Promise.reject(error);
  }
);

export default api;