
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