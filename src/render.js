'use strict';

const yo = require('yo-yo');

const header = require('./header');
const message = require('./message');
const inbox = require('./inbox');

module.exports = function render(state, actions) {
  // const actions = {
  //   toggleMessage: function (id) {
  //     return function () {
  //       state.inbox.messages.forEach((message) => {
  //         if (message.id === id) {
  //           message.expanded = !message.expanded;
  //           if (message.status === 'unread') {
  //             message.status = 'read';
  //             state.inbox.unread -= 1;
  //           }
  //         }
  //       });
  //       update('.app', render(state));
  //     };
  //   },
  //
  //   login: function (x) {
  //     state.user.name = 'Lisa';
  //     update('.app', render(state));
  //   },
  //
  //   sendMessage: function (message) {
  //
  //   },
  // };

  //${header(state, actions)}
  //${message(state, actions)}
  var content = header(state, actions);
  // if (state.user.authenticated) content = inbox(state.inbox, action);
  return yo`<div class="app">
    <div class="content">
      ${content}
    </div>
  `;
};
