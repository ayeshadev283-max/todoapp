"""Add indexes to tasks table

Revision ID: 003_indexes
Revises: 002_tasks
Create Date: 2026-01-08 13:02:00

"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "003_indexes"
down_revision: Union[str, None] = "002_tasks"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add indexes for performance optimization."""
    # Index on user_id for faster filtering by user
    op.create_index(op.f("ix_tasks_user_id"), "tasks", ["user_id"], unique=False)

    # Index on completed for filtering by status
    op.create_index(op.f("ix_tasks_completed"), "tasks", ["completed"], unique=False)

    # Composite index on user_id + completed for common queries
    op.create_index(
        "ix_tasks_user_id_completed", "tasks", ["user_id", "completed"], unique=False
    )


def downgrade() -> None:
    """Remove indexes from tasks table."""
    op.drop_index("ix_tasks_user_id_completed", table_name="tasks")
    op.drop_index(op.f("ix_tasks_completed"), table_name="tasks")
    op.drop_index(op.f("ix_tasks_user_id"), table_name="tasks")
