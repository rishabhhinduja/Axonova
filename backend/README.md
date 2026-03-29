# Axonova Backend

Production-oriented Express + MongoDB backend for Axonova.

## Features

- JWT auth (access + refresh tokens)
- Google OAuth token verification
- Secure password hashing with bcrypt
- Adaptive study planning logic
- Spaced repetition scheduling (Day 1/3/7/14)
- Task miss auto-rescheduling with higher priority
- Quiz weakness detection and analytics prediction
- Rate limiting, Helmet, CORS, Zod validation
- Winston logging and centralized error handling
- Swagger docs at `/docs`

## Structure

/backend/src
- controllers
- models
- routes
- middleware
- services
- config
- utils

## Setup

1. Copy `.env.example` to `.env`
2. Configure MongoDB and secrets
3. Install deps:
   - `npm install`
4. Run:
   - `npm run dev`

## API Base

- `http://localhost:4001/api`

## Main Endpoints

- POST `/api/auth/signup`
- POST `/api/auth/login`
- POST `/api/auth/google`
- POST `/api/auth/refresh`
- POST `/api/auth/logout`
- GET `/api/user/profile`
- PUT `/api/user/update`
- POST `/api/plan/generate`
- GET `/api/plan/today`
- PUT `/api/plan/update`
- POST `/api/task/complete`
- POST `/api/task/miss`
- POST `/api/quiz/submit`
- GET `/api/quiz/history`
- GET `/api/analytics/dashboard`

## Notes

- For Google Sign-In, send frontend ID token to `/api/auth/google`.
- Access token should be sent in `Authorization: Bearer <token>` header.
