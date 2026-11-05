import os

class Settings:
    PROJECT_NAME: str = "IPL Auction Arena 2027"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Database: Use DATABASE_URL if provided, else SQLite in backend/data
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./backend/data/ipl_auction_2027.db"
    )
    
    # JWT Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "ipl-auction-arena-2027-glacier-mint-secret-key-super-secure")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Redis (Optional)
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # Bidding rules defaults
    DEFAULT_PURSE_CR: float = 120.0
    MIN_SQUAD_SIZE: int = 18
    MAX_SQUAD_SIZE: int = 25
    MAX_OVERSEAS: int = 8
    DEFAULT_COUNTDOWN_SECONDS: int = 10
    MIN_PLAYER_BASE_PRICE_LAKH: int = 30

settings = Settings()
