
/**
 * Values were added to collection
 * @event Lava.system.Enumerable#items_added
 * @type {Object}
 * @property {Array.<number>} uids Internal unique IDs that were generated for added values
 * @property {array.<*>} values Values, that were added
 * @property {Array.<string>} names Names (keys) of values that were added
 */

Lava.define(
'Lava.system.Enumerable',
/**
 * Array-like collection of elements, suitable for scope binding
 *
 * @lends Lava.system.Enumerable#
 * @extends Lava.system.CollectionAbstract#
 */
{

	Extends: 'Lava.system.CollectionAbstract',

	/**
	 * To tell other classes that this is instance of Enumerable
	 * @readonly
	 */
	isEnumerable: true,

	/**
	 * Counter for next internal UID
	 * @type {number}
	 */
	_uid: 1,

	/**
	 * Creates Enumerable instance and fills initial data from `data_source`
	 * @param {(Array|Object|Lava.mixin.Properties|Lava.system.Enumerable)} data_source
	 */
	init: function(data_source) {

		this.guid = Lava.guid++;

		if (data_source) {

			var count = 0,
				i = 0,
				name;

			if (Array.isArray(data_source)) {

				for (count = data_source.length; i < count; i++) {

					this._push(this._uid++, data_source[i], null);

				}

			} else if (data_source.isCollection) {

				this._data_names = data_source.getNames();
				this._data_values = data_source.getValues();
				for (count = this._data_values.length; i < count; i++) {

					this._data_uids.push(this._uid++);

				}

			} else {

				if (data_source.isProperties) {

					data_source = data_source.getProperties();

				}

				for (name in data_source) {

					this._push(this._uid++, data_source[name], name);

				}

			}

			this._count = this._data_uids.length;

		}

	},

	/**
	 * Update the collection from `data_source`
	 * @param {(Array|Object|Lava.mixin.Properties|Lava.system.Enumerable)} data_source
	 */
	refreshFromDataSource: function(data_source) {

		if (Lava.schema.DEBUG && typeof(data_source) != 'object') Lava.t("Wrong argument passed to updateFromSourceObject");

		if (Array.isArray(data_source)) {

			this._updateFromArray(data_source, []);

		} else if (data_source.isCollection) {

			this._updateFromEnumerable(data_source);

		} else {

			this._updateFromObject(data_source.isProperties ? data_source.getProperties() : data_source);

		}

	},

	/**
	 * Remove all current values and add values from array
	 * @param {Array} source_array
	 * @param {Array.<string>} names
	 */
	_updateFromArray: function(source_array, names) {

		var i = 0,
			count = source_array.length,
			items_removed_argument = {
				uids: this._data_uids,
				values: this._data_values,
				names: this._data_names
			};

		this._data_uids = [];
		this._data_values = [];
		this._data_names = [];

		for (; i < count; i++) {
			this._push(this._uid++, source_array[i], names[i] || null);
		}

		this._setLength(count);

		this._fire('items_removed', items_removed_argument);

		this._fire('items_added', {
			uids: this._data_uids.slice(),
			values: this._data_values.slice(),
			names: this._data_names.slice()
		});

		this._fire('collection_changed');

	},

	/**
	 * Same as `_updateFromArray`, but uses names from `data_source`
	 * @param {Lava.system.Enumerable} data_source
	 */
	_updateFromEnumerable: function(data_source) {

		this._updateFromArray(data_source.getValues(), data_source.getNames());

	},

	/**
	 * Compares item names with object keys, removing values without names and values that do not match.
	 * Adds new values from `source_object`
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
			if (name != null && (name in source_object)) {

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

	}

});