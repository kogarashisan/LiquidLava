
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
	 * Characters that nust be escaped in HTML attributes
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

	}

};