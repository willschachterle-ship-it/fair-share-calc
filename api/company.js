const FINNHUB_KEY = 'd6j3rvhr01ql467i5e0gd6j3rvhr01ql467i5e10';
const FMP_KEY = '3gPWbjHBHWaeswUkIvjGjN6Ei3SxifLL';
const AV_KEY = '17JNK5S9J44QAXTV';

// Fetch USD exchange rate for a given currency code
// Uses frankfurter.app - free, no key required
const FX_CACHE = {};
async function toUSD(amount, currency) {
    if (!amount || !currency || currency === 'USD') return amount;
    const cur = currency.toUpperCase();
    if (!FX_CACHE[cur]) {
        try {
            const r = await fetch(`https://api.frankfurter.app/latest?from=${cur}&to=USD`);
            if (r.ok) {
                const j = await r.json();
                FX_CACHE[cur] = j.rates?.USD || null;
            }
        } catch(e) { FX_CACHE[cur] = null; }
    }
    const rate = FX_CACHE[cur];
    return rate ? Math.round(amount * rate) : amount;
}

async function fetchFromEDGAR(symbol) {
    const tickerRes = await fetch('https://www.sec.gov/files/company_tickers.json', {
        headers: { 'User-Agent': 'YourFairShare admin@yourfairshare.com' }
    });
    if (!tickerRes.ok) throw new Error('EDGAR tickers HTTP ' + tickerRes.status);
    const tickers = await tickerRes.json();

    let cik = null, companyName = null;
    for (const entry of Object.values(tickers)) {
        if (entry.ticker && entry.ticker.toUpperCase() === symbol.toUpperCase()) {
            cik = String(entry.cik_str).padStart(10, '0');
            companyName = entry.title;
            break;
        }
    }
    if (!cik) throw new Error('EDGAR: ticker not found');

    const factsRes = await fetch(`https://data.sec.gov/api/xbrl/companyfacts/CIK${cik}.json`, {
        headers: { 'User-Agent': 'YourFairShare admin@yourfairshare.com' }
    });
    if (!factsRes.ok) throw new Error('EDGAR facts HTTP ' + factsRes.status);
    const facts = await factsRes.json();

    const us_gaap = facts.facts['us-gaap'] || {};
    const dei = facts.facts['dei'] || {};

    // Employee count - many companies don't file this
    let emps = null;
    for (const field of ['EntityNumberOfEmployees', 'NumberOfEmployees']) {
        const empFact = dei[field];
        if (empFact && empFact.units && empFact.units['pure']) {
            const sorted = empFact.units['pure']
                .filter(e => e.form === '10-K' || e.form === '10-K/A')
                .sort((a, b) => b.end.localeCompare(a.end));
            if (sorted.length > 0) { emps = sorted[0].val; break; }
        }
    }

    // Net income - exclude future periods, prefer entries where filed date
    // is within 6 months of end date (avoids picking up restatements filed years later)
    const today = new Date().toISOString().split('T')[0];
    // Use last completed fiscal year - filed within 12 months of period end
    let profit = null;
    for (const field of ['NetIncomeLoss', 'NetIncome', 'ProfitLoss']) {
        const fact = us_gaap[field];
        if (fact && fact.units && fact.units['USD']) {
            const entries = fact.units['USD']
                .filter(e => (e.form === '10-K' || e.form === '10-K/A') && e.start && e.end <= today)
                .filter(e => {
                    // Only use entries filed within 12 months of the period end
                    const endYear = parseInt(e.end.substring(0, 4));
                    const filedYear = parseInt(e.filed.substring(0, 4));
                    return filedYear <= endYear + 1;
                })
                .sort((a, b) => b.end.localeCompare(a.end));
            if (entries.length > 0) { profit = entries[0].val; break; }
        }
    }

    // EBITDA = operating income + D&A
    let ebitda = null;
    const opFact = us_gaap['OperatingIncomeLoss'];
    if (opFact && opFact.units && opFact.units['USD']) {
        const sorted = opFact.units['USD']
            .filter(e => (e.form === '10-K' || e.form === '10-K/A') && e.start && e.end <= today)
            .sort((a, b) => b.end.localeCompare(a.end));
        if (sorted.length > 0) {
            let dna = 0;
            for (const f of ['DepreciationDepletionAndAmortization', 'DepreciationAndAmortization', 'Depreciation']) {
                const dnaFact = us_gaap[f];
                if (dnaFact && dnaFact.units && dnaFact.units['USD']) {
                    const dnaSorted = dnaFact.units['USD']
                        .filter(e => (e.form === '10-K' || e.form === '10-K/A') && e.start)
                        .sort((a, b) => b.end.localeCompare(a.end));
                    if (dnaSorted.length > 0) { dna = dnaSorted[0].val; break; }
                }
            }
            ebitda = sorted[0].val + dna;
        }
    }

    return { name: companyName || null, emps, profit, ebitda, logo: null, source: 'edgar' };
}


async function fetchEmployeeCountFrom10K(cik) {
    // Step 1: Get recent filings from submissions API
    const subRes = await fetch(`https://data.sec.gov/submissions/CIK${cik}.json`, {
        headers: { 'User-Agent': 'YourFairShare admin@yourfairshare.com' }
    });
    if (!subRes.ok) throw new Error('EDGAR submissions HTTP ' + subRes.status);
    const sub = await subRes.json();

    // Find most recent 10-K — submissions API includes primaryDocument directly
    const filings = sub.filings?.recent || {};
    const forms = filings.form || [];
    const accessions = filings.accessionNumber || [];
    const primaryDocs = filings.primaryDocument || [];

    let accession = null;
    let primaryDoc = null;
    for (let i = 0; i < forms.length; i++) {
        if (forms[i] === '10-K' || forms[i] === '10-K/A') {
            accession = accessions[i];
            primaryDoc = primaryDocs[i];
            break;
        }
    }
    if (!accession) throw new Error('No 10-K found in submissions');

    // Step 2: Build the document URL directly — no index fetch needed
    // The submissions API gives us primaryDocument (e.g. "esab-20231231.htm")
    const accNoDashes = accession.replace(/-/g, '');
    const numericCik = cik.replace(/^0+/, '');

    let docUrl = null;
    if (primaryDoc && (primaryDoc.endsWith('.htm') || primaryDoc.endsWith('.html'))) {
        docUrl = `https://www.sec.gov/Archives/edgar/data/${numericCik}/${accNoDashes}/${primaryDoc}`;
    } else {
        // Fallback: fetch the index page to find the main document
        const indexUrl = `https://www.sec.gov/Archives/edgar/data/${numericCik}/${accNoDashes}/${accession}-index.htm`;
        const indexRes = await fetch(indexUrl, {
            headers: { 'User-Agent': 'YourFairShare admin@yourfairshare.com' }
        });
        if (!indexRes.ok) throw new Error('Filing index HTTP ' + indexRes.status);
        const indexHtml = await indexRes.text();
        // Parse the first .htm link that looks like the main doc (not an exhibit)
        const docMatch = indexHtml.match(/href="([^"]+\.htm)"/i);
        if (!docMatch) throw new Error('No .htm document found in filing index');
        docUrl = 'https://www.sec.gov' + (docMatch[1].startsWith('/') ? docMatch[1] : '/' + docMatch[1]);
    }

    // Step 3: Fetch the document - but only first ~200KB to find employee count
    // Employee count is almost always in Item 1 (first ~50 pages)
    const docRes = await fetch(docUrl, {
        headers: {
            'User-Agent': 'YourFairShare admin@yourfairshare.com',
            'Range': 'bytes=0-400000'
        }
    });
    if (!docRes.ok && docRes.status !== 206) throw new Error('10-K document HTTP ' + docRes.status);
    const html = await docRes.text();

    // Strip HTML tags to get plain text
    const text = html
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&#[0-9]+;/g, ' ')
        .replace(/\s+/g, ' ');

    // Search for employee count patterns
    const patterns = [
        // "approximately 95,000 employees" or "approximately 95,000 full-time employees"
        /(?:approximately|about|around|had|have|employs?|employed|employ)\s+([\d,]+)\s+(?:full[- ]time\s+)?(?:and\s+part[- ]time\s+)?employees/gi,
        // "workforce of approximately 95,000"
        /workforce\s+of\s+(?:approximately|about)?\s*([\d,]+)/gi,
        // "95,000 employees worldwide/globally/as of/at"
        /([\d,]+)\s+(?:full[- ]time\s+)?employees\s+(?:worldwide|globally|as\s+of|at\s+)/gi,
        // "headcount of 95,000"
        /headcount\s+of\s+(?:approximately)?\s*([\d,]+)/gi,
        // "we had 95,000 total employees"
        /(?:had|have|with)\s+([\d,]+)\s+total\s+(?:full[- ]time\s+)?employees/gi,
        // "95,000 full-time employees"
        /([\d,]+)\s+full[- ]time\s+employees/gi,
        // "as of December 31, 2023, we had X employees" — very common REIT/bank phrasing
        /as\s+of\s+(?:december|january|february|march|april|may|june|july|august|september|october|november)\s+\d+[^,]*,\s*(?:we\s+)?(?:had|have|employed)\s+([\d,]+)\s+(?:full[- ]time\s+)?(?:and\s+part[- ]time\s+)?employees/gi,
        // "X employees and" or "X employees,"
        /([\d,]+)\s+employees(?:\s+and|\s*,)/gi,
        // "employed X individuals/persons/people"
        /employed\s+([\d,]+)\s+(?:individuals?|persons?|people)/gi,
        // "staff of X" or "team of X employees"
        /(?:staff|team)\s+of\s+([\d,]+)\s*(?:employees|individuals|people|members)?/gi,
    ];

    // Check for externally-managed entity (many REITs have no employees)
    if (/we have no employees|have no direct employees|no employees.*externally managed|externally managed.*no employees|our manager.*employees|managed by.*advisor.*no employees/i.test(text)) {
        return 0; // legitimately zero — externally managed
    }

    const YEAR_RE = /^20[0-9]{2}$|^19[0-9]{2}$/; // filter out years parsed as counts
    const candidates = [];
    for (const pattern of patterns) {
        let match;
        pattern.lastIndex = 0;
        while ((match = pattern.exec(text)) !== null) {
            // Find the captured group that looks like a number
            for (let g = 1; g < match.length; g++) {
                if (match[g]) {
                    const n = parseInt(match[g].replace(/,/g, ''), 10);
                    // Exclude years (2019-2029) being misread as employee counts
                    if (!isNaN(n) && n >= 100 && n <= 5000000 && !YEAR_RE.test(match[g].trim())) {
                        candidates.push(n);
                    }
                }
            }
            if (candidates.length >= 10) break; // enough samples
        }
        if (candidates.length >= 3) break;
    }

    if (!candidates.length) throw new Error('Employee count not found in 10-K text');

    // The first mention is usually the official count in Item 1
    // But take the most common value as a sanity check
    const freq = {};
    for (const n of candidates) {
        // Round to nearest 100 for grouping
        const key = Math.round(n / 100) * 100;
        freq[key] = (freq[key] || 0) + 1;
    }
    const mostCommon = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
    return parseInt(mostCommon[0]);
}

