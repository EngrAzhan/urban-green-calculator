// Calculation logic for the site (same math as in report)
function goToStep1(){setVisibility('step1')}
function goToStep2(){setVisibility('step2')}
function goToStep3(){
  // FIX: Set visibility, then automatically run the calculation.
  setVisibility('step3'); 
  calculate();          
}
function setVisibility(id){['step1','step2','step3','final-impact'].forEach(x=>document.getElementById(x).style.display=(x===id?'block':'none'))}

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
  const payback = annualSavings>0? (install/annualSavings):0;

  // ANIMATING ALL RESULTS WITH 2 DECIMAL PLACES
  animateValue("fuelDay", 0, fuelDay, 1000);
  animateValue("co2Day", 0, co2Day, 1000);
  animateValue("costDay", 0, costDay, 1000);
  animateValue("dieselEnergy", 0, dieselEnergy, 1000);
  animateValue("solarEnergy", 0, solarEnergy, 1000);
  animateValue("annualCO2", 0, annualCO2saved, 1200);
  animateValue("payback", 0, payback, 1000);
    // 1. First, run your existing math formulas here...
    // (Ensure variables like annualCO2 are calculated)

    // 2. Get the result value from the strong tag
    let co2Val = document.getElementById('annualCO2').innerText;
    let numericCO2 = parseFloat(co2Val.replace(/,/g, '')) || 0;

    // 3. Math: Trees = CO2 / 22
    let trees = Math.round(numericCO2 / 22);
    document.getElementById('tree-count-hero').innerText = trees;

    // 4. HIDE the white box (the section container)
    document.querySelector('section.container').style.display = 'none';

    // 5. SHOW the new impact result page
    document.getElementById('final-impact').style.display = 'block';
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
        
        // This forces exactly 2 decimal places and adds commas
        obj.innerHTML = value.toLocaleString(undefined, {
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2
        });
        
        if (now < endTime) {
            requestAnimationFrame(run);
        } else {
            obj.innerHTML = end.toLocaleString(undefined, {
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2
            });
        }
    }
    requestAnimationFrame(run);
}



