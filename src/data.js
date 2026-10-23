/* CatchAll demo: shared sample data. Every screen reads from here so numbers agree.
   All names are fictional. Today is Thu Oct 23 2026; the October season ends Oct 31, final Nov 14. */
window.CA = window.CA || {};
CA.data = {
  today: "Oct 23",
  season: { name: "October 2026", daysLeft: 8, final: "Nov 14", prizePlaces: 5 },
  workspace: { name: "Harbor Media", tz: "Asia/Singapore" },

  people: {
    sam:   { id: "sam",   name: "Sam Kim",      short: "Sam",    initials: "SK", color: "var(--ink)",  role: "buyer", linked: true },
    dana:  { id: "dana",  name: "Dana Wells",   short: "Dana",   initials: "DW", color: "var(--c6)",  role: "owner", linked: true },
    maya:  { id: "maya",  name: "Maya Chen",    short: "Maya",   initials: "MC", color: "var(--c3)",  role: "buyer", linked: true },
    jordan:{ id: "jordan",name: "Jordan Lee",   short: "Jordan", initials: "JL", color: "var(--c2)",  role: "admin", linked: true },
    priya: { id: "priya", name: "Priya Shah",   short: "Priya",  initials: "PS", color: "var(--c5)",  role: "buyer", linked: true },
    leo:   { id: "leo",   name: "Leo Martins",  short: "Leo",    initials: "LM", color: "var(--c1)",  role: "buyer", linked: true },
    nadia: { id: "nadia", name: "Nadia Okafor", short: "Nadia",  initials: "NO", color: "var(--c4)",  role: "buyer", linked: true },
    alex:  { id: "alex",  name: "Alex Rivera",  short: "Alex",   initials: "AR", color: "var(--c4)",  role: "buyer", linked: false },
    ben:   { id: "ben",   name: "Ben Turner",   short: "Ben",    initials: "BT", color: "var(--c2)",  role: "buyer", linked: true },
    ivy:   { id: "ivy",   name: "Ivy Zhang",    short: "Ivy",    initials: "IZ", color: "var(--c5)",  role: "buyer", linked: true },
    omar:  { id: "omar",  name: "Omar Haddad",  short: "Omar",   initials: "OH", color: "var(--c3)",  role: "buyer", linked: true },
    chris: { id: "chris", name: "Chris Park",   short: "Chris",  initials: "CP", color: "var(--c1)",  role: "buyer", linked: true },
  },

  accounts: [
    { id: "acme",  name: "Acme Skincare", short: "Acme",  color: "var(--c1)", status: "ok",   tz: "New York",   synced: "06:04", currency: "USD" },
    { id: "bloom", name: "Bloom Coffee",  short: "Bloom", color: "var(--c2)", status: "ok",   tz: "Los Angeles",synced: "06:02", currency: "USD" },
    { id: "north", name: "Northpaw",      short: "Northpaw", color: "var(--c3)", status: "warn", tz: "Chicago", synced: "Oct 22", currency: "USD", note: "Facebook access ends Nov 2" },
    { id: "kettle",name: "Kettle & Co",   short: "Kettle", color: "var(--c4)", status: "ok",  tz: "New York",   synced: "06:01", currency: "USD" },
    { id: "peak",  name: "Peak Outdoors", short: "Peak",  color: "var(--c5)", status: "none", tz: "Denver",    synced: "never", currency: "USD", note: "Not connected yet" },
  ],
  accountCount: 15,

  /* Sam's season, the one set of numbers every screen uses */
  me: {
    logged: 31, graded: 25, hits: 16, misses: 6, noise: 3, waiting: 4, cantGrade: 2,
    hitRate: 64, skill: "+0.12", vsAI: "+0.04", closerThanAI: 16, shared: 25,
    capture: 71, counted: 25, rank: 6, of: 10, gapToPlace: "0.03", moved: "▲ 2", needsReason: 4,
  },

  /* team board, skill = 1 − Brier ratio vs baseline, higher is better */
  board: [
    { rank: 1, who: "maya",  calls: 31, skill: "+0.21", vsAI: "+0.08", hit: 71, cal: "Close to spot on", week: "–" },
    { rank: 2, who: "jordan",calls: 22, skill: "+0.18", vsAI: "+0.05", hit: 59, cal: "Slightly unsure",  week: "▲ 1" },
    { rank: 3, who: "priya", calls: 26, skill: "+0.17", vsAI: "+0.04", hit: 62, cal: "Overconfident",    week: "▼ 1" },
    { rank: 4, who: "leo",   calls: 28, skill: "+0.16", vsAI: "+0.03", hit: 60, cal: "Close to spot on", week: "▲ 2" },
    { rank: 5, who: "nadia", calls: 23, skill: "+0.15", vsAI: "+0.02", hit: 61, cal: "Slightly unsure",  week: "–" },
    { rank: 6, who: "sam",   calls: 25, skill: "+0.12", vsAI: "+0.04", hit: 64, cal: "A bit overconfident", week: "▲ 2" },
    { ref: "ai", label: "CatchAll AI", calls: 101, skill: "+0.10", hit: 61, cal: "Close to spot on" },
    { rank: 7, who: "alex",  calls: 21, skill: "+0.08", vsAI: "−0.01", hit: 55, cal: "Close to spot on", week: "▼ 3" },
    { rank: 8, who: "ben",   calls: 20, skill: "+0.05", vsAI: "−0.04", hit: 56, cal: "Slightly unsure",  week: "▲ 1" },
    { rank: 9, who: "ivy",   calls: 20, skill: "+0.03", vsAI: "−0.05", hit: 52, cal: "Overconfident",    week: "–" },
    { ref: "base", label: "Baseline", calls: 101, skill: "0.00", hit: 52, cal: "–" },
    { rank: 10, who: "omar", calls: 20, skill: "−0.02", vsAI: "−0.09", hit: 50, cal: "Overconfident",    week: "▼ 1" },
  ],
  notRanked: [
    { who: "chris", note: "+0.24 on 16 calls, would be #1", needs: "4 more calls to qualify" },
  ],
  globalBoard: [
    { rank: 1, name: "Rina Takeda", handle: "@rinat", calls: 64, skill: "+0.31", week: "–" },
    { rank: 2, name: "Kofi Mensah", handle: "@kofi", calls: 48, skill: "+0.28", week: "▲ 1" },
    { rank: 3, name: "Maya Chen", handle: "@mayac", calls: 31, skill: "+0.21", week: "▲ 4" },
    { rank: 4, name: "Lena Brandt", handle: "@lenab", calls: 52, skill: "+0.20", week: "▼ 2" },
    { rank: 5, name: "Ravi Iyer", handle: "@ravi", calls: 40, skill: "+0.19", week: "–" },
    { rank: 6, name: "Jordan Lee", handle: "@jlee", calls: 22, skill: "+0.18", week: "▼ 1" },
    { rank: 7, name: "Ana Souza", handle: "@anas", calls: 35, skill: "+0.17", week: "▲ 2" },
    { rank: 8, name: "Tom Okafor", handle: "@tomo", calls: 29, skill: "+0.15", week: "–" },
  ],

  /* decisions and calls. status: hit | miss | noise | wait | reason (needs a reason) | none (no prediction) | cant
     source: plugin | manual | history; tier: recorded | late | unconnected | recalled */
  decisions: [
    { id: "d1",  date: "Oct 22", acct: "acme",  who: "sam",   type: "budget",   what: "Budget", detail: "$400 → $250/day", camp: "Prospecting – Broad", source: "history", status: "reason" },
    { id: "d2",  date: "Oct 22", acct: "bloom", who: "sam",   type: "pause",    what: "Paused 3 ads", detail: "", camp: "Retargeting – Video", source: "history", status: "reason", thumb: 2 },
    { id: "d3",  date: "Oct 21", acct: "acme",  who: "jordan",type: "audience", what: "New ad set", detail: "LAL 2% purchasers", camp: "Prospecting", source: "plugin", status: "wait", pred: "Conversions ↑ in 14d", conf: 7, day: "2 of 14", reason: "Scale the winning audience" },
    { id: "d4",  date: "Oct 21", acct: "kettle",who: "maya",  type: "creative", what: "Creative swap", detail: "3 new UGC ads", camp: "ASC", source: "plugin", status: "wait", pred: "CTR ↑ in 7d", conf: 6, day: "2 of 7", thumb: 3, reason: "Top ads fatiguing" },
    { id: "d5",  date: "Oct 20", acct: "north", who: "sam",   type: "budget",   what: "Budget", detail: "$150 → $220/day", camp: "Prospecting – Broad", source: "history", status: "reason" },
    { id: "d6",  date: "Oct 20", acct: "acme",  who: "sam",   type: "budget",   what: "Budget cut", detail: "$600 → $450/day", camp: "ASC", source: "plugin", status: "wait", pred: "CPA ↓ in 7d", conf: 7, day: "3 of 7", reason: "CPA above range three days running" },
    { id: "d7",  date: "Oct 19", acct: "bloom", who: "jordan",type: "hold",     what: "Reviewed, holding", detail: "", camp: "Search – Brand", source: "plugin", status: "none", reason: "Waiting for the promo to end" },
    { id: "d8",  date: "Oct 18", acct: "bloom", who: "sam",   type: "bid",      what: "Bid cap", detail: "$1.20 → $1.80", camp: "Search – Brand", source: "plugin", status: "hit", pred: "CPA ↓ in 7d", conf: 7, move: "−12%", band: "±6%", ai: "no change", aiResult: "miss", score: "0.09", reason: "Losing auctions at peak hours", isNew: true, thumb: 1 },
    { id: "d9",  date: "Oct 16", acct: "acme",  who: "sam",   type: "creative", what: "Creative swap", detail: "ASC", camp: "ASC", source: "plugin", status: "noise", pred: "CTR ↑ in 7d", conf: 6, move: "+2%", band: "±5%", ai: "CTR ↑", aiResult: "noise", thumb: 4, reason: "Fatigue on the top two" },
    { id: "d10", date: "Oct 14", acct: "north", who: "sam",   type: "audience", what: "New audience", detail: "LAL 2%", camp: "Prospecting", source: "plugin", status: "miss", pred: "Conversions ↑ in 7d", conf: 8, move: "−18%", band: "±7%", ai: "no change", aiResult: "noise", score: "0.64", reason: "Broaden reach before Q4" },
    { id: "d11", date: "Oct 12", acct: "kettle",who: "maya",  type: "bid",      what: "Cost cap", detail: "$24 → $28", camp: "Purchases", source: "plugin", status: "hit", pred: "Conversions ↑ in 14d", conf: 7, move: "+22%", band: "±8%", ai: "Conversions ↑", aiResult: "hit" },
    { id: "d12", date: "Oct 9",  acct: "acme",  who: "jordan",type: "budget",   what: "Budget", detail: "$300 → $500/day", camp: "Prospecting", source: "history", status: "reason" },
    { id: "d13", date: "Oct 7",  acct: "peak",  who: "sam",   type: "budget",   what: "Spend shift", detail: "to Prospecting", camp: "Prospecting", source: "manual", status: "cant", pred: "CPA ↓ in 7d", conf: 6, tier: "unconnected", reason: "Testing broader targeting" },
    { id: "d14", date: "Oct 3",  acct: "acme",  who: null,    type: "audience", what: "Audience edit", detail: "excluded past purchasers", camp: "Retargeting", source: "outside", status: "outside" },
    { id: "d15", date: "Sep 30", acct: "bloom", who: "sam",   type: "creative", what: "New ad", detail: "\"Morning ritual\" UGC hook", camp: "Prospecting – Broad", source: "manual", status: "hit", tier: "late", pred: "CPA ↓ in 14d", conf: 7, move: "−9%", band: "±5%", thumb: 5 },
    { id: "d16", date: "Sep 26", acct: "kettle",who: "alex",  type: "pause",    what: "Paused 2 ads", detail: "", camp: "Search", source: "history", status: "reason", tier: "recalled", reason: "Spend with no sales for 9 days" },
  ],

  reasons: ["CPA too high", "Fatigue", "Scaling a winner", "Testing", "Budget pacing", "Client asked", "Seasonality", "Tracking issue"],
  signals: ["Frequency up", "CTR down", "CPM up", "CPA above range", "ROAS below range", "Learning limited"],

  notifications: [
    { kind: "graded", text: "Your bid cap call on Bloom Coffee was graded: Hit", when: "08:10", go: "calls" },
    { kind: "warn", text: "Northpaw: Facebook access ends Nov 2. Reconnect to keep syncing.", when: "yesterday", go: "acct-north-connection" },
    { kind: "info", text: "Jordan asked you to connect Peak Outdoors", when: "yesterday", go: "team" },
  ],

  thumbs: [
    "linear-gradient(140deg,#E8B4A0,#B5654A)", "linear-gradient(160deg,#9DB8D9,#3C5E8C)", "linear-gradient(150deg,#C9D8B6,#6E8B4E)",
    "linear-gradient(140deg,#E9D3A6,#A9792F)", "linear-gradient(140deg,#D6C2E3,#7A5A96)", "linear-gradient(140deg,#F0C9C2,#B4685E)",
    "linear-gradient(140deg,#BFD9D6,#4E8A85)", "linear-gradient(140deg,#E6E0C8,#8F8660)", "linear-gradient(140deg,#C8C3E6,#5E58A0)",
  ],
};
