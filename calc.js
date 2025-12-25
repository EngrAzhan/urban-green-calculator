// Calculation logic for the site (same math as in report)
function goToStep1(){setVisibility('step1')}
function goToStep2(){setVisibility('step2')}
function goToStep3(){
  // FIX: Set visibility, then automatically run the calculation.
  setVisibility('step3'); 
  calculate();          
}
function setVisibility(id){['step1','step2','step3'].forEach(x=>document.getElementById(x).style.display=(x===id?'block':'none'))}

function calculate(){
  const P = Number(document.getElementById('genPower').value)||0;
  const H = Number(document.getElementById('hours').value)||0;
  const F = Number(document.getElementById('fuelEff').value)||0;
  const price = Number(document.getElementById('dieselPrice').value)||285;
  const EF = Number(document.getElementById('co2Factor').value)||2.68;
  const S = Number(document.getElementById('solarCap').value)||0;
  const sun = Number(document.getElementById('sunHours').value)||5.5;
  const install = Number(document.getElementById('installCost').value)||0;
  const maint = Number(document.getElementById('maintCost').value)||0;

  const fuelDay = F * H;
  const co2Day = fuelDay * EF;
  const costDay = fuelDay * price;
  const dieselEnergy = P * H;
  const solarEnergy = S * sun;
  const replacedFraction = dieselEnergy>0? Math.min(solarEnergy/dieselEnergy,1):0;
  const annualCO2saved = co2Day * 365 * replacedFraction;
  const annualFuelCost = costDay * 365;
  const annualSavings = Math.max(0, annualFuelCost * replacedFraction - maint);
  const payback = annualSavings>0? (install/annualSavings):null;

  // Static updates (normal display)
  document.getElementById('fuelDay').innerText = fuelDay.toFixed(2);
  document.getElementById('co2Day').innerText = co2Day.toFixed(2);
  document.getElementById('dieselEnergy').innerText = dieselEnergy.toFixed(2);
  document.getElementById('solarEnergy').innerText = solarEnergy.toFixed(2);
  document.getElementById('payback').innerText = payback? payback.toFixed(1): 'N/A';

  // ANIMATED updates (These will count up from 0)
  // We use Math.round because the animation looks best with whole numbers
  animateValue("annualCO2", 0, Math.round(annualCO2saved), 1200);
  animateValue("costDay", 0, Math.round(costDay), 1000);

} // <--- This is the closing bracket for calculate()

// --- EVERYTHING BELOW IS OUTSIDE THE BRACKETS ---

function animateValue(id, start, end, duration) {
    let obj = document.getElementById(id);
    if (!obj) return;
    let range = end - start;
    let minTimer = 50;
    let stepTime = Math.abs(Math.floor(duration / range)) || minTimer;
    let startTime = new Date().getTime();
    let endTime = startTime + duration;
    let timer;

    function run() {
        let now = new Date().getTime();
        let remaining = Math.max((endTime - now) / duration, 0);
        let value = Math.round(end - (remaining * range));
        
        // This line adds commas (e.g. 11,836) to make it look professional
        obj.innerHTML = value.toLocaleString(); 
        
        if (value == end) {
            clearInterval(timer);
        }
    }
    timer = setInterval(run, stepTime);
    run();
}
