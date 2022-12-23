/* eslint-disable max-len */
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

const searchField = document.querySelector('#searchField') as HTMLInputElement; // Sökrutan
const searchDropdownPosition = document.querySelector('#searchDropdown') as HTMLDivElement; // Min position dropdown
const searchDropdownStations = document.querySelector('#dropdownStations') as HTMLDivElement; // div dropdown med förslagna stationer när användaren söker efter ort sökrutan
const ulSuggestedStation = document.querySelector('#suggestedStations') as HTMLUListElement; // Ul med föslagna stationer som visas när användaren skriver i sökrutan
const backgroundImg = document.querySelector('main') as HTMLElement; // main bakgrundbild
const temperatureNowContainer = document.querySelector('#temperatureNowContainer') as HTMLParagraphElement; // container med temperatur, hämtad för att ändra bakgrundbild
const rainAmount = document.querySelector('#rainAmount') as HTMLElement; // html element för nederbörd
const windSpeedNow = document.querySelector('#windSpeed') as HTMLParagraphElement; // Html element för vinden
const temperatureNow = document.querySelector('#temperatureNow') as HTMLParagraphElement; // html element för tempraturen
const locality = document.querySelector('#locality') as HTMLHeadingElement; // html element för Ort rubrik
const positionDoesNotExist = document.querySelector('#positionDoesNotExist') as HTMLParagraphElement; // test ruta i footer
const myPosition = document.querySelector('#myPosition') as HTMLLIElement; // li min position

/** ******************************************************************************
 -------------Göteborg som alltid visas visas när vi kommer in på sidan-----------
 ******************************************************************************* */

async function dataGothenburg() {
  const data: object = await getDataLastHour() as object;
  const dataWind: object | null = await getDataWind();

  // tempratur göteborg landvetter
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
  temperatureNow.innerHTML = `<span>${data.value[0].value}</span>`;

  // Rubrik göteborg-landvetter flygplats
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
  locality.innerHTML = `<span>${data.station.name}</span>`;

  // Skriver ut vindhastighet
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
  windSpeedNow.innerHTML = `<span>${dataWind?.value[0].value}</span>`;

  // Skriver ut att det inte finns värde på nederbörd
  rainAmount.innerHTML = '<span> - </span>';
}

await dataGothenburg();

/** ******************************************************************************
 ----------------------------------Sökrutan, sök ort-----------------------------
 ******************************************************************************* */

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
function openDropdownPosition(e:Event): void {
  e.stopPropagation();
  searchDropdownPosition.classList.remove('display-none');
}

function closeAllDropdowns(): void {
  searchDropdownPosition.classList.add('display-none');
  searchDropdownStations.classList.add('display-none');
}

// Skapar eventlisteners till när användaren interagerar med sökrutan
searchField?.addEventListener('input', openDropdowns);
searchField?.addEventListener('click', openDropdownPosition);
searchField?.addEventListener('focus', openDropdownPosition);
window.addEventListener('click', closeAllDropdowns);

/** ******************************************************************************
 -------Identifierar station samt skriver ut temp och vind på webbsidan-----------
 ******************************************************************************* */
async function setSelectedStation(clickedStationIndex: number) {
  const clickedStationKey: number = filterStations[clickedStationIndex].key; // Får ut klickade stationens key för identifiera vilken station som är vald
  const clickedStationName: string = filterStations[clickedStationIndex].name; // Får ut den klickade stationens namn
  const data = await getChosenStationData(clickedStationKey, 'latest-hour', 1); // Skickar in parametrar key och period för temp
  const dataWind = await getChosenStationData(clickedStationKey, 'latest-hour', 4); // Skickar in parametrar key och period för vind
  const dataRain = await getChosenStationData(clickedStationKey, 'latest-hour', 7); // Skickar in key 7 och får ut nederbörd senaste timmen

  // Om värderna inte finns skriv ut -
  temperatureNow.innerHTML = '<span> - </span>'; // Om stationen som är vald inte har tempraur skriv -
  windSpeedNow.innerHTML = '<span> - </span>'; // Om stationen inte har vind senaste timmen skriv -
  rainAmount.innerHTML = '<span> - </span>'; // Om stationen inte har nederbörd senaste timmen skriv -

  // Skriver ut orten som klickas på som rubrik på webbsidan
  locality.innerHTML = `<span>${clickedStationName}</span>`;

  // Skriver ut tempratur om det finns från den valda station på webbsidan
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
  temperatureNow.innerHTML = `<span>${data.value[0].value}</span>`;

  // Skriver ut vindhastighet om det finns från den valda station på webbsidan
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
  windSpeedNow.innerHTML = `<span>${dataWind.value[0].value}</span>`;

  // skriver ut nederbörds värde om det finns från den valda station på webbsidan
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
  rainAmount.innerHTML = `<span>${dataRain.value[0].value}</span>`;
}

