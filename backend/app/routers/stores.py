from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db import get_db

router = APIRouter(prefix="/stores", tags=["stores"])


@router.get("")
def get_stores(db: Session = Depends(get_db)):
    rows = db.execute(text("SELECT store_id, store_type, assortment FROM dim_store ORDER BY store_id")).mappings().all()
    return [dict(r) for r in rows]
