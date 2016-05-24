'use strict';

require('normalize-css');
const yo = require('yo-yo');
const document = require('global/document');
const window = require('global/window');
const update = require('./update');
const render = require('./render');

const init = function () {
  const state = {
    name: 'Krispin',

    // weather: JSON.parse(window.localStorage.getItem('weather')),
  };
  const app = render(state);
  document.body.appendChild(app);
};

if (window.localStorage.isLoaded) {
  window.localStorage.isLoaded(init);
} else {
  init.call(this);
}
