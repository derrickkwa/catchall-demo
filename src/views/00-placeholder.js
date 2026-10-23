/* temporary: replaced by real views */
CA.views.home = CA.views.home || { title: "Home", nav: "home", render: (c) => `<h2>Home</h2><p class="muted">Role: ${c.role}, moment: ${c.phase}</p>${c.D.decisions.slice(0,3).map(d=>c.U.row(d)).join("")}` };
