/**
 * Credits:
 * Some code is taken from Metamorph (https://github.com/tomhuda/metamorph.js/)
 * and MooTools (http://mootools.net/)
 */

var Firestorm = {

	schema: null,
	Environment: null,
	DOM: null,
	Element: null,
	String: null,
	Array: null,
	Object: null,
	Date: null,

	KNOWN_EXCEPTIONS: null,

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

	/** @enum {number} */
	KEY_CODES: {
		ESCAPE: 27,
		LEFT_ARROW: 37,
		UP_ARROW: 38,
		RIGHT_ARROW: 39,
		DOWN_ARROW: 40
	},

	init: function() {

		if (typeof(window) != 'undefined') {

			if (!('id' in window.document)) Firestorm.throw("MooTools isn't loaded");

			this.Environment && this.Environment.init();
			this.DOM && this.DOM.init();

		}

		// You must know this yourself:
		// for (var name in {}) Firestorm.throw("Firestorm framework can not coexist with frameworks that modify native object's prototype");

	},

	getType: function(target) {

		var result = 'null';

		// note: Regexp type may be both an object and a function in different browsers
		if (target !== null) {

			result = typeof(target);
			if (result == "object" || result == "function") {
				// this.toString refers to plain object's toString
				result = this._descriptor_to_type[this.toString.call(target)] || "object";
			}

		}

		return result;

	},

	getElementById: function(id) {

		return document.id(id);

	},

	extend: function(base, partial) {

		for (var name in partial) {

			base[name] = partial[name];

		}

	},

	implement: function(base, partial) {

		for (var name in partial) {

			if (!(name in base)) {

				base[name] = partial[name];

			}

		}

	},

	selectElements: function(selector) {

		return Slick.search(window.document, selector, new Elements);

	},

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

	'throw': function(message) {

		if (typeof(message) == 'number' && this.KNOWN_EXCEPTIONS && (message in this.KNOWN_EXCEPTIONS)) {
			throw new Error(this.KNOWN_EXCEPTIONS[message]);
		}

		throw new Error(message || 'Debug assertion failed');

	},

	'true': function() {return true},
	'false': function() {return false}

};