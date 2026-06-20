"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import {
  BARBERS, REVIEWS, SLOTS, SLOT_TAKEN, barber, money, initials, fmtAppt, fmtDay, custName,
  type Barber,
} from "@/lib/data";
import { Icon, I, Stars } from "./ui";

function Pic({ b, className = "", children }: { b: Barber; className?: string; children?: React.ReactNode }) {
  return <div className={className} style={{ background: `linear-gradient(140deg, ${b.color}, ${b.color}aa 70%, ${b.color}77)` }}>{children}</div>;
}

/* ============================ DISCOVER ============================ */
export function Discover() {
  const { barbers, dist, setDist, openProfile, toggleFav, isFav, go, signOut } = useApp();
  const [chip, setChip] = useState("Providers");
  const featured = barbers.find((b) => b.featured)!;
  const near = barbers.filter((b) => b.distance <= dist).sort((a, b) => a.distance - b.distance);
  const chips = ["Providers", "Explore", "Appointments", "Favorites", "Coupons"];
  const onChip = (c: string) => { setChip(c); if (c === "Appointments") go("appointments"); else if (c === "Favorites") go("favorites"); else if (c === "Coupons") go("coupons"); };
  return (
    <>
      <div className="between"><div className="greet">Good morning, Jordan 👋</div>
        <button className="btn ghost" style={{ width: "auto", padding: 4 }} onClick={signOut} title="Sign out"><Icon d={I.signout} size={18} /></button></div>
      <div className="scr-h"><div><h1>Find a barber</h1></div></div>
      <div className="search"><Icon d={I.search} size={17} /><input placeholder="Looking for something?" /></div>
      <div className="chips">{chips.map((c) => <button key={c} className={`chip ${chip === c ? "on" : ""}`} onClick={() => onChip(c)}>{c}</button>)}</div>

      <div className="section-h"><h2>Featured near you</h2></div>
      <div className="feat" onClick={() => openProfile(featured.id)}>
        <Pic b={featured} className="feat-top">
          <Icon d={I.scissors} size={40} />
          <span className="feat-badge">★ Featured</span>
          {featured.coupon && <span className="feat-cpn">Get ${featured.coupon.amount} Off</span>}
        </Pic>
        <div className="feat-b">
          <div className="shop">{featured.shop}</div>
          <div className="feat-meta"><Stars n={featured.rating} /> <span className="dotsep" /> Cuts from {money(featured.priceFrom)} <span className="dotsep" /> <Icon d={I.pin} size={12} /> {featured.distance} mi</div>
        </div>
      </div>

      <div className="section-h"><h2>Near you</h2></div>
      <div className="distrow">
        {[15, 30, 50].map((d) => <button key={d} className={`dist ${dist === d ? "on" : ""}`} onClick={() => setDist(d)}>&lt; {d} mi</button>)}
      </div>
      <div className="plist mt">
        {near.map((b) => (
          <div className="pcard" key={b.id} onClick={() => openProfile(b.id)}>
            <Pic b={b} className="pic">{initials(b.shop)}</Pic>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="between"><span className="shop">{b.shop}</span>
                <button className={`heart ${isFav(b.id) ? "on" : ""}`} onClick={(e) => { e.stopPropagation(); toggleFav(b.id); }}><Icon d={I.heart} size={17} fill={isFav(b.id) ? "currentColor" : "none"} /></button>
              </div>
              <div className="pm"><Stars n={b.rating} /> <span className="dotsep" /> from {money(b.priceFrom)} <span className="dotsep" /> {b.distance} mi</div>
              <div className="pm">{b.availableNow ? <span className="now"><span className="pd" /> Available now</span> : <span className="soft" style={{ fontSize: 11.5 }}>Next: tomorrow</span>}{b.coupon && <span className="cpn-pill">${b.coupon.amount} Off</span>}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ============================ PROFILE ============================ */
export function Profile() {
  const { barberId, barbers, go, toggleFav, isFav } = useApp();
  const b = barbers.find((x) => x.id === barberId);
  if (!b) return <button className="btn" onClick={() => go("discover")}>Back</button>;
  const reviews = REVIEWS.filter((r) => r.barberId === b.id);
  return (
    <>
      <Pic b={b} className="cover">
        <Icon d={I.scissors} size={44} />
        <button className="back-fab" onClick={() => go("discover")}><Icon d={I.back} size={17} /></button>
        <button className={`fav-fab ${isFav(b.id) ? "on" : ""}`} onClick={() => toggleFav(b.id)}><Icon d={I.heart} size={17} fill={isFav(b.id) ? "currentColor" : "none"} /></button>
      </Pic>
      <div className="between"><div><h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>{b.shop}</h1>
        <div className="pm" style={{ marginTop: 5 }}><Stars n={b.rating} /> <span className="muted">({b.reviews})</span> <span className="dotsep" /> <Icon d={I.pin} size={12} /> {b.area} · {b.distance} mi</div></div>
        {b.availableNow && <span className="now"><span className="pd" /> Open</span>}</div>
      <p className="muted" style={{ fontSize: 13.5, lineHeight: 1.55, marginTop: 10 }}>{b.bio}</p>
      {b.coupon && <div className="coupon-banner"><Icon d={I.ticket} size={18} /> <b>{b.coupon.label}</b></div>}

      <div className="section-h"><h2>Photos</h2></div>
      <div className="gallery">{[0, 1, 2, 3].map((i) => <Pic key={i} b={b} className="gthumb"><Icon d={I.eye} size={16} /></Pic>)}</div>

      <div className="section-h"><h2>Services</h2></div>
      <div className="card" style={{ padding: "2px 15px" }}>
        {b.services.map((s) => (
          <div className="svc" key={s.name}>
            <div><div className="nm">{s.name}</div><div className="dur">{s.duration} min</div></div>
            <div className="flex"><span className="pr">{money(s.price)}</span></div>
          </div>
        ))}
      </div>

      <div className="section-h"><h2>Reviews</h2></div>
      <div className="card" style={{ padding: "2px 15px" }}>
        {(reviews.length ? reviews : [{ id: "x", author: "Verified client", stars: 5, body: "Great cut, easy booking.", date: "2026-06-01", barberId: b.id }]).map((r) => (
          <div className="review" key={r.id}>
            <div className="ra"><span className="av" style={{ background: b.color }}>{initials(r.author)}</span><span className="strong" style={{ fontSize: 13 }}>{r.author}</span><span className="stars" style={{ marginLeft: "auto" }}><Icon d={I.star} size={11} fill="currentColor" stroke={0} /> {r.stars}.0</span></div>
            <div className="muted" style={{ fontSize: 13, lineHeight: 1.5 }}>{r.body}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 18 }}><button className="btn primary" onClick={() => go("booking")}><Icon d={I.cal} size={17} /> Check availability</button></div>
    </>
  );
}

/* ============================ BOOKING ============================ */
export function Booking() {
  const { barberId, barbers, book, go } = useApp();
  const b = barbers.find((x) => x.id === barberId)!;
  const [svc, setSvc] = useState(b.services[1].name);
  const [slot, setSlot] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const service = b.services.find((s) => s.name === svc)!;

  if (done) {
    return (
      <div className="appbody" style={{ textAlign: "center", paddingTop: 30 }}>
        <div className="success-ring"><Icon d={I.check} size={34} /></div>
        <h1 style={{ fontSize: 23, fontWeight: 800, margin: "0 0 6px" }}>You&apos;re booked!</h1>
        <p className="muted" style={{ fontSize: 14 }}>{service.name} at <b style={{ color: "var(--text)" }}>{b.shop}</b></p>
        <p className="muted" style={{ fontSize: 13.5 }}>{fmtDay("2026-06-25")} · {slot}</p>
        <div className="card" style={{ textAlign: "left", marginTop: 18 }}>
          <div className="confirm-row"><span className="muted">Service</span><span className="strong">{service.name}</span></div>
          <div className="confirm-row"><span className="muted">Barber</span><span className="strong">{b.shop}</span></div>
          <div className="confirm-row"><span className="muted">When</span><span className="strong">{slot}, Jun 25</span></div>
          <div className="confirm-row"><span className="muted">Total</span><span className="strong" style={{ color: "var(--accent)" }}>{money(service.price)}</span></div>
        </div>
        <div className="mt2"><button className="btn primary" onClick={() => go("appointments")}>View my appointments</button></div>
        <div className="mt"><button className="btn ghost" onClick={() => go("discover")}>Back to discover</button></div>
      </div>
    );
  }

  return (
    <div className="appbody">
      <div className="flex" style={{ marginBottom: 12 }}><button className="back-fab" style={{ position: "static" }} onClick={() => go("profile")}><Icon d={I.back} size={17} /></button><h1 style={{ fontSize: 21, fontWeight: 800, margin: 0 }}>Book {b.shop}</h1></div>

      <div className="section-h"><h2>1. Choose a service</h2></div>
      <div className="card" style={{ padding: "2px 15px" }}>
        {b.services.map((s) => (
          <div className="svc" key={s.name} onClick={() => setSvc(s.name)} style={{ cursor: "pointer" }}>
            <div><div className="nm">{s.name}</div><div className="dur">{s.duration} min</div></div>
            <div className="flex"><span className="pr">{money(s.price)}</span>
              <span style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${svc === s.name ? "var(--accent)" : "var(--line)"}`, display: "grid", placeItems: "center" }}>{svc === s.name && <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--accent)" }} />}</span></div>
          </div>
        ))}
      </div>

      <div className="section-h"><h2>2. Pick a time</h2><span className="see">{fmtDay("2026-06-25")}</span></div>
      <div className="slotgrid">
        {SLOTS.map((s) => {
          const taken = SLOT_TAKEN.has(s);
          return <button key={s} className={`slot ${slot === s ? "on" : ""} ${taken ? "taken" : ""}`} disabled={taken} onClick={() => setSlot(s)}>{s}</button>;
        })}
      </div>

      <div style={{ marginTop: 20 }}>
        <button className="btn primary" disabled={!slot} onClick={() => { book(b.id, service.name, service.price, slot!); setDone(true); }}>
          {slot ? `Confirm — ${money(service.price)} at ${slot}` : "Select a time"}
        </button>
      </div>
    </div>
  );
}

/* ============================ APPOINTMENTS ============================ */
export function Appointments() {
  const { appointments, openProfile } = useApp();
  const mine = appointments.filter((a) => a.customerId === "cust");
  const upcoming = mine.filter((a) => a.status === "booked").sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const past = mine.filter((a) => a.status === "done");
  const Row = ({ a }: { a: typeof mine[number] }) => {
    const b = barber(a.barberId)!;
    return (
      <div className="appt" onClick={() => openProfile(b.id)}>
        <Pic b={b} className="pic">{initials(b.shop)}</Pic>
        <div style={{ flex: 1 }}><div className="strong" style={{ fontSize: 14 }}>{b.shop}</div>
          <div className="when">{fmtAppt(a.startsAt)}</div><div className="muted" style={{ fontSize: 12 }}>{a.service} · {money(a.price)}</div></div>
        <span className={`pill ${a.status}`}>{a.status === "booked" ? "Upcoming" : "Completed"}</span>
      </div>
    );
  };
  return (
    <>
      <div className="scr-h"><div><h1>My bookings</h1></div></div>
      <div className="section-h"><h2>Upcoming</h2></div>
      {upcoming.length ? upcoming.map((a) => <Row key={a.id} a={a} />) : <div className="empty">No upcoming appointments.</div>}
      <div className="section-h"><h2>Past</h2></div>
      {past.map((a) => <Row key={a.id} a={a} />)}
    </>
  );
}

/* ============================ FAVORITES ============================ */
export function Favorites() {
  const { favorites, userId, openProfile, toggleFav } = useApp();
  const favs = favorites.filter((f) => f.customerId === userId).map((f) => barber(f.barberId)!).filter(Boolean);
  return (
    <>
      <div className="scr-h"><div><h1>Favorites</h1></div></div>
      {favs.length ? (
        <div className="plist">{favs.map((b) => (
          <div className="pcard" key={b.id} onClick={() => openProfile(b.id)}>
            <Pic b={b} className="pic">{initials(b.shop)}</Pic>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="between"><span className="shop">{b.shop}</span><button className="heart on" onClick={(e) => { e.stopPropagation(); toggleFav(b.id); }}><Icon d={I.heart} size={17} fill="currentColor" /></button></div>
              <div className="pm"><Stars n={b.rating} /> <span className="dotsep" /> from {money(b.priceFrom)} <span className="dotsep" /> {b.distance} mi</div>
            </div>
          </div>
        ))}</div>
      ) : <div className="empty">Tap the heart on any barber to save them here.</div>}
    </>
  );
}

/* ============================ COUPONS ============================ */
export function Coupons() {
  const { barbers, openProfile } = useApp();
  const withCoupons = barbers.filter((b) => b.coupon);
  return (
    <>
      <div className="scr-h"><div><h1>Coupons</h1><div className="sub">Deals from barbers near you</div></div></div>
      {withCoupons.map((b) => (
        <div className="coupon" key={b.id} onClick={() => openProfile(b.id)}>
          <div className="amt">${b.coupon!.amount}</div>
          <div style={{ flex: 1 }}><div className="strong" style={{ fontSize: 14 }}>{b.coupon!.label}</div><div className="muted" style={{ fontSize: 12.5 }}>{b.shop} · {b.area}</div></div>
          <Icon d={I.chev} size={18} className="soft" />
        </div>
      ))}
    </>
  );
}

/* ============================ PROVIDER DASHBOARD ============================ */
export function Dashboard() {
  const { barbers, appointments, go, signOut } = useApp();
  const b = barbers.find((x) => x.id === "b1")!;
  const incoming = appointments.filter((a) => a.barberId === "b1" && a.status === "booked").sort((a, b2) => a.startsAt.localeCompare(b2.startsAt));
  const reviews = REVIEWS.filter((r) => r.barberId === "b1");
  return (
    <>
      <div className="between" style={{ marginTop: 4 }}>
        <div className="flex"><Pic b={b} className="pic" >{initials(b.shop)}</Pic>
          <div><div className="strong" style={{ fontSize: 17 }}>{b.shop}</div><div className="muted" style={{ fontSize: 12.5 }}><Stars n={b.rating} /> · {b.reviews} reviews</div></div></div>
        <button className="btn ghost" style={{ width: "auto" }} onClick={signOut}><Icon d={I.signout} size={18} /></button>
      </div>

      <div className="billing" style={{ marginTop: 16 }}>
        <div className="between">
          <div><div className="muted" style={{ fontSize: 12.5 }}>Subscription</div>
            <div className="strong" style={{ fontSize: 15, marginTop: 2 }}>ChairTime {b.sub === "active" ? "Pro" : "Free"}</div></div>
          <span className={`pill ${b.sub}`}>{b.sub === "active" ? "Active" : b.sub === "trialing" ? "Trial · 2 days left" : "Not listed"}</span>
        </div>
        {b.sub !== "active" && (
          <>
            <div className="muted" style={{ fontSize: 12.5, margin: "10px 0 12px" }}>{b.sub === "trialing" ? "Your free trial ends soon — upgrade to stay listed and featured." : "Subscribe to get listed in search and featured to nearby customers."}</div>
            <button className="btn primary" onClick={() => go("paywall")}><Icon d={I.crown} size={17} /> Upgrade to Pro</button>
          </>
        )}
        {b.sub === "active" && <div className="muted" style={{ fontSize: 12.5, marginTop: 10 }}>You&apos;re listed &amp; featured. Renews Jun 20, 2027 · {money(149)}/yr.</div>}
      </div>

      <div className="dash-stats">
        <div className="dstat"><div className="v mono">{incoming.length}</div><div className="l">Upcoming bookings</div></div>
        <div className="dstat"><div className="v mono">{b.rating.toFixed(1)}</div><div className="l">Avg rating</div></div>
        <div className="dstat"><div className="v mono">312</div><div className="l">Profile views (30d)</div></div>
        <div className="dstat"><div className="v mono">{money(1840)}</div><div className="l">Booked revenue (30d)</div></div>
      </div>

      <div className="section-h"><h2>Incoming appointments</h2></div>
      {incoming.map((a) => (
        <div className="appt" key={a.id}>
          <span className="pic" style={{ background: "var(--card2)", color: "var(--muted)", fontWeight: 700 }}>{initials(custName(a.customerId))}</span>
          <div style={{ flex: 1 }}><div className="strong" style={{ fontSize: 14 }}>{custName(a.customerId)}</div><div className="when">{fmtAppt(a.startsAt)}</div><div className="muted" style={{ fontSize: 12 }}>{a.service} · {money(a.price)}</div></div>
          <span className="pill booked">Booked</span>
        </div>
      ))}

      <div className="section-h"><h2>Services &amp; pricing</h2></div>
      <div className="card" style={{ padding: "2px 15px" }}>
        {b.services.map((s) => <div className="list-row" key={s.name}><div><div className="strong" style={{ fontSize: 13.5 }}>{s.name}</div><div className="soft" style={{ fontSize: 12 }}>{s.duration} min</div></div><span className="strong">{money(s.price)}</span></div>)}
      </div>

      <div className="section-h"><h2>Recent reviews</h2></div>
      <div className="card" style={{ padding: "2px 15px" }}>
        {reviews.map((r) => (
          <div className="review" key={r.id}><div className="ra"><span className="av" style={{ background: b.color }}>{initials(r.author)}</span><span className="strong" style={{ fontSize: 13 }}>{r.author}</span><span className="stars" style={{ marginLeft: "auto" }}><Icon d={I.star} size={11} fill="currentColor" stroke={0} /> {r.stars}.0</span></div><div className="muted" style={{ fontSize: 13 }}>{r.body}</div></div>
        ))}
      </div>
    </>
  );
}

/* ============================ PAYWALL ============================ */
export function Paywall() {
  const { go, subscribe } = useApp();
  const [plan, setPlan] = useState<"year" | "month">("year");
  return (
    <div className="paywall">
      <button className="pw-x" onClick={() => go("dashboard")}>✕</button>
      <div className="pw-crown"><Icon d={I.crown} size={30} /></div>
      <div className="pw-h">ChairTime Pro</div>
      <div className="pw-sub">Get listed in search, featured to nearby clients, and take unlimited bookings.</div>

      <div>
        {["Featured placement in “Near You”", "Unlimited online bookings", "Coupons & promotions", "Reviews & analytics dashboard"].map((f) => (
          <div className="pw-feat" key={f}><span className="ck"><Icon d={I.check} size={14} /></span>{f}</div>
        ))}
      </div>

      <div className={`plan ${plan === "year" ? "" : "alt"}`} onClick={() => setPlan("year")}>
        <span className="save">Best value · Save 40%</span>
        <div className="between"><div><div className="pn">Yearly Pro</div><div className="soft" style={{ fontSize: 12 }}>billed annually</div></div>
          <div style={{ textAlign: "right" }}><div className="pp">$149<span style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)" }}>/yr</span></div><div className="soft" style={{ fontSize: 11.5 }}>≈ $12/mo</div></div></div>
      </div>
      <div className={`plan ${plan === "month" ? "" : "alt"}`} onClick={() => setPlan("month")} style={{ marginTop: 10 }}>
        <div className="between"><div className="pn">Monthly</div><div className="pp" style={{ fontSize: 18 }}>$19<span style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)" }}>/mo</span></div></div>
      </div>

      <div style={{ marginTop: 16 }}><button className="btn primary" onClick={subscribe}>Start 3-day free trial</button></div>
      <div className="trial-note">Then {plan === "year" ? "$149/yr" : "$19/mo"} · cancel anytime · Stripe test mode (card 4242)</div>
    </div>
  );
}
