/* ChairTime — mock data (drives the live demo). Maps 1:1 to Supabase tables with RLS
   (see supabase/schema.sql). Stripe runs in test mode for the provider subscription. */

export type Role = "customer" | "barber";
export type SubStatus = "none" | "trialing" | "active";
export type ApptStatus = "booked" | "done" | "cancelled";

export type Service = { name: string; price: number; duration: number };
export type Review = { id: string; barberId: string; author: string; stars: number; body: string; date: string };
export type Barber = {
  id: string; shop: string; owner: string; bio: string; area: string;
  rating: number; reviews: number; priceFrom: number; distance: number;
  featured: boolean; availableNow: boolean; sub: SubStatus; color: string;
  services: Service[]; coupon?: { label: string; amount: number };
};
export type Appointment = { id: string; customerId: string; barberId: string; service: string; price: number; startsAt: string; status: ApptStatus };
export type Favorite = { customerId: string; barberId: string };

const C = ["#f59e0b", "#0ea5e9", "#ef4444", "#8b5cf6", "#10b981", "#ec4899", "#eab308", "#14b8a6"];
const AREAS = ["Downtown", "Fountain Square", "Broad Ripple", "Mass Ave", "Fishers", "Carmel", "Irvington", "Zionsville"];
let _n = 0;
const svc = (n: string, p: number, d: number): Service => ({ name: n, price: p, duration: d });
const baseServices = (from: number): Service[] => [
  svc("Classic Cut", from, 30), svc("Skin Fade", from + 5, 40), svc("Cut + Beard", from + 12, 50), svc("Beard Trim", Math.max(12, from - 12), 20),
];

const B = (shop: string, owner: string, bio: string, rating: number, reviews: number, priceFrom: number, distance: number, featured: boolean, availableNow: boolean, sub: SubStatus, coupon?: number): Barber => {
  const id = "b" + (++_n);
  return { id, shop, owner, bio, area: AREAS[_n % AREAS.length], rating, reviews, priceFrom, distance, featured, availableNow, sub, color: C[_n % C.length],
    services: baseServices(priceFrom), coupon: coupon ? { label: `$${coupon} Off first visit`, amount: coupon } : undefined };
};

export const BARBERS: Barber[] = [
  B("Fade Lab", "You (demo barber)", "Precision fades, hot-towel shaves, and clean lineups. 10+ years behind the chair.", 4.9, 214, 35, 1.2, true, true, "trialing", 10),
  B("The Sharp Co.", "Marcus Reed", "Modern cuts and classic straight-razor shaves in a relaxed shop.", 4.8, 168, 30, 2.4, true, true, "active", 5),
  B("Kingsman Cuts", "Andre Liu", "Old-school barbering with a modern edge. Walk-ins welcome.", 4.7, 132, 28, 3.1, true, false, "active"),
  B("Lineup Studio", "Devin Carter", "Skin fades and detailed lineups. Kid-friendly chairs.", 4.6, 96, 25, 4.0, false, true, "none", 8),
  B("Razor's Edge", "Sam Whitfield", "Hot-towel shaves and beard sculpting specialists.", 4.8, 121, 33, 5.2, false, true, "trialing"),
  B("Clipper Club", "Theo Marsh", "Quick, clean cuts for the busy professional.", 4.5, 74, 22, 6.0, false, false, "none", 5),
  B("Crown & Comb", "Renee Okafor", "Textured cuts and natural hair specialists.", 4.9, 188, 38, 7.3, false, true, "active"),
  B("Apex Barbers", "Carlos Vega", "Fades, tapers, and designs. Sports cuts on game day.", 4.6, 110, 26, 8.1, false, true, "none"),
  B("Gentleman's Grove", "Owen Clark", "Upscale grooming lounge — cut, shave, and a drink.", 4.7, 142, 45, 9.4, false, false, "none", 10),
  B("Tradesman Cuts", "Felix Yu", "No-fuss cuts, fair prices, fast chairs.", 4.4, 58, 20, 10.8, false, true, "none"),
  B("Boulevard Barber", "Liam Foster", "Classic gentleman's cuts and beard care.", 4.6, 89, 27, 12.5, false, false, "none", 5),
  B("Fresh Cuts Co.", "Diego Santos", "Modern styles, skin fades, and color.", 4.7, 103, 29, 14.2, false, true, "trialing"),
  B("Heritage Barbershop", "Noah Bennett", "Traditional shop, three generations of barbers.", 4.8, 156, 24, 16.0, false, true, "active"),
  B("Northside Grooming", "Kai Nakamura", "Premium fades and scalp treatments.", 4.5, 67, 32, 18.5, false, false, "none"),
  B("The Chair Room", "Ravi Shah", "Private-chair appointments, no waiting.", 4.9, 94, 40, 21.0, false, true, "none", 8),
  B("Cutthroat Barbers", "Grace Lin", "Straight-razor fades and bold designs.", 4.6, 71, 28, 24.3, false, false, "none"),
];

