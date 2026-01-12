---
title: Todo API Backend
emoji: ✅
colorFrom: purple
colorTo: pink
sdk: docker
pinned: false
license: mit
---

# Backend - FastAPI Todo Application

Multi-user todo application backend built with FastAPI, SQLModel, and PostgreSQL.

## Tech Stack

- **FastAPI** 0.115+ - Modern Python web framework
- **SQLModel** 0.0.22+ - Type-safe ORM (Pydantic + SQLAlchemy)
- **PostgreSQL** 16+ - Relational database
- **Alembic** 1.13+ - Database migrations
- **python-jose** - JWT token generation/verification
- **passlib** - Password hashing with bcrypt
- **uvicorn** - ASGI server

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── database.py          # Database connection and session
│   ├── models.py            # SQLModel database models (User, Task)
│   ├── auth.py              # JWT and password utilities (Phase 3)
│   ├── routes/              # API route handlers
│   │   ├── auth.py          # Authentication endpoints (Phase 3)
│   │   └── tasks.py         # Task CRUD endpoints (Phase 4)
│   └── middleware/          # Custom middleware
│       └── auth.py          # JWT verification middleware (Phase 3)
├── alembic/                 # Database migrations
│   ├── versions/            # Migration files
│   │   ├── 001_create_users_table.py
│   │   ├── 002_create_tasks_table.py
│   │   └── 003_add_task_indexes.py
│   └── env.py               # Alembic configuration
├── alembic.ini              # Alembic settings
├── requirements.txt         # Python dependencies
└── test_migrations.sh       # Migration testing script
```

## Setup Instructions

### 1. Prerequisites

- Python 3.11+
- PostgreSQL 16+ (or use docker-compose from repo root)
- pip or poetry

### 2. Start PostgreSQL

From the repository root:

```bash
docker-compose up -d
```

This starts PostgreSQL on `localhost:5432` with:
- Database: `todo_dev`
- User: `todo_user`
- Password: `todo_password`

### 3. Create Virtual Environment

```bash
cd backend
python -m venv venv

# Activate (Linux/macOS)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Configure Environment Variables

Create `.env` file in `backend/` directory:

```bash
# Database connection
DATABASE_URL=postgresql://todo_user:todo_password@localhost:5432/todo_dev

# Authentication (must match frontend)
BETTER_AUTH_SECRET=your-secret-key-at-least-32-characters-long

# CORS (comma-separated origins)
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# JWT configuration
JWT_ALGORITHM=HS256
JWT_EXPIRATION_DAYS=7
```

### 6. Run Database Migrations

```bash
# Apply all migrations
alembic upgrade head

# Verify tables created
docker exec -it todo_postgres_dev psql -U todo_user -d todo_dev -c "\dt"
```

### 7. Start FastAPI Server

```bash
# Development mode with auto-reload
uvicorn app.main:app --reload

# Production mode
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Server runs at `http://localhost:8000`

## Database Migrations (Alembic)

### Common Commands

```bash
# Check current migration version
alembic current

# Apply all migrations (upgrade to latest)
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# Rollback to specific version
alembic downgrade 001_users

# Rollback all migrations
alembic downgrade base

# Show migration history
alembic history

# Show migration history with details
alembic history --verbose
```

### Creating New Migrations

**Auto-generate from model changes:**
```bash
alembic revision --autogenerate -m "Description of changes"
```

**Manual migration:**
```bash
alembic revision -m "Description of changes"
```

**Review the generated migration file** in `alembic/versions/` before applying!

### Migration Testing

Run the included test script:

```bash
chmod +x test_migrations.sh
./test_migrations.sh
```

This tests:
1. Current migration status
2. Upgrade to head
3. Table verification
4. Downgrade functionality
5. Re-upgrade to head
6. Migration history

### Existing Migrations

1. **001_create_users_table.py**
   - Creates `users` table
   - Columns: id, email (unique, indexed), password_hash, timestamps
   - Primary key on id

2. **002_create_tasks_table.py**
   - Creates `tasks` table
   - Columns: id (auto-increment), user_id (FK), title, description, completed, timestamps
   - Foreign key to users.id with ON DELETE CASCADE

