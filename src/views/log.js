/* Decision log (mockup 03) and the panels that write to it: Log a decision, Add why, plus the notifications panel. */
(function () {
  const D = CA.data, U = CA.ui, H = D.home, K = CA.homeKit;
  const NOW = new Date(2026, 9, 23, 10, 0); /* demo "now": Thu Oct 23, 10:00 */
  const LS = { acct: "", who: "", status: "", q: "", open: null, showOld: false, fresh: null };
  const P = (id) => D.people[id];
  const acctName = (id) => U.acct(id)?.name || "";

  /* ---------- row pieces ---------- */
  const isOutside = (d) => d.source === "outside" || d.status === "outside";
  function tierBadge(d) {
    if (K.needsReason(d) && d.source === "history") return `<span class="lg-tier">from history</span>`;
    if (d.tier === "recalled") return `<span class="lg-tier">recalled</span>`;
    if (d.tier === "late") return `<span class="lg-tier">late</span>`;
    if (d.tier === "unconnected") return `<span class="lg-tier unc">unconnected</span>`;
    return "";
  }
  function howLine(d) {
    if (isOutside(d)) return "By the client's own Facebook login · shown for context, not counted in anyone's capture rate";
    const src = { plugin: "Plugin", manual: "By hand", history: "From change history" }[d.source] || "";
    const why = K.needsReason(d) ? (d.source === "history" ? "No reason yet" : "Skipped at publish") : d.reason ? U.esc(d.reason) : "";
    const sig = d.signals && d.signals.length ? ` · ${U.esc(d.signals.join(", "))}` : "";
    const late = d.tier === "late" && d.changedOn ? ` · changed ${U.esc(d.changedOn)}, logged ${U.esc(d.loggedOn || D.today)}` : "";
    return [src, why].filter(Boolean).join(" · ") + sig + late + " " + tierBadge(d);
  }
  const predCell = (d) => d.pred && !K.needsReason(d) ? `${U.esc(d.pred.replace(/ in (\d+)d/, ""))} ${U.num(K.horizon(d) + "d")} · ${U.conf(d.conf)}` : "";
  function resultCell(d) {
    if (K.needsReason(d)) return `<button class="btn ${CA.state.phase === "day1" ? "btn-secondary" : "btn-primary"} btn-sm" data-drawer="addwhy" data-id="${d.id}">Add why</button>`;
    if (isOutside(d)) return `<span class="small muted">Context only</span>`;
    if (d.status === "reason") return `<span class="muted small">No prediction</span>`; /* recalled with a reason only */
    if (d.status === "cant" && d.tier === "unconnected") return `<span class="small muted">Waits for a connection</span>`;
    if (d.status === "noise" && d.move) return `${U.stamp(d)}<span class="lg-sub">${U.esc(d.move)} · range ${U.esc(d.band)}</span>`;
    return U.stamp(d);
  }
  function leadCell(d) {
    if (isOutside(d)) return `<span class="lg-hollow">${U.icon(d.type || "hold")}</span>`;
    return U.lead(d);
  }

  /* ---------- the detail panel opened in place ---------- */
  const brier = (d) => {
    if (d.score) return d.score;
    const p = (d.conf || 5) / 10;
    return (d.status === "hit" ? (1 - p) ** 2 : p ** 2).toFixed(2);
  };
  const scoreTxt = (s) => `<span class="lg-score" title="Brier score: how far your confidence was from what happened">Score ${U.num(s)} · lower is better</span>`;
  function hash(s) { let h = 7; for (const ch of String(s)) h = (h * 31 + ch.charCodeAt(0)) % 100000; return h; }
  function detail(d) {
    const who = d.who ? P(d.who) : null;
    const h = K.horizon(d), dt = K.dateOf(d), tz = (U.acct(d.acct)?.tz || "New York").replace(" ", "_");
    const metric = (d.pred || "CPA").split(" ")[0];
    const level = /Ad set|LAL|Broad|Interests/.test(d.camp) ? "ad set" : "campaign";
    const graded = ["hit", "miss", "noise"].includes(d.status);
    const sayer = d.who === "sam" ? "You said" : who ? `${U.esc(who.short)} said` : "Said";
    const stampWord = { hit: "hit", miss: "miss", noise: "within noise" };
    let pr;
    if (graded) {
      const mv = K.pct(d.move), inside = d.status === "noise";
      const aiRes = d.aiResult || (d.status === "noise" ? "hit" : "noise");
      const baseRes = inside ? "hit" : "miss";
      pr = `<div class="lg-cmp"><span>${sayer}</span><span><b>${U.esc(d.pred.replace(/ in \d+d/, ""))}</b> within ${h} days · ${U.conf(d.conf)} · on the ${level}</span><span>${U.stamp(d)}</span></div>
        ${K.meter(d)}
        <p class="lg-p">${U.esc(metric)} moved <b class="num">${U.esc(d.move)}</b>. The normal range for this ${level} over ${h} days is <b class="num">${U.esc(d.band)}</b>, so this ${inside ? "is within noise" : d.status === "hit" ? "cleared the range the way you called it" : "cleared the range the other way"}. ${scoreTxt(brier(d))}.</p>
        <div class="lg-cmp" style="margin-top:10px"><span>AI</span><span><b>${U.esc(d.ai || (inside ? `${metric} =` : "no change"))}</b> · ${U.conf(6)} · ${scoreTxt(aiRes === "hit" ? "0.16" : "0.36")}</span><span><span class="stamp ref">AI ${stampWord[aiRes]}</span></span>
          <span>Baseline</span><span>Usually same here: ↑ ${U.num("22%")} · = ${U.num("52%")} · ↓ ${U.num("26%")} · ${scoreTxt(baseRes === "hit" ? "0.23" : "0.27")}</span><span><span class="stamp ref">Baseline ${baseRes}</span></span></div>
        <p class="small lg-p"><span class="lab">AI's reason</span> ${d.type === "bid" ? "Raising a bid cap usually lifts cost per click before it lifts sales; a move bigger than the normal range was less likely than staying put." : d.type === "creative" ? "New creative on a fatigued ad set usually recovers click-through within a week, but the size of the lift is often inside the account's normal swing." : "Changes of this size on this account have mostly landed inside the normal range in the last 90 days."}</p>`;
    } else if (K.needsReason(d)) {
      pr = `<p class="lg-p">No reason or prediction yet. Add why to explain it: it counts for your history and capture rate, not for rankings.</p><button class="btn btn-secondary btn-sm" data-drawer="addwhy" data-id="${d.id}">Add why</button>`;
    } else if (d.status === "wait") {
      const m = /(\d+) of (\d+)/.exec(d.day || "");
      const res = K.addDays(dt, h + 1);
      pr = `<div class="lg-cmp"><span>${sayer}</span><span><b>${U.esc((d.pred || "").replace(/ in \d+d/, ""))}</b> within ${h} days · ${U.conf(d.conf)} · on the ${level}</span><span>${U.stamp(d)}</span></div>
        <p class="lg-p">Waiting: day ${U.num(m ? m[1] : 1)} of ${U.num(h)}. Result on <b>${K.fmt(res)}</b>, graded against this ${level}'s normal range.</p>
        <p class="lg-p muted"><span class="lg-lock">${U.icon("target")}AI's call locked until graded</span></p>`;
    } else if (isOutside(d)) {
      pr = `<p class="lg-p">Changed by someone outside your team. Shown so the chart makes sense; not counted in anyone's capture rate or grades.</p>`;
    } else if (d.status === "cant") {
      pr = `<div class="lg-cmp"><span>${sayer}</span><span><b>${U.esc((d.pred || "").replace(/ in \d+d/, ""))}</b> within ${h} days · ${U.conf(d.conf)}</span><span></span></div><p class="lg-p">${d.tier === "unconnected" ? `Can't be graded until ${U.esc(acctName(d.acct))} is connected. The call is kept and graded from the day it connects.` : "Can't be graded: too few sales in the window to tell a move from noise."}</p>`;
    } else {
      pr = `<p class="lg-p">No prediction${d.type === "hold" ? ": reviewed and holding, nothing changed on purpose" : ""}.</p>`;
    }
    const spend = 1800 + (hash(d.id) % 4200), buys = Math.round(spend / (28 + (hash(d.id + "x") % 20)));
    const today = new Date(2026, 9, 23);
    let resolved = K.addDays(dt, h), gradedOn = K.addDays(dt, h + 1);
    if (graded && gradedOn > today) { gradedOn = today; resolved = K.addDays(today, -1); }
    const before = `${K.fmt(K.addDays(dt, -h))} – ${K.fmt(K.addDays(dt, -1))}`, after = `${K.fmt(K.addDays(dt, 1))} – ${K.fmt(graded ? resolved : K.addDays(dt, h))}`;
    const how = { plugin: "with the plugin at publish", manual: "by hand", history: "found in change history", outside: "outside your team" }[d.source] || "";
    return `<tr class="lg-detail"><td colspan="7"><div class="lg-det">
      <div class="lg-blk"><div class="lab">Changes</div><p><b>${U.esc(d.what)}</b> ${U.esc(d.detail)}</p><p class="muted">${level === "ad set" ? "Ad set" : "Campaign"} ${U.esc(d.camp)} · ${U.esc(acctName(d.acct))}</p>
        <div class="lab lg-mt">Why</div><p>${d.reason && !K.needsReason(d) ? U.esc(d.reason) : '<span class="muted">No reason yet</span>'}</p>${d.signals && d.signals.length ? `<p class="muted">Signals: ${U.esc(d.signals.join(", "))}</p>` : ""}
        <div class="lab lg-mt">Logged</div><p>${who ? U.esc(who.name) : "Not your team"} ${how} · ${U.num(d.date)}</p></div>
      <div class="lg-blk lg-wide"><div class="lab">Prediction → result</div>${pr}</div>
      <div class="lg-blk"><div class="lab">State when logged</div><p>${level === "ad set" ? "Ad set" : "Campaign"} last 7 days: ${U.num("$" + spend.toLocaleString("en-US"))} spend, ${U.num(buys)} purchases</p><p class="muted">Market note ${K.fmt(K.addDays(dt, -2))} · no season flags</p></div>
      <div class="lg-blk"><div class="lab">Windows (account time, America/${U.esc(tz)})</div><p>Before: ${U.num(before)}</p><p>After: ${U.num(after)}</p>${graded ? `<p class="muted">Resolved ${K.fmt(resolved)} · graded ${K.fmt(gradedOn)}</p>` : ""}</div>
      <div class="lg-blk"><div class="lab">Note (private)</div><p>${d.note ? U.esc(d.note) : '<span class="muted">No note.</span>'}</p>
        <div class="lg-acts"><button class="btn btn-secondary btn-sm" data-go="acct-${d.acct}-performance">See on chart</button><button class="btn btn-sm lg-ghost" data-toast="Notes stay private to Harbor Media and are never sent to the AI">Edit note</button></div></div>
    </div></td></tr>`;
  }

  /* ---------- table ---------- */
  function sortRows(rows) {
    return rows.map((d, i) => ({ d, i, t: K.dateOf(d).getTime() }))
      .sort((a, b) => b.t - a.t || (b.d.loggedAt || 0) - (a.d.loggedAt || 0) || a.i - b.i).map((x) => x.d);
  }
  function matches(d) {
    if (LS.acct && d.acct !== LS.acct) return false;
    if (LS.who && d.who !== LS.who) return false;
    if (LS.status) {
      const s = LS.status;
      if (s === "needs" && !K.needsReason(d)) return false;
      if (s === "recalled" && d.tier !== "recalled") return false;
      if (s === "outside" && !isOutside(d)) return false;
      if (!["needs", "recalled", "outside"].includes(s) && d.status !== s) return false;
    }
    if (LS.q) {
      const hay = [d.what, d.detail, d.camp, d.reason, d.pred, acctName(d.acct), d.who ? P(d.who)?.name : "outside", d.date].join(" ").toLowerCase();
      if (!LS.q.toLowerCase().split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    return true;
  }
  const filtered = () => !!(LS.acct || LS.who || LS.status || LS.q);
  function rowHtml(d) {
    const cls = [K.needsReason(d) && CA.state.phase !== "day1" ? "needs" : "", isOutside(d) ? "lg-outside" : "", LS.open === d.id ? "lg-open" : "", LS.fresh === d.id ? "lg-fresh" : ""].filter(Boolean).join(" ");
    const what = isOutside(d) ? `<b>Changed outside your team</b> · ${U.esc(d.what)} ${U.esc(d.detail)} · ${U.esc(d.camp)}` : `<b>${U.esc(d.what)}</b> ${U.esc(d.detail)} <span class="muted">· ${U.esc(d.camp)}</span>`;
    return `<tr class="lg-row ${cls}" data-lrow="${d.id}" tabindex="0" aria-expanded="${LS.open === d.id}"><td class="dt">${U.esc(d.date)}</td><td class="lg-lead">${leadCell(d)}</td>
      <td class="wc lg-wc">${what}<span class="lg-how">${howLine(d)}</span></td><td class="lg-ac">${U.acctTag(d.acct)}</td>
      <td class="tn">${d.who ? U.esc(P(d.who)?.short || "") : "Not your team"}</td><td class="tn">${predCell(d)}</td><td class="lg-st">${resultCell(d)}</td></tr>${LS.open === d.id ? detail(d) : ""}`;
  }
  function tableHtml(c) {
    const day1 = c.phase === "day1";
    const src = day1 ? H.history.concat(D.decisions.filter((d) => d._new)) : D.decisions;
    const rows = sortRows(src.filter(matches));
    if (!rows.length) {
      const bits = [LS.acct && `account ${acctName(LS.acct)}`, LS.who && `buyer ${P(LS.who)?.short}`, LS.status && `status “${statusLabel(LS.status)}”`, LS.q && `“${LS.q}”`].filter(Boolean).join(", ");
      return `<div class="lg-none"><h2 class="lg-nh">No decisions match ${U.esc(bits)}</h2><p class="muted">Try a wider filter, or clear them to see the whole log.</p><button class="btn btn-secondary btn-sm" data-lclear>Clear filters</button></div>`;
    }
    const groups = [];
    rows.forEach((d) => {
      const dt = K.dateOf(d), key = `${dt.getFullYear()}-${dt.getMonth()}`;
      let g = groups[groups.length - 1];
      if (!g || g.key !== key) { g = { key, label: `${new Date(dt).toLocaleString("en-US", { month: "long" })} ${dt.getFullYear()}`, rows: [] }; groups.push(g); }
      g.rows.push(d);
    });
    let body = "";
    const collapse = day1 && !filtered() && !LS.showOld && groups.length > 2;
    const visible = collapse ? groups.slice(0, 2) : groups;
    visible.forEach((g) => {
      body += `<tr class="lg-month"><td colspan="7">${g.label}${day1 ? ` · ${U.num(g.rows.length)} changes` : ""}</td></tr>` + g.rows.map(rowHtml).join("");
    });
    if (collapse) {
      const rest = groups.slice(2), n = rest.reduce((a, g) => a + g.rows.length, 0);
      body += `<tr class="lg-month"><td colspan="7">${rest[0].label.replace(/ \d+$/, (m) => m)} to ${rest[rest.length - 1].label} · ${U.num(n)} more changes · <button class="linkbtn u lg-show" data-lshow>show</button></td></tr>`;
    }
    return `<div class="tablewrap lg-wrap"><table class="lg-table"><caption class="sr">Decisions, newest first. Select a row to open it.</caption>
      <thead><tr><th scope="col">Date</th><th scope="col"><span class="sr">Type</span></th><th scope="col">What changed</th><th scope="col">Account</th><th scope="col">Buyer</th><th scope="col">Prediction</th><th scope="col" class="lg-rh">Result</th></tr></thead>
      <tbody>${body}</tbody></table></div>
      <p class="small muted lg-count">${U.num(rows.length)} ${rows.length === 1 ? "decision" : "decisions"}${filtered() ? " match" : ""} · click a row to open it</p>`;
  }
  const STATUSES = [["", "Any status"], ["needs", "Needs a reason"], ["wait", "Waiting"], ["hit", "Hit"], ["miss", "Miss"], ["noise", "Within noise"], ["none", "No prediction"], ["cant", "Can't be graded"], ["recalled", "Recalled"], ["outside", "Outside your team"]];
  const statusLabel = (s) => (STATUSES.find((x) => x[0] === s) || ["", s])[1];
  function filtersHtml(c) {
    const day1 = c.phase === "day1";
    const opt = (v, l, cur) => `<option value="${v}"${v === cur ? " selected" : ""}>${U.esc(l)}</option>`;
    const buyers = ["sam", "dana", "jordan", "maya", "alex", "priya"];
    return `<div class="lg-filters" role="search">
      <div class="lg-f"><label for="lg-acct">Account</label><select id="lg-acct" class="input">${opt("", "All accounts", LS.acct)}${D.accounts.map((a) => opt(a.id, a.name, LS.acct)).join("")}</select></div>
      <div class="lg-f"><label for="lg-who">Buyer</label><select id="lg-who" class="input">${opt("", "Everyone", LS.who)}${buyers.map((b) => opt(b, P(b).name, LS.who)).join("")}</select></div>
      <div class="lg-f"><label for="lg-status">Status</label><select id="lg-status" class="input">${(day1 ? STATUSES.filter((s) => ["", "needs", "recalled", "wait"].includes(s[0])) : STATUSES).map(([v, l]) => opt(v, l, LS.status)).join("")}</select></div>
      <div class="lg-f lg-fq"><label for="lg-q">Search the log</label><input id="lg-q" class="input" type="search" placeholder="Budget, Prospecting, fatigue…" value="${U.esc(LS.q)}"></div>
      <button class="btn btn-sm lg-ghost lg-clear" data-lclear${filtered() ? "" : " hidden"}>Clear filters</button>
    </div>`;
  }

  CA.views.log = {
    title: "Decision log",
    nav: "log",
    render(c) {
      const day1 = c.phase === "day1";
      const head = `<div class="titlebar lg-title"><h1 class="lg-h1">Decision log</h1><span><button class="btn btn-secondary" data-drawer="log" data-mode="hold">${U.icon("hold")}Reviewed, holding</button></span></div>`;
      if (day1) {
        return `<div class="lg">${head}
          <div class="lg-intro"><h2 class="lg-nh">Your last 12 months are in: 214 changes from Facebook</h2>
            <p>We pulled every change Facebook still keeps for your 5 accounts. Add why to the ones you remember; it helps your history, not rankings. From today, decisions you log with the plugin at publish are graded against each account's normal range. First results on Oct 31 for a 7-day call logged today.</p>
            <button class="btn btn-primary" data-toast="Opens the Chrome Web Store page for the CatchAll plugin. About a minute to install.">Install the plugin</button> <span class="small muted" style="margin-left:8px">About a minute in Chrome</span></div>
          ${filtersHtml(c)}<div id="lg-table">${tableHtml(c)}</div></div>`;
      }
      const needs = K.rowsNeeding(), me = K.me(c), mine = needs.filter((d) => d.who === me).length;
      const bar = needs.length ? `<div class="needsbar lg-needs"><span><b>${U.num(needs.length)} ${needs.length === 1 ? "change needs" : "changes need"} a reason</b> · ${mine ? `${U.num(mine)} of them ${mine === 1 ? "is" : "are"} yours` : `across ${new Set(needs.map((d) => d.who)).size} buyers`} · found in this morning's sync with Facebook</span>
        <button class="btn btn-secondary btn-sm" data-lonly aria-pressed="${LS.status === "needs"}">${LS.status === "needs" ? "Show everything" : "Show only these"}</button></div>` : "";
      return `<div class="lg">${head}${bar}${filtersHtml(c)}<div id="lg-table">${tableHtml(c)}</div></div>`;
    },
    mount(root, c) {
      const main = root.querySelector("#main") || root;
      const redraw = () => {
        const t = main.querySelector("#lg-table"); if (t) t.innerHTML = tableHtml(c);
        const cl = main.querySelector(".lg-clear"); if (cl) cl.hidden = !filtered();
      };
      const sel = (id, key) => { const el = main.querySelector(id); if (el) el.addEventListener("change", () => { LS[key] = el.value; LS.open = null; if (key === "status") CA.rerender(); else redraw(); }); };
      sel("#lg-acct", "acct"); sel("#lg-who", "who"); sel("#lg-status", "status");
      const q = main.querySelector("#lg-q");
      if (q) q.addEventListener("input", () => { LS.q = q.value.trim(); LS.open = null; redraw(); });
      main.addEventListener("click", (e) => {
        if (e.target.closest("[data-lclear]")) { Object.assign(LS, { acct: "", who: "", status: "", q: "", open: null }); CA.rerender(); return; }
        if (e.target.closest("[data-lonly]")) { LS.status = LS.status === "needs" ? "" : "needs"; LS.open = null; CA.rerender(); return; }
        if (e.target.closest("[data-lshow]")) { LS.showOld = true; redraw(); return; }
        const tr = e.target.closest("tr[data-lrow]");
        if (!tr || e.target.closest("button,a,select,input")) return;
        LS.open = LS.open === tr.dataset.lrow ? null : tr.dataset.lrow;
        LS.fresh = null;
        redraw();
        const again = main.querySelector(`tr[data-lrow="${tr.dataset.lrow}"]`); if (again) again.focus({ preventScroll: true });
      });
      main.addEventListener("keydown", (e) => {
        const tr = e.target.closest && e.target.closest("tr[data-lrow]");
        if (tr && e.target === tr && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); tr.click(); }
      });
      if (LS.fresh) setTimeout(() => { LS.fresh = null; }, 0);
    },
  };

  /* ================= the logging panel (Log a decision / Add why) ================= */
  const CHANNELS = ["Meta", "Google", "Email", "Site", "Other"];
  const METRICS = ["CPA", "ROAS", "Conversions", "CTR", "Spend", "CPM", "Revenue"];
  const seg = (name, items, cur, label) => `<div class="ld-seg" role="radiogroup" aria-label="${U.esc(label)}">${items.map(([v, l]) => `<label class="${v === cur ? "on" : ""}"><input type="radio" class="sr" name="${name}" value="${U.esc(v)}"${v === cur ? " checked" : ""}>${l}</label>`).join("")}</div>`;
  const chips = (name, list, on = []) => `<div class="ld-chips">${list.map((v) => `<label class="chip ld-chip${on.includes(v) ? " on" : ""}"><input type="checkbox" class="sr" name="${name}" value="${U.esc(v)}"${on.includes(v) ? " checked" : ""}>${U.esc(v)}</label>`).join("")}</div>`;
  const step = (n, t, extra = "") => `<div class="ld-step"><i>${n}</i>${t}${extra}</div>`;
  const opts = (list, cur) => list.map((v) => { const [val, lab] = Array.isArray(v) ? v : [v, v]; return `<option value="${U.esc(val)}"${val === cur ? " selected" : ""}>${U.esc(lab)}</option>`; }).join("");
  function snapNote(acct) {
    const a = U.acct(acct);
    if (!a) return "";
    if (a.status === "none") return `<span class="ld-warn">${U.esc(a.name)} isn't connected yet. The call is kept and graded once it connects.</span>`;
    if (a.status === "warn") return `Connected · latest snapshot ${U.esc(a.synced)} · ${U.esc(a.note)}`;
    return `Connected · latest snapshot today ${U.num(a.synced)} (America/${U.esc(a.tz.replace(" ", "_"))})`;
  }
  function predictionFields(pre = {}, optional = false) {
    return `<div class="ld-sec">${step(optional ? 3 : 5, "What will happen", optional ? ' <span class="muted ld-opt">· optional</span>' : "")}
      <div class="ld-r2"><div class="field"><label for="ld-metric">Metric</label><select id="ld-metric" class="input">${opts(METRICS, pre.metric || "CPA")}</select></div>
        <div class="field"><span class="ld-lab" id="ld-dir-l">Direction</span>${seg("dir", [["up", "↑ up"], ["same", "= same"], ["down", "↓ down"]], pre.dir || "", "Direction")}<span class="help err" id="ld-err-dir" hidden>Pick a direction.</span></div></div>
      <div class="field"><span class="ld-lab">Within</span>${seg("within", [["7", "7 days"], ["14", "14 days"], ["30", "30 days"], ["custom", "Custom"]], pre.within || "7", "Within")}
        <div class="ld-custom" hidden><label for="ld-days">Days</label> <input id="ld-days" class="input ld-days" type="number" min="3" max="90" value="21"></div></div>
      <div class="field"><label for="ld-on">Measured on</label><select id="ld-on" class="input">${opts(pre.objects || [], pre.on)}</select><span class="help">Graded on Meta's numbers at the account's attribution setting.</span></div>
      <div class="field"><span class="ld-lab">How sure are you? <span class="ld-confout num" id="ld-confout">${pre.conf ? `${pre.conf} in 10` : ""}</span></span>${seg("conf", ["2", "3", "4", "5", "6", "7", "8", "9"].map((v) => [v, `<span class="num">${v}</span>`]), pre.conf ? String(pre.conf) : "", "How sure are you, out of 10")}<span class="help">Out of 10 calls like this, how many come true? No default.</span><span class="help err" id="ld-err-conf" hidden>Pick how sure you are.</span></div>
      <label class="ld-switch" for="ld-client"><input type="checkbox" id="ld-client" class="sr"${pre.client ? " checked" : ""}><span class="ld-sw" aria-hidden="true"></span>The client can see this prediction</label>
    </div>`;
  }
  function whyFields(n, pre = {}) {
    return `<div class="ld-sec" id="ld-why">${step(n, "Why")}
      <fieldset class="ld-fs"><legend class="sr">Reasons</legend>${chips("reason", D.reasons, pre.reasons || [])}</fieldset>
      <span class="help err" id="ld-err-reason" hidden>Pick at least one reason.</span>
      <div class="ld-lab ld-mt">Signals you saw</div>
      <fieldset class="ld-fs"><legend class="sr">Signals you saw</legend>${chips("signal", D.signals, pre.signals || [])}</fieldset>
    </div>`;
  }
  const noteField = (n, val = "") => `<div class="ld-sec">${step(n, "Note")}<label class="sr" for="ld-note">Private note</label><textarea id="ld-note" class="input ld-note" rows="3" placeholder="Private to your workspace. Never sent to the AI or research.">${U.esc(val)}</textarea><span class="help">Private to your workspace. Never sent to the AI or research.</span></div>`;

  function wireCommon(root) {
    const form = root.querySelector("form");
    form.addEventListener("change", (e) => {
      const t = e.target;
      if (t.type === "checkbox" && t.closest(".ld-chip")) t.closest(".ld-chip").classList.toggle("on", t.checked);
      if (t.type === "radio") {
        form.querySelectorAll(`input[name="${t.name}"]`).forEach((r) => r.closest("label").classList.toggle("on", r.checked));
        if (t.name === "conf") root.querySelector("#ld-confout").textContent = `${t.value} in 10`;
        if (t.name === "within") root.querySelector(".ld-custom").hidden = t.value !== "custom";
        if (t.name === "dir") root.querySelector("#ld-err-dir").hidden = true;
        if (t.name === "conf") root.querySelector("#ld-err-conf").hidden = true;
      }
      if (t.name === "reason") root.querySelector("#ld-err-reason").hidden = true;
    });
  }
  function readPrediction(root) {
    const f = root.querySelector("form");
    const v = (n) => (f.querySelector(`input[name="${n}"]:checked`) || {}).value || "";
    let within = v("within") || "7";
    if (within === "custom") within = String(Math.max(3, Math.min(90, +root.querySelector("#ld-days").value || 21)));
    return {
      dir: v("dir"), conf: v("conf") ? +v("conf") : null, h: +within,
      metric: root.querySelector("#ld-metric").value, on: root.querySelector("#ld-on").value,
      client: root.querySelector("#ld-client").checked,
      reasons: [...f.querySelectorAll('input[name="reason"]:checked')].map((x) => x.value),
      signals: [...f.querySelectorAll('input[name="signal"]:checked')].map((x) => x.value),
      note: root.querySelector("#ld-note").value.trim(),
    };
  }
  const ARROW = { up: "↑", same: "=", down: "↓" };
  function showErr(root, id, on) { const el = root.querySelector(id); if (el) el.hidden = !on; return on; }

  CA.drawers.log = {
    title: (c, data) => (data.mode === "hold" ? "Reviewed, holding" : "Log a decision"),
    kind: "drawer",
    render(c, data) {
      const acct = data.acct || "acme";
      const objs = H.objects[acct] || [];
      const preObj = data.camp ? objs.find((o) => o.includes(data.camp)) || objs[0] : objs[0];
      const fieldName = data.field || "Daily budget";
      const field = H.fields.find((f) => f.f === fieldName) || H.fields[0];
      const hold = data.mode === "hold";
      const from = data.from ? H.worth.find((w) => w.id === data.from) : null;
      return `<form id="ld-form" class="ld" novalidate>
        ${from ? `<div class="ld-from">From this week's report: ${from.title} on ${U.esc(acctName(from.acct))}</div>` : ""}
        <div class="ld-sec">${step(1, "Account and channel")}
          <label class="sr" for="ld-acct">Account</label><select id="ld-acct" class="input ld-full">${opts(D.accounts.map((a) => [a.id, a.name]), acct)}</select>
          <div class="ld-mt">${seg("channel", CHANNELS.map((x) => [x, x]), "Meta", "Channel")}</div>
          <div class="ld-snap" id="ld-snap">${snapNote(acct)}</div></div>
        <div class="ld-sec">${step(2, "What changed")}
          <div id="ld-meta"${hold ? " hidden" : ""}>
            <div class="field"><label for="ld-obj">Object</label><select id="ld-obj" class="input">${opts(objs, preObj)}</select></div>
            <div class="ld-r2"><div class="field"><label for="ld-field">Field</label><select id="ld-field" class="input">${opts(H.fields.map((f) => f.f), field.f)}</select></div>
              <div class="field"><label for="ld-new">New value</label><input id="ld-new" class="input" type="text" autocomplete="off" placeholder="e.g. $250"></div></div>
            <div class="ld-snap">From the latest snapshot: <span class="num" id="ld-old">${U.esc(field.old)}</span> → <span id="ld-newecho" class="num">…</span></div>
          </div>
          <div id="ld-free" hidden>
            <div class="field"><label for="ld-text">What changed</label><input id="ld-text" class="input" type="text" placeholder="e.g. Welcome flow, new subject line"></div>
            <div class="field"><label for="ld-type">Change type</label><select id="ld-type" class="input">${opts([["budget", "Budget"], ["bid", "Bid"], ["creative", "Creative"], ["audience", "Audience"], ["pause", "Pause"]], "creative")}</select></div>
          </div>
          <span class="help err" id="ld-err-change" hidden>Add the new value, or choose Nothing, reviewed and holding.</span>
          <label class="ld-hold" for="ld-hold"><input type="checkbox" id="ld-hold"${hold ? " checked" : ""}>${U.icon("hold")}<span>or <b>Nothing, reviewed and holding</b></span></label>
        </div>
        <div class="ld-sec">${step(3, "When it changed")}
          <label class="sr" for="ld-when">When it changed, account time</label><input id="ld-when" class="input" type="datetime-local" value="2026-10-23T09:30" max="2026-10-23T10:00">
          <div class="ld-late" id="ld-late" hidden><b>More than a day ago.</b> Entries logged more than a day after the change count for your history, not for rankings.</div></div>
        ${whyFields(4, { reasons: data.reason ? [data.reason] : [], signals: data.signal ? [data.signal] : [] })}
        ${predictionFields({ metric: data.metric, dir: hold ? "same" : "", objects: ["Whole account", ...objs], on: hold ? "Whole account" : preObj })}
        ${noteField(6)}
        <div class="dfoot ld-foot"><div class="small muted">Logged by hand, so it counts for your own accuracy, not rankings. Calls logged with the plugin at publish count toward rankings.</div>
          <div class="ld-btns"><button type="button" class="btn btn-secondary" data-close>Cancel</button><button type="submit" class="btn btn-primary">Log decision</button></div></div>
      </form>`;
    },
    mount(root, c, data) {
      wireCommon(root);
      const $ = (s) => root.querySelector(s);
      const sync = () => {
        const acct = $("#ld-acct").value, objs = H.objects[acct] || [];
        $("#ld-snap").innerHTML = snapNote(acct);
        const cur = $("#ld-obj").value;
        $("#ld-obj").innerHTML = opts(objs, objs.includes(cur) ? cur : objs[0]);
        const on = $("#ld-on").value;
        $("#ld-on").innerHTML = opts(["Whole account", ...objs], on);
      };
      $("#ld-acct").addEventListener("change", sync);
      const PH = { "Daily budget": "e.g. $250", "Bid cap": "e.g. $1.50", "Cost cap": "e.g. $28", Audience: "e.g. LAL 2% purchasers", Creative: "e.g. 3 new UGC ads", Status: "e.g. Paused" };
      const syncField = () => { const f = H.fields.find((x) => x.f === $("#ld-field").value); $("#ld-old").textContent = f.old; $("#ld-new").placeholder = PH[f.f] || ""; };
      $("#ld-field").addEventListener("change", syncField); syncField();
      $("#ld-new").addEventListener("input", () => { $("#ld-newecho").textContent = $("#ld-new").value || "…"; showErr(root, "#ld-err-change", false); });
      const setMode = () => {
        const hold = $("#ld-hold").checked, ch = (root.querySelector('input[name="channel"]:checked') || {}).value;
        $("#ld-meta").hidden = hold || ch !== "Meta";
        $("#ld-free").hidden = hold || ch === "Meta";
        showErr(root, "#ld-err-change", false);
        const h2 = root.closest(".drawer")?.querySelector(".dh h2"); if (h2) h2.textContent = hold ? "Reviewed, holding" : "Log a decision";
      };
      $("#ld-hold").addEventListener("change", setMode);
      root.querySelectorAll('input[name="channel"]').forEach((r) => r.addEventListener("change", setMode));
      const late = () => { const v = new Date($("#ld-when").value); $("#ld-late").hidden = !(v && NOW - v > 24 * 3600 * 1000); };
      $("#ld-when").addEventListener("input", late); late();
      $("#ld-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const p = readPrediction(root);
        const hold = $("#ld-hold").checked, ch = (root.querySelector('input[name="channel"]:checked') || {}).value;
        const errs = [
          showErr(root, "#ld-err-change", !hold && (ch === "Meta" ? !$("#ld-new").value.trim() : !$("#ld-text").value.trim())),
          showErr(root, "#ld-err-reason", !p.reasons.length),
          showErr(root, "#ld-err-dir", !p.dir),
          showErr(root, "#ld-err-conf", !p.conf),
        ];
        if (errs.some(Boolean)) {
          const first = root.querySelector(".help.err:not([hidden])");
          if (first) first.closest(".ld-sec, .field")?.scrollIntoView({ block: "center", behavior: "smooth" });
          CA.toast("A few things are missing: see the red notes");
          return;
        }
        const acct = $("#ld-acct").value, when = new Date($("#ld-when").value || "2026-10-23T09:30");
        const isLate = NOW - when > 24 * 3600 * 1000;
        const f = H.fields.find((x) => x.f === $("#ld-field").value);
        const obj = $("#ld-obj").value || "";
        const camp = hold ? (p.on === "Whole account" ? "whole account" : p.on.replace(/^\w+( set)? · /, "")) : ch === "Meta" ? obj.replace(/^\w+( set)? · /, "") : ch;
        const type = hold ? "hold" : ch === "Meta" ? f.type : $("#ld-type").value;
        const what = hold ? "Reviewed, holding" : ch === "Meta" ? (f.f === "Daily budget" ? "Budget" : f.f) : ch;
        const nv = $("#ld-new").value.trim();
        const detail = hold ? "" : ch === "Meta" ? (f.f === "Daily budget" ? `${f.old.replace("/day", "")} → ${nv.replace(/\/day$/, "")}/day` : `${f.old} → ${nv}`) : $("#ld-text").value.trim();
        const unconnected = U.acct(acct)?.status === "none";
        const d = {
          id: "n" + Date.now(), date: K.fmt(when), acct, who: K.me(c), type, what, detail, camp, source: "manual", status: "wait",
          pred: `${p.metric} ${ARROW[p.dir]} in ${p.h}d`, conf: p.conf, day: `1 of ${p.h}`, reason: p.reasons.join(", "), signals: p.signals, note: p.note,
          tier: isLate ? "late" : unconnected ? "unconnected" : undefined, changedOn: isLate ? K.fmt(when) : undefined, loggedOn: D.today,
          client: p.client, _new: true, loggedAt: Date.now(),
        };
        D.decisions.push(d);
        if (data.from) { const w = H.worth.find((x) => x.id === data.from); if (w) w.dismissed = true; }
        Object.assign(LS, { acct: "", who: "", status: "", q: "", open: null, fresh: d.id });
        CA.closeDrawer();
        CA.toast(`Logged. ${unconnected ? "It's graded once the account connects." : `Result on ${K.fmt(K.addDays(when, p.h + 1))}.`}${data.from ? " Removed from Worth considering." : ""}`);
        CA.rerender();
      });
    },
  };

  CA.drawers.addwhy = {
    title: "Add why",
    kind: "drawer",
    render(c, data) {
      const d = K.find(data.id);
      if (!d) return `<p class="muted">That change couldn't be found. It may have been explained already.</p><div class="dfoot"><span></span><button class="btn btn-secondary" data-close>Close</button></div>`;
      const a = U.acct(d.acct), who = d.who ? P(d.who) : null;
      const objs = H.objects[d.acct] || [];
      const on = objs.find((o) => o.includes(d.camp)) || "Whole account";
      return `<form id="ld-form" class="ld" novalidate>
        <div class="ld-sec">${step(1, "The change")}
          <div class="ld-ro"><b>${U.esc(d.what)}</b> ${U.esc(d.detail)} · ${U.esc(d.camp)}<div class="ld-snap">${U.esc(a?.name)} · Meta · ${U.num(d.date + ", 09:12")} (America/${U.esc((a?.tz || "New York").replace(" ", "_"))}) · made by ${who ? U.esc(who.name) : "someone"} in Ads Manager, found in change history</div></div>
          <div class="ld-snap">Not your change? <button type="button" class="linkbtn u" data-toast="We'll ask the team who made it; it moves to their list">Tell us who made it</button></div></div>
        ${whyFields(2)}
        ${predictionFields({ objects: ["Whole account", ...objs], on, within: "14" }, true)}
        ${noteField(4)}
        <div class="dfoot ld-foot"><div class="small muted">Reasons added after the change count for your history, not rankings. Once saved, this row is marked recalled.</div>
          <div class="ld-btns"><button type="button" class="btn btn-secondary" data-close>Cancel</button><button type="submit" class="btn btn-primary">Save reason</button></div></div>
      </form>`;
    },
    mount(root, c, data) {
      const d = K.find(data.id); if (!d) return;
      wireCommon(root);
      root.querySelector("#ld-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const p = readPrediction(root);
        const errs = [showErr(root, "#ld-err-reason", !p.reasons.length), showErr(root, "#ld-err-conf", !!p.dir && !p.conf)];
        if (errs.some(Boolean)) { CA.toast(p.reasons.length ? "Pick how sure you are, or clear the direction" : "Pick at least one reason"); return; }
        const was = K.needsReason(d);
        d.reason = p.reasons.join(", "); d.signals = p.signals; d.note = p.note; d.tier = "recalled";
        if (p.dir) Object.assign(d, { pred: `${p.metric} ${ARROW[p.dir]} in ${p.h}d`, conf: p.conf, status: "wait", day: `1 of ${p.h}` });
        else d.status = "none";
        if (was && D.decisions.includes(d)) D.me.needsReason = Math.max(0, D.me.needsReason - 1);
        LS.fresh = d.id;
        CA.closeDrawer();
        CA.toast(`Reason saved. ${U.acct(d.acct)?.short} ${d.what.toLowerCase()} is now marked recalled.`);
        CA.rerender();
      });
    },
  };

  /* ================= notifications (the bell) ================= */
  const NICON = { graded: "check", warn: "alert", info: "bell" };
  function notesHtml() {
    const unread = D.notifications.filter((n) => !n.read).length;
    return `<p class="small muted ld-nsum">${unread ? `${U.num(unread)} new` : "All caught up"}</p>
      <ul class="ld-nlist">${D.notifications.map((n, i) => `<li><button class="ld-nitem${n.read ? "" : " unread"}${n.kind === "warn" ? " warn" : ""}" data-go="${n.go}" data-nidx="${i}">
        <span class="ld-nic">${U.icon(NICON[n.kind] || "bell")}</span><span><span class="ld-nt">${U.esc(n.text)}</span><span class="ld-nw${/\d/.test(n.when) ? " num" : ""}">${U.esc(n.when)}</span></span>${n.read ? "" : '<span class="ld-dot"><span class="sr">unread</span></span>'}</button></li>`).join("")}</ul>
      <div class="dfoot"><button class="btn btn-sm lg-ghost" data-go="prefs">Notification settings</button><button class="btn btn-secondary btn-sm" id="ld-markall"${unread ? "" : " disabled"}>Mark all read</button></div>`;
  }
  function patchBell() {
    const unread = D.notifications.filter((n) => !n.read).length;
    const bell = document.querySelector(".topbar .bell");
    if (!bell) return;
    const b = bell.querySelector("b");
    if (!unread && b) b.remove(); else if (b) b.textContent = unread;
    bell.setAttribute("aria-label", unread ? `Notifications, ${unread} new` : "Notifications");
  }
  CA.drawers.notifications = {
    title: "Notifications",
    kind: "drawer",
    render() { return `<div id="ld-notes">${notesHtml()}</div>`; },
    mount(root) {
      root.addEventListener("click", (e) => {
        const it = e.target.closest("[data-nidx]");
        if (it) { D.notifications[+it.dataset.nidx].read = true; return; }
        if (e.target.closest("#ld-markall")) {
          D.notifications.forEach((n) => (n.read = true));
          root.querySelector("#ld-notes").innerHTML = notesHtml();
          patchBell();
          CA.toast("All notifications marked read");
        }
      });
    },
  };
})();
