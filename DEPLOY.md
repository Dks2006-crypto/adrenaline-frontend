# Инструкция по деплою на Vercel

## Подготовка проекта

Фронтенд уже подготовлен для деплоя на Vercel. Все необходимые файлы и конфигурации находятся в корне проекта.

## Шаги для деплоя

### 1. Через GitHub (рекомендуемый способ)

1. Запушьте проект в репозиторий на GitHub
2. Зайдите на [Vercel](https://vercel.com/)
3. Создайте новый проект и подключите GitHub репозиторий
4. Настройте переменные окружения в настройках проекта:
   - `NEXT_PUBLIC_API_URL` - URL вашего backend API (например: `https://your-backend-url.com`)
5. Нажмите Deploy

### 2. Через CLI

1. Установите Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Авторизуйтесь:
   ```bash
   vercel login
   ```

3. Перейдите в папку frontend:
   ```bash
   cd adrenaline-frontend
   ```

4. Деплой:
   ```bash
   vercel
   ```

5. Следуйте инструкциям в CLI, укажите URL backend API

## Переменные окружения

Обязательные переменные:
- `NEXT_PUBLIC_API_URL` - URL вашего backend API

Пример:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

## Production оптимизации

Проект уже оптимизирован для production:
- Включена компрессия
- Отключены source maps
- Удалены комментарии из production сборки
- Настроены security headers
- Оптимизированы изображения через Next.js Image Optimization
- Включена standalone сборка для Vercel

## Проверка сборки

Перед деплоем вы можете проверить production сборку:

```bash
cd adrenaline-frontend
npm run build
npm start
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000)