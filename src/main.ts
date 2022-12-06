import './style/style.scss';

import getDataLastHour from './apiSmhi';

/**
 * Data från API som skrivs ut och hämtas
 */

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

await dataLastHourGbg();

/**
 * Bakgrundsbild ändras beroende på årstid
 */
const backgroundImg: HTMLElement = document.querySelector('main') as HTMLElement;
const today = new Date();

if (today.getMonth() === 11 || today.getMonth() <= 1) {
  backgroundImg.classList.add('winter-img');
} else if (today.getMonth() === 2 || today.getMonth() <= 4) {
  backgroundImg.classList.add('spring-img');
} else if (today.getMonth() === 5 || today.getMonth() <= 7) {
  backgroundImg.classList.add('summer-img');
} else {
  backgroundImg.classList.add('fall-img');
}

/**
 * TODO
 x Hämta api från SMHI med info om tempratur senaste timmen
 x Få tempraturen att visas på skärmen
 x Få orten att vara samma som den från vår API
 * Ändra utseende på stylingen beroende på årstid
 *[] beroende på månad ändra bakgrundsbild
 *
 */
