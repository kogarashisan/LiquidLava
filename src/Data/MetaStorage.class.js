
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
	 * Get an extension record by GUID of normal record
	 * @param {_tGUID} ext_guid
	 * @returns {Lava.data.MetaRecord}
	 * @lava-param-renamed name -> ext_guid
	 */
	get: function(ext_guid) {

		return this._properties[ext_guid];

	},

	/**
	 * Throws an error
	 */
	set: function() {

		Lava.t("MetaStorage: set operation is not permitted");

	},

	/**
	 * Create a new MetaRecord instance
	 * @param {_tGUID} ext_guid GUID of the external record, to which this MetaRecord will be attached
	 * @param {Object} raw_properties Initial field values
	 * @param {Object} [original_record] Original record, which will be saved in MetaRecord instance
	 * @returns {Lava.data.MetaRecord}
	 */
	createMetaRecord: function(ext_guid, raw_properties, original_record) {

		if (ext_guid in this._properties) Lava.t("MetaRecord already exists");

		var properties = this._createRecordProperties(),
			record = new this._record_constructor(this, this._fields, properties, raw_properties, original_record);

		record.ext_guid = ext_guid;
		this._records.push(record);
		this._properties_by_guid[record.guid] = properties;
		this._records_by_guid[record.guid] = record;

		this._properties[ext_guid] = record;
		this.firePropertyChangedEvents(ext_guid);

		return record;

	}

});