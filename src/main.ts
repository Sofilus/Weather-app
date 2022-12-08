import './style/style.scss';

import getDataLastHour from './api-smhi-temp-last-hour';

import getDataWind from './api-smhi-wind';

import getDataAllStationsLastHour from './api-smhi-lasthour-allstations';


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
 * Hämtar alla stationer från API smhi
 */

let stations: Array<object> = []; // Arrayen med alla stationer

// Hämtar alla stationer från API
async function dataAllStationsLastHour(): Promise<void> {
// väntar på all data hämtas från APIn innan den skriver ut datan på sidan
  const data: object = await getDataAllStationsLastHour() as object;
  stations = data.station;

  console.log(data);
}

await dataAllStationsLastHour();

/**
 * Filtrera arrayen med stationerna beroende på vad användaren skriver in i sökfältet
 */

// Kopierad array som kommer filtreras efter ort vi söker på
let filterStations = [...stations];

const ulSuggestedStation: HTMLElement = document.querySelector('#suggestedStations') as HTMLElement;

searchField?.addEventListener('input', stationSuggetions);

// Jämför ordet som skrivs i inputrutan om det finns med i namet på några av stationerna
function stationSuggetions() {
  if (stations) {
    ulSuggestedStation.innerHTML = '';
    // Skapar en ny array varje gång jag skriver en bokstav och jämför namnet och de i sökrutan
    filterStations = stations.filter((station) => station.name.toLowerCase().includes(searchField.value.toLowerCase())); 
  }
  // Skriver ut 5 eller färre stationsnamn i form av li element som matchar med de som skrivs i sökrutan
  for (let i = 0; i < 5; i++) {
    if (filterStations[i]) {
      const liItem = document.createElement('li');
      const suggestedStation = document.createTextNode(filterStations[i].name);
      liItem.appendChild(suggestedStation);
      ulSuggestedStation.appendChild(liItem);
    }
  }
}

/**
 * TODO
 * [x]listan måste uppdateras varje gång jag skriver en nytt ord
 * [x]Bara 5 ska visas ändra till for loop och längden är 5
 * [] Comitta
 * [] CSS
 * [] Display none ska finnas först och när vi börjar skriva ska listan komma upp
 * []Comitta
 * []Det ska gå att klicka på dem som visas
 */

/*
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
 * [x] När fältet inte är markerat ska klassen förvinna
 * [] När jag klickar på min position ska webblöäsaren fråga efter användarens plats
 * [] Koordinaterna ska skrivas ut som en plats
 * [] Min position ska skrivas ut i rubriken ort
 */
