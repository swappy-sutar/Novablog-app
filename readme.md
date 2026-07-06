# NovaBlog — Full-Stack Blogging Platform

NovaBlog is a modern, high-performance blogging platform built with a decoupled architecture. It features a React/Vite frontend and a NestJS backend utilizing Prisma ORM with PostgreSQL, Redis for caching/rate-limiting, and BullMQ for background email queues.

## Production Live Links
* **Frontend Site**: [https://novablog.space](https://novablog.space) (Hosted on Vercel)
---

## Tech Stack

### Frontend
- React 19 & Vite
- React Router & Axios
- Tailwind CSS & Framer Motion
- TipTap Editor (Rich text markdown editor)
- Ant Design icons & React Hot Toast

### Backend
- NestJS (TypeScript)
- Prisma ORM & PostgreSQL (Neon Serverless Postgres)
- Redis Cache & BullMQ (Upstash Serverless Redis)
- JWT Authentication (Access + Refresh tokens)
- Multer & AWS S3 (for image uploads)
- Resend Email Service

---

## Features

- **User Authentication**: Secure JWT login/registration with access & refresh tokens, password hashing, and cookie parsing.
- **Rich Text Editor**: Distraction-free writing experience using TipTap.
- **Blog Management**: CRUD operations supporting `DRAFT`, `PUBLISHED`, and `ARCHIVED` statuses, category tagging, and search pagination.
- **Social Interactivity**: Threaded comment section, likes, like counts, and follower tracking.
- **Personal Bookmarks**: Save posts for later reading.
- **Rate-Limiting (Throttler)**: Redis-backed API rate limiting to prevent spam and brute-force attacks.
- **Background Tasks**: Offloading email jobs to BullMQ workers for maximum performance.

---

## Project Structure

```text
Blog-App/
  backend/
    prisma/                 Prisma schema and database migrations
    src/
      common/               Shared decorators, filters, interceptors, and helpers
      config/               Module configurations (Prisma, Redis, S3, Resend, BullMQ)
      jobs/                 Background BullMQ email processors
      modules/              Feature modules (Auth, Blog, Bookmark, Comments, Like, Admin, Notifications)
      providers/            Mail and S3 integration providers
      templates/            HTML Email templates
  frontend/
    src/
      components/           Shared UI, Auth, and Rich-Text Editor components
      layouts/              Page wrappers
      lib/                  Axios HTTP Client
      pages/                Application routes
```

---

## Environment Variables Configuration

Create a `.env` file in the **root** folder:

```env
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgrespassword
POSTGRES_DB=blog_app
POSTGRES_PORT=5432

# Redis Configuration (Local vs Upstash)
# Local: Leave REDIS_URL commented out.
# Production: Set REDIS_URL to your secure Upstash URI
# REDIS_URL=rediss://default:password@endpoint.upstash.io:6379
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=

# Backend Configuration
PORT=3000
DATABASE_URL=postgresql://postgres:postgrespassword@db:5432/blog_app?schema=public
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
FRONTEND_URL=https://novablog.space

# AWS Configuration (Image uploads)
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_BUCKET_NAME=your_s3_bucket_name

# Resend Email Configuration
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=Blog App <hello@novablog.space>
```

---

## Installation & Running Locally

1. **Install Dependencies**:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

2. **Generate Database Schema**:
   In the `backend` folder:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Start Local Docker Environment**:
   ```bash
   # In the root directory, starts backend, postgres db, and redis
   docker compose up -d
   ```

4. **Start local Frontend dev server**:
   ```bash
   cd frontend
   npm run dev
   ```
   *Frontend live locally at:* `http://localhost:5173`

---

## Production Deployment Guide

### Backend (Render & Neon/Upstash)
1. Set the **Root Directory** on Render to `backend`.
2. Choose the **Docker** runtime environment.
3. Configure the **Docker Build Context Directory** as `.` and the **Dockerfile Path** as `Dockerfile`.
4. Configure the **Health Check Path** to `/health`.
5. Under **Environment Variables**, define your secrets (such as `REDIS_URL`, `DATABASE_URL` pointing to Neon, `RESEND_API_KEY`, etc.).

### Frontend (Vercel)
1. Set the build environment as **Vite** / **React**.
2. Link your custom domain `novablog.space` in the settings tab.
3. Define the environment variables in Vercel:
   * `VITE_API_URL`: `https://your-backend-api.onrender.com/api/v1`
   * `VITE_SOCKET_URL`: `https://your-backend-api.onrender.com`

---

## API Overview

### System Status
* `GET /health` — Check server status (Bypasses global prefix).

### Auth (`/api/v1/auth`)
* `POST /auth/register` — Create new user
* `POST /auth/login` — Sign in and receive JWT tokens
* `GET /auth/profile` — Get profile info
* `PATCH /auth/profile` — Update profile info
* `POST /auth/upload-profile` — Upload avatar (sends to AWS S3)
* `POST /auth/refresh-token` — Regenerate access token
* `POST /auth/logout` — Logout

### Blog (`/api/v1/blog`)
* `POST /blog/create-blog` — Create blog post
* `GET /blog/get-all-blogs` — List blogs (with pagination and filters)
* `GET /blog/my-blogs` — Current user's blogs
* `GET /blog/get-blog/:id` — Details of a specific blog
* `PATCH /blog/update-blog/:id` — Edit a blog post
* `DELETE /blog/delete-blog/:id` — Delete a blog post

### Comments (`/api/v1/comments`)
* `POST /comments/create-comment/:blogId` — Add comment
* `GET /comments/get-comment/:blogId` — List blog comments
* `PATCH /comments/update-comment/:commentId` — Edit comment
* `DELETE /comments/delete-comment/:commentId` — Delete comment

### Likes & Bookmarks
* `POST /likes/toggle/:blogId` — Like/Unlike blog post
* `GET /likes/get-count/:blogId` — Like count
* `POST /bookmarks/toggle/:blogId` — Add/Remove bookmark
* `GET /bookmarks/my-bookmarks` — List bookmarks

---

## License
This project is licensed under the terms of the `UNLICENSED` license.
