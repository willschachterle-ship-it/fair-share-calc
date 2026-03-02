const API_KEY = "3gPWbjHBHWaeswUkIvjGjN6Ei3SxifLL";

// Wait for the HTML to be fully loaded before running any code
document.addEventListener('DOMContentLoaded', () => {
    
    const companyInput = document.getElementById('company');
    const dataList = document.getElementById('companyList');
    const calculateBtn = document.getElementById('calculateBtn');

    // 1. TAX CALCULATOR (2026 OBBBA Rules)
    function calculateFederalTax(grossIncome) {
        const standardDeduction = 16100;
        const taxable = Math.max(0, grossIncome - standardDeduction);
        if (taxable <= 12400) return Math.round(taxable * 0.10);
        if (taxable <= 50400) return Math.round(1240 + (taxable - 12400) * 0.12);
        if (taxable <= 105700) return Math.round(5800 + (taxable - 50400) * 0.22);
        return Math.round(17966 + (taxable - 105700) * 0.24);
    }

    // 2. AUTOCOMPLETE SEARCH
    companyInput.addEventListener('input', async (e) => {
        const query = e.target.value.trim();
        if (query.length < 3) return;

        try {
            const res = await fetch(`https://financialmodelingprep.com/api/v3/search?query=${query}&limit=5&apikey=${API_KEY}`);
            const results = await res.json();
            
            dataList.innerHTML = ""; // Clear old suggestions
            results.forEach(item => {
                const option = document.createElement('option');
                option.value = item.symbol; // The "Ticker" (e.g. AAPL)
                option.textContent = item.name; // The Name (e.g. Apple Inc.)
                dataList.appendChild(option);
            });
        } catch (err) {
            console.error("Autocomplete failed:", err);
        }
    });

    // 3. MAIN CALCULATION LOGIC
    calculateBtn.addEventListener('click', async () => {
        const symbol = companyInput.value.toUpperCase().trim();
        if (!symbol) return alert("Please type a company name or ticker.");

        // Show loading state
        calculateBtn.innerText = "Accessing SEC Filings...";
        calculateBtn.disabled = true;

        try {
            // Fetch Profile (Headcount) and Income Statement (Profit)
            const [pRes, iRes] = await Promise.all([
                fetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${API_KEY}`),
                fetch(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=1&apikey=${API_KEY}`)
            ]);

            const pData = await pRes.json();
            const iData = await iRes.json();

            if (!pData[0] || !iData[0]) {
                throw new Error("Data not found");
            }

            // User Income Math
            const isHourly = !document.getElementById('hourlyInputs').classList.contains('hidden');
            let income = 0, timeFrac = 1;

            if (isHourly) {
                const wage = parseFloat(document.getElementById('hourlyWage').value) || 0;
                const hours = parseFloat(document.getElementById('hoursPerWeek').value) || 0;
                const weeks = parseFloat(document.getElementById('weeksWorked').value) || 0;
