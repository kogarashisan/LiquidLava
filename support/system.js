
/**
 * // A comment for PHPStorm, cause it does not recognize @callback //
 * @typedef {function(x)} _tTransitionCallback
 * @ignore
 */

/**
 * Animation transition function (easing)
 * @callback _tTransitionCallback
 * @param {number} x Current animation position, 0..1
 * @returns {number} The distance value
 */

/**
 * // A comment for PHPStorm, cause it does not recognize @callback //
 * @typedef {function(*, string, number):boolean} _tEnumerableFilterCallback
 * @ignore
 */

/**
 * Filter callback for {@link Lava.system.Enumerable}
 * @callback _tEnumerableFilterCallback
 * @param {*} value
 * @param {string} name
 * @param {number} uid
 * @param {number} i Index in collection
 * @returns {boolean} <kw>true</kw>, if entry needs to stay in collection, or <kw>false</kw> if it should be removed
 */

/**
 * // A comment for PHPStorm, cause it does not recognize @callback //
 * @typedef {function(*, *):boolean} _tLessCallback
 * @ignore
 */

/**
 * Callback to compare two values for usage in sorting algorithms
 * @callback _tLessCallback
 * @param {*} a
 * @param {*} b
 * @returns {boolean} <kw>true</kw>, if `a < b` and <kw>false</kw> otherwise
 */

/** @typedef {number} _tGUID */

/**
 * Structure, used by {@link Lava.ClassManager}
 */
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
	 * Raw class body, from which it was constructed
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

	/**
	 * List of all classes, implemented by this class and it's parents
	 * @type {Array.<string>}
	 */
	implements: [],

	/**
	 * Class data of parent
	 * @type {_cClassData}
	 */
	parent_class_data: null,

	/**
	 * List of full paths to classes in the hierarchy, with this one being the last
	 * @type {Array.<string>}
	 */
	hierarchy_paths: [],

	/**
	 * Used to build the class constructor
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
 * Event argument for some events in Enumerable
 */
_cEnumerableEventArgs = {

	uids: [],
	values: [],
	names: []

};

/**
 * Translatable string from widget's resources
 */
_cTranslatableString = {

	/**
	 * Resource type
	 * @type {string}
	 * @const
	 */
	type: 'translate',
	/**
	 * String content
	 */
	value: '',
	/**
	 * User-defined "description" attribute from resource tag
	 */
	description: '',
	/**
	 * User-defined "context" attribute from resource tag
	 */
	context: ''

};

/**
 * Translatable plural string from widget's resources
 */
_cTranslatablePlural = {

	/**
	 * Resource type
	 * @type {string}
	 * @const
	 */
	type: 'ntranslate',
	/**
	 * @type {Array.<string>}
	 */
	value: [],
	/**
	 * User-defined "description" attribute from resource tag
	 */
	description: '',
	/**
	 * User-defined "context" attribute from resource tag
	 */
	context: ''

};

_cScopeForeach = {

	/**
	 * Whether to create another (own) instance of Enumerable, when argument result is also Enumerable.
	 * May be used to apply sorting and filtering
	 * @type {boolean}
	 */
	create_own_enumerable: false,
	/**
	 * @type {?string}
	 */
	after_refresh_callback: null

};

/**
 * Listener object
 */
_tListener = {
	/** @readonly */
	event_name: '',
	/** @readonly */
	fn: null,
	/** @readonly */
	fn_original: null,
	/** @readonly */
	context: null,
	/** @readonly */
	listener_args: null
};

/**
 * Temporary object used internally by Enumerable
 */
_cEnumerableHelperStorage = {
	uids: [],
	values: [],
	names: [],
	push: function(uid, value, name) {},
	/**
	 * @returns {{uids: Array.<number>, values: Array.<*>, names: Array.<string>}}
	 */
	getObject: function() {}
};

/**
 * // Comment for PHPStorm, cause it does not recognize @callback //
 * @typedef {function(*, string, number):boolean} _tEnumerableEachCallback
 * @ignore
 */

/**
 * Callback for {@link Lava.system.Enumerable#each}
 * @callback _tEnumerableEachCallback
 * @param {*} value
 * @param {string} name
 * @param {number} uid
 * @param {number} i Index in collection
 * @returns {boolean} <kw>false</kw> to break loop
 */