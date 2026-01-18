# ReviCode Backend API Documentation

**Base URL:** `http://localhost:5000/api/v1`

**Last Updated:** January 10, 2026

---

## Table of Contents

1. [Authentication & User Management](#authentication--user-management)
2. [Question Management](#question-management)
3. [Collection Management](#collection-management)
4. [Collection Questions Management](#collection-questions-management)
5. [Contest Management](#contest-management)
6. [Follow System](#follow-system)
7. [User Statistics](#user-statistics)
8. [Error Responses](#error-responses)
9. [Response Format](#response-format)
10. [User Model Schema](#user-model-schema)
11. [Question Model Schema](#question-model-schema)
12. [Collection Model Schema](#collection-model-schema)
13. [CollectionQuestion Model Schema](#collectionquestion-model-schema)
14. [Contest Model Schema](#contest-model-schema)
15. [ContestParticipant Model Schema](#contestparticipant-model-schema)
16. [Follow Model Schema](#follow-model-schema)

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

## Contest Management

### 28. Create Contest

**Endpoint:** `POST /contest`

**Authentication:** Required (JWT)

**Description:** Create a new contest from a collection of questions

**Request Body:**
```json
{
  "collectionId": "string (MongoDB ObjectId)",
  "title": "string (3-100 chars)",
  "durationInMin": "number (1-720)",
  "questionCount": "number (1-10)",
  "visibility": "string (optional: 'private', 'shared', 'public')"
}
```

**Validation Rules:**
- `collectionId`: Must be valid MongoDB ObjectId and user must own the collection
- `title`: 3-100 characters, trimmed
- `durationInMin`: Integer between 1-720 minutes
- `questionCount`: Integer between 1-10, must not exceed available questions in collection
- `visibility`: Optional, defaults to 'private', must be one of: 'private', 'shared', 'public'

**Response (201):**
```json
{
  "errorCode": 201,
  "message": "Contest created successfully",
  "data": {
    "_id": "contest_id",
    "title": "Sample Contest",
    "owner": "user_id",
    "questionIds": ["q1", "q2", "q3"],
    "durationInMin": 60,
    "visibility": "private",
    "contestCode": "ABC123",
    "status": "upcoming",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Invalid collection ID | collectionId is not a valid ObjectId |
| 404 | Collection not found | Collection doesn't exist or user doesn't own it |
| 400 | Not enough questions in collection | Collection has fewer questions than requested |
| 400 | questionCount must be greater than 0 | Invalid question count |
| 400 | Title must be between 3 and 100 characters | Invalid title length |
| 400 | Duration must be between 1 and 720 minutes | Invalid duration |
| 400 | Invalid visibility | Visibility not one of allowed values |

**Implementation Notes:**
- Randomly selects questions from the specified collection
- Generates a unique contest code for joining
- Contest starts in 'upcoming' status
- Only collection owner can create contests from their collections

---

### 29. Get Contest

**Endpoint:** `GET /contest/:contestId`

**Authentication:** Required (JWT)

**Description:** Get contest details and questions (for participants)

**URL Parameters:**
- `contestId`: Contest ID or contest code (string, min 3 chars)

**Response (200):**
```json
{
  "errorCode": 200,
  "message": "Contest fetched successfully",
  "data": {
    "_id": "contest_id",
    "title": "Sample Contest",
    "questions": [
      {
        "_id": "q1",
        "title": "Two Sum",
        "platform": "LeetCode",
        "difficulty": "easy",
        "topics": ["array", "hash-table"]
      }
    ],
    "durationInMin": 60,
    "visibility": "private",
    "status": "active",
    "startTime": "2024-01-01T00:00:00.000Z",
    "endTime": "2024-01-01T01:00:00.000Z",
    "timeRemaining": 3540
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Invalid contest ID or code | contestId parameter is invalid |
| 404 | Contest not found | Contest doesn't exist |
| 403 | Contest is private | User not authorized to view private contest |
| 400 | Contest has ended | Contest is in 'completed' status |

**Implementation Notes:**
- Accepts both contest ID and contest code
- Returns questions only if user is authorized to participate
- Includes time remaining for active contests
- Private contests require invitation or ownership

---

### 30. Join Contest

**Endpoint:** `POST /contest/:id/join`

**Authentication:** Required (JWT)

**Description:** Join an upcoming or active contest

**URL Parameters:**
- `id`: Contest ID or contest code (string, min 3 chars)

**Response (200):**
```json
{
  "errorCode": 200,
  "message": "Successfully joined contest",
  "data": {
    "contestId": "contest_id",
    "participantId": "participant_id",
    "joinedAt": "2024-01-01T00:00:00.000Z",
    "status": "joined"
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Invalid contest ID or code | id parameter is invalid |
| 404 | Contest not found | Contest doesn't exist |
| 403 | Contest is private | User not authorized to join |
| 409 | Already joined this contest | User is already a participant |
| 400 | Contest has ended | Contest status is 'completed' |
| 400 | Contest not started yet | Contest is still 'upcoming' |

**Implementation Notes:**
- Creates ContestParticipant record
- Sets initial status to 'joined'
- Contest must be 'upcoming' or 'active' to join

---

### 31. Submit Contest

**Endpoint:** `POST /contest/:contestId/submit`

**Authentication:** Required (JWT)

**Description:** Submit contest answers and finalize participation

**URL Parameters:**
- `contestId`: Contest ID (MongoDB ObjectId)

**Request Body:**
```json
{
  "attempts": [
    {
      "questionId": "string (MongoDB ObjectId)",
      "status": "string ('solved' or 'unsolved')",
      "timeSpent": "number (seconds spent on question)"
    }
  ]
}
```

**Validation Rules:**
- `attempts`: Array with at least 1 item
- `questionId`: Must be valid ObjectId and part of contest
- `status`: Must be 'solved' or 'unsolved'
- `timeSpent`: Must be non-negative integer

**Response (200):**
```json
{
  "errorCode": 200,
  "message": "Contest submitted successfully",
  "data": {
    "participantId": "participant_id",
    "totalScore": 150,
    "totalTimeSpent": 1800,
    "rank": 3,
    "attempts": [
      {
        "questionId": "q1",
        "status": "solved",
        "timeSpent": 300,
        "points": 50
      }
    ]
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Invalid contest ID | contestId is not valid ObjectId |
| 404 | Contest not found | Contest doesn't exist |
| 403 | Not a participant in this contest | User hasn't joined the contest |
| 400 | Contest not active | Contest is not in 'active' status |
| 400 | Attempts must be a non-empty array | Invalid attempts array |
| 400 | Invalid question ID in attempts | Question not part of contest |
| 400 | Invalid status | Status not 'solved' or 'unsolved' |

**Implementation Notes:**
- Calculates score based on solved questions and time penalties
- Updates participant status to 'completed'
- Generates ranking based on score and time
- Auto-submission may occur if contest time expires

---

### 32. Get Contest Leaderboard

**Endpoint:** `GET /contest/:contestId/leaderboard`

**Authentication:** Required (JWT)

**Description:** Get ranked list of contest participants

**URL Parameters:**
- `contestId`: Contest ID (MongoDB ObjectId)

**Response (200):**
```json
{
  "errorCode": 200,
  "message": "Leaderboard fetched successfully",
  "data": {
    "contestId": "contest_id",
    "totalParticipants": 25,
    "leaderboard": [
      {
        "rank": 1,
        "participant": {
          "_id": "user_id",
          "username": "top_coder",
          "fullName": "Top Coder"
        },
        "score": 300,
        "timeSpent": 1500,
        "questionsSolved": 6,
        "accuracy": 100
      }
    ]
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Invalid contest ID | contestId is not valid ObjectId |
| 404 | Contest not found | Contest doesn't exist |
| 403 | Contest is private | User not authorized to view leaderboard |
| 400 | Contest not completed | Leaderboard only available for completed contests |

**Implementation Notes:**
- Only shows leaderboard for completed contests
- Ranks by score (descending), then by time spent (ascending)
- Includes participant statistics
- Private contests require participation to view

---

### 33. Get My Contest Rank

**Endpoint:** `GET /contest/:contestId/me`

**Authentication:** Required (JWT)

**Description:** Get current user's ranking and performance in contest

**URL Parameters:**
- `contestId`: Contest ID (MongoDB ObjectId)

**Response (200):**
```json
{
  "errorCode": 200,
  "message": "Contest rank fetched successfully",
  "data": {
    "rank": 5,
    "totalParticipants": 25,
    "score": 200,
    "timeSpent": 1800,
    "questionsSolved": 4,
    "accuracy": 80,
    "percentile": 80
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Invalid contest ID | contestId is not valid ObjectId |
| 404 | Contest not found | Contest doesn't exist |
| 403 | Not a participant in this contest | User hasn't joined the contest |
| 400 | Contest not completed | Rankings only available for completed contests |

**Implementation Notes:**
- Only available for completed contests
- Shows user's relative performance
- Includes percentile ranking

---

## Follow System

### 34. Follow User

**Endpoint:** `POST /follow/:targetUserId`

**Authentication:** Required (JWT)

**Description:** Follow another user

**URL Parameters:**
- `targetUserId`: User ID to follow (MongoDB ObjectId)

**Response (201):**
```json
{
  "errorCode": 201,
  "message": "User followed successfully",
  "data": {
    "followerId": "current_user_id",
    "followingId": "target_user_id",
    "followedAt": "2024-01-01T00:00:00.000Z"
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Invalid user ID | targetUserId is not valid ObjectId |
| 404 | User not found | Target user doesn't exist |
| 409 | Already following this user | User is already following target |
| 400 | Cannot follow yourself | User trying to follow themselves |

**Implementation Notes:**
- Creates Follow record between users
- Updates follower/following counts
- Cannot follow yourself
- Cannot follow the same user twice

---

### 35. Unfollow User

**Endpoint:** `DELETE /follow/:targetUserId`

**Authentication:** Required (JWT)

**Description:** Unfollow a user

**URL Parameters:**
- `targetUserId`: User ID to unfollow (MongoDB ObjectId)

**Response (200):**
```json
{
  "errorCode": 200,
  "message": "User unfollowed successfully",
  "data": {
    "followerId": "current_user_id",
    "followingId": "target_user_id",
    "unfollowedAt": "2024-01-01T00:00:00.000Z"
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Invalid user ID | targetUserId is not valid ObjectId |
| 404 | User not found | Target user doesn't exist |
| 404 | Not following this user | User is not following target |

**Implementation Notes:**
- Removes Follow record between users
- Updates follower/following counts
- Only removes existing follow relationships

---

### 36. Get Followers

**Endpoint:** `GET /follow/followers/:userId`

**Authentication:** Required (JWT)

**Description:** Get list of users following a specific user

**URL Parameters:**
- `userId`: User ID to get followers for (MongoDB ObjectId)

**Query Parameters:**
- `page`: Page number (optional, default 1)
- `limit`: Items per page (optional, default 20, max 50)

**Response (200):**
```json
{
  "errorCode": 200,
  "message": "Followers fetched successfully",
  "data": {
    "userId": "target_user_id",
    "followers": [
      {
        "_id": "follower_id",
        "username": "follower_user",
        "fullName": "Follower User",
        "followedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Invalid user ID | userId is not valid ObjectId |
| 404 | User not found | Target user doesn't exist |

**Implementation Notes:**
- Returns paginated list of followers
- Includes follower details and follow date
- Sorted by most recent follows first

---

### 37. Get Following

**Endpoint:** `GET /follow/following/:userId`

**Authentication:** Required (JWT)

**Description:** Get list of users that a specific user is following

**URL Parameters:**
- `userId`: User ID to get following for (MongoDB ObjectId)

**Query Parameters:**
- `page`: Page number (optional, default 1)
- `limit`: Items per page (optional, default 20, max 50)

**Response (200):**
```json
{
  "errorCode": 200,
  "message": "Following fetched successfully",
  "data": {
    "userId": "target_user_id",
    "following": [
      {
        "_id": "following_id",
        "username": "followed_user",
        "fullName": "Followed User",
        "followedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 32,
      "pages": 2
    }
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Invalid user ID | userId is not valid ObjectId |
| 404 | User not found | Target user doesn't exist |

**Implementation Notes:**
- Returns paginated list of users being followed
- Includes following details and follow date
- Sorted by most recent follows first

---

### 38. Get Follow Status

**Endpoint:** `GET /follow/status/:targetUserId`

**Authentication:** Required (JWT)

**Description:** Check if current user follows target user and get follow stats

**URL Parameters:**
- `targetUserId`: User ID to check follow status for (MongoDB ObjectId)

**Response (200):**
```json
{
  "errorCode": 200,
  "message": "Follow status fetched successfully",
  "data": {
    "targetUserId": "target_user_id",
    "isFollowing": true,
    "followerCount": 45,
    "followingCount": 32,
    "followedAt": "2024-01-01T00:00:00.000Z"
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Invalid user ID | targetUserId is not valid ObjectId |
| 404 | User not found | Target user doesn't exist |

**Implementation Notes:**
- Shows follow relationship between current user and target
- Includes aggregated follower/following counts
- Shows follow date if following

---

## User Statistics

### 39. Get Global Leaderboard

**Endpoint:** `GET /userStats/leaderboard`

**Authentication:** Required (JWT)

**Description:** Get global user ranking based on contest performance

**Query Parameters:**
- `page`: Page number (optional, default 1)
- `limit`: Items per page (optional, default 20, max 50)

**Response (200):**
```json
{
  "errorCode": 200,
  "message": "Leaderboard fetched successfully",
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "user": {
          "_id": "user_id",
          "username": "top_coder",
          "fullName": "Top Coder"
        },
        "totalScore": 2500,
        "contestsParticipated": 15,
        "averageAccuracy": 85.5,
        "winRate": 60
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 500,
      "pages": 25
    }
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| None specific | Standard pagination errors | Invalid page/limit values |

**Implementation Notes:**
- Ranks users by total contest score
- Includes participation statistics
- Paginated for performance

---

### 40. Get User Stats

**Endpoint:** `GET /userStats/:userId`

**Authentication:** Required (JWT)

**Description:** Get comprehensive statistics for a user

**URL Parameters:**
- `userId`: User ID (MongoDB ObjectId)

**Response (200):**
```json
{
  "errorCode": 200,
  "message": "User stats fetched successfully",
  "data": {
    "userId": "user_id",
    "totalScore": 1200,
    "contestsParticipated": 8,
    "contestsWon": 2,
    "averageAccuracy": 78.5,
    "totalQuestionsSolved": 45,
    "averageTimePerQuestion": 420,
    "bestRank": 3,
    "currentStreak": 5,
    "longestStreak": 12
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Invalid user ID | userId is not valid ObjectId |
| 404 | User not found | User doesn't exist |

**Implementation Notes:**
- Aggregates data from contest participations
- Includes various performance metrics
- Shows ranking statistics

---

### 41. Get User Topic Stats

**Endpoint:** `GET /userStats/:userId/topics`

**Authentication:** Required (JWT)

**Description:** Get user's performance statistics by topic

**URL Parameters:**
- `userId`: User ID (MongoDB ObjectId)

**Response (200):**
```json
{
  "errorCode": 200,
  "message": "User topic stats fetched successfully",
  "data": {
    "userId": "user_id",
    "topicStats": [
      {
        "topic": "array",
        "questionsSolved": 15,
        "totalAttempts": 18,
        "accuracy": 83.3,
        "averageTime": 380
      },
      {
        "topic": "string",
        "questionsSolved": 12,
        "totalAttempts": 15,
        "accuracy": 80,
        "averageTime": 420
      }
    ]
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Invalid user ID | userId is not valid ObjectId |
| 404 | User not found | User doesn't exist |

**Implementation Notes:**
- Aggregates performance by question topics
- Shows accuracy and timing per topic
- Helps identify strengths/weaknesses

---

### 42. Get User Contest History

**Endpoint:** `GET /userStats/:userId/history`

**Authentication:** Required (JWT)

**Description:** Get user's contest participation history

**URL Parameters:**
- `userId`: User ID (MongoDB ObjectId)

**Query Parameters:**
- `page`: Page number (optional, default 1)
- `limit`: Items per page (optional, default 20, max 50)

**Response (200):**
```json
{
  "errorCode": 200,
  "message": "Contest history fetched successfully",
  "data": {
    "userId": "user_id",
    "contestHistory": [
      {
        "contestId": "contest_id",
        "contestTitle": "Weekly Challenge",
        "rank": 5,
        "score": 200,
        "totalParticipants": 50,
        "participatedAt": "2024-01-01T00:00:00.000Z",
        "status": "completed"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 25,
      "pages": 2
    }
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Invalid user ID | userId is not valid ObjectId |
| 404 | User not found | User doesn't exist |

**Implementation Notes:**
- Shows all contest participations
- Includes ranking and performance data
- Paginated for performance

---

### 43. Get User Created Contests

**Endpoint:** `GET /userStats/:userId/contests/created`

**Authentication:** Required (JWT)

**Description:** Get contests created by a user

**URL Parameters:**
- `userId`: User ID (MongoDB ObjectId)

**Query Parameters:**
- `page`: Page number (optional, default 1)
- `limit`: Items per page (optional, default 20, max 50)

**Response (200):**
```json
{
  "errorCode": 200,
  "message": "Created contests fetched successfully",
  "data": {
    "userId": "user_id",
    "createdContests": [
      {
        "contestId": "contest_id",
        "title": "My Contest",
        "participants": 25,
        "status": "completed",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "pages": 1
    }
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Invalid user ID | userId is not valid ObjectId |
| 404 | User not found | User doesn't exist |

**Implementation Notes:**
- Shows contests created by the user
- Includes participation statistics
- Paginated for performance

---

### 44. Get User Joined Contests

**Endpoint:** `GET /userStats/:userId/contests/joined`

**Authentication:** Required (JWT)

**Description:** Get contests joined by a user

**URL Parameters:**
- `userId`: User ID (MongoDB ObjectId)

**Query Parameters:**
- `page`: Page number (optional, default 1)
- `limit`: Items per page (optional, default 20, max 50)

**Response (200):**
```json
{
  "errorCode": 200,
  "message": "Joined contests fetched successfully",
  "data": {
    "userId": "user_id",
    "joinedContests": [
      {
        "contestId": "contest_id",
        "title": "Weekly Challenge",
        "rank": 5,
        "score": 200,
        "joinedAt": "2024-01-01T00:00:00.000Z",
        "status": "completed"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 15,
      "pages": 1
    }
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Invalid user ID | userId is not valid ObjectId |
| 404 | User not found | User doesn't exist |

**Implementation Notes:**
- Shows contests the user has participated in
- Includes performance data
- Paginated for performance

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

## Collection Management

### 16. Create Collection

**Endpoint:** `POST /api/v1/collections`

**Authentication:** Required ✅

**Description:** Create a new question collection for organizing problems

**Request Headers:**
```
Cookie: accessToken=<token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "string (required, 2-100 chars)",
  "description": "string (optional, max 300 chars)",
  "isPublic": "boolean (optional, default: false)"
}
```

**Validation Rules:**
- name: Required, 2-100 characters, trimmed
- description: Optional, max 300 characters
- isPublic: Optional, must be boolean if provided

**Response (201 Created):**
```json
{
  "errorCode": 201,
  "message": "Collection created",
  "data": {
    "_id": "ObjectId",
    "ownerId": "ObjectId",
    "name": "string",
    "nameLower": "string (lowercase for searching)",
    "description": "string",
    "isPublic": "boolean",
    "questionsCount": 0,
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp"
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Collection name is required | Missing name |
| 400 | Validation error | Invalid input format |
| 409 | You have already have this collection | Duplicate collection name |
| 401 | Unauthorized | Missing/invalid access token |

---

### 17. Get My Collections

**Endpoint:** `GET /api/v1/collections`

**Authentication:** Required ✅

**Description:** Retrieve all collections owned by the authenticated user

**Request Headers:**
```
Cookie: accessToken=<token>
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Collections fetched",
  "data": [
    {
      "_id": "ObjectId",
      "ownerId": "ObjectId",
      "name": "string",
      "nameLower": "string",
      "description": "string",
      "isPublic": "boolean",
      "questionsCount": "number",
      "createdAt": "ISO 8601 timestamp",
      "updatedAt": "ISO 8601 timestamp"
    }
    // ... more collections
  ],
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 401 | Unauthorized | Missing/invalid access token |

**Notes:**
- Returns empty array if no collections exist
- Sorted by creation date (newest first)
- Includes question count for each collection

---

### 18. Get Collection by ID

**Endpoint:** `GET /api/v1/collections/:collectionId`

**Authentication:** Required ✅

**Description:** Retrieve a specific collection's details

**Request Headers:**
```
Cookie: accessToken=<token>
```

**URL Parameters:**
```
collectionId: string (MongoDB ObjectId, required)
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Collection fetched",
  "data": {
    "_id": "ObjectId",
    "ownerId": "ObjectId",
    "name": "string",
    "nameLower": "string",
    "description": "string",
    "isPublic": "boolean",
    "questionsCount": "number",
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp"
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Invalid collection ID | Invalid ObjectId format |
| 404 | Collection not found | Collection doesn't exist or not owned by user |
| 401 | Unauthorized | Missing/invalid access token |

**Notes:**
- User can only retrieve their own collections
- Returns full collection metadata

---

### 19. Update Collection

**Endpoint:** `PATCH /api/v1/collections/:collectionId`

**Authentication:** Required ✅

**Description:** Update collection details (name, description, visibility)

**Request Headers:**
```
Cookie: accessToken=<token>
Content-Type: application/json
```

**URL Parameters:**
```
collectionId: string (MongoDB ObjectId, required)
```

**Request Body:**
```json
{
  "name": "string (optional, 2-100 chars)",
  "description": "string (optional, max 300 chars)",
  "isPublic": "boolean (optional)"
}
```

**Validation Rules:**
- At least one field must be provided
- name: 2-100 characters if provided, trimmed
- description: Max 300 characters if provided, trimmed
- isPublic: Must be boolean if provided

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Collection updated",
  "data": {
    "_id": "ObjectId",
    "ownerId": "ObjectId",
    "name": "string",
    "nameLower": "string",
    "description": "string",
    "isPublic": "boolean",
    "questionsCount": "number",
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp"
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Invalid collection ID | Invalid ObjectId format |
| 400 | At least one field is required | No fields provided |
| 400 | Collection name cannot be empty | Empty name provided |
| 404 | Collection not found | Collection doesn't exist or not owned by user |
| 401 | Unauthorized | Missing/invalid access token |

**Notes:**
- User can only update their own collections
- Updating name updates nameLower field automatically
- questionsCount cannot be directly updated (changes via add/remove operations)

---

### 20. Delete Collection

**Endpoint:** `DELETE /api/v1/collections/:collectionId`

**Authentication:** Required ✅

**Description:** Delete a collection and all its question associations

**Request Headers:**
```
Cookie: accessToken=<token>
```

**URL Parameters:**
```
collectionId: string (MongoDB ObjectId, required)
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Collection deleted",
  "data": {},
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Invalid collection ID | Invalid ObjectId format |
| 404 | Collection not found | Collection doesn't exist or not owned by user |
| 401 | Unauthorized | Missing/invalid access token |

**Notes:**
- Performs hard delete (removes collection and all associations)
- Also removes all CollectionQuestion records for this collection
- Questions themselves are NOT deleted, only the collection

---

### 21. Get Collection Questions

**Endpoint:** `GET /api/v1/collections/:collectionId/questions`

**Authentication:** Required ✅

**Description:** Retrieve all questions in a collection with order and metadata

**Request Headers:**
```
Cookie: accessToken=<token>
```

**URL Parameters:**
```
collectionId: string (MongoDB ObjectId, required)
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Collection questions fetched",
  "data": {
    "collection": {
      "_id": "ObjectId",
      "name": "string",
      "questionsCount": "number"
    },
    "questions": [
      {
        "order": "number",
        "addedAt": "ISO 8601 timestamp",
        "question": {
          "_id": "ObjectId",
          "title": "string",
          "platform": "string",
          "difficulty": "string",
          "topics": ["string"],
          "problemUrlOriginal": "string",
          // ... other question fields
        }
      }
      // ... more questions
    ]
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Invalid collection ID | Invalid ObjectId format |
| 404 | Collection not found | Collection doesn't exist or not owned by user |
| 401 | Unauthorized | Missing/invalid access token |

**Notes:**
- Questions are sorted by order, then by addedAt (descending)
- Automatically filters out deleted questions
- Includes ordering information for each question
- Includes full question metadata

---

## Collection Questions Management

### 22. Add Question to Collection

**Endpoint:** `POST /api/v1/collectionQuestions/:collectionId/questions`

**Authentication:** Required ✅

**Description:** Add a single question to a collection

**Request Headers:**
```
Cookie: accessToken=<token>
Content-Type: application/json
```

**URL Parameters:**
```
collectionId: string (MongoDB ObjectId, required)
```

**Request Body:**
```json
{
  "questionId": "string (ObjectId, required)"
}
```

**Validation Rules:**
- collectionId: Must be valid MongoDB ObjectId
- questionId: Must be valid MongoDB ObjectId

**Response (201 Created):**
```json
{
  "errorCode": 201,
  "message": "Question added to collection",
  "data": null,
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Invalid collection ID | Invalid ObjectId format |
| 400 | Invalid question ID | Invalid ObjectId format |
| 404 | Collection not found | Collection doesn't exist or not owned by user |
| 404 | Question not found | Question doesn't exist or is deleted |
| 409 | Question already in this collection | Question already exists in collection |
| 401 | Unauthorized | Missing/invalid access token |

**Notes:**
- User must own both collection and question
- questionsCount is incremented automatically
- Prevents duplicate entries (unique constraint)
- Default order: 0, can be changed with reorder endpoint

---

### 23. Remove Question from Collection

**Endpoint:** `DELETE /api/v1/collectionQuestions/:collectionId/questions/:questionId`

**Authentication:** Required ✅

**Description:** Remove a single question from a collection

**Request Headers:**
```
Cookie: accessToken=<token>
```

**URL Parameters:**
```
collectionId: string (MongoDB ObjectId, required)
questionId: string (MongoDB ObjectId, required)
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Question removed from collection",
  "data": null,
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Invalid collection ID | Invalid ObjectId format |
| 400 | Invalid question ID | Invalid ObjectId format |
| 404 | Collection not found | Collection doesn't exist or not owned by user |
| 404 | Question not found in this collection | Question not in collection |
| 401 | Unauthorized | Missing/invalid access token |

**Notes:**
- questionsCount is decremented automatically
- Only removes the association, question remains in database

---

### 24. Reorder Question in Collection

**Endpoint:** `PATCH /api/v1/collectionQuestions/:collectionId/questions/:questionId/order`

**Authentication:** Required ✅

**Description:** Change the order/position of a question within the collection

**Request Headers:**
```
Cookie: accessToken=<token>
Content-Type: application/json
```

**URL Parameters:**
```
collectionId: string (MongoDB ObjectId, required)
questionId: string (MongoDB ObjectId, required)
```

**Request Body:**
```json
{
  "order": "number (non-negative integer, required)"
}
```

**Validation Rules:**
- order: Must be non-negative integer (0, 1, 2, etc.)

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Order updated",
  "data": {
    "_id": "ObjectId",
    "collectionId": "ObjectId",
    "questionId": "ObjectId",
    "order": "number",
    "addedAt": "ISO 8601 timestamp"
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Invalid collection ID | Invalid ObjectId format |
| 400 | Invalid question ID | Invalid ObjectId format |
| 400 | Order must be a non-negative integer | Invalid order value |
| 404 | Collection not found | Collection doesn't exist or not owned by user |
| 404 | Question not found in collection | Question not in collection |
| 401 | Unauthorized | Missing/invalid access token |

**Notes:**
- Order is used for sorting (ascending by order, then by addedAt)
- Multiple questions can have same order (they'll be sorted by addedAt)
- Allows flexible ordering without gaps

---

### 25. Bulk Add Questions to Collection

**Endpoint:** `POST /api/v1/collectionQuestions/:collectionId/questions/bulk`

**Authentication:** Required ✅

**Description:** Add multiple questions to collection in one request

**Request Headers:**
```
Cookie: accessToken=<token>
Content-Type: application/json
```

**URL Parameters:**
```
collectionId: string (MongoDB ObjectId, required)
```

**Request Body:**
```json
{
  "questionIds": ["ObjectId1", "ObjectId2", "ObjectId3", ...]
}
```

**Validation Rules:**
- questionIds: Required, non-empty array
- Each item must be valid MongoDB ObjectId

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Bulk add completed",
  "data": {
    "added": "number (count of successfully added)",
    "attempted": "number (count of requested)"
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Invalid collection ID | Invalid ObjectId format |
| 400 | questionIds must be a non-empty array | Missing or empty array |
| 400 | Each questionId must be a valid Mongo ID | Invalid ObjectId in array |
| 400 | No valid question IDs provided | All IDs invalid |
| 404 | Collection not found | Collection doesn't exist or not owned by user |
| 401 | Unauthorized | Missing/invalid access token |

**Notes:**
- Uses `ordered: false` to skip duplicates and continue processing
- Returns count of added and attempted
- Increments questionsCount with successfully added count
- Silently skips already-existing questions (409 errors not thrown)
- User must own all questions

---

### 26. Bulk Remove Questions from Collection

**Endpoint:** `DELETE /api/v1/collectionQuestions/:collectionId/questions/bulk`

**Authentication:** Required ✅

**Description:** Remove multiple questions from collection in one request

**Request Headers:**
```
Cookie: accessToken=<token>
Content-Type: application/json
```

**URL Parameters:**
```
collectionId: string (MongoDB ObjectId, required)
```

**Request Body:**
```json
{
  "questionIds": ["ObjectId1", "ObjectId2", "ObjectId3", ...]
}
```

**Validation Rules:**
- questionIds: Required, non-empty array
- Each item must be valid MongoDB ObjectId

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "Questions removed from collection",
  "data": {
    "removed": "number (count of successfully removed)",
    "attempted": "number (count of valid IDs)"
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Invalid collection ID | Invalid ObjectId format |
| 400 | questionIds must be a non-empty array | Missing or empty array |
| 400 | Each questionId must be a valid Mongo ID | Invalid ObjectId in array |
| 400 | No valid question IDs provided | All IDs invalid |
| 404 | Collection not found | Collection doesn't exist or not owned by user |
| 401 | Unauthorized | Missing/invalid access token |

**Notes:**
- Filters invalid ObjectIds before processing
- Returns count of removed and attempted (valid) IDs
- Decrements questionsCount with successfully removed count
- Silently skips non-existent associations

---

### 27. Remove All Questions from Collection

**Endpoint:** `DELETE /api/v1/collectionQuestions/:collectionId/questions`

**Authentication:** Required ✅

**Description:** Clear all questions from a collection

**Request Headers:**
```
Cookie: accessToken=<token>
```

**URL Parameters:**
```
collectionId: string (MongoDB ObjectId, required)
```

**Response (200 OK):**
```json
{
  "errorCode": 200,
  "message": "All questions removed",
  "data": {
    "removed": "number (count of questions removed)"
  },
  "success": true
}
```

**Error Responses:**
| Status | Message | Reason |
|--------|---------|--------|
| 400 | Invalid collection ID | Invalid ObjectId format |
| 404 | Collection not found | Collection doesn't exist or not owned by user |
| 401 | Unauthorized | Missing/invalid access token |

**Notes:**
- Removes all CollectionQuestion records for this collection
- Sets questionsCount to 0
- Collection itself is NOT deleted
- Questions are NOT deleted, only associations

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

## Collection Model Schema

```javascript
{
  ownerId: {
    type: ObjectId,
    ref: "User",
    required: true,
    indexed: true
  },
  
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  
  nameLower: {
    type: String,
    required: true,
    indexed: true
  },
  
  description: {
    type: String,
    maxlength: 300
  },
  
  isPublic: {
    type: Boolean,
    default: false
  },
  
  questionsCount: {
    type: Number,
    default: 0
  },
  
  timestamps: {
    createdAt: ISO 8601,
    updatedAt: ISO 8601
  }
}
```

### Indexes:
1. **Compound Index:** `{ ownerId: 1, name: 1 }`
   - Optimizes collection lookup by owner and name

2. **Compound Index (unique):** `{ ownerId: 1, nameLower: 1 }`
   - Ensures unique collection names per user (case-insensitive)

---

## CollectionQuestion Model Schema

```javascript
{
  collectionId: {
    type: ObjectId,
    ref: "Collection",
    required: true,
    indexed: true
  },
  
  questionId: {
    type: ObjectId,
    ref: "Question",
    required: true,
    indexed: true
  },
  
  order: {
    type: Number,
    default: 0
  },
  
  addedAt: {
    type: Date,
    default: Date.now
  },
  
  timestamps: {
    updatedAt: ISO 8601 (if needed, though timestamps: false used)
  }
}
```

### Indexes:
1. **Compound Index (unique):** `{ collectionId: 1, questionId: 1 }`
   - Prevents duplicate question entries in same collection
   - Enables efficient lookups of specific questions in collection

---

**For Frontend Integration:** Import this documentation for Postman, Swagger, or API client generation tools.

---

## Contest Model Schema

```javascript
const contestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  questionIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  }],
  
  durationInMin: {
    type: Number,
    required: true,
    min: 1,
    max: 720
  },
  
  visibility: {
    type: String,
    enum: ['private', 'shared', 'public'],
    default: 'private'
  },
  
  contestCode: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 10
  },
  
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed'],
    default: 'upcoming'
  },
  
  startTime: {
    type: Date
  },
  
  endTime: {
    type: Date
  }
}, {
  timestamps: true
});
```

### Fields:
- **title:** Contest name (3-100 chars)
- **owner:** Reference to User who created contest
- **questionIds:** Array of Question ObjectIds (randomly selected from collection)
- **durationInMin:** Contest duration in minutes (1-720)
- **visibility:** Access level ('private', 'shared', 'public')
- **contestCode:** Unique code for joining contest
- **status:** Current contest state
- **startTime/endTime:** Contest timing (set when contest becomes active)

### Indexes:
1. **Index:** `{ owner: 1 }` - Find contests by owner
2. **Unique Index:** `{ contestCode: 1 }` - Ensure unique contest codes
3. **Index:** `{ status: 1 }` - Filter by contest status

---

## ContestParticipant Model Schema

```javascript
const contestParticipantSchema = new mongoose.Schema({
  contestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contest',
    required: true
  },
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  status: {
    type: String,
    enum: ['joined', 'completed'],
    default: 'joined'
  },
  
  joinedAt: {
    type: Date,
    default: Date.now
  },
  
  completedAt: {
    type: Date
  },
  
  score: {
    type: Number,
    default: 0
  },
  
  timeSpent: {
    type: Number,
    default: 0
  },
  
  rank: {
    type: Number
  }
}, {
  timestamps: true
});
```

### Fields:
- **contestId:** Reference to Contest
- **userId:** Reference to User participant
- **status:** Participation status
- **joinedAt:** When user joined contest
- **completedAt:** When user finished contest
- **score:** Total points earned
- **timeSpent:** Total time spent (seconds)
- **rank:** Final ranking in contest

### Indexes:
1. **Compound Index (unique):** `{ contestId: 1, userId: 1 }` - One participation per user per contest
2. **Index:** `{ contestId: 1, score: -1 }` - Rank participants by score
3. **Index:** `{ userId: 1 }` - Find all contests for a user

---

## Follow Model Schema

```javascript
const followSchema = new mongoose.Schema({
  followerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  followingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  followedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});
```

### Fields:
- **followerId:** User who is following
- **followingId:** User being followed
- **followedAt:** When follow relationship was created

### Indexes:
1. **Compound Index (unique):** `{ followerId: 1, followingId: 1 }` - Prevent duplicate follows
2. **Index:** `{ followerId: 1 }` - Find who user is following
3. **Index:** `{ followingId: 1 }` - Find user's followers

---

## QuestionAttempt Model Schema

```javascript
const questionAttemptSchema = new mongoose.Schema({
  contestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contest',
    required: true
  },
  
  participantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ContestParticipant',
    required: true
  },
  
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  
  status: {
    type: String,
    enum: ['solved', 'unsolved'],
    required: true
  },
  
  timeSpent: {
    type: Number,
    required: true,
    min: 0
  },
  
  attemptedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});
```

### Fields:
- **contestId:** Reference to Contest
- **participantId:** Reference to ContestParticipant
- **questionId:** Reference to Question
- **status:** Whether question was solved
- **timeSpent:** Time spent on question (seconds)
- **attemptedAt:** When attempt was recorded

### Indexes:
1. **Compound Index:** `{ contestId: 1, participantId: 1 }` - Group attempts by contest and participant
2. **Index:** `{ questionId: 1 }` - Find attempts for specific question
