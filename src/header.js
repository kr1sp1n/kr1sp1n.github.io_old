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
    <div class="ten columns">
      ${loggedinText}
    </div>
    <div class="two columns"><button onclick="${actions.logout()}" class="button-primary ${loggedinClass}">Logout</div>
  </nav>`;
};
