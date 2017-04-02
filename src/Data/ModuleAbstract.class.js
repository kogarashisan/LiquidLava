
Lava.define(
'Lava.data.ModuleAbstract',
/**
 * Base class for modules
 *
 * @lends Lava.data.ModuleAbstract#
 * @extends Lava.mixin.Observable
 */
{

	Class: {
		is_abstract: true
	},

	Extends: 'Lava.mixin.Observable',

	/**
	 * Module's config
	 * @type {(_cModule|_cMetaStorage)}
	 */
	_config: null,
	/**
	 * Module's field instances
	 * @type {Object.<string, Lava.data.field.Abstract>}
	 */
	_fields: {},
	/**
	 * All records in this module
	 * @type {Array.<Lava.data.Record>}
	 */
	_records: [],
	/**
	 * Records by their global unique identifiers
	 * @type {Object.<string, Lava.data.Record>}
	 */
	_records_by_guid: {},
	/**
	 * Record's properties by their global unique identifiers
	 * @type {Object.<string, Lava.data.Record>}
	 */
	_properties_by_guid: {},
	/**
	 * Cached record class constructor
	 * @type {function}
	 */
	_record_constructor: null,

	/**
	 * Create field instances and return the default record properties object
	 * @param {(_cModule|_cMetaStorage)} config
	 * @returns {Object} Default record properties object with initial values for each field
	 */
	_createFields: function(config) {

		var field_name,
			type,
			constructor;

		for (field_name in config.fields) {

			type = config.fields[field_name].type || Lava.schema.data.DEFAULT_FIELD_TYPE;
			constructor = Lava.ClassManager.getConstructor(type, 'Lava.data.field');
			this._fields[field_name] = new constructor(
				this,
				field_name,
				config.fields[field_name],
				this._properties_by_guid
			);

		}

	},

	/**
	 * Called by App instance. Do not call this function directly.
	 */
	initFields: function() {

		var default_properties = {},
			field_name;

		for (field_name in this._fields) {

			this._fields[field_name].onModuleFieldsCreated(default_properties);

		}

		this._createRecordProperties = new Function(
			"return " + Lava.serializer.serialize(default_properties)
		);

	},

	/**
	 * Returns an object with record's initial properties. This function is generated in constructor
	 * @returns {Object}
	 */
	_createRecordProperties: function() {

		Lava.t('Module requires initialization');

	},

	/**
	 * Return a copy of local `_records` array
	 * @returns {Array.<Lava.data.Record>}
	 */
	getAllRecords: function() {

		return this._records.slice();

	},

	/**
	 * Get number of records in the module
	 * @returns {number}
	 */
	getCount: function() {

		return this._records.length;

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		var name;
			//i = 0,
			//count = this._records.length;

		/*for (; i < count; i++) {

			this._records[i].destroy();

		}*/

		for (name in this._fields) {

			this._fields[name].destroy();

		}

		this._records = this._records_by_guid = this._properties_by_guid = this._fields = null;

	}

});