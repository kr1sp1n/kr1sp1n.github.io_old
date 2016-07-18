const extend = require('xtend');

module.exports = function modifier(action, state) {
  switch (action.type) {
    case 'login':
      return extend(state, { loggingin: true, user: { name: action.username } });
    case 'loggedin':
      return extend(state, { loggingin: false, loggedin: true });
    case 'logout':
      return extend(state, { loggedin: false });
  }
};
