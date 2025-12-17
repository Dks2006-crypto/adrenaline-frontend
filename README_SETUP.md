# Настройка фронтенда Adrenaline Fitness Club

## Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка окружения

Скопируйте файл `.env.production` в `.env`:

```bash
cp .env.production .env
```

### 3. Запуск в режиме разработки

```bash
npm run dev
```

### 4. Сборка для production

```bash
npm run build
```

### 5. Запуск локального сервера

```bash
npm run preview
```

## Переменные окружения

### API настройки
- `VITE_API_BASE_URL` - Базовый URL API бэкенда
- `VITE_APP_NAME` - Название приложения

### Настройки приложения
- `VITE_CURRENCY_SYMBOL` - Символ валюты
- `VITE_MIN_BOOKING_HOURS` - Минимальное время бронирования (часы)
- `VITE_MAX_BOOKING_DAYS` - Максимальное количество дней для бронирования
- `VITE_PERSONAL_TRAINING_DURATION` - Длительность персональной тренировки (минуты)

### Настройки уведомлений
- `VITE_ENABLE_NOTIFICATIONS` - Включены ли уведомления
- `VITE_REMINDER_HOURS` - Время отправки напоминаний (часы)

### Настройки мобильного приложения
- `VITE_MOBILE_APP_ENABLED` - Включено ли мобильное приложение
- `VITE_IOS_APP_LINK` - Ссылка на iOS приложение
- `VITE_ANDROID_APP_LINK` - Ссылка на Android приложение

### Настройки аналитики
- `VITE_ANALYTICS_ENABLED` - Включена ли аналитика
- `VITE_ANALYTICS_CODE` - Код аналитики

### Социальные сети
- `VITE_SOCIAL_VK` - Ссылка на VK
- `VITE_SOCIAL_INSTAGRAM` - Ссылка на Instagram
- `VITE_SOCIAL_TELEGRAM` - Ссылка на Telegram

### Режим разработки
- `VITE_DEV_MODE` - Режим разработки
- `VITE_DEBUG` - Режим отладки

## Структура проекта

```
src/
├── components/          # Компоненты Vue
│   ├── auth/           # Аутентификация
│   ├── booking/        # Бронирование
│   ├── dashboard/      # Личный кабинет
│   ├── forms/          # Формы
│   ├── layout/         # Макеты
│   ├── membership/     # Абонементы
│   ├── navigation/     # Навигация
│   └── ui/             # UI компоненты
├── composables/        # Composables
├── pages/              # Страницы
├── router/             # Маршрутизация
├── services/           # Сервисы API
├── stores/             # Сторы Pinia
├── styles/             # Стили
└── utils/              # Утилиты
```

## Компоненты

### Аутентификация
- `AuthForm.vue` - Форма входа/регистрации
- `LoginForm.vue` - Форма входа
- `RegisterForm.vue` - Форма регистрации
- `ResetPasswordForm.vue` - Форма сброса пароля

### Бронирование
- `BookingCalendar.vue` - Календарь бронирования
- `BookingForm.vue` - Форма бронирования
- `BookingList.vue` - Список бронирований
- `ClassCard.vue` - Карточка занятия

### Личный кабинет
- `Dashboard.vue` - Главная панель
- `ProfileSettings.vue` - Настройки профиля
- `MembershipInfo.vue` - Информация об абонементе
- `BookingHistory.vue` - История бронирований

### Абонементы
- `MembershipCard.vue` - Карточка абонемента
- `MembershipPurchase.vue` - Покупка абонемента
- `MembershipList.vue` - Список абонементов

### UI компоненты
- `Button.vue` - Кнопка
- `Input.vue` - Поле ввода
- `Card.vue` - Карточка
- `Modal.vue` - Модальное окно
- `Toast.vue` - Уведомление

## Сервисы API

### AuthService
- `login(credentials)` - Вход
- `register(userData)` - Регистрация
- `logout()` - Выход
- `forgotPassword(email)` - Сброс пароля
- `resetPassword(data)` - Смена пароля

