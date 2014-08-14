
/**
 * @typedef {(string|_cView|_cInclude|_cStaticValue|_cStaticEval|_cStaticTag|function)} _tTemplateItem
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

function _cKnownViewLocator() {

	/** @type {_tKnownViewLocatorType} */
	this.locator_type = '';

	this.locator = '';

}

/** @extends {_cKnownViewLocator} */
function _cViewLocator() {

	/** @type {_tViewLocatorType} */
	this.locator_type = '';

}

/**
 * @extends {_cKnownViewLocator}
 */
function _cScopeLocator() {

	_cKnownViewLocator.apply(this);

	this.depth = 0;

	this.property_name = '';

	/**
	 * @type {Array.<_tPathSegment>}
	 */
	this.tail = [];

}

/**
 * @extends {_cKnownViewLocator}
 */
function _cDynamicScope() {

	this.isDynamic = true;
	this.property_name = '';

}

function _cArgumentCommon() {

	/**
	 * @type {?Object}
	 */
	this.flags = {
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
	};

	/**
	 * @type {?Array.<(_cScopeLocator|_cDynamicScope)>}
	 */
	this.binds = [];

	/**
	 * @type {?Array.<_cModifier>}
	 */
	this.modifiers = [];

	/**
	 * @type {?Array,<_cModifier>}
	 */
	this.active_modifiers = [];

}

/**
 * @extends _cArgumentCommon
 */
function _cArgument() {

	/**
	 * @type {!function()}
	 */
	this.evaluator = function() { return null; };

}

/**
 *
 * @extends {_cKnownViewLocator}
 */
function _cModifier() {

	_cKnownViewLocator.apply(this);

	this.callback_name = '';

}

/**
 * @extends {_cTarget}
 */
function _cInclude() {

	_cTarget.apply(this);

	this.type = 'include';

}

function _cTargetArgument() {

	/** @type {Lava.TARGET_ARGUMENT_TYPES} */
	this.type = 'value';

	/**
	 * @type {(_cScopeLocator|string|number|boolean|null)}
	 */
	this.data = null;

}

/**
 * This is descriptor for view events and roles.
 * It may be either targeted event/role, or bubbling - they do not have a target specified.
 * @extends {_cViewLocator}
 */
function _cTarget() {

	/**
	 * Event or role name
	 * @type {!string}
	 */
	this.name = '';

	/**
	 * @type {Array.<_cTargetArgument>}
	 */
	this.arguments = [];

}

function _cElementContainerCommon() {

	/**
	 * Note: array, not object
	 * @type {?Array.<string>}
	 */
	this.static_classes = [];

	/** @type {?Object.<string, string>} */
	this.static_styles = {};

	/** @type {?Object.<string, string>} */
	this.static_properties = {};

	/** @type {_cResourceId} */
	this.resource_id = null;

}

/**
 * @extends {_cElementContainerCommon}
 */
function _cElementContainer() {

	_cElementContainerCommon.apply(this);

	this['class'] = "Element";

	this.tag_name = 'div';

	/**
	 * @type {?Object.<string, _cArgument>}
	 */
	this.property_bindings = {};

	/**
	 * @type {?Object.<string, _cArgument>}
	 */
	this.style_bindings = {};

	/**
	 * Indexes are numbers, starting from zero, like in array
	 * @type {?Object.<string, _cArgument>}
	 */
	this.class_bindings = {};

	/**
	 * @type {?Object.<string, Array.<_cTarget>>}
	 */
	this.events = {};

	this.options = {};

}

function _cEmulatedContainer() {

	this['class'] = "Emulated";

	this.options = {
		appender: 'Top' || 'Bottom' || 'AfterPrevious' || 'BeforeNext',
		prepender: 'Top' || 'Bottom' || 'AfterPrevious' || 'BeforeNext'
	};

}

