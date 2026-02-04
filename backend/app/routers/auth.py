from fastapi import APIRouter, Depends, HTTPException, status  # APIRouter routes group karne ke liye.
from fastapi.security import OAuth2PasswordRequestForm  # Form data handle karne ke liye (username/password) standard OAuth2 format mein.
from sqlalchemy.orm import Session  # DB session dependency ke liye.
from datetime import timedelta  # Expiration calculation ke liye.

from app.core import security  # Password hashing/verification logic.
from app.core.config import settings  # JWT expiration settings.
from app.db.session import get_db  # DB connection dependency.
from app.models.user import User, Admin  # User aur Admin models login check ke liye.
from app.schemas.user import UserCreate, UserResponse, AdminCreate, AdminResponse  # (Unused but imported) Schemas.
from app.schemas.token import Token  # Response schema token ke liye.
from app.models.enums import AdminRole  # (Unused here but good for context)

router = APIRouter()  # Router instance.

# --- User Auth ---

@router.post("/login/user", response_model=Token)  # User login endpoint. Token return karega validation ke baad.
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    User login.
    If credentials are valid but user doesn't exist or password wrong, return specific error.
    """
    # Database mein user ko email se dhund rahe hain. OAuth2 spec 'username' field use karta hai, jo humare liye email hai.
    user = db.query(User).filter(User.email == form_data.username).first()
    # If user doesn't exist OR password doesn't match
    # Check kar rahe hain ki user mila ya nahi, aur password verify kar rahe hain hash compare karke.
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=400, 
            detail="You're not our Employee" # Custom error message as requested
            # Security precaution: Generic "Invalid credentials" dena better hota hai username enumeraton rokne ke liye, par client requirement specific thi.
        )
    
    if not user.is_active:  # Agar user banned hai toh login block kar rahe hain.
        raise HTTPException(status_code=400, detail="User account is not active")

    # Expiry time calculate kar rahe hain settings se.
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    # JWT token generate kar rahe hain user identity ke saath. 'type="user"' claim add kiya role separation ke liye.
    access_token = security.create_access_token(
        subject=user.email, user_type="user", expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}  # Token response return kar rahe hain JSON format mein.

@router.post("/login/admin", response_model=Token)  # Admin specific login route.
def login_admin(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Admin login."""
    # Admin table check kar rahe hain instead of User table.
    admin = db.query(Admin).filter(Admin.email == form_data.username).first()
    # Authentication check.
    if not admin or not security.verify_password(form_data.password, admin.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    # Check agar admin active hai (approved by senior admin).
    if not admin.is_active:
        raise HTTPException(status_code=400, detail="Admin account pending approval")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    # Admin ke liye token generate kar rahe hain 'type="admin"' ke saath.
    access_token = security.create_access_token(
        subject=admin.email, user_type="admin", expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
