# Quick Start Guide: Todo Application

**Feature**: 001-fullstack-web-app
**Date**: 2026-01-07
**Audience**: Developers and evaluators onboarding to the project

## Overview

This guide helps you set up and run the In-Memory Todo Python Console Application within 5 minutes. It covers prerequisites, installation, first run, and basic usage.

## Prerequisites

### Required

- **Python 3.13+**: Verify with `python --version` or `python3 --version`
- **UV**: Python dependency manager (install from [astral.sh/uv](https://astral.sh/uv))
- **Git**: For cloning the repository (if not already cloned)

### Optional

- **Code Editor**: VS Code, PyCharm, or any text editor for reading code
- **Terminal**: Modern terminal with UTF-8 support (for status symbols)

### Version Check

```bash
# Check Python version (should be 3.13 or higher)
python --version  # or python3 --version

# Check UV installation
uv --version

# Check Git installation
git --version
```

## Installation

### Step 1: Clone Repository (if needed)

```bash
git clone <repository-url>
cd todo
```

### Step 2: Checkout Feature Branch

```bash
git checkout 001-fullstack-web-app
```

### Step 3: Verify Project Structure

```bash
# Ensure you're in the correct directory
ls -la

# You should see:
# - specs/001-fullstack-web-app/  (specification and planning docs)
# - src/                          (application source code)
# - tests/manual/                 (manual test scenarios)
# - README.md                     (detailed documentation)
# - CLAUDE.md                     (development workflow rules)
```

### Step 4: Install Dependencies

```bash
# This project uses only Python standard library
# No external dependencies to install

# UV is used for dependency management, but no packages are needed
uv sync  # Should complete instantly with no downloads
```

## Running the Application

### First Run

```bash
# From project root
python src/main.py

# Alternative (if python points to Python 2.x)
python3 src/main.py
```

### Expected Output

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

## Basic Usage

### Scenario 1: Create Your First Task

1. Run the application: `python src/main.py`
2. Enter `1` (Add Task)
3. Enter task title: `Buy groceries`
4. Enter description (optional): `Get milk, eggs, bread`
5. See confirmation:
   ```
   ✓ Task created successfully!
     ID: 1
     Title: Buy groceries
     Description: Get milk, eggs, bread
     Status: [ ] Incomplete
   ```

### Scenario 2: View All Tasks

1. From main menu, enter `2` (View All Tasks)
2. See your tasks listed:
   ```
   =================================
            ALL TASKS
   =================================

   ID: 1
   Title: Buy groceries
   Description: Get milk, eggs, bread
   Status: [ ] Incomplete

   ---

   Total tasks: 1
   ```

### Scenario 3: Mark Task Complete

1. From main menu, enter `5` (Toggle Task Status)
2. Enter task ID: `1`
3. See confirmation:
   ```
   ✓ Task status updated!
     ID: 1
     Title: Buy groceries
     Status: [✓] Complete
   ```

### Scenario 4: Update Task

1. From main menu, enter `3` (Update Task)
2. Enter task ID: `1`
3. Enter new title (or press Enter to keep current): `Buy groceries and toiletries`
4. Enter new description (or press Enter to keep current): [Press Enter]
5. See confirmation with updated details

### Scenario 5: Delete Task

1. From main menu, enter `4` (Delete Task)
2. Enter task ID: `1`
3. See confirmation:
   ```
   ✓ Task deleted successfully!
     Deleted task ID: 1
     Title: Buy groceries and toiletries
   ```

### Scenario 6: Exit Application

1. From main menu, enter `6` (Exit)
2. Read warning:
   ```
   ⚠  Warning: All data will be lost when you exit (in-memory storage only).
   Are you sure you want to exit? (y/n):
   ```
3. Enter `y` to confirm exit
4. Application terminates

## Common Operations

### Adding Multiple Tasks

```
1. Choose "1" (Add Task)
2. Enter task 1 details
3. Return to menu
4. Repeat for each task
```

### Viewing Task Status

```
Choose "2" (View All Tasks)

Status indicators:
- [ ] = Incomplete
- [✓] = Complete
```

### Toggling Status Multiple Times

```
Task can be toggled unlimited times:
Incomplete → Complete → Incomplete → Complete ...
```

## Troubleshooting

### Python Version Issues

**Problem**: `python --version` shows Python 2.x or 3.12-

**Solution**:
```bash
# Try python3 command
python3 --version

# If 3.13+ available, use:
python3 src/main.py

# If not available, install Python 3.13+ from python.org
```

### UTF-8 Symbol Display Issues

**Problem**: Status symbols display as `?` or boxes

**Solution**:
- Terminal may not support UTF-8
- Functionality unaffected (text status still shows "Complete"/"Incomplete")
- To fix: Use UTF-8 compatible terminal (Windows Terminal, iTerm2, modern Linux terminals)

### Module Not Found Error

**Problem**: `ModuleNotFoundError` when running application

**Solution**:
```bash
# Ensure you're in project root directory
pwd  # Should show .../todo

# Verify src/ directory exists
ls src/

# Run with explicit path
python src/main.py
```

### UV Not Found

**Problem**: `command not found: uv`

**Solution**:
```bash
# Install UV
curl -LsSf https://astral.sh/uv/install.sh | sh

# Or via pip
pip install uv

# Verify installation
uv --version
```

## Project Structure

```
todo/
├── src/                           # Application source code
│   ├── models/                    # Data models (Task entity)
│   │   └── task.py
│   ├── services/                  # Business logic (CRUD operations)
│   │   └── task_service.py
│   ├── cli/                       # User interface (commands, display)
│   │   ├── __init__.py
│   │   ├── commands.py
│   │   ├── display.py
│   │   └── input_handler.py
│   ├── lib/                       # Utilities (validators)
│   │   └── validators.py
│   └── main.py                    # Application entry point
│
├── specs/001-fullstack-web-app/   # Specification and planning
│   ├── spec.md                    # Feature requirements
│   ├── plan.md                    # Implementation plan
│   ├── data-model.md              # Entity definitions
│   ├── quickstart.md              # This file
│   ├── contracts/                 # Interface contracts
│   │   └── cli-interface.md
│   └── tasks.md                   # Task breakdown (generated by /sp.tasks)
│
├── tests/manual/                  # Manual test scenarios
│   └── test_scenarios.md
│
├── README.md                      # Detailed documentation
├── CLAUDE.md                      # Development workflow rules
└── .specify/                      # Spec-driven development tools
    ├── memory/
    │   └── constitution.md        # Project governance
    └── templates/                 # Document templates
```

## Next Steps

### For Evaluators

1. ✅ Run the application (above)
2. ✅ Try all 5 core operations (add, view, update, delete, toggle)
3. ✅ Read [spec.md](./spec.md) to understand requirements
4. ✅ Read [plan.md](./plan.md) to understand architecture
5. ✅ Review source code in `src/` directory
6. ✅ Verify spec → plan → code traceability

### For Developers

1. ✅ Complete quick start (above)
2. ✅ Read [data-model.md](./data-model.md) for entity design
3. ✅ Read [contracts/cli-interface.md](./contracts/cli-interface.md) for interface specs
4. ✅ Read [constitution](../../.specify/memory/constitution.md) for code quality rules
5. ✅ Review [tasks.md](./tasks.md) for implementation breakdown
6. ✅ Run manual tests from `tests/manual/test_scenarios.md`

## Key Design Decisions

### Why In-Memory Storage?

- **Focus**: Demonstrate development process, not persistence complexity
- **Simplicity**: No database setup, no file I/O errors
- **Scope**: Phase I is intentionally minimal (see [spec.md](./spec.md) "Out of Scope")

### Why Interactive Menu (Not CLI Arguments)?

- **Usability**: Evaluators don't need to memorize commands
- **Discoverability**: All options visible in menu
- **Error Handling**: Easier to provide guidance and retry

### Why Python 3.13+?

- **Modern Features**: Latest type hint syntax (`list[Task]`, `int | None`)
- **Performance**: Improved interpreter speed
- **Constitution**: Version requirement explicit in spec

### Why No Testing Framework?

- **Specification**: Explicitly out of scope for Phase I
- **Focus**: Functional demonstration over test automation
- **Process**: Manual test scenarios mapped to acceptance criteria

## Learning Resources

### Understanding Spec-Driven Development

1. Read [CLAUDE.md](../../CLAUDE.md) - Development workflow overview
2. Review [constitution](../../.specify/memory/constitution.md) - Governance principles
3. Follow the workflow: Spec → Plan → Tasks → Implementation

### Understanding the Codebase

1. Start with [spec.md](./spec.md) - WHAT we're building (user perspective)
2. Read [plan.md](./plan.md) - HOW we're building it (architecture)
3. Review [data-model.md](./data-model.md) - Data structure design
4. Check [contracts/cli-interface.md](./contracts/cli-interface.md) - Interface behavior
5. Read source code in `src/` - Implementation details

## Getting Help

### Documentation

- **Specification**: [spec.md](./spec.md) - Feature requirements
- **Plan**: [plan.md](./plan.md) - Architecture and decisions
- **README**: [../../../README.md](../../../README.md) - Detailed project info

### Reporting Issues

If you encounter issues:

1. Check **Troubleshooting** section above
2. Verify **Prerequisites** are met
3. Review error message for guidance
4. Check [spec.md](./spec.md) for expected behavior

## Time Estimate

- **Setup**: 2 minutes (clone, checkout branch)
- **First Run**: 30 seconds (launch application)
- **Basic Usage**: 2 minutes (try all 5 operations)
- **Total**: ~5 minutes to working application

## Success Criteria

You've successfully completed quick start when:

- ✅ Application launches without errors
- ✅ You can add a task and see it in the list
- ✅ You can mark a task as complete
- ✅ You can update a task's details
- ✅ You can delete a task
- ✅ You understand the basic workflow

## References

- Feature Specification: [spec.md](./spec.md)
- Implementation Plan: [plan.md](./plan.md)
- Data Model: [data-model.md](./data-model.md)
- CLI Contracts: [contracts/cli-interface.md](./contracts/cli-interface.md)
- Constitution: [../../.specify/memory/constitution.md](../../.specify/memory/constitution.md)
