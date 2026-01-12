# Security Test Report: 002-web-app

**Feature**: Multi-User Web Application
**Test Date**: 2026-01-10
**Status**: Ready for manual execution

---

## Test Environment

- **Backend**: http://localhost:8000
- **Frontend**: http://localhost:3000
- **Database**: Neon PostgreSQL (production) or local PostgreSQL

---

## Test Cases

### T129-T133: User Data Isolation Tests

**Objective**: Verify that users can only access their own tasks.

#### Test Steps:

1. **Create User A** (T129)
   ```bash
   # Sign up User A
   curl -X POST http://localhost:8000/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"usera@example.com","password":"SecurePass123!"}'

   # Expected: 200 OK, returns {user_id, email, token}
   # Save token as USER_A_TOKEN
   ```

2. **Create Tasks for User A** (T130-T131)
   ```bash
   # Create confidential task
   curl -X POST http://localhost:8000/api/tasks \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $USER_A_TOKEN" \
     -d '{"title":"Confidential project notes","description":"Private information"}'

   # Expected: 201 Created, returns task with id
   # Save task ID as TASK_A_ID

   # Create second task
   curl -X POST http://localhost:8000/api/tasks \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $USER_A_TOKEN" \
     -d '{"title":"Personal task","description":"Another private task"}'

   # Mark second task as complete
   curl -X PATCH http://localhost:8000/api/tasks/{task_id}/complete \
     -H "Authorization: Bearer $USER_A_TOKEN"
   ```

3. **Create User B** (T132)
   ```bash
   # Sign up User B (in incognito window or different browser)
   curl -X POST http://localhost:8000/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"userb@example.com","password":"SecurePass456!"}'

   # Expected: 200 OK, returns {user_id, email, token}
   # Save token as USER_B_TOKEN
   ```

4. **Verify User B Cannot See User A's Tasks** (T133)
   ```bash
   # Get User B's task list
   curl -X GET http://localhost:8000/api/tasks \
     -H "Authorization: Bearer $USER_B_TOKEN"

   # Expected: 200 OK, returns {tasks: [], total: 0}
   ```

**Result**: ☐ PASS ☐ FAIL

**Notes**:
_Record any issues or observations here_

---

### T134: Cross-User Task Access Prevention

**Objective**: Verify User B cannot access User A's tasks via API.

#### Test Steps:

```bash
# Attempt to get User A's task using User B's token
curl -X GET http://localhost:8000/api/tasks/$TASK_A_ID \
  -H "Authorization: Bearer $USER_B_TOKEN"

# Expected: 403 Forbidden
# Response: {"detail": "Not authorized to access this task"}
```

**Result**: ☐ PASS ☐ FAIL

**Notes**:
_Record the actual response code and message_

---

### T135: URL Manipulation Protection

**Objective**: Verify frontend prevents unauthorized task access.

#### Test Steps:

1. As User B, manually navigate to: `http://localhost:3000/tasks/{TASK_A_ID}`
2. Expected behavior:
   - Page shows "Task not found" or "You do not have permission to edit this task"
   - User is not able to see or edit User A's task data

**Result**: ☐ PASS ☐ FAIL

**Notes**:
_Record what the frontend displays_

---

### T136: JWT Expiration Test

**Objective**: Verify expired JWTs are rejected.

#### Test Steps:

1. Go to https://jwt.io
2. Paste User A's token
3. Modify the `exp` claim to a past timestamp (e.g., `1609459200` for Jan 1, 2021)
4. Copy the modified token
5. Try to access API:
   ```bash
   curl -X GET http://localhost:8000/api/tasks \
     -H "Authorization: Bearer {modified_expired_token}"

   # Expected: 401 Unauthorized
   # Response: {"detail": "Token has expired"}
   ```

**Result**: ☐ PASS ☐ FAIL

**Notes**:
_Record the actual response_

---

### T137: Missing Authorization Header Test

**Objective**: Verify API requires authentication.

#### Test Steps:

```bash
# Try to access protected endpoint without Authorization header
curl -X GET http://localhost:8000/api/tasks

# Expected: 401 Unauthorized
# Response: {"detail": "Missing Authorization header"}
```

