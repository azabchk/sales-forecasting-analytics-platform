CREATE OR REPLACE VIEW v_kpi_summary AS
SELECT
    d.full_date,
    f.store_id,
    SUM(f.sales) AS total_sales,
    SUM(f.customers) AS total_customers,
    AVG(NULLIF(f.sales, 0)) AS avg_ticket,
    AVG(f.sales) AS avg_daily_sales
FROM fact_sales_daily f
JOIN dim_date d ON d.date_id = f.date_id
GROUP BY d.full_date, f.store_id;

CREATE OR REPLACE VIEW v_sales_timeseries_daily AS
SELECT
    d.full_date,
    f.store_id,
    SUM(f.sales) AS sales,
    SUM(f.customers) AS customers
FROM fact_sales_daily f
JOIN dim_date d ON d.date_id = f.date_id
GROUP BY d.full_date, f.store_id;

CREATE OR REPLACE VIEW v_sales_timeseries_monthly AS
SELECT
    DATE_TRUNC('month', d.full_date)::date AS month_start,
    f.store_id,
    SUM(f.sales) AS sales,
    SUM(f.customers) AS customers
FROM fact_sales_daily f
JOIN dim_date d ON d.date_id = f.date_id
GROUP BY DATE_TRUNC('month', d.full_date), f.store_id;

CREATE OR REPLACE VIEW v_top_stores_by_sales AS
SELECT
    f.store_id,
    SUM(f.sales) AS total_sales,
    RANK() OVER (ORDER BY SUM(f.sales) DESC) AS sales_rank
FROM fact_sales_daily f
GROUP BY f.store_id;

CREATE OR REPLACE VIEW v_promo_impact AS
SELECT
    f.store_id,
    f.promo,
    AVG(f.sales) AS avg_sales,
    COUNT(*) AS records_count
FROM fact_sales_daily f
GROUP BY f.store_id, f.promo;
