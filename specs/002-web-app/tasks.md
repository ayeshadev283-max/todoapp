# Task Breakdown: Multi-User Web Application (Phase 2)

**Feature**: 002-web-app
**Status**: Task Breakdown
**Created**: 2026-01-07
**Total Tasks**: 185 tasks across 12 phases

---

## Overview

This document breaks down the Phase 2 implementation into 185 atomic, testable tasks organized into 12 sequential phases. Each task includes:
- Sequential ID (T001-T185)
- Clear description
- Acceptance criteria
- Parallelizable marker [P] where applicable
- Dependencies on previous tasks

**Implementation Strategy**: Follow phases sequentially. Within each phase, tasks marked [P] can be worked in parallel after their dependencies are met.

---

## Progress Tracking

**Overall Progress**: 113/185 tasks complete (61.1%)

### Phase Completion

- [X] Phase 1: Project Setup (12 tasks) ✅ COMPLETE
- [X] Phase 2: Database Schema (15 tasks) ✅ COMPLETE
- [X] Phase 3: Backend Authentication (16 tasks) ✅ COMPLETE
- [X] Phase 4: Backend Task API (18 tasks) ✅ COMPLETE
- [X] Phase 5: Backend Testing (12 tasks) ✅ COMPLETE
- [X] Phase 6: Frontend Authentication (18 tasks) ✅ COMPLETE
- [X] Phase 7: Frontend Task UI (22 tasks) ✅ COMPLETE
- [ ] Phase 8: Responsive Design (15 tasks)
- [ ] Phase 9: Integration Testing (14 tasks)
- [ ] Phase 10: Deployment Prep (12 tasks)
- [ ] Phase 11: Documentation (16 tasks)
- [ ] Phase 12: Final Validation (16 tasks)

---

## Phase 1: Project Setup & Monorepo Structure

**Goal**: Initialize monorepo with frontend and backend scaffolding

**Dependencies**: None (starting point)

### Setup Tasks

- [x] T001 [P] Create `/frontend` directory
- [x] T002 Initialize Next.js 16+ in frontend with App Router, TypeScript, Tailwind CSS using `npx create-next-app@latest frontend --typescript --tailwind --app`
- [x] T003 [P] Create `/backend` directory
- [x] T004 Create FastAPI project structure in backend: `app/`, `app/__init__.py`, `app/main.py`
- [x] T005 Create backend requirements.txt with: fastapi, uvicorn, sqlmodel, python-jose[cryptography], passlib[bcrypt], python-multipart, psycopg2-binary, alembic
- [x] T006 Update root `.gitignore` to include: `node_modules/`, `__pycache__/`, `.env`, `.env.local`, `dist/`, `.next/`, `*.pyc`, `.venv/`, `venv/`
- [x] T007 Create `.env.example` at root with placeholders: `DATABASE_URL=`, `BETTER_AUTH_SECRET=`, `CORS_ORIGINS=`, `JWT_ALGORITHM=HS256`
- [x] T008 Create `docker-compose.yml` for local PostgreSQL (postgres:16, port 5432, POSTGRES_DB=todo_dev, volume for persistence)
- [x] T009 [P] Create `frontend/CLAUDE.md` with frontend-specific rules: TypeScript strict mode, ESLint, Prettier, component structure
- [x] T010 [P] Create `backend/CLAUDE.md` with backend-specific rules: Python 3.11+, type hints, Black formatter, PEP 8, max function length 50 lines
- [x] T011 Update root `README.md` with project overview, tech stack, monorepo structure, setup instructions placeholder
- [x] T012 Verify setup: run `npm install` in frontend, create backend venv and `pip install -r requirements.txt`, test `docker-compose up -d`

**Checkpoint**: Monorepo structure in place, dependencies installed, local PostgreSQL running

---

## Phase 2: Database Schema & Migrations

**Goal**: Create PostgreSQL schema with Alembic migrations

**Dependencies**: Phase 1 complete

### Database Model Tasks

