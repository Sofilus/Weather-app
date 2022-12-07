import './style/style.scss';

import getDataLastHour from './api-smhi-temp-last-hour';

import getDataWind from './api-smhi-wind';

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
 * Dropdown på sök ort inputen
 */

// Kallar på alla viktiga element i sök ort
const searchField: HTMLElement = document.querySelector('#searchField') as HTMLElement;
const searchDropdown: HTMLElement = document.querySelector('#searchDropdown') as HTMLElement;

// Skapar eventlisteners
searchField?.addEventListener('focus', openDropdown);
searchField?.addEventListener('blur', closeDropdown);

// Öppnar dropdown
function openDropdown(): void {
  searchDropdown.classList.remove('display-none');
}

// Stänger dropdown
function closeDropdown(): void {
  searchDropdown.classList.add('display-none');
}

/**
 * Data från API som skrivs ut och används på sidan
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

// Hämtad data med vindhastighet som skrivs ut på sidan
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
 * [x] När jag klickar på inputrutan ska ett fält komma upp med en ul och li med min plats
 * [] När fältet inte är markerat ska klassen förvinna
 * [] När jag klickar på min position ska webblöäsaren fråga efter användarens plats
 * [] Koordinaterna ska skrivas ut som en plats
 * [] Min position ska skrivas ut i rubriken ort
 */
