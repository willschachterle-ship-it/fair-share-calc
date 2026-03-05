const PRIVATE_COMPANIES = {
    "GENENTECH": "Genentech is a private subsidiary of Roche and does not publicly report financials.",
    "SPACEX": "SpaceX is privately held and does not publicly report financials.",
    "CARGILL": "Cargill is privately held and does not publicly report financials.",
    "IKEA": "IKEA is privately held and does not publicly report financials.",
    "STRIPE": "Stripe is privately held and does not publicly report financials.",
    "DELOITTE": "Deloitte is privately held and does not publicly report financials.",
    "MCKINSEY": "McKinsey is privately held and does not publicly report financials.",
};

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
    "LYFT": { name: "Lyft, Inc.", emps: 3913, profit: 22784000, ebitda: 528800000, logo: "https://logo.clearbit.com/lyft.com" },
    "NKE": { name: "Nike, Inc.", emps: 83700, profit: 5070000000, ebitda: 7000000000, logo: "https://logo.clearbit.com/nike.com" },
    "BA": { name: "The Boeing Company", emps: 172000, profit: -2200000000, ebitda: 1000000000, logo: "https://logo.clearbit.com/boeing.com" },
    "CVX": { name: "Chevron Corporation", emps: 45600, profit: 21369000000, ebitda: 38000000000, logo: "https://logo.clearbit.com/chevron.com" },
    "TGT": { name: "Target Corporation", emps: 440000, profit: 4138000000, ebitda: 8000000000, logo: "https://logo.clearbit.com/target.com" },
    "V": { name: "Visa Inc.", emps: 26500, profit: 17273000000, ebitda: 21000000000, logo: "https://logo.clearbit.com/visa.com" },
    "MA": { name: "Mastercard Incorporated", emps: 33000, profit: 11195000000, ebitda: 14000000000, logo: "https://logo.clearbit.com/mastercard.com" },
    "KO": { name: "The Coca-Cola Company", emps: 82500, profit: 10714000000, ebitda: 15000000000, logo: "https://logo.clearbit.com/coca-cola.com" },
    "PEP": { name: "PepsiCo, Inc.", emps: 318000, profit: 9166000000, ebitda: 15000000000, logo: "https://logo.clearbit.com/pepsico.com" },
    "BIIB": { name: "Biogen Inc.", emps: 7400, profit: 1640000000, ebitda: 2800000000, logo: "https://logo.clearbit.com/biogen.com" },
    "WEN": { name: "The Wendy's Company", emps: 14500, profit: 103000000, ebitda: 490000000, logo: "https://logo.clearbit.com/wendys.com" },
    "TAK": { name: "Takeda Pharmaceutical", emps: 49000, profit: 1200000000, ebitda: 5800000000, logo: "https://logo.clearbit.com/takeda.com" },
    "4503.T": { name: "Astellas Pharma Inc.", emps: 14000, profit: 1100000000, ebitda: 2200000000, logo: "https://logo.clearbit.com/astellas.com" },
};

const TICKER_ALIASES = {
    "TESLA": "TSLA", "APPLE": "AAPL", "MICROSOFT": "MSFT",
    "GOOGLE": "GOOGL", "ALPHABET": "GOOGL", "AMAZON": "AMZN",
    "FACEBOOK": "META", "NVIDIA": "NVDA", "WALMART": "WMT",
    "NETFLIX": "NFLX", "DISNEY": "DIS", "FORD": "F",
    "STARBUCKS": "SBUX", "MCDONALDS": "MCD", "MCDONALD'S": "MCD",
    "PFIZER": "PFE", "FEDEX": "FDX", "UBER": "UBER", "LYFT": "LYFT",
    "AIRBNB": "ABNB", "SPOTIFY": "SPOT", "SNAPCHAT": "SNAP",
    "BOEING": "BA", "NIKE": "NKE", "VISA": "V",
    "MASTERCARD": "MA", "COCACOLA": "KO", "COCA COLA": "KO",
    "PEPSI": "PEP", "PEPSICO": "PEP", "CHEVRON": "CVX",
    "GOLDMAN SACHS": "GS", "JPMORGAN": "JPM", "CITIGROUP": "C",
    "EXXON": "XOM", "HOME DEPOT": "HD", "HOMEDEPOT": "HD",
    "COSTCO": "COST", "TARGET": "TGT", "GENERAL MOTORS": "GM",
    "INTEL": "INTC", "CISCO": "CSCO", "UNITEDHEALTH": "UNH",
    "BANK OF AMERICA": "BAC", "JOHNSON & JOHNSON": "JNJ",
    "JOHNSON AND JOHNSON": "JNJ", "BIOGEN": "BIIB",
    "WENDYS": "WEN", "WENDY'S": "WEN", "TAKEDA": "TAK",
    "ASTELLAS": "4503.T",
};

