# Разработка модели прогнозирования продаж для аналитической платформы интернет-магазина

Командный проект ВКР (УрФУ, 2 разработчика):
- **Developer A (ML/Data):** DWH + ETL + ML + FastAPI.
- **Developer B (Web):** React Dashboard + UI + API интеграция.

## Обзор
Репозиторий реализует полный E2E-поток:
`Raw CSV -> ETL -> PostgreSQL Star Schema -> KPI Views -> ML Forecasting -> FastAPI -> React Dashboard`.

Источник данных: **Rossmann Store Sales (Kaggle)**, прогнозирование на уровне **день × магазин**.

## Архитектура (ASCII)
```text
+----------------------+         +-------------------------+
| data/train.csv       |         | data/store.csv          |
+----------+-----------+         +------------+------------+
           |                                  |
           +------------- ETL (Python) -------+
                           |
                           v
                 +----------------------+
                 | PostgreSQL (DWH)     |
                 | dim_store            |
                 | dim_date             |
                 | fact_sales_daily     |
                 | KPI views            |
                 +----+------------+----+
                      |            |
                      | SQL        | training data
                      v            v
                +-------------+  +----------------+
                | FastAPI API  |  | ML pipeline    |
                | /api/v1/...  |  | Ridge/CatBoost |
                +------+-------+  +-------+--------+
                       |                  |
                       +-------+----------+
                               v
                     +----------------------+
                     | React Dashboard (TS) |
                     +----------------------+
```

## 1) Предварительные шаги
```bash
cp .env.example .env
docker compose up -d
```

## 2) Загрузка датасета
1. Скачать архив с Kaggle: https://www.kaggle.com/competitions/rossmann-store-sales/data
2. Поместить файлы `train.csv` и `store.csv` в каталог `data/`.
3. Датасет **не коммитится** (см. `.gitignore`).

## 3) ETL
```bash
cd etl
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python etl_load.py
python data_quality.py
cd ..
```

## 4) Обучение модели
```bash
cd ml
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python train.py
python evaluate.py
cd ..
```

## 5) Запуск backend
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## 6) Запуск frontend
```bash
cd frontend
npm install
npm run dev
```

## Troubleshooting
- Если API не видит БД: проверьте `POSTGRES_*` в `.env` и статус контейнера (`docker compose ps`).
- Если `/forecast` возвращает ошибку: убедитесь, что `ml/artifacts/model.joblib` и `model_metadata.json` существуют.
- Если пустые графики: проверьте, что ETL загрузил данные и указаны корректные `date_from/date_to`.

## Полезные ссылки
См. `docs/Источники.md`.
