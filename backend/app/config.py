import os
from dotenv import load_dotenv

load_dotenv("../.env")


class Settings:
    db_host: str = os.getenv("POSTGRES_HOST", "localhost")
    db_port: str = os.getenv("POSTGRES_PORT", "5432")
    db_name: str = os.getenv("POSTGRES_DB", "rossmann")
    db_user: str = os.getenv("POSTGRES_USER", "rossmann_user")
    db_password: str = os.getenv("POSTGRES_PASSWORD", "change_me")

    cors_origins: list[str] = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    model_path: str = os.getenv("MODEL_PATH", "../ml/artifacts/model.joblib")
    metadata_path: str = os.getenv("METADATA_PATH", "../ml/artifacts/model_metadata.json")


settings = Settings()
