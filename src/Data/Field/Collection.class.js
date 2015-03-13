
Lava.define(
'Lava.data.field.Collection',
/**
 * Field, that holds collection of records (usually, from another module)
 * @lends Lava.data.field.Collection#
 * @extends Lava.data.field.Abstract
 */
{

	Extends: 'Lava.data.field.Abstract',

	/**
	 * Instance belongs to Collection field
	 * @type {boolean}
	 * @const
	 */
	isCollectionField: true,

	/**
	 * Collection field holds array of records from this module instance
	 * @type {Lava.data.Module}
	 */
	_target_module: null,

	/**
	 * The mirror {@link Lava.data.field.Record} field name
	 * @type {string}
	 */
	_target_record_field_name: null,
	/**
	 * Each Collection field has corresponding Record field, they always come in pairs, like 'parent' (Record) and 'children' (Collection)
	 * @type {Lava.data.field.Record}
	 */
	_target_record_field: null,

	/**
	 * Listener for {@link Lava.data.field.Record#event:removed_child}
	 * @type {_tListener}
	 */
	_record_removed_listener: null,
	/**
	 * Listener for {@link Lava.data.field.Record#event:added_child}
	 * @type {_tListener}
	 */
	_record_added_listener: null,

	/**
	 * Collections of foreign records that belong to local record
	 * @type {Object.<string, Lava.system.Enumerable>}
	 */
	_collections_by_record_guid: {},
	/**
	 * Listeners for each Enumerable from `_collections_by_record_guid`
	 * @type {Object}
	 */
	_collection_listeners_by_guid: {},
	/**
	 * Hash of global unique identifiers of Enumerables from `_collections_by_record_guid` to their owner record (local)
	 * @type {Object.<_tGUID, Lava.data.Record>}
	 */
	_collection_guid_to_record: {},

	/**
	 * @param module
	 * @param name
	 * @param {_cCollectionField} config
	 * @param module_storage
	 */
	init: function(module, name, config, module_storage) {

		this.Abstract$init(module, name, config, module_storage);

		if (Lava.schema.DEBUG && !config.record_field)
			Lava.t("Missing corresponding Record field. Record fields are used by Collection fields.");

		this._target_record_field_name = config.record_field;

	},

	onModuleFieldsCreated: function(default_properties) {

		this._target_module = (this._config.module == 'this') ? this._module : this._module.getApp().getModule(this._config.module);
		this._target_record_field = this._target_module.getField(this._target_record_field_name);
		this._record_removed_listener = this._target_record_field.on('removed_child', this._onRecordRemoved, this);
		this._record_added_listener = this._target_record_field.on('added_child', this._onRecordAdded, this);

		if (!this._target_record_field.isRecordField) Lava.t('CollectionField: mirror field is not Record field');

		if (this._target_record_field.getReferencedModule() !== this._module)
			Lava.t("CollectionField: module mismatch with mirror Record field");

	},

	/**
	 * Record was removed from collection by setting it's related Record field. Update local collection
	 * @param {Lava.data.field.Record} field
	 * @param {Lava.data.field.Record#event:removed_child} event_args
	 */
	_onRecordRemoved: function(field, event_args) {

		var local_record = event_args.collection_owner;
		if (local_record.guid in this._collections_by_record_guid) {
			Lava.suspendListener(this._collection_listeners_by_guid[local_record.guid].removed);
			this._collections_by_record_guid[local_record.guid].removeValue(event_args.child);
			Lava.resumeListener(this._collection_listeners_by_guid[local_record.guid].removed);
		}

	},

	/**
	 * Record was added to collection by setting it's related Record field. Update local collection
	 * @param {Lava.data.field.Record} field
	 * @param {Lava.data.field.Record#event:removed_child} event_args
	 */
	_onRecordAdded: function(field, event_args) {

		var local_record = event_args.collection_owner;
		if (local_record.guid in this._collections_by_record_guid) {
			Lava.suspendListener(this._collection_listeners_by_guid[local_record.guid].added);
			this._collections_by_record_guid[local_record.guid].includeValue(event_args.child);
			Lava.suspendListener(this._collection_listeners_by_guid[local_record.guid].added);
		}

	},

	isValidValue: function() {

		// You can not assign anything to Collection fields.
		// They can only be imported and are updated automatically, when corresponding Record field changes
		return false;

	},

	getInvalidReason: function() {

		return  'Collection field does not support setValue';

	},

	'import': function(record, properties, raw_properties) {

		if (raw_properties[this._name]) {

			if (Lava.schema.data.VALIDATE_IMPORT_DATA && !Array.isArray(raw_properties[this._name]))
				Lava.t('Invalid value in import data');

			var i = 0,
				records = this._target_module.loadRecords(raw_properties[this._name]),
				count = records.length;

			for (; i < count; i++) {

				records[i].set(this._target_record_field_name, record);

			}

		}

	},

	'export': function(record, destination_object) {

	},

	getValue: function(record, properties) {

		var guid = record.guid,
			collection;

		if (!(guid in this._collections_by_record_guid)) {

			collection = new Lava.system.Enumerable(this._target_record_field.getCollection(record));
			this._collections_by_record_guid[guid] = collection;
			this._collection_listeners_by_guid[guid] = {
				added: collection.on('items_added', this._onCollectionRecordsAdded, this),
				removed: collection.on('items_removed', this._onCollectionRecordsRemoved, this)
			};
			this._collection_guid_to_record[collection.guid] = record;

		}

		return this._collections_by_record_guid[guid];

	},

	/**
	 * When directly adding records to collection - their related Record field must be set to correct collection owner
	 * @param {Lava.system.Enumerable} collection Collection of records that belong to local record ("children")
	 * @param {Lava.system.Enumerable#event:items_added} event_args
	 */
	_onCollectionRecordsAdded: function(collection, event_args) {

		this._setCollectionOwner(event_args.values, this._collection_guid_to_record[collection.guid]);

	},

	/**
	 * When directly removing records from collection - their related Record field must be set to null
	 * @param {Lava.system.Enumerable} collection Collection of records that belong to local record ("children")
	 * @param {Lava.system.CollectionAbstract#event:items_removed} event_args
	 */
	_onCollectionRecordsRemoved: function(collection, event_args) {

		this._setCollectionOwner(event_args.values, null);

	},

	/**
	 * Set the related {@link Lava.data.field.Record} field of the `records` array to `new_value`
	 * @param {Array.<Lava.data.Record>} records
	 * @param {?Lava.data.Record} new_value
	 */
	_setCollectionOwner: function(records, new_value) {

		var i = 0,
			count = records.length,
			record;

		for (; i < count; i++) {

			record = records[i];
			// everything else will be done by the Record field
			// also, it will raise an event to remove the record from Enumerable
			record.set(this._target_record_field_name, new_value);

		}

	},

	/**
	 * Get count of items in record's collection of this field
	 * @param {Lava.data.Record} record
	 * @param {Object} properties
	 * @returns {Number}
	 */
	getCount: function(record, properties) {

		return this._target_record_field.getCollectionCount(record);

	},

	setValue: function() {

		Lava.t('Trying to set Collection field value');

	},

	isLess: function(record_a, record_b) {

		return this._target_record_field.getCollectionCount(record_a) < this._target_record_field.getCollectionCount(record_b);

	},

	isEqual: function(record_a, record_b) {

		return this._target_record_field.getCollectionCount(record_a) == this._target_record_field.getCollectionCount(record_b);

	},

	destroy: function() {

		var guid;

		for (guid in this._collections_by_record_guid) {

			this._collections_by_record_guid[guid].destroy();

		}

		this._target_record_field.removeListener(this._record_removed_listener);
		this._target_record_field.removeListener(this._record_added_listener);

		this._target_module
			= this._collections_by_record_guid
			= this._collection_listeners_by_guid
			= this._collection_guid_to_record
			= this._target_record_field = null;

		this.Abstract$destroy();

	}

});