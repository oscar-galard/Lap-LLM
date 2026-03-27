import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    # Database settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/lap_llm")

    # API Keys
    DEEPSEEK_API_KEY: str = os.getenv("DEEPSEEK_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")

    # LLM Configuration
    # Options: "deepseek", "openrouter"
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "deepseek")
    OPENROUTER_MODEL: str = os.getenv("OPENROUTER_MODEL", "google/gemma-2-9b-it:free")

    # CORS settings
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "*")

    # PDF settings
    PDF_PATH: str = os.getenv("PDF_PATH", "/app/data/Inferencia-LLM-en-dispositivos.pdf")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
