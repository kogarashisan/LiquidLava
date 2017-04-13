
/**
 * @typedef {(string|_cView|_cInclude|_cStaticValue|_cStaticEval|_cStaticTag)} _tTemplateItem
 */

/** @typedef {Array.<_tTemplateItem>} _tTemplate */

/** @typedef {Array.<(Lava.view.Abstract|string|function)>} _tRenderable */

/** @typedef {(Array.<string|_cScopeLocator>)} _tPathSegment */

/** @enum {string} */
_eKnownViewLocatorType = {
	/** Search for a view by it's {@link Lava.widget.Standard#name} */
	Name: 'Name',
	/** Search for a view by it's {@link Lava.view.Abstract#label} */
	Label: 'Label',
	/** Search for a view by it's {@link Lava.view.Abstract#id} */
	Id: 'Id'
};

/** @enum {string} */
_eViewLocatorType = {
	/** Search for a view by it's {@link Lava.widget.Standard#name} */
	Name: 'Name',
	/** Search for a view by it's {@link Lava.view.Abstract#label} */
	Label: 'Label',
	/** Search for a view by it's {@link Lava.view.Abstract#id} */
	Id: 'Id',
	/** Search for a view by it's {@link Lava.view.Abstract#guid} */
	Guid: 'Guid'
};

_cKnownViewLocator = {

	/** @type {_eKnownViewLocatorType} */
	locator_type: '',

	locator: ''

};

/** @extends {_cKnownViewLocator} */
_cViewLocator = {

	/** @type {_eViewLocatorType} */
	locator_type: ''

};

/**
 * @extends {_cKnownViewLocator}
 */
_cScopeLocator = {
	/**
	 * Locator points to view's parent, which is `depth` levels higher
	 * @type {number}
	 */
	depth: 0,
	/**
	 * Find view by property name
	 * @type {string}
	 */
	property_name: '',
	/**
	 * Path to evaluate
	 * @type {Array.<_tPathSegment>}
	 */
	tail: []
};

/**
 * @extends {_cKnownViewLocator}
 */
_cDynamicScope = {
	/**
	 * This scope is located by widget
	 * @type {boolean}
	 * @const
	 */
	isDynamic: true,

	property_name: ''
};

/**
 * Parsed expression from Lava templates.
 * Used by {Lava.scope.Argument} and {Lava.scope.Evaluator}
 */
_cArgument = {
	/**
	 * Argument returns value from a single scope, without expressions.
	 * This flag is used to construct bindings
	 * @type {boolean}
	 */
	isScopeEval: false,
	/**
	 * Routes to variables, used in evaluator for this argument
	 * @type {?Array.<(_cScopeLocator|_cDynamicScope)>}
	 */
	binds: [],
	/**
	 * Routes to widgets, used by this expression
	 * @type {?Array.<_cKnownViewLocator>}
	 */
	targets: [],
	/**
	 * Function that is called in context of {@link Lava.scope.Argument} instance and returns it's current value
	 * @type {!function():*}
	 */
	evaluator: function() { return null; }
};

/**
 * Template include
 * @extends {_cArgument}
 */
_cInclude = {
	type: 'include'
};

_cElementContainerCommon = {
	/**
	 * Note: array, not object
	 * @type {?Array.<string>}
	 */
	static_classes: [],
	/**
	 * Name-value hash of unbound CSS styles on this container
	 * @type {?Object.<string, string>}
	 */
	static_styles: {},
	/**
	 * Name-value hash of unbound properties on this container
	 * @type {?Object.<string, string>}
	 */
	static_properties: {},
	/** @type {_cResourceId} */
	resource_id: null
};

/**
 * @extends {_cElementContainerCommon}
 */
_cElementContainer = {
	/**
	 * Class name. Default namespace is 'Lava.view.container'
	 * @const
	 */
	type: "Element",
	/**
	 * Tag name for container's DOM element (like "div")
	 */
	tag_name: null,
	/**
	 * {Lava.scope.Argument} configs, which produce values for bound properties. Keys are property names
	 * @type {?Object.<string, _cArgument>}
	 */
	property_bindings: {},
	/**
	 * {Lava.scope.Argument} configs, which produce values for bound styles. Keys are style names
	 * @type {?Object.<string, _cArgument>}
	 */
	style_bindings: {},
	/**
	 * Indexes are numbers, starting from zero, like in array.
	 * Arguments must produce a string with any number of CSS classes, separated by space
	 * @type {?Object.<string, _cArgument>}
	 */
	class_bindings: {},
	/**
	 * Dispatchers for DOM events on this element
	 * @type {?Object.<string, Array.<_cArgument>>}
	 */
	dom_events: {},

	options: {}
};

_cEmulatedContainer = {

	/**
	 * Class name, default namespace is "Lava.view.container"
	 * @type {string}
	 * @const
	 */
	type: "Emulated",

	options: {
		appender: 'Top' || 'Bottom' || 'AfterPrevious' || 'BeforeNext',
		prepender: 'Top' || 'Bottom' || 'AfterPrevious' || 'BeforeNext'
	}

};

