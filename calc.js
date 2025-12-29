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
  const price = Number(document.getElementById('dieselPrice').value)||265.65;
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
  const replacedFraction = dieselEnergy > 0 ? Math.min(solarEnergy/dieselEnergy, 1) : 0;
  
  const annualCO2saved = co2Day * 365 * replacedFraction;
  const annualFuelCost = costDay * 365;
  const annualSavings = Math.max(0, annualFuelCost * replacedFraction - maint);
  const payback = annualSavings > 0 ? (install/annualSavings) : 0;

  // --- NEW LOGIC FOR REMAINING DEBT ---
  const totalAnnualCO2 = co2Day * 365;
  const remainingCO2 = Math.max(0, totalAnnualCO2 - annualCO2saved);
  // Calculate trees needed to offset what the solar panels missed
  const treesNeeded = Math.ceil(remainingCO2 / 22); 

  // ANIMATING ALL RESULTS
  animateValue("fuelDay", 0, fuelDay, 1000);
  animateValue("co2Day", 0, co2Day, 1000);
  animateValue("costDay", 0, costDay, 1000);
  animateValue("dieselEnergy", 0, dieselEnergy, 1000);
  animateValue("solarEnergy", 0, solarEnergy, 1000);
  animateValue("annualCO2", 0, annualCO2saved, 1200);
  animateValue("payback", 0, payback, 1000);

  // UPDATE THE HERO DISPLAY
  const heroDisplay = document.getElementById('tree-count-hero');
  if (heroDisplay) {
    heroDisplay.innerText = treesNeeded.toLocaleString();
  }

  // Final Impact Screen delay
  setTimeout(() => {
    document.getElementById('final-impact').style.display = 'block';
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








