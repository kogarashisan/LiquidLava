
/**
 * Records have been loaded from server
 * @event Lava.data.Module#records_loaded
 * @type {Object}
 * @property {Array.<Lava.data.Record>} records The loaded record instances
 */

/**
 * New records have been created
 * @event Lava.data.Module#records_created
 * @type {Object}
 * @property {Array.<Lava.data.Record>} records The new record instances
 */

Lava.define(
'Lava.data.Module',
/**
 * Module represents a server-side database table
 *
 * @lends Lava.data.Module#
 * @extends Lava.data.ModuleAbstract
 */
{

	Extends: 'Lava.data.ModuleAbstract',

	/**
	 * Application instance reference
	 * @type {Lava.system.App}
	 */
	_app: null,
	/**
	 * Module name
	 * @type {string}
	 */
	_name: null,

	/**
	 * All records by their unique ID key (if module has an ID field)
	 * @type {Object.<string, Lava.data.Record>}
	 */
	_records_by_id: {},

	/**
	 * Does this module have an ID field
	 * @type {boolean}
	 */
	_has_id: false,

	/**
	 * Create a Module instance, init fields, generate the method that returns initial record properties
	 * @param {Lava.system.App} lava_app Application instance
	 * @param {_cModule} config
	 * @param {string} name Module's name
	 */
	init: function(lava_app, config, name) {

		this._app = lava_app;
		this._config = config;
		this._name = name;

		this._createFields(config);

		this._record_constructor = Lava.ClassManager.getConstructor(
			config.record_class || Lava.schema.data.DEFAULT_RECORD_CLASS,
			'Lava.data'
		);

		if ('id' in this._fields) {

			this._has_id = true;
			this._fields['id'].on('changed', this._onRecordIdChanged, this);

		}

	},

	/**
	 * Record's ID has been created (ID fields never change). Need to update local `_records_by_id` hash
	 * @param {Lava.data.field.Abstract} id_field
	 * @param {Lava.data.field.Abstract#event:changed} event_args
	 */
	_onRecordIdChanged: function(id_field, event_args) {

		var id = event_args.record.get('id');
		if (id in this._records_by_id) Lava.t("Duplicate record id in module " + this._name);
		this._records_by_id[id] = event_args.record;

	},

	/**
	 * Does this module have an ID field with given name
	 * @param {string} name
	 * @returns {boolean}
	 */
	hasField: function(name) {

		return name in this._fields;

	},

	/**
	 * Get field instance
	 * @param {string} name
	 * @returns {Lava.data.field.Abstract}
	 */
	getField: function(name) {

		return this._fields[name];

	},

	/**
	 * Get a record by it's ID field
	 * @param {string} id
	 * @returns {Lava.data.Record}
	 */
	getRecordById: function(id) {

		return this._records_by_id[id];

	},

	/**
	 * Get a record by it's global unique identifier
	 * @param {_tGUID} guid
	 * @returns {Lava.data.Record}
	 */
	getRecordByGuid: function(guid) {

		return this._records_by_guid[guid];

	},

	/**
	 * Get `_app`
	 * @returns {Lava.system.App}
	 */
	getApp: function() {

		return this._app;

	},

	/**
	 * Load record only if it has not been already loaded. `raw_properties` must have an ID
	 * @param {Object} raw_properties Serialized record fields from server
	 * @returns {Lava.data.Record} Newly loaded record instance, or the old one
	 */
	safeLoadRecord: function(raw_properties) {

		var result;

		if (Lava.schema.DEBUG && !raw_properties.id) Lava.t('safeLoadRecord: import data must have an id');

		if (raw_properties.id in this._records_by_id) {

			result = this._records_by_id[raw_properties.id];

		} else {

			result = this.loadRecord(raw_properties);

		}

		return result;

	},

	/**
	 * Initialize a module record from server-side data
	 * @param {Object} raw_properties Serialized record fields from server
	 * @returns {Lava.data.Record} Loaded record instance
	 */
	loadRecord: function(raw_properties) {

		var record = this._createRecordInstance(raw_properties);
		this._fire('records_loaded', {records: [record]});
		return record;

	},

	/**
	 * Create a new record instance
	 * @returns {Lava.data.Record}
	 */
	createRecord: function() {

		var record = this._createRecordInstance();
		this._fire('records_created', {records: [record]});
		return record;

	},

	/**
	 * Perform creation of a new record instance (either with server-side data, or without it)
	 * @param {Object} raw_properties
	 * @returns {Lava.data.Record}
	 */
	_createRecordInstance: function(raw_properties) {

		var properties = this._createRecordProperties(),
			record = new this._record_constructor(this, this._fields, properties, raw_properties);

		if (properties.id) {

			if (properties.id in this._records_by_id) Lava.t("Duplicate record id in module " + this._name);
			this._records_by_id[properties.id] = record;

		}

		this._records.push(record);
		this._properties_by_guid[record.guid] = properties;
		this._records_by_guid[record.guid] = record;
		return record;

	},

	/**
	 * Initialize module records from server-side data
	 * @param {Array.<Object>} raw_records_array Server-side data for the records
	 * @returns {Array.<Lava.data.Record>} Loaded record instances
	 */
	loadRecords: function(raw_records_array) {

		var i = 0,
			count = raw_records_array.length,
			records = [];

		for (; i < count; i++) {

			records.push(this._createRecordInstance(raw_records_array[i]));

		}

		this._fire('records_loaded', {records: records});

		return records;

	},

	destroy: function() {

		this._records_by_id = null;
		this.ModuleAbstract$destroy();

	}

});