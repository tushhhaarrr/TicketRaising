from fastapi import APIRouter, Depends, HTTPException  # FastAPI routing tools.
from sqlalchemy.orm import Session  # DB connectivity.
from typing import List  # Type hints.

from app.db.session import get_db  # dependency.
from app.models.user import User, Admin  # ORM models.
from app.schemas.user import UserCreate, UserResponse  # Pydantic Schemas.
from app.core import security  # Password hashing.
from app.routers.deps import get_current_admin  # Dependency to ensure only admins create users.

# Import admin deps if we want only admins to view all users, but listing is in admins.py
# Users module mein generally self-registration bhi hoti hai, par current requirement mein 'Only Admins create users' aisa lag raha hai code dekhkar.

router = APIRouter()  # Router initialization.

@router.post("/", response_model=UserResponse)  # POST endpoint user create karne ke liye.
def create_user(
    user_in: UserCreate,  # Body se data lega UserCreate schema ke hisaab se.
    db: Session = Depends(get_db),  # Database session.
    current_admin: Admin = Depends(get_current_admin)  # Authorization check: Sirf Admin hi call kar sakta hai.
):
    """
    Create a new user. Only Admins can invoke this.
    User account is active by default as it is created by Admin.
    """
    # Check kar rahe hain ki email pehle se registered toh nahi.
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:  # Check duplicate.
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    
    # User object create kar rahe hain.
    user_obj = User(
        email=user_in.email,  # Email assign.
        hashed_password=security.get_password_hash(user_in.password),  # Password hash kar rahe hain security ke liye.
        full_name=user_in.full_name,  # Full name.
        is_active=True  # Direct active kar rahe hain kyunki admin bana raha hai (trusted source).
    )
    db.add(user_obj)  # Session mein add kiya.
    db.commit()  # DB mein save kiya.
    db.refresh(user_obj)  # Object refresh kiya taaki ID populate ho jaye query ke baad.
    return user_obj  # Created user return kar rahe hain response mein.
