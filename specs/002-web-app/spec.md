# Feature Specification: Multi-User Web Application (Phase 2)

**Feature ID**: 002-web-app
**Status**: Draft
**Created**: 2026-01-07
**Owner**: CW
**Priority**: P0 (Critical)

---

## Overview

Transform the existing single-user **console-based todo application** (Phase 1) into a **modern, multi-user web application** with persistent storage using a **spec-driven, agentic development workflow** powered by **Claude Code + Spec-Kit Plus**.

This is a complete architectural transformation that adds:
- Multi-user support with authentication
- Web-based user interface
- RESTful API backend
- Persistent cloud database storage
- Security and data isolation

**Key Constraint**: No manual coding is permitted. All implementation must be driven by Claude Code following the agentic development workflow.

---

## Target Audience

- Hackathon judges evaluating agentic development workflows
- Technical evaluators assessing AI-assisted development
- Engineering leads reviewing modern development practices

---

## Business Context

### Why This Feature?

This project demonstrates:
1. **Agentic Development at Scale**: Complex multi-stack transformation via AI
2. **Spec-Driven Workflow**: Complete implementation from specifications
3. **Modern Architecture**: Full-stack web application with best practices
4. **Security-First Design**: JWT authentication and user data isolation

### Success Metrics

**Process Quality (Primary)**:
- Clear specification → plan → tasks → implementation workflow
- High-quality prompts that drive autonomous implementation
- Minimal iterations and rework
- Traceable decisions via ADRs and PHRs

**Implementation Quality (Secondary)**:
- All 5 CRUD operations functional via web UI
- JWT authentication working end-to-end
- Data persistence in Neon PostgreSQL
- User isolation enforced at all layers

---

## Development Approach

### Agentic Dev Stack Workflow

```
1. Write Specification (this document)
   ↓
2. Generate Implementation Plan (via Claude Code)
   ↓
3. Break Plan into Atomic Tasks
   ↓
4. Sequential Implementation (Claude Code only)
   ↓
5. Validation & Testing
```

**Constraint**: Zero manual coding at any stage.

---

## Functional Requirements

### FR-001: User Authentication
**Priority**: P0
**Description**: Users must authenticate before accessing the application
**Acceptance**:
- Sign up with email/password
- Sign in with email/password
- JWT token issued on successful authentication
- Token stored securely in frontend
- Token sent with all API requests

### FR-002: Protected Routes
**Priority**: P0
**Description**: All task operations require valid authentication
**Acceptance**:
- Unauthenticated users redirected to /login
- Invalid JWT returns 401 Unauthorized
- Expired JWT requires re-authentication

### FR-003: Create Task (Web)
**Priority**: P1
**Description**: Authenticated users can create tasks via web interface
**Acceptance**:
- Form with title (required, max 200 chars)
- Form with description (optional, max 1000 chars)
- Success message on creation
- Redirect to task list
- Task appears immediately in user's list

### FR-004: View All Tasks (Web)
**Priority**: P1
**Description**: Authenticated users can view their tasks
**Acceptance**:
- List shows all tasks for current user only
- Each task displays: title, description, status, timestamps
- Empty state message when no tasks exist
- Responsive grid/list layout

### FR-005: Update Task (Web)
**Priority**: P2
**Description**: Users can edit task title and description
**Acceptance**:
- Pre-populated form with current values
- Update title and/or description
- Success message on save
- Changes reflected immediately
- Cannot edit other users' tasks (403 Forbidden)

### FR-006: Delete Task (Web)
**Priority**: P2
**Description**: Users can permanently delete tasks
**Acceptance**:
- Confirmation dialog before deletion
- Task removed from list immediately
- Success message displayed
- Cannot delete other users' tasks (403 Forbidden)

### FR-007: Toggle Task Completion (Web)
**Priority**: P2
**Description**: Users can mark tasks complete/incomplete
**Acceptance**:
- Single-click toggle (checkbox or button)
- Visual indicator for completed tasks
- Status persists across sessions
- Cannot toggle other users' tasks

