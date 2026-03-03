const FINNHUB_KEY = 'd6j3rvhr01ql467i5e0gd6j3rvhr01ql467i5e10';

const FALLBACK_DB = {
    "TSLA": { name: "Tesla, Inc.", emps: 140473, profit: 14974000000, ebitda: 19700000000, logo: "https://logo.clearbit.com/tesla.com" },
    "AAPL": { name: "Apple Inc.", emps: 164000, profit: 96995000000, ebitda: 130000000000, logo: "https://logo.clearbit.com/apple.com" },
    "MSFT": { name: "Microsoft Corporation", emps: 221000, profit: 72361000000, ebitda: 102000000000, logo: "https://logo.clearbit.com/microsoft.com" },
    "GOOGL": { name: "Alphabet Inc.", emps: 182502, profit: 73795000000, ebitda: 100000000000, logo: "https://logo.clearbit.com/google.com" },
    "AMZN": { name: "Amazon.com, Inc.", emps: 1525000, profit: 30425000000, ebitda: 85000000000, logo: "https://logo.clearbit.com/amazon.com" },
    "META": { name: "Meta Platforms, Inc.", emps: 67317, profit: 39098000000, ebitda: 54000000000, logo: "https://logo.clearbit.com/meta.com" },
    "NVDA": { name: "NVIDIA Corporation", emps: 29600, profit: 29760000000, ebitda: 33000000000, logo: "https://logo.clearbit.com/nvidia.com" },
    "WMT": { name: "Walmart Inc.", emps: 2100000, profit: 11680000000, ebitda: 28000000000, logo: "https://logo.clearbit.com/walmart.com" },
    "JPM": { name: "JPMorgan Chase & Co.", emps: 308669, profit: 49552000000, ebitda: 55000000000, logo: "https://logo.clearbit.com/jpmorganchase.com" },
    "XOM": { name: "Exxon Mobil Corporation", emps: 62000, profit: 36010000000, ebitda: 58000000000, logo: "https://logo.clearbit.com/exxonmobil.com" },
    "BAC": { name: "Bank of America Corp.", emps: 213000, profit: 26515000000, ebitda: 30000000000, logo: "https://logo.clearbit.com/bankofamerica.com" },
    "UNH": { name: "UnitedHealth Group", emps: 400000, profit: 22381000000, ebitda: 29000000000, logo: "https://logo.clearbit.com/unitedhealthgroup.com" },
    "COST": { name: "Costco Wholesale Corp.", emps: 316000, profit: 6292000000, ebitda: 9000000000, logo: "https://logo.clearbit.com/costco.com" },
    "HD": { name: "The Home Depot, Inc.", emps: 465000, profit: 15143000000, ebitda: 21000000000, logo: "https://logo.clearbit.com/homedepot.com" },
    "NFLX": { name: "Netflix, Inc.", emps: 13000, profit: 5408000000, ebitda: 7000000000, logo: "https://logo.clearbit.com/netflix.com" },
    "DIS": { name: "The Walt Disney Company", emps: 220000, profit: 3000000000, ebitda: 14000000000, logo: "https://logo.clearbit.com/thewaltdisneycompany.com" },
    "SBUX": { name: "Starbucks Corporation", emps: 402000, profit: 3582000000, ebitda: 5800000000, logo: "https://logo.clearbit.com/starbucks.com" },
    "MCD": { name: "McDonald's Corporation", emps: 150000, profit: 8468000000, ebitda: 14000000000, logo: "https://logo.clearbit.com/mcdonalds.com" },
    "F": { name: "Ford Motor Company", emps: 177000, profit: 4300000000, ebitda: 12000000000, logo: "https://logo.clearbit.com/ford.com" },
    "GM": { name: "General Motors Company", emps: 163000, profit: 9936000000, ebitda: 16000000000, logo: "https://logo.clearbit.com/gm.com" },
    "INTC": { name: "Intel Corporation", emps: 124800, profit: -16639000000, ebitda: -5000000000, logo: "https://logo.clearbit.com/intel.com" },
    "CSCO": { name: "Cisco Systems, Inc.", emps: 84900, profit: 12613000000, ebitda: 16000000000, logo: "https://logo.clearbit.com/cisco.com" },
    "IBM": { name: "IBM Corporation", emps: 288000, profit: 7502000000, ebitda: 14000000000, logo: "https://logo.clearbit.com/ibm.com" },
    "GS": { name: "Goldman Sachs Group", emps: 45300, profit: 9457000000, ebitda: 11000000000, logo: "https://logo.clearbit.com/goldmansachs.com" },
    "PFE": { name: "Pfizer Inc.", emps: 88000, profit: -2800000000, ebitda: 5000000000, logo: "https://logo.clearbit.com/pfizer.com" },
    "FDX": { name: "FedEx Corporation", emps: 547000, profit: 3965000000, ebitda: 8500000000, logo: "https://logo.clearbit.com/fedex.com" },
    "UBER": { name: "Uber Technologies, Inc.", emps: 32200, profit: 1887000000, ebitda: 4000000000, logo: "https://logo.clearbit.com/uber.com" },
    "NKE": { name: "Nike, Inc.", emps: 83700, profit: 5070000000, ebitda: 7000000000, logo: "https://logo.clearbit.com/nike.com" },
    "BA": { name: "The Boeing Company", emps: 172000, profit: -2200000000, ebitda: 1000000000, logo: "https://logo.clearbit.com/boeing.com" },
    "CVX": { name: "Chevron Corporation", emps: 45600, profit: 21369000000, ebitda: 38000000000, logo: "https://logo.clearbit.com/chevron.com" },
    "TGT": { name: "Target Corporation", emps: 440000, profit: 4138000000, ebitda: 8000000000, logo: "https://logo.clearbit.com/target.com" },
    "V": { name: "Visa Inc.", emps: 26500, profit: 17273000000, ebitda: 21000000000, logo: "https://logo.clearbit.com/visa.com" },
    "MA": { name: "Mastercard Incorporated", emps: 33000, profit: 11195000000, ebitda: 14000000000, logo: "https://logo.clearbit.com/mastercard.com" },
    "KO": { name: "The Coca-Cola Company", emps: 82500, profit: 10714000000, ebitda: 15000000000, logo: "https://logo.clearbit.com/coca-cola.com" },
    "PEP": { name: "PepsiCo, Inc.", emps: 318000, profit: 9166000000, ebitda: 15000000000, logo: "https://logo.clearbit.com/pepsico.com" },
};

