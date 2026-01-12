"""Database connection and session management."""

import os
from typing import Generator

from sqlalchemy.pool import StaticPool
from sqlmodel import Session, create_engine

# Get DATABASE_URL from environment
DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://todo_user:todo_password@localhost:5432/todo_dev"
)

# Create engine with connection pooling
engine = create_engine(
    DATABASE_URL,
    echo=False,  # Set to True for SQL query logging during development
    pool_pre_ping=True,  # Verify connections before using
)


def get_db() -> Generator[Session, None, None]:
    """
    Database session dependency for FastAPI.

    Yields a SQLModel Session that automatically commits on success
    and rolls back on exceptions.

    Yields:
        Session: SQLModel database session

    Example:
        @app.get("/tasks")
        def get_tasks(db: Session = Depends(get_db)):
            tasks = db.exec(select(Task)).all()
            return tasks
    """
    with Session(engine) as session:
        yield session
