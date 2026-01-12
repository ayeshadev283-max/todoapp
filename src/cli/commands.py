"""CLI command implementations for the todo application."""

from src.services.task_service import TaskService
from src.cli.display import format_task, format_task_list


def add_task_command(service: TaskService) -> None:
    """
    Execute the Add Task command.

    Prompts user for task title and optional description,
    creates the task, and displays confirmation.

    Args:
        service: TaskService instance to use for adding the task
    """
    print()
    title = input("Enter task title: ").strip()

    if not title:
        print("\n✗ Error: Title cannot be empty. Please provide a title.\n")
        return

    description = input("Enter task description (optional, press Enter to skip): ").strip()

    try:
        task = service.add_task(title, description)
        print("\n✓ Task created successfully!")
        print(format_task(task))
        print()
    except ValueError as e:
        print(f"\n✗ Error: {e}\n")


def view_all_tasks_command(service: TaskService) -> None:
    """
    Execute the View All Tasks command.

    Retrieves all tasks and displays them in a formatted list.

    Args:
        service: TaskService instance to use for retrieving tasks
    """
    tasks = service.list_tasks()
    print(format_task_list(tasks))


def toggle_status_command(service: TaskService) -> None:
    """
    Execute the Toggle Task Status command.

    Prompts user for task ID and toggles its completion status.

    Args:
        service: TaskService instance to use for toggling status
    """
    from src.lib.validators import validate_id_format

    print()
    id_input = input("Enter task ID to toggle status: ").strip()

    is_valid, task_id = validate_id_format(id_input)

    if not is_valid:
        print("\n✗ Error: Invalid ID format. Please enter a numeric ID.\n")
        return

    task = service.toggle_status(task_id)

    if task is None:
        print(f"\n✗ Error: Task ID {task_id} not found. Use 'View All Tasks' to see existing tasks.\n")
        return

    print("\n✓ Task status updated!")
    print(format_task(task))
    print()


def update_task_command(service: TaskService) -> None:
    """
    Execute the Update Task command.

    Prompts user for task ID, shows current values, and allows updating
    title and/or description.

    Args:
        service: TaskService instance to use for updating the task
    """
    from src.lib.validators import validate_id_format

    print()
    id_input = input("Enter task ID to update: ").strip()

    is_valid, task_id = validate_id_format(id_input)

    if not is_valid:
        print("\n✗ Error: Invalid ID format. Please enter a numeric ID.\n")
        return

    tasks = service.list_tasks()
    current_task = next((t for t in tasks if t.id == task_id), None)

    if current_task is None:
        print(f"\n✗ Error: Task ID {task_id} not found. Use 'View All Tasks' to see existing tasks.\n")
        return

    print("\nCurrent task details:")
    print(format_task(current_task))
    print()

    new_title_input = input(f"Enter new title (press Enter to keep current): ").strip()
    new_title = new_title_input if new_title_input else None

    new_description_input = input(f"Enter new description (press Enter to keep current): ").strip()
    new_description = new_description_input if new_description_input != "" else None

    if new_title is None and new_description is None:
        print("\n✗ No changes made. Both fields were left unchanged.\n")
        return

    try:
        updated_task = service.update_task(task_id, title=new_title, description=new_description)
        print("\n✓ Task updated successfully!")
        print(format_task(updated_task))
        print()
    except ValueError as e:
        print(f"\n✗ Error: {e}\n")


def delete_task_command(service: TaskService) -> None:
    """
    Execute the Delete Task command.

    Prompts user for task ID, displays task details, confirms deletion,
    and removes the task permanently.

    Args:
        service: TaskService instance to use for deleting the task
    """
    from src.lib.validators import validate_id_format

    print()
    id_input = input("Enter task ID to delete: ").strip()

    is_valid, task_id = validate_id_format(id_input)

    if not is_valid:
        print("\n✗ Error: Invalid ID format. Please enter a numeric ID.\n")
        return

    tasks = service.list_tasks()
    task_to_delete = next((t for t in tasks if t.id == task_id), None)

    if task_to_delete is None:
        print(f"\n✗ Error: Task ID {task_id} not found. Use 'View All Tasks' to see existing tasks.\n")
        return

    print("\nTask to be deleted:")
    print(format_task(task_to_delete))
    print()

    confirm = input("Are you sure you want to delete this task? (y/n): ").strip().lower()

    if confirm != "y":
        print("\n✗ Deletion cancelled.\n")
        return

    deleted_task = service.delete_task(task_id)
    print("\n✓ Task deleted successfully!")
    print(f"   Deleted: {deleted_task.title}\n")
