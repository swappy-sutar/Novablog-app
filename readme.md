<div align="center">

<img src="https://img.shields.io/badge/NovaBlog-Share%20Ideas.%20Inspire%20World.-6366f1?style=for-the-badge&labelColor=0d0d12" />

<br /><br />

<p>
  <a href="https://novablog.space"><img src="https://img.shields.io/badge/Live%20Site-novablog.space-22c55e?style=flat-square&logo=vercel&logoColor=white" /></a>
  <a href="https://github.com/swappy-sutar/Novablog-app"><img src="https://img.shields.io/github/last-commit/swappy-sutar/Novablog-app?style=flat-square&logo=github&color=6366f1" /></a>
  <a href="https://hub.docker.com/r/swapsutar/novablog-backend"><img src="https://img.shields.io/badge/Docker%20Hub-swapsutar-2496ed?style=flat-square&logo=docker&logoColor=white" /></a>
  <img src="https://img.shields.io/badge/TypeScript-NestJS-e0234e?style=flat-square&logo=nestjs" />
  <img src="https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react" />
</p>

<h1>NovaBlog</h1>
<p><strong>A modern, full-stack blogging platform for developers and tech enthusiasts.</strong><br/>
Rich text writing · Real-time notifications · Gamified reader badges · Admin analytics</p>

</div>

---

## 📑 Table of Contents

