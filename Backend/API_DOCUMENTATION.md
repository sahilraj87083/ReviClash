# ReviCode Backend API Documentation

**Base URL:** `http://localhost:5000/api/v1`

**Last Updated:** February 4, 2026

---

## Table of Contents

1. [Authentication & User Management](#authentication--user-management)
2. [Question Management](#question-management)
3. [Collection Management](#collection-management)
4. [Collection Questions Management](#collection-questions-management)
5. [Contest Management](#contest-management)
6. [Contest Participants](#contest-participants)
7. [Contest Messages](#contest-messages)
8. [Private Messages](#private-messages)
9. [Follow System](#follow-system)
10. [User Statistics](#user-statistics)
11. [Health Check](#health-check)
12. [WebSocket Events (Socket.io)](#websocket-events-socketio)
13. [Error Responses](#error-responses)
14. [Response Format](#response-format)
15. [Database Models](#database-models)

---

## Authentication & User Management

### Base Path: `/users`

### 1. Register User

**Endpoint:** `POST /users/register`

**Authentication:** Not Required

**Description:** Create a new user account

**Request Body:**
```json
{
  "username": "string (3-30 chars, unique, lowercase)",
  "fullName": "string (min 3 chars)",
  "email": "string (valid email, unique)",
  "password": "string (min 6 chars)"
}
```

**Validation Rules:**
- All fields are required and cannot be empty
- Email must be valid format and unique
- Username must be 3-30 characters, unique, lowercase
- Password must be at least 6 characters
- Username can contain letters, numbers, dots, and underscores

**Response (201 Created):**
```json
{
  "errorCode": 201,
  "message": "User registered successfully",
  "data": {
    "_id": "ObjectId",
    "username": "string",
    "fullName": "string",
    "email": "string",
    "role": "student",
    "bio": null,
    "avatar": null,
    "coverImage": null,
    "followersCount": 0,
    "followingCount": 0,
    "isVerified": false,
    "emailVerified": false,
    "isActive": true,
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp"
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Validation failed | Invalid input format |
| 400 | All fields are required | Missing required fields |
| 409 | User with email or username already exists | Duplicate email/username |

---

### 2. Login User

**Endpoint:** `POST /users/login`

**Authentication:** Not Required

**Description:** Authenticate user and receive access/refresh tokens

**Request Body:**
```json
{
  "email": "string (valid email)",
  "password": "string (min 6 chars)"
}
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "User logged In Successfully",
  "data": {
    "user": {
      "_id": "ObjectId",
      "username": "string",
      "fullName": "string",
      "email": "string",
      "avatar": null,
      "followersCount": 0,
      "followingCount": 0
    },
    "accessToken": "jwt_token"
  },
  "success": true
}
```

**Cookies Set:**
- `accessToken` (httpOnly, secure)
- `refreshToken` (httpOnly, secure)

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Email is required | Missing email |
| 404 | User does not exist | User not found |
| 401 | Invalid user credentials | Wrong password |

---

### 3. Logout User

**Endpoint:** `POST /users/logout`

**Authentication:** Required ✅

**Description:** End user session and invalidate tokens

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "User logged out successfully",
  "data": {},
  "success": true
}
```

---

### 4. Refresh Access Token

**Endpoint:** `POST /users/refresh-token`

**Authentication:** Not Required (uses refresh token from cookie)

**Description:** Get a new access token using refresh token

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Access token refreshed successfully",
  "data": {
    "accessToken": "new_jwt_token"
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 401 | Refresh token expired | Token has expired |
| 401 | Unauthorized | Invalid/missing refresh token |

---

### 5. Get Current User

**Endpoint:** `GET /users/current-user`

**Authentication:** Required ✅

**Description:** Retrieve authenticated user's profile information

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "User fetched successfully",
  "data": {
    "_id": "ObjectId",
    "username": "john_doe",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "bio": "Bio text",
    "avatar": {
      "public_id": "cloud_id",
      "url": "https://..."
    },
    "coverImage": null,
    "followersCount": 10,
    "followingCount": 5,
    "isVerified": true,
    "emailVerified": true,
    "isActive": true
  },
  "success": true
}
```

---

### 6. Get User Profile

**Endpoint:** `GET /users/c/:username`

**Authentication:** Not Required

**Description:** Retrieve public profile of any user

**URL Parameters:**
```
username: string (3+ chars, required)
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "User fetched successfully",
  "data": {
    "_id": "ObjectId",
    "username": "john_doe",
    "fullName": "John Doe",
    "bio": "Bio text",
    "avatar": {
      "url": "https://..."
    },
    "followersCount": 10,
    "followingCount": 5,
    "isVerified": true
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 404 | User not found | User doesn't exist |

---

### 7. Change Password

**Endpoint:** `POST /users/change-password`

**Authentication:** Required ✅

**Description:** Change current user's password

**Request Body:**
```json
{
  "oldPassword": "string (min 6 chars)",
  "newPassword": "string (min 6 chars)",
  "confirmPassword": "string (must match newPassword)"
}
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Password changed successfully",
  "data": {},
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 401 | Incorrect password | Old password doesn't match |
| 400 | Passwords do not match | confirmPassword doesn't match newPassword |

---

### 8. Update Username

**Endpoint:** `PATCH /users/update-username`

**Authentication:** Required ✅

**Description:** Change user's username (unique constraint)

**Request Body:**
```json
{
  "newUsername": "string (3-30 chars, lowercase, alphanumeric + _ .)"
}
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Username updated successfully",
  "data": {
    "username": "new_username"
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 409 | Username is already taken | Username exists |
| 400 | Invalid username format | Contains invalid characters |

---

### 9. Update Account Details

**Endpoint:** `PATCH /users/update-account`

**Authentication:** Required ✅

**Description:** Update user profile information (fullName, bio)

**Request Body:**
```json
{
  "fullName": "string (3+ chars, optional)",
  "bio": "string (max 300 chars, optional)"
}
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Account details updated successfully",
  "data": {
    "_id": "ObjectId",
    "fullName": "John Doe Updated",
    "bio": "New bio text"
  },
  "success": true
}
```

---

### 10. Update Avatar

**Endpoint:** `PATCH /users/update-avatar`

**Authentication:** Required ✅

**Description:** Upload and set user avatar image

**Request Headers:**
```
Content-Type: multipart/form-data
```

**Form Data:**
```
avatar: File (image only, required)
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Avatar updated successfully",
  "data": {
    "avatar": {
      "public_id": "cloudinary_id",
      "url": "https://res.cloudinary.com/..."
    }
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | No file uploaded | Missing file |
| 400 | Invalid file type | Not an image |

---

### 11. Update Cover Image

**Endpoint:** `PATCH /users/update-coverImage`

**Authentication:** Required ✅

**Description:** Upload and set user cover image

**Request Headers:**
```
Content-Type: multipart/form-data
```

**Form Data:**
```
coverImage: File (image only, required)
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Cover image updated successfully",
  "data": {
    "coverImage": {
      "public_id": "cloudinary_id",
      "url": "https://res.cloudinary.com/..."
    }
  },
  "success": true
}
```

---

### 12. Verify Email

**Endpoint:** `GET /users/verify-email`

**Authentication:** Not Required

**Description:** Verify user's email using token from verification link

**Query Parameters:**
```
token: string (required) - Token sent in email verification link
```

**Example:**
```
GET /users/verify-email?token=abc123def456
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Email verified successfully",
  "data": {},
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Token invalid or expired | Invalid/expired token |
| 409 | Email already verified | Already verified |

---

### 13. Resend Verification Email

**Endpoint:** `POST /users/resend-verification`

**Authentication:** Required ✅

**Description:** Send a new email verification link

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Verification email resent",
  "data": {},
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Already verified | Email already verified |
| 404 | User not found | User doesn't exist |

---

### 14. Forgot Password

**Endpoint:** `POST /users/forgot-password`

**Authentication:** Not Required

**Description:** Initiate password reset process

**Request Body:**
```json
{
  "email": "string (valid email)"
}
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Reset link sent",
  "data": {},
  "success": true
}
```

**Note:** Response is the same regardless of whether email exists (anti-enumeration)

---

### 15. Reset Password

**Endpoint:** `POST /users/reset-password`

**Authentication:** Not Required

**Description:** Reset password using token from email link

**Request Body:**
```json
{
  "token": "string (from email link)",
  "password": "string (min 6 chars)"
}
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Password reset successful",
  "data": {},
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Token expired | Token has expired |
| 400 | Invalid token | Token is invalid |

---

## Question Management

### Base Path: `/question`

### 16. Upload Question

**Endpoint:** `POST /question`

**Authentication:** Required ✅

**Description:** Create a new competitive programming question entry

**Request Body:**
```json
{
  "title": "string (min 2 chars, required)",
  "platform": "string (required, enum)",
  "problemUrl": "string (valid URL, required)",
  "difficulty": "string (required, enum)",
  "topics": ["string"] (optional)
}
```

**Validation Rules:**
- title: Required, minimum 2 characters
- platform: Required, must be one of: "LeetCode", "GFG", "Codeforces", "Other"
- problemUrl: Required, must be valid URL
- difficulty: Required, must be one of: "easy", "medium", "hard"
- topics: Optional, array of strings

**Response (201 Created):**
```json
{
  "errorCode": 201,
  "message": "Question added successfully",
  "data": {
    "_id": "ObjectId",
    "ownerId": "ObjectId",
    "title": "Two Sum",
    "platform": "LeetCode",
    "problemUrlOriginal": "https://leetcode.com/problems/two-sum/",
    "problemUrlNormalized": "https://leetcode.com/problems/two-sum",
    "difficulty": "easy",
    "topics": ["array", "hash-table"],
    "isDeleted": false,
    "createdAt": "ISO 8601",
    "updatedAt": "ISO 8601"
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 409 | You have already added this question | Duplicate URL |
| 400 | Validation error | Invalid input |

---

### 17. Get All Questions

**Endpoint:** `GET /question`

**Authentication:** Required ✅

**Description:** Retrieve user's questions with filtering and pagination

**Query Parameters:**
```
difficulty: string (optional) - easy, medium, hard
platform: string (optional) - LeetCode, GFG, Codeforces, Other
topic: string (optional) - comma-separated topic list
mode: string (optional) - "any" (OR) or "all" (AND) for topic matching
page: number (optional, default: 1)
limit: number (optional, default: 20, max: 50)
```

**Example:**
```
GET /question?difficulty=medium&platform=LeetCode&page=1&limit=20
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Questions fetched",
  "data": {
    "total": 45,
    "page": 1,
    "pages": 3,
    "limit": 20,
    "questions": [
      {
        "_id": "ObjectId",
        "title": "Two Sum",
        "platform": "LeetCode",
        "difficulty": "easy",
        "topics": ["array"],
        "createdAt": "ISO 8601"
      }
    ]
  },
  "success": true
}
```

---

### 18. Get Question by ID

**Endpoint:** `GET /question/:questionId`

**Authentication:** Required ✅

**Description:** Retrieve a specific question by ID

**URL Parameters:**
```
questionId: string (MongoDB ObjectId)
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Question fetched",
  "data": {
    "_id": "ObjectId",
    "title": "Two Sum",
    "platform": "LeetCode",
    "difficulty": "easy",
    "topics": ["array"],
    "problemUrlOriginal": "https://...",
    "createdAt": "ISO 8601"
  },
  "success": true
}
```

---

### 19. Update Question

**Endpoint:** `PATCH /question/:questionId`

**Authentication:** Required ✅

**Description:** Update question details

**Request Body:**
```json
{
  "title": "string (min 2 chars, optional)",
  "difficulty": "string (enum, optional)",
  "platform": "string (enum, optional)"
}
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Question updated",
  "data": {
    "_id": "ObjectId",
    "title": "Updated Title",
    "difficulty": "medium",
    "platform": "LeetCode"
  },
  "success": true
}
```

---

### 20. Delete Question

**Endpoint:** `DELETE /question/:questionId`

**Authentication:** Required ✅

**Description:** Soft delete a question (marks as deleted)

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Question removed",
  "data": {},
  "success": true
}
```

---

## Collection Management

### Base Path: `/collections`

### 21. Create Collection

**Endpoint:** `POST /collections`

**Authentication:** Required ✅

**Description:** Create a new question collection

**Request Body:**
```json
{
  "name": "string (2-100 chars, required)",
  "description": "string (max 300 chars, optional)",
  "isPublic": "boolean (optional, default: false)"
}
```

**Response (201 Created):**
```json
{
  "errorCode": 201,
  "message": "Collection created",
  "data": {
    "_id": "ObjectId",
    "name": "DSA Problems",
    "description": "Data Structure and Algorithm problems",
    "isPublic": false,
    "questionsCount": 0,
    "createdAt": "ISO 8601"
  },
  "success": true
}
```

---

### 22. Get My Collections

**Endpoint:** `GET /collections`

**Authentication:** Required ✅

**Description:** Retrieve all collections owned by authenticated user

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Collections fetched",
  "data": [
    {
      "_id": "ObjectId",
      "name": "DSA Problems",
      "description": "...",
      "isPublic": false,
      "questionsCount": 10,
      "createdAt": "ISO 8601"
    }
  ],
  "success": true
}
```

---

### 23. Get Collection by ID

**Endpoint:** `GET /collections/:collectionId`

**Authentication:** Required ✅

**Description:** Retrieve a specific collection's details

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Collection fetched",
  "data": {
    "_id": "ObjectId",
    "name": "DSA Problems",
    "questionsCount": 10
  },
  "success": true
}
```

---

### 24. Update Collection

**Endpoint:** `PATCH /collections/:collectionId`

**Authentication:** Required ✅

**Description:** Update collection details

**Request Body:**
```json
{
  "name": "string (2-100 chars, optional)",
  "description": "string (max 300 chars, optional)",
  "isPublic": "boolean (optional)"
}
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Collection updated",
  "data": {
    "_id": "ObjectId",
    "name": "Updated Name",
    "isPublic": true
  },
  "success": true
}
```

---

### 25. Delete Collection

**Endpoint:** `DELETE /collections/:collectionId`

**Authentication:** Required ✅

**Description:** Delete a collection and all its question associations

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Collection deleted",
  "data": {},
  "success": true
}
```

---

### 26. Get Collection Questions

**Endpoint:** `GET /collections/:collectionId/questions`

**Authentication:** Required ✅

**Description:** Retrieve all questions in a collection with order

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Collection questions fetched",
  "data": {
    "collection": {
      "_id": "ObjectId",
      "name": "DSA Problems",
      "questionsCount": 5
    },
    "questions": [
      {
        "order": 0,
        "addedAt": "ISO 8601",
        "question": {
          "_id": "ObjectId",
          "title": "Two Sum",
          "platform": "LeetCode",
          "difficulty": "easy"
        }
      }
    ]
  },
  "success": true
}
```

---

### 27. Get Public Collection Questions

**Endpoint:** `GET /collections/:collectionId/questions/public`

**Authentication:** Not Required

**Description:** Retrieve questions from a public collection

**Response:** Same as above

---

## Collection Questions Management

### Base Path: `/collectionQuestions`

### 28. Add Question to Collection

**Endpoint:** `POST /collectionQuestions/:collectionId/questions`

**Authentication:** Required ✅

**Description:** Add a single question to a collection

**Request Body:**
```json
{
  "questionId": "string (ObjectId)"
}
```

**Response (201 Created):**
```json
{
  "errorCode": 201,
  "message": "Question added to collection",
  "data": null,
  "success": true
}
```

---

### 29. Bulk Add Questions to Collection

**Endpoint:** `POST /collectionQuestions/:collectionId/questions/bulk`

**Authentication:** Required ✅

**Description:** Add multiple questions in one request

**Request Body:**
```json
{
  "questionIds": ["ObjectId1", "ObjectId2", ...]
}
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Bulk add completed",
  "data": {
    "added": 3,
    "attempted": 5
  },
  "success": true
}
```

---

### 30. Reorder Question in Collection

**Endpoint:** `PATCH /collectionQuestions/:collectionId/questions/:questionId/order`

**Authentication:** Required ✅

**Description:** Change question's position in collection

**Request Body:**
```json
{
  "order": "number (non-negative integer)"
}
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Order updated",
  "data": {
    "order": 2
  },
  "success": true
}
```

---

### 31. Remove Question from Collection

**Endpoint:** `DELETE /collectionQuestions/:collectionId/questions/:questionId`

**Authentication:** Required ✅

**Description:** Remove a question from collection

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Question removed from collection",
  "data": null,
  "success": true
}
```

---

### 32. Bulk Remove Questions from Collection

**Endpoint:** `DELETE /collectionQuestions/:collectionId/questions/bulk`

**Authentication:** Required ✅

**Description:** Remove multiple questions from collection

**Request Body:**
```json
{
  "questionIds": ["ObjectId1", "ObjectId2", ...]
}
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Questions removed from collection",
  "data": {
    "removed": 3,
    "attempted": 5
  },
  "success": true
}
```

---

### 33. Remove All Questions from Collection

**Endpoint:** `DELETE /collectionQuestions/:collectionId/questions`

**Authentication:** Required ✅

**Description:** Clear all questions from a collection

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "All questions removed",
  "data": {
    "removed": 10
  },
  "success": true
}
```

---

## Contest Management

### Base Path: `/contests`

### 34. Create Contest

**Endpoint:** `POST /contests`

**Authentication:** Required ✅

**Description:** Create a new programming contest

**Request Body:**
```json
{
  "collectionId": "string (ObjectId, required)",
  "title": "string (3-100 chars, required)",
  "durationInMin": "number (1-720, required)",
  "questionCount": "number (1-10, required)",
  "visibility": "string (optional, enum: private|shared|public)"
}
```

**Response (201 Created):**
```json
{
  "errorCode": 201,
  "message": "Contest created successfully",
  "data": {
    "_id": "ObjectId",
    "title": "DSA Contest",
    "contestCode": "ABC123",
    "durationInMin": 60,
    "visibility": "private",
    "status": "upcoming",
    "owner": "ObjectId",
    "createdAt": "ISO 8601"
  },
  "success": true
}
```

---

### 35. Start Contest

**Endpoint:** `POST /contests/:contestId/start`

**Authentication:** Required ✅

**Description:** Start/activate a contest

**URL Parameters:**
```
contestId: string (MongoDB ObjectId)
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Contest started successfully",
  "data": {
    "status": "active",
    "startTime": "ISO 8601",
    "endTime": "ISO 8601"
  },
  "success": true
}
```

---

### 36. Get Active Contests

**Endpoint:** `GET /contests/active`

**Authentication:** Required ✅

**Description:** Retrieve currently active contests

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Active contests fetched",
  "data": [
    {
      "_id": "ObjectId",
      "title": "DSA Contest",
      "durationInMin": 60,
      "status": "active",
      "startTime": "ISO 8601",
      "endTime": "ISO 8601"
    }
  ],
  "success": true
}
```

---

### 37. Get Created Contests

**Endpoint:** `GET /contests/created`

**Authentication:** Required ✅

**Description:** Retrieve contests created by authenticated user

**Query Parameters:**
```
page: number (optional, default: 1)
limit: number (optional, default: 20, max: 100)
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Created contests fetched",
  "data": {
    "page": 1,
    "total": 5,
    "contests": [...]
  },
  "success": true
}
```

---

### 38. Get Joined Contests

**Endpoint:** `GET /contests/joined`

**Authentication:** Required ✅

**Description:** Retrieve contests joined by authenticated user

**Query Parameters:**
```
page: number (optional)
limit: number (optional)
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Joined contests fetched",
  "data": {
    "page": 1,
    "total": 10,
    "contests": [...]
  },
  "success": true
}
```

---

### 39. Get All Public/Shared Contests

**Endpoint:** `GET /contests/all`

**Authentication:** Required ✅

**Description:** Get all public and shared contests

**Query Parameters:**
```
page: number (optional)
limit: number (optional)
visibility: string (optional, enum: public|shared)
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "All contests fetched",
  "data": {
    "page": 1,
    "total": 50,
    "contests": [...]
  },
  "success": true
}
```

---

### 40. Get Contest by ID/Code

**Endpoint:** `GET /contests/:contestId`

**Authentication:** Required ✅

**Description:** Retrieve specific contest details

**URL Parameters:**
```
contestId: string (MongoDB ObjectId or contest code)
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Contest fetched successfully",
  "data": {
    "_id": "ObjectId",
    "title": "DSA Contest",
    "description": "...",
    "durationInMin": 60,
    "questionCount": 5,
    "visibility": "private",
    "status": "active",
    "contestCode": "ABC123",
    "owner": {
      "_id": "ObjectId",
      "username": "john_doe"
    },
    "participants": 5,
    "createdAt": "ISO 8601"
  },
  "success": true
}
```

---

### 41. Get Contest Leaderboard

**Endpoint:** `GET /contests/:contestId/leaderboard`

**Authentication:** Required ✅

**Description:** Retrieve contest leaderboard with rankings and scores

**URL Parameters:**
```
contestId: string (MongoDB ObjectId)
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Leaderboard fetched successfully",
  "data": [
    {
      "rank": 1,
      "userId": "ObjectId",
      "username": "user1",
      "score": 100,
      "timeSpent": 1200,
      "solved": 5
    },
    {
      "rank": 2,
      "userId": "ObjectId",
      "username": "user2",
      "score": 80,
      "timeSpent": 1800,
      "solved": 4
    }
  ],
  "success": true
}
```

---

## Contest Participants

### Base Path: `/contestParticipants`

### 42. Join Contest

**Endpoint:** `POST /contestParticipants/:identifier/join`

**Authentication:** Required ✅

**Description:** Join a contest using ObjectId or contest code

**URL Parameters:**
```
identifier: string (MongoDB ObjectId or contest code)
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Contest joined successfully",
  "data": {
    "contestId": "ObjectId",
    "participantId": "ObjectId",
    "joinedAt": "ISO 8601"
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 404 | Contest not found | Invalid contest ID/code |
| 409 | User already joined this contest | Already a participant |

---

### 43. Leave Contest

**Endpoint:** `DELETE /contestParticipants/:contestId/leave`

**Authentication:** Required ✅

**Description:** Leave/quit a contest

**URL Parameters:**
```
contestId: string (MongoDB ObjectId)
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Left contest successfully",
  "data": {},
  "success": true
}
```

---

### 44. Enter Live Contest

**Endpoint:** `POST /contestParticipants/:contestId/start`

**Authentication:** Required ✅

**Description:** Start the contest timer for a participant

**URL Parameters:**
```
contestId: string (MongoDB ObjectId)
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Contest started successfully",
  "data": {
    "startTime": "ISO 8601",
    "endTime": "ISO 8601",
    "durationInSeconds": 3600
  },
  "success": true
}
```

---

### 45. Get Live Timer

**Endpoint:** `GET /contestParticipants/:contestId/time`

**Authentication:** Required ✅

**Description:** Get remaining time for ongoing contest

**URL Parameters:**
```
contestId: string (MongoDB ObjectId)
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Timer fetched successfully",
  "data": {
    "remainingTime": 1800,
    "totalTime": 3600,
    "startTime": "ISO 8601",
    "endTime": "ISO 8601"
  },
  "success": true
}
```

---

### 46. Submit Contest

**Endpoint:** `POST /contestParticipants/:contestId/submit`

**Authentication:** Required ✅

**Description:** Submit contest answers and get final score

**Request Body:**
```json
{
  "attempts": [
    {
      "questionId": "ObjectId",
      "status": "solved|unsolved",
      "timeSpent": 120
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Contest submitted successfully",
  "data": {
    "score": 80,
    "totalQuestions": 5,
    "solved": 4,
    "unsolved": 1,
    "timeSpent": 3400,
    "rank": 5
  },
  "success": true
}
```

---

### 47. Get My Contest Rank

**Endpoint:** `GET /contestParticipants/:contestId/rank`

**Authentication:** Required ✅

**Description:** Get user's ranking in a contest

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Rank fetched successfully",
  "data": {
    "rank": 5,
    "score": 80,
    "totalParticipants": 50,
    "percentile": 90
  },
  "success": true
}
```

---

### 48. Get Participant State

**Endpoint:** `GET /contestParticipants/:contestId/state`

**Authentication:** Required ✅

**Description:** Get current participant state in a contest

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Participant state fetched",
  "data": {
    "status": "joined|completed",
    "joinedAt": "ISO 8601",
    "completedAt": null,
    "score": 0,
    "attemptedQuestions": 0
  },
  "success": true
}
```

---

### 49. Get Contest Participants

**Endpoint:** `GET /contestParticipants/:contestId/participants`

**Authentication:** Required ✅

**Description:** Get all participants in a contest

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Participants fetched",
  "data": [
    {
      "userId": "ObjectId",
      "username": "user1",
      "score": 100,
      "status": "completed",
      "joinedAt": "ISO 8601"
    }
  ],
  "success": true
}
```

---

## Contest Messages

### Base Path: `/contestMessages`

### 50. Get Contest Chat Messages

**Endpoint:** `GET /contestMessages/:contestId`

**Authentication:** Required ✅

**Description:** Retrieve chat messages from a contest

**URL Parameters:**
```
contestId: string (MongoDB ObjectId)
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Messages fetched successfully",
  "data": [
    {
      "_id": "ObjectId",
      "sender": {
        "_id": "ObjectId",
        "username": "user1",
        "avatar": "..."
      },
      "message": "How to solve question 2?",
      "createdAt": "ISO 8601"
    }
  ],
  "success": true
}
```

---

## Private Messages

### Base Path: `/privateMessages`

### 51. Get Inbox

**Endpoint:** `GET /privateMessages/inbox`

**Authentication:** Required ✅

**Description:** Retrieve all private message conversations (inbox)

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Inbox fetched successfully",
  "data": [
    {
      "_id": "ObjectId",
      "user": {
        "_id": "ObjectId",
        "username": "john_doe",
        "fullName": "John Doe",
        "avatar": "..."
      },
      "lastMessage": "Hey, how are you?",
      "unreadCount": 2,
      "lastMessageTime": "ISO 8601"
    }
  ],
  "success": true
}
```

---

### 52. Get Private Messages

**Endpoint:** `GET /privateMessages/inbox/:otherUserId`

**Authentication:** Required ✅

**Description:** Get chat messages with a specific user

**URL Parameters:**
```
otherUserId: string (MongoDB ObjectId)
```

**Query Parameters:**
```
page: number (optional, default: 1, for pagination)
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Messages fetched successfully",
  "data": [
    {
      "_id": "ObjectId",
      "senderId": {
        "_id": "ObjectId",
        "fullName": "John Doe"
      },
      "message": "Hey there!",
      "status": "read|unread",
      "createdAt": "ISO 8601"
    }
  ],
  "success": true
}
```

---

## Follow System

### Base Path: `/follow`

### 53. Follow User

**Endpoint:** `POST /follow/:targetUserId`

**Authentication:** Required ✅

**Description:** Follow another user

**URL Parameters:**
```
targetUserId: string (MongoDB ObjectId)
```

**Response (201 Created):**
```json
{
  "errorCode": 201,
  "message": "User followed successfully",
  "data": null,
  "success": true
}
```

---

### 54. Unfollow User

**Endpoint:** `DELETE /follow/:targetUserId`

**Authentication:** Required ✅

**Description:** Unfollow another user

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "User unfollowed successfully",
  "data": null,
  "success": true
}
```

---

### 55. Get Followers

**Endpoint:** `GET /follow/followers/:userId`

**Authentication:** Required ✅

**Description:** Get list of user's followers

**URL Parameters:**
```
userId: string (MongoDB ObjectId)
```

**Query Parameters:**
```
page: number (optional)
limit: number (optional, max: 50)
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Followers fetched successfully",
  "data": [
    {
      "_id": "ObjectId",
      "username": "follower1",
      "fullName": "Follower One",
      "avatar": "..."
    }
  ],
  "success": true
}
```

---

### 56. Get Following

**Endpoint:** `GET /follow/following/:userId`

**Authentication:** Required ✅

**Description:** Get list of users that user is following

**URL Parameters:**
```
userId: string (MongoDB ObjectId)
```

**Query Parameters:**
```
page: number (optional)
limit: number (optional, max: 50)
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Following fetched successfully",
  "data": [
    {
      "_id": "ObjectId",
      "username": "following1",
      "fullName": "Following One",
      "avatar": "..."
    }
  ],
  "success": true
}
```

---

### 57. Get Follow Status

**Endpoint:** `GET /follow/status/:targetUserId`

**Authentication:** Required ✅

**Description:** Check if authenticated user follows target user

**URL Parameters:**
```
targetUserId: string (MongoDB ObjectId)
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Follow status fetched",
  "data": {
    "isFollowing": true,
    "isFollowedBy": false
  },
  "success": true
}
```

---

## User Statistics

### Base Path: `/userStats`

### 58. Get User Stats

**Endpoint:** `GET /userStats/:userId`

**Authentication:** Required ✅

**Description:** Get user's statistics (solved problems, contests participated, etc.)

**URL Parameters:**
```
userId: string (MongoDB ObjectId)
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "User stats fetched successfully",
  "data": {
    "userId": "ObjectId",
    "totalQuestionsAdded": 50,
    "totalContestsParticipated": 10,
    "totalContestsWon": 2,
    "averageScore": 75.5,
    "easyCount": 20,
    "mediumCount": 20,
    "hardCount": 10,
    "leetcodeCount": 35,
    "gfgCount": 10,
    "codeforcesCount": 5
  },
  "success": true
}
```

---

### 59. Get User Topic Stats

**Endpoint:** `GET /userStats/:userId/topics`

**Authentication:** Required ✅

**Description:** Get topic-wise statistics for a user

**URL Parameters:**
```
userId: string (MongoDB ObjectId)
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "User topic stats fetched",
  "data": {
    "topicStats": [
      {
        "topic": "array",
        "count": 10,
        "percentage": 20
      },
      {
        "topic": "string",
        "count": 8,
        "percentage": 16
      }
    ]
  },
  "success": true
}
```

---

### 60. Get User Contest History

**Endpoint:** `GET /userStats/:userId/history`

**Authentication:** Required ✅

**Description:** Get user's past contest participations

**URL Parameters:**
```
userId: string (MongoDB ObjectId)
```

**Query Parameters:**
```
page: number (optional)
limit: number (optional, max: 50)
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Contest history fetched",
  "data": {
    "page": 1,
    "total": 10,
    "history": [
      {
        "contestId": "ObjectId",
        "title": "DSA Contest",
        "score": 80,
        "rank": 5,
        "participationDate": "ISO 8601"
      }
    ]
  },
  "success": true
}
```

---

### 61. Get Leaderboard

**Endpoint:** `GET /userStats/leaderboard`

**Authentication:** Required ✅

**Description:** Get global leaderboard of all users

**Query Parameters:**
```
page: number (optional, default: 1)
limit: number (optional, default: 50, max: 50)
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Leaderboard fetched successfully",
  "data": {
    "page": 1,
    "total": 500,
    "leaderboard": [
      {
        "rank": 1,
        "userId": "ObjectId",
        "username": "top_user",
        "fullName": "Top User",
        "score": 1000,
        "contestsWon": 5
      }
    ]
  },
  "success": true
}
```

---

## Health Check

### Base Path: `/health`

### 62. Health Check

**Endpoint:** `GET /health`

**Authentication:** Not Required

**Description:** Check if server is running and healthy

**Response (200 OK):**
```json
{
  "ok": true,
  "timestamp": "ISO 8601",
  "message": "Server is running"
}
```

---

## Error Responses

### Standard Error Response Format

```json
{
  "errorCode": "number",
  "message": "string",
  "data": null,
  "success": false
}
```

### Common HTTP Status Codes

| Status | Meaning | Example |
|--------|---------|---------|
| 200 | OK | Successful GET, PATCH, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Validation error, missing fields |
| 401 | Unauthorized | Missing/invalid token, not authenticated |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate entry, already exists |
| 500 | Server Error | Unexpected server error |

---

## Response Format

### Success Response Format

```json
{
  "errorCode": 200,
  "message": "Success message",
  "data": {
    // Response data object or array
  },
  "success": true
}
```

### Pagination Format

When pagination is included:
```json
{
  "page": 1,
  "total": 100,
  "limit": 20,
  "pages": 5,
  "data": [...]
}
```

---

## Database Models

### User Model

```javascript
{
  username: String (3-30 chars, unique, lowercase),
  fullName: String (3+ chars),
  email: String (unique, lowercase),
  password: String (hashed with bcrypt),
  role: String (enum: student|admin, default: student),
  avatar: { public_id, url },
  coverImage: { public_id, url },
  bio: String (max 300 chars),
  followersCount: Number (default: 0),
  followingCount: Number (default: 0),
  isVerified: Boolean (default: false),
  emailVerified: Boolean (default: false),
  emailVerificationToken: String (hashed, select: false),
  emailVerificationExpiry: Date,
  passwordResetToken: String (hashed, select: false),
  passwordResetExpiry: Date,
  isActive: Boolean (default: true),
  refreshToken: String (hashed, select: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Question Model

```javascript
{
  ownerId: ObjectId (ref: User),
  title: String (required),
  platform: String (enum: LeetCode|GFG|Codeforces|Other),
  problemUrlOriginal: String (required),
  problemUrlNormalized: String (required, unique per user),
  difficulty: String (enum: easy|medium|hard),
  topics: [String],
  isDeleted: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Collection Model

```javascript
{
  ownerId: ObjectId (ref: User),
  name: String (2-100 chars),
  nameLower: String (indexed for uniqueness),
  description: String (max 300 chars),
  isPublic: Boolean (default: false),
  questionsCount: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Contest Model

```javascript
{
  title: String (3-100 chars),
  owner: ObjectId (ref: User),
  collectionId: ObjectId (ref: Collection),
  questionIds: [ObjectId] (ref: Question),
  durationInMin: Number (1-720),
  visibility: String (enum: private|shared|public, default: private),
  contestCode: String (unique),
  status: String (enum: upcoming|active|completed),
  startTime: Date,
  endTime: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### ContestParticipant Model

```javascript
{
  contestId: ObjectId (ref: Contest),
  userId: ObjectId (ref: User),
  status: String (enum: joined|completed),
  joinedAt: Date,
  completedAt: Date,
  score: Number (default: 0),
  timeSpent: Number (seconds, default: 0),
  rank: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Follow Model

```javascript
{
  followerId: ObjectId (ref: User),
  followingId: ObjectId (ref: User),
  followedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### PrivateMessage Model

```javascript
{
  senderId: ObjectId (ref: User),
  receiverId: ObjectId (ref: User),
  message: String,
  status: String (enum: sent|read),
  conversationId: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Collection Question Model

```javascript
{
  collectionId: ObjectId (ref: Collection),
  questionId: ObjectId (ref: Question),
  order: Number (default: 0),
  addedAt: Date
}
```

### ContestMessage Model

```javascript
{
  contestId: ObjectId (ref: Contest),
  senderId: ObjectId (ref: User),
  message: String,
  createdAt: Date,
  updatedAt: Date
}
```

### UserStats Model

```javascript
{
  userId: ObjectId (ref: User, unique),
  totalQuestionsAdded: Number (default: 0),
  totalContestsParticipated: Number (default: 0),
  totalContestsWon: Number (default: 0),
  averageScore: Number (default: 0),
  topicsCount: Map<String, Number>,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Implementation Notes

### Security
- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens with 15-minute expiry
- Refresh tokens hashed in database
- httpOnly, secure cookies
- CORS enabled with credentials
- Input validation on all endpoints
- Rate limiting recommended

### Authentication Flow
1. User registers or logs in
2. Server generates access + refresh tokens
3. Access token sent in response, refresh token in httpOnly cookie
4. Client includes access token in Authorization header or uses cookie
5. On token expiry, use refresh endpoint to get new access token

### File Upload
- Images uploaded to Cloudinary
- Temp files cleaned up after upload
- Old files deleted when replaced
- Supported formats: JPG, PNG, GIF, WebP

### Pagination
- Default page: 1, limit: 20
- Max limit: 50 (varies by endpoint)
- Returns total count and page info
- Sort: creation date (newest first)

### Validation
- All inputs validated with express-validator
- Mongoose schema validation
- Custom validation for URLs, emails, etc.
- Consistent error messages

---

## Example Requests

### Register New User
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

### Login
```bash
curl -X POST http://localhost:5000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Create Collection
```bash
curl -X POST http://localhost:5000/api/v1/collections \
  -H "Cookie: accessToken=<token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "DSA Problems",
    "description": "Data Structures and Algorithms",
    "isPublic": false
  }'
```

### Add Question to Collection
```bash
curl -X POST http://localhost:5000/api/v1/collectionQuestions/<collectionId>/questions \
  -H "Cookie: accessToken=<token>" \
  -H "Content-Type: application/json" \
  -d '{
    "questionId": "<questionId>"
  }'
```

### Create Contest
```bash
curl -X POST http://localhost:5000/api/v1/contests \
  -H "Cookie: accessToken=<token>" \
  -H "Content-Type: application/json" \
  -d '{
    "collectionId": "<collectionId>",
    "title": "DSA Contest",
    "durationInMin": 60,
    "questionCount": 5,
    "visibility": "public"
  }'
```

### Join Contest
```bash
curl -X POST http://localhost:5000/api/v1/contestParticipants/<contestCode>/join \
  -H "Cookie: accessToken=<token>"
```

### Get Contest Leaderboard
```bash
curl -X GET http://localhost:5000/api/v1/contests/<contestId>/leaderboard \
  -H "Cookie: accessToken=<token>"
```

### Get User Stats
```bash
curl -X GET http://localhost:5000/api/v1/userStats/<userId> \
  -H "Cookie: accessToken=<token>"
```

### Get Global Leaderboard
```bash
curl -X GET "http://localhost:5000/api/v1/userStats/leaderboard?page=1&limit=50" \
  -H "Cookie: accessToken=<token>"
```

---

## WebSocket Events (Socket.io)

### Connection & Authentication

When connecting to the Socket.io server, the client must provide a JWT token via handshake:

```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: accessToken
  }
});
```

Upon successful connection:
- User is automatically added to personal room: `socket.userId` (for inbox updates)
- Socket context has access to `socket.userId` from JWT verification

### Contest Events (Multi-room Architecture)

#### Lobby Room (Pre-contest Presence)
Used to track participants before contest starts and display lobby status.

**Events:**
- `contest:lobby:join` - Join contest lobby
  - Emitted by: Client
  - Payload: `{ contestId }`
  - Effect: User joins `contest:{contestId}:lobby` room
  - Receives: Participant list updates for lobby

- `contest:lobby:leave` - Leave contest lobby
  - Emitted by: Client
  - Payload: `{ contestId }`
  - Effect: User leaves `contest:{contestId}:lobby` room

#### Live Contest Room (During Contest)
Tracks active participants during contest and sends timer updates.

**Events:**
- `contest:live:join` - Enter live contest
  - Emitted by: Client
  - Payload: `{ contestId }`
  - Effect: User joins `contest:{contestId}:live` room
  - Timer starts being broadcasted to this room

- `contest:live:leave` - Exit live contest
  - Emitted by: Client
  - Payload: `{ contestId }`
  - Effect: User leaves `contest:{contestId}:live` room

#### Shared Chat Room (Messages during Contest)
All contest chat messages shared with all participants.

**Events:**
- `contest:chat:join` - Join contest chat
  - Emitted by: Client
  - Payload: `{ contestId }`
  - Effect: User joins `contest:{contestId}:chat` room

- `contest:chat:leave` - Leave contest chat
  - Emitted by: Client
  - Payload: `{ contestId }`
  - Effect: User leaves `contest:{contestId}:chat` room

- `contest:message` - Send contest chat message
  - Emitted by: Client
  - Payload: `{ contestId, message, phase }`
  - phase: "lobby" or "live" (for filtering later)
  - Effect: Message saved to database with phase tag
  - Broadcast: Emits `contest:receive` to all in `contest:{contestId}:chat`

- `contest:receive` - Receive contest chat message
  - Emitted by: Server
  - Payload: Message object with senderId, message, createdAt, phase
  - Recipients: All users in `contest:{contestId}:chat` room
  - Contains: User info, message content, timestamp, phase

- `contest:system` - Send system message (host only)
  - Emitted by: Client
  - Payload: `{ contestId, message, phase }`
  - Effect: System message saved to database
  - Broadcast: Emits `contest:receive` with system message to all

### Private Messaging Events (User-specific Rooms)

#### Connection & Personal Room
Upon connection, user automatically joins personal room for inbox notifications:
```
User joins: {socket.userId}
Purpose: Real-time inbox updates without opening chat
```

#### Chat Room Management
- `private:join` - Join 1-on-1 chat room
  - Emitted by: Client
  - Payload: `{ otherUserId }`
  - Effect: User joins conversation room `conv_{user1}_{user2}`
  - Room format: Computed using `getPrivateRoom(userId1, userId2)` utility

- `private:leave` - Leave 1-on-1 chat room
  - Emitted by: Client
  - Payload: `{ otherUserId }`
  - Effect: User leaves conversation room

#### Message Events
- `private:send` - Send private message
  - Emitted by: Client
  - Payload: `{ to, message }`
  - to: Recipient's user ID
  - message: Message text (trimmed)
  - Effects:
    1. Message saved to database
    2. Emits `private:delivered` to sender (delivery confirmation)
    3. Emits `private:receive` to conversation room (appears in chat window)
    4. Emits `inbox:update` to both users' personal rooms (sidebar updates)

- `private:receive` - Receive private message
  - Emitted by: Server
  - Payload: Message object with senderId, receiverId, message, status, createdAt
  - Recipients: Users in the conversation room
  - Used for: Displaying message in active chat window

- `private:delivered` - Message delivery confirmation
  - Emitted by: Server
  - Payload: `messageId`
  - Recipients: Sender (socket.emit)
  - Used for: Confirming message was saved before broadcast

- `private:typing` - User is typing
  - Emitted by: Client
  - Payload: `{ to }`
  - Effect: Broadcasts typing indicator to other user in conversation room
  - Recipients: Other user in `conv_{user1}_{user2}` room
  - Emitted by server: `private:typing` with `{ userId }`

- `private:seen` - Message marked as read
  - Emitted by: Client
  - Payload: `{ messageIds, otherUserId }`
  - messageIds: Array of message IDs to mark as read
  - Effect: Updates message status in database to "read"
  - Broadcast: Emits `private:seen` to other user with messageIds

#### Real-time Inbox Updates (Key Feature)
**Event:** `inbox:update`
- Emitted by: Server (when message is sent)
- Payload:
  ```json
  {
    "senderId": "user123",
    "receiverId": "user456",
    "message": "Latest message text",
    "createdAt": "2026-02-04T10:30:00Z",
    "sender": { /* User object */ }
  }
  ```
- Recipients: Both users' personal rooms (`senderId` room and `receiverId` room)
- Effect: Updates inbox/sidebar in real-time for both participants without opening chat
- Use case: Sidebar shows unread count and preview of last message immediately

### Socket Room Architecture

#### Contest Room Pattern
```
Contest ID: "507f1f77bcf86cd799439013"
├── contest:507f1f77bcf86cd799439013:lobby    (Pre-contest, participants list)
├── contest:507f1f77bcf86cd799439013:live     (Active, timer updates)
└── contest:507f1f77bcf86cd799439013:chat     (Chat messages for all)
```

#### Private Message Room Pattern
```
User ID: "507f1f77bcf86cd799439011"
├── 507f1f77bcf86cd799439011                  (Personal room, inbox updates)
└── conv_507f1f77bcf86cd799439011_507f1f77bcf86cd799439012 
                                              (Conversation room, 1-on-1 chat)
```

### Message Flow Example: Contest Chat

```
1. Users join contest lobby
   - Emit: contest:lobby:join with contestId
   - Result: Join contest:contestId:lobby room

2. Contest starts
   - Emit: contest:live:join with contestId
   - Result: Join contest:contestId:live room
   - Server broadcasts timer to live room

3. Users join chat
   - Emit: contest:chat:join with contestId
   - Result: Join contest:contestId:chat room

4. User sends message
   - Emit: contest:message with { contestId, message, phase: "live" }
   - Server:
     - Saves to ContestMessage collection with phase
     - Emits contest:receive to contest:contestId:chat room
   - Result: All chat participants see message immediately

5. Contest ends
   - Server emits system message via contest:system
   - Results in contest:receive to all in chat room
```

### Message Flow Example: Private Chat

```
1. User A opens sidebar
   - Automatically in room: A (personal room)
   - Receives inbox:update events for all conversations
   - Sidebar shows all conversations with latest message

2. User A opens chat with User B
   - Emit: private:join with { otherUserId: B }
   - Result: Join conv_A_B room

3. User A sends message
   - Emit: private:send with { to: B, message: "Hello" }
   - Server:
     - Saves to PrivateMessage collection
     - Emits private:delivered to User A (confirmation)
     - Emits private:receive to conv_A_B room (appears in chat)
     - Emits inbox:update to room A and room B (sidebar updates)
   - Result: 
     - User A: Message appears in chat, sidebar updates
     - User B: Sidebar updates with new message, if chat open → message appears

4. User B reads message
   - Emit: private:seen with { messageIds: [...], otherUserId: A }
   - Server:
     - Updates message status to "read" in database
     - Emits private:seen to User A with messageIds
   - Result: User A sees read status indicator

5. User B types
   - Emit: private:typing with { to: A }
   - Server: Emits private:typing to User A in conv_A_B room
   - Result: User A sees "typing..." indicator
```

### Socket Error Handling

If authentication fails during connection:
- Connection is rejected
- Client receives error: "Unauthorized"
- Frontend should redirect to login

If socket receives invalid data:
- Event is silently ignored (validated on server)
- Client should validate data before emitting

### Real-time Features Benefits

1. **Inbox Synchronization:** Both users see updated sidebar immediately when message arrives
2. **Presence Awareness:** Know who's in lobby, live, or chat room
3. **Phase-aware Messaging:** Can filter messages by contest phase (lobby vs live)
4. **Delivery Confirmation:** Know when message reached server
5. **Typing Indicators:** See when other user is typing
6. **Read Receipts:** Know when message is read

---

**Last Updated:** February 4, 2026  
**API Version:** v1  
**Maintained By:** Sahil Singh
