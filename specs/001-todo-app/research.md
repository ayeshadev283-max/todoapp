# Research: In-Memory Todo Console Application

**Feature**: 001-todo-app
**Date**: 2026-01-01
**Status**: Complete

## Research Questions

This document addresses technical decisions and clarifications needed for the implementation plan.

---

## Q1: Testing Strategy - Manual vs Automated

**Context**: The specification defines success criteria and acceptance scenarios, but doesn't mandate automated testing infrastructure. Constitution states "No testing frameworks or CI pipelines" in out-of-scope.

**Research Objective**: Determine appropriate testing approach that balances quality verification with scope constraints.

### Options Considered

1. **Manual Testing Only**
   - Pros: Aligns with out-of-scope (no testing frameworks), simpler setup, faster initial development
   - Cons: Less reproducible, requires manual verification steps, harder to validate regressions
   - Effort: Low

2. **Automated Testing with pytest**
   - Pros: Reproducible, automated verification, catches regressions, demonstrates professional practices
   - Cons: Adds dependency (pytest via UV), increases scope, requires test infrastructure
   - Effort: Medium

3. **Standard Library unittest**
   - Pros: No external dependencies (built into Python), reproducible, professional approach
   - Cons: More verbose than pytest, still requires test infrastructure
   - Effort: Medium

### Decision

**Selected**: Manual Testing with Documented Test Scenarios

**Rationale**:
- Constitution explicitly excludes "testing frameworks or CI pipelines" from Phase I scope
- Specification SC-005 requires "documented setup and usage instructions" - we can include manual test procedures here
- Spec SC-004 requires "100% of invalid inputs result in clear error messages" - this can be verified manually
- Keeping scope minimal aligns with "demonstrate process discipline, not feature richness"
- Manual testing scenarios can be converted to automated tests in a future phase if needed

**Implementation Approach**:
- Create comprehensive manual testing checklist in quickstart.md
- Include step-by-step test scenarios matching each acceptance criterion from spec
- Provide expected outputs for verification
- Document edge cases and error scenarios to manually verify

**Alternatives Rejected**:
- pytest rejected due to out-of-scope constraint and added complexity
- unittest rejected to maintain minimal scope and zero external dependencies philosophy

---

## Q2: Console Interface Design Pattern

**Context**: Application needs user-friendly console interface for 5 CRUD operations plus help and exit.

**Research Objective**: Determine best pattern for console menu interaction that is intuitive and maintainable.

### Options Considered

1. **Numbered Menu (1-6 selection)**
   - Display menu, user enters number (1=Add, 2=View, 3=Update, 4=Delete, 5=Mark, 6=Exit)
   - Pros: Simple, familiar pattern, easy to implement, clear visual hierarchy
   - Cons: Requires remembering numbers, less memorable than commands

2. **Command-based (add/view/update/delete/mark/exit)**
   - User types command names directly
   - Pros: More memorable, feels more "power user" friendly, extensible
   - Cons: Requires exact spelling, harder for discovery, more error handling

3. **Hybrid (menu + command shortcuts)**
   - Display numbered menu but also accept command names
   - Pros: Best of both worlds, accommodates different user preferences
   - Cons: More complex parsing, potentially confusing

### Decision

**Selected**: Numbered Menu with Clear Labels

**Rationale**:
- Spec assumption #6 states "Application uses a numbered menu system"
- Aligns with target audience (evaluators/reviewers) who want quick, obvious interaction
- Minimizes user errors and confusion
- Reduces code complexity (simple integer parsing vs command parsing)
- Better for first-time users (self-documenting)

**Implementation Approach**:
```
=== Todo Application ===
1. Add Todo
2. View All Todos
3. Update Todo
4. Delete Todo
5. Mark Todo Complete/Incomplete
6. Exit

Enter choice (1-6): _
```

**Alternatives Rejected**:
- Command-based rejected due to higher learning curve and error potential
- Hybrid rejected as over-engineering for simple 5-operation app

---

## Q3: Data Structure for In-Memory Storage

**Context**: Need efficient in-memory storage for todos with ID-based lookup, iteration, and management.

**Research Objective**: Select optimal Python data structure(s) for todo storage.

### Options Considered

1. **Dictionary (ID → Todo)**
   - `todos: dict[int, Todo]`
   - Pros: O(1) lookup by ID, natural key-value mapping, easy to check existence
   - Cons: Does not preserve insertion order explicitly, need separate ID counter

2. **List of Todos**
   - `todos: list[Todo]`
   - Pros: Preserves order, simple iteration, automatic indexing
   - Cons: O(n) lookup by ID, less intuitive for ID-based operations

3. **Hybrid (dict + counter)**
   - Dictionary for storage + separate ID counter variable
   - Pros: Best performance, clear ID generation, natural CRUD operations
   - Cons: Slightly more complex (two variables to maintain)

### Decision

**Selected**: Dictionary with ID Counter

**Rationale**:
- ID-based operations (FR-005, FR-006, FR-007, FR-008) are core to the application
- O(1) lookup critical for good user experience
- Specification assumption #1: "Todo IDs will be sequential integers starting from 1"
- Dictionary maintains insertion order in Python 3.7+ (guaranteed in 3.13+)
- Separate counter provides clear, explicit ID generation logic

**Implementation Approach**:
```python
class TodoManager:
    def __init__(self):
        self._todos: dict[int, Todo] = {}
        self._next_id: int = 1

    def add(self, title: str, description: str = "") -> int:
        todo_id = self._next_id
        self._todos[todo_id] = Todo(todo_id, title, description)
        self._next_id += 1
        return todo_id
```

