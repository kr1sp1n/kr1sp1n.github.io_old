'use strict';

require('normalize-css');

const yo = require('yo-yo');
const document = require('global/document');
const window = require('global/window');

const init = function () {
  // load state from local storage
  var state = window.localStorage.getItem('state');

  if (!state) {
    // generate default state if no state in local storage
    state = {
      user: {
        name: 'Krispin',
        authenticated: true,
      },
      version: '1.0.0',
      status: 'offline',
      inbox: {
        unread: 2,
        messages: [
          { id: '1', expanded: false, status: 'unread', from: 'Lisa <lisabogen@googlemail.com>', content: 'Hallo mein Liebling. Hiermit schreibe ich dir eine schöne kleine Nachricht und wollte dir nur sagen, dass ich dich unglaublich liebe!!!!!' },
          { id: '2', expanded: false, status: 'unread', from: 'Burki', content: 'Ey Keule. Nur mal so!' },
          { id: '3', expanded: false, status: 'read', from: 'Patrick', content: 'Na, was los? Ich wollte mal frage, ob ihr vielleicht zu meinem Geburtstag kommen wollt.' },
        ],
      },
    };
  }

  const app = require('./app');
  document.body.appendChild(app(state));

};

if (window.localStorage.isLoaded) {
  window.localStorage.isLoaded(init);
} else {
  init.call(this);
}
