// Navigation logic
function goToStep1(){setVisibility('step1')}
function goToStep2(){setVisibility('step2')}
function goToStep3(){
  setVisibility('step3'); 
  calculate();          
}

function setVisibility(id){
  ['step1','step2','step3'].forEach(x => {
    const el = document.getElementById(x);
    if(el) el.style.display = (x === id ? 'block' : 'none');
  });
  
  if(id === 'step1' || id === 'step2') {
      const impact = document.getElementById('final-impact');
      if(impact) impact.style.display = 'none';
  }
}

function calculate() {
    const P = Number(document.getElementById('genPower').value) || 0;
    const H = Number(document.getElementById('hours').value) || 0;
    const dailyLiters = Number(document.getElementById('dailyLiters').value) || 0;
    const S = Number(document.getElementById('solarCap').value) || 0;
    const sun = Number(document.getElementById('sunHours').value) || 5.5;
    const install = Number(document.getElementById('installCost').value) || 0;
    const maint = Number(document.getElementById('maintCost').value) || 0;

    const price = 265.65; 
    const EF = 2.68;      

    const fuelDay = dailyLiters; 
    const co2Day = fuelDay * EF; 
    const totalAnnualCO2 = co2Day * 365; 
    const costDay = fuelDay * price; 
    const annualDieselExpense = costDay * 365; 

    const dieselEnergy = P * H; 
    const solarEnergy = S * sun; 

    const replacedFraction = dieselEnergy > 0 ? Math.min(solarEnergy / dieselEnergy, 1) : 0;
    const annualCO2saved = totalAnnualCO2 * replacedFraction; 
    const residualCO2 = totalAnnualCO2 - annualCO2saved; 

    const annualSavings = (annualDieselExpense * replacedFraction) - maint;
    const payback = annualSavings > 0 ? (install / annualSavings) : 0; 
    const profit10 = (annualSavings * 10) - install; 

    // Animate Results
    animateValue("fuelDay", 0, fuelDay, 1000);
    animateValue("co2Day", 0, co2Day, 1000);
    animateValue("totalCO2Year", 0, totalAnnualCO2, 1000);
    animateValue("costDay", 0, costDay, 1000);
    animateValue("costYear", 0, annualDieselExpense, 1000);
    animateValue("dieselEnergy", 0, dieselEnergy, 1000);
    animateValue("solarEnergy", 0, solarEnergy, 1000);
    animateValue("annualCO2", 0, annualCO2saved, 1000);
    animateValue("remainingCO2", 0, residualCO2, 1000);
    animateValue("payback", 0, payback, 1000);
    animateValue("profit10", 0, profit10, 1000);

    const treesNeeded = Math.ceil(residualCO2 / 22);
    document.getElementById('tree-count-hero').innerText = treesNeeded.toLocaleString();

    // Show Impact and Reset button after a delay
    setTimeout(() => {
        document.getElementById('final-impact').style.display = 'block';
        document.getElementById('resetBtn').style.display = 'inline-block';
    }, 1500);
}

function animateValue(id, start, end, duration) {
    let obj = document.getElementById(id);
    if (!obj) return;
    let range = end - start;
    let startTime = new Date().getTime();
    let endTime = startTime + duration;

    function run() {
        let now = new Date().getTime();
        let remaining = Math.max((endTime - now) / duration, 0);
        let value = end - (remaining * range);
        obj.innerHTML = value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        if (now < endTime) requestAnimationFrame(run);
        else obj.innerHTML = end.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }
    requestAnimationFrame(run);
}

// Live Efficiency Update logic
document.addEventListener("DOMContentLoaded", function() {
    const hoursInput = document.getElementById('hours');
    const litersInput = document.getElementById('dailyLiters');
    const efficiencyDisplay = document.getElementById('calcEfficiency');

    function updateLiveEfficiency() {
        const H = Number(hoursInput.value) || 0;
        const L = Number(litersInput.value) || 0;
        efficiencyDisplay.value = (H > 0 && L > 0) ? (L / H).toFixed(2) : "";
    }
    if(hoursInput && litersInput) {
        hoursInput.addEventListener('input', updateLiveEfficiency);
        litersInput.addEventListener('input', updateLiveEfficiency);
    }
});














