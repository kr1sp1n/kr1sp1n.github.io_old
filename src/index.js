require('normalize-css');

const yo = require('yo-yo');
const document = require('global/document');
const window = require('global/window');
const createStore = require('store-emitter');

const modifier = require('./modifier');
const app = require('./app');

const init = function () {
  // load state from local storage
  var state = JSON.parse(window.localStorage.getItem('state'));

  if (!state) {
    // generate default state if no state in local storage
    state = {
      loggedin: false,
      loggingin: false,
      user: {
        name: '',
        authenticated: false,
      },
      version: '1.0.0',
      status: 'offline',
      // inbox: {
      //   unread: 2,
      //   messages: [
      //     { id: '1', expanded: false, status: 'unread', from: 'Lisa <lisabogen@googlemail.com>', content: 'Hallo mein Liebling. Hiermit schreibe ich dir eine schöne kleine Nachricht und wollte dir nur sagen, dass ich dich unglaublich liebe!!!!!' },
      //     { id: '2', expanded: false, status: 'unread', from: 'Burki', content: 'Ey Keule. Nur mal so!' },
      //     { id: '3', expanded: false, status: 'read', from: 'Patrick', content: 'Na, was los? Ich wollte mal frage, ob ihr vielleicht zu meinem Geburtstag kommen wollt.' },
      //   ],
      // },
    };
  }

  const store = createStore(modifier, state);

  store.on('*', function (action, state, oldState) {
    window.localStorage.setItem('state', JSON.stringify(state));
  });

  document.body.appendChild(app(store));

};

if (window.localStorage.isLoaded) {
  window.localStorage.isLoaded(init);
} else {
  init.call(this);
}
