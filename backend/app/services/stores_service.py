from sqlalchemy import text


def get_store_analytics(db, store_id: int, date_from: str, date_to: str):
    weekly = db.execute(
        text(
            """
            SELECT CAST(d.day_of_week AS text) AS label, AVG(f.sales) AS value
            FROM fact_sales_daily f
            JOIN dim_date d ON d.date_id = f.date_id
            WHERE f.store_id = :store_id
              AND d.full_date BETWEEN :date_from AND :date_to
            GROUP BY d.day_of_week
            ORDER BY d.day_of_week
            """
        ),
        {"store_id": store_id, "date_from": date_from, "date_to": date_to},
    ).mappings().all()

    monthly = db.execute(
        text(
            """
            SELECT TO_CHAR(DATE_TRUNC('month', d.full_date), 'YYYY-MM') AS label,
                   SUM(f.sales) AS value
            FROM fact_sales_daily f
            JOIN dim_date d ON d.date_id = f.date_id
            WHERE f.store_id = :store_id
              AND d.full_date BETWEEN :date_from AND :date_to
            GROUP BY DATE_TRUNC('month', d.full_date)
            ORDER BY DATE_TRUNC('month', d.full_date)
            """
        ),
        {"store_id": store_id, "date_from": date_from, "date_to": date_to},
    ).mappings().all()

    return {
        "weekly_pattern": [dict(row) for row in weekly],
        "monthly_sales": [dict(row) for row in monthly],
    }
