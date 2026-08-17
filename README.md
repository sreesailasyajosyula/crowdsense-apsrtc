# CrowdSense AI — APSRTC Passenger Intelligence Platform

A full-stack platform for collecting real-time bus crowd data from
passengers and generating AI-assisted recommendations for transport
authorities.
## 🔗 Live Demo
- **Passenger Site:** [crowdsense-apsrtc.vercel.app](https://crowdsense-apsrtc.vercel.app)
- **Admin Panel:** [crowdsense-apsrtc.vercel.app/admin](https://crowdsense-apsrtc.vercel.app/admin)

## Tech stack

- **Frontend:** React + Vite + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Database & Auth:** Firebase Firestore + Firebase (custom-token based
  phone OTP authentication)

## Features

- Phone-number OTP login (free, custom-built OTP system — no Firebase
  Blaze billing plan required)
- Passenger dashboard: journey stats, recent history, route insights
- Add Journey form with duplicate-submission protection
- My Journey: search, filter, delete your own submissions
- Route Insights: real-time, community-wide crowd levels per route
- Admin Dashboard: all submissions, filters, spam deletion, analytics
  charts
- Rule-based AI Recommendation Engine: flags routes needing more buses
  based on real passenger reports, with admin approve/reject workflow

## Project structure

```
crowdsense/
├── src/               # React frontend
│   ├── pages/          # Route-level pages (Dashboard, AddJourney, etc.)
│   ├── pages/admin/     # Admin panel pages
│   ├── components/      # Shared UI components
│   ├── contexts/        # NavigationContext (auth), AdminContext, LanguageContext
│   ├── lib/              # firebase.ts, authService.ts, api.ts
│   └── i18n/              # English + Telugu translations
│
└── server/            # Express backend
    ├── src/
    │   ├── routes/        # Express route definitions
    │   ├── controllers/    # Request handlers
    │   ├── services/        # Business logic (Firestore queries, scoring, AI engine)
    │   ├── middleware/       # Auth verification, admin check, error handling
    │   ├── models/            # Firestore document type definitions
    │   └── config/             # Firebase Admin SDK init
    └── .env.example        # Copy to .env and fill in your own values
```

## Setup

### 1. Firebase project

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication** (Phone doesn't need to be turned on — this
   project uses a custom OTP system to avoid requiring a paid plan; see
   note below)
3. Create a **Firestore Database** (test mode is fine to start)
4. Register a **Web app** to get your `firebaseConfig` — paste those
   values into `src/lib/firebase.ts`
5. Generate a **Service Account key** (Project Settings → Service
   accounts → Generate new private key) — save the JSON file somewhere
   **outside version control**, e.g. `server/secrets/serviceAccountKey.json`

### 2. Backend

```bash
cd server
npm install
cp .env.example .env
# Edit .env: point FIREBASE_SERVICE_ACCOUNT_PATH at your service account
# JSON, set FIREBASE_PROJECT_ID, and list your admin phone number(s) in
# ADMIN_PHONE_NUMBERS
npm run dev
```

Runs on `http://localhost:5000`.

### 3. Frontend

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173`. Admin panel is at `/admin`.

## Why a custom OTP system instead of Firebase Phone Auth?

Firebase's real Phone Authentication now requires the paid **Blaze**
plan, even for test numbers. To keep this project fully free, OTPs are
generated and verified by the backend itself (stored in Firestore with a
5-minute expiry), then a Firebase **custom token** is issued so the
frontend still gets a real Firebase Auth session. In development, the
generated OTP is returned directly in the API response and shown on
screen. **Before using this in production, swap `sendOtp` in
`server/src/controllers/otp.controller.ts` to call a real SMS provider
instead of returning the code directly.**

## AI Recommendation Engine

The engine (`server/src/services/recommendation.service.ts`) is
rule-based: it groups journeys by route + hour, and flags any group
that crosses two configurable thresholds (`RECOMMENDATION_MIN_REPORTS`,
`RECOMMENDATION_MIN_CROWD_SCORE` in `.env`). It's intentionally isolated
in a single function so it can be swapped for a real Gemini AI call
later without touching any other part of the app.

## Security notes before deploying publicly

- Never commit `.env` or `server/secrets/` — both are already
  git-ignored
- Tighten the `cors()` call in `server/src/app.ts` to your real frontend
  domain before deploying
- Lock down Firestore security rules (currently in test mode, which
  allows broad read/write) before going to production
