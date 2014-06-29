
/** @typedef {Array.<string|_cRawTag|_cRawDirective|_cRawBlock|_cInclude|_cRawExpression>} */
Lavadoc._tRawTemplate;

function _cRawTag() {

	this.type = 'tag';

	this.name = '';

	/**
	 * @type {Object.<string, string>}
	 */
	this.attributes = {};

	/**
	 * @type {_cRawX}
	 */
	this.x = {};

	/**
	 * @type {Lavadoc._tRawTemplate}
	 */
	this.content = [];

}

function _cRawDirective() {

	this.type = 'directive';

	this.name = '';

	/**
	 * @type {Object.<string, string>}
	 */
	this.attributes = {
		/**
		 * For x:define: name of the JS class, inherited from Widget
		 */
		controller: '',

		/**
		 * For common tags and tags inside x:define. Meaning depends on context
		 */
		role: '',

		name: ''
	};

	/**
	 * @type {Lavadoc._tRawTemplate}
	 */
	this.content = [];

}

function _cRawBlock() {

	this.type = 'block';

	// only for dynamic blocks
	this.class_locator = {
		/**
		 * @type {Lavadoc._tKnownViewLocatorType}
		 */
		locator_type: null,
		name: ''
	};

	this.real_class = '';

	this.name = '';
	/**
	 * @type {_cArgument}
	 */
	this.arguments = null;

	this.prefix = '$' || '#';
	/**
	 * @type {Object.<string, string>}
	 */
	this.hash = {};
	/**
	 * @type {Lavadoc._tRawTemplate}
	 */
	this.content = [];
	/**
	 * @type {Lavadoc._tRawTemplate}
	 */
	this.else_content = [];
	/**
	 * @type {Array.<_cArgument>}
	 */
	this.elseif_arguments = [];
	/**
	 * @type {Array.<Lavadoc._tRawTemplate>}
	 */
	this.elseif_contents = []; // array of arrays
}

function _cRawExpression() {

	this.type = 'expression';

	this.prefix = '$' || '#';

	/**
	 * @type {_cArgument}
	 */
	this.arguments = null;

}

/**
 * ExpressionParser parsing result
 * @extends _cArgumentCommon
 */
function _cRawArgument() {

	this.evaluator_src = '';

}

/**
 * TemplateParser intermediate objects used when parsing tags
 */
function _cRawAttribute() {

	this.name = '';

	this.value = '';

}

/**
 * TemplateParser intermediate object with contents of all prefixed attributes
 */
function _cRawX() {

	this.type = 'view' || 'container';

	this.event = {};

	this.bind = {};

	this.style = {};

	this.classes = '';

	// comma-separated list of targets
	this.roles = '';

	this.container_class = '';

	this.resource_id = '';

}

