/* CatchAll demo: small render helpers shared by every view. Views return HTML strings. */
(function () {
  const D = CA.data;
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const num = (s) => `<span class="num">${esc(s)}</span>`;
  const person = (id) => D.people[id] || null;
  const acct = (id) => D.accounts.find((a) => a.id === id);
  const icon = (name, cls = "ico") => `<svg class="${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

  const stampFor = {
    hit: (d) => `<span class="stamp hit">Hit <span class="m">${esc(d.horizon || "7d")}</span></span>`,
    miss: (d) => `<span class="stamp miss">Miss <span class="m">${esc(d.horizon || "7d")}</span></span>`,
    noise: (d) => `<span class="stamp noise">Within noise <span class="m">${esc(d.horizon || "7d")}</span></span>`,
    wait: (d) => `<span class="stamp wait">Day ${esc(d.day || "")}</span>`,
    none: () => `<span class="muted small">No prediction</span>`,
    cant: () => `<span class="muted small">Can't be graded yet</span>`,
    outside: () => `<span class="muted small">Changed outside your team</span>`,
    reason: (d) => `<button class="btn btn-primary btn-sm" data-drawer="addwhy" data-id="${esc(d.id)}">Add why</button>`,
  };

  CA.ui = {
    esc, num, person, acct, icon,
    stamp(d) { return (stampFor[d.status] || (() => ""))(d); },
    conf(n) { return `${num(n)} in 10`; },
    av(id, size) {
      const p = person(id); if (!p) return "";
      return `<span class="av2" style="background:${p.color}${size ? `;width:${size}px;height:${size}px` : ""}" aria-hidden="true">${esc(p.initials)}</span>`;
    },
    acctTag(id) {
      const a = acct(id); if (!a) return "";
      return `<button class="tag2" data-go="acct-${a.id}-performance"><span class="adot" style="background:${a.color}"></span>${esc(a.short)}</button>`;
    },
    thumb(i, size = 32) {
      return `<span class="thumb" style="width:${size}px;height:${size}px;background:${D.thumbs[(i || 0) % D.thumbs.length]}" aria-hidden="true"></span>`;
    },
    ctype(type) {
      const map = { budget: "budget", creative: "creative", audience: "audience", bid: "bid", pause: "pause", hold: "hold" };
      return `<span class="ctype">${icon(map[type] || "hold")}</span>`;
    },
    lead(d) { return d.thumb ? CA.ui.thumb(d.thumb) : CA.ui.ctype(d.type); },
    /* the standard list row used by Home, the log and My calls */
    row(d, opts = {}) {
      const who = d.who ? (person(d.who)?.short || "") : "";
      const how = { plugin: "logged with the plugin", manual: "logged by hand", history: "from change history", outside: "changed outside your team" }[d.source] || "";
      const sub = opts.sub ?? [who, how, d.reason ? `“${esc(d.reason)}”` : ""].filter(Boolean).join(" · ");
      return `<div class="li" data-row="${esc(d.id)}">${CA.ui.lead(d)}<div><div class="w"><b>${esc(d.what)}</b> ${esc(d.detail)} <span class="muted">· ${esc(d.camp)}</span> ${CA.ui.acctTag(d.acct)}</div><div class="s">${sub}</div></div><div class="rowend">${CA.ui.stamp(d)}</div></div>`;
    },
    medal(rank) { return rank <= 3 ? `<span class="medal m${rank}">${rank}</span>` : `<span class="rk">${rank}</span>`; },
    mv(w) { if (!w || w === "–") return `<span class="mv s">–</span>`; return `<span class="mv ${w.startsWith("▲") ? "u" : "d"}">${esc(w)}</span>`; },
    trophy() { return `<span class="prize" title="Prize place">${icon("trophy")}</span>`; },
    sectionHead(title, right = "") { return `<div class="sech"><h3>${title}</h3>${right}</div>`; },
    banner(kind, html, action = "") { return `<div class="banner ${kind}"><span>${html}</span>${action}</div>`; },
    empty(title, body, action = "", art = "") {
      return `<div class="empty">${art ? `<div class="illus">${esc(art)}</div>` : ""}<div><h3 style="font-size:18px">${title}</h3><p class="muted" style="margin:6px 0 12px">${body}</p>${action}</div></div>`;
    },
    skelRows(n = 4) { return Array.from({ length: n }, () => `<div class="li"><span class="skel" style="width:32px;height:32px"></span><div><div class="skel" style="width:60%"></div><div class="skel" style="width:35%;margin-top:6px"></div></div><span class="skel" style="width:70px"></span></div>`).join(""); },
    tile(k, v, d, opts = {}) { return `<div class="tile${opts.cls ? " " + opts.cls : ""}"><div class="k">${k}</div><div class="v${opts.vcls ? " " + opts.vcls : ""}">${v}</div><div class="d">${d}</div></div>`; },
    go(token, label, cls = "") { return `<button class="${cls || "linkbtn"}" data-go="${esc(token)}">${label}</button>`; },
  };
})();