### FR-008: User Data Isolation
**Priority**: P0
**Description**: Users cannot access other users' data
**Acceptance**:
- API queries filtered by authenticated user_id
- Direct URL manipulation blocked (e.g., /api/user123/tasks)
- Database queries scoped to current user
- Unauthorized access returns 403 Forbidden

### FR-009: Persistent Storage
**Priority**: P0
**Description**: All data persists in Neon PostgreSQL
**Acceptance**:
- Tasks survive server restarts
- Data accessible across devices
- Timestamps track creation/updates
- Foreign key relationships enforced

### FR-010: Responsive UI
**Priority**: P1
**Description**: Interface works on mobile and desktop
**Acceptance**:
- Mobile-first design (320px minimum)
- Readable typography and spacing
- Touch-friendly buttons (min 44px)
- Horizontal scrolling avoided

### FR-011: Loading States
**Priority**: P2
**Description**: User feedback during async operations
**Acceptance**:
- Loading spinners during API calls
- Disabled submit buttons during submission
- Skeleton screens for initial page load

### FR-012: Error Handling
**Priority**: P2
**Description**: Clear error messages for failures
**Acceptance**:
- Network errors display user-friendly messages
- Validation errors highlight specific fields
- Auth errors redirect to login
- 500 errors show generic fallback message

---

## User Stories

### User Story 1: Sign Up and Access Tasks (Priority: P0)

**As a** new user
**I want to** create an account
**So that** I can start managing my personal tasks

**Acceptance Criteria**:
1. Navigate to /signup → see registration form
2. Enter email "user@example.com" and password "SecurePass123!" → account created
3. Automatically signed in → redirected to /tasks
4. See empty state message: "No tasks yet. Create your first task!"

**Dependencies**: Better Auth integration, user table in DB

---

### User Story 2: Create and View Tasks (Priority: P1)

**As an** authenticated user
**I want to** create tasks via web form
**So that** I can track my to-dos online

**Acceptance Criteria**:
1. Click "New Task" button → navigate to /tasks/new
2. Enter title "Buy groceries" and description "Milk, eggs, bread" → submit
3. Redirected to /tasks → see task in list with incomplete status
4. Sign out and sign back in → task still visible

**Dependencies**: US1, tasks API endpoints, task form component

---

### User Story 3: Mark Tasks Complete (Priority: P2)

**As an** authenticated user
**I want to** toggle task completion status
**So that** I can track my progress

**Acceptance Criteria**:
1. View task list with incomplete task "Buy groceries"
2. Click checkbox/toggle → status changes to complete
3. Visual indicator appears (strikethrough or checkmark)
4. Click again → toggles back to incomplete
5. Status persists after page refresh

**Dependencies**: US2, PATCH /tasks/{id}/complete endpoint

---

### User Story 4: Update Task Content (Priority: P2)

**As an** authenticated user
**I want to** edit task details
**So that** I can correct mistakes or add information

**Acceptance Criteria**:
1. Click "Edit" on task "Buy groceries"
2. Form pre-populated with current title and description
3. Change title to "Buy groceries and toiletries"
4. Submit → success message → redirected to /tasks
5. Updated title visible in task list

**Dependencies**: US2, PUT /tasks/{id} endpoint, edit form component

---

### User Story 5: Delete Tasks (Priority: P2)

**As an** authenticated user
**I want to** permanently remove tasks
**So that** I can keep my list clean

**Acceptance Criteria**:
1. Click "Delete" on task "Buy groceries"
2. Confirmation dialog: "Are you sure? This cannot be undone."
3. Confirm → task removed from list
4. Success message: "Task deleted successfully"
5. Task no longer in database

**Dependencies**: US2, DELETE /tasks/{id} endpoint

---

### User Story 6: Data Isolation (Priority: P0)

