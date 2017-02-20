/*!
 * Firestorm library
 * https://github.com/kogarashisan/Firestorm/
 *
 * Copyright Alex Galashov, MIT license
 *
 * Version: 0.2.0
 */
(function (_global) {

/*
Credits:
Some code is taken from Metamorph (https://github.com/tomhuda/metamorph.js/)
and MooTools (http://mootools.net/)
*/

/**
 * Low-level DOM manipulation and utility library
 */
var Firestorm = {

    $: null, // reference to jQuery

	/** @ignore */
	schema: null,
	/** @ignore */
	Environment: null,
	/** @ignore */
	DOM: null,
	/** @ignore */
	Event: null,
    /** @ignore */
	Element: null,
	/** @ignore */
	String: null,
	/** @ignore */
	Array: null,
	/** @ignore */
	Object: null,
	/** @ignore */
	Date: null,
	/** @ignore */
	Sorting: null,

	/**
	 * Browser capability names for {@link Firestorm.Environment#capabilities}
	 * @enum {number}
	 */
	CAPABILITY_NAMES: null,

	/**
	 * The map of numbered exception messages. May be excluded from production build
	 * @type {Object.<number, string>}
	 */
    ERROR_DESCRIPTIONS: null,

	/**
	 * Used by {@link Firestorm#getType}
	 * @type {Object.<string, string>}
	 */
	_descriptor_to_type: {
		"[object Boolean]": 'boolean',
		"[object Number]": 'number',
		"[object String]": 'string',
		"[object Function]": 'function',
		"[object Array]": 'array',
		"[object Date]": 'date',
		"[object RegExp]": 'regexp',
		"[object Object]": 'object',
		"[object Error]": 'error',
		"[object Null]": 'null',
		"[object Undefined]": 'undefined'
	},

	/**
	 * Browser key codes from keyboard events
	 * @enum {number}
	 */
	KEY_CODES: {
		ENTER: 13,
		ESCAPE: 27,
		LEFT_ARROW: 37,
		UP_ARROW: 38,
		RIGHT_ARROW: 39,
		DOWN_ARROW: 40
	},

	/**
	 * Framework must be initialized before it can be used
	 */
	init: function() {

		if (typeof(window) != 'undefined') {

			if (typeof jQuery == 'undefined') Firestorm.t("Firestorm requires jQuery to be loaded");

            this.$ = jQuery;

			this.Environment && this.Environment.init();
			this.DOM && this.DOM.init();
			this.Element && this.Element.init();

		}

		// You must know this yourself:
		// for (var name in {}) Firestorm.t("Firestorm framework can not coexist with frameworks that modify native object's prototype");

	},

	/**
	 * Get actual type of any JavaScript value
	 * @param {*} value Any value
	 * @returns {string} The type name, like "null", "object" or "regex"
	 */
	getType: function(value) {

		var result = 'null';

		// note: Regexp type may be both an object and a function in different browsers
		if (value !== null) {

			result = typeof(value);
			if (result == "object" || result == "function") {
				// this.toString refers to plain object's toString
				result = this._descriptor_to_type[this.toString.call(value)] || "object";
			}

		}

		return result;

	},

	/**
	 * Get HTML element by it's id attribute
	 * @param {string} id
	 * @returns {HTMLElement}
	 */
	getElementById: function(id) {

		return document.getElementById(id);

	},

	/**
	 * Copy all properties from `partial` to `base`
	 * @param {Object} base
	 * @param {Object} partial
	 */
	extend: function(base, partial) {

		for (var name in partial) {

			base[name] = partial[name];

		}

	},

	/**
	 * Copy all properties from `partial` to `base`, but do not overwrite existing properties
	 * @param {Object} base
	 * @param {Object} partial
	 */
	implement: function(base, partial) {

		for (var name in partial) {

			if (!(name in base)) {

				base[name] = partial[name];

			}

		}

	},

	/**
	 * Return all elements which match the given selector
	 * @param {string} selector CSS selector
	 * @returns {Array.<HTMLElement>}
	 */
	selectElements: function(selector) {

		return this.$.find(selector, window.document, []);

	},

	/**
	 * Get all elements with given tag name
	 * @param {string} tag_name
	 * @returns {NodeList}
	 */
	getElementsByTagName: function(tag_name) {

		return document.getElementsByTagName(tag_name);

	},

	/**
	 * Deep clone of given value
	 * @param {*} value
	 * @returns {*}
	 */
	clone: function(value) {

		switch (this.getType(value)) {
			case 'array':
				return this.Array.clone(value);
			case 'object':
				return this.Object.clone(value);
			default:
				return value;
		}

	},

    onDocumentReady: function (handler) {

        this.$(document).ready(handler);

    },
	/**
	 * Default comparison function
	 * @returns {boolean}
	 */
	defaultLess: function(a, b) { return a < b; },

	/**
	 * Throw an exception
	 * @param [message] Exception message
	 */
	t: function(message) {

		if (typeof(message) == 'number' && this.ERROR_DESCRIPTIONS && (message in this.ERROR_DESCRIPTIONS)) {
			throw new Error(this.ERROR_DESCRIPTIONS[message]);
		}

		throw new Error(message || 'Debug assertion failed');

	},

	/**
	 * Return <kw>true</kw>
	 * @returns {boolean} <kw>true</kw>
	 */
	'true': function() {return true},
	/**
	 * Return <kw>false</kw>
	 * @returns {boolean} <kw>false</kw>
	 */
	'false': function() {return false}

};
/**
 * Settings for the Firestorm library
 */
Firestorm.schema = {
	dom: {
		/**
		 * Allow using of Range API, if browser is capable of it
		 * @const
		 */
		PREFER_RANGE_API: false
	},
	/**
	 * Sort algorithm is called stable, if it preserves order of items that are already sorted. Suitable for ordering
	 * table data by several columns
	 * @const
	 */
	DEFAULT_STABLE_SORT_ALGORITHM: 'mergeSort',
	/**
	 * Unstable algorithms are faster, but subsequent sorts mess the previous results
	 * @const
	 */
	DEFAULT_UNSTABLE_SORT_ALGORITHM: 'mergeSort',
	/**
	 * Perform DEBUG checks. May be <kw>false</kw> in production,
	 * but it's strictly recommended to keep it <kw>true</kw> during development and testing
	 * @define
	 */
	DEBUG: true
};

// you may remove this file from release build
Firestorm.ERROR_DESCRIPTIONS = {
	'1': "Firestorm: framework requires initialization"
};
/**
 * @enum {number}
 */
Firestorm.CAPABILITY_NAMES = {

	// all, even old browsers, must be able to convert a function back to sources
	//SUPPORTS_FUNCTION_SERIALIZATION = /xyz/.test(function(){xyz;});

	/**
	 * Supports HTML Range API
	 */
	SUPPORTS_RANGE: 0,
	/**
	 * Internet Explorer < 9 strips SCRIPT and STYLE tags from beginning of innerHTML
	 */
	STRIPS_INNER_HTML_SCRIPT_AND_STYLE_TAGS: 1,
	/**
	 * IE 8 (and likely earlier) likes to move whitespace preceding a script tag to appear after it.
	 * This means that we can accidentally remove whitespace when updating a morph
	 */
	MOVES_WHITESPACE_BEFORE_SCRIPT: 2,
	/**
	 * IE8 and IE9 have bugs in "input" event, see
	 * http://benalpert.com/2013/06/18/a-near-perfect-oninput-shim-for-ie-8-and-9.html
	 */
	NEEDS_INPUT_EVENT_SHIM: 3
};

/**
 * Checks for browser bugs and capabilities, provides common interfaces for browser-specific extensions
 */
Firestorm.Environment = {
	/**
	 * opera|ie|firefox|chrome|safari|unknown
	 * @readonly
	 * @type {string}
	 */
	browser_name: null,
	/**
	 * Browser version number
	 * @readonly
	 * @type {string}
	 */
	browser_version: null,
	/**
	 * ios|windows|other|?
	 * @readonly
	 * @type {number}
	 */
	platform: null,

	/**
	 * Environment capabilities. Names of each index are stored in {@link Firestorm#CAPABILITY_NAMES}
	 * @type {Array.<boolean>}
	 */
	capabilities: [],

	/**
	 * Test for each capability from {@link Firestorm#CAPABILITY_NAMES}, used by {@link Firestorm.Environment}.
	 * You do not need to call these methods directly
	 * @type {Array.<function>}
	 */
	tests: [
		function(document) {
			// last check is for IE9 which only partially supports ranges
			return ('createRange' in document) && (typeof Range !== 'undefined') && Range.prototype.createContextualFragment;
		},
		function(document, div) {
			div.innerHTML = "<div></div>";
			div.firstChild.innerHTML = "<script></script>";
			return div.firstChild.innerHTML === '';
		},
		function(document, div) {
			div.innerHTML = "Test: <script type='text/x-placeholder'></script>Value";
			return div.childNodes[0].nodeValue === 'Test:' && div.childNodes[2].nodeValue === ' Value';
		},
		function(document) {
			return ("documentMode" in document) && document.documentMode < 10;
		}
	],

	/**
	 * Calls requestAnimationFrame, if browser supports it. Actual method name may have a vendor prefix in different browsers.
	 * If browser does not support requestAnimationFrame - this method will be <kw>null</kw>
	 * @param {function} callback
	 */
	requestAnimationFrame: function(callback) { Firestorm.t(1); },

	/**
	 * Perform the object initialization
	 */
	init: function() {

		var document = window.document,
			div = document.createElement('div'),
			requestAnimationFrame,
			tests = this.tests,
			i = 0,
			count = tests.length,
            Browser = this._getBrowserObject();

		this.browser_name = Browser.name;
		this.browser_version = Browser.version;
		this.platform = Browser.platform;

		requestAnimationFrame =
			window.requestAnimationFrame
			|| window.mozRequestAnimationFrame
			|| window.webkitRequestAnimationFrame
			|| window.msRequestAnimationFrame;

		this.requestAnimationFrame = requestAnimationFrame ? function(fn) { requestAnimationFrame.call(window, fn); } : null;

		for (; i < count; i++) {

			this.capabilities[i] = tests[i](document, div);

		}

	},

    /**
     * Taken from MooTools
     * @returns {{extend, name, version, platform}}
     */
    _getBrowserObject: function () {

        var document = window.document;

        var parse = function(ua, platform){
            ua = ua.toLowerCase();
            platform = (platform ? platform.toLowerCase() : '');

            // chrome is included in the edge UA, so need to check for edge first,
            // before checking if it's chrome.
            var UA = ua.match(/(edge)[\s\/:]([\w\d\.]+)/);
            if (!UA){
                UA = ua.match(/(opera|ie|firefox|chrome|trident|crios|version)[\s\/:]([\w\d\.]+)?.*?(safari|(?:rv[\s\/:]|version[\s\/:])([\w\d\.]+)|$)/) || [null, 'unknown', 0];
            }

            if (UA[1] == 'trident'){
                UA[1] = 'ie';
                if (UA[4]) UA[2] = UA[4];
            } else if (UA[1] == 'crios'){
                UA[1] = 'chrome';
            }

            platform = ua.match(/ip(?:ad|od|hone)/) ? 'ios' : (ua.match(/(?:webos|android)/) || ua.match(/mac|win|linux/) || ['other'])[0];
            if (platform == 'win') platform = 'windows';

            return {
                extend: Function.prototype.extend,
                name: (UA[1] == 'version') ? UA[3] : UA[1],
                version: parseFloat((UA[1] == 'opera' && UA[4]) ? UA[4] : UA[2]),
                platform: platform
            };
        };

        var Browser = parse(navigator.userAgent, navigator.platform);

        if (Browser.name == 'ie' && document.documentMode){
            Browser.version = document.documentMode;
        }

        return Browser;

    }

};

/**
 * Thanks MooTools authors for this (rewritten) piece of code.
 */
Firestorm.Event = function (event, jquery_event) {

    //if (!win) win = window;
    //event = event || win.event;

    this.event = event;
    this.jquery_event = jquery_event;

    this.shift = event.shiftKey;
    this.control = event.ctrlKey;
    this.alt = event.altKey;
    this.meta = event.metaKey;
    var type = event.type;
    this.type = type;

    var target = event.target || event.srcElement;
    while (target && target.nodeType == 3) target = target.parentNode;
    this.target = target;

    var normalizer = this._normalizers[type];
    if (!normalizer) {
        if (type.indexOf('key') == 0) {
            normalizer = 'Keyboard';
        } else if (type.indexOf('mouse') == 0) {
            normalizer = 'Mouse';
        } else if (type.indexOf('touch') == 0 || type.indexOf('gesture') == 0) {
            normalizer = 'Touch';
        }
    }

    normalizer && this['_normalize' + normalizer](event, type);

};

Firestorm.extend(Firestorm.Event.prototype, {

    _normalizers: {
        'click': "Mouse",
        'dblclick': "Mouse",
        'contextmenu': "Mouse",
        'wheel': "Mouse",
        'DOMMouseScroll': "Mouse"
    },

    _keys: {
        '38': 'up',
        '40': 'down',
        '37': 'left',
        '39': 'right',
        '27': 'esc',
        '32': 'space',
        '8': 'backspace',
        '9': 'tab',
        '46': 'delete',
        '13': 'enter'
    },

    stopPropagation: function(){

        if (this.event.stopPropagation) {
            this.event.stopPropagation();
        } else {
            this.event.cancelBubble = true;
        }

    },

    preventDefault: function(){

        if (this.event.preventDefault) {
            this.event.preventDefault();
        } else {
            this.event.returnValue = false;
        }

    },

    _normalizeKeyboard: function (event, type) {

        var code = this.code = (event.which || event.keyCode);
        if (!this.shift || type != 'keypress') {
            this.key = this._keys[code];
        }
        if (type == 'keydown' || type == 'keyup') {
            if (code > 111 && code < 124) {
                this.key = 'f' + (code - 111);
            } else if (code > 95 && code < 106) {
                this.key = code - 96;
            }
        }
        if (this.key == null) {
            this.key = String.fromCharCode(code).toLowerCase();
        }

    },

    _normalizeMouse: function(event, type) {

        var doc = window.document;
        doc = (!doc.compatMode || doc.compatMode == 'CSS1Compat') ? doc.html : doc.body;
        this.page = {
            x: (event.pageX != null) ? event.pageX : event.clientX + doc.scrollLeft,
            y: (event.pageY != null) ? event.pageY : event.clientY + doc.scrollTop
        };
        this.client = {
            x: (event.pageX != null) ? event.pageX - window.pageXOffset : event.clientX,
            y: (event.pageY != null) ? event.pageY - window.pageYOffset : event.clientY
        };
        if (type == 'DOMMouseScroll' || type == 'wheel' || type == 'mousewheel') {
            this.wheel = this._normalizeWheelSpeed(event);
        }
        this.rightClick = (event.which == 3 || event.button == 2);
        if (type == 'mouseover' || type == 'mouseout' || type == 'mouseenter' || type == 'mouseleave') {
            var overTarget = type == 'mouseover' || type == 'mouseenter';
            var related = event.relatedTarget || event[(overTarget ? 'from' : 'to') + 'Element'];
            while (related && related.nodeType == 3) {
                related = related.parentNode;
            }
            this.relatedTarget = related;
        }

    },

    _normalizeTouch: function (event, type) {

        this.rotation = event.rotation;
        this.scale = event.scale;
        this.targetTouches = event.targetTouches;
        this.changedTouches = event.changedTouches;
        var touches = this.touches = event.touches;
        if (touches && touches[0]){
            var touch = touches[0];
            this.page = {
                x: touch.pageX,
                y: touch.pageY
            };
            this.client = {
                x: touch.clientX,
                y: touch.clientY
            };
        }

    },

    _normalizeWheelSpeed: function(event) {

        var normalized;
        if (event.wheelDelta){
            normalized = event.wheelDelta % 120 == 0 ? event.wheelDelta / 120 : event.wheelDelta / 12;
        } else {
            var rawAmount = event.deltaY || event.detail || 0;
            normalized = -(rawAmount % 3 == 0 ? rawAmount / 3 : rawAmount * 10);
        }
        return normalized;

    }

});
/**
 * Methods for working with DOM elements
 */
Firestorm.Element = {

	/**
	 * Init Firestorm.Element methods
	 */
	init: function() {

		this._initStyles && this._initStyles();
        this._initProperties && this._initProperties();

	},

	/**
	 * Remove an element from DOM and clean all framework dependencies on that element.
	 * Destroyed elements cannot be reused
	 * @param {HTMLElement} element
	 */
	destroy: function(element) {

		Firestorm.$(element).remove();

	},

	/**
	 * Remove the element from DOM tree. After removal it may be inserted back
	 * @param {HTMLElement} element
	 */
	remove: function(element) {

		if (element.parentNode) {

			element.parentNode.removeChild(element);

		}

	},

	/**
	 * Perform search by id for {@link Firestorm.Element#findChildById}
	 * @param {HTMLElement} element
	 * @param {string} id
	 * @returns {HTMLElement}
	 */
	_findChildById: function(element, id) {

		var count,
			i,
			node,
			result = null;

		for (i = 0, count = element.childNodes.length; i < count; i++) {

			node = element.childNodes[i];
			if (node.nodeType == 1) {

				if (node.getAttribute('id') === id) {

					result = node;
					break;

				} else {

					result = this.findChildById(node, id);
					if (result) {
						break;
					}

				}

			}

		}

		return result;

	},

	/**
	 * Traverse element's children and find a child with given `id`
	 * @param {HTMLElement} element
	 * @param {string} id
	 * @returns {HTMLElement}
	 */
	findChildById: function(element, id) {

		return (element.getAttribute('id') === id) ? element : this._findChildById(element, id);

	},

	/**
	 * Insert an element relatively to `parent` element
	 * @param {HTMLElement} parent
	 * @param {HTMLElement} element
	 * @param {_eInsertPosition} where
	 */
	insertElement: function(parent, element, where) {

		this['insertElement' + where](parent, element);

	},

	/**
	 * Insert an element inside `parent`, at the top of it
	 * @param {HTMLElement} parent
	 * @param {HTMLElement} element
	 */
	insertElementTop: function(parent, element) {

		parent.insertBefore(element, parent.firstChild);

	},

	/**
	 * Insert an element inside `parent`, at the bottom of it
	 * @param {HTMLElement} parent
	 * @param {HTMLElement} element
	 */
	insertElementBottom: function(parent, element) {

		parent.appendChild(element);

	},

	/**
	 * Insert `target_element` just before `context`
	 * @param {HTMLElement} context
	 * @param {HTMLElement} target_element Element that is being inserted
	 */
	insertElementBefore: function(context, target_element) {

		context.parentNode.insertBefore(target_element, context);

	},

	/**
	 * Insert `target_element` after `context`
	 * @param {HTMLElement} context
	 * @param {HTMLElement} target_element Element that is being inserted
	 */
	insertElementAfter: function(context, target_element) {

		context.parentNode.insertBefore(target_element, context.nextSibling);

	},

	/**
	 * Get elements, that are contained in `element` and match the given `selector`
	 * @param {HTMLElement} element Root element
	 * @param {string} selector CSS selector
	 * @returns {Array.<HTMLElement>}
	 */
	selectElements: function(element, selector) {

		return Firestorm.$.find(selector, element, []);

	}

};

Firestorm.extend(
Firestorm.Element,
/**
 * @lends Firestorm.Element
 */
{

    _initProperties: function () {

        var root = document.documentElement;
        this.hasAttribute = (root && this._isNativeCode(root.hasAttribute))
            ? this.hasAttribute_A
            : this.hasAttribute_B;

    },

    _isNativeCode: function(f){

        return (/\{\s*\[native code\]\s*\}/).test('' + f);

    },

	/**
	 * Set a property on an element
	 * @param {HTMLElement} element Target element
	 * @param {string} name Property name
	 * @param {*} value Property value
	 */
	setProperty: function(element, name, value) {

        Firestorm.$(element).prop(name, value);

	},

    /**
     * Set inner HTML content of the element
     * @param {HTMLElement} element Target element
     * @param {*} value Property value
     */
    setHtml: function(element, value) {

        Firestorm.$(element).html(value);

    },

	/**
	 * Get element's property
	 * @param {HTMLElement} element
	 * @param {string} name
	 * @returns {*}
	 */
	getProperty: function(element, name) {

		return Firestorm.$(element).prop(name);

	},

	/**
	 * Does an element have an attribute
	 * @param {HTMLElement} element
	 * @param {string} name Attribute name
	 * @returns {boolean} True, if attribute exists
	 */
	hasAttribute: function(element, name) {

		Firestorm.t("Framework requires initialization");

	},

    /**
     * A version of hasAttribute()
     * @param {HTMLElement} element
     * @param {string} name
     * @returns {boolean}
     */
    hasAttribute_A: function(element, name) {

        return element.hasAttribute(name);

    },

    /**
     * A version of hasAttribute()
     * @param {HTMLElement} element
     * @param {string} name
     * @returns {boolean}
     */
    hasAttribute_B: function(element, name) {

        element = element.getAttributeNode(name);
        return !!(element && (element.specified || element.nodeValue));

    },

	/**
	 * Get attribute value from the element
	 * @param {HTMLElement} element
	 * @param {string} name Attribute name
	 * @returns {string} The attribute value
	 */
	getAttribute: function(element, name) {

		return Firestorm.$(element).attr(name);

	},

    /**
     * Sets attribute on element
     * @param {HTMLElement} element
     * @param {string} name Attribute name
     * @param {string} value attribute value
     */
    setAttribute: function(element, name, value) {

        return Firestorm.$(element).attr(name, value);

    },

    /**
     * Remove an attribute from the element
     * @param {HTMLElement} element
     * @param {string} name Attribute name
     */
    removeAttribute: function(element, name) {

        Firestorm.$(element).removeAttr(name);

    },

	/**
	 * Get element's tag name
	 * @param {HTMLElement} element
	 * @returns {string}
	 */
	getTagName: function(element) {

		return element.nodeName.toLowerCase();

	},

	/**
	 * Get element's `outerHTML`
	 * @param {HTMLElement} element
	 * @returns {string}
	 */
	getOuterHTML: function(element) {

		return element.outerHTML;

	}

});

Firestorm.extend(
Firestorm.Element,
/**
 * @lends Firestorm.Element
 */
{

	/**
	 * Get element's dimensions
	 * @param element
	 * @returns {{x: number, y: number}} An object with element's dimensions
	 */
	getSize: function(element) {

		if (Firestorm.schema.DEBUG && (['body', 'html'].indexOf(element.nodeName.toLowerCase()) != -1))
			Firestorm.t('This method requires an element inside the body tag.');

		return {x: element.offsetWidth, y: element.offsetHeight};

	}

});

Firestorm.extend(
Firestorm.Element,
/**
 * @lends Firestorm.Element
 */
{

    _initStyles: function () {

        if (!!document.createElement('div').classList) {

            this.hasClass = this.hasClass_ClassList;
            this.addClass = this.addClass_ClassList;
            this.removeClass = this.removeClass_ClassList;

        } else {

            this.hasClass = this.hasClass_Old;
            this.addClass = this.addClass_Old;
            this.removeClass = this.removeClass_Old;

        }

    },

	/**
	 * Set one CSS property in element's "style" attribute
	 * @param {HTMLElement} element
	 * @param {string} name
	 * @param {string} value
	 */
	setStyle: function(element, name, value) {

        Firestorm.$(element).css(name, value);

	},

	/**
	 * Set CSS property, which accepts a list of pixel values (like <str>"border: 1px 2px 3px 4px"</str>)
	 * Rounds numbers and adds 'px' before setting them to element
	 *
	 * @param {HTMLElement} element
	 * @param {string} name
	 * @param {(Array.<(number)>)} value
	 */
	setPixels: function(element, name, value) {

		var style = '';

		for (var i = 0, count = value.length; i < count; i++) {

			if (Firestorm.schema.DEBUG && typeof value[i] != "number") Firestorm.t("Invalid argument passed to setPixels");
			style += Math.round(value[i]) + 'px ';

		}

		this.setStyle(element, name, style);

	},

	/**
	 * Get value of CSS style property
	 * @param {HTMLElement} element
	 * @param {string} name Name of the property, like <str>"height"</str>
	 * @returns {*}
	 */
	getStyle: function(element, name) {

		return Firestorm.$(element).css(name);

	},

	/**
	 * Set element's opacity
	 * @param {HTMLElement} element
	 * @param {(string|number)} value 0 <= value <= 1
	 */
	setOpacity: function(element, value) {

        Firestorm.$(element).css('opacity', value);

	},

	/**
	 * Get element's opacity
	 * @param {HTMLElement} element
	 * @returns {*}
	 */
	getOpacity: function(element) {

		return Firestorm.$(element).css('opacity');

	},

    /**
     * Set "class" property on `element`
     * @param {HTMLElement} element
     * @param {string} value
     */
    setClass: function(element, value) {

        ('className' in element) ? element.className = (value || '') : element.setAttribute('class', value);

    },

    /**
     * Get "class" property from `element`
     * @param {HTMLElement} element
     */
    getClass: function(element) {

        return ('className' in element) ? element.className || null : element.getAttribute('class');

    },

    /**
     * Check if element has `class_name`
     * @param {HTMLElement} element
     * @param {string} class_name
     */
    hasClass: function(element, class_name) {

        Firestorm.t(1);

    },

    /**
     * `hasClass` variant for old browsers
     * @param {HTMLElement} element
     * @param {string} class_name
     */
    hasClass_Old: function(element, class_name){

        return Firestorm.String.toClassList(element.className || '').contains(class_name);

    },

    /**
     * `hasClass` variant for modern browsers
     * @param {HTMLElement} element
     * @param {string} class_name
     */
    hasClass_ClassList: function(element, class_name){

        return element.classList.contains(class_name);

    },

    /**
     * Add a <b>single</b> class to element
     * @param {HTMLElement} element
     * @param {string} class_name
     */
    addClass: function(element, class_name) {

        Firestorm.t(1);

    },

    /**
     * `addClass` variant for old browsers
     * @param {HTMLElement} element
     * @param {string} class_name
     */
    addClass_Old: function(element, class_name){

        element.className = Firestorm.String.toClassList(class_name + ' ' + element.className).join(' ');

    },

    /**
     * `addClass` variant for modern browsers
     * @param {HTMLElement} element
     * @param {string} class_name
     */
    addClass_ClassList: function(element, class_name){

        element.classList.add(class_name);

    },

    /**
     * Remove a <b>single</b> class from element
     * @param {HTMLElement} element
     * @param {string} class_name
     */
    removeClass: function(element, class_name) {

        Firestorm.t(1);

    },

    /**
     * `removeClass` variant for old browsers
     * @param {HTMLElement} element
     * @param {string} class_name
     */
    removeClass_Old: function(element, class_name){

        var class_names = Firestorm.String.toClassList(element.className || '');
        Firestorm.Array.exclude(class_names, class_name);
        element.className = class_names.join(' ');

    },

    /**
     * `removeClass` variant for modern browsers
     * @param {HTMLElement} element
     * @param {string} class_name
     */
    removeClass_ClassList: function(element, class_name){

        element.classList.remove(class_name);

    },

	/**
	 * Add a list of classes to element
	 * @param {HTMLElement} element
	 * @param {Array.<string>} class_list
	 */
	addClasses: function(element, class_list) {

		if (Firestorm.schema.DEBUG && typeof(class_list) == 'string') Firestorm.t();

		for (var i = 0, count = class_list.length; i < count; i++) {

			this.addClass(element, class_list[i]);

		}

	},

	/**
	 * Remove a list of classes from an element
	 * @param {HTMLElement} element
	 * @param {Array.<string>} class_list
	 */
	removeClasses: function(element, class_list) {

		if (Firestorm.schema.DEBUG && typeof(class_list) == 'string') Firestorm.t();

		for (var i = 0, count = class_list.length; i < count; i++) {

			this.removeClass(element, class_list[i]);

		}

	}

});
Firestorm.extend(
Firestorm.Element,
/**
 * @lends Firestorm.Element
 */
{

    _storeHandler: function (wrapped_element, key, handler, callback) {

        var event_data = wrapped_element.data(key);
        if (!event_data) {
            event_data = {
                handlers: [],
                callbacks: []
            };
            wrapped_element.data(key, event_data);
        }
        event_data.handlers.push(handler);
        event_data.callbacks.push(callback);

    },

    _removeCallback: function (wrapped_element, key, callback) {

        var event_data = wrapped_element.data(key),
            real_handler;

        if (event_data) {
            var callback_index = event_data.callbacks.indexOf(callback);
            if (callback_index != -1) {
                real_handler = event_data.handlers[callback_index];
                event_data.callbacks.splice(callback_index, 1);
                event_data.handlers.splice(callback_index, 1);
            }
        }

        return real_handler;

    },

    /**
     * Attach DOM listener to an element
     * @param {HTMLElement} element The DOM element for attaching the event
     * @param {string} event_name Name of DOM event
     * @param {function} callback Callback for the listener
     */
    addListener: function(element, event_name, callback) {

        var real_handler = function (event_object) {
            if (event_object.originalEvent) {
                callback(new Firestorm.Event(event_object.originalEvent, event_object));
            }
        };
        Firestorm.$(element).on(event_name, real_handler);

        this._storeHandler(Firestorm.$(element), 'FE_' + event_name, real_handler, callback);

    },

    /**
     * Detach DOM listener
     * @param {HTMLElement} element
     * @param {string} event_name
     * @param {function} callback
     */
    removeListener: function(element, event_name, callback) {

        var real_handler = this._removeCallback(Firestorm.$(element), 'FE_' + event_name, callback);
        real_handler && Firestorm.$(element).off(event_name, real_handler);

    },

    /**
     * Route events from elements inside `element` that match the `selector`
     * @param {HTMLElement} element
     * @param {string} event_name
     * @param {string} selector CSS selector
     * @param {function} callback
     */
    addDelegation: function(element, event_name, selector, callback) {

        var real_handler = function (event_object) {
            callback(new Firestorm.Event(event_object.originalEvent, event_object));
        };
        Firestorm.$(element).on(event_name, selector, callback);
        this._storeHandler(Firestorm.$(element), 'FE_D_' + event_name + '|' + selector, real_handler, callback);

    },

    /**
     * Stop delegating events
     * @param {HTMLElement} element
     * @param {string} event_name
     * @param {string} selector CSS selector
     * @param {function} callback
     */
    removeDelegation: function(element, event_name, selector, callback) {

        var real_handler = this._removeCallback(Firestorm.$(element), 'FE_D_' + event_name + '|' + selector, callback);
        real_handler && Firestorm.$(element).off(event_name, selector, real_handler);

    }

});
/**
 * DOM manipulation methods
 */
Firestorm.DOM = {

	/**
	 * When turning HTML into nodes - it must be inserted into appropriate tags to stay valid
	 */
	_wrap_map: {
		select: [1, "<select multiple='multiple'>", "</select>"],
		fieldset: [1, "<fieldset>", "</fieldset>"],
		table: [1, "<table>", "</table>"],
		tbody: [2, "<table><tbody>", "</tbody></table>"],
		thead: [2, "<table><tbody>", "</tbody></table>"],
		tfoot: [2, "<table><tbody>", "</tbody></table>"],
		tr: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
		colgroup: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
		map: [1, "<map>", "</map>"]
	},

	/**
	 * Workaround for browser bugs in IE. Equals to value of `STRIPS_INNER_HTML_SCRIPT_AND_STYLE_TAGS` capability
	 */
	_needs_shy: false,
	/**
	 * Workaround for browser bugs in IE. Equals to value of `MOVES_WHITESPACE_BEFORE_SCRIPT` capability
	 */
	_moves_whitespace: false,

	/**
	 * Init the object: choose appropriate methods for DOM manipulation, depending on browser capabilities
	 */
	init: function() {

		var e = Firestorm.Environment;

		this._needs_shy = e.capabilities[Firestorm.CAPABILITY_NAMES.STRIPS_INNER_HTML_SCRIPT_AND_STYLE_TAGS];
		this._moves_whitespace = e.capabilities[Firestorm.CAPABILITY_NAMES.MOVES_WHITESPACE_BEFORE_SCRIPT];

		if (Firestorm.schema.dom.PREFER_RANGE_API && e.capabilities[Firestorm.CAPABILITY_NAMES.SUPPORTS_RANGE]) {

			this.insertHTMLBefore = this.insertHTMLBefore_Range;
			this.insertHTMLAfter = this.insertHTMLAfter_Range;
			this.insertHTMLTop = this.insertHTMLTop_Range;
			this.insertHTMLBottom = this.insertHTMLBottom_Range;
			this.clearOuterRange = this.clearOuterRange_Range;
			this.clearInnerRange = this.clearInnerRange_Range;
			this.replaceInnerRange = this.replaceInnerRange_Range;
			this.moveRegionAfter = this.moveRegionAfter_Range;
			this.moveRegionBefore = this.moveRegionBefore_Range;

		} else {

			this.insertHTMLBefore = this.insertHTMLBefore_Nodes;
			this.insertHTMLAfter = this.insertHTMLAfter_Nodes;
			this.insertHTMLTop = this.insertHTMLTop_Nodes;
			this.insertHTMLBottom = this.insertHTMLBottom_Nodes;
			this.clearOuterRange = this.clearOuterRange_Nodes;
			this.clearInnerRange = this.clearInnerRange_Nodes;
			this.replaceInnerRange = this.replaceInnerRange_Nodes;
			this.moveRegionAfter = this.moveRegionAfter_Nodes;
			this.moveRegionBefore = this.moveRegionBefore_Nodes;

		}

	},

    /**
     * Clears all selected ranges on page.
     */
    clearSelections: function () {

        if (window.getSelection) {
            if (window.getSelection().empty) {
                window.getSelection().empty(); // Chrome
            } else if (window.getSelection().removeAllRanges) {
                window.getSelection().removeAllRanges(); // FF
            }
        } else if (document.selection) {
            document.selection.empty(); // IE
        }

    },

	/**
	 * Turn given HTML into DOM nodes and insert them before the given element
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLBefore: function(element, html) { Firestorm.t(1); },
	/**
	 * Turn given HTML into DOM nodes and insert them after the given element
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLAfter: function(element, html) { Firestorm.t(1); },
	/**
	 * Turn given HTML into DOM nodes and insert them inside the given element, at the top of it
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLTop: function(element, html) { Firestorm.t(1); },
	/**
	 * Turn given HTML into DOM nodes and insert them inside the given element, at the bottom
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLBottom: function(element, html) { Firestorm.t(1); },

	/**
	 * Remove all HTML nodes between the given elements and elements themselves
	 * @param {HTMLElement} start_element
	 * @param {HTMLElement} end_element
	 */
	clearOuterRange: function(start_element, end_element) { Firestorm.t(1); },
	/**
	 * Remove all HTML nodes between the given elements
	 * @param {HTMLElement} start_element
	 * @param {HTMLElement} end_element
	 */
	clearInnerRange: function(start_element, end_element) { Firestorm.t(1); },
	/**
	 * Remove all HTML nodes between the elements and insert the given html there
	 * @param {HTMLElement} start_element
	 * @param {HTMLElement} end_element
	 * @param {string} html
	 */
	replaceInnerRange: function(start_element, end_element, html) { Firestorm.t(1); },
	/**
	 * Move `region_start_element`, `region_end_element` and all elements between them before `target`
	 * @param {HTMLElement} target
	 * @param {HTMLElement} region_start_element
	 * @param {HTMLElement} region_end_element
	 */
	moveRegionBefore: function(target, region_start_element, region_end_element) { Firestorm.t(1); },
	/**
	 * Move `region_start_element`, `region_end_element` and all elements between them after `target`
	 * @param {HTMLElement} target
	 * @param {HTMLElement} region_start_element
	 * @param {HTMLElement} region_end_element
	 */
	moveRegionAfter: function(target, region_start_element, region_end_element) { Firestorm.t(1); },

	/**
	 * Turn HTML into nodes and insert them relatively to the given element
	 * @param {HTMLElement} element
	 * @param {string} html
	 * @param {_eInsertPosition} [position='Bottom']
	 */
	insertHTML: function(element, html, position) {

		this['insertHTML' + (position || 'Bottom')](element, html);

	},

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// nodes api

	/**
	 * Set the element's innerHTML, taking into account various browser bugs
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	_setInnerHTML: function(element, html) {

		var matches,
			count,
			i,
			script;

		if (this._moves_whitespace) {
			matches = [];
			// Right now we only check for script tags with ids with the goal of targeting morphs.
			// Remove space before script to insert it later.
			html = html.replace(/(\s+)(<script id='([^']+)')/g, function(match, spaces, tag, id) {
				matches.push([id, spaces]);
				return tag;
			});

		}

		element.innerHTML = html;

		// If we have to do any whitespace adjustments, do them now
		if (matches && matches.length > 0) {

			count = matches.length;
			for (i = 0; i < count; i++) {
				script = Firestorm.Element.findChildById(element, matches[i][0]);
				script.parentNode.insertBefore(document.createTextNode(matches[i][1]), script);
			}

		}

	},

	/**
	 * Given a parent node and some HTML, generate a set of nodes. Return the first
	 * node, which will allow us to traverse the rest using nextSibling.
	 *
	 * In cases of certain elements like tables and lists we cannot just assign innerHTML and get the nodes,
	 * cause innerHTML is either readonly on them in IE, or it would destroy some of the content
	 *
	 * @param {HTMLElement} parentNode
	 * @param {string} html
	 **/
	_firstNodeFor: function(parentNode, html) {

		var map = this._wrap_map[parentNode.nodeName.toLowerCase()] || [ 0, "", "" ],
			depth = map[0],
			start = map[1],
			end = map[2],
			element,
			i,
			shy_element;

		if (this._needs_shy) {
			// make the first tag an invisible text node to retain scripts and styles at the beginning
			html = '&shy;' + html;
		}

		element = document.createElement('div');

		this._setInnerHTML(element, start + html + end);

		for (i = 0; i <= depth; i++) {

			element = element.firstChild;

		}

		if (this._needs_shy) {

			// Look for &shy; to remove it.
			shy_element = element;

			// Sometimes we get nameless elements with the shy inside
			while (shy_element.nodeType === 1 && !shy_element.nodeName) {
				shy_element = shy_element.firstChild;
			}

			// At this point it's the actual unicode character.
			if (shy_element.nodeType === 3 && shy_element.nodeValue.charAt(0) === "\u00AD") {
				shy_element.nodeValue = shy_element.nodeValue.slice(1);
			}

		}

		return element;

	},

	/**
	 * Remove everything between two tags
	 * @param {HTMLElement} start_element
	 * @param {HTMLElement} end_element
	 */
	clearInnerRange_Nodes: function(start_element, end_element) {

		var parent_node = start_element.parentNode,
			node = start_element.nextSibling;

		while (node && node !== end_element) {

			parent_node.removeChild(node);
			node = start_element.nextSibling;

		}

	},

	/**
	 * Version of clearOuterRange, which manipulates HTML nodes
	 * @param {HTMLElement} start_element
	 * @param {HTMLElement} end_element
	 */
	clearOuterRange_Nodes: function(start_element, end_element) {

		this.clearInnerRange_Nodes(start_element, end_element);
		start_element.parentNode.removeChild(start_element);
		end_element.parentNode.removeChild(end_element);

	},

	/**
	 * Version of replaceInnerRange, which manipulates HTML nodes
	 * @param {HTMLElement} start_element
	 * @param {HTMLElement} end_element
	 * @param {string} html
	 */
	replaceInnerRange_Nodes: function(start_element, end_element, html) {

		this.clearInnerRange_Nodes(start_element, end_element);
		this.insertHTMLBefore_Nodes(end_element, html);

	},

	/**
	 * Turn HTML into nodes with respect to the parent node and sequentially insert them before `insert_before` element
	 * @param {HTMLElement} parent_node
	 * @param {string} html
	 * @param {HTMLElement} insert_before
	 */
	_insertHTMLBefore: function(parent_node, html, insert_before) {

		var node,
			next_sibling;

		node = this._firstNodeFor(parent_node, html);

		while (node) {
			next_sibling = node.nextSibling;
			parent_node.insertBefore(node, insert_before);
			node = next_sibling;
		}

	},

	/**
	 * Version of insertHTMLAfter which works with nodes
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLAfter_Nodes: function(element, html) {

		this._insertHTMLBefore(element.parentNode, html, element.nextSibling);

	},

	/**
	 * Version of insertHTMLBefore which works with nodes
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLBefore_Nodes: function(element, html) {

		this._insertHTMLBefore(element.parentNode, html, element);

	},

	/**
	 * Version of insertHTMLTop which works with nodes
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLTop_Nodes: function(element, html) {

		this._insertHTMLBefore(element, html, element.firstChild);

	},

	/**
	 * Version of insertHTMLBottom which works with nodes
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLBottom_Nodes: function(element, html) {

		this._insertHTMLBefore(element, html, null);

	},

	/**
	 * Perform movement of a range of nodes
	 * @param {HTMLElement} parent
	 * @param {HTMLElement} target
	 * @param {HTMLElement} node
	 * @param {HTMLElement} region_end_element
	 */
	_moveRegionBefore: function(parent, target, node, region_end_element) {

		var next_sibling;

		while (node && node !== region_end_element) {
			next_sibling = node.nextSibling;
			parent.insertBefore(node, target);
			node = next_sibling;
		}
		parent.insertBefore(region_end_element, target);

	},

	/**
	 * Version of `moveRegionBefore`, which works with DOM nodes.
	 * @param {HTMLElement} target
	 * @param {HTMLElement} region_start_element
	 * @param {HTMLElement} region_end_element
	 */
	moveRegionBefore_Nodes: function(target, region_start_element, region_end_element) {

		this._moveRegionBefore(target.parentNode, target, region_start_element, region_end_element);

	},

	/**
	 * Version of `moveRegionAfter`, which works with DOM nodes.
	 * @param {HTMLElement} target
	 * @param {HTMLElement} region_start_element
	 * @param {HTMLElement} region_end_element
	 */
	moveRegionAfter_Nodes: function(target, region_start_element, region_end_element) {

		this._moveRegionBefore(target.parentNode, target.nextSibling, region_start_element, region_end_element);

	},

	// endL nodes api
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// range api

	/**
	 * Create a Range object, with limits between the given elements
	 * @param {HTMLElement} start_element
	 * @param {HTMLElement} end_element
	 * @returns {Range|TextRange}
	 */
	_createInnerRange: function(start_element, end_element) {

		var range = document.createRange();
		range.setStartAfter(start_element);
		range.setEndBefore(end_element);
		return range;

	},

	/**
	 * Create a Range object, which includes the given elements
	 * @param {HTMLElement} start_element
	 * @param {HTMLElement} end_element
	 * @returns {Range|TextRange}
	 */
	_createOuterRange: function(start_element, end_element) {

		var range = document.createRange();
		range.setStartBefore(start_element);
		range.setEndAfter(end_element);
		return range;

	},

	/**
	 * Version of replaceInnerRange, which works with Range API
	 * @param {HTMLElement} start_element
	 * @param {HTMLElement} end_element
	 * @param {string} html
	 */
	replaceInnerRange_Range: function(start_element, end_element, html) {

		var range = this._createInnerRange(start_element, end_element);

		range.deleteContents();
		range.insertNode(range.createContextualFragment(html));
	},

	/**
	 * Version of clearOuterRange, which works with Range API
	 * @param {HTMLElement} start_element
	 * @param {HTMLElement} end_element
	 */
	clearOuterRange_Range: function(start_element, end_element) {

		var range = this._createOuterRange(start_element, end_element);
		range.deleteContents();

	},

	/**
	 * Version of clearInnerRange, which works with Range API
	 * @param {HTMLElement} start_element
	 * @param {HTMLElement} end_element
	 */
	clearInnerRange_Range: function(start_element, end_element) {

		var range = this._createInnerRange(start_element, end_element);
		range.deleteContents();

	},

	/**
	 * Version of insertHTMLAfter, which works with Range API
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLAfter_Range: function(element, html) {

		var range = document.createRange();
		range.setStartAfter(element);
		range.setEndAfter(element);

		range.insertNode(range.createContextualFragment(html));

	},

	/**
	 * Version of insertHTMLBefore, which works with Range API
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLBefore_Range: function(element, html) {

		var range = document.createRange();
		range.setStartBefore(element);
		range.setEndBefore(element);

		range.insertNode(range.createContextualFragment(html));

	},

	/**
	 * Version of insertHTMLTop, which works with Range API
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLTop_Range: function(element, html) {

		var range = document.createRange();
		range.setStart(element, 0);
		range.collapse(true);
		range.insertNode(range.createContextualFragment(html));

	},

	/**
	 * Version of insertHTMLBottom, which works with Range API
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLBottom_Range: function(element, html) {

		var last_child = element.lastChild,
			range;

		if (last_child) {

			range = document.createRange();
			range.setStartAfter(last_child);
			range.collapse(true);
			range.insertNode(range.createContextualFragment(html));

		} else {

			this.insertHTMLTop_Range(element, html);

		}

	},

	/**
	 * Version of `moveRegionBefore`, which works with ranges
	 * @param {HTMLElement} target
	 * @param {HTMLElement} region_start_element
	 * @param {HTMLElement} region_end_element
	 */
	moveRegionBefore_Range: function(target, region_start_element, region_end_element) {

		target.parentNode.insertBefore(
			this._createOuterRange(region_start_element, region_end_element).extractContents(),
			target
		);

	},

	/**
	 * Version of `moveRegionAfter`, which works with ranges
	 * @param {HTMLElement} target
	 * @param {HTMLElement} region_start_element
	 * @param {HTMLElement} region_end_element
	 */
	moveRegionAfter_Range: function(target, region_start_element, region_end_element) {

		target.parentNode.insertBefore(
			this._createOuterRange(region_start_element, region_end_element).extractContents(),
			target.nextSibling
		);

	}

	// end: range api
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

};
/**
 * Collection of methods to manipulate arrays
 */
Firestorm.Array = {

	/**
	 * Swap two elements in given array
	 * @param array
	 * @param index_a
	 * @param index_b
	 */
	swap: function(array, index_a, index_b) {
		var temp = array[index_a];
		array[index_a] = array[index_b];
		array[index_b] = temp;
	},

	/**
	 * If array does not contain the given `value` - then push the value into array
	 * @param {Array} array
	 * @param {*} value
	 * @returns {boolean} <kw>true</kw>, if array did not contain the element, <kw>false</kw> if it was already there
	 */
	include: function(array, value) {
		if (array.indexOf(value) == -1) {
			array.push(value);
			return true;
		}
		return false;
	},

	/**
	 * Include all unique values from `source_array` into `dest_array`
	 * @param {Array} dest_array
	 * @param {Array} source_array
	 */
	includeUnique: function(dest_array, source_array) {

		var i = 0,
			count = source_array.length;

		for (; i < count; i++) {
			if (dest_array.indexOf(source_array[i]) == -1) {
				dest_array.push(source_array[i]);
			}
		}

	},

	/**
	 * Remove the first occurence of `value` from `array`
	 * @param {Array} array
	 * @param {*} value
	 * @returns {boolean} <kw>true</kw>, if element was present in array
	 */
	exclude: function(array, value) {
		var index = array.indexOf(value);
		if (index == -1) return false;
		else array.splice(index, 1);
		return true;
	},

	/**
	 * Remove the first occurrence of each value from array. Does not exclude duplicate occurrences
	 * @param array
	 * @param values
	 */
	excludeAll: function(array, values) {
		var index;
		for (var i = 0, count = values.length; i < count; i++) {
			index = array.indexOf(values[i]);
			if (index != -1) {
				array.splice(index, 1);
			}
		}
	},

	/**
	 * Deep clone of array
	 * @param array
	 * @returns {Array}
	 */
	clone: function(array) {

		var count = array.length,
			i = 0,
			result = new Array(count);

		for (;i < count; i++) {

			result[i] = Firestorm.clone(array[i]);

		}

		return result;

	},

	/**
	 * Find the first occurrence `old_value` and replace it with `new_value`
	 * @param array
	 * @param old_value
	 * @param new_value
	 */
	replace: function(array, old_value, new_value) {

		var index = array.indexOf(old_value);
		if (index == -1) Firestorm.t("Array.replace: value is not in array");
		array[index] = new_value;

	}

};

/**
 * Methods and regular expressions to manipulate strings
 */
Firestorm.String = {

	// taken from json2
	/**
	 * Special characters, which must be escaped when serializing (quoting) a string
	 */
	QUOTE_ESCAPE_REGEX: /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	/**
	 * Map for escaping special characters
	 * @type {Object.<string, string>}
	 */
	quote_escape_map: {
		// without these comments JSDoc throws errors
		// https://github.com/jsdoc3/jsdoc/issues/549
		'\b': '\\b',
		/** @alias _1
		 * @ignore */
		'\t': '\\t',
		/** @alias _2
		 * @ignore */
		'\n': '\\n',
		/** @alias _3
		 * @ignore */
		'\f': '\\f',
		/** @alias _4
		 * @ignore */
		'\r': '\\r',
		'"' : '\\"',
		'\\': '\\\\'
	},

	/**
	 * HTML special entities that must be escaped in attributes and similar cases
	 * @type {Object.<string, string>}
	 */
	escape_chars: {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#x27;",
		"`": "&#x60;"
	},

	/**
	 * Reverse map of HTML entities to perform unescaping
	 */
	unescape_chars: {
		"&amp;": "&",
		"&lt;": "<",
		"&gt;": ">",
		"&quot;": '"',
		"&#x27;": "'",
		"&#x60;": "`"
	},

	/**
	 * Characters which must be escaped in a string, which is part of HTML document
	 */
	HTML_ESCAPE_REGEX: /[<>\&]/g,
	/**
	 * Characters that must be escaped in HTML attributes
	 */
	ATTRIBUTE_ESCAPE_REGEX: /[&<>\"\'\`]/g,
	/**
	 * Characters that must be escaped when creating a &lt;textarea&gt; tag with initial content
	 */
	TEXTAREA_ESCAPE_REGEX: /[<>&\'\"]/g,
	/**
	 * Characters, which are escaped by the browser, when getting innerHTML of elements
	 */
	UNESCAPE_REGEX: /(&amp;|&lt;|&gt;)/g,

	/**
	 * Turn "dashed-string" into "camelCased" string
	 * @param {string} string
	 * @returns {string}
	 */
	camelCase: function(string){

		return string.replace(/-\D/g, function(match){
			return match.charAt(1).toUpperCase();
		});

	},

	/**
	 * Turn "camelCased" string into "dashed-string"
	 * @param {string} string
	 * @returns {string}
	 */
	hyphenate: function(string){

		return string.replace(/[A-Z]/g, function(match){
			return ('-' + match.charAt(0).toLowerCase());
		});

	},

	/**
	 * Uppercase the first letter of all words
	 * @param {string} string
	 * @returns {string}
	 */
	capitalize: function(string){
		return string.replace(/\b[a-z]/g, function(match){
			return match.toUpperCase();
		});
	},

	/**
	 * Escape HTML entities found by `regex` argument
	 * @param {string} string
	 * @param {RegExp} regex A regular expression object, such as {@link Firestorm.String#HTML_ESCAPE_REGEX}
	 * @returns {string}
	 */
	escape: function(string, regex) {
		var escape_chars = this.escape_chars;
		return string.replace(
			regex,
			function(chr) { return escape_chars[chr]; }
		);
	},

	/**
	 * Unescape html entities which are escaped by browser (see {@link Firestorm.String#UNESCAPE_REGEX})
	 * @param {string} string
	 * @returns {string}
	 */
	unescape: function(string) {
		var unescape_chars = this.unescape_chars;
		return string.replace(
			this.UNESCAPE_REGEX,
			function(chr) { return unescape_chars[chr] }
		);
	},

	/**
	 * Serialize a string into it's JavaScript representation. If you eval() the result - you will get the original value
	 * @param string
	 * @returns {*}
	 */
	quote: function(string) {

		var result,
			map = this.quote_escape_map;

		if (this.QUOTE_ESCAPE_REGEX.test(string)) {
			result = '"' + string.replace(this.QUOTE_ESCAPE_REGEX, function (a) {
				var c = map[a];
				return typeof c == 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
			}) + '"';
		} else {
			result = '"' + string + '"';
		}

		return result;

	},

	/**
	 * Before constructing regular expressions from user input - you must escape them
	 * @param {string} string
	 * @returns {string}
	 */
	escapeStringForRegExp: function(string) {

		return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");

	},

	/**
	 * Repeat string `count` times
	 * @param {string} string
	 * @param {number} count
	 * @returns {string}
	 */
	repeat: function(string, count) {

		var result = '';

		while (count > 1) {
			if ((count & 1)) {
				result += string;
			}
			count >>= 1;
			string += string;
		}

		return result + string;

	},

	/**
	 * Split a string into array with class names
	 * @param {string} classes_string
	 * @returns {Array.<string>}
	 */
	toClassList: function(classes_string){

		var class_names = classes_string.trim().split(/\s+/),
			uniques = {};

		return class_names.filter(function(class_name){
			if (!uniques[class_name]) {
				return uniques[class_name] = class_name;
			}
		});

	},

    startsWith: function(string, prefix) {

        return string.substr(0, prefix.length) == prefix;

    },

    endsWith: function(string, suffix) {

        return string.indexOf(suffix, string.length - suffix.length) !== -1;

    }

};

/**
 * Collection of methods to manipulate objects
 */
Firestorm.Object = {

	/**
	 * Return <kw>true</kw> for object with no properties, and <kw>false</kw> otherwise
	 * @param {Object} object_instance
	 * @returns {boolean} <kw>true</kw>, if object is empty
	 */
	isEmpty: function(object_instance) {
		// it's much faster than using Object.keys
		//noinspection LoopStatementThatDoesntLoopJS
		for (var name in object_instance) {
			return false;
		}
		return true;
	},

	/**
	 * Deep clone of given object
	 * @param {Object} object
	 * @returns {Object}
	 */
	clone: function(object) {
		var result = {},
			key;

		for (key in object) {

			result[key] = Firestorm.clone(object[key]);

		}

		return result;
	},

	/**
	 * Shallow copy of an object (not a clone)
	 * @param {Object} object
	 * @returns {Object}
	 */
	copy: function(object) {

		var result = {};
		Firestorm.extend(result, object);
		return result;

	}

};
/**
 * Methods to manipulate Dates
 */
Firestorm.Date = {

	/**
	 * Numbers of days in months for non-leap year
	 */
	DAYS_IN_MONTH: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

	/**
	 * Get number of days in month, with respect to leap years
	 * @param {number} year
	 * @param {number} month
	 * @returns {number}
	 */
	getDaysInMonth: function(year, month) {
		return (month == 1 && ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0))
			? 29 // february in leap year
			: this.DAYS_IN_MONTH[month];
	}

};

/**
 * Collection of sorting algorithms.
 *
 * Sorting algorithm is called "stable" if it maintains the relative order of records with equal keys
 * (in other words, it preserves order of already sorted items).
 *
 * Unstable algorithms may be faster than stable ones.
 */
Firestorm.Sorting = {
	/**
	 * Stable sort algorithm. Must not be called recursively
	 *
	 * @type function
	 * @param {Array} items Array of items to sort
	 * @param {_tLessCallback} less A callback, that compares two items
	 */
	mergeSort: (function(){
		"use strict";

		var _less = null;

		/**
		 * @param {Array} left
		 * @param {Number} left_count
		 * @param {Array} right
		 * @param {Number} right_count
		 * @returns {Array}
		 */
		function _merge(left, left_count, right, right_count) {

			var result = [],
				left_index = 0,
				right_index = 0;

			while (left_index < left_count && right_index < right_count) {

				if (_less(left[left_index], right[right_index])) {

					result.push(left[left_index]);
					left_index++;

				} else {

					result.push(right[right_index]);
					right_index++;

				}

			}

			if (left_index < left_count) {

				result = result.concat(left.slice(left_index));

			}

			if (right_index < right_count) {

				result = result.concat(right.slice(right_index));

			}

			return result;

		}

		/**
		 * @param {Array} items
		 * @param {Number} length
		 * @returns {Array}
		 */
		function _sort(items, length) {

			var middle,
				right;

			if (length == 2) {
				return _less(items[0], items[1]) ? items : [items[1], items[0]];
			}

			middle = Math.floor(length / 2);
			right = length - middle;

			return _merge(
				(middle < 2) ? items.slice(0, middle) : _sort(items.slice(0, middle), middle),
				middle,
				(right < 2) ? items.slice(middle) : _sort(items.slice(middle), right),
				right
			);

		}

		return function(items, less) {

			var length = items.length,
				result;

			if (length < 2) {

				result = items;

			} else {

				_less = less;
				result = _sort(items, length);

			}

			return result;

		};

	})()
};

Firestorm.init();

if (typeof module != 'undefined' && module.exports) {

	module.exports = Firestorm;

} else {

	_global.Firestorm = Firestorm;

}

}(this));