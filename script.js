const PRIVATE_COMPANIES = {
    "GENENTECH": "Genentech is a private subsidiary of Roche and does not publicly report financials.",
    "SPACEX": "SpaceX is privately held and does not publicly report financials.",
    "ANDURIL": "Anduril is privately held and does not publicly report financials.",
    "PERATON": "Peraton is privately held (owned by Veritas Capital) and does not publicly report financials.",
    "BECHTEL": "Bechtel is privately held and does not publicly report financials.",
    "SIERRA NEVADA": "Sierra Nevada Corporation is privately held and does not publicly report financials.",
    "MBDA": "MBDA is a joint venture and is not publicly traded.",
    "NAVAL GROUP": "Naval Group is majority state-owned and is not publicly traded.",
    "MITRE": "MITRE is a nonprofit federally funded research center and does not report public financials.",
    "AM GENERAL": "AM General is privately held and does not publicly report financials.",
    "M1 SUPPORT SERVICES": "M1 Support Services is privately held and does not publicly report financials.",
    "CARGILL": "Cargill is privately held and does not publicly report financials.",
    "IKEA": "IKEA is privately held and does not publicly report financials.",
    "STRIPE": "Stripe is privately held and does not publicly report financials.",
    "DELOITTE": "Deloitte is privately held and does not publicly report financials.",
    "MCKINSEY": "McKinsey is privately held and does not publicly report financials.",
};

// FALLBACK_DB is loaded from fallback.js (see <script> tag in index.html)


