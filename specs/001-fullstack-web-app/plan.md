# Implementation Plan: In-Memory Todo Python Console Application (Phase I)

**Branch**: `001-fullstack-web-app` | **Date**: 2026-01-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-fullstack-web-app/spec.md`

## Summary

Build a console-based todo application in Python 3.13+ that demonstrates spec-driven, agentic development workflows. The application provides CRUD operations for todo tasks stored in-memory using Python's built-in data structures. Primary focus is on clean architecture, code quality, and process discipline rather than feature richness. Target audience is evaluators assessing AI-native development practices.

## Technical Context

**Language/Version**: Python 3.13+
**Primary Dependencies**: Python standard library only (no external frameworks)
**Storage**: In-memory using Python dict for task storage
**Testing**: Manual functional testing (no testing framework per spec constraints)
**Target Platform**: Cross-platform console (Windows/Linux/macOS)
**Project Type**: Single console application
**Performance Goals**: <100ms response time for all in-memory operations
**Constraints**: No file persistence, no databases, no network communication, no GUI
**Scale/Scope**: Single-user, single-session, ~5 core CRUD operations

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Specification Approval (REQUIRED)
✅ **PASS** - Specification approved in spec.md with quality checklist validation (16/16 criteria passed)

### Implementation Fidelity (REQUIRED)
✅ **PASS** - Plan aligns exactly with specification requirements (FR-001 to FR-012)
- All 5 user stories (P1-P5) mapped to implementation phases
- No feature additions or deviations from spec
- Technical constraints respected (Python 3.13+, standard library only, in-memory storage)

### Reproducibility (REQUIRED)
✅ **PASS** - All dependencies and setup will be documented
- Python 3.13+ version requirement explicit
- UV dependency management specified
- README.md will contain complete setup and run instructions
- No hidden dependencies or manual configuration steps

### Clean Code Standards (REQUIRED)
✅ **PASS** - Architecture follows clean code principles
- Modular design with separated concerns (models, services, cli, lib)
- Single responsibility: each module has clear purpose
- Type hints required per constitution (Python 3.13+ supports)
- PEP 8 compliance enforced
- Maximum function length: 50 lines (exceptions require justification)
- Maximum cyclomatic complexity: 10

### Workflow Sequence (REQUIRED)
✅ **PASS** - Following mandatory sequence
1. ✅ Specification → Complete (spec.md)
2. ⏳ Planning → In progress (this document)
3. ⬜ Task Breakdown → Next phase (tasks.md via /sp.tasks)
4. ⬜ Implementation → Final phase (via /sp.implement)

## Project Structure

### Documentation (this feature)

```text
specs/001-fullstack-web-app/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (skipped - no unknowns)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
│   └── cli-interface.md # CLI command contract definitions
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
src/
├── models/
│   └── task.py          # Task entity: data class with id, title, description, status
├── services/
│   └── task_service.py  # Business logic: CRUD operations, validation, ID generation
├── cli/
│   ├── __init__.py
│   ├── commands.py      # Command parsing and routing
│   ├── display.py       # Output formatting and user feedback
│   └── input_handler.py # User input capture and validation
├── lib/
│   └── validators.py    # Input validation utilities (title, ID format)
└── main.py              # Application entry point: CLI loop

tests/
└── manual/
    └── test_scenarios.md # Manual test scenarios mapped to acceptance criteria
