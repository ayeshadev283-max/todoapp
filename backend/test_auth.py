"""Test authentication endpoints."""

import json
import time

import requests

BASE_URL = "http://127.0.0.1:8000"


def test_signup():
    """Test T041: Signup endpoint."""
    print("=== Testing Signup (T041) ===")
    response = requests.post(
        f"{BASE_URL}/api/auth/signup",
        json={"email": "testuser2@example.com", "password": "SecurePass123!"},
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response


def test_login(email, password):
    """Test T042: Login endpoint."""
    print("\n=== Testing Login (T042) ===")
    response = requests.post(
        f"{BASE_URL}/api/auth/login", json={"email": email, "password": password}
    )
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Response: {json.dumps(data, indent=2)}")
    if "token" in data:
        token = data["token"]
        print(f"\nJWT Token (first 50 chars): {token[:50]}...")
    return response


def test_invalid_login():
    """Test T043: Invalid login."""
    print("\n=== Testing Invalid Login (T043) ===")
    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": "testuser2@example.com", "password": "WrongPassword!"},
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response


if __name__ == "__main__":
    # Wait for server to be ready
    time.sleep(2)

    # Run tests
    signup_resp = test_signup()
    login_resp = test_login("testuser2@example.com", "SecurePass123!")
    invalid_resp = test_invalid_login()

    # Summary
    print("\n=== Test Summary ===")
    print(f"T041 Signup: {'PASS' if signup_resp.status_code in [200, 201] else 'FAIL'}")
    print(f"T042 Login: {'PASS' if login_resp.status_code == 200 else 'FAIL'}")
    print(
        f"T043 Invalid Login: {'PASS' if invalid_resp.status_code == 401 else 'FAIL'}"
    )