**As a** security-conscious user
**I want my** tasks to be private
**So that** other users cannot see or modify my data

**Acceptance Criteria**:
1. User A creates task "Confidential project notes"
2. User B signs in → cannot see User A's task in list
3. User B attempts direct API call to User A's task → 403 Forbidden
4. User B attempts URL manipulation /api/userA/tasks → 403 Forbidden

**Dependencies**: US1, JWT verification, user_id scoping in all queries

---

## Technology Stack

### Frontend

| Component       | Technology             | Version | Rationale                             |
| --------------- | ---------------------- | ------- | ------------------------------------- |
| Framework       | Next.js                | 16+     | React with SSR, App Router            |
| Language        | TypeScript             | 5.x     | Type safety, better DX                |
| Styling         | Tailwind CSS           | 3.x     | Utility-first, rapid development      |
| Authentication  | Better Auth            | Latest  | Modern auth library with JWT support  |
| HTTP Client     | Fetch API              | Native  | Built-in, no extra dependencies       |
| State Mgmt      | React hooks            | Native  | Simple state, no global store needed  |
| Form Validation | Zod                    | 3.x     | Schema validation, TS integration     |
| UI Components   | Custom + Tailwind      | N/A     | Lightweight, no heavy component lib   |

### Backend

| Component      | Technology        | Version | Rationale                            |
| -------------- | ----------------- | ------- | ------------------------------------ |
| Framework      | FastAPI           | 0.115+  | Fast, async, OpenAPI auto-generation |
| Language       | Python            | 3.11+   | Matches Phase 1, excellent ecosystem |
| ORM            | SQLModel          | 0.0.22+ | Pydantic + SQLAlchemy, type-safe     |
| Database       | PostgreSQL        | 16+     | Relational, ACID, production-ready   |
| DB Hosting     | Neon Serverless   | Latest  | Serverless Postgres, auto-scaling    |
| Auth           | python-jose[jwt]  | 3.x     | JWT verification, shared secret      |
| Validation     | Pydantic          | 2.x     | Built into FastAPI/SQLModel          |
| CORS           | fastapi.middleware| Native  | Allow frontend origin                |
| Migration Tool | Alembic           | 1.x     | Schema migrations                    |

### Database Schema

**users** (managed by Better Auth):
```sql
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**tasks**:
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
```

---

## API Specification

### Authentication

All endpoints (except auth endpoints) require JWT:

```http
Authorization: Bearer <jwt_token>
```

**JWT Claims**:
```json
{
  "user_id": "uuid-string",
  "email": "user@example.com",
  "exp": 1234567890
}
```

### Endpoints

#### POST /api/auth/signup
**Description**: Register new user
**Auth**: None
**Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```
**Response 201**:
```json
{
  "user_id": "uuid",
  "email": "user@example.com",
  "token": "jwt.token.here"
}
```

#### POST /api/auth/login
**Description**: Authenticate user
**Auth**: None
**Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```
**Response 200**:
```json
{
  "user_id": "uuid",
  "email": "user@example.com",
  "token": "jwt.token.here"
}
```

#### GET /api/tasks
**Description**: List all tasks for authenticated user
**Auth**: Required (JWT)
**Query Params**: `?completed=true|false` (optional)
**Response 200**:
```json
{
  "tasks": [
    {
      "id": 1,
      "user_id": "uuid",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "completed": false,
      "created_at": "2026-01-07T10:00:00Z",
      "updated_at": "2026-01-07T10:00:00Z"
    }
  ],
  "total": 1
}
```

