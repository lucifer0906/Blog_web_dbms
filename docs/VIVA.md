# Blog App – Viva Preparation Guide

This document explains the project end‑to‑end for your DBMS course viva. It covers architecture, data modeling, API behavior, where DBMS concepts are applied, how file uploads work, how to run it locally, and a curated Q&A from easy to hard.

---

## 1) Project summary

A MERN‑style blogging platform:
- Backend: Node.js + Express + Mongoose (MongoDB)
- Frontend: React + Redux Toolkit, Axios
- Database: MongoDB Atlas (connection via `.env`)
- Features: User registration/login, create/read/update/delete blogs, media (image/video URL), local image uploads (cover + inline), user‑specific blogs, blog details with markdown rendering.

---

## 2) Architecture

- Entry: `server.js`
  - Loads `.env` → connects MongoDB (`config/db.js`).
  - Registers routes: `/api/v1/user/*`, `/api/v1/blog/*`.
  - Serves `uploads/` statically at `/uploads` for local images.
- Controllers:
  - `controllers/userController.js`: register/login/get users.
  - `controllers/blogController.js`: list blogs, create, update, fetch by id, delete, list user blogs, upload image.
- Models:
  - `models/userModel.js` → `User`
  - `models/blogModel.js` → `Blog`
- Routes:
  - `routes/userRoutes.js`, `routes/blogRoutes.js`
- Frontend:
  - Pages: `Login`, `Register`, `Blogs`, `UserBlogs`, `CreateBlog`, `BlogDetails`.
  - Components: `BlogCard`, `Header`.
  - Redux: `authSlice` with `isLogin` flag.

---

## 3) Data model (MongoDB)

### User (`models/userModel.js`)
- Fields:
  - `username: String (required)`
  - `email: String (required, unique)`
  - `password: String (required, select: false)` – bcrypt hashed
  - `blogs: ObjectId[]` → references to `Blog`
- Timestamps enabled.

### Blog (`models/blogModel.js`)
- Fields:
  - `title: String (required)`
  - `description: String (required)` (supports Markdown for inline images)
  - `media: String (optional)` – URL (image/video/YouTube)
  - `mediaType: String (enum: image|video, default: image)`
  - `coverImage: String (optional)` – uploaded local image URL (`/uploads/...`)
  - `inlineImages: String[] (optional)` – reserved for future use
  - `user: ObjectId (required)` – reference to `User`
- Timestamps enabled.

Relationship: One User → Many Blogs (referencing via ObjectId). Population is used to join.

---

## 4) API endpoints

Base path: `/api/v1`

### User
- `GET /user/all-users` → list sanitized users
- `POST /user/register` → body: `{ username, email, password }`
- `POST /user/login` → body: `{ email, password }`

### Blog
- `GET /blog/all-blog` → list all blogs with `user` populated
- `POST /blog/create-blog` → body: `{ title, description, user, media?, mediaType?, coverImage? }` (requires at least one of `media` or `coverImage`)
- `PUT /blog/update-blog/:id` → body similar to create; enforces at least one of `media` or `coverImage`
- `GET /blog/get-blog/:id` → single blog
- `DELETE /blog/delete-blog/:id` → deletes and removes reverse ref from user
- `GET /blog/user-blog/:id` → user with populated blogs
- `POST /blog/upload-image` (multipart, `image` field) → returns `{ url }`

---

## 5) Authentication flow

- Register: hashes password with bcrypt, stores user; returns sanitized user (no password).
- Login: fetches user with `+password`, compares bcrypt hash; returns sanitized user and the UI stores `userId` in `localStorage` (basic auth marker; no JWT yet).

---

## 6) Image upload & rendering

- Local uploads handled by `multer` to `uploads/` folder; server exposes `/uploads` statically.
- Create/Edit Blog page:
  - “Upload Cover” → POST `/upload-image` → sets `coverImage` with returned URL.
  - “Upload Inline Image” → POST `/upload-image` → appends `![](url)` to `description` (Markdown).
- BlogDetails renders Markdown via `react-markdown` and shows `coverImage` if present; else falls back to media (image/video/YouTube embed).

---

## 7) Where DBMS concepts are used (mapping)

- Schema constraints (Integrity):
  - Required fields, enum constraints in Mongoose schemas.
  - `email` unique index; `password` hidden by default (`select: false`).
- Relationships (Referential Integrity):
  - `Blog.user` references `User._id`; `.populate()` emulates JOIN.
  - Reverse references: `User.blogs[]` manually maintained.
- Transactions (ACID):
  - In `createBlogController`: multi‑document transaction ensures atomic creation of blog + updating user’s `blogs` array. Demonstrates Atomicity, Isolation, Durability.
- Normalization vs Denormalization:
  - Referencing (normalized) chosen for scalability; minimal duplication in `User.blogs` for fast fetch of user blogs.
- Query processing:
  - `find`, `findById`, `findByIdAndUpdate`, `findByIdAndDelete`, `.populate()`.
- Potential Indexing (Performance):
  - Recommended indexes: `User.email` (unique), `Blog.user`, `Blog.createdAt` (sorting); not all are explicitly defined yet.
- Security Controls:
  - Hashing passwords with bcrypt before write; never returning password in responses.