// Hardcoded name-to-ticker aliases (instant, no API call needed)
const TICKER_ALIASES = {
    "TESLA": "TSLA", "APPLE": "AAPL", "MICROSOFT": "MSFT",
    "GOOGLE": "GOOGL", "ALPHABET": "GOOGL", "AMAZON": "AMZN",
    "FACEBOOK": "META", "NVIDIA": "NVDA", "WALMART": "WMT",
    "NETFLIX": "NFLX", "DISNEY": "DIS", "FORD": "F",
    "STARBUCKS": "SBUX", "MCDONALDS": "MCD", "MCDONALD'S": "MCD",
    "PFIZER": "PFE", "FEDEX": "FDX", "UBER": "UBER",
    "AIRBNB": "ABNB", "SPOTIFY": "SPOT", "SNAPCHAT": "SNAP",
    "BOEING": "BA", "NIKE": "NKE", "VISA": "V",
    "MASTERCARD": "MA", "COCACOLA": "KO", "COCA COLA": "KO",
    "PEPSI": "PEP", "PEPSICO": "PEP", "CHEVRON": "CVX",
    "GOLDMAN SACHS": "GS", "JPMORGAN": "JPM", "CITIGROUP": "C",
    "EXXON": "XOM", "HOME DEPOT": "HD", "HOMEDEPOT": "HD",
    "COSTCO": "COST", "TARGET": "TGT", "GENERAL MOTORS": "GM",
    "INTEL": "INTC", "CISCO": "CSCO", "UNITEDHEALTH": "UNH",
    "BANK OF AMERICA": "BAC", "JOHNSON & JOHNSON": "JNJ",
    "JOHNSON AND JOHNSON": "JNJ",
};

