#!/bin/bash

# Security Integration Tests for 002-web-app
# This script automates the security test cases from Phase 9
# Run this after starting both backend (port 8000) and frontend (port 3000)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="${BACKEND_URL:-http://localhost:8000}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"

# Test counters
PASSED=0
FAILED=0

# Helper function to print test results
print_result() {
  local test_name="$1"
  local result="$2"
  local message="$3"

  if [ "$result" = "PASS" ]; then
    echo -e "${GREEN}✓ PASS${NC}: $test_name"
    ((PASSED++))
  else
    echo -e "${RED}✗ FAIL${NC}: $test_name - $message"
    ((FAILED++))
  fi
}

echo "========================================="
echo "Security Integration Tests"
echo "========================================="
echo "Backend URL: $BACKEND_URL"
echo "Frontend URL: $FRONTEND_URL"
echo ""

# Test T137: Missing Authorization Header
echo "Running T137: Missing Authorization Header Test..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/tasks")
if [ "$RESPONSE" = "401" ]; then
  print_result "T137: Missing Auth Header" "PASS" ""
else
  print_result "T137: Missing Auth Header" "FAIL" "Expected 401, got $RESPONSE"
fi
echo ""

# Test T129: Create User A
echo "Running T129: Create User A..."
USER_A_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{"email":"usera@example.com","password":"SecurePass123!"}')

if echo "$USER_A_RESPONSE" | grep -q "token"; then
  USER_A_TOKEN=$(echo "$USER_A_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
  print_result "T129: Create User A" "PASS" ""
else
  print_result "T129: Create User A" "FAIL" "Failed to create user or get token"
  echo "Response: $USER_A_RESPONSE"
  exit 1
fi
echo ""

# Test T130: Create Confidential Task for User A
echo "Running T130: Create Confidential Task..."
TASK_A_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_A_TOKEN" \
  -d '{"title":"Confidential project notes","description":"Private information"}')

if echo "$TASK_A_RESPONSE" | grep -q '"id"'; then
  TASK_A_ID=$(echo "$TASK_A_RESPONSE" | grep -o '"id":[0-9]*' | cut -d':' -f2)
  print_result "T130: Create Confidential Task" "PASS" ""
else
  print_result "T130: Create Confidential Task" "FAIL" "Failed to create task"
  echo "Response: $TASK_A_RESPONSE"
fi
echo ""

# Test T131: Create and Complete Second Task
echo "Running T131: Create Second Task and Mark Complete..."
TASK_A2_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_A_TOKEN" \
  -d '{"title":"Personal task","description":"Another private task"}')

if echo "$TASK_A2_RESPONSE" | grep -q '"id"'; then
  TASK_A2_ID=$(echo "$TASK_A2_RESPONSE" | grep -o '"id":[0-9]*' | cut -d':' -f2)

  # Mark as complete
  COMPLETE_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X PATCH "$BACKEND_URL/api/tasks/$TASK_A2_ID/complete" \
    -H "Authorization: Bearer $USER_A_TOKEN")

  if [ "$COMPLETE_RESPONSE" = "200" ]; then
    print_result "T131: Create & Complete Task" "PASS" ""
  else
    print_result "T131: Create & Complete Task" "FAIL" "Failed to mark complete, got $COMPLETE_RESPONSE"
  fi
else
  print_result "T131: Create & Complete Task" "FAIL" "Failed to create second task"
fi
echo ""

# Test T132: Create User B
echo "Running T132: Create User B..."
USER_B_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{"email":"userb@example.com","password":"SecurePass456!"}')

