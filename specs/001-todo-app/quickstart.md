# Quickstart Guide: Todo Console Application

**Feature**: 001-todo-app
**Date**: 2026-01-01
**Target Audience**: Evaluators and developers testing the application

## Overview

This guide provides step-by-step instructions for setting up, running, and manually testing the Todo Console Application. Follow these steps to verify all functionality works as specified.

---

## Prerequisites

Before you begin, ensure you have:

1. **Python 3.13 or higher**
   - Check version: `python --version` or `python3 --version`
   - Download: https://www.python.org/downloads/

2. **UV Package Manager**
   - Install: `pip install uv` or `pip3 install uv`
   - Verify: `uv --version`

3. **Terminal/Console**
   - Windows: Command Prompt, PowerShell, or Windows Terminal
   - macOS/Linux: Any terminal emulator
   - UTF-8 encoding support recommended

---

## Setup Instructions

### Step 1: Navigate to Project Directory

```bash
cd /path/to/todo
```

### Step 2: Install Dependencies (if any)

```bash
uv sync
```

**Note**: Phase I uses only Python standard library, so this step may show "no dependencies to install."

### Step 3: Verify Python Version

```bash
python --version
```

**Expected Output**: Python 3.13.0 or higher

If you see Python 3.12 or lower, you may need to use `python3.13` explicitly or update your Python installation.

---

## Running the Application

### Start the Application

```bash
python -m src
```

Or, if your system requires:

```bash
python3 -m src
```

### Expected Startup

You should see:

```
⚠️  Warning: This is an in-memory application. All data will be lost when you exit.

=== Todo Application ===
1. Add Todo
2. View All Todos
3. Update Todo
4. Delete Todo
5. Mark Todo Complete/Incomplete
6. Exit

Enter choice (1-6):
```

### Exiting the Application

- Enter `6` at the main menu
- Press `Ctrl+C` (emergency exit)

---

## Manual Testing Scenarios

This section provides comprehensive test scenarios to verify all requirements. Follow each scenario in order for best results.

### Scenario 1: Add Todos (User Story 1, FR-003)

**Objective**: Verify todo creation with title and optional description.

**Steps**:

1. Start the application
2. Select option `1` (Add Todo)
3. Enter title: `Buy groceries`
4. Enter description: `Milk, eggs, bread`
5. Observe success message

**Expected Results**:
- ✅ Success message displayed: "✅ Todo added successfully! (ID: 1)"
- ✅ Application returns to main menu

**Test Invalid Input**:

6. Select option `1` again
7. Press Enter without typing a title (empty input)
8. Observe error message: "❌ Error: Title cannot be empty. Please try again."
9. Enter title: `Call dentist`
10. Press Enter to skip description
11. Observe success message with ID 2

**Pass Criteria**:
- [ ] Valid todos are created with sequential IDs
- [ ] Empty title is rejected with error message and re-prompt
- [ ] Description is optional (can be skipped)
- [ ] Success message shows assigned ID

---

### Scenario 2: View All Todos (User Story 1, FR-004)

**Objective**: Verify todo list display with proper formatting.

**Steps**:

1. From main menu, select option `2` (View All Todos)
2. Observe the displayed list

**Expected Results**:

```
=== Your Todos ===

[ ] 1. Buy groceries
    Description: Milk, eggs, bread

[ ] 2. Call dentist

Total: 2 todos (2 incomplete, 0 complete)
```

**Pass Criteria**:
- [ ] All todos displayed in ID order
- [ ] Incomplete todos show `[ ]` checkbox
- [ ] Title and ID are displayed correctly
- [ ] Description shown only when non-empty
- [ ] Summary line shows accurate counts

---

### Scenario 3: Mark Todo Complete (User Story 2, FR-005)

**Objective**: Verify completion status toggling.

**Steps**:

1. From main menu, select option `5` (Mark Todo Complete/Incomplete)
2. Enter ID: `1`
3. Observe success message: "✅ Todo marked as complete!"
4. Return to main menu, select option `2` (View All Todos)
5. Observe updated list

**Expected Results**:

```
=== Your Todos ===

[✓] 1. Buy groceries
    Description: Milk, eggs, bread

[ ] 2. Call dentist

Total: 2 todos (1 incomplete, 1 complete)
```

**Pass Criteria**:
- [ ] Todo status changes from incomplete to complete
- [ ] Checkbox changes from `[ ]` to `[✓]`
- [ ] Summary counts updated correctly

---

### Scenario 4: Mark Todo Incomplete (User Story 2, FR-006)

**Objective**: Verify toggling back to incomplete status.

**Steps**:

