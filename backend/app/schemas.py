from pydantic import BaseModel, Field
from datetime import date


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


class ForecastRequest(BaseModel):
    store_id: int = Field(gt=0)
    horizon_days: int = Field(default=30, ge=1, le=180)


class ForecastPoint(BaseModel):
    date: date
    predicted_sales: float
