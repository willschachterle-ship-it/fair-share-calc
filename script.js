const API_KEY = "3gPWbjHBHWaeswUkIvjGjN6Ei3SxifLL";

document.addEventListener('DOMContentLoaded', () => {
    
    const companyInput = document.getElementById('company');
    const dataList = document.getElementById('companyList');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsArea = document.getElementById('results');

    // 1. TAX CALCULATOR
    function calculateFederalTax(grossIncome) {
        const taxable = Math.max(0, grossIncome - 16100);
        if (taxable <= 12400) return Math.round(taxable * 0.10);
        if (taxable <= 50400) return Math.round(1240 + (taxable - 12400) * 0.12);
        return Math.round(5800 + (taxable - 50400) * 0.22);
    }

    // 2. UPDATED 2026 SEARCH (v3/search is the current standard)
    companyInput.addEventListener('input', async (e) => {
        const query = e.target.value.trim();
        if (query.length < 3) return;

        try {
            // Updated endpoint to the supported v3/search
            const res = await fetch(`https://financialmodelingprep.com/api/v3/search?query=${query}&limit=5&apikey=${API_KEY}`);
            const results = await res.json();
            
            if (Array.isArray(results)) {
                dataList.innerHTML = ""; 
                results.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.symbol; 
                    option.textContent = `${item.name} (${item.symbol})`;
                    dataList.appendChild(option);
                });
            }
        } catch (err) {
            console.error("Search failed:", err);
        }
    });

    // 3. MAIN CALCULATION
    calculateBtn.addEventListener('click', async () => {
        const symbol = companyInput.value.toUpperCase().trim();
        
        if (!symbol) {
            alert("Please enter a company ticker (e.g. AAPL, TSLA).");
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

            // Check for valid arrays and data
            if (!pData || pData.length === 0 || !iData || iData.length === 0) {
                throw new Error("No data found");
            }

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
            }

            const netIncome = iData[0].netIncome;
            const headcount = pData[0].fullTimeEmployees || 1;
            const officialShare = (netIncome / headcount) * timeRatio;
            const estimatedTax = calculateFederalTax(userIncome);

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
            console.error(err);
            alert("Could not find data. Ensure the ticker is correct (e.g., AAPL) or try again later.");
        } finally {
            calculateBtn.innerText = "Calculate My Share";
            calculateBtn.disabled = false;
        }
    });

    // 4. UI TOGGLES
    const annualBtn = document.getElementById('annualToggle');
    const hourlyBtn = document.getElementById('hourlyToggle');

    annualBtn.onclick = () => {
        document.getElementById('salaryInputs').classList.remove('hidden');
        document.getElementById('hourlyInputs').classList.add('hidden');
        annualBtn.classList.add('active');
        hourlyBtn.classList.remove('active');
    };

    hourlyBtn.onclick = () => {
        document.getElementById('hourlyInputs').classList.remove('hidden');
        document.getElementById('salaryInputs').classList.add('hidden');
        hourlyBtn.classList.add('active');
        annualBtn.classList.remove('active');
    };
});
