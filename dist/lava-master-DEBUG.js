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

			if (!('id' in window.document)) Firestorm.t("MooTools isn't loaded");

			this.Environment && this.Environment.init();
			this.DOM && this.DOM.init();

		}

		// You must know this yourself:
		// for (var name in {}) Firestorm.t("Firestorm framework can not coexist with frameworks that modify native object's prototype");

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

	t: function(message) {

		if (typeof(message) == 'number' && this.KNOWN_EXCEPTIONS && (message in this.KNOWN_EXCEPTIONS)) {
			throw new Error(this.KNOWN_EXCEPTIONS[message]);
		}

		throw new Error(message || 'Debug assertion failed');

	},

	'true': function() {return true},
	'false': function() {return false}

};

Firestorm.schema = {
	DOM: {
		/** @const */
		PREFER_RANGE_API: true
	},
	/** @define */
	DEBUG: true
};

// you may remove this file from release build
Firestorm.KNOWN_EXCEPTIONS = {
	'1': "Firestorm: framework requires initialization"
};


Firestorm.Environment = {

	//SUPPORTS_FUNCTION_SERIALIZATION: false,
	SUPPORTS_RANGE: false,
	STRIPS_INNER_HTML_SCRIPT_AND_STYLE_TAGS: false,
	MOVES_WHITESPACE_BEFORE_SCRIPT: false,

	init: function() {

		var document = window.document,
			testEl;

		// all, even old browsers, must be able to convert a function back to sources
		//this.SUPPORTS_FUNCTION_SERIALIZATION = /xyz/.test(function(){xyz;});

		// last check is for IE9 which only partially supports ranges
		this.SUPPORTS_RANGE = ('createRange' in document) && (typeof Range !== 'undefined') && Range.prototype.createContextualFragment;

		// Internet Explorer < 9 strips SCRIPT and STYLE tags from beginning of innerHTML
		testEl = document.createElement('div');
		testEl.innerHTML = "<div></div>";
		testEl.firstChild.innerHTML = "<script></script>";
		this.STRIPS_INNER_HTML_SCRIPT_AND_STYLE_TAGS = testEl.firstChild.innerHTML === '';

		// IE 8 (and likely earlier) likes to move whitespace preceeding
		// a script tag to appear after it. This means that we can
		// accidentally remove whitespace when updating a morph.
		testEl.innerHTML = "Test: <script type='text/x-placeholder'></script>Value";
		this.MOVES_WHITESPACE_BEFORE_SCRIPT = testEl.childNodes[0].nodeValue === 'Test:' && testEl.childNodes[2].nodeValue === ' Value';

	}

};

Firestorm.Element = {

	addListener: function(element, event_name, callback, capture) {

		document.id(element).addEvent(event_name, callback, capture);

	},

	removeListener: function(element, event_name, callback) {

		document.id(element).removeEvent(event_name, callback);

	},

	addDelegation: function(element, event_name, selector, callback) {

		document.id(element).addEvent(event_name + ':relay(' + selector + ')', callback);

	},

	removeDelegation: function(element, event_name, selector, callback) {

		document.id(element).removeEvent(event_name + ':relay(' + selector + ')', callback);

	},

	destroy: function(element) {

		document.id(element).destroy();

	},

	/**
	 * Remove the element from DOM tree. After removal it may be inserted back.
	 * @param element
	 */
	remove: function(element) {

		if (element.parentNode) {

			element.parentNode.removeChild(element);

		}

	},

	getChildren: function(element, expression) {

		return document.id(element).getChildren(expression);

	},

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

	findChildById: function(element, id) {

		return (element.getAttribute('id') === id) ? element : this._findChildById(element, id);

	},

	insertElement: function(parent, element, where) {

		this['insertElement' + where](parent, element);

	},

	insertElementTop: function(parent, element) {

		parent.insertBefore(element, parent.firstChild);

	},

	insertElementBottom: function(parent, element) {

		parent.appendChild(element);

	},

	/**
	 * Insert target_element just before context
	 * @param {Node} context
	 * @param {Node} target_element
	 */
	insertElementBefore: function(context, target_element) {

		context.parentNode.insertBefore(target_element, context);

	},

	/**
	 * Insert target_element after context
	 * @param {Node} context
	 * @param {Node} target_element
	 */
	insertElementAfter: function(context, target_element) {

		context.parentNode.insertBefore(target_element, context.nextSibling);

	}

};

Firestorm.extend(Firestorm.Element, {

	setProperty: function(element, name, value) {

		document.id(element).set(name, value);

	},

	getProperty: function(element, name) {

		return document.id(element).get(name);

	},

	removeProperty: function(element, name) {

		document.id(element).setProperty(name, null);

	},

	hasAttribute: function(element, name) {

		return Slick.hasAttribute(element, name);

	},

	getAttribute: function(element, name) {

		return Slick.getAttribute(element, name);

	}

});

Firestorm.extend(Firestorm.Element, {

	/**
	 * @param element
	 * @returns {{x: number, y: number}}
	 */
	getSize: function(element) {

		if (Firestorm.schema.DEBUG && (element.tagName == 'body' || element.tagName == 'html'))
			Firestorm.t('This method requires an element inside the body tag.');

		return {x: element.offsetWidth, y: element.offsetHeight};

	}

});

Firestorm.extend(Firestorm.Element, {

	/**
	 * @param element
	 * @param {string} name
	 * @param {string} value
	 */
	setStyle: function(element, name, value) {

		document.id(element).setStyle(name, value);

	},

	/**
	 * Rounds numbers and adds 'px' before setting them to element.
	 *
	 * @param element
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

	getStyle: function(element, name) {

		return document.id(element).getStyle(name, value);

	},

	setOpacity: function(element, value) {

		document.id(element).set('opacity', value);

	},

	getOpacity: function(element) {

		return document.id(element).get('opacity');

	},

	addClass: function(element, class_name) {

		document.id(element).addClass(class_name);

	},

	removeClass: function(element, class_name) {

		document.id(element).removeClass(class_name);

	},

	addClasses: function(element, class_list) {

		if (Firestorm.schema.DEBUG && typeof(class_list) == 'string') Firestorm.t();

		for (var i = 0, count = class_list.length; i < count; i++) {

			this.addClass(element, class_list[i]);

		}

	},

	removeClasses: function(element, class_list) {

		if (Firestorm.schema.DEBUG && typeof(class_list) == 'string') Firestorm.t();

		for (var i = 0, count = class_list.length; i < count; i++) {

			this.removeClass(element, class_list[i]);

		}

	}

});

Firestorm.DOM = {

	_wrap_map: {
		select: [ 1, "<select multiple='multiple'>", "</select>" ],
		fieldset: [ 1, "<fieldset>", "</fieldset>" ],
		table: [ 1, "<table>", "</table>" ],
		tbody: [ 2, "<table><tbody>", "</tbody></table>" ],
		thead: [ 2, "<table><tbody>", "</tbody></table>" ],
		tfoot: [ 2, "<table><tbody>", "</tbody></table>" ],
		tr: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		colgroup: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		map: [ 1, "<map>", "</map>" ]
	},

	_needs_shy: false,
	_moves_whitespace: false,

	init: function() {

		var e = Firestorm.Environment;

		this._needs_shy = e.STRIPS_INNER_HTML_SCRIPT_AND_STYLE_TAGS;
		this._moves_whitespace = e.MOVES_WHITESPACE_BEFORE_SCRIPT;

		if (Firestorm.schema.DOM.PREFER_RANGE_API && e.SUPPORTS_RANGE) {

			this.insertHTMLBefore = this.insertHTMLBefore_Range;
			this.insertHTMLAfter = this.insertHTMLAfter_Range;
			this.insertHTMLTop = this.insertHTMLTop_Range;
			this.insertHTMLBottom = this.insertHTMLBottom_Range;
			this.clearOuterRange = this.clearOuterRange_Range;
			this.clearInnerRange = this.clearInnerRange_Range;
			this.replaceInnerRange = this.replaceInnerRange_Range;

		} else {

			this.insertHTMLBefore = this.insertHTMLBefore_Nodes;
			this.insertHTMLAfter = this.insertHTMLAfter_Nodes;
			this.insertHTMLTop = this.insertHTMLTop_Nodes;
			this.insertHTMLBottom = this.insertHTMLBottom_Nodes;
			this.clearOuterRange = this.clearOuterRange_Nodes;
			this.clearInnerRange = this.clearInnerRange_Nodes;
			this.replaceInnerRange = this.replaceInnerRange_Nodes;

		}

	},

	insertHTMLBefore: function(element, html) { Firestorm.t(1); },
	insertHTMLAfter: function(element, html) { Firestorm.t(1); },
	insertHTMLTop: function(element, html) { Firestorm.t(1); },
	insertHTMLBottom: function(element, html) { Firestorm.t(1); },

	clearOuterRange: function(start_element, end_element) { Firestorm.t(1); },
	clearInnerRange: function(start_element, end_element) { Firestorm.t(1); },
	replaceInnerRange: function(start_element, end_element, html) { Firestorm.t(1); },

	insertHTML: function(element, html, position) {

		this['insertHTML' + (position || 'Bottom')](element, html);

	},

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// nodes api

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
	 * cause innerHTML is either readonly on them in IE, or it would destroy some of the content.
	 **/
	_firstNodeFor: function(parentNode, html) {

		var map = this._wrap_map[parentNode.tagName.toLowerCase()] || [ 0, "", "" ],
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
	 * @param start_element
	 * @param end_element
	 */
	clearInnerRange_Nodes: function(start_element, end_element) {

		var node = start_element.nextSibling;

		while (node) {

			if (node === end_element) {
				break;
			}

			node.parentNode.removeChild(node);
			node = start_element.nextSibling;

		}

	},

	clearOuterRange_Nodes: function(start_element, end_element) {

		this.clearInnerRange_Nodes(start_element, end_element);
		start_element.parentNode.removeChild(start_element);
		end_element.parentNode.removeChild(end_element);

	},

	replaceInnerRange_Nodes: function(start_element, end_element, html) {

		this.clearInnerRange_Nodes(start_element, end_element);
		this.insertHTMLBefore_Nodes(end_element, html);

	},

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

	insertHTMLAfter_Nodes: function(element, html) {

		this._insertHTMLBefore(element.parentNode, html, element.nextSibling);

	},

	insertHTMLBefore_Nodes: function(element, html) {

		this._insertHTMLBefore(element.parentNode, html, element);

	},

	insertHTMLTop_Nodes: function(element, html) {

		this._insertHTMLBefore(element, html, element.firstChild);

	},

	insertHTMLBottom_Nodes: function(element, html) {

		this._insertHTMLBefore(element, html, null);

	},

	// endL nodes api
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// range api

	_createInnerRange: function(start_element, end_element) {

		var range = document.createRange();
		range.setStartAfter(start_element);
		range.setEndBefore(end_element);
		return range;

	},

	_createOuterRange: function(start_element, end_element) {

		var range = document.createRange();
		range.setStartBefore(start_element);
		range.setEndAfter(end_element);
		return range;

	},

	replaceInnerRange_Range: function(start_element, end_element, html) {

		var range = this._createInnerRange(start_element, end_element);

		range.deleteContents();
		range.insertNode(range.createContextualFragment(html));
	},

	clearOuterRange_Range: function(start_element, end_element) {

		var range = this._createOuterRange(start_element, end_element);
		range.deleteContents();

	},

	clearInnerRange_Range: function(start_element, end_element) {

		var range = this._createInnerRange(start_element, end_element);
		range.deleteContents();

	},

	insertHTMLAfter_Range: function(element, html) {

		var range = document.createRange();
		range.setStartAfter(element);
		range.setEndAfter(element);

		range.insertNode(range.createContextualFragment(html));

	},

	insertHTMLBefore_Range: function(element, html) {

		var range = document.createRange();
		range.setStartBefore(element);
		range.setEndBefore(element);

		range.insertNode(range.createContextualFragment(html));

	},

	insertHTMLTop_Range: function(element, html) {

		var range = document.createRange();
		range.setStart(element, 0);
		range.collapse(true);
		range.insertNode(range.createContextualFragment(html));

	},

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

	}

	// end: range api
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

};


Firestorm.Array = {

	swap: function(array, index_a, index_b) {
		var temp = array[index_a];
		array[index_a] = array[index_b];
		array[index_b] = temp;
	},

	/**
	 * @param {Array} array
	 * @param {*} value
	 * @returns {boolean} True, if element was not in array, false if it was already there
	 */
	include: function(array, value) {
		if (array.indexOf(value) == -1) {
			array.push(value);
			return true;
		}
		return false;
	},

	/**
	 * Include all unique values from source_array into dest_array.
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
	 * @param {Array} array
	 * @param {*} value
	 * @returns {boolean} True, if element was present in array
	 */
	exclude: function(array, value) {
		var index = array.indexOf(value);
		if (index == -1) return false;
		else array.splice(index, 1);
		return true;
	},

	excludeAll: function(array, values) {
		var index;
		for (var i = 0, count = values.length; i < count; i++) {
			index = array.indexOf(values[i]);
			if (index != -1) {
				array.splice(index, 1);
			}
		}
	},

	clone: function(array) {

		var count = array.length,
			i = 0,
			result = new Array(count);

		for (;i < count; i++) {

			result[i] = Firestorm.clone(array[i]);

		}

		return result;

	},

	replace: function(array, old_value, new_value) {

		var template_index = array.indexOf(old_value);
		if (template_index == -1) Firestorm.t("Array.replace: value is not in array");
		array[template_index] = new_value;

	}

};

Firestorm.String = {

	// taken from json2
	QUOTE_ESCAPE_REGEX: /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	quote_escape_map: {
		'\b': '\\b',
		'\t': '\\t',
		'\n': '\\n',
		'\f': '\\f',
		'\r': '\\r',
		'"' : '\\"',
		'\\': '\\\\'
	},

	escape_chars: {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#x27;",
		"`": "&#x60;"
	},

	unescape_chars: {
		"&amp;": "&",
		"&lt;": "<",
		"&gt;": ">",
		"&quot;": '"',
		"&#x27;": "'",
		"&#x60;": "`"
	},

	HTML_ESCAPE_REGEX: /[<>\&]/g,
	ATTRIBUTE_ESCAPE_REGEX: /[&<>\"\'\`]/g,
	TEXTAREA_ESCAPE_REGEX: /[<>&\'\"]/g,
	UNESCAPE_REGEX: /(&amp;|&lt;|&gt;)/g,

	/**
	 * Turn "dashed-string" into camelCased string
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

	escape: function(string, regex) {
		var escape_chars = this.escape_chars;
		return string.replace(
			regex,
			function(chr) { return escape_chars[chr]; }
		);
	},

	unescape: function(string) {
		var unescape_chars = this.unescape_chars;
		return string.replace(
			this.UNESCAPE_REGEX,
			function(chr) { return unescape_chars[chr] }
		);
	},

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

	}

};

Firestorm.Object = {

	isEmpty: function(object_instance) {
		// it's much faster than using Object.keys
		for (var name in object_instance) {
			return false;
		}
		return true;
	},

	clone: function(object) {
		var result = {},
			key;

		for (key in object) {

			result[key] = Firestorm.clone(object[key]);

		}

		return result;
	},

	copy: function(object) {

		var result = {};
		Firestorm.extend(result, object);
		return result;

	}

};

Firestorm.Date = {

	DAYS_IN_MONTH: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

	getDaysInMonth: function(year, month) {
		return (month == 1 && ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0))
			? 29 // february in leap year
			: this.DAYS_IN_MONTH[month];
	}

};

Firestorm.init();

var Lava = {
	version: [],

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Default namespaces reservation. All root members must be reserved ahead - v8 optimization.

	schema: null,
	classes: {},
	/**
	 * @type {Object.<string, _cWidget>}
	 */
	widgets: {},
	/**
	 * @type {Object.<string, _cSugarSchema>}
	 */
	sugar_map: {},
	ClassManager: null,
	ExpressionParser: null,
	TemplateParser: null,
	ObjectParser: null,
	transitions: null,
	Cron: null,
	Core: null,
	ScopeManager: null,
	modifiers: null,
	Serializer: null,
	types: null,
	extenders: null,
	resources: null,
	algorithms: {
		sorting: {}
	},

	animation: {},
	animator: {},
	data: {
		field: {}
	},
	system: {},
	mixin: {},
	parsers: {},
	view: {
		refresher: {},
		container: {}
	},
	widget: {},
	scope: {},
	user: {
		// place for any other user defined classes and variables
	},

	/** @type {Lava.system.App} */
	app: null,
	/** @type {Lava.system.ViewManager} */
	view_manager: null,
	/** @type {Lava.system.PopoverManager} */
	popover_manager: null,

	locales: {},

	// end: default namespaces reservation
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// constants and predefined data

	/** @enum {number} */
	BINDING_DIRECTIONS: {
		/** @const */
		TO_WIDGET: 1,
		/** @const */
		FROM_WIDGET: 2
	},

	/** @enum {number} */
	TARGET_ARGUMENT_TYPES: {
		VALUE: 1,
		BIND: 2
	},

	/**
	 * When changing this, you must also change SYSTEM_ID_REGEX
	 * @const
	 * */
	ELEMENT_ID_PREFIX: 'e',
	SYSTEM_ID_REGEX: /^e?\\d+$/,
	VALID_PROPERTY_NAME_REGEX: /^[a-zA-Z\_\$][a-zA-Z0-9\_\$]*$/,
	EMPTY_REGEX: /^\s*$/,
	VALID_LABEL_REGEX: /^[A-Za-z\_][A-Za-z\_0-9]*$/,

	/** @returns {boolean} */
	DEFAULT_LESS: function(a, b) { return a < b; },
	// not sure if these obsolete tags should also be included: basefont, bgsound, frame, isindex
	VOID_TAGS: ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'],
	JS_KEYWORDS: ['break','case','catch','class','const','continue','debugger','default','delete','do','else','export','extends','false','finally',
		'for','function','if','import','in','instanceof','new','null','protected','return','super','switch','this','throw','true','try','typeof',
		'var','while','with','abstract','boolean','byte','char','decimal','double','enum','final','float','get','implements','int','interface',
		'internal','long','package','private','protected','public','sbyte','set','short','static','uint','ulong','ushort','void','assert','ensure',
		'event','goto','invariant','namespace','native','require','synchronized','throws','transient','use','volatile'],

	KNOWN_EXCEPTIONS: null,

	// end: constants and predefined data
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// class members

	_widget_title_to_sugar_instance: {},
	_sugar_instances: {},

	/** @type {_tGUID} */
	guid: 1,
	is_init_done: false,
	_refresh_timer: null,

	/**
	 * Must be called before bootstrap() or creating any widgets.
	 */
	init: function() {

		var path,
			i = 0,
			count = this.schema.sugar_classes.length;

		// You must know this yourself
		// for (var name in {}) Lava.t("LiquidLava framework can not coexist with frameworks that modify native object's prototype");

		if (typeof(Firestorm) == 'undefined') Lava.t('init: Firestorm is not loaded');

		this.ClassManager.registerRootNamespace('Lava', this);

		for (path in this.classes) {

			this._loadClass(path);

		}

		if (typeof(window) != 'undefined') {
			this._initGlobals();
			this.ClassManager.registerExistingConstructor('Lava.WidgetConfigExtensionGateway', this.WidgetConfigExtensionGateway);
			this.ClassManager.registerExistingConstructor('Lava.ClassLocatorGateway', this.ClassLocatorGateway);
		}

		for (; i < count; i++) {

			this.registerSugar(this.schema.sugar_classes[i]);

		}

		this.is_init_done = true;

	},

	_initGlobals: function() {

		var constructor;
		constructor = this.ClassManager.getConstructor(Lava.schema.system.VIEW_MANAGER_CLASS);
		this.view_manager = new constructor();
		constructor = this.ClassManager.getConstructor(Lava.schema.system.APP_CLASS);
		this.app = new constructor();

		if (Lava.schema.system.POPOVER_MANAGER_ENABLED) {
			constructor = this.ClassManager.getConstructor(Lava.schema.system.POPOVER_MANAGER_CLASS);
			this.popover_manager = new constructor();
		}

	},

	/**
	 * Validate and then eval the passed string.
	 * String does not necessarily need to be in strict JSON format, just any valid plain JS object (without logic!).
	 * Obviously, you must use this function only with the code you trust.
	 * @param {string} serialized_object
	 */
	parseOptions: function(serialized_object) {
		Lava.schema.VALIDATE_OPTIONS && this.ObjectParser.parse(serialized_object);
		return eval('(' + serialized_object + ')');
	},

	/**
	 * @param {string} id
	 * @returns {boolean}
	 */
	isValidId: function(id) {

		return this.VALID_LABEL_REGEX.test(id) && !this.SYSTEM_ID_REGEX.test(id);

	},

	/**
	 * @param {string} msg
	 */
	logError: function(msg) {

		if (typeof(window) == 'undefined') throw new Error(msg); // Node environment

		if (window.console) {
			window.console.error(msg);
		}

	},

	logException: function(e) {

		this.logError((typeof(e) == 'string' || typeof(e) == 'number') ? e : e.message);

	},

	/**
	 * @param widget_title
	 * @returns {_cWidget}
	 */
	getWidgetConfig: function(widget_title) {

		if (Lava.schema.DEBUG && !(widget_title in this.widgets)) Lava.t("Widget config not found: " + widget_title);

		var config = this.widgets[widget_title];

		if (!config.is_extended) {

			Lava.extenders[config.extender_type](config);

		}

		return config;

	},

	/**
	 * @param {string} title
	 * @param config
	 * @param properties
	 * @returns {Lava.widget.Standard}
	 */
	createWidget: function(title, config, properties) {

		var widget_config = this.getWidgetConfig(title),
			constructor;

		if (config) {

			if (Lava.schema.DEBUG && config.extends && config.extends != title) Lava.t("Malformed widget config");

			config.extends = title;
			Lava.extenders[config.extender_type || widget_config.extender_type](config);

		} else {

			// all widgets from schema must have their class present
			config = widget_config;

		}

		constructor = Lava.ClassManager.getConstructor(config['class']);
		return /** @type {Lava.widget.Standard} */ new constructor(config, null, null, null, properties);

	},

	hasWidgetConfig: function(widget_title) {

		return widget_title in this.widgets;

	},

	/**
	 * Take an array of event names and leave those, which are not in DEFAULT_EVENTS schema setting,
	 * @param {Array.<string>} event_names
	 * @returns {Array.<string>}
	 */
	excludeDefaultEvents: function(event_names) {

		var i = 0,
			count = event_names.length,
			result = [];

		for (; i < count; i++) {

			if (Lava.schema.system.DEFAULT_EVENTS.indexOf(event_names[i]) == -1) {

				result.push(event_names[i]);

			}

		}

		return result;

	},

	/**
	 * Throw an error
	 * @param {string} [message]
	 */
	t: function(message) {

		if (typeof(message) == 'number' && this.KNOWN_EXCEPTIONS && (message in this.KNOWN_EXCEPTIONS)) {
			throw new Error(this.KNOWN_EXCEPTIONS[message]);
		}

		throw new Error(message || 'Debug assertion failed');

	},

	registerSugar: function(class_name) {

		if (Lava.schema.DEBUG && (class_name in this._sugar_instances)) Lava.t('Class is already registered as sugar');
		var constructor = this.ClassManager.getConstructor(class_name);
		this._sugar_instances[class_name] = new constructor();

	},

	getSugarInstance: function(class_name) {

		return this._sugar_instances[class_name];

	},

	/**
	 * @param {string} widget_title
	 * @returns {_iSugarParser}
	 */
	getWidgetSugarInstance: function(widget_title) {

		var sugar_class,
			widget_config;

		if (!(widget_title in this._widget_title_to_sugar_instance)) {

			widget_config = this.getWidgetConfig(widget_title);
			if (!('sugar' in widget_config)) Lava.t("Widget " + widget_title + " does not have sugar in configuration");
			sugar_class = widget_config.sugar['class'] || Lava.schema.widget.DEFAULT_SUGAR_CLASS;
			this._widget_title_to_sugar_instance[widget_title] = this._sugar_instances[sugar_class];

		}

		return this._widget_title_to_sugar_instance[widget_title];

	},

	/**
	 * @param {string} widget_title
	 * @param {_cWidget} widget_config
	 */
	storeWidgetSchema: function(widget_title, widget_config) {

		if (!Lava.schema.widget.ALLOW_REDEFINITION && (widget_title in this.widgets))
			Lava.t("storeWidgetSchema: widget is already defined: " + widget_title);

		this.widgets[widget_title] = widget_config;

		if (('sugar' in widget_config) && widget_config.sugar.tag_name) {

			this.sugar_map[widget_config.sugar.tag_name] = {widget_title: widget_title};

		}

	},

	bootstrap: function() {

		var body = document.body,
			app_class = Firestorm.Element.getProperty(document.body, 'lava-app'),
			bootstrap_targets,
			element,
			result;

		if (!this.is_init_done) {
			this.init();
		}

		if (app_class != null) {

			result = this._elementToWidget(body, {class: 'Element', tag_name: 'body'});
			result.injectIntoExistingElement(body);

		} else {

			bootstrap_targets = Firestorm.selectElements('script[type="lava/app"],lava-app');
			for (var i = 0, count = bootstrap_targets.length; i < count; i ++) {

				//try {

					element = bootstrap_targets[i];
					result = this._elementToWidget(element, {class: 'Morph'});
					result.inject(element, 'After');
					element.destroy();

				//} catch (e) {

				//	Lava.logException(e);

				//}

			}

		}

		if (Lava.schema.system.POPOVER_MANAGER_ENABLED) {
			this.popover_manager.enable();
		}

	},

	_elementToWidget: function(element, container_config) {

		var config,
			constructor,
			name = Firestorm.Element.getProperty(element, 'name'),
			id = Firestorm.Element.getProperty(element, 'id'),
			class_name = Firestorm.Element.getProperty(element, 'lava-app');

		config = {
			type: 'widget',
			is_extended: true,
			template: null,
			container: container_config
		};
		config.template = Lava.TemplateParser.parse(element.get('html'), config);

		if (id) {
			config.id = id;
			Firestorm.Element.removeProperty(element, 'id');
		}

		constructor = Lava.ClassManager.getConstructor(class_name || 'Lava.widget.Standard', 'Lava.widget');
		if (Lava.schema.DEBUG && !constructor) Lava.t('Class not found: ' + class_name);
		return /** @type {Lava.widget.Standard} */ new constructor(config);

	},

	/**
	 * Behaves like a widget constructor, but accepts raw (unextended) widget config.
	 * Extends the config and creates the widget instance with the right class.
	 *
	 * @constructor
	 * @param {_cWidget} config
	 * @param {Lava.widget.Standard} widget
	 * @param {Lava.view.View} parent_view
	 * @param {Object} properties
	 * @param {Lava.system.Template} template
	 * @returns {Lava.widget.Standard}
	 */
	WidgetConfigExtensionGateway: function(config, widget, parent_view, template, properties) {

		// here we do not need to check if the config is already extended, cause otherwise it would have real class
		// and it's constructor would be called directly.
		Lava.extenders[config.extender_type](config);

		if ('class_locator' in config) {

			config['class'] = Lava.schema.widget.DEFAULT_CLASS_LOCATOR_GATEWAY;

		}

		if (Lava.schema.DEBUG && !config['class']) Lava.t("Trying to create a widget without class");
		var constructor = Lava.ClassManager.getConstructor(config['class'], 'Lava.widget');
		if (Lava.schema.DEBUG && !constructor) Lava.t("Class not found: " + config['class']);
		return new constructor(config, widget, parent_view, template, properties);

	},

	ClassLocatorGateway: function(config, widget, parent_view, template, properties) {

		var target = Lava.view_manager.locateTarget(widget, config.class_locator.locator_type, config.class_locator.name);
		if (Lava.schema.DEBUG && (!target || !target.isWidget)) Lava.t("[ClassLocatorGateway] Target is null or not a widget");

		var constructor = target.getPackageConstructor(config.real_class);
		return new constructor(config, widget, parent_view, template, properties);

	},

	/**
	 * @param {string} class_name
	 * @param {Object} class_object
	 */
	define: function(class_name, class_object) {

		if (this.is_init_done) {

			this.ClassManager.define(class_name, class_object);

		} else {

			this.classes[class_name] = class_object;

		}

	},

	_loadClass: function(path) {

		var class_body = this.classes[path],
			i = 0,
			count;

		if (Lava.schema.DEBUG && !class_body) Lava.t("[Lava::_loadClass] Class does not exists: " + path);

		if ('Extends' in class_body) {
			if (!this.ClassManager.hasClass(class_body.Extends)) {
				this._loadClass(class_body.Extends);
			}
		}

		if ('Implements' in class_body) {
			if (typeof(class_body.Implements) == 'string') {
				if (!this.ClassManager.hasClass(class_body.Implements)) {
					this._loadClass(class_body.Implements);
				}
			} else {
				for (count = class_body.Implements.length; i < count; i++) {
					if (!this.ClassManager.hasClass(class_body.Implements[i])) {
						this._loadClass(class_body.Implements[i]);
					}
				}
			}
		}

		this.ClassManager.define(path, class_body);

	},

	/**
	 * Create a function, which returns a clone of given template or config.
	 * Note: widget configs must not be extended!
	 * @param {*} config
	 * @returns {function}
	 */
	createCloner: function(config) {

		return new Function('return ' + Lava.Serializer.serialize(config));

	},

	/**
	 * Feature of the current binding system:
	 * sometimes, a view may be rendered with dirty bindings. They will be refreshed in the next refresh loop.
	 * This may happen during widget inject() outside of normal App lifecycle, and user may forget to call Lava.refreshViews().
	 */
	scheduleRefresh: function() {

		var self;
		if (!this._refresh_timer && !Lava.Core.isProcessingEvent()) {

			self = this;
			this._refresh_timer = window.setTimeout(
				function(){
					self._refresh_timer = null;
					self.refreshViews();
				},
				0
			);

		}

	},

	refreshViews: function() {

		if (!Lava.Core.isProcessingEvent()) {

			this.view_manager.refresh();

		}

		if (this._refresh_timer) {
			window.clearTimeout(this._refresh_timer);
			this._refresh_timer = null;
		}

	},

	isVoidTag: function(name) {

		return this.VOID_TAGS.indexOf(name) != -1;

	},

	suspendListener: function(listener) {
		listener.fn = this.noop;
	},

	resumeListener: function(listener) {
		listener.fn = listener.fn_original;
	},

	noop: function() {}

};

Lava.schema = {
	/** @const */
	//ELEMENT_EVENT_PREFIX: 'data-e-',
	/**
	 * This option should be turned off in production, but keep in mind: options, defined in template, are part of
	 * view configuration, and they must be valid JSON objects. Putting there anything else will most likely break
	 * existing and future functionality. Options must be serializable.
	 * @const
	 */
	VALIDATE_OPTIONS: true,
	/** @const */
	VALIDATE_OBJECT_PATHS: true,
	system: {
		/** @const */
		APP_CLASS: 'Lava.system.App',
		/** @const */
		VIEW_MANAGER_CLASS: 'Lava.system.ViewManager',
		/**
		 * ViewManager events (routed via templates), which are enabled by default, so does not require a call to lendEvent().
		 */
		DEFAULT_EVENTS: [
			'click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu',
			'mousewheel', 'keydown', 'keypress', 'keyup',
			'change', 'focus', 'blur'
		],

		POPOVER_MANAGER_ENABLED: true,
		POPOVER_MANAGER_CLASS: 'Lava.system.PopoverManager'
	},
	data: {
		/** @const */
		DEFAULT_MODULE_CLASS: 'Module',
		/** @const */
		DEFAULT_RECORD_CLASS: 'Record',
		/** @const */
		DEFAULT_FIELD_TYPE: 'Basic',
		/**
		 * Generally, it's NOT recommended to turn this off in production
		 */
		VALIDATE_IMPORT_DATA: true,
		/** @const */
		DEFAULT_SORT_ALGORITHM: 'mergeSort'
	},
	modules: {},
	view: {
		/** @const */
		VALIDATE_CLASS_NAMES: true,
		/** @const */
		VALIDATE_STYLES: true,
		/** @const */
		REFRESH_INFINITE_LOOP_THRESHOLD: 3,
		DEFAULT_CLASS_LOCATOR_GATEWAY: 'Lava.ClassLocatorGateway'
	},
	parsers: {
		view_name_to_class_map: {
			'expression': 'Expression',
			'foreach': 'Foreach',
			'if': 'If',
			'view': 'View'
		},
		PRESERVE_VIEW_NAME: false,
		EXPORT_STRINGS: false
	},
	widget: {
		/**
		 * May be treated same as DEBUG switch (most likely, you will want to turn this off in production)
		 * @const
		 */
		VALIDATE_PROPERTY_TYPES: true,
		/** @const */
		DEFAULT_SUGAR_CLASS: 'Lava.system.Sugar',
		ALLOW_REDEFINITION: false,
		DEFAULT_EXTENSION_GATEWAY: 'Lava.WidgetConfigExtensionGateway',
		DEFAULT_CLASS_LOCATOR_GATEWAY: 'Lava.ClassLocatorGateway',
		DEFAULT_EXTENDER: 'Default'
	},
	sugar_classes: ['Lava.system.Sugar'],

	/**
	 * Current locale. Must not be null or 'default'
	 */
	LOCALE: 'en',
	RESOURCES_ENABLED: true,

	/** @define */
	DEBUG: true
};

Lava.Serializer = {

	/** @define {boolean} */
	CHECK_PROPERTY_NAMES: true,

	_callback_map: {
		string: '_serializeString',
		array: '_serializeArray',
		'object': '_serializeObject',
		'function': '_serializeFunction',
		boolean: '_serializeBoolean',
		number: '_serializeNumber',
		regexp: '_serializeRegexp',
		'null': '_serializeNull',
		'undefined': '_serializeUndefined'
	},

	_complex_types: {
		array: true,
		'object': true,
		'function': true,
		regexp: true
	},

	/**
	 * @param {*} value
	 * @returns {string}
	 */
	serialize: function(value) {

		return this._serializeValue(value, '');

	},

	_serializeValue: function(value, padding) {

		var type = Firestorm.getType(value),
			result;

		if (Lava.schema.DEBUG && !(type in this._callback_map)) Lava.t("Unsupported type for serialization: " + type);

		result = this[this._callback_map[type]](value, padding);

		return result;

	},

	_serializeArray: function(data, padding) {

		var tempResult = [],
			i = 0,
			count = data.length,
			child_padding = padding + "\t",
			result;

		if (count == 0) {

			result = '[]';

		} else if (count == 1) {

			result = '[' + this._serializeValue(data[i], padding) + ']';

		} else {

			for (; i < count; i++) {

				tempResult.push(this._serializeValue(data[i], child_padding));

			}

			result = '[' + "\n\t" + padding + tempResult.join(",\n\t" + padding) + "\n" + padding + ']';

		}

		return result;

	},

	_serializeString: function(data) {

		return Firestorm.String.quote(data);

	},

	_serializeObject: function(data, padding) {

		var tempResult = [],
			child_padding = padding + "\t",
			name,
			type,
			result,
			is_complex = false,
			only_key = null,
			is_empty = true;

		// this may be faster than using Object.keys(data), but I haven't done speed comparison yet.
		// Purpose of the following code:
		// 1) if object has something in it than 'is_empty' will be set to false
		// 2) if there is only one property in it, than 'only_key' will contain it's name
		for (name in data) {
			if (only_key !== null) { // strict comparison - in case the key is valid, but evaluates to false
				only_key = null;
				break;
			}
			is_empty = false;
			only_key = name;
		}

		if (only_key) {

			type = Firestorm.getType(data[only_key]);

			if (type in this._complex_types) {
				is_complex = true;
			}

		}

		if (is_empty) {

			result = '{}';

		} else if (only_key && !is_complex) {

			// simple values can be written in one line
			result = '{' + this._serializeObjectProperty(only_key, data[only_key], child_padding) + '}';

		} else {

			for (name in data) {

				tempResult.push(
					this._serializeObjectProperty(name, data[name], child_padding)
				);

			}

			result = '{' + "\n\t" + padding + tempResult.join(",\n\t" + padding) + "\n" + padding + '}';

		}

		return result;

	},

	_serializeObjectProperty: function(name, value, padding) {

		var type = Firestorm.getType(value);

		// if you serialize only Lava configs, than most likely you do not need this check,
		// cause the property names in configs are always valid.
		if (this.CHECK_PROPERTY_NAMES && (!Lava.VALID_PROPERTY_NAME_REGEX.test(name) || Lava.JS_KEYWORDS.indexOf(name) != -1)) {

			name = '"' + name.replace(/\"/g, "\\\"") + '"';

		}

		return name + ': ' + this[this._callback_map[type]](value, padding);

	},

	/**
	 * @param {function} data
	 * @returns {string}
	 */
	_serializeFunction: function(data) {

		var result = data + '';

		// when using new Function() constructor, it's automatically named 'anonymous' in Chrome && Firefox
		if (result.substr(0, 18) == 'function anonymous') {
			result = 'function' + result.substr(18);
		}

		return result;

	},

	_serializeBoolean: function(data) {

		return data.toString();

	},

	_serializeNumber: function(data) {

		return data.toString();

	},

	_serializeRegexp: function(data) {

		return data.toString();

	},

	_serializeNull: function() {

		return 'null';

	},

	_serializeUndefined: function() {

		return 'undefined';

	}

};

Lava.modifiers = {

	/**
	 * @param value
	 * @returns {string}
	 */
	toLower: function(value) {

		return value ? value.toString().toLowerCase() : '';

	},

	/**
	 * Upper-case the first letter
	 * @param value
	 * @returns {string}
	 */
	ucFirst: function(value) {

		var result = '';

		if (value) {
			result = value.toString();
			result = result[0].toUpperCase() + result.slice(1);
		}

		return result;

	},

	/**
	 * Apply a function from Firestorm.String
	 * @param value
	 * @param {string} callback_name
	 * @returns {string}
	 */
	stringFunction: function(value, callback_name) {

		return value ? Firestorm.String[callback_name](value.toString()) : '';

	},

	translateBoolean: function(value) {

		if (Lava.schema.DEBUG && typeof(value) != 'boolean') Lava.t("translateBoolean: argument is not boolean type");
		return Lava.locales[Lava.schema.LOCALE].booleans[+value];

	}

};

Lava.transitions = {

	linear: function(x) {
		return x;
	},

	inSine: function (x) {
		return 1 - Math.cos(x * Math.PI / 2);
	},

	outSine: function (x) {
		return Math.sin(x * Math.PI / 2);
	},

	inOutSine: function(x) {
		return -(Math.cos(Math.PI * x) - 1) / 2;
	},

	inQuad: function (x) {
		return x * x;
	},

	outQuad: function (x) {
		return x * (2 - x);
	},

	inOutQuad: function (x) {
		if (x < .5) return 2 * x * x;
		return 1 - 2 * (x -= 1) * x;
	},

	inCubic: function (x) {
		return x * x * x;
	},

	outCubic: function (x) {
		return (x -= 1) * x * x + 1;
	},

	inOutCubic: function (x) {
		if (x < .5) return 4 * x * x * x;
		return 4 * (x -= 1) * x * x + 1;
	}

};


Lava.resources =
/**
 * API for working with resources, gathered into separate namespace for convenience.
 */
{

	_container_resources_operations_map: {
		static_properties: '_containerSet',
		static_styles: '_containerSet',
		static_classes: '_containerSet',
		add_properties: '_containerAddObject',
		add_styles: '_containerAddObject',
		add_classes: '_containerAddArray',
		remove_properties: '_containerRemoveObject',
		remove_styles: '_containerRemoveObject',
		remove_classes: '_containerRemoveArray'
	},

	_container_resources_operands_map: {
		add_properties: 'static_properties',
		remove_properties: 'static_properties',
		add_styles: 'static_styles',
		remove_styles: 'static_styles',
		add_classes: 'static_classes',
		remove_classes: 'static_classes'
	},

	/**
	 * May be overwritten by user to handle string definitions in widget resources.
	 * Example usage: create an export file for translation.
	 *
	 * @param {(_cTranslatableString|_cTranslatablePlural)} data
	 * @param {string} widget_title May be used as Domain for strings
	 * @param {string} locale
	 * @param {string} path
	 */
	exportTranslatableString: function(data, widget_title, locale, path) {

	},

	/**
	 * @param {string} widget_title
	 * @param {string} locale
	 * @param {Object} locale_resources
	 */
	addWidgetResource: function(widget_title, locale, locale_resources) {

		if (Lava.schema.DEBUG && !(widget_title in Lava.widgets)) Lava.t("Widget config not found: " + widget_title);

		var config = Lava.widgets[widget_title];

		if (config.is_extended) Lava.t("Widget is already extended, can not add resources: " + widget_title);

		if (!config.resources) {
			config.resources = {}
		}

		if (Lava.schema.DEBUG && (locale in config.resources)) Lava.t("Locale is already defined: " + locale);

		config.resources[locale] = locale_resources;

	},

	_mergeResourceContainerObject: function(name, target, result) {

		var i,
			count,
			static_property_name = 'static_' + name,
			add_property_name = 'add_' + name,
			remove_property_name = 'remove_' + name;

		if (static_property_name in target) {

			result[static_property_name] = target[static_property_name];

		} else if ((add_property_name in target) || (remove_property_name in target)) {

			if (Lava.schema.DEBUG && !(static_property_name in result)) Lava.t("Merging resources container: add/remove operation present, but value is not defined");
			result[static_property_name] = Firestorm.Object.copy(result[static_property_name]);
			if (add_property_name in target) {
				Firestorm.extend(result[static_property_name], target[add_property_name]);
			}
			if (remove_property_name in target) {
				for (i = 0, count = target[remove_property_name].length; i < count; i++) {
					delete result[static_property_name][target[remove_property_name][i]];
				}
			}

		}

	},

	_mergeContainerResource: function(top_object, bottom_object) {

		var result = Firestorm.Object.copy(bottom_object);

		this._mergeResourceContainerObject('styles', top_object, result);
		this._mergeResourceContainerObject('properties', top_object, result);

		if ('static_classes' in top_object) {

			result['static_classes'] = top_object['static_classes'];

		} else if (('add_classes' in top_object) || ('remove_classes' in top_object)) {

			if (Lava.schema.DEBUG && !('static_classes' in result)) Lava.t("Merging resources container: add/remove operation present, but value is not defined");
			result['static_classes'] = result['static_classes'].slice();
			if ('add_classes' in top_object) {
				result['static_classes'] = result['static_classes'].concat(top_object['add_classes']);
			}
			if ('remove_classes' in top_object) {
				Firestorm.Array.excludeAll(result['static_classes'], top_object['remove_classes']);
			}

		}

		return result;

	},

	/**
	 * top_resources is expected to be a copy or a new empty object.
	 * Properties in top_resources have priority over bottom_resources.
	 *
	 * @param top_resources
	 * @param bottom_resources
	 */
	mergeResources: function(top_resources, bottom_resources) {

		var name,
			result = Firestorm.Object.copy(top_resources);

		for (name in bottom_resources) {

			if (name in result) {

				if (Lava.schema.DEBUG && result[name].type != bottom_resources[name].type) Lava.t("Resource types mismatch: " + name);

				if (bottom_resources[name].type == 'component') {

					result[name] = {
						type: 'component',
						value: this.mergeResources(result[name].value, bottom_resources[name].value)
					};

				} else if (bottom_resources[name].type == 'container_stack') {

					if (result[name].type != 'container_stack') Lava.t();

					result[name] = {
						type: 'container_stack',
						value: bottom_resources[name].value.concat(result[name].value)
					}

				}

			} else {

				result[name] = bottom_resources[name];

			}

		}

		return result;

	},

	mergeRootContainerStacks: function(resource_object) {

		for (var name in resource_object) {
			if (resource_object[name].type == 'container_stack') {

				resource_object[name] = {
					type: 'container',
					value: this._mergeRootContainerStack(resource_object[name].value)
				}

			}
		}

	},

	_mergeRootContainerStack: function(stack) {

		var i = 0,
			count = stack.length,
			result = {},
			operation;

		if (Lava.schema.DEBUG && !Array.isArray(stack)) Lava.t();

		for (; i < count; i++) {
			operation = stack[i];
			this[this._container_resources_operations_map[operation.name]](result, operation.name, operation.value);
		}

		return result;

	},

	_containerSet: function(result, name, value) {
		result[name] = value;
	},

	_containerAddObject: function(result, name, value) {
		var operand_name = this._container_resources_operands_map[name];
		if (operand_name in result) {
			Firestorm.extend(result[operand_name], value);
		} else {
			result[operand_name] = value;
		}
	},

	_containerAddArray: function(result, name, value) {
		var operand_name = this._container_resources_operands_map[name];
		if (operand_name in result) {
			result[operand_name] = result[operand_name].concat(value);
		} else {
			result[operand_name] = value;
		}
	},

	_containerRemoveObject: function(result, name, value) {

		var target,
			operand_name = this._container_resources_operands_map[name];
		if (operand_name in result) {
			target = result[operand_name];
			for (var property_name in value) {
				delete target[property_name]
			}
		}
	},

	_containerRemoveArray: function(result, name, value) {
		var operand_name = this._container_resources_operands_map[name];
		if (operand_name in result) {
			Firestorm.Array.excludeAll(result[operand_name], value);
		}
	},

	/**
	 * Helper function which puts the value inside the resources object under given path string.
	 *
	 * @param {Object} target_object the resources object which is being parsed
	 * @param {string} path Path inside the resources object
	 * @param {*} value
	 */
	putResourceValue: function(target_object, path, value) {

		var path_segments = path.split('.'),
			segment,
			resource_name = path_segments.pop(),
			i = 0,
			count = path_segments.length;

		if (Lava.schema.DEBUG && /[a-z]/.test(resource_name)) Lava.t("Terminal resource names must be uppercase");

		for (; i < count; i++) {

			segment = path_segments[i];
			if (Lava.schema.DEBUG && /[A-Z]/.test(segment)) Lava.t("Resource component names must be lowercase");

			if (!(segment in target_object)) {

				target_object[segment] = {
					type: 'component',
					value: {}
				};

			} else {

				if (Lava.schema.DEBUG && target_object[segment].type != 'component') Lava.t("Malformed resource definition, path is not component: " + path);

			}

			target_object = target_object[segment].value;

		}

		if (resource_name in target_object) Lava.t("Resource is already defined: " + path);
		target_object[resource_name] = value;

	}

};
/**
 * Note: types require initialization (Lava.initCore())
 */
Lava.types = {

	// for extension only
	AbstractType: {

		type_name: null,

		/**
		 * @param {string} value
		 * @param {Object} descriptor
		 * @returns {boolean}
		 */
		fromString: function(value, descriptor) {
			if (!this.isValidString(value, descriptor)) Lava.t("Invalid " + this.type_name + " string: " + value);
			return this.fromSafeString(value, descriptor);
		}

	},

	Boolean: {

		extends: 'AbstractType',

		_mappings: {
			'true': true,
			'1': true,
			'false': false,
			'0': false
		},

		/**
		 * @param {*} value
		 * @returns {boolean}
		 */
		isValidValue: function(value) {

			return typeof(value) == 'boolean';

		},

		isValidString: function(value) {

			return (value in this._mappings);

		},

		fromSafeString: function(value) {

			return this._mappings[value];

		}

	},

	String: {

		extends: 'AbstractType',

		/**
		 * @param {*} value
		 * @returns {boolean}
		 */
		isValidValue: function(value) {

			return typeof(value) == 'string';

		},

		isValidString: function(value) {

			return true;

		},

		fromSafeString: function(value) {

			return value;

		}

	},

	Number: {

		extends: 'AbstractType',

		_valid_value_regex: /^(\-|\+)?\d+(\.\d*)?$/,

		/**
		 * @param {*} value
		 * @returns {boolean}
		 */
		isValidValue: function(value) {

			return typeof(value) == 'number' && this._valid_value_regex.test(value);

		},

		isValidString: function(value) {

			return this._valid_value_regex.test(value);

		},

		fromSafeString: function(value) {

			return +value;

		}

	},

	Integer: {

		extends: 'Number',

		_valid_value_regex: /^(\-|\+)?\d+$/

	},

	PositiveInteger: {

		extends: 'Number',

		_valid_value_regex: /^\+?[1-9]\d*$/

	},

	NonNegativeInteger: {

		extends: 'Number',

		_valid_value_regex: /^\+?\d+$/

	},

	Percent: {

		extends: 'Number',

		_valid_value_regex: /^(0?\.\d+|1\.0+|0|1)$/,

		/**
		 * @param {*} value
		 * @returns {boolean}
		 */
		isValidValue: function(value) {

			return typeof(value) == 'number' && value >= 0 && value <=1;

		}

	},

	Set: {

		extends: 'AbstractType',

		/**
		 * @param {*} value
		 * @param descriptor
		 * @returns {boolean}
		 */
		isValidValue: function(value, descriptor) {

			if (Lava.schema.DEBUG && (!descriptor || !('allowed_values' in descriptor))) Lava.t("Set type: missing allowed_values in schema");
			return descriptor['allowed_values'].indexOf(value) != -1;

		},

		isValidString: function(value, descriptor) {

			return this.isValidValue(value, descriptor);

		},

		fromSafeString: function(value) {

			return value;

		}

	},

	/**
	 * An HTML attribute which can take it's name as a value.
	 * Example:
	 * checked="checked"
	 * checked=""
	 */
	SwitchAttribute: {

		extends: 'AbstractType',

		/**
		 * @param {*} value
		 * @param descriptor
		 * @returns {boolean}
		 */
		isValidValue: function(value, descriptor) {

			return value === '' || value === descriptor.name;

		},

		isValidString: function(value, descriptor) {

			return this.isValidValue(value, descriptor);

		},

		fromSafeString: function() {

			return true;

		}

	},

	Map: {

		extends: 'AbstractType',

		/**
		 * @param {*} value
		 * @param descriptor
		 * @returns {boolean}
		 */
		isValidValue: function(value, descriptor) {

			if (Lava.schema.DEBUG && (!descriptor || !('value_map' in descriptor))) Lava.t("Set type: missing allowed_values in schema");
			return (value in descriptor['value_map']);

		},

		isValidString: function(value, descriptor) {

			return this.isValidValue(value, descriptor);

		},

		fromSafeString: function(value, descriptor) {

			return descriptor['value_map'][value];

		}

	},

	Array: {

		extends: 'AbstractType',

		isValidValue: function(value) {

			return Array.isArray(value);

		},

		isValidString: function() {

			return false;

		},

		fromSafeString: function() {

			Lava.t();

		}

	},

	Date: {

		extends: 'AbstractType',

		isValidValue: function(value) {

			return Firestorm.getType(value) == 'date';

		},

		isValidString: function() {

			return false; // will be implemented later

		},

		fromSafeString: function(value) {

			Lava.t();

		}

	}

};

(function(types) {

	var name;

	function extendLavaType(type_object) {
		var base;
		if ('extends' in type_object) {
			base = types[type_object.extends];
			if (!base.is_extended) {
				extendLavaType(base);
			}
			Firestorm.implement(type_object, base);
		}
		type_object.is_extended = true;
	}

	for (name in types) {
		extendLavaType(types[name]);
		types[name].type_name = name;
	}

})(Lava.types);
/**
 * The widget config extension algorithms
 */
Lava.extenders = {

	// properties that must be merged with parent configs
	_widget_config_merged_properties: {
		includes: '_mergeIncludes',
		bindings: '_mergeConfigProperty',
		assigns: '_mergeConfigProperty',
		options: '_mergeConfigProperty',
		properties: '_mergeConfigProperty',
		storage: '_mergeStorage',
		sugar: '_mergeSugar',
		broadcast: '_mergeConfigProperty'
	},

	// property_name => needs_implement || property_merge_map
	_sugar_merge_map: {
		attribute_mappings: true,
		content_schema: {
			attribute_mappings: true,
			tag_mappings: true,
			tag_roles: true
		}
	},

	_mergeConfigProperty: function(dest_container, source_container, property_name) {

		var name,
			dest = dest_container[property_name],
			source = source_container[property_name];

		for (name in source) {

			if (!(name in dest)) {

				dest[name] = source[name];

			}

		}

	},

	_mergeWithMap: function(dest, source, map) {

		var name;

		for (name in source) {

			if (!(name in dest)) {

				dest[name] = source[name];

			} else if (name in map) {

				if (map[name] == true) {

					Firestorm.implement(dest[name], source[name]);

				} else {

					this._mergeWithMap(dest[name], source[name], map[name]);

				}

			}

		}

	},

	_mergeSugar: function(dest_container, source_container, property_name) {

		this._mergeWithMap(dest_container[property_name], source_container[property_name], this._sugar_merge_map);

	},

	_mergeIncludes: function(dest_container, source_container, property_name, parent_widget_name) {

		var name,
			dest = dest_container[property_name],
			source = source_container[property_name],
			new_name;

		for (name in source) {

			if (!(name in dest)) {

				dest[name] = source[name];

			} else {

				new_name = parent_widget_name + '$' + name;
				if (Lava.schema.DEBUG && (new_name in dest)) Lava.t();
				dest[new_name] = source[name];

			}

		}

	},

	_mergeStorage: function(dest_container, source_container, property_name) {

		var name,
			dest = dest_container[property_name],
			source = source_container[property_name];

		for (name in source) {

			if (!(name in dest)) {

				dest[name] = source[name];

			} else {

				if (Lava.schema.DEBUG && dest[name].type != source[name].type) Lava.t("[Config storage] property types must match: " + name);
				if (['template_hash', 'object_hash', 'object'].indexOf(dest[name].type) != -1) {

					Firestorm.implement(dest[name], source[name]);

				}

			}

		}

	},

	_extendResources: function(config, parent_config) {

		var locale_cache = {};

		if ('resources' in config) {

			if (Lava.schema.LOCALE in config.resources) {
				locale_cache = Lava.resources.mergeResources(locale_cache, config.resources[Lava.schema.LOCALE]);
			}
			if ('default' in config.resources) {
				locale_cache = Lava.resources.mergeResources(locale_cache, config.resources['default']);
			}

		}

		if (parent_config && ('resources_cache' in parent_config)) {

			locale_cache = Lava.resources.mergeResources(locale_cache, parent_config.resources_cache[Lava.schema.LOCALE]);

		}

		if (!Firestorm.Object.isEmpty(locale_cache)) {

			config.resources_cache = {};
			config.resources_cache[Lava.schema.LOCALE] = locale_cache;

		}

	},

	/**
	 * @param {_cWidget} config
	 */
	Default: function(config) {

		var parent_config,
			parent_name;

		if ('extends' in config) {

			parent_name = config.extends;
			// returns already extended configs
			parent_config = Lava.getWidgetConfig(parent_name);

			for (var name in parent_config) {

				if (!(name in config)) {

					config[name] = parent_config[name];

				} else if (name in this._widget_config_merged_properties) {

					this[this._widget_config_merged_properties[name]](config, parent_config, name, parent_name);

				}

			}

		}

		if (Lava.schema.RESOURCES_ENABLED) {
			this._extendResources(config, parent_config);
		}

		if (config.real_class && !('class_locator' in config)) {

			config['class'] = Lava.ClassManager.hasConstructor(config.real_class)
				? config.real_class
				: 'Lava.widget.' + config.real_class;

		} else {

			config['class'] = null;

		}

		config.is_extended = true;

	}

};

Lava.Cron = {

	DEFAULT_TIMER_DELAY: 20, // up to 50 fps

	_timer: null,
	_active_tasks: [],

	timeout_callback: function() {

		Lava.Cron.onTimer();

	},

	acceptTask: function(task) {

		if (this._active_tasks.indexOf(task) == -1) {

			this._active_tasks.push(task);

		}

		this._enable();

	},

	_enable: function() {

		if (this._timer == null) {

			this._timer = window.setInterval(this.timeout_callback, this.DEFAULT_TIMER_DELAY);

		}

	},

	onTimer: function() {

		var time = new Date().getTime(),
			i = 0,
			count = this._active_tasks.length,
			task,
			active_tasks = [];

		for (; i < count; i++) {

			task = this._active_tasks[i];

			if (task.isRunning()) {
				task.onTimer(time);
				// note: at this moment task may be already off, but it's not checked - to save processor resources.
				active_tasks.push(task);
			}

		}

		if (!active_tasks.length) {

			clearInterval(this._timer);
			this._timer = null;

		}

		this._active_tasks = active_tasks;

	}

};

Lava.Core = {

	// note: IE8 and below are not fully supported
	_dom_event_support: {

		focus: {delegation: true},
		blur: {delegation: true},
		change: {delegation: true},
		reset: {delegation: true},
		select: {delegation: true},
		submit: {delegation: true},
		paste: {delegation: true},
		input: {delegation: true}

	},

	/**
	 * Core's own handlers, which then call attached listeners
	 */
	_event_listeners: {},
	_event_usage_counters: {},

	/**
	 * External listeners
	 * @type {Object.<string, Array.<_iListener>>}
	 */
	_event_handlers: {},

	_is_processing_event: false,

	_freeze_protected_events: ['mouseover', 'mouseout', 'mousemove'],

	/**
	 * @param {string} event_name
	 * @param {function} fn
	 * @param {Object} context
	 * @returns {_iEventTicket}
	 */
	addGlobalHandler: function(event_name, fn, context) {

		var listener = {
				event_name: event_name,
				fn: fn,
				context: context
			};

		if (this._event_usage_counters[event_name]) {

			this._event_usage_counters[event_name]++;
			this._event_handlers[event_name].push(listener);

		} else {

			this._event_usage_counters[event_name] = 1;
			this._event_handlers[event_name] = [listener];
			this._initEvent(event_name);

		}

		return listener;

	},

	removeGlobalHandler: function(listener) {

		var event_name = listener.event_name,
			index = this._event_handlers[event_name].indexOf(listener);
		if (Lava.schema.DEBUG && index == -1) Lava.t();
		this._event_handlers[event_name].splice(index, 1);

		this._event_usage_counters[event_name]--;

		if (this._event_usage_counters[event_name] == 0) {

			this._shutdownEvent(event_name);

		}

	},

	_createEventWrapper: function(event_name) {

		var self = this,
			freeze_protection = this._freeze_protected_events.indexOf(event_name) != -1;

		return function(event_object) {

			// Note: inside this wrapper 'this' will refer to window
			self._onDomEvent(event_name, event_object, freeze_protection);

		};

	},

	_initEvent: function(event_name) {

		this._event_listeners[event_name] = this._createEventWrapper(event_name);

		if ((event_name in this._dom_event_support) && this._dom_event_support[event_name].delegation) {

			Firestorm.Element.addDelegation(window, event_name, '*', this._event_listeners[event_name]);

		} else {

			Firestorm.Element.addListener(window, event_name, this._event_listeners[event_name]);

		}

	},

	_shutdownEvent: function(event_name) {

		if ((event_name in this._dom_event_support) && this._dom_event_support[event_name].delegation) {

			Firestorm.Element.removeDelegation(window, event_name, '*', this._event_listeners[event_name]);

		} else {

			Firestorm.Element.removeListener(window, event_name, this._event_listeners[event_name]);

		}

	},

	_onDomEvent: function(event_name, event_object, freeze_protection) {

		var handlers = this._event_handlers[event_name].slice(),
			i = 0,
			count = handlers.length;

		this._is_processing_event = true;

		for (; i < count; i++) {

			handlers[i].fn.call(handlers[i].context, event_name, event_object);

		}

		this._is_processing_event = false;

		if (!freeze_protection || !Lava.ScopeManager.hasInfiniteLoop()) {

			Lava.view_manager.refresh();

		}

	},

	isProcessingEvent: function() {

		return this._is_processing_event;

	}

};

Lava.ScopeManager = {

	_scope_refresh_queues: [],
	_min_scope_refresh_level: 0,
	/**
	 * Scopes are updated from lower to higher level, from first index in array to last.
	 * Update cycle may jump to lower level, if a scope is added there during the update cycle.
	 * For each scope level this array stores the number of already updated scopes on that level.
	 * @type {Array.<number>}
	 */
	_scope_refresh_current_indices: [],

	statistics: {
		max_refresh_cycles: 0,
		count_dead_loop_exceptions: 0
	},

	_refresh_id: 0,
	_has_exceptions: false,
	_has_infinite_loop: false,

	/**
	 * @param {Lava.mixin.Refreshable} target
	 * @param {number} level
	 * @returns {{index: number}}
	 */
	scheduleScopeRefresh: function(target, level) {

		if (this._min_scope_refresh_level > level) {

			this._min_scope_refresh_level = level;

		}

		if (!(level in this._scope_refresh_queues)) {

			this._scope_refresh_queues[level] = [];

		}

		// It absolutely must be an object, but it has no methods for performance reasons - to stay as light as possible
		return {
			index: this._scope_refresh_queues[level].push(target) - 1
		}

	},

	/**
	 * @param {{index: number}} refresh_ticket
	 * @param {number} level
	 */
	cancelScopeRefresh: function(refresh_ticket, level) {

		if (Lava.schema.DEBUG && refresh_ticket == null) Lava.t();

		this._scope_refresh_queues[level][refresh_ticket.index] = undefined;

	},

	hasInfiniteLoop: function() {

		return this._has_infinite_loop;

	},

	refreshScopes: function() {

		var count_refresh_cycles = 0,
			count_levels = this._scope_refresh_queues.length;

		if (count_levels == 0) {

			return;

		}

		this._has_exceptions = false;
		this._refresh_id++;

		// find the first existent queue
		while (this._min_scope_refresh_level < count_levels) {

			if (this._min_scope_refresh_level in this._scope_refresh_queues) {

				break;

			}

			this._min_scope_refresh_level++;

		}

		if (this._min_scope_refresh_level < count_levels) {

			while (this._scopeRefreshCycle()) {

				count_refresh_cycles++;

			}

		}

		this._scopeMalfunctionCycle();

		if (this._has_exceptions) {

			this._scope_refresh_queues = this._preserveScopeRefreshQueues();

		} else {

			this._scope_refresh_queues = [];

		}

		this._scope_refresh_current_indices = [];

		if (this.statistics.max_refresh_cycles < count_refresh_cycles) {

			this.statistics.max_refresh_cycles = count_refresh_cycles;

		}

		this._has_infinite_loop = this._has_exceptions;

		Lava.schema.DEBUG && this.debugVerify();

	},

	/**
	 * Warning: violates codestyle with multiple return statements
	 * @returns {boolean} true if another cycle is needed, false when done and queue is clean
	 */
	_scopeRefreshCycle: function() {

		var current_level = this._min_scope_refresh_level,
			current_level_queue = this._scope_refresh_queues[current_level],
			queue_length = current_level_queue.length,
			count_levels,
			i = 0; // 'i' is a copy of current index, for optimizations

		if (current_level in this._scope_refresh_current_indices) {

			i = this._scope_refresh_current_indices[current_level];

		} else {

			this._scope_refresh_current_indices[current_level] = 0;

		}

		do {

			while (i < queue_length) {

				if (current_level_queue[i]) {

					if (current_level_queue[i].doRefresh(this._refresh_id)) {

						this._has_exceptions = true;
						this.statistics.count_dead_loop_exceptions++;
						Lava.logError('View Manager: infinite loop exception, interrupting');
						return false;

					}

				}

				i++;
				this._scope_refresh_current_indices[current_level] = i;

				// during the refresh cycle, additional scopes may be added to the queue, sometimes from lower levels
				if (this._min_scope_refresh_level < current_level) {

					return true;

				}

			}

			queue_length = current_level_queue.length;

		} while (i < queue_length);

		this._scope_refresh_queues[current_level] = undefined;
		this._scope_refresh_current_indices[current_level] = 0;

		count_levels = this._scope_refresh_queues.length;

		do {

			this._min_scope_refresh_level++;

			if (this._min_scope_refresh_level in this._scope_refresh_queues) {

				return true;

			}

		} while (this._min_scope_refresh_level < count_levels);

		return false;

	},

	_scopeMalfunctionCycle: function() {

		var current_level = this._min_scope_refresh_level,
			count_levels = this._scope_refresh_queues.length,
			current_queue,
			i,
			count;

		for (;current_level < count_levels; current_level++) {

			if (current_level in this._scope_refresh_queues) {

				current_queue = this._scope_refresh_queues[current_level];
				count = current_queue.length;

				if (current_level in this._scope_refresh_current_indices) {

					i = this._scope_refresh_current_indices[current_level];

				} else {

					this._scope_refresh_current_indices[current_level] = 0;
					i = 0;

				}

				while (i < count) {

					if (current_queue[i]) {

						current_queue[i].doRefresh(this._refresh_id, true);

					}

					i++;
					this._scope_refresh_current_indices[current_level] = i;

				}

			}

		}

	},

	/**
	 * In case of infinite loop exception:
	 * all existing tickets must be preserved for the next refresh cycle, otherwise the system will be broken
	 * @returns {Array}
	 */
	_preserveScopeRefreshQueues: function() {

		var new_refresh_queues = [],
			current_level = this._min_scope_refresh_level,
			count_levels = this._scope_refresh_queues.length,
			current_queue,
			i,
			count,
			new_level_queue,
			ticket;

		for (;current_level < count_levels; current_level++) {

			if (current_level in this._scope_refresh_queues) {

				current_queue = this._scope_refresh_queues[current_level];
				i = this._scope_refresh_current_indices[current_level] || 0;
				count = current_queue.length;
				new_level_queue = [];

				for (; i < count; i++) {

					if (current_queue[i]) {

						ticket = current_queue[i];
						ticket.index = new_level_queue.push(ticket) - 1;

					}

				}

				new_refresh_queues[current_level] = new_level_queue;

			}

		}

		return new_refresh_queues;

	},

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Debug-mode validations

	_debug_all_scopes: [],

	debugTrackScope: function(scope) {

		this._debug_all_scopes.push(scope);

	},

	debugStopTracking: function(scope) {

		var index = this._debug_all_scopes.indexOf(scope);
		if (index == -1) Lava.t();
		this._debug_all_scopes.splice(index, 1);

	},

	debugVerify: function() {

		try {

			for (var i = 0, count = this._debug_all_scopes.length; i < count; i++) {
				this._debug_all_scopes[i].debugAssertClean();
			}

		} catch (e) {

			Lava.logException(e);

		}

	}

};

/**
 * Stable (by definition)
 */
Lava.algorithms.sorting.mergeSort = (function(){
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

		if (_less) Lava.t("This version of mergeSort may not be called recursively");

		var length = items.length,
			result;

		if (length < 2) {

			result = items;

		} else {

			_less = less || Lava.DEFAULT_LESS;
			result = _sort(items, length);
			_less = null;

		}

		return result;

	};

})();

Lava.ClassManager = {

	/**
	 * Whether to serialize them and inline as a value, or slice() from original array in original object
	 */
	INLINE_SIMPLE_ARRAYS: true,
	/**
	 * If an array consists of these types - it can be inlined.
	 */
	SIMPLE_TYPES: ['string', 'boolean', 'number', 'null', 'undefined'],

	/**
	 * @type {Object.<string, _cClassData>}
	 */
	_sources: {},
	/**
	 * [Class path] => constructor - a function that returns a new class instance
	 * @type {Object.<string, function>}
	 */
	constructors: {},
	_reserved_members: ['Extends', 'Implements', 'Class', 'Shared'],

	_root: {},

	/**
	 * Members of the "Class" property of any class.
	 * @lends _cClassData#
	 */
	ClassData: {

		instanceOf: function(class_name) {

			return this.hierarchy_paths.indexOf(class_name) != -1;

		}

	},

	registerRootNamespace: function(name, object) {

		this._root[name] = object;

	},

	/**
	 * @param {string} class_path
	 * @returns {_cClassData}
	 */
	getClassData: function(class_path) {

		return this._sources[class_path];

	},

	define: function(class_path, source_object) {

		var name,
			class_data,
			parent_data,
			i,
			count,
			shared_names;

		class_data = /** @type {_cClassData} */ {
			name: class_path.split('.').pop(),
			path: class_path,
			source_object: source_object,
			hierarchy_index: 0,
			extends: null,
			implements: [],
			parent_class_data: null,
			hierarchy_paths: null,
			skeleton: null,
			references: [],
			shared: {},
			constructor: null,
			own_references_count: 0,
			instanceOf: this.ClassData.instanceOf
		};

		if ('Extends' in source_object) {

			if (Lava.schema.DEBUG && typeof(source_object.Extends) != 'string') Lava.t('Extends: string expected. ' + class_path);
			class_data.extends = source_object.Extends;
			parent_data = this._sources[source_object.Extends];
			class_data.parent_class_data = parent_data;

			if (!parent_data) Lava.t('[define] Base class not found: "' + source_object.Extends + '"');
			if (!parent_data.skeleton) Lava.t("[define] Parent class was loaded without skeleton, extension is not possible: " + class_data.extends);

			class_data.hierarchy_index = parent_data.hierarchy_index + 1;
			class_data.hierarchy_paths = parent_data.hierarchy_paths.slice();
			class_data.hierarchy_paths.push(class_path);
			class_data.references = parent_data.references.slice();
			class_data.own_references_count -= parent_data.references.length;
			class_data.implements = parent_data.implements.slice();

			for (name in parent_data.shared) {

				class_data.shared[name] = {};
				Firestorm.extend(class_data.shared[name], parent_data.shared[name]);

				if (name in source_object) {

					Firestorm.extend(class_data.shared[name], source_object[name]);

				}

			}

		} else {

			class_data.hierarchy_paths = [class_path];

		}

		if ('Shared' in source_object) {

			shared_names = (typeof(source_object.Shared) == 'string') ? [source_object.Shared] : source_object.Shared;

			for (i = 0, count = shared_names.length; i < count; i++) {

				name = shared_names[i];
				if (Lava.schema.DEBUG && !(name in source_object)) Lava.t("Shared member is not in class: " + name);
				if (Lava.schema.DEBUG && Firestorm.getType(source_object[name]) != 'object') Lava.t("Shared: class member must be an object");
				if (Lava.schema.DEBUG && class_data.parent_class_data && (name in class_data.parent_class_data.skeleton)) Lava.t("[ClassManager] instance member from parent class may not become shared in descendant: " + name);

				if (!(name in class_data.shared)) {

					class_data.shared[name] = {};

				}

				Firestorm.extend(class_data.shared[name], source_object[name]);

			}

		}

		class_data.skeleton = this._disassemble(class_data, source_object, class_data.hierarchy_index, true);

		if (parent_data) {

			this._extend(class_data, class_data.skeleton, parent_data, parent_data.skeleton, true);

		}

		class_data.own_references_count += class_data.references.length;

		if ('Implements' in source_object) {

			if (typeof(source_object.Implements) == 'string') {

				this._implementPath(class_data, source_object.Implements);

			} else {

				for (i = 0, count = source_object.Implements.length; i < count; i++) {

					this._implementPath(class_data, source_object.Implements[i]);

				}

			}

		}

		class_data.constructor = this._buildRealConstructor(class_data);

		this._registerClass(class_data);

	},

	/**
	 * @param {_cClassData} class_data
	 * @param {string} path
	 */
	_implementPath: function(class_data, path) {

		var implements_source = this._sources[path],
			name,
			references_offset;

		if (!implements_source) Lava.t('Implements: class not found - "' + path + '"');
		if (Lava.schema.DEBUG) {

			for (name in implements_source.shared) Lava.t("Implements: unable to use a class with Shared as mixin.");

		}

		if (Lava.schema.DEBUG && class_data.implements.indexOf(path) != -1) {

			Lava.t("Implements: class " + class_data.path + " already implements " + path);

		}

		class_data.implements.push(path);
		references_offset = class_data.references.length;
		// array copy is inexpensive, cause it contains only reference types
		class_data.references = class_data.references.concat(implements_source.references);

		this._extend(class_data, class_data.skeleton, implements_source, implements_source.skeleton, true, references_offset);

	},

	/**
	 * @param child_skeleton
	 * @param {_cClassData} child_data
	 * @param parent_skeleton
	 * @param {_cClassData} parent_data
	 * @param {boolean} is_root
	 * @param {number=} references_offset Also acts as a sign of 'implements' mode
	 */
	_extend: function (child_data, child_skeleton, parent_data, parent_skeleton, is_root, references_offset) {

		var parent_descriptor,
			name,
			new_name;

		for (name in parent_skeleton) {

			parent_descriptor = parent_skeleton[name];

			if (name in child_skeleton) {

				if (is_root && (child_skeleton[name].type == 'function' ^ parent_descriptor.type == 'function')) {
					Lava.t('Extend: functions in class root are not replaceable with other types (' + name + ')');
				}

				if (parent_descriptor.type == 'function') {

					if (!is_root || typeof(references_offset) != 'undefined') continue;

					new_name = parent_data.name + '$' + name;
					if (new_name in child_skeleton) Lava.t('[ClassManager] Assertion failed, function already exists: ' + new_name);
					child_skeleton[new_name] = parent_descriptor;

				} else if (parent_descriptor.type == 'object') {

					this._extend(child_data, child_skeleton[name].skeleton, parent_data, parent_descriptor.skeleton, false, references_offset);

				}

			} else if (parent_descriptor.type == 'object') {

				child_skeleton[name] = {type: 'object', skeleton: {}};
				this._extend(child_data, child_skeleton[name].skeleton, parent_data, parent_descriptor.skeleton, false, references_offset);

			} else if (references_offset && (parent_descriptor.type == 'function' || parent_descriptor.type == 'sliceArray')) {

				child_skeleton[name] = {type: parent_descriptor.type, index: parent_descriptor.index + references_offset};

			} else {

				child_skeleton[name] = parent_descriptor;

			}

		}

	},

	_disassemble: function(class_data, source_object, hierarchy_index, is_root) {

		var skeleton = {},
			value,
			type;

		for (var name in source_object) {

			if (is_root && (this._reserved_members.indexOf(name) != -1 || (name in class_data.shared))) {

				continue;

			}

			value = source_object[name];
			type = Firestorm.getType(value);

			switch (type) {
				case 'object':
					skeleton[name] = {
						type: 'object',
						skeleton: this._disassemble(class_data, value, hierarchy_index, false)
					};
					break;
				case 'function':
					skeleton[name] = {type: 'function', index: class_data.references.length};
					class_data.references.push(value);
					break;
				case 'array':
					if (value.length == 0) {
						skeleton[name] = {type: 'inlineArray', is_empty: true};
					} else if (this.INLINE_SIMPLE_ARRAYS && this.isInlineArray(value)) {
						skeleton[name] = {type: 'inlineArray', value: value};
					} else {
						skeleton[name] = {type: 'sliceArray', index: class_data.references.length};
						class_data.references.push(value);
					}
					break;
				case 'null':
					skeleton[name] = {type: 'null'};
					break;
				case 'undefined':
					skeleton[name] = {type: 'undefined'};
					break;
				case 'boolean':
					skeleton[name] = {type: 'boolean', value: value};
					break;
				case 'number':
					skeleton[name] = {type: 'number', value: value};
					break;
				case 'string':
					skeleton[name] = {type: 'string', value: value};
					break;
				case 'regexp':
					skeleton[name] = {type: 'regexp', value: value};
					break;
				default:
					Lava.t("[Class system] Unsupported property type in source object: " + type);
					break;

			}

		}

		return skeleton;

	},

	_buildRealConstructor: function(class_data) {

		var prototype = {},
			skeleton = class_data.skeleton,
			serialized_action,
			constructor_actions = [],
			name,
			source,
			constructor;

		for (name in skeleton) {

			serialized_action = null;

			switch (skeleton[name].type) {
				// members that should be in prototype
				case 'string':
					prototype[name] = skeleton[name].value;
					break;
				case 'null':
					prototype[name] = null;
					break;
				case 'undefined':
					prototype[name] = void 0;
					break;
				case 'boolean':
					prototype[name] = skeleton[name].value;
					break;
				case 'number':
					prototype[name] = skeleton[name].value;
					break;
				case 'function':
					prototype[name] = class_data.references[skeleton[name].index];
					break;
				case 'regexp':
					prototype[name] = skeleton[name].value;
					break;
				// members that are copied as inline property
				case 'sliceArray':
					serialized_action = 'r[' + skeleton[name].index + '].slice()';
					break;
				case 'inlineArray':
					serialized_action = skeleton[name].is_empty ? '[]' : Lava.Serializer.serialize(skeleton[name].value);
					break;
				case 'object':
					var object_properties = this._serializeSkeleton(skeleton[name].skeleton, class_data, "\t");
					serialized_action = object_properties.length
						? "{\n\t" + object_properties.join(",\n\t") + "\n}"
						: "{}";
					break;
				default:
					Lava.t("[_buildRealConstructor] unknown property descriptor type: " + skeleton[name].type);
			}

			if (serialized_action) {

				if (Lava.VALID_PROPERTY_NAME_REGEX.test(name)) {

					constructor_actions.push('this.' + name + ' = ' + serialized_action);

				} else {

					constructor_actions.push('this["' + name.replace(/\"/g, "\\\"") + '"] = ' + serialized_action);

				}

			}

		}

		for (name in class_data.shared) {

			prototype[name] = class_data.shared[name];

		}

		prototype.Class = class_data;

		source = "var r=Lava.ClassManager.getClassData('" + class_data.path + "').references;\n"
			+ constructor_actions.join(";\n")
			+ ";";

		if (class_data.skeleton.init) {

			source += "\nthis.init.apply(this, arguments);";

		}

		constructor = new Function(source);
		constructor.prototype = prototype;
		return constructor;

	},

	_serializeSkeleton: function(skeleton, class_data, padding) {

		var serialized_properties = [],
			name,
			serialized_value;

		for (name in skeleton) {

			switch (skeleton[name].type) {
				case 'string':
					serialized_value = '"' + skeleton[name].value.replace(/\"/g, "\\\"") + '"';
					break;
				case 'null':
					serialized_value = 'null';
					break;
				case 'undefined':
					serialized_value = 'undefined';
					break;
				case 'boolean':
					serialized_value = skeleton[name].value.toString();
					break;
				case 'number':
					serialized_value = skeleton[name].value.toString();
					break;
				case 'function':
					serialized_value = 'r[' + skeleton[name].index + ']';
					break;
				case 'regexp':
					serialized_value = skeleton[name].value.toString();
					break;
				case 'sliceArray':
					serialized_value = 'r[' + skeleton[name].index + '].slice()';
					break;
				case 'inlineArray':
					serialized_value = skeleton[name].is_empty ? '[]' : Lava.Serializer.serialize(skeleton[name].value);
					break;
				case 'object':
					var object_properties = this._serializeSkeleton(skeleton[name].skeleton, class_data, padding + "\t");
					serialized_value = object_properties.length
						? "{\n\t" + padding + object_properties.join(",\n\t" + padding) + "\n" + padding + "}" : "{}";
					break;
				default:
					Lava.t("[_serializeSkeleton] unknown property descriptor type: " + skeleton[name].type);
			}

			if (Lava.VALID_PROPERTY_NAME_REGEX.test(name) && Lava.JS_KEYWORDS.indexOf(name) == -1) {

				serialized_properties.push(name + ': ' + serialized_value);

			} else {

				serialized_properties.push('"' + name.replace(/\"/g, "\\\"") + '": ' + serialized_value);

			}

		}

		return serialized_properties;

	},

	_getNamespace: function(path_segments) {

		var namespace,
			segment_name,
			count = path_segments.length,
			i = 1;

		if (!count) Lava.t("ClassManager: class names must include a namespace, even for global classes.");
		if (!(path_segments[0] in this._root)) Lava.t("[ClassManager] namespace is not registered: " + path_segments[0]);
		namespace = this._root[path_segments[0]];

		for (; i < count; i++) {

			segment_name = path_segments[i];

			if (!(segment_name in namespace)) {

				namespace[segment_name] = {};

			}

			namespace = namespace[segment_name];

		}

		return namespace;

	},

	/**
	 * @param {string} class_path
	 * @param {string=} default_namespace
	 * @returns {*}
	 */
	getConstructor: function(class_path, default_namespace) {

		if (!(class_path in this.constructors) && default_namespace) {

			class_path = default_namespace + '.' + class_path;

		}

		return this.constructors[class_path];

	},

	isInlineArray: function(items) {

		var result = true,
			i = 0,
			count = items.length;

		for (; i < count; i++) {

			if (this.SIMPLE_TYPES.indexOf(Firestorm.getType(items[i])) == -1) {
				result = false;
				break;
			}

		}

		return result;

	},

	/**
	 * Register an existing function as a class constructor for usage with create().
	 * @param {string} class_path
	 * @param {function} constructor
	 */
	registerExistingConstructor: function(class_path, constructor) {

		if (class_path in this._sources) Lava.t('Class "' + class_path + '" is already defined');
		this.constructors[class_path] = constructor;

	},

	hasConstructor: function(class_path) {

		return class_path in this.constructors;

	},

	hasClass: function(class_path) {

		return class_path in this._sources;

	},

	_getPrototypeGenerator: function(class_data) {

		var skeleton = class_data.skeleton,
			name,
			serialized_value,
			serialized_properties = ['\tClass:cd'];

		for (name in skeleton) {

			switch (skeleton[name].type) {
				case 'string':
					serialized_value = '"' + skeleton[name].value.replace(/\"/g, "\\\"") + '"';
					break;
				case 'null':
					serialized_value = 'null';
					break;
				case 'undefined':
					serialized_value = 'undefined';
					break;
				case 'boolean':
					serialized_value = skeleton[name].value.toString();
					break;
				case 'number':
					serialized_value = skeleton[name].value.toString();
					break;
				case 'function':
					serialized_value = 'r[' + skeleton[name].index + ']';
					break;
				case 'regexp':
					serialized_value = skeleton[name].value.toString();
					break;
			}

			if (Lava.VALID_PROPERTY_NAME_REGEX.test(name)) {

				serialized_properties.push(name + ': ' + serialized_value);

			} else {

				serialized_properties.push('"' + name.replace(/\"/g, "\\\"") + '": ' + serialized_value);

			}

		}

		for (name in class_data.shared) {

			serialized_properties.push(name + ':s.' + name);

		}

		return new Function('cd', "var r=cd.references,s=cd.shared;\nreturn {\n" + serialized_properties.join(',\n\t') + "\n};");

	},

	exportClass: function(class_path) {

		var class_data = this._sources[class_path],
			shared = {},
			name,
			result;

		for (name in class_data.shared) {

			if (name in class_data.source_object) {

				shared[name] = class_data.source_object[name];

			}

		}

		result = {
			// string data
			name: class_data.name,
			path: class_data.path,
			hierarchy_index: class_data.hierarchy_index,
			extends: class_data.extends,
			implements: null,
			hierarchy_paths: class_data.hierarchy_paths,
			parent_class_data: null, // reserved for serialization

			prototype_generator: this._getPrototypeGenerator(class_data),
			shared: shared,
			references: null, // warning: partial array, contains only own class' members
			constructor: this.constructors[class_path],

			skeleton: class_data.skeleton, // may be deleted, if extension via define() is not needed for this class
			source_object: class_data.source_object // may be safely deleted before serialization.
		};

		if (class_data.parent_class_data) {

			// cut the parent's data and leave only child's
			result.references = class_data.references.slice(
				class_data.parent_class_data.references.length,
				class_data.parent_class_data.references.length + class_data.own_references_count
			);
			result.implements = class_data.implements.slice(class_data.parent_class_data.implements.length);

		} else {

			result.references = class_data.references.slice(0, class_data.own_references_count);
			result.implements = class_data.implements;

		}

		return result;

	},

	loadClass: function(class_data) {

		var parent_data,
			name,
			shared = class_data.shared,
			i = 0,
			count,
			own_implements = class_data.implements;

		if (class_data.extends) {

			parent_data = this._sources[class_data.extends];
			if (Lava.schema.DEBUG && !parent_data) Lava.t("[loadClass] class parent does not exists: " + class_data.extends);

			class_data.parent_class_data = parent_data;
			class_data.references = parent_data.references.concat(class_data.references);

			for (name in parent_data.shared) {

				if (!(name in shared)) {

					shared[name] = {};
					Firestorm.extend(shared[name], parent_data.shared[name]);

				} else {

					Firestorm.implement(shared[name], parent_data.shared[name]);

				}

			}

			class_data.implements = parent_data.implements.concat(class_data.implements);

		}

		for (count = own_implements.length; i < count; i++) {

			class_data.references = class_data.references.concat(this._sources[own_implements[i]].references);

		}

		class_data.constructor.prototype = class_data.prototype_generator(class_data);
		class_data.instanceOf = this.ClassData.instanceOf;

		this._registerClass(class_data);

	},

	_registerClass: function(class_data) {

		var class_path = class_data.path,
			namespace_path = class_path.split('.'),
			class_name = namespace_path.pop(),
			namespace = this._getNamespace(namespace_path);

		if (Lava.schema.DEBUG && ((class_path in this._sources) || (class_path in this.constructors))) Lava.t("Class is already defined: " + class_path);

		if ((class_name in namespace) && namespace[class_name] != null) Lava.t("Class name conflict: '" + class_path + "' property is already defined in namespace path");

		this._sources[class_path] = class_data;
		this.constructors[class_path] = class_data.constructor;
		namespace[class_name] = class_data.constructor;

	},

	getPackageConstructor: function(base_path, suffix) {

		if (Lava.schema.DEBUG && !(base_path in this._sources)) Lava.t("[getPackageConstructor] Class not found: " + base_path);

		var path,
			current_class = this._sources[base_path],
			result = null;

		do {

			path = current_class.path + suffix;
			if (path in this.constructors) {

				result = this.constructors[path];
				break;

			}

			current_class = current_class.parent_class_data;

		} while (current_class);

		return result;

	},

	getClassNames: function() {

		return Object.keys(this._sources);

	}

};

Lava.parsers.Common = {

	// same as in Firestorm.String, but without quotes and backslash.
	UNQUOTE_ESCAPE_REGEX: /[\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,

	_allowed_hash_options: ['id', 'label', 'as', 'escape_off'],
	_allowed_control_attributes: ['event', 'bind', 'style', 'classes', 'container_class', 'type', 'options', 'label', 'roles', 'resource_id', 'widget'],
	_reserved_labels: ['parent', 'widget', 'this', 'root'],
	_allowed_sugar_control_attributes: ['label', 'roles', 'resource_id'],

	locator_types: {
		'#': 'Id',
		'@': 'Label',
		'$': 'Name'
	},

	// example: @accordion.accordion_panel
	_locator_regex: /^[\$\#\@]([a-zA-Z\_][a-zA-Z0-9\_]*)\.([a-zA-Z\_][a-zA-Z0-9\_]*)/,
	_identifier_regex: /^[a-zA-Z\_][a-zA-Z0-9\_]*/,

	// overridden includes have '$' in their name.
	// Example: $tree.Tree$node
	_include_locator_regex: /^[\$\#\@]([a-zA-Z\_][a-zA-Z0-9\_]*)\.([a-zA-Z\_][\$a-zA-Z0-9\_]*)/,
	_include_identifier_regex: /^[a-zA-Z\_][\$a-zA-Z0-9\_]*/,

	_view_config_property_setters: {
		id: 'setViewConfigId',
		label: 'setViewConfigLabel'
	},

	_compile_handlers: {
		string: '_compileString',
		include: '_compileInclude',
		expression: '_compileExpression',
		directive: '_compileDirective',
		block: '_compileBlock',
		tag: '_compileTag', // plain html tag, which should be converted to string
		// depending on attributes, tag may be treated as one of the following types:
		view: '_compileView', // element with x:type='view'
		container: '_compileContainer', // element with x:type='container'
		static: '_compileStaticContainer', // element with x:type='static'
		widget: '_compileWidget', // element with x:widget='WidgetName'
		sugar: '_compileSugar' // element with it's name in schema.sugar_map
	},

	/**
	 * @param {string} string
	 * @returns {boolean}
	 */
	isLiteral: function(string) {

		return (['true','false','null','undefined'].indexOf(string.toLowerCase()) !== -1);

	},

	_viewNameToClass: function(name) {

		return Lava.schema.parsers.view_name_to_class_map[name] || name;

	},

	_parseViewHash: function(view_config, raw_hash) {

		for (var name in raw_hash) {

			if (Lava.schema.DEBUG && this._allowed_hash_options.indexOf(name) == -1) Lava.t("Hash option is not supported: " + name);
			if (name in this._view_config_property_setters) {
				this[this._view_config_property_setters[name]](view_config, raw_hash[name]);
			} else {
				view_config[name] = raw_hash[name];
			}

		}

	},

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Start: config property setters

	/**
	 * @param {_cView} view_config
	 * @param {string} id
	 */
	setViewConfigId: function(view_config, id) {

		if (Lava.schema.DEBUG && !Lava.isValidId(id)) Lava.t();
		view_config.id = id;

	},

	/**
	 * @param {_cView} view_config
	 * @param {string} label
	 */
	setViewConfigLabel: function(view_config, label) {

		if (Lava.schema.DEBUG && !Lava.VALID_LABEL_REGEX.test(label)) Lava.t("Malformed view label");
		if (Lava.schema.DEBUG && this._reserved_labels.indexOf(label) != -1) Lava.t("Label name is reserved: " + label);
		view_config.label = label;

	},

	// End: config property setters
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Start: block handlers

	/**
	 * @param {_tTemplate} result
	 * @param {_cRawDirective} directive
	 * @param {_cView} view_config
	 */
	_compileDirective: function(result, directive, view_config) {

		var directive_result = Lava.parsers.Directives.processDirective(
				directive,
				view_config,
				// code style: to ensure, that view/widget directives are at the top
				(result.length == 0 || (result.length == 1 && typeof(result[0]) == 'string' && Lava.EMPTY_REGEX.test(result[0])))
			);

		if (directive_result) {

			if (typeof(directive_result) == 'string') {

				this._compileString(result, directive_result);

			} else {

				result.push(directive_result);

			}

		}

	},

	/**
	 * @param {_tTemplate} result
	 * @param {_cInclude} include_config
	 */
	_compileInclude: function(result, include_config) {

		result.push(include_config);

	},

	/**
	 * @param {_tTemplate} result
	 * @param {string} string
	 */
	_compileString: function(result, string) {

		var lastIndex = result.length - 1,
			// lastIndex may be -1, but this will eval correctly
			append_string = typeof (result[lastIndex]) == 'string';

		if (append_string) {

			result[lastIndex] += string;

		} else {

			result.push(string);

		}

	},

	/**
	 * @param {_tTemplate} result
	 * @param {_cRawBlock} raw_block
	 */
	_compileBlock: function(result, raw_block) {

		/** @type {_cView} */
		var config = {
				type: 'view',
				class: null
			},
			i = 0,
			count;

		if (Lava.schema.parsers.PRESERVE_VIEW_NAME) {
			config.view_name = raw_block.name;
		}

		if ('arguments' in raw_block) {

			if (Lava.schema.DEBUG && raw_block.arguments.length > 1) Lava.t('Block may have no more than one argument');
			if (raw_block.arguments.length) {
				config.argument = raw_block.arguments[0];
			}

		}

		if ('class_locator' in raw_block) {
			config.class_locator = raw_block.class_locator;
			config.real_class = raw_block.real_class;
			config['class'] = Lava.schema.view.DEFAULT_CLASS_LOCATOR_GATEWAY;
		} else {
			config['class'] = this._viewNameToClass(raw_block.name);
		}

		if (raw_block.prefix == '$') {
			config.container = {class: 'Morph'};
		}

		this._parseViewHash(config, raw_block.hash); // before content, so directives could be parsed into the config

		if ('content' in raw_block) {
			config.template = this.compileTemplate(raw_block.content, config);
		} else {
			config.template = [];
		}

		if ('else_content' in raw_block) {
			config.else_template = this.compileTemplate(raw_block.else_content);
		}

		if ('elseif_arguments' in raw_block) {
			config.elseif_arguments = raw_block.elseif_arguments;
			config.elseif_templates = [];
			for (count = raw_block.elseif_contents.length; i < count; i++) {
				config.elseif_templates.push(this.compileTemplate(raw_block.elseif_contents[i]));
			}
		}

		result.push(config);

	},

	/**
	 * @param {_tTemplate} result
	 * @param {_cRawExpression} raw_expression
	 */
	_compileExpression: function(result, raw_expression) {

		if (raw_expression.arguments.length != 1) Lava.t("Expression block requires exactly one argument");

		var config = {
			type: 'view',
			class: 'Expression',
			argument: raw_expression.arguments[0]
		};

		if (raw_expression.prefix == '$') {

			config.container = {class: 'Morph'};

		}

		result.push(config);

	},

	/**
	 * Serialize the tag back into text.
	 * @param {_tTemplate} result
	 * @param {_cRawTag} tag
	 */
	_compileTag: function(result, tag) {

		var is_void = Lava.isVoidTag(tag.name),
			tag_start_text = "<" + tag.name
				+ this.renderTagAttributes(tag.attributes)
				+ (is_void ? '/>' : '>'),
			inner_template,
			count;

		this. _compileString(result, tag_start_text);

		if (Lava.schema.DEBUG && is_void && tag.content) Lava.t("Void tag with content");

		if (!is_void) {

			if (tag.content) {

				inner_template = this.compileTemplate(tag.content);
				count = inner_template.length;

				if (count && typeof (inner_template[0]) == 'string') {

					this._compileString(result, inner_template.shift());
					count--;

				}

				if (count) {

					result.splice.apply(result, [result.length, 0].concat(inner_template));

				}

			}

			this. _compileString(result, "</" + tag.name + ">");

		}

	},

	/**
	 * Tag with x:type='view'
	 * @param {_tTemplate} result
	 * @param {_cRawTag} raw_tag
	 */
	_compileView: function(result, raw_tag) {

		var view_config = {
				type: 'view',
				class: 'View',
				container: this._toContainer(raw_tag)
			},
			x = raw_tag.x;

		this._parseViewAttributes(view_config, raw_tag);

		if ('content' in raw_tag) view_config.template = this.compileTemplate(raw_tag.content, view_config);
		if ('resource_id' in x) {
			if (Lava.schema.DEBUG && (('static_styles' in view_config.container) || ('static_properties' in view_config.container) || ('static_styles' in view_config.container)))
				Lava.t("View container with resource_id: all properties must be moved to resources");
			view_config.container.resource_id = Lava.parsers.Common.parseResourceId(x.resource_id);
		}

		result.push(view_config);

	},

	/**
	 * Tag with x:type='container'
	 * @param {_tTemplate} result
	 * @param {_cRawTag} raw_tag
	 */
	_compileContainer: function(result, raw_tag) {

		var x = raw_tag.x,
			inner_template,
			view_config,
			container_config,
			container_config_directive = null,
			name;

		if (Lava.schema.DEBUG) {

			if (Lava.isVoidTag(raw_tag.name)) Lava.t("Void tag with type='container'");
			if (!raw_tag.content) Lava.t("Empty container tag");
			this._assertControlAttributesValid(x);

			if (('options' in x) || ('roles' in x) || ('label' in x)) {

				Lava.t("Please move x:options, x:roles and x:label from container element to the wrapped view");

			}

		}

		inner_template = this.asBlocks(this.compileTemplate(raw_tag.content));

		// inside there may be either a single view, or x:container_config, followed by the view
		if (inner_template.length == 1) {

			view_config = inner_template[0];

		} else if (inner_template.length == 2) {

			container_config_directive = inner_template[0];
			view_config = inner_template[1];

		} else {

			Lava.t("Malformed contents of tag with type='container'");

		}

		if (Lava.schema.DEBUG && view_config.type != 'view' && view_config.type != 'widget') Lava.t("Expected: view or widget inside container, got: " + view_config.type);
		if (Lava.schema.DEBUG && view_config.container) Lava.t("Container wraps a view with it's container already defined.");
		container_config = this._toContainer(raw_tag);
		view_config.container = container_config;

		if (container_config_directive) {
			if (Lava.schema.DEBUG && (container_config_directive.type != 'directive' || container_config_directive.name == 'container_config'))
				Lava.t("Malformed contents of tag with type='container'");
			Lava.parsers.Directives.processDirective(container_config_directive, view_config, true);
		}

		if (Lava.schema.DEBUG) {

			if ('id' in view_config) Lava.t("Please, move the id attribute from inner view's hash to wrapping container: " + view_config.id);

			if (('static_properties' in container_config) && ('property_bindings' in container_config)) {

				for (name in container_config.property_bindings) {

					if (name in container_config.static_properties)
						Lava.t("Same property can not be bound and have static value at the same time - it may result in unexpected behaviour");

				}

			}

			if (('static_styles' in container_config) && ('style_bindings' in container_config)) {

				for (name in container_config.static_styles) {

					if (name in container_config.style_bindings)
						Lava.t("Same style can not be bound and have static value at the same time - it may result in unexpected behaviour");

				}

			}

		}

		if (('attributes' in raw_tag) && ('id' in raw_tag.attributes)) view_config.id = raw_tag.attributes.id;
		if ('resource_id' in x) {
			if (Lava.schema.DEBUG && (('static_styles' in container_config) || ('static_properties' in container_config) || ('static_styles' in container_config)))
				Lava.t("Element container with resource_id: all properties must be moved to resources");
			container_config.resource_id = this.parseResourceId(x.resource_id);
		}

		result.push(view_config);

	},

	/**
	 * Tag with x:type='static'
	 * @param {_tTemplate} result
	 * @param {_cRawTag} raw_tag
	 */
	_compileStaticContainer: function(result, raw_tag) {

		var name,
			block;

		if (Lava.schema.DEBUG) {

			if (!raw_tag.x.resource_id) Lava.t("Static container requires resource id");
			for (name in raw_tag.x) {
				if (['type', 'resource_id'].indexOf(name) == -1) Lava.t("Unknown control attribute on static container: " + name);
			}

		}

		block = {
			type: 'static_tag',
			resource_id: this.parseResourceId(raw_tag.x.resource_id),
			name: raw_tag.name
		};

		if ('attributes' in raw_tag) Lava.t("Static container with resource_id: all attributes must be moved to resources");

		if (raw_tag.content) {
			block.template = this.compileTemplate(raw_tag.content);
		}

		result.push(block);

	},

	/**
	 * @param {_tTemplate} result
	 * @param {_cRawTag} raw_tag
	 */
	_compileSugar: function(result, raw_tag) {

		var schema = Lava.sugar_map[raw_tag.name],
			widget_config,
			sugar,
			result_config,
			name,
			x = raw_tag.x;

		if ('parse' in schema) {

			result_config = schema.parse(raw_tag);

		} else {

			widget_config = Lava.getWidgetConfig(schema.widget_title);
			sugar = Lava.getWidgetSugarInstance(schema.widget_title);
			result_config = this.createDefaultWidgetConfig();
			result_config.extends = schema.widget_title;
			sugar.parse(widget_config.sugar, raw_tag, result_config);

		}

		if (x) {

			if (Lava.schema.DEBUG && x) {
				for (name in x) {
					if (this._allowed_sugar_control_attributes.indexOf(name) == -1) Lava.t("Control attribute is not allowed on sugar: " + name);
				}
			}

			if ('label' in x) this.setViewConfigLabel(result_config, x.label);
			if ('roles' in x) result_config.roles = this.parseTargets(x.roles);
			if ('resource_id' in x) result_config.resource_id = this.parseResourceId(x.resource_id);

		}

		result.push(result_config);

	},

	/**
	 * Tag with x:widget='WidgetName'. Represents a widget with explicitly defined Element container.
	 *
	 * @param {_tTemplate} result
	 * @param {_cRawTag} raw_tag
	 */
	_compileWidget: function(result, raw_tag) {

		var config = this.createDefaultWidgetConfig();

		config.extends = raw_tag.x.widget;
		config.container = this._toContainer(raw_tag);

		this._parseViewAttributes(config, raw_tag);
		// Otherwise, there will be ambiguity between the target of the attribute (widget or it's container)
		// to set resource_id with x:widget - rewrite the declaration to x:type='container' with <x:widget> inside
		if (Lava.schema.DEBUG && raw_tag.x && ('resource_id' in raw_tag.x)) Lava.t("x:widget attribute is not compatible with resource_id attribute");
		if (raw_tag.content) config.template = this.compileTemplate(raw_tag.content, config);

		result.push(config);

	},

	// End: block handlers
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * @param {_cView} view_config
	 * @param {_cRawTag} raw_tag
	 */
	_parseViewAttributes: function(view_config, raw_tag) {

		var x = raw_tag.x;

		if (x) {

			if (Lava.schema.DEBUG) this._assertControlAttributesValid(x);
			if ('options' in x) {

				if (typeof(x.options) != 'object') Lava.t("Malformed x:options");
				view_config.options = x.options;

			}
			if ('label' in x) this.setViewConfigLabel(view_config, x.label);
			if ('roles' in x) view_config.roles = this.parseTargets(x.roles);

		}

		if (('attributes' in raw_tag) && ('id' in raw_tag.attributes)) this.setViewConfigId(view_config, raw_tag.attributes.id);

	},

	_assertControlAttributesValid: function(x) {

		for (var name in x) {
			if (this._allowed_control_attributes.indexOf(name) == -1) Lava.t("Unknown option in x: " + name);
		}

	},

	_toContainer: function(raw_tag) {

		var container_config = {
				class: 'Element',
				tag_name: raw_tag.name
			};

		if ('attributes' in raw_tag) this._parseContainerStaticAttributes(container_config, raw_tag.attributes);
		if ('x' in raw_tag) this._parseContainerControlAttributes(container_config, raw_tag.x);

		return container_config;

	},

	/**
	 * @param {_cElementContainer} container_config
	 * @param {_cRawX} x
	 */
	_parseContainerControlAttributes: function(container_config, x) {

		var i,
			count,
			name;

		if ('event' in x) {

			if (typeof(x.event) != 'object') Lava.t("Malformed x:event attribute");

			container_config.events = {};

			for (name in x.event) {

				container_config.events[name] = Lava.parsers.Common.parseTargets(x.event[name]);

			}

		}

		// Attribute binding. Example: x:bind:src="<any_valid_expression>"
		if ('bind' in x) {

			if (typeof(x.bind) != 'object') Lava.t("Malformed x:bind attribute");

			container_config.property_bindings = this._parseBindingsHash(x.bind);

		}

		if ('style' in x) {

			if (typeof(x.style) != 'object') Lava.t("Malformed x:style attribute");

			container_config.style_bindings = this._parseBindingsHash(x.style);

		}

		if ('classes' in x) {

			var arguments = Lava.ExpressionParser.parse(x.classes, Lava.ExpressionParser.SEPARATORS.SEMICOLON),
				class_bindings = {};

			for (i = 0, count = arguments.length; i < count; i++) {

				class_bindings[i] = arguments[i];

			}

			container_config.class_bindings = class_bindings;

		}

		if ('container_class' in x) {

			container_config['class'] = x.container_class;

		}

	},

	/**
	 * Parse object as (name => expression) pairs
	 *
	 * @param {Object.<string, string>} hash
	 * @returns {Object.<string, _cArgument>}
	 * @private
	 */
	_parseBindingsHash: function(hash) {

		if (typeof(hash) != 'object') Lava.t("Malformed control tag");

		var name,
			arguments,
			result = {};

		for (name in hash) {

			arguments = Lava.ExpressionParser.parse(hash[name]);
			if (arguments.length == 0) Lava.t("Binding: empty expression (" + name + ")");
			if (arguments.length > 1) Lava.t("Binding: malformed expression for '" + name + "'");
			result[name] = arguments[0];

		}

		return result;

	},

	/**
	 * Parse style attribute contents (plain string) into object with keys being individual style names,
	 * and values being actual style values.
	 *
	 * @param {string} styles_string
	 * @returns {Object.<string, string>}
	 */
	parseStyleAttribute: function(styles_string) {

		styles_string = styles_string.trim();

		var styles = styles_string.split(/[\;]+/),
			result = {},
			parts,
			i = 0,
			count = styles.length,
			resultCount = 0;

		if (styles_string) {

			for (; i < count; i++) {

				styles[i] = styles[i].trim();

				if (styles[i]) {

					parts = styles[i].split(':');

					if (parts.length == 2) {

						parts[0] = parts[0].trim();
						parts[1] = parts[1].trim();
						result[parts[0]] = parts[1];
						resultCount++;

					} else {

						Lava.t("Unable to parse the style attribute");

					}

				}

			}

		}

		return resultCount ? result : null;

	},

	/**
	 * Fills the following properties of the container:
	 *      static_styles
	 *      static_classes
	 *      static_properties
	 *
	 * @param {_cElementContainer} container_config
	 * @param {Object.<string, string>} raw_attributes
	 */
	_parseContainerStaticAttributes: function(container_config, raw_attributes) {

		var name,
			list,
			static_properties = {};

		for (name in raw_attributes) {

			if (name == 'style') {

				list = this.parseStyleAttribute(raw_attributes.style);

				if (list) container_config.static_styles = list;

			} else if (name == 'class') {

				container_config.static_classes = raw_attributes['class'].trim().split(/\s+/);

			} else if (name == 'id') {

				// skip, as ID is handled separately

			} else {

				static_properties[name] = raw_attributes[name];

			}

		}

		for (name in static_properties) {
			container_config.static_properties = static_properties;
			break;
		}

	},

	/**
	 * @param {_tRawTemplate} blocks
	 * @param {_cView} view_config
	 * @returns {_tTemplate}
	 */
	compileTemplate: function(blocks, view_config) {

		var current_block,
			result = [],
			type,
			i = 0,
			count = blocks.length,
			x;

		for (; i < count; i++) {

			current_block = blocks[i];
			type = (typeof(current_block) == 'string') ? 'string' : current_block.type;

			if (type == 'tag') {

				x = current_block.x;

				if (x) {

					if ('type' in x) {

						if ('widget' in x) Lava.t("Malformed tag: both x:type and x:widget present");
						type = x.type;
						if (['view', 'container', 'static'].indexOf(type) == -1) Lava.t("Unknown x:type attribute: " + type);

					} else if ('widget' in x) {

						type = 'widget';

					} else if (Lava.sugar_map[current_block.name]) {

						type = 'sugar';

					} else {

						Lava.t("Tag with control attributes and no sugar or type on it: " + current_block.name);

					}

				} else if (Lava.sugar_map[current_block.name]) {

					type = 'sugar';

				} // else type = 'tag' - default

			}

			this[this._compile_handlers[type]](result, current_block, view_config);

		}

		return result;

	},

	/**
	 * Compile template as usual and assert that it contains single view inside. Return that view.
	 *
	 * @param {_tRawTemplate} raw_blocks
	 * @returns {_cView}
	 */
	compileAsView: function(raw_blocks) {

		var result = this.asBlocks(this.compileTemplate(raw_blocks));
		if (result.length != 1) Lava.t("Expected: exactly one view, got either several or none.");
		if (result[0].type != 'view' && result[0].type != 'widget') Lava.t("Expected: view, got: " + result[0].type);
		return result[0];

	},

	/**
	 * @param {(_tRawTemplate|_tTemplate)} blocks
	 * @returns {Array}
	 */
	asBlocks: function(blocks) {

		var i = 0,
			count = blocks.length,
			result = [];

		for (; i < count; i++) {

			if (typeof(blocks[i]) == 'string') {

				if (!Lava.EMPTY_REGEX.test(blocks[i])) Lava.t("Text between tags is not allowed in this context");

			} else {

				result.push(blocks[i]);

			}

		}

		return result;

	},

	/**
	 *
	 * @param {Array} blocks
	 * @param {string} type
	 * @returns {Array}
	 */
	asBlockType: function(blocks, type) {

		var result = this.asBlocks(blocks),
			i = 0,
			count = result.length;

		for (; i < count; i++) {

			if (result[i].type != type) Lava.t("Block type is not permitted in this context. Expected: " + type + ", got: " + result[i].type);

		}

		return result;

	},

	/**
	 * Convert an object as <name,value> pairs back into plain string.
	 *
	 * @param {Object.<string,string>} attributes_object
	 * @returns {string}
	 */
	renderTagAttributes: function(attributes_object) {

		var name,
			result = '';

		for (name in attributes_object) {

			result += ' ' + name + '="' + attributes_object[name].replace(/\"/g,'\"') + '"';

		}

		return result;

	},

	/**
	 * @param {string} targets_string
	 * @returns {Array.<_cTarget>}
	 */
	parseTargets: function(targets_string) {

		var target = {},
			result = [],
			match,
			guid_match,
			config_ref,
			raw_arguments,
			i,
			count,
			flags;

		targets_string = targets_string.trim();

		if (targets_string == '') Lava.t("Code style: empty targets are not allowed");

		while (targets_string.length) {

			match = this._include_locator_regex.exec(targets_string);
			if (!match) guid_match = /^\d+$/.exec(targets_string);

			if (match) {

				target.locator_type = this.locator_types[targets_string[0]];
				target.locator = match[1];
				target.name = match[2];

			} else if (guid_match) {

				target.locator_type = 'Guid';
				target.locator = +guid_match[0];

			} else {

				match = this._include_identifier_regex.exec(targets_string);
				if (!match) Lava.t("Malformed targets (1): " + targets_string);
				target.name = match[0];

			}

			if (Lava.schema.DEBUG) {

				if ((target.locator_type == 'Id' || target.locator_type == 'Name') && !Lava.isValidId(target.locator)) Lava.t("Malformed id: " + target.locator);
				else if (target.locator_type == 'Label' && !Lava.VALID_LABEL_REGEX.test(target.locator)) Lava.t("Malformed target label" + target.locator);

			}

			targets_string = targets_string.substr(match[0].length);

			if (targets_string[0] == '(') {

				if (targets_string[1] == ')') Lava.t("Code style: empty target arguments must be removed");

				config_ref = {
					input: targets_string.substr(1),
					tail_length: 0
				};
				raw_arguments = Lava.ExpressionParser.parseWithTailRaw(config_ref, Lava.ExpressionParser.SEPARATORS.COMMA);
				target.arguments = [];

				for (i = 0, count = raw_arguments.length; i < count; i++) {

					flags = raw_arguments[i].flags;
					if (flags.isScopeEval) {

						target.arguments.push({
							type: Lava.TARGET_ARGUMENT_TYPES.BIND,
							data: raw_arguments[i].binds[0]
						});

					} else if (flags.isLiteral || flags.isNumber || flags.isString) {

						target.arguments.push({
							type: Lava.TARGET_ARGUMENT_TYPES.VALUE,
							data: Function('return ' + raw_arguments[i].evaluator_src).apply({})
						});

					} else {

						Lava.t("Expressions are not allowed for target callback arguments, only scope paths and static values");

					}

				}

				targets_string = targets_string.substr(targets_string.length - config_ref.tail_length + 2);

			}

			if (targets_string[0] == ';') {

				targets_string = targets_string.substr(1);

			} else if (targets_string.length) {

				Lava.t('Malformed targets (2): ' + targets_string);

			}

			result.push(target);

			targets_string = targets_string.trim();

		}

		return result;

	},

	/**
	 * @param {string} id_string
	 * @returns {_cResourceId}
	 */
	parseResourceId: function(id_string) {

		id_string = id_string.trim();
		var match = this._locator_regex.exec(id_string),
			result;

		if (!match) Lava.t("Malformed resource id");

		result = {
			locator_type: this.locator_types[id_string[0]],
			locator: match[1],
			name: match[2]
		};

		return result;

	},

	createDefaultWidgetConfig: function() {

		return {
			type: 'widget',
			class: Lava.schema.widget.DEFAULT_EXTENSION_GATEWAY,
			extender_type: Lava.schema.widget.DEFAULT_EXTENDER
		}

	},

	/**
	 * Assume that everything that follows a backslash is a valid escape sequence
	 * (all backslashes are prefixed with another backslash).
	 * Quotes inside string: lexer's regex will match all escaped quotes.
	 *
	 * @param {string} raw_string
	 * @returns {string}
	 */
	unquoteString: function(raw_string) {

		var map = Firestorm.String.quote_escape_map,
			result;

		try {
			result = eval("(" + raw_string.replace(this.UNQUOTE_ESCAPE_REGEX, function (a) {
				var c = map[a];
				return typeof c == 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
			}) + ")");
		} catch (e) {
			Lava.t("Malformed string: " + raw_string);
		}

		return result;

	}

};

Lava.parsers.Directives = {

	_directives_schema: {
		define: {view_config_presence: false},
		widget: {},
		assign: {view_config_presence: true, is_top_directive: true},
		roles: {view_config_presence: true, is_top_directive: true},
		container_config: {view_config_presence: true, is_top_directive: true},
		refresher: {view_config_presence: true, is_top_directive: true},
		option: {view_config_presence: true, is_top_directive: true},
		options: {view_config_presence: true, is_top_directive: true},
		// Widget-only directives
		broadcast: {view_config_presence: true, is_top_directive: true},
		bind: {view_config_presence: true, is_top_directive: true},
		property: {view_config_presence: true, is_top_directive: true},
		properties: {view_config_presence: true, is_top_directive: true},
		property_string: {view_config_presence: true, is_top_directive: true},
		resources: {view_config_presence: true, is_top_directive: true},
		define_resources: {view_config_presence: false},
		static_value: {},
		static_eval: {},
		attach_directives: {},
		default_events: {view_config_presence: true, is_top_directive: true}
	},

	_widget_role_actions: {
		main: '_widgetRoleMain',
		//storage: '_widgetRoleStorage',
		include: '_widgetRoleInclude'
	},

	_widget_tag_actions: {
		bind: '_widgetTagBind',
		assign: '_widgetTagAssign',
		option: '_widgetTagOption',
		property: '_widgetTagProperty',
		options: '_widgetTagOptions',
		properties: '_widgetTagProperties',
		roles: '_widgetTagRoles',
		sugar: '_widgetTagSugar',
		broadcast: '_widgetTagBroadcast',
		storage: '_widgetTagStorage',
		resources: '_widgetTagResources',
		default_events: '_widgetTagDefaultEvents'
	},

	_resource_tag_actions: {
		string: '_resourceTagString',
		number: '_resourceTagNumber',
		boolean: '_resourceTagBoolean',
		array: '_resourceTagArray',
		container: '_resourceTagContainer',
		translate: '_resourceTagTranslate',
		ntranslate: '_resourceTagTranslatePlural'
	},

	RESOURCE_ARRAY_ALLOWED_TYPES: ['string', 'boolean', 'null', 'number'],

	/**
	 * To prevent nested defines
	 */
	_is_processing_define: false,
	_current_widget_title: null, // the title of the widget in x:define directive, which is currently being processed

	/**
	 * @param {_cRawDirective} raw_directive
	 * @param {(_cView|_cWidget)} view_config
	 * @param {boolean} is_top_directive
	 * @returns {*}
	 */
	processDirective: function(raw_directive, view_config, is_top_directive) {

		var directive_name = raw_directive.name,
			config = this._directives_schema[directive_name];

		if (!config) Lava.t("Unknown directive: " + directive_name);

		if (config.view_config_presence) {
			if (view_config && !config.view_config_presence) Lava.t('Directive must not be inside view definition: ' + directive_name);
			if (!view_config && config.view_config_presence) Lava.t('Directive must be inside view definition: ' + directive_name);
		}

		if (config.is_top_directive && !is_top_directive) Lava.t("Directive must be at the top of the block content: " + directive_name);

		return this['_x' + directive_name](raw_directive, view_config);

	},

	_store: function(widget_config, storage_name, item_name, value) {

		if (!(storage_name in widget_config)) widget_config[storage_name] = {};
		if (Lava.schema.DEBUG && (item_name in widget_config[storage_name])) Lava.t("Duplicate item in '" + storage_name + "': " + item_name);
		widget_config[storage_name][item_name] = value;

	},

	////////////////////////////////////////////////////////////////////
	// start: actions for widget tags and tag roles

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} config_storage
	 * @param {Object} roles_storage
	 */
	_widgetRoleMain: function(raw_tag, config_storage, roles_storage) {

		if ('widget_config' in roles_storage) Lava.t("multiple tags with role=main in widget definition");

		var view_config,
			name,
			widget_config = Lava.parsers.Common.createDefaultWidgetConfig();

		if (raw_tag.name == 'template') {

			widget_config.template = Lava.parsers.Common.compileTemplate(raw_tag.content);

		} else if (raw_tag.name == 'view') {

			view_config = Lava.parsers.Common.compileAsView(raw_tag.content);
			if (view_config['class'] != 'View') Lava.t("define: view in 'main' role must be pure View, not subclass");
			if ('argument' in view_config) Lava.t("Widgets do not support arguments");
			if ('roles' in view_config) Lava.t("Widget definition: move the roles from main view to widget");

			widget_config.template = view_config.template;

			if ('container' in view_config) widget_config.container = view_config.container;
			if ('assigns' in view_config) widget_config.assigns = view_config.assigns;
			if ('options' in view_config) widget_config.options = view_config.options;

			if (Lava.schema.DEBUG) {
				for (name in view_config) {
					if (['assigns', 'options', 'class', 'type', 'template', 'container'].indexOf(name) == -1) {
						Lava.t("[role='main'] view has an option, which can not be copied to widget: " + name
							+ ". Probably, it must be specified via separate tag");
					}
				}
			}

		} else {

			Lava.t("Widget definition: role=main may be applied to templates and views only");

		}

		roles_storage.widget_config = widget_config;

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} config_storage
	 * @param {Object} roles_storage
	 */
	_widgetRoleInclude: function(raw_tag, config_storage, roles_storage) {

		var include;

		switch (raw_tag.name) {
			case 'template':
				include = raw_tag.content ? Lava.parsers.Common.compileTemplate(raw_tag.content) : [];
				break;
			case 'view':
				include = [Lava.parsers.Common.compileAsView(raw_tag.content)];
				break;
			default:
				Lava.t("Only templates and views may have role=include");
		}

		this._store(config_storage, 'includes', raw_tag.attributes.name, include);

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} config_storage
	 * @param {Object} roles_storage
	 */
	_widgetTagBind: function(raw_tag, config_storage, roles_storage) {

		this._parseBinding(config_storage, raw_tag);

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} config_storage
	 * @param {Object} roles_storage
	 */
	_widgetTagAssign: function(raw_tag, config_storage, roles_storage) {

		this._parseAssign(roles_storage, raw_tag);

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} config_storage
	 * @param {Object} roles_storage
	 */
	_widgetTagOption: function(raw_tag, config_storage, roles_storage) {

		this._parseOption(roles_storage, raw_tag, 'options');

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} config_storage
	 * @param {Object} roles_storage
	 */
	_widgetTagProperty: function(raw_tag, config_storage, roles_storage) {

		this._parseProperty(config_storage, raw_tag, 'properties');

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} config_storage
	 * @param {Object} roles_storage
	 */
	_widgetTagOptions: function(raw_tag, config_storage, roles_storage) {

		this._parseObject(config_storage, 'options', raw_tag);

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} config_storage
	 * @param {Object} roles_storage
	 */
	_widgetTagProperties: function(raw_tag, config_storage, roles_storage) {

		this._parseObject(config_storage, 'properties', raw_tag);

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} config_storage
	 * @param {Object} roles_storage
	 */
	_widgetTagRoles: function(raw_tag, config_storage, roles_storage) {

		this._parseRoles(roles_storage, raw_tag);

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} config_storage
	 * @param {Object} roles_storage
	 */
	_widgetTagSugar: function(raw_tag, config_storage, roles_storage) {

		if ('sugar' in config_storage) Lava.t("Sugar is already defined");
		if (Lava.schema.DEBUG && raw_tag.content.length != 1) Lava.t("Malformed option: " + raw_tag.attributes.name);
		config_storage.sugar = Lava.parseOptions(raw_tag.content[0]);

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} config_storage
	 * @param {Object} roles_storage
	 */
	_widgetTagBroadcast: function(raw_tag, config_storage, roles_storage) {

		this._parseBroadcast(config_storage, raw_tag);

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} config_storage
	 * @param {Object} roles_storage
	 */
	_widgetTagStorage: function(raw_tag, config_storage, roles_storage) {

		var tags = Lava.parsers.Common.asBlockType(raw_tag.content, 'tag'),
			i = 0,
			count = tags.length,
			tag,
			type,
			schema,
			inner_tags,
			name,
			parse_target;

		for (; i < count; i++) {

			tag = tags[i];

			if (Lava.schema.DEBUG) {
				if (!tag.attributes || !tag.attributes.name) Lava.t("<" + "storage>: tag without a name attribute");
				if (config_storage.storage && (tag.attributes.name in config_storage.storage)) Lava.t("Duplicate item in storage: " + tag.attributes.name);
			}

			type = tag.name;
			schema = {};
			name = tag.attributes['name'];

			if (type == 'template_collection' || type == 'template_hash') {

				schema = {type: type, tag_name: 'template', name: name};
				parse_target = tag;

			} else if (type == 'object' || type == 'object_collection' || type == 'object_hash') {

				inner_tags = Lava.parsers.Common.asBlockType(tag.content, 'tag');
				if (Lava.schema.DEBUG && (inner_tags.length != 2 || !inner_tags[0].content || !inner_tags[1].content)) Lava.t("storage: malformed tag");
				if (Lava.schema.DEBUG && (inner_tags[0].name != 'schema' || inner_tags[1].name != 'content')) Lava.t("storage: malformed tag");
				schema = Lava.parseOptions(inner_tags[0].content[0]);
				if (Lava.schema.DEBUG && (('name' in schema) || ('type' in schema))) Lava.t("storage tag schema: 'name' and 'type' are not allowed");
				schema.name = name;
				schema.type = type;

				parse_target = inner_tags[1];

			} else {

				Lava.t("Unknown storage tag: " + type);

			}

			Lava.getSugarInstance(Lava.schema.widget.DEFAULT_SUGAR_CLASS).parseStorageTag(schema, parse_target, config_storage);

		}

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} config_storage
	 * @param {Object} roles_storage
	 */
	_widgetTagDefaultEvents: function(raw_tag, config_storage, roles_storage) {

		this._parseDefaultEvents(raw_tag, config_storage);

	},

	/**
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} config_storage
	 * @param {Object} roles_storage
	 */
	_widgetTagResources: function(raw_tag, config_storage, roles_storage) {

		this._xresources(raw_tag, config_storage);

	},

	// end: actions for widget tags and tag roles
	////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////
	// Start: resource tags

	_parseResources: function(raw_tag, widget_title) {

		var tags = Lava.parsers.Common.asBlockType(raw_tag.content, 'tag'),
			i = 0,
			count = tags.length,
			resources = {},
			tag,
			value;

		if (Lava.schema.DEBUG && count == 0) Lava.t("Empty resources definition");

		for (; i < count; i++) {

			tag = tags[i];
			if (Lava.schema.DEBUG && (!tag.attributes || !tag.attributes.path)) Lava.t("resources, tag is missing attributes: " + tag.name);
			if (Lava.schema.DEBUG && !(tag.name in this._resource_tag_actions)) Lava.t("resources, unknown tag: " + tag.name);
			value = this[this._resource_tag_actions[tag.name]](tag);
			if (Lava.schema.parsers.EXPORT_STRINGS && (value.type == 'translate' || value.type == 'ntranslate')) {
				Lava.resources.exportTranslatableString(value, widget_title, raw_tag.attributes.locale, tag.attributes.path);
			}
			Lava.resources.putResourceValue(resources, tag.attributes.path, value);

		}

		return resources;

	},

	/**
	 * @param {_cRawTag} raw_tag
	 */
	_resourceTagString: function(raw_tag) {

		var value = '';

		if (raw_tag.content) {

			if (Lava.schema.DEBUG && raw_tag.content.length != 1) Lava.t("Malformed resources string tag");
			value = raw_tag.content[0];

		}

		return {
			type: 'string',
			value: value
		};

	},

	/**
	 * @param {_cRawTag} raw_tag
	 */
	_resourceTagNumber: function(raw_tag) {

		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1 || raw_tag.content[0] == '')) Lava.t("Malformed resources tag");

		return {
			type: 'number',
			value: +raw_tag.content[0]
		};

	},

	/**
	 * @param {_cRawTag} raw_tag
	 */
	_resourceTagBoolean: function(raw_tag) {

		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1 || raw_tag.content[0] == '')) Lava.t("Malformed resources tag");

		return {
			type: 'boolean',
			value: Lava.types.Boolean.fromString(raw_tag.content[0])
		};

	},

	/**
	 * @param {_cRawTag} raw_tag
	 */
	_resourceTagArray: function(raw_tag) {

		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1 || raw_tag.content[0] == '')) Lava.t("Malformed resources tag");

		var value = Lava.parseOptions(raw_tag.content[0]),
			i,
			count;

		if (Lava.schema.DEBUG) {
			if (!Array.isArray(value)) Lava.t("Malformed resources array tag content");
			for (i = 0, count = value.length; i < count; i++) {
				if (this.RESOURCE_ARRAY_ALLOWED_TYPES.indexOf(Lava.getType(value[i])) == -1) Lava.t("resources/array contains value type that is not allowed: " + Lava.getType(value[i]));
			}
		}

		return {
			type: 'array',
			value: value
		};

	},

	/**
	 * @param {_cRawTag} raw_tag
	 */
	_resourceTagTranslate: function(raw_tag) {

		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1 || raw_tag.content[0] == '')) Lava.t("Malformed resources tag");

		var result = {
			type: 'translate',
			value: raw_tag.content[0]
		};

		if (raw_tag.attributes.description) result.description = raw_tag.attributes.description;
		if (raw_tag.attributes.context) result.context = raw_tag.attributes.context;

		return result;

	},

	/**
	 * @param {_cRawTag} raw_tag
	 */
	_resourceTagTranslatePlural: function(raw_tag) {

		if (Lava.schema.DEBUG && (!raw_tag.content)) Lava.t("Malformed resources tag");

		var plural_tags = Lava.parsers.Common.asBlockType(raw_tag.content, 'tag'),
			i = 0,
			count = plural_tags.length,
			plurals = [],
			result;

		if (Lava.schema.DEBUG && count == 0) Lava.t("Malformed resources plural string definition");

		for (; i < count; i++) {

			if (Lava.schema.DEBUG && (!plural_tags[i].content || !plural_tags[i].content[0])) Lava.t("Resources, malformed plural string");
			plurals.push(plural_tags[i].content[0]);

		}

		result = {
			type: 'ntranslate',
			value: plurals
		};

		if (raw_tag.attributes.description) result.description = raw_tag.attributes.description;
		if (raw_tag.attributes.context) result.context = raw_tag.attributes.context;

		return result;

	},

	/**
	 * @param {_cRawTag} raw_tag
	 */
	_resourceTagContainer: function(raw_tag) {

		var tags = raw_tag.content ? Lava.parsers.Common.asBlockType(raw_tag.content, 'tag') : [],
			count = tags.length,
			result = {
				type: 'container_stack',
				value: []
			},
			operations_stack = result.value,
			operation_value,
			used_instructions = {},
			name;

		if (count) {

			if (Lava.schema.DEBUG) {
				if (count > 1) Lava.t("Malformed resources/container definition");
				if (tags[0].name != 'static_properties' && tags[0].name != 'add_properties') Lava.t("Malformed resources/container definition");
				if (!tags[0].attributes || tags[0].content) Lava.t("resources/container: malformed (static/add)_properties tag");
				if (('class' in tags[0].attributes) || ('style' in tags[0].attributes)) Lava.t("resources/container: class and style attributes must be defined separately from properties");
			}

			operations_stack.push({
				name: tags[0].name,
				value: tags[0].attributes
			});
			used_instructions[tags[0].name] = true;

		}

		for (name in raw_tag.attributes) {

			switch (name) {
				case 'remove_classes':
				case 'remove_properties':
				case 'remove_styles':
					if (Lava.schema.DEBUG && !raw_tag.attributes[name].trim()) Lava.t("Codestyle: remove the empty remove_* attributes from resources/container tag");
					operation_value = raw_tag.attributes[name].trim().split(/\s*,\s*/);
					break;
				case 'add_classes':
				case 'static_classes':
					if (Lava.schema.DEBUG && name == 'add_classes' && !raw_tag.attributes[name].trim()) Lava.t("Codestyle: remove the empty add_classes attribute from resources/container tag");
					operation_value = raw_tag.attributes[name].trim().split(/\s+/);
					break;
				case 'add_styles':
				case 'static_styles':
					if (Lava.schema.DEBUG && name == 'add_styles' && !raw_tag.attributes[name].trim()) Lava.t("Codestyle: remove the empty style attribute from resources/container tag");
					operation_value = Lava.parsers.Common.parseStyleAttribute(raw_tag.attributes[name]);
					break;
				case 'path': // the path and name of the resource
					operation_value = null;
					break;
				default:
					Lava.t("Unknown resources/container attribute:" + name);
			}

			if (operation_value) {
				operations_stack.push({
					name: name,
					value: operation_value
				});
				used_instructions[name] = true;
			}

		}

		if (Lava.schema.DEBUG) {

			if (
				('static_styles' in used_instructions && (('add_styles' in used_instructions) || ('remove_styles' in used_instructions)))
				|| ('static_classes' in used_instructions && (('add_classes' in used_instructions) || ('remove_classes' in used_instructions)))
				|| ('static_properties' in used_instructions && (('add_properties' in used_instructions) || ('remove_properties' in used_instructions)))
			)
				Lava.t("resources/container: having add/remove instructions together with 'set' instruction has no sense");

			if (operations_stack.length == 0) Lava.t("Empty resources/container definition");

		}

		return result;

	},

	// End: resource tags
	////////////////////////////////////////////////////////////////////

	/**
	 * @param {_cRawDirective} raw_directive
	 * @returns {_cWidget}
	 */
	_parseWidgetDefinition: function(raw_directive) {

		if (Lava.schema.DEBUG && !('attributes' in raw_directive)) Lava.t("Widget definition is missing attributes");

		var tags = raw_directive.content ? Lava.parsers.Common.asBlockType(raw_directive.content, 'tag') : [],
			config_storage = {},
			roles_storage = {},
			widget_config,
			i = 0,
			count = tags.length,
			tag,
			name,
			path;

		for (; i < count; i++) {

			tag = tags[i];

			if (('attributes' in tag) && tag.attributes.role) {

				if (!(tag.attributes.role in this._widget_role_actions)) Lava.t("Unknown role in widget definition: " + tag.attributes.role);
				this[this._widget_role_actions[tag.attributes.role]](tag, config_storage, roles_storage);

			} else {

				if (!(tag.name in this._widget_tag_actions)) Lava.t("Unknown tag in widget definition: " + tag.name + ". Maybe missing the 'role' attribute.");
				this[this._widget_tag_actions[tag.name]](tag, config_storage, roles_storage);

			}

		}

		if ('widget_config' in roles_storage) {

			widget_config = roles_storage.widget_config;
			Firestorm.extend(widget_config, config_storage);

		} else {

			widget_config = config_storage;

		}

		if ('roles' in roles_storage) widget_config.roles = roles_storage.roles;
		if (raw_directive.attributes.controller) {

			path = raw_directive.attributes.controller;
			// example: "$widgetname/ClassName1/ClassName2"
			if (path[0] in Lava.parsers.Common.locator_types) {

				i = path.indexOf('/');
				if (Lava.schema.DEBUG && i == -1) Lava.t("Malformed class name locator: " + path);
				name = path.substr(0, i); // cut the locator part, "$widgetname"
				widget_config.real_class = path.substr(i); // leave the name part: "/ClassName1/ClassName2"
				widget_config.class_locator = {locator_type: Lava.parsers.Common.locator_types[name[0]], name: name.substr(1)};
				if (Lava.schema.DEBUG && (!widget_config.class_locator.name || !widget_config.class_locator.locator_type)) Lava.t("Malformed class name locator: " + path);

			} else {

				widget_config.real_class = raw_directive.attributes.controller;

			}

		}

		if (raw_directive.attributes.extends) widget_config.extends = raw_directive.attributes.extends;
		if (raw_directive.attributes.label) Lava.parsers.Common.setViewConfigLabel(widget_config, raw_directive.attributes.label);

		if (raw_directive.attributes.id) {
			if (Lava.schema.DEBUG && widget_config.id) Lava.t("[Widget configuration] widget id was already set via main view configuration: " + raw_directive.attributes.id);
			Lava.parsers.Common.setViewConfigId(widget_config, raw_directive.attributes.id);
		}

		if ('options' in roles_storage) {

			if ('options' in widget_config) {

				for (name in roles_storage.options) {

					if (name in widget_config.options) Lava.t("Duplicate option: " + name);
					widget_config.options[name] = roles_storage.options[name];

				}

			} else {

				widget_config.options = roles_storage.options;

			}

		}

		if ('assigns' in roles_storage) {
			if ('assigns' in widget_config) Lava.t("Please, move assigns to one place: either to widget tag, or view directives");
			widget_config.assigns = roles_storage.assigns;
		}

		if (!widget_config['class']) widget_config['class'] = Lava.schema.widget.DEFAULT_EXTENSION_GATEWAY;
		if (!widget_config.extender_type) widget_config.extender_type = Lava.schema.widget.DEFAULT_EXTENDER;

		return widget_config;

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 * @returns {_cWidget}
	 */
	_parseWidgetDefinitionWrapper: function(raw_directive) {

		if (this._is_processing_define) Lava.t("Nested defines are not allowed");
		this._is_processing_define = true;
		var result;

		// need to ensure that _is_processing_define flag stays off,
		// cause in case of exception, parser will be left in unusable state
		try {

			result = this._parseWidgetDefinition(raw_directive);

		} finally {

			this._is_processing_define = false;

		}

		return result;

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 */
	_xdefine: function(raw_directive) {

		if (Lava.schema.DEBUG && (!raw_directive.attributes || !raw_directive.attributes.title)) Lava.t("define: missing 'title' attribute");
		if (Lava.schema.DEBUG && raw_directive.attributes.title.indexOf(' ') != -1) Lava.t("Widget title must not contain spaces");
		if (Lava.schema.DEBUG && ('resource_id' in raw_directive.attributes)) Lava.t("resource_id is not allowed on define");

		this._current_widget_title = raw_directive.attributes.title;
		var widget_config = this._parseWidgetDefinitionWrapper(raw_directive);
		this._current_widget_title = null;
		widget_config.is_extended = false; // reserve it for serialization

		if (Lava.schema.DEBUG && ('class_locator' in widget_config)) Lava.t("Dynamic class names are allowed only in inline widgets, not in x:define");

		Lava.storeWidgetSchema(raw_directive.attributes.title, widget_config);

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 */
	_xwidget: function(raw_directive) {

		var widget_config = this._parseWidgetDefinition(raw_directive);

		if (Lava.schema.DEBUG && !widget_config['class'] && !widget_config.extends) Lava.t("x:define: widget definition is missing either 'controller' or 'extends' attribute");
		if (raw_directive.attributes.resource_id) widget_config.resource_id = Lava.parsers.Common.parseResourceId(raw_directive.attributes.resource_id);

		widget_config.type = 'widget';
		return widget_config;

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 * @param {_cView} view_config
	 */
	_xassign: function(raw_directive, view_config) {

		this._parseAssign(view_config, raw_directive);

	},

	/**
	 * @param {Object} storage
	 * @param {(_cRawDirective|_cRawTag)} raw_tag
	 */
	_parseAssign: function(storage, raw_tag) {

		if (!('assigns' in storage)) storage.assigns = {};

		if (Lava.schema.DEBUG && !('attributes' in raw_tag)) Lava.t("assign: missing attributes");
		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1)) Lava.t("Malformed assign");
		if (raw_tag.attributes.name in storage.assigns) Lava.t("Duplicate assign: " + raw_tag.attributes.name);

		var arguments = Lava.ExpressionParser.parse(raw_tag.content[0]);
		if (Lava.schema.DEBUG && arguments.length != 1) Lava.t("Expression block requires exactly one argument");

		if (raw_tag.attributes.once && Lava.types.Boolean.fromString(raw_tag.attributes.once)) {

			arguments[0].once = true;

		}

		storage.assigns[raw_tag.attributes.name] = arguments[0];

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 * @param {_cView} view_config
	 */
	_xoption: function(raw_directive, view_config) {

		this._parseOption(view_config, raw_directive, 'options');

	},

	/**
	 * @param {Object} storage
	 * @param {(_cRawDirective|_cRawTag)} raw_tag
	 * @param {string} storage_property_name
	 */
	_parseOption: function(storage, raw_tag, storage_property_name) {

		if (Lava.schema.DEBUG && !('attributes' in raw_tag)) Lava.t("option: missing attributes");
		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1)) Lava.t("Malformed option: " + raw_tag.attributes.name);

		var option_type = raw_tag.attributes.type,
			result;

		if (option_type) {

			if (option_type == 'targets') {

				result = Lava.parsers.Common.parseTargets(raw_tag.content[0]);

			} else if (option_type == 'expression') {

				result = Lava.ExpressionParser.parse(raw_tag.content[0], Lava.ExpressionParser.SEPARATORS.SEMICOLON);

			} else {

				Lava.t("Unknown option type: " + option_type);

			}

		} else {

			result = Lava.parseOptions(raw_tag.content[0]);

		}

		this._store(storage, storage_property_name, raw_tag.attributes.name, result);

	},

	/**
	 * @param {Object} storage
	 * @param {(_cRawDirective|_cRawTag)} raw_tag
	 * @param {string} storage_property_name
	 */
	_parseProperty: function(storage, raw_tag, storage_property_name) {

		if (Lava.schema.DEBUG && !('attributes' in raw_tag)) Lava.t("option: missing attributes");
		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1)) Lava.t("Malformed option: " + raw_tag.attributes.name);
		this._store(storage, storage_property_name, raw_tag.attributes.name, Lava.parseOptions(raw_tag.content[0]));

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 * @param {_cView} view_config
	 */
	_xroles: function(raw_directive, view_config) {

		this._parseRoles(view_config, raw_directive);

	},

	_parseRoles: function(storage, raw_tag) {

		if ('roles' in storage) Lava.t("Roles are already defined");
		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1)) Lava.t("Malformed roles tag/directive");
		storage.roles = Lava.parsers.Common.parseTargets(raw_tag.content[0]);

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 * @param {_cView} view_config
	 */
	_xcontainer_config: function(raw_directive, view_config) {

		if (Lava.schema.DEBUG && (!raw_directive.content || raw_directive.content.length == 0)) Lava.t("Malformed container_config directive: content is missing");
		if (Lava.schema.DEBUG && !view_config.container) Lava.t("Trying to change container settings for container-less view. Please, change the view opening tag (# => $) or move the directive into wrapping container.");

		var original_config = view_config.container,
			config = Lava.parseOptions(raw_directive.content[0]),
			name;

		if (Lava.schema.DEBUG) {
			for (name in config) {
				if (['class', 'options'].indexOf(name) == -1) Lava.t('[_xcontainer_config] setting config property is not allowed: ' + name);
			}
		}

		if ('class' in config) original_config['class'] = config['class'];
		if ('options' in config) {
			if (!('options' in original_config)) original_config.options = {};
			Firestorm.extend(original_config.options, config.options);
		}

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 * @param {_cView} view_config
	 */
	_xrefresher: function(raw_directive, view_config) {

		if (Lava.schema.DEBUG && view_config.type == 'widget') Lava.t("Wrong usage of x:refresher directive. May be applied only to views.");
		if (Lava.schema.DEBUG && ('refresher' in view_config)) Lava.t("Refresher is already defined");
		if (Lava.schema.DEBUG && (!raw_directive.content || raw_directive.content.length != 1)) Lava.t("Malformed refresher config");
		view_config.refresher = Lava.parseOptions(raw_directive.content[0]);

	},

	/**
	 * @param {_cWidget} widget_config
	 * @param {(_cRawDirective|_cRawTag)} raw_element
	 */
	_parseBroadcast: function(widget_config, raw_element) {

		if ('broadcast' in widget_config) Lava.t("Broadcast is already defined");

		var result = {},
			name;

		for (name in raw_element.attributes) {

			result[name] = Lava.parsers.Common.parseTargets(raw_element.attributes[name]);

		}

		widget_config.broadcast = result;

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xbroadcast: function(raw_directive, widget_config) {

		if (Lava.schema.DEBUG && widget_config.type != 'widget') Lava.t("Broadcast directive requires a widget");

		this._parseBroadcast(widget_config, raw_directive);

	},

	/**
	 * @param {_cWidget} widget_config
	 * @param {(_cRawDirective|_cRawTag)} raw_element
	 */
	_parseBinding: function(widget_config, raw_element) {

		if (raw_element.content.length != 1) Lava.t("Malformed binding in widget definition: " + raw_element.attributes.name);

		var binding = {
			property_name: raw_element.attributes.name,
			path_config: Lava.ExpressionParser.parsePath(raw_element.content[0])
		};
		if ('direction' in raw_element.attributes) {
			if (!(raw_element.attributes.direction in Lava.BINDING_DIRECTIONS))
				Lava.t("Unknown binding direction: " + raw_element.attributes.direction);
			binding.direction = Lava.BINDING_DIRECTIONS[raw_element.attributes.direction];
		}
		this._store(widget_config, 'bindings', raw_element.attributes.name, binding);

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xbind: function(raw_directive, widget_config) {

		if (Lava.schema.DEBUG && widget_config.type != 'widget') Lava.t("Binding directive requires a widget");
		this._parseBinding(widget_config, raw_directive);

	},

	/**
	 * @param {(_cView|_cWidget)} config
	 * @param {string} name
	 * @param {_cRawDirective} raw_tag
	 */
	_parseObject: function(config, name, raw_tag) {

		if (Lava.schema.DEBUG && (name in config)) Lava.t("Object already exists: " + name + ". Ensure, that x:options and x:properties directives appear before x:option and x:property.");
		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1)) Lava.t("Malformed directive or tag for config property: " + name);
		config[name] = Lava.parseOptions(raw_tag.content[0]);

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 * @param {(_cView|_cWidget)} config
	 */
	_xoptions: function(raw_directive, config) {

		this._parseObject(config, 'options', raw_directive);

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xproperty: function(raw_directive, widget_config) {

		if (Lava.schema.DEBUG && widget_config.type != 'widget') Lava.t("Property directive requires a widget");

		this._parseProperty(widget_config, raw_directive, 'properties');

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xproperties: function(raw_directive, widget_config) {

		if (Lava.schema.DEBUG && widget_config.type != 'widget') Lava.t("Property directive requires a widget");

		this._parseObject(widget_config, 'properties', raw_directive);

	},

	_storeDirectiveContent: function(widget_config, raw_directive, storage_name) {

		if (Lava.schema.DEBUG && !('attributes' in raw_directive)) Lava.t("option: missing attributes");
		if (Lava.schema.DEBUG && (!raw_directive.content || raw_directive.content.length != 1)) Lava.t("Malformed property: " + raw_directive.attributes.name);
		this._store(widget_config, storage_name, raw_directive.attributes.name, raw_directive.content[0]);

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xproperty_string: function(raw_directive, widget_config) {

		if (Lava.schema.DEBUG && widget_config.type != 'widget') Lava.t("property_string directive requires a widget");

		this._storeDirectiveContent(widget_config, raw_directive, 'properties');

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xoption_string: function(raw_directive, widget_config) {

		this._storeDirectiveContent(widget_config, raw_directive, 'options');

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 */
	_xdefine_resources: function(raw_directive) {

		if (Lava.schema.DEBUG && (!raw_directive.attributes || !raw_directive.attributes['locale'] || !raw_directive.attributes['for']))
			Lava.t("Malformed x:resources definition. 'locale' and 'for' are required");

		Lava.resources.addWidgetResource(
			raw_directive.attributes['for'],
			raw_directive.attributes['locale'],
			this._parseResources(raw_directive, raw_directive.attributes['for'])
		);

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xresources: function(raw_directive, widget_config) {

		if (Lava.schema.DEBUG && (!raw_directive.attributes || !raw_directive.attributes['locale'])) Lava.t("Malformed resources definition, missing locale");

		if (!widget_config.resources) {
			widget_config.resources = {}
		}

		if (Lava.schema.DEBUG && (raw_directive.attributes['locale'] in widget_config.resources))
			Lava.t("Locale is already defined: " + raw_directive.attributes['locale']);

		widget_config.resources[raw_directive.attributes['locale']] = this._parseResources(raw_directive, this._current_widget_title);

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 */
	_xstatic_value: function(raw_directive) {

		if (Lava.schema.DEBUG && (raw_directive.content || !raw_directive.attributes || !raw_directive.attributes.resource_id))
			Lava.t('Malformed static_value directive');

		return {
			type: 'static_value',
			resource_id: Lava.parsers.Common.parseResourceId(raw_directive.attributes.resource_id)
		}

	},

	/**
	 * Caution! Inner argument should depend only on static data.
	 * Bindings are allowed, but not recommended, cause at the moment when template is rendered - they may be dirty.
	 *
	 * @param {_cRawDirective} raw_directive
	 */
	_xstatic_eval: function(raw_directive) {

		if (Lava.schema.DEBUG && (!raw_directive.content || raw_directive.content.length != 1))
			Lava.t('Malformed static_eval directive');

		var arguments = Lava.ExpressionParser.parse(raw_directive.content[0]);

		if (Lava.schema.DEBUG && arguments.length == 0) Lava.t("static_eval: malformed argument");

		return {
			type: 'static_eval',
			argument: arguments[0]
		}

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xattach_directives: function(raw_directive, widget_config) {

		if (Lava.schema.DEBUG && !raw_directive.content) Lava.t("empty attach_directives");

		var blocks = Lava.parsers.Common.asBlocks(raw_directive.content),
			sugar = blocks[0],
			directives = blocks.slice(1),
			i,
			count;

		if (Lava.schema.DEBUG) {
			if (sugar.type != 'tag' || sugar.content || directives.length == 0) Lava.t("Malformed attach_directives");
			for (i = 0, count = directives.length; i < count; i++) {
				if (directives[i].type != 'directive') Lava.t("Malformed attach_directives");
			}
		}

		sugar.content = directives;
		return Lava.parsers.Common.compileAsView([sugar]);

	},

	_parseDefaultEvents: function(raw_tag, widget_config) {

		if (Lava.schema.DEBUG && (!raw_tag.content || !raw_tag.content.length)) Lava.t('default_events: tag content is required');
		if (Lava.schema.DEBUG && ('default_events' in widget_config)) Lava.t('default_events: property already defined');

		var events = Lava.parseOptions(raw_tag.content[0]),
			i = 0,
			count;

		if (Lava.schema.DEBUG) {
			if (!Array.isArray(events)) Lava.t('default_events: array expected');
			for (count = events.length; i < count; i++) {
				if (typeof(events[i]) != 'string') Lava.t('default_events: expected an array of strings');
			}
		}

		events = Lava.excludeDefaultEvents(events);
		if (events.length != 0 || (raw_tag.attributes && ('force_replace' in raw_tag.attributes))) {
			widget_config.default_events = events;
		}

	},

	/**
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xdefault_events: function(raw_directive, widget_config) {

		this._parseDefaultEvents(raw_directive, widget_config);

	}

};
/* parser generated by jison 0.4.4 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
Lava.ObjectParser = (function(){
var parser = {trace: function trace(){},
yy: {},
symbols_: {"error":2,"root":3,"EOF":4,"value":5,"objectDefinition":6,"arrayDefinition":7,"RAW_STRING":8,"NUMBER":9,"identifierPath":10,"DOT":11,"IDENTIFIER":12,"OPEN_CURLY":13,"memberList":14,"CLOSE_CURLY":15,"COMMA":16,"member":17,"COLON":18,"OPEN_SQUARE":19,"valueList":20,"CLOSE_SQUARE":21,"$accept":0,"$end":1},
terminals_: {2:"error",4:"EOF",8:"RAW_STRING",9:"NUMBER",11:"DOT",12:"IDENTIFIER",13:"OPEN_CURLY",15:"CLOSE_CURLY",16:"COMMA",18:"COLON",19:"OPEN_SQUARE",21:"CLOSE_SQUARE"},
productions_: [0,[3,1],[3,2],[5,1],[5,1],[5,1],[5,1],[5,1],[10,3],[10,1],[6,3],[6,2],[14,3],[14,1],[17,3],[17,3],[7,3],[7,2],[20,3],[20,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */
/**/) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 7: yy.assertPathValid($$[$0]); // note: also matches literals like 'true', 'false' and 'null' 
break;
case 8: $$[$0-2].push($$[$0]); 
break;
case 9: this.$ = [$$[$0]]; 
break;
}
},
table: [{3:1,4:[1,2],5:3,6:4,7:5,8:[1,6],9:[1,7],10:8,12:[1,11],13:[1,9],19:[1,10]},{1:[3]},{1:[2,1]},{4:[1,12]},{4:[2,3],15:[2,3],16:[2,3],21:[2,3]},{4:[2,4],15:[2,4],16:[2,4],21:[2,4]},{4:[2,5],15:[2,5],16:[2,5],21:[2,5]},{4:[2,6],15:[2,6],16:[2,6],21:[2,6]},{4:[2,7],11:[1,13],15:[2,7],16:[2,7],21:[2,7]},{8:[1,17],12:[1,18],14:14,15:[1,15],17:16},{5:21,6:4,7:5,8:[1,6],9:[1,7],10:8,12:[1,11],13:[1,9],19:[1,10],20:19,21:[1,20]},{4:[2,9],11:[2,9],15:[2,9],16:[2,9],21:[2,9]},{1:[2,2]},{12:[1,22]},{15:[1,23],16:[1,24]},{4:[2,11],15:[2,11],16:[2,11],21:[2,11]},{15:[2,13],16:[2,13]},{18:[1,25]},{18:[1,26]},{16:[1,28],21:[1,27]},{4:[2,17],15:[2,17],16:[2,17],21:[2,17]},{16:[2,19],21:[2,19]},{4:[2,8],11:[2,8],15:[2,8],16:[2,8],21:[2,8]},{4:[2,10],15:[2,10],16:[2,10],21:[2,10]},{8:[1,17],12:[1,18],17:29},{5:30,6:4,7:5,8:[1,6],9:[1,7],10:8,12:[1,11],13:[1,9],19:[1,10]},{5:31,6:4,7:5,8:[1,6],9:[1,7],10:8,12:[1,11],13:[1,9],19:[1,10]},{4:[2,16],15:[2,16],16:[2,16],21:[2,16]},{5:32,6:4,7:5,8:[1,6],9:[1,7],10:8,12:[1,11],13:[1,9],19:[1,10]},{15:[2,12],16:[2,12]},{15:[2,14],16:[2,14]},{15:[2,15],16:[2,15]},{16:[2,18],21:[2,18]}],
defaultActions: {2:[2,1],12:[2,2]},
parseError: function parseError(str,hash){if(hash.recoverable){this.trace(str)}else{throw new Error(str)}},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == 'undefined') {
        this.lexer.yylloc = {};
    }
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === 'function') {
        this.parseError = this.yy.parseError;
    } else {
        this.parseError = (Object.getPrototypeOf ? Object.getPrototypeOf(this) : this.__proto__).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || EOF;
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + this.lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: this.lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: this.lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
/* generated by jison-lex 0.2.0 */
var lexer = (function(){
var lexer = {

EOF:1,

parseError:function parseError(str,hash){if(this.yy.parser){this.yy.parser.parseError(str,hash)}else{throw new Error(str)}},

// resets the lexer, sets new input
setInput:function (input){this._input=input;this._more=this._backtrack=this.done=false;this.yylineno=this.yyleng=0;this.yytext=this.matched=this.match="";this.conditionStack=["INITIAL"];this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0};if(this.options.ranges){this.yylloc.range=[0,0]}this.offset=0;return this},

// consumes and returns one char from the input
input:function (){var ch=this._input[0];this.yytext+=ch;this.yyleng++;this.offset++;this.match+=ch;this.matched+=ch;var lines=ch.match(/(?:\r\n?|\n).*/g);if(lines){this.yylineno++;this.yylloc.last_line++}else{this.yylloc.last_column++}if(this.options.ranges){this.yylloc.range[1]++}this._input=this._input.slice(1);return ch},

// unshifts one char (or a string) into the input
unput:function (ch){var len=ch.length;var lines=ch.split(/(?:\r\n?|\n)/g);this._input=ch+this._input;this.yytext=this.yytext.substr(0,this.yytext.length-len-1);this.offset-=len;var oldLines=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1);this.matched=this.matched.substr(0,this.matched.length-1);if(lines.length-1){this.yylineno-=lines.length-1}var r=this.yylloc.range;this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:lines?(lines.length===oldLines.length?this.yylloc.first_column:0)+oldLines[oldLines.length-lines.length].length-lines[0].length:this.yylloc.first_column-len};if(this.options.ranges){this.yylloc.range=[r[0],r[0]+this.yyleng-len]
}this.yyleng=this.yytext.length;return this},

// When called from action, caches matched text and appends it on next action
more:function (){this._more=true;return this},

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function (){if(this.options.backtrack_lexer){this._backtrack=true}else{return this.parseError("Lexical error on line "+(this.yylineno+1)+". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})}return this},

// retain first n characters of the match
less:function (n){this.unput(this.match.slice(n))},

// displays already matched input, i.e. for error messages
pastInput:function (){var past=this.matched.substr(0,this.matched.length-this.match.length);return(past.length>20?"...":"")+past.substr(-20).replace(/\n/g,"")},

// displays upcoming input, i.e. for error messages
upcomingInput:function (){var next=this.match;if(next.length<20){next+=this._input.substr(0,20-next.length)}return(next.substr(0,20)+(next.length>20?"...":"")).replace(/\n/g,"")},

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function (){var pre=this.pastInput();var c=new Array(pre.length+1).join("-");return pre+this.upcomingInput()+"\n"+c+"^"},

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match,indexed_rule){var token,lines,backup;if(this.options.backtrack_lexer){backup={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done};if(this.options.ranges){backup.yylloc.range=this.yylloc.range.slice(0)}}lines=match[0].match(/(?:\r\n?|\n).*/g);if(lines){this.yylineno+=lines.length}this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:lines?lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+match[0].length};this.yytext+=match[0];this.match+=match[0];this.matches=match;this.yyleng=this.yytext.length;if(this.options.ranges){this.yylloc.range=[this.offset,this.offset+=this.yyleng]}this._more=false;this._backtrack=false;this._input=this._input.slice(match[0].length);this.matched+=match[0];token=this.performAction.call(this,this.yy,this,indexed_rule,this.conditionStack[this.conditionStack.length-1]);if(this.done&&this._input){this.done=false}if(token){if(this.options.backtrack_lexer){delete backup}return token}else if(this._backtrack){for(var k in backup){this[k]=backup[k]}return false}if(this.options.backtrack_lexer){delete backup}return false},

// return next match in input
next:function (){if(this.done){return this.EOF}if(!this._input){this.done=true}var token,match,tempMatch,index;if(!this._more){this.yytext="";this.match=""}var rules=this._currentRules();for(var i=0;i<rules.length;i++){tempMatch=this._input.match(this.rules[rules[i]]);if(tempMatch&&(!match||tempMatch[0].length>match[0].length)){match=tempMatch;index=i;if(this.options.backtrack_lexer){token=this.test_match(tempMatch,rules[i]);if(token!==false){return token}else if(this._backtrack){match=false;continue}else{return false}}else if(!this.options.flex){break}}}if(match){token=this.test_match(match,rules[index]);if(token!==false){return token}return false}if(this._input===""){return this.EOF}else{return this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})}},

// return next match that has a token
lex:function lex(){var r=this.next();if(r){return r}else{return this.lex()}},

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition){this.conditionStack.push(condition)},

// pop the previously active lexer condition state off the condition stack
popState:function popState(){var n=this.conditionStack.length-1;if(n>0){return this.conditionStack.pop()}else{return this.conditionStack[0]}},

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules(){if(this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]){return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules}else{return this.conditions["INITIAL"].rules}},

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n){n=this.conditionStack.length-1-Math.abs(n||0);if(n>=0){return this.conditionStack[n]}else{return"INITIAL"}},

// alias for begin(condition)
pushState:function pushState(condition){this.begin(condition)},

// return the number of states currently on the stack
stateStackSize:function stateStackSize(){return this.conditionStack.length},
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START
/**/) {

var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0: return 13; 
break;
case 1: return 15; 
break;
case 2: return 19; 
break;
case 3: return 21; 
break;
case 4: return 18; 
break;
case 5: return 11; 
break;
case 6: return 16; 
break;
case 7: return 9; 
break;
case 8: return 9; 
break;
case 9: return 8; 
break;
case 10: return 8; 
break;
case 11: return 12; 
break;
case 12: /* skip whitespace */ 
break;
case 13: return 4; 
break;
}
},
rules: [/^(?:\{)/,/^(?:\})/,/^(?:\[)/,/^(?:\])/,/^(?::)/,/^(?:\.)/,/^(?:,)/,/^(?:\d+(\.\d+)?((e|E)(\+|-)\d+)?)/,/^(?:0x[a-fA-F0-9]+)/,/^(?:"([^\\\"]|\\.)*")/,/^(?:'([^\\\']|\\.)*')/,/^(?:[a-zA-Z\_][a-zA-Z0-9\_]*)/,/^(?:\s+)/,/^(?:$)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13],"inclusive":true}}
};
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();




Lava.ObjectParser.yy = {

	/**
	 * Additional globals may be added to the white list
	 */
	valid_globals: ['Lava'],

	/**
	 * Keep in mind: configs must be serializable.
	 * @param {Array} path_segments
	 */
	assertPathValid: function(path_segments) {

		if (Lava.schema.VALIDATE_OBJECT_PATHS) {

			if (!Lava.parsers.Common.isLiteral(path_segments[0]) && this.valid_globals.indexOf(path_segments[0]) == -1) {
				Lava.t("ObjectParser: invalid external path. Text: " + path_segments.join('.'));
			}

		}

	}

};
/* parser generated by jison 0.4.4 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
Lava.ExpressionParser = (function(){
var parser = {trace: function trace(){},
yy: {},
symbols_: {"error":2,"root":3,"EOF":4,"expressions":5,"SEMICOLON":6,"expressionWithOptionalDepends":7,"COMMA":8,"depends":9,"DEPENDS_START":10,"OPEN_CURLY":11,"scopeEvalList":12,"CLOSE_CURLY":13,"scopeEval":14,"expression":15,"expressionTail":16,"operand":17,"OPERATOR":18,"OPEN_BRACE":19,"CLOSE_BRACE":20,"arrayDefinition":21,"NUMBER":22,"RAW_STRING":23,"LITERAL":24,"dynamicScope":25,"functionCall":26,"OPEN_SQUARE":27,"expressionList":28,"CLOSE_SQUARE":29,"knownView":30,"VIEW_BY_LABEL":31,"VIEW_BY_ID":32,"VIEW_BY_NAME":33,"lookupOperator":34,"LOOK_UP":35,"LOOK_DOWN":36,"viewLocator":37,"DEEPNESS_OPERATOR":38,"GLOBAL_MODIFIER_CALL":39,"WIDGET_MODIFIER_CALL":40,"ACTIVE_MODIFIER_CALL":41,"IDENTIFIER":42,"scopePath":43,"SEARCH_OPERATOR":44,"scopePathSegment":45,"DOT_PROPERTY":46,"$accept":0,"$end":1},
terminals_: {2:"error",4:"EOF",6:"SEMICOLON",8:"COMMA",10:"DEPENDS_START",11:"OPEN_CURLY",13:"CLOSE_CURLY",18:"OPERATOR",19:"OPEN_BRACE",20:"CLOSE_BRACE",22:"NUMBER",23:"RAW_STRING",24:"LITERAL",27:"OPEN_SQUARE",29:"CLOSE_SQUARE",31:"VIEW_BY_LABEL",32:"VIEW_BY_ID",33:"VIEW_BY_NAME",35:"LOOK_UP",36:"LOOK_DOWN",38:"DEEPNESS_OPERATOR",39:"GLOBAL_MODIFIER_CALL",40:"WIDGET_MODIFIER_CALL",41:"ACTIVE_MODIFIER_CALL",42:"IDENTIFIER",44:"SEARCH_OPERATOR",46:"DOT_PROPERTY"},
productions_: [0,[3,1],[3,2],[5,3],[5,3],[5,1],[9,4],[12,3],[12,1],[7,2],[7,1],[15,1],[15,1],[15,2],[16,3],[16,2],[17,3],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[21,3],[21,2],[28,3],[28,1],[30,1],[30,1],[30,1],[34,1],[34,1],[37,1],[37,2],[37,2],[37,3],[26,3],[26,4],[26,4],[26,5],[26,4],[26,5],[25,4],[14,1],[14,2],[14,3],[14,2],[14,2],[43,2],[43,1],[45,1],[45,3]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */
/**/) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1: 
break;
case 2: 
break;
case 3:
			yy.assertSemicolonAllowed();
			yy.finishArgument($$[$0].trim());
		
break;
case 4:
			yy.assertCommaAllowed();
			yy.finishArgument($$[$0].trim());
		
break;
case 5: yy.finishArgument($$[$0].trim()); 
break;
case 7: yy.x_argument_binds.push($$[$0]); 
break;
case 8: yy.x_argument_binds.push($$[$0]); 
break;
case 9: this.$ = $$[$0-1]; 
break;
case 10: this.$ = $$[$0]; 
break;
case 11:
			yy.x_counters.expression_tails++;
			this.$ = $$[$0];
		
break;
case 12:
			yy.x_counters.operands++;
			this.$ = $$[$0];
		
break;
case 13:
			yy.x_counters.operands++;
			yy.x_counters.expression_tails++;
			this.$ = $$[$0-1] + ' ' + $$[$0];
		
break;
case 14:
			yy.x_counters.operands++;
			this.$ = $$[$0-2] + ' ' + $$[$0-1] + ' ' + $$[$0];
		
break;
case 15:
			yy.x_counters.operands++;
			this.$ = $$[$0-1] + ' ' + $$[$0];
		
break;
case 16:
			yy.x_counters.braces++;
			this.$ = '(' + $$[$0-1] + ')';
		
break;
case 17: this.$ = $$[$0]; 
break;
case 18:
			yy.x_counters.numbers++;
			this.$ = $$[$0];
		
break;
case 19:
			yy.x_counters.strings++;
			this.$ = $$[$0];
		
break;
case 20:
			yy.x_counters.literals++;
			this.$ = $$[$0];
		
break;
case 21:
			var index = yy.x_argument_binds.push($$[$0]) - 1;
			this.$ = 'this._binds[' + index + '].getValue()';
		
break;
case 22:
			yy.x_counters.dynamic_scopes++;
			var index = yy.x_argument_binds.push($$[$0]) - 1;
			this.$ = 'this._binds[' + index + '].getValue()';
		
break;
case 23: this.$ = $$[$0]; 
break;
case 24: this.$ = '[' + $$[$0-1] + ']'; 
break;
case 25: this.$ = '[]'; 
break;
case 26: this.$ = $$[$0-2] + ', ' + $$[$0]; 
break;
case 27: this.$ = $$[$0]; 
break;
case 28: this.$ = {locator_type: 'Label', locator: $$[$0]}; 
break;
case 29: this.$ = {locator_type: 'Id', locator: $$[$0]}; 
break;
case 30: this.$ = {locator_type: 'Name', locator: $$[$0]}; 
break;
case 31: this.$ = {label: $$[$0], direction: 'look_up'}; 
break;
case 32: this.$ = {label: $$[$0], direction: 'look_down'}; 
break;
case 33: this.$ = $$[$0]; 
break;
case 34: Lava.t("Lookup operator is not supported yet."); 
break;
case 35:
			$$[$0-1].depth = parseInt($$[$0]);
			if (!$$[$0-1].depth) Lava.t('Deepness operator: depth must be > 0');
			this.$ = $$[$0-1];
		
break;
case 36: Lava.t("Lookup operator is not supported yet."); 
break;
case 37:
			yy.x_counters.global_modifiers++;
			this.$ = 'this._callGlobalModifier("' + $$[$0-2] + '", [])';
		
break;
case 38:
			yy.x_counters.global_modifiers++;
			this.$ = 'this._callGlobalModifier("' + $$[$0-3] + '", [' + $$[$0-1] + '])';
		
break;
case 39:
			yy.x_counters.widget_modifiers++;
			$$[$0-3].callback_name = $$[$0-2];
			var index = yy.x_argument_widget_modifiers.push($$[$0-3]) - 1;
			this.$ = 'this._callModifier("' + index + '", [])';
		
break;
case 40:
			yy.x_counters.widget_modifiers++;
			$$[$0-4].callback_name = $$[$0-3];
			var index = yy.x_argument_widget_modifiers.push($$[$0-4]) - 1;
			this.$ = 'this._callModifier("' + index + '", [' + $$[$0-1] + '])';
		
break;
case 41:
			yy.x_counters.active_modifiers++;
			$$[$0-3].callback_name = $$[$0-2];
			var index = yy.x_argument_active_modifiers.push($$[$0-3]) - 1;
			this.$ = 'this._callActiveModifier("' + index + '", [])';
		
break;
case 42:
			yy.x_counters.active_modifiers++;
			$$[$0-4].callback_name = $$[$0-3];
			var index = yy.x_argument_active_modifiers.push($$[$0-4]) - 1;
			this.$ = 'this._callActiveModifier("' + index + '", [' + $$[$0-1] + '])';
		
break;
case 43:
			$$[$0-3].isDynamic = true;
			$$[$0-3].property_name = $$[$0-1];
			this.$ = $$[$0-3];
		
break;
case 44: this.$ = {property_name: $$[$0]}; 
break;
case 45: this.$ = {property_name: $$[$0-1], tail: $$[$0]}; 
break;
case 46:
			$$[$0-2].property_name = $$[$0-1];
			$$[$0-2].tail = $$[$0];
			this.$ = $$[$0-2];
		
break;
case 47:
			$$[$0-1].property_name = $$[$0];
			this.$ = $$[$0-1];
		
break;
case 48: $$[$0-1].tail = $$[$0]; this.$ = $$[$0-1]; 
break;
case 49: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 50: this.$ = [$$[$0]]; 
break;
case 51: this.$ = $$[$0]; 
break;
case 52:
			var segments = $$[$0-1].path_segments;
			if (segments) {
				for (var i = 0, count = segments.length; i < count; i++) {
					if (typeof(segments[i]) == 'object') Lava.t('Dynamic segment must not contain other dynamic segments');
				}
			}
			this.$ = $$[$0-1];
		
break;
}
},
table: [{3:1,4:[1,2],5:3,7:4,14:14,15:5,16:6,17:7,18:[1,8],19:[1,9],21:10,22:[1,11],23:[1,12],24:[1,13],25:15,26:16,27:[1,17],30:20,31:[1,22],32:[1,23],33:[1,24],37:19,39:[1,21],42:[1,18]},{1:[3]},{1:[2,1]},{4:[1,25],6:[1,26],8:[1,27]},{4:[2,5],6:[2,5],8:[2,5]},{4:[2,10],6:[2,10],8:[2,10],9:28,10:[1,29]},{4:[2,11],6:[2,11],8:[2,11],10:[2,11],18:[1,30],20:[2,11],29:[2,11]},{4:[2,12],6:[2,12],8:[2,12],10:[2,12],16:31,18:[1,8],20:[2,12],29:[2,12]},{14:14,17:32,19:[1,9],21:10,22:[1,11],23:[1,12],24:[1,13],25:15,26:16,27:[1,17],30:20,31:[1,22],32:[1,23],33:[1,24],37:19,39:[1,21],42:[1,18]},{14:14,15:33,16:6,17:7,18:[1,8],19:[1,9],21:10,22:[1,11],23:[1,12],24:[1,13],25:15,26:16,27:[1,17],30:20,31:[1,22],32:[1,23],33:[1,24],37:19,39:[1,21],42:[1,18]},{4:[2,17],6:[2,17],8:[2,17],10:[2,17],18:[2,17],20:[2,17],29:[2,17]},{4:[2,18],6:[2,18],8:[2,18],10:[2,18],18:[2,18],20:[2,18],29:[2,18]},{4:[2,19],6:[2,19],8:[2,19],10:[2,19],18:[2,19],20:[2,19],29:[2,19]},{4:[2,20],6:[2,20],8:[2,20],10:[2,20],18:[2,20],20:[2,20],29:[2,20]},{4:[2,21],6:[2,21],8:[2,21],10:[2,21],18:[2,21],20:[2,21],29:[2,21]},{4:[2,22],6:[2,22],8:[2,22],10:[2,22],18:[2,22],20:[2,22],29:[2,22]},{4:[2,23],6:[2,23],8:[2,23],10:[2,23],18:[2,23],20:[2,23],29:[2,23]},{14:14,15:36,16:6,17:7,18:[1,8],19:[1,9],21:10,22:[1,11],23:[1,12],24:[1,13],25:15,26:16,27:[1,17],28:34,29:[1,35],30:20,31:[1,22],32:[1,23],33:[1,24],37:19,39:[1,21],42:[1,18]},{4:[2,44],6:[2,44],8:[2,44],10:[2,44],13:[2,44],18:[2,44],20:[2,44],27:[1,40],29:[2,44],43:37,45:38,46:[1,39]},{27:[1,40],43:42,44:[1,41],45:38,46:[1,39]},{11:[1,43],27:[2,33],34:46,35:[1,48],36:[1,49],38:[1,47],40:[1,44],41:[1,45],44:[2,33],46:[2,33]},{19:[1,50]},{11:[2,28],27:[2,28],35:[2,28],36:[2,28],38:[2,28],40:[2,28],41:[2,28],44:[2,28],46:[2,28]},{11:[2,29],27:[2,29],35:[2,29],36:[2,29],38:[2,29],40:[2,29],41:[2,29],44:[2,29],46:[2,29]},{11:[2,30],27:[2,30],35:[2,30],36:[2,30],38:[2,30],40:[2,30],41:[2,30],44:[2,30],46:[2,30]},{1:[2,2]},{7:51,14:14,15:5,16:6,17:7,18:[1,8],19:[1,9],21:10,22:[1,11],23:[1,12],24:[1,13],25:15,26:16,27:[1,17],30:20,31:[1,22],32:[1,23],33:[1,24],37:19,39:[1,21],42:[1,18]},{7:52,14:14,15:5,16:6,17:7,18:[1,8],19:[1,9],21:10,22:[1,11],23:[1,12],24:[1,13],25:15,26:16,27:[1,17],30:20,31:[1,22],32:[1,23],33:[1,24],37:19,39:[1,21],42:[1,18]},{4:[2,9],6:[2,9],8:[2,9]},{11:[1,53]},{14:14,17:54,19:[1,9],21:10,22:[1,11],23:[1,12],24:[1,13],25:15,26:16,27:[1,17],30:20,31:[1,22],32:[1,23],33:[1,24],37:19,39:[1,21],42:[1,18]},{4:[2,13],6:[2,13],8:[2,13],10:[2,13],18:[1,30],20:[2,13],29:[2,13]},{4:[2,15],6:[2,15],8:[2,15],10:[2,15],18:[2,15],20:[2,15],29:[2,15]},{20:[1,55]},{8:[1,57],29:[1,56]},{4:[2,25],6:[2,25],8:[2,25],10:[2,25],18:[2,25],20:[2,25],29:[2,25]},{8:[2,27],20:[2,27],29:[2,27]},{4:[2,45],6:[2,45],8:[2,45],10:[2,45],13:[2,45],18:[2,45],20:[2,45],27:[1,40],29:[2,45],45:58,46:[1,39]},{4:[2,50],6:[2,50],8:[2,50],10:[2,50],13:[2,50],18:[2,50],20:[2,50],27:[2,50],29:[2,50],46:[2,50]},{4:[2,51],6:[2,51],8:[2,51],10:[2,51],13:[2,51],18:[2,51],20:[2,51],27:[2,51],29:[2,51],46:[2,51]},{14:59,30:60,31:[1,22],32:[1,23],33:[1,24],37:19,42:[1,18]},{4:[2,47],6:[2,47],8:[2,47],10:[2,47],13:[2,47],18:[2,47],20:[2,47],27:[1,40],29:[2,47],43:61,45:38,46:[1,39]},{4:[2,48],6:[2,48],8:[2,48],10:[2,48],13:[2,48],18:[2,48],20:[2,48],27:[1,40],29:[2,48],45:58,46:[1,39]},{42:[1,62]},{19:[1,63]},{19:[1,64]},{27:[2,34],44:[2,34],46:[2,34]},{27:[2,35],34:65,35:[1,48],36:[1,49],44:[2,35],46:[2,35]},{27:[2,31],44:[2,31],46:[2,31]},{27:[2,32],44:[2,32],46:[2,32]},{14:14,15:36,16:6,17:7,18:[1,8],19:[1,9],20:[1,66],21:10,22:[1,11],23:[1,12],24:[1,13],25:15,26:16,27:[1,17],28:67,30:20,31:[1,22],32:[1,23],33:[1,24],37:19,39:[1,21],42:[1,18]},{4:[2,3],6:[2,3],8:[2,3]},{4:[2,4],6:[2,4],8:[2,4]},{12:68,14:69,30:60,31:[1,22],32:[1,23],33:[1,24],37:19,42:[1,18]},{4:[2,14],6:[2,14],8:[2,14],10:[2,14],18:[2,14],20:[2,14],29:[2,14]},{4:[2,16],6:[2,16],8:[2,16],10:[2,16],18:[2,16],20:[2,16],29:[2,16]},{4:[2,24],6:[2,24],8:[2,24],10:[2,24],18:[2,24],20:[2,24],29:[2,24]},{14:14,15:70,16:6,17:7,18:[1,8],19:[1,9],21:10,22:[1,11],23:[1,12],24:[1,13],25:15,26:16,27:[1,17],30:20,31:[1,22],32:[1,23],33:[1,24],37:19,39:[1,21],42:[1,18]},{4:[2,49],6:[2,49],8:[2,49],10:[2,49],13:[2,49],18:[2,49],20:[2,49],27:[2,49],29:[2,49],46:[2,49]},{29:[1,71]},{27:[2,33],34:46,35:[1,48],36:[1,49],38:[1,47],44:[2,33],46:[2,33]},{4:[2,46],6:[2,46],8:[2,46],10:[2,46],13:[2,46],18:[2,46],20:[2,46],27:[1,40],29:[2,46],45:58,46:[1,39]},{13:[1,72]},{14:14,15:36,16:6,17:7,18:[1,8],19:[1,9],20:[1,73],21:10,22:[1,11],23:[1,12],24:[1,13],25:15,26:16,27:[1,17],28:74,30:20,31:[1,22],32:[1,23],33:[1,24],37:19,39:[1,21],42:[1,18]},{14:14,15:36,16:6,17:7,18:[1,8],19:[1,9],20:[1,75],21:10,22:[1,11],23:[1,12],24:[1,13],25:15,26:16,27:[1,17],28:76,30:20,31:[1,22],32:[1,23],33:[1,24],37:19,39:[1,21],42:[1,18]},{27:[2,36],44:[2,36],46:[2,36]},{4:[2,37],6:[2,37],8:[2,37],10:[2,37],18:[2,37],20:[2,37],29:[2,37]},{8:[1,57],20:[1,77]},{8:[1,79],13:[1,78]},{8:[2,8],13:[2,8]},{8:[2,26],20:[2,26],29:[2,26]},{4:[2,52],6:[2,52],8:[2,52],10:[2,52],13:[2,52],18:[2,52],20:[2,52],27:[2,52],29:[2,52],46:[2,52]},{4:[2,43],6:[2,43],8:[2,43],10:[2,43],18:[2,43],20:[2,43],29:[2,43]},{4:[2,39],6:[2,39],8:[2,39],10:[2,39],18:[2,39],20:[2,39],29:[2,39]},{8:[1,57],20:[1,80]},{4:[2,41],6:[2,41],8:[2,41],10:[2,41],18:[2,41],20:[2,41],29:[2,41]},{8:[1,57],20:[1,81]},{4:[2,38],6:[2,38],8:[2,38],10:[2,38],18:[2,38],20:[2,38],29:[2,38]},{4:[2,6],6:[2,6],8:[2,6]},{14:82,30:60,31:[1,22],32:[1,23],33:[1,24],37:19,42:[1,18]},{4:[2,40],6:[2,40],8:[2,40],10:[2,40],18:[2,40],20:[2,40],29:[2,40]},{4:[2,42],6:[2,42],8:[2,42],10:[2,42],18:[2,42],20:[2,42],29:[2,42]},{8:[2,7],13:[2,7]}],
defaultActions: {2:[2,1],25:[2,2]},
parseError: function parseError(str,hash){if(hash.recoverable){this.trace(str)}else{throw new Error(str)}},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == 'undefined') {
        this.lexer.yylloc = {};
    }
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === 'function') {
        this.parseError = this.yy.parseError;
    } else {
        this.parseError = (Object.getPrototypeOf ? Object.getPrototypeOf(this) : this.__proto__).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || EOF;
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + this.lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: this.lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: this.lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
/* generated by jison-lex 0.2.0 */
var lexer = (function(){
var lexer = {

EOF:1,

parseError:function parseError(str,hash){if(this.yy.parser){this.yy.parser.parseError(str,hash)}else{throw new Error(str)}},

// resets the lexer, sets new input
setInput:function (input){this._input=input;this._more=this._backtrack=this.done=false;this.yylineno=this.yyleng=0;this.yytext=this.matched=this.match="";this.conditionStack=["INITIAL"];this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0};if(this.options.ranges){this.yylloc.range=[0,0]}this.offset=0;return this},

// consumes and returns one char from the input
input:function (){var ch=this._input[0];this.yytext+=ch;this.yyleng++;this.offset++;this.match+=ch;this.matched+=ch;var lines=ch.match(/(?:\r\n?|\n).*/g);if(lines){this.yylineno++;this.yylloc.last_line++}else{this.yylloc.last_column++}if(this.options.ranges){this.yylloc.range[1]++}this._input=this._input.slice(1);return ch},

// unshifts one char (or a string) into the input
unput:function (ch){var len=ch.length;var lines=ch.split(/(?:\r\n?|\n)/g);this._input=ch+this._input;this.yytext=this.yytext.substr(0,this.yytext.length-len-1);this.offset-=len;var oldLines=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1);this.matched=this.matched.substr(0,this.matched.length-1);if(lines.length-1){this.yylineno-=lines.length-1}var r=this.yylloc.range;this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:lines?(lines.length===oldLines.length?this.yylloc.first_column:0)+oldLines[oldLines.length-lines.length].length-lines[0].length:this.yylloc.first_column-len};if(this.options.ranges){this.yylloc.range=[r[0],r[0]+this.yyleng-len]
}this.yyleng=this.yytext.length;return this},

// When called from action, caches matched text and appends it on next action
more:function (){this._more=true;return this},

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function (){if(this.options.backtrack_lexer){this._backtrack=true}else{return this.parseError("Lexical error on line "+(this.yylineno+1)+". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})}return this},

// retain first n characters of the match
less:function (n){this.unput(this.match.slice(n))},

// displays already matched input, i.e. for error messages
pastInput:function (){var past=this.matched.substr(0,this.matched.length-this.match.length);return(past.length>20?"...":"")+past.substr(-20).replace(/\n/g,"")},

// displays upcoming input, i.e. for error messages
upcomingInput:function (){var next=this.match;if(next.length<20){next+=this._input.substr(0,20-next.length)}return(next.substr(0,20)+(next.length>20?"...":"")).replace(/\n/g,"")},

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function (){var pre=this.pastInput();var c=new Array(pre.length+1).join("-");return pre+this.upcomingInput()+"\n"+c+"^"},

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match,indexed_rule){var token,lines,backup;if(this.options.backtrack_lexer){backup={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done};if(this.options.ranges){backup.yylloc.range=this.yylloc.range.slice(0)}}lines=match[0].match(/(?:\r\n?|\n).*/g);if(lines){this.yylineno+=lines.length}this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:lines?lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+match[0].length};this.yytext+=match[0];this.match+=match[0];this.matches=match;this.yyleng=this.yytext.length;if(this.options.ranges){this.yylloc.range=[this.offset,this.offset+=this.yyleng]}this._more=false;this._backtrack=false;this._input=this._input.slice(match[0].length);this.matched+=match[0];token=this.performAction.call(this,this.yy,this,indexed_rule,this.conditionStack[this.conditionStack.length-1]);if(this.done&&this._input){this.done=false}if(token){if(this.options.backtrack_lexer){delete backup}return token}else if(this._backtrack){for(var k in backup){this[k]=backup[k]}return false}if(this.options.backtrack_lexer){delete backup}return false},

// return next match in input
next:function (){if(this.done){return this.EOF}if(!this._input){this.done=true}var token,match,tempMatch,index;if(!this._more){this.yytext="";this.match=""}var rules=this._currentRules();for(var i=0;i<rules.length;i++){tempMatch=this._input.match(this.rules[rules[i]]);if(tempMatch&&(!match||tempMatch[0].length>match[0].length)){match=tempMatch;index=i;if(this.options.backtrack_lexer){token=this.test_match(tempMatch,rules[i]);if(token!==false){return token}else if(this._backtrack){match=false;continue}else{return false}}else if(!this.options.flex){break}}}if(match){token=this.test_match(match,rules[index]);if(token!==false){return token}return false}if(this._input===""){return this.EOF}else{return this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})}},

// return next match that has a token
lex:function lex(){var r=this.next();if(r){return r}else{return this.lex()}},

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition){this.conditionStack.push(condition)},

// pop the previously active lexer condition state off the condition stack
popState:function popState(){var n=this.conditionStack.length-1;if(n>0){return this.conditionStack.pop()}else{return this.conditionStack[0]}},

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules(){if(this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]){return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules}else{return this.conditions["INITIAL"].rules}},

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n){n=this.conditionStack.length-1-Math.abs(n||0);if(n>=0){return this.conditionStack[n]}else{return"INITIAL"}},

// alias for begin(condition)
pushState:function pushState(condition){this.begin(condition)},

// return the number of states currently on the stack
stateStackSize:function stateStackSize(){return this.conditionStack.length},
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START
/**/) {

var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0: Lava.t('Spaces between function name and opening brace are not allowed (1)'); 
break;
case 1: Lava.t('Spaces between function name and opening brace are not allowed (1)'); 
break;
case 2: Lava.t('Spaces between function name and opening brace are not allowed (2)'); 
break;
case 3: Lava.t('Spaces in scope path are not allowed (1)'); 
break;
case 4: Lava.t('Spaces in scope path are not allowed (2)'); 
break;
case 5: yy_.yytext = yy_.yytext.slice(1); return 31; 
break;
case 6: yy_.yytext = yy_.yytext.slice(1); return 32; 
break;
case 7: yy_.yytext = yy_.yytext.slice(1); return 33; 
break;
case 8: yy_.yytext = yy_.yytext.slice(2); return 41; 
break;
case 9: yy_.yytext = yy_.yytext.slice(5); return 41; 
break;
case 10: yy_.yytext = yy_.yytext.slice(1); return 40; 
break;
case 11: return 39; 
break;
case 12: yy_.yytext = yy_.yytext.slice(1); return 38; 
break;
case 13: yy_.yytext = yy_.yytext.slice(1); return 46; 
break;
case 14: yy_.yytext = yy_.yytext.slice(2); return 44; 
break;
case 15: yy_.yytext = yy_.yytext.slice(5); return 44; 
break;
case 16: yy_.yytext = yy_.yytext.substr(4, yy_.yyleng - 5); return 35; 
break;
case 17: yy_.yytext = yy_.yytext.substr(4, yy_.yyleng - 5); return 36; 
break;
case 18: yy_.yytext = yy.unescape(yy_.yytext); return 18; /*escaped operator versions*/ 
break;
case 19: yy_.yytext = yy.unescape(yy_.yytext); return 18; /*escaped operator versions + "&", "&&" */ 
break;
case 20: return 18; /*arithmetic*/ 
break;
case 21: return 18; /*logical, without "&&" and "!" */ 
break;
case 22: return 18; /*comparison*/ 
break;
case 23: return 18; /*bitwise, without "&" */ 
break;
case 24: return 18; /*ternary*/ 
break;
case 25: return 18; /*unary*/ 
break;
case 26: return 8; 
break;
case 27: return 6; 
break;
case 28: return 22; 
break;
case 29: return 22; 
break;
case 30: return 23; 
break;
case 31: return 23; 
break;
case 32: return 27; 
break;
case 33: return 29; 
break;
case 34: /* skip whitespace */ 
break;
case 35: return 10; 
break;
case 36: return 11; 
break;
case 37: return 13; 
break;
case 38:
		this.x_lex_brace_levels++;
		return 19;
	
break;
case 39:
		if (this.x_tail_mode && this.x_lex_brace_levels == 0) {
			this.x_input_tail_length = this._input.length;
			this._input = '';
			this.done = true;
			return 4;
		} else {
			this.x_lex_brace_levels--;
			return 20;
		}
	
break;
case 40:
		var lowercase = yy_.yytext.toLowerCase();
		var map = {
			'lt': '<',
			'gt': '>',
			'and': '&&'
		};

		if (lowercase == 'this') Lava.t("'this' is reserved word. Are you missing the Label sign (@)?");
		if ((lowercase in map) && lowercase != yy_.yytext) Lava.t("Expression parser: 'lt', 'gt', 'and' must be lower case");

		if (lowercase in map) {
			yy_.yytext = map[lowercase];
			return 18;
		}

		if (Lava.parsers.Common.isLiteral(yy_.yytext)) {
			if (lowercase != yy_.yytext) Lava.t("Expression parser, code style: literals must be lower case");
			return 24;
		}

		return 42;
	
break;
case 41: return 4; 
break;
}
},
rules: [/^(?:->([a-zA-Z\_][a-zA-Z0-9\_]*)(?=\s+)\()/,/^(?:-&gt;([a-zA-Z\_][a-zA-Z0-9\_]*)(?=\s+)\()/,/^(?:\.([a-zA-Z\_][a-zA-Z0-9\_]*)(?=\s+)\()/,/^(?:\s+[\~\.\[\]])/,/^(?:\[\s\b)/,/^(?:@([a-zA-Z\_][a-zA-Z0-9\_]*))/,/^(?:#([a-zA-Z\_][a-zA-Z0-9\_]*))/,/^(?:\$([a-zA-Z\_][a-zA-Z0-9\_]*))/,/^(?:->([a-zA-Z\_][a-zA-Z0-9\_]*)(?=\())/,/^(?:-&gt;([a-zA-Z\_][a-zA-Z0-9\_]*)(?=\())/,/^(?:\.([a-zA-Z\_][a-zA-Z0-9\_]*)(?=\())/,/^(?:([a-zA-Z\_][a-zA-Z0-9\_]*)(?=\())/,/^(?:~\d+)/,/^(?:\.[a-zA-Z0-9\_]+)/,/^(?:->([a-zA-Z\_][a-zA-Z0-9\_]*))/,/^(?:-&gt;([a-zA-Z\_][a-zA-Z0-9\_]*))/,/^(?::up\(([a-zA-Z\_][a-zA-Z0-9\_]*)\))/,/^(?::dn\(([a-zA-Z\_][a-zA-Z0-9\_]*)\))/,/^(?:(&lt;|&gt;))/,/^(?:(&amp;|&lt;|&gt;|&)+)/,/^(?:[\+\-\*\/\%])/,/^(?:\|\||!!)/,/^(?:===|!==|==|!=|<=|>=|<|>)/,/^(?:>>>|>>|<<|[\|\^])/,/^(?:[\?\:])/,/^(?:!)/,/^(?:,)/,/^(?:;)/,/^(?:\d+(\.\d+)?((e|E)(\+|-)\d+)?)/,/^(?:0x[a-fA-F0-9]+)/,/^(?:"(\\"|[^"])*")/,/^(?:'(\\'|[^'])*')/,/^(?:\[(?=[^\s]))/,/^(?:\])/,/^(?:\s+)/,/^(?:\/\/depends\b)/,/^(?:\{)/,/^(?:\})/,/^(?:\()/,/^(?:\))/,/^(?:([a-zA-Z\_][a-zA-Z0-9\_]*))/,/^(?:$)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41],"inclusive":true}}
};
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();




Lava.ExpressionParser._parse = Lava.ExpressionParser.parse;

/** @enum {number} */
Lava.ExpressionParser.SEPARATORS = {
	COMMA: 1,
	SEMICOLON: 2
};

/**
 * @param {string} input
 * @param {Lava.ExpressionParser.SEPARATORS} separator
 * @returns {Array.<_cRawArgument>}
 */
Lava.ExpressionParser.parseRaw = function(input, separator) {

	if (this.yy.is_parsing) Lava.t("Calling ExpressionParser.parse*() recursively will break the parser. Please, create another instance.");

	this.lexer.x_tail_mode = false;
	this.lexer.x_lex_brace_levels = 0;
	this.lexer.x_input_tail_length = 0;
	this.yy.x_allowed_separator = separator;
	this.yy.reset();

	try {

		this.yy.is_parsing = true;
		this._parse(input);

	} finally {

		this.yy.is_parsing = false;

	}

	return this.yy.x_arguments;

};

/**
 * @param {string} input
 * @param {Lava.ExpressionParser.SEPARATORS} separator
 * @returns {Array.<_cArgument>}
 */
Lava.ExpressionParser.parse = function(input, separator) {
	return this.yy.convertArguments(this.parseRaw(input, separator));
};

/**
 * @param {string} input
 * @returns {_cScopeLocator}
 */
Lava.ExpressionParser.parsePath = function(input) {
	var configs = this.yy.convertArguments(this.parseRaw(input));
	if (configs.length != 1) Lava.t("ExpressionParser: single scope expected, got either many expressions or nothing");
	if (!configs[0].flags || !configs[0].flags.isScopeEval) Lava.t("ExpressionParser: expected scope path, got expression");
	return configs[0].binds[0];
};

/**
 * @param {{input: string, tail_length: number}} config_ref
 * @param {Lava.ExpressionParser.SEPARATORS} separator
 * @returns {Array.<_cRawArgument>}
 */
Lava.ExpressionParser.parseWithTailRaw = function(config_ref, separator) {

	if (this.yy.is_parsing) Lava.t("Calling ExpressionParser.parse*() recursively will break the parser. Please, create another instance.");

	this.lexer.x_tail_mode = true;
	this.lexer.x_lex_brace_levels = 0;
	this.lexer.x_input_tail_length = 0;
	this.yy.x_allowed_separator = separator;
	this.yy.reset();

	try {

		this.yy.is_parsing = true;
		this._parse(config_ref.input);

	} finally {

		this.yy.is_parsing = false;

	}

	config_ref.tail_length = this.lexer.x_input_tail_length;
	return this.yy.x_arguments;

};

/**
 * @param {{input: string, tail_length: number}} config_ref
 * @param {Lava.ExpressionParser.SEPARATORS} separator
 * @returns {Array.<_cArgument>}
 */
Lava.ExpressionParser.parseWithTail = function(config_ref, separator) {
	return this.yy.convertArguments(this.parseWithTailRaw(config_ref, separator));
};

Lava.ExpressionParser.parseScopeEval = function(input) {

	var raw_arguments = this.parseRaw(input);
	if (Lava.schema.DEBUG && (raw_arguments.length != 1 || !raw_arguments[0].flags.isScopeEval)) Lava.t('parseScopeEval: malformed scope path');

	return raw_arguments[0].binds[0];
};

Lava.ExpressionParser.yy = {

	is_parsing: false,
	x_arguments: null,
	x_argument_binds: null,
	x_argument_widget_modifiers: null,
	x_argument_active_modifiers: null,
	x_allowed_separator: null,

	x_counters: {
		modifiers: 0,
		active_modifiers: 0,
		operands: 0,
		expression_tails: 0,
		braces: 0,
		literals: 0,
		numbers: 0,
		strings: 0,
		dynamic_scopes: 0
	},

	unescape: function(string) {
		return Firestorm.String.unescape(string);
	},

	reset: function() {
		// must reset everything, cause in case of parsing exception the parser will be left broken
		this.x_argument_binds = [];
		this.x_argument_widget_modifiers = [];
		this.x_argument_active_modifiers = [];
		this.x_arguments = [];
	},

	resetCounters: function() {
		this.x_counters.global_modifiers = 0;
		this.x_counters.widget_modifiers = 0;
		this.x_counters.active_modifiers = 0;
		this.x_counters.operands = 0;
		this.x_counters.expression_tails = 0;
		this.x_counters.braces = 0;
		this.x_counters.literals = 0;
		this.x_counters.numbers = 0;
		this.x_counters.strings = 0;
		this.x_counters.dynamic_scopes = 0;
	},

	finishArgument: function(evaluator_src) {
		var result = {
				evaluator_src: evaluator_src
			},
			flags = {};
		if (this.x_argument_binds.length) result.binds = this.x_argument_binds;
		if (this.x_argument_widget_modifiers.length) result.modifiers = this.x_argument_widget_modifiers;
		if (this.x_argument_active_modifiers.length) result.active_modifiers = this.x_argument_active_modifiers;

		if (this.x_counters.global_modifiers > 0) flags.hasGlobalModifiers = true;
		if (this.x_argument_binds.length == 1
			&& this.x_counters.operands == 1
			&& this.x_counters.expression_tails == 0
			&& this.x_counters.braces == 0
			&& this.x_counters.dynamic_scopes == 0
		) {
			flags.isScopeEval = true;
		}
		if (this.x_argument_binds.length == 0 && this.x_counters.active_modifiers == 0) {
			flags.isStatic = true;
			if (this.x_counters.literals == 1 && this.x_counters.operands == 1) flags.isLiteral = true;
			if (this.x_counters.numbers == 1 && this.x_counters.operands == 1) flags.isNumber = true;
			if (this.x_counters.strings == 1 && this.x_counters.operands == 1) flags.isString = true;
		}

		if (!Firestorm.Object.isEmpty(flags)) result.flags = flags;
		this.x_arguments.push(result);

		this.x_argument_binds = [];
		this.x_argument_widget_modifiers = [];
		this.x_argument_active_modifiers = [];
		this.resetCounters();
	},

	/**
	 * @param {Array.<_cRawArgument>} raw_arguments
	 * @returns {Array.<_cArgument>}
	 */
	convertArguments: function(raw_arguments) {

		var i = 0,
			count = raw_arguments.length,
			result = [];

		for (; i < count; i++) {
			result.push(this.convertArgument(raw_arguments[i]))
		}

		return result;

	},

	/**
	 * @param {_cRawArgument} raw_argument
	 * @returns {_cArgument}
	 */
	convertArgument: function(raw_argument) {

		var src = "return (" + raw_argument.evaluator_src + ");",
			result = {
				evaluator: new Function(src)
			};

		if ('flags' in raw_argument) result.flags = raw_argument.flags;
		if ('binds' in raw_argument) result.binds = raw_argument.binds;
		if ('modifiers' in raw_argument) result.modifiers = raw_argument.modifiers;
		if ('active_modifiers' in raw_argument) result.active_modifiers = raw_argument.active_modifiers;

		return result;

	},

	assertSemicolonAllowed: function() {

		if (this.x_allowed_separator == null) Lava.t("ExpressionParser: semicolon encountered, but separator is not set");
		if (this.x_allowed_separator != Lava.ExpressionParser.SEPARATORS.SEMICOLON) Lava.t("ExpressionParser: comma is not allowed as separator here");

	},

	assertCommaAllowed: function() {

		if (this.x_allowed_separator == null) Lava.t("ExpressionParser: comma encountered, but separator is not set");
		if (this.x_allowed_separator != Lava.ExpressionParser.SEPARATORS.COMMA) Lava.t("ExpressionParser: semicolon is not allowed as separator here");

	}

};
/* parser generated by jison 0.4.4 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
Lava.TemplateParser = (function(){
var parser = {trace: function trace(){},
yy: {},
symbols_: {"error":2,"root":3,"EOF":4,"blocks":5,"block":6,"CONTENT":7,"INCLUDE":8,"EXPRESSION_BLOCK_N":9,"EXPRESSION_BLOCK_E":10,"blockStart":11,"BLOCK_END":12,"elsePart":13,"selfClosingTag":14,"tagStart":15,"TAG_END":16,"SCRIPT_CONTENT":17,"SWITCH_ON":18,"SWITCH_OFF":19,"OPEN_BLOCK":20,"blockInit":21,"BLOCK_CLOSE":22,"blockHash":23,"DYNAMIC_BLOCK_INIT":24,"EMPTY_ARGS":25,"EXPORT_ARGUMENTS":26,"BLOCK_INIT":27,"blockHashSegment":28,"IDENTIFIER":29,"HASH_ASSIGN":30,"STRING":31,"elseifChain":32,"BLOCK_ELSE":33,"blockElseif":34,"OPEN_ELSEIF":35,"TAG_OPEN":36,"TAG_END_CLOSE":37,"htmlHash":38,"TAG_CLOSE":39,"htmlHashSegment":40,"HASH_ATTRIBUTE":41,"UNESCAPED_HASH_ASSIGN":42,"$accept":0,"$end":1},
terminals_: {2:"error",4:"EOF",7:"CONTENT",8:"INCLUDE",9:"EXPRESSION_BLOCK_N",10:"EXPRESSION_BLOCK_E",12:"BLOCK_END",16:"TAG_END",17:"SCRIPT_CONTENT",18:"SWITCH_ON",19:"SWITCH_OFF",20:"OPEN_BLOCK",22:"BLOCK_CLOSE",24:"DYNAMIC_BLOCK_INIT",25:"EMPTY_ARGS",26:"EXPORT_ARGUMENTS",27:"BLOCK_INIT",29:"IDENTIFIER",30:"HASH_ASSIGN",31:"STRING",33:"BLOCK_ELSE",35:"OPEN_ELSEIF",36:"TAG_OPEN",37:"TAG_END_CLOSE",39:"TAG_CLOSE",41:"HASH_ATTRIBUTE",42:"UNESCAPED_HASH_ASSIGN"},
productions_: [0,[3,1],[3,2],[5,2],[5,1],[6,1],[6,1],[6,1],[6,1],[6,2],[6,3],[6,3],[6,4],[6,1],[6,2],[6,2],[6,3],[6,1],[6,1],[11,3],[11,4],[21,2],[21,2],[21,2],[21,2],[23,2],[23,1],[28,1],[28,2],[28,2],[13,3],[13,2],[13,1],[13,2],[13,1],[32,3],[32,2],[32,2],[32,1],[34,3],[14,2],[14,3],[15,2],[15,3],[38,2],[38,1],[40,1],[40,1],[40,2]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */
/**/) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1: return []; 
break;
case 2: return $$[$0-1]; 
break;
case 3:
			this.$ = $$[$0-1];
			if ($$[$0]) {
				// inline fragments
				if ($$[$0].name == 'script' && $$[$0].type == 'tag' && $$[$0].attributes && $$[$0].attributes.type == 'lava/fragment') {
					this.$ = $$[$0].content ? $$[$0-1].concat($$[$0].content) : $$[$0-1];
				} else if (typeof($$[$0]) == 'string' && this.$.length && typeof(this.$[this.$.length-1]) == 'string') {
					this.$[this.$.length-1] += $$[$0];
				} else {
					this.$.push($$[$0]);
				}
			}
		
break;
case 4:
			if ($$[$0]) {
				if ($$[$0].name == 'script' && $$[$0].type == 'tag' && $$[$0].attributes && $$[$0].attributes.type == 'lava/fragment') {
					this.$ = $$[$0].content || [];
				} else {
					this.$ = [$$[$0]];
				}
			} else {
				this.$ = [];
			}
		
break;
case 5:
			//this.$ = yy.preserve_whitespace ? $$[$0] : $$[$0].trim();
			this.$ = $$[$0];
		
break;
case 6:
			var targets = Lava.parsers.Common.parseTargets($$[$0]);
			if (targets.length != 1) Lava.t("Malformed include");
			targets[0].type = 'include';
			this.$ = targets[0];
		
break;
case 7:
			this.$ = {
				type: 'expression',
				prefix: $$[$0][1],
				arguments: Lava.ExpressionParser.parse(yytext.substr(3, yyleng - 4))
			};
		
break;
case 8:
			this.$ = {
				type: 'expression',
				prefix: $$[$0][1],
				arguments: Lava.ExpressionParser.parse(yytext.substr(6, yyleng - 7))
			};
		
break;
case 9:
			if ($$[$0-1].name != $$[$0]) Lava.t('End block ("' + $$[$0] + '") does not match the start block ("' + $$[$0-1].name + '") (1)');
			this.$ = $$[$0-1];
		
break;
case 10:
			if ($$[$0-2].name != $$[$0]) Lava.t('End block ("' + $$[$0] + '") does not match the start block ("' + $$[$0-2].name + '") (2)');
			$$[$0-2].content = $$[$0-1];
			this.$ = $$[$0-2];
		
break;
case 11:
			if ($$[$0-2].name != $$[$0]) Lava.t('End block ("' + $$[$0] + '") does not match the start block ("' + $$[$0-2].name + '") (3)');
			if ('elseif_arguments' in $$[$0-1]) {
				$$[$0-2].elseif_arguments = $$[$0-1].elseif_arguments;
				$$[$0-2].elseif_contents = $$[$0-1].elseif_contents;
			}
			if ('else_content' in $$[$0-1]) $$[$0-2].else_content = $$[$0-1].else_content;
			this.$ = $$[$0-2];
		
break;
case 12:
			if ($$[$0-3].name != $$[$0]) Lava.t('End block ("' + $$[$0] + '") does not match the start block ("' + $$[$0-3].name + '") (4)');
			$$[$0-3].content = $$[$0-2];
			if ('elseif_arguments' in $$[$0-1]) {
				$$[$0-3].elseif_arguments = $$[$0-1].elseif_arguments;
				$$[$0-3].elseif_contents = $$[$0-1].elseif_contents;
			}
			if ('else_content' in $$[$0-1]) $$[$0-3].else_content = $$[$0-1].else_content;
			this.$ = $$[$0-3];
		
break;
case 13:
			this.$ = $$[$0];
		
break;
case 14:
			yy.validateTagEnd($$[$0-1], $$[$0]);
			this.$ = $$[$0-1];
		
break;
case 15:
			this.$ = $$[$0-1];
			if ($$[$0-1].name == 'script' && $$[$0-1].x && ('equiv' in $$[$0-1].x)) {
				if (!$$[$0-1].x.equiv) Lava.t('empty x:equiv');
				this.$ = yy.parseRawTag($$[$0-1].x.equiv); // sets name and type (it may be directive)
				this.$.x = $$[$0-1].x;
				if ('attributes' in $$[$0-1]) this.$.attributes = $$[$0-1].attributes;
			}
			this.$.content = [$$[$0]];
		
break;
case 16:
			yy.validateTagEnd($$[$0-2], $$[$0]);
			$$[$0-2].content = $$[$0-1];
			this.$ = $$[$0-2];
			if (Lava.isVoidTag(this.$.name)) Lava.t("Void tag with content: " + this.$.name);
		
break;
case 17:
			if ($$[$0] == 'preserve_whitespace') {
				if (yy.preserve_whitespace) Lava.t("Switch {pre:} is already active");
				yy.preserve_whitespace = true;
			} else {
				Lava.t("Parser error: lexer returned unknown switch: " + $$[$0]);
			}
			this.$ = null;
		
break;
case 18:
			if ($$[$0] == 'preserve_whitespace') {
				if (!yy.preserve_whitespace) Lava.t("Trying to turn off inactive switch: {:pre}");
				yy.preserve_whitespace = false;
			} else {
				Lava.t("Parser error: lexer returned unknown switch: " + $$[$0]);
			}
			this.$ = null;
		
break;
case 19:
			this.$ = $$[$0-1];
			this.$.prefix = $$[$0-2][1]; // '$' or '#'
		
break;
case 20:
			this.$ = $$[$0-2];
			this.$.prefix = $$[$0-3][1]; // '$' or '#'
			this.$.hash = $$[$0-1];
		
break;
case 21:
			this.$ = {type:'block'};
			yy.parseDynamicBlockInit(this.$, $$[$0-1].substr(1)); // substr to cut the colon before locator
		
break;
case 22:
			this.$ = {type:'block'};
			yy.parseDynamicBlockInit(this.$, $$[$0-1].substr(1)); // substr to cut the colon before locator
			this.$.arguments = yy.lexer.x_export_arguments;
			yy.lexer.x_export_arguments = null;
		
break;
case 23:
			this.$ = {
				type:'block',
				name: $$[$0-1]
			};
		
break;
case 24:
			this.$ = {
				type:'block',
				name: $$[$0-1]
			};
			this.$.arguments = yy.lexer.x_export_arguments;
			yy.lexer.x_export_arguments = null;
		
break;
case 25:
			if ($$[$0].name in $$[$0-1]) Lava.t('Duplicate attribute in block definition: ' + $$[$0].name);
			$$[$0-1][$$[$0].name] = $$[$0].value;
			this.$ = $$[$0-1];
		
break;
case 26: this.$ = {}; this.$[$$[$0].name] = $$[$0].value; 
break;
case 27: this.$ = {name:$$[$0], value:true}; 
break;
case 28:
			var literals = {
				'null': null,
				'undefined': undefined,
				'true': true,
				'false': false
			};
			if ($$[$0] in literals) {
				$$[$0] = literals[$$[$0]];
			}
			this.$ = {name:$$[$0-1], value:$$[$0]};
		
break;
case 29: this.$ = {name:$$[$0-1], value:$$[$0]}; 
break;
case 30:
			$$[$0-2].else_content = $$[$0];
			this.$ = $$[$0-2];
		
break;
case 31:
			$$[$0-1].else_content = [];
			this.$ = $$[$0-1];
		
break;
case 32:
			this.$ = $$[$0];
		
break;
case 33:
			this.$ = {else_content: $$[$0]};
		
break;
case 34:
			this.$ = {else_content: []};
		
break;
case 35:
			$$[$0-2].elseif_arguments.push($$[$0-1]);
			$$[$0-2].elseif_contents.push($$[$0]);
			this.$ = $$[$0-2];
		
break;
case 36:
			$$[$0-1].elseif_arguments.push($$[$0]);
			$$[$0-1].elseif_contents.push([]);
			this.$ = $$[$0-1];
		
break;
case 37:
			this.$ = {
				elseif_arguments: [$$[$0-1]],
				elseif_contents: [$$[$0]]
			};
		
break;
case 38:
			this.$ = {
				elseif_arguments: [$$[$0]],
				elseif_contents: [[]]
			};
		
break;
case 39:
			var arguments = yy.lexer.x_export_arguments;
			if (arguments.length != 1) Lava.t('Elseif block requires exactly one argument');
			this.$ = arguments[0];
			yy.lexer.x_export_arguments = null;
		
break;
case 40:
			if ($$[$0-1] != $$[$0-1].toLowerCase()) Lava.t("Tag names must be lower case: " + $$[$0-1]);
			this.$ = yy.parseRawTag($$[$0-1]);
		
break;
case 41:
			if ($$[$0-2] != $$[$0-2].toLowerCase()) Lava.t("Tag names must be lower case: " + $$[$0-2]);
			this.$ = yy.parseRawTag($$[$0-2], $$[$0-1]);
		
break;
case 42:
			if ($$[$0-1] != $$[$0-1].toLowerCase()) Lava.t("Tag names must be lower case: " + $$[$0-1]);
			this.$ = yy.parseRawTag($$[$0-1]);
		
break;
case 43:
			if ($$[$0-2] != $$[$0-2].toLowerCase()) Lava.t("Tag names must be lower case: " + $$[$0-2]);
			this.$ = yy.parseRawTag($$[$0-2], $$[$0-1]);
		
break;
case 44: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 45: this.$ = [$$[$0]]; 
break;
case 46: this.$ = {name:$$[$0], value: ''}; // behaviour of innerHTML 
break;
case 47:
			var parts = $$[$0].split('=');
			this.$ = {name:parts[0], value:parts[1]};
		
break;
case 48: this.$ = {name:$$[$0-1], value:$$[$0]}; 
break;
}
},
table: [{3:1,4:[1,2],5:3,6:4,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,14:10,15:11,18:[1,12],19:[1,13],20:[1,14],36:[1,15]},{1:[3]},{1:[2,1]},{4:[1,16],6:17,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,14:10,15:11,18:[1,12],19:[1,13],20:[1,14],36:[1,15]},{4:[2,4],7:[2,4],8:[2,4],9:[2,4],10:[2,4],12:[2,4],16:[2,4],18:[2,4],19:[2,4],20:[2,4],33:[2,4],35:[2,4],36:[2,4]},{4:[2,5],7:[2,5],8:[2,5],9:[2,5],10:[2,5],12:[2,5],16:[2,5],18:[2,5],19:[2,5],20:[2,5],33:[2,5],35:[2,5],36:[2,5]},{4:[2,6],7:[2,6],8:[2,6],9:[2,6],10:[2,6],12:[2,6],16:[2,6],18:[2,6],19:[2,6],20:[2,6],33:[2,6],35:[2,6],36:[2,6]},{4:[2,7],7:[2,7],8:[2,7],9:[2,7],10:[2,7],12:[2,7],16:[2,7],18:[2,7],19:[2,7],20:[2,7],33:[2,7],35:[2,7],36:[2,7]},{4:[2,8],7:[2,8],8:[2,8],9:[2,8],10:[2,8],12:[2,8],16:[2,8],18:[2,8],19:[2,8],20:[2,8],33:[2,8],35:[2,8],36:[2,8]},{5:19,6:4,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,12:[1,18],13:20,14:10,15:11,18:[1,12],19:[1,13],20:[1,14],32:21,33:[1,22],34:23,35:[1,24],36:[1,15]},{4:[2,13],7:[2,13],8:[2,13],9:[2,13],10:[2,13],12:[2,13],16:[2,13],18:[2,13],19:[2,13],20:[2,13],33:[2,13],35:[2,13],36:[2,13]},{5:27,6:4,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,14:10,15:11,16:[1,25],17:[1,26],18:[1,12],19:[1,13],20:[1,14],36:[1,15]},{4:[2,17],7:[2,17],8:[2,17],9:[2,17],10:[2,17],12:[2,17],16:[2,17],18:[2,17],19:[2,17],20:[2,17],33:[2,17],35:[2,17],36:[2,17]},{4:[2,18],7:[2,18],8:[2,18],9:[2,18],10:[2,18],12:[2,18],16:[2,18],18:[2,18],19:[2,18],20:[2,18],33:[2,18],35:[2,18],36:[2,18]},{21:28,24:[1,29],27:[1,30]},{30:[1,37],37:[1,31],38:32,39:[1,33],40:34,41:[1,35],42:[1,36]},{1:[2,2]},{4:[2,3],7:[2,3],8:[2,3],9:[2,3],10:[2,3],12:[2,3],16:[2,3],18:[2,3],19:[2,3],20:[2,3],33:[2,3],35:[2,3],36:[2,3]},{4:[2,9],7:[2,9],8:[2,9],9:[2,9],10:[2,9],12:[2,9],16:[2,9],18:[2,9],19:[2,9],20:[2,9],33:[2,9],35:[2,9],36:[2,9]},{6:17,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,12:[1,38],13:39,14:10,15:11,18:[1,12],19:[1,13],20:[1,14],32:21,33:[1,22],34:23,35:[1,24],36:[1,15]},{12:[1,40]},{12:[2,32],33:[1,41],34:42,35:[1,24]},{5:43,6:4,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,12:[2,34],14:10,15:11,18:[1,12],19:[1,13],20:[1,14],36:[1,15]},{5:44,6:4,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,12:[2,38],14:10,15:11,18:[1,12],19:[1,13],20:[1,14],33:[2,38],35:[2,38],36:[1,15]},{26:[1,45]},{4:[2,14],7:[2,14],8:[2,14],9:[2,14],10:[2,14],12:[2,14],16:[2,14],18:[2,14],19:[2,14],20:[2,14],33:[2,14],35:[2,14],36:[2,14]},{4:[2,15],7:[2,15],8:[2,15],9:[2,15],10:[2,15],12:[2,15],16:[2,15],18:[2,15],19:[2,15],20:[2,15],33:[2,15],35:[2,15],36:[2,15]},{6:17,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,14:10,15:11,16:[1,46],18:[1,12],19:[1,13],20:[1,14],36:[1,15]},{22:[1,47],23:48,28:49,29:[1,50],30:[1,51]},{25:[1,52],26:[1,53]},{25:[1,54],26:[1,55]},{4:[2,40],7:[2,40],8:[2,40],9:[2,40],10:[2,40],12:[2,40],16:[2,40],18:[2,40],19:[2,40],20:[2,40],33:[2,40],35:[2,40],36:[2,40]},{30:[1,37],37:[1,56],39:[1,57],40:58,41:[1,35],42:[1,36]},{7:[2,42],8:[2,42],9:[2,42],10:[2,42],16:[2,42],17:[2,42],18:[2,42],19:[2,42],20:[2,42],36:[2,42]},{30:[2,45],37:[2,45],39:[2,45],41:[2,45],42:[2,45]},{30:[2,46],37:[2,46],39:[2,46],41:[2,46],42:[2,46]},{30:[2,47],37:[2,47],39:[2,47],41:[2,47],42:[2,47]},{31:[1,59]},{4:[2,10],7:[2,10],8:[2,10],9:[2,10],10:[2,10],12:[2,10],16:[2,10],18:[2,10],19:[2,10],20:[2,10],33:[2,10],35:[2,10],36:[2,10]},{12:[1,60]},{4:[2,11],7:[2,11],8:[2,11],9:[2,11],10:[2,11],12:[2,11],16:[2,11],18:[2,11],19:[2,11],20:[2,11],33:[2,11],35:[2,11],36:[2,11]},{5:61,6:4,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,12:[2,31],14:10,15:11,18:[1,12],19:[1,13],20:[1,14],36:[1,15]},{5:62,6:4,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,12:[2,36],14:10,15:11,18:[1,12],19:[1,13],20:[1,14],33:[2,36],35:[2,36],36:[1,15]},{6:17,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,12:[2,33],14:10,15:11,18:[1,12],19:[1,13],20:[1,14],36:[1,15]},{6:17,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,12:[2,37],14:10,15:11,18:[1,12],19:[1,13],20:[1,14],33:[2,37],35:[2,37],36:[1,15]},{22:[1,63]},{4:[2,16],7:[2,16],8:[2,16],9:[2,16],10:[2,16],12:[2,16],16:[2,16],18:[2,16],19:[2,16],20:[2,16],33:[2,16],35:[2,16],36:[2,16]},{7:[2,19],8:[2,19],9:[2,19],10:[2,19],12:[2,19],18:[2,19],19:[2,19],20:[2,19],33:[2,19],35:[2,19],36:[2,19]},{22:[1,64],28:65,29:[1,50],30:[1,51]},{22:[2,26],29:[2,26],30:[2,26]},{22:[2,27],29:[2,27],30:[2,27]},{29:[1,66],31:[1,67]},{22:[2,21],29:[2,21],30:[2,21]},{22:[2,22],29:[2,22],30:[2,22]},{22:[2,23],29:[2,23],30:[2,23]},{22:[2,24],29:[2,24],30:[2,24]},{4:[2,41],7:[2,41],8:[2,41],9:[2,41],10:[2,41],12:[2,41],16:[2,41],18:[2,41],19:[2,41],20:[2,41],33:[2,41],35:[2,41],36:[2,41]},{7:[2,43],8:[2,43],9:[2,43],10:[2,43],16:[2,43],17:[2,43],18:[2,43],19:[2,43],20:[2,43],36:[2,43]},{30:[2,44],37:[2,44],39:[2,44],41:[2,44],42:[2,44]},{30:[2,48],37:[2,48],39:[2,48],41:[2,48],42:[2,48]},{4:[2,12],7:[2,12],8:[2,12],9:[2,12],10:[2,12],12:[2,12],16:[2,12],18:[2,12],19:[2,12],20:[2,12],33:[2,12],35:[2,12],36:[2,12]},{6:17,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,12:[2,30],14:10,15:11,18:[1,12],19:[1,13],20:[1,14],36:[1,15]},{6:17,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,12:[2,35],14:10,15:11,18:[1,12],19:[1,13],20:[1,14],33:[2,35],35:[2,35],36:[1,15]},{7:[2,39],8:[2,39],9:[2,39],10:[2,39],12:[2,39],18:[2,39],19:[2,39],20:[2,39],33:[2,39],35:[2,39],36:[2,39]},{7:[2,20],8:[2,20],9:[2,20],10:[2,20],12:[2,20],18:[2,20],19:[2,20],20:[2,20],33:[2,20],35:[2,20],36:[2,20]},{22:[2,25],29:[2,25],30:[2,25]},{22:[2,28],29:[2,28],30:[2,28]},{22:[2,29],29:[2,29],30:[2,29]}],
defaultActions: {2:[2,1],16:[2,2]},
parseError: function parseError(str,hash){if(hash.recoverable){this.trace(str)}else{throw new Error(str)}},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == 'undefined') {
        this.lexer.yylloc = {};
    }
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === 'function') {
        this.parseError = this.yy.parseError;
    } else {
        this.parseError = (Object.getPrototypeOf ? Object.getPrototypeOf(this) : this.__proto__).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || EOF;
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + this.lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: this.lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: this.lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
/* generated by jison-lex 0.2.0 */
var lexer = (function(){
var lexer = {

EOF:1,

parseError:function parseError(str,hash){if(this.yy.parser){this.yy.parser.parseError(str,hash)}else{throw new Error(str)}},

// resets the lexer, sets new input
setInput:function (input){this._input=input;this._more=this._backtrack=this.done=false;this.yylineno=this.yyleng=0;this.yytext=this.matched=this.match="";this.conditionStack=["INITIAL"];this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0};if(this.options.ranges){this.yylloc.range=[0,0]}this.offset=0;return this},

// consumes and returns one char from the input
input:function (){var ch=this._input[0];this.yytext+=ch;this.yyleng++;this.offset++;this.match+=ch;this.matched+=ch;var lines=ch.match(/(?:\r\n?|\n).*/g);if(lines){this.yylineno++;this.yylloc.last_line++}else{this.yylloc.last_column++}if(this.options.ranges){this.yylloc.range[1]++}this._input=this._input.slice(1);return ch},

// unshifts one char (or a string) into the input
unput:function (ch){var len=ch.length;var lines=ch.split(/(?:\r\n?|\n)/g);this._input=ch+this._input;this.yytext=this.yytext.substr(0,this.yytext.length-len-1);this.offset-=len;var oldLines=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1);this.matched=this.matched.substr(0,this.matched.length-1);if(lines.length-1){this.yylineno-=lines.length-1}var r=this.yylloc.range;this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:lines?(lines.length===oldLines.length?this.yylloc.first_column:0)+oldLines[oldLines.length-lines.length].length-lines[0].length:this.yylloc.first_column-len};if(this.options.ranges){this.yylloc.range=[r[0],r[0]+this.yyleng-len]
}this.yyleng=this.yytext.length;return this},

// When called from action, caches matched text and appends it on next action
more:function (){this._more=true;return this},

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function (){if(this.options.backtrack_lexer){this._backtrack=true}else{return this.parseError("Lexical error on line "+(this.yylineno+1)+". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})}return this},

// retain first n characters of the match
less:function (n){this.unput(this.match.slice(n))},

// displays already matched input, i.e. for error messages
pastInput:function (){var past=this.matched.substr(0,this.matched.length-this.match.length);return(past.length>20?"...":"")+past.substr(-20).replace(/\n/g,"")},

// displays upcoming input, i.e. for error messages
upcomingInput:function (){var next=this.match;if(next.length<20){next+=this._input.substr(0,20-next.length)}return(next.substr(0,20)+(next.length>20?"...":"")).replace(/\n/g,"")},

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function (){var pre=this.pastInput();var c=new Array(pre.length+1).join("-");return pre+this.upcomingInput()+"\n"+c+"^"},

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match,indexed_rule){var token,lines,backup;if(this.options.backtrack_lexer){backup={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done};if(this.options.ranges){backup.yylloc.range=this.yylloc.range.slice(0)}}lines=match[0].match(/(?:\r\n?|\n).*/g);if(lines){this.yylineno+=lines.length}this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:lines?lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+match[0].length};this.yytext+=match[0];this.match+=match[0];this.matches=match;this.yyleng=this.yytext.length;if(this.options.ranges){this.yylloc.range=[this.offset,this.offset+=this.yyleng]}this._more=false;this._backtrack=false;this._input=this._input.slice(match[0].length);this.matched+=match[0];token=this.performAction.call(this,this.yy,this,indexed_rule,this.conditionStack[this.conditionStack.length-1]);if(this.done&&this._input){this.done=false}if(token){if(this.options.backtrack_lexer){delete backup}return token}else if(this._backtrack){for(var k in backup){this[k]=backup[k]}return false}if(this.options.backtrack_lexer){delete backup}return false},

// return next match in input
next:function (){if(this.done){return this.EOF}if(!this._input){this.done=true}var token,match,tempMatch,index;if(!this._more){this.yytext="";this.match=""}var rules=this._currentRules();for(var i=0;i<rules.length;i++){tempMatch=this._input.match(this.rules[rules[i]]);if(tempMatch&&(!match||tempMatch[0].length>match[0].length)){match=tempMatch;index=i;if(this.options.backtrack_lexer){token=this.test_match(tempMatch,rules[i]);if(token!==false){return token}else if(this._backtrack){match=false;continue}else{return false}}else if(!this.options.flex){break}}}if(match){token=this.test_match(match,rules[index]);if(token!==false){return token}return false}if(this._input===""){return this.EOF}else{return this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})}},

// return next match that has a token
lex:function lex(){var r=this.next();if(r){return r}else{return this.lex()}},

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition){this.conditionStack.push(condition)},

// pop the previously active lexer condition state off the condition stack
popState:function popState(){var n=this.conditionStack.length-1;if(n>0){return this.conditionStack.pop()}else{return this.conditionStack[0]}},

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules(){if(this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]){return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules}else{return this.conditions["INITIAL"].rules}},

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n){n=this.conditionStack.length-1-Math.abs(n||0);if(n>=0){return this.conditionStack[n]}else{return"INITIAL"}},

// alias for begin(condition)
pushState:function pushState(condition){this.begin(condition)},

// return the number of states currently on the stack
stateStackSize:function stateStackSize(){return this.conditionStack.length},
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START
/**/) {

var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:
		if (this._input.length) {
			if (this._input[0] == '<') {
				if (this.x_pure_blocks_mode) {
					this.begin("skipTag");
				} else {
					this.begin("tag");
				}
			} else if (['#','$','/','>','*','&'].indexOf(this._input[1]) !== -1) {
				this.begin("block");
			} else if (this._input.substr(0, 6) == '{else}' || this._input.substr(0, 7) == '{elseif') { // } <- comment for Jison
				this.begin("block");
			} else {
				this.begin("switch");
			}
		}
		if(yy_.yytext) return 7;
	
break;
case 1: return 7; 
break;
case 2: this.popState(); return 7; 
break;
case 3: this.popState(); yy_.yytext = yy_.yytext.substr(2, yy_.yyleng - 3); return 8; 
break;
case 4: this.popState(); yy_.yytext = yy_.yytext.substr(5, yy_.yyleng - 6); return 8; // escaped variant 
break;
case 5: this.popState(); return 33; 
break;
case 6: this.popState(); yy_.yytext = yy_.yytext.substr(2, yy_.yyleng - 3); return 12; 
break;
case 7: this.popState(); /* yy_.yytext = yy_.yytext.substr(2, yy_.yyleng - 4); return 'COMMENT'; */ 
break;
case 8: this.popState(); return 9; // normal 
break;
case 9: this.popState(); return 10; // escaped 
break;
case 10: Lava.t('Spaces between block opening tag and block name are not allowed'); 
break;
case 11: Lava.t('Spaces between block name and opening brace are not allowed'); 
break;
case 12: return 20; 
break;
case 13: return 35; 
break;
case 14: return 24; 
break;
case 15: return 27; 
break;
case 16:
		this.popState(); // block
		this.begin('blockHash');
		return 25;
	
break;
case 17:
		var config_ref = {
			input: this._input,
			tail_length: 0
		};
		this.x_export_arguments = Lava.ExpressionParser.parseWithTail(config_ref);
		this._input = this._input.substr(this._input.length - config_ref.tail_length);
		// { <- comment for Jison
		if (!(/(\s|\})/.test(this._input[0]))) Lava.t('Lex: arguments closing brace must be followed by whitespace or CLOSE_CURLY');
		this.popState(); // block
		this.begin('blockHash');
		return 26;
	
break;
case 18: yy_.yytext = yy_.yytext.substr(0,yy_.yyleng-1); return 30; 
break;
case 19: return 29; 
break;
case 20: yy_.yytext = Lava.parsers.Common.unquoteString(yy_.yytext); return 31; 
break;
case 21: yy_.yytext = Lava.parsers.Common.unquoteString(yy_.yytext); return 31; 
break;
case 22: this.popState(); return 22; 
break;
case 23: 
break;
case 24: this.popState(); return 7; 
break;
case 25: this.popState(); return 7; 
break;
case 26: this.popState(); yy_.yytext = yy_.yytext.substr(2,yy_.yyleng-3).toLowerCase(); return 16; 
break;
case 27:
		yy_.yytext = yy_.yytext.substr(1).trim().toLowerCase();
		this.yy.x_lexer_tag_name = yy_.yytext;
		this.yy.x_lexer_is_fragment = false;
		if (yy_.yytext == 'script') {
			var index = this._input.indexOf('>');
			if (index == -1) Lava.t("Lexical error: malformed script tag");
			var attributes_string = this._input.substr(0, index);
			if (/type=(\'|\")lava\/fragment(\'|\")/.test(attributes_string)) {
				this.yy.x_lexer_is_fragment = true;
			}
		}
		return 36;
	
break;
case 28:
		var tag_name = this.yy.x_lexer_tag_name;
		this.yy.x_lexer_tag_name = null;
		this.popState();
		if (!this.yy.x_lexer_is_fragment && (tag_name == 'script' || tag_name == 'style')) {
			this.begin(tag_name == 'script' ? 'eatScript' : 'eatStyle');
		} else if (Lava.isVoidTag(tag_name)) {
			return 37; // in html5 browser returns void tags as unclosed
		}
		return 39;
	
break;
case 29:
		this.yy.x_lexer_tag_name = null;
		this.popState();
		return 37;
	
break;
case 30: yy_.yytext = yy_.yytext.trim(); return 41; 
break;
case 31: return 41; 
break;
case 32: yy_.yytext = yy_.yytext.substr(0,yy_.yyleng-1); return 30; 
break;
case 33: yy_.yytext = yy_.yytext.trim(); return 42; 
break;
case 34: yy_.yytext = Lava.parsers.Common.unquoteString(yy_.yytext); return 31; 
break;
case 35: yy_.yytext = Lava.parsers.Common.unquoteString(yy_.yytext); return 31; 
break;
case 36: 
break;
case 37: this.popState(); yy_.yytext = yy_.yytext.substr(0,yy_.yyleng-9); return 17; 
break;
case 38: this.popState(); yy_.yytext = yy_.yytext.substr(0,yy_.yyleng-8); return 17; 
break;
case 39:
		var _map = {
			L: '{', // comment for Jison is not needed (closing brace is below)
			R: '}',
			LT: '<',
			GT: '>',
			AMP: '&'
		};
		this.popState();
		yy_.yytext = _map[yy_.yytext.substr(2,yy_.yyleng-4)];
		return 7;
	
break;
case 40:
		this.popState();
		if (yy_.yytext == '{literal:}') {
			this.begin('literal');
		} else if (yy_.yytext == '{pure_blocks:}') {
			if (this.x_pure_blocks_mode) Lava.t('Lexer switch: "{pure_blocks:}" mode is already enabled');
			this.x_pure_blocks_mode = true;
		} else if (yy_.yytext == '{pre:}') {
			yy_.yytext = 'preserve_whitespace';
			return 18;
		} else {
			Lava.t('Unknown switch: ' + yy_.yytext);
		}
	
break;
case 41:
		this.popState();
		if (yy_.yytext == '{:pure_blocks}') {
			if (!this.x_pure_blocks_mode) Lava.t('Redundant lexer switch "{:pure_blocks}"');
			this.x_pure_blocks_mode = false;
		} else if (yy_.yytext == '{:pre}') {
			yy_.yytext = 'preserve_whitespace';
			return 19;
		} else {
			Lava.t('Unknown switch: ' + yy_.yytext);
		}
	
break;
case 42: this.popState(); yy_.yytext = yy_.yytext.substr(0, yy_.yyleng-10); return 7; 
break;
case 43: return 4; 
break;
}
},
rules: [/^(?:[^\x00]*?(?=((\{[\#\$\>\*])|(\{&)|(\{\/)|(<([a-zA-Z][a-zA-Z0-9\_\-]*(:[a-zA-Z0-9\_][a-zA-Z0-9\_\-]*)*)\s*)|(<\/([a-zA-Z][a-zA-Z0-9\_\-]*(:[a-zA-Z0-9\_][a-zA-Z0-9\_\-]*)*)>)|(<!--(.|\s)*?-->)|(<!\[CDATA\[(.|\s)*?\]\]>)|(\{[a-zA-Z\_]+:\})|(\{:[a-zA-Z\_]+\})|(\{:[LR]:\}|\{:[LG])|\{elseif\s*\(|\{else\})))/,/^(?:[^\x00]+)/,/^(?:<)/,/^(?:\{>[^\}]*\})/,/^(?:\{&gt;[^\}]*\})/,/^(?:\{else\})/,/^(?:\{\/(([a-zA-Z\_][a-zA-Z0-9\_]*)(\/([a-zA-Z\_][a-zA-Z0-9\_]*))*)\})/,/^(?:\{\*([^\*]|\*[^\}])*\*\})/,/^(?:\{(#|\$)>[^\}]+\})/,/^(?:\{(#|\$)&gt;[^\}]+\})/,/^(?:((\{[\#\$\>\*])|(\{&))\s\b)/,/^(?:((\{[\#\$\>\*])|(\{&))(([a-zA-Z\_][a-zA-Z0-9\_]*)(\/([a-zA-Z\_][a-zA-Z0-9\_]*))*)\s\()/,/^(?:((\{[\#\$\>\*])|(\{&)))/,/^(?:\{elseif(?=\())/,/^(?::[\$\#\@]([a-zA-Z\_][a-zA-Z0-9\_]*)\/(([a-zA-Z\_][a-zA-Z0-9\_]*)(\/([a-zA-Z\_][a-zA-Z0-9\_]*))*)(?=\())/,/^(?:(([a-zA-Z\_][a-zA-Z0-9\_]*)(\/([a-zA-Z\_][a-zA-Z0-9\_]*))*)(?=\())/,/^(?:\(\s*\))/,/^(?:\()/,/^(?:([a-zA-Z\_][a-zA-Z0-9\_]*)=)/,/^(?:([a-zA-Z\_][a-zA-Z0-9\_]*)(?=[\s\}]))/,/^(?:"([^\\\"]|\\.)*"(?=[\s\}]))/,/^(?:'([^\\\']|\\.)*'(?=[\s\}]))/,/^(?:\s*\})/,/^(?:\s+)/,/^(?:(<!--(.|\s)*?-->))/,/^(?:(<!\[CDATA\[(.|\s)*?\]\]>))/,/^(?:(<\/([a-zA-Z][a-zA-Z0-9\_\-]*(:[a-zA-Z0-9\_][a-zA-Z0-9\_\-]*)*)>))/,/^(?:(<([a-zA-Z][a-zA-Z0-9\_\-]*(:[a-zA-Z0-9\_][a-zA-Z0-9\_\-]*)*)\s*))/,/^(?:>)/,/^(?:\/>)/,/^(?:([a-zA-Z][a-zA-Z0-9\_\-]*(:[a-zA-Z0-9\_][a-zA-Z0-9\_\-]*)*)\s+)/,/^(?:([a-zA-Z][a-zA-Z0-9\_\-]*(:[a-zA-Z0-9\_][a-zA-Z0-9\_\-]*)*)(?=>))/,/^(?:([a-zA-Z][a-zA-Z0-9\_\-]*(:[a-zA-Z0-9\_][a-zA-Z0-9\_\-]*)*)=)/,/^(?:([a-zA-Z][a-zA-Z0-9\_\-]*(:[a-zA-Z0-9\_][a-zA-Z0-9\_\-]*)*)=([a-zA-Z\_][a-zA-Z0-9\_]*)+\s\b)/,/^(?:"([^\\\"]|\\.)*")/,/^(?:'([^\\\']|\\.)*')/,/^(?:\s+)/,/^(?:[\s\S]*?<\/script>)/,/^(?:[\s\S]*?<\/style>)/,/^(?:(\{:[LR]:\}|\{:[LG]))/,/^(?:(\{[a-zA-Z\_]+:\}))/,/^(?:(\{:[a-zA-Z\_]+\}))/,/^(?:[^\x00]*?\{:literal\})/,/^(?:$)/],
conditions: {"block":{"rules":[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],"inclusive":false},"blockHash":{"rules":[18,19,20,21,22,23],"inclusive":false},"tag":{"rules":[24,25,26,27,28,29,30,31,32,33,34,35,36],"inclusive":false},"skipTag":{"rules":[2],"inclusive":false},"switch":{"rules":[39,40,41],"inclusive":false},"literal":{"rules":[42],"inclusive":false},"eatScript":{"rules":[37],"inclusive":false},"eatStyle":{"rules":[38],"inclusive":false},"INITIAL":{"rules":[0,1,43],"inclusive":true}}
};
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();




Lava.TemplateParser._parse = Lava.TemplateParser.parse;

/**
 * @param {string} input
 * @param {_cView=} view_config
 * @returns {_tTemplate}
 */
Lava.TemplateParser.parse = function(input, view_config) {

	return Lava.parsers.Common.compileTemplate(this.parseRaw(input), view_config);

};

/**
 * @param {string} input
 * @returns {_tRawTemplate}
 */
Lava.TemplateParser.parseRaw = function(input) {

	if (this.yy.is_parsing) Lava.t("Calling TemplateParser.parseRaw() recursively will break the parser. Please, create another instance.");

	var result;

	this.lexer.x_pure_blocks_mode = false;
	this.lexer.x_export_arguments = null;
	this.yy.preserve_whitespace = false;

	try {

		this.yy.is_parsing = true;
		result = this._parse(input);

	} finally {

		this.yy.is_parsing = false;

	}

	return result;

};

Lava.TemplateParser.yy = {

	is_parsing: false,
	/** @const */
	CONTROL_ATTRIBUTE_PREFIX: 'x:',
	preserve_whitespace: false,

	x_lexer_tag_name: null,
	x_lexer_is_fragment: false,

	/**
	 * Filters out attributes starting with 'x:' prefix, and puts them into separate property named 'x'.
	 * Control attributes are split by colon, resulting array is then used as path inside the 'x' object
	 * (similar to class paths).
	 *
	 * @param {{
		 *      attributes: Object.<string, string>,
		 *      x: _cRawX
		 * }} tag_config
	 * @param {Array.<_cRawAttribute>} raw_attributes
	 */
	_parseControlAttributes: function(tag_config, raw_attributes) {

		var i = 0,
			count = raw_attributes.length,
			attribute,
			normalized_path,
			current_object,
			segment_name,
			segments_count,
			name,
			x = {},
			attributes = {};

		for (; i < count; i++) {

			attribute = raw_attributes[i];
			if (attribute.name.indexOf(this.CONTROL_ATTRIBUTE_PREFIX) == 0) {

				current_object = x;
				normalized_path = attribute.name.substr(this.CONTROL_ATTRIBUTE_PREFIX.length).split(':');
				segments_count = normalized_path.length;

				while (segments_count) {

					segments_count--;
					segment_name = normalized_path.shift();

					if (Lava.schema.DEBUG && segment_name == '') Lava.t("Malformed control attribute: " + attribute.name);

					if (segments_count) {

						if (!(segment_name in current_object)) current_object[segment_name] = {};
						current_object = current_object[segment_name];
						if (typeof(current_object) != 'object') Lava.t("Conflicting control attribute: " + attribute.name);

					} else {

						if (segment_name in current_object) Lava.t('Conflicting control attribute: ' + attribute.name);
						current_object[segment_name] = attribute.value;

					}

				}

			} else {

				if (attribute.name in attributes) Lava.t('Duplicate attribute on tag: ' + attribute.name);
				attributes[attribute.name] = attribute.value;

			}

		}

		for (name in x) {
			tag_config.x = x;
			break;
		}

		for (name in attributes) {
			tag_config.attributes = attributes;
			break;
		}

	},

	/**
	 * @param {string} tag_name
	 * @param {Array.<_cRawAttribute>=} raw_attributes
	 * @returns {(_cRawTag|_cRawDirective)}
	 */
	parseRawTag: function(tag_name, raw_attributes) {

		var result = {};

		if (raw_attributes) {
			this._parseControlAttributes(result, raw_attributes);
		}

		if (tag_name.indexOf(this.CONTROL_ATTRIBUTE_PREFIX) == 0) {

			result.type = 'directive';
			result.name = tag_name.substr(this.CONTROL_ATTRIBUTE_PREFIX.length);

		} else {

			result.type = 'tag';
			result.name = tag_name;

		}

		return result;

	},

	validateTagEnd: function(start_object, end_name) {

		var start_name = (start_object.type == 'directive')
			? this.CONTROL_ATTRIBUTE_PREFIX + start_object.name
			: start_object.name;

		if (start_name != end_name) Lava.t('End tag ("' + end_name + '") does not match the start tag ("' + start_name + '")');

	},

	parseDynamicBlockInit: function(config, string) {

		var i = string.indexOf('/'),
			name = string.substr(0, i);

		if (Lava.schema.DEBUG && i == -1) Lava.t();
		if (Lava.schema.DEBUG && !(name[0] in Lava.parsers.Common.locator_types)) Lava.t("Malformed class name locator: " + string);

		config.class_locator = {locator_type: Lava.parsers.Common.locator_types[name[0]], name: name.substr(1)};
		config.real_class = string.substr(i);
		config.name = config.real_class.substr(1); // cut the slash to match the end block

		if (Lava.schema.DEBUG && (!config.class_locator.name || !config.class_locator.locator_type)) Lava.t("Malformed class name locator: " + string);

	}

};

Lava.locales.en = {
	/**
	 * How many plural forms does this language have.
	 */
	count_plurals: 2,
	/**
	 * Get the index of plural form
	 * @param {number} n
	 * @returns {number}
	 */
	pluralize: function(n) {
		return +(n != 1);
	},
	booleans: ['No', 'Yes'],
	day_names: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	short_day_names: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	month_names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	short_month_names: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
	first_day_offset: 0 // starts from Sunday. Must be "1" if the first day of week is Monday.
};
Lava.define(
'Lava.mixin.Observable',
/**
 * @lends Lava.mixin.Observable#
 * @implements _iObservable
 */
{

	isObservable: true,

	// [event_name] => array_of_listeners
	_listeners: {},

	/**
	 * @param {string} event_name
	 * @param {function} fn
	 * @param {Object} [context]
	 * @param {*} [listener_args]
	 * @returns {_iListener}
	 */
	on: function(event_name, fn, context, listener_args) {

		return this._addListener(event_name, fn, context, listener_args, this._listeners)

	},

	_addListener: function(event_name, fn, context, listener_args, listeners_by_event) {

		var listener = {
			event_name: event_name,
			fn: fn,
			fn_original: fn,
			context: context,
			listener_args: listener_args
		};

		if (listeners_by_event[event_name] != null) {

			listeners_by_event[event_name].push(listener);

		} else {

			listeners_by_event[event_name] = [listener];

		}

		return listener;

	},

	/**
	 * @param {_iListener} listener
	 */
	removeListener: function(listener) {

		this._removeListener(listener, this._listeners);

	},

	_removeListener: function(listener, listeners_by_event) {

		var list = listeners_by_event[listener.event_name],
			index;

		if (list) {
			index = list.indexOf(listener);
			if (index != -1) {
				list.splice(index, 1);
				if (list.length == 0) {
					listeners_by_event[listener.event_name] = null;
				}
			}
		}

	},

	/**
	 * @param {string} event_name
	 * @param {*} [event_args]
	 */
	_fire: function(event_name, event_args) {

		if (Lava.schema.DEBUG && typeof(event_name) == "undefined") Lava.t();

		if (this._listeners[event_name] != null) {

			this._callListeners(this._listeners[event_name], event_args);

		}

	},

	/**
	 * @param {Array} listeners
	 * @param {*} event_args
	 */
	_callListeners: function(listeners, event_args) {

		var copy = listeners.slice(), // cause they may be removed during the fire cycle
			i = 0,
			count = listeners.length,
			listener;

		for (; i < count; i++) {

			listener = copy[i];
			listener.fn.call(listener.context, this, event_args, listener.listener_args);

		}

	},

	/**
	 * Does it have any listeners for given event, including suspended instances.
	 * @param {string} event_name
	 * @returns {boolean}
	 */
	_hasListeners: function(event_name) {

		return this._listeners[event_name] != null;

	}

});

Lava.define(
'Lava.mixin.Properties',
/**
 * @lends Lava.mixin.Properties#
 * @extends Lava.mixin.Observable
 * @implements _iProperties
 */
{

	Extends: 'Lava.mixin.Observable',

	// to signal other classes that this class implements Properties
	isProperties: true,

	// the actual container for properties, [property_name] => value
	_properties: {},
	_property_listeners: {},

	init: function(properties) {

		for (var name in properties) {

			this._properties[name] = properties[name];

		}

	},

	get: function(name) {

		return this._properties[name];

	},

	isset: function(name) {

		return name in this._properties;

	},

	set: function(name, value) {

		if (this._properties[name] !== value) {
			this._set(name, value);
		}

	},

	_set: function(name, value) {
		this._properties[name] = value;
		this.firePropertyChangedEvents(name);
	},

	/**
	 * @param {Object} properties_object
	 */
	setProperties: function(properties_object) {

		if (Lava.schema.DEBUG && properties_object && properties_object.isProperties) Lava.t("setProperties expects a plain JS object as an argument, not a class");

		for (var name in properties_object) {

			this.set(name, properties_object[name]);

		}

	},

	getProperties: function() {

		var result = {};
		Firestorm.extend(result, this._properties);
		return result;

	},

	firePropertyChangedEvents: function(property_name) {

		this._fire('property_changed', {name: property_name});
		this._firePropertyChanged(property_name);

	},

	/**
	 * The same, as 'on' method in Observable, but returns listener to property_name instead of event_name
	 *
	 * @param {string} event_name
	 * @param {function} fn
	 * @param {Object} [context]
	 * @param {*} [listener_args]
	 * @returns {_iListener}
	 */
	onPropertyChanged: function(event_name, fn, context, listener_args) {

		return this._addListener(event_name, fn, context, listener_args, this._property_listeners)

	},

	/**
	 * @param {_iListener} listener
	 */
	removePropertyListener: function(listener) {

		this._removeListener(listener, this._property_listeners);

	},

	/**
	 * @param {string} property_name
	 * @param {*} event_args
	 */
	_firePropertyChanged: function(property_name, event_args) {

		if (Lava.schema.DEBUG && property_name == null) Lava.t("firePropertyChanged: property_name is null");

		if (this._property_listeners[property_name] != null) {

			this._callListeners(this._property_listeners[property_name], event_args);

		}

	}

});

Lava.define(
'Lava.mixin.Refreshable',
/**
 * @lends Lava.mixin.Refreshable#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',
	level: 0,
	_requeue: false,

	_count_dependencies_waiting_refresh: 0,
	_waits_refresh: false,
	_refresh_ticket: null,

	_last_refresh_id: 0,
	_refresh_cycle_count: 0,

	_is_dirty: false,

	/**
	 * Called by view manager during refresh loop.
	 * @param refresh_id
	 * @param is_safe
	 * @returns {boolean} true in case of infinite loop
	 */
	doRefresh: function(refresh_id, is_safe) {

		if (Lava.schema.DEBUG && this._count_dependencies_waiting_refresh) Lava.t();
		if (Lava.schema.DEBUG && !this._waits_refresh && this._refresh_ticket) Lava.t();

		if (this._waits_refresh) { // to counter exceptions

			// note: the order of the following operations is important
			if (this._last_refresh_id == refresh_id) {

				if (Lava.schema.DEBUG) Lava.logError('Scope was refreshed more than once during one refresh loop');

				this._refresh_cycle_count++;
				if (this._refresh_cycle_count == Lava.schema.REFRESH_INFINITE_LOOP_THRESHOLD && !is_safe) {

					return true; // infinite loop exception

				}

			} else {

				this._last_refresh_id = refresh_id;
				this._refresh_cycle_count = 0;

			}

			this._waits_refresh = false;
			this._refresh_ticket = null;

			if (this._is_dirty) {

				this._is_dirty = false;

				this._doRefresh();

			}

			this._fire('refreshed');

		}

		return false;

	},

	_onDependencyWaitsRefresh: function() {

		this._count_dependencies_waiting_refresh++;

		if (this._waits_refresh) {

			if (this._refresh_ticket) {
				Lava.ScopeManager.cancelScopeRefresh(this._refresh_ticket, this.level);
				this._refresh_ticket = null;
			}

		} else {

			if (Lava.schema.DEBUG && this._refresh_ticket) Lava.t();

			this._waits_refresh = true;
			this._fire('waits_refresh');

		}

	},

	_onDependencyRefreshed: function() {

		if (Lava.schema.DEBUG && !this._waits_refresh) Lava.t();
		if (Lava.schema.DEBUG && this._refresh_ticket) Lava.t();

		this._count_dependencies_waiting_refresh--;

		if (this._count_dependencies_waiting_refresh == 0) {

			if (this._requeue) {

				if (Lava.schema.DEBUG && this._refresh_ticket) Lava.t();

				this._refresh_ticket = Lava.ScopeManager.scheduleScopeRefresh(this, this.level);

			} else {

				this._waits_refresh = false;

				if (this._is_dirty) {

					this._is_dirty = false;

					this._doRefresh();

				}

				this._fire('refreshed');

			}

		}

	},

	_doRefresh: function() {

		// may be overridden in inherited classes

	},

	_queueForRefresh: function() {

		if (!this._waits_refresh) {

			if (Lava.schema.DEBUG && this._refresh_ticket) Lava.t();

			this._waits_refresh = true;
			this._refresh_ticket = Lava.ScopeManager.scheduleScopeRefresh(this, this.level);
			this._fire('waits_refresh');

		}

	},

	debugAssertClean: function() {

		if (this._waits_refresh || this._refresh_ticket || this._is_dirty) Lava.t("Refreshable::debugAssertClean() failed");

	},

	isWaitingRefresh: function() {

		return this._waits_refresh;

	},

	suspendRefreshable: function() {

		if (this._refresh_ticket) {
			Lava.ScopeManager.cancelScopeRefresh(this._refresh_ticket, this.level);
			this._refresh_ticket = null;
		}

		this._waits_refresh = false;
		this._count_dependencies_waiting_refresh = 0;
		this._is_dirty = true;

	}

});
Lava.define(
'Lava.animator.Units',
/**
 * @lends Lava.animator.Units#
 */
{

	_property_name: null,
	from: 0,
	delta: 0,
	unit: null,

	/**
	 * @param {_cAnimator_Units} config
	 */
	init: function(config) {

		this._property_name = config.property;
		this.from = config.from || 0;
		this.delta = config.delta;
		this.unit = config.unit || 'px';

	},

	animate: function(element, transition_value) {

		var raw_result = this.from + this.delta * transition_value;

		Firestorm.Element.setStyle(
			element,
			this._property_name,
			Math.floor(raw_result) + this.unit
		);

	}

});

Lava.define(
'Lava.animation.Abstract',
/**
 * @lends Lava.animation.Abstract#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',

	_started_time: 0,
	_end_time: 0,
	_duration: 0,
	_target: null,
	_is_running: false,
	_is_reversed: false,
	_config: null,

	_transition: null,
	/**
	 * @type {_tGUID}
	 */
	guid: null,

	/**
	 * @param {_cAnimation} config
	 * @param target
	 */
	init: function(config, target) {

		this.guid = Lava.guid++;
		if (config.duration) {
			this._duration = config.duration;
		}
		this._target = target;
		this._transition = Lava.transitions[config.transition || 'linear'];
		this._config = config;

	},

	/**
	 * Called by Cron. Assigned in constructor.
	 * @param {number} now The current time (=new Date().getTime())
	 */
	onTimer: function(now) {

		Lava.t("This method is assigned dynamically in constructor");

	},

	_start: function(now) {

	},

	_finish: function() {

		this._is_running = false;
		this._fire('complete');

	},

	/**
	 * Start only if it's not already running
	 * @param started_time
	 */
	safeStart: function(started_time) {

		if (!this._is_running) {

			this.start(started_time);

		}

	},

	reverseDirection: function() {

		if (!this._is_reversed) {

			this._mirror();

		}

	},

	resetDirection: function() {

		if (this._is_reversed) {

			this._mirror();

		}

	},

	_mirror: function() {

		this._is_reversed = !this._is_reversed;

		if (this._is_running) {

			var now = new Date().getTime(),
				new_end = 2 * now - this._started_time;

			// it's possible in case of script lags. Must not allow negative transition values.
			if (now > this._end_time) {

				this._started_time = this._end_time;
				this._end_time = this._started_time + this._duration;

			} else {

				this._end_time = new_end;
				this._started_time = new_end - this._duration;

			}

			this._afterMirror(now);

		}

	},

	_afterMirror: function(now) {

	},

	isRunning: function() {

		return this._is_running;

	},

	getStartedTime: function() {

		return this._started_time;

	},

	getEndTime: function() {

		return this._end_time;

	},

	getDuration: function() {

		return this._duration;

	},

	isReversed: function() {

		return this._is_reversed;

	},

	getTarget: function() {

		return this._target;

	},

	setTarget: function(target) {

		this._target = target;

	}

});

Lava.define(
'Lava.animation.Standard',
/**
 * @lends Lava.animation.Standard#
 * @extends Lava.animation.Abstract
 */
{

	Extends: 'Lava.animation.Abstract',

	Shared: '_shared',

	_shared: {
		// pre-generated variants of this._callAnimators function
		call_animators: [
			function(transition_value) {},
			function(transition_value) {
				this._animators[0].animate(this._target, transition_value);
			},
			function(transition_value) {
				this._animators[0].animate(this._target, transition_value);
				this._animators[1].animate(this._target, transition_value);
			},
			function(transition_value) {
				this._animators[0].animate(this._target, transition_value);
				this._animators[1].animate(this._target, transition_value);
				this._animators[2].animate(this._target, transition_value);
			},
			function(transition_value) {
				this._animators[0].animate(this._target, transition_value);
				this._animators[1].animate(this._target, transition_value);
				this._animators[2].animate(this._target, transition_value);
				this._animators[3].animate(this._target, transition_value);
			}
		]
	},

	_percent: 0,
	_now: 0, // current animation time

	_animators: [],

	/**
	 * @param {_cAnimation} config
	 * @param target
	 */
	init: function(config, target) {

		this.Abstract$init(config, target);

		var i = 0,
			count = 0,
			animator_config;

		if ('animators' in config) {

			count = config.animators.length;

			for (; i < count; i++) {

				animator_config = config.animators[i];
				this._animators.push(new Lava.animator[animator_config.type](animator_config));

			}

		}

		if (this._shared.call_animators.length <= count) {

			this._callAnimators = this._shared.call_animators[count];

		}

		this.onTimer = this._animateDirect;

	},

	/**
	 * This function may be substituted with pre-generated function from _shared
	 *
	 * @param transition_value
	 */
	_callAnimators: function(transition_value) {

		for (var i = 0, count = this._animators.length; i < count; i++) {

			this._animators[i].animate(this._target, transition_value);

		}

	},

	/**
	 * @param now
	 */
	_animateDirect: function(now) {

		if (now < this._end_time) {

			this._callAnimators(this._transition((now - this._started_time) / this._duration));

		} else {

			this._callAnimators(this._transition(1));
			this._finish();

		}

	},

	/**
	 * @param now
	 */
	_animateReverse: function(now) {

		if (now < this._end_time) {

			this._callAnimators(this._transition(1 - (now - this._started_time) / this._duration));

		} else {

			this._callAnimators(this._transition(0));
			this._finish();

		}

	},

	start: function(started_time) {

		var now = new Date().getTime();
		this._started_time = started_time || now;
		this._end_time = this._started_time + this._duration;

		if (now < this._end_time) {

			this._is_running = true;
			Lava.Cron.acceptTask(this);
			this.onTimer(now);

		} else {

			this.onTimer(this._end_time);

		}

	},

	/**
	 * Just stop, do not fire 'complete'
	 */
	stop: function() {

		this._is_running = false;

	},

	_mirror: function() {

		this.onTimer = this._is_reversed ? this._animateDirect : this._animateReverse;
		this.Abstract$_mirror();

	},

	/**
	 * Act like the animation has ended naturally:
	 * apply the end state to the element and fire 'complete'
	 */
	finish: function() {

		if (this._is_running) {

			this.onTimer(this._end_time);

		}

	},

	setDuration: function(duration) {

		this._duration = duration;
		this._end_time = this._started_time + duration;

	}

});

Lava.define(
'Lava.animation.Collapse',
/**
 * @lends Lava.animation.Collapse#
 * @extends Lava.animation.Standard
 */
{

	Extends: 'Lava.animation.Standard',

	_shared: {
		default_config: {
			// duration is set dynamically
			transition: 'outQuad',
			animators: [{
				type: 'Units',
				property: 'height',
				delta: 0 // actual height will be set at run time
			}]
		}
	},

	_property: 'height',

	init: function(config, target) {

		var new_config = {};
		Firestorm.extend(new_config, this._shared.default_config);
		Firestorm.extend(new_config, config);

		// assuming that the first animator is Units
		if (Lava.schema.DEBUG && !new_config.animators[0].property) Lava.t("Collapse: malformed animation config");
		this._property = new_config.animators[0].property;

		this.Standard$init(new_config, target);

	},

	start: function(started_time) {

		// in case we are starting from collapsed state
		Firestorm.Element.setStyle(this._target, this._property, 'auto');
		// assuming that target is element
		var property_value = Firestorm.Element.getSize(this._target)[(this._property == 'width') ? 'x' : 'y'];
		this._animators[0].delta = property_value;
		this.setDuration(200 + Math.floor(property_value)); // time depends on distance, to make it smoother

		this.Standard$start(started_time);

	},

	_finish: function() {

		if (!this._is_reversed) {

			// animation has expanded the container, height (or width) must be unlocked to allow element to adapt it's dimensions
			// (otherwise, if children nodes are added or removed - height will remain the same)
			Firestorm.Element.setStyle(this._target, this._property, 'auto');

		}

		this.Standard$_finish();

	}

});

Lava.define(
'Lava.animation.Toggle',
/**
 * Primary purpose of this class: emulate animation support in cases when it's not enabled.
 * @lends Lava.animation.Toggle#
 * @extends Lava.animation.Standard
 */
{

	Extends: 'Lava.animation.Standard',

	_finish: function() {

		Firestorm.Element.setStyle(this._target, 'display', this._is_reversed ? 'none' : 'block');

		this.Standard$_finish();

	}

});

Lava.define(
'Lava.animation.Emulated',
/**
 * @lends Lava.animation.Emulated#
 * @extends Lava.animation.Abstract
 */
{

	Extends: 'Lava.animation.Abstract',

	isEmulatedAnimation: true,

	_timeout: 0,

	init: function(config, target) {

		this.Abstract$init(config, target);

		var self = this;
		this.onTimer = function() {
			self._onTimeout();
		}

	},

	_onTimeout: function() {

		this._timeout = null;
		this._end();
		this._finish();

	},

	_end: function() {

	},

	_cancelTimeout: function() {
		if (this._timeout) {
			window.clearTimeout(this._timeout);
			this._timeout = null;
		}
	},

	start: function() {

		if (this._is_running) {
			this.stop();
		}

		this._is_running = true;
		this._start();
		this._timeout = window.setTimeout(this.onTimer, this._duration);

	},

	_start: function() {

	},

	stop: function() {

		if (this._is_running) {
			this._is_running = false;
			this._cancelTimeout();
		}

	},

	_mirror: function() {

		if (this._is_running) {
			this.stop();
			this._reverse();
			this._is_running = true;
			// any CSS transition takes fixed amount of time
			this._timeout = window.setTimeout(this.onTimer, this._duration);
		}

		this._is_reversed = !this._is_reversed;

	},

	/**
	 * Reverse the animation while it's still running
	 */
	_reverse: function() {

	},

	finish: function() {

		if (this._is_running) {
			this._cancelTimeout();
			this._onTimeout();
		}

	},

	_assertStopped: function() {

		if (this._is_running) {

			if (Lava.schema.DEBUG) {

				Lava.t("Emulated animation: call to state changing function while the animation is running");

			} else {

				Lava.logError("Emulated animation: call to state changing function while the animation is running");

			}

		}

	}

});

Lava.define(
'Lava.animation.BootstrapCollapse',
/**
 * @lends Lava.animation.BootstrapCollapse#
 * @extends Lava.animation.Emulated
 */
{

	Extends: 'Lava.animation.Emulated',

	_duration: 350,
	/**
	 * 'width' or 'height'
	 */
	_property: 'height',
	/**
	 * The value of width (or height) the animation has started with. Updated every time the animation starts.
	 */
	_property_value: 0,

	init: function(config, target) {

		this.Emulated$init(config, target);

		if (config.property) {
			this._property = config.property;
		}

	},

	_start: function() {

		var redraw,
			Element = Firestorm.Element;

		if (this._is_reversed) { // collapse an element that is currently open

			// explicitly set the height/width on the element to make transition happen
			this._property_value = Element.getSize(this._target)[(this._property == 'width') ? 'x' : 'y'];
			Element.setStyle(this._target, this._property, this._property_value);
			redraw = this._target.offsetHeight; // force redraw to bypass browser optimizations
			Element.addClass(this._target, 'collapsing');
			Element.removeClasses(this._target, ['collapse', 'in']);
			Element.setStyle(this._target, this._property, 0);

		} else { // expand a collapsed element

			Element.removeClass(this._target, 'collapse');
			Element.setStyle(this._target, this._property, 'auto');
			this._property_value = Element.getSize(this._target)[(this._property == 'width') ? 'x' : 'y'];
			Element.setStyle(this._target, this._property, 0);
			redraw = this._target.offsetHeight; // force redraw to bypass browser optimizations
			Element.addClass(this._target, 'collapsing');
			Element.setStyle(this._target, this._property, this._property_value);

		}

	},

	_end: function() {

		var Element = Firestorm.Element;

		if (this._is_reversed) {

			Element.removeClass(this._target, 'collapsing');
			Element.addClass(this._target, 'collapse');

		} else {

			Element.removeClass(this._target, 'collapsing');
			Element.addClasses(this._target, ['collapse', 'in']);
			Element.setStyle(this._target, this._property, 'auto');

		}

	},

	_reverse: function() {

		if (this._is_reversed) {

			Firestorm.Element.setStyle(this._target, this._property, this._property_value);

		} else {

			Firestorm.Element.setStyle(this._target, this._property, 0);

		}

	}

});

Lava.define(
'Lava.system.Enumerable',
/**
 * @lends Lava.system.Enumerable#
 * @extends Lava.mixin.Properties
 */
{

	Extends: 'Lava.mixin.Properties',
	Shared: ['SOURCE_OBJECT_TYPES'],

	isEnumerable: true,

	guid: null,

	_data_uids: [], // [index] => uid
	_data_values: [], // [index] => value
	// will hold keys, when Enumerable was constructed from object
	_data_names: [], // [index] => name
	_source_object: null,
	_source_object_type: null,
	_count: 0,

	_uid: 1,

	/**
	 * @enum {number}
	 * @const
	 */
	SOURCE_OBJECT_TYPES: {
		OBJECT: 0,
		ARRAY: 1,
		ENUMERABLE: 2,
		PROPERTIES: 3
	},

	init: function(data_source) {

		this.guid = Lava.guid++;

		if (data_source) {

			var count = 0,
				i = 0;

			this.setSourceObject(data_source);

			if (this._source_object_type == this.SOURCE_OBJECT_TYPES.ARRAY) {

				for (count = data_source.length; i < count; i++) {

					this._push(this._uid++, data_source[i], null);

				}

			} else if (this._source_object_type == this.SOURCE_OBJECT_TYPES.ENUMERABLE) {

				this._data_names = data_source.getNames();
				this._data_values = data_source.getValues();
				this._data_uids = data_source.getUIDs();

			} else if (this._source_object_type == this.SOURCE_OBJECT_TYPES.PROPERTIES) {

				this._initFromObject(data_source.getProperties());

			} else {

				this._initFromObject(data_source);

			}

			this._count = this._data_uids.length;

		}

	},

	_initFromObject: function(data_source) {

		for (var name in data_source) {

			this._push(this._uid++, data_source[name], name);

		}

	},

	_push: function(uid, value, name) {

		this._data_uids.push(uid);
		this._data_values.push(value);
		this._data_names.push(name);

	},

	_assignStorage: function(storage) {

		this._data_uids = storage.uids;
		this._data_values = storage.values;
		this._data_names = storage.names;

	},

	hasSourceObject: function() {

		return this._source_object !== null;

	},

	isEmpty: function() {

		return this._count == 0;

	},

	getCount: function() {

		return this._count;

	},

	get: function(name) {

		return (name == 'length') ? this._count : null;

	},

	getUIDs: function() {

		// we need to copy the local array, to protect it from being altered outside of the class
		return this._data_uids.slice();

	},

	getValues: function() {

		return this._data_values.slice();

	},

	getNames: function() {

		return this._data_names.slice();

	},

	/**
	 * Create an object with [uid] => value structure
	 * @returns {{}}
	 */
	getValuesHash: function() {

		var result = {},
			i = 0;

		for (; i < this._count; i++) {

			result[this._data_uids[i]] = this._data_values[i];

		}

		return result;

	},

	/**
	 * Warning: this map may change with any operation
	 * @returns {{}} An object with keys being collection's internal UIDs and array indexes as values.
	 */
	getUIDToIndexMap: function() {

		var result = {},
			i = 0;

		for (; i < this._count; i++) {

			result[this._data_uids[i]] = i;

		}

		return result;

	},

	getValueByLocalUID: function(uid) {

		var index = this._data_uids.indexOf(uid);

		return (index != -1) ? this._data_values[index] : null;

	},

	getUIDAt: function(index) {

		return this._data_uids[index];

	},

	getValueAt: function(index) {

		return this._data_values[index];

	},

	getNameAt: function(index) {

		return this._data_names[index];

	},

	containsValue: function(value) {

		var i = 0,
			result = false;

		for (; i < this._count; i++) {

			if (this._data_values[i] === value) {
				result = true;
				break;
			}

		}

		return result;

	},

	containsLocalUID: function(uid) {

		return this._data_uids.indexOf(uid) != -1;

	},

	indexOfValue: function(value) {

		return this._data_values.indexOf(value);

	},

	indexOfUID: function(uid) {

		return this._data_uids.indexOf(uid);

	},

	set: function() {

		Lava.t('set on Enumerable is not permitted');

	},

	_setLength: function(new_length) {

		this._count = new_length;
		this.firePropertyChangedEvents('length');

	},

	replaceAt: function(index, value, name) {

		if (index > this._count) Lava.t("Index is out of range");

		var old_uid = this._data_uids[index],
			old_value = this._data_values[index],
			old_name = this._data_names[index],
			new_uid = this._uid++;

		this._data_uids[index] = new_uid;
		this._data_values[index] = value;
		if (name) {
			this._data_names[index] = name;
		}

		this._fire('items_removed', {
			uids: [old_uid],
			values: [old_value],
			names: [old_name]
		});

		this._fire('items_added', {
			uids: [new_uid],
			values: [value],
			names: [this._data_names[index]]
		});

		this._fire('collection_changed');

	},

	swap: function(index_a, index_b) {

		if (index_a > this._count || index_b > this._count) Lava.t("Index is out of range (2)");

		var swap = Firestorm.Array.swap;

		swap(this._data_uids, index_a, index_b);
		swap(this._data_values, index_a, index_b);
		swap(this._data_names, index_a, index_b);

		this._fire('collection_changed');

	},

	push: function(value, name) {

		var count = this._count,
			new_uid = this._uid++;

		this._push(new_uid, value, name || null);

		this._setLength(count + 1);

		this._fire('items_added', {
			uids: [new_uid],
			values: [value],
			names: [name || null]
		});

		this._fire('collection_changed');

		return this._count; // after _setLength() this was incremented by one

	},

	pop: function() {

		var old_uid = this._data_uids.pop(),
			old_value = this._data_values.pop(),
			old_name = this._data_names.pop(),
			count = this._count - 1;

		this._setLength(count);

		this._fire('items_removed', {
			uids: [old_uid],
			values: [old_value],
			names: [old_name]
		});

		this._fire('collection_changed');

		return old_value;
	},

	each: function(callback) {

		// everything is copied in case the collection is modified during the cycle
		var values = this._data_values.slice(),
			uids = this._data_uids.slice(),
			names = this._data_names.slice(),
			i = 0,
			count = this._count;

		for (; i < count; i++) {

			if (callback(values[i], uids[i], names[i], i) === false) {
				break;
			}

		}

	},

	/**
	 * Removes the first occurrence of value within collection.
	 *
	 * @param {*} value
	 * @returns {boolean} Whether the value existed.
	 */
	removeValue: function(value) {

		var result = false,
			index = this._data_values.indexOf(value);

		if (index != -1) {
			this.removeAt(index);
			result = true;
		}

		return result;

	},

	includeValue: function(value) {

		var result = false,
			index = this._data_values.indexOf(value);

		if (index == -1) {
			this.push(value);
			result = true;
		}

		return result;

	},

	setSourceObject: function(data_source) {

		if (Lava.schema.DEBUG && typeof(data_source) != 'object') Lava.t("Wrong argument supplied for Enumerable constructor");
		this._source_object = data_source;
		this._source_object_type = Array.isArray(data_source)
			? this.SOURCE_OBJECT_TYPES.ARRAY
			: (data_source.isEnumerable
				? this.SOURCE_OBJECT_TYPES.ENUMERABLE
				: (data_source.isProperties
					? this.SOURCE_OBJECT_TYPES.PROPERTIES
					: this.SOURCE_OBJECT_TYPES.OBJECT));

	},

	updateFromSourceObject: function() {

		if (Lava.schema.DEBUG && !this._source_object) Lava.t("Enumerable was not created from object");

		switch (this._source_object_type) {
			case this.SOURCE_OBJECT_TYPES.PROPERTIES:
				this._updateFromObject(this._source_object.getProperties());
				break;
			case this.SOURCE_OBJECT_TYPES.OBJECT:
				this._updateFromObject(this._source_object);
				break;
			case this.SOURCE_OBJECT_TYPES.ARRAY:
				this._updateFromArray(this._source_object);
				break;
			case this.SOURCE_OBJECT_TYPES.ENUMERABLE:
				this._updateFromEnumerable(this._source_object);
				break;
			default:
				Lava.t();
		}

	},

	_updateFromArray: function(source_array) {

		var new_count = source_array.length,
			count = (new_count < this._count) ? new_count : this._count,
			i = 0,
			uid,
			result = this._createHelperStorage(),
			removed = this._createHelperStorage(),
			added = this._createHelperStorage();

		for (; i < count; i++) {

			if (this._data_values[i] === source_array[i]) {
				result.push(this._data_uids[i], this._data_values[i], this._data_names[i]);
			} else {
				uid = this._uid++;
				added.push(uid, source_array[i], null);
				result.push(uid, source_array[i], null);
			}

		}

		if (new_count < this._count) {

			for (i = count; i < new_count; i++) {

				uid = this._uid++;
				added.push(uid, source_array[i], null);
				result.push(uid, source_array[i], null);

			}

		} else {

			for (i = count; i < this._count; i++) {

				removed.push(this._data_uids[i], this._data_values[i], this._data_names[i]);

			}

		}

		this._assignStorage(result);
		this._setLength(this._data_uids.length);

		removed.uids.length && this._fire('items_removed', removed.getObject());
		added.uids.length && this._fire('items_added', added.getObject());
		this._fire('collection_changed');

	},

	_updateFromEnumerable: function(data_source) {

		var new_names = data_source.getNames(),
			new_values = data_source.getValues(),
			new_uids = data_source.getUIDs(),
			i,
			count,
			uid,
			old_uids_hash = {},
			new_uids_hash = {},
			removed = this._createHelperStorage(),
			added = this._createHelperStorage();

		for (i = 0, count = new_uids.length; i < count; i++) {
			new_uids_hash[new_uids[i]] = true;
		}

		for (i = 0, count = this._count; i < count; i++) {
			uid = this._data_uids[i];
			old_uids_hash[uid] = true;
			if (!(uid in new_uids_hash)) {
				removed.push(uid, this._data_values[i], this._data_names[i]);
			}
		}

		for (i = 0, count = new_uids.length; i < count; i++) {
			uid = new_uids[i];
			if (!(uid in old_uids_hash)) {
				added.push(uid, new_values[i], new_names[i]);
			}
		}

		this._data_names = new_names;
		this._data_values = new_values;
		this._data_uids = new_uids;
		this._setLength(this._data_uids.length);

		removed.uids.length && this._fire('items_removed', removed.getObject());
		added.uids.length && this._fire('items_added', added.getObject());
		this._fire('collection_changed');

	},

	_updateFromObject: function(source_object) {

		var i = 0,
			name,
			uid,
			result = this._createHelperStorage(),
			removed = this._createHelperStorage(),
			added = this._createHelperStorage();

		for (; i < this._count; i++) {

			name = this._data_names[i];
			if (name in source_object) {

				if (source_object[name] === this._data_values[i]) {

					result.push(this._data_uids[i], this._data_values[i], this._data_names[i]);

				} else {

					// Attention: the name has NOT changed, but it will be present in both added and removed names!
					removed.push(this._data_uids[i], this._data_values[i], name);
					uid = this._uid++;
					result.push(uid, source_object[name], name);
					added.push(uid, source_object[name], name);

				}

			} else {

				removed.push(this._data_uids[i], this._data_values[i], this._data_names[i]);

			}

		}

		for (name in source_object) {

			if (this._data_names.indexOf(name) == -1) {

				uid = this._uid++;
				result.push(uid, source_object[name], name);
				added.push(uid, source_object[name], name);

			}

		}

		this._assignStorage(result);
		this._setLength(this._data_uids.length);

		removed.uids.length && this._fire('items_removed', removed.getObject());
		added.uids.length && this._fire('items_added', added.getObject());
		this._fire('collection_changed');

	},

	/**
	 * Accepts a function with the following parameters:
	 * function(value, name, uid)
	 * Callback must return TRUE if element needs to stay in the collection, otherwise it will be removed.
	 *
	 * @param {function(*, string, number)} callback
	 */
	filter: function(callback) {

		var i = 0,
			count = this._count,
			result = this._createHelperStorage(),
			removed = this._createHelperStorage();

		for (; i < count; i++) {

			if (callback(this._data_values[i], this._data_names[i], this._data_uids[i])) {

				result.push(this._data_uids[i], this._data_values[i], this._data_names[i]);

			} else {

				removed.push(this._data_uids[i], this._data_values[i], this._data_names[i]);

			}

		}

		this._assignStorage(result);
		this._setLength(this._data_uids.length);

		removed.uids.length && this._fire('items_removed', removed.getObject());

		this._fire('collection_changed');

	},

	/**
	 * @param {function(*, *):boolean} [less] A callback to compare items
	 * @param {string} [algorithm] The name of the sorting method from Lava.algorithms.sorting
	 */
	sort: function(less, algorithm) {

		this._sort(less, algorithm, this._data_values);

	},

	/**
	 * Sort by the array of names.
	 * @param {function(*, *):boolean} [less] A callback to compare items
	 * @param {string} [algorithm] The name of the sorting method from Lava.algorithms.sorting
	 */
	sortByNames: function(less, algorithm) {

		this._sort(less, algorithm, this._data_names);

	},

	_sort: function(less, algorithm, values) {

		var indices = [],
			i = 0,
			_less;

		_less = function(a, b) {

			// a and b are indices, not actual values
			return less(values[a], values[b]);

		};

		for (; i < this._count; i++) {

			indices.push(i);

		}

		indices = Lava.algorithms.sorting[algorithm || Lava.schema.data.DEFAULT_SORT_ALGORITHM](indices, _less);

		this.reorder(indices);

	},

	reorder: function(new_indices) {

		var i = 0,
			result = this._createHelperStorage(),
			index,
			verification = {};

		if (Lava.schema.DEBUG && new_indices.length != this._count) throw "reorder: new item count is less than current";

		for (; i < this._count; i++) {

			index = new_indices[i];
			result.push(this._data_uids[index], this._data_values[index], this._data_names[index]);

			if (Lava.schema.DEBUG) {
				// duplicate UIDs may break a lot of functionality, in this class and outside
				if (index in verification) Lava.t("Malformed index array");
				verification[index] = null;
			}

		}

		this._assignStorage(result);
		this._fire('collection_changed');

	},

	removeRange: function(start_index, count) {

		if (count <= 0) Lava.t("Invalid item count supplied for removeRange");
		if (start_index + count >= this._count + 1) Lava.t("Index is out of range");

		var removed_uids = this._data_uids.splice(start_index, count),
			removed_values = this._data_values.splice(start_index, count),
			removed_names = this._data_names.splice(start_index, count);

		this._setLength(this._count - count);

		this._fire('items_removed', {
			uids: removed_uids,
			values: removed_values,
			names: removed_names
		});

		this._fire('collection_changed');

		return removed_values;

	},

	insertRange: function(start_index, values, names) {

		if (start_index >= this._count) Lava.t("Index is out of range");

		var i = 0,
			count = values.length,
			added_uids = [],
			added_names = [];

		if (names) {

			if (count != names.length) Lava.t("If names array is provided, it must be equal length with values array.");
			added_names = names;

		} else {

			for (; i < count; i++) {

				added_names.push(null);

			}

		}

		for (; i < count; i++) {

			added_uids.push(this._uid++);

		}

		if (start_index == 0) {

			// prepend to beginning
			this._data_uids = added_uids.concat(this._data_uids);
			this._data_values = values.concat(this._data_values);
			this._data_names = added_names.concat(this._data_names);

		} else if (start_index == this._count - 1) {

			// append to the end
			this._data_uids = this._data_uids.concat(added_uids);
			this._data_values = this._data_values.concat(values);
			this._data_names = this._data_names.concat(added_names);

		} else {

			this._data_uids = this._data_uids.slice(0, start_index).concat(added_uids).concat(this._data_uids.slice(start_index));
			this._data_values = this._data_values.slice(0, start_index).concat(values).concat(this._data_values.slice(start_index));
			this._data_names = this._data_names.slice(0, start_index).concat(added_names).concat(this._data_names.slice(start_index));

		}

		this._setLength(this._count + count);

		this._fire('items_added', {
			uids: added_uids,
			values: values,
			names: added_names
		});

		this._fire('collection_changed');

	},

	append: function(values, names) {

		this.insertRange(this._count, values, names);

	},

	/**
	 * Remove all records
	 */
	removeAll: function() {

		return (this._count > 0) ? this.removeRange(0, this._count) : [];

	},

	insertAt: function(index, value, name) {

		this.insertRange(index, [value], [name]);

	},

	unshift: function(value, name) {

		this.insertRange(0, [value], [name]);

	},

	removeAt: function(index) {

		return this.removeRange(index, 1)[0];

	},

	shift: function() {

		return this.removeRange(0, 1)[0];

	},

	/**
	 * Create an internal helper object. The purpose is to write less code.
	 * @returns {{uids: Array, values: Array, names: Array, push: push, getObject: getObject}}
	 */
	_createHelperStorage: function() {

		return {
			uids: [],
			values: [],
			names: [],
			push: function(uid, value, name) {
				this.uids.push(uid);
				this.values.push(value);
				this.names.push(name);
			},
			getObject: function() {
				return {
					uids: this.uids,
					values: this.values,
					names: this.names
				}
			}
		}

	},

	destroy: function() {

		this._fire('destroy');

	}

});

Lava.define(
'Lava.system.Template',
/**
 * @lends Lava.system.Template#
 * @implements _iViewHierarchyMember
 */
{

	Shared: ['_block_handlers_map'],

	isTemplate: true,

	_widget: null,
	_parent_view: null,
	_config: null,
	_count: 0,
	_contents: [],
	_is_inDOM: false,
	_is_sleeping: false,
	guid: null,

	_block_handlers_map: {
		'string': '_createDirect',
		view: '_createView',
		widget: '_createView',
		include: '_createInclude',
		static_value: '_createStaticValue',
		static_eval: '_createStaticEval',
		static_tag: '_createStaticTag'
	},

	/**
	 * @param {_tTemplate} template_config
	 * @param {Lava.widget.Standard} widget
	 * @param {Lava.view.Abstract} parent_view
	 * @param {Object} child_properties
	 */
	init: function(template_config, widget, parent_view, child_properties) {

		this.guid = Lava.guid++;
		this._parent_view = parent_view;
		this._widget = widget;
		this._config = template_config;

		this._createChildren(this._contents, template_config, [], child_properties);
		this._count = this._contents.length;

	},

	/**
	 * @param {Array.<_tRenderable>} result
	 * @param {_tTemplate} children_config
	 * @param {Array.<string>} include_name_stack
	 * @param {Object} properties
	 */
	_createChildren: function(result, children_config, include_name_stack, properties) {

		var i = 0,
			count = children_config.length,
			childConfig,
			type;

		for (; i < count; i++) {

			childConfig = children_config[i];
			type = typeof(childConfig);
			if (type == 'object') type = childConfig.type;

			if (Lava.schema.DEBUG && !(type in this._block_handlers_map)) Lava.t("Unsupported template item type: " + type);
			this[this._block_handlers_map[type]](result, childConfig, include_name_stack, properties);

		}

	},

	_createDirect: function(result, childConfig) {

		result.push(childConfig);

	},

	_createView: function(result, childConfig, include_name_stack, properties) {

		var constructor = Lava.ClassManager.getConstructor(childConfig['class'], 'Lava.view'),
			view = new constructor(
				childConfig,
				this._widget,
				this._parent_view,
				this, // template
				properties
			);

		view.template_index = result.push(view) - 1;

	},

	_createInclude: function(result, child_config, include_name_stack, properties) {

		if (include_name_stack.indexOf(child_config.name) != -1) Lava.t("Infinite include recursion");
		var include = Lava.view_manager.getInclude(this._parent_view, child_config);
		if (Lava.schema.DEBUG && include == null) Lava.t("Include not found: " + child_config.name);

		include_name_stack.push(child_config.name);
		this._createChildren(result, include, include_name_stack, properties);
		include_name_stack.pop();

	},

	/**
	 * @param result
	 * @param {_cStaticValue} childConfig
	 * @param include_name_stack
	 * @param properties
	 */
	_createStaticValue: function(result, childConfig, include_name_stack, properties) {

		var resource_id = childConfig.resource_id,
			resource_owner = Lava.view_manager.locateTarget(this._widget, resource_id.locator_type, resource_id.locator),
			resource_value,
			type;

		if (!Lava.schema.RESOURCES_ENABLED) Lava.t("static_value: resources are disabled");
		if (Lava.schema.DEBUG && !resource_owner) Lava.t("Resource owner not found: " + resource_id.locator_type + '=' + resource_id.locator);

		resource_value = resource_owner.getResource(resource_id.name);
		if (Lava.schema.DEBUG && !resource_value) Lava.t("static_value: resource not found: " + resource_id.locator_type + '=' + resource_id.locator);
		if (['string', 'number', 'boolean', 'translate'].indexOf(resource_value.type) == -1) Lava.t("static_value: resource has wrong type");

		result.push(resource_value.value);

	},

	/**
	 * @param result
	 * @param {_cStaticEval} childConfig
	 * @param include_name_stack
	 * @param properties
	 */
	_createStaticEval: function(result, childConfig, include_name_stack, properties) {

		var argument = new Lava.scope.Argument(childConfig.argument, this._view, this._widget);
		// if this happens - than you are probably doing something wrong
		if (argument.isWaitingRefresh()) {
			if (Lava.schema.DEBUG) Lava.t("static_eval wrong usage: created argument is dirty");
			Lava.logError("static_eval wrong usage: created argument is dirty");
		}
		result.push(argument.getValue + '');
		argument.destroy();

	},

	/**
	 * @param result
	 * @param {_cStaticTag} child_config
	 * @param include_name_stack
	 * @param properties
	 */
	_createStaticTag: function(result, child_config, include_name_stack, properties) {

		var resource_id = child_config.resource_id,
			resource_owner,
			container_resources,
			serialized_tag = '<' + child_config.name,
			result_styles = [],
			name,
			is_void = Lava.isVoidTag(child_config.name),

			static_properties,
			static_classes,
			static_styles;

		if (Lava.schema.RESOURCES_ENABLED) {
			resource_owner = Lava.view_manager.locateTarget(this._widget, resource_id.locator_type, resource_id.locator);
			if (Lava.schema.DEBUG && !resource_owner) Lava.t("Resource owner not found: " + resource_id.locator_type + '=' + resource_id.locator);
			container_resources = resource_owner.getResource(resource_id.name);
		}

		if (Lava.schema.DEBUG && !Lava.schema.RESOURCES_ENABLED) Lava.t("Unable to render a static container: resources are disabled");
		if (Lava.schema.DEBUG && !container_resources) Lava.t("Static container, resources not found: " + resource_id.name);
		if (Lava.schema.DEBUG && container_resources.type != 'container') Lava.t("Malformed/invalid container resource: " + resource_id.locator_type + '=' + resource_id.locator);

		static_properties = container_resources.value['static_properties'];
		static_classes = container_resources.value['static_classes'];
		static_styles = container_resources.value['static_styles'];

		if (static_properties) {
			serialized_tag += Lava.parsers.Common.renderTagAttributes(static_properties);
		}

		if (static_classes) {
			serialized_tag += ' class="' + static_classes.join(' ') + '"';
		}

		if (static_styles) {

			for (name in static_styles) {

				result_styles.push(name + ':' + static_styles);

			}

			serialized_tag += ' style="' + result_styles.join(';') + '"';

		}

		if (child_config.template) {

			if (Lava.schema.DEBUG && is_void) Lava.t();

			result.push(serialized_tag + '>');
			this._createChildren(result, child_config.template, include_name_stack, properties);
			result.push('</' + child_config.name + '>');

		} else {

			serialized_tag += is_void ? '/>' : '></' + child_config.name + '>';
			result.push(serialized_tag);

		}

	},

	/**
	 * @param {string} function_name
	 */
	_broadcast: function(function_name) {

		for (var i = 0; i < this._count; i++) {

			if (this._contents[i].isView) {

				this._contents[i][function_name]();

			}

		}

	},

	/**
	 * @returns {string}
	 */
	render: function() {

		var buffer = '',
			i = 0,
			contents = this._contents;

		this._is_sleeping = false;

		for (; i < this._count; i++) {

			if (typeof(contents[i]) == 'string') {

				buffer += contents[i];

			} else if (typeof(contents[i]) == 'function') {

				Lava.t("Not implemented");

			} else {

				buffer += contents[i].render();

			}

		}

		return buffer;

	},

	broadcastRemove: function() {

		if (this._is_inDOM) {

			this._is_sleeping = true;
			this._is_inDOM = false;
			this._broadcast('broadcastRemove');

		}

	},

	broadcastInDOM: function() {

		this._is_inDOM = true;
		this._broadcast('broadcastInDOM');

	},

	broadcastSleep: function() {

		if (Lava.schema.DEBUG && !this._is_inDOM) Lava.t();

		this._is_sleeping = true;
		this._broadcast('broadcastSleep');

	},

	broadcastWakeup: function() {

		if (Lava.schema.DEBUG && !this._is_inDOM) Lava.t();

		this._is_sleeping = false;
		this._broadcast('broadcastWakeup');

	},

	batchSetProperty: function(name, value) {

		for (var i = 0; i < this._count; i++) {

			if (this._contents[i].isView) {

				this._contents[i].set(name, value);

			}

		}

	},

	batchSetProperties: function(properties_object) {

		for (var i = 0; i < this._count; i++) {

			if (this._contents[i].isView) {

				this._contents[i].setProperties(properties_object);

			}

		}

	},

	getFirstView: function() {

		return this._seekForwards(0);

	},

	getLastView: function() {

		return this._seekBackwards(this._count - 1);

	},

	getPreviousView: function(view) {

		return this._seekBackwards(view.template_index - 1);

	},

	getNextView: function(view) {

		return this._seekForwards(view.template_index + 1);

	},

	/**
	 * Warning: codestyle violation
	 * @returns {Lava.view.Abstract}
	 */
	_seekForwards: function(i) {

		while (i < this._count) {
			if (this._contents[i].isView) {
				return this._contents[i];
			}
			i++;
		}

		return null;

	},

	/**
	 * Warning: codestyle violation
	 * @returns {Lava.view.Abstract}
	 */
	_seekBackwards: function(i) {

		while (i >= 0) {
			if (this._contents[i].isView) {
				return this._contents[i];
			}
			i--;
		}

		return null;

	},

	getViewsByLabel: function(label) {

		var result = [],
			i = 0;

		for (; i < this._count; i++) {

			if (this._contents[i].isView && this._contents[i].label == label) {

				result.push(this._contents[i]);

			}

		}

		return result;

	},

	getWidgetsByName: function(name) {

		var result = [],
			i = 0;

		for (; i < this._count; i++) {

			if (this._contents[i].isWidget && this._contents[i].name == name) {

				result.push(this._contents[i]);

			}

		}

		return result;

	},

	getCount: function() {

		return this._count;

	},

	getAt: function(index) {

		return this._contents[index];

	},

	isInDOM: function() {

		return this._is_inDOM;

	},

	isSleeping: function() {

		return this._is_sleeping;

	},

	destroy: function() {

		this._broadcast('destroy');
		this._contents = null;

	}

});

Lava.define(
'Lava.system.ViewManager',
/**
 * @lends Lava.system.ViewManager#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',

	// views and widgets, sorted by depth level. [level][views_array]
	_dirty_views: [],
	_views_refreshing: false,

	/**
	 * @type {Object.<string, Lava.view.Abstract>}
	 */
	_views_by_id: {},
	/**
	 * @type {Object.<*, Lava.view.Abstract>}
	 */
	_views_by_guid: {},

	/**
	 * @type {Object.<string, Array.<Lava.widget.Standard>>}
	 */
	_global_role_targets: {},
	/**
	 * @type {Object.<string, Array.<Lava.widget.Standard>>}
	 */
	_global_event_targets: {},

	_old_mouseover_target: null,
	_old_mouseover_view_stack: [],
	_new_mouseover_target: null,
	_new_mouseover_view_stack: [],

	_event_usage_counters: {},
	_events_listeners: {
		mouseover: null,
		mouseout: null
	},

	_cancel_bubble: false,
	_is_bubble_cancellable: false,

	init: function() {

		var default_events = Lava.schema.system.DEFAULT_EVENTS,
			i = 0,
			count = default_events.length;

		for (; i < count; i++) {

			this._event_usage_counters[default_events[i]] = 1;
			this._initEvent(default_events[i]);

		}

	},

	/**
	 * @param {Lava.view.View} view
	 */
	scheduleViewRefresh: function(view) {

		if (this._views_refreshing) Lava.t("Views may not become dirty while they are being refreshed");

		if (view.depth in this._dirty_views) {

			this._dirty_views[view.depth].push(view);

		} else {

			this._dirty_views[view.depth] = [view];

		}

	},

	refresh: function() {

		var level = 0,
			deepness,
			views_list,
			i,
			count;

		if (Lava.Core.isProcessingEvent()) {
			Lava.logError("ViewManager::refresh() may not be manually called in event listeners");
			return;
		}

		Lava.ScopeManager.refreshScopes();

		deepness = this._dirty_views.length;

		if (deepness) {

			this._views_refreshing = true;

			for (; level < deepness; level++) {

				if (level in this._dirty_views) {

					views_list = this._dirty_views[level];

					for (i = 0, count = views_list.length; i < count; i++) {

						views_list[i].refresh();

					}

				}

			}

			this._views_refreshing = false;

			this._dirty_views = [];

		}

	},

	/**
	 * @param {Lava.view.Abstract} instance
	 */
	registerView: function(instance) {

		this._views_by_guid[instance.guid] = instance;

		if (instance.id) {

			if (instance.id in this._views_by_id) Lava.t("Duplicate view id: " + instance.id);

			if (Lava.schema.DEBUG && !Lava.isValidId(instance.id)) Lava.t(); // Element ID is either malformed or conflicts with framework id patterns

			this._views_by_id[instance.id] = instance;

		}

	},

	unregisterView: function(instance) {

		delete this._views_by_guid[instance.guid];

		if (instance.id) {

			delete this._views_by_id[instance.id];

		}

	},

	/**
	 * @param {string} id
	 * @returns {Lava.view.Abstract}
	 */
	getViewById: function(id) {

		return this._views_by_id[id];

	},

	/**
	 * @param {_tGUID} guid
	 * @returns {Lava.view.Abstract}
	 */
	getViewByGuid: function(guid) {

		return this._views_by_guid[guid];

	},

	_locateWidgetById: function(starting_widget, id) {

		if (Lava.schema.DEBUG && !id) Lava.t();

		return this._views_by_id[id];

	},

	_locateWidgetByGuid: function(starting_widget, guid) {

		if (Lava.schema.DEBUG && !guid) Lava.t();

		return this._views_by_guid[guid];

	},

	_locateWidgetByName: function(widget, name) {

		if (Lava.schema.DEBUG && !name) Lava.t();

		while (widget && widget.name != name) {

			widget = widget.getParentWidget();

		}

		return widget;

	},

	_locateWidgetByLabel: function(widget, label) {

		if (Lava.schema.DEBUG && !label) Lava.t();

		// Targets are different from view locators, there must be no hardcoded '@widget' label, like in views
		// (it may be very harmful. Use widget names instead!)

		if (label == 'root') {

			while (widget.getParentWidget()) {

				widget = widget.getParentWidget();

			}

		} else {

			while (widget && widget.label != label) {

				widget = widget.getParentWidget();

			}

		}

		return widget;

	},

	/**
	 * @param {Lava.widget.Standard} starting_widget
	 * @param {string} locator_type
	 * @param {string} locator
	 * @returns {Lava.widget.Standard}
	 */
	locateTarget: function(starting_widget, locator_type, locator) {

		return this['_locateWidgetBy' + locator_type](starting_widget, locator);

	},

	/**
	 * Warning! Violates codestyle with multiple return statements.
	 *
	 * @param {Lava.view.Abstract} view
	 * @param {Array.<_cTarget>} targets
	 * @param {function} callback
	 * @param {*} callback_arguments
	 * @param {Object.<string, Array>} global_targets_object
	 */
	_dispatchCallback: function(view, targets, callback, callback_arguments, global_targets_object) {

		var i = 0,
			count = targets.length,
			target,
			target_name,
			widget,
			template_arguments,
			bubble_index = 0,
			bubble_targets_count;

		for (; i < count; i++) {

			target = targets[i];
			target_name = target.name;
			template_arguments = ('arguments' in target) ? this._evalTargetArguments(view, target) : null;
			widget = null;

			if ('locator_type' in target) {

				/*
				 Note: there is similar view location mechanism in view.Abstract, but the algorithms are different:
				 when ViewManager seeks by label - it searches only for widgets, while view checks all views in hierarchy.
				 Also, hardcoded labels differ.
				 */
				widget = this['_locateWidgetBy' + target.locator_type](view.getWidget(), target.locator);

				if (!widget) {

					Lava.logError('ViewManager: callback target (widget) not found');

				} else if (!widget.isWidget) {

					Lava.logError('ViewManager: callback target is not a widget');

				} else if (!callback(widget, target_name, view, template_arguments, callback_arguments)) {

					Lava.logError('ViewManager: targeted widget did not handle the role or event: ' + target_name);

				}

			} else {

				// bubble
				widget = view.getWidget();

				do {

					callback(widget, target_name, view, template_arguments, callback_arguments);

					if (this._cancel_bubble) {
						return;
					}

					widget = widget.getParentWidget();

				} while (widget);

				if (target_name in global_targets_object) {

					for (bubble_targets_count = global_targets_object[target_name].length; bubble_index < bubble_targets_count; bubble_index++) {

						callback(
							global_targets_object[target_name][bubble_index],
							target_name,
							view,
							template_arguments,
							callback_arguments
						);

						if (this._cancel_bubble) {
							return;
						}

					}

				}

			}

		}

	},

	_callRegisterViewInRole: function(widget, target_name, view, template_arguments) {

		return widget.handleRole(target_name, view, template_arguments);

	},

	/**
	 * @param {Lava.view.View} view
	 * @param {Array.<_cTarget>} targets
	 */
	dispatchRoles: function(view, targets) {

		this._cancel_bubble = false;
		this._is_bubble_cancellable = true; // there may be nested widgets of the same type (example: hierarchical menu items)

		this._dispatchCallback(view, targets, this._callRegisterViewInRole, null, this._global_role_targets);

	},

	_callHandleEvent: function(widget, target_name, view, template_arguments, callback_arguments) {

		return widget.handleEvent(
			callback_arguments.dom_event_name,
			callback_arguments.dom_event,
			target_name,
			view,
			template_arguments
		);

	},

	/**
	 * @param {Lava.view.View} view
	 * @param {string} event_name
	 * @param dom_event
	 */
	_dispatchViewEvents: function(view, event_name, dom_event) {

		var targets = view.getContainer().getEventTargets(event_name);

		if (targets) {

			this._is_bubble_cancellable = true;
			this._cancel_bubble = false;

			this._dispatchCallback(
				view,
				targets,
				this._callHandleEvent,
				{
					dom_event_name: event_name,
					dom_event: dom_event
				},
				this._global_event_targets
			);

		}

	},

	_evalTargetArguments: function(view, target) {

		var result = [];

		for (var i = 0, count = target.arguments.length; i < count; i++) {

			if (target.arguments[i].type == Lava.TARGET_ARGUMENT_TYPES.VALUE) {

				result.push(target.arguments[i].data);

			} else {

				if (target.arguments[i].type != Lava.TARGET_ARGUMENT_TYPES.BIND) Lava.t();

				result.push(view.evalPathConfig(target.arguments[i].data));

			}

		}

		return result;

	},

	/**
	 * @param {Lava.view.Abstract} starting_view
	 * @param {_cInclude} config
	 * @returns {_tTemplate}
	 */
	getInclude: function(starting_view, config) {

		var widget = starting_view.getWidget(),
			template_arguments = ('arguments' in config) ? this._evalTargetArguments(starting_view, config) : null;

		if ('locator_type' in config) {

			widget = this['_locateWidgetBy' + config.locator_type](widget, config.locator);

			if (!widget || !widget.isWidget) Lava.t();

		}

		return widget.getInclude(config.name, template_arguments);

	},

	addGlobalEventTarget: function(callback_name, widget) {

		this._addTarget(this._global_event_targets, callback_name, widget);

	},

	removeGlobalEventTarget: function(callback_name, widget) {

		this._removeTarget(this._global_event_targets, callback_name, widget);

	},

	addGlobalRoleTarget: function(callback_name, widget) {

		this._addTarget(this._global_role_targets, callback_name, widget);

	},

	removeGlobalRoleTarget: function(callback_name, widget) {

		this._removeTarget(this._global_role_targets, callback_name, widget);

	},

	_addTarget: function(storage, name, widget) {

		if (name in storage) {

			if (storage[name].indexOf(widget) == -1) {

				storage[name].push(widget);

			} else {

				Lava.logError('[ViewManager] Duplicate target: ' + name);

			}

		} else {

			storage[name] = [widget];

		}

	},

	_removeTarget: function(storage, name, widget) {

		if (!(name in storage)) Lava.t("Trying to remove a global event target for nonexistent event");

		var index = storage[name].indexOf(widget);

		if (index !== -1) {

			storage[name].splice(index, 1);

		}

	},

	/**
	 * @param element
	 * @returns {Lava.view.View}
	 */
	getViewByElement: function(element) {

		var id = Firestorm.Element.getProperty(element, 'id'),
			result = null;

		if (id) {

			if (id.indexOf(Lava.ELEMENT_ID_PREFIX) == 0) {

				result = this.getViewByGuid(id.substr(Lava.ELEMENT_ID_PREFIX.length));

			}

		}

		return result;

	},

	getViewsByLabel: function(label) {

		var result = [];

		for (var guid in this._views_by_guid) {

			if (this._views_by_guid[guid].label == label) {

				result.push(this._views_by_guid[guid]);

			}

		}

		return result;

	},

	handleMouseMovement:  function(event_name, event_object) {

		var new_mouseover_target = (event_name == 'mouseover') ? event_object.target : event_object.relatedTarget,
			new_mouseover_view_stack = [],
			new_mouseover_element_stack,
			view,
			container,
			i,
			count;

		this._is_bubble_cancellable = false;

		if (this._new_mouseover_target !== new_mouseover_target) {

			if (this._hasListeners('mouseover_stack_changed')) {

				new_mouseover_element_stack = new_mouseover_target ? this._buildElementStack(new_mouseover_target) : [];
				// Warning! You must not modify this array!
				this._fire('mouseover_stack_changed', new_mouseover_element_stack);

			}

			if (new_mouseover_target) {

				// moved from one element to another or entered the window
				view = this._findNearestView(new_mouseover_target);

				while (view) {

					container = view.getContainer();

					if (container.isElementContainer) {

						new_mouseover_view_stack.push(view);

					}

					view = view.getParentWithContainer();

				}

			}

			this._old_mouseover_target = this._new_mouseover_target;
			this._new_mouseover_target = new_mouseover_target;
			this._old_mouseover_view_stack = this._new_mouseover_view_stack;
			this._new_mouseover_view_stack = new_mouseover_view_stack;

		}

		if (event_name == 'mouseout') {

			for (i = 0, count = this._old_mouseover_view_stack.length; i < count; i++) {

				if (this._new_mouseover_view_stack.indexOf(this._old_mouseover_view_stack[i]) == -1) {

					this._dispatchViewEvents(this._old_mouseover_view_stack[i], 'mouseleave', event_object);

				}

				this._dispatchViewEvents(this._old_mouseover_view_stack[i], 'mouseout', event_object);

			}

		} else {

			for (i = 0, count = this._new_mouseover_view_stack.length; i < count; i++) {

				this._dispatchViewEvents(this._new_mouseover_view_stack[i], 'mouseover', event_object);

				if (this._old_mouseover_view_stack.indexOf(this._new_mouseover_view_stack[i]) == -1) {

					this._dispatchViewEvents(this._new_mouseover_view_stack[i], 'mouseenter', event_object);

				}

			}

		}

	},

	_buildElementStack: function(element) {

		var document_ref = window.document,
			result = [];

		while (element && element != document_ref) {

			result.push(element);
			element = element.parentNode;

		}

		if (Object.freeze) {
			Object.freeze(result);
		}

		return result;

	},

	_findNearestView: function(element) {

		var view,
			document_ref = window.document;

		while (!view && element && element != document_ref) {

			view = this.getViewByElement(element);

			element = element.parentNode;

		}

		return view;

	},

	onDOMEvent: function(event_name, event_object) {

		var target = event_object.target,
			view = this._findNearestView(target),
			container,
			stack_changed_event_name = event_name + '_stack_changed',
			stack;

		if (this._hasListeners(stack_changed_event_name)) {

			stack = target ? this._buildElementStack(target) : [];
			// Warning! You must not modify this array!
			this._fire(stack_changed_event_name, stack);

		}

		while (view && view.isSleeping()) {

			view = view.getParentWithContainer();

		}

		while (view) {

			container = view.getContainer();

			if (container.isElementContainer) {

				if (container.getEventTargets(event_name)) {

					this._dispatchViewEvents(view, event_name, event_object);
					if (this._cancel_bubble) {
						break;
					}

				}

			}

			view = view.getParentWithContainer();

		}

	},

	lendEvent: function(event_name) {

		if (Lava.schema.DEBUG && ['mouseenter', 'mouseleave', 'mouseover', 'mouseout'].indexOf(event_name) != -1)
			Lava.t("The following events: mouseenter, mouseleave, mouseover and mouseout are served by common alias - mouse_events");

		if (this._event_usage_counters[event_name]) {

			this._event_usage_counters[event_name]++;

		} else {

			this._event_usage_counters[event_name] = 1;
			this._initEvent(event_name);

		}

	},

	_initEvent: function(event_name) {

		if (event_name == 'mouse_events') {

			this._events_listeners['mouseover'] =
				Lava.Core.addGlobalHandler('mouseover', this.handleMouseMovement, this);
			this._events_listeners['mouseout'] =
				Lava.Core.addGlobalHandler('mouseout', this.handleMouseMovement, this);

		} else {

			this._events_listeners[event_name] =
				Lava.Core.addGlobalHandler(event_name, this.onDOMEvent, this);

		}

	},

	releaseEvent: function(event_name) {

		if (this._event_usage_counters[event_name] == 0) {
			Lava.logError("ViewManager: trying to release an event with zero usage.");
			return;
		}

		this._event_usage_counters[event_name]--;

		if (this._event_usage_counters[event_name] == 0) {

			this._shutdownEvent(event_name);

		}

	},

	_shutdownEvent: function(event_name) {

		if (event_name == 'mouse_events') {

			Lava.Core.removeGlobalHandler(this._events_listeners['mouseover']);
			this._events_listeners['mouseover'] = null;
			Lava.Core.removeGlobalHandler(this._events_listeners['mouseout']);
			this._events_listeners['mouseout'] = null;

		} else {

			Lava.Core.removeGlobalHandler(this._events_listeners[event_name]);
			this._events_listeners[event_name] = null;

		}

	},

	/**
	 * @param {Lava.widget.Standard} widget
	 * @param {Array.<_cTarget>} targets
	 */
	dispatchBroadcast: function(widget, targets) {

		var event_name,
			event_targets,
			target,
			destination_widget,
			template_arguments,
			i,
			count;

		for (event_name in targets) {

			event_targets = targets[event_name];

			for (i = 0, count = event_targets.length; i < count; i++) {

				target = event_targets[i];
				if (Lava.schema.DEBUG && !('locator_type' in target)) Lava.t("dispatchBroadcast: malformed target");
				template_arguments = ('arguments' in target) ? this._evalTargetArguments(widget, target) : null;
				destination_widget = this['_locateWidgetBy' + target.locator_type](widget, target.locator);
				destination_widget.registerBroadcastTarget(widget, event_name, target.name, template_arguments);

			}

		}

	},

	cancelBubble: function() {

		if (Lava.schema.DEBUG && !this._is_bubble_cancellable) Lava.t("This event is not cancellable");

		if (this._is_bubble_cancellable) {
			this._cancel_bubble = true;
		}

	},

	destroy: function() {

		for (var name in this._events_listeners) {

			if (this._events_listeners[name]) {

				Lava.Core.removeGlobalHandler(this._events_listeners[name]);
				this._events_listeners[name] = null;
				this._event_usage_counters[name] = 0;

			}

		}

	}

});

Lava.define(
'Lava.system.App',
/**
 * @lends Lava.system.App#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',

	_modules: {},

	_getmodule_recursion_protection: [],

	getModule: function(name) {

		if (!(name in this._modules)) {

			if (Lava.schema.DEBUG) {

				if (this._getmodule_recursion_protection.indexOf(name) != -1) Lava.t("Circular module dependency");
				this._getmodule_recursion_protection.push(name);

			}

			var config = Lava.schema.modules[name],
				className = config.type || Lava.schema.data.DEFAULT_MODULE_CLASS,
				constructor = Lava.ClassManager.getConstructor(className, 'Lava.data');

			this._modules[name] = new constructor(this, config, name);

			if (Lava.schema.DEBUG) {

				this._getmodule_recursion_protection.pop();

			}

		}

		return this._modules[name];

	},

	fireGlobalEvent: function(event_name, event_args) {

		this._fire(event_name, event_args);

	}

});

Lava.define(
'Lava.system.Sugar',
/**
 * @lends Lava.system.Sugar#
 */
{

	/**
	 * If root sugar tag has content. Map of type from config to callback.
	 */
	_root_map: {
		template_collection: '_parseRootAsTemplateCollection',
		object_collection: '_parseRootAsObjectCollection',
		template_hash: '_parseRootAsTemplateHash',
		object_hash: '_parseRootAsObjectHash',
		object_map: '_parseRootAsObjectMap',
		template: '_parseRootAsTemplate',
		object: '_parseRootAsObject'
	},

	/**
	 * When root is parsed as object_map - handlers tag types
	 */
	_tag_handlers: {
		template_collection: '_parseTagAsTemplateCollection',
		object_collection: '_parseTagAsObjectCollection',
		template_hash: '_parseTagAsTemplateHash',
		object_hash: '_parseTagAsObjectHash',
		template: '_parseTagAsTemplate',
		object: '_parseTagAsObject'
	},

	/**
	 * For object_collection, object_map and object types: handlers of tags inside the object
	 */
	_object_tag_map: {
		template: '_parseObjectTagAsTemplate',
		type: '_parseObjectTagAsType'
	},

	_object_attributes_map: {
		object_property: '_parseObjectPropertyAttribute'
	},

	/**
	 * The types of attributes that can be on root object, type => handler_name
	 */
	_root_attributes_handlers: {
		id: '_parseRootIdAttribute',
		option: '_parseRootOptionAttribute',
		'switch': '_parseRootSwitchAttribute',
		property: '_parseRootPropertyAttribute',
		targets_option: '_parseRootTargetsOptionAttribute',
		expression_option: '_parseRootExpressionOptionAttribute'
	},

	_unknown_root_attributes_actions: {
		as_resource: '_parseRootAttributesAsResource'
	},

	/**
	 * Predefined (core) attributes on root object
	 */
	_attribute_mappings: {
		id: {type: 'id'}
	},

	/**
	 * @param {_cSugar} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	parse: function(schema, raw_tag, widget_config) {

		var tag_copy;

		if (raw_tag.content) {

			// Lava.isVoidTag is a workaround for <x:attach_directives>
			if (Lava.isVoidTag(raw_tag.name) || !schema.content_schema) {

				tag_copy = this._applyTopDirectives(raw_tag, widget_config);
				if (Lava.schema.DEBUG && tag_copy.content && tag_copy.content.length) Lava.t("Widget is not allowed to have any content: " + raw_tag.name);

			} else {

				if (Lava.schema.DEBUG && !(schema.content_schema.type in this._root_map)) Lava.t("Unknown type of content in sugar: " + schema.content_schema.type);
				this[this._root_map[schema.content_schema.type]](schema.content_schema, raw_tag, widget_config);

			}

		}

		if (raw_tag.attributes) {

			this._parseRootAttributes(schema, raw_tag, widget_config);

		}

	},

	/**
	 * @param {_cSugarContentTemplateCollection|_cSugarContentTemplateHash|_cSugarContentObject|_cSugarContentObjectCollection|_cSugarContentObjectHash} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	parseStorageTag: function(schema, raw_tag, widget_config) {

		this[this._tag_handlers[schema.type]](schema, raw_tag, widget_config);

	},

	_applyTopDirectives: function(raw_tag, widget_config) {

		var raw_blocks = Lava.parsers.Common.asBlocks(raw_tag.content),
			tag_copy = Firestorm.Object.copy(raw_tag),
			i = 0,
			count = raw_blocks.length,
			has_content = false;

		for (; i < count; i++) {

			if (raw_blocks[i].type == 'directive') {
				if (Lava.parsers.Directives.processDirective(raw_blocks[i], widget_config, true)) Lava.t("Directive inside sugar has returned a value: " + raw_blocks[i].name);
			} else {
				tag_copy.content = raw_blocks.slice(i);
				has_content = true;
				break;
			}

		}

		if (!has_content) {
			tag_copy.content = [];
		}

		return tag_copy;

	},

	/**
	 * @param {_cSugar} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseRootAttributes: function(schema, raw_tag, widget_config) {

		var name,
			descriptor,
			unknown_attributes = {},
			unknown_schema;

		for (name in raw_tag.attributes) {

			if (Lava.schema.DEBUG && (name in this._attribute_mappings) && schema.attribute_mappings && (name in schema.attribute_mappings))
				Lava.t("Attribute schema is overridden by built-in schema: " + name);
			descriptor = this._attribute_mappings[name] || schema.attribute_mappings[name];
			if (descriptor) {
				this[this._root_attributes_handlers[descriptor.type]](widget_config, raw_tag.attributes[name], descriptor, name);
			} else {
				unknown_attributes[name] = raw_tag.attributes[name];
			}

		}

		if (!Firestorm.Object.isEmpty(unknown_attributes)) {
			unknown_schema = schema.unknown_root_attributes;
			if (Lava.schema.DEBUG && !unknown_schema) Lava.t("Sugar: unknown attribute: " + name + ", for widget: " + raw_tag.name);
			this[this._unknown_root_attributes_actions[unknown_schema.type]](widget_config, unknown_attributes, unknown_schema);
		}

	},

	/**
	 * @param {(_cSugarContentObjectCollection|_cSugarContentTemplateCollection)} schema
	 * @param {_cRawTag} raw_tag
	 * @param {string} callback_name
	 * @returns {Array}
	 */
	_walkContentAsArray: function(schema, raw_tag, callback_name) {

		var result = [],
			tags = Lava.parsers.Common.asBlockType(raw_tag.content, 'tag'),
			i = 0,
			count = tags.length;

		for (; i < count; i++) {

			if (tags[i].name != schema.tag_name) Lava.t("Unknown tag in collection: " + tags[i].name);
			result.push(
				this[callback_name](schema, tags[i])
			);

		}

		return result;

	},

	/**
	 * @param {(_cSugarContentTemplateHash|_cSugarContentObjectHash)} schema
	 * @param {_cRawTag} raw_tag
	 * @param {string} callback_name
	 * @param {string} tag_name
	 * @returns {Object}
	 */
	_walkContentAsHash: function(schema, raw_tag, callback_name, tag_name) {

		var result = {},
			tags = Lava.parsers.Common.asBlockType(raw_tag.content, 'tag'),
			i = 0,
			count = tags.length;

		for (; i < count; i++) {

			if (tags[i].name != tag_name) Lava.t("Unknown tag in collection: " + tags[i].name);
			if (Lava.schema.DEBUG && (!tags[i].attributes || !tags[i].attributes.name)) Lava.t("Sugar: hash tag is missing the name attribute");
			result[tags[i].attributes.name] = this[callback_name](schema, tags[i]);

		}

		return result;

	},

	/**
	 * @param {_tSugarContent} schema
	 * @param {_cRawTag} raw_tag
	 * @returns {_tTemplate}
	 */
	_asTemplate: function(schema, raw_tag) {

		return Lava.parsers.Common.compileTemplate(raw_tag.content);

	},

	/**
	 * @param {_cSugarContentObject} schema
	 * @param {_cRawTag} raw_tag
	 * @returns {{}}
	 */
	_asObject: function(schema, raw_tag) {

		var tags = Lava.parsers.Common.asBlockType(raw_tag.content, 'tag'),
			i = 0,
			count = tags.length,
			result = {},
			descriptor;

		for (; i < count; i++) {

			if (!(tags[i].name in schema.tag_mappings)) Lava.t("Unknown tag in sugar: " + tags[i].name);
			descriptor = schema.tag_mappings[tags[i].name];
			this[this._object_tag_map[descriptor.type]](descriptor, tags[i], result);

		}

		if (raw_tag.attributes) {

			this._parseObjectAttributes(schema, raw_tag, result);

		}

		return result;

	},

	/**
	 * @param {_cSugarContentObject} schema
	 * @param {_cRawTag} raw_tag
	 * @param {{}} object
	 */
	_parseObjectAttributes: function(schema, raw_tag, object) {

		var name,
			descriptor;

		for (name in raw_tag.attributes) {

			descriptor = schema.attribute_mappings[name];
			if (Lava.schema.DEBUG && !descriptor) Lava.t("Unknown attribute " + name + " in widget sugar on object: " + raw_tag.name);
			this[this._object_attributes_map[descriptor.type]](object, raw_tag.attributes[name], descriptor, name);

		}

	},

	/**
	 * @param {_cWidget} widget_config
	 * @param {string} storage_name
	 * @param {string} item_name
	 * @param {*} value
	 */
	_store: function(widget_config, storage_name, item_name, value) {

		if (!(storage_name in widget_config)) widget_config[storage_name] = {};
		if (Lava.schema.DEBUG && (item_name in widget_config[storage_name])) Lava.t("Duplicate item in storage: " + item_name);
		widget_config[storage_name][item_name] = value;

	},

	_putStorageProperty: function(widget_config, schema, value) {

		if (Lava.schema.DEBUG && !schema.type) Lava.t("storage item schema must have a type");

		this._store(
			widget_config,
			'storage',
			schema.name,
			{
				type: schema.type,
				schema: schema,
				value: value
			}
		);

	},

	/**
	 * @param {_cSugarContentTemplateCollection} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseRootAsTemplateCollection: function(schema, raw_tag, widget_config) {

		var tag_copy = this._applyTopDirectives(raw_tag, widget_config);
		this._parseTagAsTemplateCollection(schema, tag_copy, widget_config);

	},

	/**
	 * @param {_cSugarContentTemplateCollection} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseTagAsTemplateCollection: function(schema, raw_tag, widget_config) {

		this._putStorageProperty(widget_config, schema, this._walkContentAsArray(schema, raw_tag, '_asTemplate'));

	},

	/**
	 * @param {_cSugarContentTemplateHash} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseRootAsTemplateHash: function(schema, raw_tag, widget_config) {

		var tag_copy = this._applyTopDirectives(raw_tag, widget_config);
		this._parseTagAsTemplateHash(schema, tag_copy, widget_config);

	},

	/**
	 * @param {_cSugarContentTemplateHash} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseTagAsTemplateHash: function(schema, raw_tag, widget_config) {

		this._putStorageProperty(widget_config, schema, this._walkContentAsHash(schema, raw_tag, '_asTemplate', schema.tag_name || 'template'));

	},

	/**
	 * @param {_cSugarContentObjectCollection} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseRootAsObjectCollection: function(schema, raw_tag, widget_config) {

		var tag_copy = this._applyTopDirectives(raw_tag, widget_config);
		this._parseTagAsObjectCollection(schema, tag_copy, widget_config);

	},

	/**
	 * @param {_cSugarContentObjectCollection} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseTagAsObjectCollection: function(schema, raw_tag, widget_config) {

		this._putStorageProperty(widget_config, schema, this._walkContentAsArray(schema, raw_tag, '_asObject'));

	},

	/**
	 * @param {_cSugarContentObjectHash} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseRootAsObjectHash: function(schema, raw_tag, widget_config) {

		var tag_copy = this._applyTopDirectives(raw_tag, widget_config);
		this._parseTagAsObjectHash(schema, tag_copy, widget_config);

	},

	/**
	 * @param {_cSugarContentObjectHash} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseTagAsObjectHash: function(schema, raw_tag, widget_config) {

		this._putStorageProperty(widget_config, schema, this._walkContentAsHash(schema, raw_tag, '_asObject', schema.tag_name));

	},

	/**
	 * @param {_cSugarContentTemplate} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseRootAsTemplate: function(schema, raw_tag, widget_config) {

		this._store(widget_config, 'includes', schema.name || 'content', Lava.parsers.Common.compileTemplate(raw_tag.content, widget_config));

	},

	/**
	 * @param {_cSugarContentTemplate} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseTagAsTemplate: function(schema, raw_tag, widget_config) {

		this._store(widget_config, 'includes', schema.name || 'content', Lava.parsers.Common.compileTemplate(raw_tag.content));

	},

	/**
	 * @param {_cSugarContentObjectMap} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseRootAsObjectMap: function(schema, raw_tag, widget_config) {

		var tag_copy = this._applyTopDirectives(raw_tag, widget_config),
			tags = Lava.parsers.Common.asBlockType(tag_copy.content, 'tag'),
			i = 0,
			count = tags.length,
			descriptor;

		for (; i < count; i++) {

			if (tags[i].name in schema.tag_roles) {

				descriptor = schema.tag_roles[tags[i].name];
				this[this._tag_handlers[descriptor.type]](descriptor, tags[i], widget_config);

			} else {

				this._unknownTagRoleAction(tags[i]);

			}

		}

	},

	_unknownTagRoleAction: function(tag) {

		Lava.t("Unknown tag role in sugar: " + tag.name);

	},

	/**
	 * @param {_cSugarContentObject} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseRootAsObject: function(schema, raw_tag, widget_config) {

		if (Lava.schema.DEBUG && schema.attribute_mappings) Lava.t("Invalid schema for root object: attribute_mappings belong to root.");

		var tag_copy = this._applyTopDirectives(raw_tag, widget_config);
		this._parseTagAsObject(schema, tag_copy, widget_config);

	},

	/**
	 * @param {_cSugarContentObject} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseTagAsObject: function(schema, raw_tag, widget_config) {

		this._putStorageProperty(widget_config, schema, this._asObject(schema, raw_tag));

	},

	/**
	 * @param {_cSugarObjectTag} schema
	 * @param {_cRawTag} raw_tag
	 * @param {Object} object
	 */
	_parseObjectTagAsTemplate: function(schema, raw_tag, object) {

		if (Lava.schema.DEBUG && (raw_tag.name in object)) Lava.t("Duplicate tag in object: " + raw_tag.name);
		object[schema.name || raw_tag.name] = raw_tag.content ? Lava.parsers.Common.compileTemplate(raw_tag.content) : [];

	},

	/**
	 * @param {_cSugarObjectTag} schema
	 * @param {_cRawTag} raw_tag
	 * @param {{}} object
	 */
	_parseObjectTagAsType: function(schema, raw_tag, object) {

		if (Lava.schema.DEBUG) {
			if (!raw_tag.content || raw_tag.content.length != 1 || typeof (raw_tag.content[0]) != 'string') Lava.t("One string expected in tag content: " + raw_tag.name);
			if (!Lava.types[schema.type_name].isValidString(raw_tag.content[0], schema)) Lava.t("Invalid value in object tag: " + raw_tag.content[0]);
			if (raw_tag.name in object) Lava.t("Duplicate tag in object: " + raw_tag.name);
		}

		object[schema.name || raw_tag.name] = Lava.types[schema.type_name].fromSafeString(raw_tag.content[0], schema);

	},

	/**
	 * @param {_cSugarAttribute} descriptor
	 * @param {string} attribute_value
	 * @returns {*}
	 */
	_valueToType: function(descriptor, attribute_value) {

		if (descriptor.type_name) {

			if (Lava.schema.DEBUG && !Lava.types[descriptor.type_name].isValidString(attribute_value, descriptor)) Lava.t("Invalid attribute value: " + attribute_value);
			attribute_value = Lava.types[descriptor.type_name].fromSafeString(attribute_value, descriptor);

		}

		return attribute_value;

	},

	/**
	 * @param {_cWidget} widget_config
	 * @param {string} attribute_value
	 */
	_parseRootIdAttribute: function(widget_config, attribute_value) {

		if (Lava.schema.DEBUG && (!Lava.isValidId(attribute_value) || ('id' in widget_config))) Lava.t();
		widget_config.id = attribute_value;

	},

	/**
	 * @param {_cWidget} widget_config
	 * @param {string} attribute_value
	 * @param {_cSugarAttribute} descriptor
	 * @param {string} name
	 */
	_parseRootOptionAttribute: function(widget_config, attribute_value, descriptor, name) {

		this._store(widget_config, 'options', descriptor.name || name, this._valueToType(descriptor, attribute_value));

	},

	/**
	 * Same as 'option', but empty value is treated as boolean TRUE, to allow value-less attributes.
	 * @param {_cWidget} widget_config
	 * @param {string} attribute_value
	 * @param {_cSugarAttribute} descriptor
	 * @param {string} name
	 */
	_parseRootSwitchAttribute: function(widget_config, attribute_value, descriptor, name) {

		this._store(widget_config, 'options',  descriptor.name || name, (attribute_value == '') ? true : Lava.types.Boolean.fromString(attribute_value));

	},

	/**
	 * @param {_cWidget} widget_config
	 * @param {string} attribute_value
	 * @param {_cSugarAttribute} descriptor
	 * @param {string} name
	 */
	_parseRootPropertyAttribute: function(widget_config, attribute_value, descriptor, name) {

		this._store(widget_config, 'properties', descriptor.name || name, this._valueToType(descriptor, attribute_value));

	},

	/**
	 * @param {{}} object
	 * @param {string} attribute_value
	 * @param {_cSugarAttribute} schema
	 * @param {string} name
	 */
	_parseObjectPropertyAttribute: function(object, attribute_value, schema, name) {

		if (Lava.schema.DEBUG && (name in object)) Lava.t("Duplicate property in object: " + name);
		object[schema.name || name] = this._valueToType(schema, attribute_value);

	},

	/**
	 * @param {_cWidget} widget_config
	 * @param {Object} unknown_attributes
	 * @param {Object} action_schema
	 */
	_parseRootAttributesAsResource: function(widget_config, unknown_attributes, action_schema) {

		var value = {
				type: 'container_stack',
				value: []
			},
			operations_stack = value.value;

		if (!widget_config.resources) {

			widget_config.resources = {};

		}

		if (!widget_config.resources['default']) {

			widget_config.resources['default'] = {};

		}

		if ('class' in unknown_attributes) {

			operations_stack.push({
				name: 'static_classes',
				value: unknown_attributes['class'].trim().split(/\s+/)
			});
			delete unknown_attributes['class'];

		}

		if ('style' in unknown_attributes) {

			operations_stack.push({
				name: 'static_styles',
				value: Lava.parsers.Common.parseStyleAttribute(unknown_attributes.style)
			});
			delete  unknown_attributes.style;

		}

		if (!Firestorm.Object.isEmpty(unknown_attributes)) {

			operations_stack.push({
				name: 'static_properties',
				value: Firestorm.Object.copy(unknown_attributes) // copying to reduce possible slowdowns (object may contain deleted values)
			});

		}

		Lava.resources.putResourceValue(widget_config.resources['default'], action_schema.container_resource_name, value);

	},

	/**
	 * @param {_cWidget} widget_config
	 * @param {string} attribute_value
	 * @param {_cSugarAttribute} descriptor
	 * @param {string} name
	 */
	_parseRootTargetsOptionAttribute: function(widget_config, attribute_value, descriptor, name) {

		this._store(widget_config, 'options', descriptor.name || name, Lava.parsers.Common.parseTargets(attribute_value));

	},

	/**
	 * @param {_cWidget} widget_config
	 * @param {string} attribute_value
	 * @param {_cSugarAttribute} descriptor
	 * @param {string} name
	 */
	_parseRootExpressionOptionAttribute: function(widget_config, attribute_value, descriptor, name) {

		this._store(
			widget_config,
			'options',
			descriptor.name || name,
			Lava.ExpressionParser.parse(attribute_value, Lava.ExpressionParser.SEPARATORS.SEMICOLON)
		);

	}

});

Lava.define(
'Lava.system.PopoverManager',
/**
 * @lends Lava.system.PopoverManager#
 */
{

	_mouseover_stack_changed_listener: null,

	_tooltip_target: null,

	_attribute_name: 'data-tooltip',

	_mousemove_listener: null,

	_tooltip: null,

	_default_tooltip_widget: 'Tooltip',

	enable: function() {

		if (Lava.schema.DEBUG && this._mouseover_stack_changed_listener) Lava.t("PopoverManager is already enabled");
		Lava.view_manager.lendEvent('mouse_events');
		this._mouseover_stack_changed_listener = Lava.view_manager.on('mouseover_stack_changed', this._onMouseoverStackChanged, this);
		if (!this._tooltip) {
			this._tooltip = Lava.createWidget(this._default_tooltip_widget);
			this._tooltip.inject(document.body, 'Bottom');
		}

	},

	disable: function() {

		Lava.view_manager.releaseEvent('mouse_events');
		Lava.view_manager.removeListener(this._mouseover_stack_changed_listener);
		this._mouseover_stack_changed_listener = null;
		if (this._mousemove_listener) {
			Lava.Core.removeGlobalHandler(this._mousemove_listener);
			this._mousemove_listener = null;
		}
		this._tooltip.remove();

	},

	_onMouseoverStackChanged: function(view_manager, stack) {

		var new_tooltip_target = null;

		for (var i = 0, count = stack.length; i < count; i++) {

			if (Firestorm.Element.hasAttribute(stack[i], this._attribute_name)) {

				new_tooltip_target = stack[i];
				break;

			}

		}

		if (new_tooltip_target != this._tooltip_target) {

			if (!this._tooltip_target) {

				if (Lava.schema.DEBUG && this._mousemove_listener) Lava.t();
				this._mousemove_listener = Lava.Core.addGlobalHandler('mousemove', this._onMouseMove, this);
				this._tooltip.set('is_visible', true);

			} else if (!new_tooltip_target) {

				Lava.Core.removeGlobalHandler(this._mousemove_listener);
				this._mousemove_listener = null;
				this._tooltip.set('is_visible', false);

			}

			if (new_tooltip_target) {

				this._tooltip.set('html', Firestorm.Element.getAttribute(new_tooltip_target, this._attribute_name));

			}

			this._tooltip_target = new_tooltip_target;

		}

	},

	_onMouseMove: function(event_name, event_object) {

		this._tooltip.set('x', event_object.page.x); // left
		this._tooltip.set('y', event_object.page.y); // top

	}

});

Lava.define(
'Lava.data.field.Abstract',
/**
 * @lends Lava.data.field.Abstract#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',

	/**
	 * @type {string}
	 */
	_name: null,
	_module: null,
	_config: null,
	/**
	 * @type {Object.<_tGUID, Object>}
	 */
	_storages_by_guid: null,
	/**
	 * @type {boolean}
	 */
	_is_nullable: false,

	/**
	 * @param {Lava.data.Module} module
	 * @param {string} name
	 * @param {_cField} config
	 * @param {object} module_storages
	 */
	init: function(module, name, config, module_storages) {

		this._module = module;
		this._name = name;
		this._config = config;
		this._storages_by_guid = module_storages;
		if ('is_nullable' in config) this._is_nullable = config.is_nullable;

	},

	/**
	 * Module calls it, when all field objects are already created,
	 * and passes the object which will become default property storage for all records.
	 * It's common purpose is to set this field's default value and attach listeners to other fields.
	 */
	onModuleFieldsCreated: function(default_storage) {},

	/**
	 * @param {*} value
	 * @returns {boolean}
	 */
	isValidValue: function(value) {

		return typeof(value) != 'undefined' && (value !== null || this._is_nullable);

	},

	/**
	 * Unlike isValidValue(), this is slow version of this check, which returns a message in case the value is invalid
	 * @param {*} value
	 * @returns {?string}
	 */
	getInvalidReason: function(value) {

		var reason = null;

		if (typeof(value) == 'undefined') {

			reason = "Undefined is not a valid value";

		} else if (value == null && !this._is_nullable) {

			reason = "Cannot assign null to non-nullable field";

		}

		return reason;

	},

	isNullable: function() {

		return this._is_nullable;

	},

	/**
	 * Records are either loaded from existing data, or created with default storage.
	 * Here a field may perform initialization of new records, for example: generate an id.
	 */
	initNewRecord: function(record, storage) {},

	'import': function(record, storage, raw_properties) {

	},

	'export': function(record, destination_object) {
		Lava.t("Abstract function call: export");
	},

	getValue: function(record, storage) {
		Lava.t("Abstract function call: getValue");
	},

	setValue: function(record, storage, value) {
		Lava.t("Abstract function call: setValue");
	},

	_fireFieldChangedEvents: function(record) {

		this._fire('changed', {record: record});
		record.firePropertyChangedEvents(this._name);

	},

	_getImportValue: function(storage, raw_properties) {

		if (Lava.schema.data.VALIDATE_IMPORT_DATA && !this.isValidValue(raw_properties[this._name]))
			Lava.t('Invalid value in import data (' + this._name + '): ' + raw_properties[this._name]);

		return raw_properties[this._name];

	},

	isLess: function(record_a, record_b) {

		return this._storages_by_guid[record_a.guid][this._name] < this._storages_by_guid[record_b.guid][this._name];

	},

	isEqual: function(record_a, record_b) {

		return this._storages_by_guid[record_a.guid][this._name] == this._storages_by_guid[record_b.guid][this._name];

	},

	destroy: function() {

		this._storages_by_guid = this._module = null;

	}

});

Lava.define(
'Lava.data.field.Basic',
/**
 * @lends Lava.data.field.Basic#
 * @extends Lava.data.field.Abstract
 */
{

	Extends: 'Lava.data.field.Abstract',

	_default: null,

	init: function(module, name, config, module_storages) {

		this.Abstract$init(module, name, config, module_storages);

		if ('default' in config) {

			this._default = config['default'];

		}

		if (!this._is_nullable && this._default == null) {

			// the default value could be provided in derived classes
			Lava.t("Non-nullable Basic fields must have a default value");

		}

		if (Lava.schema.DEBUG && !this.isValidValue(this._default))
			Lava.t("Field was configured with invalid default value. Module: " + this._module.getName() + ", field name: " + this._name);

	},

	onModuleFieldsCreated: function(default_storage) {

		default_storage[this._name] = this._default;

	},

	'import': function(record, storage, raw_properties) {

		if (this._name in raw_properties) {

			storage[this._name] = this._getImportValue(storage, raw_properties);

		}

	},

	'export': function(record, destination_object) {

		destination_object[this._name] = this._storages_by_guid[record.guid][this._name];

	},

	getValue: function(record, storage) {

		return storage[this._name];

	},

	setValue: function(record, storage, value) {

		if (storage[this._name] !== value) {

			if (!this.isValidValue(value)) Lava.t('[Field name=' + this._name + '] Invalid field value: '
				+ value + ". Reason: " + this.getInvalidReason(value));

			storage[this._name] = value;
			this._fireFieldChangedEvents(record);

		}

	}

});

Lava.define(
'Lava.data.field.Collection',
/**
 * @lends Lava.data.field.Collection#
 * @extends Lava.data.field.Abstract
 */
{

	Extends: 'Lava.data.field.Abstract',

	isCollectionField: true,

	/**
	 * Collection field holds an array of records from this module
	 */
	_target_module: null,

	/**
	 * @type {string}
	 */
	_target_record_field_name: null,
	/**
	 * Each Collection field has corresponding Record field, they always come in pairs, like 'parent' and 'children'
	 * @type {Lava.data.field.Record}
	 */
	_target_record_field: null,

	_record_removed_listener: null,
	_record_added_listener: null,

	/**
	 * @type {Object.<string, Lava.system.Enumerable>}
	 */
	_collections_by_record_guid: {},
	_collection_listeners_by_guid: {},
	/**
	 * @type {Object.<_tGUID, Lava.data.RecordAbstract>}
	 */
	_collection_guid_to_record: {},

	/**
	 * @param {Lava.data.Module} module
	 * @param {string} name
	 * @param {_cCollectionField} config
	 * @param {object} module_storages
	 */
	init: function(module, name, config, module_storages) {

		this.Abstract$init(module, name, config, module_storages);

		if (Lava.schema.DEBUG && !config.record_field)
			Lava.t("Missing corresponding Record field. Record fields are used by Collection fields.");

		this._target_record_field_name = config.record_field;

	},

	onModuleFieldsCreated: function(default_storage) {

		this._target_module = (this._config.module == 'this') ? this._module : this._module.getApp().getModule(this._config.module);
		this._target_record_field = this._target_module.getField(this._target_record_field_name);
		this._record_removed_listener = this._target_record_field.on('removed_child', this._onRecordRemoved, this);
		this._record_added_listener = this._target_record_field.on('added_child', this._onRecordAdded, this);

		if (!this._target_record_field.isRecordField) Lava.t('CollectionField: mirror field is not Record field');

		if (this._target_record_field.getReferencedModule() !== this._module)
			Lava.t("CollectionField: module mismatch with mirror Record field");

	},

	_onRecordRemoved: function(field, event_args) {

		var local_record = event_args.collection_owner;
		if (local_record.guid in this._collections_by_record_guid) {
			this._collections_by_record_guid[local_record.guid].removeValue(event_args.child);
		}

	},

	_onRecordAdded: function(field, event_args) {

		var local_record = event_args.collection_owner;
		if (local_record.guid in this._collections_by_record_guid) {
			this._collections_by_record_guid[local_record.guid].includeValue(event_args.child);
		}

	},

	isValidValue: function(value) {

		return false;

	},

	getInvalidReason: function(value) {

		return  'Collection field does not support setValue';

	},

	'import': function(record, storage, raw_properties) {

		if (raw_properties[this._name]) {

			if (Lava.schema.data.VALIDATE_IMPORT_DATA && !Array.isArray(raw_properties[this._name]))
				Lava.t('Invalid value in import data');

			var i = 0,
				records = this._target_module.loadRecords(raw_properties[this._name]),
				count = records.length;

			for (; i < count; i++) {

				records[i].set(this._target_record_field_name, record);

			}

		}

	},

	'export': function(record, destination_object) {

	},

	getValue: function(record, storage) {

		var guid = record.guid,
			collection;

		if (!(guid in this._collections_by_record_guid)) {

			collection = new Lava.system.Enumerable(this._target_record_field.getCollection(record));
			this._collections_by_record_guid[guid] = collection;
			this._collection_listeners_by_guid[guid] = {
				added: collection.on('items_added', this._onCollectionRecordsAdded, this),
				removed: collection.on('items_removed', this._onCollectionRecordsRemoved, this)
			};
			this._collection_guid_to_record[collection.guid] = record;

		}

		return this._collections_by_record_guid[guid];

	},

	_onCollectionRecordsAdded: function(collection, event_args) {

		this._setCollectionOwner(event_args.values, this._collection_guid_to_record[collection.guid]);

	},

	_onCollectionRecordsRemoved: function(collection, event_args) {

		this._setCollectionOwner(event_args.values, null);

	},

	_setCollectionOwner: function(records, new_value) {

		var i = 0,
			count = records.length,
			record;

		for (; i < count; i++) {

			record = records[i];
			// everything else will be done by the Record field
			// also, it will raise an event to remove the record from Enumerable
			record.set(this._target_record_field_name, new_value);

		}

	},

	getCount: function(record, storage) {

		return this._target_record_field.getCollectionCount(record);

	},

	setValue: function(record, storage, new_records) {

		Lava.t('Trying to set Collection field value');

	},

	isLess: function(record_a, record_b) {

		return this._target_record_field.getCollectionCount(record_a) < this._target_record_field.getCollectionCount(record_b);

	},

	isEqual: function(record_a, record_b) {

		return this._target_record_field.getCollectionCount(record_a) == this._target_record_field.getCollectionCount(record_b);

	},

	destroy: function() {

		var guid;

		for (guid in this._collections_by_record_guid) {

			this._collections_by_record_guid[guid].destroy();

		}

		this._target_record_field.removeListener(this._record_removed_listener);
		this._target_record_field.removeListener(this._record_added_listener);

		this._target_module
			= this._collections_by_record_guid
			= this._collection_listeners_by_guid
			= this._collection_guid_to_record
			= this._target_record_field = null;

		this.Abstract$destroy();

	}

});

Lava.define(
'Lava.data.field.Integer',
/**
 * @lends Lava.data.field.Integer#
 * @extends Lava.data.field.Basic
 */
{

	Extends: 'Lava.data.field.Basic',

	Shared: '_shared',

	_shared: {
		valid_value_regex: /^(\-|\+)?([1-9]\d*|0)$/
	},

	isValidValue: function(value) {

		return (value === null && this._is_nullable) || (typeof(value) == 'number' && this._shared.valid_value_regex.test(value));

	},

	getInvalidReason: function(value) {

		var reason = this.Basic$getInvalidReason(value);

		if (!reason) {

			if (typeof(value) != 'number') {

				reason = "Value is not a number";

			} else if (this._shared.valid_value_regex.test(value)) {

				reason = "Value is not an integer";

			}

		}

		return reason;

	}

});

Lava.define(
'Lava.data.field.Id',
/**
 * Holds a positive integer, does NOT generate id's automatically
 * @lends Lava.data.field.Id#
 * @extends Lava.data.field.Abstract
 */
{

	Extends: 'Lava.data.field.Abstract',

	Shared: '_shared',

	_shared: {
		valid_value_regex: /^[1-9]\d*$/
	},

	_is_nullable: true,

	init: function(module, name, config, module_storages) {

		if (Lava.schema.DEBUG && (('is_nullable' in config) || ('default' in config)))
			Lava.t("Standard ID field can not be configured as nullable or have a default value");

		this.Abstract$init(module, name, config, module_storages);

	},

	onModuleFieldsCreated: function(default_storage) {

		default_storage[this._name] = null;

	},

	isValidValue: function(value) {

		return (value === null && this._is_nullable) || (typeof(value) == 'number' && this._shared.valid_value_regex.test(value));

	},

	getInvalidReason: function(value) {

		var reason = this.Abstract$getInvalidReason(value);

		if (!reason) {

			if (typeof(value) != 'number') {

				reason = "Value is not a number";

			} else if (this._shared.valid_value_regex.test(value)) {

				reason = "Valid values for ID field are positive integers";

			}

		}

		return reason;

	},

	'import': function(record, storage, raw_properties) {

		if (this._name in raw_properties) {

			storage[this._name] = this._getImportValue(storage, raw_properties);

		} else {

			Lava.t("Import record must have an ID");

		}

	},

	'export': function(record, destination_object) {

		destination_object[this._name] = this._storages_by_guid[record.guid][this._name];

	},

	getValue: function(record, storage) {

		return storage[this._name];

	},

	setValue: function(record, storage, value) {

		Lava.t("Standard id field must not be set");

	}

});

Lava.define(
'Lava.data.field.ForeignKey',
/**
 * @lends Lava.data.field.ForeignKey#
 * @extends Lava.data.field.Basic
 */
{

	Extends: 'Lava.data.field.Basic',

	isForeignKey: true,

	_collections_by_foreign_id: {},

	_default: 0,

	initNewRecord: function(record, storage) {

		this._registerByForeignKey(record, storage[this._name]);
		this.Basic$initNewRecord(record, storage);

	},

	'import': function(record, storage, raw_properties) {

		this._registerByForeignKey(record, raw_properties[this._name] || storage[this._name]);// it may have a default
		this.Basic$import(record, storage, raw_properties);

	},

	_registerByForeignKey: function(record, foreign_key) {

		if (foreign_key in this._collections_by_foreign_id) {

			this._collections_by_foreign_id[foreign_key].push(record);

		} else {

			this._collections_by_foreign_id[foreign_key] = [record];

		}

	},

	setValue: function(record, storage, new_foreign_key) {

		Firestorm.Array.exclude(this._collections_by_foreign_id[storage[this._name]], record);
		this._registerByForeignKey(record, new_foreign_key);

		this.Basic$setValue(record, storage, new_foreign_key);

	},

	getCollection: function(foreign_key) {

		return this._collections_by_foreign_id[foreign_key] || [];

	},

	destroy: function() {

		this._collections_by_foreign_id = null;
		this.Basic$destroy();

	}

});

Lava.define(
'Lava.data.field.Record',
/**
 * Maintains collections of records, grouped by this field. Also used by mirror Collection field.
 * @lends Lava.data.field.Record#
 * @extends Lava.data.field.Abstract
 */
{

	Extends: 'Lava.data.field.Abstract',

	isRecordField: true,

	_referenced_module: null,

	/**
	 * Records, grouped by this field. Serves as a helper for mirror Collection field.
	 * Key is GUID of the foreign record, value is collection of records from local module.
	 * @type {Object.<string, Array>}
	 */
	_collections_by_foreign_guid: {},

	/**
	 * Example: 'parent_id'
	 * @type {string}
	 */
	_foreign_key_field_name: null,
	/**
	 * Local field with ID of the record in external module.
	 */
	_foreign_key_field: null,
	_foreign_key_changed_listener: null,

	/**
	 * @type {Lava.data.field.Abstract}
	 */
	_external_id_field: null,
	_external_id_changed_listener: null,
	_external_records_loaded_listener: null,

	EMPTY_FOREIGN_ID: 0,

	/**
	 * @param {Lava.data.Module} module
	 * @param {string} name
	 * @param {_cRecordField} config
	 * @param {object} module_storages
	 */
	init: function(module, name, config, module_storages) {

		this.Abstract$init(module, name, config, module_storages);
		this._referenced_module = (config.module == 'this') ? module : module.getApp().getModule(config.module);

	},

	onModuleFieldsCreated: function(default_storage) {

		if (this._config.foreign_key_field) {

			if (Lava.schema.DEBUG && !this._referenced_module.hasField('id')) Lava.t("field/Record: the referenced module must have an ID field");

			this._foreign_key_field_name = this._config.foreign_key_field;
			this._foreign_key_field = this._module.getField(this._foreign_key_field_name);
			if (Lava.schema.DEBUG && !this._foreign_key_field.isForeignKey) Lava.t();
			this._foreign_key_changed_listener = this._foreign_key_field.on('changed', this._onForeignKeyChanged, this);
			this._external_id_field = this._referenced_module.getField('id');
			this._external_id_changed_listener = this._external_id_field.on('changed', this._onExternalIdCreated, this);
			this._external_records_loaded_listener = this._referenced_module.on('records_loaded', this._onReferencedModuleRecordsLoaded);

		}

		// this field stores the referenced record
		default_storage[this._name] = null;

	},

	_onReferencedModuleRecordsLoaded: function(module, event_args) {

		var records = event_args.records,
			count = records.length,
			i = 0,
			local_records,
			local_count,
			local_index,
			local_record;

		for (; i < count; i++) {

			local_records = this._foreign_key_field.getCollection(records[i].get('id'));

			// these records belong to this module and have this field null.
			// Now, as the foreign record is loaded - the field can be updated.
			for (local_count = local_records.length, local_index = 0; local_index < local_count; local_index++) {
				local_record = local_records[local_index];
				this._storages_by_guid[local_record.guid][this._name] = records[i];
				this._fireFieldChangedEvents(local_record);
			}

		}

	},

	/**
	 * A record was saved to the database and assigned an id. Need to assign foreign keys for loaded records.
	 * @param foreign_module_id_field
	 * @param event_args
	 */
	_onExternalIdCreated: function(foreign_module_id_field, event_args) {

		var referenced_record = event_args.record, // record belongs to foreign module
			new_referenced_id = referenced_record.get('id'),
			collection,
			i = 0,
			count;

		if (referenced_record.guid in this._collections_by_foreign_guid) {

			collection = this._collections_by_foreign_guid[referenced_record.guid];

			// Set the value of foreign ID field in all local records that reference this foreign record.
			// Situation: there is a new record, which was created in the browser, and some records that reference it
			// (either new or loaded from database). It's new, so there are no records on server that reference it.
			if (this._foreign_key_field) {

				Lava.suspendListener(this._foreign_key_changed_listener);

				for (count = collection.length; i < count; i++) {

					collection[i].set(this._foreign_key_field_name, new_referenced_id);

				}

				Lava.resumeListener(this._foreign_key_changed_listener);

			}

		}

	},

	/**
	 * Fires, when local record's foreign id field is assigned a new value.
	 * Example:
	 * ```javascript
	 * record.set('category_id', 123); // 'record' is from local module, 123 - id of foreign record
	 * ```
	 * @param foreign_key_field
	 * @param event_args
	 */
	_onForeignKeyChanged: function(foreign_key_field, event_args) {

		var record = event_args.record, // record belongs to this module
			storage = this._storages_by_guid[record.guid];

		if (storage[this._name] != null) {

			// remove old record from collection
			this._unregisterRecord(record, storage[this._name]);

		}

		if (storage[this._foreign_key_field_name]) {

			this._registerByReferencedId(record, storage, storage[this._foreign_key_field_name]);

		} else {

			storage[this._name] = null;

		}

		this._fireFieldChangedEvents(record);

	},

	isValidValue: function(new_record) {

		return (
				(new_record === null && this._is_nullable)
				|| (typeof(new_record) != 'undefined'
					&& new_record.isRecord
					&& new_record.getModule() === this._referenced_module)
			);

	},

	getInvalidReason: function(value) {

		var reason = this.Abstract$getInvalidReason(value);

		if (!reason) {

			if (!value.isRecord) {

				reason = "Value is not record";

			} else if (value.getModule() === this._referenced_module) {

				reason = "Value is from different module than this field refers to";

			}

		}

		return reason;

	},

	initNewRecord: function(record, storage) {

		if (this._foreign_key_field && storage[this._foreign_key_field_name]) {

			this._registerByReferencedId(record, storage, storage[this._foreign_key_field_name]);

		}

	},

	'import': function(record, storage, raw_properties) {

		var foreign_id;

		if (this._foreign_key_field) {

			// if foreign id is in import - than it will replace the default value (if foreign kay has default)
			foreign_id = raw_properties[this._foreign_key_field_name] || storage[this._foreign_key_field_name];
			if (foreign_id) {
				this._registerByReferencedId(record, storage, foreign_id);
			}

		}

	},

	/**
	 * @param {Lava.data.RecordAbstract} record The local record
	 * @param {Object} storage The storage of local record
	 * @param referenced_record_id The id of foreign record, which it belongs to
	 */
	_registerByReferencedId: function(record, storage, referenced_record_id) {

		storage[this._name] = this._referenced_module.getRecordById(referenced_record_id) || null;

		if (storage[this._name]) {

			this._registerRecord(record, storage[this._name]);

		}

	},

	'export': function(record, destination_object) {

	},

	getValue: function(record, storage) {

		return storage[this._name];

	},

	setValue: function(record, storage, new_ref_record) {

		if (!this.isValidValue(new_ref_record))
			Lava.t("Field/Record: assigned value is not valid. Reason: " + this.getInvalidReason(new_ref_record));

		if (storage[this._name] != null) {

			// remove from the old record's collection
			this._unregisterRecord(record, storage[this._name]);

		}

		storage[this._name] = new_ref_record;
		if (new_ref_record != null) {

			this._registerRecord(record, new_ref_record)

		}

		if (this._foreign_key_field) {

			Lava.suspendListener(this._foreign_key_changed_listener);

			if (new_ref_record != null) {

				// if this module has foreign_key_field than foreign module must have an ID column
				record.set(this._foreign_key_field_name, new_ref_record.get('id'));

			} else {

				record.set(this._foreign_key_field_name, this.EMPTY_FOREIGN_ID);

			}

			Lava.resumeListener(this._foreign_key_changed_listener);

		}

		this._fireFieldChangedEvents(record);

	},

	/**
	 * Remove local_record from the collection referenced by referenced_record
	 * @param local_record
	 * @param referenced_record
	 */
	_unregisterRecord: function(local_record, referenced_record) {

		if (!Firestorm.Array.exclude(this._collections_by_foreign_guid[referenced_record.guid], local_record)) Lava.t();
		this._fire('removed_child', {
			collection_owner: referenced_record,
			child: local_record
		});

	},

	/**
	 * Add local_record to collection of records from local module, referenced by referenced_record
	 * @param local_record
	 * @param referenced_record The collection owner
	 */
	_registerRecord: function(local_record, referenced_record) {

		var referenced_guid = referenced_record.guid;

		if (referenced_guid in this._collections_by_foreign_guid) {

			if (Lava.schema.DEBUG && this._collections_by_foreign_guid[referenced_guid].indexOf(local_record) != -1)
				Lava.t("Duplicate record");
			this._collections_by_foreign_guid[referenced_guid].push(local_record);

		} else {

			this._collections_by_foreign_guid[referenced_guid] = [local_record];

		}

		this._fire('added_child', {
			collection_owner: referenced_record,
			child: local_record
		});

	},

	/**
	 * @param {Lava.data.RecordAbstract} referenced_record The collection's owner record from referenced module
	 * @returns {Array}
	 */
	getCollection: function(referenced_record) {

		return (referenced_record.guid in this._collections_by_foreign_guid)
			? this._collections_by_foreign_guid[referenced_record.guid].slice()
			: []; // fast operation: array of objects

	},

	getCollectionCount: function(referenced_record) {

		var collection = this._collections_by_foreign_guid[referenced_record.guid];
		return collection ? collection.length : 0;

	},

	getReferencedModule: function() {

		return this._referenced_module;

	},

	_getComparisonValue: function(record) {

		if (Lava.schema.DEBUG && !(record.guid in this._storages_by_guid)) Lava.t("isLess: record does not belong to this module");
		var ref_record_a = this._storages_by_guid[record.guid][this._name];
		// must return undefined, cause comparison against nulls behaves differently
		return ref_record_a ? ref_record_a.get('id') : void 0;

	},

	isLess: function(record_a, record_b) {

		return this._getComparisonValue(record_a) < this._getComparisonValue(record_b);

	},

	isEqual: function(record_a, record_b) {

		return this._getComparisonValue(record_a) == this._getComparisonValue(record_b);

	},

	destroy: function() {

		if (this._config.foreign_key_field) {

			this._foreign_key_field.removeListener(this._foreign_key_changed_listener);
			this._external_id_field.removeListener(this._external_id_changed_listener);

		}

		this._referenced_module.removeListener(this._external_records_loaded_listener);

		this._referenced_module
			= this._collections_by_foreign_guid
			= this._foreign_key_field
			= this._external_id_field
			= null;

		this.Abstract$destroy();

	}

});

Lava.define(
'Lava.data.field.Boolean',
/**
 * @lends Lava.data.field.Boolean#
 * @extends Lava.data.field.Basic
 */
{

	Extends: 'Lava.data.field.Basic',

	_default: false,

	isValidValue: function(value) {

		return (value === null && this._is_nullable) || (typeof(value) == 'boolean');

	},

	getInvalidReason: function(value) {

		var reason = this.Basic$getInvalidReason(value);

		if (!reason && typeof(value) != 'boolean') {

			reason = "Value is not boolean type";

		}

		return reason;

	}

});

Lava.define(
'Lava.data.field.Guid',
/**
 * @lends Lava.data.field.Guid#
 * @extends Lava.data.field.Abstract
 */
{

	Extends: 'Lava.data.field.Abstract',

	'export': function(record, destination_object) {

		destination_object['guid'] = record.guid;

	},

	getValue: function(record, storage) {

		return record.guid;

	},

	setValue: function(record, storage, value) {

		Lava.t('Guid field is read only');

	}

});

Lava.define(
'Lava.data.ModuleAbstract',
/**
 * @lends Lava.data.ModuleAbstract#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',

	_config: null,
	_fields: {},
	_records: [],
	_records_by_guid: {},
	_storages_by_guid: {},

	_initFields: function(config) {

		var field_name,
			type,
			constructor,
			default_storage = {};

		for (field_name in config.fields) {

			type = config.fields[field_name].type || Lava.schema.data.DEFAULT_FIELD_TYPE;
			constructor = Lava.ClassManager.getConstructor(type, 'Lava.data.field');
			this._fields[field_name] = new constructor(
				this,
				field_name,
				config.fields[field_name],
				this._storages_by_guid
			);

		}

		for (field_name in this._fields) {

			this._fields[field_name].onModuleFieldsCreated(default_storage);

		}

		return default_storage;

	},

	/**
	 * This function is autogenerated in constructor
	 *
	 * @returns {Object}
	 */
	_createEmptyRecordStorage: function() {

		return {};

	},

	destroy: function() {

		var name,
			i = 0,
			count = this._records.length;

		/*for (; i < count; i++) {

			this._records[i].destroy();

		}*/

		for (name in this._fields) {

			this._fields[name].destroy();

		}

		this._records = this._records_by_guid = this._storages_by_guid = this._fields = null;

	}

});

Lava.define(
'Lava.data.Module',
/**
 * @lends Lava.data.Module#
 * @extends Lava.data.ModuleAbstract
 */
{

	Extends: 'Lava.data.ModuleAbstract',

	_app: null,
	_name: null,

	_record_class: Lava.schema.data.DEFAULT_RECORD_CLASS,

	_records_by_id: {},

	_has_id: false,

	/**
	 * @param lava_app
	 * @param {_cModule} config
	 * @param {string} name
	 */
	init: function(lava_app, config, name) {

		this._app = lava_app;
		this._config = config;
		this._name = name;

		if ('record_class' in config) {

			this._record_class = config.record_class;

		}

		var default_storage = this._initFields(config);

		this._createEmptyRecordStorage = new Function(
			"return " + Lava.Serializer.serialize(default_storage)
		);

		if ('id' in this._fields) {

			this._has_id = true;
			this._fields['id'].on('changed', this._onRecordIdChanged, this);

		}

	},

	_onRecordIdChanged: function(id_field, event_args) {

		var id = event_args.record.get('id');
		if (id in this._records_by_id) Lava.t("Duplicate record id in module " + this._name);
		this._records_by_id[id] = event_args.record;

	},

	hasField: function(name) {

		return name in this._fields;

	},


	getField: function(name) {

		return this._fields[name];

	},

	getRecordById: function(id) {

		return this._records_by_id[id];

	},

	getRecordByGuid: function(guid) {

		return this._records_by_guid[guid];

	},

	getApp: function() {

		return this._app;

	},

	safeLoadRecord: function(raw_properties) {

		var result;

		if (raw_properties.id && (raw_properties.id in this._records_by_id)) {

			result = this._records_by_id[raw_properties.id];

		} else {

			result = this.loadRecord(raw_properties);

		}

		return result;

	},

	loadRecord: function(raw_properties) {

		var record = this._createRecordInstance(raw_properties);
		this._fire('records_loaded', {records: [record]});
		return record;

	},

	createRecord: function() {

		var record = this._createRecordInstance();
		this._fire('records_created', {records: [record]});
		return record;

	},

	_createRecordInstance: function(raw_properties) {

		var storage = this._createEmptyRecordStorage(),
			constructor = Lava.ClassManager.getConstructor(this._record_class, 'Lava.data'),
			record = new constructor(this, this._fields, storage, raw_properties);

		if (storage.id) {

			if (storage.id in this._records_by_id) Lava.t("Duplicate record id in module " + this._name);
			this._records_by_id[storage.id] = record;

		}

		this._records.push(record);
		this._storages_by_guid[record.guid] = storage;
		this._records_by_guid[record.guid] = record;
		return record;

	},

	/**
	 * @param {Array.<Object>} raw_records_array
	 * @returns {Array}
	 */
	loadRecords: function(raw_records_array) {

		var i = 0,
			count = raw_records_array.length,
			records = [];

		for (; i < count; i++) {

			records.push(this._createRecordInstance(raw_records_array[i]));

		}

		this._fire('records_loaded', {records: records});

		return records;

	},

	getAllRecords: function() {

		return this._records.slice();

	},

	getCount: function() {

		return this._records.length;

	},

	destroy: function() {

		this._records_by_id = null;
		this.ModuleAbstract$destroy();

	}

});

Lava.define(
'Lava.data.RecordAbstract',
/**
 * @lends Lava.data.RecordAbstract#
 * @extends Lava.mixin.Properties
 */
{

	Implements: 'Lava.mixin.Properties',

	isRecord: true,

	// replace the default value to save some processor time on garbage collection (it's assigned in constructor)
	_properties: null,

	_module: null,

	_fields: null,

	/**
	 * Every record must have it's own GUID. otherwise collections and ForEach loops will not be able to distinguish
	 * between records from different modules with equal ID fields.
	 */
	guid: null,

	init: function(module, fields, properties_storage_ref) {

		this.guid = Lava.guid++;
		this._module = module;
		this._fields = fields;
		this._properties = properties_storage_ref;

	},

	get: function(name) {

		if (Lava.schema.DEBUG && !(name in this._fields)) Lava.t('[Record] No such field: ' + name);
		return this._fields[name].getValue(this, this._properties);

	},

	set: function(name, value) {

		if (Lava.schema.DEBUG && !(name in this._fields)) Lava.t('[Record] No such field: ' + name);
		this._fields[name].setValue(this, this._properties, value);

	},

	getModule: function() {

		return this._module;

	},

	'export': function() {

		var export_record = {};

		for (var field in this._fields) {

			this._fields[field]['export'](this, export_record);

		}

		return export_record;

	}

});

Lava.define(
'Lava.data.Record',
/**
 * @lends Lava.data.Record#
 * @extends Lava.data.RecordAbstract
 */
{

	Extends: 'Lava.data.RecordAbstract',

	init: function(module, fields, properties_storage_ref, raw_properties) {

		this.RecordAbstract$init(module, fields, properties_storage_ref);

		var field;

		if (typeof(raw_properties) != 'undefined') {

			for (field in fields) {

				fields[field]['import'](this, properties_storage_ref, raw_properties);

			}

		} else {

			for (field in fields) {

				fields[field].initNewRecord(this, properties_storage_ref);

			}

		}

	}

});

Lava.define(
'Lava.data.MetaRecord',
/**
 * @lends Lava.data.MetaRecord#
 * @extends Lava.data.RecordAbstract
 */
{

	Extends: 'Lava.data.RecordAbstract',

	isMetaRecord: true,

	init: function(meta_storage, fields, properties_storage_ref) {

		this.RecordAbstract$init(meta_storage, fields, properties_storage_ref);

		for (var field in fields) {

			fields[field].initNewRecord(this, properties_storage_ref);

		}

	}

});

Lava.define(
'Lava.data.MetaStorage',
/**
 * @lends Lava.data.MetaStorage#
 * @extends Lava.data.ModuleAbstract
 * @extends Lava.mixin.Properties
 */
{

	Extends: 'Lava.data.ModuleAbstract',
	Implements: 'Lava.mixin.Properties',

	//_attached_module: null,

	/**
	 * @param {_cMetaStorage} config
	 */
	init: function(config) {

		if ('id' in config.fields) Lava.t("Id field in MetaStorage is not permitted");

		this._config = config;
		//this._attached_module = attached_module;

		var default_storage = this._initFields(config),
			field;

		if (Lava.schema.DEBUG) {
			for (field in this._fields) {
				if (this._fields[field].isCollectionField || this._fields[field].isRecordField)
					Lava.t("Standard Collection and Record fields will not work inside the MetaStorage");
			}
		}

		this._createEmptyRecordStorage = new Function(
			"return " + Lava.Serializer.serialize(default_storage)
		);

	},

	get: function(guid) {

		if (!(guid in this._properties)) {

			this._properties[guid] = this._createRecordInstance();

		}

		return this._properties[guid];

	},

	set: function(name, value) {

		Lava.t("MetaStorage: set operation is not permitted");

	},

//	getAttachedModule: function() {
//
//		return this._attached_module;
//
//	},

	_createRecordInstance: function() {

		var storage = this._createEmptyRecordStorage(),
			constructor = Lava.ClassManager.getConstructor('MetaRecord', 'Lava.data'),
			record = new constructor(this, this._fields, storage);

		this._records.push(record);
		this._storages_by_guid[record.guid] = storage;
		this._records_by_guid[record.guid] = record;
		return record;

	},

	getAllRecords: function() {

		var result = [],
			guid;

		for (guid in this._properties) {
			result.push(this._properties[guid]);
		}

		return result;

	}

});
Lava.define(
'Lava.scope.Abstract',
/**
 * @lends Lava.scope.Abstract#
 * @extends Lava.mixin.Refreshable
 */
{

	Extends: 'Lava.mixin.Refreshable',

	isValueContainer: true,

	/**
	 * @type {Object.<string, Lava.scope.DataBinding>}
	 */
	_data_bindings_by_property: {},

	/**
	 * [name_source_guid} => Segment
	 * @type {Object.<_tGUID, Lava.scope.Segment>}
	 */
	_data_segments: {},

	/**
	 * @param {string} property_name
	 * @returns {Lava.scope.DataBinding}
	 */
	getDataBinding: function(property_name) {

		if (!(property_name in this._data_bindings_by_property)) {

			this._data_bindings_by_property[property_name] = new Lava.scope.DataBinding(this, property_name, this.level);

		}

		return this._data_bindings_by_property[property_name];

	},

	/**
	 * @param {(Lava.scope.PropertyBinding|Lava.scope.DataBinding)} name_source_scope
	 * @returns {Lava.scope.Segment}
	 */
	getSegment: function(name_source_scope) {

		if (Lava.schema.DEBUG && !name_source_scope.guid) Lava.t("Only PropertyBinding and DataBinding may be used as name source for segments");

		if (!(name_source_scope.guid in this._data_segments)) {

			this._data_segments[name_source_scope.guid] = new Lava.scope.Segment(this, name_source_scope, this.level);

		}

		return this._data_segments[name_source_scope.guid];

	},

	destroy: function() {

		var name;

		for (name in this._data_bindings_by_property) {

			this._data_bindings_by_property[name].destroy();

		}

		for (name in this._data_segments) {

			this._data_segments[name].destroy();

		}

		this.suspendRefreshable();

	}

});

Lava.define(
'Lava.scope.Argument',
/**
 * @lends Lava.scope.Argument#
 * @extends Lava.mixin.Refreshable
 * @implements _iValueContainer
 */
{

	Extends: 'Lava.mixin.Refreshable',
	isValueContainer: true,

	/**
	 * @type {Lava.view.View}
	 */
	_view: null,
	/**
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,
	/**
	 * @type {function}
	 */
	_evaluator: null,
	_value: null,
	guid: null,

	/**
	 * @type {Array.<_iValueContainer>}
	 */
	_binds: [],
	_binds_count: 0,
	_bind_listeners: [],

	_modifiers: [],
	_active_modifiers: [],

	/**
	 * @param {_cArgument} config
	 * @param {Lava.view.Abstract} view
	 * @param {Lava.widget.Standard} widget
	 */
	init: function(config, view, widget) {

		this.guid = Lava.guid++;
		this._view = view;
		this._widget = widget;
		this._evaluator = config.evaluator;

		var i = 0,
			count,
			bind,
			first_level = 0,
			binds = config.binds;

		if (binds) {

			for (count = binds.length; i < count; i++) {

				if (binds[i].isDynamic) {

					bind = view.locateViewByPathConfig(binds[i]).getDynamicScope(view, binds[i]);

				} else {

					bind = view.getScopeByPathConfig(binds[i]);

				}

				if (bind.isWaitingRefresh()) {
					this._count_dependencies_waiting_refresh++;
					this._waits_refresh = true;
				}
				this._binds.push(bind);
				this._bind_listeners.push({
					waits_refresh: bind.on('waits_refresh', this._onDependencyWaitsRefresh, this),
					changed: bind.on('changed', this.onBindingChanged, this),
					refreshed: bind.on('refreshed', this._onDependencyRefreshed, this)
				});

				if (this.level < bind.level) {

					this.level = bind.level;

				}

				if (first_level != bind.level) {

					if (i == 0) {

						first_level = bind.level; // replace default

					} else {

						this._requeue = true;

					}

				}

			}

		}

		if ('modifiers' in config) {

			for (i = 0, count = config.modifiers.length; i < count; i++) {

				this._modifiers.push({
					widget: this.getWidgetByModifierConfig(config.modifiers[i]),
					callback_name: config.modifiers[i].callback_name
				});

			}

		}

		/*if ('active_modifiers' in config) {

			for (i = 0, count = config.active_modifiers.length; i < count; i++) {

				this._active_modifiers.push({
					widget: this.getWidgetByModifierConfig(config.active_modifiers[i]),
					callback_name: config.active_modifiers[i].callback_name
				});

			}

		}*/

		this._binds_count = this._binds.length;
		this._value = this._evaluate();

	},

	/**
	 * @param {_cKnownViewLocator} path_config
	 * @returns {Lava.widget.Standard}
	 */
	getWidgetByModifierConfig: function(path_config) {

		var widget = this._widget.locateViewByPathConfig(path_config);

		if (Lava.schema.DEBUG && !widget.isWidget) Lava.t("Tried to call a modifier from non-widget view");

		return widget;

	},

	onBindingChanged: function() {

		// Classes that can serve as a binding: PropertyBinding, DataBinding and Segment. They all will fire 'changed'
		// event only during the refresh cycle, so at this moment the Argument must be already in queue.
		if (!this._waits_refresh) Lava.t();

		this._is_dirty = true;

	},

	_evaluate: function() {

		var result = null;

		// in production - wrap evaluation into try/catch block
		if (Lava.schema.DEBUG) {

			result = this._evaluator();

		} else {

			try {

				result = this._evaluator();

			} catch (e) {

				Lava.logException(e);

			}

		}

		return result;

	},

	getValue: function() {

		return this._value;

	},

	_doRefresh: function() {

		var newValue = this._evaluate(),
			event_args;

		if (newValue !== this._value) {

			event_args = {old_value: this._value};
			this._value = newValue;
			this._fire('changed', event_args);

		}

	},

	_callModifier: function(index, arguments_array) {

		return this._modifiers[index].widget.callModifier(this._modifiers[index].callback_name, arguments_array);

	},

	_callActiveModifier: function(index, arguments_array) {

		return this._modifiers[index].widget.callActiveModifier(this._modifiers[index].callback_name, arguments_array);

	},

	_callGlobalModifier: function(name, arguments_array) {

		if (Lava.schema.DEBUG && !(name in Lava.modifiers)) Lava.t("Unknown global modifier: " + name);
		return Lava.modifiers[name].apply(Lava.modifiers, arguments_array);

	},

	sleep: function() {

		for (var i = 0, count = this._bind_listeners.length; i < count; i++) {

			Lava.suspendListener(this._bind_listeners[i].waits_refresh);
			Lava.suspendListener(this._bind_listeners[i].changed);
			Lava.suspendListener(this._bind_listeners[i].refreshed);

		}

		this.suspendRefreshable();

	},

	wakeup: function(fire_changed) {

		for (var i = 0, count = this._bind_listeners.length; i < count; i++) {

			if (this._binds[i].isWaitingRefresh()) {

				//this._count_dependencies_waiting_refresh++;
				Lava.t();

			}

			Lava.resumeListener(this._bind_listeners[i].waits_refresh);
			Lava.resumeListener(this._bind_listeners[i].changed);
			Lava.resumeListener(this._bind_listeners[i].refreshed);

		}

		//if (this._count_dependencies_waiting_refresh) {

		//	this._waits_refresh = true;

		//} else {

			var newValue = this._evaluate();

			if (newValue !== this._value) {

				this._value = newValue;

				if (fire_changed) {

					this._fire('changed');

				}

			}

			this._is_dirty = false;

		//}

	},

	destroy: function() {

		for (var i = 0, count = this._bind_listeners.length; i < count; i++) {

			this._binds[i].removeListener(this._bind_listeners[i].waits_refresh);
			this._binds[i].removeListener(this._bind_listeners[i].changed);
			this._binds[i].removeListener(this._bind_listeners[i].refreshed);

		}

		this._bind_listeners = null;
		this.suspendRefreshable();

	}

});
Lava.define(
'Lava.scope.Binding',
/**
 * @lends Lava.scope.Binding#
 */
{

	/**
	 * @type {_iValueContainer}
	 */
	_scope: null,
	/**
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,
	/**
	 * @type {string}
	 */
	_property_name: null,

	_scope_changed_listener: null,
	_scope_refreshed_listener: null,
	_widget_property_changed_listener: null,

	_scope_refresh_lock: false,
	_scope_refresh_count: 0,

	/**
	 * @param {_cBinding} config
	 * @param {Lava.widget.Standard} widget
	 */
	init: function(config, widget) {

		this._widget = widget;
		this._property_name = config.property_name;
		this._scope = widget.getScopeByPathConfig(config.path_config);

		var widget_listener = true,
			scope_listener = true;

		if ('direction' in config) {

			if (config.direction == Lava.BINDING_DIRECTIONS.TO_WIDGET) {

				this._widget.set(this._property_name, this._scope.getValue());
				widget_listener = false;

			} else {

				if (Lava.schema.DEBUG && config.direction != Lava.BINDING_DIRECTIONS.FROM_WIDGET) Lava.t();

				this._scope.setValue(this._widget.get(this._property_name));
				scope_listener = false;

			}

		} else {

			this._widget.set(this._property_name, this._scope.getValue());

		}

		if (scope_listener) {
			this._scope_changed_listener = this._scope.on('changed', this.onScopeChanged, this);
		}

		if (widget_listener) {
			if (!this._scope.isSetValue) Lava.t("Binding: bound scope does not implement setValue");
			this._widget_property_changed_listener = widget.onPropertyChanged(this._property_name, this.onWidgetPropertyChanged, this);
		}

	},

	onScopeChanged: function() {

		var value = this._scope.getValue();

		// avoid setting nulls to non-nullable fields.
		if (this._scope.isConnected()) {

			// turning off both of them to avoid infinite loop. From architect's point of view, better solution would be
			// to hang up developer's browser, but if it happens in production - it may have disastrous consequences.
			Lava.suspendListener(this._widget_property_changed_listener);
			Lava.suspendListener(this._scope_changed_listener);
			this._widget.set(this._property_name, this._scope.getValue());
			Lava.resumeListener(this._widget_property_changed_listener);
			Lava.resumeListener(this._scope_changed_listener);

		}

	},

	onWidgetPropertyChanged: function() {

		Lava.suspendListener(this._widget_property_changed_listener);
		Lava.suspendListener(this._scope_changed_listener);
		this._scope.setValue(this._widget.get(this._property_name));
		Lava.resumeListener(this._widget_property_changed_listener);
		Lava.resumeListener(this._scope_changed_listener);

	},

	destroy: function() {

		this._scope_changed_listener && this._scope.removeListener(this._scope_changed_listener);
		this._widget_property_changed_listener && this._widget.removePropertyListener(this._widget_property_changed_listener);

	}

});
Lava.define(
'Lava.scope.DataBinding',
/**
 * @lends Lava.scope.DataBinding#
 * @extends Lava.scope.Abstract
 * @implements _iValueContainer
 */
{

	Extends: 'Lava.scope.Abstract',
	isSetValue: true,
	guid: null,

	/**
	 * @type {string}
	 */
	_property_name: null,
	_value: null,

	/**
	 * @type {_iValueContainer}
	 */
	_value_container: null,
	_container_waits_refresh_listener: null,
	_container_changed_listener: null,
	_container_refreshed_listener: null,

	_property_changed_listener: null,
	_enumerable_changed_listener: null,
	_property_container: null,

	_is_connected: false,

	/**
	 * @param {_iValueContainer} value_container
	 * @param {string} property_name
	 * @param {number} level
	 */
	init: function(value_container, property_name, level) {

		this.guid = Lava.guid++;
		this._value_container = value_container;
		this._property_name = property_name;
		this.level = level;

		if (value_container.isWaitingRefresh()) {
			this._count_dependencies_waiting_refresh++;
			this._waits_refresh = true;
		}
		this._container_waits_refresh_listener = value_container.on('waits_refresh', this._onDependencyWaitsRefresh, this);
		this._container_changed_listener = value_container.on('changed', this.onParentDataSourceChanged, this);
		this._container_refreshed_listener = value_container.on('refreshed', this._onDependencyRefreshed, this);

		this._refreshValue();

		Lava.schema.DEBUG && Lava.ScopeManager.debugTrackScope(this);

	},

	_refreshValue: function() {

		var property_container = this._value_container.getValue(),
			value = null,
			is_connected = false;

		if (property_container != null) {

			if (property_container.isEnumerable && /^\d+$/.test(this._property_name)) {

				if (this._enumerable_changed_listener == null) {

					this._enumerable_changed_listener = property_container.on('collection_changed', this.onValueChanged, this);
					this._property_container = property_container;

				}

				value = property_container.getValueAt(+this._property_name);

			} else if (property_container.isProperties) {

				if (this._property_changed_listener == null) {

					this._property_changed_listener = property_container.onPropertyChanged(this._property_name, this.onValueChanged, this);
					this._property_container = property_container;

				}

				value = property_container.get(this._property_name);

			} else {

				value = property_container[this._property_name];

			}

			is_connected = true;

		}

		if (value !== this._value || this._is_connected != is_connected) {

			this._value = value;
			this._is_connected = is_connected;

			this._fire('changed');

		}

	},

	isConnected: function() {

		return this._is_connected;

	},

	onParentDataSourceChanged: function() {

		if (this._property_changed_listener && (this._value_container.getValue() != this._property_container)) {

			// currently listening to the parent's old data source
			this._property_changed_listener && this._property_container.removePropertyListener(this._property_changed_listener);
			this._enumerable_changed_listener && this._property_container.removeListener(this._enumerable_changed_listener);
			this._property_changed_listener = null;
			this._enumerable_changed_listener = null;
			this._property_container = null;

		}

		this._queueForRefresh();

		this._is_dirty = true;

	},

	_doRefresh: function() {

		this._refreshValue();

	},

	onValueChanged: function() {

		this._queueForRefresh();
		this._is_dirty = true;

	},

	/**
	 * @param {*} value
	 */
	setValue: function(value) {

		var property_container = this._value_container.getValue();

		if (property_container) {

			if (this._property_changed_listener) {

				Lava.suspendListener(this._property_changed_listener);
				property_container.set(this._property_name, value);
				Lava.resumeListener(this._property_changed_listener);

			} else if (this._enumerable_changed_listener) {

				Lava.suspendListener(this._enumerable_changed_listener);
				property_container.replaceAt(+this._property_name, value);
				Lava.resumeListener(this._enumerable_changed_listener);

			} else if (property_container.isProperties) {

				property_container.set(this._property_name, value);

			} else {

				property_container[this._property_name] = value;

			}

			this._queueForRefresh();
			this._is_dirty = true;

		}

	},

	getValue: function() {

		return this._value;

	},

	destroy: function() {

		this._value_container.removeListener(this._container_waits_refresh_listener);
		this._value_container.removeListener(this._container_changed_listener);
		this._value_container.removeListener(this._container_refreshed_listener);

		this._property_changed_listener && this._property_container.removePropertyListener(this._property_changed_listener);
		this._enumerable_changed_listener && this._property_container.removeListener(this._enumerable_changed_listener);
		this._property_container = null;

		Lava.schema.DEBUG && Lava.ScopeManager.debugStopTracking(this);
		this.Abstract$destroy();

	}

});
Lava.define(
'Lava.scope.Foreach',
/**
 * @lends Lava.scope.Foreach#
 * @extends Lava.mixin.Refreshable
 * @implements _iValueContainer
 */
{

	Extends: 'Lava.mixin.Refreshable',
	isValueContainer: true,

	/**
	 * @type {Lava.scope.Argument}
	 */
	_argument: null,
	_argument_waits_refresh_listener: null,
	_argument_changed_listener: null,
	_argument_refreshed_listener: null,

	_view: null,
	_widget: null,
	guid: null,

	/**
	 * @type {Lava.system.Enumerable}
	 */
	_value: null,
	_observable_listener: null,
	_observable: null,
	_own_enumerable: false,

	_create_own_enumerable: false,
	_after_refresh_callback: null,

	/**
	 * @param {Lava.scope.Argument} argument
	 * @param {Lava.view.Foreach} view
	 * @param {Lava.widget.Standard} widget
	 * @param {?_cScopeForeach} options
	 */
	init: function(argument, view, widget, options) {

		this.guid = Lava.guid++;
		this._argument = argument;
		this._view = view;
		this._widget = widget;
		this.level = argument.level;

		if (this._argument.isWaitingRefresh()) {
			this._count_dependencies_waiting_refresh++;
			this._waits_refresh = true;
		}

		if (options) {
			this._create_own_enumerable = options['create_own_enumerable'] || false;
			this._after_refresh_callback = options['after_refresh_callback'] || null;
		}

		this._argument_waits_refresh_listener = this._argument.on('waits_refresh', this._onDependencyWaitsRefresh, this);
		this._argument_changed_listener = this._argument.on('changed', this.onDataSourceChanged, this);
		this._argument_refreshed_listener = this._argument.on('refreshed', this._onDependencyRefreshed, this);

		this._refreshDataSource();

	},

	_refreshDataSource: function() {

		var argument_value = this._argument.getValue();

		if (argument_value) {

			if (argument_value.isEnumerable) {

				if (this._create_own_enumerable) {

					this._createOrUpdateCollection(argument_value);

				} else {

					if (this._own_enumerable) {

						this._value.destroy();
						this._own_enumerable = false;
						this._value = null;

					}

					if (this._value != argument_value) {
						this._value = argument_value;
						this._fire('new_enumerable');
					}

				}

			} else {

				this._createOrUpdateCollection(argument_value);

			}

			if (this._observable_listener == null) {

				if (argument_value.isEnumerable) {

					this._observable_listener = argument_value.on('collection_changed', this._onObservableChanged, this);
					this._observable = argument_value;

				} else if (argument_value.isProperties) {

					this._observable_listener = argument_value.on('property_changed', this._onObservableChanged, this);
					this._observable = argument_value;

				}

			}

		} else if (this._own_enumerable) {

			this._value.removeAll();

		} else {

			this._createCollection(null);

		}

		if (this._after_refresh_callback) {
			this._widget[this._after_refresh_callback](this._value, argument_value, this._view);
		}

	},

	_createOrUpdateCollection: function(argument_value) {

		if (this._own_enumerable) {

			this._value.setSourceObject(argument_value);
			this._value.updateFromSourceObject();

		} else {

			this._createCollection(argument_value);

		}

	},

	_createCollection: function(argument_value) {

		this._value = new Lava.system.Enumerable(argument_value);
		this._own_enumerable = true;
		this._fire('new_enumerable');

	},

	_flushObservable: function() {

		this._observable.removeListener(this._observable_listener);
		this._observable_listener = null;
		this._observable = null;

	},

	onDataSourceChanged: function() {

		if (this._observable_listener) this._flushObservable();
		this._is_dirty = true;
		this._queueForRefresh();

	},

	_onObservableChanged: function() {

		this._is_dirty = true;
		this._queueForRefresh();

	},

	_doRefresh: function() {

		this._refreshDataSource();
		this._fire('changed');

	},

	getValue: function() {

		return this._value;

	},

	sleep: function() {

		Lava.suspendListener(this._argument_changed_listener);
		this._observable_listener && Lava.suspendListener(this._observable_listener);
		this.suspendRefreshable();

	},

	wakeup: function() {

		if (this._observable_listener) {

			if (this._argument.getValue() != this._observable) {

				this._flushObservable();

			} else {

				Lava.resumeListener(this._observable_listener);

			}

		}

		this._refreshDataSource();
		Lava.resumeListener(this._argument_changed_listener);
		this._is_dirty = false;

	},

	destroy: function() {

		this._argument.removeListener(this._argument_waits_refresh_listener);
		this._argument.removeListener(this._argument_changed_listener);
		this._argument.removeListener(this._argument_refreshed_listener);
		this._observable_listener && this._flushObservable();

		if (this._own_enumerable) {

			this._value.destroy();

		}

		this.suspendRefreshable();

	}

});

Lava.define(
'Lava.scope.PropertyBinding',
/**
 * @lends Lava.scope.PropertyBinding#
 * @extends Lava.scope.Abstract
 * @implements _iValueContainer
 */
{

	Extends: 'Lava.scope.Abstract',
	isSetValue: true,
	guid: null,

	/**
	 * @type {string}
	 */
	_property_name: null,
	_value: null,

	/**
	 * @type {Lava.view.Abstract}
	 */
	_view: null,
	_property_changed_listener: null,

	_assign_argument: null,

	/**
	 * @param {Lava.view.Abstract} view
	 * @param {string} property_name
	 * @param {number} level
	 * @param {_cAssign} assign_config
	 */
	init: function(view, property_name, level, assign_config) {

		this.guid = Lava.guid++;
		this._view = view;
		this._property_name = property_name;
		this.level = level;

		if (assign_config) {

			this._assign_argument = new Lava.scope.Argument(assign_config, view, view.getWidget());

			if (this._assign_argument.isWaitingRefresh()) {
				this._count_dependencies_waiting_refresh++;
				this._waits_refresh = true;
			}
			this._assign_argument.on('waits_refresh', this._onDependencyWaitsRefresh, this);
			this._assign_argument.on('changed', this.onAssignChanged, this);
			this._assign_argument.on('refreshed', this._onDependencyRefreshed, this);

			this._value = this._assign_argument.getValue();
			view.set(this._property_name, this._value);

		} else {

			this._value = view.get(this._property_name);
			this._property_changed_listener = view.onPropertyChanged(property_name, this.onContainerPropertyChanged, this);

		}

		Lava.schema.DEBUG && Lava.ScopeManager.debugTrackScope(this);

	},

	isConnected: function() {

		return true; // property binding is always connected to it's widget

	},

	onAssignChanged: function() {

		this._view.set(this._property_name, this._assign_argument.getValue());
		this._queueForRefresh();
		this._is_dirty = true;

	},

	onContainerPropertyChanged: function() {

		this._queueForRefresh();
		this._is_dirty = true;

	},

	getValue: function() {

		return this._value;

	},

	/**
	 * @param {*} value
	 */
	setValue: function(value) {

		Lava.suspendListener(this._property_changed_listener);
		this._view.set(this._property_name, value);
		Lava.resumeListener(this._property_changed_listener);

		this._queueForRefresh();
		this._is_dirty = true;

	},

	_doRefresh: function() {

		var new_value = this._view.get(this._property_name);

		if (new_value !== this._value) {

			this._value = new_value;

			this._fire('changed');

		}

	},

	destroy: function() {

		if (this._assign_argument) {

			this._assign_argument.destroy();

		} else {

			this._view.removePropertyListener(this._property_changed_listener);

		}

		Lava.schema.DEBUG && Lava.ScopeManager.debugStopTracking(this);

		this.Abstract$destroy();

	}

});
Lava.define(
'Lava.scope.Segment',
/**
 * @lends Lava.scope.Segment#
 * @extends Lava.scope.Abstract
 * @implements _iValueContainer
 */
{

	Extends: 'Lava.scope.Abstract',
	isSetValue: true,

	_container: null,

	/**
	 * @type {_iValueContainer}
	 */
	_name_source_container: null,
	_name_source_waits_refresh_listener: null,
	_name_source_changed_listener: null,
	_name_source_refreshed_listener: null,

	_property_name: null,
	_data_binding: null,
	_data_binding_changed_listener: null,

	_value: null,

	/**
	 * @param {(Lava.view.Abstract|Lava.scope.Abstract)} container
	 * @param {(Lava.scope.PropertyBinding|Lava.scope.DataBinding)} name_source_container
	 * @param {number} level
	 */
	init: function(container, name_source_container, level) {

		if (Lava.schema.DEBUG && !name_source_container.isValueContainer) Lava.t();
		if (Lava.schema.DEBUG && !name_source_container.guid) Lava.t("Name source for segments must be either PropertyBinding or DataBinding");

		this._container = container;
		this._property_name = name_source_container.getValue();

		this._refreshDataBinding();

		if (name_source_container.isWaitingRefresh()) {
			this._count_dependencies_waiting_refresh++;
			this._waits_refresh = true;
		}
		this._name_source_container = name_source_container;
		this._name_source_waits_refresh_listener = name_source_container.on('waits_refresh', this._onDependencyWaitsRefresh, this);
		this._name_source_changed_listener = name_source_container.on('changed', this.onPropertyNameChanged, this);
		this._name_source_refreshed_listener = name_source_container.on('refreshed', this._onDependencyRefreshed, this);

		this.level = level > name_source_container.level ? level : name_source_container.level;
		this._requeue = true;
		this._value = this._data_binding.getValue();

		Lava.schema.DEBUG && Lava.ScopeManager.debugTrackScope(this);

	},

	isConnected: function() {

		if (!this._data_binding) Lava.t();
		return this._data_binding.isConnected();

	},

	_refreshDataBinding: function() {

		this._data_binding = this._container.getDataBinding(this._property_name);
		this._data_binding_changed_listener = this._data_binding.on('changed', this.onDataBindingChanged, this);

	},

	_destroyDataBinding: function() {

		this._data_binding.removeListener(this._data_binding_changed_listener);
		this._data_binding = null;
		this._data_binding_changed_listener = null;

	},

	onDataBindingChanged: function() {

		this._queueForRefresh();
		this._is_dirty = true;

	},

	_doRefresh: function() {

		if (this._data_binding == null) {

			this._refreshDataBinding();

		}

		var new_value = this._data_binding.getValue();

		if (new_value !== this._value) {

			this._value = new_value;

			this._fire('changed');

		}

	},

	onPropertyNameChanged: function() {

		this._property_name = this._name_source_container.getValue();

		this._destroyDataBinding();
		this._queueForRefresh();
		this._is_dirty = true;

	},

	getValue: function() {

		return this._value;

	},

	/**
	 * @param {*} value
	 */
	setValue: function(value) {

		if (this._data_binding) {
			this._data_binding.setValue(value);
		}

	},

	destroy: function() {

		this._name_source_container.removeListener(this._name_source_waits_refresh_listener);
		this._name_source_container.removeListener(this._name_source_changed_listener);
		this._name_source_container.removeListener(this._name_source_refreshed_listener);
		this._data_binding_changed_listener && this._data_binding.removeListener(this._data_binding_changed_listener);

		Lava.schema.DEBUG && Lava.ScopeManager.debugStopTracking(this);
		this.Abstract$destroy();

	}

});

Lava.define(
'Lava.view.container.Element',
/**
 * @lends Lava.view.container.Element#
 * @implements iContainer
 */
{

	isElementContainer: true,

	_id: null,
	/**
	 * @type {Lava.view.View}
	 */
	_view: null,
	/**
	 * @type {_cElementContainer}
	 */
	_config: null,
	/**
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,
	_tag_name: null,

	_static_classes: [],
	/**
	 * @type {!Object.<string, Lava.scope.Argument>}
	 */
	_class_bindings: null,

	_class_bindings_values: {},

	_static_styles: {},
	/**
	 * @type {!Object.<string, Lava.scope.Argument>}
	 */
	_style_bindings: null,

	_static_properties: {}, // name => value
	/**
	 * @type {!Object.<string, Lava.scope.Argument>}
	 */
	_property_bindings: null,

	/**
	 * @type {Object.<string, Array.<_cTarget>>}
	 */
	_events: {},

	_is_inDOM: false,

	_element: null,

	_is_void: false,

	_is_element_owner: true,

	/**
	 * @param {Lava.view.View} view
	 * @param {_cElementContainer} config
	 * @param {Lava.widget.Standard} widget
	 */
	init: function(view, config, widget) {

		var name,
			resource_owner,
			container_resources,
			static_classes,
			static_properties,
			static_styles;

		this._id = Lava.ELEMENT_ID_PREFIX + view.guid;

		this._view = view;
		this._config = config;
		this._widget = widget;
		this._tag_name = config.tag_name;
		this._is_void = Lava.isVoidTag(this._tag_name);

		if (Lava.schema.RESOURCES_ENABLED && config.resource_id) {

			resource_owner = Lava.view_manager.locateTarget(widget, config.resource_id.locator_type, config.resource_id.locator);
			if (Lava.schema.DEBUG && !resource_owner) Lava.t("[Element container] resource owner not found: " + config.resource_id.locator_type + "=" + config.resource_id.locator);
			container_resources = resource_owner.getResource(config.resource_id.name);

		}

		if (Lava.schema.RESOURCES_ENABLED && container_resources) {

			if (Lava.schema.DEBUG && container_resources.type != 'container') Lava.t("Element container: received resource type is not container: " + container_resources.type);
			static_classes = container_resources.value['static_classes'];
			static_properties = container_resources.value['static_properties'];
			static_styles = container_resources.value['static_styles'];

		} else {

			static_classes = config['static_classes'];
			static_properties = config['static_properties'];
			static_styles = config['static_styles'];

		}

		if (Lava.schema.DEBUG && static_properties && ('id' in static_properties))
			Lava.t("Element container: id must not be set via resources or be in config.static_properties");

		// Must clone everything, cause additional statics can be added to the element at run time
		if (static_classes) this._static_classes = static_classes.slice();
		for (name in static_styles) {
			this._static_styles[name] = static_styles[name];
		}
		for (name in static_properties) {
			this._static_properties[name] = static_properties[name];
		}

		for (name in config.events) {
			this._events[name] = Firestorm.clone(config.events[name]); // Object.<string, Array.<_cTarget>>
		}

		this._property_bindings = this._createArguments(config.property_bindings, view, this._onPropertyBindingChanged);
		this._style_bindings = this._createArguments(config.style_bindings, view, this._onStyleBindingChanged);
		// note: class_bindings is also an object. TemplateParser names properties numerically, starting from zero.
		this._class_bindings = this._createArguments(config.class_bindings, view, this._onClassBindingChanged);

		for (name in this._class_bindings) {

			this._class_bindings_values[name] = this._toClassNames(this._class_bindings[name].getValue() || '');

		}

	},

	/**
	 * @param {string} event_name
	 * @returns {Array.<_cTarget>}
	 */
	getEventTargets: function(event_name) {

		return this._events[event_name];

	},

	/**
	 * One-time gateway for IOS bugfixes
	 * http://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
	 * http://www.quirksmode.org/blog/archives/2010/10/click_event_del_1.html
	 */
	_fixIOS: function() {

		var prototype = this.Class.constructor.prototype;
		if (navigator.userAgent.match(/i(Phone|Pod|Pad)/)) {

			prototype.addEventTarget = this.addEventTarget_IOS;
			prototype.informInDOM = this.informInDOM_IOS;

		} else {

			prototype.addEventTarget = this.addEventTarget_Original;
			prototype.informInDOM = this.informInDOM_Original;

		}

	},

	addEventTarget: function(event_name, target) {

		this._fixIOS();
		this.addEventTarget(event_name, target);

	},

	addEventTarget_IOS: function(event_name, target) {

		if (this._is_inDOM && event_name == 'click' && !(event_name in this._events)) {
			this.getDOMElement().onclick = Lava.noop;
		}
		this.addEventTarget_Original(event_name, target)

	},

	addEventTarget_Original: function(event_name, target) {

		if (!(event_name in this._events)) {

			this._events[event_name] = [target];

		} else {

			this._events[event_name].push(target);

		}

	},

	/**
	 * Store property value in the javascript class, and optionally - set it on the DOM element.
	 * View can be rendered at any time, so property values must always be actual.
	 *
	 * @param {string} name
	 * @param value
	 */
	setProperty: function(name, value) {

		this.storeProperty(name, value);
		if (this._is_inDOM) this.syncProperty(name);

	},

	storeProperty: function(name, value) {

		if (Lava.schema.DEBUG && name == 'id') Lava.t();
		if (Lava.schema.DEBUG && (name in this._property_bindings)) Lava.t("Property is bound to an argument and cannot be set directly: " + name);

		this._static_properties[name] = value;

	},

	getProperty: function(name) {

		return this._static_properties[name];

	},

	/**
	 * Push locally stored property value into element.
	 * @param name
	 */
	syncProperty: function(name) {

		Firestorm.Element.setProperty(this.getDOMElement(), name, this._static_properties[name]);

	},

	addClass: function(class_name, cancel_sync) {

		if (Lava.schema.DEBUG && (!class_name || class_name.indexOf(' ') != -1)) Lava.t("addClass: expected one class name, got: " + class_name);

		if (Firestorm.Array.include(this._static_classes, class_name)) {

			if (this._is_inDOM && !cancel_sync) Firestorm.Element.addClass(this.getDOMElement(), class_name);

		}

	},

	removeClass: function(class_name, cancel_sync) {

		if (Firestorm.Array.exclude(this._static_classes, class_name)) {

			if (this._is_inDOM && !cancel_sync) Firestorm.Element.removeClass(this.getDOMElement(), class_name);

		}

	},

	addClasses: function(class_names, cancel_sync) {

		if (Lava.schema.DEBUG && typeof(class_names) == 'string') Lava.t();

		for (var i = 0, count = class_names.length; i < count; i++) {

			this.addClass(class_names[i])

		}

	},

	hasStaticClass: function(class_name) {

		return this._static_classes.indexOf(class_name) != -1;

	},

	syncClasses: function() {

		Firestorm.Element.setProperty(this.getDOMElement(), 'class', this._renderClasses());

	},

	setStyle: function(name, value, cancel_sync) {

		if (value == null) {

			this.removeStyle(name, cancel_sync);

		} else {

			this._static_styles[name] = value;
			if (this._is_inDOM && !cancel_sync) Firestorm.Element.setStyle(this.getDOMElement(), name, value);

		}

	},

	removeStyle: function(name, cancel_sync) {

		if (name in this._static_styles) {
			delete this._static_styles[name];
			if (this._is_inDOM && !cancel_sync) Firestorm.Element.setStyle(this.getDOMElement(), name, null);
		}

	},

	getStyle: function(name) {

		return this._static_styles[name];

	},

	syncStyles: function() {

		Firestorm.Element.setProperty(this.getDOMElement(), 'style', this._renderStyles());

	},

	/**
	 * @param {?Object.<string, _cArgument>} configs
	 * @param {Lava.view.Abstract} view
	 * @param {!function} fn
	 * @returns {!Object.<string, Lava.scope.Argument>}
	 */
	_createArguments: function(configs, view, fn) {

		var result = {},
			argument;

		for (var name in configs) {

			argument = new Lava.scope.Argument(configs[name], view, this._widget);
			result[name] = argument;
			argument.on('changed', fn, this, {name: name})

		}

		return result;

	},

	_onPropertyBindingChanged: function(argument, event_args, listener_args) {

		if (this._is_inDOM) {

			// note: escape will be handled by framework
			var value = argument.getValue();

			if (value != null && value !== false) {

				if (value === true) {
					value = listener_args.name;
				}

				Firestorm.Element.setProperty(this.getDOMElement(), listener_args.name, value);

			} else {

				Firestorm.Element.removeProperty(this.getDOMElement(), listener_args.name);

			}

		}

	},

	_onStyleBindingChanged: function(argument, event_args, listener_args) {

		var value = this._style_bindings[listener_args.name].getValue() || '';
		if (this._is_inDOM) Firestorm.Element.setStyle(this.getDOMElement(), listener_args.name, value.toString().trim());

	},

	_toClassNames: function(classes_string) {

		var classes = [];

		if (Lava.schema.view.VALIDATE_CLASS_NAMES) {
			this.assertClassStringValid(classes_string);
		}

		if (classes_string != '') {

			classes = classes_string.split(/\s+/);

		}

		return classes;

	},

	_onClassBindingChanged: function(argument, event_args, listener_args) {

		var new_classes = this._toClassNames(argument.getValue().toString().trim());

		if (this._is_inDOM) {

			Firestorm.Element.removeClasses(this.getDOMElement(), this._class_bindings_values[listener_args.name]);
			Firestorm.Element.addClasses(this.getDOMElement(), new_classes);

		}

		this._class_bindings_values[listener_args.name] = new_classes;

	},

	assertStyleValid: function(value) {
		if (/\"\<\>/.test(value))
			Lava.t("Invalid symbols in style value: " + value + ". Please, use single quotes for string values and manually escape special characters.");
	},

	assertClassStringValid: function(value) {

		if (/\'\"\<\>\&\./.test(value)) Lava.t("Invalid class names: " + value);

	},

	_renderClasses: function() {

		var resultClasses = this._static_classes.clone(),
			name,
			value;

		for (name in this._class_bindings) {

			// do not need to check or convert, cause join() will convert everything to string, and nulls to empty string
			resultClasses.push(
				this._class_bindings[name].getValue()
			);

		}

		value = resultClasses.join(' ');

		if (Lava.schema.view.VALIDATE_CLASS_NAMES) {
			this.assertClassStringValid(value);
		}

		return value;

	},

	_renderStyles: function() {

		var result_styles = [],
			name,
			value;

		for (name in this._static_styles) {

			result_styles.push(name + ':' + this._static_styles[name]);

		}

		for (name in this._style_bindings) {

			value = this._style_bindings[name].getValue();
			if (value != null) {
				result_styles.push(name + ':' + value.toString().trim());
			}

		}

		value = result_styles.join(';');

		if (Lava.schema.view.VALIDATE_STYLES) {
			this.assertStyleValid(value);
		}

		return value;

	},

	_serializeAttribute: function(name, value) {

		var result = '';

		if (value === true) {

			result = ' ' + name + '="' + name + '"';

		} else if (value != null && value !== false) {

			result = ' ' + name + '="' + this.escapeAttributeValue(value + '') + '"';

		}

		return result;

	},

	wrap: function(html) {

		var classes = this._renderClasses(),
			style = this._renderStyles(),
			properties_string = '',
			name,
			result;

		// view calls this function in render(), and before that it must wake up itself and it's container
		if (Lava.schema.DEBUG && this._is_sleeping) Lava.t();

		this._element = null;

		for (name in this._static_properties) {

			properties_string += this._serializeAttribute(name, this._static_properties[name]);

		}

		for (name in this._property_bindings) {

			properties_string += this._serializeAttribute(name, this._property_bindings[name].getValue());

		}

		if (classes) {

			properties_string += ' class="' + classes + '"';

		}

		if (style) {

			properties_string += ' style="' + style + '"';

		}

		result = "<" + this._tag_name + " id=\"" + this._id + "\" "
			// + this._writeEvents()
			+ properties_string; //+ ">"

		if (this._is_void) {

			if (Lava.schema.DEBUG && html) Lava.t('Trying to wrap content in void tag');

			result += "/>";

		} else {

			result += ">" + html + "</" + this._tag_name + ">";

		}

		return result;

	},

	setHTML: function(html) {

		if (!this._is_inDOM) Lava.t("setHTML: element is not in DOM");
		if (this._is_void) Lava.t('setHTML on void tag');

		Firestorm.Element.setProperty(this.getDOMElement(), 'html', html);

	},

	appendHTML: function(html) {

		Firestorm.DOM.insertHTMLBottom(this.getDOMElement(), html);

	},

	prependHTML: function(html) {

		Firestorm.DOM.insertHTMLTop(this.getDOMElement(), html);

	},

	insertHTMLAfter: function(html) {

		Firestorm.DOM.insertHTMLAfter(this.getDOMElement(), html);

	},

	/**
	 * Note: does not need to be called after capture.
	 */
	informInDOM: function() {

		this._fixIOS();
		this.informInDOM();

	},

	informInDOM_IOS: function() {

		this.informInDOM_Original();
		this.getDOMElement().onclick = Lava.noop;

	},

	informInDOM_Original: function() {

		this._is_inDOM = true;
		if (Lava.schema.DEBUG && this._element) Lava.t();

	},

	informRemove: function() {

		this._is_inDOM = false;
		this._element = null;

	},

	getDOMElement: function() {

		if (!this._element && this._is_inDOM) {

			this._element = Firestorm.getElementById(this._id);

		}

		return this._element;

	},

	getId: function() { return this._id; },

	isInDOM: function() { return this._is_inDOM; },

	isVoid: function() { return this._is_void; },

	release: function() {

		this._element = null;

	},

	sleep: function() {

		this._withArguments('sleep');

	},

	wakeup: function() {

		this._withArguments('wakeup', true);

	},

	_withArguments: function(callback_name, callback_argument) {

		var name;

		for (name in this._property_bindings) this._property_bindings[name][callback_name](callback_argument);

		for (name in this._style_bindings) this._style_bindings[name][callback_name](callback_argument);

		for (name in this._class_bindings) this._class_bindings[name][callback_name](callback_argument);

	},

	setSignature: function(tag_name) {

		if (Lava.schema.DEBUG && tag_name != tag_name.toLowerCase()) Lava.t("Tag names must be lower case");
		if (this._is_inDOM) Lava.t("Can not change signature on elements that are in dom");
		this._tag_name = tag_name;
		this._is_void = Lava.isVoidTag(tag_name);

	},

	captureExistingElement: function(element) {

		var Element = Firestorm.Element,
			name;

		if (this._is_inDOM) Lava.t("Can not set duplicate id attribute on elements");
		if (Element.getProperty(element, 'id')) Lava.t("Target element already has an ID, and could be owned by another container");
		if (Element.getProperty(element, 'tag').toLowerCase() != this._tag_name) Lava.t("Captured tag name differs from the container's tag name");

		this.wakeup();

		Element.setProperty(element, 'id', this._id);

		this._is_inDOM = true;
		this._element = element;

		for (name in this._static_properties) {

			// note: escaping must be handled by framework
			Element.setProperty(element, name, this._static_properties[name]);

		}

		for (name in this._property_bindings) {

			Element.setProperty(element, name, this._property_bindings[name].getValue());

		}

		this.syncClasses();
		this.syncStyles();
		this._is_element_owner = false;

	},

	releaseElement: function() {

		// keep original container in DOM
		this.setHTML('');
		Firestorm.Element.removeProperty(this.getDOMElement(), 'id');
		this.informRemove();
		this._is_element_owner = true;

	},

	isElementOwner: function() {

		return this._is_element_owner;

	},

	escapeAttributeValue: function(string) {

		return Firestorm.String.escape(string, Firestorm.String.ATTRIBUTE_ESCAPE_REGEX);

	},

	remove: function() {

		if (!this._is_inDOM) Lava.t("remove: container is not in DOM");
		Firestorm.Element.destroy(this.getDOMElement());

	},

	destroy: function() {

		var name;

		for (name in this._property_bindings) {

			this._property_bindings[name].destroy();

		}

		for (name in this._style_bindings) {

			this._style_bindings[name].destroy();

		}

		for (name in this._class_bindings) {

			this._class_bindings[name].destroy();

		}

	}

});

Lava.define(
'Lava.view.container.Morph',
/**
 * @lends Lava.view.container.Morph#
 * @implements iContainer
 *
 * Credits:
 * based on https://github.com/tomhuda/metamorph.js/
 */
{

	isMorphContainer: true,

	/**
	 * @type {Lava.view.View}
	 */
	_view: null,
	_config: null,
	/**
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,

	_is_inDOM: false,
	_start_script_id: null,
	_end_script_id: null,

	_start_element: null,
	_end_element: null,

	/**
	 * @param {Lava.view.View} view
	 * @param {_cEmulatedContainer} config
	 * @param {Lava.widget.Standard} widget
	 */
	init: function(view, config, widget) {

		this._view = view;
		this._config = config;
		this._widget = widget;

		this._start_script_id = 'c' + view.guid + 's';
		this._end_script_id = 'c' + view.guid + 'e';

	},

	_getElements: function() {

		var start_element = document.getElementById(this._start_script_id),
			end_element = document.getElementById(this._end_script_id);

		/**
		 * In some cases, Internet Explorer can create an anonymous node in
		 * the hierarchy with no tagName. You can create this scenario via:
		 *
		 *     div = document.createElement("div");
		 *     div.innerHTML = "<table>&shy<script></script><tr><td>hi</td></tr></table>";
		 *     div.firstChild.firstChild.tagName //=> ""
		 *
		 * If our script markers are inside such a node, we need to find that
		 * node and use *it* as the marker.
		 **/
		while (start_element.parentNode.tagName === "") {

			start_element = start_element.parentNode;

		}

		/**
		 * When automatically adding a tbody, Internet Explorer inserts the
		 * tbody immediately before the first <tr>. Other browsers create it
		 * before the first node, no matter what.
		 *
		 * This means the the following code:
		 *
		 *     div = document.createElement("div");
		 *     div.innerHTML = "<table><script id='first'></script><tr><td>hi</td></tr><script id='last'></script></table>
		 *
		 * Generates the following DOM in IE:
		 *
		 *     + div
		 *       + table
		 *         - script id='first'
		 *         + tbody
		 *           + tr
		 *             + td
		 *               - "hi"
		 *           - script id='last'
		 *
		 * Which means that the two script tags, even though they were
		 * inserted at the same point in the hierarchy in the original
		 * HTML, now have different parents.
		 *
		 * This code reparents the first script tag by making it the tbody's
		 * first child.
		 **/
		if (start_element.parentNode !== end_element.parentNode) {

			end_element.parentNode.insertBefore(start_element, end_element.parentNode.firstChild);

		}

		this._start_element = start_element;
		this._end_element = end_element;

	},

	getStartElement: function() {

		if (this._start_element == null) {
			this._getElements();
		}

		return this._start_element;

	},

	getEndElement: function() {

		if (this._end_element == null) {
			this._getElements();
		}

		return this._end_element;

	},

	wrap: function(html) {

		this._start_element = this._end_element = null;

		/*
		 * We replace chevron by its hex code in order to prevent escaping problems.
		 * Check this thread for more explaination:
		 * http://stackoverflow.com/questions/8231048/why-use-x3c-instead-of-when-generating-html-from-javascript
		 */
		return "<script id='" + this._start_script_id + "' type='x'>\x3C/script>"
			+ html
			+ "<script id='" + this._end_script_id + "' type='x'>\x3C/script>";

	},

	setHTML: function(html) {

		if (!this._is_inDOM) Lava.t("setHTML: container is not in DOM");

		Firestorm.DOM.clearInnerRange(this.getStartElement(), this.getEndElement());
		Firestorm.DOM.insertHTMLBefore(this.getEndElement(), html);

	},

	remove: function() {

		if (!this._is_inDOM) Lava.t("remove: container is not in DOM");
		Firestorm.DOM.clearOuterRange(this.getStartElement(), this.getEndElement());

	},

	appendHTML: function(html) {

		Firestorm.DOM.insertHTMLBefore(this.getEndElement(), html);

	},

	prependHTML: function(html) {

		Firestorm.DOM.insertHTMLAfter(this.getStartElement(), html);

	},

	insertHTMLAfter: function(html) {

		Firestorm.DOM.insertHTMLAfter(this.getEndElement(), html);

	},

	informInDOM: function() { this._is_inDOM = true; },

	informRemove: function() {

		this._start_element = this._end_element = null;
		this._is_inDOM = false;

	},

	release: function() {

		this._start_element = this._end_element = null;

	},

	refresh: function() {},

	sleep: function() {},

	wakeup: function() {},

	isInDOM: function() { return this._is_inDOM; },

	getWidget: function() { return this._widget; },

	getView: function() { return this._view; },

	destroy: function() {}

});

Lava.define(
'Lava.view.container.Emulated',
/**
 * @lends Lava.view.container.Emulated#
 * @implements iContainer
 */
{

	isEmulatedContainer: true,

	Shared: ['_appenders'],

	_appenders: {
		bottom: '_appendBottom',
		'after-previous': '_appendAfterPrevious'
	},

	/**
	 * @type {Lava.view.View}
	 */
	_view: null,
	_config: null,
	/**
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,

	_is_inDOM: false,

	_placement: null,

	/**
	 * @param {Lava.view.View} view
	 * @param {_cEmulatedContainer} config
	 * @param {Lava.widget.Standard} widget
	 */
	init: function(view, config, widget) {

		this._view = view;
		this._config = config;
		this._widget = widget;

		if (('options' in config) && config.options.placement) {
			this._placement = config.options.placement;
			if (config.options.placement in this._appenders) {
				this.appendHTML = this[this._appenders[config.options.placement]];
			}
		}

	},

	wrap: function(html) { return html; },

	setHTML: function(html) {

		if (!this._is_inDOM) Lava.t("setHTML: container is not in DOM");

		Lava.t('call to setHTML() in emulated container');

	},

	remove: function() {

		if (!this._is_inDOM) Lava.t("remove: container is not in DOM");

		Lava.t('call to remove() in emulated container');

	},

	_appendBottom: function(html) {

		this._view.getParentView().getContainer().appendHTML(html);

	},

	_appendAfterPrevious: function(html) {

		this._view.getTemplate().getPreviousView(this._view).getContainer().insertHTMLAfter(html);

	},

	/**
	 * Note: this function is replaced in constructor
	 * @param {string} html
	 */
	appendHTML: function(html) {

		Lava.t("appendHTML: placement is not supported");

	},

	prependHTML: function(html) {

		Lava.t('call to prependHTML() in emulated container');

	},

	insertHTMLAfter: function(html) {

		Lava.t('call to insertHTMLAfter() in emulated container');

	},

	informInDOM: function() { this._is_inDOM = true; },

	informRemove: function() { this._is_inDOM = false; },

	refresh: function() {},

	sleep: function() {},

	wakeup: function() {},

	isInDOM: function() { return this._is_inDOM; },

	getWidget: function() { return this._widget; },

	getView: function() { return this._view; },

	release: function() {},

	destroy: function() {}

});

Lava.define(
'Lava.view.refresher.Default',
/**
 * Base class for animation support. Does not animate templates, but inserts and removes them separately.
 * @lends Lava.view.refresher.Default#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',

	Shared: '_insertion_strategies',

	// all functions are called in context of THIS class, not the shared object
	_insertion_strategies: {
		sequential_elements: '_insertSequentialElements'
	},

	_config: null,
	/**
	 * @type {Lava.view.Abstract}
	 */
	_view: null,
	_container: null,

	/**
	 * Temporary storage for templates which were removed during current refresh cycle
	 * @type {Object.<_tGUID, Lava.system.Template>}
	 */
	_removed_templates: {},

	/**
	 * @type {Object.<_tGUID, Lava.system.Template>}
	 */
	_current_templates: [],

	/**
	 * @type {Object.<_tGUID, Lava.animation.Standard>}
	 */
	_animations_by_template_guid: {},
	/**
	 * @type {Object.<_tGUID, Lava.system.Template>}
	 */
	_templates_by_animation_guid: {},

	_is_animation_enabled: false,

	/**
	 * @param {_cRefresher} config
	 * @param {Lava.view.Abstract} view
	 * @param {iContainer} container
	 */
	init: function(config, view, container) {

		this._config = config;
		this._view = view;
		this._container = container;

		if (config.insertion_strategy) {

			this._insertTemplate = this[this._insertion_strategies[config.insertion_strategy]];

		}

	},

	removeTemplates: function(templates) {

		for (var i = 0, count = templates.length; i < count; i++) {

			templates[i].broadcastSleep();
			this._removed_templates[templates[i].guid] = templates[i];

		}

	},

	/**
	 * @param current_templates Templates, that refresher must render and insert in DOM. Some of them are already there,
	 * some are in DOM but sleeping, and others are not in DOM.
	 */
	refresh: function(current_templates) {

		var i = 0,
			count = current_templates.length,
			guid;

		this._current_templates = current_templates;

		for (; i < count; i++) {

			if (!current_templates[i].isInDOM()) {

				this._insertTemplate(current_templates[i], i);
				this._fire('insertion_complete', current_templates[i]);

			} else if (current_templates[i].guid in this._removed_templates) {

				current_templates[i].broadcastWakeup();
				delete this._removed_templates[current_templates[i].guid];

			}

		}

		for (guid in this._removed_templates) {

			if (this._removed_templates[guid].isInDOM()) {

				this._removeTemplate(this._removed_templates[guid]);
				this._fire('removal_complete', this._removed_templates[guid]);

			}

		}

		this._removed_templates = {};

	},

	onRender: function(current_templates) {

		var i = 0,
			count = current_templates.length,
			guid;

		this._current_templates = current_templates;

		for (; i < count; i++) {

			delete this._removed_templates[current_templates[i].guid];

		}

		for (guid in this._removed_templates) {

			if (this._removed_templates[guid].isInDOM()) {

				this._removed_templates[guid].broadcastRemove();
				this._fire('removal_complete', this._removed_templates[guid]);

			}

		}

		this._removed_templates = {};

	},

	_animateInsertion: function(template, index) {

		var animation = this._animations_by_template_guid[template.guid];

		if (!animation) {

			if (!template.isInDOM()) {

				this._insertTemplate(template, index);
				animation = this._createAnimation(template, index);

			} else {

				template.broadcastWakeup();

			}

		}

		if (animation) {

			animation.resetDirection();
			animation.safeStart();

		}

	},

	_animateRemoval: function(template) {

		var animation = this._animations_by_template_guid[template.guid];

		if (!animation && template.isInDOM()) {

			animation = this._createAnimation(template);

		}

		if (animation) {

			animation.reverseDirection();
			animation.safeStart();

		}

	},

	_insertTemplate: function(template, index) {

		this._view.getContainer().appendHTML(template.render());
		template.broadcastInDOM();

	},

	_removeTemplate: function(template) {

		// save, cause element container will throw an error if we try to do it after broadcastRemove
		var element = template.getFirstView().getContainer().getDOMElement();
		// first, we must inform the template, that it's going to be removed: to allow it's child views to interact
		// with nodes while they are still in DOM
		template.broadcastRemove();
		Firestorm.Element.destroy(element);

	},

	_getAnimationTarget: function(template) {

		// get the only element inside the template
		return template.getFirstView().getContainer().getDOMElement();

	},

	_onAnimationComplete: function(animation) {

		var template = this._templates_by_animation_guid[animation.guid];

		if (animation.isReversed()) {

			this._onRemovalComplete(animation, template);
			this._fire('removal_complete', template);

		} else {

			this._onInsertionComplete(animation, template);
			this._fire('insertion_complete', template);

		}

		delete this._templates_by_animation_guid[animation.guid];
		delete this._animations_by_template_guid[template.guid];

	},

	_onRemovalComplete: function(animation, template) {

		this._removeTemplate(template);

	},

	_onInsertionComplete: function(animation, template) {

		// if animation was reversed, then template must be sleeping now
		if (template.isSleeping()) {
			template.broadcastWakeup();
		}

	},

	hasAnimations: function() {

		return false;

	},

	/**
	 * @param {Lava.system.Template} template
	 */
	_createAnimation: function(template) {

		Lava.t("Abstract function call: _createAnimation");

	},

	isAnimationEnabled: function() {

		return this._is_animation_enabled;

	},

	stopAnimations: function() {

	},

	/**
	 * (insertion strategy)
	 * With this callback you can insert Foreach elements at the right place.
	 * All templates inside Foreach are treated as single view with Element container.
	 * @param template
	 * @param index
	 */
	_insertSequentialElements: function(template, index) {

		if (index) {

			this._current_templates[index - 1].getFirstView().getContainer().insertHTMLAfter(template.render());

		} else {

			this._view.getContainer().prependHTML(template.render());

		}

		template.broadcastInDOM();

	},

	destroy: function() {

		this.stopAnimations();

	}

});

Lava.define(
'Lava.view.refresher.Animated',
/**
 * Base class for animation support.
 * @lends Lava.view.refresher.Animated#
 * @extends Lava.view.refresher.Default
 */
{

	Extends: 'Lava.view.refresher.Default',

	_is_animation_enabled: true,

	refresh: function(current_templates) {

		if (this.isAnimationEnabled()) {

			this._refreshAnimated(current_templates);

		} else {

			this.Default$refresh(current_templates);

		}

	},

	_refreshAnimated: function(current_templates) {

		var i = 0,
			count = current_templates.length,
			guid;

		this._current_templates = current_templates;

		for (; i < count; i++) {

			this._animateInsertion(current_templates[i], i);

			delete this._removed_templates[current_templates[i].guid];

		}

		for (guid in this._removed_templates) {

			this._animateRemoval(this._removed_templates[guid]);

		}

		this._removed_templates = {};

	},

	onRender: function(current_templates) {

		this.stopAnimations();

		this.Default$onRender(current_templates);

	},

	_onRenderAnimated: function(current_templates) {

	},

	enableAnimation: function() {

		this._is_animation_enabled = true;

	},

	disableAnimation: function() {

		this._is_animation_enabled = false;
		this.stopAnimations();

	},

	stopAnimations: function() {

		for (var guid in this._animations_by_template_guid) {

			this._animations_by_template_guid[guid].finish();

		}

		this._animations_by_template_guid = {};
		this._templates_by_animation_guid = {};

	},

	hasAnimations: function() {

		for (var name in this._animations_by_template_guid) {

			return true;

		}

		return false;

	}

});

Lava.define(
'Lava.view.refresher.Collapse',
/**
 * @lends Lava.view.refresher.Collapse#
 * @extends Lava.view.refresher.Animated
 */
{

	Extends: 'Lava.view.refresher.Animated',

	_createAnimation: function(template, index) {

		var element = this._getAnimationTarget(template),
			animation;

		animation = new Lava.animation.Collapse({}, element);
		animation.on('complete', this._onAnimationComplete, this);

		this._templates_by_animation_guid[animation.guid] = template;
		this._animations_by_template_guid[template.guid] = animation;

		return animation;

	}

});

Lava.define(
'Lava.view.Abstract',
/**
 * @lends Lava.view.Abstract#
 * @implements _iViewHierarchyMember
 * @extends Lava.mixin.Properties#
 */
{

	Extends: 'Lava.mixin.Properties',
	/** @const */
	isView: true,
	/** @readonly */
	guid: null,
	/**
	 * Do not set ID directly, use appropriate setter.
	 * @readonly
	 */
	id: null,
	/**
	 * Label is part of template config, so must be considered readonly.
	 * @readonly
	 */
	label: null,
	/**
	 * How many parents does it have
	 * @readonly
	 */
	depth: 0,

	/**
	 * @readonly
	 */
	template_index: 0,

	/**
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,

	/**
	 * @type {Lava.view.Abstract}
	 */
	_parent_view: null,

	/**
	 * Nearest parent view with it's own container.
	 * @type {Lava.view.Abstract}
	 */
	_parent_with_container: null,

	/**
	 * @type {iContainer}
	 */
	_container: null,

	/**
	 * @type {_cView}
	 */
	_config: null,

	_template: null,

	_is_inDOM: false,
	_is_sleeping: false,
	_is_dirty: false,
	_is_queued_for_refresh: false,

	/**
	 * @type {Object.<string, Lava.scope.PropertyBinding>}
	 */
	_property_bindings_by_property: {},

	/**
	 * @type {Object.<_tGUID, Lava.scope.Segment>}
	 */
	_data_segments: {},

	/**
	 * @param {_cView} config
	 * @param {Lava.widget.Standard} widget
	 * @param {Lava.view.View} parent_view
	 * @param {Object} properties
	 * @param {Lava.system.Template} template
	 */
	init: function(config, widget, parent_view, template, properties) {

		var name,
			argument,
			constructor;

		this.guid = Lava.guid++;
		this.id = config.id || null;
		this.label = config.label || null;

		Lava.view_manager.registerView(this);

		this._config = config;
		this._widget = widget;
		this._template = template;

		if (parent_view) {

			this._parent_view = parent_view;
			this._parent_with_container = parent_view.getContainer() ? parent_view : parent_view.getParentWithContainer();
			this.depth = parent_view.depth + 1;

		}

		this._initMembers(properties);

		for (name in config.assigns) {

			if (config.assigns[name].once) {

				argument = new Lava.scope.Argument(config.assigns[name], this, this._widget);
				this.set(name, argument.getValue());
				argument.destroy();

			} else {

				if (name in this._property_bindings_by_property) Lava.t("Error initializing assign: property binding already created");

				this._property_bindings_by_property[name] = new Lava.scope.PropertyBinding(this, name, this.depth, config.assigns[name]);

			}

		}

		if ('container' in config) {

			constructor = Lava.ClassManager.getConstructor(config.container['class'], 'Lava.view.container');
			this._container = new constructor(this, config.container, widget);

		}

		this._postInit();

		if ('roles' in  config) Lava.view_manager.dispatchRoles(this, config.roles);

	},

	getContainer: function() { return this._container; },

	getParentWithContainer: function() { return this._parent_with_container; },

	getParentView: function() { return this._parent_view; },

	getWidget: function() { return this._widget; },

	isInDOM: function() { return this._is_inDOM; },

	isSleeping: function() { return this._is_sleeping; },

	/**
	 * @returns {Lava.system.Template}
	 */
	getTemplate: function() { return this._template; },

	setId: function(new_id) {

		Lava.view_manager.unregisterView(this);
		this.id = new_id;
		Lava.view_manager.registerView(this);

	},

	_initMembers: function(properties) {

		for (var name in properties) {

			this.set(name, properties[name]);

		}

	},

	/**
	 * Called before registering roles.
	 */
	_postInit: function() {

	},

	/**
	 * @param {number} depth
	 * @returns {Lava.view.Abstract}
	 */
	getViewByDepth: function(depth) {

		var root = this;

		while (depth > 0) {

			root = root.getParentView();

			if (!root) Lava.t("Error evaluating depth: parent view does not exist");

			depth--;

		}

		return root;

	},

	trySetDirty: function() {

		if (this._is_inDOM) {

			if (this._container) {

				this._is_dirty = true;

				if (!this._is_queued_for_refresh) {

					Lava.view_manager.scheduleViewRefresh(this);
					this._is_queued_for_refresh = true;

				}

			} else if (this._parent_with_container) {

				this._parent_with_container.trySetDirty();

			}

		}

	},

	/**
	 * @param {string} function_name
	 */
	_broadcastToChildren: function(function_name) {

		// must be overridden in child classes (in those, that have children)

	},

	broadcastInDOM: function() {

		this._is_inDOM = true;
		this._is_dirty = false;
		this._container && this._container.informInDOM();

		this._broadcastToChildren('broadcastInDOM');

	},

	broadcastRemove: function() {

		if (this._is_inDOM) {

			if (!this._is_sleeping) this._sleep();

			this._is_inDOM = false;
			this._is_dirty = false;
			this._container && this._container.informRemove();

			this._broadcastToChildren('broadcastRemove');

		}

	},

	broadcastSleep: function() {

		if (Lava.schema.DEBUG && !this._is_inDOM) Lava.t();

		if (!this._is_sleeping) {

			this._sleep();
			this._broadcastToChildren('broadcastSleep');

		}

	},

	_sleep: function() {

		this._is_sleeping = true;
		this._container && this._container.sleep();

	},

	broadcastWakeup: function() {

		if (Lava.schema.DEBUG && !this._is_inDOM) Lava.t();

		if (this._is_sleeping) {

			this._wakeup();
			this._broadcastToChildren('broadcastWakeup');

		}

	},

	_wakeup: function() {

		this._is_sleeping = false;
		this._container && this._container.wakeup();

		if (this._is_dirty && !this._is_queued_for_refresh) {

			Lava.view_manager.scheduleViewRefresh(this);
			this._is_queued_for_refresh = true;

		}

	},

	_renderContents: function() {

		Lava.t("_renderContents must be overridden in inherited classes");

	},

	render: function() {

		if (this._is_sleeping) this._wakeup();

		var buffer = this._renderContents(),
			result;

		if (this._container) {

			result = this._container.wrap(buffer);

		} else {

			result = buffer;

		}

		return result;

	},

	/**
	 * 'soft' refresh - only if needed
	 */
	refresh: function() {

		if (Lava.schema.DEBUG && !this._container) Lava.t("Refresh on a view without container");

		this._is_queued_for_refresh = false;

		if (this._is_inDOM && !this._is_sleeping) {

			if (this._is_dirty) {

				this._refresh();
				this._is_dirty = false;

			}

		}

	},

	_refresh: function() {

		this._container.setHTML(this._renderContents());
		this._broadcastToChildren('broadcastInDOM');

	},

	/**
	 * @param {string} label
	 * @returns {Lava.view.Abstract}
	 */
	locateViewByLabel: function(label) {

		if (Lava.schema.DEBUG && !label) Lava.t();

		var result = this;

		if (label == 'root') {

			result = this._widget;

			while (result.getParentWidget()) {

				result = result.getParentWidget();

			}

		} else if (label == 'parent') {

			result = this._parent_view;

		} else if (label == 'widget') {

			result = this._widget;

		} else if (label != 'this') {

			while (result && result.label != label) {

				result = result.getParentView();

			}

		}

		return result;

	},

	/**
	 * Actually, returns a widget.
	 *
	 * @param {string} name
	 * @returns {Lava.widget.Standard}
	 */
	locateViewByName: function(name) {

		if (Lava.schema.DEBUG && !name) Lava.t();

		var result = this._widget;

		while (result && result.name != name) {

			result = result.getParentWidget();

		}

		return result;

	},

	/**
	 * @param id
	 * @returns {Lava.view.Abstract}
	 */
	locateViewById: function(id) {

		if (Lava.schema.DEBUG && !id) Lava.t();

		return Lava.view_manager.getViewById(id);

	},

	/**
	 * @param guid
	 * @returns {Lava.view.Abstract}
	 */
	locateViewByGuid: function(guid) {

		if (Lava.schema.DEBUG && !guid) Lava.t();

		return Lava.view_manager.getViewByGuid(guid);

	},

	/**
	 * @param {_cScopeLocator|_cKnownViewLocator} path_config
	 * @returns {Lava.view.Abstract}
	 */
	locateViewByPathConfig: function(path_config) {

		var result = this['locateViewBy' + path_config.locator_type](path_config.locator);

		if (Lava.schema.DEBUG && !result) Lava.t("View not found. " + path_config.locator_type + ':' + path_config.locator);

		if ('depth' in path_config) {

			result = result.getViewByDepth(path_config.depth);

		}

		return result;

	},

	locateViewWithProperty: function(name) {

		var view = this;

		while (view && !view.isset(name)) {

			view = view.getParentView();

		}

		return view;

	},

	/**
	 * @param {_cScopeLocator} path_config
	 * @returns {_iValueContainer}
	 */
	getScopeByPathConfig: function(path_config) {

		var view,
			i = 0,
			count,
			result,
			tail = path_config.tail;

		if ('property_name' in path_config) {

			view = ('locator_type' in path_config) ? this.locateViewByPathConfig(path_config) : this;

			view = view.locateViewWithProperty(path_config.property_name);

			if (Lava.schema.DEBUG && !view) Lava.t("Property not found: " + path_config.property_name);

			result = view.getDataBinding(path_config.property_name);

		} else {

			if (Lava.schema.DEBUG && !('locator_type' in path_config)) Lava.t("Malformed scope path (1)");
			if (Lava.schema.DEBUG && !tail) Lava.t("Malformed scope path (2)");

			result = this.locateViewByPathConfig(path_config);

			if (Lava.schema.DEBUG && !result) Lava.t("View not found. "
				+ path_config.locator_type + ": " + path_config.locator + ", depth:" + path_config.depth);

		}

		if (tail) {

			for (count = tail.length; i < count; i++) {

				result = (typeof(tail[i]) == 'object')
					? result.getSegment(this.getScopeByPathConfig(tail[i]))
					: result.getDataBinding(tail[i]);

			}

		}

		return result;

	},

	/**
	 * @param {_cScopeLocator} path_config
	 * @returns {*}
	 */
	evalPathConfig: function(path_config) {

		var view,
			i = 0,
			count,
			result,
			tail = path_config.tail,
			property_name;

		if ('property_name' in path_config) {

			view = ('locator_type' in path_config) ? this.locateViewByPathConfig(path_config) : this;

			view = view.locateViewWithProperty(path_config.property_name);

			result = view.get(path_config.property_name);

		} else {

			if (Lava.schema.DEBUG && !('locator_type' in path_config)) Lava.t("Malformed scope path (1)");
			if (Lava.schema.DEBUG && !tail) Lava.t("Malformed scope path (2)");

			result = this.locateViewByPathConfig(path_config);

			if (Lava.schema.DEBUG && !result) Lava.t("View not found. "
				+ path_config.locator_type + ": " + path_config.locator + ", depth:" + path_config.depth);

		}

		if (tail) {

			for (count = tail.length; i < count; i++) {

				property_name = (typeof(tail[i]) == 'object') ? this.evalPathConfig(tail[i]) : tail[i];

				if (result.isEnumerable && /^\d+$/.test(property_name)) {

					result = result.getValueAt(+property_name);

				} else if (result.isProperties) {

					result = result.get(property_name);

				} else {

					result = result[property_name];

				}

				if (!result) {

					break;

				}

			}

		}

		return result;

	},

	/**
	 * @param {string} property_name
	 * @returns {Lava.scope.PropertyBinding}
	 */
	getDataBinding: function(property_name) {

		if (!(property_name in this._property_bindings_by_property)) {

			this._property_bindings_by_property[property_name] = new Lava.scope.PropertyBinding(this, property_name, this.depth);

		}

		return this._property_bindings_by_property[property_name];

	},

	/**
	 * @param {(Lava.scope.PropertyBinding|Lava.scope.DataBinding)} name_source_scope
	 * @returns {Lava.scope.Segment}
	 */
	getSegment: function(name_source_scope) {

		if (Lava.schema.DEBUG && !name_source_scope.guid) Lava.t("Only PropertyBinding and DataBinding may be used as name source for segments");

		if (!(name_source_scope.guid in this._data_segments)) {

			this._data_segments[name_source_scope.guid] = new Lava.scope.Segment(this, name_source_scope, this.depth);

		}

		return this._data_segments[name_source_scope.guid];

	},

	destroy: function() {

		var name;

		this._fire('destroy');

		Lava.view_manager.unregisterView(this);

		if (this._container) this._container.destroy();

		for (name in this._property_bindings_by_property) {

			this._property_bindings_by_property[name].destroy();

		}

		for (name in this._data_segments) {

			this._data_segments[name].destroy();

		}

		this._is_sleeping = true; // to prevent refresh

	}

});

Lava.define(
'Lava.view.View',
/**
 * @lends Lava.view.View#
 * @extends Lava.view.Abstract#
 * @implements _iViewHierarchyMember
 */
{

	Extends: 'Lava.view.Abstract',

	/**
	 * @type {Lava.system.Template}
	 */
	_contents: null,

	_postInit: function() {

		if (
			Lava.schema.DEBUG
			&& (('argument' in this._config) || ('else_template' in this._config) || ('elseif_arguments' in this._config))
		) {
			Lava.t("Standard View does not support arguments and elseif/else blocks");
		}

	},

	render: function() {

		if (this._is_sleeping) this._wakeup();

		var result;

		if (this._container) {

			// This is the only view, that can have void element containers.
			// Check is done to speed up the rendering process.
			result = (this._container.isElementContainer && this._container.isVoid())
				? this._container.wrap()
				: this._container.wrap(this._renderContents());

		} else {

			result = this._renderContents();

		}

		return result;

	},

	_refresh: function() {

		if (!this._container.isVoid()) {
			this._container.setHTML(this._renderContents());
			this._broadcastToChildren('broadcastInDOM');
		}

	},

	_renderContents: function() {

		return this._getContents().render();

	},

	/**
	 * @param {string} function_name
	 */
	_broadcastToChildren: function(function_name) {

		if (this._contents != null) {

			this._contents[function_name]();

		}

	},

	_getContents: function() {

		if (this._contents == null) {

			this._contents = new Lava.system.Template(this._config.template || [], this._widget, this)

		}

		return this._contents;

	},

	destroy: function() {

		if (this._contents) {
			this._contents.destroy();
			this._contents = null;
		}

		this.Abstract$destroy();

	}

});

Lava.define(
'Lava.view.Expression',
/**
 * @lends Lava.view.Expression#
 * @extends Lava.view.Abstract
 * @extends Lava.view.Abstract
 * @implements _iViewHierarchyMember
 */
{

	Extends: 'Lava.view.Abstract',
	/**
	 * @type {Lava.scope.Argument}
	 */
	_argument: null,
	_argument_changed_listener: null,

	_escape: true,

	_postInit: function() {

		if (Lava.schema.DEBUG && !('argument' in this._config)) Lava.t("Expression view requires an argument");
		this._escape = !this._config.escape_off;
		this._argument = new Lava.scope.Argument(this._config.argument, this, this._widget);
		this._argument_changed_listener = this._argument.on('changed', this._onValueChanged, this);

	},

	_onValueChanged: function() {

		this.trySetDirty();

	},

	_renderContents: function() {

		if (Lava.schema.DEBUG && this._argument.isWaitingRefresh()) Lava.t();

		var result = '',
			new_value = this._argument.getValue();

		if (new_value != null && typeof(new_value) != 'undefined') {

			result = this._escape
				? this.escapeArgumentValue(new_value.toString())
				: new_value.toString();

		}

		return result;

	},

	_sleep: function() {

		this._argument.sleep();
		Lava.suspendListener(this._argument_changed_listener);

		this.Abstract$_sleep();

	},

	_wakeup: function() {

		Lava.resumeListener(this._argument_changed_listener);
		this._argument.wakeup(true);

		this.Abstract$_wakeup();

	},

	escapeArgumentValue: function(string) {

		return Firestorm.String.escape(string, Firestorm.String.HTML_ESCAPE_REGEX);

	},

	destroy: function() {

		this._argument.destroy();
		this._argument = null;

		this.Abstract$destroy();

	}

});

Lava.define(
'Lava.view.Foreach',
/**
 * @lends Lava.view.Foreach#
 * @extends Lava.view.Abstract
 * @implements _iViewHierarchyMember
 */
{

	Extends: 'Lava.view.Abstract',

	/**
	 * @type {Lava.scope.Argument}
	 */
	_argument: null,
	_foreach_scope: null,
	_foreach_scope_changed_listener: null,

	// = _current_uids.length
	_current_count: 0,
	// [index] => uid
	_current_uids: [],
	/**
	 * [guid] => template
	 * @type {Object.<string, _tRenderable>}
	 */
	_current_hash: {},

	_current_templates: [],

	/**
	 * The name of variable, holding the concrete record in child views
	 * @type {string}
	 */
	_as: null,

	/**
	 * @type {(Lava.view.refresher.Default)}
	 */
	_refresher: null,

	_properties: {
		count: 0
	},

	_postInit: function() {

		if (this._config.refresher) {

			if (Lava.schema.DEBUG && !this._container) Lava.t('View/Foreach: refresher needs container to work');
			var constructor = Lava.ClassManager.getConstructor(this._config.refresher['class'], 'Lava.view.refresher');
			this._refresher = /** @type {Lava.refresher.Default} */ new constructor(
				this._config.refresher,
				this,
				this._container
			);

			this._refresher.on('removal_complete', this._onRemovalComplete, this);

		}

		this._refreshChildren();

	},

	getRefresher: function() {

		return this._refresher;

	},

	_initMembers: function(properties) {

		if (Lava.schema.DEBUG && !('argument' in this._config)) Lava.t("Foreach view requires an argument");
		if (Lava.schema.DEBUG && !this._config.as) Lava.t("Foreach view requires 'as' hash parameter");
		if (Lava.schema.DEBUG && !this._config.template) Lava.t("Foreach view must not be empty");

		this.Abstract$_initMembers(properties);

		this._argument = new Lava.scope.Argument(this._config.argument, this, this._widget);
		this._foreach_scope = new Lava.scope.Foreach(this._argument, this, this._widget, this._config.options ? this._config.options.scope : null);
		this._foreach_scope_changed_listener = this._foreach_scope.on('changed', this._onDataSourceChanged, this);
		this._foreach_scope.on('new_enumerable', this._onEnumerableChanged, this);
		this._as = this._config.as;
		// set the count before the view's container is created, cause if it depends on count
		// - it will be dirty right after creation
		this.set('count', this._foreach_scope.getValue().getCount());

	},

	/**
	 * Scope hac created a new instance of Enumerable.
	 * Now all UIDs belong to the old enumerable, so must get rid of all templates.
	 */
	_onEnumerableChanged: function() {

		var i = 0,
			removed_templates = [];

		for (; i < this._current_count; i++) {

			removed_templates.push(this._current_hash[this._current_uids[i]]);

		}

		removed_templates.length && this._removeTemplates(removed_templates);

		this._current_count = 0;
		this._current_hash = {};
		this._current_uids = [];
		this._current_templates = [];

	},

	_removeTemplates: function(removed_templates) {

		var i = 0,
			removed_count;

		if (this._refresher) {

			this._refresher.removeTemplates(removed_templates);

		} else {

			for (i = 0, removed_count = removed_templates.length; i < removed_count; i++) {

				removed_templates[i].destroy();

			}

		}

	},

	_refreshChildren: function() {

		var data_source = this._foreach_scope.getValue(),
			new_uids = data_source.getUIDs(),
			new_uid_to_index_map = data_source.getUIDToIndexMap(),
			count = data_source.getCount(),
			i = 0,
			uid,
			template,
			removed_templates = [],
			child_properties,
			current_templates = [];

		for (; i < this._current_count; i++) {

			uid = this._current_uids[i];

			if (!(uid in new_uid_to_index_map)) {

				removed_templates.push(this._current_hash[uid]);
				delete this._current_hash[uid];

			}

		}

		this.set('count', count);

		for (i = 0; i < count; i++) {

			uid = new_uids[i];

			child_properties = {
				foreach_index: i,
				foreach_name: data_source.getNameAt(new_uid_to_index_map[uid])
			};
			child_properties[this._as] = data_source.getValueAt(new_uid_to_index_map[uid]);

			if (uid in this._current_hash) {

				template = this._current_hash[uid];
				template.batchSetProperties(child_properties);

			} else {

				template = new Lava.system.Template(this._config.template, this._widget, this, child_properties);
				this._current_hash[uid] = template;

			}

			current_templates.push(template);

		}

		removed_templates.length && this._removeTemplates(removed_templates);

		this._current_count = count;
		this._current_uids = new_uids;
		this._current_templates = current_templates;

	},

	_onDataSourceChanged: function() {

		this._refreshChildren();
		this.trySetDirty();

	},

	_onRemovalComplete: function(template) {

		template.destroy();

	},

	_renderContents: function() {

		if (Lava.schema.DEBUG && (this._argument.isWaitingRefresh() || this._foreach_scope.isWaitingRefresh())) Lava.t();

		this._refresher && this._refresher.onRender(this._current_templates);

		var buffer = '',
			i = 0;

		for (; i < this._current_count; i++) {

			buffer += this._current_templates[i].render();

		}

		return buffer;

	},

	_refresh: function() {

		if (this._refresher) {

			this._refresher.refresh(this._current_templates);

		} else {

			this._container.setHTML(this._renderContents());
			this._broadcastToChildren('broadcastInDOM');

		}

	},

	/**
	 * @param {string} function_name
	 */
	_broadcastToChildren: function(function_name) {

		for (var name in this._current_hash) {

			this._current_hash[name][function_name]();

		}

	},

	_sleep: function() {

		Lava.suspendListener(this._foreach_scope_changed_listener);
		this._foreach_scope.sleep();
		this._argument.sleep();

		this.Abstract$_sleep();

	},

	_wakeup: function() {

		this._argument.wakeup();
		this._foreach_scope.wakeup();
		Lava.resumeListener(this._foreach_scope_changed_listener);

		this._refreshChildren();

		this.Abstract$_wakeup();

	},

	destroy: function() {

		var name;

		this._refresher && this._refresher.destroy();

		for (name in this._current_hash) {

			this._current_hash[name].destroy();

		}

		this._foreach_scope.destroy();
		this._argument.destroy();

		this.Abstract$destroy();

		// to speed up garbage collection and break this object forever (destroyed objects must not be used!)
		this._refresher = this._current_templates = this._current_hash = this._foreach_scope = this._argument = null;

	}

});

Lava.define(
'Lava.view.If',
/**
 * @lends Lava.view.If#
 * @extends Lava.view.Abstract
 * @implements _iViewHierarchyMember
 */
{

	Extends: 'Lava.view.Abstract',

	/**
	 * @type {Array.<Lava.scope.Argument>}
	 */
	_arguments: [],
	_argument_changed_listeners: [],
	_count_arguments: 0,
	_active_argument_index: null,
	/**
	 * @type {Array.<_tRenderable>}
	 */
	_contents: [],
	/**
	 * @type {_tRenderable}
	 */
	_else_contents: null,

	/**
	 * @type {(Lava.view.refresher.Default)}
	 */
	_refresher: null,
	_active_template: null,

	_postInit: function() {

		if (Lava.schema.DEBUG && !('argument' in this._config)) Lava.t("If view requires an argument");

		var i = 0,
			count,
			constructor,
			argument = new Lava.scope.Argument(this._config.argument, this, this._widget);

		this._argument_changed_listeners.push(argument.on('changed', this._onArgumentChanged, this));
		this._arguments.push(argument);

		if ('elseif_arguments' in this._config) {

			for (count = this._config.elseif_arguments.length; i < count; i++) {

				argument = new Lava.scope.Argument(this._config.elseif_arguments[i], this, this._widget);
				this._argument_changed_listeners.push(argument.on('changed', this._onArgumentChanged, this));
				this._arguments.push(argument);

			}

		}

		this._count_arguments = this._arguments.length;
		this._active_argument_index = this._getActiveArgumentIndex();

		if (this._config.refresher) {

			// otherwise, it will not be able to insert the template
			if (Lava.schema.DEBUG && !this._container) Lava.t('View/If: refresher needs container to work');
			constructor = Lava.ClassManager.getConstructor(this._config.refresher['class'], 'Lava.view.refresher');
			this._refresher = /** @type {Lava.refresher.Default} */ new constructor(
				this._config.refresher,
				this, this._container
			);

		}

		this._active_template = this._getActiveTemplate();

	},

	getRefresher: function() {

		return this._refresher;

	},

	_getActiveArgumentIndex: function() {

		var i = 0,
			active_argument_index = null;

		for (; i < this._count_arguments; i++) {

			if (!!this._arguments[i].getValue()) {
				active_argument_index = i;
				break;
			}

		}

		return active_argument_index;

	},

	_getActiveTemplate: function() {

		var result = null;

		if (this._active_argument_index != null) {

			this._createContents(this._active_argument_index);

			result = this._contents[this._active_argument_index];

		} else if ('else_template' in this._config) {

			this._createElseContents();

			result = this._else_contents;

		}

		return result;

	},

	_onArgumentChanged: function() {

		var active_argument_index = this._getActiveArgumentIndex();

		if (this._active_argument_index != active_argument_index) {

			this._active_argument_index = active_argument_index;

			if (this._active_template && this._is_inDOM) {

				if (this._refresher) {

					this._refresher.removeTemplates([this._active_template]);

				} else {

					this._active_template.broadcastRemove();

				}

			}

			this._active_template = this._getActiveTemplate();

			this.trySetDirty();

		}

	},

	_renderContents: function() {

		if (Lava.schema.DEBUG && this._active_argument_index != null && this._arguments[this._active_argument_index].isWaitingRefresh()) Lava.t();

		this._refresher && this._refresher.onRender(this._active_template ? [this._active_template] : []);
		return this._active_template ? this._active_template.render() : '';

	},

	/**
	 * @param {string} function_name
	 */
	_broadcastToChildren: function(function_name) {

		if (this._active_template) {

			this._active_template[function_name]();

		}

	},

	_sleep: function() {

		var i = 0,
			count;

		for (i = 0, count = this._arguments.length; i < count; i++) {

			this._arguments[i].sleep();

		}

		for (i = 0, count = this._argument_changed_listeners.length; i < count; i++) {

			Lava.suspendListener(this._argument_changed_listeners[i]);

		}

		this.Abstract$_sleep();

	},

	_wakeup: function() {

		for (i = 0, count = this._arguments.length; i < count; i++) {

			this._arguments[i].wakeup();

		}

		for (var i = 0, count = this._argument_changed_listeners.length; i < count; i++) {

			Lava.resumeListener(this._argument_changed_listeners[i]);

		}

		this._onArgumentChanged();

		this.Abstract$_wakeup();

	},

	_createContents: function(index) {

		if (typeof(this._contents[index]) == 'undefined') {

			this._contents[index] = (index == 0)
				? new Lava.system.Template(this._config.template || [], this._widget, this)
				: new Lava.system.Template(this._config.elseif_templates[index - 1] || [], this._widget, this);

			this._contents[index].batchSetProperty('if_index', index);

		}

	},

	_createElseContents: function() {

		if (this._else_contents == null) {

			this._else_contents = new Lava.system.Template(this._config.else_template || [], this._widget, this);

		}

	},

	_refresh: function() {

		if (this._refresher) {

			this._refresher.refresh(this._active_template ? [this._active_template] : []);

		} else {

			this._container.setHTML(this._renderContents());
			this._broadcastToChildren('broadcastInDOM');

		}

	},

	destroy: function() {

		var i = 0;

		this._refresher && this._refresher.destroy();

		for (; i < this._count_arguments; i++) {

			this._arguments[i].destroy();
			this._contents[i] && this._contents[i].destroy();

		}

		this._else_contents && this._else_contents.destroy();

		// to speed up garbage collection and break this object forever (destroyed objects must not be used!)
		this._refresher = this._contents = this._else_contents = this._arguments = this._active_template
			= this._argument_changed_listeners = null;

		this.Abstract$destroy();

	}

});

Lava.define(
'Lava.widget.Standard',
/**
 * @lends Lava.widget.Standard#
 * @extends Lava.view.View#
 * @implements _iViewHierarchyMember
 */
{

	Extends: 'Lava.view.View',
	Shared: ['_property_descriptors', '_event_handlers', '_role_handlers', '_include_handlers', '_broadcast_handlers', '_modifiers'],

	isWidget: true,
	/** @readonly */
	name: null,

	/** @type {Object.<string, _cPropertyDescriptor>} */
	_property_descriptors: {},

	_acquired_events: [],
	_event_handlers: {},

	_role_handlers: {},
	_include_handlers: {},

	_broadcast_handlers: {},

	_bindings: {},
	_resources: {},

	_parent_widget: null,

	/**
	 * Called in context of the widget.
	 * modifier_name => class_method_name
	 */
	_modifiers: {
		translate: 'translate',
		ntranslate: 'ntranslate'
	},

	/**
	 * @param {_cWidget} config
	 * @param {Lava.widget.Standard} widget
	 * @param {Lava.view.View} parent_view
	 * @param {Object} properties
	 * @param {Lava.system.Template} template
	 */
	init: function(config, widget, parent_view, template, properties) {

		var name;

		if (Lava.schema.DEBUG && !config.is_extended) Lava.t("Widget was created with partial (unextended) config");

		if (Lava.schema.DEBUG) {
			for (name in this._property_descriptors) {
				if (!(name in this._properties)) Lava.t("All widget properties must have a default value");
			}
		}

		this._parent_widget = widget;

		this.View$init(config, this, parent_view, template, properties);

		for (name in config.bindings) {

			this._bindings[name] = new Lava.scope.Binding(config.bindings[name], this);

		}

		if ('broadcast' in config) {

			Lava.view_manager.dispatchBroadcast(this, config.broadcast);

		}

	},

	_initMembers: function(properties) {

		this.View$_initMembers(properties);

		for (var name in this._config.properties) {

			this.set(name, this._config.properties[name]);

		}

		if (Lava.schema.RESOURCES_ENABLED) {

			this._initResources(this._config);

		}

	},

	/**
	 * @param {_cWidget} config
	 */
	_initResources: function(config) {

		var locale = Lava.schema.LOCALE,
			resource_owner,
			component_resource,
			resources;

		if ('resources_cache' in config) {

			resources = config.resources_cache[locale];

		}

		if ('resource_id' in config) {

			resource_owner = this['locateViewBy' + config.resource_id.locator_type](config.resource_id.locator);
			if (Lava.schema.DEBUG && (!resource_owner || !resource_owner.isWidget))
				Lava.t("Resource root not found: " + config.resource_id.locator_type + '=' + config.resource_id.locator);
			component_resource = resource_owner.getResource(config.resource_id.name, Lava.schema.LOCALE);

			if (component_resource) {

				if (Lava.schema.DEBUG && component_resource.type != 'component') Lava.t("resource value is not a component");

				resources = resources
					? Lava.resources.mergeResources(component_resource.value, resources, true)
					: component_resource.value;

			}

		}

		if (resources) {
			this._resources[locale] = resources;
			Lava.resources.mergeRootContainerStacks(resources);
		}

	},

	/**
	 * @param {string} name
	 * @param {Array} template_arguments
	 * @returns {_tTemplate}
	 */
	getInclude: function(name, template_arguments) {

		var result = null;

		if (name in this._include_handlers) {

			result = this[this._include_handlers[name]](template_arguments);

		} else {

			result = this._config.includes[name];

		}

		return result;

	},

	/**
	 * @param {string} dom_event_name
	 * @param dom_event
	 * @param {string} target_name
	 * @param {Lava.view.Abstract} view
	 * @param {Array.<*>} template_arguments
	 * @returns {boolean}
	 */
	handleEvent: function(dom_event_name, dom_event, target_name, view, template_arguments) {

		var result = false;

		if (target_name in this._event_handlers) {

			//try {

				this[this._event_handlers[target_name]](dom_event_name, dom_event, view, template_arguments);

			//} catch (e) {

			//	Lava.logException(e);

			//}

			result = true;

		}

		return result;

	},

	broadcastInDOM: function() {

		this.View$broadcastInDOM();
		this._acquireDefaultEvents();

	},

	broadcastRemove: function() {

		this.View$broadcastRemove();
		this._releaseAllEvents();

	},

	inject: function(element, position) {

		if (this._is_inDOM) Lava.t("inject: widget is already in DOM");
		if (Lava.schema.DEBUG && this._parent_view) Lava.t("Widget: only top-level widgets can be inserted into DOM");
		if (Lava.schema.DEBUG && !this._container) Lava.t("Widget: root widgets must have a container");

		var html = this.render();

		Firestorm.DOM.insertHTML(element, html, position);
		this.broadcastInDOM();

		Lava.scheduleRefresh(); // see comment for scheduleRefresh

	},

	/**
	 * The target element becomes container for this widget.
	 * Primary usage: inject a widget into the BODY element.
	 * @param element
	 */
	injectIntoExistingElement: function(element) {

		if (this._is_inDOM) Lava.t("inject: widget is already in DOM");
		if (Lava.schema.DEBUG && this._parent_view) Lava.t("Widget: only top-level widgets can be inserted into DOM");
		if (Lava.schema.DEBUG && !this._container) Lava.t("Widget: root widgets must have a container");
		if (Lava.schema.DEBUG && !this._container.isElementContainer) Lava.t("injectIntoExistingElement expects an element containers");

		this._container.captureExistingElement(element);
		this._container.setHTML(this._renderContents());

		// rewritten broadcastInDOM - without this._container.informInDOM()
		this._is_inDOM = true;
		this._is_dirty = false;
		this._broadcastToChildren('broadcastInDOM');
		this._acquireDefaultEvents();

	},

	_acquireDefaultEvents: function() {

		var i = 0,
			count;

		if (this._config.default_events) {
			count = this._config.default_events.length;
			for (; i < count; i++) {

				this._lendEvent(this._config.default_events[i]);

			}
		}

	},

	_lendEvent: function(event_name) {

		if (Firestorm.Array.include(this._acquired_events, event_name)) {

			Lava.view_manager.lendEvent(event_name);

		}

	},

	_releaseEvent: function(event_name) {

		if (Firestorm.Array.exclude(this._acquired_events, event_name)) {

			Lava.view_manager.releaseEvent(event_name);

		}

	},

	_releaseAllEvents: function() {

		var i = 0,
			count = this._acquired_events.length;

		for (; i < count; i++) {

			Lava.view_manager.releaseEvent(this._acquired_events[i]);

		}

		this._acquired_events = [];

	},

	remove: function() {

		if (!this._is_inDOM) Lava.t("remove: widget is not in DOM");
		if (Lava.schema.DEBUG && !this._container) Lava.t("remove: widget doesn't have a container");

		this._releaseAllEvents();
		if (!this._is_sleeping) this._sleep();
		this._is_inDOM = false;
		this._is_dirty = false;
		this._broadcastToChildren('broadcastRemove');

		if (this._container.isElementContainer && !this._container.isElementOwner()) {

			this._container.releaseElement();

		} else {

			this._container.remove()

		}

	},

	/**
	 * @param {string} name
	 * @param {Array} arguments_array
	 * @returns {*}
	 */
	callModifier: function(name, arguments_array) {

		if (Lava.schema.DEBUG && !(name in this._modifiers)) Lava.t("Unknown widget modifier: " + name);

		return this[this._modifiers[name]].apply(this, arguments_array);

	},

	/**
	 * @param {string} name
	 * @param {Array} arguments_array
	 * @returns {*}
	 */
	callActiveModifier: function(name, arguments_array) {

		Lava.t("Alpha version. This functionality may be removed later.");

	},

	/**
	 * @returns {Lava.widget.Standard}
	 */
	getParentWidget: function() {

		return this._parent_widget;

	},

	/**
	 * @param {string} role
	 * @param {Lava.view.View} view
	 * @param {Array.<*>} template_arguments
	 * @returns {boolean}
	 */
	handleRole: function(role, view, template_arguments) {

		var result = false;

		if (role in this._role_handlers) {

			this[this._role_handlers[role]](view, template_arguments);
			result = true;

		}

		return result;

	},

	set: function(name, value) {

		var descriptor;

		if (name in this._property_descriptors) {

			descriptor = this._property_descriptors[name];

			if (Lava.schema.DEBUG && descriptor.is_readonly) Lava.t("Trying to set readonly property: " + name);

			if (Lava.schema.widget.VALIDATE_PROPERTY_TYPES) {

				if (value === null) {

					if (!descriptor.is_nullable) Lava.t("Trying to assign NULL to non-nullable property");

				} else if (descriptor.type && !Lava.types[descriptor.type].isValidValue(value, descriptor)) {

					Lava.t("Assigned value does not match the property type: " + descriptor.type);

				}

			}

			if (descriptor.setter) {

				// It's forced to make setters private, cause type-checking will not work if setter is called directly.
				if (Lava.schema.DEBUG && descriptor.setter[0] != '_') Lava.t("Widget property setters must not be public: " + descriptor.setter);

				//try { // additional protection from crash for the scope system
				//	this[descriptor.setter](name, value);
				//} catch (e) {
				//	Lava.logException(e);
				//}

				this[descriptor.setter](name, value);

			} else {

				this.View$set(name, value);

			}

		} else {

			this.View$set(name, value);

		}

	},

	get: function(name) {

		return ((name in this._property_descriptors) && this._property_descriptors[name].getter)
			? this[this._property_descriptors[name].getter](name)
			: this.View$get(name);

	},

	/**
	 * @param {Lava.widget.Standard} widget
	 * @param {string} event_name
	 * @param {string} handler_name
	 * @param {?Array.<*>} template_arguments
	 */
	registerBroadcastTarget: function(widget, event_name, handler_name, template_arguments) {

		widget.on(
			event_name,
			this[this._broadcast_handlers[handler_name]],
			this,
			{
				event_name: event_name,
				template_arguments: template_arguments
			}
		);

	},

	/**
	 * Fire the received event. For usage with broadcast events from inner widgets.
	 *
	 * @param widget
	 * @param event_args
	 * @param listener_args
	 */
	_broadcastEvent: function(widget, event_args, listener_args) {

		this._fire(listener_args.event_name);

	},

	getPackageConstructor: function(path) {

		return Lava.ClassManager.getPackageConstructor(this.Class.path, path);

	},

	getResource: function(resource_name, locale) {

		locale = locale || Lava.schema.LOCALE;

		return ((locale in this._resources) && (resource_name in this._resources[locale]))
			? this._resources[locale][resource_name]
			: null;

	},

	getDynamicScope: function(view, config) {

		Lava.t('Not implemented: getDynamicScope');

	},

	/**
	 * (modifier)
	 * @param {string} resource_name
	 * @param {Array} arguments_list
	 * @param {string} locale
	 * @returns {string}
	 */
	translate: function(resource_name, arguments_list, locale) {

		var string_descriptor = /** @type {_cTranslatableString} */ this.getResource(resource_name, locale || Lava.schema.LOCALE),
			result;

		if (string_descriptor) {

			if (Lava.schema.DEBUG && string_descriptor.type != 'translate') Lava.t("[translate] resource is not a string: " + resource_name);

			if (arguments_list) {

				result = string_descriptor.value.replace(/\{(\d+)\}/g, function(dummy, index) {
					return arguments_list[index] || '';
				});

			} else {

				result = string_descriptor.value;

			}

		} else {

			result = '';
			Lava.logError("Resource string not found: " + resource_name);

		}

		return result;

	},

	/**
	 * (modifier)
	 * @param {string} string_name
	 * @param {number} n
	 * @param {Array} arguments_list
	 * @param {string} locale
	 * @returns {string}
	 */
	ntranslate: function(string_name, n, arguments_list, locale) {

		var string_descriptor = /** @type {_cTranslatablePlural} */ this.getResource(string_name, locale || Lava.schema.LOCALE),
			form_index = Lava.locales[Lava.schema.LOCALE].pluralize(n),
			pluralform,
			result;

		if (string_descriptor) {

			if (Lava.schema.DEBUG && string_descriptor.type != 'ntranslate') Lava.t("[ntranslate] resource is not a string: " + string_name);
			pluralform = string_descriptor.value[form_index];
			if (Lava.schema.DEBUG && pluralform == null) Lava.t("[ntranslate] requested plural string is missing one of it's plural forms:" + string_name);

			if (arguments_list) {

				result = pluralform.replace(/\{(\d+)\}/g, function(dummy, index) {
					return arguments_list[index] || '';
				});

			} else {

				result = pluralform;

			}

		} else {

			result = '';
			Lava.logError("Resource string not found: " + string_name);

		}

		return result;

	},

	destroy: function() {

		var name,
			i,
			count;

		this._releaseAllEvents();

		for (name in this._bindings) {

			this._bindings[name].destroy();

		}

		this._bindings = this._resources = null;

		this.View$destroy();

	}

});

Lava.define(
'Lava.widget.input.Abstract',
/**
 * @lends Lava.widget.input.Abstract#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',

	/**
	 * @type {Object.<string, _cPropertyDescriptor>}
	 */
	_property_descriptors: {
		name: {type: 'String', is_nullable: true},
		value: {type: 'String', is_nullable: true},
		is_disabled: {type: 'Boolean'},
		is_required: {type: 'Boolean'},
		is_readonly: {type: 'Boolean'},
		is_valid: {type: 'Boolean', is_readonly: true}
	},

	_properties: {
		name: null,
		value: null,
		is_disabled: false,
		is_required: false,
		is_readonly: false,
		is_valid: true
	},

	_event_handlers: {
		_focused: '_onInputFocused',
		_blurred: '_onInputBlurred'
	},

	_role_handlers: {
		_input_view: '_handleInputView'
	},

	_type: null,
	_input_container: null,

	init: function(config, widget, parent_view, template, properties) {

		this.Standard$init(config, widget, parent_view, template, properties);
		Lava.view_manager.dispatchRoles(this, [{name: 'form_field'}]);

	},

	_handleInputView: function(view, template_arguments) {

		this._input_container = view.getContainer();

		// type may be null in textarea
		if (!this._input_container.getProperty('type') && this._type) {
			this._input_container.storeProperty('type', this._type);
		}

		Lava.view_manager.cancelBubble();

	},

	getMainContainer: function() {

		return this._input_container;

	},

	_onInputFocused: function() {

		this._fire('focused');

	},

	_onInputBlurred: function() {

		this._fire('blurred');

	},

	destroy: function() {
		this._input_container = null;
		this.Standard$destroy();
	},

	toQueryString: function() {

		return (this._properties.name && !this._properties.is_disabled && this._properties.value != null)
			? encodeURIComponent(this._properties.name) + '=' + encodeURIComponent(this._properties.value)
			: '';

	}

});

Lava.define(
'Lava.widget.input.TextAbstract',
/**
 * @lends Lava.widget.input.TextAbstract#
 * @extends Lava.widget.input.Abstract#
 */
{

	Extends: 'Lava.widget.input.Abstract',

	_property_descriptors: {
		value: {type: 'String', setter: '_setValue'}
	},

	_properties: {
		value: ''
	},

	_event_handlers: {
		value_changed: '_refreshValue',
		input: '_onTextInput'
	},

	_refresh_on_input: true,

	init: function(config, widget, parent_view, template, properties) {

		this.Abstract$init(config, widget, parent_view, template, properties);

		if (config.options && config.options['cancel_refresh_on_input']) {
			this._refresh_on_input = false;
		}

	},

	_setValue: function(name, value) {

		if (this._properties.value != value) {

			this._set('value', value);
			if (this._input_container) {
				this._input_container.setProperty('value', this._valueToAttributeString(value));
			}

		}

	},

	_valueToAttributeString: function(value) {

		return value;

	},

	_refreshValue: function() {

		var value = this._input_container.getDOMElement().value;

		if (this._properties.value != value) {

			this._set('value', value);
			this._input_container.storeProperty('value', this._properties.value);

		}

	},

	_onTextInput: function() {

		if (this._refresh_on_input) {
			this._refreshValue();
		}

	}

});

Lava.define(
'Lava.widget.input.TextArea',
/**
 * @lends Lava.widget.input.TextArea#
 * @extends Lava.widget.input.TextAbstract#
 */
{

	Extends: 'Lava.widget.input.TextAbstract',

	name: 'textarea',

	_renderContents: function() {

		return Firestorm.String.escape(this._properties.value, Firestorm.String.TEXTAREA_ESCAPE_REGEX);

	}

});

Lava.define(
'Lava.widget.input.Text',
/**
 * @lends Lava.widget.input.Text#
 * @extends Lava.widget.input.TextAbstract#
 */
{

	Extends: 'Lava.widget.input.TextAbstract',

	name: 'text_input',

	_type: "text",

	_handleInputView: function(view, template_arguments) {

		this.TextAbstract$_handleInputView(view, template_arguments);
		this._input_container.storeProperty('value', this._properties.value);

	}

});

Lava.define(
'Lava.widget.input.RadioAbstract',
/**
 * @lends Lava.widget.input.RadioAbstract#
 * @extends Lava.widget.input.Abstract#
 */
{

	Extends: 'Lava.widget.input.Abstract',

	_property_descriptors: {
		is_checked: {type: 'Boolean', setter: '_setIsChecked'}
	},

	_properties: {
		is_checked: false
	},

	_event_handlers: {
		checked_changed: '_onCheckedChanged'
	},

	_handleInputView: function(view, template_arguments) {

		this.Abstract$_handleInputView(view, template_arguments);
		this._input_container.storeProperty('checked', this._properties.is_checked ? 'checked' : null);

	},

	_setIsChecked: function(name, value) {

		if (this._properties.is_checked != value) {

			this._set('is_checked', value);
			if (this._input_container) {
				this._input_container.setProperty('checked', this._properties.is_checked ? 'checked' : null);
			}

		}

	},

	_onCheckedChanged: function() {

		this.set('is_checked', this._input_container.getDOMElement().checked);
		this._fire('checked_changed');

	},

	toQueryString: function() {

		return this._properties.is_checked ? this.RadioAbstract$toQueryString() : '';

	}

});

Lava.define(
'Lava.widget.input.CheckBox',
/**
 * @lends Lava.widget.input.CheckBox#
 * @extends Lava.widget.input.RadioAbstract#
 */
{

	Extends: 'Lava.widget.input.RadioAbstract',

	name: 'checkbox',

	_property_descriptors: {
		is_indeterminate: {type: 'Boolean', setter: '_setIsIndeterminate'}
	},

	_properties: {
		is_indeterminate: false
	},

	_type: "checkbox",

	_refreshIndeterminate: function() {

		if (this._input_container && this._input_container.getDOMElement()) {
			this._input_container.getDOMElement().indeterminate = this._properties.is_indeterminate;
		}

	},

	broadcastInDOM: function() {

		this.RadioAbstract$broadcastInDOM();
		this._refreshIndeterminate();

	},

	_refresh: function() {

		this.RadioAbstract$_refresh();
		this._refreshIndeterminate();

	},

	_setIsChecked: function(name, value) {

		this.RadioAbstract$_setIsChecked(name, value);
		this._setIsIndeterminate('is_indeterminate', false);

	},

	_setIsIndeterminate: function(name, value) {

		if (this._properties.is_indeterminate != value) {
			this._set('is_indeterminate', value);
		}
		this._refreshIndeterminate(); // outside of condition: do not trust the browser and set anyway

	},

	_onCheckedChanged: function() {

		this.RadioAbstract$_onCheckedChanged();
		this.set('is_indeterminate', false);

	}

});

Lava.define(
'Lava.widget.input.Radio',
/**
 * @lends Lava.widget.input.Radio#
 * @extends Lava.widget.input.RadioAbstract#
 */
{

	Extends: 'Lava.widget.input.RadioAbstract',

	name: 'radio',

	_property_descriptors: {
		is_checked: {type: 'Boolean', setter: '_setIsChecked'}
	},

	_properties: {
		is_checked: false
	},

	_event_handlers: {
		checked_changed: '_onCheckedChanged'
	},

	_type: "radio",

	broadcastInDOM: function() {

		this.RadioAbstract$broadcastInDOM();

		if (this._input_container) {
			// There may be situation, when several radios with same name are rendered as checked.
			// Only the last one of them will stay checked, others will be turned off by the browser.
			this.set('is_checked', this._input_container.getDOMElement().checked);
		}

	}

});

Lava.define(
'Lava.widget.input.Submit',
/**
 * @lends Lava.widget.input.Submit#
 * @extends Lava.widget.input.Abstract#
 */
{

	Extends: 'Lava.widget.input.Abstract',

	name: 'submit',

	_event_handlers: {
		clicked: '_onClicked'
	},

	_type: "submit",

	_onClicked: function(dom_event_name, dom_event, view, template_arguments) {

		this._fire('clicked');
		dom_event.preventDefault();

	}

});

Lava.define(
'Lava.widget.input.SelectAbstract',
/**
 * @lends Lava.widget.input.SelectAbstract#
 * @extends Lava.widget.input.Abstract#
 */
{

	Extends: 'Lava.widget.input.Abstract',

	name: 'select',

	_properties: {
		// optgroup tag is created only for those groups that have a title
		optgroups: null
	},

	_event_handlers: {
		value_changed: '_onValueChanged'
	},

	_modifiers: {
		isValueSelected: 'isValueSelected'
	},

	broadcastInDOM: function() {

		this.Abstract$broadcastInDOM();
		this._refreshValue();

	},

	_onValueChanged: function(dom_event_name, dom_event, view, template_arguments) {

		this._refreshValue();

	},

	_refresh: function() {

		// to synchronize the selected value after setting options and optgroups property
		this.Abstract$_refresh();
		this._refreshValue();

	},

	_refreshValue: function() {

		Lava.t('Abstract function call: _refreshValue');

	}

});

Lava.define(
'Lava.widget.input.Select',
/**
 * @lends Lava.widget.input.Select#
 * @extends Lava.widget.input.SelectAbstract#
 */
{

	Extends: 'Lava.widget.input.SelectAbstract',

	_property_descriptors: {
		value: {type: 'String', setter: '_setValue'}
	},

	_refreshValue: function() {

		var element = this._input_container.getDOMElement();
		// https://mootools.lighthouseapp.com/projects/2706/tickets/578-elementgetselected-behaves-differently-between-ffie-safari
		element.selectedIndex;
		this.set('value', element.value);

	},

	_setValue: function(name, value) {

		var element;
		if (this._properties.value != value) {

			if (this._input_container) {
				element = this._input_container.getDOMElement();
				element.value = value;
				if (value != element.value) { // workaround for nonexistent values
					Lava.logError("[Select] nonexistent value assigned: " + value);
					value = element.value;
				}
			}

			this._set('value', value);

		}

	},

	/**
	 * as control does not need live bindings of 'selected' property, this modifier is used to speed up rendering.
	 * @param value
	 * @returns {boolean}
	 */
	isValueSelected: function(value) {
		return value == this._properties.value;
	}

});

Lava.define(
'Lava.widget.input.MultipleSelect',
/**
 * @lends Lava.widget.input.MultipleSelect#
 * @extends Lava.widget.input.SelectAbstract#
 */
{

	Extends: 'Lava.widget.input.SelectAbstract',

	name: 'select',

	_property_descriptors: {
		value: {type: 'Array', setter: '_setValue'}
	},

	_properties: {
		value: []
	},

	_handleInputView: function(view, template_arguments) {

		this.SelectAbstract$_handleInputView(view, template_arguments);
		this._input_container.storeProperty('multiple', true);

	},

	_refreshValue: function() {

		var element = this._input_container.getDOMElement(),
			options = element.selectedOptions || element.options,
			result = [],
			i = 0,
			count = options.length,
			option_value,
			differs = false;

		for (; i < count; i++) {
			if (options[i].selected) {
				option_value = options[i].value || options[i].text;
				result.push(option_value);
				if (this._properties.value.indexOf(option_value) == -1) {
					differs = true;
				}
			}
		}

		if (differs || this._properties.value.length != result.length) {

			this._set('value', result);

		}

	},

	_setValue: function(name, value) {

		var element,
			options,
			count,
			i = 0,
			option_value;

		if (this._input_container) {

			element = this._input_container.getDOMElement();
			options = element.options;
			count = options.length;
			for (; i < count; i++) {
				option_value = options[i].value || options[i].text;
				options[i].selected = (value.indexOf(option_value) != -1);
			}

		}

		this._set('value', value);

	},

	/**
	 * as control does not need live bindings of 'selected' property, this modifier is used to speed up rendering.
	 * @param value
	 * @returns {boolean}
	 */
	isValueSelected: function(value) {

		return this._properties.value.indexOf(value) != -1;

	},

	toQueryString: function() {

		var result = [],
			name = this._properties.name,
			values = this._properties.value,
			i = 0,
			count = values.length;

		if (this._properties.name && !this._properties.is_disabled) {
			for (; i < count; i++) {
				result.push(
					encodeURIComponent(name) + '=' + encodeURIComponent(values[i])
				);
			}
		}

		return result.join('&');

	}

});

Lava.define(
'Lava.widget.input.Numeric',
/**
 * @lends Lava.widget.input.Numeric#
 * @extends Lava.widget.input.Text#
 */
{

	Extends: 'Lava.widget.input.Text',

	_property_descriptors: {
		value: {type: 'Number', setter: '_setValue'},
		input_value: {type: 'String', is_readonly: true}
	},

	_properties: {
		value: 0,
		input_value: ''
	},

	_type: "number",
	_data_type: 'Number',

	init: function(config, widget, parent_view, template, properties) {

		this.Text$init(config, widget, parent_view, template, properties);

		if (config.options) {

			if (config.options['type']) {

				if (config.options['type'] != 'text') Lava.t('Numeric input: the only recognized "type" option value in "text"');
				this._type = config.options['type'];

			}

			if (config.options['data_type']) {

				this._data_type = config.options['data_type'];

			}

		}

	},

	_valueToAttributeString: function(value) {

		return value + '';

	},

	_refreshValue: function() {

		var value = this._input_container.getDOMElement().value,
			is_valid = Lava.types[this._data_type].isValidString(value);

		if (this._properties.input_value != value) { // to bypass readonly check

			this._set('input_value', value);

		}

		if (is_valid) {

			if (this._properties.value != value) {

				this._set('value', value);
				this._input_container.storeProperty('value', value);

			}

			this._setValidity(true);

		}

		this._setValidity(is_valid);

	},

	_setValue: function(name, value) {

		this.Text$_setValue(name, value);
		this._setValidity(true);

	},

	_setValidity: function(value) {

		if (this._properties.is_valid != value) {
			this._set('is_valid', value);
		}

	}

});

Lava.define(
'Lava.widget.FieldGroup',
/**
 * @lends Lava.widget.FieldGroup#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',

	name: 'field_group',

	_role_handlers: {
		form_field: '_handleFieldRole',
		form_group: '_handleGroupRole'
	},

	_event_handlers: {
		form_submit: '_onSubmit'
	},

	/**
	 * @type {Array.<Lava.widget.input.Abstract>}
	 */
	_fields: [],
	/**
	 * @type {Array.<Lava.widget.FieldGroup>}
	 */
	_groups: [],
	/**
	 * @type {Array.<Lava.widget.input.Submit>}
	 */
	_submit_fields: [],

	_handleGroupRole: function(formgroup_widget, template_arguments) {

		this._groups.push(formgroup_widget);

	},

	_handleFieldRole: function(field_widget, template_arguments) {

		if (field_widget.name == 'submit') {

			this._submit_fields.push(field_widget);
			field_widget.on('clicked', this._onSubmit, this);
			field_widget.on('destroy', this._onFieldDestroyed, this, this._submit_fields);

		} else {

			this._fields.push(field_widget);
			field_widget.on('destroy', this._onFieldDestroyed, this, this._fields);

		}

		Lava.view_manager.cancelBubble();

	},

	_onSubmit: function() {



	},

	getFields: function() {

		return this._fields.slice();

	},

	getSubmitFields: function() {

		return this._fields.slice();

	},

	toQueryString: function() {

		var i = 0,
			count = this._fields.length,
			result = [],
			value;

		for (; i < count; i++) {

			value = this._fields[i].toQueryString();
			if (value) {
				result.push(value);
			}

		}

		return result.join('&');

	},

	_onFieldDestroyed: function(field_widget, event_args, native_args) {

		Firestorm.Array.exclude(native_args, field_widget);

	}

});

Lava.define(
'Lava.widget.Accordion',
/**
 * @lends Lava.widget.Accordion#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',

	name: 'accordion',

	_property_descriptors: {
		is_enabled: {type: 'Boolean', setter: '_setIsEnabled'}
	},

	_properties: {
		/** @type {Lava.system.Enumerable} */
		_panels: null,
		is_enabled: true
	},

	_role_handlers: {
		panel: '_handlePanelRole'
	},

	_include_handlers: {
		panel_include: '_getPanelInclude'
	},

	_panels: null,
	_panel_widgets: [],
	_active_panels: [],
	_listeners_by_panel_guid: {},

	init: function(config, widget, parent_view, template, properties) {

		this._panels = new Lava.system.Enumerable();
		this._properties._panels = this._panels;
		this.Standard$init(config, widget, parent_view, template, properties);

	},

	_initMembers: function(properties) {

		var data,
			i,
			count;

		this.Standard$_initMembers(properties);

		if (this._config.storage && this._config.storage.panels) {

			data = this._config.storage.panels.value;
			for (i = 0, count = data.length; i < count; i++) {

				this.addPanel({
					is_expanded: data[i].is_expanded || false,
					title_template: data[i].title,
					content_template: data[i].content
				});

			}

		}

	},

	addPanel: function(properties) {

		var panel = new Lava.mixin.Properties({
			is_expanded: false,
			title_template: null,
			content_template: null
		});
		panel.setProperties(properties);
		this._panels.push(panel);
		return panel;

	},

	getPanels: function() {

		return this._panels.getValues();

	},

	getPanelWidgets: function() {

		return this._panel_widgets.slice();

	},

	_getPanelInclude: function(template_arguments) {

		return template_arguments[0].get(template_arguments[1]);

	},

	_handlePanelRole: function(view, template_arguments) {

		this.registerPanel(view);

	},

	registerPanel: function(panel_widget) {

		var collapse_on_add = !this._config.options || !this._config.options['keep_expanded_on_add'];

		if (panel_widget.get('is_expanded')) {

			if (this._active_panels.length && collapse_on_add && this._properties.is_enabled) {

				panel_widget.set('is_expanded', false);

			} else {

				this._active_panels.push(panel_widget);

			}

		}

		this._panel_widgets.push(panel_widget);

		this._listeners_by_panel_guid[panel_widget.guid] = {
			// note: if panel is outside of the widget, this listener may never fire
			destroy: panel_widget.on('destroy', this._onPanelDestroy, this, null, true),
			expanding: panel_widget.on('expanding', this._onPanelExpanding, this),
			collapsing: panel_widget.on('collapsing', this._onPanelCollapsing, this)
		};

	},

	_removePanel: function(panel_widget) {

		Firestorm.Array.exclude(this._panel_widgets, panel_widget);
		Firestorm.Array.exclude(this._active_panels, panel_widget);
		delete this._listeners_by_panel_guid[panel_widget.guid];

	},

	unregisterPanel: function(panel_widget) {

		var listeners = this._listeners_by_panel_guid[panel_widget.guid];
		if (listeners) {
			panel_widget.removeListener(listeners.destroy);
			panel_widget.removeListener(listeners.expanding);
			panel_widget.removeListener(listeners.collapsing);
			this._removePanel(panel_widget);
		}

	},

	_onPanelExpanding: function(panel) {

		var turnoff_panels,
			i = 0,
			count;

		if (this._properties.is_enabled) {

			turnoff_panels = this._active_panels.slice();
			for (i = 0, count = turnoff_panels.length; i < count; i++) {

				turnoff_panels[i].set('is_expanded', false);

			}

			this._active_panels = [panel];

		} else {

			this._active_panels.push(panel);

		}

		this._fire('panel_expanding');

	},

	_onPanelCollapsing: function(panel) {

		Firestorm.Array.exclude(this._active_panels, panel);
		this._fire('panel_collapsing');

	},

	_setIsEnabled: function(name, value) {

		var turnoff_panels = [],
			i = 0,
			last_index;

		if (this._properties.is_enabled != value) {

			if (value) {

				if (this._active_panels.length > 1) {

					last_index = this._active_panels.length - 1;
					// slice is needed for the listeners
					turnoff_panels = this._active_panels.slice(0, last_index);
					for (; i < last_index; i++) {
						turnoff_panels[i].set('is_expanded', false);
					}
					// keep expanded only the last opened panel
					this._active_panels = [this._active_panels[last_index]];

				}

			}

			this._set(name, value);

		}

	},

	_onPanelDestroy: function(panel) {

		this._removePanel(panel);

	},

	removeNativePanels: function() {

		this._panels.removeAll();

	},

	removeAllPanels: function() {

		var panel_widgets = this._panel_widgets.clone(); // cause array will be modified during unregisterPanel()

		for (var i = 0, count = panel_widgets.length; i < count; i++) {

			this.unregisterPanel(panel_widgets[i]);

		}

		this._panels.removeAll();

	},

	removePanel: function(panel) {

		this._panels.removeValue(panel); // everything else will be done by destroy listener

	},

	destroy: function() {

		this.removeAllPanels();

		this._panels.destroy();
		this._panels = this._properties._panels = null;

		this.Standard$destroy();

	}

});

Lava.define(
'Lava.widget.Tabs',
/**
 * @lends Lava.widget.Tabs#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',

	name: 'tabs',

	_properties: {
		/** @type {Lava.system.Enumerable} */
		_tabs: null,
		_active_tab: null
	},

	_event_handlers: {
		header_click: '_onTabHeaderClicked'
	},

	_include_handlers: {
		tab_include: '_getTabInclude'
	},

	_tabs: null,

	init: function(config, widget, parent_view, template, properties) {

		this._tabs = new Lava.system.Enumerable();
		this._properties._tabs = this._tabs;

		this.Standard$init(config, widget, parent_view, template, properties);

	},

	_initMembers: function(properties) {

		var sugar_tabs,
			i,
			count;

		this.Standard$_initMembers(properties);

		if (this._config.storage && this._config.storage.tabs) {

			sugar_tabs = this._config.storage.tabs.value;
			i = 0;
			count = sugar_tabs.length;

			for (; i < count; i++) {

				this.addTab(sugar_tabs[i]);

			}

		}

	},

	_onTabHeaderClicked: function(dom_event_name, dom_event, view, template_arguments) {

		var tab = template_arguments[0];
		if (tab.get('is_enabled')) {
			this.set('_active_tab', tab);
		}
		dom_event.preventDefault();

	},

	/**
	 * @param {Object} properties
	 * @param {string} properties.name
	 * @param {boolean} properties.is_enabled
	 * @param {boolean} properties.is_hidden
	 * @param {_tTemplate} properties.content_template Read only
	 * @param {_tTemplate} properties.title_template Read only
	 */
	addTab: function(properties) {

		var tab = new Lava.mixin.Properties({
			guid: Lava.guid++,
			name: '',
			is_enabled: true,
			is_hidden: false,
			title_template: null,
			content_template: null
		});
		tab.setProperties(properties);
		tab.onPropertyChanged('is_enabled', this._onTabStateChanged, this);
		tab.onPropertyChanged('is_hidden', this._onTabStateChanged, this);

		if (this._properties._active_tab == null && tab.get('is_enabled') && !tab.get('is_hidden')) {

			this._set('_active_tab', tab);

		}

		this._tabs.push(tab);
		return tab;

	},

	_onTabStateChanged: function(tab) {

		if (!tab.get('is_enabled') || tab.get('is_hidden')) {

			this._fixActiveTab();

		}

	},

	getTabs: function() {

		return this._tabs.getValues();

	},

	removeTab: function(tab) {

		this._tabs.removeValue(tab);

		if (this._properties._active_tab == tab) {

			this._fixActiveTab();

		}

	},

	/**
	 * Find first tab, that can be active and assign it as the current active tab
	 */
	_fixActiveTab: function() {

		var active_tab = null;

		this._tabs.each(function(tab) {
			if (tab.get('is_enabled') && !tab.get('is_hidden')) {
				active_tab = tab;
				return false;
			}
		});

		this.set('_active_tab', active_tab);

	},

	_getTabInclude: function(template_arguments) {

		return template_arguments[0].get(template_arguments[1]);

	},

	removeAllTabs: function() {

		var tabs = this._tabs.getValues(),
			i = 0,
			count = tabs.length;

		for (; i < count; i++) {
			this.removeTab(tabs[i]);
		}

		this.set('_active_tab', null);

	},

	setActiveTab: function(tab) {

		this.set('_active_tab', tab);

	},

	reorderTabs: function(indices) {

		this._tabs.reorder(indices);

	},

	sortTabs: function(callback) {

		this._tabs.sort(callback);

	},

	destroy: function() {

		this.removeAllTabs();
		this._tabs.destroy();
		this._tabs = this._properties._tabs = null;

		this.Standard$destroy();

	}

});

Lava.define(
'Lava.widget.Collapsible',
/**
 * @lends Lava.widget.Collapsible#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',

	name: 'collapsible',

	_property_descriptors: {
		is_expanded: {type: 'Boolean', setter: '_setExpanded'},
		is_animation_enabled: {type: 'Boolean'}
	},

	_properties: {
		is_expanded: true,
		is_animation_enabled: true,
		content: ''
	},

	_role_handlers: {
		_container_view: '_handleContainerView'
	},

	_panel_container: null,
	_animation: null,
	_default_display: null,

	TOGGLE_ANIMATION_CLASS: 'Toggle',

	_refreshAnimation: function(is_forwards) {

		var element = this._panel_container.getDOMElement(),
			animation_options;

		if (!this._animation) {

			animation_options = this._properties.is_animation_enabled ? this._config.options.animation : {class: this.TOGGLE_ANIMATION_CLASS};
			this._animation = new Lava.animation[animation_options['class']](animation_options, element);
			this._animation.on('complete', this._onAnimationComplete, this);

		}

		// content may be re-rendered and the old element reference may become obsolete
		this._animation.setTarget(element);

		if (is_forwards) {

			this._animation.resetDirection();

		} else {

			this._animation.reverseDirection();

		}

		this._animation.safeStart();

	},

	_onAnimationComplete: function() {

		if (this._animation.isReversed()) {

			this._fire('collapsed');
			this._panel_container.setStyle('display', 'none');

		} else {

			this._fire('expanded');

		}

	},

	_setExpanded: function(name, value) {

		var new_display = 'none';

		if (this._properties.is_expanded != value) {

			this._set(name, value);

			if ((this._is_inDOM && this._properties.is_animation_enabled) || value) {

				new_display = this._default_display; // allow display:none only in case the panel must be collapsed and animation is disabled

			}

			// if this property is set in constructor - than container does not yet exist
			if (this._panel_container) {

				this._panel_container.setStyle('display', new_display);

			}

			if (this._is_inDOM) {

				this._fire(value ? 'expanding' : 'collapsing');

				if (this._properties.is_animation_enabled && this._panel_container) {

					this._refreshAnimation(value);

				} else {

					this._fire(value ? 'expanded' : 'collapsed');

				}

			}

		}

	},

	_handleContainerView: function(view, template_arguments) {

		this._panel_container = view.getContainer();

		this._default_display = this._panel_container.getStyle('display') || null;

		if (!this._properties.is_expanded) {

			this._panel_container.setStyle('display', 'none');

		}

	},

	getMainContainer: function() {

		return this._panel_container;

	}

});

Lava.define(
'Lava.widget.CollapsiblePanel',
/**
 * @lends Lava.widget.CollapsiblePanel#
 * @extends Lava.widget.Collapsible#
 */
{

	Extends: 'Lava.widget.Collapsible',

	name: 'collapsible_panel',

	_property_descriptors: {
		is_locked: {type: 'Boolean'}
	},

	_properties: {
		is_locked: false,
		title: ''
	},

	_event_handlers: {
		header_click: '_onHeaderClick'
	},

	_onHeaderClick: function() {

		if (!this._properties.is_locked) {

			this.set('is_expanded', !this._properties.is_expanded);

		}

	}

});

Lava.define(
'Lava.widget.CollapsiblePanelExt',
/**
 * A panel that removes it's content from DOM in collapsed state.
 * @lends Lava.widget.CollapsiblePanelExt#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',

	name: 'collapsible_panel',

	_property_descriptors: {
		is_expanded: {type: 'Boolean'},
		is_locked: {type: 'Boolean'},
		is_animation_enabled: {type: 'Boolean', setter: '_setAnimationEnabled'}
	},

	_properties: {
		is_expanded: true,
		is_locked: false,
		is_animation_enabled: true,
		title: '',
		content: ''
	},

	_event_handlers: {
		header_click: '_onHeaderClick'
	},

	_role_handlers: {
		_content_if: '_handleContentIf'
	},

	_content_refresher: null,

	_handleContentIf: function(view, template_arguments) {

		var refresher = view.getRefresher();

		refresher.on('insertion_complete', this._onInsertionComplete, this);
		refresher.on('removal_complete', this._onRemovalComplete, this);

		if (!this._properties.is_animation_enabled) {
			refresher.disableAnimation();
		}

		this._content_refresher = refresher;

	},

	_onInsertionComplete: function() {

		this._fire('expanded');

	},

	_onRemovalComplete: function() {

		this._fire('collapsed');

	},

	_onHeaderClick: function() {

		if (!this._properties.is_locked) {

			this.set('is_expanded', !this._properties.is_expanded);

			// previous line has switched it's value, so events are also swapped
			this._fire(this._properties.is_expanded ? 'expanding' : 'collapsing');

		}

	},

	_setAnimationEnabled: function(name, value) {

		if (this._properties.is_animation_enabled != value) {

			this._set(name, value);

			// it may be set via assign or right after creation. At this time refresher does not exist yet.
			if (this._content_refresher) {

				if (value) {

					this._content_refresher.enableAnimation();

				} else {

					this._content_refresher.disableAnimation();

				}

			}

		}

	}

});

Lava.define(
'Lava.widget.DropDown',
/**
 * @lends Lava.widget.DropDown#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',

	name: 'dropdown',

	_property_descriptors: {
		is_open: {type: 'Boolean', setter: '_setIsOpen'}
	},

	_properties: {
		is_open: false
	},

	_event_handlers: {
		trigger_click: '_onTriggerClick'
	},

	_role_handlers: {
		trigger: '_registerTrigger', // the link which toggles the dropdown
		target: '_registerTarget' // the target to which the class 'open' is applied
	},

	_is_focused: false,

	_trigger: null,
	_target: null,

	_click_listener: null,

	init: function(config, widget, parent_view, template, properties) {

		this.Standard$init(config, widget, parent_view, template, properties);
		Lava.app.on('close_popups', this._onClosePopups, this);

	},

	_onClosePopups: function() {

		this.set('is_open', false);

	},

	_onTriggerClick: function(dom_event_name, dom_event, view, template_arguments) {

		if (this._properties._is_open) {

			this.set('is_open', false);

		} else {

			Lava.app.fireGlobalEvent('close_popups');
			if (!this._click_listener) {
				this._click_listener = Lava.Core.addGlobalHandler('click', this._onGlobalClick, this);
			}

			this.set('is_open', true);

		}

		dom_event.preventDefault();

	},

	_onGlobalClick: function() {

		Lava.Core.removeGlobalHandler(this._click_listener);
		this._click_listener = null;
		this.set('is_open', false);

	},

	_getTargetContainer: function() {

		return this._target && this._target.getContainer() || this._container;

	},

	_registerTrigger: function(view, template_arguments) {

		this._trigger = view;
		view.getContainer().addEventTarget('click', {locator_type: "Guid", locator: this.guid, name: "trigger_click"});

	},

	_registerTarget: function(view, template_arguments) {

		this._target = view;

	},

	_setIsOpen: function(name, value) {

		var open_target_container = this._getTargetContainer();
		if (Lava.schema.DEBUG && !open_target_container) Lava.t("DropDown was created without container and target");

		if (this._properties.is_expanded != value) {

			this._set(name, value);

			if (value) {

				open_target_container.addClass(this._config.options.target_class);

			} else {

				open_target_container.removeClass(this._config.options.target_class);

			}

		}

	},

	destroy: function() {

		if (this._click_listener) {
			Lava.Core.removeGlobalHandler(this._click_listener);
			this._click_listener = null;
		}

		this._trigger = this._target = null;

		this.Standard$destroy();

	}

});

Lava.define(
'Lava.widget.Tree',
/**
 * @lends Lava.widget.Tree#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',
	Shared: '_shared',

	name: 'tree',

	_shared: {
		meta_storage_config: {
			fields: {
				'is_expanded': {type:'Boolean'}
			}
		},
		is_expanded_meta_storage_bind_config: Lava.ExpressionParser.parseScopeEval('$tree.meta_storage[node.guid].is_expanded'),
		is_expanded_direct_bind_config: Lava.ExpressionParser.parseScopeEval('node.is_expanded')
	},

	_properties: {
		records: null
	},

	_event_handlers: {
		node_click: '_onNodeClick'
	},

	_meta_storage: null,
	_is_expanded_bind_config: null,

	init: function(config, widget, parent_view, template, properties) {

		this.Standard$init(config, widget, parent_view, template, properties);

		this._is_expanded_bind_config = this._shared.is_expanded_direct_bind_config;
		if (config.options && config.options.use_meta_storage) {
			this._meta_storage = new Lava.data.MetaStorage(this._shared.meta_storage_config);
			this.set('meta_storage', this._meta_storage);
			this._is_expanded_bind_config = this._shared.is_expanded_meta_storage_bind_config;
		}

	},

	_onNodeClick: function(dom_event_name, dom_event, view, template_arguments) {

		var property_source = this._meta_storage ? this._meta_storage.get(template_arguments[0].guid) : template_arguments[0];
		property_source.set('is_expanded', !property_source.get('is_expanded'));
		dom_event.preventDefault(); // to prevent text selection

	},

	_toggleTree: function(node, expanded_state) {

		var children = node.get('children'),
			child,
			i = 0,
			count = children.getCount(),
			property_source;

		if (count) {

			for (; i < count; i++) {
				child = children.getValueAt(i);
				if (child.get('children').getCount()) {
					this._toggleTree(child, expanded_state);
				}
			}

			property_source = this._meta_storage ? this._meta_storage.get(node.guid) : node;
			property_source.set('is_expanded', expanded_state);

		}

	},

	_toggleRecords: function(expanded_state) {

		var records = this._properties.records,
			i = 0,
			count,
			record;

		if (records) {
			count = records.getCount(); // Enumerable
			for (; i < count; i++) {
				record = records.getValueAt(i);
				this._toggleTree(record, expanded_state);
			}
		}

	},

	expandAll: function() {

		this._toggleRecords(true);

	},

	collapseAll: function() {

		this._toggleRecords(false);

	},

	/**
	 * @param {Lava.view.Abstract} view
	 * @param {_cDynamicScope} config
	 */
	getDynamicScope: function(view, config) {

		if (config.property_name != 'is_expanded') Lava.t('unknown dynamic scope: ' + config.property_name);
		return view.getScopeByPathConfig(this._is_expanded_bind_config);

	},

	destroy: function() {

		if (this._meta_storage) {
			this._meta_storage.destroy();
			this._meta_storage = null;
		}

		this.Standard$destroy();

	}

});
Lava.define(
'Lava.widget.Table',
/**
 * @lends Lava.widget.Table#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',
	name: 'table',

	_properties: {
		records: null,
		_columns: null,
		_sort_column_name: null,
		_sort_descending: false
	},

	_event_handlers: {
		column_header_click: '_onColumnHeaderClick'
	},

	_include_handlers: {
		cell: '_getCellInclude'
	},

	init: function(config, widget, parent_view, template, properties) {

		if (Lava.schema.DEBUG && (!config.options || !config.options.columns)) Lava.t("Table: config.options.columns is required");
		this._properties._columns = config.options.columns;
		this.Standard$init(config, widget, parent_view, template, properties);

	},

	_onColumnHeaderClick: function(dom_event_name, dom_event, view, template_arguments) {

		var column_name = template_arguments[0].name,
			less;

		if (this._properties._sort_column_name != column_name) {

			this.set('_sort_column_name', column_name);
			this.set('_sort_descending', false);

		} else {

			this.set('_sort_descending', !this._properties._sort_descending);

		}

		less = this._properties._sort_descending
			? function(record_a, record_b) { return record_a.get(column_name) > record_b.get(column_name); }
			: function(record_a, record_b) { return record_a.get(column_name) < record_b.get(column_name); };

		if (this._properties.records) {
			this._properties.records.sort(less);
		}

	},

	_getCellInclude: function(template_arguments) {

		// var column = template_arguments[0];
		return this._config.storage.cells.value[template_arguments[0].type];

	}

});

Lava.define(
'Lava.widget.CalendarAbstract',
/**
 * @lends Lava.widget.CalendarAbstract#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',
	name: 'calendar',

	_properties: {
		_current_year: 0,
		_current_month: 0,
		_current_day: 0
	},

	_getMonthDescriptors: function(locale) {

		var i,
			result = [],
			month_names = Lava.locales[locale].short_month_names;

		for (i = 0; i < 12; i++) {

			result[i] = new Lava.mixin.Properties({
				index: i,
				title: month_names[i]
			});

		}

		return result;

	},

	_getMonthDescriptorRows: function(descriptors) {

		var result = [];
		result.push(descriptors.slice(0, 4));
		result.push(descriptors.slice(4, 8));
		result.push(descriptors.slice(8, 12));
		return result;

	},

	_getWeekDays: function(locale) {

		var culture_offset = Lava.locales[locale].first_day_offset,
			result = [],
			daynames = Lava.locales[locale].short_day_names,
			i,
			descriptor;

		for (i = 0; i < 7; i++) {
			descriptor = new Lava.mixin.Properties({
				index: i,
				title: daynames[culture_offset]
			});
			result.push(descriptor);
			culture_offset = (culture_offset + 1) % 7;
		}

		return result;

	},

	_renderMonth: function(year, month, locale) {

		var culture_offset = Lava.locales[locale].first_day_offset,
			first_day_in_sequence = new Date(Date.UTC(year, month)),
			first_day_of_week = (first_day_in_sequence.getDay() - culture_offset + 7) % 7;

		if (first_day_of_week) { // the first day of month does not start at beginning of the row

			// Date object will correct the wrong arguments
			first_day_in_sequence = new Date(Date.UTC(year, month, 1 - first_day_of_week));

		}

		return {
			year: year,
			index: month,
			weeks: this._renderMonthWeeks(first_day_in_sequence)
		}

	},

	/**
	 * Render the 6 rows of 7 days. Receives the date of the first day in the first row.
	 * (day of week always starts from zero)
	 *
	 * @param {Date} start_date
	 */
	_renderMonthWeeks: function(start_date) {

		var year = start_date.getUTCFullYear(),
			month = start_date.getUTCMonth(),
			day = start_date.getUTCDate(),
			milliseconds = start_date.getTime(),
			day_of_week = 0, // 0 - 6
			days_in_month = Firestorm.Date.getDaysInMonth(year, month),
			i = 0,
			result = [],
			week = [];

		week.push(this._renderDay(year, month, day, day_of_week, milliseconds));

		do {

			if (day == days_in_month) {
				day = 1;
				month++;
				if (month == 12) {
					month = 0;
					year++;
				}
				days_in_month = Firestorm.Date.getDaysInMonth(year, month);
			} else {
				day++;
			}
			day_of_week = (day_of_week + 1) % 7;
			i++;
			milliseconds += 86400000; // 24 hours

			if (day_of_week == 0) {
				result.push(week);
				week = [];
			}

			week.push(this._renderDay(year, month, day, day_of_week, milliseconds));

		} while (i < 42); // 7*6

		return result;

	},

	_renderDay: function(year, month, day, day_of_week, milliseconds) {
		return {
			year: year,
			month: month,
			day: day,
			day_of_week: day_of_week,
			milliseconds: milliseconds,
			is_today: this._properties._current_day == day
				&& this._properties._current_month == month
				&& this._properties._current_year == year
		};
	}

});

Lava.define(
'Lava.widget.Calendar',
/**
 * @lends Lava.widget.Calendar#
 * @extends Lava.widget.CalendarAbstract#
 */
{

	Extends: 'Lava.widget.CalendarAbstract',

	_property_descriptors: {
		value: {type: 'Date', setter: '_setValue'}
	},

	_properties: {
		value: null, // the current Date object
		_selected_view: 'days',
		_weekdays: null, // culture-dependent list of week days
		_months: null, // template data
		_month_year_string: null, // Example: "May 2014" - displayed above the days_table
		_today_string: null, // Example: "24 May 2014" - displayed on the "today" button
		_selection_start: 0, // in milliseconds
		_selection_end: 0,
		_displayed_year: null,
		_displayed_month: null,
		_month_descriptors: null,
		_month_descriptor_rows: null
	},

	_event_handlers: {
		today_click: '_onTodayClick', // click on the current date to select it
		previous_month_click: '_onPreviousMonthClick',
		next_month_click: '_onNextMonthClick',
		days_view_month_name_click: '_onSwitchToMonthViewClick', // while in the 'days' view - click on the month name above the days
		//close_month_view_click: '_onCloseMonthsViewClick', // on 'months' select view: close it and return to the 'days' view
		month_click: '_onMonthClick', // on 'months' view - select month
		day_click: '_onDayClick',
		previous_year_click: '_onPreviousYearClick',
		next_year_click: '_onNextYearClick'
	},

	_role_handlers: {
		_year_input: '_handleYearInput'
	},

	_year_input: null,
	_months_cache: {},

	init: function(config, widget, parent_view, template, properties) {

		var current_date = new Date(),
			storage = this._properties,
			locale_object = Lava.locales[Lava.schema.LOCALE];

		// not using UTC values here to allow user to see the day in his own timezone
		storage._current_year = current_date.getFullYear();
		storage._current_month = current_date.getMonth();
		storage._current_day = current_date.getDate();

		storage._displayed_year = storage._current_year;
		storage._displayed_month = storage._current_month;

		storage._weekdays = this._getWeekDays(Lava.schema.LOCALE);
		storage._month_descriptors = this._getMonthDescriptors(Lava.schema.LOCALE);
		storage._month_descriptor_rows = this._getMonthDescriptorRows(storage._month_descriptors);

		this.CalendarAbstract$init(config, widget, parent_view, template, properties);

		if (this._properties.value == null) {
			this._setValue('value', current_date);
		}

		this.set(
			'_today_string',
			storage._current_day + ' ' + locale_object.month_names[storage._current_month] + ' ' + storage._current_year
		);

		this._refreshData();

	},

	_refreshData: function() {

		var locale_object = Lava.locales[Lava.schema.LOCALE],
			month_data = this._getMonthData(this._properties._displayed_year, this._properties._displayed_month);

		this.set('_months', [month_data]);

		// Formatting by hands, cause in future there may be added a possibility to set locale in options
		this.set(
			'_month_year_string',
			locale_object.month_names[this._properties._displayed_month] + ' ' + this._properties._displayed_year
		);

	},

	_getMonthData: function(year, month) {

		var month_key = year + '' + month;

		if (!(month_key in this._months_cache)) {
			this._months_cache[month_key] = this._renderMonth(year, month, Lava.schema.LOCALE);
		}

		return this._months_cache[month_key];

	},

	_onPreviousMonthClick: function(dom_event_name, dom_event, view, template_arguments) {

		var month = this._properties._displayed_month;
		if (month == 0) {
			this.set('_displayed_year', this._properties._displayed_year - 1);
			this.set('_displayed_month', 11);
		} else {
			this.set('_displayed_month', month - 1);
		}
		this._refreshData();

		dom_event.preventDefault();

	},

	_onNextMonthClick: function(dom_event_name, dom_event, view, template_arguments) {

		var month = this._properties._displayed_month;
		if (month == 11) {
			this.set('_displayed_year', this._properties._displayed_year + 1);
			this.set('_displayed_month', 0);
		} else {
			this.set('_displayed_month', month + 1);
		}
		this._refreshData();

		dom_event.preventDefault();

	},

	_onTodayClick: function(dom_event_name, dom_event, view, template_arguments) {

		var time = Date.UTC(this._properties._current_year, this._properties._current_month, this._properties._current_day);
		this._select(this._properties._current_year, this._properties._current_month, time);
		dom_event.preventDefault();

	},

	_onDayClick: function(dom_event_name, dom_event, view, template_arguments) {

		var day = template_arguments[0];
		this._select(day.year, day.month, day.milliseconds);
		dom_event.preventDefault(); // cancel selection

	},

	_select: function(year, month, milliseconds) {

		this.set('_selection_start', milliseconds);
		this.set('_selection_end', milliseconds);
		if (this._properties._displayed_month != month) {
			this.set('_displayed_year', year);
			this.set('_displayed_month', month);
			this._refreshData();
		}

		this.set('value', new Date(milliseconds));

	},

	_onSwitchToMonthViewClick: function(dom_event_name, dom_event, view, template_arguments) {

		this.set('_selected_view', 'months');
		if (this._year_input) {
			this._year_input.set('value', this._properties._displayed_year + '');
		}
		dom_event.preventDefault();

	},

	/*_onCloseMonthsViewClick: function(dom_event_name, dom_event, view, template_arguments) {

		this._refreshData();
		this.set('_selected_view', 'days');

	},*/

	_onPreviousYearClick: function(dom_event_name, dom_event, view, template_arguments) {

		this.set('_displayed_year', this.get('_displayed_year') - 1);
		this._clearInvalidInputState();
		dom_event.preventDefault();

	},

	_onNextYearClick: function(dom_event_name, dom_event, view, template_arguments) {

		this.set('_displayed_year', this.get('_displayed_year') + 1);
		this._clearInvalidInputState();
		dom_event.preventDefault();

	},

	_onMonthClick: function(dom_event_name, dom_event, view, template_arguments) {

		var month_descriptor = template_arguments[0];
		this.set('_displayed_month', month_descriptor.get('index'));
		this.set('_selected_view', 'days');
		this._refreshData();

	},

	_handleYearInput: function(view, template_arguments) {

		this._year_input = view;
		view.onPropertyChanged('value', this._onYearInputValueChanged, this);

	},

	_markInputAsInvalid: function() {

		// do not add the class to the container itself, just to the element
		// cause we do not need it to stay after refresh or render
		var element = this._year_input.getMainContainer().getDOMElement();
		if (element) {
			Firestorm.Element.addClass(element, this._config.options['invalid_input_class']);
		}

	},

	_clearInvalidInputState: function() {

		var element = this._year_input.getMainContainer().getDOMElement();
		if (element) {
			Firestorm.Element.removeClass(element, this._config.options['invalid_input_class']);
		}

	},

	_onYearInputValueChanged: function(widget) {

		var value = widget.get('value');

		// maxlength is also set on input in the template
		if (value.length > 2 && value.length < 6 && /^\d+$/.test(value)) {
			this.set('_displayed_year', +value);
			this._clearInvalidInputState();
		} else {
			this._markInputAsInvalid();
		}

	},

	_setValue: function(name, value) {

		var year = value.getFullYear(),
			month = value.getMonth(),
			day = value.getDate(),
			new_time = Date.UTC(year, month, day); // normalize for selection

		this.set('_displayed_year', year);
		this.set('_displayed_month', month);

		this.set('_selection_start', new_time);
		this.set('_selection_end', new_time);

		this._set('value', value);

		this._refreshData();

	}

});

Lava.define(
'Lava.widget.Tooltip',
/**
 * @lends Lava.widget.Tooltip#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',

	name: 'tooltip',

	_property_descriptors: {
		y: {type: 'Integer'},
		x: {type: 'Integer'},
		y_offset: {type: 'Integer'},
		x_offset: {type: 'Integer'},
		html: {type: 'String'},
		is_visible: {type: 'Boolean'}
	},

	_properties: {
		y: 0,
		x: 0,
		y_offset: -25,
		x_offset: 5,
		html: '',
		is_visible: false
	}

});
Lava.widgets = {
	InputAbstract: {
		type: "widget",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Default",
		template: [
			"\r\n\t\t",
			{
				name: "input_view",
				type: "include"
			},
			"\r\n\t"
		],
		sugar: {
			attribute_mappings: {
				name: {
					type: "property",
					type_name: "String",
					name: "name"
				},
				value: {
					type: "property",
					type_name: "String",
					name: "value"
				},
				disabled: {
					type: "property",
					type_name: "SwitchAttribute",
					name: "is_disabled"
				},
				required: {
					type: "property",
					type_name: "SwitchAttribute",
					name: "is_required"
				},
				readonly: {
					type: "property",
					type_name: "SwitchAttribute",
					name: "is_readonly"
				}
			}
		},
		is_extended: false
	},
	CheckBox: {
		includes: {
			input_view: [{
				type: "view",
				"class": "View",
				container: {
					"class": "Element",
					tag_name: "input",
					events: {
						change: [{
							locator_type: "Name",
							locator: "checkbox",
							name: "checked_changed"
						}],
						focus: [{
							locator_type: "Name",
							locator: "checkbox",
							name: "_focused"
						}],
						blur: [{
							locator_type: "Name",
							locator: "checkbox",
							name: "_blurred"
						}]
					},
					property_bindings: {
						name: {
							evaluator: function() {
return (this._binds[0].getValue());
},
							flags: {isScopeEval: true},
							binds: [{
								locator_type: "Name",
								locator: "checkbox",
								tail: ["name"]
							}]
						},
						value: {
							evaluator: function() {
return (this._binds[0].getValue());
},
							flags: {isScopeEval: true},
							binds: [{
								locator_type: "Name",
								locator: "checkbox",
								tail: ["value"]
							}]
						},
						disabled: {
							evaluator: function() {
return (this._binds[0].getValue());
},
							flags: {isScopeEval: true},
							binds: [{
								locator_type: "Name",
								locator: "checkbox",
								tail: ["is_disabled"]
							}]
						},
						required: {
							evaluator: function() {
return (this._binds[0].getValue());
},
							flags: {isScopeEval: true},
							binds: [{
								locator_type: "Name",
								locator: "checkbox",
								tail: ["is_required"]
							}]
						},
						readonly: {
							evaluator: function() {
return (this._binds[0].getValue());
},
							flags: {isScopeEval: true},
							binds: [{
								locator_type: "Name",
								locator: "checkbox",
								tail: ["is_readonly"]
							}]
						}
					},
					resource_id: {
						locator_type: "Name",
						locator: "checkbox",
						name: "CHECKBOX_ELEMENT"
					}
				},
				roles: [{name: "_input_view"}]
			}]
		},
		sugar: {
			tag_name: "checkbox",
			unknown_root_attributes: {
				type: "as_resource",
				container_resource_name: "CHECKBOX_ELEMENT"
			},
			attribute_mappings: {
				checked: {
					type: "property",
					type_name: "SwitchAttribute",
					name: "is_checked"
				},
				indeterminate: {
					type: "property",
					type_name: "SwitchAttribute",
					name: "is_indeterminate"
				}
			}
		},
		real_class: "input.CheckBox",
		"extends": "InputAbstract",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Default",
		is_extended: false
	},
	TextArea: {
		includes: {
			input_view: [{
				type: "view",
				"class": "View",
				container: {
					"class": "Element",
					tag_name: "textarea",
					events: {
						change: [{
							locator_type: "Name",
							locator: "textarea",
							name: "value_changed"
						}],
						input: [{
							locator_type: "Name",
							locator: "textarea",
							name: "input"
						}],
						focus: [{
							locator_type: "Name",
							locator: "textarea",
							name: "_focused"
						}],
						blur: [{
							locator_type: "Name",
							locator: "textarea",
							name: "_blurred"
						}]
					},
					property_bindings: {
						name: {
							evaluator: function() {
return (this._binds[0].getValue());
},
							flags: {isScopeEval: true},
							binds: [{
								locator_type: "Name",
								locator: "textarea",
								tail: ["name"]
							}]
						},
						disabled: {
							evaluator: function() {
return (this._binds[0].getValue());
},
							flags: {isScopeEval: true},
							binds: [{
								locator_type: "Name",
								locator: "textarea",
								tail: ["is_disabled"]
							}]
						},
						required: {
							evaluator: function() {
return (this._binds[0].getValue());
},
							flags: {isScopeEval: true},
							binds: [{
								locator_type: "Name",
								locator: "textarea",
								tail: ["is_required"]
							}]
						},
						readonly: {
							evaluator: function() {
return (this._binds[0].getValue());
},
							flags: {isScopeEval: true},
							binds: [{
								locator_type: "Name",
								locator: "textarea",
								tail: ["is_readonly"]
							}]
						}
					},
					resource_id: {
						locator_type: "Name",
						locator: "textarea",
						name: "TEXTAREA_ELEMENT"
					}
				},
				roles: [{name: "_input_view"}]
			}]
		},
		sugar: {
			tag_name: "text_area",
			unknown_root_attributes: {
				type: "as_resource",
				container_resource_name: "TEXTAREA_ELEMENT"
			},
			attribute_mappings: {
				value: {
					type: "property",
					type_name: "String",
					name: "value"
				}
			}
		},
		default_events: ["input"],
		real_class: "input.TextArea",
		"extends": "InputAbstract",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Default",
		is_extended: false
	},
	TextInput: {
		includes: {
			input_view: [{
				type: "view",
				"class": "View",
				container: {
					"class": "Element",
					tag_name: "input",
					events: {
						change: [{
							locator_type: "Name",
							locator: "text_input",
							name: "value_changed"
						}],
						input: [{
							locator_type: "Name",
							locator: "text_input",
							name: "input"
						}],
						focus: [{
							locator_type: "Name",
							locator: "text_input",
							name: "_focused"
						}],
						blur: [{
							locator_type: "Name",
							locator: "text_input",
							name: "_blurred"
						}]
					},
					property_bindings: {
						name: {
							evaluator: function() {
return (this._binds[0].getValue());
},
							flags: {isScopeEval: true},
							binds: [{
								locator_type: "Name",
								locator: "text_input",
								tail: ["name"]
							}]
						},
						disabled: {
							evaluator: function() {
return (this._binds[0].getValue());
},
							flags: {isScopeEval: true},
							binds: [{
								locator_type: "Name",
								locator: "text_input",
								tail: ["is_disabled"]
							}]
						},
						required: {
							evaluator: function() {
return (this._binds[0].getValue());
},
							flags: {isScopeEval: true},
							binds: [{
								locator_type: "Name",
								locator: "text_input",
								tail: ["is_required"]
							}]
						},
						readonly: {
							evaluator: function() {
return (this._binds[0].getValue());
},
							flags: {isScopeEval: true},
							binds: [{
								locator_type: "Name",
								locator: "text_input",
								tail: ["is_readonly"]
							}]
						}
					},
					resource_id: {
						locator_type: "Name",
						locator: "text_input",
						name: "TEXT_INPUT_ELEMENT"
					}
				},
				roles: [{name: "_input_view"}]
			}]
		},
		sugar: {
			tag_name: "text_input",
			unknown_root_attributes: {
				type: "as_resource",
				container_resource_name: "TEXT_INPUT_ELEMENT"
			},
			attribute_mappings: {
				value: {
					type: "property",
					type_name: "String",
					name: "value"
				}
			}
		},
		default_events: ["input"],
		real_class: "input.Text",
		"extends": "InputAbstract",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Default",
		is_extended: false
	},
	Numeric: {
		real_class: "input.Numeric",
		"extends": "TextInput",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Default",
		is_extended: false
	},
	Radio: {
		includes: {
			input_view: [{
				type: "view",
				"class": "View",
				container: {
					"class": "Element",
					tag_name: "input",
					events: {
						change: [{
							locator_type: "Name",
							locator: "radio",
							name: "checked_changed"
						}],
						focus: [{
							locator_type: "Name",
							locator: "radio",
							name: "_focused"
						}],
						blur: [{
							locator_type: "Name",
							locator: "radio",
							name: "_blurred"
						}]
					},
					property_bindings: {
						name: {
							evaluator: function() {
return (this._binds[0].getValue());
},
							flags: {isScopeEval: true},
							binds: [{
								locator_type: "Name",
								locator: "radio",
								tail: ["name"]
							}]
						},
						value: {
							evaluator: function() {
return (this._binds[0].getValue());
},
							flags: {isScopeEval: true},
							binds: [{
								locator_type: "Name",
								locator: "radio",
								tail: ["value"]
							}]
						},
						disabled: {
							evaluator: function() {
return (this._binds[0].getValue());
},
							flags: {isScopeEval: true},
							binds: [{
								locator_type: "Name",
								locator: "radio",
								tail: ["is_disabled"]
							}]
						},
						required: {
							evaluator: function() {
return (this._binds[0].getValue());
},
							flags: {isScopeEval: true},
							binds: [{
								locator_type: "Name",
								locator: "radio",
								tail: ["is_required"]
							}]
						},
						readonly: {
							evaluator: function() {
return (this._binds[0].getValue());
},
							flags: {isScopeEval: true},
							binds: [{
								locator_type: "Name",
								locator: "radio",
								tail: ["is_readonly"]
							}]
						}
					},
					resource_id: {
						locator_type: "Name",
						locator: "radio",
						name: "RADIO_ELEMENT"
					}
				},
				roles: [{name: "_input_view"}]
			}]
		},
		sugar: {
			tag_name: "radio",
			unknown_root_attributes: {
				type: "as_resource",
				container_resource_name: "RADIO_ELEMENT"
			},
			attribute_mappings: {
				checked: {
					type: "property",
					type_name: "SwitchAttribute",
					name: "is_checked"
				}
			}
		},
		real_class: "input.Radio",
		"extends": "InputAbstract",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Default",
		is_extended: false
	},
	SubmitInput: {
		includes: {
			input_view: [{
				type: "view",
				"class": "View",
				container: {
					"class": "Element",
					tag_name: "input",
					events: {
						click: [{
							locator_type: "Name",
							locator: "submit",
							name: "clicked"
						}],
						focus: [{
							locator_type: "Name",
							locator: "submit",
							name: "_focused"
						}],
						blur: [{
							locator_type: "Name",
							locator: "submit",
							name: "_blurred"
						}]
					},
					property_bindings: {
						name: {
							evaluator: function() {
return (this._binds[0].getValue());
},
							flags: {isScopeEval: true},
							binds: [{
								locator_type: "Name",
								locator: "submit",
								tail: ["name"]
							}]
						},
						value: {
							evaluator: function() {
return (this._binds[0].getValue());
},
							flags: {isScopeEval: true},
							binds: [{
								locator_type: "Name",
								locator: "submit",
								tail: ["value"]
							}]
						},
						disabled: {
							evaluator: function() {
return (this._binds[0].getValue());
},
							flags: {isScopeEval: true},
							binds: [{
								locator_type: "Name",
								locator: "submit",
								tail: ["is_disabled"]
							}]
						}
					},
					resource_id: {
						locator_type: "Name",
						locator: "submit",
						name: "SUBMIT_INPUT_ELEMENT"
					}
				},
				roles: [{name: "_input_view"}]
			}]
		},
		sugar: {
			tag_name: "submit_input",
			unknown_root_attributes: {
				type: "as_resource",
				container_resource_name: "SUBMIT_INPUT_ELEMENT"
			}
		},
		real_class: "input.Submit",
		"extends": "InputAbstract",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Default",
		is_extended: false
	},
	SubmitButton: {
		includes: {
			input_view: [{
				type: "view",
				"class": "View",
				container: {
					"class": "Element",
					tag_name: "button",
					events: {
						click: [{
							locator_type: "Name",
							locator: "submit",
							name: "clicked"
						}],
						focus: [{
							locator_type: "Name",
							locator: "submit",
							name: "_focused"
						}],
						blur: [{
							locator_type: "Name",
							locator: "submit",
							name: "_blurred"
						}]
					},
					property_bindings: {
						name: {
							evaluator: function() {
return (this._binds[0].getValue());
},
							flags: {isScopeEval: true},
							binds: [{
								locator_type: "Name",
								locator: "submit",
								tail: ["name"]
							}]
						},
						value: {
							evaluator: function() {
return (this._binds[0].getValue());
},
							flags: {isScopeEval: true},
							binds: [{
								locator_type: "Name",
								locator: "submit",
								tail: ["value"]
							}]
						},
						disabled: {
							evaluator: function() {
return (this._binds[0].getValue());
},
							flags: {isScopeEval: true},
							binds: [{
								locator_type: "Name",
								locator: "submit",
								tail: ["is_disabled"]
							}]
						}
					},
					resource_id: {
						locator_type: "Name",
						locator: "submit",
						name: "SUBMIT_BUTTON_ELEMENT"
					}
				},
				roles: [{name: "_input_view"}],
				template: [
					"\r\n\t\t\t\t",
					{
						name: "content",
						type: "include"
					},
					"\r\n\t\t"
				]
			}],
			content: ["\r\n\t"]
		},
		sugar: {
			tag_name: "submit_button",
			is_content_allowed: true,
			content_schema: {type: "template"},
			unknown_root_attributes: {
				type: "as_resource",
				container_resource_name: "SUBMIT_BUTTON_ELEMENT"
			}
		},
		real_class: "input.Submit",
		"extends": "InputAbstract",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Default",
		is_extended: false
	},
	SelectAbstract: {
		includes: {
			input_view: [{
				type: "view",
				"class": "View",
				container: {
					"class": "Element",
					tag_name: "select",
					events: {
						change: [{
							locator_type: "Name",
							locator: "select",
							name: "value_changed"
						}],
						focus: [{
							locator_type: "Name",
							locator: "select",
							name: "_focused"
						}],
						blur: [{
							locator_type: "Name",
							locator: "select",
							name: "_blurred"
						}]
					}
				},
				roles: [{name: "_input_view"}],
				template: [
					"\r\n\t\t\t",
					{
						type: "view",
						"class": "Foreach",
						argument: {
							evaluator: function() {
return (this._binds[0].getValue());
},
							flags: {isScopeEval: true},
							binds: [{
								locator_type: "Name",
								locator: "select",
								tail: ["optgroups"]
							}]
						},
						as: "optgroup",
						template: [
							"\r\n\t\t\t\t",
							{
								type: "view",
								"class": "If",
								argument: {
									evaluator: function() {
return (this._binds[0].getValue());
},
									flags: {isScopeEval: true},
									binds: [{
										property_name: "optgroup",
										tail: ["label"]
									}]
								},
								template: [
									"\r\n\t\t\t\t\t",
									{
										type: "view",
										"class": "View",
										container: {
											"class": "Element",
											tag_name: "optgroup",
											property_bindings: {
												label: {
													evaluator: function() {
return (this._binds[0].getValue());
},
													flags: {isScopeEval: true},
													binds: [{
														property_name: "optgroup",
														tail: ["label"]
													}]
												},
												disabled: {
													evaluator: function() {
return (this._binds[0].getValue());
},
													flags: {isScopeEval: true},
													binds: [{
														property_name: "optgroup",
														tail: ["is_disabled"]
													}]
												}
											}
										},
										template: [
											"\r\n\t\t\t\t\t\t",
											{
												name: "group_options",
												type: "include"
											},
											"\r\n\t\t\t\t\t"
										]
									},
									"\r\n\t\t\t\t"
								],
								else_template: [
									"\r\n\t\t\t\t\t",
									{
										name: "group_options",
										type: "include"
									},
									"\r\n\t\t\t\t"
								]
							},
							"\r\n\t\t\t"
						]
					},
					"\r\n\t\t"
				]
			}],
			group_options: [{
				type: "view",
				"class": "Foreach",
				argument: {
					evaluator: function() {
return (this._binds[0].getValue());
},
					flags: {isScopeEval: true},
					binds: [{
						property_name: "optgroup",
						tail: ["options"]
					}]
				},
				as: "option",
				template: [
					"\r\n\t\t\t",
					{
						type: "view",
						"class": "Expression",
						argument: {
							evaluator: function() {
return (this._binds[0].getValue());
},
							flags: {isScopeEval: true},
							binds: [{
								property_name: "option",
								tail: ["title"]
							}]
						},
						container: {
							"class": "Element",
							tag_name: "option",
							property_bindings: {
								value: {
									evaluator: function() {
return (this._binds[0].getValue());
},
									flags: {isScopeEval: true},
									binds: [{
										property_name: "option",
										tail: ["value"]
									}]
								},
								selected: {
									evaluator: function() {
return (this._callModifier("0", [this._binds[0].getValue()]));
},
									binds: [{
										property_name: "option",
										tail: ["value"]
									}],
									modifiers: [{
										locator_type: "Name",
										locator: "select",
										callback_name: "isValueSelected"
									}]
								},
								disabled: {
									evaluator: function() {
return (this._binds[0].getValue());
},
									flags: {isScopeEval: true},
									binds: [{
										property_name: "option",
										tail: ["is_disabled"]
									}]
								}
							}
						}
					},
					"\r\n\t\t"
				]
			}]
		},
		"extends": "InputAbstract",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Default",
		is_extended: false
	},
	Select: {
		real_class: "input.Select",
		"extends": "SelectAbstract",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Default",
		is_extended: false
	},
	MultipleSelect: {
		real_class: "input.MultipleSelect",
		"extends": "SelectAbstract",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Default",
		is_extended: false
	},
	Collapsible: {
		type: "widget",
		"class": "Lava.widget.Collapsible",
		extender_type: "Default",
		template: [
			"\r\n\t\t",
			{
				type: "view",
				"class": "View",
				container: {
					"class": "Element",
					tag_name: "div",
					resource_id: {
						locator_type: "Name",
						locator: "collapsible",
						name: "COLLAPSIBLE_CONTAINER"
					}
				},
				roles: [{
					locator_type: "Name",
					locator: "collapsible",
					name: "_container_view"
				}],
				template: [
					"\r\n\t\t\t",
					{
						locator_type: "Name",
						locator: "collapsible",
						name: "content",
						type: "include"
					},
					"\r\n\t\t"
				]
			},
			"\r\n\t"
		],
		options: {
			animation: {"class": "Collapse"}
		},
		sugar: {
			tag_name: "collapsible",
			is_content_allowed: true,
			content_schema: {type: "template"},
			attribute_mappings: {
				"is-expanded": {
					type: "property",
					type_name: "Boolean",
					name: "is_expanded"
				},
				"is-animation-enabled": {
					type: "property",
					type_name: "Boolean",
					name: "is_animation_enabled"
				}
			}
		},
		resources: {
			"default": {
				COLLAPSIBLE_CONTAINER: {
					type: "container_stack",
					value: [{
						name: "static_classes",
						value: ["lava-collapsible"]
					}]
				}
			}
		},
		real_class: "Collapsible",
		is_extended: true,
		resources_cache: {
			en: {
				COLLAPSIBLE_CONTAINER: {
					type: "container_stack",
					value: [{
						name: "static_classes",
						value: ["lava-collapsible"]
					}]
				}
			}
		}
	},
	CollapsiblePanel: {
		type: "widget",
		"class": "Lava.widget.CollapsiblePanel",
		extender_type: "Default",
		template: [
			"\r\n\t\t\t",
			{
				locator_type: "Name",
				locator: "collapsible_panel",
				name: "header_wrapper",
				type: "include"
			},
			"\r\n\t\t\t",
			{
				locator_type: "Name",
				locator: "collapsible_panel",
				name: "content_wrapper",
				type: "include"
			},
			"\r\n\t\t"
		],
		container: {
			"class": "Element",
			tag_name: "div",
			resource_id: {
				locator_type: "Name",
				locator: "collapsible_panel",
				name: "COLLAPSIBLE_PANEL_CONTAINER"
			}
		},
		includes: {
			header_wrapper: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "View",
					container: {
						"class": "Element",
						tag_name: "div",
						events: {
							click: [{
								locator_type: "Name",
								locator: "collapsible_panel",
								name: "header_click"
							}]
						},
						resource_id: {
							locator_type: "Name",
							locator: "collapsible_panel",
							name: "COLLAPSIBLE_PANEL_HEADER_CONTAINER"
						}
					},
					template: [
						"\r\n\t\t\t",
						{
							locator_type: "Name",
							locator: "collapsible_panel",
							name: "header",
							type: "include"
						},
						"\r\n\t\t"
					]
				},
				"\r\n\t"
			],
			content_wrapper: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "View",
					container: {
						"class": "Element",
						tag_name: "div"
					},
					roles: [{
						locator_type: "Name",
						locator: "collapsible_panel",
						name: "_container_view"
					}],
					template: [
						"\r\n\t\t\t",
						{
							type: "static_tag",
							resource_id: {
								locator_type: "Name",
								locator: "collapsible_panel",
								name: "COLLAPSIBLE_PANEL_BODY_CONTAINER"
							},
							name: "div",
							template: [
								"\r\n\t\t\t\t",
								{
									locator_type: "Name",
									locator: "collapsible_panel",
									name: "content",
									type: "include"
								},
								"\r\n\t\t\t"
							]
						},
						"\r\n\t\t"
					]
				},
				"\r\n\t"
			],
			header: [
				"\r\n\t\t<h3 class=\"panel-title\">",
				{
					locator_type: "Name",
					locator: "collapsible_panel",
					name: "title",
					type: "include"
				},
				"</h3>\r\n\t"
			],
			title: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "Expression",
					argument: {
						evaluator: function() {
return (this._binds[0].getValue());
},
						flags: {isScopeEval: true},
						binds: [{
							locator_type: "Name",
							locator: "collapsible_panel",
							tail: ["title"]
						}]
					}
				},
				"\r\n\t"
			],
			content: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "Expression",
					argument: {
						evaluator: function() {
return (this._binds[0].getValue());
},
						flags: {isScopeEval: true},
						binds: [{
							locator_type: "Name",
							locator: "collapsible_panel",
							tail: ["content"]
						}]
					}
				},
				"\r\n\t"
			]
		},
		sugar: {
			tag_name: "collapsible-panel",
			is_content_allowed: true,
			content_schema: {
				type: "object_map",
				tag_roles: {
					title: {
						type: "template",
						name: "title"
					},
					content: {type: "template"}
				}
			},
			attribute_mappings: {
				"is-locked": {
					type: "property",
					type_name: "Boolean",
					name: "is_locked"
				},
				"is-expanded": {
					type: "property",
					type_name: "Boolean",
					name: "is_expanded"
				},
				"is-animation-enabled": {
					type: "property",
					type_name: "Boolean",
					name: "is_animation_enabled"
				}
			}
		},
		resources: {
			"default": {
				COLLAPSIBLE_PANEL_CONTAINER: {
					type: "container_stack",
					value: [{
						name: "static_classes",
						value: [
							"panel",
							"lava-panel"
						]
					}]
				},
				COLLAPSIBLE_PANEL_HEADER_CONTAINER: {
					type: "container_stack",
					value: [{
						name: "static_classes",
						value: [
							"panel-heading",
							"lava-unselectable"
						]
					}]
				},
				COLLAPSIBLE_PANEL_BODY_CONTAINER: {
					type: "container_stack",
					value: [{
						name: "static_classes",
						value: ["panel-body"]
					}]
				}
			}
		},
		real_class: "CollapsiblePanel",
		"extends": "Collapsible",
		is_extended: true,
		options: {
			animation: {"class": "Collapse"}
		},
		resources_cache: {
			en: {
				COLLAPSIBLE_PANEL_CONTAINER: {
					type: "container_stack",
					value: [{
						name: "static_classes",
						value: [
							"panel",
							"lava-panel"
						]
					}]
				},
				COLLAPSIBLE_PANEL_HEADER_CONTAINER: {
					type: "container_stack",
					value: [{
						name: "static_classes",
						value: [
							"panel-heading",
							"lava-unselectable"
						]
					}]
				},
				COLLAPSIBLE_PANEL_BODY_CONTAINER: {
					type: "container_stack",
					value: [{
						name: "static_classes",
						value: ["panel-body"]
					}]
				},
				COLLAPSIBLE_CONTAINER: {
					type: "container_stack",
					value: [{
						name: "static_classes",
						value: ["lava-collapsible"]
					}]
				}
			}
		}
	},
	CollapsiblePanelExt: {
		includes: {
			content_wrapper: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "If",
					argument: {
						evaluator: function() {
return (this._binds[0].getValue());
},
						flags: {isScopeEval: true},
						binds: [{
							locator_type: "Name",
							locator: "collapsible_panel",
							tail: ["is_expanded"]
						}]
					},
					container: {
						"class": "Emulated",
						options: {placement: "after-previous"}
					},
					roles: [{
						locator_type: "Name",
						locator: "collapsible_panel",
						name: "_content_if"
					}],
					refresher: {"class": "Collapse"},
					template: [
						"\r\n\t\t\t\r\n\t\t\t\r\n\t\t\t\r\n\t\t\t",
						{
							type: "view",
							"class": "View",
							container: {
								"class": "Element",
								tag_name: "div"
							},
							template: [
								"\r\n\t\t\t\t",
								{
									type: "static_tag",
									resource_id: {
										locator_type: "Name",
										locator: "collapsible_panel",
										name: "COLLAPSIBLE_PANEL_EXT_BODY_CONTAINER"
									},
									name: "div",
									template: [
										"\r\n\t\t\t\t\t",
										{
											locator_type: "Name",
											locator: "collapsible_panel",
											name: "content",
											type: "include"
										},
										"\r\n\t\t\t\t"
									]
								},
								"\r\n\t\t\t"
							]
						},
						"\r\n\t\t"
					]
				},
				"\r\n\t"
			]
		},
		sugar: {tag_name: "collapsible-panel-ext"},
		resources: {
			"default": {
				COLLAPSIBLE_PANEL_EXT_BODY_CONTAINER: {
					type: "container_stack",
					value: [{
						name: "static_classes",
						value: ["panel-body"]
					}]
				}
			}
		},
		real_class: "CollapsiblePanelExt",
		"extends": "CollapsiblePanel",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Default",
		is_extended: false
	},
	Accordion: {
		type: "widget",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Default",
		template: [
			"\r\n\t\t",
			{
				locator_type: "Name",
				locator: "accordion",
				name: "content",
				type: "include"
			},
			"\r\n\t"
		],
		includes: {
			content: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "Foreach",
					argument: {
						evaluator: function() {
return (this._binds[0].getValue());
},
						flags: {isScopeEval: true},
						binds: [{
							locator_type: "Name",
							locator: "accordion",
							tail: ["_panels"]
						}]
					},
					as: "panel",
					refresher: {
						"class": "Default",
						insertion_strategy: "sequential_elements"
					},
					template: [
						"\r\n\t\t\t\t\r\n\t\t\t\t",
						{
							type: "widget",
							"class": "Lava.WidgetConfigExtensionGateway",
							extender_type: "Default",
							"extends": "CollapsiblePanel",
							assigns: {
								is_expanded: {
									evaluator: function() {
return (this._binds[0].getValue());
},
									flags: {isScopeEval: true},
									binds: [{
										property_name: "panel",
										tail: ["is_expanded"]
									}]
								}
							},
							includes: {
								title: [
									"\r\n\t\t\t\t\t\t",
									{
										locator_type: "Name",
										locator: "accordion",
										name: "panel_include",
										arguments: [
											{
												type: 2,
												data: {property_name: "panel"}
											},
											{
												type: 1,
												data: "title_template"
											}
										],
										type: "include"
									},
									"\r\n\t\t\t\t\t"
								],
								content: [
									"\r\n\t\t\t\t\t\t",
									{
										locator_type: "Name",
										locator: "accordion",
										name: "panel_include",
										arguments: [
											{
												type: 2,
												data: {property_name: "panel"}
											},
											{
												type: 1,
												data: "content_template"
											}
										],
										type: "include"
									},
									"\r\n\t\t\t\t\t"
								]
							},
							roles: [{
								locator_type: "Name",
								locator: "accordion",
								name: "panel"
							}],
							resource_id: {
								locator_type: "Name",
								locator: "accordion",
								name: "panel"
							}
						},
						"\r\n\t\t\t"
					],
					container: {
						"class": "Element",
						tag_name: "div",
						resource_id: {
							locator_type: "Name",
							locator: "accordion",
							name: "ACCORDION_CONTAINER"
						}
					}
				},
				"\r\n\t"
			]
		},
		sugar: {
			tag_name: "accordion",
			content_schema: {
				type: "object_map",
				tag_roles: {
					content: {type: "template"},
					panels: {
						type: "object_collection",
						name: "panels",
						tag_name: "panel",
						tag_mappings: {
							title: {type: "template"},
							content: {type: "template"}
						},
						attribute_mappings: {
							"is-expanded": {
								type: "object_property",
								name: "is_expanded",
								type_name: "Boolean"
							}
						}
					}
				}
			},
			attribute_mappings: {
				"keep-expanded-on-add": {
					type: "switch",
					name: "keep_expanded_on_add"
				}
			}
		},
		resources: {
			"default": {
				ACCORDION_CONTAINER: {
					type: "container_stack",
					value: [{
						name: "static_classes",
						value: ["panel-group"]
					}]
				},
				panel: {
					type: "component",
					value: {
						COLLAPSIBLE_PANEL_CONTAINER: {
							type: "container_stack",
							value: [{
								name: "add_classes",
								value: ["panel-collapse"]
							}]
						}
					}
				}
			}
		},
		real_class: "Accordion",
		is_extended: false
	},
	Tabs: {
		type: "widget",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Default",
		template: [
			"\r\n\t\t",
			{
				type: "view",
				"class": "Foreach",
				argument: {
					evaluator: function() {
return (this._binds[0].getValue());
},
					flags: {isScopeEval: true},
					binds: [{
						locator_type: "Name",
						locator: "tabs",
						tail: ["_tabs"]
					}]
				},
				as: "tab",
				template: [
					"\r\n\t\t\t\t",
					{
						type: "view",
						"class": "If",
						argument: {
							evaluator: function() {
return (! this._binds[0].getValue());
},
							binds: [{
								property_name: "tab",
								tail: ["is_hidden"]
							}]
						},
						template: [
							"\r\n\t\t\t\t\t",
							{
								type: "view",
								"class": "View",
								container: {
									"class": "Element",
									tag_name: "li",
									class_bindings: {
										"0": {
											evaluator: function() {
return (this._binds[0].getValue() == this._binds[1].getValue() ? 'active' : '');
},
											binds: [
												{property_name: "tab"},
												{
													locator_type: "Name",
													locator: "tabs",
													tail: ["_active_tab"]
												}
											]
										},
										"1": {
											evaluator: function() {
return (this._binds[0].getValue() ? '' : 'disabled');
},
											binds: [{
												property_name: "tab",
												tail: ["is_enabled"]
											}]
										}
									}
								},
								template: [
									"\r\n\t\t\t\t\t\t",
									{
										type: "view",
										"class": "View",
										container: {
											"class": "Element",
											tag_name: "a",
											events: {
												click: [{
													locator_type: "Name",
													locator: "tabs",
													name: "header_click",
													arguments: [{
														type: 2,
														data: {property_name: "tab"}
													}]
												}]
											},
											property_bindings: {
												href: {
													evaluator: function() {
return ('#' + (this._binds[0].getValue() || ''));
},
													binds: [{
														property_name: "tab",
														tail: ["name"]
													}]
												}
											}
										},
										template: [
											"\r\n\t\t\t\t\t\t\t",
											{
												locator_type: "Name",
												locator: "tabs",
												name: "tab_include",
												arguments: [
													{
														type: 2,
														data: {property_name: "tab"}
													},
													{
														type: 1,
														data: "title_template"
													}
												],
												type: "include"
											},
											"\r\n\t\t\t\t\t\t"
										]
									},
									"\r\n\t\t\t\t\t"
								]
							},
							"\r\n\t\t\t\t"
						]
					},
					"\r\n\t\t\t"
				],
				container: {
					"class": "Element",
					tag_name: "ul",
					resource_id: {
						locator_type: "Name",
						locator: "tabs",
						name: "TABS_HEADERS_CONTAINER"
					}
				}
			},
			"\r\n\t\t",
			{
				type: "view",
				"class": "Foreach",
				argument: {
					evaluator: function() {
return (this._binds[0].getValue());
},
					flags: {isScopeEval: true},
					binds: [{
						locator_type: "Name",
						locator: "tabs",
						tail: ["_tabs"]
					}]
				},
				as: "tab",
				refresher: {
					"class": "Default",
					insertion_strategy: "sequential_elements"
				},
				template: [
					"\r\n\t\t\t\t\r\n\t\t\t\t",
					{
						type: "view",
						"class": "View",
						container: {
							"class": "Element",
							tag_name: "div",
							static_classes: ["tab-pane"],
							class_bindings: {
								"0": {
									evaluator: function() {
return (this._binds[0].getValue() == this._binds[1].getValue() ? 'active' : '');
},
									binds: [
										{property_name: "tab"},
										{
											locator_type: "Name",
											locator: "tabs",
											tail: ["_active_tab"]
										}
									]
								}
							}
						},
						template: [
							"\r\n\t\t\t\t\t",
							{
								locator_type: "Name",
								locator: "tabs",
								name: "tab_include",
								arguments: [
									{
										type: 2,
										data: {property_name: "tab"}
									},
									{
										type: 1,
										data: "content_template"
									}
								],
								type: "include"
							},
							"\r\n\t\t\t\t"
						]
					},
					"\r\n\t\t\t"
				],
				container: {
					"class": "Element",
					tag_name: "div",
					resource_id: {
						locator_type: "Name",
						locator: "tabs",
						name: "TABS_CONTENT_CONTAINER"
					}
				}
			},
			"\r\n\t"
		],
		sugar: {
			tag_name: "tabs",
			content_schema: {
				type: "object_collection",
				name: "tabs",
				tag_name: "tab",
				tag_mappings: {
					title: {
						type: "template",
						name: "title_template"
					},
					content: {
						type: "template",
						name: "content_template"
					}
				},
				attribute_mappings: {
					name: {type: "object_property"},
					"is-enabled": {
						type: "object_property",
						type_name: "Boolean",
						name: "is_enabled"
					},
					"is-hidden": {
						type: "object_property",
						type_name: "Boolean",
						name: "is_hidden"
					}
				}
			}
		},
		resources: {
			"default": {
				TABS_HEADERS_CONTAINER: {
					type: "container_stack",
					value: [{
						name: "static_classes",
						value: [
							"nav",
							"nav-tabs"
						]
					}]
				},
				TABS_CONTENT_CONTAINER: {
					type: "container_stack",
					value: [{
						name: "static_classes",
						value: ["tab-content"]
					}]
				}
			}
		},
		real_class: "Tabs",
		is_extended: false
	},
	Tooltip: {
		type: "widget",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Default",
		template: [
			"\r\n\t\t\t",
			{
				type: "view",
				"class": "Expression",
				argument: {
					evaluator: function() {
return (this._binds[0].getValue());
},
					flags: {isScopeEval: true},
					binds: [{
						locator_type: "Name",
						locator: "tooltip",
						tail: ["html"]
					}]
				},
				container: {
					"class": "Element",
					tag_name: "div",
					static_classes: ["tooltip-inner"]
				}
			},
			"\r\n\t\t\t<div class=\"tooltip-arrow\"></div>\r\n\t\t"
		],
		container: {
			"class": "Element",
			tag_name: "div",
			static_classes: ["tooltip"],
			style_bindings: {
				top: {
					evaluator: function() {
return ((this._binds[0].getValue() + this._binds[1].getValue()) + 'px');
},
					binds: [
						{
							locator_type: "Name",
							locator: "tooltip",
							tail: ["y"]
						},
						{
							locator_type: "Name",
							locator: "tooltip",
							tail: ["y_offset"]
						}
					]
				},
				left: {
					evaluator: function() {
return ((this._binds[0].getValue() + this._binds[1].getValue()) + 'px');
},
					binds: [
						{
							locator_type: "Name",
							locator: "tooltip",
							tail: ["x"]
						},
						{
							locator_type: "Name",
							locator: "tooltip",
							tail: ["x_offset"]
						}
					]
				}
			},
			class_bindings: {
				"0": {
					evaluator: function() {
return (this._binds[0].getValue() ? 'in' : 'hidden');
},
					binds: [{
						locator_type: "Name",
						locator: "tooltip",
						tail: ["is_visible"]
					}]
				}
			}
		},
		real_class: "Tooltip",
		is_extended: false
	},
	DropDown: {
		options: {target_class: "open"},
		real_class: "DropDown",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Default",
		is_extended: false
	},
	Tree: {
		type: "widget",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Default",
		template: [
			"\r\n\t\t\t\r\n\t\t\t\r\n\t\t\t",
			{
				type: "view",
				"class": "Foreach",
				argument: {
					evaluator: function() {
return (this._binds[0].getValue());
},
					flags: {isScopeEval: true},
					binds: [{
						locator_type: "Name",
						locator: "tree",
						tail: ["records"]
					}]
				},
				container: {"class": "Morph"},
				as: "node",
				template: [
					"\r\n\t\t\t\t",
					{
						locator_type: "Name",
						locator: "tree",
						name: "node",
						type: "include"
					},
					"\r\n\t\t\t"
				]
			},
			"\r\n\t\t"
		],
		container: {
			"class": "Element",
			tag_name: "div",
			resource_id: {
				locator_type: "Name",
				locator: "tree",
				name: "MAIN_TREE_CONTAINER"
			}
		},
		assigns: {
			pad: {
				evaluator: function() {
return ('');
},
				flags: {
					isStatic: true,
					isString: true
				}
			},
			level: {
				evaluator: function() {
return (0);
},
				flags: {
					isStatic: true,
					isNumber: true
				}
			}
		},
		includes: {
			node: [
				"\r\n\t\t",
				{
					locator_type: "Name",
					locator: "tree",
					name: "node_body",
					type: "include"
				},
				"\r\n\t\t",
				{
					locator_type: "Name",
					locator: "tree",
					name: "node_children",
					type: "include"
				},
				"\r\n\t"
			],
			node_body: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "View",
					container: {
						"class": "Element",
						tag_name: "div",
						static_classes: ["lava-tree-node"],
						static_properties: {unselectable: "on"},
						class_bindings: {
							"0": {
								evaluator: function() {
return ('level-' + this._binds[0].getValue());
},
								binds: [{property_name: "level"}]
							}
						}
					},
					template: [
						"\r\n\t\t\t",
						{
							type: "view",
							"class": "Expression",
							argument: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{property_name: "pad"}]
							},
							escape_off: true,
							template: []
						},
						{
							type: "view",
							"class": "View",
							container: {
								"class": "Element",
								tag_name: "i",
								static_classes: ["lava-tree-expander"],
								events: {
									click: [{
										locator_type: "Name",
										locator: "tree",
										name: "node_click",
										arguments: [{
											type: 2,
											data: {property_name: "node"}
										}]
									}]
								},
								class_bindings: {
									"0": {
										evaluator: function() {
return ('lava-tree' + ((this._binds[0].getValue() == this._binds[1].getValue() - 1) ? '-bottom' : '-middle') + ((this._binds[2].getValue() == 'folder' && this._binds[3].getValue()) ? (this._binds[4].getValue() ? '-expanded' : '-collapsed') : '-node'));
},
										binds: [
											{property_name: "foreach_index"},
											{
												locator_type: "Label",
												locator: "parent",
												property_name: "count"
											},
											{
												property_name: "node",
												tail: ["type"]
											},
											{
												property_name: "node",
												tail: [
													"children",
													"length"
												]
											},
											{
												locator_type: "Name",
												locator: "tree",
												isDynamic: true,
												property_name: "is_expanded"
											}
										]
									}
								}
							}
						},
						{
							locator_type: "Name",
							locator: "tree",
							name: "icon",
							type: "include"
						},
						"\r\n\t\t\t",
						{
							locator_type: "Name",
							locator: "tree",
							name: "node_title",
							type: "include"
						},
						"\r\n\t\t"
					]
				},
				"\r\n\t"
			],
			icon: [],
			node_children: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "If",
					argument: {
						evaluator: function() {
return (this._binds[0].getValue() && this._binds[1].getValue());
},
						binds: [
							{
								property_name: "node",
								tail: [
									"children",
									"length"
								]
							},
							{
								locator_type: "Name",
								locator: "tree",
								isDynamic: true,
								property_name: "is_expanded"
							}
						]
					},
					container: {
						"class": "Emulated",
						options: {placement: "after-previous"}
					},
					refresher: {"class": "Collapse"},
					assigns: {
						pad: {
							evaluator: function() {
return ((this._binds[0].getValue() == this._binds[1].getValue() - 1) ? this._binds[2].getValue() + '<div class="lava-tree-pad"></div>' : this._binds[3].getValue() + '<div class="lava-tree-pad-line"></div>');
},
							binds: [
								{property_name: "foreach_index"},
								{property_name: "count"},
								{property_name: "pad"},
								{property_name: "pad"}
							]
						},
						level: {
							evaluator: function() {
return (this._binds[0].getValue() + 1);
},
							binds: [{
								locator_type: "Label",
								locator: "parent",
								property_name: "level"
							}]
						}
					},
					template: [
						"\r\n\t\t\t\r\n\t\t\t\r\n\t\t\t\r\n\t\t\t\r\n\t\t\t",
						{
							type: "view",
							"class": "Foreach",
							argument: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									property_name: "node",
									tail: ["children"]
								}]
							},
							as: "node",
							template: [
								"\r\n\t\t\t\t\t",
								{
									locator_type: "Name",
									locator: "tree",
									name: "node",
									type: "include"
								},
								"\r\n\t\t\t\t"
							],
							container: {
								"class": "Element",
								tag_name: "div",
								static_classes: ["lava-tree-container"]
							}
						},
						"\r\n\t\t"
					]
				},
				"\r\n\t"
			],
			node_title: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "Expression",
					argument: {
						evaluator: function() {
return (this._binds[0].getValue());
},
						flags: {isScopeEval: true},
						binds: [{
							property_name: "node",
							tail: ["title"]
						}]
					},
					container: {
						"class": "Element",
						tag_name: "span",
						static_classes: ["lava-tree-text"],
						events: {
							click: [{
								locator_type: "Name",
								locator: "tree",
								name: "node_click",
								arguments: [{
									type: 2,
									data: {property_name: "node"}
								}]
							}]
						}
					}
				},
				"\r\n\t"
			]
		},
		resources: {
			"default": {
				MAIN_TREE_CONTAINER: {
					type: "container_stack",
					value: [{
						name: "add_classes",
						value: [
							"lava-tree",
							"lava-unselectable"
						]
					}]
				}
			}
		},
		real_class: "Tree",
		is_extended: false
	},
	Table: {
		type: "widget",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Default",
		template: [
			"\r\n\t\t\t",
			{
				locator_type: "Name",
				locator: "table",
				name: "thead",
				type: "include"
			},
			"\r\n\t\t\t",
			{
				locator_type: "Name",
				locator: "table",
				name: "tbody",
				type: "include"
			},
			"\r\n\t\t"
		],
		container: {
			"class": "Element",
			tag_name: "table",
			resource_id: {
				locator_type: "Name",
				locator: "table",
				name: "TABLE_ELEMENT"
			}
		},
		includes: {
			thead: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "View",
					container: {
						"class": "Element",
						tag_name: "thead",
						resource_id: {
							locator_type: "Name",
							locator: "table",
							name: "THEAD_ELEMENT"
						}
					},
					template: [
						"\r\n\t\t\t",
						{
							type: "view",
							"class": "Foreach",
							argument: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									locator_type: "Name",
									locator: "table",
									tail: ["_columns"]
								}]
							},
							as: "column",
							template: [
								"\r\n\t\t\t\t\t",
								{
									type: "view",
									"class": "View",
									container: {
										"class": "Element",
										tag_name: "td",
										events: {
											click: [{
												locator_type: "Name",
												locator: "table",
												name: "column_header_click",
												arguments: [{
													type: 2,
													data: {property_name: "column"}
												}]
											}]
										}
									},
									template: [
										"\r\n\t\t\t\t\t\t",
										{
											type: "view",
											"class": "Expression",
											argument: {
												evaluator: function() {
return (this._binds[0].getValue());
},
												flags: {isScopeEval: true},
												binds: [{
													property_name: "column",
													tail: ["title"]
												}]
											},
											container: {
												"class": "Element",
												tag_name: "span",
												class_bindings: {
													"0": {
														evaluator: function() {
return (this._binds[0].getValue() == this._binds[1].getValue() ? ('lava-column-sort-' + (this._binds[2].getValue() ? 'de' : 'a') + 'scending') : '');
},
														binds: [
															{
																property_name: "column",
																tail: ["name"]
															},
															{property_name: "_sort_column_name"},
															{
																locator_type: "Name",
																locator: "table",
																tail: ["_sort_descending"]
															}
														]
													}
												}
											}
										},
										"\r\n\t\t\t\t\t"
									]
								},
								"\r\n\t\t\t\t"
							],
							container: {
								"class": "Element",
								tag_name: "tr"
							}
						},
						"\r\n\t\t"
					]
				},
				"\r\n\t"
			],
			tbody: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "Foreach",
					argument: {
						evaluator: function() {
return (this._binds[0].getValue());
},
						flags: {isScopeEval: true},
						binds: [{
							locator_type: "Name",
							locator: "table",
							tail: ["records"]
						}]
					},
					as: "row",
					template: [
						"\r\n\t\t\t\t",
						{
							type: "view",
							"class": "Foreach",
							argument: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									locator_type: "Name",
									locator: "table",
									tail: ["_columns"]
								}]
							},
							as: "column",
							template: [
								"\r\n\t\t\t\t\t\t",
								{
									type: "view",
									"class": "View",
									container: {
										"class": "Element",
										tag_name: "td"
									},
									template: [
										"\r\n\t\t\t\t\t\t\t",
										{
											locator_type: "Name",
											locator: "table",
											name: "cell",
											arguments: [{
												type: 2,
												data: {property_name: "column"}
											}],
											type: "include"
										},
										"\r\n\t\t\t\t\t\t"
									]
								},
								"\r\n\t\t\t\t\t"
							],
							container: {
								"class": "Element",
								tag_name: "tr"
							}
						},
						"\r\n\t\t\t"
					],
					container: {
						"class": "Element",
						tag_name: "tbody",
						resource_id: {
							locator_type: "Name",
							locator: "table",
							name: "TBODY_ELEMENT"
						}
					}
				},
				"\r\n\t"
			]
		},
		storage: {
			cells: {
				type: "template_hash",
				schema: {
					type: "template_hash",
					tag_name: "template",
					name: "cells"
				},
				value: {
					String: [
						"\r\n\t\t\t\t",
						{
							type: "view",
							"class": "Expression",
							argument: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									property_name: "row",
									tail: [{
										property_name: "column",
										tail: ["name"]
									}]
								}]
							}
						},
						"\r\n\t\t\t"
					],
					Boolean: [
						"\r\n\t\t\t\t",
						{
							type: "view",
							"class": "Expression",
							argument: {
								evaluator: function() {
return (this._callGlobalModifier("translateBoolean", [!! this._binds[0].getValue()]));
},
								flags: {hasGlobalModifiers: true},
								binds: [{
									property_name: "row",
									tail: [{
										property_name: "column",
										tail: ["name"]
									}]
								}]
							}
						},
						"\r\n\t\t\t"
					]
				}
			}
		},
		resources: {
			"default": {
				TABLE_ELEMENT: {
					type: "container_stack",
					value: [{
						name: "static_properties",
						value: {
							cellspacing: "0",
							cellpadding: "0"
						}
					}]
				}
			}
		},
		real_class: "Table",
		is_extended: false
	},
	Calendar: {
		type: "widget",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Default",
		template: [
			"\r\n\t\t\t",
			{
				type: "view",
				"class": "If",
				argument: {
					evaluator: function() {
return (this._binds[0].getValue() == 'days');
},
					binds: [{
						locator_type: "Name",
						locator: "calendar",
						tail: ["_selected_view"]
					}]
				},
				template: [
					"\r\n\t\t\t\t",
					{
						locator_type: "Name",
						locator: "calendar",
						name: "days_view",
						type: "include"
					},
					"\r\n\t\t\t"
				],
				else_template: [
					"\r\n\t\t\t\t",
					{
						locator_type: "Name",
						locator: "calendar",
						name: "months_view",
						type: "include"
					},
					"\r\n\t\t\t"
				]
			},
			"\r\n\t\t"
		],
		container: {
			"class": "Element",
			tag_name: "div",
			static_classes: ["lava-calendar"]
		},
		includes: {
			days_view: [
				"\r\n\t\t<div class=\"lava-calendar-header\">\r\n\t\t\t",
				{
					type: "view",
					"class": "View",
					container: {
						"class": "Element",
						tag_name: "a",
						static_classes: ["lava-calendar-left-arrow"],
						static_properties: {href: "#"},
						events: {
							click: [{
								locator_type: "Name",
								locator: "calendar",
								name: "previous_month_click"
							}]
						}
					},
					template: ["&#9664;"]
				},
				"\r\n\t\t\t",
				{
					type: "view",
					"class": "Expression",
					argument: {
						evaluator: function() {
return (this._binds[0].getValue());
},
						flags: {isScopeEval: true},
						binds: [{
							locator_type: "Name",
							locator: "calendar",
							tail: ["_month_year_string"]
						}]
					},
					container: {
						"class": "Element",
						tag_name: "a",
						static_classes: ["lava-calendar-days-view-month-name"],
						static_properties: {href: "#"},
						events: {
							click: [{
								locator_type: "Name",
								locator: "calendar",
								name: "days_view_month_name_click"
							}]
						}
					}
				},
				"\r\n\t\t\t",
				{
					type: "view",
					"class": "View",
					container: {
						"class": "Element",
						tag_name: "a",
						static_classes: ["lava-calendar-right-arrow"],
						static_properties: {href: "#"},
						events: {
							click: [{
								locator_type: "Name",
								locator: "calendar",
								name: "next_month_click"
							}]
						}
					},
					template: ["&#9654;"]
				},
				"\r\n\t\t</div>\r\n\t\t<div class=\"lava-calendar-center\">\r\n\t\t\t",
				{
					locator_type: "Name",
					locator: "calendar",
					name: "months",
					type: "include"
				},
				"\r\n\t\t</div>\r\n\t\t<div class=\"lava-calendar-footer\">\r\n\t\t\t",
				{
					type: "view",
					"class": "Expression",
					argument: {
						evaluator: function() {
return (this._binds[0].getValue());
},
						flags: {isScopeEval: true},
						binds: [{
							locator_type: "Name",
							locator: "calendar",
							tail: ["_today_string"]
						}]
					},
					container: {
						"class": "Element",
						tag_name: "a",
						static_classes: ["lava-calendar-today-link"],
						static_properties: {href: "#"},
						events: {
							click: [{
								locator_type: "Name",
								locator: "calendar",
								name: "today_click"
							}]
						}
					}
				},
				"\r\n\t\t</div>\r\n\t"
			],
			months_view: [
				"\r\n\t\t<div class=\"lava-calendar-header\">\r\n\t\t\t",
				{
					type: "view",
					"class": "View",
					container: {
						"class": "Element",
						tag_name: "a",
						static_classes: ["lava-calendar-left-arrow"],
						static_properties: {href: "#"},
						events: {
							click: [{
								locator_type: "Name",
								locator: "calendar",
								name: "previous_year_click"
							}]
						}
					},
					template: ["&#9664;"]
				},
				"\r\n\t\t\t",
				{
					roles: [{
						locator_type: "Name",
						locator: "calendar",
						name: "_year_input"
					}],
					"extends": "TextInput",
					assigns: {
						value: {
							evaluator: function() {
return (this._binds[0].getValue() + '');
},
							binds: [{
								locator_type: "Name",
								locator: "calendar",
								tail: ["_displayed_year"]
							}]
						}
					},
					"class": "Lava.WidgetConfigExtensionGateway",
					extender_type: "Default",
					resource_id: {
						locator_type: "Name",
						locator: "calendar",
						name: "year_input"
					},
					type: "widget"
				},
				"\r\n\t\t\t",
				{
					type: "view",
					"class": "View",
					container: {
						"class": "Element",
						tag_name: "a",
						static_classes: ["lava-calendar-right-arrow"],
						static_properties: {href: "#"},
						events: {
							click: [{
								locator_type: "Name",
								locator: "calendar",
								name: "next_year_click"
							}]
						}
					},
					template: ["&#9654;"]
				},
				"\r\n\t\t</div>\r\n\t\t<div class=\"lava-calendar-center\">\r\n\t\t\t",
				{
					locator_type: "Name",
					locator: "calendar",
					name: "month_names",
					type: "include"
				},
				"\r\n\t\t</div>\r\n\t"
			],
			months: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "Foreach",
					argument: {
						evaluator: function() {
return (this._binds[0].getValue());
},
						flags: {isScopeEval: true},
						binds: [{
							locator_type: "Name",
							locator: "calendar",
							tail: ["_months"]
						}]
					},
					as: "month",
					template: [
						"\r\n\t\t\t<table class=\"lava-calendar-month\" cellspacing=\"0\" cellpadding=\"0\">\r\n\t\t\t\t<thead>\r\n\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t",
						{
							type: "view",
							"class": "Foreach",
							argument: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									locator_type: "Name",
									locator: "calendar",
									tail: ["_weekdays"]
								}]
							},
							as: "weekday",
							template: [
								"\r\n\t\t\t\t\t\t\t<td>",
								{
									type: "view",
									"class": "Expression",
									argument: {
										evaluator: function() {
return (this._binds[0].getValue());
},
										flags: {isScopeEval: true},
										binds: [{
											property_name: "weekday",
											tail: ["title"]
										}]
									}
								},
								"</td>\r\n\t\t\t\t\t\t"
							]
						},
						"\r\n\t\t\t\t\t</tr>\r\n\t\t\t\t</thead>\r\n\t\t\t\t<tbody>\r\n\t\t\t\t\t",
						{
							type: "view",
							"class": "Foreach",
							argument: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									property_name: "month",
									tail: ["weeks"]
								}]
							},
							as: "week",
							template: [
								"\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t",
								{
									type: "view",
									"class": "Foreach",
									argument: {
										evaluator: function() {
return (this._binds[0].getValue());
},
										flags: {isScopeEval: true},
										binds: [{property_name: "week"}]
									},
									as: "day",
									template: [
										"\r\n\t\t\t\t\t\t\t\t",
										{
											locator_type: "Name",
											locator: "calendar",
											name: "day",
											type: "include"
										},
										"\r\n\t\t\t\t\t\t\t"
									]
								},
								"\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t"
							]
						},
						"\r\n\t\t\t\t</tbody>\r\n\t\t\t</table>\r\n\t\t"
					]
				},
				"\r\n\t"
			],
			day: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "View",
					container: {
						"class": "Element",
						tag_name: "td",
						events: {
							mousedown: [{
								locator_type: "Name",
								locator: "calendar",
								name: "day_click",
								arguments: [{
									type: 2,
									data: {property_name: "day"}
								}]
							}]
						},
						class_bindings: {
							"0": {
								evaluator: function() {
return (this._binds[0].getValue() ? 'lava-calendar-today' : '');
},
								binds: [{
									property_name: "day",
									tail: ["is_today"]
								}]
							},
							"1": {
								evaluator: function() {
return ((this._binds[0].getValue() != this._binds[1].getValue()) ? 'lava-calendar-other-month-day' : '');
},
								binds: [
									{
										property_name: "month",
										tail: ["index"]
									},
									{
										property_name: "day",
										tail: ["month"]
									}
								]
							},
							"2": {
								evaluator: function() {
return ((this._binds[0].getValue() >= this._binds[1].getValue() && this._binds[2].getValue() <= this._binds[3].getValue()) ? 'lava-calendar-selected-day' : '');
},
								binds: [
									{
										property_name: "day",
										tail: ["milliseconds"]
									},
									{
										locator_type: "Name",
										locator: "calendar",
										tail: ["_selection_start"]
									},
									{
										property_name: "day",
										tail: ["milliseconds"]
									},
									{
										locator_type: "Name",
										locator: "calendar",
										tail: ["_selection_end"]
									}
								]
							}
						}
					},
					template: [
						"\r\n\t\t\t",
						{
							type: "view",
							"class": "Expression",
							argument: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									property_name: "day",
									tail: ["day"]
								}]
							}
						},
						"\r\n\t\t"
					]
				},
				"\r\n\t"
			],
			month_names: [
				"\r\n\t\t<table class=\"lava-calendar-month-names\">\r\n\t\t\t<tbody>\r\n\t\t\t\t",
				{
					type: "view",
					"class": "Foreach",
					argument: {
						evaluator: function() {
return (this._binds[0].getValue());
},
						flags: {isScopeEval: true},
						binds: [{
							locator_type: "Name",
							locator: "calendar",
							tail: ["_month_descriptor_rows"]
						}]
					},
					as: "row",
					template: [
						"\r\n\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t",
						{
							type: "view",
							"class": "Foreach",
							argument: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{property_name: "row"}]
							},
							as: "descriptor",
							template: [
								"\r\n\t\t\t\t\t\t\t",
								{
									type: "view",
									"class": "Expression",
									argument: {
										evaluator: function() {
return (this._binds[0].getValue());
},
										flags: {isScopeEval: true},
										binds: [{
											property_name: "descriptor",
											tail: ["title"]
										}]
									},
									container: {
										"class": "Element",
										tag_name: "td",
										events: {
											click: [{
												name: "month_click",
												arguments: [{
													type: 2,
													data: {property_name: "descriptor"}
												}]
											}]
										},
										class_bindings: {
											"0": {
												evaluator: function() {
return (this._binds[0].getValue() == this._binds[1].getValue() ? 'lava-calendar-month-selected' : (this._binds[2].getValue() == this._binds[3].getValue() ? 'lava-calendar-month-current' : ''));
},
												binds: [
													{
														locator_type: "Name",
														locator: "calendar",
														tail: ["_displayed_month"]
													},
													{
														property_name: "descriptor",
														tail: ["index"]
													},
													{
														locator_type: "Name",
														locator: "calendar",
														tail: ["_current_month"]
													},
													{
														property_name: "descriptor",
														tail: ["index"]
													}
												]
											}
										}
									}
								},
								"\r\n\t\t\t\t\t\t"
							]
						},
						"\r\n\t\t\t\t\t</tr>\r\n\t\t\t\t"
					]
				},
				"\r\n\t\t\t</tbody>\r\n\t\t</table>\r\n\t"
			]
		},
		resources: {
			"default": {
				year_input: {
					type: "component",
					value: {
						TEXT_INPUT_ELEMENT: {
							type: "container_stack",
							value: [
								{
									name: "add_properties",
									value: {maxlength: "5"}
								},
								{
									name: "add_classes",
									value: ["lava-calendar-year-input"]
								}
							]
						}
					}
				}
			}
		},
		options: {invalid_input_class: "lava-calendar-input-invalid"},
		real_class: "Calendar",
		is_extended: false
	}
};
Lava.sugar_map = {
	checkbox: {widget_title: "CheckBox"},
	text_area: {widget_title: "TextArea"},
	text_input: {widget_title: "TextInput"},
	radio: {widget_title: "Radio"},
	submit_input: {widget_title: "SubmitInput"},
	submit_button: {widget_title: "SubmitButton"},
	collapsible: {widget_title: "Collapsible"},
	"collapsible-panel": {widget_title: "CollapsiblePanel"},
	"collapsible-panel-ext": {widget_title: "CollapsiblePanelExt"},
	accordion: {widget_title: "Accordion"},
	tabs: {widget_title: "Tabs"}
};