1. From main menu, select option `5`
2. Enter ID: `1`
3. Observe success message: "✅ Todo marked as incomplete!"
4. View todos again (option `2`)

**Expected Results**:
- Todo 1 shows `[ ]` again
- Summary shows "2 incomplete, 0 complete"

**Pass Criteria**:
- [ ] Todo toggles back to incomplete
- [ ] Display updates correctly

---

### Scenario 5: Update Todo (User Story 3, FR-007)

**Objective**: Verify title and description updates.

**Steps**:

1. Select option `3` (Update Todo)
2. Enter ID: `1`
3. Observe current todo display
4. Enter new title: `Buy groceries at Whole Foods`
5. Enter new description: `Organic milk, free-range eggs, whole wheat bread`
6. Observe success message
7. View todos to verify update

**Expected Results**:
- Title updated to "Buy groceries at Whole Foods"
- Description updated
- ID remains 1
- Completion status unchanged

**Test Partial Update**:

8. Select option `3` again
9. Enter ID: `2`
10. Press Enter to keep current title (skip)
11. Enter description: `Appointment at 2pm`
12. View todos to verify only description changed

**Pass Criteria**:
- [ ] Both title and description can be updated
- [ ] Either field can be updated independently
- [ ] Empty input keeps current value
- [ ] ID and completion status remain unchanged

---

### Scenario 6: Delete Todo (User Story 4, FR-008)

**Objective**: Verify todo deletion.

**Steps**:

1. Add a new todo: title "Test deletion", no description
2. Note the assigned ID (likely 3)
3. Select option `4` (Delete Todo)
4. Enter ID: `3`
5. Observe success message
6. View todos to verify deletion

**Expected Results**:
- Success message: "✅ Todo deleted successfully!"
- Todo 3 no longer appears in list
- Remaining todos (1 and 2) still visible
- Summary count shows 2 todos

**Pass Criteria**:
- [ ] Todo is removed from list
- [ ] Other todos unaffected
- [ ] Summary counts updated

---

### Scenario 7: Error Handling - Invalid ID (FR-013)

**Objective**: Verify graceful handling of non-existent IDs.

**Steps**:

1. Select option `5` (toggle)
2. Enter ID: `999` (non-existent)
3. Observe error message and re-prompt

**Expected Results**:
- Error message: "❌ Error: Todo not found. Please try again."
- Prompt appears again for ID input

**Test Non-Integer Input**:

4. Enter: `abc` (non-numeric)
5. Observe error: "❌ Error: Please enter a valid number."

**Pass Criteria**:
- [ ] Non-existent ID shows "not found" error
- [ ] Non-integer input shows "valid number" error
- [ ] User can re-enter correct input
- [ ] No application crash

---

### Scenario 8: Error Handling - Invalid Menu Choice (FR-014)

**Objective**: Verify menu input validation.

**Steps**:

1. At main menu, enter: `9` (out of range)
2. Observe error message
3. Enter: `hello` (non-numeric)
4. Observe error message
5. Enter: `2` (valid choice)

**Expected Results**:
- Out of range error: "❌ Invalid choice. Please enter a number between 1 and 6."
- Non-numeric error: "❌ Invalid input. Please enter a number between 1 and 6."
- Valid input proceeds to operation

**Pass Criteria**:
- [ ] Out-of-range numbers rejected
- [ ] Non-numeric input rejected
- [ ] Clear error messages displayed
- [ ] Menu re-displayed after error

---

### Scenario 9: Empty List Behavior

**Objective**: Verify behavior when no todos exist.

**Steps**:

1. Delete all remaining todos (IDs 1 and 2)
2. Select option `2` (View All Todos)
3. Observe display

**Expected Results**:

```
=== Your Todos ===

No todos yet. Add one to get started!
```

**Pass Criteria**:
- [ ] Helpful message shown for empty list
- [ ] No errors or crashes
- [ ] Application remains usable

---

### Scenario 10: Scale Test (SC-003)

**Objective**: Verify performance with 100 todos.

**Steps**:

1. Add 100 todos with titles "Todo 1", "Todo 2", ... "Todo 100"
   - Can be done by repeatedly selecting option 1
   - Or via a test script (if provided)
2. Select option `2` to view all 100 todos
3. Observe response time
4. Toggle completion on todo 50
5. Update todo 75
6. Delete todo 25

**Expected Results**:
- All operations complete in under 2 seconds
- Display shows all 100 todos
- Operations work correctly regardless of list size

**Pass Criteria**:
- [ ] Application handles 100 todos without degradation
- [ ] All operations remain responsive
- [ ] Display is readable (may scroll)

---

### Scenario 11: Special Characters and Unicode (Edge Case)

