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

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Unified login for both Users and Admins.
    Logic:
    1. Try to find user in User table.
    2. If found, verify password.
    3. If not found in User table, try to find in Admin table.
    4. If found in Admin, verify password.
    5. If neither, raise 400.
    """
    # 1. Check User table
    user = db.query(User).filter(User.email == form_data.username).first()
    if user and security.verify_password(form_data.password, user.hashed_password):
        if not user.is_active:
            raise HTTPException(status_code=400, detail="User account is not active")
        
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = security.create_access_token(
            subject=user.email, user_type="user", expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}

    # 2. Check Admin table (Logic falls through here if User not found OR password wrong)
    # Note: Technically if User found but password wrong, we shouldn't check Admin, 
    # but for simplicity/unified creds (email could be same?), we can check both.
    # However, usually email is unique across system.
    # If user object existed but password failed, we might stop there.
    # But let's assume separate pools.
    
    admin = db.query(Admin).filter(Admin.email == form_data.username).first()
    if admin and security.verify_password(form_data.password, admin.hashed_password):
        if not admin.is_active:
             raise HTTPException(status_code=400, detail="Admin account pending approval")
             
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = security.create_access_token(
            subject=admin.email, user_type="admin", expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}

    # 3. Failed both
    raise HTTPException(
        status_code=400,
        detail="Incorrect email or password",
        headers={"WWW-Authenticate": "Bearer"},
    )
