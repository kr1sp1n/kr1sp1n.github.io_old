'use strict';
const yo = require('yo-yo');

module.exports = function login(state, actions) {
  return yo`<div class="login">
    <input type="password" />
    <button onclick="${actions.login}">OK</button>
  </div>`;
};
