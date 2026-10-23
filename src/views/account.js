/* CatchAll demo: the account page. Route acct-<accountId>-<tab>[-<sub>], e.g. acct-acme-performance, acct-acme-market-quotes, acct-acme-audience-seg2.
   Tabs: Performance · Health · Market · Competitors · Audience · Suggestions · Reports · Connection (owners only).
   Also registers CA.drawers.shareaudit (the Share audit dialog). Sample data: CA.data.acct (src/data-account.js). */
(function () {
  const D = CA.data, U = CA.ui, esc = U.esc, num = U.num;
  const AD = () => CA.data.acct;
  const TABS = [["performance", "Performance"], ["health", "Health"], ["market", "Market"], ["competitors", "Competitors"], ["audience", "Audience"], ["suggestions", "Suggestions"], ["reports", "Reports"], ["connection", "Connection"]];
  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const N = 84; /* chart days: Aug 1 – Oct 23 */
  const T0 = new Date(2026, 7, 1).getTime();
  const dayIdx = (s) => { const [m, d] = String(s).split(" "); const mi = MON.indexOf(m); if (mi < 0) return -1; return Math.round((new Date(2026, mi, +d).getTime() - T0) / 864e5); };
  const dayLabel = (i) => { const d = new Date(T0 + i * 864e5); return MON[d.getMonth()] + " " + d.getDate(); };
  const plus = (days) => { const d = new Date(2026, 9, 23 + days); return MON[d.getMonth()] + " " + d.getDate() + (d.getFullYear() > 2026 ? ", " + d.getFullYear() : ""); };

  /* per-account UI state that survives re-renders */
  const S = {};
  const st = (id) => S[id] || (S[id] = { metric: "cpa", day: null, who: "cust", theme: "", plat: "", seg: "", ev: "", itype: "", ver: "v2", showAll: false, cmpFrom: "v1", cmpTo: "v2", cmpKind: "all", cmpAll: false, sos: 36, sayKind: "criticism", sayComp: "", setVer: "cur", report: 0, removed: [], skipped: [], trend: "", qf: null, qsort: "new", running: false, refreshed: false });

  /* ---------- small helpers ---------- */
  const lb = (label, attrs) => `<button class="linkbtn ac-lnk" ${attrs}>${label}</button>`;
  const toastBtn = (label, msg, cls = "linkbtn ac-lnk") => `<button class="${cls}" data-toast="${esc(msg)}">${label}</button>`;
  const sel = (id, label, opts, cur, attrs = "") => `<label class="sr" for="${id}">${esc(label)}</label><select class="sel ac-sel" id="${id}" ${attrs}>${opts.map(([v, l]) => `<option value="${esc(v)}"${String(v) === String(cur) ? " selected" : ""}>${esc(l)}</option>`).join("")}</select>`;
  const seg = (name, opts, cur, aria) => `<span class="seg" role="group" aria-label="${esc(aria)}">${opts.map(([v, l]) => `<button type="button" data-a="${name}" data-v="${esc(v)}" class="${String(v) === String(cur) ? "on" : ""}" aria-pressed="${String(v) === String(cur)}">${l}</button>`).join("")}</span>`;
  const chip = (act, v, label, on) => `<button type="button" class="chip${on ? " on" : ""}" data-a="${act}" data-v="${esc(v)}" aria-pressed="${!!on}">${label}</button>`;
  const ev = (k) => k === "obs" ? `<span class="ev obs">Observed</span>` : `<span class="ev inf">Inferred</span>`;
  const sech = (title, right = "") => `<div class="sech"><h3>${title}</h3>${right ? `<span class="ac-sr">${right}</span>` : ""}</div>`;
  const empty = (title, body, action = "") => `<div class="empty ac-empty"><div><h3 style="font-size:17px">${title}</h3><div class="ac-ebody">${body}</div>${action}</div></div>`;
  const pill = (t) => `<span class="ac-pill">${esc(t)}</span>`;
  const thumbN = (i, cls = "thumb") => `<span class="${cls}" style="background:${D.thumbs[i % D.thumbs.length]}" aria-hidden="true"></span>`;
  const spark = (vals, w, h, color) => { const lo = Math.min(...vals), hi = Math.max(...vals) || 1, r = hi - lo || 1; return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true"><polyline fill="none" stroke="${color}" stroke-width="1.6" points="${vals.map((v, i) => `${(i * w / (vals.length - 1)).toFixed(1)},${(h - 3 - (v - lo) / r * (h - 6)).toFixed(1)}`).join(" ")}"/></svg>`; };
  const pct = (a, b) => Math.round((a / b) * 100);
  const viewer = (c) => c.role === "owner" ? D.people.dana : D.people.sam;

  /* ---------- daily series (deterministic) ---------- */
  function rnd(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const hash = (s) => { let h = 2166136261; for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };
  const cache = {};
  function series(acctId, metric) {
    const k = acctId + ":" + metric; if (cache[k]) return cache[k];
    const cfg = AD().perf[acctId][metric]; const r = rnd(hash(k));
    const g = () => { let u = 0; for (let i = 0; i < 4; i++) u += r(); return (u - 2) / 0.58; };
    let e = 0; const pins = cfg.pins || {};
    const v = Array.from({ length: N }, (_, i) => {
      e = 0.5 * e + cfg.sd * 0.85 * g();
      let b = 0; (cfg.bumps || []).forEach(([s, t, d, ramp]) => { if (i >= s && i <= t) b += d * (ramp ? Math.min(1, (i - s + 1) / (ramp + 1)) : 1); });
      return cfg.base + e + b;
    });
    Object.keys(pins).forEach((i) => { v[+i] = pins[i]; });
    if (cfg.target7 != null) {
      const idx = [...Array(7)].map((_, j) => N - 7 + j); const free = idx.filter((i) => pins[i] == null);
      const avg = idx.reduce((s, i) => s + v[i], 0) / 7; const shift = (cfg.target7 - avg) * 7 / free.length; free.forEach((i) => { v[i] += shift; });
    }
    return (cache[k] = v.map((x) => metric === "spend" ? Math.round(x) : Math.round(x * 100) / 100));
  }
  const METRIC = {
    cpa: { label: "CPA", dir: -1, fmt: (v) => "$" + v.toFixed(2), ax: (v) => "$" + (+v.toFixed(1)), band: (b) => `$${b[0]}–$${b[1]}` },
    roas: { label: "ROAS", dir: 1, fmt: (v) => v.toFixed(2), ax: (v) => v.toFixed(1), band: (b) => `${b[0]}–${b[1]}` },
    spend: { label: "Spend", dir: 0, fmt: (v) => "$" + Math.round(v).toLocaleString("en-US"), ax: (v) => "$" + (v >= 1000 ? (v / 1000).toFixed(1) + "k" : v), band: (b) => `$${b[0].toLocaleString("en-US")}–$${b[1].toLocaleString("en-US")}` },
  };
  const niceStep = (range, n) => { const raw = range / n, p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p; };

  /* decisions on this account inside the chart window, newest first */
  function acctDecisions(acctId, phase) {
    const list = D.decisions.filter((d) => d.acct === acctId).concat(AD().history[acctId] || []);
    return list.map((d) => {
      let x = { ...d, idx: dayIdx(d.date) };
      if (phase === "day1" && x.status !== "outside") x = { ...x, status: "reason", source: "history", reason: "" };
      return x;
    }).filter((d) => d.idx >= 0 && d.idx < N).sort((a, b) => b.idx - a.idx);
  }
  const tickKind = (d) => d.status === "outside" || d.source === "outside" ? "out" : d.status === "reason" ? "need" : "log";
  function defaultDay(acctId, metric) {
    const v = series(acctId, metric), b = AD().perf[acctId][metric].band;
    for (let i = N - 1; i >= 0; i--) if (v[i] > b[1] || v[i] < b[0]) { const s = i; let j = s; while (j > 0 && (v[j - 1] > b[1] || v[j - 1] < b[0])) j--; return Math.min(s, j + 2); }
    return N - 1;
  }

  /* ---------- charts drawn at their real pixel width (so text never scales under 11px) ---------- */
  function perfChart(el) {
    const id = el.dataset.acct, s = st(id), m = METRIC[s.metric], v = series(id, s.metric), band = AD().perf[id][s.metric].band;
    const W = Math.max(280, Math.floor(el.clientWidth)), L = 50, R = 12, TP = 26, PH = 160, TY = TP + PH + 14, H = TY + 46;
    let lo = Math.min(...v, band[0]), hi = Math.max(...v, band[1]); const pad = (hi - lo) * 0.12; lo -= pad; hi += pad;
    const step = niceStep(hi - lo, 4), y0 = Math.floor(lo / step) * step, y1 = Math.ceil(hi / step) * step;
    const PW = W - L - R, x = (i) => L + i * PW / (N - 1), y = (val) => TP + PH - (val - y0) / (y1 - y0) * PH;
    let g = "";
    for (let t = y0; t <= y1 + step / 2; t += step) g += `<line x1="${L}" x2="${W - R}" y1="${y(t).toFixed(1)}" y2="${y(t).toFixed(1)}" stroke="var(--rule-soft)"/><text x="${L - 7}" y="${(y(t) + 4).toFixed(1)}" text-anchor="end" font-size="11" font-family="var(--mono)" fill="var(--muted)">${m.ax(t)}</text>`;
    const by = y(band[1]), bh = y(band[0]) - by;
    g += `<rect x="${L}" y="${by.toFixed(1)}" width="${PW}" height="${bh.toFixed(1)}" fill="var(--band)"/><rect x="${L}" y="${by.toFixed(1)}" width="${PW}" height="${bh.toFixed(1)}" fill="url(#hatch)"/><line x1="${L}" x2="${W - R}" y1="${by.toFixed(1)}" y2="${by.toFixed(1)}" stroke="var(--band-edge)"/><line x1="${L}" x2="${W - R}" y1="${(by + bh).toFixed(1)}" y2="${(by + bh).toFixed(1)}" stroke="var(--band-edge)"/>`;
    g += `<polyline fill="none" stroke="var(--ink)" stroke-width="1.8" stroke-linejoin="round" points="${v.map((val, i) => `${x(i).toFixed(1)},${y(val).toFixed(1)}`).join(" ")}"/>`;
    v.forEach((val, i) => {
      if (val >= band[0] && val <= band[1]) return;
      const better = m.dir === 0 ? null : (val > band[1]) === (m.dir > 0);
      g += better == null ? `<circle cx="${x(i).toFixed(1)}" cy="${y(val).toFixed(1)}" r="3.4" fill="var(--panel)" stroke="var(--ink)" stroke-width="1.5"/>` : `<circle cx="${x(i).toFixed(1)}" cy="${y(val).toFixed(1)}" r="3.6" fill="${better ? "var(--hit)" : "var(--miss)"}"/>`;
    });
    const sd = s.day;
    g += `<line x1="${L}" x2="${W - R}" y1="${TY + 6}" y2="${TY + 6}" stroke="var(--rule)"/>`;
    if (sd != null && sd >= 0) g += `<rect x="${x(Math.max(0, sd - 30)).toFixed(1)}" y="${TY - 5}" width="${(x(sd) - x(Math.max(0, sd - 30))).toFixed(1)}" height="22" fill="var(--raised)" opacity=".85"/>`;
    const ticks = acctDecisions(id, CA.state.phase);
    ticks.forEach((d) => {
      const k = tickKind(d), tx = x(d.idx);
      g += k === "out" ? `<rect x="${(tx - 4).toFixed(1)}" y="${TY}" width="8" height="12" fill="none" stroke="var(--muted)"/>` : `<rect x="${(tx - 1.5).toFixed(1)}" y="${TY}" width="3" height="12" fill="${k === "need" ? "var(--action)" : "var(--ink)"}"/>`;
    });
    g += `<rect x="${L}" y="${TP}" width="${PW}" height="${PH}" fill="transparent" pointer-events="all" data-plot="1" style="cursor:crosshair"/>`;
    ticks.forEach((d) => { g += `<rect x="${(x(d.idx) - 7).toFixed(1)}" y="${TY - 6}" width="14" height="24" fill="transparent" pointer-events="all" data-day="${d.idx}" style="cursor:pointer"><title>${esc(d.date + " · " + d.what + " " + (d.detail || ""))}</title></rect>`; });
    if (sd != null && sd >= 0) {
      const sx = x(sd), lab = `${dayLabel(sd)} · ${m.fmt(v[sd])}`, right = sx > W * 0.6;
      g += `<line x1="${sx.toFixed(1)}" x2="${sx.toFixed(1)}" y1="${TP - 8}" y2="${TY + 14}" stroke="var(--ink)" stroke-dasharray="3 3" pointer-events="none"/><circle cx="${sx.toFixed(1)}" cy="${y(v[sd]).toFixed(1)}" r="5.5" fill="none" stroke="var(--ink)" stroke-width="2" pointer-events="none"/><text x="${(sx + (right ? -7 : 7)).toFixed(1)}" y="${TP - 10}" text-anchor="${right ? "end" : "start"}" font-size="12" font-weight="600" fill="var(--ink)" pointer-events="none">${lab}</text>`;
    }
    const labs = [[0, "Aug 1"], [31, "Sep 1"], [61, "Oct 1"], [N - 1, "Oct 23"]].filter(([i]) => !(W < 480 && i === 61));
    labs.forEach(([i, t]) => { g += `<text x="${x(i).toFixed(1)}" y="${H - 4}" text-anchor="${i === N - 1 ? "end" : i === 0 ? "start" : "middle"}" font-size="11" font-family="var(--mono)" fill="var(--muted)">${t}</text>`; });
    el.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${m.label} by day, Aug 1 to Oct 23, with the normal range hatched and changes as ticks">${g}</svg>`;
    el.querySelector("svg").addEventListener("click", (e) => {
      const t = e.target.closest("[data-day],[data-plot]"); if (!t) return;
      let d;
      if (t.dataset.day != null) d = +t.dataset.day;
      else { const r = el.querySelector("svg").getBoundingClientRect(); d = Math.round((e.clientX - r.left - L) / PW * (N - 1)); }
      s.day = Math.max(0, Math.min(N - 1, d)); CA.rerender();
    });
  }

  function sosChart(el) {
    const id = el.dataset.acct, s = st(id), brands = AD().market[id].sos.brands, n = 36;
    const W = Math.max(280, Math.floor(el.clientWidth)), L = 42, R = 10, TP = 10, PH = 170, H = TP + PH + 28;
    const lines = brands.map(([name, end, start, c], bi) => { const r = rnd(hash(id + name)); let e = 0; const pts = Array.from({ length: n }, (_, i) => { e = 0.6 * e + (r() - 0.5) * 2.2; return start + (end - start) * (i / (n - 1)) + e * (1 - i / (n - 1)); }); pts[n - 1] = end; return { name, c, pts: pts.slice(n - s.sos), bi }; });
    const max = Math.ceil(Math.max(...lines.flatMap((l) => l.pts)) / 10) * 10, k = s.sos, x = (i) => L + i * (W - L - R) / (k - 1), y = (v) => TP + PH - v / max * PH;
    let g = "";
    for (let t = 0; t <= max; t += 10) g += `<line x1="${L}" x2="${W - R}" y1="${y(t)}" y2="${y(t)}" stroke="var(--rule-soft)"/><text x="${L - 6}" y="${y(t) + 4}" text-anchor="end" font-size="11" font-family="var(--mono)" fill="var(--muted)">${t}%</text>`;
    lines.slice().reverse().forEach((l) => { g += `<polyline fill="none" stroke="var(--${l.c})" stroke-width="${l.bi === 0 ? 2.6 : 1.6}" points="${l.pts.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ")}"/>`; });
    const labs = k === 36 ? [[1, "Dec ’23"], [13, "Dec ’24"], [25, "Dec ’25"], [35, "Oct ’26"]] : [[0, "Nov ’25"], [3, "Feb"], [6, "May"], [9, "Aug"], [11, "Oct ’26"]];
    labs.filter(([i]) => !(W < 480 && (k === 36 ? i === 25 : i === 9))).forEach(([i, t]) => { g += `<text x="${x(i).toFixed(1)}" y="${H - 6}" text-anchor="${i === k - 1 ? "end" : i === 0 ? "start" : "middle"}" font-size="11" font-family="var(--mono)" fill="var(--muted)">${t}</text>`; });
    el.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Share of search by brand, monthly">${g}</svg>`;
  }

  function reachChart(el) {
    const id = el.dataset.acct, r = AD().health[id].reach, n = r.months.length;
    const W = Math.max(280, Math.floor(el.clientWidth)), L = 44, R = 40, TP = 12, PH = 170, H = TP + PH + 30;
    const max = Math.ceil(Math.max(...r.per1k) / 100) * 100, fmin = 1, fmax = Math.ceil(Math.max(...r.freq) + 0.5);
    const cw = (W - L - R) / n, y = (v) => TP + PH - v / max * PH, yf = (f) => TP + PH - (f - fmin) / (fmax - fmin) * PH;
    let g = "";
    for (let t = 0; t <= max; t += max > 400 ? 200 : 100) g += `<line x1="${L}" x2="${W - R}" y1="${y(t)}" y2="${y(t)}" stroke="var(--rule-soft)"/><text x="${L - 6}" y="${y(t) + 4}" text-anchor="end" font-size="11" font-family="var(--mono)" fill="var(--muted)">${t}</text>`;
    for (let f = fmin + 1; f <= fmax; f++) g += `<text x="${W - R + 6}" y="${yf(f) + 4}" font-size="11" font-family="var(--mono)" fill="var(--muted)">${f.toFixed(1)}×</text>`;
    r.per1k.forEach((v, i) => { g += `<rect x="${(L + i * cw + cw * 0.12).toFixed(1)}" y="${y(v).toFixed(1)}" width="${(cw * 0.76).toFixed(1)}" height="${(PH - (y(v) - TP)).toFixed(1)}" rx="2" fill="var(--c1)" opacity=".75"/>`; if (W >= 560 || i % 3 === 0 || i === n - 1) g += `<text x="${(L + i * cw + cw / 2).toFixed(1)}" y="${H - 8}" text-anchor="middle" font-size="11" font-family="var(--mono)" fill="var(--muted)">${W < 560 ? r.months[i].replace(/ ’\d\d/, "") : r.months[i]}</text>`; });
    const pts = r.freq.map((f, i) => [L + i * cw + cw / 2, yf(f)]);
    g += `<polyline fill="none" stroke="var(--c6)" stroke-width="2.2" points="${pts.map((p) => p.map((q) => q.toFixed(1)).join(",")).join(" ")}"/>` + pts.map(([px, py]) => `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="3.2" fill="var(--panel)" stroke="var(--c6)" stroke-width="2"/>`).join("");
    el.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="New people reached per $1k (bars) and frequency (line), 13 months">${g}</svg>`;
  }
  const CHARTS = { perf: perfChart, sos: sosChart, reach: reachChart };
  function drawCharts(root) { root.querySelectorAll("[data-chart]").forEach((el) => { try { CHARTS[el.dataset.chart](el); } catch (e) { console.error(e); } }); }
  let rz; window.addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => { const a = document.querySelector(".acct"); if (a) drawCharts(a); }, 120); });

  /* ---------- header and tabs ---------- */
  function header(a, c, tab) {
    const s = st(a.id), owner = c.role === "owner", day1 = c.phase === "day1";
    let stat;
    if (a.status === "none") stat = `<span class="ac-sdot n"></span>Not connected yet · nothing syncs until someone connects it`;
    else if (a.status === "warn") stat = `<span class="ac-sdot w"></span>Connected to Meta · last synced ${esc(a.synced)} 06:00 ${esc(a.tz)} time · <b class="ac-warn">Facebook access ends Nov 2</b>`;
    else if (day1) stat = `<span class="ac-sdot"></span>Connected to Meta today at 09:12 · audit finished 09:31 · next sync tomorrow 06:00 ${esc(a.tz)} time`;
    else stat = `<span class="ac-sdot"></span>Connected to Meta · last synced today ${esc(a.synced)} ${esc(a.tz)} time · next sync tomorrow 06:00`;
    if (s.refreshed && a.status !== "none") stat += ` · audit refreshed just now`;
    let acts = "";
    if (owner) {
      const off = a.status === "none" ? ` disabled title="Available once the account is connected"` : "";
      acts = `<div class="ac-acts"><button class="btn btn-secondary" data-drawer="shareaudit" data-acct="${a.id}"${off || (s.running ? ` disabled title="Available when the audit finishes"` : "")} id="ac-share">${U.icon("share")} Share audit</button><button class="btn btn-ghost ac-ghost" data-a="run" id="ac-run"${off || (s.running ? " disabled" : "")}>${s.running ? "Running audit…" : "Run again"}</button></div>`;
    }
    const tabs = TABS.filter(([k]) => k !== "connection" || owner);
    return `<div class="ac-head"><div><h1 class="ac-name"><span class="adot" style="background:${a.color}"></span>${esc(a.name)}</h1><div class="ac-stat">${stat}</div></div>${acts}</div>
      <nav class="tabs" aria-label="${esc(a.name)} tabs">${tabs.map(([k, l]) => `<button data-go="acct-${a.id}-${k}" class="${k === tab ? "on" : ""}"${k === tab ? ' aria-current="page"' : ""}>${l}</button>`).join("")}</nav>`;
  }
  function reconnectBanner(a, c) {
    if (a.status !== "warn") return "";
    return U.banner("warn", `<b>Reconnect Facebook before Nov 2 to keep importing.</b> Facebook data access for ${esc(AD().connection[a.id].by)}'s login ends then. Reconnecting takes a minute and keeps everything you have.`,
      c.role === "owner" ? `<button class="btn btn-primary btn-sm" data-toast="Opens Facebook to renew access for Northpaw. Everything you have stays.">Reconnect Facebook</button>` : `<button class="btn btn-secondary btn-sm" data-toast="We've asked Dana Wells and Jordan Lee to reconnect Northpaw">Ask an owner to reconnect</button>`);
  }
  function notConnected(a, c) {
    const waiting = D.decisions.filter((d) => d.acct === a.id);
    const action = c.role === "owner" ? `<button class="btn btn-primary" data-toast="Opens Facebook Login for Business: pick Peak Outdoors and grant read access. The audit starts the moment it's connected.">Connect with Facebook</button>` : `<button class="btn btn-primary" data-toast="We've asked Dana Wells and Jordan Lee to connect Peak Outdoors">Ask your owner to connect</button>`;
    return empty(`Connect ${esc(a.name)} to start its audit`,
      `<p style="margin:4px 0 8px;max-width:64ch">Once it's connected, this page fills in on its own: health checks in about <span class="num">4</span> minutes, <span class="num">12</span> months of change history and results within the hour, and the market research the same day. Grading starts the next morning.</p>
      ${waiting.length ? `<p class="small muted" style="margin:0 0 12px">${num(waiting.length)} decision logged by hand on this account (${esc(waiting[0].what.toLowerCase())}, ${esc(waiting[0].date)}) is waiting. It can be graded once the account is connected.</p>` : ""}
      ${c.role === "owner" ? "" : `<p class="small muted" style="margin:0 0 12px">Owners and admins connect accounts. Asking notifies them and shows on their Home.</p>`}`, action);
  }

  /* ---------- Performance ---------- */
  function rangeTile(k, val, vfmt, band, bfmt, extra = "") {
    const lo = band[0], hi = band[1], w = hi - lo, a = lo - w * 0.75, b = hi + w * 0.75, p = (q) => Math.max(2, Math.min(98, (q - a) / (b - a) * 100));
    const state = val > hi ? "<b>Above range</b>" : val < lo ? "<b>Below range</b>" : "Normal";
    return `<div class="tile"><div class="k">${k}</div><div class="v">${vfmt}</div><div class="ac-rng" aria-hidden="true"><span class="b" style="left:${p(lo)}%;width:${p(hi) - p(lo)}%"></span><span class="p" style="left:${p(val)}%"></span></div><div class="d">${state} <span class="muted">· range ${bfmt}${extra}</span></div></div>`;
  }
  function perfTiles(id) {
    const P = AD().perf[id], cpa = series(id, "cpa"), roas = series(id, "roas"), sp = series(id, "spend");
    const avg = (v, a, b) => v.slice(a, b).reduce((s, x) => s + x, 0) / (b - a);
    const c7 = avg(cpa, N - 7, N), cPrev = avg(cpa, N - 14, N - 7), r7 = avg(roas, N - 7, N), s7 = sp.slice(N - 7).reduce((s, x) => s + x, 0);
    const dC = c7 - cPrev, k = (v) => "$" + (v / 1000).toFixed(1) + "k";
    return `<div class="kpi">
      ${rangeTile("Spend, 7 days", s7, "$" + s7.toLocaleString("en-US"), [P.spend.band[0] * 7, P.spend.band[1] * 7], `${k(P.spend.band[0] * 7)}–${k(P.spend.band[1] * 7)}`)}
      ${rangeTile("CPA, 7 days", c7, "$" + c7.toFixed(2), P.cpa.band, METRIC.cpa.band(P.cpa.band), ` · ${dC >= 0 ? "▲" : "▼"} $${Math.abs(dC).toFixed(2)} vs last week`)}
      ${rangeTile("ROAS, 7 days", r7, r7.toFixed(2), P.roas.band, METRIC.roas.band(P.roas.band))}
      ${rangeTile("Frequency, 7 days", P.freq.v, P.freq.v.toFixed(1), P.freq.band, `${P.freq.band[0]}–${P.freq.band[1]}`)}
    </div>`;
  }
  function lookback(a, c) {
    const s = st(a.id), d = s.day, m = METRIC[s.metric], v = series(a.id, s.metric), band = AD().perf[a.id][s.metric].band;
    const list = acctDecisions(a.id, c.phase).filter((x) => x.idx <= d && x.idx >= d - 30);
    const val = v[d], where = val > band[1] ? `above the ${m.band(band)} range` : val < band[0] ? `below the ${m.band(band)} range` : `inside the ${m.band(band)} range`;
    const all = acctDecisions(a.id, c.phase).map((x) => x.idx);
    const prev = all.filter((i) => i < d)[0], next = all.filter((i) => i > d).slice(-1)[0];
    const rows = list.map((x) => {
      const p = x.who ? U.person(x.who) : null;
      const sub = x.status === "outside" ? `Outside your team · <span class="muted">Changed by someone not linked to CatchAll yet</span>` : `${esc(p ? p.name : "")} · ${x.status === "reason" ? `<span class="muted">no reason yet</span>` : x.reason ? `“${esc(x.reason)}”` : `<span class="muted">logged</span>`}`;
      return `<div class="ac-lrow${x.status === "reason" ? " need" : ""}">${U.lead(x)}<div><div class="ac-lt"><span class="mono small muted">${esc(x.date)}</span>${x.status === "reason" ? (D.decisions.some((y) => y.id === x.id) ? `<button class="btn btn-secondary btn-sm" data-drawer="addwhy" data-id="${esc(x.id)}">Add why</button>` : `<button class="btn btn-secondary btn-sm" data-go="log">Add why</button>`) : U.stamp(x)}</div><div style="font-size:13.5px"><b>${esc(x.what)}</b> ${esc(x.detail || "")} <span class="muted">· ${esc(x.camp)}</span></div><div class="small ac-i2">${sub}</div></div></div>`;
    }).join("");
    return `<aside class="panel ac-look" aria-label="Changes in the 30 days before ${dayLabel(d)}"><div class="ac-lt"><h3>30 days before ${dayLabel(d)}</h3><button class="linkbtn ac-lnk" data-a="lookclose">Close ✕</button></div>
      <p class="small muted" style="margin:2px 0 6px">${num(list.length)} change${list.length === 1 ? "" : "s"}, ${dayLabel(Math.max(0, d - 30))} – ${dayLabel(d)}. ${m.label} that day ${m.fmt(val)}, ${where}.</p>
      ${rows || `<p class="muted small" style="margin:10px 0">No changes in those 30 days. The movement came from somewhere else: season, competitors or Facebook.</p>`}
      <div class="ac-lfoot"><button class="btn btn-secondary btn-sm" data-go="log">Open in decision log →</button><span>${prev != null ? `<button class="linkbtn ac-lnk" data-a="day" data-v="${prev}">← Earlier change</button>` : ""}${next != null ? `${prev != null ? " · " : ""}<button class="linkbtn ac-lnk" data-a="day" data-v="${next}">Later change →</button>` : ""}</span></div></aside>`;
  }
  function stackbar(imp, wor, non, h = 14) { return `<div class="ac-stack" style="height:${h}px" aria-hidden="true"><span class="i" style="flex:${imp}"></span><span class="w" style="flex:${wor}"></span><span class="n" style="flex:${non}"></span></div>`; }
  function scoreTable(head, rows) {
    return `<div class="tablewrap ac-tw"><table><thead><tr><th>${head}</th><th class="r">Changes</th><th class="ac-hide-s"></th><th class="r">Improved</th><th class="r">Worse</th><th class="r">No clear effect</th></tr></thead><tbody>${rows.map(([n, t, i, w, x]) => `<tr><td style="white-space:nowrap">${esc(n)}</td><td class="r">${t}</td><td class="ac-hide-s" style="width:28%">${stackbar(i, w, x)}</td><td class="r">${pct(i, t)}%</td><td class="r">${pct(w, t)}%</td><td class="r">${pct(x, t)}%</td></tr>`).join("")}</tbody></table></div>`;
  }
  function scorecard(a, c) {
    const sc = AD().score[a.id];
    if (c.phase === "day1") {
      return `<div class="sec ac-sec">${sech("What your changes did", `<span class="small muted">12 months · from change history</span>`)}
      ${empty("Arrives with your first grades", `<p style="margin:6px 0;max-width:62ch">We've already pulled <b class="num">${sc.total}</b> changes from the last 12 months. When your first grades land on Oct 30, this shows what happened after each one: improved beyond the account's normal noise, got worse, or no clear effect, by change type and by buyer. We'll tell you here and by email the day it's ready.</p><p class="small muted" style="margin:0 0 10px">Changes with a reason are easier to learn from later. ${num(sc.noReason)} of the ${num(sc.total)} don't have one yet.</p>`, `<button class="btn btn-primary" data-go="log">Add reasons to past changes</button>`)}</div>`;
    }
    const li = (x, stamp) => `<div class="li ac-li3">${x.thumb != null ? thumbN(x.thumb) : U.ctype(x.type)}<div><div class="w"><b>${esc(x.what)}</b> ${esc(x.detail)}</div><div class="s">${esc(x.sub)} · ${x.day != null ? `<button class="linkbtn ac-lnk" data-a="seechart" data-v="${x.day}">See on chart</button>` : toastBtn("See on chart", "Opens the chart at that date with the 12-month range")}</div></div>${stamp}</div>`;
    return `<div class="sec ac-sec">${sech("What your changes did", `<span class="small muted">12 months · from change history · ${toastBtn("How this is worked out", "Each change is compared with the account's normal range over the 7 and 14 days after it. Overlapping changes share one result.")}</span>`)}
      <div class="panel" style="margin-top:10px">
        <p class="ac-headline">${num(sc.total)} changes in 12 months. After ${num(pct(sc.imp, sc.total) + "%")} performance improved beyond the account's normal noise, after ${num(pct(sc.wor, sc.total) + "%")} it got worse, and after ${num(pct(sc.non, sc.total) + "%")} there was no clear effect.</p>
        <p class="small muted" style="margin:0 0 12px;max-width:80ch">This shows what happened after each change, not whether it was right: nobody made a prediction for these. ${num(sc.overlap)} changes overlapped another within 7 days; overlapping changes share one result, so none of them can take the credit alone.</p>
        ${stackbar(sc.imp, sc.wor, sc.non, 22)}
        <div class="legend"><span><i class="ac-li-i"></i>▲ Improved beyond noise · ${num(sc.imp)}</span><span><i class="ac-li-w"></i>▼ Got worse beyond noise · ${num(sc.wor)}</span><span><i class="ac-li-n"></i>No clear effect (inside the normal range) · ${num(sc.non)}</span></div>
        <div class="ac-two" style="margin-top:18px"><div><div class="ac-cap">By change type</div>${scoreTable("Type", sc.types)}</div>${sc.buyers ? `<div><div class="ac-cap">By buyer</div>${scoreTable("Buyer", sc.buyers)}</div>` : ""}</div>
        ${sc.best ? `<div class="ac-two" style="margin-top:18px"><div><div class="ac-cap">Changes followed by the best results</div>${sc.best.map((x) => li(x, `<span class="stamp ref">▲ Improved <span class="m">beyond noise</span></span>`)).join("")}</div><div><div class="ac-cap">Changes followed by the worst results</div>${sc.worst.map((x) => li(x, `<span class="stamp ref">▼ Got worse <span class="m">beyond noise</span></span>`)).join("")}</div></div>` : ""}
        <p class="small muted" style="margin:14px 0 0">Every number here comes from the grading code (7 and 14 day windows, this account's normal range). The sentences are written from those numbers.</p>
      </div></div>`;
  }
  function performance(a, c) {
    const s = st(a.id); if (s.day == null) s.day = defaultDay(a.id, s.metric);
    const m = METRIC[s.metric], band = AD().perf[a.id][s.metric].band, open = s.day >= 0;
    return `<div class="ctrls ac-ctrls">${seg("metric", [["cpa", "CPA"], ["roas", "ROAS"], ["spend", "Spend"]], s.metric, "Metric")}<span class="sp"></span><span class="muted small">Last 12 weeks · days in ${esc(a.tz)} time</span></div>
      ${perfTiles(a.id)}
      <div class="ac-sideby${open ? "" : " closed"}">
        <div class="chart ac-chart"><div class="ac-lt" style="margin-bottom:6px"><h3>${m.label} by day</h3><span class="small muted">Click a day or a tick to see the 30 days of changes before it</span></div>
          <div class="ac-canvas" data-chart="perf" data-acct="${a.id}" style="min-height:236px"></div>
          <div class="legend"><span><i style="background:var(--band);outline:1px solid var(--band-edge)"></i>Normal range ${m.band(band)}</span><span><i style="background:var(--ink);width:3px"></i>Change, logged</span><span><i style="background:var(--action);width:3px"></i>Change, needs a reason</span><span><i style="outline:1px solid var(--muted)"></i>Changed outside your team</span>${m.dir ? `<span><i style="background:var(--miss);border-radius:50%;width:10px"></i>Worse than the range</span><span><i style="background:var(--hit);border-radius:50%;width:10px"></i>Better than the range</span>` : `<span><i style="border:1.5px solid var(--ink);border-radius:50%;width:10px"></i>Outside the range</span>`}</div>
        </div>
        ${open ? lookback(a, c) : ""}
      </div>
      ${scorecard(a, c)}`;
  }

  /* ---------- Health ---------- */
  function health(a, c) {
    const h = AD().health[a.id], s = st(a.id), names = Object.keys(h.trend); if (!s.trend) s.trend = names[0];
    const tv = h.trend[s.trend];
    const kv = (rows) => `<div class="ac-kv">${rows.map(([k, v, d, u]) => `<div><div class="small muted">${esc(k)}</div><div class="v num">${esc(v)}${u ? `<span class="vu">${esc(u)}</span>` : ""}</div><div class="d">${esc(d)}</div></div>`).join("")}</div>`;
    const ver = c.phase === "day1" ? "First computed today, refreshed weekly." : "First computed Sep 21, refreshed weekly.";
    return `<div class="banner info ac-hb"><span class="small"><b>${ver}</b> This version ${c.phase === "day1" ? "Oct 23" : "Oct 20"} · next Oct 27. Earlier weeks are filled in from your 12 months of history so trends work from day one.</span>
      <span class="ac-trend"><span class="small muted">Trend:</span>${sel("ac-trend-" + a.id, "Trend to show", names.map((n) => [n, n]), s.trend, `data-a="trend"`)}${spark(tv, 140, 28, "var(--c1)")}<span class="small muted" style="white-space:nowrap">${num(tv.length)} weeks</span></span></div>
      <div class="sec">${sech(`Worth looking at · ${h.worth.length}`, lb("All in Suggestions →", `data-go="acct-${a.id}-suggestions"`))}
        ${h.worth.length ? h.worth.map((w) => `<div class="li">${U.ctype(w.type)}<div><div class="w"><b>${esc(w.b)}</b> ${esc(w.t)}</div><div class="s">${esc(w.s)}</div></div><button class="btn btn-secondary btn-sm" data-go="acct-${a.id}-suggestions">In Suggestions →</button></div>`).join("") : `<p style="margin:10px 0 0"><b>Nothing urgent this week.</b> <span class="muted">Nothing in this account cleared its noise band, which is a good result.</span></p>`}</div>
      <div class="sec">${sech("Creative diversity", toastBtn(`All ${h.activeAds} active ads →`, "Opens every active ad with its group, spend and age"))}
        <div class="panel" style="margin-top:10px"><p class="small muted" style="margin:0 0 8px">Active ads grouped by how alike they look, with each group's share of the last 30 days' spend.</p>
          <div class="ac-stack" style="height:20px" aria-hidden="true">${h.clusters.map((cl, i) => `<span style="flex:${cl[2]};background:var(--c${i + 1})"></span>`).join("")}</div>
          ${h.clusters.map(([n, ads, share, th], i) => `<div class="ac-crow"><span><span class="adot" style="background:var(--c${i + 1})"></span>${esc(n)}</span><span class="small muted">${num(ads)} ads</span><span class="ac-cbar"><b class="num">${share}%</b><span class="t"><span style="width:${Math.min(100, share * 2)}%;background:var(--c${i + 1})"></span></span></span><span class="ac-cth">${th.map((t) => thumbN(t)).join("")}</span></div>`).join("")}
          ${kv(h.divKv)}
          <p class="small muted" style="margin:10px 0 0">Group names are written by AI from the images. The grouping and every number come from code.</p></div></div>
      <div class="sec">${sech("Creative health", toastBtn("Gallery →", "Opens every ad in this account, newest first, with spend and CPA"))}
        <div class="panel" style="margin-top:10px">${kv(h.crKv).replace("ac-kv", "ac-kv flush")}
          <div class="ac-cap" style="margin:14px 0 8px">Top 4 and bottom 4 by spend-weighted CPA, last 30 days</div>
          <div class="ac-gal g8">${h.gallery.map(([t, cpa, spend, days, pos]) => `<div><span class="im" style="background:${D.thumbs[t % D.thumbs.length]}" aria-hidden="true"></span><div class="c"><b class="num">${cpa}</b> CPA · ${num(spend)}<br>${num(days)} days running · ${pos}</div></div>`).join("")}</div></div></div>
      <div class="sec">${sech("Saturation, from rolling reach", toastBtn("By campaign →", "Shows the same chart for each campaign"))}
        <div class="panel" style="margin-top:10px"><div class="ac-canvas" data-chart="reach" data-acct="${a.id}" style="min-height:212px"></div>
          <div class="legend"><span><i style="background:var(--c1)"></i>New people reached per $1k (left)</span><span><i style="background:var(--c6);height:3px"></i>Frequency, monthly (right)</span></div>
          ${kv(h.satKv)}
          <p class="small muted" style="margin:10px 0 0">Facebook keeps reach for about 13 months. CatchAll saves it every month, so this chart keeps growing instead of losing its oldest month.</p></div></div>
      <div class="sec">${sech("Account basics", `<span class="small muted">kept short on purpose</span>`)}
        ${h.basics.map(([t, s2, r]) => `<div class="li ac-basic"><div><div class="w"><b>${esc(t)}</b></div><div class="s">${esc(s2)}</div></div><span class="small">${r}</span>${toastBtn("details →", t + ": the month-by-month detail opens here")}</div>`).join("")}</div>`;
  }

  /* ---------- Market ---------- */
  function insightList(a, ver) {
    const M = AD().market[a.id], v1 = M.v1; let list = M.insights.map(([code, text, basis]) => ({ code, text, basis }));
    if (ver === "v1") {
      list = list.filter((x) => !v1.added.includes(x.code)).map((x) => v1.changed[x.code] ? { ...x, text: v1.changed[x.code][0], basis: x.basis.replace("Oct", "Sep"), stale: x.code === M.note.affects } : x);
      list = list.concat(v1.removed.map(([code, text, basis]) => ({ code, text, basis: "from 4 quotes" })));
    }
    return list.map((x) => ({ ...x, type: x.code.slice(0, 2) }));
  }
  const insightRow = (x, extra = "", strike = false) => `<div class="q inf"><span class="glyph">◇</span><div><div class="txt"><b>${esc(x.code)}</b> ${strike ? `<span class="ac-was">${esc(x.text)}</span>` : esc(x.text)}</div>${extra}<div class="small muted">${esc(AD().insightTypes[x.type] || "")} · ${esc(x.basis)} · ${ev("inf")}${x.stale ? ` · <span class="ac-warn"><b>Out of date:</b> the Oct 19 change note says otherwise; v2 updated it</span>` : ""}</div></div></div>`;
  function quoteRow(q, opts = {}) {
    const [who, text, segN, plat, date, theme, n] = q;
    if (who === "inf") return `<div class="q inf"><span class="glyph">◇</span><div><div class="txt">${esc(text)}</div><div class="small muted">Written by the research from ${num(n)} quotes · ${esc(segN)} · ${ev("inf")}</div></div></div>`;
    return `<div class="q"><span class="glyph">“</span><div><div class="txt">${esc(text)}</div><div class="small muted">${esc(segN)} · ${esc(plat)} · ${toastBtn("thread", "Opens the source in a new tab")} · ${date ? esc(date) : "no date in source"} · ${esc(theme)} · ${ev("obs")}</div></div></div>`;
  }
  const PLURAL = { CT: "Truths", TN: "Tensions", CX: "Contradictions", BL: "Behaviour laws", LP: "Language", MY: "Myths", HS: "Horizon shifts" };
  const whoOf = (q) => q[0] === "inf" ? "cust" : q[0];
  function market(a, c, sub) {
    const M = AD().market[a.id], s = st(a.id), tot = M.totals;
    if (sub === "quotes") return allQuotes(a, c);
    if (sub === "compare") return compare(a, c);
    const sosSec = `<div class="sec">${sech("Share of search", seg("sos", [[12, "12 months"], [36, "3 years"]], s.sos, "Share of search range"))}
      <div class="chart" style="margin-top:10px"><p class="small muted" style="margin:0 0 6px">Each brand's share of branded searches across your ${c.phase === "day1" ? "proposed" : "confirmed"} competitor set, monthly.${c.phase === "day1" ? " Ready: search data arrived first." : ` ${esc(a.name)} is up ${num(M.sos.up)} points on a year ago.`}</p>
      <div class="ac-canvas" data-chart="sos" data-acct="${a.id}" style="min-height:208px"></div>
      <div class="legend">${M.sos.brands.map(([n, end, , col]) => `<span><i style="background:var(--${col})"></i>${esc(n)} <b class="num">${end}%</b></span>`).join("")}</div></div></div>`;
    if (c.phase === "day1") {
      return U.banner("info", `<b>Research is still arriving, usually within the hour.</b> Sections fill in as each part finishes. We'll email ${esc(viewer(c).name)} when it's all in.`, `<span class="small muted">Started 09:14 today</span>`)
        + `<div class="sec">${sech("This week's change note")}<p class="muted" style="margin:8px 0 0">The first change note comes on Monday, Oct 26, once there's a week of search and ad data to compare against.</p></div>`
        + sosSec
        + `<div class="sec">${sech("Market summary and what the category says")}${empty("The research is reading what people say", `<p style="margin:4px 0 10px;max-width:62ch">It gathers real quotes first, then writes the market summary from them. Each quote will show where it came from, and anything the research wrote itself is marked inferred.</p>
          <div class="ac-steps">${AD().day1Research.map(([t, n, k]) => `<div class="s ${k || "done"}">${k === "now" ? `<span class="skel" style="width:12px;height:12px;border-radius:50%;margin-top:4px"></span>` : k === "todo" ? "<span></span>" : U.icon("check")}<span>${k === "now" ? `<b>${esc(t)}</b>` : esc(t)}</span><span class="small muted">${esc(n)}</span></div>`).join("")}</div>
          <p class="small muted" style="margin:10px 0">The research uses your competitor set. Confirming it now makes the next part more accurate.</p>`, `<button class="btn btn-secondary" data-go="acct-${a.id}-competitors">Confirm your competitors</button>`)}</div>`;
    }
    /* change note */
    const note = `<div class="sec">${sech(`This week's change note · ${esc(M.note.date)}`, `<span class="small">${pill("Verified")} <span class="muted">· checked against 2 sources</span></span>`)}
      <div class="panel ac-two" style="margin-top:10px"><div><p style="margin:0 0 6px">${M.note.text}</p><p class="small muted" style="margin:0">Sources: Google search volume (DataForSEO), Meta Ad Library. Every number is computed in code; the wording is written by AI.</p></div>
      ${M.note.affects ? `<div class="claim"><b>Affects ${esc(M.note.affects)}</b> “${esc(M.note.affectsText)}” in the market summary. Run again on Oct 20 updated it in v2.<div class="small muted" style="margin-top:6px">${M.note.also ? `Also touches ${esc(M.note.also)} · ` : ""}${ev("inf")} · <button class="linkbtn ac-lnk" data-a="cmpopen">See what changed</button></div></div>` : `<div class="claim">Nothing in the market summary is affected this week.<div class="small muted" style="margin-top:6px">${ev("inf")}</div></div>`}</div></div>`;
    /* search volume */
    const kw = M.kw, kwSec = `<div class="sec">${sech("Category search volume", toastBtn(`All ${kw.total} keywords →`, "Opens every tracked keyword with its monthly volume"))}
      <div class="ac-kwgrid"><div class="tablewrap"><table><thead><tr><th>Keyword group</th><th class="r">Keywords</th><th class="r">Avg a month, 12 mo</th><th class="r">Year on year</th><th>Last 3 months</th><th>12 months</th></tr></thead><tbody>
      ${kw.rows.map(([g, ex, n, avg, yoy, dir, tr]) => { const pts = Array.from({ length: 12 }, (_, i) => 10 + tr * i * 1.4 + Math.sin(i * 1.7 + n) * 1.6); return `<tr><td><b>${esc(g)}</b><div class="small muted">${esc(ex)}</div></td><td class="r">${n}</td><td class="r">${avg}</td><td class="r">${yoy}</td><td style="white-space:nowrap">${dir}</td><td>${spark(pts, 100, 24, "var(--c1)")}</td></tr>`; }).join("")}</tbody></table></div>
      <div class="tile"><div class="k">Market sophistication index</div><div class="v" style="font-size:32px">${kw.soph}</div><div class="d">Solution searches ÷ problem searches. ${+kw.soph < 1 ? "Low means most buyers still search for the problem, not a named fix, so problem-first ads tend to fit." : "Above 1 means buyers search for named fixes more than the problem, so solution and proof ads tend to fit."} Was ${kw.sophWas} a year ago.</div></div></div></div>`;
    /* summary with version picker */
    const list = insightList(a, s.ver), counts = {}; list.forEach((x) => { counts[x.type] = (counts[x.type] || 0) + 1; });
    const shown = list.filter((x) => !s.itype || x.type === s.itype), lim = s.showAll || s.itype ? shown : shown.slice(0, 6);
    const vers = M.versions;
    const sumSec = `<div class="sec">${sech("Market summary", `<span class="ac-inline">${sel("ac-ver-" + a.id, "Research version", vers.map(([v, d], i) => [v, `${v} · ${d}${i === 0 ? " (latest)" : ""}`]), s.ver, `data-a="ver"`)}<button class="btn btn-secondary btn-sm" data-a="cmpopen">Compare ${s.ver === "v2" ? "with v1" : "with v2"}</button></span>`)}
      ${s.ver !== "v2" ? `<p class="small muted" style="margin:8px 0 0">Showing ${esc(vers[1][0])} from ${esc(vers[1][1])} (${esc(vers[1][2])}). The latest is ${esc(vers[0][0])}.</p>` : ""}
      <div class="ac-chips" role="group" aria-label="Insight type">${chip("itype", "", `All ${list.length}`, !s.itype)}${Object.keys(AD().insightTypes).filter((t) => counts[t]).map((t) => chip("itype", t, `${PLURAL[t]} ${counts[t]}`, s.itype === t)).join("")}</div>
      <div class="panel qlist ac-ql">${lim.map((x) => insightRow(x)).join("")}</div>
      ${!s.itype && shown.length > 6 ? `<button class="linkbtn ac-lnk" style="margin-top:6px" data-a="showall">${s.showAll ? "Show fewer" : `Show all ${shown.length}`}</button>` : ""}</div>`;
    /* meta + season */
    const two = `<div class="ac-two"><div class="sec">${sech("Meta and platform changes", toastBtn("All →", "Opens every Meta change we've tracked since January"))}${AD().metaChanges.map(([d, t]) => `<div class="li ac-dl"><span class="mono small muted">${d}</span><div class="w">${esc(t)}</div>${toastBtn("source", "Opens Meta's announcement in a new tab")}</div>`).join("")}</div>
      <div class="sec">${sech("Season", `<span class="small muted">${esc(a.tz)} time</span>`)}${M.season.map(([d, t, s2, n]) => `<div class="li ac-dl"><span class="mono small muted">${d}</span><div><div class="w">${esc(t)}</div>${s2 ? `<div class="s">${esc(s2)}</div>` : ""}</div><span class="small">in ${num(n)} days</span></div>`).join("")}</div></div>`;
    /* what the category says */
    const qs = M.quotes.filter((q) => whoOf(q) === s.who).filter((q) => (!s.theme || q[5] === s.theme) && (!s.plat || q[3] === s.plat) && (!s.seg || q[2] === s.seg) && (!s.ev || (s.ev === "obs" ? q[0] !== "inf" : q[0] === "inf")));
    const pool = M.quotes.filter((q) => whoOf(q) === s.who), plats = [...new Set(pool.filter((q) => q[0] !== "inf").map((q) => q[3]))], segsOf = [...new Set(pool.map((q) => q[2]))];
    const themes = M.themes[s.who] || [];
    const says = `<div class="sec">${sech("What the category says", `<button class="linkbtn ac-lnk" data-go="acct-${a.id}-market-quotes">All ${num(tot.quotes)} quotes · ${num(tot.inferred)} inferred claims →</button>`)}
      <div class="ctrls ac-ctrls" style="margin:8px 0 4px">${seg("who", [["cust", "Customers"], ["gate", "Gatekeepers"], ["ind", "Industry"]], s.who, "Who is speaking")}
        ${sel("ac-plat-" + a.id, "Platform", [["", "Platform: all"]].concat(plats.map((p) => [p, p])), s.plat, `data-a="plat"`)}
        ${sel("ac-seg-" + a.id, s.who === "cust" ? "Segment" : "Speaker", [["", s.who === "cust" ? "Segment: all" : "Speaker: all"]].concat(segsOf.map((p) => [p, p])), s.seg, `data-a="qseg"`)}
        ${sel("ac-ev-" + a.id, "Evidence", [["", "Observed and inferred"], ["obs", "Observed only"], ["inf", "Inferred only"]], s.ev, `data-a="qev"`)}</div>
      <div class="ac-chips" role="group" aria-label="Theme">${chip("theme", "", s.who === "cust" ? `${num(tot.quotes)} quotes · ${num(tot.inferred)} inferred claims` : `All ${num(themes.reduce((x, t) => x + t[1], 0))}`, !s.theme)}${themes.map(([t, n]) => chip("theme", t, `${esc(t)} ${n}`, s.theme === t)).join("")}</div>
      <div class="panel qlist ac-ql">${qs.length ? qs.slice(0, 6).map((q) => quoteRow(q)).join("") : `<p class="muted" style="margin:12px 0">No quotes match these filters on this page. ${lb("Clear filters", `data-a="qclear"`)}</p>`}</div>
      <p class="small muted" style="margin:6px 0 0">${num(tot.quotes)} quotes and ${num(tot.inferred)} inferred claims from ${num(tot.sources)} threads, reviews and comment sections. The quotes are observed (real, linked to where they were said); the inferred claims are written by the research, not quotes. Real quotes are set in serif; the research's own words never are.</p></div>`;
    return note + sosSec + kwSec + sumSec + two + says;
  }
  function allQuotes(a, c) {
    const M = AD().market[a.id], s = st(a.id), tot = M.totals;
    if (!s.qf) s.qf = { who: "cust", obs: true, inf: true, themes: [], segs: [], plats: [] };
    const f = s.qf, pool = M.quotes.filter((q) => whoOf(q) === f.who);
    const themes = [...new Set(pool.map((q) => q[5]))], segsOf = [...new Set(pool.map((q) => q[2]))], plats = [...new Set(pool.filter((q) => q[0] !== "inf").map((q) => q[3]))];
    let list = pool.filter((q) => (q[0] === "inf" ? f.inf : f.obs) && !f.themes.includes(q[5]) && !f.segs.includes(q[2]) && (q[0] === "inf" || !f.plats.includes(q[3])));
    const ord = (q) => { const d = q[4]; if (!d) return -1; const [m, y] = d.split(" "); return +y * 12 + MON.indexOf(m); };
    list = list.slice().sort((x, y) => s.qsort === "new" ? (ord(y) - ord(x)) || 0 : (ord(x) < 0 ? 1 : ord(y) < 0 ? -1 : ord(x) - ord(y)));
    const cb = (grp, v, label, on) => { const id = `ac-qf-${grp}-${String(v).replace(/[^a-z0-9]/gi, "")}`; return `<div class="ac-cb"><input type="checkbox" id="${id}" data-a="qf" data-g="${grp}" data-v="${esc(v)}"${on ? " checked" : ""}><label for="${id}">${esc(label)}</label></div>`; };
    const countOf = (k, v) => pool.filter((q) => q[k] === v).length;
    const whoN = { cust: tot.who.cust, gate: tot.who.gate, ind: tot.who.ind };
    return `<button class="linkbtn ac-back" data-go="acct-${a.id}-market">← Market</button>
      <div class="titlebar ac-tb"><h2>What the category says · ${num(tot.quotes)} quotes · ${num(tot.inferred)} inferred claims</h2><span class="ac-inline">${sel("ac-qsort-" + a.id, "Sort", [["new", "Sort: newest first"], ["old", "Sort: oldest first"]], s.qsort, `data-a="qsort"`)}<span class="small muted">Research ${esc(M.versions[0][0])} · ${esc(M.versions[0][1])}</span></span></div>
      <div class="ac-qgrid"><div class="panel ac-filters">
        <div class="ac-cap">Who</div><div class="ac-chips">${[["cust", "Customers"], ["gate", "Gatekeepers"], ["ind", "Industry"]].map(([k, l]) => chip("qwho", k, `${l} ${whoN[k]}`, f.who === k)).join("")}</div>
        <div class="ac-cap">Evidence</div>${cb("ev", "obs", `Observed ${pool.filter((q) => q[0] !== "inf").length}`, f.obs)}${cb("ev", "inf", `Inferred ${pool.filter((q) => q[0] === "inf").length}`, f.inf)}
        <div class="ac-cap">Theme</div>${themes.map((t) => cb("themes", t, `${t} ${countOf(5, t)}`, !f.themes.includes(t))).join("")}
        <div class="ac-cap">${f.who === "cust" ? "Segment" : "Speaker"}</div>${segsOf.map((t) => cb("segs", t, `${t} ${countOf(2, t)}`, !f.segs.includes(t))).join("")}
        ${plats.length ? `<div class="ac-cap">Platform</div>${plats.map((t) => cb("plats", t, `${t} ${countOf(3, t)}`, !f.plats.includes(t))).join("")}` : ""}
        <p class="small muted" style="margin:10px 0 0">${num(pool.filter((q) => q[0] !== "inf" && !q[4]).length)} on this page have no date in their source</p></div>
      <div><div class="small muted" style="margin-bottom:6px">Showing ${num(list.length)} on page 1 of ${num(whoN[f.who])} · ${s.qsort === "new" ? "newest first" : "oldest first"}, undated quotes last</div>
        <div class="panel qlist ac-ql">${list.length ? list.map((q) => quoteRow(q)).join("") : `<p class="muted" style="margin:12px 0">Nothing matches. Tick a box on the left to bring quotes back.</p>`}</div>
        <div class="ctrls" style="margin-top:10px"><span class="small muted">Page 1 of ${num(Math.max(1, Math.ceil(whoN[f.who] / 20)))}</span><span class="sp"></span>${whoN[f.who] > 20 ? `<button class="btn btn-secondary btn-sm" data-toast="Loads the next 20 quotes with the same filters">Next 20 →</button>` : ""}</div></div></div>`;
  }
  function compare(a, c) {
    const M = AD().market[a.id], s = st(a.id), v1 = M.v1, vers = M.versions.map(([v, d]) => [v, `${v} · ${d}`]);
    const head = `<button class="linkbtn ac-back" data-go="acct-${a.id}-market">← Market</button>
      <div class="titlebar ac-tb"><h2>Market summary · ${esc(s.cmpTo)} compared with ${esc(s.cmpFrom)}</h2><span class="ac-inline">${sel("ac-cf-" + a.id, "Compare from", vers, s.cmpFrom, `data-a="cmpfrom"`)}<span class="muted" aria-hidden="true">→</span>${sel("ac-ct-" + a.id, "Compare to", vers, s.cmpTo, `data-a="cmpto"`)}</span></div>`;
    if (s.cmpFrom === s.cmpTo) return head + `<p class="muted">Both sides are ${esc(s.cmpTo)}. Pick a different version on one side to see what changed.</p>`;
    const fwd = s.cmpTo === "v2";
    const newL = insightList(a, "v2"), oldL = insightList(a, "v1"), byOld = {}; oldL.forEach((x) => { byOld[x.code] = x; });
    const fromL = fwd ? oldL : newL, toL = fwd ? newL : oldL, fromBy = {}; fromL.forEach((x) => { fromBy[x.code] = x; });
    const toBy = {}; toL.forEach((x) => { toBy[x.code] = x; });
    const added = toL.filter((x) => !fromBy[x.code]), removed = fromL.filter((x) => !toBy[x.code]), changed = toL.filter((x) => fromBy[x.code] && fromBy[x.code].text !== x.text), same = toL.filter((x) => fromBy[x.code] && fromBy[x.code].text === x.text);
    const why = (x, kind) => { if (!fwd) return x.basis; if (kind === "changed") return "why: " + v1.changed[x.code][1]; if (kind === "removed") return "why: " + (v1.removed.find((r) => r[0] === x.code) || [, , x.basis])[2]; return "why: " + x.basis; };
    const k = s.cmpKind, row = (x, kind) => insightRow({ ...x, basis: why(x, kind), stale: false }, kind === "changed" ? `<div class="small" style="margin-top:2px"><span class="muted">Was in ${esc(s.cmpFrom)}:</span> <span class="ac-was">${esc(fromBy[x.code].text)}</span></div>` : "", kind === "removed");
    const block = (label, arr, kind) => (k === "all" || k === kind) && arr.length ? `<div class="sec">${sech(`<span class="ac-chg">${label}</span> ${arr.length}`)}<div class="qlist">${arr.map((x) => row(x, kind)).join("")}</div></div>` : "";
    return head + `<p class="muted" style="margin:0 0 12px">${fwd ? `${esc(s.cmpTo)} came from ${esc(M.versions[0][2])} on ${esc(M.versions[0][1])}.` : `Looking back from ${esc(s.cmpFrom)} to ${esc(s.cmpTo)}.`} ${added.length} added, ${changed.length} changed, ${removed.length} removed; the other ${same.length} insights are the same in both.</p>
      <div class="ctrls ac-ctrls">${seg("cmpkind", [["all", `All changes ${added.length + changed.length + removed.length}`], ["added", `Added ${added.length}`], ["changed", `Changed ${changed.length}`], ["removed", `Removed ${removed.length}`]], k, "Which changes")}${seg("cmpall", [["0", "Hide unchanged"], ["1", `Show all ${toL.length}`]], s.cmpAll ? "1" : "0", "Unchanged insights")}</div>
      ${block("Added", added, "added")}${block("Changed", changed, "changed")}${block("Removed", removed, "removed")}
      ${s.cmpAll ? `<div class="sec">${sech(`<span class="ac-chg">Same in both</span> ${same.length}`)}<div class="qlist">${same.map((x) => insightRow({ ...x, stale: false })).join("")}</div></div>` : ""}
      <p class="small muted">Added, changed and removed are neutral labels: a changed insight is not a hit or a miss.</p>`;
  }

  /* ---------- Competitors ---------- */
  function competitors(a, c) {
    const C = AD().comp[a.id], s = st(a.id);
    const v1Brands = a.id === "acme" ? [["Lumen Labs", "c2"], ["Verity Skin", "c3"], ["Halcyon", "c4"], ["Pure Theory", "c5"], ["Glowfield", "c6"]] : null;
    const brands = s.setVer === "v1" && v1Brands ? v1Brands : C.set.brands;
    const sayList = (C.say[s.sayKind] || []).filter((x) => !s.sayComp || x[0] === s.sayComp);
    const comps = [...new Set(Object.values(C.say).flat().map((x) => x[0]))];
    const sayBody = s.sayKind === "switching"
      ? `<div class="tablewrap"><table><thead><tr><th>From</th><th>To</th><th>Why they switched</th><th>In their words</th></tr></thead><tbody>${sayList.map(([f, t, w, q]) => `<tr><td>${esc(f)}</td><td>${esc(t)}</td><td>${esc(w)}</td><td><span class="ac-qa">“${esc(q)}”</span> ${ev("obs")}</td></tr>`).join("") || `<tr><td colspan="4" class="muted">No switching quotes for this competitor yet.</td></tr>`}</tbody></table></div>`
      : `<div class="panel qlist ac-ql">${sayList.map(([who, q, src]) => `<div class="q"><span class="glyph">“</span><div><div class="txt">${esc(q)}</div><div class="small muted">${esc(who)} · ${esc(src)} · ${toastBtn("source", "Opens the source in a new tab")} · ${ev("obs")}</div></div></div>`).join("") || `<p class="muted" style="margin:12px 0">Nothing for this competitor in this view yet.</p>`}</div>`;
    return `<div class="sec">${sech(`This week · ${C.changes.length} competitors changed`, `<span class="small muted">${C.week} · from the Meta Ad Library</span>`)}
      ${C.changes.map(([n, col, t, th, p, link]) => `<div class="li ac-cw"><b><span class="adot" style="background:var(--${col})"></span>${esc(n)}</b><div><div class="w">${t}</div>${th.length || link ? `<div class="s ac-th24">${th.map((i) => thumbN(i, "ac-t24")).join("")} ${link ? toastBtn(esc(link), link.includes(".") ? "Opens the landing page in a new tab" : "Opens all of this week's new ads from " + n) : ""}</div>` : ""}</div>${pill(p)}</div>`).join("")}</div>
      <div class="sec">${sech("Winning ad patterns", toastBtn(`All ${C.totalAds} competitor ads →`, "Opens every competitor ad, longest running first"))}
        <p class="small muted" style="margin:6px 0 8px">Days running stands in for “working”: advertisers rarely keep paying for an ad that loses. Hook types are labelled by AI from the ads; counts and days come from code.</p>
        <div class="ac-two"><div class="tablewrap"><table><thead><tr><th>Hook type</th><th>Who uses it</th><th class="r">Active ads</th><th class="r">Longest run</th></tr></thead><tbody>${C.hooks.map(([h, w, n, d]) => `<tr><td><b>${esc(h)}</b></td><td class="tn" style="white-space:normal">${esc(w)}</td><td class="r">${n}</td><td class="r ac-sans" style="white-space:nowrap">${num(d)} days</td></tr>`).join("")}</tbody></table></div>
        <div><div class="ac-cap" style="margin-bottom:8px">Ad gallery · longest running first</div><div class="ac-gal g4">${C.gallery.map(([t, d, who, hook]) => `<div><span class="im" style="background:${D.thumbs[t % D.thumbs.length]}" aria-hidden="true"></span><div class="c"><b class="num">${d}</b> <b>days</b> running<br>${esc(who)} · ${esc(hook)}</div></div>`).join("")}</div></div></div></div>
      <div class="sec">${sech("White space", toastBtn(`All ${C.whiteTotal} gaps →`, "Opens every gap the research found, with its evidence"))}
        ${C.white.map(([p, b, t, src, code]) => `<div class="li ac-ws">${pill(p)}<div><div class="w"><b>${esc(b)}</b> ${esc(t)}</div><div class="s">${esc(src)} · ${ev("inf")}</div></div>${toastBtn(code, code + ": the full gap with every quote and ad behind it")}</div>`).join("")}</div>
      <div class="sec">${sech("What people say about competitors", toastBtn(`All ${C.sayTotal} →`, "Opens every competitor quote with filters"))}
        <div class="ctrls ac-ctrls" style="margin:8px 0 6px">${seg("say", [["criticism", "Criticism"], ["switching", "Switching"], ["assets", "Brand assets"], ["substitutes", "Substitutes"]], s.sayKind, "Kind of quote")}${sel("ac-sayc-" + a.id, "Competitor", [["", "Competitor: all"]].concat(comps.map((x) => [x, x])), s.sayComp, `data-a="saycomp"`)}</div>
        ${sayBody}</div>
      <div class="sec">${sech("Competitor set", `<span class="ac-inline">${v1Brands ? sel("ac-setv-" + a.id, "Competitor set version", [["cur", C.set.ver], ["v1", "v1 · proposed Sep 21 by the research"]], s.setVer, `data-a="setver"`) : `<span class="small muted">${esc(C.set.ver)}</span>`}<button class="btn btn-secondary btn-sm" data-toast="Editing opens the set with suggestions from the research. Saving makes a new version; the next run uses it.">Edit set</button></span>`)}
        <div class="ac-brands">${brands.map(([n, col]) => `<span><span class="adot" style="background:var(--${col})"></span>${esc(n)}</span>`).join("")}${C.set.more && s.setVer !== "v1" ? `<span class="muted" title="${esc(C.set.more)}">+1 more</span>` : ""}</div>
        <p class="small muted" style="margin:0">${s.setVer === "v1" ? "The first set, proposed by the research before anyone confirmed it. Glowfield was swapped for Dermaclear in v2." : esc(C.set.note)}</p></div>`;
  }

  /* ---------- Audience ---------- */
  function audience(a, c, sub) {
    const A = AD().audience[a.id], segs = A.segs, cur = sub || "seg1";
    const mseg = AD().market[a.id].segs, tabs = segs.map((sg, i) => [`seg${i + 1}`, `SEG-${i + 1} ${mseg[i]}`]).concat([["demand", "Demand constellations"], ["buyers", "Your buyers"]]);
    const bar = `<div class="subtabs ac-subtabs" role="group" aria-label="Audience views">${tabs.map(([k, l], i) => `${i === segs.length ? `<span class="ac-gap" aria-hidden="true"></span>` : ""}<button data-go="acct-${a.id}-audience-${k}" class="${k === cur ? "on" : ""}"${k === cur ? ' aria-current="true"' : ""}>${esc(l)}</button>`).join("")}<span class="sp"></span><span class="small muted">${esc(A.ver)}</span>${toastBtn("Compare with the last version", "Shows which segments were added, changed or removed between research runs", "btn btn-secondary btn-sm")}</div>`;
    if (cur === "demand") return bar + `<p class="muted" style="margin:0 0 10px;max-width:80ch">Demand points grouped into what people want together, the segments each group fits, and how well competitors already cover it. Groupings and coverage are written by the research from quotes and competitor ads. ${ev("inf")}</p>
      <div class="tablewrap"><table><thead><tr><th>Constellation</th><th>Demand points</th><th>Segments</th><th>Competitor coverage</th><th>White space</th></tr></thead><tbody>${A.constellations.map(([n, dp, sg, cov, ws]) => `<tr><td><b>${esc(n)}</b></td><td class="tn" style="white-space:normal">${esc(dp)}</td><td style="white-space:nowrap">${esc(sg)}</td><td>${esc(cov)}</td><td>${pill(ws)}</td></tr>`).join("")}</tbody></table></div>`;
    if (cur === "buyers") {
      const B = A.buyers;
      return bar + `<div class="ac-two"><div class="panel"><h3>Who buys, by age and gender</h3><p class="small muted" style="margin:2px 0 8px">Share of purchases from Meta ads, last 90 days. Facebook reports this; it covers ${B.cover}% of purchases.</p>
        ${B.ages.map(([g, t, w, m]) => `<div class="ac-age"><span class="small">${g}</span><span class="ac-agebar" aria-hidden="true"><span style="width:${w * 1.9}%;background:var(--c1)"></span><span style="width:${m * 1.9}%;background:var(--c2)"></span></span><span class="small num">${t}%</span></div>`).join("")}
        <div class="legend"><span><i style="background:var(--c1)"></i>${B.split[0]} ${B.split[1]}%</span><span><i style="background:var(--c2)"></i>${B.split[2]} ${B.split[3]}%</span></div></div>
        <div class="panel"><h3>New vs returning customers</h3><div style="margin-top:10px;padding-top:12px;border-top:1px solid var(--rule-soft)"><b>Needs your Shopify store.</b><p class="small" style="margin:4px 0 10px">Connect Shopify and this shows the split of new and returning customers each month, and how much of your ad spend reaches people who already bought. It takes about 2 minutes, and history arrives within the hour.</p>
        ${c.role === "owner" ? `<button class="btn btn-secondary btn-sm" data-toast="Opens Shopify to install the CatchAll app (read-only orders and customers)">Connect Shopify</button>` : `<button class="btn btn-secondary btn-sm" data-toast="We've asked Dana Wells and Jordan Lee to connect Shopify">Ask your owner to connect Shopify</button>`}</div></div></div>`;
    }
    const i = Math.max(0, Math.min(segs.length - 1, (+cur.replace("seg", "") || 1) - 1)), g = segs[i];
    const dots = (n) => `<span class="ac-dots" aria-hidden="true">${"●".repeat(n)}<i>${"●".repeat(5 - n)}</i></span>`;
    const block = (title, html) => html ? `<div class="ac-blk"><div class="ac-cap">${title}</div>${html}</div>` : "";
    const ul = (arr, inf, raw) => arr.length ? `<ul>${arr.map((x) => `<li>${raw ? x : esc(x)}${inf ? " " + ev("inf") : ""}</li>`).join("")}</ul>` : "";
    const grid = (arr) => arr.length ? `<div class="ac-kgrid small">${arr.map(([k, v]) => `<b>${esc(k)}</b><span>${esc(v)}</span>`).join("")}</div>` : "";
    return bar + `<div class="panel ac-segp"><div class="ac-seghead"><div><h3 style="font-size:20px">SEG-${i + 1} · ${esc(g.name)}</h3><p style="margin:4px 0">${g.summary} ${ev("inf")}</p>${g.tensions ? `<p class="small muted" style="margin:0">Tensions they carry: ${esc(g.tensions)}. Not sized.</p>` : ""}</div>
        <div><div class="ac-aw"><span>Awareness</span>${dots(g.aw[0])}<b>${num(g.aw[0])} of ${num(5)}</b></div><div class="small muted" style="margin-bottom:6px">${esc(g.aw[1])}</div><div class="ac-aw"><span>Sophistication</span>${dots(g.so[0])}<b>${num(g.so[0])} of ${num(5)}</b></div><div class="small muted">${esc(g.so[1])}</div></div></div>
      <div class="ac-two"><div>${block("Pain points and fears", ul(g.pains))}${block("Misconceptions", ul(g.mis, true))}${block("Motivations", grid(g.mot))}${block("Demand points", ul(g.demand.map(([d, k]) => `${esc(d)} <span class="muted">· ${esc(k)}</span>`), false, true))}</div>
      <div>${block("Entry points and switching triggers", ul(g.entry.map(([k, v]) => `<b>${esc(k)}</b> ${esc(v)}`), false, true))}${block("How they decide", grid(g.decide))}
        ${block("In their words", `<div class="qlist">${g.quotes.map(([q, src]) => `<div class="q ac-q0"><span class="glyph">“</span><div><div class="txt">${esc(q)}</div><div class="small muted">${esc(src)} · ${toastBtn("thread", "Opens the source in a new tab")} · ${ev("obs")}</div></div></div>`).join("")}</div>${g.nq ? `<button class="linkbtn ac-lnk" data-a="segquotes" data-v="${i}">All ${g.nq} quotes from this segment →</button>` : ""}`)}
        ${block("This week · persona indicators", g.ind.length ? `<div class="ac-ind small">${g.ind.map(([k, v]) => `<span>${esc(k)}</span><b class="num">${esc(v)}</b>`).join("")}</div><p class="small muted" style="margin:8px 0 0">${pill("Approximation")} Measured on ${esc(g.comm)}, the communities this segment posts in, not on the segment itself.</p>` : `<p class="small muted" style="margin:0">${pill("Approximation")} Indicators start with Monday's report, measured on ${esc(g.comm)}.</p>`)}</div></div></div>`;
  }

  /* ---------- Suggestions ---------- */
  function suggestions(a, c) {
    const G = AD().suggestions[a.id], s = st(a.id), day1 = c.phase === "day1";
    const open = G.open.filter((x) => !s.removed.includes(x.id) && (!day1 || x.audit));
    const stampOf = (o) => o ? U.stamp(o) : `<span class="muted small">Skipped</span>`;
    const past = (day1 ? [] : G.past).slice();
    s.skipped.forEach((x) => past.unshift(x));
    return `<div class="sec">${sech(`Open · ${open.length}`, `<span class="small muted">Computed in code from data that cleared the noise band; worded by AI</span>`)}
      ${open.length ? open.map((x) => `<div class="li ac-sug">${U.ctype(x.type)}<div><div class="w"><b>${esc(x.b)}</b> ${esc(x.t)}</div><div class="s">${esc(day1 ? x.src.replace(/Oct \d+/, "Oct 23") : x.src)} · ${x.audit ? lb("see the numbers", `data-go="acct-${a.id}-health"`) : lb("see the numbers", `data-go="acct-${a.id}-reports"`)}</div></div><span class="ac-btns"><button class="btn btn-secondary btn-sm" data-a="doing" data-v="${x.id}">Doing this</button><button class="btn btn-ghost ac-ghost btn-sm" data-a="notnow" data-v="${x.id}">Not now</button></span></div>`).join("") + `<p class="small muted" style="margin:8px 0 0">Doing this opens the logging panel with the change filled in and the idea marked as coming from this suggestion.</p>`
        : empty("Nothing worth changing this week", `<p style="margin:4px 0 10px;max-width:60ch">Nothing in this account cleared its noise band or volume floors this week, which is a good result. The next check runs with Monday's weekly report, Oct 26.</p>`, `<button class="btn btn-secondary" data-go="acct-${a.id}-reports">See last week's report</button>`)}</div>
      <div class="sec">${sech(`Past · ${(day1 ? 0 : G.pastTotal) + s.skipped.length}`, past.length ? toastBtn("All →", "Opens every past suggestion for this account") : "")}
        ${past.length ? `<div class="tablewrap" style="margin-top:8px"><table><thead><tr><th></th><th>Suggestion</th><th>Who acted</th><th>Their prediction</th><th class="r">Result</th></tr></thead><tbody>${past.map(([t, b, src, who, pred, o]) => `<tr><td>${U.ctype(t)}</td><td><b>${esc(b)}</b><div class="small muted">${esc(src)}</div></td><td class="tn" style="white-space:normal">${esc(who)}</td><td class="tn">${esc(pred)}</td><td class="st">${stampOf(o)}</td></tr>`).join("")}</tbody></table></div>`
          : `<p class="muted" style="margin:10px 0 0">Nothing acted on yet. Suggestions you act on or skip show here with who did it and how their call turned out.</p>`}</div>`;
  }

  /* ---------- Reports ---------- */
  function pastShares(a, c) {
    if (c.role !== "owner") return "";
    const list = (AD().shares[a.id] || []).filter((x) => c.phase !== "day1" || x.mine);
    return `<div class="sec" id="ac-shares">${sech("Past shares of this audit", `<span class="small muted">Owners and admins only</span>`)}
      ${list.length ? `<div class="tablewrap" style="margin-top:8px"><table><thead><tr><th>Made</th><th>By</th><th>Includes</th><th>Expires</th><th>Last viewed</th><th class="r">Opens</th><th>Status</th><th></th></tr></thead><tbody>${list.map((x, i) => `<tr><td class="dt">${esc(x.made)}</td><td style="white-space:nowrap">${esc(x.by)}</td><td class="tn" style="white-space:normal;min-width:160px">${esc(x.inc)}</td><td class="tn num">${esc(x.exp)}</td><td class="tn${x.viewed.match(/\d/) ? " num" : ""}">${esc(x.viewed)}</td><td class="r">${x.opens}</td><td class="tn">${esc(x.status)}</td><td style="white-space:nowrap;text-align:right">${x.status === "Active" ? `<button class="linkbtn ac-lnk" data-a="copyshare" data-v="${i}">Copy link</button> · ${toastBtn("PDF", "Downloads the frozen PDF of this share")} · <button class="linkbtn ac-lnk" data-a="revoke" data-v="${i}">Revoke</button>` : ""}</td></tr>`).join("")}</tbody></table></div>`
        : `<p class="muted" style="margin:10px 0 0">No shares yet. ${lb("Share this audit", `data-drawer="shareaudit" data-acct="${a.id}"`)} to send a frozen, read-only copy to a client or prospect.</p>`}
      <p class="small muted" style="margin:6px 0 0">Revoking a share, or disconnecting or revoking this account's connection, stops its link and PDF download working.</p></div>`;
  }
  function reports(a, c) {
    if (c.phase === "day1") return empty("Your first weekly report arrives Monday, Oct 26", `<p style="margin:4px 0 10px;max-width:62ch">Every Monday at <span class="num">07:00</span> workspace time (${esc(D.workspace.tz)}), owners and the buyers on this account get this account's slice: how it performed against its normal range, what the team decided, how past calls turned out, and what's worth considering.</p>`, `<button class="btn btn-secondary" data-go="prefs">Choose who gets it</button>`) + `<div style="height:22px"></div>` + pastShares(a, c);
    const list = AD().reports[a.id] || [], s = st(a.id), r = list[Math.min(s.report, list.length - 1)];
    return `<div class="ac-rgrid"><div class="panel ac-rlist"><div class="ac-cap" style="padding:6px 12px">Weekly reports · newest first</div>
        ${list.map((x, i) => `<button class="ac-ritem${i === s.report ? " on" : ""}" data-a="report" data-v="${i}"${i === s.report ? ' aria-current="true"' : ""}><b>${esc(x.date)}</b><span class="small muted">${esc(x.headline)}</span></button>`).join("")}
        <p class="small muted" style="padding:6px 12px;margin:0">Sent Mondays at <span class="num">07:00</span> workspace time (${esc(D.workspace.tz)}) to owners and the buyers on this account.</p></div>
      <div class="panel ac-report"><div class="ac-rhead"><div><h3 style="font-size:20px">Week of ${esc(r.week)}</h3><div class="small muted">${esc(a.name)} · sent ${esc(r.date.replace("Mon", "Monday"))} at <span class="num">07:00</span> workspace time (${esc(D.workspace.tz)})</div></div><span class="ac-btns">${toastBtn("Download PDF", "Downloads this week's report as a PDF", "btn btn-ghost ac-ghost btn-sm")}${toastBtn("Forward to client", "Sends the client version: no notes, only client-visible predictions", "btn btn-secondary btn-sm")}</span></div>
        <div class="ac-rsec"><div class="ac-cap">1 · How the account performed</div><div class="tablewrap ac-tw"><table><thead><tr><th>Metric</th><th class="r">This week</th><th class="r">Normal range</th><th></th></tr></thead><tbody>${r.perf.map(([m, v, rg, n]) => `<tr><td>${m}</td><td class="r">${v}</td><td class="r">${rg}</td><td>${n}</td></tr>`).join("")}</tbody></table></div></div>
        <div class="ac-rsec"><div class="ac-cap">2 · What the team decided</div><p style="margin:6px 0 0">${r.team}</p></div>
        <div class="ac-rsec"><div class="ac-cap">3 · How past calls turned out</div>${r.past.length ? r.past.map(([t, w, d, sub, o]) => `<div class="li">${typeof t === "number" ? thumbN(t) : U.ctype(t)}<div><div class="w"><b>${esc(w)}</b> ${esc(d)}</div><div class="s">${esc(sub)}</div></div>${U.stamp(o)}</div>`).join("") : `<p class="muted" style="margin:6px 0 0">Nothing graded this week.</p>`}</div>
        <div class="ac-rsec last"><div class="ac-cap">4 · Worth considering this week</div>${r.consider.length ? r.consider.map(([t, b, x]) => `<div class="li">${U.ctype(t)}<div class="w"><b>${esc(b)}</b> <span class="muted">${esc(x)}</span></div><button class="btn btn-secondary btn-sm" data-go="acct-${a.id}-suggestions">In Suggestions →</button></div>`).join("") : `<p class="muted" style="margin:6px 0 0">Nothing worth changing this week.</p>`}</div></div></div>
      ${pastShares(a, c)}`;
  }

  /* ---------- Connection (owners) ---------- */
  function connection(a, c) {
    const K = AD().connection[a.id], day1 = c.phase === "day1";
    const imports = K.imports;
    return `<div class="sec">${sech("Meta", `<span class="small muted">Connected by ${esc(K.by)} on ${day1 ? "Oct 23" : esc(K.on)} · read access only</span>`)}
      <div class="tablewrap" style="margin-top:8px"><table><thead><tr><th>Account</th><th>Meta account id</th><th>Status</th><th>Currency</th><th>Timezone</th><th>Token expires</th><th>Facebook data access ends</th></tr></thead><tbody>
      <tr><td><b>${esc(a.name)}</b><div class="small muted">alias ${esc(K.alias)}</div></td><td class="tn num">${esc(K.actId)}</td><td>Connected · active${K.warn ? `<div class="small ac-warn"><b>Reconnect before ${esc(K.warn)}</b></div>` : ""}</td><td>${esc(a.currency)}</td><td class="tn">${esc(K.tzName)}</td><td class="tn num">${esc(K.token)}</td><td class="tn num">${esc(K.access)}</td></tr></tbody></table></div>
      <p class="small muted" style="margin:6px 0 0">Dates in UTC. Last good snapshot ${a.status === "warn" ? `${esc(a.synced)} 06:00` : `today ${esc(a.synced)}`} ${esc(a.tz)} time.</p>
      ${c.role === "owner" ? `<div style="margin-top:10px"><button class="btn btn-secondary btn-sm" data-toast="Opens Facebook to renew this login's access. Nothing is lost and syncing carries on.">Reconnect</button></div>` : ""}</div>
      <div class="sec">${sech("History import", `<span class="small muted">Last updated Oct 23 · newest finished window Oct 2026</span>`)}
      <div class="tablewrap" style="margin-top:8px"><table><thead><tr><th>Data</th><th>Progress</th><th>Notes</th></tr></thead><tbody>${imports.map((x) => `<tr><td>${esc(x.d)}</td><td style="white-space:nowrap">${num(x.done)} of ${num(x.of)} done</td><td class="tn">${x.note ? esc(x.note) : `<span class="muted">—</span>`}</td></tr>`).join("")}</tbody></table></div>
      <p class="small muted" style="margin:6px 0 0">“Waiting on Facebook” means a report is still running at Facebook or we're pacing requests; it fixes itself and is never a reconnect. A quiet month or the start of the account's history counts as done.</p></div>
      <div class="sec">${sech("Shopify")}<div class="li ac-basic2"><div><div class="w">Not connected</div><div class="s">Adds new vs returning customers and lets grading use store revenue.</div></div><button class="btn btn-secondary btn-sm" data-toast="Opens Shopify to install the CatchAll app (read-only orders and customers)">Connect Shopify</button></div></div>
      <div class="sec">${sech("Disconnect or revoke")}
        <div class="li ac-basic2"><div><div class="w"><b>Disconnect this account</b></div><div class="s" style="max-width:80ch">Stops syncing ${esc(a.name)} for ${esc(D.workspace.name)}. Decisions, predictions and grades you already have stay. Predictions still waiting can't be graded and move to “Can't be graded”. Shared audit links for this account stop working. Other workspaces connected to the same ad account aren't affected.</div></div><button class="btn btn-ghost ac-ghost btn-sm" data-toast="Asks you to confirm, then stops syncing ${esc(a.name)}. Nothing you have is deleted.">Disconnect…</button></div>
        <div class="li ac-basic2"><div><div class="w"><b>Revoke CatchAll's Facebook access</b></div><div class="s" style="max-width:80ch">Removes the access ${esc(K.by)}'s Facebook login gave CatchAll, for every account connected through it: ${esc(a.name)} and ${esc(K.others)}. Both stop syncing until someone reconnects. Shared audit links for both stop working.</div></div><button class="btn btn-ghost ac-ghost btn-sm" data-toast="Asks you to confirm, then removes CatchAll's access at Facebook for this login.">Revoke…</button></div></div>`;
  }

  /* ---------- the view ---------- */
  const resolve = (params) => { const a = D.accounts.find((x) => x.id === params[0]) || D.accounts[0]; return a; };
  CA.views.acct = {
    title: (c) => { const a = resolve(c.params), t = TABS.find(([k]) => k === c.params[1]); return `${a.name} · ${t ? t[1] : "Performance"}`; },
    get nav() { return "acct-" + resolve(String(CA.state.token).split("-").slice(1)).id; },
    render(c) {
      const a = resolve(c.params); let tab = TABS.some(([k]) => k === c.params[1]) ? c.params[1] : "performance";
      if (tab === "connection" && c.role !== "owner") tab = "performance";
      const sub = c.params[2] || "";
      let body;
      if (a.status === "none") body = notConnected(a, c);
      else body = reconnectBanner(a, c) + ({ performance, health, market, competitors, audience, suggestions, reports, connection }[tab])(a, c, sub);
      return `<div class="acct" data-acct="${a.id}" data-tab="${tab}">${header(a, c, tab)}${body}</div>`;
    },
    mount(root, c) {
      const el = root.querySelector(".acct"); if (!el) return;
      const id = el.dataset.acct, s = st(id), a = resolve([id]);
      drawCharts(el);
      const act = (name, v, t) => {
        switch (name) {
          case "metric": s.metric = v; s.day = defaultDay(id, v); break;
          case "lookclose": s.day = -1; break;
          case "day": s.day = +v; break;
          case "seechart": s.metric = "cpa"; s.day = +v; CA.rerender(); window.scrollTo({ top: 0, behavior: "smooth" }); return;
          case "sos": s.sos = +v; break;
          case "who": s.who = v; s.theme = ""; s.plat = ""; s.seg = ""; break;
          case "theme": s.theme = v; break;
          case "itype": s.itype = v; break;
          case "showall": s.showAll = !s.showAll; break;
          case "qclear": s.theme = s.plat = s.seg = s.ev = ""; break;
          case "cmpopen": s.cmpFrom = "v1"; s.cmpTo = "v2"; s.cmpKind = "all"; CA.go(`acct-${id}-market-compare`); return;
          case "cmpkind": s.cmpKind = v; break;
          case "cmpall": s.cmpAll = v === "1"; break;
          case "qwho": s.qf.who = v; s.qf.obs = s.qf.inf = true; s.qf.themes = []; s.qf.segs = []; s.qf.plats = []; break;
          case "segquotes": s.qf = { who: "cust", obs: true, inf: true, themes: [], segs: AD().market[id].segs.filter((x, j) => j !== +v), plats: [] }; CA.go(`acct-${id}-market-quotes`); return;
          case "say": s.sayKind = v; break;
          case "report": s.report = +v; break;
          case "doing": {
            const x = AD().suggestions[id].open.find((o) => o.id === v);
            if (CA.drawers.log) CA.openDrawer("log", { acct: id, idea: x.audit ? "audit" : "weekly_report", suggestion: x.b });
            else CA.toast(`Opens the logging panel for ${a.name}, filled in from “${x.b.replace(/\.$/, "")}”`);
            return;
          }
          case "notnow": {
            const x = AD().suggestions[id].open.find((o) => o.id === v); s.removed.push(v);
            s.skipped.push([x.type, x.b.replace(/\.$/, ""), x.src.replace("From the audit", "Audit").replace(" · worth considering", ""), `${viewer(c).name} · Not now · Oct 23`, "", null]);
            CA.toast("Moved to Past as skipped. A skip never counts as a miss."); break;
          }
          case "revoke": { const sh = AD().shares[id][+v]; sh.status = `Revoked Oct 23 by ${viewer(c).name}`; CA.toast("Share revoked. Its link and PDF stop working now."); break; }
          case "copyshare": copy(AD().shares[id][+v].link); return;
          case "run": runAudit(el, id); return;
          default: return;
        }
        CA.rerender();
      };
      el.addEventListener("click", (e) => { const t = e.target.closest("[data-a]"); if (!t || t.tagName === "SELECT" || t.tagName === "INPUT") return; act(t.dataset.a, t.dataset.v, t); });
      el.addEventListener("change", (e) => {
        const t = e.target; const k = t.dataset.a; if (!k) return;
        if (k === "qf") { const f = s.qf, g = t.dataset.g, v = t.dataset.v; if (g === "ev") f[v] = t.checked; else { f[g] = f[g].filter((x) => x !== v); if (!t.checked) f[g].push(v); } CA.rerender(); return; }
        const map = { trend: "trend", ver: "ver", plat: "plat", qseg: "seg", qev: "ev", qsort: "qsort", saycomp: "sayComp", setver: "setVer", cmpfrom: "cmpFrom", cmpto: "cmpTo" };
        if (map[k]) { s[map[k]] = t.value; if (k === "ver") { s.itype = ""; s.showAll = false; } CA.rerender(); }
      });
    },
  };

  function runAudit(el, id) {
    const s = st(id); if (s.running) return;
    s.running = true;
    const btn = el.querySelector("#ac-run"), share = el.querySelector("#ac-share");
    const steps = ["Running · health checks…", "Running · research…", "Running · scorecard…"];
    if (share) { share.disabled = true; share.title = "Available when the audit finishes"; }
    if (btn) { btn.disabled = true; btn.classList.add("running"); btn.innerHTML = `<span class="ac-spin" aria-hidden="true"></span>${steps[0]}`; btn.setAttribute("aria-live", "polite"); }
    let i = 0; const h = setInterval(() => { i++; const b = document.getElementById("ac-run"); if (b && steps[i]) b.innerHTML = `<span class="ac-spin" aria-hidden="true"></span>${steps[i]}`; }, 1000);
    setTimeout(() => {
      clearInterval(h); s.running = false; s.refreshed = true;
      if (document.querySelector(`.acct[data-acct="${id}"]`)) CA.rerender();
      CA.toast("Audit refreshed");
    }, 3000);
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); CA.toast("Link copied"); }
    catch (e) {
      let ok = false;
      try { const t = document.createElement("textarea"); t.value = text; t.setAttribute("readonly", ""); t.style.position = "fixed"; t.style.opacity = "0"; document.body.appendChild(t); t.select(); ok = document.execCommand("copy"); t.remove(); } catch (e2) { ok = false; }
      if (ok) { CA.toast("Link copied"); return; }
      const inp = document.getElementById("sa-link"); if (inp) { inp.focus(); inp.select(); }
      CA.toast("Couldn't copy automatically. Select the link and copy it with Ctrl or ⌘ + C.");
    }
  }

  /* ---------- Share audit dialog ---------- */
  const SECTIONS = [["health", "Health", "worth looking at, creative diversity and health, saturation, basics", true], ["market", "Market", "change note, share of search, search volume, summary, quotes", true], ["competitors", "Competitors", "this week, ad patterns, white space, what people say", true], ["audience", "Audience", "segments, demand constellations", true], ["score", "What your changes did", "the scorecard totals and change-type breakdown", true], ["buyers", "Per-buyer breakdowns", "names the buyers behind each result", false], ["notes", "Notes", "private notes written when logging", false], ["preds", "Predictions not marked client-visible", "", false]];
  const SHORT = { health: "Health", market: "Market", competitors: "Competitors", audience: "Audience", score: "scorecard", buyers: "per-buyer", notes: "notes", preds: "all predictions" };
  CA.drawers.shareaudit = {
    kind: "dialog",
    title: (c, data) => `Share the ${(D.accounts.find((x) => x.id === data.acct) || D.accounts[0]).name} audit`,
    render(c, data) {
      const day1 = c.phase === "day1";
      return `<div class="ac-share"><p class="small muted" style="margin:0 0 12px">Makes a copy frozen as of now. Later changes and decisions never appear in a link you've already sent. Anyone with the link can read it until it expires; every open is logged.</p>
        <fieldset class="ac-fs"><legend class="ac-cap">Include</legend>
        ${SECTIONS.map(([k, l, d, on]) => { const dis = day1 && k === "score"; return `<div class="ac-cbrow"><input type="checkbox" id="sa-${k}" data-k="${k}"${on && !dis ? " checked" : ""}${dis ? " disabled" : ""}><label for="sa-${k}"><b>${esc(l)}</b> <span class="muted small">${dis ? "arrives with your first grades on Oct 30" : esc(d)}</span></label></div>`; }).join("")}</fieldset>
        <div class="ac-sgrid"><div class="field"><label for="sa-exp">Link expires</label><select id="sa-exp" class="input"><option value="7">In 7 days, ${plus(7)}</option><option value="30" selected>In 30 days, ${plus(30)}</option><option value="90">In 90 days, ${plus(90)}</option></select><span class="help">7, 30 or 90 days</span></div>
        <div class="field"><span class="ac-flabel">Also make</span><div class="ac-cbrow" style="border:0;padding-top:6px"><input type="checkbox" id="sa-pdf" checked><label for="sa-pdf">A PDF to download</label></div></div></div>
        <p class="small muted" style="margin:0">Takes about a minute; you'll see the link here and under Past shares on the Reports tab. Owners and admins can make up to 10 shares a day.</p>
        <div class="dfoot"><button class="btn btn-ghost ac-ghost" data-close>Cancel</button><button class="btn btn-primary" id="sa-create">Create link</button></div></div>`;
    },
    mount(root, c, data) {
      const id = (D.accounts.find((x) => x.id === data.acct) || D.accounts[0]).id;
      const body = root.querySelector(".ac-share");
      root.querySelector("#sa-create").addEventListener("click", () => {
        const inc = [...root.querySelectorAll(".ac-fs input:checked")].map((i) => i.dataset.k);
        if (!inc.length) { CA.toast("Pick at least one section to share"); return; }
        const days = +root.querySelector("#sa-exp").value, pdf = root.querySelector("#sa-pdf").checked;
        const ab = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789", part = () => Array.from({ length: 4 }, () => ab[Math.floor(Math.random() * ab.length)]).join("");
        const link = `https://app.catchall.example/s/${part()}-${part()}-${part()}`, exp = plus(days);
        body.innerHTML = `<p style="margin:0 0 8px"><b>Making the frozen copy…</b></p><div class="prog" style="width:100%;height:6px"><i class="ac-progi" style="height:6px;width:8%"></i></div><p class="small muted" style="margin:8px 0 0">Rendering ${inc.length} sections${pdf ? " and the PDF" : ""}. You can close this; the link will be under Past shares.</p>`;
        requestAnimationFrame(() => { const p = body.querySelector(".ac-progi"); if (p) { p.style.transition = "width 1.1s ease-out"; p.style.width = "100%"; } });
        setTimeout(() => {
          (AD().shares[id] = AD().shares[id] || []).unshift({ made: "Oct 23", by: viewer(c).name, inc: inc.map((k) => SHORT[k]).join(", "), exp, viewed: "never opened", opens: 0, status: "Active", link, mine: true });
          if (!document.getElementById("scrim")) { CA.rerender(); CA.toast("Share link ready under Past shares"); return; }
          body.innerHTML = `<div class="banner info" style="display:block"><b>Link ready.</b> Expires ${esc(exp)}${pdf ? " · PDF ready" : ""}</div>
            <div class="field"><label for="sa-link">Share link</label><input id="sa-link" class="input mono" readonly value="${esc(link)}"></div>
            <p class="small muted" style="margin:0 0 4px">Includes ${esc(inc.map((k) => SECTIONS.find((x) => x[0] === k)[1]).join(", "))}. Also listed under Past shares on the Reports tab.</p>
            <div class="dfoot"><button class="btn btn-ghost ac-ghost" data-close>Done</button><span class="ac-btns"><button class="btn btn-secondary" id="sa-open">Open shared page</button><button class="btn btn-primary" id="sa-copy">Copy link</button></span></div>`;
          body.querySelector("#sa-copy").addEventListener("click", () => copy(link));
          body.querySelector("#sa-open").addEventListener("click", () => CA.go("shared-audit"));
          body.querySelector("#sa-link").addEventListener("focus", (e) => e.target.select());
          CA.rerender();
        }, 1300);
      });
    },
  };
})();
