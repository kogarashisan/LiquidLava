
Lava.define(
'Lava.data.field.Basic',
/**
 * Field with no restrictions on value type
 *
 * @lends Lava.data.field.Basic#
 * @extends Lava.data.field.Abstract
 */
{

	Extends: 'Lava.data.field.Abstract',

	/**
	 * Field's default value from config
	 * @type {*}
	 */
	_default: null,

	init: function(module, name, config, module_storages) {

		this.Abstract$init(module, name, config, module_storages);

		if ('default' in config) {

			this._default = config['default'];

		}

		if (!this._is_nullable && this._default == null) {

			// the default value could be provided in derived classes
			Lava.t("Non-nullable Basic fields must have a default value");

		}

		if (Lava.schema.DEBUG && !this.isValidValue(this._default))
			Lava.t("Field was configured with invalid default value. Module: " + this._module.getName() + ", field name: " + this._name);

	},

	onModuleFieldsCreated: function(default_storage) {

		default_storage[this._name] = this._default;

	},

	'import': function(record, storage, raw_properties) {

		if (this._name in raw_properties) {

			storage[this._name] = this._getImportValue(storage, raw_properties);

		}

	},

	'export': function(record, destination_object) {

		destination_object[this._name] = this._storages_by_guid[record.guid][this._name];

	},

	getValue: function(record, storage) {

		return storage[this._name];

	},

	setValue: function(record, storage, value) {

		if (storage[this._name] !== value) {

			if (!this.isValidValue(value)) Lava.t('[Field name=' + this._name + '] Invalid field value: '
				+ value + ". Reason: " + this.getInvalidReason(value));

			storage[this._name] = value;
			this._fireFieldChangedEvents(record);

		}

	}

});