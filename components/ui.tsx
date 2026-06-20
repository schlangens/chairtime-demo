export function Icon({ d, size = 18, stroke = 1.8, fill = "none", className }: { d: string; size?: number; stroke?: number; fill?: string; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={fill}
      stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      {d.split("|").map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

export const I = {
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z|M21 21l-4-4",
  discover: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20|M16.2 7.8l-2.9 6.4-6.4 2.9 2.9-6.4z",
  cal: "M8 2v4|M16 2v4|M3 10h18|M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  heart: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.5 1-1a5.5 5.5 0 0 0 0-7.8z",
  ticket: "M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H5a2 2 0 0 1-2-2 2 2 0 0 0 0-4z|M13 6v12",
  pin: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z|M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  star: "M12 2l3 6.5 7 .8-5 4.9 1.3 7L12 18l-6.3 3.2L7 14.2l-5-4.9 7-.8z",
  back: "M19 12H5|M12 19l-7-7 7-7",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20|M12 6v6l4 2",
  scissors: "M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z|M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z|M8.1 8.1 20 20|M8.1 15.9 20 4|M14.5 12l1.5 1.2",
  check: "M20 6L9 17l-5-5",
  chev: "M9 6l6 6-6 6",
  crown: "M2 7l5 5 5-7 5 7 5-5-2 12H4z",
  bolt: "M13 2L3 14h9l-1 8 10-12h-9z",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2|M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
  store: "M3 9l1-5h16l1 5M4 9v11h16V9M4 9h16M9 20v-6h6v6",
  signout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4|M16 17l5-5-5-5|M21 12H9",
  dollar: "M12 1v22|M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z|M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  msg: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  wifi: "M5 12.5a10 10 0 0 1 14 0|M8.5 16a5 5 0 0 1 7 0|M12 19.5h.01",
  battery: "M2 7h16v10H2z|M20 10v4",
  signal: "M2 20h3v-4H2zM8 20h3v-8H8zM14 20h3V8h-3zM20 20h2V4h-2z",
};

export function Stars({ n }: { n: number }) {
  return <span className="stars"><Icon d={I.star} size={12} fill="currentColor" stroke={0} /> {n.toFixed(1)}</span>;
}