---

## 8) Error handling and validation

- User API returns proper HTTP status codes:
  - 409 for duplicate email
  - 404 for unregistered email on login
  - 401 for wrong password
  - 400 for missing inputs
- Blog API enforces at least one of `media` or `coverImage` on create/update.
- Frontend surfaces server messages via toasts.

---

## 9) How to run locally

1. Set `.env` in project root:
   ```
   PORT=5000
   DEV_MODE=development
   MONGO_URL=mongodb+srv://<user>:<password>@<cluster-host>/blogapp
   ```
2. Install deps:
   - Root (server): `npm install`
   - Client: `cd client && npm install`
3. Start both:
   - Root: `npm run dev`
   - Or individually: `npm run server` (backend), `npm run client` (frontend)

The client proxies API calls to `http://localhost:5000` via `client/package.json`.

---

## 10) Connecting to the database (Compass)

- Connection string is in `.env` as `MONGO_URL` (SRV format).
- In MongoDB Compass → “New Connection” → paste the full encoded URI.
- Select `blogapp` database → explore `users` and `blogs` collections.
- Troubleshooting: ensure IP allowlist in Atlas, use encoded password, try different network if SRV blocked.

---

## 11) Security notes & improvements

- Credentials in code should be rotated and `.env` should be in `.gitignore`.
- Add JWT authentication and authorization middleware (protect blog create/update/delete, upload endpoints).
- Validate inputs (`express-validator`), rate limit, and file type/size checks (already limited to images, 5 MB).
- Consider Cloud storage (S3/Cloudinary) for production image hosting + CDN.

---

## 12) Future improvements

- Add indexes for frequent queries.
- Pagination for `/all-blog`.
- Full‑text search on titles/descriptions.
- Tags/categories.
- Soft delete, audit logs.
- Unit/integration tests (Jest + Supertest).

---

## 13) Viva Q&A (easy → hard)

### Easy
1) What stack is used in this project?
- MERN: MongoDB (Mongoose), Express, React, Node.js.

2) Where is the database connection configured?
- `config/db.js` and loaded in `server.js` via `dotenv` and `connectDB()`.

3) What are the main collections?
- `users` and `blogs` (models in `models/userModel.js` and `models/blogModel.js`).

4) How are users and blogs related?
- One‑to‑many: Blog stores `user` ObjectId reference; User keeps an array of blog ids.

5) How is the password stored?
- Bcrypt hash, never returned in API responses (`select: false`).

6) How does the frontend know a user is logged in?
- Stores `userId` in `localStorage` and uses a Redux `isLogin` flag.

7) How do you fetch all blogs?
- `GET /api/v1/blog/all-blog` with `.populate("user")`.

8) How do you upload an image locally?
- `POST /api/v1/blog/upload-image` (multipart, `image` field), response includes public URL under `/uploads`.

### Medium
1) Why use referencing instead of embedding for blogs under users?
- Scalability and document size; blogs can grow large, referencing keeps user docs small; can `.populate()` when needed.

2) How is ACID demonstrated here?
- Blog creation uses a transaction: create Blog + push id to User.blogs in a single atomic transaction.

3) How does `.populate()` work?
- Mongoose joins referenced documents by replacing ObjectId with actual documents (similar to SQL JOIN at app level).

4) What validations exist on Blog creation?
- Requires title, description, user, and at least one of media or coverImage; `mediaType` is enum constrained.

5) What improvements would you make for security?
- JWT auth, role‑based access, input validation, rate limiting, Cloud storage for images, rotate leaked credentials.

6) How would you scale read performance for latest blogs?
- Create index on `createdAt` and use pagination; maybe denormalize frequently read fields.

7) How would you support full‑text search?
- Create a text index on `title` and `description`, query with `$text`.

### Hard
1) What consistency issues can occur when maintaining `User.blogs` manually?
- If a write fails after one update, you can get dangling references; transactions reduce but don’t eliminate risks outside their usage (e.g., delete without tx). You can also derive blogs by querying Blog by `user` to avoid reverse array.

2) When would you choose embedding instead of referencing in MongoDB?
- When child documents are tightly coupled, small, and always read with the parent (e.g., a few settings). Embedding reduces joins and improves locality.

3) How would you implement optimistic concurrency for blog updates?
- Use versioning (`__v`) and conditional updates (`findOneAndUpdate` with version match) or custom version key.

4) How to make image uploads safe and efficient in production?
- Upload to S3/Cloudinary with signed URLs, validate MIME and dimensions, generate responsive sizes, serve via CDN, store only URLs in DB.

5) How would you design transactions for delete to keep integrity?
- Wrap `findByIdAndDelete` and `User.blogs.pull` in a multi‑document transaction; optionally also check invariants and retry on transient errors.

---

## 14) Quick cheatsheet
- Entry: `server.js` | DB: `config/db.js`
- Models: `User`, `Blog`
- API roots: `/api/v1/user`, `/api/v1/blog`
- Transactions: only on blog creation
- Media rule: at least one of `media` or `coverImage`
- Local uploads: `/uploads/<file>` served by Express
- Frontend state: Redux `isLogin`; user id in `localStorage`

---

Prepared to help you explain not just how it works, but why each DBMS decision was made.
