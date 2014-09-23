
/**
 * Collection of methods to manipulate objects
 */
Firestorm.Object = {

	/**
	 * Return true for object with no properties, and false otherwise
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