"""Console interface for the Todo application."""

import sys
from src.manager import TodoManager

# Set UTF-8 encoding for Windows console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except AttributeError:
        pass


def display_menu():
    """Display the main menu."""
    print("\n=== Todo Application ===")
    print("1. Add Todo")
    print("2. View All Todos")
    print("3. Update Todo")
    print("4. Delete Todo")
    print("5. Mark Todo Complete/Incomplete")
    print("6. Exit")


def add_todo(manager: TodoManager):
    """Add a new todo with title and optional description.

    Args:
        manager: The TodoManager instance
    """
    while True:
        title = input("\nEnter title: ").strip()
        if title:
            break
        print("❌ Error: Title cannot be empty. Please try again.")

    description = input("Enter description (optional): ").strip()

    todo_id = manager.add(title, description)
    print(f"✅ Todo added successfully! (ID: {todo_id})")


def view_todos(manager: TodoManager):
    """Display all todos with formatting.

    Args:
        manager: The TodoManager instance
    """
    todos = manager.get_all()

    print("\n=== Your Todos ===\n")

    if not todos:
        print("No todos yet. Add one to get started!")
        return

    for todo in todos:
        print(str(todo))
        if todo.description:
            print(f"    Description: {todo.description}")
        print()

    incomplete = sum(1 for t in todos if not t.completed)
    complete = sum(1 for t in todos if t.completed)
    print(f"Total: {len(todos)} todos ({incomplete} incomplete, {complete} complete)")


def get_todo_id(manager: TodoManager, prompt: str = "Enter todo ID: ") -> int:
    """Prompt for and validate a todo ID.

    Args:
        manager: The TodoManager instance
        prompt: The prompt message to display

    Returns:
        Valid todo ID that exists in the manager
    """
    while True:
        try:
            todo_id = int(input(prompt))
            if manager.get(todo_id):
                return todo_id
            print("❌ Error: Todo not found. Please try again.")
        except ValueError:
            print("❌ Error: Please enter a valid number.")


def update_todo(manager: TodoManager):
    """Update an existing todo's title and/or description.

    Args:
        manager: The TodoManager instance
    """
    todo_id = get_todo_id(manager, "\nEnter todo ID to update: ")
    todo = manager.get(todo_id)

    print(f"\nCurrent todo: {todo}")
    if todo.description:
        print(f"Current description: {todo.description}")

    print("\nPress Enter to keep current value, or type new value:")

    new_title_input = input(f"New title (current: {todo.title}): ").strip()
    new_desc_input = input(
        f"New description (current: {todo.description or '(none)'}): "
    ).strip()

    # Validate new title if provided
    if new_title_input:
        new_title = new_title_input
    else:
        new_title = None

    # Always allow description update (can be empty string)
    if new_desc_input or new_desc_input == "":
        new_description = new_desc_input
    else:
        new_description = None

    # Only update if at least one field changed
    if new_title is None and new_description is None:
        print("❌ No changes made.")
        return

    manager.update(todo_id, title=new_title, description=new_description)
    print("✅ Todo updated successfully!")


def delete_todo(manager: TodoManager):
    """Delete a todo by ID.

    Args:
        manager: The TodoManager instance
    """
    todo_id = get_todo_id(manager, "\nEnter todo ID to delete: ")

    if manager.delete(todo_id):
        print("✅ Todo deleted successfully!")
    else:
        print("❌ Error: Todo not found.")


def toggle_todo(manager: TodoManager):
    """Toggle the completion status of a todo.

    Args:
        manager: The TodoManager instance
    """
    todo_id = get_todo_id(manager, "\nEnter todo ID to toggle: ")
    todo = manager.get(todo_id)

    if manager.toggle_complete(todo_id):
        # Get updated status
        updated_todo = manager.get(todo_id)
        if updated_todo.completed:
            print("✅ Todo marked as complete!")
        else:
            print("✅ Todo marked as incomplete!")
    else:
        print("❌ Error: Todo not found.")


def main():
    """Main application loop."""
    print(
        "\n⚠️  Warning: This is an in-memory application. "
        "All data will be lost when you exit.\n"
    )

    manager = TodoManager()

    while True:
        display_menu()

        try:
            choice = int(input("\nEnter choice (1-6): "))

            if choice == 1:
                add_todo(manager)
            elif choice == 2:
                view_todos(manager)
            elif choice == 3:
                update_todo(manager)
            elif choice == 4:
                delete_todo(manager)
            elif choice == 5:
                toggle_todo(manager)
            elif choice == 6:
                print("\nGoodbye! Your todos have been discarded.")
                break
            else:
                print("❌ Invalid choice. Please enter a number between 1 and 6.")

        except ValueError:
            print("❌ Invalid input. Please enter a number between 1 and 6.")
        except KeyboardInterrupt:
            print("\n\nGoodbye! Your todos have been discarded.")
            break


if __name__ == "__main__":
    main()
