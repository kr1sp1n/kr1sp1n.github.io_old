'use strict';

require('normalize-css');
const yo = require('yo-yo');

const init = function () {
  console.log('init');

  window.localStorage.setItem('bears', JSON.stringify([
    'grizzly',
    'polar',
    'brown',
  ]));

  const bears = JSON.parse(window.localStorage.getItem('bears'));

  const el = list(bears);

  function list(items) {
    return yo`<ul>
      ${items.map(function (item) {
        return yo`<li>${item}</li>`;
      })}
    </ul>`;
  }

  document.body.appendChild(el);
};

if (window.localStorage.isLoaded) {
  window.localStorage.isLoaded(init);
} else {
  init.call(this);
}
