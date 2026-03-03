// Vercel serverless function — runs on the server, no CORS issues
// Endpoint: GET /api/company?symbol=LYFT

const FINNHUB_KEY = 'd6j3rvhr01ql467i5e0gd6j3rvhr01ql467i5e10';
const FMP_KEY = '3gPWbjHBHWaeswUkIvjGjN6Ei3SxifLL';

async function fetchFromYahoo(symbol) {
    const url = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=assetProfile,defaultKeyStatistics,financialData`;
    const res = await fetch(url, {
        headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
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

    const profit = financialData.netIncomeToCommon?.raw
        || keyStats.netIncomeToCommon?.raw || 0;
    const ebitda = financialData.ebitda?.raw
        || (profit > 0 ? profit * 1.3 : 0);

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

async function fetchFromFMP(symbol) {
    const profileRes = await fetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${FMP_KEY}`);
    if (!profileRes.ok) throw new Error(`FMP profile HTTP ${profileRes.status}`);
    const profileArr = await profileRes.json();
    if (!profileArr || profileArr.length === 0 || !profileArr[0]?.companyName) throw new Error('FMP: no profile data');
    if (profileArr['Error Message']) throw new Error(`FMP: ${profileArr['Error Message']}`);
    const p = profileArr[0];
    const emps = p.fullTimeEmployees;
    if (!emps || emps === 0) throw new Error('FMP: employee count missing');

    const incomeRes = await fetch(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=1&apikey=${FMP_KEY}`);
    if (!incomeRes.ok) throw new Error(`FMP income HTTP ${incomeRes.status}`);
    const incomeArr = await incomeRes.json();
    const inc = incomeArr?.[0] || {};

    const profit = inc.netIncome || 0;
    const ebitda = inc.ebitda || (profit > 0 ? profit * 1.3 : 0);

    return {
        name: p.companyName,
        emps: parseInt(emps),
        profit,
        ebitda,
        logo: p.image || '',
        source: 'fmp'
    };
}

async function fetchFromFinnhub(symbol) {
    const [profileRes, finRes] = await Promise.all([
        fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_KEY}`),
        fetch(`https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_KEY}`)
    ]);
    const profileData = await profileRes.json();
    const financialsData = await finRes.json();

    if (!profileData?.name) throw new Error('Finnhub: no profile');
    const emps = profileData.employeeTotal;
    if (!emps || emps === 0) throw new Error('Finnhub: employee count missing');

    const metrics = financialsData.metric || {};
    const netIncome = (metrics.netIncomePerShareAnnual * metrics.sharesOutstanding) || 0;
    const ebitda = (metrics.ebitdaPerShareAnnual * metrics.sharesOutstanding) || (netIncome > 0 ? netIncome * 1.3 : 0);

    let logo = profileData.logo || '';
    if (!logo && profileData.weburl) {
        try { logo = `https://logo.clearbit.com/${new URL(profileData.weburl).hostname}`; } catch(e) {}
    }

    return {
        name: profileData.name,
        emps: parseInt(emps),
        profit: netIncome,
        ebitda,
        logo,
        source: 'finnhub'
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

export default async function handler(req, res) {
    // Allow CORS from your own site
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { symbol: rawSymbol, resolve } = req.query;
    if (!rawSymbol) {
        return res.status(400).json({ error: 'Missing symbol parameter' });
    }

    let symbol = rawSymbol.toUpperCase().trim();

    // If resolve=1, treat input as a company name and look up the ticker first
    if (resolve === '1') {
        try {
            symbol = await resolveTicker(rawSymbol.trim());
        } catch(e) {
            return res.status(404).json({ error: `Could not resolve ticker for: ${rawSymbol}` });
        }
    }

    const errors = [];

    // Try Yahoo first
    try {
        const data = await fetchFromYahoo(symbol);
        return res.status(200).json({ ...data, resolvedSymbol: symbol });
    } catch(e) { errors.push(`Yahoo: ${e.message}`); }

    // Try FMP
    try {
        const data = await fetchFromFMP(symbol);
        return res.status(200).json({ ...data, resolvedSymbol: symbol });
    } catch(e) { errors.push(`FMP: ${e.message}`); }

    // Try Finnhub
    try {
        const data = await fetchFromFinnhub(symbol);
        return res.status(200).json({ ...data, resolvedSymbol: symbol });
    } catch(e) { errors.push(`Finnhub: ${e.message}`); }

    return res.status(404).json({ error: 'Could not find company data', details: errors });
}
