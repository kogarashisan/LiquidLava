
Lava.define(
'Lava.data.field.Record',
/**
 * Maintains collections of records, grouped by this field - used by mirror Collection field.
 *
 * @lends Lava.data.field.Record#
 * @extends Lava.data.field.Abstract
 */
{

	Extends: 'Lava.data.field.Abstract',

	isRecordField: true,

	_referenced_module: null,

	/**
	 * Records, grouped by this field. Serves as a helper for mirror Collection field.
	 * Key is GUID of the foreign record, value is collection of records from local module.
	 * Arrays are turned into Enumerable upon first request.
	 * @type {Object.<string, (Enumerable|Array)>}
	 */
	_collections_by_guid: {},
	_collections_by_id: {},

	/**
	 * Each Enumerable from _collections_by_guid has a GUID, and each enumerable belongs to foreign record
	 */
	_collection_listeners_by_guid: {},
	/**
	 * @type {Object.<number, Lava.data.RecordAbstract>}
	 */
	_collection_guid_to_foreign_record: {},

	_foreign_key_field_name: null,
	/**
	 * Local field with ID of the foreign record
	 */
	_foreign_key_field: null,
	_foreign_key_changed_listener: null,

	_external_id_field: null,
	_external_id_changed_listener: null,
	_external_records_loaded_listener: null,

	/**
	 * @param {Lava.data.Module} module
	 * @param {string} name
	 * @param {_cRecordField} config
	 * @param {object} module_storages
	 */
	init: function(module, name, config, module_storages) {

		this.Abstract$init(module, name, config, module_storages);

		this._referenced_module = (config.module == 'this') ? module : module.getApp().getModule(config.module);

	},

	onModuleFieldsCreated: function(default_storage) {

		if (this._config.foreign_key_field) {

			if (Lava.schema.DEBUG && !this._referenced_module.hasField('id')) Lava.throw("field/Record: the referenced module must have an ID field");

			this._foreign_key_field_name = this._config.foreign_key_field;
			this._foreign_key_field = this._module.getField(this._foreign_key_field_name);
			this._foreign_key_changed_listener = this._foreign_key_field.on('changed', this._onForeignKeyChanged, this);
			this._external_id_field = this._referenced_module.getField('id');
			this._external_id_changed_listener = this._external_id_field.on('changed', this._onExternalIdCreated, this);
			this._external_records_loaded_listener = this._referenced_module.on('records_loaded', this._onReferencedModuleRecordsLoaded, this);

		}

		// this field stores the referenced record
		default_storage[this._name] = null;

	},

	_onReferencedModuleRecordsLoaded: function(module, event_args) {

		var records = event_args.records,
			i = 0,
			count = records.length,
			foreign_id;

		for (; i < count; i++) {

			foreign_id = records[i].get('id');

			// The situation: records in local module are already loaded, they reference foreign records by their IDs.
			// Now foreign records are loaded, they get a GUID, and we need to ensure that collections can be referenced by that guid.
			if (foreign_id in this._collections_by_id) {

				if (Lava.schema.DEBUG && (records[i].guid in this._collections_by_guid)) Lava.throw();
				this._collections_by_guid[records[i].guid] = this._collections_by_id[foreign_id];

			}

		}

	},

	_onExternalIdCreated: function(foreign_module_id_field, event_args) {

		var referenced_record = event_args.record, // record belongs to foreign module
			new_referenced_id = referenced_record.get('id'),
			collection;

		if (referenced_record.guid in this._collections_by_guid) {

			collection = this._collections_by_guid[referenced_record.guid];

			if (new_referenced_id in this._collections_by_id) Lava.throw();
			this._collections_by_id[new_referenced_id] = collection;

			// set the value of foreign ID field in all local records that reference this foreign record
			if (this._foreign_key_field) {

				if (collection.isEnumerable) {

					this._batchSetForeignKey(collection.getValues(), collection.getCount(), new_referenced_id);

				} else {

					this._batchSetForeignKey(collection, collection.length, new_referenced_id);

				}

			}

		}

	},

	/**
	 * Fires, when local record's foreign id field is assigned a new value.
	 * Example: record.set('category_id', 123) // 'record' is from local module, 123 - id of foreign record
	 * @param foreign_key_field
	 * @param event_args
	 */
	_onForeignKeyChanged: function(foreign_key_field, event_args) {

		var record = event_args.record, // record belongs to this module
			storage = this._storages_by_guid[record.guid];

		if (storage[this._name] != null) {

			// remove old record from collection
			this._unregisterRecord(record, storage[this._name]);

		}

		if (storage[this._foreign_key_field_name]) {

			this._registerByReferencedId(record, storage, storage[this._foreign_key_field_name]);

		} else {

			storage[this._name] = null;

		}

		this._fireFieldChangedEvents(record);

	},

	isValidValue: function(new_record) {

		return (
				(new_record === null && this._is_nullable)
				|| (typeof(new_record) != 'undefined'
					&& new_record.isRecord
					&& new_record.getModule() === this._referenced_module)
			);

	},

	getInvalidReason: function(value) {

		var reason = this.Abstract$getInvalidReason(value);

		if (!reason) {

			if (!value.isRecord) {

				reason = "Value is not record";

			} else if (value.getModule() === this._referenced_module) {

				reason = "Value is from different module than this field refers to";

			}

		}

		return reason;

	},

	initNewRecord: function(record, storage) {

		if (this._foreign_key_field) {

			this._registerByReferencedId(record, storage, storage[this._foreign_key_field_name]);

		}

	},

	'import': function(record, storage, raw_properties) {

		if (raw_properties[this._name]) {

			// actual record could be placed there by mirror Collection field
			if (raw_properties[this._name].isRecord) {

				if (this._foreign_key_field) {

					if (storage[this._foreign_key_field_name] && storage[this._foreign_key_field_name] != raw_properties[this._name].get('id'))
						Lava.throw("Record field: mismatch of actual referenced record and it's id in import data");

				}

				storage[this._name] = raw_properties[this._name];

			} else {

				storage[this._name] = this._referenced_module.safeLoadRecord(raw_properties[this._name]);

			}

			this._registerRecord(record, storage[this._name]);

		} else if (this._foreign_key_field) {

			// if foreign id is in import - than it will replace the default value (if foreign kay has default)
			this._registerByReferencedId(
				record,
				storage,
				raw_properties[this._foreign_key_field_name] || storage[this._foreign_key_field_name]
			);

		}

	},

	/**
	 * @param record The local record
	 * @param storage The storage of local record
	 * @param referenced_record_id The id of foreign record, which it belongs to
	 */
	_registerByReferencedId: function(record, storage, referenced_record_id) {

		if (referenced_record_id) {

			storage[this._name] = this._referenced_module.getRecordById(referenced_record_id);

			if (storage[this._name]) {

				this._registerRecord(record, storage[this._name]);

			} else if (referenced_record_id in this._collections_by_id) {

				if (Lava.schema.DEBUG && this._collections_by_id[referenced_record_id].isEnumerable) Lava.throw("Assertion failed");
				this._collections_by_id[referenced_record_id].push(record);

			} else {

				this._collections_by_id[referenced_record_id] = [record];

			}

		}

	},

	'export': function(record, destination_object) {

	},

	getValue: function(record, storage) {

		return storage[this._name];

	},

	setValue: function(record, storage, new_ref_record) {

		if (!this.isValidValue(new_ref_record))
			Lava.throw("Field/Record: assigned value is not valid. Reason: " + this.getInvalidReason(new_ref_record));

		if (storage[this._name] != null) {

			// remove from the old record's collection
			this._unregisterRecord(record, storage[this._name]);

		}

		storage[this._name] = new_ref_record;
		if (new_ref_record != null) {

			this._registerRecord(record, new_ref_record)

		}

		if (this._foreign_key_field) {

			Lava.suspendListener(this._foreign_key_changed_listener);

			if (new_ref_record != null) {

				record.set(this._foreign_key_field_name, new_ref_record.get('id'));

			} else {

				record.set(this._foreign_key_field_name, 0);

			}

			Lava.resumeListener(this._foreign_key_changed_listener);

		}

		this._fireFieldChangedEvents(record);

	},

	/**
	 * Remove local_record from the collection referenced by referenced_record
	 * @param local_record
	 * @param referenced_record
	 */
	_unregisterRecord: function(local_record, referenced_record) {

		var referenced_guid = referenced_record.guid;

		if (this._collections_by_guid[referenced_guid].isEnumerable) {

			Lava.suspendListener(this._collection_listeners_by_guid[referenced_guid].removed);
			var result = this._collections_by_guid[referenced_guid].remove(local_record);
			if (Lava.schema.DEBUG && !result) Lava.throw();
			Lava.resumeListener(this._collection_listeners_by_guid[referenced_guid].removed);

		} else {

			var index = this._collections_by_guid[referenced_guid].indexOf(local_record);
			if (index == -1) Lava.throw();
			this._collections_by_guid[referenced_guid].splice(index, 1);

		}

	},

	/**
	 * Add local_record to collection of records from local module, referenced by referenced_record
	 * @param local_record
	 * @param referenced_record
	 */
	_registerRecord: function(local_record, referenced_record) {

		var referenced_guid = referenced_record.guid;

		if (referenced_guid in this._collections_by_guid) {

			if (this._collections_by_guid[referenced_guid].isEnumerable) {

				if (Lava.schema.DEBUG && this._collections_by_guid[referenced_guid].contains(local_record))
					Lava.throw("Duplicate record");

				Lava.suspendListener(this._collection_listeners_by_guid[referenced_guid].added);
				this._collections_by_guid[referenced_guid].push(local_record);
				Lava.resumeListener(this._collection_listeners_by_guid[referenced_guid].added);

			} else {

				if (Lava.schema.DEBUG && this._collections_by_guid[referenced_guid].indexOf(local_record) !== -1)
					Lava.throw("Duplicate record");
				this._collections_by_guid[referenced_guid].push(local_record);

			}

		} else {

			this._collections_by_guid[referenced_guid] = [local_record];

		}

	},

	/**
	 * @param {Lava.data.RecordAbstract} referenced_record The collection's owner record from referenced module
	 * @returns {Enumerable}
	 */
	getCollection: function(referenced_record) {

		var referenced_guid = referenced_record.guid;

		// if needed - turn array into collection
		if (!(referenced_guid in this._collections_by_guid) || !this._collections_by_guid[referenced_guid].isEnumerable) {

			var collection = new Lava.data.Enumerable(this._collections_by_guid[referenced_guid]);
			this._collections_by_guid[referenced_guid] = collection;
			this._collection_listeners_by_guid[referenced_guid] = {
				added: collection.on('items_added', this._onCollectionRecordsAdded, this),
				removed: collection.on('items_removed', this._onCollectionRecordsRemoved, this)
			};

			this._collection_guid_to_foreign_record[collection.guid] = referenced_record;

		}

		return this._collections_by_guid[referenced_guid];

	},

	getCollectionCount: function(referenced_record) {

		var referenced_guid = referenced_record.guid,
			result = 0,
			collection = this._collections_by_guid[referenced_guid];

		if (collection) {

			result = collection.isEnumerable ? collection.getCount() : collection.length;

		}

		return result;

	},

	/**
	 * @param {Lava.data.RecordAbstract} referenced_record
	 * @param {Array.<Lava.data.RecordAbstract>|Enumerable} new_records
	 */
	replaceCollection: function(referenced_record, new_records) {

		var collection = this.getCollection(referenced_record);
		collection.removeAll();

		if (new_records.isEnumerable) {

			new_records = new_records.getValues();

		}

		// everything else will be handled by listeners
		collection.append(new_records);

	},

	_onCollectionRecordsAdded: function(collection, event_args) {

		var added_records = event_args.values,
			i = 0,
			count = added_records.length,
			record,
			storage,
			new_referenced_record = this._collection_guid_to_foreign_record[collection.guid];

		// remove records from old collections before adding them to new one
		for (; i < count; i++) {

			record = added_records[i];
			if (!(record.guid in this._storages_by_guid))
				Lava.throw("Record field: added record is either from different module or not record at all (2)");
			storage = this._storages_by_guid[record.guid];

			if (storage[this._name] != null) {
				this._unregisterRecord(record, storage[this._name]);
			}

			storage[this._name] = new_referenced_record;

			this._fireFieldChangedEvents(record);

		}

		if (this._foreign_key_field) {

			this._batchSetForeignKey(added_records, count, new_referenced_record.get('id'));

		}

	},

	_onCollectionRecordsRemoved: function(collection, event_args) {

		var removed_records = event_args.values,
			i = 0,
			count = removed_records.length,
			record,
			storage;

		for (; i < count; i++) {

			record = removed_records[i];
			storage = this._storages_by_guid[record.guid];
			storage[this._name] = 0;

			this._fireFieldChangedEvents(record);

		}

		if (this._foreign_key_field) {

			this._batchSetForeignKey(removed_records, count, 0);

		}

	},

	getReferencedModule: function() {

		return this._referenced_module;

	},

	_batchSetForeignKey: function(records, count, value) {

		var i = 0;

		Lava.suspendListener(this._foreign_key_changed_listener);

		for (; i < count; i++) {

			records[i].set(this._foreign_key_field_name, value);

		}

		Lava.resumeListener(this._foreign_key_changed_listener);

	},

	_getComparisonValues: function(record_a, record_b) {

		if (Lava.schema.DEBUG && (!(record_a.guid in this._storages_by_guid) || !(record_b.guid in this._storages_by_guid)))
			Lava.throw("isLess: record does not belong to this module");

		var ref_record_a = this._storages_by_guid[record_a.guid][this._name],
			ref_record_b = this._storages_by_guid[record_b.guid][this._name],
			value_a,
			value_b;

		if (ref_record_a) value_a = ref_record_a.get('id');
		if (ref_record_b) value_b = ref_record_b.get('id');

		return [value_a, value_b];

	},

	isLess: function(record_a, record_b) {

		var values = this._getComparisonValues(record_a, record_b);
		return values[0] < values[1];

	},

	isEqual: function(record_a, record_b) {

		var values = this._getComparisonValues(record_a, record_b);
		return values[0] == values[1];

	},

	destroy: function() {

		var guid;

		if (this._config.foreign_key_field) {

			this._foreign_key_field.removeListener(this._foreign_key_changed_listener);
			this._external_id_field.removeListener(this._external_id_changed_listener);
			this._referenced_module.removeListener(this._external_records_loaded_listener);

		}

		for (guid in this._collections_by_guid) {
			if (this._collections_by_guid[guid].isEnumerable) {
				this._collections_by_guid[guid].destroy();
			}
		}

		this._referenced_module
			= this._collections_by_guid
			= this._collections_by_id
			= this._collection_listeners_by_guid
			= this._collection_guid_to_foreign_record
			= this._foreign_key_field
			= this._external_id_field
			= null;

		this.Abstract$destroy();

	}

});