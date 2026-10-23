---
# gstack: design-md-format=spec
name: CatchAll
description: A calibration bench under the CatchAll name. Warm olive paper, graphite ink, one orange for action. Calm, exact, honest, with colour only where a result has earned it.
colors:
  ground: "#F2F1E9"
  panel: "#FFFEF9"
  raised: "#EAE8DA"
  raised-edge: "#D6D3BF"
  rule: "#CFCBB8"
  rule-soft: "#E5E2D5"
  control-edge: "#8C8977"
  text: "#101214"
  text-secondary: "#3B3B34"
  text-muted: "#646358"
  primary: "#C34519"
  primary-hover: "#A83A12"
  on-primary: "#FFFFFF"
  primary-text: "#A83A12"
  needs-tint: "#FBE6DC"
  mark: "#FE6A34"
  band: "#E1E5D2"
  band-edge: "#A9AE93"
  success: "#1A6B57"
  success-tint: "#DCEFE8"
  miss: "#8E3B9E"
  miss-tint: "#F2E4F5"
  inferred: "#4A6A8E"
  inferred-line: "#6E8FB3"
  warning: "#8A5A00"
  warning-tint: "#FFF1CC"
  error: "#B42318"
  gold: "#B08A2E"
  gold-tint: "#F6EDD3"
  silver: "#7D858E"
  silver-tint: "#ECEEF0"
  bronze: "#9A5E35"
  bronze-tint: "#F3E3D6"
  chart-1: "#2F6DB5"
  chart-2: "#B7791F"
  chart-3: "#6B7F2A"
  chart-4: "#8A5A3C"
  chart-5: "#6A7F99"
  chart-6: "#3D4A5C"
  dark-ground: "#14150F"
  dark-panel: "#1B1C16"
  dark-raised: "#23241C"
  dark-raised-edge: "#3A3B2E"
  dark-rule: "#3A3B30"
  dark-rule-soft: "#2A2B22"
  dark-control-edge: "#77786A"
  dark-text: "#ECEBE3"
  dark-text-secondary: "#C8C7BC"
  dark-text-muted: "#A3A295"
  dark-primary: "#FE6A34"
  dark-primary-hover: "#FF8556"
  dark-on-primary: "#14150F"
  dark-primary-text: "#FF8F66"
  dark-needs-tint: "#33210F"
  dark-band: "#2A3125"
  dark-band-edge: "#56634A"
  dark-success: "#5CCBA9"
  dark-success-tint: "#15302A"
  dark-miss: "#D09AE6"
  dark-miss-tint: "#2E1B35"
  dark-inferred: "#9DB6D8"
  dark-inferred-line: "#7F9CC4"
  dark-warning: "#F2C14E"
  dark-error: "#FF6B5E"
  dark-gold: "#E2BE5E"
  dark-gold-tint: "#3A3015"
  dark-silver: "#C3CAD2"
  dark-silver-tint: "#2B2E33"
  dark-bronze: "#D49A6E"
  dark-bronze-tint: "#3A2618"
  dark-chart-1: "#6EA3E0"
  dark-chart-2: "#E0A84A"
  dark-chart-3: "#A3B85A"
  dark-chart-4: "#C2896A"
  dark-chart-5: "#9AAEC8"
  dark-chart-6: "#B9C3D1"
typography:
  display:
    fontFamily: Schibsted Grotesk
    fontWeight: 800
    fontSize: 2.5rem
    letterSpacing: -0.04em
  title:
    fontFamily: Schibsted Grotesk
    fontWeight: 700
    fontSize: 1.625rem
    letterSpacing: -0.03em
  body:
    fontFamily: Schibsted Grotesk
    fontWeight: 400
    fontSize: 0.875rem
    lineHeight: 1.5
  label:
    fontFamily: Schibsted Grotesk
    fontWeight: 600
    fontSize: 0.6875rem
    letterSpacing: 0.06em
  quote:
    fontFamily: Source Serif 4
    fontWeight: 400
    fontSize: 1rem
    lineHeight: 1.45
  mono:
    fontFamily: JetBrains Mono
    fontWeight: 500
    fontFeature: tnum
  score:
    fontFamily: JetBrains Mono
    fontWeight: 600
    fontSize: 2.375rem
    letterSpacing: -0.05em