const TICKER_ALIASES = {
    // US companies
    "TESLA": "TSLA", "APPLE": "AAPL", "MICROSOFT": "MSFT",
    "GOOGLE": "GOOGL", "ALPHABET": "GOOGL", "AMAZON": "AMZN",
    "FACEBOOK": "META", "NVIDIA": "NVDA", "WALMART": "WMT",
    "NETFLIX": "NFLX", "DISNEY": "DIS", "FORD": "F",
    "STARBUCKS": "SBUX", "MCDONALDS": "MCD", "MCDONALD'S": "MCD",
    "PFIZER": "PFE", "FEDEX": "FDX", "UBER": "UBER", "LYFT": "LYFT",
    "AIRBNB": "ABNB", "SPOTIFY": "SPOT", "SNAPCHAT": "SNAP",
    "BOEING": "BA", "NIKE": "NKE", "VISA": "V",
    "MASTERCARD": "MA", "COCACOLA": "KO", "COCA COLA": "KO",
    "PEPSI": "PEP", "PEPSICO": "PEP",
    "LOCKHEED": "LMT", "LOCKHEED MARTIN": "LMT",
    "NORTHROP": "NOC", "NORTHROP GRUMMAN": "NOC",
    "RAYTHEON": "RTX", "RTX CORPORATION": "RTX",
    "GENERAL DYNAMICS": "GD", "L3HARRIS": "LHX", "L3HARRIS TECHNOLOGIES": "LHX",
    "HUNTINGTON INGALLS": "HII", "HUNTINGTON INGALLS INDUSTRIES": "HII",
    "PALANTIR": "PLTR", "GENERAL MOTORS": "GM", "GENERAL ELECTRIC": "GE",
    "JPMORGAN": "JPM", "JP MORGAN": "JPM", "GOLDMAN SACHS": "GS",
    "BANK OF AMERICA": "BAC", "WELLS FARGO": "WFC", "MORGAN STANLEY": "MS",
    "JOHNSON AND JOHNSON": "JNJ", "JOHNSON & JOHNSON": "JNJ",
    "UNITEDHEALTH": "UNH", "CVS HEALTH": "CVS", "HOME DEPOT": "HD",
    "EXXON": "XOM", "EXXONMOBIL": "XOM", "CHEVRON": "CVX",
    "AT&T": "T", "VERIZON": "VZ", "COMCAST": "CMCSA",
    "CATERPILLAR": "CAT", "3M": "MMM", "IBM": "IBM",
    "LEIDOS": "LDOS", "BOOZ ALLEN": "BAH", "BOOZ ALLEN HAMILTON": "BAH", "SAIC": "SAIC", "TEXTRON": "TXT", "TRANSDIGM": "TDG",
    "CAE": "CAE", "CAE INC": "CAE", "CAE INC.": "CAE",
    "INTEL": "INTC", "AMD": "AMD", "SALESFORCE": "CRM", "ORACLE": "ORCL",
    // International (ADRs)
    "BAE SYSTEMS": "BAESY", "BAE": "BAESY",
    "LEONARDO": "FINMY", "LEONARDO SPA": "FINMY", "LEONARDO S.P.A.": "FINMY",
    "THALES": "THLEF", "SAAB": "SAABF", "RHEINMETALL": "RNMBY",
    "AIRBUS": "EADSY", "ROLLS ROYCE": "RYCEY", "ROLLS-ROYCE": "RYCEY",
    "SHELL": "SHEL", "BP": "BP", "TOYOTA": "TM",
    "TSMC": "TSM", "ALIBABA": "BABA", "SONY": "SONY", "CHEVRON": "CVX",
    "GOLDMAN SACHS": "GS", "JPMORGAN": "JPM", "CITIGROUP": "C",
    "EXXON": "XOM", "HOME DEPOT": "HD", "HOMEDEPOT": "HD",
    "COSTCO": "COST", "TARGET": "TGT", "GENERAL MOTORS": "GM",
    "INTEL": "INTC", "CISCO": "CSCO", "UNITEDHEALTH": "UNH",
    "BANK OF AMERICA": "BAC", "JOHNSON & JOHNSON": "JNJ",
    "JOHNSON AND JOHNSON": "JNJ", "BIOGEN": "BIIB",
    "WENDYS": "WEN", "WENDY'S": "WEN", "TAKEDA": "TAK",
    "ASTELLAS": "4503.T",
    "PALANTIR": "PLTR",
    "AMENTUM": "AMTM",
    "V2X": "VVX", "V2X INC": "VVX",
    "STANDARDAERO": "SAX", "STANDARD AERO": "SAX",
    "PARSONS": "PSN", "PARSONS CORPORATION": "PSN",
    "MANTECH": "MANT",
    "SPIRIT AEROSYSTEMS": "SPR", "SPIRIT AERO": "SPR",
    "MERCURY SYSTEMS": "MRCY",
    "HOWMET": "HWM", "HOWMET AEROSPACE": "HWM",
    "HEICO": "HEI",
    "BWX TECHNOLOGIES": "BWXT", "BWX": "BWXT",
    "KRATOS": "KTOS", "KRATOS DEFENSE": "KTOS",
    "VIASAT": "VSAT",
    "ELBIT": "ESLT", "ELBIT SYSTEMS": "ESLT",
    "SAFRAN": "SAFRY",
    "DASSAULT": "DUAVF", "DASSAULT AVIATION": "DUAVF",
    "BABCOCK": "BCIGY", "BABCOCK INTERNATIONAL": "BCIGY",
    "QINETIQ": "QNTQF",
    "TTM TECHNOLOGIES": "TTMI",
    "KEYSIGHT": "KEYS", "KEYSIGHT TECHNOLOGIES": "KEYS",
    "TELEDYNE": "TDY", "TELEDYNE TECHNOLOGIES": "TDY",
    "MOOG": "MOG.A",
    // Tech companies
    "TSMC": "TSM", "TAIWAN SEMICONDUCTOR": "TSM",
    "BROADCOM": "AVGO",
    "ASML": "ASML",
    "ORACLE": "ORCL",
    "MICRON": "MU", "MICRON TECHNOLOGY": "MU",
    "SAMSUNG": "SSNLF",
    "ADVANCED MICRO DEVICES": "AMD",
    "CISCO": "CSCO",
    "APPLIED MATERIALS": "AMAT",
    "LAM RESEARCH": "LRCX",
    "KLA": "KLAC", "KLA CORPORATION": "KLAC",
    "TEXAS INSTRUMENTS": "TXN",
    "SHOPIFY": "SHOP",
    "ARISTA NETWORKS": "ANET",
    "ANALOG DEVICES": "ADI",
    "QUALCOMM": "QCOM",
    "PALO ALTO NETWORKS": "PANW", "PALO ALTO": "PANW",
    "SERVICENOW": "NOW",
    "SONY": "SONY",
    "ARM HOLDINGS": "ARM", "ARM": "ARM",
    "TOKYO ELECTRON": "TOELY",
    "ADOBE": "ADBE",
    "CORNING": "GLW",
    "CROWDSTRIKE": "CRWD",
    "DELL TECHNOLOGIES": "DELL",
    "WESTERN DIGITAL": "WDC",
    "SYNOPSYS": "SNPS",
    "CADENCE": "CDNS", "CADENCE DESIGN": "CDNS",
    "SEAGATE": "STX",
    "MARVELL": "MRVL",
    "MOTOROLA SOLUTIONS": "MSI",
    "CLOUDFLARE": "NET",
    "SNOWFLAKE": "SNOW",
    "FORTINET": "FTNT",
    "AUTODESK": "ADSK",
    "TE CONNECTIVITY": "TEL",
    "INFINEON": "IFNNY",
    "INFOSYS": "INFY",
    "NXP": "NXPI", "NXP SEMICONDUCTORS": "NXPI",
    "GARMIN": "GRMN",
    "NOKIA": "NOK",
    "ERICSSON": "ERIC",
    "DATADOG": "DDOG",
    "WORKDAY": "WDAY",
    "ROPER TECHNOLOGIES": "ROP",
    "TERADYNE": "TER",
    "XIAOMI": "XIACY",
    // Healthcare
    "ELI LILLY": "LLY", "LILLY": "LLY",
    "JOHNSON & JOHNSON": "JNJ", "J&J": "JNJ",
    "ABBVIE": "ABBV",
    "UNITEDHEALTH": "UNH", "UNITED HEALTH": "UNH",
    "AMGEN": "AMGN",
    "ABBOTT": "ABT", "ABBOTT LABORATORIES": "ABT",
    "THERMO FISHER": "TMO", "THERMO FISHER SCIENTIFIC": "TMO",
    "GILEAD": "GILD", "GILEAD SCIENCES": "GILD",
    "INTUITIVE SURGICAL": "ISRG",
    "STRYKER": "SYK",
    "DANAHER": "DHR",
    "BRISTOL-MYERS SQUIBB": "BMY", "BRISTOL MYERS SQUIBB": "BMY",
    "HCA HEALTHCARE": "HCA",
    "VERTEX PHARMACEUTICALS": "VRTX", "VERTEX": "VRTX",
    "MCKESSON": "MCK",
    "BOSTON SCIENTIFIC": "BSX",
    "CVS HEALTH": "CVS",
    "REGENERON": "REGN",
    "CIGNA": "CI",
    "CENCORA": "COR",
    "ELEVANCE HEALTH": "ELV",
    "BECTON DICKINSON": "BDX",
    "ZOETIS": "ZTS",
    "CARDINAL HEALTH": "CAH",
    "IDEXX": "IDXX", "IDEXX LABORATORIES": "IDXX",
    "EDWARDS LIFESCIENCES": "EW",
    "RESMED": "RMD",
    "GE HEALTHCARE": "GEHC",
    "AGILENT": "A", "AGILENT TECHNOLOGIES": "A",
    "VEEVA": "VEEV", "VEEVA SYSTEMS": "VEEV",
    "IQVIA": "IQV",
    "WATERS CORPORATION": "WAT",
    "NATERA": "NTRA",
    "BIOGEN": "BIIB",
    "DEXCOM": "DXCM",
    "ROYALTY PHARMA": "RPRX",
    "ALNYLAM": "ALNY",
    "BEONE MEDICINES": "ONC", "BEIGENE": "ONC",
    "INSMED": "INSM",
    "ROCHE": "RHHBY",
    "NOVARTIS": "NVS",
    "ASTRAZENECA": "AZN",
    "NOVO NORDISK": "NVO",
    "MEDTRONIC": "MDT",
    "ESSILORLUXOTTICA": "ESLOY",
    "SANOFI": "SNY",
    "TAKEDA": "TAK",
    "ARGENX": "ARGX",
    "CSL LIMITED": "CSLLY", "CSL": "CSLLY",
    "HALEON": "HLN",
    "TEVA": "TEVA",
    "PHILIPS": "PHG",
    "BIONTECH": "BNTX",
    "BAYER": "BAYRY",
    "MERCK KGAA": "MKKGY",
    "SIEMENS HEALTHINEERS": "SMMNY",
    "FRESENIUS": "FSNUY",
    "DAIICHI SANKYO": "DSNKY",
    "OTSUKA": "OTSKY",
    "LONZA": "LZAGY",
    "GALDERMA": "GALDY",
    "ASTELLAS": "ALPMY", "ASTELLAS PHARMA": "ALPMY",
    "SANDOZ": "SDZNY",
    "UBIQUITI": "UI",
    "BLOCK": "XYZ", "BLOCK INC": "XYZ", "SQUARE": "XYZ",
    "COREWEAVE": "CRWV",
    "CIENA": "CIEN",
    "LUMENTUM": "LITE",
    "FOXCONN": "HNHPF", "HON HAI": "HNHPF",
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
        // If ticker not recognized (OTC pink sheet), treat as failure
        if (!json.name || json.name === 'undefined') throw new Error('Ticker not recognized');

        // Use resolved symbol to also check fallback DB (e.g. "palantir" resolves to "PLTR")
        var resolvedSym = (json.resolvedSymbol || symbol).toUpperCase();
        var db = FALLBACK_DB[resolvedSym] || FALLBACK_DB[symbol.toUpperCase()];
        if (db) {
            if (!json.emps)   json.emps   = db.emps;
            if (json.profit === null || json.profit === undefined) json.profit = db.profit;
            if (json.ebitda === null || json.ebitda === undefined) json.ebitda = db.ebitda;
            json.name = json.name || db.name;
            json.logo = json.logo || db.logo;
        }
        // Clean up ugly legal names from EDGAR e.g. "NORTHROP GRUMMAN CORP /DE/"
        if (json.name) {
            json.name = json.name
                .replace(/\s*\/[A-Z]{2,}\/\s*$/, '')   // strip /DE/ first
                .replace(/,?\s+(Corp\.?|Inc\.?|Ltd\.?|LLC|Co\.?|Holdings?|Group|Corporation|Limited|plc)\.?\s*$/i, '')
                .replace(/,?\s+(Corp\.?|Inc\.?|Ltd\.?|LLC|Co\.?|Holdings?|Group|Corporation|Limited|plc)\.?\s*$/i, '') // run twice for "TECHNOLOGIES, INC."
                .trim()
                .replace(/(?<![a-z])([A-Z]{2,})(?![a-z])/g, function(m) {
                    // Keep short all-caps tokens as-is: RTX, IBM, CVS
                    if (m.length <= 4) return m;
                    // Title-case longer all-caps words: HARRIS -> Harris, TECHNOLOGIES -> Technologies
                    return m.charAt(0) + m.slice(1).toLowerCase();
                })
                .replace(/\b(L\d+)([A-Z]+)/g, function(m, prefix, rest) {
                    // Handle alphanumeric prefixes: L3HARRIS -> L3Harris
                    return prefix + rest.charAt(0) + rest.slice(1).toLowerCase();
                });
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
                return await fetchFromAPI(symbol, false);
            } else {
                return await fetchFromAPI(input, true);
            }
        } catch(err) {
            console.warn('Direct fetch failed: ' + err.message);
            // If direct ticker lookup failed, try resolving as a company name
            if (looksLikeTicker && symbol === upper) {
                try {
                    return await fetchFromAPI(input, true);
                } catch(err2) {
                    console.warn('Name resolution also failed: ' + err2.message);
                }
            }
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

            // Null guards - default to 0 if missing
            if (data.profit === null || data.profit === undefined) data.profit = 0;
            if (data.ebitda === null || data.ebitda === undefined) data.ebitda = data.profit > 0 ? Math.round(data.profit * 1.3) : 0;
            // If emps missing, we can't calculate - but give a helpful message
            if (!data.emps) {
                var ticker = data.resolvedSymbol || symbol;
                var msg = 'Could not find employee count for ' + (data.name || ticker) + '.';
                if (ticker && ticker !== symbol.toUpperCase()) msg += ' (resolved to ticker: ' + ticker + ')';
                msg += '\n\nThis usually means the company does not publicly disclose headcount. Try searching by ticker symbol: ' + ticker;
                alert(msg);
                if (loadingMsg) loadingMsg.classList.add('hidden');
                return;
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
                            (!data.hasOneTimeItem ? '<p style="margin-bottom:8px;">If you got to keep your fair share of what <strong>' + data.name + '</strong> said they made (net income), your salary would be <strong>$' + netTotal.toLocaleString() + '</strong> - that is <strong>' + fmtSurplus(distributedSurplus) + '</strong> than what you made.</p>' +
                            '<div style="font-size:1.8em; font-weight:bold; color:#1b5e20;">$' + netTotal.toLocaleString() + '</div>' : '') +
                        '</div>' +
                        '<div style="margin-bottom:25px;">' +
                            '<p style="margin-bottom:8px;">If you got to keep your fair share of what <strong>' + data.name + '</strong> actually made (EBITDA), your salary would be <strong>$' + ebitdaTotal.toLocaleString() + '</strong> - that is <strong>' + fmtSurplus(accountingSurplus) + '</strong> than what you made.</p>' +
                            '<div style="font-size:1.8em; font-weight:bold; color:#0d47a1;">$' + ebitdaTotal.toLocaleString() + '</div>' +
                        '</div>' +
                        '<div style="margin-top:20px; padding-top:20px; border-top: 1px solid #eee;">' +
                            (accountingSurplus >= 0
                            ? '<p><strong>' + data.name + '</strong> kept <strong>$' + accountingSurplus.toLocaleString() + '</strong> from your labor (based on EBITDA).</p>'
                            : '<p><strong>' + data.name + '</strong> did not profit from your labor this period (based on EBITDA).</p>') +
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
