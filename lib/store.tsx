"use client";

import { createContext, useContext, useMemo, useState, useCallback } from "react";
import {
  BARBERS, APPOINTMENTS, FAVORITES,
  type Barber, type Appointment, type Favorite, type Role, type SubStatus,
} from "./data";

export type View = "discover" | "profile" | "booking" | "appointments" | "favorites" | "coupons" | "dashboard" | "paywall";
export type { Role } from "./data";

type Toast = { id: number; msg: string } | null;
type Ctx = {
  role: Role | null; userId: string;
  view: View; barberId: string | null; dist: number; toast: Toast;
  barbers: Barber[]; appointments: Appointment[]; favorites: Favorite[];
  login: (r: Role) => void; signOut: () => void; go: (v: View) => void;
  openProfile: (id: string) => void; setDist: (d: number) => void;
  book: (barberId: string, service: string, price: number, slot: string) => void;
  toggleFav: (id: string) => void; isFav: (id: string) => boolean;
  subscribe: () => void;
  showToast: (m: string) => void;
};

const C = createContext<Ctx | null>(null);
export const useApp = () => { const c = useContext(C); if (!c) throw new Error("no provider"); return c; };

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [view, setView] = useState<View>("discover");
  const [barberId, setBarberId] = useState<string | null>(null);
  const [dist, setDist] = useState(50);
  const [toast, setToast] = useState<Toast>(null);
  const [barbers, setBarbers] = useState<Barber[]>(BARBERS);
  const [appointments, setAppts] = useState<Appointment[]>(APPOINTMENTS);
  const [favorites, setFavorites] = useState<Favorite[]>(FAVORITES);

  const showToast = useCallback((msg: string) => {
    const id = Math.floor(performance.now()); setToast({ id, msg });
    setTimeout(() => setToast((t) => (t && t.id === id ? null : t)), 2600);
  }, []);

  const value = useMemo<Ctx>(() => {
    const userId = role === "barber" ? "b1" : "cust";
    return {
      role, userId, view, barberId, dist, toast, barbers, appointments, favorites,
      login: (r) => { setRole(r); setView(r === "barber" ? "dashboard" : "discover"); window.scrollTo(0, 0); },
      signOut: () => { setRole(null); setView("discover"); setBarberId(null); },
      go: (v) => { setView(v); },
      openProfile: (id) => { setBarberId(id); setView("profile"); },
      setDist,
      book: (bid, service, price, slot) => {
        const id = "a_" + Math.floor(performance.now());
        const day = "2026-06-25";
        setAppts((xs) => [{ id, customerId: "cust", barberId: bid, service, price, startsAt: `${day}T${slotTo24(slot)}`, status: "booked" }, ...xs]);
        showToast("Appointment booked");
      },
      toggleFav: (id) => setFavorites((fs) => fs.some((f) => f.barberId === id && f.customerId === userId)
        ? fs.filter((f) => !(f.barberId === id && f.customerId === userId))
        : [...fs, { customerId: userId, barberId: id }]),
      isFav: (id) => favorites.some((f) => f.barberId === id && f.customerId === userId),
      subscribe: () => { setBarbers((bs) => bs.map((b) => (b.id === "b1" ? { ...b, sub: "active" as SubStatus, featured: true } : b))); showToast("Pro subscription active"); setView("dashboard"); },
      showToast,
    };
  }, [role, view, barberId, dist, toast, barbers, appointments, favorites, showToast]);

  return <C.Provider value={value}>{children}</C.Provider>;
}

function slotTo24(slot: string) {
  const m = slot.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return "12:00:00";
  let h = +m[1]; const min = m[2]; const pm = /pm/i.test(m[3]);
  if (pm && h !== 12) h += 12; if (!pm && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${min}:00`;
}
