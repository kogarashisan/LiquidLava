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