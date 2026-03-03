// Vercel serverless function — runs server-side, no CORS issues
// GET /api/company?symbol=CVS
// GET /api/company?symbol=Lyft&resolve=1

const FINNHUB_KEY = 'd6j3rvhr01ql467i5e0gd6j3rvhr01ql467i5e10';
const FMP_KEY = '3gPWbjHBHWaeswUkIvjGjN6Ei3SxifLL';

// ── SEC EDGAR: free, no key, covers all US public companies ─────────────────
// Gets employee count + financials from official SEC filings
async function fetchFromEDGAR(symbol) {
    // Step 1: resolve ticker to CIK number
    const tickerRes = await fetch('https://www.sec.gov/files/company_tickers.json', {
        headers: { 'User-Agent': 'YourFairShare contact@example.com' }
    });
    if (!tickerRes.ok) throw new Error('EDGAR tickers HTTP ' + tickerRes.status);
    const tickers = await tickerRes.json();

    let cik = null;
    let companyName = null;
    for (const entry of Object.values(tickers)) {
        if (entry.ticker && entry.ticker.toUpperCase() === symbol.toUpperCase()) {
            cik = String(entry.cik_str).padStart(10, '0');
            companyName = entry.title;
            break;
        }
    }
    if (!cik) throw new Error('EDGAR: ticker not found');

    // Step 2: get company facts (financials + employee count)
    const factsRes = await fetch(`https://data.sec.gov/api/xbrl/companyfacts/CIK${cik}.json`, {
        headers: { 'User-Agent': 'YourFairShare contact@example.com' }
    });
    if (!factsRes.ok) throw new Error('EDGAR facts HTTP ' + factsRes.status);
    const facts = await factsRes.json();

    const us_gaap = facts.facts['us-gaap'] || {};
    const dei = facts.facts['dei'] || {};

    // Employee count — from DEI (Document and Entity Information)
    const empFact = dei['EntityNumberOfEmployees'];
    let emps = 0;
    if (empFact && empFact.units && empFact.units['pure']) {
        const sorted = empFact.units['pure']
            .filter(e => e.form === '10-K')
            .sort((a, b) => b.end.localeCompare(a.end));
        if (sorted.length > 0) emps = sorted[0].val;
    }
    if (!emps || emps === 0) throw new Error('EDGAR: employee count missing');

    // Net income — NetIncomeLoss
    let profit = 0;
    const niFactAnnual = us_gaap['NetIncomeLoss'];
    if (niFactAnnual && niFactAnnual.units && niFactAnnual.units['USD']) {
        const sorted = niFactAnnual.units['USD']
            .filter(e => e.form === '10-K' && e.start)
            .sort((a, b) => b.end.localeCompare(a.end));
        if (sorted.length > 0) profit = sorted[0].val;
    }

    // EBITDA proxy: OperatingIncomeLoss + DepreciationDepletionAndAmortization
    let ebitda = 0;
    const opIncome = us_gaap['OperatingIncomeLoss'];
    const dna = us_gaap['DepreciationDepletionAndAmortization']
             || us_gaap['DepreciationAndAmortization'];
    if (opIncome && opIncome.units && opIncome.units['USD']) {
        const sorted = opIncome.units['USD']
            .filter(e => e.form === '10-K' && e.start)
            .sort((a, b) => b.end.localeCompare(a.end));
        if (sorted.length > 0) {
            let dnaVal = 0;
            if (dna && dna.units && dna.units['USD']) {
                const dnaSorted = dna.units['USD']
                    .filter(e => e.form === '10-K' && e.start)
                    .sort((a, b) => b.end.localeCompare(a.end));
                if (dnaSorted.length > 0) dnaVal = dnaSorted[0].val;
            }
            ebitda = sorted[0].val + dnaVal;
        }
    }
    if (!ebitda && profit > 0) ebitda = profit * 1.3;

    // Logo via Clearbit
    const logo = `https://logo.clearbit.com/${symbol.toLowerCase()}.com`;

    return {
        name: companyName || symbol,
        emps: parseInt(emps),
        profit,
        ebitda,
        logo,
        source: 'edgar'
    };
}