// ── companiesmarketcap.com employee count fetcher ────────────────────────────
// Uses CMC's JSON search API to find the slug, then scrapes the /employees/ page.
// Only called as a last resort when all other sources fail.
async function fetchEmployeeCountFromCMC(symbol, companyName) {
    // Strategy 1: try the CMC search JSON API
    let slug = null;

    try {
        // CMC exposes a search endpoint that returns JSON
        const searchUrl = `https://companiesmarketcap.com/api/companies/search/?query=${encodeURIComponent(symbol)}&limit=5`;
        const searchRes = await fetch(searchUrl, {
            headers: { 'User-Agent': 'YourFairShare/1.0 (research)', 'Accept': 'application/json' }
        });
        if (searchRes.ok) {
            const results = await searchRes.json();
            // Results are an array of {name, ticker, slug, ...}
            const arr = Array.isArray(results) ? results : (results.data || results.results || []);
            // Prefer exact ticker match, then name match
            const byTicker = arr.find(r => r.ticker && r.ticker.toUpperCase() === symbol.toUpperCase());
            const byName = companyName && arr.find(r =>
                r.name && r.name.toLowerCase().includes(companyName.split(' ')[0].toLowerCase())
            );
            const match = byTicker || byName || arr[0];
            if (match && match.slug) slug = match.slug;
        }
    } catch(e) { /* fall through to strategy 2 */ }

    // Strategy 2: derive slug from company name heuristically
    // CMC slugs are typically lowercase, spaces→hyphens, stripped of Inc/Corp/etc.
    if (!slug && companyName) {
        slug = companyName
            .toLowerCase()
            .replace(/[,.'&]/g, '')
            .replace(/\s+(inc\.?|corp\.?|ltd\.?|llc|co\.?|holdings?|group|corporation|limited|plc|technologies|company)$/i, '')
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    if (!slug) throw new Error('CMC: could not determine slug');

    // Fetch the employees page
    const empUrl = `https://companiesmarketcap.com/${slug}/employees/`;
    const empRes = await fetch(empUrl, {
        headers: { 'User-Agent': 'YourFairShare/1.0 (research)', 'Accept': 'text/html' }
    });
    if (!empRes.ok) {
        // If slug didn't work, try a search-page approach
        throw new Error(`CMC employees page HTTP ${empRes.status} for slug: ${slug}`);
    }

    const html = await empRes.text();

    // Extract employee count — CMC renders it as a large number in a specific element
    // Try multiple patterns to be robust to layout changes
    const patterns = [
        // JSON-LD structured data (most reliable)
        /"numberOfEmployees"\s*:\s*["{]?\s*"?([\d,]+)"?/i,
        // The big stat displayed on the page
        /class="[^"]*company-stat-value[^"]*"[^>]*>\s*([\d,.]+\s*[KkMm]?)\s*</i,
        // Table cell with "Employees" label nearby
        /Employees[^<]*<\/[^>]+>\s*<[^>]+>\s*([\d,]+)/i,
        // Any large standalone number followed by context
        />\s*([\d,]{3,})\s*<\/[^>]+>\s*(?:<[^>]+>)*\s*(?:employees?|workers?|staff)/i,
    ];

    for (const pattern of patterns) {
        const m = html.match(pattern);
        if (m) {
            let raw = m[1].trim().replace(/,/g, '');
            // Handle K/M suffixes
            if (/k$/i.test(raw)) return Math.round(parseFloat(raw) * 1000);
            if (/m$/i.test(raw)) return Math.round(parseFloat(raw) * 1000000);
            const n = parseInt(raw, 10);
            if (!isNaN(n) && n >= 10 && n <= 5000000) return n;
        }
    }

    throw new Error('CMC: employee count not found in page');
}

async function fetchFromFMP(symbol) {
    const profileRes = await fetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${FMP_KEY}`);
    if (!profileRes.ok) throw new Error(`FMP profile HTTP ${profileRes.status}`);
    const profileArr = await profileRes.json();
    if (!profileArr?.[0]?.companyName) throw new Error('FMP: no profile');
    const p = profileArr[0];
    let profit = null, ebitda = null;
    try {
        const incomeRes = await fetch(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=1&apikey=${FMP_KEY}`);
        if (incomeRes.ok) {
            const incomeArr = await incomeRes.json();
            const inc = incomeArr?.[0] || {};
            profit = inc.netIncome || null;
            ebitda = inc.ebitda || null;
        }
    } catch(e) {}
    return {
        name: p.companyName || null,
        emps: p.fullTimeEmployees || null,
        profit, ebitda,
        logo: p.image || null,
        source: 'fmp'
    };
}

async function fetchFromFinnhub(symbol) {
    const [profileRes, finRes] = await Promise.all([
        fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_KEY}`),
        fetch(`https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_KEY}`)
    ]);
    const p = await profileRes.json();
    const f = await finRes.json();
    if (!p?.name) throw new Error('Finnhub: no profile');
    const m = f.metric || {};
    const currency = p.currency || 'USD';
    let profit = (m.netIncomePerShareAnnual && m.sharesOutstanding)
        ? Math.round(m.netIncomePerShareAnnual * m.sharesOutstanding) : null;
    let ebitda = (m.ebitdaPerShareAnnual && m.sharesOutstanding)
        ? Math.round(m.ebitdaPerShareAnnual * m.sharesOutstanding) : null;
    // Convert to USD if needed
    if (currency !== 'USD') {
        profit = await toUSD(profit, currency);
        ebitda = await toUSD(ebitda, currency);
    }
    let logo = p.logo || null;
    if (!logo && p.weburl) try { logo = `https://logo.clearbit.com/${new URL(p.weburl).hostname}`; } catch(e) {}
    return {
        name: p.name || null,
        emps: p.employeeTotal || null,
        profit, ebitda, logo,
        source: 'finnhub'
    };
}

async function fetchFromAlphaVantage(symbol) {
    const [overviewRes, incomeRes] = await Promise.all([
        fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${AV_KEY}`),
        fetch(`https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${AV_KEY}`)
    ]);
    if (!overviewRes.ok) throw new Error('AV HTTP ' + overviewRes.status);
    const overview = await overviewRes.json();
    if (!overview || !overview.Name) throw new Error('AV: no data');
    if (overview.Note || overview.Information) throw new Error('AV: rate limited');

    // AV returns numbers as strings, and missing values as "None" or "-"
    const parseAV = (v) => (v && v !== 'None' && v !== '-' && v !== 'N/A') ? parseInt(v) : null;

    const emps = parseAV(overview.FullTimeEmployees);
    const avCurrency = overview.Currency || 'USD';
    let profit = null, ebitda = parseAV(overview.EBITDA);

    if (incomeRes.ok) {
        const income = await incomeRes.json();
        const latest = (income.annualReports || [])[0] || {};
        profit = parseAV(latest.netIncome);
        if (!ebitda) ebitda = parseAV(latest.ebitda);
    }

    // Convert to USD if reported in foreign currency
    if (avCurrency !== 'USD') {
        profit = await toUSD(profit, avCurrency);
        ebitda = await toUSD(ebitda, avCurrency);
    }

    return { name: overview.Name || null, emps, profit, ebitda, logo: null, source: 'alphavantage' };
}


// Known Wikipedia page titles for ambiguous tickers/names
const WIKI_TITLE_MAP = {
    'RTX': 'RTX Corporation',
    'RTX CORP': 'RTX Corporation',
    'LHX': 'L3Harris Technologies',
    'L3HARRIS': 'L3Harris Technologies',
    'L3HARRIS TECHNOLOGIES': 'L3Harris Technologies',
    'GD': 'General Dynamics',
    'LMT': 'Lockheed Martin',
    'BA': 'Boeing',
    'HON': 'Honeywell',
    'MMM': '3M',
    'GE': 'GE Aerospace',
    'CAT': 'Caterpillar Inc.',
    'DE': 'John Deere',
    'F': 'Ford Motor Company',
    'GM': 'General Motors',
    'TSLA': 'Tesla Inc.',
    'AMZN': 'Amazon',
    'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft',
    'NVDA': 'Nvidia',
    'BAESY': 'BAE Systems',
    'CAE': 'CAE Inc.',
    'CW':   'Curtiss-Wright Corporation',
    'LMT':  'Lockheed Martin',
    'NOC':  'Northrop Grumman',
    'GD':   'General Dynamics',
    'LHX':  'L3Harris Technologies',
    'LDOS': 'Leidos',
    'HII':  'Huntington Ingalls Industries',
    'BAH':  'Booz Allen Hamilton',
    'GE':   'GE Aerospace',
    'HON':  'Honeywell',
    'KBR':  'KBR Inc.',
    'SAIC': 'Science Applications International Corporation',
    'TXT':  'Textron',
    'TDG':  'TransDigm Group',
    'OSK':  'Oshkosh Corporation',
    'BWXT': 'BWX Technologies',
    'VSAT': 'Viasat Inc.',
    'PH':   'Parker Hannifin',
    'APH':  'Amphenol',
    'ETN':  'Eaton Corporation',
    'PLTR': 'Palantir Technologies',
    'MOG.A':'Moog Inc.',
    'PH':   'Parker Hannifin',
    'HEI':  'HEICO',
    'HWM':  'Howmet Aerospace',
    'KEYS': 'Keysight Technologies',
    'TDY':  'Teledyne Technologies',
    'KTOS': 'Kratos Defense & Security Solutions',
    'OSK':  'Oshkosh Corporation',
    'BWXT': 'BWX Technologies',
    'VSAT': 'Viasat (American company)',
    // Tech 100 additions
    'NVDA':  'Nvidia',
    'AAPL':  'Apple Inc.',
    'MSFT':  'Microsoft',
    'AVGO':  'Broadcom Inc.',
    'ORCL':  'Oracle Corporation',
    'MU':    'Micron Technology',
    'AMD':   'Advanced Micro Devices',
    'CSCO':  'Cisco',
    'AMAT':  'Applied Materials',
    'LRCX':  'Lam Research',
    'CRM':   'Salesforce',
    'KLAC':  'KLA Corporation',
    'TXN':   'Texas Instruments',
    'ANET':  'Arista Networks',
    'ADI':   'Analog Devices',
    'UBER':  'Uber',
    'QCOM':  'Qualcomm',
    'PANW':  'Palo Alto Networks',
    'NOW':   'ServiceNow',
    'INTU':  'Intuit',
    'ADBE':  'Adobe Inc.',
    'GLW':   'Corning Inc.',
    'CRWD':  'CrowdStrike',
    'DELL':  'Dell Technologies',
    'ADP':   'ADP (company)',
    'WDC':   'Western Digital',
    'SNPS':  'Synopsys',
    'CDNS':  'Cadence Design Systems',
    'STX':   'Seagate Technology',
    'MRVL':  'Marvell Technology',
    'MSI':   'Motorola Solutions',
    'NET':   'Cloudflare',
    'SNOW':  'Snowflake Inc.',
    'FTNT':  'Fortinet',
    'ADSK':  'Autodesk',
    'MPWR':  'Monolithic Power Systems',
    'COHR':  'Coherent (company)',
    'TER':   'Teradyne',
    'DDOG':  'Datadog',
    'WDAY':  'Workday, Inc.',
    'ROP':   'Roper Technologies',
    // International tech
    'TSM':   'TSMC',
    'ASML':  'ASML Holding',
    'SSNLF': 'Samsung Electronics',
    'SAP':   'SAP',
    'SHOP':  'Shopify',
    'ACN':   'Accenture',
    'SONY':  'Sony',
    'ARM':   'Arm Holdings',
    'TOELY': 'Tokyo Electron',
    'ATEYY': 'Advantest',
    'TEL':   'TE Connectivity',
    'IFNNY': 'Infineon Technologies',
    'INFY':  'Infosys',
    'NXPI':  'NXP Semiconductors',
    'GRMN':  'Garmin',
    'NOK':   'Nokia',
    'ERIC':  'Ericsson',
    // Tech100 new additions
    'UI':    'Ubiquiti',
    'XYZ':   'Block, Inc.',
    'CRWV':  'CoreWeave',
    'CIEN':  'Ciena',
    'LITE':  'Lumentum Holdings',
    'HNHPF': 'Hon Hai Precision Industry',
    // Healthcare companies
    'LLY':   'Eli Lilly and Company',
    'JNJ':   'Johnson & Johnson',
    'ABBV':  'AbbVie',
    'MRK':   'Merck & Co.',
    'UNH':   'UnitedHealth Group',
    'AMGN':  'Amgen',
    'ABT':   'Abbott Laboratories',
    'TMO':   'Thermo Fisher Scientific',
    'GILD':  'Gilead Sciences',
    'ISRG':  'Intuitive Surgical',
    'PFE':   'Pfizer',
    'SYK':   'Stryker Corporation',
    'DHR':   'Danaher Corporation',
    'BMY':   'Bristol-Myers Squibb',
    'HCA':   'HCA Healthcare',
    'VRTX':  'Vertex Pharmaceuticals',
    'MCK':   'McKesson Corporation',
    'BSX':   'Boston Scientific',
    'CVS':   'CVS Health',
    'REGN':  'Regeneron Pharmaceuticals',
    'CI':    'The Cigna Group',
    'COR':   'Cencora',
    'ELV':   'Elevance Health',
    'BDX':   'Becton Dickinson',
    'ZTS':   'Zoetis',
    'CAH':   'Cardinal Health',
    'IDXX':  'IDEXX Laboratories',
    'EW':    'Edwards Lifesciences',
    'RMD':   'ResMed',
    'GEHC':  'GE HealthCare',
    'A':     'Agilent Technologies',
    'VEEV':  'Veeva Systems',
    'IQV':   'IQVIA',
    'WAT':   'Waters Corporation',
    'NTRA':  'Natera (company)',
    'BIIB':  'Biogen',
    'DXCM':  'Dexcom',
    'RPRX':  'Royalty Pharma',
    'ALNY':  'Alnylam Pharmaceuticals',
    'ONC':   'BeiGene',
    'INSM':  'Insmed',
    // International healthcare
    'RHHBY': 'Roche',
    'NVS':   'Novartis',
    'AZN':   'AstraZeneca',
    'NVO':   'Novo Nordisk',
    'MDT':   'Medtronic',
    'ESLOY': 'EssilorLuxottica',
    'GSK':   'GSK plc',
    'SNY':   'Sanofi',
    'TAK':   'Takeda Pharmaceutical',
    'ARGX':  'argenx',
    'CSLLY': 'CSL Limited',
    'HLN':   'Haleon',
    'TEVA':  'Teva Pharmaceutical Industries',
    'PHG':   'Philips',
    'BNTX':  'BioNTech',
    'BAYRY': 'Bayer',
    'MKKGY': 'Merck KGaA',
    'SMMNY': 'Siemens Healthineers',
    'FSNUY': 'Fresenius SE',
    'DSNKY': 'Daiichi Sankyo',
    'OTSKY': 'Otsuka Holdings',
    'LZAGY': 'Lonza',
    'GALDY': 'Galderma',
    'ALPMY': 'Astellas Pharma',
    'SDZNY': 'Sandoz',
    'MOG.A':'Moog Inc.',
    'PH':   'Parker Hannifin',
    'HXL':  'Hexcel',
    'FINMY': 'Leonardo S.p.A.',
    'THLEF': 'Thales Group',
    'SAABF': 'Saab AB',
    'RNMBY': 'Rheinmetall',
    'SHEL': 'Shell plc',
    'TM': 'Toyota',
    'EADSY': 'Airbus',
    'RYCEY': 'Rolls-Royce Holdings',
    'TSM': 'TSMC',
    'BABA': 'Alibaba Group',
    'META': 'Meta Platforms',
    'GOOGL': 'Alphabet Inc.',
    'GOOGLE': 'Alphabet Inc.',
    'ALPHABET': 'Alphabet Inc.',
    'BRK': 'Berkshire Hathaway',
    'BERKSHIRE': 'Berkshire Hathaway',
    'JPM': 'JPMorgan Chase',
    'JPMORGAN': 'JPMorgan Chase',
    'GS': 'Goldman Sachs',
    'MS': 'Morgan Stanley',
    'BAC': 'Bank of America',
    'WFC': 'Wells Fargo',
    'C': 'Citigroup',
    'USB': 'U.S. Bancorp',

    // ── Retail & Consumer ──────────────────────────────────────────────────────
    'WMT':  'Walmart',
    'AMZN': 'Amazon (company)',
    'COST': 'Costco',
    'HD':   'The Home Depot',
    'TGT':  'Target Corporation',
    'TJX':  'TJX Companies',
    'LOW':  "Lowe's",
    'KR':   'Kroger',
    'WBA':  'Walgreens Boots Alliance',
    'ACI':  'Albertsons',
    'ROST': 'Ross Stores',
    'DG':   'Dollar General',
    'DLTR': 'Dollar Tree',
    'BBY':  'Best Buy',
    'NKE':  'Nike, Inc.',
    'EBAY': 'eBay',
    'ETSY': 'Etsy',
    'W':    'Wayfair',
    'TSCO': 'Tractor Supply Company',
    'AZO':  'AutoZone',
    'ORLY': "O'Reilly Auto Parts",
    'ULTA': 'Ulta Beauty',
    'TPR':  'Tapestry, Inc.',
    'RL':   'Ralph Lauren',
    'ANF':  'Abercrombie & Fitch',
    'LULU': 'Lululemon Athletica',
    'WSM':  'Williams-Sonoma',
    'M':    "Macy's",
    'KMX':  'CarMax',
    'CVNA': 'Carvana',
    'POOL': 'Pool Corporation',
    'DECK': 'Deckers Brands',
    'GPS':  'Gap Inc.',
    'PVH':  'PVH Corp.',
    'HBI':  'Hanesbrands',
    'VFC':  'VF Corporation',
    'LEVI': 'Levi Strauss & Co.',
    'UAA':  'Under Armour',
    'COLM': 'Columbia Sportswear',
    'NVR':  'NVR, Inc.',
    'RH':   'RH (company)',
    'FIVE': 'Five Below',
    'BJ':   "BJ's Wholesale Club",
    'DRVN': 'Driven Brands',
    'BURL': 'Burlington Stores',
    'ODP':  'The ODP Corporation',
    'GPC':  'Genuine Parts Company',
    'AAP':  'Advance Auto Parts',
    'SFM':  'Sprouts Farmers Market',
    'GO':   'Grocery Outlet',
    'CASY': "Casey's General Stores",

    // ── Finance, Banking & Insurance ──────────────────────────────────────────
    'BRK.B': 'Berkshire Hathaway',
    'SCHW':  'Charles Schwab Corporation',
    'BK':    'BNY Mellon',
    'STT':   'State Street Corporation',
    'BLK':   'BlackRock',
    'BX':    'Blackstone Inc.',
    'KKR':   'KKR & Co.',
    'APO':   'Apollo Global Management',
    'ARES':  'Ares Management',
    'PYPL':  'PayPal',
    'FIS':   'Fidelity National Information Services',
    'SPGI':  'S&P Global',
    'MCO':   "Moody's Corporation",
    'ICE':   'Intercontinental Exchange',
    'CME':   'CME Group',
    'NDAQ':  'Nasdaq, Inc.',
    'CBOE':  'Cboe Global Markets',
    'MSCI':  'MSCI Inc.',
    'TROW':  'T. Rowe Price',
    'AMP':   'Ameriprise Financial',
    'IVZ':   'Invesco',
    'BEN':   'Franklin Templeton',
    'RJF':   'Raymond James Financial',
    'IBKR':  'Interactive Brokers',
    'HOOD':  'Robinhood Markets',
    'COIN':  'Coinbase',
    'SYF':   'Synchrony Financial',
    'DFS':   'Discover Financial Services',
    'HBAN':  'Huntington Bancshares',
    'FITB':  'Fifth Third Bancorp',
    'MTB':   'M&T Bank',
    'RF':    'Regions Financial',
    'KEY':   'KeyCorp',
    'CFG':   'Citizens Financial Group',
    'NTRS':  'Northern Trust',
    'CPAY':  'Corpay',
    'FICO':  'FICO',
    'BR':    'Broadridge Financial Solutions',
    'VRSK':  'Verisk Analytics',
    'EFX':   'Equifax',
    'TRU':   'TransUnion',
    'DNB':   'Dun & Bradstreet',
    'AJG':   'Arthur J. Gallagher & Co.',
    'WTW':   'WTW (company)',
    'AON':   'Aon plc',
    'MMC':   'Marsh McLennan',
    'SNEX':  'StoneX Group',
    'MET':   'MetLife',
    'PRU':   'Prudential Financial',
    'AFL':   'Aflac',
    'ALL':   'Allstate',
    'PGR':   'Progressive Corporation',
    'TRV':   'The Travelers Companies',
    'HIG':   'The Hartford',
    'CB':    'Chubb Limited',
    'AIG':   'American International Group',
    'L':     'Loews Corporation',
    'ACGL':  'Arch Capital Group',
    'EG':    'Everest Group',
    'WRB':   'W. R. Berkley Corporation',
    'CINF':  'Cincinnati Financial',
    'AIZ':   'Assurant',
    'GL':    'Globe Life',
    'ERIE':  'Erie Indemnity',
    'PFG':   'Principal Financial Group',
    'BRO':   'Brown & Brown',
    'RLI':   'RLI Corp',
    'HUM':   'Humana',
    'CNC':   'Centene Corporation',
    'MOH':   'Molina Healthcare',
    'UHS':   'Universal Health Services',
    'ZION':  'Zions Bancorporation',
    'BOKF':  'BOK Financial',
    'WAL':   'Western Alliance Bancorporation',
    'PNFP':  'Pinnacle Financial Partners',
    'WTFC':  'Wintrust Financial',
    'TCBI':  'Texas Capital Bancshares',
    'SLM':   'SLM Corporation',
    'NAVI':  'Navient',
    'LPLA':  'LPL Financial',
    'RKT':   'Rocket Companies',
    'PFSI':  'PennyMac Financial Services',
    'UWMC':  'United Wholesale Mortgage',
    'AL':    'Air Lease Corporation',
    'AFG':   'American Financial Group',
    'MKL':   'Markel Group',
    'RNR':   'RenaissanceRe',
    'KNSL':  'Kinsale Capital Group',
    'PLMR':  'Palomar Holdings',
    'SIGI':  'Selective Insurance',
    'KMPR':  'Kemper Corporation',
    'FFIN':  'First Financial Bankshares',
    'IBOC':  'International Bancshares Corporation',
    'BANR':  'Banner Bank',
    'CBSH':  'Commerce Bancshares',
    'CVBF':  'CVB Financial',
    'WABC':  'Westamerica Bancorporation',
    'WSFS':  'WSFS Financial',
    'UMBF':  'UMB Financial Corporation',
    'FCF':   'First Commonwealth Financial',
    'NBTB':  'NBT Bancorp',
    'SBCF':  'Seacoast Banking Corporation of Florida',
    'SFNC':  'Simmons First National Corporation',
    'HBNC':  'Horizon Bancal',
    'RNST':  'Renasant Corporation',
    'GABC':  'German American Bancorp',
    'FFBC':  'First Financial Bancorp',
    'CCNE':  'CNB Financial',
    'AROW':  'Arrow Financial Corporation',
    'CHMG':  'Chemung Financial',
    'ESNT':  'Essent Group',

    // ── Energy ────────────────────────────────────────────────────────────────
    'COP':   'ConocoPhillips',
    'PSX':   'Phillips 66',
    'MPC':   'Marathon Petroleum',
    'VLO':   'Valero Energy',
    'OXY':   'Occidental Petroleum',
    'EOG':   'EOG Resources',
    'SLB':   'Schlumberger',
    'HAL':   'Halliburton',
    'BKR':   'Baker Hughes',
    'DVN':   'Devon Energy',
    'FANG':  'Diamondback Energy',
    'HES':   'Hess Corporation',
    'APA':   'APA Corporation',
    'ET':    'Energy Transfer',
    'EPD':   'Enterprise Products Partners',
    'KMI':   'Kinder Morgan',
    'WMB':   'Williams Companies',
    'OKE':   'ONEOK',
    'TRGP':  'Targa Resources',
    'LNG':   'Cheniere Energy',
    'EQT':   'EQT Corporation',
    'CTRA':  'Coterra Energy',
    'EXE':   'Expand Energy',
    'TPL':   'Texas Pacific Land Corporation',
    'PAA':   'Plains All American Pipeline',
    'CRC':   'California Resources Corporation',
    'RRC':   'Range Resources',
    'CNX':   'CNX Resources',
    'OVV':   'Ovintiv',
    'PR':    'Permian Resources',
    'MTDR':  'Matador Resources',
    'PBF':   'PBF Energy',
    'DINO':  'HF Sinclair',
    'MPLX':  'MPLX',
    'WES':   'Western Midstream Partners',
    'CQP':   'Cheniere Energy Partners',
    'SM':    'SM Energy',
    'AROC':  'Archrock',
    'NGL':   'NGL Energy Partners',
    'HESM':  'Hess Midstream',
    'WTTR':  'Select Water Solutions',
    'BATL':  'Battalion Oil',
    'TALO':  'Talos Energy',
    'MGY':   'Magnolia Oil & Gas',

    // ── Utilities ─────────────────────────────────────────────────────────────
    'NEE':   'NextEra Energy',
    'SO':    'Southern Company',
    'EXC':   'Exelon',
    'AEP':   'American Electric Power',
    'SRE':   'Sempra',
    'PCG':   "PG&E Corporation",
    'ED':    'Consolidated Edison',
    'XEL':   'Xcel Energy',
    'ES':    'Eversource Energy',
    'AWK':   'American Water Works',
    'PPL':   'PPL Corporation',
    'EIX':   'Edison International',
    'CMS':   'CMS Energy',
    'NI':    'NiSource',
    'CNP':   'CenterPoint Energy',
    'AEE':   'Ameren',
    'ETR':   'Entergy',
    'DTE':   'DTE Energy',
    'FE':    'FirstEnergy',
    'PEG':   'Public Service Enterprise Group',
    'NRG':   'NRG Energy',
    'VST':   'Vistra Corp.',
    'CEG':   'Constellation Energy',
    'FSLR':  'First Solar',
    'EVRG':  'Evergy',
    'PNW':   'Pinnacle West Capital',
    'ATO':   'Atmos Energy',
    'AES':   'The AES Corporation',
    'OGE':   'OGE Energy',
    'NWE':   'NorthWestern Energy',
    'OTTR':  'Otter Tail Corporation',
    'SWX':   'Southwest Gas',
    'NWN':   'Northwest Natural',
    'CWT':   'California Water Service Group',
    'MSEX':  'Middlesex Water Company',
    'ENPH':  'Enphase Energy',
    'SEDG':  'SolarEdge Technologies',
    'PLUG':  'Plug Power',
    'AMRC':  'Ameresco',
    'CWEN':  'Clearway Energy',

    // ── Telecom, Media & Entertainment ────────────────────────────────────────
    'VZ':    'Verizon',
    'CHTR':  'Charter Communications',
    'WBD':   'Warner Bros. Discovery',
    'FOXA':  'Fox Corporation',
    'FOX':   'Fox Corporation',
    'NYT':   'The New York Times Company',
    'LYV':   'Live Nation Entertainment',
    'EA':    'Electronic Arts',
    'TTWO':  'Take-Two Interactive',
    'RBLX':  'Roblox Corporation',
    'SPOT':  'Spotify',
    'SIRI':  'Sirius XM',
    'OMC':   'Omnicom Group',
    'TTD':   'The Trade Desk',
    'TKO':   'TKO Group Holdings',
    'NWS':   'News Corp',
    'NWSA':  'News Corp',
    'IAC':   'IAC Inc.',
    'MTCH':  'Match Group',
    'BMBL':  'Bumble Inc.',
    'ROKU':  'Roku, Inc.',
    'NXST':  'Nexstar Media Group',
    'GTN':   'Gray Television',
    'SSP':   'The E.W. Scripps Company',
    'SBGI':  'Sinclair Broadcast Group',
    'TGNA':  'Tegna Inc.',
    'MSGS':  'Madison Square Garden Sports',
    'MSGE':  'Madison Square Garden Entertainment',
    'AMCX':  'AMC Networks',
    'CABO':  'Cable One',
    'LUMN':  'Lumen Technologies',
    'CCOI':  'Cogent Communications',
    'FUBO':  'Fubotv',

    // ── Transportation & Logistics ────────────────────────────────────────────
    'UPS':   'United Parcel Service',
    'JBLU':  'JetBlue',
    'SKYW':  'SkyWest Airlines',
    'UNP':   'Union Pacific Railroad',
    'CSX':   'CSX Corporation',
    'NSC':   'Norfolk Southern',
    'WAB':   'Wabtec',
    'CHRW':  'C.H. Robinson',
    'EXPD':  'Expeditors International',
    'XPO':   'XPO Inc.',
    'ODFL':  'Old Dominion Freight Line',
    'JBHT':  'J.B. Hunt Transport Services',
    'SAIA':  'Saia Inc.',
    'R':     'Ryder System',
    'DASH':  'DoorDash',
    'GXO':   'GXO Logistics',
    'RXO':   'RXO Inc.',
    'MATX':  'Matson, Inc.',
    'KEX':   'Kirby Corporation',
    'ARCB':  'ArcBest',
    'KNX':   'Knight-Swift Transportation',
    'LSTR':  'Landstar System',
    'HTLD':  'Heartland Express',
    'MRTN':  'Marten Transport',

    // ── Automotive ────────────────────────────────────────────────────────────
    'AN':    'AutoNation',
    'PAG':   'Penske Automotive Group',
    'LAD':   'Lithia Motors',
    'ABG':   'Asbury Automotive Group',
    'GPI':   'Group 1 Automotive',
    'SAH':   'Sonic Automotive',
    'APTV':  'Aptiv',
    'LEA':   'Lear Corporation',
    'BWA':   'BorgWarner',
    'DAN':   'Dana Incorporated',
    'LCID':  'Lucid Motors',
    'RIVN':  'Rivian',
    'PCAR':  'PACCAR',
    'ALSN':  'Allison Transmission',
    'WGO':   'Winnebago Industries',
    'THO':   'Thor Industries',
    'STLA':  'Stellantis',
    'HMC':   'Honda',
    'VWAGY': 'Volkswagen Group',
    'BMWYY': 'BMW',
    'MBGYY': 'Mercedes-Benz Group',
    'FOXF':  'Fox Factory',

    // ── Food, Beverage & Restaurants ──────────────────────────────────────────
    'YUM':   'Yum! Brands',
    'QSR':   'Restaurant Brands International',
    'DPZ':   "Domino's Pizza",
    'CMG':   'Chipotle Mexican Grill',
    'EAT':   'Brinker International',
    'TXRH':  'Texas Roadhouse',
    'JACK':  'Jack in the Box',
    'RRGB':  'Red Robin',
    'CAKE':  'The Cheesecake Factory',
    'SHAK':  'Shake Shack',
    'CAVA':  'Cava Group',
    'WING':  'Wingstop',
    'CBRL':  'Cracker Barrel',
    'PLAY':  "Dave & Buster's",
    'TSN':   'Tyson Foods',
    'ADM':   'Archer-Daniels-Midland',
    'BG':    'Bunge Limited',
    'SYY':   'Sysco',
    'PFGC':  'Performance Food Group',
    'USFD':  'US Foods',
    'CAG':   'Conagra Brands',
    'CPB':   'Campbell Soup Company',
    'SJM':   'J.M. Smucker',
    'MKC':   'McCormick & Company',
    'HSY':   'The Hershey Company',
    'MDLZ':  'Mondelez International',
    'STZ':   'Constellation Brands',
    'TAP':   'Molson Coors Beverage Company',
    'SAM':   'Boston Beer Company',
    'MNST':  'Monster Beverage',
    'KDP':   'Keurig Dr Pepper',
    'CELH':  'Celsius Holdings',
    'KHC':   'The Kraft Heinz Company',
    'LW':    'Lamb Weston',
    'CALM':  'Cal-Maine Foods',
    'NATH':  "Nathan's Famous",
    'UNFI':  'United Natural Foods',
    'CHEF':  "The Chefs' Warehouse",
    'VITL':  'Vital Farms',
    'DEO':   'Diageo',
    'BUD':   'Anheuser-Busch InBev',
    'BF.B':  'Brown-Forman',

    // ── Consumer Goods & Household ────────────────────────────────────────────
    'PG':    'Procter & Gamble',
    'CL':    'Colgate-Palmolive',
    'KMB':   'Kimberly-Clark',
    'CHD':   'Church & Dwight',
    'EL':    "Estée Lauder Companies",
    'CLX':   'Clorox',
    'KVUE':  'Kenvue',
    'COTY':  'Coty Inc.',
    'IFF':   'International Flavors & Fragrances',
    'HAS':   'Hasbro',
    'MAT':   'Mattel',
    'ACCO':  'ACCO Brands',
    'ENR':   'Energizer Holdings',
    'SPB':   'Spectrum Brands',
    'NWL':   'Newell Brands',
    'CENT':  'Central Garden and Pet',
    'HBB':   'Hamilton Beach Brands',
    'MHK':   'Mohawk Industries',
    'WSO':   'Watsco',
    'SMP':   'Standard Motor Products',
    'DORM':  'Dorman Products',
    'PTON':  'Peloton Interactive',
    'YETI':  'YETI Holdings',

    // ── Industrials & Manufacturing ───────────────────────────────────────────
    'GE':    'GE Aerospace',
    'GEV':   'GE Vernova',
    'MMM':   '3M',
    'CAT':   'Caterpillar Inc.',
    'DE':    'John Deere',
    'EMR':   'Emerson Electric',
    'ITW':   'Illinois Tool Works',
    'DOV':   'Dover Corporation',
    'AME':   'AMETEK',
    'FTV':   'Fortive',
    'IR':    'Ingersoll Rand',
    'TT':    'Trane Technologies',
    'CARR':  'Carrier Global',
    'OTIS':  'Otis Worldwide',
    'JCI':   'Johnson Controls',
    'LII':   'Lennox International',
    'SWK':   'Stanley Black & Decker',
    'PNR':   'Pentair',
    'FAST':  'Fastenal',
    'GWW':   'W.W. Grainger',
    'MSM':   'MSC Industrial Direct',
    'AOS':   'A. O. Smith',
    'FIX':   'Comfort Systems USA',
    'NDSN':  'Nordson Corporation',
    'IEX':   'IDEX Corporation',
    'LECO':  'Lincoln Electric',
    'WMS':   'Advanced Drainage Systems',
    'GT':    'Goodyear Tire and Rubber Company',
    'MOD':   'Modine Manufacturing',
    'AXON':  'Axon Enterprise',
    'CTAS':  'Cintas',
    'ROL':   'Rollins, Inc.',
    'URI':   'United Rentals',
    'WSC':   'WillScot Mobile Mini',
    'FLR':   'Fluor Corporation',
    'PRIM':  'Primoris Services',
    'DY':    'Dycom Industries',
    'AGCO':  'AGCO',
    'CNH':   'CNH Industrial',
    'GNRC':  'Generac Holdings',
    'HUBB':  'Hubbell Incorporated',
    'JBL':   'Jabil',
    'IIPR':  'Innovative Industrial Properties',
    'HY':    'Hyster-Yale Group',
    'TKR':   'The Timken Company',
    'ATI':   'ATI Inc.',
    'CRS':   'Carpenter Technology',
    'KALU':  'Kaiser Aluminum',
    'APOG':  'Apogee Enterprises',
    'ASTE':  'Astec Industries',
    'FELE':  'Franklin Electric',
    'GTLS':  'Chart Industries',
    'HLIO':  'Helios Technologies',
    'POWL':  'Powell Industries',
    'SPXC':  'SPX Technologies',
    'GFF':   'Griffon Corporation',
    'KAI':   'Kadant',
    'MGRC':  'McGrath RentCorp',
    'RUSHA': 'Rush Enterprises',
    'LCII':  'LCI Industries',
    'ESAB':  'ESAB Corporation',
    'GTES':  'Gates Industrial Corporation',
    'TNC':   'Tennant Company',
    'FWRD':  'Forward Air',
    'ZBRA':  'Zebra Technologies',

    // ── Construction & Building Materials ─────────────────────────────────────
    'MLM':   'Martin Marietta Materials',
    'VMC':   'Vulcan Materials Company',
    'CRH':   'CRH plc',
    'BLDR':  'Builders FirstSource',
    'MHO':   'M/I Homes',
    'DHI':   'D.R. Horton',
    'LEN':   'Lennar',
    'PHM':   'PulteGroup',
    'IBP':   'Installed Building Products',
    'EXP':   'Eagle Materials',
    'CVCO':  'Cavco Industries',
    'SKY':   'Skyline Champion Corporation',
    'UFPI':  'UFP Industries',
    'PATK':  'Patrick Industries',
    'NX':    'Quanex Building Products',

    // ── Metals, Mining & Chemicals ────────────────────────────────────────────
    'NUE':   'Nucor',
    'STLD':  'Steel Dynamics',
    'CLF':   'Cleveland-Cliffs',
    'AA':    'Alcoa',
    'CENX':  'Century Aluminum',
    'FCX':   'Freeport-McMoRan',
    'RS':    'Reliance, Inc.',
    'CMC':   'Commercial Metals Company',
    'NEM':   'Newmont',
    'GOLD':  'Barrick Gold',
    'SCCO':  'Southern Copper',
    'MP':    'MP Materials',
    'IP':    'International Paper',
    'SEE':   'Sealed Air',
    'BALL':  'Ball Corporation',
    'ATR':   'AptarGroup',
    'SLGN':  'Silgan Holdings',
    'SON':   'Sonoco Products',
    'GPK':   'Graphic Packaging',
    'SW':    'Smurfit WestRock',
    'WY':    'Weyerhaeuser',
    'RYN':   'Rayonier',
    'LIN':   'Linde plc',
    'APD':   'Air Products and Chemicals',
    'ECL':   'Ecolab',
    'SHW':   'Sherwin-Williams',
    'RPM':   'RPM International',
    'ALB':   'Albemarle Corporation',
    'CE':    'Celanese',
    'HUN':   'Huntsman Corporation',
    'LYB':   'LyondellBasell',
    'CTVA':  'Corteva',
    'FMC':   'FMC Corporation',
    'CF':    'CF Industries',
    'MOS':   'Mosaic Company',
    'EMN':   'Eastman Chemical',
    'ASH':   'Ashland Inc.',
    'TROX':  'Tronox',
    'KWR':   'Quaker Houghton',
    'TREX':  'Trex Company',
    'FUL':   'H.B. Fuller',
    'CBT':   'Cabot Corporation',
    'NEU':   'NewMarket Corporation',
    'RIO':   'Rio Tinto',
    'BHP':   'BHP',
    'VALE':  'Vale S.A.',
    'MT':    'ArcelorMittal',
    'PKX':   'POSCO Holdings',
    'HTHIY': 'Hitachi',
    'AEM':   'Agnico Eagle Mines',
    'KGC':   'Kinross Gold',
    'SQM':   'Sociedad Química y Minera',
    'NTR':   'Nutrien',
    'MEOH':  'Methanex',
    'LAC':   'Lithium Americas',

    // ── Real Estate & REITs ───────────────────────────────────────────────────
    'PLD':   'Prologis',
    'AMT':   'American Tower',
    'CCI':   'Crown Castle',
    'EQIX':  'Equinix',
    'SPG':   'Simon Property Group',
    'DLR':   'Digital Realty',
    'PSA':   'Public Storage',
    'EXR':   'Extra Space Storage',
    'AVB':   'AvalonBay Communities',
    'EQR':   'Equity Residential',
    'MAA':   'Mid-America Apartment Communities',
    'O':     'Realty Income',
    'VICI':  'VICI Properties',
    'VTR':   'Ventas',
    'SBAC':  'SBA Communications',
    'INVH':  'Invitation Homes',
    'AMH':   'American Homes 4 Rent',
    'IRM':   'Iron Mountain',
    'CBRE':  'CBRE Group',
    'KIM':   'Kimco Realty',
    'REG':   'Regency Centers',
    'FRT':   'Federal Realty Investment Trust',
    'NNN':   'NNN REIT',
    'ADC':   'Agree Realty',
    'BXP':   'BXP Inc.',
    'ARE':   'Alexandria Real Estate Equities',
    'CPT':   'Camden Property Trust',
    'UDR':   'UDR, Inc.',
    'ESS':   'Essex Property Trust',
    'LXP':   'LXP Industrial Trust',
    'COLD':  'Americold Realty Trust',
    'NSA':   'National Storage Affiliates',
    'CUBE':  'CubeSmart',
    'TRNO':  'Terreno Realty',
    'REXR':  'Rexford Industrial Realty',
    'EGP':   'EastGroup Properties',
    'STAG':  'STAG Industrial',
    'SVC':   'Service Properties Trust',
    'APLE':  'Apple Hospitality REIT',
    'OHI':   'Omega Healthcare Investors',
    'SBRA':  'Sabra Health Care REIT',
    'CIGI':  'Colliers International',
    'YELP':  'Yelp',
    'ANGI':  'Angi Inc.',
    'CARS':  'Cars.com',
    'CARG':  'CarGurus',
    'OPEN':  'Opendoor Technologies',
    'COMP':  'Compass, Inc.',
    'RMAX':  'RE/MAX',
    'RDN':   'Radian Group',
    'NMIH':  'NMI Holdings',
    'MTG':   'MGIC Investment',

    // ── HR, Staffing & Business Services ─────────────────────────────────────
    'PAYX':  'Paychex',
    'PAYC':  'Paycom',
    'MAN':   'ManpowerGroup',
    'RHI':   'Robert Half International',
    'KFRC':  'Kforce',
    'KELYA': 'Kelly Services',
    'WU':    'Western Union',
    'CPRT':  'Copart',
    'CSGP':  'CoStar Group',
    'IT':    'Gartner',
    'JKHY':  'Jack Henry & Associates',
    'VRSN':  'VeriSign',
    'MANH':  'Manhattan Associates',
    'PCTY':  'Paylocity',

    // ── Technology (top-1000 specific) ────────────────────────────────────────
    'CTSH':  'Cognizant',
    'HPE':   'Hewlett Packard Enterprise',
    'CDW':   'CDW Corporation',
    'MCHP':  'Microchip Technology',
    'ON':    'Onsemi',
    'SWKS':  'Skyworks Solutions',
    'QRVO':  'Qorvo',
    'PTC':   'PTC Inc.',
    'EPAM':  'EPAM Systems',
    'AKAM':  'Akamai Technologies',
    'FFIV':  'F5, Inc.',
    'GEN':   'Gen Digital',
    'SMCI':  'Super Micro Computer',
    'TWLO':  'Twilio',
    'WK':    'Workiva',
    'HUBS':  'HubSpot',
    'MKTX':  'MarketAxess',
    'CVLT':  'Commvault',
    'EXTR':  'Extreme Networks',
    'VIAV':  'Viavi Solutions',
    'CALX':  'Calix Inc.',
    'IRDM':  'Iridium Communications',
    'DOMO':  'Domo, Inc.',
    'FRSH':  'Freshworks',
    'TTEC':  'TTEC Holdings',
    'CEVA':  'CEVA Inc.',
    'FORM':  'FormFactor',
    'ACLS':  'Axcelis Technologies',
    'UCTT':  'Ultra Clean Holdings',
    'ICHR':  'Ichor Holdings',
    'AZTA':  'Azenta',
    'ONTO':  'Onto Innovation',
    'MKSI':  'MKS Instruments',
    'WOLF':  'Wolfspeed',
    'LSCC':  'Lattice Semiconductor',
    'SITM':  'SiTime',
    'AMBA':  'Ambarella',
    'COHU':  'Cohu',
    'DIOD':  'Diodes Incorporated',
    'MTSI':  'MACOM Technology Solutions',
    'POWI':  'Power Integrations',
    'SLAB':  'Silicon Laboratories',
    'SMTC':  'Semtech',
    'ANSS':  'Ansys',
    'ALTR':  'Altair Engineering',
    'JNPR':  'Juniper Networks',
    'NABL':  'N-able',

    // ── Healthcare Services & Med-Tech (top-1000 specific) ────────────────────
    'DVA':   'DaVita',
    'LH':    'Labcorp',
    'DGX':   'Quest Diagnostics',
    'RVTY':  'Revvity',
    'HSIC':  'Henry Schein',
    'CRL':   'Charles River Laboratories',
    'SOLV':  'Solventum',
    'VTRS':  'Viatris',
    'BAX':   'Baxter International',
    'ZBH':   'Zimmer Biomet',
    'COO':   'Cooper Companies',
    'ALGN':  'Align Technology',
    'PODD':  'Insulet Corporation',
    'WST':   'West Pharmaceutical Services',
    'MRNA':  'Moderna',
    'TECH':  'Bio-Techne',
    'ENSG':  'Ensign Group',
    'ADUS':  'Addus HomeCare',
    'NVCR':  'NovaCure',
    'TNDM':  'Tandem Diabetes Care',
    'GKOS':  'Glaukos',
    'IART':  'Integra LifeSciences',
    'OMCL':  'Omnicell',
    'NVST':  'Envista Holdings',
    'ITGR':  'Integer Holdings',
    'TFX':   'Teleflex',
    'PDCO':  'Patterson Companies',
    'PNTG':  'Pennant Group',
    'ACHC':  'Acadia Healthcare',
    'SGRY':  'Surgery Partners',
    'HIMS':  'Hims & Hers Health',
    'MMSI':  'Merit Medical Systems',
    'IONS':  'Ionis Pharmaceuticals',
    'SRPT':  'Sarepta Therapeutics',
    'RARE':  'Ultragenyx Pharmaceutical',
    'ACAD':  'ACADIA Pharmaceuticals',
    'APLS':  'Apellis Pharmaceuticals',
    'FRPT':  'Freshpet',

    // ── Hospitality, Travel & Gaming ──────────────────────────────────────────
    'HLT':   'Hilton Worldwide',
    'WH':    'Wyndham Hotels & Resorts',
    'CHH':   'Choice Hotels',
    'BKNG':  'Booking Holdings',
    'EXPE':  'Expedia Group',
    'ABNB':  'Airbnb',
    'CCL':   'Carnival Corporation',
    'RCL':   'Royal Caribbean Group',
    'MGM':   'MGM Resorts International',
    'CZR':   'Caesars Entertainment',
    'LVS':   'Las Vegas Sands',
    'WYNN':  'Wynn Resorts',
    'BYD':   'Boyd Gaming',
    'PENN':  'PENN Entertainment',
    'DKNG':  'DraftKings',
    'FLUT':  'Flutter Entertainment',
    'FUN':   'Cedar Fair',
    'TNL':   'Travel + Leisure Co.',

    // ── Education ─────────────────────────────────────────────────────────────
    'CHGG':  'Chegg',
    'PRDO':  'Perdoceo Education',
    'LOPE':  'Grand Canyon University',
    'LAUR':  'Laureate Education',
    'ATGE':  'Adtalem Global Education',
    'COUR':  'Coursera',
    'DUOL':  'Duolingo',

    // ── Waste, Environment & Cannabis ────────────────────────────────────────
    'WM':    'Waste Management, Inc.',
    'RSG':   'Republic Services',
    'CLH':   'Clean Harbors',
    'CWST':  'Casella Waste Systems',
    'ECVT':  'Ecovyst',
    'GTBIF': 'Green Thumb Industries',
    'TCNNF': 'Trulieve Cannabis',

    // ── Tobacco ───────────────────────────────────────────────────────────────
    'MO':    'Altria',
    'PM':    'Philip Morris International',
    'BTI':   'British American Tobacco',
    'TPB':   'Turning Point Brands',

    // ── Alternative Asset Managers & BDCs ────────────────────────────────────
    'ARCC':  'Ares Capital Corporation',
    'OWL':   'Blue Owl Capital',
    'HLNE':  'Hamilton Lane',
    'STEP':  'StepStone Group',
    'MAIN':  'Main Street Capital',
    'HTGC':  'Hercules Capital',

    // ── Aerospace & Aviation ──────────────────────────────────────────────────
    'JOBY':  'Joby Aviation',
    'ACHR':  'Archer Aviation',
    'AL':    'Air Lease Corporation',
    'AER':   'AerCap',
};

async function fetchEmployeeCountFromWikipedia(companyName, knownTitle = null) {
    // Strategy: build a rich candidate list using multiple general approaches
    // so we don't need to hardcode every company in WIKI_TITLE_MAP

    // Also check WIKI_TITLE_MAP by the uppercased name itself
    const upperName = companyName.toUpperCase().trim();
    if (!knownTitle) knownTitle = WIKI_TITLE_MAP[upperName] || null;

    // Try multiple name variations to find the Wikipedia page
    const cleanName = companyName
        .replace(/,?\s+(Inc\.?|Corp\.?|Ltd\.?|LLC|Co\.?|Holdings?|Group|Corporation|Limited|plc|Technologies)\s*$/i, '')
        .replace(/\s*\/[A-Z]{2,}\/\s*$/, '')  // remove state suffixes like /DE/
        .replace(/\s+/g, ' ')
        .trim();
    const firstWord = cleanName.split(' ')[0];
    // Build rich candidate list using general strategies:
    // 1. Known title from WIKI_TITLE_MAP (most reliable)
    // 2. Clean name as-is (e.g. "Parker Hannifin")
    // 3. Clean name + " Corporation" / " Company" / " Group" / " Inc"
    // 4. Original Finnhub name (may include Corp/Inc which helps disambiguation)
    // 5. First two words (handles "Lockheed Martin Corp" -> "Lockheed Martin")
    // 6. First word only (last resort)
    const firstTwo = cleanName.split(' ').slice(0, 2).join(' ');
    const candidates = [
        knownTitle,                        // exact known title
        cleanName,                         // clean name
        companyName,                       // original finnhub name (may have Corp/Inc)
        cleanName + ' Corporation',        // try adding Corporation
        cleanName + ' Company',            // try adding Company
        cleanName + ' Group',              // try adding Group
        cleanName + ' Inc.',               // try adding Inc.
        firstTwo,                          // first two words
        firstTwo + ' Corporation',         // first two + Corporation
        firstWord + ' Corporation',        // first word + Corporation
        firstWord,                         // first word only
    ].filter(Boolean).filter((v, i, arr) => arr.indexOf(v) === i); // dedupe, remove nulls

    let wikitext = null;
    let foundTitle = null;

    const blocklist = ['middle-earth', 'lord of the rings', 'disambiguation', 'film', 'novel', 'song', 'graphics', 'gpu', 'nvidia'];
    for (const query of candidates) {
        if (!query || query.length < 2) continue;
        try {
            const searchUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' +
                encodeURIComponent(query) + '&limit=8&format=json';
            const searchRes = await fetch(searchUrl, {
                headers: { 'Accept': 'application/json', 'User-Agent': 'YourFairShare/1.0' }
            });
            if (!searchRes.ok) continue;
            const searchJson = await searchRes.json();
            const titles = searchJson[1] || [];
            const descs = searchJson[2] || [];

            // Strategy 1: exact match on the query
            let match = titles.find(t => t.toLowerCase() === query.toLowerCase());

            // Strategy 2: title matches AND description signals it's a company
            const companySignals = ['company', 'corporation', 'conglomerate', 'manufacturer',
                'aerospace', 'defense', 'defence', 'american', 'founded', 'headquartered',
                'multinational', 'contractor', 'technologies', 'systems', 'industry', 'industries'];
            if (!match) match = titles.find((t, i) => {
                const tl = t.toLowerCase();
                const dl = (descs[i] || '').toLowerCase();
                return tl.includes(cleanName.toLowerCase()) &&
                    !blocklist.some(b => tl.includes(b)) &&
                    companySignals.some(s => dl.includes(s));
            });

            // Strategy 3: title starts with cleanName (e.g. "Parker Hannifin Corporation")
            if (!match) match = titles.find(t =>
                t.toLowerCase().startsWith(cleanName.toLowerCase()) &&
                !blocklist.some(b => t.toLowerCase().includes(b))
            );

            // Strategy 4: title contains cleanName and isn't in blocklist
            if (!match) match = titles.find(t =>
                t.toLowerCase().includes(cleanName.toLowerCase()) &&
                !blocklist.some(b => t.toLowerCase().includes(b))
            );

            if (!match) continue;

            const pageUrl = 'https://en.wikipedia.org/w/api.php?action=query&titles=' +
                encodeURIComponent(match) + '&prop=revisions&rvprop=content&rvslots=main&format=json';
            const pageRes = await fetch(pageUrl, {
                headers: { 'Accept': 'application/json', 'User-Agent': 'YourFairShare/1.0' }
            });
            if (!pageRes.ok) continue;
            const pageJson = await pageRes.json();
            const pages = pageJson?.query?.pages || {};
            const page = Object.values(pages)[0];
            const text = page?.revisions?.[0]?.slots?.main?.['*']
                      || page?.revisions?.[0]?.['*'] || '';
            if (text) {
                // Follow redirects e.g. "L3Harris" -> "L3Harris Technologies"
                const redirectMatch = text.match(/^#(?:REDIRECT|redirect)\s*\[\[([^\]]+)\]\]/m);
                if (redirectMatch) {
                    const redirectTitle = redirectMatch[1].split('|')[0].trim();
                    const redirRes = await fetch(
                        'https://en.wikipedia.org/w/api.php?action=query&titles=' +
                        encodeURIComponent(redirectTitle) + '&prop=revisions&rvprop=content&rvslots=main&format=json',
                        { headers: { 'Accept': 'application/json', 'User-Agent': 'YourFairShare/1.0' } }
                    );
                    if (redirRes.ok) {
                        const redirJson = await redirRes.json();
                        const redirPages = redirJson?.query?.pages || {};
                        const redirPage = Object.values(redirPages)[0];
                        const redirText = redirPage?.revisions?.[0]?.slots?.main?.['*']
                                       || redirPage?.revisions?.[0]?.['*'] || '';
                        if (redirText) { wikitext = redirText; foundTitle = redirectTitle; break; }
                    }
                } else {
                    wikitext = text; foundTitle = match; break;
                }
            }
        } catch(e) { continue; }
    }

    if (!wikitext) throw new Error('Wikipedia: page not found for ' + companyName);

    // Find employee count line in infobox
    const lines = wikitext.split('\n');
    const empLine = lines.find(l =>
        l.indexOf('num_employees') >= 0 || l.indexOf('number_of_employees') >= 0
    );

    if (empLine) {
        // Strip templates, handle ~approx prefix, refs like [1]
        const stripped = empLine
            .replace(/{{[^}]+}}/g, (match) => {
                // Only keep content if it looks like an employee number, otherwise drop
                const inner = match.match(/\|([~\d,]{3,})/);
                return inner ? ' ' + inner[1] + ' ' : ' ';
            })
            .replace(/<ref[^>]*\/>/g, ' ')
            .replace(/<ref[^>]*>.*?<\/ref>/g, ' ')
            .replace(/~/g, '')
            .replace(/\bc\.\s*/g, '')
            .replace(/\[\d+\]/g, ' ');
        const allNums = stripped.match(/[\d,]+/g) || [];
        const parsed = allNums.map(n => parseInt(n.replace(/,/g, ''), 10)).filter(n => !isNaN(n) && n > 100);
        if (parsed.length > 0) return Math.max(...parsed);
    }
    throw new Error('Wikipedia: employee count not found for ' + foundTitle);
}


// Known name->ticker aliases to avoid fuzzy match failures
const TICKER_ALIASES = {
    'l3harris': 'LHX',
    'l3harris technologies': 'LHX',
    'l3': 'LHX',
    'raytheon': 'RTX',
    'raytheon technologies': 'RTX',
    'rtx corporation': 'RTX',
    'lockheed': 'LMT',
    'lockheed martin': 'LMT',
    'general dynamics': 'GD',
    'northrop': 'NOC',
    'northrop grumman': 'NOC',
    'boeing': 'BA',
    'honeywell': 'HON',
    'apple': 'AAPL',
    'microsoft': 'MSFT',
    'google': 'GOOGL',
    'alphabet': 'GOOGL',
    'amazon': 'AMZN',
    'meta': 'META',
    'facebook': 'META',
    'nvidia': 'NVDA',
    'tesla': 'TSLA',
    'ford': 'F',
    'general motors': 'GM',
    'walmart': 'WMT',
    'jpmorgan': 'JPM',
    'jp morgan': 'JPM',
    'goldman sachs': 'GS',
    'morgan stanley': 'MS',
    'bank of america': 'BAC',
    'wells fargo': 'WFC',
    'caterpillar': 'CAT',
    '3m': 'MMM',
    'ge': 'GE',
    'ge aerospace': 'GE',
    'john deere': 'DE',
    'deere': 'DE',
    'exxon': 'XOM',
    'exxonmobil': 'XOM',
    'chevron': 'CVX',
    'pfizer': 'PFE',
    'johnson and johnson': 'JNJ',
    'johnson & johnson': 'JNJ',
    'unitedhealth': 'UNH',
    'united health': 'UNH',
    'cvs': 'CVS',
    'cvs health': 'CVS',
    'ups': 'UPS',
    'fedex': 'FDX',
    'target': 'TGT',
    'home depot': 'HD',
    'costco': 'COST',
    'mcdonalds': 'MCD',
    "mcdonald's": 'MCD',
    'starbucks': 'SBUX',
    'disney': 'DIS',
    'netflix': 'NFLX',
    'palantir': 'PLTR',
    'lyft': 'LYFT',
    'uber': 'UBER',
    'airbnb': 'ABNB',
    'salesforce': 'CRM',
    'oracle': 'ORCL',
    'intel': 'INTC',
    'amd': 'AMD',
    'ibm': 'IBM',
    'att': 'T',
    'at&t': 'T',
    'verizon': 'VZ',
    'comcast': 'CMCSA',
    // International companies (OTC ADRs)
    'bae systems': 'BAESY',
    'leonardo': 'FINMY',
    'leonardo spa': 'FINMY',
    'leonardo s.p.a.': 'FINMY',
    'finmeccanica': 'FINMY',
    'thales': 'THLEF',
    'dassault': 'DUAVF',
    'saab': 'SAABF',
    'rheinmetall': 'RNMBY',
    'huntington ingalls industries': 'HII',
    'huntington ingalls': 'HII',
    'booz allen': 'BAH',
    'booz allen hamilton': 'BAH',
    'leidos': 'LDOS',
    'cae': 'CAE',
    'cae inc': 'CAE',
    'cae inc.': 'CAE',
    'amentum': 'AMTM',
    'v2x': 'VVX', 'v2x inc': 'VVX',
    'standardaero': 'SAX', 'standard aero': 'SAX',
    'parsons': 'PSN', 'parsons corporation': 'PSN',
    'mantech': 'MANT',
    'spirit aerosystems': 'SPR', 'spirit aero': 'SPR',
    'mercury systems': 'MRCY',
    'howmet': 'HWM', 'howmet aerospace': 'HWM',
    'heico': 'HEI',
    'bwx technologies': 'BWXT', 'bwx': 'BWXT',
    'kratos': 'KTOS', 'kratos defense': 'KTOS',
    'viasat': 'VSAT',
    'elbit': 'ESLT', 'elbit systems': 'ESLT',
    'safran': 'SAFRY',
    'dassault': 'DUAVF', 'dassault aviation': 'DUAVF',
    'babcock': 'BCIGY', 'babcock international': 'BCIGY',
    'qinetiq': 'QNTQF',
    'ttm technologies': 'TTMI',
    'keysight': 'KEYS', 'keysight technologies': 'KEYS',
    'teledyne': 'TDY', 'teledyne technologies': 'TDY',
    'moog': 'MOG.A',
    // Tech companies
    'nvidia': 'NVDA',
    'apple': 'AAPL',
    'microsoft': 'MSFT',
    'tsmc': 'TSM',
    'taiwan semiconductor': 'TSM',
    'broadcom': 'AVGO',
    'asml': 'ASML',
    'oracle': 'ORCL',
    'micron': 'MU',
    'micron technology': 'MU',
    'samsung': 'SSNLF',
    'amd': 'AMD',
    'advanced micro devices': 'AMD',
    'cisco': 'CSCO',
    'applied materials': 'AMAT',
    'lam research': 'LRCX',
    'salesforce': 'CRM',
    'kla': 'KLAC',
    'kla corporation': 'KLAC',
    'texas instruments': 'TXN',
    'shopify': 'SHOP',
    'arista networks': 'ANET',
    'analog devices': 'ADI',
    'qualcomm': 'QCOM',
    'palo alto networks': 'PANW',
    'palo alto': 'PANW',
    'accenture': 'ACN',
    'servicenow': 'NOW',
    'intuit': 'INTU',
    'sony': 'SONY',
    'arm holdings': 'ARM',
    'arm': 'ARM',
    'tokyo electron': 'TOELY',
    'adobe': 'ADBE',
    'corning': 'GLW',
    'crowdstrike': 'CRWD',
    'dell': 'DELL',
    'dell technologies': 'DELL',
    'western digital': 'WDC',
    'synopsys': 'SNPS',
    'cadence': 'CDNS',
    'cadence design': 'CDNS',
    'seagate': 'STX',
    'marvell': 'MRVL',
    'motorola solutions': 'MSI',
    'cloudflare': 'NET',
    'snowflake': 'SNOW',
    'fortinet': 'FTNT',
    'autodesk': 'ADSK',
    'te connectivity': 'TEL',
    'infineon': 'IFNNY',
    'infosys': 'INFY',
    'nxp': 'NXPI',
    'nxp semiconductors': 'NXPI',
    'garmin': 'GRMN',
    'nokia': 'NOK',
    'ericsson': 'ERIC',
    'datadog': 'DDOG',
    'workday': 'WDAY',
    'roper technologies': 'ROP',
    'teradyne': 'TER',
    'xiaomi': 'XIACY',
    // Healthcare
    'eli lilly': 'LLY', 'lilly': 'LLY',
    'johnson & johnson': 'JNJ', 'j&j': 'JNJ',
    'abbvie': 'ABBV',
    'merck': 'MRK',
    'unitedhealth': 'UNH', 'united health': 'UNH',
    'amgen': 'AMGN',
    'abbott': 'ABT', 'abbott laboratories': 'ABT',
    'thermo fisher': 'TMO', 'thermo fisher scientific': 'TMO',
    'gilead': 'GILD', 'gilead sciences': 'GILD',
    'intuitive surgical': 'ISRG',
    'pfizer': 'PFE',
    'stryker': 'SYK',
    'danaher': 'DHR',
    'bristol-myers squibb': 'BMY', 'bristol myers squibb': 'BMY',
    'hca healthcare': 'HCA',
    'vertex pharmaceuticals': 'VRTX', 'vertex': 'VRTX',
    'mckesson': 'MCK',
    'boston scientific': 'BSX',
    'cvs health': 'CVS', 'cvs': 'CVS',
    'regeneron': 'REGN',
    'cigna': 'CI',
    'cencora': 'COR',
    'elevance health': 'ELV',
    'becton dickinson': 'BDX',
    'zoetis': 'ZTS',
    'cardinal health': 'CAH',
    'idexx': 'IDXX', 'idexx laboratories': 'IDXX',
    'edwards lifesciences': 'EW',
    'resmed': 'RMD',
    'ge healthcare': 'GEHC',
    'agilent': 'A', 'agilent technologies': 'A',
    'veeva': 'VEEV', 'veeva systems': 'VEEV',
    'iqvia': 'IQV',
    'waters corporation': 'WAT',
    'natera': 'NTRA',
    'biogen': 'BIIB',
    'dexcom': 'DXCM',
    'royalty pharma': 'RPRX',
    'alnylam': 'ALNY',
    'beone medicines': 'ONC', 'beigene': 'ONC',
    'insmed': 'INSM',
    'roche': 'RHHBY',
    'novartis': 'NVS',
    'astrazeneca': 'AZN',
    'novo nordisk': 'NVO',
    'medtronic': 'MDT',
    'essilor': 'ESLOY', 'essilorluxottica': 'ESLOY',
    'gsk': 'GSK',
    'sanofi': 'SNY',
    'takeda': 'TAK',
    'argenx': 'ARGX',
    'csl limited': 'CSLLY', 'csl': 'CSLLY',
    'haleon': 'HLN',
    'teva': 'TEVA',
    'philips': 'PHG',
    'biontech': 'BNTX',
    'bayer': 'BAYRY',
    'merck kgaa': 'MKKGY',
    'siemens healthineers': 'SMMNY',
    'fresenius': 'FSNUY',
    'daiichi sankyo': 'DSNKY',
    'otsuka': 'OTSKY',
    'lonza': 'LZAGY',
    'galderma': 'GALDY',
    'astellas': 'ALPMY', 'astellas pharma': 'ALPMY',
    'sandoz': 'SDZNY',
    // Ambiguous tickers that need explicit aliases
    'gap': 'GPS', 'gap inc': 'GPS', 'the gap': 'GPS',
    'office depot': 'ODP', 'odp corporation': 'ODP', 'officemax': 'ODP',
    'berkshire hathaway': 'BRK.B', 'berkshire': 'BRK.B',
    'paramount': 'PARA', 'paramount global': 'PARA', 'cbs': 'PARA', 'viacom': 'PARA',
    'interpublic': 'IPG', 'interpublic group': 'IPG',
    'dun bradstreet': 'DNB', 'dun & bradstreet': 'DNB',
    "denny's": 'DENN', 'dennys': 'DENN',
    'overstock': 'OSTK', 'overstock.com': 'OSTK',
    'olympic steel': 'ZEUS',
    'haynes international': 'HAYN',
    'healthpeak': 'DOC', // renamed to Healthpeak Properties, ticker changed to DOC
    'ncr': 'VYX', // NCR split into NCR Atleos (NATL) and NCR Voyix (VYX)
    'howard hughes': 'HHC',
    'six flags': 'FUN', // merged with Cedar Fair, now just FUN
    'seaworld': 'SEAS',
    'spartan nash': 'SPTN', 'spartannash': 'SPTN',
    'sjw group': 'SJW',
    'mrc global': 'MRC',
    'lions gate': 'LGF.A', 'lionsgate': 'LGF.A',
    'sunnova': 'NOVA',
    'nextera energy partners': 'NEP',
    'cresco labs': 'CCHWF',
    'dine brands': 'DIN', 'ihop': 'DIN', "applebee's": 'DIN',
    'comerica': 'CMA',
    'synovus': 'SNV',
    'mr cooper': 'COOP', 'mr. cooper': 'COOP',
    'ceridian': 'CDAY',
    'olin corporation': 'OLN', 'olin corp': 'OLN',
    'ubiquiti': 'UI',
    'block': 'XYZ', 'block inc': 'XYZ', 'square': 'XYZ',
    'coreweave': 'CRWV',
    'ciena': 'CIEN',
    'lumentum': 'LITE',
    'foxconn': 'HNHPF', 'hon hai': 'HNHPF',
    'saic': 'SAIC',
    'science applications': 'SAIC',
    'textron': 'TXT',
    'transdigm': 'TDG',
    'curtiss wright': 'CW',
    'curtiss-wright': 'CW',
    'heico': 'HEI',
    'kbr': 'KBR',
    'caci': 'CACI',
    'mantech': 'MANT',
    'bae': 'BAESY',
    'shell': 'SHEL',
    'bp': 'BP',
    'toyota': 'TM',
    'samsung': 'SSNLF',
    'volkswagen': 'VWAGY',
    'siemens': 'SIEGY',
    'airbus': 'EADSY',
    'rolls royce': 'RYCEY',
    'rolls-royce': 'RYCEY',
    'tsmc': 'TSM',
    'alibaba': 'BABA',
    'sony': 'SONY',
};

async function resolveTicker(input) {
    // Check alias map first
    const alias = TICKER_ALIASES[input.toLowerCase().trim()];
    if (alias) return alias;

    const res = await fetch(`https://finnhub.io/api/v1/search?q=${encodeURIComponent(input)}&token=${FINNHUB_KEY}`);
    if (!res.ok) throw new Error(`Finnhub search HTTP ${res.status}`);
    const json = await res.json();
    const results = json?.result || [];
    const match = results.find(r => r.type === 'Common Stock' && r.symbol && !r.symbol.includes('.'))
               || results.find(r => r.type === 'Common Stock' && r.symbol)
               || results.find(r => r.symbol);
    if (!match) throw new Error(`No ticker found for: ${input}`);
    return match.symbol;
}

// ── Smart cross-validation merge ─────────────────────────────────────────────
// Collects all values per field, rejects outliers, picks best estimate

function median(arr) {
    if (!arr.length) return null;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function rejectOutliers(values) {
    if (values.length <= 1) return values;
    const med = median(values);
    if (med === 0) return values;
    // Reject any value that is more than 10x away from the median
    return values.filter(v => Math.abs(v / med) < 10 && Math.abs(med / (v || 1)) < 10);
}

function bestFinancial(values) {
    // values is array of {val, source} objects
    const nums = values.map(v => v.val).filter(v => v !== null && !isNaN(v));
    if (!nums.length) return null;
    const clean = rejectOutliers(nums);
    if (!clean.length) return median(nums); // all outliers - use median of raw
    // Prefer EDGAR if it survived outlier rejection, else median of clean values
    const edgarVal = values.find(v => v.source === 'edgar' && clean.includes(v.val));
    if (edgarVal) return edgarVal.val;
    return Math.round(median(clean));
}

function bestEmps(values) {
    // values is array of {val, source} objects
    const nums = values.map(v => v.val).filter(v => v !== null && !isNaN(v) && v >= 100);
    if (!nums.length) return null;
    const clean = rejectOutliers(nums);
    if (!clean.length) return Math.round(median(nums));
    // Prefer Wikipedia (most up to date) > Finnhub > EDGAR > AV
    const priority = ['wikipedia', 'cmc', 'finnhub', 'edgar', 'alphavantage', 'fmp'];
    for (const src of priority) {
        const match = values.find(v => v.source === src && clean.includes(v.val));
        if (match) return match.val;
    }
    return Math.round(median(clean));
}

function detectOneTimeItem(profit, ebitda) {
    // If net income is > 3x EBITDA (in absolute terms), it likely contains a one-time item
    // In that case, flag it so the caller can decide what to show
    if (profit === null || ebitda === null || ebitda === 0) return false;
    return Math.abs(profit) > Math.abs(ebitda) * 3;
}

function smartMerge(results) {
    // Gather all values per field with source tags
    const nameVals   = results.filter(r => r.name).map(r => r.name);
    const logoVals   = results.filter(r => r.logo).map(r => r.logo);
    const empsVals   = results.filter(r => r.emps).map(r => ({ val: r.emps,   source: r.source }));
    const profitVals = results.filter(r => r.profit !== null && r.profit !== undefined)
                              .map(r => ({ val: r.profit, source: r.source }));
    const ebitdaVals = results.filter(r => r.ebitda !== null && r.ebitda !== undefined)
                              .map(r => ({ val: r.ebitda, source: r.source }));

    const emps   = bestEmps(empsVals);
    let profit   = bestFinancial(profitVals);
    let ebitda   = bestFinancial(ebitdaVals);

    // If profit looks like it contains a one-time item vs ebitda, note it
    // and use an ebitda-derived estimate as a cross-check
    const hasOneTimeItem = detectOneTimeItem(profit, ebitda);
    if (hasOneTimeItem && ebitda !== null) {
        // Don't discard profit - but flag it in the response so the UI can handle it
        profit = profit; // keep as-is, flagged below
    }

    // If ebitda missing but profit exists, estimate it
    if (ebitda === null && profit !== null) {
        ebitda = profit > 0 ? Math.round(profit * 1.3) : null;
    }

    return {
        name:          nameVals[0] || null,
        logo:          logoVals[0] || null,
        emps,
        profit,
        ebitda,
        hasOneTimeItem // flag for UI to optionally show a note
    };
}


module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { symbol: rawSymbol, resolve } = req.query;
    if (!rawSymbol) return res.status(400).json({ error: 'Missing symbol parameter' });

    let symbol = rawSymbol.toUpperCase().trim();

    if (resolve === '1') {
        try { symbol = await resolveTicker(rawSymbol.trim()); }
        catch(e) { return res.status(404).json({ error: `Could not resolve: ${rawSymbol}` }); }
    }

    const errors = [];

    // Round 1: EDGAR + FMP + Finnhub in parallel
    const [edgarR, fmpR, finnhubR] = await Promise.allSettled([
        fetchFromEDGAR(symbol),
        fetchFromFMP(symbol),
        fetchFromFinnhub(symbol),
    ]);

    const round1 = [];
    if (edgarR.status   === 'fulfilled') round1.push(edgarR.value);
    else errors.push('EDGAR: ' + edgarR.reason.message);
    if (fmpR.status     === 'fulfilled') round1.push(fmpR.value);
    else errors.push('FMP: ' + fmpR.reason.message);
    if (finnhubR.status === 'fulfilled') round1.push(finnhubR.value);
    else errors.push('Finnhub: ' + finnhubR.reason.message);

    const merged = smartMerge(round1);

    // Only call AV if we're still missing employee count (preserve 25/day limit)
    if (merged.name && !merged.emps) {
        try {
            const avResult = await fetchFromAlphaVantage(symbol);
            round1.push(avResult);
            const remerged = smartMerge(round1);
            Object.assign(merged, remerged);
        } catch(e) {
            errors.push('AV: ' + e.message);
        }
    }

    // Try Wikipedia first (fast, reliable for large public companies)
    if (merged.emps == null || merged.emps === 0) {
        try {
            // Pass both the known title (if any) AND the raw Finnhub name so
            // fetchEmployeeCountFromWikipedia can try multiple strategies
            const wikiTitle = WIKI_TITLE_MAP[symbol] || null;
            const finnhubName = (merged.name || '')
                .replace(/\s*\/[A-Z]{2,}\/\s*$/, '')  // strip /DE/ etc
                .trim();
            const wikiEmps = await fetchEmployeeCountFromWikipedia(finnhubName, wikiTitle);
            if (wikiEmps) merged.emps = wikiEmps;
        } catch(e) {
            errors.push('Wikipedia: ' + e.message);
        }
    }

    // Last resort: parse actual 10-K document text (slow but comprehensive)
    if (!merged.emps) {
        try {
            const tickerRes2 = await fetch('https://www.sec.gov/files/company_tickers.json', {
                headers: { 'User-Agent': 'YourFairShare admin@yourfairshare.com' }
            });
            if (tickerRes2.ok) {
                const tickers2 = await tickerRes2.json();
                let cik10k = null;
                for (const entry of Object.values(tickers2)) {
                    if (entry.ticker && entry.ticker.toUpperCase() === symbol.toUpperCase()) {
                        cik10k = String(entry.cik_str).padStart(10, '0');
                        break;
                    }
                }
                if (cik10k) {
                    const tenKEmps = await fetchEmployeeCountFrom10K(cik10k);
                    if (tenKEmps) merged.emps = tenKEmps;
                }
            }
        } catch(e) {
            errors.push('10-K text: ' + e.message);
        }
    }

    // Final fallback: companiesmarketcap.com — only called when everything else failed
    // Live web scrape, only fires when emps is still null.
    if (!merged.emps && merged.name) {
        try {
            const cmcEmps = await fetchEmployeeCountFromCMC(symbol, merged.name);
            if (cmcEmps) merged.emps = cmcEmps;
        } catch(e) {
            errors.push('CMC: ' + e.message);
        }
    }

    if (!merged.name) {
        return res.status(404).json({ error: 'Could not find company data', details: errors });
    }

    // If still no employee count, return what we have and let the client use fallback DB
    return res.status(200).json({ ...merged, resolvedSymbol: symbol, _errors: errors });
};
