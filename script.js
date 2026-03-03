const DATABASE = {
    // TECH
    "AAPL": { name: "Apple Inc.", emps: 164000, profit: 96995000000, ratio: 1.38 },
    "MSFT": { name: "Microsoft", emps: 221000, profit: 72361000000, ratio: 1.41 },
    "GOOGL": { name: "Alphabet (Google)", emps: 182502, profit: 73795000000, ratio: 1.32 },
    "META": { name: "Meta (Facebook)", emps: 67317, profit: 39098000000, ratio: 1.35 },
    "NVDA": { name: "NVIDIA", emps: 26196, profit: 29760000000, ratio: 1.19 },
    "TSLA": { name: "Tesla", emps: 140473, profit: 14974000000, ratio: 1.62 },
    // RETAIL / FOOD
    "WMT": { name: "Walmart", emps: 2100000, profit: 15510000000, ratio: 2.43 },
    "AMZN": { name: "Amazon", emps: 1525000, profit: 30425000000, ratio: 2.80 },
    "TGT": { name: "Target", emps: 440000, profit: 4130000000, ratio: 2.15 },
    "SBUX": { name: "Starbucks", emps: 381000, profit: 4120000000, ratio: 1.85 },
    "MCD": { name: "McDonald's", emps: 150000, profit: 8469000000, ratio: 1.45 },
    // LOGISTICS / SERVICES
    "UPS": { name: "UPS", emps: 500000, profit: 6700000000, ratio: 1.75 },
    "FDX": { name: "FedEx", emps: 529000, profit: 4330000000, ratio: 1.95 },
    "DIS": { name: "Disney", emps: 225000, profit: 2350000000, ratio: 3.10 },
    "V": { name: "Visa", emps: 28800, profit: 17273000000, ratio: 1.12 }
};

document.addEventListener('DOMContentLoaded', () => {
    const companyInput = document.getElementById('company');
    const dataList = document.getElementById('companyList');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsArea = document.getElementById('results');

    // Populate the dropdown list
    Object.keys(DATABASE).forEach(ticker => {
        const opt = document.createElement('option');
        opt.value = ticker;
        opt.textContent = `${DATABASE[ticker].name} (${ticker})`;
        dataList.appendChild(opt);
    });

    function calculateTax(income) {
        const taxable = Math.max(0, income - 16100);
        if (taxable <= 12400) return Math.round(taxable * 0.10);
        if (taxable <= 50400) return Math.round(1240 + (taxable - 12400) * 0.12);
        return Math.round(5800 + (taxable - 50400) * 0.22);
    }

    calculateBtn.addEventListener('click', () => {
        const symbol = companyInput.value.toUpperCase().trim();
        const data = DATABASE[symbol];

        if (!data) return alert("Please select a ticker from the list.");

        let income = 0, timeFrac = 1;
        const isHourly = !document.getElementById('hourlyInputs').classList.contains('hidden');

        if (isHourly) {
            const wage = parseFloat(document.getElementById('hourlyWage').value) || 0;
            const hrs = parseFloat(document.getElementById('hoursPerWeek').value) || 0;
            const wks = parseFloat(document.getElementById('weeksWorked').value) || 0;
            income = wage * hrs * wks;
            timeFrac = (hrs * wks) / 2080;
        } else {
            income = parseFloat(document.getElementById('annualSalary').value) || 0;
        }

        const distributedSurplus = Math.round((data.profit / data.emps) * timeFrac);
        const accountingSurplus = Math.round(distributedSurplus * data.ratio);
        const fedTax = calculateTax(income);

        resultsArea.innerHTML = `
            <div class="comparison-box" style="padding:25px; background:#fff; border-radius:12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); line-height: 1.6;">
                <h2 style="margin:0 0 20px 0; color:#1a1a1a; border-bottom: 2px solid #eee; padding-bottom: 10px;">${data.name} Audit</h2>
                
                <div style="margin-bottom:25px;">
                    <p style="margin-bottom:10px;">If you got to keep all the money <strong>${data.name}</strong> said they made, your salary would be:</p>
                    <div style="font-size:1.8em; font-weight:bold; color:#1b5e20;">$${(income + distributedSurplus).toLocaleString()}</div>
                </div>

                <div style="margin-bottom:25px;">
                    <p style="margin-bottom:10px;">If you got to keep all the money <strong>${data.name}</strong> <em>actually</em> made, your salary would be:</p>
                    <div style="font-size:1.8em; font-weight:bold; color:#0d47a1;">$${(income + accountingSurplus).toLocaleString()}</div>
                </div>

                <div style="margin-top:30px; padding-top:20px; border-top: 1px solid #eee;">
                    <p><strong>${data.name}</strong> kept <strong>$${distributedSurplus.toLocaleString()}</strong> from you.</p>
                    <p>The federal government kept <strong>$${fedTax.toLocaleString()}</strong>.</p>
                    
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 15px; border-left: 4px solid #666;">
                        <p style="margin:0; font-style: italic; color: #444;">
                            "The government paid for schools, healthcare, and roads with your money. 
                            What did <strong>${data.name}</strong> do for you with your money?"
                        </p>
                    </div>
                </div>
            </div>
        `;
        resultsArea.classList.remove('hidden');
    });

    // UI Toggles
    document.getElementById('annualToggle').onclick = (e) => toggleUI(e, 'salary');
    document.getElementById('hourlyToggle').onclick = (e) => toggleUI(e, 'hourly');

    function toggleUI(e, mode) {
        document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        document.getElementById('salaryInputs').classList.toggle('hidden', mode === 'hourly');
        document.getElementById('hourlyInputs').classList.toggle('hidden', mode === 'salary');
    }
});
