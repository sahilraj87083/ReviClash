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
| 16 | POST | `/collections` | Create new collection |
| 17 | GET | `/collections` | Get user's collections |
| 18 | GET | `/collections/:collectionId` | Get specific collection |
| 19 | PATCH | `/collections/:collectionId` | Update collection details |
| 20 | DELETE | `/collections/:collectionId` | Delete collection |
| 21 | GET | `/collections/:collectionId/questions` | Get collection's questions |
| 22 | POST | `/collectionQuestions/:collectionId/questions` | Add question to collection |
| 23 | DELETE | `/collectionQuestions/:collectionId/questions/:questionId` | Remove question from collection |
| 24 | PATCH | `/collectionQuestions/:collectionId/questions/:questionId/order` | Reorder question in collection |
| 25 | POST | `/collectionQuestions/:collectionId/questions/bulk` | Bulk add questions |
| 26 | DELETE | `/collectionQuestions/:collectionId/questions/bulk` | Bulk remove questions |
| 27 | DELETE | `/collectionQuestions/:collectionId/questions` | Remove all questions |
| 28 | POST | `/contest` | Create new contest |
| 29 | GET | `/contest/:contestId` | Get contest details |
| 30 | POST | `/contest/:id/join` | Join contest |
| 31 | POST | `/contest/:contestId/submit` | Submit contest answers |
| 32 | GET | `/contest/:contestId/leaderboard` | Get contest leaderboard |
| 33 | GET | `/contest/:contestId/me` | Get my contest rank |
| 34 | POST | `/follow/:targetUserId` | Follow user |
| 35 | DELETE | `/follow/:targetUserId` | Unfollow user |
| 36 | GET | `/follow/followers/:userId` | Get user's followers |
| 37 | GET | `/follow/following/:userId` | Get users followed by user |
| 38 | GET | `/follow/status/:targetUserId` | Get follow status |
| 39 | GET | `/userStats/leaderboard` | Get global leaderboard |
| 40 | GET | `/userStats/:userId` | Get user statistics |
| 41 | GET | `/userStats/:userId/topics` | Get user topic performance |
| 42 | GET | `/userStats/:userId/history` | Get user contest history |
| 43 | GET | `/userStats/:userId/contests/created` | Get contests created by user |
| 44 | GET | `/userStats/:userId/contests/joined` | Get contests joined by user |

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

### POST /collections (Requires Auth)
```bash
curl -X POST http://localhost:5000/api/v1/collections \
  -H "Cookie: accessToken=<token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "DSA Problems",
    "description": "Essential data structures and algorithms",
    "isPublic": false
  }'
```

---

### GET /collections (Requires Auth)
```bash
curl -X GET http://localhost:5000/api/v1/collections \
  -H "Cookie: accessToken=<token>"
```

---

### GET /collections/:collectionId (Requires Auth)
```bash
curl -X GET http://localhost:5000/api/v1/collections/507f1f77bcf86cd799439012 \
  -H "Cookie: accessToken=<token>"
```

---

### PATCH /collections/:collectionId (Requires Auth)
```bash
curl -X PATCH http://localhost:5000/api/v1/collections/507f1f77bcf86cd799439012 \
  -H "Cookie: accessToken=<token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Advanced DSA",
    "isPublic": true
  }'
```

---

### POST /collectionQuestions/:collectionId/questions (Requires Auth)
```bash
curl -X POST http://localhost:5000/api/v1/collectionQuestions/507f1f77bcf86cd799439012/questions \
  -H "Cookie: accessToken=<token>" \
  -H "Content-Type: application/json" \
  -d '{
    "questionId": "507f1f77bcf86cd799439011"
  }'
```

---

### PATCH /collectionQuestions/:collectionId/questions/:questionId/order (Requires Auth)
```bash
curl -X PATCH http://localhost:5000/api/v1/collectionQuestions/507f1f77bcf86cd799439012/questions/507f1f77bcf86cd799439011/order \
  -H "Cookie: accessToken=<token>" \
  -H "Content-Type: application/json" \
  -d '{
    "order": 1
  }'
```

---

### POST /collectionQuestions/:collectionId/questions/bulk (Requires Auth)
```bash
curl -X POST http://localhost:5000/api/v1/collectionQuestions/507f1f77bcf86cd799439012/questions/bulk \
  -H "Cookie: accessToken=<token>" \
  -H "Content-Type: application/json" \
  -d '{
    "questionIds": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439013"]
  }'
```

---

### DELETE /collectionQuestions/:collectionId/questions/bulk (Requires Auth)
```bash
curl -X DELETE http://localhost:5000/api/v1/collectionQuestions/507f1f77bcf86cd799439012/questions/bulk \
  -H "Cookie: accessToken=<token>" \
  -H "Content-Type: application/json" \
  -d '{
    "questionIds": ["507f1f77bcf86cd799439011"]
  }'
```

---

### POST /contest (Requires Auth)
```bash
curl -X POST http://localhost:5000/api/v1/contest \
  -H "Cookie: accessToken=<token>" \
  -H "Content-Type: application/json" \
  -d '{
    "collectionId": "507f1f77bcf86cd799439012",
    "title": "Weekly Challenge",
    "durationInMin": 60,
    "questionCount": 5,
    "visibility": "public"
  }'
```

---