- [🌐 Live Links](#-live-links)
- [✨ Feature Overview](#-feature-overview)
- [🛠 Tech Stack](#-tech-stack)
- [🏗 Architecture](#-architecture)
- [📁 Project Structure](#-project-structure)
- [⚙️ Environment Variables](#️-environment-variables)
- [🚀 Local Development](#-local-development)
- [🐳 Docker Setup](#-docker-setup)
- [☁️ Production Deployment](#️-production-deployment)
- [🔌 API Reference](#-api-reference)
- [🎨 Frontend Routes](#-frontend-routes)
- [🛡 Admin Panel](#-admin-panel)
- [📊 Database Schema](#-database-schema)
- [🤝 Contributing](#-contributing)

---

## 🌐 Live Links

| Service | URL | Host |
|---------|-----|------|
| 🌍 Frontend | [https://novablog.space](https://novablog.space) | Vercel |
| ⚙️ Backend API | `https://novablog-app.onrender.com/api/v1` | Render |
| ❤️ Health Check | `https://novablog-app.onrender.com/health` | Render |
| 🐳 Backend Image | `docker pull swapsutar/novablog-backend` | Docker Hub |
| 🐳 Frontend Image | `docker pull swapsutar/novablog-frontend` | Docker Hub |

---

## ✨ Feature Overview

### 👤 Authentication & Security
- JWT **Access + Refresh Token** rotation with silent renewal
- **Account lockout** after failed login attempts (brute-force protection)
- **Two-Factor Authentication (2FA)** via TOTP (Google Authenticator compatible)
- Secure **password reset** via email link (Resend)
- **Email verification** on registration
- Redis-backed **rate limiting** on all API endpoints

### ✍️ Writing & Content
- **TipTap** rich-text editor with headings, code blocks, quotes, images & media embeds
- Blog lifecycle: `DRAFT` → `PUBLISHED` → `ARCHIVED`
- **Category tagging**, search, and pagination
- Thumbnail banner upload via **AWS S3**
- **Reading time** estimation on every post

### 🤝 Social & Community
- **Like / Unlike** posts with real-time count
- **Threaded comments** with edit and delete
- **Follow / Unfollow** authors
- **Bookmarks** — save articles for later
- **Real-time notifications** via WebSocket (Socket.IO)

### 🏆 Gamification
- **6-tier badge system** (Seedling → Contributor → Influencer → Rising Writer → Legend → Established)
- Badges auto-unlock based on total article reads
- Displayed on public author profiles

### 💌 Platform
- **Newsletter subscription** and management
- Animated **testimonials / reviews** marquee on homepage
- **Public profile** pages with tech stack, followers, badges
- **Cookie**, **Privacy**, and **Terms** policy pages

### 🛠 Admin Panel
- **Dashboard** with real-time stats (users, posts, revenue metrics)
- **Analytics** tab with charts and traffic insights
- **Content moderation** queue (flag, approve, reject)
- **User management** (suspend, activate, role change)
- **Reviews management** (edit name, text, rating, visibility; delete)
- **System health** monitor with live WebSocket log streaming
- **Settings** panel

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 19 + Vite | Core UI framework & build tool |
| React Router v6 | Client-side routing |
| Tailwind CSS v4 | Utility-first styling |
| Framer Motion | Animations & transitions |
| TipTap | Rich-text blog editor |
| Socket.IO Client | Real-time notifications |
| Axios | HTTP client with interceptors |
| React Hot Toast | Toast notification system |
| Lucide React | Icon library |

### Backend
| Technology | Purpose |
|-----------|---------|
| NestJS (TypeScript) | Server framework |
| Prisma ORM | Database ORM & migrations |
| PostgreSQL (Neon) | Primary data store |
| Redis (Upstash) | Caching, rate-limiting, session data |
| BullMQ | Background job queues (emails) |
| Passport + JWT | Authentication strategy |
| Multer | File upload handling |
| AWS S3 SDK | Image/media storage |
| Resend | Transactional email service |
| Socket.IO | WebSocket real-time events |
| Helmet + Throttler | Security middleware |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Client Browser                  │
│              React 19 + Vite (Tailwind CSS)          │
└─────────────────┬───────────────────────────────────┘
                  │ HTTPS / WSS
┌─────────────────▼───────────────────────────────────┐
│               NestJS REST API + WebSocket            │
│    JWT Auth · Rate Limiting · Validation Pipes       │
├──────────┬──────────────┬────────────┬──────────────┤
│  Prisma  │   BullMQ     │  Socket.IO │  AWS S3      │
│  + Neon  │  + Upstash   │  Gateway   │  (Uploads)   │
│ Postgres │    Redis     │            │              │
└──────────┴──────────────┴────────────┴──────────────┘
```

**Request lifecycle:**
1. Client sends request with `Authorization: Bearer <accessToken>`
2. `JwtAuthGuard` validates the token
3. Business logic executed in the **Service** layer
4. Database operations via **Prisma**
5. Heavy tasks (emails) dispatched to **BullMQ** worker queue
6. Real-time events published via **Socket.IO** gateway

---

## 📁 Project Structure

```
Blog-App/
├── .env                        # Root env (shared Docker config)
├── .env.example                # Template for environment setup
├── docker-compose.yml          # Full stack Docker orchestration
├── readme.md                   # This file
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Database models
│   │   └── migrations/         # Prisma migration history
│   ├── src/
│   │   ├── common/             # Decorators, filters, interceptors
│   │   ├── config/             # Module configs (Redis, S3, BullMQ)
│   │   ├── jobs/               # BullMQ email job processors
│   │   ├── modules/
│   │   │   ├── admin/          # Admin dashboard APIs
│   │   │   ├── auth/           # Login, register, 2FA, password reset
│   │   │   ├── blog/           # CRUD, search, pagination
│   │   │   ├── bookmark/       # Save/unsave articles
│   │   │   ├── comments/       # Threaded comments
│   │   │   ├── like/           # Like/unlike
│   │   │   ├── newsletter/     # Subscription management
│   │   │   ├── notifications/  # WebSocket notifications
│   │   │   └── review/         # Platform reviews (public CRUD)
│   │   ├── providers/          # Mail & S3 providers
│   │   └── templates/          # HTML email templates
│   ├── Dockerfile
│   └── package.json
│
└── frontend/
    ├── public/                 # Static assets (badge images, etc.)
    ├── src/
    │   ├── components/
    │   │   ├── home/           # Landing page sections
    │   │   ├── layout/         # Navbar, Footer, Sidebar
    │   │   ├── ui/             # Buttons, Skeletons, Modals
    │   │   └── editor/         # TipTap rich-text editor
    │   ├── lib/
    │   │   ├── api.js          # Axios API wrappers (authAPI, blogAPI, adminAPI…)
    │   │   └── socket.js       # Socket.IO client
    │   ├── pages/              # Route-level page components
    │   └── main.jsx
    ├── Dockerfile
    ├── nginx.conf              # Nginx config for production container
    └── package.json
```

---

## ⚙️ Environment Variables

Create a `.env` file in the **root** of the project (used by Docker Compose):

```env
# ──────────────────────────────────────────
# PostgreSQL
# ──────────────────────────────────────────
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgrespassword
POSTGRES_DB=blog_app
POSTGRES_PORT=5432

# ──────────────────────────────────────────
# Redis
# Local: use REDIS_HOST + REDIS_PORT
# Production: uncomment REDIS_URL (Upstash)
# ──────────────────────────────────────────
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
# REDIS_URL=rediss://default:<password>@<host>.upstash.io:6379

# ──────────────────────────────────────────
# Backend Server
# ──────────────────────────────────────────
PORT=3000
DATABASE_URL=postgresql://postgres:postgrespassword@db:5432/blog_app?schema=public
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
FRONTEND_URL=https://novablog.space

# ──────────────────────────────────────────
# AWS S3 (Image Uploads)
# ──────────────────────────────────────────
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_s3_bucket_name

# ──────────────────────────────────────────
# Resend Email Service
# ──────────────────────────────────────────
RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM=NovaBlog <hello@novablog.space>
```

> 💡 See `.env.example` in the repo root for a full annotated template.

---

## 🚀 Local Development

### Prerequisites
- Node.js ≥ 20
- Docker Desktop
- Git

### Option A — Docker (Recommended)

```bash
# 1. Clone the repo
git clone https://github.com/swappy-sutar/Novablog-app.git
cd Novablog-app

# 2. Copy and fill environment variables
cp .env.example .env
# → Edit .env with your secrets

# 3. Start backend + database + Redis
docker compose up -d db redis backend

# 4. Start frontend dev server (hot reload)
cd frontend
npm install
npm run dev
```

Frontend available at → `http://localhost:5173`  
Backend API available at → `http://localhost:3000/api/v1`

### Option B — Manual

```bash
# Backend
cd backend
npm install
npx prisma generate
npx prisma db push       # Push schema to your local DB
npm run start:dev        # Starts with file-watching

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

---

## 🐳 Docker Setup

### Build Images Locally

```bash
# Backend
docker build -t swapsutar/novablog-backend:latest ./backend

# Frontend (production nginx build)
docker build \
  -t swapsutar/novablog-frontend:latest \
  --target production \
  --build-arg VITE_API_URL=https://novablog-app.onrender.com/api/v1 \
  ./frontend
```

### Pull from Docker Hub

```bash
docker pull swapsutar/novablog-backend:latest
docker pull swapsutar/novablog-frontend:latest
```

### Run Full Stack with Docker Compose

```bash
docker compose up -d
```

| Container | Port | Description |
|-----------|------|-------------|
| `blog-app-db` | 5432 | PostgreSQL 16 |
| `blog-app-redis` | 6379 | Redis 7 |
| `blog-app-backend` | 3000 | NestJS API |
| `blog-app-frontend-prod` | 80 | Nginx + React build |

---

## ☁️ Production Deployment

### Backend → Render

1. Create a new **Web Service** on Render
2. Set **Root Directory** → `backend`
3. Set **Runtime** → `Docker`
4. **Dockerfile Path** → `Dockerfile`
5. **Health Check Path** → `/health`
6. Add all environment variables from `.env` (point `DATABASE_URL` to Neon, `REDIS_URL` to Upstash)

### Frontend → Vercel

1. Import the GitHub repo on Vercel
2. Set **Framework Preset** → Vite
3. Set **Root Directory** → `frontend`
4. Add environment variables:
   ```
   VITE_API_URL    = https://novablog-app.onrender.com/api/v1
   VITE_SOCKET_URL = https://novablog-app.onrender.com
   ```
5. Link your custom domain (e.g., `novablog.space`)

---

## 🔌 API Reference

All endpoints are prefixed with `/api/v1`.  
🔒 = Requires `Authorization: Bearer <accessToken>` header.  
🛡 = Requires Admin role.

### System

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health check (no prefix) |

### Authentication `/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | — | Create new account |
| `POST` | `/auth/login` | — | Login, returns JWT pair |
| `GET` | `/auth/profile` | 🔒 | Get logged-in user profile |
| `PATCH` | `/auth/profile` | 🔒 | Update profile info |
| `POST` | `/auth/upload-profile` | 🔒 | Upload avatar to S3 |
| `POST` | `/auth/refresh-token` | — | Rotate access token |
| `POST` | `/auth/logout` | 🔒 | Logout + invalidate refresh token |
| `POST` | `/auth/forgot-password` | — | Send password reset email |
| `POST` | `/auth/reset-password` | — | Reset password via token |
| `POST` | `/auth/verify-email` | — | Verify email address |
| `POST` | `/auth/setup-2fa` | 🔒 | Generate 2FA QR code |
| `POST` | `/auth/verify-2fa` | 🔒 | Enable 2FA with OTP code |
| `POST` | `/auth/disable-2fa` | 🔒 | Disable 2FA |

### Blogs `/blog`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/blog/create-blog` | 🔒 | Create new blog post |
| `GET` | `/blog/get-all-blogs` | — | List all published blogs (paginated) |
| `GET` | `/blog/my-blogs` | 🔒 | Current user's blogs |
| `GET` | `/blog/get-blog/:id` | — | Get blog post by ID |
| `PATCH` | `/blog/update-blog/:id` | 🔒 | Update blog post |
| `DELETE` | `/blog/delete-blog/:id` | 🔒 | Delete blog post |

**Query params for `get-all-blogs`:** `page`, `limit`, `search`, `category`, `status`

### Comments `/comments`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/comments/create-comment/:blogId` | 🔒 | Add comment to blog |
| `GET` | `/comments/get-comment/:blogId` | — | Get blog comments |
| `PATCH` | `/comments/update-comment/:commentId` | 🔒 | Edit own comment |
| `DELETE` | `/comments/delete-comment/:commentId` | 🔒 | Delete own comment |

### Likes `/likes`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/likes/toggle/:blogId` | 🔒 | Like / unlike a post |
| `GET` | `/likes/get-count/:blogId` | — | Get like count |

### Bookmarks `/bookmarks`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/bookmarks/toggle/:blogId` | 🔒 | Save / unsave a post |
| `GET` | `/bookmarks/my-bookmarks` | 🔒 | Get saved posts |

### Reviews `/review`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/review/create` | — | Submit a platform review |
| `GET` | `/review/active` | — | Get active (visible) reviews |

### Newsletter `/newsletter`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/newsletter/subscribe` | — | Subscribe to newsletter |
| `POST` | `/newsletter/unsubscribe` | — | Unsubscribe |

### Notifications `/notifications`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/notifications` | 🔒 | Get user notifications |
| `PATCH` | `/notifications/:id/read` | 🔒 | Mark notification as read |

### Admin `/admin` 🛡

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/admin/dashboard` | Platform overview stats |
| `GET` | `/admin/analytics` | Detailed analytics data |
| `GET` | `/admin/users` | List all users |
| `PATCH` | `/admin/users/:id/status` | Suspend / activate user |
| `PATCH` | `/admin/users/:id/role` | Change user role |
| `GET` | `/admin/blogs` | List all blogs (moderation) |
| `PATCH` | `/admin/blogs/:id/status` | Change blog status |
| `DELETE` | `/admin/blogs/:id` | Force delete blog |
| `GET` | `/admin/reviews` | List all reviews |
| `PATCH` | `/admin/reviews/:id` | Update review fields |
| `DELETE` | `/admin/reviews/:id` | Delete review |
| `GET` | `/admin/system-health` | Server metrics |

---

## 🎨 Frontend Routes

| Route | Page | Auth |
|-------|------|------|
| `/` | Home page | — |
| `/explore` | Browse all posts | — |
| `/signin` | Sign in | — |
| `/signup` | Register | — |
| `/forgot-password` | Forgot password | — |
| `/reset-password` | Reset password | — |
| `/verify-email` | Email verification | — |
| `/write` | Create new blog | 🔒 |
| `/my-blogs` | My articles dashboard | 🔒 |
| `/feed` | Following feed | 🔒 |
| `/settings` | Account settings (Profile, 2FA, Password) | 🔒 |
| `/blog/:id` | Blog post detail | — |
| `/profile/:username` | Public author profile | — |
| `/about` | About NovaBlog | — |
| `/privacy` | Privacy policy | — |
| `/terms` | Terms of service | — |
| `/cookies` | Cookie policy | — |
| `/admin/login` | Admin login | — |
| `/admin/dashboard` | Admin panel | 🛡 |

---

## 🛡 Admin Panel

The admin panel is a separate, fully secured dashboard accessible at `/admin/dashboard`.

### Tabs

| Tab | What it shows |
|-----|--------------|
| **Dashboard** | Live stats: total users, posts, views, active sessions. Recent activity feed |
| **Analytics** | Charts for post growth, reader engagement, top authors |
| **Content** | Full blog list with filter, flag, status change and force-delete |
| **Moderation** | Flagged posts queue — review and approve/reject |
| **System** | Real-time CPU/memory metrics, WebSocket live log stream |
| **Users** | User table with search, role filter, suspend/activate controls |
| **Reviews** | Platform review cards — edit all fields, toggle visibility, delete |
| **Settings** | Admin configuration options |

### Access Control
- Requires a valid JWT with `role: "Admin"`
- Protected by `JwtAuthGuard` + `AdminGuard` on every endpoint
- Frontend redirects non-admins back to the home page

---

## 📊 Database Schema

Key Prisma models:

```
User          — id, email, password, role, avatar, bio, techStack[], 2FA fields
Blog          — id, title, content, status, category, authorId → User
Comment       — id, text, blogId → Blog, userId → User
Like          — id, blogId → Blog, userId → User (unique pair)
Bookmark      — id, blogId → Blog, userId → User (unique pair)
Notification  — id, userId → User, type, message, isRead
Review        — id, name, location, stars, text, isActive
Newsletter    — id, email, isActive
```

> Full schema: [`backend/prisma/schema.prisma`](./backend/prisma/schema.prisma)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit with conventional commits: `git commit -m "feat: add your feature"`
4. Push to your fork: `git push origin feat/your-feature`
5. Open a Pull Request against `main`

### Commit Convention

| Prefix | Usage |
|--------|-------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `refactor:` | Code refactor |
| `docs:` | Documentation change |
| `style:` | UI / styling tweak |
| `chore:` | Build, config, CI |

---

## 📄 License

This project is `UNLICENSED` — all rights reserved by the author.

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/swappy-sutar">Swapnil Sutar</a></sub>
</div>
