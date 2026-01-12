"""JWT authentication middleware for protected routes."""

from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.auth import verify_token

# HTTP Bearer token scheme for Swagger UI
security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    """
    Extract and verify JWT token from Authorization header.

    This dependency function validates the JWT token and extracts the user_id.
    Use this as a dependency in protected routes to ensure authentication.

    Args:
        credentials: HTTP Bearer token from Authorization header

    Returns:
        user_id: String user ID from JWT payload

    Raises:
        HTTPException 401: If token is missing, invalid, or expired

    Example:
        @app.get("/api/tasks")
        def get_tasks(user_id: str = Depends(get_current_user)):
            # user_id is guaranteed to be valid here
            tasks = db.query(Task).filter(Task.user_id == user_id).all()
            return tasks
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    payload = verify_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Extract user_id from JWT payload
    user_id: Optional[str] = payload.get("user_id")

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload missing user_id",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user_id
