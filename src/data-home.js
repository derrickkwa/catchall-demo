/* Extra sample data for Home, the decision log and the logging panel (owned by the "home" agent).
   Shared numbers stay in data.js; this file adds only what those screens need on top. */
CA.data.home = (function () {
  /* the team feed in the right rail */
  const feed = [
    { who: "maya", html: "Maya's <b>hit</b> on Kettle &amp; Co beat the AI", when: "09:12", go: "board" },
    { who: "jordan", html: "Jordan logged 3 calls on Acme Skincare", when: "08:40", go: "log" },
    { who: "sam", html: "Sam's <b>hit</b> on Bloom Coffee: CPA <span class=\"num\">−12%</span>", when: "07:05", go: "calls", ownerOnly: true },
    { who: "alex", html: "Alex explained 6 past changes on Northpaw", when: "Yesterday", go: "log" },
    { who: "maya", html: "Maya started a 14-day call on Peak Outdoors", when: "Yesterday", go: "log", buyerOnly: true },
  ];

  /* owner team view */
  const team = {
    hitRate: 58, graded: 112, hitMove: "▲ 3 pts", closer: 52, aiCloser: 60, capture: 62, captureMove: "▼ 4 pts",
    outside: 3,
    table: [
      { who: "maya", capture: 80, hit: 71, graded: 31, noReason: 1 },
      { who: "jordan", capture: 74, hit: 59, graded: 22, noReason: 1 },
      { who: "sam", capture: 71, hit: 64, graded: 25, noReason: null /* live: Sam's rows with no reason */ },
      { who: "omar", capture: 41, hit: 50, graded: 20, noReason: 17, below: true },
      { who: "alex", capture: null, hit: 55, graded: 21, noReason: null, notLinked: true },
    ],
  };

  const needsYou = [
    { id: "reconnect", lead: "link", title: "<b>Facebook access ends Nov 2</b> on Northpaw", acct: "north", sub: "connected by you · reconnect any time before then, it takes a minute", btn: "Reconnect", go: "acct-north-connection" },
    { id: "connect", lead: "jordan", title: "<b>Jordan asked you to connect</b> Peak Outdoors", acct: "peak", sub: "Oct 22 · 4 of Jordan's calls there can't be graded until it's connected", btn: "Connect", go: "acct-peak-connection" },
    { id: "join", lead: "join", title: "<b>sofia.reyes@harbormedia.co</b> wants to join Harbor Media", sub: "Oct 23 · signed up with your team's domain", btn: "Review", go: "team" },
  ];

  const outside = [
    { acct: "acme", head: "<b>CPA <span class=\"num\">$31.40</span></b>, above its range of <span class=\"num\">$22–$28</span>", sub: "4 days running · 2 changes logged before it", band: [30, 40], pin: 88 },
    { acct: "bloom", head: "<b>ROAS <span class=\"num\">1.9</span></b>, below its range of <span class=\"num\">2.3–3.1</span>", sub: "since Oct 20 · 1 change with no reason before it", band: [35, 40], pin: 14 },
    { acct: "kettle", head: "<b>Spend <span class=\"num\">$2.1k</span>/day</b>, below its range of <span class=\"num\">$2.6–3.4k</span>", sub: "since Oct 21 · budget cut by Maya Oct 20", band: [32, 36], pin: 12 },
  ];

  const worth = [
    { id: "w1", thumb: 1, title: "<b>Retargeting frequency <span class=\"num\">4.1</span></b>, above its range for 3 weeks", acct: "acme", camp: "Retargeting – Video", reason: "Fatigue", signal: "Frequency up", metric: "CPA", field: "Creative", dismissed: false },
    { id: "w2", type: "creative", title: "<b>2 of 9 creatives carry <span class=\"num\">80%</span> of spend</b>", acct: "bloom", camp: "Prospecting – Broad", reason: "Testing", signal: "CTR down", metric: "CTR", field: "Creative", dismissed: false },
  ];

  /* Sam in week one */
  const day1Coming = [
    { id: "w1a", acct: "acme", type: "budget", what: "Budget cut", detail: "$300 → $220/day", pred: "CPA ↓ in 7d", conf: 7, day: "2 of 7", pct: 29 },
    { id: "w1b", acct: "bloom", type: "creative", what: "Creative swap", detail: "2 new ads", pred: "CTR ↑ in 7d", conf: 6, day: "1 of 7", pct: 14, thumb: 2 },
    { id: "w1c", acct: "north", type: "audience", what: "New audience", detail: "interest stack", pred: "CPA ↓ in 14d", conf: 6, day: "1 of 14", pct: 7 },
  ];

  /* objects per account, as the latest snapshot would list them */
  const objects = {
    acme: ["Ad set · Prospecting – Broad", "Campaign · ASC", "Ad set · Retargeting – Video", "Campaign · Prospecting", "Ad · UGC hook test"],
    bloom: ["Campaign · Search – Brand", "Ad set · Retargeting – Video", "Ad set · Prospecting – Broad", "Ad · Morning ritual UGC"],
    north: ["Ad set · Prospecting – Broad", "Ad set · LAL – Purchasers", "Campaign · Retargeting – Video"],
    kettle: ["Campaign · ASC", "Ad set · Purchases", "Campaign · Search"],
    peak: ["Campaign · Prospecting", "Ad set · ASC"],
  };
  const fields = [
    { f: "Daily budget", type: "budget", old: "$400/day" },
    { f: "Bid cap", type: "bid", old: "$1.20" },
    { f: "Cost cap", type: "bid", old: "$24.00" },
    { f: "Audience", type: "audience", old: "LAL 1% purchasers" },
    { f: "Creative", type: "creative", old: "4 ads live" },
    { f: "Status", type: "pause", old: "Active" },
  ];

  /* day one: 214 changes from 12 months of change history, generated the same way every load */
  let seed = 214;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const months = [["Oct", 2026, 18, 22], ["Sep", 2026, 38, 30], ["Aug", 2026, 17, 31], ["Jul", 2026, 18, 31], ["Jun", 2026, 15, 30], ["May", 2026, 16, 31], ["Apr", 2026, 14, 30], ["Mar", 2026, 17, 31], ["Feb", 2026, 13, 28], ["Jan", 2026, 12, 31], ["Dec", 2025, 15, 31], ["Nov", 2025, 21, 30]];
  const camps = ["Prospecting – Broad", "ASC", "Retargeting – Video", "Search – Brand", "LAL – Purchasers", "Prospecting – Interests", "Summer sale", "BFCM 2025"];
  const tpl = [
    () => { const a = pick([150, 200, 250, 300, 400, 500, 600]); const b = Math.round(a * pick([0.6, 0.75, 1.25, 1.5]) / 10) * 10; return { type: "budget", what: "Budget", detail: `$${a} → $${b}/day` }; },
    () => ({ type: "creative", what: "Creative swap", detail: `${pick([2, 3, 4])} new ads`, thumb: Math.floor(rnd() * 9) }),
    () => ({ type: "creative", what: "New ad", detail: pick(["Autumn bundle carousel", "Founder story video", "UGC unboxing", "Before and after static", "Review montage"]), thumb: Math.floor(rnd() * 9) }),
    () => ({ type: "pause", what: "Paused", detail: pick(["3 ads", "2 ads", "1 ad set", "campaign"]), thumb: Math.floor(rnd() * 9) }),
    () => ({ type: "audience", what: "Audience", detail: pick(["excluded past purchasers", "LAL 1% → 2%", "broad, Advantage+ on", "added interest stack"]) }),
    () => { const a = pick([0.9, 1.1, 1.2, 1.5]); return { type: "bid", what: "Bid cap", detail: `$${a.toFixed(2)} → $${(a * pick([0.8, 1.2, 1.5])).toFixed(2)}` }; },
  ];
  const accts = ["acme", "bloom", "north", "kettle", "peak"];
  const buyers = ["sam", "jordan", "maya", "alex", "priya", "sam"];
  const history = [];
  /* the first October rows match the approved mockup */
  const fixed = [
    { date: "Oct 22", acct: "acme", who: "sam", type: "budget", what: "Budget", detail: "$400 → $250/day", camp: "Prospecting – Broad" },
    { date: "Oct 21", acct: "bloom", who: "jordan", type: "pause", what: "Paused", detail: "3 ads", camp: "Retargeting – Video", thumb: 3 },
    { date: "Oct 20", acct: "north", who: "sam", type: "bid", what: "Bid cap", detail: "$1.20 → $1.80", camp: "Retargeting – Video" },
    { date: "Oct 18", acct: "kettle", who: "alex", type: "creative", what: "New ad", detail: "Autumn bundle carousel", camp: "ASC", thumb: 1 },
    { date: "Oct 17", acct: "north", who: "alex", type: "audience", what: "Audience", detail: "excluded past purchasers", camp: "LAL – Purchasers" },
    { date: "Oct 15", acct: "peak", who: "maya", type: "budget", what: "Budget", detail: "$150 → $220/day", camp: "ASC" },
  ];
  let n = 0;
  months.forEach(([m, y, count, last]) => {
    const days = [];
    for (let i = 0; i < count; i++) days.push(Math.max(1, Math.round(last - (i * (last - 1)) / count - rnd() * 1.4)));
    days.sort((a, b) => b - a);
    days.forEach((d, i) => {
      n++;
      const base = m === "Oct" && i < fixed.length ? fixed[i] : { date: `${m} ${d}`, acct: pick(accts), who: pick(buyers), camp: pick(camps), ...pick(tpl)() };
      history.push({ id: "h" + n, year: y, source: "history", status: "reason", ...base });
    });
  });

  return { feed, team, needsYou, outside, worth, day1Coming, objects, fields, history, revealed: {}, setup: { facebook: false } };
})();
