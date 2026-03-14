// ═══════════════════════════════════════════════════════════════════════════════
// Fair Share Calculator — Combined Data Quality & Source Attribution Analysis
// Implements FINAL_FIXES #5 (source attribution) and #8 (output analysis)
//
// HOW TO RUN:
//   node data_analysis.js [--list top5000|viral500] [--limit N] [--delay 400] [--out file.json]
//
//   Examples:
//     node data_analysis.js --list viral500 --delay 400
//     node data_analysis.js --list top5000 --limit 500 --delay 400
//     node data_analysis.js --list top5000 --delay 400
//
// Queries the live API by ticker (?symbol=TICKER) to capture _sources.
// Reports: source attribution per field, data completeness, profitability
// distribution, employee distribution, artifact detection, and more.
// ═══════════════════════════════════════════════════════════════════════════════

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const BASE_URL = 'https://fair-share-calc.vercel.app/api/company';

// ─── CLI ARGS ─────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
function getArg(flag, def) {
    const i = args.indexOf(flag);
    return i !== -1 && args[i+1] ? args[i+1] : def;
}
const LIST_NAME = getArg('--list', 'top5000');
const DELAY_MS  = parseInt(getArg('--delay', '400'), 10);
const OUT_FILE  = getArg('--out', null);

// ─── Load company list ────────────────────────────────────────────────────────
const LIST_FILE = LIST_NAME === 'viral500'
    ? path.join(__dirname, 'viral500 list.js')
    : path.join(__dirname, 'top5000_list.js');

if (!fs.existsSync(LIST_FILE)) {
    console.error('❌ List file not found:', LIST_FILE);
    process.exit(1);
}
const { TOP5000_COMPANIES } = require(LIST_FILE);
const LIMIT = parseInt(getArg('--limit', String(TOP5000_COMPANIES.length)), 10);
const companies = TOP5000_COMPANIES.slice(0, LIMIT);

// ─── HTTP helper ──────────────────────────────────────────────────────────────
function apiFetch(url) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, { timeout: 15000 }, (res) => {
            let data = '';
            res.on('data', d => data += d);
            res.on('end', () => {
                try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
                catch(e) { reject(new Error('JSON parse error')); }
            });
        });
        req.on('error', reject);
        req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
        setTimeout(() => { try { req.destroy(); } catch(e) {} reject(new Error('hard timeout')); }, 20000);
    });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isYearArtifact(n)  { return n >= 2015 && n <= 2026; }
function isRoundArtifact(n) { return n > 0 && n <= 600 && n % 100 === 0; }
function isADR(ticker)      { return /[YF]$/.test(ticker) || ticker.includes('.'); }

function median(arr) {
    if (!arr.length) return null;
    const s = [...arr].sort((a, b) => a - b);
    const m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : Math.round((s[m-1] + s[m]) / 2);
}
function mean(arr) {
    return arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : null;
}
function fmtN(n) {
    if (n === null || n === undefined) return 'N/A';
    return n.toLocaleString();
}

// ─── Fetch one company by TICKER ──────────────────────────────────────────────
async function fetchOne(ticker, name) {
    try {
        const url = `${BASE_URL}?symbol=${encodeURIComponent(ticker)}`;
        const { status, body } = await apiFetch(url);

        if (status === 404 || body?.error) {
            return { ticker, name, ok: false, error: 'API_ERROR',
                     emps: null, profit: null, ebitda: null,
                     _sources: null, hasOneTimeItem: false };
        }

        const emps   = body.emps   ?? null;
        const profit = body.profit ?? null;
        const ebitda = body.ebitda ?? null;
        const missing = [];
        if (!emps)   missing.push('NO_EMPS');
        if (profit === null) missing.push('NO_PROFIT');
        if (ebitda === null) missing.push('NO_EBITDA');

        return {
            ticker,
            name:          body.name || name,
            ok:            missing.length === 0,
            missing,
            emps,
            profit,
            ebitda,
            _sources:      body._sources || null,
            hasOneTimeItem: body.hasOneTimeItem || false,
            isADR:         isADR(ticker),
        };
    } catch(err) {
        return { ticker, name, ok: false, error: 'FETCH_ERROR',
                 emps: null, profit: null, ebitda: null,
                 _sources: null, hasOneTimeItem: false };
    }
}

// ─── Tally helpers ────────────────────────────────────────────────────────────
function tally(arr) {
    const counts = {};
    for (const v of arr) counts[v] = (counts[v] || 0) + 1;
    return counts;
}

function pct(n, total) {
    return total ? ((n / total) * 100).toFixed(1) + '%' : '0%';
}

