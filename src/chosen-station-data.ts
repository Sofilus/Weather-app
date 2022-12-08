
async function getChosenStationData(key, period) {
    const url = `https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/1/station/${key}/period/${period}/data.json`;
   console.log(url)
    return fetch(url)
      .then((data) => {
        return data.json();
      })
      .then((json: object) => json)
      .catch((err) => {
        console.error(err);
        return null;
      });
  }

  export default getChosenStationData;