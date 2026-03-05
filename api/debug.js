const FINNHUB_KEY = 'd6j3rvhr01ql467i5e0gd6j3rvhr01ql467i5e10';
const AV_KEY = '17JNK5S9J44QAXTV';

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const symbol = (req.query.symbol || 'CVS').toUpperCase();
    const out = { symbol };

    // Alpha Vantage
    try {
        const r = await fetch('https://www.alphavantage.co/query?function=OVERVIEW&symbol=' + symbol + '&apikey=' + AV_KEY);
        const j = await r.json();
        out.alphavantage = { Name: j.Name, FullTimeEmployees: j.FullTimeEmployees, FullTimeEmployeesRaw: j["FullTimeEmployees"], EBITDA: j.EBITDA, allKeys: Object.keys(j).filter(k => k.toLowerCase().includes("employ")), note: j.Note || j.Information || null };
    } catch(e) { out.alphavantage = { error: e.message }; }

    // Finnhub profile + metrics
    try {
        const [pr, fr] = await Promise.all([
            fetch('https://finnhub.io/api/v1/stock/profile2?symbol=' + symbol + '&token=' + FINNHUB_KEY),
            fetch('https://finnhub.io/api/v1/stock/metric?symbol=' + symbol + '&metric=all&token=' + FINNHUB_KEY)
        ]);
        const p = await pr.json();
        const f = await fr.json();
        const m = f.metric || {};
        out.finnhub = {
            name: p.name,
            employeeTotal: p.employeeTotal,
            computedProfit: (m.netIncomePerShareAnnual && m.sharesOutstanding) ? Math.round(m.netIncomePerShareAnnual * m.sharesOutstanding) : null,
            computedEbitda: (m.ebitdaPerShareAnnual && m.sharesOutstanding) ? Math.round(m.ebitdaPerShareAnnual * m.sharesOutstanding) : null,
        };
    } catch(e) { out.finnhub = { error: e.message }; }

    // EDGAR
    try {
        const tickerRes = await fetch('https://www.sec.gov/files/company_tickers.json', {
            headers: { 'User-Agent': 'YourFairShare admin@yourfairshare.com' }
        });
        const tickers = await tickerRes.json();
        let cik = null, companyName = null;
        for (const entry of Object.values(tickers)) {
            if (entry.ticker && entry.ticker.toUpperCase() === symbol) {
                cik = String(entry.cik_str).padStart(10, '0');
                companyName = entry.title;
                break;
            }
        }
        if (cik) {
            const factsRes = await fetch('https://data.sec.gov/api/xbrl/companyfacts/CIK' + cik + '.json', {
                headers: { 'User-Agent': 'YourFairShare admin@yourfairshare.com' }
            });
            const facts = await factsRes.json();
            const dei = facts.facts['dei'] || {};
            const us_gaap = facts.facts['us-gaap'] || {};
            const empFact = dei['EntityNumberOfEmployees'];
            const empSamples = empFact ? (empFact.units.pure || []).filter(e => e.form === '10-K').slice(-3) : null;
            const niSamples = us_gaap['NetIncomeLoss'] ? (us_gaap['NetIncomeLoss'].units.USD || []).filter(e => e.form === '10-K' && e.start).slice(-3) : null;
            out.edgar = { cik, companyName, empSamples, niSamples };
        } else {
            out.edgar = { error: 'ticker not found' };
        }
    } catch(e) { out.edgar = { error: e.message }; }


    // Wikipedia - detailed diagnostics
    try {
        const companyName = out.alphavantage?.Name || out.finnhub?.name || symbol;
        const cleanName = companyName.replace(/,?\s+(Inc\.?|Corp\.?|Ltd\.?|LLC|Co\.?|Holdings?|Group|Corporation|Limited|plc|Technologies)\s*$/i, '').trim();
        const firstWord = cleanName.split(' ')[0];
        out.wikipedia_searchName = { companyName, cleanName, firstWord };

        // Search
        const searchUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' +
            encodeURIComponent(cleanName) + '&limit=5&format=json';
        const searchRes = await fetch(searchUrl, { headers: { 'Accept': 'application/json', 'User-Agent': 'YourFairShare/1.0' } });
        const rawText = await searchRes.text();
        const searchJson = JSON.parse(rawText);
        const titles = searchJson[1] || [];
        out.wikipedia_titles = titles;

        // Pick best title
        const blocklist = ['middle-earth', 'lord of the rings', 'disambiguation', 'film', 'novel', 'song'];
        const match = titles.find(t => t.toLowerCase() === cleanName.toLowerCase())
            || titles.find(t => t.toLowerCase().includes(cleanName.toLowerCase()))
            || titles.find(t => t.toLowerCase().includes(firstWord.toLowerCase()) && !blocklist.some(b => t.toLowerCase().includes(b)));
        out.wikipedia_match = match || null;
        if (!match) throw new Error('No matching title found');

        // Fetch wikitext
        const pageUrl = 'https://en.wikipedia.org/w/api.php?action=query&titles=' +
            encodeURIComponent(match) + '&prop=revisions&rvprop=content&rvslots=main&format=json';
        const pageRes = await fetch(pageUrl, { headers: { 'Accept': 'application/json', 'User-Agent': 'YourFairShare/1.0' } });
        const pageJson = await pageRes.json();
        const pages = pageJson?.query?.pages || {};
        const page = Object.values(pages)[0];
        const wikitext = page?.revisions?.[0]?.slots?.main?.['*'] || page?.revisions?.[0]?.['*'] || '';
        out.wikipedia_wikitextLength = wikitext.length;

        // Find employee line
        const empLine = wikitext.split('\n').find(l => l.includes('num_employees') || l.includes('number_of_employees'));
        out.wikipedia_empLine = empLine || 'NOT FOUND';
        out.wikipedia_wikitextSnippet = wikitext.substring(0, 500);
    } catch(e) { out.wikipedia_error = e.message; }
};
