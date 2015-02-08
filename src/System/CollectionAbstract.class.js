
/**
 * Values were removed from collection
 * @event Lava.system.CollectionAbstract#items_removed
 * @type {Object}
 * @property {Array.<number>} uids Unique IDs of values, internal to this instance
 * @property {array.<*>} values Values, that were removed
 * @property {Array.<string>} names Names (keys) of values that were removed
 */

/**
 * Fires when either content or order of items in collection changes
 * @event Lava.system.Enumerable#collection_changed
 */

Lava.define('Lava.system.CollectionAbstract',
/**
 * Base class for Enumerable, containing all methods, that do not require UID generation
 * @lends Lava.system.CollectionAbstract#
 * @extends Lava.mixin.Properties#
 */
{

	Extends: 'Lava.mixin.Properties',

	/**
	 * To tell other classes that this is instance of Enumerable
	 * @const
	 */
	isCollection: true,

	/**
	 * Unique identifiers for values, internal to this instance of enumerable. Note: they are not globally unique, just to this instance
	 * @type {Array.<number>}
	 */
	_data_uids: [],
	/**
	 * Values, stored in this Enumerable
	 * @type {Array.<*>}
	 */
	_data_values: [],
	/**
	 * Holds object keys, when Enumerable was constructed from object. Each name corresponds to it's value
	 * @type {Array.<string>}
	 */
	_data_names: [],
	/**
	 * Count of items in Enumerable instance
	 * @type {number}
	 */
	_count: 0,

	/**
	 * Global unique identifier of this instance
	 * @type {_tGUID}
	 */
	guid: null,

	/**
	 * Used in editing operations to set `_count` and fire changed events for <str>"length"</str> property
	 * @param {number} new_length
	 */
	_setLength: function(new_length) {

		this._count = new_length;
		this.firePropertyChangedEvents('length');

	},

	/**
	 * Does it have any items
	 * @returns {boolean} True if there are no items in collection
	 */
	isEmpty: function() {

		return this._count == 0;

	},

	/**
	 * Get current item count
	 * @returns {number} Get `_count`
	 */
	getCount: function() {

		return this._count;

	},

	/**
	 * The only supported property is <str>"length"</str>
	 * @param {string} name
	 * @returns {number} Returns `_count` for <str>"length"</str> property
	 */
	get: function(name) {

		return (name == 'length') ? this._count : null;

	},

	/**
	 * Get a copy of local UIDs array
	 * @returns {Array.<number>} `_data_uids`
	 */
	getUIDs: function() {

		// we need to copy the local array, to protect it from being altered outside of the class
		return this._data_uids.slice();

	},

	/**
	 * Get a copy of local values array
	 * @returns {Array.<*>} `_data_values`
	 */
	getValues: function() {

		return this._data_values.slice();

	},

	/**
	 * Get a copy of local names array
	 * @returns {Array.<string>} `_data_names`
	 */
	getNames: function() {

		return this._data_names.slice();

	},

	/**
	 * Create an object with [uid] => value structure
	 * @returns {Object.<number, *>} Object with local UIDs as keys and corresponding values
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
	 * Get an object with local UIDs as keys and their indices in local array as values.
	 * The result map is valid until any modification to Enumerable
	 * @returns {Object.<number, number>} An object with keys being collection's internal UIDs and their indices as values
	 */
	getUIDToIndexMap: function() {

		var result = {},
			i = 0;

		for (; i < this._count; i++) {

			result[this._data_uids[i]] = i;

		}

		return result;

	},

	/**
	 * Get the value, that corresponds to given UID
	 * @param {number} uid
	 * @returns {*}
	 */
	getValueByLocalUID: function(uid) {

		var index = this._data_uids.indexOf(uid);

		return (index != -1) ? this._data_values[index] : null;

	},

	/**
	 * Get UID at given `index`
	 * @param {number} index
	 * @returns {number} Requested UID
	 */
	getUIDAt: function(index) {

		return this._data_uids[index];

	},

	/**
	 * Get value at given `index`
	 * @param {number} index
	 * @returns {*} Requested value
	 */
	getValueAt: function(index) {

		return this._data_values[index];

	},

	/**
	 * Get name at given `index`
	 * @param {number} index
	 * @returns {string}
	 */
	getNameAt: function(index) {

		return this._data_names[index];

	},

	/**
	 * Does collection contain the `value`
	 * @param {*} value Value to search for
	 * @returns {boolean} <kw>true</kw>, if collection has given value
	 */
	containsValue: function(value) {

		return this._data_values.indexOf(value) != -1;

	},

	/**
	 * Does collection contain the given `uid`
	 * @param {number} uid
	 * @returns {boolean} <kw>true</kw>, if collection has given UID
	 */
	containsLocalUID: function(uid) {

		return this._data_uids.indexOf(uid) != -1;

	},

	/**
	 * Get index of given `value` in collection
	 * @param {*} value Value to search for
	 * @returns {number} Zero-based index of value in Enumerable, or -1, if value is not in array
	 */
	indexOfValue: function(value) {

		return this._data_values.indexOf(value);

	},

	/**
	 * Get index of given `uid` in the collection
	 * @param {number} uid Local UID to search for
	 * @returns {number} Zero-based index of uid in Enumerable, or -1, if uid is not in array
	 */
	indexOfUID: function(uid) {

		return this._data_uids.indexOf(uid);

	},

	/**
	 * Will throw exception. You can not set any properties to Enumerable instance
	 */
	set: function() {

		Lava.t('set on Enumerable is not permitted');

	},

	/**
	 * Remove a value from the end of the collection
	 * @returns {*} Removed value
	 */
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

	/**
	 * Removes the first occurrence of value within collection
	 *
	 * @param {*} value
	 * @returns {boolean} <kw>true</kw>, if the value existed
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

	/**
	 * Swap values, names and UIDs at given index. Does not generate {@link Lava.system.CollectionAbstract#event:items_removed}
	 * and {@link Lava.system.Enumerable#event:items_added} events, just {@link Lava.system.Enumerable#event:collection_changed}
	 * @param {number} index_a First index to swap
	 * @param {number} index_b Second index to swap
	 */
	swap: function(index_a, index_b) {

		if (index_a > this._count || index_b > this._count) Lava.t("Index is out of range (2)");

		var swap = Firestorm.Array.swap;

		swap(this._data_uids, index_a, index_b);
		swap(this._data_values, index_a, index_b);
		swap(this._data_names, index_a, index_b);

		this._fire('collection_changed');

	},

	/**
	 * Execute the `callback` for each item in collection
	 * @param {_tEnumerableEachCallback} callback
	 */
	each: function(callback) {

		// everything is copied in case the collection is modified during the cycle
		var values = this._data_values.slice(),
			uids = this._data_uids.slice(),
			names = this._data_names.slice(),
			i = 0,
			count = this._count;

		for (; i < count; i++) {

			if (callback(values[i], names[i], uids[i], i) === false) {
				break;
			}

		}

	},

	/**
	 * Pass each value to callback and leave only those, for which it has returned <kw>true</kw>.
	 * Remove the others
	 *
	 * @param {_tEnumerableFilterCallback} callback
	 */
	filter: function(callback) {

		var i = 0,
			count = this._count,
			result = this._createHelperStorage(),
			removed = this._createHelperStorage();

		for (; i < count; i++) {

			if (callback(this._data_values[i], this._data_names[i], this._data_uids[i], i)) {

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
	 * Sort items in collection
	 * @param {_tLessCallback} less A callback to compare items
	 * @param {string} [algorithm_name] The name of the sorting method from Lava.algorithms.sorting
	 */
	sort: function(less, algorithm_name) {

		this._sort(less || Lava.DEFAULT_LESS, this._data_values, algorithm_name);

	},

	/**
	 * Sort items by the array of names
	 * @param {_tLessCallback} less A callback to compare items
	 * @param {string} [algorithm_name] The name of the sorting method from {@link Lava.algorithms.sorting}
	 */
	sortByNames: function(less, algorithm_name) {

		this._sort(less || Lava.DEFAULT_LESS, this._data_names, algorithm_name);

	},

	/**
	 * Perform sorting
	 * @param {_tLessCallback} less A callback to compare items
	 * @param {Array} values
	 * @param {string} [algorithm_name]
	 */
	_sort: function(less, values, algorithm_name) {

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

		indices = Lava.algorithms.sorting[algorithm_name || Lava.schema.DEFAULT_STABLE_SORT_ALGORITHM](indices, _less);

		this.reorder(indices);

	},

	/**
	 * Sort items by premade array of new item indices
	 * @param {Array.<number>} new_indices
	 */
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

	/**
	 * Remove range of indices from collection and return removed values
	 * @param {number} start_index
	 * @param {number} count
	 * @returns {Array} Removed values
	 */
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

	/**
	 * Remove all values and return them
	 * @returns {Array} Values that were in collection
	 */
	removeAll: function() {

		return (this._count > 0) ? this.removeRange(0, this._count) : [];

	},

	/**
	 * Remove value at `index`
	 * @param {number} index Index to remove
	 * @returns {*} The removed value
	 */
	removeAt: function(index) {

		return this.removeRange(index, 1)[0];

	},

	/**
	 * Remove value from the beginning of collection
	 * @returns {*} The removed value
	 */
	shift: function() {

		return this.removeRange(0, 1)[0];

	},

	/**
	 * Create an internal helper object, which allows to write less code
	 * @returns {_cEnumerableHelperStorage} Helper object
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

	/**
	 * Take the temporary helper object, returned from {@link Lava.system.Enumerable#_createHelperStorage}
	 * and assign it's corresponding arrays to local arrays
	 * @param {_cEnumerableHelperStorage} storage Temporary helper object
	 */
	_assignStorage: function(storage) {

		this._data_uids = storage.uids;
		this._data_values = storage.values;
		this._data_names = storage.names;

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		this._fire('destroy');

	}

});