const FINNHUB_KEY = 'd6j3rvhr01ql467i5e0gd6j3rvhr01ql467i5e10';
const FMP_KEY = '3gPWbjHBHWaeswUkIvjGjN6Ei3SxifLL';
const AV_KEY = '17JNK5S9J44QAXTV';

// Each source returns whatever it can - no throwing on missing fields
// The orchestrator merges results to fill gaps

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

    // Employee count
    let emps = 0;
    for (const field of ['EntityNumberOfEmployees', 'NumberOfEmployees']) {
        const empFact = dei[field];
        if (empFact && empFact.units && empFact.units['pure']) {
            const sorted = empFact.units['pure']
                .filter(e => e.form === '10-K' || e.form === '10-K/A')
                .sort((a, b) => b.end.localeCompare(a.end));
            if (sorted.length > 0) { emps = sorted[0].val; break; }
        }
    }

    // Net income
    let profit = 0;
    for (const field of ['NetIncomeLoss', 'NetIncome', 'ProfitLoss']) {
        const fact = us_gaap[field];
        if (fact && fact.units && fact.units['USD']) {
            const sorted = fact.units['USD']
                .filter(e => (e.form === '10-K' || e.form === '10-K/A') && e.start)
                .sort((a, b) => b.end.localeCompare(a.end));
            if (sorted.length > 0) { profit = sorted[0].val; break; }
        }
    }

    // EBITDA
    let ebitda = 0;
    const opFact = us_gaap['OperatingIncomeLoss'];
    if (opFact && opFact.units && opFact.units['USD']) {
        const sorted = opFact.units['USD']
            .filter(e => (e.form === '10-K' || e.form === '10-K/A') && e.start)
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

    return {
        name: companyName || null,
        emps: emps || null,
        profit: profit || null,
        ebitda: ebitda || null,
        logo: null,
        source: 'edgar'
    };
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
        profit,
        ebitda,
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
    const profit = (m.netIncomePerShareAnnual * m.sharesOutstanding) || null;
    const ebitda = (m.ebitdaPerShareAnnual * m.sharesOutstanding) || null;
    let logo = p.logo || null;
    if (!logo && p.weburl) try { logo = `https://logo.clearbit.com/${new URL(p.weburl).hostname}`; } catch(e) {}
    return {
        name: p.name || null,
        emps: p.employeeTotal || null,
        profit,
        ebitda,
        logo,
        source: 'finnhub'
    };
}

async function fetchFromAlphaVantage(symbol) {
    const [overviewRes, incomeRes] = await Promise.all([
        fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${AV_KEY}`),
        fetch(`https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${AV_KEY}`)
    ]);
    if (!overviewRes.ok) throw new Error('AV overview HTTP ' + overviewRes.status);
    const overview = await overviewRes.json();
    if (!overview || !overview.Name) throw new Error('AV: no data');
    if (overview.Note || overview.Information) throw new Error('AV: rate limited');

    const emps = overview.FullTimeEmployees && overview.FullTimeEmployees !== 'None'
        ? parseInt(overview.FullTimeEmployees) : null;

    let profit = null, ebitda = null;
    if (incomeRes.ok) {
        const income = await incomeRes.json();
        const latest = (income.annualReports || [])[0] || {};
        profit = latest.netIncome && latest.netIncome !== 'None' ? parseInt(latest.netIncome) : null;
        ebitda = latest.ebitda && latest.ebitda !== 'None' ? parseInt(latest.ebitda) : null;
    }

    return {
        name: overview.Name || null,
        emps,
        profit,
        ebitda,
        logo: null,
        source: 'alphavantage'
    };
}

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

// Merge results from multiple sources, preferring earlier sources for each field
function mergeResults(results) {
    const merged = { name: null, emps: null, profit: null, ebitda: null, logo: null };
    for (const r of results) {
        if (!merged.name && r.name) merged.name = r.name;
        if (!merged.emps && r.emps) merged.emps = r.emps;
        if (merged.profit === null && r.profit !== null) merged.profit = r.profit;
        if (!merged.ebitda && r.ebitda) merged.ebitda = r.ebitda;
        if (!merged.logo && r.logo) merged.logo = r.logo;
    }
    // Fill in ebitda if still missing
    if (!merged.ebitda && merged.profit > 0) merged.ebitda = Math.round(merged.profit * 1.3);
    return merged;
}

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { symbol: rawSymbol, resolve } = req.query;
    if (!rawSymbol) return res.status(400).json({ error: 'Missing symbol parameter' });

    let symbol = rawSymbol.toUpperCase().trim();

    if (resolve === '1') {
        try { symbol = await resolveTicker(rawSymbol.trim()); }
        catch(e) { return res.status(404).json({ error: `Could not resolve ticker for: ${rawSymbol}` }); }
    }

    // Collect results from all sources in parallel (except AV which we save for last)
    const sourceResults = [];
    const errors = [];

    const [edgarResult, fmpResult, finnhubResult] = await Promise.allSettled([
        fetchFromEDGAR(symbol),
        fetchFromFMP(symbol),
        fetchFromFinnhub(symbol),
    ]);

    if (edgarResult.status === 'fulfilled') sourceResults.push(edgarResult.value);
    else errors.push('EDGAR: ' + edgarResult.reason.message);

    if (fmpResult.status === 'fulfilled') sourceResults.push(fmpResult.value);
    else errors.push('FMP: ' + fmpResult.reason.message);

    if (finnhubResult.status === 'fulfilled') sourceResults.push(finnhubResult.value);
    else errors.push('Finnhub: ' + finnhubResult.reason.message);

    // Check if we have enough data without calling AV
    const merged = mergeResults(sourceResults);
    if (merged.name && merged.emps) {
        return res.status(200).json({ ...merged, resolvedSymbol: symbol });
    }

    // Fall back to Alpha Vantage to fill remaining gaps
    try {
        const avResult = await fetchFromAlphaVantage(symbol);
        sourceResults.push(avResult);
        const finalMerge = mergeResults(sourceResults);
        if (finalMerge.name && finalMerge.emps) {
            return res.status(200).json({ ...finalMerge, resolvedSymbol: symbol });
        }
        errors.push('AV returned: ' + JSON.stringify(avResult));
    } catch(e) {
        errors.push('AV: ' + e.message);
    }

    return res.status(404).json({ error: 'Could not find company data', details: errors });
};
