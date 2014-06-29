

/** @enum {string} */
var _cSugarContentSchemaTypes = {
	template_collection: 'template_collection',
	template_hash: 'template_hash',
	object_collection: 'object_collection',
	object_hash: 'object_hash',
	template: 'template',
	object_map: 'object_map',
	object: 'object'
};

function _cSugarContentTemplate() {

	this.type = _cSugarContentSchemaTypes.template;

	// optional
	this.name = '';

}

function _cSugarContentTemplateCollection() {

	this.type = _cSugarContentSchemaTypes.template_collection;

	this.name = '';

	this.tag_name = '';

}

function _cSugarContentTemplateHash() {

	this.type = _cSugarContentSchemaTypes.template_hash;

	this.name = '';

	this.tag_name = 'template';

}

function _cSugarContentObject() {

	this.type = _cSugarContentSchemaTypes.object;

	this.name = '';

	/** @type {Object.<string, _cSugarAttribute>} */
	this.attribute_mappings = null;

	/** @type {Object.<string, _cSugarObjectTag>} */
	this.tag_mappings = null;

}

function _cSugarContentObjectCollection() {

	this.type = _cSugarContentSchemaTypes.object_collection;

	this.name = '';

	this.tag_name = '';

	/** @type {Object.<string, _cSugarAttribute>} */
	this.attribute_mappings = null;

	/** @type {Object.<string, _cSugarObjectTag>} */
	this.tag_mappings = null;

}

function _cSugarContentObjectHash() {

	this.type = _cSugarContentSchemaTypes.object_hash;

	this.name = '';

	this.tag_name = '';

	/** @type {Object.<string, _cSugarAttribute>} */
	this.attribute_mappings = null;

	/** @type {Object.<string, _cSugarObjectTag>} */
	this.tag_mappings = null;

}

function _cSugarContentObjectMap() {

	this.type = _cSugarContentSchemaTypes.object_map;

	/**
	 * @type {Object.<string, (_cSugarContentTemplate|_cSugarContentTemplateCollection|_cSugarContentObject|_cSugarContentObjectCollection)>}
	 */
	this.tag_roles = null;

}

/** @type {(_cSugarContentObjectMap|_cSugarContentTemplate|_cSugarContentTemplateCollection|_cSugarContentObject|_cSugarContentObjectCollection)} */
Lavadoc._tSugarContent;

function _cSugarAttribute() {

	this.type = '';

	this.type_name = '';

	/** @type {?string} */
	this.name = '';

}

function _cSugarObjectTag() {

	this.type = '';

	this.type_name = '';

	/** @type {?string} */
	this.name = '';

}


function _cSugar() {

	/**
	 * Lava.system.Sugar inherited (or compatible) class
	 * @type {string}
	 */
	this.class = '';

	/**
	 * The name of the real tag, which will be converted into widget configuration
	 * @type {string}
	 */
	this.tag_name = '';

	/** @type {Lavadoc._tSugarContent} */
	this.content_schema = null;

	/** @type {Object.<string, _cSugarAttribute>} */
	this.attribute_mappings = null;

	this.unknown_root_attributes = {
		type: '', // callback name
		container_resource_name: '' // for 'as_resource' action
	};

}

/**
 * Must specify either parse() or widget_title
 */
function _cSugarSchema() {

	this.widget_title = '';

	/** @param {_cRawTag} raw_tag */
	this.parse = function(raw_tag) {};

}

function _iSugarParser() {

	/**
	 * @param {_cSugar} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	this.parse = function(schema, raw_tag, widget_config) {};

}