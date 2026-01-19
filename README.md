# Multi-Tenant SaaS Platform with Project & Task Management

[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)

## 📋 Overview

A production-ready, fully containerized multi-tenant SaaS platform for project and task management. Each organization (tenant) gets isolated users, projects, and tasks with complete data separation. Features role-based access control, subscription management, and comprehensive audit logging.

## ✨ Features

### 🏢 Multi-Tenancy
- **Complete Data Isolation**: Each tenant's data is fully isolated with `tenant_id` filtering
- **Subdomain Support**: Unique subdomain per tenant for branded access
- **Subscription Plans**: Free, Pro, and Enterprise with different limits
- **Tenant Management**: Super admin can manage all tenants from central dashboard

### 👥 User Management
- **Three User Roles**: Super Admin, Tenant Admin, and End User
- **Role-Based Access Control (RBAC)**: Granular permissions per role
- **User Limits**: Enforced based on subscription plan
- **Email Uniqueness**: Per tenant (same email can exist in different tenants)

### 📊 Project & Task Management
- **Project Organization**: Create, update, and archive projects
- **Task Tracking**: Todo, In Progress, Completed status workflow
- **Priority Levels**: Low, Medium, High priority tasks
- **Task Assignment**: Assign tasks to team members
- **Due Dates**: Set and track task deadlines
- **Project Limits**: Enforced based on subscription plan

### 🔐 Security
- **JWT Authentication**: Stateless token-based authentication (24-hour expiry)
- **Password Hashing**: bcrypt with 10 salt rounds
- **CORS Protection**: Whitelist-based origin validation
- **SQL Injection Prevention**: Parameterized queries exclusively
- **Audit Logging**: Track all critical actions with timestamps

### 🎨 Modern UI
- **Material UI Components**: Professional, responsive design
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Role-Based UI**: Show/hide features based on user permissions
- **Real-Time Feedback**: Loading states and error messages

### 🐳 DevOps Ready
- **Fully Dockerized**: Database, Backend, and Frontend containers
- **One-Command Deploy**: `docker-compose up -d` starts everything
- **Auto-Initialization**: Migrations and seeds run automatically
- **Health Checks**: Built-in monitoring for all services

## 🏗️ Architecture

![System Architecture](./docs/images/system-architecture.png)

### Three-Tier Architecture:
- **Client Layer**: React SPA with Material UI
- **Application Layer**: Node.js + Express REST API
- **Data Layer**: PostgreSQL with multi-tenant schema

See [docs/architecture.md](./docs/architecture.md) for detailed architecture documentation.

## 🗄️ Database Schema

![Database ERD](./docs/images/database-erd.png)

### Core Tables:
- **tenants**: Organization information and subscription details
- **users**: User accounts with role-based permissions
- **projects**: Project management with tenant isolation
- **tasks**: Task tracking with assignments and priorities
- **audit_logs**: Security audit trail

## 👤 User Roles

### Super Admin
- ✅ Access all tenants across the platform
- ✅ Update subscription plans and limits
- ✅ Suspend/activate tenants
- ❌ Cannot directly manage projects or tasks

### Tenant Admin
- ✅ Manage users within their organization
- ✅ Create and manage projects
- ✅ Create and assign tasks
- ✅ Update organization name
- ❌ Cannot modify subscription plan or status

### End User
- ✅ View projects within their organization
- ✅ Manage assigned tasks
- ✅ Update task status
- ✅ Update own profile
- ❌ Cannot manage other users or delete projects

## 💻 Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18 LTS | JavaScript runtime |
| Express.js | 5.x | Web framework |
| PostgreSQL | 15 | Relational database |
| bcrypt | 6.x | Password hashing |
| jsonwebtoken | 9.x | JWT authentication |
| pg | 8.x | PostgreSQL client |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI library |
| Vite | 7.x | Build tool & dev server |
| Material UI | 5.x | Component library |
| Axios | 1.x | HTTP client |
| React Router | 7.x | Client-side routing |

### DevOps
| Technology | Version | Purpose |
|------------|---------|---------|
| Docker | 24+ | Containerization |
| Docker Compose | 3.8 | Multi-container orchestration |

## 📁 Project Structure

```
project-root/
├── backend/                  # Backend API
│   ├── Dockerfile           # Backend container config
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Auth, authorization
│   │   ├── routes/         # API endpoints
│   │   └── config/         # Database config
│   └── database/
│       ├── migrations/     # DB schema migrations
│       └── seeds/          # Test data
├── frontend/                # Frontend SPA
│   ├── Dockerfile          # Frontend container config
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React Context (auth)
│   │   └── services/      # API calls
├── docs/                    # Documentation
│   ├── research.md         # Multi-tenancy analysis
│   ├── PRD.md              # Product requirements
│   ├── technical-spec.md   # Technical specification
│   ├── architecture.md     # Architecture overview
│   ├── API.md              # API documentation
│   └── images/             # Diagrams
├── docker-compose.yml       # Service orchestration
├── submission.json         # Test credentials
└── README.md               # This file
```

## 🚀 Quick Start (Docker - Recommended)

