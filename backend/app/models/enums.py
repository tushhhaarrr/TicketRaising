import enum  # Python ka built-in enum module import kar rahe hain. Ye fixed choices define karne ke liye use hota hai.

class UserRole(str, enum.Enum):  # User role ke liye enum class. `str` inherit kiya taaki direct string comparison ya serialization (JSON) easy ho.
    USER = "user"  # Abhi ke liye sirf ek normal 'user' role hai. Future mein 'pro_user' etc. add kar sakte hain.

class AdminRole(str, enum.Enum):  # Admin ke alag-alag levels ke liye enum. `str` mixin use kiya taaki DB mein string ki tarah save ho.
    SENIOR = "senior_admin"  # Sabse high privilege wala admin (Super Admin).
    SUB = "sub_admin"  # Mid-level admin.
    JUNIOR = "junior_admin"  # Low-level admin jiske paas limited rights honge.

class TicketStatus(str, enum.Enum):  # Ticket ke lifecycle stages define karne ke liye enum.
    PENDING = "Pending"  # Jab ticket naya create hota hai aur kisi ne pick nahi kiya.
    IN_PROGRESS = "In Progress"  # Jab admin iss par kaam karna shuru kar deta hai.
    ON_HOLD = "On Hold"  # Agar ticket temporary pause kiya gaya hai (e.g. user response ka wait).
    RESOLVED = "Resolved"  # Jab issue fix ho gaya aur ticket close karne ke liye ready hai.
