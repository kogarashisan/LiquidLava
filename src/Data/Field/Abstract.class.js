
/**
 * Field's value has changed in a record instance
 * @event Lava.data.field.Abstract#changed
 * @type {Object}
 * @property {Lava.data.RecordAbstract} record The record with changed field
 */

Lava.define(
'Lava.data.field.Abstract',
/**
 * Base class for all record fields
 *
 * @lends Lava.data.field.Abstract#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',

	/**
	 * Field's name
	 * @type {string}
	 */
	_name: null,
	/**
	 * Field's module
	 * @type {Lava.data.ModuleAbstract}
	 */
	_module: null,
	/**
	 * Field's config
	 * @type {_cField}
	 */
	_config: null,
	/**
	 * Reference to object from module with properties of all records
	 * @type {Object.<_tGUID, Object>}
	 */
	_storages_by_guid: null,
	/**
	 * May this field be assigned a <kw>null</kw> value
	 * @type {boolean}
	 */
	_is_nullable: false,

	/**
	 * Create the instance of a field
	 * @param {Lava.data.Module} module
	 * @param {string} name Field name
	 * @param {_cField} config
	 * @param {object} module_storages Reference to object from module with properties of all records
	 */
	init: function(module, name, config, module_storages) {

		this._module = module;
		this._name = name;
		this._config = config;
		this._storages_by_guid = module_storages;
		if ('is_nullable' in config) this._is_nullable = config.is_nullable;

	},

	/**
	 * Module calls this method when all field objects are already created,
	 * and passes the object which will become default property storage for all records.
	 * Common purpose of this method is to set this field's default value and attach listeners to other fields
	 */
	onModuleFieldsCreated: function(default_storage) {},

	/**
	 * Is the given `value` valid for assignment to this field
	 * @param {*} value
	 * @returns {boolean} True, if value is valid
	 */
	isValidValue: function(value) {

		return typeof(value) != 'undefined' && (value !== null || this._is_nullable);

	},

	/**
	 * Unlike {@link Lava.data.field.Abstract#isValidValue}, this is slow version of validity check,
	 * which returns a message in case the value is invalid
	 * @param {*} value
	 * @returns {?string}
	 */
	getInvalidReason: function(value) {

		var reason = null;

		if (typeof(value) == 'undefined') {

			reason = "Undefined is not a valid value";

		} else if (value == null && !this._is_nullable) {

			reason = "Cannot assign null to non-nullable field";

		}

		return reason;

	},

	/**
	 * Get `_is_nullable`
	 * @returns {boolean}
	 */
	isNullable: function() {

		return this._is_nullable;

	},

	/**
	 * Records are either loaded from existing data, or created with default properties.
	 * Here a field may perform initialization of new records, for example: generate an id
	 */
	initNewRecord: function(record, storage) {},

	/**
	 * Initialize a field from server-side data
	 * @param {Lava.data.RecordAbstract} record
	 * @param {Object} storage
	 * @param {Object} raw_properties
	 */
	'import': function(record, storage, raw_properties) {},

	/**
	 * Export the field's value back to server-side data
	 * @param {Lava.data.RecordAbstract} record
	 * @param {Object} destination_object Object with exported data
	 */
	'export': function(record, destination_object) {
		Lava.t("Abstract function call: export");
	},

	/**
	 * Get this field's value from a record's properties
	 * @param {Lava.data.RecordAbstract} record
	 * @param {Object} storage
	 */
	getValue: function(record, storage) {
		Lava.t("Abstract function call: getValue");
	},

	/**
	 * Set this field's value to record's properties
	 * @param {Lava.data.RecordAbstract} record
	 * @param {Object} storage
	 * @param {*} value
	 */
	setValue: function(record, storage, value) {
		Lava.t("Abstract function call: setValue");
	},

	/**
	 * Emit {@link Lava.data.field.Abstract#event:changed} and fire the changed events from record instance
	 * @param {Lava.data.RecordAbstract} record
	 */
	_fireFieldChangedEvents: function(record) {

		this._fire('changed', {record: record});
		record.firePropertyChangedEvents(this._name);

	},

	/**
	 * Helper method for importing values from server-side data. Performs validation
	 * @param {Object} storage
	 * @param {Object} raw_properties
	 * @returns {*}
	 */
	_getImportValue: function(storage, raw_properties) {

		if (Lava.schema.data.VALIDATE_IMPORT_DATA && !this.isValidValue(raw_properties[this._name]))
			Lava.t('Invalid value in import data (' + this._name + '): ' + raw_properties[this._name]);

		return raw_properties[this._name];

	},

	/**
	 * Compare values of this field in two records
	 * @param {Lava.data.RecordAbstract} record_a
	 * @param {Lava.data.RecordAbstract} record_b
	 * @returns {boolean} True, in case the value of this field in `record_a` is less than value in `record_b`
	 */
	isLess: function(record_a, record_b) {

		return this._storages_by_guid[record_a.guid][this._name] < this._storages_by_guid[record_b.guid][this._name];

	},

	/**
	 * Compare values of this field in two records
	 * @param record_a
	 * @param record_b
	 * @returns {boolean} True, in case values are equal
	 */
	isEqual: function(record_a, record_b) {

		return this._storages_by_guid[record_a.guid][this._name] == this._storages_by_guid[record_b.guid][this._name];

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		this._storages_by_guid = this._module = null;

	}

});