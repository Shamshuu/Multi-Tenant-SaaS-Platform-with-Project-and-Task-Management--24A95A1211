# Architecture Document
# Multi-Tenant SaaS Platform

---

## 1. System Architecture Overview

The Multi-Tenant SaaS Platform follows a three-tier architecture pattern with clear separation between presentation, application, and data layers. The system is fully containerized using Docker for consistent deployment across environments.

### 1.1 High-Level Architecture

![System Architecture](./images/system-architecture.png)

### Architecture Components:

**Client Layer:**
- Web browsers (Desktop & Mobile)
- React-based Single Page Application (SPA)
- Material UI component library
- Responsive design for all screen sizes

**Application Layer:**
- Node.js runtime environment
- Express.js web framework
- RESTful API architecture
- JWT-based stateless authentication
- Role-Based Access Control (RBAC)
- Tenant isolation middleware

**Data Layer:**
- PostgreSQL relational database
- Multi-tenant shared schema design
- Connection pooling for performance
- ACID transactions for data consistency

**Infrastructure Layer:**
- Docker containers for all services
- Docker Compose for orchestration
- Health checks and monitoring
- Volume persistence for database

---

## 2. Database Architecture

### 2.1 Entity Relationship Diagram

![Database ERD](./images/database-erd.png)

### 2.2 Database Design Principles

**Multi-Tenancy Strategy:**
- Shared database with shared schema approach
- Every table (except super_admin users) includes `tenant_id` foreign key
- Application-level tenant isolation
- Database-level referential integrity

**Data Isolation:**
- All queries automatically filtered by `tenant_id`
- Middleware enforces tenant context from JWT
- Super admin users have `tenant_id = NULL` for cross-tenant access
- Composite unique constraints: `(tenant_id, column)`

**Cascading Rules:**
- Tenant deletion cascades to users, projects, tasks
- User deletion sets `assigned_to = NULL` in tasks
- Project deletion cascades to all tasks
- Audit logs preserved (SET NULL on FK)

### 2.3 Core Tables

**tenants**
- Stores organization information
- Subscription plan and limits
- Status management (active, suspended, trial)

**users**
- Three roles: super_admin, tenant_admin, user
- Tenant association (NULL for super_admin)
- Email unique per tenant

**projects**
- Belongs to tenant
- Created by user
- Status tracking

**tasks**
- Belongs to both project and tenant
- Assigned to user (optional)
- Priority and status management

**audit_logs**
- Immutable security audit trail
- Tracks all critical actions
- Includes user, tenant, action, timestamp

---

## 3. API Architecture

### 3.1 RESTful Design

All APIs follow REST principles:
- Resource-based URLs (`/api/projects`, `/api/tasks`)
- HTTP methods for operations (GET, POST, PUT, PATCH, DELETE)
- Stateless communication
- JSON request/response format

### 3.2 API Endpoint Organization

**Authentication Module** (`/api/auth`)
- `POST /register-tenant` - New tenant registration
- `POST /login` - User authentication
- `GET /me` - Current user profile
- `POST /logout` - User logout

**Tenant Management** (`/api/tenants`)
- `GET /` - List all tenants (super_admin)
- `GET /:id` - Get tenant details
- `PUT /:id` - Update tenant

**User Management** (`/api/tenants/:id/users`, `/api/users/:id`)
- `POST /tenants/:id/users` - Create user
- `GET /tenants/:id/users` - List users
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

**Project Management** (`/api/projects`)
- `POST /` - Create project
- `GET /` - List projects
- `GET /:id` - Get project details
- `PUT /:id` - Update project
- `DELETE /:id` - Delete project

**Task Management** (`/api/projects/:id/tasks`, `/api/tasks/:id`)
- `POST /projects/:id/tasks` - Create task
- `GET /projects/:id/tasks` - List tasks
- `PATCH /tasks/:id/status` - Update status only
- `PUT /tasks/:id` - Full task update

**System** (`/api/health`)
- `GET /health` - Health check endpoint

### 3.3 Authentication & Authorization Flow

```
1. Client sends credentials (email, password, subdomain)
2. Backend validates tenant and user
3. Backend generates JWT with {userId, tenantId, role}
4. Client stores JWT in localStorage
5. Client sends JWT in Authorization header
6. Middleware verifies JWT and extracts claims
7. Authorization middleware checks role permissions
8. TenantScope middleware filters data by tenantId
9. Controller processes request with tenant context
10. Response sent to client
```

### 3.4 Error Handling

**Consistent Error Response Format:**
```json
{
  "success": false,
  "message": "Error description"
}
```

**HTTP Status Codes:**
- 200: Success
- 201: Resource created
- 400: Bad request (validation errors)
- 401: Unauthorized (auth required)
- 403: Forbidden (insufficient permissions)
- 404: Not found
- 409: Conflict (duplicate resource)
- 500: Internal server error

---

## 4. Security Architecture

### 4.1 Authentication Security

**Password Security:**
- bcrypt hashing with 10 salt rounds
- Minimum 8 characters requirement
- Never stored in plain text
- Constant-time comparison for verification

**JWT Security:**
- HS256 algorithm
- 24-hour expiration
- Contains only non-sensitive data
- Transmitted via HTTPS in production

### 4.2 Authorization Layers

**Role Hierarchy:**
```
super_admin (highest)
  ├── Full platform access
  ├── Manage all tenants
  └── Update subscription plans

tenant_admin
  ├── Manage users in tenant
  ├── Manage projects in tenant
  └── Update tenant name only

user (lowest)
  ├── View projects
  ├── Manage assigned tasks
  └── Update own profile
```

**Access Control Matrix:**

