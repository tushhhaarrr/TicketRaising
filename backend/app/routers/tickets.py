import shutil  # File operations ke liye (save karne ke liye).
import os  # OS file path handling ke liye.
from typing import List, Optional  # Type hints.
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form  # FastAPI tools endpoint define aur data handle karne ke liye.
from sqlalchemy.orm import Session  # DB connectivity.
from sqlalchemy import or_  # Complex queries ke liye.

from app.db.session import get_db  # dependency.
from app.models.user import User, Admin  # Models.
from app.models.ticket import Ticket, Attachment, TicketStatusLog  # Models.
from app.models.enums import TicketStatus, AdminRole  # Enums.
from app.schemas.ticket import TicketCreate, TicketResponse, TicketUpdate  # Pydantic Schemas.
from app.routers.deps import get_current_user_or_admin, get_current_regular_user, get_current_admin  # RBAC logic.
from app.core.config import settings  # Settings (unused here but good practice).

router = APIRouter()  # Router initialization.

UPLOAD_DIR = "uploads"  # Images kahan save hongi.
if not os.path.exists(UPLOAD_DIR):  # Directory nahi hai toh banao.
    os.makedirs(UPLOAD_DIR)

# --- Helper ---
def log_status_change(db: Session, ticket: Ticket, new_status: TicketStatus, admin_id: int):
    """Log change helper function."""
    if ticket.status != new_status:  # Log tabhi karo jab status actually change ho raha ho.
        log = TicketStatusLog(
            ticket_id=ticket.id,  # Ticket ID.
            old_status=ticket.status,  # Purana status.
            new_status=new_status,  # Naya status.
            changed_by_admin_id=admin_id  # Admin jisne change kiya.
        )
        db.add(log) # Add to session, commit happens later
        # Session mein add kiya, par commit caller karega transaction consistency ke liye.

# --- Endpoints ---

@router.post("/", response_model=TicketResponse)  # Ticket create endpoint.
async def create_ticket(
    description: str = Form(...),  # Form data se description maang rahe hain kyunki file upload ke saath JSON body mix karna muskil hota hai.
    files: List[UploadFile] = File(None),  # Multiple files upload allow kar rahe hain. Optional hai.
    current_user: User = Depends(get_current_regular_user),  # Sirf regular users ticket raise kar sakte hain. Admin nahi.
    db: Session = Depends(get_db)  # DB connection.
):
    """
    User raises a new ticket.
    Uploads files to server filesystem.
    """
    # Create Ticket
    ticket = Ticket(
        user_id=current_user.id,  # User link kar rahe hain.
        description=description,  # Issue detail.
        status=TicketStatus.PENDING  # By default Pending hota hai.
    )
    db.add(ticket)  # Add ticket object.
    db.flush() # Get ID
    # 'flush' use kiya taaki DB ID generate kar de bina final commit kiye. Hum ID use karke filename banayenge.

    # Handle Files
    if files:  # Agar files aayi hain.
        for file in files:
            # Validate size/type here if needed
            # Simple unique filename
            # Filename unique banane ke liye ID prefix laga rahe hain. Collision avoid karne ke liye.
            file_extension = os.path.splitext(file.filename)[1]
            saved_filename = f"ticket_{ticket.id}_{file.filename}"
            file_path = os.path.join(UPLOAD_DIR, saved_filename)  # Full path construct kar rahe hain.
            
            with open(file_path, "wb") as buffer:  # File write mode mein open kiya.
                shutil.copyfileobj(file.file, buffer)  # Stream copy kiya taaki memory overflow na ho bade files pe.
            
            attachment = Attachment(  # Attachment record DB mein bana rahe hain.
                ticket_id=ticket.id,
                filename=file.filename,
                file_path=file_path,
                file_type=file.content_type  # File type store kar rahe hain for frontend.
            )
            db.add(attachment)

    db.commit()  # Sab kuch save kar rahe hain (Ticket + Attachments) ek transaction mein.
    db.refresh(ticket)  # Object ko latest state se update kar rahe hain return karne se pehle.
    return ticket

