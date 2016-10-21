
Lava.define(
'Lava.data.field.Id',
/**
 * Holds server-side IDs from database table, does NOT generate id's automatically.
 * Currently supports only positive integers as IDs
 *
 * @lends Lava.data.field.Id#
 * @extends Lava.data.field.Abstract
 */
{

	Extends: 'Lava.data.field.Abstract',

	/**
	 * Numbers, consisting of digits, not zero
	 * @type {RegExp}
	 */
	VALID_VALUE_REGEX: /^[1-9]\d*$/,

	/**
	 * ID may be null for new records, which are not saved into database yet
	 */
	_is_nullable: true,

	init: function(module, name, config, module_storage) {

		if (Lava.schema.DEBUG && (('is_nullable' in config) || ('default' in config)))
			Lava.t("Standard ID field can not be configured as nullable or have a default value");

		this.Abstract$init(module, name, config, module_storage);

	},

	onModuleFieldsCreated: function(default_properties) {

		default_properties[this._name] = null;

	},

	isValidValue: function(value) {

		return (value === null && this._is_nullable) || (typeof(value) == 'number' && this.VALID_VALUE_REGEX.test(value));

	},

	getInvalidReason: function(value) {

		var reason = this.Abstract$getInvalidReason(value);

		if (!reason) {

			if (typeof(value) != 'number') {

				reason = "Value is not a number";

			} else if (this.VALID_VALUE_REGEX.test(value)) {

				reason = "Valid values for ID field are positive integers";

			}

		}

		return reason;

	},

	'import': function(record, properties, raw_properties) {

		if (!(this._name in raw_properties)) Lava.t("Import record must have an ID");

		properties[this._name] = this._getImportValue(properties, raw_properties);

	},

	'export': function(record, destination_object) {

		destination_object[this._name] = this._properties_by_guid[record.guid][this._name];

	},

	getValue: function(record, properties) {

		return properties[this._name];

	},

	/**
	 * Throws an error
	 */
	setValue: function() {

		Lava.t("Standard id field must not be set");

	}

});