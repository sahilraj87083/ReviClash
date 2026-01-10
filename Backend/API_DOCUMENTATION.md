# ReviCode Backend API Documentation

**Base URL:** `http://localhost:5000/api/v1`

**Last Updated:** January 10, 2026

---

## Table of Contents

1. [Authentication & User Management](#authentication--user-management)
2. [Question Management](#question-management)
3. [Error Responses](#error-responses)
4. [Response Format](#response-format)
5. [User Model Schema](#user-model-schema)
6. [Question Model Schema](#question-model-schema)

---

## Authentication & User Management

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
- Email must be valid format
- Username must be 3-30 characters
- Password must be at least 6 characters
- Email and username must be unique

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
    "role": "student | admin",
    "bio": "string | null",
    "avatar": {
      "public_id": "string | null",
      "url": "string | null"
    },
    "coverImage": {
      "public_id": "string | null",
      "url": "string | null"
    },
    "followersCount": 0,
    "followingCount": 0,
    "isVerified": false,
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
| 500 | Something went wrong while registering the user | Server error |

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

**Validation Rules:**
- Email must be valid format
- Password must be at least 6 characters

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
      "role": "student | admin",
      "avatar": {
        "public_id": "string | null",
        "url": "string | null"
      },
      "coverImage": {
        "public_id": "string | null",
        "url": "string | null"
      },
      "bio": "string | null",
      "followersCount": "number",
      "followingCount": "number",
      "isVerified": "boolean",
      "isActive": "boolean",
      "createdAt": "ISO 8601 timestamp",
      "updatedAt": "ISO 8601 timestamp"
    }
  },
  "success": true
}
```

**Cookies Set:**
- `accessToken` (httpOnly, secure) - JWT token for API requests
- `refreshToken` (httpOnly, secure) - JWT token for token refresh

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Validation failed | Invalid input format |
| 400 | Email is required | Missing email |
| 404 | User does not exist | Email not found in database |
| 401 | Invalid user credentials | Wrong password |

---

### 3. Logout User

**Endpoint:** `POST /users/logout`

**Authentication:** Required ✅

**Description:** Invalidate user session and clear tokens

**Request Headers:**
```
Cookie: accessToken=<token>
```

**Request Body:** None

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "User logged Out",
  "data": {},
  "success": true
}
```

**Cookies Cleared:**
- `accessToken`
- `refreshToken`

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 401 | Unauthorized request | Missing/invalid access token |

---

### 4. Refresh Access Token

**Endpoint:** `POST /users/refresh-token`

**Authentication:** Not Required (uses refresh cookie)

**Description:** Get a new access token using refresh token

**Request Headers:**
```
Cookie: refreshToken=<token>
```

**Request Body:** None

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Access token refreshed",
  "data": null,
  "success": true
}
```

**Cookies Set:**
- `accessToken` (new JWT token)
- `refreshToken` (new JWT token)

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 401 | unauthorized request | Missing refresh token |
| 401 | Invalid refresh token | Token validation failed |
| 401 | Refresh token revoked | Token not found in database |

**Note:** Both old cookies are cleared on error

---

### 5. Get Current User

**Endpoint:** `GET /users/current-user`

**Authentication:** Required ✅

**Description:** Retrieve currently authenticated user's profile

**Request Headers:**
```
Cookie: accessToken=<token>
```

**Request Body:** None

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "User fetched successfully",
  "data": {
    "_id": "ObjectId",
    "username": "string",
    "fullName": "string",
    "email": "string",
    "role": "student | admin",
    "avatar": {
      "public_id": "string | null",
      "url": "string | null"
    },
    "coverImage": {
      "public_id": "string | null",
      "url": "string | null"
    },
    "bio": "string | null",
    "followersCount": "number",
    "followingCount": "number",
    "isVerified": "boolean",
    "isActive": "boolean",
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp"
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 401 | Unauthorized | Missing/invalid access token |

---

### 6. Change Current Password

**Endpoint:** `POST /users/change-password`

**Authentication:** Required ✅

**Description:** Change authenticated user's password

**Request Headers:**
```
Cookie: accessToken=<token>
```

**Request Body:**
```json
{
  "oldPassword": "string (must match current password)",
  "newPassword": "string (min 6 chars, different from old)",
  "confirmPassword": "string (must match newPassword)"
}
```

**Validation Rules:**
- Old password must match current password
- New password cannot be same as old password
- New password and confirm password must match

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Password changed successfully. Please login again.",
  "data": {},
  "success": true
}
```

**Cookies Cleared:**
- `accessToken`
- `refreshToken`

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | New password must be different from old password | Same password provided |
| 400 | New password and Confirm Password mismatch | Passwords don't match |
| 401 | Invalid old password | Old password verification failed |
| 404 | User not found | User deleted or invalid token |
| 401 | Unauthorized | Missing/invalid access token |

**Note:** User must login again after changing password

---

### 7. Update Account Details

**Endpoint:** `PATCH /users/update-account`

**Authentication:** Required ✅

**Description:** Update user's full name and/or bio

**Request Headers:**
```
Cookie: accessToken=<token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "fullName": "string (optional, min 3 chars)",
  "bio": "string (optional, max 160 chars)"
}
```

**Validation Rules:**
- At least one field (fullName or bio) is required
- Full name must be minimum 3 characters
- Bio must be maximum 160 characters

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Account details updated successfully",
  "data": {
    "_id": "ObjectId",
    "username": "string",
    "fullName": "string",
    "email": "string",
    "role": "student | admin",
    "avatar": {
      "public_id": "string | null",
      "url": "string | null"
    },
    "coverImage": {
      "public_id": "string | null",
      "url": "string | null"
    },
    "bio": "string",
    "followersCount": "number",
    "followingCount": "number",
    "isVerified": "boolean",
    "isActive": "boolean",
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp"
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | At least one field is required | Both fields are empty/missing |
| 404 | User not found | Invalid user ID in token |
| 401 | Unauthorized | Missing/invalid access token |

---

### 8. Update User Avatar

**Endpoint:** `PATCH /users/update-avatar`

**Authentication:** Required ✅

**Description:** Upload and update user's avatar image

**Request Headers:**
```
Cookie: accessToken=<token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
avatar: File (image only, multipart/form-data)
```

**File Requirements:**
- Must be an image file (image/jpeg, image/png, image/webp, etc.)
- Uploaded via multipart/form-data
- Field name must be "avatar"

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Avatar image updated successfully",
  "data": {
    "_id": "ObjectId",
    "username": "string",
    "fullName": "string",
    "email": "string",
    "role": "student | admin",
    "avatar": {
      "public_id": "string (Cloudinary ID)",
      "url": "string (Cloudinary secure URL)"
    },
    "coverImage": {
      "public_id": "string | null",
      "url": "string | null"
    },
    "bio": "string | null",
    "followersCount": "number",
    "followingCount": "number",
    "isVerified": "boolean",
    "isActive": "boolean",
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp"
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Avatar file is missing | No file uploaded |
| 400 | Only image files are allowed | Non-image file uploaded |
| 400 | Error while uploading avatar on Cloudinary | Cloudinary upload failed |
| 500 | Error updating avatar in database | Database update failed |
| 404 | User not found | Invalid user ID in token |
| 401 | Unauthorized | Missing/invalid access token |

**Flow:**
1. Multer saves file temporarily
2. File uploaded to Cloudinary
3. Database updated with new avatar
4. Old avatar deleted from Cloudinary
5. Temporary local file deleted

---

### 9. Update User Cover Image

**Endpoint:** `PATCH /users/update-coverImage`

**Authentication:** Required ✅

**Description:** Upload and update user's cover image

**Request Headers:**
```
Cookie: accessToken=<token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
coverImage: File (image only, multipart/form-data)
```

**File Requirements:**
- Must be an image file (image/jpeg, image/png, image/webp, etc.)
- Uploaded via multipart/form-data
- Field name must be "coverImage"

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "CoverImage image updated successfully",
  "data": {
    "_id": "ObjectId",
    "username": "string",
    "fullName": "string",
    "email": "string",
    "role": "student | admin",
    "avatar": {
      "public_id": "string | null",
      "url": "string | null"
    },
    "coverImage": {
      "public_id": "string (Cloudinary ID)",
      "url": "string (Cloudinary secure URL)"
    },
    "bio": "string | null",
    "followersCount": "number",
    "followingCount": "number",
    "isVerified": "boolean",
    "isActive": "boolean",
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp"
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | CoverImage file is missing | No file uploaded |
| 400 | Only image files are allowed | Non-image file uploaded |
| 400 | Error while uploading CoverImage on Cloudinary | Cloudinary upload failed |
| 500 | Error updating coverImage in database | Database update failed |
| 404 | User not found | Invalid user ID in token |
| 401 | Unauthorized | Missing/invalid access token |

**Note:** Same flow as avatar update with rollback on failure

---

### 10. Get User Profile

**Endpoint:** `GET /users/c/:username`

**Authentication:** Not Required (can fetch public profiles)

**Description:** Retrieve a user's public profile with stats and relationships

**URL Parameters:**
```
username: string (required, user's username)
```

**Request Headers:**
```
Cookie: accessToken=<token> (optional - for "isFollowedByViewer" field)
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "User profile fetched successfully",
  "data": {
    "_id": "ObjectId",
    "username": "string",
    "fullName": "string",
    "email": "string",
    "role": "student | admin",
    "avatar": {
      "public_id": "string | null",
      "url": "string | null"
    },
    "coverImage": {
      "public_id": "string | null",
      "url": "string | null"
    },
    "bio": "string | null",
    "followersCount": "number (calculated from aggregation)",
    "followingCount": "number (calculated from aggregation)",
    "isVerified": "boolean",
    "isActive": "boolean",
    "isFollowedByViewer": "boolean (only if authenticated)",
    "stats": {
      "_id": "ObjectId",
      "userId": "ObjectId",
      "totalQuestionsAttempted": "number",
      "questionsCorrect": "number",
      "questionsSolved": "number",
      "totalContestsParticipated": "number",
      // ... other stat fields
    },
    "collections": [
      {
        "_id": "ObjectId",
        "title": "string",
        "description": "string",
        // ... collection fields
      }
    ],
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp"
  },
  "success": true
}
```

**Fields Excluded (for privacy):**
- `password`
- `refreshToken`

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Username is required | Username not provided or invalid |
| 404 | User not found | Username doesn't exist or user is inactive |

**Notes:**
- Shows only active users (isActive: true)
- Includes aggregated follower/following counts
- Includes user stats and collections if they exist
- If authenticated, includes whether viewer follows this user
- This endpoint is public and doesn't require authentication

---

## Error Responses

### Standard Error Response Format:
```json
{
  "errorCode": "HTTP status code",
  "message": "Error message",
  "data": null,
  "success": false
}
```

### Common HTTP Status Codes:

| Code | Meaning |
|------|---------|
| 400 | Bad Request - Invalid input or validation failed |
| 401 | Unauthorized - Missing or invalid authentication token |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists (duplicate) |
| 500 | Internal Server Error - Server error |

---

## Response Format

All successful responses follow this structure:

```json
{
  "errorCode": "HTTP status code",
  "message": "Descriptive success message",
  "data": "Response data or null",
  "success": true
}
```

### Status Code Mapping:
- `errorCode < 400` → `success: true`
- `errorCode >= 400` → `success: false`

---

## User Model Schema

```javascript
{
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  
  fullName: {
    type: String,
    required: true,
    minlength: 3
  },
  
  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student"
  },
  
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    minlength: 5,
    trim: true
  },
  
  password: {
    type: String,
    required: true,
    select: false // Not returned by default
  },
  
  avatar: {
    public_id: String,      // Cloudinary public ID
    url: String            // Cloudinary secure URL
  },
  
  coverImage: {
    public_id: String,      // Cloudinary public ID
    url: String            // Cloudinary secure URL
  },
  
  bio: {
    type: String,
    maxlength: 160
  },
  
  followersCount: {
    type: Number,
    default: 0
  },
  
  followingCount: {
    type: Number,
    default: 0
  },
  
  isVerified: {
    type: Boolean,
    default: false
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  refreshToken: {
    type: String,
    select: false // Not returned by default
  },
  
  timestamps: {
    createdAt: "ISO 8601",
    updatedAt: "ISO 8601"
  }
}
```

---

## Authentication Details

### JWT Token Structure:

**Access Token Payload:**
```json
{
  "_id": "User ObjectId",
  "role": "student | admin",
  "iat": "issued at timestamp",
  "exp": "expiration timestamp"
}
```

**Refresh Token Payload:**
```json
{
  "_id": "User ObjectId",
  "iat": "issued at timestamp",
  "exp": "expiration timestamp"
}
```

### Token Storage:
- **Access Token:** httpOnly cookie (name: `accessToken`)
- **Refresh Token:** httpOnly, secure cookie (name: `refreshToken`)
- Refresh token is hashed and stored in database for validation

### Middleware:
- `verifyJWT` - Validates access token and attaches user info to `req.user`
- `upload.single('avatar/coverImage')` - Handles file upload via Multer

---

## Question Management

### 11. Upload Question

**Endpoint:** `POST /question`

**Authentication:** Required ✅

**Description:** Create a new competitive programming question entry

**Request Headers:**
```
Cookie: accessToken=<token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "string (min 2 chars, required)",
  "platform": "string (required, enum)",
  "problemUrl": "string (valid URL, required)",
  "difficulty": "string (required, enum)",
  "topics": "array[string] (optional)"
}
```

**Validation Rules:**
- title: Required, minimum 2 characters
- platform: Required, must be one of: "LeetCode", "GFG", "Codeforces", "Other"
- problemUrl: Required, must be valid URL
- difficulty: Required, must be one of: "easy", "medium", "hard"
- topics: Optional, must be array of strings if provided

**Response (201 Created):**
```json
{
  "errorCode": 201,
  "message": "Question added successfully",
  "data": {
    "_id": "ObjectId",
    "ownerId": "ObjectId (current user)",
    "title": "string",
    "platform": "LeetCode | GFG | Codeforces | Other",
    "problemUrlOriginal": "string (original URL)",
    "problemUrlNormalized": "string (normalized for duplicate detection)",
    "difficulty": "easy | medium | hard",
    "topics": ["string"],
    "isDeleted": false,
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp"
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | All required fields must be provided | Missing required fields |
| 400 | Validation error | Invalid input format |
| 409 | You have already added this question | Duplicate problem URL |
| 401 | Unauthorized | Missing/invalid access token |

**Notes:**
- Problem URLs are normalized for duplicate detection (case-insensitive, trailing slashes removed, query params stripped)
- Topics are automatically deduplicated and lowercased
- Each user can only add each problem URL once

---

### 12. Get All Questions

**Endpoint:** `GET /question`

**Authentication:** Required ✅

**Description:** Retrieve user's questions with filtering, sorting, and pagination

**Request Headers:**
```
Cookie: accessToken=<token>
```

**Query Parameters:**
```
difficulty=string (optional)    - Filter by: easy, medium, hard
platform=string (optional)      - Filter by: LeetCode, GFG, Codeforces, Other
topic=string (optional)         - Filter by topics (comma-separated)
mode=string (optional)          - Topic matching mode: "any" (OR) or "all" (AND)
search=string (optional)        - Full text search in title, topics, platform
page=number (optional)          - Page number (default: 1, min: 1)
limit=number (optional)         - Items per page (default: 20, max: 50)
```

**Example Request:**
```
GET /question?difficulty=medium&platform=LeetCode&page=1&limit=20
GET /question?topic=arrays,strings&mode=any
GET /question?search=two pointer&limit=10
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
        "ownerId": "ObjectId",
        "title": "string",
        "platform": "LeetCode | GFG | Codeforces | Other",
        "problemUrlOriginal": "string",
        "problemUrlNormalized": "string",
        "difficulty": "easy | medium | hard",
        "topics": ["string"],
        "isDeleted": false,
        "createdAt": "ISO 8601 timestamp",
        "updatedAt": "ISO 8601 timestamp"
      }
      // ... more questions
    ]
  },
  "success": true
}
```

**Filtering Examples:**

1. **By Difficulty:**
   ```
   GET /question?difficulty=hard
   ```

2. **By Platform:**
   ```
   GET /question?platform=LeetCode
   ```

3. **By Topics (Match Any):**
   ```
   GET /question?topic=arrays,strings&mode=any
   ```

4. **By Topics (Match All):**
   ```
   GET /question?topic=arrays,sorting&mode=all
   ```

5. **Full Text Search:**
   ```
   GET /question?search=binary search
   ```

6. **Combined Filters:**
   ```
   GET /question?difficulty=medium&platform=LeetCode&topic=arrays&page=1&limit=10
   ```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Validation error | Invalid query parameters |
| 401 | Unauthorized | Missing/invalid access token |

**Notes:**
- Returns only non-deleted questions (isDeleted: false)
- Results sorted by creation date (newest first)
- Full text search indexes title, topics, and platform
- Topic filter is case-insensitive
- Pagination default: page=1, limit=20; max limit=50

---

### 13. Get Question by ID

**Endpoint:** `GET /question/:questionId`

**Authentication:** Required ✅

**Description:** Retrieve a specific question by ID

**Request Headers:**
```
Cookie: accessToken=<token>
```

**URL Parameters:**
```
questionId: string (MongoDB ObjectId, required)
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Question fetched",
  "data": {
    "_id": "ObjectId",
    "ownerId": "ObjectId",
    "title": "string",
    "platform": "LeetCode | GFG | Codeforces | Other",
    "problemUrlOriginal": "string",
    "problemUrlNormalized": "string",
    "difficulty": "easy | medium | hard",
    "topics": ["string"],
    "isDeleted": false,
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp"
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Invalid question ID | Invalid ObjectId format |
| 404 | Question not found | Question doesn't exist or is deleted |
| 401 | Unauthorized | Missing/invalid access token |

**Notes:**
- User can only retrieve their own questions
- Deleted questions return 404
- Validates MongoDB ObjectId format

---

### 14. Update Question

**Endpoint:** `PATCH /question/:questionId`

**Authentication:** Required ✅

**Description:** Update question details (title, difficulty, platform)

**Request Headers:**
```
Cookie: accessToken=<token>
Content-Type: application/json
```

**URL Parameters:**
```
questionId: string (MongoDB ObjectId, required)
```

**Request Body:**
```json
{
  "title": "string (optional, min 3 chars)",
  "difficulty": "string (optional, enum)",
  "platform": "string (optional, enum)"
}
```

**Validation Rules:**
- At least one field must be provided
- title: Minimum 3 characters if provided
- difficulty: Must be "easy", "medium", or "hard" if provided
- platform: Must be "LeetCode", "GFG", "Codeforces", or "Other" if provided

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Question updated",
  "data": {
    "_id": "ObjectId",
    "ownerId": "ObjectId",
    "title": "string",
    "platform": "LeetCode | GFG | Codeforces | Other",
    "problemUrlOriginal": "string",
    "problemUrlNormalized": "string",
    "difficulty": "easy | medium | hard",
    "topics": ["string"],
    "isDeleted": false,
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp"
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Invalid question ID | Invalid ObjectId format |
| 400 | At least one field is required | No fields provided |
| 404 | Question not found | Question doesn't exist or is deleted |
| 401 | Unauthorized | Missing/invalid access token |

**Notes:**
- User can only update their own questions
- Only specific fields can be updated (title, difficulty, platform)
- Problem URL cannot be updated (use delete + create instead)
- Topics cannot be updated (use delete + create instead)

---

### 15. Delete Question

**Endpoint:** `DELETE /question/:questionId`

**Authentication:** Required ✅

**Description:** Soft delete a question (marks as deleted, doesn't remove from database)

**Request Headers:**
```
Cookie: accessToken=<token>
```

**URL Parameters:**
```
questionId: string (MongoDB ObjectId, required)
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Question removed",
  "data": {},
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Invalid question ID | Invalid ObjectId format |
| 404 | Question not found | Question doesn't exist or already deleted |
| 401 | Unauthorized | Missing/invalid access token |

**Notes:**
- Implements soft delete (sets isDeleted: true)
- Deleted questions don't appear in getAllQuestions
- Data is preserved in database for recovery/analytics
- Cannot be undone via API (planned: recovery endpoint)

---

## Future Endpoints (TODO)

The following endpoints are planned but not yet implemented:

### User Endpoints
- `POST /users/verify-email` - Send verification email
- `POST /users/resend-verification-email` - Resend verification
- `POST /users/forgot-password` - Initiate password reset
- `POST /users/reset-password/:token` - Complete password reset

### Question Endpoints
- `GET /question/recently-deleted` - View soft-deleted questions
- `POST /question/:questionId/restore` - Restore deleted question
- `GET /question/stats` - Get question statistics
- `POST /question/:questionId/bookmark` - Bookmark a question
- `GET /question/bookmarked` - Get bookmarked questions

---

## Implementation Notes

1. **Security:**
   - Passwords are hashed with bcrypt (salt rounds: 10)
   - Tokens are JWT-based with expiration
   - Refresh tokens are hashed before storage
   - httpOnly and secure flags on cookies
   - CORS enabled with credentials

2. **File Uploads:**
   - Images uploaded to Cloudinary
   - Temporary files cleaned up after upload
   - Old files deleted when replaced
   - Rollback on database failure

3. **Validation:**
   - Express-validator for input validation
   - Mongoose schema validation
   - Password confirmation validation
   - Image type validation

4. **Error Handling:**
   - Centralized error handling with ApiError class
   - Async wrapper for try-catch blocks
   - Descriptive error messages
   - Proper HTTP status codes

---

## Example cURL Commands

### Register
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

### Get Current User
```bash
curl -X GET http://localhost:5000/api/v1/users/current-user \
  -H "Cookie: accessToken=<token>"
```

### Update Avatar
```bash
curl -X PATCH http://localhost:5000/api/v1/users/update-avatar \
  -H "Cookie: accessToken=<token>" \
  -F "avatar=@/path/to/image.jpg"
```

### Get User Profile
```bash
curl -X GET http://localhost:5000/api/v1/users/c/john_doe
```

### Upload Question
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

### Get All Questions
```bash
curl -X GET "http://localhost:5000/api/v1/question?difficulty=medium&platform=LeetCode&page=1&limit=20" \
  -H "Cookie: accessToken=<token>"
```

### Get Question by ID
```bash
curl -X GET http://localhost:5000/api/v1/question/507f1f77bcf86cd799439011 \
  -H "Cookie: accessToken=<token>"
```

### Update Question
```bash
curl -X PATCH http://localhost:5000/api/v1/question/507f1f77bcf86cd799439011 \
  -H "Cookie: accessToken=<token>" \
  -H "Content-Type: application/json" \
  -d '{
    "difficulty": "medium",
    "platform": "LeetCode"
  }'
```

### Delete Question
```bash
curl -X DELETE http://localhost:5000/api/v1/question/507f1f77bcf86cd799439011 \
  -H "Cookie: accessToken=<token>"
```

---

## Question Model Schema

```javascript
{
  ownerId: {
    type: ObjectId,
    ref: "User",
    required: true,
    indexed: true
  },
  
  title: {
    type: String,
    required: true,
    trim: true,
    indexed: true
  },
  
  platform: {
    type: String,
    enum: ["LeetCode", "GFG", "Codeforces", "Other"],
    required: true
  },
  
  problemUrlOriginal: {
    type: String,
    required: true
  },
  
  problemUrlNormalized: {
    type: String,
    required: true,
    indexed: true,
    unique: true (per user)
  },
  
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true
  },
  
  topics: {
    type: [String],
    indexed: true
  },
  
  isDeleted: {
    type: Boolean,
    default: false,
    indexed: true
  },
  
  timestamps: {
    createdAt: ISO 8601,
    updatedAt: ISO 8601
  }
}
```

### Indexes:
1. **Compound Index:** `{ ownerId: 1, problemUrlNormalized: 1, isDeleted: 1 }` (unique)
   - Ensures each user can't add same problem twice
   - Filters deleted questions efficiently

2. **Compound Index:** `{ ownerId: 1, topics: 1 }`
   - Optimizes filtering by topics

3. **Text Index:** `{ title: "text", topics: "text", platform: "text" }`
   - Enables full-text search across fields

---

**For Frontend Integration:** Import this documentation for Postman, Swagger, or API client generation tools.
