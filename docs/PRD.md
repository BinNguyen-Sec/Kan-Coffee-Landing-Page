# PRD — Kan Coffee Landing Page

> **Document Version:** 1.1.0  
> **Status:** Review — Pending Final Sign-off  
> **Author:** BinNguyen  
> **Last Updated:** April 22, 2026

---

## Table of Contents

1. [Document Control](#1-document-control)
2. [Executive Summary](#2-executive-summary)
3. [Problem Statement](#3-problem-statement)
4. [Goals & Success Metrics](#4-goals--success-metrics)
5. [Scope](#5-scope)
6. [User Personas](#6-user-personas)
7. [Functional Requirements](#7-functional-requirements)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [Brand Identity](#9-brand-identity)
10. [Tech Stack](#10-tech-stack)
11. [System Architecture](#11-system-architecture)
12. [Database Schema](#12-database-schema)
13. [Booking Flow](#13-booking-flow)
14. [Page Sections Summary](#14-page-sections-summary)
15. [Operational Information](#15-operational-information)
16. [Risk Register](#16-risk-register)
17. [Milestones & Timeline](#17-milestones--timeline)
18. [Open Questions](#18-open-questions)

---

## 1. Document Control

| Field | Detail |
|---|---|
| Project Name | Kan Coffee — Official Landing Page |
| Document Type | Product Requirements Document (PRD) |
| Version | 1.1.0 |
| Status | Review — Pending Final Sign-off |
| Owner | Đăng Phạm |
| Stakeholder | Kan Coffee Team |

### Changelog

| Version | Date | Changes |
|---|---|---|
| 1.0.0 | April 21, 2026 | Initial draft |
| 1.1.0 | April 22, 2026 | Resolved all open questions — table inventory, opening hours, brand colors, inspired story, booking flow, timeline, address |

---

## 2. Executive Summary

Kan Coffee is a café and co-working space located at 35 D5, Ward 25, Thanh My Tay, Ho Chi Minh City, Vietnam. The business currently lacks a digital presence. This project delivers a production-grade landing page serving three core purposes: **brand storytelling**, **real-time table reservation**, and **operational information**.

The product is built to production standards with a scalable architecture, enabling future phases such as online ordering and a loyalty program.

---

## 3. Problem Statement

> *"Potential customers cannot discover Kan Coffee online, cannot check table availability, and have no digital channel to make a reservation — resulting in missed revenue and a poor customer experience."*

---

## 4. Goals & Success Metrics

### 4.1 Business Goals

- Establish Kan Coffee's digital presence
- Reduce friction in the table booking process
- Communicate brand identity and story to new and returning customers

### 4.2 Key Performance Indicators (KPIs)

| Metric | Target |
|---|---|
| Lighthouse Performance Score | ≥ 90 |
| Lighthouse SEO Score | ≥ 95 |
| Lighthouse Accessibility Score | ≥ 85 |
| Largest Contentful Paint (LCP) | < 2.5s |
| First Input Delay (FID) | < 100ms |
| Cumulative Layout Shift (CLS) | < 0.1 |
| Booking form completion rate | ≥ 60% of visitors who open modal |
| Double-booking incidents | 0 |

---

## 5. Scope

### 5.1 In Scope — MVP (Phase 1)

- Landing page with all defined sections
- Real-time interactive isometric floor plan (Floor 1 + Floor 2)
- Table reservation system powered by Supabase backend
- Zalo Bot notification to internal team group
- Automated email confirmation to guest upon owner confirmation
- Responsive design — mobile, tablet, desktop
- SEO metadata, Open Graph tags, sitemap, LocalBusiness structured data

### 5.2 Out of Scope — Phase 2+

- Online ordering / pre-order menu
- Customer authentication & booking history
- Custom-built admin dashboard
- Loyalty / rewards program
- Payment or deposit integration
- Zalo Official Account API *(migration from Zalo Bot)*
- Multi-language support

---

## 6. User Personas

### Persona A — The Student / Remote Worker

| Field | Detail |
|---|---|
| Age | 18–28 |
| Need | A quiet space with stable WiFi to study or work |
| Behavior | Discovers via Google Search or social media, checks ambiance online, wants to reserve a spot in advance |

### Persona B — The Casual Coffee Drinker

| Field | Detail |
|---|---|
| Age | 22–35 |
| Need | A chill place to relax or hang out with friends |
| Behavior | Browses the café's story and vibe, checks table availability before visiting |

### Persona C — The Café Owner / Staff (Internal User)

| Field | Detail |
|---|---|
| Role | Owner / Staff |
| Need | Receive instant booking notifications, confirm or cancel bookings easily |
| Behavior | Receives Zalo notification → logs into Supabase Studio to confirm or cancel |

---

## 7. Functional Requirements

### 7.1 Hero / Main Section

| ID | Requirement | Priority |
|---|---|---|
| F-001 | Display café name, tagline, and primary CTA ("Reserve a Table") | Must Have |
| F-002 | Full-viewport hero with high-quality visual and animation | Must Have |
| F-003 | Smooth scroll navigation to all sections | Must Have |

### 7.2 Inspired Story Section

| ID | Requirement | Priority |
|---|---|---|
| F-004 | Display brand origin story with scroll-triggered animations | Must Have |
| F-005 | Narrative layout with real photos of the café | Must Have |

### 7.3 Isometric Floor Plan + Booking Section

| ID | Requirement | Priority |
|---|---|---|
| F-006 | Render 3D isometric floor plan for Floor 1 and Floor 2 (tables and structure only, no decor) | Must Have |
| F-007 | Tables display real-time status: Available 🟢 / Pending 🟡 / Booked 🔴 | Must Have |
| F-008 | Clicking an available table opens the booking modal | Must Have |
| F-009 | Booking modal collects: Full Name, Phone Number, Email, Date, Time, Duration | Must Have |
| F-010 | On submit: insert booking (pending) → Zalo Bot notifies team → owner confirms → email sent to guest → table turns 🔴 | Must Have |
| F-011 | Table hover effect: glitch + glow animation | Must Have |
| F-012 | Pending and Booked tables are not clickable | Must Have |
| F-013 | Auto-release pending booking if not confirmed within 15 minutes | Should Have |
| F-014 | Outdoor tables visible on map with "Walk-in Only" label — not clickable | Must Have |
| F-015 | Booking time validation: only allow reservations between 07:00–22:30 | Must Have |
| F-016 | Zalo Bot sends message to internal group on new booking: name, phone, table, date, time | Must Have |

### 7.4 Policy / Info Section

| ID | Requirement | Priority |
|---|---|---|
| F-017 | FAQ accordion component | Must Have |
| F-018 | Contact information (phone, email, social links) | Must Have |
| F-019 | Physical address with embedded Google Maps | Must Have |
| F-020 | Opening hours display | Must Have |
| F-021 | Reservation policy (cancellation, late arrival) | Should Have |

---

## 8. Non-Functional Requirements

| ID | Requirement | Detail |
|---|---|---|
| NF-001 | Performance | LCP < 2.5s, FID < 100ms, CLS < 0.1 |
| NF-002 | Responsiveness | Mobile-first; breakpoints at 375px / 768px / 1280px |
| NF-003 | SEO | Meta tags, OG image, LocalBusiness structured data (JSON-LD) |
| NF-004 | Accessibility | WCAG 2.1 AA compliance |
| NF-005 | Security | Supabase Row Level Security (RLS) enabled, input sanitization, API rate limiting |
| NF-006 | Availability | 99.9% uptime via Vercel + Supabase |
| NF-007 | Scalability | Architecture must support Phase 2 features without a full rewrite |

---

## 9. Brand Identity

### 9.1 Color Palette

| Token | Hex | Preview | Usage |
|---|---|---|---|
| `kan-primary` | `#4D8E00` | 🟩 | Main brand color — navbar, CTAs, primary backgrounds |
| `kan-mid` | `#80AE4A` | 🟩 | Hover states, cards, secondary elements |
| `kan-light` | `#A0C060` | 🟩 | Section backgrounds, inactive states |
| `kan-dark` | `#315D02` | 🟩 | Body text on light backgrounds, borders, accents |
| `kan-offwhite` | `#F9FBF6` | ⬜ | Page background, text on dark backgrounds |
| `kan-wood` | `#C8A96E` | 🟫 | Furniture accents, warm tone elements |

### 9.2 Tailwind CSS Config

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        kan: {
          primary:  '#4D8E00',
          mid:      '#80AE4A',
          light:    '#A0C060',
          dark:     '#315D02',
          offwhite: '#F9FBF6',
          wood:     '#C8A96E',
        },
      },
    },
  },
}
```

### 9.3 Brand Story

The Inspired Story section content has been approved internally.  
Full copy is maintained in [`/content/inspired-story.md`](./inspired-story.md).

---

## 10. Tech Stack

| Layer | Technology | Justification |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSG/SSR for SEO, API Routes for backend logic |
| Styling | Tailwind CSS | Utility-first, maintainable, no CSS bloat |
| Animation | Framer Motion | Performant scroll and interaction animations |
| 3D Floor Plan | Three.js | Interactive isometric map rendering |
| Database | Supabase (PostgreSQL + Realtime) | Built-in WebSocket, Row Level Security |
| Email | Resend + React Email | 3,000 free emails/month, beautiful templates |
| Notification | Zalo Bot API | Real-time internal group notification on new bookings |
| Deployment | Vercel | Native Next.js CI/CD, auto preview deployments |
| Error Monitoring | Sentry (free tier) | Production error tracking and alerting |
| Analytics | Vercel Analytics | Page views and Core Web Vitals monitoring |

---

## 11. System Architecture

```
┌─────────────────────────────────────────────────┐
│                 CLIENT BROWSER                  │
│  Next.js 14 (SSG/SSR) + Framer Motion           │
│  Three.js Isometric Map (Floor 1 + Floor 2)     │
│  Supabase Realtime Client (WebSocket)           │
└──────────────┬──────────────────────────────────┘
               │ HTTPS
┌──────────────▼──────────────────────────────────┐
│            NEXT.JS API ROUTES                   │
│  POST /api/bookings  — create booking           │
│  Input validation + rate limiting               │
│  Booking time validation (07:00–22:30)          │
└──────┬───────────────────────┬──────────────────┘
       │                       │
┌──────▼──────┐       ┌────────▼────────┐
│  Supabase   │       │  Zalo Bot API   │
│  PostgreSQL │       │  Group notify   │
│  Realtime   │       └─────────────────┘
│  RLS        │
└──────┬──────┘
       │ DB Webhook (on booking status = 'confirmed')
┌──────▼──────┐
│   Resend    │
│  Send email │
│  to guest   │
└─────────────┘
```

---

## 12. Database Schema

```sql
-- Café tables
CREATE TABLE tables (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR NOT NULL,
  -- Naming convention: [FLOOR][ZONE]-[NUMBER]
  -- e.g. '1I-03' = Floor 1, Indoor, Table 03
  -- e.g. '2I-01' = Floor 2, Indoor, Table 01
  -- e.g. '1O-05' = Floor 1, Outdoor, Table 05
  floor       INT NOT NULL CHECK (floor IN (1, 2)),
  zone        VARCHAR NOT NULL CHECK (zone IN ('indoor', 'outdoor')),
  capacity    INT NOT NULL,
  pos_x       FLOAT,           -- x coordinate on isometric map
  pos_y       FLOAT,           -- y coordinate on isometric map
  is_bookable BOOLEAN NOT NULL DEFAULT true,
  -- false = outdoor walk-in only (visible but not clickable on map)
  status      VARCHAR NOT NULL DEFAULT 'available'
              CHECK (status IN ('available', 'pending', 'booked'))
);

-- Booking records
CREATE TABLE bookings (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id     UUID NOT NULL REFERENCES tables(id),
  guest_name   VARCHAR NOT NULL,
  phone        VARCHAR NOT NULL,
  email        VARCHAR NOT NULL,
  date         DATE NOT NULL,
  start_time   TIME NOT NULL,
  duration_min INT NOT NULL DEFAULT 90,
  status       VARCHAR NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at   TIMESTAMPTZ
  -- Pending bookings auto-release after 15 minutes via background job
);
```

### 12.1 Table Seed Data

#### Floor 1 — Indoor (bookable) — `1I-01` → `1I-13` — 13 tables

| Table ID(s) | Layout | Capacity |
|---|---|---|
| 1I-01, 1I-02, 1I-03 | 3 individual tables facing the bar counter | 2–4 pax |
| 1I-04 | Long center table | 6–8 pax |
| 1I-05, 1I-06 | Cluster X — upper left zone | 2–4 pax |
| 1I-07, 1I-08 | Cluster X — upper left zone | 2–4 pax |
| 1I-09, 1I-10 | Cluster X — lower left zone | 2–4 pax |
| 1I-11 | Individual table — lower center | 2–4 pax |
| 1I-12, 1I-13 | Cluster X — lower left zone | 2–4 pax |

> **Note:** "Cluster X" = 2 individual tables pushed together sharing a sofa bench.  
> Layout pattern: `X | individual | X` (lower zone), `X X` (upper zone).

#### Floor 1 — Outdoor (walk-in only) — `1O-01` → `1O-18` — 18 tables

| Table ID(s) | Layout | Note |
|---|---|---|
| 1O-01 → 1O-06 | Individual tables along left outdoor strip | Walk-in only |
| 1O-07 → 1O-10 | 3 bench tables facing bar window | Walk-in only |
| 1O-11 → 1O-14 | Small tables — right outdoor cluster | Walk-in only |
| 1O-15 → 1O-18 | Bottom outdoor strip | Walk-in only |

#### Floor 2 — Indoor (bookable) — `2I-01` → `2I-06` — 6 tables

| Table ID(s) | Layout | Capacity |
|---|---|---|
| 2I-01, 2I-02, 2I-03, 2I-04 | 4 tables along straight sofa bench | 2–4 pax |
| 2I-05, 2I-06 | 2 tables — right corner | 2–4 pax |

#### Summary

| Floor | Zone | Count | Bookable |
|---|---|---|---|
| Floor 1 | Indoor | 13 | ✅ Yes |
| Floor 1 | Outdoor | 18 | ❌ Walk-in only |
| Floor 2 | Indoor | 6 | ✅ Yes |
| **Total** | | **37** | **19 bookable** |

---

## 13. Booking Flow

```
Guest views isometric map (Floor 1 / Floor 2 toggle)
  → Hovers available table → glitch + glow effect
  → Clicks table
  → Booking modal opens
      → Fills in: Name, Phone, Email, Date, Time, Duration
      → Client-side validation: time must be within 07:00–22:30
      → Submits form
  → API Route handles request:
      → Server-side input validation
      → Inserts booking record (status: 'pending')
      → Realtime broadcast → table turns 🟡 Pending (all clients update)
      → Zalo Bot sends notification to internal group
  → Owner sees Zalo notification
      → Logs into Supabase Studio
      → Updates booking status → 'confirmed'
  → Supabase Webhook fires:
      → Resend sends confirmation email to guest
      → Realtime broadcast → table turns 🔴 Booked (all clients update)

[Background Job — runs every minute]
  → Checks all bookings where status = 'pending' AND expires_at < NOW()
  → Sets status = 'cancelled'
  → Realtime broadcast → table turns 🟢 Available
```

---

## 14. Page Sections Summary

| # | Section | Key Components |
|---|---|---|
| 1 | Hero / Main | Full-viewport visual, tagline *"I C — I Can"*, reserve CTA button |
| 2 | Inspired Story | Scroll-triggered animations, narrative copy, real café photography |
| 3 | Floor Plan + Booking | Three.js isometric map, floor toggle (1/2), booking modal, realtime status |
| 4 | Policy & Info | FAQ accordion, contact info, Google Maps embed, opening hours |

---

## 15. Operational Information

| Field | Detail |
|---|---|
| Address | 35 D5, Ward 25, Thanh My Tay, Ho Chi Minh City 700000, Vietnam |
| Opening Hours | 07:00 – 23:30 daily |
| Last Order | 22:30 |
| Email | *(TBD — required before go-live)* |
| Phone | *(TBD — required before go-live)* |

---

## 16. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Supabase free tier limits exceeded | Low | Medium | Monitor usage dashboard, upgrade plan if needed |
| Three.js performance issues on low-end mobile | Medium | High | Fallback to 2D SVG map on mobile detection |
| Double-booking race condition | Low | High | Supabase transaction lock on table status update |
| Zalo Bot rate limited or blocked | Low | Medium | Implement request queue with retry logic |
| Owner fails to confirm booking in time | Medium | Medium | Auto-release pending bookings after 15 minutes |
| Inspired Story content changes | Low | Low | Separate content into `/content/inspired-story.md` for easy updates |

---

## 17. Milestones & Timeline

**Project Start:** April 21, 2026  
**Hard Deadline:** May 26, 2026 *(35 days)*

| Phase | Milestone | Start | End | Status |
|---|---|---|---|---|
| 0 | Discovery & PRD | Apr 21 | Apr 23 | 🔄 In Review |
| 1 | Design | Apr 24 | Apr 28 | ⏳ Upcoming |
| 2 | Project Setup | Apr 29 | Apr 30 | ⏳ Upcoming |
| 3 | Development | May 01 | May 18 | ⏳ Upcoming |
| 4 | Testing | May 19 | May 23 | ⏳ Upcoming |
| 5 | Go-Live | May 24 | May 26 | ⏳ Upcoming |

### Phase 3 — Development Sprint Breakdown

| Sprint | Duration | Scope |
|---|---|---|
| Sprint 1 | 4 days | Project structure, Hero section, Navigation |
| Sprint 2 | 4 days | Inspired Story section |
| Sprint 3 | 6 days | Isometric map + Supabase Realtime + Booking modal |
| Sprint 4 | 4 days | Policy / FAQ / Contact + Resend email + Zalo Bot integration |

---

*PRD v1.1.0 — All core open questions resolved. Document ready for final sign-off.*  
*Upon approval, project proceeds to Phase 1 — Design.*