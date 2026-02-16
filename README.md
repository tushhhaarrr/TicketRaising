# Todoist - Ticket Raising Platform 🚀

## 📖 Overview

The **Ticket Raising Platform** is a state-of-the-art enterprise solution designed to streamline internal issue tracking and resolution. Built with a **FastAPI** backend and a **Modern React** frontend, this application features a premium **Glassmorphism UI** inspired by MacOS aesthetics. It bridges the gap between employees and support staff through an intuitive, reliable, and aesthetically pleasing interface.

## ✨ Key Features

### 🎨 Design & Experience
- **Premium Glassmorphism UI**: A visually stunning interface consisting of frosted glass cards, vibrant gradients, and smooth animations.
- **Adaptive Dark Mode**: Seamless transition between Light and "Deep Black" Dark modes with fluid aesthetic adjustments.
- **Responsive Layout**: A mobile-first design that adapts perfectly from desktops to smartphones.

### 🛠️ Functional Modules
- **🔐 Role-Based Access Control (RBAC)**: Secure login for **Admins** and **Employees** with distinct dashboards.
- **📊 Admin Dashboard**:
  - Real-time statistics (Total Tickets, Solved, Pending).
  - Interactive monthly performance graphs (Area Charts).
  - Quick-action table to update ticket statuses (`Resolved`, `Processing`, `On Hold`).
- **🎫 User Dashboard**:
  - Simple "Raise a Ticket" workflow.
  - Live status tracking of submitted complaints.
  - History view of all past interactions.

---

## 🏗️ Architecture

The system follows a decoupled **Client-Server Architecture**:

```text
    ┌──────────────┐          ┌───────────────────┐          ┌───────────────────┐          ┌───────────────────┐
    │  User/Admin  │          │   React Frontend  │          │  FastAPI Backend  │          │   PostgreSQL DB   │
    │  (Browser)   │ ───────► │       (Vite)      │ ───────► │      (Python)     │ ───────► │    (SQLAlchemy)   │
    └──────────────┘          └───────────────────┘          └───────────────────┘          └───────────────────┘
           ▲                            │                              │                              │
           └────────────────────────────┴──────────────────────────────┴──────────────────────────────┘
                                     HTTP / JSON Response Flow
```

### 💻 Technology Stack

| Logic Layer | Technology Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind Concepts (Custom CSS), Framer Motion, Recharts |
| **Backend** | Python 3.10+, FastAPI, Pydantic, SQLAlchemy |
| **Database** | PostgreSQL (Production), SQLite (Development) |
| **Authentication** | OAuth2 with Password Flow (JWT Tokens) |
| **Styling** | CSS3 Variables, Backdrop-Filters, Lucide React Icons |

---

## 📸 Screenshots

### 1. Login Page
*A sleek, glass-styled entry point for all users.*
![Login Page](docs/images/login_page.png)

### 2. Admin Dashboard (Dark Mode)
*Comprehensive overview with graphs and ticket management tools.*
![Admin Dashboard](docs/images/admin_dashboard.png)

### 3. Ticket Creation & User Panel
*Intuitive form for raising new issues.*
![User Dashboard](docs/images/user_dashboard.png)

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- Node.js (v16+)
- Python (v3.9+)
- PostgreSQL (Optional, defaults to SQLite)

### 1️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload
```
*The API will be available at `http://localhost:8000`*

### 2️⃣ Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run the live server
npm run dev
```
*The App will be available at `http://localhost:5173`*

### 3️⃣ Docker Setup (Recommended)
You can run the entire application (Backend + Frontend + Database) using Docker.

**Prerequisites:**
- Docker Desktop installed and running.

**Steps:**
1. Open a terminal in the root directory (where `docker-compose.yml` is located).
2. Run the following command:
   ```bash
   docker-compose up --build
   ```
3. Access the application:
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:8000/docs
   - **Database**: Port 5432 (User: `postgres`, Password: `postgres`, DB: `ticketRaising`)

To stop the application, press `Ctrl+C` in the terminal or run `docker-compose down`.


---

## 📂 Project Structure

```
TicketRaising/
├── backend/                # FastAPI Application
│   ├── app/
│   │   ├── routers/        # API Endpoints (Auth, Tickets, Users)
│   │   ├── models/         # Database Models
│   │   └── schemas/        # Pydantic Schemas
│   │   └── main.py         # Entry Point
│
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/     # Reusable UI (Navbar, GlassCard)
│   │   ├── pages/          # Application Pages (Dashboard, Login)
│   │   ├── utils/          # Helpers (MockData)
│   │   └── index.css       # Global Styles & Glassmorphism Logic
│   └── vite.config.js      # Vite Configuration
│
└── README.md               # Project Documentation
```

## 🤝 Contributing
Contributions are welcome! Please reach out to the development team at **Todoist Pvt Ltd.** for access.

---

© 2024 Todoist Pvt Ltd. All rights reserved.
