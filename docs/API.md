# API Documentation
# Multi-Tenant SaaS Platform

**Base URL:** `http://localhost:5000/api`  
**Authentication:** JWT Bearer Token  
**Content-Type:** `application/json`

---

## Table of Contents

1. [Authentication APIs](#1-authentication-apis)
2. [Tenant Management APIs](#2-tenant-management-apis)
3. [User Management APIs](#3-user-management-apis)
4. [Project Management APIs](#4-project-management-apis)
5. [Task Management APIs](#5-task-management-apis)
6. [System APIs](#6-system-apis)

---

## 1. Authentication APIs

### API-001: Register Tenant

**Endpoint:** `POST /api/auth/register-tenant`  
**Authentication:** Not required (Public)  
**Description:** Register a new tenant organization with an admin user.

**Request Body:**
```json
{
  "tenantName": "Acme Corporation",
  "subdomain": "acme",
  "adminEmail": "admin@acme.com",
  "adminPassword": "SecurePass@123",
  "adminFullName": "John Admin"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Tenant registered successfully",
  "data": {
    "tenantId": "550e8400-e29b-41d4-a716-446655440000",
    "subdomain": "acme",
    "adminUser": {
      "id": "660e8400-e29b-41d4-a716-446655440000",
      "email": "admin@acme.com",
      "fullName": "John Admin",
      "role": "tenant_admin"
    }
  }
}
```

**Error Responses:**

400 - Bad Request:
```json
{
  "success": false,
  "message": "All fields are required"
}
```

409 - Conflict:
```json
{
  "success": false,
  "message": "Subdomain already exists"
}
```

---

### API-002: Login

**Endpoint:** `POST /api/auth/login`  
**Authentication:** Not required (Public)  
**Description:** Authenticate user and receive JWT token.

**Request Body (Tenant User):**
```json
{
  "email": "admin@acme.com",
  "password": "SecurePass@123",
  "tenantSubdomain": "acme"
}
```

**Request Body (Super Admin):**
```json
{
  "email": "superadmin@system.com",
  "password": "Admin@123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "660e8400-e29b-41d4-a716-446655440000",
      "email": "admin@acme.com",
      "fullName": "John Admin",
      "role": "tenant_admin",
      "tenantId": "550e8400-e29b-41d4-a716-446655440000"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

**Error Responses:**

400 - Bad Request:
```json
{
  "success": false,
  "message": "Tenant subdomain is required!"
}
```

401 - Unauthorized:
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

403 - Forbidden:
```json
{
  "success": false,
  "message": "Account is inactive"
}
```

404 - Not Found:
```json
{
  "success": false,
  "message": "Tenant not found"
}
```

---

### API-003: Get Current User

**Endpoint:** `GET /api/auth/me`  
**Authentication:** Required  
**Headers:** `Authorization: Bearer <token>`  
**Description:** Get authenticated user's profile and tenant information.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "email": "admin@acme.com",
    "fullName": "John Admin",
    "role": "tenant_admin",
    "isActive": true,
    "tenant": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Acme Corporation",
      "subdomain": "acme",
      "subscriptionPlan": "pro",
      "maxUsers": 25,
      "maxProjects": 15
    }
  }
}
```

**Success Response for Super Admin (200):**
```json
{
  "success": true,
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "email": "superadmin@system.com",
    "fullName": "Super Admin",
    "role": "super_admin",
    "isActive": true,
    "tenant": null
  }
}
```

**Error Responses:**

401 - Unauthorized:
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

---

### API-004: Logout

**Endpoint:** `POST /api/auth/logout`  
**Authentication:** Required  
**Headers:** `Authorization: Bearer <token>`  
**Description:** Logout user (client should remove token from storage).

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 2. Tenant Management APIs

### API-005: Get Tenant Details

**Endpoint:** `GET /api/tenants/:tenantId`  
**Authentication:** Required  
**Authorization:** Super Admin OR Tenant Owner  
**Description:** Get detailed information about a specific tenant.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Acme Corporation",
    "subdomain": "acme",
    "status": "active",
    "subscriptionPlan": "pro",
    "maxUsers": 25,
    "maxProjects": 15,
    "createdAt": "2026-01-15T10:30:00Z",
    "stats": {
      "totalUsers": 12,
      "totalProjects": 8,
      "totalTasks": 45
    }
  }
}
```

**Error Responses:**

403 - Forbidden:
```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

404 - Not Found:
```json
{
  "success": false,
  "message": "Tenant not found"
}
```

---

### API-006: Update Tenant

**Endpoint:** `PUT /api/tenants/:tenantId`  
**Authentication:** Required  
**Authorization:** Super Admin (all fields) OR Tenant Admin (name only)  
**Description:** Update tenant information.

**Request Body (Tenant Admin):**
```json
{
  "name": "Acme Corporation Ltd."
}
```

**Request Body (Super Admin):**
```json
{
  "name": "Acme Corporation Ltd.",
  "status": "active",
  "subscriptionPlan": "enterprise",
  "maxUsers": 100,
  "maxProjects": 50
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Tenant updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Acme Corporation Ltd.",
    "updatedAt": "2026-01-17T14:30:00Z"
  }
}
```

**Error Responses:**

403 - Forbidden:
```json
{
  "success": false,
  "message": "Insufficient permissions to update these fields"
}
```

---

### API-007: List All Tenants

**Endpoint:** `GET /api/tenants`  
**Authentication:** Required  
**Authorization:** Super Admin ONLY  
**Query Parameters:**
- `page` (integer, optional, default: 1)
- `limit` (integer, optional, default: 10, max: 100)
- `status` (string, optional: active, suspended, trial)
- `subscriptionPlan` (string, optional: free, pro, enterprise)

**Example Request:**
```
GET /api/tenants?page=1&limit=10&status=active
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "tenants": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Acme Corporation",
        "subdomain": "acme",
        "status": "active",
        "subscriptionPlan": "pro",
        "createdAt": "2026-01-15T10:30:00Z"
      },
      {
        "id": "660e8400-e29b-41d4-a716-446655440000",
        "name": "Beta Company",
        "subdomain": "beta",
        "status": "active",
        "subscriptionPlan": "free",
        "createdAt": "2026-01-16T11:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalTenants": 47,
      "limit": 10
    }
  }
}
```

**Error Responses:**

403 - Forbidden:
```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

---

## 3. User Management APIs

### API-008: Add User to Tenant

**Endpoint:** `POST /api/tenants/:tenantId/users`  
**Authentication:** Required  
**Authorization:** Tenant Admin  
**Description:** Create a new user within the tenant.

**Request Body:**
```json
{
  "email": "developer@acme.com",
  "password": "DevPass@123",
  "fullName": "Jane Developer",
  "role": "user"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440000",
    "email": "developer@acme.com",
    "fullName": "Jane Developer",
    "role": "user",
    "tenantId": "550e8400-e29b-41d4-a716-446655440000",
    "isActive": true,
    "createdAt": "2026-01-17T15:00:00Z"
  }
}
```

**Error Responses:**

403 - Forbidden (Limit Reached):
```json
{
  "success": false,
  "message": "Subscription limit reached"
}
```

409 - Conflict:
```json
{
  "success": false,
  "message": "Email already exists in this tenant"
}
```

---

### API-009: List Tenant Users

**Endpoint:** `GET /api/tenants/:tenantId/users`  
**Authentication:** Required  
**Authorization:** Tenant Members  
**Query Parameters:**
- `search` (string, optional) - Search by name or email
- `role` (string, optional: tenant_admin, user)
- `page` (integer, optional, default: 1)
- `limit` (integer, optional, default: 50)

**Example Request:**
```
GET /api/tenants/550e8400-e29b-41d4-a716-446655440000/users?search=dev&role=user
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "880e8400-e29b-41d4-a716-446655440000",
        "email": "developer@acme.com",
        "fullName": "Jane Developer",
        "role": "user",
        "isActive": true,
        "createdAt": "2026-01-17T15:00:00Z"
      }
    ],
    "total": 1,
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "limit": 50
    }
  }
}
```

---

### API-010: Update User

**Endpoint:** `PUT /api/users/:userId`  
**Authentication:** Required  
**Authorization:** Tenant Admin (all fields) OR Self (fullName only)  
**Description:** Update user information.

**Request Body (Self):**
```json
{
  "fullName": "Jane Smith Developer"
}
```

**Request Body (Tenant Admin):**
```json
{
  "fullName": "Jane Smith Developer",
  "role": "tenant_admin",
  "isActive": false
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440000",
    "fullName": "Jane Smith Developer",
    "role": "tenant_admin",
    "updatedAt": "2026-01-17T16:00:00Z"
  }
}
```

**Error Responses:**

403 - Forbidden:
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

---

### API-011: Delete User

**Endpoint:** `DELETE /api/users/:userId`  
**Authentication:** Required  
**Authorization:** Tenant Admin  
**Description:** Delete a user from the tenant.

**Success Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Responses:**

403 - Forbidden:
```json
{
  "success": false,
  "message": "Cannot delete yourself"
}
```

404 - Not Found:
```json
{
  "success": false,
  "message": "User not found"
}
```

---

## 4. Project Management APIs

### API-012: Create Project

**Endpoint:** `POST /api/projects`  
**Authentication:** Required  
**Authorization:** Tenant Members  
**Description:** Create a new project within the tenant.

**Request Body:**
```json
{
  "name": "Website Redesign",
  "description": "Complete redesign of company website",
  "status": "active"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440000",
    "tenantId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Website Redesign",
    "description": "Complete redesign of company website",
    "status": "active",
    "createdBy": "660e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2026-01-17T17:00:00Z"
  }
}
```

**Error Responses:**

403 - Forbidden:
```json
{
  "success": false,
  "message": "Project limit reached"
}
```

---

### API-013: List Projects

**Endpoint:** `GET /api/projects`  
**Authentication:** Required  
**Authorization:** Tenant Members  
**Query Parameters:**
- `status` (string, optional: active, archived, completed)
- `search` (string, optional) - Search by project name
- `page` (integer, optional, default: 1)
- `limit` (integer, optional, default: 20)

**Example Request:**
```
GET /api/projects?status=active&search=website
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "990e8400-e29b-41d4-a716-446655440000",
        "name": "Website Redesign",
        "description": "Complete redesign of company website",
        "status": "active",
        "createdBy": {
          "id": "660e8400-e29b-41d4-a716-446655440000",
          "fullName": "John Admin"
        },
        "taskCount": 12,
        "completedTaskCount": 5,
        "createdAt": "2026-01-17T17:00:00Z"
      }
    ],
    "total": 1,
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "limit": 20
    }
  }
}
```

---

### API-014: Update Project

**Endpoint:** `PUT /api/projects/:projectId`  
**Authentication:** Required  
**Authorization:** Project Creator OR Tenant Admin  
**Description:** Update project information.

**Request Body:**
```json
{
  "name": "Website Redesign v2",
  "description": "Updated description",
  "status": "completed"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Project updated successfully",
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440000",
    "name": "Website Redesign v2",
    "description": "Updated description",
    "status": "completed",
    "updatedAt": "2026-01-17T18:00:00Z"
  }
}
```

**Error Responses:**

403 - Forbidden:
```json
{
  "success": false,
  "message": "Not authorized"
}
```

404 - Not Found:
```json
{
  "success": false,
  "message": "Project not found"
}
```

---

### API-015: Delete Project

**Endpoint:** `DELETE /api/projects/:projectId`  
**Authentication:** Required  
**Authorization:** Project Creator OR Tenant Admin  
**Description:** Delete a project and all associated tasks.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

**Error Responses:**

403 - Forbidden:
```json
{
  "success": false,
  "message": "Not authorized"
}
```

404 - Not Found:
```json
{
  "success": false,
  "message": "Project not found"
}
```

---

## 5. Task Management APIs

### API-016: Create Task

**Endpoint:** `POST /api/projects/:projectId/tasks`  
**Authentication:** Required  
**Authorization:** Tenant Members  
**Description:** Create a new task within a project.

**Request Body:**
```json
{
  "title": "Design homepage mockup",
  "description": "Create high-fidelity design for new homepage",
  "assignedTo": "880e8400-e29b-41d4-a716-446655440000",
  "priority": "high",
  "dueDate": "2026-02-01"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "aa0e8400-e29b-41d4-a716-446655440000",
    "projectId": "990e8400-e29b-41d4-a716-446655440000",
    "tenantId": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Design homepage mockup",
    "description": "Create high-fidelity design for new homepage",
    "status": "todo",
    "priority": "high",
    "assignedTo": "880e8400-e29b-41d4-a716-446655440000",
    "dueDate": "2026-02-01",
    "createdAt": "2026-01-17T19:00:00Z"
  }
}
```

**Error Responses:**

400 - Bad Request:
```json
{
  "success": false,
  "message": "Assigned user does not belong to this tenant"
}
```

403 - Forbidden:
```json
{
  "success": false,
  "message": "Unauthorized project access"
}
```

---

### API-017: List Project Tasks

**Endpoint:** `GET /api/projects/:projectId/tasks`  
**Authentication:** Required  
**Authorization:** Tenant Members  
**Query Parameters:**
- `status` (string, optional: todo, in_progress, completed)
- `assignedTo` (uuid, optional) - Filter by assigned user
- `priority` (string, optional: low, medium, high)
- `search` (string, optional) - Search by task title
- `page` (integer, optional, default: 1)
- `limit` (integer, optional, default: 50)

**Example Request:**
```
GET /api/projects/990e8400-e29b-41d4-a716-446655440000/tasks?status=todo&priority=high
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "aa0e8400-e29b-41d4-a716-446655440000",
        "title": "Design homepage mockup",
        "description": "Create high-fidelity design for new homepage",
        "status": "todo",
        "priority": "high",
        "assignedTo": {
          "id": "880e8400-e29b-41d4-a716-446655440000",
          "fullName": "Jane Developer",
          "email": "developer@acme.com"
        },
        "dueDate": "2026-02-01",
        "createdAt": "2026-01-17T19:00:00Z"
      }
    ],
    "total": 1,
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "limit": 50
    }
  }
}
```

---

### API-018: Update Task Status

**Endpoint:** `PATCH /api/tasks/:taskId/status`  
**Authentication:** Required  
**Authorization:** Tenant Members  
**Description:** Update only the status of a task.

**Request Body:**
```json
{
  "status": "in_progress"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "aa0e8400-e29b-41d4-a716-446655440000",
    "status": "in_progress",
    "updatedAt": "2026-01-17T20:00:00Z"
  }
}
```

---

### API-019: Update Task (Full)

**Endpoint:** `PUT /api/tasks/:taskId`  
**Authentication:** Required  
**Authorization:** Tenant Members  
**Description:** Update all fields of a task.

**Request Body:**
```json
{
  "title": "Design homepage mockup v2",
  "description": "Updated requirements",
  "status": "in_progress",
  "priority": "medium",
  "assignedTo": "660e8400-e29b-41d4-a716-446655440000",
  "dueDate": "2026-02-05"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": "aa0e8400-e29b-41d4-a716-446655440000",
    "title": "Design homepage mockup v2",
    "description": "Updated requirements",
    "status": "in_progress",
    "priority": "medium",
    "assignedTo": "660e8400-e29b-41d4-a716-446655440000",
    "dueDate": "2026-02-05",
    "updatedAt": "2026-01-17T20:30:00Z"
  }
}
```

**Error Responses:**

400 - Bad Request:
```json
{
  "success": false,
  "message": "Assigned user does not belong to this tenant"
}
```

403 - Forbidden:
```json
{
  "success": false,
  "message": "Unauthorized task access"
}
```

---

## 6. System APIs

### API-020: Health Check

**Endpoint:** `GET /api/health`  
**Authentication:** Not required (Public)  
**Description:** Check system health and database connectivity.

**Success Response (200):**
```json
{
  "status": "ok",
  "database": "connected"
}
```

**Error Response (500):**
```json
{
  "status": "error",
  "database": "disconnected"
}
```

---

## Error Codes Reference

| Status Code | Meaning | Common Causes |
|-------------|---------|---------------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input, missing required fields |
| 401 | Unauthorized | Missing/invalid/expired token |
| 403 | Forbidden | Insufficient permissions, limit reached |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource (email, subdomain) |
| 500 | Internal Server Error | Server-side error |

---

## Authentication Header Format

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Rate Limiting

- **Limit:** 100 requests per 15 minutes per IP address
- **Response when exceeded:** HTTP 429 Too Many Requests

---

## CORS Policy

Allowed origins:
- `http://localhost:3000` (development)
- `http://localhost:6000` (development)
- `http://frontend:3000` (Docker)

---

**End of API Documentation**
