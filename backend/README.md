# Blog App Backend

NestJS backend API for a blog platform with authentication, blog posts, comments, likes, bookmarks, Redis-backed services, email jobs, S3 image uploads, and Prisma/PostgreSQL persistence.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** NestJS
- **Database:** PostgreSQL with Prisma ORM
- **Cache / queues:** Redis, BullMQ
- **Authentication:** JWT access and refresh tokens
- **File uploads:** Multer + AWS S3
- **Email:** Resend
- **Validation:** class-validator, class-transformer, Joi
- **Testing:** Jest

## Project Structure

```text
backend/
  docker/                 Dockerfile and Docker ignore rules
  prisma/                 Prisma schema and database models
  src/
    common/               Shared decorators, filters, helpers, interceptors, utils
    config/               Prisma, Redis, BullMQ, S3, Resend, and upload config
    jobs/                 Background job processors and services
    modules/
      auth/               Register, login, JWT profile, refresh token, logout
      blog/               Create, read, update, delete blog posts
      bookmark/           Toggle and list user bookmarks
      comments/           Create, list, update, delete comments
      like/               Toggle likes and get like counts
    providers/            Provider integrations
    templates/            Email templates
```

## Prerequisites

- Node.js 20+
- npm
- PostgreSQL database
- Redis server
- AWS S3 bucket credentials for image uploads
- Resend API key for email support

## Environment Variables

Create a `.env` file in the `backend` directory.

```env
PORT=8000

DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

JWT_ACCESS_SECRET="your-access-token-secret"
JWT_REFRESH_SECRET="your-refresh-token-secret"
ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"

REDIS_HOST="localhost"
REDIS_PORT=6379

AWS_REGION="ap-south-1"
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_BUCKET_NAME="your-s3-bucket"

RESEND_API_KEY="your-resend-api-key"
```

The app validates the core runtime variables on startup using Joi.

## Installation

```bash
npm install
```

Generate the Prisma client:

```bash
npx prisma generate
```

Apply database migrations or push the schema:

```bash
npx prisma migrate dev
```

or:

```bash
npx prisma db push
```

## Running Locally

Start the development server:

```bash
npm run start:dev
```

The API uses the global prefix:

```text
http://localhost:8000/api/v1
```

If `PORT` is set in `.env`, use that port instead.

## Running With Docker

The Docker Compose setup starts the backend and Redis.

```bash
docker compose up --build
```

By default, the compose file maps:

```text
http://localhost:3000
```

Make sure your `.env` is available in the `backend` directory before starting the containers.

## Available Scripts

```bash
npm run build        # Build the NestJS app
npm run start        # Start the app
npm run start:dev    # Start in watch mode
npm run start:debug  # Start in debug watch mode
npm run start:prod   # Run compiled dist output
npm run lint         # Run ESLint with auto-fix
npm run format       # Format source and test files
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:cov     # Run tests with coverage
npm run test:e2e     # Run end-to-end tests
```

## API Overview

All routes are prefixed with `/api/v1`.

### Auth

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | No | Register a new user |
| POST | `/auth/login` | No | Login and receive tokens |
| GET | `/auth/profile` | Yes | Get current user profile |
| POST | `/auth/upload-profile` | Yes | Upload profile image |
| POST | `/auth/refresh-token` | No | Refresh access token |
| POST | `/auth/logout` | Yes | Logout current user |

### Blog

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/blog/create-blog` | Yes | Create a blog post with optional thumbnail |
| GET | `/blog/get-all-blogs` | No | List blogs with pagination and search |
| GET | `/blog/get-blog/:id` | No | Get a blog by ID |
| PATCH | `/blog/update-blog/:id` | Yes | Update own blog post |
| DELETE | `/blog/delete-blog/:id` | Yes | Delete own blog post |

### Comments

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/comments/create-comment/:blogId` | Yes | Add a comment to a blog |
| GET | `/comments/get-comment/:blogId` | Yes | List comments for a blog |
| PATCH | `/comments/update-comment/:commentId` | Yes | Update own comment |
| DELETE | `/comments/delete-comment/:commentId` | Yes | Delete own comment |

### Likes

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/likes/toggle/:blogId` | Yes | Like or unlike a blog |
| GET | `/likes/get-count/:blogId` | No | Get like count for a blog |

### Bookmarks

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/bookmarks/toggle/:blogId` | Yes | Bookmark or remove bookmark |
| GET | `/bookmarks/my-bookmarks` | Yes | List current user's bookmarks |

## Common Request Examples

Register:

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "Jane",
    "lastname": "Doe",
    "username": "janedoe",
    "email": "jane@example.com",
    "password": "password123"
  }'
```

Login:

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "password123"
  }'
```

Create a blog:

```bash
curl -X POST http://localhost:8000/api/v1/blog/create-blog \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "title=My First Blog" \
  -F "content=This is the blog content." \
  -F "status=PUBLISHED" \
  -F "thumbnail=@/path/to/image.png"
```

## Database Models

The Prisma schema includes:

- `User`
- `Blog`
- `Comment`
- `Like`
- `Bookmark`
- `Category`
- `Tag`
- `BlogTag`
- `Follow`
- `Notification`
- `BlogAnalytics`

Main enums:

- `Role`: `USER`, `ADMIN`
- `BlogStatus`: `DRAFT`, `PUBLISHED`, `ARCHIVED`
- `NotificationType`: `LIKE`, `COMMENT`, `FOLLOW`, `BLOG_PUBLISHED`

## Development Notes

- Global API prefix is configured in `src/main.ts` as `/api/v1`.
- Responses are wrapped by a global response interceptor.
- HTTP exceptions are handled by a global exception filter.
- Request bodies are validated globally with whitelist and transform enabled.
- Protected routes use `JwtAuthGuard`.
- Blog thumbnails and profile images are uploaded through S3.

## License

This project is currently marked as `UNLICENSED`.
