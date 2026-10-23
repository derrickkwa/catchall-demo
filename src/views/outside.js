/* CatchAll demo: screens outside the app frame.
   onboard (owner sign-up and the invited buyer's steps), client (brand viewer), public (global leaderboard),
   record (a buyer's shared track record), shared (a frozen shared audit). All use frame:false and their own top bar. */
(function () {
  const D = CA.data, U = CA.ui, O = CA.data.outside;
  const esc = U.esc, num = U.num, icon = U.icon;
  const reduced = () => { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } };
  const save = (k, v) => { try { localStorage.setItem("ca-demo-" + k, v); } catch (e) {} };
  const stampOf = (d) => U.stamp(d);

  /* ---------- shared top bar ---------- */
  function bar(opts = {}) {
    const right = opts.right || "";
    const cta = opts.cta ? `<button class="btn btn-primary ox-cta" data-go="onboard">Get your free audit</button>` : "";
    return `<header class="ox-bar">
      <button class="wm linkbtn" data-go="${opts.home || "onboard"}" aria-label="CatchAll">CatchAll<i>.</i></button>
      ${opts.left ? `<span class="ox-bar-l">${opts.left}</span>` : ""}
      <span class="sp"></span>${right}${cta}
    </header>`;
  }
  const shell = (inner, cls = "") => `<div class="ox ${cls}">${inner}</div>`;
  const loggedNote = `<p class="ox-fine">${icon("alert", "ico ox-i14")} Opens of this page are logged and visible to ${esc(D.workspace.name)}.</p>`;

  /* signing up from a public page while the presenter is "viewing as client": the router would bounce to the
     client view, so switch the demo role to owner first (capture phase runs before the app's handler) */
  document.addEventListener("click", (e) => {
    const el = e.target.closest('[data-go^="onboard"]');
    if (el && CA.state && CA.state.role === "client") CA.state.role = "owner";
  }, true);
  document.addEventListener("change", (e) => {
    if (e.target.id === "jump" && /^onboard/.test(e.target.value) && CA.state && CA.state.role === "client") CA.state.role = "owner";
  }, true);

  /* "How you get ranked" / "How calls are graded" */
  CA.drawers.outsideRanked = {
    title: "How you get ranked", kind: "dialog",
    render: () => `
      <p style="margin-top:0">Every call is a change plus a prediction: what will move, which way, over how many days, and how sure you are.</p>
      <div class="ox-howl">
        <div><b>1 · Graded against the account's own normal range.</b> A result only counts as a hit or a miss when it moves beyond the account's usual ups and downs. Anything inside is "within noise".</div>
        <div><b>2 · Skill, not luck.</b> Skill compares your predictions with a baseline that just assumes history repeats. <span class="num">0.00</span> means no better than the account's own history; higher is better. How sure you were counts, so a confident miss costs more.</div>
        <div><b>3 · Enough calls to qualify.</b> You need <span class="num">20</span> graded calls in a season, and a reason on at least <span class="num">50%</span> of your changes, before you're ranked.</div>
        <div><b>4 · Grades can't be edited.</b> CatchAll computes them from Facebook's own numbers. A correction is a new grade beside the old one.</div>
      </div>
      <p class="muted small">Prize places: top ${num(D.season.prizePlaces)} each month, rules pending a legal review. No amounts are shown until then.</p>
      <div class="dfoot"><button class="btn btn-secondary" data-close>Close</button><button class="btn btn-primary" data-go="onboard">Join free</button></div>`,
  };

  /* =====================================================================
     1 · Onboarding
     ===================================================================== */
  const OWNER = ["Sign up", "Your team", "Two-factor", "Ad account", "Audit", "Ready"];
  const BUYER = ["Accept invite", "Link Facebook", "Get the plugin"];
  const fresh = (flow) => ({
    flow, step: 0, sub: "", terms: false, err: "", email: flow === "buyer" ? O.buyerEmail : O.ownerEmail,
    mode: "team", team: D.workspace.name, domain: true, code: "",
    site: "acmeskincare.com", fb: "idle", picked: { acme: true, bloom: true }, authority: false, connected: [],
    done: 0, invites: "sam@harbormedia.com, jordan@harbormedia.com, maya@harbormedia.com", invRole: "buyer", sent: 0, linked: false,
  });
  let ob = fresh("owner");
  let timer = null;
  const stopTimer = () => { if (timer) { clearInterval(timer); timer = null; } };
  const redraw = () => CA.go(CA.state.token);

  function stepper() {
    const list = ob.flow === "buyer" ? BUYER : OWNER;
    const i = ob.step;
    return `<div class="ox-stepper">
      <ol class="ox-steps" aria-label="Progress">${list.map((s, k) => `<li class="${k < i ? "done" : k === i ? "on" : ""}"${k === i ? ' aria-current="step"' : ""}><span class="n">${k < i ? icon("check", "ico ox-i12") : k + 1}</span>${esc(s)}</li>`).join("")}</ol>
      <span class="ox-stepm">Step ${num(i + 1)} of ${num(list.length)} · ${esc(list[i])}</span>
    </div>`;
  }
  const back = (label = "Back") => ob.step > 0 || ob.sub ? `<button class="btn ox-ghost" data-ob="back">${label}</button>` : `<span></span>`;
  const errSlot = (id) => `<p class="help err ox-err" id="${id}" role="alert"${ob.err ? "" : " hidden"}>${esc(ob.err)}</p>`;

  function authBlock(primaryLabel) {
    return `
      <button class="btn btn-secondary ox-auth" data-ob="auth" data-via="Google">Continue with Google</button>
      <button class="btn btn-secondary ox-auth" data-ob="auth" data-via="Microsoft">Continue with Microsoft</button>
      <div class="ox-or">or use your work email</div>
      <div class="field"><label for="ob-email">Work email</label><input class="input" id="ob-email" type="email" autocomplete="email" value="${esc(ob.email)}"></div>
      <label class="ox-cb" for="ob-terms"><input type="checkbox" id="ob-terms"${ob.terms ? " checked" : ""}> <span>I agree to the <button class="linkbtn u" data-toast="The terms cover read-only access, how long we keep data, and deleting it">Terms</button> and <button class="linkbtn u" data-toast="The privacy policy lists exactly what we read from Facebook">Privacy policy</button>.</span></label>
      ${errSlot("ob-err")}
      <button class="btn btn-primary ox-auth" data-ob="email">${primaryLabel}</button>`;
  }

  const ownerSteps = [
    /* 0 · sign up */
    () => ob.sub === "check" ? `
      <div class="ox-narrow">
        <h1>Check your email</h1>
        <p class="lead">We sent a sign-in link to <b>${esc(ob.email)}</b>. It works once and expires in ${num(15)} minutes.</p>
        <div class="panel ox-mail">
          <div class="small muted">From CatchAll · just now</div>
          <div><b>Your CatchAll sign-in link</b></div>
          <p class="small" style="margin:6px 0 12px">Click below to finish creating your account. If you didn't ask for this, ignore it.</p>
          <button class="btn btn-primary" data-ob="next">Open the sign-in link</button>
        </div>
        <p class="small muted">Nothing arrived? Check spam, or <button class="linkbtn u" data-toast="A new link is on its way to ${esc(ob.email)}">send it again</button>. Wrong address? <button class="linkbtn u" data-ob="back">Start over</button>.</p>
      </div>` : `
      <div class="ox-hero">
        <div>
          <h1 class="ox-big">Find out which of your calls actually worked.</h1>
          <p class="lead">Log every ad decision with a reason and a quick prediction. CatchAll grades each call against your account's normal ups and downs, and starts you with a free audit of every account you connect.</p>
          <div class="ox-gets">
            <div>${icon("target")}<span>Every call graded against the account's own normal range, so luck doesn't count as skill.</span></div>
            <div>${icon("trophy")}<span>See how you stack up against your team, other buyers and an AI.</span></div>
            <div>${icon("bolt")}<span>A free audit and market research for each account, ready in minutes.</span></div>
          </div>
        </div>
        <div class="panel ox-signup">
          <h2 class="ox-h2">Create your free account</h2>
          ${authBlock("Email me a sign-in link")}
          <p class="help" style="margin-top:8px">No password. We send a link that works once, for ${num(15)} minutes.</p>
          <div class="ox-invited"><button class="linkbtn u" data-go="onboard-buyer">I was invited (buyer flow)</button></div>
        </div>
      </div>`,

    /* 1 · who's this for */
    () => `
      <div class="ox-narrow">
        <h1>Who's this for?</h1>
        <p class="lead">You can change this later. Teams get a shared decision log, a team leaderboard and a weekly report.</p>
        <div role="radiogroup" aria-label="Who's this for">
          <label class="ox-opt${ob.mode === "me" ? " on" : ""}" for="ob-me"><input type="radio" name="ob-mode" id="ob-me" value="me"${ob.mode === "me" ? " checked" : ""}><span><b>Just me</b><span class="small muted">I run my own accounts. Your calls still count on the global leaderboard if you opt in.</span></span></label>
          <label class="ox-opt${ob.mode === "team" ? " on" : ""}" for="ob-team"><input type="radio" name="ob-mode" id="ob-team" value="team"${ob.mode === "team" ? " checked" : ""}><span><b>My team or agency</b><span class="small muted">Invite your buyers and, if you like, a client.</span></span></label>
        </div>
        <div class="ox-inner"${ob.mode === "team" ? "" : " hidden"} id="ob-teambox">
          <div class="field"><label for="ob-teamname">Team name</label><input class="input" id="ob-teamname" value="${esc(ob.team)}"></div>
          <label class="ox-cb" for="ob-domain"><input type="checkbox" id="ob-domain"${ob.domain ? " checked" : ""}> <span><b>Let people with a <span class="num">@${esc(domainOf())}</span> email ask to join this team</b><br><span class="small muted">You or an admin approve each request. Untick if your email domain is shared with people outside your team.</span></span></label>
        </div>
        ${errSlot("ob-err")}
        <div class="ox-acts">${back()}<button class="btn btn-primary" data-ob="who">Continue</button></div>
      </div>`,

    /* 2 · two-factor */
    () => `
      <div class="ox-narrow">
        <h1>Turn on two-factor sign-in</h1>
        <p class="lead">Required for owners and admins before connecting an ad account. Your account will hold read access to client ad data, so a password alone isn't enough.</p>
        <div class="ox-2fa">
          ${qr()}
          <div>
            <p class="small" style="margin:0 0 4px"><b>1.</b> Scan with an authenticator app (1Password, Google Authenticator, Authy).</p>
            <p class="small muted" style="margin:0 0 12px">Can't scan? Enter this key: <span class="num">K7QF 2M9X P4TL 8WZE</span></p>
            <div class="field" style="margin:0"><label for="ob-code">2. Enter the 6-digit code it shows</label>
              <input class="input ox-code${ob.err ? " bad" : ""}" id="ob-code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="000000" value="${esc(ob.code)}" aria-describedby="ob-err">
              ${errSlot("ob-err")}<span class="help">Demo: any 6 digits work.</span></div>
          </div>
        </div>
        <p class="small" style="margin:18px 0 6px"><b>3.</b> Save your recovery codes. Each works once if you lose your phone.</p>
        <div class="ox-codes">${["8f2k-q7m1", "3xw9-p0de", "t6hn-2v8c", "m4rb-9jq5", "z1ce-7ky3", "w5ga-h6tp"].map((c) => `<span>${c}</span>`).join("")}</div>
        <p class="small"><button class="linkbtn u" data-toast="Saved catchall-recovery-codes.txt">Download</button> · <button class="linkbtn u" data-toast="Recovery codes copied">Copy</button></p>
        <div class="ox-acts">${back()}<button class="btn btn-primary" data-ob="verify">Verify and continue</button></div>
      </div>`,

    /* 3 · add an account */
    () => {
      if (ob.fb === "loading") return `
        <div class="ox-narrow">
          <h1>Checking your Facebook connection…</h1>
          <p class="lead">Fetching the ad accounts you can see. This usually takes a few seconds.</p>
          <div class="panel" aria-busy="true">${U.skelRows(4)}</div>
        </div>`;
      if (ob.fb === "picker") {
        const n = Object.values(ob.picked).filter(Boolean).length;
        return `
        <div class="ox-narrow ox-mid">
          <h1>Choose the accounts to connect</h1>
          <p class="lead">Facebook gave us ${num(O.fbAccounts.length)} ad accounts. Only active accounts can be connected.</p>
          <div class="panel ox-pick">
            <div class="ox-pickh"><span></span><span>Account</span><span>Account id</span><span>Status</span></div>
            ${O.fbAccounts.map((a) => {
              const ok = a.status === "Active";
              return `<div class="ox-pickr${ok ? "" : " off"}">
                <span>${ok ? `<input type="checkbox" id="pk-${a.id}" data-pick="${a.id}"${ob.picked[a.id] ? " checked" : ""}>` : ""}</span>
                ${ok ? `<label for="pk-${a.id}"><b>${esc(a.name)}</b></label>` : `<span>${esc(a.name)}</span>`}
                <span class="num small">${a.act}</span>
                <span class="small ${ok ? "" : "ox-warn"}">${esc(a.status)}</span>
              </div>`;
            }).join("")}
          </div>
          <label class="ox-cb" for="ob-auth"><input type="checkbox" id="ob-auth"${ob.authority ? " checked" : ""}> <span>I confirm I'm authorised to share these ad accounts' data with CatchAll.</span></label>
          <div class="ox-acts"><button class="btn ox-ghost" data-ob="fbreset">Start again</button><button class="btn btn-primary" data-ob="connect" id="ob-connect"${n && ob.authority ? "" : " disabled"}>Connect ${n} account${n === 1 ? "" : "s"}</button></div>
          <p class="help" id="ob-connecthelp"${n && ob.authority ? " hidden" : ""}>Tick at least one account and the statement above to continue.</p>
        </div>`;
      }
      return `
        <div class="ox-narrow">
          <h1>Add your first ad account</h1>
          <p class="lead">We'll audit it right away: what your past changes did, the account's health, and research on its market.</p>
          <div class="field"><label for="ob-site">Brand website</label><input class="input" id="ob-site" value="${esc(ob.site)}"><span class="help">Used for market and competitor research. We read public pages only.</span></div>
          ${errSlot("ob-err")}
          <button class="btn btn-primary" data-ob="fb">Connect with Facebook</button>
          <div class="ox-ro">${icon("check")}<span><b>Read-only.</b> CatchAll asks Facebook for read access only. We can't change budgets, ads or settings, and you can disconnect at any time. Shopify can be added after.</span></div>
          <div class="ox-acts">${back()}<button class="linkbtn u small" data-toast="We'll email them a link to connect it, then you can come back here">Not the person with access? Invite them</button></div>
        </div>`;
    },

    /* 4 · audit running */
    () => {
      const names = ob.connected.map((id) => U.acct(id)?.name || id);
      const first = names[0] || "Acme Skincare";
      return `
      <div class="ox-wide">
        <div class="ox-side2" id="ob-audit">
          <div>
            <h1>Auditing ${esc(names.length > 1 ? names.slice(0, -1).join(", ") + " and " + names[names.length - 1] : first)}</h1>
            <p class="lead">About ${num(4)} minutes for the account audit. Market research takes longer: it arrives by email within the hour. You can leave this page; we'll email you when the audit is ready.</p>
            <div class="panel">
              <div class="ox-auh"><b>${esc(first)}</b><span class="small muted" id="ob-count">${num(ob.done)} of ${num(O.auditSteps.length)} done</span></div>
              <div class="ox-bar2" role="progressbar" aria-label="Audit progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(ob.done / O.auditSteps.length * 100)}" id="ob-prog"><i style="width:${ob.done / O.auditSteps.length * 100}%"></i></div>
              <div id="ob-list">${auditList()}</div>
              <div class="ox-ck later"><span class="ring"></span><span>Market and competitor research</span><span class="t">by email, within the hour</span></div>
              ${names.length > 1 ? `<p class="small muted" style="margin:12px 0 0" id="ob-queue">${esc(names.slice(1).join(" and "))} ${names.length > 2 ? "are" : "is"} queued behind ${esc(first)}.</p>` : ""}
            </div>
            <div class="ox-acts"><span class="small muted" id="ob-readyhint">${ob.done >= O.auditSteps.length ? "Your audit is ready." : "The button opens when the audit finishes."}</span><button class="btn btn-secondary" data-ob="next" id="ob-see"${ob.done >= O.auditSteps.length ? "" : " disabled"}>See your audit →</button></div>
          </div>
          <div class="panel ox-invite">
            <h2 class="ox-h2">Invite your buyers while you wait</h2>
            <p class="small muted" style="margin:0 0 12px">They link their Facebook and get the plugin, and their calls start counting today.</p>
            <div class="field"><label for="ob-inv">Emails, comma separated</label><textarea class="input" id="ob-inv" rows="3">${esc(ob.invites)}</textarea></div>
            <div class="field"><span class="ox-lbl" id="ob-rolel">Role</span>
              <div class="seg" role="radiogroup" aria-labelledby="ob-rolel">${[["buyer", "Buyer"], ["admin", "Admin"], ["client", "Client viewer"]].map(([v, l]) => `<button role="radio" aria-checked="${ob.invRole === v}" class="${ob.invRole === v ? "on" : ""}" data-ob="role" data-v="${v}">${l}</button>`).join("")}</div>
              <span class="help">Client viewers see one account, read-only. Admins can connect accounts.</span></div>
            ${ob.sent ? `<p class="ox-sent">${icon("check", "ico ox-i16")} ${num(ob.sent)} invite${ob.sent === 1 ? "" : "s"} sent. They'll show on your Team page.</p>` : ""}
            <button class="btn btn-primary" data-ob="invite" id="ob-send">Send ${countInv(ob.invites)} invite${countInv(ob.invites) === 1 ? "" : "s"}</button>
            <p class="small muted" style="margin:10px 0 0">Or <button class="linkbtn u" data-toast="Opens the Chrome Web Store page for the CatchAll plugin">get the plugin</button> for yourself.</p>
          </div>
        </div>
      </div>`;
    },

    /* 5 · audit ready */
    () => {
      const a = O.audit, id = ob.connected[0] || "acme", name = U.acct(id)?.name || "Acme Skincare";
      return `
      <div class="ox-narrow ox-mid">
        <h1>${esc(name)}'s audit is ready</h1>
        <p class="lead">Here's what we found. Market, Competitors and Audience fill in when the research arrives, by email within the hour.</p>
        <div class="panel">
          <h2 class="ox-h3">What your changes did</h2>
          <p style="margin:6px 0 12px">${num(a.changes)} changes in ${num(12)} months. After ${num(a.pctImproved + "%")}, performance improved beyond the account's normal noise; after ${num(a.pctWorse + "%")} it got worse; after ${num(a.pctNone + "%")}, no clear effect.</p>
          ${changeBar()}
          <div class="ox-kv">
            <div><span class="small muted">Biggest lever</span><b>${esc(a.lever)}</b><span class="small">${num(a.leverPct + "%")} of changes improved after</span></div>
            <div><span class="small muted">Spend on the top two looks</span><b class="num">${a.topSpendShare}%</b><span class="small">worth spreading</span></div>
            <div><span class="small muted">Concepts getting spend</span><b class="num">${a.concepts}</b><span class="small">median ad age ${num(a.medianAge)} days</span></div>
          </div>
        </div>
        <div class="ox-acts"><button class="btn ox-ghost" data-ob="back">Back</button><button class="btn btn-primary" data-ob="open">Open your audit</button></div>
      </div>`;
    },
  ];

  const buyerSteps = [
    () => `
      <div class="ox-narrow">
        <h1>${esc(D.people.dana.name)} invited you to ${esc(D.workspace.name)}</h1>
        <p class="lead">Log your calls, see which ones actually worked, and see how you stack up against your team and the AI.</p>
        <div class="panel ox-signup">${authBlock("Join " + esc(D.workspace.name))}</div>
        <p class="small muted">Invites last ${num(7)} days. <button class="linkbtn u" data-go="onboard">Setting up a new team instead?</button></p>
      </div>`,
    () => `
      <div class="ox-narrow">
        <h1>Link your Facebook</h1>
        <p class="lead">Linking credits your Ads Manager changes to you, with or without the plugin. Do it once.</p>
        <div class="ox-ro">${icon("check")}<span><b>No ad account access asked.</b> This only tells us which Facebook person you are. It connects nothing and can't see or change any ads.</span></div>
        ${ob.linked ? `<div class="panel ox-linked">${U.av("sam", 32)}<div><b>Linked as ${esc(D.people.sam.name)}</b><div class="small muted">Your Ads Manager changes are credited to you from now on.</div></div></div>
          <div class="ox-acts">${back()}<button class="btn btn-primary" data-ob="next">Continue</button></div>`
        : `<div class="ox-acts" style="justify-content:flex-start"><button class="btn btn-primary" data-ob="link">Link your Facebook</button></div>
          <p class="small muted" style="margin-top:16px">If you skip: your Ads Manager changes show as "Changed by someone not linked to CatchAll yet" and aren't credited to you. You can link any time from Home.</p>
          <div class="ox-acts">${back()}<button class="btn ox-ghost" data-ob="next">Skip for now</button></div>`}
      </div>`,
    () => `
      <div class="ox-narrow">
        <h1>Get the plugin</h1>
        <p class="lead">Log a call in about five clicks, right inside Ads Manager, the moment you publish.</p>
        <div class="ox-gets">
          <div>${icon("bolt")}<span>Asks for your reason and a quick prediction when you publish a change.</span></div>
          <div>${icon("trophy")}<span>Calls logged with the plugin as you publish count for the leaderboard. Calls you log by hand count for your own accuracy.</span></div>
          <div>${icon("bell")}<span>Shows how many changes still need a reason.</span></div>
        </div>
        <div class="ox-acts">${back()}<span class="ox-gap"><button class="btn ox-ghost" data-ob="finish">Skip for now</button><button class="btn btn-primary" data-ob="chrome">Add to Chrome</button></span></div>
      </div>`,
  ];

  function domainOf() { const m = /@([^\s@]+)$/.exec(ob.email || ""); return m ? m[1] : O.domain; }
  function countInv(s) { return String(s || "").split(/[,\s;]+/).filter((x) => /.+@.+\..+/.test(x)).length; }
  function auditList() {
    return O.auditSteps.map((s, k) => {
      const st = k < ob.done ? "done" : k === ob.done ? "now" : "next";
      const mark = st === "done" ? `<span class="okc">${icon("check", "ico ox-i14")}</span>` : st === "now" ? `<span class="run"></span>` : `<span class="ring"></span>`;
      return `<div class="ox-ck ${st}">${mark}<span>${esc(s)}</span><span class="t">${st === "done" ? "done" : st === "now" ? "running" : "next"}</span></div>`;
    }).join("");
  }
  function changeBar() {
    const a = O.audit;
    return `<div class="ox-split" aria-hidden="true"><i class="a" style="width:${a.pctImproved}%"></i><i class="b" style="width:${a.pctWorse}%"></i><i class="c" style="width:${a.pctNone}%"></i></div>
      <div class="ox-splitl"><span><i class="a"></i>Improved after ${num(a.improved)}</span><span><i class="b"></i>Got worse after ${num(a.worse)}</span><span><i class="c"></i>No clear effect ${num(a.noEffect)} · within noise ${num(a.noise)}</span></div>`;
  }
  function qr() {
    /* a placeholder QR: deterministic squares, finder patterns in the corners */
    let s = 7, cells = "";
    const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    for (let y = 0; y < 25; y++) for (let x = 0; x < 25; x++) {
      const finder = (x < 8 && y < 8) || (x > 16 && y < 8) || (x < 8 && y > 16);
      if (finder) continue;
      if (rnd() > 0.52) cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
    }
    const f = (x, y) => `<rect x="${x + .5}" y="${y + .5}" width="6" height="6" fill="none" stroke="currentColor" stroke-width="1"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3"/>`;
    return `<div class="ox-qr"><svg viewBox="-1 -1 27 27" width="132" height="132" role="img" aria-label="QR code for your authenticator app" fill="currentColor">${cells}${f(0, 0)}${f(18, 0)}${f(0, 18)}</svg></div>`;
  }

  function finishBuyer() {
    stopTimer();
    CA.state.role = "buyer"; CA.state.phase = "day1"; save("role", "buyer"); save("phase", "day1");
    ob = fresh("owner");
    CA.go("home");
    CA.toast("Welcome to " + D.workspace.name + ", Sam. Your first calls count from today.");
  }

  CA.views.onboard = {
    title: "Sign up", frame: false,
    render(c) {
      const flow = c.params[0] === "buyer" ? "buyer" : "owner";
      if (flow !== ob.flow) { stopTimer(); ob = fresh(flow); }
      const steps = flow === "buyer" ? buyerSteps : ownerSteps;
      const body = steps[Math.min(ob.step, steps.length - 1)]();
      const right = ob.step === 0 && !ob.sub
        ? `<span class="small ox-hidem">Already have an account?</span><button class="linkbtn u small" data-toast="Sign-in sends a one-time link, like sign-up">Sign in</button>`
        : `<button class="linkbtn u small" data-ob="restart">Start over</button>`;
      return shell(bar({ right, home: flow === "buyer" ? "onboard-buyer" : "onboard" }) + `<div class="ox-page">${stepper()}${body}</div>`, "ox-onb");
    },
    mount(app) {
      stopTimer();
      const root = app.querySelector(".ox-onb"); if (!root) return;
      const $ = (s) => root.querySelector(s);
      const showErr = (msg) => { ob.err = msg; const e = $("#ob-err"); if (e) { e.textContent = msg; e.hidden = !msg; } };
      const steps = ob.flow === "buyer" ? buyerSteps : ownerSteps;
      const go = (n) => { ob.err = ""; ob.step = Math.max(0, Math.min(steps.length - 1, n)); redraw(); };

      /* inputs keep the module state in step without redrawing (focus stays put) */
      root.addEventListener("input", (e) => {
        const t = e.target;
        if (t.id === "ob-email") ob.email = t.value;
        if (t.id === "ob-teamname") ob.team = t.value;
        if (t.id === "ob-site") ob.site = t.value;
        if (t.id === "ob-code") { t.value = t.value.replace(/\D/g, "").slice(0, 6); ob.code = t.value; if (ob.err) { showErr(""); t.classList.remove("bad"); } }
        if (t.id === "ob-inv") { ob.invites = t.value; const n = countInv(t.value); const b = $("#ob-send"); if (b) b.innerHTML = `Send ${n} invite${n === 1 ? "" : "s"}`; }
      });
      root.addEventListener("change", (e) => {
        const t = e.target;
        if (t.id === "ob-terms") { ob.terms = t.checked; if (t.checked) showErr(""); }
        if (t.name === "ob-mode") { ob.mode = t.value; root.querySelectorAll(".ox-opt").forEach((o) => o.classList.toggle("on", o.querySelector("input").checked)); const b = $("#ob-teambox"); if (b) b.hidden = ob.mode !== "team"; }
        if (t.id === "ob-domain") ob.domain = t.checked;
        if (t.id === "ob-auth" || t.dataset.pick) {
          if (t.dataset.pick) ob.picked[t.dataset.pick] = t.checked; else ob.authority = t.checked;
          const n = Object.values(ob.picked).filter(Boolean).length, ok = n > 0 && ob.authority;
          const b = $("#ob-connect"); if (b) { b.disabled = !ok; b.innerHTML = `Connect ${n} account${n === 1 ? "" : "s"}`; }
          const h = $("#ob-connecthelp"); if (h) h.hidden = ok;
        }
      });
      root.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.id === "ob-code") { e.preventDefault(); $('[data-ob="verify"]')?.click(); } });
      root.addEventListener("click", (e) => {
        const el = e.target.closest("[data-ob]"); if (!el || el.disabled) return;
        const a = el.dataset.ob;
        if (a === "back") { if (ob.sub) { ob.sub = ""; ob.err = ""; redraw(); } else if (ob.step === 3 && ob.fb !== "idle") { ob.fb = "idle"; redraw(); } else go(ob.step - 1); }
        else if (a === "next") { ob.sub = ""; go(ob.step + 1); }
        else if (a === "restart") { stopTimer(); ob = fresh(ob.flow); redraw(); }
        else if (a === "auth" || a === "email") {
          if (!ob.terms) return showErr("Tick the terms first: they cover how we read and keep your ad data.");
          if (a === "email" && !/.+@.+\..+/.test(ob.email)) return showErr("Enter your work email, like name@agency.com.");
          if (a === "email" && ob.flow === "owner") { ob.sub = "check"; ob.err = ""; redraw(); return; }
          if (a === "auth") CA.toast("Signed in with " + el.dataset.via);
          go(ob.step + 1);
        }
        else if (a === "who") { if (ob.mode === "team" && !ob.team.trim()) return showErr("Give your team a name. You can change it later."); go(2); }
        else if (a === "verify") {
          if (!/^\d{6}$/.test(ob.code)) { showErr(ob.code ? "That code didn't match. Codes change every 30 seconds; try the newest one." : "Enter the 6-digit code from your authenticator app."); $("#ob-code")?.classList.add("bad"); $("#ob-code")?.focus(); return; }
          CA.toast("Two-factor sign-in is on"); go(3);
        }
        else if (a === "fb") {
          if (!ob.site.trim()) return showErr("Add the brand's website so we can research its market.");
          ob.fb = "loading"; ob.err = ""; redraw();
          setTimeout(() => { if (ob.fb === "loading") { ob.fb = "picker"; if (/^onboard/.test(CA.state.token)) redraw(); } }, reduced() ? 0 : 1300);
        }
        else if (a === "fbreset") { ob.fb = "idle"; ob.authority = false; redraw(); }
        else if (a === "connect") { ob.connected = O.fbAccounts.filter((x) => ob.picked[x.id]).map((x) => x.id); ob.done = 0; ob.sent = 0; go(4); }
        else if (a === "role") { ob.invRole = el.dataset.v; root.querySelectorAll('[data-ob="role"]').forEach((b) => { const on = b === el; b.classList.toggle("on", on); b.setAttribute("aria-checked", on); }); }
        else if (a === "invite") {
          const n = countInv(ob.invites); if (!n) { CA.toast("Add at least one email address"); return; }
          ob.sent += n; const role = { buyer: "buyers", admin: "admins", client: "client viewers" }[ob.invRole];
          CA.toast(`${n} invite${n === 1 ? "" : "s"} sent as ${role}`); ob.invites = ""; CA.rerender();
        }
        else if (a === "open") {
          const id = ob.connected[0] || "acme";
          stopTimer(); ob = fresh("owner");
          CA.state.role = "owner"; save("role", "owner"); CA.state.phase = "month"; save("phase", "month");
          CA.go("acct-" + id + "-performance");
          CA.toast("Your audit is ready. Market, Competitors and Audience fill in within the hour.");
        }
        else if (a === "link") { ob.linked = true; CA.toast("Facebook linked: changes you make in Ads Manager are credited to you"); redraw(); }
        else if (a === "chrome") { CA.toast("Opens the Chrome Web Store; the plugin signs you in with this account"); finishBuyer(); }
        else if (a === "finish") finishBuyer();
      });

      /* the audit checklist ticks through over about 6 seconds (instantly under reduced motion) */
      if (ob.flow === "owner" && ob.step === 4 && ob.done < O.auditSteps.length) {
        const total = O.auditSteps.length;
        const paint = () => {
          const list = document.getElementById("ob-list"); if (!list) { stopTimer(); return false; }
          list.innerHTML = auditList();
          const pct = Math.round(ob.done / total * 100);
          const p = document.getElementById("ob-prog"); if (p) { p.setAttribute("aria-valuenow", pct); p.firstElementChild.style.width = pct + "%"; }
          const c = document.getElementById("ob-count"); if (c) c.innerHTML = `${num(ob.done)} of ${num(total)} done`;
          if (ob.done >= total) {
            const b = document.getElementById("ob-see"); if (b) b.disabled = false;
            const h = document.getElementById("ob-readyhint"); if (h) h.textContent = "Your audit is ready.";
            const q = document.getElementById("ob-queue"); if (q) q.textContent = q.textContent.replace(/(is|are) queued behind .*$/, "$1 starting now, about 4 minutes each.");
          }
          return true;
        };
        if (reduced()) { ob.done = total; paint(); }
        else timer = setInterval(() => { ob.done = Math.min(total, ob.done + 1); if (!paint() || ob.done >= total) stopTimer(); }, 1200);
      }
    },
  };

  /* =====================================================================
     2 · Client view (brand viewer, Acme Skincare)
     ===================================================================== */
  function cpaSeries() {
    /* 90 days to Oct 22: inside the $22–$28 range, then rising after the Oct 9 budget change to $31.40 */
    const out = [];
    for (let i = 0; i < 90; i++) {
      let v = 25 + 1.6 * Math.sin(i / 4.3) + 0.9 * Math.sin(i / 1.7 + 1) + 0.5 * Math.cos(i / 2.9);
      if (i >= 76) v = 25.6 + (i - 76) * 0.42 + 0.4 * Math.sin(i);
      out.push(Math.round(v * 100) / 100);
    }
    out[89] = 31.4;
    return out;
  }
  const dayLabel = (i) => { const d = new Date(Date.UTC(2026, 6, 25 + i)); return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }); };
  const dayIndex = (label) => { for (let i = 0; i < 90; i++) if (dayLabel(i) === label) return i; return -1; };

  function bandChart(noTicks) {
    const v = cpaSeries(), lo = 22, hi = 28, min = 18, max = 34;
    const y = (x) => 100 - (x - min) / (max - min) * 100;
    const xp = (i) => i / 89 * 100;
    const pts = v.map((p, i) => `${xp(i).toFixed(2)},${y(p).toFixed(2)}`).join(" ");
    const ticks = noTicks ? [] : O.clientDecisions.map((d) => dayIndex(d.date)).filter((i) => i >= 0);
    const last = v[89];
    return `<div class="ox-chart" role="img" aria-label="CPA over the last 90 days: inside the normal range of $22 to $28 until mid October, then rising to $31.40">
      <div class="ox-yax">${[34, 30, 26, 22, 18].map((t) => `<span style="top:${y(t)}%">$${t}</span>`).join("")}</div>
      <div class="ox-plot">
        ${[30, 26, 22].map((t) => `<i class="gl" style="top:${y(t)}%"></i>`).join("")}
        <div class="ox-band" style="top:${y(hi)}%;height:${y(lo) - y(hi)}%"></div>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="var(--ink)" stroke-width="1.75" vector-effect="non-scaling-stroke" stroke-linejoin="round"/></svg>
        <span class="ox-pt" style="left:100%;top:${y(last)}%"></span>
        <span class="ox-ptl num" style="top:${y(last)}%">$31.40</span>
        ${ticks.map((i) => `<i class="tk" style="left:${xp(i)}%" title="Decision on ${dayLabel(i)}"></i>`).join("")}
      </div>
      <div class="ox-xax">${[0, 30, 60, 89].map((i) => `<span style="left:${xp(i)}%">${dayLabel(i)}</span>`).join("")}</div>
    </div>
    <div class="legend"><span><i style="background:var(--band);border:1px solid var(--band-edge)"></i>Normal range $22–$28</span><span><i style="background:var(--ink);height:2px;vertical-align:3px"></i>CPA</span><span><i style="width:2px;height:10px;background:var(--ink)"></i>A decision your agency logged</span></div>`;
  }

  function clientRow(d) {
    const res = d.pred === false
      ? `<span class="muted small">Prediction not shared</span>`
      : d.status === "wait" ? `<span class="stamp wait">Day ${esc(d.day)}</span>`
      : `${stampOf(d)}${d.move ? ` <span class="num small muted">${esc(d.move)}${d.status === "noise" ? " · " + esc(d.band) : ""}</span>` : ""}`;
    return `<div class="ox-dr">
      ${d.thumb != null ? U.thumb(d.thumb) : U.ctype(d.type)}
      <div class="ox-drm">
        <div><b>${esc(d.what)}</b> ${esc(d.detail)} <span class="muted">· ${esc(d.camp)} · <span class="num">${esc(d.date)}</span></span></div>
        <div class="small ox-why">Why: ${esc(d.reason)}${d.pred ? ` Predicted ${esc(d.pred)}.` : ""}</div>
      </div>
      <div class="ox-dre">${res}</div>
    </div>`;
  }

  function healthSummary(shared) {
    const a = O.audit;
    return `<div class="kpi">
        ${U.tile("Spend on the top two looks", num(a.topSpendShare + "%"), "worth spreading")}
        ${U.tile("Concepts getting spend", num(a.concepts), "down from 8 in July")}
        ${U.tile("Median ad age", num(a.medianAge), "days")}
        ${U.tile("New people per $1k", num(a.reachDrop), "over 3 months")}
      </div>
      <div class="sec">${U.sectionHead("Worth looking at")}
        <div class="ox-pts">
          <div><b>Spend is concentrated.</b> Two creative looks carry ${num(a.topSpendShare + "%")} of spend, so one tired look moves the whole account.</div>
          <div><b>Reach is narrowing.</b> New people reached per $1k is down ${num(a.reachDrop.replace("−", ""))} in 3 months while frequency rose.</div>
          <div><b>Few concepts, older ads.</b> ${num(a.concepts)} distinct concepts get spend and the median ad has run ${num(a.medianAge)} days.</div>
        </div></div>
      <div class="sec">${U.sectionHead("Looks fine")}
        <div class="ox-pts muted"><div>Tracking: purchases match the store within ${num("3%")}.</div><div>Attribution: 7-day click, 1-day view, the same on every campaign.</div>${shared ? "" : "<div>Budget pacing: on plan for October.</div>"}</div></div>`;
  }
  function marketSummary(title = "What buyers say") {
    return `<div class="sec">${U.sectionHead(title, `<span class="small muted">${num(O.audit.segments)} segments · ${num(O.audit.competitors)} competitors</span>`)}
      <div class="qlist">
        <div class="q"><span class="glyph">“</span><div><div class="txt">I don't trust anything that says clean anymore. I just read the INCI list.</div><div class="small muted">Ingredient-literate · Reddit · <span class="ev obs">Observed</span></div></div></div>
        <div class="q"><span class="glyph">“</span><div><div class="txt">My skin hated the big-name serum. This one I can actually use every day.</div><div class="small muted">Sensitive-skin switchers · product review · <span class="ev obs">Observed</span></div></div></div>
        <div class="q inf"><span class="glyph">◇</span><div><div class="txt">Buyers distrust "clean" claims and read the ingredient list instead.</div><div class="small muted"><span class="ev inf">Inferred</span></div></div></div>
        <div class="q inf"><span class="glyph">◇</span><div><div class="txt">No competitor frames price per use; the longest-running ads lean on before-and-after proof.</div><div class="small muted"><span class="ev inf">Inferred</span></div></div></div>
      </div></div>
      <div class="sec">${U.sectionHead("Who buys")}${segments()}</div>`;
  }
  function segments() {
    return `<div class="ox-segs">${O.segmentsList.map((s, i) => `<div class="ox-seg"><span class="num small muted">${s.code}</span><div><b>${esc(s.name)}</b><div class="small muted">${esc(s.line)}</div><div class="ox-sbar"><i style="width:${s.share * 2.5}%;background:var(--c${i + 1})"></i></div></div><span class="num">${s.share}%</span></div>`).join("")}</div>`;
  }

  CA.views.client = {
    title: "Acme Skincare · client view", frame: false,
    render(c) {
      const A = O.acme, R = O.clientReport, day1 = c.phase === "day1";
      const tabs = [["perf", "Performance"], ["health", "Health"], ["market", "Market"], ["dec", "Decisions"], ["rep", "Weekly report"]];
      const want = { performance: "perf", health: "health", market: "market", decisions: "dec", report: "rep" }[c.params[0]] || "perf";
      const tabbar = `<div class="tabs ox-tabs" role="tablist" aria-label="Account sections">${tabs.map(([k, l]) => `<button role="tab" data-tabset="cv:${k}" class="${k === want ? "on" : ""}" aria-selected="${k === want}">${l}</button>`).join("")}</div>`;
      const panel = (k, html) => `<section data-tabpanel="cv:${k}" role="tabpanel"${k === want ? "" : " hidden"}>${html}</section>`;
      const firstDecisions = U.empty(`${esc(D.workspace.name)}'s first decisions show here from this week`, `Each change comes with the reason behind it. Results arrive 7 to 30 days later, and your first weekly report lands <b>Monday Oct 27</b>.`, `<button class="btn btn-secondary" data-tabset="cv:health">See the account's health meanwhile</button>`, "Illustration slot: first decisions on their way");

      const perf = `
        <div class="kpi">
          ${U.tile("Spend · last 7 days", num(A.spend), "normal")}
          ${U.tile("CPA · last 7 days", num(A.cpa), `<b>▲ above normal range</b> <span class="num">(${A.cpaLo}–${A.cpaHi})</span>`, { cls: "ox-out" })}
          ${U.tile("ROAS · last 7 days", num(A.roas), "normal")}
          ${U.tile("Purchases · last 7 days", num(A.purchases), "normal")}
        </div>
        <div class="chart"><div class="ox-ch"><h3>CPA, last 90 days</h3><span class="small muted">shaded: the account's normal range</span></div>${bandChart(day1)}
          <p class="small" style="margin:10px 0 0">CPA left its normal range after the Oct 9 budget change. ${esc(D.workspace.name)} cut the ASC budget on Oct 20 and expects it back inside within a week.</p></div>`;
      const dec = day1 ? firstDecisions : `
        <div class="sec">${U.sectionHead("Decisions and why", `<button class="linkbtn u small" data-toast="Shows all 42 decisions ${esc(D.workspace.name)} logged with a reason">All 42 →</button>`)}
          ${O.clientDecisions.map(clientRow).join("")}</div>
        <p class="small muted">You see the reasons and the predictions ${esc(D.workspace.name)} chose to share. Predictions not marked for you show "Prediction not shared".</p>`;
      const done = O.clientDecisions.filter((d) => ["Oct 8", "Oct 5", "Oct 2"].includes(d.date));
      const rep = day1 ? U.empty("Your first weekly report lands Monday Oct 27", "It covers how the account performed, what your agency decided and why, and how earlier calls turned out.", `<button class="btn btn-secondary" data-tabset="cv:perf">See performance meanwhile</button>`, "Illustration slot: the first report on its way") : `
        <div class="ox-rephead"><div><h2 class="ox-h2" style="margin:0">Week of ${R.week}</h2><div class="small muted">Acme Skincare · sent ${R.sent} workspace time (${esc(D.workspace.tz)})</div></div>
          <label class="sr" for="cv-week">Choose a week</label><select id="cv-week" class="ox-sel"><option>Week of Oct 12–18</option><option>Week of Oct 5–11</option><option>Week of Sep 28–Oct 4</option></select></div>
        <div class="ox-rep">
          <div class="sec">${U.sectionHead("1 · How the account performed")}<p>Spend ${num(R.spend)}, normal. CPA ${num(R.cpa)}, <b>above the normal range</b> (${num("$22–$28")}), after the Oct 9 budget change. ROAS ${num(R.roas)}, normal. Purchases ${num(R.purchases)}, normal.</p></div>
          <div class="sec">${U.sectionHead("2 · What your agency decided")}<p>${num(R.decided)} decisions, ${num(R.holding)} of them "reviewed, holding". The biggest: a creative swap on Prospecting – Broad (Oct 8) and a pause of three retargeting video ads (Oct 5).</p></div>
          <div class="sec">${U.sectionHead("3 · How past calls turned out")}${done.map((d) => `<div class="ox-rr">${U.ctype(d.type)}<span><b>${esc(d.what)}</b> ${esc(d.detail)} <span class="muted">· ${esc(d.pred.replace(/, \d+ in 10/, ""))}</span></span><span>${stampOf(d)}</span></div>`).join("")}</div>
          <div class="sec">${U.sectionHead("4 · Worth considering this week")}<p>Move ${num("$60")}/day from Retargeting to Prospecting – Broad. Retargeting frequency has been above its range for ${num(3)} weeks.</p></div>
        </div>`;

      const top = bar({
        home: "client",
        left: `<span class="ox-shared">Shared by ${esc(D.workspace.name)}</span><span class="note-chip">Read-only</span>`,
        right: `<span class="av ox-av" aria-label="Pat Lowe, Acme Skincare" title="Pat Lowe · Acme Skincare">PL</span>`,
      });
      return shell(top + `<div class="ox-page ox-cv">
        <div class="ox-ahead"><div><h1 class="ox-aname"><span class="adot" style="background:${U.acct("acme").color}"></span>Acme Skincare</h1>
          <div class="small muted">Last synced today ${num(A.synced)} ${A.tz} time · your agency: ${esc(D.workspace.name)}</div></div>
          <button class="btn btn-secondary" data-toast="Downloads the week of Oct 12–18 as a PDF">Download weekly report</button></div>
        ${tabbar}
        ${panel("perf", perf)}${panel("health", healthSummary(false))}${panel("market", marketSummary())}${panel("dec", dec)}${panel("rep", rep)}
        <div class="ox-foot">${loggedNote}<p class="ox-fine">Never shown here: notes, other accounts, buyer names or rankings, AI inputs.</p></div>
      </div>`, "ox-client");
    },
    mount(root) {
      root.querySelector("#cv-week")?.addEventListener("change", (e) => CA.toast("Opens the " + e.target.value.toLowerCase() + " report"));
    },
  };

  /* =====================================================================
     3 · Public global leaderboard
     ===================================================================== */
  CA.views.public = {
    title: "Global leaderboard", frame: false,
    render() {
      const P = D.season.prizePlaces;
      const rows = D.globalBoard.map((r) => {
        const line = r.rank === P ? `<tr class="line"><td colspan="5"><div class="pl">Prize places · top ${P} · rules pending</div></td></tr>` : "";
        return `<tr><td class="pos">${U.medal(r.rank)}</td><td><b>${esc(r.name)}</b>${r.rank <= P ? U.trophy() : ""}<div class="small muted">${esc(r.handle)}</div></td><td class="num r">${r.calls}</td><td class="num r"><b>${esc(r.skill)}</b></td><td class="r">${U.mv(r.week)}</td></tr>${line}`;
      }).join("");
      const top = bar({ home: "public-board", cta: true, right: `<button class="linkbtn u small ox-hidem" data-drawer="outsideRanked">How you get ranked</button><button class="linkbtn u small" data-toast="Sign-in sends a one-time link to your email">Sign in</button>` });
      return shell(top + `<div class="ox-page ox-pub">
        <div class="ox-ph"><div><h1 class="ox-t">Global leaderboard</h1><div class="season">${esc(D.season.name)} · provisional · final on ${D.season.final} · <b>${D.season.daysLeft} days left</b></div></div>
          <div><label class="sr" for="pb-season">Season</label><select id="pb-season" class="ox-sel"><option>October 2026</option><option>September 2026 · final</option><option>August 2026 · final</option></select></div></div>
        <p class="lead">Media buyers ranked on how often their calls beat their account's own history, adjusted so a lucky handful of calls can't top the board. Opt-in only: no accounts, clients or teams are shown.</p>
        <div class="tablewrap ox-lb"><table>
          <thead><tr><th>#</th><th>Buyer</th><th class="r">Calls</th><th class="r">Skill</th><th class="r">Week</th></tr></thead>
          <tbody>${rows}</tbody></table></div>
        <p class="small muted" style="margin:10px 0 0">Calls are eligible graded calls. Skill: ${num("0.00")} means no better than the account's own history; higher is better. ${num(214)} buyers ranked this season. <button class="linkbtn u" data-toast="The full board lists all 214 ranked buyers">See all →</button> · <button class="linkbtn u" data-drawer="outsideRanked">How you get ranked</button></p>
        <div class="ox-ctab">
          <div><h2 class="ox-h2">See where your calls would rank</h2><p class="muted" style="margin:4px 0 0">Log your calls with the free plugin and find out how often your gut is right, against other buyers and the AI. Monthly prizes once the rules are final.</p></div>
          <button class="btn btn-primary" data-go="onboard">Join free and log your first call</button>
        </div>
      </div>`, "ox-public");
    },
    mount(root) { root.querySelector("#pb-season")?.addEventListener("change", (e) => CA.toast("Shows the " + e.target.value.replace(" · final", "") + " standings")); },
  };

  /* =====================================================================
     4 · A buyer's shared track record (Maya Chen)
     ===================================================================== */
  let recCat = "all";
  function seasonBars(R) {
    const max = 0.25;
    return `<div class="ox-sbars" role="img" aria-label="Skill by season, March to October: from +0.09 to +0.21">
      ${R.seasons.map((s) => `<div class="ox-sb${s.prov ? " prov" : ""}"><span class="num v">+${s.skill.toFixed(2)}${s.prov ? "*" : ""}</span><i style="height:${s.skill / max * 100}%"></i><span class="m">${s.m}</span><span class="num r">#${s.rank}</span></div>`).join("")}
    </div>`;
  }
  function calibChart(R) {
    const W = 240, H = 220, L = 34, B = 30, T = 8, Rr = 10;
    const x = (p) => L + (p - 40) / 60 * (W - L - Rr), y = (p) => H - B - (p - 40) / 60 * (H - B - T);
    const pts = R.calib.map((c) => [x(c.said * 10), y(c.true), c]);
    return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Calibration: what Maya said against how often it came true" class="ox-cal">
      ${[40, 60, 80, 100].map((p) => `<line x1="${L}" x2="${W - Rr}" y1="${y(p)}" y2="${y(p)}" stroke="var(--rule-soft)"/><text x="${L - 6}" y="${y(p) + 4}" text-anchor="end" fill="var(--muted)" font-family="var(--mono)">${p}%</text>`).join("")}
      ${[5, 6, 7, 8, 9].map((s) => `<text x="${x(s * 10)}" y="${H - B + 16}" text-anchor="middle" fill="var(--muted)" font-family="var(--mono)">${s}</text>`).join("")}
      <text x="${(L + W) / 2}" y="${H - 2}" text-anchor="middle" fill="var(--muted)">said, in 10</text>
      <line x1="${x(40)}" y1="${y(40)}" x2="${x(100)}" y2="${y(100)}" stroke="var(--band-edge)" stroke-dasharray="4 3"/>
      <polyline points="${pts.map((p) => p[0] + "," + p[1]).join(" ")}" fill="none" stroke="var(--c1)" stroke-width="2"/>
      ${pts.map(([px, py, c]) => `<circle cx="${px}" cy="${py}" r="${3 + Math.sqrt(c.n) / 3}" fill="var(--panel)" stroke="var(--c1)" stroke-width="2"><title>Said ${c.said} in 10 on ${c.n} calls, came true ${c.true}%</title></circle>`).join("")}
    </svg>`;
  }
  CA.views.record = {
    title: "Maya Chen · track record", frame: false,
    render() {
      const R = O.record;
      const cats = ["all", ...new Set(R.calls.map((c) => c.cat))];
      const calls = R.calls.filter((c) => recCat === "all" || c.cat === recCat);
      const top = bar({ home: "public-board", cta: true, right: `<button class="linkbtn u small ox-hidem" data-drawer="outsideRanked">How calls are graded</button>` });
      return shell(top + `<div class="ox-page ox-rec">
        <div class="ox-rh">${U.av(R.who, 48)}<div class="ox-rhm"><h1 class="ox-t">${esc(R.name)}</h1><div class="small muted">${esc(R.handle)} · media buyer · record since ${R.since}</div></div>
          <button class="btn btn-secondary" data-toast="Downloads Maya's track record as a PDF">Download PDF</button></div>
        <div class="ox-ch"><h2 class="ox-h3">Track record</h2><span class="small muted">updated ${R.updated}</span></div>
        <div class="kpi">
          ${U.tile("Graded calls", num(R.graded), `on ${num(R.accounts)} ad accounts`)}
          ${U.tile("Skill, October", num(R.seasonSkill), `<span class="up">${R.seasonMove}</span> on September · global #${R.globalRank}`)}
          ${U.tile("Hit rate", num(R.hitRate + "%"), "of graded calls")}
          ${U.tile("vs the AI", num(R.vsAI), `ahead on ${num(R.paired)} paired calls`)}
        </div>
        <div class="grid2">
          <div class="panel">${U.sectionHead("Skill by season", `<span class="small muted">global rank below</span>`)}${seasonBars(R)}<p class="small muted" style="margin:8px 0 0">* October is provisional until ${D.season.final}.</p></div>
          <div class="panel">${U.sectionHead("Calibration", `<span class="small muted">said vs came true</span>`)}
            <div class="ox-calw">${calibChart(R)}<p class="small" style="margin:0">When Maya says <b>9 in 10</b>, it comes true <b class="num">81%</b> of the time: close to calibrated, slightly overconfident at the top. The dashed line is spot on.</p></div></div>
        </div>
        <div class="sec" style="margin-top:22px">${U.sectionHead("Recent calls", `<span class="small muted">clients shown by category only</span>`)}
          <div class="ox-chips" role="radiogroup" aria-label="Client category">${cats.map((c) => `<button role="radio" aria-checked="${recCat === c}" class="chip${recCat === c ? " on" : ""}" data-cat="${esc(c)}">${c === "all" ? "All categories" : esc(c)}</button>`).join("")}</div>
          ${calls.map((c) => `<div class="ox-dr">${U.ctype(c.type)}<div class="ox-drm"><div><b>${esc(c.what)}</b> <span class="muted">· ${esc(c.pred)} · ${num(c.conf)} in 10</span></div><div class="small muted">${esc(c.cat)} brand · <span class="num">${c.date}</span></div></div><div class="ox-dre">${stampOf(c)}</div></div>`).join("")}
        </div>
        <p class="ox-fine">Shared by Maya. No client names, accounts, budgets, ad images or teams are shown. Grades are computed by CatchAll from Facebook's own numbers and can't be edited.</p>
        <div class="ox-ctab"><div><h2 class="ox-h2">Build a record like this</h2><p class="muted" style="margin:4px 0 0">Log your calls in Ads Manager and take your track record with you between jobs.</p></div><button class="btn btn-primary" data-go="onboard">Start your record free</button></div>
      </div>`, "ox-record");
    },
    mount(root) {
      root.querySelector(".ox-record")?.addEventListener("click", (e) => { const b = e.target.closest("[data-cat]"); if (b) { recCat = b.dataset.cat; CA.rerender(); } });
    },
  };

  /* =====================================================================
     5 · Shared audit snapshot (frozen)
     ===================================================================== */
  CA.views.shared = {
    title: "Acme Skincare · shared audit", frame: false,
    render() {
      const a = O.audit;
      const top = bar({ home: "shared-audit", cta: true, left: `<span class="ox-shared">Shared by ${esc(D.workspace.name)}</span>`, right: `<button class="btn btn-secondary btn-sm ox-hidem" data-toast="Downloads this snapshot as a PDF">Download PDF</button>` });
      return shell(top + `<div class="ox-page ox-sh">
        <div class="ox-frozen"><span>${icon("hold", "ico ox-i16")}<span><b>Snapshot of ${a.snapshot} · shared by ${esc(D.workspace.name)}</b> <span class="muted">Frozen at <span class="num">${a.snapshotTime}</span>: later changes and decisions don't appear here.</span></span></span><span class="small muted">Link expires ${a.expires}</span></div>
        <h1 class="ox-t">Acme Skincare: account audit</h1>
        <p class="lead">Prepared by ${esc(D.workspace.name)} with CatchAll. Every number is computed from the account's own Facebook data and normal ranges.</p>
        <div class="sec">${U.sectionHead("What the last 12 months of changes did")}
          <p>${num(a.changes)} changes. After ${num(a.pctImproved + "%")}, performance improved beyond the account's normal noise; after ${num(a.pctWorse + "%")} it got worse; after ${num(a.pctNone + "%")}, no clear effect.</p>
          ${changeBar()}
          <p class="small muted">What happened after each change, not proof it caused it: changes often overlap. Biggest lever: ${esc(a.lever)}, ${num(a.leverPct + "%")} of creative changes improved after.</p></div>
        <div class="sec">${U.sectionHead("Health")}${healthSummary(true)}</div>
        ${marketSummary("Market: what buyers say")}
        <div class="sec">${U.sectionHead("Competitors", `<span class="small muted">${num(a.competitors)} confirmed</span>`)}
          <p class="small" style="margin:8px 0">Their longest-running ads lean on before-and-after proof; none frame price per use.</p>
          <div class="ox-comp">${O.competitors.map((c) => `<div><b>${esc(c.name)}</b><span class="small muted">${esc(c.note)}</span><span class="num small">longest ad ${c.days} days</span></div>`).join("")}</div></div>
        <p class="ox-fine">Per-buyer breakdowns, notes and unshared predictions are left out. This page is a stored copy and never changes after it's made.</p>
        <div class="ox-ctab"><div><h2 class="ox-h2">Get your own free audit</h2><p class="muted" style="margin:4px 0 0">Connect an ad account read-only and see what your changes did, in about ${num(4)} minutes.</p></div><button class="btn btn-primary" data-go="onboard">Get your own free audit</button></div>
      </div>`, "ox-shared-a");
    },
  };
})();
