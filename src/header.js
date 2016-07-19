const yo = require('yo-yo');
// const login = require('./login');

module.exports = function header(state, actions) {
  var loggedinClass = 'hidden';
  var loggedinText = '';

  if (state.loggedin) {
    loggedinClass = '';
    loggedinText = yo`<span>Hello ${state.user.name}</span>`;
  }

  return yo`<nav class="row header">
    <div class="row ${loggedinClass}">
      <button onclick="${actions.logout()}" class="button-primary">Logout</button>
    </div>
    <div class="row">
      ${loggedinText}
    </div>
  </nav>`;
};