// ── Yahoo Finance ────────────────────────────────────────────────────────────
async function fetchFromYahoo(symbol) {
    const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=assetProfile,defaultKeyStatistics,financialData`;
    const res = await fetch(url, {
        headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
    });
    if (!res.ok) throw new Error(`Yahoo HTTP ${res.status}`);
    const json = await res.json();
    const result = json?.quoteSummary?.result?.[0];
    if (!result) throw new Error('Yahoo: no data');
    const profile = result.assetProfile || {};
    const keyStats = result.defaultKeyStatistics || {};
    const financialData = result.financialData || {};
    const emps = profile.fullTimeEmployees;
    if (!emps) throw new Error('Yahoo: employee count missing');
    const profit = financialData.netIncomeToCommon?.raw || keyStats.netIncomeToCommon?.raw || 0;
    const ebitda = financialData.ebitda?.raw || (profit > 0 ? profit * 1.3 : 0);
    const website = profile.website || '';
    let logo = '';
    try { logo = website ? `https://logo.clearbit.com/${new URL(website).hostname}` : ''; } catch(e) {}
    return {
        name: profile.longName || profile.shortName || symbol,
        emps: parseInt(emps),
        profit,
        ebitda,
        logo,
        source: 'yahoo'
    };
}

// ── FMP ──────────────────────────────────────────────────────────────────────
async function fetchFromFMP(symbol) {
    const profileRes = await fetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${FMP_KEY}`);
    if (!profileRes.ok) throw new Error(`FMP profile HTTP ${profileRes.status}`);
    const profileArr = await profileRes.json();
    if (!profileArr?.[0]?.companyName) throw new Error('FMP: no profile');
    if (profileArr['Error Message']) throw new Error('FMP: ' + profileArr['Error Message']);
    const p = profileArr[0];
    const emps = p.fullTimeEmployees;
    if (!emps || emps === 0) throw new Error('FMP: employee count missing');
    const incomeRes = await fetch(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=1&apikey=${FMP_KEY}`);
    if (!incomeRes.ok) throw new Error(`FMP income HTTP ${incomeRes.status}`);
    const incomeArr = await incomeRes.json();
    const inc = incomeArr?.[0] || {};
    const profit = inc.netIncome || 0;
    const ebitda = inc.ebitda || (profit > 0 ? profit * 1.3 : 0);
    return { name: p.companyName, emps: parseInt(emps), profit, ebitda, logo: p.image || '', source: 'fmp' };
}

// ── Finnhub ──────────────────────────────────────────────────────────────────
async function fetchFromFinnhub(symbol) {
    const [profileRes, finRes] = await Promise.all([
        fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_KEY}`),
        fetch(`https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_KEY}`)
    ]);
    const p = await profileRes.json();
    const f = await finRes.json();
    if (!p?.name) throw new Error('Finnhub: no profile');
    const emps = p.employeeTotal;
    if (!emps || emps === 0) throw new Error('Finnhub: employee count missing');
    const m = f.metric || {};
    const profit = (m.netIncomePerShareAnnual * m.sharesOutstanding) || 0;
    const ebitda = (m.ebitdaPerShareAnnual * m.sharesOutstanding) || (profit > 0 ? profit * 1.3 : 0);
    let logo = p.logo || '';
    if (!logo && p.weburl) try { logo = `https://logo.clearbit.com/${new URL(p.weburl).hostname}`; } catch(e) {}
    return { name: p.name, emps: parseInt(emps), profit, ebitda, logo, source: 'finnhub' };
}

// ── Ticker resolver ──────────────────────────────────────────────────────────
async function resolveTicker(input) {
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

// ── Main handler ─────────────────────────────────────────────────────────────
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { symbol: rawSymbol, resolve } = req.query;
    if (!rawSymbol) return res.status(400).json({ error: 'Missing symbol parameter' });

    let symbol = rawSymbol.toUpperCase().trim();

    if (resolve === '1') {
        try { symbol = await resolveTicker(rawSymbol.trim()); }
        catch(e) { return res.status(404).json({ error: `Could not resolve ticker for: ${rawSymbol}` }); }
    }

    const errors = [];

    // 1. Yahoo
    try { return res.status(200).json({ ...await fetchFromYahoo(symbol), resolvedSymbol: symbol }); }
    catch(e) { errors.push('Yahoo: ' + e.message); }

    // 2. SEC EDGAR (free, no limits, covers all US public companies)
    try { return res.status(200).json({ ...await fetchFromEDGAR(symbol), resolvedSymbol: symbol }); }
    catch(e) { errors.push('EDGAR: ' + e.message); }

    // 3. FMP
    try { return res.status(200).json({ ...await fetchFromFMP(symbol), resolvedSymbol: symbol }); }
    catch(e) { errors.push('FMP: ' + e.message); }

    // 4. Finnhub
    try { return res.status(200).json({ ...await fetchFromFinnhub(symbol), resolvedSymbol: symbol }); }
    catch(e) { errors.push('Finnhub: ' + e.message); }

    return res.status(404).json({ error: 'Could not find company data', details: errors });
}
