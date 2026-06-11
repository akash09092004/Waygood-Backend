# Waygood Backend — Assignment Submission Guide

Ye file backend assignment ko review karne walon ke liye clear instructions aur examples provide karti hai.

## 1. Project setup

1. `backend` folder open karo.
2. Dependency install karo:

   ```bash
   cd backend
   npm install
   ```

3. `.env` file create karo `backend` folder me:

   ```env
   PORT=4000
   MONGO_URI=mongodb://127.0.0.1:27017/waygood-evaluation
   JWT_SECRET=dev-secret
   JWT_EXPIRES_IN=1d
   ```

4. Agar aap cloud MongoDB use kar rahe ho to `MONGO_URI` ko apni Atlas connection string se replace karo.

## 2. Seed data chalana

Sample data insert karne ke liye:

```bash
cd backend
npm run seed
```

Ye script insert karega:
- Universities
- Programs
- Students
- Applications

Agar error aaye aur `MONGO_URI: undefined` dikhaye, toh `.env` check karo aur MongoDB service start karo.

## 3. Server start karna

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Default port: `4000`.

## 4. Authentication

Protected endpoints ko access karne ke liye pehle login karo.

### Login endpoint

- URL: `POST /api/auth/login`
- Body:

  ```json
  {
    "email": "aarav@example.com",
    "password": "Candidate123!"
  }
  ```

### Seeded users

Agar aap seed data use kar rahe ho, valid credentials:

- `aarav@example.com` / `Candidate123!`
- `sara@example.com` / `Candidate123!`
- `counselor@example.com` / `Candidate123!`

### Auth header example

```
Authorization: Bearer <TOKEN>
```

## 5. Important API endpoints

### 5.1 List applications

- `GET /api/applications/`
- Protected: token required

Example:

```bash
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:4000/api/applications/
```

### 5.2 Get application by id

- `GET /api/applications/:id`

Example:

```bash
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:4000/api/applications/<APPLICATION_ID>
```

### 5.3 Update application status

- `PATCH /api/applications/:id/status`
- Body example:

  ```json
  {
    "status": "under_review",
    "note": "Status updated for review"
  }
  ```

Note: backend ab `under-review` aur `under_review` dono status formats support karta hai.

## 6. How to get a valid Application ID

1. Seed data run karo.
2. `GET /api/applications/` hit karo.
3. Response ka `data` array dekho aur kisi application ka `_id` copy karo.

Example ID format:

```text
62f1a4c5d4ba3a001234abcd
```

## 7. Common issues

- **401 Unauthorized**
  - `Authorization` header sahi se set karo.
  - Token expired ho sakta hai, dubara login karo.

- **Cast to ObjectId failed**
  - ID valid 24-character MongoDB ObjectId nahi hai.
  - `GET /api/applications/` se valid ID le kar use karo.

- **Seed failed / MONGO_URI undefined**
  - `.env` file me `MONGO_URI` add karo.
  - Local MongoDB start karo.

## 8. Submission notes

- `backend/README.md` me full setup and run instructions diye gaye hain.
- Backend server ko `npm run dev` se chalaya ja sakta hai.
- Seed data se sample users aur applications add ho jate hain.
- Main code me koi logic change nahi kiya bina aapki permission ke.

---

Agar aap chaho, main abhi `backend` me seed + server run karke ek valid `Application ID` aur `curl` commands provide kar sakta hoon.
