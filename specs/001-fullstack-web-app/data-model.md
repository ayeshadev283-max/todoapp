# Data Model: In-Memory Todo Application

**Feature**: 001-fullstack-web-app
**Date**: 2026-01-07
**Related Documents**: [spec.md](./spec.md) | [plan.md](./plan.md)

## Overview

This document defines the data entities, validation rules, and state transitions for the todo application. The data model is intentionally minimal to align with the specification's focus on simplicity and demonstration of clean architecture principles.

## Core Entity: Task

### Description

A `Task` represents a single todo item in the system. It encapsulates all information needed to track a user's action item, including unique identification, descriptive content, and completion state.

### Attributes

| Attribute | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `id` | `int` | Yes | Auto-generated | Unique identifier, sequential starting from 1 |
| `title` | `str` | Yes | None | Short description of the task (user-provided) |
| `description` | `str` | No | Empty string (`""`) | Optional detailed notes or context |
| `completed` | `bool` | Yes | `False` | Completion status: `True` = complete, `False` = incomplete |

### Attribute Specifications

#### `id` (int)
- **Purpose**: Unique identifier for task lookup and modification
- **Generation**: Auto-incremented by `TaskService`, starting from 1
- **Immutability**: Never changes after creation, never reused (even after deletion)
- **Range**: Positive integers (1, 2, 3, ...)
- **Uniqueness**: Guaranteed unique within a single application session

#### `title` (str)
- **Purpose**: Primary description of what needs to be done
- **Constraints**:
  - Cannot be empty (validation enforced)
  - No maximum length (reasonable usage assumed)
  - Supports UTF-8 characters
- **Mutability**: Can be updated via update operation
- **Display**: Always shown in task listings

#### `description` (str)
- **Purpose**: Optional additional context, notes, or subtasks
- **Constraints**:
  - Optional (can be empty)
  - No maximum length (reasonable usage assumed)
  - Supports UTF-8 characters
- **Mutability**: Can be updated via update operation
- **Display**: Only shown if non-empty (graceful omission)

#### `completed` (bool)
- **Purpose**: Tracks whether the task has been finished
- **Values**:
  - `False`: Task is incomplete (default state)
  - `True`: Task is complete
- **Mutability**: Toggle via completion status command
- **Display**: Visual indicators `[✓]` (complete) or `[ ]` (incomplete)

## Data Structure

### Python Implementation

The `Task` entity is implemented as a Python `dataclass` for simplicity and type safety:

```python
from dataclasses import dataclass

@dataclass
class Task:
    """
    Represents a single todo item.

    Attributes:
        id: Unique identifier (auto-generated, immutable)
        title: Task description (required, mutable)
        description: Optional additional details (mutable)
        completed: Completion status (default: False, mutable)
    """
    id: int
    title: str
    description: str = ""
    completed: bool = False
```

### Rationale for Dataclass

- **Simplicity**: Built-in Python feature, no external dependencies
- **Type Safety**: Enforces type hints for all attributes
- **Immutability Option**: Can use `frozen=True` if needed (not required for this scope)
- **Auto-generated Methods**: `__init__`, `__repr__`, `__eq__` provided automatically
- **Constitution Compliance**: Aligns with clean code and minimal complexity principles

## Validation Rules

### Title Validation

| Rule | Enforcement | Error Message |
|------|-------------|---------------|
| Title must not be empty | Pre-creation, Pre-update | "Title cannot be empty. Please provide a title." |
| Title must not be whitespace-only | Pre-creation, Pre-update | "Title cannot be empty. Please provide a title." |

**Validation Location**: `lib/validators.py::validate_title()`

**Implementation**:
```python
def validate_title(title: str) -> bool:
    """Validates that title is non-empty and not just whitespace."""
    return bool(title and title.strip())
```

### ID Validation

| Rule | Enforcement | Error Message |
|------|-------------|---------------|
| ID must be a positive integer | Pre-lookup, Pre-update, Pre-delete | "Invalid ID format. Please enter a numeric ID." |
| ID must exist in storage | Pre-lookup, Pre-update, Pre-delete | "Task ID {id} not found. Use 'view' to see existing tasks." |

**Validation Location**: `lib/validators.py::validate_id_format()`, `services/task_service.py::_task_exists()`

**Implementation**:
```python
def validate_id_format(id_input: str) -> tuple[bool, int | None]:
    """
    Validates ID format and converts to integer.

    Returns:
        (True, id) if valid positive integer
        (False, None) if invalid
    """
    try:
        task_id = int(id_input)
        return (task_id > 0, task_id if task_id > 0 else None)
    except ValueError:
        return (False, None)
```

### Description Validation

| Rule | Enforcement | Note |
|------|-------------|------|
| Description can be empty | Always allowed | Default to empty string if not provided |
| Description can contain any UTF-8 | Always allowed | No sanitization needed for console output |

**Rationale**: Description is optional and unconstrained to maximize user flexibility.

## State Transitions

### Task Lifecycle

