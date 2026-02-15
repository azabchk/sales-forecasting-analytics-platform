# API контракт

Базовый префикс: `/api/v1`

## GET /health
**Response 200**
```json
{"status": "ok"}
```

## GET /stores
**Response 200**
```json
[
  {"store_id": 1, "store_type": "c", "assortment": "a"}
]
```

## GET /kpi/summary
Query params:
- `date_from=YYYY-MM-DD`
- `date_to=YYYY-MM-DD`
- `store_id` (optional)

**Response 200**
```json
{
  "total_sales": 123456789.12,
  "total_customers": 456789,
  "avg_ticket": 12.34,
  "avg_daily_sales": 9876.54
}
```

## GET /sales/timeseries
Query params:
- `granularity=daily|monthly`
- `date_from`
- `date_to`
- `store_id` (optional)

**Response 200**
```json
[
  {"period": "2015-01-01", "sales": 5263.0, "customers": 555}
]
```

## GET /sales/promo-impact
Query params:
- `store_id` (optional)

**Response 200**
```json
[
  {"store_id": 1, "promo": 0, "avg_sales": 4321.12, "records_count": 120},
  {"store_id": 1, "promo": 1, "avg_sales": 6589.77, "records_count": 90}
]
```

## POST /forecast
**Request**
```json
{"store_id": 1, "horizon_days": 30}
```

**Response 200**
```json
[
  {"date": "2015-08-01", "predicted_sales": 5041.22},
  {"date": "2015-08-02", "predicted_sales": 4877.15}
]
```

**Response 404**
```json
{"detail": "Store history not found"}
```
