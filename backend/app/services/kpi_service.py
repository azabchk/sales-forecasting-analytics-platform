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