async function chosenStation(e: Event) {
  const clickedStationIndex: number = e?.target?.id as number; // Klickad station får ett index i listan av förslagna stationer

  await setSelectedStation(clickedStationIndex);
}
async function enterOnStation(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    const clickedStationIndex: number = e?.target?.id as number; // Klickad station får ett index i listan av förslagna stationer
    await setSelectedStation(clickedStationIndex);
  }
}



/** *******************************************************************************************
 Hämtar alla stationer från smhis API samt lokaliserar närmaste station när min position klickas
 ********************************************************************************************* */

let stations: Array<object> = []; // Arrayen med alla stationer

// Hämtar alla stationer från API samt min position och visar närmaste station när min position klickas
async function dataAllStationsLastHour(): Promise<void> {
  // väntar på all data hämtas från APIn innan den skriver ut datan på sidan
  const data: object = (await getDataAllStationsLastHour()) as object;
  stations = data.station;

  // Visar närmaste station
  async function showPosition(position:object) {
    let shortestDistance = -1;
    let index = NaN;
    // Kollar efter alla stationers longitude och latitude samt jämför avstånd mellan användarens position och stationerna
    for (let i = 0; i < stations.length; i++) {
      // Hämtar alla stationernas long och lat
      const latitude: number = stations[i].latitude as number;
      const longitude: number = stations[i].longitude as number;

      // Jämför avstånd mellan stationer och användarens position genom pytagoras
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
      const compareLatitude = latitude - position.coords.latitude;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
      const compareLongitude = longitude - position.coords.longitude;
      const diffrenceLongLat = Math.sqrt((compareLatitude ** 2) + (compareLongitude ** 2));
      if (diffrenceLongLat < shortestDistance || (shortestDistance === -1)) {
        shortestDistance = diffrenceLongLat;
        index = i;
      }
    }
    await setSelectedStation(index);
  }

  // Begär åtkomst av användarens position
  function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
      searchDropdownPosition.classList.add('display-none');
    } else {
      positionDoesNotExist.innerHTML = 'Position finns inte';
    }
  }

  myPosition?.addEventListener('click', getUserLocation);
  myPosition?.addEventListener('keypress', getUserLocation);
}

await dataAllStationsLastHour();

/** ******************************************************************************
 ---------- Filtrera stationerna när användaren skriver i sökfältet---------------
 ******************************************************************************* */

// Kopierad array som kommer filtreras efter ort vi söker på
let filterStations = [...stations];

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
      liItem.setAttribute('tabindex', '3');
      liItem.id = String([i]); // ger varje li ett id i form av indexet
      const suggestedStation = document.createTextNode(filterStations[i].name);
      liItem.appendChild(suggestedStation);
      ulSuggestedStation.appendChild(liItem);
      liItem?.addEventListener('click', chosenStation); // För att kunna klicka och välja en förslagen station i sökrutan
      liItem?.addEventListener('keypress', enterOnStation);
    }
  }
}

searchField?.addEventListener('input', stationSuggetions);

/** ******************************************************************************
 ---------------------Bakgrundsbild ändras beroende på årstid---------------------
 ******************************************************************************* */
const today = new Date();

if (today.getMonth() === 11 || today.getMonth() <= 1) {
  backgroundImg.classList.add('winter-img');
  temperatureNowContainer.classList.add('winter-decoration-img');
} else if (today.getMonth() === 2 || today.getMonth() <= 4) {
  backgroundImg.classList.add('spring-img');
  temperatureNowContainer.classList.add('spring-decoration-img');
} else if (today.getMonth() === 5 || today.getMonth() <= 7) {
  backgroundImg.classList.add('summer-img');
  temperatureNowContainer.classList.add('summer-decoration-img');
} else {
  backgroundImg.classList.add('fall-img');
  temperatureNowContainer.classList.add('fall-decoration-img');
}

/**
 * Det ska gå att tabba och välja li, kan va så att jag får göra om till lista som fälls ner
 */
