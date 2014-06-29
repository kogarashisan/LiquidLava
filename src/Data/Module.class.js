
Lava.define(
'Lava.data.Module',
/**
 * @lends Lava.data.Module#
 * @extends Lava.data.ModuleAbstract
 */
{

	Extends: 'Lava.data.ModuleAbstract',

	_app: null,
	_name: null,

	_record_class: Lava.schema.data.DEFAULT_RECORD_CLASS,

	_records_by_id: {},

	_has_id: false,

	/**
	 * @param lava_app
	 * @param {_cModule} config
	 * @param {string} name
	 */
	init: function(lava_app, config, name) {

		this._app = lava_app;
		this._config = config;
		this._name = name;

		if ('record_class' in config) {

			this._record_class = config.record_class;

		}

		var default_storage = this._initFields(config);

		this._createEmptyRecordStorage = new Function(
			"return " + Lava.Serializer.serialize(default_storage)
		);

		if ('id' in this._fields) {

			this._has_id = true;
			this._fields['id'].on('changed', this._onRecordIdChanged, this);

		}

	},

	_onRecordIdChanged: function(id_field, event_args) {

		var id = event_args.record.get('id');
		if (id in this._records_by_id) Lava.throw("Duplicate record id in module " + this._name);
		this._records_by_id[id] = event_args.record;

	},

	hasField: function(name) {

		return name in this._fields;

	},


	getField: function(name) {

		return this._fields[name];

	},

	getRecordById: function(id) {

		return this._records_by_id[id];

	},

	getRecordByGuid: function(guid) {

		return this._records_by_guid[guid];

	},

	getApp: function() {

		return this._app;

	},

	safeLoadRecord: function(raw_properties) {

		var result;

		if (raw_properties.id && (raw_properties.id in this._records_by_id)) {

			result = this._records_by_id[raw_properties.id];

		} else {

			result = this.loadRecord(raw_properties);

		}

		return result;

	},

	loadRecord: function(raw_properties) {

		var record = this._createRecordInstance(raw_properties);
		this._fire('records_loaded', {records: [record]});
		return record;

	},

	createRecord: function() {

		var record = this._createRecordInstance();
		this._fire('records_created', {records: [record]});
		return record;

	},

	_createRecordInstance: function(raw_properties) {

		var storage = this._createEmptyRecordStorage(),
			constructor = Lava.ClassManager.getConstructor(this._record_class, 'Lava.data'),
			record = new constructor(this, this._fields, storage, raw_properties);

		if (storage.id) {

			if (storage.id in this._records_by_id) Lava.throw("Duplicate record id in module " + this._name);
			this._records_by_id[storage.id] = record;

		}

		this._records.push(record);
		this._storages_by_guid[record.guid] = storage;
		this._records_by_guid[record.guid] = record;
		return record;

	},

	/**
	 * @param {Array.<Object>} raw_records_array
	 * @returns {Array}
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

	getAllRecords: function() {

		return this._records.slice();

	},

	getCount: function() {

		return this._records.length;

	},

	destroy: function() {

		this._records_by_id = null;
		this.ModuleAbstract$destroy();

	}

});