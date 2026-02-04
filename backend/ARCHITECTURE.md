# Ticket Raising Platform Architecture

## Overview
This platform is a backend-focused application using FastAPI and PostgreSQL. It manages ticket raising, tracking, and resolution with a multi-level admin system.

## Technology Stack
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Migrations**: Alembic
- **Authentication**: JWT (JSON Web Tokens) + OAuth2 Password Bearer
- **Hashing**: Bcrypt (Passlib)
- **File Handling**: Local filesystem (managed via API)

## Project Structure

```
TicketRaising/
├── app/
│   ├── __init__.py
│   ├── main.py                 # Entry point of the application
│   ├── core/                   # Core configuration and security
│   │   ├── __init__.py
│   │   ├── config.py           # Environment variables and settings
│   │   ├── security.py         # JWT and password hashing utilities
│   │   └── exceptions.py       # Custom exception handlers
│   ├── db/                     # Database connection and session
│   │   ├── __init__.py
│   │   ├── session.py          # SQLAlchemy engine and session local
│   │   └── base.py             # Import all models here for Alembic
│   ├── models/                 # SQLAlchemy Database Models
│   │   ├── __init__.py
│   │   ├── user.py             # User and Admin models
│   │   ├── ticket.py           # Ticket, Attachment, TicketStatusLog models
│   ├── schemas/                # Pydantic Schemas (Request/Response)
│   │   ├── __init__.py
│   │   ├── user.py             # User/Admin schemas
│   │   ├── ticket.py           # Ticket schemas
│   │   └── token.py            # Auth token schemas
│   ├── routers/                # API Endpoints
│   │   ├── __init__.py
│   │   ├── auth.py             # Login/Signup endpoints
│   │   ├── users.py            # User specific operations
│   │   ├── admins.py           # Admin management and dashboard
│   │   └── tickets.py          # Ticket CRUD and workflow
│   ├── services/               # Business Logic (Optional, can be in routers for simplicity)
│   │   ├── __init__.py
│   │   └── file_service.py     # Handling file uploads
│   └── utils/                  # Utility functions
│       ├── __init__.py
│       └── common.py
├── uploads/                    # Directory for storing uploaded files
├── alembic/                    # Database migrations
├── alembic.ini                 # Alembic configuration
├── requirements.txt            # Python dependencies
└── .env                        # Environment variables (DB URL, Secret Key)
```

## Data Flow

1.  **Request Handling**:
    *   User/Admin sends a request to an endpoint (e.g., `POST /tickets`).
    *   **Middleware/Dependency**: `get_current_user` verifies the JWT token.
    *   **Role Check**: Based on the endpoint, `RoleChecker` ensures the user has the correct role (User, Junior Admin, Sub Admin, Senior Admin).

2.  **Controller (Router)**:
    *   Receives the validated data (Pydantic Schema).
    *   Calls the appropriate logic or Service.

3.  **Service/Logic**:
    *   Performs business logic (e.g., saving file, calculating status).
    *   Interacts with the Database via SQLAlchemy Session.

4.  **Database**:
    *   PostgreSQL stores the data.
    *   Triggers or Hooks (if any) execute.

5.  **Response**:
    *   Data is returned as a Pydantic Model (Schema) to the client.

## Roles & Permissions Flow

*   **Senior Admin**: Full Access (Root).
*   **Sub Admin**: Manage tickets, standard CRUD, limited admin management.
*   **Junior Admin**: Read-only mainly, simple status checks.
*   **User**: Create tickets, View own tickets.

## Ticket Workflow
1.  **Creation**: User creates ticket -> Status: `PENDING`.
2.  **Opening**: Any Admin views/opens ticket -> Status: `IN_PROGRESS` (Auto-update).
3.  **Processing**: Sub/Senior Admin can comment or change status.
4.  **Read-Only**: Junior Admin can only view.
5.  **Hold**: Sub/Senior Admin puts on hold -> Status: `ON_HOLD` (Require Reason).
6.  **Resolution**: Status: `RESOLVED`.
