
Lava.define(
'Lava.data.field.ForeignKey',
/**
 * Represents a field that references ID field of another record (often from another modules). Maintains collections
 * of local records, grouped by their referenced "parent"
 * @lends Lava.data.field.ForeignKey#
 * @extends Lava.data.field.Basic
 */
{

	Extends: 'Lava.data.field.Basic',

	/**
	 * Instance belongs to ForeignKey field
	 * @type {boolean}
	 * @const
	 */
	isForeignKey: true,

	/**
	 * Local records, grouped by foreign field
	 * @type {Object.<string, Array.<Lava.data.Record>>}
	 */
	_collections_by_foreign_id: {},

	/**
	 * Default foreign id (0 means that no record is referenced)
	 * @type {number}
	 */
	_default: 0,

	initNewRecord: function(record, properties) {

		this._registerByForeignKey(record, properties[this._name]);
		this.Basic$initNewRecord(record, properties);

	},

	'import': function(record, properties, raw_properties) {

		this._registerByForeignKey(record, raw_properties[this._name] || properties[this._name]);// it may have a default
		this.Basic$import(record, properties, raw_properties);

	},

	/**
	 * Add record to local collection of records, grouped by this field
	 * @param {Lava.data.Record} record
	 * @param {string} foreign_key
	 */
	_registerByForeignKey: function(record, foreign_key) {

		if (foreign_key in this._collections_by_foreign_id) {

			this._collections_by_foreign_id[foreign_key].push(record);

		} else {

			this._collections_by_foreign_id[foreign_key] = [record];

		}

	},

	setValue: function(record, properties, new_foreign_key) {

		Firestorm.Array.exclude(this._collections_by_foreign_id[properties[this._name]], record);
		this._registerByForeignKey(record, new_foreign_key);

		this.Basic$setValue(record, properties, new_foreign_key);

	},

	/**
	 * Get local records with given `foreign_key` value
	 * @param {string} foreign_key
	 * @returns {Array.<Lava.data.Record>}
	 */
	getCollection: function(foreign_key) {

		return (foreign_key in this._collections_by_foreign_id) ? this._collections_by_foreign_id[foreign_key].slice() : [];

	},

	destroy: function() {

		this._collections_by_foreign_id = null;
		this.Basic$destroy();

	}

});