/**
 * Global functions that are callable from templates
 */
Lava.modifiers = {

	ALLOWED_FILTERS: [
		'ucFirst',
		'capitalize',
		'hyphenate',
		'camelCase'
	],

	/**
	 * Join an array of values
	 * @param {Array} array
	 * @param {string} glue
	 * @returns {string}
	 */
	joinArray: function(array, glue) {

		return array ? array.join(glue) : '';

	},

	/**
	 * Apply a method from Firestorm.String
	 * @param {*} value
	 * @param {string} filter_name
	 */
	applyFilter: function(value, filter_name) {

		var result = '';

		if (Lava.schema.DEBUG && this.ALLOWED_FILTERS.indexOf(filter_name) == -1) {

			Lava.logWarning("Unknown filter in 'applyFilter' modifier: " + filter_name);

		} else {

			result = value ? Firestorm.String[filter_name](value + '') : '';

		}

		return result;

	}

};