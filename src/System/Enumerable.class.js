
Lava.define(
'Lava.system.Enumerable',
/**
 * @lends Lava.system.Enumerable#
 * @extends Lava.mixin.Properties
 */
{

	Implements: 'Lava.mixin.Properties',

	isEnumerable: true,

	guid: null,

	_data_uids: [], // [index] => uid
	_data_values: [], // [index] => value
	// will hold keys, when Enumerable was constructed from object
	_data_names: [], // [index] => name
	_source_object: null,
	_count: 0,

	_uid: 1,

	init: function(data_source) {

		this.guid = Lava.guid++;

		if (data_source) {

			var count = 0,
				i = 0,
				name;

			if (Array.isArray(data_source)) {

				count = data_source.length;

				for (; i < count; i++) {

					this._push(this._uid++, data_source[i], null);

				}

			} else if (typeof(data_source) == 'object') {

				for (name in data_source) {

					if (data_source.hasOwnProperty(name)) {

						this._push(this._uid++, data_source[name], name)

					}

					count++;

				}

				this._source_object = data_source;

			} else {

				Lava.t("Wrong argument supplied for Enumerable constructor");

			}

			this._count = count;

		}

	},

	_push: function(uid, value, name) {

		this._data_uids.push(uid);
		this._data_values.push(value);
		this._data_names.push(name);

	},

	_assignStorage: function(storage) {

		this._data_uids = storage.uids;
		this._data_values = storage.values;
		this._data_names = storage.names;

	},

	hasSourceObject: function() {

		return this._source_object !== null;

	},

	isEmpty: function() {

		return this._count == 0;

	},

	getCount: function() {

		return this._count;

	},

	get: function(name) {

		var result;

		if (name == 'length') {

			result = this._count;

		} else {

			if (Lava.schema.DEBUG && !/^\d+$/.test(name)) Lava.t("Enumerable: invalid index (1)");

			result = this.getValueAt(+name); // convert to integer

		}

		return result;

	},

	getLocalUIDs: function() {

		// we need to copy the local array, to protect it from being altered outside of the class
		return this._data_uids.slice();

	},

	getValues: function() {

		return this._data_values.slice();

	},

	getNames: function() {

		return this._data_names.slice();

	},

	/**
	 * Create an object with [uid] => value structure
	 * @returns {{}}
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
	 * Warning: this map may change with any operation
	 * @returns {{}} An object with keys being collection's internal UIDs and array indexes as values.
	 */
	getUIDToIndexMap: function() {

		var result = {},
			i = 0;

		for (; i < this._count; i++) {

			result[this._data_uids[i]] = i;

		}

		return result;

	},

	getValueByLocalUID: function(uid) {

		var index = this._data_uids.indexOf(uid);

		return (index != -1) ? this._data_values[index] : null;

	},

	getUIDAt: function(index) {

		return this._data_uids[index];

	},

	getValueAt: function(index) {

		return this._data_values[index];

	},

	getNameAt: function(index) {

		return this._data_names[index];

	},

	contains: function(value) {

		var i = 0,
			result = false;

		for (; i < this._count; i++) {

			if (this._data_values[i] === value) {
				result = true;
				break;
			}

		}

		return result;

	},

	containsLocalUID: function(uid) {

		return this._data_uids.indexOf(uid) != -1;

	},

	indexOfValue: function(value) {

		return this._data_values.indexOf(value);

	},

	indexOfUID: function(uid) {

		return this._data_uids.indexOf(uid);

	},

	set: function(name, value) {

		if (Lava.schema.DEBUG && !/^\d+$/.test(name)) Lava.t("Enumerable: invalid index (2)");

		this.replaceAt(+name, value); // '+' to convert to integer

	},

	_setLength: function(new_length) {

		this._count = new_length;
		this.firePropertyChangedEvents('length');

	},

	replaceAt: function(index, value, name) {

		if (index > this._count) Lava.t("Index is out of range");

		var old_uid = this._data_uids[index],
			old_value = this._data_values[index],
			old_name = this._data_names[index],
			new_uid = this._uid++;

		this._data_uids[index] = new_uid;
		this._data_values[index] = value;
		this._data_names[index] = name || null;

		this._fire('index_changed', {index: index});
		this._firePropertyChanged(index);

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

	swap: function(index_a, index_b) {

		if (index_a > this._count || index_b > this._count) Lava.t("Index is out of range (2)");

		var swap = Firestorm.Array.swap;

		swap(this._data_uids, index_a, index_b);
		swap(this._data_values, index_a, index_b);
		swap(this._data_names, index_a, index_b);

		this._fire('index_changed', {index: index_a});
		this._firePropertyChanged(index_a);

		this._fire('index_changed', {index: index_b});
		this._firePropertyChanged(index_b);

		this._fire('collection_changed');

	},

	push: function(value, name) {

		var count = this._count,
			new_uid = this._uid++;

		this._push(new_uid, value, name || null);

		this._setLength(count + 1);
		this._firePropertyChanged(count);
		this._fire('index_changed', {index: count});

		this._fire('items_added', {
			uids: [new_uid],
			values: [value],
			names: [name || null]
		});

		this._fire('collection_changed');

		return this._count; // after _setLength() this was incremented by one

	},

	pop: function() {

		var old_uid = this._data_uids.pop(),
			old_value = this._data_values.pop(),
			old_name = this._data_names.pop(),
			count = this._count - 1;

		this._setLength(count);
		this._firePropertyChanged(count); // index
		this._fire('index_changed', {index: count});

		this._fire('items_removed', {
			uids: [old_uid],
			values: [old_value],
			names: [old_name]
		});

		this._fire('collection_changed');

		return old_value;
	},

	each: function(callback) {

		// everything is copied in case the collection gets modified during the cycle
		var values = this._data_values.slice(),
			uids = this._data_uids.slice(),
			names = this._data_names.slice(),
			i = 0,
			count = this._count;

		for (; i < count; i++) {

			if (callback(values[i], uids[i], names[i], i) === false) {
				break;
			}

		}

	},

	_fireChangedEvents: function(start_index, limit) {

		var i;

		if (!Firestorm.Object.isEmpty(this._property_listeners)) {

			for (i = start_index; i < limit; i++) {

				this._firePropertyChanged(i);

			}

		}

		if (this._listeners['index_changed'] != null) {

			for (i = start_index; i < limit; i++) {

				this._fire('index_changed', {index: i});

			}

		}

	},

	/**
	 * Removes the first occurrence of value within collection.
	 *
	 * @param {*} value
	 * @returns {boolean} Whether the value existed.
	 */
	remove: function(value) {

		var i = 0,
			result = false;

		for (; i < this._count; i++) {

			if (this._data_values[i] === value) {
				this.removeAt(i);
				result = true;
				break;
			}

		}

		return result;

	},

	updateFromSourceObject: function(new_source_object) {

		if (!this._source_object) Lava.t("Enumerable was not created from object");

		var i = 0,
			name,
			uid,
			count,
			result = this._createHelperStorage(),
			removed = this._createHelperStorage(),
			added = this._createHelperStorage();

		if (new_source_object) {

			this._source_object = new_source_object;

		}

		for (; i < this._count; i++) {

			name = this._data_names[i];
			if (name in this._source_object) {

				if (this._source_object[name] === this._data_values[i]) {

					result.push(this._data_uids[i], this._data_values[i], this._data_names[i]);

				} else {

					// Attention: the name has NOT changed, but it will be present in both added and removed names!
					removed.push(this._data_uids[i], this._data_values[i], name);
					uid = this._uid++;
					result.push(uid, this._source_object[name], name);
					added.push(uid, this._source_object[name], name);

				}

			} else {

				removed.push(this._data_uids[i], this._data_values[i], this._data_names[i]);

			}

		}

		for (name in this._source_object) {

			if (this._data_names.indexOf(name) == -1) {

				uid = this._uid++;
				result.push(uid, this._source_object[name], name);
				added.push(uid, this._source_object[name], name);

			}

		}

		count = this._count;
		this._assignStorage(result);
		this._setLength(this._data_uids.length);
		this._fireChangedEvents(0, (count > this._count) ? count : this._count);

		this._fire('items_removed', removed.getObject());
		this._fire('items_added', added.getObject());
		this._fire('collection_changed');

	},

	/**
	 * Accepts a function with the following parameters:
	 * function(value, uid, name, index)
	 * Callback must return TRUE if element needs to stay in the collection, otherwise it will be removed.
	 *
	 * @param {function(*, number, string, number)} callback
	 */
	filter: function(callback) {

		var i = 0,
			count = this._count,
			result = this._createHelperStorage(),
			removed = this._createHelperStorage();

		for (; i < count; i++) {

			if (callback(this._data_values[i], this._data_uids[i], this._data_names[i], i)) {

				result.push(this._data_uids[i], this._data_values[i], this._data_names[i]);

			} else {

				removed.push(this._data_uids[i], this._data_values[i], this._data_names[i]);

			}

		}

		count = this._count;
		this._assignStorage(result);
		this._setLength(this._data_uids.length);
		this._fireChangedEvents(0, (count > this._count) ? count : this._count);

		if (removed.uids.length) {

			this._fire('items_removed', removed.getObject());

		}

		this._fire('collection_changed');

	},

	/**
	 * @param {function(*, *):boolean} [less] A callback to compare items
	 * @param {string} [algorithm] The name of the sorting method from Lava.algorithms.sorting
	 */
	sort: function(less, algorithm) {

		var indices = [],
			i = 0,
			_less,
			values = this._data_values;

		_less = function(a, b) {

			// a and b are indices, not actual values
			return less(values[a], values[b]);

		};

		for (; i < this._count; i++) {

			indices.push(i);

		}

		indices = Lava.algorithms.sorting[algorithm || Lava.schema.data.DEFAULT_SORT_ALGORITHM](indices, _less);

		this.reorder(indices);

	},

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
		this._fireChangedEvents(0, this._count);
		this._fire('collection_changed');

	},

	removeRange: function(start_index, count) {

		if (count <= 0) Lava.t("Invalid item count supplied for removeRange");
		if (start_index + count >= this._count + 1) Lava.t("Index is out of range");

		var removed_uids = this._data_uids.splice(start_index, count),
			removed_values = this._data_values.splice(start_index, count),
			removed_names = this._data_names.splice(start_index, count);

		this._setLength(this._count - count);
		this._fireChangedEvents(start_index, this._count);

		this._fire('items_removed', {
			uids: removed_uids,
			values: removed_values,
			names: removed_names
		});

		this._fire('collection_changed');

		return removed_values;

	},

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
		this._fireChangedEvents(start_index, this._count);

		this._fire('items_added', {
			uids: added_uids,
			values: values,
			names: added_names
		});

		this._fire('collection_changed');

	},

	append: function(values, names) {

		this.insertRange(this._count, values, names);

	},

	/**
	 * Remove all records
	 */
	removeAll: function() {

		return (this._count > 0) ? this.removeRange(0, this._count) : [];

	},

	insertAt: function(index, value, name) {

		this.insertRange(index, [value], [name]);

	},

	unshift: function(value, name) {

		this.insertRange(0, [value], [name]);

	},

	removeAt: function(index) {

		return this.removeRange(index, 1)[0];

	},

	shift: function() {

		return this.removeRange(0, 1)[0];

	},

	/**
	 * Create an internal helper object. The purpose is to write less code.
	 * @returns {{uids: Array, values: Array, names: Array, push: push, getObject: getObject}}
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

	destroy: function() {

		this._fire('destroy');

	}

});