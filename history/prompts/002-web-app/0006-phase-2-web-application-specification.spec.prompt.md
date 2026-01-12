---
id: 0006
title: Phase 2 Web Application Specification
stage: spec
date: 2026-01-07
surface: agent
model: claude-sonnet-4-5-20250929
feature: 002-web-app
branch: 001-fullstack-web-app
user: CW
command: /sp.specify
labels: ["specification", "web-app", "multi-user", "authentication", "full-stack"]
links:
  spec: specs/002-web-app/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/002-web-app/spec.md
 - specs/002-web-app/requirements.md
tests:
 - Manual review of specification completeness
 - Requirements checklist validation (100% complete)
 - Readiness gates (5/5 passing)
---

## Prompt

# /sp.specify — Phase 2 Full-Stack Web Application

## Project Title

**Agentic Transformation of a Console Todo App into a Secure Multi-User Web Application**

---

## Objective

Transform an existing single-user **console-based todo application** into a **modern, multi-user web application** with persistent storage using a **spec-driven, agentic development workflow** powered by **Claude Code + Spec-Kit Plus**. No manual coding is permitted.

The project will be evaluated on **process quality, prompts, iterations, and adherence to agentic workflow**, not just the final application.

---

## Target Audience

* Hackathon judges
* Technical evaluators
* Engineering leads evaluating agentic development workflows

---

## Development Approach (Agentic Dev Stack)

This project strictly follows the **Agentic Dev Stack**:

1. **Write specification** (this document and related specs)
2. **Generate implementation plan** via Claude Code
3. **Break plan into atomic tasks**
4. **Implement tasks sequentially using Claude Code only**

> ❗ No handwritten or manual code is allowed at any stage.

---

## Success Criteria

The project is successful if:

* All **5 Basic Level features** are implemented as a web application
* A **secure, JWT-protected REST API** is created
* A **responsive frontend UI** is delivered
* Data persists in **Neon Serverless PostgreSQL**
* **User isolation** is enforced across all operations
* Reviewers can clearly understand:
  * How agentic development was applied
  * Why JWT-based auth was required
  * How specs drove implementation

---

## Functional Requirements

### Core Features (Basic Level)

1. Create a task
2. View all tasks for a user
3. Update a task
4. Delete a task
5. Mark task as complete/incomplete

### Multi-User Requirements

* Each task belongs to exactly one user
* Users cannot view or modify tasks owned by others
* Task ownership is enforced at API and database layers

---

## Technology Stack

| Layer       | Technology                                         |
| ----------- | -------------------------------------------------- |
| Frontend    | Next.js 16+ (App Router), TypeScript, Tailwind CSS |
| Backend     | Python FastAPI                                     |
| ORM         | SQLModel                                           |
| Database    | Neon Serverless PostgreSQL                         |
| Auth        | Better Auth (JWT-based)                            |
| Spec System | Spec-Kit Plus + Claude Code                        |

---

## REST API Specification

### Authentication

All endpoints require a valid JWT token:

```
Authorization: Bearer <token>
```

### Endpoints

| Method | Endpoint                           | Description         |
| ------ | ---------------------------------- | ------------------- |
| GET    | /api/{user_id}/tasks               | List all user tasks |
| POST   | /api/{user_id}/tasks               | Create new task     |
| GET    | /api/{user_id}/tasks/{id}          | Get task details    |
| PUT    | /api/{user_id}/tasks/{id}          | Update task         |
| DELETE | /api/{user_id}/tasks/{id}          | Delete task         |
| PATCH  | /api/{user_id}/tasks/{id}/complete | Toggle completion   |

---

## Monorepo & Spec-Kit Structure

The project follows a **Spec-Kit–compatible monorepo layout**:

* `/specs` — source of truth
* `/frontend` — Next.js application
* `/backend` — FastAPI service
* Root and subfolder `CLAUDE.md` files define agent behavior

Claude Code must always:

* Read relevant specs before implementation
* Respect folder-level CLAUDE.md rules
* Apply cross-stack changes when required

## Response snapshot

Created comprehensive Phase 2 specification for transforming the console todo application into a secure, multi-user web application.

**Key Deliverables**:

