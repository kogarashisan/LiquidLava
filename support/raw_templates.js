
/**
 * @typedef {Array.<(string|_cRawTag|_cRawDirective|_cRawBlock|_cInclude|_cRawExpression)>} _tRawTemplate
 */

_cRawTag = {

	type: 'tag',

	name: '',

	/**
	 * @type {Object.<string, string>}
	 */
	attributes: {},

	/**
	 * @type {_cRawX}
	 */
	x: {},

	/**
	 * @type {_tRawTemplate}
	 */
	content: []

};

_cRawDirective = {

	type: 'directive',

	name: '',

	/**
	 * @type {Object.<string, string>}
	 */
	attributes: {
		/**
		 * For x:define: name of the JS class, inherited from Widget
		 */
		controller: '',

		/**
		 * For common tags and tags inside x:define. Meaning depends on context
		 */
		role: '',

		name: ''
	},

	/**
	 * @type {_tRawTemplate}
	 */
	content: []

};

_cRawBlock = {

	type: 'block',

	// only for dynamic blocks
	class_locator: {
		/**
		 * @type {_tKnownViewLocatorType}
		 */
		locator_type: null,
		name: ''
	},

	real_class: '',

	name: '',
	/**
	 * @type {_cArgument}
	 */
	arguments: null,

	prefix: '$' || '#',
	/**
	 * @type {Object.<string, string>}
	 */
	hash: {},
	/**
	 * @type {_tRawTemplate}
	 */
	content: [],
	/**
	 * @type {_tRawTemplate}
	 */
	else_content: [],
	/**
	 * @type {Array.<_cArgument>}
	 */
	elseif_arguments: [],
	/**
	 * @type {Array.<_tRawTemplate>}
	 */
	elseif_contents: [] // array of arrays
};

_cRawExpression = {

	type: 'expression',

	prefix: '$' || '#',

	/**
	 * @type {_cArgument}
	 */
	arguments: null

};

/**
 * ExpressionParser parsing result
 * @extends _cArgumentCommon
 */
_cRawArgument = {

	evaluator_src: ''

};

/**
 * TemplateParser intermediate objects used when parsing tags
 */
_cRawAttribute = {

	name: '',

	value: ''

};

/**
 * TemplateParser intermediate object with contents of all prefixed attributes
 */
_cRawX = {

	type: 'view' || 'container',

	event: {},

	bind: {},

	style: {},

	classes: '',

	// comma-separated list of targets
	roles: '',

	container_class: '',

	resource_id: ''

};

