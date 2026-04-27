# API Contract — Kan Coffee Landing Page

> **Version:** 1.0.0  
> **Last Updated:** April 23, 2026  
> **Base URL (Production):** `https://kan-coffee.vercel.app`  
> **Base URL (Development):** `http://localhost:3000`  
> **Status:** Approved

---

## Table of Contents

1. [Overview](#1-overview)
2. [General Conventions](#2-general-conventions)
3. [Authentication](#3-authentication)
4. [Rate Limiting](#4-rate-limiting)
5. [Error Handling](#5-error-handling)
6. [Endpoints](#6-endpoints)
   - [GET /api/tables](#61-get-apitables)
   - [GET /api/tables/:id](#62-get-apitablesid)
   - [GET /api/bookings/availability](#63-get-apibookingsavailability)
   - [POST /api/bookings](#64-post-apibookings)
   - [PATCH /api/bookings/:id](#65-patch-apibookingsid)
7. [Realtime Events](#7-realtime-events)
8. [Webhook Events](#8-webhook-events)
9. [Third-party Integrations](#9-third-party-integrations)
10. [Changelog](#10-changelog)

---

## 1. Overview

This document defines the full API contract for the Kan Coffee Landing Page backend. All endpoints are implemented as **Next.js 14 API Routes** under the `/api` namespace.

### Architecture Summary

```
Client (Browser)
    │
    ├── REST calls → Next.js API Routes (/api/*)
    │                     │
    │                     ├── Supabase SDK (DB read/write)
    │                     ├── Zalo Bot API (notify internal group)
    │                     └── Resend API (send confirmation email)
    │
    └── WebSocket → Supabase Realtime (live table status updates)
```

### Endpoint Summary

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/tables` | List all tables with current status | Public |
| GET | `/api/tables/:id` | Get single table details | Public |
| GET | `/api/bookings/availability` | Check table availability for a date/time | Public |
| POST | `/api/bookings` | Submit a new booking | Public |
| PATCH | `/api/bookings/:id` | Update booking status (confirm/cancel) | Service Role |

---

## 2. General Conventions

### Request Headers

```
Content-Type: application/json
Accept: application/json
```

### Response Format

All responses follow a consistent envelope structure:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "meta": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  }
}
```

### Date & Time Format

| Type | Format | Example |
|---|---|---|
| Date | `YYYY-MM-DD` | `2026-05-01` |
| Time | `HH:MM` (24h) | `14:30` |
| Timestamp | ISO 8601 UTC | `2026-05-01T14:30:00.000Z` |

### HTTP Status Codes

| Code | Meaning | When used |
|---|---|---|
| `200` | OK | Successful GET, PATCH |
| `201` | Created | Successful POST (booking created) |
| `400` | Bad Request | Validation error, malformed input |
| `404` | Not Found | Resource does not exist |
| `409` | Conflict | Table already booked for this slot |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Unexpected server-side failure |

---

## 3. Authentication

### Public Endpoints
`GET /api/tables`, `GET /api/tables/:id`, `GET /api/bookings/availability`, `POST /api/bookings`

No authentication required. These endpoints use Supabase **anon key** with RLS policies enforced at the database level.

### Protected Endpoints
`PATCH /api/bookings/:id`

Requires the `Authorization` header with the Supabase **service role key**. This endpoint is only called from Supabase Studio (owner confirms booking) or internal tooling — never from the public client.

```
Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>
```

---

## 4. Rate Limiting

Rate limiting is enforced at the API Route level using an in-memory sliding window.

| Endpoint | Limit | Window |
|---|---|---|
| `POST /api/bookings` | 5 requests | per IP per 10 minutes |
| `GET /api/tables` | 60 requests | per IP per minute |
| `GET /api/bookings/availability` | 30 requests | per IP per minute |

**Rate limit exceeded response:**

```json
HTTP/1.1 429 Too Many Requests
Retry-After: 120

{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "details": {
      "retryAfter": 120
    }
  }
}
```

---

## 5. Error Handling

### Error Codes Reference

| Code | HTTP Status | Description |
|---|---|---|
| `VALIDATION_ERROR` | 400 | One or more input fields failed validation |
| `INVALID_BOOKING_TIME` | 400 | Booking time outside 07:00–22:30 |
| `TABLE_NOT_FOUND` | 404 | Table ID does not exist |
| `BOOKING_NOT_FOUND` | 404 | Booking ID does not exist |
| `TABLE_NOT_BOOKABLE` | 400 | Table is outdoor (walk-in only) |
| `TABLE_UNAVAILABLE` | 409 | Table is already pending or booked |
| `BOOKING_OVERLAP` | 409 | Time slot conflicts with existing booking |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests from this IP |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

### Validation Error Shape

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input validation failed.",
    "details": {
      "fields": {
        "email": "Invalid email format.",
        "start_time": "Booking time must be between 07:00 and 22:30.",
        "phone": "Phone number must be 10–11 digits."
      }
    }
  }
}
```

---

## 6. Endpoints

---

### 6.1 GET `/api/tables`

Returns all tables with their current real-time status.

#### Query Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `floor` | integer | No | Filter by floor: `1` or `2` |
| `zone` | string | No | Filter by zone: `indoor` or `outdoor` |
| `bookable` | boolean | No | Filter bookable tables only: `true` |

#### Example Request

```
GET /api/tables?floor=1&zone=indoor
```

#### Example Response `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "1I-01",
      "floor": 1,
      "zone": "indoor",
      "capacity": 2,
      "pos_x": 120.5,
      "pos_y": 80.0,
      "is_bookable": true,
      "status": "available",
      "created_at": "2026-04-23T00:00:00.000Z"
    },
    {
      "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "name": "1I-02",
      "floor": 1,
      "zone": "indoor",
      "capacity": 2,
      "pos_x": 180.5,
      "pos_y": 80.0,
      "is_bookable": true,
      "status": "pending",
      "created_at": "2026-04-23T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 2,
    "floor": 1,
    "zone": "indoor"
  }
}
```

---

### 6.2 GET `/api/tables/:id`

Returns details for a single table.

#### Path Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | UUID | Yes | Table UUID |

#### Example Request

```
GET /api/tables/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

#### Example Response `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "1I-01",
    "floor": 1,
    "zone": "indoor",
    "capacity": 2,
    "pos_x": 120.5,
    "pos_y": 80.0,
    "is_bookable": true,
    "status": "available",
    "created_at": "2026-04-23T00:00:00.000Z"
  }
}
```

#### Example Response `404 Not Found`

```json
{
  "success": false,
  "error": {
    "code": "TABLE_NOT_FOUND",
    "message": "Table with the provided ID does not exist."
  }
}
```

---

### 6.3 GET `/api/bookings/availability`

Checks whether a specific table is available for a given date and time slot. Use this before showing the booking modal to confirm real-time availability.

#### Query Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `table_id` | UUID | Yes | Table UUID to check |
| `date` | string | Yes | Date in `YYYY-MM-DD` format |
| `start_time` | string | Yes | Start time in `HH:MM` format |
| `duration_min` | integer | Yes | Duration: `60`, `90`, or `120` |

#### Example Request

```
GET /api/bookings/availability?table_id=a1b2c3d4-e5f6-7890-abcd-ef1234567890&date=2026-05-01&start_time=14:00&duration_min=90
```

#### Example Response `200 OK` — Available

```json
{
  "success": true,
  "data": {
    "available": true,
    "table_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "table_name": "1I-01",
    "date": "2026-05-01",
    "start_time": "14:00",
    "end_time": "15:30",
    "duration_min": 90
  }
}
```

#### Example Response `200 OK` — Not Available

```json
{
  "success": true,
  "data": {
    "available": false,
    "table_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "table_name": "1I-01",
    "date": "2026-05-01",
    "start_time": "14:00",
    "duration_min": 90,
    "reason": "TABLE_UNAVAILABLE"
  }
}
```

---

### 6.4 POST `/api/bookings`

Submits a new table reservation. This is the primary booking endpoint called when a guest submits the booking modal form.

**What this endpoint does internally:**
1. Validates all input fields
2. Checks business hours constraint (07:00–22:30)
3. Checks table availability (no overlap)
4. Inserts booking record → status: `pending`
5. DB trigger sets table status → `pending`
6. Supabase Realtime broadcasts table status change to all clients
7. Sends Zalo Bot notification to internal group

#### Request Body

```json
{
  "table_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "guest_name": "Nguyen Van A",
  "phone": "0909123456",
  "email": "nguyenvana@email.com",
  "date": "2026-05-01",
  "start_time": "14:00",
  "duration_min": 90
}
```

#### Request Body Schema

| Field | Type | Required | Validation |
|---|---|---|---|
| `table_id` | UUID | Yes | Must exist in `tables`, must be `is_bookable = true` |
| `guest_name` | string | Yes | 2–100 characters |
| `phone` | string | Yes | 10–11 digits, Vietnamese format |
| `email` | string | Yes | Valid email format, max 254 characters |
| `date` | string | Yes | `YYYY-MM-DD`, must not be in the past |
| `start_time` | string | Yes | `HH:MM`, must be between `07:00` and `22:30` |
| `duration_min` | integer | Yes | Must be `60`, `90`, or `120` |

#### Example Response `201 Created`

```json
{
  "success": true,
  "data": {
    "booking_id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "table_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "table_name": "1I-01",
    "guest_name": "Nguyen Van A",
    "phone": "0909123456",
    "email": "nguyenvana@email.com",
    "date": "2026-05-01",
    "start_time": "14:00",
    "end_time": "15:30",
    "duration_min": 90,
    "status": "pending",
    "expires_at": "2026-05-01T07:15:00.000Z",
    "created_at": "2026-05-01T07:00:00.000Z"
  },
  "meta": {
    "message": "Booking submitted successfully. Awaiting owner confirmation."
  }
}
```

#### Example Response `400 Bad Request` — Validation Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input validation failed.",
    "details": {
      "fields": {
        "email": "Invalid email format.",
        "start_time": "Booking time must be between 07:00 and 22:30."
      }
    }
  }
}
```

#### Example Response `409 Conflict` — Table Unavailable

```json
{
  "success": false,
  "error": {
    "code": "TABLE_UNAVAILABLE",
    "message": "This table is no longer available for the selected time slot."
  }
}
```

---

### 6.5 PATCH `/api/bookings/:id`

Updates the status of an existing booking. Used by the owner to confirm or cancel a booking via Supabase Studio or internal tooling.

**What this endpoint does internally:**
1. Validates booking exists
2. Updates booking status
3. DB trigger syncs table status accordingly
4. If `confirmed` → Resend sends confirmation email to guest
5. Supabase Realtime broadcasts table status change to all clients

> **Protected endpoint** — requires `Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>`

#### Path Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | UUID | Yes | Booking UUID |

#### Request Body

```json
{
  "status": "confirmed"
}
```

| Field | Type | Required | Allowed Values |
|---|---|---|---|
| `status` | string | Yes | `confirmed` or `cancelled` |

#### Example Response `200 OK` — Confirmed

```json
{
  "success": true,
  "data": {
    "booking_id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "table_name": "1I-01",
    "guest_name": "Nguyen Van A",
    "email": "nguyenvana@email.com",
    "status": "confirmed",
    "confirmed_at": "2026-05-01T07:05:00.000Z"
  },
  "meta": {
    "message": "Booking confirmed. Confirmation email sent to guest.",
    "email_sent": true
  }
}
```

#### Example Response `404 Not Found`

```json
{
  "success": false,
  "error": {
    "code": "BOOKING_NOT_FOUND",
    "message": "Booking with the provided ID does not exist."
  }
}
```

---

## 7. Realtime Events

The frontend subscribes to Supabase Realtime to receive live updates on table status changes — no polling required.

### Subscription Setup (client-side)

```typescript
// src/hooks/useRealtimeTables.ts
import { supabase } from '@/lib/supabase/client'

const channel = supabase
  .channel('tables-realtime')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'tables',
    },
    (payload) => {
      // payload.new contains the updated table row
      console.log('Table status changed:', payload.new)
    }
  )
  .subscribe()
```

### Realtime Event Payload

```json
{
  "schema": "public",
  "table": "tables",
  "commit_timestamp": "2026-05-01T07:00:05.000Z",
  "eventType": "UPDATE",
  "new": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "1I-01",
    "floor": 1,
    "zone": "indoor",
    "capacity": 2,
    "pos_x": 120.5,
    "pos_y": 80.0,
    "is_bookable": true,
    "status": "pending",
    "created_at": "2026-04-23T00:00:00.000Z"
  },
  "old": {
    "status": "available"
  }
}
```

### Status Change Events

| Trigger | Old Status | New Status | UI Effect |
|---|---|---|---|
| Guest submits booking | `available` | `pending` | Table turns 🟡 |
| Owner confirms | `pending` | `booked` | Table turns 🔴 |
| Owner cancels | `pending` | `available` | Table turns 🟢 |
| Auto-release (15 min) | `pending` | `available` | Table turns 🟢 |

---

## 8. Webhook Events

### Supabase Database Webhook — On Booking Confirmed

When a booking status is updated to `confirmed`, Supabase fires a webhook to the email notification endpoint.

**Webhook target:** `POST /api/webhooks/booking-confirmed`  
**Triggered by:** UPDATE on `bookings` where `status = 'confirmed'`

#### Webhook Payload (from Supabase)

```json
{
  "type": "UPDATE",
  "table": "bookings",
  "record": {
    "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "table_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "guest_name": "Nguyen Van A",
    "phone": "0909123456",
    "email": "nguyenvana@email.com",
    "date": "2026-05-01",
    "start_time": "14:00",
    "duration_min": 90,
    "status": "confirmed",
    "created_at": "2026-05-01T07:00:00.000Z"
  },
  "old_record": {
    "status": "pending"
  }
}
```

---

## 9. Third-party Integrations

### 9.1 Zalo Bot API

Called inside `POST /api/bookings` after successful booking insertion.

**Trigger:** New booking submitted  
**Target:** Internal staff Zalo group  

#### Message Format

```
🔔 New Booking — Kan Coffee

Table:  1I-01 (Floor 1 — Indoor)
Guest:  Nguyen Van A
Phone:  0909123456
Date:   Thursday, May 01, 2026
Time:   14:00 – 15:30 (90 min)

Please confirm or cancel in Supabase Studio.
🔗 https://supabase.com/dashboard/project/[project-id]/editor
```

#### Implementation Reference

```typescript
// src/lib/zalo/notify.ts
export async function notifyZaloGroup(booking: BookingPayload) {
  const message = formatBookingMessage(booking)

  await fetch('https://openapi.zalo.me/v2.0/oa/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'access_token': process.env.ZALO_BOT_ACCESS_TOKEN!,
    },
    body: JSON.stringify({
      recipient: { group_id: process.env.ZALO_GROUP_ID },
      message: { text: message },
    }),
  })
}
```

---

### 9.2 Resend Email API

Called inside `PATCH /api/bookings/:id` when status is updated to `confirmed`.

**Trigger:** Owner confirms booking  
**Target:** Guest email address  
**Template:** `BookingConfirmation` (React Email)  

#### Email Content

```
Subject: Your table at Kan Coffee is confirmed!

Hi Nguyen Van A,

Your reservation has been confirmed. Here are your booking details:

  Table:    1I-01 (Floor 1 — Indoor AC)
  Date:     Thursday, May 01, 2026
  Time:     14:00 – 15:30
  Capacity: Up to 2 guests

Address:
  35 D5, Ward 25, Thanh My Tay,
  Ho Chi Minh City 700000, Vietnam

Please arrive within 10 minutes of your reservation time.
   Late arrivals may result in the table being released.

We look forward to seeing you at Kan Coffee!

— The Kan Coffee Team
```

#### Implementation Reference

```typescript
// src/lib/resend/sendConfirmation.ts
import { Resend } from 'resend'
import { BookingConfirmation } from '@/emails/BookingConfirmation'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendConfirmationEmail(booking: ConfirmedBooking) {
  await resend.emails.send({
    from: 'Kan Coffee <no-reply@kan-coffee.com>',
    to: booking.email,
    subject: 'Your table at Kan Coffee is confirmed!',
    react: BookingConfirmation({ booking }),
  })
}
```

---

## 10. Changelog

| Version | Date | Changes |
|---|---|---|
| 1.0.0 | April 23, 2026 | Initial API contract — 5 endpoints, Realtime events, Zalo Bot, Resend email |