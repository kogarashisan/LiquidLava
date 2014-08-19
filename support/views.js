
/**
 * @typedef {(string|_cView|_cInclude|_cStaticValue|_cStaticEval|_cStaticTag)} _tTemplateItem
 */

/** @typedef {Array.<_tTemplateItem>} _tTemplate */

/** @typedef {Array.<(Lava.view.Abstract|string|function)>} _tRenderable */

/** @typedef {(Array.<string|_cScopeLocator>)} _tPathSegment */

/** @enum {string} */
_tKnownViewLocatorType = {
	Name: 'Name',
	Label: 'Label',
	Id: 'Id'
};

/** @enum {string} */
_tViewLocatorType = {
	Name: 'Name',
	Label: 'Label',
	Id: 'Id',
	Guid: 'Guid'
};

_cKnownViewLocator = {

	/** @type {_tKnownViewLocatorType} */
	locator_type: '',

	locator: ''

};

/** @extends {_cKnownViewLocator} */
_cViewLocator = {

	/** @type {_tViewLocatorType} */
	locator_type: ''

};

/**
 * @extends {_cKnownViewLocator}
 */
_cScopeLocator = {

	/**
	 * @type {number}
	 */
	depth: 0,

	/**
	 * @type {string}
	 */
	property_name: '',

	/**
	 * @type {Array.<_tPathSegment>}
	 */
	tail: []

};

/**
 * @extends {_cKnownViewLocator}
 */
_cDynamicScope = {

	isDynamic: true,

	property_name: ''

};

_cArgumentCommon = {

	/**
	 * @type {?Object}
	 */
	flags: {
		/**
		 * Global modifiers are inlined and o not create a config
		 */
		hasGlobalModifiers: false,
		/**
		 * Argument returns value from a single scope, without expressions.
		 * This flag is used to construct bindings.
		 */
		isScopeEval: false,
		/**
		 * There are no dependencies on scope or active modifiers. The value of the argument will never change.
		 */
		isStatic: false,
		isLiteral: false,
		isNumber: false,
		isString: false
	},

	/**
	 * @type {?Array.<(_cScopeLocator|_cDynamicScope)>}
	 */
	binds: [],

	/**
	 * @type {?Array.<_cModifier>}
	 */
	modifiers: [],

	/**
	 * @type {?Array.<_cModifier>}
	 */
	active_modifiers: []

};

/**
 * @extends _cArgumentCommon
 */
_cArgument = {

	/**
	 * @type {!function()}
	 */
	evaluator: function() { return null; }

};

/**
 *
 * @extends {_cKnownViewLocator}
 */
_cModifier = {

	callback_name: ''

};

/**
 * @extends {_cTarget}
 */
_cInclude = {

	type: 'include'

};

_cTargetArgument = {

	/** @type {Lava.TARGET_ARGUMENT_TYPES} */
	type: 'value',

	/**
	 * @type {(_cScopeLocator|string|number|boolean|null)}
	 */
	data: null

};

/**
 * This is descriptor for view events and roles.
 * It may be either targeted event/role, or bubbling - they do not have a target specified.
 * @extends {_cViewLocator}
 */
_cTarget = {

	/**
	 * Event or role name
	 * @type {!string}
	 */
	name: '',

	/**
	 * @type {Array.<_cTargetArgument>}
	 */
	arguments: []

};

_cElementContainerCommon = {

	/**
	 * Note: array, not object
	 * @type {?Array.<string>}
	 */
	static_classes: [],

	/** @type {?Object.<string, string>} */
	static_styles: {},

	/** @type {?Object.<string, string>} */
	static_properties: {},

	/** @type {_cResourceId} */
	resource_id: null

};

/**
 * @extends {_cElementContainerCommon}
 */
_cElementContainer = {

	'class': "Element",

	tag_name: 'div',

	/**
	 * @type {?Object.<string, _cArgument>}
	 */
	property_bindings: {},

	/**
	 * @type {?Object.<string, _cArgument>}
	 */
	style_bindings: {},

	/**
	 * Indexes are numbers, starting from zero, like in array
	 * @type {?Object.<string, _cArgument>}
	 */
	class_bindings: {},

	/**
	 * @type {?Object.<string, Array.<_cTarget>>}
	 */
	events: {},

	options: {}

};

_cEmulatedContainer = {

	'class': "Emulated",

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

	'class': '',

	/**
	 * The class of unextended widget config is always set to extender function.
	 * Extender than replaces the class name with the right one.
	 * @type {string}
	 */
	real_class: '',

	class_locator: {
		/** @type {_tViewLocatorType} */
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
	 * @type {?Object.<string, _cAssign>}
	 */
	assigns: {},

	options: {},

	/**
	 * When id is specified - it will be shared by view's element.
	 */
	id: '',

	label: '',

	/**
	 * The purpose of this attribute - is to notify the widget and register the view in it.
	 * @type {?Array.<_cTarget>}
	 */
	roles: [],

	// the name of the item in Foreach
	as: '',

	// in Expression view: turn off escaping
	escape_off: false,

	/**
	 * @type {_cRefresher}
	 */
	refresher: null

};

_cRefresher = {

	'class': 'Default',

	insertion_strategy: null

};

/** @enum {string} */
_cStorageItemTypes = {
	template_collection: 'template_collection',
	object_collection: 'object_collection',
	template_hash: 'template_hash',
	object_hash: 'object_hash',
	object: 'object'
};

_cStorageItem = {

	/** @type {_cStorageItemTypes} */
	type: '',

	/**
	 * @type {_cSugarContentTemplateCollection|_cSugarContentTemplateHash|_cSugarContentObjectCollection|_cSugarContentObjectHash|_cSugarContentObject}
	 */
	schema: null,

	value: null

};

/**
 * @extends {_cView}
 */
_cWidget = {

	/**
	 * @type {string}
	 */
	type: 'widget',

	/**
	 * @type {boolean}
	 */
	is_extended: false,

	extender_type: '',

	/**
	 * Name of the widget - arbitrary identifier, just like label. Used to reference the widget from templates.
	 * @type {string}
	 */
	//name: '';

	/**
	 * Type from schema, which this config should extend. It's  extension for the config, not the widget class.
	 * Warning: on first use widget configs are merged with parent, and this property is set to undefined.
	 */
	'extends': '',

	/**
	 * @type {Object.<string, _tTemplate>}
	 */
	includes: {},

	/**
	 * @type {Object.<string, _cBinding>}
	 */
	bindings: {},

	properties: {},

	/**
	 * @type {Object.<string, _cStorageItem>}
	 */
	storage: {},

	/** @type {_cSugar} */
	sugar: null,

	/**
	 * @type {Object.<string, Array.<_cTarget>>}
	 */
	broadcast: {},

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
	 * Note: target must be a widget
	 * @type {_cResourceId}
	 */
	resource_id: null,

	default_events: []

};

_cBinding = {

	property_name: '',

	/**
	 * @type {Lava.BINDING_DIRECTIONS}
	 */
	direction: null,

	/**
	 * @type {_cScopeLocator}
	 */
	path_config: null

};

/**
 * @extends _cArgument
 */
_cAssign = {

	once: false

};

_cPropertyDescriptor = {

	// class members
	getter: '',
	setter: '', // member function name: function(name, value)

	// a name from Lava.types object
	type: '',
	is_nullable: false,
	is_readonly: false

};

/**
 * @extends {_cKnownViewLocator}
 */
_cResourceId = {

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

	name: '',

	/** @type {_tTemplate} */
	template: null

};