| Resource | super_admin | tenant_admin | user |
|----------|-------------|--------------|------|
| All Tenants | ✅ | ❌ | ❌ |
| Own Tenant | ✅ | ✅ (Read) | ✅ (Read) |
| Users (Create) | ❌ | ✅ | ❌ |
| Users (Delete) | ❌ | ✅ | ❌ |
| Projects (Create) | ❌ | ✅ | ✅ |
| Projects (Delete) | ❌ | ✅ | Creator Only |
| Tasks (Create) | ❌ | ✅ | ✅ |
| Tasks (Update) | ❌ | ✅ | ✅ |

### 4.3 Data Protection

**Tenant Isolation:**
- Middleware enforces tenant_id filtering
- Prevents cross-tenant data access
- Returns 403 on unauthorized attempts

**Input Validation:**
- Server-side validation on all inputs
- Type checking and sanitization
- Parameterized queries (SQL injection prevention)
- XSS protection via React escaping

**CORS Protection:**
- Whitelist allowed origins
- Credentials only for trusted domains
- Rejects unauthorized origins

---

## 5. Deployment Architecture

### 5.1 Docker Container Architecture

```
┌─────────────────────────────────────┐
│        Docker Compose               │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────┐  ┌──────────────┐ │
│  │  Frontend   │  │   Backend    │ │
│  │   (React)   │←→│  (Express)   │ │
│  │  Port 3000  │  │  Port 5000   │ │
│  └─────────────┘  └──────┬───────┘ │
│                          ↓          │
│                   ┌──────────────┐  │
│                   │  Database    │  │
│                   │ (PostgreSQL) │  │
│                   │  Port 5432   │  │
│                   └──────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

### 5.2 Service Configuration

**Database Service:**
- Image: postgres:15
- Persistent volume for data
- Health check: pg_isready
- Automatic initialization

**Backend Service:**
- Custom Dockerfile (Node.js 18)
- Depends on database health
- Runs migrations and seeds on startup
- Health check endpoint

**Frontend Service:**
- Custom Dockerfile (Node.js 22)
- Vite development server
- Environment variables for API URL
- Depends on backend health

### 5.3 Environment Configuration

**Environment Variables:**
- Database connection details
- JWT secret key
- API URLs
- CORS origins
- Node environment (development/production)

**Port Mappings:**
- Frontend: 3000:3000
- Backend: 5000:5000
- Database: 5432:5432

---

## 6. Scalability Considerations

### 6.1 Current Architecture

- Stateless authentication (JWT) enables horizontal scaling
- Connection pooling optimizes database usage
- Indexed queries for performance
- Pagination on list endpoints

### 6.2 Future Enhancements

**Horizontal Scaling:**
- Load balancer (Nginx, HAProxy)
- Multiple backend instances
- Session affinity not required (stateless)

**Caching Layer:**
- Redis for frequently accessed data
- Cache tenant information
- Cache user permissions

**Database Optimization:**
- Read replicas for analytics
- Partitioning large tables by tenant_id
- Archive old audit logs

**Microservices Migration:**
- Separate authentication service
- Separate notification service
- Event-driven architecture with message queue

---

## 7. Monitoring & Observability

### 7.1 Health Checks

**Application Health:**
- `/api/health` endpoint
- Database connectivity check
- Returns 200 OK or 500 Error

**Docker Health Checks:**
- Database: pg_isready command
- Backend: HTTP GET to /api/health
- Frontend: Process running check

### 7.2 Audit Logging

**Logged Events:**
- User authentication (success/failure)
- User CRUD operations
- Project lifecycle events
- Task assignments and updates
- Tenant configuration changes
- Cross-tenant access attempts

**Audit Log Fields:**
- timestamp, user_id, tenant_id
- action, entity_type, entity_id
- ip_address

---

## 8. Technology Decisions

### 8.1 Backend: Node.js + Express

**Rationale:**
- JavaScript ecosystem consistency
- Non-blocking I/O for high concurrency
- Large middleware ecosystem
- Rapid development cycles
- JSON native handling

### 8.2 Database: PostgreSQL

**Rationale:**
- ACID compliance for data integrity
- Advanced constraint enforcement
- Excellent performance with proper indexing
- JSON support for flexibility
- Open source with no licensing costs

### 8.3 Frontend: React + Vite

**Rationale:**
- Component-based architecture
- Large community and ecosystem
- Material UI for rapid development
- Vite for fast builds and HMR
- SEO not critical for SaaS dashboard

### 8.4 Containerization: Docker

**Rationale:**
- Environment consistency
- Easy onboarding for developers
- Production parity
- Infrastructure as code
- CI/CD integration ready

---

## 9. API Endpoint Summary

**Total Endpoints: 19 + 1 Health Check**

### Authentication (4 endpoints)
1. POST /api/auth/register-tenant
2. POST /api/auth/login
3. GET /api/auth/me
4. POST /api/auth/logout

### Tenant Management (3 endpoints)
5. GET /api/tenants (super_admin)
6. GET /api/tenants/:id
7. PUT /api/tenants/:id

### User Management (4 endpoints)
8. POST /api/tenants/:id/users
9. GET /api/tenants/:id/users
10. PUT /api/users/:id
11. DELETE /api/users/:id

### Project Management (5 endpoints)
12. POST /api/projects
13. GET /api/projects
14. GET /api/projects/:id
15. PUT /api/projects/:id
16. DELETE /api/projects/:id

### Task Management (4 endpoints)
17. POST /api/projects/:id/tasks
18. GET /api/projects/:id/tasks
19. PATCH /api/tasks/:id/status
20. PUT /api/tasks/:id

### System (1 endpoint)
21. GET /api/health

---

**Document Version:** 1.0  
**Last Updated:** January 17, 2026  
**Status:** Approved