from fastapi import Depends, HTTPException, status  # FastAPI ke dependency injection helpers aur exceptions import kar rahe hain.
from fastapi.security import OAuth2PasswordBearer  # Security scheme jo token extract karega 'Authorization: Bearer <token>' header se.
from jose import jwt, JWTError  # JWT encode/decode lib.
from sqlalchemy.orm import Session  # DB session type hint.

from app.core import security  # Password/Token logic.
from app.core.config import settings  # Config for secrets/algorithms.
from app.db.session import get_db  # DB session dependency factory.
from app.models.user import User, Admin  # User/Admin models user fetch karne ke liye.
from app.schemas.token import TokenPayload  # Token data validation schema.
from app.models.enums import AdminRole  # Role validation ke liye enum.

# OAuth2 scheme
# Ye object automatically request header se token nikalega. 'tokenUrl' parameter Swagger UI ko batata hai ki login kahan se karna hai.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login/user") 
# Note: tokenUrl is just for Swagger UI hint. We have separate login endpoints.
# The user will likely use /auth/login/user or /auth/login/admin.
# Swagger UI only supports one tokenUrl easily, so we point to user for default.
# Reality mein humare paas multiple login points hain (Admin/User), par Swagger UI limitation ke karan ek hi dikhaya hai.

async def get_current_user_or_admin(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    """
    Common dependency to extract user from token.
    Works for both 'User' and 'Admin'.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,  # 401 error throw karenge agar validation fail hui.
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Token decode kar rahe hain secret key use karke. Agar key mismatch hui toh error aayega.
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        sub: str = payload.get("sub")  # Subject (email) nikal rahe hain.
        user_type: str = payload.get("type")  # Type (user/admin) nikal rahe hain.
        if sub is None or user_type is None:  # Agar payload incomplete hai.
            raise credentials_exception
        token_data = TokenPayload(sub=sub, type=user_type)  # Data validate kar rahe hain.
    except JWTError:  # Agar token expire ho gaya ya signature galat hai.
        raise credentials_exception

    if token_data.type == "admin":
        # Check Admin Table
        # Token type 'admin' hai toh Admin table mein search karenge.
        user = db.query(Admin).filter(Admin.email == token_data.sub).first()
    else:
        # Check User Table
        # Warna User table mein.
        user = db.query(User).filter(User.email == token_data.sub).first()
        
    if user is None:  # Agar DB mein record nahi mila (delete ho gaya ho user).
        raise credentials_exception
    
    # Attach type to user object for easier checking later if needed (python dynamic attribute)
    # Python ki dynamic capabilities ka use karke ek naya attribute 'is_admin_user' chipka rahe hain object pe.
    user.is_admin_user = (token_data.type == "admin")
    return user  # Authenticated user object return kar rahe hain.

async def get_current_active_user(
    current_user = Depends(get_current_user_or_admin),
):
    """
    Wrapper to ensure user is active (not banned).
    """
    if not current_user.is_active:  # Agar user banned/inactive hai toh access deny kar rahe hain.
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# --- Role Dependencies ---
# Class-based dependency injection use kar rahe hain roles check karne ke liye.

class RoleChecker:
    def __init__(self, allowed_roles: list[AdminRole]):
        self.allowed_roles = allowed_roles  # Constructor mein allowed roles le rahe hain.

    def __call__(self, user = Depends(get_current_active_user)):  # Ye instance ko callable banata hai taaki FastAPI `Depends(checker)` kar sake.
        if not getattr(user, "is_admin_user", False):  # Pehle check karo ki wo admin hai bhi ya nahi.
             raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="Not enough permissions: Admins only"
            )
        
        if user.role not in self.allowed_roles:  # Check karo ki admin ka role allowed list mein hai ya nahi.
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail=f"Not enough permissions. Required: {self.allowed_roles}"
            )
        return user  # Sab sahi hai toh user return karo.

# Specific Checkers
# Pre-configured checkers bana rahe hain readability ke liye.
require_senior_admin = RoleChecker([AdminRole.SENIOR])  # Sirf Senior admins.
require_sub_admin = RoleChecker([AdminRole.SENIOR, AdminRole.SUB]) # Senior usually implies Sub permissions too. Hierarchy maintain kar rahe hain.
require_junior_admin = RoleChecker([AdminRole.SENIOR, AdminRole.SUB, AdminRole.JUNIOR])  # Koi bhi admin level.

# Helper for just ensuring it's ANY admin
def get_current_admin(user = Depends(get_current_active_user)):
    if not getattr(user, "is_admin_user", False):
        raise HTTPException(status_code=403, detail="Admins only")
    return user

# Helper for User only
def get_current_regular_user(user = Depends(get_current_active_user)):
    # Admin regular user routes use na kar sake, uske logic ke liye.
    if getattr(user, "is_admin_user", False):
         raise HTTPException(status_code=403, detail="Regular users only")
    return user
