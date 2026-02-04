from pydantic import BaseModel  # Pydantic base model import kar rahe validation ke liye.
from typing import Optional, List  # Type hints import. List use hoga multiple attachments dikhane ke liye.
from datetime import datetime  # Date time handling ke liye.
from app.models.enums import TicketStatus  # Enum import validation ke liye taaki status valid hi ho.

# --- Attachment Schemas ---
# File attachment data ko standardize karne ke liye schema.
class AttachmentResponse(BaseModel):  # File details return karne ke liye schema.
    id: int  # Unique ID.
    filename: str  # Original file name.
    file_type: Optional[str]  # MIME type option hai.
    created_at: datetime  # Kab upload hui.

    class Config:  # Pydantic config.
        from_attributes = True  # ORM objects se convert karne ke liye zaroori hai.

# --- Ticket Schemas ---
class TicketBase(BaseModel):  # Common fields ke liye base class.
    description: str  # Description mandatory hai.

class TicketCreate(TicketBase):  # Ticket create karte time use hoga.
    pass
    # Files are handled separately in endpoint signature if using UploadFile
    # Khali hai kyunki filhal sirf description chahiye. Files alag multi-part form data se aayengi.

class TicketUpdate(BaseModel):  # Ticket update karne ke liye schema. Saare fields optional hain.
    # For admins to update status/hold reason
    status: Optional[TicketStatus] = None  # Status change karne ke liye.
    hold_reason: Optional[str] = None  # Agar status hold hai toh reason.
    # For assigning (Senior Admin)
    assigned_admin_id: Optional[int] = None  # Ticket re-assign karne ke liye.

class TicketResponse(TicketBase):  # Ticket details return karne ke liye schema.
    id: int  # Ticket ID.
    user_id: int  # User jisne banaya.
    status: TicketStatus  # Current status.
    created_at: datetime  # Creation timestamp.
    hold_reason: Optional[str]  # Hold reason agar hai toh.
    assigned_admin_id: Optional[int]  # Assigned admin ID.
    
    attachments: List[AttachmentResponse] = []  # Nested object list attachments ke liye. Ye powerful feature hai Pydantic ka.

    class Config:
        from_attributes = True  # ORM serialization enable.

class TicketStatusLogResponse(BaseModel):  # Logs dikhane ke liye schema.
    id: int
    old_status: Optional[TicketStatus]  # Purana status.
    new_status: TicketStatus  # Naya status.
    timestamp: datetime  # Kab change hua.
    changed_by_admin_id: Optional[int]  # Kis admin ne change kiya.

    class Config:
        from_attributes = True  # ORM serialization enable.
