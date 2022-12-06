import './style/style.scss';

import getDataLastHour from './apiSmhi';

// Hämtad data senaste från timmen som skrivs ut på sidan
async function dataLastHourGbg(): Promise<void> {
  // väntar på all data hämtas från APIn innan den skriver ut datan på sidan
  const data: object = await getDataLastHour() as object;

  // Skriver ut orten
  const locality: HTMLElement = document.querySelector('#locality') as HTMLElement;
  locality.innerHTML = `<span>${data.station.name}</span>`;

  // Skriver ut temperaturen just nu i Göteborg Landvetter
  const temperatureNow: HTMLElement = document.querySelector('#temperatureNow') as HTMLElement;
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
