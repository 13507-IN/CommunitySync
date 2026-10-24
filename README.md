# 🛡️ Prahari (CommunitySync)
### *Next-Generation Civic Intelligence & Public Accountability Platform*

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-lightgrey?style=for-the-badge&logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-PostGIS-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45-C5F74F?style=for-the-badge&logo=drizzle)](https://orm.drizzle.team/)
[![Clerk Auth](https://img.shields.io/badge/Clerk-Authentication-6C47FF?style=for-the-badge&logo=clerk)](https://clerk.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-GIS_Maps-199900?style=for-the-badge&logo=leaflet)](https://leafletjs.com/)

---

## 🌐 Live Deployments

* **Frontend Application (Vercel):** [https://prahari-amber.vercel.app](https://prahari-amber.vercel.app)
* **Backend API (Render):** [https://prahari.onrender.com](https://prahari.onrender.com)
* **API Health Check:** [https://prahari.onrender.com/health](https://prahari.onrender.com/health)

---

## 📖 The Problem & Vision

Traditional municipal grievance portals are **black boxes**: citizens file complaints, receive a ticket number, and wait weeks with zero knowledge of:
* *Which department or officer is assigned to their issue?*
* *Is the government meeting its response-time targets?*
* *What work was actually done on-site?*

**Prahari** completely re-engineers civic governance into an **open, transparent, and multi-tier accountability network**. By bridging Citizens, Volunteers, NGOs, and Government Authorities on a shared geospatial ledger, every issue is tracked from speech-to-resolution with immutable audit logs, real-time SLA countdowns, and community peer verification.

---

## ✨ Key Features & Innovations

### 1. 🎙️ AI Voice Reporting Mode (Hands-Free Accessibility)
* **Natural Speech Capture**: Citizens can simply press *"Start Speaking"* and describe their issue in natural language (*e.g., "Deep pothole and broken streetlight near Central Market posing accident hazards at night"*).
* **Live Audio Visualizer**: Real-time waveform equalizer and on-screen speech-to-text transcript.
* **Instant Intent & Tag Extraction**: Automatically infers:
  * **Category**: Infrastructure, Environment, Health, Safety, Education.
  * **Urgency**: Automatically flagged as `HIGH` if danger/emergency keywords are detected.
  * **Title**: Synthesizes a concise civic report title.
* **1-Click Form Auto-Fill**: Populates the report without manual typing, advancing the user straight to the map.

### 2. 📍 GPS Reverse Geocoding (Live Road & Locality Detection)
* **Automated Street Resolution**: Dropping a pin on the map, using GPS location, or searching calls OpenStreetMap Nominatim to resolve coordinates into human-readable civic road and ward data (*e.g., "MG Road, Ward 5, Central District"*).
* **Live GPS-Lock Banner**: Visual confirmation badge displaying the verified roadway, suburb, and pincode right on the map interface.

### 3. 🛡️ Public Accountability Dossier ("Who is Responsible for this Issue?")
* **Assigned Department & Officer**: Displays the exact municipal division (*e.g., "Public Works & Road Maintenance"*) and the officer's name/email attached to the task.
* **Live SLA Countdown Clock**:
  * 24h for High Urgency, 48h for Medium, 72h for Low.
  * Dynamically computes elapsed time and hours remaining.
  * **Auto-Escalation**: If overdue, triggers an alert:  
    `⚠️ RESOLUTION OVERDUE — Auto-escalated to Chief Ward Officer`.
* **4-Stage Verified Audit Trail**:
  1. *Citizen Report Filed* (GPS Geotagged)
  2. *Department Claimed & Assigned* (Officer details & dispatch remarks)
  3. *Field Operations & Work Orders* (Active progress notes)
  4. *Community Verification* (Citizen audit before closure)
* Accessible directly from **Map Markers**, **Dashboard Activity Tables**, and **My Reports**.

### 4. 📋 Citizen "My Reports" Tracking Dashboard
* Dedicated portal at [`/my-reports`](https://prahari-amber.vercel.app/my-reports) for citizens to monitor all submitted issues.
* **Filter Tabs**: `ALL`, `AWAITING DEPT`, `ACTIVE WORK`, `RESOLVED`.
* **5-Step Visual Lifecycle Pipeline**: Clear progression indicators showing exact field status.
* **1-Click Accountability Inspection**: Opens the full responsibility dossier for any report.

### 5. 👥 Role-Based Workspaces & Route Protection
* Built on Clerk authentication with backend metadata synchronization:
  * **Volunteers / Citizens**: Dashboard, My Reports, Report Issue, Map View, Volunteer Network *(XP)*, Verification *(QA)*.
  * **Government Officials**: Exclusively access the **Government Action Panel** *(OFFICIAL)* alongside oversight maps and dashboards.
  * **NGOs**: Cross-sector coordination, volunteer task assignments, and community audits.
* **Route Protection Guards**: Unauthorized roles navigating to `/government` are blocked with an authoritative clearance notice.

### 6. 🔔 Live Civic Notification System
* Real-time notification bell with active unread counter badge.
* Interactive dropdown panel featuring relative timestamps (`2m ago`, `1h ago`), alert category tags, click-to-read, and **Mark All as Read** functionality.

### 7. 🗺️ PostGIS Geospatial Mapping & Radius Alerts
* PostgreSQL with **PostGIS geometry types** (`POINT(lng, lat)`).
* `ST_DWithin` spatial queries find nearby issues and automatically notify local volunteers and authorities within a dynamic radius.

---

## 🏗️ Architecture & Workflow

```mermaid
flowchart TD
    A["Citizen Files Report<br/>(Voice / Map Pin Drop)"] --> B["GPS Reverse Geocoding<br/>(OpenStreetMap Nominatim)"]
    B --> C["PostGIS Database & Spatial Index<br/>(Drizzle ORM + PostgreSQL)"]
    C --> D["Automated Proximity Alert<br/>(ST_DWithin to Nearby Users)"]
    
    C --> E["Municipal Authority Dashboard"]
    E --> F["Officer Claims Issue & Dispatches Crew"]
    F --> G["SLA Timer Active<br/>(24h / 48h / 72h Target)"]
    
    G --> H{"Resolved Within SLA?"}
    H -- Yes --> I["Official Marks Completed + Uploads Proof"]
    H -- No --> J["⚠️ Overdue Flag & Regional Escalation"]
    J --> I
    
    I --> K["Community Verification Queue"]
    K --> L["Peer Citizen Votes (Approve / Reject)"]
    L --> M["Permanent Verified Closure"]
```

---

## 📂 Project Structure

```
Prahari/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── index.ts               # PostgreSQL connection via pg & Drizzle
│   │   │   └── schema/                # Users, Reports, Tasks, Gov Actions, Verifications
│   │   ├── middleware/
│   │   │   ├── auth.ts                # Clerk JWT verification & auto-sync
│   │   │   └── validation.ts          # Zod schema validation middleware
│   │   ├── modules/
│   │   │   ├── auth/                  # Authentication & token services
│   │   │   ├── government/            # Government claim, progress & audit logs
│   │   │   ├── notifications/         # Notification feeds & unread counts
│   │   │   ├── reports/               # PostGIS spatial queries & report CRUD
│   │   │   ├── tasks/                 # Volunteer task assignment & XP
│   │   │   ├── users/                 # Role setup & Clerk metadata synchronization
│   │   │   └── verification/          # Citizen QA voting pipeline
│   │   ├── app.ts                     # Express application configuration
│   │   └── server.ts                  # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/
│   │   ├── (app)/
│   │   │   ├── dashboard/             # Main metrics, analytics & recent activity
│   │   │   ├── government/            # Official departmental control panel
│   │   │   ├── map/                   # Fullscreen geospatial view with filters
│   │   │   ├── my-reports/            # Citizen personal report tracking & SLA
│   │   │   ├── report/                # 3-step reporting wizard with Voice Mode
│   │   │   ├── settings/              # User preferences
│   │   │   ├── verification/          # Community quality assurance queue
│   │   │   └── volunteer/             # Volunteer task discovery & XP
│   │   ├── auth/                      # Clerk login, signup, and profile-setup
│   │   ├── layout.tsx                 # App layout with Header & NotificationBell
│   │   └── page.tsx                   # Swiss-designed Landing Page
│   ├── components/
│   │   ├── dashboard/                 # Sidebar, NotificationBell, Stats cards
│   │   ├── map/                       # Leaflet map picker & spatial markers
│   │   ├── report/                    # VoiceReportingCard (Web Speech API)
│   │   └── transparency/              # AccountabilityModal (Responsibility dossier)
│   ├── lib/
│   │   └── api.ts                     # Centralized typed HTTP API client
│   ├── package.json
│   └── tailwind.config.ts
│
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons |
| **Mapping & GIS** | Leaflet, React-Leaflet, OpenStreetMap Nominatim (Reverse Geocoding) |
| **Audio / Speech** | Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) |
| **Authentication** | Clerk Auth (`@clerk/nextjs`, `@clerk/backend`) with Public Metadata Sync |
| **Backend API** | Node.js, Express.js 4.21, TypeScript, Zod Schema Validation |
| **Database & ORM**| PostgreSQL with PostGIS extension, Drizzle ORM, Drizzle Kit |
| **Infrastructure** | Render (Backend Web Service), Vercel (Frontend Serverless) |

---

## 🚀 Local Development Setup

### 1. Prerequisites
* Node.js v20+ 
* PostgreSQL with PostGIS extension installed
* Clerk Account ([clerk.com](https://clerk.com))

---

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/prahari?sslmode=disable
CLERK_SECRET_KEY=your_clerk_secret_key
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
```

Push database migrations:
```bash
npm run db:push
```

Start the backend server:
```bash
npm run dev
# Server running on http://localhost:5000
```

---

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env.local` file in `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/auth/profile-setup
```

Start the development server:
```bash
npm run dev
# Frontend running on http://localhost:3000
```

---

## ⚖️ License
Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 🌟 Hackathon Highlights & Pitch Points
1. **Zero-Friction Reporting**: Citizens don't have to fill tedious forms—they can speak their issue in one sentence, and the system extracts category, urgency, and road name automatically.
2. **True Public Transparency**: Issues don't vanish into a database; every citizen can see which government officer claimed the issue, their dispatch notes, and whether the municipal SLA is being met.
3. **Citizen Empowerment**: No issue is closed until nearby residents vote to verify the quality of work.