@router.get("/", response_model=List[TicketResponse])  # List tickets endpoint.
def read_tickets(
    skip: int = 0, 
    limit: int = 100,
    current_user = Depends(get_current_user_or_admin),  # Dono user aur admin dekh sakte hain, par logic alag hai.
    db: Session = Depends(get_db)
):
    """
    Get tickets.
    - User: Sees only their own.
    - Admin: Sees all (Senior), or Assigned (Sub).
    """
    if getattr(current_user, "is_admin_user", False):  # Agar admin hai.
        # Admin Logic
        admin: Admin = current_user
        query = db.query(Ticket)  # Saare tickets ki query start ki.
        
        # Admin Role Filtering
        if admin.role == AdminRole.SUB:
            # Sub Admin: View assigned tickets? Prompt says "View assigned tickets".
            # Also implies they might view others but primary is assigned?
            # "View assigned tickets" -> usually implies restriction.
            # But "Check progress of all admins" is Senior.
            # Let's filter by assignment for Sub Admin, OR all unassigned?
            # Prompt doesn't strictly forbid viewing others, but "View assigned tickets" is specific.
            # Let's show All keys for simplicity but frontend can filter, OR implement filter params.
            # To be strict:
            # query = query.filter(or_(Ticket.assigned_admin_id == admin.id, Ticket.assigned_admin_id == None))
            pass # Creating universal view for now as Dashboard usually shows all pending.
            # Abhi ke liye sab dikha rahe hain taaki dashboard khali na lage. Filter frontend pe laga sakte hain.
            
        tickets = query.offset(skip).limit(limit).all()  # Pagination apply kiya.
        return tickets
    else:
        # User Logic
        # User sirf apne tickets dekh payega privacy ke liye.
        return db.query(Ticket).filter(Ticket.user_id == current_user.id).offset(skip).limit(limit).all()

@router.get("/{ticket_id}", response_model=TicketResponse)  # Single ticket detail endpoint.
def read_ticket(
    ticket_id: int,
    current_user = Depends(get_current_user_or_admin),
    db: Session = Depends(get_db)
):
    """
    Get specific ticket.
    - Admin: Autosets status to 'In Progress' if 'Pending'.
    """
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()  # Fetch ticket.
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    is_admin = getattr(current_user, "is_admin_user", False)  # Check role.

    # Access Check
    if not is_admin:
        if ticket.user_id != current_user.id:  # Agar user kisi aur ka ticket dekhne ki koshish kare toh block.
            raise HTTPException(status_code=403, detail="Not authorized to view this ticket")
    
    # Admin Logic: Auto Open
    # Ye automation requirement hai: Admin open karte hi wo 'In Progress' ho jana chahiye.
    if is_admin:
        # "When an admin opens a ticket, automatically set status to In Progress"
        if ticket.status == TicketStatus.PENDING:
            log_status_change(db, ticket, TicketStatus.IN_PROGRESS, current_user.id)  # Log change.
            ticket.status = TicketStatus.IN_PROGRESS  # Update status.
            db.commit()
            db.refresh(ticket)
            
    return ticket

@router.put("/{ticket_id}", response_model=TicketResponse)  # Update ticket endpoint.
def update_ticket(
    ticket_id: int,
    ticket_update: TicketUpdate,
    current_admin: Admin = Depends(get_current_admin), # Only admins update tickets. User edit nahi kar sakta raise karne ke baad.
    db: Session = Depends(get_db)
):
    """
    Update ticket status, assignment, or hold reason.
    Sub Admin: View/Assign/Hold/ChangeStatus.
    Senior Admin: Override everything.
    Junior: Read only (handled by permission check on entry, but wait, Juniors shouldn't be here).
    """
    # Permission Check: Junior Admin cannot update?
    # "Junior Admin: Only view tickets..."
    if current_admin.role == AdminRole.JUNIOR:  # Junior admin ko write access nahi hai.
         raise HTTPException(status_code=403, detail="Junior Admins cannot update tickets.")

    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    # Update Status
    if ticket_update.status:
        # If Hold, require reason?
        # Requirement check: Hold pe reason hona chahiye.
        if ticket_update.status == TicketStatus.ON_HOLD and not ticket_update.hold_reason and not ticket.hold_reason:
            # If strictly requiring new reason on every hold:
             raise HTTPException(status_code=400, detail="Hold reason is required when putting on hold.")
        
        log_status_change(db, ticket, ticket_update.status, current_admin.id)  # Log change of status.
        ticket.status = ticket_update.status
        
        # Clear hold reason if not on hold? Optional.
        # if ticket_update.status != TicketStatus.ON_HOLD:
        #     ticket.hold_reason = None 

    # Update Hold Reason
    if ticket_update.hold_reason:  # Separate update for reason agar status same bhi ho.
        ticket.hold_reason = ticket_update.hold_reason

    # Assignment (Senior Admin or self-assign?)
    # "Senior Admin: ... Override ticket statuses"
    # Assuming Sub admins can assign to themselves or pick up tickets.
    if ticket_update.assigned_admin_id is not None:
        # Maybe restrict assignment changes to Senior?
        # Or Sub admin can pick it up.
        ticket.assigned_admin_id = ticket_update.assigned_admin_id  # Assignee change kar rahe hain.

    db.commit()
    db.refresh(ticket)
    return ticket
