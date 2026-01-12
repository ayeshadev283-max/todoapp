# CLI Interface Contract: Todo Application

**Feature**: 001-fullstack-web-app
**Date**: 2026-01-07
**Related Documents**: [spec.md](../spec.md) | [plan.md](../plan.md) | [data-model.md](../data-model.md)

## Overview

This document defines the command-line interface contracts for the todo application. It specifies the exact inputs, outputs, and error behaviors for all user-facing commands. This contract ensures consistent user experience and serves as a specification for implementation.

## Interface Model

**Type**: Interactive menu-driven command loop
**Interaction Pattern**: Display menu → User selects option → Execute command → Show result → Repeat

## Main Menu

### Display Format

```
=================================
       TODO APPLICATION
=================================

Available Commands:
1. Add Task
2. View All Tasks
3. Update Task
4. Delete Task
5. Toggle Task Status
6. Exit

Enter your choice (1-6):
```

### Input Contract

- **Type**: Integer (1-6)
- **Validation**: Must be numeric and within range
- **Invalid Input Handling**: Display error message, redisplay menu

### Error Response

```
Invalid choice. Please select a number between 1 and 6.

[Menu redisplays]
```

## Command 1: Add Task

### Purpose

Create a new task with required title and optional description.

### Interaction Flow

```
Enter task title: [user input]
Enter task description (optional, press Enter to skip): [user input]

✓ Task created successfully!
  ID: 1
  Title: Buy groceries
  Description: Get milk, eggs, bread
  Status: [ ] Incomplete
```

### Input Contract

| Field | Required | Type | Constraints | Validation |
|-------|----------|------|-------------|------------|
| Title | Yes | String | Non-empty, not whitespace-only | Pre-creation |
| Description | No | String | Any (including empty) | None |

### Success Response

```
✓ Task created successfully!
  ID: {id}
  Title: {title}
  Description: {description}  [omitted if empty]
  Status: [ ] Incomplete
```

### Error Responses

**Empty Title**:
```
✗ Error: Title cannot be empty. Please provide a title.

[Return to main menu]
```

### Postconditions

- New task added to storage with auto-generated ID
- Task visible in "View All Tasks" command
- ID counter incremented

## Command 2: View All Tasks

### Purpose

Display all tasks in the system with their details and status.

### Interaction Flow

```
=================================
         ALL TASKS
=================================

ID: 1
Title: Buy groceries
Description: Get milk, eggs, bread
Status: [ ] Incomplete

---

ID: 2
Title: Call dentist
Status: [✓] Complete

---

Total tasks: 2
```

### Input Contract

None (no user input required)

### Success Response (Tasks Exist)

```
=================================
         ALL TASKS
=================================

[For each task:]
ID: {id}
Title: {title}
Description: {description}  [omitted if empty]
Status: {status_indicator} {status_text}

---

Total tasks: {count}
```

**Status Indicators**:
- `[✓] Complete` - Task is done
- `[ ] Incomplete` - Task is pending

### Success Response (No Tasks)

```
=================================
         ALL TASKS
=================================

No tasks found. Use 'Add Task' to create your first task.

Total tasks: 0
```

### Error Responses

None (always succeeds, may return empty list)

### Postconditions

- No state changes (read-only operation)

## Command 3: Update Task

### Purpose

Modify the title and/or description of an existing task.

### Interaction Flow

```
Enter task ID to update: 1
Current title: Buy groceries
New title (press Enter to keep current): Buy groceries and toiletries
Current description: Get milk, eggs
New description (press Enter to keep current): Get milk, eggs, bread

✓ Task updated successfully!
  ID: 1
  Title: Buy groceries and toiletries
  Description: Get milk, eggs, bread
  Status: [ ] Incomplete
```

### Input Contract

| Field | Required | Type | Constraints | Validation |
|-------|----------|------|-------------|------------|
| Task ID | Yes | Integer | Must be positive, must exist | Pre-operation |
| New Title | No* | String | If provided, non-empty | On input |
| New Description | No | String | Any (including empty) | None |

*If user presses Enter without input, current value is kept

### Success Response

```
✓ Task updated successfully!
  ID: {id}
  Title: {updated_title}
  Description: {updated_description}  [omitted if empty]
  Status: {status_indicator} {status_text}
```

### Error Responses

