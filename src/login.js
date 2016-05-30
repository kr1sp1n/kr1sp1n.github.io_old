'use strict';
const yo = require('yo-yo');
const document = require('global/document');
const Fingerprint2 = require('fingerprintjs2');

module.exports = function login(state, actions) {

  const getFingerprint = function () {
    // new Fingerprint2().get(function (result, components) {
    //   console.log(result); //a hash, representing your device fingerprint
    //   console.log(components); // an array of FP components
    // });

    return '123';
  };

  const fn = function () {
    return {
      fingerprint: getFingerprint(),
      username: document.querySelector('.login .username').value,
      password: document.querySelector('.login .password').value,
    };
  };

  var content = yo`<div>
    <input type="text" class="username"/>
    <input type="password" class="password"/>
    <button onclick="${actions.login(fn)}">OK</button>
  </div>`;

  var loggedinClass = '';
  if (state.loggedin) loggedinClass = 'hidden';

  if (state.loggingin) content = yo`<span>loading</span>`;

  return yo`<div class="login ${loggedinClass}">
    ${content}
  </div>`;
};
