
Lava.define(
'Lava.data.field.ForeignKey',
/**
 * @lends Lava.data.field.ForeignKey#
 * @extends Lava.data.field.Basic
 */
{

	Extends: 'Lava.data.field.Basic',

	isForeignKey: true,

	_collections_by_foreign_id: {},

	_default: 0,

	initNewRecord: function(record, storage) {

		this._registerByForeignKey(record, storage[this._name]);
		this.Basic$initNewRecord(record, storage);

	},

	'import': function(record, storage, raw_properties) {

		this._registerByForeignKey(record, raw_properties[this._name] || storage[this._name]);// it may have a default
		this.Basic$import(record, storage, raw_properties);

	},

	_registerByForeignKey: function(record, foreign_key) {

		if (foreign_key in this._collections_by_foreign_id) {

			this._collections_by_foreign_id[foreign_key].push(record);

		} else {

			this._collections_by_foreign_id[foreign_key] = [record];

		}

	},

	setValue: function(record, storage, new_foreign_key) {

		Firestorm.Array.exclude(this._collections_by_foreign_id[storage[this._name]], record);
		this._registerByForeignKey(record, new_foreign_key);

		this.Basic$setValue(record, storage, new_foreign_key);

	},

	getCollection: function(foreign_key) {

		return this._collections_by_foreign_id[foreign_key] || [];

	},

	destroy: function() {

		this._collections_by_foreign_id = null;
		this.Basic$destroy();

	}

});