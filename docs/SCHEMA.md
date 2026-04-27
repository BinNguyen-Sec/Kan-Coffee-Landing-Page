# Database Schema — Kan Coffee Landing Page

> **Version:** 1.0.0  
> **Last Updated:** April 23, 2026  
> **Database:** PostgreSQL (via Supabase)  
> **Status:** Approved

---

## Table of Contents

1. [Overview](#1-overview)
2. [Entity Relationship Diagram](#2-entity-relationship-diagram)
3. [Tables](#3-tables)
   - [tables](#31-tables)
   - [bookings](#32-bookings)
4. [Enums & Constraints](#4-enums--constraints)
5. [Indexes](#5-indexes)
6. [Row Level Security (RLS)](#6-row-level-security-rls)
7. [Database Functions & Triggers](#7-database-functions--triggers)
8. [Seed Data](#8-seed-data)
9. [Migration Strategy](#9-migration-strategy)

---

## 1. Overview

The database consists of **2 core tables** supporting the real-time table reservation system for Kan Coffee.

| Table | Purpose |
|---|---|
| `tables` | Represents physical tables in the café (both floors) |
| `bookings` | Records all reservation requests and their lifecycle |

### Design Principles

- **Simplicity first** — MVP schema, extensible for Phase 2
- **Immutable booking records** — bookings are never deleted, only status-updated
- **Real-time ready** — Supabase Realtime subscriptions on both tables
- **RLS enforced** — no direct client writes without policy authorization
- **Auto-expiry** — pending bookings release automatically via scheduled function

---

## 2. Entity Relationship Diagram

```
┌─────────────────────────────────┐
│             tables              │
├─────────────────────────────────┤
│ id           UUID  PK           │
│ name         VARCHAR  NOT NULL  │
│ floor        INT  NOT NULL      │
│ zone         VARCHAR  NOT NULL  │
│ capacity     INT  NOT NULL      │
│ pos_x        FLOAT               │
│ pos_y        FLOAT               │
│ is_bookable  BOOLEAN  NOT NULL  │
│ status       VARCHAR  NOT NULL  │
│ created_at   TIMESTAMPTZ        │
└────────────────┬────────────────┘
                 │ 1
                 │
                 │ has many
                 │
                 │ N
┌────────────────▼────────────────┐
│            bookings             │
├─────────────────────────────────┤
│ id           UUID  PK           │
│ table_id     UUID  FK → tables  │
│ guest_name   VARCHAR  NOT NULL  │
│ phone        VARCHAR  NOT NULL  │
│ email        VARCHAR  NOT NULL  │
│ date         DATE  NOT NULL     │
│ start_time   TIME  NOT NULL     │
│ duration_min INT  NOT NULL      │
│ status       VARCHAR  NOT NULL  │
│ created_at   TIMESTAMPTZ        │
│ expires_at   TIMESTAMPTZ        │
└─────────────────────────────────┘
```

**Relationship:** One `table` has many `bookings`. A booking always belongs to exactly one table.

---

## 3. Tables

### 3.1 `tables`

Represents every physical table in Kan Coffee across both floors.

```sql
CREATE TABLE tables (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(10) NOT NULL UNIQUE,
  floor       INT         NOT NULL CHECK (floor IN (1, 2)),
  zone        VARCHAR(10) NOT NULL CHECK (zone IN ('indoor', 'outdoor')),
  capacity    INT         NOT NULL CHECK (capacity > 0),
  pos_x       FLOAT       DEFAULT 0,
  pos_y       FLOAT       DEFAULT 0,
  is_bookable BOOLEAN     NOT NULL DEFAULT true,
  status      VARCHAR(10) NOT NULL DEFAULT 'available'
              CHECK (status IN ('available', 'pending', 'booked')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### Column Reference

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | UUID | No | `gen_random_uuid()` | Primary key — auto-generated |
| `name` | VARCHAR(10) | No | — | Unique table identifier e.g. `1I-03` |
| `floor` | INT | No | — | Floor number: `1` or `2` |
| `zone` | VARCHAR(10) | No | — | `indoor` or `outdoor` |
| `capacity` | INT | No | — | Maximum number of guests |
| `pos_x` | FLOAT | Yes | `0` | X coordinate on isometric map canvas |
| `pos_y` | FLOAT | Yes | `0` | Y coordinate on isometric map canvas |
| `is_bookable` | BOOLEAN | No | `true` | `false` = walk-in only, visible but not clickable |
| `status` | VARCHAR(10) | No | `available` | Current real-time status of the table |
| `created_at` | TIMESTAMPTZ | No | `NOW()` | Record creation timestamp |

#### Naming Convention

Table names follow the pattern: `[FLOOR][ZONE]-[NUMBER]`

```
1I-03
│ │  └── Sequential number (zero-padded, 2 digits)
│ └───── Zone: I = Indoor, O = Outdoor
└─────── Floor number: 1 or 2

Examples:
  1I-01  →  Floor 1, Indoor,  Table 01
  1O-05  →  Floor 1, Outdoor, Table 05
  2I-03  →  Floor 2, Indoor,  Table 03
```

#### Status Lifecycle

```
          ┌─────────────┐
          │  available  │◄──────────────────────┐
          └──────┬──────┘                       │
                 │ guest clicks table            │ auto-release
                 │ & submits booking             │ (expires_at < NOW())
                 ▼                               │
          ┌─────────────┐               ┌────────┴───────┐
          │   pending   │──────────────►│   cancelled    │
          └──────┬──────┘  15 min       └────────────────┘
                 │ owner confirms
                 ▼
          ┌─────────────┐
          │   booked    │
          └─────────────┘
```

---

### 3.2 `bookings`

Records every reservation request and tracks its full lifecycle.

```sql
CREATE TABLE bookings (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id     UUID        NOT NULL REFERENCES tables(id) ON DELETE RESTRICT,
  guest_name   VARCHAR(100) NOT NULL,
  phone        VARCHAR(20)  NOT NULL,
  email        VARCHAR(254) NOT NULL,
  date         DATE         NOT NULL,
  start_time   TIME         NOT NULL,
  duration_min INT          NOT NULL DEFAULT 90
               CHECK (duration_min IN (60, 90, 120)),
  status       VARCHAR(10)  NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  expires_at   TIMESTAMPTZ  NOT NULL
               DEFAULT (NOW() + INTERVAL '15 minutes')
);
```

#### Column Reference

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | UUID | No | `gen_random_uuid()` | Primary key — auto-generated |
| `table_id` | UUID | No | — | Foreign key → `tables.id` |
| `guest_name` | VARCHAR(100) | No | — | Full name of the guest |
| `phone` | VARCHAR(20) | No | — | Guest phone number |
| `email` | VARCHAR(254) | No | — | Guest email — confirmation sent here |
| `date` | DATE | No | — | Reservation date |
| `start_time` | TIME | No | — | Reservation start time (must be 07:00–22:30) |
| `duration_min` | INT | No | `90` | Duration in minutes: `60`, `90`, or `120` |
| `status` | VARCHAR(10) | No | `pending` | Booking lifecycle status |
| `created_at` | TIMESTAMPTZ | No | `NOW()` | Timestamp when booking was submitted |
| `expires_at` | TIMESTAMPTZ | No | `NOW() + 15min` | Auto-release deadline for pending bookings |

#### Status Lifecycle

```
          ┌─────────────┐
          │   pending   │  ← created on guest submission
          └──────┬──────┘
                 │
        ┌────────┴────────┐
        │                 │
        │ owner confirms  │ 15 min elapsed
        │                 │ (no owner action)
        ▼                 ▼
  ┌───────────┐    ┌─────────────┐
  │ confirmed │    │  cancelled  │
  └───────────┘    └─────────────┘
  sends email      releases table
  to guest         back to available
```

#### Business Rules

| Rule | Detail |
|---|---|
| Booking hours | `start_time` must be between `07:00` and `22:30` |
| Duration options | `60`, `90`, or `120` minutes only |
| Auto-expiry | Pending bookings older than 15 minutes are auto-cancelled |
| Immutability | Bookings are never hard-deleted — status updated only |
| Overlap prevention | A table cannot have 2 confirmed bookings for the same date/time slot |
| Foreign key | `ON DELETE RESTRICT` — cannot delete a table that has bookings |

---

## 4. Enums & Constraints

### Table Status

| Value | Description | UI Color |
|---|---|---|
| `available` | Table is free to book | 🟢 Green |
| `pending` | Booking submitted, awaiting owner confirmation | 🟡 Yellow |
| `booked` | Booking confirmed by owner | 🔴 Red |

### Booking Status

| Value | Description | Triggers |
|---|---|---|
| `pending` | Submitted by guest, awaiting confirmation | Zalo Bot notification to team |
| `confirmed` | Approved by owner | Email confirmation sent to guest |
| `cancelled` | Rejected by owner or auto-expired | Table status reset to `available` |

### Duration Options

| Value (minutes) | Label shown to guest |
|---|---|
| `60` | 1 hour |
| `90` | 1.5 hours *(default)* |
| `120` | 2 hours |

---

## 5. Indexes

```sql
-- Speed up queries filtering by date (most common booking query)
CREATE INDEX idx_bookings_date
  ON bookings (date);

-- Speed up queries filtering by table + date (overlap check)
CREATE INDEX idx_bookings_table_date
  ON bookings (table_id, date);

-- Speed up auto-release cron job (finds expired pending bookings)
CREATE INDEX idx_bookings_expires_at
  ON bookings (expires_at)
  WHERE status = 'pending';

-- Speed up floor plan queries (filter by floor and zone)
CREATE INDEX idx_tables_floor_zone
  ON tables (floor, zone);

-- Speed up Realtime subscription filtering
CREATE INDEX idx_tables_status
  ON tables (status);
```

---

## 6. Row Level Security (RLS)

RLS is enabled on both tables. All policies are defined below.

```sql
-- Enable RLS
ALTER TABLE tables   ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
```

### `tables` Policies

```sql
-- Anyone can read table data (needed for floor plan rendering)
CREATE POLICY "tables_public_read"
  ON tables
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only service role can update table status
-- (triggered by backend API route, not client directly)
CREATE POLICY "tables_service_update"
  ON tables
  FOR UPDATE
  TO service_role
  USING (true);
```

### `bookings` Policies

```sql
-- Anyone can insert a booking (guest submits form)
CREATE POLICY "bookings_public_insert"
  ON bookings
  FOR INSERT
  TO anon
  WITH CHECK (
    -- Enforce business hours at DB level as a safety net
    start_time >= '07:00'::TIME AND start_time <= '22:30'::TIME
  );

-- Only service role can read all bookings
-- (used by API routes and admin operations)
CREATE POLICY "bookings_service_read"
  ON bookings
  FOR SELECT
  TO service_role
  USING (true);

-- Only service role can update booking status
-- (owner confirms via Supabase Studio using service role)
CREATE POLICY "bookings_service_update"
  ON bookings
  FOR UPDATE
  TO service_role
  USING (true);
```

---

## 7. Database Functions & Triggers

### 7.1 Auto-update `tables.status` on booking insert

When a new booking is inserted, automatically set the corresponding table status to `pending`.

```sql
CREATE OR REPLACE FUNCTION fn_set_table_pending()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE tables
  SET status = 'pending'
  WHERE id = NEW.table_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_booking_inserted
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION fn_set_table_pending();
```

### 7.2 Auto-update `tables.status` on booking confirmation

When a booking status changes to `confirmed`, set the table to `booked`.  
When a booking is `cancelled`, reset the table to `available`.

```sql
CREATE OR REPLACE FUNCTION fn_sync_table_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' THEN
    UPDATE tables SET status = 'booked'
    WHERE id = NEW.table_id;

  ELSIF NEW.status = 'cancelled' THEN
    UPDATE tables SET status = 'available'
    WHERE id = NEW.table_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_booking_status_changed
  AFTER UPDATE OF status ON bookings
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION fn_sync_table_status();
```

### 7.3 Auto-release expired pending bookings

Supabase Cron Job (via `pg_cron`) runs every minute to cancel expired pending bookings.

```sql
-- Enable pg_cron extension (run once in Supabase SQL editor)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule auto-release job
SELECT cron.schedule(
  'auto-release-pending-bookings',   -- job name
  '* * * * *',                       -- every minute
  $$
    UPDATE bookings
    SET status = 'cancelled'
    WHERE status = 'pending'
      AND expires_at < NOW();
  $$
);
```

> **Note:** The trigger `trg_booking_status_changed` will automatically reset the table status to `available` when a booking is cancelled by this job.

### 7.4 Prevent double-booking

Ensures no two confirmed bookings overlap for the same table on the same date.

```sql
CREATE OR REPLACE FUNCTION fn_check_booking_overlap()
RETURNS TRIGGER AS $$
DECLARE
  overlap_count INT;
BEGIN
  SELECT COUNT(*) INTO overlap_count
  FROM bookings
  WHERE table_id = NEW.table_id
    AND date = NEW.date
    AND status IN ('pending', 'confirmed')
    AND id != NEW.id
    AND (
      NEW.start_time < (start_time + (duration_min || ' minutes')::INTERVAL)
      AND
      (NEW.start_time + (NEW.duration_min || ' minutes')::INTERVAL) > start_time
    );

  IF overlap_count > 0 THEN
    RAISE EXCEPTION 'Table is already booked for this time slot.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_double_booking
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION fn_check_booking_overlap();
```

---

## 8. Seed Data

### 8.1 Floor 1 — Indoor Tables (bookable)

```sql
INSERT INTO tables (name, floor, zone, capacity, is_bookable, status) VALUES
  -- 3 individual tables facing the bar counter
  ('1I-01', 1, 'indoor', 2, true, 'available'),
  ('1I-02', 1, 'indoor', 2, true, 'available'),
  ('1I-03', 1, 'indoor', 4, true, 'available'),

  -- Long center table
  ('1I-04', 1, 'indoor', 8, true, 'available'),

  -- Cluster X — upper left zone
  ('1I-05', 1, 'indoor', 4, true, 'available'),
  ('1I-06', 1, 'indoor', 4, true, 'available'),
  ('1I-07', 1, 'indoor', 4, true, 'available'),
  ('1I-08', 1, 'indoor', 4, true, 'available'),

  -- Cluster X — lower left zone
  ('1I-09', 1, 'indoor', 4, true, 'available'),
  ('1I-10', 1, 'indoor', 4, true, 'available'),
  ('1I-11', 1, 'indoor', 4, true, 'available'),
  ('1I-12', 1, 'indoor', 4, true, 'available'),
  ('1I-13', 1, 'indoor', 4, true, 'available');
```

### 8.2 Floor 1 — Outdoor Tables (walk-in only)

```sql
INSERT INTO tables (name, floor, zone, capacity, is_bookable, status) VALUES
  -- Left outdoor strip (1O-01 → 1O-06)
  ('1O-01', 1, 'outdoor', 2, false, 'available'),
  ('1O-02', 1, 'outdoor', 2, false, 'available'),
  ('1O-03', 1, 'outdoor', 2, false, 'available'),
  ('1O-04', 1, 'outdoor', 2, false, 'available'),
  ('1O-05', 1, 'outdoor', 2, false, 'available'),
  ('1O-06', 1, 'outdoor', 2, false, 'available'),

  -- Bench tables facing bar window (1O-07 → 1O-09)
  ('1O-07', 1, 'outdoor', 4, false, 'available'),
  ('1O-08', 1, 'outdoor', 4, false, 'available'),
  ('1O-09', 1, 'outdoor', 4, false, 'available'),

  -- Right outdoor cluster (1O-10 → 1O-13)
  ('1O-10', 1, 'outdoor', 2, false, 'available'),
  ('1O-11', 1, 'outdoor', 2, false, 'available'),
  ('1O-12', 1, 'outdoor', 2, false, 'available'),
  ('1O-13', 1, 'outdoor', 2, false, 'available'),

  -- Bottom outdoor strip (1O-14 → 1O-18)
  ('1O-14', 1, 'outdoor', 4, false, 'available'),
  ('1O-15', 1, 'outdoor', 4, false, 'available'),
  ('1O-16', 1, 'outdoor', 4, false, 'available'),
  ('1O-17', 1, 'outdoor', 4, false, 'available'),
  ('1O-18', 1, 'outdoor', 4, false, 'available');
```

### 8.3 Floor 2 — Indoor Tables (bookable)

```sql
INSERT INTO tables (name, floor, zone, capacity, is_bookable, status) VALUES
  -- 4 tables along straight sofa bench
  ('2I-01', 2, 'indoor', 4, true, 'available'),
  ('2I-02', 2, 'indoor', 4, true, 'available'),
  ('2I-03', 2, 'indoor', 4, true, 'available'),
  ('2I-04', 2, 'indoor', 4, true, 'available'),

  -- 2 tables — right corner
  ('2I-05', 2, 'indoor', 4, true, 'available'),
  ('2I-06', 2, 'indoor', 4, true, 'available');
```

### 8.4 Summary

| Floor | Zone | Count | Bookable |
|---|---|---|---|
| Floor 1 | Indoor | 13 | Yes |
| Floor 1 | Outdoor | 18 | Walk-in only |
| Floor 2 | Indoor | 6 | Yes |
| **Total** | | **37** | **19 bookable** |

---

## 9. Migration Strategy

### Tools
- All schema migrations are managed via **Supabase SQL Editor** during MVP phase
- Scripts are stored in `/supabase/migrations/` for version control

### Naming Convention

```
/supabase/migrations/
  20260423000001_create_tables.sql
  20260423000002_create_bookings.sql
  20260423000003_add_indexes.sql
  20260423000004_enable_rls.sql
  20260423000005_create_functions_triggers.sql
  20260423000006_seed_tables.sql
```

Format: `YYYYMMDDHHMMSS_description.sql`

### Phase 2 Considerations

The following columns may be added in Phase 2 without breaking existing functionality:

| Table | Column | Purpose |
|---|---|---|
| `bookings` | `cancelled_reason` VARCHAR | Track why a booking was cancelled |
| `bookings` | `confirmed_at` TIMESTAMPTZ | Track when owner confirmed |
| `tables` | `description` VARCHAR | Table description for UI tooltip |
| — | `customers` table | Auth + booking history for repeat guests |
| — | `menu_items` table | Pre-order menu integration |

> **Principle:** Never drop or rename existing columns in Phase 2. Add only. This ensures backward compatibility with all existing queries.