import os
import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv


def get_engine():
    load_dotenv("../.env")
    user = os.getenv("POSTGRES_USER")
    password = os.getenv("POSTGRES_PASSWORD")
    host = os.getenv("POSTGRES_HOST", "localhost")
    port = os.getenv("POSTGRES_PORT", "5432")
    db = os.getenv("POSTGRES_DB")
    return create_engine(f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{db}")


def run_checks(engine):
    checks = {}
    with engine.connect() as conn:
        checks["missing_sales"] = conn.execute(text("SELECT COUNT(*) FROM fact_sales_daily WHERE sales IS NULL;")).scalar()
        checks["duplicate_store_date"] = conn.execute(
            text("""
                SELECT COUNT(*) FROM (
                    SELECT store_id, date_id, COUNT(*) c
                    FROM fact_sales_daily
                    GROUP BY store_id, date_id
                    HAVING COUNT(*) > 1
                ) t;
            """)
        ).scalar()
        checks["fk_store_violations"] = conn.execute(
            text("""
                SELECT COUNT(*)
                FROM fact_sales_daily f
                LEFT JOIN dim_store s ON s.store_id = f.store_id
                WHERE s.store_id IS NULL;
            """)
        ).scalar()
        checks["fk_date_violations"] = conn.execute(
            text("""
                SELECT COUNT(*)
                FROM fact_sales_daily f
                LEFT JOIN dim_date d ON d.date_id = f.date_id
                WHERE d.date_id IS NULL;
            """)
        ).scalar()
        coverage = conn.execute(text("SELECT MIN(full_date), MAX(full_date), COUNT(*) FROM dim_date;")).fetchone()
        checks["date_coverage"] = f"{coverage[0]} .. {coverage[1]} ({coverage[2]} days)"
    return checks


if __name__ == "__main__":
    engine = get_engine()
    result = run_checks(engine)
    print(pd.Series(result).to_string())
