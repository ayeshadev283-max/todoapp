# Tasks: In-Memory Todo Python Console Application (Phase I)

**Input**: Design documents from `/specs/001-fullstack-web-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, contracts/

**Tests**: Manual testing per specification constraints (no testing framework). Test scenarios documented separately.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root (per plan.md)
- Source structure: `src/{models,services,cli,lib}/`
- Manual tests: `tests/manual/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project directory structure: src/{models,services,cli,lib}/, tests/manual/
- [x] T002 Create __init__.py files in src/cli/ to mark as Python package
- [x] T003 [P] Create .gitignore with Python-specific entries (__pycache__, *.pyc, .env)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create Task dataclass in src/models/task.py with id (int), title (str), description (str), completed (bool)
- [x] T005 Create TaskService class skeleton in src/services/task_service.py with __init__, _tasks dict, _next_id counter
- [x] T006 Implement _generate_id method in TaskService for sequential ID generation starting from 1
- [x] T007 [P] Create input validators module in src/lib/validators.py with validate_title and validate_id_format functions
- [x] T008 [P] Create display formatter module in src/cli/display.py with format_task, format_task_list, format_menu functions
- [x] T009 Create main application entry point in src/main.py with CLI loop skeleton and menu display

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create and View Tasks (Priority: P1) 🎯 MVP

**Goal**: Enable users to add tasks and view them in a list. This is the foundational interaction demonstrating the app works.

**Independent Test**: Launch application, add task with title "Buy groceries", view tasks, confirm task appears with ID 1 and incomplete status.

**Acceptance Criteria**:
1. Empty app: add task "Buy groceries" → created with unique ID, title, no description, status incomplete
2. Tasks exist: view all → all displayed with ID, title, description (if present), status
3. Empty app: view tasks → "No tasks found" message

### Implementation for User Story 1

- [x] T010 [P] [US1] Implement add_task method in TaskService (generate ID, validate title, create Task, store in dict, return Task)
- [x] T011 [P] [US1] Implement list_tasks method in TaskService (return list of all tasks from _tasks dict)
- [x] T012 [US1] Implement "Add Task" command in src/cli/commands.py (prompt for title/description, call add_task, display success)
- [x] T013 [US1] Implement "View All Tasks" command in src/cli/commands.py (call list_tasks, format and display)
- [x] T014 [US1] Integrate add and view commands into main.py CLI loop (menu options 1 and 2)
- [x] T015 [US1] Add empty task list handling in display.py (show "No tasks found" message)
- [x] T016 [US1] Add validation for empty title in add command with error message "Title cannot be empty"

**Checkpoint**: At this point, User Story 1 should be fully functional - can add and view tasks

---

## Phase 4: User Story 2 - Mark Tasks Complete (Priority: P2)

**Goal**: Enable users to toggle task completion status. This provides the core value proposition of tracking completion.

**Independent Test**: Add task, mark as complete by ID, view tasks, confirm status shows "[✓] Complete". Toggle back to incomplete.

**Acceptance Criteria**:
1. Incomplete task ID 1: mark complete → status changes to "complete"
2. Complete task ID 2: mark incomplete → status changes to "incomplete"
3. Non-existent ID 99: toggle → error "Task ID 99 not found"

### Implementation for User Story 2

- [x] T017 [US2] Implement toggle_status method in TaskService (validate ID exists, toggle completed field, return Task or None)
- [x] T018 [US2] Implement "Toggle Task Status" command in src/cli/commands.py (prompt for ID, validate format, call toggle_status, display result)
- [x] T019 [US2] Update format_task in display.py to show status indicators: "[✓] Complete" or "[ ] Incomplete"
- [x] T020 [US2] Integrate toggle status command into main.py CLI loop (menu option 5)
- [x] T021 [US2] Add error handling for invalid ID format with message "Invalid ID format. Please enter a numeric ID."
- [x] T022 [US2] Add error handling for non-existent ID with message "Task ID {id} not found. Use 'View All Tasks' to see existing tasks."

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - can add, view, and toggle status

---

## Phase 5: User Story 3 - Update Task Content (Priority: P3)

**Goal**: Enable users to modify task title and/or description. Allows correction of mistakes or refinement of details.

**Independent Test**: Add task, update title to "Buy groceries and toiletries", view task, confirm changes while ID and status unchanged.

**Acceptance Criteria**:
1. Task ID 1 title "Buy groceries": update to "Buy groceries and toiletries" → title changes, ID/status unchanged
2. Task ID 2 no description: add description "Get milk, eggs, bread" → description added
3. Non-existent ID 99: update → error "Task ID 99 not found"

