# CommunitySync Backend Specification

## 1. Project Overview

**Project Name:** CommunitySync Backend  
**Project Type:** Production-ready REST API Backend  
**Core Functionality:** Connects NGOs, volunteers, government authorities, and community members to solve local issues efficiently through issue reporting, task assignment, government coordination, and community verification.  
**Target Users:** NGOs, Volunteers, Government Authorities, Community Members, Admins

## 2. Tech Stack (STRICT)

- **Runtime:** Node.js (v20+)
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Authentication:** JWT + Refresh Tokens
- **File Upload:** Multer + Cloudinary/S3
- **Validation:** Zod
- **Queue:** BullMQ + Redis
- **Architecture:** Modular + Clean Architecture
- **Logging:** Pino

## 3. Database Schema (Drizzle)

### Tables

**users**
- id: uuid (primary key)
- name: varchar(255)
- email: varchar(255) (unique)
- password: varchar(255)
- role: enum ('ngo', 'volunteer', 'govt', 'admin')
- skills: jsonb (array of strings)
- location: geography(Point, 4326)
- phone: varchar(20)
- avatar_url: text
- is_active: boolean (default true)
- created_at: timestamp
- updated_at: timestamp

**reports**
- id: uuid (primary key)
- title: varchar(500)
- description: text
- category: varchar(100)
- urgency: enum ('low', 'medium', 'high')
- status: enum ('pending', 'assigned', 'in_progress', 'completed', 'verified', 'closed', 'reopened')
- location: geography(Point, 4326)
- address: text
- images: jsonb (array of image URLs)
- created_by: uuid (foreign key -> users.id)
- assigned_to: uuid (foreign key -> users.id, nullable)
- urgency_score: float
- is_priority: boolean (default false)
- created_at: timestamp
- updated_at: timestamp

**tasks**
- id: uuid (primary key)
- report_id: uuid (foreign key -> reports.id)
- assigned_to: uuid (foreign key -> users.id)
- status: enum ('pending', 'assigned', 'in_progress', 'completed', 'verified', 'closed')
- started_at: timestamp (nullable)
- completed_at: timestamp (nullable)
- verified_at: timestamp (nullable)
- created_at: timestamp
- updated_at: timestamp

**government_actions**
- id: uuid (primary key)
- report_id: uuid (foreign key -> reports.id)
- department: varchar(255)
- action_type: enum ('accept', 'in_progress', 'completed')
- proof_image_url: text
- remarks: text
- performed_by: uuid (foreign key -> users.id)
- created_at: timestamp

**verifications**
- id: uuid (primary key)
- report_id: uuid (foreign key -> reports.id)
- user_id: uuid (foreign key -> users.id)
- vote: enum ('approved', 'rejected')
- comment: text
- created_at: timestamp

**notifications**
- id: uuid (primary key)
- user_id: uuid (foreign key -> users.id)
- message: text
- type: enum ('assignment', 'status_update', 'verification', 'system')
- read_status: boolean (default false)
- created_at: timestamp

**refresh_tokens**
- id: uuid (primary key)
- user_id: uuid (foreign key -> users.id)
- token: text
- expires_at: timestamp
- created_at: timestamp

**audit_logs**
- id: uuid (primary key)
- user_id: uuid (foreign key -> users.id)
- action: varchar(255)
- entity_type: varchar(100)
- entity_id: uuid
- metadata: jsonb
- created_at: timestamp

## 4. API Design (RESTful)

### Auth Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Reports Endpoints
- `POST /api/reports` - Create report (NGO only)
- `GET /api/reports` - Get all reports (with filters)
- `GET /api/reports/:id` - Get single report
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report
- `GET /api/reports/nearby` - Get nearby reports

### Tasks Endpoints
- `POST /api/tasks/assign` - Assign task to volunteer
- `GET /api/tasks/user` - Get user's tasks
- `PATCH /api/tasks/:id/status` - Update task status

### Government Endpoints
- `POST /api/gov/action` - Submit government action
- `PATCH /api/gov/:reportId/status` - Update report status

### Verification Endpoints
- `POST /api/verify` - Submit verification vote
- `GET /api/verify/:reportId` - Get verifications for report

### Notification Endpoints
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark as read

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile

## 5. Security & Best Practices

- Password hashing with bcrypt (12 rounds)
- JWT access token (15 min expiry)
- Refresh token (7 days expiry)
- Rate limiting (100 req/min)
- Input validation with Zod
- RBAC middleware
- Secure file uploads with validation
- API logging with Pino
- Error handling middleware
- CORS configuration

## 6. Folder Structure

```
src/
├── config/
│   ├── index.ts
│   └── env.ts
├── db/
│   ├── schema/
│   │   ├── index.ts
│   │   ├── users.ts
│   │   ├── reports.ts
│   │   ├── tasks.ts
│   │   ├── government_actions.ts
│   │   ├── verifications.ts
│   │   ├── notifications.ts
│   │   ├── refresh_tokens.ts
│   │   └── audit_logs.ts
│   ├── index.ts
│   └── migrations.ts
├── middleware/
│   ├── auth.ts
│   ├── rbac.ts
│   ├── error.ts
│   ├── rateLimit.ts
│   └── validation.ts
├── modules/
│   ├── auth/
│   │   ├── controller.ts
│   │   ├── service.ts
│   │   ├── router.ts
│   │   └── schemas.ts
│   ├── reports/
│   │   ├── controller.ts
│   │   ├── service.ts
│   │   ├── router.ts
│   │   ├── schemas.ts
│   │   └── prioritization.ts
│   ├── tasks/
│   │   ├── controller.ts
│   │   ├── service.ts
│   │   ├── router.ts
│   │   └── schemas.ts
│   ├── government/
│   │   ├── controller.ts
│   │   ├── service.ts
│   │   ├── router.ts
│   │   └── schemas.ts
│   ├── verification/
│   │   ├── controller.ts
│   │   ├── service.ts
│   │   ├── router.ts
│   │   └── schemas.ts
│   ├── notifications/
│   │   ├── controller.ts
│   │   ├── service.ts
│   │   ├── router.ts
│   │   └── schemas.ts
│   ├── users/
│   │   ├── controller.ts
│   │   ├── service.ts
│   │   ├── router.ts
│   │   └── schemas.ts
│   └── matching/
│       ├── service.ts
│       └── router.ts
├── utils/
│   ├── hash.ts
│   ├── jwt.ts
│   ├── fileUpload.ts
│   ├── geo.ts
│   └── helpers.ts
├── queues/
│   ├── notifications.ts
│   └── matching.ts
├── app.ts
├── server.ts
└── types/
    └── index.ts
```

## 7. Acceptance Criteria

1. All CRUD operations work for reports, tasks, and verifications
2. JWT authentication with refresh tokens works correctly
3. Role-based access control enforced on all routes
4. Drizzle schema compiles and migrations run successfully
5. File uploads work with proper validation
6. All API endpoints return proper status codes
7. Error handling middleware catches and returns proper errors
8. Rate limiting prevents abuse
9. API responds with proper pagination
10. Location-based queries work with PostGIS