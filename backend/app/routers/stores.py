from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db import get_db
from app.services.stores_service import get_store_analytics

router = APIRouter(prefix="/stores", tags=["stores"])


@router.get("")
def get_stores(db: Session = Depends(get_db)):
    rows = db.execute(text("SELECT store_id, store_type, assortment FROM dim_store ORDER BY store_id")).mappings().all()
    return [dict(r) for r in rows]


@router.get("/{store_id}/analytics")
def store_analytics(
    store_id: int,
    date_from: str = Query(..., pattern=r"^\d{4}-\d{2}-\d{2}$"),
    date_to: str = Query(..., pattern=r"^\d{4}-\d{2}-\d{2}$"),
    db: Session = Depends(get_db),
):
    return get_store_analytics(db, store_id, date_from, date_to)
