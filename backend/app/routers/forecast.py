from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas import ForecastRequest
from app.services.forecast_service import make_forecast

router = APIRouter(prefix="/forecast", tags=["forecast"])


@router.post("")
def forecast(payload: ForecastRequest, db: Session = Depends(get_db)):
    result = make_forecast(db, payload.store_id, payload.horizon_days)
    if not result:
        raise HTTPException(status_code=404, detail="Store history not found")
    return result
