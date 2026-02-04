from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, ForeignKey  # SQLAlchemy ke column types import kar rahe hain table structure define karne ke liye.
from sqlalchemy.orm import relationship  # Relationship build karne ke liye use hota hai (One-To-Many, Many-To-One).
from sqlalchemy.sql import func  # SQL functions jaise `now()` import karne ke liye.
from app.db.session import Base  # Base class import kiya, jisse saare models inherit karenge.
from app.models.enums import AdminRole  # AdminRole enum import kiya column type define karne ke liye.

class User(Base):  # User table model define kar rahe hain.
    __tablename__ = "users"  # Database mein table ka naam 'users' hoga.

    id = Column(Integer, primary_key=True, index=True)  # Primary key define kiya. Index True rakha taaki search fast ho.
    email = Column(String, unique=True, index=True, nullable=False)  # Email unique hona chahiye aur khali nahi ho sakta. Indexing fast lookup ke liye (login ke waqt).
    hashed_password = Column(String, nullable=False)  # Password hash store hoga. Plain text allowed nahi hai.
    full_name = Column(String, nullable=True)  # Full name optional rakha hai.
    is_active = Column(Boolean, default=True)  # User active hai ya banned, ye flag batayega. Default active.
    created_at = Column(DateTime(timezone=True), server_default=func.now())  # Record creation time automatically DB server se lega.

    # Relationship to tickets
    # User aur Tickets ke beech relationship establish kar rahe hain. 'back_populates' ensure karta hai ki Ticket model mein bhi 'owner' field accessible ho.
    tickets = relationship("Ticket", back_populates="owner")


class Admin(Base):  # Admin table model. User table se alag rakha hai better separation aur security ke liye.
    __tablename__ = "admins"  # Table naam 'admins'.

    id = Column(Integer, primary_key=True, index=True)  # Unique ID for admin.
    email = Column(String, unique=True, index=True, nullable=False)  # Admin email unique hona zaroori hai.
    hashed_password = Column(String, nullable=False)  # Secure hashed password.
    full_name = Column(String, nullable=True)  # Admin ka naam.
    role = Column(Enum(AdminRole), nullable=False)  # Admin ka role (Senior, Sub, Junior) store karne ke liye Enum use kiya. Integrity ensure karega.
    is_active = Column(Boolean, default=True) # Approved or not
    # Admin active hai ya deactivate kiya gaya hai, ye flag control karega.
    created_at = Column(DateTime(timezone=True), server_default=func.now())  # Kab bana tha ye admin.

    # Relationships can be added here if admins "own" things, or for assignments
    # Admin ko assign kiye gaye tickets ka relationship.
    assigned_tickets = relationship("Ticket", back_populates="assigned_admin")
    
    # Audit logs relationship (Admins perform actions)
    # actions = relationship("AuditLog", back_populates="admin")
    # Future use ke liye placeholder: Admin ke actions log karne ke liye relationship.
