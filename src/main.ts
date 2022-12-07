import './style/style.scss';

import getDataLastHour from './api-smhi-temp-last-hour';

import getDataWind from './api-smhi-wind';

/**
 * Data från API som skrivs ut och hämtas
 */

// Hämtad data med tempratur från senaste timmen som skrivs ut på sidan
async function dataLastHourGbg(): Promise<void> {
  // väntar på all data hämtas från APIn innan den skriver ut datan på sidan
  const data: object = await getDataLastHour() as object;

  // Skriver ut orten
  const locality: HTMLElement = document.querySelector('#locality') as HTMLElement;
  locality.innerHTML = `<span>${data.station.name}</span>`;

  // Skriver ut temperaturen senaste timmen i Göteborg Landvetter
  const temperatureNow: HTMLElement = document.querySelector('#temperatureNow') as HTMLElement;
  temperatureNow.innerHTML = `<span>${data.value[0].value}</span>`;
  console.log(data);
}

await dataLastHourGbg();

async function dataWind(): Promise<void> {
  // väntar på all data hämtas från APIn innan den skriver ut datan på sidan
  const data: object = await getDataWind() as object;

  // Skriver ut windhastighet Göteborg Landvetter
  const windSpeedNow: HTMLElement = document.querySelector('#windSpeed') as HTMLElement;
  windSpeedNow.innerHTML = `<span>${data.value[0].value}</span>`;
  console.log(data);
}

await dataWind();

/**
 * Få reda på användarens position
 */
const successCallback = (position: object) => {
  console.log(position);
};
const errorCallback = (error) => {
  console.log(error);
};
navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

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
 * [] Visa nederbörd
 * 
 */
