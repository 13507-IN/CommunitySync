# CommunitySync Backend

Production-ready backend API for CommunitySync platform connecting NGOs, volunteers, government authorities, and community members.

## Features

- **Authentication**: JWT + Refresh Token based auth with role-based access control
- **Reports Management**: Create, update, delete, and filter community issues
- **Prioritization Engine**: Automated urgency scoring for reports
- **Volunteer Matching**: Skill and location-based matching algorithm
- **Task Management**: Full task lifecycle tracking
- **Government Actions**: Track government department actions and proofs
- **Community Verification**: Majority voting system for issue closure
- **Notifications**: Real-time notification system
- **Geo Features**: Location-based queries and proximity matching

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: PostgreSQL with PostGIS
- **ORM**: Drizzle ORM
- **Auth**: JWT + Refresh Tokens
- **Validation**: Zod
- **Queue**: BullMQ + Redis
- **Logging**: Pino

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your configuration

# Generate database schema
npm run db:generate
npm run db:push

# Start development server
npm run dev
```

### Docker

```bash
# Start all services with Docker
docker-compose up -d
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Reports
- `POST /api/reports` - Create report
- `GET /api/reports` - Get all reports
- `GET /api/reports/:id` - Get report by ID
- `GET /api/reports/nearby` - Get nearby reports
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report

### Tasks
- `POST /api/tasks/assign` - Assign task
- `GET /api/tasks/user` - Get user tasks
- `PATCH /api/tasks/:id/status` - Update task status

### Government
- `POST /api/gov/action` - Submit government action
- `GET /api/gov/report/:reportId` - Get report actions
- `PATCH /api/gov/report/:reportId/status` - Update status

### Verification
- `POST /api/verify` - Submit verification vote
- `GET /api/verify/:reportId` - Get report verifications

### Notifications
- `GET /api/notifications` - Get notifications
- `PATCH /api/notifications/:id/read` - Mark as read

### Matching
- `GET /api/matching/volunteers` - Get recommended volunteers
- `GET /api/matching/tasks` - Get available tasks

## Database Schema

The application uses Drizzle ORM with the following main tables:

- `users` - User accounts with roles
- `reports` - Community issue reports
- `tasks` - Task assignments
- `government_actions` - Government department actions
- `verifications` - Community verification votes
- `notifications` - User notifications
- `refresh_tokens` - JWT refresh tokens
- `audit_logs` - Audit trail

## Environment Variables

See `.env.example` for all configuration options.

## Building for Production

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

## License

MIT