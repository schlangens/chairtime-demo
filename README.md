# ChairTime — barber booking marketplace + subscriptions (demo)

A mobile-first **booking marketplace** for barbers with **provider subscriptions**: customers
discover barbers near them, book an open chair, and manage appointments; barbers get a
dashboard and subscribe (free trial → Yearly Pro) to get listed and featured. Built as a
portfolio demo.

**Live:** https://chairtime-demo-app.vercel.app

> Demo notes: deterministic **mock data**, phone-framed mobile UI; Stripe shown in **test
> mode**. Production uses Supabase Auth + Row-Level Security + Storage and live Stripe.

## Why it's different from a single-business booking site
This is the **marketplace + SaaS** tier: many providers, consumer discovery with distance
filters, provider dashboards, **and in-app subscription billing** — the paywall flow no
single-business demo has.

## Screens
**Consumer** — discovery home (search, category chips, a **Featured** provider card, and a
**Near You** list with <15 / <30 / <50 mile distance filters showing rating, price, distance,
coupons); provider profile (gallery, services & pricing, reviews, coupon); a **booking flow**
(service → time slot → confirmation); appointments; favorites; coupons.

**Provider** — dashboard (billing state, upcoming bookings, services, reviews) and the
**subscription paywall** (free 3-day trial → **Yearly Pro** via Stripe test), with the
**Trialing / Active** state shown on the dashboard.

## Tenant isolation
Customers see only their own appointments/favorites; each barber sees only their own shop;
the public reads active listings + reviews — enforced by **Postgres RLS** in production
(`supabase/schema.sql`).

## Stack
Next.js (App Router) + TypeScript + Tailwind · Supabase (Postgres + Auth + RLS + Storage) ·
Stripe (test mode, subscriptions) · Vercel.

## Run locally
```bash
npm install
npm run dev
```

---
© 2026 Scott Schlangen. All rights reserved (see [LICENSE](LICENSE)).
