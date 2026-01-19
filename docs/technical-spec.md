# Technical Specification
# Multi-Tenant SaaS Platform - Project & Task Management

**Version:** 1.0  
**Last Updated:** January 17, 2026

---

## 1. Project Structure

### 1.1 Backend Structure

```
backend/
├── Dockerfile                 # Docker configuration for backend
├── package.json              # Node.js dependencies and scripts
├── database/                 # Database setup
│   ├── migrate.js           # Migration runner
│   ├── seed.js              # Seed data loader
│   ├── migrations/          # SQL migration files
│   │   ├── 001_create_tenants.sql
│   │   ├── 002_create_users.sql
│   │   ├── 003_create_projects.sql
│   │   ├── 004_create_tasks.sql
│   │   └── 005_create_audit_logs.sql
│   └── seeds/               # Seed data
│       └── seed_data.sql
├── src/                     # Application source code
│   ├── server.js           # Entry point, starts HTTP server
│   ├── app.js              # Express app configuration
│   ├── config/             # Configuration files
│   │   └── db.js          # PostgreSQL connection pool
│   ├── controllers/        # Business logic handlers
│   │   ├── auth.controller.js      # Authentication logic
│   │   ├── tenant.controller.js    # Tenant management
│   │   ├── user.controller.js      # User management
│   │   ├── project.controller.js   # Project CRUD
│   │   └── task.controller.js      # Task CRUD
│   ├── middleware/         # Express middleware
│   │   ├── auth.js        # JWT verification
│   │   ├── authorize.js   # Role-based authorization
│   │   └── tenantScope.js # Tenant isolation
│   ├── routes/            # API route definitions
│   │   ├── auth.routes.js
│   │   ├── tenant.routes.js
│   │   ├── user.routes.js
│   │   ├── project.routes.js
│   │   ├── task.routes.js
│   │   └── health.routes.js
│   ├── services/          # Business services (future)
│   └── utils/             # Utility functions
│       └── jwt.js        # JWT generation/verification
└── .env                   # Environment variables (committed for evaluation)
```

**Purpose of Key Folders:**

