
Lava.define(
'Lava.data.MetaStorage',
/**
 * Module that is designed to extend normal modules with additional fields. Cannot have an ID field
 * @lends Lava.data.MetaStorage#
 * @extends Lava.data.ModuleAbstract
 * @extends Lava.mixin.Properties
 */
{

	Extends: 'Lava.data.ModuleAbstract',
	Implements: 'Lava.mixin.Properties',

	/**
	 * Create an instance of MetaStorage
	 * @param {_cMetaStorage} config
	 */
	init: function(config) {

		if ('id' in config.fields) Lava.t("Id field in MetaStorage is not permitted");

		this._config = config;
		this._createFields(config);
		this.initFields(); // MetaStorage is constructed directly, not via App class

		var field;

		if (Lava.schema.DEBUG) {
			for (field in this._fields) {
				if (this._fields[field].isCollectionField || this._fields[field].isRecordField)
					Lava.t("Standard Collection and Record fields will not work inside the MetaStorage");
			}
		}

		this._record_constructor = Lava.ClassManager.getConstructor('MetaRecord', 'Lava.data');

	},

	/**
	 * Get or create an extension record by GUID of record in a normal module
	 * @param {_tGUID} guid
	 * @returns {Lava.data.MetaRecord}
	 * @lava-param-renamed name -> guid
	 */
	get: function(guid) {

		if (!(guid in this._properties)) {

			this._properties[guid] = this._createRecordInstance();

		}

		return this._properties[guid];

	},

	/**
	 * Throws an error
	 */
	set: function() {

		Lava.t("MetaStorage: set operation is not permitted");

	},

	/**
	 * Create an instance of {@link Lava.data.MetaRecord}
	 * @returns {Lava.data.MetaRecord}
	 */
	_createRecordInstance: function() {

		var properties = this._createRecordProperties(),
			record = new this._record_constructor(this, this._fields, properties);

		this._records.push(record);
		this._properties_by_guid[record.guid] = properties;
		this._records_by_guid[record.guid] = record;
		return record;

	}

});