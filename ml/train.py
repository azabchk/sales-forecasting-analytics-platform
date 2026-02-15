import json
import os
import joblib
import yaml
import pandas as pd
from sklearn.linear_model import Ridge
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.metrics import mean_absolute_error, root_mean_squared_error
from catboost import CatBoostRegressor
from sqlalchemy import create_engine
from dotenv import load_dotenv
from features import build_feature_matrix


def load_data() -> pd.DataFrame:
    load_dotenv("../.env")
    user = os.getenv("POSTGRES_USER")
    password = os.getenv("POSTGRES_PASSWORD")
    host = os.getenv("POSTGRES_HOST", "localhost")
    port = os.getenv("POSTGRES_PORT", "5432")
    db = os.getenv("POSTGRES_DB")
    engine = create_engine(f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{db}")

    query = """
    SELECT f.store_id, d.full_date, f.sales, f.customers, f.promo, f.school_holiday, f.open,
           s.competition_distance, s.promo2
    FROM fact_sales_daily f
    JOIN dim_date d ON d.date_id = f.date_id
    JOIN dim_store s ON s.store_id = f.store_id
    ORDER BY f.store_id, d.full_date;
    """
    return pd.read_sql(query, engine)


def time_split(df: pd.DataFrame, test_days: int):
    max_date = pd.to_datetime(df["full_date"]).max()
    split_date = max_date - pd.Timedelta(days=test_days)
    train_idx = pd.to_datetime(df["full_date"]) <= split_date
    return df[train_idx], df[~train_idx]


def main():
    with open("config.yaml", "r", encoding="utf-8") as f:
        cfg = yaml.safe_load(f)

    raw = load_data()
    x, y, features, enriched = build_feature_matrix(raw)

    train_df, test_df = time_split(enriched, cfg["train"]["test_days"])
    x_train = train_df[features]
    y_train = train_df["sales"]
    x_test = test_df[features]
    y_test = test_df["sales"]

    num_cols = x_train.columns.tolist()
    preprocessor = ColumnTransformer([
        ("num", Pipeline([("imputer", SimpleImputer(strategy="median")), ("scaler", StandardScaler())]), num_cols)
    ])

    ridge_model = Pipeline([
        ("preprocessor", preprocessor),
        ("model", Ridge(alpha=1.0))
    ])
    ridge_model.fit(x_train, y_train)
    ridge_pred = ridge_model.predict(x_test)
    ridge_metrics = {
        "mae": float(mean_absolute_error(y_test, ridge_pred)),
        "rmse": float(root_mean_squared_error(y_test, ridge_pred))
    }

    cat_model = CatBoostRegressor(
        depth=8,
        learning_rate=0.05,
        iterations=300,
        loss_function="RMSE",
        verbose=False
    )
    cat_model.fit(x_train, y_train)
    cat_pred = cat_model.predict(x_test)
    cat_metrics = {
        "mae": float(mean_absolute_error(y_test, cat_pred)),
        "rmse": float(root_mean_squared_error(y_test, cat_pred))
    }

    best_name = "catboost" if cat_metrics["rmse"] < ridge_metrics["rmse"] else "ridge"
    best_model = cat_model if best_name == "catboost" else ridge_model

    os.makedirs(cfg["paths"]["artifacts_dir"], exist_ok=True)
    joblib.dump(best_model, cfg["paths"]["model_path"])

    metadata = {
        "best_model": best_name,
        "features": features,
        "train_date_from": str(pd.to_datetime(train_df["full_date"]).min().date()),
        "train_date_to": str(pd.to_datetime(train_df["full_date"]).max().date()),
        "test_date_from": str(pd.to_datetime(test_df["full_date"]).min().date()),
        "test_date_to": str(pd.to_datetime(test_df["full_date"]).max().date()),
        "metrics": {
            "ridge": ridge_metrics,
            "catboost": cat_metrics
        }
    }
    with open(cfg["paths"]["metadata_path"], "w", encoding="utf-8") as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)

    print("Training completed. Best model:", best_name)


if __name__ == "__main__":
    main()
