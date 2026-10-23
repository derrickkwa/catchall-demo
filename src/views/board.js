/* Leaderboard (mockup 05): Team and Global tabs, season picker (October provisional, September final),
   medals, trophies, the top-N prize line ("rules pending"), the You card with the gap bar, Not ranked yet,
   How you get ranked + Full rules dialog. Day one: empty board that works with zero ranked. */
(function () {
  const st = () => CA.state;
  const season = () => st().boardSeason || "oct";

  function nameOf(U, r) { return r.label || (U.person(r.who) || {}).name || r.name || ""; }

  function prizeLine(cols, final) {
    const n = CA.data.season.prizePlaces;
    return `<tr class="b-line"><td colspan="${cols}"><div class="pl">Prize places · top ${n}${final ? "" : " · rules pending"}</div></td></tr>`;
  }

  /* team table: buyers by rank, AI and baseline as reference rows at their skill position */
  function teamTable(c, rows, final) {
    const { U, D } = c, n = D.season.prizePlaces;
    const meId = c.role === "owner" ? "dana" : "sam";
    let html = "", lineDone = false;
    rows.forEach((r) => {
      if (r.ref) {
        html += `<tr class="b-ref"><td class="b-pos"><span class="rk">–</span></td><td>${U.esc(r.label)} <span class="stamp ref" style="margin-left:6px">Reference</span></td><td class="r">${r.calls}</td><td class="r">${r.skill}</td><td class="r">–</td><td class="r">${r.hit}%</td><td>${U.esc(r.cal)}</td><td class="r"></td></tr>`;
        return;
      }
      const me = r.who === meId;
      const trophy = r.rank <= n ? U.trophy() : "";
      if (r.rank === n + 1 && !lineDone) { html += prizeLine(8, false); lineDone = true; }
      html += `<tr class="${me ? "b-me" : ""}"><td class="b-pos">${U.medal(r.rank)}</td><td><span class="b-nm">${U.esc(nameOf(U, r))}${me ? `<span class="you">You</span>` : ""}${trophy}</span></td><td class="r">${r.calls}</td><td class="r">${r.skill}</td><td class="r">${r.vsAI}</td><td class="r">${r.hit}%</td><td>${U.esc(r.cal)}</td><td class="r">${U.mv(r.week)}</td></tr>`;
      if (r.rank === n && !lineDone) { html += prizeLine(8, false); lineDone = true; }
    });
    return `<div class="tablewrap b-table"><table><thead><tr><th style="width:48px">#</th><th>Buyer</th><th class="r">Calls</th><th class="r">Skill</th><th class="r">vs AI</th><th class="r">Hit rate</th><th>Calibration</th><th class="r">Week</th></tr></thead><tbody>${html}</tbody></table></div>`;
  }

  function globalTable(c, rows, extraMe) {
    const { U, D } = c, n = D.season.prizePlaces;
    let html = "", lineDone = false;
    rows.forEach((r) => {
      if (!lineDone && r.rank > n) { html += prizeLine(5, false); lineDone = true; }
      html += `<tr><td class="b-pos">${U.medal(r.rank)}</td><td><span class="b-nm">${U.esc(r.name)}&nbsp;<span class="muted">${U.esc(r.handle)}</span>${r.rank <= n ? U.trophy() : ""}</span></td><td class="r">${r.calls}</td><td class="r">${r.skill}</td><td class="r">${U.mv(r.week)}</td></tr>`;
    });
    html += `<tr class="b-ref"><td colspan="5" class="small" style="text-align:center"><span class="muted">${D.boardx.globalMore} more ranked buyers ·</span> <button class="linkbtn u" data-toast="The full global board would load here, ${D.boardx.globalMore + rows.length} ranked buyers">Show all</button></td></tr>`;
    if (extraMe) html += `<tr class="b-me"><td class="b-pos"><span class="rk">41</span></td><td><span class="b-nm">${U.esc(extraMe.name)}&nbsp;<span class="muted">@${U.esc(extraMe.handle)}</span><span class="you">You</span></span></td><td class="r">${extraMe.calls}</td><td class="r">${extraMe.skill}</td><td class="r">${U.mv("–")}</td></tr>`;
    return `<div class="tablewrap b-table"><table><thead><tr><th style="width:48px">#</th><th>Display name</th><th class="r">Calls</th><th class="r">Skill</th><th class="r">Week</th></tr></thead><tbody>${html}</tbody></table></div>`;
  }

  function header(c, tab) {
    const { D, U } = c;
    const s = season();
    const t = (k, tok, l) => `<button role="tab" class="${tab === k ? "on" : ""}" aria-selected="${tab === k}"${tab === k ? ' aria-current="page"' : ""} data-go="${tok}">${l}</button>`;
    return `<div class="titlebar"><h1 class="b-h1">Leaderboard</h1>
        <span><label class="sr" for="b-season">Season</label><select id="b-season" class="b-sel"><option value="oct"${s === "oct" ? " selected" : ""}>October 2026 · provisional</option><option value="sep"${s === "sep" ? " selected" : ""}>September 2026 · final</option></select></span></div>
      <div class="tabs" role="tablist" aria-label="Which board">${t("team", "board", `Team · ${U.esc(D.workspace.name)}`)}${t("global", "board-global", "Global")}</div>`;
  }

  function prov(final, D) {
    return final
      ? `<div class="b-prov"><span class="b-badge final">Final</span>September closed ${D.boardx.september.closed} · standings computed ${D.boardx.september.computed} · no more changes</div>`
      : `<div class="b-prov"><span class="b-badge">Provisional</span>Updates every morning. Final standings on ${D.season.final}, once every October call is graded.</div>`;
  }

  function rulesBox() {
    const E = CA.data.boardx.eligibility, U = CA.ui;
    return `<div class="box"><h3>How you get ranked <button class="linkbtn u small" data-drawer="boardrules">Full rules →</button></h3>
      <ul class="b-rules">
        <li>Ranked on <b>skill vs baseline</b>: how much better your calls are than the account's own history. Above 0 beats it.</li>
        <li>Only calls logged with the plugin at publish, on connected accounts, count. Small samples are pulled toward 0.</li>
        <li>To qualify: ${U.num(E.calls)} counted calls, ${U.num(E.spend)} spend and a capture rate of ${U.num(E.capture + "%")}. The top ${U.num(CA.data.season.prizePlaces)} hold prize places; the AI and the baseline never do.</li>
      </ul></div>`;
  }

  function notRanked(c) {
    const { D, U } = c;
    const list = [...D.notRanked, D.boardx.notRankedOwner];
    const meId = c.role === "owner" ? "dana" : "sam";
    return `<div class="sec b-sec"><div class="sech"><h3>Not ranked yet</h3><span class="small muted">What's missing this month</span></div>
      ${list.map((n) => `<div class="b-notyet"><span>${U.esc(U.person(n.who).name)}${n.who === meId ? `<span class="you">You</span>` : ""} · ${U.esc(n.note)}</span><b class="small">${U.esc(n.needs)}</b></div>`).join("")}</div>`;
  }

  /* the standing block: buyer (Sam, ranked #6) or owner (Dana, not ranked) */
  function standing(c) {
    const { D, U } = c, me = D.me, E = D.boardx.eligibility, n = D.season.prizePlaces;
    const ranked = D.board.filter((r) => !r.ref);
    const last = ranked.find((r) => r.rank === n);
    const top = Math.max(...ranked.map((r) => parseFloat(r.skill.replace("−", "-"))));
    const scaleMax = Math.ceil((top + 0.01) * 20) / 20; // to scale: 0 .. next 0.05 above the leader
    const pct = (v) => Math.max(0, Math.min(100, (parseFloat(String(v).replace("−", "-")) / scaleMax) * 100));
    const lastName = U.person(last.who).short;
    const seasonTxt = `<span class="season">OCTOBER · <b>${D.season.daysLeft} DAYS LEFT</b></span>`;
    if (c.role === "owner") {
      const meterBoxes = Array.from({ length: 20 }, (_, i) => `<i class="${i < 2 ? "f" : ""}"></i>`).join("");
      return `<section class="score"><div class="top"><h2 class="b-h3">Your standing</h2>${seasonTxt}</div><div class="tiles">
        ${U.tile("Team rank", "–", `Not ranked yet · ${U.num(18)} more counted calls to qualify`)}
        <div class="tile"><div class="k">Calls to qualify</div><div class="v">2/20</div><div class="b-meter b-meter20" role="img" aria-label="2 of 20">${meterBoxes}</div></div>
        ${U.tile("Team leader", ranked[0].skill, `${U.esc(U.person(ranked[0].who).name)} · ${U.num(ranked[0].calls)} calls`)}
        ${U.tile("Prize line", last.skill, `${U.esc(U.person(last.who).name)} holds #${n}, the last prize place`)}
      </div></section>`;
    }
    const gapTo = (parseFloat(last.skill) - parseFloat(me.skill)).toFixed(2);
    return `<section class="score"><div class="top"><h2 class="b-h3">Your standing</h2>${seasonTxt}</div><div class="tiles">
      <div class="tile"><div class="k">Team rank</div><div class="v">#${me.rank}<span class="b-of"> / ${me.of}</span></div>
        <div class="d"><span class="up">${me.moved}</span> this week · ${U.num(gapTo)} behind ${U.esc(lastName)} (#${n}, ${U.num(last.skill)}), the last prize place</div>
        <div class="b-gap" role="img" aria-label="Your skill ${me.skill}; the prize line is at ${last.skill}"><i style="width:${pct(me.skill)}%"></i><b style="left:${pct(last.skill)}%"></b></div>
        <div class="b-gapx"><span style="left:0">0.00</span><span style="left:${pct(last.skill)}%;transform:translateX(-10%);color:var(--gold)">${last.skill}</span></div></div>
      <div class="tile"><div class="k">Skill</div><div class="v">${me.skill}</div><div class="d">higher is better · after the small-sample adjustment</div></div>
      <div class="tile"><div class="k">You vs the AI</div><div class="v">${me.vsAI}</div><div class="d">closer on ${U.num(me.closerThanAI)} of the ${U.num(me.shared)} calls you both made</div>
        <div class="h2h" style="margin-top:6px"><span class="small">You</span><span class="bar" role="img" aria-label="You were closer on ${me.closerThanAI} of ${me.shared}"><i style="width:${(me.closerThanAI / me.shared) * 100}%;background:var(--action);display:block;height:8px"></i><i style="width:${100 - (me.closerThanAI / me.shared) * 100}%;background:var(--muted);display:block;height:8px"></i></span><span class="small">AI</span></div></div>
      <div class="tile"><div class="k">Capture rate</div><div class="v">${me.capture}%</div><div class="d">need ${U.num(E.capture + "%")} · eligible this month</div>
        <ul class="b-elig"><li>${U.icon("check")}<span>${U.num(me.counted)}&nbsp;counted calls (need ${U.num(E.calls)})</span></li><li>${U.icon("check")}<span>${U.num(E.samSpend)}&nbsp;spend (need ${U.num(E.spend)})</span></li></ul></div>
    </div></section>`;
  }

  function teamOctober(c) {
    return `${prov(false, c.D)}${standing(c)}
      <div class="cols"><div>${teamTable(c, c.D.board)}${notRanked(c)}</div><div class="rail">${rulesBox()}</div></div>`;
  }

  function teamSeptember(c) {
    const { D, U } = c, S = D.boardx.september;
    const meId = c.role === "owner" ? "dana" : "sam";
    const pod = S.rows.filter((r) => !r.ref && r.rank <= 3);
    const sam = S.rows.find((r) => r.who === "sam");
    const ai = S.rows.find((r) => r.ref === "ai");
    const youLine = c.role === "owner"
      ? `You weren't ranked in September (too few counted calls). ${U.num(D.season.prizePlaces)} buyers finished in prize places.`
      : `You finished <b>#${sam.rank} of ${S.rows.filter((r) => !r.ref).length}</b>, in a prize place, and ahead of the AI by ${U.num(sam.vsAI)}.`;
    return `${prov(true, D)}
      <section class="score"><div class="top"><h2 class="b-h3">September winners · ${U.esc(D.workspace.name)}</h2><span class="season">SEASON CLOSED</span></div>
        <div class="b-podium">${pod.map((r) => `<div class="tile">${U.medal(r.rank)}<div class="v" style="font-size:30px">${r.skill}</div><div class="d"><b>${U.esc(U.person(r.who).name)}</b>${r.who === meId ? `<span class="you">You</span>` : ""} · ${U.num(r.calls)} calls · ${U.num(r.hit + "%")} hit rate</div></div>`).join("")}</div>
        <p class="small" style="margin:12px 0 0">${youLine} The AI finished on ${U.num(ai.skill)}.</p></section>
      <div class="banner info"><span><b>Prizes: pending legal review.</b> The top ${D.season.prizePlaces} finished in prize places. Amounts appear only after legal signs off the contest rules. CatchAll staff can appear on the board but can't win cash prizes.</span></div>
      <div class="cols"><div>${teamTable(c, S.rows, true)}</div><div class="rail">${rulesBox()}</div></div>`;
  }

  function teamDay1(c) {
    const { D, U } = c;
    const meId = c.role === "owner" ? "dana" : "sam";
    const boxes = Array.from({ length: 20 }, () => `<i></i>`).join("");
    const logged = D.boardx.day1Logged;
    return `<section class="score"><div class="top"><h2 class="b-h3">October is under way</h2><span class="season">OCTOBER · <b>${D.season.daysLeft} DAYS LEFT</b></span></div><div class="tiles">
        ${U.tile("First grades", "Nov 6", "For a 7-day call logged today")}
        <div class="tile"><div class="k">Calls to qualify</div><div class="v">0/20</div><div class="b-meter b-meter20" role="img" aria-label="0 of 20">${boxes}</div></div>
        ${c.role === "owner" ? U.tile("Capture rate", "–", "Starts with your first publish") : U.tile("Capture rate", "100%", `today · ${U.num(2)} of ${U.num(2)} publishes logged`)}
        <div class="tile"><div class="k">Prize pool</div><div class="b-pend">Pending legal review</div><div class="d">Amounts appear once legal signs off</div></div>
      </div></section>
      <div class="cols"><div>
        <div class="empty b-empty1"><div><h2 class="b-h2">No one is ranked yet</h2><p style="margin:6px 0 12px;max-width:60ch">Calls are ranked once they're graded, and grading waits for the call's window plus 7 days for late sales. Calls logged with the plugin this week start landing on <span class="num">Nov 6</span>. Calls resolving in November count toward November's board.</p>
          <button class="btn btn-primary" data-toast="The Chrome plugin would open in the Chrome Web Store">Get the plugin</button></div></div>
        <div class="sec b-sec"><div class="sech"><h3>Logged so far</h3><span class="small muted">Counts toward the board once graded</span></div>
          ${logged.map((l) => `<div class="b-notyet"><span>${l.who === meId ? "<b>" : ""}${U.esc(U.person(l.who).name)}${l.who === meId ? `<span class="you">You</span></b>` : ""} · ${U.num(l.calls)} ${l.calls === 1 ? "call" : "calls"} logged</span><span class="small muted">First grade ${U.num(l.first)}</span></div>`).join("")}
          ${c.role === "owner" ? `<div class="b-notyet"><span><b>Dana Wells<span class="you">You</span></b> · ${U.num(0)} calls logged</span><span class="small muted">Log one today for a result on ${U.num("Nov 6")}</span></div>` : ""}
        </div></div><div class="rail">${rulesBox()}</div></div>`;
  }

  function globalTab(c) {
    const { D, U } = c;
    const s = season();
    const rows = s === "sep" ? D.boardx.globalSeptember : D.globalBoard;
    const handle = c.role === "owner" ? st().publicHandleDana : st().publicHandle;
    const meName = c.role === "owner" ? "Dana Wells" : "Sam Kim";
    const optIn = handle
      ? `<div class="banner info"><span><b>You're on the global board as @${U.esc(handle)}.</b> Only your handle, display name, calls and skill are shown.</span><button class="btn b-ghost btn-sm" data-go="profile">Change in Profile</button></div>`
      : `<div class="banner info"><span><b>You're not on the global board.</b> Set a public handle in your profile to appear. Only your handle, display name, calls and skill are shown: never accounts, clients or your team.</span><button class="btn btn-secondary btn-sm" data-go="profile">Set a public handle</button></div>`;
    const extra = handle && s === "oct" && c.role !== "owner" && c.phase !== "day1" ? { name: meName, handle, calls: D.me.counted, skill: D.me.skill } : null;
    const provHtml = s === "sep"
      ? `<div class="b-prov"><span class="b-badge final">Final</span>September closed Sep 30 · standings computed Oct 14 · no more changes</div>`
      : prov(false, D);
    return `${provHtml}${optIn}${globalTable(c, rows, extra)}
      <p class="small muted" style="margin:10px 0 0">Public and opt-in: the global board never shows accounts, clients, decisions or workspaces, and the AI and baseline aren't on it.</p>`;
  }

  CA.views.board = {
    title: "Leaderboard",
    nav: "board",
    render(c) {
      const tab = c.params[0] === "global" ? "global" : "team";
      let body;
      if (tab === "global") body = globalTab(c);
      else if (season() === "sep") body = c.phase === "day1"
        ? `<div class="empty b-empty1"><div><h2 class="b-h2">No September standings</h2><p style="margin:6px 0 0">${CA.ui.esc(c.D.workspace.name)} started on CatchAll in October, so its first season is October 2026.</p></div></div>`
        : teamSeptember(c);
      else body = c.phase === "day1" ? teamDay1(c) : teamOctober(c);
      return `<div class="b-board">${header(c, tab)}${body}</div>`;
    },
    mount(root) {
      const sel = root.querySelector("#b-season");
      if (sel) sel.addEventListener("change", () => { st().boardSeason = sel.value; CA.rerender(); const s = document.getElementById("b-season"); if (s) s.focus(); });
    },
  };

  CA.drawers.boardrules = {
    title: "How you get ranked",
    kind: "dialog",
    render() {
      const E = CA.data.boardx.eligibility, U = CA.ui, n = CA.data.season.prizePlaces;
      return `<div class="b-fullrules">
        <h3>What you're ranked on</h3>
        <p>Each graded call gets a score for how far your confidence was from what happened (lower is better). Your <b>skill</b> compares your average score with a baseline that only knows the account's own history: ${U.num("+0.10")} means your calls were 10% closer than the baseline. Above ${U.num("0.00")} beats it.</p>
        <p>Buyers with few calls are pulled toward ${U.num("0.00")}, so a lucky streak of five calls can't top the board.</p>
        <h3>What counts</h3>
        <ul><li>Calls logged with the plugin when you publish, on accounts your workspace has connected.</li>
        <li>Calls logged by hand count for your own accuracy and record, not the board.</li>
        <li>A call belongs to the season in which it's graded: its window, plus 7 days for Meta's late sales.</li></ul>
        <h3>To qualify for a season</h3>
        <ul><li>${U.num(E.calls)} counted calls</li><li>${U.num(E.spend)} of spend behind those calls</li><li>A capture rate of ${U.num(E.capture + "%")}: at least half of your changes on connected accounts logged</li></ul>
        <h3>Prizes</h3>
        <p>The top ${U.num(n)} eligible buyers hold prize places. The AI and the baseline are reference rows and never take a place. Amounts are pending legal review and appear only once the contest rules are signed off. Final standings come two weeks after a season closes, once every call is graded.</p>
        <div class="dfoot"><span class="small muted">Rules version · October 2026 · draft</span><button class="btn btn-secondary" data-close>Got it</button></div></div>`;
    },
  };
})();