_cView = {
	/** @type {!string} */
	type: 'view',
	/**
	 * Name of the view, for example: "foreach", "if", "expression"
	 * @type {!string}
	 * */
	view_name: '',
	/**
	 * Either an extending constructor, like {@link Lava#WidgetConfigExtensionGateway},
	 * or real class name (in extended widget configs)
	 * @type {string}
	 */
	'class': '',
	/**
	 * The class of unextended widget config is always set to extender function.
	 * Extender then replaces the `class` with `real_class`. Default namespace is "Lava.widget" for widgets.
	 * @type {string}
	 */
	real_class: '',
	/**
	 * Used for dynamic class name resolution
	 */
	class_locator: {
		/** @type {_eViewLocatorType} */
		locator_type: null,
		name: ''
	},
	/**
	 * @type {!_tTemplate}
	 */
	template: [],
	/**
	 * @type {?_tTemplate}
	 */
	else_template: [],
	/**
	 * @type {_cElementContainer}
	 */
	container: null,
	/**
	 * View's argument
	 * @type {_cArgument}
	 */
	argument: null,
	/**
	 * @type {?Array.<_cArgument>}
	 */
	elseif_arguments: [],
	/**
	 * @type {?Array.<_tTemplate>}
	 */
	elseif_templates: [],
	/**
	 * One-way assigns to view's properties
	 * @type {?Object.<string, _cAssign>}
	 */
	assigns: {},

	options: {},

	/**
	 * User-assigned unique ID string
	 * @type {string}
	 */
	id: '',
	/**
	 * View's label for referencing in expressions
	 * @type {string}
	 */
	label: '',
	/**
	 * Name of item in Foreach views
	 * @type {string}
	 */
	as: '',
	/**
	 * In Expression view: turn off escaping
	 * @type {boolean}
	 */
	escape_off: false,
	/**
	 * @type {?_cRefresher}
	 */
	refresher: null,
	/**
	 * Routed class events (those, which are fired by {Lava.mixin.Observable})
	 * @type {Array.<_cArgument>}
	 */
	class_events: null
};

_cRefresher = {

	/**
	 * Class name, default namespace is "Lava.view.refresher"
	 * @type {string}
	 * @const
	 */
	type: 'Standard',
	/**
	 * Custom callback that gets the first DOM element of the template
	 * @param {Lava.system.Template} template
	 * @returns {HTMLElement}
	 */
	get_start_element_callback: function(template) {},
	/**
	 * Custom callback that gets the last DOM element of the template
	 * @param {Lava.system.Template} template
	 * @returns {HTMLElement}
	 */
	get_end_element_callback: function(template) {}

};

/**
 * @extends {_cView}
 */
_cWidget = {

	/**
	 * @type {string}
	 * @const
	 */
	type: 'widget',
	/**
	 * Widgets inherit config properties from their parent widgets. This process is called "extension"
	 * @type {boolean}
	 */
	is_extended: false,
	/**
	 * Currently, the only extender available
	 */
	extender_type: 'Standard',
	/**
	 * Name of the widget - arbitrary identifier, just like label. Used to reference the widget from templates
	 * @type {string}
	 */
	//name: '';

	/**
	 * Global widget title, which this config should extend. It's  extension for the config, not the JavaScript class
	 */
	'extends': '',
	/**
	 * @type {Object.<string, _tTemplate>}
	 */
	includes: {},
	/**
	 * Two-way bindings to widget properties
	 * @type {Object.<string, _cBinding>}
	 */
	bindings: {},
	/**
	 * Initial widget's properties
	 * @type {Object}
	 */
	properties: {},
	/**
	 * Schema for the `storage` config property
	 * @type {Object.<string, _cStorageItemSchema>}
	 */
	storage_schema: {},
	/**
	 * @type {Object.<string, (Array|Object)>}
	 */
	storage: {},

	/** @type {_cSugar} */
	sugar: null,
	/**
	 * config.resources[<locale>] = {...}
	 * @type {Object.<string, Object>}
	 */
	resources: {},
	/**
	 * config.resources_cache[<locale>] = {}
	 * @type {Object.<string, Object>}
	 */
	resources_cache: {},
	/**
	 * Path to resources for this widget
	 * @type {_cResourceId}
	 */
	resource_id: null
};

_cBinding = {
	/**
	 * Widget's property name
	 * @type {string}
	 */
	property_name: '',
	/**
	 * If you want to assign values only from widget to scope, but not from scope to widget
	 * @type {boolean}
	 */
	from_widget: false,
	/**
	 * Route to scope, which will be bound to widget's property
	 * @type {_cScopeLocator}
	 */
	path_config: null
};

/**
 * Assign to a view's property
 * @extends _cArgument
 */
_cAssign = {
	/**
	 * Assign argument's value only once, on creation, and destroy the Argument
	 */
	once: false
};

/**
 * Widget's property descriptor
 */
_cPropertyDescriptor = {
	/**
	 * Name of a class member, which is used to get the property
	 * @type {string}
	 */
	getter: '',
	/**
	 * Name of a class member, which is used to set the property.
	 * `function(value, name)`
	 * @type {string}
	 */
	setter: '',
	/**
	 * A name from {@link Firestorm.Types}
	 */
	type: '',
	/**
	 * @type {boolean}
	 */
	is_nullable: false,
	/**
	 * Readonly properties may be assigned only by widget instance, but not from outside
	 * @type {boolean}
	 */
	is_readonly: false
};

/**
 * @extends {_cKnownViewLocator}
 */
_cResourceId = {
	/**
	 * @type {string}
	 */
	name: ''
};

_cStaticValue = {
	type: 'static_value',
	/** @type {_cResourceId} */
	resource_id: null
};

_cStaticEval = {
	type: 'static_eval',
	/** @type {_cArgument} */
	argument: null
};

/**
 * @extends {_cElementContainerCommon}
 */
_cStaticTag = {
	type: 'static_tag',
	/**
	 * @type {string}
	 */
	name: null,
	/**
	 * Tag's content
	 * @type {_tTemplate}
	 */
	template: null
};