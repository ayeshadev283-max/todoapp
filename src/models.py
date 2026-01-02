"""Data models for the Todo application."""

from dataclasses import dataclass


@dataclass
class Todo:
    """Represents a single todo item.

    Attributes:
        id: Unique identifier (positive integer)
        title: Main task description (non-empty string)
        description: Optional detailed description
        completed: Completion status (True = complete, False = incomplete)
    """

    id: int
    title: str
    description: str = ""
    completed: bool = False

    def __str__(self) -> str:
        """Return human-readable string representation.

        Returns:
            Formatted string with status checkbox, ID, and title
        """
        status = "✓" if self.completed else " "
        return f"[{status}] {self.id}. {self.title}"
