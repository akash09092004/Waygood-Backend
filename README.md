# Waygood Backend 

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
   MONGO_URI=mongodb+srv://Akash66:akash123@cluster0.kzf3i1s.mongodb.net/backend?appName=Cluster0
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

## 5. All API Endpoints

Base URL: `http://localhost:4000/api`

### 5.1 Authentication (`/auth`)

- `POST /auth/register` — naya student account banao
  - Body:
    ```json
    {
      "fullName": "Aarav Sharma",
      "email": "aarav@example.com",
      "password": "Candidate123!",
      "role": "student"
    }
    ```

- `POST /auth/login` — login karke token pao
  - Body:
    ```json
    {
      "email": "aarav@example.com",
      "password": "Candidate123!"
    }
    ```
  - Response:
    ```json
    {
      "success": true,
      "token": "eyJhbGciOiJIUzI1NiIs..."
    }
    ```

- `GET /auth/me` — logged-in user ki details (protected)
  - Header: `Authorization: Bearer <TOKEN>`

### 5.2 Applications (`/applications`)

- `GET /applications/` — sabhi applications dekho
  - Query params: `studentId`, `status`
  - Protected: token required

- `GET /applications/:id` — ek application ki details dekho
  - Path: `:id` = MongoDB `_id`
  - Protected: token required
  - Example:
    ```bash
    curl -H "Authorization: Bearer <TOKEN>" \
      http://localhost:4000/api/applications/<APPLICATION_ID>
    ```

- `POST /applications/` — naya application create karo
  - Body:
    ```json
    {
      "student": "<STUDENT_ID>",
      "program": "<PROGRAM_ID>",
      "intake": "September"
    }
    ```

- `PATCH /applications/:id/status` — application ka status update karo
  - Body:
    ```json
    {
      "status": "under_review",
      "note": "Status updated for review"
    }
    ```
  - Valid statuses: `draft`, `submitted`, `under-review`, `under_review`, `offer-received`, `visa-processing`, `enrolled`, `rejected`

### 5.3 Programs (`/programs`)

- `GET /programs/` — sabhi programs dekho
  - Query params supported: filters

### 5.4 Universities (`/universities`)

- `GET /universities/` — sabhi universities dekho
  - Query params supported: filters

- `GET /universities/popular` — popular universities dekho (sorted by score)

### 5.5 Recommendations (`/recommendations`)

- `GET /recommendations/:studentId` — student ke liye program recommendations dekho
  - Path: `:studentId` = MongoDB Student `_id`

### 5.6 Dashboard (`/dashboard`)

- `GET /dashboard/overview` — dashboard statistics dekho
  - Stats: total students, programs, applications, status breakdown, top countries

### 5.7 Health Check (`/health`)

- `GET /health/` — server status check karo
  - Public endpoint (no auth needed)

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
  

## 8. Submission notes

- `backend/README.md` me full setup and run instructions diye gaye hain.
- Backend server ko `npm run dev` se chalaya ja sakta hai.
- Seed data se sample users aur applications add ho jate hain.
- Main code me koi logic change nahi kiya bina aapki permission ke.

---

Agar aap chaho, main abhi `backend` me seed + server run karke ek valid `Application ID` aur `curl` commands provide kar sakta hoon.
