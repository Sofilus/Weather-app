/** ******************************************************************************
 -----------------------------------Importer-------------------------------------
 ******************************************************************************* */

import './style/style.scss';
import getDataLastHour from './api-smhi-temp-last-hour-gbg';
import getDataWind from './api-smhi-wind-gbg';
import getDataAllStationsLastHour from './api-smhi-lasthour-allstations';
import getChosenStationData from './chosen-station-data';

/** ******************************************************************************
 ------------------------Hämtade element från html-------------------------------
 ******************************************************************************* */

const searchField: HTMLElement = document.querySelector('#searchField') as HTMLElement; // Sökrutan
const searchDropdownPosition: HTMLElement = document.querySelector('#searchDropdown') as HTMLElement; // Min position dropdown
const searchDropdownStations: HTMLElement = document.querySelector('#dropdownStations') as HTMLElement; // div dropdown med förslagna stationer när användaren söker efter ort sökrutan
const ulSuggestedStation: HTMLElement = document.querySelector('#suggestedStations') as HTMLElement; // Ul med föslagna stationer som visas när användaren skriver i sökrutan
const backgroundImg: HTMLElement = document.querySelector('main') as HTMLElement; // main
const rainAmount: HTMLElement = document.querySelector('#rainAmount') as HTMLElement; // html element för nederbörd
const windSpeedNow: HTMLElement = document.querySelector('#windSpeed') as HTMLElement; // Html element för vinden
const temperatureNow: HTMLElement = document.querySelector('#temperatureNow') as HTMLElement; // html element för tempraturen
const locality: HTMLElement = document.querySelector('#locality') as HTMLElement; // html element för Ort rubrik
const test = document.querySelector('#test'); // test ruta i footer
const myPosition = document.querySelector('#myPosition'); // li min position

/** ******************************************************************************
 -------------Göteborg som alltid visas visas när vi kommer in på sidan-----------
 ******************************************************************************* */

async function dataGothenburg() {
  const data = await getDataLastHour();
  const dataWind = await getDataWind();

  // tempratur göteborg landvetter
  const temperatureNow = document.querySelector('#temperatureNow');
  temperatureNow.innerHTML = `<span>${data.value[0].value}</span>`;

  // Rubrik göteborg-landvetter flygplats
  const locality = document.querySelector('#locality');
  locality.innerHTML = `<span>${data.station.name}</span>`;

  // Skriver ut vindhastighet
  const windSpeedNow: HTMLElement = document.querySelector('#windSpeed') as HTMLElement; // Html element för vinden
  windSpeedNow.innerHTML = `<span>${dataWind.value[0].value}</span>`;

  // Skriver ut att det inte finns värde på nederbörd
  rainAmount.innerHTML = `<span> - </span>`;
}
 
dataGothenburg();


/** ******************************************************************************
 ----------------------------------Sökrutan, sök ort-----------------------------
 ******************************************************************************* */

// Skapar eventlisteners till när användaren interagerar med sökrutan
searchField?.addEventListener('input', openDropdowns);
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


/** ******************************************************************************
 --------------------- Begär åtkomst av användarens position----------------------
 ******************************************************************************* */




/** *******************************************************************************************
 Hämtar alla stationer från smhis API samt lokaliserar närmaste station när min position klickas
 ********************************************************************************************* */

let stations: Array<object> = []; // Arrayen med alla stationer

// Hämtar alla stationer från API samt min position och visar närmaste station när min position klickas
async function dataAllStationsLastHour(): Promise<void> {
  // väntar på all data hämtas från APIn innan den skriver ut datan på sidan
  const data: object = (await getDataAllStationsLastHour()) as object;
  stations = data.station;

  myPosition?.addEventListener('click', getUserLocation);

  // Begär åtkomst av användarens position
  function getUserLocation (){
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      test.innerHTML = 'Position finns inte';
    }
  }

  // Visar närmaste station
  function showPosition(position) {
    let shortestDistance = -1;

    // Kollar efter alla stationers longitude och latitude samt jämför avstånd mellan användarens position och stationerna
    for (let i = 0; i < stations.length; i++) {
      // Hämtar alla stationernas long och lat
      const latitude = stations[i].latitude;
      const longitude = stations[i].longitude;

      // Jämför avstånd mellan stationer och användarens position genom pytagoras
      const compareLatitude = latitude - position.coords.latitude;
      const compareLongitude = longitude - position.coords.longitude;
      const diffrenceLongLat = Math.sqrt((compareLatitude ** 2) + (compareLongitude ** 2));
      if(diffrenceLongLat < shortestDistance || (shortestDistance == -1)){
        shortestDistance = diffrenceLongLat;
      }
    }
  }
}

await dataAllStationsLastHour();

/** ******************************************************************************
 ---------- Filtrera stationerna när användaren skriver i sökfältet---------------
 ******************************************************************************* */

// Kopierad array som kommer filtreras efter ort vi söker på
let filterStations = [...stations];

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

/** ******************************************************************************
 -------Identifierar station samt skriver ut temp och vind på webbsidan-----------
 ******************************************************************************* */

async function chosenStation(e) {

  const clickedStationIndex = e.target.id; // Klickad station får ett index i listan av förslagna stationer
  const clickedStationKey = filterStations[clickedStationIndex].key; // Får ut klickade stationens key för identifiera vilken station som är vald
  const clickedStationName = filterStations[clickedStationIndex].name; // Får ut den klickade stationens namn

  const data = await getChosenStationData(clickedStationKey, 'latest-hour', 1); // Skickar in parametrar key och period för temp
  const dataWind = await getChosenStationData(clickedStationKey, 'latest-hour', 4); // Skickar in parametrar key och period för vind
  const dataRain = await getChosenStationData(clickedStationKey, 'latest-hour', 7); // Skickar in key 7 och får ut nederbörd senaste timmen

  // Om värderna inte finns skriv ut -
  temperatureNow.innerHTML = `<span> - </span>`; // Om stationen som är vald inte har tempraur skriv -
  windSpeedNow.innerHTML = `<span> - </span>`; // Om stationen inte har vind senaste timmen skriv -
  rainAmount.innerHTML = `<span> - </span>`; // Om stationen inte har nederbörd senaste timmen skriv -

  // Skriver ut orten som klickas på som rubrik på webbsidan
  locality.innerHTML = `<span>${clickedStationName}</span>`;

  // Skriver ut tempratur om det finns från den valda station på webbsidan
  temperatureNow.innerHTML = `<span>${data.value[0].value}</span>`;

  // Skriver ut vindhastighet om det finns från den valda station på webbsidan
  windSpeedNow.innerHTML = `<span>${dataWind.value[0].value}</span>`;

  // skriver ut nederbörds värde om det finns från den valda station på webbsidan
  rainAmount.innerHTML = `<span>${dataRain.value[0].value}</span>`;
}

/** ******************************************************************************
 ---------------------Bakgrundsbild ändras beroende på årstid---------------------
 ******************************************************************************* */

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
 * TODO 1
 * [] När jag klickar utanför stationsrutan och inputrutan ska den försvinna
 */

/**
 * TODO 2
 * [] När jag klickar på min position ska webblöäsaren fråga efter användarens plats
 * [] Koordinaterna ska skrivas ut som en plats
 * [] Min position ska skrivas ut i rubriken ort
 */