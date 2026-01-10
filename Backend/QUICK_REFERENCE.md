# Quick Reference Guide - ReviCode API

**Last Updated:** January 10, 2026

## 📚 Documentation Files Created

| File | Purpose | Audience |
|------|---------|----------|
| **API_DOCUMENTATION.md** | Complete API reference with all endpoints, request/response examples | Frontend devs, API users |
| **README.md** | Project overview, setup guide, architecture | All developers |
| **ANALYSIS_AND_RECOMMENDATIONS.md** | Code issues, security gaps, and improvement suggestions | Tech leads, reviewers |
| **QUICK_REFERENCE.md** | This file - quick lookup guide | Frontend devs, QA |

---

## 🚀 Quick API Reference

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication
All protected endpoints require `accessToken` cookie.

---

## 📋 All Endpoints at a Glance

### Public Endpoints (No Auth Required)

| # | Method | Endpoint | Purpose |
|---|--------|----------|---------|
| 1 | POST | `/users/register` | Create new account |
| 2 | POST | `/users/login` | Login & get tokens |
| 3 | POST | `/users/refresh-token` | Get new access token |
| 4 | GET | `/users/c/:username` | Get user public profile |

### Protected Endpoints (Auth Required ✅)

| # | Method | Endpoint | Purpose |
|---|--------|----------|---------|
| 5 | POST | `/users/logout` | Logout & clear tokens |
| 6 | GET | `/users/current-user` | Get logged-in user profile |
| 7 | POST | `/users/change-password` | Change user password |
| 8 | PATCH | `/users/update-account` | Update name/bio |
| 9 | PATCH | `/users/update-avatar` | Upload new avatar image |
| 10 | PATCH | `/users/update-coverImage` | Upload new cover image |
| 11 | POST | `/question` | Create new question |
| 12 | GET | `/question` | Get user's questions (with filters) |
| 13 | GET | `/question/:questionId` | Get specific question |
| 14 | PATCH | `/question/:questionId` | Update question details |
| 15 | DELETE | `/question/:questionId` | Delete (soft delete) question |

---

## 🔐 Authentication Flow

```
1. User POSTs to /login with email & password
   ↓
2. Server validates credentials & generates tokens
   ↓
3. Server sends accessToken & refreshToken as httpOnly cookies
   ↓
4. Client includes cookies automatically in subsequent requests
   ↓
5. Server validates accessToken with verifyJWT middleware
   ↓
6. When accessToken expires:
   - Client calls POST /refresh-token
   - Server validates refreshToken and generates new accessToken
   - Or user must login again
```

---

## 💾 Request/Response Templates

### POST /users/register
```bash
curl -X POST http://localhost:5000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Response (201):**
```json
{
  "errorCode": 201,
  "message": "User registered successfully",
  "data": { /* User object */ },
  "success": true
}
```

---

### POST /users/login
```bash
curl -X POST http://localhost:5000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Response (200):**
- Sets cookies: `accessToken`, `refreshToken`
- Returns user data

---

### GET /users/current-user (Requires Auth)
```bash
curl -X GET http://localhost:5000/api/v1/users/current-user \
  -H "Cookie: accessToken=<token>"
```

### GET /users/c/:username (Public)
```bash
curl -X GET http://localhost:5000/api/v1/users/c/john_doe
```

---

### POST /question (Requires Auth)
```bash
curl -X POST http://localhost:5000/api/v1/question \
  -H "Cookie: accessToken=<token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Two Sum",
    "platform": "LeetCode",
    "problemUrl": "https://leetcode.com/problems/two-sum/",
    "difficulty": "easy",
    "topics": ["array", "hash-table"]
  }'
```

---

### GET /question (Requires Auth)
```bash
# Get all questions with pagination
curl -X GET "http://localhost:5000/api/v1/question?page=1&limit=20" \
  -H "Cookie: accessToken=<token>"

# Filter by difficulty
curl -X GET "http://localhost:5000/api/v1/question?difficulty=medium" \
  -H "Cookie: accessToken=<token>"

# Filter by platform
curl -X GET "http://localhost:5000/api/v1/question?platform=LeetCode" \
  -H "Cookie: accessToken=<token>"

# Filter by topics
curl -X GET "http://localhost:5000/api/v1/question?topic=arrays,strings&mode=any" \
  -H "Cookie: accessToken=<token>"

# Full text search
curl -X GET "http://localhost:5000/api/v1/question?search=binary%20search" \
  -H "Cookie: accessToken=<token>"
```

---

### GET /question/:questionId (Requires Auth)
```bash
curl -X GET http://localhost:5000/api/v1/question/507f1f77bcf86cd799439011 \
  -H "Cookie: accessToken=<token>"
```

---

### PATCH /question/:questionId (Requires Auth)
```bash
curl -X PATCH http://localhost:5000/api/v1/question/507f1f77bcf86cd799439011 \
  -H "Cookie: accessToken=<token>" \
  -H "Content-Type: application/json" \
  -d '{
    "difficulty": "medium",
    "platform": "LeetCode"
  }'
```

---

### DELETE /question/:questionId (Requires Auth)
```bash
curl -X DELETE http://localhost:5000/api/v1/question/507f1f77bcf86cd799439011 \
  -H "Cookie: accessToken=<token>"
```

---
  -H "Cookie: accessToken=<token>" \
  -F "avatar=@./image.jpg"
