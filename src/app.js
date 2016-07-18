'use strict';

const update = require('./update');
const render = require('./render');

module.exports = function app(store) {

  const actions = {
    logout: function () {
      return function () {
        store({ type: 'logout' });
      };
    },

    login: function (fn) {
      return function () {
        const data = fn();
        data.fingerprint((err, result) => {
          store({
            type: 'login',
            fingerprint: result,
            username: data.username,
            password: data.password,
          });
          window.setTimeout(function () {
            store({ type: 'loggedin', token: 'abc123' });
          }, 2000);
        });
      };
    },
  };

  store.on('*', function (action, state, oldState) {
    update('.app', render(state, actions));
  });

  return render(store.getState(), actions);
};