**Result**: ☐ PASS ☐ FAIL

**Notes**:
_Record the actual response_

---

### T138: Invalid JWT Signature Test

**Objective**: Verify tampered JWTs are rejected.

#### Test Steps:

1. Go to https://jwt.io
2. Paste User A's token
3. Modify the payload (e.g., change user_id to a different value)
4. Keep the signature unchanged (this creates an invalid signature)
5. Try to access API:
   ```bash
   curl -X GET http://localhost:8000/api/tasks \
     -H "Authorization: Bearer {tampered_token}"

   # Expected: 401 Unauthorized
   # Response: {"detail": "Invalid token signature"}
   ```

**Result**: ☐ PASS ☐ FAIL

**Notes**:
_Record the actual response_

---

### T139: CORS Test

**Objective**: Verify CORS is properly configured.

#### Test Steps:

```bash
# Test CORS from non-whitelisted origin
curl -X OPTIONS http://localhost:8000/api/tasks \
  -H "Origin: https://malicious-site.com" \
  -H "Access-Control-Request-Method: GET" \
  -v

# Expected: No Access-Control-Allow-Origin header in response
# OR Access-Control-Allow-Origin should only include whitelisted origins
```

**Result**: ☐ PASS ☐ FAIL

**Notes**:
_Record the CORS headers returned_

---

### T140: Task Update Isolation

**Objective**: Verify task updates remain isolated.

#### Test Steps:

```bash
# User A updates their task
curl -X PUT http://localhost:8000/api/tasks/$TASK_A_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_A_TOKEN" \
  -d '{"title":"Updated confidential notes","description":"Still private"}'

# Expected: 200 OK, task updated

# User B tries to access the updated task
curl -X GET http://localhost:8000/api/tasks/$TASK_A_ID \
  -H "Authorization: Bearer $USER_B_TOKEN"

# Expected: 403 Forbidden
```

**Result**: ☐ PASS ☐ FAIL

**Notes**:
_Record any issues_

---

### T141: Task Deletion Verification

**Objective**: Verify deleted tasks are inaccessible.

#### Test Steps:

```bash
# User A deletes their task
curl -X DELETE http://localhost:8000/api/tasks/$TASK_A_ID \
  -H "Authorization: Bearer $USER_A_TOKEN"

# Expected: 204 No Content

# User A tries to access deleted task
curl -X GET http://localhost:8000/api/tasks/$TASK_A_ID \
  -H "Authorization: Bearer $USER_A_TOKEN"

# Expected: 404 Not Found

# User B tries to access deleted task
curl -X GET http://localhost:8000/api/tasks/$TASK_A_ID \
  -H "Authorization: Bearer $USER_B_TOKEN"

# Expected: 404 Not Found
```

**Result**: ☐ PASS ☐ FAIL

**Notes**:
_Record any issues_

---

## Summary

| Test Case | Status | Notes |
|-----------|--------|-------|
| T129-T133: User Data Isolation | ☐ PASS ☐ FAIL | |
| T134: Cross-User Access Prevention | ☐ PASS ☐ FAIL | |
| T135: URL Manipulation Protection | ☐ PASS ☐ FAIL | |
| T136: JWT Expiration | ☐ PASS ☐ FAIL | |
| T137: Missing Auth Header | ☐ PASS ☐ FAIL | |
| T138: Invalid JWT Signature | ☐ PASS ☐ FAIL | |
| T139: CORS Configuration | ☐ PASS ☐ FAIL | |
| T140: Task Update Isolation | ☐ PASS ☐ FAIL | |
| T141: Task Deletion Verification | ☐ PASS ☐ FAIL | |

**Overall Status**: ☐ ALL TESTS PASSED ☐ SOME TESTS FAILED

---

## Issues Found

_Document any security vulnerabilities or issues discovered during testing_

1.
2.
3.

---

## Recommendations

_List any security improvements or fixes needed_

1.
2.
3.

---

## Tester Information

- **Tester Name**: _________________
- **Test Date**: _________________
- **Environment**: ☐ Local ☐ Staging ☐ Production
- **Signature**: _________________
