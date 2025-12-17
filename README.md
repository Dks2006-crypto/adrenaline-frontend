# Adrenaline Fitness Frontend

Frontend часть приложения для фитнес-клуба Adrenaline, построенная на Next.js 16.

## Технологии

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Axios
- Zustand
- React Hook Form
- @tanstack/react-query

## Установка зависимостей

```bash
npm install
```

## Запуск в development режиме

```bash
npm run dev
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000)

## Сборка проекта

```bash
npm run build
```

## Запуск production версии

```bash
npm start
```

## Переменные окружения

Создайте файл `.env.local` в корне проекта:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_AUTH_TYPE=localstorage
```

## Деплой на Vercel

### Через GitHub

1. Запушьте проект в репозиторий на GitHub
2. Зайдите на [Vercel](https://vercel.com/)
3. Создайте новый проект и подключите GitHub репозиторий
4. Настройте переменные окружения в настройках проекта:
   - `NEXT_PUBLIC_API_URL` - URL вашего backend API
5. Нажмите Deploy

### Через CLI

1. Установите Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Авторизуйтесь:
   ```bash
   vercel login
   ```

3. Деплой:
   ```bash
   vercel
   ```

## Production оптимизации

- Включена компрессия
- Отключены source maps
- Удалены комментарии из production сборки
- Настроены security headers
- Оптимизированы изображения через Next.js Image Optimization

## Структура проекта

```
src/
├── app/              # App Router (Next.js 13+)
├── entities/         # Бизнес-сущности
├── features/         # Фичи приложения
├── lib/              # Вспомогательные библиотеки
├── shared/           # Общие компоненты
├── store/            # Глобальное состояние
└── widgets/          # Виджеты
```

## Контакты

Для вопросов и предложений обращайтесь к команде разработки.
