from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import health, stores, kpi, sales, forecast

app = FastAPI(title="Rossmann Forecast API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api/v1")
app.include_router(stores.router, prefix="/api/v1")
app.include_router(kpi.router, prefix="/api/v1")
app.include_router(sales.router, prefix="/api/v1")
app.include_router(forecast.router, prefix="/api/v1")
