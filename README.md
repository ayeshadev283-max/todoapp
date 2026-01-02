# Todo Console Application

A simple in-memory todo console application demonstrating spec-driven development workflow.

## Features

- ✅ Add todos with title and optional description
- 📋 View all todos with completion status
- ✏️ Update todo title and description
- 🗑️ Delete todos
- ✓ Mark todos as complete/incomplete
- 💾 In-memory storage (no persistence between sessions)

## Prerequisites

- **Python 3.13+** - [Download](https://www.python.org/downloads/)
- **UV Package Manager** - Install with `pip install uv`
- Terminal with UTF-8 encoding support

## Installation

1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd todo
   ```
3. Install dependencies (if any):
   ```bash
   uv sync
   ```
   Note: This project uses only Python standard library, so no external dependencies are required.

## Running the Application

Start the application with:

```bash
python -m src
```

Or if your system requires:

```bash
python3 -m src
```

## Usage

The application presents a numbered menu with 6 options:

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

### Quick Example

1. Select `1` to add a todo
2. Enter title: `Buy groceries`
3. Enter description (optional): `Milk, eggs, bread`
4. Select `2` to view your todos
5. Select `5` to mark a todo complete
6. Enter the todo ID to toggle its status
7. Select `6` to exit

## Important Notes

⚠️ **This is an in-memory application** - all data will be lost when you exit.

## Development

### Project Structure

```
todo/
├── src/
│   ├── models.py      # Todo dataclass
│   ├── manager.py     # TodoManager (CRUD operations)
│   ├── cli.py         # Console interface
│   └── __main__.py    # Entry point
├── specs/             # Feature specifications
├── pyproject.toml     # UV project configuration
└── README.md          # This file
```

### Testing

For comprehensive manual testing instructions, see:
- `specs/001-todo-app/quickstart.md` - 13 test scenarios
- All tests are manual (no automated test framework)

## Troubleshooting

### Python 3.13 not found
- Install from [python.org](https://www.python.org/downloads/)
- Or use `python3.13` command explicitly

### UV command not found
- Install: `pip install uv` or `pip3 install uv`
- Ensure pip bin directory is in PATH

### Unicode characters don't display (Windows)
- Run `chcp 65001` before starting application
- Or continue with ASCII-only display

## License

This is a demonstration project for educational purposes.

## Documentation

Full specification and design documentation available in `specs/001-todo-app/`:
- `spec.md` - Feature requirements
- `plan.md` - Implementation plan
- `tasks.md` - Task breakdown
- `quickstart.md` - Detailed testing guide
