# CLI Interface Contract

**Feature**: 001-todo-app
**Date**: 2026-01-01
**Type**: Console Interface Specification

## Overview

This document defines the console interface contract for the Todo Application. Since this is a CLI application (not REST/GraphQL), the "contract" defines the user interaction flows, menu structure, prompts, and expected outputs.

---

## Main Menu

### Display Format

```
=== Todo Application ===
1. Add Todo
2. View All Todos
3. Update Todo
4. Delete Todo
5. Mark Todo Complete/Incomplete
6. Exit

Enter choice (1-6):
```

### Input Contract

- **Valid Input**: Integer 1-6
- **Invalid Input Handling**:
  - Non-integer: Display "❌ Invalid input. Please enter a number between 1 and 6."
  - Out of range: Display "❌ Invalid choice. Please enter a number between 1 and 6."
  - After error: Re-display menu and prompt again

### Exit Behavior

- User selects option 6
- Display: "Goodbye! All data will be lost."
- Application terminates (exit code 0)

---

## Operation 1: Add Todo

### User Flow

```
1. User selects option 1 from main menu
2. System prompts for title
3. User enters title
4. System prompts for description (optional)
5. User enters description or presses Enter to skip
6. System creates todo and displays confirmation
7. Return to main menu
```

### Prompts and Responses

#### Title Prompt
```
Enter todo title: _
```

**Input Validation**:
- Strip whitespace from input
- If empty or whitespace-only: Display "❌ Error: Title cannot be empty. Please try again." and re-prompt
- If valid: Proceed to description prompt

#### Description Prompt
```
Enter description (optional, press Enter to skip): _
```

**Input Validation**:
- No validation required (empty is acceptable)
- Strip whitespace from input

#### Success Response
```
✅ Todo added successfully! (ID: {id})
```

**Variables**:
- `{id}`: The assigned todo ID (positive integer)

---

## Operation 2: View All Todos

### User Flow

```
1. User selects option 2 from main menu
2. System retrieves all todos
3. System displays formatted list
4. Return to main menu
```

### Display Format (With Todos)

```
=== Your Todos ===

[✓] 1. Buy groceries
    Description: Milk, eggs, bread

[ ] 2. Finish project
    Description: Complete Phase I implementation

[✓] 3. Call dentist

Total: 3 todos (2 incomplete, 1 complete)
```

**Format Rules**:
- Checkbox: `[✓]` for completed, `[ ]` for incomplete
- ID and Title: `{checkbox} {id}. {title}`
- Description: Indented 4 spaces, only shown if non-empty
- Blank line between todos
- Summary line at end: "Total: {n} todos ({incomplete} incomplete, {complete} complete)"

### Display Format (Empty List)

```
=== Your Todos ===

No todos yet. Add one to get started!
```

---

## Operation 3: Update Todo

### User Flow

```
1. User selects option 3 from main menu
2. System prompts for todo ID
3. User enters ID
4. System verifies ID exists and displays current todo
5. System prompts for new title (optional)
6. User enters new title or presses Enter to skip
7. System prompts for new description (optional)
8. User enters new description or presses Enter to skip
9. System updates todo and displays confirmation
10. Return to main menu
```

### Prompts and Responses

#### ID Prompt
```
Enter todo ID to update: _
```

**Input Validation**:
- Must be an integer
- If non-integer: Display "❌ Error: Please enter a valid number." and re-prompt
- If ID not found: Display "❌ Error: Todo not found. Please try again." and re-prompt
- If valid: Display current todo and continue

#### Current Todo Display
```
Current todo:
  [✓] 1. Buy groceries
  Description: Milk, eggs, bread
```

#### New Title Prompt
```
Enter new title (press Enter to keep current): _
```

**Input Validation**:
- If empty: Keep current title
- If provided: Strip whitespace, must be non-empty
- If whitespace-only: Display "❌ Error: Title cannot be empty. Please try again." and re-prompt

#### New Description Prompt
```
Enter new description (press Enter to keep current): _
```

**Input Validation**:
- If empty: Keep current description
- If provided: Strip whitespace, accept any value including empty string

#### Success Response
```
✅ Todo updated successfully!
```

---

## Operation 4: Delete Todo

### User Flow

```
1. User selects option 4 from main menu
2. System prompts for todo ID
3. User enters ID
4. System verifies ID exists
5. System deletes todo and displays confirmation
6. Return to main menu
```

### Prompts and Responses

#### ID Prompt
```
Enter todo ID to delete: _
```

**Input Validation**:
- Must be an integer
- If non-integer: Display "❌ Error: Please enter a valid number." and re-prompt
- If ID not found: Display "❌ Error: Todo not found. Please try again." and re-prompt
- If valid: Proceed to deletion

#### Success Response
```
✅ Todo deleted successfully!
```

---

## Operation 5: Mark Todo Complete/Incomplete

### User Flow

```
1. User selects option 5 from main menu
2. System prompts for todo ID
3. User enters ID
4. System verifies ID exists
5. System toggles completion status
6. System displays confirmation with new status
7. Return to main menu
```

