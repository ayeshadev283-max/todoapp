# Implementation Plan: Multi-User Web Application (Phase 2)

**Feature**: 002-web-app
**Status**: Planning
**Created**: 2026-01-07
**Planned By**: Claude Code Agent

---

## Executive Summary

This plan details the transformation of a single-user console todo application into a secure, multi-user web application with persistent storage. The implementation follows a **monorepo architecture** with separate frontend (Next.js) and backend (FastAPI) applications sharing a PostgreSQL database.

**Key Complexity**: This is a complete architectural transformation requiring coordination across three layers (frontend, backend, database) with JWT authentication spanning all layers.

**Estimated Implementation Phases**: 12 sequential phases with ~150-200 atomic tasks.

---

## Technical Context

### Existing System (Phase 1)

**Current State**:
- Single-user console application
- In-memory storage (Python dict)
- 5 CRUD operations via CLI
- No authentication or persistence
- ~500 LOC in Python

**Reusable Elements**:
- Validation logic (title, ID format)
- Business rules (task structure, completion status)
- Error message patterns
- User story acceptance criteria

### Target System (Phase 2)

**New Architecture**:
```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Next.js Frontend (Port 3000)                         │  │
│  │  - Better Auth (JWT generation)                       │  │
│  │  - React components (TaskList, TaskForm, etc.)       │  │
│  │  - Tailwind CSS styling                               │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          │ HTTP + JWT
                          ↓
┌─────────────────────────────────────────────────────────────┐
│              FastAPI Backend (Port 8000)                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  JWT Middleware (verify, extract user_id)            │  │
│  │  Routes: /api/auth/*, /api/tasks/*                   │  │
│  │  SQLModel ORM (type-safe queries)                    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          │ SQL
                          ↓
┌─────────────────────────────────────────────────────────────┐
│          Neon Serverless PostgreSQL                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  users (id, email, password_hash, timestamps)        │  │
│  │  tasks (id, user_id, title, description, completed)  │  │
│  │  Indexes: tasks.user_id, tasks.completed             │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Constitution Compliance Check

### Phase 1 Constitution (Console App)

**P1-I: Specification as Source of Truth** ✅
- Phase 2 spec.md created with 12 FRs, 6 user stories
- Requirements checklist 100% complete

**P1-II: Implementation Fidelity** ✅
- Will implement exactly per spec (validation in tasks.md)
- No deviation without spec update

**P1-III: Reproducibility** ✅
- Complete setup documentation planned (README.md)
- Environment variables in .env.example
- Docker-compose for local development

**P1-IV: Clean Code** ✅
- TypeScript strict mode (frontend)
- Python type hints (backend)
- PEP 8 compliance (backend)
- ESLint + Prettier (frontend)

**P1-V: Workflow Sequence** ✅
- Following spec → plan → tasks → implementation
- Currently in planning phase

### Phase 2 Additional Requirements

**Authentication Security**:
- JWT secret shared between frontend/backend
- Bcrypt password hashing (cost 12)
- Token expiration enforced

**User Isolation**:
- User ID extracted from JWT
- All queries filtered by user_id
- Ownership verification before mutations

**Multi-Layer Architecture**:
- Frontend handles presentation + auth UI
- Backend handles business logic + auth verification
- Database enforces constraints + relationships

**Status**: Constitution requirements met ✅

---

## Architecture Decisions

### AD-001: Monorepo vs Separate Repositories

**Decision**: Use monorepo structure with `/frontend` and `/backend` directories

**Rationale**:
- **Shared Specifications**: Both apps reference `/specs`
- **Coordinated Changes**: Auth changes require frontend + backend updates
- **Simplified Development**: Single git history, easier local dev
- **Better Auth Integration**: Shared secret managed at repo level

**Alternatives Considered**:
1. **Separate Repos**: More isolation but harder coordination
2. **Turborepo/Nx**: Overkill for 2 apps, added complexity

**Trade-offs**:
- ✅ Easier cross-stack changes
- ✅ Simplified CI/CD (single pipeline)
- ❌ Larger repo size
- ❌ Both apps deploy together (not independent)

**Impact**: Medium - affects folder structure, CI/CD, developer workflow

**Approval**: Recommended for this project size

---

### AD-002: Authentication Strategy (Better Auth vs Custom JWT)

**Decision**: Use Better Auth for frontend auth, custom JWT verification in backend

**Rationale**:
- **Better Auth**: Handles signup/signin UI, session management, JWT generation
- **Custom Backend**: Python FastAPI needs JWT verification only (no Better Auth equivalent)
- **Shared Secret**: Both use same `BETTER_AUTH_SECRET` environment variable
- **Stateless**: JWT allows independent frontend/backend scaling

**Alternatives Considered**:
1. **Full Custom Auth**: More control but reinventing wheel (password hashing, session management)
2. **OAuth (Google, GitHub)**: Cleaner UX but adds external dependency, out of scope
3. **Auth0 / Clerk**: Managed service but costs, vendor lock-in

**Trade-offs**:
- ✅ Better Auth handles complex frontend flows
- ✅ JWT verification simple in Python (python-jose)
- ❌ Two different libraries (Better Auth + python-jose)
- ❌ Shared secret must be synchronized

**Impact**: High - affects both frontend and backend architecture

**Approval**: Recommended per spec

---

### AD-003: ORM Choice (SQLModel vs SQLAlchemy vs Raw SQL)

**Decision**: Use SQLModel for backend database access

**Rationale**:
- **Type Safety**: SQLModel = Pydantic + SQLAlchemy, full TypeScript-like types
- **FastAPI Integration**: Built by same author, seamless Pydantic model reuse
- **Migration Support**: Works with Alembic (standard SQLAlchemy migrations)
- **Query Builder**: Prevents SQL injection via parameterized queries
- **Developer Experience**: Define models once, use for API + DB

**Alternatives Considered**:
1. **SQLAlchemy Directly**: More verbose, no Pydantic integration
2. **Raw SQL**: Faster but no type safety, manual SQL injection prevention
3. **Django ORM**: Wrong framework (FastAPI not Django)

**Trade-offs**:
- ✅ Excellent type safety
- ✅ Reduced boilerplate
- ✅ Automatic API schema generation
- ❌ Newer library (fewer resources than SQLAlchemy)
- ❌ Abstraction hides some SQL details

**Impact**: Medium - affects backend data layer

**Approval**: Recommended per spec

---

### AD-004: Database Hosting (Neon vs Supabase vs Railway vs Local)

**Decision**: Use Neon Serverless PostgreSQL

**Rationale**:
- **Serverless**: Auto-scaling, no server management
- **PostgreSQL**: Industry-standard relational DB
- **Free Tier**: Sufficient for hackathon/demo
- **Connection Pooling**: Built-in (important for FastAPI async)
- **Branching**: Database branches for testing (nice-to-have)

**Alternatives Considered**:
1. **Supabase**: More features (auth, realtime) but we only need raw Postgres
2. **Railway**: Good but Neon more specialized for Postgres
3. **Local PostgreSQL**: Harder for evaluators to reproduce

**Trade-offs**:
- ✅ Managed service (no ops)
- ✅ Generous free tier
- ✅ Fast cold starts
- ❌ Cloud dependency (not fully local)
- ❌ Potential latency (depends on region)

**Impact**: Low - swappable PostgreSQL provider

**Approval**: Recommended per spec

---

### AD-005: Migration Strategy (Alembic vs Manual SQL vs Prisma)

**Decision**: Use Alembic for database schema migrations

**Rationale**:
- **Standard Tool**: De facto for SQLAlchemy/SQLModel
- **Version Control**: Migrations tracked in git
- **Reversible**: Downgrade support
- **Auto-generation**: Can generate migrations from model changes
- **Production Ready**: Used in serious applications

**Alternatives Considered**:
1. **Manual SQL Scripts**: Simple but error-prone, no rollback
2. **Prisma Migrate**: Wrong stack (Node.js)
3. **Django Migrations**: Wrong framework

**Trade-offs**:
- ✅ Professional migration management
- ✅ Team-friendly (migrations in VCS)
- ❌ Learning curve for Alembic
- ❌ Extra setup step

**Impact**: Medium - affects database change workflow

**Approval**: Recommended per spec

---

### AD-006: Frontend Routing (App Router vs Pages Router)

**Decision**: Use Next.js App Router (app directory)

**Rationale**:
- **Latest Standard**: Next.js 13+ default
- **Server Components**: Better performance, reduced client JS
- **Layouts**: Shared UI (navbar) easier
- **Loading States**: Built-in loading.tsx, error.tsx
- **Future-Proof**: Pages Router in maintenance mode

**Alternatives Considered**:
1. **Pages Router**: Older, more examples but deprecated pattern
2. **React Router**: Wrong framework (not Next.js)

**Trade-offs**:
- ✅ Modern architecture
- ✅ Better performance
- ✅ Cleaner file structure
- ❌ Fewer Stack Overflow examples (newer)
- ❌ Different mental model from Pages Router

**Impact**: Medium - affects frontend file structure

**Approval**: Recommended per spec

---

### AD-007: State Management (React Hooks vs Zustand vs Redux)

**Decision**: Use React hooks (useState, useContext) only

**Rationale**:
- **Simplicity**: No global state needed for this app
- **Server State**: Task data fetched from API, not client state
- **Auth State**: Better Auth provides useSession hook
- **Minimal Complexity**: Avoid over-engineering

**Alternatives Considered**:
1. **Zustand**: Lightweight but unnecessary
2. **Redux Toolkit**: Overkill for simple CRUD
3. **Jotai/Recoil**: Trendy but adds dependency

**Trade-offs**:
- ✅ Zero extra dependencies
- ✅ Simple to understand
- ✅ Sufficient for task list
- ❌ May need refactor if complex state needed later
- ❌ Props drilling possible (mitigated by composition)

**Impact**: Low - affects frontend data flow

**Approval**: Recommended for MVP scope

---

### AD-008: API Client (Fetch vs Axios vs TanStack Query)

**Decision**: Use native Fetch API with custom wrapper

**Rationale**:
- **Built-in**: No extra dependency
- **Modern**: Supports async/await
- **JWT Injection**: Easy to wrap for Authorization header
- **Sufficient**: CRUD operations don't need advanced features

**Alternatives Considered**:
1. **Axios**: Popular but adds dependency, not much benefit here
2. **TanStack Query**: Excellent for caching but overkill
3. **SWR**: Good but re-fetching not needed for simple CRUD

**Trade-offs**:
- ✅ Zero dependencies
- ✅ Native browser API
- ✅ Easy JWT header injection
- ❌ No automatic retry/caching
- ❌ More verbose error handling

**Impact**: Low - affects frontend API calls

**Approval**: Recommended for MVP

---

### AD-009: Form Validation (Zod vs Yup vs React Hook Form)

**Decision**: Use Zod for schema validation

**Rationale**:
- **TypeScript-First**: Infer types from schemas
- **Composition**: Reusable schemas
- **Error Messages**: Customizable
- **Lightweight**: Smaller than Yup
- **Backend Parity**: Similar to Pydantic on backend

**Alternatives Considered**:
1. **Yup**: Similar but less TypeScript-friendly
2. **React Hook Form**: Library not schema (can use together)
3. **Manual Validation**: Error-prone, no type safety

**Trade-offs**:
- ✅ Excellent TypeScript support
- ✅ Clear error messages
- ✅ Reusable schemas
- ❌ Extra dependency
- ❌ Learning curve

**Impact**: Low - affects form components

**Approval**: Recommended per spec

---

### AD-010: CORS Configuration (Whitelist vs Allow-All)

**Decision**: Whitelist frontend origin explicitly

**Rationale**:
- **Security**: Prevents unauthorized origins
- **Environment-Specific**: Different origins for dev vs prod
- **Credential Support**: Required for JWT cookies (if used)

**Configuration**:
```python
# backend/.env
CORS_ORIGINS=http://localhost:3000,https://todo-app.vercel.app
```

**Alternatives Considered**:
1. **Allow All (**)**: Insecure, allows any site to call API
2. **Same-Origin**: Frontend and backend same domain (requires proxy)

**Trade-offs**:
- ✅ Secure
- ✅ Environment-aware
- ❌ Must configure for each environment
- ❌ Can cause issues if misconfigured

**Impact**: Medium - affects deployment and security

**Approval**: Required for security

---

## Implementation Phases

### Phase 1: Project Setup & Monorepo Structure (Foundation)

**Goal**: Initialize monorepo with frontend and backend scaffolding

**Tasks**:
1. Create `/frontend` directory with Next.js 16+ (App Router, TypeScript)
2. Create `/backend` directory with FastAPI project structure
3. Update root `.gitignore` for both Node and Python
4. Create `.env.example` with all required environment variables
5. Create docker-compose.yml for local PostgreSQL (development)
6. Update root README.md with setup instructions
7. Create frontend/CLAUDE.md with frontend-specific rules
8. Create backend/CLAUDE.md with backend-specific rules

**Validation**:
- `npm install` in frontend runs without errors
- `pip install -r requirements.txt` in backend succeeds
- docker-compose up starts local PostgreSQL
- Environment variables documented

**Dependencies**: None (starting point)

---

### Phase 2: Database Schema & Migrations (Data Layer)

**Goal**: Create PostgreSQL schema with Alembic migrations

**Tasks**:
1. Install Alembic in backend
2. Initialize Alembic configuration (alembic.ini)
3. Create SQLModel models: User, Task
4. Generate initial migration (create users table)
5. Generate migration for tasks table (with foreign key)
6. Create indexes migration (user_id, completed)
7. Test migrations against local PostgreSQL
8. Document migration commands in backend README

**Validation**:
- `alembic upgrade head` creates all tables
- `alembic downgrade base` drops all tables
- Foreign key constraints enforced
- Indexes created successfully

**Dependencies**: Phase 1 (database connection)

---

### Phase 3: Backend Authentication Setup (Auth Layer)

**Goal**: Implement JWT verification middleware and auth routes

**Tasks**:
1. Install python-jose[cryptography], passlib[bcrypt]
2. Create `backend/app/models.py` with User and Task models
3. Create `backend/app/auth.py` with JWT utilities (create_token, verify_token)
4. Create `backend/app/middleware/auth.py` JWT verification middleware
5. Create `backend/app/routes/auth.py` with POST /signup, /login
6. Hash passwords with bcrypt (cost factor 12)
7. Return JWT on successful signup/login
8. Test auth endpoints with curl/Postman

**Validation**:
- POST /signup creates user with hashed password
- POST /login returns JWT with user_id claim
- Invalid credentials return 401
- JWT includes exp claim (7 days)

**Dependencies**: Phase 2 (User model)

---

### Phase 4: Backend Task CRUD Endpoints (API Layer)

**Goal**: Implement all task API endpoints with JWT protection

**Tasks**:
1. Create `backend/app/routes/tasks.py`
2. Implement GET /api/tasks (list all user's tasks)
3. Implement POST /api/tasks (create task)
4. Implement GET /api/tasks/{id} (get task detail)
5. Implement PUT /api/tasks/{id} (update task)
6. Implement DELETE /api/tasks/{id} (delete task)
7. Implement PATCH /api/tasks/{id}/complete (toggle completion)
8. Add user_id filter to all queries (from JWT)
9. Add 403 Forbidden for ownership violations
10. Add CORS middleware with whitelisted origins

**Validation**:
- All endpoints require valid JWT (401 without)
- User can only access their own tasks (403 for others)
- Create/update validates title length (1-200 chars)
- Description limited to 1000 chars
- Timestamps (created_at, updated_at) automatic

**Dependencies**: Phase 3 (JWT middleware)

---

### Phase 5: Backend Testing & Documentation (Quality)

**Goal**: Validate API endpoints and document usage

**Tasks**:
1. Test signup flow manually
2. Test login flow manually
3. Test all CRUD endpoints with JWT
4. Test 401 responses (missing/invalid JWT)
5. Test 403 responses (wrong user_id)
6. Document all endpoints in backend/README.md
7. Create example curl commands
8. Verify error responses match spec

**Validation**:
- All acceptance criteria from spec pass
- Error messages clear and actionable
- README includes setup + usage

**Dependencies**: Phase 4 (all endpoints)

---

### Phase 6: Frontend Authentication UI (Auth Pages)

**Goal**: Implement signup and login pages with Better Auth

**Tasks**:
1. Install Better Auth and dependencies
2. Configure Better Auth (betterauth.config.ts)
3. Create AuthProvider wrapper component
4. Create app/login/page.tsx with email/password form
5. Create app/signup/page.tsx with registration form
6. Implement form validation with Zod
7. Call Better Auth signup/login methods
8. Store JWT in Better Auth session
9. Redirect to /tasks on successful auth
10. Show error messages for invalid credentials

**Validation**:
- Signup creates user and logs in
- Login with valid credentials succeeds
- Invalid credentials show error
- JWT stored in session
- Redirects work correctly

**Dependencies**: Phase 4 (backend auth endpoints)

---

### Phase 7: Frontend Task List UI (Main Feature)

**Goal**: Display tasks with create/update/delete/toggle functionality

**Tasks**:
1. Create components/TaskList.tsx (display tasks)
2. Create components/TaskItem.tsx (single task card)
3. Create components/TaskForm.tsx (create/edit form)
4. Create components/Navbar.tsx (with sign out)
5. Create lib/api.ts (API client with JWT injection)
6. Create app/tasks/page.tsx (task list page)
7. Create app/tasks/new/page.tsx (create task form)
8. Create app/tasks/[id]/page.tsx (edit task form)
9. Implement AuthGuard component (redirect if not logged in)
10. Add loading spinners during API calls

**Validation**:
- Task list displays all user's tasks
- Create form redirects to list on success
- Edit form pre-populates current values
- Delete shows confirmation dialog
- Toggle completion works immediately
- Unauthenticated users redirected to /login

**Dependencies**: Phase 6 (auth working)

---

### Phase 8: Frontend Responsive Design (UI/UX)

**Goal**: Ensure mobile-friendly design with Tailwind

**Tasks**:
1. Add Tailwind responsive classes (sm:, md:, lg:)
2. Test at 320px (mobile), 768px (tablet), 1920px (desktop)
3. Make buttons min 44px tall (touch-friendly)
4. Fix horizontal scrolling issues
5. Add skeleton loaders for initial page load
6. Improve error message visibility
7. Add success toast notifications
8. Verify form inputs work on mobile keyboards

**Validation**:
- All pages work at 320px minimum
- No horizontal scrolling
- Buttons easy to tap
- Loading states visible
- Error messages clear

**Dependencies**: Phase 7 (UI components)

---

### Phase 9: Integration & User Isolation Testing (Security)

**Goal**: Verify user data isolation end-to-end

**Tasks**:
1. Create two test users (User A, User B)
2. User A creates tasks
3. Verify User B cannot see User A's tasks in UI
4. Attempt direct API call from User B with User A's task ID → 403
5. Test JWT expiration (wait 7 days OR mock time)
6. Test invalid JWT handling
7. Test missing Authorization header
8. Document test scenarios

**Validation**:
- Complete data isolation verified
- All security tests pass
- No data leaks between users

**Dependencies**: Phase 8 (complete UI)

---

### Phase 10: Environment Configuration & Deployment Prep (DevOps)

**Goal**: Prepare for deployment with environment-specific configs

**Tasks**:
1. Document Neon PostgreSQL setup
2. Create production .env template
3. Configure CORS for production frontend URL
4. Test with production-like environment variables
5. Update README with deployment instructions
6. Create deployment checklist
7. Verify all secrets in .env not .gitignored files

**Validation**:
- Production config documented
- No secrets committed to git
- CORS configured for prod URL
- Database connection string format correct

**Dependencies**: Phase 9 (working application)

---

### Phase 11: Documentation & Code Quality (Polish)

**Goal**: Ensure code meets constitution standards

**Tasks**:
1. Add TypeScript strict type checking
2. Run ESLint and Prettier on frontend
3. Run Black and isort on backend
4. Add docstrings to all backend functions
5. Add JSDoc comments to complex frontend functions
6. Update root README.md with:
   - Project overview
   - Tech stack
   - Setup instructions (both frontend and backend)
   - Running locally
   - Environment variables
   - API documentation link
7. Create architecture diagram (ASCII or Mermaid)
8. Document common issues and troubleshooting

**Validation**:
- No TypeScript errors
- No ESLint errors
- Black passes on all Python files
- README complete and clear

**Dependencies**: Phase 10 (deployment ready)

---

### Phase 12: Final Validation & Acceptance Testing (QA)

**Goal**: Verify all functional requirements and user stories

**Tasks**:
1. Test User Story 1: Sign Up and Access Tasks
2. Test User Story 2: Create and View Tasks
3. Test User Story 3: Mark Tasks Complete
4. Test User Story 4: Update Task Content
5. Test User Story 5: Delete Tasks
6. Test User Story 6: Data Isolation
7. Verify all 12 functional requirements (FR-001 to FR-012)
8. Check all 10 success criteria (SC-001 to SC-010)
9. Run end-to-end acceptance test from spec
10. Create final validation report

**Validation**:
- All user stories pass
- All functional requirements met
- All success criteria achieved
- Acceptance test passes

**Dependencies**: Phase 11 (complete application)

---

## Risk Management

### Risk 1: JWT Secret Mismatch

**Likelihood**: High
**Impact**: Critical (auth completely broken)

**Mitigation**:
- Add startup validation in both frontend and backend
- Print warning if BETTER_AUTH_SECRET not set
- Document clearly in .env.example
- Test with curl including JWT verification

**Contingency**:
- If detected, stop startup with error message
- Cannot proceed without matching secrets

---

### Risk 2: CORS Misconfiguration

**Likelihood**: Medium
**Impact**: High (frontend cannot call backend)

**Mitigation**:
- Explicit origin whitelist in backend
- Test CORS with browser dev tools
- Document exact origins needed
- Use environment variable for flexibility

**Contingency**:
- If blocked, check browser console for CORS error
- Verify backend CORS_ORIGINS includes frontend URL
- Restart backend after changing CORS config

---

### Risk 3: Database Connection Failures

**Likelihood**: Low
**Impact**: High (no data persistence)

**Mitigation**:
- Connection pooling in SQLModel
- Retry logic with exponential backoff
- Health check endpoint (GET /health)
- Document Neon connection string format

**Contingency**:
- Fallback to local PostgreSQL for development
- Clear error messages if DB unreachable

---

### Risk 4: Better Auth vs Custom Backend Incompatibility

**Likelihood**: Medium
**Impact**: High (auth broken)

**Mitigation**:
- Use standard JWT format (HS256)
- Test JWT decoding with python-jose immediately
- Verify exp, user_id claims present
- Document JWT payload structure

**Contingency**:
- If incompatible, switch to custom JWT generation in frontend
- Document workaround in ADR

---

### Risk 5: Frontend/Backend Type Drift

**Likelihood**: Medium
**Impact**: Medium (API errors, type mismatches)

**Mitigation**:
- Define TypeScript interfaces matching backend models
- Use Zod schemas mirroring backend Pydantic
- Manual testing of each endpoint
- Consider OpenAPI codegen in future

**Contingency**:
- Manual type sync during implementation
- Document types in shared location

---

### Risk 6: Scope Creep (Advanced Features)

**Likelihood**: High
**Impact**: Medium (delayed completion)

**Mitigation**:
- Strict adherence to spec (FR-001 to FR-012 only)
- Out-of-scope items clearly documented
- Resist temptation for "nice-to-have" features
- Focus on 5 core CRUD operations + auth

**Contingency**:
- If detected, create backlog for Phase 3
- Complete MVP first, then iterate

---

## Testing Strategy

### Manual Testing Approach

**Unit Testing**: Not in scope per spec (manual only)

**Integration Testing**: Manual validation of:
- Auth flow (signup → login → JWT → API call)
- CRUD operations (create → read → update → delete)
- User isolation (User A cannot access User B's data)

**End-to-End Testing**: Acceptance test from spec:
1. Sign up as User A
2. Create task "Confidential project"
3. Mark complete
4. Sign up as User B (incognito)
5. Verify User B cannot see User A's task
6. User A updates task
7. User A deletes task
8. Sign out and back in → task still deleted

**Testing Tools**:
- Browser dev tools for frontend
- curl/Postman for backend API
- PostgreSQL client for database verification

---

## Dependencies & Prerequisites

### External Services

1. **Neon PostgreSQL**:
   - Free tier account
   - Database created
   - Connection string obtained

2. **Better Auth**:
   - NPM package installed
   - Configuration documented

### Development Environment

**Frontend**:
- Node.js 18+ (for Next.js 16)
- npm or yarn

**Backend**:
- Python 3.11+
- pip or poetry

**Database**:
- Docker (for local PostgreSQL)
- Or Neon account

---

## Timeline & Effort Estimate

**Estimated Total Tasks**: 150-200 atomic tasks

**Phases**:
1. Setup: 8 tasks (~2 hours)
2. Database: 8 tasks (~2 hours)
3. Backend Auth: 8 tasks (~3 hours)
4. Backend API: 10 tasks (~4 hours)
5. Backend Testing: 8 tasks (~2 hours)
6. Frontend Auth: 10 tasks (~4 hours)
7. Frontend UI: 10 tasks (~5 hours)
8. Frontend Responsive: 8 tasks (~3 hours)
9. Integration Testing: 8 tasks (~3 hours)
10. Deployment Prep: 7 tasks (~2 hours)
11. Documentation: 8 tasks (~3 hours)
12. Final Validation: 10 tasks (~3 hours)

**Total Estimated Effort**: ~36 hours (agentic implementation)

**Note**: This is autonomous AI implementation time, not human developer time.

---

## Success Criteria Validation

### Process Success (SC-001 to SC-004)

**SC-001**: Spec → Plan → Tasks → Implementation workflow
- ✅ Spec complete (002-web-app/spec.md)
- ✅ Plan complete (this document)
- 🔲 Tasks to be generated next
- 🔲 Implementation after tasks

**SC-002**: ADRs with alternatives and rationale
- ✅ 10 architecture decisions documented (AD-001 to AD-010)
- ✅ Alternatives considered for each
- ✅ Trade-offs analyzed

**SC-003**: Traceable implementation
- 🔲 Will be validated in tasks.md
- Each task will reference FR or US

**SC-004**: Minimal rework (< 10%)
- 🔲 To be measured during implementation

### Implementation Success (SC-005 to SC-010)

**SC-005**: All 5 CRUD operations functional
- 🔲 To be validated in Phase 12

**SC-006**: JWT authentication working
- 🔲 To be validated in Phase 9

**SC-007**: User isolation verified
- 🔲 To be validated in Phase 9

**SC-008**: Data persistence in Neon
- 🔲 To be validated in Phase 2, 12

**SC-009**: Responsive UI (320px-1920px)
- 🔲 To be validated in Phase 8

**SC-010**: Error handling with feedback
- 🔲 To be validated in Phase 7, 12

---

## Next Steps

1. **Review Plan**: Validate architecture decisions and phase sequence
2. **Run `/sp.tasks`**: Generate atomic task breakdown (150-200 tasks)
3. **Run `/sp.implement`**: Begin sequential implementation
4. **Document ADRs**: Create individual ADR files for key decisions
5. **Track PHRs**: Document each major step in prompt history

---

## Appendix: Technology Versions

| Technology | Version | Release Date |
|------------|---------|--------------|
| Next.js | 16.0+ | Dec 2024 |
| TypeScript | 5.x | Latest stable |
| Tailwind CSS | 3.x | Latest stable |
| FastAPI | 0.115+ | Latest stable |
| Python | 3.11+ | Oct 2022+ |
| SQLModel | 0.0.22+ | Latest stable |
| PostgreSQL | 16+ | Sep 2024 |
| Better Auth | Latest | Latest stable |
| Alembic | 1.x | Latest stable |

---

**Plan Version**: 1.0
**Status**: Ready for Task Breakdown
**Approval**: Pending user confirmation
