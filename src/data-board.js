/* CatchAll demo: extra sample data for My calls, the leaderboard, Team, Settings and Profile.
   Builds on CA.data (data.js); never contradicts its shared numbers (CA.data.me, CA.data.board). */
(function () {
  const D = CA.data;

  D.calls = {
    /* extra waiting calls for Sam beyond d6 (me.waiting = 4) */
    waiting: [
      { id: "w1", date: "Oct 21", acct: "acme",  type: "creative", what: "Creative swap", detail: "3 new ads", camp: "Prospecting – Broad", pred: "CTR ↑ in 7 days", conf: 6, day: 2, of: 7, result: "Nov 4", thumb: 4 },
      { id: "w2", date: "Oct 20", acct: "bloom", type: "hold", what: "Reviewed, holding", detail: "", camp: "whole account", pred: "CPA = in 14 days", conf: 6, day: 3, of: 14, result: "Nov 10" },
      { id: "w3", date: "Oct 15", acct: "kettle",type: "creative", what: "New ad", detail: "UGC hook test", camp: "ASC", pred: "CTR ↑ in 7 days", conf: 6, late: true, result: "Oct 29", thumb: 2 },
    ],
    /* grading detail for Sam's graded calls in CA.data.decisions, plus older ones from the season */
    gradedExtra: {
      d8:  { metric: "CPA", aiConf: 5, graded: "Oct 23", base: "miss" },
      d9:  { metric: "CTR", aiConf: 6, graded: "Oct 23", score: "0.36", base: "noise" },
      d10: { metric: "Conversions", aiConf: 5, graded: "Oct 21", base: "noise" },
      d15: { metric: "CPA", graded: "Oct 21", score: "0.09", base: "miss", manual: true },
    },
    gradedOlder: [
      { id: "g1", date: "Oct 10", acct: "acme",  type: "budget", what: "Budget", detail: "$500 → $600/day", camp: "ASC", status: "hit", horizon: "7d", pred: "Spend ↑ 7d", conf: 8, metric: "Spend", move: "+19%", band: "±7%", score: "0.04", ai: "↑", aiConf: 7, aiResult: "hit", base: "miss", graded: "Oct 17" },
      { id: "g2", date: "Oct 8",  acct: "bloom", type: "creative", what: "New ad", detail: "Founder story video", camp: "Prospecting – Broad", status: "hit", horizon: "7d", pred: "ROAS ↑ 7d", conf: 6, metric: "ROAS", move: "+16%", band: "±12%", score: "0.16", ai: "= same", aiConf: 5, aiResult: "miss", base: "miss", graded: "Oct 15", thumb: 6 },
      { id: "g3", date: "Oct 6",  acct: "north", type: "pause", what: "Paused 2 ad sets", detail: "", camp: "Prospecting – Interests", status: "miss", horizon: "7d", pred: "CPA ↓ 7d", conf: 7, metric: "CPA", move: "+14%", band: "±10%", score: "0.49", ai: "↑", aiConf: 5, aiResult: "hit", base: "miss", graded: "Oct 13" },
      { id: "g4", date: "Sep 29", acct: "north", type: "hold", what: "Reviewed, holding", detail: "", camp: "Retargeting – Video", status: "hit", horizon: "14d", pred: "CPA = 14d", conf: 7, metric: "CPA", move: "+3%", band: "±13%", score: "0.09", ai: "= same", aiConf: 6, aiResult: "hit", base: "hit", graded: "Oct 13" },
    ],
    cantExtra: [
      { id: "c1", date: "Oct 11", acct: "kettle", type: "audience", what: "Audience", detail: "broad, Advantage+ on", camp: "Prospecting – Broad", pred: "CPA ↓ 7d", conf: 5, why: "Too few sales to tell: 12 purchases in the after window, 20 needed." },
    ],
    /* calibration buckets over Sam's 25 graded calls: stated confidence vs how often it came true */
    calibration: [
      { label: "2–4", conf: 3,   n: 3,  yes: 1 },
      { label: "5–6", conf: 5.5, n: 9,  yes: 7 },
      { label: "7–8", conf: 7.5, n: 11, yes: 6 },
      { label: "9",   conf: 9,   n: 2,  yes: 2 },
    ],
    /* day one: nothing graded yet */
    day1: [
      { id: "e1", date: "Oct 23", acct: "acme",  type: "budget", what: "Budget cut", detail: "$600 → $450/day", camp: "ASC", pred: "CPA ↓ in 7 days", conf: 7, day: 1, of: 7, result: "Nov 6", how: "plugin" },
      { id: "e2", date: "Oct 23", acct: "bloom", type: "creative", what: "Creative swap", detail: "2 new UGC ads", camp: "Retargeting – Video", pred: "CTR ↑ in 7 days", conf: 6, day: 1, of: 7, result: "Nov 6", how: "plugin", thumb: 5 },
      { id: "e3", date: "Oct 23", acct: "north", type: "budget", what: "Budget", detail: "$150 → $220/day", camp: "Prospecting – Broad", pred: "CPA ↓ in 7 days", conf: 6, late: true, result: "Oct 28", how: "manual", madeOn: "Oct 14" },
    ],
  };

  D.boardx = {
    eligibility: { calls: 20, spend: "$3,000", capture: 50, samSpend: "$8,420" },
    /* the owner, Dana, isn't ranked: too few counted calls */
    notRankedOwner: { who: "dana", note: "2 of 20 counted calls", needs: "18 more calls to qualify" },
    september: {
      rows: [
        { rank: 1, who: "maya",  calls: 34, skill: "+0.19", vsAI: "+0.07", hit: 68, cal: "Close to spot on", week: "–" },
        { rank: 2, who: "priya", calls: 29, skill: "+0.17", vsAI: "+0.05", hit: 63, cal: "Overconfident", week: "▲ 1" },
        { rank: 3, who: "leo",   calls: 30, skill: "+0.15", vsAI: "+0.03", hit: 61, cal: "Close to spot on", week: "▼ 1" },
        { rank: 4, who: "sam",   calls: 27, skill: "+0.13", vsAI: "+0.02", hit: 63, cal: "A bit overconfident", week: "▲ 2" },
        { rank: 5, who: "jordan",calls: 21, skill: "+0.12", vsAI: "+0.01", hit: 57, cal: "Slightly unsure", week: "–" },
        { ref: "ai", label: "CatchAll AI", calls: 118, skill: "+0.11", hit: 60, cal: "Close to spot on" },
        { rank: 6, who: "nadia", calls: 22, skill: "+0.09", vsAI: "−0.02", hit: 58, cal: "Slightly unsure", week: "▼ 2" },
        { rank: 7, who: "alex",  calls: 24, skill: "+0.07", vsAI: "−0.04", hit: 55, cal: "Close to spot on", week: "–" },
        { rank: 8, who: "ben",   calls: 20, skill: "+0.04", vsAI: "−0.07", hit: 54, cal: "Slightly unsure", week: "▲ 1" },
        { ref: "base", label: "Baseline", calls: 118, skill: "0.00", hit: 51, cal: "–" },
        { rank: 9, who: "omar",  calls: 21, skill: "−0.01", vsAI: "−0.12", hit: 49, cal: "Overconfident", week: "▼ 1" },
      ],
      closed: "Sep 30", computed: "Oct 14",
    },
    globalSeptember: [
      { rank: 1, name: "Kofi Mensah", handle: "@kofi", calls: 51, skill: "+0.29", week: "▲ 2" },
      { rank: 2, name: "Rina Takeda", handle: "@rinat", calls: 58, skill: "+0.27", week: "▼ 1" },
      { rank: 3, name: "Lena Brandt", handle: "@lenab", calls: 47, skill: "+0.22", week: "–" },
      { rank: 4, name: "Ravi Iyer", handle: "@ravi", calls: 36, skill: "+0.20", week: "▲ 1" },
      { rank: 5, name: "Maya Chen", handle: "@mayac", calls: 34, skill: "+0.19", week: "▼ 1" },
      { rank: 6, name: "Ana Souza", handle: "@anas", calls: 33, skill: "+0.17", week: "–" },
      { rank: 7, name: "Tom Okafor", handle: "@tomo", calls: 27, skill: "+0.14", week: "▲ 3" },
      { rank: 8, name: "Jordan Lee", handle: "@jlee", calls: 21, skill: "+0.12", week: "▼ 2" },
    ],
    globalMore: 212,
    day1Logged: [
      { who: "jordan", calls: 3, first: "Nov 6" },
      { who: "maya", calls: 1, first: "Nov 13" },
      { who: "sam", calls: 2, first: "Nov 6" },
    ],
  };

  D.team = {
    domain: "harbormedia.com",
    /* per-member October figures; calls and hit rate match CA.data.board */
    members: [
      { who: "dana",  role: "owner", calls: 2,  capture: 83, hit: null, noReason: 0 },
      { who: "jordan",role: "admin", calls: 22, capture: 64, hit: 59, noReason: 1 },
      { who: "maya",  role: "buyer", calls: 31, capture: 88, hit: 71, noReason: 0 },
      { who: "sam",   role: "buyer", calls: 25, capture: 71, hit: 64, noReason: 4 },
      { who: "priya", role: "buyer", calls: 26, capture: 79, hit: 62, noReason: 0 },
      { who: "leo",   role: "buyer", calls: 28, capture: 74, hit: 60, noReason: 2 },
      { who: "nadia", role: "buyer", calls: 23, capture: 69, hit: 61, noReason: 0 },
      { who: "alex",  role: "buyer", calls: 21, capture: 52, hit: 55, noReason: 3 },
      { who: "ben",   role: "buyer", calls: 20, capture: 58, hit: 56, noReason: 1 },
      { who: "ivy",   role: "buyer", calls: 20, capture: 61, hit: 52, noReason: 0 },
      { who: "omar",  role: "buyer", calls: 20, capture: 55, hit: 50, noReason: 2 },
      { who: "chris", role: "buyer", calls: 16, capture: 66, hit: 69, noReason: 0 },
    ],
    client: { name: "Grace Holt", email: "grace@acmeskincare.com", acct: "Acme Skincare", viewed: "Oct 21" },
    joinRequest: { name: "Theo Grant", initials: "TG", email: "theo@harbormedia.com", asked: "Oct 22" },
    invites: [
      { email: "rosa@harbormedia.com", role: "Buyer", sent: "Oct 20", note: "expires Oct 27" },
      { email: "ops@bloomcoffee.com", role: "Client viewer, Bloom Coffee", sent: "Oct 14", expired: true },
    ],
    day1Members: ["dana", "jordan", "maya", "sam"],
    day1Invites: [
      { email: "priya@harbormedia.com", role: "Buyer", sent: "Oct 23", note: "expires Oct 30" },
      { email: "leo@harbormedia.com", role: "Buyer", sent: "Oct 23", note: "expires Oct 30" },
      { email: "nadia@harbormedia.com", role: "Buyer", sent: "Oct 23", note: "expires Oct 30" },
    ],
  };
})();
