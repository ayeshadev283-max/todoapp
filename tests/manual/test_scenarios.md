# Manual Test Scenarios - Todo Application

This document provides comprehensive manual test scenarios mapped to acceptance criteria from the specification.

## Prerequisites

- Application running: `python -m src.main`
- Fresh start (no existing data)

---

## User Story 1: Create and View Tasks

### Scenario 1.1: Add Task with Title Only

**Acceptance Criteria**: Empty app → add task "Buy groceries" → creates with unique ID, title, no description, status incomplete

**Steps**:
1. Launch application
2. Select option `1` (Add Task)
3. Enter title: `Buy groceries`
4. Press Enter to skip description
5. Select option `2` (View All Tasks)

**Expected Result**:
```
ID: 1
Title: Buy groceries
Status: [ ] Incomplete
```

**Pass Criteria**:
- Task created with ID 1
- Title is "Buy groceries"
- No description line shown
- Status is Incomplete

---

### Scenario 1.2: Add Task with Title and Description

**Acceptance Criteria**: Add task with both title and description

**Steps**:
1. Select option `1` (Add Task)
2. Enter title: `Prepare presentation`
3. Enter description: `Include Q1 results`
4. Select option `2` (View All Tasks)

**Expected Result**:
```
ID: 2
Title: Prepare presentation
Description: Include Q1 results
Status: [ ] Incomplete
```

**Pass Criteria**:
- Task created with ID 2
- Both title and description displayed
- Status is Incomplete

---

### Scenario 1.3: View All Tasks When List Is Empty

**Acceptance Criteria**: Empty app → view tasks → shows "No tasks found" message

**Steps**:
1. Launch fresh application (or delete all tasks first)
2. Select option `2` (View All Tasks)

**Expected Result**:
```
=================================
         ALL TASKS
=================================

No tasks found. Use 'Add Task' to create your first task.

Total tasks: 0
```

**Pass Criteria**:
- Helpful message displayed
- No error or crash
- Total tasks shows 0

---

### Scenario 1.4: Empty Title Validation

**Acceptance Criteria**: Title validation → empty title → error "Title cannot be empty"

**Steps**:
1. Select option `1` (Add Task)
2. Press Enter without typing anything (empty title)

**Expected Result**:
```
✗ Error: Title cannot be empty. Please provide a title.
```

**Pass Criteria**:
- Error message displayed
- No task created
- Returns to main menu

---

## User Story 2: Mark Tasks Complete

### Scenario 2.1: Toggle Task to Complete

**Acceptance Criteria**: Task exists incomplete → toggle → status changes to complete, title/ID unchanged

**Steps**:
1. Add a task with title "Buy groceries"
2. Note the task ID (should be 1)
3. Select option `5` (Toggle Task Status)
4. Enter task ID: `1`
5. Select option `2` (View All Tasks)

**Expected Result**:
```
ID: 1
Title: Buy groceries
Status: [✓] Complete
```

**Pass Criteria**:
- Status changed from Incomplete to Complete
- Checkmark [✓] displayed
- ID and title unchanged

---

### Scenario 2.2: Toggle Task Back to Incomplete

**Acceptance Criteria**: Task exists complete → toggle → status changes back to incomplete

**Steps**:
1. With task 1 already complete (from previous scenario)
2. Select option `5` (Toggle Task Status)
3. Enter task ID: `1`
4. Select option `2` (View All Tasks)

**Expected Result**:
```
ID: 1
Title: Buy groceries
Status: [ ] Incomplete
```

**Pass Criteria**:
- Status changed from Complete to Incomplete
- Empty checkbox [ ] displayed
- ID and title unchanged

---

### Scenario 2.3: Toggle Non-Existent Task

**Acceptance Criteria**: Non-existent ID → error "Task ID X not found"

**Steps**:
1. Select option `5` (Toggle Task Status)
2. Enter task ID: `99`

**Expected Result**:
```
✗ Error: Task ID 99 not found. Use 'View All Tasks' to see existing tasks.
```

**Pass Criteria**:
- Error message with task ID displayed
- Helpful guidance provided
- Returns to main menu

---

## User Story 3: Update Task Content

### Scenario 3.1: Update Task Title

**Acceptance Criteria**: Task ID 1 title "Buy groceries" → update to "Buy groceries and toiletries" → title changes, ID/status unchanged

