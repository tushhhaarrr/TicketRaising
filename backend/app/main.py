from fastapi import FastAPI  # FastAPI main class import kar rahe hain app initiate karne ke liye.
from fastapi.staticfiles import StaticFiles  # Static files serve karne ke liye import. Yeh development mein images/css serve karne ke kaam aata hai.
from app.routers import auth, tickets, admins, users  # Humare endpoints (routers) ko import kar rahe hain taaki main app se connect kar sakein.
from app.core.config import settings  # Global settings import kar rahe hain taaki constants (jaise app name) hardcode na karna pade.

# Initialize FastAPI App
# FastAPI app create kar rahe hain. Title aur OpenAPI URL settings se le rahe hain configurable rakhne ke liye.
app = FastAPI(
    title=settings.PROJECT_NAME,  # Title settings se aa raha hai, consistency ke liye.
    openapi_url=f"{settings.API_V1_STR}/openapi.json"  # Custom openapi url set kar rahe hain versioning (API_V1_STR) maintain karne ke liye.
)

# Mount Uploads directory to serve files
# 'uploads' folder ko '/uploads' URL pe mount kar rahe hain taaki uploaded files directly browser se access ho sakein.
# Warning: In production, use Nginx/S3. This is for dev/demo.
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")  # StaticFiles helper use kiya folder serve karne ke liye. Production mein slow ho sakta hai, wahan dedicated server use karein.

# Include Routers
# Alag-alag modules ke routes ko main application mein jod rahe hain modularity maintain karne ke liye.
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Auth"])  # Auth endpoints.
app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["Users"])  # User management endpoints.
app.include_router(tickets.router, prefix=f"{settings.API_V1_STR}/tickets", tags=["Tickets"])  # Ticket management endpoints.
app.include_router(admins.router, prefix=f"{settings.API_V1_STR}/admins", tags=["Admins"])  # Admin management endpoints.

@app.on_event("startup")  # Startup event hook - jab server start hoga tab ye function run karega. Initialize tasks ke liye useful hai.
def startup_event():
    # Create the upload directory if it doesn't exist
    import os  # OS module import local file system operations ke liye.
    if not os.path.exists("uploads"):  # Check kar rahe hain ki uploads folder exist karta hai ya nahi.
        os.makedirs("uploads")  # Agar nahi hai, toh create kar rahe hain taaki file upload errors na aayein baad mein.
    
    # Init DB with Super Admin if not exists
    # Note: Ideally this should be a script, but for demo convenience we put it here
    # We need to manually create a session here
    from app.db.session import SessionLocal  # DB session factory import.
    from app.models.user import Admin  # Admin model logic check karne ke liye.
    from app.core import security  # Security utility import password hash karne ke liye.
    from app.models.enums import AdminRole  # AdminRole enum import constants use karne ke liye.
    
    db = SessionLocal()  # Manually session create kar rahe hain kyunki startup event mein request context (dependency injection) available nahi hota.
    try:
        user = db.query(Admin).filter(Admin.email == settings.FIRST_SUPERUSER).first()  # Check kar rahe hain ki default superuser pehle se hai ya nahi.
        if not user:  # Agar nahi hai, toh create karenge.
            super_admin = Admin(  # Admin object tayar kar rahe hain.
                email=settings.FIRST_SUPERUSER,  # Email settings se.
                hashed_password=security.get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),  # Password hash karke store karna zaroori hai DB breach se bachne ke liye.
                full_name="Super Admin",  # Default naaam.
                role=AdminRole.SENIOR,  # Highest access level de rahe hain.
                is_active=True  # Direct active user bana rahe hain.
            )
            db.add(super_admin)  # Session mein object add kiya.
            db.commit()  # DB mein commit kiya taaki row insert ho jaye.
            print(f"Super Admin created: {settings.FIRST_SUPERUSER}")  # Log message confirm karne ke liye.
    except Exception as e:
        print(f"Error initializing database (Tables might not exist yet): {e}")  # Agar DB connect nahi hua ya tables missing hain, toh crash karne ki bajaye warning de rahe hain.
    finally:
        db.close()  # Session close karna zaroori hai resource clean up ke liye, warning avoid karne ke liye.

# Trigger reload to run startup event and create super admin
@app.get("/")  # Root endpoint define kar rahe hain check karne ke liye ki API chalu hai ya nahi.
def root():
    return {"message": "Welcome to the Ticket Raising Platform API"}  # Simple JSON response. Basic connectivity test ke liye.