### Implementation for User Story 3

- [x] T023 [US3] Implement update_task method in TaskService (validate ID exists, update title and/or description, return Task or None)
- [x] T024 [US3] Implement "Update Task" command in src/cli/commands.py (prompt for ID, show current values, prompt for new values with option to keep current, call update_task)
- [x] T025 [US3] Add logic to handle partial updates (title only, description only, or both) in update command
- [x] T026 [US3] Integrate update command into main.py CLI loop (menu option 3)
- [x] T027 [US3] Add validation to prevent empty title on update with error message "Title cannot be empty"
- [x] T028 [US3] Add error handling for non-existent ID in update command

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently - full CRUD except delete

---

## Phase 6: User Story 4 - Delete Tasks (Priority: P4)

**Goal**: Enable users to remove tasks permanently. Keeps task list clean and focused.

**Independent Test**: Add 3 tasks, delete task ID 2, view tasks, confirm task 2 removed and tasks 1 and 3 remain.

**Acceptance Criteria**:
1. Tasks with IDs 1, 2, 3 exist: delete task 2 → task 2 removed, tasks 1 and 3 remain
2. Non-existent ID 99: delete → error "Task ID 99 not found"
3. Only task ID 1 exists: delete task 1, view tasks → "No tasks found" message

### Implementation for User Story 4

- [x] T029 [US4] Implement delete_task method in TaskService (validate ID exists, remove from _tasks dict, return deleted Task or None)
- [x] T030 [US4] Implement "Delete Task" command in src/cli/commands.py (prompt for ID, call delete_task, display confirmation with deleted task details)
- [x] T031 [US4] Integrate delete command into main.py CLI loop (menu option 4)
- [x] T032 [US4] Add error handling for non-existent ID in delete command
- [x] T033 [US4] Test edge case: delete last remaining task and confirm "No tasks found" displays correctly

**Checkpoint**: At this point, User Stories 1-4 should all work independently - full CRUD operations complete

---

## Phase 7: User Story 5 - Add Optional Descriptions (Priority: P5)

**Goal**: Enable descriptions in task creation. Descriptions were already implemented in US1 but this phase ensures proper handling.

**Independent Test**: Add task with title "Prepare presentation" and description "Include Q1 results", view task, confirm both displayed. Add task with only title "Call dentist", confirm works without description.

**Acceptance Criteria**:
1. Add task with title and description → both stored and displayed
2. Add task with only title → created successfully with empty description
3. View task with no description → description field omitted or shows as empty gracefully

### Implementation for User Story 5

- [x] T034 [US5] Verify description parameter in add_task accepts optional description with default empty string
- [x] T035 [US5] Update format_task in display.py to gracefully handle empty descriptions (omit "Description:" line if empty)
- [x] T036 [US5] Test adding task with description and verify display shows both title and description
- [x] T037 [US5] Test adding task without description and verify app accepts and displays correctly
- [x] T038 [US5] Verify update command properly handles adding description to task that had none

**Checkpoint**: All 5 user stories should now be independently functional with proper description handling

---

## Phase 8: Error Handling & Edge Cases

**Purpose**: Comprehensive error handling for all edge cases defined in specification

- [x] T039 [P] Add input validation for empty titles in add command (already in T016, verify coverage)
- [x] T040 [P] Add input validation for invalid ID format in all ID-based commands (already in T021, verify coverage)
- [x] T041 [P] Add handling for invalid menu choices in main.py with message "Invalid choice. Please select 1-6"
- [x] T042 Implement exit command (menu option 6) with warning: "⚠ Warning: All data will be lost when you exit (in-memory storage only)"
- [x] T043 Add exit confirmation prompt "Are you sure you want to exit? (y/n)" in exit command
- [x] T044 [P] Add graceful exit message "Thank you for using Todo Application. Goodbye!" on confirmed exit
- [x] T045 Test UTF-8 symbol display for status indicators ([✓] and [ ]) and provide ASCII fallback if needed
- [x] T046 Verify all error messages match specification format and provide actionable guidance

**Checkpoint**: All edge cases handled gracefully with user-friendly error messages

---

## Phase 9: Code Quality & Documentation

**Purpose**: Ensure code meets constitution standards and documentation is complete