#### POST /api/tasks
**Description**: Create new task
**Auth**: Required (JWT)
**Body**:
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```
**Response 201**:
```json
{
  "id": 1,
  "user_id": "uuid",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2026-01-07T10:00:00Z",
  "updated_at": "2026-01-07T10:00:00Z"
}
```

#### GET /api/tasks/{id}
**Description**: Get task details
**Auth**: Required (JWT, must own task)
**Response 200**:
```json
{
  "id": 1,
  "user_id": "uuid",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2026-01-07T10:00:00Z",
  "updated_at": "2026-01-07T10:00:00Z"
}
```
**Response 403**: `{"detail": "Not authorized to access this task"}`

#### PUT /api/tasks/{id}
**Description**: Update task
**Auth**: Required (JWT, must own task)
**Body**:
```json
{
  "title": "Buy groceries and toiletries",
  "description": "Milk, eggs, bread, soap"
}
```
**Response 200**: Updated task object

#### DELETE /api/tasks/{id}
**Description**: Delete task
**Auth**: Required (JWT, must own task)
**Response 204**: No content

#### PATCH /api/tasks/{id}/complete
**Description**: Toggle task completion
**Auth**: Required (JWT, must own task)
**Response 200**:
```json
{
  "id": 1,
  "completed": true,
  "updated_at": "2026-01-07T11:00:00Z"
}
```

### Security Rules

1. **JWT Required**: All /api/tasks/* endpoints return 401 without valid JWT
2. **Ownership Check**: Operations on tasks return 403 if user_id in JWT ≠ task.user_id
3. **CORS**: Frontend origin must be whitelisted in backend CORS middleware
4. **SQL Injection**: Prevented by SQLModel parameterized queries
5. **XSS**: React/Next.js auto-escapes output

---

## Monorepo Structure

```
todo/
├── specs/
│   ├── 001-fullstack-web-app/    # Phase 1 (console app)
│   └── 002-web-app/               # Phase 2 (this spec)
│       ├── spec.md                # This file
│       ├── requirements.md        # Checklist
│       ├── plan.md                # Implementation plan (generated)
│       └── tasks.md               # Task breakdown (generated)
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── login/
│   │   ├── signup/
│   │   └── tasks/
│   ├── components/
│   │   ├── TaskList.tsx
│   │   ├── TaskItem.tsx
│   │   ├── TaskForm.tsx
│   │   ├── Navbar.tsx
│   │   └── AuthGuard.tsx
│   ├── lib/
│   │   ├── api.ts              # API client
│   │   ├── auth.ts             # Auth helpers
│   │   └── types.ts            # TypeScript types
│   ├── CLAUDE.md               # Frontend-specific rules
│   ├── package.json
│   └── tsconfig.json
├── backend/
│   ├── app/
│   │   ├── main.py             # FastAPI app
│   │   ├── models.py           # SQLModel models
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   └── tasks.py
│   │   ├── middleware/
│   │   │   └── auth.py         # JWT verification
│   │   └── database.py         # DB connection
│   ├── CLAUDE.md               # Backend-specific rules
│   ├── requirements.txt
│   └── alembic/                # Migrations
├── src/                        # Phase 1 console app (preserved)
├── CLAUDE.md                   # Root agent rules
├── README.md
└── .env.example
```

---

## Configuration

### Environment Variables

**Frontend (.env.local)**:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000
```

**Backend (.env)**:
```bash
DATABASE_URL=postgresql://user:pass@neon.tech/dbname
BETTER_AUTH_SECRET=your-secret-key-here
CORS_ORIGINS=http://localhost:3000
JWT_ALGORITHM=HS256
```

### Shared Secret

The `BETTER_AUTH_SECRET` **must be identical** in both frontend and backend for JWT verification to work.

---

## Non-Functional Requirements

### NFR-001: Performance
- Task list loads in < 2 seconds on 3G
- API responses < 500ms (p95)
- Database queries optimized with indexes

### NFR-002: Security
- Passwords hashed with bcrypt (cost factor 12)
- JWT tokens expire after 7 days
- HTTPS in production
- No sensitive data in frontend logs

### NFR-003: Scalability
- Neon auto-scales with connection pooling
- Stateless backend (horizontal scaling ready)
- Frontend served via Vercel edge network

