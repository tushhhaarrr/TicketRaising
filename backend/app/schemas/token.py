from pydantic import BaseModel  # Pydantic import kar rahe data validation ke liye.
from typing import Optional  # Optional fields define karne ke liye.

class Token(BaseModel):  # Token response format. Jab user/admin login karega toh ye milega.
    access_token: str  # Actual JWT token string.
    token_type: str  # Token type, usually "bearer". Standard OAuth2 format hai ye.

class TokenPayload(BaseModel):  # Token decode karne ke baad jo content milega uska schema.
    sub: Optional[str] = None  # Subject (User ID/Email). Optional isliye kyunki parsing fail bhi ho sakti hai.
    type: Optional[str] = None # "user" or "admin"
    # Humne custom field 'type' add kiya hai taaki token dekhkar hi pata chale ki ye Admin hai ya User.
