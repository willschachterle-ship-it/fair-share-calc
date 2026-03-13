# Fair Share Calculator — Final Fixes & Edits

A running list of improvements to implement after core testing is complete.

---

## 1. ✅ Handle Money-Losing Companies — DONE

**Problem:** When a company has negative net income or EBITDA, the result is confusing — e.g. "your salary would be $-811,982" implies the employee would owe money.

**Examples:** Insmed (-$1.28B net), Intel (-$270M), Snowflake (-$1.29B), Marvell (-$890M)

**Options to consider:**
- Show a distinct message: *"Insmed operated at a loss this period — they burned $914K per employee more than they earned."*
- Replace negative salary figure with $0 and add a note explaining it was a loss year
- Keep EBITDA and net income displays separate since one can be positive while the other is negative (e.g. Insmed)
- Add a visual indicator (red banner, different color) for loss-making companies

---

## 2. ✅ Source Transparency — Add Data Source Links — DONE 2026-03-12

**Problem:** Users can't verify where the numbers come from.

**Desired behavior:** After results are shown, display a small "Sources" section listing:
- Employee count: e.g. "Wikipedia (2024)" with link
- Net income: e.g. "EDGAR 10-K filing" with link, or "Finnhub"
- EBITDA: same as above

**Fallback DB attribution — two distinct cases:**

The fallback DB (`fallback.js`) is populated in two ways, and the source citation must reflect which:

1. **Derived from a known database** (EDGAR, Wikipedia, Finnhub, etc.) and cached in fallback for speed/API preservation → cite the original database, e.g. *"EDGAR (cached)"*
2. **Derived from Claude's training knowledge** — number encoded directly from training data with no live lookup → cite as *"Claude (training data)"*

Each fallback entry should carry a `_src` tag so the client knows which case applies. Entries from live API verification are tagged when added; entries from training knowledge default to `"claude"`.

**Implementation notes:**
- API already returns `resolvedSymbol` and `_errors` — could also return `_sources` object
- Add `_sources` field to API response: `{ emps: "wikipedia", profit: "edgar", ebitda: "finnhub" }`
- Fallback DB entries: add optional `_src` field, e.g. `{ emps: 9600, _src: { emps: "edgar" } }`
- When fallback is used and `_src` is absent, default display to *"Claude (training data)"*
- Client renders sources as small linked footnotes below results
---

## 3. ✅ API Key Security for Public Site — DONE 2026-03-12

**Problem:** API keys (Finnhub, Alpha Vantage, etc.) may be exposed in client-side code or Vercel environment.

**Current setup:** Keys are in Vercel environment variables, called server-side via `/api/company.js` — this is already the right approach.

**Things to verify before going public:**
- Confirm NO API keys appear in `script.js`, `fallback.js`, or any client-side file
- Vercel env vars are server-side only — double-check none are prefixed `NEXT_PUBLIC_` (which would expose them)
- Add rate limiting to `/api/company` endpoint to prevent abuse (Vercel has built-in, but may want custom limits)
- Consider adding a simple CORS check so only your domain can call the API
- Finnhub free tier: 60 calls/min — could add server-side caching (e.g. Vercel KV) for popular tickers
- Alpha Vantage free tier: 25 calls/day — already largely bypassed by fallback DB

---

## 4. ✅ Link to Worker-Owned Companies — DONE 2026-03-12

**Problem/Opportunity:** After showing how little workers get vs. the company, offer an alternative.

**Desired behavior:** Add a link or section like:
*"Want to work somewhere where you actually share in the profits? Here are some worker-owned companies."*

