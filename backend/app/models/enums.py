import enum  # Python ka built-in enum module import kar rahe hain. Ye fixed choices define karne ke liye use hota hai.

class UserRole(str, enum.Enum):  # User role ke liye enum class. `str` inherit kiya taaki direct string comparison ya serialization (JSON) easy ho.
    USER = "user"  # Abhi ke liye sirf ek normal 'user' role hai. Future mein 'pro_user' etc. add kar sakte hain.

class AdminRole(str, enum.Enum):  # Admin ke alag-alag levels ke liye enum. `str` mixin use kiya taaki DB mein string ki tarah save ho.
    SENIOR = "senior_admin"  # Sabse high privilege wala admin (Super Admin).
    SUB = "sub_admin"  # Mid-level admin.
    JUNIOR = "junior_admin"  # Low-level admin jiske paas limited rights honge.

class TicketCategory(str, enum.Enum):
    BILLING = "billing"
    TECHNICAL = "technical"
    ACCOUNT = "account"
    GENERAL = "general"

class TicketPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class TicketStatus(str, enum.Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"
