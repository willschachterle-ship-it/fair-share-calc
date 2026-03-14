# Fair Share Calculator — Handoff Doc
*Last updated: 2026-03-14*

## What This Is
A web app where users enter their employer's name and their salary, and see what their "fair share" of company profits would be if distributed equally across all employees. Designed to go viral on social media, especially among working-class communities on Facebook, Reddit, and X/Twitter.

**Live site:** https://fair-share-calc.vercel.app
**GitHub:** willschachterle-ship-it/fair-share-calc
**Vercel:** auto-deploys from `main` on push

---

## Tech Stack
- **Frontend:** Vanilla HTML/CSS/JS — no framework
- **Backend:** Vercel serverless function at `api/company.js`
- **Data sources:** SEC EDGAR, Financial Modeling Prep (FMP), Finnhub, Alpha Vantage, Wikipedia scrape, local fallback DB
- **Autocomplete data:** Static client-side, ~837 companies

---

## Key Files

| File | Purpose |
|---|---|
| `index.html` | Main page |
| `script.js` | All frontend logic — search, calculation, UI, share buttons, autocomplete |
| `style.css` | Design B styling (chosen by user in design exploration) |
| `api/company.js` | Vercel serverless function — fetches employee count, net income, EBITDA |
| `fallback.js` | Local fallback DB for companies where APIs fail |
| `ac_list.js` | Autocomplete company list |
| `how-it-works.html` | Explanation page — tax methodology, EBITDA explainer, etc. |
| `design-preview.html` | 3 design mockups (deployed, shareable) |
| `FINAL_FIXES.md` | Full task list with viral strategy items (#16a–h) |
| `reddit-posts.md` | Comment/post templates per subreddit |
| `YourFairShare_ViralStrategy.docx` | Full viral strategy document |
| `data_analysis.js` | Batch analysis script (local only, not deployed) |

---

## Current Features (Live)
- 🇺🇸 Flag in header
- Autocomplete search (837 companies — full viral500 covered)
- Animated progress bar with cycling status labels during API load
- Share buttons: 𝕏 · Facebook · WhatsApp · Reddit · Text
- Source attribution (SEC EDGAR labels shown below results)
- Worker co-op callout after results
- Tax display: progressive bracket note with concrete dollar amounts
- Money-losing company handling (shows loss message instead of negative salary)
- One-time item flagging
- Design B styling
- Source transparency (data sourced from EDGAR, FMP, Finnhub, Wikipedia)

---

## Open Tasks (from FINAL_FIXES.md)

All original items #1–#13 are **DONE**. Open items are the viral strategy tier:

| # | Item | Priority | Notes |
|---|---|---|---|
| 16a | Count-up animation on result number | HIGH | ~1.2s ease-out, makes result screenshot-worthy |
| 16b | Pre-written share captions (3 tap-to-copy) | HIGH | Neutral / Pointed / CTA variants |
| 16c | "Where did the money go?" (buybacks/dividends per worker) | HIGH | High emotional impact, hardcode top 200 companies |
| 16d | Worker-owned alternative panel by industry | MED | Collapsible, static JSON by industry |
| 16e | Industry wage context (BLS median pay) | MED | Hardcoded from BLS data |
| 16f | Company-specific SEO landing pages | LOW | `/company/walmart` etc., pre-rendered |
| 16g | Anonymous search analytics | LOW | Log ticker + salary range, no PII |
| 16h | Email capture (low-friction) | LOW | "Alert when [Company] updates" opt-in |
| 12 | Instagram sharing | TABLED | Clunky on desktop, revisit later |

**Recommended next:** #16a (count-up animation) or #16c ("where did the money go") — highest emotional impact, relatively quick to build.

---

## Coverage Goals

| List | Target | Status |
|---|---|---|
| viral500 (496 companies) | 100% | Achieved |
| top5000 top-500 | 95%+ | ~achieved in production (batch tests undercount due to FMP rate limits) |
| top5000 full (1,756) | ~85% | Accept tail failures: delisted, BDCs, foreign micro-caps |

**Batch test caveat:** FMP free tier = 250 req/day, exhausted around company #80 in sequential batch tests. Real users query one at a time and never hit rate limits. Batch failures are false negatives for production quality.

---

## Data Pipeline

The API (`api/company.js`) tries sources in this order for each field:
1. **SEC EDGAR** (XBRL filings)
2. **FMP** (Financial Modeling Prep)
3. **Finnhub**
4. **Alpha Vantage**
5. **Wikipedia** (employees only)
6. **10-K text parsing** (employees only, last resort)
7. **FALLBACK_DB** (local `fallback.js`) — manually maintained

The API returns `_sources` field so the client knows which source supplied each value. Fallback entries have `_src` tags distinguishing EDGAR-cached vs Claude-training-knowledge entries.

---

## Reddit Viral Strategy

**Quick reference:** Ask Claude "any good Reddit posts right now?" — it will scan live and suggest top 2–3 opportunities with tailored comment versions.

Templates saved in `reddit-posts.md`:

| Subreddit | Angle | Key number |
|---|---|---|
| r/Walmart | $19,060 per worker | Safe, well-tested |
| r/AmazonFC | $33,333 per worker | No union language |
| r/antiwork | Standalone post + comments | Preaching to choir but easy share |
| r/WorkReform | Standalone post + comment | Good reach |
| r/Nurses | HCA $22,000 angle | Industry-specific |
| r/Teachers | For-profit ed companies only | Limited use |

**Rules:**
- Comment in threads <6h old
- Add one genuine sentence before the link
- No union language in r/AmazonFC
- Don't post same link in >2–3 threads/day

---

## Messaging Rules (from strategy doc)

- ✅ Use: "your fair share", "the money you helped create", "if profits were split equally"
- ❌ Avoid: "exploitation", "capitalism" (as slur), "class war", "redistribution", "corporate greed"
- **Primary audience:** apolitical workers who feel financially squeezed
- **Highest-ROI platform:** Facebook (older, working-class, less politically sorted)
- **Seeding:** Company-specific FB groups (e.g. "Walmart Employees"), not generic political groups

---

## How the Calculation Works

1. User enters company name + their salary
2. App fetches: employee count, net income (profit), EBITDA
3. **Fair share = net income ÷ employee count** (and separately for EBITDA)
4. Shows: what each worker's share would be, estimated federal tax on that amount, and "what they kept from you" (fair share minus salary, if positive)
5. Tax uses 2024 US single-filer brackets + $14,600 standard deduction. Federal only — no state/FICA/credits.

---

## Session History (recent)

**2026-03-13 evening:**
- Social share buttons (X, Facebook, WhatsApp, Reddit, Text)
- Design B chosen and applied
- How-it-works.html: jump nav, worked tax example, bracket table
- Tax display: effective rate removed, concrete bracket amounts added
- Reddit strategy doc created
- FINAL_FIXES cleanup

**2026-03-12:**
- Source transparency / attribution
- API key security (Vercel env vars, server-side only)
- Worker co-op links
- Autocomplete (837 companies)
- American flag header
- "They Kept $ From You" copy

**2026-03-12 and earlier:**
- Money-losing company handling
- Tax calculation and explainer
- Net income vs EBITDA explainer
- Data analysis scripts (top5000, viral500 batch tests)
