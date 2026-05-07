# 🚀 Blog App Backend

A production-style backend API for a modern blogging platform built using powerful backend technologies like NestJS, Prisma, PostgreSQL, Redis, AWS S3, JWT Authentication, and Docker.

This project is focused on learning and implementing real-world backend engineering concepts including authentication, caching, scalable architecture, file uploads, and clean code practices.

---

# ✨ Tech Stack

## 🛠 Backend

* NestJS
* TypeScript
* Prisma ORM
* PostgreSQL (Neon DB)
* Redis
* JWT Authentication
* Multer
* bcrypt

---

## ☁️ Cloud & Storage

* AWS S3
* Docker

---

# 🔥 Features

## 🔐 Authentication System

* User Registration
* User Login
* JWT Access Token
* Refresh Token Authentication
* Hashed Refresh Tokens
* Protected Routes
* User Profile API
* Logout Functionality

---

## 📝 Blog Management

* Create Blog
* Upload Blog Thumbnail
* Blog Slug Generation
* Read Time Calculation
* Draft & Published Blogs
* Featured Blogs
* Category Support
* Blog View Tracking

---

## ⚡ Redis Caching

* User Profile Cache
* Blog Cache
* Cache Invalidation Strategy
* Redis Key Management
* Optimized API Performance

---

## ☁️ AWS S3 Uploads

* Profile Picture Upload
* Blog Thumbnail Upload
* Public Image URLs
* Cloud-Based File Storage

---

# 🧱 Architecture Highlights

* Modular NestJS Architecture
* Repository Pattern
* DTO Validation
* Centralized Error Handling
* Reusable Helpers & Utilities
* Environment-Based Configuration
* Scalable Folder Structure
* Production-Oriented Design

---

# 📁 Project Structure

```txt
src/
│
├── common/
│   ├── decorators/
│   ├── helpers/
│   ├── interfaces/
│   └── utils/
│
├── config/
│   ├── prisma.config/
│   ├── redis.config/
│   └── s3.config/
│
├── modules/
│   ├── auth/
│   ├── users/
│   └── blog/
│
├── prisma/
│
└── main.ts
```

---

# ⚙️ Environment Variables

Create a `.env` file in the root directory.

```env
PORT=8000

DATABASE_URL=your_neon_database_url

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

ACCESS_TOKEN_EXPIRES_IN=900
REFRESH_TOKEN_EXPIRES_IN=604800

REDIS_HOST=localhost
REDIS_PORT=6379

AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1
AWS_S3_BUCKET_NAME=your_bucket_name
```

---

# 🚀 Getting Started

## 📥 Clone Repository

```bash
git clone https://github.com/swappy-sutar/Blog-App.git
```

---

## 📦 Install Dependencies

```bash
npm install
```

---

# 🗄 Prisma Setup

## Generate Prisma Client

```bash
npx prisma generate
```

---

## Run Database Migration

```bash
npx prisma migrate dev
```

---

# 🐳 Run Redis Using Docker

```bash
docker compose up -d
```

---

# ▶️ Run Development Server

```bash
npm run start:dev
```

---

# 📡 API Endpoints

## 🔐 Auth APIs

| Method | Endpoint             | Description            |
| ------ | -------------------- | ---------------------- |
| POST   | /auth/register       | Register User          |
| POST   | /auth/login          | Login User             |
| POST   | /auth/refresh-token  | Refresh JWT Token      |
| GET    | /auth/profile        | Get User Profile       |
| POST   | /auth/logout         | Logout User            |
| POST   | /auth/upload-profile | Upload Profile Picture |

---

## 📝 Blog APIs

| Method | Endpoint    | Description      |
| ------ | ----------- | ---------------- |
| POST   | /blog       | Create Blog      |
| GET    | /blog       | Get All Blogs    |
| GET    | /blog/:slug | Get Blog By Slug |
| PATCH  | /blog/:id   | Update Blog      |
| DELETE | /blog/:id   | Delete Blog      |

---

# 🔑 Authentication

Protected routes require:

```txt
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

# 📤 Example Create Blog Request

## Content-Type

```txt
multipart/form-data
```

---

## Fields

| Key        | Type |
| ---------- | ---- |
| title      | text |
| content    | text |
| excerpt    | text |
| status     | text |
| isFeatured | text |
| thumbnail  | file |

---

# ⚡ Redis Cache Strategy

| Cache          | TTL        |
| -------------- | ---------- |
| User Profile   | 5 Minutes  |
| Blog Details   | 10 Minutes |
| Featured Blogs | 30 Minutes |

---

# 🛡 Security Features

* Password Hashing
* Hashed Refresh Tokens
* JWT Guards
* DTO Validation
* File Type Validation
* Secure Environment Variables
* Protected Routes

---

# 📌 Future Improvements

* 💬 Comments System
* ❤️ Blog Likes
* 🔖 Bookmarks
* ⚙️ BullMQ Queues
* 📧 Email Verification
* 🚦 Rate Limiting
* 📚 Swagger Documentation
* 🧪 Unit Testing
* 🚀 CI/CD Pipeline
* 📊 Blog Analytics

---

# 👨‍💻 Author

Built with ❤️ by Swapnil.
