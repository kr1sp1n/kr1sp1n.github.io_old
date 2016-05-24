'use strict';

const yo = require('yo-yo');
const header = require('./header');
const message = require('./message');
const update = require('./update');

module.exports = function render(state) {
  const actions = {
    login: function (x) {
      state.name = 'Lisa';
      update('.app', render(state));
    },

    sendMessage: function (message) {

    },
  };
  return yo`<div class="app">
    ${header(state, actions)}
    ${message(state, actions)}
    <div>Hello ${state.name}</div>
  `;
};
