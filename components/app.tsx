"use client";

import { AppProvider, useApp, type View, type Role } from "@/lib/store";
import { Icon, I } from "./ui";
import { Discover, Profile, Booking, Appointments, Favorites, Coupons, Dashboard, Paywall } from "./views";

function Banner() {
  return <div className="banner"><span className="pin">●</span> <b>ChairTime — demo.</b> Mock data · Stripe test mode · production runs Supabase Auth, RLS &amp; Storage.</div>;
}

function StatusBar() {
  return (
    <div className="statusbar">
      <span>9:41</span>
      <span className="ico"><Icon d={I.signal} size={15} fill="currentColor" stroke={0} /><Icon d={I.wifi} size={15} /><Icon d={I.battery} size={16} /></span>
    </div>
  );
}

function Welcome() {
  const { login } = useApp();
  const roles: { id: Role; ic: string; color: string; rn: string; rs: string }[] = [
    { id: "customer", ic: I.user, color: "#f59e0b", rn: "I'm looking for a cut", rs: "Browse barbers, book, manage appointments" },
    { id: "barber", ic: I.store, color: "#0ea5e9", rn: "I'm a barber", rs: "Manage your shop and subscribe to get listed" },
  ];
  return (
    <div className="welcome">
      <div className="wlogo">CT</div>
      <h1>Find &amp; book<br />your barber.</h1>
      <p>Discover great barbers near you, see real reviews, and book an open chair in seconds.</p>
      {roles.map((r) => (
        <button key={r.id} className="role-btn" onClick={() => login(r.id)}>
          <span className="ric" style={{ background: r.color, color: "#1a1205" }}><Icon d={r.ic} size={20} /></span>
          <span><div className="rn">{r.rn}</div><div className="rs">{r.rs}</div></span>
          <Icon className="arr" d={I.chev} size={18} />
        </button>
      ))}
      <div className="divider">demo sign-in · no account needed</div>
    </div>
  );
}

const VIEWS: Record<string, React.ComponentType> = {
  discover: Discover, profile: Profile, booking: Booking, appointments: Appointments,
  favorites: Favorites, coupons: Coupons, dashboard: Dashboard, paywall: Paywall,
};

const CUST_TABS: { id: View; label: string; icon: string }[] = [
  { id: "discover", label: "Discover", icon: I.discover },
  { id: "appointments", label: "Bookings", icon: I.cal },
  { id: "favorites", label: "Favorites", icon: I.heart },
  { id: "coupons", label: "Coupons", icon: I.ticket },
];
const BARBER_TABS: { id: View; label: string; icon: string }[] = [
  { id: "dashboard", label: "Shop", icon: I.store },
  { id: "paywall", label: "Pro", icon: I.crown },
];

function TabBar() {
  const { role, view, go } = useApp();
  const tabs = role === "barber" ? BARBER_TABS : CUST_TABS;
  const active = (id: View) => view === id || (id === "discover" && (view === "profile" || view === "booking"));
  return (
    <div className="tabbar">
      {tabs.map((t) => (
        <button key={t.id} className={`tab ${active(t.id) ? "on" : ""}`} onClick={() => go(t.id)}>
          <Icon d={t.icon} size={21} fill={active(t.id) && t.id === "favorites" ? "currentColor" : "none"} /><span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return <div className="toast"><span className="tk">✓</span>{toast.msg}</div>;
}

function Root() {
  const { role, view } = useApp();
  const Active = VIEWS[view] || Discover;
  const fullscreen = view === "booking" || view === "paywall";
  return (
    <>
      <Banner />
      <div className="stage">
        <div className="device">
          <div className="notch" />
          <div className="screen">
            <StatusBar />
            {!role ? <Welcome /> : (
              <>
                {view === "paywall" ? <Paywall /> : <div className="appbody"><Active /></div>}
                {!fullscreen && <TabBar />}
              </>
            )}
          </div>
        </div>
      </div>
      <Toast />
    </>
  );
}

export default function App() {
  return <AppProvider><Root /></AppProvider>;
}
