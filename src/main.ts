import './style/style.scss';

// import getDataLastHour from './api-smhi-temp-last-hour';

// import getDataWind from './api-smhi-wind';

import getDataAllStationsLastHour from './api-smhi-lasthour-allstations';

import getChosenStationData from './chosen-station-data';

import getWindData from './api-smhi-chosen-stations-wind';

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

// Kallar på alla berörda element i sök ort delen
const searchField: HTMLElement = document.querySelector('#searchField') as HTMLElement;
const searchDropdownPosition: HTMLElement = document.querySelector('#searchDropdown') as HTMLElement;
const searchDropdownStations: HTMLElement = document.querySelector('#dropdownStations') as HTMLElement;

// Skapar eventlisteners
searchField?.addEventListener('input', openDropdowns);
searchField?.addEventListener('blur', closeDropdowns);
searchField?.addEventListener('focus', openDropdownPosition);

// Öppnar och stänger dropdowns när vi skriver i inputrutan
function openDropdowns(): void {
  if (searchField.value === '') {
    searchDropdownPosition.classList.remove('display-none');
    searchDropdownStations.classList.add('display-none');
  } else {
    searchDropdownPosition.classList.add('display-none');
    searchDropdownStations.classList.remove('display-none');
  }
}

// Öppnar dropdown min position när jag har klickat och har fokus på inputrutan
function openDropdownPosition(): void {
  searchDropdownPosition.classList.remove('display-none');
}

// Stänger dropdown när vi klickar utanför inputrutan
function closeDropdowns(): void {
  searchDropdownPosition.classList.add('display-none');
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
function stationSuggetions(): void {
  if (stations) {
    ulSuggestedStation.innerHTML = '';
    // Skapar en ny array varje gång jag skriver en bokstav och jämför namnet och de i sökrutan
    filterStations = stations.filter((station) => station.name.toLowerCase().includes(searchField.value.toLowerCase()));
  }
  // Skriver ut 5 eller färre stationsnamn i form av li element som matchar med de som skrivs i sökrutan
  for (let i = 0; i < 5; i++) {
    if (filterStations[i]) {
      const liItem = document.createElement('li');
      liItem.id = [i]; // ger varje li ett id i form av indexet
      const suggestedStation = document.createTextNode(filterStations[i].name);
      liItem.appendChild(suggestedStation);
      ulSuggestedStation.appendChild(liItem);
      liItem.addEventListener('click', chosenStation); // För att kunna klicka och välja en förslagen station i sökrutan
    }
  }
}

/**
 * Identifierar station samt skriver ut temp och vind
*/

// Identidierar vald station och skriver ut temp och vind på sidan
async function chosenStation(e) {
  const clickedStationIndex = e.target.id; // Klickad station får ett index i listan av förslagna stationer
  const clickedStation = filterStations[clickedStationIndex].key; // Får ut klickade stationens key för identifiera vilken station som är vald

  const data = await getChosenStationData(clickedStation, 'latest-hour'); // Skickar in parametrar key och period för temp
  const dataWind = await getWindData(clickedStation, 'latest-hour');// Skickar in parametrar key och period för vind
  console.log(dataWind);

  // Skriver ut tempratur från vald station på skärmen
  const temperatureNow: HTMLElement = document.querySelector('#temperatureNow') as HTMLElement;
  temperatureNow.innerHTML = `<span>${data.value[0].value}</span>`;

  // Skriver ut orten
  const locality: HTMLElement = document.querySelector('#locality') as HTMLElement;
  locality.innerHTML = `<span>${data.station.name}</span>`;

  // Skriver ut vindhastighet
  const windSpeedNow: HTMLElement = document.querySelector('#windSpeed') as HTMLElement;
  windSpeedNow.innerHTML = `<span>${dataWind.value[0].value}</span>`;
  console.log(data);
}


/**
 * TODO
 * [] Det ska gå att klicka på stationerna som kommer upp som förslag
 * [x] Lista ut vilken jag klickar på
 * [x] Tempratur senaste timmen ska hämtas från rätt ställe
 * [x] Temp ska visas på skärmen
 * [x] Ort ska visas i ort rubriken
 * [x]  Vindhastighet ska visas
 * [] När jag kfeslickar utabnför stationsrutan och inputrutan ska den försvinna
 */

/*
// Hämtad data med tempratur från senaste timmen som skrivs ut på sidan
async function dataLastHourGbg(): Promise<void> {
  // väntar på all data hämtas från APIn innan den skriver ut datan på sidan
  const data: object = await getDataLastHour() as object;

  // Skriver ut tempratur från vald station på skärmen
  const temperatureNow: HTMLElement = document.querySelector('#temperatureNow') as HTMLElement;
  temperatureNow.innerHTML = `<span>${data.value[0].value}</span>`;

  // Skriver ut orten
  const locality: HTMLElement = document.querySelector('#locality') as HTMLElement;
  locality.innerHTML = `<span>${data.station.name}</span>`;

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
