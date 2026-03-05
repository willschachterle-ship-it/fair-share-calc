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
    // Try multiple name variations to find the Wikipedia page
    const cleanName = companyName
        .replace(/,?\s+(Inc\.?|Corp\.?|Ltd\.?|LLC|Co\.?|Holdings?|Group|Corporation|Limited|plc|Technologies)\s*$/i, '')
        .trim();
    const firstWord = cleanName.split(' ')[0];
    const candidates = [cleanName, companyName, firstWord + ' company', firstWord];

    let wikitext = null;
    let foundTitle = null;

    for (const query of candidates) {
        if (!query || query.length < 2) continue;
        try {
            // Use action API with explicit JSON accept header
            const searchUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' +
                encodeURIComponent(query) + '&limit=5&format=json';
            const searchRes = await fetch(searchUrl, {
                headers: { 'Accept': 'application/json', 'User-Agent': 'YourFairShare/1.0' }
            });
            if (!searchRes.ok) continue;
            const searchJson = await searchRes.json();
            // opensearch returns [query, [titles], [descriptions], [urls]]
            const titles = searchJson[1] || [];
            // Prefer exact clean name match, then partial, skip fantasy/disambiguation pages
            const blocklist = ['middle-earth', 'lord of the rings', 'disambiguation', 'film', 'novel', 'song'];
            const match = titles.find(t => t.toLowerCase() === cleanName.toLowerCase())
                || titles.find(t => t.toLowerCase().includes(cleanName.toLowerCase()))
                || titles.find(t => t.toLowerCase().includes(firstWord.toLowerCase()) && !blocklist.some(b => t.toLowerCase().includes(b)));
            if (!match) continue;

            // Fetch wikitext for matched page
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
            if (text) { wikitext = text; foundTitle = match; break; }
        } catch(e) { continue; }
    }

    if (!wikitext) throw new Error('Wikipedia: page not found for ' + companyName);

    // Find employee count line in infobox
    const lines = wikitext.split('\n');
    const empLine = lines.find(l =>
        l.indexOf('num_employees') >= 0 || l.indexOf('number_of_employees') >= 0
    );

    if (empLine) {
        const stripped = empLine.replace(/{{[^}]+}}/g, (match) => {
            const inner = match.match(/\|([\d,]+)/);
            return inner ? inner[1] : '';
        });
        const allNums = stripped.match(/[\d,]+/g) || [];
        const parsed = allNums.map(n => parseInt(n.replace(/,/g, ''), 10)).filter(n => !isNaN(n) && n > 100);
        if (parsed.length > 0) return Math.max(...parsed);
    }
    throw new Error('Wikipedia: employee count not found for ' + foundTitle);
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
    const priority = ['wikipedia', 'finnhub', 'edgar', 'alphavantage', 'fmp'];
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

    // Last resort: Wikipedia infobox scrape for employee count
    if (merged.name && !merged.emps) {
        try {
            // Strip legal suffixes for better Wikipedia search results
            const searchName = merged.name
                .replace(/,?\s+(Inc\.?|Corp\.?|Ltd\.?|LLC|Co\.?|Holdings?|Group|Corporation|Limited|plc)\.?\s*$/i, '')
                .trim();
            const wikiEmps = await fetchEmployeeCountFromWikipedia(searchName);
            if (wikiEmps) merged.emps = wikiEmps;
        } catch(e) {
            errors.push('Wikipedia: ' + e.message);
        }
    }

    if (!merged.name) {
        return res.status(404).json({ error: 'Could not find company data', details: errors });
    }

    // If still no employee count, return what we have and let the client use fallback DB
    return res.status(200).json({ ...merged, resolvedSymbol: symbol });
};
