
Lava.define(
'Lava.data.field.Abstract',
/**
 * @lends Lava.data.field.Abstract#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',

	/**
	 * @type {string}
	 */
	_name: null,
	_module: null,
	_config: null,
	/**
	 * @type {Object.<Lavadoc._tGUID, Object>}
	 */
	_storages_by_guid: null,
	/**
	 * @type {boolean}
	 */
	_is_nullable: false,

	/**
	 * @param {Lava.data.Module} module
	 * @param {string} name
	 * @param {_cField} config
	 * @param {object} module_storages
	 */
	init: function(module, name, config, module_storages) {

		this._module = module;
		this._name = name;
		this._config = config;
		this._storages_by_guid = module_storages;
		if ('is_nullable' in config) this._is_nullable = config.is_nullable;

	},

	/**
	 * Module calls it, when all field objects are already created,
	 * and passes the object which will become default property storage for all records.
	 * It's common purpose is to set this field's default value and attach listeners to other fields.
	 */
	onModuleFieldsCreated: function(default_storage) {},

	/**
	 * @param {*} value
	 * @returns {boolean}
	 */
	isValidValue: function(value) {

		return typeof(value) != 'undefined' && (value !== null || this._is_nullable);

	},

	/**
	 * Unlike isValidValue(), this is slow version of this check, which returns a message in case the value is invalid
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

	isNullable: function() {

		return this._is_nullable;

	},

	/**
	 * Records are either loaded from existing data, or created with default storage.
	 * Here a field may perform initialization of new records, for example: generate an id.
	 */
	initNewRecord: function(record, storage) {},

	'import': function(record, storage, raw_properties) {

	},

	'export': function(record, destination_object) {
		Lava.t("Abstract function call: export");
	},

	getValue: function(record, storage) {
		Lava.t("Abstract function call: getValue");
	},

	setValue: function(record, storage, value) {
		Lava.t("Abstract function call: setValue");
	},

	_fireFieldChangedEvents: function(record) {

		this._fire('changed', {record: record});
		record.firePropertyChangedEvents(this._name);

	},

	_getImportValue: function(storage, raw_properties) {

		if (Lava.schema.data.VALIDATE_IMPORT_DATA && !this.isValidValue(raw_properties[this._name]))
			Lava.t('Invalid value in import data (' + this._name + '): ' + raw_properties[this._name]);

		return raw_properties[this._name];

	},

	isLess: function(record_a, record_b) {

		return this._storages_by_guid[record_a.guid][this._name] < this._storages_by_guid[record_b.guid][this._name];

	},

	isEqual: function(record_a, record_b) {

		return this._storages_by_guid[record_a.guid][this._name] == this._storages_by_guid[record_b.guid][this._name];

	},

	destroy: function() {

		this._storages_by_guid = this._module = null;

	}

});