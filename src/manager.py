"""Business logic for managing todos."""

from src.models import Todo


class TodoManager:
    """Manages the in-memory collection of todos.

    Provides CRUD operations for todo items with O(1) lookup performance.
    """

    def __init__(self):
        """Initialize empty todo manager."""
        self._todos: dict[int, Todo] = {}
        self._next_id: int = 1

    def add(self, title: str, description: str = "") -> int:
        """Add a new todo item.

        Args:
            title: The todo title (non-empty)
            description: Optional description text

        Returns:
            The ID of the newly created todo
        """
        todo_id = self._next_id
        self._todos[todo_id] = Todo(
            id=todo_id, title=title, description=description, completed=False
        )
        self._next_id += 1
        return todo_id

    def get_all(self) -> list[Todo]:
        """Get all todos sorted by ID.

        Returns:
            List of all todo items in ID order (ascending)
        """
        return sorted(self._todos.values(), key=lambda t: t.id)

    def get(self, todo_id: int) -> Todo | None:
        """Get a specific todo by ID.

        Args:
            todo_id: The todo ID to retrieve

        Returns:
            The Todo object if found, None otherwise
        """
        return self._todos.get(todo_id)

    def update(
        self, todo_id: int, title: str | None = None, description: str | None = None
    ) -> bool:
        """Update an existing todo.

        Args:
            todo_id: The ID of the todo to update
            title: New title (optional)
            description: New description (optional)

        Returns:
            True if update successful, False if todo not found
        """
        todo = self._todos.get(todo_id)
        if not todo:
            return False

        if title is not None:
            todo.title = title
        if description is not None:
            todo.description = description

        return True

    def delete(self, todo_id: int) -> bool:
        """Delete a todo by ID.

        Args:
            todo_id: The ID of the todo to delete

        Returns:
            True if deletion successful, False if todo not found
        """
        if todo_id in self._todos:
            del self._todos[todo_id]
            return True
        return False

    def toggle_complete(self, todo_id: int) -> bool:
        """Toggle the completion status of a todo.

        Args:
            todo_id: The ID of the todo to toggle

        Returns:
            True if toggle successful, False if todo not found
        """
        todo = self._todos.get(todo_id)
        if not todo:
            return False

        todo.completed = not todo.completed
        return True
