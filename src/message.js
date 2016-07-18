// send message to me
const yo = require('yo-yo');

module.exports = function message(state, actions) {
  return yo`<div class="message">
    <h2>Send me a message</h2>
    <div>
      <textarea></textarea>
    </div>
    <div>
      <button onclick="${actions.sendMessage}">Send</button>
    </div>
  </div>`;
};