**Alternatives Rejected**:
- List rejected due to O(n) lookup performance concern
- Plain dict without counter rejected due to less explicit ID management

---

## Q4: Error Handling Strategy

**Context**: Spec requires graceful error handling (FR-012, FR-013, FR-014) with clear messages.

**Research Objective**: Define error handling pattern that is consistent and user-friendly.

### Options Considered

1. **Exception-based (raise custom exceptions)**
   - Raise TodoNotFoundError, InvalidInputError, etc.
   - Pros: Pythonic, clear error semantics, separates error handling from logic
   - Cons: More complex for simple CLI app, might be over-engineering

2. **Return codes (None/-1 for errors)**
   - Functions return None or -1 to indicate errors
   - Pros: Simple, no exception overhead
   - Cons: Easy to ignore errors, less Pythonic, unclear error reasons

3. **Validation + user feedback (validate then prompt)**
   - Validate input, display error message, re-prompt user
   - Pros: Best UX for CLI, keeps user in flow, clear and immediate
   - Cons: Requires loop structures in UI layer

### Decision

**Selected**: Input Validation with User Re-prompting

**Rationale**:
- Spec SC-004: "100% of invalid inputs result in clear error messages"
- Spec User Story 5 acceptance scenarios show re-prompting behavior
- Best user experience for interactive console application
- Keeps error handling simple and localized
- No need for complex exception hierarchy for 5 operations

**Implementation Approach**:
```python
def get_todo_id() -> int:
    """Prompt for todo ID with validation."""
    while True:
        try:
            todo_id = int(input("Enter todo ID: "))
            if todo_id in self._todos:
                return todo_id
            print("Error: Todo not found. Please try again.")
        except ValueError:
            print("Error: Please enter a valid number.")

def get_title() -> str:
    """Prompt for title with validation."""
    while True:
        title = input("Enter title: ").strip()
        if title:
            return title
        print("Error: Title cannot be empty. Please try again.")
```

**Alternatives Rejected**:
- Exception-based rejected as over-engineering for simple CLI scope
- Return codes rejected as less Pythonic and harder to track error reasons

---

## Q5: Code Organization and Module Structure

**Context**: Constitution requires clean code with separated concerns and single responsibility.

**Research Objective**: Determine module structure that balances simplicity with maintainability.

### Options Considered

1. **Single File (main.py)**
   - All code in one file: Todo class, manager, UI, main loop
   - Pros: Simplest, easy to navigate for small project, no import complexity
   - Cons: Violates separation of concerns, harder to test, less professional

2. **Three Modules (models, manager, cli)**
   - models.py: Todo dataclass
   - manager.py: TodoManager with CRUD operations
   - cli.py: Console interface and main loop
   - Pros: Clean separation, testable, follows SRP, professional structure
   - Cons: More files to manage, slight overkill for ~500 LOC

3. **Package Structure (src/todo/...)**
   - Full package with __init__.py, separate test directory
   - Pros: Most professional, very clear organization
   - Cons: Over-engineering for simple demo app, adds complexity

### Decision

**Selected**: Three Module Structure (models, manager, cli)

**Rationale**:
- Constitution IV: "Separated concerns with single-responsibility functions/classes"
- Allows independent testing of data layer (models), business logic (manager), and UI (cli)
- Demonstrates professional practices for evaluators
- Still simple enough for ~500 LOC scope
- Clear mental model: data → operations → interface

**Implementation Approach**:
```
src/
├── models.py      # Todo dataclass with type hints
├── manager.py     # TodoManager class with CRUD methods
├── cli.py         # Console UI and main loop
└── __main__.py    # Entry point (python -m src)
```

**Alternatives Rejected**:
- Single file rejected due to constitution requirement for separated concerns
- Package structure rejected as over-engineering for Phase I scope

---

## Q6: Type Safety and Documentation Standards

**Context**: Constitution requires type hints for all function signatures and docstrings for public functions.

**Research Objective**: Define specific standards for type hints and documentation.

### Decision

**Type Hints Standard**:
- Use Python 3.13+ modern syntax: `list[Todo]` not `List[Todo]`
- Type all function parameters and return values
- Use dataclass for Todo with typed fields
- Use `Optional[X]` for nullable values (e.g., description)
- No need for mypy validation (out of scope) but code should be mypy-ready

**Documentation Standard**:
- Google-style docstrings for all public methods and classes
- Include Args, Returns, and brief description
- Example:
  ```python
  def add_todo(self, title: str, description: str = "") -> int:
      """Add a new todo item.

      Args:
          title: The todo title (required, non-empty)
          description: Optional description text

      Returns:
          The ID of the newly created todo
      """
  ```

**Rationale**: Aligns with constitution code quality requirements while keeping scope appropriate for Phase I.

---

## Summary

All technical clarifications resolved:

| Question | Decision | Impact |
|----------|----------|--------|
| Testing Strategy | Manual testing with documented scenarios | Keeps scope minimal, aligns with out-of-scope constraints |
| Console Interface | Numbered menu (1-6) | Simple, user-friendly, matches spec assumptions |
| Data Structure | dict[int, Todo] + counter | O(1) lookups, clear ID management |
| Error Handling | Validation + re-prompting | Best CLI UX, simple implementation |
| Module Structure | 3 files (models, manager, cli) | Separation of concerns, professional yet simple |
| Type Safety | Full type hints + Google docstrings | Meets constitution quality requirements |

**Phase 0 Status**: ✅ COMPLETE - Proceed to Phase 1 (Design & Contracts)
