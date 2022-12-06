import './style/style.scss';

import getDataLastHour from './apiSmhi';

// Hämtad data senaste från timmen som skrivs ut på sidan
async function dataLastHourGbg() {

  // väntar på all data hämtas från APIn innan den skriver ut datan på sidan
  const data = await getDataLastHour();

  // Skriver ut orten
  const locality = document.querySelector('#locality');
  locality.innerHTML = `<span>${data.station.name}</span>`;
 
  // Skriver ut temperaturen just nu i Göteborg Landvetter
  const temperatureNow = document.querySelector('#temperatureNow');
  temperatureNow.innerHTML = `<span>${data.value[0].value}</span>`;
  console.log(data);
}

dataLastHourGbg();

/**
 * TODO
 x Hämta api från SMHI med info om tempratur senaste timmen
 x Få tempraturen att visas på skärmen
 x Få orten att vara samma som den från vår API
 * Ändra utseende på stylingen beroende på årstid
 */
