"""Task service for managing todo operations."""

from typing import Optional
from src.models.task import Task


class TaskService:
    """
    Service class for managing todo tasks with in-memory storage.

    Provides CRUD operations for tasks with auto-generated sequential IDs.
    """

    def __init__(self) -> None:
        """Initialize the task service with empty storage."""
        self._tasks: dict[int, Task] = {}
        self._next_id: int = 1

    def _generate_id(self) -> int:
        """
        Generate next sequential ID for a new task.

        Returns:
            Next available integer ID starting from 1
        """
        current_id = self._next_id
        self._next_id += 1
        return current_id

    def add_task(self, title: str, description: str = "") -> Task:
        """
        Add a new task to the storage.

        Args:
            title: Required task title
            description: Optional task description (default: empty string)

        Returns:
            The created Task object with auto-generated ID

        Raises:
            ValueError: If title is empty or whitespace-only
        """
        from src.lib.validators import validate_title

        if not validate_title(title):
            raise ValueError("Title cannot be empty")

        task_id = self._generate_id()
        task = Task(id=task_id, title=title.strip(), description=description, completed=False)
        self._tasks[task_id] = task
        return task

    def list_tasks(self) -> list[Task]:
        """
        Get all tasks from storage.

        Returns:
            List of all Task objects, empty list if no tasks exist
        """
        return list(self._tasks.values())

    def toggle_status(self, task_id: int) -> Optional[Task]:
        """
        Toggle the completion status of a task.

        Args:
            task_id: The ID of the task to toggle

        Returns:
            The updated Task object if found, None if task doesn't exist
        """
        if task_id not in self._tasks:
            return None

        task = self._tasks[task_id]
        task.completed = not task.completed
        return task

    def update_task(self, task_id: int, title: Optional[str] = None, description: Optional[str] = None) -> Optional[Task]:
        """
        Update a task's title and/or description.

        Args:
            task_id: The ID of the task to update
            title: New title (None to keep current)
            description: New description (None to keep current)

        Returns:
            The updated Task object if found, None if task doesn't exist

        Raises:
            ValueError: If provided title is empty or whitespace-only
        """
        from src.lib.validators import validate_title

        if task_id not in self._tasks:
            return None

        task = self._tasks[task_id]

        if title is not None:
            if not validate_title(title):
                raise ValueError("Title cannot be empty")
            task.title = title.strip()

        if description is not None:
            task.description = description

        return task

    def delete_task(self, task_id: int) -> Optional[Task]:
        """
        Delete a task from storage.

        Args:
            task_id: The ID of the task to delete

        Returns:
            The deleted Task object if found, None if task doesn't exist
        """
        if task_id not in self._tasks:
            return None

        task = self._tasks[task_id]
        del self._tasks[task_id]
        return task
