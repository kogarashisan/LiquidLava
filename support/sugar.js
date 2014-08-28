

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

	type: 'template',

	// optional
	name: ''

};

_cSugarContentTemplateCollection = {

	type: 'template_collection',

	name: '',

	tag_name: ''

};

_cSugarContentTemplateHash = {

	type: 'template_hash',

	name: '',

	tag_name: 'template'

};

_cSugarContentObject = {

	type: 'object',

	name: '',

	/**
	 * If root is object - it must not have this setting
	 * @type {Object.<string, _cSugarAttribute>}
	 */
	attribute_mappings: null,

	/** @type {Object.<string, _cSugarObjectTag>} */
	tag_mappings: null

};

_cSugarContentObjectCollection = {

	type: 'object_collection',

	name: '',

	tag_name: '',

	/** @type {Object.<string, _cSugarAttribute>} */
	attribute_mappings: null,

	/** @type {Object.<string, _cSugarObjectTag>} */
	tag_mappings: null

};

_cSugarContentObjectHash = {

	type: 'object_hash',

	name: '',

	tag_name: '',

	/** @type {Object.<string, _cSugarAttribute>} */
	attribute_mappings: null,

	/** @type {Object.<string, _cSugarObjectTag>} */
	tag_mappings: null

};

_cSugarContentObjectMap = {

	type: 'object_map',

	/**
	 * @type {Object.<string, (_cSugarContentTemplate|_cSugarContentTemplateCollection|_cSugarContentObject|_cSugarContentObjectCollection)>}
	 */
	tag_roles: null

};

/**
 * @typedef {(_cSugarContentObjectMap|_cSugarContentTemplate|_cSugarContentTemplateCollection|_cSugarContentObject|_cSugarContentObjectCollection)} _tSugarContent
 */

_cSugarAttribute = {

	type: 'object_property',

	type_name: '',

	/** @type {?string} */
	name: ''

};

/**
 * Equals to keys in {@link Lava.system.Sugar#_root_attributes_handlers}
 * @enum {string}
 */
_cSugarRootAttributeTypes = {
	id: 'id',
	option: 'option',
	'switch': 'switch',
	property: 'property',
	targets_option: 'targets_option',
	expression_option: 'expression_option'
};

_cSugarRootAttribute = {

	/**
	 * @type {_cSugarRootAttributeTypes}
	 */
	type: null,

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

	/** @type {Object.<string, _cSugarRootAttribute>} */
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