- [x] T013 Install Alembic in backend: add to requirements.txt if missing, `pip install alembic`
- [x] T014 Initialize Alembic in backend: `alembic init alembic`, creates `alembic/` directory and `alembic.ini`
- [x] T015 Configure Alembic: update `alembic.ini` with `sqlalchemy.url` from environment variable
- [x] T016 Update `alembic/env.py` to import SQLModel metadata and read DATABASE_URL from os.environ
- [x] T017 Create `backend/app/database.py` with SQLModel engine, SessionLocal, get_db dependency function
- [x] T018 Create `backend/app/models.py` - define User model: id (String, PK), email (String, unique, indexed), password_hash (String), created_at (DateTime), updated_at (DateTime)
- [x] T019 Create Task model in models.py: id (Integer, PK, autoincrement), user_id (String, FK to users.id, indexed), title (String(200), not null), description (Text, nullable), completed (Boolean, default False), created_at (DateTime), updated_at (DateTime)
- [x] T020 Add SQLModel metadata import to alembic/env.py: `from app.models import User, Task` and `target_metadata = SQLModel.metadata`
- [x] T021 Generate initial Alembic migration: `alembic revision --autogenerate -m "Create users table"`
- [x] T022 Review and edit migration file: ensure users table creation with all columns, constraints, indexes
- [x] T023 Generate tasks table migration: `alembic revision --autogenerate -m "Create tasks table"` with foreign key to users(id) ON DELETE CASCADE
- [x] T024 Create manual migration for indexes: `alembic revision -m "Add task indexes"` - add index on tasks.user_id and tasks.completed
- [x] T025 Test migrations: `alembic upgrade head` against local PostgreSQL, verify tables created with `\dt` in psql
- [x] T026 Test migration rollback: `alembic downgrade -1` then `alembic upgrade head`, verify idempotency
- [x] T027 Document migration commands in `backend/README.md`: init, upgrade, downgrade, revision

**Checkpoint**: Database schema defined, migrations working, tables created in PostgreSQL

---

## Phase 3: Backend Authentication Setup

**Goal**: Implement JWT verification middleware and auth routes

**Dependencies**: Phase 2 complete (User model exists)

### Authentication Implementation Tasks

- [x] T028 Create `backend/app/auth.py` - implement `create_access_token(data: dict, expires_delta: timedelta)` function using python-jose
- [x] T029 Implement `verify_token(token: str)` in auth.py - decode JWT, extract payload, handle exceptions (ExpiredSignatureError, JWTError)
- [x] T030 Implement `get_password_hash(password: str)` in auth.py using passlib.hash.bcrypt with rounds=12
- [x] T031 Implement `verify_password(plain_password: str, hashed_password: str)` in auth.py using bcrypt.verify
- [x] T032 Create `backend/app/middleware/auth.py` - implement `get_current_user` dependency that extracts JWT from Authorization header
- [x] T033 In get_current_user: verify token, extract user_id from payload, return user_id; raise HTTPException 401 if invalid/missing token
- [x] T034 Create `backend/app/routes/auth.py` - import FastAPI router, define APIRouter with prefix="/api/auth"
- [x] T035 Implement POST `/api/auth/signup` endpoint: accept email + password, validate email format, check if user exists
- [x] T036 In signup endpoint: hash password with bcrypt, create User record, generate JWT with user_id and email claims, return {user_id, email, token}
- [x] T037 Implement POST `/api/auth/login` endpoint: accept email + password, query User by email
- [x] T038 In login endpoint: verify password with bcrypt, return 401 if invalid, generate JWT with 7-day expiration, return {user_id, email, token}
- [x] T039 Add auth router to main.py: `from app.routes.auth import router as auth_router` and `app.include_router(auth_router)`
- [x] T040 Create environment variable validation in main.py startup: check BETTER_AUTH_SECRET exists, print warning if missing
- [x] T041 Test signup with curl: `curl -X POST http://localhost:8000/api/auth/signup -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"SecurePass123!"}'`
- [x] T042 Test login with curl: verify JWT returned, decode with https://jwt.io to check user_id and exp claims
- [x] T043 Test invalid login: wrong password returns 401, non-existent email returns 401

**Checkpoint**: Authentication working, JWT generation and verification functional

---

## Phase 4: Backend Task CRUD Endpoints

**Goal**: Implement all task API endpoints with JWT protection

**Dependencies**: Phase 3 complete (JWT middleware working)

### Task API Implementation

