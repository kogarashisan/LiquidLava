
Lava.define(
'Lava.system.Serializer',
/**
 * Pretty-print any JavaScript object into string, which can be eval()'ed to reconstruct original object
 * @lends Lava.system.Serializer#
 */
{

	Shared: ['_complex_types', '_callback_map'],

	/**
	 * Used to pretty-print values in objects
	 * @type {Object.<string, true>}
	 */
	_complex_types: {
		array: true,
		'object': true,
		'function': true,
		regexp: true
	},

	/**
	 * Concrete serializers for each value type
	 * @type {Object.<string, string>}
	 */
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

	/**
	 * If you know that you serialize objects with only valid property names (all characters are alphanumeric),
	 * you may turn this off
	 * @define {boolean}
	 */
	_check_property_names: true,

	/**
	 * String, used to pad serialized objects for pretty-printing
	 * @type {string}
	 */
	_pad: '\t',

	/**
	 * Create Serializer instance
	 * @param {?_cSerializer} config
	 */
	init: function(config) {

		if (config) {
			if (config.check_property_names === false) this._check_property_names = false;
		}

		this._serializeFunction = (config && config.pretty_print_functions)
			? this._serializeFunction_PrettyPrint
			: this._serializeFunction_Normal

	},

	/**
	 * Serialize any value
	 * @param {*} value
	 * @returns {string}
	 */
	serialize: function(value) {

		return this._serializeValue(value, '');

	},

	/**
	 * Perform value serialization
	 * @param {*} value
	 * @param {string} padding The initial padding for JavaScript code
	 * @returns {string}
	 */
	_serializeValue: function(value, padding) {

		var type = Firestorm.getType(value),
			result;

		if (Lava.schema.DEBUG && !(type in this._callback_map)) Lava.t("Unsupported type for serialization: " + type);

		result = this[this._callback_map[type]](value, padding);

		return result;

	},

	/**
	 * Perform serialization of an array
	 * @param {Array} data
	 * @param {string} padding
	 * @returns {string}
	 */
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

	/**
	 * Turn a string into it's JavaScript representation
	 * @param {string} data
	 * @returns {string}
	 */
	_serializeString: function(data) {

		return Firestorm.String.quote(data);

	},

	/**
	 * Serialize an object
	 * @param {Object} data
	 * @param {string} padding
	 * @returns {string}
	 */
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
		// 1) if object has something in it then 'is_empty' will be set to false
		// 2) if there is only one property in it, then 'only_key' will contain it's name
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

	/**
	 * Serialize one key-value pair in an object
	 * @param {string} name
	 * @param {*} value
	 * @param {string} padding
	 * @returns {string}
	 */
	_serializeObjectProperty: function(name, value, padding) {

		var type = Firestorm.getType(value);

		// if you serialize only Lava configs, then most likely you do not need this check,
		// cause the property names in configs are always valid.
		if (this._check_property_names && (!Lava.VALID_PROPERTY_NAME_REGEX.test(name) || Lava.JS_KEYWORDS.indexOf(name) != -1)) {

			name = Firestorm.String.quote(name);

		}

		return name + ': ' + this[this._callback_map[type]](value, padding);

	},

	/**
	 * Serialize a function. Default method, which is replaced in constructor.
	 * @param {function} data
	 * @returns {string}
	 */
	_serializeFunction: function(data) {

		Lava.t();

	},

	/**
	 * Serialize a function with exact source code.
	 * @param {function} data
	 * @returns {string}
	 */
	_serializeFunction_Normal: function(data) {

		var result = data + '';

		// when using new Function() constructor, it's automatically named 'anonymous' in Chrome && Firefox
		if (result.substr(0, 18) == 'function anonymous') {
			result = 'function' + result.substr(18);
		}

		return result;

	},

	/**
	 * Serialize function, then pad it's source code. Is not guaranteed to produce correct results,
	 * so may be used only for pretty-printing of source code for browser.
	 *
	 * @param {function} data
	 * @param {string} padding
	 * @returns {string}
	 */
	_serializeFunction_PrettyPrint: function(data, padding) {

		var result = this._serializeFunction_Normal(data),
			lines = result.split(/\r?\n/),
			last_line = lines[lines.length - 1],
			tabs,
			num_tabs,
			i = 1,
			count = lines.length;

		if (/^\t*\}$/.test(last_line)) {
			if (last_line.length > 1) { // if there are tabs
				tabs = last_line.substr(0, last_line.length - 1);
				num_tabs = tabs.length;
				for (; i < count; i++) {
					if (lines[i].indexOf(tabs) == 0) {
						lines[i] = lines[i].substr(num_tabs);
					}
				}
			}
			lines.pop();
			result = lines.join('\r\n\t' + padding) + '\r\n' + padding + last_line;
		}

		return result;

	},

	/**
	 * Turn a boolean into string
	 * @param {boolean} data
	 * @returns {string}
	 */
	_serializeBoolean: function(data) {

		return data.toString();

	},

	/**
	 * Turn a number into string
	 * @param {number} data
	 * @returns {string}
	 */
	_serializeNumber: function(data) {

		return data.toString();

	},

	/**
	 * Turn a regexp into string
	 * @param {RegExp} data
	 * @returns {string}
	 */
	_serializeRegexp: function(data) {

		return data.toString();

	},

	/**
	 * Return <str>"null"</str>
	 * @returns {string}
	 */
	_serializeNull: function() {

		return 'null';

	},

	/**
	 * Return <str>"undefined"</str>
	 * @returns {string}
	 */
	_serializeUndefined: function() {

		return 'undefined';

	}

});