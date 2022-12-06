// eslint-disable-next-line max-len
const urlWind = 'https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/4/station/72420/period/latest-hour/data.json';

async function getDataWind() {
  return fetch(urlWind)
    .then((data) => {
      console.log(data);
      return data.json();
    })
    .then((json) => {
      console.log('Aktuell vindhastighet:', json.value[0].value);
      console.log('Resterande data:');
      return json;
    })
    .catch((err) => {
      console.error(err);
      return null;
    });
}

export default getDataWind;
