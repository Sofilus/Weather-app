// Hämtar data från smhis api när användaren väljer ort. Den hämtar temp senaste timmen.
async function getChosenStationData(key: number, period: string) {
  // eslint-disable-next-line max-len
  const url = `https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/1/station/${key}/period/${period}/data.json`;
  console.log(url);
  return fetch(url)
    .then((data) => data.json())
    .then((json: object) => json)
    .catch((err) => {
      console.error(err);
      return null;
    });
}

export default getChosenStationData;
