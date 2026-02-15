import os
import yaml
import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv


def load_config(path: str = "config.yaml") -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def get_engine():
    load_dotenv("../.env")
    user = os.getenv("POSTGRES_USER")
    password = os.getenv("POSTGRES_PASSWORD")
    host = os.getenv("POSTGRES_HOST", "localhost")
    port = os.getenv("POSTGRES_PORT", "5432")
    db = os.getenv("POSTGRES_DB")
    conn_str = f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{db}"
    return create_engine(conn_str)


def build_dim_date(train_df: pd.DataFrame) -> pd.DataFrame:
    dates = pd.DataFrame({"full_date": pd.to_datetime(train_df["Date"]).drop_duplicates().sort_values()})
    dates["date_id"] = dates["full_date"].dt.strftime("%Y%m%d").astype(int)
    dates["day"] = dates["full_date"].dt.day
    dates["month"] = dates["full_date"].dt.month
    dates["year"] = dates["full_date"].dt.year
    dates["quarter"] = dates["full_date"].dt.quarter
    dates["week_of_year"] = dates["full_date"].dt.isocalendar().week.astype(int)
    dates["day_of_week"] = dates["full_date"].dt.dayofweek + 1
    dates["is_weekend"] = dates["day_of_week"].isin([6, 7])
    return dates


def transform_data(train_path: str, store_path: str):
    train_df = pd.read_csv(train_path)
    store_df = pd.read_csv(store_path)

    train_df["Date"] = pd.to_datetime(train_df["Date"])
    train_df["Sales"] = train_df["Sales"].fillna(0)
    train_df["Customers"] = train_df["Customers"].fillna(0)

    dim_store = store_df.rename(
        columns={
            "Store": "store_id",
            "StoreType": "store_type",
            "Assortment": "assortment",
            "CompetitionDistance": "competition_distance",
            "CompetitionOpenSinceMonth": "competition_open_since_month",
            "CompetitionOpenSinceYear": "competition_open_since_year",
            "Promo2": "promo2",
            "Promo2SinceWeek": "promo2_since_week",
            "Promo2SinceYear": "promo2_since_year",
            "PromoInterval": "promo_interval",
        }
    )

    dim_date = build_dim_date(train_df)

    fact = train_df.rename(
        columns={
            "Store": "store_id",
            "Sales": "sales",
            "Customers": "customers",
            "Promo": "promo",
            "StateHoliday": "state_holiday",
            "SchoolHoliday": "school_holiday",
            "Open": "open",
        }
    )
    fact["date_id"] = fact["Date"].dt.strftime("%Y%m%d").astype(int)
    fact = fact[["store_id", "date_id", "sales", "customers", "promo", "state_holiday", "school_holiday", "open"]]
    return dim_store, dim_date, fact


def load_to_db(engine, dim_store, dim_date, fact, truncate=True):
    with engine.begin() as conn:
        if truncate:
            conn.execute(text("TRUNCATE TABLE fact_sales_daily, dim_date, dim_store RESTART IDENTITY CASCADE;"))

    dim_store.to_sql("dim_store", engine, if_exists="append", index=False)
    dim_date.to_sql("dim_date", engine, if_exists="append", index=False)
    fact.to_sql("fact_sales_daily", engine, if_exists="append", index=False)


if __name__ == "__main__":
    cfg = load_config("config.yaml")
    dim_store_df, dim_date_df, fact_df = transform_data(cfg["data"]["train_csv"], cfg["data"]["store_csv"])
    db_engine = get_engine()
    load_to_db(db_engine, dim_store_df, dim_date_df, fact_df, cfg["database"].get("truncate_before_load", True))
    print("ETL completed successfully.")
