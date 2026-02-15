# Backend (FastAPI)

## Возможности
- REST API `/api/v1` для KPI, временных рядов, магазинов и прогноза.
- Подключение к PostgreSQL (звезда + KPI views).
- Инференс на основе `ml/artifacts/model.joblib`.

## Установка и запуск (Ubuntu 24.04)
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp ../.env.example ../.env
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

## Эндпоинты
- `GET /api/v1/health`
- `GET /api/v1/stores`
- `GET /api/v1/stores/{store_id}/analytics?date_from=...&date_to=...`
- `GET /api/v1/kpi/summary?date_from=...&date_to=...&store_id=optional`
- `GET /api/v1/kpi/breakdowns?date_from=...&date_to=...&store_id=optional`
- `GET /api/v1/kpi/top-stores?date_from=...&date_to=...&limit=10`
- `GET /api/v1/sales/timeseries?granularity=daily|monthly&date_from=...&date_to=...&store_id=optional`
- `GET /api/v1/sales/promo-impact?store_id=optional`
- `POST /api/v1/forecast`
