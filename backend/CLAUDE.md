# Backend Development Rules

This file contains backend-specific development rules for the FastAPI application.

## Python Configuration

- **Version**: Python 3.11+
- **Type Hints**: Required for all function signatures
- **Formatter**: Black with default settings (line length 88)
- **Import Sorter**: isort with Black-compatible settings
- **Linter**: Ruff or flake8

## Code Style

- **PEP 8**: Strict compliance
- **Docstrings**: Google-style for all public functions
- **Type Hints**: Use `typing` module for complex types
- **Async**: Use `async/await` for database operations

## Function Structure

```python
def example_function(param1: str, param2: int) -> dict[str, Any]:
    """
    Brief description of function.

    Args:
        param1: Description of param1
        param2: Description of param2

    Returns:
        Dictionary containing result

    Raises:
        ValueError: If param1 is empty
    """
    # Function implementation
    return {"result": "value"}
```

## File Organization

- `app/main.py`: FastAPI application entry point
- `app/models.py`: SQLModel database models
- `app/routes/`: API route handlers (grouped by resource)
- `app/middleware/`: Custom middleware (JWT verification)
- `app/database.py`: Database connection and session management
- `app/auth.py`: Authentication utilities (JWT, password hashing)

## Database Operations

- **ORM**: SQLModel for all database operations
- **Migrations**: Alembic for schema changes
- **Transactions**: Use `with` blocks for session management
- **Indexes**: Create indexes for frequently queried columns

## Authentication & Security

- **Password Hashing**: bcrypt with cost factor 12
- **JWT**: python-jose with HS256 algorithm
- **Token Expiration**: 7 days
- **User Isolation**: Filter all queries by `user_id` from JWT
- **Ownership Verification**: Always check task.user_id == current_user_id

## API Design

- **RESTful**: Follow REST conventions
- **Status Codes**:
  - 200: Success
  - 201: Created
  - 204: No Content (for DELETE)
  - 400: Bad Request (validation error)
  - 401: Unauthorized (missing/invalid JWT)
  - 403: Forbidden (valid JWT but not authorized for resource)
  - 404: Not Found
  - 500: Internal Server Error
- **Pydantic Models**: Define request/response schemas
- **Validation**: Use Pydantic validators

## Error Handling

```python
from fastapi import HTTPException

# Example
if not task:
    raise HTTPException(
        status_code=404,
        detail="Task not found"
    )
```

## CORS Configuration

- Explicit origin whitelist (no `*`)
- Read from `CORS_ORIGINS` environment variable
- Allow credentials for JWT cookies

## Environment Variables

- Use `os.getenv()` with defaults
- Validate required variables at startup
- Never commit `.env` files (use `.env.example`)

## Testing

- Manual testing with curl or Postman
- Test all endpoints with valid JWT
- Test error cases (401, 403, 404)
- Verify user isolation

## Database Migrations

```bash
# Create migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

## Constitution Compliance

- Max function length: 50 lines
- Max cyclomatic complexity: 10
- All code must be traceable to tasks.md
- Type hints required for all functions
