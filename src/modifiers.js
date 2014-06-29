
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