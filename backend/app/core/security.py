from datetime import datetime, timedelta  # Time manipulation ke liye import. Token expiration set karne ke liye zaroori hai.
from typing import Optional, Union, Any  # Type hints import kar rahe hain code clarity aur static analysis ke liye.
from jose import jwt  # JWT creation aur validation library. JSON Web Tokens standard authentication mechanism ho gaya hai APIs ke liye.
import bcrypt  # Password hashing library. Raw string matching safe nahi hota, bcrypt slow hashing use karta hai brute force se bachne ke liye.
from app.core.config import settings  # Config settings import kar rahe hain (SECRET_KEY, ALGORITHM etc.).

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Check if the password matches the hash."""
    # bcrypt.checkpw requires bytes
    # Input plain password ko hash ke saath compare kar rahe hain. Plain password DB mein store nahi hota kabhi.
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password: str) -> str:
    """Generate a bcrypt hash for the password."""
    # bcrypt.hashpw requires bytes and returns bytes
    pwd_bytes = password.encode('utf-8')  # String ko bytes mein convert kiya kyunki bcrypt bytes expect karta hai.
    salt = bcrypt.gensalt()  # Random salt generate kiya. Har password ka unique salt hota hai taaki rainbow table attacks fail ho jayein.
    hashed = bcrypt.hashpw(pwd_bytes, salt)  # Actual hashing process. Ye CPU intensive operation hai deliberately.
    return hashed.decode('utf-8')  # Result ko wapas string mein convert kiya DB mein store karne ke liye.

def create_access_token(subject: Union[str, Any], user_type: str, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT token.
    subject: unique identifier (email or id)
    user_type: "user" or "admin" to distinguish in 'sub' or logic
    """
    if expires_delta:  # Agar expiration time explicitly pass kiya gaya hai (e.g. "Remember Me" feature).
        expire = datetime.utcnow() + expires_delta
    else:  # Default expiration time settings se le rahe hain (e.g. 30 mins) security ke liye.
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # We will store type in the payload to easily distinguish
    # Token payload create kar rahe hain. 'sub' standard claim hai identity ke liye. 'type' humne add kiya user role differentiate karne ke liye.
    to_encode = {"sub": str(subject), "exp": expire, "type": user_type}
    # Token encode (compress aur sign) kar rahe hain SECRET_KEY use karke. Bina secret key ke koi ise tamper nahi kar sakta.
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt  # Final JWT string return kar rahe hain jo client ko bheja jayega.
