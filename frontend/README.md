# Frontend (React + TypeScript)

## Функции
- Страница **Overview**: KPI карточки и общий график продаж.
- Страница **Store Analytics**: выбор магазина, дневной график, влияние промо.
- Страница **Forecast**: выбор магазина/горизонта и график прогноза.

## Установка и запуск (Ubuntu 24.04)
```bash
cd frontend
cp ../.env.example ../.env
npm install
npm run dev
```

## Конфигурация API
Используется `VITE_API_BASE_URL` (см. `../.env`).
