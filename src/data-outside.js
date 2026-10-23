/* CatchAll demo: sample data for the screens outside the app (onboarding, client view, public pages).
   Figures agree with CA.data (Acme Skincare, Maya Chen, the global board). All names are fictional. */
window.CA = window.CA || {};
CA.data = CA.data || {};
CA.data.outside = {
  domain: "harbormedia.com",
  ownerEmail: "dana@harbormedia.com",
  buyerEmail: "sam@harbormedia.com",

  /* what Facebook returns in the owner's account picker */
  fbAccounts: [
    { id: "acme",  name: "Acme Skincare",       act: "act_2081734455", status: "Active" },
    { id: "bloom", name: "Bloom Coffee",        act: "act_1193058821", status: "Active" },
    { id: "north", name: "Northpaw",            act: "act_6620419037", status: "Active" },
    { id: "kettle-old", name: "Kettle & Co (old)", act: "act_3307725190", status: "Disabled" },
    { id: "peak-eu", name: "Peak Outdoors – EU", act: "act_9014452268", status: "Unsettled: unpaid balance" },
  ],
  auditSteps: [
    "Change history, 12 months · 214 changes",
    "Performance and normal ranges",
    "Account settings and attribution",
    "Creative health and reach",
    "What your past changes did next",
  ],

  /* the free audit of Acme Skincare (the same numbers on onboarding, the shared audit and the client view) */
  audit: {
    changes: 214, improved: 81, worse: 47, noEffect: 86, pctImproved: 38, pctWorse: 22, pctNone: 40, noise: "±11%",
    lever: "Creative", leverPct: 46,
    topSpendShare: 81, concepts: 5, medianAge: 48, reachDrop: "−34%", competitors: 6, segments: 5,
    snapshot: "Oct 20", snapshotTime: "14:02", expires: "Nov 19",
  },
  competitors: [
    { name: "Lumen Botanica", note: "Before-and-after proof", days: 212 },
    { name: "Dewpoint Labs", note: "Dermatologist on camera", days: 168 },
    { name: "Fieldday Skin", note: "Before-and-after proof", days: 141 },
    { name: "Ora & Ash", note: "Ingredient close-ups", days: 97 },
    { name: "Clearleaf", note: "Bundle discount", days: 64 },
    { name: "Mirabel", note: "Founder story", days: 38 },
  ],
  segmentsList: [
    { code: "SEG-1", name: "Ingredient-literate", share: 31, line: "Read the ingredient list before the headline." },
    { code: "SEG-2", name: "Sensitive-skin switchers", share: 24, line: "Left a big brand after a reaction." },
    { code: "SEG-3", name: "Routine builders", share: 19, line: "Buy in sets and stick with them." },
    { code: "SEG-4", name: "Gift buyers", share: 15, line: "Shop for someone else, mostly in Q4." },
    { code: "SEG-5", name: "Deal-led triers", share: 11, line: "Try on a discount, rarely reorder." },
  ],

  /* Acme Skincare, last 7 days (Oct 16–22), as the brand viewer sees it */
  acme: {
    spend: "$8,227", cpa: "$31.40", cpaLo: "$22", cpaHi: "$28", roas: "2.41", purchases: "262",
    synced: "06:04", tz: "New York",
  },
  /* decisions the brand can see: those with a reason. pred:false = prediction not marked client-visible */
  clientDecisions: [
    { date: "Oct 21", type: "audience", what: "New ad set", detail: "LAL 2% purchasers", camp: "Prospecting", reason: "Scale the winning audience.", pred: false, status: "wait", day: "2 of 14" },
    { date: "Oct 20", type: "budget", what: "Budget cut", detail: "$600 → $450/day", camp: "ASC", reason: "CPA had been above its normal range three days running.", pred: "CPA ↓ over 7 days, 7 in 10", status: "wait", day: "3 of 7" },
    { date: "Oct 16", type: "creative", what: "Creative swap", detail: "2 new ads", camp: "ASC", reason: "The top two ads were showing fatigue.", pred: "CTR ↑ over 7 days, 6 in 10", status: "noise", horizon: "7d", move: "+2%", band: "±5%", thumb: 4 },
    { date: "Oct 8", type: "creative", what: "Creative swap", detail: "3 new ads", camp: "Prospecting – Broad", reason: "Click-through on the top ad had slid for two weeks.", pred: "CTR ↑ over 7 days, 7 in 10", status: "miss", horizon: "7d", move: "−6%", band: "±4%", thumb: 0 },
    { date: "Oct 5", type: "pause", what: "Paused 3 ads", detail: "", camp: "Retargeting – Video", reason: "Frequency above 4 and cost per purchase rising.", pred: "CPA ↓ over 7 days, 6 in 10", status: "noise", horizon: "7d", move: "−$2", band: "±$3", thumb: 2 },
    { date: "Oct 2", type: "budget", what: "Budget", detail: "$700 → $600/day", camp: "ASC", reason: "Spend was outrunning the daily purchase volume.", pred: "CPA ↓ over 14 days, 7 in 10", status: "hit", horizon: "14d", move: "−11%", band: "±6%" },
  ],
  clientReport: {
    week: "Oct 12–18", sent: "Monday Oct 19 at 07:00", spend: "$8,180", cpa: "$31.22", roas: "2.44", purchases: "262",
    decided: 6, holding: 1,
  },

  /* Maya Chen's shared record (October figures match the team and global boards) */
  record: {
    who: "maya", name: "Maya Chen", handle: "@mayac", since: "March 2026", updated: "Oct 23, 2026",
    graded: 312, accounts: 9, hitRate: 68, vsAI: "+0.07", paired: 188, seasonSkill: "+0.21", seasonMove: "▲ 0.04", globalRank: 3,
    seasons: [
      { m: "Mar", skill: 0.09, rank: 61 }, { m: "Apr", skill: 0.12, rank: 38 }, { m: "May", skill: 0.15, rank: 19 }, { m: "Jun", skill: 0.14, rank: 22 },
      { m: "Jul", skill: 0.18, rank: 9 }, { m: "Aug", skill: 0.19, rank: 7 }, { m: "Sep", skill: 0.17, rank: 11 }, { m: "Oct", skill: 0.21, rank: 3, prov: true },
    ],
    /* said (confidence in 10) vs came true (%) and calls at that level */
    calib: [ { said: 5, true: 52, n: 41 }, { said: 6, true: 61, n: 88 }, { said: 7, true: 69, n: 104 }, { said: 8, true: 76, n: 57 }, { said: 9, true: 81, n: 22 } ],
    calls: [
      { cat: "Kitchenware", type: "creative", what: "Creative swap", pred: "CTR ↑ 7d", conf: 6, date: "Oct 21", status: "wait", day: "2 of 7" },
      { cat: "Kitchenware", type: "bid", what: "Cost cap up", pred: "Conversions ↑ 14d", conf: 7, date: "Oct 12", status: "hit", horizon: "14d" },
      { cat: "Pet supplies", type: "budget", what: "Budget up", pred: "Purchases ↑ 7d", conf: 6, date: "Oct 9", status: "noise", horizon: "7d", band: "±8%" },
      { cat: "Skincare", type: "creative", what: "Creative swap", pred: "CPA ↓ 14d", conf: 7, date: "Oct 6", status: "hit", horizon: "14d" },
      { cat: "Outdoor gear", type: "audience", what: "New audience", pred: "CTR ↑ 7d", conf: 8, date: "Oct 4", status: "miss", horizon: "7d" },
      { cat: "Coffee", type: "pause", what: "Paused 2 ads", pred: "CPA ↓ 7d", conf: 7, date: "Oct 1", status: "hit", horizon: "7d" },
      { cat: "Skincare", type: "budget", what: "Budget cut", pred: "CPA ↓ 7d", conf: 8, date: "Sep 27", status: "hit", horizon: "7d" },
      { cat: "Pet supplies", type: "audience", what: "Broad audience test", pred: "CPA ↓ 14d", conf: 5, date: "Sep 22", status: "miss", horizon: "14d" },
    ],
  },
};
