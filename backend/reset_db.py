from app.db.session import engine, Base
from app.models.user import User, Admin
from app.models.ticket import Ticket, Attachment, TicketStatusLog
from app.models.enums import TicketStatus

print("Dropping all tables...")
Base.metadata.drop_all(bind=engine)
print("Creating all tables...")
Base.metadata.create_all(bind=engine)
print("Database reset complete.")