```

**Structure Decision**: Single project structure selected. This is a standalone console application with no backend/frontend separation or multi-platform concerns. All source code lives under `src/` with clear separation by responsibility:
- `models/` - Data entities (Task)
- `services/` - Business logic (task management, validation)
- `cli/` - User interface (command parsing, display, input)
- `lib/` - Shared utilities (validators)
- `main.py` - Application entry point

Testing uses manual test scenarios per spec constraint (no testing frameworks).

## Complexity Tracking

**Status**: No Constitution violations detected. No complexity justifications required.

All constitution gates pass without exceptions:
- No additional projects beyond the defined structure
- No complex patterns (repositories, ORMs, etc.) needed for in-memory storage
- Simple dict-based storage appropriate for scope
- Minimal abstractions align with specification constraints

## Architecture Decisions

### 1. Data Storage Strategy

**Decision**: Use Python `dict` for in-memory task storage with integer keys

**Rationale**:
- Specification requires in-memory storage (FR-008)
- Dictionary provides O(1) lookup by task ID
- Simple, built-in, no external dependencies
- Aligns with constitution's "minimal complexity" principle

**Alternatives Considered**:
- List-based storage: O(n) lookup, more complex ID management
- Class-based storage with custom collection: Over-engineering for scope

**Trade-offs**:
- ✅ Fast ID-based lookups
- ✅ Simple implementation
- ❌ Data lost on exit (acceptable per spec)
- ❌ No persistence (explicitly out of scope)

### 2. ID Generation Strategy

**Decision**: Sequential integer counter starting from 1

**Rationale**:
- Specification requires "unique sequential integer IDs starting from 1" (FR-002)
- Simple increment-based generation
- Predictable, user-friendly IDs
- No UUID complexity needed for single-session use

**Implementation**:
- Service maintains `_next_id` counter
- Increment on each task creation
- IDs never reused (even after deletion)

### 3. CLI Interaction Model

**Decision**: Interactive command-loop interface with menu-driven navigation

**Rationale**:
- Specification requires "console-based interface with clear prompts" (FR-009)
- User-friendly for evaluators (no command-line arguments to memorize)
- Clear feedback after each operation (FR-009)
- Graceful error handling with guidance (FR-007)

**Alternatives Considered**:
- Argument-based CLI (e.g., `python main.py add "Task title"`): Less discoverable
- REPL-style interface: Over-engineering, adds complexity

**Command Flow**:
```
1. Display menu with numbered options
2. User enters choice (1-6)
3. Execute command (with additional prompts as needed)
4. Display result/feedback
5. Return to menu (repeat)
6. Exit option warns about data loss
```

### 4. Error Handling Strategy

**Decision**: Validate early, fail fast with user-friendly messages

**Rationale**:
- Specification requires "clear error messages" (FR-007)
- Catch validation errors before business logic
- Guide user toward correct input

**Error Categories**:
1. **Empty/Missing Input**: "Title cannot be empty. Please provide a title."
2. **Invalid ID Format**: "Invalid ID format. Please enter a numeric ID."
3. **Non-existent ID**: "Task ID {id} not found. Use 'view' to see existing tasks."
4. **Unknown Command**: "Invalid choice. Please select 1-6."

**Error Recovery**:
- Display error message
- Return to command menu (don't exit)
- Preserve existing data (no partial updates)

### 5. Display Formatting

**Decision**: Simple text-based output with clear status indicators

**Rationale**:
- Specification requires visible completion status (FR-010)
- Examples given: "[✓]" complete, "[ ]" incomplete
- UTF-8 terminal support assumed (spec assumptions)

**Format**:
```
ID: 1
Title: Buy groceries
Description: Get milk, eggs, bread
Status: [✓] Complete

