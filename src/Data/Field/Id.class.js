
Lava.define(
'Lava.data.field.Id',
/**
 * Holds a positive integer, does NOT generate id's automatically
 * @lends Lava.data.field.Id#
 * @extends Lava.data.field.Abstract
 */
{

	Extends: 'Lava.data.field.Abstract',

	Shared: '_shared',

	_shared: {
		valid_value_regex: /^[1-9]\d*$/
	},

	_is_nullable: true,

	init: function(module, name, config, module_storages) {

		if (Lava.schema.DEBUG && (('is_nullable' in config) || ('default' in config)))
			Lava.t("Standard ID field can not be configured as nullable or have a default value");

		this.Abstract$init(module, name, config, module_storages);

	},

	onModuleFieldsCreated: function(default_storage) {

		default_storage[this._name] = null;

	},

	isValidValue: function(value) {

		return (value === null && this._is_nullable) || (typeof(value) == 'number' && this._shared.valid_value_regex.test(value));

	},

	getInvalidReason: function(value) {

		var reason = this.Abstract$getInvalidReason(value);

		if (!reason) {

			if (typeof(value) != 'number') {

				reason = "Value is not a number";

			} else if (this._shared.valid_value_regex.test(value)) {

				reason = "Valid values for ID field are positive integers";

			}

		}

		return reason;

	},

	'import': function(record, storage, raw_properties) {

		if (this._name in raw_properties) {

			storage[this._name] = this._getImportValue(storage, raw_properties);

		} else {

			Lava.t("Import record must have an ID");

		}

	},

	'export': function(record, destination_object) {

		destination_object[this._name] = this._storages_by_guid[record.guid][this._name];

	},

	getValue: function(record, storage) {

		return storage[this._name];

	},

	setValue: function(record, storage, value) {

		Lava.t("Standard id field must not be set");

	}

});