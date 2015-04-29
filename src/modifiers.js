/**
 * Global functions that are callable from templates
 */
Lava.modifiers = {

	/**
	 * Transform a string to lower case
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
			result = result[0].toUpperCase() + result.substr(1);
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

	/**
	 * Join an array of values
	 * @param {Array} array
	 * @param {string} glue
	 * @returns {string}
	 */
	joinArray: function(array, glue) {

		return array ? array.join(glue) : '';

	}

};