rounded:
  stamp: 3px
  sm: 5px
  md: 6px
  lg: 8px
  xl: 10px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text}"
    borderColor: "{colors.text}"
    rounded: "{rounded.md}"
  input:
    backgroundColor: "{colors.panel}"
    borderColor: "{colors.control-edge}"
    rounded: "{rounded.md}"
  panel:
    backgroundColor: "{colors.panel}"
    borderColor: "{colors.rule}"
    rounded: "{rounded.lg}"
  scoreboard:
    backgroundColor: "{colors.raised}"
    borderColor: "{colors.raised-edge}"
    rounded: "{rounded.xl}"
  stamp-hit:
    textColor: "{colors.success}"
    backgroundColor: "{colors.success-tint}"
    rounded: "{rounded.stamp}"
  stamp-miss:
    textColor: "{colors.miss}"
    backgroundColor: "{colors.miss-tint}"
    rounded: "{rounded.stamp}"
  stamp-noise:
    textColor: "{colors.text-secondary}"
    backgroundColor: "{colors.band}"
    borderColor: "{colors.band-edge}"
    rounded: "{rounded.stamp}"
  needs-row:
    backgroundColor: "{colors.needs-tint}"
  nav-link:
    textColor: "{colors.text-secondary}"
  nav-link-active:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.text}"
---

# CatchAll

## Overview

**Creative North Star:** a calibration bench under the CatchAll name. Every mark on the page is a measurement or a verdict, so the product feels like it measures you fairly: "it tells you the truth".
**Product context:** CatchAll product 1, a web app for paid-media teams. Buyers log ad decisions with a prediction; calls are graded against the account's own normal range; buyers rank against teammates, an AI and a baseline. Owners get a team dashboard; brands a read-only view. Peers: creative-analytics and attribution tools (Motion, Triple Whale, Madgicx), which skew to dark dashboards or blue SaaS. Screens: `docs/superpowers/specs/2026-10-23-frontend-design.md`.
**Mode per surface:** Operate for the app (Home, decision log, account tabs, logging panel); Read for research tabs (quotes, insights); Persuade only on public pages (shared audit, public leaderboard, buyer record).
**Brand:** family resemblance with the CatchAll site (`~/Documents/catchall-site`): same `CatchAll.` wordmark with the ember dot, ink `#101214`, and orange as the only brand colour. The app has its own working surface (olive paper) rather than the site's night/cream sections. Decided with Derrick, 2026-10-23.
**Key characteristics:**
- Warm, quiet olive-paper page; most of it neutral.
- Results coloured only when they clear the noise; "within noise" is drawn, never hidden.
- Real ad thumbnails and change-type icons make long lists scannable.
- A friendly cream scoreboard with movement (rank change, head to head against the AI), never a dark hero block.
- Serif appears only when a real person said it.

## Colors

**Strategy:** Restrained. Neutrals carry the page; orange is the action; teal and plum are verdicts; a six-colour palette exists only for multi-series data and account markers.
**Light or dark:** light by default. Buyers work in daylight offices beside Ads Manager. Dark mode uses its own olive-dark tokens (the `dark-` set), not an inversion: surfaces step up in lightness for elevation, and the hit, miss and band colours are re-tuned to keep their contrast.