3. **003_add_task_indexes.py**
   - Index on `tasks.user_id` (for filtering by user)
   - Index on `tasks.completed` (for filtering by status)
   - Composite index on `(user_id, completed)` (for common queries)

## Database Models

### User Model

```python
class User(SQLModel, table=True):
    id: str                    # Primary key (UUID from Better Auth)
    email: str                 # Unique, indexed
    password_hash: str         # Bcrypt hashed password
    created_at: datetime
    updated_at: datetime
```

### Task Model

```python
class Task(SQLModel, table=True):
    id: Optional[int]          # Auto-increment primary key
    user_id: str               # Foreign key to users.id
    title: str                 # Max 200 characters
    description: Optional[str] # Text field, nullable
    completed: bool            # Default False
    created_at: datetime
    updated_at: datetime
```

## API Documentation

### Health Check

**GET /**
```json
{
  "message": "Todo API v2.0",
  "status": "healthy"
}
```

**GET /health**
```json
{
  "status": "healthy",
  "database": "not_configured"
}
```

### Authentication Endpoints (Phase 3)

**POST /api/auth/signup**
- Register new user
- Body: `{ "email": "user@example.com", "password": "SecurePass123!" }`
- Returns: `{ "user_id": "uuid", "email": "user@example.com", "token": "jwt.token.here" }`

**POST /api/auth/login**
- Authenticate existing user
- Body: `{ "email": "user@example.com", "password": "SecurePass123!" }`
- Returns: `{ "user_id": "uuid", "email": "user@example.com", "token": "jwt.token.here" }`

### Task Endpoints (Phase 4)

All task endpoints require JWT authentication via `Authorization: Bearer <token>` header.

**GET /api/tasks**
- List all tasks for authenticated user
- Query params: `?completed=true|false` (optional)
- Returns: `{ "tasks": [...], "total": 10 }`

**POST /api/tasks**
- Create new task
- Body: `{ "title": "Task title", "description": "Optional description" }`
- Returns: Created task object

**GET /api/tasks/{id}**
- Get single task by ID
- Returns: Task object or 404

**PUT /api/tasks/{id}**
- Update task title and/or description
- Body: `{ "title": "New title", "description": "New description" }`
- Returns: Updated task object

**DELETE /api/tasks/{id}**
- Delete task permanently
- Returns: 204 No Content

**PATCH /api/tasks/{id}/complete**
- Toggle task completion status
- Returns: Updated task object

### Error Responses

- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Missing or invalid JWT token
- **403 Forbidden**: Valid JWT but not authorized for this resource
- **404 Not Found**: Resource does not exist
- **422 Unprocessable Entity**: Validation error
- **500 Internal Server Error**: Server error

## Example Usage (curl)

### Complete Authentication Flow

**1. Sign up a new user:**
```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"SecurePass123"}'
```

Response:
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "alice@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**2. Login with existing user:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"SecurePass123"}'
```

**3. Save the token for subsequent requests:**
```bash
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Task CRUD Operations

**1. Create a task:**
```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Buy groceries","description":"Milk, eggs, bread"}'
```

Response:
```json
{
  "id": 1,
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2026-01-10T12:00:00Z",
  "updated_at": "2026-01-10T12:00:00Z"
}
```

**2. List all tasks:**
```bash
curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN"
```

**3. List only completed tasks:**
```bash
curl -X GET "http://localhost:8000/api/tasks?completed=true" \
  -H "Authorization: Bearer $TOKEN"
```

**4. Get a specific task:**
```bash
curl -X GET http://localhost:8000/api/tasks/1 \
  -H "Authorization: Bearer $TOKEN"
```

**5. Update a task:**
```bash
curl -X PUT http://localhost:8000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Buy groceries and toiletries","description":"Milk, eggs, bread, soap"}'
```

**6. Toggle task completion:**
```bash
curl -X PATCH http://localhost:8000/api/tasks/1/complete \
  -H "Authorization: Bearer $TOKEN"
```

**7. Delete a task:**
```bash
curl -X DELETE http://localhost:8000/api/tasks/1 \
  -H "Authorization: Bearer $TOKEN"
```

### Testing Error Cases

**1. Test 401 Unauthorized (missing token):**
```bash
curl -X GET http://localhost:8000/api/tasks
# Expected: {"detail":"Not authenticated"}
```

**2. Test 401 Unauthorized (invalid token):**
```bash
curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer invalid-token-here"
# Expected: {"detail":"Invalid or expired token"}
```

**3. Test 403 Forbidden (access another user's task):**
```bash
# Sign up second user
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"bob@example.com","password":"SecurePass456"}'

# Try to access Alice's task with Bob's token
curl -X GET http://localhost:8000/api/tasks/1 \
  -H "Authorization: Bearer $BOB_TOKEN"
# Expected: {"detail":"Not authorized to access this task"}
```

**4. Test 404 Not Found:**
```bash
curl -X GET http://localhost:8000/api/tasks/99999 \
  -H "Authorization: Bearer $TOKEN"
# Expected: {"detail":"Task not found"}
```

**5. Test 422 Validation Error (empty title):**
```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"","description":"Invalid task"}'
# Expected: Validation error
```

**6. Test 422 Validation Error (title too long):**
```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"title\":\"$(python -c 'print(\"a\" * 201)')\",\"description\":\"Too long\"}"
# Expected: {"detail":[{"loc":["body","title"],"msg":"Title must be 200 characters or less"}]}
```

## Development

### Running Tests

```bash
# Phase 2: Test database migrations
./test_migrations.sh

# Phase 5: Manual API testing with curl (see "Example Usage" section above)
curl http://localhost:8000/
curl http://localhost:8000/health
```

### Code Quality

```bash
# Format code with Black
black app/

# Sort imports with isort
isort app/

# Type checking with mypy
mypy app/

# Linting with ruff
ruff check app/
```

### Interactive API Documentation

FastAPI auto-generates interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## Troubleshooting

### Database Connection Failed

**Error**: `OperationalError: could not connect to server`

**Solution**:
1. Verify PostgreSQL is running: `docker-compose ps`
2. Check DATABASE_URL format: `postgresql://user:password@host:port/database`
3. Test connection: `psql $DATABASE_URL -c "SELECT 1"`

### Migration Failed

**Error**: `Target database is not up to date`

**Solution**:
```bash
alembic upgrade head
```

**Error**: `Can't locate revision identified by '...'`

**Solution**:
```bash
# Reset to base and re-apply
alembic downgrade base
alembic upgrade head
```

### Module Not Found

**Error**: `ModuleNotFoundError: No module named 'app'`

**Solution**:
1. Ensure virtual environment is activated
2. Install dependencies: `pip install -r requirements.txt`
3. Run from backend directory: `cd backend && uvicorn app.main:app --reload`

### CORS Errors

**Error**: Browser console shows CORS policy blocked

**Solution**:
1. Verify `CORS_ORIGINS` in `.env` includes frontend URL
2. Restart FastAPI server after changing CORS config

## Security Notes

- **Never commit `.env` files** - use `.env.example` as template
- **Password hashing**: Uses bcrypt with cost factor 12
- **JWT expiration**: Tokens expire after 7 days by default
- **User isolation**: All queries filtered by user_id from JWT
- **SQL injection prevention**: SQLModel uses parameterized queries

## Implementation Status

- ✅ **Phase 1**: Project setup and monorepo structure (COMPLETE)
- ✅ **Phase 2**: Database schema and migrations (COMPLETE)
- ✅ **Phase 3**: Backend authentication with JWT and bcrypt (COMPLETE)
- ✅ **Phase 4**: Task CRUD API endpoints (COMPLETE)
- ✅ **Phase 5**: Backend testing and documentation (COMPLETE)
- ⏳ **Phase 6**: Frontend authentication UI with Better Auth (PENDING)
- ⏳ **Phase 7**: Frontend task UI components (PENDING)
- ⏳ **Phase 8-12**: Responsive design, testing, deployment (PENDING)

## License

Part of the spec-driven development demonstration project.
