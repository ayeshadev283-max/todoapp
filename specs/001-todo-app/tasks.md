# Tasks: In-Memory Todo Console Application

**Input**: Design documents from `/specs/001-todo-app/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/cli-interface.md, quickstart.md

**Tests**: Manual testing approach per research.md decision - no automated test tasks included

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project structure**: `src/` at repository root
- All source files in `src/` directory
- Documentation at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create src/ directory structure for models.py, manager.py, cli.py, __main__.py
- [X] T002 Create pyproject.toml with UV configuration for Python 3.13+ project
- [X] T003 [P] Create README.md with setup instructions, dependencies, and run commands per quickstart.md
- [X] T004 [P] Verify Python 3.13+ is installed and UV is available

**Checkpoint**: Project structure ready, documentation in place

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data model that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Create Todo dataclass in src/models.py with id, title, description, completed fields
- [X] T006 Add type hints to Todo dataclass (int, str, str, bool)
- [X] T007 Add __str__ method to Todo for display formatting ([✓]/[ ] ID. Title)
- [X] T008 Create TodoManager class in src/manager.py with _todos dict and _next_id counter
- [X] T009 Add TodoManager.__init__() to initialize empty _todos dict and _next_id = 1

**Checkpoint**: Foundation ready - Todo entity and TodoManager structure exist, user story implementation can now begin

---

## Phase 3: User Story 1 - Basic Todo Management (Priority: P1) 🎯 MVP

**Goal**: User can add new todos and view all existing todos with status

**Independent Test**: Launch app, add 2-3 tasks, view list showing all tasks with IDs, titles, and completion status

### Implementation for User Story 1

- [X] T010 [P] [US1] Implement TodoManager.add(title, description) method in src/manager.py
- [X] T011 [P] [US1] Implement TodoManager.get_all() method returning sorted list of todos in src/manager.py
- [X] T012 [US1] Create main menu display function in src/cli.py showing 6 numbered options
- [X] T013 [US1] Implement add_todo() function in src/cli.py with title and description prompts
- [X] T014 [US1] Add title validation in add_todo() - reject empty/whitespace, re-prompt on error
- [X] T015 [US1] Implement view_todos() function in src/cli.py displaying formatted todo list
- [X] T016 [US1] Add empty list handling in view_todos() - display "No todos yet" message
- [X] T017 [US1] Format todo display with checkboxes ([✓] for complete, [ ] for incomplete) and descriptions
- [X] T018 [US1] Add summary line to view_todos() showing total, incomplete, and complete counts
- [X] T019 [US1] Create main() function in src/cli.py with menu loop and option dispatch
- [X] T020 [US1] Add menu input validation in main() - handle non-integer and out-of-range inputs
- [X] T021 [US1] Implement exit option (6) in main() with goodbye message
- [X] T022 [US1] Add startup warning message about in-memory storage data loss
- [X] T023 [US1] Create src/__main__.py entry point importing and calling cli.main()

**Checkpoint**: User Story 1 complete - app can add todos and view list, fully functional MVP

---

## Phase 4: User Story 2 - Status Management (Priority: P2)

**Goal**: User can mark todos as complete or revert to incomplete

**Independent Test**: Add a todo, mark it complete (status changes), then mark it incomplete (status reverts)

### Implementation for User Story 2

- [X] T024 [P] [US2] Implement TodoManager.get(todo_id) method returning Todo or None in src/manager.py
- [X] T025 [P] [US2] Implement TodoManager.toggle_complete(todo_id) method in src/manager.py
- [X] T026 [US2] Create toggle_todo() function in src/cli.py prompting for todo ID
- [X] T027 [US2] Add ID validation in toggle_todo() - handle non-integer input with error message
- [X] T028 [US2] Add ID existence check in toggle_todo() - display "Todo not found" and re-prompt
- [X] T029 [US2] Display appropriate success message based on new status (complete/incomplete)
- [X] T030 [US2] Add toggle option (5) to main menu dispatch in src/cli.py

**Checkpoint**: User Story 2 complete - todos can be toggled between complete and incomplete states

---

## Phase 5: User Story 3 - Todo Modification (Priority: P3)

**Goal**: User can update title or description of existing todos

**Independent Test**: Create a todo, update its title and description, verify changes persist in view

### Implementation for User Story 3

- [X] T031 [P] [US3] Implement TodoManager.update(todo_id, title, description) method in src/manager.py
- [X] T032 [US3] Create update_todo() function in src/cli.py prompting for todo ID
- [X] T033 [US3] Add ID validation in update_todo() - handle non-integer and non-existent IDs
- [X] T034 [US3] Display current todo details before prompting for updates
- [X] T035 [US3] Prompt for new title with option to skip (press Enter to keep current)
- [X] T036 [US3] Prompt for new description with option to skip (press Enter to keep current)
- [X] T037 [US3] Validate new title if provided - reject empty/whitespace with re-prompt
- [X] T038 [US3] Call TodoManager.update() with new values and display success message
- [X] T039 [US3] Add update option (3) to main menu dispatch in src/cli.py

**Checkpoint**: User Story 3 complete - todos can be edited without deletion/recreation

---

## Phase 6: User Story 4 - Todo Deletion (Priority: P4)

**Goal**: User can remove todos to keep list clean

**Independent Test**: Add a todo, delete it by ID, verify it no longer appears in list

### Implementation for User Story 4

- [X] T040 [P] [US4] Implement TodoManager.delete(todo_id) method in src/manager.py
- [X] T041 [US4] Create delete_todo() function in src/cli.py prompting for todo ID
- [X] T042 [US4] Add ID validation in delete_todo() - handle non-integer and non-existent IDs
- [X] T043 [US4] Call TodoManager.delete() and display success message
- [X] T044 [US4] Add delete option (4) to main menu dispatch in src/cli.py

**Checkpoint**: User Story 4 complete - todos can be permanently removed from list

---

## Phase 7: User Story 5 - Error Handling and Validation (Priority: P5)

**Goal**: System handles all invalid inputs gracefully with clear error messages

**Independent Test**: Attempt invalid operations (empty input, non-existent ID, invalid commands) and verify appropriate error messages

### Implementation for User Story 5

**Note**: Most validation already implemented in previous phases. This phase adds comprehensive error handling and polish.

- [X] T045 [P] [US5] Add error handling for extremely long titles (1000+ chars) - accept but may truncate display
- [X] T046 [P] [US5] Add unicode character support testing - verify emoji and special chars work
- [X] T047 [US5] Verify all error messages follow consistent format with ❌ prefix
- [X] T048 [US5] Ensure all prompts re-display on error instead of crashing
- [X] T049 [US5] Add edge case handling for attempting to toggle already-complete todo (allow, no error)
- [X] T050 [US5] Test empty list edge case - verify "No todos yet" displays correctly

**Checkpoint**: User Story 5 complete - all edge cases and error scenarios handled gracefully

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements affecting multiple user stories

- [X] T051 [P] Add Google-style docstrings to all public methods in src/models.py
- [X] T052 [P] Add Google-style docstrings to all public methods in src/manager.py
- [X] T053 [P] Add Google-style docstrings to all public functions in src/cli.py
- [X] T054 [P] Verify PEP 8 compliance across all source files
- [X] T055 [P] Verify all type hints are present and correct (Python 3.13+ syntax)
- [X] T056 Verify all functions are under 50 lines per constitution requirement
- [X] T057 Verify cyclomatic complexity under 10 for all functions
- [X] T058 Test application with 100 todos to verify performance (SC-003 < 2 sec)
- [X] T059 Execute all 13 manual test scenarios from quickstart.md
- [X] T060 Verify all 22 acceptance checklist items from quickstart.md pass
- [X] T061 Update README.md with final usage examples if needed
- [X] T062 Verify UTF-8 console compatibility on Windows (run chcp 65001 if needed)

**Checkpoint**: All polish complete, application ready for demo/review

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed) after Phase 2
  - Or sequentially in priority order (P1 → P2 → P3 → P4 → P5)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends only on Phase 2 (Foundational) - no dependencies on other stories
- **User Story 2 (P2)**: Depends only on Phase 2 (Foundational) - uses TodoManager.get() but independently testable
- **User Story 3 (P3)**: Depends only on Phase 2 (Foundational) - independently testable
- **User Story 4 (P4)**: Depends only on Phase 2 (Foundational) - independently testable
- **User Story 5 (P5)**: Integrates with all previous stories but is cross-cutting validation work

### Within Each User Story

- TodoManager methods can be implemented in parallel (marked [P])
- CLI functions depend on corresponding TodoManager methods being complete
- Main menu integration happens after CLI functions are implemented
- Each story should be tested independently before moving to next priority

### Parallel Opportunities

**Phase 1 (Setup)**: Tasks T003 and T004 can run in parallel with T001-T002

**Phase 2 (Foundational)**: After T005 completes, T006-T007 can run in parallel; after T008 completes, T009 runs

**Phase 3 (US1)**: T010 and T011 can run in parallel (both in manager.py, different methods)

**Phase 4 (US2)**: T024 and T025 can run in parallel (both in manager.py, different methods)

**Phase 5 (US3)**: T031 can run independently (manager.py)

**Phase 6 (US4)**: T040 can run independently (manager.py)

**Phase 7 (US5)**: T045, T046, T047 can run in parallel (different validation concerns)

**Phase 8 (Polish)**: T051, T052, T053, T054, T055 can all run in parallel (different files or different concerns)

---

## Parallel Example: User Story 1

```bash
# After Phase 2 completes, launch manager methods in parallel:
Task T010: "Implement TodoManager.add(title, description) method in src/manager.py"
Task T011: "Implement TodoManager.get_all() method in src/manager.py"

