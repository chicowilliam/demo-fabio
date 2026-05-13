# Meu Guia do Super (Demo)

Demo-ready React application for supermarket shoppers. The app helps users navigate shopping by sector, view sector-specific checklists, and search supermarkets with responsive, mobile-first UX.

## Stack

- React 18 + TypeScript + Vite
- React Router DOM (protected routing)
- Tailwind CSS + custom responsive CSS layers
- Local session auth scaffold (localStorage-based)

## Features

- Protected app area with login flow
- Sector-based shopping guide with route-oriented cards
- Supermarket search with filters and sorting
- Professional responsive UI for desktop and mobile
- Branded assets (custom SVG logo and PNG hero image)

## Routes

- `/login`: user access page
- `/`: dashboard with shopping sectors and planning cards
- `/setor/:sectorId`: sector detail with full checklist
- `/buscar-supermercados`: supermarket search and filter page

All app routes except `/login` are protected by authentication.

## Local run

1. Install Node.js 18+
2. Install dependencies:
   - `npm install`
3. Start development server:
   - `npm run dev`
4. Run type check:
   - `npm run typecheck`
5. Build for production:
   - `npm run build`
6. Preview production build:
   - `npm run preview`

## Backend (Express + Prisma)

This project now includes a backend in `api/`, following the same architecture style as the reference repository (Express + Prisma + PostgreSQL).

1. Install backend dependencies:
   - `npm install`
2. Create backend env file:
   - copy `api/.env.example` to `api/.env`
3. Generate Prisma client:
   - `npm run api:db:generate`
4. Run migrations (development):
   - `npm run api:db:migrate:dev`
5. Seed initial supermarkets data:
   - `npm run api:db:seed`
6. Start backend API:
   - `npm run api:dev`

Default API URL: `http://localhost:4000`
Health check: `GET /health`
Supermarkets route: `GET /api/supermarkets`

## Project layout

- `src/context/AuthContext.tsx`: authentication state and session handling
- `src/components/ProtectedRoute.tsx`: route guard
- `src/components/AppShell.tsx`: main app shell and navigation
- `src/pages/LoginPage.tsx`: login page
- `src/pages/DashboardPage.tsx`: sector dashboard
- `src/pages/SectorPage.tsx`: sector details
- `src/pages/SearchSupermarketsPage.tsx`: supermarket search UI
- `src/data/sectors.ts`: shopping sector dataset
- `src/data/supermarkets.ts`: supermarket dataset
- `public/brand-logo.svg`: branded favicon/logo
- `public/brand-hero.png`: branded hero image

## Notes

- This repository is focused on frontend demo experience and route protection patterns.
- Authentication is intentionally lightweight for demo purposes and does not include backend JWT validation.
