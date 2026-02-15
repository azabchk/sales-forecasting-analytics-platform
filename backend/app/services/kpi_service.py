from sqlalchemy import text


def get_kpi_summary(db, date_from: str, date_to: str, store_id: int | None):
    query = """
        SELECT COALESCE(SUM(total_sales),0) AS total_sales,
               COALESCE(SUM(total_customers),0) AS total_customers,
               COALESCE(AVG(avg_ticket),0) AS avg_ticket,
               COALESCE(AVG(avg_daily_sales),0) AS avg_daily_sales
        FROM v_kpi_summary
        WHERE full_date BETWEEN :date_from AND :date_to
    """
    params = {"date_from": date_from, "date_to": date_to}
    if store_id:
        query += " AND store_id = :store_id"
        params["store_id"] = store_id

    row = db.execute(text(query), params).mappings().first()
    return dict(row)


def get_breakdowns(db, date_from: str, date_to: str, store_id: int | None):
    params = {"date_from": date_from, "date_to": date_to}
    store_filter = ""
    if store_id:
        store_filter = "AND f.store_id = :store_id"
        params["store_id"] = store_id

    by_store_type = db.execute(
        text(
            f"""
            SELECT COALESCE(s.store_type, 'N/A') AS label, SUM(f.sales) AS value
            FROM fact_sales_daily f
            JOIN dim_date d ON d.date_id = f.date_id
            JOIN dim_store s ON s.store_id = f.store_id
            WHERE d.full_date BETWEEN :date_from AND :date_to
            {store_filter}
            GROUP BY s.store_type
            ORDER BY value DESC
            """
        ),
        params,
    ).mappings().all()

    promo_vs_no_promo = db.execute(
        text(
            f"""
            SELECT COALESCE(f.promo, 0) AS promo, AVG(f.sales) AS avg_sales
            FROM fact_sales_daily f
            JOIN dim_date d ON d.date_id = f.date_id
            WHERE d.full_date BETWEEN :date_from AND :date_to
            {store_filter}
            GROUP BY f.promo
            ORDER BY promo
            """
        ),
        params,
    ).mappings().all()

    holiday_impact = db.execute(
        text(
            f"""
            SELECT COALESCE(NULLIF(f.state_holiday, ''), '0') AS state_holiday, AVG(f.sales) AS avg_sales
            FROM fact_sales_daily f
            JOIN dim_date d ON d.date_id = f.date_id
            WHERE d.full_date BETWEEN :date_from AND :date_to
            {store_filter}
            GROUP BY COALESCE(NULLIF(f.state_holiday, ''), '0')
            ORDER BY state_holiday
            """
        ),
        params,
    ).mappings().all()

    return {
        "by_store_type": [dict(row) for row in by_store_type],
        "promo_vs_no_promo": [dict(row) for row in promo_vs_no_promo],
        "holiday_impact": [dict(row) for row in holiday_impact],
    }


def get_top_stores(db, date_from: str, date_to: str, limit: int):
    rows = db.execute(
        text(
            """
            SELECT f.store_id,
                   SUM(f.sales) AS total_sales,
                   AVG(f.sales) AS avg_daily_sales
            FROM fact_sales_daily f
            JOIN dim_date d ON d.date_id = f.date_id
            WHERE d.full_date BETWEEN :date_from AND :date_to
            GROUP BY f.store_id
            ORDER BY total_sales DESC
            LIMIT :limit
            """
        ),
        {"date_from": date_from, "date_to": date_to, "limit": limit},
    ).mappings().all()
    return [dict(row) for row in rows]
