const FINNHUB_KEY = 'd6j3rvhr01ql467i5e0gd6j3rvhr01ql467i5e10';
const FMP_KEY = '3gPWbjHBHWaeswUkIvjGjN6Ei3SxifLL';
const AV_KEY = '17JNK5S9J44QAXTV';

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

    // Net income - exclude future periods (end date must be in the past)
    const today = new Date().toISOString().split('T')[0];
    let profit = null;
    for (const field of ['NetIncomeLoss', 'NetIncome', 'ProfitLoss']) {
        const fact = us_gaap[field];
        if (fact && fact.units && fact.units['USD']) {
            const sorted = fact.units['USD']
                .filter(e => (e.form === '10-K' || e.form === '10-K/A') && e.start && e.end <= today)
                .sort((a, b) => b.end.localeCompare(a.end));
            if (sorted.length > 0) { profit = sorted[0].val; break; }
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
    const profit = (m.netIncomePerShareAnnual && m.sharesOutstanding)
        ? Math.round(m.netIncomePerShareAnnual * m.sharesOutstanding) : null;
    const ebitda = (m.ebitdaPerShareAnnual && m.sharesOutstanding)
        ? Math.round(m.ebitdaPerShareAnnual * m.sharesOutstanding) : null;
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
    let profit = null, ebitda = parseAV(overview.EBITDA);

    if (incomeRes.ok) {
        const income = await incomeRes.json();
        const latest = (income.annualReports || [])[0] || {};
        profit = parseAV(latest.netIncome);
        if (!ebitda) ebitda = parseAV(latest.ebitda);
    }

    return { name: overview.Name || null, emps, profit, ebitda, logo: null, source: 'alphavantage' };
}


async function fetchEmployeeCountFromWikipedia(companyName) {
    // Step 1: search for the page - try clean name first, then full name
    const cleanName = companyName.replace(/\s+(Inc\.?|Corp\.?|Ltd\.?|LLC|Co\.?|Holdings?|Group|Corporation|Limited)\s*$/i, '').trim();
    let pageTitle = null;
    for (const query of [cleanName, companyName]) {
        const searchRes = await fetch(
            'https://en.wikipedia.org/api/rest_v1/page/search/title?q=' +
            encodeURIComponent(query) + '&limit=3',
            { headers: { 'User-Agent': 'YourFairShare/1.0 (admin@yourfairshare.com)' } }
        );
        if (!searchRes.ok) continue;
        const searchJson = await searchRes.json();
        const pages = searchJson.pages || [];
        if (pages.length) { pageTitle = pages[0].title; break; }
    }
    if (!pageTitle) throw new Error('Wikipedia: no results for ' + companyName);

    // Step 2: get raw wikitext via REST API
    const pageRes = await fetch(
        'https://en.wikipedia.org/api/rest_v1/page/wikitext/' + encodeURIComponent(pageTitle),
        { headers: { 'User-Agent': 'YourFairShare/1.0 (admin@yourfairshare.com)' } }
    );
    if (!pageRes.ok) throw new Error('Wikipedia wikitext HTTP ' + pageRes.status);
    const wikitext = await pageRes.text();

    // Step 3: find employee count line in infobox
    const lines = wikitext.split('\n');
    const empLine = lines.find(function(l) {
        return l.indexOf('num_employees') >= 0 || l.indexOf('number_of_employees') >= 0;
    });

    if (empLine) {
        // Handle {{circa|300,000}}, {{formatnum:300000}}, or plain 300,000
        const templateMatch = empLine.match(/{{[^|]+\|([\d,]+)}}/);
        const plainMatch = empLine.match(/([\d]{2,}[,\d]*)/);
        const raw = templateMatch ? templateMatch[1] : (plainMatch ? plainMatch[1] : null);
        if (raw) {
            const num = parseInt(raw.replace(/,/g, ''), 10);
            if (!isNaN(num) && num > 100) return num;
        }
    }
    throw new Error('Wikipedia: employee count not found in infobox for ' + pageTitle);
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

// Sanity check: profit/employee > $2M or < -$1M is almost certainly bad data
function isSaneProfit(profit, emps) {
    if (!emps || profit === null) return false;
    const perEmp = profit / emps;
    return perEmp < 2000000 && perEmp > -1000000;
}

// Sanity check: employee count must be >= 100 for a public company
// We use 100 as minimum but flag < 1000 as lower confidence
function isSaneEmps(emps) {
    return emps && emps >= 100;
}
function isHighConfidenceEmps(emps) {
    return emps && emps >= 1000;
}

// Merge sources - for each field, use first non-null value across sources in priority order
function merge(results) {
    const out = { name: null, emps: null, profit: null, ebitda: null, logo: null };
    for (const r of results) {
        if (!out.name  && r.name)  out.name  = r.name;
        // Prefer high-confidence emps (>=1000), accept lower if nothing better
        if (!out.emps && isHighConfidenceEmps(r.emps)) out.emps = r.emps;
        else if (!out.emps && isSaneEmps(r.emps) && !results.some(s => isHighConfidenceEmps(s.emps))) out.emps = r.emps;
        if (out.logo === null && r.logo) out.logo = r.logo;
    }
    // For financials, pick first value that passes sanity check
    for (const r of results) {
        if (out.profit === null && r.profit !== null && isSaneProfit(r.profit, out.emps || r.emps)) {
            out.profit = r.profit;
        }
        if (out.ebitda === null && r.ebitda !== null && isSaneProfit(r.ebitda, out.emps || r.emps)) {
            out.ebitda = r.ebitda;
        }
    }
    // Last resort: use insane values if nothing sane found (better than nothing)
    for (const r of results) {
        if (!out.emps  && r.emps)   out.emps  = r.emps;
        if (out.profit === null && r.profit !== null) out.profit = r.profit;
        if (out.ebitda === null && r.ebitda !== null) out.ebitda = r.ebitda;
    }
    if (!out.ebitda && out.profit > 0) out.ebitda = Math.round(out.profit * 1.3);
    return out;
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

    const merged = merge(round1);

    // Only call AV if we're still missing employee count (preserve 25/day limit)
    if (merged.name && !merged.emps) {
        try {
            const avResult = await fetchFromAlphaVantage(symbol);
            round1.push(avResult);
            const remerged = merge(round1);
            Object.assign(merged, remerged);
        } catch(e) {
            errors.push('AV: ' + e.message);
        }
    }

    // Last resort: Wikipedia infobox scrape for employee count
    if (merged.name && !merged.emps) {
        try {
            const wikiEmps = await fetchEmployeeCountFromWikipedia(merged.name);
            if (wikiEmps) merged.emps = wikiEmps;
        } catch(e) {
            errors.push('Wikipedia: ' + e.message);
        }
    }

    if (!merged.name) {
        return res.status(404).json({ error: 'Could not find company data', details: errors });
    }

    // If we still have no employee count after all sources, fail clearly
    if (!merged.emps) {
        return res.status(404).json({ error: 'Could not find employee count for ' + symbol, details: errors });
    }

    return res.status(200).json({ ...merged, resolvedSymbol: symbol });
};
