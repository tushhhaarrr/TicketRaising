from pydantic_settings import BaseSettings  # Pydantic ke settings management module ko import kar rahe hain. Ye .env file se variables load karne mein help karta hai.
from typing import Optional  # Type hinting ke liye.

class Settings(BaseSettings):  # Settings values ko define karne ke liye Pydantic model. Environment variables automatically properties mein map ho jayenge.
    # App General
    PROJECT_NAME: str = "Ticket Raising Platform"  # Application ka display name.
    API_V1_STR: str = "/api/v1"  # API prefix versioning ke liye. Version 1 rakha hai taaki future mein v2 bana sakein bina old clients ko tode.

    # Database
    # Defaulting to a generic local postgres url, user should update .env
    # Database URL stored here. Env variable `DATABASE_URL` override karega is default value ko.
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/ticket_db"

    # Security
    # Key should be generated securely in production (e.g. openssl rand -hex 32)
    # SECRET_KEY use hota hai JWT token sign karne ke liye. Default insecure rakha hai, production mein ye .env se load hona chahiye.
    SECRET_KEY: str = "INSECURE_DEFAULT_KEY_PLEASE_CHANGE"
    ALGORITHM: str = "HS256"  # JWT encryption algorithm. symmetric signing ke liye HS256 standard hai.
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30  # Token validity duration. Short duration security ke liye better hai.

    # Admin Setup (Optional: to auto-create a super admin on startup if desired)
    # Default superuser credentials. Startup script isko use karke admin create karegi agar wo exist nahi karta.
    FIRST_SUPERUSER: str = "admin@example.com"
    FIRST_SUPERUSER_PASSWORD: str = "admin123"

    class Config:  # Pydantic config settings.
        env_file = ".env"  # Batata hai ki variables kahan se load karne hain. Default `.env` file hai.
        case_sensitive = True  # Environment variables case sensitive honge, e.g., 'DATABASE_URL' matched hai, 'database_url' nahi.

settings = Settings()  # Settings ka singleton instance create kar rahe hain puri app mein use karne ke liye.