- [x] T044 Create `backend/app/routes/tasks.py` - import APIRouter, define router with prefix="/api/tasks"
- [x] T045 Implement GET `/api/tasks` endpoint: require get_current_user dependency, query tasks filtered by user_id from JWT
- [x] T046 In GET /api/tasks: accept optional query param `completed: bool | None`, filter by completed if provided, return list of tasks + total count
- [x] T047 Implement POST `/api/tasks` endpoint: require auth, accept {title: str, description: str | None}, validate title length 1-200 chars
- [x] T048 In POST /api/tasks: validate description max 1000 chars if provided, create Task with user_id from JWT, return created task with 201 status
- [x] T049 Implement GET `/api/tasks/{id}` endpoint: require auth, query task by id AND user_id (ensure ownership)
- [x] T050 In GET /api/tasks/{id}: return 404 if task not found, return 403 if task.user_id != current_user_id, return task if authorized
- [x] T051 Implement PUT `/api/tasks/{id}` endpoint: require auth, accept {title: str | None, description: str | None}
- [x] T052 In PUT /api/tasks/{id}: verify ownership (403 if not), validate title/description lengths, update fields, set updated_at to now(), return updated task
- [x] T053 Implement DELETE `/api/tasks/{id}` endpoint: require auth, verify ownership (403 if not), delete task, return 204 No Content
- [x] T054 Implement PATCH `/api/tasks/{id}/complete` endpoint: require auth, verify ownership, toggle completed boolean, return updated task
- [x] T055 Add tasks router to main.py: `from app.routes.tasks import router as tasks_router` and `app.include_router(tasks_router)`
- [x] T056 Add CORS middleware to main.py: `from fastapi.middleware.cors import CORSMiddleware`, read CORS_ORIGINS from env, split by comma, add middleware with allow_origins list
- [x] T057 Configure CORS to allow credentials, methods=["*"], headers=["*"] (permissive for development, will restrict in production)
- [x] T058 Add Pydantic request/response models in routes/tasks.py: TaskCreate, TaskUpdate, TaskResponse, TaskList
- [x] T059 Add error handling for unique constraint violations (duplicate user email in signup): catch IntegrityError, return 400 with clear message
- [x] T060 Add validation for empty title in create/update: return 422 with field error if title is empty string or whitespace only
- [x] T061 Test all endpoints with curl including Authorization header: `curl -H "Authorization: Bearer <token>"` for each CRUD operation

**Checkpoint**: All Task CRUD endpoints functional, user isolation enforced, CORS configured

---

## Phase 5: Backend Testing & Documentation

**Goal**: Validate API endpoints and document usage

**Dependencies**: Phase 4 complete (all endpoints implemented)

### Backend Validation Tasks