export const REVIEWS: Review[] = [
  { id: "r1", barberId: "b1", author: "Marcus H.", stars: 5, body: "Best fade I've had in years. In and out in 30 minutes, lineup was razor sharp.", date: "2026-06-12" },
  { id: "r2", barberId: "b1", author: "Dana R.", stars: 5, body: "Booked through the app, no wait. Hot-towel shave was top notch.", date: "2026-06-08" },
  { id: "r3", barberId: "b1", author: "Owen C.", stars: 4, body: "Solid cut and friendly. Coupon made it a great deal.", date: "2026-05-30" },
  { id: "r4", barberId: "b2", author: "Priya R.", stars: 5, body: "The straight-razor shave is worth every penny.", date: "2026-06-10" },
  { id: "r5", barberId: "b2", author: "Theo M.", stars: 5, body: "Marcus is an artist. Booking was effortless.", date: "2026-06-02" },
  { id: "r6", barberId: "b3", author: "Sam W.", stars: 5, body: "Walked in, got a great taper. Old-school vibe.", date: "2026-06-05" },
];

export const APPOINTMENTS: Appointment[] = [
  { id: "a1", customerId: "cust", barberId: "b1", service: "Skin Fade", price: 40, startsAt: "2026-06-23T17:00:00", status: "booked" },
  { id: "a2", customerId: "cust", barberId: "b2", service: "Cut + Beard", price: 42, startsAt: "2026-06-28T11:30:00", status: "booked" },
  { id: "a3", customerId: "cust", barberId: "b1", service: "Classic Cut", price: 35, startsAt: "2026-05-24T16:00:00", status: "done" },
  { id: "a4", customerId: "cust", barberId: "b7", service: "Beard Trim", price: 26, startsAt: "2026-05-10T14:00:00", status: "done" },
  // incoming appointments for the demo barber (b1) from other customers
  { id: "a5", customerId: "c2", barberId: "b1", service: "Skin Fade", price: 40, startsAt: "2026-06-21T10:00:00", status: "booked" },
  { id: "a6", customerId: "c3", barberId: "b1", service: "Cut + Beard", price: 47, startsAt: "2026-06-21T11:00:00", status: "booked" },
  { id: "a7", customerId: "c4", barberId: "b1", service: "Classic Cut", price: 35, startsAt: "2026-06-22T15:30:00", status: "booked" },
];

export const FAVORITES: Favorite[] = [
  { customerId: "cust", barberId: "b2" }, { customerId: "cust", barberId: "b7" }, { customerId: "cust", barberId: "b15" },
];

export const OTHER_CUSTOMERS: Record<string, string> = { c2: "Eli Carter", c3: "Wes Nguyen", c4: "Jamal Brooks" };

export const SLOTS = ["9:00 AM", "9:45 AM", "10:30 AM", "11:15 AM", "1:00 PM", "1:45 PM", "2:30 PM", "3:15 PM", "4:00 PM", "5:00 PM"];
export const SLOT_TAKEN = new Set(["10:30 AM", "1:45 PM", "4:00 PM"]);

/* helpers */
export const initials = (n: string) => n.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
export const money = (n: number) => "$" + n.toLocaleString("en-US");
export const barber = (id: string) => BARBERS.find((b) => b.id === id);
export const fmtAppt = (iso: string) => new Date(iso).toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
export const fmtDay = (iso: string) => new Date(iso).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
export const custName = (id: string) => (id === "cust" ? "Jordan Avery" : OTHER_CUSTOMERS[id] || "Customer");
