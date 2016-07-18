const yo = require('yo-yo');

function parseUser(user) {
  var found = user.match(/(.*) <(.*)>/i);
  if (found) {
    const name = found[1];
    const email = found[2];

    // return yo`<a href="mailto://${email}">${name}</a>`;
    return name;
  } else {
    return user;
  }
}

function trimContent(content) {
  if (content.length > 60) {
    return content.substr(0, 60) + ' ...';
  } else {
    return content;
  }
}

function messageList(items, actions) {
  return yo



`<ul class="messages">
    ${items.map(function (item) {
      var expandedContent = '';
      var header = yo`<div>
        <span class="from">${parseUser(item.from)}</span>
        <span class="content">${trimContent(item.content)}</span>
      </div>`;

      if (item.expanded) {
        expandedContent = yo`
          <div>${item.content}</div>
        `;
        header = yo`<span class="from">${parseUser(item.from)}</span>`;
      }

      return yo`<li class="message ${item.status}" onclick="${actions.toggleMessage(item.id)}">
        ${header}
        ${expandedContent}
      </li>`;
    })}
  </ul>`;
}

module.exports = function inbox(state, actions) {
  var statusHeader = yo`<div>${state.unread} unread messages</div>`;
  if (state.unread === 0) statusHeader = yo`<div>no unread messages</div>`;
  return yo`<div class="inbox">
    ${statusHeader}
    <div>${messageList(state.messages, actions)}</div>
  </div>`;
};