### BookingService
- `getBookings()` - Получение бронирований
- `createBooking(data)` - Создание бронирования
- `cancelBooking(bookingId)` - Отмена бронирования
- `getAvailableSlots(date, trainerId)` - Доступные слоты

### MembershipService
- `getMemberships()` - Получение абонементов
- `purchaseMembership(data)` - Покупка абонемента
- `getCurrentMembership()` - Текущий абонемент

### UserService
- `getProfile()` - Профиль пользователя
- `updateProfile(data)` - Обновление профиля
- `getBookingHistory()` - История бронирований

### GroupClassService
- `getGroupClasses()` - Групповые занятия
- `getGroupClass(classId)` - Конкретное занятие
- `bookGroupClass(classId)` - Запись на занятие
- `cancelGroupClassBooking(bookingId)` - Отмена записи

### TrainerService
- `getTrainers()` - Список тренеров
- `getTrainer(trainerId)` - Информация о тренере

## Composables

### useAuth
- `user` - Данные пользователя
- `isAuthenticated` - Статус аутентификации
- `login(credentials)` - Вход
- `logout()` - Выход

### useBookings
- `bookings` - Список бронирований
- `loading` - Статус загрузки
- `fetchBookings()` - Загрузка бронирований
- `createBooking(data)` - Создание бронирования

### useMemberships
- `memberships` - Список абонементов
- `currentMembership` - Текущий абонемент
- `purchase(data)` - Покупка абонемента

### useNotifications
- `toasts` - Список уведомлений
- `show(message, type)` - Показ уведомления
- `success(message)` - Показ успешного уведомления
- `error(message)` - Показ ошибки

## Сторы Pinia

### authStore
- `user` - Данные пользователя
- `isAuthenticated` - Статус аутентификации
- `login(credentials)` - Вход
- `logout()` - Выход

### bookingStore
- `bookings` - Список бронирований
- `loading` - Статус загрузки
- `fetchBookings()` - Загрузка бронирований
- `createBooking(data)` - Создание бронирования

### membershipStore
- `memberships` - Список абонементов
- `currentMembership` - Текущий абонемент
- `purchase(data)` - Покупка абонемента

### notificationStore
- `toasts` - Список уведомлений
- `show(message, type)` - Показ уведомления
- `removeToast(id)` - Удаление уведомления

## Маршрутизация

### Публичные маршруты
- `/` - Главная страница
- `/about` - О клубе
- `/services` - Услуги
- `/schedule` - Расписание
- `/gallery` - Галерея
- `/contact` - Контакты
- `/auth` - Аутентификация

### Приватные маршруты
- `/dashboard` - Личный кабинет
- `/bookings` - Бронирования
- `/memberships` - Абонементы
- `/profile` - Профиль
- `/history` - История

## Стили

Проект использует Tailwind CSS. Основные цвета:

- `primary` - #007bff (синий)
- `secondary` - #6c757d (серый)
- `success` - #28a745 (зеленый)
- `danger` - #dc3545 (красный)
- `warning` - #ffc107 (желтый)
- `info` - #17a2b8 (бирюзовый)

## Полезные команды

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для production
npm run build

# Проверка типов
npm run type-check

# Линтинг кода
npm run lint

# Форматирование кода
npm run format

# Запуск локального сервера
npm run preview

# Генерация типов для API
npm run generate:types
```

## Интеграция с бэкендом

### Базовый URL
API базовый URL задается в `.env` файле:
```
VITE_API_BASE_URL=http://localhost:8000/api
```

### Авторизация
Авторизация осуществляется через JWT токены, которые хранятся в localStorage.

### Обработка ошибок
Все API запросы обрабатываются через interceptors, которые автоматически:
- Добавляют JWT токен в заголовки
- Обрабатывают ошибки авторизации
- Показывают уведомления об ошибках

## Полезные ссылки

- [Vue 3 Documentation](https://vuejs.org/guide/introduction.html)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)