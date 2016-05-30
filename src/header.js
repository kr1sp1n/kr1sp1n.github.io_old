'use strict';

const yo = require('yo-yo');
// const login = require('./login');

module.exports = function header(state, actions) {
  var loggedinClass = 'hidden';
  if (state.loggedin) loggedinClass = '';
  return yo`<span>yeah</span>`;
  // return yo`<div class="row header">
  //   <div class="two columns"> </div>
  //   <div class="eight columns">Hello ${state.user.name}</div>
  //   <div class="two columns"><button onclick="${actions.logout()}" class="button-primary ${loggedinClass}">Logout</div>
  // </div>`;
};
