// Nick's Design Overhaul - Count-Up Animation & Emancipatory Semiotics
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Updated Result Display Logic
function displayResults(data) {
    const resultTitle = document.querySelector('.result-title');
    if (resultTitle) resultTitle.innerText = "Your Unpaid Fair Share:";
    
    const amountEl = document.getElementById('fair-share-amount');
    if (amountEl) {
        animateValue(amountEl, 0, data.fairShare, 1200);
    }
}
// Note: This script assumes design-preview.html has an ID 'fair-share-amount'