**What each colour means (do not reuse them for anything else):**
- **Orange `primary`:** the main action on a screen (Log a decision, Add why) and "needs you" (needs-a-reason rows and banners, the count in the nav). Nothing else. Rank, "you" and charts are not orange. `primary-text` is for orange text on light grounds (5.3:1); plain `primary` text fails on the ground.
- **`mark`:** the ember dot in the wordmark only (2.5:1 on the ground; decorative, never meaningful).
- **`success` (teal) and `miss` (plum):** a graded call that cleared the normal range (hit or miss), and movement arrows (▲ teal, ▼ plum). Teal vs plum stays distinguishable for deuteranopia, protanopia and tritanopia (checked 2026-10-23). Never decoration, never a chart series, and not for the change-history scorecard ("improved / got worse" are neutral outlined stamps with ▲/▼, because past changes have no prediction).
- **`band` / `band-edge`:** the account's normal range. Results inside it are "within noise": neutral text on the band, always with the edge (the fill alone is 1.13:1 on the ground). In charts, the band is hatched with edge lines.
- **`inferred` / `inferred-line`:** claims the research wrote itself. Text uses `inferred` (5.2:1); dashed outlines use `inferred-line`.
- **`warning`:** connection and data problems (reconnect, waiting on Facebook). Not a grade.
- **`gold`, `silver`, `bronze`:** leaderboards only: the #1–3 medals, and gold for the prize line and the trophies on prize rows. Never anywhere else.
- **`chart-1`…`chart-6`:** multi-series charts (share of search, creative clusters, segments) and account colour markers. Deliberately excludes orange, teal and plum so a chart never reads as hits and misses.

**Surfaces:** three only: `ground` (page), `panel` (cards, tables, sidebar, top bar), `raised` (scoreboard, hover, selected nav, icon tiles). `band` is a data colour, never a surface.

**Contrast (checked 2026-10-23):** text on ground/panel ≥ 4.5:1 for every text token; `control-edge` 3.1–3.5:1 for inputs and select borders; `rule` 1.4–1.6:1 for dividers (non-essential). Dark tokens all ≥ 4.5:1 for text.

## Typography

- **Schibsted Grotesk** (Google Fonts, weights 400–800): titles and interface. A face made for a news publisher: factual, not decorative. Display 800, titles 700, labels 600 uppercase at 11px with 0.06em tracking.
- **Source Serif 4** (Google Fonts, opsz 8–60, 400–500): **only** for words a real person said (customer, competitor and gatekeeper quotes). Never for the product's own text or the research's inferred claims. This is how "observed vs inferred" shows without reading the badge.
- **JetBrains Mono** (Google Fonts, 400–600): every figure: numbers in table cells and in running text, stamps' detail text, dates in lists and big scoreboard numbers.
- **Why figures are mono:** Schibsted's tabular figures space out punctuation (`$1 .20`, `+0 . 22`), seen in the v4 preview and the first full mockups. Mono is tabular by nature with normal punctuation. Never turn on `tabular-nums` for Schibsted text.
- **Loading:** one Google Fonts request: `family=Schibsted+Grotesk:wght@400;500;600;700;800&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500&family=JetBrains+Mono:wght@400;500;600&display=swap` (stylesheets fetched and verified 2026-10-23). Self-host before launch if the privacy review prefers.
- **Scale:** display 40px · page title 26px · section 15–20px · body 14px · small 12–12.5px · label 11px. Levels differ by size, not only weight.

## Layout

- App frame: top bar (wordmark, workspace, search, + Log a decision, notifications, profile), 200px left sidebar, content. Home adds a 290px right rail (mini team board, team today) at ≥ 1100px; below that it stacks.
- Content max width about 1280px; 24–28px content padding; 4px spacing base; compact density (table rows ~44px with a 32px thumbnail).
- Dense tables: sticky header with a 1.5px ink rule under it, alternating row tint (`raised` at about 35% over panel), hover `raised`, numbers right-aligned in tabular figures, result stamps right-aligned.
- Phones: Home, My calls, Leaderboard and the weekly report work at phone width (sidebar collapses, scoreboard tiles go 2×2, the right rail stacks under). Logging and account tabs are desktop-first.

## Elevation & Depth

Depth comes from surface steps and borders: ground → panel (1px `rule` border) → raised. The app frame in previews uses one soft offset shadow (`0 1px 2px` + `0 10px 30px` at ~6% ink). No zero-offset glows, no frosted glass, no cards inside cards: inside a panel, separate with space and a rule.

## Shapes

