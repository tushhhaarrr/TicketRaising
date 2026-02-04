# Ticket Raising Platform - API Testing Guide

This guide provides step-by-step instructions to test the entire flow of the Ticket Raising Platform using `curl` or Postman.

## Base URL
All requests are made to: `http://127.0.0.1:8000`

---

## Phase 1: Administrator Setup

### 1. Login as Super Admin (Senior Admin)
Use the default credentials to get your **Admin Token**.

*   **Endpoint**: `POST /api/v1/auth/login/admin`
*   **Body** (Form Data):
    *   `username`: `admin@example.com`
    *   `password`: `admin123`

**Curl Command:**
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/auth/login/admin" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "username=admin@example.com&password=admin123"
```

**Response:**
Copy the `access_token` from the response. We will refer to this as `ADMIN_TOKEN`.

---

## Phase 2: User Management

### 2. Create a New User (Review Employee)
Only an Admin can create legitimate employees.

*   **Endpoint**: `POST /api/v1/users/`
*   **Headers**: `Authorization: Bearer ADMIN_TOKEN`
*   **Body** (JSON):

**Curl Command:**
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/users/" \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE" \
     -H "Content-Type: application/json" \
     -d '{
           "email": "employee@test.com",
           "password": "userpass123",
           "full_name": "John Employee"
         }'
```

### 3. Create a Sub-Admin (Optional)
Create a Sub-Admin to help manage tickets.

*   **Endpoint**: `POST /api/v1/admins/`
*   **Headers**: `Authorization: Bearer ADMIN_TOKEN`
*   **Body** (JSON):

**Curl Command:**
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/admins/" \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE" \
     -H "Content-Type: application/json" \
     -d '{
           "email": "subadmin@test.com",
           "password": "subpass123",
           "full_name": "Sarah SubAdmin",
           "role": "sub_admin"
         }'
```

---

## Phase 3: User Workflow

### 4. Login as Employee (User)
Now log in as the user you just created.

*   **Endpoint**: `POST /api/v1/auth/login/user`
*   **Body** (Form Data):
    *   `username`: `employee@test.com`
    *   `password`: `userpass123`

**Curl Command:**
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/auth/login/user" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "username=employee@test.com&password=userpass123"
```
**Response:** Copy the `access_token`. We will refer to this as `USER_TOKEN`.

> **Test Failure Case**: Try logging in with `fake@test.com`. You should see: `"detail": "You're not our Employee"`.

### 5. Raise a Ticket
The user reports an issue.

*   **Endpoint**: `POST /api/v1/tickets/`
*   **Headers**: `Authorization: Bearer USER_TOKEN`
*   **Body** (Form Data):
    *   `description`: "My monitor is flickering."
    *   `files`: (Optional) Attach a file.

**Curl Command:**
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/tickets/" \
     -H "Authorization: Bearer YOUR_USER_TOKEN_HERE" \
     -F "description=My monitor is flickering"
     # Add -F "files=@/path/to/image.png" to upload a file
```

### 6. View Own Tickets
The user checks their ticket history.

*   **Endpoint**: `GET /api/v1/tickets/`
*   **Headers**: `Authorization: Bearer USER_TOKEN`

**Curl Command:**
```bash
curl -X GET "http://127.0.0.1:8000/api/v1/tickets/" \
     -H "Authorization: Bearer YOUR_USER_TOKEN_HERE"
```

---

## Phase 4: Admin Workflow

### 7. View All Tickets (Admin)
Switch back to using the `ADMIN_TOKEN`.

*   **Endpoint**: `GET /api/v1/tickets/`
*   **Headers**: `Authorization: Bearer ADMIN_TOKEN`

**Curl Command:**
```bash
curl -X GET "http://127.0.0.1:8000/api/v1/tickets/" \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE"
```

### 8. Access Specific Ticket (Auto-Open)
When an admin views a specific ticket, its status automatically changes to `In Progress`.

*   **Endpoint**: `GET /api/v1/tickets/{ticket_id}` (e.g., 1)
*   **Headers**: `Authorization: Bearer ADMIN_TOKEN`

**Curl Command:**
```bash
curl -X GET "http://127.0.0.1:8000/api/v1/tickets/1" \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE"
```

### 9. Update Ticket Status (Resolve or Hold)
Admin resolves the issue.

*   **Endpoint**: `PUT /api/v1/tickets/{ticket_id}`
*   **Headers**: `Authorization: Bearer ADMIN_TOKEN`
*   **Body** (JSON):

**Curl Command (Resolve):**
```bash
curl -X PUT "http://127.0.0.1:8000/api/v1/tickets/1" \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE" \
     -H "Content-Type: application/json" \
     -d '{ "status": "Resolved" }'
```

**Curl Command (Put on Hold):**
```bash
curl -X PUT "http://127.0.0.1:8000/api/v1/tickets/1" \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE" \
     -H "Content-Type: application/json" \
     -d '{ 
           "status": "On Hold", 
           "hold_reason": "Waiting for spare parts" 
         }'
```

### 10. View Admin Dashboard
Get statistics on tickets.

*   **Endpoint**: `GET /api/v1/admins/dashboard/stats`
*   **Headers**: `Authorization: Bearer ADMIN_TOKEN`

**Curl Command:**
```bash
curl -X GET "http://127.0.0.1:8000/api/v1/admins/dashboard/stats" \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE"
```
