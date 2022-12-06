import './style/style.scss';

import getDataLastHour from './apiSmhi';

// Hämtar datan från vår API och skriver ut grader på sidan
async function waitForData() {

  // väntar på att getDataLastHour är klar innan den kör funktionen
  const data = await getDataLastHour();
 
  // Skriver ut temperaturen just nu i Göteborg Landvetter
  const temperatureNow = document.querySelector('#temperatureNow');
  temperatureNow.innerHTML = `<span>${data.value[0].value}</span>`;
  console.log(data);
}

waitForData();

/**
 * TODO
 x Hämta api från SMHI med info om tempratur senaste timmen
 x Få tempraturen att visas på skärmen
 * Få orten att vara samma som den från vår API
 * Ändra utseende på stylingen beroende på årstid
 */
