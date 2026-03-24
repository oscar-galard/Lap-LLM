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

    # PDF settings
    PDF_PATH: str = os.getenv("PDF_PATH", "/home/oscar/projects/lap-llm/backend/Inferencia-LLM-en-dispositivos.pdf")

    class Config:
        env_file = ".env"

settings = Settings()