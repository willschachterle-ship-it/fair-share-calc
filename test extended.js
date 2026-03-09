// ═══════════════════════════════════════════════════════════════════════════════
// Fair Share Calculator — Extended Test Script (v1)
// Supports TOP 1000 / 2000 / 5000 mode
// Outputs both human-readable progress AND a JSON results file for source_analysis.html
//
// HOW TO RUN:
//   node test_extended.js [--limit 1000] [--out results.json] [--delay 300]
//   Default: runs all companies in COMPANIES list at 300ms delay
//
// OUTPUT:
//   - Live progress to stdout (same format as test_top1000_v3.js)
//   - JSON file (default: results_YYYYMMDD_HHMMSS.json) for source_analysis.html
//
// COMPANY LIST:
//   Currently contains the top ~1000. To extend to 2000 or 5000, append more
//   { ticker, name, sector } entries to the COMPANIES array at the bottom.
// ═══════════════════════════════════════════════════════════════════════════════

const https = require('https');
const http  = require('http');
const fs    = require('fs');

const BASE_URL = 'https://fair-share-calc.vercel.app/api/company';

// ─── CLI ARGS ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
function getArg(flag, def) {
    const i = args.indexOf(flag);
    return i !== -1 && args[i+1] ? args[i+1] : def;
}
const LIMIT     = parseInt(getArg('--limit', '99999'), 10);
const OUT_FILE  = getArg('--out', null); // null = auto-named
const DELAY_MS  = parseInt(getArg('--delay', '300'), 10);