**Steps**:
1. Create task with title "Buy groceries"
2. Select option `3` (Update Task)
3. Enter task ID: `1`
4. Enter new title: `Buy groceries and toiletries`
5. Press Enter to keep current description
6. Select option `2` (View All Tasks)

**Expected Result**:
```
ID: 1
Title: Buy groceries and toiletries
Status: [ ] Incomplete
```

**Pass Criteria**:
- Title updated successfully
- ID unchanged (still 1)
- Status unchanged (still Incomplete)

---

### Scenario 3.2: Add Description to Task Without One

**Acceptance Criteria**: Task ID 2 no description → add description "Get milk, eggs, bread" → description added

**Steps**:
1. Create task with title "Call dentist" (no description)
2. Select option `3` (Update Task)
3. Enter task ID: (use the task's ID)
4. Press Enter to keep current title
5. Enter new description: `Schedule cleaning appointment`
6. Select option `2` (View All Tasks)

**Expected Result**:
```
ID: X
Title: Call dentist
Description: Schedule cleaning appointment
Status: [ ] Incomplete
```

**Pass Criteria**:
- Description added to task
- Title and ID unchanged
- Status unchanged

---

### Scenario 3.3: Update Non-Existent Task

**Acceptance Criteria**: Non-existent ID 99 → update → error "Task ID 99 not found"

**Steps**:
1. Select option `3` (Update Task)
2. Enter task ID: `99`

**Expected Result**:
```
✗ Error: Task ID 99 not found. Use 'View All Tasks' to see existing tasks.
```

**Pass Criteria**:
- Error message displayed
- Helpful guidance provided
- Returns to main menu

---

## User Story 4: Delete Tasks

### Scenario 4.1: Delete Task Successfully

**Acceptance Criteria**: Tasks with IDs 1, 2, 3 exist → delete task 2 → task 2 removed, tasks 1 and 3 remain

**Steps**:
1. Create three tasks
2. Select option `4` (Delete Task)
3. Enter task ID of middle task
4. Confirm deletion by typing `y`
5. Select option `2` (View All Tasks)

**Expected Result**:
- Task 2 is no longer in the list
- Tasks 1 and 3 still exist
- Confirmation message shown

**Pass Criteria**:
- Only specified task deleted
- Other tasks unchanged
- Task count decreased by 1

---

### Scenario 4.2: Cancel Task Deletion

**Acceptance Criteria**: Delete command → confirmation → user declines → task not deleted

**Steps**:
1. With at least one task existing
2. Select option `4` (Delete Task)
3. Enter valid task ID
4. When prompted for confirmation, type `n`
5. Select option `2` (View All Tasks)

**Expected Result**:
```
✗ Deletion cancelled.
```

**Pass Criteria**:
- Task still exists in list
- Cancellation message displayed
- Returns to main menu

---

### Scenario 4.3: Delete Last Remaining Task

**Acceptance Criteria**: Only task ID 1 exists → delete task 1 → view tasks → "No tasks found" message

**Steps**:
1. Ensure only one task exists (delete others or start fresh)
2. Select option `4` (Delete Task)
3. Enter the task ID
4. Confirm with `y`
5. Select option `2` (View All Tasks)

**Expected Result**:
```
No tasks found. Use 'Add Task' to create your first task.

Total tasks: 0
```

**Pass Criteria**:
- Task deleted successfully
- Empty list message displayed
- No errors or crashes

---

### Scenario 4.4: Delete Non-Existent Task

**Acceptance Criteria**: Non-existent ID 99 → delete → error "Task ID 99 not found"

**Steps**:
1. Select option `4` (Delete Task)
2. Enter task ID: `99`

**Expected Result**:
```
✗ Error: Task ID 99 not found. Use 'View All Tasks' to see existing tasks.
```

**Pass Criteria**:
- Error message displayed
- Helpful guidance provided
- Returns to main menu

---

## User Story 5: Optional Descriptions

### Scenario 5.1: Add Task with Description

**Acceptance Criteria**: Add task with title and description → both stored and displayed

**Steps**:
1. Select option `1` (Add Task)
2. Enter title: `Prepare presentation`
3. Enter description: `Include Q1 results`
4. Select option `2` (View All Tasks)

**Expected Result**:
```
ID: X
Title: Prepare presentation
Description: Include Q1 results
Status: [ ] Incomplete
```

**Pass Criteria**:
- Both title and description shown
- Description line included in output

---

### Scenario 5.2: Add Task Without Description

**Acceptance Criteria**: Add task with only title → created successfully with empty description

**Steps**:
1. Select option `1` (Add Task)
2. Enter title: `Call dentist`
3. Press Enter to skip description
4. Select option `2` (View All Tasks)

**Expected Result**:
```
ID: X
Title: Call dentist
Status: [ ] Incomplete
```

**Pass Criteria**:
- Task created successfully
- No "Description:" line shown
- Graceful handling of empty description

---

## Edge Cases and Error Handling

### Scenario EC-1: Invalid ID Format (Non-Numeric)

**Steps**:
1. Select any option requiring ID (3, 4, or 5)
2. Enter: `abc`

**Expected Result**:
```
✗ Error: Invalid ID format. Please enter a numeric ID.
```

**Pass Criteria**: Clear error message, returns to menu

---

### Scenario EC-2: Invalid ID Format (Negative Number)

**Steps**:
1. Select any option requiring ID (3, 4, or 5)
2. Enter: `-1`

**Expected Result**:
```
✗ Error: Invalid ID format. Please enter a numeric ID.
```

**Pass Criteria**: Negative IDs rejected

---

### Scenario EC-3: Invalid Menu Choice

**Steps**:
1. At main menu, enter: `9`

**Expected Result**:
```
✗ Error: Invalid choice. Please select a number between 1 and 6.
```

**Pass Criteria**: Error message, menu redisplays

---

### Scenario EC-4: Exit with Data Loss Warning

**Steps**:
1. Add at least one task
2. Select option `6` (Exit)
3. Note the warning message

**Expected Result**:
```
⚠  Warning: All data will be lost when you exit (in-memory storage only).
Are you sure you want to exit? (y/n):
```

**Pass Criteria**:
- Warning displayed
- Confirmation required
- Clear message about data loss

---

### Scenario EC-5: Exit Confirmation

**Steps**:
1. Select option `6` (Exit)
2. Type `y` to confirm

**Expected Result**:
```
Thank you for using Todo Application. Goodbye!
```

**Pass Criteria**:
- Graceful exit message
- Application terminates cleanly

---

### Scenario EC-6: Cancel Exit

**Steps**:
1. Select option `6` (Exit)
2. Type `n` to cancel

**Expected Result**:
```
Exit cancelled. Returning to main menu.
```

**Pass Criteria**:
- Exit cancelled
- Returns to main menu
- Can continue using application

---

## Comprehensive Workflow Test

### Scenario CW-1: Complete 5-Operation Workflow

**Acceptance Criteria**: All 5 operations completed within 5 minutes (SC-002)

**Steps**:
1. Launch application (start timer)
2. Add task: "Buy groceries" with description "Milk, eggs, bread"
3. View all tasks
4. Toggle task status to complete
5. Update task title to "Buy groceries and toiletries"
6. Add second task: "Call dentist"
7. Delete second task
8. Exit application (note elapsed time)

**Expected Result**:
- All operations complete successfully
- Completed within 5 minutes
- No errors encountered

**Pass Criteria**:
- All CRUD operations functional
- Performance acceptable
- User experience smooth

---

## Test Completion Checklist

After completing all scenarios, verify:

- [ ] All 5 user stories tested independently
- [ ] All acceptance criteria validated
- [ ] All edge cases handled gracefully
- [ ] Error messages clear and actionable
- [ ] Data loss warning displayed on exit
- [ ] UTF-8 symbols (✓, ✗, ⚠) display correctly
- [ ] Application never crashes
- [ ] All operations complete within expected time
- [ ] Help guidance provided in error messages

---

## Notes for Testers

1. **Sequential ID Generation**: IDs should increment from 1, 2, 3, etc.
2. **In-Memory Storage**: All data is lost on exit - this is expected behavior
3. **UTF-8 Display**: If symbols don't display, verify terminal encoding
4. **Case Sensitivity**: Confirmation prompts accept 'y' or 'Y', 'n' or 'N'
5. **Empty Input**: Pressing Enter without input should be handled gracefully

---

**Test Document Version**: 1.0
**Last Updated**: 2026-01-07
**Application Version**: Phase I MVP
