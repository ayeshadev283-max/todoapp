"""Authentication utilities for JWT and password management."""

import hashlib
import os
from datetime import datetime, timedelta
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

# JWT Configuration
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET", "your-secret-key-change-in-production")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_DAYS = int(os.getenv("JWT_EXPIRATION_DAYS", "7"))

# Password hashing context with bcrypt
# Use truncate_error=False to allow our manual SHA256 pre-hashing for long passwords
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12,
    bcrypt__truncate_error=False,
)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token with user data.

    Args:
        data: Dictionary containing user claims (user_id, email, etc.)
        expires_delta: Optional custom expiration time. Defaults to 7 days.

    Returns:
        Encoded JWT token as string

    Example:
        token = create_access_token({"user_id": "123", "email": "user@example.com"})
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> Optional[dict]:
    """
    Verify and decode a JWT token.

    Args:
        token: JWT token string to verify

    Returns:
        Decoded token payload as dict, or None if invalid

    Raises:
        JWTError: If token is invalid or expired
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


def get_password_hash(password: str) -> str:
    """
    Hash a password using bcrypt with cost factor 12.

    For passwords longer than 72 bytes, we first hash with SHA256
    to ensure compatibility with bcrypt's length limit.

    Args:
        password: Plain text password to hash

    Returns:
        Bcrypt hashed password string

    Example:
        hashed = get_password_hash("SecurePass123!")
    """
    # Bcrypt has a 72-byte limit. For longer passwords, pre-hash with SHA256
    if len(password.encode("utf-8")) > 72:
        password = hashlib.sha256(password.encode("utf-8")).hexdigest()

    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain text password against a hashed password.

    For passwords longer than 72 bytes, we first hash with SHA256
    to match the hashing behavior in get_password_hash.

    Args:
        plain_password: Plain text password from user input
        hashed_password: Bcrypt hashed password from database

    Returns:
        True if password matches, False otherwise

    Example:
        is_valid = verify_password("SecurePass123!", stored_hash)
    """
    # Bcrypt has a 72-byte limit. For longer passwords, pre-hash with SHA256
    if len(plain_password.encode("utf-8")) > 72:
        plain_password = hashlib.sha256(plain_password.encode("utf-8")).hexdigest()

    return pwd_context.verify(plain_password, hashed_password)