// ─── FALLBACK DB ──────────────────────────────────────────────────────────────
let FALLBACK_DB = {};
async function loadFallbackFromVercel() {
    return new Promise((resolve) => {
        https.get('https://fair-share-calc.vercel.app/fallback.js', (r) => {
            let d = '';
            r.on('data', c => d += c);
            r.on('end', () => {
                try {
                    const m = { exports: {} };
                    const fn = new Function('module', 'exports', d);
                    fn(m, m.exports);
                    FALLBACK_DB = m.exports;
                    const count = Object.keys(FALLBACK_DB).length;
                    console.log(`✅ Loaded fallback.js from Vercel (${count} entries)\n`);
                } catch(e) {
                    console.warn('⚠️  Could not parse fallback.js:', e.message);
                }
                resolve();
            });
        }).on('error', () => resolve());
    });
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function fmt(n) {
    if (n === null || n === undefined) return 'NULL';
    const sign = n < 0 ? '-' : '';
    const abs  = Math.abs(n);
    if (abs >= 1e9) return sign + '$' + (abs/1e9).toFixed(2) + 'B';
    if (abs >= 1e6) return sign + '$' + (abs/1e6).toFixed(2) + 'M';
    return sign + '$' + abs.toLocaleString();
}

function apiFetch(url) {
    return new Promise((resolve, reject) => {
        const mod = url.startsWith('https') ? https : http;
        mod.get(url, { timeout: 15000 }, (res) => {
            let data = '';
            res.on('data', d => data += d);
            res.on('end', () => {
                try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
                catch(e) { reject(new Error('JSON error: ' + data.slice(0,80))); }
            });
        }).on('error', reject).on('timeout', () => reject(new Error('timeout')));
    });
}

// Detect likely year artifact (2015–2025 as employee count)
function isYearArtifact(n) {
    return n >= 2015 && n <= 2025;
}

// Detect suspiciously round small numbers often returned by scrapers
function isRoundArtifact(n) {
    return n > 0 && n <= 900 && n % 100 === 0;
}

// Classify where a field's value came from
function classifySource(ticker, fieldVal, fieldName, json, usedFallback) {
    if (fieldVal === null || fieldVal === undefined) return 'missing';
    if (!usedFallback) return 'api_live';

    const fb = FALLBACK_DB[ticker];
    if (!fb) return 'api_live';

    const fbVal = fb[fieldName];
    if (fbVal == null) return 'api_live'; // fallback didn't have this field

    // If the value matches the fallback exactly, it came from fallback
    const matches = (fieldName === 'emps')
        ? (fieldVal === fbVal)
        : (Math.abs(fieldVal - fbVal) < 1000); // allow rounding

    if (!matches) return 'api_live';

    // Classify fallback source
    const src = fb._src?.[fieldName] || fb._src || null;
    if (!src) return 'fallback_db_unknown';
    if (typeof src === 'string') {
        if (src === 'wikipedia' || src === 'wiki') return 'fallback_db_wiki';
        if (src === 'claude' || src === 'training') return 'fallback_db_claude';
        return 'fallback_db_unknown';
    }
    return 'fallback_db_unknown';
}

// ─── PER-COMPANY TEST ────────────────────────────────────────────────────────
async function testOne(ticker, name, sector) {
    try {
        const url = BASE_URL + '?symbol=' + encodeURIComponent(ticker);
        const { status, body: json } = await apiFetch(url);

        if (status === 404 || json?.error) {
            process.stdout.write(`❌ [${ticker.padEnd(7)}] ${name.padEnd(35)} API_ERROR: ${json?.error||'404'}\n`);
            return { ticker, name, sector: sector||'Unknown', ok: false, missing: ['API_ERROR'],
                     emps: null, profit: null, ebitda: null,
                     sources: { emps: 'missing', profit: 'missing', ebitda: 'missing' },
                     flags: { yearArtifact: false, roundArtifact: false, hasOneTimeItem: false, usedFallback: false } };
        }

        // Simulate client-side fallback merge
        const resolvedSym = (json.resolvedSymbol || ticker).toUpperCase();
        const db = FALLBACK_DB[resolvedSym] || FALLBACK_DB[ticker.toUpperCase()];
        let usedFallback = false;

        if (!json.name || json.name === 'undefined') {
            if (db) { Object.assign(json, db); json.resolvedSymbol = ticker; usedFallback = true; }
        } else if (db) {
            if (!json.emps)          { json.emps   = db.emps;   usedFallback = true; }
            if (json.profit == null) { json.profit = db.profit; usedFallback = true; }
            if (json.ebitda == null) { json.ebitda = db.ebitda; usedFallback = true; }
            json.name = json.name || db.name;
            json.logo = json.logo || db.logo;
        }

        const issues = [];
        if (!json.emps)   issues.push('NO_EMPS');
        if (!json.profit) issues.push('NO_PROFIT');
        if (!json.ebitda) issues.push('NO_EBITDA');
        const ok = issues.length === 0;

        const empStr = json.emps   ? json.emps.toLocaleString().padStart(9) : '     NULL';
        const pStr   = json.profit ? fmt(json.profit).padStart(10)          : '      NULL';
        const eStr   = json.ebitda ? fmt(json.ebitda).padStart(10)          : '      NULL';

        process.stdout.write(`${ok ? '✅' : '❌'} [${ticker.padEnd(7)}] ${name.padEnd(35)} emps=${empStr}  profit=${pStr}  ebitda=${eStr}`);
        if (issues.length) process.stdout.write(`  ⚠️  ${issues.join(', ')}`);
        process.stdout.write('\n');
        if (!ok) {
            process.stdout.write(`         name="${json.name}"  resolved="${json.resolvedSymbol}"\n`);
            if (json._errors?.length) for (const e of json._errors) process.stdout.write(`         ERROR: ${e}\n`);
        }

        const yearArtifact  = json.emps ? isYearArtifact(json.emps) : false;
        const roundArtifact = json.emps ? isRoundArtifact(json.emps) : false;

        return {
            ticker,
            name: json.name || name,
            sector: sector || 'Unknown',
            ok,
            missing: issues,
            emps:   json.emps   ?? null,
            profit: json.profit ?? null,
            ebitda: json.ebitda ?? null,
            hasOneTimeItem: json.hasOneTimeItem || false,
            usedFallback,
            sources: {
                emps:   classifySource(resolvedSym, json.emps,   'emps',   json, usedFallback),
                profit: classifySource(resolvedSym, json.profit, 'profit', json, usedFallback),
                ebitda: classifySource(resolvedSym, json.ebitda, 'ebitda', json, usedFallback),
            },
            flags: { yearArtifact, roundArtifact, hasOneTimeItem: json.hasOneTimeItem || false, usedFallback },
            resolvedSymbol: json.resolvedSymbol || ticker,
        };

    } catch(err) {
        process.stdout.write(`💥 [${ticker.padEnd(7)}] ${name.padEnd(35)} FETCH_ERR: ${err.message}\n`);
        return { ticker, name, sector: sector||'Unknown', ok: false, missing: ['FETCH_ERROR'],
                 emps: null, profit: null, ebitda: null,
                 sources: { emps: 'missing', profit: 'missing', ebitda: 'missing' },
                 flags: { yearArtifact: false, roundArtifact: false, hasOneTimeItem: false, usedFallback: false } };
    }
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
async function main() {
    await loadFallbackFromVercel();

    const companies = COMPANIES.slice(0, LIMIT);
    const estMins   = Math.ceil(companies.length * DELAY_MS / 60000);

    console.log(`\n${'═'.repeat(78)}`);
    console.log(`Fair Share Calculator — Extended Test  (${companies.length} companies, ~${estMins} min)`);
    console.log(`Delay: ${DELAY_MS}ms/company | Output: JSON + stdout`);
    console.log(`${'═'.repeat(78)}\n`);

    const results = [];
    let idx = 0;
    for (const { ticker, name, sector } of companies) {
        idx++;
        if (idx % 100 === 0) console.log(`\n  ── Progress: ${idx}/${companies.length} ──\n`);
        const r = await testOne(ticker, name, sector);
        results.push(r);
        await new Promise(r => setTimeout(r, DELAY_MS));
    }

    // ── Summary to stdout ────────────────────────────────────────────────────
    const pass   = results.filter(r => r.ok);
    const fail   = results.filter(r => !r.ok);
    const apiErr = fail.filter(r => r.missing.includes('API_ERROR') || r.missing.includes('FETCH_ERROR'));

    console.log(`\n${'═'.repeat(78)}`);
    console.log(`RESULT: ${pass.length}/${companies.length} PASSING  (${fail.length} failures)\n`);
    console.log(`  ⚠️  EMPS failures     : ${fail.filter(r => r.missing.includes('NO_EMPS')).length}`);
    console.log(`  ⚠️  PROFIT failures   : ${fail.filter(r => r.missing.includes('NO_PROFIT')).length}`);
    console.log(`  ⚠️  EBITDA failures   : ${fail.filter(r => r.missing.includes('NO_EBITDA')).length}`);
    console.log(`  ❌  API errors        : ${apiErr.length}`);

    if (fail.length) {
        console.log(`\n${'─'.repeat(78)}`);
        for (const f of fail) {
            console.log(`  [${f.ticker.padEnd(7)}] ${f.name.padEnd(35)} → ${f.missing.join(', ')}`);
        }
    }

    // ── Write JSON output ────────────────────────────────────────────────────
    const ts  = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const out = OUT_FILE || `results_${ts}.json`;

    const output = {
        meta: {
            generatedAt: new Date().toISOString(),
            totalTested: companies.length,
            passing: pass.length,
            failing: fail.length,
            delayMs: DELAY_MS,
        },
        results,
    };

    fs.writeFileSync(out, JSON.stringify(output, null, 2));
    console.log(`\n✅ JSON results written to: ${out}`);
    console.log(`   Open source_analysis.html and load this file to see charts.\n`);
}

// ─── COMPANY LIST ─────────────────────────────────────────────────────────────
// Each entry: { ticker, name, sector }
// Currently ~1000 companies. To extend, append more entries at the end.
// sector values: Retail, Finance, Banking, Insurance, Energy, Utilities,
//   Telecom, Media, Transportation, Automotive, Food & Beverage, Consumer Goods,
//   Industrials, Chemicals, Mining & Metals, Real Estate, Healthcare,
//   Technology, Defense, Staffing, Hospitality, Pharma, Other
//
// ─────────────────────────────────────────────────────────────────────────────
const COMPANIES = [
  // ── Retail ──────────────────────────────────────────────────────────────
  { ticker: 'WMT',   name: 'Walmart',                          sector: 'Retail' },
  { ticker: 'AMZN',  name: 'Amazon',                           sector: 'Retail' },
  { ticker: 'COST',  name: 'Costco',                           sector: 'Retail' },
  { ticker: 'HD',    name: 'Home Depot',                       sector: 'Retail' },
  { ticker: 'TGT',   name: 'Target',                           sector: 'Retail' },
  { ticker: 'TJX',   name: 'TJX Companies',                    sector: 'Retail' },
  { ticker: 'LOW',   name: "Lowe's",                           sector: 'Retail' },
  { ticker: 'KR',    name: 'Kroger',                           sector: 'Retail' },
  { ticker: 'WBA',   name: 'Walgreens Boots Alliance',         sector: 'Retail' },
  { ticker: 'ACI',   name: 'Albertsons',                       sector: 'Retail' },
  { ticker: 'ROST',  name: 'Ross Stores',                      sector: 'Retail' },
  { ticker: 'DG',    name: 'Dollar General',                   sector: 'Retail' },
  { ticker: 'DLTR',  name: 'Dollar Tree',                      sector: 'Retail' },
  { ticker: 'BBY',   name: 'Best Buy',                         sector: 'Retail' },
  { ticker: 'NKE',   name: 'Nike',                             sector: 'Retail' },
  { ticker: 'EBAY',  name: 'eBay',                             sector: 'Retail' },
  { ticker: 'ETSY',  name: 'Etsy',                             sector: 'Retail' },
  { ticker: 'W',     name: 'Wayfair',                          sector: 'Retail' },
  { ticker: 'TSCO',  name: 'Tractor Supply',                   sector: 'Retail' },
  { ticker: 'AZO',   name: 'AutoZone',                         sector: 'Retail' },
  { ticker: 'ORLY',  name: "O'Reilly Automotive",              sector: 'Retail' },
  { ticker: 'ULTA',  name: 'Ulta Beauty',                      sector: 'Retail' },
  { ticker: 'TPR',   name: 'Tapestry',                         sector: 'Retail' },
  { ticker: 'RL',    name: 'Ralph Lauren',                     sector: 'Retail' },
  { ticker: 'ANF',   name: 'Abercrombie & Fitch',              sector: 'Retail' },
  { ticker: 'LULU',  name: 'Lululemon',                        sector: 'Retail' },
  { ticker: 'WSM',   name: 'Williams-Sonoma',                  sector: 'Retail' },
  { ticker: 'M',     name: "Macy's",                           sector: 'Retail' },
  { ticker: 'KMX',   name: 'CarMax',                           sector: 'Retail' },
  { ticker: 'CVNA',  name: 'Carvana',                          sector: 'Retail' },
  { ticker: 'POOL',  name: 'Pool Corporation',                 sector: 'Retail' },
  { ticker: 'DECK',  name: 'Deckers Outdoor',                  sector: 'Retail' },
  { ticker: 'GPS',   name: 'Gap',                              sector: 'Retail' },
  { ticker: 'PVH',   name: 'PVH Corp',                         sector: 'Retail' },
  { ticker: 'HBI',   name: 'Hanesbrands',                      sector: 'Retail' },
  { ticker: 'VFC',   name: 'VF Corporation',                   sector: 'Retail' },
  { ticker: 'LEVI',  name: 'Levi Strauss',                     sector: 'Retail' },
  { ticker: 'UAA',   name: 'Under Armour',                     sector: 'Retail' },
  { ticker: 'COLM',  name: 'Columbia Sportswear',              sector: 'Retail' },
  { ticker: 'NVR',   name: 'NVR Inc',                          sector: 'Retail' },
  { ticker: 'RH',    name: 'RH (Restoration Hardware)',        sector: 'Retail' },
  { ticker: 'FIVE',  name: 'Five Below',                       sector: 'Retail' },
  { ticker: 'BJ',    name: "BJ's Wholesale Club",              sector: 'Retail' },
  { ticker: 'DRVN',  name: 'Driven Brands',                    sector: 'Retail' },
  { ticker: 'BURL',  name: 'Burlington Stores',                sector: 'Retail' },
  { ticker: 'ODP',   name: 'ODP Corporation (Office Depot)',   sector: 'Retail' },
  { ticker: 'GPC',   name: 'Genuine Parts Company',            sector: 'Retail' },
  { ticker: 'AAP',   name: 'Advance Auto Parts',               sector: 'Retail' },
  { ticker: 'CAKE',  name: 'Cheesecake Factory',               sector: 'Retail' },
  { ticker: 'PRTY',  name: 'Party City',                       sector: 'Retail' },
  // ── Finance / Banking ───────────────────────────────────────────────────
  { ticker: 'BRK.B', name: 'Berkshire Hathaway',               sector: 'Finance' },
  { ticker: 'JPM',   name: 'JPMorgan Chase',                   sector: 'Banking' },
  { ticker: 'BAC',   name: 'Bank of America',                  sector: 'Banking' },
  { ticker: 'WFC',   name: 'Wells Fargo',                      sector: 'Banking' },
  { ticker: 'GS',    name: 'Goldman Sachs',                    sector: 'Banking' },
  { ticker: 'MS',    name: 'Morgan Stanley',                   sector: 'Banking' },
  { ticker: 'C',     name: 'Citigroup',                        sector: 'Banking' },
  { ticker: 'AXP',   name: 'American Express',                 sector: 'Finance' },
  { ticker: 'COF',   name: 'Capital One',                      sector: 'Banking' },
  { ticker: 'USB',   name: 'U.S. Bancorp',                     sector: 'Banking' },
  { ticker: 'PNC',   name: 'PNC Financial Services',           sector: 'Banking' },
  { ticker: 'TFC',   name: 'Truist Financial',                 sector: 'Banking' },
  { ticker: 'SCHW',  name: 'Charles Schwab',                   sector: 'Finance' },
  { ticker: 'BK',    name: 'Bank of New York Mellon',          sector: 'Banking' },
  { ticker: 'STT',   name: 'State Street',                     sector: 'Banking' },
  { ticker: 'BLK',   name: 'BlackRock',                        sector: 'Finance' },
  { ticker: 'BX',    name: 'Blackstone',                       sector: 'Finance' },
  { ticker: 'KKR',   name: 'KKR',                              sector: 'Finance' },
  { ticker: 'APO',   name: 'Apollo Global Management',         sector: 'Finance' },
  { ticker: 'ARES',  name: 'Ares Management',                  sector: 'Finance' },
  { ticker: 'V',     name: 'Visa',                             sector: 'Finance' },
  { ticker: 'MA',    name: 'Mastercard',                       sector: 'Finance' },
  { ticker: 'PYPL',  name: 'PayPal',                           sector: 'Finance' },
  { ticker: 'FISV',  name: 'Fiserv',                           sector: 'Finance' },
  { ticker: 'FIS',   name: 'Fidelity National Information Services', sector: 'Finance' },
  { ticker: 'GPN',   name: 'Global Payments',                  sector: 'Finance' },
  { ticker: 'SPGI',  name: 'S&P Global',                       sector: 'Finance' },
  { ticker: 'MCO',   name: "Moody's",                          sector: 'Finance' },
  { ticker: 'ICE',   name: 'Intercontinental Exchange',        sector: 'Finance' },
  { ticker: 'CME',   name: 'CME Group',                        sector: 'Finance' },
  { ticker: 'NDAQ',  name: 'Nasdaq',                           sector: 'Finance' },
  { ticker: 'CBOE',  name: 'Cboe Global Markets',              sector: 'Finance' },
  { ticker: 'MSCI',  name: 'MSCI Inc',                         sector: 'Finance' },
  { ticker: 'TROW',  name: 'T. Rowe Price',                    sector: 'Finance' },
  { ticker: 'AMP',   name: 'Ameriprise Financial',             sector: 'Finance' },
  { ticker: 'IVZ',   name: 'Invesco',                          sector: 'Finance' },
  { ticker: 'BEN',   name: 'Franklin Resources',               sector: 'Finance' },
  { ticker: 'RJF',   name: 'Raymond James Financial',          sector: 'Finance' },
  { ticker: 'IBKR',  name: 'Interactive Brokers',              sector: 'Finance' },
  { ticker: 'HOOD',  name: 'Robinhood',                        sector: 'Finance' },
  { ticker: 'COIN',  name: 'Coinbase',                         sector: 'Finance' },
  { ticker: 'SYF',   name: 'Synchrony Financial',              sector: 'Finance' },
  { ticker: 'DFS',   name: 'Discover Financial Services',      sector: 'Finance' },
  { ticker: 'HBAN',  name: 'Huntington Bancshares',            sector: 'Banking' },
  { ticker: 'FITB',  name: 'Fifth Third Bancorp',              sector: 'Banking' },
  { ticker: 'MTB',   name: 'M&T Bank',                         sector: 'Banking' },
  { ticker: 'RF',    name: 'Regions Financial',                sector: 'Banking' },
  { ticker: 'KEY',   name: 'KeyCorp',                          sector: 'Banking' },
  { ticker: 'CFG',   name: 'Citizens Financial Group',         sector: 'Banking' },
  { ticker: 'NTRS',  name: 'Northern Trust',                   sector: 'Banking' },
  { ticker: 'CPAY',  name: 'Corpay',                           sector: 'Finance' },
  { ticker: 'FICO',  name: 'Fair Isaac (FICO)',                sector: 'Finance' },
  { ticker: 'BR',    name: 'Broadridge Financial',             sector: 'Finance' },
  { ticker: 'VRSK',  name: 'Verisk Analytics',                 sector: 'Finance' },
  { ticker: 'EFX',   name: 'Equifax',                          sector: 'Finance' },
  { ticker: 'TRU',   name: 'TransUnion',                       sector: 'Finance' },
  { ticker: 'DNB',   name: 'Dun & Bradstreet',                 sector: 'Finance' },
  { ticker: 'AJG',   name: 'Arthur J. Gallagher',              sector: 'Insurance' },
  { ticker: 'WTW',   name: 'Willis Towers Watson',             sector: 'Insurance' },
  { ticker: 'AON',   name: 'Aon',                              sector: 'Insurance' },
  { ticker: 'MMC',   name: 'Marsh McLennan',                   sector: 'Insurance' },
  { ticker: 'SNEX',  name: 'StoneX Group',                     sector: 'Finance' },
  { ticker: 'MET',   name: 'MetLife',                          sector: 'Insurance' },
  { ticker: 'PRU',   name: 'Prudential Financial',             sector: 'Insurance' },
  { ticker: 'AFL',   name: 'Aflac',                            sector: 'Insurance' },
  { ticker: 'ALL',   name: 'Allstate',                         sector: 'Insurance' },
  { ticker: 'PGR',   name: 'Progressive',                      sector: 'Insurance' },
  { ticker: 'TRV',   name: 'Travelers Companies',              sector: 'Insurance' },
  { ticker: 'HIG',   name: 'Hartford Financial Services',      sector: 'Insurance' },
  { ticker: 'CB',    name: 'Chubb',                            sector: 'Insurance' },
  { ticker: 'AIG',   name: 'AIG',                              sector: 'Insurance' },
  { ticker: 'L',     name: 'Loews Corporation',                sector: 'Finance' },
  { ticker: 'ACGL',  name: 'Arch Capital Group',               sector: 'Insurance' },
  { ticker: 'EG',    name: 'Everest Group',                    sector: 'Insurance' },
  { ticker: 'WRB',   name: 'W. R. Berkley',                    sector: 'Insurance' },
  { ticker: 'CINF',  name: 'Cincinnati Financial',             sector: 'Insurance' },
  { ticker: 'AIZ',   name: 'Assurant',                         sector: 'Insurance' },
  { ticker: 'GL',    name: 'Globe Life',                       sector: 'Insurance' },
  { ticker: 'ERIE',  name: 'Erie Indemnity',                   sector: 'Insurance' },
  { ticker: 'PFG',   name: 'Principal Financial Group',        sector: 'Insurance' },
  { ticker: 'BRO',   name: 'Brown & Brown',                    sector: 'Insurance' },
  { ticker: 'RLI',   name: 'RLI Corp',                         sector: 'Insurance' },
  // ── Healthcare ──────────────────────────────────────────────────────────
  { ticker: 'HUM',   name: 'Humana',                           sector: 'Healthcare' },
  { ticker: 'CNC',   name: 'Centene',                          sector: 'Healthcare' },
  { ticker: 'MOH',   name: 'Molina Healthcare',                sector: 'Healthcare' },
  { ticker: 'UHS',   name: 'Universal Health Services',        sector: 'Healthcare' },
  // ── Energy ──────────────────────────────────────────────────────────────
  { ticker: 'XOM',   name: 'ExxonMobil',                       sector: 'Energy' },
  { ticker: 'CVX',   name: 'Chevron',                          sector: 'Energy' },
  { ticker: 'COP',   name: 'ConocoPhillips',                   sector: 'Energy' },
  { ticker: 'PSX',   name: 'Phillips 66',                      sector: 'Energy' },
  { ticker: 'MPC',   name: 'Marathon Petroleum',               sector: 'Energy' },
  { ticker: 'VLO',   name: 'Valero Energy',                    sector: 'Energy' },
  { ticker: 'OXY',   name: 'Occidental Petroleum',             sector: 'Energy' },
  { ticker: 'EOG',   name: 'EOG Resources',                    sector: 'Energy' },
  { ticker: 'SLB',   name: 'SLB',                              sector: 'Energy' },
  { ticker: 'HAL',   name: 'Halliburton',                      sector: 'Energy' },
  { ticker: 'BKR',   name: 'Baker Hughes',                     sector: 'Energy' },
  { ticker: 'DVN',   name: 'Devon Energy',                     sector: 'Energy' },
  { ticker: 'FANG',  name: 'Diamondback Energy',               sector: 'Energy' },
  { ticker: 'HES',   name: 'Hess',                             sector: 'Energy' },
  { ticker: 'APA',   name: 'APA Corporation',                  sector: 'Energy' },
  { ticker: 'ET',    name: 'Energy Transfer',                  sector: 'Energy' },
  { ticker: 'EPD',   name: 'Enterprise Products Partners',     sector: 'Energy' },
  { ticker: 'KMI',   name: 'Kinder Morgan',                    sector: 'Energy' },
  { ticker: 'WMB',   name: 'Williams Companies',               sector: 'Energy' },
  { ticker: 'OKE',   name: 'ONEOK',                            sector: 'Energy' },
  { ticker: 'TRGP',  name: 'Targa Resources',                  sector: 'Energy' },
  { ticker: 'LNG',   name: 'Cheniere Energy',                  sector: 'Energy' },
  { ticker: 'EQT',   name: 'EQT Corporation',                  sector: 'Energy' },
  { ticker: 'CTRA',  name: 'Coterra Energy',                   sector: 'Energy' },
  { ticker: 'EXE',   name: 'Expand Energy',                    sector: 'Energy' },
  { ticker: 'TPL',   name: 'Texas Pacific Land',               sector: 'Energy' },
  { ticker: 'MMP',   name: 'Magellan Midstream Partners',      sector: 'Energy' },
  { ticker: 'PAA',   name: 'Plains All American Pipeline',     sector: 'Energy' },
  { ticker: 'CRC',   name: 'California Resources',             sector: 'Energy' },
  { ticker: 'RRC',   name: 'Range Resources',                  sector: 'Energy' },
  { ticker: 'SWN',   name: 'Southwestern Energy',              sector: 'Energy' },
  { ticker: 'CNX',   name: 'CNX Resources',                    sector: 'Energy' },
  { ticker: 'OVV',   name: 'Ovintiv',                          sector: 'Energy' },
  { ticker: 'PR',    name: 'Permian Resources',                sector: 'Energy' },
  { ticker: 'MTDR',  name: 'Matador Resources',                sector: 'Energy' },
  { ticker: 'DK',    name: 'Delek US Holdings',                sector: 'Energy' },
  { ticker: 'PARR',  name: 'Par Pacific Holdings',             sector: 'Energy' },
  { ticker: 'CIVI',  name: 'Civitas Resources',                sector: 'Energy' },
  { ticker: 'VTLE',  name: 'Vital Energy',                     sector: 'Energy' },
  { ticker: 'MGY',   name: 'Magnolia Oil & Gas',               sector: 'Energy' },
  { ticker: 'CLMT',  name: 'Calumet Specialty Products',       sector: 'Energy' },
  { ticker: 'NGL',   name: 'NGL Energy Partners',              sector: 'Energy' },
  { ticker: 'WTTR',  name: 'Select Water Solutions',           sector: 'Energy' },
  // ── Utilities ───────────────────────────────────────────────────────────
  { ticker: 'NEE',   name: 'NextEra Energy',                   sector: 'Utilities' },
  { ticker: 'DUK',   name: 'Duke Energy',                      sector: 'Utilities' },
  { ticker: 'SO',    name: 'Southern Company',                 sector: 'Utilities' },
  { ticker: 'D',     name: 'Dominion Energy',                  sector: 'Utilities' },
  { ticker: 'EXC',   name: 'Exelon',                           sector: 'Utilities' },
  { ticker: 'AEP',   name: 'American Electric Power',          sector: 'Utilities' },
  { ticker: 'SRE',   name: 'Sempra',                           sector: 'Utilities' },
  { ticker: 'PCG',   name: 'PG&E',                             sector: 'Utilities' },
  { ticker: 'ED',    name: 'Consolidated Edison',              sector: 'Utilities' },
  { ticker: 'XEL',   name: 'Xcel Energy',                      sector: 'Utilities' },
  { ticker: 'ES',    name: 'Eversource Energy',                sector: 'Utilities' },
  { ticker: 'WEC',   name: 'WEC Energy Group',                 sector: 'Utilities' },
  { ticker: 'AWK',   name: 'American Water Works',             sector: 'Utilities' },
  { ticker: 'PPL',   name: 'PPL Corporation',                  sector: 'Utilities' },
  { ticker: 'EIX',   name: 'Edison International',             sector: 'Utilities' },
  { ticker: 'CMS',   name: 'CMS Energy',                       sector: 'Utilities' },
  { ticker: 'NI',    name: 'NiSource',                         sector: 'Utilities' },
  { ticker: 'CNP',   name: 'CenterPoint Energy',               sector: 'Utilities' },
  { ticker: 'AEE',   name: 'Ameren',                           sector: 'Utilities' },
  { ticker: 'ETR',   name: 'Entergy',                          sector: 'Utilities' },
  { ticker: 'DTE',   name: 'DTE Energy',                       sector: 'Utilities' },
  { ticker: 'FE',    name: 'FirstEnergy',                      sector: 'Utilities' },
  { ticker: 'PEG',   name: 'PSEG',                             sector: 'Utilities' },
  { ticker: 'NRG',   name: 'NRG Energy',                       sector: 'Utilities' },
  { ticker: 'VST',   name: 'Vistra',                           sector: 'Utilities' },
  { ticker: 'CEG',   name: 'Constellation Energy',             sector: 'Utilities' },
  { ticker: 'FSLR',  name: 'First Solar',                      sector: 'Utilities' },
  { ticker: 'EVRG',  name: 'Evergy',                           sector: 'Utilities' },
  { ticker: 'LNT',   name: 'Alliant Energy',                   sector: 'Utilities' },
  { ticker: 'PNW',   name: 'Pinnacle West Capital',            sector: 'Utilities' },
  { ticker: 'ATO',   name: 'Atmos Energy',                     sector: 'Utilities' },
  { ticker: 'AES',   name: 'AES Corporation',                  sector: 'Utilities' },
  { ticker: 'OGE',   name: 'OGE Energy',                       sector: 'Utilities' },
  { ticker: 'NWE',   name: 'NorthWestern Energy',              sector: 'Utilities' },
  { ticker: 'OTTR',  name: 'Otter Tail',                       sector: 'Utilities' },
  { ticker: 'CWEN',  name: 'Clearway Energy',                  sector: 'Utilities' },
  // ── Telecom & Media ─────────────────────────────────────────────────────
  { ticker: 'VZ',    name: 'Verizon',                          sector: 'Telecom' },
  { ticker: 'T',     name: 'AT&T',                             sector: 'Telecom' },
  { ticker: 'TMUS',  name: 'T-Mobile',                         sector: 'Telecom' },
  { ticker: 'CMCSA', name: 'Comcast',                          sector: 'Telecom' },
  { ticker: 'CHTR',  name: 'Charter Communications',           sector: 'Telecom' },
  { ticker: 'DIS',   name: 'Walt Disney',                      sector: 'Media' },
  { ticker: 'NFLX',  name: 'Netflix',                          sector: 'Media' },
  { ticker: 'WBD',   name: 'Warner Bros. Discovery',           sector: 'Media' },
  { ticker: 'FOXA',  name: 'Fox Corporation (Class A)',        sector: 'Media' },
  { ticker: 'FOX',   name: 'Fox Corporation (Class B)',        sector: 'Media' },
  { ticker: 'PARA',  name: 'Paramount Global',                 sector: 'Media' },
  { ticker: 'NYT',   name: 'New York Times',                   sector: 'Media' },
  { ticker: 'LYV',   name: 'Live Nation Entertainment',        sector: 'Media' },
  { ticker: 'EA',    name: 'Electronic Arts',                  sector: 'Media' },
  { ticker: 'TTWO',  name: 'Take-Two Interactive',             sector: 'Media' },
  { ticker: 'RBLX',  name: 'Roblox',                           sector: 'Media' },
  { ticker: 'SPOT',  name: 'Spotify',                          sector: 'Media' },
  { ticker: 'SIRI',  name: 'SiriusXM',                         sector: 'Media' },
  { ticker: 'OMC',   name: 'Omnicom Group',                    sector: 'Media' },
  { ticker: 'IPG',   name: 'Interpublic Group',                sector: 'Media' },
  { ticker: 'TTD',   name: 'The Trade Desk',                   sector: 'Media' },
  { ticker: 'TKO',   name: 'TKO Group Holdings (WWE/UFC)',     sector: 'Media' },
  { ticker: 'NWS',   name: 'News Corp',                        sector: 'Media' },
  { ticker: 'NWSA',  name: 'News Corp (Class A)',              sector: 'Media' },
  { ticker: 'GDDY',  name: 'GoDaddy',                          sector: 'Technology' },
  { ticker: 'IAC',   name: 'IAC',                              sector: 'Media' },
  { ticker: 'MTCH',  name: 'Match Group',                      sector: 'Media' },
  { ticker: 'BMBL',  name: 'Bumble',                           sector: 'Media' },
  { ticker: 'ROKU',  name: 'Roku',                             sector: 'Media' },
  { ticker: 'FUBO',  name: 'FuboTV',                           sector: 'Media' },
  { ticker: 'AMCX',  name: 'AMC Networks',                     sector: 'Media' },
  { ticker: 'SSP',   name: 'E.W. Scripps',                     sector: 'Media' },
  { ticker: 'IRDM',  name: 'Iridium Communications',           sector: 'Telecom' },
  // ── Transportation ──────────────────────────────────────────────────────
  { ticker: 'UPS',   name: 'UPS',                              sector: 'Transportation' },
  { ticker: 'FDX',   name: 'FedEx',                            sector: 'Transportation' },
  { ticker: 'DAL',   name: 'Delta Air Lines',                  sector: 'Transportation' },
  { ticker: 'UAL',   name: 'United Airlines',                  sector: 'Transportation' },
  { ticker: 'AAL',   name: 'American Airlines',                sector: 'Transportation' },
  { ticker: 'LUV',   name: 'Southwest Airlines',               sector: 'Transportation' },
  { ticker: 'ALK',   name: 'Alaska Air Group',                 sector: 'Transportation' },
  { ticker: 'JBLU',  name: 'JetBlue',                          sector: 'Transportation' },
  { ticker: 'SAVE',  name: 'Spirit Airlines',                  sector: 'Transportation' },
  { ticker: 'SKYW',  name: 'SkyWest',                          sector: 'Transportation' },
  { ticker: 'UNP',   name: 'Union Pacific',                    sector: 'Transportation' },
  { ticker: 'CSX',   name: 'CSX',                              sector: 'Transportation' },
  { ticker: 'NSC',   name: 'Norfolk Southern',                 sector: 'Transportation' },
  { ticker: 'CP',    name: 'Canadian Pacific Kansas City',     sector: 'Transportation' },
  { ticker: 'CNI',   name: 'Canadian National Railway',        sector: 'Transportation' },
  { ticker: 'WAB',   name: 'Wabtec',                           sector: 'Transportation' },
  { ticker: 'CHRW',  name: 'C.H. Robinson',                    sector: 'Transportation' },
  { ticker: 'EXPD',  name: 'Expeditors International',         sector: 'Transportation' },
  { ticker: 'XPO',   name: 'XPO Logistics',                    sector: 'Transportation' },
  { ticker: 'ODFL',  name: 'Old Dominion Freight Line',        sector: 'Transportation' },
  { ticker: 'JBHT',  name: 'J.B. Hunt Transport',              sector: 'Transportation' },
  { ticker: 'SAIA',  name: 'Saia',                             sector: 'Transportation' },
  { ticker: 'R',     name: 'Ryder System',                     sector: 'Transportation' },
  { ticker: 'LYFT',  name: 'Lyft',                             sector: 'Transportation' },
  { ticker: 'DASH',  name: 'DoorDash',                         sector: 'Transportation' },
  { ticker: 'GXO',   name: 'GXO Logistics',                    sector: 'Transportation' },
  { ticker: 'RXO',   name: 'RXO',                              sector: 'Transportation' },
  { ticker: 'MATX',  name: 'Matson',                           sector: 'Transportation' },
  { ticker: 'KEX',   name: 'Kirby Corporation',                sector: 'Transportation' },
  { ticker: 'ARCB',  name: 'ArcBest',                          sector: 'Transportation' },
  { ticker: 'WERN',  name: 'Werner Enterprises',               sector: 'Transportation' },
  { ticker: 'KNX',   name: 'Knight-Swift Transportation',      sector: 'Transportation' },
  { ticker: 'HTLD',  name: 'Heartland Express',                sector: 'Transportation' },
  { ticker: 'MRTN',  name: 'Marten Transport',                 sector: 'Transportation' },
  { ticker: 'CAR',   name: 'Avis Budget Group',                sector: 'Transportation' },
  { ticker: 'HTZ',   name: 'Hertz Global Holdings',            sector: 'Transportation' },
  { ticker: 'YRCW',  name: 'Yellow Corporation',               sector: 'Transportation' },
  { ticker: 'USAK',  name: 'USA Truck',                        sector: 'Transportation' },
  { ticker: 'PTSI',  name: 'P.A.M. Transport Services',        sector: 'Transportation' },
  { ticker: 'HUBG',  name: 'Hub Group',                        sector: 'Transportation' },
  { ticker: 'LSTR',  name: 'Landstar System',                  sector: 'Transportation' },
  { ticker: 'ECHO',  name: 'Echo Global Logistics',            sector: 'Transportation' },
  { ticker: 'TRTN',  name: 'Triton International',             sector: 'Transportation' },
  { ticker: 'FWRD',  name: 'Forward Air',                      sector: 'Transportation' },
  // ── Automotive ──────────────────────────────────────────────────────────
  { ticker: 'GM',    name: 'General Motors',                   sector: 'Automotive' },
  { ticker: 'F',     name: 'Ford Motor',                       sector: 'Automotive' },
  { ticker: 'TSLA',  name: 'Tesla',                            sector: 'Automotive' },
  { ticker: 'STLA',  name: 'Stellantis',                       sector: 'Automotive' },
  { ticker: 'HMC',   name: 'Honda Motor',                      sector: 'Automotive' },
  { ticker: 'TM',    name: 'Toyota Motor',                     sector: 'Automotive' },
  { ticker: 'VWAGY', name: 'Volkswagen',                       sector: 'Automotive' },
  { ticker: 'BMWYY', name: 'BMW',                              sector: 'Automotive' },
  { ticker: 'MBGYY', name: 'Mercedes-Benz',                    sector: 'Automotive' },
  { ticker: 'AN',    name: 'AutoNation',                       sector: 'Automotive' },
  { ticker: 'PAG',   name: 'Penske Automotive',                sector: 'Automotive' },
  { ticker: 'LAD',   name: 'Lithia Motors',                    sector: 'Automotive' },
  { ticker: 'ABG',   name: 'Asbury Automotive',                sector: 'Automotive' },
  { ticker: 'GPI',   name: 'Group 1 Automotive',               sector: 'Automotive' },
  { ticker: 'SAH',   name: 'Sonic Automotive',                 sector: 'Automotive' },
  { ticker: 'APTV',  name: 'Aptiv',                            sector: 'Automotive' },
  { ticker: 'LEA',   name: 'Lear Corporation',                 sector: 'Automotive' },
  { ticker: 'BWA',   name: 'BorgWarner',                       sector: 'Automotive' },
  { ticker: 'DAN',   name: 'Dana Incorporated',                sector: 'Automotive' },
  { ticker: 'LCID',  name: 'Lucid Group',                      sector: 'Automotive' },
  { ticker: 'RIVN',  name: 'Rivian',                           sector: 'Automotive' },
  { ticker: 'PCAR',  name: 'PACCAR',                           sector: 'Automotive' },
  { ticker: 'CMI',   name: 'Cummins',                          sector: 'Automotive' },
  { ticker: 'ALSN',  name: 'Allison Transmission',             sector: 'Automotive' },
  { ticker: 'WGO',   name: 'Winnebago Industries',             sector: 'Automotive' },
  { ticker: 'THO',   name: 'Thor Industries',                  sector: 'Automotive' },
  // ── Food & Beverage / Restaurants ───────────────────────────────────────
  { ticker: 'KO',    name: 'Coca-Cola',                        sector: 'Food & Beverage' },
  { ticker: 'PEP',   name: 'PepsiCo',                          sector: 'Food & Beverage' },
  { ticker: 'MCD',   name: "McDonald's",                       sector: 'Food & Beverage' },
  { ticker: 'SBUX',  name: 'Starbucks',                        sector: 'Food & Beverage' },
  { ticker: 'YUM',   name: 'Yum! Brands',                      sector: 'Food & Beverage' },
  { ticker: 'QSR',   name: 'Restaurant Brands International',  sector: 'Food & Beverage' },
  { ticker: 'CMG',   name: 'Chipotle Mexican Grill',           sector: 'Food & Beverage' },
  { ticker: 'DPZ',   name: "Domino's Pizza",                   sector: 'Food & Beverage' },
  { ticker: 'SBUX',  name: 'Starbucks',                        sector: 'Food & Beverage' },
  { ticker: 'WEN',   name: "Wendy's",                          sector: 'Food & Beverage' },
  { ticker: 'JACK',  name: "Jack in the Box",                  sector: 'Food & Beverage' },
  { ticker: 'TXRH',  name: 'Texas Roadhouse',                  sector: 'Food & Beverage' },
  { ticker: 'DRI',   name: 'Darden Restaurants',               sector: 'Food & Beverage' },
  { ticker: 'EAT',   name: "Brinker International (Chili's)",  sector: 'Food & Beverage' },
  { ticker: 'DENN',  name: "Denny's",                          sector: 'Food & Beverage' },
  { ticker: 'DINE',  name: 'Dine Brands Global',               sector: 'Food & Beverage' },
  { ticker: 'BLMN',  name: "Bloomin' Brands",                  sector: 'Food & Beverage' },
  { ticker: 'LKNCY', name: 'Luckin Coffee',                    sector: 'Food & Beverage' },
  { ticker: 'TSN',   name: 'Tyson Foods',                      sector: 'Food & Beverage' },
  { ticker: 'CAG',   name: 'Conagra Brands',                   sector: 'Food & Beverage' },
  { ticker: 'CPB',   name: "Campbell's",                       sector: 'Food & Beverage' },
  { ticker: 'GIS',   name: 'General Mills',                    sector: 'Food & Beverage' },
  { ticker: 'HRL',   name: 'Hormel Foods',                     sector: 'Food & Beverage' },
  { ticker: 'K',     name: "Kellogg's (Kellanova)",            sector: 'Food & Beverage' },
  { ticker: 'MKC',   name: 'McCormick',                        sector: 'Food & Beverage' },
  { ticker: 'SJM',   name: 'J.M. Smucker',                     sector: 'Food & Beverage' },
  { ticker: 'POST',  name: 'Post Holdings',                    sector: 'Food & Beverage' },
  { ticker: 'MDLZ',  name: 'Mondelez International',           sector: 'Food & Beverage' },
  { ticker: 'HSY',   name: 'Hershey',                          sector: 'Food & Beverage' },
  { ticker: 'TR',    name: 'Tootsie Roll',                     sector: 'Food & Beverage' },
  { ticker: 'SAFM',  name: 'Sanderson Farms',                  sector: 'Food & Beverage' },
  // ── Consumer Goods ──────────────────────────────────────────────────────
  { ticker: 'PG',    name: 'Procter & Gamble',                 sector: 'Consumer Goods' },
  { ticker: 'KMB',   name: 'Kimberly-Clark',                   sector: 'Consumer Goods' },
  { ticker: 'CL',    name: 'Colgate-Palmolive',                sector: 'Consumer Goods' },
  { ticker: 'CHD',   name: 'Church & Dwight',                  sector: 'Consumer Goods' },
  { ticker: 'CLX',   name: 'Clorox',                           sector: 'Consumer Goods' },
  { ticker: 'EL',    name: 'Estee Lauder',                     sector: 'Consumer Goods' },
  { ticker: 'REYN',  name: 'Reynolds Consumer Products',       sector: 'Consumer Goods' },
  { ticker: 'CPRI',  name: 'Capri Holdings',                   sector: 'Consumer Goods' },
  { ticker: 'HAS',   name: 'Hasbro',                           sector: 'Consumer Goods' },
  { ticker: 'MAT',   name: 'Mattel',                           sector: 'Consumer Goods' },
  { ticker: 'HELE',  name: 'Helen of Troy',                    sector: 'Consumer Goods' },
  { ticker: 'SPB',   name: 'Spectrum Brands',                  sector: 'Consumer Goods' },
  { ticker: 'REV',   name: 'Revlon',                           sector: 'Consumer Goods' },
  // ── Technology ──────────────────────────────────────────────────────────
  { ticker: 'AAPL',  name: 'Apple',                            sector: 'Technology' },
  { ticker: 'MSFT',  name: 'Microsoft',                        sector: 'Technology' },
  { ticker: 'GOOGL', name: 'Alphabet',                         sector: 'Technology' },
  { ticker: 'META',  name: 'Meta',                             sector: 'Technology' },
  { ticker: 'NVDA',  name: 'NVIDIA',                           sector: 'Technology' },
  { ticker: 'INTC',  name: 'Intel',                            sector: 'Technology' },
  { ticker: 'CSCO',  name: 'Cisco',                            sector: 'Technology' },
  { ticker: 'IBM',   name: 'IBM',                              sector: 'Technology' },
  { ticker: 'ORCL',  name: 'Oracle',                           sector: 'Technology' },
  { ticker: 'CRM',   name: 'Salesforce',                       sector: 'Technology' },
  { ticker: 'ADBE',  name: 'Adobe',                            sector: 'Technology' },
  { ticker: 'NOW',   name: 'ServiceNow',                       sector: 'Technology' },
  { ticker: 'PLTR',  name: 'Palantir',                         sector: 'Technology' },
  { ticker: 'SNOW',  name: 'Snowflake',                        sector: 'Technology' },
  { ticker: 'DDOG',  name: 'Datadog',                          sector: 'Technology' },
  { ticker: 'WDAY',  name: 'Workday',                          sector: 'Technology' },
  { ticker: 'PANW',  name: 'Palo Alto Networks',               sector: 'Technology' },
  { ticker: 'CRWD',  name: 'CrowdStrike',                      sector: 'Technology' },
  { ticker: 'NET',   name: 'Cloudflare',                       sector: 'Technology' },
  { ticker: 'SHOP',  name: 'Shopify',                          sector: 'Technology' },
  { ticker: 'UBER',  name: 'Uber',                             sector: 'Technology' },
  { ticker: 'ABNB',  name: 'Airbnb',                           sector: 'Technology' },
  { ticker: 'DUOL',  name: 'Duolingo',                         sector: 'Technology' },
  { ticker: 'RBLX',  name: 'Roblox',                           sector: 'Technology' },
  // ── Defense ─────────────────────────────────────────────────────────────
  { ticker: 'LMT',   name: 'Lockheed Martin',                  sector: 'Defense' },
  { ticker: 'RTX',   name: 'Raytheon',                         sector: 'Defense' },
  { ticker: 'NOC',   name: 'Northrop Grumman',                 sector: 'Defense' },
  { ticker: 'GD',    name: 'General Dynamics',                 sector: 'Defense' },
  { ticker: 'BA',    name: 'Boeing',                           sector: 'Defense' },
  { ticker: 'LHX',   name: 'L3Harris',                         sector: 'Defense' },
  { ticker: 'HII',   name: 'Huntington Ingalls',               sector: 'Defense' },
  { ticker: 'LDOS',  name: 'Leidos',                           sector: 'Defense' },
  { ticker: 'BAH',   name: 'Booz Allen Hamilton',              sector: 'Defense' },
  { ticker: 'SAIC',  name: 'SAIC',                             sector: 'Defense' },
  // ── Industrials ─────────────────────────────────────────────────────────
  { ticker: 'GE',    name: 'GE Aerospace',                     sector: 'Industrials' },
  { ticker: 'HON',   name: 'Honeywell',                        sector: 'Industrials' },
  { ticker: 'MMM',   name: '3M',                               sector: 'Industrials' },
  { ticker: 'CAT',   name: 'Caterpillar',                      sector: 'Industrials' },
  { ticker: 'DE',    name: 'Deere & Company',                  sector: 'Industrials' },
  { ticker: 'EMR',   name: 'Emerson Electric',                 sector: 'Industrials' },
  { ticker: 'ETN',   name: 'Eaton',                            sector: 'Industrials' },
  { ticker: 'PH',    name: 'Parker Hannifin',                  sector: 'Industrials' },
  { ticker: 'ITW',   name: 'Illinois Tool Works',              sector: 'Industrials' },
  { ticker: 'ROP',   name: 'Roper Technologies',               sector: 'Industrials' },
  { ticker: 'AMETEK', name: 'AMETEK',                          sector: 'Industrials' },
  { ticker: 'TT',    name: 'Trane Technologies',               sector: 'Industrials' },
  { ticker: 'CARR',  name: 'Carrier Global',                   sector: 'Industrials' },
  { ticker: 'OTIS',  name: 'Otis Worldwide',                   sector: 'Industrials' },
  { ticker: 'IR',    name: 'Ingersoll Rand',                   sector: 'Industrials' },
  { ticker: 'DOV',   name: 'Dover Corporation',                sector: 'Industrials' },
  { ticker: 'XYL',   name: 'Xylem',                            sector: 'Industrials' },
  { ticker: 'IEX',   name: 'IDEX Corporation',                 sector: 'Industrials' },
  { ticker: 'RRC',   name: 'Range Resources',                  sector: 'Energy' },
  { ticker: 'FAST',  name: 'Fastenal',                         sector: 'Industrials' },
  { ticker: 'GWW',   name: 'W.W. Grainger',                    sector: 'Industrials' },
  { ticker: 'MSC',   name: 'MSC Industrial Direct',            sector: 'Industrials' },
  { ticker: 'ESAB',  name: 'ESAB Corporation',                 sector: 'Industrials' },
  { ticker: 'GTES',  name: 'Gates Industrial',                 sector: 'Industrials' },
  { ticker: 'SPXC',  name: 'SPX Technologies',                 sector: 'Industrials' },
  { ticker: 'HI',    name: 'Hillenbrand',                      sector: 'Industrials' },
  { ticker: 'GFF',   name: 'Griffon Corporation',              sector: 'Industrials' },
  { ticker: 'KAI',   name: 'Kadant Inc',                       sector: 'Industrials' },
  // ── Real Estate / REITs ─────────────────────────────────────────────────
  { ticker: 'AMT',   name: 'American Tower',                   sector: 'Real Estate' },
  { ticker: 'PLD',   name: 'Prologis',                         sector: 'Real Estate' },
  { ticker: 'EQIX',  name: 'Equinix',                          sector: 'Real Estate' },
  { ticker: 'CCI',   name: 'Crown Castle',                     sector: 'Real Estate' },
  { ticker: 'SPG',   name: 'Simon Property Group',             sector: 'Real Estate' },
  { ticker: 'O',     name: 'Realty Income',                    sector: 'Real Estate' },
  { ticker: 'VICI',  name: 'VICI Properties',                  sector: 'Real Estate' },
  { ticker: 'WELL',  name: 'Welltower',                        sector: 'Real Estate' },
  { ticker: 'PSA',   name: 'Public Storage',                   sector: 'Real Estate' },
  { ticker: 'EXR',   name: 'Extra Space Storage',              sector: 'Real Estate' },
  { ticker: 'AVB',   name: 'AvalonBay Communities',            sector: 'Real Estate' },
  { ticker: 'EQR',   name: 'Equity Residential',               sector: 'Real Estate' },
  { ticker: 'MAA',   name: 'Mid-America Apartment',            sector: 'Real Estate' },
  { ticker: 'CPT',   name: 'Camden Property Trust',            sector: 'Real Estate' },
  { ticker: 'NNN',   name: 'NNN REIT',                         sector: 'Real Estate' },
  { ticker: 'WPC',   name: 'W. P. Carey',                      sector: 'Real Estate' },
  { ticker: 'MPW',   name: 'Medical Properties Trust',         sector: 'Real Estate' },
  { ticker: 'BXP',   name: 'BXP (Boston Properties)',          sector: 'Real Estate' },
  { ticker: 'ARE',   name: 'Alexandria Real Estate',           sector: 'Real Estate' },
  { ticker: 'VNO',   name: 'Vornado Realty Trust',             sector: 'Real Estate' },
  { ticker: 'INVH',  name: 'Invitation Homes',                 sector: 'Real Estate' },
  { ticker: 'AMH',   name: 'American Homes 4 Rent',            sector: 'Real Estate' },
  { ticker: 'COLD',  name: 'Americold Realty Trust',           sector: 'Real Estate' },
  { ticker: 'NSA',   name: 'National Storage Affiliates',      sector: 'Real Estate' },
  { ticker: 'CUBE',  name: 'CubeSmart',                        sector: 'Real Estate' },
  { ticker: 'TRNO',  name: 'Terreno Realty',                   sector: 'Real Estate' },
  { ticker: 'REXR',  name: 'Rexford Industrial Realty',        sector: 'Real Estate' },
  { ticker: 'EGP',   name: 'EastGroup Properties',             sector: 'Real Estate' },
  { ticker: 'FR',    name: 'First Industrial Realty Trust',    sector: 'Real Estate' },
  { ticker: 'STAG',  name: 'STAG Industrial',                  sector: 'Real Estate' },
  { ticker: 'LXP',   name: 'LXP Industrial Trust',             sector: 'Real Estate' },
  { ticker: 'FRT',   name: 'Federal Realty',                   sector: 'Real Estate' },
  { ticker: 'SKT',   name: 'Tanger Factory Outlet Centers',    sector: 'Real Estate' },
  { ticker: 'ROIC',  name: 'Retail Opportunity Investments',   sector: 'Real Estate' },
  // ── Pharma / Biotech ────────────────────────────────────────────────────
  { ticker: 'LLY',   name: 'Eli Lilly',                        sector: 'Pharma' },
  { ticker: 'JNJ',   name: 'Johnson & Johnson',                sector: 'Pharma' },
  { ticker: 'ABBV',  name: 'AbbVie',                           sector: 'Pharma' },
  { ticker: 'MRK',   name: 'Merck',                            sector: 'Pharma' },
  { ticker: 'PFE',   name: 'Pfizer',                           sector: 'Pharma' },
  { ticker: 'AMGN',  name: 'Amgen',                            sector: 'Pharma' },
  { ticker: 'GILD',  name: 'Gilead Sciences',                  sector: 'Pharma' },
  { ticker: 'BMY',   name: 'Bristol-Myers Squibb',             sector: 'Pharma' },
  { ticker: 'BIIB',  name: 'Biogen',                           sector: 'Pharma' },
  { ticker: 'VRTX',  name: 'Vertex Pharmaceuticals',           sector: 'Pharma' },
  { ticker: 'REGN',  name: 'Regeneron',                        sector: 'Pharma' },
  { ticker: 'EXEL',  name: 'Exelixis',                         sector: 'Pharma' },
  { ticker: 'HALO',  name: 'Halozyme Therapeutics',            sector: 'Pharma' },
  { ticker: 'JAZZ',  name: 'Jazz Pharmaceuticals',             sector: 'Pharma' },
  { ticker: 'PRGO',  name: 'Perrigo Company',                  sector: 'Pharma' },
  { ticker: 'XRAY',  name: 'Dentsply Sirona',                  sector: 'Pharma' },
  { ticker: 'ITCI',  name: 'Intra-Cellular Therapies',         sector: 'Pharma' },
  { ticker: 'NKTR',  name: 'Nektar Therapeutics',              sector: 'Pharma' },
  { ticker: 'IONS',  name: 'Ionis Pharmaceuticals',            sector: 'Pharma' },
  // ── Chemicals / Materials ────────────────────────────────────────────────
  { ticker: 'LIN',   name: 'Linde',                            sector: 'Chemicals' },
  { ticker: 'APD',   name: 'Air Products',                     sector: 'Chemicals' },
  { ticker: 'DD',    name: 'DuPont',                           sector: 'Chemicals' },
  { ticker: 'DOW',   name: 'Dow Inc',                          sector: 'Chemicals' },
  { ticker: 'LYB',   name: 'LyondellBasell',                   sector: 'Chemicals' },
  { ticker: 'PPG',   name: 'PPG Industries',                   sector: 'Chemicals' },
  { ticker: 'SHW',   name: 'Sherwin-Williams',                 sector: 'Chemicals' },
  { ticker: 'ECL',   name: 'Ecolab',                           sector: 'Chemicals' },
  { ticker: 'IFF',   name: 'International Flavors & Fragrances', sector: 'Chemicals' },
  { ticker: 'RPM',   name: 'RPM International',                sector: 'Chemicals' },
  { ticker: 'EMN',   name: 'Eastman Chemical',                 sector: 'Chemicals' },
  { ticker: 'OLN',   name: 'Olin Corporation',                 sector: 'Chemicals' },
  { ticker: 'HUN',   name: 'Huntsman Corporation',             sector: 'Chemicals' },
  { ticker: 'TROX',  name: 'Tronox Holdings',                  sector: 'Chemicals' },
  { ticker: 'ECVT',  name: 'Ecovyst',                          sector: 'Chemicals' },
  // ── Mining & Metals ─────────────────────────────────────────────────────
  { ticker: 'FCX',   name: 'Freeport-McMoRan',                 sector: 'Mining & Metals' },
  { ticker: 'NEM',   name: 'Newmont',                          sector: 'Mining & Metals' },
  { ticker: 'GOLD',  name: 'Barrick Gold',                     sector: 'Mining & Metals' },
  { ticker: 'AA',    name: 'Alcoa',                            sector: 'Mining & Metals' },
  { ticker: 'X',     name: 'U.S. Steel',                       sector: 'Mining & Metals' },
  { ticker: 'NUE',   name: 'Nucor',                            sector: 'Mining & Metals' },
  { ticker: 'STLD',  name: 'Steel Dynamics',                   sector: 'Mining & Metals' },
  { ticker: 'CMC',   name: 'Commercial Metals',                sector: 'Mining & Metals' },
  { ticker: 'RS',    name: 'Reliance',                         sector: 'Mining & Metals' },
  { ticker: 'ATI',   name: 'ATI Inc',                          sector: 'Mining & Metals' },
  { ticker: 'MP',    name: 'MP Materials',                     sector: 'Mining & Metals' },
  // ── Staffing / HR / Services ─────────────────────────────────────────────
  { ticker: 'MAN',   name: 'ManpowerGroup',                    sector: 'Staffing' },
  { ticker: 'ADP',   name: 'ADP',                              sector: 'Staffing' },
  { ticker: 'PAYX',  name: 'Paychex',                          sector: 'Staffing' },
  { ticker: 'NSP',   name: 'Insperity',                        sector: 'Staffing' },
  { ticker: 'TBI',   name: 'TrueBlue',                         sector: 'Staffing' },
  { ticker: 'KFRC',  name: 'Kforce',                           sector: 'Staffing' },
  { ticker: 'HCI',   name: 'HireQuest',                        sector: 'Staffing' },
  // ── Hospitality / Travel / Gaming ────────────────────────────────────────
  { ticker: 'MAR',   name: 'Marriott International',           sector: 'Hospitality' },
  { ticker: 'HLT',   name: 'Hilton Worldwide',                 sector: 'Hospitality' },
  { ticker: 'H',     name: 'Hyatt Hotels',                     sector: 'Hospitality' },
  { ticker: 'IHG',   name: 'IHG Hotels & Resorts',             sector: 'Hospitality' },
  { ticker: 'WH',    name: 'Wyndham Hotels',                   sector: 'Hospitality' },
  { ticker: 'CHH',   name: 'Choice Hotels',                    sector: 'Hospitality' },
  { ticker: 'MGM',   name: 'MGM Resorts',                      sector: 'Hospitality' },
  { ticker: 'LVS',   name: 'Las Vegas Sands',                  sector: 'Hospitality' },
  { ticker: 'WYNN',  name: 'Wynn Resorts',                     sector: 'Hospitality' },
  { ticker: 'CZR',   name: "Caesars Entertainment",            sector: 'Hospitality' },
  { ticker: 'PENN',  name: 'Penn Entertainment',               sector: 'Hospitality' },
  { ticker: 'DKNG',  name: 'DraftKings',                       sector: 'Hospitality' },
  { ticker: 'SIX',   name: 'Six Flags Entertainment',          sector: 'Hospitality' },
  { ticker: 'FUN',   name: 'Cedar Fair',                       sector: 'Hospitality' },
  // ── Semiconductors ──────────────────────────────────────────────────────
  { ticker: 'AMD',   name: 'AMD',                              sector: 'Technology' },
  { ticker: 'AVGO',  name: 'Broadcom',                         sector: 'Technology' },
  { ticker: 'QCOM',  name: 'Qualcomm',                         sector: 'Technology' },
  { ticker: 'TXN',   name: 'Texas Instruments',                sector: 'Technology' },
  { ticker: 'MU',    name: 'Micron Technology',                sector: 'Technology' },
  { ticker: 'AMAT',  name: 'Applied Materials',                sector: 'Technology' },
  { ticker: 'LRCX',  name: 'Lam Research',                     sector: 'Technology' },
  { ticker: 'KLAC',  name: 'KLA Corporation',                  sector: 'Technology' },
  { ticker: 'MRVL',  name: 'Marvell Technology',               sector: 'Technology' },
  { ticker: 'ON',    name: 'ON Semiconductor',                 sector: 'Technology' },
  { ticker: 'WOLF',  name: 'Wolfspeed',                        sector: 'Technology' },
  { ticker: 'MCHP',  name: 'Microchip Technology',             sector: 'Technology' },
  { ticker: 'SWKS',  name: 'Skyworks Solutions',               sector: 'Technology' },
  { ticker: 'QRVO',  name: 'Qorvo',                            sector: 'Technology' },
  { ticker: 'MPWR',  name: 'Monolithic Power Systems',         sector: 'Technology' },
  { ticker: 'LSCC',  name: 'Lattice Semiconductor',            sector: 'Technology' },
  { ticker: 'SITM',  name: 'SiTime Corporation',               sector: 'Technology' },
  // ── International ADRs ──────────────────────────────────────────────────
  { ticker: 'TSM',   name: 'TSMC',                             sector: 'Technology' },
  { ticker: 'ASML',  name: 'ASML',                             sector: 'Technology' },
  { ticker: 'SAP',   name: 'SAP',                              sector: 'Technology' },
  { ticker: 'BABA',  name: 'Alibaba',                          sector: 'Technology' },
  { ticker: 'SSNLF', name: 'Samsung',                          sector: 'Technology' },
  { ticker: 'SHEL',  name: 'Shell',                            sector: 'Energy' },
  { ticker: 'BP',    name: 'BP',                               sector: 'Energy' },
  { ticker: 'RIO',   name: 'Rio Tinto',                        sector: 'Mining & Metals' },
  { ticker: 'BHP',   name: 'BHP Group',                        sector: 'Mining & Metals' },
  { ticker: 'VALE',  name: 'Vale S.A.',                        sector: 'Mining & Metals' },
  { ticker: 'MT',    name: 'ArcelorMittal',                    sector: 'Mining & Metals' },
  { ticker: 'SIEGY', name: 'Siemens AG',                       sector: 'Industrials' },
  { ticker: 'ABBNY', name: 'ABB Ltd',                          sector: 'Industrials' },
  { ticker: 'BAESY', name: 'BAE Systems',                      sector: 'Defense' },
  { ticker: 'EADSY', name: 'Airbus',                           sector: 'Defense' },
  { ticker: 'FINMY', name: 'Leonardo S.p.A.',                  sector: 'Defense' },
  { ticker: 'RYCEY', name: 'Rolls-Royce',                      sector: 'Defense' },
  { ticker: 'THLEF', name: 'Thales Group',                     sector: 'Defense' },
];

// Deduplicate
const seen = new Set();
const COMPANIES_DEDUPED = COMPANIES.filter(c => {
    if (seen.has(c.ticker)) return false;
    seen.add(c.ticker);
    return true;
});

// Override COMPANIES with deduped version
COMPANIES.length = 0;
COMPANIES.push(...COMPANIES_DEDUPED);

main().catch(console.error);
