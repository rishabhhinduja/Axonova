# Axonova

Axonova is an AI-powered adaptive study planner web application.

It includes:

- A React + Vite frontend (dashboard, planner, quiz, analytics, mentor)
- A lightweight integrated Node API in `server/` (currently used by the frontend)
- A production-style backend module in `backend/` (Express + MongoDB, layered architecture)

## Monorepo Layout

- `src/`: frontend application
- `server/`: integrated local API (file-backed JSON storage)
- `backend/`: production-style backend service (MongoDB + JWT + OAuth support)

## Frontend Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- TanStack Query

## Current Runtime (Recommended For Local Demo)

The frontend is currently wired to the integrated API (`server/`).

1. Start API:

```bash
node server/index.js
```

2. Start frontend:

```bash
npm run dev
```

3. Open the Local URL printed by Vite, for example:

- `http://localhost:8082`

API health endpoint:

- `http://localhost:4000/api/health`

## Environment

Create `.env` from `.env.example` in the root if needed.

Important vars:

- `VITE_API_BASE_URL` (defaults to `/api` in frontend code)
- `API_PORT` (default `4000` for `server/`)
- `CORS_ORIGIN` (supports comma-separated values)

## Production Backend Module

The `backend/` folder contains a deployment-oriented backend architecture:

- Controllers / Services / Routes / Middleware / Models / Config / Utils
- MongoDB via Mongoose
- JWT access + refresh auth
- Google OAuth token verification
- Validation, rate limiting, logging, Swagger docs

See full details in:

- `backend/README.md`

To run it:

```bash
cd backend
npm install
npm run dev
```

Default backend module health:

- `http://localhost:4001/health`

## Scripts (Root)

- `npm run dev`: start frontend
- `npm run build`: production build frontend
- `npm run dev:api`: start integrated API in `server/`

## Branding

Project name has been rebranded from NeuroPlan AI to Axonova.
