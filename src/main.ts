import './style/style.scss';

import getDataLastHour from './apiSmhi';

async function whaitForData() {
  const data = await getDataLastHour();
  console.log(data);
}

whaitForData();

/**
 * TODO
 x Hämta api från SMHI med info om tempratur senaste timmen
 * Få tempraturen att visas på skärmen
 * Få orten att vara samma som den från vår API
 * Ändra utseende på stylingen beroende på årstid
 */
