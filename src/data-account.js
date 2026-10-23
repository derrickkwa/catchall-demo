/* CatchAll demo: account page sample data (Performance, Health, Market, Competitors, Audience, Suggestions, Reports, Connection).
   Lives under CA.data.acct. Acme Skincare carries the full mockup content; the other accounts use the same shape with lighter data.
   Dates are 2026 unless marked; chart days run Aug 1 – Oct 23 (84 days, index 0 = Aug 1). */
CA.data.acct = (function () {
  /* past changes from change history that are older or not in CA.data.decisions (the shared list stays the source for recent ones) */
  const history = {
    acme: [
      { id: "ha1", date: "Sep 28", acct: "acme", who: "sam", type: "hold", what: "Reviewed, holding", detail: "", camp: "All campaigns", source: "plugin", status: "hit", horizon: "14d", reason: "Waiting on the promo to end" },
      { id: "ha2", date: "Sep 22", acct: "acme", who: "maya", type: "bid", what: "Bid cap", detail: "$24 → $27", camp: "Prospecting – Broad", source: "plugin", status: "noise", horizon: "14d", reason: "CPA steady, room to win more auctions" },
      { id: "ha3", date: "Sep 17", acct: "acme", who: "alex", type: "pause", what: "Paused", detail: "2 ads", camp: "Retargeting", source: "plugin", status: "noise", reason: "CTR below 0.6% for a week", thumb: 6 },
      { id: "ha4", date: "Sep 8", acct: "acme", who: "jordan", type: "creative", what: "New ads", detail: "2 ingredient close-ups", camp: "Prospecting", source: "history", status: "reason", thumb: 1 },
      { id: "ha5", date: "Aug 29", acct: "acme", who: "sam", type: "budget", what: "Budget", detail: "$350 → $300/day", camp: "Prospecting – Broad", source: "plugin", status: "hit", reason: "CPA drifting up on broad", horizon: "7d" },
      { id: "ha6", date: "Aug 19", acct: "acme", who: "maya", type: "creative", what: "New ad", detail: "“Patch test” hook", camp: "Retargeting", source: "plugin", status: "noise", thumb: 7, reason: "Test the gentleness angle" },
      { id: "ha7", date: "Aug 11", acct: "acme", who: null, type: "audience", what: "Audience edit", detail: "added interests", camp: "Prospecting", source: "outside", status: "outside" },
      { id: "ha8", date: "Aug 6", acct: "acme", who: "jordan", type: "bid", what: "Cost cap", detail: "$26 → $24", camp: "ASC", source: "history", status: "reason" },
    ],
    bloom: [
      { id: "hb1", date: "Sep 14", acct: "bloom", who: "sam", type: "budget", what: "Budget", detail: "$90 → $120/day", camp: "Prospecting – Broad", source: "plugin", status: "hit", reason: "Subscription CPA well under target" },
      { id: "hb2", date: "Sep 3", acct: "bloom", who: null, type: "creative", what: "New ad", detail: "Holiday blend teaser", camp: "Retargeting – Video", source: "outside", status: "outside", thumb: 3 },
      { id: "hb3", date: "Aug 20", acct: "bloom", who: "jordan", type: "audience", what: "New ad set", detail: "LAL 1% subscribers", camp: "Prospecting", source: "history", status: "reason" },
    ],
    north: [
      { id: "hn1", date: "Sep 29", acct: "north", who: "sam", type: "creative", what: "Creative swap", detail: "2 new UGC dog-walk ads", camp: "Prospecting – Broad", source: "plugin", status: "noise", thumb: 2, reason: "Top ad at frequency 4" },
      { id: "hn2", date: "Sep 10", acct: "north", who: "maya", type: "budget", what: "Budget", detail: "$120 → $150/day", camp: "Prospecting – Broad", source: "plugin", status: "hit", reason: "Back-to-routine season" },
      { id: "hn3", date: "Aug 24", acct: "north", who: null, type: "pause", what: "Paused", detail: "1 ad", camp: "Retargeting", source: "outside", status: "outside" },
    ],
    kettle: [
      { id: "hk1", date: "Oct 2", acct: "kettle", who: "maya", type: "budget", what: "Budget", detail: "$180 → $220/day", camp: "ASC", source: "plugin", status: "hit", reason: "Gift season ramp" },
      { id: "hk2", date: "Sep 12", acct: "kettle", who: "alex", type: "creative", what: "New ads", detail: "3 brewing how-tos", camp: "Purchases", source: "history", status: "reason", thumb: 8 },
      { id: "hk3", date: "Aug 27", acct: "kettle", who: null, type: "audience", what: "Audience edit", detail: "excluded staff", camp: "Search", source: "outside", status: "outside" },
    ],
  };

  /* daily series: base, noise, normal band, bumps [startDay, endDay, delta, rampDays], pins {day: value}, target7 (7-day average to land on) */
  const perf = {
    acme: {
      cpa: { base: 25, sd: 1.1, band: [22, 28], bumps: [[30, 31, -4.6, 0], [71, 83, 7.2, 3]], pins: { 74: 33.1 }, target7: 31.4 },
      roas: { base: 2.56, sd: 0.08, band: [2.1, 2.9], bumps: [[30, 31, 0.32, 0], [71, 83, -0.18, 3]], target7: 2.41 },
      spend: { base: 1180, sd: 55, band: [1010, 1340], bumps: [[80, 83, -70, 1]], target7: 1177.14 },
      freq: { v: 3.2, band: [2.6, 3.5] },
    },
    bloom: {
      cpa: { base: 20.6, sd: 0.8, band: [18, 23], bumps: [[44, 49, -3.4, 2]], target7: 20.1 },
      roas: { base: 3.1, sd: 0.1, band: [2.7, 3.5], bumps: [[44, 49, 0.45, 2]], target7: 3.18 },
      spend: { base: 780, sd: 35, band: [690, 870], bumps: [[44, 83, 25, 2]], target7: 805.7 },
      freq: { v: 2.4, band: [2.0, 2.8] },
    },
    north: {
      cpa: { base: 34, sd: 1.2, band: [30, 38], bumps: [[75, 83, 6.4, 3]], target7: 39.8 },
      roas: { base: 2.02, sd: 0.07, band: [1.75, 2.3], bumps: [[75, 83, -0.32, 3]], target7: 1.71 },
      spend: { base: 640, sd: 28, band: [560, 720], bumps: [[80, 83, 70, 1]], target7: 671.4 },
      freq: { v: 2.9, band: [2.4, 3.3] },
    },
    kettle: {
      cpa: { base: 27, sd: 1, band: [24, 30], bumps: [], target7: 26.9 },
      roas: { base: 2.8, sd: 0.09, band: [2.4, 3.2], bumps: [], target7: 2.86 },
      spend: { base: 1450, sd: 60, band: [1250, 1650], bumps: [[72, 83, 230, 3]], target7: 1702.9 },
      freq: { v: 2.2, band: [1.8, 2.7] },
    },
  };

  /* the change-history scorecard ("what happened after", never hit or miss) */
  const score = {
    acme: {
      total: 214, imp: 81, wor: 47, non: 86, overlap: 61, noReason: 186,
      types: [["Budget", 72, 30, 16, 26], ["Creative", 58, 25, 11, 22], ["Pause", 31, 11, 6, 14], ["Audience", 31, 9, 8, 14], ["Bid", 22, 6, 6, 10]],
      buyers: [["Sam Kim", 68, 29, 13, 26], ["Jordan Lee", 54, 19, 14, 21], ["Maya Chen", 41, 16, 9, 16], ["Alex Rivera", 27, 10, 5, 12], ["Not linked yet", 24, 7, 6, 11]],
      best: [
        { thumb: 2, what: "Creative swap", detail: "4 UGC ads · Prospecting", sub: "Jun 12 · Sam Kim · CPA $27 → $21 over 14 days, $3 past the range edge" },
        { type: "budget", what: "Budget", detail: "$200 → $300/day · ASC", sub: "Mar 3 · Jordan Lee · Results +34% over 14 days at steady CPA" },
        { thumb: 7, what: "New ad", detail: "“Patch test” hook · Retargeting", sub: "Aug 19 · Maya Chen · CPA $29 → $23 over 7 days", day: 18 },
      ],
      worst: [
        { type: "budget", what: "Budget", detail: "$300 → $500/day · Prospecting", sub: "Oct 9 · Jordan Lee · CPA $25 → $33 over 7 days, $5 past the range edge", day: 69 },
        { type: "audience", what: "Audience", detail: "broad to interests · Prospecting", sub: "Feb 20 · Alex Rivera · CPA $24 → $31 over 14 days" },
        { type: "bid", what: "Bid cap", detail: "$27 → $22 · Prospecting", sub: "Dec 8 · Sam Kim · Spend −41% over 7 days, results fell with it" },
      ],
    },
    bloom: { total: 132, imp: 52, wor: 24, non: 56, overlap: 31, noReason: 109, types: [["Budget", 44, 19, 8, 17], ["Creative", 41, 17, 7, 17], ["Pause", 22, 8, 4, 10], ["Audience", 15, 5, 3, 7], ["Bid", 10, 3, 2, 5]] },
    north: { total: 96, imp: 31, wor: 25, non: 40, overlap: 22, noReason: 81, types: [["Budget", 34, 12, 8, 14], ["Creative", 29, 10, 7, 12], ["Audience", 18, 5, 6, 7], ["Pause", 15, 4, 4, 7]] },
    kettle: { total: 158, imp: 63, wor: 30, non: 65, overlap: 40, noReason: 127, types: [["Budget", 51, 22, 9, 20], ["Creative", 47, 19, 9, 19], ["Bid", 28, 11, 6, 11], ["Pause", 19, 6, 4, 9], ["Audience", 13, 5, 2, 6]] },
  };

  /* Health */
  const health = {
    acme: {
      trend: { "Distinct concepts getting spend": [8, 8, 8, 7, 8, 7, 7, 6, 6, 6, 5, 5, 5], "Largest group's share of spend": [52, 54, 55, 58, 57, 61, 63, 66, 70, 72, 75, 79, 81], "New people per $1k": [410, 402, 396, 380, 371, 360, 344, 330, 318, 300, 288, 276, 268] },
      worth: [
        { type: "creative", b: "Two looks carry 81% of spend.", t: "Only 5 distinct concepts got spend this month, down from 8 in July.", s: "Cleared the noise: the top two groups usually carry 55–68% of spend here." },
        { type: "audience", b: "Prospecting is reaching fewer new people.", t: "New people per $1k down 34% in 3 months while frequency rose to 3.4.", s: "Cleared the noise: three months in a row below this account's range." },
      ],
      activeAds: 46,
      clusters: [["UGC talking head", 14, 47, [3, 2, 6, 8]], ["Before / after", 9, 34, [4, 5, 7]], ["Ingredient close-up", 8, 9, [1, 7, 0]], ["Founder story", 4, 5, [7, 3]], ["Routine flat-lay", 6, 3, [7, 8, 4]], ["Everything else", 5, 2, [5, 0]]],
      divKv: [["Distinct concepts getting spend", "5", "down from 8 in July"], ["Largest group", "47%", "of spend in one look"], ["Near-duplicate ads", "14", "in 5 sets that look almost identical"], ["Active ads", "46", "31 got spend this month"]],
      crKv: [["Median ad age", "48", "older ads carry 72% of spend", "days"], ["New ads per month", "6", "12-month average 9"], ["New ads beating the account median", "17%", "1 in 6 new ads beat median CPA"], ["Spend on ads under 30 days old", "18%", "last 30 days"]],
      gallery: [[2, "$19.40", "$4.1k", 94, "top"], [3, "$21.10", "$3.6k", 61, "top"], [6, "$22.80", "$2.9k", 33, "top"], [8, "$23.50", "$2.2k", 12, "top"], [5, "$41.20", "$1.8k", 12, "bottom"], [7, "$38.90", "$1.1k", 30, "bottom"], [1, "$36.30", "$0.9k", 71, "bottom"], [4, "$35.10", "$0.7k", 19, "bottom"]],
      reach: { months: ["Oct ’25", "Nov", "Dec", "Jan ’26", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct ’26"], per1k: [412, 400, 371, 405, 392, 377, 361, 353, 341, 318, 297, 282, 268], freq: [2.4, 2.5, 2.7, 2.5, 2.6, 2.7, 2.8, 2.9, 3.0, 3.1, 3.3, 3.4, 3.4] },
      satKv: [["People reached, 13 months", "1.9M", "unique, all campaigns"], ["Spend on people already reached", "68%", "was 51% a year ago"], ["Frequency, last 30 days", "3.4", "prospecting 2.9 · retargeting 6.1"], ["New people per $1k", "268", "down 34% since July"]],
      basics: [["Results, 12 months", "Spend, results, CPA and ROAS each month against the normal range", "10 of 12 months inside the range"], ["Attribution and settings", "Attribution windows, conversion events, placements, account spending limit", "<b>1 to check</b> · 2 campaigns on 1-day click"], ["Campaign and ad set efficiency", "Spend spread, ad sets stuck in learning, overlap", "Nothing outside the normal range"]],
    },
    bloom: {
      trend: { "Distinct concepts getting spend": [6, 6, 7, 7, 7, 8, 8, 8, 7, 8, 8, 9, 9], "New people per $1k": [520, 515, 530, 512, 508, 520, 511, 505, 498, 506, 500, 497, 494] },
      worth: [{ type: "pause", b: "Retargeting video frequency is above its range.", t: "6.8 over the last 14 days; the normal range here is 4.5–6.0.", s: "Cleared the noise: two weeks running above the range." }],
      activeAds: 28,
      clusters: [["Pour-over close-up", 9, 38, [2, 3, 7]], ["Morning ritual UGC", 7, 33, [5, 0, 6]], ["Subscription unboxing", 6, 19, [8, 4]], ["Everything else", 6, 10, [1, 3]]],
      divKv: [["Distinct concepts getting spend", "9", "up from 6 in October last year"], ["Largest group", "38%", "of spend in one look"], ["Near-duplicate ads", "4", "in 2 sets"], ["Active ads", "28", "22 got spend this month"]],
      crKv: [["Median ad age", "31", "newer ads carry 44% of spend", "days"], ["New ads per month", "8", "12-month average 7"], ["New ads beating the account median", "29%", "about 1 in 3"], ["Spend on ads under 30 days old", "41%", "last 30 days"]],
      gallery: [[5, "$15.80", "$1.9k", 52, "top"], [2, "$16.40", "$1.6k", 38, "top"], [3, "$17.90", "$1.2k", 21, "top"], [0, "$18.30", "$0.9k", 9, "top"], [4, "$29.60", "$0.6k", 44, "bottom"], [1, "$27.10", "$0.5k", 63, "bottom"], [8, "$26.40", "$0.4k", 17, "bottom"], [6, "$25.90", "$0.3k", 26, "bottom"]],
      reach: { months: ["Oct ’25", "Nov", "Dec", "Jan ’26", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct ’26"], per1k: [520, 515, 530, 512, 508, 520, 511, 505, 498, 506, 500, 497, 494], freq: [2.0, 2.1, 2.2, 2.0, 2.1, 2.1, 2.2, 2.2, 2.3, 2.2, 2.3, 2.4, 2.4] },
      satKv: [["People reached, 13 months", "1.1M", "unique, all campaigns"], ["Spend on people already reached", "47%", "was 44% a year ago"], ["Frequency, last 30 days", "2.4", "prospecting 1.9 · retargeting 6.8"], ["New people per $1k", "494", "steady for a year"]],
      basics: [["Results, 12 months", "Spend, results, CPA and ROAS each month against the normal range", "12 of 12 months inside the range"], ["Attribution and settings", "Attribution windows, conversion events, placements, account spending limit", "Nothing to check"], ["Campaign and ad set efficiency", "Spend spread, ad sets stuck in learning, overlap", "<b>1 to check</b> · 2 ad sets stuck in learning"]],
    },
    north: {
      trend: { "Distinct concepts getting spend": [5, 5, 5, 4, 4, 4, 5, 4, 4, 4, 3, 3, 3], "New people per $1k": [300, 296, 290, 287, 280, 276, 270, 266, 255, 250, 244, 236, 229] },
      worth: [{ type: "audience", b: "CPA has been above range since the Oct 14 audience change.", t: "7-day CPA $39.80 against a normal range of $30–$38.", s: "Cleared the noise: nine days in a row above the range." }],
      activeAds: 19,
      clusters: [["Dog-walk UGC", 7, 58, [2, 6, 3]], ["Harness close-up", 5, 27, [7, 1]], ["Everything else", 7, 15, [4, 8]]],
      divKv: [["Distinct concepts getting spend", "3", "down from 5 in March"], ["Largest group", "58%", "of spend in one look"], ["Near-duplicate ads", "6", "in 2 sets"], ["Active ads", "19", "12 got spend this month"]],
      crKv: [["Median ad age", "62", "older ads carry 81% of spend", "days"], ["New ads per month", "3", "12-month average 5"], ["New ads beating the account median", "14%", "1 in 7"], ["Spend on ads under 30 days old", "11%", "last 30 days"]],
      gallery: [[2, "$28.10", "$1.4k", 88, "top"], [6, "$30.40", "$1.1k", 47, "top"], [3, "$31.90", "$0.8k", 30, "top"], [7, "$33.30", "$0.6k", 14, "top"], [4, "$52.40", "$0.5k", 21, "bottom"], [1, "$47.80", "$0.4k", 55, "bottom"], [8, "$45.10", "$0.3k", 12, "bottom"], [0, "$44.60", "$0.3k", 33, "bottom"]],
      reach: { months: ["Oct ’25", "Nov", "Dec", "Jan ’26", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct ’26"], per1k: [300, 296, 290, 287, 280, 276, 270, 266, 255, 250, 244, 236, 229], freq: [2.3, 2.3, 2.4, 2.4, 2.5, 2.5, 2.6, 2.6, 2.7, 2.7, 2.8, 2.9, 2.9] },
      satKv: [["People reached, 13 months", "640k", "unique, all campaigns"], ["Spend on people already reached", "61%", "was 49% a year ago"], ["Frequency, last 30 days", "2.9", "prospecting 2.5 · retargeting 5.2"], ["New people per $1k", "229", "down 24% in a year"]],
      basics: [["Results, 12 months", "Spend, results, CPA and ROAS each month against the normal range", "11 of 12 months inside the range"], ["Attribution and settings", "Attribution windows, conversion events, placements, account spending limit", "Nothing to check"], ["Campaign and ad set efficiency", "Spend spread, ad sets stuck in learning, overlap", "Nothing outside the normal range"]],
    },
    kettle: {
      trend: { "Distinct concepts getting spend": [7, 7, 8, 8, 8, 9, 9, 10, 10, 10, 11, 11, 11], "New people per $1k": [350, 352, 349, 355, 351, 348, 353, 350, 352, 349, 351, 350, 348] },
      worth: [],
      activeAds: 37,
      clusters: [["Brewing how-to", 11, 31, [8, 6, 3]], ["Gift set flat-lay", 9, 28, [3, 7, 0]], ["Tasting notes", 8, 22, [2, 1]], ["Kitchen lifestyle", 5, 12, [5, 4]], ["Everything else", 4, 7, [6]]],
      divKv: [["Distinct concepts getting spend", "11", "up from 7 a year ago"], ["Largest group", "31%", "of spend in one look"], ["Near-duplicate ads", "3", "in 1 set"], ["Active ads", "37", "29 got spend this month"]],
      crKv: [["Median ad age", "27", "newer ads carry 52% of spend", "days"], ["New ads per month", "10", "12-month average 8"], ["New ads beating the account median", "31%", "about 1 in 3"], ["Spend on ads under 30 days old", "52%", "last 30 days"]],
      gallery: [[8, "$21.40", "$2.6k", 41, "top"], [3, "$22.90", "$2.2k", 29, "top"], [6, "$23.60", "$1.8k", 18, "top"], [2, "$24.10", "$1.5k", 11, "top"], [4, "$36.80", "$0.9k", 23, "bottom"], [1, "$34.20", "$0.7k", 50, "bottom"], [5, "$33.90", "$0.5k", 15, "bottom"], [0, "$32.70", "$0.4k", 36, "bottom"]],
      reach: { months: ["Oct ’25", "Nov", "Dec", "Jan ’26", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct ’26"], per1k: [350, 352, 349, 355, 351, 348, 353, 350, 352, 349, 351, 350, 348], freq: [1.9, 2.0, 2.1, 1.9, 2.0, 2.0, 2.1, 2.0, 2.1, 2.1, 2.2, 2.2, 2.2] },
      satKv: [["People reached, 13 months", "1.4M", "unique, all campaigns"], ["Spend on people already reached", "39%", "was 41% a year ago"], ["Frequency, last 30 days", "2.2", "prospecting 1.8 · retargeting 4.6"], ["New people per $1k", "348", "steady for a year"]],
      basics: [["Results, 12 months", "Spend, results, CPA and ROAS each month against the normal range", "12 of 12 months inside the range"], ["Attribution and settings", "Attribution windows, conversion events, placements, account spending limit", "Nothing to check"], ["Campaign and ad set efficiency", "Spend spread, ad sets stuck in learning, overlap", "Nothing outside the normal range"]],
    },
  };

  /* Market. insights: [code, type, text, basis]; v1 lists the codes that differ */
  const T = { CT: "Truth", TN: "Tension", CX: "Contradiction", BL: "Behaviour law", LP: "Language", MY: "Myth", HS: "Horizon shift" };
  const metaChanges = [["Oct 14", "Advantage+ placements become the default for new sales campaigns"], ["Sep 30", "Reporting change to the 1-day view attribution window"], ["Sep 9", "Ad Library adds start dates to all EU-delivered ads"]];

  const market = {
    acme: {
      note: { date: "Mon Oct 19", text: "Searches for “retinol serum” are up <b class=\"num\">18%</b> on their 4-week average, the biggest jump since January. Lumen Labs started 14 new ads, most leading with barrier repair.", affects: "CT-03", affectsText: "Demand for retinol is flat going into Q4", also: "TN-02" },
      sos: { brands: [["Acme Skincare", 19, 13.5, "c1"], ["Lumen Labs", 31, 35, "c2"], ["Verity Skin", 22, 21, "c3"], ["Halcyon", 12, 15, "c4"], ["Pure Theory", 9, 9.5, "c5"], ["Others", 7, 9, "c6"]], up: 4 },
      kw: { total: 151, rows: [["Category", "retinol serum, vitamin c serum…", 41, "48.2k", "+12%", "↑ rising", 1], ["Problems", "fine lines, dark spots, redness…", 63, "22.4k", "+20%", "↑ rising", 1], ["Solutions", "gentle retinol, encapsulated retinol…", 28, "9.1k", "+4%", "→ flat", 0], ["Enablers", "patch test, skin barrier, ingredient checker…", 19, "6.3k", "−3%", "↓ easing", -1]], soph: "0.41", sophWas: "0.45" },
      versions: [["v2", "Oct 20", "Run again by Dana Wells"], ["v1", "Sep 21", "first research run"]],
      insights: [
        ["CT-01", "Buyers distrust “clean” claims and read the ingredient list instead.", "from 9 quotes"],
        ["TN-02", "They want visible results fast but fear irritation more than slow progress, and now say so openly.", "from 14 quotes"],
        ["CX-02", "They say price matters most, yet they switch brands over irritation, not price.", "from 6 quotes and 2 surveys"],
        ["CT-03", "Demand for retinol is rising into Q4, led by problem searches.", "from search data, Oct"],
        ["LP-04", "“Purging” is how buyers name the fear that a product is harming them.", "from 11 quotes"],
        ["HS-01", "Barrier repair is becoming the entry point to actives: buyers start with repair, then add retinol.", "from 12 new quotes (Oct) and search for “barrier repair” up 31%"],
        ["CT-02", "Most buyers have tried at least three retinol products before settling.", "from 17 quotes"],
        ["CT-04", "Dermatologist creators are the most trusted voice in the category.", "from 8 quotes and 40 creator posts"],
        ["CT-05", "Buyers expect to see a concentration on the front of the pack.", "from 12 quotes"],
        ["TN-01", "They want one routine that works but keep adding steps.", "from 10 quotes"],
        ["TN-03", "They want proof of results but distrust before-and-after photos.", "from 7 quotes"],
        ["TN-04", "They want to stop researching but can't trust a product without it.", "from 9 quotes"],
        ["CX-01", "They call fragrance a red flag but rate scented products higher.", "from reviews of 6 brands"],
        ["CX-03", "They say they want fewer products yet buy sets.", "from 5 quotes and order data"],
        ["BL-01", "A bad first week ends the relationship, whatever the long-term results.", "from 13 quotes"],
        ["BL-02", "A reformulation exposed on Reddit triggers switching within a month.", "from 6 threads"],
        ["BL-03", "Buyers patch test anything new with an active above 0.2%.", "from 8 quotes"],
        ["BL-04", "Buyers who switch brands do it after a single bad reaction, not after price rises.", "from 8 quotes"],
        ["LP-01", "“Actives” has replaced “ingredients” in how buyers talk.", "from 21 quotes"],
        ["LP-05", "“Skin cycling” is now how buyers describe rotating actives.", "from 7 quotes"],
        ["MY-01", "A tingle means it's working.", "from 6 quotes; 4 gatekeepers say the opposite"],
        ["MY-03", "Higher percentages always work better.", "from 9 quotes"],
        ["MY-04", "You can't use retinol with sensitive skin.", "from 5 quotes"],
        ["HS-02", "Refillable packaging is moving from nice-to-have to expected.", "from 4 quotes and 3 competitor launches"],
      ],
      v1: { removed: [["MY-02", "Natural ingredients are always gentler.", "no supporting quotes in the new run; 3 quotes now say the opposite"]], changed: { "CT-03": ["Demand for retinol is flat going into Q4.", "search up 18% on its 4-week average (Oct 19 change note)"], "TN-02": ["They want visible results fast but fear irritation.", "6 new quotes"] }, added: ["HS-01", "BL-04", "LP-05"] },
      stale: { "CT-03": null },
      season: [["Nov 1", "Cold-weather skin searches start rising", "“dry skin”, “barrier repair” rose 30–40% in each of your last 3 Novembers", 9], ["Nov 27", "Black Friday", "", 35], ["Nov 30", "Cyber Monday", "", 38], ["Dec 1–20", "Gift sets peak", "", 39]],
      totals: { quotes: 61, inferred: 14, sources: 11, who: { cust: 75, gate: 22, ind: 9 } },
      themes: { cust: [["Irritation", 18], ["Distrust of claims", 14], ["Price per use", 9], ["Routine fatigue", 8], ["Results timing", 7], ["Trust signals", 7]], gate: [["Over-exfoliation", 8], ["Concentration", 7], ["Barrier first", 7]], ind: [["Regulation", 4], ["Formats", 3], ["Retail", 2]] },
      segs: ["Ingredient-literate", "Sensitive-skin", "Routine minimalist", "Results chaser", "Gift buyer"],
      quotes: [
        ["cust", "Every ‘gentle’ serum I try still burns for a week, so now I patch test everything.", "Sensitive-skin", "Reddit", "", "Irritation"],
        ["cust", "I don’t trust anything that says clean anymore. I just read the INCI list.", "Ingredient-literate", "Reddit", "Aug 2026", "Distrust of claims"],
        ["cust", "If you won’t tell me the percentage, I assume it’s 0.01%.", "Ingredient-literate", "TikTok comments", "Sep 2026", "Distrust of claims"],
        ["cust", "I worked out the price per ml and the drugstore one is a third of the cost for the same retinol.", "Routine minimalist", "Reddit", "Jul 2026", "Price per use"],
        ["inf", "Buyers in this category treat a slow start as proof a product is gentle.", "Sensitive-skin", "", "", "Results timing", 5],
        ["cust", "Six weeks in and I can finally see a difference around my eyes. Nobody tells you it takes that long.", "Sensitive-skin", "Amazon review", "Oct 2026", "Results timing"],
        ["cust", "My dermatologist said to stop layering five actives and just use one properly.", "Routine minimalist", "YouTube comments", "Jun 2026", "Routine fatigue"],
        ["cust", "I bought it because the founder actually explained the formula on video.", "Ingredient-literate", "Instagram comments", "Sep 2026", "Trust signals"],
        ["cust", "The ones that actually work never call themselves miracle anything.", "Sensitive-skin", "Reddit", "", "Distrust of claims"],
        ["cust", "My face was red for three days and the brand told me it was purging.", "Sensitive-skin", "Trustpilot", "Sep 2026", "Irritation"],
        ["cust", "I’m tired of a ten-step routine. Give me two things that work.", "Routine minimalist", "Reddit", "Aug 2026", "Routine fatigue"],
        ["cust", "$70 for a serum is fine if it lasts three months. This one lasted five weeks.", "Results chaser", "Amazon review", "Oct 2026", "Price per use"],
        ["cust", "Showed my sister the before and after and she ordered the same night.", "Results chaser", "Instagram comments", "Sep 2026", "Results timing"],
        ["cust", "Bought the set for my mum because the box looked like something from a pharmacy, not a party.", "Gift buyer", "Reviews", "Oct 2026", "Trust signals"],
        ["inf", "Gift buyers choose on packaging that signals ‘clinical’, not ‘luxury’.", "Gift buyer", "", "", "Trust signals", 4],
        ["gate", "Half my new patients are over-exfoliating. The fix is usually removing products, not adding one.", "Dermatologist", "YouTube", "Sep 2026", "Over-exfoliation"],
        ["gate", "Ask what percentage and what form. If the brand won’t say, move on.", "Esthetician", "Instagram", "Aug 2026", "Concentration"],
        ["gate", "Repair the barrier first. Retinol on a damaged barrier is how people end up hating retinol.", "Dermatologist", "TikTok", "Oct 2026", "Barrier first"],
        ["gate", "0.3% encapsulated is where I start almost everyone.", "Beauty editor", "Newsletter", "", "Concentration"],
        ["ind", "Retinol labelling rules tighten in the EU next year; expect concentration caps on body products.", "Industry report", "Trade press", "Sep 2026", "Regulation"],
        ["ind", "Refill pouches grew fastest of any skincare format in the last two quarters.", "Retail data", "Trade press", "Oct 2026", "Formats"],
        ["ind", "Drugstore retinol launches doubled this year, pulling price per ml down across the category.", "Retail data", "Analyst note", "Aug 2026", "Retail"],
      ],
    },
    bloom: {
      note: { date: "Mon Oct 19", text: "Searches for “coffee subscription” are up <b class=\"num\">9%</b> on their 4-week average. Ridge Roasters started 6 new ads offering a free grinder.", affects: "CT-02", affectsText: "Subscription interest peaks in January", also: "" },
      sos: { brands: [["Bloom Coffee", 14, 12, "c1"], ["Ridge Roasters", 33, 30, "c2"], ["Daybreak Beans", 24, 26, "c3"], ["Copperpot", 18, 19, "c4"], ["Others", 11, 13, "c6"]], up: 2 },
      kw: { total: 96, rows: [["Category", "coffee subscription, specialty coffee…", 34, "31.6k", "+8%", "↑ rising", 1], ["Problems", "bitter coffee, stale beans…", 22, "8.9k", "+3%", "→ flat", 0], ["Solutions", "fresh roasted beans, single origin…", 27, "12.4k", "+11%", "↑ rising", 1], ["Enablers", "grind size, pour over ratio…", 13, "5.2k", "+1%", "→ flat", 0]], soph: "1.39", sophWas: "1.31" },
      versions: [["v2", "Oct 18", "weekly research refresh"], ["v1", "Sep 20", "first research run"]],
      insights: [
        ["CT-01", "Freshness is judged by the roast date on the bag, not the brand.", "from 7 quotes"],
        ["CT-02", "Subscription interest rises from late October into January.", "from search data, Oct"],
        ["TN-01", "They want variety but cancel when a bag disappoints.", "from 9 quotes"],
        ["BL-01", "Skipping a delivery is the step before cancelling.", "from 5 quotes"],
        ["LP-01", "“Third wave” has given way to “specialty” in how buyers talk.", "from 8 quotes"],
        ["HS-01", "Home espresso is pulling buyers toward darker, espresso-friendly roasts.", "from 6 quotes and search for “home espresso” up 22%"],
      ],
      v1: { removed: [], changed: { "CT-02": ["Subscription interest peaks in January.", "search up 9% on its 4-week average (Oct 19 change note)"] }, added: ["HS-01"] },
      season: [["Nov 27", "Black Friday", "", 35], ["Dec 1–18", "Gift subscriptions peak", "gift searches tripled in each of the last 2 Decembers", 39], ["Jan 2", "New-year routine searches", "", 71]],
      totals: { quotes: 38, inferred: 9, sources: 8, who: { cust: 47, gate: 8, ind: 5 } },
      themes: { cust: [["Freshness", 12], ["Variety", 9], ["Price per cup", 7], ["Delivery", 6]], gate: [["Brewing", 5], ["Sourcing", 3]], ind: [["Prices", 3], ["Formats", 2]] },
      segs: ["Home barista", "Busy commuter", "Gift giver"],
      quotes: [
        ["cust", "If there’s no roast date on the bag I don’t buy it. Simple as that.", "Home barista", "Reddit", "Sep 2026", "Freshness"],
        ["cust", "Loved the first three bags, the fourth tasted like cardboard and I cancelled.", "Busy commuter", "Trustpilot", "Oct 2026", "Variety"],
        ["cust", "Worked out it’s 60 cents a cup. Still cheaper than the café downstairs.", "Busy commuter", "Reddit", "Aug 2026", "Price per cup"],
        ["inf", "Buyers forgive one bad bag if the next delivery is chosen for them.", "Home barista", "", "", "Variety", 4],
        ["gate", "Buy whole beans and a decent burr grinder before you spend on a fancy machine.", "Coffee creator", "YouTube", "Sep 2026", "Brewing"],
        ["ind", "Green coffee prices are up 18% on the year; expect subscription price rises in Q1.", "Industry report", "Trade press", "Oct 2026", "Prices"],
      ],
    },
    north: {
      note: { date: "Mon Oct 19", text: "Searches for “no pull harness” are up <b class=\"num\">12%</b> on their 4-week average. Trailmate started 9 new ads with a 60-day guarantee.", affects: "CT-01", affectsText: "Buyers choose harnesses on fit, not price", also: "" },
      sos: { brands: [["Northpaw", 11, 10, "c1"], ["Trailmate", 29, 25, "c2"], ["Barkline", 26, 28, "c3"], ["Furrow", 15, 16, "c4"], ["Others", 19, 21, "c6"]], up: 1 },
      kw: { total: 88, rows: [["Category", "dog harness, no pull harness…", 29, "40.3k", "+6%", "↑ rising", 1], ["Problems", "dog pulls on lead, harness rubbing…", 24, "14.7k", "+9%", "↑ rising", 1], ["Solutions", "front clip harness, padded harness…", 21, "9.8k", "+2%", "→ flat", 0], ["Enablers", "measure dog for harness…", 14, "4.1k", "−1%", "→ flat", 0]], soph: "0.67", sophWas: "0.70" },
      versions: [["v2", "Oct 18", "weekly research refresh"], ["v1", "Sep 19", "first research run"]],
      insights: [
        ["CT-01", "Buyers choose harnesses on fit first; price only breaks ties.", "from 11 quotes"],
        ["TN-01", "They want a harness that stops pulling but fear it hurts the dog.", "from 8 quotes"],
        ["CX-01", "They say durability matters most, yet return harnesses over sizing.", "from 6 reviews"],
        ["BL-01", "A guarantee shortens the decision from weeks to days.", "from 5 quotes"],
        ["LP-01", "“No pull” is how buyers name the whole category.", "from 14 quotes"],
        ["HS-01", "Reflective, night-walk gear is becoming expected from November.", "from 4 quotes and search for “reflective harness” up 40%"],
      ],
      v1: { removed: [], changed: { "CT-01": ["Buyers choose harnesses on fit, not price.", "12 new reviews mention price as a tie-breaker"] }, added: ["HS-01"] },
      season: [["Nov 1", "Dark-evening walks start", "reflective gear searches rose 35% in each of the last 3 Novembers", 9], ["Nov 27", "Black Friday", "", 35], ["Dec 1–20", "Pet gifting peaks", "", 39]],
      totals: { quotes: 33, inferred: 7, sources: 7, who: { cust: 40, gate: 6, ind: 4 } },
      themes: { cust: [["Fit", 11], ["Pulling", 9], ["Durability", 7], ["Returns", 6]], gate: [["Training", 4], ["Safety", 2]], ind: [["Retail", 2], ["Materials", 2]] },
      segs: ["New puppy owner", "Big-dog walker", "Gear upgrader"],
      quotes: [
        ["cust", "Third harness this year. The first two rubbed under his legs within a week.", "Big-dog walker", "Amazon review", "Sep 2026", "Fit"],
        ["cust", "She still pulls, but at least I’m not being dragged across the road anymore.", "New puppy owner", "Reddit", "Oct 2026", "Pulling"],
        ["cust", "The sizing guide said medium. Medium was a joke. Returned it.", "Gear upgrader", "Trustpilot", "", "Returns"],
        ["inf", "Owners trust a harness more when the ad shows a big dog, not a small one.", "Big-dog walker", "", "", "Fit", 4],
        ["gate", "A front-clip harness is a training aid, not a fix. Pair it with lead work.", "Dog trainer", "YouTube", "Aug 2026", "Training"],
        ["ind", "Pet accessory sales online grew 11% this year, led by premium harnesses.", "Retail data", "Trade press", "Sep 2026", "Retail"],
      ],
    },
    kettle: {
      note: { date: "Mon Oct 19", text: "Searches for “loose leaf tea gift set” are up <b class=\"num\">24%</b> on their 4-week average, as they do every late October. No competitor changed its ads this week.", affects: "", affectsText: "", also: "" },
      sos: { brands: [["Kettle & Co", 21, 18, "c1"], ["Steep House", 28, 30, "c2"], ["Leafwright", 20, 19, "c3"], ["Brewmark", 16, 17, "c4"], ["Others", 15, 16, "c6"]], up: 3 },
      kw: { total: 104, rows: [["Category", "loose leaf tea, tea gift set…", 38, "36.8k", "+10%", "↑ rising", 1], ["Problems", "bitter green tea, caffeine crash…", 25, "11.2k", "+5%", "→ flat", 0], ["Solutions", "cold brew tea, matcha whisk…", 26, "13.9k", "+14%", "↑ rising", 1], ["Enablers", "tea steeping times, water temperature…", 15, "6.0k", "+2%", "→ flat", 0]], soph: "1.24", sophWas: "1.12" },
      versions: [["v2", "Oct 18", "weekly research refresh"], ["v1", "Sep 20", "first research run"]],
      insights: [
        ["CT-01", "Most first orders are gifts; repeat orders are for the buyer themselves.", "from 10 quotes and order data"],
        ["TN-01", "They want ritual but don’t have time for it on weekdays.", "from 7 quotes"],
        ["BL-01", "A sampler set converts browsers who would never buy a full tin.", "from 6 quotes"],
        ["LP-01", "“Slow morning” is how buyers describe what they’re buying.", "from 9 quotes"],
        ["MY-01", "Green tea should be brewed with boiling water.", "from 5 quotes"],
        ["HS-01", "Cold-brew tea is moving from summer-only to all year.", "from 5 quotes and search for “cold brew tea” up 30%"],
      ],
      v1: { removed: [], changed: { "TN-01": ["They want ritual but don’t have time for it.", "4 new quotes split weekday and weekend"] }, added: ["HS-01"] },
      season: [["Nov 27", "Black Friday", "", 35], ["Dec 1–20", "Gift sets peak", "gift set searches doubled in each of the last 3 Decembers", 39], ["Jan 5", "Dry-January tea searches", "", 74]],
      totals: { quotes: 42, inferred: 8, sources: 9, who: { cust: 50, gate: 7, ind: 5 } },
      themes: { cust: [["Gifting", 13], ["Ritual", 10], ["Taste", 8], ["Packaging", 6]], gate: [["Brewing", 4], ["Quality", 3]], ind: [["Formats", 3], ["Retail", 2]] },
      segs: ["Gift buyer", "Weekend ritualist", "Health switcher"],
      quotes: [
        ["cust", "Bought the sampler for my sister and ended up ordering two tins for myself.", "Gift buyer", "Reviews", "Oct 2026", "Gifting"],
        ["cust", "Sunday morning, kettle on, phone away. That’s what I’m paying for.", "Weekend ritualist", "Instagram comments", "Sep 2026", "Ritual"],
        ["cust", "Finally a green tea that isn’t bitter. Turns out I was using boiling water.", "Health switcher", "Reddit", "", "Taste"],
        ["inf", "Packaging that looks good on a shelf matters more than the tea for first orders.", "Gift buyer", "", "", "Packaging", 4],
        ["gate", "80 degrees for green tea, two minutes, and most people would never go back to bags.", "Tea creator", "YouTube", "Aug 2026", "Brewing"],
        ["ind", "Premium loose-leaf grew 9% this year while tea bags were flat.", "Retail data", "Trade press", "Sep 2026", "Retail"],
      ],
    },
  };

  /* Competitors */
  const comp = {
    acme: {
      week: "Oct 12 – Oct 18",
      changes: [["Lumen Labs", "c2", "<b class=\"num\">14</b> new ads, <b class=\"num\">9</b> stopped. Most new ads lead with barrier repair.", [3, 2, 6, 8, 1], "Big refresh", "see all 14"], ["Verity Skin", "c3", "First video ads since July: <b class=\"num\">3</b> dermatologist talking-head videos.", [5, 7, 4], "New format", ""], ["Halcyon", "c4", "New landing page for a retinol starter kit at <span class=\"num\">$39</span>.", [], "New landing page", "halcyon.example/starter"]],
      totalAds: 212,
      hooks: [["Before / after", "Lumen Labs, Halcyon", 23, 94], ["Dermatologist proof", "Verity Skin", 11, 61], ["Ingredient callout", "Lumen Labs, Verity Skin, Pure Theory", 19, 45], ["Founder explains the formula", "Pure Theory", 6, 38], ["Routine in 3 steps", "Halcyon, Dermaclear", 8, 27]],
      gallery: [[2, 94, "Lumen Labs", "Before / after"], [6, 80, "Halcyon", "Before / after"], [4, 61, "Verity Skin", "Dermatologist proof"], [5, 45, "Lumen Labs", "Ingredient callout"], [7, 38, "Pure Theory", "Founder explains"], [1, 33, "Verity Skin", "Ingredient callout"], [8, 27, "Halcyon", "Routine in 3 steps"], [3, 21, "Dermaclear", "Routine in 3 steps"]],
      white: [["High", "Proof it won't irritate, as the hook.", "Reviews across the category cite burning; no competitor ad shows proof of gentleness.", "From 18 irritation quotes and 212 competitor ads", "WS-01"], ["Medium", "Price per use.", "Buyers compare cost per ml; nobody frames it that way.", "From 9 quotes", "WS-02"], ["Medium", "Results timing.", "Only Halcyon says how long results take; buyers ask constantly.", "From 7 quotes", "WS-03"]],
      whiteTotal: 7, sayTotal: 48,
      say: {
        criticism: [["Lumen Labs", "Lumen Labs changed their formula last year and now it pills under makeup.", "quality decline · Amazon review · Aug 2026"], ["Verity Skin", "Verity's serum is great but $68 for 30ml is insane when it runs out in five weeks.", "price · Reddit · Sep 2026"], ["Halcyon", "Halcyon's packaging leaks every single time it ships.", "packaging · Trustpilot · Oct 2026"]],
        switching: [["Lumen Labs", "Verity Skin", "less irritation", "Verity is the only one that doesn't sting."], ["Verity Skin", "drugstore", "price", "Same actives for a third of the price."], ["Halcyon", "Acme Skincare", "clear percentages", "Acme just tells you it's 0.3%. Done."]],
        assets: [["Lumen Labs", "The amber bottle. I'd know it anywhere on a shelf.", "packaging · Instagram comments · Sep 2026"], ["Verity Skin", "Their derm videos are why I trust them.", "creators · TikTok comments · Oct 2026"], ["Halcyon", "Halcyon's customer service refunded me without even asking for the bottle back.", "service · Trustpilot · no date in source"]],
        substitutes: [["Lumen Labs", "I swapped my serum for prescription tretinoin and never looked back.", "prescription · Reddit · Aug 2026"], ["Pure Theory", "Honestly a plain moisturiser and sunscreen did more than any serum.", "skipping the category · Reddit · Jul 2026"]],
      },
      set: { ver: "v2 · confirmed Oct 6 by Jordan Lee", brands: [["Lumen Labs", "c2"], ["Verity Skin", "c3"], ["Halcyon", "c4"], ["Pure Theory", "c5"], ["Dermaclear", "c6"]], more: "Basin & Bloom", note: "v1 was proposed by the research on Sep 21. Editing makes v3; the research and share of search use the new set from the next run." },
    },
  };
  const lightComp = (name, brands, hooks, white, say) => ({
    week: "Oct 12 – Oct 18",
    changes: [[brands[0][0], brands[0][1], hooks.change, [2, 5, 7], "Big refresh", ""], [brands[1][0], brands[1][1], hooks.change2, [], "New offer", ""]],
    totalAds: hooks.total, hooks: hooks.rows, gallery: hooks.gallery, white, whiteTotal: white.length + 1, sayTotal: hooks.say,
    say, set: { ver: "v1 · confirmed Sep 24 by Jordan Lee", brands, more: "", note: "Proposed by the research on Sep 20. Editing makes v2; the research and share of search use the new set from the next run." },
  });
  comp.bloom = lightComp("Bloom Coffee", [["Ridge Roasters", "c2"], ["Daybreak Beans", "c3"], ["Copperpot", "c4"]],
    { change: "<b class=\"num\">6</b> new ads offering a free grinder with a 3-month plan.", change2: "Dropped subscription price to <span class=\"num\">$16</span> a bag for the first month.", total: 94, say: 21,
      rows: [["Free gift with subscription", "Ridge Roasters", 9, 71], ["Roaster on camera", "Daybreak Beans", 7, 55], ["Taste-test reactions", "Copperpot, Ridge Roasters", 11, 38]],
      gallery: [[3, 71, "Ridge Roasters", "Free gift"], [7, 55, "Daybreak Beans", "Roaster on camera"], [0, 38, "Copperpot", "Taste test"], [5, 30, "Ridge Roasters", "Taste test"]] },
    [["High", "Roast date as the promise.", "Buyers check roast dates; no competitor leads with freshness proof.", "From 12 freshness quotes and 94 competitor ads", "WS-01"], ["Medium", "Choose-for-me variety.", "Buyers want curation after a bad bag; only Copperpot hints at it.", "From 9 quotes", "WS-02"]],
    { criticism: [["Ridge Roasters", "The free grinder broke in a month and cancelling took three emails.", "service · Trustpilot · Sep 2026"]], switching: [["Ridge Roasters", "Bloom Coffee", "fresher beans", "Bloom's bags arrive roasted that week."]], assets: [["Daybreak Beans", "Their roaster videos make me feel like I know the farm.", "creators · Instagram comments · Oct 2026"]], substitutes: [["Copperpot", "Went back to the café. Less washing up.", "skipping the category · Reddit · Aug 2026"]] });
  comp.north = lightComp("Northpaw", [["Trailmate", "c2"], ["Barkline", "c3"], ["Furrow", "c4"]],
    { change: "<b class=\"num\">9</b> new ads with a 60-day guarantee.", change2: "New landing page for a puppy starter bundle at <span class=\"num\">$49</span>.", total: 78, say: 17,
      rows: [["Big dog, no pulling", "Trailmate, Barkline", 12, 83], ["Guarantee up front", "Trailmate", 5, 40], ["Vet or trainer says", "Furrow", 4, 26]],
      gallery: [[2, 83, "Trailmate", "Big dog, no pulling"], [6, 64, "Barkline", "Big dog, no pulling"], [3, 40, "Trailmate", "Guarantee"], [8, 26, "Furrow", "Trainer says"]] },
    [["High", "Fit guaranteed, sized by photo.", "Returns over sizing are the top complaint; nobody solves sizing in the ad.", "From 11 fit quotes and 78 competitor ads", "WS-01"], ["Medium", "Comfort proof.", "Owners fear rubbing; only Furrow shows padding up close.", "From 7 quotes", "WS-02"]],
    { criticism: [["Barkline", "Barkline's clip snapped on the second walk.", "quality · Amazon review · Sep 2026"]], switching: [["Barkline", "Northpaw", "better fit", "Northpaw's sizing actually matched my dog."]], assets: [["Trailmate", "Trailmate's guarantee is why I tried them first.", "offer · Reddit · Oct 2026"]], substitutes: [["Furrow", "Went back to a flat collar and did training instead.", "training · Reddit · Aug 2026"]] });
  comp.kettle = lightComp("Kettle & Co", [["Steep House", "c2"], ["Leafwright", "c3"], ["Brewmark", "c4"]],
    { change: "No new ads this week; <b class=\"num\">22</b> still running from September.", change2: "Gift set pre-orders open at <span class=\"num\">$45</span>.", total: 66, say: 15,
      rows: [["Unboxing the gift set", "Steep House, Leafwright", 10, 62], ["Slow-morning ritual", "Leafwright", 6, 48], ["Tasting notes on screen", "Brewmark", 5, 29]],
      gallery: [[3, 62, "Steep House", "Unboxing"], [8, 48, "Leafwright", "Ritual"], [6, 35, "Steep House", "Unboxing"], [1, 29, "Brewmark", "Tasting notes"]] },
    [["High", "Brewing made foolproof.", "Bitter green tea is the top complaint; no competitor shows how to brew it.", "From 8 taste quotes and 66 competitor ads", "WS-01"], ["Medium", "A gift that becomes a habit.", "First orders are gifts; nobody sells the repeat order.", "From 13 quotes", "WS-02"]],
    { criticism: [["Steep House", "Beautiful tin, but the tea was dusty and flat.", "quality · Reviews · Oct 2026"]], switching: [["Brewmark", "Kettle & Co", "fresher taste", "Kettle's sencha actually tastes green."]], assets: [["Leafwright", "Their tins are the reason I keep buying.", "packaging · Instagram comments · Sep 2026"]], substitutes: [["Brewmark", "Matcha lattes from the café do the same job.", "café · Reddit · Aug 2026"]] });

  /* Audience. Each segment: [code name, summary, awareness, sophistication, tensions, pains, misconceptions, motivations, demand, entry, decide, quotes, indicators] */
  const seg = (o) => o;
  const audience = {
    acme: {
      ver: "Segments v2 · Oct 20",
      segs: [
        seg({ name: "The ingredient-literate", summary: "Reads the INCI list before the headline, distrusts marketing words and buys on actives and concentration. About <span class=\"num\">29</span> of the <span class=\"num\">61</span> quotes sound like them.", aw: [4, "knows the solutions, comparing products"], so: [5, "has heard every claim; needs proof, not promises"], tensions: "TN-02 results fast vs fear of irritation · TN-04 wants to stop researching, can't",
          pains: ["Paying for “hero” ingredients at useless concentrations", "Irritation that turns out not to be “purging”", "Wasting months on something that never worked"], mis: ["A higher percentage always works better", "“Purging” means the product is working"],
          mot: [["Functional", "visible results in 4–6 weeks"], ["Emotional", "feeling in control, not sold to"], ["Identity", "“I know more than the ads”"], ["Unstated need", "permission to stop researching"]],
          demand: [["Full concentration on the label", "functional"], ["Proof it won't irritate", "emotional"], ["Being the smart buyer", "identity"]],
          entry: [["Enters", "the category after a breakout from changing products"], ["Switches", "when their brand reformulates (BL-02)"], ["Switches", "when a reformulation gets exposed on Reddit"]],
          decide: [["Evaluates by", "% actives, price per ml, formula changes"], ["Trusts", "dermatologist creators, ingredient databases"], ["Resonates", "“full disclosure”, “clinically dosed”"], ["Repels", "“clean”, “miracle”, “glow”"]],
          quotes: [["If you won’t tell me the percentage, I assume it’s 0.01%.", "TikTok comments · Sep 2026"], ["I don’t trust anything that says clean anymore. I just read the INCI list.", "Reddit · Aug 2026"]], nq: 29,
          ind: [["Talk about “percentages” and “INCI”", "+22%"], ["Mentions of irritation", "−8%"], ["Your purchases from women 25–34 (closest age match)", "41%"]], comm: "r/SkincareAddiction and r/30PlusSkinCare" }),
        seg({ name: "The sensitive-skin buyer", summary: "Has reacted to products before and now buys defensively: patch tests everything and reads reviews for the word “burn”. About <span class=\"num\">27</span> of the <span class=\"num\">61</span> quotes sound like them.", aw: [3, "knows retinol could help, unsure it's safe for them"], so: [4, "has been burned by “gentle” claims"], tensions: "TN-02 results fast vs fear of irritation · TN-03 wants proof, distrusts photos",
          pains: ["Redness and peeling that lasts for days", "Being told a reaction is “purging”", "Throwing away half-used bottles"], mis: ["You can't use retinol with sensitive skin", "A tingle means it's working"],
          mot: [["Functional", "results without a bad week"], ["Emotional", "safety, not being let down again"], ["Identity", "“I know my skin”"], ["Unstated need", "someone to tell them it's safe to start"]],
          demand: [["Proof it won't irritate", "emotional"], ["Patch-test guidance", "functional"], ["Fragrance-free", "functional"]],
          entry: [["Enters", "after a dermatologist suggests a low-dose retinoid"], ["Switches", "after a single bad reaction (BL-04)"], ["Stays", "when the first week goes quietly"]],
          decide: [["Evaluates by", "reviews mentioning reactions, fragrance, encapsulation"], ["Trusts", "dermatologists, long reviews"], ["Resonates", "“start low”, “no fragrance”"], ["Repels", "“tingle”, “purge”, “powerful”"]],
          quotes: [["Every ‘gentle’ serum I try still burns for a week, so now I patch test everything.", "Reddit · no date in source"], ["My face was red for three days and the brand told me it was purging.", "Trustpilot · Sep 2026"]], nq: 27,
          ind: [["Mentions of “burning” or “stinging”", "−5%"], ["Talk about patch testing", "+14%"], ["Your purchases from women 35–44 (closest age match)", "29%"]], comm: "r/SensitiveSkin and r/Rosacea" }),
        seg({ name: "The routine minimalist", summary: "Tired of ten-step routines, wants one or two products that do the job, and does the maths on price per use. About <span class=\"num\">19</span> of the <span class=\"num\">61</span> quotes sound like them.", aw: [4, "knows the options, wants fewer of them"], so: [3, "open to a clear, simple promise"], tensions: "TN-01 one routine vs adding steps",
          pains: ["Shelves of half-used products", "Not knowing which step is doing anything", "Paying premium prices per ml"], mis: ["More steps means better skin"],
          mot: [["Functional", "fewer products, same results"], ["Emotional", "relief from decision fatigue"], ["Identity", "“I'm not a skincare person”"], ["Unstated need", "permission to stop"]],
          demand: [["One active done properly", "functional"], ["Price per use made clear", "functional"], ["Simple routine", "emotional"]],
          entry: [["Enters", "after a dermatologist says to cut back"], ["Switches", "when a product does two jobs"], ["Cancels", "when the routine grows again"]],
          decide: [["Evaluates by", "price per ml, steps saved"], ["Trusts", "dermatologists who say “less”"], ["Resonates", "“one step”, “that's it”"], ["Repels", "regimens, bundles of five"]],
          quotes: [["I’m tired of a ten-step routine. Give me two things that work.", "Reddit · Aug 2026"], ["I worked out the price per ml and the drugstore one is a third of the cost for the same retinol.", "Reddit · Jul 2026"]], nq: 19,
          ind: [["Talk about “simple routine”", "+9%"], ["Mentions of price per ml", "+4%"], ["Your purchases from women 25–34 (closest age match)", "41%"]], comm: "r/SkincareAddiction and r/BuyItForLife" }),
        seg({ name: "The results chaser", summary: "Wants visible change fast and buys on before-and-after proof; the most likely to try something new. About <span class=\"num\">11</span> of the <span class=\"num\">61</span> quotes sound like them.", aw: [5, "knows the brands, chasing the best one"], so: [4, "wants proof, likes bold claims if backed"], tensions: "TN-03 wants proof, distrusts photos",
          pains: ["Waiting months for nothing", "Results that fade when they stop"], mis: ["Results should show in a week"],
          mot: [["Functional", "visible change in weeks"], ["Emotional", "excitement, being noticed"], ["Identity", "“early to what works”"], ["Unstated need", "a timeline they can trust"]],
          demand: [["Before and after", "functional"], ["Results in weeks", "functional"], ["Being first", "identity"]],
          entry: [["Enters", "after seeing a friend's results"], ["Switches", "when progress stalls at week four"]],
          decide: [["Evaluates by", "photos, timelines, reviews with pictures"], ["Trusts", "friends, creators with long-term updates"], ["Resonates", "“week 6”, “real results”"], ["Repels", "vague promises"]],
          quotes: [["Showed my sister the before and after and she ordered the same night.", "Instagram comments · Sep 2026"], ["$70 for a serum is fine if it lasts three months. This one lasted five weeks.", "Amazon review · Oct 2026"]], nq: 11,
          ind: [["Talk about “before and after”", "+6%"], ["Mentions of “week 6”", "+11%"], ["Your purchases from women 18–24 (closest age match)", "10%"]], comm: "r/SkincareAddiction and TikTok #retinolresults" }),
        seg({ name: "The gift buyer", summary: "Buys for someone else, mostly in November and December; chooses on packaging and trust signals more than on actives. About <span class=\"num\">6</span> of the <span class=\"num\">61</span> quotes sound like them.", aw: [2, "knows the problem, not the products"], so: [2, "moved by clear, simple reassurance"], tensions: "wants a safe gift, can't judge the formula",
          pains: ["Buying something that irritates the person", "Gifts that look cheap"], mis: ["Luxury packaging means a better product"],
          mot: [["Functional", "a gift that gets used"], ["Emotional", "looking thoughtful"], ["Identity", "“I give good gifts”"], ["Unstated need", "a safe choice they don't have to research"]],
          demand: [["Sets under $50", "functional"], ["Packaging that looks clinical", "emotional"], ["Easy returns", "functional"]],
          entry: [["Enters", "in the gifting season, from search or a friend's post"], ["Returns", "when the person asks for a refill"]],
          decide: [["Evaluates by", "packaging, price, reviews"], ["Trusts", "best-of lists, editors"], ["Resonates", "“dermatologist approved”, “gift-ready”"], ["Repels", "complicated routines"]],
          quotes: [["Bought the set for my mum because the box looked like something from a pharmacy, not a party.", "Reviews · Oct 2026"]], nq: 6,
          ind: [["Searches for “skincare gift set”", "+31%"], ["Mentions of gifting in reviews", "+12%"], ["Your purchases from men (closest match for gifting)", "7%"]], comm: "gift guides and r/GiftIdeas" }),
      ],
      constellations: [["Proof of gentleness", "Proof it won't irritate, patch-test guidance, fragrance-free", "SEG-1, SEG-2", "Underserved", "High"], ["Honest dosing", "Full concentration on the label, formula-change notices", "SEG-1", "Partly served", "Medium"], ["Simple routine", "Fewer steps, one active done properly", "SEG-3, SEG-2", "Partly served", "Medium"], ["Fast visible results", "Before/after, timelines, results in weeks", "SEG-4", "Well covered", "Low"], ["Giftable", "Sets, packaging, price under $50", "SEG-5", "Ignored", "Medium"]],
      buyers: { ages: [["18–24", 10, 9, 1], ["25–34", 43, 41, 2], ["35–44", 29, 27, 2], ["45–54", 12, 11, 1], ["55+", 6, 5, 1]], split: ["Women", 93, "Men", 7], cover: 82 },
    },
  };
  const lightAud = (segs, cons, buyers) => ({ ver: "Segments v1 · Oct 18", segs, constellations: cons, buyers });
  const lightSeg = (name, summary, aw, so, pains, demand, decide, quote, comm) => ({ name, summary, aw, so, tensions: "", pains, mis: [], mot: [], demand, entry: [], decide, quotes: [quote], nq: 0, ind: [], comm });
  audience.bloom = lightAud([
    lightSeg("The home barista", "Owns a grinder and a scale, buys on roast date and origin.", [4, "knows the options, comparing roasters"], [4, "needs proof of freshness"], ["Stale beans from big brands", "Bags that don't suit their brew method"], [["Roast date as proof", "functional"], ["Origin stories", "identity"]], [["Evaluates by", "roast date, origin, tasting notes"], ["Trusts", "coffee creators, roasters on camera"]], ["If there’s no roast date on the bag I don’t buy it. Simple as that.", "Reddit · Sep 2026"], "r/Coffee and r/espresso"),
    lightSeg("The busy commuter", "Wants good coffee without thinking about it; cancels after one bad bag.", [3, "knows subscriptions exist"], [2, "moved by convenience"], ["Running out on a Monday", "A bag that tastes off"], [["Never run out", "functional"], ["Choose for me", "emotional"]], [["Evaluates by", "price per cup, delivery"], ["Trusts", "friends, reviews"]], ["Worked out it’s 60 cents a cup. Still cheaper than the café downstairs.", "Reddit · Aug 2026"], "r/Frugal and commuter forums"),
    lightSeg("The gift giver", "Buys subscriptions as gifts in December.", [2, "knows the problem, not the products"], [2, "wants a safe choice"], ["Gifts that don't get used"], [["Gift-ready box", "emotional"]], [["Evaluates by", "packaging, price"], ["Trusts", "gift guides"]], ["Gave three months to my dad. He’s now on his own plan.", "Reviews · Jan 2026"], "gift guides"),
  ], [["Freshness proof", "Roast date, roasted-to-order", "SEG-1", "Underserved", "High"], ["Never run out", "Flexible delivery, skip and pause", "SEG-2", "Partly served", "Medium"], ["Gift-ready", "Boxes, gift messages", "SEG-3", "Well covered", "Low"]],
    { ages: [["18–24", 8, 5, 3], ["25–34", 39, 22, 17], ["35–44", 31, 17, 14], ["45–54", 15, 8, 7], ["55+", 7, 4, 3]], split: ["Women", 56, "Men", 44], cover: 79 });
  audience.north = lightAud([
    lightSeg("The new puppy owner", "First dog, worried about pulling and safety; buys on reassurance.", [2, "knows the problem, not the fixes"], [2, "wants simple reassurance"], ["Being pulled into the road", "Not knowing the right size"], [["Sizing made easy", "functional"], ["Safety", "emotional"]], [["Evaluates by", "reviews, trainer advice"], ["Trusts", "trainers, vets"]], ["She still pulls, but at least I’m not being dragged across the road anymore.", "Reddit · Oct 2026"], "r/puppy101"),
    lightSeg("The big-dog walker", "Large breed, has gone through several harnesses; buys on durability and fit.", [4, "knows the brands"], [4, "needs proof it holds"], ["Rubbing under the legs", "Clips that snap"], [["Fit guaranteed", "functional"], ["Built for big dogs", "identity"]], [["Evaluates by", "materials, fit reviews"], ["Trusts", "owners with the same breed"]], ["Third harness this year. The first two rubbed under his legs within a week.", "Amazon review · Sep 2026"], "breed groups on Facebook"),
    lightSeg("The gear upgrader", "Owns basic gear, upgrading for comfort or night walks.", [3, "knows what they want"], [3, "compares features"], ["Returns over sizing"], [["Reflective for dark evenings", "functional"]], [["Evaluates by", "features, returns"], ["Trusts", "reviews"]], ["The sizing guide said medium. Medium was a joke. Returned it.", "Trustpilot · no date in source"], "r/dogs"),
  ], [["Fit guaranteed", "Sizing help, easy exchanges", "SEG-2, SEG-3", "Underserved", "High"], ["Stops pulling safely", "Front clip, training tips", "SEG-1", "Well covered", "Low"], ["Night walks", "Reflective, lights", "SEG-3", "Partly served", "Medium"]],
    { ages: [["18–24", 9, 6, 3], ["25–34", 36, 25, 11], ["35–44", 30, 20, 10], ["45–54", 16, 11, 5], ["55+", 9, 6, 3]], split: ["Women", 68, "Men", 32], cover: 77 });
  audience.kettle = lightAud([
    lightSeg("The gift buyer", "First order is a gift; often returns for themselves.", [2, "knows tea, not the brands"], [2, "moved by packaging"], ["Gifts that look cheap"], [["Sampler sets", "functional"], ["Shelf-worthy tins", "emotional"]], [["Evaluates by", "packaging, price"], ["Trusts", "gift guides, reviews"]], ["Bought the sampler for my sister and ended up ordering two tins for myself.", "Reviews · Oct 2026"], "gift guides"),
    lightSeg("The weekend ritualist", "Buys tea as a slow-morning ritual; loyal once it fits the routine.", [4, "knows loose leaf"], [3, "wants the ritual, not claims"], ["No time on weekdays"], [["A ritual in a tin", "emotional"]], [["Evaluates by", "taste, ritual"], ["Trusts", "creators"]], ["Sunday morning, kettle on, phone away. That’s what I’m paying for.", "Instagram comments · Sep 2026"], "r/tea"),
    lightSeg("The health switcher", "Moving off coffee or sugary drinks; needs green tea to taste good.", [3, "knows tea is healthier"], [2, "needs simple help"], ["Bitter green tea"], [["Brewing made foolproof", "functional"]], [["Evaluates by", "taste, caffeine"], ["Trusts", "friends"]], ["Finally a green tea that isn’t bitter. Turns out I was using boiling water.", "Reddit · no date in source"], "r/tea and wellness forums"),
  ], [["Brewing made foolproof", "Steep times, water temperature", "SEG-3", "Underserved", "High"], ["Gift to habit", "Samplers, refills", "SEG-1", "Partly served", "Medium"], ["Slow mornings", "Ritual, tins", "SEG-2", "Well covered", "Low"]],
    { ages: [["18–24", 7, 5, 2], ["25–34", 30, 21, 9], ["35–44", 32, 23, 9], ["45–54", 19, 14, 5], ["55+", 12, 9, 3]], split: ["Women", 72, "Men", 28], cover: 80 });

  /* Suggestions */
  const suggestions = {
    acme: {
      open: [
        { id: "s1", type: "creative", b: "Give a new look some budget.", t: "Two looks carry 81% of spend and only 5 concepts got spend this month.", src: "From the audit · Health · Oct 20", audit: true },
        { id: "s2", type: "audience", b: "Widen prospecting before Black Friday.", t: "New people per $1k are down 34% in 3 months while frequency rose to 3.4.", src: "From the audit · Health · Oct 20", audit: true },
        { id: "s3", type: "budget", b: "Move $60/day from Retargeting to Prospecting – Broad.", t: "Retargeting frequency has been above its range for 3 weeks.", src: "Weekly report · Mon Oct 19 · worth considering" },
      ],
      past: [
        ["budget", "Cut ASC budget back to $300/day", "Weekly report · Oct 12", "Jordan Lee · Doing this · Oct 13", "CPA ↓ 14d · 6 in 10", { status: "hit", horizon: "14d" }],
        ["creative", "Refresh the two oldest retargeting ads", "Audit · Sep 21", "Sam Kim · Doing this · Oct 14", "CTR ↑ 14d · 7 in 10", { status: "wait", day: "9 of 14" }],
        ["pause", "Pause the 3 ads under 0.6% CTR", "Weekly report · Oct 5", "Alex Rivera · Doing this · Oct 6", "CPA ↓ 7d · 6 in 10", { status: "noise", horizon: "7d · ±$3" }],
        ["bid", "Lift the bid cap on Prospecting – Broad", "Weekly report · Sep 28", "Maya Chen · Doing this · Sep 29", "Results ↑ 14d · 7 in 10", { status: "miss", horizon: "14d" }],
        ["audience", "Exclude purchasers from the last 30 days", "Audit · Sep 21", "Maya Chen · Not now · Sep 23 · “client asked us to wait for the promo”", "", null],
      ],
      pastTotal: 11,
    },
    bloom: {
      open: [{ id: "s1", type: "pause", b: "Refresh or cap the retargeting videos.", t: "Retargeting video frequency is 6.8, above its 4.5–6.0 range for two weeks.", src: "From the audit · Health · Oct 18", audit: true }],
      past: [["bid", "Raise the brand bid cap to win peak hours", "Weekly report · Oct 12", "Sam Kim · Doing this · Oct 18", "CPA ↓ 7d · 7 in 10", { status: "hit", horizon: "7d" }], ["creative", "Test a morning-ritual UGC hook", "Audit · Sep 20", "Sam Kim · Doing this · Sep 30", "CPA ↓ 14d · 7 in 10", { status: "hit", horizon: "14d" }]],
      pastTotal: 4,
    },
    north: {
      open: [{ id: "s1", type: "audience", b: "Review the Oct 14 lookalike audience.", t: "CPA has been above its $30–$38 range for nine days since it launched.", src: "Weekly report · Mon Oct 19 · worth considering" }, { id: "s2", type: "creative", b: "Add a new concept to prospecting.", t: "Only 3 concepts got spend this month and one look carries 58%.", src: "From the audit · Health · Oct 18", audit: true }],
      past: [["budget", "Raise prospecting budget for back-to-routine season", "Weekly report · Sep 7", "Maya Chen · Doing this · Sep 10", "Results ↑ 14d · 7 in 10", { status: "hit", horizon: "14d" }]],
      pastTotal: 3,
    },
    kettle: { open: [], past: [["bid", "Raise the cost cap to unlock gift-season volume", "Weekly report · Oct 5", "Maya Chen · Doing this · Oct 12", "Conversions ↑ 14d · 7 in 10", { status: "hit", horizon: "14d" }], ["pause", "Pause the two search ads with no sales for 9 days", "Weekly report · Sep 21", "Alex Rivera · Not now · Sep 22 · “testing new copy first”", "", null]], pastTotal: 6 },
  };

  /* Weekly reports (this account's slice) */
  const R = (date, week, headline, perfRows, team, past, consider) => ({ date, week, headline, perf: perfRows, team, past, consider });
  const reports = {
    acme: [
      R("Mon Oct 19", "Oct 12–18", "CPA above range · 6 decisions · 3 graded · 1 suggestion",
        [["Spend", "$8,240", "$7.1k–$9.4k", "normal"], ["CPA", "$31.40", "$22–$28", "<b>above range</b> · after the Oct 9 budget change (no reason yet)"], ["ROAS", "2.41", "2.1–2.9", "normal"]],
        "6 decisions, 1 holding call, 0 skipped. <b>2 changes need a reason.</b> Capture rate on this account <span class=\"num\">78%</span> (Sam <span class=\"num\">100%</span>, Jordan <span class=\"num\">50%</span>, Maya <span class=\"num\">83%</span>).",
        [[6, "Creative swap", "3 new ads · Sam Kim", "CTR ↑ 7d · 7 in 10 · CTR moved +0.1 pts, inside the range", { status: "noise", horizon: "7d" }], ["budget", "Budget", "ASC $500 → $300/day · Jordan Lee", "CPA ↓ 14d · 6 in 10 · CPA $33 → $26", { status: "hit", horizon: "14d" }], ["pause", "Paused", "3 ads · Alex Rivera", "CPA ↓ 7d · 6 in 10 · moved $1.10, inside the ±$3 range", { status: "noise", horizon: "7d · ±$3" }]],
        [["budget", "Move $60/day from Retargeting to Prospecting – Broad.", "Retargeting frequency above its range for 3 weeks."]]),
      R("Mon Oct 12", "Oct 5–11", "All in range · 4 decisions · 2 graded · 2 suggestions",
        [["Spend", "$7,980", "$7.1k–$9.4k", "normal"], ["CPA", "$26.10", "$22–$28", "normal"], ["ROAS", "2.62", "2.1–2.9", "normal"]],
        "4 decisions, 0 holding calls, 0 skipped. <b>1 change needs a reason.</b> Capture rate on this account <span class=\"num\">75%</span>.",
        [["hold", "Reviewed, holding", "All campaigns · Sam Kim", "CPA steady 14d · 6 in 10 · held inside the range", { status: "hit", horizon: "14d" }], ["bid", "Bid cap", "$24 → $27 · Maya Chen", "Results ↑ 14d · 6 in 10 · moved +4%, inside the range", { status: "noise", horizon: "14d" }]],
        [["budget", "Cut ASC budget back to $300/day.", "CPA rising since the Oct 9 increase."], ["pause", "Pause the 3 ads under 0.6% CTR.", "Below this account's CTR range for 10 days."]]),
      R("Mon Oct 5", "Sep 28 – Oct 4", "All in range · 7 decisions · 1 graded · 1 suggestion",
        [["Spend", "$8,410", "$7.1k–$9.4k", "normal"], ["CPA", "$24.80", "$22–$28", "normal"], ["ROAS", "2.71", "2.1–2.9", "normal"]],
        "7 decisions, 1 holding call, 0 skipped. Capture rate on this account <span class=\"num\">86%</span>.",
        [[6, "Paused", "2 ads · Alex Rivera", "CTR ↑ 7d · 6 in 10 · moved +0.05 pts, inside the range", { status: "noise", horizon: "7d" }]],
        [["bid", "Lift the bid cap on Prospecting – Broad.", "Impression share fell at peak hours."]]),
      R("Mon Sep 28", "Sep 21–27", "First report · 3 decisions · nothing graded yet",
        [["Spend", "$8,020", "$7.1k–$9.4k", "normal"], ["CPA", "$25.30", "$22–$28", "normal"], ["ROAS", "2.66", "2.1–2.9", "normal"]],
        "3 decisions in your first week with CatchAll. Capture rate on this account <span class=\"num\">67%</span>.",
        [], []),
    ],
  };
  const lightReports = (rows) => rows.map(([date, week, head, spend, sr, cpa, cr, roas, rr, note, team]) => R(date, week, head, [["Spend", spend, sr, "normal"], ["CPA", cpa, cr, note || "normal"], ["ROAS", roas, rr, "normal"]], team, [], []));
  reports.bloom = lightReports([["Mon Oct 19", "Oct 12–18", "All in range · 3 decisions · 1 graded", "$5,520", "$4.8k–$6.1k", "$20.30", "$18–$23", "3.14", "2.7–3.5", "", "3 decisions, 1 holding call. <b>1 change needs a reason.</b> Capture rate on this account <span class=\"num\">67%</span>."], ["Mon Oct 12", "Oct 5–11", "All in range · 2 decisions · 1 graded", "$5,380", "$4.8k–$6.1k", "$20.90", "$18–$23", "3.05", "2.7–3.5", "", "2 decisions. Capture rate on this account <span class=\"num\">100%</span>."]]);
  reports.north = lightReports([["Mon Oct 19", "Oct 12–18", "CPA above range · 2 decisions · 1 graded", "$4,610", "$3.9k–$5.0k", "$39.20", "$30–$38", "1.74", "1.75–2.3", "<b>above range</b> · after the Oct 14 audience change", "2 decisions. <b>1 change needs a reason.</b> Capture rate on this account <span class=\"num\">50%</span>."], ["Mon Oct 12", "Oct 5–11", "All in range · 1 decision", "$4,450", "$3.9k–$5.0k", "$33.60", "$30–$38", "2.05", "1.75–2.3", "", "1 decision. Capture rate on this account <span class=\"num\">100%</span>."]]);
  reports.kettle = lightReports([["Mon Oct 19", "Oct 12–18", "Spend above range · 2 decisions · 1 graded", "$11,640", "$8.8k–$11.6k", "$26.70", "$24–$30", "2.88", "2.4–3.2", "", "2 decisions. Capture rate on this account <span class=\"num\">100%</span>."], ["Mon Oct 12", "Oct 5–11", "All in range · 2 decisions", "$10,280", "$8.8k–$11.6k", "$27.40", "$24–$30", "2.79", "2.4–3.2", "", "2 decisions. Capture rate on this account <span class=\"num\">50%</span>."]]);

  /* Connection (owners and admins) */
  const imp = (rows) => rows.map(([d, done, of, note]) => ({ d, done, of: of || 13, note: note || "" }));
  const fullImport = imp([["Change history", 13], ["Settings", 1, 1], ["Reach", 13], ["Account results", 13], ["Campaign results", 13], ["Ad set results", 13], ["Ad results", 12, 13, "1 waiting on Facebook"], ["Audience breakdowns", 11, 13, "1 in progress · 1 retrying"], ["Frequency", 13], ["Creatives", 12, 13, "1 waiting on Facebook"]]);
  const doneImport = imp([["Change history", 13], ["Settings", 1, 1], ["Reach", 13], ["Account results", 13], ["Campaign results", 13], ["Ad set results", 13], ["Ad results", 13], ["Audience breakdowns", 13], ["Frequency", 13], ["Creatives", 13]]);
  const connection = {
    acme: { by: "Dana Wells", on: "Sep 21", alias: "ACC-03", actId: "act_2190447104", tzName: "America/New_York", token: "Dec 18, 2026", access: "Jan 19, 2027", imports: fullImport, others: "Bloom Coffee" },
    bloom: { by: "Dana Wells", on: "Sep 20", alias: "ACC-07", actId: "act_3318820561", tzName: "America/Los_Angeles", token: "Dec 18, 2026", access: "Jan 19, 2027", imports: doneImport, others: "Acme Skincare" },
    north: { by: "Jordan Lee", on: "Aug 4", alias: "ACC-11", actId: "act_1027765390", tzName: "America/Chicago", token: "Dec 2, 2026", access: "Nov 2, 2026", warn: "Nov 2", imports: doneImport, others: "Kettle & Co" },
    kettle: { by: "Jordan Lee", on: "Aug 4", alias: "ACC-12", actId: "act_1027765402", tzName: "America/New_York", token: "Dec 2, 2026", access: "Jan 3, 2027", imports: doneImport, others: "Northpaw" },
  };

  /* past audit shares (owner only); Share audit adds to the front of these lists */
  const shares = {
    acme: [
      { made: "Oct 22", by: "Dana Wells", inc: "Health, Market, Competitors, Audience, scorecard", exp: "Nov 21", viewed: "Oct 23 08:41", opens: 4, status: "Active", link: "https://app.catchall.example/s/7Kq2-mfa9-XyT4" },
      { made: "Oct 6", by: "Dana Wells", inc: "Health, Market, scorecard", exp: "Oct 13", viewed: "Oct 9 14:02", opens: 2, status: "Expired" },
      { made: "Sep 22", by: "Jordan Lee", inc: "Health, Market, Audience", exp: "Oct 22", viewed: "never opened", opens: 0, status: "Revoked Sep 24 by Dana Wells" },
    ],
    bloom: [{ made: "Oct 2", by: "Jordan Lee", inc: "Health, Market, Audience", exp: "Nov 1", viewed: "Oct 3 10:15", opens: 3, status: "Active", link: "https://app.catchall.example/s/Bq81-zz4n-Lw02" }],
    north: [], kettle: [],
  };

  /* day one (audit just finished): what's running for Market */
  const day1Research = [["Search volume and share of search", "done"], ["Competitor discovery", "6 brands proposed"], ["Customer quotes (P2)", "61 quotes found, checking sources"], ["Competitor and gatekeeper quotes (P3–P4)", "about 20 minutes", "now"], ["Market pulse and category physics (P5–P7)", "next", "todo"], ["Market summary and audience segments (S1–S5)", "next", "todo"]];

  return { history, perf, score, health, market, metaChanges, insightTypes: T, comp, audience, suggestions, reports, connection, shares, day1Research };
})();