function printSourceTable(label, sources, total) {
    const t = tally(sources.filter(s => s !== null));
    const order = ['edgar','fmp','finnhub','alphavantage','wikipedia','10k',
                   'stockanalysis','cmc','yahoo','claude','verified','estimated','missing'];
    const rows = [...order, ...Object.keys(t).filter(k => !order.includes(k))];
    console.log(`\n  ${label}:`);
    for (const src of rows) {
        if (!t[src]) continue;
        const bar = '█'.repeat(Math.round(t[src] / total * 30));
        console.log(`    ${src.padEnd(16)} ${String(t[src]).padStart(4)}/${total}  (${pct(t[src], total).padStart(5)})  ${bar}`);
    }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
    const estMins = Math.ceil(companies.length * DELAY_MS / 60000);
    console.log('═'.repeat(72));
    console.log(`Fair Share — Data Quality & Source Analysis`);
    console.log(`List: ${LIST_NAME.toUpperCase()}  |  Companies: ${companies.length}  |  ~${estMins} min`);
    console.log('═'.repeat(72) + '\n');

    const results = [];
    let i = 0;
    for (const { ticker, name } of companies) {
        i++;
        if (i % 50 === 0) process.stdout.write(`  ── ${i}/${companies.length} ──\n`);
        const r = await fetchOne(ticker, name);
        results.push(r);
        process.stdout.write(r.ok ? '.' : (r.error ? 'E' : 'x'));
        await sleep(DELAY_MS);
    }
    process.stdout.write('\n\n');

    // ── Segment data ──────────────────────────────────────────────────────────
    const passing  = results.filter(r => r.ok);
    const failing  = results.filter(r => !r.ok);
    const apiErr   = failing.filter(r => r.error === 'API_ERROR');
    const fetchErr = failing.filter(r => r.error === 'FETCH_ERROR');
    const noEmps   = failing.filter(r => r.missing?.includes('NO_EMPS'));
    const noProfit = failing.filter(r => r.missing?.includes('NO_PROFIT'));
    const noEbitda = failing.filter(r => r.missing?.includes('NO_EBITDA'));

    const domestic = results.filter(r => !r.isADR);
    const adrs     = results.filter(r => r.isADR);

    const withEmps   = results.filter(r => r.emps !== null);
    const withProfit = results.filter(r => r.profit !== null);
    const withEbitda = results.filter(r => r.ebitda !== null);

    // ── 1. DATA COMPLETENESS ─────────────────────────────────────────────────
    console.log('═'.repeat(72));
    console.log('DATA COMPLETENESS');
    console.log('─'.repeat(72));
    console.log(`  Passing (all 3 fields):  ${passing.length}/${results.length}  (${pct(passing.length, results.length)})`);
    console.log(`  Failing:                 ${failing.length}/${results.length}  (${pct(failing.length, results.length)})`);
    console.log(`    NO_EMPS only:          ${noEmps.length}`);
    console.log(`    NO_PROFIT/NO_EBITDA:   ${noProfit.length + noEbitda.length}`);
    console.log(`    API_ERROR:             ${apiErr.length}`);
    console.log(`    FETCH_ERROR (timeout): ${fetchErr.length}`);

    console.log(`\n  Domestic (non-ADR):      ${domestic.length}  →  ${passing.filter(r=>!r.isADR).length} passing  (${pct(passing.filter(r=>!r.isADR).length, domestic.length)})`);
    console.log(`  ADR / foreign:           ${adrs.length}  →  ${passing.filter(r=>r.isADR).length} passing  (${pct(passing.filter(r=>r.isADR).length, adrs.length)})`);

    // ── 2. SOURCE ATTRIBUTION ─────────────────────────────────────────────────
    const hasSources = results.filter(r => r._sources);
    if (hasSources.length) {
        console.log('\n' + '═'.repeat(72));
        console.log(`SOURCE ATTRIBUTION  (${hasSources.length}/${results.length} companies returned _sources)`);
        console.log('─'.repeat(72));

        const empsSrcs   = hasSources.map(r => r._sources?.emps   || 'missing');
        const profitSrcs = hasSources.map(r => r._sources?.profit || 'missing');
        const ebitdaSrcs = hasSources.map(r => r._sources?.ebitda || 'missing');

        printSourceTable('EMPLOYEES', empsSrcs, hasSources.length);
        printSourceTable('NET INCOME (PROFIT)', profitSrcs, hasSources.length);
        printSourceTable('EBITDA', ebitdaSrcs, hasSources.length);
    } else {
        console.log('\n⚠️  No _sources data returned — deploy may be pending.');
    }

    // ── 3. PROFITABILITY ──────────────────────────────────────────────────────
    const profPos  = withProfit.filter(r => r.profit > 0);
    const profNeg  = withProfit.filter(r => r.profit < 0);
    const ebitPos  = withEbitda.filter(r => r.ebitda > 0);
    const ebitNeg  = withEbitda.filter(r => r.ebitda < 0);
    const ebit2x   = withProfit.filter(r => r.ebitda !== null && r.profit > 0 && r.ebitda >= r.profit * 2);
    const oddCase  = withProfit.filter(r => r.ebitda !== null && r.profit > 0 && r.ebitda < 0);

    console.log('\n' + '═'.repeat(72));
    console.log('PROFITABILITY');
    console.log('─'.repeat(72));
    console.log(`  Positive net income:     ${profPos.length}/${withProfit.length}  (${pct(profPos.length, withProfit.length)})`);
    console.log(`  Negative net income:     ${profNeg.length}/${withProfit.length}  (${pct(profNeg.length, withProfit.length)})`);
    console.log(`  Positive EBITDA:         ${ebitPos.length}/${withEbitda.length}  (${pct(ebitPos.length, withEbitda.length)})`);
    console.log(`  Negative EBITDA:         ${ebitNeg.length}/${withEbitda.length}  (${pct(ebitNeg.length, withEbitda.length)})`);
    console.log(`  EBITDA ≥ 2× net income:  ${ebit2x.length}/${withProfit.length}  (${pct(ebit2x.length, withProfit.length)})  (capital-intensive)`);
    console.log(`  Profit+ but EBITDA-:     ${oddCase.length}/${withProfit.length}  (${pct(oddCase.length, withProfit.length)})  (unusual — one-time items?)`);
    console.log(`  Has one-time item flag:  ${results.filter(r=>r.hasOneTimeItem).length}/${results.length}`);

    // ── 4. EMPLOYEE DISTRIBUTION ──────────────────────────────────────────────
    const empValues = withEmps.map(r => r.emps);
    const micro  = withEmps.filter(r => r.emps < 1000);
    const small  = withEmps.filter(r => r.emps >= 1000  && r.emps < 10000);
    const mid    = withEmps.filter(r => r.emps >= 10000 && r.emps < 50000);
    const large  = withEmps.filter(r => r.emps >= 50000 && r.emps < 250000);
    const mega   = withEmps.filter(r => r.emps >= 250000);

    console.log('\n' + '═'.repeat(72));
    console.log('EMPLOYEE COUNT DISTRIBUTION');
    console.log('─'.repeat(72));
    console.log(`  Median:  ${fmtN(median(empValues))}`);
    console.log(`  Mean:    ${fmtN(mean(empValues))}`);
    console.log(`  Min:     ${fmtN(Math.min(...empValues))}`);
    console.log(`  Max:     ${fmtN(Math.max(...empValues))}`);
    console.log(`  Micro  (<1k):         ${micro.length}`);
    console.log(`  Small  (1k–10k):      ${small.length}`);
    console.log(`  Mid    (10k–50k):     ${mid.length}`);
    console.log(`  Large  (50k–250k):    ${large.length}`);
    console.log(`  Mega   (250k+):       ${mega.length}`);

    // ── 5. ARTIFACT DETECTION ─────────────────────────────────────────────────
    const yearArt  = withEmps.filter(r => isYearArtifact(r.emps));
    const roundArt = withEmps.filter(r => isRoundArtifact(r.emps));

    console.log('\n' + '═'.repeat(72));
    console.log('ARTIFACT DETECTION');
    console.log('─'.repeat(72));
    console.log(`  Year artifacts  (emps looks like a year):  ${yearArt.length}`);
    if (yearArt.length) yearArt.forEach(r => console.log(`    [${r.ticker}] emps=${r.emps}`));
    console.log(`  Round artifacts (suspiciously round emps): ${roundArt.length}`);
    if (roundArt.length) roundArt.slice(0, 10).forEach(r => console.log(`    [${r.ticker}] emps=${r.emps}`));

    // ── 6. FAILURES LIST ─────────────────────────────────────────────────────
    if (failing.length) {
        console.log('\n' + '═'.repeat(72));
        console.log(`FAILURES (${failing.length})`);
        console.log('─'.repeat(72));
        for (const f of failing) {
            const reason = f.error || (f.missing || []).join(', ');
            console.log(`  [${f.ticker.padEnd(7)}] ${(f.name||'').padEnd(38)} ${reason}`);
        }
    }

    // ── Save JSON ─────────────────────────────────────────────────────────────
    const ts  = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const out = OUT_FILE || `analysis_${LIST_NAME}_${ts}.json`;
    fs.writeFileSync(out, JSON.stringify({
        meta: { generatedAt: new Date().toISOString(), list: LIST_NAME, total: results.length,
                passing: passing.length, failing: failing.length, delayMs: DELAY_MS },
        results,
    }, null, 2));

    console.log('\n' + '═'.repeat(72));
    console.log(`✅ Done. Results saved → ${out}`);
    console.log(`   Pass rate: ${passing.length}/${results.length} (${pct(passing.length, results.length)})\n`);
}

main().catch(console.error);
