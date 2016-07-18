const yo = require('yo-yo');
const xhr = require('xhr');

const weatherUrl = 'http://api.openweathermap.org/data/2.5/weather?q=Ketzin,de&appid=17c0cad467ddc9c450e3cce9ccf70d3f&units=metric';

const saveWeather = function (data) {
  window.localStorage.setItem('weather', JSON.stringify([{ name: data.name, main: data.main }]));
};

// var req = xhr(weatherUrl, function (err, res, body) {
//   console.log('ERR', err);
//   body = JSON.parse(body);
//   saveWeather(body);
//   const weather = JSON.parse(window.localStorage.getItem('weather'));
//   const el = list(weather);
//   document.body.appendChild(el);
// });

module.exports = function weather(state, actions) {
  return yo``;
};
