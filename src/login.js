const yo = require('yo-yo');
const document = require('global/document');
const Fingerprint2 = require('fingerprintjs2');

module.exports = function login(state, actions) {

  const getFingerprint = function (done) {
    new Fingerprint2().get(function (result, components) {
      // console.log(result); //a hash, representing your device fingerprint
      // console.log(components); // an array of FP components
      done(null, result);
    });
  };

  const fn = function () {
    return {
      fingerprint: getFingerprint,
      username: document.querySelector('.login .username').value,
      password: document.querySelector('.login .password').value,
    };
  };

  var content = yo`<div class="login">
    <div class="row">
      <div class="six columns">
        <label for="email_input">user</label>
        <input class="u-full-width username" type="text" id="email_input"/>
      </div>
      <div class="six columns">
        <label for="password_input">password</label>
        <input class="u-full-width password" type="password" id="password_input"/>
      </div>
    </div>
    <div class="row">
      <button class="button-primary" onclick="${actions.login(fn)}">Login</button>
    </div>
  </div>`;

  var loggedinClass = '';
  if (state.loggedin) loggedinClass = 'hidden';

  if (state.loggingin) content = yo`<span>loading</span>`;

  return yo`<div class="login ${loggedinClass}">
    ${content}
  </div>`;
};
