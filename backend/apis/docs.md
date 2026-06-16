# NovaBlog Backend API Reference Documentation

All backend API routes are prefixed with `/api/v1`. Protected routes require JWT authorization passed via the `Authorization` header.

## Table of Contents
1. [Authentication Modules (`/auth`)](#1-authentication-modules-auth)
2. [Blog Modules (`/blog`)](#2-blog-modules-blog)
3. [Comment Modules (`/comments`)](#3-comment-modules-comments)
4. [Like Modules (`/likes`)](#4-like-modules-likes)
5. [Bookmark Modules (`/bookmarks`)](#5-bookmark-modules-bookmarks)

---

## 1. Authentication Modules (`/auth`)

These endpoints handle registration, login, profile updates, and authentication tokens.

### Register User
* **Endpoint:** `POST /auth/register`
* **Auth Required:** No
* **Content-Type:** `application/json`
* **Request Body:**
  ```json
  {
    "firstname": "John",
    "lastname": "Doe",
    "username": "johndoe",
    "email": "john.doe@example.com",
    "password": "strongPassword123"
  }
  ```
* **Response (Success):**
  ```json
  {
    "success": true,
    "statusCode": 201,
    "message": "User registered successfully",
    "data": {
      "id": "cuid-string-here",
      "firstname": "John",
      "lastname": "Doe",
      "username": "johndoe",
      "email": "john.doe@example.com",
      "role": "USER",
      "createdAt": "2026-06-16T04:12:00.000Z"
    }
  }
  ```

### Login User
* **Endpoint:** `POST /auth/login`
* **Auth Required:** No
* **Content-Type:** `application/json`
* **Request Body:**
  ```json
  {
    "email": "john.doe@example.com",
    "password": "strongPassword123"
  }
  ```
* **Response (Success):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Login successful",
    "data": {
      "accessToken": "jwt-access-token-string",
      "refreshToken": "jwt-refresh-token-string",
      "user": {
        "id": "cuid-string-here",
        "firstname": "John",
        "lastname": "Doe",
        "username": "johndoe",
        "email": "john.doe@example.com",
        "role": "USER",
        "avatar": null
      }
    }
  }
  ```

### Get Current User Profile
* **Endpoint:** `GET /auth/profile`
* **Auth Required:** Yes (`Bearer <ACCESS_TOKEN>`)
* **Response (Success):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Profile fetched successfully",
    "data": {
      "id": "cuid-string-here",
      "firstname": "John",
      "lastname": "Doe",
      "username": "johndoe",
      "email": "john.doe@example.com",
      "bio": "Software Architect",
      "avatar": "https://s3-url.com/avatars/image.jpg",
      "websiteUrl": "https://johndoe.dev",
      "githubUrl": "https://github.com/johndoe",
      "role": "USER",
      "createdAt": "2026-06-16T04:12:00.000Z"
    }
  }
  ```

### Update Current User Profile
* **Endpoint:** `PATCH /auth/profile`
* **Auth Required:** Yes (`Bearer <ACCESS_TOKEN>`)
* **Content-Type:** `application/json`
* **Request Body (All fields optional):**
  ```json
  {
    "firstname": "Johnny",
    "lastname": "Doe Jr.",
    "bio": "Systems design enthusiast.",
    "websiteUrl": "https://johnny.dev",
    "githubUrl": "https://github.com/johnny-dev"
  }
  ```
* **Response (Success):** Returns the updated user profile object.

### Upload Profile Picture
* **Endpoint:** `POST /auth/upload-profile`
* **Auth Required:** Yes (`Bearer <ACCESS_TOKEN>`)
* **Content-Type:** `multipart/form-data`
* **Form Parameters:**
  - `image`: File (JPG, PNG, GIF)
* **Response (Success):** Returns user profile with the updated S3 avatar URL.

### Refresh Access Token
* **Endpoint:** `POST /auth/refresh-token`
* **Auth Required:** No
* **Content-Type:** `application/json`
* **Request Body:**
  ```json
  {
    "refreshToken": "jwt-refresh-token-string"
  }
  ```
* **Response (Success):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "data": {
      "accessToken": "new-jwt-access-token-string",
      "refreshToken": "optional-new-jwt-refresh-token-string"
    }
  }
  ```

### Logout User
* **Endpoint:** `POST /auth/logout`
* **Auth Required:** Yes (`Bearer <ACCESS_TOKEN>`)
* **Response (Success):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Logout successful"
  }
  ```

---

## 2. Blog Modules (`/blog`)

These endpoints handle blogging CRUD operations, search, list filters, and views counts.

### Create Blog Post
* **Endpoint:** `POST /blog/create-blog`
* **Auth Required:** Yes (`Bearer <ACCESS_TOKEN>`)
* **Content-Type:** `multipart/form-data`
* **Form Parameters:**
  - `title`: String (Required)
  - `content`: String HTML (Required)
  - `excerpt`: String (Optional)
  - `status`: String `DRAFT` or `PUBLISHED` (Default: `DRAFT`)
  - `isFeatured`: String `true` or `false` (Default: `false`)
  - `categoryId`: String (Optional CUID of Category)
  - `thumbnail`: File (Optional cover picture)
* **Response (Success):**
  ```json
  {
    "success": true,
    "statusCode": 201,
    "message": "Blog created successfully",
    "data": {
      "id": "blog-cuid-here",
      "title": "My First Blog",
      "slug": "my-first-blog",
      "excerpt": "Excerpt summary...",
      "content": "<p>Content HTML...</p>",
      "thumbnail": "https://s3-url.com/thumbnails/cover.png",
      "status": "PUBLISHED",
      "isFeatured": false,
      "views": 0,
      "readTime": 1,
      "publishedAt": "2026-06-16T04:15:00.000Z",
      "createdAt": "2026-06-16T04:15:00.000Z",
      "authorId": "user-cuid-here"
    }
  }
  ```

### List All Public Blogs
* **Endpoint:** `GET /blog/get-all-blogs`
* **Auth Required:** No
* **Query Parameters (Optional):**
  - `page`: Number (Default: 1)
  - `limit`: Number (Default: 10)
  - `search`: String (Filters by matches in title/content)
* **Response (Success):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Blogs fetched successfully",
    "data": {
      "meta": {
        "total": 12,
        "page": 1,
        "limit": 10,
        "totalPages": 2
      },
      "blogs": [
        {
          "id": "blog-cuid-here",
          "title": "Blog Title",
          "slug": "blog-slug",
          "thumbnail": "...",
          "views": 240,
          "category": null,
          "author": {
            "id": "...",
            "firstname": "...",
            "lastname": "...",
            "username": "...",
            "avatar": "..."
          }
        }
      ]
    }
  }
  ```

### List Current User's Blogs
* **Endpoint:** `GET /blog/my-blogs`
* **Auth Required:** Yes (`Bearer <ACCESS_TOKEN>`)
* **Query Parameters (Optional):**
  - `page`: Number (Default: 1)
  - `limit`: Number (Default: 10)
  - `search`: String (Filters user's own blogs)
* **Response (Success):** Structured identically to `List All Public Blogs` but contains draft status logs.

### Get Blog Details by ID
* **Endpoint:** `GET /blog/get-blog/:id`
* **Auth Required:** No
* **Route Params:**
  - `id`: Blog CUID
* **Description:** Returns full details, tags list, comment count, and increments the views counter by 1.
* **Response (Success):** Returns full Blog model.

### Update Own Blog Post
* **Endpoint:** `PATCH /blog/update-blog/:id`
* **Auth Required:** Yes (`Bearer <ACCESS_TOKEN>`)
* **Route Params:**
  - `id`: Blog CUID
* **Content-Type:** `multipart/form-data`
* **Form Parameters (Optional):**
  - `title`, `content`, `excerpt`, `status`, `isFeatured`, `categoryId`, `thumbnail`
* **Response (Success):** Returns the updated Blog object.

### Delete Own Blog Post
* **Endpoint:** `DELETE /blog/delete-blog/:id`
* **Auth Required:** Yes (`Bearer <ACCESS_TOKEN>`)
* **Route Params:**
  - `id`: Blog CUID
* **Response (Success):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Blog deleted successfully"
  }
  ```

---

## 3. Comment Modules (`/comments`)

These endpoints manage comment threads, nested replies, sorting, and user updates.

### Create Comment or Reply
* **Endpoint:** `POST /comments/create-comment/:blogId`
* **Auth Required:** Yes (`Bearer <ACCESS_TOKEN>`)
* **Route Params:**
  - `blogId`: Blog CUID
* **Content-Type:** `application/json`
* **Request Body:**
  ```json
  {
    "content": "Fascinating outline on concurrency prefetch!",
    "parentId": "optional-parent-comment-cuid-for-nested-replies"
  }
  ```
* **Response (Success):** Returns the new Comment object with author user details.

### List Comments for Blog
* **Endpoint:** `GET /comments/get-comment/:blogId`
* **Auth Required:** Yes (`Bearer <ACCESS_TOKEN>`)
* **Route Params:**
  - `blogId`: Blog CUID
* **Query Parameters (Optional):**
  - `page`: Number (Default: 1)
  - `limit`: Number (Default: 10)
* **Response (Success):** Returns comment threads (where `parentId` is null) with nested replies arrays.

### Update Own Comment
* **Endpoint:** `PATCH /comments/update-comment/:commentId`
* **Auth Required:** Yes (`Bearer <ACCESS_TOKEN>`)
* **Route Params:**
  - `commentId`: Comment CUID
* **Request Body:**
  ```json
  {
    "content": "Edited comment contents."
  }
  ```

### Delete Own Comment
* **Endpoint:** `DELETE /comments/delete-comment/:commentId`
* **Auth Required:** Yes (`Bearer <ACCESS_TOKEN>`)
* **Route Params:**
  - `commentId`: Comment CUID

---

## 4. Like Modules (`/likes`)

Likes can be toggled by authenticated users.

### Toggle Like
* **Endpoint:** `POST /likes/toggle/:blogId`
* **Auth Required:** Yes (`Bearer <ACCESS_TOKEN>`)
* **Route Params:**
  - `blogId`: Blog CUID
* **Response (Success):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Blog liked successfully", // or "Blog unliked successfully"
    "data": {
      "liked": true // or false
    }
  }
  ```

### Get Likes Count
* **Endpoint:** `GET /likes/get-count/:blogId`
* **Auth Required:** No
* **Route Params:**
  - `blogId`: Blog CUID
* **Response (Success):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Likes count fetched successfully",
    "data": {
      "count": 12
    }
  }
  ```

---

## 5. Bookmark Modules (`/bookmarks`)

Allows bookmarking articles for quick reading lists.

### Toggle Bookmark
* **Endpoint:** `POST /bookmarks/toggle/:blogId`
* **Auth Required:** Yes (`Bearer <ACCESS_TOKEN>`)
* **Route Params:**
  - `blogId`: Blog CUID
* **Response (Success):** Toggles user bookmark relationship.

### Get User Bookmarks
* **Endpoint:** `GET /bookmarks/my-bookmarks`
* **Auth Required:** Yes (`Bearer <ACCESS_TOKEN>`)
* **Query Parameters (Optional):**
  - `page`: Number (Default: 1)
  - `limit`: Number (Default: 10)
* **Response (Success):** Returns paginated list of user bookmarks.
