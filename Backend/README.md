# ReviCode Backend Server

A production-grade Node.js/Express backend for ReviCode - a competitive programming and code review platform.

**Author:** Sahil Singh  
**Status:** In Active Development  
**Last Updated:** January 10, 2026

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Authentication & Authorization](#authentication--authorization)
- [File Upload System](#file-upload-system)
- [Error Handling](#error-handling)
- [Middleware](#middleware)
- [Running the Server](#running-the-server)
- [Testing](#testing)
- [Known Issues & TODO](#known-issues--todo)
- [Contributing](#contributing)

---

## Project Overview

ReviCode Backend is a RESTful API server built with Express.js and MongoDB that provides:

- **User Management:** Registration, authentication, profile management
- **Question Management:** CRUD operations for competitive programming questions
- **Collections:** Users can organize questions into collections
- **Contests:** Create and manage programming contests
- **Social Features:** Follow system, notifications, private messaging
- **User Statistics:** Track performance metrics and progress
- **File Uploads:** Avatar and cover image management with Cloudinary

---

## Tech Stack

### Core
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js v4.x
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** Bcrypt

### Supporting Libraries
- **Validation:** express-validator
- **File Upload:** Multer
- **Cloud Storage:** Cloudinary
- **Environment:** dotenv
- **CORS:** express cors
- **Cookie Parsing:** cookie-parser

### Development
- **Package Manager:** npm
- **Version Control:** Git

---

## Quick Start

### Prerequisites
- Node.js v18 or higher
- MongoDB local or Atlas connection string
- Cloudinary account (for image uploads)
- `.env` file with required variables

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ReviCode/Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

The server will start at `http://localhost:5000` with auto-reload enabled.

---

## Project Structure

```
Backend/
├── src/
│   ├── app.js                    # Express app configuration
│   ├── server.js                 # Server entry point
│   ├── constants.js              # Application constants
│   │
│   ├── controllers/              # Business logic handlers
│   │   ├── user.controller.js
│   │   └── question.controller.js
│   │
│   ├── routes/                   # API route definitions
│   │   ├── user.routes.js
│   │   └── question.routes.js
│   │
│   ├── models/                   # Mongoose schemas
│   │   ├── user.model.js
│   │   ├── question.model.js
│   │   ├── collection.model.js
│   │   ├── contest.model.js
│   │   ├── follow.model.js
│   │   ├── notification.model.js
│   │   ├── userStats.model.js
│   │   └── ... (other models)
│   │
│   ├── middlewares/              # Express middleware
│   │   ├── auth.middleware.js    # JWT verification
│   │   └── multer.middleware.js  # File upload
│   │
│   ├── services/                 # Reusable business logic
│   │   ├── user.services.js
│   │   └── question.services.js
│   │
│   ├── utils/                    # Utility functions & classes
│   │   ├── ApiResponse.utils.js
│   │   ├── ApiError.utils.js
│   │   ├── AsyncHandler.utils.js
│   │   ├── cloudinary.utils.js
│   │   └── hashToken.utils.js
│   │
│   └── db/
│       └── connectDB.js          # MongoDB connection
│
├── public/
│   └── temp/                     # Temporary file storage
│
├── .env                          # Environment variables (not in repo)
├── .gitignore
├── package.json
├── package-lock.json
└── README.md (this file)
```

---

## Environment Variables

Create a `.env` file in the `Backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/revicode?retryWrites=true&w=majority

# JWT Secrets & Expiry
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_min_32_chars
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_min_32_chars
REFRESH_TOKEN_EXPIRY=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=10485760  # 10MB in bytes
UPLOAD_TEMP_DIR=./public/temp
```

### Important Notes:
- `ACCESS_TOKEN_EXPIRY` should be short (15m, 30m, 1h)
- `REFRESH_TOKEN_EXPIRY` should be long (7d, 14d, 30d)
- Both token secrets should be cryptographically secure strings
- Keep `.env` file in `.gitignore` - never commit!

---

## API Documentation

### Complete API Reference

A comprehensive API documentation file is available at:
- **`API_DOCUMENTATION.md`** - Detailed endpoint documentation with request/response examples

### Quick Endpoint Summary

#### User Endpoints (10 endpoints)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/users/register` | ❌ | Create new user account |
| POST | `/api/v1/users/login` | ❌ | Authenticate user |
| POST | `/api/v1/users/logout` | ✅ | Invalidate session |
| POST | `/api/v1/users/refresh-token` | ❌ | Get new access token |
| GET | `/api/v1/users/current-user` | ✅ | Get authenticated user |
| POST | `/api/v1/users/change-password` | ✅ | Change user password |
| PATCH | `/api/v1/users/update-account` | ✅ | Update profile details |
| PATCH | `/api/v1/users/update-avatar` | ✅ | Upload new avatar |
| PATCH | `/api/v1/users/update-coverImage` | ✅ | Upload new cover image |
| GET | `/api/v1/users/c/:username` | ❌ | Get user profile |

#### Question Endpoints (5 endpoints)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/question` | ✅ | Create new question |
| GET | `/api/v1/question` | ✅ | Get all user's questions (with filters) |
| GET | `/api/v1/question/:questionId` | ✅ | Get specific question |
| PATCH | `/api/v1/question/:questionId` | ✅ | Update question details |
| DELETE | `/api/v1/question/:questionId` | ✅ | Soft delete question |

#### Collection Endpoints (6 endpoints)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/collections` | ✅ | Create new collection |
| GET | `/api/v1/collections` | ✅ | Get user's collections |
| GET | `/api/v1/collections/:collectionId` | ✅ | Get specific collection |
| PATCH | `/api/v1/collections/:collectionId` | ✅ | Update collection details |
| DELETE | `/api/v1/collections/:collectionId` | ✅ | Delete collection |
| GET | `/api/v1/collections/:collectionId/questions` | ✅ | Get collection's questions |

#### Collection Questions Endpoints (6 endpoints)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/collectionQuestions/:collectionId/questions` | ✅ | Add question to collection |
| DELETE | `/api/v1/collectionQuestions/:collectionId/questions/:questionId` | ✅ | Remove question from collection |
| PATCH | `/api/v1/collectionQuestions/:collectionId/questions/:questionId/order` | ✅ | Reorder question in collection |
| POST | `/api/v1/collectionQuestions/:collectionId/questions/bulk` | ✅ | Bulk add questions |
| DELETE | `/api/v1/collectionQuestions/:collectionId/questions/bulk` | ✅ | Bulk remove questions |
| DELETE | `/api/v1/collectionQuestions/:collectionId/questions` | ✅ | Remove all questions |

#### Contest Endpoints (6 endpoints)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/contest` | ✅ | Create new contest |
| GET | `/api/v1/contest/:contestId` | ✅ | Get contest details |
| POST | `/api/v1/contest/:id/join` | ✅ | Join contest |
| POST | `/api/v1/contest/:contestId/submit` | ✅ | Submit contest answers |
| GET | `/api/v1/contest/:contestId/leaderboard` | ✅ | Get contest leaderboard |
| GET | `/api/v1/contest/:contestId/me` | ✅ | Get my contest rank |

#### Follow Endpoints (5 endpoints)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/follow/:targetUserId` | ✅ | Follow user |
| DELETE | `/api/v1/follow/:targetUserId` | ✅ | Unfollow user |
| GET | `/api/v1/follow/followers/:userId` | ✅ | Get user's followers |
| GET | `/api/v1/follow/following/:userId` | ✅ | Get users followed by user |
| GET | `/api/v1/follow/status/:targetUserId` | ✅ | Get follow status |

#### User Statistics Endpoints (6 endpoints)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/userStats/leaderboard` | ✅ | Get global leaderboard |
| GET | `/api/v1/userStats/:userId` | ✅ | Get user statistics |
| GET | `/api/v1/userStats/:userId/topics` | ✅ | Get user topic performance |
| GET | `/api/v1/userStats/:userId/history` | ✅ | Get user contest history |
| GET | `/api/v1/userStats/:userId/contests/created` | ✅ | Get contests created by user |
| GET | `/api/v1/userStats/:userId/contests/joined` | ✅ | Get contests joined by user |

---

## Database Models

### 1. User Model
- User authentication and profile information
- Avatar and cover image references (Cloudinary)
- Social stats (followers, following)
- Verification and account status

### 2. Question Model
- Competitive programming questions
- Title, platform, difficulty level
- Problem URL (original and normalized)
- Tags/topics for categorization
- Soft delete support
- Duplicate detection (same URL per user)
- Full-text search capability

### 3. Collection Model
- User-created question collections
- Name uniqueness per user (case-insensitive)
- Public/private visibility settings
- Automatic question count tracking
- Owner relationship with users

### 4. CollectionQuestion Model
- Many-to-many relationship between collections and questions
- Custom ordering within collections
- Duplicate prevention (unique collection-question pairs)
- Timestamp tracking for additions

### 5. Contest Model
- Contest creation from user collections
- Time-limited competitive sessions
- Visibility controls (private/shared/public)
- Unique contest codes for joining
- Status tracking (upcoming/active/completed)

### 6. ContestParticipant Model
- Contest participation tracking
- Score and ranking calculation
- Time spent monitoring
- Completion status management

### 7. Follow Model
- User follow relationships
- Bidirectional follower/following counts
- Duplicate prevention
- Social network features

### 8. QuestionAttempt Model
- Individual question attempts in contests
- Solve status tracking
- Time spent per question
- Performance analytics

### 9. UserStats Model (Aggregated)
- Performance metrics across contests
- Topic-wise statistics
- Ranking and leaderboard data
- Historical contest participation

### 10. Additional Models
- `Notification` - User notifications and alerts
- `PrivateMessage` - Direct messaging system
- `ContestMessage` - Contest communication
- `Subscription` - Premium features tracking

---

## Authentication & Authorization

### JWT-Based Authentication

The backend uses JWT for stateless authentication with the following flow:

#### Login Flow:
1. User provides email and password
2. Server validates credentials
3. Server generates `accessToken` (short-lived) and `refreshToken` (long-lived)
4. Refresh token is hashed and stored in MongoDB
5. Both tokens sent as httpOnly cookies

#### Token Refresh Flow:
1. Client sends refresh token in cookie
2. Server validates and decodes refresh token
3. Server checks hashed token in database (revocation check)
4. New access token and refresh token generated
5. Old tokens cleared on error

#### Protected Routes:
- Middleware: `verifyJWT` in `auth.middleware.js`
- Validates access token
- Extracts and attaches user info to `req.user`
- Returns 401 if unauthorized

### Security Features:
✅ Passwords hashed with bcrypt (10 salt rounds)  
✅ Tokens stored as httpOnly cookies (XSS protection)  
✅ Secure flag on cookies (HTTPS only in production)  
✅ Refresh token rotation implemented  
✅ Session revocation on logout  
✅ Password change revokes all sessions  

---

## File Upload System

### Avatar & Cover Image Upload Flow:

```
User Request (multipart/form-data)
    ↓
Multer (local temp storage) → /public/temp/
    ↓
Cloudinary Upload
    ↓
Database Update (store public_id & URL)
    ↓
Delete Old Image from Cloudinary
    ↓
Delete Temp File from Server
```

### Key Features:
- **Multer Configuration:** Limits file size, accepts image files only
- **Cloudinary Integration:** Auto-optimization, secure URLs, CDN delivery
- **Rollback Mechanism:** If DB update fails, uploaded file is deleted
- **Cleanup:** Temporary files always deleted after upload
- **Error Handling:** Graceful errors with descriptive messages

### Supported Image Types:
- JPEG (image/jpeg)
- PNG (image/png)
- WebP (image/webp)
- GIF (image/gif)
- And other common image formats

---

## Error Handling

### Centralized Error Handling

All errors follow the `ApiError` class structure:

```javascript
{
  errorCode: 400-500,
  message: "Human-readable error message",
  data: null,
  success: false
}
```

### Error Classes:

#### `ApiError` Class (`utils/ApiError.utils.js`)
```javascript
throw new ApiError(
  statusCode,           // HTTP status code
  message,              // Error message
  errors,               // Optional: array of detailed errors
  stack                 // Optional: custom stack trace
)
```

#### `ApiResponse` Class (`utils/ApiResponse.utils.js`)
```javascript
new ApiResponse(
  errorCode,            // HTTP status code
  message,              // Response message
  data                  // Response data
)
// success field auto-calculated: errorCode < 400
```

### Error Handling Middleware:
- Global try-catch with `asyncHandler` wrapper
- Validation errors from express-validator
- Database errors caught and formatted
- File upload errors with cleanup

### Common HTTP Status Codes:
| Code | Meaning | Example |
|------|---------|---------|
| 400 | Bad Request | Invalid input, validation failed |
| 401 | Unauthorized | Missing/invalid auth token |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate email/username |
| 500 | Server Error | Unexpected server error |

---

## Middleware

### Built-in Middleware (in `app.js`):

```javascript
// Body & URL parsing
app.use(express.json({ limit: LIMIT }))
app.use(express.urlencoded({ extended: true, limit: LIMIT }))

// Cookie parsing
app.use(cookieParser())

// CORS configuration
app.use(cors({ origin: true, credentials: true }))
```

### Custom Middleware:

#### 1. `verifyJWT` (auth.middleware.js)
- **Purpose:** Validate JWT access token
- **Usage:** Protects routes requiring authentication
- **Returns:** Attaches `req.user` with user data

```javascript
router.route('/logout').post(verifyJWT, logoutUser)
```

#### 2. `upload` (multer.middleware.js)
- **Purpose:** Handle file uploads
- **Usage:** For avatar/coverImage updates
- **Returns:** Attaches `req.file` with file details

```javascript
router.route('/update-avatar').patch(verifyJWT, upload.single('avatar'), updateUserAvatar)
```

#### 3. `validationResult` (express-validator)
- **Purpose:** Validate request body/params
- **Usage:** Input validation before business logic

```javascript
[
  body('email').isEmail().withMessage('Invalid Email'),
  body('password').isLength({ min: 6 }).withMessage('Min 6 chars')
]
```

---

## Running the Server

### Development Mode (with Auto-Reload):
```bash
npm run dev
```

Uses Nodemon for automatic restart on file changes.

### Production Mode:
```bash
npm start
```

Runs Node.js directly without watch mode.

### Debug Mode:
```bash
npm run debug
```

Starts with Node debugger enabled.

### Check Server Health:
```bash
curl http://localhost:5000/
# Response: "ReviCode is Ready...!!! So are you???"
```

---

## Testing

### Manual Testing with cURL:

#### Register User
```bash
curl -X POST http://localhost:5000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "Test@1234"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234"
  }'
```

#### Get Current User
```bash
curl -X GET http://localhost:5000/api/v1/users/current-user \
  -b cookies.txt
```

#### Update Avatar
```bash
curl -X PATCH http://localhost:5000/api/v1/users/update-avatar \
  -b cookies.txt \
  -F "avatar=@/path/to/image.jpg"
```

### Postman/Insomnia:
1. Import `API_DOCUMENTATION.md` or create manual collection
2. Set up environment variables for `BASE_URL`, `accessToken`, etc.
3. Test each endpoint with provided examples

### Automated Testing:
- **Framework:** (TODO - suggest Jest or Mocha)
- **Coverage:** (TODO - add unit & integration tests)

---

## Known Issues & TODO

### Current Implementation Status:

#### ✅ Completed
- User registration with validation
- JWT-based authentication
- Password hashing with bcrypt
- User profile management
- Avatar/cover image upload with Cloudinary
- Social stats aggregation
- User profile retrieval with relationships
- Error handling and validation

#### 🔄 In Progress
- Question endpoints (partially implemented)
- Contest management
- Messaging system
- Notification system

#### ❌ TODO (Planned)
- [ ] Email verification
- [ ] Password reset flow
- [ ] Two-factor authentication
- [ ] Admin dashboard APIs
- [ ] Analytics and reporting
- [ ] Rate limiting
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Automated test suite
- [ ] Redis caching layer
- [ ] WebSocket support for real-time features
- [ ] API versioning (v2, v3)

#### ⚠️ Potential Issues

1. **Session Revocation:**
   - Current: Refresh token checked on each refresh
   - TODO: Implement token blacklist for immediate logout

2. **Password Reset:**
   - Missing: Email-based password reset
   - TODO: Implement `forgot-password` and `reset-password` endpoints

3. **Email Verification:**
   - Not implemented: Email verification on signup
   - TODO: Add `verify-email` endpoint

4. **Scalability:**
   - TODO: Add Redis for session management
   - TODO: Implement caching layer
   - TODO: Consider database indexing optimization

5. **Rate Limiting:**
   - Missing: API rate limiting
   - TODO: Add express-rate-limit middleware

6. **Validation:**
   - Some edge cases in file upload validation
   - TODO: Add file size validation
   - TODO: Add image dimension validation

---

## Development Guidelines

### Code Style:
- Use ES6+ syntax (arrow functions, const/let, destructuring)
- Follow consistent indentation (2 spaces)
- Use async/await over promises
- Wrap async functions with `asyncHandler` for error handling

### Error Messages:
- Be descriptive but concise
- Use consistent error message format
- Include context when useful (e.g., field name for validation)

### API Design:
- Use appropriate HTTP methods (GET, POST, PATCH, DELETE)
- Use consistent URL structure (`/api/v1/resource`)
- Return appropriate status codes
- Include meaningful error responses

### Comments:
- Comment complex logic
- Document unclear decisions
- Add TODO comments for future improvements

---

## Contributing

### Setting Up Development Environment:
1. Fork the repository
2. Create feature branch: `git checkout -b feature/feature-name`
3. Follow code guidelines above
4. Test thoroughly before committing
5. Create descriptive commit messages: `feat(user): add email verification`
6. Push to branch and create Pull Request

### Commit Message Format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: feat, fix, docs, style, refactor, test, chore

---

## Deployment

### Production Checklist:
- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS/SSL
- [ ] Set secure CORS origin (not `true`)
- [ ] Use environment-specific `.env`
- [ ] Set up MongoDB Atlas with IP whitelist
- [ ] Configure Cloudinary rate limits
- [ ] Enable Morgan logging in production
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure database backups
- [ ] Use PM2 or similar for process management
- [ ] Set up monitoring and alerts

---

## Support & Documentation

### Files to Review:
- `API_DOCUMENTATION.md` - Complete API reference
- `src/models/` - Database schema definitions
- `src/controllers/` - Business logic examples
- `src/routes/` - Route definitions and validation

### External Resources:
- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Cloudinary API](https://cloudinary.com/documentation)
- [Bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)

---

## License

See LICENSE file in project root.

---

## Contact

For questions or issues, please create a GitHub issue or contact the development team.

**Last Updated:** January 10, 2026  
**Maintained By:** ReviCode Development Team
