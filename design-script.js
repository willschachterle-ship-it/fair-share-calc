function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

function calculate() {
    // We are simulating the Delek US Holdings data from your screenshot
    const data = {
        name: "Delek US Holdings",
        emps: "3,746",
        profit: "$220M",
        fairShare: 70729
    };
    
    document.getElementById('results-area').style.display = 'block';
    document.getElementById('res-name').innerText = data.name;
    document.getElementById('res-name-bold').innerText = data.name;
    document.getElementById('res-emps').innerText = data.emps + " Employees";
    document.getElementById('res-profit').innerText = data.profit;
    
    const amountEl = document.getElementById('fair-share-amount');
    animateValue(amountEl, 0, data.fairShare, 1200);
}
