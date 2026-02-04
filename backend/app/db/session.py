from sqlalchemy import create_engine  # `create_engine` import kiya jo database connection ka entry point hai. Ye connection pool manage karta hai raw connection ke mukable.
from sqlalchemy.orm import sessionmaker, declarative_base  # `sessionmaker` factory hai sessions banane ke liye, aur `declarative_base` models ka base class hai.
from app.core.config import settings  # Settings import kiye taaki hardcoded credentials use na karein. Config se DB URL lena best practice hai.

# Create the SQLAlchemy engine using the database URL from settings
# Engine start kar rahe hain settings se URL lekar. `connect_args={"check_same_thread": False}` sirf SQLite ke liye chahiye hota hai, Postgres ke liye nahi.
engine = create_engine(settings.DATABASE_URL)  # Engine initialize kiya. Ye turant connect nahi karta, lazy connection hota hai (jab pehli query aayegi tab connect hoga).

# Create a scoped session factory
# `autocommit=False` isliye rakha taaki hum manually `commit()` karein jab transaction pura ho, data integrity ke liye.
# `autoflush=False` isliye taaki query karte waqt pending changes automatically DB mein push na ho jayein bina control ke.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)  # Session factory banayi. Hum iska instance har request pe banayenge.

# Base class for our database models
# Saare ORM models is `Base` class ko inherit karenge taaki SQLAlchemy unhe track kar sake.
Base = declarative_base()  # Registry maintain karne ke liye base class.

# Dependency to get a DB session
# Ye dependency injection ke liye function hai jo FastAPI routes mein use hoga.
def get_db():
    db = SessionLocal()  # Naya session start kiya. Har request ke liye isolated session hona chahiye concurrency safe rakhne ke liye.
    try:
        yield db  # Session ko route ko pass kiya. `yield` use kiya taaki response bhejne ke baad hum wapas control le sakein (teardown ke liye).
    finally:
        db.close()  # Request khatam hote hi session close kiya taaki connection pool mein connection wapas chala jaye. Memory leak se bachne ke liye ye critical hai.
