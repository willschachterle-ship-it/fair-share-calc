const API_KEY = "3gPWbjHBHWaeswUkIvjGjN6Ei3SxifLL";

// 1. Safety Wrap: Wait for the page to be 100% ready
document.addEventListener('DOMContentLoaded', () => {
    
    // Connect to the HTML elements
    const companyInput = document.getElementById('company');
    const dataList = document.getElementById('companyList');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsArea = document.getElementById('results');

    // 2. 2026 Tax Math (Standard Deduction: $16,100)
    function calculateFederalTax(grossIncome) {
        const taxable = Math.max(0, grossIncome - 16100);
        if (taxable <= 12400) return Math.round(taxable * 0.10);
        if (taxable <= 50400) return Math.round(1240 + (taxable - 12400) * 0.12);
        return Math.round(5800 + (taxable - 50400) * 0.22);
    }

    // 3. Autocomplete Search (Triggers as you type)
    companyInput.addEventListener('input', async (e) => {
        const query = e.target.value.trim();
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
        } catch (err) {
            console.error("Autocomplete error:", err);
        }
    });

    // 4. The Main Calculation
    calculateBtn.addEventListener('click', async () => {
        const symbol = companyInput.value.toUpperCase().trim();
        
        if (!symbol) {
            alert("Please enter a company name or ticker first.");
            return;
        }

        // UI Feedback: Show the user something is happening
        calculateBtn.innerText = "Analyzing SEC Filings...";
        calculateBtn.disabled = true;

        try {
            // Fetch Financials
            const [pRes, iRes] = await Promise.all([
                fetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${API_KEY}`),
                fetch(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=1&apikey=${API_KEY}`)
            ]);

            const pData = await pRes.json();
            const iData = await iRes.json();

            if (!pData[0] || !iData[0]) throw new Error("Not Found");

            // Calculate User's Annual Income
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

            // The Fair Share Math
            const netIncome = iData[0].netIncome;
            const headcount = pData[0].fullTimeEmployees || 1;
            const officialShare = (netIncome / headcount) * timeRatio;
            const estimatedTax = calculateFederalTax(userIncome);

            // Update the UI
            document.getElementById('officialAmount').innerText = `$${Math.round(officialShare).toLocaleString()}`;
            document.getElementById('realAmount').innerText = `$${Math.round(officialShare * 1.65).toLocaleString()}`;
            
            const ratio = estimatedTax > 0 ? (officialShare / estimatedTax).toFixed(1) : "Many";

            document.getElementById('taxResults').innerHTML = `
                <div class="comparison-box" style="margin-top: 20px; padding: 15px; background: #f0f7ff; border-radius: 8px;">
                    <p><strong>Company:</strong> ${pData[0].companyName}</p>
                    <p><strong>Your 2026 Fed Tax:</strong> $${estimatedTax.toLocaleString()}</p>
                    <p><strong>Your Surplus Share:</strong> $${Math.round(officialShare).toLocaleString()}</p>
                    <p style="color: #d32f2f; font-weight: bold; margin-top: 10px;">
                        The company kept ${ratio}x more of your value than the government took in taxes.
                    </p>
                </div>
            `;

            resultsArea.classList.remove('hidden');

        } catch (err) {
            alert("Could not find data for that company. Please select a ticker from the dropdown list (e.g. AAPL, AMZN, WMT).");
        } finally {
            calculateBtn.innerText = "Calculate My Share";
            calculateBtn.disabled = false;
        }
    });

    // 5. Toggle Logic (Switching between Salary/Hourly)
    const annualBtn = document.getElementById('annualToggle');
    const hourlyBtn = document.getElementById('hourlyToggle');
    const salaryDiv = document.getElementById('salaryInputs');
    const hourlyDiv = document.getElementById('hourlyInputs');

    annualBtn.addEventListener('click', () => {
        salaryDiv.classList.remove('hidden');
        hourlyDiv.classList.add('hidden');
        annualBtn.classList.add('active');
        hourlyBtn.classList.remove('active');
    });

    hourlyBtn.addEventListener('click', () => {
        hourlyDiv.classList.remove('hidden');
        salaryDiv.classList.add('hidden');
        hourlyBtn.classList.add('active');
        annualBtn.classList.remove('active');
    });
});
