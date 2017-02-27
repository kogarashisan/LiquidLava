
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
    class_body: {},

	/**
	 * When Extends is present - a string with full name of the parent
	 * @type {string}
	 */
	"extends": null,

	/**
	 * List of all classes, implemented by this class and it's parents
	 * @type {Array.<string>}
	 */
	"implements": [],

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
	 * List of short class names (last segment of class path)
	 * @type {Array.<string>}
	 */
	hierarchy_names: [],

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

	/**
	 * For exported classes: generated constructor
	 * @type {function}
	 */
	constructor: null,
	/**
	 * For exported classes: partial (own) references array
	 * @type {Array}
	 */
	own_references: null,
	/**
	 * If true - than the class will be created with dummy constructor, that throws exception
	 * (so you can not create an instance of this class).
	 *
	 * This option is not inherited from parents: if you want to make a child abstract
	 * - you must explicitly declare it as abstract in body's Class property
	 * @type {boolean}
	 */
	is_abstract: false,
	/**
	 * Name of method, which is called after `init()` - this allows to split `init()`,
	 * so that parents can perform actions after the inherited class has been fully initialized
	 * @type {?string}
	 */
	after_init: null
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
	type: 'string',
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
	type: 'plural_string',
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
	 * Whether to create another (own) instance of Enumerable or DataView, when argument result is also Enumerable.
	 * May be used to apply sorting and filtering. Allowed values: "Enumerable", "DataView"
	 * @type {string}
	 */
	own_enumerable_mode: null,

	/**
	 * Can be used to re-apply sorting and filtering in case of `own_enumerable_mode` or plain array
	 * returned from scope's Argument.
	 * @type {Array.<(_cScopeLocator|_cDynamicScope)>}
	 */
	depends: []

};

/**
 * Listener object
 */
_tListener = {
	/** @readonly */
	event_name: '',
	/** @readonly */
	fn: null,
	/**
     * Used to resume listener after suspension
     * @readonly
     */
    _fn: null,
	/** @readonly */
	context: null,
	/** @readonly */
	listener_args: null
};

/**
 * Config for Lava.system.Serializer
 */
_cSerializer = {
	/**
	 * If you know that you serialize objects with only valid property names (all characters are alphanumeric),
	 * you may turn this off
	 * @type {boolean}
	 */
	check_property_names: true,
	/**
	 * Whether to pad function body (otherwise returns exact source).
	 * Is not guaranteed to produce correct results, so may be used only for pretty-printing of source code for browser.
	 * @type {boolean}
	 */
	pretty_print_functions: false,
    /**
     * Turn this on, if you want to serialize dates. Example of what you will get:
     * ```javascript
     * var result = {
     *     date_field: new Date(1481486549849)
     * }
     * ```
     */
    allow_dates_serialization: false
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