const document = require('global/document');
const yo = require('yo-yo');

module.exports = function update(f, t) {
  if (typeof f === 'string') {
    f = document.querySelector(f);
  }

  yo.update(f, t);
};
