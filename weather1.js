const axios = require('axios');
exports.fetch = function(A, X, C) {
  return new Promise((resolve, reject) => {
    const latperkm = 1 / 110.;
    const lngperkm = 1 / 103.;
    const delLat = 10 * latperkm;
    const delLng = 10 * lngperkm;
    const maxLat = X * latperkm;
    const maxLng = X * lngperkm;
    const getDistance = (i, j) => Math.round(Math.abs(i * 110.) + Math.abs(j * 103.));
    const GOOGLE_API_KEY = 'AIzaSyA8vd3L5QdOe_NNt80U7u8o0LMD2Nd--F8';
//const url1 = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(A) +
    //  '&components=city';
       const url1= 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input='+encodeURIComponent(A)+'&key=AIzaSyD9IV-oUqjgWjetoLMPepb7qw38E7OMNX0';
      const url2 = (x, y) => 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + encodeURIComponent(x +
      ',' + y) + '&result_type=administrative_area_level_2&location_type=APPROXIMATE&key=' + GOOGLE_API_KEY;
    const url3 = (city) =>
      'http://api.openweathermap.org/data/2.5/weather?appid=0c42f7f6b53b244c78a418f4f181282a&q=' +
      encodeURIComponent(city);
    const promiseList = [];
    const cityList = [];
    axios.get(url1).then(response => {
      if (response.data.candidates[0]) {
        console.log(response.data.candidates[0]);
        const loc = response.data.candidates[0];
        for (let i = -maxLat; i < maxLat; i += delLat) {
          for (let j = -maxLng; j < maxLng; j += delLng) {
            if (getDistance(i, j) < X) {
              promiseList.push(axios.get(url2(loc.lat + i, loc.lng + j)));
            }
          }
        }
        Promise.all(promiseList).then(response => {
          let promiseList2 = [];
          response.forEach(res => {
            if (res.data.results[0]) {
              let city = res.data.results[0].formatted_address;
              if (cityList.indexOf(city) == -1) {
                cityList.push(city);
                promiseList2.push(axios.get(url3(city)));
              }
            } else(console.log(res.data));
          });
          Promise.all(promiseList2).then(response => {
            let cityList2 = [];
            response.forEach(res => {
              if (res.data.main && res.data.main.temp < C) cityList2.push(res.data.name);
              else console.log(res.data);
            });
            console.log(cityList2);
            resolve(cityList2.reduce((s,e)=>s+='<p>'+e+'</p>',''));
          });
        }).catch(error => console.log(error));
      } else console.log(response.data);
    }).catch(error => console.log(error));
  });
}