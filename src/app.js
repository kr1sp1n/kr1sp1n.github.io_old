'use strict';

const createStore = require('store-emitter');
const extend = require('xtend');

const update = require('./update');
const render = require('./render');

module.exports = function app(initialState) {

  function modifier(action, state) {
    switch (action.type) {
      case 'login':
        return extend(state, { user: { name: 'Lisa' } });
    }
  }

  const store = createStore(modifier, initialState);

  const actions = {
    login: function () {
      store({ type: 'login' });
    },
  };

  store.on('*', function (action, state, oldState) {
    console.log('something changed');
    update('.app', render(state, actions));
  });

  return render(store.getState(), actions);
};
