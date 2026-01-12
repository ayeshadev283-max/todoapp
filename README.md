# Todo Application - Spec-Driven Development Showcase

A multi-phase todo application demonstrating **spec-driven, agentic development workflows** powered by Claude Code + Spec-Kit Plus.

## Project Overview

This repository showcases the evolution of a todo application through two phases:

- **Phase 1 (001-fullstack-web-app)**: Console-based, single-user, in-memory Python application
- **Phase 2 (002-web-app)**: Multi-user web application with persistent storage, JWT authentication, and modern web stack

Both phases follow a rigorous **specification → plan → tasks → implementation** workflow with zero manual coding.

---

## Tech Stack

### Phase 2: Web Application (Current)

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 16 + TypeScript + Tailwind CSS | React-based web UI with App Router |
| **Authentication** | Custom JWT (python-jose) | JWT-based authentication with localStorage session |
| **Backend** | FastAPI + Python 3.11+ | RESTful API with automatic OpenAPI documentation |
| **ORM** | SQLModel | Type-safe database queries with Pydantic integration |
| **Database** | PostgreSQL 16 (Neon Serverless) | Persistent cloud-hosted relational database |
| **Migrations** | Alembic | Version-controlled schema migrations |
| **Password Hashing** | bcrypt 4.x + passlib | Secure password hashing (bcrypt <5.0.0 required) |

### Phase 1: Console Application (Completed)

- Python 3.11+ with standard library only
- In-memory storage (dict-based)
- Interactive CLI with menu-driven interface

---

## Project Structure (Monorepo)

```
todo/
├── frontend/               # Next.js web application
│   ├── app/               # Next.js App Router pages
│   ├── components/        # React components
│   ├── lib/               # Utilities (API client, auth, types)
│   ├── CLAUDE.md          # Frontend development rules
│   └── package.json
│
├── backend/               # FastAPI REST API
│   ├── app/
│   │   ├── main.py       # FastAPI application
│   │   ├── models.py     # SQLModel database models
│   │   ├── routes/       # API endpoints (auth, tasks)
│   │   ├── middleware/   # JWT verification
│   │   └── database.py   # Database connection
│   ├── alembic/          # Database migrations
│   ├── CLAUDE.md         # Backend development rules
│   └── requirements.txt
│
├── src/                  # Phase 1 console app (preserved)
│   ├── models/
│   ├── services/
│   ├── cli/
│   └── main.py
│
├── specs/                # Feature specifications
│   ├── 001-fullstack-web-app/  # Phase 1 spec
│   └── 002-web-app/            # Phase 2 spec
│
├── history/              # Prompt History Records (PHRs)
│   ├── prompts/
│   └── adr/             # Architecture Decision Records
│
├── docker-compose.yml    # Local PostgreSQL for development
├── .env.example          # Environment variables template
└── README.md             # This file
```

---

## Quick Start

### Prerequisites

- **Node.js** 18+ (for frontend)
- **Python** 3.11+ (for backend)
- **Docker** (for local PostgreSQL)
- **Git**

### Setup Instructions

#### 1. Clone Repository

```bash
git clone <repository-url>
cd todo
```

#### 2. Environment Variables

Copy `.env.example` to `.env` and fill in values:

```bash
cp .env.example .env
```

**Critical**: Set `JWT_SECRET_KEY` (backend) and ensure it's kept secure. Frontend stores JWT tokens in localStorage.

#### 3. Start Local Database

```bash
docker-compose up -d
```

This starts PostgreSQL on `localhost:5432`.

#### 4. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start FastAPI server
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000`

#### 5. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create frontend .env.local
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000
EOF

# Start Next.js dev server
npm run dev
```

Frontend runs at `http://localhost:3000`

---

## Features (Phase 2)

### Authentication
- ✅ Sign up with email/password
- ✅ Sign in with JWT token
- ✅ Protected routes requiring authentication
- ✅ Secure session management

### Task Management
- ✅ Create tasks with title and optional description
- ✅ View all tasks in a list
- ✅ Update task content
- ✅ Delete tasks with confirmation
- ✅ Toggle task completion status

