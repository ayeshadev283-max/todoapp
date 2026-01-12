# Testing Guide: 002-web-app

This document provides instructions for running integration and security tests for the multi-user web application.

---

## Prerequisites

Before running tests, ensure:

1. **Backend is running** on `http://localhost:8000`
   ```bash
   cd backend
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   uvicorn app.main:app --reload
   ```

2. **Frontend is running** on `http://localhost:3000`
   ```bash
   cd frontend
   npm run dev
   ```

3. **Database is accessible** (PostgreSQL via Neon or local)
   - Verify `DATABASE_URL` is set in `backend/.env`
   - Run migrations: `cd backend && alembic upgrade head`

4. **Environment variables are set**
   - `BETTER_AUTH_SECRET` in `backend/.env`
   - `NEXT_PUBLIC_API_URL` in `frontend/.env.local`

---

## Running Automated Security Tests

### Option 1: Bash Script (Linux/Mac/WSL)

```bash
cd specs/002-web-app
chmod +x security-tests.sh
./security-tests.sh
```

### Option 2: Manual Execution

Follow the test cases in `security-test-report.md` and execute each curl command manually.

---

## Test Coverage

### Phase 9: Integration Testing (14 tasks)

| Test ID | Description | Type | Status |
|---------|-------------|------|--------|
| T129 | Create test user A | Automated | ☐ |
| T130 | User A creates confidential task | Automated | ☐ |
| T131 | User A creates and completes task | Automated | ☐ |
| T132 | Create test user B | Automated | ☐ |
| T133 | Verify User B cannot see User A's tasks | Automated | ☐ |
| T134 | Cross-user task access prevention | Automated | ☐ |
| T135 | URL manipulation protection | Manual | ☐ |
| T136 | JWT expiration test | Manual | ☐ |
| T137 | Missing auth header test | Automated | ☐ |
| T138 | Invalid JWT signature test | Manual | ☐ |
| T139 | CORS configuration test | Manual | ☐ |
| T140 | Task update isolation | Automated | ☐ |
| T141 | Task deletion verification | Automated | ☐ |
| T142 | Document security test results | ✅ Complete | ✅ |

---

## Manual Test Instructions

### T135: URL Manipulation Protection

1. Log in as User B at `http://localhost:3000`
2. Note User B has no tasks
3. Manually navigate to `http://localhost:3000/tasks/{USER_A_TASK_ID}`
4. **Expected**: Error message "Task not found" or "You do not have permission to edit this task"
5. **Verify**: User B cannot view or edit User A's task data

### T136: JWT Expiration Test

1. Get User A's JWT token from signup/login response
2. Visit https://jwt.io and paste the token
3. In the payload section, find the `exp` claim
4. Change `exp` to a past timestamp (e.g., `1609459200` for Jan 1, 2021)
5. Copy the modified token from the "Encoded" section
6. Test with curl:
   ```bash
   curl -X GET http://localhost:8000/api/tasks \
     -H "Authorization: Bearer {expired_token}"
   ```
7. **Expected**: `401 Unauthorized` with message about expired token

### T138: Invalid JWT Signature Test

1. Get User A's JWT token
2. Visit https://jwt.io and paste the token
3. In the payload section, change the `user_id` to a different value
4. **Do NOT** change the secret in the "Verify Signature" section (this creates an invalid signature)
5. Copy the modified token
6. Test with curl:
   ```bash
   curl -X GET http://localhost:8000/api/tasks \
     -H "Authorization: Bearer {tampered_token}"
   ```
7. **Expected**: `401 Unauthorized` with message about invalid signature

### T139: CORS Configuration Test

1. Test preflight request from non-whitelisted origin:
   ```bash
   curl -X OPTIONS http://localhost:8000/api/tasks \
     -H "Origin: https://malicious-site.com" \
     -H "Access-Control-Request-Method: GET" \
     -v
   ```
2. **Expected**: Response should NOT include `Access-Control-Allow-Origin: https://malicious-site.com`
3. **Verify**: CORS only allows whitelisted origins (localhost:3000)

---

## Troubleshooting

### Database Connection Errors

If you see "password authentication failed":
1. Verify `DATABASE_URL` in `backend/.env` is correct
2. Check Neon PostgreSQL dashboard for connection string
3. Ensure password doesn't contain special characters that need URL encoding

### Port Already in Use

If backend port 8000 or frontend port 3000 is in use:
```bash
# Find and kill the process (Linux/Mac)
lsof -ti:8000 | xargs kill -9
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :8000
taskkill /PID {PID} /F
```

### JWT Token Issues

If tokens aren't working:
1. Verify `BETTER_AUTH_SECRET` is set and consistent
2. Check token expiration (default 7 days)
3. Clear localStorage in browser: `localStorage.clear()`

### CORS Errors in Browser

If seeing CORS errors:
1. Check `CORS_ORIGINS` in `backend/app/main.py`
2. Ensure frontend URL is in allowed origins
3. Restart backend after changing CORS settings

---

## Security Checklist

Before marking Phase 9 complete, verify:

- ☐ Users can only see their own tasks
- ☐ Cross-user API access returns 403 Forbidden
- ☐ Expired JWTs are rejected with 401
- ☐ Missing auth headers return 401
- ☐ Tampered JWTs are rejected
- ☐ CORS only allows whitelisted origins
- ☐ Deleted tasks return 404 for all users
- ☐ URL manipulation in frontend is prevented
- ☐ All security test results documented in `security-test-report.md`

---

## Next Steps

After completing Phase 9:
1. Review `security-test-report.md` and mark all tests
2. Fix any security issues discovered
3. Document findings and recommendations
4. Proceed to Phase 10: Deployment Prep

---

## Reference Documentation

- JWT Testing: https://jwt.io
- CORS: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
- FastAPI Security: https://fastapi.tiangolo.com/tutorial/security/
- Next.js Authentication: https://nextjs.org/docs/authentication