**Resources to link:**
- [USFWC Directory](https://www.usfwc.org/find-a-co-op/) — US Federation of Worker Cooperatives
- [NCEO](https://www.nceo.org/) — National Center for Employee Ownership (ESOPs)
- [ICA Group](https://icagroup.org/) — worker co-op development
- [Mondragon](https://www.mondragon-corporation.com/) — largest worker co-op in the world
- Consider a curated list of well-known ESOPs: Publix, REI, W.L. Gore, Lifetouch, etc.

---

## 5. ✅ Data Source Attribution Analysis Script — DONE 2026-03-13

**Goal:** Understand how reliant the app is on each data source — especially the manually-maintained fallback DB — across all ~1000 companies.

**What to build:** A script that runs all ~1000 companies through the live API, then for each of the three key fields (employees, profit, ebitda) tallies which source actually supplied the winning value, and reports the percentage breakdown.

**Sources to track:**
- `fallback_db` — manually maintained `fallback.js` (the one we most want to minimize)
- `edgar` — SEC XBRL filings
- `fmp` — Financial Modeling Prep
- `finnhub` — Finnhub profile + metrics
- `alphavantage` — Alpha Vantage overview/income
- `wikipedia` — Wikipedia infobox scrape (employees only)
- `10k_text` — 10-K document text parsing (employees only, last resort)
- `none` — field still missing after all sources

**How to implement:**
- Requires the API to return a `_sources` field (see item #2 above) — implement that first
- Script calls each ticker, reads `response._sources.emps`, `._sources.profit`, `._sources.ebitda`
- Tallies counts per source per field, prints a table like:

```
FIELD: employees
  edgar          42%  (420/1000)
  wikipedia      28%  (280/1000)
  finnhub        14%  (140/1000)
  fmp             8%   (80/1000)
  fallback_db     5%   (50/1000)
  10k_text        2%   (20/1000)
  none            1%   (10/1000)

FIELD: profit
  edgar          55%  (550/1000)
  fmp            22%  (220/1000)
  finnhub        10%  (100/1000)
  alphavantage    5%   (50/1000)
  fallback_db     6%   (60/1000)
  none            2%   (20/1000)
...
```

**Why this matters:**
- If fallback_db is >10% of any field, that's a maintenance burden — should investigate whether those companies can be covered by API sources
- Helps prioritize which APIs are worth keeping (if AV only covers 2% of companies and has a 25/day rate limit, may not be worth it)
- Reveals structural gaps: e.g. if international ADRs are 80% of fallback_db, that's a known limitation we can document

**Implementation note:** This script depends on `_sources` being added to the API response (item #2). Do items #2 and #5 together.

---

## 6. ✅ Explain How Taxes Are Calculated — DONE

**Problem:** Users see a "your fair share" dollar figure but have no idea how the tax calculation works — what rate, what brackets, what assumptions.

**Desired behavior:** Add a small expandable "How is this calculated?" section near the result, or a tooltip/footnote on the tax line, explaining:

- The tool estimates federal income tax using **2024 U.S. single-filer tax brackets**
- It applies the standard deduction ($14,600 for 2024) before calculating tax
- It does **not** account for: state/local taxes, FICA (Social Security + Medicare), capital gains rates, deductions beyond the standard deduction, filing status (married, head of household), or any tax credits
- The result is a rough illustration of what a single worker might owe federally — not a tax filing tool

**Implementation notes:**
- A small "(How is this calculated?)" link that expands an inline explanation is less intrusive than a modal
- Could also add a footnote asterisk next to the tax figure: *"Federal income tax estimate only. Actual taxes will vary."*
- The relevant code is in the `calculateTax()` function in `script.js` — the brackets and standard deduction are hardcoded there and should match the explanation shown to users

---

## 7. ✅ Explain Net Income vs. EBITDA — Why We Show Both — DONE

**Problem:** Most users don't know what "EBITDA" means or why it differs from profit, and may not understand why we show two figures.

**Desired behavior:** Add a brief explanation near where the two figures appear in results. Something like:

> **Net income** ([Wikipedia](https://en.wikipedia.org/wiki/Net_income)) is what the company officially "made" after paying all expenses, interest, and taxes — the bottom line on their income statement.
>
> **EBITDA** ([Wikipedia](https://en.wikipedia.org/wiki/EBITDA)) stands for *Earnings Before Interest, Taxes, Depreciation, and Amortization*. It strips out accounting adjustments and financing costs to show how much cash the core business generates. It's often higher than net income.
>
> We show both because net income can be heavily influenced by one-time charges, tax strategies, or debt structure — while EBITDA gives a cleaner picture of ongoing business performance. A company can report low net income while generating substantial cash.

**Why show both:**
- Net income is the legally reported profit figure — it's what determines EPS, dividends, and is most directly comparable to worker wages
- EBITDA strips out depreciation (non-cash) and interest (financing choice) to show operational cash generation — often the figure executives and investors focus on
- For capital-intensive industries (airlines, utilities, manufacturing), EBITDA can be 2–5× net income — showing only one would significantly skew the "fair share" calculation depending on which you pick
- Showing both lets users see the range and form their own judgment

**Implementation notes:**
- A small info icon (ℹ️) or "(What's this?)" link next to each figure label that expands an inline tooltip is the least intrusive approach
- The Wikipedia links to use:
  - Net income: https://en.wikipedia.org/wiki/Net_income
  - EBITDA: https://en.wikipedia.org/wiki/EBITDA
- Could also add a one-line explainer directly in the results card, e.g.:
  - *"Net income: after all expenses & taxes"*
  - *"EBITDA: operating cash flow before interest, taxes & depreciation"*

---

---

## 8. ✅ Top-5000 Output Analysis Script — DONE 2026-03-13

**Goal:** Parse the text output of a full top-1000 test run and produce a statistical breakdown of data quality, source coverage, and financial health across the full company set.

**Why this is separate from item #5:** Item #5 requires `_sources` to be added to the API response first (a code change). This script works *right now* — it parses the existing test output text and infers source from what's already there (`_errors`, fallback DB membership, employee count patterns). No API changes needed.

---

### Stats to capture

**1. Data completeness — pass/fail breakdown**
- Total companies tested / passing / failing
- Breakdown of failure types: NO_EMPS, NO_PROFIT, NO_EBITDA, API_ERROR, FETCH_ERROR

**2. Source attribution per field (emps, profit, ebitda)**

For each field, classify where the winning value came from. Inferred heuristically from test output since `_sources` isn't yet in the API response:

| Source label | How to detect |
|---|---|
| `api_live` | Field present in API response, company NOT in fallback DB |
| `fallback_db_wiki` | Field came from fallback DB AND the entry has a `// Source: Wikipedia` comment (or `_src: 'wikipedia'` once #2 is done) |
| `fallback_db_claude` | Field came from fallback DB with no Wikipedia citation — encoded from training knowledge |
| `fallback_db_unknown` | In fallback DB but source tag absent (legacy entries pre-dating the tagging system) |
| `missing` | Field is null after all sources exhausted |

Report as: `api_live: 847/1000 (84.7%)`, etc., for each of the three fields separately.

**3. Profitability breakdown**
- % of companies with **positive net income** (profit > 0): `X/Y (Z%)`
- % of companies with **negative net income** (profit < 0): `X/Y (Z%)`
- % of companies with **positive EBITDA** (ebitda > 0): `X/Y (Z%)`
- % of companies with **negative EBITDA** (ebitda < 0): `X/Y (Z%)`
- % of companies where **EBITDA > net income by 2× or more** (capital-intensive signal): `X/Y (Z%)`
- % of companies where **net income is positive but EBITDA is negative** (unusual / one-time items): `X/Y (Z%)`

**4. Employee count distribution**
- Median, mean, min, max employee count across all companies with valid emps
- Breakdown by size bucket:
  - Micro (<1,000): X companies
  - Small (1,000–9,999): X companies
  - Mid (10,000–49,999): X companies
  - Large (50,000–249,999): X companies
  - Mega (250,000+): X companies

**5. Year-artifact detection**
- Count of companies where emps value looks like a year (2018–2025) before FORCE_OVERRIDES are applied — useful for catching new regressions in future runs
- Count of companies where emps is a suspiciously round small number (100, 200, 300, 400, 500, 600) that may be a scraper artifact

**6. One-time item flag rate**
- % of companies flagged `hasOneTimeItem: true` in the API response
- Breakdown: how many were profit-flagged vs ebitda-flagged

**7. Fallback DB coverage**
- How many of the 1000 companies have *any* entry in fallback.js
- Of those: how many were needed (i.e., API would have returned null without it) vs redundant (API already returned the value)
- How many fallback entries are emps-only vs full (emps + profit + ebitda)

**8. International vs domestic**
- % of companies with tickers ending in Y, F, or containing `.` (ADR / foreign listing proxies)
- Pass rate for international vs domestic companies separately

---

### Implementation notes

The script should:
1. Accept a test output text file as input (the stdout from `test_top1000_v3.js`)
2. Parse each `[TICKER]` result line with a regex to extract: ticker, name, emps, profit, ebitda, any flags
3. Load `fallback.js` locally (same eval trick used in the test script) to check membership and source tags
4. Compute all stats above and print a formatted report

**Key regex for parsing output lines:**
```js
// Matches:  ✅ [WMT    ] Walmart                             emps=2,100,000  profit=   $19.44B  ebitda=   $40.03B
const LINE_RE = /\[([\w.]+)\s*\]\s+(.+?)\s+emps=\s*([\d,]+|NULL)\s+profit=\s*(-?\$[\d.]+[BM]|NULL)\s+ebitda=\s*(-?\$[\d.]+[BM]|NULL)/;
```

**Fallback DB source tagging (for items #2 and #5):**
Once `_src` tags are added to fallback entries (see item #2), the script can distinguish `fallback_db_wiki` from `fallback_db_claude` precisely. Until then, the script should mark all fallback-sourced values as `fallback_db_unknown` and note this in the report.

**Suggested output format:**
```
════════════════════════════════════════════════════════════
Fair Share Calculator — Top 1000 Data Quality Report
Generated from: output_mar_8_9PM.txt  (993/1000 passing)
════════════════════════════════════════════════════════════

DATA COMPLETENESS
  Passing (all 3 fields present):  993/1000 (99.3%)
  Failing:                           7/1000  (0.7%)
    NO_EMPS only:                    5
    NO_PROFIT or NO_EBITDA:          0
    API_ERROR / FETCH_ERROR:         2

SOURCE ATTRIBUTION — EMPLOYEES
  api_live:              847/993 (85.3%)
  fallback_db_wiki:       62/993  (6.2%)
  fallback_db_claude:     54/993  (5.4%)
  fallback_db_unknown:    30/993  (3.0%)
  missing:                 7/1000 (0.7%)

SOURCE ATTRIBUTION — NET INCOME (PROFIT)
  ...

PROFITABILITY
  Positive net income:    791/993 (79.7%)
  Negative net income:    202/993 (20.3%)
  Positive EBITDA:        921/993 (92.7%)
  Negative EBITDA:         72/993  (7.3%)
  EBITDA ≥ 2× net income: 443/993 (44.6%)

EMPLOYEE COUNT DISTRIBUTION
  Median:   12,500
  Mean:     36,240
  Micro  (<1k):        87 companies
  Small  (1k–10k):    312 companies
  Mid    (10k–50k):   341 companies
  Large  (50k–250k):  198 companies
  Mega   (250k+):      55 companies

...
```

---

---

## 9. ✅ Autocomplete on the Search Input — DONE 2026-03-12

**Problem:** Users type things like "delek" or "cheesecake" and either get a "could not be found" error (because they didn't know the ticker), or type a slightly wrong name and get no result. The search box gives no feedback about what's available before they hit Enter.

**Desired behavior:** As the user types, a dropdown appears showing matching companies with their ticker symbols, e.g.:

```
Delek US Holdings (DK)
Delek Logistics Partners (DKL)
```

Clicking (or keyboard-selecting) a suggestion populates the input with the canonical company name or ticker and triggers the lookup automatically.

**User-facing text format for each suggestion:**
```
Company Name (TICKER)
```
e.g. `Delek US Holdings (DK)` — so users see both the full name and the ticker.

**Where the autocomplete data comes from:**

The app already has everything it needs. The best approach is to build a static company name→ticker lookup table (JSON or JS object) that lives client-side. Sources to combine:
1. The existing `TICKER_ALIASES` object in `script.js` — already maps common name spellings → ticker
2. The `FALLBACK_DB` in `fallback.js` — each key is a ticker with a `name` field
3. The `COMPANY_CONTEXT` object in `script.js` — maps tickers to contextual info including the company name

Merging these three gives a large corpus of `name → ticker` mappings for the autocomplete to search against.

**Search logic:**
- Match on company name substring (case-insensitive), ticker prefix, and common aliases
- Show max 8 suggestions, ranked by: exact ticker match first, then ticker prefix, then name substring sorted alphabetically
- Debounce input at ~200ms to avoid firing on every keystroke
- If input is 1–2 characters, only match ticker prefix (not name substring) to avoid overwhelming results

**UX details:**
- Suggestions appear below the input in a dropdown with subtle border/shadow
- Each suggestion shows: `Company Name (TICKER)` — clicking it fills the input and immediately fetches
- Keyboard navigation: ↑/↓ to move, Enter to select, Escape to dismiss
- If the user types a valid ticker directly (e.g. "AAPL") and presses Enter without selecting a suggestion, behavior is unchanged (existing ticker lookup still works)
- Clicking outside the dropdown dismisses it

**Implementation notes:**
- Build a JS module `autocomplete_data.js` (or inline in `script.js`) with a flat array of `{ ticker, name, aliases }` objects
- The autocomplete UI can be pure CSS + vanilla JS — no library needed for this scope
- Style it to match the existing app design (dark theme if app is dark, etc.)
- The lookup table can be lazily loaded or simply inlined — at ~1000 entries it's only ~50–80KB uncompressed (well within budget)

**Why this matters:**
- Cuts down on "could not be found" errors from name typos or incomplete names
- Makes the app more discoverable — users can type a brand name they know and find the parent company
- Reduces the need for TICKER_ALIASES entries since fuzzy name search does the same job more broadly

---

## Coverage Goals (set 2026-03-12)

**Philosophy:** Raw batch test scores understate real-world performance because FMP's 250 req/day
free-tier quota gets exhausted around company #80 in a sequential batch test. Real users query
one company at a time and never hit rate limits. Batch failures from quota exhaustion are false
negatives. Also, the top5000 list is not equally weighted — the companies that will actually go
viral are the top 200-500, not the micro-caps at the bottom of the list.

**Goals:**

| List | Target | Notes |
|---|---|---|
| viral500 | **100%** | These are the companies that drive shares. All 496 must work. |
| top5000 top-500 (companies 1–500) | **95%+** | The most-searched tier — what users will actually type. |
| top5000 full (1,756 companies) | **~85%** | Accept the tail failures: acquired/delisted tickers, BDCs with no employees, foreign micro-caps. Don't chase these. |

**What the remaining ~15% failures are (acceptable):**
- Acquired/delisted companies (NARI, CHX, TRTN, CTLT, ETRN) — stale entries in the list
- BDCs and investment companies with no real employees (PSEC, SLRC, GLAD, ACRE) — structural limitation
- Foreign micro-cap ADRs with no US filing coverage
- Rate-limit artifacts in batch testing — these work fine in production for real users

**What to fix when a viral500 failure appears:**
1. First check if it's a name resolution failure → add TICKER_ALIASES
2. Then check if it's a data gap → add FORCE_OVERRIDES or SERVER_FALLBACK_DB entry
3. If it's a transient timeout → rerun to confirm, these self-heal

---

## 10. American Flag / US-Only Indicator

**Problem:** The tool is US-only but there's no visual cue reinforcing that.

**Desired behavior:** Add a 🇺🇸 flag somewhere tasteful — likely in the header next to the title or subtitle, or in the "how to use" guidance note at the bottom. Reinforces that this is a US-focused tool without requiring extra text.

---

## 11. ✅ "They Kept $ From You" Copy Tweak — DONE 2026-03-13

---

## 12. ✅ Social Sharing Buttons — DONE 2026-03-13

**Implemented:** X (Twitter), Bluesky, Instagram (canvas card + Web Share API)

**Live buttons:** 𝕏 Post · ☁ Bluesky · 📷 Instagram

**Instagram note — TABLED:** Instagram has no web share URL. Current implementation generates a 1080×1080 canvas card and uses Web Share API (shows native share sheet on iPhone; downloads image on desktop). This is clunky on desktop. Options to revisit:
- Keep download-only and add label "Save for Instagram"
- Remove Instagram button entirely until a better solution exists
- Consider a "Copy image" button that puts it on clipboard for paste into Instagram web

---

## 13. ✅ Fix Tax Calculation Display — Marginal vs. Effective Rate — DONE 2026-03-13

**Two issues reported by users:**

**Bug:** At very low incomes (e.g. $2,000/year), the site may show a tax amount when the correct answer is $0 — income below the standard deduction ($14,600) owes no federal income tax.

**UX confusion:** Users see a percentage like "32%" and think their entire income is taxed at that rate. This is wrong — 32% is the *marginal* rate (only applies to income above ~$191k). Most of a $200k salary is taxed at lower rates.

**Desired behavior:**
- Show **effective tax rate** (total tax ÷ gross income) alongside or instead of the marginal rate, e.g. *"~22% effective federal rate"*
- Add a one-line explainer: *"Tax brackets are progressive — everyone pays the same low rate on the first dollars earned. The 32% rate only applies to income above $191,950."*
- Fix the low-income bug: if income ≤ standard deduction ($14,600), show $0 tax owed

**Why this matters:** Users trust the tool more if the tax math feels right. A $2k/year worker being told they owe tax is an obvious red flag that undermines credibility.

---

## 14. Design Exploration

**Goal:** Try a few different visual design directions for the app.

**Ideas to explore:**
- Overall color palette / theme (current blue-gray vs. something bolder)
- Typography choices — size hierarchy, font weight
- Results card layout — could be more dramatic / emotional
- Header treatment — flag placement, title sizing
- Mobile-first adjustments

---

## Notes

- Keep this file updated as new issues come up during testing
- Prioritize #3 (API key security) before any public launch
- #1 and #2 are UI polish — implement together in one pass
- #4 is a nice-to-have that reinforces the app's message
- #5 depends on #2 (add `_sources` to API response) — do them as a pair
- #6 ✅ DONE — tax brackets, standard deduction, and caveats are on how-it-works.html#federal-tax; linked from results via "How are these calculated?"
- #7 ✅ DONE — "Why we show both," divergence examples, Wikipedia links are on how-it-works.html#ebitda; linked from results via "How was this calculated?"
- #8 (analysis script) can be built and run right now against existing output files — no API changes needed. Upgrade it to use `_sources` once #2 is shipped.
- #9 ✅ DONE 2026-03-12 — autocomplete covers 837 companies including full viral500