# Then after T010 completes, launch CLI work:
Task T013: "Implement add_todo() function in src/cli.py"
# After T011 completes:
Task T015: "Implement view_todos() function in src/cli.py"
```

---

## Parallel Example: User Story 2

```bash
# After Phase 2 completes, launch manager methods in parallel:
Task T024: "Implement TodoManager.get(todo_id) method in src/manager.py"
Task T025: "Implement TodoManager.toggle_complete(todo_id) method in src/manager.py"

# Then after both complete, launch CLI work:
Task T026: "Create toggle_todo() function in src/cli.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T009) - CRITICAL, blocks all stories
3. Complete Phase 3: User Story 1 (T010-T023)
4. **STOP and VALIDATE**: Execute manual tests from quickstart.md for US1
5. Demo: Application can add and view todos - complete MVP!

**MVP Deliverable**: Working todo app with add and view capabilities (~350 LOC)

### Incremental Delivery

1. **Foundation**: Complete Setup + Foundational (T001-T009) → Structure ready
2. **MVP (US1)**: Add Basic Todo Management (T010-T023) → Test independently → Demo!
3. **+US2**: Add Status Management (T024-T030) → Test toggle feature → Demo!
4. **+US3**: Add Todo Modification (T031-T039) → Test editing → Demo!
5. **+US4**: Add Todo Deletion (T040-T044) → Test deletion → Demo!
6. **+US5**: Add Error Handling (T045-T050) → Test edge cases → Demo!
7. **Polish**: Complete Phase 8 (T051-T062) → Final validation → Production ready!