Stamps 3px (square-cornered on purpose: they're struck, not pills). Thumbnails and icon tiles 5px. Buttons and inputs 6px. Panels 8px. Scoreboard and the app frame 10px. Avatars round.

## Components

- **Grade stamp:** uppercase Schibsted 700 at 11px (minimum), 1.5px border in the stamp's colour, tint fill, detail (horizon, date) in mono. States: `hit`, `miss`, `within noise` (band fill + band-edge border), `waiting` (dashed muted border, "Day 5 of 7"), `reference` (thin ink border, for the AI and baseline rows). **Correction:** the new stamp, then a grey "Was HIT · date" stamp beside it; the first grade is never edited (append-only).
- **Evidence:** observed quotes get a serif quote mark (“), serif text, source line and an `OBSERVED` badge (solid ink-2 border). Inferred items get a sans ◇ marker, sans text and an `INFERRED` badge (dashed `inferred-line`). In long lists use these markers; the full dashed box is only for one highlighted claim.
- **List row (decision log, Home lists):** date (mono, muted) · 32px real ad thumbnail when the change touched an ad, otherwise a change-type icon tile · what changed (bold verb + detail + muted campaign) · account (colour marker + name) · buyer · prediction · result stamp or "Add why". Needs-a-reason rows use `needs-tint`.
- **Icons:** one open-licence line set (Lucide), 1.7 stroke, 18px in tiles. One per change type: budget, creative, audience, bid, pause, holding. No decorative icons above headings.
- **Scoreboard:** `raised` block with white tiles: rank, hit rate, skill, capture; big numbers in mono 600; movement in teal ▲ / plum ▼ mono; season and days left in mono. Head-to-head bar against the AI: your share in `primary`, the AI's in `text-muted`. Week one shows stakes (first result date, calls to qualify with a 20-box meter, capture, prize pool once legal signs off) instead of empty numbers.
- **Leaderboard:** medals (26px circles, 2px border, tint fill, mono numeral) for #1–3; other ranks plain mono. A trophy icon (gold) on every row inside the prize places, and a dashed 2px gold **prize line** labelled "Prize places · top N" ("· rules pending" until legal signs off; amounts never shown before then). The number of prize places is a per-season setting, never hard-coded (5 for now). Movement column ▲ teal / ▼ plum / – muted. Reference rows (AI, baseline) sit at their skill position, never count as places. The You card: rank, distance to the line ("0.03 from a prize place") with a gap bar marked at the line. "Not ranked yet" lists what each person needs to qualify. Season closed: a three-medal podium. Global board: same, without reference rows.
- **"You":** bold row plus a small uppercase `YOU` tag with an ink border. Not orange.
- **Buttons:** primary orange (one per area), secondary white with ink border, ghost with `control-edge`. Focus: 2px `primary` outline, 2px offset. Disabled: 45% opacity, no pointer.
- **Inputs:** `control-edge` border; focus replaces it with a 2px `primary` outline; error border and help text in `error`; help text muted 12px.
- **Segmented controls and chips:** selected = ink fill with ground text.
- **Charts:** the normal band is always drawn (hatched band + edge lines). Changes are ticks on the time axis: ink = logged, `primary` = needs a reason, hollow muted = changed outside your team. A point that left the range takes the result colour. Multi-series use `chart-1`…`chart-6` in order.
- **Empty and waiting states:** follow the day-one rule (what's coming, when, one action). Illustrations allowed **only** here, as commissioned or licensed artwork; never drawn in CSS.

## Building it (from the 2026-10-23 design review)

The mockups in `docs/superpowers/specs/2026-10-23-frontend-mockups/full/` are throwaway HTML: right for layout, content and states, not code to copy. The review found these for the real Django templates:

- **One component library.** The mockups re-implement the same pieces per page (stamps, badges, list rows, scoreboard, empty states, drawers, checkboxes, ghost buttons, the app frame). Build each once as a template partial plus one stylesheet; pages never carry their own copies.
- **Tokens with DESIGN's names.** CSS custom properties named as in the front matter (`--primary`, `--success`, `--miss`, `--text`…), plus spacing (`--space-1`…`--space-7` = 4/8/12/16/24/32/48), radius and shadow tokens (shadows re-tuned for dark mode). No raw hex in templates except ad-thumbnail fallbacks.
- **Real breakpoints:** 1100px (right rail stacks), 900px (two-column grids stack), 760px (sidebar becomes a scrolling top nav, top bar drops search, tiles 2×2, tables scroll inside their panel, drawers full width). No separate "phone" markup.
- **Real controls and semantics:** buttons are `<button>`, links are links; chips and segmented controls are radio groups; every input has a `<label for>`; the current nav item and tab carry `aria-current`; decorative SVGs `aria-hidden`; one `h1` per page and no skipped heading levels; a visible `:focus-visible` ring on everything interactive.
- **Text minimum 11px** everywhere, including badge counts, avatars and chart labels.
- **One set of numbers per person:** every surface reads the same figures (calls logged, graded, counted, hit rate, skill, rank) from one service, so Home, My calls, the leaderboard and reports never disagree.
- **Words for buyers:** never show "Brier"; a single call's score reads "Score 0.14 · lower is better" with the definition on hover. Dates in text read "Nov 4"; dates in lists and tables are mono.
- **Badges only when they say something:** no badge for the default tier (recorded); "From history" until a reason is added; "Recalled" only after.
- **Actions that can't run yet are disabled with a reason** (Share audit and Run again while an audit or import is running).

## Do's and Don'ts

- Do keep most of every screen neutral; let colour mean a verdict, an action or "needs you".
- Do always draw "within noise" with its band edge; never let it fade into the page.
- Do show the real ad thumbnail wherever a change touched an ad.
- Do label every grade with its word (HIT, MISS, WITHIN NOISE); colour is never the only signal.
- Do set real quotes in serif and nothing else in serif.
- Don't put a dark hero or scoreboard block on Home (Derrick: "too serious and scary").
- Don't use orange for rank, "you", charts or decoration; don't use teal or plum outside results.
- Don't use Facebook blue as an accent; the app must not blur into Ads Manager.
- Don't add illustrations, blobs or icon tiles to working screens.
- Don't nest cards; don't use coloured left borders as a status signal.

## Motion

- **Approach:** minimal-functional.
- **Easing:** enter ease-out, exit ease-in, move ease-in-out.
- **Duration:** micro 80ms, short 150–200ms (hovers, panel), medium 250–300ms (slide-out logging panel).
- **The one authored moment:** the result reveal. When a new grade is first shown, its marker slides (900ms) from the centre to where the metric actually landed on a scale with the normal band, then the stamp strikes (380ms, slight overshoot). Plays once per result per person, never on list renders, and not at all under `prefers-reduced-motion`.

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-10-23 | Initial design system created | /design-consultation with Derrick: product brief, web research, one independent Claude design voice (Codex not installed), HTML previews v1–v4 |
| 2026-10-23 | Family resemblance with the CatchAll site | Same wordmark, ink and orange; the site is a reference for the brand approach, not a style to copy (Derrick) |
| 2026-10-23 | Olive paper ground (`#F2F1E9`) | Derrick preferred sage, then warm paper; chose the halfway blend over cool grey/white |
| 2026-10-23 | No dark scoreboard; cream scoreboard with movement | Dark block felt "too serious and scary"; earlier light drafts felt "boring" |
| 2026-10-23 | Ad thumbnails, change-type icons, right rail, chart palette | Derrick wanted more visual engagement; thumbnails are real content |
| 2026-10-23 | Miss changed from raspberry to plum | Colour-blindness check: teal vs raspberry indistinguishable under deuteranopia |
| 2026-10-23 | Orange limited to action and "needs you"; band gets an edge; contrast fixes | Independent design review and measured contrast checks |
| 2026-10-23 | Leaderboard medals, prize line (top 5), trophies, movement | Derrick wanted the board more engaging; prize-places count is configurable |
| 2026-10-23 | All figures in JetBrains Mono | Schibsted tabular figures break decimal punctuation |
| 2026-10-23 | Design review of the full mockups | Fixed in mockups: figures in mono, 11px minimum, focus rings, phone rules, cross-page numbers; build requirements recorded above |
| 2026-10-23 | Started before the UI/UX hire | Reverses part of DES-1 / SF-5; the designer can rework any of it |
