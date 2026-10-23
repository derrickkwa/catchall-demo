/* My calls (mockup 04): numbers row, Waiting / Graded / Can't be graded, calibration, My record. */
(function () {
  const lock = `<svg class="ico" aria-hidden="true" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`;

  function acctLine(U, a) {
    const ac = U.acct(a);
    return ac ? `<span class="adot" style="background:${ac.color}"></span>${U.esc(ac.name)}` : "";
  }
  function lead(U, d) { return d.thumb ? U.thumb(d.thumb) : U.ctype(d.type); }
  function head(U, d) {
    const camp = d.camp && d.camp !== d.detail ? d.camp : "";
    return `<div class="w"><b>${U.esc(d.what)}</b> ${U.esc(d.detail)}${camp ? ` · <span class="muted">${U.esc(camp)}</span>` : ""}</div>`;
  }

  function waitRow(U, d) {
    const pct = d.late ? 100 : Math.max(6, Math.round((d.day / d.of) * 100));
    const stamp = d.late ? `<span class="stamp wait">Counting late sales</span>` : `<span class="stamp wait">Day <span class="m">${d.day} of ${d.of}</span></span>`;
    const logged = d.madeOn ? `changed ${d.madeOn}, logged by hand ${d.date}` : `logged ${d.date}`;
    return `<div class="li b-li" data-acct="${d.acct}">${lead(U, d)}<div>${head(U, d)}
      <div class="s">${acctLine(U, d.acct)} · ${U.esc(d.pred)} · ${U.conf(d.conf)} · ${logged}${d.madeOn ? ` <span class="b-tier">Late</span>` : ""}</div>
      <div class="prog b-prog" role="img" aria-label="${pct}% of the way to its result"><i style="width:${pct}%"></i></div></div>
      <div class="b-rt">${stamp}<span class="small muted">Result ${U.num(d.result)}</span><span class="b-lock">${lock}AI's call locked until graded</span></div></div>`;
  }

  const word = { hit: "hit", miss: "miss", noise: "within noise" };
  function gradedRow(U, d, x) {
    x = x || {};
    const metric = x.metric || d.metric || (d.pred || "").split(" ")[0];
    const moveTxt = d.status === "noise" ? "inside" : "past";
    const score = x.score || d.score;
    const aiPart = d.ai ? `AI said ${U.esc(d.ai)}${x.aiConf || d.aiConf ? `, ${U.num(x.aiConf || d.aiConf)} in 10` : ""}: ${word[d.aiResult] || d.aiResult}` : `No AI call: logged by hand after the change`;
    const base = x.base || d.base;
    const gradedOn = x.graded || d.graded || "";
    const stampCls = d.status === "noise" ? "noise" : d.status;
    const label = d.status === "noise" ? "Within noise" : d.status === "hit" ? "Hit" : "Miss";
    const tier = x.manual || d.tier === "late" ? ` <span class="b-tier">Late</span>` : "";
    return `<div class="li b-li" data-acct="${d.acct}">${lead(U, d)}<div>${head(U, d)}
      <div class="s">${acctLine(U, d.acct)} · ${U.esc(d.pred)} · ${U.conf(d.conf)}${tier}${d.isNew ? ` · <b class="b-new">New</b>` : ""}</div>
      <div class="b-s2">${U.esc(metric)} ${U.num(d.move)}, ${moveTxt} the normal range of ${U.num(d.band)}${score ? ` · <span title="Brier score: how far your confidence was from what happened. 0 is perfect.">Score ${U.num(score)} · lower is better</span>` : ""}<br>
      <span class="muted">${aiPart}${base ? ` · Baseline: ${word[base]}` : ""}</span>${x.manual || d.tier === "late" ? `<br><span class="muted">Logged late: counts for your accuracy, not the leaderboard.</span>` : ""}</div></div>
      <div class="b-rt"><span class="stamp ${stampCls}">${label} <span class="m">${U.esc(d.horizon || ((d.pred || "").match(/(\d+)\s?d/) || [0, 7])[1] + "d")} · ${gradedOn}</span></span><button class="linkbtn u small" data-go="log">See in the log</button></div></div>`;
  }

  function cantRow(U, d, kind) {
    const s2 = kind === "unc"
      ? `<span style="color:var(--warn)">Account not connected</span> · graded once an owner or admin connects it`
      : U.esc(d.why);
    const right = kind === "unc" ? `<span class="b-tier b-unc">Unconnected</span>` : `<span class="small muted">Too few sales</span>`;
    return `<div class="li b-li" data-acct="${d.acct}">${lead(U, d)}<div>${head(U, d)}
      <div class="s">${acctLine(U, d.acct)} · ${U.esc(d.pred)} · ${U.conf(d.conf)} · logged ${d.date}</div>
      <div class="b-s2">${s2}</div></div><div class="b-rt">${right}</div></div>`;
  }

  /* calibration chart: x = stated confidence 0..10, y = share that came true 0..100%, drawn to scale */
  function calChart(U, buckets) {
    const X = (c) => 30 + (c / 10) * 220, Y = (r) => 170 - r * 160;
    const maxN = Math.max(...buckets.map((b) => b.n));
    const pts = buckets.map((b) => {
      const x = X(b.conf), y = Y(b.yes / b.n), r = 3.5 + 6 * Math.sqrt(b.n / maxN);
      // keep each label clear of the spot-on diagonal: above it when the dot is above, below when below
      const above = y < 170 - ((x - 30) / 220) * 160;
      const [lx, ly, anchor] = above ? [x - r - 5, y + 4, "end"] : x < 140 ? [x + 6, y + r + 12, "start"] : [x, y + r + 13, "middle"];
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="var(--ink-2)"><title>Said ${b.label} in 10: came true ${b.yes} of ${b.n}</title></circle>
        <text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${anchor}">${b.label} · ${b.yes} of ${b.n}</text>`;
    }).join("");
    return `<svg class="b-cal" viewBox="0 0 260 200" width="100%" role="img" aria-label="Calibration: stated confidence against how often it came true">
      <rect x="30" y="10" width="220" height="160" fill="none" stroke="var(--rule)"/>
      <line x1="30" y1="90" x2="250" y2="90" stroke="var(--rule-soft)"/><line x1="140" y1="10" x2="140" y2="170" stroke="var(--rule-soft)"/>
      <line x1="30" y1="170" x2="250" y2="10" stroke="var(--control-edge)" stroke-dasharray="4 4"/>
      ${pts}
      <text x="30" y="188">0</text><text x="140" y="188" text-anchor="middle">5 in 10</text><text x="250" y="188" text-anchor="end">10</text>
      <text x="26" y="14" text-anchor="end">100%</text><text x="26" y="94" text-anchor="end">50%</text><text x="26" y="173" text-anchor="end">0%</text>
    </svg>
    <div class="legend" style="margin-top:2px"><span><i style="border-top:1.5px dashed var(--control-edge);height:0;width:14px"></i>Spot on</span><span><i style="background:var(--ink-2);border-radius:50%;width:10px"></i>Your calls (bigger = more)</span></div>`;
  }

  function meter(n, of) {
    return `<div class="b-meter" role="img" aria-label="${n} of ${of}">${Array.from({ length: of }, (_, i) => `<i class="${i < n ? "f" : ""}"></i>`).join("")}</div>`;
  }

  function recordBox(day1) {
    return `<div class="box"><h3>My record</h3>
      <p class="small" style="margin:0 0 10px">Your graded calls from every workspace you've worked in, without client or account names. You choose who sees it.</p>
      ${day1 ? `<p class="small muted" style="margin:0 0 10px">It starts with your first graded call on <span class="num">Oct 28</span>.</p>` : ""}
      <div class="b-btns"><button class="btn btn-secondary btn-sm" data-go="record">${CA.ui.icon("share", "ico b-ico14")}Share my record</button>
      <button class="btn b-ghost btn-sm" ${day1 ? `disabled title="Available after your first graded call"` : `data-toast="Your record PDF is being made. It downloads in a few seconds."`}>Download PDF</button></div></div>`;
  }

  function tabs(counts, on = "wait") {
    const t = (k, l) => `<button role="tab" class="${on === k ? "on" : ""}" aria-selected="${on === k}" data-tabset="calls:${k}">${l}</button>`;
    return `<div class="tabs" role="tablist" aria-label="Calls by state">${t("wait", `Waiting · ${counts[0]}`)}${t("graded", `Graded · ${counts[1]}`)}${t("cant", `Can't be graded · ${counts[2]}`)}</div>`;
  }

  function filters(U, D) {
    const mine = D.accounts.filter((a) => ["acme", "bloom", "north", "kettle", "peak"].includes(a.id));
    return `<span class="b-filters"><label class="sr" for="b-acct">Accounts</label><select id="b-acct" class="b-sel"><option value="">Accounts: all mine</option>${mine.map((a) => `<option value="${a.id}">${U.esc(a.name)}</option>`).join("")}</select>
      <label class="sr" for="b-cseason">Season</label><select id="b-cseason" class="b-sel"><option>October 2026</option><option value="sep">September 2026</option></select></span>`;
  }

  function renderMonth(c) {
    const { D, U } = c, me = D.me, X = D.calls;
    const mineDec = D.decisions.filter((d) => d.who === "sam");
    const fromLog = mineDec.filter((d) => d.status === "wait").map((d) => ({ ...d, day: parseInt(d.day, 10), of: parseInt(String(d.day).split(" of ")[1], 10), result: "Nov 3", pred: d.pred.replace(" in 7d", " in 7 days") }));
    const waiting = [X.waiting[0], ...fromLog, ...X.waiting.slice(1)];
    const graded = mineDec.filter((d) => ["hit", "miss", "noise"].includes(d.status));
    const unc = mineDec.filter((d) => d.status === "cant");
    const tiles = [
      U.tile("Hit rate", `${me.hitRate}%`, `${U.num(me.hits)} of ${U.num(me.graded)} graded · <span class="up">▲ 6 pts</span>`),
      U.tile("Skill", me.skill, "higher is better · vs the account's own history"),
      U.tile("You vs the AI", me.vsAI, `closer on ${U.num(me.closerThanAI)} of the ${U.num(me.shared)} calls you both made`),
      U.tile("Capture rate", `${me.capture}%`, `this week · ${U.num(10)} of ${U.num(14)} publishes logged`),
    ].join("");
    const askBtn = c.role === "owner"
      ? `<button class="btn btn-primary btn-sm" data-go="acct-acme-connection">Connect Peak Outdoors</button>`
      : `<button class="btn btn-primary btn-sm" data-toast="Asked Dana Wells and Jordan Lee to connect Peak Outdoors. You'll get a notification when it's done.">Ask your owner to connect</button>`;
    const shown = graded.length + X.gradedOlder.length;
    return `<div class="b-calls">
      <div class="titlebar"><h1 class="b-h1">My calls</h1>${filters(U, D)}</div>
      <section class="score" aria-label="Your season so far"><div class="tiles">${tiles}</div></section>
      <div class="cols"><div>
        ${tabs([me.waiting, me.graded, me.cantGrade])}
        <div data-tabpanel="calls:wait">
          <div class="b-listhead"><span><b>${me.waiting} calls waiting</b> · next result in 6 days (<span class="num">Oct 29</span>)</span><span class="small muted">After the window ends, a call waits 7 more days for Meta's late sales.</span></div>
          <div class="b-listpanel">${waiting.map((d) => waitRow(U, d)).join("")}</div>
        </div>
        <div data-tabpanel="calls:graded" hidden>
          <div class="b-listhead"><span><b>${U.num(me.hits)} hits</b> · ${U.num(me.misses)} misses · ${U.num(me.noise)} within noise</span><span class="small muted">Newest first</span></div>
          <div class="b-listpanel">${graded.map((d) => gradedRow(U, d, X.gradedExtra[d.id])).join("")}${X.gradedOlder.map((d) => gradedRow(U, d)).join("")}
            <div class="b-more"><span class="small muted">Showing ${shown} of ${me.graded}</span><button class="btn b-ghost btn-sm" data-toast="The other ${me.graded - shown} graded calls would load here">Show all ${me.graded}</button></div></div>
        </div>
        <div data-tabpanel="calls:cant" hidden>
          <div class="banner warn"><span><b>${unc.length} call is waiting on Peak Outdoors' connection.</b> Once an owner connects it, it's graded against data from before the call, so nothing you logged is lost.</span>${askBtn}</div>
          <div class="b-listpanel">${unc.map((d) => cantRow(U, d, "unc")).join("")}${X.cantExtra.map((d) => cantRow(U, d, "few")).join("")}</div>
        </div>
      </div>
      <div class="rail">
        <div class="box"><h3>Calibration <span class="small muted" style="font-weight:400">${U.num(me.graded)} graded</span></h3>
          ${calChart(U, X.calibration)}
          <p class="b-calsent">When you said ${U.num(7)} or ${U.num(8)} in 10, it came true ${U.num(6)} times out of ${U.num(11)}: a bit overconfident there. Your 5s and 6s came true more often than you said.</p></div>
        ${recordBox(false)}
      </div></div></div>`;
  }

  function renderDay1(c) {
    const { D, U } = c, X = D.calls;
    const list = X.day1;
    const tiles = [
      U.tile("First result", "Oct 28", "Your call logged by hand on Northpaw"),
      U.tile("Calls waiting", String(list.length), `${U.num(2)} with the plugin, ${U.num(1)} by hand`),
      U.tile("Capture rate", "100%", `today · ${U.num(2)} of ${U.num(2)} publishes logged`),
      U.tile("Calibration", "0/10", `Starts after ${U.num(10)} graded calls`),
    ].join("");
    return `<div class="b-calls">
      <div class="titlebar"><h1 class="b-h1">My calls</h1></div>
      <section class="score" aria-label="What's coming"><div class="tiles">${tiles}</div></section>
      <div class="empty b-empty1"><div><h2 class="b-h2">${list.length} calls waiting · first result on Oct 28</h2>
        <p style="margin:6px 0 12px;max-width:62ch">Each call is graded once its window ends and Meta's late sales have landed. Your two plugin calls from today land on <span class="num">Nov 6</span>. Log a few more this week and you'll have 10 graded by mid-November, when your calibration chart appears.</p>
        <button class="btn btn-primary" data-drawer="log">+ Log a decision</button></div></div>
      <div class="cols"><div>
        ${tabs([list.length, 0, 0])}
        <div data-tabpanel="calls:wait"><div class="b-listpanel">${list.map((d) => waitRow(U, d)).join("")}</div></div>
        <div data-tabpanel="calls:graded" hidden><div class="b-listpanel b-pad"><p style="margin:0"><b>Nothing graded yet.</b> <span class="muted">Your first result lands on <span class="num">Oct 28</span>; the stamp, the real move against the normal range and the AI's call appear here.</span></p></div></div>
        <div data-tabpanel="calls:cant" hidden><div class="b-listpanel b-pad"><p style="margin:0"><b>Nothing here.</b> <span class="muted">Calls on accounts nobody has connected, or with too few sales to tell, would wait here.</span></p></div></div>
      </div>
      <div class="rail">
        <div class="box"><h3>Calibration</h3>
          <p class="small" style="margin:0 0 10px">Shows after ${U.num(10)} graded calls: how often your 7-in-10 calls actually come true. ${U.num(0)} graded, ${U.num(10)} to go.</p>
          ${meter(0, 10)}<p class="small muted" style="margin:8px 0 0">At this pace, around <span class="num">Nov 13</span>.</p></div>
        ${recordBox(true)}
      </div></div></div>`;
  }

  CA.views.calls = {
    title: "My calls",
    nav: "calls",
    render(c) { return c.phase === "day1" ? renderDay1(c) : renderMonth(c); },
    mount(root) {
      const acct = root.querySelector("#b-acct");
      const apply = () => {
        const v = acct ? acct.value : "";
        root.querySelectorAll(".b-calls [data-tabpanel] .b-li").forEach((li) => { li.hidden = !!v && li.dataset.acct !== v; });
        root.querySelectorAll(".b-calls [data-tabpanel] .b-listpanel").forEach((p) => {
          const rows = [...p.querySelectorAll(".b-li")];
          let note = p.querySelector(".b-none");
          const none = rows.length && rows.every((r) => r.hidden);
          if (none && !note) { note = document.createElement("p"); note.className = "b-none muted small"; note.textContent = "None of your calls on this account here."; p.prepend(note); }
          if (!none && note) note.remove();
        });
      };
      if (acct) acct.addEventListener("change", () => {
        apply();
        CA.toast(acct.value ? `Showing your calls on ${acct.options[acct.selectedIndex].text}` : "Showing calls on all your accounts");
      });
      const ss = root.querySelector("#b-cseason");
      if (ss) ss.addEventListener("change", () => {
        if (ss.value === "sep") CA.toast("September's calls would load here: 27 graded, 63% hit rate, finished #4");
        ss.value = "October 2026";
      });
    },
  };
})();
