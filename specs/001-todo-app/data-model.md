# Data Model: In-Memory Todo Console Application

**Feature**: 001-todo-app
**Date**: 2026-01-01
**Status**: Complete

## Overview

This document defines the data structures for the in-memory todo application. The model is intentionally simple, focusing on the core entity (Todo) and its management structure (TodoManager).

---

## Entity: Todo

**Purpose**: Represents a single todo item with all required attributes.

**Source**: Derived from FR-001, FR-002, Spec Key Entities section

### Attributes

| Attribute | Type | Required | Default | Validation | Description |
|-----------|------|----------|---------|------------|-------------|
| id | int | Yes | Auto-generated | Must be positive integer | Unique identifier, sequential starting from 1 |
| title | str | Yes | N/A | Non-empty, stripped | Main task description |
| description | str | No | "" (empty string) | None | Optional detailed description |
| completed | bool | Yes | False | None | Completion status (True = complete, False = incomplete) |

### Constraints

- **Uniqueness**: `id` must be unique across all todos in the system
- **ID Generation**: IDs are sequential integers starting from 1, assigned automatically on creation
- **ID Persistence**: Once assigned, an ID never changes. Deleted IDs are not reused.
- **Title Validation**: Title must not be empty or whitespace-only (enforced at input level)
- **Immutable ID**: The `id` field cannot be modified after creation

### State Transitions

```
[New Todo]
    ↓ (create with title)
[Incomplete Todo] ←→ [Complete Todo]
 (completed=False)  ↔  (completed=True)
                    toggle
    ↓ (delete)
[Deleted/Removed]
```

**Valid State Changes**:
1. Creation: None → Incomplete (completed=False)
2. Mark Complete: Incomplete → Complete (completed=True)
3. Mark Incomplete: Complete → Incomplete (completed=False)
4. Update: Any → Same state (title/description change only)
5. Delete: Any → Removed from system

### Implementation

```python
from dataclasses import dataclass

@dataclass
class Todo:
    """Represents a single todo item.

    Attributes:
        id: Unique identifier (positive integer)
        title: Main task description (non-empty string)
        description: Optional detailed description
        completed: Completion status (True = complete, False = incomplete)
    """
    id: int
    title: str
    description: str = ""
    completed: bool = False

    def __str__(self) -> str:
        """Return human-readable string representation."""
        status = "✓" if self.completed else " "
        return f"[{status}] {self.id}. {self.title}"
```

---

## Manager: TodoManager

**Purpose**: Manages the in-memory collection of todos and provides CRUD operations.

**Source**: Derived from FR-003 through FR-015

### State

| Attribute | Type | Description |
|-----------|------|-------------|
| _todos | dict[int, Todo] | Dictionary mapping todo ID to Todo object (O(1) lookup) |
| _next_id | int | Counter for next available ID (starts at 1, increments on each add) |

### Operations

#### 1. Add Todo
**Signature**: `add(title: str, description: str = "") -> int`

**Purpose**: Create a new todo and assign it a unique ID

**Preconditions**:
- title must be non-empty after stripping whitespace

**Postconditions**:
- New Todo created with next sequential ID
- Todo added to _todos dictionary
- _next_id incremented
- Returns the new todo ID

**Errors**: None (validation handled at CLI level per research.md Q4)

---

#### 2. Get All Todos
**Signature**: `get_all() -> list[Todo]`

**Purpose**: Retrieve all todos in ID order

**Preconditions**: None

**Postconditions**:
- Returns list of all Todo objects sorted by ID (ascending)
- Returns empty list if no todos exist

**Errors**: None

---

#### 3. Get Todo by ID
**Signature**: `get(todo_id: int) -> Todo | None`

**Purpose**: Retrieve a specific todo by its ID

**Preconditions**: None

**Postconditions**:
- Returns Todo object if found
- Returns None if ID does not exist

**Errors**: None (caller handles None case)

---

#### 4. Update Todo
**Signature**: `update(todo_id: int, title: str | None = None, description: str | None = None) -> bool`

**Purpose**: Modify the title and/or description of an existing todo

**Preconditions**:
- todo_id must exist in _todos
- At least one of title or description must be provided
- If title provided, must be non-empty after stripping

**Postconditions**:
- Todo title updated if title parameter provided
- Todo description updated if description parameter provided
- Returns True if update successful
- Returns False if todo not found

**Errors**: None (returns False for not found, validation at CLI level)

---

#### 5. Delete Todo
**Signature**: `delete(todo_id: int) -> bool`

**Purpose**: Remove a todo from the system

**Preconditions**:
- todo_id must exist in _todos

