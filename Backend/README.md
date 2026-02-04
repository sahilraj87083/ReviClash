# ReviCode Backend Server

A production-grade Node.js/Express backend for ReviCode - a competitive programming practice and community platform.

**Author:** Sahil Singh  
**Status:** In Active Development  
**Last Updated:** February 4, 2026  
**API Version:** v1

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Authentication & Authorization](#authentication--authorization)
- [File Upload System](#file-upload-system)
- [Real-time Features](#real-time-features)
- [Error Handling](#error-handling)
- [Middleware](#middleware)
- [Running the Server](#running-the-server)
- [Testing](#testing)
- [Known Issues & TODO](#known-issues--todo)
- [Contributing](#contributing)

---

## Project Overview

ReviCode Backend is a comprehensive RESTful API server built with Express.js and MongoDB that provides:

- **User Management:** Registration, authentication, email verification, password reset
- **Question Management:** CRUD operations for competitive programming questions with tagging
- **Collections:** Organize questions into custom collections with ordering
- **Contests:** Create, manage, and participate in programming contests
- **Social Features:** Follow system, private messaging, user leaderboards
- **User Statistics:** Track performance metrics, solve counts by difficulty/platform/topic
- **Real-time Chat:** WebSocket support for contest and private messaging
- **File Uploads:** Avatar and cover image management with Cloudinary
- **Email Service:** Email verification, password reset, notifications

---

## Features

### Authentication & User System
✅ Email/password registration and login  
✅ Email verification with token links  
✅ Password reset via email  
✅ JWT-based authentication with refresh tokens  
✅ Password hashing with bcrypt  
✅ httpOnly secure cookies  
✅ Profile management (username, full name, bio)  
✅ Avatar and cover image uploads  

### Question Management
✅ Add competitive programming questions  
✅ Filter by difficulty, platform, topics  
✅ Full-text search on titles and tags  
✅ Soft delete support (data preservation)  
✅ Duplicate detection per user  
✅ Pagination with configurable limits  
✅ Normalize URLs for matching  

### Collections
✅ Create and manage question collections  
✅ Public/private visibility control  
✅ Reorder questions within collection  
✅ Bulk add/remove questions  
✅ Question count tracking  
✅ Public collection access  

### Contests
✅ Create contests from collections  
✅ Multiple visibility modes (private, shared, public)  
✅ Unique contest codes for sharing  
✅ Join contests via code or ID  
✅ Automatic question randomization  
✅ Contest status tracking (upcoming, active, completed)  
✅ Question attempt recording  
✅ Time tracking per question  

### Contest Participation
✅ Join contests  
✅ Real-time contest timer  
✅ Submit answers and get scores  
✅ Detailed ranking by score and time  
✅ Per-question performance tracking  
✅ Contest completion status  

### Social Features
✅ Follow/unfollow users  
✅ Follower/following lists  
✅ Private messaging between users  
✅ Message pagination for load more  
✅ Message read status tracking  
✅ Real-time typing indicators  

### User Statistics & Leaderboards
✅ Personal statistics dashboard  
✅ Topic-wise performance breakdown  
✅ Contest history with scores  
✅ Global leaderboard  
✅ User rankings  
✅ Percentile calculations  

### Real-time Features
✅ WebSocket for live contests with lobby and live rooms  
✅ Contest chat messaging with phase tracking (lobby/live)  
✅ Private message updates with inbox synchronization  
✅ User-specific socket rooms for real-time inbox updates (immediately updates sidebar)  
✅ Typing indicators in private chat  
✅ Message delivery confirmation  
✅ Message read status tracking  
✅ Automatic message seen notifications  
✅ Multi-room architecture for contest presence and chat  

---

## Tech Stack

### Core
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js v5.x
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Security:** Bcrypt (10 salt rounds)
- **Real-time:** Socket.io v4.x

### API & Validation
- **Validation:** express-validator
- **HTTP Client:** Axios
- **Cookie Parsing:** cookie-parser
- **CORS:** express cors
- **Environment:** dotenv

### File Management
- **File Upload:** Multer
- **Cloud Storage:** Cloudinary
- **Temp Storage:** Local filesystem

### Scheduling & Email
- **Task Scheduler:** node-cron
- **Email Service:** Nodemailer
- **Message Queuing:** Redis (planned)

### Development
- **Package Manager:** npm
- **Auto-reload:** nodemon
- **Code Formatting:** Prettier
- **Version Control:** Git

---

## Quick Start

### Prerequisites
- Node.js v18 or higher
- MongoDB local or MongoDB Atlas connection string
- Cloudinary account (for image uploads)
- SMTP service (Gmail, SendGrid, etc.) for email
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sahilraj87083/ReviCode.git
   cd ReviCode/Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file with required variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The server will start at `http://localhost:5000` with auto-reload enabled via nodemon.

5. **Server is ready when you see:**
   ```
   Server running on port 5000
   Connected to MongoDB
   ```

---

## Project Structure

```
Backend/
├── src/
│   ├── app.js                          # Express app configuration & middleware setup
│   ├── server.js                       # Server entry point & port listener
│   ├── constants.js                    # Application-wide constants
│   │
│   ├── controllers/                    # Business logic handlers (11 files)
│   │   ├── user.controller.js          # User auth, profile, email, password
│   │   ├── question.controller.js      # Question CRUD & filtering
│   │   ├── collection.controller.js    # Collection management
│   │   ├── collectionQuestion.controller.js  # Collection-Question operations
│   │   ├── contest.controller.js       # Contest creation & retrieval
│   │   ├── contestParticipant.controller.js  # Join, submit, ranking
│   │   ├── contestMessage.controller.js      # Contest chat messages
│   │   ├── privateMessage.controller.js      # Private messaging
│   │   ├── follow.controller.js        # Follow/unfollow operations
│   │   ├── healthCheck.controller.js   # Server health endpoint
│   │   └── userStats.controller.js     # Statistics & leaderboards
│   │
│   ├── routes/                         # API route definitions (11 files)
│   │   ├── user.routes.js              # /api/v1/users
│   │   ├── question.routes.js          # /api/v1/question
│   │   ├── collection.routes.js        # /api/v1/collections
│   │   ├── collectionQuestion.routes.js      # /api/v1/collectionQuestions
│   │   ├── contest.routes.js           # /api/v1/contests
│   │   ├── contestParticipant.routes.js      # /api/v1/contestParticipants
│   │   ├── contestMessage.routes.js    # /api/v1/contestMessages
│   │   ├── privateMessage.routes.js    # /api/v1/privateMessages
│   │   ├── follow.routes.js            # /api/v1/follow
│   │   ├── healthCheck.routes.js       # /api/v1/health
│   │   └── userStats.routes.js         # /api/v1/userStats
│   │
│   ├── models/                         # Mongoose schemas (12 models)
│   │   ├── user.model.js               # User authentication & profile
│   │   ├── question.model.js           # Competitive programming questions
│   │   ├── collection.model.js         # Question collections
│   │   ├── collectionQuestion.model.js # Collection-question associations
│   │   ├── contest.model.js            # Contest definitions
│   │   ├── contestParticipant.model.js # Participation & scoring
│   │   ├── contestMessage.model.js     # Chat messages in contests
│   │   ├── privateMessage.model.js     # Private messages between users
│   │   ├── follow.model.js             # Follow relationships
│   │   ├── userStats.model.js          # User statistics tracking
│   │   ├── questionAttempt.model.js    # Individual question attempts
│   │   ├── notification.model.js       # User notifications
│   │   └── subscription.model.js       # User subscriptions (future)
│   │
│   ├── middlewares/                    # Express middleware (3 files)
│   │   ├── auth.middleware.js          # JWT verification (verifyJWT)
│   │   ├── validate.middleware.js      # Express-validator error handling
│   │   └── multer.middleware.js        # File upload handling (image only)
│   │
│   ├── services/                       # Reusable business logic (7 files)
│   │   ├── user.services.js            # User operations
│   │   ├── question.services.js        # Question operations
│   │   ├── collection.services.js      # Collection operations
│   │   ├── collectionQuestion.service.js     # Collection-question ops
│   │   ├── contest.services.js         # Contest operations
│   │   ├── contestAutoSubmit.service.js      # Auto-submit on timeout
│   │   ├── email.service.js            # Email sending
│   │   ├── follow.services.js          # Follow operations
│   │   ├── privateMessage.service.js   # Messaging operations
│   │   └── contestParticipant.services.js    # Participant tracking
│   │
│   ├── sockets/                        # WebSocket handlers (5 files)
│   │   ├── index.js                    # Socket.io initialization
│   │   ├── contest.socket.js           # Contest room management
│   │   ├── private.socket.js           # Private messaging events
│   │   ├── registerSocketHandlers.js   # Event handler registration
│   │   └── socket.auth.js              # Socket authentication
│   │
│   ├── jobs/                           # Scheduled jobs (1 file)
│   │   └── contest.jobs.js             # Auto-submit on contest end
│   │
│   ├── utils/                          # Utility functions & classes
│   │   ├── ApiResponse.utils.js        # Response wrapper class
│   │   ├── ApiError.utils.js           # Custom error class
│   │   ├── AsyncHandler.utils.js       # Try-catch wrapper
│   │   ├── cloudinary.utils.js         # Image upload & deletion
│   │   ├── hashToken.utils.js          # SHA-256 token hashing
│   │   └── ... (other utilities)
│   │
│   ├── db/
│   │   └── connectDB.js                # MongoDB connection logic
│   │
│   └── constants.js                    # Application constants
│
├── public/
│   └── temp/                           # Temporary file storage for uploads
│
├── .env                                # Environment variables (not in repo)
├── .gitignore                          # Git ignore patterns
├── .env.example                        # Example environment variables
├── package.json                        # Dependencies & scripts
├── package-lock.json                   # Locked dependency versions
├── API_DOCUMENTATION.md                # Complete API reference
├── QUICK_REFERENCE.md                  # Quick endpoint summary
├── INDEX.md                            # Project index
└── README.md                           # This file
```

---

## Environment Variables

Create a `.env` file in the `Backend/` directory with the following configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/revicode?retryWrites=true&w=majority

# JWT Configuration
ACCESS_TOKEN_SECRET=your_very_secret_access_token_string_at_least_32_chars_long
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_very_secret_refresh_token_string_at_least_32_chars_long
REFRESH_TOKEN_EXPIRY=7d

# Cloudinary Configuration (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Frontend Configuration
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

# Email Configuration (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password
SMTP_FROM=noreply@revicode.com

# File Upload Configuration
MAX_FILE_SIZE=10485760  # 10MB in bytes
UPLOAD_TEMP_DIR=./public/temp

# Redis Configuration (Future)
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=debug
```

### Environment Variable Details

| Variable | Description | Example |
|----------|-------------|---------|
| `ACCESS_TOKEN_EXPIRY` | JWT expiry time | `15m`, `30m`, `1h` |
| `REFRESH_TOKEN_EXPIRY` | Refresh token expiry | `7d`, `14d`, `30d` |
| `TOKEN_SECRET` | Must be cryptographically secure | min 32 characters |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard | `xyz123` |
| `SMTP_PASS` | Gmail: use App Password, not account password | - |
| `MAX_FILE_SIZE` | Maximum upload file size in bytes | `10485760` (10MB) |

---

## API Documentation

### Complete API Reference

The complete API documentation with all endpoints, request/response formats, and examples is available in:

📖 **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Comprehensive 62+ endpoint documentation

### Quick Endpoint Summary

**Total:** 62+ endpoints across 11 route modules

#### Authentication & User Management (15 endpoints)

| # | Method | Endpoint | Description | Auth |
|---|--------|----------|-------------|------|
| 1 | POST | `/users/register` | Create account | ❌ |
| 2 | POST | `/users/login` | Authenticate user | ❌ |
| 3 | POST | `/users/logout` | End session | ✅ |
| 4 | POST | `/users/refresh-token` | Get new access token | ❌ |
| 5 | GET | `/users/current-user` | Get authenticated user | ✅ |
| 6 | GET | `/users/c/:username` | Get public profile | ❌ |
| 7 | POST | `/users/change-password` | Change password | ✅ |
| 8 | PATCH | `/users/update-username` | Update username | ✅ |
| 9 | PATCH | `/users/update-account` | Update profile | ✅ |
| 10 | PATCH | `/users/update-avatar` | Upload avatar | ✅ |
| 11 | PATCH | `/users/update-coverImage` | Upload cover image | ✅ |
| 12 | GET | `/users/verify-email` | Verify email with token | ❌ |
| 13 | POST | `/users/resend-verification` | Resend verification email | ✅ |
| 14 | POST | `/users/forgot-password` | Request password reset | ❌ |
| 15 | POST | `/users/reset-password` | Reset password with token | ❌ |

#### Question Management (5 endpoints)

| # | Method | Endpoint | Description | Auth |
|---|--------|----------|-------------|------|
| 16 | POST | `/question` | Create question | ✅ |
| 17 | GET | `/question` | List questions with filters | ✅ |
| 18 | GET | `/question/:questionId` | Get specific question | ✅ |
| 19 | PATCH | `/question/:questionId` | Update question | ✅ |
| 20 | DELETE | `/question/:questionId` | Delete question | ✅ |

#### Collection Management (7 endpoints)

| # | Method | Endpoint | Description | Auth |
|---|--------|----------|-------------|------|
| 21 | POST | `/collections` | Create collection | ✅ |
| 22 | GET | `/collections` | List user's collections | ✅ |
| 23 | GET | `/collections/:collectionId` | Get collection details | ✅ |
| 24 | GET | `/collections/:collectionId/questions` | Get collection's questions | ✅ |
| 25 | GET | `/collections/:collectionId/questions/public` | Get public collection | ❌ |
| 26 | PATCH | `/collections/:collectionId` | Update collection | ✅ |
| 27 | DELETE | `/collections/:collectionId` | Delete collection | ✅ |

#### Collection Questions (6 endpoints)

| # | Method | Endpoint | Description | Auth |
|---|--------|----------|-------------|------|
| 28 | POST | `/collectionQuestions/:collectionId/questions` | Add question to collection | ✅ |
| 29 | POST | `/collectionQuestions/:collectionId/questions/bulk` | Bulk add questions | ✅ |
| 30 | PATCH | `/collectionQuestions/:collectionId/questions/:questionId/order` | Reorder question | ✅ |
| 31 | DELETE | `/collectionQuestions/:collectionId/questions/:questionId` | Remove question | ✅ |
| 32 | DELETE | `/collectionQuestions/:collectionId/questions/bulk` | Bulk remove questions | ✅ |
| 33 | DELETE | `/collectionQuestions/:collectionId/questions` | Remove all questions | ✅ |

#### Contest Management (8 endpoints)

| # | Method | Endpoint | Description | Auth |
|---|--------|----------|-------------|------|
| 34 | POST | `/contests` | Create contest | ✅ |
| 35 | POST | `/contests/:contestId/start` | Start contest | ✅ |
| 36 | GET | `/contests/active` | Get active contests | ✅ |
| 37 | GET | `/contests/created` | Get created contests | ✅ |
| 38 | GET | `/contests/joined` | Get joined contests | ✅ |
| 39 | GET | `/contests/all` | Get all public/shared contests | ✅ |
| 40 | GET | `/contests/:contestId` | Get contest details | ✅ |
| 41 | GET | `/contests/:contestId/leaderboard` | Get contest leaderboard | ✅ |

#### Contest Participants (8 endpoints)

| # | Method | Endpoint | Description | Auth |
|---|--------|----------|-------------|------|
| 42 | POST | `/contestParticipants/:identifier/join` | Join contest | ✅ |
| 43 | DELETE | `/contestParticipants/:contestId/leave` | Leave contest | ✅ |
| 44 | POST | `/contestParticipants/:contestId/start` | Enter live contest | ✅ |
| 45 | GET | `/contestParticipants/:contestId/time` | Get remaining time | ✅ |
| 46 | POST | `/contestParticipants/:contestId/submit` | Submit contest | ✅ |
| 47 | GET | `/contestParticipants/:contestId/rank` | Get user's rank | ✅ |
| 48 | GET | `/contestParticipants/:contestId/state` | Get participation state | ✅ |
| 49 | GET | `/contestParticipants/:contestId/participants` | Get all participants | ✅ |

#### Contest Messages (1 endpoint)

| # | Method | Endpoint | Description | Auth |
|---|--------|----------|-------------|------|
| 50 | GET | `/contestMessages/:contestId` | Get contest chat messages | ✅ |

#### Private Messages (2 endpoints)

| # | Method | Endpoint | Description | Auth |
|---|--------|----------|-------------|------|
| 51 | GET | `/privateMessages/inbox` | Get conversation list | ✅ |
| 52 | GET | `/privateMessages/inbox/:otherUserId` | Get messages with user | ✅ |

#### Follow System (5 endpoints)

| # | Method | Endpoint | Description | Auth |
|---|--------|----------|-------------|------|
| 53 | POST | `/follow/:targetUserId` | Follow user | ✅ |
| 54 | DELETE | `/follow/:targetUserId` | Unfollow user | ✅ |
| 55 | GET | `/follow/followers/:userId` | Get followers | ✅ |
| 56 | GET | `/follow/following/:userId` | Get following list | ✅ |
| 57 | GET | `/follow/status/:targetUserId` | Get follow status | ✅ |

#### User Statistics (4 endpoints)

| # | Method | Endpoint | Description | Auth |
|---|--------|----------|-------------|------|
| 58 | GET | `/userStats/leaderboard` | Get global leaderboard | ✅ |
| 59 | GET | `/userStats/:userId` | Get user statistics | ✅ |
| 60 | GET | `/userStats/:userId/topics` | Get topic-wise stats | ✅ |
| 61 | GET | `/userStats/:userId/history` | Get contest history | ✅ |

#### Health Check (1 endpoint)

| # | Method | Endpoint | Description | Auth |
|---|--------|----------|-------------|------|
| 62 | GET | `/health` | Server health status | ❌ |

**Legend:** ✅ = Authentication Required | ❌ = Public

---

## Database Models

### User Model
Authentication and profile management
```javascript
{
  username: String (unique, 3-30 chars),
  email: String (unique),
  password: String (bcrypt hashed),
  fullName: String,
  role: String (student|admin),
  avatar: { public_id, url },
  coverImage: { public_id, url },
  bio: String,
  followersCount: Number,
  followingCount: Number,
  isVerified: Boolean,
  emailVerified: Boolean,
  emailVerificationToken: String,
  emailVerificationExpiry: Date,
  passwordResetToken: String,
  passwordResetExpiry: Date,
  refreshToken: String (hashed),
  isActive: Boolean,
  timestamps
}
```

### Question Model
Competitive programming questions
```javascript
{
  ownerId: ObjectId (ref: User),
  title: String,
  platform: String (LeetCode|GFG|Codeforces|Other),
  problemUrlOriginal: String,
  problemUrlNormalized: String (unique per user),
  difficulty: String (easy|medium|hard),
  topics: [String],
  isDeleted: Boolean,
  timestamps
}
```

### Collection Model
Question collections/lists
```javascript
{
  ownerId: ObjectId (ref: User),
  name: String (2-100 chars),
  nameLower: String (unique per user),
  description: String,
  isPublic: Boolean,
  questionsCount: Number,
  timestamps
}
```

### Contest Model
Programming contests
```javascript
{
  title: String,
  owner: ObjectId (ref: User),
  collectionId: ObjectId (ref: Collection),
  questionIds: [ObjectId],
  durationInMin: Number,
  visibility: String (private|shared|public),
  contestCode: String (unique),
  status: String (upcoming|active|completed),
  startTime: Date,
  endTime: Date,
  timestamps
}
```

### ContestParticipant Model
Participation and scoring
```javascript
{
  contestId: ObjectId,
  userId: ObjectId,
  status: String (joined|completed),
  joinedAt: Date,
  completedAt: Date,
  score: Number,
  timeSpent: Number,
  rank: Number,
  timestamps
}
```

### Follow Model
Follow relationships
```javascript
{
  followerId: ObjectId,
  followingId: ObjectId,
  followedAt: Date,
  timestamps
}
```

### PrivateMessage Model
Direct messaging
```javascript
{
  senderId: ObjectId,
  receiverId: ObjectId,
  message: String,
  status: String (sent|read),
  conversationId: String,
  timestamps
}
```

### CollectionQuestion Model
Question-collection associations
```javascript
{
  collectionId: ObjectId,
  questionId: ObjectId,
  order: Number,
  addedAt: Date
}
```

### ContestMessage Model
Chat in contests
```javascript
{
  contestId: ObjectId,
  senderId: ObjectId,
  message: String,
  timestamps
}
```

### UserStats Model
Performance tracking
```javascript
{
  userId: ObjectId (unique),
  totalQuestionsAdded: Number,
  totalContestsParticipated: Number,
  totalContestsWon: Number,
  averageScore: Number,
  topicsCount: Map,
  timestamps
}
```

---

## Authentication & Authorization

### JWT Flow

1. **Registration/Login:**
   - User submits credentials
   - Server validates and creates user
   - Generates access + refresh tokens
   - Access token in response body
   - Refresh token in httpOnly cookie

2. **Token Usage:**
   - Client sends access token in Authorization header or uses cookie
   - Middleware verifies JWT signature
   - Token payload attached to `req.user`

3. **Token Refresh:**
   - When access token expires (15m)
   - Client calls `/refresh-token` endpoint
   - Server validates refresh token
   - Returns new access token

4. **Logout:**
   - Client calls `/logout` endpoint
   - Server clears refresh token from database
   - Cookies cleared on client

### Authorization Levels

- **Public:** No authentication required (register, login, public profiles)
- **Authenticated:** User must be logged in (most endpoints)
- **Owner:** User must be resource owner (edit/delete own resources)
- **Admin:** Admin-only operations (planned)

---

## File Upload System

### Avatar & Cover Image Upload

**Supported Formats:** JPG, PNG, GIF, WebP  
**Max Size:** 10MB (configurable)  
**Storage:** Cloudinary CDN

**Process:**
1. User uploads file via multipart form-data
2. Multer validates and stores temporarily
3. File uploaded to Cloudinary
4. Cloudinary URL + public_id stored in database
5. Temp file deleted
6. Old file deleted from Cloudinary (if exists)

**Endpoints:**
- `PATCH /users/update-avatar`
- `PATCH /users/update-coverImage`

---

## Real-time Features

### WebSocket Events (Socket.io)

#### Contest Events (Multi-room Architecture)

**Lobby Room (Pre-contest Presence):**
- `contest:lobby:join` - Join contest lobby (receive participant list)
- `contest:lobby:leave` - Leave contest lobby

**Live Contest Room (During Contest):**
- `contest:live:join` - Enter live contest with timer
- `contest:live:leave` - Exit live contest room

**Chat Room (Shared during Contest):**
- `contest:chat:join` - Join contest chat room
- `contest:chat:leave` - Leave contest chat room
- `contest:message` - Send contest chat message (saved with phase: "lobby" or "live")
- `contest:receive` - Receive contest message (emitted to all in chat room)
- `contest:system` - Send system message (e.g., "user joined", "contest ended")

#### Private Messaging Events (User-specific Rooms)

**Connection Rooms:**
- User automatically joins personal room: `socket.userId` (for inbox updates)
- `private:join` - Join 1-on-1 chat room with specific user
- `private:leave` - Leave 1-on-1 chat room

**Message Events:**
- `private:send` - Send private message
- `private:receive` - Receive private message in chat room
- `private:delivered` - Message sent confirmation (message ID)
- `private:typing` - User is typing indicator
- `private:seen` - Message marked as read

**Real-time Inbox Updates:**
- `inbox:update` - Emitted to both users' personal rooms when a message is sent
  - Updates sidebar/inbox in real-time for both participants
  - Payload: `{ senderId, receiverId, message, createdAt, sender }`

#### Authentication
- Socket verified using JWT token from handshake
- `req.user` available in socket context
- Socket joins user's personal room (`socket.userId`) upon connection

### Real-time Architecture Patterns

#### Contest Multi-room Pattern
```
Contest ID: "contest_123"
├── contest:contest_123:lobby    (Lobby presence - before contest starts)
├── contest:contest_123:live     (Live contest presence - during contest)
└── contest:contest_123:chat     (Shared chat room for messages)
```
This architecture allows:
- Separate tracking of participants by status (lobby vs. active)
- Broadcast messages to only active participants
- Phase-aware message filtering (lobby or live messages)

#### Private Messaging User-room Pattern
```
User ID: "user_456"
├── user_456                     (Personal inbox room - inbox updates only)
└── conversation_user456_user789 (1-on-1 chat room with specific user)
```
This architecture enables:
- Real-time inbox sidebar updates without opening chat
- Direct message notifications in personal room
- Efficient message filtering by conversation

#### Message Flow Example: Private Message
```
1. User A joins personal room on connection: socket.userId = "A"
2. User A opens chat with User B, joins conversation room: "conv_A_B"
3. User A types message and emits: private:send
4. Backend:
   - Saves message to database
   - Emits private:delivered to User A (confirmation)
   - Emits private:receive to conversation room (appears in chat)
   - Emits inbox:update to User A & B personal rooms (sidebar updates)
5. User B sees:
   - Message appears in active chat conversation room
   - Sidebar updates via personal room inbox:update event
```

---

## Error Handling

### Custom Error Class

```javascript
new ApiError(statusCode, message, errors = {})
```

### Error Response Format

```json
{
  "errorCode": 400,
  "message": "Validation failed",
  "data": null,
  "success": false
}
```

### Common Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | GET request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Not authorized for action |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate/already exists |
| 500 | Server Error | Unexpected error |

---

## Middleware

### Built-in Middleware

1. **auth.middleware.js** - JWT Verification
   - Verifies access token
   - Attaches user to `req.user`
   - Used by `verifyJWT` middleware

2. **validate.middleware.js** - Input Validation
   - Uses express-validator results
   - Returns formatted error messages
   - Applied via `validate` middleware

3. **multer.middleware.js** - File Upload
   - Validates file type (images only)
   - Stores temporarily
   - Used by `upload.single(fieldName)`

### Third-party Middleware (in app.js)

- `express.json()` - Parse JSON
- `express.urlencoded()` - Parse forms
- `cors()` - CORS support
- `cookieParser()` - Parse cookies
- Custom error handler

---

## Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

Starts nodemon which watches for file changes and auto-restarts server.

### Production Mode

```bash
npm start
```

Runs server without auto-reload (for production deployment).

### Environment

Set `NODE_ENV` environment variable:
- `development` - Detailed errors, auto-reload
- `production` - Error logging, optimizations

---

## Testing

### Manual Testing with cURL

**Register:**
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

**Login:**
```bash
curl -X POST http://localhost:5000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Create Collection:**
```bash
curl -X POST http://localhost:5000/api/v1/collections \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "DSA Problems",
    "description": "Data Structures and Algorithms"
  }'
```

### Testing Tools

- **Postman** - API testing and documentation
- **Thunder Client** - VS Code REST client
- **cURL** - Command-line HTTP client
- **Jest** - Unit testing (setup needed)
- **Supertest** - HTTP assertion library

---

## Project Statistics

- **Total Lines of Code:** ~3000+
- **Routes:** 11 modules
- **Controllers:** 11 modules
- **Models:** 12 schemas
- **Services:** 7+ service files
- **Middleware:** 3 custom middleware
- **API Endpoints:** 62+
- **Database Collections:** 12

---

## Known Issues & TODO

### Current Issues
- [ ] Rate limiting not implemented
- [ ] Caching layer (Redis) not integrated
- [ ] Email notifications pending setup
- [ ] Admin dashboard endpoints not implemented
- [ ] Some error messages need standardization

### Future Enhancements
- [ ] Redis caching for leaderboards
- [ ] Email-based notifications
- [ ] Admin user management panel
- [ ] Question difficulty auto-suggestion
- [ ] AI-powered question recommendations
- [ ] Subscription plans
- [ ] Video solution integration
- [ ] Discussion forums
- [ ] Code snippet sharing
- [ ] Performance analytics dashboard
- [ ] Contest auto-scheduling
- [ ] Plagiarism detection

### Planned Features
- [ ] GraphQL API alongside REST
- [ ] Message encryption
- [ ] Two-factor authentication
- [ ] OAuth integration (Google, GitHub)
- [ ] Advanced search with Elasticsearch
- [ ] Microservices architecture

---

## Contributing

### Setting Up Development Environment

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Create Pull Request

### Code Style
- Use Prettier for formatting (run before commit)
- Follow Express best practices
- Use meaningful variable names
- Add JSDoc comments for complex functions
- Keep functions focused and reusable

---

## License

ISC License - See LICENSE file for details

---

## Support

For issues, questions, or suggestions:
- Create GitHub Issue
- Email: sahil@revicode.com
- Discord: [Community Link]

---

## Changelog

### v1.0.0 (February 4, 2026)
- ✅ Complete REST API with 62+ endpoints
- ✅ User authentication with JWT
- ✅ Question management with filtering
- ✅ Collections and organization
- ✅ Contest system with leaderboards
- ✅ Social features (follow, messaging)
- ✅ User statistics and rankings
- ✅ Real-time WebSocket support
- ✅ File uploads with Cloudinary
- ✅ Email verification and password reset

---

**Maintained by:** Sahil Singh  
**Last Updated:** February 4, 2026  
**Status:** Production Ready ✅
