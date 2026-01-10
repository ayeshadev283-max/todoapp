"""Task CRUD routes with JWT authentication."""

from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, field_validator
from sqlmodel import Session, select

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models import Task

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


# Request/Response Models
class TaskCreate(BaseModel):
    """Request model for creating a task."""
    title: str
    description: Optional[str] = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, v: str) -> str:
        """Validate title is not empty and within length limits."""
        v = v.strip()
        if len(v) == 0:
            raise ValueError("Title cannot be empty or whitespace only")
        if len(v) > 200:
            raise ValueError("Title must be 200 characters or less")
        return v

    @field_validator("description")
    @classmethod
    def validate_description(cls, v: Optional[str]) -> Optional[str]:
        """Validate description length if provided."""
        if v is not None and len(v) > 1000:
            raise ValueError("Description must be 1000 characters or less")
        return v


class TaskUpdate(BaseModel):
    """Request model for updating a task."""
    title: Optional[str] = None
    description: Optional[str] = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, v: Optional[str]) -> Optional[str]:
        """Validate title if provided."""
        if v is not None:
            v = v.strip()
            if len(v) == 0:
                raise ValueError("Title cannot be empty or whitespace only")
            if len(v) > 200:
                raise ValueError("Title must be 200 characters or less")
        return v

    @field_validator("description")
    @classmethod
    def validate_description(cls, v: Optional[str]) -> Optional[str]:
        """Validate description length if provided."""
        if v is not None and len(v) > 1000:
            raise ValueError("Description must be 1000 characters or less")
        return v


class TaskResponse(BaseModel):
    """Response model for a single task."""
    id: int
    user_id: str
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TaskListResponse(BaseModel):
    """Response model for task list with count."""
    tasks: List[TaskResponse]
    total: int


@router.get("", response_model=TaskListResponse)
def get_tasks(
    completed: Optional[bool] = None,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> TaskListResponse:
    """
    Get all tasks for the authenticated user.

    Optionally filter by completion status.

    Args:
        completed: Optional filter by completion status
        user_id: User ID from JWT (injected by dependency)
        db: Database session

    Returns:
        TaskListResponse with tasks array and total count
    """
    # Base query filtered by user_id
    query = select(Task).where(Task.user_id == user_id)

    # Apply completed filter if provided
    if completed is not None:
        query = query.where(Task.completed == completed)

    # Execute query
    tasks = db.exec(query).all()

    # Convert to response models
    task_responses = [TaskResponse.model_validate(task) for task in tasks]

    return TaskListResponse(
        tasks=task_responses,
        total=len(task_responses)
    )


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    request: TaskCreate,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> TaskResponse:
    """
    Create a new task for the authenticated user.

    Args:
        request: Task creation request with title and optional description
        user_id: User ID from JWT (injected by dependency)
        db: Database session

    Returns:
        Created task with all fields populated

    Raises:
        HTTPException 422: If validation fails
    """
    # Create task
    task = Task(
        user_id=user_id,
        title=request.title,
        description=request.description,
        completed=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return TaskResponse.model_validate(task)


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: int,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> TaskResponse:
    """
    Get a specific task by ID.

    Args:
        task_id: Task ID
        user_id: User ID from JWT (injected by dependency)
        db: Database session

    Returns:
        Task details

    Raises:
        HTTPException 404: If task not found
        HTTPException 403: If task belongs to different user
    """
    # Query task by ID
    task = db.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Verify ownership
    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task"
        )

    return TaskResponse.model_validate(task)


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    request: TaskUpdate,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> TaskResponse:
    """
    Update a task's title and/or description.

    Args:
        task_id: Task ID
        request: Update request with optional title and description
        user_id: User ID from JWT (injected by dependency)
        db: Database session

    Returns:
        Updated task

    Raises:
        HTTPException 404: If task not found
        HTTPException 403: If task belongs to different user
        HTTPException 422: If validation fails
    """
    # Query task
    task = db.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Verify ownership
    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this task"
        )

    # Update fields if provided
    if request.title is not None:
        task.title = request.title
    if request.description is not None:
        task.description = request.description

    task.updated_at = datetime.utcnow()

    db.add(task)
    db.commit()
    db.refresh(task)

    return TaskResponse.model_validate(task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> None:
    """
    Delete a task.

    Args:
        task_id: Task ID
        user_id: User ID from JWT (injected by dependency)
        db: Database session

    Returns:
        204 No Content

    Raises:
        HTTPException 404: If task not found
        HTTPException 403: If task belongs to different user
    """
    # Query task
    task = db.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Verify ownership
    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this task"
        )

    db.delete(task)
    db.commit()


@router.patch("/{task_id}/complete", response_model=TaskResponse)
def toggle_task_complete(
    task_id: int,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> TaskResponse:
    """
    Toggle a task's completion status.

    Args:
        task_id: Task ID
        user_id: User ID from JWT (injected by dependency)
        db: Database session

    Returns:
        Updated task with toggled completion status

    Raises:
        HTTPException 404: If task not found
        HTTPException 403: If task belongs to different user
    """
    # Query task
    task = db.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Verify ownership
    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this task"
        )

    # Toggle completion
    task.completed = not task.completed
    task.updated_at = datetime.utcnow()

    db.add(task)
    db.commit()
    db.refresh(task)

    return TaskResponse.model_validate(task)
