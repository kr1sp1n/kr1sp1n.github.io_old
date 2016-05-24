'use strict';

const yo = require('yo-yo');
const login = require('./login');

module.exports = function header(state, actions) {
  return yo`<header><span>kr1sp1n</span>${login(state, actions)}</header>`;
};
