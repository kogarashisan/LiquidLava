

_cField = {

	/**
	 * Class name
	 * @type {string}
	 */
	type: '',

	/**
	 * List of other fields which this field depends on.
	 * Used to fire 'changed' events.
	 *
	 * @type {Array.<string>}
	 */
	//depends: [],

	'default': '',

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
	 * Own record's field, which holds ID of the referenced record.
	 * Used by Relation fields.
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
	 * Name of the mirror Relation field
	 * @type {string}
	 */
	record_field: '',

	'export': false

};

_cModule = {

	/**
	 * Class name of the module itself
	 * @type {string}
	 */
	type: 'Module',

	record_class: 'Record',

	/**
	 * @type {Object.<string, _cField>}
	 */
	fields: {}

};

_cMetaStorage = {

	/**
	 * @type {Object.<string, _cField>}
	 */
	fields: {}

};