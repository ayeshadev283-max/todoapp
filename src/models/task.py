"""Task data model for the todo application."""

from dataclasses import dataclass


@dataclass
class Task:
    """
    Represents a single todo item.

    Attributes:
        id: Unique identifier (auto-generated, immutable)
        title: Task description (required, mutable)
        description: Optional additional details (mutable)
        completed: Completion status (default: False, mutable)
    """
    id: int
    title: str
    description: str = ""
    completed: bool = False
