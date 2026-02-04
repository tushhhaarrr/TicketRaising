from fastapi import APIRouter, Depends, HTTPException, status  # FastAPI core modules.
from sqlalchemy.orm import Session  # DB connectivity.
from sqlalchemy import func  # Aggregation functions (count, etc.).
from typing import List  # Type hints.

from app.db.session import get_db  # dependency.
from app.models.user import User, Admin  # Models.
from app.models.ticket import Ticket  # Ticket model stats ke liye.
from app.models.enums import TicketStatus, AdminRole  # Enums stats filtering ke liye.
from app.schemas.user import UserResponse, AdminResponse, AdminUpdate, AdminCreate  # Schemas.
from app.routers.deps import get_current_admin, require_senior_admin  # RBAC dependencies.
from app.core import security  # Password hashing.

router = APIRouter()  # Router init.

# --- Dashboard ---

@router.get("/dashboard/stats")  # Dashboard metrics endpoint.
def get_dashboard_stats(
    current_admin: Admin = Depends(get_current_admin),  # Koi bhi admin dekh sakta hai stats.
    db: Session = Depends(get_db)
):
    """
    Get generic dashboard stats.
    """
    total_tickets = db.query(Ticket).count()  # Total tickets count.
    pending_tickets = db.query(Ticket).filter(Ticket.status == TicketStatus.PENDING).count()  # Pending tickets count.
    on_hold_tickets = db.query(Ticket).filter(Ticket.status == TicketStatus.ON_HOLD).count()  # Oold tickets count.
    resolved_tickets = db.query(Ticket).filter(Ticket.status == TicketStatus.RESOLVED).count()  # Resolved tickets count.
    
    # Per Admin Workload
    # Group by assigned_admin_id
    # Ye complex SQL query hai jo har admin ke paas kitne tickets hain count karti hai.
    workload = db.query(Ticket.assigned_admin_id, func.count(Ticket.id)).group_by(Ticket.assigned_admin_id).all()
    
    return {  # JSON summary return kar rahe hain frontend charts ke liye.
        "total": total_tickets,
        "pending": pending_tickets,
        "on_hold": on_hold_tickets,
        "resolved": resolved_tickets,
        "workload": [{"admin_id": w[0], "count": w[1]} for w in workload]  # List comprehension data format karne ke liye.
    }

# --- User Management ---

@router.get("/users", response_model=List[UserResponse])  # Saare users list karne ke liye.
def list_users(
    skip: int = 0, limit: int = 100,  # Pagination params default 0 aur 100.
    current_admin: Admin = Depends(get_current_admin),  # Only admins allowed.
    db: Session = Depends(get_db)
):
    """List all users."""
    users = db.query(User).offset(skip).limit(limit).all()  # Paginated query.
    return users  # List of UserResponse objects.

@router.put("/users/{user_id}/approve")  # User activity toggle karne ke liye.
def approve_user(
    user_id: int,  # URL path param.
    approve: bool,  # Query param (true/false).
    current_admin: Admin = Depends(require_senior_admin), # Only Senior approves? "Audit logs so Senior Admin can monitor sub-admin activity"
    # User panel: "Approve specific users to access the platform" -> Admin Panel Feature
    # Senior Admin restriction lagaya hai critical action ke liye.
    db: Session = Depends(get_db)
):
    """Approve or block a user."""
    user = db.query(User).filter(User.id == user_id).first()  # User fetching.
    if not user:
        raise HTTPException(status_code=404, detail="User not found")  # 404 agar galat ID di.
    
    user.is_active = approve  # Status update.
    db.commit()  # Save changes.
    return {"message": f"User {'approved' if approve else 'blocked'}"}  # Success message.

# --- Admin Management (Senior Only) ---

@router.post("/", response_model=AdminResponse)  # Naya admin create karne ke liye.
def create_admin(
    admin_in: AdminCreate, 
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(require_senior_admin)  # Sirf super admin hi naye admins bana sakta hai.
):
    """Create a new admin. Only Senior Admins can do this."""
    admin = db.query(Admin).filter(Admin.email == admin_in.email).first()  # Duplicate check.
    if admin:
        raise HTTPException(
            status_code=400,
            detail="The admin with this email already exists.",
        )
    
    admin_obj = Admin(
        email=admin_in.email,
        hashed_password=security.get_password_hash(admin_in.password),
        full_name=admin_in.full_name,
        role=admin_in.role,
        is_active=True # Auto-active for testing
    )
    db.add(admin_obj)
    db.commit()
    db.refresh(admin_obj)
    return admin_obj

@router.get("/", response_model=List[AdminResponse])  # List all admins.
def list_admins(
    current_admin: Admin = Depends(get_current_admin), # All admins can see peers?
    # Han, peer admins ko dekhna useful hota hai coordination ke liye.
    db: Session = Depends(get_db)
):
    return db.query(Admin).all()  # Saare admins return.

@router.put("/{admin_id}/approve")  # Admin approval workflow.
def approve_admin(
    admin_id: int,
    approve: bool,
    current_admin: Admin = Depends(require_senior_admin),  # Sirf senior admin approve kar sakta hai sub-admins ko.
    db: Session = Depends(get_db)
):
    """Approve new admin accounts."""
    admin = db.query(Admin).filter(Admin.id == admin_id).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    
    admin.is_active = approve  # Activate/Deactivate.
    db.commit()
    return {"message": f"Admin {'approved' if approve else 'rejected'}"}