### GET /contest/:contestId (Requires Auth)
```bash
curl -X GET http://localhost:5000/api/v1/contest/ABC123 \
  -H "Cookie: accessToken=<token>"
```

---

### POST /contest/:id/join (Requires Auth)
```bash
curl -X POST http://localhost:5000/api/v1/contest/ABC123/join \
  -H "Cookie: accessToken=<token>"
```

---

### POST /contest/:contestId/submit (Requires Auth)
```bash
curl -X POST http://localhost:5000/api/v1/contest/507f1f77bcf86cd799439013/submit \
  -H "Cookie: accessToken=<token>" \
  -H "Content-Type: application/json" \
  -d '{
    "attempts": [
      {
        "questionId": "507f1f77bcf86cd799439011",
        "status": "solved",
        "timeSpent": 300
      }
    ]
  }'
```

---

### GET /contest/:contestId/leaderboard (Requires Auth)
```bash
curl -X GET http://localhost:5000/api/v1/contest/507f1f77bcf86cd799439013/leaderboard \
  -H "Cookie: accessToken=<token>"
```

---

### POST /follow/:targetUserId (Requires Auth)
```bash
curl -X POST http://localhost:5000/api/v1/follow/507f1f77bcf86cd799439014 \
  -H "Cookie: accessToken=<token>"
```

---

### GET /follow/followers/:userId (Requires Auth)
```bash
curl -X GET "http://localhost:5000/api/v1/follow/followers/507f1f77bcf86cd799439014?page=1&limit=20" \
  -H "Cookie: accessToken=<token>"
```

---

### GET /follow/status/:targetUserId (Requires Auth)
```bash
curl -X GET http://localhost:5000/api/v1/follow/status/507f1f77bcf86cd799439014 \
  -H "Cookie: accessToken=<token>"
```

---

### GET /userStats/leaderboard (Requires Auth)
```bash
curl -X GET "http://localhost:5000/api/v1/userStats/leaderboard?page=1&limit=20" \
  -H "Cookie: accessToken=<token>"
```

---

### GET /userStats/:userId (Requires Auth)
```bash
curl -X GET http://localhost:5000/api/v1/userStats/507f1f77bcf86cd799439014 \
  -H "Cookie: accessToken=<token>"
```

---

### GET /userStats/:userId/topics (Requires Auth)
```bash
curl -X GET http://localhost:5000/api/v1/userStats/507f1f77bcf86cd799439014/topics \
  -H "Cookie: accessToken=<token>"
```

---

### GET /userStats/:userId/history (Requires Auth)
```bash
curl -X GET "http://localhost:5000/api/v1/userStats/507f1f77bcf86cd799439014/history?page=1&limit=20" \
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

### Collection Name
- Min length: 2 characters
- Max length: 100 characters
- Must be unique per user (case-insensitive)
- Trimmed of whitespace
- Required field

### Collection Description
- Max length: 300 characters
- Optional field

### Collection isPublic
- Boolean value (true or false)
- Optional field (defaults to false)

### Collection Order
- Non-negative integer
- Used for custom ordering of questions in a collection
- Defaults to 0 when question is added

### Question IDs (for Bulk Operations)
- Array of valid MongoDB ObjectIds
- Non-empty array required
- All IDs should be valid question IDs

### Contest Title
- Min length: 3 characters
- Max length: 100 characters
- Trimmed of whitespace
- Required field

### Contest Duration
- Integer between 1-720 minutes
- Required field

### Contest Question Count
- Integer between 1-10
- Must not exceed available questions in collection
- Required field

### Contest Visibility
- Must be one of: "private", "shared", "public"
- Optional field (defaults to "private")

### Contest Attempts
- Array with at least 1 item
- Each attempt must have questionId, status, timeSpent
- questionId: Valid MongoDB ObjectId
- status: Must be "solved" or "unsolved"
- timeSpent: Non-negative integer (seconds)

### Follow Target User ID
- Must be valid MongoDB ObjectId
- Cannot follow yourself
- User must exist

### User Stats User ID
- Must be valid MongoDB ObjectId
- User must exist

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
✅ **Implemented & Tested** - Collection management (CRUD)  
✅ **Implemented & Tested** - Collection questions (add/remove/reorder)  
✅ **Implemented & Tested** - Contest management (create/join/submit)  
✅ **Implemented & Tested** - Contest leaderboard & ranking  
✅ **Implemented & Tested** - Follow system (follow/unfollow)  
✅ **Implemented & Tested** - User statistics & leaderboards  
❌ **Not Implemented** - Email verification  
❌ **Not Implemented** - Password reset  
❌ **Not Implemented** - Delete account  

---

## 📊 API Statistics

- **Total Endpoints:** 44
- **User Endpoints:** 10
- **Question Endpoints:** 5
- **Collection Endpoints:** 6
- **Collection Questions Endpoints:** 6
- **Contest Endpoints:** 6
- **Follow Endpoints:** 5
- **User Statistics Endpoints:** 6
- **Public Endpoints:** 4
- **Protected Endpoints:** 40
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
6. ✅ Add filtering & search functionality
7. ✅ Implement collection management
8. ✅ Handle token refresh
9. ✅ Build user profile pages

---

**Generated:** January 10, 2026  
**Status:** Production Ready (with recommended improvements)