### Security
- ✅ User data isolation (cannot access other users' tasks)
- ✅ JWT verification on all API endpoints
- ✅ Bcrypt password hashing
- ✅ CORS protection with origin whitelist

### UI/UX
- ✅ Responsive design (mobile and desktop)
- ✅ Loading states during async operations
- ✅ Error handling with user-friendly messages
- ✅ Toast notifications for success/error feedback

---

## Phase 1: Console Application

The original console application is preserved in the `src/` directory.

### Running Phase 1

```bash
python -m src.main
```

### Phase 1 Features

- Interactive menu-driven CLI
- 5 CRUD operations (Create, Read, Update, Delete, Toggle)
- In-memory storage
- Comprehensive input validation

See `specs/001-fullstack-web-app/` for Phase 1 documentation.

---

## API Documentation

### Authentication Endpoints

**POST /api/auth/signup**
- Register new user
- Body: `{ "email": "user@example.com", "password": "SecurePass123!" }`
- Returns: `{ "user_id", "email", "token" }`

**POST /api/auth/login**
- Authenticate existing user
- Body: `{ "email": "user@example.com", "password": "SecurePass123!" }`
- Returns: `{ "user_id", "email", "token" }`

### Task Endpoints (All require JWT)

**GET /api/tasks**
- List all tasks for authenticated user
- Query: `?completed=true|false` (optional)

**POST /api/tasks**
- Create new task
- Body: `{ "title": "Task title", "description": "Optional description" }`

**GET /api/tasks/{id}**
- Get single task details

**PUT /api/tasks/{id}**
- Update task
- Body: `{ "title": "New title", "description": "New description" }`

**DELETE /api/tasks/{id}**
- Delete task permanently

**PATCH /api/tasks/{id}/complete**
- Toggle task completion status

Full API documentation at `http://localhost:8000/docs` (Swagger UI)

---

## Development Workflow

This project follows a strict **spec-driven development** process:

1. **Specification** (`specs/<feature>/spec.md`)
   - Define requirements and user stories
   - NO implementation details

2. **Planning** (`specs/<feature>/plan.md`)
   - Architecture decisions
   - Technology choices
   - Risk assessment

3. **Task Breakdown** (`specs/<feature>/tasks.md`)
   - 150-200 atomic tasks
   - Clear acceptance criteria
   - Dependency mapping

4. **Implementation** (via `/sp.implement`)
   - Sequential phase execution
   - All code generated by Claude Code
   - Zero manual coding

5. **Validation**
   - Manual testing against acceptance criteria
   - All user stories verified

---

## Constitution Compliance

All code follows these principles:

- ✅ **Specification as Source of Truth**: All features traceable to spec
- ✅ **Implementation Fidelity**: No deviation from plan
- ✅ **Reproducibility**: Complete setup documentation
- ✅ **Clean Code**: Type hints, docstrings, PEP 8/ESLint compliance
- ✅ **Workflow Sequence**: Spec → Plan → Tasks → Implementation

### Code Quality Standards

- **Python**: Type hints, Black formatting, max 50 lines per function
- **TypeScript**: Strict mode, ESLint, Prettier, explicit return types
- **Architecture**: Separation of concerns, single responsibility
- **Security**: Input validation, SQL injection prevention, JWT verification

### Code Formatting and Linting

**Frontend** (from `frontend/` directory):
```bash
npm run lint        # Run ESLint to check for errors
npx prettier --write .  # Format code with Prettier
```

**Backend** (from `backend/` directory):
```bash
python -m black .                    # Format Python code
python -m isort . --profile black    # Sort imports
```

---

## Testing

### Manual Testing (Phase 2)

**Acceptance Test**:
1. Sign up as User A
2. Create task "Confidential project"
3. Mark complete
4. Sign up as User B (incognito)
5. Verify User B cannot see User A's task
6. User A updates task
7. User A deletes task

All functional requirements tested manually with browser + curl.

### Phase 1 Testing

Manual test scenarios documented in `tests/manual/test_scenarios.md`

---

## Deployment

### Backend Deployment

Recommended platforms:
- Railway
- Render
- Fly.io

Requirements:
- Python 3.11+ runtime
- PostgreSQL database (use Neon serverless)
- Environment variables configured

### Frontend Deployment

Recommended platform: **Vercel**

1. Connect GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

---

## Troubleshooting

### Common Issues

**CORS Error (Frontend cannot reach backend)**:
- Verify `CORS_ORIGINS` in backend `.env` includes frontend URL
- Check browser console for specific CORS error

**JWT Verification Failed**:
- Verify `JWT_SECRET_KEY` is set correctly in backend `.env`
- Check JWT expiration (7 days default)
- Clear browser localStorage and re-login if token is corrupted

**Database Connection Failed**:
- Verify PostgreSQL is running (`docker-compose ps`)
- Check `DATABASE_URL` format: `postgresql://user:pass@host:5432/db`

**Module Not Found (Python)**:
- Activate virtual environment: `source venv/bin/activate`
- Install dependencies: `pip install -r requirements.txt`

**Bcrypt Password Hashing Error**:
- Error: `ValueError: password cannot be longer than 72 bytes`
- Cause: bcrypt 5.0.0+ has breaking changes incompatible with passlib
- Solution: Ensure bcrypt <5.0.0 is installed (see `backend/requirements.txt`)
- Fix: `pip install "bcrypt<5.0.0"` and restart backend server

---

## Documentation

Full documentation available in `specs/`:

- **Phase 1**: `specs/001-fullstack-web-app/`
- **Phase 2**: `specs/002-web-app/`

Each spec directory contains:
- `spec.md` - Requirements and user stories
- `plan.md` - Architecture and design decisions
- `tasks.md` - Detailed task breakdown
- `requirements.md` - Specification quality checklist

---

## License

This is a demonstration project for spec-driven development workflows.

---

## Credits

Built with:
- **Claude Code** - AI-powered development agent
- **Spec-Kit Plus** - Specification-driven workflow tools
- Modern web technologies (Next.js, FastAPI, PostgreSQL)
