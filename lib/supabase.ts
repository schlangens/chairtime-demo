/* Supabase client — production data layer.
 *
 * The live demo runs on deterministic mock data in lib/data.ts (no keys, stable for
 * reviewers). In production this file is the seam where profiles, barbers, services,
 * availability, appointments, reviews, coupons, favorites, and subscriptions are read/
 * written through Supabase, with Row-Level Security (see supabase/schema.sql):
 * customers see only their own appointments/favorites; barbers manage only their own
 * shop; the public reads active listings + reviews. Barber gallery photos live in a
 * Supabase Storage bucket (signed URLs). The provider subscription runs on Stripe in
 * test mode (a Yearly Pro price), with the billing state mirrored on `subscriptions`.
 *
 * To go live: run supabase/schema.sql, set NEXT_PUBLIC_SUPABASE_URL +
 * NEXT_PUBLIC_SUPABASE_ANON_KEY (+ Stripe test keys + price id),
 * npm i @supabase/supabase-js, and query Supabase from lib/store.tsx.
 */

// import { createClient } from "@supabase/supabase-js";
// export const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

export const SUPABASE_READY = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
