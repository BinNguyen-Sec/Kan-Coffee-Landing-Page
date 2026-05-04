# Changelog

All notable changes to the Kan Coffee Landing Page project will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) and [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) conventions.

---

## Format

Each release entry follows this structure:

```
## [VERSION] — YYYY-MM-DD

### Added      → New features
### Changed    → Changes to existing functionality
### Deprecated → Features soon to be removed
### Removed    → Features removed in this release
### Fixed      → Bug fixes
### Security   → Vulnerability fixes
```

---

## [Unreleased]

### Added
- Project repository initialized with enterprise folder structure
- PRD v1.1.0 (English + Vietnamese) added to `/docs`
- `.env.example` template committed for onboarding
- GitHub Actions workflows scaffolded (`ci.yml`, `deploy.yml`)
- PR template and issue templates added to `.github/`

---

## [0.1.0] — 2026-04-23

### Added
- Initial project documentation
  - `PRD-EN.md` — Full Product Requirements Document (English)
  - `PRD-VI.md` — Full Product Requirements Document (Vietnamese)
  - `SCHEMA.md` — Database schema design
  - `API.md` — API contract definition
  - `ARCHITECTURE.md` — System architecture overview
  - `CHANGELOG.md` — This file
- Brand identity defined
  - Color palette: `kan-primary`, `kan-mid`, `kan-light`, `kan-dark`, `kan-offwhite`, `kan-wood`
  - Tailwind CSS color token configuration
- Table inventory confirmed
  - Floor 1 Indoor: 13 bookable tables (`1I-01` → `1I-13`)
  - Floor 1 Outdoor: 18 walk-in only tables (`1O-01` → `1O-18`)
  - Floor 2 Indoor: 6 bookable tables (`2I-01` → `2I-06`)
  - Total bookable: 19 tables
- Booking flow defined
  - Manual confirmation by owner via Supabase Studio
  - Zalo Bot notification to internal group on new booking
  - Automated email to guest via Resend upon owner confirmation
  - Auto-release pending bookings after 15 minutes

---

## Versioning Strategy

This project follows **Semantic Versioning (SemVer)**:

```
MAJOR.MINOR.PATCH

MAJOR → Breaking changes (e.g. full redesign, architecture overhaul)
MINOR → New features, backward-compatible (e.g. new section, new integration)
PATCH → Bug fixes, copy updates, minor UI tweaks
```

### Pre-release versions (current phase)

| Version Range | Phase | Description |
|---|---|---|
| `0.1.x` | Phase 0–1 | Documentation & Design |
| `0.2.x` | Phase 2 | Project Setup & Infrastructure |
| `0.3.x` | Phase 3 | Development — Sprint 1 & 2 |
| `0.4.x` | Phase 3 | Development — Sprint 3 & 4 |
| `0.5.x` | Phase 4 | Testing & QA |
| `1.0.0` | Phase 5 | Production Go-Live |

---

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

Types:
  feat      → New feature
  fix       → Bug fix
  docs      → Documentation changes
  style     → Formatting, missing semicolons (no logic change)
  refactor  → Code restructure (no feature or fix)
  test      → Adding or updating tests
  chore     → Build process, dependency updates, tooling
  perf      → Performance improvements
  ci        → CI/CD configuration changes
  revert    → Reverts a previous commit

Examples:
  feat(booking): add real-time table status via Supabase Realtime
  fix(api): handle race condition on concurrent booking submissions
  docs(prd): update table inventory with confirmed floor plan
  chore(deps): upgrade Next.js to 14.2.0
  ci(github): add Lighthouse audit to CI workflow
```

---

## Release Process

1. All features merged into `develop` branch
2. QA sign-off on `develop`
3. PR from `develop` → `main`
4. Tag release: `git tag -a v1.0.0 -m "Release v1.0.0 — Production Go-Live"`
5. Push tag: `git push origin v1.0.0`
6. GitHub Action triggers production deploy to Vercel
7. Update `[Unreleased]` → `[1.0.0] — YYYY-MM-DD` in this file

## [0.2.0] — 2026-04-28

### Added
- Next.js 14 project initialized (App Router, TypeScript, Tailwind CSS, ESLint)
- Project dependencies installed
- Base folder structure merged with existing repo
- Installed production dependencies: @supabase/supabase-js, framer-motion, three, zod, resend, @sentry/nextjs
- Installed dev dependencies: @types/three, @types/node

## [0.3.0] — 2026-04-29

### Added
- Supabase project initialized (Singapore region)
- Database schema: tables + bookings
- Indexes, RLS policies, triggers, pg_cron auto-release
- Seed data: 37 tables (19 bookable, 18 walk-in)
- Supabase client (public) + admin (service role)
- TypeScript types: Table, Booking, CreateBookingInput
- Constants: BUSINESS_CONFIG, BOOKING_CONFIG, BRAND_COLORS
- Zod validation schema for booking input
- API Routes: GET /api/tables, GET /api/tables/:id,
  GET /api/bookings/availability, POST /api/bookings

  ## [0.4.0] — 2026-04-29

### Added
- Realtime hook: useRealtimeTables — Supabase WebSocket subscription
- Booking hook: useBooking — form submission state management
- BookingForm component with client-side validation
- BookingModal component with success state
- TableMap component — SVG isometric floor plan (Floor 1 + 2)
- FloorPlan section — realtime table status + booking integration
- Table position constants for both floors

### Notes
- Isometric map currently SVG-based (functional)
- 3D visual enhancement scheduled post go-live

## [0.5.0] — 2026-05-02

### Added
- Policy section: FAQ, opening hours, address, contact, reservation policy
- Zalo Bot notification on new booking submission
- Resend email template: BookingConfirmation
- Webhook endpoint: POST /api/webhooks/booking-confirmed
- sendConfirmation helper function

### Notes
- Supabase webhook (booking-confirmed) pending setup after Vercel deploy

## [0.6.0] — 2026-05-03

### Added
- Owner email notification on new booking (replacing Zalo Bot temporarily)
- HTML email templates for owner notification and guest confirmation

### Changed
- Email rendering switched from React components to HTML strings (Resend v6 compatibility)

### Notes
- Zalo OA pending approval — will replace email notification post go-live
- Guest confirmation email pending Supabase webhook setup (requires Vercel URL)

## [0.7.0] — 2026-05-04

### Performance
- Desktop Lighthouse: 49 → 99
- Mobile Lighthouse: 43 → 82
- Desktop LCP: 3.8s → 1.0s
- Desktop TBT: 2,010ms → 0ms

### Changed
- FloorPlan section lazy loaded with Next.js dynamic import
- Navigation lazy loaded with ssr: false
- Supabase Realtime subscription deferred 100ms
- Added font-display: swap for Inter and Playfair Display