- **database/**: Contains all database-related code including migrations and seeds
- **src/controllers/**: Business logic for handling API requests
- **src/middleware/**: Reusable middleware for auth, authorization, validation
- **src/routes/**: API endpoint definitions and route handlers
- **src/config/**: Configuration for database, environment, etc.
- **src/utils/**: Helper functions used across the application

### 1.2 Frontend Structure

```
frontend/
├── Dockerfile              # Docker configuration for frontend
├── package.json           # React dependencies and scripts
├── vite.config.js        # Vite bundler configuration
├── index.html            # HTML entry point
├── public/               # Static assets
│   └── vite.svg
├── src/                  # Application source code
│   ├── main.jsx         # React app entry point
│   ├── App.jsx          # Root component with routing
│   ├── App.css          # Global styles
│   ├── index.css        # Base styles
│   ├── assets/          # Images, fonts, etc.
│   │   └── react.svg
│   ├── components/      # Reusable UI components
│   │   ├── ProtectedRoute.jsx      # Auth route guard
│   │   ├── CreateProjectModal.jsx  # Project creation modal
│   │   ├── EditProjectModal.jsx    # Project edit modal
│   │   ├── CreateTaskModal.jsx     # Task creation modal
│   │   ├── EditTaskModal.jsx       # Task edit modal
│   │   ├── AddUserModal.jsx        # User creation modal
│   │   └── EditUserModal.jsx       # User edit modal
│   ├── context/         # React Context for state management
│   │   └── AuthContext.jsx        # Authentication state
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Projects.jsx
│   │   ├── ProjectDetails.jsx
│   │   └── Users.jsx
│   ├── services/        # API communication
│   │   └── api.js      # Axios instance and API calls
│   └── utils/           # Helper functions
└── .env                 # Environment variables
```

**Purpose of Key Folders:**

- **src/components/**: Reusable UI components used across multiple pages
- **src/context/**: Global state management using React Context API
- **src/pages/**: Full-page components representing different routes
- **src/services/**: API communication layer with backend
- **src/hooks/**: Custom React hooks for reusable logic

### 1.3 Root Structure

```
project-root/
├── docker-compose.yml    # Orchestrates all services
├── README.md            # Project documentation
├── submission.json      # Test credentials for evaluation
├── backend/             # Backend application
├── frontend/            # Frontend application
└── docs/                # Documentation
    ├── research.md
    ├── PRD.md
    ├── architecture.md
    ├── technical-spec.md
    ├── API.md
    └── images/
        ├── system-architecture.png
        └── database-erd.png
```

---

## 2. Technology Stack

### 2.1 Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18 LTS | JavaScript runtime |
| Express.js | 5.x | Web framework |
| PostgreSQL | 15 | Relational database |
| pg | 8.x | PostgreSQL client |
| bcrypt | 6.x | Password hashing |
| jsonwebtoken | 9.x | JWT authentication |
| dotenv | 17.x | Environment variables |
| cors | 2.x | Cross-origin requests |
| express-validator | 7.x | Input validation |

### 2.2 Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI library |
| Vite | 7.x | Build tool |
| Material UI | 5.x | Component library |
| Axios | 1.x | HTTP client |
| React Router | 7.x | Client-side routing |
| Emotion | 11.x | CSS-in-JS (MUI dependency) |

### 2.3 DevOps Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Docker | 24+ | Containerization |
| Docker Compose | 3.8 | Multi-container orchestration |
| PostgreSQL (Docker) | 15 | Database container |

---

## 3. Development Setup Guide

### 3.1 Prerequisites

Before starting development, ensure you have:

- **Node.js:** Version 18 or higher ([Download](https://nodejs.org/))
- **Docker:** Version 24 or higher ([Download](https://www.docker.com/))
- **Docker Compose:** Included with Docker Desktop
- **Git:** For version control
- **Code Editor:** VS Code recommended with extensions:
  - ESLint
  - Prettier
  - Docker
  - PostgreSQL

### 3.2 Environment Variables

#### Backend Environment Variables (.env)

Create a `.env` file in the `backend/` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=saas_db
DB_USER=postgres
DB_PASSWORD=1234

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_minimum_32_characters_long
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

**For Docker Deployment:** Update DB_HOST and FRONTEND_URL:

```env
DB_HOST=database
FRONTEND_URL=http://frontend:3000
```

#### Frontend Environment Variables (.env)

Create a `.env` file in the `frontend/` directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api
```

**For Docker Deployment:**

```env
VITE_API_URL=http://localhost:5000/api
```

### 3.3 Local Development Setup

#### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Multi-Tenant-SaaS-Platform
```

#### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

#### Step 3: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

#### Step 4: Setup PostgreSQL Database

**Option A: Using Local PostgreSQL**

```bash
# Create database
createdb saas_db

# Or using psql
psql -U postgres
CREATE DATABASE saas_db;
\q
```

**Option B: Using Docker PostgreSQL**

```bash
docker run --name postgres-dev -e POSTGRES_PASSWORD=1234 -e POSTGRES_DB=saas_db -p 5432:5432 -d postgres:15
```

#### Step 5: Run Database Migrations

```bash
cd backend
npm run migrate
```

This creates all required tables (tenants, users, projects, tasks, audit_logs).

#### Step 6: Seed Database with Test Data

```bash
npm run seed
```

This creates:
- Super admin: `superadmin@system.com` / `Admin@123`
- Demo tenant: subdomain `demo`
- Tenant admin: `admin@demo.com` / `Demo@123`
- Test users and projects

#### Step 7: Start Backend Server

```bash
npm start
# Or for development with auto-reload:
npm run dev
```

Backend runs at: `http://localhost:5000`

#### Step 8: Start Frontend Development Server

```bash
cd ../frontend
npm run dev
```

Frontend runs at: `http://localhost:3000` (or `http://localhost:6000` depending on config)

#### Step 9: Verify Setup

1. Open `http://localhost:3000` in browser
2. Login with test credentials:
   - Email: `admin@demo.com`
   - Password: `Demo@123`
   - Subdomain: `demo`
3. Should see Dashboard page

### 3.4 Docker Development Setup

#### Step 1: Build and Start All Services

```bash
# From project root
docker-compose up --build
```

This starts:
- **Database:** PostgreSQL on port 5432
- **Backend:** Express API on port 5000
- **Frontend:** React app on port 3000

#### Step 2: Access Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

#### Step 3: View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database
```

#### Step 4: Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v
```

### 3.5 Database Management

#### View Database Contents

```bash
# Connect to PostgreSQL
docker exec -it database psql -U postgres -d saas_db

# Or if running locally
psql -U postgres -d saas_db
```

#### Useful SQL Queries

```sql
-- List all tenants
SELECT * FROM tenants;

-- List all users
SELECT id, email, full_name, role, tenant_id FROM users;

-- List projects for a tenant
SELECT * FROM projects WHERE tenant_id = 'tenant-id-here';

-- List tasks for a project
SELECT * FROM tasks WHERE project_id = 'project-id-here';

-- Check audit logs
SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 10;
```

#### Reset Database

```bash
# Drop and recreate database
docker exec -it database psql -U postgres -c "DROP DATABASE IF EXISTS saas_db;"
docker exec -it database psql -U postgres -c "CREATE DATABASE saas_db;"

# Run migrations and seeds
cd backend
npm run migrate
npm run seed
```

---

## 4. API Endpoint Reference

### 4.1 Authentication Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register-tenant | Public | Register new tenant |
| POST | /api/auth/login | Public | User login |
| GET | /api/auth/me | Required | Get current user |
| POST | /api/auth/logout | Required | Logout user |

### 4.2 Tenant Management Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | /api/tenants | Required | super_admin | List all tenants |
| GET | /api/tenants/:id | Required | Owner/Admin | Get tenant details |
| PUT | /api/tenants/:id | Required | Owner/Admin | Update tenant |

### 4.3 User Management Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | /api/tenants/:id/users | Required | tenant_admin | Create user |
| GET | /api/tenants/:id/users | Required | Tenant member | List users |
| PUT | /api/users/:id | Required | Admin/Self | Update user |
| DELETE | /api/users/:id | Required | tenant_admin | Delete user |

### 4.4 Project Management Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | /api/projects | Required | Tenant member | Create project |
| GET | /api/projects | Required | Tenant member | List projects |
| GET | /api/projects/:id | Required | Tenant member | Get project |
| PUT | /api/projects/:id | Required | Creator/Admin | Update project |
| DELETE | /api/projects/:id | Required | Creator/Admin | Delete project |

### 4.5 Task Management Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | /api/projects/:id/tasks | Required | Tenant member | Create task |
| GET | /api/projects/:id/tasks | Required | Tenant member | List tasks |
| PATCH | /api/tasks/:id/status | Required | Tenant member | Update status |
| PUT | /api/tasks/:id | Required | Tenant member | Update task |

### 4.6 System Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/health | Public | Health check |

---

## 5. Database Schema Design

### 5.1 Core Tables

#### tenants
```sql
- id (UUID, PRIMARY KEY)
- name (VARCHAR)
- subdomain (VARCHAR, UNIQUE)
- status (ENUM: active, suspended, trial)
- subscription_plan (ENUM: free, pro, enterprise)
- max_users (INTEGER)
- max_projects (INTEGER)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### users
```sql
- id (UUID, PRIMARY KEY)
- tenant_id (UUID, FOREIGN KEY, NULLABLE for super_admin)
- email (VARCHAR)
- password_hash (VARCHAR)
- full_name (VARCHAR)
- role (ENUM: super_admin, tenant_admin, user)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

UNIQUE INDEX: (tenant_id, email)
```

#### projects
```sql
- id (UUID, PRIMARY KEY)
- tenant_id (UUID, FOREIGN KEY)
- name (VARCHAR)
- description (TEXT)
- status (ENUM: active, archived, completed)
- created_by (UUID, FOREIGN KEY → users.id)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

INDEX: tenant_id
```

#### tasks
```sql
- id (UUID, PRIMARY KEY)
- project_id (UUID, FOREIGN KEY → projects.id)
- tenant_id (UUID, FOREIGN KEY → tenants.id)
- title (VARCHAR)
- description (TEXT)
- status (ENUM: todo, in_progress, completed)
- priority (ENUM: low, medium, high)
- assigned_to (UUID, FOREIGN KEY → users.id, NULLABLE)
- due_date (DATE, NULLABLE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

INDEX: (tenant_id, project_id)
```

#### audit_logs
```sql
- id (UUID, PRIMARY KEY)
- tenant_id (UUID, FOREIGN KEY, NULLABLE)
- user_id (UUID, FOREIGN KEY, NULLABLE)
- action (VARCHAR)
- entity_type (VARCHAR)
- entity_id (UUID)
- ip_address (VARCHAR)
- created_at (TIMESTAMP)
```

---

## 6. Security Implementation

### 6.1 Authentication Flow

1. User submits login credentials (email, password, subdomain)
2. Backend validates tenant exists and is active
3. Backend verifies user exists in tenant
4. Backend compares password hash using bcrypt
5. Backend generates JWT with payload: `{userId, tenantId, role}`
6. Frontend stores JWT in localStorage
7. Frontend includes JWT in Authorization header for all requests
8. Backend middleware verifies JWT on protected routes

### 6.2 Authorization Levels

| Role | Permissions |
|------|-------------|
| **super_admin** | Access all tenants, modify subscription plans, suspend tenants |
| **tenant_admin** | Manage users, projects, tasks within their tenant |
| **user** | View and update assigned tasks, view projects |

### 6.3 Data Isolation

- Every query includes `WHERE tenant_id = $1`
- Middleware extracts `tenantId` from JWT
- Prevents manual tenant_id manipulation via query parameters
- Super admin bypass: check `role === 'super_admin'` before tenant filter

---

## 7. Testing Strategy

### 7.1 Manual Testing Checklist

- [ ] Register new tenant successfully
- [ ] Login as super admin
- [ ] Login as tenant admin with subdomain
- [ ] Attempt cross-tenant access (should fail with 403)
- [ ] Create user up to subscription limit
- [ ] Attempt to exceed user limit (should fail)
- [ ] Create, update, delete projects
- [ ] Create, update, assign tasks
- [ ] Update task status
- [ ] Delete user and verify tasks set to NULL

### 7.2 Test Credentials

See `submission.json` for complete test credentials.

---

## 8. Deployment Guide

### 8.1 Production Deployment with Docker

```bash
# Build production images
docker-compose build --no-cache

# Start services in detached mode
docker-compose up -d

# Verify services are running
docker-compose ps

# Check logs
docker-compose logs -f
```

### 8.2 Environment Variables for Production

Update production environment variables:

- Change `JWT_SECRET` to strong random value (32+ characters)
- Change database password
- Set `NODE_ENV=production`
- Update `FRONTEND_URL` to production domain
- Enable HTTPS

---

## 9. Troubleshooting

### Common Issues

**Issue:** Database connection refused
```bash
# Solution: Verify PostgreSQL is running
docker-compose ps
docker-compose logs database
```

**Issue:** Migrations fail
```bash
# Solution: Drop and recreate database
docker exec -it database psql -U postgres -c "DROP DATABASE saas_db;"
docker exec -it database psql -U postgres -c "CREATE DATABASE saas_db;"
npm run migrate
```

**Issue:** Frontend can't connect to backend
```bash
# Solution: Verify CORS configuration and API URL
# Check backend logs for CORS errors
# Ensure VITE_API_URL matches backend port
```

**Issue:** JWT token invalid
```bash
# Solution: Check JWT_SECRET matches between services
# Verify token hasn't expired (24h)
# Clear localStorage and login again
```

---

## 10. Performance Optimization

### Database Optimization

- All `tenant_id` columns are indexed
- Composite indexes on frequently queried columns
- Connection pooling configured (default: 10-20 connections)
- Query optimization using EXPLAIN ANALYZE

### API Optimization

- Stateless authentication (JWT) for horizontal scaling
- Pagination on list endpoints
- Selective field returning (don't fetch unnecessary data)
- Caching strategy (future: Redis for sessions)

### Frontend Optimization

- Code splitting by route
- Lazy loading of heavy components
- Optimized bundle size with Vite
- Production builds minified and compressed

---

**End of Technical Specification**