document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsArea = document.getElementById('results');
    const loadingMsg = document.getElementById('loadingMsg');

    // Resolve a plain company name to a ticker using Yahoo Finance search
    async function resolveToTicker(input) {
        const url = 'https://query2.finance.yahoo.com/v1/finance/search?q=' + encodeURIComponent(input) + '&quotesCount=5&newsCount=0';
        const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (!res.ok) throw new Error('Yahoo search HTTP ' + res.status);
        const json = await res.json();

        const quotes = (json && json.finance && json.finance.result && json.finance.result[0] && json.finance.result[0].quotes) || [];
        // Prefer US-listed equities (no dot in symbol)
        const equity = quotes.find(q => q.quoteType === 'EQUITY' && q.symbol && !q.symbol.includes('.'))
                    || quotes.find(q => q.quoteType === 'EQUITY' && q.symbol);
        if (!equity) throw new Error('No equity found for "' + input + '"');

        console.log('Resolved "' + input + '" -> ' + equity.symbol);
        return equity.symbol;
    }

    // Primary: Yahoo Finance quoteSummary
    async function fetchFromYahoo(symbol) {
        const url = 'https://query2.finance.yahoo.com/v10/finance/quoteSummary/' + symbol + '?modules=assetProfile,defaultKeyStatistics,financialData';
        const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (!res.ok) throw new Error('Yahoo HTTP ' + res.status);
        const json = await res.json();

        const result = json && json.quoteSummary && json.quoteSummary.result && json.quoteSummary.result[0];
        if (!result) throw new Error('No Yahoo data');

        const profile = result.assetProfile || {};
        const keyStats = result.defaultKeyStatistics || {};
        const financialData = result.financialData || {};

        const emps = profile.fullTimeEmployees;
        if (!emps) throw new Error('Employee count missing from Yahoo');

        const profit = (financialData.netIncomeToCommon && financialData.netIncomeToCommon.raw)
            || (keyStats.netIncomeToCommon && keyStats.netIncomeToCommon.raw)
            || 0;

        const ebitda = (financialData.ebitda && financialData.ebitda.raw)
            || ((keyStats.enterpriseValue && keyStats.enterpriseValue.raw) ? keyStats.enterpriseValue.raw * 0.15 : 0)
            || (profit > 0 ? profit * 1.3 : 0);

        const website = profile.website || '';
        let logo = '';
        try {
            logo = website ? 'https://logo.clearbit.com/' + new URL(website).hostname : '';
        } catch (e) { logo = ''; }

        return {
            name: profile.longName || profile.shortName || symbol,
            emps: parseInt(emps),
            profit: profit,
            ebitda: ebitda,
            logo: logo,
        };
    }

    // Secondary: Finnhub
    async function fetchFromFinnhub(symbol) {
        const profileRes = await fetch('https://finnhub.io/api/v1/stock/profile2?symbol=' + symbol + '&token=' + FINNHUB_KEY);
        const finRes = await fetch('https://finnhub.io/api/v1/stock/metric?symbol=' + symbol + '&metric=all&token=' + FINNHUB_KEY);
        const profileData = await profileRes.json();
        const financialsData = await finRes.json();

        if (!profileData || !profileData.name) throw new Error('Finnhub: no profile');
        const emps = profileData.employeeTotal;
        if (!emps || emps === 0) throw new Error('Finnhub: employee count missing');

        const metrics = financialsData.metric || {};
        const netIncome = (metrics.netIncomePerShareAnnual * metrics.sharesOutstanding) || 0;
        const ebitda = (metrics.ebitdaPerShareAnnual * metrics.sharesOutstanding) || (netIncome > 0 ? netIncome * 1.3 : 0);

        let logo = profileData.logo || '';
        if (!logo && profileData.weburl) {
            try { logo = 'https://logo.clearbit.com/' + new URL(profileData.weburl).hostname; } catch (e) {}
        }

        return {
            name: profileData.name,
            emps: parseInt(emps),
            profit: netIncome,
            ebitda: ebitda,
            logo: logo,
        };
    }

    // Orchestrator: resolve name -> ticker, then fetch data from sources in order
    async function fetchCompanyData(rawInput) {
        let symbol = rawInput.trim().toUpperCase();

        // Check hardcoded aliases first
        symbol = TICKER_ALIASES[symbol] || symbol;

        // If it still looks like a name (not a short all-caps ticker), use Yahoo search to resolve
        const looksLikeTicker = /^[A-Z]{1,5}$/.test(symbol);
        if (!looksLikeTicker) {
            try {
                symbol = await resolveToTicker(rawInput.trim());
            } catch (err) {
                console.warn('Name resolution failed: ' + err.message);
            }
        }

        // Try Yahoo Finance
        try {
            console.log('[1/3] Yahoo Finance for ' + symbol);
            return await fetchFromYahoo(symbol);
        } catch (err) {
            console.warn('Yahoo failed: ' + err.message);
        }

        // Try Finnhub
        try {
            console.log('[2/3] Finnhub for ' + symbol);
            return await fetchFromFinnhub(symbol);
        } catch (err) {
            console.warn('Finnhub failed: ' + err.message);
        }

        // Fallback DB
        if (FALLBACK_DB[symbol]) {
            console.log('[3/3] Fallback DB for ' + symbol);
            return FALLBACK_DB[symbol];
        }

        alert('Could not find data for "' + rawInput + '". Try a ticker like AAPL, or a well-known company name.');
        return null;
    }

    // Federal income tax estimate (2024, single filer)
    function calculateTax(income) {
        const taxable = Math.max(0, income - 14600);
        const brackets = [
            [11600,  0.10],
            [47150,  0.12],
            [100525, 0.22],
            [191950, 0.24],
            [243725, 0.32],
            [609350, 0.35],
            [Infinity, 0.37],
        ];
        let tax = 0, prev = 0;
        for (let i = 0; i < brackets.length; i++) {
            const cap = brackets[i][0];
            const rate = brackets[i][1];
            if (taxable <= prev) break;
            tax += (Math.min(taxable, cap) - prev) * rate;
            prev = cap;
        }
        return Math.round(tax);
    }

    if (calculateBtn) {
        calculateBtn.addEventListener('click', async () => {
            const symbolInput = document.getElementById('company');
            const symbol = symbolInput ? symbolInput.value.trim() : '';
            if (!symbol) return alert('Please enter a company name or ticker symbol.');

            if (loadingMsg) loadingMsg.classList.remove('hidden');
            if (resultsArea) resultsArea.classList.add('hidden');

            const data = await fetchCompanyData(symbol);

            if (loadingMsg) loadingMsg.classList.add('hidden');
            if (!data) return;

            let income = 0, timeFrac = 1;
            const hourlyContainer = document.getElementById('hourlyInputs');
            const isHourly = hourlyContainer && !hourlyContainer.classList.contains('hidden');

            if (isHourly) {
                const wage = parseFloat(document.getElementById('hourlyWage').value) || 0;
                const hrs  = parseFloat(document.getElementById('hoursPerWeek').value) || 0;
                const wks  = parseFloat(document.getElementById('weeksWorked').value) || 0;
                income = wage * hrs * wks;
                timeFrac = (hrs * wks) / 2080;
            } else {
                const annualInput = document.getElementById('annualSalary');
                income = annualInput ? parseFloat(annualInput.value) || 0 : 0;
            }

            const distributedSurplus = Math.round((data.profit / data.emps) * timeFrac);
            const accountingSurplus  = Math.round((data.ebitda  / data.emps) * timeFrac);
            const fedTax = calculateTax(income);

            if (resultsArea) {
                const netTotal = income + distributedSurplus;
                const ebitdaTotal = income + accountingSurplus;
                const yourEarningsBlock = isHourly
                    ? '<div style="margin-bottom:20px; padding:15px; background:#f0f4ff; border-radius:8px;">' +
                        '<p style="margin:0 0 4px 0; font-size:0.85em; color:#555;">Your annual earnings</p>' +
                        '<div style="font-size:1.6em; font-weight:bold; color:#333;">$' + income.toLocaleString() + '</div>' +
                      '</div>'
                    : '';

                resultsArea.innerHTML =
                    yourEarningsBlock +
                    '<div class="comparison-box" style="padding:25px; background:#fff; border-radius:12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); line-height: 1.6;">' +
                        '<div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">' +
                            (data.logo ? '<img src="' + data.logo + '" alt="logo" onerror="this.style.display=\'none\'" style="width:50px; height:50px; border-radius:8px; object-fit:contain; border:1px solid #eee;">' : '') +
                            '<div>' +
                                '<h2 style="margin:0; color:#1a1a1a; font-size:1.4em;">' + data.name + '</h2>' +
                                '<p style="margin:0; font-size:0.75em; color:#888; text-transform:uppercase; letter-spacing:1px;">' + data.emps.toLocaleString() + ' employees</p>' +
                            '</div>' +
                        '</div>' +
                        '<div style="margin-bottom:20px; padding-top:10px; border-top: 1px solid #eee;">' +
                            '<p style="margin-bottom:8px;">If you got to keep your fair share of what <strong>' + data.name + '</strong> said they made (net income), your salary would be <strong>$' + netTotal.toLocaleString() + '</strong> — that's <strong>$' + distributedSurplus.toLocaleString() + ' more</strong> than what you made.</p>' +
                            '<div style="font-size:1.8em; font-weight:bold; color:#1b5e20;">$' + netTotal.toLocaleString() + '</div>' +
                        '</div>' +
                        '<div style="margin-bottom:25px;">' +
                            '<p style="margin-bottom:8px;">If you got to keep your fair share of what <strong>' + data.name + '</strong> actually made (EBITDA), your salary would be <strong>$' + ebitdaTotal.toLocaleString() + '</strong> — that's <strong>$' + accountingSurplus.toLocaleString() + ' more</strong> than what you made.</p>' +
                            '<div style="font-size:1.8em; font-weight:bold; color:#0d47a1;">$' + ebitdaTotal.toLocaleString() + '</div>' +
                        '</div>' +
                        '<div style="margin-top:20px; padding-top:20px; border-top: 1px solid #eee;">' +
                            '<p><strong>' + data.name + '</strong> kept <strong>$' + accountingSurplus.toLocaleString() + '</strong> from your labor (based on EBITDA).</p>' +
                            '<p>The federal government kept <strong>$' + fedTax.toLocaleString() + '</strong> in income tax.</p>' +
                        '</div>' +
                    '</div>';
                resultsArea.classList.remove('hidden');
            }
        });
    }

    // UI toggle
    const annualToggle = document.getElementById('annualToggle');
    const hourlyToggle = document.getElementById('hourlyToggle');
    if (annualToggle) annualToggle.onclick = function(e) { toggleUI(e, 'salary'); };
    if (hourlyToggle) hourlyToggle.onclick = function(e) { toggleUI(e, 'hourly'); };

    function toggleUI(e, mode) {
        document.querySelectorAll('.toggle-btn').forEach(function(b) { b.classList.remove('active'); });
        e.target.classList.add('active');
        const sInputs = document.getElementById('salaryInputs');
        const hInputs = document.getElementById('hourlyInputs');
        if (sInputs) sInputs.classList.toggle('hidden', mode === 'hourly');
        if (hInputs) hInputs.classList.toggle('hidden', mode === 'salary');
    }
});
