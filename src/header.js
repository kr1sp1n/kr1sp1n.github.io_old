'use strict';

const yo = require('yo-yo');
// const login = require('./login');

module.exports = function header(state, actions) {
  return yo`<header onclick="${actions.login}"><span>Hello ${state.user.name}</span></header>`;
};
