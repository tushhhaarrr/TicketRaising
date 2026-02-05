from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware # Import CORS
from app.routers import auth, tickets, admins, users
from app.core.config import settings

# Initialize FastAPI App
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS Middleware Setup
# Allow all origins for development (or specify localhost:5173)
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "*" # Use specific origins in production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Uploads directory to serve files
# Warning: In production, use Nginx/S3. This is for dev/demo.
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Auth"])
app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["Users"])
app.include_router(tickets.router, prefix=f"{settings.API_V1_STR}/tickets", tags=["Tickets"])
app.include_router(admins.router, prefix=f"{settings.API_V1_STR}/admins", tags=["Admins"])

@app.on_event("startup")
def startup_event():
    # Create the upload directory if it doesn't exist
    import os
    if not os.path.exists("uploads"):
        os.makedirs("uploads")
    
    # Init DB with Super Admin if not exists
    from app.db.session import SessionLocal
    from app.models.user import Admin, User
    from app.core import security
    from app.models.enums import AdminRole
    
    db = SessionLocal()
    try:
        user = db.query(Admin).filter(Admin.email == settings.FIRST_SUPERUSER).first()
        if not user:
            super_admin = Admin(
                email=settings.FIRST_SUPERUSER,
                hashed_password=security.get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
                full_name="Super Admin",
                role=AdminRole.SENIOR,
                is_active=True
            )
            db.add(super_admin)
            db.commit()
            print(f"Super Admin created: {settings.FIRST_SUPERUSER}")
        else:
            # Ensure it's active for demo purposes
            if not user.is_active:
                user.is_active = True
                db.commit()
                print(f"Super Admin activated: {settings.FIRST_SUPERUSER}")

        # Create Default Regular User
        default_user_email = "user@example.com"
        default_user_password = "user123"
        regular_user = db.query(User).filter(User.email == default_user_email).first()
        if not regular_user:
            new_user = User(
                email=default_user_email,
                hashed_password=security.get_password_hash(default_user_password),
                full_name="Default User",
                is_active=True
            )
            db.add(new_user)
            db.commit()
            print(f"Default User created: {default_user_email}")
        else:
             if not regular_user.is_active:
                regular_user.is_active = True
                db.commit()
                print(f"Default User activated: {default_user_email}")


    except Exception as e:
        print(f"Error initializing database (Tables might not exist yet): {e}")
    finally:
        db.close()

# Trigger reload to run startup event and create super admin
@app.get("/")
def root():
    return {"message": "Welcome to the Ticket Raising Platform API"}