- [x] T047 [P] Add type hints to all functions in src/models/task.py (already dataclass, verify completeness)
- [x] T048 [P] Add type hints to all functions in src/services/task_service.py
- [x] T049 [P] Add type hints to all functions in src/cli/*.py files
- [x] T050 [P] Add type hints to all functions in src/lib/validators.py
- [x] T051 [P] Add docstrings to Task dataclass in src/models/task.py
- [x] T052 [P] Add docstrings to all public methods in TaskService
- [x] T053 [P] Add docstrings to all functions in src/cli/display.py
- [x] T054 [P] Add docstrings to all validation functions in src/lib/validators.py
- [x] T055 Verify PEP 8 compliance across all source files (line length, naming conventions, spacing)
- [x] T056 Verify maximum function length (50 lines per constitution) - refactor if needed
- [x] T057 Verify cyclomatic complexity (max 10 per constitution) - simplify if needed
- [x] T058 Create README.md with setup instructions, run commands, usage examples for all 5 operations
- [x] T059 [P] Create manual test scenarios document in tests/manual/test_scenarios.md mapping to acceptance criteria
- [x] T060 [P] Verify quickstart.md matches actual implementation and update if needed

**Checkpoint**: Code quality gates pass, documentation complete and accurate

---

## Phase 10: Final Validation & Constitution Check

**Purpose**: Final validation that all requirements met and constitution compliance verified

- [x] T061 Execute manual test scenario: Add task, view tasks, verify task appears (US1 acceptance)
- [x] T062 Execute manual test scenario: Mark task complete, toggle back to incomplete (US2 acceptance)
- [x] T063 Execute manual test scenario: Update task title and description (US3 acceptance)
- [x] T064 Execute manual test scenario: Delete task, verify removed (US4 acceptance)
- [x] T065 Execute manual test scenario: Add task with and without description (US5 acceptance)
- [x] T066 Test edge case: Empty title → verify error "Title cannot be empty"
- [x] T067 Test edge case: Invalid ID format → verify error "Invalid ID format"
- [x] T068 Test edge case: Non-existent ID → verify error "Task ID {id} not found"
- [x] T069 Test edge case: Invalid menu choice → verify error and menu redisplay
- [x] T070 Test edge case: View tasks when empty → verify "No tasks found" message
- [x] T071 Verify exit warning displays and data loss confirmed before exit
- [x] T072 Verify all FR-001 through FR-012 functional requirements are implemented
- [x] T073 Verify all SC-001 through SC-008 success criteria can be measured
- [x] T074 Run complete workflow: launch app, execute all 5 operations within 5 minutes (SC-002)
- [x] T075 Final constitution compliance check: Specification approval, Implementation fidelity, Reproducibility, Clean code, Workflow sequence

**Checkpoint**: All acceptance criteria met, ready for delivery

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-7)**: All depend on Foundational phase completion
  - User Story 1 (P1): Can start after Foundational - No dependencies on other stories ✅ MVP
  - User Story 2 (P2): Can start after Foundational - Independent of other stories
  - User Story 3 (P3): Can start after Foundational - Independent of other stories
  - User Story 4 (P4): Can start after Foundational - Independent of other stories
  - User Story 5 (P5): Enhances US1 but can be implemented independently
- **Error Handling (Phase 8)**: Depends on all user stories being complete
- **Code Quality (Phase 9)**: Can run in parallel with implementation (continuous activity)
- **Final Validation (Phase 10)**: Depends on all previous phases being complete

### User Story Independence

All user stories are designed to be independently testable:

- **US1 (Add/View)**: Can function alone as MVP - foundation for all features
- **US2 (Toggle Status)**: Can be tested independently after US1 exists (add task, then toggle)
- **US3 (Update)**: Can be tested independently after US1 exists (add task, then update)
- **US4 (Delete)**: Can be tested independently after US1 exists (add task, then delete)
- **US5 (Descriptions)**: Can be tested independently (add with/without description)

### Within Each User Story

Standard implementation order:
1. Service layer methods (business logic)
2. CLI commands (user interface)
3. Integration into main loop
4. Error handling for that story
5. Independent testing

### Parallel Opportunities

**Phase 1 (Setup)**: All 3 tasks can run in parallel [P]

**Phase 2 (Foundational)**:
- T004 (Task model) must complete first
- After T004: T005, T006, T007, T008, T009 can run in parallel
- T007 and T008 are marked [P] (completely independent)

**Phases 3-7 (User Stories)**:
- Each user story can be worked on in parallel by different team members
- Within each story, service methods (marked [P]) can be implemented in parallel
- CLI integration must wait for service completion

**Phase 9 (Code Quality)**:
- All tasks marked [P] can run in parallel (different files)
- T047-T054 (type hints and docstrings) completely parallelizable

---

## Parallel Example: User Story 1

```bash
# Service layer (can run in parallel after T004-T009 complete):
T010 [P]: Implement add_task in TaskService
T011 [P]: Implement list_tasks in TaskService

# CLI layer (sequential after service complete):
T012: Implement "Add Task" command
T013: Implement "View All Tasks" command
T014: Integrate into main loop
T015: Add empty list handling
T016: Add validation
```

## Parallel Example: Foundational Phase

```bash
# After T004 (Task model) completes:
T005: Create TaskService skeleton (prerequisite for T006, T010, T011)
T007 [P]: Create validators module (completely independent)
T008 [P]: Create display module (completely independent)
T009: Create main.py (needs T008 for menu display)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only) - Recommended for Phase I

1. ✅ Complete Phase 1: Setup (3 tasks)
2. ✅ Complete Phase 2: Foundational (6 tasks) - **CRITICAL BLOCKER**
3. ✅ Complete Phase 3: User Story 1 (7 tasks)
4. ✅ Complete Phase 8: Error Handling for US1 (tasks T039-T041, T046)
5. ✅ Complete Phase 9: Documentation (tasks T058-T059)
6. **STOP and VALIDATE**: Test User Story 1 independently
7. ✅ Demo MVP: Can add and view tasks with error handling

**Total MVP Tasks**: ~20 tasks for fully functional, documented MVP

### Incremental Delivery (Recommended)

1. **Sprint 1**: Setup + Foundational → Foundation ready (9 tasks)
2. **Sprint 2**: User Story 1 + Errors + Docs → **MVP DEPLOYED** (add/view tasks)
3. **Sprint 3**: User Story 2 → Add toggle status functionality
4. **Sprint 4**: User Story 3 → Add update functionality
5. **Sprint 5**: User Story 4 → Add delete functionality
6. **Sprint 6**: User Story 5 + Final Polish → Complete feature set
7. **Sprint 7**: Final Validation → Production ready

Each sprint delivers independently testable value.

### Parallel Team Strategy

With 3 developers after Foundational phase completes:

1. **Team completes Setup + Foundational together** (Phases 1-2)
2. **Once Foundational done, split**:
   - Developer A: User Story 1 (P1) + User Story 2 (P2)
   - Developer B: User Story 3 (P3) + User Story 4 (P4)
   - Developer C: User Story 5 (P5) + Code Quality (Phase 9)
3. **Final sync**: Error Handling (Phase 8) + Validation (Phase 10) together

Stories complete and integrate independently, then merge for final validation.

---

## Task Summary

### Total Task Count: 75 tasks

**By Phase**:
- Phase 1 (Setup): 3 tasks
- Phase 2 (Foundational): 6 tasks
- Phase 3 (US1 - Create/View): 7 tasks
- Phase 4 (US2 - Toggle Status): 6 tasks
- Phase 5 (US3 - Update): 6 tasks
- Phase 6 (US4 - Delete): 5 tasks
- Phase 7 (US5 - Descriptions): 5 tasks
- Phase 8 (Error Handling): 8 tasks
- Phase 9 (Code Quality): 14 tasks
- Phase 10 (Final Validation): 15 tasks

**By User Story**:
- US1 (Create and View Tasks): 7 tasks + foundational
- US2 (Mark Tasks Complete): 6 tasks
- US3 (Update Task Content): 6 tasks
- US4 (Delete Tasks): 5 tasks
- US5 (Add Optional Descriptions): 5 tasks
- Cross-cutting (Setup, Foundational, Error Handling, Quality, Validation): 46 tasks

**Parallel Opportunities**: 23 tasks marked [P] can run in parallel

**Independent Test Checkpoints**: 6 checkpoints (after foundational, after each user story, after validation)

**MVP Scope**: Phases 1-3 + subset of Phase 8-9 = ~20 tasks for minimal viable product

---

## Format Validation

✅ All tasks follow checklist format: `- [ ] [TaskID] [P?] [Story?] Description with file path`
✅ All task IDs sequential (T001-T075)
✅ All user story tasks labeled [US1]-[US5]
✅ All parallelizable tasks marked [P]
✅ All tasks include file paths where applicable
✅ Clear checkpoints after each phase
✅ Complete dependency mapping
✅ Independent test criteria for each story

---

## Notes

- [P] tasks operate on different files with no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story independently completable and testable
- Manual testing per specification (no testing framework)
- Commit after each logical task group or phase
- Stop at any checkpoint to validate story independently
- Constitution compliance verified in Phase 10
- All functional requirements (FR-001 to FR-012) covered
- All success criteria (SC-001 to SC-008) testable
