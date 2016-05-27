(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":1}],3:[function(require,module,exports){
(function (global){
if (typeof window !== "undefined") {
    module.exports = window;
} else if (typeof global !== "undefined") {
    module.exports = global;
} else if (typeof self !== "undefined"){
    module.exports = self;
} else {
    module.exports = {};
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
var inserted = [];

module.exports = function (css) {
    if (inserted.indexOf(css) >= 0) return;
    inserted.push(css);
    
    var elem = document.createElement('style');
    var text = document.createTextNode(css);
    elem.appendChild(text);
    
    if (document.head.childNodes.length) {
        document.head.insertBefore(elem, document.head.childNodes[0]);
    }
    else {
        document.head.appendChild(elem);
    }
};

},{}],5:[function(require,module,exports){
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var isObject = require('isobject');

function isObjectObject(o) {
  return isObject(o) === true
    && Object.prototype.toString.call(o) === '[object Object]';
}

module.exports = function isPlainObject(o) {
  var ctor,prot;
  
  if (isObjectObject(o) === false) return false;
  
  // If has modified constructor
  ctor = o.constructor;
  if (typeof ctor !== 'function') return false;
  
  // If has modified prototype
  prot = ctor.prototype;
  if (isObjectObject(prot) === false) return false;
  
  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }
  
  // Most likely a plain Object
  return true;
};

},{"isobject":6}],6:[function(require,module,exports){
/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

module.exports = function isObject(val) {
  return val != null && typeof val === 'object'
    && !Array.isArray(val);
};

},{}],7:[function(require,module,exports){
// Create a range object for efficently rendering strings to elements.
var range;

var testEl = typeof document !== 'undefined' ? document.body || document.createElement('div') : {};

// Fixes https://github.com/patrick-steele-idem/morphdom/issues/32 (IE7+ support)
// <=IE7 does not support el.hasAttribute(name)
var hasAttribute;
if (testEl.hasAttribute) {
    hasAttribute = function hasAttribute(el, name) {
        return el.hasAttribute(name);
    };
} else {
    hasAttribute = function hasAttribute(el, name) {
        return el.getAttributeNode(name);
    };
}

function empty(o) {
    for (var k in o) {
        if (o.hasOwnProperty(k)) {
            return false;
        }
    }

    return true;
}
function toElement(str) {
    if (!range && document.createRange) {
        range = document.createRange();
        range.selectNode(document.body);
    }

    var fragment;
    if (range && range.createContextualFragment) {
        fragment = range.createContextualFragment(str);
    } else {
        fragment = document.createElement('body');
        fragment.innerHTML = str;
    }
    return fragment.childNodes[0];
}

var specialElHandlers = {
    /**
     * Needed for IE. Apparently IE doesn't think
     * that "selected" is an attribute when reading
     * over the attributes using selectEl.attributes
     */
    OPTION: function(fromEl, toEl) {
        if ((fromEl.selected = toEl.selected)) {
            fromEl.setAttribute('selected', '');
        } else {
            fromEl.removeAttribute('selected', '');
        }
    },
    /**
     * The "value" attribute is special for the <input> element
     * since it sets the initial value. Changing the "value"
     * attribute without changing the "value" property will have
     * no effect since it is only used to the set the initial value.
     * Similar for the "checked" attribute.
     */
    INPUT: function(fromEl, toEl) {
        fromEl.checked = toEl.checked;

        if (fromEl.value != toEl.value) {
            fromEl.value = toEl.value;
        }

        if (!hasAttribute(toEl, 'checked')) {
            fromEl.removeAttribute('checked');
        }

        if (!hasAttribute(toEl, 'value')) {
            fromEl.removeAttribute('value');
        }
    },

    TEXTAREA: function(fromEl, toEl) {
        var newValue = toEl.value;
        if (fromEl.value != newValue) {
            fromEl.value = newValue;
        }

        if (fromEl.firstChild) {
            fromEl.firstChild.nodeValue = newValue;
        }
    }
};

function noop() {}

/**
 * Loop over all of the attributes on the target node and make sure the
 * original DOM node has the same attributes. If an attribute
 * found on the original node is not on the new node then remove it from
 * the original node
 * @param  {HTMLElement} fromNode
 * @param  {HTMLElement} toNode
 */
function morphAttrs(fromNode, toNode) {
    var attrs = toNode.attributes;
    var i;
    var attr;
    var attrName;
    var attrValue;
    var foundAttrs = {};

    for (i=attrs.length-1; i>=0; i--) {
        attr = attrs[i];
        if (attr.specified !== false) {
            attrName = attr.name;
            attrValue = attr.value;
            foundAttrs[attrName] = true;

            if (fromNode.getAttribute(attrName) !== attrValue) {
                fromNode.setAttribute(attrName, attrValue);
            }
        }
    }

    // Delete any extra attributes found on the original DOM element that weren't
    // found on the target element.
    attrs = fromNode.attributes;

    for (i=attrs.length-1; i>=0; i--) {
        attr = attrs[i];
        if (attr.specified !== false) {
            attrName = attr.name;
            if (!foundAttrs.hasOwnProperty(attrName)) {
                fromNode.removeAttribute(attrName);
            }
        }
    }
}

/**
 * Copies the children of one DOM element to another DOM element
 */
function moveChildren(fromEl, toEl) {
    var curChild = fromEl.firstChild;
    while(curChild) {
        var nextChild = curChild.nextSibling;
        toEl.appendChild(curChild);
        curChild = nextChild;
    }
    return toEl;
}

function defaultGetNodeKey(node) {
    return node.id;
}

function morphdom(fromNode, toNode, options) {
    if (!options) {
        options = {};
    }

    if (typeof toNode === 'string') {
        if (fromNode.nodeName === '#document' || fromNode.nodeName === 'HTML') {
            var toNodeHtml = toNode;
            toNode = document.createElement('html');
            toNode.innerHTML = toNodeHtml;
        } else {
            toNode = toElement(toNode);
        }
    }

    var savedEls = {}; // Used to save off DOM elements with IDs
    var unmatchedEls = {};
    var getNodeKey = options.getNodeKey || defaultGetNodeKey;
    var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
    var onNodeAdded = options.onNodeAdded || noop;
    var onBeforeElUpdated = options.onBeforeElUpdated || options.onBeforeMorphEl || noop;
    var onElUpdated = options.onElUpdated || noop;
    var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
    var onNodeDiscarded = options.onNodeDiscarded || noop;
    var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || options.onBeforeMorphElChildren || noop;
    var childrenOnly = options.childrenOnly === true;
    var movedEls = [];

    function removeNodeHelper(node, nestedInSavedEl) {
        var id = getNodeKey(node);
        // If the node has an ID then save it off since we will want
        // to reuse it in case the target DOM tree has a DOM element
        // with the same ID
        if (id) {
            savedEls[id] = node;
        } else if (!nestedInSavedEl) {
            // If we are not nested in a saved element then we know that this node has been
            // completely discarded and will not exist in the final DOM.
            onNodeDiscarded(node);
        }

        if (node.nodeType === 1) {
            var curChild = node.firstChild;
            while(curChild) {
                removeNodeHelper(curChild, nestedInSavedEl || id);
                curChild = curChild.nextSibling;
            }
        }
    }

    function walkDiscardedChildNodes(node) {
        if (node.nodeType === 1) {
            var curChild = node.firstChild;
            while(curChild) {


                if (!getNodeKey(curChild)) {
                    // We only want to handle nodes that don't have an ID to avoid double
                    // walking the same saved element.

                    onNodeDiscarded(curChild);

                    // Walk recursively
                    walkDiscardedChildNodes(curChild);
                }

                curChild = curChild.nextSibling;
            }
        }
    }

    function removeNode(node, parentNode, alreadyVisited) {
        if (onBeforeNodeDiscarded(node) === false) {
            return;
        }

        parentNode.removeChild(node);
        if (alreadyVisited) {
            if (!getNodeKey(node)) {
                onNodeDiscarded(node);
                walkDiscardedChildNodes(node);
            }
        } else {
            removeNodeHelper(node);
        }
    }

    function morphEl(fromEl, toEl, alreadyVisited, childrenOnly) {
        var toElKey = getNodeKey(toEl);
        if (toElKey) {
            // If an element with an ID is being morphed then it is will be in the final
            // DOM so clear it out of the saved elements collection
            delete savedEls[toElKey];
        }

        if (!childrenOnly) {
            if (onBeforeElUpdated(fromEl, toEl) === false) {
                return;
            }

            morphAttrs(fromEl, toEl);
            onElUpdated(fromEl);

            if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
                return;
            }
        }

        if (fromEl.tagName != 'TEXTAREA') {
            var curToNodeChild = toEl.firstChild;
            var curFromNodeChild = fromEl.firstChild;
            var curToNodeId;

            var fromNextSibling;
            var toNextSibling;
            var savedEl;
            var unmatchedEl;

            outer: while(curToNodeChild) {
                toNextSibling = curToNodeChild.nextSibling;
                curToNodeId = getNodeKey(curToNodeChild);

                while(curFromNodeChild) {
                    var curFromNodeId = getNodeKey(curFromNodeChild);
                    fromNextSibling = curFromNodeChild.nextSibling;

                    if (!alreadyVisited) {
                        if (curFromNodeId && (unmatchedEl = unmatchedEls[curFromNodeId])) {
                            unmatchedEl.parentNode.replaceChild(curFromNodeChild, unmatchedEl);
                            morphEl(curFromNodeChild, unmatchedEl, alreadyVisited);
                            curFromNodeChild = fromNextSibling;
                            continue;
                        }
                    }

                    var curFromNodeType = curFromNodeChild.nodeType;

                    if (curFromNodeType === curToNodeChild.nodeType) {
                        var isCompatible = false;

                        if (curFromNodeType === 1) { // Both nodes being compared are Element nodes
                            if (curFromNodeChild.tagName === curToNodeChild.tagName) {
                                // We have compatible DOM elements
                                if (curFromNodeId || curToNodeId) {
                                    // If either DOM element has an ID then we handle
                                    // those differently since we want to match up
                                    // by ID
                                    if (curToNodeId === curFromNodeId) {
                                        isCompatible = true;
                                    }
                                } else {
                                    isCompatible = true;
                                }
                            }

                            if (isCompatible) {
                                // We found compatible DOM elements so transform the current "from" node
                                // to match the current target DOM node.
                                morphEl(curFromNodeChild, curToNodeChild, alreadyVisited);
                            }
                        } else if (curFromNodeType === 3) { // Both nodes being compared are Text nodes
                            isCompatible = true;
                            // Simply update nodeValue on the original node to change the text value
                            curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
                        }

                        if (isCompatible) {
                            curToNodeChild = toNextSibling;
                            curFromNodeChild = fromNextSibling;
                            continue outer;
                        }
                    }

                    // No compatible match so remove the old node from the DOM and continue trying
                    // to find a match in the original DOM
                    removeNode(curFromNodeChild, fromEl, alreadyVisited);
                    curFromNodeChild = fromNextSibling;
                }

                if (curToNodeId) {
                    if ((savedEl = savedEls[curToNodeId])) {
                        morphEl(savedEl, curToNodeChild, true);
                        curToNodeChild = savedEl; // We want to append the saved element instead
                    } else {
                        // The current DOM element in the target tree has an ID
                        // but we did not find a match in any of the corresponding
                        // siblings. We just put the target element in the old DOM tree
                        // but if we later find an element in the old DOM tree that has
                        // a matching ID then we will replace the target element
                        // with the corresponding old element and morph the old element
                        unmatchedEls[curToNodeId] = curToNodeChild;
                    }
                }

                // If we got this far then we did not find a candidate match for our "to node"
                // and we exhausted all of the children "from" nodes. Therefore, we will just
                // append the current "to node" to the end
                if (onBeforeNodeAdded(curToNodeChild) !== false) {
                    fromEl.appendChild(curToNodeChild);
                    onNodeAdded(curToNodeChild);
                }

                if (curToNodeChild.nodeType === 1 && (curToNodeId || curToNodeChild.firstChild)) {
                    // The element that was just added to the original DOM may have
                    // some nested elements with a key/ID that needs to be matched up
                    // with other elements. We'll add the element to a list so that we
                    // can later process the nested elements if there are any unmatched
                    // keyed elements that were discarded
                    movedEls.push(curToNodeChild);
                }

                curToNodeChild = toNextSibling;
                curFromNodeChild = fromNextSibling;
            }

            // We have processed all of the "to nodes". If curFromNodeChild is non-null then
            // we still have some from nodes left over that need to be removed
            while(curFromNodeChild) {
                fromNextSibling = curFromNodeChild.nextSibling;
                removeNode(curFromNodeChild, fromEl, alreadyVisited);
                curFromNodeChild = fromNextSibling;
            }
        }

        var specialElHandler = specialElHandlers[fromEl.tagName];
        if (specialElHandler) {
            specialElHandler(fromEl, toEl);
        }
    } // END: morphEl(...)

    var morphedNode = fromNode;
    var morphedNodeType = morphedNode.nodeType;
    var toNodeType = toNode.nodeType;

    if (!childrenOnly) {
        // Handle the case where we are given two DOM nodes that are not
        // compatible (e.g. <div> --> <span> or <div> --> TEXT)
        if (morphedNodeType === 1) {
            if (toNodeType === 1) {
                if (fromNode.tagName !== toNode.tagName) {
                    onNodeDiscarded(fromNode);
                    morphedNode = moveChildren(fromNode, document.createElement(toNode.tagName));
                }
            } else {
                // Going from an element node to a text node
                morphedNode = toNode;
            }
        } else if (morphedNodeType === 3) { // Text node
            if (toNodeType === 3) {
                morphedNode.nodeValue = toNode.nodeValue;
                return morphedNode;
            } else {
                // Text node to something else
                morphedNode = toNode;
            }
        }
    }

    if (morphedNode === toNode) {
        // The "to node" was not compatible with the "from node"
        // so we had to toss out the "from node" and use the "to node"
        onNodeDiscarded(fromNode);
    } else {
        morphEl(morphedNode, toNode, false, childrenOnly);

        /**
         * What we will do here is walk the tree for the DOM element
         * that was moved from the target DOM tree to the original
         * DOM tree and we will look for keyed elements that could
         * be matched to keyed elements that were earlier discarded.
         * If we find a match then we will move the saved element
         * into the final DOM tree
         */
        var handleMovedEl = function(el) {
            var curChild = el.firstChild;
            while(curChild) {
                var nextSibling = curChild.nextSibling;

                var key = getNodeKey(curChild);
                if (key) {
                    var savedEl = savedEls[key];
                    if (savedEl && (curChild.tagName === savedEl.tagName)) {
                        curChild.parentNode.replaceChild(savedEl, curChild);
                        morphEl(savedEl, curChild, true /* already visited the saved el tree */);
                        curChild = nextSibling;
                        if (empty(savedEls)) {
                            return false;
                        }
                        continue;
                    }
                }

                if (curChild.nodeType === 1) {
                    handleMovedEl(curChild);
                }

                curChild = nextSibling;
            }
        };

        // The loop below is used to possibly match up any discarded
        // elements in the original DOM tree with elemenets from the
        // target tree that were moved over without visiting their
        // children
        if (!empty(savedEls)) {
            handleMovedElsLoop:
            while (movedEls.length) {
                var movedElsTemp = movedEls;
                movedEls = [];
                for (var i=0; i<movedElsTemp.length; i++) {
                    if (handleMovedEl(movedElsTemp[i]) === false) {
                        // There are no more unmatched elements so completely end
                        // the loop
                        break handleMovedElsLoop;
                    }
                }
            }
        }

        // Fire the "onNodeDiscarded" event for any saved elements
        // that never found a new home in the morphed DOM
        for (var savedElId in savedEls) {
            if (savedEls.hasOwnProperty(savedElId)) {
                var savedEl = savedEls[savedElId];
                onNodeDiscarded(savedEl);
                walkDiscardedChildNodes(savedEl);
            }
        }
    }

    if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
        // If we had to swap out the from node with a new node because the old
        // node was not compatible with the target node then we need to
        // replace the old DOM node in the original DOM tree. This is only
        // possible if the original DOM node was part of a DOM tree which
        // we know is the case if it has a parent node.
        fromNode.parentNode.replaceChild(morphedNode, fromNode);
    }

    return morphedNode;
}

module.exports = morphdom;

},{}],8:[function(require,module,exports){
/**
* Create an event emitter with namespaces
* @name createNamespaceEmitter
* @example
* var emitter = require('./index')()
*
* emitter.on('*', function () {
*   console.log('all events emitted', this.event)
* })
*
* emitter.on('example', function () {
*   console.log('example event emitted')
* })
*/
module.exports = function createNamespaceEmitter () {
  var emitter = { _fns: {} }

  /**
  * Emit an event. Optionally namespace the event. Separate the namespace and event with a `:`
  * @name emit
  * @param {String} event – the name of the event, with optional namespace
  * @param {...*} data – data variables that will be passed as arguments to the event listener
  * @example
  * emitter.emit('example')
  * emitter.emit('demo:test')
  * emitter.emit('data', { example: true}, 'a string', 1)
  */
  emitter.emit = function emit (event) {
    var args = [].slice.call(arguments, 1)
    var namespaced = namespaces(event)
    if (this._fns[event]) emitAll(event, this._fns[event], args)
    if (namespaced) emitAll(event, namespaced, args)
  }

  /**
  * Create en event listener.
  * @name on
  * @param {String} event
  * @param {Function} fn
  * @example
  * emitter.on('example', function () {})
  * emitter.on('demo', function () {})
  */
  emitter.on = function on (event, fn) {
    if (typeof fn !== 'function') { throw new Error('callback required') }
    (this._fns[event] = this._fns[event] || []).push(fn)
  }

  /**
  * Create en event listener that fires once.
  * @name once
  * @param {String} event
  * @param {Function} fn
  * @example
  * emitter.once('example', function () {})
  * emitter.once('demo', function () {})
  */
  emitter.once = function once (event, fn) {
    function one () {
      fn.apply(this, arguments)
      emitter.off(event, one)
    }
    this.on(event, one)
  }

  /**
  * Stop listening to an event. Stop all listeners on an event by only passing the event name. Stop a single listener by passing that event handler as a callback.
  * You must be explicit about what will be unsubscribed: `emitter.off('demo')` will unsubscribe an `emitter.on('demo')` listener, 
  * `emitter.off('demo:example')` will unsubscribe an `emitter.on('demo:example')` listener
  * @name off
  * @param {String} event
  * @param {Function} [fn] – the specific handler
  * @example
  * emitter.off('example')
  * emitter.off('demo', function () {})
  */
  emitter.off = function off (event, fn) {
    var keep = []

    if (event && fn) {
      for (var i = 0; i < this._fns.length; i++) {
        if (this._fns[i] !== fn) {
          keep.push(this._fns[i])
        }
      }
    }

    keep.length ? this._fns[event] = keep : delete this._fns[event]
  }

  function namespaces (e) {
    var out = []
    var args = e.split(':')
    var fns = emitter._fns
    Object.keys(fns).forEach(function (key) {
      if (key === '*') out = out.concat(fns[key])
      if (args.length === 2 && args[0] === key) out = out.concat(fns[key])
    })
    return out
  }

  function emitAll (e, fns, args) {
    for (var i = 0; i < fns.length; i++) {
      if (!fns[i]) break
      fns[i].event = e
      fns[i].apply(fns[i], args)
    }
  }

  return emitter
}

},{}],9:[function(require,module,exports){
var insert = require('insert-css');
var normalize = require('./normalize');

insert(normalize);

},{"./normalize":10,"insert-css":4}],10:[function(require,module,exports){
module.exports = "/*! normalize.css v2.1.3 | MIT License | git.io/normalize */\n\n/* ==========================================================================\n   HTML5 display definitions\n   ========================================================================== */\n\n/**\n * Correct `block` display not defined in IE 8/9.\n */\n\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmain,\nnav,\nsection,\nsummary {\n    display: block;\n}\n\n/**\n * Correct `inline-block` display not defined in IE 8/9.\n */\n\naudio,\ncanvas,\nvideo {\n    display: inline-block;\n}\n\n/**\n * Prevent modern browsers from displaying `audio` without controls.\n * Remove excess height in iOS 5 devices.\n */\n\naudio:not([controls]) {\n    display: none;\n    height: 0;\n}\n\n/**\n * Address `[hidden]` styling not present in IE 8/9.\n * Hide the `template` element in IE, Safari, and Firefox < 22.\n */\n\n[hidden],\ntemplate {\n    display: none;\n}\n\n/* ==========================================================================\n   Base\n   ========================================================================== */\n\n/**\n * 1. Set default font family to sans-serif.\n * 2. Prevent iOS text size adjust after orientation change, without disabling\n *    user zoom.\n */\n\nhtml {\n    font-family: sans-serif; /* 1 */\n    -ms-text-size-adjust: 100%; /* 2 */\n    -webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/**\n * Remove default margin.\n */\n\nbody {\n    margin: 0;\n}\n\n/* ==========================================================================\n   Links\n   ========================================================================== */\n\n/**\n * Remove the gray background color from active links in IE 10.\n */\n\na {\n    background: transparent;\n}\n\n/**\n * Address `outline` inconsistency between Chrome and other browsers.\n */\n\na:focus {\n    outline: thin dotted;\n}\n\n/**\n * Improve readability when focused and also mouse hovered in all browsers.\n */\n\na:active,\na:hover {\n    outline: 0;\n}\n\n/* ==========================================================================\n   Typography\n   ========================================================================== */\n\n/**\n * Address variable `h1` font-size and margin within `section` and `article`\n * contexts in Firefox 4+, Safari 5, and Chrome.\n */\n\nh1 {\n    font-size: 2em;\n    margin: 0.67em 0;\n}\n\n/**\n * Address styling not present in IE 8/9, Safari 5, and Chrome.\n */\n\nabbr[title] {\n    border-bottom: 1px dotted;\n}\n\n/**\n * Address style set to `bolder` in Firefox 4+, Safari 5, and Chrome.\n */\n\nb,\nstrong {\n    font-weight: bold;\n}\n\n/**\n * Address styling not present in Safari 5 and Chrome.\n */\n\ndfn {\n    font-style: italic;\n}\n\n/**\n * Address differences between Firefox and other browsers.\n */\n\nhr {\n    -moz-box-sizing: content-box;\n    box-sizing: content-box;\n    height: 0;\n}\n\n/**\n * Address styling not present in IE 8/9.\n */\n\nmark {\n    background: #ff0;\n    color: #000;\n}\n\n/**\n * Correct font family set oddly in Safari 5 and Chrome.\n */\n\ncode,\nkbd,\npre,\nsamp {\n    font-family: monospace, serif;\n    font-size: 1em;\n}\n\n/**\n * Improve readability of pre-formatted text in all browsers.\n */\n\npre {\n    white-space: pre-wrap;\n}\n\n/**\n * Set consistent quote types.\n */\n\nq {\n    quotes: \"\\201C\" \"\\201D\" \"\\2018\" \"\\2019\";\n}\n\n/**\n * Address inconsistent and variable font size in all browsers.\n */\n\nsmall {\n    font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` affecting `line-height` in all browsers.\n */\n\nsub,\nsup {\n    font-size: 75%;\n    line-height: 0;\n    position: relative;\n    vertical-align: baseline;\n}\n\nsup {\n    top: -0.5em;\n}\n\nsub {\n    bottom: -0.25em;\n}\n\n/* ==========================================================================\n   Embedded content\n   ========================================================================== */\n\n/**\n * Remove border when inside `a` element in IE 8/9.\n */\n\nimg {\n    border: 0;\n}\n\n/**\n * Correct overflow displayed oddly in IE 9.\n */\n\nsvg:not(:root) {\n    overflow: hidden;\n}\n\n/* ==========================================================================\n   Figures\n   ========================================================================== */\n\n/**\n * Address margin not present in IE 8/9 and Safari 5.\n */\n\nfigure {\n    margin: 0;\n}\n\n/* ==========================================================================\n   Forms\n   ========================================================================== */\n\n/**\n * Define consistent border, margin, and padding.\n */\n\nfieldset {\n    border: 1px solid #c0c0c0;\n    margin: 0 2px;\n    padding: 0.35em 0.625em 0.75em;\n}\n\n/**\n * 1. Correct `color` not being inherited in IE 8/9.\n * 2. Remove padding so people aren't caught out if they zero out fieldsets.\n */\n\nlegend {\n    border: 0; /* 1 */\n    padding: 0; /* 2 */\n}\n\n/**\n * 1. Correct font family not being inherited in all browsers.\n * 2. Correct font size not being inherited in all browsers.\n * 3. Address margins set differently in Firefox 4+, Safari 5, and Chrome.\n */\n\nbutton,\ninput,\nselect,\ntextarea {\n    font-family: inherit; /* 1 */\n    font-size: 100%; /* 2 */\n    margin: 0; /* 3 */\n}\n\n/**\n * Address Firefox 4+ setting `line-height` on `input` using `!important` in\n * the UA stylesheet.\n */\n\nbutton,\ninput {\n    line-height: normal;\n}\n\n/**\n * Address inconsistent `text-transform` inheritance for `button` and `select`.\n * All other form control elements do not inherit `text-transform` values.\n * Correct `button` style inheritance in Chrome, Safari 5+, and IE 8+.\n * Correct `select` style inheritance in Firefox 4+ and Opera.\n */\n\nbutton,\nselect {\n    text-transform: none;\n}\n\n/**\n * 1. Avoid the WebKit bug in Android 4.0.* where (2) destroys native `audio`\n *    and `video` controls.\n * 2. Correct inability to style clickable `input` types in iOS.\n * 3. Improve usability and consistency of cursor style between image-type\n *    `input` and others.\n */\n\nbutton,\nhtml input[type=\"button\"], /* 1 */\ninput[type=\"reset\"],\ninput[type=\"submit\"] {\n    -webkit-appearance: button; /* 2 */\n    cursor: pointer; /* 3 */\n}\n\n/**\n * Re-set default cursor for disabled elements.\n */\n\nbutton[disabled],\nhtml input[disabled] {\n    cursor: default;\n}\n\n/**\n * 1. Address box sizing set to `content-box` in IE 8/9/10.\n * 2. Remove excess padding in IE 8/9/10.\n */\n\ninput[type=\"checkbox\"],\ninput[type=\"radio\"] {\n    box-sizing: border-box; /* 1 */\n    padding: 0; /* 2 */\n}\n\n/**\n * 1. Address `appearance` set to `searchfield` in Safari 5 and Chrome.\n * 2. Address `box-sizing` set to `border-box` in Safari 5 and Chrome\n *    (include `-moz` to future-proof).\n */\n\ninput[type=\"search\"] {\n    -webkit-appearance: textfield; /* 1 */\n    -moz-box-sizing: content-box;\n    -webkit-box-sizing: content-box; /* 2 */\n    box-sizing: content-box;\n}\n\n/**\n * Remove inner padding and search cancel button in Safari 5 and Chrome\n * on OS X.\n */\n\ninput[type=\"search\"]::-webkit-search-cancel-button,\ninput[type=\"search\"]::-webkit-search-decoration {\n    -webkit-appearance: none;\n}\n\n/**\n * Remove inner padding and border in Firefox 4+.\n */\n\nbutton::-moz-focus-inner,\ninput::-moz-focus-inner {\n    border: 0;\n    padding: 0;\n}\n\n/**\n * 1. Remove default vertical scrollbar in IE 8/9.\n * 2. Improve readability and alignment in all browsers.\n */\n\ntextarea {\n    overflow: auto; /* 1 */\n    vertical-align: top; /* 2 */\n}\n\n/* ==========================================================================\n   Tables\n   ========================================================================== */\n\n/**\n * Remove most spacing between table cells.\n */\n\ntable {\n    border-collapse: collapse;\n    border-spacing: 0;\n}\n"

},{}],11:[function(require,module,exports){
var createEmitter = require('namespace-emitter')
var isPlainObject = require('is-plain-object')
var extend = require('xtend')

/**
* Create the store
* @name createStoreEmitter
* @param {function} modifier
* @param {object} [initialState]
* @example
* var createStore = require('store-emitter')
* var store = createStore(function (action, state) {
*   if (action.type === 'change_something') {
*     return { something: 'changed' }
*   }
* })
*/
module.exports = function createStore (modifier, initialState) {
  if (typeof modifier !== 'function') {
    throw new Error('first argument must be a function')
  }

  var emitter = createEmitter()
  initialState = initialState || {}
  var isEmitting = false
  var state = extend(initialState)
  store.initialState = getInitialState
  store.getState = getState
  store.emit = store
  store.on = on
  store.once = once
  store.off = off
  return store

  /**
  * Send an action to the store. Takes a single object parameter. Object must include a `type` property with a string value, and can contain any other properties.
  * @name store
  * @param {object} action
  * @param {string} action.type
  * @example
  * store({
  *   type: 'example'
  *   exampleValue: 'anything'
  * })
  */
  function store (action) {
    if (!action || !isPlainObject(action)) {
      throw new Error('action parameter is required and must be a plain object')
    }

    if (!action.type || typeof action.type !== 'string') {
      throw new Error('type property of action is required and must be a string')
    }

    if (isEmitting) {
      throw new Error('modifiers may not emit actions')
    }

    isEmitting = true
    var oldState = extend(state)
    state = modifier(action, oldState)
    var newState = extend(state)

    emitter.emit(action.type, action, newState, oldState)
    isEmitting = false
  }

  /**
  * Get the initial state of the store
  * @name store.initialState
  * @example
  * var state = store.initialState()
  */
  function getInitialState () {
    return initialState
  }

  /**
   * Get the current state of the store
   * @name store.getState
   * @example
   * var state = store.getState()
   */
  function getState () {
    return state
  }

  /**
  * Listen for changes to the store
  * @name store.on
  * @param {string} event – an action type
  * @param {Function} callback
  * @example
  * store.on('*', function (action, state, oldState) {
  *
  * })
  *
  * store.on('article', function (action, state, oldState) {
  *
  * })
  *
  * store.on('article:delete', function (action, state, oldState) {
  *
  * })
  */
  function on (event, callback) {
    emitter.on(event, callback)
  }

  /**
  * Listen for a single change to the store
  * @name store.once
  * @param {string} event – an action type
  * @param {Function} callback
  * @example
  * store.once('article', function (action, state, oldState) {
  *
  * })
  */
  function once (event, callback) {
    emitter.once(event, callback)
  }

  /**
  * Stop listening for changes to the store. Passing just the action type will remove all listeners for that action type.
  * @name store.off
  * @param {string} event – an action type
  * @param {Function} [callback] – optional callback
  * @example
  * store.off('article', function (action, state, oldState) {
  *
  * })
  */
  function off (event, callback) {
    emitter.off(event, callback)
  }
}

},{"is-plain-object":5,"namespace-emitter":8,"xtend":12}],12:[function(require,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],13:[function(require,module,exports){
var bel = {} // turns template tag into DOM elements
var morphdom = require('morphdom') // efficiently diffs + morphs two DOM elements
var defaultEvents = require('./update-events.js') // default events to be copied when dom elements update

module.exports = bel

// TODO move this + defaultEvents to a new module once we receive more feedback
module.exports.update = function (fromNode, toNode, opts) {
  if (!opts) opts = {}
  if (opts.events !== false) {
    if (!opts.onBeforeMorphEl) opts.onBeforeMorphEl = copier
  }

  return morphdom(fromNode, toNode, opts)

  // morphdom only copies attributes. we decided we also wanted to copy events
  // that can be set via attributes
  function copier (f, t) {
    // copy events:
    var events = opts.events || defaultEvents
    for (var i = 0; i < events.length; i++) {
      var ev = events[i]
      if (t[ev]) { // if new element has a whitelisted attribute
        f[ev] = t[ev] // update existing element
      } else if (f[ev]) { // if existing element has it and new one doesnt
        f[ev] = undefined // remove it from existing element
      }
    }
    // copy values for form elements
    if (f.nodeName === 'INPUT' || f.nodeName === 'TEXTAREA' || f.nodeNAME === 'SELECT') {
      if (t.getAttribute('value') === null) t.value = f.value
    }
  }
}

},{"./update-events.js":14,"morphdom":7}],14:[function(require,module,exports){
module.exports = [
  // attribute events (can be set with attributes)
  'onclick',
  'ondblclick',
  'onmousedown',
  'onmouseup',
  'onmouseover',
  'onmousemove',
  'onmouseout',
  'ondragstart',
  'ondrag',
  'ondragenter',
  'ondragleave',
  'ondragover',
  'ondrop',
  'ondragend',
  'onkeydown',
  'onkeypress',
  'onkeyup',
  'onunload',
  'onabort',
  'onerror',
  'onresize',
  'onscroll',
  'onselect',
  'onchange',
  'onsubmit',
  'onreset',
  'onfocus',
  'onblur',
  'oninput',
  // other common events
  'oncontextmenu',
  'onfocusin',
  'onfocusout'
]

},{}],15:[function(require,module,exports){
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

},{"./render":20,"./update":21,"store-emitter":11,"xtend":12}],16:[function(require,module,exports){
'use strict';

const yo = require('yo-yo');
// const login = require('./login');

module.exports = function header(state, actions) {
  return (function () {
          function appendChild (el, childs) {
            for (var i = 0; i < childs.length; i++) {
              var node = childs[i];
              if (Array.isArray(node)) {
                appendChild(el, node)
                continue
              }
              if (typeof node === "number" ||
                typeof node === "boolean" ||
                node instanceof Date ||
                node instanceof RegExp) {
                node = node.toString()
              }

              if (typeof node === "string") {
                if (el.lastChild && el.lastChild.nodeName === "#text") {
                  el.lastChild.nodeValue += node
                  continue
                }
                node = document.createTextNode(node)
              }

              if (node && node.nodeType) {
                el.appendChild(node)
              }
            }
          }
          var bel1 = document.createElement("header")
bel1["onclick"] = arguments[1]
var bel0 = document.createElement("span")
appendChild(bel0, ["Hello ",arguments[0]])
appendChild(bel1, [bel0])
          return bel1
        }(state.user.name,actions.login));
};

},{"yo-yo":13}],17:[function(require,module,exports){
'use strict';
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
  return (function () {
          function appendChild (el, childs) {
            for (var i = 0; i < childs.length; i++) {
              var node = childs[i];
              if (Array.isArray(node)) {
                appendChild(el, node)
                continue
              }
              if (typeof node === "number" ||
                typeof node === "boolean" ||
                node instanceof Date ||
                node instanceof RegExp) {
                node = node.toString()
              }

              if (typeof node === "string") {
                if (el.lastChild && el.lastChild.nodeName === "#text") {
                  el.lastChild.nodeValue += node
                  continue
                }
                node = document.createTextNode(node)
              }

              if (node && node.nodeType) {
                el.appendChild(node)
              }
            }
          }
          var bel0 = document.createElement("ul")
bel0.setAttribute("class", "messages")
appendChild(bel0, ["\n    ",arguments[0],"\n  "])
          return bel0
        }(items.map(function (item) {
      var expandedContent = '';
      var header = (function () {
          function appendChild (el, childs) {
            for (var i = 0; i < childs.length; i++) {
              var node = childs[i];
              if (Array.isArray(node)) {
                appendChild(el, node)
                continue
              }
              if (typeof node === "number" ||
                typeof node === "boolean" ||
                node instanceof Date ||
                node instanceof RegExp) {
                node = node.toString()
              }

              if (typeof node === "string") {
                if (el.lastChild && el.lastChild.nodeName === "#text") {
                  el.lastChild.nodeValue += node
                  continue
                }
                node = document.createTextNode(node)
              }

              if (node && node.nodeType) {
                el.appendChild(node)
              }
            }
          }
          var bel2 = document.createElement("div")
var bel0 = document.createElement("span")
bel0.setAttribute("class", "from")
appendChild(bel0, [arguments[0]])
var bel1 = document.createElement("span")
bel1.setAttribute("class", "content")
appendChild(bel1, [arguments[1]])
appendChild(bel2, ["\n        ",bel0,"\n        ",bel1,"\n      "])
          return bel2
        }(parseUser(item.from),trimContent(item.content)));

      if (item.expanded) {
        expandedContent = (function () {
          function appendChild (el, childs) {
            for (var i = 0; i < childs.length; i++) {
              var node = childs[i];
              if (Array.isArray(node)) {
                appendChild(el, node)
                continue
              }
              if (typeof node === "number" ||
                typeof node === "boolean" ||
                node instanceof Date ||
                node instanceof RegExp) {
                node = node.toString()
              }

              if (typeof node === "string") {
                if (el.lastChild && el.lastChild.nodeName === "#text") {
                  el.lastChild.nodeValue += node
                  continue
                }
                node = document.createTextNode(node)
              }

              if (node && node.nodeType) {
                el.appendChild(node)
              }
            }
          }
          var bel0 = document.createElement("div")
appendChild(bel0, [arguments[0]])
          return bel0
        }(item.content));
        header = (function () {
          function appendChild (el, childs) {
            for (var i = 0; i < childs.length; i++) {
              var node = childs[i];
              if (Array.isArray(node)) {
                appendChild(el, node)
                continue
              }
              if (typeof node === "number" ||
                typeof node === "boolean" ||
                node instanceof Date ||
                node instanceof RegExp) {
                node = node.toString()
              }

              if (typeof node === "string") {
                if (el.lastChild && el.lastChild.nodeName === "#text") {
                  el.lastChild.nodeValue += node
                  continue
                }
                node = document.createTextNode(node)
              }

              if (node && node.nodeType) {
                el.appendChild(node)
              }
            }
          }
          var bel0 = document.createElement("span")
bel0.setAttribute("class", "from")
appendChild(bel0, [arguments[0]])
          return bel0
        }(parseUser(item.from)));
      }

      return (function () {
          function appendChild (el, childs) {
            for (var i = 0; i < childs.length; i++) {
              var node = childs[i];
              if (Array.isArray(node)) {
                appendChild(el, node)
                continue
              }
              if (typeof node === "number" ||
                typeof node === "boolean" ||
                node instanceof Date ||
                node instanceof RegExp) {
                node = node.toString()
              }

              if (typeof node === "string") {
                if (el.lastChild && el.lastChild.nodeName === "#text") {
                  el.lastChild.nodeValue += node
                  continue
                }
                node = document.createTextNode(node)
              }

              if (node && node.nodeType) {
                el.appendChild(node)
              }
            }
          }
          var bel0 = document.createElement("li")
bel0["onclick"] = arguments[0]
bel0.setAttribute("class", "message " + arguments[1])
appendChild(bel0, ["\n        ",arguments[2],"\n        ",arguments[3],"\n      "])
          return bel0
        }(actions.toggleMessage(item.id),item.status,header,expandedContent));
    })));
}

module.exports = function inbox(state, actions) {
  var statusHeader = (function () {
          function appendChild (el, childs) {
            for (var i = 0; i < childs.length; i++) {
              var node = childs[i];
              if (Array.isArray(node)) {
                appendChild(el, node)
                continue
              }
              if (typeof node === "number" ||
                typeof node === "boolean" ||
                node instanceof Date ||
                node instanceof RegExp) {
                node = node.toString()
              }

              if (typeof node === "string") {
                if (el.lastChild && el.lastChild.nodeName === "#text") {
                  el.lastChild.nodeValue += node
                  continue
                }
                node = document.createTextNode(node)
              }

              if (node && node.nodeType) {
                el.appendChild(node)
              }
            }
          }
          var bel0 = document.createElement("div")
appendChild(bel0, [arguments[0]," unread messages"])
          return bel0
        }(state.unread));
  if (state.unread === 0) statusHeader = (function () {
          function appendChild (el, childs) {
            for (var i = 0; i < childs.length; i++) {
              var node = childs[i];
              if (Array.isArray(node)) {
                appendChild(el, node)
                continue
              }
              if (typeof node === "number" ||
                typeof node === "boolean" ||
                node instanceof Date ||
                node instanceof RegExp) {
                node = node.toString()
              }

              if (typeof node === "string") {
                if (el.lastChild && el.lastChild.nodeName === "#text") {
                  el.lastChild.nodeValue += node
                  continue
                }
                node = document.createTextNode(node)
              }

              if (node && node.nodeType) {
                el.appendChild(node)
              }
            }
          }
          var bel0 = document.createElement("div")
appendChild(bel0, ["no unread messages"])
          return bel0
        }());
  return (function () {
          function appendChild (el, childs) {
            for (var i = 0; i < childs.length; i++) {
              var node = childs[i];
              if (Array.isArray(node)) {
                appendChild(el, node)
                continue
              }
              if (typeof node === "number" ||
                typeof node === "boolean" ||
                node instanceof Date ||
                node instanceof RegExp) {
                node = node.toString()
              }

              if (typeof node === "string") {
                if (el.lastChild && el.lastChild.nodeName === "#text") {
                  el.lastChild.nodeValue += node
                  continue
                }
                node = document.createTextNode(node)
              }

              if (node && node.nodeType) {
                el.appendChild(node)
              }
            }
          }
          var bel1 = document.createElement("div")
bel1.setAttribute("class", "inbox")
var bel0 = document.createElement("div")
appendChild(bel0, [arguments[0]])
appendChild(bel1, ["\n    ",arguments[1],"\n    ",bel0,"\n  "])
          return bel1
        }(messageList(state.messages, actions),statusHeader));
};

},{"yo-yo":13}],18:[function(require,module,exports){
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

},{"./app":15,"global/document":2,"global/window":3,"normalize-css":9,"yo-yo":13}],19:[function(require,module,exports){
'use strict';

// send message to me
const yo = require('yo-yo');

module.exports = function message(state, actions) {
  return (function () {
          function appendChild (el, childs) {
            for (var i = 0; i < childs.length; i++) {
              var node = childs[i];
              if (Array.isArray(node)) {
                appendChild(el, node)
                continue
              }
              if (typeof node === "number" ||
                typeof node === "boolean" ||
                node instanceof Date ||
                node instanceof RegExp) {
                node = node.toString()
              }

              if (typeof node === "string") {
                if (el.lastChild && el.lastChild.nodeName === "#text") {
                  el.lastChild.nodeValue += node
                  continue
                }
                node = document.createTextNode(node)
              }

              if (node && node.nodeType) {
                el.appendChild(node)
              }
            }
          }
          var bel5 = document.createElement("div")
bel5.setAttribute("class", "message")
var bel0 = document.createElement("h2")
appendChild(bel0, ["Send me a message"])
var bel2 = document.createElement("div")
var bel1 = document.createElement("textarea")
appendChild(bel2, ["\n      ",bel1,"\n    "])
var bel4 = document.createElement("div")
var bel3 = document.createElement("button")
bel3["onclick"] = arguments[0]
appendChild(bel3, ["Send"])
appendChild(bel4, ["\n      ",bel3,"\n    "])
appendChild(bel5, ["\n    ",bel0,"\n    ",bel2,"\n    ",bel4,"\n  "])
          return bel5
        }(actions.sendMessage));
};

},{"yo-yo":13}],20:[function(require,module,exports){
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
  return (function () {
          function appendChild (el, childs) {
            for (var i = 0; i < childs.length; i++) {
              var node = childs[i];
              if (Array.isArray(node)) {
                appendChild(el, node)
                continue
              }
              if (typeof node === "number" ||
                typeof node === "boolean" ||
                node instanceof Date ||
                node instanceof RegExp) {
                node = node.toString()
              }

              if (typeof node === "string") {
                if (el.lastChild && el.lastChild.nodeName === "#text") {
                  el.lastChild.nodeValue += node
                  continue
                }
                node = document.createTextNode(node)
              }

              if (node && node.nodeType) {
                el.appendChild(node)
              }
            }
          }
          var bel1 = document.createElement("div")
bel1.setAttribute("class", "app")
var bel0 = document.createElement("div")
bel0.setAttribute("class", "content")
appendChild(bel0, ["\n      ",arguments[0],"\n    "])
appendChild(bel1, ["\n    ",bel0,"\n  "])
          return bel1
        }(content));
};

},{"./header":16,"./inbox":17,"./message":19,"yo-yo":13}],21:[function(require,module,exports){
const document = require('global/document');
const yo = require('yo-yo');

module.exports = function update(f, t) {
  if (typeof f === 'string') {
    f = document.querySelector(f);
  }

  yo.update(f, t);
};

},{"global/document":2,"yo-yo":13}]},{},[18]);
