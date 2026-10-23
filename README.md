# CatchAll product demo

A click-through demo of the CatchAll web app for founders and investor demos. Sample data only: no backend, no logins.

- `python3 build.py` bundles `src/` into `dist/index.html` (hosted) and `dist/local.html` (open in a browser).
- Design system: `DESIGN.md` (copied from the product repo's `docs/frontend-design` branch). Screen spec: the product repo's `docs/superpowers/specs/2026-10-23-frontend-design.md`.
- `src/data.js` holds the shared sample data; every screen reads from it so numbers agree. All names are fictional.
- Views register in `src/views/*.js` as `CA.views[name]`; drawers as `CA.drawers[name]`. Navigation tokens: `home`, `log`, `calls`, `board`, `acct-acme-health`, `team`, `prefs`, `profile`, `onboard`, `client`, `public-board`, `record`, `shared-audit`.
- The bar at the top is presenter controls (view as Buyer / Owner / Client, a month in / day one, jump to any screen, light / dark). It is not part of the product.

## Hosting
- GitHub Pages serves `docs/` from `main`: https://derrickkwa.github.io/catchall-demo/ (public to anyone with the link; `noindex` keeps it out of search results).
- After changing `src/`, run `python3 build.py` and commit `docs/` too.
- A private copy is also published at https://claude.ai/artifact/WTgsBsuTX2j3j9shBDGdP3 (republish `dist/index.html`).
