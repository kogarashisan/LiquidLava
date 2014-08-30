
/** @enum {string} */
_eSugarRootContentType = {
	storage_object: 'storage_object',
	include: 'include',
	storage: 'storage',
	tag_map: 'union'
	//main_template: 'main_template'
};

_cSugarTag = {

	type: 'include',
	/**
	 * Only for `type='include'` - the name of include
	 */
	name: null

};

_cSugarContent = {

	/** @type {_eSugarRootContentType} */
	type: null,
	/**
	 * For `type='include'` - name of the include,
	 * For `type='storage_object'` - name of the object in storage
	 */
	name: null,
	/**
	 * for `type='map'`:
	 * @type {Object.<string, _cSugarTag>}
	 */
	tag_roles: {}

};

_cSugar = {

	'class': '',

	tag_name: '',

	/** @type {_cSugarContent} */
	content_schema: null,

	/** @type {Object.<string, _cSugarRootAttribute>} */
	attribute_mappings: null,

	root_resource_name: '' // for attributes without schema

};

/**
 * Equals to keys in {@link Lava.system.Sugar#_root_attributes_handlers}
 * @enum {string}
 */
_eSugarRootAttributeType = {
	expression_option: 'expression_option',
	targets_option: 'targets_option',
	property: 'property',
	'switch': 'switch',
	option: 'option',
	id: 'id'
};

_cSugarRootAttribute = {

	/**
	 * @type {_eSugarRootAttributeType}
	 */
	type: null,

	type_name: '',

	name: '' // the name in widget config

};

/**
 * Must have either `parse()` or `widget_title`
 */
_cSugarSchema = {

	widget_title: '',

	/** @param {_cRawTag} raw_tag */
	parse: function(raw_tag) {}

};

/**
 * @interface
 */
_iSugarParser = {

	/**
	 * @param {_cSugar} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	parse: function(schema, raw_tag, widget_config) {}

};