
Lava.define(
'Lava.data.MetaStorage',
/**
 * @lends Lava.data.MetaStorage#
 * @extends Lava.data.ModuleAbstract
 * @extends Lava.mixin.Properties
 */
{

	Extends: 'Lava.data.ModuleAbstract',

	Implements: 'Lava.mixin.Properties',

	//_attached_module: null,

	/**
	 * @param {_cMetaStorage} config
	 */
	init: function(config) {

		if ('id' in config.fields) Lava.throw("Id field in MetaStorage is not permitted");

		this._config = config;
		//this._attached_module = attached_module;

		var default_storage = this._initFields(config),
			field;

		if (Lava.schema.DEBUG) {
			for (field in this._fields) {
				if (this._fields[field].isCollectionField || this._fields[field].isRecordField)
					Lava.throw("Standard Collection and Record fields will not work inside the MetaStorage");
			}
		}

		this._createEmptyRecordStorage = new Function(
			"return " + Lava.Serializer.serialize(default_storage)
		);

	},

	get: function(guid) {

		if (!(guid in this._properties)) {

			this._properties[guid] = this._createRecordInstance();

		}

		return this._properties[guid];

	},

	set: function(name, value) {

		Lava.throw("MetaStorage: set operation is not permitted");

	},

//	getAttachedModule: function() {
//
//		return this._attached_module;
//
//	},

	_createRecordInstance: function() {

		var storage = this._createEmptyRecordStorage(),
			constructor = Lava.ClassManager.getConstructor('MetaRecord', 'Lava.data'),
			record = new constructor(this, this._fields, storage);

		this._records.push(record);
		this._storages_by_guid[record.guid] = storage;
		this._records_by_guid[record.guid] = record;
		return record;

	},

	getAllRecords: function() {

		var result = [],
			guid;

		for (guid in this._properties) {
			result.push(this._properties[guid]);
		}

		return result;

	}

});