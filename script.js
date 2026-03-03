// ... (Keep the DATABASE and calculateTax function from the previous version)

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
                <h2 style="margin:0 0 20px 0; color:#1a1a1a; border-bottom: 2px solid #eee; pb-2;">${data.name} Audit</h2>
                
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
