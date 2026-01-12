"""Main entry point for the todo application."""

from src.cli.display import format_menu
from src.cli.commands import add_task_command, view_all_tasks_command, toggle_status_command, update_task_command, delete_task_command
from src.services.task_service import TaskService


def main() -> None:
    """Run the main CLI loop for the todo application."""
    service = TaskService()

    while True:
        choice = input(format_menu()).strip()

        if choice == "1":
            add_task_command(service)
        elif choice == "2":
            view_all_tasks_command(service)
        elif choice == "3":
            update_task_command(service)
        elif choice == "4":
            delete_task_command(service)
        elif choice == "5":
            toggle_status_command(service)
        elif choice == "6":
            print("\n⚠  Warning: All data will be lost when you exit (in-memory storage only).")
            confirm = input("Are you sure you want to exit? (y/n): ").strip().lower()
            if confirm == "y":
                print("\nThank you for using Todo Application. Goodbye!\n")
                break
            else:
                print("\nExit cancelled. Returning to main menu.\n")
        else:
            print("\n✗ Error: Invalid choice. Please select a number between 1 and 6.\n")


if __name__ == "__main__":
    main()