- [x] T062 [P] Test signup flow: create user, verify hashed password in DB, verify JWT returned with correct claims
- [x] T063 [P] Test login flow: login with created user, verify JWT matches expected format, verify exp claim is 7 days from now
- [x] T064 [P] Test GET /api/tasks with empty list: new user should return {tasks: [], total: 0}
- [x] T065 [P] Test POST /api/tasks: create task, verify returned task has id, user_id, created_at, updated_at
- [x] T066 [P] Test GET /api/tasks returns created task in list
- [x] T067 [P] Test GET /api/tasks/{id} for owned task returns 200 with task data
- [x] T068 [P] Test PUT /api/tasks/{id} updates title and description, updated_at changes
- [x] T069 [P] Test PATCH /api/tasks/{id}/complete toggles completed from false to true, then back to false
- [x] T070 [P] Test DELETE /api/tasks/{id} removes task, subsequent GET returns 404
- [x] T071 Test 401 responses: call any /api/tasks/* endpoint without Authorization header, verify 401
- [x] T072 Test 403 responses: create task as User A, try to access/modify as User B with User B's JWT, verify 403 Forbidden
- [x] T073 Create `backend/README.md` with: project structure, setup instructions, environment variables, running server, API endpoints documentation, example curl commands

**Checkpoint**: All backend endpoints validated, error cases tested, documentation complete

---

## Phase 6: Frontend Authentication UI

**Goal**: Implement signup and login pages with Better Auth

**Dependencies**: Phase 5 complete (backend auth working)

### Frontend Auth Setup Tasks

- [x] T074 Install Better Auth: `npm install better-auth` in frontend directory
- [x] T075 Install Zod for validation: `npm install zod`
- [x] T076 Create `frontend/lib/auth.ts` - configure Better Auth client with baseURL pointing to backend (http://localhost:8000)
- [x] T077 Create `frontend/lib/api.ts` - implement `getAuthToken()` function to retrieve JWT from Better Auth session
- [x] T078 In api.ts: implement `apiFetch(endpoint, options)` wrapper around fetch that injects Authorization header with JWT
- [x] T079 Create `frontend/lib/types.ts` - define TypeScript interfaces: User {id, email}, Task {id, user_id, title, description, completed, created_at, updated_at}, LoginResponse, SignupResponse
- [x] T080 Create `frontend/lib/validation.ts` - define Zod schemas: loginSchema (email + password), signupSchema (email + password with min 8 chars), taskSchema (title 1-200, description optional max 1000)
- [x] T081 Create `frontend/app/layout.tsx` - wrap children with Better Auth provider, add global styles, add viewport meta for responsive
- [x] T082 Create `frontend/components/AuthGuard.tsx` - check if user authenticated with useSession from Better Auth, redirect to /login if not
- [x] T083 Create `frontend/app/login/page.tsx` - implement login form with email and password inputs
- [x] T084 In login page: use Zod to validate form inputs, show validation errors below fields, call backend POST /api/auth/login on submit
- [x] T085 In login page: store JWT in Better Auth session on success, redirect to /tasks, show error toast if login fails (401 or network error)
- [x] T086 Create `frontend/app/signup/page.tsx` - implement signup form similar to login (email, password, confirm password)
- [x] T087 In signup page: validate password match, call POST /api/auth/signup, store JWT on success, redirect to /tasks
- [x] T088 Add Tailwind styling to login/signup forms: centered card, rounded corners, shadow, button hover states, focus states on inputs
- [x] T089 Add loading state to forms: disable submit button and show spinner during API call
- [x] T090 Add link from login page to signup ("Don't have an account? Sign up") and vice versa
- [x] T091 Test signup flow in browser: create new user, verify redirect to /tasks, check JWT in Better Auth session storage (dev tools)

**Checkpoint**: Authentication UI complete, users can sign up and log in

---

## Phase 7: Frontend Task UI

**Goal**: Display tasks with create/update/delete/toggle functionality

**Dependencies**: Phase 6 complete (auth UI working)

### Task Components & Pages

- [x] T092 Create `frontend/components/Navbar.tsx` - display app name, user email, sign out button
- [x] T093 In Navbar: implement sign out function that clears Better Auth session and redirects to /login
- [x] T094 Create `frontend/components/TaskItem.tsx` - accept task prop, display title, description (if present), completed status, created_at
- [x] T095 In TaskItem: add checkbox for toggling completion, Edit button, Delete button with icons
- [x] T096 In TaskItem: implement handleToggle that calls PATCH /api/tasks/{id}/complete and updates local state
- [x] T097 In TaskItem: add delete confirmation dialog (native confirm() or custom modal) before calling DELETE endpoint
- [x] T098 Create `frontend/components/TaskList.tsx` - accept tasks array prop, map to TaskItem components
- [x] T099 In TaskList: show empty state message if tasks.length === 0: "No tasks yet. Create your first task!"
- [x] T100 In TaskList: add visual indicator for completed tasks (strikethrough title or checkmark icon)
- [x] T101 Create `frontend/components/TaskForm.tsx` - reusable form for create/edit with title and description inputs
- [x] T102 In TaskForm: accept optional initialValues prop {title, description} for edit mode, use Zod taskSchema for validation
- [x] T103 In TaskForm: accept onSubmit callback, show validation errors, disable submit during API call
- [x] T104 Create `frontend/app/tasks/page.tsx` - main task list page wrapped with AuthGuard
- [x] T105 In tasks page: fetch tasks on mount with GET /api/tasks using apiFetch, store in useState
- [x] T106 In tasks page: add loading skeleton while fetching (3-4 placeholder task cards)
- [x] T107 In tasks page: add "New Task" button that navigates to /tasks/new
- [x] T108 In tasks page: pass tasks to TaskList component, implement refetch function triggered after create/update/delete
- [x] T109 Create `frontend/app/tasks/new/page.tsx` - create task page with TaskForm
- [x] T110 In new task page: onSubmit calls POST /api/tasks with form data, redirect to /tasks on success, show error message on failure
- [x] T111 Create `frontend/app/tasks/[id]/page.tsx` - edit task page using dynamic route
- [x] T112 In edit task page: fetch task with GET /api/tasks/{id} on mount, show loading state, pass current values to TaskForm
- [x] T113 In edit task page: onSubmit calls PUT /api/tasks/{id}, redirect to /tasks on success, handle 404 if task not found

**Checkpoint**: All task CRUD operations functional via web UI

---

## Phase 8: Responsive Design

**Goal**: Ensure mobile-friendly design with Tailwind

**Dependencies**: Phase 7 complete (UI components built)

### Responsive UI Tasks

- [ ] T114 Add Tailwind responsive breakpoints to Navbar: hamburger menu icon on mobile (< 768px), full nav on desktop
- [ ] T115 Update TaskItem to be mobile-friendly: full width on mobile, grid layout on desktop (sm:grid-cols-2, lg:grid-cols-3)
- [ ] T116 Ensure TaskForm inputs are responsive: full width on mobile, reasonable max-width on desktop (max-w-xl)
- [ ] T117 Make buttons touch-friendly: min height 44px (min-h-11), padding py-3 px-4, sufficient spacing between buttons
- [ ] T118 Test all pages at 320px width (iPhone SE): verify no horizontal scrolling, all text readable, buttons accessible
- [ ] T119 Test at 768px width (iPad): verify task list uses grid layout, forms centered nicely
- [ ] T120 Test at 1920px width (desktop): verify content doesn't stretch too wide (use max-w-7xl container), centered layout
- [ ] T121 Add loading skeletons for task list: placeholder cards with animated shimmer effect while fetching
- [ ] T122 Improve loading state for forms: disable inputs during submit, show spinner in button
- [ ] T123 Add error boundaries: create ErrorBoundary component to catch render errors, display friendly message
- [ ] T124 Add toast notifications for success/error messages: use library like react-hot-toast or build custom Toast component
- [ ] T125 Improve task list empty state: add illustration or icon, friendly message, prominent "Create Task" button
- [ ] T126 Add focus styles for accessibility: ensure all interactive elements have visible focus ring (ring-2 ring-blue-500)
- [ ] T127 Test keyboard navigation: Tab through all forms and buttons, ensure logical order, Enter submits forms
- [ ] T128 Verify responsive typography: base text-sm on mobile (text-sm), text-base on desktop, headings scale appropriately

**Checkpoint**: UI works well on mobile, tablet, and desktop; good loading and error states

---

## Phase 9: Integration Testing

**Goal**: Verify user data isolation end-to-end

**Dependencies**: Phase 8 complete (responsive UI done)

### Security & Integration Tests

- [ ] T129 Create test user A: sign up with email "usera@example.com" in browser
- [ ] T130 As User A: create task "Confidential project notes" with description "Private information"
- [ ] T131 As User A: create second task "Personal task" and mark it complete
- [ ] T132 Open second browser or incognito window, sign up as User B: "userb@example.com"
- [ ] T133 As User B: verify task list is empty, cannot see User A's tasks in UI
- [ ] T134 As User B: manually construct API call to User A's task ID with User B's JWT, verify 403 Forbidden response
- [ ] T135 As User B: try to access /tasks/{userA_task_id} via browser URL manipulation, verify redirect or error
- [ ] T136 Test JWT expiration: modify JWT exp claim to past date using jwt.io, try API call, verify 401 Unauthorized
- [ ] T137 Test missing Authorization header: call API endpoint without header using curl, verify 401 response
- [ ] T138 Test invalid JWT signature: modify JWT payload manually, try API call, verify 401 response
- [ ] T139 Test CORS from different origin: use curl with Origin header from non-whitelisted domain, verify CORS error
- [ ] T140 As User A: update task, verify User B still cannot see it after refresh
- [ ] T141 As User A: delete task, verify it's gone from A's list and cannot be accessed by B
- [ ] T142 Document all security test results in `specs/002-web-app/security-test-report.md`

**Checkpoint**: User data isolation verified, all security tests pass

---

## Phase 10: Deployment Prep

**Goal**: Prepare for deployment with environment-specific configs

**Dependencies**: Phase 9 complete (security validated)

### Environment & Deployment Setup

- [ ] T143 Sign up for Neon PostgreSQL account, create new project, obtain connection string
- [ ] T144 Create production database on Neon: configure auto-scaling, note connection string format
- [ ] T145 Test Alembic migrations against Neon database: set DATABASE_URL to Neon, run `alembic upgrade head`, verify tables created
- [ ] T146 Create `.env.production.example` with production-ready values: DATABASE_URL pointing to Neon, CORS_ORIGINS with production frontend URL placeholder
- [ ] T147 Document Neon setup in root README: account creation, connection string format, migration steps
- [ ] T148 Configure CORS for production: update CORS_ORIGINS to include Vercel deployment URL (https://your-app.vercel.app)
- [ ] T149 Verify all secrets are in .env files and NOT in git: run `git status`, check .gitignore includes .env*
- [ ] T150 Create deployment checklist in README: environment variables to set, database migration command, build commands for frontend/backend
- [ ] T151 Document backend deployment: recommended platform (Railway, Render, Fly.io), Dockerfile creation optional
- [ ] T152 Document frontend deployment: Vercel setup, environment variables (NEXT_PUBLIC_API_URL, BETTER_AUTH_SECRET), build command
- [ ] T153 Test production-like environment locally: use Neon DATABASE_URL locally, verify app works end-to-end
- [ ] T154 Create health check endpoint in backend: GET /health returns 200 {status: "healthy", database: "connected"}, test with curl

**Checkpoint**: Deployment configuration documented, production database ready

---

## Phase 11: Documentation & Code Quality

**Goal**: Ensure code meets constitution standards

**Dependencies**: Phase 10 complete (deployment ready)

### Code Quality & Documentation

- [ ] T155 [P] Enable TypeScript strict mode in frontend tsconfig.json: "strict": true, fix any type errors
- [ ] T156 [P] Run ESLint on frontend: `npm run lint`, fix errors, configure rules in .eslintrc
- [ ] T157 [P] Run Prettier on frontend: `npm run format` or `npx prettier --write .`, ensure consistent formatting
- [ ] T158 [P] Run Black on backend: `black app/`, ensure all Python files formatted
- [ ] T159 [P] Run isort on backend: `isort app/`, organize imports alphabetically
- [ ] T160 [P] Add Python type hints to all backend functions: verify all functions have parameter and return types
- [ ] T161 [P] Add docstrings to all backend route handlers: Google-style docstrings with Args, Returns, Raises sections
- [ ] T162 [P] Add docstrings to auth.py functions: document JWT token structure, password hashing details
- [ ] T163 [P] Add JSDoc comments to complex frontend functions: TaskForm validation logic, apiFetch wrapper, auth utilities
- [ ] T164 Update root README.md with complete project overview: motivation, architecture diagram, tech stack table, features list
- [ ] T165 In root README: add Prerequisites section (Node 18+, Python 3.11+, Docker), Setup instructions (clone, install deps, create .env, run migrations, start servers)
- [ ] T166 In root README: add Usage section with screenshots or GIFs of signup, login, creating task, marking complete
- [ ] T167 In root README: add API Documentation section linking to backend README or inline endpoint docs
- [ ] T168 In root README: add Troubleshooting section with common issues (CORS errors, JWT secret mismatch, database connection failures)
- [ ] T169 Create architecture diagram using ASCII art or Mermaid.js: show browser → Next.js → FastAPI → PostgreSQL flow
- [ ] T170 Verify all constitution standards met: specification approved (✅), implementation fidelity (to be validated), reproducibility (README complete), clean code (linting passed), workflow sequence (spec → plan → tasks → implement)

**Checkpoint**: Code quality high, documentation complete, README comprehensive

---

## Phase 12: Final Validation & Acceptance Testing

**Goal**: Verify all functional requirements and user stories

**Dependencies**: Phase 11 complete (documentation done)

### Acceptance Testing

- [ ] T171 Test User Story 1 (Sign Up and Access Tasks): navigate to /signup, create account, verify redirect to /tasks, see empty state
- [ ] T172 Test User Story 2 (Create and View Tasks): click New Task, enter "Buy groceries" + description, submit, verify appears in list
- [ ] T173 Test User Story 2 persistence: sign out, sign back in, verify task still exists
- [ ] T174 Test User Story 3 (Mark Tasks Complete): toggle checkbox on task, verify visual change (strikethrough or checkmark), refresh page, verify still complete
- [ ] T175 Test User Story 3 toggle back: click checkbox again, verify incomplete, refresh to confirm
- [ ] T176 Test User Story 4 (Update Task Content): click Edit on task, change title to "Buy groceries and toiletries", submit, verify updated in list
- [ ] T177 Test User Story 5 (Delete Tasks): click Delete on task, confirm dialog, verify removed from list immediately
- [ ] T178 Test User Story 6 (Data Isolation): create task as User A, sign in as User B (different browser), verify User B cannot see User A's task
- [ ] T179 Verify FR-001 (User Authentication): signup and login flows work, JWT issued
- [ ] T180 Verify FR-002 (Protected Routes): unauthenticated access to /tasks redirects to /login
- [ ] T181 Verify FR-003 to FR-007 (CRUD operations): all create, read, update, delete, toggle operations functional via web UI
- [ ] T182 Verify FR-008 (User Data Isolation): cross-user access returns 403, no data leaks
- [ ] T183 Verify FR-009 (Persistent Storage): data survives server restart, stored in Neon PostgreSQL
- [ ] T184 Verify FR-010 to FR-012 (Responsive UI, Loading, Errors): test on mobile/desktop, loading states visible, error messages clear
- [ ] T185 Run end-to-end acceptance test from spec: complete signup → create → complete → update → delete workflow, verify all steps succeed

**Checkpoint**: All functional requirements met, all user stories pass, Phase 2 complete

---

## Dependencies & Execution Order

### Critical Path

1. **Phase 1 → Phase 2**: Must have database before models
2. **Phase 2 → Phase 3**: User model required for authentication
3. **Phase 3 → Phase 4**: JWT middleware required for protected endpoints
4. **Phase 4 → Phase 5**: All endpoints must exist before testing
5. **Phase 5 → Phase 6**: Backend must work before frontend auth
6. **Phase 6 → Phase 7**: Auth must work before task UI
7. **Phase 7 → Phase 8**: UI must exist before responsive design
8. **Phase 8 → Phase 9**: Complete UI required for integration tests
9. **Phase 9 → Phase 10**: Security validated before deployment prep
10. **Phase 10 → Phase 11**: Deployment ready before documentation
11. **Phase 11 → Phase 12**: Documentation complete before final validation

### Parallelizable Tasks Within Phases

Tasks marked [P] can be worked simultaneously after their dependencies:
- Phase 1: T001, T003, T009, T010 can run in parallel after directory structure
- Phase 5: All testing tasks (T062-T072) can run in parallel
- Phase 11: All code quality tasks (T155-T163) can run in parallel

---

## Task Acceptance Criteria

Each task must meet these standards before marking complete:

1. **Functional**: Feature works as described
2. **Tested**: Manually validated (curl for backend, browser for frontend)
3. **Typed**: TypeScript types or Python hints present
4. **Documented**: Non-obvious code has comments
5. **Committed**: Changes committed to git with clear message referencing task ID (e.g., "T042: Test invalid login returns 401")

---

## Risk Mitigation During Implementation

### High-Risk Tasks

**T028-T031 (JWT implementation)**: Test thoroughly with jwt.io, verify exp claim
**T056-T057 (CORS)**: Test with browser dev tools Network tab, verify preflight requests
**T074-T078 (Better Auth setup)**: Follow documentation exactly, verify JWT format matches backend
**T133-T141 (Security testing)**: Document all test cases and results

### Rollback Strategy

If a task fails or causes issues:
1. Check git history: `git log --oneline`
2. Revert problematic commit: `git revert <commit-hash>`
3. Review task acceptance criteria
4. Re-implement with corrected approach
5. Document lesson learned in PHR

---

## Progress Reporting

After each task completion:
1. Mark task as complete: `- [x] T001 ...`
2. Update phase completion percentage
3. Commit changes: `git commit -m "T001: Create frontend directory - COMPLETE"`
4. If task reveals new subtasks, add them with IDs T186+

---

## Next Steps

1. **Review Task Breakdown**: Validate task sequence and acceptance criteria
2. **Run `/sp.implement`**: Begin sequential implementation starting with Phase 1
3. **Track Progress**: Update this file as tasks complete
4. **Create PHR**: Document implementation progress in prompt history records

---

**Task Breakdown Version**: 1.0
**Status**: Ready for Implementation
**Estimated Completion**: 185 tasks * ~15 min average = ~46 hours AI implementation time
