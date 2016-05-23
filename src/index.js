'use strict';

require('normalize-css');
const yo = require('yo-yo');
const update = require('./update.js');
const xhr = require('xhr');

const saveWeather = function (data) {
  window.localStorage.setItem('weather', JSON.stringify([{ name: data.name, main: data.main }]));
};

function list(items) {
  return yo`<ul>
    ${items.map(function (item) {
      return yo`<li>${item.name} : ${item.main.temp}</li>`;
    })}
  </ul>`;
}

const init = function () {
  console.log('init');

  const weatherUrl = 'http://api.openweathermap.org/data/2.5/weather?q=Ketzin,de&appid=17c0cad467ddc9c450e3cce9ccf70d3f&units=metric';

  var req = xhr(weatherUrl, function (err, res, body) {
    console.log('ERR', err);
    body = JSON.parse(body);
    saveWeather(body);
    const weather = JSON.parse(window.localStorage.getItem('weather'));
    const el = list(weather);
    document.body.appendChild(el);
  });
};

if (window.localStorage.isLoaded) {
  window.localStorage.isLoaded(init);
} else {
  init.call(this);
}