### Prerequisites
- Docker Desktop (includes Docker Compose)
- Git

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd Multi-Tenant-SaaS-Platform
```

2. **Start all services**
```bash
docker-compose up -d
```

This single command:
- ✅ Builds all Docker images
- ✅ Starts PostgreSQL database
- ✅ Runs database migrations
- ✅ Loads seed data
- ✅ Starts backend API server
- ✅ Starts frontend development server

3. **Access the application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

4. **Login with test credentials**

**Super Admin:**
- Email: `superadmin@system.com`
- Password: `Admin@123`
- Subdomain: *leave empty*

**Tenant Admin (Demo Company):**
- Email: `admin@demo.com`
- Password: `Demo@123`
- Subdomain: `demo`

**Regular User:**
- Email: `user1@demo.com`
- Password: `User@123`
- Subdomain: `demo`

### 🛑 Stop Services

```bash
docker-compose down
```

### 🗑️ Remove All Data

```bash
docker-compose down -v
```

## 🔧 Local Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Backend Setup

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. **Setup database**
```bash
# Create database
createdb saas_db

# Run migrations
npm run migrate

# Load seed data
npm run seed
```

4. **Start backend**
```bash
npm start  # Production mode
# OR
npm run dev  # Development mode with auto-reload
```

Backend runs at: http://localhost:5000

### Frontend Setup

1. **Install dependencies**
```bash
cd frontend
npm install
```

2. **Configure environment**
```bash
# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

3. **Start frontend**
```bash
npm run dev
```

Frontend runs at: http://localhost:3000

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Research Document](./docs/research.md) | Multi-tenancy analysis, tech stack justification, security |
| [PRD](./docs/PRD.md) | User personas, functional requirements, acceptance criteria |
| [Technical Spec](./docs/technical-spec.md) | Project structure, setup guide, database schema |
| [Architecture](./docs/architecture.md) | System architecture, deployment, scalability |
| [API Documentation](./docs/API.md) | Complete API reference for all 19+ endpoints |

## 🔑 API Endpoints

### Authentication (4 endpoints)
- `POST /api/auth/register-tenant` - Register new tenant
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Tenant Management (3 endpoints)
- `GET /api/tenants` - List all tenants (super_admin)
- `GET /api/tenants/:id` - Get tenant details
- `PUT /api/tenants/:id` - Update tenant

### User Management (4 endpoints)
- `POST /api/tenants/:id/users` - Create user
- `GET /api/tenants/:id/users` - List users
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Project Management (5 endpoints)
- `POST /api/projects` - Create project
- `GET /api/projects` - List projects
- `GET /api/projects/:id` - Get project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Task Management (4 endpoints)
- `POST /api/projects/:id/tasks` - Create task
- `GET /api/projects/:id/tasks` - List tasks
- `PATCH /api/tasks/:id/status` - Update task status
- `PUT /api/tasks/:id` - Update task (full)

### System (1 endpoint)
- `GET /api/health` - Health check

See [API.md](./docs/API.md) for complete documentation with request/response examples.

## 🧪 Testing

### Test Credentials

All test credentials are documented in `submission.json`:

- **Super Admin**: Manages all tenants
- **Demo Tenant**: Full organization with admin and users
- **Sample Data**: Projects and tasks for testing

### Manual Testing Checklist

- ✅ Register new tenant
- ✅ Login as super admin
- ✅ Login as tenant admin with subdomain
- ✅ Cross-tenant access prevention (should return 403)
- ✅ Create users up to subscription limit
- ✅ Attempt to exceed limits (should fail)
- ✅ CRUD operations for projects
- ✅ CRUD operations for tasks
- ✅ Task assignment and status updates

## 🔒 Security Features

- ✅ **Password Hashing**: bcrypt with 10 salt rounds
- ✅ **JWT Tokens**: 24-hour expiration, stateless
- ✅ **CORS Protection**: Whitelist-based origins
- ✅ **SQL Injection Prevention**: Parameterized queries only
- ✅ **Tenant Isolation**: Application-level enforcement
- ✅ **Input Validation**: Server-side validation on all inputs
- ✅ **Audit Logging**: Track all critical actions
- ✅ **Role-Based Access**: Granular permission system

## 📊 Subscription Plans

| Plan | Max Users | Max Projects | Monthly Price |
|------|-----------|--------------|---------------|
| Free | 5 | 3 | $0 |
| Pro | 25 | 15 | $29 |
| Enterprise | 100 | 50 | $99 |

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if database is running
docker-compose ps

# View database logs
docker-compose logs database
```

### Backend Not Starting
```bash
# View backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

### Frontend Can't Connect to Backend
```bash
# Verify backend is running
curl http://localhost:5000/api/health

# Check CORS configuration in backend
```

### Reset Everything
```bash
# Stop all services and remove volumes
docker-compose down -v

# Rebuild and start fresh
docker-compose up --build -d
```

## 🚀 Deployment

### Production Deployment

1. **Update environment variables**:
   - Change `JWT_SECRET` to a strong random value (32+ characters)
   - Update database credentials
   - Set `NODE_ENV=production`
   - Configure production frontend URL for CORS

2. **Build and deploy**:
```bash
docker-compose build --no-cache
docker-compose up -d
```

3. **Verify deployment**:
```bash
# Check all services are running
docker-compose ps

# Test health check
curl http://your-domain.com/api/health
```
