

_cField = {

	/**
	 * Field class name (default namespace is Lava.data.field)
	 * @type {string}
	 */
	type: null,

	/**
	 * List of other fields which this field depends on.
	 * Used to fire 'changed' events
	 *
	 * @type {Array.<string>}
	 */
	//depends: [],

	/**
	 * Field's value for new records
	 * @type {*}
	 */
	'default': null,

	/**
	 * May this field be assigned <kw>null</kw>
	 * @type {boolean}
	 */
	is_nullable: false

};

/**
 * @extends {_cField}
 */
_cRecordField = {

	/**
	 * Name of the referenced module
	 * @type {string}
	 */
	module: '',

	/**
	 * Local field, which holds ID of the referenced record
	 * @type {string}
	 */
	foreign_key_field: ''

};

/**
 * @extends {_cField}
 */
_cCollectionField = {

	/**
	 * Name of the module which is source for records
	 * @type {string}
	 */
	module: '',

	/**
	 * Name of the mirror Record field
	 * @type {string}
	 */
	record_field: '',

	/**
	 * Should the collection be exported as array
	 * @type {boolean}
	 */
	'export': false

};

_cModule = {

	/**
	 * Class name of the module (default namespace is Lava.data)
	 * @type {string}
	 */
	type: 'Module',

	/**
	 * Class for records in the module (default namespace is "Lava.data")
	 * @type {string}
	 */
	record_class: 'Record',

	/**
	 * Field settings
	 * @type {Object.<string, _cField>}
	 */
	fields: {}

};

_cMetaStorage = {

	/**
	 * Field settings
	 * @type {Object.<string, _cField>}
	 */
	fields: {}

};