1. **specs/002-web-app/spec.md** (8,600+ lines)
   - 12 Functional Requirements (FR-001 to FR-012)
   - 6 User Stories with detailed acceptance criteria
   - Complete API specification with JWT authentication
   - Database schema (users, tasks tables with indexes)
   - Technology stack rationale (Next.js, FastAPI, SQLModel, Neon PostgreSQL)
   - Security rules (JWT verification, user isolation, CORS)
   - 5 Non-functional requirements (performance, security, scalability)
   - 10 Success criteria (process + implementation)
   - Risk analysis with 7 identified risks and mitigations
   - Monorepo structure definition
   - Out-of-scope items explicitly listed

2. **specs/002-web-app/requirements.md** (400+ lines)
   - Complete requirements checklist (100% coverage)
   - 5 readiness gates (all passing)
   - Pre-planning validation checklist
   - Next steps documented

**Specification Highlights**:

**User Stories**:
- US1: Sign Up and Access Tasks (P0) - Authentication foundation
- US2: Create and View Tasks (P1) - Core CRUD operations
- US3: Mark Tasks Complete (P2) - Status toggling
- US4: Update Task Content (P2) - Edit functionality
- US5: Delete Tasks (P2) - Removal with confirmation
- US6: Data Isolation (P0) - Security and privacy enforcement

**Technology Stack**:
- **Frontend**: Next.js 16+ (App Router), TypeScript, Tailwind CSS, Better Auth, Zod
- **Backend**: FastAPI, Python 3.11+, SQLModel, python-jose[jwt], Alembic
- **Database**: Neon Serverless PostgreSQL 16+
- **Auth**: JWT-based with shared secret, 7-day expiration

**Security Architecture**:
- JWT authentication required for all API endpoints
- User ID verification in every database query
- CORS whitelisting for frontend origin
- Bcrypt password hashing (cost factor 12)
- SQL injection prevention via SQLModel ORM
- XSS protection via React auto-escaping

**API Design**:
- RESTful endpoints: POST /signup, /login, GET/POST/PUT/DELETE/PATCH /tasks
- Consistent error responses (401 Unauthorized, 403 Forbidden, 404 Not Found)
- Request/response schemas documented with JSON examples
- Ownership enforcement at both API and database layers

**Monorepo Structure**:
```
todo/
├── specs/002-web-app/          # Phase 2 specification
├── frontend/                   # Next.js application
│   ├── app/                    # App Router pages
│   ├── components/             # React components
│   └── lib/                    # API client, auth helpers
├── backend/                    # FastAPI service
│   ├── app/                    # Application code
│   │   ├── routes/             # API endpoints
│   │   └── middleware/         # JWT verification
│   └── alembic/                # Database migrations
└── src/                        # Phase 1 console app (preserved)
```

**Success Criteria**:
- Process: Complete spec → plan → tasks → implementation workflow with ADRs and PHRs
- Implementation: All 5 CRUD operations functional via web UI
- Security: JWT authentication working, user isolation enforced
- Persistence: Data stored in Neon PostgreSQL
- UX: Responsive design (320px-1920px), loading states, error handling

## Outcome

- ✅ Impact: Complete Phase 2 specification created, ready for planning phase
- 🧪 Tests: Requirements checklist 100% complete, 5/5 readiness gates passing
- 📁 Files: 2 files created (spec.md, requirements.md)
- 🔁 Next prompts: Run `/sp.plan` to generate implementation plan, then `/sp.tasks` for task breakdown
- 🧠 Reflection: Specification follows same rigorous structure as Phase 1, with enhanced detail for multi-user web architecture. Clear separation between frontend/backend concerns. Security requirements well-defined with JWT, user isolation, and CORS. Technology stack proven and compatible. User stories prioritized with P0 (authentication, security) before P1/P2 (features).

## Evaluation notes (flywheel)

- Failure modes observed: None. Specification is comprehensive and unambiguous.
- Graders run and results (PASS/FAIL): Requirements checklist PASS (100%), Readiness gates PASS (5/5)
- Prompt variant (if applicable): Standard /sp.specify workflow
- Next experiment (smallest change to try): Proceed to `/sp.plan` to generate implementation plan with architecture decisions for monorepo, authentication flow, and database migrations
