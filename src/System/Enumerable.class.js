
/**
 * Values were removed from collection
 * @event Lava.system.Enumerable#items_removed
 * @type {Object}
 * @property {Array.<number>} uids Unique IDs of values, internal to this instance
 * @property {array.<*>} values Values, that were removed
 * @property {Array.<string>} names Names (keys) of values that were removed
 */

/**
 * Values were added to collection
 * @event Lava.system.Enumerable#items_added
 * @type {Object}
 * @property {Array.<number>} uids Internal unique IDs that were generated for added values
 * @property {array.<*>} values Values, that were added
 * @property {Array.<string>} names Names (keys) of values that were added
 */

/**
 * Fires when either content or order of items in collection changes
 * @event Lava.system.Enumerable#collection_changed
 */

Lava.define(
'Lava.system.Enumerable',
/**
 * Array-like collection of elements, suitable for scope binding
 *
 * @lends Lava.system.Enumerable#
 * @extends Lava.mixin.Properties
 */
{

	Extends: 'Lava.mixin.Properties',

	/**
	 * To tell other classes that this is instance of Enumerable
	 * @const
	 */
	isEnumerable: true,
	/**
	 * Global unique identifier of this instance
	 * @type {_tGUID}
	 */
	guid: null,
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
	 * Object, from which this collection was constructed or refreshed
	 * @type {(Array|Object|Lava.mixin.Properties|Lava.system.Enumerable)}
	 */
	_source_object: null,
	/**
	 * The type of `_source_object`
	 * @type {Lava.ENUMERABLE_SOURCE_OBJECT_TYPES}
	 */
	_source_object_type: null,
	/**
	 * Count of items in Enumerable instance
	 * @type {number}
	 */
	_count: 0,
	/**
	 * Counter for next internal UID
	 * @type {number}
	 */
	_uid: 1,

	/**
	 * Creates Enumerable instance, sets `_source_object`
	 * @param {(Array|Object|Lava.mixin.Properties|Lava.system.Enumerable)} data_source What will become `_source_object`
	 */
	init: function(data_source) {

		this.guid = Lava.guid++;

		if (data_source) {

			var count = 0,
				i = 0;

			this.setSourceObject(data_source);

			if (this._source_object_type == Lava.ENUMERABLE_SOURCE_OBJECT_TYPES.ARRAY) {

				for (count = data_source.length; i < count; i++) {

					this._push(this._uid++, data_source[i], null);

				}

			} else if (this._source_object_type == Lava.ENUMERABLE_SOURCE_OBJECT_TYPES.ENUMERABLE) {

				this._data_names = data_source.getNames();
				this._data_values = data_source.getValues();
				this._data_uids = data_source.getUIDs();

			} else if (this._source_object_type == Lava.ENUMERABLE_SOURCE_OBJECT_TYPES.PROPERTIES) {

				this._initFromObject(data_source.getProperties());

			} else {

				this._initFromObject(data_source);

			}

			this._count = this._data_uids.length;

		}

	},

	/**
	 * If `_source_object` is an Object
	 * @param {Object} data_source
	 */
	_initFromObject: function(data_source) {

		for (var name in data_source) {

			this._push(this._uid++, data_source[name], name);

		}

	},

	/**
	 * Append the given uid, value and name to corresponding instance arrays: `_data_uids`, `_data_values` and `_data_names`
	 * @param {number} uid
	 * @param {*} value
	 * @param {string} name
	 */
	_push: function(uid, value, name) {

		this._data_uids.push(uid);
		this._data_values.push(value);
		this._data_names.push(name);

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
	 * Does it have `_source_object`
	 * @returns {boolean} True, if `_source_object` is not null
	 */
	hasSourceObject: function() {

		return this._source_object !== null;

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
	 * Used in editing operations to set `_count` and fire changed events for <str>"length"</str> property
	 * @param {number} new_length
	 */
	_setLength: function(new_length) {

		this._count = new_length;
		this.firePropertyChangedEvents('length');

	},

	/**
	 * Replace the corresponding `value` and `name` at specified `index`, generating a new UID
	 * @param {number} index Index of value in Enumerable
	 * @param {*} value New value for given index
	 * @param {number} [name] New name for the value
	 */
	replaceAt: function(index, value, name) {

		if (index > this._count) Lava.t("Index is out of range");

		var old_uid = this._data_uids[index],
			old_value = this._data_values[index],
			old_name = this._data_names[index],
			new_uid = this._uid++;

		this._data_uids[index] = new_uid;
		this._data_values[index] = value;
		if (name) {
			this._data_names[index] = name;
		}

		this._fire('items_removed', {
			uids: [old_uid],
			values: [old_value],
			names: [old_name]
		});

		this._fire('items_added', {
			uids: [new_uid],
			values: [value],
			names: [this._data_names[index]]
		});

		this._fire('collection_changed');

	},

	/**
	 * Swap values, names and UIDs at given index. Does not generate {@link Lava.system.Enumerable#event:items_removed}
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
	 * Add the name/value pair to the end of the collection, generating a new UID
	 * @param {*} value New value to add
	 * @param {string} [name] New name
	 * @returns {number} New collection `_count`
	 */
	push: function(value, name) {

		var count = this._count,
			new_uid = this._uid++;

		this._push(new_uid, value, name || null);

		this._setLength(count + 1);

		this._fire('items_added', {
			uids: [new_uid],
			values: [value],
			names: [name || null]
		});

		this._fire('collection_changed');

		return this._count; // after _setLength() this was incremented by one

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
	 * If value does not exist - push it into collection
	 * @param {*} value New value
	 * @param {string} [name] New name
	 * @returns {boolean} <kw>true</kw>, if value did not exist and was included
	 */
	includeValue: function(value, name) {

		var result = false,
			index = this._data_values.indexOf(value);

		if (index == -1) {
			this.push(value, name);
			result = true;
		}

		return result;

	},

	/**
	 * Set `_source_object`
	 * @param {(Array|Object|Lava.mixin.Properties|Lava.system.Enumerable)} data_source
	 */
	setSourceObject: function(data_source) {

		if (Lava.schema.DEBUG && typeof(data_source) != 'object') Lava.t("Wrong argument supplied for Enumerable constructor");
		this._source_object = data_source;
		this._source_object_type = Array.isArray(data_source)
			? Lava.ENUMERABLE_SOURCE_OBJECT_TYPES.ARRAY
			: (data_source.isEnumerable
				? Lava.ENUMERABLE_SOURCE_OBJECT_TYPES.ENUMERABLE
				: (data_source.isProperties
					? Lava.ENUMERABLE_SOURCE_OBJECT_TYPES.PROPERTIES
					: Lava.ENUMERABLE_SOURCE_OBJECT_TYPES.OBJECT));

	},

	/**
	 * Update the collection from `_source_object`: remove values, that are not in source object, and add new values
	 */
	updateFromSourceObject: function() {

		if (Lava.schema.DEBUG && !this._source_object) Lava.t("Enumerable was not created from object");

		switch (this._source_object_type) {
			case Lava.ENUMERABLE_SOURCE_OBJECT_TYPES.PROPERTIES:
				this._updateFromObject(this._source_object.getProperties());
				break;
			case Lava.ENUMERABLE_SOURCE_OBJECT_TYPES.OBJECT:
				this._updateFromObject(this._source_object);
				break;
			case Lava.ENUMERABLE_SOURCE_OBJECT_TYPES.ARRAY:
				this._updateFromArray(this._source_object);
				break;
			case Lava.ENUMERABLE_SOURCE_OBJECT_TYPES.ENUMERABLE:
				this._updateFromEnumerable(this._source_object);
				break;
			default:
				Lava.t();
		}

	},

	/**
	 * Update from `_source_object` version for arrays
	 * @param {Array} source_array
	 */
	_updateFromArray: function(source_array) {

		var new_count = source_array.length,
			count = (new_count < this._count) ? new_count : this._count,
			i = 0,
			uid,
			result = this._createHelperStorage(),
			removed = this._createHelperStorage(),
			added = this._createHelperStorage();

		for (; i < count; i++) {

			if (this._data_values[i] === source_array[i]) {
				result.push(this._data_uids[i], this._data_values[i], this._data_names[i]);
			} else {
				uid = this._uid++;
				added.push(uid, source_array[i], null);
				result.push(uid, source_array[i], null);
				removed.push(this._data_uids[i], this._data_values[i], this._data_names[i]);
			}

		}

		if (this._count < new_count) {

			for (i = this._count; i < new_count; i++) {

				uid = this._uid++;
				added.push(uid, source_array[i], null);
				result.push(uid, source_array[i], null);

			}

		} else {

			for (i = this._count; i < new_count; i++) {

				removed.push(this._data_uids[i], this._data_values[i], this._data_names[i]);

			}

		}

		this._assignStorage(result);
		this._setLength(this._data_uids.length);

		removed.uids.length && this._fire('items_removed', removed.getObject());
		added.uids.length && this._fire('items_added', added.getObject());
		this._fire('collection_changed');

	},

	/**
	 * Update from `_source_object` version for Enumerable
	 * @param {Lava.system.Enumerable} data_source
	 */
	_updateFromEnumerable: function(data_source) {

		var new_names = data_source.getNames(),
			new_values = data_source.getValues(),
			new_uids = data_source.getUIDs(),
			i,
			count,
			uid,
			old_uids_hash = {},
			new_uids_hash = {},
			removed = this._createHelperStorage(),
			added = this._createHelperStorage();

		for (i = 0, count = new_uids.length; i < count; i++) {
			new_uids_hash[new_uids[i]] = true;
		}

		for (i = 0, count = this._count; i < count; i++) {
			uid = this._data_uids[i];
			old_uids_hash[uid] = true;
			if (!(uid in new_uids_hash)) {
				removed.push(uid, this._data_values[i], this._data_names[i]);
			}
		}

		for (i = 0, count = new_uids.length; i < count; i++) {
			uid = new_uids[i];
			if (!(uid in old_uids_hash)) {
				added.push(uid, new_values[i], new_names[i]);
			}
		}

		this._data_names = new_names;
		this._data_values = new_values;
		this._data_uids = new_uids;
		this._setLength(this._data_uids.length);

		removed.uids.length && this._fire('items_removed', removed.getObject());
		added.uids.length && this._fire('items_added', added.getObject());
		this._fire('collection_changed');

	},

	/**
	 * Update from `_source_object` - version for objects
	 * @param {Object} source_object
	 */
	_updateFromObject: function(source_object) {

		var i = 0,
			name,
			uid,
			result = this._createHelperStorage(),
			removed = this._createHelperStorage(),
			added = this._createHelperStorage();

		for (; i < this._count; i++) {

			name = this._data_names[i];
			if (name in source_object) {

				if (source_object[name] === this._data_values[i]) {

					result.push(this._data_uids[i], this._data_values[i], this._data_names[i]);

				} else {

					// Attention: the name has NOT changed, but it will be present in both added and removed names!
					removed.push(this._data_uids[i], this._data_values[i], name);
					uid = this._uid++;
					result.push(uid, source_object[name], name);
					added.push(uid, source_object[name], name);

				}

			} else {

				removed.push(this._data_uids[i], this._data_values[i], this._data_names[i]);

			}

		}

		for (name in source_object) {

			if (this._data_names.indexOf(name) == -1) {

				uid = this._uid++;
				result.push(uid, source_object[name], name);
				added.push(uid, source_object[name], name);

			}

		}

		this._assignStorage(result);
		this._setLength(this._data_uids.length);

		removed.uids.length && this._fire('items_removed', removed.getObject());
		added.uids.length && this._fire('items_added', added.getObject());
		this._fire('collection_changed');

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

		this._sort(less, this._data_values, algorithm_name);

	},

	/**
	 * Sort items by the array of names
	 * @param {_tLessCallback} less A callback to compare items
	 * @param {string} [algorithm_name] The name of the sorting method from {@link Lava.algorithms.sorting}
	 */
	sortByNames: function(less, algorithm_name) {

		this._sort(less, this._data_names, algorithm_name);

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
	 * Insert a sequence of values into collection
	 * @param {number} start_index Index of the beginning of new values. Must be less or equal to collection's `_count`
	 * @param {Array.<*>} values New values
	 * @param [names] Names that correspond to each value
	 */
	insertRange: function(start_index, values, names) {

		if (start_index >= this._count) Lava.t("Index is out of range");

		var i = 0,
			count = values.length,
			added_uids = [],
			added_names = [];

		if (names) {

			if (count != names.length) Lava.t("If names array is provided, it must be equal length with values array.");
			added_names = names;

		} else {

			for (; i < count; i++) {

				added_names.push(null);

			}

		}

		for (; i < count; i++) {

			added_uids.push(this._uid++);

		}

		if (start_index == 0) {

			// prepend to beginning
			this._data_uids = added_uids.concat(this._data_uids);
			this._data_values = values.concat(this._data_values);
			this._data_names = added_names.concat(this._data_names);

		} else if (start_index == this._count - 1) {

			// append to the end
			this._data_uids = this._data_uids.concat(added_uids);
			this._data_values = this._data_values.concat(values);
			this._data_names = this._data_names.concat(added_names);

		} else {

			this._data_uids = this._data_uids.slice(0, start_index).concat(added_uids).concat(this._data_uids.slice(start_index));
			this._data_values = this._data_values.slice(0, start_index).concat(values).concat(this._data_values.slice(start_index));
			this._data_names = this._data_names.slice(0, start_index).concat(added_names).concat(this._data_names.slice(start_index));

		}

		this._setLength(this._count + count);

		this._fire('items_added', {
			uids: added_uids,
			values: values,
			names: added_names
		});

		this._fire('collection_changed');

	},

	/**
	 * Append new values to the end of the collection
	 * @param {Array.<*>} values New values
	 * @param {Array.<string>} [names] Corresponding names
	 */
	append: function(values, names) {

		this.insertRange(this._count, values, names);

	},

	/**
	 * Remove all values and return them
	 * @returns {Array} Values that were in collection
	 */
	removeAll: function() {

		return (this._count > 0) ? this.removeRange(0, this._count) : [];

	},

	/**
	 * Insert a value at index
	 * @param {number} index Index to insert at
	 * @param {*} value New value
	 * @param {string} [name] New name
	 */
	insertAt: function(index, value, name) {

		this.insertRange(index, [value], [name]);

	},

	/**
	 * Put the value at the beginning of collection
	 * @param {*} value New value
	 * @param {string} [name] New name
	 */
	unshift: function(value, name) {

		this.insertRange(0, [value], [name]);

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
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		this._fire('destroy');

	}

});