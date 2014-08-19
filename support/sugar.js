

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

_cSugarContentTemplate = {

	type: _cSugarContentSchemaTypes.template,

	// optional
	name: ''

};

_cSugarContentTemplateCollection = {

	type: _cSugarContentSchemaTypes.template_collection,

	name: '',

	tag_name: ''

};

_cSugarContentTemplateHash = {

	type: _cSugarContentSchemaTypes.template_hash,

	name: '',

	tag_name: 'template'

};

_cSugarContentObject = {

	type: _cSugarContentSchemaTypes.object,

	name: '',

	/** @type {Object.<string, _cSugarAttribute>} */
	attribute_mappings: null,

	/** @type {Object.<string, _cSugarObjectTag>} */
	tag_mappings: null

};

_cSugarContentObjectCollection = {

	type: _cSugarContentSchemaTypes.object_collection,

	name: '',

	tag_name: '',

	/** @type {Object.<string, _cSugarAttribute>} */
	attribute_mappings: null,

	/** @type {Object.<string, _cSugarObjectTag>} */
	tag_mappings: null

};

_cSugarContentObjectHash = {

	type: _cSugarContentSchemaTypes.object_hash,

	name: '',

	tag_name: '',

	/** @type {Object.<string, _cSugarAttribute>} */
	attribute_mappings: null,

	/** @type {Object.<string, _cSugarObjectTag>} */
	tag_mappings: null

};

_cSugarContentObjectMap = {

	type: _cSugarContentSchemaTypes.object_map,

	/**
	 * @type {Object.<string, (_cSugarContentTemplate|_cSugarContentTemplateCollection|_cSugarContentObject|_cSugarContentObjectCollection)>}
	 */
	tag_roles: null

};

/**
 * @typedef {(_cSugarContentObjectMap|_cSugarContentTemplate|_cSugarContentTemplateCollection|_cSugarContentObject|_cSugarContentObjectCollection)} _tSugarContent
 */

_cSugarAttribute = {

	type: '',

	type_name: '',

	/** @type {?string} */
	name: ''

};

_cSugarObjectTag = {

	type: '',

	type_name: '',

	/** @type {?string} */
	name: ''

};

_cSugar = {

	/**
	 * Lava.system.Sugar inherited (or compatible) class
	 * @type {string}
	 */
	'class': '',

	/**
	 * The name of the real tag, which will be converted into widget configuration
	 * @type {string}
	 */
	tag_name: '',

	/** @type {_tSugarContent} */
	content_schema: null,

	/** @type {Object.<string, _cSugarAttribute>} */
	attribute_mappings: null,

	unknown_root_attributes: {
		type: '', // callback name
		container_resource_name: '' // for 'as_resource' action
	}
};

/**
 * Must specify either parse() or widget_title
 */
_cSugarSchema = {

	widget_title: '',

	/** @param {_cRawTag} raw_tag */
	parse: function(raw_tag) {}

};

_iSugarParser = {

	/**
	 * @param {_cSugar} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	parse: function(schema, raw_tag, widget_config) {}

};