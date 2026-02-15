from sqlalchemy import text


def get_timeseries(db, granularity: str, date_from: str, date_to: str, store_id: int | None):
    if granularity == "monthly":
        table = "v_sales_timeseries_monthly"
        period_col = "month_start"
    else:
        table = "v_sales_timeseries_daily"
        period_col = "full_date"

    query = f"""
        SELECT {period_col} AS period, SUM(sales) AS sales, SUM(customers) AS customers
        FROM {table}
        WHERE {period_col} BETWEEN :date_from AND :date_to
    """
    params = {"date_from": date_from, "date_to": date_to}
    if store_id:
        query += " AND store_id = :store_id"
        params["store_id"] = store_id

    query += f" GROUP BY {period_col} ORDER BY {period_col}"
    rows = db.execute(text(query), params).mappings().all()
    return [dict(r) for r in rows]


def get_promo_impact(db, store_id: int | None):
    query = "SELECT store_id, promo, avg_sales, records_count FROM v_promo_impact"
    params = {}
    if store_id:
        query += " WHERE store_id = :store_id"
        params["store_id"] = store_id
    rows = db.execute(text(query), params).mappings().all()
    return [dict(r) for r in rows]
