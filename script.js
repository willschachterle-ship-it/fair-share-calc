// Notes shown on results for companies that are acquired, merged, or bankrupt
const COMPANY_CONTEXT = {
    // Acquired / merged
    "MMP":   "⚠️ Magellan Midstream Partners was acquired by ONEOK in 2023 and no longer trades independently. These figures are from its last reported year as a public company.",
    "PARA":  "⚠️ Paramount Global merged with Skydance Media in 2024 and was taken private. These figures are from its last reported year as a public company.",
    "SAFM":  "⚠️ Sanderson Farms was taken private by Cargill and Continental Grain in 2022. These figures are from its last reported year as a public company.",
    "SWM":   "⚠️ Schweitzer-Mauduit International renamed itself Mativ Holdings (MATV) in 2022 after merging with Neenah Inc. Try searching MATV for current data.",
    "FBHS":  "⚠️ Fortune Brands Home & Security split into two separate companies in 2023: Fortune Brands Innovations (FBIN) and MasterBrand Cabinets (MBC). The ticker FBHS no longer trades.",
    "FOE":   "⚠️ Ferro Corporation was acquired by Prince International in 2022 and is no longer publicly traded. These figures are from its last reported year as a public company.",
    "AUY":   "⚠️ Yamana Gold was acquired by Pan American Silver (PAAS) in 2023. These figures are from its last reported year as a public company.",
    "NCR":   "⚠️ NCR Corporation split into two separate public companies in 2023: NCR Atleos (NATL) and NCR Voyix (VYX). The ticker NCR no longer trades.",
    "LHCG":  "⚠️ LHC Group was acquired by Optum (a UnitedHealth subsidiary) in 2023. These figures are from its last reported year as a public company.",
    "MDC":   "⚠️ MDC Holdings was acquired by Sumitomo Forestry in 2024 and renamed Sekisui House. These figures are from its last reported year as a public company.",
    "LUPE":  "⚠️ Lundin Petroleum merged into Lundin Energy, which was then acquired by APA Corporation in 2022. These figures are from its last reported year as a public company.",
    "CPE":   "⚠️ Callon Petroleum was acquired by APA Corporation in 2024. These figures are from its last reported year as a public company.",
    "AIMC":  "⚠️ Altra Industrial Motion merged with Regal Beloit to form Regal Rexnord (RRX) in 2022. The ticker AIMC no longer trades — try RRX for current data.",
    "TMST":  "⚠️ TimkenSteel renamed itself Metallus (MTUS) in 2024. These figures are from its last reported period under the old ticker.",
    "OSTK":  "⚠️ Overstock.com renamed itself Beyond, Inc. (BYON) in 2023. Try searching BYON for current data.",
    "KMPH":  "⚠️ KemPharm was acquired by Aquestive Therapeutics in 2022. These figures are from its last reported year as a public company.",
    "CDK":   "⚠️ CDK Global was taken private by Brookfield Business Partners in 2022. These figures are from its last reported year as a public company.",
    "SEND":  "⚠️ SendGrid was acquired by Twilio (TWLO) in 2019. These figures are from its last reported year as a public company — try TWLO for current data.",
    "PRSP":  "⚠️ Perspecta was acquired by Peraton (a private company) in 2021. These figures are from its last reported year as a public company.",
    "CCMP":  "⚠️ CMC Materials was acquired by Entegris (ENTG) in 2022. These figures are from its last reported year as a public company.",
    "LSI":   "⚠️ Life Storage merged with Extra Space Storage (EXR) in 2023. Try searching EXR for current data.",
    "WRI":   "⚠️ Weingarten Realty was acquired by Kimco Realty (KIM) in 2021. Try searching KIM for current data.",
    "CFX":   "⚠️ Colfax Corporation split into two companies in 2022: ESAB Corporation (ESAB) and Enovis Corporation (ENOV). The ticker CFX no longer trades.",
    "USAK":  "⚠️ USA Truck was acquired by Knight-Swift Transportation (KNX) in 2022. Try searching KNX for current data.",
    "PTSI":  "⚠️ P.A.M. Transport Services was acquired by Heartland Express in 2022. These figures are from its last reported year as a public company.",
    "ECHO":  "⚠️ Echo Global Logistics was taken private by The Jordan Company in 2021. These figures are from its last reported year as a public company.",
    "TRTN":  "⚠️ Triton International was acquired by Brookfield Infrastructure in 2023. These figures are from its last reported year as a public company.",
    "PACW":  "⚠️ PacWest Bancorp merged with Banc of California (BANC) in 2023. Try searching BANC for current data.",
    "USD":   "⚠️ US Silica Holdings was taken private by Apollo Global Management in 2018. These figures are from its last reported year as a public company.",
    "CDAY":  "⚠️ Ceridian HCM rebranded to Dayforce and trades as DAY since 2024. Try searching DAY for current data.",
    // Merged tickers
    "CBTX":  "⚠️ CommunityBank of Texas merged into Stellar Bank (STEL) in 2022 and no longer trades as CBTX. These figures are from its last reported year as a public company.",
    "STEL":  "ℹ️ Stellar Bank (STEL) was formed in 2022 by the merger of Allegiance Bank and CommunityBank of Texas. The data shown reflects the combined entity.",
    // Bankrupt / delisted
    "REV":   "⚠️ Revlon filed for Chapter 11 bankruptcy in June 2022 and was subsequently delisted. It emerged from bankruptcy in May 2023 as a private company. These figures are from its last reported year as a public company (FY2021).",
    "BIG":   "⚠️ Big Lots filed for bankruptcy in September 2024. Its store leases were acquired by Nexus Capital. These figures are from its last reported year as a public company.",
    "JOANN": "⚠️ JOANN Inc. filed for bankruptcy in March 2024 and was liquidated. These figures are from its last reported year as a public company.",
    "SAVE":  "⚠️ Spirit Airlines filed for bankruptcy in November 2024 and its shares were delisted. These figures are from its last reported year as a public company.",

    "PRTY":  "⚠️ Party City filed for bankruptcy and closed all stores in 2023. These figures are from its last reported year as a public company.",
    "YRCW":  "⚠️ Yellow Corporation (formerly YRC Worldwide) filed for bankruptcy and shut down in 2023. These figures are from its last reported year as a public company.",
    "HZN":   "⚠️ Horizon Global filed for bankruptcy and was delisted in 2023. These figures are from its last reported year as a public company.",
    "NGAS":  "⚠️ Gastar Exploration filed for bankruptcy in 2018 and was delisted. These figures are historical.",
    "PREIT": "⚠️ Pennsylvania REIT (PREIT) filed for bankruptcy in 2023 and was delisted. These figures are from its last reported year as a public company.",
    "GVNBV": "⚠️ Glatfelter (traded as GVNBV on OTC) was acquired by Solenis in 2024. These figures are from its last reported year as a public company.",
    "CCHWF": "ℹ️ Cresco Labs is a U.S. cannabis company traded OTC on Canadian markets as CCHWF. Financial data may be limited due to OTC trading status.",
    "BRKS":  "⚠️ Brooks Automation split in 2021: its semiconductor automation division became Azenta (AZTA), while its life sciences division continues as Brooks Life Sciences (private). Search AZTA for current data.",
    "LR":    "ℹ️ LR is not an active ticker. Loews Corporation trades as L.",
    "ROPER": "ℹ️ ROPER is not the correct ticker. Roper Technologies trades as ROP.",
    "CREE":  "⚠️ CREE was Wolfspeed's former ticker. Wolfspeed now trades as WOLF.",
    "NBT":   "ℹ️ NBT is not the standard ticker. NBT Bancorp trades as NBTB.",
    "NWIN":  "⚠️ Northwest Indiana Bancorp was delisted and is no longer actively traded. These figures are from its last reported period.",
};

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
    // Delisted / special cases — route to ticker so fallback DB can serve them
    "REVLON": "REV",
    "CHEESECAKE FACTORY": "CAKE", "THE CHEESECAKE FACTORY": "CAKE",
    "DELEK": "DK", "DELEK US": "DK", "DELEK US HOLDINGS": "DK",
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
            if (!json.profit)  json.profit = db.profit;   // treat 0 same as missing
            if (!json.ebitda)  json.ebitda = db.ebitda;   // treat 0 same as missing
            json.name = json.name || db.name;
            json.logo = json.logo || db.logo;
        }
        // Clean up ugly legal names from EDGAR e.g. "NORTHROP GRUMMAN CORP /DE/"
        if (json.name) {
            json.name = json.name
                .replace(/\s*\/[A-Z]{2,}\/\s*$/, '')   // strip /DE/ first
                .replace(/,?\s+(Corp\.?|Inc\.?|Ltd\.?|LLC|Co\.?|Holdings?|Group|Corporation|Limited|plc)\.?\s*$/i, '')
                .replace(/,?\s+(Corp\.?|Inc\.?|Ltd\.?|LLC|Co\.?|Holdings?|Group|Corporation|Limited|plc)\.?\s*$/i, '') // run twice for "TECHNOLOGIES, INC."
                .replace(/\s*\(US\)\s*$/i, '')  // strip Finnhub's (US) disambiguation suffix
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
        json._queriedSymbol = symbol.toUpperCase();
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

            // Null/zero guards — treat null/undefined as 0; preserve negatives
            if (data.profit == null)  data.profit = 0;
            if (data.ebitda == null)  data.ebitda = data.profit > 0 ? Math.round(data.profit * 1.3) : 0;
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

            // Financial state flags
            var profitNegative = data.profit < 0;
            var ebitdaNegative = data.ebitda < 0;

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

            // Helper: format large dollar amounts compactly (e.g. $1.3B, $412M)
            var fmtBig = function(n) {
                var abs = Math.abs(n), sign = n < 0 ? '-' : '';
                if (abs >= 1e9) return sign + '$' + (abs / 1e9).toFixed(1) + 'B';
                if (abs >= 1e6) return sign + '$' + (abs / 1e6).toFixed(0) + 'M';
                return sign + '$' + abs.toLocaleString();
            };

            // ── Net income section ──────────────────────────────────────────
            var netIncomeSection;
            if (data.hasOneTimeItem) {
                netIncomeSection =
                    '<p style="font-size:0.85em; color:#e65100; margin:0 0 12px 0; padding:10px 12px; background:#fff3e0; border-left:3px solid #e65100; border-radius:4px;">' +
                    '⚠️ <strong>Heads up:</strong> ' + data.name + ' officially reported <strong>' + fmtBig(data.profit) + ' in net income</strong> this year — which would have meant <strong>$' + Math.round(data.profit / data.emps).toLocaleString() + ' per worker</strong> if it had been shared. But this figure includes a one-time windfall (like a tax benefit or asset write-off) unrelated to the day-to-day work of its employees. The calculations below use EBITDA, which reflects recurring operational profit.' +
                    '</p>';
            } else if (profitNegative) {
                netIncomeSection =
                    '<div style="margin-bottom:16px; padding:12px 14px; background:#fce4ec; border-left:3px solid #c62828; border-radius:4px;">' +
                    '<p style="margin:0; font-size:0.9em; color:#b71c1c;"><strong>' + data.name + ' reported a net loss of ' + fmtBig(data.profit) + ' this year</strong> — burning roughly <strong>$' + Math.abs(Math.round(data.profit / data.emps)).toLocaleString() + ' per employee</strong> more than they earned. Based on net income, there is no profit to share.</p>' +
                    '</div>';
            } else {
                netIncomeSection =
                    '<p style="margin-bottom:4px;">If you got to keep your fair share of what <strong>' + data.name + '</strong> said they made, <strong>' + fmtBig(effectiveProfit) + '</strong>, your salary would be</p>' +
                    '<div style="font-size:1.8em; font-weight:bold; color:#1b5e20;">$' + netTotal.toLocaleString() + '</div>' +
                    '<a href="how-it-works.html#net-income" target="_blank" style="font-size:0.78em; color:#1565c0; display:block; margin-top:6px;">How was this calculated?</a>';
            }

            // ── EBITDA section ──────────────────────────────────────────────
            var ebitdaSection;
            if (ebitdaNegative) {
                ebitdaSection =
                    '<div style="padding:12px 14px; background:#fce4ec; border-left:3px solid #c62828; border-radius:4px;">' +
                    '<p style="margin:0; font-size:0.9em; color:#b71c1c;"><strong>' + data.name + ' also ran at an operating loss (EBITDA: ' + fmtBig(data.ebitda) + ')</strong> — burning roughly <strong>$' + Math.abs(Math.round(data.ebitda / data.emps)).toLocaleString() + ' per employee</strong> in operating costs. There is no operating surplus to distribute either.</p>' +
                    '</div>';
            } else {
                ebitdaSection =
                    '<p style="margin-bottom:4px;">If you got to keep your fair share of what <strong>' + data.name + '</strong> actually made, <strong>' + fmtBig(data.ebitda) + '</strong>, your salary would be</p>' +
                    '<div style="font-size:1.8em; font-weight:bold; color:#0d47a1;">$' + ebitdaTotal.toLocaleString() + '</div>' +
                    '<a href="how-it-works.html#ebitda" target="_blank" style="font-size:0.78em; color:#1565c0; display:block; margin-top:6px;">How was this calculated?</a>';
            }

            // ── Summary line ────────────────────────────────────────────────
            var summaryLine;
            if (ebitdaNegative) {
                summaryLine = '<p><strong>' + data.name + '</strong> burned roughly <strong>$' + Math.abs(accountingSurplus).toLocaleString() + ' per worker</strong> more than they made this period.</p>';
            } else if (accountingSurplus >= 0) {
                summaryLine = '<p><strong>' + data.name + '</strong> kept <strong>$' + accountingSurplus.toLocaleString() + '</strong> from you.</p>';
            } else {
                summaryLine = '<p><strong>' + data.name + '</strong> did not profit this period.</p>';
            }

            // ── Data sources line ───────────────────────────────────────────
            var sourcesLine = '';
            if (data._sources) {
                var SRC_LABELS = {
                    edgar: 'SEC EDGAR', fmp: 'Financial Modeling Prep',
                    finnhub: 'Finnhub', alphavantage: 'Alpha Vantage',
                    wikipedia: 'Wikipedia', '10k': 'SEC 10-K',
                    stockanalysis: 'StockAnalysis.com', cmc: 'CompaniesMarketCap.com',
                    yahoo: 'Yahoo Finance', claude: 'Claude (training data)',
                    verified: 'Manually verified', estimated: 'Estimated from net income'
                };
                var s = data._sources;
                var parts = [];
                if (s.emps)   parts.push('employees: ' + (SRC_LABELS[s.emps]   || s.emps));
                if (s.profit) parts.push('profit: '    + (SRC_LABELS[s.profit] || s.profit));
                if (s.ebitda) parts.push('EBITDA: '    + (SRC_LABELS[s.ebitda] || s.ebitda));
                if (parts.length) sourcesLine = '<p style="margin:8px 0 0; font-size:0.72em; color:#999;">Sources: ' + parts.join(' · ') + '</p>';
            }

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
                            (COMPANY_CONTEXT[data._queriedSymbol || ''] ? '<p style="font-size:0.85em; color:#6a3d00; margin:0 0 12px 0; padding:10px 12px; background:#fff8e1; border-left:3px solid #f9a825; border-radius:4px;">' + COMPANY_CONTEXT[data._queriedSymbol || ''] + '</p>' : '') +
                            netIncomeSection +
                        '</div>' +
                        '<div style="margin-bottom:25px;">' +
                            ebitdaSection +
                        '</div>' +
                        '<div style="margin-top:20px; padding-top:20px; border-top: 1px solid #eee;">' +
                            summaryLine +
                            '<p style="margin:0 0 2px;"><strong>The federal government</strong> kept <strong>$' + fedTax.toLocaleString() + '</strong> in income tax.</p>' +
                            '<a href="how-it-works.html#summary" target="_blank" style="font-size:0.78em; color:#1565c0;">How are these calculated?</a>' +
                            sourcesLine +
                        '</div>' +
                    '</div>' +
                    '<div style="margin-top:16px; padding:18px 20px; background:#f0f7f0; border:1px solid #c8e6c9; border-radius:12px; font-size:0.85em; color:#2e7d32; line-height:1.6;">' +
                        '<strong>Want to work somewhere you actually share in the profits?</strong> ' +
                        'Worker-owned companies and ESOPs share ownership — and profits — with employees. ' +
                        '<a href="https://www.usfwc.org/find-a-co-op/" target="_blank" rel="noopener" style="color:#1b5e20;">Find a worker co-op near you</a> or ' +
                        '<a href="https://www.nceo.org/articles/esop-employee-stock-ownership-plan" target="_blank" rel="noopener" style="color:#1b5e20;">learn about ESOPs</a>.' +
                    '</div>';
                resultsArea.classList.remove('hidden');
            }
        });
    }

    // ── Autocomplete ──────────────────────────────────────────────────────────
    (function() {
        var companyInput = document.getElementById('company');
        var dropdown = document.getElementById('ac-dropdown');
        if (!companyInput || !dropdown) return;

        // Build suggestion list: prefer AC_COMPANIES (viral500 + FALLBACK_DB, pre-sorted)
        // Fall back to FALLBACK_DB alone if ac_list.js didn't load
        var suggestions = [];
        if (typeof AC_COMPANIES !== 'undefined') {
            suggestions = AC_COMPANIES.map(function(c) { return { name: c.n, ticker: c.t }; });
        } else if (typeof FALLBACK_DB !== 'undefined') {
            Object.keys(FALLBACK_DB).forEach(function(ticker) {
                var e = FALLBACK_DB[ticker];
                if (e && e.name) suggestions.push({ name: e.name, ticker: ticker });
            });
            suggestions.sort(function(a, b) { return a.name.localeCompare(b.name); });
        }

        var activeIdx = -1;
        var currentItems = [];

        function render(items) {
            currentItems = items;
            activeIdx = -1;
            dropdown.innerHTML = '';
            items.forEach(function(item, idx) {
                var div = document.createElement('div');
                div.className = 'ac-item';
                div.innerHTML = '<span class="ac-item-name">' + esc(item.name) + '</span>' +
                                '<span class="ac-item-ticker">' + esc(item.ticker) + '</span>';
                div.addEventListener('mousedown', function(e) {
                    e.preventDefault();
                    companyInput.value = item.ticker;
                    hide();
                });
                div.addEventListener('mouseover', function() { setActive(idx); });
                dropdown.appendChild(div);
            });
            dropdown.style.display = items.length ? 'block' : 'none';
        }

        function hide() {
            dropdown.style.display = 'none';
            activeIdx = -1;
        }

        function setActive(idx) {
            Array.from(dropdown.querySelectorAll('.ac-item')).forEach(function(el, i) {
                el.classList.toggle('active', i === idx);
            });
            activeIdx = idx;
        }

        function esc(s) {
            return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        }

        var timer;
        companyInput.addEventListener('input', function() {
            clearTimeout(timer);
            timer = setTimeout(function() {
                var q = companyInput.value.trim().toLowerCase();
                if (q.length < 2) { hide(); return; }
                var matches = suggestions.filter(function(s) {
                    return s.name.toLowerCase().indexOf(q) !== -1 ||
                           s.ticker.toLowerCase().indexOf(q) === 0;
                }).slice(0, 8);
                render(matches);
            }, 120);
        });

        companyInput.addEventListener('keydown', function(e) {
            if (dropdown.style.display === 'none') return;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActive(Math.min(activeIdx + 1, currentItems.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActive(Math.max(activeIdx - 1, 0));
            } else if (e.key === 'Enter' && activeIdx >= 0) {
                e.preventDefault();
                companyInput.value = currentItems[activeIdx].ticker;
                hide();
            } else if (e.key === 'Escape') {
                hide();
            }
        });

        companyInput.addEventListener('blur', function() {
            setTimeout(hide, 150);
        });
    })();
    // ── End Autocomplete ──────────────────────────────────────────────────────

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
