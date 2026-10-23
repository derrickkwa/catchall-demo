/* Team (mockup 13 T1–T3), workspace Settings (S1–S2) and Profile (P1–P2). State lives in memory (CA.state.ws). */
(function () {
  const D = CA.data, U = CA.ui;
  const TODAY = "Oct 23";

  /* ---------- in-memory state, one copy per moment so day one and a month in don't mix ---------- */
  function memberFrom(m) {
    const p = D.people[m.who];
    return { id: p.id, name: p.name, initials: p.initials, color: p.color, email: `${p.id}@${D.team.domain}`, role: m.role, linked: p.linked, calls: m.calls, capture: m.capture, hit: m.hit, noReason: m.noReason };
  }
  function ws(phase) {
    const s = (CA.state.ws = CA.state.ws || {});
    if (!s[phase]) {
      const day1 = phase === "day1";
      const day1Calls = { dana: 0, jordan: 3, maya: 1, sam: 3 };
      const members = (day1 ? D.team.members.filter((m) => D.team.day1Members.includes(m.who)) : D.team.members).map((m) => {
        const r = memberFrom(m);
        if (day1) { r.calls = day1Calls[m.who] || 0; r.hit = null; r.noReason = m.who === "sam" ? 214 : 0; r.capture = r.calls ? 100 : null; if (m.who === "maya") r.linked = false; }
        return r;
      });
      s[phase] = {
        members,
        invites: (day1 ? D.team.day1Invites : D.team.invites).map((i) => ({ ...i })),
        join: day1 ? null : { ...D.team.joinRequest },
        inviteRole: "Buyer",
        prefs: { name: D.workspace.name, plugin: "skippable", clientDefault: "off", clientSees: "marked", reportDay: "Monday", recip: { owners: true, buyers: true, clients: false }, cooling: false },
        profile: {
          sam: { name: "Sam Kim", globalOn: false, handle: "", fb: !day1, shared: !day1 },
          dana: { name: "Dana Wells", globalOn: false, handle: "", fb: true, shared: false },
        },
      };
    }
    return s[phase];
  }

  const roleWord = { owner: "Owner", admin: "Admin", buyer: "Buyer" };
  const av = (m) => `<span class="av2 b-av" style="background:${m.color}" aria-hidden="true">${U.esc(m.initials)}</span>`;
  const dash = (v, suf = "") => (v == null ? `<span class="muted">–</span>` : `${v}${suf}`);
  const warnIco = `<svg class="ico" aria-hidden="true"><use href="#i-alert"/></svg>`;

  /* ---------- Team ---------- */
  function teamOwner(c) {
    const S = ws(c.phase), meId = "dana";
    const join = S.join ? `<div class="needs b-join"><div class="sech"><h2 class="b-h3">Asking to join ${U.esc(D.workspace.name)}</h2><span class="small muted">from your @${D.team.domain} domain</span></div>
      <div class="li b-joinrow"><span class="av2 b-av" style="background:var(--c5)" aria-hidden="true">${S.join.initials}</span><span><span class="w"><b>${U.esc(S.join.name)}</b> · ${U.esc(S.join.email)}</span><br><span class="s">Asked ${S.join.asked} · will join as a buyer</span></span>
      <span class="b-btns"><button class="btn btn-primary btn-sm" data-act="approve">Approve</button><button class="btn b-ghost btn-sm" data-act="deny">Deny</button></span></div></div>` : "";
    const rows = S.members.map((m) => {
      const me = m.id === meId;
      const role = m.role === "owner" ? "Owner" : `<label class="sr" for="b-role-${m.id}">Role for ${U.esc(m.name)}</label><select id="b-role-${m.id}" class="b-sel b-role" data-act="role" data-who="${m.id}"><option value="buyer"${m.role === "buyer" ? " selected" : ""}>Buyer</option><option value="admin"${m.role === "admin" ? " selected" : ""}>Admin</option></select>`;
      const fb = m.linked ? `<span class="small">Linked</span>` : `<span class="b-flag">${warnIco}Not linked</span>`;
      const acts = [
        !m.linked ? `<button class="linkbtn u small" data-act="remind" data-who="${m.id}">Remind</button>` : "",
        !me && m.role !== "owner" ? `<button class="linkbtn u small" data-drawer="teamremove" data-who="${m.id}">Remove</button>` : "",
      ].filter(Boolean).join(" · ");
      return `<tr><td><div class="b-who">${av(m)}<span><b>${U.esc(m.name)}</b>${me ? `<span class="you">You</span>` : ""}<br><span class="b-e">${U.esc(m.email)}</span></span></div></td><td>${role}</td><td>${fb}</td><td class="r">${m.calls}</td><td class="r">${dash(m.capture, "%")}</td><td class="r">${dash(m.hit, "%")}</td><td class="r">${m.noReason}</td><td class="b-acts">${acts}</td></tr>`;
    }).join("");
    const client = c.phase === "day1" ? "" : `<tr><td><div class="b-who"><span class="av2 b-av" style="background:var(--c4)" aria-hidden="true">GH</span><span><b>${U.esc(D.team.client.name)}</b><br><span class="b-e">${U.esc(D.team.client.email)}</span></span></div></td><td>Client viewer <span class="muted small">· ${U.esc(D.team.client.acct)}</span></td><td class="small muted">n/a</td><td class="r muted">–</td><td class="r muted">–</td><td class="r muted">–</td><td class="r muted">–</td><td class="b-acts"><span class="small muted">Last viewed ${D.team.client.viewed}</span></td></tr>`;
    const unlinked = S.members.filter((m) => !m.linked);
    const invites = S.invites.length ? S.invites.map((i, ix) => `<div class="li b-inv"><span><span class="w">${U.esc(i.email)}</span><br><span class="s">${U.esc(i.role)} · sent ${U.esc(i.sent)} · ${i.expired ? `<span style="color:var(--warn)">expired</span>` : U.esc(i.note)}</span></span><span class="small b-btns"><button class="linkbtn u" data-act="resend" data-ix="${ix}">Resend</button><span class="muted">·</span><button class="linkbtn u" data-act="revoke" data-ix="${ix}">Revoke</button></span></div>`).join("") : `<p class="small muted" style="margin:8px 0 0">No pending invites.</p>`;
    const segRole = ["Buyer", "Admin", "Client viewer"].map((r) => `<button type="button" role="radio" aria-checked="${S.inviteRole === r}" class="${S.inviteRole === r ? "on" : ""}" data-invrole="${r}">${r}</button>`).join("");
    return `<div class="b-team">
      <div class="titlebar"><h1 class="b-h1">Team</h1><button class="btn btn-secondary" data-go="acct-acme-connection">Connections for all accounts →</button></div>
      ${c.phase === "day1" ? U.banner("info", `<b>${S.members.length} people have joined ${U.esc(D.workspace.name)} so far.</b> Invites are out to ${S.invites.length} more; their calls start counting the day they join.`) : ""}
      ${join}
      <div class="tablewrap b-table" style="max-height:none;margin-bottom:8px"><table>
        <thead><tr><th>Member</th><th>Role</th><th>Facebook</th><th class="r">Calls · Oct</th><th class="r">Capture rate</th><th class="r">Hit rate</th><th class="r">No reason yet</th><th><span class="sr">Actions</span></th></tr></thead>
        <tbody>${rows}${client}</tbody></table></div>
      <p class="help" style="margin:0 0 20px">${unlinked.length ? `${unlinked.map((m) => U.esc(m.name.split(" ")[0])).join(" and ")}'s Ads Manager changes show as "Changed by someone not linked to CatchAll yet" until they link Facebook. ` : ""}Capture rate: share of a buyer's changes on connected accounts that were logged; ${U.num("50%")} needed for the leaderboard. Hit rate shows "–" until a buyer has graded calls.</p>
      <div class="grid2">
        <form class="panel b-invite" novalidate><h2 class="b-h3" style="margin-bottom:10px">Invite people</h2>
          <div class="field"><label for="b-inv-email">Emails</label><input id="b-inv-email" class="input" type="text" inputmode="email" autocomplete="off" placeholder="buyer@${D.team.domain}, another@${D.team.domain}" aria-describedby="b-inv-help"><span id="b-inv-help" class="help">Separate several with commas. Anyone with a @${D.team.domain} email can also ask to join.</span></div>
          <div class="field"><span class="b-flabel" id="b-inv-role-l">Role</span><div class="seg" role="radiogroup" aria-labelledby="b-inv-role-l">${segRole}</div><span class="help">Admins can connect accounts and manage the team. Client viewers see one account, read-only.</span></div>
          <button class="btn btn-secondary" type="submit">Send invite</button></form>
        <div class="panel"><h2 class="b-h3" style="margin-bottom:6px">Pending invites</h2>${invites}</div>
      </div></div>`;
  }

  function teamBuyer(c) {
    const S = ws(c.phase);
    const rows = S.members.map((m) => `<tr><td><div class="b-who">${av(m)}<b>${U.esc(m.name)}</b>${m.id === "sam" ? `<span class="you">You</span>` : ""}</div></td><td>${roleWord[m.role]}</td></tr>`).join("");
    const admins = S.members.filter((m) => m.role !== "buyer").map((m) => m.name.split(" ")[0]);
    return `<div class="b-team">
      <div class="titlebar"><h1 class="b-h1">Team</h1><span class="muted small">Ask ${admins.join(" or ")} to invite someone or change roles.</span></div>
      <div class="tablewrap b-table" style="max-height:none;max-width:720px"><table><thead><tr><th>Member</th><th>Role</th></tr></thead><tbody>${rows}</tbody></table></div>
      <p class="help">How the team's calls compare is on the <button class="linkbtn u" data-go="board">Leaderboard</button>.</p></div>`;
  }

  function teamMount(root, c) {
    if (c.role !== "owner") return;
    const S = ws(c.phase);
    const el = root.querySelector(".b-team"); if (!el) return;
    el.addEventListener("click", (e) => {
      const b = e.target.closest("[data-act],[data-invrole]"); if (!b) return;
      if (b.dataset.invrole) {
        S.inviteRole = b.dataset.invrole;
        el.querySelectorAll("[data-invrole]").forEach((x) => { const on = x === b; x.classList.toggle("on", on); x.setAttribute("aria-checked", on); });
        return;
      }
      const act = b.dataset.act;
      if (act === "approve" && S.join) {
        const j = S.join;
        S.members.push({ id: "theo", name: j.name, initials: j.initials, color: "var(--c5)", email: j.email, role: "buyer", linked: false, calls: 0, capture: null, hit: null, noReason: 0 });
        S.join = null; CA.rerender(); CA.toast(`${j.name} joined as a buyer. We've emailed them a welcome and the plugin link.`);
      } else if (act === "deny" && S.join) {
        const j = S.join; S.join = null; CA.rerender(); CA.toast(`Request from ${j.name} denied. They won't be told why.`);
      } else if (act === "remind") {
        const m = S.members.find((x) => x.id === b.dataset.who);
        CA.toast(`Reminded ${m.name} to link Facebook, by email and on their Home.`);
      } else if (act === "resend") {
        const i = S.invites[+b.dataset.ix]; i.sent = TODAY; i.expired = false; i.note = "expires Oct 30"; CA.rerender(); CA.toast(`Invite sent again to ${i.email}`);
      } else if (act === "revoke") {
        const [i] = S.invites.splice(+b.dataset.ix, 1); CA.rerender(); CA.toast(`Invite to ${i.email} revoked. The link no longer works.`);
      }
    });
    el.addEventListener("change", (e) => {
      const s = e.target.closest("[data-act=role]"); if (!s) return;
      const m = S.members.find((x) => x.id === s.dataset.who); m.role = s.value;
      CA.toast(s.value === "admin" ? `${m.name} is now an admin: they can connect accounts and manage the team.` : `${m.name} is now a buyer.`);
    });
    const form = el.querySelector(".b-invite");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("#b-inv-email"), help = form.querySelector("#b-inv-help");
      const list = input.value.split(/[,\s]+/).map((x) => x.trim().toLowerCase()).filter(Boolean);
      const bad = list.filter((x) => !/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(x));
      const dup = list.filter((x) => S.members.some((m) => m.email === x) || S.invites.some((i) => i.email === x));
      const fail = (msg) => { help.textContent = msg; help.classList.add("err"); input.classList.add("b-err"); input.setAttribute("aria-invalid", "true"); input.focus(); };
      if (!list.length) return fail("Enter at least one email address.");
      if (bad.length) return fail(`"${bad[0]}" isn't an email address.`);
      if (dup.length) return fail(`${dup[0]} is already in the team or invited.`);
      list.slice().reverse().forEach((x) => S.invites.unshift({ email: x, role: S.inviteRole === "Client viewer" ? "Client viewer, Acme Skincare" : S.inviteRole, sent: TODAY, note: "expires Oct 30" }));
      CA.rerender();
      CA.toast(list.length === 1 ? `Invite sent to ${list[0]}` : `${list.length} invites sent`);
    });
  }

  CA.views.team = {
    title: "Team",
    nav: "team",
    render(c) { return c.role === "owner" ? teamOwner(c) : teamBuyer(c); },
    mount: teamMount,
  };

  CA.drawers.teamremove = {
    title: (c, d) => { const m = ws(c.phase).members.find((x) => x.id === d.who); return `Remove ${m ? m.name : "member"}?`; },
    kind: "dialog",
    render(c, d) {
      const m = ws(c.phase).members.find((x) => x.id === d.who);
      return `<p style="margin:0 0 10px">${U.esc(m.name)} loses access to ${U.esc(D.workspace.name)} straight away.</p>
        <ul class="b-cons"><li>Their decisions stay in the log, shown as "Former member".</li><li>They keep their own portable record of graded calls.</li><li>Accounts they connected keep syncing only if another owner or admin reconnects them.</li></ul>
        <div class="dfoot"><button class="btn b-ghost" data-close>Cancel</button><button class="btn b-danger" data-act="confirm">Remove ${U.esc(m.name.split(" ")[0])}</button></div>`;
    },
    mount(wrap, c, d) {
      wrap.querySelector("[data-act=confirm]").addEventListener("click", () => {
        const S = ws(c.phase), m = S.members.find((x) => x.id === d.who);
        S.members = S.members.filter((x) => x.id !== d.who);
        CA.closeDrawer(); CA.rerender(); CA.toast(`${m.name} was removed from ${D.workspace.name}`);
      });
    },
  };

  /* ---------- shared bits for Settings and Profile ---------- */
  const setRow = (h, d, body, cls = "") => `<div class="b-set${cls ? " " + cls : ""}"><div><h2 class="b-h4"${cls.includes("b-dz") ? ' style="color:var(--error)"' : ""}>${h}</h2>${d ? `<div class="d">${d}</div>` : ""}</div><div>${body}</div></div>`;
  const seg = (key, val, opts, label) => `<div class="seg" role="radiogroup" aria-label="${label}">${opts.map(([v, l]) => `<button type="button" role="radio" aria-checked="${val === v}" class="${val === v ? "on" : ""}" data-seg="${key}:${v}">${l}</button>`).join("")}</div>`;
  function settingsTabs(c, on) {
    if (c.role !== "owner") return `<div class="tabs" role="tablist"><button role="tab" class="on" aria-selected="true" aria-current="page">Profile</button></div>`;
    const t = (k, tok, l) => `<button role="tab" class="${on === k ? "on" : ""}" aria-selected="${on === k}"${on === k ? ' aria-current="page"' : ` data-go="${tok}"`}>${l}</button>`;
    return `<div class="tabs" role="tablist">${t("ws", "prefs", "Workspace")}${t("profile", "profile", "Profile")}</div>`;
  }

  /* ---------- Settings (workspace) ---------- */
  function prefsRender(c) {
    if (c.role !== "owner") return profileRender(c);
    const P = ws(c.phase).prefs;
    const chips = [["owners", "Owners and admins"], ["buyers", "Buyers (their own accounts)"], ["clients", "Client viewers (client version)"]]
      .map(([k, l]) => `<button type="button" class="chip${P.recip[k] ? " on" : ""}" aria-pressed="${P.recip[k]}" data-chip="${k}">${l}</button>`).join("");
    const exportBody = P.cooling
      ? `<div class="banner warn" style="margin:0 0 10px"><span><b>Export is cooling down.</b> You exported a few seconds ago. You can export again in an hour, or use the file we're emailing you.</span></div>
         <div class="b-btns"><button class="btn btn-secondary" disabled title="One export per hour">Export CSV</button><button class="btn b-ghost" disabled title="One export per hour">Export JSON</button></div>
         <p class="help">One export per hour. Every export is logged with who ran it. Last export: today by Dana Wells.</p>`
      : `<div class="b-btns"><button class="btn btn-secondary" data-act="export" data-fmt="CSV">Export CSV</button><button class="btn b-ghost" data-act="export" data-fmt="JSON">Export JSON</button></div>
         <p class="help">One export per hour. Every export is logged with who ran it. We'll email a download link when it's ready. Last export: Oct 2 by Jordan Lee.</p>`;
    const radios = [["marked", "Only predictions marked client-visible", "Reasons always show; other predictions show “Prediction not shared”."], ["all", "Every prediction", ""]]
      .map(([v, l, h]) => `<div class="b-cb"><input type="radio" name="b-clientsees" id="b-cs-${v}" value="${v}"${P.clientSees === v ? " checked" : ""}><label for="b-cs-${v}"><b>${l}</b>${h ? `<br><span class="help">${h}</span>` : ""}</label></div>`).join("");
    return `<div class="b-prefs">
      <div class="titlebar"><h1 class="b-h1">Settings</h1><button class="btn btn-primary" data-act="save">Save changes</button></div>
      ${settingsTabs(c, "ws")}
      <div class="panel b-panel">
        ${setRow("Workspace name", `Shown to your team and on client links (“Shared by …”).`, `<label class="sr" for="b-wsname">Workspace name</label><input id="b-wsname" class="input b-w320" value="${U.esc(P.name)}">`)}
        ${setRow("Plugin", "Whether buyers can skip the plugin when they join.", `${seg("plugin", P.plugin, [["skippable", "Skippable"], ["required", "Required"]], "Plugin")}<p class="help">Required: buyers must install it before they can use the app. Only plugin-logged calls count for the leaderboard either way.</p>`)}
        ${setRow("Client-visible by default", `The starting value of “client visible” on each new prediction. Buyers can change it per call.`, seg("clientDefault", P.clientDefault, [["on", "On"], ["off", "Off"]], "Client-visible by default"))}
        ${setRow("What client viewers see", "Applies to every client viewer and client link.", `<fieldset class="b-fs"><legend class="sr">What client viewers see</legend>${radios}</fieldset><p class="help">Notes, buyer rankings and AI inputs are never shown to clients.</p>`)}
        ${setRow("Weekly report", `Sent at ${U.num("07:00")} workspace time (${U.esc(D.workspace.tz)}).`, `<div class="field b-inline"><label for="b-day">Day</label><select id="b-day" class="b-sel">${["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((d) => `<option${P.reportDay === d ? " selected" : ""}>${d}</option>`).join("")}</select></div>
          <div class="field"><span class="b-flabel">Who gets it</span><div>${chips}</div></div>`)}
        ${setRow("Export", "Decisions, predictions, grades and snapshots for the whole workspace, plus the market research summary.", exportBody)}
        ${setRow("Delete workspace", "Owners only.", `<ul class="b-cons" style="margin-top:0"><li>Disconnects all ${D.accountCount} ad accounts and stops syncing.</li><li>Deletes ${U.esc(P.name)}'s decisions, predictions, grades, notes and reports after 30 days. Shared facts about the ad accounts stay for other workspaces that connected them.</li><li>Removes every member and client link. Buyers keep their own portable record.</li></ul><button class="btn b-danger" data-drawer="delws">Delete ${U.esc(P.name)}…</button>`, "b-dz")}
      </div></div>`;
  }

  function prefsMount(root, c) {
    if (c.role !== "owner") return profileMount(root, c);
    const P = ws(c.phase).prefs;
    const el = root.querySelector(".b-prefs"); if (!el) return;
    el.addEventListener("click", (e) => {
      const sg = e.target.closest("[data-seg]");
      if (sg) {
        const [k, v] = sg.dataset.seg.split(":"); P[k] = v;
        sg.parentElement.querySelectorAll("[data-seg]").forEach((x) => { const on = x === sg; x.classList.toggle("on", on); x.setAttribute("aria-checked", on); });
        return;
      }
      const ch = e.target.closest("[data-chip]");
      if (ch) { const k = ch.dataset.chip; P.recip[k] = !P.recip[k]; ch.classList.toggle("on", P.recip[k]); ch.setAttribute("aria-pressed", P.recip[k]); return; }
      const b = e.target.closest("[data-act]"); if (!b) return;
      if (b.dataset.act === "save") {
        const nm = el.querySelector("#b-wsname").value.trim();
        if (!nm) { CA.toast("The workspace needs a name"); el.querySelector("#b-wsname").focus(); return; }
        P.name = nm; CA.rerender(); CA.toast("Settings saved");
      } else if (b.dataset.act === "export") {
        P.cooling = true; CA.rerender(); CA.toast(`Export started. We'll email you a ${b.dataset.fmt} download link when it's ready, usually within 10 minutes.`);
      }
    });
    el.addEventListener("change", (e) => {
      if (e.target.name === "b-clientsees") P.clientSees = e.target.value;
      if (e.target.id === "b-day") P.reportDay = e.target.value;
    });
    el.addEventListener("input", (e) => { if (e.target.id === "b-wsname") P.name = e.target.value; });
  }

  CA.views.prefs = { title: "Settings", nav: "prefs", render: prefsRender, mount: prefsMount };

  CA.drawers.delws = {
    title: (c) => `Delete ${ws(c.phase).prefs.name}?`,
    kind: "dialog",
    render(c) {
      const S = ws(c.phase), name = S.prefs.name;
      return `<p class="small" style="margin:0 0 12px;color:var(--ink-2)">This disconnects ${U.num(D.accountCount)} accounts, removes ${U.num(S.members.length)} members and deletes the team's decision log after 30 days. It can't be undone after that.</p>
        <div class="field"><label for="b-delname">Type the workspace name to confirm</label><input id="b-delname" class="input" autocomplete="off" aria-describedby="b-delhelp"><span id="b-delhelp" class="help">Type “${U.esc(name)}” exactly.</span></div>
        <div class="dfoot"><button class="btn b-ghost" data-close>Cancel</button><button class="btn b-danger" data-act="del" disabled>Delete workspace</button></div>`;
    },
    mount(wrap, c) {
      const name = ws(c.phase).prefs.name;
      const inp = wrap.querySelector("#b-delname"), help = wrap.querySelector("#b-delhelp"), btn = wrap.querySelector("[data-act=del]");
      inp.addEventListener("input", () => {
        const v = inp.value, ok = v === name;
        btn.disabled = !ok;
        const wrong = v && !ok;
        help.textContent = wrong ? `Doesn't match “${name}”.` : ok ? "Matches. Deletion starts a 30-day countdown." : `Type “${name}” exactly.`;
        help.classList.toggle("err", !!wrong); inp.classList.toggle("b-err", !!wrong); inp.setAttribute("aria-invalid", wrong ? "true" : "false");
      });
      btn.addEventListener("click", () => { CA.closeDrawer(); CA.toast(`Demo only: ${name} would be scheduled for deletion in 30 days, with an email to every owner. Nothing was deleted.`); });
    },
  };

  /* ---------- Profile ---------- */
  const taken = () => D.globalBoard.map((g) => g.handle.replace("@", "").toLowerCase());
  function handleHelp(h) {
    if (!h) return { cls: "", txt: "Letters, numbers, dots; 3 to 20 characters." };
    if (!/^[a-z0-9.]{3,20}$/i.test(h)) return { cls: "err", txt: "Use 3 to 20 letters, numbers or dots." };
    if (taken().includes(h.toLowerCase())) return { cls: "err", txt: `@${h} is taken. Try another.` };
    return { cls: "ok", txt: "Available." };
  }
  function profileRender(c) {
    const who = c.role === "owner" ? "dana" : "sam";
    const P = ws(c.phase).profile[who];
    const owner = who === "dana";
    const hh = handleHelp(P.handle);
    const slug = (P.handle || (owner ? "danaw" : "samk")).toLowerCase();
    const global = `<div class="b-cb"><input type="checkbox" id="b-gon"${P.globalOn ? " checked" : ""}><label for="b-gon"><b>Show me on the global leaderboard</b>${P.globalOn ? "" : `<br><span class="help">You're off the public board. Your team still sees you on the team board.</span>`}</label></div>
      <div class="field b-handle"${P.globalOn ? "" : " hidden"}><label for="b-handle">Public handle</label><div class="b-prefix"><span class="muted">catchall.app/@</span><input id="b-handle" class="input" value="${U.esc(P.handle)}" autocomplete="off" aria-describedby="b-handlehelp"></div><span id="b-handlehelp" class="help ${hh.cls}">${hh.txt}</span></div>`;
    const tfa = owner
      ? `<p style="margin:0 0 8px"><b>On</b> · authenticator app, set up Oct 1 · ${U.num(8)} recovery codes left</p><p class="help" style="margin:0 0 8px">Required while you're an owner, so it can't be turned off.</p>`
      : `<p style="margin:0 0 8px"><b>On</b> · authenticator app, set up Oct 3 · ${U.num(6)} recovery codes left</p>`;
    const tfaBtns = `<div class="b-btns"><button class="btn b-ghost btn-sm" data-toast="10 new recovery codes made. The old ones stop working now.">New recovery codes</button><button class="btn b-ghost btn-sm" data-toast="We'd show a QR code to set up your new authenticator">Change device</button></div>`;
    const fb = P.fb
      ? `<p style="margin:0 0 8px"><b>Linked as ${U.esc(P.name)}</b> <span class="muted">· since Oct 1</span></p><button class="btn b-ghost btn-sm" data-act="unlink">Unlink</button><p class="help">If you unlink, new changes you make show as “Changed by someone not linked to CatchAll yet”.</p>`
      : `<div class="banner warn" style="margin:0 0 8px"><span><b>Not linked.</b> ${c.phase === "day1" ? "Changes you make in Ads Manager" : `${U.num(4)} changes you probably made`} show as “someone not linked to CatchAll yet” and don't count toward your capture rate.</span></div><button class="btn btn-secondary btn-sm" data-act="link">Link your Facebook</button><p class="help">Asks for no ad account access and connects nothing.</p>`;
    const rec = `<div class="b-cb"><input type="checkbox" id="b-share"${P.shared ? " checked" : ""}><label for="b-share"><b>Share my record at a public link</b>${P.shared ? `<br><span class="mono small">catchall.app/r/${U.esc(slug)}-7Q2F</span>` : `<br><span class="help">Off: only you can see your record.</span>`}</label></div>
      ${P.shared ? `<p class="small" style="margin:-4px 0 10px 26px"><button class="linkbtn u" data-toast="Link copied: catchall.app/r/${U.esc(slug)}-7Q2F">Copy link</button> · <button class="linkbtn u" data-toast="Old link turned off. Your new link is catchall.app/r/${U.esc(slug)}-K81D">Turn off and make a new link</button></p>` : ""}
      <div class="b-btns"><button class="btn btn-secondary btn-sm" data-go="record">Open my record</button><button class="btn b-ghost btn-sm" data-toast="Your record PDF is being made. It downloads in a few seconds.">Download PDF</button><button class="btn b-ghost btn-sm" data-toast="We'll email you a download of all your data within a day">Export my data</button></div>`;
    return `<div class="b-profile">
      <div class="titlebar"><h1 class="b-h1">Settings</h1><button class="btn btn-primary" data-act="save">Save changes</button></div>
      ${settingsTabs(c, "profile")}
      <div class="panel b-panel">
        ${setRow("Display name", "What your team sees, and the global board if you join it.", `<label class="sr" for="b-dname">Display name</label><input id="b-dname" class="input b-w320" value="${U.esc(P.name)}">`)}
        ${setRow("Global leaderboard", "Public, opt-in. Shows only your display name, handle, eligible calls and skill. Never accounts, clients or your team.", global)}
        ${setRow("Two-factor sign-in", "Optional for buyers; required for owners and admins.", tfa + tfaBtns)}
        ${setRow("Linked Facebook", "Credits the changes you make in Ads Manager to you. Gives CatchAll no ad account access.", fb)}
        ${setRow("My record", "Your graded calls across every workspace, without client names. It goes with you if you leave.", rec)}
        ${setRow("Delete account", "", `<ul class="b-cons" style="margin-top:0"><li>Removes you from ${U.esc(D.workspace.name)} and signs you out everywhere.</li><li>Decisions you logged stay in ${U.esc(D.workspace.name)}'s log, shown as “Former member”.</li><li>Your public record and handle are removed.</li></ul><button class="btn b-danger btn-sm" data-drawer="delacct">Delete my account…</button>`, "b-dz")}
      </div></div>`;
  }

  function profileMount(root, c) {
    const who = c.role === "owner" ? "dana" : "sam";
    const P = ws(c.phase).profile[who];
    const el = root.querySelector(".b-profile"); if (!el) return;
    const help = () => {
      const inp = el.querySelector("#b-handle"), h = el.querySelector("#b-handlehelp"); if (!inp) return;
      const r = handleHelp(inp.value.trim());
      h.textContent = r.txt; h.classList.toggle("err", r.cls === "err"); h.classList.toggle("ok", r.cls === "ok"); inp.classList.toggle("b-err", r.cls === "err");
    };
    el.addEventListener("input", (e) => {
      if (e.target.id === "b-handle") { P.handle = e.target.value.trim(); help(); }
      if (e.target.id === "b-dname") P.name = e.target.value;
    });
    el.addEventListener("change", (e) => {
      if (e.target.id === "b-gon") { P.globalOn = e.target.checked; CA.rerender(); if (P.globalOn) { const h = document.getElementById("b-handle"); if (h) h.focus(); } }
      if (e.target.id === "b-share") { P.shared = e.target.checked; CA.rerender(); CA.toast(P.shared ? "Your record is now at a public link" : "Public link turned off. Only you can see your record."); }
    });
    el.addEventListener("click", (e) => {
      const b = e.target.closest("[data-act]"); if (!b) return;
      const act = b.dataset.act;
      if (act === "unlink") { P.fb = false; CA.rerender(); CA.toast("Facebook unlinked. New changes won't be credited to you until you link again."); }
      if (act === "link") { P.fb = true; CA.rerender(); CA.toast(`Linked as ${P.name}. Your Ads Manager changes are credited to you from now on.`); }
      if (act === "save") {
        if (!P.name.trim()) { CA.toast("Your display name can't be empty"); el.querySelector("#b-dname").focus(); return; }
        if (P.globalOn) {
          const r = handleHelp(P.handle);
          if (!P.handle || r.cls === "err") { CA.toast(P.handle ? r.txt : "Choose a public handle to join the global board"); const h = el.querySelector("#b-handle"); if (h) h.focus(); return; }
        }
        const key = who === "dana" ? "publicHandleDana" : "publicHandle";
        CA.state[key] = P.globalOn ? P.handle : "";
        CA.toast(P.globalOn ? `Saved. You'll show on the global board as @${P.handle} from tomorrow morning's update.` : "Saved");
      }
    });
  }

  CA.views.profile = { title: "Profile", nav: "prefs", render: profileRender, mount: profileMount };

  CA.drawers.delacct = {
    title: "Delete your account?",
    kind: "dialog",
    render(c) {
      if (c.role === "owner") {
        return `<p style="margin:0 0 10px">You're the only owner of ${U.esc(D.workspace.name)}, so you can't delete your account yet.</p>
          <p class="small muted" style="margin:0 0 10px">Make another member an owner first, or delete the workspace.</p>
          <div class="dfoot"><button class="btn b-ghost" data-close>Cancel</button><span class="b-btns"><button class="btn btn-secondary" data-go="team">Go to Team</button><button class="btn b-ghost" data-go="prefs">Workspace settings</button></span></div>`;
      }
      return `<ul class="b-cons"><li>Removes you from ${U.esc(D.workspace.name)} and signs you out everywhere.</li><li>Your ${U.num(D.me.logged)} logged decisions stay in the team's log as “Former member”.</li><li>Your public record and handle are removed. Download your record first if you want to keep it.</li></ul>
        <div class="b-cb"><input type="checkbox" id="b-delok"><label for="b-delok">I understand this can't be undone after 30 days</label></div>
        <div class="dfoot"><button class="btn b-ghost" data-close>Cancel</button><button class="btn b-danger" data-act="delme" disabled>Delete my account</button></div>`;
    },
    mount(wrap, c) {
      const ok = wrap.querySelector("#b-delok"), btn = wrap.querySelector("[data-act=delme]");
      if (!ok) return;
      ok.addEventListener("change", () => { btn.disabled = !ok.checked; });
      btn.addEventListener("click", () => { CA.closeDrawer(); CA.toast("Demo only: your account would be deleted in 30 days, with an email to undo it. Nothing was deleted."); });
    },
  };
})();
