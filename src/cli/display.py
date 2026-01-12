"""Display formatting utilities for the todo application CLI."""

from src.models.task import Task


def format_menu() -> str:
    """
    Format and return the main menu display.

    Returns:
        Formatted menu string with all available commands
    """
    menu = """
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

Enter your choice (1-6): """
    return menu


def format_task(task: Task) -> str:
    """
    Format a single task for display.

    Args:
        task: The Task object to format

    Returns:
        Formatted string representation of the task
    """
    status_icon = "[✓]" if task.completed else "[ ]"
    status_text = "Complete" if task.completed else "Incomplete"

    lines = [
        f"ID: {task.id}",
        f"Title: {task.title}"
    ]

    # Only show description if it's not empty
    if task.description:
        lines.append(f"Description: {task.description}")

    lines.append(f"Status: {status_icon} {status_text}")

    return "\n".join(lines)


def format_task_list(tasks: list[Task]) -> str:
    """
    Format a list of tasks for display.

    Args:
        tasks: List of Task objects to format

    Returns:
        Formatted string with all tasks or empty message
    """
    if not tasks:
        return """
=================================
         ALL TASKS
=================================

No tasks found. Use 'Add Task' to create your first task.

Total tasks: 0
"""

    header = """
=================================
         ALL TASKS
=================================
"""

    task_strings = []
    for task in tasks:
        task_strings.append(format_task(task))

    separator = "\n\n---\n\n"
    tasks_display = separator.join(task_strings)

    footer = f"\n\nTotal tasks: {len(tasks)}\n"

    return header + "\n" + tasks_display + footer