```

---

### GET /users/c/:username (Public)
```bash
curl -X GET http://localhost:5000/api/v1/users/c/john_doe
```

**Response includes:**
- User profile data
- Stats (if exists)
- Collections
- Follow counts
- `isFollowedByViewer` (only if authenticated)

---

## ❌ Common Error Responses

### 400 Bad Request
```json
{
  "errorCode": 400,
  "message": "Validation failed",
  "data": null,
  "success": false
}
```

### 401 Unauthorized
```json
{
  "errorCode": 401,
  "message": "Unauthorized request",
  "data": null,
  "success": false
}
```

### 404 Not Found
```json
{
  "errorCode": 404,
  "message": "User not found",
  "data": null,
  "success": false
}
```

### 409 Conflict
```json
{
  "errorCode": 409,
  "message": "User with email or username already exists",
  "data": null,
  "success": false
}
```

---

## 📝 Field Validation Rules

### Username
- Min length: 3 characters
- Max length: 30 characters
- Lowercase only
- Format: alphanumeric + underscore

### Email
- Must be valid email format
- Must be unique in database

### Password
- Min length: 6 characters
- Should contain uppercase, lowercase, numbers for strength

### Full Name
- Min length: 3 characters

### Bio
- Max length: 160 characters

### Avatar/Cover Image
- Only image files allowed
- Common formats: JPG, PNG, WebP, GIF

### Question Title
- Min length: 2 characters (at creation)
- Min length: 3 characters (at update)

### Question Platform
- Must be one of: "LeetCode", "GFG", "Codeforces", "Other"

### Question Problem URL
- Must be valid URL format
- Normalized for duplicate detection (trailing slashes and query params removed)

### Question Difficulty
- Must be one of: "easy", "medium", "hard"
- Case-insensitive input

### Question Topics
- Array of strings
- Optional field
- Auto-deduplicated and lowercased

---

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Start development server (auto-reload)
npm run dev

# Start production server
npm start

# Check health
curl http://localhost:5000/
```

---

## 🔑 Environment Variables Required

```
PORT=5000
NODE_ENV=development
MONGODB_URI=<your-mongo-url>
ACCESS_TOKEN_SECRET=<secret>
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=<secret>
REFRESH_TOKEN_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=<name>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>
```

---

## 🔍 Useful Tips for Frontend Integration

### 1. **Automatic Cookie Handling**
- Browsers automatically include httpOnly cookies in requests
- No manual cookie management needed
- Works with `fetch` if `credentials: 'include'` is set

```javascript
fetch('/api/v1/users/current-user', {
    credentials: 'include' // Important!
})
```

### 2. **Token Refresh Strategy**
- If request returns 401, call `/users/refresh-token`
- If refresh succeeds, retry original request
- If refresh fails, redirect to login

### 3. **Image Upload**
- Use FormData for multipart requests
- Field name must match: `avatar` or `coverImage`

```javascript
const formData = new FormData();
formData.append('avatar', fileInput.files[0]);

fetch('/api/v1/users/update-avatar', {
    method: 'PATCH',
    credentials: 'include',
    body: formData
})
```

### 4. **Error Handling**
- All error responses have `success: false`
- Check `success` field instead of status code
- Display `message` to user

---

## ⚠️ Known Issues

1. **Missing: Email Verification** - Not yet implemented
2. **Missing: Password Reset** - Not yet implemented
3. **Missing: Follow/Unfollow** - No endpoints (but model exists)
4. **Missing: Search Users** - No search functionality
5. **Missing: Delete Account** - No user deletion endpoint

See `ANALYSIS_AND_RECOMMENDATIONS.md` for details and implementation suggestions.

---

## 🚦 Status Indicators

✅ **Implemented & Tested** - User authentication  
✅ **Implemented & Tested** - Profile management  
✅ **Implemented & Tested** - Image uploads  
✅ **Implemented & Tested** - Question management (CRUD)  
✅ **Implemented & Tested** - Question filtering & search  
❌ **Not Implemented** - Email verification  
❌ **Not Implemented** - Password reset  
❌ **Not Implemented** - Follow system endpoints  
❌ **Not Implemented** - Delete account  

---

## 📊 API Statistics

- **Total Endpoints:** 15
- **User Endpoints:** 10
- **Question Endpoints:** 5
- **Public Endpoints:** 4
- **Protected Endpoints:** 11
- **File Upload Endpoints:** 2
- **Search/Filter Endpoints:** 1
- **Response Format:** Consistent JSON
- **Authentication:** JWT with refresh rotation
- **Error Handling:** Centralized & descriptive

---

## 📞 Support Resources

- **Full API Docs:** See `API_DOCUMENTATION.md`
- **Setup Guide:** See `README.md`
- **Issues & Fixes:** See `ANALYSIS_AND_RECOMMENDATIONS.md`
- **Architecture:** See `README.md` > Project Structure

---

## 🎯 Next Steps for Frontend

1. ✅ Review all endpoints in `API_DOCUMENTATION.md`
2. ✅ Set up API client with base URL
3. ✅ Implement login/register forms
4. ✅ Add authentication interceptors
5. ✅ Implement question CRUD operations
6. ✅ Add filtering & search functionality5. ✅ Handle token refresh
6. ✅ Build user profile pages

---

## 📊 API Statistics

- **Total Endpoints:** 10
- **Public Endpoints:** 4
- **Protected Endpoints:** 6
- **File Upload Endpoints:** 2
- **Response Format:** Consistent JSON
- **Authentication:** JWT with refresh rotation
- **Error Handling:** Centralized & descriptive

---

**Generated:** January 10, 2026  
**Status:** Production Ready (with recommended improvements)