if echo "$USER_B_RESPONSE" | grep -q "token"; then
  USER_B_TOKEN=$(echo "$USER_B_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
  print_result "T132: Create User B" "PASS" ""
else
  print_result "T132: Create User B" "FAIL" "Failed to create user or get token"
  echo "Response: $USER_B_RESPONSE"
  exit 1
fi
echo ""

# Test T133: Verify User B's Task List is Empty
echo "Running T133: Verify User B Cannot See User A's Tasks..."
USER_B_TASKS=$(curl -s -X GET "$BACKEND_URL/api/tasks" \
  -H "Authorization: Bearer $USER_B_TOKEN")

if echo "$USER_B_TASKS" | grep -q '"total":0'; then
  print_result "T133: User B Task List Empty" "PASS" ""
else
  print_result "T133: User B Task List Empty" "FAIL" "User B can see tasks they shouldn't"
  echo "Response: $USER_B_TASKS"
fi
echo ""

# Test T134: User B Cannot Access User A's Task
echo "Running T134: Cross-User Task Access Prevention..."
CROSS_ACCESS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BACKEND_URL/api/tasks/$TASK_A_ID" \
  -H "Authorization: Bearer $USER_B_TOKEN")

if [ "$CROSS_ACCESS_RESPONSE" = "403" ] || [ "$CROSS_ACCESS_RESPONSE" = "404" ]; then
  print_result "T134: Cross-User Access Prevention" "PASS" ""
else
  print_result "T134: Cross-User Access Prevention" "FAIL" "Expected 403/404, got $CROSS_ACCESS_RESPONSE"
fi
echo ""

# Test T140: Task Update Isolation
echo "Running T140: Task Update Isolation..."
UPDATE_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$BACKEND_URL/api/tasks/$TASK_A_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_A_TOKEN" \
  -d '{"title":"Updated confidential notes","description":"Still private"}')

if [ "$UPDATE_RESPONSE" = "200" ]; then
  # Verify User B still cannot access
  ACCESS_AFTER_UPDATE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BACKEND_URL/api/tasks/$TASK_A_ID" \
    -H "Authorization: Bearer $USER_B_TOKEN")

  if [ "$ACCESS_AFTER_UPDATE" = "403" ] || [ "$ACCESS_AFTER_UPDATE" = "404" ]; then
    print_result "T140: Task Update Isolation" "PASS" ""
  else
    print_result "T140: Task Update Isolation" "FAIL" "User B can access updated task"
  fi
else
  print_result "T140: Task Update Isolation" "FAIL" "User A cannot update own task, got $UPDATE_RESPONSE"
fi
echo ""

# Test T141: Task Deletion Verification
echo "Running T141: Task Deletion Verification..."
DELETE_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$BACKEND_URL/api/tasks/$TASK_A_ID" \
  -H "Authorization: Bearer $USER_A_TOKEN")

if [ "$DELETE_RESPONSE" = "204" ] || [ "$DELETE_RESPONSE" = "200" ]; then
  # Verify User A cannot access deleted task
  A_ACCESS=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BACKEND_URL/api/tasks/$TASK_A_ID" \
    -H "Authorization: Bearer $USER_A_TOKEN")

  # Verify User B cannot access deleted task
  B_ACCESS=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BACKEND_URL/api/tasks/$TASK_A_ID" \
    -H "Authorization: Bearer $USER_B_TOKEN")

  if [ "$A_ACCESS" = "404" ] && [ "$B_ACCESS" = "404" ]; then
    print_result "T141: Task Deletion Verification" "PASS" ""
  else
    print_result "T141: Task Deletion Verification" "FAIL" "Deleted task still accessible (A: $A_ACCESS, B: $B_ACCESS)"
  fi
else
  print_result "T141: Task Deletion Verification" "FAIL" "Failed to delete task, got $DELETE_RESPONSE"
fi
echo ""

# Manual tests reminder
echo "========================================="
echo "Manual Tests Required:"
echo "========================================="
echo -e "${YELLOW}T135:${NC} URL Manipulation - Navigate to $FRONTEND_URL/tasks/$TASK_A2_ID as User B"
echo -e "${YELLOW}T136:${NC} JWT Expiration - Use jwt.io to create expired token and test"
echo -e "${YELLOW}T138:${NC} Invalid JWT Signature - Tamper with JWT payload and test"
echo -e "${YELLOW}T139:${NC} CORS Test - Use curl with non-whitelisted Origin header"
echo ""

# Summary
echo "========================================="
echo "Test Summary"
echo "========================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}All automated tests passed!${NC}"
  exit 0
else
  echo -e "${RED}Some tests failed. Please review.${NC}"
  exit 1
fi
