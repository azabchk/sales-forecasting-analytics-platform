import json
import joblib
import pandas as pd
import numpy as np


def recursive_forecast(model, history_df, feature_cols, horizon_days=30):
    history = history_df.copy().sort_values("full_date")
    preds = []
    last_date = pd.to_datetime(history["full_date"]).max()

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


if __name__ == "__main__":
    model = joblib.load("./artifacts/model.joblib")
    with open("./artifacts/model_metadata.json", "r", encoding="utf-8") as f:
        metadata = json.load(f)
    print("Loaded model with features:", len(metadata["features"]))
