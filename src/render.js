'use strict';

const yo = require('yo-yo');

const header = require('./header');
const message = require('./message');
const inbox = require('./inbox');
const login = require('./login');

//${inbox(state.inbox, actions)}
//${inbox(state.inbox, actions)}

module.exports = function render(state, actions) {
  return yo`<div class="app">
    ${header(state, actions)}
    <div class="container">
      ${login(state, actions)}
    </div>
  </div>`;
};
