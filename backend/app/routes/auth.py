"""Authentication routes for user signup and login."""

import re
import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, field_validator
from sqlmodel import Session, select

from app.auth import create_access_token, get_password_hash, verify_password
from app.database import get_db
from app.models import User

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


# Request/Response Models
class SignupRequest(BaseModel):
    """Request model for user signup."""

    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        """Validate password meets minimum requirements."""
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        return v


class LoginRequest(BaseModel):
    """Request model for user login."""

    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    """Response model for successful authentication."""

    user_id: str
    email: str
    token: str


@router.post(
    "/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED
)
def signup(request: SignupRequest, db: Session = Depends(get_db)) -> AuthResponse:
    """
    Register a new user account.

    Creates a new user with hashed password and returns a JWT token.

    Args:
        request: Signup request with email and password
        db: Database session

    Returns:
        AuthResponse with user_id, email, and JWT token

    Raises:
        HTTPException 400: If email already registered
    """
    # Check if user already exists
    existing_user = db.exec(select(User).where(User.email == request.email)).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    # Generate UUID for user ID
    user_id = str(uuid.uuid4())

    # Hash password (truncate to 72 bytes for bcrypt compatibility)
    password_bytes = request.password.encode("utf-8")
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    password_to_hash = password_bytes.decode("utf-8", errors="ignore")

    password_hash = get_password_hash(password_to_hash)

    # Create user
    user = User(
        id=user_id,
        email=request.email,
        password_hash=password_hash,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    # Generate JWT token
    token = create_access_token(data={"user_id": user.id, "email": user.email})

    return AuthResponse(user_id=user.id, email=user.email, token=token)


@router.post("/login", response_model=AuthResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)) -> AuthResponse:
    """
    Authenticate a user and return JWT token.

    Args:
        request: Login request with email and password
        db: Database session

    Returns:
        AuthResponse with user_id, email, and JWT token

    Raises:
        HTTPException 401: If credentials are invalid
    """
    # Find user by email
    user = db.exec(select(User).where(User.email == request.email)).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password"
        )

    # Verify password (truncate to 72 bytes to match signup)
    password_bytes = request.password.encode("utf-8")
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    password_to_verify = password_bytes.decode("utf-8", errors="ignore")

    if not verify_password(password_to_verify, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password"
        )

    # Generate JWT token
    token = create_access_token(data={"user_id": user.id, "email": user.email})

    return AuthResponse(user_id=user.id, email=user.email, token=token)
