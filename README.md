# Quick Smart Wash - Ticket Raising Platform 🚀

![Banner](https://via.placeholder.com/1200x400.png?text=Quick+Smart+Wash+Enterprise+Platform)
*(Place your banner image at `docs/images/banner.png`)*

## 📖 Overview

The **Quick Smart Wash Ticket Raising Platform** is a state-of-the-art enterprise solution designed to streamline internal issue tracking and resolution. built with a **FastAPI** backend and a **Modern React** frontend, this application features a premium **Glassmorphism UI** inspired by MacOS aesthetics. It bridges the gap between employees and support staff through an intuitive, reliable, and aesthetically pleasing interface.

## ✨ Key Features

### 🎨 Design & Experience
- **Premium Glassmorphism UI**: A visually stunning interface consisting of frosted glass cards, vibrant gradients, and smooth animations.
- **Adaptive Dark Mode**: Seamless transition between Light and "Deep Black" Dark modes with fluid aesthetic adjustments.
- **Responsive Layout**: A mobile-first design that adapts perfectly from desktops to smartphones.

### 🛠️ Functional Modules
- **🔐 Role-Based Access Control (RBAC)**: secure login for **Admins** and **Employees** with distinct dashboards.
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

```mermaid
graph TD
    User((User/Admin))
    FE[React Frontend]
    BE[FastAPI Backend]
    DB[(PostgreSQL DB)]

    User -->|Interacts via Browser| FE
    FE -->|REST API Calls (JSON)| BE
    BE -->|SQLAlchemy ORM| DB
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

> **Note**: These are placeholder locations. Please capture screenshots of your running app and place them in `docs/images/`.

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

---

## 📂 Project Structure

```
TicketRaising/
├── backend/                # FastAPI Application
│   ├── app/
│   │   ├── routers/        # API Endpoints (Auth, Tickets, Users)
│   │   ├── models/         # Database Models
│   │   └── schemas/        # Pydantic Schemas
│   └── main.py             # Entry Point
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
Contributions are welcome! Please reach out to the development team at **Quick Smart Wash Pvt Ltd.** for access.

---

© 2024 Quick Smart Wash Pvt Ltd. All rights reserved.