function _cView() {

	/** @type {!string} */
	this.type = 'view';

	/**
	 * Name of the view, for example: "foreach", "if", "expression"
	 * @type {!string}
	 * */
	this.view_name = '';

	this['class'] = '';

	/**
	 * @type {!_tTemplate}
	 */
	this.template = [];

	/**
	 * @type {?_tTemplate}
	 */
	this.else_template = [];

	/**
	 * @type {_cElementContainer}
	 */
	this.container = null;

	/**
	 * @type {_cArgument}
	 */
	this.argument = null;

	/**
	 * @type {?Array.<_cArgument>}
	 */
	this.elseif_arguments = [];

	/**
	 * @type {?Array.<_tTemplate>}
	 */
	this.elseif_templates = [];

	/**
	 * @type {?Object.<string, _cAssign>}
	 */
	this.assigns = {};

	this.options = {};

	/**
	 * When id is specified - it will be shared by view's element.
	 */
	this.id = '';

	this.label = '';

	/**
	 * The purpose of this attribute - is to notify the widget and register the view in it.
	 * @type {?Array.<_cTarget>}
	 */
	this.roles = [];

	// the name of the item in Foreach
	this.as = '';

	// in Expression view: turn off escaping
	this.escape_off = false;

	/**
	 * @type {_cRefresher}
	 */
	this.refresher = null;

}

function _cRefresher() {

	this['class'] = 'Default';

	this.insertion_strategy = null;

}

/** @enum {string} */
var _cStorageItemTypes = {
	template_collection: 'template_collection',
	object_collection: 'object_collection',
	template_hash: 'template_hash',
	object_hash: 'object_hash',
	object: 'object'
};

function _cStorageItem() {

	/** @type {_cStorageItemTypes} */
	this.type = '';

	/**
	 * @type {_cSugarContentTemplateCollection|_cSugarContentTemplateHash|_cSugarContentObjectCollection|_cSugarContentObjectHash|_cSugarContentObject}
	 */
	this.schema = null;

	this.value = null;

}

/**
 * @extends {_cView}
 */
function _cWidget() {

	this.type = 'widget';

	this.is_extended = false;

	/**
	 * The class of unextended widget config is always set to extender function.
	 * Extender than replaces the class name with the right one.
	 * @type {string}
	 */
	this.real_class = '';

	this.class_locator = {
		/** @type {_tViewLocatorType} */
		locator_type: null,
		name: ''
	};

	this.extender_type = '';

	/**
	 * Name of the widget - arbitrary identifier, just like label. Used to reference the widget from templates.
	 * @type {string}
	 */
	//this.name = '';

	/**
	 * Type from schema, which this config should extend. It's  extension for the config, not the widget class.
	 * Warning: on first use widget configs are merged with parent, and this property is set to undefined.
	 */
	this.extends = '';

	/**
	 * @type {Object.<string, _tTemplate>}
	 */
	this.includes = {};

	/**
	 * @type {Object.<string, _cBinding>}
	 */
	this.bindings = {};

	this.properties = {};

	/**
	 * @type {Object.<string, _cStorageItem>}
	 */
	this.storage = {};

	/** @type {_cSugar} */
	this.sugar = null;

	/**
	 * @type {Object.<string, Array.<_cTarget>>}
	 */
	this.broadcast = {};

	/**
	 * config.resources[<locale>] = {...}
	 * @type {Object.<string, Object>}
	 */
	this.resources = {};

	/**
	 * config.resources_cache[<locale>] = {}
	 * @type {Object.<string, Object>}
	 */
	this.resources_cache = {};

	/**
	 * Note: target must be a widget
	 * @type {_cResourceId}
	 */
	this.resource_id = null;

	this.default_events = [];

}

function _cBinding() {

	this.property_name = '';

	/**
	 * @type {Lava.BINDING_DIRECTIONS}
	 */
	this.direction = null;

	/**
	 * @type {_cScopeLocator}
	 */
	this.path_config = null;

}

/**
 * @extends _cArgument
 */
function _cAssign() {

	this.once = false;

}

function _cPropertyDescriptor() {

	// class members
	this.getter = '';
	this.setter = ''; // member function name: function(name, value)

	// a name from Lava.types object
	this.type = '';
	this.is_nullable = false;
	this.is_readonly = false;

}

/**
 * @extends {_cKnownViewLocator}
 */
function _cResourceId() {

	_cKnownViewLocator.apply(this);

	this.name = '';

}

function _cStaticValue() {

	this.type = 'static_value';

	/** @type {_cResourceId} */
	this.resource_id = null;

}

function _cStaticEval() {

	this.type = 'static_eval';
	/** @type {_cArgument} */
	this.argument = null;

}

/**
 * @extends {_cElementContainerCommon}
 */
function _cStaticTag() {

	_cElementContainerCommon.apply(this);

	this.type = 'static_tag';

	this.name = '';

	/** @type {_tTemplate} */
	this.template = null;

}