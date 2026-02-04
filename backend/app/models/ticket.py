from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey, Text  # Types import kar rahe hain. `Text` use kiya description ke liye kyunki length unpredictable hai.
from sqlalchemy.orm import relationship  # Models ke beech interactions define karne ke liye.
from sqlalchemy.sql import func  # Database side methods jaise `now()` ke liye.
from app.db.session import Base  # Abstract base class.
from app.models.enums import TicketStatus  # Ticket statuses consistency ke liye enum use kar rahe hain.

class Ticket(Base):  # Ticket model. Ye humare system ka core data structure hai.
    __tablename__ = "tickets"  # Table naam.

    id = Column(Integer, primary_key=True, index=True)  # Unique ID ticket ke liye.
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # User ID foreign key hai. Ticket hamesha kisi user se linked hona chahiye.
    description = Column(Text, nullable=False)  # Issue details. Text type use kiya taaki lambi description store kar sakein.
    status = Column(Enum(TicketStatus), default=TicketStatus.PENDING, index=True)  # Status track karne ke liye. Default 'Pending'. Indexing fast filtering ke liye.
    created_at = Column(DateTime(timezone=True), server_default=func.now())  # Ticket kab create hua.
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())  # Last update time. `onupdate` automatically handle karega jab bhi record change ho.
    
    # Assignment
    assigned_admin_id = Column(Integer, ForeignKey("admins.id"), nullable=True)  # Kaunsa admin is ticket pe kaam kar raha hai. Nullable hai kyunki shuru mein unassigned hota hai.
    
    # Hold Reason
    hold_reason = Column(Text, nullable=True)  # Agar ticket hold pe hai toh kyun? Ye reason store karne ke liye field hai.
    
    # Relationships
    owner = relationship("app.models.user.User", back_populates="tickets")  # User object access karne ke liye. 'app.models.user.User' string path use kiya circular import avoid karne ke liye.
    assigned_admin = relationship("app.models.user.Admin", back_populates="assigned_tickets")  # Admin object access karne ke liye.
    attachments = relationship("Attachment", back_populates="ticket", cascade="all, delete-orphan")  # Associated files. 'cascade' use kiya taaki ticket delete hone pe attachments bhi delete ho jayein.
    status_logs = relationship("TicketStatusLog", back_populates="ticket", cascade="all, delete-orphan")  # History logs access karne ke liye.

class Attachment(Base):  # Files store karne ke liye separate table. Taaki ek ticket pe multiple files ho sakein (One-To-Many).
    __tablename__ = "attachments"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("tickets.id"), nullable=False)  # Parent ticket ka reference.
    filename = Column(String, nullable=False)  # User ka original file name.
    file_path = Column(String, nullable=False) # Path on filesystem
    # File kahan store hui hai uska path. DB mein content blob nahi rakhte best practice ke hisaab se.
    file_type = Column(String, nullable=True)  # MIME type (e.g., image/png) taaki frontend sahi se display kare.
    created_at = Column(DateTime(timezone=True), server_default=func.now())  # Upload time.

    ticket = relationship("Ticket", back_populates="attachments")  # Parent ticket object access.

class TicketStatusLog(Base):  # Audit trail maintain karne ke liye. Jab bhi status change ho, log entry banti hai.
    __tablename__ = "ticket_status_logs"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("tickets.id"), nullable=False)  # Kis ticket ka log hai.
    old_status = Column(Enum(TicketStatus), nullable=True)  # Purana status kya tha. (New ticket ke liye null ho sakta hai).
    new_status = Column(Enum(TicketStatus), nullable=False)  # Naya status kya bana.
    
    # Who changed it via Admin ID
    changed_by_admin_id = Column(Integer, ForeignKey("admins.id"), nullable=True)  # Kisne status change kiya.
    
    timestamp = Column(DateTime(timezone=True), server_default=func.now())  # Kab change hua.

    ticket = relationship("Ticket", back_populates="status_logs")  # Ticket object.
    changed_by = relationship("app.models.user.Admin")  # Admin details jisne change kiya.
