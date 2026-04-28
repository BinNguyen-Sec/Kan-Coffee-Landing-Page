# System Architecture — Kan Coffee Landing Page

> **Version:** 1.0.0  
> **Last Updated:** April 23, 2026  
> **Status:** Approved

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture Diagram](#2-architecture-diagram)
3. [Component Breakdown](#3-component-breakdown)
4. [Data Flow](#4-data-flow)
   - [Page Load Flow](#41-page-load-flow)
   - [Booking Submission Flow](#42-booking-submission-flow)
   - [Owner Confirmation Flow](#43-owner-confirmation-flow)
   - [Auto-release Flow](#44-auto-release-flow)
5. [Frontend Architecture](#5-frontend-architecture)
6. [Backend Architecture](#6-backend-architecture)
7. [Database Architecture](#7-database-architecture)
8. [Real-time Architecture](#8-real-time-architecture)
9. [Third-party Services](#9-third-party-services)
10. [Infrastructure & Deployment](#10-infrastructure--deployment)
11. [Security Architecture](#11-security-architecture)
12. [Performance Strategy](#12-performance-strategy)
13. [Scalability Roadmap](#13-scalability-roadmap)

---

## 1. Overview

Kan Coffee Landing Page is a **production-grade, full-stack web application** built on Next.js 14 with a real-time table reservation system powered by Supabase.

### Core Design Principles

| Principle | Application |
|---|---|
| **API-first** | Backend API contracts defined before frontend implementation |
| **Real-time by default** | Table status synced live across all connected clients via WebSocket |
| **Security at every layer** | RLS at DB level, input validation at API level, rate limiting at edge |
| **Mobile-first** | UI designed for 375px viewport, scaled up to desktop |
| **Scalable foundation** | MVP architecture designed to support Phase 2 features without full rewrite |
| **Separation of concerns** | UI, business logic, and data access are strictly separated |

---

## 2. Architecture Diagram

```
╔══════════════════════════════════════════════════════════════╗
║                        CLIENT LAYER                         ║
║                                                              ║
║  ┌─────────────────────────────────────────────────────┐    ║
║  │              Next.js 14 (App Router)                │    ║
║  │                                                     │    ║
║  │  ┌──────────────┐  ┌──────────────┐                │    ║
║  │  │ Framer Motion│  │   Three.js   │                │    ║
║  │  │  Animations  │  │ Isometric Map│                │    ║
║  │  └──────────────┘  └──────────────┘                │    ║
║  │                                                     │    ║
║  │  ┌─────────────────────────────────────────────┐   │    ║
║  │  │        Supabase Realtime Client             │   │    ║
║  │  │        (WebSocket Connection)               │   │    ║
║  │  └─────────────────────────────────────────────┘   │    ║
║  └─────────────────────────────────────────────────────┘    ║
╚══════════════════════════╦═══════════════════════════════════╝
                           ║ HTTPS / REST
╔══════════════════════════╩═══════════════════════════════════╗
║                        API LAYER                            ║
║                                                              ║
║  ┌─────────────────────────────────────────────────────┐    ║
║  │           Next.js API Routes (/api/*)               │    ║
║  │                                                     │    ║
║  │  GET  /api/tables                                   │    ║
║  │  GET  /api/tables/:id                               │    ║
║  │  GET  /api/bookings/availability                    │    ║
║  │  POST /api/bookings                                 │    ║
║  │  POST /api/webhooks/booking-confirmed               │    ║
║  │                                                     │    ║
║  │  [Input Validation] [Rate Limiting] [Auth Check]    │    ║
║  └──────────┬──────────────────────┬───────────────────┘    ║
╚═════════════╬════════════════════════╬══════════════════════╝
              ║                        ║
     ╔════════╩════════╗     ╔═════════╩═════════════════╗
     ║   DATA LAYER    ║     ║   INTEGRATION LAYER       ║
     ║                 ║     ║                           ║
     ║  ┌───────────┐  ║     ║  ┌─────────────────────┐ ║
     ║  │ Supabase  │  ║     ║  │   Zalo Bot API      │ ║
     ║  │ PostgreSQL│  ║     ║  │   (Notify team)     │ ║
     ║  │           │  ║     ║  └─────────────────────┘ ║
     ║  │ Realtime  │  ║     ║                           ║
     ║  │ WebSocket │  ║     ║  ┌─────────────────────┐ ║
     ║  │           │  ║     ║  │   Resend Email      │ ║
     ║  │ RLS       │  ║     ║  │   (Confirm guest)   │ ║
     ║  │ Triggers  │  ║     ║  └─────────────────────┘ ║
     ║  │ pg_cron   │  ║     ║                           ║
     ║  └───────────┘  ║     ╚═══════════════════════════╝
     ╚═════════════════╝
```

---

## 3. Component Breakdown

| Component | Technology | Responsibility |
|---|---|---|
| **Frontend** | Next.js 14 + Tailwind CSS | UI rendering, routing, SSG/SSR |
| **Animations** | Framer Motion | Scroll effects, glitch/glow, modal transitions |
| **Isometric Map** | Three.js | 3D floor plan rendering, table interaction |
| **Realtime Client** | Supabase JS SDK | WebSocket subscription to table status changes |
| **API Routes** | Next.js API Routes | Business logic, validation, orchestration |
| **Database** | Supabase (PostgreSQL) | Persistent data storage with RLS |
| **Realtime Server** | Supabase Realtime | Broadcasts DB changes to all connected clients |
| **DB Automation** | PostgreSQL Triggers + pg_cron | Auto-sync table status, auto-release pending bookings |
| **Notifications** | Zalo Bot API | Notifies internal team on new bookings |
| **Email** | Resend + React Email | Sends confirmation email to guest on owner confirm |
| **Hosting** | Vercel | Edge deployment, CI/CD, preview environments |
| **Monitoring** | Sentry | Error tracking and alerting in production |
| **Analytics** | Vercel Analytics | Core Web Vitals, page views |

---

## 4. Data Flow

### 4.1 Page Load Flow

```
Browser requests kan-coffee.vercel.app
        │
        ▼
Vercel Edge Network
        │
        ▼
Next.js SSG — serves pre-rendered HTML
        │
        ├── Hero section        → static, no data fetch
        ├── Inspired Story      → static, no data fetch
        ├── Floor Plan section  → fetches GET /api/tables on mount
        └── Policy section      → static, no data fetch
        │
        ▼
Floor Plan component mounts
        │
        ├── Three.js renders isometric map with table positions
        ├── Colors tables based on initial status from API response
        └── Subscribes to Supabase Realtime WebSocket
                │
                ▼
        Connection established
        Live status updates received from this point forward
```

### 4.2 Booking Submission Flow

```
Guest clicks available table on isometric map
        │
        ▼
BookingModal opens (table pre-selected)
        │
        ▼
Guest fills: Name, Phone, Email, Date, Time, Duration
        │
        ▼
Client-side validation (immediate feedback)
  ├── All fields required
  ├── Email format check
  ├── Phone: 10–11 digits
  ├── Date: not in the past
  └── Time: between 07:00 – 22:30
        │
        ▼
Guest clicks "Confirm Reservation"
        │
        ▼
POST /api/bookings
        │
        ├── Server-side validation (re-validate all fields)
        ├── Check table is_bookable = true
        ├── Check table status = 'available'
        └── Check no booking overlap for this date/time
        │
        ▼
Supabase: INSERT INTO bookings (status: 'pending')
        │
        ▼
DB Trigger: fn_set_table_pending()
  → UPDATE tables SET status = 'pending'
        │
        ▼
Supabase Realtime broadcasts UPDATE event
  → ALL connected clients receive table status change
  → Isometric map updates table color → 🟡 Pending
        │
        ▼
Zalo Bot API: send message to internal group
  → Team notified of new booking details
        │
        ▼
API returns 201 Created
        │
        ▼
BookingModal shows success state
  → "Booking submitted! Awaiting confirmation."
```

### 4.3 Owner Confirmation Flow

```
Owner receives Zalo notification
        │
        ▼
Owner opens Supabase Studio
        │
        ▼
Owner updates booking: status → 'confirmed'
        │
        ▼
DB Trigger: fn_sync_table_status()
  → UPDATE tables SET status = 'booked'
        │
        ▼
Supabase Realtime broadcasts UPDATE event
  → ALL connected clients receive table status change
  → Isometric map updates table color → 🔴 Booked
        │
        ▼
Supabase Database Webhook fires
  → POST /api/webhooks/booking-confirmed
        │
        ▼
Resend API: send confirmation email to guest
  → "✅ Your table at Kan Coffee is confirmed!"
```

### 4.4 Auto-release Flow

```
pg_cron job runs every minute
        │
        ▼
SELECT bookings WHERE status = 'pending' AND expires_at < NOW()
        │
        ├── No expired bookings found → exit
        │
        └── Expired bookings found
                │
                ▼
        UPDATE bookings SET status = 'cancelled'
                │
                ▼
        DB Trigger: fn_sync_table_status()
          → UPDATE tables SET status = 'available'
                │
                ▼
        Supabase Realtime broadcasts UPDATE event
          → ALL connected clients receive table status change
          → Isometric map updates table color → 🟢 Available
```

---

## 5. Frontend Architecture

### Folder Structure

```
src/
├── app/
│   ├── layout.tsx                # Root layout — fonts, metadata, providers
│   ├── page.tsx                  # Landing page — composes all sections
│   └── api/                      # API Routes (see Backend Architecture)
│
├── components/
│   ├── ui/                       # Primitive, reusable components
│   │   ├── Button.tsx            # Primary, secondary, ghost variants
│   │   ├── Modal.tsx             # Accessible modal with focus trap
│   │   └── Accordion.tsx         # FAQ accordion with animation
│   │
│   ├── sections/                 # Full-page sections
│   │   ├── Hero.tsx
│   │   ├── InspiredStory.tsx
│   │   ├── FloorPlan.tsx
│   │   └── Policy.tsx
│   │
│   └── booking/                  # Booking feature components
│       ├── BookingModal.tsx
│       ├── BookingForm.tsx
│       └── TableMap.tsx
│
├── hooks/
│   ├── useBooking.ts             # Booking submission logic + state
│   └── useRealtimeTables.ts      # Supabase Realtime subscription
│
├── types/
│   ├── table.ts
│   └── booking.ts
│
└── constants/
    ├── tables.ts                 # Table positions for isometric map
    └── config.ts                 # Opening hours, business info
```

### Rendering Strategy

| Section | Strategy | Reason |
|---|---|---|
| Hero | SSG (static) | Never changes, maximum performance |
| Inspired Story | SSG (static) | Content changes infrequently |
| Floor Plan | CSR (client-side) | Requires Realtime WebSocket + Three.js |
| Policy / Info | SSG (static) | Never changes at runtime |

### Component Tree

```
page.tsx (server component)
    │
    ├── Hero                (server — static)
    ├── InspiredStory       (server — static)
    ├── FloorPlan           (client — 'use client')
    │       │
    │       ├── TableMap    (Three.js — client only)
    │       │     └── useRealtimeTables() hook
    │       │
    │       └── BookingModal (client only)
    │               └── BookingForm
    │                     └── useBooking() hook
    │
    └── Policy              (server — static)
```

---

## 6. Backend Architecture

### API Route Structure

```
src/app/api/
├── tables/
│   ├── route.ts                      # GET /api/tables
│   └── [id]/
│       └── route.ts                  # GET /api/tables/:id
│
├── bookings/
│   ├── route.ts                      # POST /api/bookings
│   └── availability/
│       └── route.ts                  # GET /api/bookings/availability
│
└── webhooks/
    └── booking-confirmed/
        └── route.ts                  # POST /api/webhooks/booking-confirmed
```

### Request Lifecycle

```
Incoming Request
      │
      ▼
Rate Limiter (IP-based sliding window)
      │
      ▼
Input Validation (Zod schema)
      │
      ▼
Business Logic
  ├── Supabase query / mutation
  ├── Zalo Bot call (if new booking)
  └── Resend call (if booking confirmed)
      │
      ▼
Structured JSON Response
```

### Validation Schema Example

```typescript
// src/lib/validations/booking.ts
import { z } from 'zod'

export const createBookingSchema = z.object({
  table_id:     z.string().uuid(),
  guest_name:   z.string().min(2).max(100),
  phone:        z.string().regex(/^0\d{9,10}$/),
  email:        z.string().email().max(254),
  date:         z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  start_time:   z.string().regex(/^([0-1]\d|2[0-2]):([0-5]\d)$/),
  duration_min: z.enum(['60', '90', '120']).transform(Number),
})

export type CreateBookingInput = z.infer<typeof createBookingSchema>
```

---

## 7. Database Architecture

See [`SCHEMA.md`](./SCHEMA.md) for full schema, indexes, RLS policies, triggers, and seed data.

### Summary

```
PostgreSQL (via Supabase)
├── tables          — 37 total (19 bookable, 18 walk-in only)
├── bookings        — reservation records (never hard-deleted)
├── Indexes         — 5 performance indexes
├── RLS Policies    — public read, service role write
├── Triggers        — auto-sync table status on booking changes
└── pg_cron         — auto-release pending bookings every minute
```

---

## 8. Real-time Architecture

### How It Works

Supabase Realtime uses **PostgreSQL logical replication** to stream row-level changes to connected clients via WebSocket.

```
PostgreSQL WAL (Write-Ahead Log)
        │
        ▼
Supabase Realtime Server
        │
        ▼ WebSocket broadcast
All connected browser clients
        │
        ▼
useRealtimeTables() hook
        │
        ▼
React state update
        │
        ▼
Three.js re-renders table color on isometric map
```

### Subscription Scope

The frontend subscribes **only to the `tables` table** — not `bookings`. This is intentional:

- Guests should only see table availability, not booking details
- Booking PII (guest name, phone, email) is sensitive — never exposed to client

### Latency Expectation

| Event | Expected Latency |
|---|---|
| Guest submits → table turns 🟡 | < 500ms |
| Owner confirms → table turns 🔴 | < 1s |
| Auto-release → table turns 🟢 | < 60s (cron runs every minute) |

---

## 9. Third-party Services

| Service | Purpose | Tier | Limit |
|---|---|---|---|
| **Supabase** | PostgreSQL + Realtime + Webhooks | Free | 500MB DB, 2GB bandwidth/month |
| **Vercel** | Hosting + CI/CD + Analytics | Hobby (Free) | 100GB bandwidth/month |
| **Resend** | Transactional email | Free | 3,000 emails/month |
| **Zalo Bot API** | Internal team notifications | Free | Rate limited by Zalo |
| **Sentry** | Error monitoring | Free | 5,000 errors/month |

### Free Tier Risk Assessment

| Service | Risk | Mitigation |
|---|---|---|
| Supabase | DB storage or bandwidth exceeded | Monitor dashboard, upgrade to Pro ($25/mo) if needed |
| Resend | Email limit exceeded | 3,000/month far exceeds expected booking volume |
| Zalo Bot | Rate limited on burst | Request queue with exponential backoff retry |
| Vercel | Bandwidth exceeded | Unlikely for a single café landing page |

---

## 10. Infrastructure & Deployment

### Environments

| Environment | Branch | URL | Purpose |
|---|---|---|---|
| Development | `feature/*` | `localhost:3000` | Local development |
| Preview | `develop` | `*.vercel.app` (auto) | PR review, QA |
| Production | `main` | `kan-coffee.vercel.app` | Live site |

### Branching Strategy (Git Flow)

```
main          ← production, protected branch
  │
develop       ← integration branch
  │
feature/hero-section
feature/isometric-map
feature/booking-modal
feature/supabase-realtime
  │           ← one branch per feature, merged to develop via PR
  │
hotfix/critical-bug
              ← branched from main, merged back to main AND develop
```

### CI/CD Pipeline

```
Push to feature/* branch
        │
        ▼
GitHub Actions: ci.yml
  ├── ESLint
  ├── TypeScript type check
  └── Unit tests
        │
        ▼ (on pass)
Vercel auto preview deployment
  → Preview URL posted to PR
        │
        ▼ (PR merged to develop)
QA testing on preview environment
        │
        ▼ (PR merged to main)
GitHub Actions: deploy.yml
  └── Vercel production deployment
```

### Environment Variables

```bash
# .env.example

# Supabase
NEXT_PUBLIC_SUPABASE_URL=           # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # Safe to expose to browser (RLS enforced)
SUPABASE_SERVICE_ROLE_KEY=          # NEVER expose to browser — server only

# Resend
RESEND_API_KEY=                     # Server only

# Zalo Bot
ZALO_BOT_ACCESS_TOKEN=              # Server only
ZALO_GROUP_ID=                      # Target group for booking notifications

# App
NEXT_PUBLIC_APP_URL=                # https://kan-coffee.vercel.app
```

---

## 11. Security Architecture

### Threat Model

| Threat | Mitigation |
|---|---|
| Unauthorized DB write | RLS — anon key can only INSERT bookings with valid constraints |
| Spam / bot booking | Rate limiting: 5 requests per IP per 10 minutes on POST /api/bookings |
| Double booking race condition | PostgreSQL trigger `fn_check_booking_overlap()` enforces at DB level |
| Sensitive data exposure | Booking PII never returned to public client |
| Service role key leakage | Stored only in server-side env vars, never in client bundle |
| XSS via user input | All input sanitized via Zod before any DB write |
| CSRF | Next.js API Routes are same-origin by default; no cookie auth used |

### Data Privacy

| Data | Stored | Exposed to client |
|---|---|---|
| Table status | DB | Yes (required for map rendering) |
| Table positions | DB | Yes (required for map rendering) |
| Guest name | DB | No |
| Guest phone | DB | No |
| Guest email | DB | No |
| Booking date/time | DB | No (only status is public) |

---

## 12. Performance Strategy

### Core Web Vitals Targets

| Metric | Target | Strategy |
|---|---|---|
| LCP | < 2.5s | SSG for static sections, optimized hero image via `next/image` |
| FID | < 100ms | Minimal JS on initial load, Three.js loaded lazily |
| CLS | < 0.1 | Explicit width/height on all images and map canvas |

### Optimization Techniques

| Area | Technique |
|---|---|
| Images | `next/image` — automatic WebP, lazy loading, hero uses `priority` prop |
| Three.js | Dynamic import with `ssr: false` — loads only when Floor Plan section mounts |
| Framer Motion | Animations trigger only when section enters viewport (Intersection Observer) |
| Fonts | `next/font` — self-hosted Google Fonts, no render blocking |
| API caching | `/api/tables` cached for 5 seconds at Vercel Edge |

---

## 13. Scalability Roadmap

The current architecture supports the following Phase 2 features without structural changes:

| Feature | What needs to be added |
|---|---|
| **Custom Admin Dashboard** | New routes under `/admin`, protected by Supabase Auth |
| **Customer Auth + Booking History** | Add `customers` table, Supabase Auth, `customer_id` FK on `bookings` |
| **Online Menu / Pre-order** | Add `menu_items` and `order_items` tables, new API routes |
| **Zalo OA API** | Swap `src/lib/zalo/notify.ts` implementation only — no other changes |
| **Payment / Deposit** | Add `payments` table, integrate Stripe or VNPay in `src/lib/` |
| **Multi-location** | Add `locations` table, add `location_id` FK on `tables` |

> **Principle:** Phase 2 features extend the architecture — they do not replace it.