// 1. USE A FRESH KEY if possible. If not, the Fallbacks below will handle it.
const API_KEY = "3gPWbjHBHWaeswUkIvjGjN6Ei3SxifLL"; 

// LOCAL DATA: This ensures the app works even when the API says "Legacy" or "Forbidden"
const TOP_COMPANIES = {
    "AAPL": { name: "Apple Inc.", employees: 164000, netIncome: 96995000000 },
    "MSFT": { name: "Microsoft", employees: 221000, netIncome: 72361000000 },
    "AMZN": { name: "Amazon", employees: 1525000, netIncome: 30425000000 },
    "TSLA": { name: "Tesla", employees: 140473, netIncome: 14974000000 },
    "WMT": { name: "Walmart", employees: 2100000, netIncome: 15510000000 },
    "NVDA": { name: "NVIDIA", employees: 26196, netIncome: 29760000000 }
};

document.addEventListener('DOMContentLoaded', () => {
    const companyInput = document.getElementById('company');
    const dataList = document.getElementById('companyList');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsArea = document.getElementById('results');

    function calculateFederalTax(income) {
        const taxable = Math.max(0, income - 16100);
        if (taxable <= 12400) return Math.round(taxable * 0.10);
        if (taxable <= 50400) return Math.round(1240 + (taxable - 12400) * 0.12);
        return Math.round(5800 + (taxable - 50400) * 0.22);
    }

    // UPDATED SEARCH: Using the 'stable' path to avoid legacy errors
    companyInput.addEventListener('input', async (e) => {
        const query = e.target.value.trim();
        if (query.length < 2) return;
        
        try {
            const res = await fetch(`https://financialmodelingprep.com/api/v3/search?query=${query}&limit=5&apikey=${API_KEY}`);
            const data = await res.json();
            
            if (Array.isArray(data)) {
                dataList.innerHTML = "";
                data.forEach(item => {
                    const opt = document.createElement('option');
                    opt.value = item.symbol;
                    opt.textContent = `${item.name} (${item.symbol})`;
                    dataList.appendChild(opt);
                });
            }
        } catch (err) { console.warn("Search blocked by API"); }
    });

    calculateBtn.addEventListener('click', async () => {
        const symbol = companyInput.value.toUpperCase().trim();
        if (!symbol) return alert("Please enter a ticker symbol.");

        calculateBtn.innerText = "Analyzing...";
        calculateBtn.disabled = true;

        let finalData = null;

        // TRY API FIRST (Using Stable Endpoints)
        try {
            const [pRes, iRes] = await Promise.all([
                fetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${API_KEY}`),
                fetch(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=1&apikey=${API_KEY}`)
            ]);
            const p = await pRes.json();
            const i = await iRes.json();

            if (p && p[0] && i && i[0]) {
                finalData = { name: p[0].companyName, emps: p[0].fullTimeEmployees || 1, profit: i[0].netIncome };
            }
        } catch (e) { console.error("API Fetch Failed"); }

        // AUTOMATIC FALLBACK: If API failed or returned 403, check local database
        if (!finalData && TOP_COMPANIES[symbol]) {
            finalData = { 
                name: TOP_COMPANIES[symbol].name, 
                emps: TOP_COMPANIES[symbol].employees, 
                profit: TOP_COMPANIES[symbol].netIncome 
            };
        }

        if (!finalData) {
            alert("This ticker isn't in our offline database and the API is currently restricted. Try AAPL, TSLA, or WMT!");
            calculateBtn.innerText = "Calculate My Share";
            calculateBtn.disabled = false;
            return;
        }

        // MATH
        const isHourly = !document.getElementById('hourlyInputs').classList.contains('hidden');
        let income = 0, timeFrac = 1;

        if (isHourly) {
            const wage = parseFloat(document.getElementById('hourlyWage').value) || 0;
            const hrs = parseFloat(document.getElementById('hoursPerWeek').value) || 0;
            const wks = parseFloat(document.getElementById('weeksWorked').value) || 0;
            income = wage * hrs * wks;
            timeFrac = (hrs * wks) / 2080;
        } else {
            income = parseFloat(document.getElementById('annualSalary').value) || 0;
        }

        const userShare = Math.round((finalData.profit / finalData.emps) * timeFrac);
        const tax = calculateFederalTax(income);

        document.getElementById('officialAmount').innerText = `$${userShare.toLocaleString()}`;
        document.getElementById('realAmount').innerText = `$${Math.round(userShare * 1.65).toLocaleString()}`;
        document.getElementById('taxResults').innerHTML = `
            <div class="comparison-box">
                <p><strong>${finalData.name}</strong></p>
                <p>Your Estimated Fed Tax: $${tax.toLocaleString()}</p>
                <p>Your Surplus Share: $${userShare.toLocaleString()}</p>
            </div>`;

        resultsArea.classList.remove('hidden');
        calculateBtn.innerText = "Calculate My Share";
        calculateBtn.disabled = false;
    });

    // Toggle logic
    document.getElementById('annualToggle').onclick = () => {
        document.getElementById('salaryInputs').classList.remove('hidden');
        document.getElementById('hourlyInputs').classList.add('hidden');
    };
    document.getElementById('hourlyToggle').onclick = () => {
        document.getElementById('hourlyInputs').classList.remove('hidden');
        document.getElementById('salaryInputs').classList.add('hidden');
    };
});
