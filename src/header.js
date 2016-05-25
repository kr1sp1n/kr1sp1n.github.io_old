'use strict';

const yo = require('yo-yo');
const login = require('./login');

module.exports = function header(state, actions) {
  return yo`<header><span>Hello ${state.user.name}</span>${login(state, actions)}</header>`;
};
