
/**
 * @typedef {Array.<(string|_cRawTag|_cRawDirective|_cRawBlock|_cInclude|_cRawExpression)>} _tRawTemplate
 */

_cRawTag = {
	/**
	 * Block type
	 * @type {string}
	 * @const
	 */
	type: 'tag',
	/**
	 * Tag name
	 * @type {string}
	 */
	name: '',
	/**
	 * Name-value hash of tag's attributes, excluding control attributes
	 * @type {Object.<string, string>}
	 */
	attributes: {},
	/**
	 * Attributes, that start with "x:"
	 * @type {_cRawX}
	 */
	x: {},
	/**
	 * Tag's content
	 * @type {?_tRawTemplate}
	 */
	content: []
};

/**
 * Directive is a tag with name starting with "x:"
 */
_cRawDirective = {
	/**
	 * Block type
	 * @type {string}
	 * @const
	 */
	type: 'directive',
	/**
	 * Directive name, without the control prefix ("x:")
	 * @type {string}
	 */
	name: '',
	/**
	 * Directive's attributes, same as in {@link _cRawTag}
	 * @type {Object.<string, string>}
	 */
	attributes: {
		/**
		 * For x:define: name of the JS class, inherited from Widget (default namespace is "Lava.widget")
		 */
		controller: '',

		name: ''
	},
	/**
	 * Directive's content
	 * @type {_tRawTemplate}
	 */
	content: []
};

/** @enum {string} */
_iBlockPrefix = {
	/**
	 * View without container
	 * @alias #
	 */
	'#': '#',
	/** View with Metamorph container */
	'$': '$'
};

/**
 * Block, that represents a view
 */
_cRawBlock = {

	/**
	 * Block type
	 * @type {string}
	 * @const
	 */
	type: 'block',
	/**
	 * For blocks with dynamic class name
	 * @type {Object}
	 */
	class_locator: {
		/**
		 * @type {_eKnownViewLocatorType}
		 */
		locator_type: null,
		name: ''
	},
	/**
	 * Real class name (default namespace is "Lava.widget")
	 * @type {string}
	 */
	real_class: '',
	/**
	 * Block's name
	 * @type {string}
	 */
	name: '',
	/**
	 * Array with single argument (the arguments from view's parentheses)
	 * @type {Array.<_cArgument>}
	 */
	arguments: null,
	/**
	 * Block's prefix which defines it's container type
	 * @type {_iBlockPrefix}
	 */
	prefix: null,
	/**
	 * Name-value hash of block's options
	 * @type {Object.<string, string>}
	 */
	hash: {},
	/**
	 * Block's content
	 * @type {_tRawTemplate}
	 */
	content: [],
	/**
	 * Content of the block's "else" section
	 * @type {_tRawTemplate}
	 */
	else_content: [],
	/**
	 * Argument configs for the block's "elseif' sections
	 * @type {Array.<_cArgument>}
	 */
	elseif_arguments: [],
	/**
	 * Content of the "elseif" sections
	 * @type {Array.<_tRawTemplate>}
	 */
	elseif_content: [] // array of arrays
};

_cRawExpression = {
	/**
	 * Block type
	 * @type {string}
	 * @const
	 */
	type: 'expression',
	/**
	 * Prefix, which defines container for this expression
	 * @type {_iBlockPrefix}
	 */
	prefix: null,
	/**
	 * Array with single expression's argument
	 * @type {Array.<_cArgument>}
	 */
	arguments: null
};

/**
 * TemplateParser's intermediate objects used when parsing tags
 */
_cRawAttribute = {
	/**
	 * Attribute name
	 * @type {string}
	 */
	name: '',
	/**
	 * Attribute value
	 * @type {string}
	 */
	value: ''
};

/**
 * TemplateParser's intermediate object with content of all control attributes
 */
_cRawX = {
	/**
	 * 'view' || 'container'
	 * @type {string}
	 */
	type: null,
	/**
	 * @type {Object}
	 */
	'dom-event': {},
	/**
	 * @type {Object}
	 */
	bind: {},
	/**
	 * @type {Object}
	 */
	style: {},
	/**
	 * @type {string}
	 */
	classes: '',
	/**
	 * @type {string}
	 */
	container_class: '',
	/**
	 * @type {string}
	 */
	resource_id: ''
};