**Invalid ID Format**:
```
✗ Error: Invalid ID format. Please enter a numeric ID.

[Return to main menu]
```

**Task Not Found**:
```
✗ Error: Task ID {id} not found. Use 'View All Tasks' to see existing tasks.

[Return to main menu]
```

**Empty Title Provided**:
```
✗ Error: Title cannot be empty. Please provide a title or press Enter to keep current.

[Re-prompt for title]
```

### Postconditions

- Task title and/or description updated in storage
- Task ID and completion status unchanged
- Changes visible in "View All Tasks"

## Command 4: Delete Task

### Purpose

Permanently remove a task from the system.

### Interaction Flow

```
Enter task ID to delete: 2

✓ Task deleted successfully!
  Deleted task ID: 2
  Title: Call dentist
```

### Input Contract

| Field | Required | Type | Constraints | Validation |
|-------|----------|------|-------------|------------|
| Task ID | Yes | Integer | Must be positive, must exist | Pre-operation |

### Success Response

```
✓ Task deleted successfully!
  Deleted task ID: {id}
  Title: {title}
```

### Error Responses

**Invalid ID Format**:
```
✗ Error: Invalid ID format. Please enter a numeric ID.

[Return to main menu]
```

**Task Not Found**:
```
✗ Error: Task ID {id} not found. Use 'View All Tasks' to see existing tasks.

[Return to main menu]
```

### Postconditions

- Task removed from storage
- ID never reused (counter not decremented)
- Task no longer appears in "View All Tasks"

## Command 5: Toggle Task Status

### Purpose

Mark a task as complete or revert it to incomplete.

### Interaction Flow

```
Enter task ID to toggle status: 1

✓ Task status updated!
  ID: 1
  Title: Buy groceries
  Status: [✓] Complete
```

### Input Contract

| Field | Required | Type | Constraints | Validation |
|-------|----------|------|-------------|------------|
| Task ID | Yes | Integer | Must be positive, must exist | Pre-operation |

### Success Response

```
✓ Task status updated!
  ID: {id}
  Title: {title}
  Status: {new_status_indicator} {new_status_text}
```

**Status Transitions**:
- `[ ] Incomplete` → `[✓] Complete`
- `[✓] Complete` → `[ ] Incomplete`

### Error Responses

**Invalid ID Format**:
```
✗ Error: Invalid ID format. Please enter a numeric ID.

[Return to main menu]
```

**Task Not Found**:
```
✗ Error: Task ID {id} not found. Use 'View All Tasks' to see existing tasks.

[Return to main menu]
```

### Postconditions

- Task completion status toggled in storage
- Task ID, title, and description unchanged
- Status change visible in "View All Tasks"

## Command 6: Exit

### Purpose

Exit the application with data loss warning.

### Interaction Flow

```
⚠  Warning: All data will be lost when you exit (in-memory storage only).
Are you sure you want to exit? (y/n): y

Thank you for using Todo Application. Goodbye!

[Application terminates]
```

### Input Contract

| Field | Required | Type | Constraints | Validation |
|-------|----------|------|-------------|------------|
| Confirmation | Yes | String | 'y' or 'n' (case-insensitive) | On input |

### Success Response (Exit Confirmed)

```
Thank you for using Todo Application. Goodbye!

[Application exits with code 0]
```

### Cancel Response (Exit Cancelled)

```
Exit cancelled. Returning to main menu.

[Menu redisplays]
```

### Error Responses

**Invalid Confirmation**:
```
Invalid input. Please enter 'y' for yes or 'n' for no.

[Re-prompt for confirmation]
```

### Postconditions (on exit)

- Application terminates
- All task data lost (in-memory storage cleared)
- Exit code 0 (normal termination)

## General Error Handling

### Principles

1. **User-Friendly**: Error messages explain what went wrong and how to fix it
2. **Non-Fatal**: Errors return to main menu, never crash the application
3. **Consistent Format**: All errors use `✗ Error: {message}` format
4. **Guidance**: Error messages suggest next steps

### Error Message Template

```
✗ Error: {clear description of problem}

[Suggested action or automatic recovery]
```

### Unhandled Exceptions

In the unlikely event of an unexpected error:

```
✗ Unexpected Error: An internal error occurred.
  Details: {exception message}

Please report this issue. Returning to main menu.
```

## Input Validation Rules

### Integer Input (IDs, Menu Choices)

