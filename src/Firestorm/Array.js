

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

		var index = array.indexOf(old_value);
		if (index == -1) Firestorm.t("Array.replace: value is not in array");
		array[index] = new_value;

	}

};