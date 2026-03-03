const FINNHUB_KEY = 'd6j3rvhr01ql467i5e0gd6j3rvhr01ql467i5e10';
const AV_KEY = '17JNK5S9J44QAXTV';

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const symbol = (req.query.symbol || 'CVS').toUpperCase();
    const out = {};

    // Alpha Vantage
    try {
        const r = await fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${AV_KEY}`);
        const j = await r.json();
        out.alphavantage = { Name: j.Name, FullTimeEmployees: j.FullTimeEmployees, EBITDA: j.EBITDA, note: j.Note || j.Information || null };
    } catch(e) { out.alphavantage = { error: e.message }; }

    // Finnhub
    try {
        const r = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_KEY}`);
        const j = await r.json();
        out.finnhub = { name: j.name, employeeTotal: j.employeeTotal, weburl: j.weburl };
    } catch(e) { out.finnhub = { error: e.message }; }

    // Wikipedia raw wikitext - show ALL infobox fields so we can see exact field names
    try {
        const companyName = out.alphavantage?.Name || out.finnhub?.name || symbol;
        const searchRes = await fetch(
            'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=' +
            encodeURIComponent(companyName) + '&format=json'
        );
        const searchJson = await searchRes.json();
        const pageTitle = searchJson?.query?.search?.[0]?.title;

        const pageRes = await fetch(
            'https://en.wikipedia.org/w/api.php?action=query&titles=' +
            encodeURIComponent(pageTitle) + '&prop=revisions&rvprop=content&format=json'
        );
        const pageJson = await pageRes.json();
        const pages = pageJson?.query?.pages || {};
        const wikitext = Object.values(pages)[0]?.revisions?.[0]?.['*'] || '';

        // Extract just the infobox section
        const infoboxStart = wikitext.indexOf('{{Infobox');
        const infoboxEnd = wikitext.indexOf('\n}}', infoboxStart) + 3;
        const infobox = infoboxStart >= 0 ? wikitext.substring(infoboxStart, infoboxEnd) : 'NO INFOBOX FOUND';

        // Find any line with employee-related text
        const empLines = infobox.split('\n').filter(l =>
            l.toLowerCase().includes('employ') || l.toLowerCase().includes('staff') || l.toLowerCase().includes('worker')
        );

        out.wikipedia = { pageTitle, empLines, infobox_snippet: infobox.substring(0, 800) };
    } catch(e) { out.wikipedia = { error: e.message }; }

    // Show raw values from each source for diagnosis
    try {
        const FINNHUB_KEY = 'd6j3rvhr01ql467i5e0gd6j3rvhr01ql467i5e10';
        const FMP_KEY = '3gPWbjHBHWaeswUkIvjGjN6Ei3SxifLL';
        const [profileRes, finRes] = await Promise.all([
            fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_KEY}`),
            fetch(`https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_KEY}`)
        ]);
        const p = await profileRes.json();
        const f = await finRes.json();
        const m = f.metric || {};
        out.finnhub_raw = {
            employeeTotal: p.employeeTotal,
            netIncomePerShareAnnual: m.netIncomePerShareAnnual,
            sharesOutstanding: m.sharesOutstanding,
            computedProfit: m.netIncomePerShareAnnual && m.sharesOutstanding ? Math.round(m.netIncomePerShareAnnual * m.sharesOutstanding) : null,
            ebitdaPerShareAnnual: m.ebitdaPerShareAnnual,
            computedEbitda: m.ebitdaPerShareAnnual && m.sharesOutstanding ? Math.round(m.ebitdaPerShareAnnual * m.sharesOutstanding) : null,
        };
    } catch(e) { out.finnhub_raw = { error: e.message }; }

    return res.status(200).json(out);
};