**Objective**: Verify unicode and special character support.

**Steps**:

1. Add todo with title: `☕ Buy coffee ☕`
2. Add todo with title: `学习中文 (Learn Chinese)`
3. Add todo with title: `Email john@example.com re: project`
4. View todos to verify display

**Expected Results**:
- Emoji and unicode characters display correctly
- Special characters (@, :, parentheses) handled properly
- If terminal doesn't support unicode, fallback is acceptable

**Pass Criteria**:
- [ ] Unicode characters accepted and displayed (or graceful fallback)
- [ ] Special characters don't break parsing
- [ ] Application remains functional

---

### Scenario 12: Long Title and Description (Edge Case)

**Objective**: Verify handling of long text inputs.

**Steps**:

1. Add todo with 200-character title
2. Add todo with 500-character description
3. View todos

**Expected Results**:
- Long text is accepted
- Display may wrap or truncate (acceptable per spec assumptions)
- No crashes or errors

**Pass Criteria**:
- [ ] Long inputs accepted
- [ ] Display handles long text gracefully
- [ ] No application crashes

---

### Scenario 13: Data Persistence Verification (FR-009)

**Objective**: Verify in-memory-only behavior.

**Steps**:

1. Add 3 todos
2. View todos to confirm they exist
3. Exit application (option 6)
4. Restart application
5. View todos

**Expected Results**:
- After restart, todo list is empty
- Warning message displays on startup
- No saved data from previous session

**Pass Criteria**:
- [ ] Todos do not persist between sessions
- [ ] Fresh start each time
- [ ] Warning displayed on startup

---

## Acceptance Checklist

Use this checklist to verify all functional requirements:

### Core Features (Mandatory)

- [ ] **FR-001**: Unique sequential IDs assigned automatically
- [ ] **FR-002**: Todos store title, description, completion status
- [ ] **FR-003**: Add todo operation works
- [ ] **FR-004**: View all todos operation works
- [ ] **FR-005**: Mark complete operation works
- [ ] **FR-006**: Mark incomplete operation works
- [ ] **FR-007**: Update todo operation works
- [ ] **FR-008**: Delete todo operation works

### Technical Requirements

- [ ] **FR-009**: In-memory storage only (no persistence)
- [ ] **FR-010**: Status clearly visible in list view
- [ ] **FR-011**: Console-based numbered menu interface
- [ ] **FR-012**: Empty title validation and error handling
- [ ] **FR-013**: Invalid ID error handling
- [ ] **FR-014**: Invalid command error handling
- [ ] **FR-015**: Exit command works properly

### Success Criteria

- [ ] **SC-001**: Add and view operations complete within 10 seconds
- [ ] **SC-002**: All 5 operations work without crashes
- [ ] **SC-003**: Handles 100 todos without degradation (< 2 sec)
- [ ] **SC-004**: 100% of invalid inputs show clear error messages
- [ ] **SC-005**: Application runs using only documented steps
- [ ] **SC-006**: Spec → plan → tasks → code workflow is traceable
- [ ] **SC-007**: Data consistency maintained (no duplicate IDs, no corruption)

---

## Troubleshooting

### Issue: Python 3.13 not found

**Solution**:
- Install Python 3.13 from python.org
- Or use `python3.13` command explicitly if multiple versions installed
- Verify with: `python3.13 --version`

### Issue: UV command not found

**Solution**:
- Install UV: `pip install uv` or `pip3 install uv`
- Ensure pip bin directory is in PATH
- Alternative: Use `python -m uv` instead of `uv`

### Issue: Unicode characters don't display

**Solution**:
- Ensure terminal supports UTF-8 encoding
- Windows: Run `chcp 65001` before starting application
- Alternative: Application should still function with ASCII-only display

### Issue: Module not found error

**Solution**:
- Ensure you're in the project root directory
- Run with: `python -m src` not `python src/cli.py`
- Verify src/__main__.py exists

---

## Summary

This quickstart guide provides:
- **Setup instructions**: Python 3.13+, UV, project structure
- **Run instructions**: Single command to launch
- **13 test scenarios**: Covering all functional requirements and edge cases
- **Acceptance checklist**: All 22 requirements enumerated
- **Troubleshooting**: Common issues and solutions

**Manual Testing Status**: Ready for execution after implementation complete

---

## Next Steps

After completing these tests:

1. ✅ Verify all checklist items pass
2. 📝 Document any failures or deviations in issues/bugs.md
3. 🔄 Run regression testing after any code changes
4. ✨ Proceed to Phase II enhancements (if applicable)

**Phase 1 Quickstart Status**: ✅ COMPLETE
