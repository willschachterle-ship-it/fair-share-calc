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
        if (taxable <= 50400
