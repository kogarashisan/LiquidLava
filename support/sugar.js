
/** @enum {string} */
_eSugarRootContentType = {
	/** Content of sugar tag is an object from {@link _cWidget#storage} */
	storage_object: 'storage_object',
	/** Entire content is widget's include */
	include: 'include',
	/** Entire content should be parsed as storage */
	storage: 'storage',
	/** Content of sugar tag may contain tags from storage and tags with includes */
	union: 'union'
	//main_template: 'main_template'
};

_cSugarTag = {

	/**
	 * @type {string}
	 * @const
	 */
	type: 'include',
	/**
	 * Only for `type='include'` - the name of include
	 * @type {string}
	 */
	name: null

};

_cSugarContent = {

	/** @type {_eSugarRootContentType} */
	type: null,
	/**
	 * For `type='include'` - name of the include,
	 * for `type='storage_object'` - name of the object in storage
	 * @type {string}
	 */
	name: null,
	/**
	 * For `type='map'`
	 * @type {Object.<string, _cSugarTag>}
	 */
	tag_roles: {}

};

_cSugar = {

	/**
	 * Full name of the class that will parse widget's sugar. See {@link Lava#getWidgetSugarInstance}
	 * @type {string}
	 */
	'class': '',
	/**
	 * Custom tag name that will be used to define the widget
	 * @type {string}
	 */
	tag_name: '',
	/**
	 * What can be inside the sugar tag
	 * @type {?_cSugarContent}
	 */
	content_schema: null,
	/**
	 * Actions for attributes on root tag
	 * @type {Object.<string, _cSugarRootAttribute>}
	 */
	attribute_mappings: null,
	/**
	 * Resource name for root attributes, which are not described in `attribute_mappings`
	 * @type {string}
	 */
	root_resource_name: ''

};

/**
 * Equals to keys in {@link Lava.system.Sugar#_root_attributes_handlers}
 * @enum {string}
 */
_eSugarRootAttributeType = {
	/** Attribute value will be parsed by {@link Lava.ExpressionParser} and stored in {@link _cView#options} */
	expressions_option: 'expressions_option',
	/** Attribute value will be parsed by {@link Lava.parsers.Common#parseTargets} and stored in {@link _cView#options} */
	targets_option: 'targets_option',
	/** Content will be optionally converted and stored in {@link _cWidget#properties} */
	property: 'property',
	/** Boolean option. Empty value is converted to <kw>true</kw> */
	'switch': 'switch',
	/** Content of the attribute will be optionally converted and stored in {@link _cView#options} */
	option: 'option',
	/** This is {@link _cView#id} attribute */
	id: 'id'
};

/**
 * Attribute on tag that belongs to a sugar
 */
_cSugarRootAttribute = {

	/**
	 * @type {_eSugarRootAttributeType}
	 */
	type: null,

	/**
	 * Name from {@link Lava.types}
	 * @type {string}
	 */
	type_name: '',

	/**
	 * The name in widget config
	 * @type {string}
	 */
	name: ''

};

/**
 * Must have either `parse()` or `widget_title`
 */
_cSugarSchema = {

	/**
	 * Name of global widget from {@link Lava#widgets}
	 * @type {string}
	 */
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