"""
Health check endpoint for monitoring and deployment verification.
"""

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlmodel import Session, select

from app.database import get_db

router = APIRouter(tags=["health"])


@router.get("/health")
def health_check(db: Session = Depends(get_db)) -> dict:
    """
    Health check endpoint.

    Returns service status and database connectivity.
    Use this endpoint for:
    - Container orchestration health checks
    - Load balancer health monitoring
    - Deployment verification

    Returns:
        dict: Health status with database connectivity info
            - status: "healthy" if service is running
            - database: "connected" if DB is reachable, "error" otherwise

    Example:
        GET /health
        Response: {"status": "healthy", "database": "connected"}
    """
    # Check database connectivity
    db_status = "connected"
    try:
        # Simple query to verify database connection
        db.exec(text("SELECT 1"))
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "healthy",
        "database": db_status,
    }
