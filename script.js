// NO API KEY NEEDED - This uses 2026 pre-loaded data
const DATABASE = {
    "AAPL": { name: "Apple Inc.", emps: 164000, profit: 96995000000 },
    "MSFT": { name: "Microsoft", emps: 221000, profit: 72361000000 },
    "AMZN": { name: "Amazon", emps: 1525000, profit: 30425000000 },
    "TSLA": { name: "Tesla", emps: 140473, profit: 14974000000 },
    "WMT": { name: "Walmart", emps: 2100000, profit: 15510000000 },
    "GOOGL": { name: "Alphabet (Google)", emps: 182502, profit: 73795000000 },
    "NVDA": { name: "NVIDIA", emps: 26196, profit: 29760000000 },
    "META": { name: "Meta", emps: 67317, profit: 39098000000 },
    "TGT": { name: "Target", emps: 440000, profit: 4130000000 },
    "SBUX": { name: "Starbucks", emps: 381000, profit: 4120000000 },
    "UPS": { name: "UPS", emps: 500000, profit: 6700000000 }
};

document.addEventListener('DOMContentLoaded', () => {
    const companyInput = document.getElementById('company');
    const dataList = document.getElementById('companyList');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsArea = document.getElementById('results');

    // Load the dropdown list from our database
    Object.keys(DATABASE).forEach(ticker => {
        const opt = document.createElement('option');
        opt.value = ticker;
        opt.textContent = DATABASE[ticker].name;
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

        if (!data) {
            alert("Please select a company from the list (e.g., AAPL, WMT, TSLA).");
            return;
        }

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

        const userShare = Math.round((data.profit / data.emps) * timeFrac);
        const tax = calculateTax(income);

        document.getElementById('officialAmount').innerText = `$${userShare.toLocaleString()}`;
        document.getElementById('realAmount').innerText = `$${Math.round(userShare * 1.65).toLocaleString()}`;
        document.getElementById('taxResults').innerHTML = `
            <div class="comparison-box" style="margin-top:20px; padding:15px; background:#f4faff; border-radius:8px; border-left:5px solid #0070f3;">
                <p><strong>${data.name}</strong> Audit Result:</p>
                <p>Your 2026 Fed Tax Estimate: <strong>$${tax.toLocaleString()}</strong></p>
                <p>Your Unpaid Profit Surplus: <strong>$${userShare.toLocaleString()}</strong></p>
                <p style="color:#d32f2f; font-weight:bold; margin-top:10px;">The company's surplus value is ${(userShare/Math.max(1,tax)).toFixed(1)}x higher than your federal tax bill.</p>
            </div>`;

        resultsArea.classList.remove('hidden');
    });

    // UI Toggles
    document.getElementById('annualToggle').onclick = () => {
        document.getElementById('salaryInputs').classList.remove('hidden');
        document.getElementById('hourlyInputs').classList.add('hidden');
    };
    document.getElementById('hourlyToggle').onclick = () => {
        document.getElementById('hourlyInputs').classList.remove('hidden');
        document.getElementById('salaryInputs').classList.add('hidden');
    };
});
