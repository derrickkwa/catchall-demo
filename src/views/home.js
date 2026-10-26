/* Home: buyer (mockup 01) and owner (mockup 02), a month in and day one. */
(function () {
  const D = CA.data, U = CA.ui, H = D.home;

  /* ---------- small helpers shared with the decision log (log.js) ---------- */
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const K = (CA.homeKit = {
    MONTHS,
    needsReason: (d) => d.status === "reason" && d.tier !== "recalled",
    dateOf(d) {
      const [m, day] = String(d.date).split(" ");
      const mi = MONTHS.indexOf(m);
      const y = d.year || (mi >= 10 ? 2025 : 2026);
      return new Date(y, mi, +day || 1);
    },
    fmt(dt) { return `${MONTHS[dt.getMonth()]} ${dt.getDate()}`; },
    addDays(dt, n) { const x = new Date(dt); x.setDate(x.getDate() + n); return x; },
    horizon(d) { const m = /in (\d+)d/.exec(d.pred || ""); return m ? +m[1] : 7; },
    pct(s) { return parseFloat(String(s || "0").replace(/[±+%\s]/g, "").replace("−", "-")) || 0; },
    find(id) { return D.decisions.find((d) => d.id === id) || H.history.find((d) => d.id === id); },
    me(c) { return c.role === "owner" ? "dana" : "sam"; },
    /* a scale with the account's normal band, used by the reveal and the log detail */
    meter(d, opts = {}) {
      const mv = K.pct(d.move), b = Math.abs(K.pct(d.band)) || 5;
      const S = Math.max(20, Math.ceil((Math.max(Math.abs(mv), b) * 1.4) / 10) * 10);
      const p = (x) => Math.max(1, Math.min(99, 50 + (x / S) * 50));
      const col = d.status === "hit" ? "var(--hit)" : d.status === "miss" ? "var(--miss)" : "var(--ink-2)";
      const metric = (d.pred || "").split(" ")[0] || "Metric";
      const label = `${metric} change on a scale from minus ${S} to plus ${S} percent, normal range plus or minus ${b} percent, landed at ${mv} percent`;
      return `<div class="meter hm-meter" role="img" aria-label="${U.esc(label)}">
        <div class="track"></div><div class="bandz" style="left:${p(-b)}%;width:${p(b) - p(-b)}%"></div><div class="zero" style="left:50%"></div>
        <div class="pin${opts.anim ? " hm-slide" : ""}" style="left:${p(mv)}%;background:${col}"></div>
        <div class="lab" style="left:0">−${S}%</div><div class="lab" style="left:${p(-b) - 4}%">−${b}%</div><div class="lab" style="left:${p(b) - 3}%">+${b}%</div><div class="lab" style="right:0">+${S}%</div>
      </div>`;
    },
    rowsNeeding() { return D.decisions.filter(K.needsReason); },
  });

  const P = (id) => D.people[id];
  const avatar = (id) => U.av(id);
  const progPct = (day) => { const m = /(\d+) of (\d+)/.exec(day || ""); return m ? Math.round((+m[1] / +m[2]) * 100) : 0; };

  /* ---------- pieces ---------- */
  function scoreTiles(me) {
    return `<div class="tiles">
      ${U.tile(`${U.icon("trophy")}Team rank <span class="hm-prov">Provisional</span>`, `#${me.rank}`, `${U.mv(me.moved)} this week · ${U.num(me.gapToPlace)} from a prize place`)}
      ${U.tile(`${U.icon("check")}Hit rate`, `${me.hitRate}%`, `${U.num(me.hits)} of ${U.num(me.graded)} graded · <span class="up">▲ 6 pts</span>`)}
      ${U.tile(`${U.icon("target")}Skill`, me.skill, `higher is better · <span class="up">▲ 0.02</span>`)}
      ${U.tile(`${U.icon("bolt")}Capture rate`, `${me.capture}%`, `need ${U.num("50%")} to qualify`)}
    </div>`;
  }
  function h2h(me) {
    const ai = me.shared - me.closerThanAI, you = Math.round((me.closerThanAI / me.shared) * 100);
    return `<div class="h2h"><span class="hm-yl">You vs the AI · ${U.num(me.closerThanAI)}</span><div class="bar" role="img" aria-label="Closer than the AI on ${me.closerThanAI} of ${me.shared} calls"><i style="width:${you}%;background:var(--action)"></i><i style="width:${100 - you}%;background:var(--muted)"></i></div><span class="hm-al">AI ${U.num(ai)}</span></div>
      <div class="small muted" style="margin-top:6px">Closer than the AI on ${U.num(me.closerThanAI)} of the ${U.num(me.shared)} calls you both made this season.</div>`;
  }
  function seasonTag() { return `<span class="season">${D.season.name.split(" ")[0].toUpperCase()} SEASON · <b>${D.season.daysLeft} DAYS LEFT</b></span>`; }
  const H2 = (t, right = "") => `<div class="sech"><h2 class="hm-h">${t}</h2>${right}</div>`;
  /* collapsible section: closed by default, and whatever the person opens stays open next time */
  function foldOpen(id, dflt) { try { const v = localStorage.getItem("ca-demo-fold-" + id); return v == null ? dflt : v === "1"; } catch (e) { return dflt; } }
  function fold(id, title, right, body, opts = {}) {
    if (!body) return "";
    const open = foldOpen(id, !!opts.open);
    return `<details class="fold${opts.tone ? " " + opts.tone : ""}" data-fold="${id}"${open ? " open" : ""}>
      <summary><span class="fold-t">${U.icon("chev", "ico fold-chev")}${title}</span><span class="fold-r">${right}</span></summary>
      <div class="fold-b">${body}</div></details>`;
  }
  /* main column and the team column side by side from the top of the page */
  const layout = (main, side) => `<div class="hm-grid"><div class="hm-maincol">${main}</div>${side}</div>`;

  function revealBlock(d) {
    const first = !H.revealed[d.id];
    H.revealed[d.id] = true;
    const anim = first ? " hm-strike" : "";
    const lead = d.thumb != null ? `<span class="thumb big-thumb" style="background:${D.thumbs[d.thumb % D.thumbs.length]}" aria-hidden="true"></span>` : `<span class="ctype hm-bigctype">${U.icon(d.type)}</span>`;
    const h = K.horizon(d);
    const [metric, arrow] = (d.pred || "").split(" ");
    const beatAI = d.status === "hit" && d.aiResult !== "hit";
    const edge = `${K.pct(d.move) < 0 ? "−" : "+"}${Math.abs(K.pct(d.band))}%`;
    const verdict = d.status === "hit" ? `${metric} went ${U.num(d.move)}, past the range edge at ${U.num(edge)}${beatAI ? " · you beat the AI" : ""}`
      : d.status === "miss" ? `${metric} went ${U.num(d.move)}, past the edge the other way` : `${metric} moved ${U.num(d.move)}, inside the ${U.num(d.band)} range`;
    return `<div class="hm-inner" id="hm-new">${H2("New result", `<button class="hm-replay" id="hm-replay" type="button">Replay</button>`)}
      <div class="reveal hm-reveal">
        ${lead}
        <div>
          <div class="w"><b>${U.esc(d.what)}</b> ${U.esc(d.detail)} <span class="muted">· ${U.esc(d.camp)}</span></div>
          <div class="s">${U.acctTag(d.acct)} · ${U.num(d.date)} · you said ${metric} ${arrow} in ${h} days at ${U.conf(d.conf)}; the AI said ${U.esc(d.ai || "no change")}</div>
          <span class="stamp ${d.status}${anim}" id="hm-stamp">${{ hit: "Hit", miss: "Miss", noise: "Within noise" }[d.status]} <span class="m">${h}d · ${D.today}</span></span>
          <span class="small hm-verdict">${verdict}</span>
        </div>
        ${K.meter(d, { anim: first })}
      </div></div>`;
  }

  function needsBlock(c) {
    const rows = K.rowsNeeding();
    if (!rows.length) return "";
    const n = D.me.needsReason;
    const shown = rows.slice(0, 2);
    const how = (d) => `${U.num(d.date)} · ${d.who === "sam" ? "you" : U.esc(P(d.who)?.short || "")} · from change history`;
    return fold("needs", `Needs a reason · ${U.num(n)}`, `<span class="small muted">each one lifts your capture rate</span>`,
      `${shown.map((d) => U.row(d, { sub: how(d) })).join("")}
      ${rows.length > shown.length ? `<button class="linkbtn hm-more" data-go="log">${rows.length - shown.length} more in the decision log →</button>` : ""}`, { tone: "needs" });
  }

  function gradedBlock(who) {
    const rows = D.decisions.filter((d) => d.who === who && ["hit", "miss", "noise"].includes(d.status) && !d.isNew && d.aiResult);
    if (!rows.length) return "";
    const ai = { hit: "hit", miss: "miss", noise: "within noise" };
    const sub = (d) => {
      const inside = d.status === "noise";
      return `said ${U.esc(d.pred)} at ${U.conf(d.conf)} · ${inside ? "moved" : "went"} ${U.num(d.move)}, ${inside ? `inside the ${U.num(d.band)} range` : `past the edge at ${U.num(d.band)}`}${d.aiResult ? ` · AI: ${ai[d.aiResult]}` : ""}`;
    };
    return fold("graded", `Also graded since you were last here · ${U.num(rows.length)}`, `<button class="linkbtn u small" data-go="calls">My calls →</button>`,
      rows.map((d) => U.row(d, { sub: sub(d) })).join(""));
  }

  function comingRow(d) {
    const pct = d.pct ?? progPct(d.day);
    return `<div class="li">${U.lead(d)}<div><div class="w"><b>${U.esc(d.what)}</b> ${U.esc(d.detail)} · ${U.esc(d.pred)} · ${U.conf(d.conf)} ${U.acctTag(d.acct)}</div>
      <div class="s"><span class="hm-lock">AI's call locked until graded</span></div><div class="prog" aria-hidden="true"><i style="width:${pct}%"></i></div></div>
      <div class="rowend"><span class="stamp wait">Day ${U.esc(d.day)}</span></div></div>`;
  }
  function comingBlock(who, total, rows, next) {
    if (!rows.length) return "";
    const shown = rows.slice(0, 3);
    return fold("coming", `Coming up · ${U.num(total)} waiting`, `<span class="small muted">${next}</span>`,
      `${shown.map(comingRow).join("")}
      ${total > shown.length ? `<button class="linkbtn hm-more" data-go="calls">${total - shown.length} more in My calls →</button>` : ""}`);
  }

  function miniBoard(c, opts = {}) {
    const meId = c.role === "owner" ? null : "sam";
    const rows = [];
    const ranked = D.board.filter((r) => r.rank);
    const top = ranked.slice(0, D.season.prizePlaces);
    const mini = (r, extra = "") => {
      const p = P(r.who);
      const me = r.who === meId && !opts.day1;
      return `<button class="mini hm-mini${me ? " me" : ""}" data-go="board"><span class="r">${U.medal(r.rank)}</span><span class="who">${avatar(r.who)}${U.esc(p.short)}${r.rank <= D.season.prizePlaces ? U.trophy() : ""}${me ? ' <span class="you">You</span>' : ""}</span><span class="s num">${extra || r.skill}</span></button>`;
    };
    top.forEach((r) => rows.push(mini(r)));
    rows.push(`<div class="pl thin">Prize places · top ${D.season.prizePlaces}</div>`);
    if (opts.day1) {
      rows.push(`<button class="mini hm-mini me" data-go="board"><span class="r"><span class="rk">–</span></span><span class="who">${avatar("sam")}You <span class="you">You</span></span><span class="s num">3 calls</span></button>`);
    } else {
      const after = D.board.slice(D.board.findIndex((r) => r.rank === D.season.prizePlaces) + 1);
      after.slice(0, 3).forEach((r) => {
        if (r.ref) rows.push(`<div class="mini ref"><span class="r"><span class="rk">–</span></span><span>${U.esc(r.label)}</span><span class="s num">${r.skill}</span></div>`);
        else rows.push(mini(r));
      });
    }
    const fifth = ranked[D.season.prizePlaces - 1];
    const note = opts.day1
      ? `You join the board at ${U.num(20)} graded calls. Your first grade lands Oct 28. Prize rules pending.`
      : c.role === "owner"
        ? `October, provisional until ${D.season.final}. Sam is ${U.num(D.me.gapToPlace)} from a prize place; prize rules pending. You aren't ranked: ${2 + D.decisions.filter((d) => d.who === "dana" && d._new).length} calls this season.`
        : `<b style="color:var(--ink)">${U.num(D.me.gapToPlace)} from a prize place.</b> ${U.esc(P(fifth.who).short)} is #${fifth.rank} on ${U.num(fifth.skill)}. Skill vs baseline, higher is better. Prize rules pending; provisional until ${D.season.final}.`;
    return `<div class="box"><h2 class="hm-rh">Team board <button class="linkbtn u small" data-go="board">All →</button></h2>${rows.join("")}<div class="note hm-note">${note}</div></div>`;
  }
  function feedBox(c) {
    const items = H.feed.filter((f) => (c.role === "owner" ? !f.buyerOnly : !f.ownerOnly)).slice(0, 4);
    return `<div class="box"><h2 class="hm-rh">Team today</h2>${items.map((f) => `<button class="feed hm-feed" data-go="${f.go}">${avatar(f.who)}<span>${f.html}<span class="t${/\d/.test(f.when) ? " num" : ""}">${f.when}</span></span></button>`).join("")}</div>`;
  }
  const rail = (c, opts) => `<aside class="rail" aria-label="Team">${miniBoard(c, opts)}${feedBox(c)}</aside>`;

  /* ---------- buyer Home ---------- */
  function buyerMonth(c) {
    const me = D.me;
    const nd = D.decisions.find((d) => d.isNew && d.who === "sam");
    const mine = D.decisions.filter((d) => d.who === "sam" && d.status === "wait");
    const extra = D.decisions.filter((d) => (d._new || d.tier === "recalled") && d.who === "sam" && d.status === "wait").length;
    const needs = needsBlock(c), graded = gradedBlock("sam");
    const quiet = !nd && !needs && !graded
      ? `<div class="hm-quiet"><h2 class="hm-qh">Nothing new since yesterday at 17:40</h2><p>No results landed and every change on your accounts has a reason. Nothing needs you today.</p></div>` : "";
    return `<div class="hm">${layout(`
      <section class="score hm-hero" aria-label="Your season">
        <div class="top"><h1 class="hm-greet">Good morning, Sam</h1>${seasonTag()}</div>
        ${scoreTiles(me)}${h2h(me)}
        ${nd ? revealBlock(nd) : ""}
      </section>
      ${quiet}${needs}${graded}
      ${comingBlock("sam", me.waiting + extra, mine.slice().reverse().sort((a, b) => (b._new ? 1 : 0) - (a._new ? 1 : 0)), `next result <b>Monday, Oct 27</b>`)}`, rail(c))}</div>`;
  }

  function buyerDay1(c) {
    const fb = H.setup.facebook;
    const done = 1 + (fb ? 1 : 0);
    const boxes = Array.from({ length: 20 }, (_, i) => `<i class="${i < 3 ? "f" : ""}"></i>`).join("");
    const ck = (isDone, title, sub, action) => `<div class="ck${isDone ? " done" : ""}"><span class="box" aria-hidden="true">${isDone ? U.icon("check") : ""}</span><div><div class="w"><b>${title}</b></div><div class="s">${sub}</div></div>${isDone ? `<span class="small muted">Done</span>` : action}</div>`;
    return `<div class="hm">${layout(`
      <section class="score hm-hero" aria-label="Your first season">
        <div class="top"><h1 class="hm-greet">Welcome, Sam</h1>${seasonTag()}</div>
        <div class="tiles">
          ${U.tile(`${U.icon("target")}First result`, "Oct 28", `Budget cut on Acme Skincare, in ${U.num(5)} days`)}
          ${U.tile(`${U.icon("trophy")}Calls to qualify`, `3<span class="hm-of">/20</span>`, `<span class="hm-m20" role="img" aria-label="3 of 20 calls">${boxes}</span>calls logged; ${U.num(20)} counted calls to qualify`)}
          ${U.tile(`${U.icon("bolt")}Capture rate`, "40%", `need ${U.num("50%")} to qualify · ${U.num(2)} more reasons gets you there`)}
          ${U.tile(`${U.icon("trophy")}Prize pool`, "To be announced", `<span class="note-chip">Pending legal review</span>`, { vcls: "hm-sm" })}
        </div>
        <div class="small muted" style="margin-top:10px">Your numbers and the head to head with the AI start when your first call is graded.</div>
      </section>
        ${fold("setup", `Get set up · ${done} of 3 done`, `<span class="small muted">stays here until it's done</span>`, `
          ${ck(fb, "Link your Facebook", fb ? "Done today. Changes you make in Ads Manager now count as yours." : "So changes you make in Ads Manager count as yours, with or without the plugin. Asks for no ad account access.", `<button class="btn btn-primary btn-sm" id="hm-linkfb">Link your Facebook</button>`)}
          ${ck(true, "Install the plugin", "Done Oct 21. Log calls as you publish in Ads Manager.")}
          ${ck(false, "214 past changes need a reason", "From the last 12 months on your accounts. Each one you explain lifts your capture rate.", `<button class="btn btn-secondary btn-sm" data-go="log">Add why</button>`)}`, { open: true })}
        ${comingBlock("sam", 3, H.day1Coming, `first result <b>Tuesday, Oct 28</b>`)}
        ${fold("audit", "Free audit", `<button class="linkbtn u small" data-go="acct-acme-performance">Open →</button>`, `
          <div class="li" style="border-bottom:0"><span class="ctype">${U.icon("check")}</span><div><div class="w"><b>What 214 past changes did</b> on Acme Skincare, plus health and market research</div><div class="s">${U.acctTag("acme")} · ready since Oct 21</div></div><div class="rowend"><button class="btn btn-secondary btn-sm" data-go="acct-acme-performance">Open audit</button></div></div>`, { open: true })}
      `, rail(c, { day1: true }))}</div>`;
  }

  /* Dana's own calls ("Just me") */
  function danaMine(c) {
    const mine = D.decisions.filter((d) => d.who === "dana" && d.status === "wait");
    const boxes = Array.from({ length: 20 }, (_, i) => `<i class="${i < 2 + mine.length ? "f" : ""}"></i>`).join("");
    return `<section class="score" aria-label="Your season">
        <div class="top"><h2 class="hm-h" style="font-size:18px">Your own calls this season</h2>${seasonTag()}</div>
        <div class="tiles">
          ${U.tile(`${U.icon("trophy")}Team rank`, "–", "not ranked yet · joins at 20 graded calls", { vcls: "none" })}
          ${U.tile(`${U.icon("trophy")}Calls to qualify`, `${2 + mine.length}<span class="hm-of">/20</span>`, `<span class="hm-m20" aria-hidden="true">${boxes}</span>calls logged this season`)}
          ${U.tile(`${U.icon("check")}Hit rate`, "1 of 1", "graded so far · Hit on Kettle &amp; Co", { vcls: "hm-sm" })}
          ${U.tile(`${U.icon("bolt")}Capture rate`, "100%", `need ${U.num("50%")} to qualify`)}
        </div>
      </section>
      <div class="cols"><div>
        ${mine.length ? comingBlock("dana", 1 + mine.length, mine, `next result <b>Friday, Oct 31</b>`) : ""}
        <div class="hm-quiet"><h2 class="hm-qh">${mine.length ? "That's everything of yours" : "Nothing of yours needs you today"}</h2><p>${mine.length ? "Plus your" : "Your one"} waiting call on Kettle &amp; Co (cost cap, ROAS ↑ in 14 days) lands <b>Oct 31</b>. Log more of your own decisions to join the board at ${U.num(20)} graded calls.</p>
        <button class="btn btn-secondary" data-drawer="log">+ Log a decision</button></div>
      </div>${rail(c)}</div>`;
  }

  /* ---------- owner Home ---------- */
  function toggle() {
    const mode = CA.state.homeMode || "team";
    return `<span class="seg hm-seg" role="group" aria-label="Show"><button type="button" class="${mode === "team" ? "on" : ""}" aria-pressed="${mode === "team"}" data-hmode="team">Team</button><button type="button" class="${mode === "me" ? "on" : ""}" aria-pressed="${mode === "me"}" data-hmode="me">Just me</button></span>`;
  }
  function ownerMonth(c) {
    const T = H.team;
    const vsPct = Math.round((T.closer / T.graded) * 100);
    const needs = H.needsYou.filter((n) => !n.done);
    const lead = (n) => n.lead === "link" ? `<span class="ctype">${U.icon("link")}</span>` : n.lead === "join" ? `<span class="av2" style="background:var(--c5)" aria-hidden="true">SR</span>` : avatar(n.lead);
    const samNo = K.rowsNeeding().filter((d) => d.who === "sam").length;
    const tr = (r) => {
      const p = P(r.who);
      const nr = r.who === "sam" ? samNo : r.noReason;
      return `<tr><td><span class="who">${avatar(r.who)}${U.esc(p.name)}</span>${r.notLinked ? ' <span class="hm-flag">Not linked</span>' : ""}</td>
        <td class="num r">${r.capture == null ? '<span class="muted">–</span>' : r.capture + "%"}</td><td class="num r">${r.hit}%</td><td class="num r">${r.graded}</td>
        <td class="num r">${nr == null ? '<span class="muted">–</span>' : r.below ? `<b>${nr}</b>` : nr}</td>
        <td class="hm-tend">${r.notLinked ? `<button class="btn btn-secondary btn-sm" data-toast="Reminder sent to ${U.esc(p.short)}: link your Facebook so your changes count as yours">Remind ${U.esc(p.short)}</button>` : r.below ? `<span class="small muted">below ${U.num("50%")} to qualify</span>` : ""}</td></tr>`;
    };
    const worth = H.worth.filter((w) => !w.dismissed);
    return `<div class="hm">${layout(`
      <div class="titlebar hm-title"><h1 class="hm-greet">Good morning, Dana<small>${U.esc(D.workspace.name.toUpperCase())} · THIS WEEK</small></h1>${toggle()}</div>
      <section class="score hm-hero" aria-label="Your team this season">
        <div class="top"><h2 class="hm-h" style="font-size:18px">Your team this season</h2>${seasonTag()}</div>
        <div class="tiles">
          ${U.tile(`${U.icon("check")}Hit rate`, `${T.hitRate}%`, `team · ${U.num(T.graded)} graded · <span class="up">${T.hitMove}</span>`)}
          ${U.tile(`${U.icon("target")}Team vs the AI`, `${T.closer}<span class="hm-of"> / ${T.graded}</span>`, `<span class="hm-minih2h" aria-hidden="true"><i style="width:${vsPct}%;background:var(--action)"></i><i style="width:${100 - vsPct}%;background:var(--muted)"></i></span>calls closer than the AI · AI ${U.num(T.aiCloser)}`)}
          ${U.tile(`${U.icon("bolt")}Capture rate`, `${T.capture}%`, `team · need ${U.num("50%")} to qualify · <span class="down">${T.captureMove}</span>`)}
          ${U.tile(`${U.icon("alert")}Outside normal range`, `${T.outside}<span class="hm-of"> / ${D.accountCount}</span>`, "Acme, Bloom, Kettle &amp; Co")}
        </div>
      </section>
        ${needs.length ? fold("ownerneeds", `Needs you · ${U.num(needs.length)}`, `<span class="small muted">also sent by email</span>`,
          needs.map((n) => `<div class="li">${lead(n)}<div><div class="w">${n.title} ${n.acct ? U.acctTag(n.acct) : ""}</div><div class="s">${n.sub}</div></div><div class="rowend"><button class="btn btn-primary btn-sm" data-go="${n.go}">${n.btn}</button></div></div>`).join(""), { tone: "needs" }) : ""}
        ${fold("outside", `Accounts outside their normal range · ${U.num(H.outside.length)}`, `<button class="linkbtn u small" data-toast="The full list has all ${D.accountCount} of Harbor Media's accounts">All accounts →</button>`, `
          ${H.outside.map((o) => `<div class="li hm-out">${U.acctTag(o.acct)}<div><div class="w">${o.head}</div><div class="s">${o.sub} · <button class="linkbtn u" data-go="acct-${o.acct}-performance">See on chart →</button></div></div><div class="rng" aria-hidden="true"><div class="t"></div><div class="b" style="left:${o.band[0]}%;width:${o.band[1]}%"></div><div class="p" style="left:${o.pin}%"></div></div></div>`).join("")}
          <div class="small muted" style="padding-top:6px">The bar is the account's own normal range; the mark is today. Each account opens its Performance chart with the changes before it.</div>`)}
        ${fold("teamtable", "Team", `<button class="linkbtn u small" data-go="team">Team page →</button>`, `
          <div class="tablewrap hm-table" style="margin-top:8px"><table>
            <thead><tr><th scope="col">Buyer</th><th scope="col" class="r">Capture</th><th scope="col" class="r">Hit rate</th><th scope="col" class="r">Graded</th><th scope="col" class="r">No reason</th><th scope="col"><span class="sr">Action</span></th></tr></thead>
            <tbody>${H.team.table.map(tr).join("")}</tbody></table></div>
          <div class="small muted" style="padding-top:6px">Not linked: Alex hasn't done Link your Facebook, so changes Alex makes in Ads Manager show as "someone not linked" and can't be credited or counted in capture.</div>`)}
        ${fold("worth", `Worth considering this week · ${U.num(worth.length)}`, `<span class="small muted">only things that cleared the noise</span>`, `
          ${worth.length ? worth.map((w) => `<div class="li">${w.thumb != null ? U.thumb(w.thumb) : U.ctype(w.type)}<div><div class="w">${w.title} ${U.acctTag(w.acct)}</div><div class="s">${U.esc(w.camp)} · from this week's report</div></div>
            <div class="rowend hm-acts"><button class="btn btn-secondary btn-sm" data-drawer="log" data-acct="${w.acct}" data-camp="${U.esc(w.camp)}" data-reason="${U.esc(w.reason)}" data-signal="${U.esc(w.signal)}" data-metric="${w.metric}" data-field="${w.field}" data-from="${w.id}">Doing this</button><button class="btn btn-sm hm-ghost" data-notnow="${w.id}">Not now</button></div></div>`).join("")
            : `<p class="muted small" style="margin:10px 0">Nothing else this week. Next week's report lands Monday.</p>`}`)}
      `, rail(c))}</div>`;
  }

  const AUDIT = { month: 7, timer: null };
  function auditPanel() {
    const m = AUDIT.month, done = m >= 13;
    const ck = (state, title, sub, tag, extra = "") => `<div class="ck ${state}"><span class="box" aria-hidden="true">${state === "done" ? U.icon("check") : ""}</span><div><div class="w">${title}</div>${extra}<div class="s">${sub}</div></div><span class="small muted">${tag}</span></div>`;
    return `<div class="hm-panelx" id="hm-audit">${H2(done ? "Your free audit is ready" : "Your free audit is running", `<span class="small muted">${done ? "we emailed you too" : "about 4 minutes · we'll email you"}</span>`)}
          ${ck("done", "<b>Connected</b> Acme Skincare, read-only", `${U.num("09:41")} · act ${U.num("4021 8817")} · by you`, "Done")}
          ${ck("done", "<b>Account settings and attribution</b>", U.num("09:42"), "Done")}
          ${ck(done ? "done" : "run", "<b>Pulling 12 months of history</b>: spend, results and every change Meta still keeps", done ? "All 13 months in · 214 changes found" : `Month ${U.num(m)} of ${U.num(13)} · reach for the last 13 months comes first, before Facebook drops it`, done ? "Done" : "Running", done ? "" : `<div class="prog hm-prog" role="progressbar" aria-valuemin="0" aria-valuemax="13" aria-valuenow="${m}" aria-label="History pulled"><i style="width:${Math.round((m / 13) * 100)}%"></i></div>`)}
          ${ck(done ? "run" : "", "<b>Account health</b>: campaigns, creative, audience saturation", done ? "running now" : "starts when the history is in", done ? "Running" : "Next")}
          ${ck(done ? "done" : "", "<b>Past changes into your decision log</b>, each marked \"From history · No reason yet\"", done ? "214 changes · <button class=\"linkbtn u\" data-go=\"log\">Open the decision log →</button>" : "starts when the history is in", done ? "Done" : "Next")}
          ${ck("", "<b>Market research</b>: competitors, audience, search demand", "arrives within the hour; we'll email you", "Later")}
          ${done ? `<div style="padding:10px 0"><button class="btn btn-secondary btn-sm" data-go="acct-acme-performance">Open Acme Skincare →</button></div>` : ""}
        </div>`;
  }
  function ownerDay1(c) {
    return `<div class="hm">
      <div class="titlebar hm-title"><h1 class="hm-greet">Acme Skincare is connected<small>${U.esc(D.workspace.name.toUpperCase())} · OCT 23</small></h1>${toggle()}</div>
      <div class="cols"><div>
        ${auditPanel()}
        <div class="hm-invite">
          <h2 class="hm-qh">Invite your media buyers while it runs</h2>
          <p class="muted">Team numbers start when your buyers log calls; the first grades land about a week after. Each buyer links their Facebook so their changes count as theirs.</p>
          <label class="hm-lab" for="hm-invites">Work emails, separated by commas</label>
          <div class="hm-invrow"><input class="input" id="hm-invites" type="text" inputmode="email" autocomplete="off" placeholder="jordan@harbormedia.co, maya@harbormedia.co"><button class="btn btn-primary" id="hm-send" type="button">Send invites</button></div>
          <p class="help" id="hm-invhelp">You can also invite a client to a read-only view, from the account page.</p>
        </div>
      </div>
      <aside class="rail" aria-label="What's next"><div class="box"><h2 class="hm-rh">What fills in next</h2>
        <div class="feed hm-feed2"><span class="hm-fi">${U.icon("check")}</span><div><b>Today</b>: health, past changes, the account page tabs<div class="t">about ${U.num(4)} minutes</div></div></div>
        <div class="feed hm-feed2"><span class="hm-fi">${U.icon("check")}</span><div><b>Within the hour</b>: market research and competitors<div class="t">by email</div></div></div>
        <div class="feed hm-feed2"><span class="hm-fi">${U.icon("trophy")}</span><div><b>About a week after buyers start</b>: team hit rate, team vs AI, the board<div class="t">first grades</div></div></div>
        <div class="feed hm-feed2"><span class="hm-fi">${U.icon("bolt")}</span><div><b>Get the plugin</b> to log calls as you publish<div class="t"><button class="linkbtn u" data-toast="Opens the Chrome Web Store page for the CatchAll plugin">Install →</button></div></div></div>
      </div></aside></div></div>`;
  }

  CA.views.home = {
    title: "Home",
    nav: "home",
    render(c) {
      if (c.role === "owner") {
        if ((CA.state.homeMode || "team") === "me") {
          return `<div class="hm"><div class="titlebar hm-title"><h1 class="hm-greet">Good morning, Dana<small>JUST YOUR CALLS</small></h1>${toggle()}</div>${danaMine(c)}</div>`;
        }
        return c.phase === "day1" ? ownerDay1(c) : ownerMonth(c);
      }
      return c.phase === "day1" ? buyerDay1(c) : buyerMonth(c);
    },
    mount(root, c) {
      const main = root.querySelector("#main") || root;
      main.querySelectorAll("details[data-fold]").forEach((d) => d.addEventListener("toggle", () => {
        try { localStorage.setItem("ca-demo-fold-" + d.dataset.fold, d.open ? "1" : "0"); } catch (e) {}
      }));
      main.addEventListener("click", (e) => {
        const m = e.target.closest("[data-hmode]");
        if (m) { CA.state.homeMode = m.dataset.hmode; CA.rerender(); return; }
        const nn = e.target.closest("[data-notnow]");
        if (nn) {
          const w = H.worth.find((x) => x.id === nn.dataset.notnow);
          if (w) w.dismissed = true;
          CA.toast("Hidden until next week's report");
          CA.rerender(); return;
        }
        if (e.target.closest("#hm-replay")) {
          const pin = main.querySelector("#hm-new .pin"), st = main.querySelector("#hm-stamp");
          [pin, st].forEach((el) => { if (!el) return; el.classList.remove("hm-slide", "hm-strike"); void el.offsetWidth; });
          if (pin) pin.classList.add("hm-slide");
          if (st) st.classList.add("hm-strike");
          if (matchMedia("(prefers-reduced-motion: reduce)").matches) CA.toast("Animation is off because your system asks for reduced motion");
          return;
        }
        if (e.target.closest("#hm-linkfb")) {
          H.setup.facebook = true;
          CA.toast("Facebook linked. Changes you make in Ads Manager now count as yours.");
          CA.rerender(); return;
        }
        if (e.target.closest("#hm-send")) {
          const inp = main.querySelector("#hm-invites"), help = main.querySelector("#hm-invhelp");
          const list = inp.value.split(/[,\s]+/).filter(Boolean);
          const bad = list.filter((x) => !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(x));
          if (!list.length || bad.length) {
            help.className = "help err";
            help.textContent = list.length ? `That doesn't look like an email: ${bad[0]}` : "Add at least one work email.";
            inp.classList.add("bad"); inp.setAttribute("aria-invalid", "true"); inp.focus(); return;
          }
          inp.value = ""; inp.classList.remove("bad"); inp.removeAttribute("aria-invalid");
          help.className = "help"; help.textContent = `Invites sent to ${list.length} ${list.length === 1 ? "person" : "people"}. They'll show on the Team page when they join.`;
          CA.toast(`Invites sent to ${list.length} ${list.length === 1 ? "person" : "people"}`);
        }
      });
      /* the audit checklist moves along while the owner watches */
      if (c.role === "owner" && c.phase === "day1" && (CA.state.homeMode || "team") === "team" && AUDIT.month < 13 && !AUDIT.timer) {
        AUDIT.timer = setInterval(() => {
          const box = document.getElementById("hm-audit");
          if (!box) { clearInterval(AUDIT.timer); AUDIT.timer = null; return; }
          AUDIT.month++;
          box.outerHTML = auditPanel();
          if (AUDIT.month >= 13) { clearInterval(AUDIT.timer); AUDIT.timer = null; CA.toast("History is in: 214 past changes are now in your decision log"); }
        }, 2500);
      }
    },
  };
})();
