# ETL модуль (Developer A)

## Назначение
Модуль загружает `train.csv` и `store.csv` (Rossmann), выполняет очистку, строит измерения `dim_store`, `dim_date` и факт `fact_sales_daily`, затем загружает данные в PostgreSQL.

## Подготовка (Ubuntu 24.04)
```bash
cd etl
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Запуск ETL
```bash
cp ../.env.example ../.env
python etl_load.py
```

## Проверка качества данных
```bash
python data_quality.py
```

## Идемпотентность
Реализован безопасный сценарий `TRUNCATE + RELOAD` (конфиг `truncate_before_load: true`), что обеспечивает повторяемую загрузку без дубликатов.