```python
def validate_integer_input(prompt: str, min_val: int | None = None, max_val: int | None = None) -> int:
    """
    Prompts user for integer input with validation.

    Args:
        prompt: Message to display to user
        min_val: Minimum acceptable value (inclusive)
        max_val: Maximum acceptable value (inclusive)

    Returns:
        Valid integer within specified range
    """
```

### String Input (Titles, Descriptions)

```python
def validate_string_input(prompt: str, allow_empty: bool = False) -> str:
    """
    Prompts user for string input with validation.

    Args:
        prompt: Message to display to user
        allow_empty: Whether empty strings are acceptable

    Returns:
        Valid string (non-empty if allow_empty=False)
    """
```

## Display Formatting

### Success Indicators

- `✓` - Green checkmark for successful operations
- `[✓]` - Completed task status
- `[ ]` - Incomplete task status

### Error Indicators

- `✗` - Red X for errors

### Warning Indicators

- `⚠` - Yellow warning triangle for important notices

### Section Separators

```
=================================
```

### Task Separators

```
---
```

## Accessibility Notes

### UTF-8 Support

Primary display uses UTF-8 characters (`✓`, `✗`, `⚠`). If terminal doesn't support UTF-8:

**ASCII Fallback**:
- `✓` → `[OK]`
- `✗` → `[ERROR]`
- `⚠` → `[!]`
- `[✓]` → `[X]` (Complete)
- `[ ]` → `[ ]` (Incomplete)

### Screen Reader Compatibility

- Use text status (`Complete` / `Incomplete`) alongside symbols
- Provide clear section headers
- Consistent menu structure

## Performance Contract

### Response Times

All commands MUST respond within:
- **Menu display**: Instant (<10ms)
- **Add task**: <100ms
- **View tasks**: <100ms (for reasonable task counts <10,000)
- **Update task**: <100ms
- **Delete task**: <100ms
- **Toggle status**: <100ms

### Scalability

Interface remains usable with:
- Up to 10,000 tasks (view command may scroll)
- Task titles up to 1,000 characters
- Descriptions up to 10,000 characters

## Security Considerations

### Input Sanitization

- **No SQL Injection Risk**: No database (in-memory only)
- **No Command Injection Risk**: No shell commands executed
- **No XSS Risk**: Console output only, no web rendering

### Data Validation

- ID format validated before lookup (prevent type errors)
- Title validated before storage (prevent empty tasks)
- All input treated as untrusted

## Testing Scenarios

### Happy Path

1. Launch app → Add task → View tasks → Task visible
2. Add task → Toggle status → View tasks → Status changed
3. Add task → Update task → View tasks → Changes reflected
4. Add task → Delete task → View tasks → Task removed
5. Add multiple tasks → View all → All visible in order

### Error Handling

1. Enter invalid menu choice (e.g., "abc", "99") → Error shown, menu redisplays
2. Add task with empty title → Error shown, retry
3. Update non-existent ID → Error shown, return to menu
4. Delete non-existent ID → Error shown, return to menu
5. Toggle non-existent ID → Error shown, return to menu

### Edge Cases

1. View tasks when none exist → "No tasks found" message
2. Add task with very long title (>1000 chars) → Accepted, displayed
3. Add task with only description (empty title) → Validation error
4. Update task, keep current title → No changes, success message
5. Exit → Decline → Return to menu

## Mapping to Functional Requirements

| FR Reference | CLI Contract Implementation |
|--------------|------------------------------|
| FR-001 | Command 1: Add Task (title required, description optional) |
| FR-002 | ID auto-generated and displayed in success response |
| FR-003 | Command 2: View All Tasks (displays ID, title, description, status) |
| FR-004 | Command 5: Toggle Task Status (mark complete/incomplete by ID) |
| FR-005 | Command 3: Update Task (modify title/description by ID) |
| FR-006 | Command 4: Delete Task (remove by ID) |
| FR-007 | Error responses defined for all invalid inputs |
| FR-009 | Menu-driven interface with clear prompts and feedback |
| FR-010 | Status indicators `[✓]` and `[ ]` in display |
| FR-011 | Command 6: Exit (graceful termination) |
| FR-012 | Exit warning about data loss |

## References

- Feature Specification: [spec.md](../spec.md)
- Implementation Plan: [plan.md](../plan.md)
- Data Model: [data-model.md](../data-model.md)
