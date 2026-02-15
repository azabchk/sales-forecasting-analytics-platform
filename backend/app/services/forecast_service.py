import json
import joblib
import numpy as np
import pandas as pd
from sqlalchemy import text
from app.config import settings


def load_artifacts():
    model = joblib.load(settings.model_path)
    with open(settings.metadata_path, "r", encoding="utf-8") as f:
        metadata = json.load(f)
    return model, metadata


def get_store_history(db, store_id: int):
    query = """
    SELECT f.store_id, d.full_date, f.sales, f.customers, f.promo, f.school_holiday, f.open,
           s.competition_distance, s.promo2
    FROM fact_sales_daily f
    JOIN dim_date d ON d.date_id = f.date_id
    JOIN dim_store s ON s.store_id = f.store_id
    WHERE f.store_id = :store_id
    ORDER BY d.full_date;
    """
    rows = db.execute(text(query), {"store_id": store_id}).mappings().all()
    return pd.DataFrame(rows)


def recursive_forecast(model, history_df, feature_cols, horizon_days=30):
    history = history_df.copy().sort_values("full_date")
    history["full_date"] = pd.to_datetime(history["full_date"])
    preds = []
    last_date = history["full_date"].max()

    for i in range(horizon_days):
        current_date = last_date + pd.Timedelta(days=i + 1)
        base = history.iloc[-1:].copy()
        base["full_date"] = current_date
        base["day"] = current_date.day
        base["month"] = current_date.month
        base["year"] = current_date.year
        base["week_of_year"] = int(current_date.isocalendar().week)
        base["day_of_week"] = current_date.dayofweek + 1
        base["is_weekend"] = 1 if base["day_of_week"].iloc[0] in [6, 7] else 0

        sales_series = history["sales"].tolist()
        for lag in [1, 7, 14, 28]:
            base[f"lag_{lag}"] = sales_series[-lag] if len(sales_series) >= lag else np.mean(sales_series)
        for w in [7, 14, 28]:
            base[f"roll_mean_{w}"] = float(np.mean(sales_series[-w:])) if len(sales_series) >= w else float(np.mean(sales_series))

        x = base[feature_cols]
        pred = float(model.predict(x)[0])
        base["sales"] = pred
        history = pd.concat([history, base], ignore_index=True)
        preds.append({"date": str(current_date.date()), "predicted_sales": round(pred, 2)})

    return preds


def make_forecast(db, store_id: int, horizon_days: int):
    model, metadata = load_artifacts()
    hist = get_store_history(db, store_id)
    if hist.empty:
        return []
    return recursive_forecast(model, hist, metadata["features"], horizon_days)