document.addEventListener('DOMContentLoaded', function() {
    var calculateBtn = document.getElementById('calculateBtn');
    var resultsArea = document.getElementById('results');
    var loadingMsg = document.getElementById('loadingMsg');

    async function fetchFromAPI(symbol, resolve) {
        var url = '/api/company?symbol=' + encodeURIComponent(symbol);
        if (resolve) url += '&resolve=1';
        var res = await fetch(url);
        var json = await res.json();
        if (!res.ok || json.error) throw new Error(json.error || 'API error');
        // Fill any missing fields from fallback DB, but API values take priority
        if (FALLBACK_DB[symbol]) {
            var db = FALLBACK_DB[symbol];
            if (!json.emps)   json.emps   = db.emps;
            if (json.profit === null || json.profit === undefined) json.profit = db.profit;
            if (json.ebitda === null || json.ebitda === undefined) json.ebitda = db.ebitda;
            json.name = json.name || db.name;
            json.logo = json.logo || db.logo;
        }
        return json;
    }

    async function fetchCompanyData(rawInput) {
        var input = rawInput.trim();
        var upper = input.toUpperCase();

        var privateMsg = PRIVATE_COMPANIES[upper];
        if (privateMsg) {
            alert(privateMsg + '\n\nThis tool only works with publicly traded companies.');
            return null;
        }

        var symbol = TICKER_ALIASES[upper] || upper;
        var looksLikeTicker = /^[A-Z0-9]{1,6}(\.[A-Z]{1,2})?$/.test(symbol);

        try {
            if (looksLikeTicker) {
                console.log('Fetching ticker: ' + symbol);
                return await fetchFromAPI(symbol, false);
            } else {
                console.log('Resolving name: ' + input);
                return await fetchFromAPI(input, true);
            }
        } catch(err) {
            console.warn('API failed: ' + err.message);
        }

        if (FALLBACK_DB[symbol]) {
            console.log('Using fallback DB for: ' + symbol);
            return FALLBACK_DB[symbol];
        }

        alert('"' + rawInput + '" could not be found. This may be because:\n- It is privately held (e.g. Genentech, SpaceX)\n- It trades under a different name (try the ticker symbol)\n- It is a subsidiary of another company');
        return null;
    }

    function calculateTax(income) {
        var taxable = Math.max(0, income - 14600);
        var brackets = [
            [11600, 0.10], [47150, 0.12], [100525, 0.22],
            [191950, 0.24], [243725, 0.32], [609350, 0.35],
            [Infinity, 0.37],
        ];
        var tax = 0, prev = 0;
        for (var i = 0; i < brackets.length; i++) {
            if (taxable <= prev) break;
            tax += (Math.min(taxable, brackets[i][0]) - prev) * brackets[i][1];
            prev = brackets[i][0];
        }
        return Math.round(tax);
    }

    if (calculateBtn) {
        calculateBtn.addEventListener('click', async function() {
            var symbolInput = document.getElementById('company');
            var symbol = symbolInput ? symbolInput.value.trim() : '';
            if (!symbol) return alert('Please enter a company name or ticker symbol.');

            if (loadingMsg) loadingMsg.classList.remove('hidden');
            if (resultsArea) resultsArea.classList.add('hidden');

            var data = await fetchCompanyData(symbol);

            if (loadingMsg) loadingMsg.classList.add('hidden');
            if (!data) return;

            var income = 0, timeFrac = 1;
            var hourlyContainer = document.getElementById('hourlyInputs');
            var isHourly = hourlyContainer && !hourlyContainer.classList.contains('hidden');

            if (isHourly) {
                var wage = parseFloat(document.getElementById('hourlyWage').value) || 0;
                var hrs  = parseFloat(document.getElementById('hoursPerWeek').value) || 0;
                var wks  = parseFloat(document.getElementById('weeksWorked').value) || 0;
                income = wage * hrs * wks;
                timeFrac = (hrs * wks) / 2080;
            } else {
                var annualInput = document.getElementById('annualSalary');
                income = annualInput ? parseFloat(annualInput.value) || 0 : 0;
            }

            // If net income has a one-time item, use EBITDA as a proxy for "real" profit
            var effectiveProfit = (data.hasOneTimeItem && data.ebitda !== null)
                ? data.ebitda : data.profit;
            var distributedSurplus = Math.round((effectiveProfit / data.emps) * timeFrac);
            var accountingSurplus  = Math.round((data.ebitda  / data.emps) * timeFrac);
            var fedTax = calculateTax(income);
            var netTotal    = income + distributedSurplus;
            var ebitdaTotal = income + accountingSurplus;

            // Helper: format surplus as "X more" or "X less"
            var fmtSurplus = function(n) {
                if (n >= 0) return '$' + n.toLocaleString() + ' more';
                return '$' + Math.abs(n).toLocaleString() + ' less';
            };

            var yourEarningsBlock = isHourly
                ? '<div style="margin-bottom:20px; padding:15px; background:#f0f4ff; border-radius:8px;">' +
                    '<p style="margin:0 0 4px 0; font-size:0.85em; color:#555;">Your annual earnings</p>' +
                    '<div style="font-size:1.6em; font-weight:bold; color:#333;">$' + income.toLocaleString() + '</div>' +
                  '</div>'
                : '';

            if (resultsArea) {
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
                            (data.hasOneTimeItem ? '<p style="font-size:0.85em; color:#e65100; margin:0 0 12px 0; padding:10px 12px; background:#fff3e0; border-left:3px solid #e65100; border-radius:4px;">⚠️ <strong>Heads up:</strong> ' + data.name + ' officially reported <strong>$' + (data.profit/1e9).toFixed(2) + 'B in net income</strong> this year — which would have meant <strong>$' + Math.round(data.profit / data.emps).toLocaleString() + ' per worker</strong> if it had been shared. But this figure includes a one-time windfall (like a tax benefit or asset write-off), or an accounting error (math is hard), unrelated to the day-to-day work of its employees. The company still received that cash — it just did not go to workers. The calculations below use EBITDA, which reflects recurring operational profit and gives a more typical picture of what the company actually earns through its business.</p>' : '') +
                            '<p style="margin-bottom:8px;">If you got to keep your fair share of what <strong>' + data.name + '</strong> said they made (' + (data.hasOneTimeItem ? 'adjusted profit' : 'net income') + '), your salary would be <strong>$' + netTotal.toLocaleString() + '</strong> - that is <strong>' + fmtSurplus(distributedSurplus) + '</strong> than what you made.</p>' +
                            '<div style="font-size:1.8em; font-weight:bold; color:#1b5e20;">$' + netTotal.toLocaleString() + '</div>' +
                        '</div>' +
                        '<div style="margin-bottom:25px;">' +
                            '<p style="margin-bottom:8px;">If you got to keep your fair share of what <strong>' + data.name + '</strong> actually made (EBITDA), your salary would be <strong>$' + ebitdaTotal.toLocaleString() + '</strong> - that is <strong>' + fmtSurplus(accountingSurplus) + '</strong> than what you made.</p>' +
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

    var annualToggle = document.getElementById('annualToggle');
    var hourlyToggle = document.getElementById('hourlyToggle');
    if (annualToggle) annualToggle.onclick = function(e) { toggleUI(e, 'salary'); };
    if (hourlyToggle) hourlyToggle.onclick = function(e) { toggleUI(e, 'hourly'); };

    function toggleUI(e, mode) {
        document.querySelectorAll('.toggle-btn').forEach(function(b) { b.classList.remove('active'); });
        e.target.classList.add('active');
        var sInputs = document.getElementById('salaryInputs');
        var hInputs = document.getElementById('hourlyInputs');
        if (sInputs) sInputs.classList.toggle('hidden', mode === 'hourly');
        if (hInputs) hInputs.classList.toggle('hidden', mode === 'salary');
    }
});
