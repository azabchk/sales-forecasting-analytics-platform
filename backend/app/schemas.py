from datetime import date
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str


class StoreResponse(BaseModel):
    store_id: int
    store_type: str | None = None
    assortment: str | None = None


class KpiSummaryResponse(BaseModel):
    total_sales: float
    total_customers: int
    avg_ticket: float
    avg_daily_sales: float


class SalesPoint(BaseModel):
    period: date
    sales: float
    customers: int | None = None


class BreakdownItem(BaseModel):
    label: str
    value: float


class PromoBreakdown(BaseModel):
    promo: int
    avg_sales: float


class HolidayBreakdown(BaseModel):
    state_holiday: str
    avg_sales: float


class KpiBreakdownResponse(BaseModel):
    by_store_type: list[BreakdownItem]
    promo_vs_no_promo: list[PromoBreakdown]
    holiday_impact: list[HolidayBreakdown]


class TopStoreItem(BaseModel):
    store_id: int
    total_sales: float
    avg_daily_sales: float


class StoreAnalyticsResponse(BaseModel):
    weekly_pattern: list[BreakdownItem]
    monthly_sales: list[BreakdownItem]


class ForecastRequest(BaseModel):
    store_id: int = Field(gt=0)
    horizon_days: int = Field(default=30, ge=1, le=180)


class ForecastPoint(BaseModel):
    date: date
    predicted_sales: float
