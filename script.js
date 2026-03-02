const API_KEY = "3gPWbjHBHWaeswUkIvjGjN6Ei3SxifLL";

// 1. UPDATED 2026 TAX CALCULATOR (Reflecting OBBBA adjustments)
function calculateFederalTax(grossIncome) {
    const standardDeduction = 16100; // 2026 Single Filer
    const taxable = Math.max(0, grossIncome - standardDeduction);
    
    // 2026 Marginal Brackets
    if (taxable <= 12400) return Math.round(taxable * 0.10);
    if (taxable <= 50400) return Math.round(1240 + (taxable - 12400) * 0.12);
    if (taxable <= 105700) return Math.round(5800 + (taxable - 50400) * 0.22);
    return Math.round(17966 + (taxable - 105700) * 0.24);
}

// 2. LIVE DATA FETCHER
async function fetchCompanyStats(symbol) {
    try {
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
            symbol: symbol,
            currency: profile[0].currency || "USD"
        };
    } catch (err) { return null; }
}

// 3. AUTOCOMPLETE LOGIC
const companyInput = document.getElementById('company');
const dataList = document.getElementById('companyList');

companyInput.addEventListener('input', async (e) => {
    const query = e.target.value;
    if (query.length < 3) return;

    try {
        const res = await fetch(`https://financialmodelingprep.com/api/v3/search?query=${query}&limit=5&apikey=${API_KEY}`);
        const results = await res.json();
        
        dataList.innerHTML = ""; 
        results.forEach(item => {
            const option = document.createElement('option');
            option.value = item.symbol; 
            option.textContent = item.name;
            dataList.appendChild(option);
        });
    } catch (err) { console.error("Search error", err); }
});

// 4. CALCULATION BUTTON
document.getElementById('calculateBtn').addEventListener('click', async () => {
    const symbol = companyInput.value.toUpperCase().trim();
    const btn = document.getElementById('calculateBtn');
    
    btn.innerText = "Analyzing Filings...";
    const data = await fetchCompanyStats(symbol);
    btn.innerText = "Calculate My Share";

    if (!data) return alert("Please select a valid company from the list.");

    const isHourly = !document.getElementById('hourlyInputs').classList.contains('hidden');
    let income = 0, timeFrac = 1;

    if (isHourly) {
        const wage = parseFloat(document.getElementById('hourlyWage').value) || 0;
        const hours = parseFloat(document.getElementById('hoursPerWeek').value) || 0;
        const weeks = parseFloat(document.getElementById('weeksWorked').value) || 0;
        income = wage * hours * weeks;
        timeFrac = (hours * weeks) / 2080;
    } else {
        income = parseFloat(document.getElementById('annualSalary').value) || 0;
        timeFrac = 1;
    }

    const userShare = Math.round((data.netIncome / data.employees) * timeFrac);
    const tax = calculateFederalTax(income);

    document.getElementById('officialAmount').innerText = `+$${userShare.toLocaleString()}`;
    document.getElementById('realAmount').innerText = `+$${Math.round(userShare * 1.65).toLocaleString()}`;
    
    document.getElementById('taxResults').innerHTML = `
        <div class="comparison-box">
            <p><strong>${data.name}</strong> (${data.symbol})</p>
            <p>Current Headcount: <strong>${data.employees.toLocaleString()}</strong></p>
            <hr style="margin: 10px 0; border: 0; border-top: 1px solid #eee;">
            <p>Your Estimated Fed Tax: $${tax.toLocaleString()}</p>
            <p>Your Surplus Value: $${userShare.toLocaleString()}</p>
            <p class="highlight">${(userShare/tax).toFixed(1)}x "Corporate Tax" Gap</p>
            
            <p style="font-size: 0.7rem; color: #999; margin-top: 15px; font-style: italic; line-height: 1.2;">
                *Disclaimer: Calculations are based on the most recent mandatory SEC 10-K filings. 
                Federal tax is an estimate for a single filer with a standard deduction ($16,100). 
                "Real Cash Flow" is an industry-standard projection (1.65x Net Income).
            </p>
        </div>`;
    document.getElementById('results').classList.remove('hidden');
});

// UI Toggles (Annual/Hourly)
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
