
Lava.define(
'Lava.data.field.Collection',
/**
 * @lends Lava.data.field.Collection#
 * @extends Lava.data.field.Abstract
 */
{

	Extends: 'Lava.data.field.Abstract',

	isCollectionField: true,

	_target_module: null,

	_target_record_field_name: null,
	_target_record_field: null,

	/**
	 * @param {Lava.data.Module} module
	 * @param {string} name
	 * @param {_cCollectionField} config
	 * @param {object} module_storages
	 */
	init: function(module, name, config, module_storages) {

		this.Abstract$init(module, name, config, module_storages);

		if (Lava.schema.DEBUG && !config.record_field)
			Lava.t("Missing corresponding Record field. Record fields are used by Collection fields.");

		this._target_record_field_name = config.record_field;

	},

	onModuleFieldsCreated: function(default_storage) {

		this._target_module = (this._config.module == 'this') ? this._module : this._module.getApp().getModule(this._config.module);
		this._target_record_field = this._target_module.getField(this._target_record_field_name);

		if (!this._target_record_field.isRecordField) Lava.t('CollectionField: mirror field is not Record field');

		if (this._target_record_field.getReferencedModule() !== this._module)
			Lava.t("CollectionField: module mismatch with mirror Record field");

	},

	isValidValue: function(value) {

		return Firestorm.getType(value) == 'array' || value.isEnumerable;

	},

	getInvalidReason: function(value) {

		var reason = this.Abstract$getInvalidReason(value);

		if (!reason) {

			if (Firestorm.getType(value) != 'array' && !value.isEnumerable) {

				reason = "Value is not array or enumerable";

			}

		}

		return  reason;

	},

	'import': function(record, storage, raw_properties) {

		if (raw_properties[this._name]) {

			if (Lava.schema.data.VALIDATE_IMPORT_DATA && !this.isValidValue(raw_properties[this._name]))
				Lava.t('Invalid value in import data');

			var i = 0,
				raw_records = raw_properties[this._name],
				count = raw_records.length;

			// raw data belongs to the framework, so it has right to modify it as it wants
			for (; i < count; i++) {

				// set foreign record in import data to this one
				raw_records[i][this._target_record_field_name] = record;

			}

			this._target_module.loadRecords(raw_properties[this._name]);

		}

	},

	'export': function(record, destination_object) {

	},

	getValue: function(record, storage) {

		return this._target_record_field.getCollection(record);

	},

	getCount: function(record, storage) {

		return this._target_record_field.getCollectionCount(record);

	},

	setValue: function(record, storage, new_records) {

		if (!Array.isArray(new_records) && !new_records.isEnumerable) Lava.t("CollectionField: only arrays and enumerables may be assigned");

		this._target_record_field.replaceCollection(record, new_records);

	},

	isLess: function(record_a, record_b) {

		return this._target_record_field.getCollectionCount(record_a) < this._target_record_field.getCollectionCount(record_b);

	},

	isEqual: function(record_a, record_b) {

		return this._target_record_field.getCollectionCount(record_a) == this._target_record_field.getCollectionCount(record_b);

	},

	destroy: function() {

		this._target_module = this._target_record_field_name = this._target_record_field = null;
		this.Abstract$destroy();

	}

});