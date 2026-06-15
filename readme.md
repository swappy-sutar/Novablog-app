# Blog App

A full-stack blogging platform with a React/Vite frontend and a NestJS backend. The project includes authentication, profile management, blog publishing, comments, likes, bookmarks, image uploads, Redis-backed services, email jobs, and PostgreSQL persistence through Prisma.

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Axios
- Tailwind CSS
- Ant Design icons
- TipTap editor
- Framer Motion
- React Hot Toast

### Backend

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- BullMQ
- JWT authentication
- Multer
- AWS S3
- Resend
- Jest

## Features

- User registration and login
- JWT access and refresh token flow
- Protected routes
- Profile viewing, editing, and avatar upload
- Blog creation with rich text editing
- Blog thumbnail upload
- Draft, published, and archived blog states
- Blog listing, search, pagination, and detail pages
- Current-user blog management
- Comments on blog posts
- Blog likes and like counts
- User bookmarks
- Redis caching support
- Background email job support
- Centralized response and exception handling

## Project Structure

```text
Blog-App/
  backend/
    prisma/                 Prisma schema and database models
    src/
      common/               Shared decorators, filters, helpers, interceptors, utils
      config/               Prisma, Redis, BullMQ, S3, Resend, upload config
      jobs/                 Background email jobs
      modules/
        auth/               Register, login, profile, refresh token, logout
        blog/               Blog CRUD and queries
        bookmark/           Bookmark toggle and listing
        comments/           Comment CRUD
        like/               Like toggle and counts
      providers/            Provider integrations
      templates/            Email templates
  frontend/
    public/                 Static assets
    src/
      components/           UI, layout, auth, home, blog, and editor components
      layouts/              Page layouts
      lib/                  API client
      pages/                App pages
```

## Prerequisites

- Node.js 20+
- npm
- PostgreSQL database
- Redis server
- AWS S3 bucket credentials if using image uploads
- Resend API key if using email features

## Environment Variables

Create `backend/.env`:

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

Create `frontend/.env`:

```env
VITE_API_URL="http://localhost:8000/api/v1"
```

The frontend API client falls back to `http://localhost:3000/api/v1` when `VITE_API_URL` is not set. If you run the backend locally with `npm run start:dev`, use port `8000` unless you changed `PORT`.

## Installation

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## Database Setup

From the `backend` directory, generate the Prisma client:

```bash
npx prisma generate
```

Apply migrations:

```bash
npx prisma migrate dev
```

If you are prototyping without migrations, you can push the schema:

```bash
npx prisma db push
```

## Running Locally

Start Redis. You can use the Docker Compose file in the backend directory:

```bash
cd backend
docker compose up -d redis
```

Start the backend:

```bash
cd backend
npm run start:dev
```

The API is available at:

```text
http://localhost:8000/api/v1
```

Start the frontend:

```bash
cd frontend
npm run dev
```

The Vite app is usually available at:

```text
http://localhost:5173
```

## Docker

The backend Docker Compose setup includes the NestJS app and Redis:

```bash
cd backend
docker compose up --build
```

The compose file maps the backend container to:

```text
http://localhost:3000
```

Set `VITE_API_URL=http://localhost:3000/api/v1` in `frontend/.env` when using the Docker backend mapping.

## Available Scripts

Backend scripts:

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

Frontend scripts:

```bash
npm run dev      # Start Vite dev server
npm run build    # Build production assets
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## API Overview

All backend routes are prefixed with `/api/v1`.

### Auth

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | No | Register a new user |
| POST | `/auth/login` | No | Login and receive tokens |
| GET | `/auth/profile` | Yes | Get current user profile |
| PATCH | `/auth/profile` | Yes | Update current user profile |
| POST | `/auth/upload-profile` | Yes | Upload profile image |
| POST | `/auth/refresh-token` | No | Refresh access token |
| POST | `/auth/logout` | Yes | Logout current user |

### Blog

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/blog/create-blog` | Yes | Create a blog post with optional thumbnail |
| GET | `/blog/get-all-blogs` | No | List blogs with pagination and filters |
| GET | `/blog/my-blogs` | Yes | List the current user's blogs |
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

## Authentication

Protected routes require a bearer token:

```text
Authorization: Bearer YOUR_ACCESS_TOKEN
```

The frontend stores the access token and refresh token in `localStorage`, attaches the access token to requests, and attempts token refresh after authenticated requests return `401`.

## Example Requests

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

Create a blog with a thumbnail:

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

## Development Notes

- The backend global API prefix is configured in `backend/src/main.ts` as `/api/v1`.
- Request validation uses NestJS `ValidationPipe` with whitelist and transform enabled.
- Responses are wrapped by a global response interceptor.
- HTTP exceptions are handled by a global exception filter.
- Protected routes use `JwtAuthGuard`.
- Multipart uploads are handled with the `ImageUpload` decorator and sent to S3.
- The frontend removes the default JSON content type for `FormData` requests so multipart boundaries are set correctly.

## License

This project is currently marked as `UNLICENSED`.
