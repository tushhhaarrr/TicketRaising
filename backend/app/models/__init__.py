from app.models.user import User, Admin  # User aur Admin models expose kar rahe hain taaki `app.models` se direct import kar sakein.
from app.models.ticket import Ticket, Attachment, TicketStatusLog  # Ticket se related models expose kar rahe hain.
from app.models.enums import UserRole, AdminRole, TicketStatus  # Enums bhi yahan se accessible bana rahe hain. Ye 'Facade Pattern' jaisa hai models package ke liye.