ID: 2
Title: Call dentist
Status: [ ] Incomplete
```

### 6. Module Separation

**Decision**: Separate concerns into models, services, CLI layers

**Rationale**:
- Constitution requires clean code with single responsibility
- Testability (even for manual testing)
- Clear boundaries between data, logic, and presentation

**Layer Responsibilities**:
- **models/task.py**: Pure data (dataclass, no logic)
- **services/task_service.py**: CRUD operations, validation, ID generation
- **cli/**: User interaction only (no business logic)
- **lib/validators.py**: Reusable validation functions

### 7. Type Safety

**Decision**: Full type hints throughout codebase

**Rationale**:
- Constitution requires type hints for all function signatures
- Python 3.13+ supports modern type syntax
- Improved code clarity for evaluators
- Catches errors early (IDE support)

**Type Annotations**:
```python
def add_task(title: str, description: str = "") -> Task:
def get_task(task_id: int) -> Task | None:
def list_tasks() -> list[Task]:
```

## Phase 0: Research (No Research Required)

All technical decisions are fully resolved. No unknowns or clarifications needed.

**Rationale**:
- Specification is comprehensive (16/16 quality criteria passed)
- Technology stack is constrained (Python 3.13+ standard library only)
- No external integrations or third-party dependencies
- Architecture decisions are straightforward for scope
- No ambiguities in functional requirements

**Status**: ✅ Phase 0 complete (research.md not needed - no unknowns)

## Phase 1: Design & Contracts

### Data Model Design

See [data-model.md](./data-model.md) for entity definitions, validation rules, and state transitions.

**Summary**:
- **Task Entity**: id (int), title (str), description (str), completed (bool)
- **Validation Rules**: Title required (non-empty), ID must be positive integer
- **State Transitions**: Incomplete ↔ Complete (toggleable)

### CLI Interface Contracts

See [contracts/cli-interface.md](./contracts/cli-interface.md) for command specifications.

**Summary**:
- Command menu with 6 options (add, view, update, delete, toggle status, exit)
- Input/output contracts for each command
- Error response formats

### Quick Start Guide

See [quickstart.md](./quickstart.md) for developer onboarding.

**Summary**:
- Prerequisites: Python 3.13+, UV
- Setup: Clone, install dependencies (none beyond stdlib)
- Run: `python src/main.py`
- Basic usage examples

## Implementation Phases (for /sp.tasks)

### Phase 1: Core Infrastructure (P1)
**Goal**: Foundation for all features - data model, storage, basic service

**Tasks**:
1. Create Task data model (models/task.py)
2. Implement TaskService with in-memory storage (services/task_service.py)
3. Add ID generation logic
4. Implement add_task and list_tasks methods
5. Create basic CLI loop (cli/commands.py, main.py)
6. Implement display formatting (cli/display.py)

**Acceptance**: Can add tasks and view them in a list

### Phase 2: Task Completion (P2)
**Goal**: Toggle task completion status

**Tasks**:
1. Implement toggle_status in TaskService
2. Add completion status command in CLI
3. Update display to show status indicators

**Acceptance**: Can mark tasks complete/incomplete by ID

### Phase 3: Update Operations (P3)
**Goal**: Modify existing task content

**Tasks**:
1. Implement update_task in TaskService
2. Add update command in CLI
3. Handle partial updates (title only, description only, or both)

**Acceptance**: Can update task title and/or description by ID

### Phase 4: Delete Operations (P4)
**Goal**: Remove tasks from list

**Tasks**:
1. Implement delete_task in TaskService
2. Add delete command in CLI
3. Handle edge case (deleting last task)

**Acceptance**: Can delete tasks by ID

### Phase 5: Input Validation & Error Handling (P5)
**Goal**: Robust error handling for all edge cases

**Tasks**:
1. Create validators (lib/validators.py)
2. Add validation to all service methods
3. Implement error handling in CLI
4. Add exit warning about data loss

**Acceptance**: All edge cases handle gracefully with clear error messages

### Phase 6: Documentation & Polish
**Goal**: Complete documentation and final quality checks

**Tasks**:
1. Create README.md with setup and usage
2. Verify PEP 8 compliance
3. Add docstrings to all public functions
4. Create manual test scenarios document
5. Final constitution compliance check

**Acceptance**: All documentation complete, code quality gates pass

## Dependencies

**Runtime**:
- Python 3.13+ (standard library only)

**Development**:
- UV (dependency management, per spec)

**No External Packages**: Specification explicitly constrains to standard library only

## Risk Assessment

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Python 3.13+ not available on evaluator machine | Medium | High | Document fallback to Python 3.11+ (minimal syntax differences) |
| UTF-8 not supported in terminal | Low | Low | Provide ASCII fallback for status indicators |
| ID counter overflow | Very Low | Low | Python integers have unlimited precision |

### Process Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Specification changes during implementation | Low | Medium | Follow constitution: require spec update and approval before code changes |
| Manual testing insufficient | Low | Medium | Map test scenarios directly to acceptance criteria |
| Code quality gates fail | Low | Medium | Incremental validation during implementation |

## Post-Design Constitution Check

*Re-evaluation after Phase 1 design completion*

### Specification Approval
✅ **PASS** - No specification changes made during planning

### Implementation Fidelity
✅ **PASS** - Architecture directly implements all FR-001 to FR-012
- Data model maps to Key Entities (Task with id, title, description, status)
- Service layer implements all CRUD operations
- CLI layer handles user interaction requirements
- Error handling addresses FR-007 completely
- Exit warning implements FR-012

### Reproducibility
✅ **PASS** - Design maintains reproducibility
- No hidden dependencies discovered
- Standard library only confirmed
- Setup steps remain simple (documented in quickstart.md)

### Clean Code Standards
✅ **PASS** - Architecture enforces clean code
- Clear separation of concerns (models/services/cli/lib)
- Single responsibility per module
- Type hints throughout (Python 3.13+ support confirmed)
- Functions kept minimal (CRUD operations naturally small)
- Low complexity (no complex algorithms, straightforward business logic)

### Workflow Sequence
✅ **PASS** - Following mandatory sequence
1. ✅ Specification → Complete
2. ✅ Planning → Complete
3. ⬜ Task Breakdown → Next (via /sp.tasks)
4. ⬜ Implementation → Final (via /sp.implement)

**Final Gate Status**: ✅ ALL GATES PASS - Ready for task breakdown phase

## Next Steps

1. ✅ **Plan approved** - This document complete
2. ⬜ **Run `/sp.tasks`** - Break plan into concrete, testable tasks with file paths
3. ⬜ **Run `/sp.implement`** - Execute implementation following task sequence
4. ⬜ **Manual testing** - Validate against acceptance scenarios
5. ⬜ **Documentation review** - Ensure README.md enables reproducibility

## Appendices

### Glossary

- **CRUD**: Create, Read, Update, Delete operations
- **CLI**: Command-Line Interface
- **P1-P5**: Priority levels from specification user stories
- **FR-001 to FR-012**: Functional Requirements from specification
- **SC-001 to SC-008**: Success Criteria from specification

### References

- Specification: [spec.md](./spec.md)
- Constitution: [.specify/memory/constitution.md](../../.specify/memory/constitution.md)
- Data Model: [data-model.md](./data-model.md)
- CLI Contracts: [contracts/cli-interface.md](./contracts/cli-interface.md)
- Quick Start: [quickstart.md](./quickstart.md)
