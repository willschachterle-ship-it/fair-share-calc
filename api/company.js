const FINNHUB_KEY = 'd6j3rvhr01ql467i5e0gd6j3rvhr01ql467i5e10';
const FMP_KEY = '3gPWbjHBHWaeswUkIvjGjN6Ei3SxifLL';
const AV_KEY = '17JNK5S9J44QAXTV';

// Alpha Vantage - free, 25 calls/day, no CORS, employee count + financials
async function fetchFromAlphaVantage(symbol) {
    const [overviewRes, incomeRes] = await Promise.all([
        fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${AV_KEY}`),
        fetch(`https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${AV_KEY}`)
    ]);
    if (!overviewRes.ok) throw new Error('AV overview HTTP ' + overviewRes.status);
    if (!incomeRes.ok) throw new Error('AV income HTTP ' + incomeRes.status);

    const overview = await overviewRes.json();
    const income = await incomeRes.json();

    if (!overview || !overview.Name) throw new Error('AV: no overview data');
    if (overview.Note) throw new Error('AV: rate limit hit');
    if (overview.Information) throw new Error('AV: API limit - ' + overview.Information);

    const emps = parseInt(overview.FullTimeEmployees);
    if (!emps || emps === 0) throw new Error('AV: employee count missing');

    // Get most recent annual income statement
    const annualReports = income.annualReports || [];
    const latest = annualReports[0] || {};
    const profit = parseInt(latest.netIncome) || 0;
    const ebitda = parseInt(latest.ebitda) || (profit > 0 ? profit * 1.3 : 0);

    const logo = `https://logo.clearbit.com/${symbol.toLowerCase()}.com`;

    return {
        name: overview.Name,
        emps,
        profit,
        ebitda,
        logo,
        source: 'alphavantage'
    };
}

// SEC EDGAR - free, official, no key needed
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
    if (!emps || emps === 0) throw new Error('EDGAR: employee count missing');

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
    if (!ebitda) ebitda = profit > 0 ? profit * 1.3 : 0;

    return {
        name: companyName || symbol,
        emps: parseInt(emps),
        profit, ebitda,
        logo: `https://logo.clearbit.com/${symbol.toLowerCase()}.com`,
        source: 'edgar'
    };
}

// FMP
async function fetchFromFMP(symbol) {
    const profileRes = await fetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${FMP_KEY}`);
    if (!profileRes.ok) throw new Error(`FMP profile HTTP ${profileRes.status}`);
    const profileArr = await profileRes.json();
    if (!profileArr?.[0]?.companyName) throw new Error('FMP: no profile');
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

// Finnhub
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

// Ticker resolver
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

    const errors = [];

    // 1. SEC EDGAR (free, official SEC data)
    try { return res.status(200).json({ ...await fetchFromEDGAR(symbol), resolvedSymbol: symbol }); }
    catch(e) { errors.push('EDGAR: ' + e.message); }

    // 2. FMP
    try { return res.status(200).json({ ...await fetchFromFMP(symbol), resolvedSymbol: symbol }); }
    catch(e) { errors.push('FMP: ' + e.message); }

    // 3. Finnhub
    try { return res.status(200).json({ ...await fetchFromFinnhub(symbol), resolvedSymbol: symbol }); }
    catch(e) { errors.push('Finnhub: ' + e.message); }

    // 4. Alpha Vantage (25 calls/day limit - last resort)
    try { return res.status(200).json({ ...await fetchFromAlphaVantage(symbol), resolvedSymbol: symbol }); }
    catch(e) { errors.push('AV: ' + e.message); }

    return res.status(404).json({ error: 'Could not find company data', details: errors });
};
