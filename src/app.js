'use strict';

const createStore = require('store-emitter');
const update = require('./update');
const render = require('./render');

module.exports = function app(initialState) {

  function modifier(action, state) {
    console.log(action);
    // switch (action.type) {
    //   case 'login':
    //     update('.app', render(store.getState()));
    //     console.log('XXX');
    // }
  }

  const store = createStore(modifier, initialState);

  store.on('*', function (action, state, oldState) {
    console.log('something changed');
  });

  const actions = {
    login: function () {
      store({ type: 'login' });
    },
  };

  return render(store.getState(), actions);
};
