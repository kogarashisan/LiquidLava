
/**
 * // A comment for PHPStorm, cause it does not recognize @callback //
 * @typedef {function(x)} _tTransitionCallback
 * @ignore
 */

/**
 * Animation transition function (easing)
 * @callback _tTransitionCallback
 * @param {number} x Current animation position, 0 <= x <= 1
 * @returns {number} The distance value
 */

/** @typedef {number} _tGUID */

_cClassData = {

	/**
	 * Short name of the class (without namespace)
	 * @type {string}
	 */
	name: '',

	/**
	 * Long name (including namespace)
	 * @type {string}
	 */
	path: '',

	/**
	 * The raw class object, from which it was constructed
	 * @type {Object}
	 */
	source_object: {},

	/**
	 * How many parents does it have (via Extends directive)
	 * @type {number}
	 */
	hierarchy_index: 0,

	/**
	 * When Extends is present - a string with full name of the parent
	 * @type {string}
	 */
	extends: null,

	/** @type {Array.<string>} */
	implements: [],

	/**
	 * Class data of parent
	 * @type {_cClassData}
	 */
	parent_class_data: null,

	/**
	 * List of full paths to classes in the hierarchy, with this one being the last.
	 * @type {Array.<string>}
	 */
	hierarchy_paths: [],

	/**
	 * Used to build the class constructor.
	 * @type {Object}
	 */
	skeleton: {},

	/**
	 * For each function (and sometimes array) reference in skeleton - holds the actual data
	 * @type {Array}
	 */
	references: [],

	/**
	 * Holds shared objects
	 * @type {Object}
	 */
	shared: {},

	/**
	 * Temporary counter for class serialization
	 * @type {number}
	 */
	own_references_count: 0,

	instanceOf: function(class_name) {}
};

/**
 * @interface
 */
_iEventTicket = {

	remove: function() {}

};

_cEnumerableEventArgs = {

	uids: [],
	values: [],
	names: []

};

_cTranslatableString = {

	type: 'translate',
	value: '',
	description: '',
	context: ''

};

_cTranslatablePlural = {

	type: 'ntranslate',
	/** @type {Array.<string>} */
	value: [],
	description: '',
	context: ''

};

_cScopeForeach = {

	create_own_enumerable: false,
	/**
	 * @type {?string}
	 */
	after_refresh_callback: null

};

/**
 * @interface
 */
_iVisitor = {
	enter: function(walker, block_type, block) {},
	leave: function(walker, block_type, block) {},
	enterRegion: function(walker, region_name) {},
	leaveRegion: function(walker, region_name) {},
	visitView: function(walker, node) {},
	visitWidget: function(walker, node) {},
	visitString: function(walker, node) {},
	visitInclude: function(walker, node) {},
	visitStaticValue: function(walker, node) {},
	visitStaticEval: function(walker, node) {},
	visitStaticTag: function(walker, node) {}
};
