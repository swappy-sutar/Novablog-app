# NovaBlog Backend (NestJS API)

This is the progressive NestJS backend API powering the NovaBlog platform. It includes JWT authentication, PostgreSQL persistence via Prisma ORM, Redis-backed caching and rate limiting, BullMQ background job queues, and AWS S3 file upload integration.

## Live Service Details
* **Base Endpoint**: `https://novablog-backend-vrgz.onrender.com/api/v1`
* **Health Check**: `https://novablog-backend-vrgz.onrender.com/health` (bypasses CORS & prefixes)

---

## Tech Stack
* **Framework**: NestJS (v11.x)
* **Language**: TypeScript
* **Database & ORM**: PostgreSQL with Prisma ORM
* **Cache & Message Broker**: Redis (`ioredis`) & BullMQ
* **File Uploads**: Multer with AWS S3 SDK integration
* **Mailing**: Resend SDK
* **Security & Guards**: Helmet, cookie-parser, class-validator, and rate limiting (NestJS Throttler with Redis Storage)

---

## Folder Structure
```text
backend/
  prisma/                 Database models, migrations, and seeds
  src/
    common/               Interceptors, filters, custom decorators, and pipeline guards
    config/               Prisma client, Redis client, S3, Resend, and BullMQ module declarations
    jobs/                 BullMQ job queues (e.g. background email senders)
    modules/              Business modules (Auth, Blog, Bookmark, Comments, Like, Admin, Notifications)
    providers/            External provider integrations (Resend, AWS S3)
    templates/            Email templates
```

---

## Installation & Environment Variables

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Environment variables
Create a `.env` file inside the `backend` folder:
```env
PORT=3000

# PostgreSQL URL (e.g. Neon serverless DB or local docker DB)
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/blog_app?schema=public"

# Redis Config
# For local: leave REDIS_URL empty and use REDIS_HOST=localhost
# For Upstash/Production: set REDIS_URL to your secure rediss:// connection string
# REDIS_URL="rediss://default:your_upstash_token@your-endpoint.upstash.io:6379"
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Secrets
JWT_ACCESS_SECRET="access_secret"
JWT_REFRESH_SECRET="refresh_secret"
ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"

# Production Domain link (frontend redirect origin)
FRONTEND_URL="https://novablog.space"

# AWS S3 Storage Config
AWS_REGION="ap-south-1"
AWS_ACCESS_KEY_ID="your_aws_access_key"
AWS_SECRET_ACCESS_KEY="your_aws_secret"
AWS_BUCKET_NAME="your_s3_bucket"

# Resend Mail credentials
RESEND_API_KEY="your_resend_api_key"
EMAIL_FROM="Blog App <hello@novablog.space>"
```

---

## Prisma Commands

Generate the Prisma client (must run after schema changes):
```bash
npx prisma generate
```

Push schema updates directly to the database (for prototyping):
```bash
npx prisma db push
```

Run database migrations:
```bash
npx prisma migrate dev --name init
```

---

## Running the API

### Running locally
Make sure your PostgreSQL and Redis instances are running, then start the server:
```bash
# Start in watch mode (ideal for development)
npm run start:dev

# Start in production mode (runs compiled JS)
npm run start:prod
```

### Running with Docker Compose
Starts the database, cache, and NestJS server together:
```bash
docker compose up --build
```
The Docker setup exposes the NestJS API at `http://localhost:3000`.

---

## Production Deployment to Render
To deploy your backend Docker container on Render:
1. Create a **Web Service** pointing to your Github repo.
2. Select runtime: **Docker**.
3. Set **Root Directory** to `backend`.
4. Set **Docker Build Context Directory** to `.` and **Dockerfile Path** to `Dockerfile`.
5. Configure the **Health Check Path** to `/health`.
6. Define your variables (like `REDIS_URL`, `DATABASE_URL`, and keys) under **Environment Variables** in Render's dashboard.
