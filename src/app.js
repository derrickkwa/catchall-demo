/* CatchAll demo: router, app frame, demo bar, drawers, toasts.
   A view registers itself as CA.views[name] = { title, nav, frame (default true), render(ctx) -> html, mount?(root, ctx) }.
   A drawer registers as CA.drawers[name] = { title, render(ctx, data) -> html, mount?(root, ctx, data) }.
   Navigation tokens are plain words joined by "-": "home", "log", "acct-acme-health", "board-global". */
(function () {
  const D = CA.data, U = CA.ui;
  CA.views = CA.views || {};
  CA.drawers = CA.drawers || {};

  const store = {
    get(k, d) { try { const v = localStorage.getItem("ca-demo-" + k); return v == null ? d : v; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("ca-demo-" + k, v); } catch (e) {} },
  };
  const state = {
    role: store.get("role", "buyer"),      // buyer | owner | client
    phase: store.get("phase", "month"),    // month | day1
    token: "home",
  };
  CA.state = state;

  function ctx(params) { return { role: state.role, phase: state.phase, params, D, U, state }; }

  function parse(token) {
    const parts = String(token || "home").split("-").filter(Boolean);
    const name = parts[0] || "home";
    return { name: CA.views[name] ? name : "home", params: parts.slice(1) };
  }

  /* ---------- app frame ---------- */
  function sidebar(nav) {
    const owner = state.role === "owner";
    const mine = owner ? D.accounts : D.accounts.filter((a) => ["acme", "bloom", "north"].includes(a.id));
    const item = (tok, label, extra = "") => `<button class="navlink${nav === tok ? " on" : ""}" data-go="${tok}"${nav === tok ? ' aria-current="page"' : ""}>${label}${extra}</button>`;
    const acctItem = (a) => {
      const on = nav === "acct-" + a.id;
      const dot = a.status === "warn" ? `<span class="sdot w" title="${U.esc(a.note)}"></span>` : a.status === "none" ? `<span class="sdot n" title="${U.esc(a.note)}"></span>` : "";
      return `<button class="navlink${on ? " on" : ""}" data-go="acct-${a.id}-performance"><span><span class="adot" style="background:${a.color}"></span>${U.esc(a.name)}</span>${dot}</button>`;
    };
    const needs = state.phase === "day1" ? 214 : D.me.needsReason;
    return `<nav class="side" aria-label="Main">
      <div class="lbl">Your work</div>
      ${item("home", "Home")}${item("log", "Decision log", `<span class="n">${needs}</span>`)}${item("calls", "My calls")}${item("board", "Leaderboard")}
      <div class="lbl">Accounts</div>
      ${mine.map(acctItem).join("")}
      ${owner ? `<button class="navlink muted" data-toast="The full list has all 15 of Harbor Media's accounts">All ${D.accountCount} →</button>` : ""}
      <div class="lbl">Workspace</div>
      ${item("team", "Team")}${item("prefs", "Settings")}
      <div class="foot"><button class="navlink muted" data-toast="The Chrome plugin logs calls inside Ads Manager as you publish">Get the plugin</button><button class="navlink muted" data-go="board">How you get ranked</button></div>
    </nav>`;
  }
  function topbar() {
    const me = state.role === "owner" ? D.people.dana : D.people.sam;
    return `<header class="topbar">
      <button class="wm linkbtn" data-go="home" aria-label="CatchAll home">CatchAll<i>.</i></button>
      <button class="ws" data-toast="Switch between your team and personal workspaces">${U.esc(D.workspace.name)} ▾</button>
      <label class="search"><span class="sr">Search</span><input type="search" id="q" placeholder="Search accounts, decisions, codes"></label>
      <span class="sp"></span>
      <button class="btn btn-primary" data-drawer="log">+ Log a decision</button>
      <button class="bell" data-drawer="notifications" aria-label="Notifications, ${D.notifications.length} new">${U.icon("bell")}<b>${D.notifications.length}</b></button>
      <button class="av" data-go="profile" aria-label="Your profile">${U.esc(me.initials)}</button>
    </header>`;
  }
  function frame(nav, inner) {
    return `<div class="app">${topbar()}<div class="body">${sidebar(nav)}<main class="main" id="main">${inner}</main></div></div>`;
  }
  CA.frame = frame;

  /* ---------- demo bar (presenter controls, not part of the product) ---------- */
  const screens = [
    ["Your work", [["home", "Home"], ["log", "Decision log"], ["calls", "My calls"], ["board", "Leaderboard"]]],
    ["Account: Acme Skincare", [["acct-acme-performance", "Performance"], ["acct-acme-health", "Health"], ["acct-acme-market", "Market"], ["acct-acme-competitors", "Competitors"], ["acct-acme-audience", "Audience"], ["acct-acme-suggestions", "Suggestions"], ["acct-acme-reports", "Reports"], ["acct-acme-connection", "Connection"]]],
    ["Workspace", [["team", "Team"], ["prefs", "Settings"], ["profile", "Profile"]]],
    ["Outside the app", [["onboard", "Sign-up and onboarding"], ["client", "Client view"], ["public-board", "Public leaderboard"], ["record", "Shared track record"], ["shared-audit", "Shared audit"]]],
  ];
  function demobar() {
    const seg = (key, opts) => `<span class="dseg" role="group">${opts.map(([v, l]) => `<button class="${state[key] === v ? "on" : ""}" data-set="${key}:${v}" aria-pressed="${state[key] === v}">${l}</button>`).join("")}</span>`;
    return `<div class="demobar" role="region" aria-label="Demo controls">
      <span class="dlabel"><b>CatchAll</b> product demo · sample data</span>
      <span class="dgroup"><span class="dk">View as</span>${seg("role", [["buyer", "Buyer"], ["owner", "Owner"], ["client", "Client"]])}</span>
      <span class="dgroup"><span class="dk">Moment</span>${seg("phase", [["month", "A month in"], ["day1", "Day one"]])}</span>
      <span class="dgroup"><label class="dk" for="jump">Screen</label><select id="jump">${screens.map(([g, list]) => `<optgroup label="${g}">${list.map(([t, l]) => `<option value="${t}"${state.token === t ? " selected" : ""}>${l}</option>`).join("")}</optgroup>`).join("")}</select></span>
      <button class="dbtn" data-theme-toggle aria-label="Switch light or dark">Light / dark</button>
    </div>`;
  }

  /* ---------- render ---------- */
  const root = () => document.getElementById("app");
  function render(token, opts = {}) {
    if (state.role === "client" && !opts.keep && !["client", "public", "record", "shared"].includes(parse(token).name)) token = "client";
    const { name, params } = parse(token);
    state.token = [name, ...params].join("-");
    const view = CA.views[name];
    const c = ctx(params);
    let inner = "";
    try { inner = view.render(c); } catch (e) { console.error(e); inner = `<div class="banner err">This screen failed to draw: ${U.esc(e.message)}</div>`; }
    const html = view.frame === false ? inner : frame(view.nav || name, inner);
    root().innerHTML = demobar() + `<div class="stage">${html}</div>`;
    document.title = "CatchAll · " + (typeof view.title === "function" ? view.title(c) : view.title || "Demo");
    try { history.replaceState(null, "", "#" + state.token); } catch (e) {}
    if (view.mount) { try { view.mount(root(), c); } catch (e) { console.error(e); } }
    if (!opts.keepScroll) window.scrollTo(0, 0);
  }
  CA.go = (token) => { closeDrawer(); render(token); };
  CA.rerender = () => render(state.token, { keepScroll: true });

  /* ---------- drawers and dialogs ---------- */
  function closeDrawer() { const s = document.getElementById("scrim"); if (s) s.remove(); }
  function openDrawer(name, data = {}) {
    closeDrawer();
    const d = CA.drawers[name]; if (!d) return;
    const c = ctx([]);
    const wrap = document.createElement("div");
    wrap.id = "scrim"; wrap.className = "scrim" + (d.kind === "dialog" ? " center" : "");
    wrap.innerHTML = `<div class="${d.kind === "dialog" ? "dialog" : "drawer"}" role="dialog" aria-modal="true" aria-label="${U.esc(typeof d.title === "function" ? d.title(c, data) : d.title)}">
      <div class="dh"><h2>${typeof d.title === "function" ? d.title(c, data) : d.title}</h2><button class="x" data-close aria-label="Close">×</button></div>
      <div class="dbody">${d.render(c, data)}</div></div>`;
    document.body.appendChild(wrap);
    const first = wrap.querySelector("input,select,textarea,button:not([data-close])"); if (first) first.focus();
    if (d.mount) d.mount(wrap, c, data);
  }
  CA.openDrawer = openDrawer; CA.closeDrawer = closeDrawer;

  /* ---------- toast ---------- */
  CA.toast = (msg) => {
    let t = document.getElementById("toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2600);
  };

  /* ---------- events (one delegated listener) ---------- */
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-go],[data-drawer],[data-close],[data-set],[data-toast],[data-theme-toggle],[data-tabset]");
    if (!el) { if (e.target.id === "scrim") closeDrawer(); return; }
    if (el.matches("[data-close]")) { closeDrawer(); return; }
    if (el.matches("[data-go]")) { e.preventDefault(); CA.go(el.dataset.go); return; }
    if (el.matches("[data-drawer]")) { e.preventDefault(); openDrawer(el.dataset.drawer, { ...el.dataset }); return; }
    if (el.matches("[data-set]")) {
      const [k, v] = el.dataset.set.split(":"); state[k] = v; store.set(k, v);
      if (k === "role") render(v === "client" ? "client" : (state.token.startsWith("client") ? "home" : state.token), { keep: v !== "client" });
      else CA.rerender();
      return;
    }
    if (el.matches("[data-theme-toggle]")) {
      const r = document.documentElement; const dark = r.dataset.theme ? r.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
      r.dataset.theme = dark ? "light" : "dark"; store.set("theme", r.dataset.theme); return;
    }
    if (el.matches("[data-tabset]")) {
      /* generic in-page tabs: <div data-tabgroup="x"> buttons with data-tabset="x:key", panels with data-tabpanel="x:key" */
      const [g, key] = el.dataset.tabset.split(":");
      document.querySelectorAll(`[data-tabset^="${g}:"]`).forEach((b) => { const on = b.dataset.tabset === `${g}:${key}`; b.classList.toggle("on", on); b.setAttribute("aria-selected", on); });
      document.querySelectorAll(`[data-tabpanel^="${g}:"]`).forEach((p) => { p.hidden = p.dataset.tabpanel !== `${g}:${key}`; });
      return;
    }
    if (el.matches("[data-toast]")) { CA.toast(el.dataset.toast); return; }
  });
  document.addEventListener("change", (e) => { if (e.target.id === "jump") CA.go(e.target.value); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });

  CA.start = () => {
    const th = store.get("theme", ""); if (th) document.documentElement.dataset.theme = th;
    const h = (location.hash || "").replace(/^#/, "");
    render(h || (state.role === "client" ? "client" : "home"));
  };
})();