Each story adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers:

1. **Together**: Complete Setup + Foundational (T001-T009)
2. **Once Foundational is done**:
   - Developer A: User Story 1 (T010-T023)
   - Developer B: User Story 2 (T024-T030) - can start in parallel after Phase 2
   - Developer C: User Story 3 (T031-T039) - can start in parallel after Phase 2
3. Stories complete independently and integrate naturally

---

## Task Summary

**Total Tasks**: 62

**Task Count by Phase**:
- Phase 1 (Setup): 4 tasks
- Phase 2 (Foundational): 5 tasks
- Phase 3 (US1 - Basic Management): 14 tasks
- Phase 4 (US2 - Status Management): 7 tasks
- Phase 5 (US3 - Modification): 9 tasks
- Phase 6 (US4 - Deletion): 5 tasks
- Phase 7 (US5 - Error Handling): 6 tasks
- Phase 8 (Polish): 12 tasks

**Parallel Opportunities**: 18 tasks marked [P] can run in parallel within their phase

**Independent Test Criteria**:
- US1: Add 2-3 todos, view list with IDs and status
- US2: Toggle todo complete/incomplete
- US3: Update todo title and description
- US4: Delete todo and verify removal
- US5: Attempt invalid inputs, verify error messages

**Suggested MVP Scope**: Phases 1-3 only (T001-T023) = 23 tasks for basic add/view functionality

**Estimated Implementation**:
- MVP (US1): ~350 lines of code
- Full feature (US1-5 + Polish): ~500 lines of code
- Timeline: Sequential execution ~2-3 days, Parallel execution ~1 day (with 3 developers)

---

## Notes

- [P] tasks = different files or different methods, no dependencies within phase
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No automated tests per research.md decision - manual testing via quickstart.md
- Commit after each logical task group (e.g., after completing a user story phase)
- Stop at any checkpoint to validate story independently
- All file paths use src/ prefix as defined in plan.md structure
- Follow constitution requirements: PEP 8, type hints, docstrings, max 50 lines/function, complexity ≤10