### NFR-004: Maintainability
- TypeScript strict mode enabled
- Python type hints throughout
- Consistent code style (Prettier, Black)
- Comprehensive error logging

### NFR-005: Testability
- API endpoints testable with Postman/curl
- Frontend routes manually testable
- Database migrations reversible

---

## Out of Scope (Phase 2)

The following are explicitly **not included** in this phase:

- Real-time collaboration (WebSockets)
- Email verification
- Password reset flow
- Task sharing between users
- Task categories/tags
- Search and filtering
- Pagination (load all tasks for now)
- Automated tests (E2E, integration, unit)
- CI/CD pipelines
- Docker containerization
- Task due dates and reminders
- File attachments
- Rich text editing

---

## Migration from Phase 1

### Data Migration
**Not applicable** - Phase 1 used in-memory storage, no data to migrate.

### Code Reuse
- **Business logic**: Some validation logic may be adapted
- **UI patterns**: Console commands map to web forms/buttons
- **Documentation**: Spec-driven approach continues

---

## Risks and Mitigations

| Risk                              | Impact | Likelihood | Mitigation                                   |
| --------------------------------- | ------ | ---------- | -------------------------------------------- |
| JWT secret mismatch               | High   | Medium     | Environment variable validation at startup   |
| CORS misconfiguration             | High   | Medium     | Explicit origin whitelist in backend         |
| SQL injection                     | High   | Low        | Use SQLModel ORM (parameterized queries)     |
| Unauthorized data access          | High   | Medium     | User ID verification in every query          |
| Neon database connection failures | Medium | Low        | Connection pooling + retry logic             |
| Frontend/backend version drift    | Medium | Medium     | Shared type definitions (OpenAPI codegen)    |
| Large specification complexity    | Medium | High       | Break into small, testable user stories      |

---

## Success Criteria (Detailed)

### Process Success (Primary)

**SC-001**: Complete spec → plan → tasks → implementation workflow documented in PHRs
**SC-002**: All architectural decisions captured in ADRs with alternatives and rationale
**SC-003**: Each implementation step traceable to a task in tasks.md
**SC-004**: Minimal rework (< 10% of tasks marked as rework)

### Implementation Success (Secondary)

**SC-005**: All 5 CRUD operations functional via web UI
**SC-006**: JWT authentication working (signup, login, protected routes)
**SC-007**: User data isolation verified (cannot access other users' tasks)
**SC-008**: Data persists in Neon PostgreSQL across sessions
**SC-009**: Responsive UI works on mobile (tested at 320px, 768px, 1920px)
**SC-010**: Error handling provides actionable feedback

### Acceptance Test

**End-to-End Scenario**:
1. Sign up as User A with email
2. Create task "Confidential project"
3. Mark task complete
4. Sign up as User B (different browser/incognito)
5. Verify User B cannot see User A's task
6. User A updates task title
7. User A deletes task
8. Sign out and back in as User A → task still deleted

**Pass**: All steps complete successfully without errors or data leaks.

---

## Definition of Done

This feature is **complete** when:

- [ ] All 12 functional requirements (FR-001 to FR-012) implemented
- [ ] All 6 user stories (US1-US6) pass acceptance criteria
- [ ] JWT authentication working end-to-end
- [ ] User data isolation enforced at API and DB layers
- [ ] All API endpoints return correct status codes and data shapes
- [ ] Frontend UI responsive on mobile and desktop
- [ ] Data persists in Neon PostgreSQL
- [ ] Environment variables documented in .env.example
- [ ] README.md updated with setup and run instructions
- [ ] All PHRs and ADRs created and committed

---

## References

- [Phase 1 Specification](../001-fullstack-web-app/spec.md)
- [Better Auth Documentation](https://better-auth.com)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [SQLModel Documentation](https://sqlmodel.tiangolo.com)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Neon Serverless PostgreSQL](https://neon.tech)

---

**Document Version**: 1.0
**Last Updated**: 2026-01-07
**Status**: Ready for Planning Phase
