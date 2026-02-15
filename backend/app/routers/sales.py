from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db import get_db
from app.services.sales_service import get_timeseries, get_promo_impact

router = APIRouter(prefix="/sales", tags=["sales"])


@router.get("/timeseries")
def sales_timeseries(
    granularity: str = Query("daily", pattern="^(daily|monthly)$"),
    date_from: str = Query(..., pattern=r"^\d{4}-\d{2}-\d{2}$"),
    date_to: str = Query(..., pattern=r"^\d{4}-\d{2}-\d{2}$"),
    store_id: int | None = None,
    db: Session = Depends(get_db),
):
    return get_timeseries(db, granularity, date_from, date_to, store_id)


@router.get("/promo-impact")
def promo_impact(store_id: int | None = None, db: Session = Depends(get_db)):
    return get_promo_impact(db, store_id)
