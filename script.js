const companyData = {
    "amazon": { official: 49807, real: 89423, union: "https://www.amazonlaborunion.org/" },
    "walmart": { official: 10424, real: 19809, union: "https://www.unitedforrespect.org/" }
};

function calculateFederalTax(grossIncome) {
    const taxable = Math.max(0, grossIncome - 16100);
    if (taxable <= 12400) return Math.round(taxable * 0.10);
    if (taxable <= 50400) return Math.round(1240 + (taxable - 12400) * 0.12);
    return Math.round(5800 + (taxable - 50400) * 0.22);
}

document.getElementById('calculateBtn').addEventListener('click', () => {
    const company = document.getElementById('company').value.toLowerCase();
    const isHourly = !document.getElementById('hourlyInputs').classList.contains('hidden');
    let income = 0, timeFrac = 1;

    if (isHourly) {
        const w = parseFloat(document.getElementById('hourlyWage').value) || 0;
        const h = parseFloat(document.getElementById('hoursPerWeek').value) || 0;
        const wk = parseFloat(document.getElementById('weeksWorked').value) || 0;
        income = w * h * wk;
        timeFrac = (h * wk) / 2080;
    } else {
        income = parseFloat(document.getElementById('annualSalary').value) || 0;
    }

    if (companyData[company]) {
        const data = companyData[company];
        const realBonus = Math.round(data.real * timeFrac);
        const tax = calculateFederalTax(income);
        
        document.getElementById('officialAmount').innerText = `+$${Math.round(data.official * timeFrac).toLocaleString()}`;
        document.getElementById('realAmount').innerText = `+$${realBonus.toLocaleString()}`;
        document.getElementById('unionLink').href = data.union;
        
        const ratio = tax > 0 ? (realBonus / tax).toFixed(1) : "Many";
        document.getElementById('taxResults').innerHTML = `
            <div class="comparison-box">
                <p>You paid <strong>$${tax.toLocaleString()}</strong> in Federal Taxes.</p>
                <p>The company kept <strong>$${realBonus.toLocaleString()}</strong> of your surplus value.</p>
                <p class="highlight">That's ${ratio}x more than your taxes.</p>
            </div>`;
        document.getElementById('results').classList.remove('hidden');
    } else {
        alert("Try 'Amazon' or 'Walmart'!");
    }
});

// UI Toggle Logic
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