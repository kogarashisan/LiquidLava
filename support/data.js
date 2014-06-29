

function _cField() {

	/**
	 * Class name
	 * @type {string}
	 */
	this.type = '';

	/**
	 * List of other fields which this field depends on.
	 * Used to fire 'changed' events.
	 *
	 * @type {Array.<string>}
	 */
	//this.depends = [];

	this.default = '';

	this.is_nullable = false;

}

/**
 * @extends {_cField}
 */
function _cRecordField() {

	_cField.call(this);

	/**
	 * Name of the referenced module
	 * @type {string}
	 */
	this.module = '';

	/**
	 * Own record's field, which holds ID of the referenced record.
	 * Used by Relation fields.
	 * @type {string}
	 */
	this.foreign_key_field = '';

}

/**
 * @extends {_cField}
 */
function _cCollectionField() {

	_cField.call(this);

	/**
	 * Name of the module which is source for records
	 * @type {string}
	 */
	this.module = '';

	/**
	 * Name of the mirror Relation field
	 * @type {string}
	 */
	this.record_field = '';

	this.export = false;

}

function _cModule() {

	/**
	 * Class name of the module itself
	 * @type {string}
	 */
	this.type = 'Module';

	this.record_class = 'Record';

	/**
	 * @type {Object.<string, _cField>}
	 */
	this.fields = {};

}

function _cMetaStorage() {

	/**
	 * @type {Object.<string, _cField>}
	 */
	this.fields = {};

}