```
┌─────────────┐
│   Created   │ (id assigned, title set, description optional, completed=False)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Incomplete  │ ◄──────┐
└──────┬──────┘        │
       │               │
       │ toggle_status │ toggle_status
       │               │
       ▼               │
┌─────────────┐        │
│  Complete   │ ───────┘
└──────┬──────┘
       │
       │ delete
       ▼
┌─────────────┐
│   Deleted   │ (removed from storage, ID never reused)
└─────────────┘
```

### State Transition Table

| Current State | Action | New State | Side Effects |
|--------------|--------|-----------|--------------|
| N/A | `add_task` | Incomplete | ID auto-generated, title set, description set (if provided), completed=False |
| Incomplete | `toggle_status` | Complete | completed=True, visible in listings as "[✓]" |
| Complete | `toggle_status` | Incomplete | completed=False, visible in listings as "[ ]" |
| Any | `update_task` | Same | title and/or description modified, ID and completed unchanged |
| Any | `delete_task` | Deleted | Task removed from storage, ID never reused |
| Any | `list_tasks` | Same | No state change, read-only operation |
| Any | `get_task` | Same | No state change, read-only operation |

### Transition Constraints

- **ID Immutability**: Once assigned, ID never changes
- **No Resurrection**: Deleted tasks cannot be restored (no undo)
- **No Status on Update**: Updating title/description does not affect completion status
- **Toggle Independence**: Completion status can be toggled unlimited times

## Storage Implementation

### In-Memory Storage Structure

```python
# In TaskService class
_tasks: dict[int, Task] = {}  # Dictionary mapping task ID to Task object
_next_id: int = 1             # Counter for ID generation
```

### Storage Characteristics

- **Type**: Python dictionary (`dict[int, Task]`)
- **Key**: Task ID (integer)
- **Value**: Task object (dataclass instance)
- **Persistence**: None (data lost on application exit)
- **Capacity**: Limited only by system memory (Python dict scales efficiently)
- **Performance**: O(1) lookup, insert, delete by ID

### ID Generation Algorithm

```python
def _generate_id(self) -> int:
    """
    Generates next sequential ID.

    Returns:
        Next available integer ID
    """
    current_id = self._next_id
    self._next_id += 1
    return current_id
```

**Properties**:
- Sequential: IDs are assigned 1, 2, 3, ...
- Monotonic: Always increasing
- No Reuse: Deleted task IDs are never reassigned
- Thread-unsafe: Acceptable for single-threaded console application

## Edge Cases

### Empty Collection

**Scenario**: No tasks exist in storage

**Behavior**:
- `list_tasks()`: Returns empty list `[]`
- `get_task(id)`: Returns `None` for any ID
- Display: Shows "No tasks found" message

### ID Not Found

**Scenario**: User references non-existent task ID

**Behavior**:
- `get_task(id)`: Returns `None`
- `update_task(id, ...)`: Raises/returns error
- `delete_task(id)`: Raises/returns error
- `toggle_status(id)`: Raises/returns error
- Error message: "Task ID {id} not found. Use 'view' to see existing tasks."

### Large ID Values

**Scenario**: ID counter reaches very large numbers

**Behavior**:
- Python integers have unlimited precision
- No overflow possible
- Performance remains O(1) for dict operations

### Empty Description Handling

**Scenario**: Task created or updated with empty description

**Behavior**:
- Stored as empty string `""`
- Display omits description field entirely (or shows "Description: (none)")
- No validation error

### Unicode in Title/Description

**Scenario**: User enters non-ASCII characters (emoji, accented characters, etc.)

**Behavior**:
- Fully supported (UTF-8 strings)
- Displayed as-is in terminal (assumes UTF-8 support)
- ASCII fallback for status indicators if terminal doesn't support UTF-8

## Relationship to Specification

### Mapping to Functional Requirements

| FR Reference | Data Model Implementation |
|--------------|---------------------------|
| FR-001 | Task entity with `title` (required) and `description` (optional) |
| FR-002 | `id` attribute, auto-generated sequential integers starting from 1 |
| FR-003 | All attributes exposed for display |
| FR-004 | `completed` boolean attribute, toggled by service |
| FR-005 | `title` and `description` are mutable |
| FR-006 | Tasks removable from `_tasks` dict |
| FR-008 | `_tasks` dict is in-memory only |

### Mapping to Key Entities

| Spec Entity | Data Model Implementation |
|-------------|---------------------------|
| Task (id, title, description, status) | `Task` dataclass with `id: int`, `title: str`, `description: str`, `completed: bool` |

## Future Considerations (Out of Scope)

The following are explicitly not included but documented for future reference:

- **Persistence**: Saving/loading tasks to/from files or databases
- **Timestamps**: Created date, modified date, completed date
- **Priority**: Task priority levels (high, medium, low)
- **Categories**: Tags, projects, or categories
- **Due Dates**: Deadlines or reminders
- **Subtasks**: Nested or hierarchical tasks
- **Sharing**: Multi-user or collaboration features
- **History**: Audit trail of changes

## References

- Feature Specification: [spec.md](./spec.md) - Section "Key Entities"
- Implementation Plan: [plan.md](./plan.md) - Section "Architecture Decisions"
- Constitution: [.specify/memory/constitution.md](../../.specify/memory/constitution.md)
