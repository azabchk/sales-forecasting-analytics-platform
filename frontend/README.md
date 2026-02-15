# Frontend (React + TypeScript)

## Что улучшено
- Профессиональная тёмная тема, адаптивная сетка, улучшенная иерархия KPI.
- Скелетоны загрузки, empty/error состояния во всех ключевых виджетах.
- Фильтры периода, разрезы продаж, таблица топ-магазинов, аналитика магазина и прогноз.
- Централизованный конфиг окружения и типизированный API-клиент с timeout/retry/cache/dedup.

## Важный env (Vite)
Vite читает env из каталога `frontend/`, поэтому используется `frontend/.env.local`:
```env
VITE_API_BASE_URL=http://localhost:8001/api/v1
```

## Запуск (Ubuntu 24.04)
```bash
cd frontend
npm install
npm run dev
```
После изменения env перезапустите dev-сервер.
