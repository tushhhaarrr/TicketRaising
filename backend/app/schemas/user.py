from pydantic import BaseModel, EmailStr  # Pydantic models use kar rahe hain data validation aur parsing ke liye. `EmailStr` automatically validate karega ki input valid email format hai ya nahi.
from typing import Optional  # `Optional` type import kar rahe hain taaki hum null values allow kar sakein. Ye zaroori hai optional fields ke liye.
from app.models.enums import AdminRole  # `AdminRole` enum import kar rahe hain taaki role validation consistent rahe. String litrals use karne se behtar hai strict type checking.

# --- User Schemas ---
# Schemas data structure define karte hain jo API ke through aayega ya jayega. Ye layer validation aur serialization handle karti hai.

class UserBase(BaseModel):  # Base class bana rahe hain common fields ke liye taaki code repetition (DRY logic) kam ho.
    email: EmailStr  # Email field define kiya `EmailStr` type ke saath. Agar user invalid email bhejega toh Pydantic error throw karega.
    full_name: Optional[str] = None  # Full name optional hai, agar nahi diya toh default None hoga. Mandatory parameters user experience kharab kar sakte hain agar wo zaroori na ho.

class UserCreate(UserBase):  # User creation ke waqt password zaroori hai, isliye base class inherit karke password add kiya.
    password: str  # Password plain text mein aayega input mein. Isse DB mein save karne se pehle hash karna hoga (service layer mein).

class UserResponse(UserBase):  # Response schema define kar rahe hain jo user ko return hoga. Sensitive data (password) yahan include nahi kiya gaya hai safety ke liye.
    id: int  # Database se generated ID return karenge taaki frontend us record ko identify kar sake.
    is_active: bool  # User ka activation status return kar rahe hain.

    class Config:  # Pydantic configuration class.
        from_attributes = True  # ORM objects (SQLAlchemy models) ko direct Pydantic models mein convert karne ki permission deta hai. Pehle isse `orm_mode` kehte the.

# --- Admin Schemas ---
# Admin schemas alag hain kyunki admin ke paas extra fields (jaise role) hote hain. Separation of concern maintain karne ke liye alag classes banayi hain.

class AdminBase(BaseModel):  # Admin ke liye base schema.
    email: EmailStr  # Admin email validation ke liye.
    full_name: Optional[str] = None  # Admin ka naam, optional rakha hai flexibility ke liye.
    role: AdminRole  # Admin role mandatory hai. Enum use karne se ensure hota hai ki sirf valid roles ('JUNIOR', 'SENIOR') hi pass ho.

class AdminCreate(AdminBase):  # Admin create karte waqt password chahiye.
    password: str  # Password input field.

class AdminResponse(AdminBase):  # Admin data return karte waqt use hoga. Password hata diya gaya hai security ke liye.
    id: int  # Unique ID return kar rahe hain.
    is_active: bool  # Status return kar rahe hain.

    class Config:  # Config class ORM support enable karne ke liye.
        from_attributes = True  # SQLAlchemy objects se data read karne ke liye essential hai, kyunki DB objects dicts nahi hote balki class instances hote hain.

class AdminUpdate(BaseModel):  # Update operation ke liye alag schema hai kyunki update mein fields optional ho sakte hain (partial update).
    full_name: Optional[str] = None  # User chahe toh sirf naam update kare.
    # For permission updates
    role: Optional[AdminRole] = None  # Role update karna optional hai. Sirf super admin hi shayad ise change kare.
    is_active: Optional[bool] = None  # Account activate/deactivate karne ke liye. Partial updates (PATCH request) allow karne ke liye sab fields optional hain.