### Prompts and Responses

#### ID Prompt
```
Enter todo ID to toggle: _
```

**Input Validation**:
- Must be an integer
- If non-integer: Display "❌ Error: Please enter a valid number." and re-prompt
- If ID not found: Display "❌ Error: Todo not found. Please try again." and re-prompt
- If valid: Proceed to toggle

#### Success Response (Marked Complete)
```
✅ Todo marked as complete!
```

#### Success Response (Marked Incomplete)
```
✅ Todo marked as incomplete!
```

**Logic**:
- If todo.completed was False: Display "complete" message
- If todo.completed was True: Display "incomplete" message

---

## Error Messages Reference

| Scenario | Message |
|----------|---------|
| Invalid menu choice (non-integer) | ❌ Invalid input. Please enter a number between 1 and 6. |
| Invalid menu choice (out of range) | ❌ Invalid choice. Please enter a number between 1 and 6. |
| Empty title on add/update | ❌ Error: Title cannot be empty. Please try again. |
| Invalid ID (non-integer) | ❌ Error: Please enter a valid number. |
| Todo ID not found | ❌ Error: Todo not found. Please try again. |

---

## Console Behavior Specifications

### Input/Output Buffering
- Flush stdout after each prompt to ensure immediate display
- Use `input()` for blocking user input

### Encoding
- UTF-8 encoding for all input/output
- Support unicode characters in titles and descriptions
- Fallback: ASCII-only mode if UTF-8 fails (display `[X]` instead of `[✓]`)

### Cross-Platform Compatibility
- Windows: Works in cmd.exe and PowerShell
- macOS/Linux: Works in standard terminal
- Clear screen: Not used (continuous scrolling interface)

### Color/Formatting
- No ANSI color codes (keep it simple)
- Use unicode checkmarks: ✓ for complete, space for incomplete
- Use emoji for messages: ✅ for success, ❌ for errors

---

## State Management

### Session State
- All todos stored in memory during session
- No auto-save or persistence
- Data lost on exit

### Warning on Startup
```
⚠️  Warning: This is an in-memory application. All data will be lost when you exit.
```

**Display**: Once at application startup before main menu

---

## Example Complete Session

```
⚠️  Warning: This is an in-memory application. All data will be lost when you exit.

=== Todo Application ===
1. Add Todo
2. View All Todos
3. Update Todo
4. Delete Todo
5. Mark Todo Complete/Incomplete
6. Exit

Enter choice (1-6): 1

Enter todo title: Buy groceries
Enter description (optional, press Enter to skip): Milk, eggs, bread
✅ Todo added successfully! (ID: 1)

=== Todo Application ===
1. Add Todo
2. View All Todos
3. Update Todo
4. Delete Todo
5. Mark Todo Complete/Incomplete
6. Exit

Enter choice (1-6): 2

=== Your Todos ===

[ ] 1. Buy groceries
    Description: Milk, eggs, bread

Total: 1 todos (1 incomplete, 0 complete)

=== Todo Application ===
1. Add Todo
2. View All Todos
3. Update Todo
4. Delete Todo
5. Mark Todo Complete/Incomplete
6. Exit

Enter choice (1-6): 5

Enter todo ID to toggle: 1
✅ Todo marked as complete!

=== Todo Application ===
1. Add Todo
2. View All Todos
3. Update Todo
4. Delete Todo
5. Mark Todo Complete/Incomplete
6. Exit

Enter choice (1-6): 6

Goodbye! All data will be lost.
```

---

## Contract Compliance

### Functional Requirements Mapping

| FR | Contract Element |
|----|------------------|
| FR-001 | ID display in all views, auto-generated |
| FR-002 | Todo display shows title, description, completed status |
| FR-003 | Operation 1 (Add Todo) |
| FR-004 | Operation 2 (View All Todos) |
| FR-005 | Operation 5 (Mark Complete) |
| FR-006 | Operation 5 (Mark Incomplete) |
| FR-007 | Operation 3 (Update Todo) |
| FR-008 | Operation 4 (Delete Todo) |
| FR-009 | Warning message, no save operations |
| FR-010 | Checkbox display [✓]/[ ] in view |
| FR-011 | Numbered menu, text prompts |
| FR-012 | Title validation with error message |
| FR-013 | ID validation with "not found" error |
| FR-014 | Menu validation with error message |
| FR-015 | Option 6 (Exit) |

### User Story Coverage

- **User Story 1 (P1)**: Operations 1 and 2
- **User Story 2 (P2)**: Operation 5
- **User Story 3 (P3)**: Operation 3
- **User Story 4 (P4)**: Operation 4
- **User Story 5 (P5)**: All error handling specifications

---

## Summary

This CLI interface contract defines:
- 6 menu options (5 operations + exit)
- Detailed prompts and validation for each operation
- Error messages and re-prompting behavior
- Display formats for todos (list view and individual)
- Success/failure feedback messages
- Session warnings about data persistence

**Phase 1 Contract Status**: ✅ COMPLETE
