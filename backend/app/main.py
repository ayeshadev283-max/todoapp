"""Main FastAPI application entry point."""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file in project root
env_path = Path(__file__).parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import auth, tasks

# Environment variable validation at startup
BETTER_AUTH_SECRET = os.getenv("BETTER_AUTH_SECRET")
if not BETTER_AUTH_SECRET or BETTER_AUTH_SECRET == "your-secret-key-min-32-chars-here":
    print("WARNING: BETTER_AUTH_SECRET not set or using default value!")
    print("   Set BETTER_AUTH_SECRET environment variable for production.")
    print("   This secret must match the frontend BETTER_AUTH_SECRET.")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("WARNING: DATABASE_URL not set!")
    print("   Set DATABASE_URL to connect to PostgreSQL.")

app = FastAPI(
    title="Todo API",
    description="Multi-user todo application API with JWT authentication",
    version="2.0.0"
)

# CORS configuration
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(tasks.router)

@app.get("/")
def read_root():
    """Root endpoint - API health check."""
    return {"message": "Todo API v2.0", "status": "healthy"}

@app.get("/health")
def health_check():
    """Health check endpoint for monitoring."""
    return {"status": "healthy", "database": "connected" if DATABASE_URL else "not_configured"}