**Postconditions**:
- Todo removed from _todos dictionary
- ID is not reused (per spec assumption #1)
- Returns True if deletion successful
- Returns False if todo not found

**Errors**: None (returns False for not found)

---

#### 6. Toggle Completion Status
**Signature**: `toggle_complete(todo_id: int) -> bool`

**Purpose**: Toggle the completion status of a todo (complete ↔ incomplete)

**Preconditions**:
- todo_id must exist in _todos

**Postconditions**:
- Todo.completed flipped (True → False or False → True)
- Returns True if toggle successful
- Returns False if todo not found

**Errors**: None (returns False for not found)

**Note**: This operation handles both "mark complete" and "mark incomplete" as a toggle, simplifying the interface while meeting FR-005 and FR-006.

---

### Implementation

```python
class TodoManager:
    """Manages the in-memory collection of todos.

    Provides CRUD operations for todo items with O(1) lookup performance.
    """

    def __init__(self):
        """Initialize empty todo manager."""
        self._todos: dict[int, Todo] = {}
        self._next_id: int = 1

    def add(self, title: str, description: str = "") -> int:
        """Add a new todo item.

        Args:
            title: The todo title (non-empty)
            description: Optional description text

        Returns:
            The ID of the newly created todo
        """
        todo_id = self._next_id
        self._todos[todo_id] = Todo(
            id=todo_id,
            title=title,
            description=description,
            completed=False
        )
        self._next_id += 1
        return todo_id

    def get_all(self) -> list[Todo]:
        """Get all todos sorted by ID.

        Returns:
            List of all todo items in ID order (ascending)
        """
        return sorted(self._todos.values(), key=lambda t: t.id)

    def get(self, todo_id: int) -> Todo | None:
        """Get a specific todo by ID.

        Args:
            todo_id: The todo ID to retrieve

        Returns:
            The Todo object if found, None otherwise
        """
        return self._todos.get(todo_id)

    def update(self, todo_id: int, title: str | None = None,
               description: str | None = None) -> bool:
        """Update an existing todo.

        Args:
            todo_id: The ID of the todo to update
            title: New title (optional)
            description: New description (optional)

        Returns:
            True if update successful, False if todo not found
        """
        todo = self._todos.get(todo_id)
        if not todo:
            return False

        if title is not None:
            todo.title = title
        if description is not None:
            todo.description = description

        return True

    def delete(self, todo_id: int) -> bool:
        """Delete a todo by ID.

        Args:
            todo_id: The ID of the todo to delete

        Returns:
            True if deletion successful, False if todo not found
        """
        if todo_id in self._todos:
            del self._todos[todo_id]
            return True
        return False

    def toggle_complete(self, todo_id: int) -> bool:
        """Toggle the completion status of a todo.

        Args:
            todo_id: The ID of the todo to toggle

        Returns:
            True if toggle successful, False if todo not found
        """
        todo = self._todos.get(todo_id)
        if not todo:
            return False

        todo.completed = not todo.completed
        return True
```

---

## Data Flow

### Add Todo Flow
```
User Input (title, description)
    ↓
CLI validates (title non-empty)
    ↓
TodoManager.add(title, description)
    ↓
Creates Todo with next ID
    ↓
Stores in _todos dict
    ↓
Returns ID to CLI
    ↓
CLI displays success with ID
```

### View All Flow
```
User selects "View All"
    ↓
CLI calls TodoManager.get_all()
    ↓
Manager returns sorted list[Todo]
    ↓
CLI formats and displays each todo
```

### Update Todo Flow
```
User Input (ID, new title/description)
    ↓
CLI validates ID (calls get() first)
    ↓
CLI validates new data (title non-empty if provided)
    ↓
TodoManager.update(id, title, description)
    ↓
Updates Todo in _todos dict
    ↓
Returns success/failure
    ↓
CLI displays result
```

### Delete Todo Flow
```
User Input (ID)
    ↓
CLI validates ID exists
    ↓
TodoManager.delete(id)
    ↓
Removes from _todos dict
    ↓
Returns success/failure
    ↓
CLI displays result
```

### Toggle Complete Flow
```
User Input (ID)
    ↓
CLI validates ID exists
    ↓
TodoManager.toggle_complete(id)
    ↓
Flips completed boolean
    ↓
Returns success/failure
    ↓
CLI displays result with new status
```

---

## Validation Summary

| Validation Rule | Enforced By | Location |
|-----------------|-------------|----------|
| Title non-empty | CLI | Input prompting loop |
| ID exists | TodoManager | Returns None/False on not found |
| ID uniqueness | TodoManager | Auto-increment ensures uniqueness |
| ID immutability | Data Model | No setter for id field |
| Completed boolean | Data Model | Type hint + dataclass enforce bool |

---

## Performance Characteristics

| Operation | Time Complexity | Space Complexity | Notes |
|-----------|-----------------|------------------|-------|
| Add | O(1) | O(1) | Dict insertion + counter increment |
| Get by ID | O(1) | O(1) | Dict lookup |
| Get All | O(n log n) | O(n) | Sorting n todos |
| Update | O(1) | O(1) | Dict lookup + field assignment |
| Delete | O(1) | O(1) | Dict deletion |
| Toggle | O(1) | O(1) | Dict lookup + boolean flip |

**Overall Storage**: O(n) where n = number of todos

**Note**: Given spec constraint of 100 todos max (SC-003), all operations will complete in under 2 seconds.

---

## Summary

The data model consists of:
1. **Todo**: Simple dataclass with 4 fields (id, title, description, completed)
2. **TodoManager**: CRUD manager with 6 operations using dict-based storage

**Design Principles Applied**:
- **Simplicity**: Minimal structure matching exact requirements
- **Performance**: O(1) for all core operations except get_all
- **Type Safety**: Full type hints on all methods and fields
- **Immutability**: ID cannot change after creation
- **Validation**: Separated between CLI (user input) and Manager (business logic)

**Phase 1 Data Model Status**: ✅ COMPLETE
