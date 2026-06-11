# Waygood Backend — Run & Submission Guide

Ye README aapke backend assignment ko local pe chalane, seed data daalne, aur important API endpoints test karne ke liye step-by-step instructions deta hai.

## Prerequisites
- Node.js (v16+)
- npm
- MongoDB (local `mongod` running) or a MongoDB Atlas URI

## Setup
1. Workspace me `backend` folder open karo.
2. Dependencies install karo:

```bash
cd backend
npm install
```

3. Environment variables: backend folder me `.env` file banao with:

```
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/waygood-evaluation
JWT_SECRET=dev-secret
JWT_EXPIRES_IN=1d
```

Replace `MONGO_URI` with your Atlas string if you use cloud DB.

## Seed the database (sample data)
Seed script inserts sample universities, programs, students, and applications.

```bash
cd backend
npm run seed
```

If seed prints `MONGO_URI: undefined`, set `.env` correctly and ensure MongoDB is running.

## Start the server

Development (auto-restart):
```bash
npm run dev
```

Production:
```bash
npm start
```

Default server port: `4000` (change with `PORT` env).

## Auth (required for protected endpoints)
- Login: `POST /api/auth/login` — use credentials from seed or your own user.
- Use returned token in requests:

```
Authorization: Bearer <TOKEN>
```

## Important endpoints (examples)

- List applications
  - `GET /api/applications/`

- Get application by id
  - `GET /api/applications/:id`
  - Example:

```bash
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:4000/api/applications/6a29577b77b06d352ac208d
```

- Update application status
  - `PATCH /api/applications/:id/status`
  - Body example:

```json
{
  "status": "under_review",
  "note": "Testing status update"
}
```

Note: repository accepts both `under-review` and `under_review` as status values.

## Common issues & fixes
- 401 Unauthorized: check `Authorization` header and token expiry. Re-login to get new token.
- Cast to ObjectId failed: use a valid 24-character MongoDB `_id` (use list endpoint to find one).
- Seed failed / MONGO_URI undefined: add `MONGO_URI` to `.env` and ensure MongoDB is running.

## Submission checklist (for assignment)
- Include this README in the `backend` folder.
- Ensure the server runs with `npm run dev` and seed completes.
- Provide a sample valid Application `_id` and a sample token when submitting, so reviewer can verify quickly.
- Note any code changes made (if any). I did not modify application logic unless requested.

---

If chaho, main ab seed + server run karke sample IDs aur curl examples provide kar dunga — permission do to run them on your machine.
