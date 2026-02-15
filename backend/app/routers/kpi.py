from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db import get_db
from app.services.kpi_service import get_kpi_summary

router = APIRouter(prefix="/kpi", tags=["kpi"])


@router.get("/summary")
def kpi_summary(
    date_from: str = Query(..., pattern=r"^\d{4}-\d{2}-\d{2}$"),
    date_to: str = Query(..., pattern=r"^\d{4}-\d{2}-\d{2}$"),
    store_id: int | None = None,
    db: Session = Depends(get_db),
):
    return get_kpi_summary(db, date_from, date_to, store_id)
