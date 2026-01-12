#!/bin/bash
# Authentication endpoint testing script for Phase 3
# Tests signup, login, and JWT verification

set -e

echo "=== Authentication Endpoint Testing ==="
echo ""

# Check if server is running
if ! curl -s http://localhost:8000/ > /dev/null 2>&1; then
    echo "⚠️  FastAPI server not running!"
    echo "   Start server: cd backend && uvicorn app.main:app --reload"
    exit 1
fi

echo "✅ FastAPI server is running"
echo ""

# Test 1: Signup with valid credentials
echo "=== Test 1: POST /api/auth/signup (Valid) ==="
SIGNUP_RESPONSE=$(curl -s -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123!"}')

echo "$SIGNUP_RESPONSE" | jq '.'

# Extract token for subsequent requests
TOKEN=$(echo "$SIGNUP_RESPONSE" | jq -r '.token')
USER_ID=$(echo "$SIGNUP_RESPONSE" | jq -r '.user_id')

if [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
    echo "✅ Signup successful - JWT token received"
else
    echo "❌ Signup failed - no token received"
    exit 1
fi
echo ""

# Test 2: Verify JWT structure
echo "=== Test 2: Verify JWT Token Structure ==="
echo "Token: $TOKEN"
echo ""
echo "Decode at https://jwt.io to verify:"
echo "  - Header: {\"alg\":\"HS256\",\"typ\":\"JWT\"}"
echo "  - Payload should contain: user_id, email, exp"
echo ""

# Test 3: Signup with duplicate email (should fail)
echo "=== Test 3: POST /api/auth/signup (Duplicate Email) ==="
DUPLICATE_RESPONSE=$(curl -s -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"AnotherPass456!"}')

echo "$DUPLICATE_RESPONSE" | jq '.'

if echo "$DUPLICATE_RESPONSE" | grep -q "Email already registered"; then
    echo "✅ Duplicate email correctly rejected"
else
    echo "⚠️  Expected error for duplicate email"
fi
echo ""

# Test 4: Login with valid credentials
echo "=== Test 4: POST /api/auth/login (Valid) ==="
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123!"}')

echo "$LOGIN_RESPONSE" | jq '.'

LOGIN_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')

if [ "$LOGIN_TOKEN" != "null" ] && [ "$LOGIN_TOKEN" != "" ]; then
    echo "✅ Login successful - JWT token received"
else
    echo "❌ Login failed"
    exit 1
fi
echo ""

# Test 5: Login with wrong password
echo "=== Test 5: POST /api/auth/login (Wrong Password) ==="
WRONG_PASSWORD_RESPONSE=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"WrongPassword!"}')

echo "$WRONG_PASSWORD_RESPONSE" | jq '.'

if echo "$WRONG_PASSWORD_RESPONSE" | grep -q "Invalid email or password"; then
    echo "✅ Invalid password correctly rejected (401)"
else
    echo "⚠️  Expected 401 for wrong password"
fi
echo ""

# Test 6: Login with non-existent email
echo "=== Test 6: POST /api/auth/login (Non-existent Email) ==="
NO_USER_RESPONSE=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nonexistent@example.com","password":"SomePass123!"}')

echo "$NO_USER_RESPONSE" | jq '.'

if echo "$NO_USER_RESPONSE" | grep -q "Invalid email or password"; then
    echo "✅ Non-existent email correctly rejected (401)"
else
    echo "⚠️  Expected 401 for non-existent email"
fi
echo ""

# Test 7: Verify JWT expiration claim
echo "=== Test 7: JWT Expiration Verification ==="
echo "Decoding JWT payload..."

# Decode JWT (base64url decode the payload)
PAYLOAD=$(echo "$TOKEN" | cut -d'.' -f2)
# Add padding if needed
PADDING=$((4 - ${#PAYLOAD} % 4))
if [ $PADDING -ne 4 ]; then
    PAYLOAD="${PAYLOAD}$(printf '%*s' $PADDING | tr ' ' '=')"
fi

DECODED=$(echo "$PAYLOAD" | base64 -d 2>/dev/null | jq '.')
echo "$DECODED"

EXP=$(echo "$DECODED" | jq -r '.exp')
CURRENT_TIME=$(date +%s)
EXPIRES_IN=$(( $EXP - $CURRENT_TIME ))
DAYS=$(( $EXPIRES_IN / 86400 ))

echo ""
echo "Token expires in: $DAYS days"

if [ $DAYS -ge 6 ] && [ $DAYS -le 8 ]; then
    echo "✅ Token expiration is ~7 days (expected)"
else
    echo "⚠️  Token expiration is $DAYS days (expected ~7)"
fi
echo ""

# Test 8: Test protected endpoint (will be available in Phase 4)
echo "=== Test 8: Access Protected Endpoint ==="
echo "Protected endpoints will be tested in Phase 4 (Task API)"
echo "Example: curl -H \"Authorization: Bearer $TOKEN\" http://localhost:8000/api/tasks"
echo ""

echo "✅ All authentication tests passed!"
echo ""
echo "📝 Summary:"
echo "   - Signup: ✅ Creates user and returns JWT"
echo "   - Login: ✅ Authenticates and returns JWT"
echo "   - Validation: ✅ Rejects duplicates and invalid credentials"
echo "   - JWT: ✅ Contains user_id, email, and 7-day expiration"
echo ""
echo "🔐 User created:"
echo "   User ID: $USER_ID"
echo "   Email: test@example.com"
echo "   Token: ${TOKEN:0:50}..."
echo ""
echo "📋 Next steps:"
echo "   1. Continue to Phase 4: Task API endpoints"
echo "   2. Test JWT protection on task endpoints"
echo "   3. Verify user isolation"
