const API_KEY = "3gPWbjHBHWaeswUkIvjGjN6Ei3SxifLL";

// 1. TAX CALCULATOR (2026 Brackets)
function calculateFederalTax(grossIncome) {
    const standardDeduction = 16100;
    const taxable = Math.max(0, grossIncome - standardDeduction);
    if (taxable <= 12400) return Math.round(taxable * 0.10);
    if (taxable <= 50400) return Math.round(1240 + (taxable - 12400) * 0.12);
    return Math.round(5800 + (taxable - 50400) * 0.22);
}

// 2. LIVE DATA FETCHER
async function fetchCompanyStats(query) {
    try {
        // Step A: Search for the Ticker (e.g., "Apple" -> "AAPL")
        const searchRes = await fetch(`https://financialmodelingprep.com/api/v3/search?query=${query}&limit=1&apikey=${API_KEY}`);
        const searchData = await searchRes.json();
        
        if (!searchData || searchData.length === 0) return null;
        const symbol = searchData[0].symbol;

        // Step B: Get Employee Count (Profile) and Income Statement
        const [profileRes, incomeRes] = await Promise.all([
            fetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${API_KEY}`),
            fetch(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=1&apikey=${API_KEY}`)
        ]);

        const profile = await profileRes.json();
        const income = await incomeRes.json();

        if (!profile[0] || !income[0]) return null;

        return {
            name: profile[0].companyName,
            employees: profile[0].fullTimeEmployees || 1, 
            netIncome: income[0].netIncome,
            symbol: symbol
        };
    } catch (err) {
        console.error("API Error:", err);
        return null;
    }
}

// 3. UI CONTROLLER
document.getElementById('calculateBtn').addEventListener('click', async () => {
    const query = document.getElementById('company').value.trim();
    if (!query) return alert("Please enter a company name.");

    // Loading State
    const btn = document.getElementById('calculateBtn');
    btn.innerText = "Searching SEC Filings...";
    btn.disabled = true;
    
    const data = await fetchCompanyStats(query);
    
    btn.innerText = "Calculate My Share";
    btn.disabled = false;

    if (!data || !data.employees || !data.netIncome) {
        alert("Company not found or private. Try a public company like 'Apple' or 'Ford'.");
        return;
    }

    // Logic Math (Hours & Weeks)
    const isHourly = !document.getElementById('hourlyInputs').classList.contains('hidden');
    let userYearlyIncome = 0;
    let timeFraction = 1;

    if (isHourly) {
        const wage = parseFloat(document.getElementById('hourlyWage').value) || 0;
        const hours = parseFloat(document.getElementById('hoursPerWeek').value) || 0;
        const weeks = parseFloat(document.getElementById('weeksWorked').value) || 0;
        userYearlyIncome = wage * hours * weeks;
        timeFraction = (hours * weeks) / 2080; // Standard work year
    } else {
        userYearlyIncome = parseFloat(document.getElementById('annualSalary').value) || 0;
        timeFraction = 1;
    }

    // THE FAIR SHARE CALCULATION
    const officialSharePerEmp = (data.netIncome / data.employees) * timeFraction;
    const realSharePerEmp = officialSharePerEmp * 1.65; // Est. Cash Flow multiplier
    const userTax = calculateFederalTax(userYearlyIncome);

    // Update Results UI
    document.getElementById('officialAmount').innerText = `+$${Math.round(officialSharePerEmp).toLocaleString()}`;
    document.getElementById('realAmount').innerText = `+$${Math.round(realSharePerEmp).toLocaleString()}`;
    
    const ratio = userTax > 0 ? (officialSharePerEmp / userTax).toFixed(1) : "Infinite";
    
    document.getElementById('taxResults').innerHTML = `
        <div class="comparison-box">
            <p><strong>${data.name}</strong> (${data.symbol})</p>
            <p>Reported Headcount: <strong>${parseInt(data.employees).toLocaleString()}</strong></p>
            <hr style="margin: 15px 0; border: 0; border-top: 1px solid #eee;">
            <p>Your Federal Tax: <strong>$${userTax.toLocaleString()}</strong></p>
            <p>Your Surplus Share: <strong>$${Math.round(officialSharePerEmp).toLocaleString()}</strong></p>
            <p class="highlight">The Corporate "Tax" on your labor is ${ratio}x higher than your Federal Tax.</p>
        </div>`;

    document.getElementById('results').classList.remove('hidden');
});

// UI Toggles
document.getElementById('hourlyToggle').onclick = () => {
    document.getElementById('hourlyInputs').classList.remove('hidden');
    document.getElementById('salaryInputs').classList.add('hidden');
    document.getElementById('hourlyToggle').classList.add('active');
    document.getElementById('annualToggle').classList.remove('active');
};
document.getElementById('annualToggle').onclick = () => {
    document.getElementById('salaryInputs').classList.remove('hidden');
    document.getElementById('hourlyInputs').classList.add('hidden');
    document.getElementById('annualToggle').classList.add('active');
    document.getElementById('hourlyToggle').classList.remove('active');
};
