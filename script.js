const API_KEY = "3gPWbjHBHWaeswUkIvjGjN6Ei3SxifLL";

document.addEventListener('DOMContentLoaded', () => {
    
    const companyInput = document.getElementById('company');
    const dataList = document.getElementById('companyList');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsArea = document.getElementById('results');

    // 1. 2026 TAX CALCULATOR (Standard Deduction: $16,100)
    function calculateFederalTax(grossIncome) {
        const taxable = Math.max(0, grossIncome - 16100);
        if (taxable <= 12400) return Math.round(taxable * 0.10);
        if (taxable <= 50400) return Math.round(1240 + (taxable - 12400) * 0.12);
        return Math.round(5800 + (taxable - 50400) * 0.22);
    }

    // 2. AUTOCOMPLETE SEARCH (With 403/Error Protection)
    companyInput.addEventListener('input', async (e) => {
        const query = e.target.value.trim();
        if (query.length < 2) return;

        try {
            // Using the 'search-ticker' endpoint as it's more stable for free tiers
            const res = await fetch(`https://financialmodelingprep.com/api/v3/search-ticker?query=${query}&limit=5&apikey=${API_KEY}`);
            const results = await res.json();
            
            // FIX: Check if results is an Array before looping (prevents the TypeError)
            if (Array.isArray(results)) {
                dataList.innerHTML = ""; 
                results.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.symbol; 
                    option.textContent = `${item.name} (${item.symbol})`;
                    dataList.appendChild(option);
                });
            } else {
                // This captures the 403 "Limit Reached" message in the console
                console.warn("API returned an error object instead of a list:", results);
            }
        } catch (err) {
            console.error("Autocomplete fetch failed:", err);
        }
    });

    // 3. MAIN CALCULATION
    calculateBtn.addEventListener('click', async () => {
        const symbol = companyInput.value.toUpperCase().trim();
        
        if (!symbol) {
            alert("Please enter a company ticker (e.g. AAPL, TSLA, WMT).");
            return;
        }

        calculateBtn.innerText = "Accessing SEC Filings...";
        calculateBtn.disabled = true;

        try {
            const [pRes, iRes] = await Promise.all([
                fetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${API_KEY}`),
                fetch(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=1&apikey=${API_KEY}`)
            ]);

            const pData = await pRes.json();
            const iData = await iRes.json();

            // Safety check for empty or error responses
            if (!Array.isArray(pData) || !pData[0] || !Array.isArray(iData) || !iData[0]) {
                throw new Error("Invalid Data");
            }

            // Salary vs Hourly Logic
            const isHourly = !document.getElementById('hourlyInputs').classList.contains('hidden');
            let userIncome = 0;
            let timeRatio = 1;

            if (isHourly) {
                const wage = parseFloat(document.getElementById('hourlyWage').value) || 0;
                const hrs = parseFloat(document.getElementById('hoursPerWeek').value) || 0;
                const wks = parseFloat(document.getElementById('weeksWorked').value) || 0;
                userIncome = wage * hrs * wks;
                timeRatio = (hrs * wks) / 2080;
            } else {
                userIncome = parseFloat(document.getElementById('annualSalary').value) || 0;
                timeRatio = 1;
            }

            const netIncome = iData[0].netIncome;
            const headcount = pData[0].fullTimeEmployees || 1;
            const officialShare = (netIncome / headcount) * timeRatio;
            const estimatedTax = calculateFederalTax(userIncome);

            // Update UI
            document.getElementById('officialAmount').innerText = `$${Math.round(officialShare).toLocaleString()}`;
            document.getElementById('realAmount').innerText = `$${Math.round(officialShare * 1.65).toLocaleString()}`;
            
            const ratio = estimatedTax > 0 ? (officialShare / estimatedTax).toFixed(1) : "Many";

            document.getElementById('taxResults').innerHTML = `
                <div class="comparison-box">
                    <p><strong>Company:</strong> ${pData[0].companyName}</p>
                    <p><strong>Your
