const FINNHUB_KEY = 'd6j3rvhr01ql467i5e0gd6j3rvhr01ql467i5e10';
const AV_KEY = '17JNK5S9J44QAXTV';

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const symbol = (req.query.symbol || 'CVS').toUpperCase();
    const out = {};

    // Alpha Vantage OVERVIEW - dump all fields
    try {
        const r = await fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${AV_KEY}`);
        const j = await r.json();
        out.alphavantage = {
            Name: j.Name,
            FullTimeEmployees: j.FullTimeEmployees,
            NetIncome: j.NetIncome,
            EBITDA: j.EBITDA,
            status: r.status,
            note: j.Note || j.Information || null
        };
    } catch(e) { out.alphavantage = { error: e.message }; }

    // Finnhub profile - dump employee field
    try {
        const r = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_KEY}`);
        const j = await r.json();
        out.finnhub = {
            name: j.name,
            employeeTotal: j.employeeTotal,
            weburl: j.weburl,
            logo: j.logo
        };
    } catch(e) { out.finnhub = { error: e.message }; }

    // EDGAR - dump DEI fields
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
            const factsRes = await fetch(`https://data.sec.gov/api/xbrl/companyfacts/CIK${cik}.json`, {
                headers: { 'User-Agent': 'YourFairShare admin@yourfairshare.com' }
            });
            const facts = await factsRes.json();
            const dei = facts.facts['dei'] || {};
            const us_gaap = facts.facts['us-gaap'] || {};
            out.edgar = {
                cik,
                companyName,
                dei_keys: Object.keys(dei),
                has_EntityNumberOfEmployees: !!dei['EntityNumberOfEmployees'],
                EntityNumberOfEmployees_sample: dei['EntityNumberOfEmployees']?.units?.pure?.slice(-2) || null,
                has_NetIncomeLoss: !!us_gaap['NetIncomeLoss'],
                NetIncomeLoss_sample: us_gaap['NetIncomeLoss']?.units?.USD?.filter(e => e.form==='10-K')?.slice(-2) || null,
            };
        } else {
            out.edgar = { error: 'ticker not found in EDGAR' };
        }
    } catch(e) { out.edgar = { error: e.message }; }

    return res.status(200).json(out);
};
