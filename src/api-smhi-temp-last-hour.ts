// eslint-disable-next-line max-len
const urlTempLastHourGbg = 'https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/1/station/72420/period/latest-hour/data.json';

async function getDataLastHour() {
  return fetch(urlTempLastHourGbg)
    .then((data) => {
      console.log(data);
      return data.json();
    })
    .then((json) => {
      console.log('Aktuell temperatur:', json.value[0].value, 'grader');
      console.log('Resterande data:');
      return json;
    })
    .catch((err) => {
      console.error(err);
      return null;
    });
}

export default getDataLastHour;
