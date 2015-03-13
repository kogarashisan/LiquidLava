/**
 * Fired, when the field's value changes: local record (`child`) now references the `collection_owner`
 * @event Lava.data.field.Record#added_child
 * @type {Object}
 * @property {Lava.data.Record} collection_owner New referenced record
 * @property {Lava.data.Record} child Referencing record from local module
 */

/**
 * Fired, when the field's value changes: local record (`child`) no longer references the `collection_owner`
 * @event Lava.data.field.Record#removed_child
 * @type {Object}
 * @property {Lava.data.Record} collection_owner Old referenced record
 * @property {Lava.data.Record} child Referencing record from local module
 */

Lava.define(
'Lava.data.field.Record',
/**
 * References a record (usually from another module).
 * Also maintains collections of records, grouped by this field (used by mirror Collection field)
 * and synchronizes it's state with accompanying ForeignKey field
 *
 * @lends Lava.data.field.Record#
 * @extends Lava.data.field.Abstract
 */
{

	Extends: 'Lava.data.field.Abstract',

	/**
	 * This class is instance of a Record field
	 * @type {boolean}
	 * @const
	 */
	isRecordField: true,

	/**
	 * Owner module for the records of this field
	 * @type {Lava.data.Module}
	 */
	_referenced_module: null,

	/**
	 * Records, grouped by this field. Serves as a helper for mirror Collection field.
	 * Key is GUID of the foreign record, value is collection of records from local module
	 * @type {Object.<string, Array.<Lava.data.Record>>}
	 */
	_collections_by_foreign_guid: {},

	/**
	 * Name of accompanying {@link Lava.data.field.ForeignKey} field from local module. Example: 'parent_id'
	 * @type {string}
	 */
	_foreign_key_field_name: null,
	/**
	 * Local field with ID of the record in external module
	 * @type {Lava.data.field.ForeignKey}
	 */
	_foreign_key_field: null,
	/**
	 * Listener for {@link Lava.data.field.Abstract#event:changed} in `_foreign_key_field`
	 * @type {_tListener}
	 */
	_foreign_key_changed_listener: null,

	/**
	 * The {@link Lava.data.field.Id} field in external module
	 * @type {Lava.data.field.Abstract}
	 */
	_external_id_field: null,
	/**
	 * The listener for external ID creation event ({@link Lava.data.field.Abstract#event:changed} in `_external_id_field` field)
	 * @type {_tListener}
	 */
	_external_id_changed_listener: null,
	/**
	 * Listener for {@link Lava.data.Module#event:records_loaded} in external module
	 * @type {_tListener}
	 */
	_external_records_loaded_listener: null,

	/**
	 * The foreign ID value, when there is no referenced record
	 * @const
	 */
	EMPTY_FOREIGN_ID: 0,

	_is_nullable: true,

	/**
	 * @param module
	 * @param name
	 * @param {_cRecordField} config
	 * @param module_storage
	 */
	init: function(module, name, config, module_storage) {

		this.Abstract$init(module, name, config, module_storage);
		this._referenced_module = (config.module == 'this') ? module : module.getApp().getModule(config.module);

	},

	onModuleFieldsCreated: function(default_properties) {

		if (this._config.foreign_key_field) {

			if (Lava.schema.DEBUG && !this._referenced_module.hasField('id')) Lava.t("field/Record: the referenced module must have an ID field");

			this._foreign_key_field_name = this._config.foreign_key_field;
			this._foreign_key_field = this._module.getField(this._foreign_key_field_name);
			if (Lava.schema.DEBUG && !this._foreign_key_field.isForeignKey) Lava.t();
			this._foreign_key_changed_listener = this._foreign_key_field.on('changed', this._onForeignKeyChanged, this);
			this._external_id_field = this._referenced_module.getField('id');
			this._external_id_changed_listener = this._external_id_field.on('changed', this._onExternalIdCreated, this);
			this._external_records_loaded_listener = this._referenced_module.on('records_loaded', this._onReferencedModuleRecordsLoaded, this);

		}

		// this field stores the referenced record
		default_properties[this._name] = null;

	},

	/**
	 * There may be local records that reference external records, which are not yet loaded (by ForeignKey).
	 * This field is <kw>null</kw> for them.
	 * When referenced records are loaded - local records must update this field with the newly loaded instances
	 * @param {Lava.data.Module} module
	 * @param {Lava.data.Module#event:records_loaded} event_args
	 */
	_onReferencedModuleRecordsLoaded: function(module, event_args) {

		var records = event_args.records,
			count = records.length,
			i = 0,
			local_records,
			local_count,
			local_index,
			local_record;

		for (; i < count; i++) {

			local_records = this._foreign_key_field.getCollection(records[i].get('id'));

			// these records belong to this module and have this field null.
			// Now, as the foreign record is loaded - the field can be updated.
			for (local_count = local_records.length, local_index = 0; local_index < local_count; local_index++) {
				local_record = local_records[local_index];
				this._properties_by_guid[local_record.guid][this._name] = records[i];
				this._fireFieldChangedEvents(local_record);
			}

		}

	},

	/**
	 * A record was saved to the database and assigned an id. Need to assign foreign keys for local records
	 * @param {Lava.data.field.Id} foreign_module_id_field
	 * @param {Lava.data.field.Abstract#event:changed} event_args
	 */
	_onExternalIdCreated: function(foreign_module_id_field, event_args) {

		var referenced_record = event_args.record, // record belongs to foreign module
			new_referenced_id = referenced_record.get('id'),
			collection,
			i = 0,
			count;

		if (referenced_record.guid in this._collections_by_foreign_guid) {

			collection = this._collections_by_foreign_guid[referenced_record.guid];

			// Set the value of foreign ID field in all local records that reference this foreign record.
			// Situation: there is a new record, which was created in the browser, and some records that reference it
			// (either new or loaded from database). It's new, so there are no records on server that reference it.
			if (this._foreign_key_field) {

				Lava.suspendListener(this._foreign_key_changed_listener);

				for (count = collection.length; i < count; i++) {

					collection[i].set(this._foreign_key_field_name, new_referenced_id);

				}

				Lava.resumeListener(this._foreign_key_changed_listener);

			}

		}

	},

	/**
	 * Fires, when local record's foreign id field is assigned a new value.
	 * Example:
	 * ```javascript
	 * record.set('category_id', 123); // 'record' is from local module, 123 - id of foreign record
	 * ```
	 * @param {Lava.data.field.ForeignKey} foreign_key_field
	 * @param {Lava.data.field.Abstract#event:changed} event_args
	 */
	_onForeignKeyChanged: function(foreign_key_field, event_args) {

		var record = event_args.record, // record belongs to this module
			properties = this._properties_by_guid[record.guid];

		if (properties[this._name] != null) {

			// remove old record from collection
			this._unregisterRecord(record, properties[this._name]);

		}

		if (properties[this._foreign_key_field_name]) {

			this._registerByReferencedId(record, properties, properties[this._foreign_key_field_name]);

		} else {

			properties[this._name] = null;

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

	initNewRecord: function(record, properties) {

		if (this._foreign_key_field && properties[this._foreign_key_field_name]) {

			this._registerByReferencedId(record, properties, properties[this._foreign_key_field_name]);

		}

	},

	'import': function(record, properties, raw_properties) {

		var foreign_id;

		if (this._foreign_key_field) {

			// if foreign id is in import - then it will replace the default value (if foreign kay has default)
			foreign_id = raw_properties[this._foreign_key_field_name] || properties[this._foreign_key_field_name];
			if (foreign_id) {
				this._registerByReferencedId(record, properties, foreign_id);
			}

		}

	},

	/**
	 * Update value of this field in local `record` and add the record to field's internal collections
	 * @param {Lava.data.Record} record The local record
	 * @param {Object} properties The properties of local record
	 * @param {string} referenced_record_id The id of foreign record, which it belongs to
	 */
	_registerByReferencedId: function(record, properties, referenced_record_id) {

		properties[this._name] = this._referenced_module.getRecordById(referenced_record_id) || null;

		if (properties[this._name]) {

			this._registerRecord(record, properties[this._name]);

		}

	},

	'export': function(record, destination_object) {

	},

	getValue: function(record, properties) {

		return properties[this._name];

	},

	setValue: function(record, properties, new_ref_record) {

		if (Lava.schema.data.VALIDATE_VALUES && !this.isValidValue(new_ref_record))
			Lava.t("Field/Record: assigned value is not valid. Reason: " + this.getInvalidReason(new_ref_record));

		if (properties[this._name] != null) {

			// remove from the old record's collection
			this._unregisterRecord(record, properties[this._name]);

		}

		properties[this._name] = new_ref_record;
		if (new_ref_record != null) {

			this._registerRecord(record, new_ref_record)

		}

		if (this._foreign_key_field) {

			Lava.suspendListener(this._foreign_key_changed_listener);

			if (new_ref_record != null) {

				// if this module has foreign_key_field then foreign module must have an ID column
				record.set(this._foreign_key_field_name, new_ref_record.get('id'));

			} else {

				record.set(this._foreign_key_field_name, this.EMPTY_FOREIGN_ID);

			}

			Lava.resumeListener(this._foreign_key_changed_listener);

		}

		this._fireFieldChangedEvents(record);

	},

	/**
	 * Remove `local_record` from field's internal collection referenced by `referenced_record`
	 * @param {Lava.data.Record} local_record
	 * @param {Lava.data.Record} referenced_record
	 */
	_unregisterRecord: function(local_record, referenced_record) {

		if (!Firestorm.Array.exclude(this._collections_by_foreign_guid[referenced_record.guid], local_record)) Lava.t();
		this._fire('removed_child', {
			collection_owner: referenced_record,
			child: local_record
		});

	},

	/**
	 * Add `local_record` to field's internal collection of records from local module, referenced by `referenced_record`
	 * @param {Lava.data.Record} local_record
	 * @param {Lava.data.Record} referenced_record The collection owner
	 */
	_registerRecord: function(local_record, referenced_record) {

		var referenced_guid = referenced_record.guid;

		if (referenced_guid in this._collections_by_foreign_guid) {

			if (Lava.schema.DEBUG && this._collections_by_foreign_guid[referenced_guid].indexOf(local_record) != -1)
				Lava.t("Duplicate record");
			this._collections_by_foreign_guid[referenced_guid].push(local_record);

		} else {

			this._collections_by_foreign_guid[referenced_guid] = [local_record];

		}

		this._fire('added_child', {
			collection_owner: referenced_record,
			child: local_record
		});

	},

	/**
	 * API for {@link Lava.data.field.Collection} field. Get all local records, which reference `referenced_record`
	 * @param {Lava.data.Record} referenced_record The collection's owner record from referenced module
	 * @returns {Array} All records
	 */
	getCollection: function(referenced_record) {

		return (referenced_record.guid in this._collections_by_foreign_guid)
			? this._collections_by_foreign_guid[referenced_record.guid].slice()
			: []; // fast operation: array of objects

	},

	/**
	 * API for {@link Lava.data.field.Collection} field. Get count of local records, which reference the `referenced_record`
	 * @param {Lava.data.Record} referenced_record The collection's owner record from referenced module
	 * @returns {Number}
	 */
	getCollectionCount: function(referenced_record) {

		var collection = this._collections_by_foreign_guid[referenced_record.guid];
		return collection ? collection.length : 0;

	},

	/**
	 * Get `_referenced_module`
	 * @returns {Lava.data.Module}
	 */
	getReferencedModule: function() {

		return this._referenced_module;

	},

	/**
	 * Get field's value equivalent for comparison
	 * @param {Lava.data.Record} record
	 * @returns {string}
	 */
	_getComparisonValue: function(record) {

		if (Lava.schema.DEBUG && !(record.guid in this._properties_by_guid)) Lava.t("isLess: record does not belong to this module");
		var ref_record_a = this._properties_by_guid[record.guid][this._name];
		// must return undefined, cause comparison against nulls behaves differently
		return ref_record_a ? ref_record_a.get('id') : void 0;

	},

	isLess: function(record_a, record_b) {

		return this._getComparisonValue(record_a) < this._getComparisonValue(record_b);

	},

	isEqual: function(record_a, record_b) {

		return this._getComparisonValue(record_a) == this._getComparisonValue(record_b);

	},

	destroy: function() {

		if (this._config.foreign_key_field) {

			this._foreign_key_field.removeListener(this._foreign_key_changed_listener);
			this._external_id_field.removeListener(this._external_id_changed_listener);

		}

		this._referenced_module.removeListener(this._external_records_loaded_listener);

		this._referenced_module
			= this._collections_by_foreign_guid
			= this._foreign_key_field
			= this._external_id_field
			= null;

		this.Abstract$destroy();

	}

});