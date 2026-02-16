
from typing import List, Optional, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query, Body
from sqlalchemy.orm import Session
from sqlalchemy import func, or_, cast, Date
from pydantic import BaseModel

from app.db.session import get_db
from app.models.user import User
from app.models.ticket import Ticket
from app.models.enums import TicketStatus, TicketCategory, TicketPriority
from app.schemas.ticket import TicketCreate, TicketResponse, TicketUpdate
from app.services.llm_service import classify_ticket_description

# We can keep existing deps if they work, or simplify for this assignment
# The assignment implies we have users.
# "The user can then review and override..."
# "User... pre-filled by the LLM"
from app.routers.deps import get_current_regular_user, get_current_user_or_admin

router = APIRouter()

class ClassifyRequest(BaseModel):
    description: str

@router.post("/classify/")
async def classify_ticket(request: ClassifyRequest):
    """
    Classify a ticket description using LLM.
    """
    return await classify_ticket_description(request.description)

@router.post("/", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
def create_ticket(
    ticket_in: TicketCreate,
    db: Session = Depends(get_db),
    # Only regular users create tickets to respect FK constraints on user_id
    current_user: User = Depends(get_current_regular_user) 
):
    """
    Create a new ticket.
    """
    ticket = Ticket(
        title=ticket_in.title,
        description=ticket_in.description,
        category=ticket_in.category,
        priority=ticket_in.priority,
        status=TicketStatus.OPEN,
        user_id=current_user.id
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket

@router.get("/", response_model=List[TicketResponse])
def read_tickets(
    category: Optional[TicketCategory] = None,
    priority: Optional[TicketPriority] = None,
    status: Optional[TicketStatus] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    # Allow admins to view too
    current_user = Depends(get_current_user_or_admin)
):
    """
    List all tickets, newest first.
    Supports filtering by category, priority, status.
    Supports search by title + description.
    """
    query = db.query(Ticket)

    if category:
        query = query.filter(Ticket.category == category)
    if priority:
        query = query.filter(Ticket.priority == priority)
    if status:
        query = query.filter(Ticket.status == status)
    
    if search:
        search_filter = or_(
            Ticket.title.ilike(f"%{search}%"),
            Ticket.description.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)

    # Newest first
    query = query.order_by(Ticket.created_at.desc())

    return query.offset(skip).limit(limit).all()

@router.patch("/{ticket_id}/", response_model=TicketResponse) # Slash optional
def update_ticket(
    ticket_id: int,
    ticket_update: TicketUpdate,
    db: Session = Depends(get_db),
    # Allow admins or users to update
    current_user = Depends(get_current_user_or_admin) 
):
    """
    Update a ticket (status, category, priority).
    """
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    # Update fields if provided
    if ticket_update.status:
        ticket.status = ticket_update.status
    if ticket_update.category: # Added these to TicketUpdate schema? need to check
        ticket.category = ticket_update.category
    if ticket_update.priority: # Added these to TicketUpdate schema? need to check
        ticket.priority = ticket_update.priority

    # Also allow updating title/desc/hold_reason if in schema, but prompt specifically mentions:
    # "Update a ticket (e.g. change status, override category/priority)"
    
    # We might need to update TicketUpdate schema to include category/priority if not there.
    # Re-checking Schema... 
    
    db.commit()
    db.refresh(ticket)
    return ticket

@router.get("/stats/")
def read_ticket_stats(db: Session = Depends(get_db)):
    """
    Return aggregated statistics.
    Calculated in Python to avoid SQL Enum grouping issues.
    """
    tickets = db.query(Ticket).all()
    
    total_tickets = len(tickets)
    
    # Open tickets
    open_tickets = sum(1 for t in tickets if t.status == TicketStatus.OPEN)
    
    # Priority Breakdown
    priority_breakdown = {}
    for t in tickets:
        # Handle Enum or string
        p_val = t.priority.value if hasattr(t.priority, 'value') else t.priority
        priority_breakdown[p_val] = priority_breakdown.get(p_val, 0) + 1

    # Category Breakdown
    category_breakdown = {}
    for t in tickets:
        # Handle Enum or string
        c_val = t.category.value if hasattr(t.category, 'value') else t.category
        category_breakdown[c_val] = category_breakdown.get(c_val, 0) + 1

    # Avg Calculation (Simplified)
    avg_tickets = 0.0
    if total_tickets > 0:
        # Calculate distinct days
        try:
            dates = {t.created_at.date() for t in tickets if t.created_at}
            num_days = len(dates)
            avg_tickets = total_tickets / num_days if num_days > 0 else total_tickets
        except Exception as e:
            print(f"Date Calc Error: {e}")
            avg_tickets = 0.0

    return {
        "total_tickets": total_tickets,
        "open_tickets": open_tickets,
        "avg_tickets_per_day": round(float(avg_tickets), 1),
        "priority_breakdown": priority_breakdown,
        "category_breakdown": category_breakdown
    }
