
/*!
 * LiquidLava library
 * http://www.lava-framework.com/
 *
 * Copyright Alex Galashov, MIT license
 *
 * Version: 0.14.0
 */

/**
 * Root object of the Lava framework
 */
var Lava = {
	/**
	 * Version numbers in form of array - to allow easier comparison of versions
	 */
	version: [0,14,0],

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Default namespaces reservation. All root members must be reserved ahead - v8 optimization.

	/** @ignore */
	schema: null,
	/** @ignore */
	ClassManager: null,
	/** @ignore */
	ExpressionParser: null,
	/** @ignore */
	TemplateParser: null,
	/** @ignore */
	ObjectParser: null,
	/** @ignore */
	transitions: null,
	/** @ignore */
	Cron: null,
	/** @ignore */
	Core: null,
	/** @ignore */
	ScopeManager: null,
	/** @ignore */
	modifiers: null,
	/** @ignore */
	types: null,
	/** @ignore */
	extenders: null,
	/** @ignore */
	resources: null,
	/** @ignore */
	algorithms: {
		sorting: {}
	},

	/** @ignore */
	animation: {},
	/** @ignore */
	animator: {},
	/** @ignore */
	data: {},
	/** @ignore */
	system: {},
	/** @ignore */
	mixin: {},
	/** @ignore */
	parsers: {},
	/** @ignore */
	view: {},
	/** @ignore */
	widget: {},
	/** @ignore */
	scope: {},
	/**
	 * Place for any other user defined classes and variables
	 */
	user: {},

	/**
	 * Global App class instance
	 * @type {Lava.system.App}
	 */
	app: null,
	/**
	 * Global ViewManager instance
	 * @type {Lava.system.ViewManager}
	 */
	view_manager: null,
	/**
	 * Global PopoverManager instance
	 * @type {Lava.system.PopoverManager}
	 */
	popover_manager: null,
	/**
	 * Global FocusManager instance
	 * @type {Lava.system.FocusManager}
	 */
	focus_manager: null,
	/**
	 * Default instance of {@link Lava.system.Serializer}
	 * @type {Lava.system.Serializer}
	 */
	serializer: null,

	/**
	 * Container for locale-specific data (strings, date formats, etc)
	 * @type {Object.<string, Object>}
	 */
	locales: {},

	/**
	 * Global named widget configs
	 * @type {Object.<string, _cWidget>}
	 */
	widgets: {},
	/**
	 * Tag names that are parsed by Sugar class
	 * @type {Object.<string, _cSugarSchema>}
	 */
	sugar_map: {},
	/**
	 * All class definitions are stored here until framework initialization to allow monkey-patching
	 */
	classes: {},

	// end: default namespaces reservation
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// constants and predefined data

	/**
	 * Types of template arguments, allowed in view events and roles
	 * @enum {number}
	 */
	TARGET_ARGUMENT_TYPES: {
		VALUE: 1,
		BIND: 2
	},

	/**
	 * <str>"id"</str> attribute of framework's DOM elements start with this prefix.
	 * When changing this, you must also change SYSTEM_ID_REGEX
	 * @const
	 * */
	ELEMENT_ID_PREFIX: 'e',
	/**
	 * Does a string represent a valid element's id, used by the framework
	 */
	SYSTEM_ID_REGEX: /^e?\\d+$/,
	/**
	 * May a string be used as property/include name
	 */
	VALID_PROPERTY_NAME_REGEX: /^[a-zA-Z\_\$][a-zA-Z0-9\_\$]*$/,
	/**
	 * Match empty string or string with spaces
	 */
	EMPTY_REGEX: /^\s*$/,
	/**
	 * May a string be used as view's label
	 */
	VALID_LABEL_REGEX: /^[A-Za-z\_][A-Za-z\_0-9]*$/,

	/**
	 * Default comparison function
	 * @returns {boolean}
	 */
	DEFAULT_LESS: function(a, b) { return a < b; },
	// not sure if these obsolete tags should also be included: basefont, bgsound, frame, isindex
	/**
	 * HTML tags that do not require a closing tag
	 */
	VOID_TAGS: ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'],
	/**
	 * List of all JavaScript keywords, used when serializing objects
	 */
	JS_KEYWORDS: ['break','case','catch','class','const','continue','debugger','default','delete','do','else','export','extends','false','finally',
		'for','function','if','import','in','instanceof','new','null','protected','return','super','switch','this','throw','true','try','typeof',
		'var','while','with','abstract','boolean','byte','char','decimal','double','enum','final','float','get','implements','int','interface',
		'internal','long','package','private','protected','public','sbyte','set','short','static','uint','ulong','ushort','void','assert','ensure',
		'event','goto','invariant','namespace','native','require','synchronized','throws','transient','use','volatile'],

	/**
	 * List of common framework exceptions to make the framework smaller in size. May be excluded in production
	 */
    ERROR_DESCRIPTIONS: null,

	// end: constants and predefined data
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// class members

	/**
	 * Cache for sugar API: sugar class instances for global widgets
	 * @type {Object.<string, Lava.system.Sugar>}
	 */
	_widget_title_to_sugar_instance: {},
	/**
	 * Global instances of Sugar class by class name
	 * @type {Object.<string, Lava.system.Sugar>}
	 */
	_sugar_instances: {},

	/**
	 * Global UID counter
	 * @type {_tGUID}
	 */
	guid: 1,

	/**
	 * Create all classes and global class instances.
	 * Must be called before bootstrap() or creating any widgets. Replaces itself with <kw>null</kw> after first use.
	 */
	init: function() {

		var path,
			i = 0,
			count;

		// You must know this yourself
		// for (var name in {}) Lava.t("LiquidLava framework can not coexist with frameworks that modify native object's prototype");

		if (typeof(Firestorm) == 'undefined') Lava.t('init: Firestorm is not loaded');

		this.ClassManager.registerRootNamespace('Lava', this);
		this.ScopeManager.init();

		for (path in this.classes) {

			this._loadClass(path);

		}

		this.serializer = new Lava.system.Serializer(Lava.schema.default_serializer_config);

		if (typeof(window) != 'undefined') {
			this._initGlobals();
			this.ClassManager.registerExistingConstructor('Lava.WidgetConfigExtensionGateway', this.WidgetConfigExtensionGateway);
			this.ClassManager.registerExistingConstructor('Lava.ClassLocatorGateway', this.ClassLocatorGateway);
			this.Cron.init();
		}

		for (count = this.schema.SUGAR_CLASSES.length; i < count; i++) {

			this.registerSugar(this.schema.SUGAR_CLASSES[i]);

		}

		this.define = this.define_Normal;
		this.init = null;

	},

	/**
	 * Create global class instances
	 */
	_initGlobals: function() {

		this._initGlobal(Lava.schema.system.VIEW_MANAGER_CLASS, 'view_manager');
		this._initGlobal(Lava.schema.system.APP_CLASS, 'app');
		this._initGlobal(Lava.schema.popover_manager.CLASS, 'popover_manager');
		this._initGlobal(Lava.schema.focus_manager.CLASS, 'focus_manager');

	},

	_initGlobal: function(class_name, property_name) {

		if (class_name) {
			var constructor = this.ClassManager.getConstructor(class_name);
			this[property_name] = new constructor();
		}

	},

	/**
	 * Validate and then eval the passed string.
	 * String does not necessarily need to be in strict JSON format, just any valid plain JS object (without logic!).
	 * Obviously, you must use this function only with the code you trust
	 * @param {string} serialized_object
	 */
	parseOptions: function(serialized_object) {
		Lava.schema.VALIDATE_OPTIONS && this.ObjectParser.parse(serialized_object);
		return eval('(' + serialized_object + ')');
	},

	/**
	 * Does the string represent a valid identifier, that can be referenced from expressions
	 * @param {string} id
	 * @returns {boolean}
	 */
	isValidId: function(id) {

		return this.VALID_LABEL_REGEX.test(id) && !this.SYSTEM_ID_REGEX.test(id);

	},

	/**
	 * Log a recoverable error
	 * @param {string} msg
	 */
	logError: function(msg) {

		if (typeof(window) == 'undefined') throw new Error(msg); // Node environment

		if (window.console) {
			window.console.error(msg);
		}

	},

	/**
	 * Log a caught exception
	 * @param {(Error|string|number)} e
	 */
	logException: function(e) {

		this.logError((typeof(e) == 'string' || typeof(e) == 'number') ? (e + '') : e.message);

	},

	/**
	 * Get extended config of global named widget
	 * @param {string} widget_title
	 * @returns {_cWidget}
	 */
	getWidgetConfig: function(widget_title) {

		if (Lava.schema.DEBUG && !(widget_title in this.widgets)) Lava.t("Widget config not found: " + widget_title);

		var config = this.widgets[widget_title];

		if (!config.is_extended) {

			Lava.extenders[config.extender_type](config);

		}

		return config;

	},

	/**
	 * Create a root widget instance
	 * @param {string} extends_title Name of global parent widget
	 * @param {_cWidget} [config] Partial config for new widget, will be extended with parent's config
	 * @param {Object} [properties] Properties for created widget
	 * @returns {Lava.widget.Standard} Created widget instance
	 */
	createWidget: function(extends_title, config, properties) {

		var widget_config = this.getWidgetConfig(extends_title),
			constructor;

		if (config) {

			if (Lava.schema.DEBUG && config['extends'] && config['extends'] != extends_title) Lava.t("Malformed widget config");

			config['extends'] = extends_title;
			Lava.extenders[config.extender_type || widget_config.extender_type](config);

		} else {

			// all widgets from schema must have their class present
			config = widget_config;

		}

		constructor = Lava.ClassManager.getConstructor(config['class']);
		if (Lava.schema.DEBUG && !constructor) Lava.t('Class not found: ' + class_name);
		return /** @type {Lava.widget.Standard} */ new constructor(config, null, null, null, properties);

	},

	/**
	 * Is there a global widget with such `widget_title` registered
	 * @param {string} widget_title
	 * @returns {boolean}
	 */
	hasWidgetConfig: function(widget_title) {

		return widget_title in this.widgets;

	},

	/**
	 * Take an array of event names and remove default from {@link Lava.schema#system.DEFAULT_EVENTS}
	 * @param {Array.<string>} event_names
	 * @returns {Array.<string>} Filtered array of event names
	 */
	excludeDefaultEvents: function(event_names) {

		var i = 0,
			count = event_names.length,
			result = [];

		for (; i < count; i++) {

			if (Lava.schema.system.DEFAULT_EVENTS.indexOf(event_names[i]) == -1) {

				result.push(event_names[i]);

			}

		}

		return result;

	},

	/**
	 * Throw an error
	 * @param {string} [message] Defaults to <str>"Debug assertion failed"</str>
	 */
	t: function(message) {

		if (typeof(message) == 'number' && this.ERROR_DESCRIPTIONS && (message in this.ERROR_DESCRIPTIONS)) {
			throw new Error(this.ERROR_DESCRIPTIONS[message]);
		}

		throw new Error(message || 'Debug assertion failed');

	},

	/**
	 * Create an instance of `class_name` and register it as sugar processor {@link Lava.system.Sugar}
	 * @param class_name
	 */
	registerSugar: function(class_name) {

		if (Lava.schema.DEBUG && (class_name in this._sugar_instances)) Lava.t('Class is already registered as sugar');
		var constructor = this.ClassManager.getConstructor(class_name);
		this._sugar_instances[class_name] = new constructor();

	},

	/**
	 * Get a Sugar class instance by it's name
	 * @param {string} class_name
	 * @returns {Lava.system.Sugar}
	 */
	getSugarInstance: function(class_name) {

		return this._sugar_instances[class_name];

	},

	/**
	 * Get a Sugar class instance by the title of the widget (each widget has a class that processes sugar for it)
	 * @param {string} widget_title
	 * @returns {_iSugarParser}
	 */
	getWidgetSugarInstance: function(widget_title) {

		var sugar_class,
			widget_config;

		if (!(widget_title in this._widget_title_to_sugar_instance)) {

			widget_config = this.getWidgetConfig(widget_title);
			if (!('sugar' in widget_config)) Lava.t("Widget " + widget_title + " does not have sugar in configuration");
			sugar_class = widget_config.sugar['class'] || Lava.schema.widget.DEFAULT_SUGAR_CLASS;
			this._widget_title_to_sugar_instance[widget_title] = this._sugar_instances[sugar_class];

		}

		return this._widget_title_to_sugar_instance[widget_title];

	},

	/**
	 * Register a global widget config
	 * @param {string} widget_title Title for new global widget
	 * @param {_cWidget} widget_config
	 */
	storeWidgetSchema: function(widget_title, widget_config) {

		if (!Lava.schema.widget.ALLOW_REDEFINITION && (widget_title in this.widgets))
			Lava.t("storeWidgetSchema: widget is already defined: " + widget_title);

		this.widgets[widget_title] = widget_config;

		if (('sugar' in widget_config) && widget_config.sugar.tag_name) {

			this.sugar_map[widget_config.sugar.tag_name] = {widget_title: widget_title};

		}

	},

	/**
	 * Parse the page &lt;body&gt; or special "lava-app" regions in the page and replace them with widgets
	 */
	bootstrap: function() {

		this.init && this.init();

		// focus manager must be initialized before any widgets are in DOM, so it could receive the focus event
		// which can be fired after insertion
		Lava.schema.focus_manager.IS_ENABLED && this.focus_manager && this.focus_manager.enable();

		var body = document.body,
			app_class = Firestorm.Element.getAttribute(body, 'lava-app'),
			bootstrap_targets,
			i = 0,
			count;

		if (app_class != null) {

			this._elementToWidget(body);

		} else {

			bootstrap_targets = Firestorm.selectElements('script[type="lava/app"],lava-app');
			for (count = bootstrap_targets.length; i < count; i++) {

				if (Firestorm.Element.getTagName(bootstrap_targets[i]) == 'script') {
					this._scriptToWidget(bootstrap_targets[i]);
				} else {
					this._elementToWidget(bootstrap_targets[i]);
				}

			}

		}

		Lava.schema.popover_manager.IS_ENABLED && this.popover_manager && this.popover_manager.enable();

	},

	/**
	 * Convert a DOM element to widget instance
	 * @param {HTMLElement} element
	 * @returns {Lava.widget.Standard}
	 */
	_elementToWidget: function(element) {

		var widget,
			raw_template = Lava.TemplateParser.parseRaw(Firestorm.Element.getOuterHTML(element)),
			raw_tag,
			config,
			constructor;

		if (Lava.schema.DEBUG && raw_template.length != 1) Lava.t();

		raw_tag = raw_template[0];
		config = Lava.parsers.Common.toWidget(raw_tag);
		config.is_extended = true;
		config['class'] = raw_tag.attributes['lava-app'];

		if (raw_tag.attributes.id) Firestorm.Element.removeAttribute(element, 'id'); // needed for captureExistingElement

		constructor = Lava.ClassManager.getConstructor(config['class'] || 'Lava.widget.Standard', 'Lava.widget');
		if (Lava.schema.DEBUG && !constructor) Lava.t('Class not found: ' + config['class']);
		widget = /** @type {Lava.widget.Standard} */ new constructor(config);
		widget.injectIntoExistingElement(element);
		return widget;

	},

	/**
	 * Convert a script DOM element to widget instance
	 * @param {HTMLElement} script_element
	 * @returns {Lava.widget.Standard}
	 */
	_scriptToWidget: function(script_element) {

		var widget,
			config,
			constructor,
			id = Firestorm.Element.getAttribute(script_element, 'id'),
			class_name = Firestorm.Element.getAttribute(script_element, 'lava-app');

		config = {
			type: 'widget',
			is_extended: true,
			template: null,
			container: {type: 'Morph'}
		};
		config.template = Lava.TemplateParser.parse(Firestorm.Element.getProperty(script_element, 'html'), config);

		if (id) {
			config.id = id;
			Firestorm.Element.removeAttribute(script_element, 'id');
		}

		constructor = Lava.ClassManager.getConstructor(class_name || 'Lava.widget.Standard', 'Lava.widget');
		if (Lava.schema.DEBUG && !constructor) Lava.t('Class not found: ' + class_name);
		widget = /** @type {Lava.widget.Standard} */ new constructor(config);
		widget.inject(script_element, 'After');
		Firestorm.Element.destroy(script_element);
		return widget;

	},

	/**
	 * Behaves like a widget constructor, but accepts raw (unextended) widget config.
	 * Extends the config and creates the widget instance with the right class. Extension process stores the right
	 * class in widget config, so next time a widget is constructed - this method is not called.
	 *
	 * @param {_cWidget} config
	 * @param {Lava.widget.Standard} widget
	 * @param {Lava.view.Abstract} parent_view
	 * @param {Lava.system.Template} template
	 * @param {Object} properties
	 * @returns {Lava.widget.Standard}
	 */
	WidgetConfigExtensionGateway: function(config, widget, parent_view, template, properties) {

		// here we do not need to check if the config is already extended, cause otherwise it would have real class
		// and it's constructor would be called directly.
		Lava.extenders[config.extender_type](config);

		if ('class_locator' in config) {

			config['class'] = Lava.schema.widget.DEFAULT_CLASS_LOCATOR_GATEWAY;

		}

		if (Lava.schema.DEBUG && !config['class']) Lava.t("Trying to create a widget without class");
		var constructor = Lava.ClassManager.getConstructor(config['class'], 'Lava.widget');
		if (Lava.schema.DEBUG && !constructor) Lava.t("Class not found: " + config['class']);
		return new constructor(config, widget, parent_view, template, properties);

	},

	/**
	 * Behaves like view/widget constructor, but resolves the correct class name from widget hierarchy
	 *
	 * @param {(_cView|_cWidget)} config
	 * @param {Lava.widget.Standard} widget
	 * @param {Lava.view.Abstract} parent_view
	 * @param {Lava.system.Template} template
	 * @param {Object} properties
	 * @returns {(Lava.widget.Standard|Lava.view.Abstract)}
	 */
	ClassLocatorGateway: function(config, widget, parent_view, template, properties) {

		var name_source = Lava.view_manager.locateTarget(widget, config.class_locator.locator_type, config.class_locator.name);
		if (Lava.schema.DEBUG && (!name_source || !name_source.isWidget)) Lava.t("[ClassLocatorGateway] Target is null or not a widget");

		var constructor = name_source.getPackageConstructor(config.real_class);
		return new constructor(config, widget, parent_view, template, properties);

	},

	/**
	 * Store class body in `this.classes`. Will be replaced with `define_Normal` inside `init()`
	 * @param {string} class_name Name of the class
	 * @param {Object} class_object Class body
	 */
	define: function(class_name, class_object) {

		this.classes[class_name] = class_object;

	},

	/**
	 * Proxy to {@link Lava.ClassManager#define}
	 * @param {string} class_name Name of the class
	 * @param {Object} class_object Class body
	 */
	define_Normal: function(class_name, class_object) {

		this.ClassManager.define(class_name, class_object);

	},

	/**
	 * Recursively define a class, stored in `this.classes`
	 * @param {string} path
	 */
	_loadClass: function(path) {

		var class_body = this.classes[path],
			i = 0,
			count;

		if (Lava.schema.DEBUG && !class_body) Lava.t("[Lava::_loadClass] Class does not exists: " + path);

		if ('Extends' in class_body) {
			if (!this.ClassManager.hasClass(class_body.Extends)) {
				this._loadClass(class_body.Extends);
			}
		}

		if ('Implements' in class_body) {
			if (typeof(class_body.Implements) == 'string') {
				if (!this.ClassManager.hasClass(class_body.Implements)) {
					this._loadClass(class_body.Implements);
				}
			} else {
				for (count = class_body.Implements.length; i < count; i++) {
					if (!this.ClassManager.hasClass(class_body.Implements[i])) {
						this._loadClass(class_body.Implements[i]);
					}
				}
			}
		}

        if (!this.ClassManager.hasClass(path)) {
            this.ClassManager.define(path, class_body);
        }

	},

	/**
	 * Create a function, which returns a clone of given template or config.
	 * Note: widget configs must not be extended!
	 * @param {*} config Any clonable JavaScript object without circular references
	 * @returns {function}
	 */
	createCloner: function(config) {

		return new Function('return ' + this.serializer.serialize(config));

	},

	/**
	 * Perform view refresh outside of normal application lifecycle (in the end of AJAX call, or from browser console).
	 * Note: call to this function does not guarantee, that views will be refreshed immediately
	 */
	refreshViews: function() {

		if (!Lava.Core.isProcessingEvent() && !Lava.view_manager.isRefreshing()) {

			this.view_manager.refresh();

		}

	},

	/**
	 * Returns <kw>true</kw>, if tag name is void (does nor require closing tag), like "img" or "input"
	 * @param {string} name
	 * @returns {boolean}
	 */
	isVoidTag: function(name) {

		return this.VOID_TAGS.indexOf(name) != -1;

	},

	/**
	 * Used in process of config extension to merge {@link _cWidget#storage_schema}
	 * @param {Object.<string, _cStorageItemSchema>} dest Child schema
	 * @param {Object.<string, _cStorageItemSchema>} source Parent schema
	 */
	mergeStorageSchema: function(dest, source) {

		var name;

		for (name in source) {

			if (!(name in dest)) {

				dest[name] = source[name];

			} else {

				if (Lava.schema.DEBUG && (dest[name].type != source[name].type || dest[name].tag_name != source[name].tag_name)) Lava.t("[Config storage_schema] property types must match: " + name);

				if ('properties' in source[name]) {

					if (!('properties' in dest[name])) {

						dest[name].properties = source[name].properties;

					} else {

						Firestorm.implement(dest[name].properties, source[name].properties);

					}

				}

			}

		}

	},

	/**
	 * Utility method used in parsers and sugar
	 *
	 * @param {_cWidget} widget_config
	 * @param {string} storage_name
	 * @param {string} item_name
	 * @param {*} value
	 */
	store: function(widget_config, storage_name, item_name, value) {

		if (!(storage_name in widget_config)) widget_config[storage_name] = {};
		if (Lava.schema.DEBUG && (item_name in widget_config[storage_name])) Lava.t("Duplicate item in storage: " + item_name);
		widget_config[storage_name][item_name] = value;

	},

	/**
	 * Utility method used in parsers and sugar
	 *
	 * @param {Object} descriptor
	 * @param {string} value
	 * @returns {*}
	 */
	valueToType: function(descriptor, value) {

		if (Lava.schema.DEBUG && !Lava.types[descriptor.type_name].isValidString(value, descriptor)) Lava.t("Invalid attribute value: " + value);
		return Lava.types[descriptor.type_name].fromSafeString(value, descriptor);

	},

	/**
	 * Suspend a listener, returned by {@link Lava.mixin.Observable#on} or {@link Lava.mixin.Properties#onPropertyChanged}
	 * @param {_tListener} listener
	 */
	suspendListener: function(listener) {
		listener.fn = this.noop;
	},

	/**
	 * Resume listener, suspended by {@link Lava#suspendListener}
	 * @param {_tListener} listener
	 */
	resumeListener: function(listener) {
		listener.fn = listener._fn;
	},

	/**
	 * Do nothing
	 */
	noop: function() {},

	/**
	 * Does given class instance extend or implement `class_name`
	 * @param {Object} instance
	 * @param {string} class_name
	 * @returns {boolean}
	 */
	instanceOf: function(instance, class_name) {

	    if (instance) {
            var Class = instance.Class;
            return Class
                && !instance.hasOwnProperty('Class') // security check to protect from "fake" classes
                && (Class.hierarchy_paths.indexOf(class_name) != -1 || Class.implements.indexOf(class_name) != -1);
        }

		return false;

	},

	/**
	 * Get the Firestorm object (or module instance).
	 * It's usually global, so this method is primarily useful in Node.js environment to get the loaded Firestorm instance
	 * @returns {Firestorm}
	 */
	getFirestorm: function() {

		return Firestorm;

	},

	/**
	 * Destroy global objects. Widgets must be destroyed manually, before calling this method.
	 */
	destroy: function () {

		this.popover_manager && this.popover_manager.destroy();
		this.view_manager && this.view_manager.destroy();
		this.app.destroy();
		this.view_manager.destroy();

	}

};
/**
 * Settings for the entire framework
 */
Lava.schema = {
	/** @const */
	//ELEMENT_EVENT_PREFIX: 'data-e-',
	/**
	 * This option should be turned off in production, but keep in mind: options, defined in template, are part of
	 * view configuration, and they must be valid JSON objects. Putting there anything else will most likely break
	 * existing and future functionality. Options must be serializable!
	 * @const
	 */
	VALIDATE_OPTIONS: true,
	/**
	 * Whether to check paths to objects in evaluated options
	 * @const
	 */
	VALIDATE_OBJECT_PATHS: true,
	/**
	 * Sort algorithm is called stable, if it preserves order of items that are already sorted. Suitable for ordering
	 * table data by several columns
	 * @const
	 */
	DEFAULT_STABLE_SORT_ALGORITHM: 'mergeSort',
	/**
	 * Unstable algorithms are faster, but subsequent sorts mess the previous results
	 * @const
	 */
	DEFAULT_UNSTABLE_SORT_ALGORITHM: 'mergeSort',
	/**
	 * Core settings
	 */
	system: {
		/**
		 * Class for {@link Lava#app}
		 * @const
		 */
		APP_CLASS: 'Lava.system.App',
		/**
		 * Class for {@link Lava#view_manager}
		 * @const
		 */
		VIEW_MANAGER_CLASS: 'Lava.system.ViewManager',
		/**
		 * ViewManager events (routed via templates), which are enabled by default, so does not require a call to lendEvent().
		 * Events from this list must have a valid `target` property.
		 * @const
		 */
		DEFAULT_EVENTS: [
			'click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu',
			'mousewheel', 'keydown', 'keypress', 'keyup',
			'change', 'focus', 'blur', 'input'
		],

		/**
		 * {@link Lava.Cron} uses requestAnimationFrame, if browser supports it
		 * @const
		 */
		ALLOW_REQUEST_ANIMATION_FRAME: true,
		/**
		 * How much times a scope may be refreshed during one refresh loop, before it's considered
		 * an infinite refresh loop
		 * @const
		 */
		REFRESH_INFINITE_LOOP_THRESHOLD: 3 // up to 5 times
	},
	/**
	 * Config for {@link Lava#serializer} - the default instance
	 */
	default_serializer_config: {},
	/**
	 * Settings for {@link Lava#popover_manager}
	 */
	popover_manager: {
		/**
		 * Is PopoverManager enabled
		 * @const
		 */
		IS_ENABLED: true,
		/**
		 * Class for {@link Lava#popover_manager}
		 * @const
		 */
		CLASS: 'Lava.system.PopoverManager',
		/**
		 * Whether it will ignore tooltips with no text
		 * @const
		 */
		HIDE_EMPTY_TOOLTIPS: true
	},
	/**
	 * Settings for {@link Lava#focus_manager}
	 */
	focus_manager: {
		/**
		 * Is FocusManager enabled
		 * @const
		 */
		IS_ENABLED: true,
		/**
		 * Class for {@link Lava#focus_manager}
		 * @const
		 */
		CLASS: 'Lava.system.FocusManager'
	},
	/**
	 * Settings for Data layer: modules, records and fields
	 */
	data: {
		/**
		 * Default class for modules
		 * @const
		 */
		DEFAULT_MODULE_CLASS: 'Module',
		/**
		 * Default class for module records
		 * @const
		 */
		DEFAULT_RECORD_CLASS: 'Record',
		/**
		 * Default class for record fields
		 * @const
		 */
		DEFAULT_FIELD_TYPE: 'Basic',
		/**
		 * Whether to validate the data, which is loaded into modules
		 * @const
		 */
		VALIDATE_IMPORT_DATA: true,
		/**
		 * Validate values, which are assigned to record fields
		 * @const
		 */
		VALIDATE_VALUES: true
	},
	/**
	 * User-defined module settings
	 */
	modules: {},
	/**
	 * Settings for views
	 */
	view: {
		/**
		 * Whether to validate content of the 'class' attribute on Element containers
		 * @const
		 */
		VALIDATE_CLASS_NAMES: true,
		/**
		 * Whether to validate content of the 'style' attribute on Element containers
		 * @const
		 */
		VALIDATE_STYLES: true,
		/**
		 * Gateway, which constructs the views with dynamic class names
		 * @const
		 */
		DEFAULT_CLASS_LOCATOR_GATEWAY: 'Lava.ClassLocatorGateway'
	},
	/**
	 * Settings for parsers
	 */
	parsers: {
		/**
		 * Class that corresponds to each view
		 * @const
		 */
		view_name_to_class_map: {
			'expression': 'Expression',
			'foreach': 'Foreach',
			'if': 'If',
			'view': 'View',
			'include': 'Include'
		},
		/**
		 * Whether to keep original view names in compiled templates, or leave just classes
		 * @const
		 */
		PRESERVE_VIEW_NAME: false,
		/**
		 * When parsing resources: whether to call {@link Lava.resources#exportTranslatableString}
		 * @const
		 */
		EXPORT_STRINGS: false
	},
	/**
	 * Widget settings
	 */
	widget: {
		/**
		 * Whether to validate the values, that are `set()` to widget instances.
		 * May be treated same as DEBUG switch (most likely, you will want to turn this off in production)
		 * @const
		 */
		VALIDATE_PROPERTY_TYPES: true,
		/**
		 * Default class that parses widget's sugar
		 * @const
		 */
		DEFAULT_SUGAR_CLASS: 'Lava.system.Sugar',
		/**
		 * Whether a global widget config may be overwritten
		 */
		ALLOW_REDEFINITION: false,
		/**
		 * Constructor, that extends configs
		 * @const
		 */
		DEFAULT_EXTENSION_GATEWAY: 'Lava.WidgetConfigExtensionGateway',
		/**
		 * Constructor, that resolves class names
		 * @const
		 */
		DEFAULT_CLASS_LOCATOR_GATEWAY: 'Lava.ClassLocatorGateway',
		/**
		 * Default config extension algorithm
		 */
		DEFAULT_EXTENDER: 'Standard'
	},
	/**
	 * Classes, that parse sugar. An instance of each class will be created at the time of initialization
	 * @const
	 */
	SUGAR_CLASSES: ['Lava.system.Sugar'],

	/**
	 * Current locale. Must not be <kw>null</kw> or <str>"default"</str>
	 * @const
	 */
	LOCALE: 'en',
	/**
	 * May be used to turn off resources globally and cut away all resource-related code
	 * @define
	 */
	RESOURCES_ENABLED: true,

	/**
	 * Framework contains hundreds of debug checks. It's strictly not recommended to turn this off
	 * at the time of development and testing
	 * @define
	 */
	DEBUG: true,
	/**
	 * Whether to verify results of the scope refresh cycle. See {@link Lava.ScopeManager} sources.
	 * @define
	 */
	DEBUG_SCOPES: true
};
/**
 * Global functions that are callable from templates
 */
Lava.modifiers = {

	/**
	 * Transform a string to lower case
	 * @param value
	 * @returns {string}
	 */
	toLower: function(value) {

		return value ? value.toString().toLowerCase() : '';

	},

	/**
	 * Upper-case the first letter
	 * @param value
	 * @returns {string}
	 */
	ucFirst: function(value) {

		var result = '';

		if (value) {
			result = value.toString();
			result = result[0].toUpperCase() + result.substr(1);
		}

		return result;

	},

	/**
	 * Apply a function from Firestorm.String
	 * @param value
	 * @param {string} callback_name
	 * @returns {string}
	 */
	stringFunction: function(value, callback_name) {

		return value ? Firestorm.String[callback_name](value.toString()) : '';

	},

	/**
	 * Join an array of values
	 * @param {Array} array
	 * @param {string} glue
	 * @returns {string}
	 */
	joinArray: function(array, glue) {

		return array ? array.join(glue) : '';

	}

};
/**
 * Easings for animation
 */
Lava.transitions = {

	linear: function(x) {
		return x;
	},

	inSine: function (x) {
		return 1 - Math.cos(x * Math.PI / 2);
	},

	outSine: function (x) {
		return Math.sin(x * Math.PI / 2);
	},

	inOutSine: function(x) {
		return -(Math.cos(Math.PI * x) - 1) / 2;
	},

	inQuad: function (x) {
		return x * x;
	},

	outQuad: function (x) {
		return x * (2 - x);
	},

	inOutQuad: function (x) {
		return (x < .5) ? (2 * x * x) : (1 - 2 * (x -= 1) * x);
	},

	inCubic: function (x) {
		return x * x * x;
	},

	outCubic: function (x) {
		return (x -= 1) * x * x + 1;
	},

	inOutCubic: function (x) {
		return (x < .5) ? (4 * x * x * x) : (4 * (x -= 1) * x * x + 1);
	}

};


/**
 * API for working with resources, gathered into separate namespace for convenience
 */
Lava.resources = {

	/**
	 * Helper operations for merging container resources
	 * @type {Object.<string, string>}
	 */
	_container_resources_operations_map: {
		static_properties: '_containerSet',
		static_styles: '_containerSet',
		static_classes: '_containerSet',
		add_properties: '_containerAddObject',
		add_styles: '_containerAddObject',
		add_classes: '_containerAddArray',
		remove_properties: '_containerRemoveObject',
		remove_styles: '_containerRemoveObject',
		remove_classes: '_containerRemoveArray'
	},

	/**
	 * Another map for container resources operations
	 * @type {Object.<string, string>}
	 */
	_container_resources_operands_map: {
		add_properties: 'static_properties',
		remove_properties: 'static_properties',
		add_styles: 'static_styles',
		remove_styles: 'static_styles',
		add_classes: 'static_classes',
		remove_classes: 'static_classes'
	},

	/**
	 * Does nothing by default, but may be overwritten by user to handle string definitions in widget resources.
	 * Example usage: create an export file for translation
	 *
	 * @param {(_cTranslatableString|_cTranslatablePlural)} data
	 * @param {string} widget_title May be used as Domain for strings
	 * @param {string} locale
	 * @param {string} path
	 */
	exportTranslatableString: function(data, widget_title, locale, path) {

	},

	/**
	 * Attach resources object to global widget definition
	 * @param {string} widget_title The name in {@link Lava#widgets}
	 * @param {string} locale Locale of the resource object
	 * @param {Object} locale_resources The object with resources for given locale
	 */
	addWidgetResource: function(widget_title, locale, locale_resources) {

		if (Lava.schema.DEBUG && !(widget_title in Lava.widgets)) Lava.t("Widget config not found: " + widget_title);

		var config = Lava.widgets[widget_title];

		if (config.is_extended) Lava.t("Widget is already extended, can not add resources: " + widget_title);

		if (!config.resources) {
			config.resources = {}
		}

		if (Lava.schema.DEBUG && (locale in config.resources)) Lava.t("Locale is already defined: " + locale);

		config.resources[locale] = locale_resources;

	},

	/**
	 * Merge resource objects.
	 * `top_resources` is expected to be a copy or a new empty object.
	 * Properties in `top_resources` have priority over `bottom_resources`
	 *
	 * @param {Object} top_resources Child resources
	 * @param {Object} bottom_resources Parent resources
	 */
	mergeResources: function(top_resources, bottom_resources) {

		var name,
			result = Firestorm.Object.copy(top_resources);

		for (name in bottom_resources) {

			if (name in result) {

				if (Lava.schema.DEBUG && result[name].type != bottom_resources[name].type) Lava.t("Resource types mismatch: " + name);

				if (bottom_resources[name].type == 'component') {

					result[name] = {
						type: 'component',
						value: this.mergeResources(result[name].value, bottom_resources[name].value)
					};

				} else if (bottom_resources[name].type == 'container_stack') {

					if (result[name].type != 'container_stack') Lava.t();

					result[name] = {
						type: 'container_stack',
						value: bottom_resources[name].value.concat(result[name].value)
					}

				}

			} else {

				result[name] = bottom_resources[name];

			}

		}

		return result;

	},

	/**
	 * Container operations are stacked until first usage to guarantee correct inheritance
	 * @param {Object} resource_object
	 */
	mergeRootContainerStacks: function(resource_object) {

		for (var name in resource_object) {
			if (resource_object[name].type == 'container_stack') {

				resource_object[name] = {
					type: 'container',
					value: this._mergeRootContainerStack(resource_object[name].value)
				}

			}
		}

	},

	/**
	 * Perform merging of "container_stack" resource into "container" resource
	 * @param {Array} stack
	 * @returns {Object}
	 */
	_mergeRootContainerStack: function(stack) {

		var i = 0,
			count = stack.length,
			result = {},
			operation;

		if (Lava.schema.DEBUG && !Array.isArray(stack)) Lava.t();

		for (; i < count; i++) {
			operation = stack[i];
			this[this._container_resources_operations_map[operation.name]](result, operation.name, operation.value);
		}

		return result;

	},

	/** Container resources merging API */
	_containerSet: function(result, name, value) {
		result[name] = value;
	},

	/** Container resources merging API */
	_containerAddObject: function(result, name, value) {
		var operand_name = this._container_resources_operands_map[name];
		if (operand_name in result) {
			Firestorm.extend(result[operand_name], value);
		} else {
			result[operand_name] = value;
		}
	},

	/** Container resources merging API */
	_containerAddArray: function(result, name, value) {
		var operand_name = this._container_resources_operands_map[name];
		if (operand_name in result) {
			result[operand_name] = result[operand_name].concat(value);
		} else {
			result[operand_name] = value;
		}
	},

	/** Container resources merging API */
	_containerRemoveObject: function(result, name, value) {

		var target,
			operand_name = this._container_resources_operands_map[name];
		if (operand_name in result) {
			target = result[operand_name];
			for (var property_name in value) {
				delete target[property_name]
			}
		}
	},

	/** Container resources merging API */
	_containerRemoveArray: function(result, name, value) {
		var operand_name = this._container_resources_operands_map[name];
		if (operand_name in result) {
			Firestorm.Array.excludeAll(result[operand_name], value);
		}
	},

	/**
	 * Helper function which puts the value inside the resources object under given path string.
	 * Used while parsing templates
	 *
	 * @param {Object} target_object The resources object which is being parsed
	 * @param {string} path Path inside the resources object
	 * @param {*} value
	 */
	putResourceValue: function(target_object, path, value) {

		var path_segments = path.split('.'),
			segment,
			resource_name = path_segments.pop(),
			i = 0,
			count = path_segments.length;

		if (Lava.schema.DEBUG && /[a-z]/.test(resource_name)) Lava.t("Terminal resource names must be uppercase");

		for (; i < count; i++) {

			segment = path_segments[i];
			if (Lava.schema.DEBUG && /[A-Z]/.test(segment)) Lava.t("Resource component names must be lowercase");

			if (!(segment in target_object)) {

				target_object[segment] = {
					type: 'component',
					value: {}
				};

			} else {

				if (Lava.schema.DEBUG && target_object[segment].type != 'component') Lava.t("Malformed resource definition, path is not component: " + path);

			}

			target_object = target_object[segment].value;

		}

		if (resource_name in target_object) Lava.t("Resource is already defined: " + path);
		target_object[resource_name] = value;

	}

};
/**
 * Predefined objects which can parse and check strings and values for compliance to certain types
 */
Lava.types = {

	/**
	 * For extension only
	 */
	AbstractType: {

		type_name: null,

		/**
		 * @param {string} value
		 * @param {Object} [descriptor]
		 * @returns {boolean}
		 */
		fromString: function(value, descriptor) {
			if (!this.isValidString(value, descriptor)) Lava.t("Invalid " + this.type_name + " string: " + value);
			return this.fromSafeString(value, descriptor);
		}

	},

	/**
	 * A common boolean type (<kw>true</kw> or <kw>false</kw>)
	 */
	Boolean: {

		"extends": 'AbstractType',

		_mappings: {
			'true': true,
			'1': true,
			'false': false,
			'0': false
		},

		/**
		 * @param {*} value
		 * @returns {boolean}
		 */
		isValidValue: function(value) {

			return typeof(value) == 'boolean';

		},

		isValidString: function(value) {

			return (value in this._mappings);

		},

		fromSafeString: function(value) {

			return this._mappings[value];

		}

	},

	/**
	 * Any string
	 */
	String: {

		"extends": 'AbstractType',

		/**
		 * @param {*} value
		 * @returns {boolean}
		 */
		isValidValue: function(value) {

			return typeof(value) == 'string';

		},

		isValidString: function() {

			return true;

		},

		fromSafeString: function(value) {

			return value;

		}

	},

	/**
	 * Any decimal number
	 */
	Number: {

		"extends": 'AbstractType',

		_valid_value_regex: /^(\-|\+)?\d+(\.\d*)?$/,

		/**
		 * @param {*} value
		 * @returns {boolean}
		 */
		isValidValue: function(value) {

			return typeof(value) == 'number' && this._valid_value_regex.test(value);

		},

		isValidString: function(value) {

			return this._valid_value_regex.test(value);

		},

		fromSafeString: function(value) {

			return +value;

		}

	},

	/**
	 * Numbers without fractional part
	 */
	Integer: {

		"extends": 'Number',

		_valid_value_regex: /^(\-|\+)?\d+$/

	},

	/**
	 * Integers strictly greater than zero
	 */
	PositiveInteger: {

		"extends": 'Number',

		_valid_value_regex: /^\+?[1-9]\d*$/

	},

	/**
	 * Integers greater than zero, or zero
	 */
	NonNegativeInteger: {

		"extends": 'Number',

		_valid_value_regex: /^\+?\d+$/

	},

	/**
	 * A number between 0 and 1, inclusive
	 */
	Percent: {

		"extends": 'Number',

		_valid_value_regex: /^(0?\.\d+|1\.0+|0|1)$/,

		/**
		 * @param {*} value
		 * @returns {boolean}
		 */
		isValidValue: function(value) {

			return typeof(value) == 'number' && value >= 0 && value <=1;

		}

	},

	/**
	 * A string with an array of allowed values
	 */
	Set: {

		"extends": 'AbstractType',

		/**
		 * @param {*} value
		 * @param descriptor
		 * @returns {boolean}
		 */
		isValidValue: function(value, descriptor) {

			if (Lava.schema.DEBUG && (!descriptor || !('allowed_values' in descriptor))) Lava.t("Set type: missing allowed_values in schema");
			return descriptor['allowed_values'].indexOf(value) != -1;

		},

		isValidString: function(value, descriptor) {

			return this.isValidValue(value, descriptor);

		},

		fromSafeString: function(value) {

			return value;

		}

	},

	/**
	 * An HTML attribute which can take it's name as a value. Converts to <kw>true</kw>
	 *
	 * Example: <br/>
	 * checked="checked"<br/>
	 * checked=""
	 */
	SwitchAttribute: {

		"extends": 'AbstractType',

		/**
		 * @param {*} value
		 * @param descriptor
		 * @returns {boolean}
		 */
		isValidValue: function(value, descriptor) {

			return value === '' || value === descriptor.name;

		},

		isValidString: function(value, descriptor) {

			return this.isValidValue(value, descriptor);

		},

		fromSafeString: function() {

			return true;

		}

	},

	/**
	 * A string which is converted to any other value from a map object
	 */
	Map: {

		"extends": 'AbstractType',

		/**
		 * @param {*} value
		 * @param descriptor
		 * @returns {boolean}
		 */
		isValidValue: function(value, descriptor) {

			if (Lava.schema.DEBUG && (!descriptor || !('value_map' in descriptor))) Lava.t("Set type: missing allowed_values in schema");
			return (value in descriptor['value_map']);

		},

		isValidString: function(value, descriptor) {

			return this.isValidValue(value, descriptor);

		},

		fromSafeString: function(value, descriptor) {

			return descriptor['value_map'][value];

		}

	},

	/**
	 * Any array
	 */
	Array: {

		"extends": 'AbstractType',

		isValidValue: function(value) {

			return Array.isArray(value);

		},

		isValidString: function() {

			return false;

		},

		fromSafeString: function() {

			Lava.t();

		}

	},

	/**
	 * Any date
	 */
	Date: {

		"extends": 'AbstractType',

		isValidValue: function(value) {

			return Firestorm.getType(value) == 'date';

		},

		isValidString: function() {

			return false; // will be implemented later

		},

		fromSafeString: function() {

			Lava.t();

		}

	}

};

(function(types) {

	var name;

	function extendLavaType(type_object) {
		var base;
		if ('extends' in type_object) {
			base = types[type_object['extends']];
			if (!base.is_extended) {
				extendLavaType(base);
			}
			Firestorm.implement(type_object, base);
		}
		type_object.is_extended = true;
	}

	for (name in types) {
		extendLavaType(types[name]);
		types[name].type_name = name;
	}

})(Lava.types);
/**
 * The widget config extension algorithms
 */
Lava.extenders = {

	/**
	 * Properties that must be merged with parent configs
	 * @type {Object.<string, string>}
	 */
	_widget_config_merged_properties: {
		includes: '_mergeIncludes',
		sugar: '_mergeSugar',
		storage_schema: '_mergeStorageSchema',
		bindings: '_mergeConfigProperty',
		assigns: '_mergeConfigProperty',
		options: '_mergeConfigProperty',
		properties: '_mergeConfigProperty'
	},

	/**
	 * property_name => needs_implement || property_merge_map
	 * @type {Object}
	 */
	_sugar_merge_map: {
		attribute_mappings: true,
		content_schema: {
			tag_roles: true
		}
	},

	/**
	 * Properties that are merged separately
	 * @type {Array.<string>}
	 */
	_exceptions: ['resources', 'resources_cache', 'storage'],

	/**
	 * Common property merging algorithm, suitable for most cases
	 * @param {_cWidget} dest_container The child config
	 * @param {_cWidget} source_container The parent config
	 * @param {string} property_name The name of the property to merge
	 */
	_mergeConfigProperty: function(dest_container, source_container, property_name) {

		var name,
			dest = dest_container[property_name],
			source = source_container[property_name];

		for (name in source) {

			if (!(name in dest)) {

				dest[name] = source[name];

			}

		}

	},

	/**
	 * Advanced merging algorithm
	 * @param {Object} dest
	 * @param {Object} source
	 * @param {Object} map
	 */
	_mergeWithMap: function(dest, source, map) {

		var name;

		for (name in source) {

			if (!(name in dest)) {

				dest[name] = source[name];

			} else if (name in map) {

				if (map[name] == true) {

					Firestorm.implement(dest[name], source[name]);

				} else {

					this._mergeWithMap(dest[name], source[name], map[name]);

				}

			}

		}

	},

	/**
	 * Merge algorithm for {@link _cWidget#sugar}
	 * @param {_cWidget} dest_container Child config
	 * @param {_cWidget} source_container Parent config
	 * @param {string} property_name
	 */
	_mergeSugar: function(dest_container, source_container, property_name) {

		this._mergeWithMap(dest_container[property_name], source_container[property_name], this._sugar_merge_map);

	},

	/**
	 * Merge algorithm for {@link _cWidget#includes}
	 * @param {_cWidget} dest_container Child config
	 * @param {_cWidget} source_container Parent config
	 * @param {string} property_name
	 * @param {string} parent_widget_name Name of the parent widget
	 */
	_mergeIncludes: function(dest_container, source_container, property_name, parent_widget_name) {

		var name,
			dest = dest_container[property_name],
			source = source_container[property_name],
			new_name;

		for (name in source) {

			if (!(name in dest)) {

				dest[name] = source[name];

			} else {

				new_name = parent_widget_name + '$' + name;
				if (Lava.schema.DEBUG && (new_name in dest)) Lava.t();
				dest[new_name] = source[name];

			}

		}

	},

	/**
	 * Merging algorithm for {@link _cWidget#storage}
	 * @param {_cWidget} dest_container Child config
	 * @param {_cWidget} source_container Parent config
	 * @param {string} property_name
	 */
	_mergeStorage: function(dest_container, source_container, property_name) {

		var name,
			storage_schema = dest_container['storage_schema'],
			dest = dest_container[property_name],
			source = source_container[property_name];

		for (name in source) {

			if (!(name in dest)) {

				dest[name] = source[name];

			} else {

				if (['template_hash', 'object_hash', 'object'].indexOf(storage_schema[name].type) != -1) {

					Firestorm.implement(dest[name], source[name]);

				}

			}

		}

	},

	/**
	 * Merge algorithm for resources
	 * @param {_cWidget} config
	 * @param {_cWidget} parent_config
	 */
	_extendResources: function(config, parent_config) {

		var locale_cache = {};

		if ('resources' in config) {

			if (Lava.schema.LOCALE in config.resources) {
				locale_cache = Lava.resources.mergeResources(locale_cache, config.resources[Lava.schema.LOCALE]);
			}
			if ('default' in config.resources) {
				locale_cache = Lava.resources.mergeResources(locale_cache, config.resources['default']);
			}

		}

		if (parent_config && ('resources_cache' in parent_config)) {

			locale_cache = Lava.resources.mergeResources(locale_cache, parent_config.resources_cache[Lava.schema.LOCALE]);

		}

		if (!Firestorm.Object.isEmpty(locale_cache)) {

			config.resources_cache = {};
			config.resources_cache[Lava.schema.LOCALE] = locale_cache;

		}

	},

	/**
	 * Merge algorithm for {@link _cWidget#storage_schema}
	 * @param {_cWidget} dest_container
	 * @param {_cWidget} source_container
	 * @param {string} property_name
	 */
	_mergeStorageSchema: function(dest_container, source_container, property_name) {

		Lava.mergeStorageSchema(dest_container[property_name], source_container[property_name]);

	},

	/**
	 * Extend raw widget config
	 * @param {_cWidget} config
	 */
	Standard: function(config) {

		var parent_config,
			parent_widget_name;

		if ('extends' in config) {

			parent_widget_name = config['extends'];
			// returns already extended configs
			parent_config = Lava.getWidgetConfig(parent_widget_name);

			for (var name in parent_config) {

				if (this._exceptions.indexOf(name) == -1) {

					if (!(name in config)) {

						config[name] = parent_config[name];

					} else if (name in this._widget_config_merged_properties) {

						this[this._widget_config_merged_properties[name]](config, parent_config, name, parent_widget_name);

					}

				}

			}

			// delay merging of storage until storage_schema is merged
			if ('storage' in parent_config) {
				if (!('storage' in config)) {
					config['storage'] = parent_config['storage'];
				} else {
					this._mergeStorage(config, parent_config, 'storage', parent_widget_name);
				}
			}

		}

		if (Lava.schema.RESOURCES_ENABLED) {
			this._extendResources(config, parent_config);
		}

		if (config.real_class && !('class_locator' in config)) {

			config['class'] = Lava.ClassManager.hasConstructor(config.real_class)
				? config.real_class
				: 'Lava.widget.' + config.real_class;

		} else {

			config['class'] = null;

		}

		config.is_extended = true;

	}

};
/**
 * Controls animations
 */
Lava.Cron = {

	/**
	 * Minimum delay between animation frames
	 * @type {number}
	 * @const
	 */
	DEFAULT_TIMER_DELAY: 20, // up to 50 fps

	/**
	 * window.setInterval reference
	 * @readonly
	 */
	_timer: null,
	/**
	 * Is animation currently running
	 * @type {boolean}
	 * @readonly
	 */
	is_running: false,
	/**
	 * Active animations
	 * @type {Array.<Lava.animation.Abstract>}
	 */
	_active_tasks: [],

	/**
	 * Initialize Lava.Cron object
	 */
	init: function() {

		this._enable = (Firestorm.Environment.requestAnimationFrame && Lava.schema.system.ALLOW_REQUEST_ANIMATION_FRAME)
			? this._enable_AnimationFrame
			: this._enable_Interval;

	},

	/**
	 * Callback for window.setInterval()
	 */
	timeout_callback: function() {

		var self = Lava.Cron;
		self.onTimer();
		if (!self.is_running) {
			clearInterval(self._timer);
			self._timer = null;
		}

	},

	/**
	 * Callback for requestAnimationFrame()
	 */
	animation_frame_callback: function() {

		var self = Lava.Cron;
		self.onTimer();
		if (self.is_running) Firestorm.Environment.requestAnimationFrame(self.animation_frame_callback);

	},

	/**
	 * Start animating
	 * @param {Lava.animation.Abstract} task
	 */
	acceptTask: function(task) {

		if (this._active_tasks.indexOf(task) == -1) {

			this._active_tasks.push(task);

		}

		this._enable();

		if (!this.is_running) {
			this._enable();
			this.is_running = true;
		}

	},

	/**
	 * Create a timer, which executes a callback at nearly equal intervals
	 */
	_enable: function() {

		Lava.t("Framework requires initialization");

	},

	/**
	 * Version of `_enable`, which uses requestAnimationFrame
	 */
	_enable_AnimationFrame: function() {

		Firestorm.Environment.requestAnimationFrame(this.animation_frame_callback);

	},

	/**
	 * Version of `_enable`, which uses setInterval
	 */
	_enable_Interval: function() {

		this._timer = window.setInterval(this.timeout_callback, this.DEFAULT_TIMER_DELAY);

	},

	/**
	 * Call {@link Lava.animation.Abstract#onTimer} of all animations
	 */
	onTimer: function() {

		var time = new Date().getTime(),
			i = 0,
			count = this._active_tasks.length,
			task,
			active_tasks = [];

		for (; i < count; i++) {

			task = this._active_tasks[i];

			if (task.isRunning()) {
				task.onTimer(time);
				// note: at this moment task may be already off, but it's not checked - to save processor resources.
				active_tasks.push(task);
			}

		}

		if (!active_tasks.length) {

			this.is_running = false;

		}

		this._active_tasks = active_tasks;

	}

};
/**
 * Listens to DOM events and provides them to framework
 */
Lava.Core = {

	/**
	 * Map of events that require special support from Core
	 * Note: IE8 and below are not fully supported
	 * @type {Object.<string, Object>}
	 */
	_dom_event_support: {
		focus: {delegation: true},
		blur: {delegation: true},
		change: {delegation: true},
		reset: {delegation: true},
		select: {delegation: true},
		submit: {delegation: true},
		paste: {delegation: true},
		input: {delegation: true}
	},

	/**
	 * Core's own handlers, which then call attached listeners
	 * @type {Object.<string, function>}
	 */
	_event_listeners: {},
	/**
	 * Event listeners are attached only once to the window, and released when they are not needed anymore
	 * @type {Object.<string, number>}
	 */
	_event_usage_counters: {},

	/**
	 * Framework listeners
	 * @type {Object.<string, Array.<_tListener>>}
	 */
	_event_handlers: {},

	/**
	 * Incremented at the beginning of Core's DOM event listener and decremented at the end.
	 * Used to delay refresh of views until the end of event processing.
	 *
	 * @type {number}
	 */
	_nested_handlers_count: 0,

	/**
	 * In case of infinite loops in scope layer, there may be lags, when processing mousemove and other frequent events
	 * @type {Array.<string>}
	 */
	_freeze_protected_events: ['mouseover', 'mouseout', 'mousemove'],

	/**
	 * Add a listener for DOM event. Similar to {@link Lava.mixin.Observable#on}
	 * @param {string} event_name Name of DOM event
	 * @param {function} fn Callback
	 * @param {Object} context Callback owner
	 * @returns {_tListener} The listener structure, similar to {@link Lava.mixin.Observable#on} result
	 */
	addGlobalHandler: function(event_name, fn, context) {

		var listener = {
				event_name: event_name,
				fn: fn,
                _fn: fn,
				context: context
			};

		if (this._event_usage_counters[event_name]) {

			this._event_usage_counters[event_name]++;
			this._event_handlers[event_name].push(listener);

		} else {

			this._event_usage_counters[event_name] = 1;
			this._event_handlers[event_name] = [listener];
			this._initEvent(event_name);

		}

		return listener;

	},

	/**
	 * Release the listener, acquired via call to {@link Lava.Core#addGlobalHandler}
	 * @param {_tListener} listener Listener structure
	 */
	removeGlobalHandler: function(listener) {

		var event_name = listener.event_name,
			index = this._event_handlers[event_name].indexOf(listener);
		if (Lava.schema.DEBUG && index == -1) Lava.t();
		this._event_handlers[event_name].splice(index, 1);

		this._event_usage_counters[event_name]--;

		if (this._event_usage_counters[event_name] == 0) {

			this._shutdownEvent(event_name);

		}

	},

	/**
	 * Used to bind `_onDomEvent` to Core instance
	 * @param {string} event_name DOM event name
	 * @returns {Function}
	 */
	_createEventWrapper: function(event_name) {

		var self = this,
			freeze_protection = this._freeze_protected_events.indexOf(event_name) != -1;

		// I'm not sure about this, but looks like the argument should be specifically named "event"
		// http://stackoverflow.com/questions/11188729/jquery-keyup-event-trouble-in-opera
		// see also this to understand the roots of such behaviour:
		// http://stackoverflow.com/questions/4968194/event-keyword-in-js
		return (Firestorm.Environment.browser_name == 'ie') ? function(event) {

			// IE bug: there can be fractional values for coordinates
			if ('x' in event.page) {
				event.page.x = Math.floor(event.page.x);
				event.page.y = Math.floor(event.page.y);
				event.client.x = Math.floor(event.client.x);
				event.client.y = Math.floor(event.client.y);
			}

			self._onDomEvent(event_name, event, freeze_protection);

		} : function(event) {

			self._onDomEvent(event_name, event, freeze_protection);

		};

	},

	/**
	 * Attach a listener to window object, start listening to the event
	 * @param {string} event_name DOM event name
	 */
	_initEvent: function(event_name) {

		this._event_listeners[event_name] = this._createEventWrapper(event_name);

		//if ((event_name in this._dom_event_support) && this._dom_event_support[event_name].delegation) {

		//	Firestorm.Element.addDelegation(window, event_name, '*', this._event_listeners[event_name]);

		//} else {

			Firestorm.Element.addListener(window, event_name, this._event_listeners[event_name]);

		//}

	},

	/**
	 * Stop listening to DOM event
	 * @param {string} event_name DOM event name
	 */
	_shutdownEvent: function(event_name) {

		if ((event_name in this._dom_event_support) && this._dom_event_support[event_name].delegation) {

			Firestorm.Element.removeDelegation(window, event_name, '*', this._event_listeners[event_name]);

		} else {

			Firestorm.Element.removeListener(window, event_name, this._event_listeners[event_name]);

		}

	},

	/**
	 * Actual listener for DOM events. Calls framework listeners, attached via {@link Lava.Core#addGlobalHandler}
	 * @param {string} event_name DOM event name
	 * @param {Object} event_object Event object, returned by low-level framework
	 * @param {boolean} freeze_protection Is this a frequent event, which may cause lags
	 */
	_onDomEvent: function(event_name, event_object, freeze_protection) {

		// slice, cause handlers may be removed while they are called
		var handlers = this._event_handlers[event_name].slice(),
			i = 0,
			count = handlers.length;

		// unfortunately, browser can raise an event inside another event.
		// Example test case:
		// {$if(is_visible)}
		// 		<button x:click="remove_me">click me</button>
		// {/if}
		// Click handler should set `is_visible` to false, so the button is removed.
		// Button element will be removed from DOM inside click handler, in view_manager.refresh()
		// At the moment of removal, browser fires focusout event. Each event ends with view_manager.refresh(),
		// which will also try to remove the button.
		// Read more here:
		// for understanding, see http://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node
		this._nested_handlers_count++;

		for (; i < count; i++) {

			handlers[i].fn.call(handlers[i].context, event_name, event_object);

		}

		this._nested_handlers_count--;

		if (
			this._nested_handlers_count == 0
			&& !Lava.view_manager.isRefreshing()
			&& (!freeze_protection || !Lava.ScopeManager.hasInfiniteLoop())
		) {

			Lava.view_manager.refresh();

		}

	},

	/**
	 * Return <kw>true</kw>, if `_nested_handlers_count > 0`
	 * @returns {boolean} True, if Core is in the process of calling framework listeners
	 */
	isProcessingEvent: function() {

		return this._nested_handlers_count > 0;

	}

};
/**
 * Performs scope refresh
 */
Lava.ScopeManager = {

	/**
	 * There is a separate queue for each scope level
	 * @type {Array.<Array.<Lava.mixin.Refreshable>>}
	 */
	_scope_refresh_queues: [],
	/**
	 * Minimal index in `_scope_refresh_queues`
	 * @type {number}
	 */
	_min_scope_refresh_level: 0,
	/**
	 * Scopes are updated from lower to higher level, from first index in array to last.
	 * Update cycle may jump to lower level, if a scope is added there during the update cycle.
	 * For each scope level this array stores the number of already updated scopes on that level
	 * @type {Array.<number>}
	 */
	_scope_refresh_current_indices: [],

	/**
	 * User-accessible statistics with critical data
	 * @type {Object}
	 */
	statistics: {
		/**
		 * Each refresh loop has smaller cycles
		 * @type {number}
		 */
		max_refresh_cycles: 0,
		/**
		 * Number of times, when circular dependencies in scope tree has been encountered
		 * @type {number}
		 */
		count_dead_loop_exceptions: 0
	},

	/**
	 * Each refresh loop generates a new id
	 * @type {number}
	 */
	_refresh_id: 0,
	/**
	 * Sign of circular dependency for current loop
	 * @type {boolean}
	 */
	_has_exceptions: false,
	/**
	 * Sign of circular dependency for previous loop
	 * @type {boolean}
	 */
	_has_infinite_loop: false,
	/**
	 * Is refresh loop in progress
	 * @type {boolean}
	 */
	_is_refreshing: false,
	/**
	 * How many locks does it have, see the `lock()` method
	 * @type {number}
	 */
	_lock_count: 0,

	/**
	 * Initialize global ScopeManager object
	 */
	init: function() {

		this.scheduleScopeRefresh = this._scheduleScopeRefresh_Initial;

	},

	/**
	 * Queue a scope for update or refresh it immediately, depending on current ScopeManager state
	 * @param {Lava.mixin.Refreshable} target
	 * @param {number} level
	 * @returns {{index: number}} Refresh ticket
	 */
	scheduleScopeRefresh: function(target, level) {

		Lava.t("Framework requires initialization");

	},

    /**
     * Version to handle the first dirty scope in a refresh cycle.
     * Schedules refresh in view_manager.
     * @param {Lava.mixin.Refreshable} target
     * @param {number} level
     * @returns {{index: number}}
     */
    _scheduleScopeRefresh_Initial: function(target, level) {

        Lava.view_manager.scheduleRefresh();
        this.scheduleScopeRefresh = this._scheduleScopeRefresh_Normal;
	    return this._scheduleScopeRefresh_Normal(target, level);

    },

	/**
	 * Normal version outside of view refresh cycle - adds scope into refresh queue.
	 * @param {Lava.mixin.Refreshable} target
	 * @param {number} level
	 * @returns {{index: number}}
	 */
    _scheduleScopeRefresh_Normal: function(target, level) {

		if (!this._scope_refresh_queues[level]) {

			if (this._min_scope_refresh_level > level) {

				this._min_scope_refresh_level = level;

			}

			this._scope_refresh_queues[level] = [];

		}

		// It absolutely must be an object, but it has no methods for performance reasons - to stay as light as possible
		return {
			index: this._scope_refresh_queues[level].push(target) - 1
		}

	},

	/**
	 * Inside the refresh cycle - refreshes scope immediately
	 * @param {Lava.mixin.Refreshable} target
	 */
	_scheduleScopeRefresh_Locked: function(target) {

		if (target.refresh(this._refresh_id)) {
			Lava.logError('Scope Manager: infinite loop exception outside of normal refresh cycle');
		}

		return null;

	},

	/**
	 * Swap `scheduleScopeRefresh` algorithm to `_scheduleScopeRefresh_Locked`
	 */
	lock: function() {

		if (Lava.schema.DEBUG && this._is_refreshing) Lava.t();
		this.scheduleScopeRefresh = this._scheduleScopeRefresh_Locked;
		this._lock_count++;

	},

	/**
	 * Swap `scheduleScopeRefresh` algorithm to `_scheduleScopeRefresh_Initial`
	 */
	unlock: function() {

		if (this._lock_count == 0) Lava.t();
		this._lock_count--;
		if (this._lock_count == 0) {
			this.scheduleScopeRefresh = this._scheduleScopeRefresh_Initial;
		}

	},

	/**
	 * Remove a scope from update queue
	 * @param {{index: number}} refresh_ticket
	 * @param {number} level
	 */
	cancelScopeRefresh: function(refresh_ticket, level) {

		if (Lava.schema.DEBUG && refresh_ticket == null) Lava.t();
		this._scope_refresh_queues[level][refresh_ticket.index] = null;

	},

	/**
	 * Get `_has_infinite_loop`
	 * @returns {boolean}
	 */
	hasInfiniteLoop: function() {

		return this._has_infinite_loop;

	},

	/**
	 * The main refresh loop
	 */
	refresh: function() {

		if (this._is_refreshing) {
			Lava.logError("ScopeManager: recursive call to ScopeManager#refresh()");
			return;
		}

		var count_refresh_cycles = 0,
			count_levels = this._scope_refresh_queues.length;

		if (count_levels == 0) {

			return;

		}

		this._is_refreshing = true;

		this._has_exceptions = false;
		this._refresh_id++;

		// find the first existent queue
		while (this._min_scope_refresh_level < count_levels) {

			if (this._min_scope_refresh_level in this._scope_refresh_queues) {

				break;

			}

			this._min_scope_refresh_level++;

		}

		if (this._min_scope_refresh_level < count_levels) {

			while (this._scopeRefreshCycle()) {

				count_refresh_cycles++;

			}

		}

		this._scopeMalfunctionCycle();

		if (this._has_exceptions) {

			this._scope_refresh_queues = this._preserveScopeRefreshQueues();

		} else {

			Lava.schema.DEBUG_SCOPES && this.debugVerify();
			this._scope_refresh_queues = [];

		}

		this._scope_refresh_current_indices = [];

		if (this.statistics.max_refresh_cycles < count_refresh_cycles) {

			this.statistics.max_refresh_cycles = count_refresh_cycles;

		}

		this._has_infinite_loop = this._has_exceptions;

		this._is_refreshing = false;

        this.scheduleScopeRefresh = this._scheduleScopeRefresh_Initial;

	},

	/**
	 * One refresh cycle in the refresh loop.
	 * Warning: violates codestyle with multiple return statements
	 * @returns {boolean} <kw>true</kw> if another cycle is needed, <kw>false</kw> when done and queue is clean
	 */
	_scopeRefreshCycle: function() {

		var current_level = this._min_scope_refresh_level,
			current_level_queue = this._scope_refresh_queues[current_level],
			queue_length = current_level_queue.length,
			count_levels,
			i = 0; // 'i' is a copy of current index, for optimizations

		if (current_level in this._scope_refresh_current_indices) {

			i = this._scope_refresh_current_indices[current_level];

		} else {

			this._scope_refresh_current_indices[current_level] = 0;

		}

		do {

			while (i < queue_length) {

				if (current_level_queue[i]) {

					if (current_level_queue[i].refresh(this._refresh_id)) {

						this._has_exceptions = true;
						this.statistics.count_dead_loop_exceptions++;
						Lava.logError('Scope Manager: infinite loop exception, interrupting');
						return false;

					}

				}

				i++;
				this._scope_refresh_current_indices[current_level] = i;

				// during the refresh cycle, additional scopes may be added to the queue, sometimes from lower levels
				if (this._min_scope_refresh_level < current_level) {

					return true;

				}

			}

			queue_length = current_level_queue.length;

		} while (i < queue_length);

		this._scope_refresh_queues[current_level] = null;
		this._scope_refresh_current_indices[current_level] = 0;

		count_levels = this._scope_refresh_queues.length;

		do {

			this._min_scope_refresh_level++;

			if (this._scope_refresh_queues[this._min_scope_refresh_level]) {

				return true;

			}

		} while (this._min_scope_refresh_level < count_levels);

		return false;

	},

	/**
	 * A refresh cycle that is launched in case of circular scope dependency
	 * It will refresh all dirty scopes one time
	 */
	_scopeMalfunctionCycle: function() {

		var current_level = this._min_scope_refresh_level,
			count_levels = this._scope_refresh_queues.length,
			current_queue,
			i,
			count;

		for (;current_level < count_levels; current_level++) {

			if (current_level in this._scope_refresh_queues) {

				current_queue = this._scope_refresh_queues[current_level];
				count = current_queue.length;

				if (current_level in this._scope_refresh_current_indices) {

					i = this._scope_refresh_current_indices[current_level];

				} else {

					this._scope_refresh_current_indices[current_level] = 0;
					i = 0;

				}

				while (i < count) {

					if (current_queue[i]) {

						current_queue[i].refresh(this._refresh_id, true);

					}

					i++;
					this._scope_refresh_current_indices[current_level] = i;

				}

			}

		}

	},

	/**
	 * Launched in case of infinite loop exception:
	 * all existing tickets must be preserved for the next refresh cycle, otherwise the system will be broken
	 * @returns {Array}
	 */
	_preserveScopeRefreshQueues: function() {

		var new_refresh_queues = [],
			current_level = this._min_scope_refresh_level,
			count_levels = this._scope_refresh_queues.length,
			current_queue,
			i,
			count,
			new_level_queue,
			ticket;

		for (;current_level < count_levels; current_level++) {

			if (current_level in this._scope_refresh_queues) {

				current_queue = this._scope_refresh_queues[current_level];
				i = this._scope_refresh_current_indices[current_level] || 0;
				count = current_queue.length;
				new_level_queue = [];

				for (; i < count; i++) {

					if (current_queue[i]) {

						ticket = current_queue[i];
						ticket.index = new_level_queue.push(ticket) - 1;

					}

				}

				new_refresh_queues[current_level] = new_level_queue;

			}

		}

		return new_refresh_queues;

	},

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Debug-mode validations

	/**
	 * An array of all scopes in the framework, for debug purpose only
	 * @type {Array.<Lava.mixin.Refreshable>}
	 */
	_debug_all_scopes: [],

	/**
	 * Add a scope to `_debug_all_scopes`
	 * @param {Lava.mixin.Refreshable} scope
	 */
	debugTrackScope: function(scope) {

		this._debug_all_scopes.push(scope);

	},

	/**
	 * Remove a scope from `_debug_all_scopes`
	 * @param {Lava.mixin.Refreshable} scope
	 */
	debugStopTracking: function(scope) {

		var index = this._debug_all_scopes.indexOf(scope);
		if (index == -1) Lava.t();
		this._debug_all_scopes.splice(index, 1);

	},

	/**
	 * LiquidLava alpha: debug verification that scope refresh cycle works as expected
	 */
	debugVerify: function() {

		try {

			for (var i = 0, count = this._debug_all_scopes.length; i < count; i++) {
				this._debug_all_scopes[i].debugAssertClean();
			}

		} catch (e) {

			Lava.logException(e);

		}

	}

	// end: debug-mode validations
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

};

/**
 * Stable. Can not be called recursively
 */
Lava.algorithms.sorting.mergeSort = (function(){
	"use strict";

	var _less = null;

	/**
	 * @param {Array} left
	 * @param {Number} left_count
	 * @param {Array} right
	 * @param {Number} right_count
	 * @returns {Array}
	 */
	function _merge(left, left_count, right, right_count) {

		var result = [],
			left_index = 0,
			right_index = 0;

		while (left_index < left_count && right_index < right_count) {

			if (_less(left[left_index], right[right_index])) {

				result.push(left[left_index]);
				left_index++;

			} else {

				result.push(right[right_index]);
				right_index++;

			}

		}

		if (left_index < left_count) {

			result = result.concat(left.slice(left_index));

		}

		if (right_index < right_count) {

			result = result.concat(right.slice(right_index));

		}

		return result;

	}

	/**
	 * @param {Array} items
	 * @param {Number} length
	 * @returns {Array}
	 */
	function _sort(items, length) {

		var middle,
			right;

		if (length == 2) {
			return _less(items[0], items[1]) ? items : [items[1], items[0]];
		}

		middle = Math.floor(length / 2);
		right = length - middle;

		return _merge(
			(middle < 2) ? items.slice(0, middle) : _sort(items.slice(0, middle), middle),
			middle,
			(right < 2) ? items.slice(middle) : _sort(items.slice(middle), right),
			right
		);

	}

	return function(items, less) {

		var length = items.length,
			result;

		if (length < 2) {

			// @todo ��� ���� clone()?
			result = items;

		} else {

			_less = less;
			result = _sort(items, length);

		}

		return result;

	};

})();
/**
 * Create and manage classes
 */
Lava.ClassManager = {

	/**
	 * Whether to serialize them and inline as a value, when building constructor,
	 * or slice() from original array in original object
	 * @type {boolean}
	 */
	inline_simple_arrays: true,
	/**
	 * If an array consists of these types - it can be inlined
	 * @type {Array.<string>}
	 */
	SIMPLE_TYPES: ['string', 'boolean', 'number', 'null', 'undefined'],

	/**
	 * Member type IDs in skeleton
	 * @enum {number}
	 */
	MEMBER_TYPES: {
		FUNCTION: 0,
		PRIMITIVE: 1,
		OBJECT: 2,
		STRING: 3,
		REGEXP: 4,
		EMPTY_ARRAY: 5,
		INLINE_ARRAY: 6,
		SLICE_ARRAY: 7
	},

	/**
	 * All data that belongs to each class: everything that's needed for inheritance and building of a constructor
	 * @type {Object.<string, _cClassData>}
	 */
	_sources: {},
	/**
	 * Constructors for each class
	 * @type {Object.<string, function>}
	 */
	constructors: {},
	/**
	 * Special directives, understandable by ClassManager
	 */
	_reserved_members: ['Extends', 'Implements', 'Class', 'Shared'],

	/**
	 * Namespaces, which can hold class constructors
	 * @type {Object.<string, Object>}
	 */
	_root: {},

	/**
	 * Add a namespace, that can contain class constructors
	 * @param {string} name The name of the namespace
	 * @param {Object} object The namespace object
	 */
	registerRootNamespace: function(name, object) {

		this._root[name] = object;

	},

	/**
	 * Get {@link _cClassData} structure for each class
	 * @param {string} class_path
	 * @returns {_cClassData}
	 */
	getClassData: function(class_path) {

		return this._sources[class_path];

	},

    /**
     * Returns an object with all class structures by their path
     * @returns {Object.<string, _cClassData>}
     */
    getAllClasses: function() {

        return this._sources;

    },

	/**
	 * Create a class
	 * @param {string} class_path Full name of the class
	 * @param {Object} class_body Class body
	 */
	define: function(class_path, class_body) {

		var name,
			class_data,
			parent_data,
			i,
			count,
			shared_names,
			is_array,
			type;

		class_data = /** @type {_cClassData} */ {
			name: class_path.split('.').pop(),
			path: class_path,
            class_body: class_body,
			"extends": null,
			"implements": [],
			parent_class_data: null,
			hierarchy_paths: null,
			hierarchy_names: null,
			skeleton: null,
			references: [],
			shared: {},
			constructor: null,
			own_references_count: 0
		};

		if ('Extends' in class_body) {

			if (Lava.schema.DEBUG && typeof(class_body.Extends) != 'string') Lava.t('Extends: string expected. ' + class_path);
			class_data['extends'] = /** @type {string} */ class_body.Extends;
			parent_data = this._sources[class_body.Extends];
			class_data.parent_class_data = parent_data;

			if (!parent_data) Lava.t('[define] Parent class not found: "' + class_body.Extends + '"');
			if (!parent_data.skeleton) Lava.t("[define] Parent class was loaded without skeleton, extension is not possible: " + class_data['extends']);
			if (parent_data.hierarchy_names.indexOf(class_data.name) != -1) Lava.t("[define] Duplicate name in inheritance chain: " + class_data.name + " / " + class_path);

			class_data.hierarchy_paths = parent_data.hierarchy_paths.slice();
			class_data.hierarchy_paths.push(class_path);
			class_data.hierarchy_names = parent_data.hierarchy_names.slice();
			class_data.hierarchy_names.push(class_data.name);
			class_data.references = parent_data.references.slice();
			class_data.own_references_count -= parent_data.references.length;
			class_data.implements = parent_data.implements.slice();

			for (name in parent_data.shared) {

				is_array = Array.isArray(parent_data.shared[name]);
				class_data.shared[name] = is_array
					? parent_data.shared[name].slice()
					: Firestorm.Object.copy(parent_data.shared[name]);

				if (name in class_body) {

					if (Lava.schema.DEBUG && Array.isArray(class_body[name]) != is_array) Lava.t("Shared members of different types must not override each other (array must not become an object)");
					if (is_array) {
						class_data.shared[name] = class_body[name];
					} else {
						Firestorm.extend(class_data.shared[name], class_body[name]);
					}

				}

			}

		} else {

			class_data.hierarchy_paths = [class_path];
			class_data.hierarchy_names = [class_data.name];

		}

		if ('Shared' in class_body) {

			shared_names = (typeof(class_body.Shared) == 'string') ? [class_body.Shared] : class_body.Shared;

			for (i = 0, count = shared_names.length; i < count; i++) {

				name = shared_names[i];
				type = Firestorm.getType(class_body[name]);

				if (Lava.schema.DEBUG) {
					if (!(name in class_body)) Lava.t("Shared member is not in class: " + name);
					if (type != 'object' && type != 'array') Lava.t("Shared: class member must be an object or array");
					if (class_data.parent_class_data && (name in class_data.parent_class_data.skeleton)) Lava.t("[ClassManager] instance member from parent class may not become shared in descendant: " + name);
					if (name in class_data.shared) Lava.t("Member is already shared in parent class: " + class_path + "#" + name);
				}

				class_data.shared[name] = class_body[name];

			}

		}

		class_data.skeleton = this._disassemble(class_data, class_body, true);

		if (parent_data) {

			this._extend(class_data, class_data.skeleton, parent_data, parent_data.skeleton, true);

		}

		class_data.own_references_count += class_data.references.length;

		if ('Implements' in class_body) {

			if (typeof(class_body.Implements) == 'string') {

				this._implementPath(class_data, class_body.Implements);

			} else {

				for (i = 0, count = class_body.Implements.length; i < count; i++) {

					this._implementPath(class_data, class_body.Implements[i]);

				}

			}

		}

        if (Lava.schema.DEBUG) {
            for (name in class_data.shared) {
                if (name in class_data.skeleton) Lava.t('Shared class member is hidden by member from instance: ' + class_data.path + "::" + name);
            }
        }

		class_data.constructor = this._buildRealConstructor(class_data);

		this._registerClass(class_data);

	},

	/**
	 * Implement members from another class into current class data
	 * @param {_cClassData} class_data
	 * @param {string} path
	 */
	_implementPath: function(class_data, path) {

		var implements_source = this._sources[path],
			name,
			references_offset;

		if (Lava.schema.DEBUG) {

			if (!implements_source) Lava.t('Implements: class not found - "' + path + '"');
			for (name in implements_source.shared) Lava.t("Implements: unable to use a class with Shared as mixin. " + class_data.psth + " <- " + path);
			if (class_data.implements.indexOf(path) != -1) Lava.t("Implements: class " + class_data.path + " already implements " + path);

		}

		class_data.implements.push(path);
		references_offset = class_data.references.length;
		// array copy is inexpensive, cause it contains only reference types
		class_data.references = class_data.references.concat(implements_source.references);

		this._extend(class_data, class_data.skeleton, implements_source, implements_source.skeleton, true, references_offset);

	},

	/**
	 * Perform extend/implement operation
	 * @param {_cClassData} child_data
	 * @param {Object} child_skeleton The skeleton of a child object
	 * @param {_cClassData} parent_data
	 * @param {Object} parent_skeleton The skeleton of a parent object
	 * @param {boolean} is_root <kw>true</kw>, when extending skeletons class bodies, and <kw>false</kw> in all other cases
	 * @param {number} [references_offset] Also acts as a sign of 'implements' mode
	 */
	_extend: function (child_data, child_skeleton, parent_data, parent_skeleton, is_root, references_offset) {

		var parent_descriptor,
			name,
			new_name,
			parent_type;

		for (name in parent_skeleton) {

			parent_descriptor = parent_skeleton[name];
			parent_type = parent_descriptor.type;

			if (name in child_skeleton) {

				if (is_root && (child_skeleton[name].type == this.MEMBER_TYPES.FUNCTION ^ parent_type == this.MEMBER_TYPES.FUNCTION)) {
					Lava.t('Extend: functions in class root are not replaceable with other types (' + name + ')');
				}

				if (parent_type == this.MEMBER_TYPES.FUNCTION) {

					if (!is_root || typeof(references_offset) != 'undefined') continue;

					new_name = parent_data.name + '$' + name;
					if (new_name in child_skeleton) Lava.t('[ClassManager] Assertion failed, function already exists: ' + new_name);
					child_skeleton[new_name] = parent_descriptor;

				} else if (parent_type == this.MEMBER_TYPES.OBJECT) {

					this._extend(child_data, child_skeleton[name].skeleton, parent_data, parent_descriptor.skeleton, false, references_offset);

				}

			} else if (parent_type == this.MEMBER_TYPES.OBJECT) {

				child_skeleton[name] = {type: this.MEMBER_TYPES.OBJECT, skeleton: {}};
				this._extend(child_data, child_skeleton[name].skeleton, parent_data, parent_descriptor.skeleton, false, references_offset);

			} else if (
				references_offset &&
				(
					parent_type == this.MEMBER_TYPES.FUNCTION
					|| parent_type == this.MEMBER_TYPES.SLICE_ARRAY
					|| parent_type == this.MEMBER_TYPES.REGEXP
				)
			) {

				child_skeleton[name] = {type: parent_type, index: parent_descriptor.index + references_offset};

			} else {

				child_skeleton[name] = parent_descriptor;

			}

		}

	},

	/**
	 * Recursively create skeletons for all objects inside class body
	 * @param {_cClassData} class_data
	 * @param {Object} class_body
	 * @param {boolean} is_root
	 * @returns {Object}
	 */
	_disassemble: function(class_data, class_body, is_root) {

		var name,
			skeleton = {},
			value,
			type,
			skeleton_value;

		for (name in class_body) {

			if (is_root && (this._reserved_members.indexOf(name) != -1 || (name in class_data.shared))) {

				continue;

			}

			value = class_body[name];
			type = Firestorm.getType(value);

			switch (type) {
				case 'null':
				case 'boolean':
				case 'number':
					skeleton_value = {type: this.MEMBER_TYPES.PRIMITIVE, value: value};
					break;
				case 'string':
					skeleton_value = {type: this.MEMBER_TYPES.STRING, value: value};
					break;
				case 'function':
					skeleton_value = {type: this.MEMBER_TYPES.FUNCTION, index: class_data.references.length};
					class_data.references.push(value);
					break;
				case 'regexp':
					skeleton_value = {type: this.MEMBER_TYPES.REGEXP, index: class_data.references.length};
					class_data.references.push(value);
					break;
				case 'object':
					skeleton_value = {
						type: this.MEMBER_TYPES.OBJECT,
						skeleton: this._disassemble(class_data, value, false)
					};
					break;
				case 'array':
					if (value.length == 0) {
						skeleton_value = {type: this.MEMBER_TYPES.EMPTY_ARRAY};
					} else if (this.inline_simple_arrays && this.isInlineArray(value)) {
						skeleton_value = {type: this.MEMBER_TYPES.INLINE_ARRAY, value: value};
					} else {
						skeleton_value = {type: this.MEMBER_TYPES.SLICE_ARRAY, index: class_data.references.length};
						class_data.references.push(value);
					}
					break;
				case 'undefined':
					Lava.t("[ClassManager] Forced code style restriction: please, replace undefined member values with null. Member name: " + name);
					break;
				default:
					Lava.t("[ClassManager] Unsupported property type in source object: " + type);
					break;
			}

			skeleton[name] = skeleton_value;

		}

		return skeleton;

	},

	/**
	 * Build class constructor that can be used with the <kw>new</kw> keyword
	 * @param {_cClassData} class_data
	 * @returns {function} The class constructor
	 */
	_buildRealConstructor: function(class_data) {

		var prototype = {},
			skeleton = class_data.skeleton,
			serialized_value,
			constructor_actions = [],
			name,
			source,
			constructor,
			object_properties,
			uses_references = false;

		for (name in skeleton) {

			switch (skeleton[name].type) {
				case this.MEMBER_TYPES.STRING:
                    serialized_value = Firestorm.String.quote(skeleton[name].value);
					break;
				case this.MEMBER_TYPES.PRIMITIVE: // null, boolean, number
                    serialized_value = skeleton[name].value + '';
					break;
				case this.MEMBER_TYPES.EMPTY_ARRAY:
					serialized_value = "[]";
					break;
				case this.MEMBER_TYPES.INLINE_ARRAY:
					serialized_value = this._serializeInlineArray(skeleton[name].value);
					break;
				case this.MEMBER_TYPES.REGEXP:
				case this.MEMBER_TYPES.FUNCTION:
					prototype[name] = class_data.references[skeleton[name].index];
					break;
				case this.MEMBER_TYPES.SLICE_ARRAY:
					serialized_value = 'r[' + skeleton[name].index + '].slice()';
					uses_references = true;
					break;
				case this.MEMBER_TYPES.OBJECT:
					object_properties = [];
					if (this._serializeSkeleton(skeleton[name].skeleton, class_data, "\t", object_properties)) {
						uses_references = true;
					}
					serialized_value = object_properties.length
						? "{\n\t" + object_properties.join(",\n\t") + "\n}"
						: "{}";
					break;
				default:
					Lava.t("[_buildRealConstructor] unknown property descriptor type: " + skeleton[name].type);
			}

			if (serialized_value) {

				if (Lava.VALID_PROPERTY_NAME_REGEX.test(name)) {

					constructor_actions.push('this.' + name + ' = ' + serialized_value);

				} else {

					constructor_actions.push('this[' + Firestorm.String.quote(name) + '] = ' + serialized_value);

				}

				serialized_value = null;

			}

		}

		for (name in class_data.shared) {

			prototype[name] = class_data.shared[name];

		}

		prototype.Class = class_data;

		source = (uses_references ? ("var r=this.Class.references;\n") : '')
			+ constructor_actions.join(";\n")
			+ ";";

		if (class_data.skeleton.init) {

			source += "\nthis.init.apply(this, arguments);";

		}

		constructor = new Function(source);
		// for Chrome we could assign prototype object directly,
		// but in Firefox this will result in performance degradation
		Firestorm.extend(constructor.prototype, prototype);
		return constructor;

	},

	/**
	 * Perform special class serialization, that takes functions and resources from class data and can be used in constructors
	 * @param {Object} skeleton
	 * @param {_cClassData} class_data
	 * @param {string} padding
	 * @param {Array} serialized_properties
	 * @returns {boolean} <kw>true</kw>, if object uses {@link _cClassData#references}
	 */
	_serializeSkeleton: function(skeleton, class_data, padding, serialized_properties) {

		var name,
			serialized_value,
			uses_references = false,
			object_properties;

		for (name in skeleton) {

			switch (skeleton[name].type) {
				case this.MEMBER_TYPES.STRING:
					serialized_value = Firestorm.String.quote(skeleton[name].value);
					break;
				case this.MEMBER_TYPES.PRIMITIVE: // null, boolean, number
					serialized_value = skeleton[name].value + '';
					break;
				case this.MEMBER_TYPES.REGEXP:
				case this.MEMBER_TYPES.FUNCTION:
					serialized_value = 'r[' + skeleton[name].index + ']';
					uses_references = true;
					break;
				case this.MEMBER_TYPES.EMPTY_ARRAY:
					serialized_value = "[]";
					break;
				case this.MEMBER_TYPES.INLINE_ARRAY:
					serialized_value = this._serializeInlineArray(skeleton[name].value);
					break;
				case this.MEMBER_TYPES.SLICE_ARRAY:
					serialized_value = 'r[' + skeleton[name].index + '].slice()';
					uses_references = true;
					break;
				case this.MEMBER_TYPES.OBJECT:
					object_properties = [];
					if (this._serializeSkeleton(skeleton[name].skeleton, class_data, padding + "\t", object_properties)) {
						uses_references = true;
					}
					serialized_value = object_properties.length
						? "{\n\t" + padding + object_properties.join(",\n\t" + padding) + "\n" + padding + "}" : "{}";
					break;
				default:
					Lava.t("[_serializeSkeleton] unknown property descriptor type: " + skeleton[name].type);
			}

			if (Lava.VALID_PROPERTY_NAME_REGEX.test(name) && Lava.JS_KEYWORDS.indexOf(name) == -1) {

				serialized_properties.push(name + ': ' + serialized_value);

			} else {

				serialized_properties.push(Firestorm.String.quote(name) + ': ' + serialized_value);

			}

		}

		return uses_references;

	},

	/**
	 * Get namespace for a class constructor
	 * @param {Array.<string>} path_segments Path to the namespace of a class. Must start with one of registered roots
	 * @returns {Object}
	 */
	_getNamespace: function(path_segments) {

		var namespace,
			segment_name,
			count = path_segments.length,
			i = 1;

		if (!count) Lava.t("ClassManager: class names must include a namespace, even for global classes.");
		if (!(path_segments[0] in this._root)) Lava.t("[ClassManager] namespace is not registered: " + path_segments[0]);
		namespace = this._root[path_segments[0]];

		for (; i < count; i++) {

			segment_name = path_segments[i];

			if (!(segment_name in namespace)) {

				namespace[segment_name] = {};

			}

			namespace = namespace[segment_name];
            if (Lava.schema.DEBUG && !namespace) Lava.t("Namespaces must be objects: please make sure, that path " + path_segments.join('.') + " does not contain null or undefined values.");

		}

		return namespace;

	},

	/**
	 * Get class constructor
	 * @param {string} class_path Full name of a class, or a short name (if namespace is provided)
	 * @param {string} [default_namespace] The default prefix where to search for the class, like <str>"Lava.widget"</str>
	 * @returns {function}
	 */
	getConstructor: function(class_path, default_namespace) {

		if (!(class_path in this.constructors) && default_namespace) {

			class_path = default_namespace + '.' + class_path;

		}

		return this.constructors[class_path];

	},

	/**
	 * Whether to inline or slice() an array in constructor
	 * @param {Array} items
	 * @returns {boolean}
	 */
	isInlineArray: function(items) {

		var result = true,
			i = 0,
			count = items.length;

		for (; i < count; i++) {

			if (this.SIMPLE_TYPES.indexOf(Firestorm.getType(items[i])) == -1) {
				result = false;
				break;
			}

		}

		return result;

	},

	/**
	 * Serialize an array which contains only certain primitive types from `SIMPLE_TYPES` property
	 *
	 * @param {Array} data
	 * @returns {string}
	 */
	_serializeInlineArray: function(data) {

		var tempResult = [],
			i = 0,
			count = data.length,
			type,
			value;

		for (; i < count; i++) {

			type = Firestorm.getType(data[i]);
			switch (type) {
				case 'string':
					value = Firestorm.String.quote(data[i]);
					break;
				case 'null':
				case 'undefined':
				case 'boolean':
				case 'number':
					value = data[i] + '';
					break;
				default:
					Lava.t();
			}
			tempResult.push(value);

		}

		return '[' + tempResult.join(", ") + ']';

	},

	/**
	 * Register an existing function as a class constructor for usage with {@link Lava.ClassManager#getConstructor}()
	 * @param {string} class_path Full class path
	 * @param {function} constructor Constructor instance
	 */
	registerExistingConstructor: function(class_path, constructor) {

		if (class_path in this._sources) Lava.t('Class "' + class_path + '" is already defined');
		this.constructors[class_path] = constructor;

	},

	/**
	 * Does a constructor exists
	 * @param {string} class_path Full class path
	 * @returns {boolean}
	 */
	hasConstructor: function(class_path) {

		return class_path in this.constructors;

	},

	/**
	 * Does a class exists
	 * @param {string} class_path
	 * @returns {boolean}
	 */
	hasClass: function(class_path) {

		return class_path in this._sources;

	},

	/**
	 * Put a newly built class constructor into it's namespace
	 * @param {_cClassData} class_data
	 */
	_registerClass: function(class_data) {

		var class_path = class_data.path,
			namespace_path,
			class_name,
			namespace;

		if ((class_path in this._sources) || (class_path in this.constructors)) Lava.t("Class is already defined: " + class_path);
		this._sources[class_path] = class_data;

		if (class_data.constructor) {

			namespace_path = class_path.split('.');
			class_name = namespace_path.pop();
			namespace = this._getNamespace(namespace_path);

			if ((class_name in namespace) && namespace[class_name] != null) Lava.t("Class name conflict: '" + class_path + "' property is already defined in namespace path");

			this.constructors[class_path] = class_data.constructor;
			namespace[class_name] = class_data.constructor;

		}

	},

	/**
	 * Find a class that begins with `base_path` or names of it's parents, and ends with `suffix`
	 * @param {string} base_path
	 * @param {string} suffix
	 * @returns {function}
	 */
	getPackageConstructor: function(base_path, suffix) {

		if (Lava.schema.DEBUG && !(base_path in this._sources)) Lava.t("[getPackageConstructor] Class not found: " + base_path);

		var path,
			current_class = this._sources[base_path],
			result = null;

		do {

			path = current_class.path + suffix;
			if (path in this.constructors) {

				result = this.constructors[path];
				break;

			}

			current_class = current_class.parent_class_data;

		} while (current_class);

		return result;

	},

	/**
	 * Get all names (full paths) of registered classes
	 * @returns {Array.<string>}
	 */
	getClassNames: function() {

		return Object.keys(this._sources);

	},

	/**
	 * Replace function in a class with new body. Class may be in middle of inheritance chain.
	 * Also replaces old method with <kw>null</kw>.
	 *
	 * @param {Object} instance Current class instance, must be <kw>this</kw>
	 * @param {string} instance_class_name Short name of current class
	 * @param {string} function_name Function to replace
	 * @param {string} new_function_name Name of new method from the prototype
	 * @returns {string} name of the method that was replaced
	 */
	patch: function(instance, instance_class_name, function_name, new_function_name) {

		var cd = instance.Class,
			proto = cd.constructor.prototype,
			names = cd.hierarchy_names,
			i = names.indexOf(instance_class_name),
			count = names.length,
			overridden_name;

		if (Lava.schema.DEBUG && i == -1) Lava.t();

		// find method that belongs to this class body
		for (; i < count; i++) {
			overridden_name = names[i] + "$" + function_name;
			// must not use "in" operator, as function body can be removed and assigned null (see below)
			if (proto[overridden_name]) {
				function_name = overridden_name;
				break;
			}
		}

		proto[function_name] = proto[new_function_name];
		// this plays role when class replaces it's method with parent's method (removes it's own method)
		// and parent also wants to apply patches to the same method (see comment above about the "in" operator)
		proto[new_function_name] = null;
		return function_name;

	}

};
/**
 * Common methods and properties for working with widget templates
 */
Lava.parsers.Common = {

	/**
	 * Same as regex in {@link Firestorm.String}, but without quotes and backslash
	 */
	UNQUOTE_ESCAPE_REGEX: /[\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,

	/**
	 * The only allowed options on view's hash
	 * @type {Array.<string>}
	 */
	_allowed_hash_options: ['id', 'label', 'escape_off', 'as', 'own_enumerable_mode', 'depends'],
	/**
	 * Allowed "x:" attributes on elements
	 * @type {Array.<string>}
	 */
	_allowed_control_attributes: ['event', 'bind', 'style', 'classes', 'container_class', 'type', 'options', 'label', 'roles', 'resource_id', 'widget'],
	/**
	 * Words, that cannot be used as a label
	 * @type {Array.<string>}
	 */
	_reserved_labels: ['parent', 'widget', 'this', 'root'],

	/**
	 * When widgets are referenced in expressions - they are prefixed with these special characters, which define the kind of reference
	 * @type {Object.<string, string>}
	 */
	locator_types: {
		'#': 'Id',
		'@': 'Label',
		'$': 'Name'
	},

	/**
	 * A widget locator with a name (`_identifier_regex`) after dot. Examples: <str>"@accordion.accordion_panel"</str>,
	 * <str>"$tree.Tree$node"</str>.
	 */
	_locator_regex: /^[\$\#\@]([a-zA-Z\_][a-zA-Z0-9\_]*)\.([a-zA-Z\_][\$a-zA-Z0-9\_]*)/,
	/**
	 * Valid name of a variable
	 * @type {RegExp}
	 */
	_identifier_regex: /^[a-zA-Z\_][\$a-zA-Z0-9\_]*/,

	/**
	 * Special setters for some properties in view config
	 * @type {Object.<string, string>}
	 */
	_view_config_property_setters: {
		id: 'setViewConfigId',
		label: 'setViewConfigLabel',
		own_enumerable_mode: '_setOwnEnumerableMode',
		depends: '_setDepends'
	},

	/**
	 * For each type of item in raw templates: callbacks that return it's "compiled" version
	 * @type {Object.<string, string>}
	 */
	_compile_handlers: {
		string: '_compileString',
		include: '_compileInclude',
		expression: '_compileExpression',
		directive: '_compileDirective',
		block: '_compileBlock',
		tag: '_compileTag', // plain html tag, which should be converted to string
		// depending on attributes, tag may be treated as one of the following types:
		view: '_compileView', // element with x:type='view'
		container: '_compileContainer', // element with x:type='container'
		static: '_compileStaticContainer', // element with x:type='static'
		widget: '_compileWidget', // element with x:widget='WidgetName'
		sugar: '_compileSugar' // element with it's name in schema.sugar_map
	},

	LITERALS: {
		'null': null,
		'undefined': void 0,
		'true': true,
		'false': false
	},

	/**
	 * Translate name of the view to name of it's class
	 * @param {string} name
	 * @returns {string}
	 */
	_viewNameToClass: function(name) {

		return Lava.schema.parsers.view_name_to_class_map[name] || name;

	},

	/**
	 * Store values from view's hash as config properties
	 * @param {_cView} view_config
	 * @param {Object} raw_hash
	 */
	_parseViewHash: function(view_config, raw_hash) {

		for (var name in raw_hash) {

			if (Lava.schema.DEBUG && this._allowed_hash_options.indexOf(name) == -1) Lava.t("Hash option is not supported: " + name);
			if (name in this._view_config_property_setters) {
				this[this._view_config_property_setters[name]](view_config, raw_hash[name]);
			} else {
				view_config[name] = raw_hash[name];
			}

		}

	},

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Start: config property setters

	/**
	 * Check {@link _cView#id} for validity before assignment
	 * @param {_cView} view_config
	 * @param {string} id
	 */
	setViewConfigId: function(view_config, id) {

		if (Lava.schema.DEBUG && !Lava.isValidId(id)) Lava.t();
		view_config.id = id;

	},

	/**
	 * Check {@link _cView#label} for validity before assignment
	 * @param {_cView} view_config
	 * @param {string} label
	 */
	setViewConfigLabel: function(view_config, label) {

		if (Lava.schema.DEBUG && !Lava.VALID_LABEL_REGEX.test(label)) Lava.t("Malformed view label");
		if (Lava.schema.DEBUG && this._reserved_labels.indexOf(label) != -1) Lava.t("Label name is reserved: " + label);
		view_config.label = label;

	},

	/**
	 * Set {@link _cScopeForeach#own_enumerable_mode}
	 * @param {_cView} view_config
	 * @param {string} own_enumerable_mode <str>"Enumerable"</str> or <str>"DataView"</str>
	 */
	_setOwnEnumerableMode: function(view_config, own_enumerable_mode) {

		if (Lava.schema.DEBUG && ['Enumerable', 'DataView'].indexOf(own_enumerable_mode) == -1) Lava.t("Malformed 'own_enumerable_mode' hash option");

		if (!('scope' in view_config)) {
			view_config['scope'] = {
				"own_enumerable_mode": own_enumerable_mode
			}
		} else {
			if (Lava.schema.DEBUG && ('own_enumerable_mode' in view_config['scope'])) Lava.t();
			view_config['scope']['own_enumerable_mode'] = own_enumerable_mode;
		}

	},

	/**
	 * Set {@link _cScopeForeach#depends}
	 * @param {_cView} view_config
	 * @param {string} depends_text Semicolon-separated list of scope paths
	 */
	_setDepends: function(view_config, depends_text) {

		var binds = [],
			raw_arguments = Lava.ExpressionParser.parseRaw(depends_text, Lava.ExpressionParser.SEPARATORS.SEMICOLON),
			i = 0,
			count = raw_arguments.length;

		if (Lava.schema.DEBUG && count == 0) Lava.t("malformed 'depends' hash option");

		for (; i < count; i++) {
			if (Lava.schema.DEBUG && (!raw_arguments[i].flags || !raw_arguments[i].flags.isScopeEval)) Lava.t('malformed "depends" hash option: argument ');
			binds.push(raw_arguments[i].binds[0]);
		}

		if (!('scope' in view_config)) {
			view_config['scope'] = {
				"depends": binds
			}
		} else {
			if (Lava.schema.DEBUG && ('depends' in view_config['scope'])) Lava.t();
			view_config['scope']['depends'] = binds;
		}

	},

	// End: config property setters
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Start: block handlers

	/**
	 * Compile a raw directive. Directives either produce widget configs, or modify the config of their parent view
	 * @param {_tTemplate} result
	 * @param {_cRawDirective} directive
	 * @param {_cView} view_config
	 */
	_compileDirective: function(result, directive, view_config) {

		var directive_result = Lava.parsers.Directives.processDirective(
				directive,
				view_config,
				// code style: to ensure, that view/widget directives are at the top
				(result.length == 0 || (result.length == 1 && typeof(result[0]) == 'string' && Lava.EMPTY_REGEX.test(result[0])))
			);

		if (directive_result) {

			if (typeof(directive_result) == 'string') {

				this._compileString(result, directive_result);

			} else {

				result.push(directive_result);

			}

		}

	},

	/**
	 * Compile raw include (push as is)
	 * @param {_tTemplate} result
	 * @param {_cInclude} include_config
	 */
	_compileInclude: function(result, include_config) {

		result.push(include_config);

	},

	/**
	 * Compile raw string (push or append to the last string in result)
	 * @param {_tTemplate} result
	 * @param {string} string
	 */
	_compileString: function(result, string) {

		var lastIndex = result.length - 1,
			// lastIndex may be -1, but this will eval correctly
			append_string = typeof (result[lastIndex]) == 'string';

		if (append_string) {

			result[lastIndex] += string;

		} else {

			result.push(string);

		}

	},

	/**
	 * Compile raw block (represents a view)
	 * @param {_tTemplate} result
	 * @param {_cRawBlock} raw_block
	 */
	_compileBlock: function(result, raw_block) {

		/** @type {_cView} */
		var config = {
				type: 'view',
				"class": null
			},
			i = 0,
			count;

		if (Lava.schema.parsers.PRESERVE_VIEW_NAME) {
			config.view_name = raw_block.name;
		}

		if ('arguments' in raw_block) {

			if (Lava.schema.DEBUG && raw_block.arguments.length > 1) Lava.t('Block may have no more than one argument');
			if (raw_block.arguments.length) {
				config.argument = raw_block.arguments[0];
			}

		}

		if ('class_locator' in raw_block) {
			config.class_locator = raw_block.class_locator;
			config.real_class = raw_block.real_class;
			config['class'] = Lava.schema.view.DEFAULT_CLASS_LOCATOR_GATEWAY;
		} else {
			config['class'] = this._viewNameToClass(raw_block.name);
		}

		if (raw_block.prefix == '$') {
			config.container = {type: 'Morph'};
		}

		this._parseViewHash(config, raw_block.hash); // before content, so directives could be parsed into the config

		if ('content' in raw_block) {
			config.template = this.compileTemplate(raw_block.content, config);
		} else {
			config.template = [];
		}

		if ('else_content' in raw_block) {
			config.else_template = this.compileTemplate(raw_block.else_content);
		}

		if ('elseif_arguments' in raw_block) {
			config.elseif_arguments = raw_block.elseif_arguments;
			config.elseif_templates = [];
			for (count = raw_block.elseif_content.length; i < count; i++) {
				config.elseif_templates.push(this.compileTemplate(raw_block.elseif_content[i]));
			}
		}

		result.push(config);

	},

	/**
	 * Compile raw expression view. Will produce a view config with class="Expression"
	 * @param {_tTemplate} result
	 * @param {_cRawExpression} raw_expression
	 */
	_compileExpression: function(result, raw_expression) {

		if (raw_expression.arguments.length != 1) Lava.t("Expression block requires exactly one argument");

		var config = {
			type: 'view',
			"class": 'Expression',
			argument: raw_expression.arguments[0]
		};

		if (raw_expression.prefix == '$') {

			config.container = {type: 'Morph'};

		}

		result.push(config);

	},

	/**
	 * Serialize the tag back into text
	 * @param {_tTemplate} result
	 * @param {_cRawTag} tag
	 */
	_compileTag: function(result, tag) {

		var is_void = Lava.isVoidTag(tag.name),
			tag_start_text = "<" + tag.name
				+ this.renderTagAttributes(tag.attributes)
				+ (is_void ? '/>' : '>'),
			inner_template,
			count;

		this. _compileString(result, tag_start_text);

		if (Lava.schema.DEBUG && is_void && tag.content) Lava.t("Void tag with content");

		if (!is_void) {

			if (tag.content) {

				inner_template = this.compileTemplate(tag.content);
				count = inner_template.length;

				if (count && typeof (inner_template[0]) == 'string') {

					this._compileString(result, inner_template.shift());
					count--;

				}

				if (count) {

					result.splice.apply(result, [result.length, 0].concat(inner_template));

				}

			}

			this. _compileString(result, "</" + tag.name + ">");

		}

	},

	/**
	 * Compile raw tag with x:type="view". Will produce a {@link Lava.view.View} with an Element container
	 * @param {_tTemplate} result
	 * @param {_cRawTag} raw_tag
	 */
	_compileView: function(result, raw_tag) {

		var view_config = {
				type: 'view',
				"class": 'View',
				container: this._toContainer(raw_tag)
			},
			x = raw_tag.x;

		this._parseViewAttributes(view_config, raw_tag);

		if ('content' in raw_tag) view_config.template = this.compileTemplate(raw_tag.content, view_config);
		if ('resource_id' in x) {
			if (Lava.schema.DEBUG && (('static_styles' in view_config.container) || ('static_properties' in view_config.container) || ('static_styles' in view_config.container)))
				Lava.t("View container with resource_id: all properties must be moved to resources");
			view_config.container.resource_id = Lava.parsers.Common.parseResourceId(x.resource_id);
		}

		result.push(view_config);

	},

	/**
	 * Compile raw tag with x:type="container". Extract the wrapped view and set this tag as it's container
	 * @param {_tTemplate} result
	 * @param {_cRawTag} raw_tag
	 */
	_compileContainer: function(result, raw_tag) {

		var x = raw_tag.x,
			inner_template,
			view_config,
			container_config,
			container_config_directive = null,
			name;

		if (Lava.schema.DEBUG) {

			if (Lava.isVoidTag(raw_tag.name)) Lava.t("Void tag with type='container'");
			if (!raw_tag.content) Lava.t("Empty container tag");
			this._assertControlAttributesValid(x);

			if (('options' in x) || ('roles' in x) || ('label' in x)) {

				Lava.t("Please move x:options, x:roles and x:label from container element to the wrapped view");

			}

		}

		inner_template = this.asBlocks(raw_tag.content);

		// inside there may be either a single view, or x:container_config, followed by the view
		if (inner_template.length == 1) {

			view_config = this.compileAsView(inner_template);

		} else if (inner_template.length == 2) {

			container_config_directive = inner_template[0];
			view_config = this.compileAsView([inner_template[1]]);

		} else {

			Lava.t("Malformed content of tag with type='container'");

		}

		if (Lava.schema.DEBUG && view_config.container) Lava.t("Wrapped view already has a container");
		container_config = this._toContainer(raw_tag);
		view_config.container = container_config;

		if (container_config_directive) {
			if (Lava.schema.DEBUG && (container_config_directive.type != 'directive' || container_config_directive.name != 'container_config'))
				Lava.t("Malformed content of tag with type='container'");
			Lava.parsers.Directives.processDirective(container_config_directive, view_config, true);
		}

		if (Lava.schema.DEBUG) {

			if ('id' in view_config) Lava.t("Please, move the id attribute from inner view's hash to wrapping container: " + view_config.id);

			if (('static_properties' in container_config) && ('property_bindings' in container_config)) {

				for (name in container_config.property_bindings) {

					if (name in container_config.static_properties)
						Lava.t("Same property can not be bound and have static value at the same time - it may result in unexpected behaviour");

				}

			}

			if (('static_styles' in container_config) && ('style_bindings' in container_config)) {

				for (name in container_config.static_styles) {

					if (name in container_config.style_bindings)
						Lava.t("Same style can not be bound and have static value at the same time - it may result in unexpected behaviour");

				}

			}

		}

		if (('attributes' in raw_tag) && ('id' in raw_tag.attributes)) view_config.id = raw_tag.attributes.id;
		if ('resource_id' in x) {
			if (Lava.schema.DEBUG && (('static_styles' in container_config) || ('static_properties' in container_config) || ('static_styles' in container_config)))
				Lava.t("Element container with resource_id: all properties must be moved to resources");
			container_config.resource_id = this.parseResourceId(x.resource_id);
		}

		result.push(view_config);

	},

	/**
	 * Compile tag with x:type="static"
	 * @param {_tTemplate} result
	 * @param {_cRawTag} raw_tag
	 */
	_compileStaticContainer: function(result, raw_tag) {

		var name,
			block;

		if (Lava.schema.DEBUG) {

			if (!raw_tag.x.resource_id) Lava.t("Static container requires resource id");
			for (name in raw_tag.x) {
				if (['type', 'resource_id'].indexOf(name) == -1) Lava.t("Unknown control attribute on static container: " + name);
			}

		}

		block = {
			type: 'static_tag',
			resource_id: this.parseResourceId(raw_tag.x.resource_id),
			name: raw_tag.name
		};

		if ('attributes' in raw_tag) Lava.t("Static container with resource_id: all attributes must be moved to resources");

		if (raw_tag.content) {
			block.template = this.compileTemplate(raw_tag.content);
		}

		result.push(block);

	},

	/**
	 * Compile a tag which belongs to widget's sugar. Parse it into tag config using {@link Lava.system.Sugar} class instance
	 * @param {_tTemplate} result
	 * @param {_cRawTag} raw_tag
	 */
	_compileSugar: function(result, raw_tag) {

		var schema = Lava.sugar_map[raw_tag.name],
			widget_config,
			sugar,
			result_config;

		if ('parse' in schema) {

			result_config = schema.parse(raw_tag);

		} else {

			widget_config = Lava.getWidgetConfig(schema.widget_title);
			sugar = Lava.getWidgetSugarInstance(schema.widget_title);
			result_config = sugar.parse(widget_config.sugar, raw_tag, schema.widget_title);

		}

		result.push(result_config);

	},

	/**
	 * Compile tag with x:widget="WidgetName". Represents a widget with explicitly defined Element container
	 *
	 * @param {_tTemplate} result
	 * @param {_cRawTag} raw_tag
	 */
	_compileWidget: function(result, raw_tag) {

		var config = this.createDefaultWidgetConfig();

		config['extends'] = raw_tag.x.widget;
		config.container = this._toContainer(raw_tag);

		this._parseViewAttributes(config, raw_tag);
		// Otherwise, there will be ambiguity between the target of the attribute (widget or it's container)
		// to set resource_id with x:widget - rewrite the declaration to x:type='container' with <x:widget> inside
		if (Lava.schema.DEBUG && raw_tag.x && ('resource_id' in raw_tag.x)) Lava.t("x:widget attribute is not compatible with resource_id attribute");
		if (raw_tag.content) config.template = this.compileTemplate(raw_tag.content, config);

		result.push(config);

	},

	// End: block handlers
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Assign some attributes of an element to `view_config`
	 * @param {_cView} view_config
	 * @param {_cRawTag} raw_tag
	 */
	_parseViewAttributes: function(view_config, raw_tag) {

		var x = raw_tag.x;

		if (x) {

			if (Lava.schema.DEBUG) this._assertControlAttributesValid(x);
			if ('options' in x) {

				if (typeof(x.options) != 'object') Lava.t("Malformed x:options");
				view_config.options = x.options;

			}
			if ('label' in x) this.setViewConfigLabel(view_config, x.label);
			if ('roles' in x) view_config.roles = this.parseTargets(x.roles);

		}

		if (('attributes' in raw_tag) && ('id' in raw_tag.attributes)) this.setViewConfigId(view_config, raw_tag.attributes.id);

	},

	/**
	 * Check validity of control attributes and throw exception, in case they are invalid
	 * @param {_cRawX} x
	 */
	_assertControlAttributesValid: function(x) {

		for (var name in x) {
			if (this._allowed_control_attributes.indexOf(name) == -1) Lava.t("Unknown option in x: " + name);
		}

	},

	/**
	 * Convert raw tag to an Element container config
	 * @param {_cRawTag} raw_tag
	 * @returns {_cElementContainer}
	 */
	_toContainer: function(raw_tag) {

		var container_config = {
				type: 'Element',
				tag_name: raw_tag.name
			};

		if ('attributes' in raw_tag) this._parseContainerStaticAttributes(container_config, raw_tag.attributes);
		if ('x' in raw_tag) this._parseContainerControlAttributes(container_config, raw_tag.x);

		return /** @type {_cElementContainer} */ container_config;

	},

	/**
	 * Take raw control attributes, parse them, and store in `container_config`
	 * @param {_cElementContainer} container_config
	 * @param {_cRawX} x
	 */
	_parseContainerControlAttributes: function(container_config, x) {

		var i,
			count,
			name;

		if ('event' in x) {

			if (typeof(x.event) != 'object') Lava.t("Malformed x:event attribute");

			container_config.events = {};

			for (name in x.event) {

				container_config.events[name] = Lava.parsers.Common.parseTargets(x.event[name]);

			}

		}

		// Attribute binding. Example: x:bind:src="<any_valid_expression>"
		if ('bind' in x) {

			if (typeof(x.bind) != 'object') Lava.t("Malformed x:bind attribute");
			container_config.property_bindings = this._parseBindingsHash(x.bind);

		}

		if ('style' in x) {

			if (typeof(x.style) != 'object') Lava.t("Malformed x:style attribute");
			container_config.style_bindings = this._parseBindingsHash(x.style);

		}

		if ('classes' in x) {

			var args = Lava.ExpressionParser.parse(x.classes, Lava.ExpressionParser.SEPARATORS.SEMICOLON),
				class_bindings = {};

			for (i = 0, count = args.length; i < count; i++) {

				class_bindings[i] = args[i];

			}

			container_config.class_bindings = class_bindings;

		}

		if ('container_class' in x) {

			container_config['class'] = x.container_class;

		}

	},

	/**
	 * Parse object as [name] => &lt;expression&gt; pairs
	 *
	 * @param {Object.<string, string>} hash
	 * @returns {Object.<string, _cArgument>}
	 */
	_parseBindingsHash: function(hash) {

		if (typeof(hash) != 'object') Lava.t("Malformed control tag");

		var name,
			args,
			result = {};

		for (name in hash) {

			args = Lava.ExpressionParser.parse(hash[name]);
			if (args.length == 0) Lava.t("Binding: empty expression (" + name + ")");
			if (args.length > 1) Lava.t("Binding: malformed expression for '" + name + "'");
			result[name] = args[0];

		}

		return result;

	},

	/**
	 * Parse style attribute content (plain string) into object with keys being individual style names,
	 * and values being actual style values
	 *
	 * @param {string} styles_string
	 * @returns {Object.<string, string>}
	 */
	parseStyleAttribute: function(styles_string) {

		styles_string = styles_string.trim();

		var styles = styles_string.split(/[\;]+/),
			result = {},
			parts,
			i = 0,
			count = styles.length,
			resultCount = 0;

		if (styles_string) {

			for (; i < count; i++) {

				styles[i] = styles[i].trim();

				if (styles[i]) {

					parts = styles[i].split(':');

					if (parts.length == 2) {

						parts[0] = parts[0].trim();
						parts[1] = parts[1].trim();
						result[parts[0]] = parts[1];
						resultCount++;

					} else {

						Lava.t("Unable to parse the style attribute");

					}

				}

			}

		}

		return resultCount ? result : null;

	},

	/**
	 * Fills the following properties of the container: static_styles, static_classes and static_properties
	 *
	 * @param {_cElementContainer} container_config
	 * @param {Object.<string, string>} raw_attributes
	 */
	_parseContainerStaticAttributes: function(container_config, raw_attributes) {

		var name,
			list,
			static_properties = {};

		for (name in raw_attributes) {

			if (name == 'style') {

				list = this.parseStyleAttribute(raw_attributes.style);

				if (list) container_config.static_styles = list;

			} else if (name == 'class') {

				container_config.static_classes = raw_attributes['class'].trim().split(/\s+/);

			} else if (name == 'id') {

				// skip, as ID is handled separately

			} else {

				static_properties[name] = raw_attributes[name];

			}

		}

		//noinspection LoopStatementThatDoesntLoopJS
		for (name in static_properties) {
			container_config.static_properties = static_properties;
			break;
		}

	},

	/**
	 * Compile raw template config
	 * @param {_tRawTemplate} blocks
	 * @param {_cView} [view_config]
	 * @returns {_tTemplate}
	 */
	compileTemplate: function(blocks, view_config) {

		var current_block,
			result = [],
			type,
			i = 0,
			count = blocks.length,
			x;

		for (; i < count; i++) {

			current_block = blocks[i];
			type = (typeof(current_block) == 'string') ? 'string' : current_block.type;

			if (type == 'tag') {

				x = current_block.x;

				if (x) {

					if ('type' in x) {

						if ('widget' in x) Lava.t("Malformed tag: both x:type and x:widget present");
						type = x.type;
						if (['view', 'container', 'static'].indexOf(type) == -1) Lava.t("Unknown x:type attribute: " + type);

					} else if ('widget' in x) {

						type = 'widget';

					} else if (Lava.sugar_map[current_block.name]) {

						type = 'sugar';

					} else {

						Lava.t("Tag with control attributes and no sugar or type on it: " + current_block.name);

					}

				} else if (Lava.sugar_map[current_block.name]) {

					type = 'sugar';

				} // else type = 'tag' - default

			}

			this[this._compile_handlers[type]](result, current_block, view_config);

		}

		return result;

	},

	/**
	 * Compile template as usual and assert that it contains single view inside. Return that view
	 *
	 * @param {_tRawTemplate} raw_blocks
	 * @returns {_cView}
	 */
	compileAsView: function(raw_blocks) {

		var result = this.asBlocks(this.compileTemplate(raw_blocks));
		if (result.length != 1) Lava.t("Expected: exactly one view, got either several or none.");
		if (result[0].type != 'view' && result[0].type != 'widget') Lava.t("Expected: view, got: " + result[0].type);
		return result[0];

	},

	/**
	 * Remove strings from template and assert they are empty
	 * @param {(_tRawTemplate|_tTemplate)} template
	 * @returns {Array}
	 */
	asBlocks: function(template) {

		var i = 0,
			count = template.length,
			result = [];

		for (; i < count; i++) {

			if (typeof(template[i]) == 'string') {

				if (!Lava.EMPTY_REGEX.test(template[i])) Lava.t("Text between tags is not allowed in this context. You may want to use a lava-style comment ({* ... *})");

			} else {

				result.push(template[i]);

			}

		}

		return result;

	},

	/**
	 * Extract blocks/tags from template and assert they all have specific type
	 * @param {Array} blocks
	 * @param {string} type
	 * @returns {Array}
	 */
	asBlockType: function(blocks, type) {

		var result = this.asBlocks(blocks),
			i = 0,
			count = result.length;

		for (; i < count; i++) {

			if (result[i].type != type) Lava.t("Block type is not permitted in this context. Expected: " + type + ", got: " + result[i].type);

		}

		return result;

	},

	/**
	 * Convert an object with element's attributes ([name] => &lt;value&gt; pairs) back into plain string
	 *
	 * @param {Object.<string, string>} attributes_object
	 * @returns {string}
	 */
	renderTagAttributes: function(attributes_object) {

		var name,
			result = '';

		for (name in attributes_object) {

			result += ' ' + name + '="' + Firestorm.String.escape(attributes_object[name], Firestorm.String.ATTRIBUTE_ESCAPE_REGEX) + '"';

		}

		return result;

	},

	/**
	 * Parse a string with semicolon-delimited list of widget targets (optionally, with arguments)
	 * @param {string} targets_string
	 * @returns {Array.<_cTarget>}
	 */
	parseTargets: function(targets_string) {

		var target = {},
			result = [],
			match,
			guid_match,
			config_ref,
			raw_arguments,
			i,
			count,
			flags;

		targets_string = targets_string.trim();

		if (targets_string == '') Lava.t("Code style: empty targets are not allowed");

		while (targets_string.length) {

			match = this._locator_regex.exec(targets_string);
			if (!match) guid_match = /^\d+$/.exec(targets_string);

			if (match) {

				target.locator_type = this.locator_types[targets_string[0]];
				target.locator = match[1];
				target.name = match[2];

			} else if (guid_match) {

				target.locator_type = 'Guid';
				target.locator = +guid_match[0];

			} else {

				match = this._identifier_regex.exec(targets_string);
				if (!match) Lava.t("Malformed targets (1): " + targets_string);
				target.name = match[0];

			}

			if (Lava.schema.DEBUG) {

				if ((target.locator_type == 'Id' || target.locator_type == 'Name') && !Lava.isValidId(target.locator)) Lava.t("Malformed id: " + target.locator);
				else if (target.locator_type == 'Label' && !Lava.VALID_LABEL_REGEX.test(target.locator)) Lava.t("Malformed target label" + target.locator);

			}

			targets_string = targets_string.substr(match[0].length);

			if (targets_string[0] == '(') {

				if (targets_string[1] == ')') Lava.t("Code style: empty target arguments must be removed");

				config_ref = {
					input: targets_string.substr(1),
					tail_length: 0
				};
				raw_arguments = Lava.ExpressionParser.parseWithTailRaw(config_ref, Lava.ExpressionParser.SEPARATORS.COMMA);
				target.arguments = [];

				for (i = 0, count = raw_arguments.length; i < count; i++) {

					flags = raw_arguments[i].flags;
					if (flags.isScopeEval) {

						target.arguments.push({
							type: Lava.TARGET_ARGUMENT_TYPES.BIND,
							data: raw_arguments[i].binds[0]
						});

					} else if (flags.isLiteral || flags.isNumber || flags.isString) {

						target.arguments.push({
							type: Lava.TARGET_ARGUMENT_TYPES.VALUE,
							data: Function('return ' + raw_arguments[i].evaluator_src).apply({})
						});

					} else {

						Lava.t("Expressions are not allowed for target callback arguments, only scope paths and static values");

					}

				}

				targets_string = targets_string.substr(targets_string.length - config_ref.tail_length);

			}

			if (targets_string[0] == ';') {

				targets_string = targets_string.substr(1).trim();

			} else if (targets_string.length) {

				targets_string = targets_string.trim();
				if (Lava.schema.DEBUG && targets_string.length) {
					if (targets_string[0] == ';') Lava.t("Space between semicolon in targets is not allowed");
					Lava.t('Malformed targets (2): ' + targets_string);
				}

			}

			result.push(target);

		}

		return result;

	},

	/**
	 * Parse value of x:resource_id attribute
	 * @param {string} id_string
	 * @returns {_cResourceId}
	 */
	parseResourceId: function(id_string) {

		id_string = id_string.trim();
		var match = this._locator_regex.exec(id_string),
			result;

		if (!match || match[2].indexOf('$') != -1) Lava.t("Malformed resource id: " + id_string);

		/** @type {_cResourceId} */
		result = {
			locator_type: this.locator_types[id_string[0]],
			locator: match[1],
			name: match[2]
		};

		return result;

	},

	/**
	 * Create an empty widget config with default class and extender from schema
	 * @returns {_cWidget}
	 */
	createDefaultWidgetConfig: function() {

		return {
			type: 'widget',
			"class": Lava.schema.widget.DEFAULT_EXTENSION_GATEWAY,
			extender_type: Lava.schema.widget.DEFAULT_EXTENDER
		}

	},

	/**
	 * Turn a serialized and quoted string back into it's JavaScript representation.
	 *
	 * Assume that everything that follows a backslash is a valid escape sequence
	 * (all backslashes are prefixed with another backslash).
	 *
	 * Quotes inside string: lexer's regex will match all escaped quotes
	 *
	 * @param {string} raw_string
	 * @returns {string}
	 */
	unquoteString: function(raw_string) {

		var map = Firestorm.String.quote_escape_map,
			result;

		try {
			result = eval("(" + raw_string.replace(this.UNQUOTE_ESCAPE_REGEX, function (a) {
				var c = map[a];
				return typeof c == 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
			}) + ")");
		} catch (e) {
			Lava.t("Malformed string: " + raw_string);
		}

		return result;

	},

	toWidget: function(raw_tag) {

		var config = this.createDefaultWidgetConfig();
		config.container = this._toContainer(raw_tag);
		this._parseViewAttributes(config, raw_tag);

		if (raw_tag.content) config.template = this.compileTemplate(raw_tag.content, config);

		return config

	}

};
/**
 * All TemplateParser directives
 */
Lava.parsers.Directives = {

	/**
	 * Settings for each directive
	 * @type {Object.<string, Object>}
	 */
	_directives_schema: {

		// view_config_presence:
		//  true, in case the directive is valid only inside view or widget. This automatically means that it should be at top.
		//  false, if it must be outside of view config

		define: {view_config_presence: false},
		define_resources: {view_config_presence: false},
		widget: {},
		static_value: {},
		static_eval: {},
		attach_directives: {},
		assign: {view_config_presence: true, is_top_directive: true},
		roles: {view_config_presence: true, is_top_directive: true},
		container_config: {view_config_presence: true, is_top_directive: true},
		refresher: {view_config_presence: true, is_top_directive: true},
		option: {view_config_presence: true, is_top_directive: true},
		options: {view_config_presence: true, is_top_directive: true},
		// Widget-only directives
		bind: {view_config_presence: true, is_top_directive: true},
		property: {view_config_presence: true, is_top_directive: true},
		properties: {view_config_presence: true, is_top_directive: true},
		property_string: {view_config_presence: true, is_top_directive: true},
		resources: {view_config_presence: true, is_top_directive: true},
		default_events: {view_config_presence: true, is_top_directive: true}
	},

	/**
	 * Handlers for tags in widget definition
	 * @type {Object.<string, string>}
	 */
	_widget_tag_actions: {
		// with directive analog
		bind: '_widgetTagBind',
		assign: '_widgetTagAssign',
		option: '_widgetTagOption',
		property: '_widgetTagProperty',
		options: '_widgetTagOptions',
		properties: '_widgetTagProperties',
		roles: '_widgetTagRoles',
		resources: '_widgetTagResources',
		default_events: '_widgetTagDefaultEvents',
		// without directive analog
		sugar: '_widgetTagSugar',
		storage: '_widgetTagStorage',
		storage_schema: '_widgetTagStorageSchema',
		include: '_widgetTagInclude'
	},

	/**
	 * Handlers for tags inside x:resources
	 * @type {Object.<string, string>}
	 */
	_resource_tag_actions: {
		options: '_resourceTagOptions',
		container: '_resourceTagContainer',
		string: '_resourceTagString',
		plural_string: '_resourceTagPluralString'
	},

	/**
	 * Allowed properties on config of &lt;view&gt; in widget definition
	 * @type {Array.<string>}
	 */
	WIDGET_DEFINITION_ALLOWED_MAIN_VIEW_MEMBERS: ['template', 'container', 'class', 'type'],

	/**
	 * The title of the widget in x:define directive, which is currently being processed
	 * @type {string}
	 */
	_current_widget_title: null,
	/**
	 * Stack of widget configs, which are currently being processed by x:widget/x:define directives
	 * @type {Array.<_cWidget>}
	 */
	_widget_directives_stack: [],

	/**
	 * Handle directive tag
	 * @param {_cRawDirective} raw_directive Raw directive tag
	 * @param {(_cView|_cWidget)} view_config Config of the directive's parent view
	 * @param {boolean} is_top_directive Code style validation switch. Some directives must be at the top of templates
	 * @returns {*} Compiled template item or nothing
	 */
	processDirective: function(raw_directive, view_config, is_top_directive) {

		var directive_name = raw_directive.name,
			config = this._directives_schema[directive_name];

		if (!config) Lava.t("Unknown directive: " + directive_name);

		if (config.view_config_presence) {
			if (view_config && !config.view_config_presence) Lava.t('Directive must not be inside view definition: ' + directive_name);
			if (!view_config && config.view_config_presence) Lava.t('Directive must be inside view definition: ' + directive_name);
		}

		if (config.is_top_directive && !is_top_directive) Lava.t("Directive must be at the top of the block content: " + directive_name);

		return this['_x' + directive_name](raw_directive, view_config);

	},

	/**
	 * Helper method to copy properties from `source` to `destination`, if they exist
	 * @param {Object} destination
	 * @param {Object} source
	 * @param {Array.<string>} name_list List of properties to copy from `source` to `destination`
	 */
	_importVars: function(destination, source, name_list) {
		for (var i = 0, count = name_list.length; i < count; i++) {
			var name = name_list[i];
			if (name in source) destination[name] = source[name];
		}
	},

	////////////////////////////////////////////////////////////////////
	// start: actions for widget tags

	/**
	 * Parse {@link _cWidget#bindings}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagBind: function(raw_tag, widget_config) {

		this._parseBinding(widget_config, raw_tag);

	},

	/**
	 * Parse {@link _cView#assigns}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagAssign: function(raw_tag, widget_config) {

		this._parseAssign(widget_config, raw_tag);

	},

	/**
	 * Parse one option for {@link _cView#options}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagOption: function(raw_tag, widget_config) {

		this._parseOption(widget_config, raw_tag, 'options');

	},

	/**
	 * Parse one property for {@link _cWidget#properties}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagProperty: function(raw_tag, widget_config) {

		this._parseProperty(widget_config, raw_tag, 'properties');

	},

	/**
	 * Parse {@link _cView#options}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagOptions: function(raw_tag, widget_config) {

		this._parseObject(widget_config, 'options', raw_tag);

	},

	/**
	 * Parse {@link _cWidget#storage_schema}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagStorageSchema: function(raw_tag, widget_config) {

		this._parseObject(widget_config, 'storage_schema', raw_tag);

	},

	/**
	 * Parse {@link _cWidget#properties}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagProperties: function(raw_tag, widget_config) {

		this._parseObject(widget_config, 'properties', raw_tag);

	},

	/**
	 * Parse {@link _cView#roles}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagRoles: function(raw_tag, widget_config) {

		this._parseRoles(widget_config, raw_tag);

	},

	/**
	 * Parse {@link _cWidget#sugar}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagSugar: function(raw_tag, widget_config) {

		if ('sugar' in widget_config) Lava.t("Sugar is already defined");
		if (Lava.schema.DEBUG && raw_tag.content.length != 1) Lava.t("Malformed option: " + raw_tag.attributes.name);
		widget_config.sugar = Lava.parseOptions(raw_tag.content[0]);

	},

	/**
	 * Parse {@link _cWidget#storage}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagStorage: function(raw_tag, widget_config) {

		Lava.parsers.Storage.parse(widget_config, raw_tag.content);

	},

	/**
	 * Parse {@link _cWidget#default_events}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagDefaultEvents: function(raw_tag, widget_config) {

		this._parseDefaultEvents(raw_tag, widget_config);

	},

	/**
	 * Parse {@link _cWidget#resources}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagResources: function(raw_tag, widget_config) {

		this._xresources(raw_tag, widget_config);

	},

	/**
	 * Parse one include for {_cWidget#includes}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_widgetTagInclude: function(raw_tag, widget_config) {

		var include = raw_tag.content ? Lava.parsers.Common.compileTemplate(raw_tag.content) : [];
		Lava.store(widget_config, 'includes', raw_tag.attributes.name, include);

	},

	// end: actions for widget tags
	////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////
	// Start: resource tags

	/**
	 * Parse x:resources definition
	 * @param {_cRawTag} raw_tag
	 * @param {string} widget_title
	 * @returns {Object}
	 */
	_parseResources: function(raw_tag, widget_title) {

		var tags = Lava.parsers.Common.asBlockType(raw_tag.content, 'tag'),
			i = 0,
			count = tags.length,
			resources = {},
			tag,
			value;

		if (Lava.schema.DEBUG && count == 0) Lava.t("Empty resources definition");

		for (; i < count; i++) {

			tag = tags[i];
			if (Lava.schema.DEBUG && (!tag.attributes || !tag.attributes.path)) Lava.t("resources, tag is missing attributes: " + tag.name);
			if (Lava.schema.DEBUG && !(tag.name in this._resource_tag_actions)) Lava.t("resources, unknown tag: " + tag.name);
			value = this[this._resource_tag_actions[tag.name]](tag);
			if (Lava.schema.parsers.EXPORT_STRINGS && (value.type == 'string' || value.type == 'plural_string')) {
				Lava.resources.exportTranslatableString(value, widget_title, raw_tag.attributes.locale, tag.attributes.path);
			}
			Lava.resources.putResourceValue(resources, tag.attributes.path, value);

		}

		return resources;

	},

	/**
	 * Parse resource value as any JavaScript type, including arrays, objects and literals
	 * @param {_cRawTag} raw_tag
	 */
	_resourceTagOptions: function(raw_tag) {

		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1 || raw_tag.content[0] == '')) Lava.t("Malformed resources options tag");

		return {
			type: 'options',
			value: Lava.parseOptions(raw_tag.content[0])
		};

	},

	/**
	 * Parse a translatable string
	 * @param {_cRawTag} raw_tag
	 */
	_resourceTagString: function(raw_tag) {

		if (Lava.schema.DEBUG && raw_tag.content && raw_tag.content.length != 1) Lava.t("Malformed resources string tag");

		var result = {
			type: 'string',
			value: raw_tag.content ? raw_tag.content[0].trim() : ''
		};

		if (raw_tag.attributes.description) result.description = raw_tag.attributes.description;

		return result;

	},

	/**
	 * Parse translatable plural string
	 * @param {_cRawTag} raw_tag
	 */
	_resourceTagPluralString: function(raw_tag) {

		if (Lava.schema.DEBUG && (!raw_tag.content)) Lava.t("Malformed resources plural string tag");

		var plural_tags = Lava.parsers.Common.asBlockType(raw_tag.content, 'tag'),
			i = 0,
			count = plural_tags.length,
			plurals = [],
			result;

		if (Lava.schema.DEBUG && count == 0) Lava.t("Malformed resources plural string definition");

		for (; i < count; i++) {

			if (Lava.schema.DEBUG && (plural_tags[i].name != 'string' || !plural_tags[i].content || !plural_tags[i].content[0])) Lava.t("Resources, malformed plural string");
			plurals.push(plural_tags[i].content[0].trim());

		}

		result = {
			type: 'plural_string',
			value: plurals
		};

		if (raw_tag.attributes.description) result.description = raw_tag.attributes.description;

		return result;

	},

	/**
	 * Parse inheritable actions for classes, styles and container properties
	 * @param {_cRawTag} raw_tag
	 */
	_resourceTagContainer: function(raw_tag) {

		var tags = raw_tag.content ? Lava.parsers.Common.asBlockType(raw_tag.content, 'tag') : [],
			count = tags.length,
			result = {
				type: 'container_stack',
				value: []
			},
			operations_stack = result.value,
			operation_value,
			used_instructions = {},
			name;

		if (count) {

			if (Lava.schema.DEBUG) {
				if (count > 1) Lava.t("Malformed resources/container definition");
				if (tags[0].name != 'static_properties' && tags[0].name != 'add_properties') Lava.t("Malformed resources/container definition");
				if (!tags[0].attributes || tags[0].content) Lava.t("resources/container: malformed (static/add)_properties tag");
				if (('class' in tags[0].attributes) || ('style' in tags[0].attributes)) Lava.t("resources/container: class and style attributes must be defined separately from properties");
			}

			operations_stack.push({
				name: tags[0].name,
				value: tags[0].attributes
			});
			used_instructions[tags[0].name] = true;

		}

		for (name in raw_tag.attributes) {

			switch (name) {
				case 'remove_classes':
				case 'remove_properties':
				case 'remove_styles':
					if (Lava.schema.DEBUG && !raw_tag.attributes[name].trim()) Lava.t("Codestyle: remove the empty remove_* attributes from resources/container tag");
					operation_value = raw_tag.attributes[name].trim().split(/\s*,\s*/);
					break;
				case 'add_classes':
				case 'static_classes':
					if (Lava.schema.DEBUG && name == 'add_classes' && !raw_tag.attributes[name].trim()) Lava.t("Codestyle: remove the empty add_classes attribute from resources/container tag");
					operation_value = raw_tag.attributes[name].trim().split(/\s+/);
					break;
				case 'add_styles':
				case 'static_styles':
					if (Lava.schema.DEBUG && name == 'add_styles' && !raw_tag.attributes[name].trim()) Lava.t("Codestyle: remove the empty style attribute from resources/container tag");
					operation_value = Lava.parsers.Common.parseStyleAttribute(raw_tag.attributes[name]);
					break;
				case 'path': // the path and name of the resource
					operation_value = null;
					break;
				default:
					Lava.t("Unknown resources/container attribute:" + name);
			}

			if (operation_value) {
				operations_stack.push({
					name: name,
					value: operation_value
				});
				used_instructions[name] = true;
			}

		}

		if (Lava.schema.DEBUG) {

			if (
				('static_styles' in used_instructions && (('add_styles' in used_instructions) || ('remove_styles' in used_instructions)))
				|| ('static_classes' in used_instructions && (('add_classes' in used_instructions) || ('remove_classes' in used_instructions)))
				|| ('static_properties' in used_instructions && (('add_properties' in used_instructions) || ('remove_properties' in used_instructions)))
			)
				Lava.t("resources/container: having add/remove instructions together with 'set' instruction has no sense");

			if (operations_stack.length == 0) Lava.t("Empty resources/container definition");

		}

		return result;

	},

	// End: resource tags
	////////////////////////////////////////////////////////////////////

	/**
	 * Parse view widget tag: compile, extract and validate a single view inside it
	 * @param {_cRawTag} raw_tag
	 */
	_asMainView: function(raw_tag) {

		var view_config = Lava.parsers.Common.compileAsView(raw_tag.content),
			widget_config = Lava.parsers.Common.createDefaultWidgetConfig(),
			name;

		if (Lava.schema.DEBUG) {
			if (view_config['class'] != 'View') Lava.t("define: view in <view> must be pure View, not subclass");
			if ('argument' in view_config) Lava.t("Widgets do not support arguments");
			for (name in view_config) {
				if (this.WIDGET_DEFINITION_ALLOWED_MAIN_VIEW_MEMBERS.indexOf(name) == -1) {
					Lava.t("<view>: view has an option, which can not be copied to widget: " + name + ". Probably, it must be specified via separate tag");
				}
			}
		}

		this._importVars(widget_config, view_config, ['template', 'container']);

		return widget_config;

	},

	/**
	 * Parse x:view and x:widget directives
	 * @param {_cRawDirective} raw_directive
	 * @returns {_cWidget}
	 */
	_parseWidgetDefinition: function(raw_directive) {

		if (Lava.schema.DEBUG && !('attributes' in raw_directive)) Lava.t("Widget definition is missing attributes");

		var tags = raw_directive.content ? Lava.parsers.Common.asBlockType(raw_directive.content, 'tag') : [],
			widget_config = {},
			i = 0,
			count = tags.length,
			tag,
			name,
			path,
			is_storage_parsed = false;

		this._widget_directives_stack.push(raw_directive);

		if (count) {

			if (tags[0].name == 'view') {

				widget_config = this._asMainView(tags[0]);
				i = 1;

			} else if (tags[0].name == 'template') {

				widget_config.template = Lava.parsers.Common.compileTemplate(tags[0].content);
				i = 1;

			}

		}

		// extends must be set before <storage> (required by Lava.parsers.Storage.getMergedStorageSchema())
		if (raw_directive.attributes['extends']) widget_config['extends'] = raw_directive.attributes['extends'];

		for (; i < count; i++) {

			tag = tags[i];
			if (tag.name == 'storage_schema' && is_storage_parsed) Lava.t('Widget definition: `storage_schema` must preceed the `storage` tag');
			if (!(tag.name in this._widget_tag_actions)) Lava.t("Unknown tag in widget definition: " + tag.name + ". Note, that <template> and <view> tags must be on top.");
			this[this._widget_tag_actions[tag.name]](tag, widget_config);
			if (tag.name == 'storage') is_storage_parsed = true;

		}

		if (raw_directive.attributes.controller) {

			path = raw_directive.attributes.controller;
			// example: "$widgetname/ClassName1"
			if (path[0] in Lava.parsers.Common.locator_types) {

				i = path.indexOf('/');
				if (Lava.schema.DEBUG && i == -1) Lava.t("Malformed class name locator: " + path);
				name = path.substr(0, i); // cut the locator part, "$widgetname"
				widget_config.real_class = path.substr(i); // leave the name part: "/ClassName1"
				widget_config.class_locator = {locator_type: Lava.parsers.Common.locator_types[name[0]], name: name.substr(1)};
				if (Lava.schema.DEBUG && (!widget_config.class_locator.name || !widget_config.class_locator.locator_type)) Lava.t("Malformed class name locator: " + path);

			} else {

				widget_config.real_class = raw_directive.attributes.controller;

			}

		}

		if (raw_directive.attributes.label) Lava.parsers.Common.setViewConfigLabel(widget_config, raw_directive.attributes.label);
		if (raw_directive.attributes.id) {
			if (Lava.schema.DEBUG && widget_config.id) Lava.t("[Widget configuration] widget id was already set via main view configuration: " + raw_directive.attributes.id);
			Lava.parsers.Common.setViewConfigId(widget_config, raw_directive.attributes.id);
		}

		if (!widget_config['class']) widget_config['class'] = Lava.schema.widget.DEFAULT_EXTENSION_GATEWAY;
		if (!widget_config.extender_type) widget_config.extender_type = Lava.schema.widget.DEFAULT_EXTENDER;

		this._widget_directives_stack.pop();

		return widget_config;

	},

	/**
	 * Define a widget
	 * @param {_cRawDirective} raw_directive
	 */
	_xdefine: function(raw_directive) {

		if (Lava.schema.DEBUG) {
			if (!raw_directive.attributes || !raw_directive.attributes.title) Lava.t("define: missing 'title' attribute");
			if (raw_directive.attributes.title.indexOf(' ') != -1) Lava.t("Widget title must not contain spaces");
			if ('resource_id' in raw_directive.attributes) Lava.t("resource_id is not allowed on define");
			if (this._current_widget_title) Lava.t("Nested defines are not allowed: " + raw_directive.attributes.title);
		}

		this._current_widget_title = raw_directive.attributes.title;
		var widget_config = this._parseWidgetDefinition(raw_directive);
		this._current_widget_title = null;
		widget_config.is_extended = false; // reserve it for serialization

		if (Lava.schema.DEBUG && ('class_locator' in widget_config)) Lava.t("Dynamic class names are allowed only in inline widgets, not in x:define");

		Lava.storeWidgetSchema(raw_directive.attributes.title, widget_config);

	},

	/**
	 * Inline widget definition
	 * @param {_cRawDirective} raw_directive
	 */
	_xwidget: function(raw_directive) {

		var widget_config = this._parseWidgetDefinition(raw_directive);

		if (Lava.schema.DEBUG && ('sugar' in widget_config)) Lava.t("Inline widgets must not have sugar");
		if (Lava.schema.DEBUG && !widget_config['class'] && !widget_config['extends']) Lava.t("x:define: widget definition is missing either 'controller' or 'extends' attribute");
		if (raw_directive.attributes.resource_id) widget_config.resource_id = Lava.parsers.Common.parseResourceId(raw_directive.attributes.resource_id);

		widget_config.type = 'widget';
		return widget_config;

	},

	/**
	 * Parse an assign config for {@link _cView#assigns}
	 * @param {_cRawDirective} raw_directive
	 * @param {_cView} view_config
	 */
	_xassign: function(raw_directive, view_config) {

		this._parseAssign(view_config, raw_directive);

	},

	/**
	 * Perform parsing an assign from {@link _cView#assigns}
	 * @param {(_cView|_cWidget)} config
	 * @param {(_cRawDirective|_cRawTag)} raw_tag
	 */
	_parseAssign: function(config, raw_tag) {

		if (!('assigns' in config)) config.assigns = {};

		if (Lava.schema.DEBUG && !('attributes' in raw_tag)) Lava.t("assign: missing attributes");
		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1)) Lava.t("Malformed assign");
		if (raw_tag.attributes.name in config.assigns) Lava.t("Duplicate assign: " + raw_tag.attributes.name);

		var args = Lava.ExpressionParser.parse(raw_tag.content[0]);
		if (Lava.schema.DEBUG && args.length != 1) Lava.t("Expression block requires exactly one argument");

		if (raw_tag.attributes.once && Lava.types.Boolean.fromString(raw_tag.attributes.once)) {

			args[0].once = true;

		}

		config.assigns[raw_tag.attributes.name] = args[0];

	},

	/**
	 * Parse an option for {@link _cView#options}
	 * @param {_cRawDirective} raw_directive
	 * @param {_cView} view_config
	 */
	_xoption: function(raw_directive, view_config) {

		this._parseOption(view_config, raw_directive, 'options');

	},

	/**
	 * Perform parsing of a tag with serialized JavaScript object inside it
	 * @param {(_cView|_cWidget)} config
	 * @param {(_cRawDirective|_cRawTag)} raw_tag
	 * @param {string} config_property_name Name of the config member, which holds target JavaScript object
	 */
	_parseOption: function(config, raw_tag, config_property_name) {

		if (Lava.schema.DEBUG && !('attributes' in raw_tag)) Lava.t("option: missing attributes");
		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1)) Lava.t("Malformed option: " + raw_tag.attributes.name);

		var option_type = raw_tag.attributes.type,
			result;

		if (option_type) {

			if (option_type == 'targets') {

				result = Lava.parsers.Common.parseTargets(raw_tag.content[0]);

			} else if (option_type == 'expressions') {

				result = Lava.ExpressionParser.parse(raw_tag.content[0], Lava.ExpressionParser.SEPARATORS.SEMICOLON);

			} else {

				Lava.t("Unknown option type: " + option_type);

			}

		} else {

			result = Lava.parseOptions(raw_tag.content[0]);

		}

		Lava.store(config, config_property_name, raw_tag.attributes.name, result);

	},

	/**
	 * Perform parsing a property from {@link _cWidget#properties}
	 * @param {_cWidget} config
	 * @param {(_cRawDirective|_cRawTag)} raw_tag
	 * @param {string} config_property_name Name of the config member, which holds target JavaScript object
	 */
	_parseProperty: function(config, raw_tag, config_property_name) {

		if (Lava.schema.DEBUG && !('attributes' in raw_tag)) Lava.t("option: missing attributes");
		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1)) Lava.t("Malformed option: " + raw_tag.attributes.name);
		Lava.store(config, config_property_name, raw_tag.attributes.name, Lava.parseOptions(raw_tag.content[0]));

	},

	/**
	 * Parse {@link _cView#roles}
	 * @param {_cRawDirective} raw_directive
	 * @param {_cView} view_config
	 */
	_xroles: function(raw_directive, view_config) {

		this._parseRoles(view_config, raw_directive);

	},

	/**
	 * Perform parsing a role from {@link _cView#roles}
	 * @param {(_cView|_cWidget)} config
	 * @param {_cRawTag} raw_tag
	 */
	_parseRoles: function(config, raw_tag) {

		if ('roles' in config) Lava.t("Roles are already defined");
		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1)) Lava.t("Malformed roles tag/directive");
		config.roles = Lava.parsers.Common.parseTargets(raw_tag.content[0]);

	},

	/**
	 * Parse {@link _cView#container}
	 * @param {_cRawDirective} raw_directive
	 * @param {_cView} view_config
	 */
	_xcontainer_config: function(raw_directive, view_config) {

		if (Lava.schema.DEBUG && (!raw_directive.content || raw_directive.content.length == 0)) Lava.t("Malformed container_config directive: content is missing");
		if (Lava.schema.DEBUG && !view_config.container) Lava.t("Trying to change container settings for container-less view. Please, change the view opening tag (# => $) or move the directive into wrapping container.");

		var original_config = view_config.container,
			config = Lava.parseOptions(raw_directive.content[0]),
			name;

		if (Lava.schema.DEBUG) {
			for (name in config) {
				if (['type', 'options'].indexOf(name) == -1) Lava.t('[_xcontainer_config] setting config property is not allowed: ' + name);
			}
		}

		if ('type' in config) original_config['type'] = config['type'];
		if ('options' in config) {
			if (!('options' in original_config)) original_config.options = {};
			Firestorm.extend(original_config.options, config.options);
		}

	},

	/**
	 * Parse {@link _cView#refresher}
	 * @param {_cRawDirective} raw_directive
	 * @param {_cView} view_config
	 */
	_xrefresher: function(raw_directive, view_config) {

		if (Lava.schema.DEBUG && view_config.type == 'widget') Lava.t("Wrong usage of x:refresher directive. May be applied only to views.");
		if (Lava.schema.DEBUG && ('refresher' in view_config)) Lava.t("Refresher is already defined");
		if (Lava.schema.DEBUG && (!raw_directive.content || raw_directive.content.length != 1)) Lava.t("Malformed refresher config: no content");
		view_config.refresher = Lava.parseOptions(raw_directive.content[0]);

	},

	/**
	 * Perform parsing {@link _cWidget#bindings}
	 * @param {_cWidget} widget_config
	 * @param {(_cRawDirective|_cRawTag)} raw_element
	 */
	_parseBinding: function(widget_config, raw_element) {

		if (raw_element.content.length != 1) Lava.t("Malformed binding in widget definition: " + raw_element.attributes.name);

		var binding = {
			property_name: raw_element.attributes.name,
			path_config: Lava.ExpressionParser.parseScopeEval(raw_element.content[0])
		};
		if ('from_widget' in raw_element.attributes) {
			if (Lava.schema.DEBUG && ['', '1', 'true'].indexOf(raw_element.attributes['from_widget']) == -1) Lava.t('binding: invalid from_widget attribute');
			binding.from_widget = true;
		}
		Lava.store(widget_config, 'bindings', raw_element.attributes.name, binding);

	},

	/**
	 * Parse {@link _cWidget#bindings}
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xbind: function(raw_directive, widget_config) {

		if (Lava.schema.DEBUG && widget_config.type != 'widget') Lava.t("Binding directive requires a widget");
		this._parseBinding(widget_config, raw_directive);

	},

	/**
	 * Parse a tag with JavaScript object inside
	 * @param {(_cView|_cWidget)} config
	 * @param {string} name
	 * @param {(_cRawDirective|_cRawTag)} raw_tag
	 */
	_parseObject: function(config, name, raw_tag) {

		if (Lava.schema.DEBUG && (name in config)) Lava.t("Object already exists: " + name + ". Ensure, that x:options and x:properties directives appear before x:option and x:property.");
		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1)) Lava.t("Malformed directive or tag for config property: " + name);
		config[name] = Lava.parseOptions(raw_tag.content[0]);

	},

	/**
	 * Parse {@link _cView#options}
	 * @param {_cRawDirective} raw_directive
	 * @param {(_cView|_cWidget)} config
	 */
	_xoptions: function(raw_directive, config) {

		this._parseObject(config, 'options', raw_directive);

	},

	/**
	 * Parse a property for {@link _cWidget#properties}
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xproperty: function(raw_directive, widget_config) {

		if (Lava.schema.DEBUG && widget_config.type != 'widget') Lava.t("Property directive requires a widget");

		this._parseProperty(widget_config, raw_directive, 'properties');

	},

	/**
	 * Parse {@link _cWidget#properties}
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xproperties: function(raw_directive, widget_config) {

		if (Lava.schema.DEBUG && widget_config.type != 'widget') Lava.t("Property directive requires a widget");

		this._parseObject(widget_config, 'properties', raw_directive);

	},

	/**
	 * Helper method for widget directives
	 * @param {_cWidget} widget_config
	 * @param {_cRawDirective} raw_directive
	 * @param {string} config_property_name
	 */
	_storeDirectiveContent: function(widget_config, raw_directive, config_property_name) {

		if (Lava.schema.DEBUG && !('attributes' in raw_directive)) Lava.t("option: missing attributes");
		if (Lava.schema.DEBUG && (!raw_directive.content || raw_directive.content.length != 1)) Lava.t("Malformed property: " + raw_directive.attributes.name);
		Lava.store(widget_config, config_property_name, raw_directive.attributes.name, raw_directive.content[0]);

	},

	/**
	 * Parse a property for {@link _cWidget#properties} as a string
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xproperty_string: function(raw_directive, widget_config) {

		if (Lava.schema.DEBUG && widget_config.type != 'widget') Lava.t("property_string directive requires a widget");

		this._storeDirectiveContent(widget_config, raw_directive, 'properties');

	},

	/**
	 * Store a string as an option value
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xoption_string: function(raw_directive, widget_config) {

		this._storeDirectiveContent(widget_config, raw_directive, 'options');

	},

	/**
	 * Standalone resources definition for global widget
	 * @param {_cRawDirective} raw_directive
	 */
	_xdefine_resources: function(raw_directive) {

		if (Lava.schema.DEBUG && (!raw_directive.attributes || !raw_directive.attributes['locale'] || !raw_directive.attributes['for']))
			Lava.t("Malformed x:resources definition. 'locale' and 'for' are required");

		Lava.resources.addWidgetResource(
			raw_directive.attributes['for'],
			raw_directive.attributes['locale'],
			this._parseResources(raw_directive, raw_directive.attributes['for'])
		);

	},

	/**
	 * Parse {@link _cWidget#resources}
	 * @param {(_cRawDirective|_cRawTag)} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xresources: function(raw_directive, widget_config) {

		if (Lava.schema.DEBUG && (!raw_directive.attributes || !raw_directive.attributes['locale'])) Lava.t("Malformed resources definition, missing locale");

		if (!widget_config.resources) {
			widget_config.resources = {}
		}

		if (Lava.schema.DEBUG && (raw_directive.attributes['locale'] in widget_config.resources))
			Lava.t("Locale is already defined: " + raw_directive.attributes['locale']);

		widget_config.resources[raw_directive.attributes['locale']] = this._parseResources(raw_directive, this._current_widget_title);

	},

	/**
	 * Parse {@link _cStaticValue}
	 * @param {_cRawDirective} raw_directive
	 */
	_xstatic_value: function(raw_directive) {

		if (Lava.schema.DEBUG && (raw_directive.content || !raw_directive.attributes || !raw_directive.attributes.resource_id))
			Lava.t("Malformed static_value directive. Note: content inside directive is not allowed, even if it's blank space.");

		return {
			type: 'static_value',
			resource_id: Lava.parsers.Common.parseResourceId(raw_directive.attributes.resource_id)
		}

	},

	/**
	 * Parse {@link _cStaticEval}.
	 * Warning! Inner argument should depend only on static data.
	 * Bindings are allowed, but not recommended, cause at the moment when template is rendered - they may be dirty
	 *
	 * @param {_cRawDirective} raw_directive
	 */
	_xstatic_eval: function(raw_directive) {

		if (Lava.schema.DEBUG && (!raw_directive.content || raw_directive.content.length != 1))
			Lava.t('Malformed static_eval directive. No content.');

		var args = Lava.ExpressionParser.parse(raw_directive.content[0]);

		if (Lava.schema.DEBUG && args.length == 0) Lava.t("static_eval: malformed argument");

		return {
			type: 'static_eval',
			argument: args[0]
		}

	},

	/**
	 * Wrapper, used to apply directives to a void tag
	 * @param {_cRawDirective} raw_directive
	 */
	_xattach_directives: function(raw_directive) {

		if (Lava.schema.DEBUG && !raw_directive.content) Lava.t("empty attach_directives");

		var blocks = Lava.parsers.Common.asBlocks(raw_directive.content),
			sugar = blocks[0],
			directives = blocks.slice(1),
			i,
			count;

		if (Lava.schema.DEBUG) {
			if (sugar.type != 'tag' || sugar.content || directives.length == 0) Lava.t("Malformed attach_directives");
			for (i = 0, count = directives.length; i < count; i++) {
				if (directives[i].type != 'directive') Lava.t("Malformed attach_directives");
			}
		}

		sugar.content = directives;
		return Lava.parsers.Common.compileAsView([sugar]);

	},

	/**
	 * Perform parsing of {@link _cWidget#default_events}
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseDefaultEvents: function(raw_tag, widget_config) {

		if (Lava.schema.DEBUG && (!raw_tag.content || !raw_tag.content.length)) Lava.t('default_events: no content.');
		if (Lava.schema.DEBUG && ('default_events' in widget_config)) Lava.t('default_events: property already defined');

		var events = Lava.parseOptions(raw_tag.content[0]),
			i = 0,
			count;

		if (Lava.schema.DEBUG) {
			if (!Array.isArray(events)) Lava.t('default_events: array expected');
			for (count = events.length; i < count; i++) {
				if (typeof(events[i]) != 'string') Lava.t('default_events: expected an array of strings');
			}
		}

		widget_config.default_events = Lava.excludeDefaultEvents(events);

	},

	/**
	 * Parse {@link _cWidget#default_events}
	 * @param {_cRawDirective} raw_directive
	 * @param {_cWidget} widget_config
	 */
	_xdefault_events: function(raw_directive, widget_config) {

		this._parseDefaultEvents(raw_directive, widget_config);

	}

};
/**
 * Methods for parsing {@link _cWidget#storage}
 */
Lava.parsers.Storage = {

	/**
	 * Kinds of tag with storage items
	 * @type {Object.<string, string>}
	 */
	_root_handlers: {
		template_collection: '_parseTemplateCollection',
		object_collection: '_parseObjectCollection',
		template_hash: '_parseTemplateHash',
		object_hash: '_parseObjectHash',
		object: '_parseObject'
	},

	/**
	 * Kinds of tags that describe object properties
	 * @type {Object.<string, string>}
	 */
	_object_property_handlers: {
		template: '_parsePropertyAsTemplate',
		lava_type: '_parsePropertyAsLavaType'
	},

	/**
	 * Kinds of attributes on tags that describe objects
	 * @type {Object.<string, string>}
	 */
	_object_attributes_handlers: {
		lava_type: '_parseAttributeAsLavaType'
	},

	/**
	 * Parse raw tags as widget's storage
	 * @param {_cWidget} widget_config
	 * @param {_tRawTemplate} raw_template
	 */
	parse: function(widget_config, raw_template) {

		var storage_schema = this.getMergedStorageSchema(widget_config),
			tags = Lava.parsers.Common.asBlockType(raw_template, 'tag'),
			i = 0,
			count = tags.length,
			item_schema;

		for (; i < count; i++) {

			item_schema = storage_schema[tags[i].name];
			if (Lava.schema.DEBUG && !item_schema) Lava.t('parsing storage; no schema for ' + tags[i].name);
			Lava.store(widget_config, 'storage', tags[i].name, this[this._root_handlers[item_schema.type]](item_schema, tags[i]));

		}

	},

	/**
	 * Template represents an array of storage items (templates or objects)
	 * @param {_cStorageItemSchema} schema
	 * @param {_tRawTemplate} raw_template
	 * @param {string} callback_name
	 * @returns {Array}
	 */
	_walkTemplateAsArray: function(schema, raw_template, callback_name) {

		var result = [],
			tags = Lava.parsers.Common.asBlockType(raw_template, 'tag'),
			i = 0,
			count = tags.length;

		for (; i < count; i++) {

			if (Lava.schema.DEBUG && tags[i].name != schema.tag_name) Lava.t("Unknown tag in collection: " + tags[i].name);
			result.push(
				this[callback_name](schema, tags[i])
			);

		}

		return result;

	},

	/**
	 * Template represents a hash of items (templates or objects) with 'name' attribute on each item
	 * @param {_cStorageItemSchema} schema
	 * @param {_tRawTemplate} raw_template
	 * @param {string} callback_name
	 * @returns {Object}
	 */
	_walkTemplateAsHash: function(schema, raw_template, callback_name) {

		var result = {},
			tags = Lava.parsers.Common.asBlockType(raw_template, 'tag'),
			i = 0,
			count = tags.length;

		for (; i < count; i++) {

			if (Lava.schema.DEBUG) {
				if (tags[i].name != schema.tag_name) Lava.t("Unknown tag in collection: " + tags[i].name);
				if (!tags[i].attributes || !tags[i].attributes.name) Lava.t("Storage: hash tag is missing the name attribute");
				if (tags[i].attributes.name in result) Lava.t('Duplicate item name in storage:' + tags[i].attributes.name);
			}

			result[tags[i].attributes.name] = this[callback_name](schema, tags[i], true);

		}

		return result;

	},

	/**
	 * Convert `raw_tag` into template
	 * @param {_cStorageItemSchema} schema
	 * @param {_cRawTag} raw_tag
	 * @returns {_tTemplate}
	 */
	_asTemplate: function(schema, raw_tag) {

		return Lava.parsers.Common.compileTemplate(raw_tag.content);

	},

	/**
	 * Convert `raw_rag` into object with given `schema`
	 * @param {_cStorageItemSchema} schema
	 * @param {_cRawTag} raw_tag
	 * @param {boolean} exclude_name
	 * @returns {Object}
	 */
	_asObject: function(schema, raw_tag, exclude_name) {

		var tags = Lava.parsers.Common.asBlockType(raw_tag.content, 'tag'),
			i = 0,
			count = tags.length,
			result = {},
			descriptor,
			name;

		for (; i < count; i++) {

			descriptor = schema.properties[tags[i].name];
			if (Lava.schema.DEBUG && !descriptor) Lava.t("Unknown tag in object: " + tags[i].name);
			if (Lava.schema.DEBUG && (tags[i].name in result)) Lava.t('[Storage] duplicate item in object: ' + tags[i].name);
			result[tags[i].name] = this[this._object_property_handlers[descriptor.type]](descriptor, tags[i]);

		}

		for (name in raw_tag.attributes) {

			if (exclude_name && name == 'name') continue;
			descriptor = schema.properties[name];
			if (Lava.schema.DEBUG && (!descriptor || !descriptor.is_attribute)) Lava.t("Unknown attribute in object: " + name);
			if (Lava.schema.DEBUG && (name in result)) Lava.t('[Storage] duplicate item (attribute) in object: ' + name);
			result[name] = this[this._object_attributes_handlers[descriptor.type]](descriptor, raw_tag.attributes[name]);

		}

		return result;

	},

	/**
	 * In case of server-side parsing widget configs may be unextended. Manually merge only {@link _cWidget#storage_schema}
	 * from hierarchy of widget configs
	 * @param {_cWidget} widget_config
	 * @returns {Object.<name, _cStorageItemSchema>}
	 */
	getMergedStorageSchema: function(widget_config) {

		var parent_schema,
			result = widget_config.storage_schema;

		if (!widget_config.is_extended && widget_config['extends']) {

		    if (Lava.schema.DEBUG && !Lava.widgets[widget_config['extends']]) Lava.t("Unable to inherit widget config, parent widget not found: " + widget_config['extends']);
			parent_schema = this.getMergedStorageSchema(Lava.widgets[widget_config['extends']]);
			if (parent_schema) {
				if (result) {
					result = Firestorm.clone(result);
					Lava.mergeStorageSchema(result, parent_schema);
				} else {
					result = parent_schema;
				}
			}

		}

		return result;

	},

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// root handlers

	/**
	 * Parse root storage tag's content as an array of templates
	 * @param {_cStorageItemSchema} item_schema
	 * @param {_cRawTag} raw_tag
	 */
	_parseTemplateCollection: function(item_schema, raw_tag) {

		return this._walkTemplateAsArray(item_schema, raw_tag.content, '_asTemplate');

	},

	/**
	 * Parse root storage tag's content as array of objects with known structure
	 * @param {_cStorageItemSchema} item_schema
	 * @param {_cRawTag} raw_tag
	 */
	_parseObjectCollection: function(item_schema, raw_tag) {

		return this._walkTemplateAsArray(item_schema, raw_tag.content, '_asObject');

	},

	/**
	 * Parse root tag's content as hash of templates
	 * @param {_cStorageItemSchema} item_schema
	 * @param {_cRawTag} raw_tag
	 */
	_parseTemplateHash: function(item_schema, raw_tag) {

		return this._walkTemplateAsHash(item_schema, raw_tag.content, '_asTemplate');

	},

	/**
	 * Parse root tag's content as hash of objects
	 * @param {_cStorageItemSchema} item_schema
	 * @param {_cRawTag} raw_tag
	 */
	_parseObjectHash: function(item_schema, raw_tag) {

		return this._walkTemplateAsHash(item_schema, raw_tag.content, '_asObject');

	},

	/**
	 * Parse tag's content as object with known structure
	 * @param {_cStorageItemSchema} item_schema
	 * @param {_cRawTag} raw_tag
	 */
	_parseObject: function(item_schema, raw_tag) {

		return this._asObject(item_schema, raw_tag);

	},

	// end: root handlers
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Parse a tag inside object, that represents a template
	 * @param {_cStorageObjectPropertySchema} schema
	 * @param {_cRawTag} raw_tag
	 */
	_parsePropertyAsTemplate: function(schema, raw_tag) {

		return raw_tag.content ? Lava.parsers.Common.compileTemplate(raw_tag.content) : [];

	},

	/**
	 * Parse tag inside object, that represents a type from {@link Lava.types}
	 * @param {_cStorageObjectPropertySchema} schema
	 * @param {_cRawTag} raw_tag
	 */
	_parsePropertyAsLavaType: function(schema, raw_tag) {

		if (Lava.schema.DEBUG && (!raw_tag.content || raw_tag.content.length != 1 || typeof (raw_tag.content[0]) != 'string')) Lava.t("One string expected in tag content: " + raw_tag.name);
		return Lava.valueToType(schema, raw_tag.content[0]);

	},

	/**
	 * Parse object attribute as a type from {@link Lava.types}
	 * @param {_cStorageObjectPropertySchema} descriptor
	 * @param {string} value
	 * @returns {*}
	 */
	_parseAttributeAsLavaType: function(descriptor, value) {

		return Lava.valueToType(descriptor, value);

	}

};
/* parser generated by jison 0.4.4 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
Lava.ObjectParser = (function(){
var parser = {trace: function trace(){},
yy: {},
symbols_: {"error":2,"root":3,"EOF":4,"value":5,"objectDefinition":6,"arrayDefinition":7,"RAW_STRING":8,"NUMBER":9,"identifierPath":10,"DOT":11,"IDENTIFIER":12,"OPEN_CURLY":13,"memberList":14,"CLOSE_CURLY":15,"COMMA":16,"member":17,"COLON":18,"OPEN_SQUARE":19,"valueList":20,"CLOSE_SQUARE":21,"$accept":0,"$end":1},
terminals_: {2:"error",4:"EOF",8:"RAW_STRING",9:"NUMBER",11:"DOT",12:"IDENTIFIER",13:"OPEN_CURLY",15:"CLOSE_CURLY",16:"COMMA",18:"COLON",19:"OPEN_SQUARE",21:"CLOSE_SQUARE"},
productions_: [0,[3,1],[3,2],[5,1],[5,1],[5,1],[5,1],[5,1],[10,3],[10,1],[6,3],[6,2],[14,3],[14,1],[17,3],[17,3],[7,3],[7,2],[20,3],[20,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */
/**/) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 7: yy.assertPathValid($$[$0]); // note: also matches literals like 'true', 'false' and 'null' 
break;
case 8: $$[$0-2].push($$[$0]); 
break;
case 9: this.$ = [$$[$0]]; 
break;
}
},
table: [{3:1,4:[1,2],5:3,6:4,7:5,8:[1,6],9:[1,7],10:8,12:[1,11],13:[1,9],19:[1,10]},{1:[3]},{1:[2,1]},{4:[1,12]},{4:[2,3],15:[2,3],16:[2,3],21:[2,3]},{4:[2,4],15:[2,4],16:[2,4],21:[2,4]},{4:[2,5],15:[2,5],16:[2,5],21:[2,5]},{4:[2,6],15:[2,6],16:[2,6],21:[2,6]},{4:[2,7],11:[1,13],15:[2,7],16:[2,7],21:[2,7]},{8:[1,17],12:[1,18],14:14,15:[1,15],17:16},{5:21,6:4,7:5,8:[1,6],9:[1,7],10:8,12:[1,11],13:[1,9],19:[1,10],20:19,21:[1,20]},{4:[2,9],11:[2,9],15:[2,9],16:[2,9],21:[2,9]},{1:[2,2]},{12:[1,22]},{15:[1,23],16:[1,24]},{4:[2,11],15:[2,11],16:[2,11],21:[2,11]},{15:[2,13],16:[2,13]},{18:[1,25]},{18:[1,26]},{16:[1,28],21:[1,27]},{4:[2,17],15:[2,17],16:[2,17],21:[2,17]},{16:[2,19],21:[2,19]},{4:[2,8],11:[2,8],15:[2,8],16:[2,8],21:[2,8]},{4:[2,10],15:[2,10],16:[2,10],21:[2,10]},{8:[1,17],12:[1,18],17:29},{5:30,6:4,7:5,8:[1,6],9:[1,7],10:8,12:[1,11],13:[1,9],19:[1,10]},{5:31,6:4,7:5,8:[1,6],9:[1,7],10:8,12:[1,11],13:[1,9],19:[1,10]},{4:[2,16],15:[2,16],16:[2,16],21:[2,16]},{5:32,6:4,7:5,8:[1,6],9:[1,7],10:8,12:[1,11],13:[1,9],19:[1,10]},{15:[2,12],16:[2,12]},{15:[2,14],16:[2,14]},{15:[2,15],16:[2,15]},{16:[2,18],21:[2,18]}],
defaultActions: {2:[2,1],12:[2,2]},
parseError: function parseError(str,hash){if(hash.recoverable){this.trace(str)}else{throw new Error(str)}},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == 'undefined') {
        this.lexer.yylloc = {};
    }
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === 'function') {
        this.parseError = this.yy.parseError;
    } else {
        this.parseError = (Object.getPrototypeOf ? Object.getPrototypeOf(this) : this.__proto__).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || EOF;
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + this.lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: this.lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: this.lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
/* generated by jison-lex 0.2.0 */
var lexer = (function(){
var lexer = {

EOF:1,

parseError:function parseError(str,hash){if(this.yy.parser){this.yy.parser.parseError(str,hash)}else{throw new Error(str)}},

// resets the lexer, sets new input
setInput:function (input){this._input=input;this._more=this._backtrack=this.done=false;this.yylineno=this.yyleng=0;this.yytext=this.matched=this.match="";this.conditionStack=["INITIAL"];this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0};if(this.options.ranges){this.yylloc.range=[0,0]}this.offset=0;return this},

// consumes and returns one char from the input
input:function (){var ch=this._input[0];this.yytext+=ch;this.yyleng++;this.offset++;this.match+=ch;this.matched+=ch;var lines=ch.match(/(?:\r\n?|\n).*/g);if(lines){this.yylineno++;this.yylloc.last_line++}else{this.yylloc.last_column++}if(this.options.ranges){this.yylloc.range[1]++}this._input=this._input.slice(1);return ch},

// unshifts one char (or a string) into the input
unput:function (ch){var len=ch.length;var lines=ch.split(/(?:\r\n?|\n)/g);this._input=ch+this._input;this.yytext=this.yytext.substr(0,this.yytext.length-len-1);this.offset-=len;var oldLines=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1);this.matched=this.matched.substr(0,this.matched.length-1);if(lines.length-1){this.yylineno-=lines.length-1}var r=this.yylloc.range;this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:lines?(lines.length===oldLines.length?this.yylloc.first_column:0)+oldLines[oldLines.length-lines.length].length-lines[0].length:this.yylloc.first_column-len};if(this.options.ranges){this.yylloc.range=[r[0],r[0]+this.yyleng-len]
}this.yyleng=this.yytext.length;return this},

// When called from action, caches matched text and appends it on next action
more:function (){this._more=true;return this},

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function (){if(this.options.backtrack_lexer){this._backtrack=true}else{return this.parseError("Lexical error on line "+(this.yylineno+1)+". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})}return this},

// retain first n characters of the match
less:function (n){this.unput(this.match.slice(n))},

// displays already matched input, i.e. for error messages
pastInput:function (){var past=this.matched.substr(0,this.matched.length-this.match.length);return(past.length>20?"...":"")+past.substr(-20).replace(/\n/g,"")},

// displays upcoming input, i.e. for error messages
upcomingInput:function (){var next=this.match;if(next.length<20){next+=this._input.substr(0,20-next.length)}return(next.substr(0,20)+(next.length>20?"...":"")).replace(/\n/g,"")},

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function (){var pre=this.pastInput();var c=new Array(pre.length+1).join("-");return pre+this.upcomingInput()+"\n"+c+"^"},

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match,indexed_rule){var token,lines,backup;if(this.options.backtrack_lexer){backup={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done};if(this.options.ranges){backup.yylloc.range=this.yylloc.range.slice(0)}}lines=match[0].match(/(?:\r\n?|\n).*/g);if(lines){this.yylineno+=lines.length}this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:lines?lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+match[0].length};this.yytext+=match[0];this.match+=match[0];this.matches=match;this.yyleng=this.yytext.length;if(this.options.ranges){this.yylloc.range=[this.offset,this.offset+=this.yyleng]}this._more=false;this._backtrack=false;this._input=this._input.slice(match[0].length);this.matched+=match[0];token=this.performAction.call(this,this.yy,this,indexed_rule,this.conditionStack[this.conditionStack.length-1]);if(this.done&&this._input){this.done=false}if(token){if(this.options.backtrack_lexer){delete backup}return token}else if(this._backtrack){for(var k in backup){this[k]=backup[k]}return false}if(this.options.backtrack_lexer){delete backup}return false},

// return next match in input
next:function (){if(this.done){return this.EOF}if(!this._input){this.done=true}var token,match,tempMatch,index;if(!this._more){this.yytext="";this.match=""}var rules=this._currentRules();for(var i=0;i<rules.length;i++){tempMatch=this._input.match(this.rules[rules[i]]);if(tempMatch&&(!match||tempMatch[0].length>match[0].length)){match=tempMatch;index=i;if(this.options.backtrack_lexer){token=this.test_match(tempMatch,rules[i]);if(token!==false){return token}else if(this._backtrack){match=false;continue}else{return false}}else if(!this.options.flex){break}}}if(match){token=this.test_match(match,rules[index]);if(token!==false){return token}return false}if(this._input===""){return this.EOF}else{return this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})}},

// return next match that has a token
lex:function lex(){var r=this.next();if(r){return r}else{return this.lex()}},

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition){this.conditionStack.push(condition)},

// pop the previously active lexer condition state off the condition stack
popState:function popState(){var n=this.conditionStack.length-1;if(n>0){return this.conditionStack.pop()}else{return this.conditionStack[0]}},

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules(){if(this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]){return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules}else{return this.conditions["INITIAL"].rules}},

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n){n=this.conditionStack.length-1-Math.abs(n||0);if(n>=0){return this.conditionStack[n]}else{return"INITIAL"}},

// alias for begin(condition)
pushState:function pushState(condition){this.begin(condition)},

// return the number of states currently on the stack
stateStackSize:function stateStackSize(){return this.conditionStack.length},
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START
/**/) {

var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0: return 13; 
break;
case 1: return 15; 
break;
case 2: return 19; 
break;
case 3: return 21; 
break;
case 4: return 18; 
break;
case 5: return 11; 
break;
case 6: return 16; 
break;
case 7: return 9; 
break;
case 8: return 9; 
break;
case 9: return 8; 
break;
case 10: return 8; 
break;
case 11: return 12; 
break;
case 12: /* skip whitespace */ 
break;
case 13: return 4; 
break;
}
},
rules: [/^(?:\{)/,/^(?:\})/,/^(?:\[)/,/^(?:\])/,/^(?::)/,/^(?:\.)/,/^(?:,)/,/^(?:\d+(\.\d+)?((e|E)(\+|-)\d+)?)/,/^(?:0x[a-fA-F0-9]+)/,/^(?:"([^\\\"]|\\.)*")/,/^(?:'([^\\\']|\\.)*')/,/^(?:[a-zA-Z\_][a-zA-Z0-9\_]*)/,/^(?:\s+)/,/^(?:$)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13],"inclusive":true}}
};
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();




Lava.ObjectParser.yy = {

	/**
	 * Additional globals may be added to the white list
	 */
	valid_globals: ['Lava'],

	/**
	 * Keep in mind: configs must be serializable
	 * @param {Array} path_segments
	 */
	assertPathValid: function(path_segments) {

		if (Lava.schema.VALIDATE_OBJECT_PATHS) {

			if (!(path_segments[0] in Lava.parsers.Common.LITERALS) && this.valid_globals.indexOf(path_segments[0]) == -1) {
				Lava.t("ObjectParser: invalid external path. Text: " + path_segments.join('.'));
			}

		}

	}

};
/* parser generated by jison 0.4.4 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
Lava.ExpressionParser = (function(){
var parser = {trace: function trace(){},
yy: {},
symbols_: {"error":2,"root":3,"EOF":4,"expressions":5,"SEMICOLON":6,"expression":7,"COMMA":8,"scopeEvalList":9,"scopeEval":10,"modifiedOperand":11,"expressionTail":12,"operator":13,"OPERATOR":14,"UNARY_ARITHMETIC_OPERATOR":15,"operand":16,"UNARY_OPERATOR":17,"OPEN_BRACE":18,"CLOSE_BRACE":19,"arrayDefinition":20,"NUMBER":21,"RAW_STRING":22,"LITERAL":23,"dynamicScope":24,"functionCall":25,"OPEN_SQUARE":26,"expressionList":27,"CLOSE_SQUARE":28,"knownView":29,"VIEW_BY_LABEL":30,"VIEW_BY_ID":31,"VIEW_BY_NAME":32,"lookupOperator":33,"LOOK_UP":34,"LOOK_DOWN":35,"viewLocator":36,"DEEPNESS_OPERATOR":37,"GLOBAL_MODIFIER_CALL":38,"WIDGET_MODIFIER_CALL":39,"ACTIVE_MODIFIER_CALL":40,"OPEN_CURLY":41,"IDENTIFIER":42,"CLOSE_CURLY":43,"scopePath":44,"SEARCH_OPERATOR":45,"scopePathSegment":46,"DOT_PROPERTY":47,"$accept":0,"$end":1},
terminals_: {2:"error",4:"EOF",6:"SEMICOLON",8:"COMMA",14:"OPERATOR",15:"UNARY_ARITHMETIC_OPERATOR",17:"UNARY_OPERATOR",18:"OPEN_BRACE",19:"CLOSE_BRACE",21:"NUMBER",22:"RAW_STRING",23:"LITERAL",26:"OPEN_SQUARE",28:"CLOSE_SQUARE",30:"VIEW_BY_LABEL",31:"VIEW_BY_ID",32:"VIEW_BY_NAME",34:"LOOK_UP",35:"LOOK_DOWN",37:"DEEPNESS_OPERATOR",38:"GLOBAL_MODIFIER_CALL",39:"WIDGET_MODIFIER_CALL",40:"ACTIVE_MODIFIER_CALL",41:"OPEN_CURLY",42:"IDENTIFIER",43:"CLOSE_CURLY",45:"SEARCH_OPERATOR",47:"DOT_PROPERTY"},
productions_: [0,[3,1],[3,2],[5,3],[5,3],[5,1],[9,3],[9,1],[7,2],[7,1],[12,3],[12,2],[13,1],[13,1],[11,2],[11,2],[11,1],[16,3],[16,1],[16,1],[16,1],[16,1],[16,1],[16,1],[16,1],[20,3],[20,2],[27,3],[27,1],[29,1],[29,1],[29,1],[33,1],[33,1],[36,1],[36,2],[36,2],[36,3],[25,3],[25,4],[25,4],[25,5],[25,4],[25,5],[24,4],[10,1],[10,2],[10,3],[10,2],[10,2],[44,2],[44,1],[46,1],[46,3]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */
/**/) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
break;
case 2:
break;
case 3:
			yy.assertSemicolonAllowed();
			yy.finishArgument($$[$0].trim());

break;
case 4:
			yy.assertCommaAllowed();
			yy.finishArgument($$[$0].trim());

break;
case 5: yy.finishArgument($$[$0].trim());
break;
case 6: yy.x_argument_binds.push($$[$0]);
break;
case 7: yy.x_argument_binds.push($$[$0]);
break;
case 8:
			yy.x_counters.operands++;
			yy.x_counters.expression_tails++;
			this.$ = $$[$0-1] + ' ' + $$[$0];

break;
case 9:
			yy.x_counters.operands++;
			this.$ = $$[$0];

break;
case 10:
			yy.x_counters.operands++;
			this.$ = $$[$0-2] + ' ' + $$[$0-1] + ' ' + $$[$0];

break;
case 11:
			yy.x_counters.operands++;
			this.$ = $$[$0-1] + ' ' + $$[$0];

break;
case 12: this.$ = $$[$0];
break;
case 13: this.$ = $$[$0];
break;
case 14: this.$ = $$[$0-1] + ' ' + $$[$0];
break;
case 15: this.$ = $$[$0-1] + ' ' + $$[$0];
break;
case 16: this.$ = $$[$0];
break;
case 17:
			yy.x_counters.braces++;
			this.$ = '(' + $$[$0-1] + ')';

break;
case 18: this.$ = $$[$0];
break;
case 19:
			yy.x_counters.numbers++;
			this.$ = $$[$0];

break;
case 20:
			yy.x_counters.strings++;
			this.$ = $$[$0];

break;
case 21:
			yy.x_counters.literals++;
			this.$ = $$[$0];

break;
case 22:
			var index = yy.x_argument_binds.push($$[$0]) - 1;
			this.$ = 'this._binds[' + index + '].getValue()';

break;
case 23:
			yy.x_counters.dynamic_scopes++;
			var index = yy.x_argument_binds.push($$[$0]) - 1;
			this.$ = 'this._binds[' + index + '].getValue()';

break;
case 24: this.$ = $$[$0];
break;
case 25: this.$ = '[' + $$[$0-1] + ']';
break;
case 26: this.$ = '[]';
break;
case 27: this.$ = $$[$0-2] + ', ' + $$[$0];
break;
case 28: this.$ = $$[$0];
break;
case 29: this.$ = {locator_type: 'Label', locator: $$[$0]};
break;
case 30: this.$ = {locator_type: 'Id', locator: $$[$0]};
break;
case 31: this.$ = {locator_type: 'Name', locator: $$[$0]};
break;
case 32: this.$ = {label: $$[$0], direction: 'look_up'};
break;
case 33: this.$ = {label: $$[$0], direction: 'look_down'};
break;
case 34: this.$ = $$[$0];
break;
case 35: Lava.t("Lookup operator is not supported yet.");
break;
case 36:
			$$[$0-1].depth = parseInt($$[$0]);
			if (!$$[$0-1].depth) Lava.t('Deepness operator: depth must be > 0');
			this.$ = $$[$0-1];

break;
case 37: Lava.t("Lookup operator is not supported yet.");
break;
case 38:
			yy.x_counters.global_modifiers++;
			this.$ = 'this._callGlobalModifier("' + $$[$0-2] + '", [])';

break;
case 39:
			yy.x_counters.global_modifiers++;
			this.$ = 'this._callGlobalModifier("' + $$[$0-3] + '", [' + $$[$0-1] + '])';

break;
case 40:
			yy.x_counters.widget_modifiers++;
			$$[$0-3].callback_name = $$[$0-2];
			var index = yy.x_argument_widget_modifiers.push($$[$0-3]) - 1;
			this.$ = 'this._callModifier("' + index + '", [])';

break;
case 41:
			yy.x_counters.widget_modifiers++;
			$$[$0-4].callback_name = $$[$0-3];
			var index = yy.x_argument_widget_modifiers.push($$[$0-4]) - 1;
			this.$ = 'this._callModifier("' + index + '", [' + $$[$0-1] + '])';

break;
case 42:
			yy.x_counters.active_modifiers++;
			$$[$0-3].callback_name = $$[$0-2];
			var index = yy.x_argument_active_modifiers.push($$[$0-3]) - 1;
			this.$ = 'this._callActiveModifier("' + index + '", [])';

break;
case 43:
			yy.x_counters.active_modifiers++;
			$$[$0-4].callback_name = $$[$0-3];
			var index = yy.x_argument_active_modifiers.push($$[$0-4]) - 1;
			this.$ = 'this._callActiveModifier("' + index + '", [' + $$[$0-1] + '])';

break;
case 44:
			$$[$0-3].isDynamic = true;
			$$[$0-3].property_name = $$[$0-1];
			this.$ = $$[$0-3];

break;
case 45: this.$ = {property_name: $$[$0]};
break;
case 46: this.$ = {property_name: $$[$0-1], tail: $$[$0]};
break;
case 47:
			$$[$0-2].property_name = $$[$0-1];
			$$[$0-2].tail = $$[$0];
			this.$ = $$[$0-2];

break;
case 48:
			$$[$0-1].property_name = $$[$0];
			this.$ = $$[$0-1];

break;
case 49: $$[$0-1].tail = $$[$0]; this.$ = $$[$0-1];
break;
case 50: $$[$0-1].push($$[$0]); this.$ = $$[$0-1];
break;
case 51: this.$ = [$$[$0]];
break;
case 52: this.$ = $$[$0];
break;
case 53:
			var segments = $$[$0-1].path_segments;
			if (segments) {
				for (var i = 0, count = segments.length; i < count; i++) {
					if (typeof(segments[i]) == 'object') Lava.t('Dynamic segment must not contain other dynamic segments');
				}
			}
			this.$ = $$[$0-1];

break;
}
},
table: [{3:1,4:[1,2],5:3,7:4,10:14,11:5,15:[1,6],16:8,17:[1,7],18:[1,9],20:10,21:[1,11],22:[1,12],23:[1,13],24:15,25:16,26:[1,17],29:20,30:[1,22],31:[1,23],32:[1,24],36:19,38:[1,21],42:[1,18]},{1:[3]},{1:[2,1]},{4:[1,25],6:[1,26],8:[1,27]},{4:[2,5],6:[2,5],8:[2,5]},{4:[2,9],6:[2,9],8:[2,9],12:28,13:29,14:[1,30],15:[1,31],19:[2,9],28:[2,9]},{10:14,16:32,18:[1,9],20:10,21:[1,11],22:[1,12],23:[1,13],24:15,25:16,26:[1,17],29:20,30:[1,22],31:[1,23],32:[1,24],36:19,38:[1,21],42:[1,18]},{10:14,16:33,18:[1,9],20:10,21:[1,11],22:[1,12],23:[1,13],24:15,25:16,26:[1,17],29:20,30:[1,22],31:[1,23],32:[1,24],36:19,38:[1,21],42:[1,18]},{4:[2,16],6:[2,16],8:[2,16],14:[2,16],15:[2,16],19:[2,16],28:[2,16]},{7:34,10:14,11:5,15:[1,6],16:8,17:[1,7],18:[1,9],20:10,21:[1,11],22:[1,12],23:[1,13],24:15,25:16,26:[1,17],29:20,30:[1,22],31:[1,23],32:[1,24],36:19,38:[1,21],42:[1,18]},{4:[2,18],6:[2,18],8:[2,18],14:[2,18],15:[2,18],19:[2,18],28:[2,18]},{4:[2,19],6:[2,19],8:[2,19],14:[2,19],15:[2,19],19:[2,19],28:[2,19]},{4:[2,20],6:[2,20],8:[2,20],14:[2,20],15:[2,20],19:[2,20],28:[2,20]},{4:[2,21],6:[2,21],8:[2,21],14:[2,21],15:[2,21],19:[2,21],28:[2,21]},{4:[2,22],6:[2,22],8:[2,22],14:[2,22],15:[2,22],19:[2,22],28:[2,22]},{4:[2,23],6:[2,23],8:[2,23],14:[2,23],15:[2,23],19:[2,23],28:[2,23]},{4:[2,24],6:[2,24],8:[2,24],14:[2,24],15:[2,24],19:[2,24],28:[2,24]},{7:37,10:14,11:5,15:[1,6],16:8,17:[1,7],18:[1,9],20:10,21:[1,11],22:[1,12],23:[1,13],24:15,25:16,26:[1,17],27:35,28:[1,36],29:20,30:[1,22],31:[1,23],32:[1,24],36:19,38:[1,21],42:[1,18]},{4:[2,45],6:[2,45],8:[2,45],14:[2,45],15:[2,45],19:[2,45],26:[1,41],28:[2,45],44:38,46:39,47:[1,40]},{26:[1,41],44:43,45:[1,42],46:39,47:[1,40]},{26:[2,34],33:47,34:[1,49],35:[1,50],37:[1,48],39:[1,45],40:[1,46],41:[1,44],45:[2,34],47:[2,34]},{18:[1,51]},{26:[2,29],34:[2,29],35:[2,29],37:[2,29],39:[2,29],40:[2,29],41:[2,29],45:[2,29],47:[2,29]},{26:[2,30],34:[2,30],35:[2,30],37:[2,30],39:[2,30],40:[2,30],41:[2,30],45:[2,30],47:[2,30]},{26:[2,31],34:[2,31],35:[2,31],37:[2,31],39:[2,31],40:[2,31],41:[2,31],45:[2,31],47:[2,31]},{1:[2,2]},{7:52,10:14,11:5,15:[1,6],16:8,17:[1,7],18:[1,9],20:10,21:[1,11],22:[1,12],23:[1,13],24:15,25:16,26:[1,17],29:20,30:[1,22],31:[1,23],32:[1,24],36:19,38:[1,21],42:[1,18]},{7:53,10:14,11:5,15:[1,6],16:8,17:[1,7],18:[1,9],20:10,21:[1,11],22:[1,12],23:[1,13],24:15,25:16,26:[1,17],29:20,30:[1,22],31:[1,23],32:[1,24],36:19,38:[1,21],42:[1,18]},{4:[2,8],6:[2,8],8:[2,8],13:54,14:[1,30],15:[1,31],19:[2,8],28:[2,8]},{10:14,11:55,15:[1,6],16:8,17:[1,7],18:[1,9],20:10,21:[1,11],22:[1,12],23:[1,13],24:15,25:16,26:[1,17],29:20,30:[1,22],31:[1,23],32:[1,24],36:19,38:[1,21],42:[1,18]},{15:[2,12],17:[2,12],18:[2,12],21:[2,12],22:[2,12],23:[2,12],26:[2,12],30:[2,12],31:[2,12],32:[2,12],38:[2,12],42:[2,12]},{15:[2,13],17:[2,13],18:[2,13],21:[2,13],22:[2,13],23:[2,13],26:[2,13],30:[2,13],31:[2,13],32:[2,13],38:[2,13],42:[2,13]},{4:[2,14],6:[2,14],8:[2,14],14:[2,14],15:[2,14],19:[2,14],28:[2,14]},{4:[2,15],6:[2,15],8:[2,15],14:[2,15],15:[2,15],19:[2,15],28:[2,15]},{19:[1,56]},{8:[1,58],28:[1,57]},{4:[2,26],6:[2,26],8:[2,26],14:[2,26],15:[2,26],19:[2,26],28:[2,26]},{8:[2,28],19:[2,28],28:[2,28]},{4:[2,46],6:[2,46],8:[2,46],14:[2,46],15:[2,46],19:[2,46],26:[1,41],28:[2,46],46:59,47:[1,40]},{4:[2,51],6:[2,51],8:[2,51],14:[2,51],15:[2,51],19:[2,51],26:[2,51],28:[2,51],47:[2,51]},{4:[2,52],6:[2,52],8:[2,52],14:[2,52],15:[2,52],19:[2,52],26:[2,52],28:[2,52],47:[2,52]},{10:60,29:61,30:[1,22],31:[1,23],32:[1,24],36:19,42:[1,18]},{4:[2,48],6:[2,48],8:[2,48],14:[2,48],15:[2,48],19:[2,48],26:[1,41],28:[2,48],44:62,46:39,47:[1,40]},{4:[2,49],6:[2,49],8:[2,49],14:[2,49],15:[2,49],19:[2,49],26:[1,41],28:[2,49],46:59,47:[1,40]},{42:[1,63]},{18:[1,64]},{18:[1,65]},{26:[2,35],45:[2,35],47:[2,35]},{26:[2,36],33:66,34:[1,49],35:[1,50],45:[2,36],47:[2,36]},{26:[2,32],45:[2,32],47:[2,32]},{26:[2,33],45:[2,33],47:[2,33]},{7:37,10:14,11:5,15:[1,6],16:8,17:[1,7],18:[1,9],19:[1,67],20:10,21:[1,11],22:[1,12],23:[1,13],24:15,25:16,26:[1,17],27:68,29:20,30:[1,22],31:[1,23],32:[1,24],36:19,38:[1,21],42:[1,18]},{4:[2,3],6:[2,3],8:[2,3]},{4:[2,4],6:[2,4],8:[2,4]},{10:14,11:69,15:[1,6],16:8,17:[1,7],18:[1,9],20:10,21:[1,11],22:[1,12],23:[1,13],24:15,25:16,26:[1,17],29:20,30:[1,22],31:[1,23],32:[1,24],36:19,38:[1,21],42:[1,18]},{4:[2,11],6:[2,11],8:[2,11],14:[2,11],15:[2,11],19:[2,11],28:[2,11]},{4:[2,17],6:[2,17],8:[2,17],14:[2,17],15:[2,17],19:[2,17],28:[2,17]},{4:[2,25],6:[2,25],8:[2,25],14:[2,25],15:[2,25],19:[2,25],28:[2,25]},{7:70,10:14,11:5,15:[1,6],16:8,17:[1,7],18:[1,9],20:10,21:[1,11],22:[1,12],23:[1,13],24:15,25:16,26:[1,17],29:20,30:[1,22],31:[1,23],32:[1,24],36:19,38:[1,21],42:[1,18]},{4:[2,50],6:[2,50],8:[2,50],14:[2,50],15:[2,50],19:[2,50],26:[2,50],28:[2,50],47:[2,50]},{28:[1,71]},{26:[2,34],33:47,34:[1,49],35:[1,50],37:[1,48],45:[2,34],47:[2,34]},{4:[2,47],6:[2,47],8:[2,47],14:[2,47],15:[2,47],19:[2,47],26:[1,41],28:[2,47],46:59,47:[1,40]},{43:[1,72]},{7:37,10:14,11:5,15:[1,6],16:8,17:[1,7],18:[1,9],19:[1,73],20:10,21:[1,11],22:[1,12],23:[1,13],24:15,25:16,26:[1,17],27:74,29:20,30:[1,22],31:[1,23],32:[1,24],36:19,38:[1,21],42:[1,18]},{7:37,10:14,11:5,15:[1,6],16:8,17:[1,7],18:[1,9],19:[1,75],20:10,21:[1,11],22:[1,12],23:[1,13],24:15,25:16,26:[1,17],27:76,29:20,30:[1,22],31:[1,23],32:[1,24],36:19,38:[1,21],42:[1,18]},{26:[2,37],45:[2,37],47:[2,37]},{4:[2,38],6:[2,38],8:[2,38],14:[2,38],15:[2,38],19:[2,38],28:[2,38]},{8:[1,58],19:[1,77]},{4:[2,10],6:[2,10],8:[2,10],14:[2,10],15:[2,10],19:[2,10],28:[2,10]},{8:[2,27],19:[2,27],28:[2,27]},{4:[2,53],6:[2,53],8:[2,53],14:[2,53],15:[2,53],19:[2,53],26:[2,53],28:[2,53],47:[2,53]},{4:[2,44],6:[2,44],8:[2,44],14:[2,44],15:[2,44],19:[2,44],28:[2,44]},{4:[2,40],6:[2,40],8:[2,40],14:[2,40],15:[2,40],19:[2,40],28:[2,40]},{8:[1,58],19:[1,78]},{4:[2,42],6:[2,42],8:[2,42],14:[2,42],15:[2,42],19:[2,42],28:[2,42]},{8:[1,58],19:[1,79]},{4:[2,39],6:[2,39],8:[2,39],14:[2,39],15:[2,39],19:[2,39],28:[2,39]},{4:[2,41],6:[2,41],8:[2,41],14:[2,41],15:[2,41],19:[2,41],28:[2,41]},{4:[2,43],6:[2,43],8:[2,43],14:[2,43],15:[2,43],19:[2,43],28:[2,43]}],
defaultActions: {2:[2,1],25:[2,2]},
parseError: function parseError(str,hash){if(hash.recoverable){this.trace(str)}else{throw new Error(str)}},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == 'undefined') {
        this.lexer.yylloc = {};
    }
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === 'function') {
        this.parseError = this.yy.parseError;
    } else {
        this.parseError = (Object.getPrototypeOf ? Object.getPrototypeOf(this) : this.__proto__).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || EOF;
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + this.lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: this.lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: this.lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
/* generated by jison-lex 0.2.0 */
var lexer = (function(){
var lexer = {

EOF:1,

parseError:function parseError(str,hash){if(this.yy.parser){this.yy.parser.parseError(str,hash)}else{throw new Error(str)}},

// resets the lexer, sets new input
setInput:function (input){this._input=input;this._more=this._backtrack=this.done=false;this.yylineno=this.yyleng=0;this.yytext=this.matched=this.match="";this.conditionStack=["INITIAL"];this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0};if(this.options.ranges){this.yylloc.range=[0,0]}this.offset=0;return this},

// consumes and returns one char from the input
input:function (){var ch=this._input[0];this.yytext+=ch;this.yyleng++;this.offset++;this.match+=ch;this.matched+=ch;var lines=ch.match(/(?:\r\n?|\n).*/g);if(lines){this.yylineno++;this.yylloc.last_line++}else{this.yylloc.last_column++}if(this.options.ranges){this.yylloc.range[1]++}this._input=this._input.slice(1);return ch},

// unshifts one char (or a string) into the input
unput:function (ch){var len=ch.length;var lines=ch.split(/(?:\r\n?|\n)/g);this._input=ch+this._input;this.yytext=this.yytext.substr(0,this.yytext.length-len-1);this.offset-=len;var oldLines=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1);this.matched=this.matched.substr(0,this.matched.length-1);if(lines.length-1){this.yylineno-=lines.length-1}var r=this.yylloc.range;this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:lines?(lines.length===oldLines.length?this.yylloc.first_column:0)+oldLines[oldLines.length-lines.length].length-lines[0].length:this.yylloc.first_column-len};if(this.options.ranges){this.yylloc.range=[r[0],r[0]+this.yyleng-len]
}this.yyleng=this.yytext.length;return this},

// When called from action, caches matched text and appends it on next action
more:function (){this._more=true;return this},

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function (){if(this.options.backtrack_lexer){this._backtrack=true}else{return this.parseError("Lexical error on line "+(this.yylineno+1)+". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})}return this},

// retain first n characters of the match
less:function (n){this.unput(this.match.slice(n))},

// displays already matched input, i.e. for error messages
pastInput:function (){var past=this.matched.substr(0,this.matched.length-this.match.length);return(past.length>20?"...":"")+past.substr(-20).replace(/\n/g,"")},

// displays upcoming input, i.e. for error messages
upcomingInput:function (){var next=this.match;if(next.length<20){next+=this._input.substr(0,20-next.length)}return(next.substr(0,20)+(next.length>20?"...":"")).replace(/\n/g,"")},

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function (){var pre=this.pastInput();var c=new Array(pre.length+1).join("-");return pre+this.upcomingInput()+"\n"+c+"^"},

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match,indexed_rule){var token,lines,backup;if(this.options.backtrack_lexer){backup={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done};if(this.options.ranges){backup.yylloc.range=this.yylloc.range.slice(0)}}lines=match[0].match(/(?:\r\n?|\n).*/g);if(lines){this.yylineno+=lines.length}this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:lines?lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+match[0].length};this.yytext+=match[0];this.match+=match[0];this.matches=match;this.yyleng=this.yytext.length;if(this.options.ranges){this.yylloc.range=[this.offset,this.offset+=this.yyleng]}this._more=false;this._backtrack=false;this._input=this._input.slice(match[0].length);this.matched+=match[0];token=this.performAction.call(this,this.yy,this,indexed_rule,this.conditionStack[this.conditionStack.length-1]);if(this.done&&this._input){this.done=false}if(token){if(this.options.backtrack_lexer){delete backup}return token}else if(this._backtrack){for(var k in backup){this[k]=backup[k]}return false}if(this.options.backtrack_lexer){delete backup}return false},

// return next match in input
next:function (){if(this.done){return this.EOF}if(!this._input){this.done=true}var token,match,tempMatch,index;if(!this._more){this.yytext="";this.match=""}var rules=this._currentRules();for(var i=0;i<rules.length;i++){tempMatch=this._input.match(this.rules[rules[i]]);if(tempMatch&&(!match||tempMatch[0].length>match[0].length)){match=tempMatch;index=i;if(this.options.backtrack_lexer){token=this.test_match(tempMatch,rules[i]);if(token!==false){return token}else if(this._backtrack){match=false;continue}else{return false}}else if(!this.options.flex){break}}}if(match){token=this.test_match(match,rules[index]);if(token!==false){return token}return false}if(this._input===""){return this.EOF}else{return this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})}},

// return next match that has a token
lex:function lex(){var r=this.next();if(r){return r}else{return this.lex()}},

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition){this.conditionStack.push(condition)},

// pop the previously active lexer condition state off the condition stack
popState:function popState(){var n=this.conditionStack.length-1;if(n>0){return this.conditionStack.pop()}else{return this.conditionStack[0]}},

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules(){if(this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]){return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules}else{return this.conditions["INITIAL"].rules}},

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n){n=this.conditionStack.length-1-Math.abs(n||0);if(n>=0){return this.conditionStack[n]}else{return"INITIAL"}},

// alias for begin(condition)
pushState:function pushState(condition){this.begin(condition)},

// return the number of states currently on the stack
stateStackSize:function stateStackSize(){return this.conditionStack.length},
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START
/**/) {

var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0: Lava.t('Spaces between function name and opening brace are not allowed (1)');
break;
case 1: Lava.t('Spaces between function name and opening brace are not allowed (1)');
break;
case 2: Lava.t('Spaces between function name and opening brace are not allowed (2)');
break;
case 3: Lava.t('Spaces in scope path are not allowed (1)');
break;
case 4: Lava.t('Spaces in scope path are not allowed (2)');
break;
case 5: yy_.yytext = yy_.yytext.substr(1); return 30;
break;
case 6: yy_.yytext = yy_.yytext.substr(1); return 31;
break;
case 7: yy_.yytext = yy_.yytext.substr(1); return 32;
break;
case 8: yy_.yytext = yy_.yytext.substr(2); return 40;
break;
case 9: yy_.yytext = yy_.yytext.substr(5); return 40;
break;
case 10: yy_.yytext = yy_.yytext.substr(1); return 39;
break;
case 11: return 38;
break;
case 12: yy_.yytext = yy_.yytext.substr(1); return 37;
break;
case 13: yy_.yytext = yy_.yytext.substr(1); return 47;
break;
case 14: yy_.yytext = yy_.yytext.substr(2); return 45;
break;
case 15: yy_.yytext = yy_.yytext.substr(5); return 45;
break;
case 16: yy_.yytext = yy_.yytext.substr(4, yy_.yyleng - 5); return 34;
break;
case 17: yy_.yytext = yy_.yytext.substr(4, yy_.yyleng - 5); return 35;
break;
case 18:
    if (yy_.yytext == '++' || yy_.yytext == '--') Lava.t('Increment and decrement are not allowed (side-effects). Missing a brace after the first \'' + yy_.yytext[0] + '\'?');
    Lava.t('Operators with side-effects are not allowed: ' + yy_.yytext); // all assignments, increments and other side-effects

break;
case 19: yy_.yytext = yy.unescape(yy_.yytext); return 14; /*escaped operator versions of <=, >= */
break;
case 20: yy_.yytext = yy.unescape(yy_.yytext); return 14; /* escaped &&, <<, >>>, >> */
break;
case 21: yy_.yytext = yy.unescape(yy_.yytext); return 14; /* escaped bitwise &, <, > */
break;
case 22: return 14; /*arithmetic without unary*/
break;
case 23: return 14; /*logical*/
break;
case 24: return 14; /*comparison*/
break;
case 25: return 14; /*bitwise*/
break;
case 26: return 14; /*ternary*/
break;
case 27: return 17; /*unary*/
break;
case 28: return 15; /*unary*/
break;
case 29: Lava.t('Operators with side-effects are not allowed: =');
break;
case 30: if (yy_.yytext != yy_.yytext.toLowerCase()) Lava.t("The 'in' operator must be written in lower case."); return 14;
break;
case 31: return 8;
break;
case 32: return 6;
break;
case 33: return 21;
break;
case 34: return 21;
break;
case 35: return 22;
break;
case 36: return 22;
break;
case 37: return 26;
break;
case 38: return 28;
break;
case 39: /* skip whitespace */
break;
case 40: return 41;
break;
case 41: return 43;
break;
case 42:
		this.x_lex_brace_levels++;
		return 18;

break;
case 43:
		if (this.x_tail_mode && this.x_lex_brace_levels == 0) {
			this.x_input_tail_length = this._input.length;
			this._input = '';
			this.done = true;
			return 4;
		} else {
			this.x_lex_brace_levels--;
			return 19;
		}

break;
case 44:
		var lowercase = yy_.yytext.toLowerCase();
		if (lowercase == 'this') Lava.t("Expression parser: 'this' is reserved word. Are you missing the Label sign (@)?");

		if (lowercase in this.operators_map) {
			if (lowercase != yy_.yytext) Lava.t("Expression parser: 'lt', 'gt', 'and' must be lower case");
			yy_.yytext = this.operators_map[lowercase];
			return 14;
		}

		if (lowercase in Lava.parsers.Common.LITERALS) {
			if (lowercase != yy_.yytext) Lava.t("Expression parser, code style: literals must be lower case");
			return 23;
		}

		return 42;

break;
case 45: return 4;
break;
}
},
rules: [/^(?:->([a-zA-Z\_][a-zA-Z0-9\_]*)(?=\s+)\()/,/^(?:-&gt;([a-zA-Z\_][a-zA-Z0-9\_]*)(?=\s+)\()/,/^(?:\.([a-zA-Z\_][a-zA-Z0-9\_]*)(?=\s+)\()/,/^(?:\s+[\~\.])/,/^(?:\[\s\b)/,/^(?:@([a-zA-Z\_][a-zA-Z0-9\_]*))/,/^(?:#([a-zA-Z\_][a-zA-Z0-9\_]*))/,/^(?:\$([a-zA-Z\_][a-zA-Z0-9\_]*))/,/^(?:->([a-zA-Z\_][a-zA-Z0-9\_]*)(?=\())/,/^(?:-&gt;([a-zA-Z\_][a-zA-Z0-9\_]*)(?=\())/,/^(?:\.([a-zA-Z\_][a-zA-Z0-9\_]*)(?=\())/,/^(?:([a-zA-Z\_][a-zA-Z0-9\_]*)(?=\())/,/^(?:~\d+)/,/^(?:\.[a-zA-Z0-9\_]+)/,/^(?:->([a-zA-Z\_][a-zA-Z0-9\_]*))/,/^(?:-&gt;([a-zA-Z\_][a-zA-Z0-9\_]*))/,/^(?::up\(([a-zA-Z\_][a-zA-Z0-9\_]*)\))/,/^(?::dn\(([a-zA-Z\_][a-zA-Z0-9\_]*)\))/,/^(?:&lt&lt=|&gt&gt=|&gt&gt&gt=|&amp=|\+\+|--|\+=|-=|\*=|\/=|%=|<<=|>>=|>>>=|&=|\^=|\|=)/,/^(?:(&lt;|&gt;))/,/^(?:&amp;&amp;|&lt;&lt;|&gt;&gt;&gt;|&gt;&gt;)/,/^(?:&amp;|&lt;|&gt;)/,/^(?:[\*\/\%])/,/^(?:\|\||&&)/,/^(?:===|!==|==|!=|<=|>=|<|>)/,/^(?:>>>|>>|<<|[\|\^]|&)/,/^(?:[\?\:])/,/^(?:!!|!)/,/^(?:\+|-)/,/^(?:=)/,/^(?:\sin\s|\sIN\s|\sIn\s|\siN\s\b)/,/^(?:,)/,/^(?:;)/,/^(?:\d+(\.\d+)?((e|E)(\+|-)\d+)?)/,/^(?:0x[a-fA-F0-9]+)/,/^(?:"(\\"|[^"])*")/,/^(?:'(\\'|[^'])*')/,/^(?:\[(?=[^\s]))/,/^(?:\])/,/^(?:\s+)/,/^(?:\{)/,/^(?:\})/,/^(?:\()/,/^(?:\))/,/^(?:([a-zA-Z\_][a-zA-Z0-9\_]*))/,/^(?:$)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45],"inclusive":true}}
};
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();




Lava.ExpressionParser._parse = Lava.ExpressionParser.parse;

/**
 * Allowed separators between expressions
 * @enum {number}
 */
Lava.ExpressionParser.SEPARATORS = {
	COMMA: 1,
	SEMICOLON: 2
};

/**
 * Parse expressions, but do not create evaluator functions from their source code
 * @param {string} input Expression source
 * @param {Lava.ExpressionParser.SEPARATORS} [separator] Allowed separator, when parsing multiple expressions
 * @returns {Array.<_cRawArgument>}
 */
Lava.ExpressionParser.parseRaw = function(input, separator) {

	if (this.yy.is_parsing) Lava.t("Calling ExpressionParser.parse*() recursively will break the parser. Please, create another instance.");

	this.lexer.x_tail_mode = false;
	this.lexer.x_lex_brace_levels = 0;
	this.lexer.x_input_tail_length = 0;
	this.lexer.operators_map = {
		'lt': '<',
		'gt': '>',
		'and': '&&'
	};
	this.yy.x_allowed_separator = separator;
	this.yy.reset();

	try {

		this.yy.is_parsing = true;
		this._parse(input);

	} finally {

		this.yy.is_parsing = false;

	}

	return this.yy.x_arguments;

};

/**
 * Parse expressions
 * @param {string} input Source code
 * @param {Lava.ExpressionParser.SEPARATORS} [separator] Allowed separator, when parsing multiple expressions
 * @returns {Array.<_cArgument>}
 */
Lava.ExpressionParser.parse = function(input, separator) {
	return this.yy.convertArguments(this.parseRaw(input, separator));
};

/**
 * Same as {@link Lava.ExpressionParser#parseWithTail}, but does not create evaluator functions from source
 * @param {{input: string, tail_length: number}} config_ref
 * @param {Lava.ExpressionParser.SEPARATORS} separator
 * @returns {Array.<_cRawArgument>}
 */
Lava.ExpressionParser.parseWithTailRaw = function(config_ref, separator) {

	if (this.yy.is_parsing) Lava.t("Calling ExpressionParser.parse*() recursively will break the parser. Please, create another instance.");

	this.lexer.x_tail_mode = true;
	this.lexer.x_lex_brace_levels = 0;
	this.lexer.x_input_tail_length = 0;
	this.yy.x_allowed_separator = separator;
	this.yy.reset();

	try {

		this.yy.is_parsing = true;
		this._parse(config_ref.input);

	} finally {

		this.yy.is_parsing = false;

	}

	config_ref.tail_length = this.lexer.x_input_tail_length;
	return this.yy.x_arguments;

};

/**
 * Parse expressions, which are followed by a closing brace (and anything after it).
 * Stores the length of unparsed content in `config_ref.tail_length`
 * @param {{input: string, tail_length: number}} config_ref
 * @param {Lava.ExpressionParser.SEPARATORS} separator
 * @returns {Array.<_cArgument>}
 */
Lava.ExpressionParser.parseWithTail = function(config_ref, separator) {
	return this.yy.convertArguments(this.parseWithTailRaw(config_ref, separator));
};

/**
 * Parse expression which represents a single path,
 * like <str>"$my_widget.something.otherthing"</str> or <str>"$my_widget.something[name]"</str>
 *
 * @param {string} input Expression source
 * @returns {_cScopeLocator}
 */
Lava.ExpressionParser.parseScopeEval = function(input) {

	var raw_arguments = this.parseRaw(input);
	if (Lava.schema.DEBUG && (raw_arguments.length != 1 || !raw_arguments[0].flags || !raw_arguments[0].flags.isScopeEval)) Lava.t('parseScopeEval: malformed scope path');
	return raw_arguments[0].binds[0];

};

Lava.ExpressionParser.yy = {

	is_parsing: false,
	x_arguments: null,
	x_argument_binds: null,
	x_argument_widget_modifiers: null,
	x_argument_active_modifiers: null,
	x_allowed_separator: null,

	x_counters: {
		modifiers: 0,
		active_modifiers: 0,
		operands: 0,
		expression_tails: 0,
		braces: 0,
		literals: 0,
		numbers: 0,
		strings: 0,
		dynamic_scopes: 0
	},

	unescape: function(string) {
		return Firestorm.String.unescape(string);
	},

	reset: function() {
		// must reset everything, cause in case of parsing exception the parser will be left broken
		this.x_argument_binds = [];
		this.x_argument_widget_modifiers = [];
		this.x_argument_active_modifiers = [];
		this.x_arguments = [];
	},

	resetCounters: function() {
		this.x_counters.global_modifiers = 0;
		this.x_counters.widget_modifiers = 0;
		this.x_counters.active_modifiers = 0;
		this.x_counters.operands = 0;
		this.x_counters.expression_tails = 0;
		this.x_counters.braces = 0;
		this.x_counters.literals = 0;
		this.x_counters.numbers = 0;
		this.x_counters.strings = 0;
		this.x_counters.dynamic_scopes = 0;
	},

	finishArgument: function(evaluator_src) {
		var result = {
				evaluator_src: evaluator_src
			},
			flags = {};
		if (this.x_argument_binds.length) result.binds = this.x_argument_binds;
		if (this.x_argument_widget_modifiers.length) result.modifiers = this.x_argument_widget_modifiers;
		if (this.x_argument_active_modifiers.length) result.active_modifiers = this.x_argument_active_modifiers;

		if (this.x_counters.global_modifiers > 0) flags.hasGlobalModifiers = true;
		if (this.x_argument_binds.length == 1
			&& this.x_counters.operands == 1
			&& this.x_counters.expression_tails == 0
			&& this.x_counters.braces == 0
			&& this.x_counters.dynamic_scopes == 0
		) {
			flags.isScopeEval = true;
		}
		if (this.x_argument_binds.length == 0 && this.x_counters.active_modifiers == 0) {
			flags.isStatic = true;
			if (this.x_counters.literals == 1 && this.x_counters.operands == 1) flags.isLiteral = true;
			if (this.x_counters.numbers == 1 && this.x_counters.operands == 1) flags.isNumber = true;
			if (this.x_counters.strings == 1 && this.x_counters.operands == 1) flags.isString = true;
		}

		if (!Firestorm.Object.isEmpty(flags)) result.flags = flags;
		this.x_arguments.push(result);

		this.x_argument_binds = [];
		this.x_argument_widget_modifiers = [];
		this.x_argument_active_modifiers = [];
		this.resetCounters();
	},

	/**
	 * @param {Array.<_cRawArgument>} raw_arguments
	 * @returns {Array.<_cArgument>}
	 */
	convertArguments: function(raw_arguments) {

		var i = 0,
			count = raw_arguments.length,
			result = [];

		for (; i < count; i++) {
			result.push(this.convertArgument(raw_arguments[i]))
		}

		return result;

	},

	/**
	 * @param {_cRawArgument} raw_argument
	 * @returns {_cArgument}
	 */
	convertArgument: function(raw_argument) {

		var src = "return (" + raw_argument.evaluator_src + ");",
			result = {
				evaluator: new Function(src)
			};

		if ('flags' in raw_argument) result.flags = raw_argument.flags;
		if ('binds' in raw_argument) result.binds = raw_argument.binds;
		if ('modifiers' in raw_argument) result.modifiers = raw_argument.modifiers;
		if ('active_modifiers' in raw_argument) result.active_modifiers = raw_argument.active_modifiers;

		return result;

	},

	assertSemicolonAllowed: function() {

		if (this.x_allowed_separator == null) Lava.t("ExpressionParser: semicolon encountered, but separator is not set");
		if (this.x_allowed_separator != Lava.ExpressionParser.SEPARATORS.SEMICOLON) Lava.t("ExpressionParser: comma is not allowed as separator here");

	},

	assertCommaAllowed: function() {

		if (this.x_allowed_separator == null) Lava.t("ExpressionParser: comma encountered, but separator is not set");
		if (this.x_allowed_separator != Lava.ExpressionParser.SEPARATORS.COMMA) Lava.t("ExpressionParser: semicolon is not allowed as separator here");

	}

};
/* parser generated by jison 0.4.4 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
Lava.TemplateParser = (function(){
var parser = {trace: function trace(){},
yy: {},
symbols_: {"error":2,"root":3,"EOF":4,"blocks":5,"block":6,"CONTENT":7,"INCLUDE":8,"EXPRESSION_BLOCK_N":9,"EXPRESSION_BLOCK_E":10,"blockStart":11,"BLOCK_END":12,"elsePart":13,"selfClosingTag":14,"tagStart":15,"TAG_END":16,"SCRIPT_CONTENT":17,"SWITCH_ON":18,"SWITCH_OFF":19,"OPEN_BLOCK":20,"blockInit":21,"BLOCK_CLOSE":22,"blockHash":23,"DYNAMIC_BLOCK_INIT":24,"EMPTY_ARGS":25,"EXPORT_ARGUMENTS":26,"BLOCK_INIT":27,"blockHashSegment":28,"IDENTIFIER":29,"HASH_ASSIGN":30,"STRING":31,"elseifChain":32,"BLOCK_ELSE":33,"blockElseif":34,"OPEN_ELSEIF":35,"TAG_OPEN":36,"TAG_END_CLOSE":37,"htmlHash":38,"TAG_CLOSE":39,"htmlHashSegment":40,"HASH_ATTRIBUTE":41,"UNESCAPED_HASH_ASSIGN":42,"$accept":0,"$end":1},
terminals_: {2:"error",4:"EOF",7:"CONTENT",8:"INCLUDE",9:"EXPRESSION_BLOCK_N",10:"EXPRESSION_BLOCK_E",12:"BLOCK_END",16:"TAG_END",17:"SCRIPT_CONTENT",18:"SWITCH_ON",19:"SWITCH_OFF",20:"OPEN_BLOCK",22:"BLOCK_CLOSE",24:"DYNAMIC_BLOCK_INIT",25:"EMPTY_ARGS",26:"EXPORT_ARGUMENTS",27:"BLOCK_INIT",29:"IDENTIFIER",30:"HASH_ASSIGN",31:"STRING",33:"BLOCK_ELSE",35:"OPEN_ELSEIF",36:"TAG_OPEN",37:"TAG_END_CLOSE",39:"TAG_CLOSE",41:"HASH_ATTRIBUTE",42:"UNESCAPED_HASH_ASSIGN"},
productions_: [0,[3,1],[3,2],[5,2],[5,1],[6,1],[6,1],[6,1],[6,1],[6,2],[6,3],[6,3],[6,4],[6,1],[6,2],[6,2],[6,3],[6,1],[6,1],[11,3],[11,4],[21,2],[21,2],[21,2],[21,2],[23,2],[23,1],[28,1],[28,2],[28,2],[13,3],[13,2],[13,1],[13,2],[13,1],[32,3],[32,2],[32,2],[32,1],[34,3],[14,2],[14,3],[15,2],[15,3],[38,2],[38,1],[40,1],[40,1],[40,2]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */
/**/) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1: return []; 
break;
case 2: return $$[$0-1]; 
break;
case 3:
			this.$ = $$[$0-1];
			if ($$[$0]) {
				// inline fragments
				if ($$[$0].name == 'script' && $$[$0].type == 'tag' && $$[$0].attributes && $$[$0].attributes.type == 'lava/fragment') {
					this.$ = $$[$0].content ? $$[$0-1].concat($$[$0].content) : $$[$0-1];
				} else if (typeof($$[$0]) == 'string' && this.$.length && typeof(this.$[this.$.length-1]) == 'string') {
					this.$[this.$.length-1] += $$[$0];
				} else {
					this.$.push($$[$0]);
				}
			}
		
break;
case 4:
			if ($$[$0]) {
				if ($$[$0].name == 'script' && $$[$0].type == 'tag' && $$[$0].attributes && $$[$0].attributes.type == 'lava/fragment') {
					this.$ = $$[$0].content || [];
				} else {
					this.$ = [$$[$0]];
				}
			} else {
				this.$ = [];
			}
		
break;
case 5:
			//this.$ = yy.preserve_whitespace ? $$[$0] : $$[$0].trim();
			this.$ = $$[$0];
		
break;
case 6:
			var targets = Lava.parsers.Common.parseTargets($$[$0]);
			if (targets.length != 1) Lava.t("Malformed include");
			targets[0].type = 'include';
			this.$ = targets[0];
		
break;
case 7:
			this.$ = {
				type: 'expression',
				prefix: $$[$0][1],
				arguments: Lava.ExpressionParser.parse(yytext.substr(3, yyleng - 4))
			};
		
break;
case 8:
			this.$ = {
				type: 'expression',
				prefix: $$[$0][1],
				arguments: Lava.ExpressionParser.parse(yytext.substr(6, yyleng - 7))
			};
		
break;
case 9:
			if ($$[$0-1].name != $$[$0]) Lava.t('End block ("' + $$[$0] + '") does not match the start block ("' + $$[$0-1].name + '") (1)');
			this.$ = $$[$0-1];
		
break;
case 10:
			if ($$[$0-2].name != $$[$0]) Lava.t('End block ("' + $$[$0] + '") does not match the start block ("' + $$[$0-2].name + '") (2)');
			$$[$0-2].content = $$[$0-1];
			this.$ = $$[$0-2];
		
break;
case 11:
			if ($$[$0-2].name != $$[$0]) Lava.t('End block ("' + $$[$0] + '") does not match the start block ("' + $$[$0-2].name + '") (3)');
			if ('elseif_arguments' in $$[$0-1]) {
				$$[$0-2].elseif_arguments = $$[$0-1].elseif_arguments;
				$$[$0-2].elseif_content = $$[$0-1].elseif_content;
			}
			if ('else_content' in $$[$0-1]) $$[$0-2].else_content = $$[$0-1].else_content;
			this.$ = $$[$0-2];
		
break;
case 12:
			if ($$[$0-3].name != $$[$0]) Lava.t('End block ("' + $$[$0] + '") does not match the start block ("' + $$[$0-3].name + '") (4)');
			$$[$0-3].content = $$[$0-2];
			if ('elseif_arguments' in $$[$0-1]) {
				$$[$0-3].elseif_arguments = $$[$0-1].elseif_arguments;
				$$[$0-3].elseif_content = $$[$0-1].elseif_content;
			}
			if ('else_content' in $$[$0-1]) $$[$0-3].else_content = $$[$0-1].else_content;
			this.$ = $$[$0-3];
		
break;
case 13:
			this.$ = $$[$0];
		
break;
case 14:
			yy.validateTagEnd($$[$0-1], $$[$0]);
			this.$ = $$[$0-1];
		
break;
case 15:
			this.$ = $$[$0-1];
			if ($$[$0-1].name == 'script' && $$[$0-1].x && ('equiv' in $$[$0-1].x)) {
				if (!$$[$0-1].x.equiv) Lava.t('empty x:equiv');
				this.$ = yy.parseRawTag($$[$0-1].x.equiv); // sets name and type (it may be directive)
				delete $$[$0-1].x.equiv;
				if (!Firestorm.Object.isEmpty($$[$0-1].x)) {
					this.$.x = Firestorm.Object.copy($$[$0-1].x);
				}
				if ('attributes' in $$[$0-1]) this.$.attributes = $$[$0-1].attributes;
			}
			this.$.content = [$$[$0]];
		
break;
case 16:
			yy.validateTagEnd($$[$0-2], $$[$0]);
			$$[$0-2].content = $$[$0-1];
			this.$ = $$[$0-2];
			if (Lava.isVoidTag(this.$.name)) Lava.t("Void tag with content: " + this.$.name);
		
break;
case 17:
			if ($$[$0] == 'preserve_whitespace') {
				if (yy.preserve_whitespace) Lava.t("Switch {pre:} is already active");
				yy.preserve_whitespace = true;
			} else {
				Lava.t("Parser error: lexer returned unknown switch: " + $$[$0]);
			}
			this.$ = null;
		
break;
case 18:
			if ($$[$0] == 'preserve_whitespace') {
				if (!yy.preserve_whitespace) Lava.t("Trying to turn off inactive switch: {:pre}");
				yy.preserve_whitespace = false;
			} else {
				Lava.t("Parser error: lexer returned unknown switch: " + $$[$0]);
			}
			this.$ = null;
		
break;
case 19:
			this.$ = $$[$0-1];
			this.$.prefix = $$[$0-2][1]; // '$' or '#'
		
break;
case 20:
			this.$ = $$[$0-2];
			this.$.prefix = $$[$0-3][1]; // '$' or '#'
			this.$.hash = $$[$0-1];
		
break;
case 21:
			this.$ = {type:'block'};
			yy.parseDynamicBlockInit(this.$, $$[$0-1].substr(1)); // substr to cut the colon before locator
		
break;
case 22:
			this.$ = {type:'block'};
			yy.parseDynamicBlockInit(this.$, $$[$0-1].substr(1)); // substr to cut the colon before locator
			this.$.arguments = yy.lexer.x_export_arguments;
			yy.lexer.x_export_arguments = null;
		
break;
case 23:
			this.$ = {
				type:'block',
				name: $$[$0-1]
			};
		
break;
case 24:
			this.$ = {
				type:'block',
				name: $$[$0-1]
			};
			this.$.arguments = yy.lexer.x_export_arguments;
			yy.lexer.x_export_arguments = null;
		
break;
case 25:
			if ($$[$0].name in $$[$0-1]) Lava.t('Duplicate attribute in block definition: ' + $$[$0].name);
			$$[$0-1][$$[$0].name] = $$[$0].value;
			this.$ = $$[$0-1];
		
break;
case 26: this.$ = {}; this.$[$$[$0].name] = $$[$0].value; 
break;
case 27: this.$ = {name:$$[$0], value:true}; 
break;
case 28:
			var literals = Lava.parsers.Common.LITERALS;
			if ($$[$0] in literals) {
				$$[$0] = literals[$$[$0]];
			}
			this.$ = {name:$$[$0-1], value:$$[$0]};
		
break;
case 29: this.$ = {name:$$[$0-1], value:$$[$0]}; 
break;
case 30:
			$$[$0-2].else_content = $$[$0];
			this.$ = $$[$0-2];
		
break;
case 31:
			$$[$0-1].else_content = [];
			this.$ = $$[$0-1];
		
break;
case 32:
			this.$ = $$[$0];
		
break;
case 33:
			this.$ = {else_content: $$[$0]};
		
break;
case 34:
			this.$ = {else_content: []};
		
break;
case 35:
			$$[$0-2].elseif_arguments.push($$[$0-1]);
			$$[$0-2].elseif_content.push($$[$0]);
			this.$ = $$[$0-2];
		
break;
case 36:
			$$[$0-1].elseif_arguments.push($$[$0]);
			$$[$0-1].elseif_content.push([]);
			this.$ = $$[$0-1];
		
break;
case 37:
			this.$ = {
				elseif_arguments: [$$[$0-1]],
				elseif_content: [$$[$0]]
			};
		
break;
case 38:
			this.$ = {
				elseif_arguments: [$$[$0]],
				elseif_content: [[]]
			};
		
break;
case 39:
			var args = yy.lexer.x_export_arguments;
			if (args.length != 1) Lava.t('Elseif block requires exactly one argument');
			this.$ = args[0];
			yy.lexer.x_export_arguments = null;
		
break;
case 40:
			if ($$[$0-1] != $$[$0-1].toLowerCase()) Lava.t("Tag names must be lower case: " + $$[$0-1]);
			this.$ = yy.parseRawTag($$[$0-1]);
		
break;
case 41:
			if ($$[$0-2] != $$[$0-2].toLowerCase()) Lava.t("Tag names must be lower case: " + $$[$0-2]);
			this.$ = yy.parseRawTag($$[$0-2], $$[$0-1]);
		
break;
case 42:
			if ($$[$0-1] != $$[$0-1].toLowerCase()) Lava.t("Tag names must be lower case: " + $$[$0-1]);
			this.$ = yy.parseRawTag($$[$0-1]);
		
break;
case 43:
			if ($$[$0-2] != $$[$0-2].toLowerCase()) Lava.t("Tag names must be lower case: " + $$[$0-2]);
			this.$ = yy.parseRawTag($$[$0-2], $$[$0-1]);
		
break;
case 44: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 45: this.$ = [$$[$0]]; 
break;
case 46: this.$ = {name:$$[$0], value: ''}; // behaviour of innerHTML 
break;
case 47:
			var parts = $$[$0].split('=');
			this.$ = {name:parts[0], value:parts[1]};
		
break;
case 48: this.$ = {name:$$[$0-1], value:$$[$0]}; 
break;
}
},
table: [{3:1,4:[1,2],5:3,6:4,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,14:10,15:11,18:[1,12],19:[1,13],20:[1,14],36:[1,15]},{1:[3]},{1:[2,1]},{4:[1,16],6:17,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,14:10,15:11,18:[1,12],19:[1,13],20:[1,14],36:[1,15]},{4:[2,4],7:[2,4],8:[2,4],9:[2,4],10:[2,4],12:[2,4],16:[2,4],18:[2,4],19:[2,4],20:[2,4],33:[2,4],35:[2,4],36:[2,4]},{4:[2,5],7:[2,5],8:[2,5],9:[2,5],10:[2,5],12:[2,5],16:[2,5],18:[2,5],19:[2,5],20:[2,5],33:[2,5],35:[2,5],36:[2,5]},{4:[2,6],7:[2,6],8:[2,6],9:[2,6],10:[2,6],12:[2,6],16:[2,6],18:[2,6],19:[2,6],20:[2,6],33:[2,6],35:[2,6],36:[2,6]},{4:[2,7],7:[2,7],8:[2,7],9:[2,7],10:[2,7],12:[2,7],16:[2,7],18:[2,7],19:[2,7],20:[2,7],33:[2,7],35:[2,7],36:[2,7]},{4:[2,8],7:[2,8],8:[2,8],9:[2,8],10:[2,8],12:[2,8],16:[2,8],18:[2,8],19:[2,8],20:[2,8],33:[2,8],35:[2,8],36:[2,8]},{5:19,6:4,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,12:[1,18],13:20,14:10,15:11,18:[1,12],19:[1,13],20:[1,14],32:21,33:[1,22],34:23,35:[1,24],36:[1,15]},{4:[2,13],7:[2,13],8:[2,13],9:[2,13],10:[2,13],12:[2,13],16:[2,13],18:[2,13],19:[2,13],20:[2,13],33:[2,13],35:[2,13],36:[2,13]},{5:27,6:4,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,14:10,15:11,16:[1,25],17:[1,26],18:[1,12],19:[1,13],20:[1,14],36:[1,15]},{4:[2,17],7:[2,17],8:[2,17],9:[2,17],10:[2,17],12:[2,17],16:[2,17],18:[2,17],19:[2,17],20:[2,17],33:[2,17],35:[2,17],36:[2,17]},{4:[2,18],7:[2,18],8:[2,18],9:[2,18],10:[2,18],12:[2,18],16:[2,18],18:[2,18],19:[2,18],20:[2,18],33:[2,18],35:[2,18],36:[2,18]},{21:28,24:[1,29],27:[1,30]},{30:[1,37],37:[1,31],38:32,39:[1,33],40:34,41:[1,35],42:[1,36]},{1:[2,2]},{4:[2,3],7:[2,3],8:[2,3],9:[2,3],10:[2,3],12:[2,3],16:[2,3],18:[2,3],19:[2,3],20:[2,3],33:[2,3],35:[2,3],36:[2,3]},{4:[2,9],7:[2,9],8:[2,9],9:[2,9],10:[2,9],12:[2,9],16:[2,9],18:[2,9],19:[2,9],20:[2,9],33:[2,9],35:[2,9],36:[2,9]},{6:17,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,12:[1,38],13:39,14:10,15:11,18:[1,12],19:[1,13],20:[1,14],32:21,33:[1,22],34:23,35:[1,24],36:[1,15]},{12:[1,40]},{12:[2,32],33:[1,41],34:42,35:[1,24]},{5:43,6:4,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,12:[2,34],14:10,15:11,18:[1,12],19:[1,13],20:[1,14],36:[1,15]},{5:44,6:4,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,12:[2,38],14:10,15:11,18:[1,12],19:[1,13],20:[1,14],33:[2,38],35:[2,38],36:[1,15]},{26:[1,45]},{4:[2,14],7:[2,14],8:[2,14],9:[2,14],10:[2,14],12:[2,14],16:[2,14],18:[2,14],19:[2,14],20:[2,14],33:[2,14],35:[2,14],36:[2,14]},{4:[2,15],7:[2,15],8:[2,15],9:[2,15],10:[2,15],12:[2,15],16:[2,15],18:[2,15],19:[2,15],20:[2,15],33:[2,15],35:[2,15],36:[2,15]},{6:17,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,14:10,15:11,16:[1,46],18:[1,12],19:[1,13],20:[1,14],36:[1,15]},{22:[1,47],23:48,28:49,29:[1,50],30:[1,51]},{25:[1,52],26:[1,53]},{25:[1,54],26:[1,55]},{4:[2,40],7:[2,40],8:[2,40],9:[2,40],10:[2,40],12:[2,40],16:[2,40],18:[2,40],19:[2,40],20:[2,40],33:[2,40],35:[2,40],36:[2,40]},{30:[1,37],37:[1,56],39:[1,57],40:58,41:[1,35],42:[1,36]},{7:[2,42],8:[2,42],9:[2,42],10:[2,42],16:[2,42],17:[2,42],18:[2,42],19:[2,42],20:[2,42],36:[2,42]},{30:[2,45],37:[2,45],39:[2,45],41:[2,45],42:[2,45]},{30:[2,46],37:[2,46],39:[2,46],41:[2,46],42:[2,46]},{30:[2,47],37:[2,47],39:[2,47],41:[2,47],42:[2,47]},{31:[1,59]},{4:[2,10],7:[2,10],8:[2,10],9:[2,10],10:[2,10],12:[2,10],16:[2,10],18:[2,10],19:[2,10],20:[2,10],33:[2,10],35:[2,10],36:[2,10]},{12:[1,60]},{4:[2,11],7:[2,11],8:[2,11],9:[2,11],10:[2,11],12:[2,11],16:[2,11],18:[2,11],19:[2,11],20:[2,11],33:[2,11],35:[2,11],36:[2,11]},{5:61,6:4,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,12:[2,31],14:10,15:11,18:[1,12],19:[1,13],20:[1,14],36:[1,15]},{5:62,6:4,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,12:[2,36],14:10,15:11,18:[1,12],19:[1,13],20:[1,14],33:[2,36],35:[2,36],36:[1,15]},{6:17,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,12:[2,33],14:10,15:11,18:[1,12],19:[1,13],20:[1,14],36:[1,15]},{6:17,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,12:[2,37],14:10,15:11,18:[1,12],19:[1,13],20:[1,14],33:[2,37],35:[2,37],36:[1,15]},{22:[1,63]},{4:[2,16],7:[2,16],8:[2,16],9:[2,16],10:[2,16],12:[2,16],16:[2,16],18:[2,16],19:[2,16],20:[2,16],33:[2,16],35:[2,16],36:[2,16]},{7:[2,19],8:[2,19],9:[2,19],10:[2,19],12:[2,19],18:[2,19],19:[2,19],20:[2,19],33:[2,19],35:[2,19],36:[2,19]},{22:[1,64],28:65,29:[1,50],30:[1,51]},{22:[2,26],29:[2,26],30:[2,26]},{22:[2,27],29:[2,27],30:[2,27]},{29:[1,66],31:[1,67]},{22:[2,21],29:[2,21],30:[2,21]},{22:[2,22],29:[2,22],30:[2,22]},{22:[2,23],29:[2,23],30:[2,23]},{22:[2,24],29:[2,24],30:[2,24]},{4:[2,41],7:[2,41],8:[2,41],9:[2,41],10:[2,41],12:[2,41],16:[2,41],18:[2,41],19:[2,41],20:[2,41],33:[2,41],35:[2,41],36:[2,41]},{7:[2,43],8:[2,43],9:[2,43],10:[2,43],16:[2,43],17:[2,43],18:[2,43],19:[2,43],20:[2,43],36:[2,43]},{30:[2,44],37:[2,44],39:[2,44],41:[2,44],42:[2,44]},{30:[2,48],37:[2,48],39:[2,48],41:[2,48],42:[2,48]},{4:[2,12],7:[2,12],8:[2,12],9:[2,12],10:[2,12],12:[2,12],16:[2,12],18:[2,12],19:[2,12],20:[2,12],33:[2,12],35:[2,12],36:[2,12]},{6:17,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,12:[2,30],14:10,15:11,18:[1,12],19:[1,13],20:[1,14],36:[1,15]},{6:17,7:[1,5],8:[1,6],9:[1,7],10:[1,8],11:9,12:[2,35],14:10,15:11,18:[1,12],19:[1,13],20:[1,14],33:[2,35],35:[2,35],36:[1,15]},{7:[2,39],8:[2,39],9:[2,39],10:[2,39],12:[2,39],18:[2,39],19:[2,39],20:[2,39],33:[2,39],35:[2,39],36:[2,39]},{7:[2,20],8:[2,20],9:[2,20],10:[2,20],12:[2,20],18:[2,20],19:[2,20],20:[2,20],33:[2,20],35:[2,20],36:[2,20]},{22:[2,25],29:[2,25],30:[2,25]},{22:[2,28],29:[2,28],30:[2,28]},{22:[2,29],29:[2,29],30:[2,29]}],
defaultActions: {2:[2,1],16:[2,2]},
parseError: function parseError(str,hash){if(hash.recoverable){this.trace(str)}else{throw new Error(str)}},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == 'undefined') {
        this.lexer.yylloc = {};
    }
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === 'function') {
        this.parseError = this.yy.parseError;
    } else {
        this.parseError = (Object.getPrototypeOf ? Object.getPrototypeOf(this) : this.__proto__).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || EOF;
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + this.lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: this.lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: this.lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
/* generated by jison-lex 0.2.0 */
var lexer = (function(){
var lexer = {

EOF:1,

parseError:function parseError(str,hash){if(this.yy.parser){this.yy.parser.parseError(str,hash)}else{throw new Error(str)}},

// resets the lexer, sets new input
setInput:function (input){this._input=input;this._more=this._backtrack=this.done=false;this.yylineno=this.yyleng=0;this.yytext=this.matched=this.match="";this.conditionStack=["INITIAL"];this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0};if(this.options.ranges){this.yylloc.range=[0,0]}this.offset=0;return this},

// consumes and returns one char from the input
input:function (){var ch=this._input[0];this.yytext+=ch;this.yyleng++;this.offset++;this.match+=ch;this.matched+=ch;var lines=ch.match(/(?:\r\n?|\n).*/g);if(lines){this.yylineno++;this.yylloc.last_line++}else{this.yylloc.last_column++}if(this.options.ranges){this.yylloc.range[1]++}this._input=this._input.slice(1);return ch},

// unshifts one char (or a string) into the input
unput:function (ch){var len=ch.length;var lines=ch.split(/(?:\r\n?|\n)/g);this._input=ch+this._input;this.yytext=this.yytext.substr(0,this.yytext.length-len-1);this.offset-=len;var oldLines=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1);this.matched=this.matched.substr(0,this.matched.length-1);if(lines.length-1){this.yylineno-=lines.length-1}var r=this.yylloc.range;this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:lines?(lines.length===oldLines.length?this.yylloc.first_column:0)+oldLines[oldLines.length-lines.length].length-lines[0].length:this.yylloc.first_column-len};if(this.options.ranges){this.yylloc.range=[r[0],r[0]+this.yyleng-len]
}this.yyleng=this.yytext.length;return this},

// When called from action, caches matched text and appends it on next action
more:function (){this._more=true;return this},

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function (){if(this.options.backtrack_lexer){this._backtrack=true}else{return this.parseError("Lexical error on line "+(this.yylineno+1)+". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})}return this},

// retain first n characters of the match
less:function (n){this.unput(this.match.slice(n))},

// displays already matched input, i.e. for error messages
pastInput:function (){var past=this.matched.substr(0,this.matched.length-this.match.length);return(past.length>20?"...":"")+past.substr(-20).replace(/\n/g,"")},

// displays upcoming input, i.e. for error messages
upcomingInput:function (){var next=this.match;if(next.length<20){next+=this._input.substr(0,20-next.length)}return(next.substr(0,20)+(next.length>20?"...":"")).replace(/\n/g,"")},

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function (){var pre=this.pastInput();var c=new Array(pre.length+1).join("-");return pre+this.upcomingInput()+"\n"+c+"^"},

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match,indexed_rule){var token,lines,backup;if(this.options.backtrack_lexer){backup={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done};if(this.options.ranges){backup.yylloc.range=this.yylloc.range.slice(0)}}lines=match[0].match(/(?:\r\n?|\n).*/g);if(lines){this.yylineno+=lines.length}this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:lines?lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+match[0].length};this.yytext+=match[0];this.match+=match[0];this.matches=match;this.yyleng=this.yytext.length;if(this.options.ranges){this.yylloc.range=[this.offset,this.offset+=this.yyleng]}this._more=false;this._backtrack=false;this._input=this._input.slice(match[0].length);this.matched+=match[0];token=this.performAction.call(this,this.yy,this,indexed_rule,this.conditionStack[this.conditionStack.length-1]);if(this.done&&this._input){this.done=false}if(token){if(this.options.backtrack_lexer){delete backup}return token}else if(this._backtrack){for(var k in backup){this[k]=backup[k]}return false}if(this.options.backtrack_lexer){delete backup}return false},

// return next match in input
next:function (){if(this.done){return this.EOF}if(!this._input){this.done=true}var token,match,tempMatch,index;if(!this._more){this.yytext="";this.match=""}var rules=this._currentRules();for(var i=0;i<rules.length;i++){tempMatch=this._input.match(this.rules[rules[i]]);if(tempMatch&&(!match||tempMatch[0].length>match[0].length)){match=tempMatch;index=i;if(this.options.backtrack_lexer){token=this.test_match(tempMatch,rules[i]);if(token!==false){return token}else if(this._backtrack){match=false;continue}else{return false}}else if(!this.options.flex){break}}}if(match){token=this.test_match(match,rules[index]);if(token!==false){return token}return false}if(this._input===""){return this.EOF}else{return this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})}},

// return next match that has a token
lex:function lex(){var r=this.next();if(r){return r}else{return this.lex()}},

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition){this.conditionStack.push(condition)},

// pop the previously active lexer condition state off the condition stack
popState:function popState(){var n=this.conditionStack.length-1;if(n>0){return this.conditionStack.pop()}else{return this.conditionStack[0]}},

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules(){if(this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]){return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules}else{return this.conditions["INITIAL"].rules}},

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n){n=this.conditionStack.length-1-Math.abs(n||0);if(n>=0){return this.conditionStack[n]}else{return"INITIAL"}},

// alias for begin(condition)
pushState:function pushState(condition){this.begin(condition)},

// return the number of states currently on the stack
stateStackSize:function stateStackSize(){return this.conditionStack.length},
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START
/**/) {

var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:
		if (this._input.length) {
			if (this._input[0] == '<') {
				if (this.x_pure_blocks_mode) {
					this.begin("skipTag");
				} else {
					this.begin("tag");
				}
			} else if (['#','$','/','>','*','&'].indexOf(this._input[1]) !== -1) {
				this.begin("block");
			} else if (this._input.substr(0, 6) == '{else}' || this._input.substr(0, 7) == '{elseif') { // } <- comment for Jison
				this.begin("block");
			} else {
				this.begin("switch");
			}
		}
		if(yy_.yytext) return 7;
	
break;
case 1: return 7; 
break;
case 2: this.popState(); return 7; 
break;
case 3: this.popState(); yy_.yytext = yy_.yytext.substr(2, yy_.yyleng - 3); return 8; 
break;
case 4: this.popState(); yy_.yytext = yy_.yytext.substr(5, yy_.yyleng - 6); return 8; // escaped variant 
break;
case 5: this.popState(); return 33; 
break;
case 6: this.popState(); yy_.yytext = yy_.yytext.substr(2, yy_.yyleng - 3); return 12; 
break;
case 7: this.popState(); /* yy_.yytext = yy_.yytext.substr(2, yy_.yyleng - 4); return 'COMMENT'; */ 
break;
case 8: this.popState(); return 9; // normal 
break;
case 9: this.popState(); return 10; // escaped 
break;
case 10: Lava.t('Spaces between block opening tag and block name are not allowed'); 
break;
case 11: Lava.t('Spaces between block name and opening brace are not allowed'); 
break;
case 12: return 20; 
break;
case 13: return 35; 
break;
case 14: return 24; 
break;
case 15: return 27; 
break;
case 16:
		this.popState(); // block
		this.begin('blockHash');
		return 25;
	
break;
case 17:
		var config_ref = {
			input: this._input,
			tail_length: 0
		};
		this.x_export_arguments = Lava.ExpressionParser.parseWithTail(config_ref);
		this._input = this._input.substr(this._input.length - config_ref.tail_length);
		// { <- comment for Jison
		if (!(/(\s|\})/.test(this._input[0]))) Lava.t('Lex: arguments closing brace must be followed by whitespace or CLOSE_CURLY');
		this.popState(); // block
		this.begin('blockHash');
		return 26;
	
break;
case 18: yy_.yytext = yy_.yytext.substr(0,yy_.yyleng-1); return 30; 
break;
case 19: return 29; 
break;
case 20: yy_.yytext = Lava.parsers.Common.unquoteString(yy_.yytext); return 31; 
break;
case 21: yy_.yytext = Lava.parsers.Common.unquoteString(yy_.yytext); return 31; 
break;
case 22: this.popState(); return 22; 
break;
case 23: 
break;
case 24: this.popState(); return 7; 
break;
case 25: this.popState(); return 7; 
break;
case 26: this.popState(); yy_.yytext = yy_.yytext.substr(2,yy_.yyleng-3).toLowerCase(); return 16; 
break;
case 27:
		yy_.yytext = yy_.yytext.substr(1).trim().toLowerCase();
		this.yy.x_lexer_tag_name = yy_.yytext;
		this.yy.x_lexer_is_fragment = false;
		if (yy_.yytext == 'script') {
			var index = this._input.indexOf('>');
			if (index == -1) Lava.t("Lexical error: malformed script tag");
			var attributes_string = this._input.substr(0, index);
			if (/type=(\'|\")lava\/fragment(\'|\")/.test(attributes_string)) {
				this.yy.x_lexer_is_fragment = true;
			}
		}
		return 36;
	
break;
case 28:
		var tag_name = this.yy.x_lexer_tag_name;
		this.yy.x_lexer_tag_name = null;
		this.popState();
		if (!this.yy.x_lexer_is_fragment && (tag_name == 'script' || tag_name == 'style')) {
			this.begin(tag_name == 'script' ? 'eatScript' : 'eatStyle');
		} else if (Lava.isVoidTag(tag_name)) {
			return 37; // in html5 browser returns void tags as unclosed
		}
		return 39;
	
break;
case 29:
		this.yy.x_lexer_tag_name = null;
		this.popState();
		return 37;
	
break;
case 30: yy_.yytext = yy_.yytext.trim(); return 41; 
break;
case 31: return 41; 
break;
case 32: yy_.yytext = yy_.yytext.substr(0,yy_.yyleng-1); return 30; 
break;
case 33: yy_.yytext = yy_.yytext.trim(); return 42; 
break;
case 34: yy_.yytext = Lava.parsers.Common.unquoteString(yy_.yytext); return 31; 
break;
case 35: yy_.yytext = Lava.parsers.Common.unquoteString(yy_.yytext); return 31; 
break;
case 36: 
break;
case 37: this.popState(); yy_.yytext = yy_.yytext.substr(0,yy_.yyleng-9); return 17; 
break;
case 38: this.popState(); yy_.yytext = yy_.yytext.substr(0,yy_.yyleng-8); return 17; 
break;
case 39:
		var _map = {
			L: '{', // comment for Jison is not needed (closing brace is below)
			R: '}',
			LT: '<',
			GT: '>',
			AMP: '&'
		};
		this.popState();
		yy_.yytext = _map[yy_.yytext.substr(2,yy_.yyleng-4)];
		return 7;
	
break;
case 40:
		this.popState();
		if (yy_.yytext == '{literal:}') {
			this.begin('literal');
		} else if (yy_.yytext == '{pure_blocks:}') {
			if (this.x_pure_blocks_mode) Lava.t('Lexer switch: "{pure_blocks:}" mode is already enabled');
			this.x_pure_blocks_mode = true;
		} else if (yy_.yytext == '{pre:}') {
			yy_.yytext = 'preserve_whitespace';
			return 18;
		} else {
			Lava.t('Unknown switch: ' + yy_.yytext);
		}
	
break;
case 41:
		this.popState();
		if (yy_.yytext == '{:pure_blocks}') {
			if (!this.x_pure_blocks_mode) Lava.t('Redundant lexer switch "{:pure_blocks}"');
			this.x_pure_blocks_mode = false;
		} else if (yy_.yytext == '{:pre}') {
			yy_.yytext = 'preserve_whitespace';
			return 19;
		} else {
			Lava.t('Unknown switch: ' + yy_.yytext);
		}
	
break;
case 42: this.popState(); yy_.yytext = yy_.yytext.substr(0, yy_.yyleng-10); return 7; 
break;
case 43: return 4; 
break;
}
},
rules: [/^(?:[^\x00]*?(?=((\{[\#\$\>\*])|{&gt;|(\{\/)|(<([a-zA-Z][a-zA-Z0-9\_\-]*(:[a-zA-Z0-9\_][a-zA-Z0-9\_\-]*)*)\s*)|(<\/([a-zA-Z][a-zA-Z0-9\_\-]*(:[a-zA-Z0-9\_][a-zA-Z0-9\_\-]*)*)>)|(<!--(.|\s)*?-->)|(<!\[CDATA\[(.|\s)*?\]\]>)|\{literal:\}|\{:literal\}|(\{:[LR]:\}|\{:[LG])|\{elseif\s*\(|\{else\})))/,/^(?:[^\x00]+)/,/^(?:<)/,/^(?:\{>[^\}]*\})/,/^(?:\{&gt;[^\}]*\})/,/^(?:\{else\})/,/^(?:\{\/(([a-zA-Z\_][a-zA-Z0-9\_]*)(\/([a-zA-Z\_][a-zA-Z0-9\_]*))*)\})/,/^(?:\{\*([^\*]|\*[^\}])*\*\})/,/^(?:\{(#|\$)>[^\}]+\})/,/^(?:\{(#|\$)&gt;[^\}]+\})/,/^(?:((\{[\#\$\>\*])|{&gt;)\s\b)/,/^(?:((\{[\#\$\>\*])|{&gt;)(([a-zA-Z\_][a-zA-Z0-9\_]*)(\/([a-zA-Z\_][a-zA-Z0-9\_]*))*)\s\()/,/^(?:((\{[\#\$\>\*])|{&gt;))/,/^(?:\{elseif(?=\())/,/^(?::[\$\#\@]([a-zA-Z\_][a-zA-Z0-9\_]*)\/(([a-zA-Z\_][a-zA-Z0-9\_]*)(\/([a-zA-Z\_][a-zA-Z0-9\_]*))*)(?=\())/,/^(?:(([a-zA-Z\_][a-zA-Z0-9\_]*)(\/([a-zA-Z\_][a-zA-Z0-9\_]*))*)(?=\())/,/^(?:\(\s*\))/,/^(?:\()/,/^(?:([a-zA-Z\_][a-zA-Z0-9\_]*)=)/,/^(?:([a-zA-Z\_][a-zA-Z0-9\_]*)(?=[\s\}]))/,/^(?:"([^\\\"]|\\.)*"(?=[\s\}]))/,/^(?:'([^\\\']|\\.)*'(?=[\s\}]))/,/^(?:\s*\})/,/^(?:\s+)/,/^(?:(<!--(.|\s)*?-->))/,/^(?:(<!\[CDATA\[(.|\s)*?\]\]>))/,/^(?:(<\/([a-zA-Z][a-zA-Z0-9\_\-]*(:[a-zA-Z0-9\_][a-zA-Z0-9\_\-]*)*)>))/,/^(?:(<([a-zA-Z][a-zA-Z0-9\_\-]*(:[a-zA-Z0-9\_][a-zA-Z0-9\_\-]*)*)\s*))/,/^(?:>)/,/^(?:\/>)/,/^(?:([a-zA-Z][a-zA-Z0-9\_\-]*(:[a-zA-Z0-9\_][a-zA-Z0-9\_\-]*)*)\s+)/,/^(?:([a-zA-Z][a-zA-Z0-9\_\-]*(:[a-zA-Z0-9\_][a-zA-Z0-9\_\-]*)*)(?=>))/,/^(?:([a-zA-Z][a-zA-Z0-9\_\-]*(:[a-zA-Z0-9\_][a-zA-Z0-9\_\-]*)*)=)/,/^(?:([a-zA-Z][a-zA-Z0-9\_\-]*(:[a-zA-Z0-9\_][a-zA-Z0-9\_\-]*)*)=([a-zA-Z\_][a-zA-Z0-9\_]*)+\s\b)/,/^(?:"([^\\\"]|\\.)*")/,/^(?:'([^\\\']|\\.)*')/,/^(?:\s+)/,/^(?:[\s\S]*?<\/script>)/,/^(?:[\s\S]*?<\/style>)/,/^(?:(\{:[LR]:\}|\{:[LG]))/,/^(?:\{literal:\})/,/^(?:\{:literal\})/,/^(?:[^\x00]*?\{:literal\})/,/^(?:$)/],
conditions: {"block":{"rules":[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],"inclusive":false},"blockHash":{"rules":[18,19,20,21,22,23],"inclusive":false},"tag":{"rules":[24,25,26,27,28,29,30,31,32,33,34,35,36],"inclusive":false},"skipTag":{"rules":[2],"inclusive":false},"switch":{"rules":[39,40,41],"inclusive":false},"literal":{"rules":[42],"inclusive":false},"eatScript":{"rules":[37],"inclusive":false},"eatStyle":{"rules":[38],"inclusive":false},"INITIAL":{"rules":[0,1,43],"inclusive":true}}
};
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();




Lava.TemplateParser._parse = Lava.TemplateParser.parse;

/**
 * Parse and compile a template
 * @param {string} input
 * @param {_cView=} view_config View config for applying directives
 * @returns {_tTemplate}
 */
Lava.TemplateParser.parse = function(input, view_config) {

	return Lava.parsers.Common.compileTemplate(this.parseRaw(input), view_config);

};

/**
 * Parse template, but do not compile
 * @param {string} input
 * @returns {_tRawTemplate}
 */
Lava.TemplateParser.parseRaw = function(input) {

	if (this.yy.is_parsing) Lava.t("Calling TemplateParser.parseRaw() recursively will break the parser. Please, create another instance.");

	var result;

	this.lexer.x_pure_blocks_mode = false;
	this.lexer.x_export_arguments = null;
	this.yy.preserve_whitespace = false;

	try {

		this.yy.is_parsing = true;
		result = this._parse(input);

	} finally {

		this.yy.is_parsing = false;

	}

	return result;

};

Lava.TemplateParser.yy = {

	is_parsing: false,
	/** @const */
	CONTROL_ATTRIBUTE_PREFIX: 'x:',
	preserve_whitespace: false,

	x_lexer_tag_name: null,
	x_lexer_is_fragment: false,

	/**
	 * Filters out attributes starting with 'x:' prefix, and puts them into separate property named 'x'.
	 * Control attributes are split by colon, resulting array is then used as path inside the 'x' object
	 * (similar to class paths)
	 *
	 * @param {{
		 *      attributes: Object.<string, string>,
		 *      x: _cRawX
		 * }} tag_config
	 * @param {Array.<_cRawAttribute>} raw_attributes
	 */
	_parseControlAttributes: function(tag_config, raw_attributes) {

		var i = 0,
			count = raw_attributes.length,
			attribute,
			normalized_path,
			current_object,
			segment_name,
			segments_count,
			name,
			x = {},
			attributes = {};

		for (; i < count; i++) {

			attribute = raw_attributes[i];
			if (attribute.name.indexOf(this.CONTROL_ATTRIBUTE_PREFIX) == 0) {

				current_object = x;
				normalized_path = attribute.name.substr(this.CONTROL_ATTRIBUTE_PREFIX.length).split(':');
				segments_count = normalized_path.length;

				while (segments_count) {

					segments_count--;
					segment_name = normalized_path.shift();

					if (Lava.schema.DEBUG && segment_name == '') Lava.t("Malformed control attribute: " + attribute.name);

					if (segments_count) {

						if (!(segment_name in current_object)) current_object[segment_name] = {};
						current_object = current_object[segment_name];
						if (typeof(current_object) != 'object') Lava.t("Conflicting control attribute: " + attribute.name);

					} else {

						if (segment_name in current_object) Lava.t('Conflicting control attribute: ' + attribute.name);
						current_object[segment_name] = attribute.value;

					}

				}

			} else {

				// reason for second check: IE bug - it can duplicate attributes when serializing a tag
				if (Lava.schema.DEBUG && (attribute.name in attributes) && attributes[attribute.name] != attribute.value) Lava.t('Duplicate attribute on tag: ' + attribute.name);
				attributes[attribute.name] = attribute.value;

			}

		}

		//noinspection LoopStatementThatDoesntLoopJS
		for (name in x) {
			tag_config.x = x;
			break;
		}

		//noinspection LoopStatementThatDoesntLoopJS
		for (name in attributes) {
			tag_config.attributes = attributes;
			break;
		}

	},

	/**
	 * @param {string} tag_name
	 * @param {Array.<_cRawAttribute>=} raw_attributes
	 * @returns {(_cRawTag|_cRawDirective)}
	 */
	parseRawTag: function(tag_name, raw_attributes) {

		var result = {};

		if (raw_attributes) {
			this._parseControlAttributes(result, raw_attributes);
		}

		if (tag_name.indexOf(this.CONTROL_ATTRIBUTE_PREFIX) == 0) {

			result.type = 'directive';
			result.name = tag_name.substr(this.CONTROL_ATTRIBUTE_PREFIX.length);

		} else {

			result.type = 'tag';
			result.name = tag_name;

		}

		return /** @type {(_cRawTag|_cRawDirective)} */ result;

	},

	validateTagEnd: function(start_object, end_name) {

		var start_name = (start_object.type == 'directive')
			? this.CONTROL_ATTRIBUTE_PREFIX + start_object.name
			: start_object.name;

		if (start_name != end_name) Lava.t('End tag ("' + end_name + '") does not match the start tag ("' + start_name + '")');

	},

	parseDynamicBlockInit: function(config, string) {

		var i = string.indexOf('/'),
			name = string.substr(0, i);

		if (Lava.schema.DEBUG && i == -1) Lava.t();
		if (Lava.schema.DEBUG && !(name[0] in Lava.parsers.Common.locator_types)) Lava.t("Malformed class name locator: " + string);

		config.class_locator = {locator_type: Lava.parsers.Common.locator_types[name[0]], name: name.substr(1)};
		config.real_class = string.substr(i);
		config.name = config.real_class.substr(1); // cut the slash to match the end block

		if (Lava.schema.DEBUG && (!config.class_locator.name || !config.class_locator.locator_type)) Lava.t("Malformed class name locator: " + string);

	}

};

/**
 * Field's value has changed in a record instance
 * @event Lava.data.field.Abstract#changed
 * @type {Object}
 * @property {Lava.data.Record} record The record with changed field
 */

Lava.define(
'Lava.data.field.Abstract',
/**
 * Base class for all record fields
 *
 * @lends Lava.data.field.Abstract#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',

	/**
	 * Field's name
	 * @type {string}
	 */
	_name: null,
	/**
	 * Field's module
	 * @type {Lava.data.ModuleAbstract}
	 */
	_module: null,
	/**
	 * Field's config
	 * @type {_cField}
	 */
	_config: null,
	/**
	 * Reference to object from module with properties of all records
	 * @type {Object.<_tGUID, Object>}
	 */
	_properties_by_guid: null,
	/**
	 * May this field be assigned a <kw>null</kw> value
	 * @type {boolean}
	 */
	_is_nullable: false,

	/**
	 * Create the instance of a field
	 * @param {Lava.data.Module} module
	 * @param {string} name Field name
	 * @param {_cField} config
	 * @param {object} module_storage Reference to object from module with properties of all records
	 */
	init: function(module, name, config, module_storage) {

		this._module = module;
		this._name = name;
		this._config = config;
		this._properties_by_guid = module_storage;
		if ('is_nullable' in config) this._is_nullable = config.is_nullable;

	},

	/**
	 * Module calls this method when all field objects are already created,
	 * and passes the object which will become default properties for all records.
	 * Common purpose of this method is to set this field's default value and attach listeners to other fields
	 */
	onModuleFieldsCreated: function(default_properties) {},

	/**
	 * Is the given `value` valid for assignment to this field
	 * @param {*} value
	 * @returns {boolean} True, if value is valid
	 */
	isValidValue: function(value) {

		return typeof(value) != 'undefined' && (value !== null || this._is_nullable);

	},

	/**
	 * Unlike {@link Lava.data.field.Abstract#isValidValue}, this is slow version of validity check,
	 * which returns a message in case the value is invalid
	 * @param {*} value
	 * @returns {?string}
	 */
	getInvalidReason: function(value) {

		var reason = null;

		if (typeof(value) == 'undefined') {

			reason = "Undefined is not a valid value";

		} else if (value == null && !this._is_nullable) {

			reason = "Cannot assign null to non-nullable field";

		}

		return reason;

	},

	/**
	 * Get `_is_nullable`
	 * @returns {boolean}
	 */
	isNullable: function() {

		return this._is_nullable;

	},

	/**
	 * Records are either loaded from existing data, or created with default properties.
	 * Here a field may perform initialization of new records, for example: generate an id
	 */
	initNewRecord: function(record, properties) {},

	/**
	 * Initialize a field from server-side data
	 * @param {Lava.data.Record} record
	 * @param {Object} properties
	 * @param {Object} raw_properties
	 */
	'import': function(record, properties, raw_properties) {},

	/**
	 * Export the field's value back to server-side data
	 * @param {Lava.data.Record} record
	 * @param {Object} destination_object Object with exported data
	 */
	'export': function(record, destination_object) {
		Lava.t("Abstract method call");
	},

	/**
	 * Get this field's value from a record's properties
	 * @param {Lava.data.Record} record
	 * @param {Object} properties
	 */
	getValue: function(record, properties) {
		Lava.t("Abstract method call");
	},

	/**
	 * Set this field's value to record's properties
	 * @param {Lava.data.Record} record
	 * @param {Object} properties
	 * @param {*} value
	 */
	setValue: function(record, properties, value) {
		Lava.t("Abstract method call");
	},

	/**
	 * Emit {@link Lava.data.field.Abstract#event:changed} and fire the changed events from record instance
	 * @param {Lava.data.Record} record
	 */
	_fireFieldChangedEvents: function(record) {

		this._fire('changed', {record: record});
		record.firePropertyChangedEvents(this._name);

	},

	/**
	 * Helper method for importing values from server-side data. Performs validation
	 * @param {Object} properties
	 * @param {Object} raw_properties
	 * @returns {*}
	 */
	_getImportValue: function(properties, raw_properties) {

		if (Lava.schema.data.VALIDATE_IMPORT_DATA && !this.isValidValue(raw_properties[this._name]))
			Lava.t('Invalid value in import data (' + this._name + '): ' + raw_properties[this._name]);

		return raw_properties[this._name];

	},

	/**
	 * Compare values of this field in two records
	 * @param {Lava.data.Record} record_a
	 * @param {Lava.data.Record} record_b
	 * @returns {boolean} True, in case the value of this field in `record_a` is less than value in `record_b`
	 */
	isLess: function(record_a, record_b) {

		return this._properties_by_guid[record_a.guid][this._name] < this._properties_by_guid[record_b.guid][this._name];

	},

	/**
	 * Compare values of this field in two records
	 * @param record_a
	 * @param record_b
	 * @returns {boolean} True, in case values are equal
	 */
	isEqual: function(record_a, record_b) {

		return this._properties_by_guid[record_a.guid][this._name] == this._properties_by_guid[record_b.guid][this._name];

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		this._properties_by_guid = this._module = null;

	}

});

Lava.define(
'Lava.data.field.Basic',
/**
 * Field with no restrictions on value type
 *
 * @lends Lava.data.field.Basic#
 * @extends Lava.data.field.Abstract
 */
{

	Extends: 'Lava.data.field.Abstract',

	/**
	 * Field's default value from config
	 * @type {*}
	 */
	_default: null,

	init: function(module, name, config, module_storage) {

		this.Abstract$init(module, name, config, module_storage);

		if ('default' in config) {

			this._default = config['default'];

		}

		if (!this._is_nullable && this._default == null) {

			// the default value could be provided in derived classes
			Lava.t("Non-nullable Basic fields must have a default value");

		}

		if (Lava.schema.DEBUG && !this.isValidValue(this._default))
			Lava.t("Field was configured with invalid default value. Module: " + this._module.getName() + ", field name: " + this._name);

	},

	onModuleFieldsCreated: function(default_properties) {

		default_properties[this._name] = this._default;

	},

	'import': function(record, properties, raw_properties) {

		if (this._name in raw_properties) {

			properties[this._name] = this._getImportValue(properties, raw_properties);

		}

	},

	'export': function(record, destination_object) {

		destination_object[this._name] = this._properties_by_guid[record.guid][this._name];

	},

	getValue: function(record, properties) {

		return properties[this._name];

	},

	setValue: function(record, properties, value) {

		if (properties[this._name] !== value) {

			if (Lava.schema.data.VALIDATE_VALUES && !this.isValidValue(value)) Lava.t('[Field name=' + this._name + '] Invalid field value: '
				+ value + ". Reason: " + this.getInvalidReason(value));

			properties[this._name] = value;
			this._fireFieldChangedEvents(record);

		}

	}

});

Lava.define(
'Lava.data.field.Collection',
/**
 * Field, that holds collection of records (usually, from another module)
 * @lends Lava.data.field.Collection#
 * @extends Lava.data.field.Abstract
 */
{

	Extends: 'Lava.data.field.Abstract',

	/**
	 * Instance belongs to Collection field
	 * @type {boolean}
	 * @readonly
	 */
	isCollectionField: true,

	/**
	 * Collection field holds array of records from this module instance
	 * @type {Lava.data.Module}
	 */
	_target_module: null,

	/**
	 * The mirror {@link Lava.data.field.Record} field name
	 * @type {string}
	 */
	_target_record_field_name: null,
	/**
	 * Each Collection field has corresponding Record field, they always come in pairs, like 'parent' (Record) and 'children' (Collection)
	 * @type {Lava.data.field.Record}
	 */
	_target_record_field: null,

	/**
	 * Listener for {@link Lava.data.field.Record#event:removed_child}
	 * @type {_tListener}
	 */
	_record_removed_listener: null,
	/**
	 * Listener for {@link Lava.data.field.Record#event:added_child}
	 * @type {_tListener}
	 */
	_record_added_listener: null,

	/**
	 * Collections of foreign records that belong to local record
	 * @type {Object.<string, Lava.system.Enumerable>}
	 */
	_collections_by_record_guid: {},
	/**
	 * Listeners for each Enumerable from `_collections_by_record_guid`
	 * @type {Object}
	 */
	_collection_listeners_by_guid: {},
	/**
	 * Hash of global unique identifiers of Enumerables from `_collections_by_record_guid` to their owner record (local)
	 * @type {Object.<_tGUID, Lava.data.Record>}
	 */
	_collection_guid_to_record: {},

	/**
	 * @param module
	 * @param name
	 * @param {_cCollectionField} config
	 * @param module_storage
	 */
	init: function(module, name, config, module_storage) {

		this.Abstract$init(module, name, config, module_storage);

		if (Lava.schema.DEBUG && !config.record_field)
			Lava.t("Missing corresponding Record field. Record fields are used by Collection fields.");

		this._target_record_field_name = config.record_field;

	},

	onModuleFieldsCreated: function(default_properties) {

		this._target_module = (this._config.module == 'this') ? this._module : this._module.getApp().getModule(this._config.module);
		this._target_record_field = this._target_module.getField(this._target_record_field_name);
		this._record_removed_listener = this._target_record_field.on('removed_child', this._onRecordRemoved, this);
		this._record_added_listener = this._target_record_field.on('added_child', this._onRecordAdded, this);

		if (!this._target_record_field.isRecordField) Lava.t('CollectionField: mirror field is not Record field');

		if (this._target_record_field.getReferencedModule() !== this._module)
			Lava.t("CollectionField: module mismatch with mirror Record field");

	},

	/**
	 * Record was removed from collection by setting it's related Record field. Update local collection
	 * @param {Lava.data.field.Record} field
	 * @param {Lava.data.field.Record#event:removed_child} event_args
	 */
	_onRecordRemoved: function(field, event_args) {

		var local_record = event_args.collection_owner;
		if (local_record.guid in this._collections_by_record_guid) {
			Lava.suspendListener(this._collection_listeners_by_guid[local_record.guid].removed);
			this._collections_by_record_guid[local_record.guid].removeValue(event_args.child);
			Lava.resumeListener(this._collection_listeners_by_guid[local_record.guid].removed);
		}

	},

	/**
	 * Record was added to collection by setting it's related Record field. Update local collection
	 * @param {Lava.data.field.Record} field
	 * @param {Lava.data.field.Record#event:removed_child} event_args
	 */
	_onRecordAdded: function(field, event_args) {

		var local_record = event_args.collection_owner;
		if (local_record.guid in this._collections_by_record_guid) {
			Lava.suspendListener(this._collection_listeners_by_guid[local_record.guid].added);
			this._collections_by_record_guid[local_record.guid].includeValue(event_args.child);
			Lava.suspendListener(this._collection_listeners_by_guid[local_record.guid].added);
		}

	},

	isValidValue: function() {

		// You can not assign anything to Collection fields.
		// They can only be imported and are updated automatically, when corresponding Record field changes
		return false;

	},

	getInvalidReason: function() {

		return  'Collection field does not support setValue';

	},

	'import': function(record, properties, raw_properties) {

		if (raw_properties[this._name]) {

			if (Lava.schema.data.VALIDATE_IMPORT_DATA && !Array.isArray(raw_properties[this._name]))
				Lava.t('Invalid value in import data');

			var i = 0,
				records = this._target_module.loadRecords(raw_properties[this._name]),
				count = records.length;

			for (; i < count; i++) {

				records[i].set(this._target_record_field_name, record);

			}

		}

	},

	'export': function(record, destination_object) {

	},

	getValue: function(record, properties) {

		var guid = record.guid,
			collection;

		if (!(guid in this._collections_by_record_guid)) {

			collection = new Lava.system.Enumerable(this._target_record_field.getCollection(record));
			this._collections_by_record_guid[guid] = collection;
			this._collection_listeners_by_guid[guid] = {
				added: collection.on('items_added', this._onCollectionRecordsAdded, this),
				removed: collection.on('items_removed', this._onCollectionRecordsRemoved, this)
			};
			this._collection_guid_to_record[collection.guid] = record;

		}

		return this._collections_by_record_guid[guid];

	},

	/**
	 * When directly adding records to collection - their related Record field must be set to correct collection owner
	 * @param {Lava.system.Enumerable} collection Collection of records that belong to local record ("children")
	 * @param {Lava.system.Enumerable#event:items_added} event_args
	 */
	_onCollectionRecordsAdded: function(collection, event_args) {

		this._setCollectionOwner(event_args.values, this._collection_guid_to_record[collection.guid]);

	},

	/**
	 * When directly removing records from collection - their related Record field must be set to null
	 * @param {Lava.system.Enumerable} collection Collection of records that belong to local record ("children")
	 * @param {Lava.system.CollectionAbstract#event:items_removed} event_args
	 */
	_onCollectionRecordsRemoved: function(collection, event_args) {

		this._setCollectionOwner(event_args.values, null);

	},

	/**
	 * Set the related {@link Lava.data.field.Record} field of the `records` array to `new_value`
	 * @param {Array.<Lava.data.Record>} records
	 * @param {?Lava.data.Record} new_value
	 */
	_setCollectionOwner: function(records, new_value) {

		var i = 0,
			count = records.length,
			record;

		for (; i < count; i++) {

			record = records[i];
			// everything else will be done by the Record field
			// also, it will raise an event to remove the record from Enumerable
			record.set(this._target_record_field_name, new_value);

		}

	},

	/**
	 * Get count of items in record's collection of this field
	 * @param {Lava.data.Record} record
	 * @param {Object} properties
	 * @returns {Number}
	 */
	getCount: function(record, properties) {

		return this._target_record_field.getCollectionCount(record);

	},

	setValue: function() {

		Lava.t('Trying to set Collection field value');

	},

	isLess: function(record_a, record_b) {

		return this._target_record_field.getCollectionCount(record_a) < this._target_record_field.getCollectionCount(record_b);

	},

	isEqual: function(record_a, record_b) {

		return this._target_record_field.getCollectionCount(record_a) == this._target_record_field.getCollectionCount(record_b);

	},

	destroy: function() {

		var guid;

		for (guid in this._collections_by_record_guid) {

			this._collections_by_record_guid[guid].destroy();

		}

		this._target_record_field.removeListener(this._record_removed_listener);
		this._target_record_field.removeListener(this._record_added_listener);

		this._target_module
			= this._collections_by_record_guid
			= this._collection_listeners_by_guid
			= this._collection_guid_to_record
			= this._target_record_field = null;

		this.Abstract$destroy();

	}

});

Lava.define(
'Lava.data.field.Integer',
/**
 * Holds integer values
 * @lends Lava.data.field.Integer#
 * @extends Lava.data.field.Basic
 */
{

	Extends: 'Lava.data.field.Basic',

	/**
	 * Numbers, consisting of digits and optionally a sign
	 * @type {RegExp}
	 */
	VALID_VALUE_REGEX: /^(\-|\+)?([1-9]\d*|0)$/,

	isValidValue: function(value) {

		return (value === null && this._is_nullable) || (typeof(value) == 'number' && this.VALID_VALUE_REGEX.test(value));

	},

	getInvalidReason: function(value) {

		var reason = this.Basic$getInvalidReason(value);

		if (!reason) {

			if (typeof(value) != 'number') {

				reason = "Value is not a number";

			} else if (this.VALID_VALUE_REGEX.test(value)) {

				reason = "Value is not an integer";

			}

		}

		return reason;

	}

});

Lava.define(
'Lava.data.field.Id',
/**
 * Holds server-side IDs from database table, does NOT generate id's automatically.
 * Currently supports only positive integers as IDs
 *
 * @lends Lava.data.field.Id#
 * @extends Lava.data.field.Abstract
 */
{

	Extends: 'Lava.data.field.Abstract',

	/**
	 * Numbers, consisting of digits, not zero
	 * @type {RegExp}
	 */
	VALID_VALUE_REGEX: /^[1-9]\d*$/,

	/**
	 * ID may be null for new records, which are not saved into database yet
	 */
	_is_nullable: true,

	init: function(module, name, config, module_storage) {

		if (Lava.schema.DEBUG && (('is_nullable' in config) || ('default' in config)))
			Lava.t("Standard ID field can not be configured as nullable or have a default value");

		this.Abstract$init(module, name, config, module_storage);

	},

	onModuleFieldsCreated: function(default_properties) {

		default_properties[this._name] = null;

	},

	isValidValue: function(value) {

		return (value === null && this._is_nullable) || (typeof(value) == 'number' && this.VALID_VALUE_REGEX.test(value));

	},

	getInvalidReason: function(value) {

		var reason = this.Abstract$getInvalidReason(value);

		if (!reason) {

			if (typeof(value) != 'number') {

				reason = "Value is not a number";

			} else if (this.VALID_VALUE_REGEX.test(value)) {

				reason = "Valid values for ID field are positive integers";

			}

		}

		return reason;

	},

	'import': function(record, properties, raw_properties) {

		if (!(this._name in raw_properties)) Lava.t("Import record must have an ID");

		properties[this._name] = this._getImportValue(properties, raw_properties);

	},

	'export': function(record, destination_object) {

		destination_object[this._name] = this._properties_by_guid[record.guid][this._name];

	},

	getValue: function(record, properties) {

		return properties[this._name];

	},

	/**
	 * Throws an error
	 */
	setValue: function() {

		Lava.t("Standard id field must not be set");

	}

});

Lava.define(
'Lava.data.field.ForeignKey',
/**
 * Represents a field that references ID field of another record (often from another modules). Maintains collections
 * of local records, grouped by their referenced "parent"
 * @lends Lava.data.field.ForeignKey#
 * @extends Lava.data.field.Basic
 */
{

	Extends: 'Lava.data.field.Basic',

	/**
	 * Instance belongs to ForeignKey field
	 * @type {boolean}
	 * @readonly
	 */
	isForeignKey: true,

	/**
	 * Local records, grouped by foreign field
	 * @type {Object.<string, Array.<Lava.data.Record>>}
	 */
	_collections_by_foreign_id: {},

	/**
	 * Default foreign id (0 means that no record is referenced)
	 * @type {number}
	 */
	_default: 0,

	initNewRecord: function(record, properties) {

		this._registerByForeignKey(record, properties[this._name]);
		this.Basic$initNewRecord(record, properties);

	},

	'import': function(record, properties, raw_properties) {

		this._registerByForeignKey(record, raw_properties[this._name] || properties[this._name]);// it may have a default
		this.Basic$import(record, properties, raw_properties);

	},

	/**
	 * Add record to local collection of records, grouped by this field
	 * @param {Lava.data.Record} record
	 * @param {string} foreign_key
	 */
	_registerByForeignKey: function(record, foreign_key) {

		if (foreign_key in this._collections_by_foreign_id) {

			this._collections_by_foreign_id[foreign_key].push(record);

		} else {

			this._collections_by_foreign_id[foreign_key] = [record];

		}

	},

	setValue: function(record, properties, new_foreign_key) {

		Firestorm.Array.exclude(this._collections_by_foreign_id[properties[this._name]], record);
		this._registerByForeignKey(record, new_foreign_key);

		this.Basic$setValue(record, properties, new_foreign_key);

	},

	/**
	 * Get local records with given `foreign_key` value
	 * @param {string} foreign_key
	 * @returns {Array.<Lava.data.Record>}
	 */
	getCollection: function(foreign_key) {

		return (foreign_key in this._collections_by_foreign_id) ? this._collections_by_foreign_id[foreign_key].slice() : [];

	},

	destroy: function() {

		this._collections_by_foreign_id = null;
		this.Basic$destroy();

	}

});
/**
 * Fired, when the field's value changes: local record (`child`) now references the `collection_owner`
 * @event Lava.data.field.Record#added_child
 * @type {Object}
 * @property {Lava.data.Record} collection_owner New referenced record
 * @property {Lava.data.Record} child Referencing record from local module
 */

/**
 * Fired, when the field's value changes: local record (`child`) no longer references the `collection_owner`
 * @event Lava.data.field.Record#removed_child
 * @type {Object}
 * @property {Lava.data.Record} collection_owner Old referenced record
 * @property {Lava.data.Record} child Referencing record from local module
 */

Lava.define(
'Lava.data.field.Record',
/**
 * References a record (usually from another module).
 * Also maintains collections of records, grouped by this field (used by mirror Collection field)
 * and synchronizes it's state with accompanying ForeignKey field
 *
 * @lends Lava.data.field.Record#
 * @extends Lava.data.field.Abstract
 */
{

	Extends: 'Lava.data.field.Abstract',

	/**
	 * This class is instance of a Record field
	 * @type {boolean}
	 * @readonly
	 */
	isRecordField: true,

	/**
	 * Owner module for the records of this field
	 * @type {Lava.data.Module}
	 */
	_referenced_module: null,

	/**
	 * Records, grouped by this field. Serves as a helper for mirror Collection field.
	 * Key is GUID of the foreign record, value is collection of records from local module
	 * @type {Object.<string, Array.<Lava.data.Record>>}
	 */
	_collections_by_foreign_guid: {},

	/**
	 * Name of accompanying {@link Lava.data.field.ForeignKey} field from local module. Example: 'parent_id'
	 * @type {string}
	 */
	_foreign_key_field_name: null,
	/**
	 * Local field with ID of the record in external module
	 * @type {Lava.data.field.ForeignKey}
	 */
	_foreign_key_field: null,
	/**
	 * Listener for {@link Lava.data.field.Abstract#event:changed} in `_foreign_key_field`
	 * @type {_tListener}
	 */
	_foreign_key_changed_listener: null,

	/**
	 * The {@link Lava.data.field.Id} field in external module
	 * @type {Lava.data.field.Abstract}
	 */
	_external_id_field: null,
	/**
	 * The listener for external ID creation event ({@link Lava.data.field.Abstract#event:changed} in `_external_id_field` field)
	 * @type {_tListener}
	 */
	_external_id_changed_listener: null,
	/**
	 * Listener for {@link Lava.data.Module#event:records_loaded} in external module
	 * @type {_tListener}
	 */
	_external_records_loaded_listener: null,

	/**
	 * The foreign ID value, when there is no referenced record
	 * @const
	 */
	EMPTY_FOREIGN_ID: 0,

	_is_nullable: true,

	/**
	 * @param module
	 * @param name
	 * @param {_cRecordField} config
	 * @param module_storage
	 */
	init: function(module, name, config, module_storage) {

		this.Abstract$init(module, name, config, module_storage);
		this._referenced_module = (config.module == 'this') ? module : module.getApp().getModule(config.module);

	},

	onModuleFieldsCreated: function(default_properties) {

		if (this._config.foreign_key_field) {

			if (Lava.schema.DEBUG && !this._referenced_module.hasField('id')) Lava.t("field/Record: the referenced module must have an ID field");

			this._foreign_key_field_name = this._config.foreign_key_field;
			this._foreign_key_field = this._module.getField(this._foreign_key_field_name);
			if (Lava.schema.DEBUG && !this._foreign_key_field.isForeignKey) Lava.t();
			this._foreign_key_changed_listener = this._foreign_key_field.on('changed', this._onForeignKeyChanged, this);
			this._external_id_field = this._referenced_module.getField('id');
			this._external_id_changed_listener = this._external_id_field.on('changed', this._onExternalIdCreated, this);
			this._external_records_loaded_listener = this._referenced_module.on('records_loaded', this._onReferencedModuleRecordsLoaded, this);

		}

		// this field stores the referenced record
		default_properties[this._name] = null;

	},

	/**
	 * There may be local records that reference external records, which are not yet loaded (by ForeignKey).
	 * This field is <kw>null</kw> for them.
	 * When referenced records are loaded - local records must update this field with the newly loaded instances
	 * @param {Lava.data.Module} module
	 * @param {Lava.data.Module#event:records_loaded} event_args
	 */
	_onReferencedModuleRecordsLoaded: function(module, event_args) {

		var records = event_args.records,
			count = records.length,
			i = 0,
			local_records,
			local_count,
			local_index,
			local_record;

		for (; i < count; i++) {

			local_records = this._foreign_key_field.getCollection(records[i].get('id'));

			// these records belong to this module and have this field null.
			// Now, as the foreign record is loaded - the field can be updated.
			for (local_count = local_records.length, local_index = 0; local_index < local_count; local_index++) {
				local_record = local_records[local_index];
				this._properties_by_guid[local_record.guid][this._name] = records[i];
				this._fireFieldChangedEvents(local_record);
			}

		}

	},

	/**
	 * A record was saved to the database and assigned an id. Need to assign foreign keys for local records
	 * @param {Lava.data.field.Id} foreign_module_id_field
	 * @param {Lava.data.field.Abstract#event:changed} event_args
	 */
	_onExternalIdCreated: function(foreign_module_id_field, event_args) {

		var referenced_record = event_args.record, // record belongs to foreign module
			new_referenced_id = referenced_record.get('id'),
			collection,
			i = 0,
			count;

		if (referenced_record.guid in this._collections_by_foreign_guid) {

			collection = this._collections_by_foreign_guid[referenced_record.guid];

			// Set the value of foreign ID field in all local records that reference this foreign record.
			// Situation: there is a new record, which was created in the browser, and some records that reference it
			// (either new or loaded from database). It's new, so there are no records on server that reference it.
			if (this._foreign_key_field) {

				Lava.suspendListener(this._foreign_key_changed_listener);

				for (count = collection.length; i < count; i++) {

					collection[i].set(this._foreign_key_field_name, new_referenced_id);

				}

				Lava.resumeListener(this._foreign_key_changed_listener);

			}

		}

	},

	/**
	 * Fires, when local record's foreign id field is assigned a new value.
	 * Example:
	 * ```javascript
	 * record.set('category_id', 123); // 'record' is from local module, 123 - id of foreign record
	 * ```
	 * @param {Lava.data.field.ForeignKey} foreign_key_field
	 * @param {Lava.data.field.Abstract#event:changed} event_args
	 */
	_onForeignKeyChanged: function(foreign_key_field, event_args) {

		var record = event_args.record, // record belongs to this module
			properties = this._properties_by_guid[record.guid];

		if (properties[this._name] != null) {

			// remove old record from collection
			this._unregisterRecord(record, properties[this._name]);

		}

		if (properties[this._foreign_key_field_name]) {

			this._registerByReferencedId(record, properties, properties[this._foreign_key_field_name]);

		} else {

			properties[this._name] = null;

		}

		this._fireFieldChangedEvents(record);

	},

	isValidValue: function(new_record) {

		return (
				(new_record === null && this._is_nullable)
				|| (typeof(new_record) != 'undefined'
					&& new_record.isRecord
					&& new_record.getModule() === this._referenced_module)
			);

	},

	getInvalidReason: function(value) {

		var reason = this.Abstract$getInvalidReason(value);

		if (!reason) {

			if (!value.isRecord) {

				reason = "Value is not record";

			} else if (value.getModule() === this._referenced_module) {

				reason = "Value is from different module than this field refers to";

			}

		}

		return reason;

	},

	initNewRecord: function(record, properties) {

		if (this._foreign_key_field && properties[this._foreign_key_field_name]) {

			this._registerByReferencedId(record, properties, properties[this._foreign_key_field_name]);

		}

	},

	'import': function(record, properties, raw_properties) {

		var foreign_id;

		if (this._foreign_key_field) {

			// if foreign id is in import - then it will replace the default value (if foreign kay has default)
			foreign_id = raw_properties[this._foreign_key_field_name] || properties[this._foreign_key_field_name];
			if (foreign_id) {
				this._registerByReferencedId(record, properties, foreign_id);
			}

		}

	},

	/**
	 * Update value of this field in local `record` and add the record to field's internal collections
	 * @param {Lava.data.Record} record The local record
	 * @param {Object} properties The properties of local record
	 * @param {string} referenced_record_id The id of foreign record, which it belongs to
	 */
	_registerByReferencedId: function(record, properties, referenced_record_id) {

		properties[this._name] = this._referenced_module.getRecordById(referenced_record_id) || null;

		if (properties[this._name]) {

			this._registerRecord(record, properties[this._name]);

		}

	},

	'export': function(record, destination_object) {

	},

	getValue: function(record, properties) {

		return properties[this._name];

	},

	setValue: function(record, properties, new_ref_record) {

		if (Lava.schema.data.VALIDATE_VALUES && !this.isValidValue(new_ref_record))
			Lava.t("Field/Record: assigned value is not valid. Reason: " + this.getInvalidReason(new_ref_record));

		if (properties[this._name] != null) {

			// remove from the old record's collection
			this._unregisterRecord(record, properties[this._name]);

		}

		properties[this._name] = new_ref_record;
		if (new_ref_record != null) {

			this._registerRecord(record, new_ref_record)

		}

		if (this._foreign_key_field) {

			Lava.suspendListener(this._foreign_key_changed_listener);

			if (new_ref_record != null) {

				// if this module has foreign_key_field then foreign module must have an ID column
				record.set(this._foreign_key_field_name, new_ref_record.get('id'));

			} else {

				record.set(this._foreign_key_field_name, this.EMPTY_FOREIGN_ID);

			}

			Lava.resumeListener(this._foreign_key_changed_listener);

		}

		this._fireFieldChangedEvents(record);

	},

	/**
	 * Remove `local_record` from field's internal collection referenced by `referenced_record`
	 * @param {Lava.data.Record} local_record
	 * @param {Lava.data.Record} referenced_record
	 */
	_unregisterRecord: function(local_record, referenced_record) {

		if (!Firestorm.Array.exclude(this._collections_by_foreign_guid[referenced_record.guid], local_record)) Lava.t();
		this._fire('removed_child', {
			collection_owner: referenced_record,
			child: local_record
		});

	},

	/**
	 * Add `local_record` to field's internal collection of records from local module, referenced by `referenced_record`
	 * @param {Lava.data.Record} local_record
	 * @param {Lava.data.Record} referenced_record The collection owner
	 */
	_registerRecord: function(local_record, referenced_record) {

		var referenced_guid = referenced_record.guid;

		if (referenced_guid in this._collections_by_foreign_guid) {

			if (Lava.schema.DEBUG && this._collections_by_foreign_guid[referenced_guid].indexOf(local_record) != -1)
				Lava.t("Duplicate record");
			this._collections_by_foreign_guid[referenced_guid].push(local_record);

		} else {

			this._collections_by_foreign_guid[referenced_guid] = [local_record];

		}

		this._fire('added_child', {
			collection_owner: referenced_record,
			child: local_record
		});

	},

	/**
	 * API for {@link Lava.data.field.Collection} field. Get all local records, which reference `referenced_record`
	 * @param {Lava.data.Record} referenced_record The collection's owner record from referenced module
	 * @returns {Array} All records
	 */
	getCollection: function(referenced_record) {

		return (referenced_record.guid in this._collections_by_foreign_guid)
			? this._collections_by_foreign_guid[referenced_record.guid].slice()
			: []; // fast operation: array of objects

	},

	/**
	 * API for {@link Lava.data.field.Collection} field. Get count of local records, which reference the `referenced_record`
	 * @param {Lava.data.Record} referenced_record The collection's owner record from referenced module
	 * @returns {Number}
	 */
	getCollectionCount: function(referenced_record) {

		var collection = this._collections_by_foreign_guid[referenced_record.guid];
		return collection ? collection.length : 0;

	},

	/**
	 * Get `_referenced_module`
	 * @returns {Lava.data.Module}
	 */
	getReferencedModule: function() {

		return this._referenced_module;

	},

	/**
	 * Get field's value equivalent for comparison
	 * @param {Lava.data.Record} record
	 * @returns {string}
	 */
	_getComparisonValue: function(record) {

		if (Lava.schema.DEBUG && !(record.guid in this._properties_by_guid)) Lava.t("isLess: record does not belong to this module");
		var ref_record_a = this._properties_by_guid[record.guid][this._name];
		// must return undefined, cause comparison against nulls behaves differently
		return ref_record_a ? ref_record_a.get('id') : void 0;

	},

	isLess: function(record_a, record_b) {

		return this._getComparisonValue(record_a) < this._getComparisonValue(record_b);

	},

	isEqual: function(record_a, record_b) {

		return this._getComparisonValue(record_a) == this._getComparisonValue(record_b);

	},

	destroy: function() {

		if (this._config.foreign_key_field) {

			this._foreign_key_field.removeListener(this._foreign_key_changed_listener);
			this._external_id_field.removeListener(this._external_id_changed_listener);

		}

		this._referenced_module.removeListener(this._external_records_loaded_listener);

		this._referenced_module
			= this._collections_by_foreign_guid
			= this._foreign_key_field
			= this._external_id_field
			= null;

		this.Abstract$destroy();

	}

});

Lava.define(
'Lava.data.field.Boolean',
/**
 * Field that holds boolean values (<kw>true</kw> or <kw>false</kw>)
 * @lends Lava.data.field.Boolean#
 * @extends Lava.data.field.Basic
 */
{

	Extends: 'Lava.data.field.Basic',

	/**
	 * @type {boolean}
	 */
	_default: false,

	isValidValue: function(value) {

		return (value === null && this._is_nullable) || (typeof(value) == 'boolean');

	},

	getInvalidReason: function(value) {

		var reason = this.Basic$getInvalidReason(value);

		if (!reason && typeof(value) != 'boolean') {

			reason = "Value is not boolean type";

		}

		return reason;

	}

});

Lava.define(
'Lava.data.field.Guid',
/**
 * Returns record's `guid` property
 * @lends Lava.data.field.Guid#
 * @extends Lava.data.field.Abstract
 */
{

	Extends: 'Lava.data.field.Abstract',

	'export': function(record, destination_object) {

		destination_object['guid'] = record.guid;

	},

	/**
	 * Get record's `guid` property
	 * @param record
	 * @param properties
	 * @returns {_tGUID}
	 */
	getValue: function(record, properties) {

		return record.guid;

	},

	/**
	 * Throws an error
	 */
	setValue: function(record, properties, value) {

		Lava.t('Guid field is read only');

	}

});

Lava.define(
'Lava.data.ModuleAbstract',
/**
 * Base class for modules
 *
 * @lends Lava.data.ModuleAbstract#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',

	/**
	 * Module's config
	 * @type {(_cModule|_cMetaStorage)}
	 */
	_config: null,
	/**
	 * Module's field instances
	 * @type {Object.<string, Lava.data.field.Abstract>}
	 */
	_fields: {},
	/**
	 * All records in this module
	 * @type {Array.<Lava.data.Record>}
	 */
	_records: [],
	/**
	 * Records by their global unique identifiers
	 * @type {Object.<string, Lava.data.Record>}
	 */
	_records_by_guid: {},
	/**
	 * Record's properties by their global unique identifiers
	 * @type {Object.<string, Lava.data.Record>}
	 */
	_properties_by_guid: {},
	/**
	 * Cached record class constructor
	 * @type {function}
	 */
	_record_constructor: null,

	/**
	 * Create field instances and return the default record properties object
	 * @param {(_cModule|_cMetaStorage)} config
	 * @returns {Object} Default record properties object with initial values for each field
	 */
	_createFields: function(config) {

		var field_name,
			type,
			constructor;

		for (field_name in config.fields) {

			type = config.fields[field_name].type || Lava.schema.data.DEFAULT_FIELD_TYPE;
			constructor = Lava.ClassManager.getConstructor(type, 'Lava.data.field');
			this._fields[field_name] = new constructor(
				this,
				field_name,
				config.fields[field_name],
				this._properties_by_guid
			);

		}

	},

	/**
	 * Called by App instance. Do not call this function directly.
	 */
	initFields: function() {

		var default_properties = {},
			field_name;

		for (field_name in this._fields) {

			this._fields[field_name].onModuleFieldsCreated(default_properties);

		}

		this._createRecordProperties = new Function(
			"return " + Lava.serializer.serialize(default_properties)
		);

	},

	/**
	 * Returns an object with record's initial properties. This function is generated in constructor
	 * @returns {Object}
	 */
	_createRecordProperties: function() {

		Lava.t('Module requires initialization');

	},

	/**
	 * Return a copy of local `_records` array
	 * @returns {Array.<Lava.data.Record>}
	 */
	getAllRecords: function() {

		return this._records.slice();

	},

	/**
	 * Get number of records in the module
	 * @returns {number}
	 */
	getCount: function() {

		return this._records.length;

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		var name;
			//i = 0,
			//count = this._records.length;

		/*for (; i < count; i++) {

			this._records[i].destroy();

		}*/

		for (name in this._fields) {

			this._fields[name].destroy();

		}

		this._records = this._records_by_guid = this._properties_by_guid = this._fields = null;

	}

});

/**
 * Records have been loaded from server
 * @event Lava.data.Module#records_loaded
 * @type {Object}
 * @property {Array.<Lava.data.Record>} records The loaded record instances
 */

/**
 * New records have been created
 * @event Lava.data.Module#records_created
 * @type {Object}
 * @property {Array.<Lava.data.Record>} records The new record instances
 */

Lava.define(
'Lava.data.Module',
/**
 * Module represents a server-side database table
 *
 * @lends Lava.data.Module#
 * @extends Lava.data.ModuleAbstract
 */
{

	Extends: 'Lava.data.ModuleAbstract',

	/**
	 * Application instance reference
	 * @type {Lava.system.App}
	 */
	_app: null,
	/**
	 * Module name
	 * @type {string}
	 */
	_name: null,

	/**
	 * All records by their unique ID key (if module has an ID field)
	 * @type {Object.<string, Lava.data.Record>}
	 */
	_records_by_id: {},

	/**
	 * Does this module have an ID field
	 * @type {boolean}
	 */
	_has_id: false,

	/**
	 * Create a Module instance, init fields, generate the method that returns initial record properties
	 * @param {Lava.system.App} lava_app Application instance
	 * @param {_cModule} config
	 * @param {string} name Module's name
	 */
	init: function(lava_app, config, name) {

		this._app = lava_app;
		this._config = config;
		this._name = name;

		this._createFields(config);

		this._record_constructor = Lava.ClassManager.getConstructor(
			config.record_class || Lava.schema.data.DEFAULT_RECORD_CLASS,
			'Lava.data'
		);

		if ('id' in this._fields) {

			this._has_id = true;
			this._fields['id'].on('changed', this._onRecordIdChanged, this);

		}

	},

	/**
	 * Record's ID has been created (ID fields never change). Need to update local `_records_by_id` hash
	 * @param {Lava.data.field.Abstract} id_field
	 * @param {Lava.data.field.Abstract#event:changed} event_args
	 */
	_onRecordIdChanged: function(id_field, event_args) {

		var id = event_args.record.get('id');
		if (id in this._records_by_id) Lava.t("Duplicate record id in module " + this._name);
		this._records_by_id[id] = event_args.record;

	},

	/**
	 * Does this module have an ID field with given name
	 * @param {string} name
	 * @returns {boolean}
	 */
	hasField: function(name) {

		return name in this._fields;

	},

	/**
	 * Get field instance
	 * @param {string} name
	 * @returns {Lava.data.field.Abstract}
	 */
	getField: function(name) {

		return this._fields[name];

	},

	/**
	 * Get a record by it's ID field
	 * @param {string} id
	 * @returns {Lava.data.Record}
	 */
	getRecordById: function(id) {

		return this._records_by_id[id];

	},

	/**
	 * Get a record by it's global unique identifier
	 * @param {_tGUID} guid
	 * @returns {Lava.data.Record}
	 */
	getRecordByGuid: function(guid) {

		return this._records_by_guid[guid];

	},

	/**
	 * Get `_app`
	 * @returns {Lava.system.App}
	 */
	getApp: function() {

		return this._app;

	},

	/**
	 * Load record only if it has not been already loaded. `raw_properties` must have an ID
	 * @param {Object} raw_properties Serialized record fields from server
	 * @returns {Lava.data.Record} Newly loaded record instance, or the old one
	 */
	safeLoadRecord: function(raw_properties) {

		var result;

		if (Lava.schema.DEBUG && !raw_properties.id) Lava.t('safeLoadRecord: import data must have an id');

		if (raw_properties.id in this._records_by_id) {

			result = this._records_by_id[raw_properties.id];

		} else {

			result = this.loadRecord(raw_properties);

		}

		return result;

	},

	/**
	 * Initialize a module record from server-side data
	 * @param {Object} raw_properties Serialized record fields from server
	 * @returns {Lava.data.Record} Loaded record instance
	 */
	loadRecord: function(raw_properties) {

		var record = this._createRecordInstance(raw_properties);
		this._fire('records_loaded', {records: [record]});
		return record;

	},

	/**
	 * Create a new record instance
	 * @returns {Lava.data.Record}
	 */
	createRecord: function() {

		var record = this._createRecordInstance();
		this._fire('records_created', {records: [record]});
		return record;

	},

	/**
	 * Perform creation of a new record instance (either with server-side data, or without it)
	 * @param {Object} raw_properties
	 * @returns {Lava.data.Record}
	 */
	_createRecordInstance: function(raw_properties) {

		var properties = this._createRecordProperties(),
			record = new this._record_constructor(this, this._fields, properties, raw_properties);

		if (properties.id) {

			if (properties.id in this._records_by_id) Lava.t("Duplicate record id in module " + this._name);
			this._records_by_id[properties.id] = record;

		}

		this._records.push(record);
		this._properties_by_guid[record.guid] = properties;
		this._records_by_guid[record.guid] = record;
		return record;

	},

	/**
	 * Initialize module records from server-side data
	 * @param {Array.<Object>} raw_records_array Server-side data for the records
	 * @returns {Array.<Lava.data.Record>} Loaded record instances
	 */
	loadRecords: function(raw_records_array) {

		var i = 0,
			count = raw_records_array.length,
			records = [];

		for (; i < count; i++) {

			records.push(this._createRecordInstance(raw_records_array[i]));

		}

		this._fire('records_loaded', {records: records});

		return records;

	},

	destroy: function() {

		this._records_by_id = null;
		this.ModuleAbstract$destroy();

	}

});

Lava.define(
'Lava.data.Record',
/**
 * Standard module record
 *
 * @lends Lava.data.Record#
 * @extends Lava.mixin.Properties
 */
{

	Implements: 'Lava.mixin.Properties',
	/**
	 * To tell other classes that this is instance of Record
	 * @type {boolean}
	 * @readonly
	 */
	isRecord: true,
	/**
	 * Record's `_properties` are assigned in constructor, so here we replace the default value (empty object)
	 * to save some time on garbage collection
	 * @type {Object}
	 */
	_properties: null,
	/**
	 * Record's module
	 * @type {Lava.data.ModuleAbstract}
	 */
	_module: null,
	/**
	 * Reference to module's fields
	 * @type {Object.<string, Lava.data.field.Abstract>}
	 */
	_fields: null,
	/**
	 * Global unique identifier
	 * @type {_tGUID}
	 */
	guid: null,

	/**
	 * Create record instance
	 * @param {Lava.data.ModuleAbstract} module Records module
	 * @param {Object.<string, Lava.data.field.Abstract>} fields Object with module's fields
	 * @param {Object} properties_ref Reference to an object with record's properties
	 * @param {Object} raw_properties Object with record field values from server
	 */
	init: function(module, fields, properties_ref, raw_properties) {

		this.guid = Lava.guid++;
		this._module = module;
		this._fields = fields;
		this._properties = properties_ref;

		var field_name;

		if (typeof(raw_properties) != 'undefined') {

			for (field_name in fields) {

				fields[field_name]['import'](this, properties_ref, raw_properties);

			}

		} else {

			for (field_name in fields) {

				fields[field_name].initNewRecord(this, properties_ref);

			}

		}

	},

	get: function(name) {

		if (Lava.schema.DEBUG && !(name in this._fields)) Lava.t('[Record] No such field: ' + name);
		return this._fields[name].getValue(this, this._properties);

	},

	set: function(name, value) {

		if (Lava.schema.DEBUG && !(name in this._fields)) Lava.t('[Record] No such field: ' + name);
		this._fields[name].setValue(this, this._properties, value);

	},

	/**
	 * Get `_module`
	 * @returns {Lava.data.ModuleAbstract}
	 */
	getModule: function() {

		return this._module;

	},

	/**
	 * Export record back into plain JavaScript object for sending to server
	 * @returns {Object}
	 */
	'export': function() {

		var export_record = {};

		for (var field_name in this._fields) {

			this._fields[field_name]['export'](this, export_record);

		}

		return export_record;

	}

});

Lava.define(
'Lava.data.MetaRecord',
/**
 * Record for {@link Lava.data.MetaStorage} module
 * @lends Lava.data.MetaRecord#
 * @extends Lava.data.Record
 */
{

	Extends: 'Lava.data.Record',

	/**
	 * Instance belongs to MetaRecord class
	 * @type {boolean}
	 * @readonly
	 */
	isMetaRecord: true,

	/**
	 * GUID of external record (or object), to which this instance is attached
	 * @type {number}
	 * @readonly
	 */
	ext_guid: 0,
	/**
	 * Optional external record instance, which owns `ext_guid`
	 * @type {Object}
	 */
	_original_record: null,

	/**
	 * @param module
	 * @param fields
	 * @param properties_ref
	 * @param raw_properties
	 * @param {Object} original_record Optional external record instance, to which this record is attached
	 */
	init: function(module, fields, properties_ref, raw_properties, original_record) {

		this.Record$init(module, fields, properties_ref, raw_properties);

		if (original_record) {

			this._original_record = original_record;

		}

	},

	/**
	 * Get `_original_record`
	 * @returns {?Object}
	 */
	getOriginalRecord: function() {

		return this._original_record;

	}

});

Lava.define(
'Lava.data.MetaStorage',
/**
 * Module that is designed to extend normal modules with additional fields. Cannot have an ID field
 * @lends Lava.data.MetaStorage#
 * @extends Lava.data.ModuleAbstract
 * @extends Lava.mixin.Properties
 */
{

	Extends: 'Lava.data.ModuleAbstract',
	Implements: 'Lava.mixin.Properties',

	/**
	 * Create an instance of MetaStorage
	 * @param {_cMetaStorage} config
	 */
	init: function(config) {

		if ('id' in config.fields) Lava.t("Id field in MetaStorage is not permitted");

		this._config = config;
		this._createFields(config);
		this.initFields(); // MetaStorage is constructed directly, not via App class

		var field_name;

		if (Lava.schema.DEBUG) {
			for (field_name in this._fields) {
				if (this._fields[field_name].isCollectionField || this._fields[field_name].isRecordField)
					Lava.t("Standard Collection and Record fields will not work inside the MetaStorage");
			}
		}

		this._record_constructor = Lava.ClassManager.getConstructor('MetaRecord', 'Lava.data');

	},

	/**
	 * Get an extension record by GUID of normal record
	 * @param {_tGUID} ext_guid
	 * @returns {Lava.data.MetaRecord}
	 * @lava-param-renamed name -> ext_guid
	 */
	get: function(ext_guid) {

		return this._properties[ext_guid];

	},

	/**
	 * Throws an error
	 */
	set: function() {

		Lava.t("MetaStorage: set operation is not permitted");

	},

	/**
	 * Create a new MetaRecord instance
	 * @param {_tGUID} ext_guid GUID of the external record, to which this MetaRecord will be attached
	 * @param {Object} raw_properties Initial field values
	 * @param {Object} [original_record] Original record, which will be saved in MetaRecord instance
	 * @returns {Lava.data.MetaRecord}
	 */
	createMetaRecord: function(ext_guid, raw_properties, original_record) {

		if (ext_guid in this._properties) Lava.t("MetaRecord already exists");

		var properties = this._createRecordProperties(),
			record = new this._record_constructor(this, this._fields, properties, raw_properties, original_record);

		record.ext_guid = ext_guid;
		this._records.push(record);
		this._properties_by_guid[record.guid] = properties;
		this._records_by_guid[record.guid] = record;

		this._properties[ext_guid] = record;
		this.firePropertyChangedEvents(ext_guid);

		return record;

	}

});

Lava.define(
'Lava.mixin.Observable',
/**
 * Provides support for events
 * @lends Lava.mixin.Observable#
 */
{

	/**
	 * Indicates that this class is inherited from Observable and supports events
	 * @readonly
	 */
	isObservable: true,

	/**
	 * The hash of listeners for each event
	 * @type {Object.<string, Array.<_tListener>>}
	 */
	_listeners: {},

	/**
	 * Add listener for event `event_name`
	 *
	 * @param {string} event_name Name of the event to listen to
	 * @param {function} fn The callback
	 * @param {Object} context The context for callback execution (an object, to which the callback belongs)
	 * @param {*} [listener_args] Static listener arguments. May be usable when one callback responds to different events
	 * @returns {_tListener} Listener structure, which later may be suspended, or removed via call to {@link Lava.mixin.Observable#removeListener}
	 */
	on: function(event_name, fn, context, listener_args) {

		return this._addListener(event_name, fn, context, listener_args, this._listeners)

	},

    once: function(event_name, fn, context, listener_args) {

        return this._addOnce(event_name, fn, context, listener_args, this._listeners);

    },

    _addOnce: function(event_name, fn, context, listener_args, listeners_by_event) {

        var listener,
            callback = function(self, event_args, listener_args) {
                fn.call(context, self, event_args, listener_args);
                self._removeListener(listener, listeners_by_event);
            };

        listener = this._addListener(event_name, callback, context, listener_args, listeners_by_event);
        return listener;

    },

	/**
	 * Create the listener construct and push it into the listeners array for given event name
	 *
	 * @param {string} event_name The name of event
	 * @param {function} fn The callback
	 * @param {Object} context The owner of the callback
	 * @param {*} listener_args Static listener arguments
	 * @param {Object.<string, Array.<_tListener>>} listeners_by_event {@link Lava.mixin.Observable#_listeners} or {@link Lava.mixin.Properties#_property_listeners}
	 * @returns {_tListener} Listener structure
	 */
	_addListener: function(event_name, fn, context, listener_args, listeners_by_event) {

		// otherwise, listener would be called on window object
		if (Lava.schema.DEBUG && !context) Lava.t('Listener was created without a context');

		// note 1: member count for a plain object like this must not exceed 8
		// otherwise, chrome will slow down greatly (!)
		// note 2: there is no 'remove()' method inside the listener, cause depending on implementation,
		// it may either slow down script execution or lead to memory leaks
		var listener = {
			event_name: event_name,
			fn: fn,
			_fn: fn,
			context: context,
			listener_args: listener_args
		};

		if (listeners_by_event[event_name] != null) {

			listeners_by_event[event_name].push(listener);

		} else {

			listeners_by_event[event_name] = [listener];

		}

		return listener;

	},

	/**
	 * Remove the given listener object from event listeners array
	 * @param {_tListener} listener Structure, which was returned by {@link Lava.mixin.Observable#on} method
	 */
	removeListener: function(listener) {

		this._removeListener(listener, this._listeners);

	},

	/**
	 * Perform removal of the listener structure
	 * @param {_tListener} listener Structure, which was returned by {@link Lava.mixin.Observable#on} method
	 * @param {Object.<string, Array.<_tListener>>} listeners_by_event {@link Lava.mixin.Observable#_listeners} or {@link Lava.mixin.Properties#_property_listeners}
	 */
	_removeListener: function(listener, listeners_by_event) {

		var list = listeners_by_event[listener.event_name],
			index;

		if (list) {
			index = list.indexOf(listener);
			if (index != -1) {
				list.splice(index, 1);
				if (list.length == 0) {
					listeners_by_event[listener.event_name] = null;
				}
			}
		}

	},

	/**
	 * Fire an event
	 * @param {string} event_name The name of event
	 * @param {*} [event_args] Dynamic event arguments. Anything, that may be needed by listener
	 */
	_fire: function(event_name, event_args) {

		if (Lava.schema.DEBUG && typeof(event_name) == "undefined") Lava.t();

		if (this._listeners[event_name] != null) {

			this._callListeners(this._listeners[event_name], event_args);

		}

	},

	/**
	 * Perform fire - call listeners of an event
	 * @param {Array.<_tListener>} listeners An array with listener structures
	 * @param {*} event_args Dynamic event arguments
	 */
	_callListeners: function(listeners, event_args) {

		var copy = listeners.slice(), // cause they may be removed during the fire cycle
			i = 0,
			count = listeners.length,
			listener;

		for (; i < count; i++) {

			listener = copy[i];
			listener.fn.call(listener.context, this, event_args, listener.listener_args);

		}

	},

	/**
	 * Does this object have any listeners for given event, including suspended instances
	 * @param {string} event_name The name of event
	 * @returns {boolean} True, if there are listeners
	 */
	_hasListeners: function(event_name) {

		return this._listeners[event_name] != null;

	},

    removeAllListenersByContext: function (context) {

        for (var event_name in this._listeners) {

            this.removeListenersByContext(event_name, context);

        }

    },

    removeListenersByContext: function (event_name, context) {

        var listeners = this._listeners[event_name];
        if (listeners) {
            var result = [];
            for (var i = 0, count = listeners.length; i < count; i++) {
                if (listeners[i].context != context) {
                    result.push(listeners[i]);
                }
            }
            this._listeners[event_name] = result.length ? result : null;
        }

    }

});

/**
 * Property has changed
 * @event Lava.mixin.Properties#property_changed
 * @type {Object}
 * @property {string} name The name of the changed property
 */

Lava.define(
'Lava.mixin.Properties',
/**
 * Provides the `get()` and `set()` methods, and fires property changed events
 * @lends Lava.mixin.Properties#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',

	/**
	 * To signal other classes that this class implements Properties
	 * @readonly
	 */
	isProperties: true,

	/**
	 * Hash with property values
	 * @type {Object.<name, *>}
	 */
	_properties: {},
	/**
	 * Separate listeners hash for property changed events, same as {@link Lava.mixin.Observable#_listeners}
	 * @type {Object.<string, Array.<_tListener>>}
	 */
	_property_listeners: {},

	/**
	 * Allows the mixin to be used as full-featured class
	 * @param {Object.<string, *>} properties Initial properties
	 */
	init: function(properties) {

	    Firestorm.extend(this._properties, properties);

	},

	/**
	 * Get property
	 * @param {string} name Property name
	 * @returns {*} Property value
	 */
	get: function(name) {

		return this._properties[name];

	},

	/**
	 * Returns <kw>true</kw> if property exists, even if it's null/undefined
	 * @param {string} name Property name
	 * @returns {boolean} True, if property exists
	 */
	isset: function(name) {

		return name in this._properties;

	},

	/**
	 * Set property
	 * @param {string} name Property name
	 * @param {*} value New property value
	 */
	set: function(name, value) {

		if (this._properties[name] !== value) {
			this._set(name, value);
		}

	},

	/**
	 * Perform the set operation
	 * @param {string} name Property name
	 * @param {*} value New property value
	 */
	_set: function(name, value) {
		this._properties[name] = value;
		this.firePropertyChangedEvents(name);
	},

	/**
	 * Set multiple properties at once
	 * @param {Object.<string, *>} properties_object A hash with new property values
	 */
	setProperties: function(properties_object) {

		if (Lava.schema.DEBUG && properties_object && properties_object.isProperties) Lava.t("setProperties expects a plain JS object as an argument, not a class");

		for (var name in properties_object) {

			this.set(name, properties_object[name]);

		}

	},

	/**
	 * Return a copy of the properties hash
	 * @returns {Object.<name, *>} Copy of `_properties` object
	 */
	getProperties: function() {

		var result = {};
		Firestorm.extend(result, this._properties);
		return result;

	},

	/**
	 * Fire the 'property_changed' event for Observable interface, and Properties' native {@link Lava.mixin.Properties#onPropertyChanged} event
	 * @param {string} property_name The name of the changed property
	 */
	firePropertyChangedEvents: function(property_name) {

		this._fire('property_changed', {name: property_name});
		this._firePropertyChanged(property_name);

	},

	/**
	 * The same, as {@link Lava.mixin.Observable#on}, but returns listener to `property_name` instead of `event_name`
	 *
	 * @param {string} property_name Name of the property to listen for changes
	 * @param {function} fn The callback
	 * @param {Object} context The context for callback execution (an object, to which the callback belongs)
	 * @param {*} [listener_args] May be usable when one callback responds to changes of different properties
	 * @returns {_tListener} Listener construct, which may be removed or suspended later
	 */
	onPropertyChanged: function(property_name, fn, context, listener_args) {

		return this._addListener(property_name, fn, context, listener_args, this._property_listeners);

	},

    oncePropertyChanged: function(property_name, fn, context, listener_args) {

        return this._addOnce(property_name, fn, context, listener_args, this._property_listeners);

    },

	/**
	 * Removes listeners added with {@link Lava.mixin.Properties#onPropertyChanged}
	 * @param {_tListener} listener The listener structure, returned from {@link Lava.mixin.Properties#onPropertyChanged}
	 */
	removePropertyListener: function(listener) {

		this._removeListener(listener, this._property_listeners);

	},

	/**
	 * Same as {@link Lava.mixin.Observable#_fire}, but for property listeners
	 * @param {string} property_name Name of the changed property
	 */
	_firePropertyChanged: function(property_name) {

		if (Lava.schema.DEBUG && property_name == null) Lava.t("firePropertyChanged: property_name is null");

		if (this._property_listeners[property_name] != null) {

			this._callListeners(this._property_listeners[property_name]);

		}

	}

});

Lava.define(
'Lava.mixin.Refreshable',
/**
 * Auxiliary class for the scope refresh system. Allows to build hierarchy of dependent scopes
 * @lends Lava.mixin.Refreshable#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',
	/**
	 * Tell other classes that this instance is inherited from Refreshable
	 * @type {boolean}
	 * @readonly
	 */
	isRefreshable: true,
	/**
	 * Indicates the priority of this scope in the hierarchy. Scopes with lower priority are refreshed first
	 * @type {number}
	 * @readonly
	 */
	level: 0,

	/**
	 * The object, which is given by {@link Lava.ScopeManager} when the scope is added into the refresh queue
	 * @type {Object}
	 */
	_refresh_ticket: null,

	/**
	 * Each time the scope is refreshed - it's assigned the id of the current refresh loop
	 * @type {number}
	 */
	_last_refresh_id: 0,
	/**
	 * How many times this scope was refreshed during current refresh loop
	 * @type {number}
	 */
	_refresh_cycle_count: 0,
	/**
	 * Scope's value
	 * @type {*}
	 */
	_value: null,

	/**
	 * Called by {@link Lava.ScopeManager} during refresh loop. You should not call this method directly.
	 * Warning: violates code style with multiple return statements.
	 *
	 * @param {number} refresh_id The id of current refresh loop
	 * @param {boolean} [is_safe] Internal switch used to control infinite refresh loop exceptions
	 * @returns {boolean} <kw>true</kw> in case of infinite loop, and <kw>false</kw> in case of normal refresh
	 */
	refresh: function(refresh_id, is_safe) {

		// first, refresh ticket must be cleared, cause otherwise scope may stay dirty forever
		this._refresh_ticket = null;

		if (this._last_refresh_id == refresh_id) {

			this._refresh_cycle_count++;
			if (this._refresh_cycle_count > Lava.schema.system.REFRESH_INFINITE_LOOP_THRESHOLD && !is_safe) {

				return true; // infinite loop exception

			}

		} else {

			this._last_refresh_id = refresh_id;
			this._refresh_cycle_count = 0;

		}

		this._doRefresh();
		return false;

	},

	/**
	 * Must be overridden in classes that implement Refreshable to perform the actual refresh logic
	 */
	_doRefresh: function() {

		// may be overridden in inherited classes

	},

	/**
	 * Ensure that this scope will participate in the next refresh cycle
	 */
	_queueForRefresh: function() {

		if (!this._refresh_ticket) {

			this._refresh_ticket = Lava.ScopeManager.scheduleScopeRefresh(this, this.level);

		}

	},

	/**
	 * Internal debug assertion, called to verify that the scope does not need to be refreshed
	 */
	debugAssertClean: function() {

		if (this._refresh_ticket) Lava.t("Refreshable::debugAssertClean() failed");

	},

	/**
	 * Will the scope be refreshed in the next refresh cycle
	 * @returns {boolean} <kw>true</kw>, if scope is in refresh queue, and <kw>false</kw> otherwise
	 */
	isWaitingRefresh: function() {

		return !!this._refresh_ticket;

	},

	/**
	 * Cancel the current refresh ticket and ignore next refresh cycle. Does not destroy the Refreshable instance
	 */
	suspendRefreshable: function() {

		if (this._refresh_ticket) {
			Lava.ScopeManager.cancelScopeRefresh(this._refresh_ticket, this.level);
			this._refresh_ticket = null;
		}

	}

});
Lava.define(
'Lava.animator.Integer',
/**
 * Animate integer units, like pixels
 * @lends Lava.animator.Integer#
 * @implements _iAnimator
 */
{

	/**
	 * Property to animate, like 'width' or 'height'
	 * @type {string}
	 */
	property_name: null,
	/**
	 * Starting property value
	 * @type {number}
	 */
	from: 0,
	/**
	 * End property value
	 * @type {number}
	 */
	delta: 0,
	/**
	 * CSS unit for animated property, like 'px'
	 */
	unit: null,

	/**
	 * Create the animator instance
	 * @param {_cAnimator_Integer} config
	 */
	init: function(config) {

		this.property_name = config.property;
		this.from = config.from || 0;
		this.delta = config.delta;
		this.unit = config.unit || 'px';

	},

	/**
	 * Perform animation
	 * @param {HTMLElement} element
	 * @param {number} transition_value Value of animation. Usually between 0 and 1, but sometimes it may cross the bounds
	 */
	animate: function(element, transition_value) {

		var raw_result = this.from + this.delta * transition_value;

		Firestorm.Element.setStyle(
			element,
			this.property_name,
			Math.floor(raw_result) + this.unit
		);

	}

});
Lava.define(
'Lava.animator.Color',
/**
 * Animate colors
 * @lends Lava.animator.Color#
 * @implements _iAnimator
 */
{

	/**
	 * Property to animate, like 'background-color'
	 * @type {string}
	 */
	property_name: null,
	/**
	 * Starting color
	 * @type {Array.<number>}
	 */
	from: null,
	/**
	 * End color
	 * @type {Array.<number>}
	 */
	to: null,
	/**
	 * Computed difference between starting and the end color
	 * @type {Array.<number>}
	 */
	delta: null,

	/**
	 * Create the animator instance
	 * @param {_cAnimator_Color} config
	 */
	init: function(config) {

		this.property_name = config.property;
		this.from = config.from || [0,0,0];
		this.to = config.to || [0,0,0];
		this.delta = [this.to[0] - this.from[0], this.to[1] - this.from[1], this.to[2] - this.from[2]];

	},

	/**
	 * Perform animation
	 * @param {HTMLElement} element
	 * @param {number} transition_value Value of animation. Usually between 0 and 1, but sometimes it may cross the bounds
	 */
	animate: function(element, transition_value) {

		var current_value = [
			Math.floor(this.from[0] + this.delta[0] * transition_value),
			Math.floor(this.from[1] + this.delta[1] * transition_value),
			Math.floor(this.from[2] + this.delta[2] * transition_value)
		];

		Firestorm.Element.setStyle(
			element,
			this.property_name,
			'rgb(' + current_value.join(',') + ')'
		);

	}

});

/**
 * Animation has ended
 * @event Lava.animation.Abstract#complete
 */

Lava.define(
'Lava.animation.Abstract',
/**
 * Animation changes properties of HTML elements over time
 * @lends Lava.animation.Abstract#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',

	/**
	 * The time when animation was started, in milliseconds
	 * @type {number}
	 */
	_started_time: 0,
	/**
	 * The time animation ends (or has ended), in milliseconds
	 * @type {number}
	 */
	_end_time: 0,
	/**
	 * Animation duration, in milliseconds
	 * @type {number}
	 */
	_duration: 0,
	/**
	 * Usually, a HTML Element, properties of which this animation changes
	 * @type {*}
	 */
	_target: null,
	/**
	 * Is it currently running
	 * @type {boolean}
	 */
	_is_running: false,
	/**
	 * Does it run in reversed direction
	 * @type {boolean}
	 */
	_is_reversed: false,
	/**
	 * The settings for this instance
	 * @readonly
	 * @type {_cAnimation}
	 */
	_config: null,

	/**
	 * Transition is a function, which takes current elapsed time (in percent, from 0 to 1) and returns current animation position (also in percent)
	 * @type {_tTransitionCallback}
	 */
	_transition: null,
	/**
	 * Instance global unique identifier
	 * @type {_tGUID}
	 */
	guid: null,

	/**
	 * Constructs the class instance
	 * @param {_cAnimation} config Settings, `this._config`
	 * @param {*} target `this._target`
	 */
	init: function(config, target) {

		this.guid = Lava.guid++;
		if (config.duration) {
			this._duration = config.duration;
		}
		this._target = target;
		this._transition = config.transition || Lava.transitions[config.transition_name || 'linear'];
		this._config = config;

	},

	/**
	 * Called by Cron. Assigned in constructor
	 * @param {number} now The current time (=new Date().getTime())
	 */
	onTimer: function(now) {

		Lava.t("This method is assigned dynamically in constructor");

	},

	/**
	 * Set the animation state to 'not running' and fire the {@link Lava.animation.Abstract#event:complete} event
	 */
	_finish: function() {

		this._is_running = false;
		this._fire('complete');

	},

	/**
	 * Start only if it's not already running
	 * @param [started_time] Optionally, you can pass the time when animation has actually started.
	 *      Otherwise, the current system time will be taken
	 */
	safeStart: function(started_time) {

		if (!this._is_running) {

			this.start(started_time);

		}

	},

	/**
	 * If animation is running forwards - reverse it to backwards direction
	 */
	reverseDirection: function() {

		if (!this._is_reversed) {

			this._mirror();

		}

	},

	/**
	 * If animation is running backwards - reverse it to normal direction
	 */
	resetDirection: function() {

		if (this._is_reversed) {

			this._mirror();

		}

	},

	/**
	 * Reverse animation direction
	 */
	_mirror: function() {

		this._is_reversed = !this._is_reversed;

		if (this._is_running) {

			var now = new Date().getTime(),
				new_end = 2 * now - this._started_time;

			// it's possible in case of script lags. Must not allow negative transition values.
			if (now > this._end_time) {

				this._started_time = this._end_time;
				this._end_time = this._started_time + this._duration;

			} else {

				this._end_time = new_end;
				this._started_time = new_end - this._duration;

			}

			this._afterMirror(now);

		}

	},

	/**
	 * Callback to execute after `_mirror` is done
	 * @param {number} now The current time in milliseconds
	 */
	_afterMirror: function(now) {

	},

	/**
	 * Get `_is_running`
	 * @returns {boolean}
	 */
	isRunning: function() {

		return this._is_running;

	},

	/**
	 * Get `_started_time`
	 * @returns {number}
	 */
	getStartedTime: function() {

		return this._started_time;

	},

	/**
	 * Get `_end_time`
	 * @returns {number}
	 */
	getEndTime: function() {

		return this._end_time;

	},

	/**
	 * Get `_duration`
	 * @returns {number}
	 */
	getDuration: function() {

		return this._duration;

	},

	/**
	 * Get `_is_reversed`
	 * @returns {boolean}
	 */
	isReversed: function() {

		return this._is_reversed;

	},

	/**
	 * Get `_target`
	 * @returns {*}
	 */
	getTarget: function() {

		return this._target;

	},

	/**
	 * Set `_target`
	 * @param target
	 */
	setTarget: function(target) {

		this._target = target;

	}

});

Lava.define(
'Lava.animation.Standard',
/**
 * Common JavaScript-driven animation. Uses {@link Lava.Cron}
 * @lends Lava.animation.Standard#
 * @extends Lava.animation.Abstract
 */
{

	Extends: 'Lava.animation.Abstract',

	Shared: '_shared',

	/**
	 * Shared data
	 */
	_shared: {
		// pre-generated variants of this._callAnimators function
		call_animators: [
			function(transition_value) {},
			function(transition_value) {
				this._animators[0].animate(this._target, transition_value);
			},
			function(transition_value) {
				this._animators[0].animate(this._target, transition_value);
				this._animators[1].animate(this._target, transition_value);
			},
			function(transition_value) {
				this._animators[0].animate(this._target, transition_value);
				this._animators[1].animate(this._target, transition_value);
				this._animators[2].animate(this._target, transition_value);
			},
			function(transition_value) {
				this._animators[0].animate(this._target, transition_value);
				this._animators[1].animate(this._target, transition_value);
				this._animators[2].animate(this._target, transition_value);
				this._animators[3].animate(this._target, transition_value);
			}
		]
	},

	/**
	 * Current animation percent, between 0 and 1
	 * @type {number}
	 */
	_percent: 0,

	/**
	 * Animator instances
	 * @type {Array.<_iAnimator>}
	 */
	_animators: [],

	init: function(config, target) {

		this.Abstract$init(config, target);

		var i = 0,
			count = 0,
			animator_config;

		if ('animators' in config) {

			count = config.animators.length;

			for (; i < count; i++) {

				animator_config = config.animators[i];
				this._animators.push(new Lava.animator[animator_config.type](animator_config));

			}

		}

		if (this._shared.call_animators.length <= count) {

			this._callAnimators = this._shared.call_animators[count];

		}

		this.onTimer = this._animateDirect;

	},

	/**
	 * Calls all animator instances.
	 * This function may be substituted with pre-generated version from `_shared`
	 *
	 * @param {number} transition_value The current percent of animation
	 */
	_callAnimators: function(transition_value) {

		for (var i = 0, count = this._animators.length; i < count; i++) {

			this._animators[i].animate(this._target, transition_value);

		}

	},

	/**
	 * Perform animation in normal direction
	 * @param {number} now The current global time in milliseconds
	 */
	_animateDirect: function(now) {

		if (now < this._end_time) {

			this._callAnimators(this._transition((now - this._started_time) / this._duration));

		} else {

			this._callAnimators(this._transition(1));
			this._finish();

		}

	},

	/**
	 * Perform animation in reversed direction
	 * @param {number} now The current global time in milliseconds
	 */
	_animateReverse: function(now) {

		if (now < this._end_time) {

			this._callAnimators(this._transition(1 - (now - this._started_time) / this._duration));

		} else {

			this._callAnimators(this._transition(0));
			this._finish();

		}

	},

	/**
	 * Start animating
	 * @param {number} [started_time] The global system time in milliseconds when animation has started.
	 *  May be used to synchronize multiple animations
	 */
	start: function(started_time) {

		var now = new Date().getTime();
		this._started_time = started_time || now;
		this._end_time = this._started_time + this._duration;

		if (now < this._end_time) {

			this._is_running = true;
			Lava.Cron.acceptTask(this);
			this.onTimer(now);

		} else {

			this.onTimer(this._end_time);

		}

	},

	/**
	 * Stop animation immediately where it is. Do not fire {@link Lava.animation.Abstract#event:complete}
	 */
	stop: function() {

		this._is_running = false;

	},

	_mirror: function() {

		this.onTimer = this._is_reversed ? this._animateDirect : this._animateReverse;
		this.Abstract$_mirror();

	},

	/**
	 * Act like the animation has ended naturally:
	 * apply the end state to the target and fire {@link Lava.animation.Abstract#event:complete}
	 */
	finish: function() {

		if (this._is_running) {

			this.onTimer(this._end_time);

		}

	},

	/**
	 * Set animation duration
	 * @param {number} duration New duration, in milliseconds
	 */
	setDuration: function(duration) {

		this._duration = duration;
		this._end_time = this._started_time + duration;

	}

});

Lava.define(
'Lava.animation.Collapse',
/**
 * Expand (forwards) and collapse (backwards) an element. May operate with either height (default) or width property.
 * Adjusts animation duration dynamically, depending on distance
 *
 * @lends Lava.animation.Collapse#
 * @extends Lava.animation.Standard
 */
{

	Extends: 'Lava.animation.Standard',

	/**
	 * Animation config
	 */
	_shared: {
		default_config: {
			// duration is set dynamically
			transition_name: 'outQuad',
			animators: [{
				type: 'Integer',
				property: 'height',
				delta: 0 // actual height will be set at run time
			}]
		}
	},

	/**
	 * Property to animate
	 * @type {string}
	 */
	_property: 'height',

	/**
	 * Minimal animation duration, milliseconds
	 * @type {number}
	 * @const
	 */
	DURATION_BIAS: 200,

	init: function(config, target) {

		var new_config = {};
		Firestorm.extend(new_config, this._shared.default_config);
		Firestorm.extend(new_config, config);

		// assuming that the first animator is Integer
		if (Lava.schema.DEBUG && !new_config.animators[0].property) Lava.t("Collapse: malformed animation config");
		this._property = new_config.animators[0].property;

		this.Standard$init(new_config, target);

	},

	start: function(started_time) {

		// in case we are starting from collapsed state
		Firestorm.Element.setStyle(this._target, this._property, 'auto');
		// assuming that target is element
		var property_value = Firestorm.Element.getSize(this._target)[(this._property == 'width') ? 'x' : 'y'];
		this._animators[0].delta = property_value;
		this.setDuration(this.DURATION_BIAS + Math.floor(property_value)); // time depends on distance, to make it smoother

		this.Standard$start(started_time);

	},

	_finish: function() {

		if (!this._is_reversed) {

			// animation has expanded the container, height (or width) must be unlocked to allow element to adapt it's dimensions
			// (otherwise, if children nodes are added or removed - height will remain the same)
			Firestorm.Element.setStyle(this._target, this._property, 'auto');

		}

		this.Standard$_finish();

	}

});

Lava.define(
'Lava.animation.Toggle',
/**
 * Primary purpose of this class: emulate animation support in cases when it's not enabled
 * (and leave the same code, that works with animations)
 *
 * @lends Lava.animation.Toggle#
 * @extends Lava.animation.Standard
 */
{

	Extends: 'Lava.animation.Standard',

	_finish: function() {

		Firestorm.Element.setStyle(this._target, 'display', this._is_reversed ? 'none' : 'block');
		this.Standard$_finish();

	}

});

Lava.define(
'Lava.animation.Emulated',
/**
 * Used to animate with CSS transitions. Does not use {@link Lava.Cron}, has a single timeout event
 * @lends Lava.animation.Emulated#
 * @extends Lava.animation.Abstract
 */
{

	Extends: 'Lava.animation.Abstract',

	/**
	 * Tell other classes that this is instance of Lava.animation.Emulated
	 */
	isEmulated: true,

	/**
	 * Window timeout id
	 * @type {?number}
	 */
	_timeout: null,

	init: function(config, target) {

		this.Abstract$init(config, target);

		var self = this;
		this.onTimer = function() {
			self._onTimeout();
		}

	},

	/**
	 * Callback for window timeout event
	 */
	_onTimeout: function() {

		this._timeout = null;
		this._end();
		this._finish();

	},

	/**
	 * Apply the ended state to the target
	 */
	_end: function() {

	},

	/**
	 * Clear old timeout, if it exists
	 */
	_cancelTimeout: function() {
		if (this._timeout) {
			window.clearTimeout(this._timeout);
			this._timeout = null;
		}
	},

	/**
	 * Start animation
	 */
	start: function() {

		if (this._is_running) {
			this.stop();
		}

		this._is_running = true;
		this._start();
		this._timeout = window.setTimeout(this.onTimer, this._duration);

	},

	/**
	 * Apply the started state to the target
	 */
	_start: function() {

	},

	/**
	 * Stop animation immediately where it is. Do not fire {@link Lava.animation.Abstract#event:complete}
	 */
	stop: function() {

		if (this._is_running) {
			this._is_running = false;
			this._cancelTimeout();
		}

	},

	_mirror: function() {

		if (this._is_running) {
			this.stop();
			this._reverse();
			this._is_running = true;
			// any CSS transition takes fixed amount of time
			this._timeout = window.setTimeout(this.onTimer, this._duration);
		}

		this._is_reversed = !this._is_reversed;

	},

	/**
	 * Actions to reverse Emulated animation while it's still running
	 */
	_reverse: function() {

	},

	/**
	 * End the animation and Apply the end state to target
	 */
	finish: function() {

		if (this._is_running) {
			this._cancelTimeout();
			this._onTimeout();
		}

	}

});

Lava.define(
'Lava.animation.BootstrapCollapse',
/**
 * Expand and collapse an element using browser transitions from Bootstrap CSS framework
 *
 * @lends Lava.animation.BootstrapCollapse#
 * @extends Lava.animation.Emulated
 */
{

	Extends: 'Lava.animation.Emulated',

	/**
	 * Fixed duration from CSS rules
	 * @type {number}
	 */
	_duration: 350,
	/**
	 * 'width' or 'height'
	 * @type {string}
	 */
	_property: 'height',
	/**
	 * The value of width (or height) of the element. Updated every time the animation starts
	 * @type {number}
	 */
	_property_value: 0,

	init: function(config, target) {

		this.Emulated$init(config, target);

		if (config.property) {
			this._property = config.property;
		}

	},

	_start: function() {

		var Element = Firestorm.Element;

		if (this._is_reversed) { // collapse an element that is currently expanded

			// explicitly set the height/width on the element to make transition happen
			this._property_value = Element.getSize(this._target)[(this._property == 'width') ? 'x' : 'y'];
			Element.setStyle(this._target, this._property, '' + this._property_value);
			this._target.offsetHeight; // force redraw to bypass browser optimizations
			Element.addClass(this._target, 'collapsing');
			Element.removeClasses(this._target, ['collapse', 'in']);
			Element.setStyle(this._target, this._property, '0');

		} else { // expand a collapsed element

			Element.removeClass(this._target, 'collapse');
			Element.setStyle(this._target, this._property, 'auto');
			this._property_value = Element.getSize(this._target)[(this._property == 'width') ? 'x' : 'y'];
			Element.setStyle(this._target, this._property, '0');
			this._target.offsetHeight; // force redraw to bypass browser optimizations
			Element.addClass(this._target, 'collapsing');
			Element.setStyle(this._target, this._property, '' + this._property_value);

		}

	},

	_end: function() {

		var Element = Firestorm.Element;

		if (this._is_reversed) {

			Element.removeClass(this._target, 'collapsing');
			Element.addClass(this._target, 'collapse');

		} else {

			Element.removeClass(this._target, 'collapsing');
			Element.addClasses(this._target, ['collapse', 'in']);
			Element.setStyle(this._target, this._property, 'auto');

		}

	},

	_reverse: function() {

		if (this._is_reversed) {

			Firestorm.Element.setStyle(this._target, this._property, '' + this._property_value);

		} else {

			Firestorm.Element.setStyle(this._target, this._property, '0');

		}

	}

});

Lava.define(
'Lava.system.Serializer',
/**
 * Pretty-print any JavaScript object into string, which can be eval()'ed to reconstruct original object
 * @lends Lava.system.Serializer#
 */
{

	Shared: ['_complex_types', '_callback_map'],

	/**
	 * Used to pretty-print values in objects
	 * @type {Object.<string, true>}
	 */
	_complex_types: {
		array: true,
		'object': true,
		'function': true,
		regexp: true
	},

	/**
	 * Concrete serializers for each value type
	 * @type {Object.<string, string>}
	 */
	_callback_map: {
		string: '_serializeString',
		array: '_serializeArray',
		'object': '_serializeObject',
		'function': '_serializeFunction',
		boolean: '_serializeBoolean',
		number: '_serializeNumber',
		regexp: '_serializeRegexp',
		'null': '_serializeNull',
		'undefined': '_serializeUndefined',
        date: '_serializeDate'
	},

    /**
     * Whether to allow dates in serialized objects (otherwise, an exception will be thrown, when date is encountered).
     * @define {boolean}
     */
    _allow_dates: false,

	/**
	 * If you know that you serialize objects with only valid property names (all characters are alphanumeric),
	 * you may turn this off
	 * @define {boolean}
	 */
	_check_property_names: true,

	/**
	 * String, used to pad serialized objects for pretty-printing
	 * @type {string}
	 */
	_pad: '\t',

	/**
	 * Create Serializer instance
	 * @param {?_cSerializer} config
	 */
	init: function(config) {

		if (config) {
            if (config.allow_dates_serialization) this._allow_dates = true;
			if (config.check_property_names === false) this._check_property_names = false;
		}

		this._serializeFunction = (config && config.pretty_print_functions)
			? this._serializeFunction_PrettyPrint
			: this._serializeFunction_Normal

	},

	/**
	 * Serialize any value
	 * @param {*} value
	 * @returns {string}
	 */
	serialize: function(value) {

		return this._serializeValue(value, '');

	},

	/**
	 * Perform value serialization
	 * @param {*} value
	 * @param {string} padding The initial padding for JavaScript code
	 * @returns {string}
	 */
	_serializeValue: function(value, padding) {

		var type = Firestorm.getType(value),
			result;

		if (Lava.schema.DEBUG && !(type in this._callback_map)) Lava.t("Unsupported type for serialization: " + type);

		result = this[this._callback_map[type]](value, padding);

		return result;

	},

	/**
	 * Perform serialization of an array
	 * @param {Array} data
	 * @param {string} padding
	 * @returns {string}
	 */
	_serializeArray: function(data, padding) {

		var tempResult = [],
			i = 0,
			count = data.length,
			child_padding = padding + "\t",
			result;

		if (count == 0) {

			result = '[]';

		} else if (count == 1) {

			result = '[' + this._serializeValue(data[i], padding) + ']';

		} else {

			for (; i < count; i++) {

				tempResult.push(this._serializeValue(data[i], child_padding));

			}

			result = '[' + "\n\t" + padding + tempResult.join(",\n\t" + padding) + "\n" + padding + ']';

		}

		return result;

	},

	/**
	 * Turn a string into it's JavaScript representation
	 * @param {string} data
	 * @returns {string}
	 */
	_serializeString: function(data) {

		return Firestorm.String.quote(data);

	},

	/**
	 * Serialize an object
	 * @param {Object} data
	 * @param {string} padding
	 * @returns {string}
	 */
	_serializeObject: function(data, padding) {

		var tempResult = [],
			child_padding = padding + "\t",
			name,
			type,
			result,
			is_complex = false,
			only_key = null,
			is_empty = true;

		// this may be faster than using Object.keys(data), but I haven't done speed comparison yet.
		// Purpose of the following code:
		// 1) if object has something in it then 'is_empty' will be set to false
		// 2) if there is only one property in it, then 'only_key' will contain it's name
		for (name in data) {
			if (only_key !== null) { // strict comparison - in case the key is valid, but evaluates to false
				only_key = null;
				break;
			}
			is_empty = false;
			only_key = name;
		}

		if (only_key) {

			type = Firestorm.getType(data[only_key]);

			if (type in this._complex_types) {
				is_complex = true;
			}

		}

		if (is_empty) {

			result = '{}';

		} else if (only_key && !is_complex) {

			// simple values can be written in one line
			result = '{' + this._serializeObjectProperty(only_key, data[only_key], child_padding) + '}';

		} else {

			for (name in data) {

				tempResult.push(
					this._serializeObjectProperty(name, data[name], child_padding)
				);

			}

			result = '{' + "\n\t" + padding + tempResult.join(",\n\t" + padding) + "\n" + padding + '}';

		}

		return result;

	},

	/**
	 * Serialize one key-value pair in an object
	 * @param {string} name
	 * @param {*} value
	 * @param {string} padding
	 * @returns {string}
	 */
	_serializeObjectProperty: function(name, value, padding) {

		var type = Firestorm.getType(value);

		// if you serialize only Lava configs, then most likely you do not need this check,
		// cause the property names in configs are always valid.
		if (this._check_property_names && (!Lava.VALID_PROPERTY_NAME_REGEX.test(name) || Lava.JS_KEYWORDS.indexOf(name) != -1)) {

			name = Firestorm.String.quote(name);

		}

		return name + ': ' + this[this._callback_map[type]](value, padding);

	},

	/**
	 * Serialize a function. Default method, which is replaced in constructor.
	 * @param {function} data
	 * @returns {string}
	 */
	_serializeFunction: function(data) {

		Lava.t();

	},

	/**
	 * Serialize a function with exact source code.
	 * @param {function} data
	 * @returns {string}
	 */
	_serializeFunction_Normal: function(data) {

		var result = data + '';

		// when using new Function() constructor, it's automatically named 'anonymous' in Chrome && Firefox
		if (result.substr(0, 18) == 'function anonymous') {
			result = 'function' + result.substr(18);
		}

		return result;

	},

	/**
	 * Serialize function, then pad it's source code. Is not guaranteed to produce correct results,
	 * so may be used only for pretty-printing of source code for browser.
	 *
	 * @param {function} data
	 * @param {string} padding
	 * @returns {string}
	 */
	_serializeFunction_PrettyPrint: function(data, padding) {

		var result = this._serializeFunction_Normal(data),
			lines = result.split(/\r?\n/),
			last_line = lines[lines.length - 1],
			tabs,
			num_tabs,
			i = 1,
			count = lines.length;

		if (/^\t*\}$/.test(last_line)) {
			if (last_line.length > 1) { // if there are tabs
				tabs = last_line.substr(0, last_line.length - 1);
				num_tabs = tabs.length;
				for (; i < count; i++) {
					if (lines[i].indexOf(tabs) == 0) {
						lines[i] = lines[i].substr(num_tabs);
					}
				}
			}
			lines.pop();
			result = lines.join('\r\n\t' + padding) + '\r\n' + padding + last_line;
		}

		return result;

	},

	/**
	 * Turn a boolean into string
	 * @param {boolean} data
	 * @returns {string}
	 */
	_serializeBoolean: function(data) {

		return data.toString();

	},

	/**
	 * Turn a number into string
	 * @param {number} data
	 * @returns {string}
	 */
	_serializeNumber: function(data) {

		return data.toString();

	},

	/**
	 * Turn a regexp into string
	 * @param {RegExp} data
	 * @returns {string}
	 */
	_serializeRegexp: function(data) {

		return data.toString();

	},

	/**
	 * Return <str>"null"</str>
	 * @returns {string}
	 */
	_serializeNull: function() {

		return 'null';

	},

	/**
	 * Return <str>"undefined"</str>
	 * @returns {string}
	 */
	_serializeUndefined: function() {

		return 'undefined';

	},

    _serializeDate: function (value) {

        if (!this._allow_dates) Lava.t("Serializer: serialization of dates is not enabled in options");
        return "new Date(" + (+value) + ")";

    }

});

/**
 * Values were removed from collection
 * @event Lava.system.CollectionAbstract#items_removed
 * @type {Object}
 * @property {Array.<number>} uids Unique IDs of values, internal to this instance
 * @property {array.<*>} values Values, that were removed
 * @property {Array.<string>} names Names (keys) of values that were removed
 */

/**
 * Fires when either content or order of items in collection changes
 * @event Lava.system.Enumerable#collection_changed
 */

Lava.define('Lava.system.CollectionAbstract',
/**
 * Base class for Enumerable, containing all methods, that do not require UID generation
 * @lends Lava.system.CollectionAbstract#
 * @extends Lava.mixin.Properties#
 */
{

	Extends: 'Lava.mixin.Properties',

	/**
	 * To tell other classes that this is instance of Enumerable
	 * @readonly
	 */
	isCollection: true,

	/**
	 * Unique identifiers for values, internal to this instance of enumerable. Note: they are not globally unique, just to this instance
	 * @type {Array.<number>}
	 */
	_data_uids: [],
	/**
	 * Values, stored in this Enumerable
	 * @type {Array.<*>}
	 */
	_data_values: [],
	/**
	 * Holds object keys, when Enumerable was constructed from object. Each name corresponds to it's value
	 * @type {Array.<string>}
	 */
	_data_names: [],
	/**
	 * Count of items in Enumerable instance
	 * @type {number}
	 */
	_count: 0,

	/**
	 * Global unique identifier of this instance
	 * @type {_tGUID}
	 */
	guid: null,

	/**
	 * Used in editing operations to set `_count` and fire changed events for <str>"length"</str> property
	 * @param {number} new_length
	 */
	_setLength: function(new_length) {

		this._count = new_length;
		this.firePropertyChangedEvents('length');

	},

	/**
	 * Does it have any items
	 * @returns {boolean} True if there are no items in collection
	 */
	isEmpty: function() {

		return this._count == 0;

	},

	/**
	 * Get current item count
	 * @returns {number} Get `_count`
	 */
	getCount: function() {

		return this._count;

	},

	/**
	 * The only supported property is <str>"length"</str>
	 * @param {string} name
	 * @returns {number} Returns `_count` for <str>"length"</str> property
	 */
	get: function(name) {

		return (name == 'length') ? this._count : null;

	},

	/**
	 * Get a copy of local UIDs array
	 * @returns {Array.<number>} `_data_uids`
	 */
	getUIDs: function() {

		// we need to copy the local array, to protect it from being altered outside of the class
		return this._data_uids.slice();

	},

	/**
	 * Get a copy of local values array
	 * @returns {Array.<*>} `_data_values`
	 */
	getValues: function() {

		return this._data_values.slice();

	},

	/**
	 * Get a copy of local names array
	 * @returns {Array.<string>} `_data_names`
	 */
	getNames: function() {

		return this._data_names.slice();

	},

	/**
	 * Create an object with [uid] => value structure
	 * @returns {Object.<number, *>} Object with local UIDs as keys and corresponding values
	 */
	getValuesHash: function() {

		var result = {},
			i = 0;

		for (; i < this._count; i++) {

			result[this._data_uids[i]] = this._data_values[i];

		}

		return result;

	},

	/**
	 * Get an object with local UIDs as keys and their indices in local array as values.
	 * The result map is valid until any modification to Enumerable
	 * @returns {Object.<number, number>} An object with keys being collection's internal UIDs and their indices as values
	 */
	getUIDToIndexMap: function() {

		var result = {},
			i = 0;

		for (; i < this._count; i++) {

			result[this._data_uids[i]] = i;

		}

		return result;

	},

	/**
	 * Get the value, that corresponds to given UID
	 * @param {number} uid
	 * @returns {*}
	 */
	getValueByLocalUID: function(uid) {

		var index = this._data_uids.indexOf(uid);

		return (index != -1) ? this._data_values[index] : null;

	},

	/**
	 * Get UID at given `index`
	 * @param {number} index
	 * @returns {number} Requested UID
	 */
	getUIDAt: function(index) {

		return this._data_uids[index];

	},

	/**
	 * Get value at given `index`
	 * @param {number} index
	 * @returns {*} Requested value
	 */
	getValueAt: function(index) {

		return this._data_values[index];

	},

	/**
	 * Get name at given `index`
	 * @param {number} index
	 * @returns {string}
	 */
	getNameAt: function(index) {

		return this._data_names[index];

	},

	/**
	 * Does collection contain the `value`
	 * @param {*} value Value to search for
	 * @returns {boolean} <kw>true</kw>, if collection has given value
	 */
	containsValue: function(value) {

		return this._data_values.indexOf(value) != -1;

	},

	/**
	 * Does collection contain the given `uid`
	 * @param {number} uid
	 * @returns {boolean} <kw>true</kw>, if collection has given UID
	 */
	containsLocalUID: function(uid) {

		return this._data_uids.indexOf(uid) != -1;

	},

	/**
	 * Get index of given `value` in collection
	 * @param {*} value Value to search for
	 * @returns {number} Zero-based index of value in Enumerable, or -1, if value is not in array
	 */
	indexOfValue: function(value) {

		return this._data_values.indexOf(value);

	},

	/**
	 * Get index of given `uid` in the collection
	 * @param {number} uid Local UID to search for
	 * @returns {number} Zero-based index of uid in Enumerable, or -1, if uid is not in array
	 */
	indexOfUID: function(uid) {

		return this._data_uids.indexOf(uid);

	},

	/**
	 * Will throw exception. You can not set any properties to Enumerable instance
	 */
	set: function() {

		Lava.t('set on Enumerable is not permitted');

	},

	/**
	 * Remove a value from the end of the collection
	 * @returns {*} Removed value
	 */
	pop: function() {

		var old_uid = this._data_uids.pop(),
			old_value = this._data_values.pop(),
			old_name = this._data_names.pop(),
			count = this._count - 1;

		this._setLength(count);

		this._fire('items_removed', {
			uids: [old_uid],
			values: [old_value],
			names: [old_name]
		});

		this._fire('collection_changed');

		return old_value;
	},

	/**
	 * Removes the first occurrence of value within collection
	 *
	 * @param {*} value
	 * @returns {boolean} <kw>true</kw>, if the value existed
	 */
	removeValue: function(value) {

		var result = false,
			index = this._data_values.indexOf(value);

		if (index != -1) {
			this.removeAt(index);
			result = true;
		}

		return result;

	},

	/**
	 * Swap values, names and UIDs at given index. Does not generate {@link Lava.system.CollectionAbstract#event:items_removed}
	 * and {@link Lava.system.Enumerable#event:items_added} events, just {@link Lava.system.Enumerable#event:collection_changed}
	 * @param {number} index_a First index to swap
	 * @param {number} index_b Second index to swap
	 */
	swap: function(index_a, index_b) {

		if (index_a > this._count || index_b > this._count) Lava.t("Index is out of range (2)");

		var swap = Firestorm.Array.swap;

		swap(this._data_uids, index_a, index_b);
		swap(this._data_values, index_a, index_b);
		swap(this._data_names, index_a, index_b);

		this._fire('collection_changed');

	},

	/**
	 * Execute the `callback` for each item in collection
	 * @param {_tEnumerableEachCallback} callback
	 */
	each: function(callback) {

		// everything is copied in case the collection is modified during the cycle
		var values = this._data_values.slice(),
			uids = this._data_uids.slice(),
			names = this._data_names.slice(),
			i = 0,
			count = this._count;

		for (; i < count; i++) {

			if (callback(values[i], names[i], uids[i], i) === false) {
				break;
			}

		}

	},

	/**
	 * Pass each value to callback and leave only those, for which it has returned <kw>true</kw>.
	 * Remove the others
	 *
	 * @param {_tEnumerableFilterCallback} callback
	 */
	filter: function(callback) {

		var i = 0,
			count = this._count,
			result = this._createHelperStorage(),
			removed = this._createHelperStorage();

		for (; i < count; i++) {

			if (callback(this._data_values[i], this._data_names[i], this._data_uids[i], i)) {

				result.push(this._data_uids[i], this._data_values[i], this._data_names[i]);

			} else {

				removed.push(this._data_uids[i], this._data_values[i], this._data_names[i]);

			}

		}

		this._assignStorage(result);
		this._setLength(this._data_uids.length);

		removed.uids.length && this._fire('items_removed', removed.getObject());

		this._fire('collection_changed');

	},

	/**
	 * Sort items in collection
	 * @param {_tLessCallback} less A callback to compare items
	 * @param {string} [algorithm_name] The name of the sorting method from Lava.algorithms.sorting
	 */
	sort: function(less, algorithm_name) {

		this._sort(less || Lava.DEFAULT_LESS, this._data_values, algorithm_name);

	},

	/**
	 * Sort items by the array of names
	 * @param {_tLessCallback} less A callback to compare items
	 * @param {string} [algorithm_name] The name of the sorting method from {@link Lava.algorithms.sorting}
	 */
	sortByNames: function(less, algorithm_name) {

		this._sort(less || Lava.DEFAULT_LESS, this._data_names, algorithm_name);

	},

	/**
	 * Perform sorting
	 * @param {_tLessCallback} less A callback to compare items
	 * @param {Array} values
	 * @param {string} [algorithm_name]
	 */
	_sort: function(less, values, algorithm_name) {

		var indices = [],
			i = 0,
			_less;

		_less = function(a, b) {

			// a and b are indices, not actual values
			return less(values[a], values[b]);

		};

		for (; i < this._count; i++) {

			indices.push(i);

		}

		indices = Lava.algorithms.sorting[algorithm_name || Lava.schema.DEFAULT_STABLE_SORT_ALGORITHM](indices, _less);

		this.reorder(indices);

	},

	/**
	 * Sort items by premade array of new item indices
	 * @param {Array.<number>} new_indices
	 */
	reorder: function(new_indices) {

		var i = 0,
			result = this._createHelperStorage(),
			index,
			verification = {};

		if (Lava.schema.DEBUG && new_indices.length != this._count) Lava.t("reorder: new item count is less than current");

		for (; i < this._count; i++) {

			index = new_indices[i];
			result.push(this._data_uids[index], this._data_values[index], this._data_names[index]);

			if (Lava.schema.DEBUG) {
				// duplicate UIDs may break a lot of functionality, in this class and outside
				if (index in verification) Lava.t("Malformed index array");
				verification[index] = null;
			}

		}

		this._assignStorage(result);
		this._fire('collection_changed');

	},

	/**
	 * Remove range of indices from collection and return removed values
	 * @param {number} start_index
	 * @param {number} count
	 * @returns {Array} Removed values
	 */
	removeRange: function(start_index, count) {

		if (count <= 0) Lava.t("Invalid item count supplied for removeRange");
		if (start_index + count >= this._count + 1) Lava.t("Index is out of range");

		var removed_uids = this._data_uids.splice(start_index, count),
			removed_values = this._data_values.splice(start_index, count),
			removed_names = this._data_names.splice(start_index, count);

		this._setLength(this._count - count);

		this._fire('items_removed', {
			uids: removed_uids,
			values: removed_values,
			names: removed_names
		});

		this._fire('collection_changed');

		return removed_values;

	},

	/**
	 * Remove all values and return them
	 * @returns {Array} Values that were in collection
	 */
	removeAll: function() {

		return (this._count > 0) ? this.removeRange(0, this._count) : [];

	},

	/**
	 * Remove value at `index`
	 * @param {number} index Index to remove
	 * @returns {*} The removed value
	 */
	removeAt: function(index) {

		return this.removeRange(index, 1)[0];

	},

	/**
	 * Remove value from the beginning of collection
	 * @returns {*} The removed value
	 */
	shift: function() {

		return this.removeRange(0, 1)[0];

	},

	/**
	 * Create an internal helper object, which allows to write less code
	 * @returns {_cEnumerableHelperStorage} Helper object
	 */
	_createHelperStorage: function() {

		return {
			uids: [],
			values: [],
			names: [],
			push: function(uid, value, name) {
				this.uids.push(uid);
				this.values.push(value);
				this.names.push(name);
			},
			getObject: function() {
				return {
					uids: this.uids,
					values: this.values,
					names: this.names
				}
			}
		}

	},

	/**
	 * Take the temporary helper object, returned from {@link Lava.system.Enumerable#_createHelperStorage}
	 * and assign it's corresponding arrays to local arrays
	 * @param {_cEnumerableHelperStorage} storage Temporary helper object
	 */
	_assignStorage: function(storage) {

		this._data_uids = storage.uids;
		this._data_values = storage.values;
		this._data_names = storage.names;

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		this._fire('destroy');

	}

});

/**
 * Values were added to collection
 * @event Lava.system.Enumerable#items_added
 * @type {Object}
 * @property {Array.<number>} uids Internal unique IDs that were generated for added values
 * @property {array.<*>} values Values, that were added
 * @property {Array.<string>} names Names (keys) of values that were added
 */

Lava.define(
'Lava.system.Enumerable',
/**
 * Array-like collection of elements, suitable for scope binding
 *
 * @lends Lava.system.Enumerable#
 * @extends Lava.system.CollectionAbstract#
 */
{

	Extends: 'Lava.system.CollectionAbstract',

	/**
	 * To tell other classes that this is instance of Enumerable
	 * @readonly
	 */
	isEnumerable: true,

	/**
	 * Counter for next internal UID
	 * @type {number}
	 */
	_uid: 1,

	/**
	 * Creates Enumerable instance and fills initial data from `data_source`
	 * @param {(Array|Object|Lava.mixin.Properties|Lava.system.Enumerable)} data_source
	 */
	init: function(data_source) {

		this.guid = Lava.guid++;

		if (data_source) {

			var count = 0,
				i = 0,
				name;

			if (Array.isArray(data_source)) {

				for (count = data_source.length; i < count; i++) {

					this._push(this._uid++, data_source[i], null);

				}

			} else if (data_source.isCollection) {

				this._data_names = data_source.getNames();
				this._data_values = data_source.getValues();
				for (count = this._data_values.length; i < count; i++) {

					this._data_uids.push(this._uid++);

				}

			} else {

				if (data_source.isProperties) {

					data_source = data_source.getProperties();

				}

				for (name in data_source) {

					this._push(this._uid++, data_source[name], name);

				}

			}

			this._count = this._data_uids.length;

		}

	},

	/**
	 * Update the collection from `data_source`
	 * @param {(Array|Object|Lava.mixin.Properties|Lava.system.Enumerable)} data_source
	 */
	refreshFromDataSource: function(data_source) {

		if (Lava.schema.DEBUG && typeof(data_source) != 'object') Lava.t("Wrong argument passed to updateFromSourceObject");

		if (Array.isArray(data_source)) {

			this._updateFromArray(data_source, []);

		} else if (data_source.isCollection) {

			this._updateFromEnumerable(data_source);

		} else {

			this._updateFromObject(data_source.isProperties ? data_source.getProperties() : data_source);

		}

	},

	/**
	 * Remove all current values and add values from array
	 * @param {Array} source_array
	 * @param {Array.<string>} names
	 */
	_updateFromArray: function(source_array, names) {

		var i = 0,
			count = source_array.length,
			items_removed_argument = {
				uids: this._data_uids,
				values: this._data_values,
				names: this._data_names
			};

		this._data_uids = [];
		this._data_values = [];
		this._data_names = [];

		for (; i < count; i++) {
			this._push(this._uid++, source_array[i], names[i] || null);
		}

		this._setLength(count);

		this._fire('items_removed', items_removed_argument);

		this._fire('items_added', {
			uids: this._data_uids.slice(),
			values: this._data_values.slice(),
			names: this._data_names.slice()
		});

		this._fire('collection_changed');

	},

	/**
	 * Same as `_updateFromArray`, but uses names from `data_source`
	 * @param {Lava.system.Enumerable} data_source
	 */
	_updateFromEnumerable: function(data_source) {

		this._updateFromArray(data_source.getValues(), data_source.getNames());

	},

	/**
	 * Compares item names with object keys, removing values without names and values that do not match.
	 * Adds new values from `source_object`
	 * @param {Object} source_object
	 */
	_updateFromObject: function(source_object) {

		var i = 0,
			name,
			uid,
			result = this._createHelperStorage(),
			removed = this._createHelperStorage(),
			added = this._createHelperStorage();

		for (; i < this._count; i++) {

			name = this._data_names[i];
			if (name != null && (name in source_object)) {

				if (source_object[name] === this._data_values[i]) {

					result.push(this._data_uids[i], this._data_values[i], this._data_names[i]);

				} else {

					// Attention: the name has NOT changed, but it will be present in both added and removed names!
					removed.push(this._data_uids[i], this._data_values[i], name);
					uid = this._uid++;
					result.push(uid, source_object[name], name);
					added.push(uid, source_object[name], name);

				}

			} else {

				removed.push(this._data_uids[i], this._data_values[i], this._data_names[i]);

			}

		}

		for (name in source_object) {

			if (this._data_names.indexOf(name) == -1) {

				uid = this._uid++;
				result.push(uid, source_object[name], name);
				added.push(uid, source_object[name], name);

			}

		}

		this._assignStorage(result);
		this._setLength(this._data_uids.length);

		removed.uids.length && this._fire('items_removed', removed.getObject());
		added.uids.length && this._fire('items_added', added.getObject());
		this._fire('collection_changed');

	},

	/**
	 * Append the given uid, value and name to corresponding instance arrays: `_data_uids`, `_data_values` and `_data_names`
	 * @param {number} uid
	 * @param {*} value
	 * @param {string} name
	 */
	_push: function(uid, value, name) {

		this._data_uids.push(uid);
		this._data_values.push(value);
		this._data_names.push(name);

	},

	/**
	 * Replace the corresponding `value` and `name` at specified `index`, generating a new UID
	 * @param {number} index Index of value in Enumerable
	 * @param {*} value New value for given index
	 * @param {number} [name] New name for the value
	 */
	replaceAt: function(index, value, name) {

		if (index > this._count) Lava.t("Index is out of range");

		var old_uid = this._data_uids[index],
			old_value = this._data_values[index],
			old_name = this._data_names[index],
			new_uid = this._uid++;

		this._data_uids[index] = new_uid;
		this._data_values[index] = value;
		if (name) {
			this._data_names[index] = name;
		}

		this._fire('items_removed', {
			uids: [old_uid],
			values: [old_value],
			names: [old_name]
		});

		this._fire('items_added', {
			uids: [new_uid],
			values: [value],
			names: [this._data_names[index]]
		});

		this._fire('collection_changed');

	},

	/**
	 * Add the name/value pair to the end of the collection, generating a new UID
	 * @param {*} value New value to add
	 * @param {string} [name] New name
	 * @returns {number} New collection `_count`
	 */
	push: function(value, name) {

		var count = this._count,
			new_uid = this._uid++;

		this._push(new_uid, value, name || null);

		this._setLength(count + 1);

		this._fire('items_added', {
			uids: [new_uid],
			values: [value],
			names: [name || null]
		});

		this._fire('collection_changed');

		return this._count; // after _setLength() this was incremented by one

	},

	/**
	 * If value does not exist - push it into collection
	 * @param {*} value New value
	 * @param {string} [name] New name
	 * @returns {boolean} <kw>true</kw>, if value did not exist and was included
	 */
	includeValue: function(value, name) {

		var result = false,
			index = this._data_values.indexOf(value);

		if (index == -1) {
			this.push(value, name);
			result = true;
		}

		return result;

	},

	/**
	 * Insert a sequence of values into collection
	 * @param {number} start_index Index of the beginning of new values. Must be less or equal to collection's `_count`
	 * @param {Array.<*>} values New values
	 * @param [names] Names that correspond to each value
	 */
	insertRange: function(start_index, values, names) {

		if (start_index >= this._count) Lava.t("Index is out of range");

		var i = 0,
			count = values.length,
			added_uids = [],
			added_names = [];

		if (names) {

			if (count != names.length) Lava.t("If names array is provided, it must be equal length with values array.");
			added_names = names;

		} else {

			for (; i < count; i++) {

				added_names.push(null);

			}

		}

		for (; i < count; i++) {

			added_uids.push(this._uid++);

		}

		if (start_index == 0) {

			// prepend to beginning
			this._data_uids = added_uids.concat(this._data_uids);
			this._data_values = values.concat(this._data_values);
			this._data_names = added_names.concat(this._data_names);

		} else if (start_index == this._count - 1) {

			// append to the end
			this._data_uids = this._data_uids.concat(added_uids);
			this._data_values = this._data_values.concat(values);
			this._data_names = this._data_names.concat(added_names);

		} else {

			this._data_uids = this._data_uids.slice(0, start_index).concat(added_uids).concat(this._data_uids.slice(start_index));
			this._data_values = this._data_values.slice(0, start_index).concat(values).concat(this._data_values.slice(start_index));
			this._data_names = this._data_names.slice(0, start_index).concat(added_names).concat(this._data_names.slice(start_index));

		}

		this._setLength(this._count + count);

		this._fire('items_added', {
			uids: added_uids,
			values: values,
			names: added_names
		});

		this._fire('collection_changed');

	},

	/**
	 * Append new values to the end of the collection
	 * @param {Array.<*>} values New values
	 * @param {Array.<string>} [names] Corresponding names
	 */
	append: function(values, names) {

		this.insertRange(this._count, values, names);

	},

	/**
	 * Insert a value at index
	 * @param {number} index Index to insert at
	 * @param {*} value New value
	 * @param {string} [name] New name
	 */
	insertAt: function(index, value, name) {

		this.insertRange(index, [value], [name]);

	},

	/**
	 * Put the value at the beginning of collection
	 * @param {*} value New value
	 * @param {string} [name] New name
	 */
	unshift: function(value, name) {

		this.insertRange(0, [value], [name]);

	}

});

Lava.define(
'Lava.system.DataView',
/**
 * Holds a subset of values from {@link Lava.system.Enumerable}, preserving item UIDs.
 * Can remove, filter and sort existing values, but can't be used to add new values.
 *
 * @lends Lava.system.DataView#
 * @extends Lava.system.CollectionAbstract#
 */
{

	Extends: 'Lava.system.CollectionAbstract',

	/**
	 * To tell other classes that this is instance of Enumerable
	 * @type {boolean}
	 * @readonly
	 */
	isDataView: true,

	/**
	 * The existing collection, which provides data for this instance
	 * @type {Lava.system.CollectionAbstract}
	 */
	_data_source: null,

	/**
	 * Create DataView instance
	 * @param {Lava.system.CollectionAbstract} data_source
	 */
	init: function(data_source) {

		this.guid = Lava.guid++;
		data_source && this.refreshFromDataSource(data_source);

	},

	/**
	 * Refresh the DataView from it's Enumerable
	 */
	refresh: function() {

		this._data_names = this._data_source.getNames();
		this._data_values = this._data_source.getValues();
		this._data_uids = this._data_source.getUIDs();
		this._count = this._data_uids.length;
		this._fire('collection_changed');

	},

	/**
	 * Set new `_data_source`
	 * @param {Lava.system.CollectionAbstract} data_source
	 */
	setDataSource: function(data_source) {

		if (Lava.schema.DEBUG && !data_source.isCollection) Lava.t("Wrong argument supplied for DataView constructor");
		this._data_source = data_source;

	},

	/**
	 * Set `_data_source` and refresh from it
	 * @param {Lava.system.CollectionAbstract} data_source
	 */
	refreshFromDataSource: function (data_source) {

		this.setDataSource(data_source);
		this.refresh();

	},

	/**
	 * Get `_data_source`
	 * @returns {Lava.system.CollectionAbstract}
	 */
	getDataSource: function() {

		return this._data_source;

	}

});

Lava.define(
'Lava.system.Template',
/**
 * Renderable collection of views and strings
 *
 * @lends Lava.system.Template#
 * @implements _iViewHierarchyMember
 */
{

	Shared: ['_block_handlers_map'],

	/**
	 * This class is instance of Lava.system.Template
	 */
	isTemplate: true,

	/**
	 * The nearest widget in hierarchy
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,
	/**
	 * The owner (parent) view
	 * @type {Lava.view.Abstract}
	 */
	_parent_view: null,
	/**
	 * Instance config
	 * @type {_tTemplate}
	 */
	_config: null,
	/**
	 * Count of renderable elements in template instance
	 * @type {number}
	 */
	_count: 0,
	/**
	 * The renderable items, constructed from `_config`
	 * @type {Array.<_tRenderable>}
	 */
	_content: [],
	/**
	 * Is the template currently in DOM
	 * @type {boolean}
	 */
	_is_inDOM: false,
	/**
	 * Global unique ID of the instance
	 * @type {_tGUID}
	 */
	guid: null,

	/**
	 * When creating content: handlers for every item type in `_config`
	 * @type {Object.<string, string>}
	 */
	_block_handlers_map: {
		'string': '_createDirect',
		view: '_createView',
		widget: '_createView',
		include: '_createInclude',
		static_value: '_createStaticValue',
		static_eval: '_createStaticEval',
		static_tag: '_createStaticTag'
	},

	/**
	 * Create an instance of Template. Create content from config
	 *
	 * @param {_tTemplate} template_config Config for content
	 * @param {Lava.widget.Standard} widget Nearest widget in hierarchy
	 * @param {Lava.view.Abstract} parent_view Owner (parent) view
	 * @param {Object} [child_properties] The properties to set to child views
	 */
	init: function(template_config, widget, parent_view, child_properties) {

		this.guid = Lava.guid++;
		this._parent_view = parent_view;
		this._widget = widget;
		this._config = template_config;

		this._createChildren(this._content, template_config, [], child_properties);
		this._count = this._content.length;

	},

	/**
	 * Create items from config and put them in `result`
	 * @param {Array.<_tRenderable>} result Where to put created items
	 * @param {_tTemplate} children_config Config for the Template
	 * @param {Array.<string>} include_name_stack Used to protect from recursive includes
	 * @param {Object} properties The properties for child views
	 */
	_createChildren: function(result, children_config, include_name_stack, properties) {

		var i = 0,
			count = children_config.length,
			childConfig,
			type;

		for (; i < count; i++) {

			childConfig = children_config[i];
			type = typeof(childConfig);
			if (type == 'object') type = childConfig.type;

			if (Lava.schema.DEBUG && !(type in this._block_handlers_map)) Lava.t("Unsupported template item type: " + type);
			this[this._block_handlers_map[type]](result, childConfig, include_name_stack, properties);

		}

	},

	/**
	 * Handler for strings: push it into result
	 * @param {Array.<_tRenderable>} result Created items
	 * @param {string} childConfig String from Template config
	 */
	_createDirect: function(result, childConfig) {

		result.push(childConfig);

	},

	/**
	 * Handler for views. Create a view and push it into result
	 * @param {Array.<_tRenderable>} result
	 * @param {(_cView|_cWidget)} childConfig Config vor the view
	 * @param {Array.<string>} include_name_stack Used to protect from recursive includes
	 * @param {Object} properties Properties for that view
	 */
	_createView: function(result, childConfig, include_name_stack, properties) {

		var constructor = Lava.ClassManager.getConstructor(childConfig['class'], 'Lava.view'),
			view = new constructor(
				childConfig,
				this._widget,
				this._parent_view,
				this, // template
				properties
			);

		view.template_index = result.push(view) - 1;

	},

	/**
	 * Handler for includes. Get include from widget, then create and append all items from include
	 * @param {Array.<_tRenderable>} result
	 * @param {_cInclude} child_config
	 * @param {Array.<string>} include_name_stack
	 * @param {Object} properties
	 */
	_createInclude: function(result, child_config, include_name_stack, properties) {

		if (include_name_stack.indexOf(child_config.name) != -1) Lava.t("Infinite include recursion");
		var include = Lava.view_manager.getInclude(this._parent_view, child_config);
		if (Lava.schema.DEBUG && include == null) Lava.t("Include not found: " + child_config.name);

		include_name_stack.push(child_config.name);
		this._createChildren(result, include, include_name_stack, properties);
		include_name_stack.pop();

	},

	/**
	 * Handler for static_value: get the value from widget resources and push it into result
	 * @param {Array.<_tRenderable>} result
	 * @param {_cStaticValue} childConfig
	 */
	_createStaticValue: function(result, childConfig) {

		var resource_id = childConfig.resource_id,
			resource_owner = Lava.view_manager.locateTarget(this._widget, resource_id.locator_type, resource_id.locator),
			resource_value,
			type;

		if (!Lava.schema.RESOURCES_ENABLED) Lava.t("static_value: resources are disabled");
		if (Lava.schema.DEBUG && !resource_owner) Lava.t("Resource owner not found: " + resource_id.locator_type + '=' + resource_id.locator);

		resource_value = resource_owner.getResource(resource_id.name);
		if (Lava.schema.DEBUG && !resource_value) Lava.t("static_value: resource not found: " + resource_id.locator_type + '=' + resource_id.locator);
		if (Lava.schema.DEBUG && ['string', 'number', 'boolean'].indexOf(Firestorm.getType(resource_value.value)) == -1) Lava.t("static_value: resource has wrong type");

		result.push(resource_value.value);

	},

	/**
	 * Handler for static_eval: evaluate the given Argument config and append evaluation result
	 * @param {Array.<_tRenderable>} result
	 * @param {_cStaticEval} childConfig
	 */
	_createStaticEval: function(result, childConfig) {

		var argument = new Lava.scope.Argument(childConfig.argument, this._view, this._widget);
		// if this happens - then you are probably doing something wrong
		if (argument.isWaitingRefresh()) {
			if (Lava.schema.DEBUG) Lava.t("static_eval wrong usage: created argument is dirty");
			Lava.logError("static_eval wrong usage: created argument is dirty");
		}
		result.push(argument.getValue + '');
		argument.destroy();

	},

	/**
	 * Handler for static tags: resolve it's resources, serialize it into string and push parts into result.
	 * The content of the tag is processed recursively
	 * @param {Array.<_tRenderable>} result
	 * @param {_cStaticTag} child_config
	 * @param {Array.<string>} include_name_stack
	 * @param {Object} properties
	 */
	_createStaticTag: function(result, child_config, include_name_stack, properties) {

		var resource_id = child_config.resource_id,
			resource_owner,
			container_resources,
			serialized_tag = '<' + child_config.name,
			result_styles = [],
			name,
			is_void = Lava.isVoidTag(child_config.name),

			static_attributes,
			static_classes,
			static_styles;

		if (Lava.schema.RESOURCES_ENABLED) {
			resource_owner = Lava.view_manager.locateTarget(this._widget, resource_id.locator_type, resource_id.locator);
			if (Lava.schema.DEBUG && !resource_owner) Lava.t("Resource owner not found: " + resource_id.locator_type + '=' + resource_id.locator);
			container_resources = resource_owner.getResource(resource_id.name);
		}

		if (Lava.schema.DEBUG && !Lava.schema.RESOURCES_ENABLED) Lava.t("Unable to render a static container: resources are disabled");
		if (Lava.schema.DEBUG && !container_resources) Lava.t("Static container, resources not found: " + resource_id.name);
		if (Lava.schema.DEBUG && container_resources.type != 'container') Lava.t("Malformed/invalid container resource: " + resource_id.locator_type + '=' + resource_id.locator);

		static_attributes = container_resources.value['static_properties'];
		static_classes = container_resources.value['static_classes'];
		static_styles = container_resources.value['static_styles'];

		if (static_attributes) {
			serialized_tag += Lava.parsers.Common.renderTagAttributes(static_attributes);
		}

		if (static_classes) {
			serialized_tag += ' class="' + static_classes.join(' ') + '"';
		}

		if (static_styles) {

			for (name in static_styles) {

				result_styles.push(name + ':' + static_styles);

			}

			serialized_tag += ' style="' + result_styles.join(';') + '"';

		}

		if (child_config.template) {

			if (Lava.schema.DEBUG && is_void) Lava.t();

			result.push(serialized_tag + '>');
			this._createChildren(result, child_config.template, include_name_stack, properties);
			result.push('</' + child_config.name + '>');

		} else {

			serialized_tag += is_void ? '/>' : '></' + child_config.name + '>';
			result.push(serialized_tag);

		}

	},

	/**
	 * Perform broadcast
	 * @param {string} function_name
	 */
	_broadcast: function(function_name) {

		for (var i = 0; i < this._count; i++) {

			if (this._content[i].isView) {

				this._content[i][function_name]();

			}

		}

	},

	/**
	 * Render template
	 * @returns {string} Rendered HTML
	 */
	render: function() {

		var buffer = '',
			i = 0,
			content = this._content;

		for (; i < this._count; i++) {

			if (typeof(content[i]) == 'string') {

				buffer += content[i];

			} else if (typeof(content[i]) == 'function') {

				Lava.t("Not implemented");

			} else {

				buffer += content[i].render();

			}

		}

		return buffer;

	},

	/**
	 * Broadcast <str>"broadcastRemove"</str> to instance content
	 */
	broadcastRemove: function() {

		if (this._is_inDOM) {

			this._is_inDOM = false;
			this._broadcast('broadcastRemove');

		}

	},

	/**
	 * Broadcast <str>"broadcastInDOM"</str> to instance content
	 */
	broadcastInDOM: function() {

		this._is_inDOM = true;
		this._broadcast('broadcastInDOM');

	},

	/**
	 * Set this property to all views inside `_content`
	 * @param {string} name Property name
	 * @param {*} value Property value
	 */
	batchSetProperty: function(name, value) {

		for (var i = 0; i < this._count; i++) {

			if (this._content[i].isView) {

				this._content[i].set(name, value);

			}

		}

	},

	/**
	 * Set properties to all views inside `_content`
	 * @param {Object} properties_object
	 */
	batchSetProperties: function(properties_object) {

		for (var i = 0; i < this._count; i++) {

			if (this._content[i].isView) {

				this._content[i].setProperties(properties_object);

			}

		}

	},

	/**
	 * Find first view in `_content` and return it
	 * @returns {Lava.view.Abstract} First view
	 */
	getFirstView: function() {

		return this._seekForwards(0);

	},

	/**
	 * Find last view in `_content` and return it
	 * @returns {Lava.view.Abstract} Last view
	 */
	getLastView: function() {

		return this._seekBackwards(this._count - 1);

	},

	/**
	 * Find a view, preceding the given one
	 * @param {Lava.view.Abstract} view Current view
	 * @returns {Lava.view.Abstract} Previous view
	 */
	getPreviousView: function(view) {

		return this._seekBackwards(view.template_index - 1);

	},

	/**
	 * Find next view
	 * @param {Lava.view.Abstract} view Current view
	 * @returns {Lava.view.Abstract} Next view
	 */
	getNextView: function(view) {

		return this._seekForwards(view.template_index + 1);

	},

	/**
	 * Algorithm to find next view
	 * @returns {Lava.view.Abstract} Next view from index `i`
	 */
	_seekForwards: function(i) {

		var result = null;

		while (i < this._count) {
			if (this._content[i].isView) {
				result = this._content[i];
				break;
			}
			i++;
		}

		return result;

	},

	/**
	 * Algorithm to find previous view
	 * @returns {Lava.view.Abstract} Previous view to index `i`
	 */
	_seekBackwards: function(i) {

		var result = null;

		while (i >= 0) {
			if (this._content[i].isView) {
				result = this._content[i];
				break;
			}
			i--;
		}

		return result;

	},

	/**
	 * Search `_content` and find all views with given label
	 * @param {string} label Label to search for
	 * @returns {Array.<Lava.view.Abstract>} Views with given label
	 */
	getViewsByLabel: function(label) {

		var result = [],
			i = 0;

		for (; i < this._count; i++) {

			if (this._content[i].isView && this._content[i].label == label) {

				result.push(this._content[i]);

			}

		}

		return result;

	},

	/**
	 * Find all widgets with given name inside `_content`
	 * @param {string} name Name to search for
	 * @returns {Array.<Lava.widget.Standard>} Found widgets
	 */
	getWidgetsByName: function(name) {

		var result = [],
			i = 0;

		for (; i < this._count; i++) {

			if (this._content[i].isWidget && this._content[i].name == name) {

				result.push(this._content[i]);

			}

		}

		return result;

	},

	/**
	 * Get `_count`
	 * @returns {number} `_count`
	 */
	getCount: function() {

		return this._count;

	},

	/**
	 * Return an item from `_content` at given index
	 * @param {number} index Index in `_content`
	 * @returns {_tRenderable} Requested item
	 */
	getAt: function(index) {

		return this._content[index];

	},

	/**
	 * Get `_is_inDOM`
	 * @returns {boolean}
	 */
	isInDOM: function() {

		return this._is_inDOM;

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		this._broadcast('destroy');
		this._content = null;

	}

});
/**
 * Each time a DOM event is received, ViewManager assembles an array from the element, which is source of the event, and all it's parents.
 * "EVENTNAME" is replaced with actual event name, like "mouseover_stack_changed".
 * You must not modify the the argument of this event, but you can slice() it.
 *
 * @event Lava.system.ViewManager#EVENTNAME_stack_changed
 * @type {Array.<HTMLElement>}
 * @lava-type-description List of elements, with the first item in array being the event source,
 *  and all it's parents. Readonly.
 */

Lava.define(
'Lava.system.ViewManager',
/**
 * Refreshes views and routes view events and roles
 *
 * @lends Lava.system.ViewManager#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',

	/**
	 * Views and widgets, sorted by depth level
	 * @type {Array.<Array.<Lava.view.Abstract>>}
	 */
	_dirty_views: [],
	/**
	 * View refresh loop is in progress
	 * @type {boolean}
	 */
	_is_refreshing: false,

	/**
	 * Hash of all views with user-defined ID
	 * @type {Object.<string, Lava.view.Abstract>}
	 */
	_views_by_id: {},
	/**
	 * Hash of all views by their GUID
	 * @type {Object.<*, Lava.view.Abstract>}
	 */
	_views_by_guid: {},

	/**
	 * Global user-assigned handlers for unhandled roles. <role_name> => [widgets_that_will_handle_it]
	 * @type {Object.<string, Array.<Lava.widget.Standard>>}
	 */
	_global_role_targets: {},
	/**
	 * Global user-assigned handlers for unhandled events
	 * @type {Object.<string, Array.<Lava.widget.Standard>>}
	 */
	_global_event_targets: {},

	/**
	 * Used in mouse events processing algorithm
	 * @type {HTMLElement}
	 */
	_old_mouseover_target: null,
	/**
	 * Parents of `_old_mouseover_target` (and `_old_mouseover_target` itself)
	 * @type {Array.<HTMLElement>}
	 */
	_old_mouseover_view_stack: [],
	/**
	 * Used in mouse events processing algorithm
	 * @type {HTMLElement}
	 */
	_new_mouseover_target: null,
	/**
	 * Parents of `_new_mouseover_target` (and `_new_mouseover_target` itself)
	 * @type {Array.<HTMLElement>}
	 */
	_new_mouseover_view_stack: [],

	/**
	 * Counters for event consumers
	 * @type {Object.<string, number>}
	 */
	_event_usage_counters: {},
	/**
	 * Listeners from {@link Lava.Core} for each DOM event
	 * @type {Object.<string, _tListener>}
	 */
	_events_listeners: {
		mouseover: null,
		mouseout: null
	},

	/**
	 * Whether to cancel bubbling of current event or role
	 * @type {boolean}
	 */
	_cancel_bubble: false,

	/**
	 * How many dispatch cycles are currently running
	 * @type {number}
	 */
	_nested_dispatch_count: 0,
	/**
	 * Number of the current refresh loop
	 * @type {number}
	 */
	_refresh_id: 0,

    /**
     * Timeout id of the next scheduled refresh cycle.
     * @type {number}
     */
    _refresh_timeout: null,

	/**
	 * Create an instance of the class, acquire event listeners
	 */
	init: function() {

		var default_events = Lava.schema.system.DEFAULT_EVENTS,
			i = 0,
			count = default_events.length;

		for (; i < count; i++) {

			this._event_usage_counters[default_events[i]] = 1;
			this._initEvent(default_events[i]);

		}

        this.scheduleViewRefresh = this.scheduleViewRefresh_Initial;

	},

    scheduleViewRefresh: function(view) {

        Lava.t("Framework requires initialization");

    },

    scheduleViewRefresh_Initial: function(view) {

        this.scheduleRefresh();
        this.scheduleViewRefresh = this.scheduleViewRefresh_Normal;
        this.scheduleViewRefresh(view);

    },

	/**
	 * Place a view into queue for refresh
	 * @param {Lava.view.Abstract} view
	 */
    scheduleViewRefresh_Normal: function(view) {

		if (view.depth in this._dirty_views) {

			this._dirty_views[view.depth].push(view);

		} else {

			this._dirty_views[view.depth] = [view];

		}

	},

    /**
     * Schedule refresh after current thread exits (unless `refresh()` was called in the current thread).
     */
    scheduleRefresh: function () {

        if (!this._refresh_timeout) {
            var self = this;
            this._refresh_timeout = window.setTimeout(function () {
                self._refresh_timeout = null;
                self.refresh();
            }, 0);
        }

    },

	/**
	 * View refresh cycle. Call {@link Lava.view.Abstract#refresh} of all views in the queue, starting from the root views
	 */
	refresh: function() {

		if (Lava.Core.isProcessingEvent()) {
			Lava.logError("ViewManager::refresh() must not be called inside event listeners");
			return;
		}

		if (this._is_refreshing) {
			Lava.logError("ViewManager: recursive call to refresh()");
			return;
		}

		Lava.ScopeManager.refresh();

		if (this._dirty_views.length) {

			this._is_refreshing = true;
			Lava.ScopeManager.lock();
			this._refresh_id++;

			do {
				var dirty_views = this._dirty_views,
					has_exceptions;
				this._dirty_views = [];
				has_exceptions = this._refreshCycle(dirty_views);
			} while (this._dirty_views.length && !has_exceptions);

			Lava.ScopeManager.unlock();
			this._is_refreshing = false;

		}

        if (this._refresh_timeout) {
            window.clearTimeout(this._refresh_timeout);
            this._refresh_timeout = null;
        }

        this.scheduleViewRefresh = this.scheduleViewRefresh_Initial;

	},

	/**
	 * Repeatable callback, that performs refresh of dirty views
	 * @param {Array.<Array.<Lava.view.Abstract>>} dirty_views
	 */
	_refreshCycle: function(dirty_views) {

		var level = 0,
			deepness,
			views_list,
			has_exceptions = false,
			i,
			count;

		deepness = dirty_views.length; // this line must be after ScopeManager#refresh()

		for (; level < deepness; level++) {

			if (level in dirty_views) {

				views_list = dirty_views[level];

				for (i = 0, count = views_list.length; i < count; i++) {

					if (views_list[i].refresh(this._refresh_id)) {
						Lava.logError("ViewManager: view was refreshed several times in one refresh loop. Aborting.");
						has_exceptions = true;
					}

				}

			}

		}

		return has_exceptions;

	},

	/**
	 * Get `_is_refreshing`
	 * @returns {boolean}
	 */
	isRefreshing: function() {

		return this._is_refreshing;

	},

	/**
	 * Add a newly created view to local collections: `_views_by_guid` and `_views_by_id`
	 * @param {Lava.view.Abstract} instance
	 */
	registerView: function(instance) {

		this._views_by_guid[instance.guid] = instance;

		if (instance.id) {

			if (Lava.schema.DEBUG && (instance.id in this._views_by_id)) Lava.t("Duplicate view id: " + instance.id);
			this._views_by_id[instance.id] = instance;

		}

	},

	/**
	 * Remove a destroyed view from local collections
	 * @param {Lava.view.Abstract} instance
	 */
	unregisterView: function(instance) {

		delete this._views_by_guid[instance.guid];

		if (instance.id) {

			delete this._views_by_id[instance.id];

		}

	},

	/**
	 * Get a view with given user-defined ID
	 * @param {string} id
	 * @returns {Lava.view.Abstract}
	 */
	getViewById: function(id) {

		return this._views_by_id[id];

	},

	/**
	 * Get view by global unique identifier
	 * @param {_tGUID} guid
	 * @returns {Lava.view.Abstract}
	 */
	getViewByGuid: function(guid) {

		return this._views_by_guid[guid];

	},

	/**
	 * Get widget by id. Does not take hierarchy into account
	 * @param {Lava.widget.Standard} starting_widget
	 * @param {string} id
	 * @returns {Lava.view.Abstract}
	 */
	_locateWidgetById: function(starting_widget, id) {

		if (Lava.schema.DEBUG && !id) Lava.t();

		return this._views_by_id[id];

	},

	/**
	 * Get widget by GUID. Does not consider hierarchy
	 * @param {Lava.widget.Standard} starting_widget
	 * @param {_tGUID} guid
	 * @returns {Lava.view.Abstract}
	 */
	_locateWidgetByGuid: function(starting_widget, guid) {

		if (Lava.schema.DEBUG && !guid) Lava.t();

		return this._views_by_guid[guid];

	},

	/**
	 * Find first widget with given name among parents of the given widget (including widget itself)
	 * @param {Lava.widget.Standard} widget Starting widget
	 * @param {string} name Name to search for
	 * @returns {?Lava.widget.Standard}
	 */
	_locateWidgetByName: function(widget, name) {

		if (Lava.schema.DEBUG && !name) Lava.t();

		while (widget && widget.name != name) {

			widget = widget.getParentWidget();

		}

		return widget;

	},

	/**
	 * Find first widget with given label among parents of the given widget (including widget itself)
	 *
	 * @param {Lava.widget.Standard} widget Starting widget
	 * @param {string} label
	 * @returns {?Lava.widget.Standard}
	 */
	_locateWidgetByLabel: function(widget, label) {

		if (Lava.schema.DEBUG && !label) Lava.t();

		// Targets are different from view locators, there must be no hardcoded '@widget' label, like in views
		// ('@widget' label may be very harmful in this case. Use widget names instead!)

		if (label == 'root') {

			while (widget.getParentWidget()) {

				widget = widget.getParentWidget();

			}

		} else {

			while (widget && widget.label != label) {

				widget = widget.getParentWidget();

			}

		}

		return widget;

	},

	/**
	 * Get a widget from hierarchy by given route
	 * @param {Lava.widget.Standard} starting_widget The child widget to start search
	 * @param {_eViewLocatorType} locator_type
	 * @param {string} locator Locator argument
	 * @returns {?Lava.widget.Standard}
	 */
	locateTarget: function(starting_widget, locator_type, locator) {

		return this['_locateWidgetBy' + locator_type](starting_widget, locator);

	},

	/**
	 * Dispatch events and roles to their targets.
	 * Warning! Violates codestyle with multiple return statements
	 *
	 * @param {Lava.view.Abstract} view The source of events or roles
	 * @param {Array.<_cTarget>} targets The target routes
	 * @param {function} callback The ViewManager callback that will perform dispatching
	 * @param {*} callback_arguments Will be passed to `callback`
	 * @param {Object.<string, Array>} global_targets_object Either {@link Lava.system.ViewManager#_global_role_targets}
	 *  or {@link Lava.system.ViewManager#_global_event_targets}
	 */
	_dispatchCallback: function(view, targets, callback, callback_arguments, global_targets_object) {

		var i = 0,
			count = targets.length,
			target,
			target_name,
			widget,
			template_arguments,
			bubble_index = 0,
			bubble_targets_copy,
			bubble_targets_count;

		this._nested_dispatch_count++;

		for (; i < count; i++) {

			target = targets[i];
			target_name = target.name;
			template_arguments = ('arguments' in target) ? this._evalTargetArguments(view, target) : null;
			widget = null;

			if ('locator_type' in target) {

				/*
				 Note: there is similar view location mechanism in view.Abstract, but the algorithms are different:
				 when ViewManager seeks by label - it searches only for widgets, while view checks all views in hierarchy.
				 Also, hardcoded labels differ.
				 */
				widget = this['_locateWidgetBy' + target.locator_type](view.getWidget(), target.locator);

				if (!widget) {

					Lava.logError('ViewManager: callback target (widget) not found. Type: ' + target.locator_type + ', locator: ' + target.locator);

				} else if (!widget.isWidget) {

					Lava.logError('ViewManager: callback target is not a widget');

				} else if (!callback(widget, target_name, view, template_arguments, callback_arguments)) {

					Lava.logError('ViewManager: targeted widget did not handle the role or event: ' + target_name);

				}

				// ignore possible call to cancelBubble()
				this._cancel_bubble = false;

			} else {

				// bubble
				widget = view.getWidget();

				do {

					callback(widget, target_name, view, template_arguments, callback_arguments);
					widget = widget.getParentWidget();

				} while (widget && !this._cancel_bubble);

				if (this._cancel_bubble) {
					this._cancel_bubble = false;
					continue;
				}

				if (target_name in global_targets_object) {

					// cause target can be removed inside event handler
					bubble_targets_copy = global_targets_object[target_name].slice();
					for (bubble_targets_count = bubble_targets_copy.length; bubble_index < bubble_targets_count; bubble_index++) {

						callback(
							bubble_targets_copy[bubble_index],
							target_name,
							view,
							template_arguments,
							callback_arguments
						);

						if (this._cancel_bubble) {
							this._cancel_bubble = false;
							break;
						}

					}

				}

			}

		}

		this._nested_dispatch_count--;

	},

	/**
	 * Callback for dispatching roles: call widget's role handler
	 *
	 * @param {Lava.widget.Standard} widget
	 * @param {string} target_name
	 * @param {Lava.view.Abstract} view
	 * @param {Array.<*>} template_arguments
	 * @returns {boolean}
	 */
	_callRegisterViewInRole: function(widget, target_name, view, template_arguments) {

		return widget.handleRole(target_name, view, template_arguments);

	},

	/**
	 * Dispatch roles
	 * @param {Lava.view.Abstract} view
	 * @param {Array.<_cTarget>} targets
	 */
	dispatchRoles: function(view, targets) {

		this._dispatchCallback(
			view,
			targets,
			this._callRegisterViewInRole,
			null,
			this._global_role_targets
		);

	},

	/**
	 * Callback for dispatching events: call the widget's event handler
	 * @param {Lava.widget.Standard} widget
	 * @param {string} target_name
	 * @param {Lava.view.Abstract} view
	 * @param {Array.<*>} template_arguments
	 * @param {Object} callback_arguments
	 * @returns {boolean}
	 */
	_callHandleEvent: function(widget, target_name, view, template_arguments, callback_arguments) {

		return widget.handleEvent(
			callback_arguments.event_name,
			callback_arguments.event_object,
			target_name,
			view,
			template_arguments
		);

	},

	/**
	 * Helper method which checks for events presence on container and dispatches them
	 * @param {Lava.view.Abstract} view
	 * @param {string} event_name
	 * @param {Object} event_object
	 */
	_dispatchViewEvent: function(view, event_name, event_object) {

		var targets = view.getContainer().getEventTargets(event_name);

		if (targets) {

			this.dispatchEvent(view, event_name, event_object, targets);

		}

	},

	/**
	 * Dispatch DOM events to targets
	 *
	 * @param {Lava.view.Abstract} view View, that owns the container, which raised the events
	 * @param {string} event_name
	 * @param {Object} event_object DOM event object
	 * @param {Array.<_cTarget>} targets
	 */
	dispatchEvent: function(view, event_name, event_object, targets) {

		this._dispatchCallback(
			view,
			targets,
			this._callHandleEvent,
			{
				event_name: event_name,
				event_object: event_object
			},
			this._global_event_targets
		);

	},

	/**
	 * Evaluate template arguments
	 * @param {Lava.view.Abstract} view
	 * @param {_cTarget} target
	 * @returns {Array.<*>}
	 */
	_evalTargetArguments: function(view, target) {

		var result = [];

		for (var i = 0, count = target.arguments.length; i < count; i++) {

			if (target.arguments[i].type == Lava.TARGET_ARGUMENT_TYPES.VALUE) {

				result.push(target.arguments[i].data);

			} else {

				if (target.arguments[i].type != Lava.TARGET_ARGUMENT_TYPES.BIND) Lava.t();

				result.push(view.evalPathConfig(target.arguments[i].data));

			}

		}

		return result;

	},

	/**
	 * Get include from widget
	 * @param {Lava.view.Abstract} starting_view
	 * @param {_cInclude} config
	 * @returns {_tTemplate}
	 */
	getInclude: function(starting_view, config) {

		var widget = starting_view.getWidget(),
			template_arguments = ('arguments' in config) ? this._evalTargetArguments(starting_view, config) : null;

		if ('locator_type' in config) {

			widget = this['_locateWidgetBy' + config.locator_type](widget, config.locator);
			if (!widget || !widget.isWidget) Lava.t("getInclude: Unable to find widget with [" + config.locator_type + "=" + config.locator + "]");

		}

		return widget.getInclude(config.name, template_arguments);

	},

	/**
	 * Add a widget which will globally handle bubbling events
	 * @param {string} callback_name
	 * @param {Lava.widget.Standard} widget
	 */
	addGlobalEventTarget: function(callback_name, widget) {

		this._addTarget(this._global_event_targets, callback_name, widget);

	},

	/**
	 * Remove a widget, added with {@link Lava.system.ViewManager#addGlobalEventTarget}
	 * @param {string} callback_name
	 * @param {Lava.widget.Standard} widget
	 */
	removeGlobalEventTarget: function(callback_name, widget) {

		this._removeTarget(this._global_event_targets, callback_name, widget);

	},

	/**
	 * Add a widget which will globally handle bubbling roles
	 * @param {string} callback_name
	 * @param {Lava.widget.Standard} widget
	 */
	addGlobalRoleTarget: function(callback_name, widget) {

		this._addTarget(this._global_role_targets, callback_name, widget);

	},

	/**
	 * Remove widget added with {@link Lava.system.ViewManager#addGlobalRoleTarget}
	 * @param {string} callback_name
	 * @param {Lava.widget.Standard} widget
	 */
	removeGlobalRoleTarget: function(callback_name, widget) {

		this._removeTarget(this._global_role_targets, callback_name, widget);

	},

	/**
	 * Perform {@link Lava.system.ViewManager#addGlobalEventTarget} or {@link Lava.system.ViewManager#addGlobalRoleTarget}
	 * @param {Object} storage
	 * @param {string} name
	 * @param {Lava.widget.Standard} widget
	 */
	_addTarget: function(storage, name, widget) {

		if (name in storage) {

			if (storage[name].indexOf(widget) == -1) {

				storage[name].push(widget);

			} else {

				Lava.logError('[ViewManager] Duplicate target: ' + name);

			}

		} else {

			storage[name] = [widget];

		}

	},

	/**
	 * Remove widget, added with {@link Lava.system.ViewManager#_addTarget}
	 * @param {Object} storage
	 * @param {string} name
	 * @param {Lava.widget.Standard} widget
	 */
	_removeTarget: function(storage, name, widget) {

		if (!(name in storage)) Lava.t("Trying to remove a global event target for nonexistent event");

		var index = storage[name].indexOf(widget);

		if (index !== -1) {

			storage[name].splice(index, 1);

		}

	},

	/**
	 * Get the view, the container of which owns the given element.
	 * This method checks solely the given element (it does not check parents).
	 * @param {HTMLElement} element
	 * @returns {Lava.view.Abstract}
	 */
	getViewByElement: function(element) {

		var id = Firestorm.Element.getAttribute(element, 'id'),
			result = null;

		if (id && id.indexOf(Lava.ELEMENT_ID_PREFIX) == 0) {

			result = this.getViewByGuid(id.substr(Lava.ELEMENT_ID_PREFIX.length));

		}

		return result;

	},

	/**
	 * Filter all created views and find those with `label`. Slow!
	 * @param {string} label
	 * @returns {Array.<Lava.view.Abstract>}
	 */
	getViewsByLabel: function(label) {

		var result = [];

		for (var guid in this._views_by_guid) {

			if (this._views_by_guid[guid].label == label) {

				result.push(this._views_by_guid[guid]);

			}

		}

		return result;

	},

	/**
	 * Algorithm for dispatching of mouseenter, mouseleave, mouseover and mouseout events to views.
	 * Maintains stack of elements under cursor, dispatches {@link Lava.system.ViewManager#event:EVENTNAME_stack_changed}
	 * @param {string} event_name
	 * @param {Object} event_object
	 */
	handleMouseMovement:  function(event_name, event_object) {

		var new_mouseover_target = (event_name == 'mouseover') ? event_object.target : event_object.relatedTarget,
			new_mouseover_element_stack = new_mouseover_target ? this._buildElementStack(new_mouseover_target) : [],
			new_mouseover_view_stack = [],
			view,
			container,
			i,
			count;

		if (this._new_mouseover_target !== new_mouseover_target) {

			// Warning! You must not modify `new_mouseover_element_stack` array!
			this._fire('mouseover_stack_changed', new_mouseover_element_stack);

			if (new_mouseover_target) { // moved from one element to another or entered the window

				for (i = 0, count = new_mouseover_element_stack.length; i < count; i++) {
					view = this.getViewByElement(new_mouseover_element_stack[i]);
					if (view) {
						container = view.getContainer();
						if (container.isElementContainer) {
							new_mouseover_view_stack.push(view);
						}
					}
				}

			}

			this._old_mouseover_target = this._new_mouseover_target;
			this._new_mouseover_target = new_mouseover_target;
			this._old_mouseover_view_stack = this._new_mouseover_view_stack;
			this._new_mouseover_view_stack = new_mouseover_view_stack;

		}

		if (event_name == 'mouseout') {

			for (i = 0, count = this._old_mouseover_view_stack.length; i < count; i++) {

				if (this._new_mouseover_view_stack.indexOf(this._old_mouseover_view_stack[i]) == -1) {

					this._dispatchViewEvent(this._old_mouseover_view_stack[i], 'mouseleave', event_object);

				}

				this._dispatchViewEvent(this._old_mouseover_view_stack[i], 'mouseout', event_object);

			}

		} else {

			for (i = 0, count = this._new_mouseover_view_stack.length; i < count; i++) {

				this._dispatchViewEvent(this._new_mouseover_view_stack[i], 'mouseover', event_object);

				if (this._old_mouseover_view_stack.indexOf(this._new_mouseover_view_stack[i]) == -1) {

					this._dispatchViewEvent(this._new_mouseover_view_stack[i], 'mouseenter', event_object);

				}

			}

		}

	},

	/**
	 * Create an array from element and all it's parents
	 * @param {HTMLElement} element
	 * @returns {Array.<HTMLElement>}
	 */
	_buildElementStack: function(element) {

		// note: target of some events can be the root html tag (for example, mousedown on a scroll bar)
		var document_ref = window.document, // document > html > body > ...
			result = [];

		while (element && element != document_ref) {

			result.push(element);
			element = element.parentNode;

		}

		// you must not modify the returned array, but you can slice() it
		if (Lava.schema.DEBUG && Object.freeze) {
			Object.freeze(result);
		}

		return result;

	},

	/**
	 * Dispatch DOM events to views
	 * @param {string} event_name
	 * @param {Object} event_object
	 */
	onDOMEvent: function(event_name, event_object) {

		var target = event_object.target,
			view,
			container,
			stack_changed_event_name = event_name + '_stack_changed',
			stack = target ? this._buildElementStack(target) : [],
			i = 0,
			count = stack.length;

		// Warning! You must not modify the `stack` array!
		this._fire(stack_changed_event_name, stack);

		for (; i < count; i++) {
			view = this.getViewByElement(stack[i]);
			if (view) {
				container = view.getContainer();
				if (container.isElementContainer) {
					if (container.getEventTargets(event_name)) {
						this.dispatchEvent(view, event_name, event_object, container.getEventTargets(event_name));
					}
				}
			}
		}

	},

	/**
	 * Register an event consumer and start routing that event
	 * @param {string} event_name
	 */
	lendEvent: function(event_name) {

		if (Lava.schema.DEBUG && ['mouseenter', 'mouseleave', 'mouseover', 'mouseout'].indexOf(event_name) != -1)
			Lava.t("The following events: mouseenter, mouseleave, mouseover and mouseout are served by common alias - mouse_events");

		if (this._event_usage_counters[event_name]) {

			this._event_usage_counters[event_name]++;

		} else {

			this._event_usage_counters[event_name] = 1;
			this._initEvent(event_name);

		}

	},

	/**
	 * Start listening to an event
	 * @param {string} event_name
	 */
	_initEvent: function(event_name) {

		if (event_name == 'mouse_events') {

			this._events_listeners['mouseover'] =
				Lava.Core.addGlobalHandler('mouseover', this.handleMouseMovement, this);
			this._events_listeners['mouseout'] =
				Lava.Core.addGlobalHandler('mouseout', this.handleMouseMovement, this);

		} else {

			this._events_listeners[event_name] =
				Lava.Core.addGlobalHandler(event_name, this.onDOMEvent, this);

		}

	},

	/**
	 * Inform that event consumer does not need that event anymore
	 * @param {string} event_name
	 */
	releaseEvent: function(event_name) {

		if (this._event_usage_counters[event_name] == 0) {
			Lava.logError("ViewManager: trying to release an event with zero usage.");
			return;
		}

		this._event_usage_counters[event_name]--;

		if (this._event_usage_counters[event_name] == 0) {

			this._shutdownEvent(event_name);

		}

	},

	/**
	 * Is event routed to views (routing starts with a call to `lendEvent`)
	 * @param {string} event_name Event name
	 * @returns {boolean}
	 */
	isEventRouted: function(event_name) {

		return this._event_usage_counters[event_name] > 0;

	},

	/**
	 * Stop listening to an event
	 * @param {string} event_name
	 */
	_shutdownEvent: function(event_name) {

		if (event_name == 'mouse_events') {

			Lava.Core.removeGlobalHandler(this._events_listeners['mouseover']);
			this._events_listeners['mouseover'] = null;
			Lava.Core.removeGlobalHandler(this._events_listeners['mouseout']);
			this._events_listeners['mouseout'] = null;

		} else {

			Lava.Core.removeGlobalHandler(this._events_listeners[event_name]);
			this._events_listeners[event_name] = null;

		}

	},

	/**
	 * Stop bubbling current event or role
	 */
	cancelBubble: function() {

		if (!this._nested_dispatch_count) {
			Lava.logError("Call to cancelBubble outside of dispatch cycle");
			return;
		}
		this._cancel_bubble = true;

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		for (var name in this._events_listeners) {

			if (this._events_listeners[name]) {

				Lava.Core.removeGlobalHandler(this._events_listeners[name]);
				this._events_listeners[name] = null;
				this._event_usage_counters[name] = 0;

			}

		}

	}

});

Lava.define(
'Lava.system.App',
/**
 * Place for user-defined business-logic
 *
 * @lends Lava.system.App#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',

	/**
	 * Global named modules
	 * @type {Object.<string, Lava.data.Module>}
	 */
	_modules: {},

	/**
	 * Get a global named module instance
	 * @param {string} name Module name
	 * @returns {Lava.data.Module}
	 */
	getModule: function(name) {

		if (!(name in this._modules)) {

			var config = Lava.schema.modules[name],
				className = config.type || Lava.schema.data.DEFAULT_MODULE_CLASS,
				constructor = Lava.ClassManager.getConstructor(className, 'Lava.data');

			// construction is split into two phases, cause initFields() may reference other modules
			// - this will result in recursive call to getModule().
			// In case of circular dependency, the first module must be already constructed.
			this._modules[name] = new constructor(this, config, name);
			this._modules[name].initFields();

		}

		return this._modules[name];

	},

	/**
	 * Allow user to fire an event from application's instance
	 * @param {string} event_name
	 * @param {*} event_args
	 */
	fireGlobalEvent: function(event_name, event_args) {

		this._fire(event_name, event_args);

	},

	/**
	 * Destroy this App instance and all modules
	 */
	destroy:  function() {

		for (var name in this._modules) {
			this._modules[name].destroy();
		}

	}

});

Lava.define(
'Lava.system.Sugar',
/**
 * Parser syntax extension for widgets
 *
 * @lends Lava.system.Sugar#
 */
{

	/**
	 * Handlers for root types, {@link _eSugarRootContentType}
	 * @type {Object.<string, string>}
	 */
	_root_map: {
		include: '_parseInclude',
		storage: '_parseStorage',
		union: '_parseUnion',
		storage_object: '_parseStorageObject'
	},

	/**
	 * Tag types, allowed to be inside {@link _eSugarRootContentType|_eSugarRootContentType.union}
	 * (except storage tags, which are processed separately)
	 * @type {Object.<string, string>}
	 */
	_union_handlers: {
		include: '_parseInclude'
	},

	/**
	 * The types of attributes that can be on root object, type => handler_name
	 * @type {Object.<string, string>}
	 */
	_root_attributes_handlers: {
		expressions_option: '_parseRootExpressionsOptionAttribute',
		targets_option: '_parseRootTargetsOptionAttribute',
		property: '_parseRootPropertyAttribute',
		'switch': '_parseRootSwitchAttribute', // option, not property
		option: '_parseRootOptionAttribute',
		id: '_parseRootIdAttribute'
	},

	/**
	 * Parse raw tag as a widget
	 * @param {_cSugar} schema
	 * @param {_cRawTag} raw_tag
	 * @param {string} parent_title
	 */
	parse: function(schema, raw_tag, parent_title) {

		var widget_config = Lava.parsers.Common.createDefaultWidgetConfig(),
			tags,
			name,
			x = raw_tag.x;

		widget_config['extends'] = parent_title;

		if (raw_tag.content) {

			// Lava.isVoidTag is a workaround for <x:attach_directives>
			// It's highly discouraged to make sugar from void tags
			if (Lava.isVoidTag(raw_tag.name) || !schema.content_schema) {

				tags = Lava.parsers.Common.asBlocks(raw_tag.content);
				tags = this._applyTopDirectives(tags, widget_config);
				if (Lava.schema.DEBUG && tags.length) Lava.t("Widget is not allowed to have any content: " + raw_tag.name);

			} else {

				if (Lava.schema.DEBUG && !(schema.content_schema.type in this._root_map)) Lava.t("Unknown type of content in sugar: " + schema.content_schema.type);
				this[this._root_map[schema.content_schema.type]](schema.content_schema, raw_tag, widget_config, schema.content_schema.name);

			}

		}

		if (raw_tag.attributes) {

			this._parseRootAttributes(schema, raw_tag, widget_config);

		}

		if (x) {

			if (Lava.schema.DEBUG && x) {
				for (name in x) {
					if (['label', 'roles', 'resource_id', 'controller'].indexOf(name) == -1) Lava.t("Control attribute is not allowed on sugar: " + name);
				}
			}

			if ('label' in x) this.setViewConfigLabel(widget_config, x.label);
			if ('roles' in x) widget_config.roles = Lava.parsers.Common.parseTargets(x.roles);
			if ('resource_id' in x) widget_config.resource_id = Lava.parsers.Common.parseResourceId(x.resource_id);
			if ('controller' in x) widget_config.real_class = x.controller;

		}

		return widget_config;

	},

	/**
	 * Inside sugar tag there may be directives at the top. Apply them to widget config and cut away
	 * @param {_tRawTemplate} raw_blocks The content inside widget's sugar tag
	 * @param {_cWidget} widget_config The config of the widget being parsed
	 * @returns {_tRawTemplate} New content without directives
	 */
	_applyTopDirectives: function(raw_blocks, widget_config) {

		var i = 0,
			count = raw_blocks.length,
			result = [];

		for (; i < count; i++) {

			if (raw_blocks[i].type == 'directive') {
				if (Lava.parsers.Directives.processDirective(raw_blocks[i], widget_config, true)) Lava.t("Directive inside sugar has returned a value: " + raw_blocks[i].name);
			} else {
				result = raw_blocks.slice(i);
				break;
			}

		}

		return result;

	},

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// root parsers

	/**
	 * Parse widget's tag content as include
	 * @param {_cSugarContent} content_schema
	 * @param {_cRawTag} raw_tag Widget's tag
	 * @param {_cWidget} widget_config
	 * @param {string} name Include name
	 */
	_parseInclude: function(content_schema, raw_tag, widget_config, name) {

		if (Lava.schema.DEBUG && !name) Lava.t('Sugar: name for include is not provided');
		Lava.store(
			widget_config,
			'includes',
			name,
			raw_tag.content ? Lava.parsers.Common.compileTemplate(raw_tag.content, widget_config) : []
		);

	},

	/**
	 * Parse widget's tag content as {@link _cWidget#storage}
	 * @param {_cSugarContent} content_schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseStorage: function(content_schema, raw_tag, widget_config) {

		var tags = Lava.parsers.Common.asBlocks(raw_tag.content);
		tags = this._applyTopDirectives(tags, widget_config);
		if (tags.length) {
			Lava.parsers.Storage.parse(widget_config, tags);
		}

	},

	/**
	 * The content of `raw_tag` is storage tags, mixed with includes
	 * @param {_cSugarContent} content_schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseUnion: function(content_schema, raw_tag, widget_config) {

		var tags = Lava.parsers.Common.asBlocks(raw_tag.content),
			i = 0,
			count,
			tag_roles_map = content_schema.tag_roles,
			tag_schema,
			storage_tags = [];

		tags = this._applyTopDirectives(tags, widget_config);
		count = tags.length;

		for (; i < count; i++) {

			if (tags[i].name in tag_roles_map) {

				tag_schema = tag_roles_map[tags[i].name];
				this[this._union_handlers[tag_schema.type]](tag_schema, tags[i], widget_config, tag_schema.name || tags[i].name);

			} else {

				storage_tags.push(tags[i]);

			}

		}

		if (storage_tags.length) {

			Lava.parsers.Storage.parse(widget_config, storage_tags);

		}

	},

	/**
	 * Tags inside `raw_tag` represent properties in an object in storage
	 * @param {_cSugarContent} content_schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseStorageObject: function(content_schema, raw_tag, widget_config) {

		var tags = Lava.parsers.Common.asBlocks(raw_tag.content);
		tags = this._applyTopDirectives(tags, widget_config);
		if (tags.length) {
			Lava.parsers.Storage.parse(widget_config, [{
				type: 'tag',
				name: content_schema.name,
				content: tags
			}]);
		}

	},

	// end: root parsers
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Parse attributes of the widget's `raw_tag` into `widget_config`
	 * @param {_cSugar} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseRootAttributes: function(schema, raw_tag, widget_config) {

		var name,
			descriptor,
			unknown_attributes = {};

		for (name in raw_tag.attributes) {

			if (Lava.schema.DEBUG && name != 'id' && !schema.attribute_mappings) Lava.t('Sugar schema is missing attribute mappings for: ' + name);

			descriptor = (name == 'id') ? {type: 'id'} : schema.attribute_mappings[name];

			if (descriptor) {
				this[this._root_attributes_handlers[descriptor.type]](widget_config, raw_tag.attributes[name], descriptor, descriptor.name || name);
			} else {
				unknown_attributes[name] = raw_tag.attributes[name];
			}

		}

		if (!Firestorm.Object.isEmpty(unknown_attributes)) {

			if (Lava.schema.DEBUG && !schema.root_resource_name) Lava.t("Sugar: unknown attribute: " + name + ", for widget: " + raw_tag.name);
			this._storeAttributesAsResource(widget_config, unknown_attributes, schema.root_resource_name);

		}

	},

	/**
	 * Store root attributes that are not described in Sugar config as 'container_stack' resource
	 * @param {_cWidget} widget_config
	 * @param {Object} unknown_attributes
	 * @param {string} resource_name
	 */
	_storeAttributesAsResource: function(widget_config, unknown_attributes, resource_name) {

		var value = {
				type: 'container_stack',
				value: []
			},
			operations_stack = value.value;

		if (!widget_config.resources) {

			widget_config.resources = {};

		}

		if (!widget_config.resources['default']) {

			widget_config.resources['default'] = {};

		}

		if ('class' in unknown_attributes) {

			operations_stack.push({
				name: 'add_classes',
				value: unknown_attributes['class'].trim().split(/\s+/)
			});
			delete unknown_attributes['class'];

		}

		if ('style' in unknown_attributes) {

			operations_stack.push({
				name: 'add_styles',
				value: Lava.parsers.Common.parseStyleAttribute(unknown_attributes.style)
			});
			delete  unknown_attributes.style;

		}

		if (!Firestorm.Object.isEmpty(unknown_attributes)) {

			operations_stack.push({
				name: 'add_properties',
				value: Firestorm.Object.copy(unknown_attributes) // copying to reduce possible slowdowns (object may contain deleted values)
			});

		}

		Lava.resources.putResourceValue(widget_config.resources['default'], resource_name, value);

	},

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// root attribute actions

	/**
	 * Store 'id' attribute on root tag into {@link _cView#id}
	 * @param {_cWidget} widget_config
	 * @param {string} attribute_value
	 */
	_parseRootIdAttribute: function(widget_config, attribute_value) {

		if (Lava.schema.DEBUG && (!Lava.isValidId(attribute_value) || ('id' in widget_config))) Lava.t();
		widget_config.id = attribute_value;

	},

	/**
	 * Evaluate attribute value and store it in {@link _cView#options}
	 * @param {_cWidget} widget_config
	 * @param {string} attribute_value
	 * @param {_cSugarRootAttribute} descriptor
	 * @param {string} name
	 */
	_parseRootOptionAttribute: function(widget_config, attribute_value, descriptor, name) {

		Lava.store(widget_config, 'options', name, Lava.valueToType(descriptor, attribute_value));

	},

	/**
	 * Same as 'option', but empty value is treated as boolean TRUE, to allow value-less (void) attributes
	 * @param {_cWidget} widget_config
	 * @param {string} attribute_value
	 * @param {_cSugarRootAttribute} descriptor
	 * @param {string} name
	 */
	_parseRootSwitchAttribute: function(widget_config, attribute_value, descriptor, name) {

		Lava.store(widget_config, 'options',  name, (attribute_value == '') ? true : Lava.types.Boolean.fromString(attribute_value));

	},

	/**
	 * Store attribute as property into {@link _cWidget#properties}
	 * @param {_cWidget} widget_config
	 * @param {string} attribute_value
	 * @param {_cSugarRootAttribute} descriptor
	 * @param {string} name
	 */
	_parseRootPropertyAttribute: function(widget_config, attribute_value, descriptor, name) {

		Lava.store(widget_config, 'properties', name, Lava.valueToType(descriptor, attribute_value));

	},

	/**
	 * Parse attribute value via {@link Lava.parsers.Common#parseTargets} and store it as an option
	 * @param {_cWidget} widget_config
	 * @param {string} attribute_value
	 * @param {_cSugarRootAttribute} descriptor
	 * @param {string} name
	 */
	_parseRootTargetsOptionAttribute: function(widget_config, attribute_value, descriptor, name) {

		Lava.store(widget_config, 'options', name, Lava.parsers.Common.parseTargets(attribute_value));

	},

	/**
	 * Parse attribute value as expression and store it as an option
	 * @param {_cWidget} widget_config
	 * @param {string} attribute_value
	 * @param {_cSugarRootAttribute} descriptor
	 * @param {string} name
	 */
	_parseRootExpressionsOptionAttribute: function(widget_config, attribute_value, descriptor, name) {

		Lava.store(
			widget_config,
			'options',
			name,
			Lava.ExpressionParser.parse(attribute_value, Lava.ExpressionParser.SEPARATORS.SEMICOLON)
		);

	}

	// end: root attribute actions
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

});


Lava.define(
'Lava.system.PopoverManager',
/**
 * Shows and positions popups and tooltips
 * @lends Lava.system.PopoverManager#
 */
{

	/**
	 * Listener for {@link Lava.system.ViewManager#event:EVENTNAME_stack_changed}
	 * @type {_tListener}
	 */
	_mouseover_stack_changed_listener: null,

	/**
	 * The mouseover element with tooltip
	 * @type {HTMLElement}
	 */
	_tooltip_target: null,

	/**
	 * The attribute with tooltip text
	 * @type {string}
	 */
	_attribute_name: 'data-tooltip',

	/**
	 * Listener for the mousemove DOM event
	 * @type {_tListener}
	 */
	_mousemove_listener: null,

	/**
	 * Instance of the Tooltip widget
	 * @type {Lava.widget.Standard}
	 */
	_tooltip: null,

	/**
	 * Name of the widget that will show up as a tooltip
	 * @type {string}
	 */
	DEFAULT_TOOLTIP_WIDGET: 'Tooltip',

	/**
	 * Create tooltip widget instance and start listening to mouse events
	 */
	enable: function() {

		if (!this._mouseover_stack_changed_listener) {
			Lava.view_manager.lendEvent('mouse_events');
			this._mouseover_stack_changed_listener = Lava.view_manager.on('mouseover_stack_changed', this._onMouseoverStackChanged, this);
			if (!this._tooltip) this._tooltip = Lava.createWidget(this.DEFAULT_TOOLTIP_WIDGET);
			this._tooltip.inject(document.body, 'Bottom');
		}

	},

	/**
	 * Remove tooltip widget from DOM and stop responding to events
	 */
	disable: function() {

		if (this._mouseover_stack_changed_listener) {
			Lava.view_manager.releaseEvent('mouse_events');
			Lava.view_manager.removeListener(this._mouseover_stack_changed_listener);
			this._mouseover_stack_changed_listener = null;
			if (this._mousemove_listener) {
				Lava.Core.removeGlobalHandler(this._mousemove_listener);
				this._mousemove_listener = null;
			}
			this._tooltip.set('is_visible', false);
			this._tooltip.remove();
		}

	},

	/**
	 * Does it listen to mouse movements and show tooltips?
	 * @returns {boolean}
	 */
	isEnabled: function() {

		return this._mouseover_stack_changed_listener != null;

	},

	/**
	 * Mouse has crossed an element boundary. Find new element with tooltip and show new content
	 * @param {Lava.system.ViewManager} view_manager
	 * @param {Array.<HTMLElement>} stack
	 */
	_onMouseoverStackChanged: function(view_manager, stack) {

		var new_tooltip_target = null,
			html;

		for (var i = 0, count = stack.length; i < count; i++) {

			if (Firestorm.Element.hasAttribute(stack[i], this._attribute_name)) {

				new_tooltip_target = stack[i];
				break;

			}

		}

		if (new_tooltip_target != this._tooltip_target) {

			if (!this._tooltip_target) { // if there was no tooltip

				if (Lava.schema.DEBUG && this._mousemove_listener) Lava.t();
				this._mousemove_listener = Lava.Core.addGlobalHandler('mousemove', this._onMouseMove, this);
				this._tooltip.set('is_visible', true);

			} else if (!new_tooltip_target) { // if there was a tooltip, and now it should be hidden

				Lava.Core.removeGlobalHandler(this._mousemove_listener);
				this._mousemove_listener = null;
				this._tooltip.set('is_visible', false);

			}

			if (new_tooltip_target) {

				html = Firestorm.Element.getAttribute(new_tooltip_target, this._attribute_name).replace(/\r?\n/g, '<br/>');
				this._tooltip.set('html', html);
				this._tooltip.set('is_visible', !!(html || !Lava.schema.popover_manager.HIDE_EMPTY_TOOLTIPS));

			}

			this._tooltip_target = new_tooltip_target;

		}

	},

	/**
	 * Mouse has changed position. Move tooltip accordingly
	 * @param {string} event_name
	 * @param {Object} event_object
	 */
	_onMouseMove: function(event_name, event_object) {

		this._tooltip.set('x', event_object.page.x); // left
		this._tooltip.set('y', event_object.page.y); // top

	},

	/**
	 * Destroy PopoverManager instance
	 */
	destroy: function() {

		this.isEnabled() && this.disable();

	}

});

// @todo This is work-in-progress

/**
 * @event Lava.system.FocusManager#focus_target_changed
 * @type {Lava.widget.Standard}
 * @lava-type-description New widget that owns the virtual focus
 */

Lava.define(
'Lava.system.FocusManager',
/**
 * Delegated keyboard events to currently focused view.
 * @lends Lava.system.FocusManager#
 * @extends Lava.mixin.Observable#
 */
{
	Extends: 'Lava.mixin.Observable',
	Shared: ['TARGETS'],
	/**
	 * Targets for bubbling "focus_acquired" and "focus_lost" events
	 */
	TARGETS: {
		focus_acquired: [{name: 'focus_acquired'}],
		focus_lost: [{name: 'focus_lost'}]
	},

	/**
	 * Currently focused DOM element
	 * @type {HTMLElement}
	 */
	_focused_element: null,
	/**
	 * View, which receives keyboard events (first <i>known</i> parent of the focused element)
	 * @type {Lava.widget.Standard}
	 */
	_focused_view: null,
	/**
	 * Listener for Core "blur" event
	 * @type {_tListener}
	 */
	_blur_listener: null,
	/**
	 * @type {_tListener}
	 */
	_focus_stack_changed_listener: null,

    _keydown_listener: null,
    _keyup_listener: null,
    _keypress_listener: null,

	/**
	 * Start listening to global focus-related events
	 */
	enable: function () {

		if (!this._focus_stack_changed_listener) {

            /*$(document.body).onfocusin = handleMouseOver;
            $(document.body).onfocusout = handleMouseOut;
            $(document.body).addEventListener('focus',handleMouseOver,true);
            $(document.body).addEventListener('blur',handleMouseOut,true);*/

			Lava.view_manager.lendEvent("focusin");
			this._focus_stack_changed_listener = Lava.view_manager.on("focusin_stack_changed", this._onFocusStackChanged, this);
			this._blur_listener = Lava.Core.addGlobalHandler('blur', this._onElementBlurred, this);
            this._keydown_listener = Lava.Core.addGlobalHandler('keydown', this._onKeyboard, this);
            this._keyup_listener = Lava.Core.addGlobalHandler('keyup', this._onKeyboard, this);
            this._keypress_listener = Lava.Core.addGlobalHandler('keypress', this._onKeyboard, this);
		}

	},

	/**
	 * Stop listening to all focus-related events
	 */
	disable: function() {

		if (this._focus_stack_changed_listener) {
			Lava.view_manager.releaseEvent("focusin");
			Lava.view_manager.removeListener(this._focus_stack_changed_listener);
			Lava.Core.removeGlobalHandler(this._blur_listener);
            Lava.Core.removeGlobalHandler(this._keydown_listener);
            Lava.Core.removeGlobalHandler(this._keyup_listener);
            Lava.Core.removeGlobalHandler(this._keypress_listener);
			this._focused_element
				= this._focused_view
				= this._focus_stack_changed_listener
				= this._blur_listener
				= this._keydown_listener
				= this._keyup_listener
				= this._keypress_listener
				= null;
		}

	},

    _onKeyboard: function (view_manager, event_object) {

        this._focused_view && Lava.view_manager.dispatchEvent(
            this._focused_view,
            event_object.type,
            event_object,
            [{name: 'focus_' + event_object.type}]
        );

    },

	/**
	 * Does it listen to focus changes and sends keyboard events
	 * @returns {boolean}
	 */
	isEnabled: function() {

		return this._blur_listener != null;

	},

	/**
	 * Get the currently focused view, which receives keyboard navigation.
	 * @returns {Lava.view.Abstract}
	 */
	getFocusedView: function() {

		return this._focused_view;

	},

	/**
	 * Get the element with focus. May be null, when widget was set manually.
	 * @returns {HTMLElement}
	 */
	getFocusedElement: function() {

		return this._focused_element;

	},

	/**
	 * Test if the given widget equals to the currently focused view, or is one of it's parents.
	 * @param {Lava.widget.Standard} widget
	 * @returns {boolean}
	 */
	hasFocus: function(widget) {

		var current = this._focused_view;

		while (current && current != widget) {

			current = current.getParentWidget();

		}

		return current == widget;

	},

	_clearTarget: function() {

		var event_object = {
			old_focused_element: this._focused_element,
			old_focused_view: this._focused_view
		};
		this._focused_view && Lava.view_manager.dispatchEvent(this._focused_view, "focus_lost", event_object, this.TARGETS.focus_lost);

		this._focused_element
			= this._focused_view
			= null;

	},

	_onFocusStackChanged: function(view_manager, stack) {

		var focused_element = stack[0] || null,
			i = 0,
			count = stack.length,
			focused_view,
			event_object;

		if (this._focused_element != focused_element) {

			this._clearTarget();
			this._focused_element = focused_element;

			for (; i < count; i++) {
				focused_view = Lava.view_manager.getViewByElement(stack[i]);
				if (focused_view) {
                    this._focused_view = focused_view;
                    event_object = {
                        new_focused_element: focused_element,
                        new_focused_view: focused_view
                    };
                    Lava.view_manager.dispatchEvent(focused_view, "focus_acquired", event_object, this.TARGETS.focus_acquired);
					break;
				}
			}

		}

	},

	/**
	 * Clear old virtual focus target and `_focused_element`
	 */
	_onElementBlurred: function() {

		this._clearTarget();
		this._focused_element = null;

	},

	/**
	 * Blur currently focused DOM element and clear virtual focus target
	 */
	blur: function() {

		// according to specification, the right way to blur - is to focus the root <html> element
		document.documentElement.focus();

	},

	/**
	 * Destroy FocusManager instance
	 */
	destroy: function() {

		this.disable();

	}

});
Lava.define(
'Lava.scope.Abstract',
/**
 * Abstract class for data binding
 * @lends Lava.scope.Abstract#
 * @extends Lava.mixin.Refreshable
 */
{

	Extends: 'Lava.mixin.Refreshable',

	/**
	 * Instance belongs to scope/Abstract
	 * @type {boolean}
	 * @readonly
	 */
	isValueContainer: true,

	/**
	 * Scopes, bound to properties of the value of this container
	 * @type {Object.<string, Lava.scope.DataBinding>}
	 */
	_data_bindings_by_property: {},

	/**
	 * Segments, bound to properties of the value of this container.
	 * [name_source_guid} => Segment
	 * @type {Object.<_tGUID, Lava.scope.Segment>}
	 */
	_data_segments: {},

	/**
	 * Get a scope, which is bound to property of the value of this container
	 * @param {string} property_name
	 * @returns {Lava.scope.DataBinding}
	 */
	getDataBinding: function(property_name) {

		if (!(property_name in this._data_bindings_by_property)) {

			this._data_bindings_by_property[property_name] = new Lava.scope.DataBinding(this, property_name);

		}

		return this._data_bindings_by_property[property_name];

	},

	/**
	 * Get a {@link Lava.scope.Segment}, which is bound to property of the value of this container
	 * @param {(Lava.scope.PropertyBinding|Lava.scope.DataBinding)} name_source_scope
	 * @returns {Lava.scope.Segment}
	 */
	getSegment: function(name_source_scope) {

		if (Lava.schema.DEBUG && !name_source_scope.guid) Lava.t("Only PropertyBinding and DataBinding may be used as name source for segments");

		if (!(name_source_scope.guid in this._data_segments)) {

			this._data_segments[name_source_scope.guid] = new Lava.scope.Segment(this, name_source_scope);

		}

		return this._data_segments[name_source_scope.guid];

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		var name;

		for (name in this._data_bindings_by_property) {

			this._data_bindings_by_property[name].destroy();

		}

		for (name in this._data_segments) {

			this._data_segments[name].destroy();

		}

		this.suspendRefreshable();

	}

});

/**
 * Argument's value has changed
 * @event Lava.scope.Argument#changed
 * @type {Object}
 * @property {*} old_value Optional: old value of the argument
 */

Lava.define(
'Lava.scope.Argument',
/**
 * Evaluates expression in context of it's view
 *
 * @lends Lava.scope.Argument#
 * @extends Lava.mixin.Refreshable
 * @implements _iValueContainer
 */
{

	Extends: 'Lava.mixin.Refreshable',
	/**
	 * Sign that this instance implements {@link _iValueContainer}
	 * @type {boolean}
	 * @readonly
	 */
	isValueContainer: true,

	/**
	 * Owner view
	 * @type {Lava.view.Abstract}
	 */
	_view: null,
	/**
	 * Nearest widget in hierarchy
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,
	/**
	 * Generated method that is called in context of Argument instance and produces the argument's result
	 * @type {function}
	 */
	_evaluator: null,
	/**
	 * Global unique identifier
	 * @type {_tGUID}
	 */
	guid: null,

	/**
	 * Scopes that provide operands for the `_evaluator`
	 * @type {Array.<_iValueContainer>}
	 */
	_binds: [],
	/**
	 * Length of `_binds` array
	 * @type {number}
	 */
	_binds_count: 0,
	/**
	 * Listeners for <str>"changed"</str> events
	 * @type {Array.<_tListener>}
	 */
	_bind_changed_listeners: [],

	/**
	 * Objects with a reference to modifier's widget (it's cached to speed up calling) and modifier name
	 * @type {Array.<Object>}
	 */
	_modifier_descriptors: [],

	// Alpha version. Not used
	//_active_modifiers: [],

	/**
	 * Create an Argument instance. Acquire binds, find modifier sources, apply correct state
	 * @param {_cArgument} config
	 * @param {Lava.view.Abstract} view Argument's view
	 * @param {Lava.widget.Standard} widget Nearest widget in hierarchy
	 */
	init: function(config, view, widget) {

		this.guid = Lava.guid++;
		this._view = view;
		this._widget = widget;
		this._evaluator = config.evaluator;

		var i = 0,
			count,
			bind,
			binds = config.binds;

		if (binds) {

			for (count = binds.length; i < count; i++) {

				if (binds[i].isDynamic) {

					bind = view.locateViewByPathConfig(binds[i]).getDynamicScope(view, binds[i]);

				} else {

					bind = view.getScopeByPathConfig(binds[i]);

				}

				this._binds.push(bind);
				this._bind_changed_listeners.push(bind.on('changed', this.onBindingChanged, this));

				if (this.level < bind.level) {

					this.level = bind.level;

				}

			}

			this.level++;

		}

		if ('modifiers' in config) {

			for (i = 0, count = config.modifiers.length; i < count; i++) {

				this._modifier_descriptors.push({
					widget: this.getWidgetByModifierConfig(config.modifiers[i]),
					callback_name: config.modifiers[i].callback_name
				});

			}

		}

		/*if ('active_modifiers' in config) {

			for (i = 0, count = config.active_modifiers.length; i < count; i++) {

				this._active_modifiers.push({
					widget: this.getWidgetByModifierConfig(config.active_modifiers[i]),
					callback_name: config.active_modifiers[i].callback_name
				});

			}

		}*/

		this._binds_count = this._binds.length;
		this._value = this._evaluate();

	},

	/**
	 * Get widget, that will be used to call a modifier
	 * @param {_cKnownViewLocator} path_config Route to the widget
	 * @returns {Lava.widget.Standard}
	 */
	getWidgetByModifierConfig: function(path_config) {

		var widget = this._widget.locateViewByPathConfig(path_config);
		if (Lava.schema.DEBUG && !widget.isWidget) Lava.t("Tried to call a modifier from non-widget view");

		return /** @type {Lava.widget.Standard} */ widget;

	},

	/**
	 * One of evaluator's operands has changed. Instance is now dirty
	 */
	onBindingChanged: function() {

		this._queueForRefresh();

	},

	/**
	 * Execute `_evaluator` and return
	 * @returns {*} The Argument's result
	 */
	_evaluate: function() {

		var result = null;

		// in production - wrap evaluation into try/catch block
		if (Lava.schema.DEBUG) {

			result = this._evaluator();

		} else {

			try {

				result = this._evaluator();

			} catch (e) {

				Lava.logException(e);

			}

		}

		return result;

	},

	/**
	 * Get `_value`
	 * @returns {*}
	 */
	getValue: function() {

		return this._value;

	},

	/**
	 * Refresh `_value` and fire {@link Lava.scope.Argument#event:changed}
	 * @private
	 */
	_doRefresh: function() {

		var new_value = this._evaluate(),
			event_args;

		if (new_value !== this._value) {

			event_args = {old_value: this._value};
			this._value = new_value;
			this._fire('changed', event_args);

		}

	},

	/**
	 * Call a modifier from widget
	 * @param {number} index
	 * @param {?Array.<*>} arguments_array
	 * @returns {*}
	 */
	_callModifier: function(index, arguments_array) {

		return this._modifier_descriptors[index].widget.callModifier(this._modifier_descriptors[index].callback_name, arguments_array);

	},

	/**
	 * Alpha. Not used
	 * @param index
	 * @param arguments_array
	 * @returns {*}
	 */
	_callActiveModifier: function(index, arguments_array) {

	},

	/**
	 * Calls a global function from {@link Lava.modifiers}
	 * @param {string} name The function's name
	 * @param {?Array.<*>} arguments_array Evaluator's arguments
	 * @returns {*}
	 */
	_callGlobalModifier: function(name, arguments_array) {

		if (Lava.schema.DEBUG && !(name in Lava.modifiers)) Lava.t("Unknown global modifier: " + name);
		return Lava.modifiers[name].apply(Lava.modifiers, arguments_array);

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		for (var i = 0, count = this._bind_changed_listeners.length; i < count; i++) {

			this._binds[i].removeListener(this._bind_changed_listeners[i]);

		}

		this._bind_changed_listeners = null;
		this.suspendRefreshable();

	}

});
Lava.define(
'Lava.scope.Binding',
/**
 * Two-way binding between a widget property and a scope path
 * @lends Lava.scope.Binding#
 */
{

	/**
	 * The scope, which is bound to property of the widget
	 * @type {_iValueContainer}
	 */
	_scope: null,
	/**
	 * Widget with bound property
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,
	/**
	 * Bound property name in widget
	 * @type {string}
	 */
	_property_name: null,

	/**
	 * Listener for "changed" event
	 * @type {_tListener}
	 */
	_scope_changed_listener: null,
	/**
	 * Listener for onPropertyChanged in `_widget`
	 * @type {_tListener}
	 */
	_widget_property_changed_listener: null,

	/**
	 * Create Binding instance. Refresh widget's property value
	 * @param {_cBinding} config
	 * @param {Lava.widget.Standard} widget
	 */
	init: function(config, widget) {

		this._widget = widget;
		this._property_name = config.property_name;
		this._scope = widget.getScopeByPathConfig(config.path_config);

		if (config.from_widget) {

			this._scope.setValue(this._widget.get(this._property_name));

		} else {

			this._widget.set(this._property_name, this._scope.getValue());
			this._scope_changed_listener = this._scope.on('changed', this.onScopeChanged, this);

		}

		if (!this._scope.isSetValue) Lava.t("Binding: bound scope does not implement setValue");
		this._widget_property_changed_listener = widget.onPropertyChanged(this._property_name, this.onWidgetPropertyChanged, this);

	},

	/**
	 * Scope, which is bound to widget property, has changed. Refresh widget property value
	 */
	onScopeChanged: function() {

		// avoid setting nulls to non-nullable fields.
		if (this._scope.isConnected()) {

			// turning off both of them to avoid infinite loop. From architect's point of view, better solution would be
			// to hang up developer's browser, but if it happens in production - it may have disastrous consequences.
			Lava.suspendListener(this._widget_property_changed_listener);
			this._scope_changed_listener && Lava.suspendListener(this._scope_changed_listener);
			this._widget.set(this._property_name, this._scope.getValue());
			Lava.resumeListener(this._widget_property_changed_listener);
			this._scope_changed_listener && Lava.resumeListener(this._scope_changed_listener);

		}

	},

	/**
	 * Widget property has changed. Refresh bound scope value
	 */
	onWidgetPropertyChanged: function() {

		Lava.suspendListener(this._widget_property_changed_listener);
		this._scope_changed_listener && Lava.suspendListener(this._scope_changed_listener);
		this._scope.setValue(this._widget.get(this._property_name));
		Lava.resumeListener(this._widget_property_changed_listener);
		this._scope_changed_listener && Lava.resumeListener(this._scope_changed_listener);

	},

	destroy: function() {

		this._scope_changed_listener && this._scope.removeListener(this._scope_changed_listener);
		this._widget.removePropertyListener(this._widget_property_changed_listener);

	}

});

/**
 * Value of this DataBinding instance has changed
 * @event Lava.scope.DataBinding#changed
 */

Lava.define(
'Lava.scope.DataBinding',
/**
 * Binding to a property of a JavaScript object with special support for {@link Lava.mixin.Properties}
 * and {@link Lava.system.Enumerable} instances
 *
 * @lends Lava.scope.DataBinding#
 * @extends Lava.scope.Abstract
 * @implements _iValueContainer
 */
{

	Extends: 'Lava.scope.Abstract',
	/**
	 * This instance supports two-way data binding
	 * @type {boolean}
	 * @readonly
	 */
	isSetValue: true,
	/**
	 * Global unique identifier of this instance
	 * @type {_tGUID}
	 */
	guid: null,

	/**
	 * The name of property to which this scope is bound
	 * @type {string}
	 */
	_property_name: null,

	/**
	 * Scope, that provides data source for this instance
	 * @type {_iValueContainer}
	 */
	_value_container: null,
	/**
	 * Listener for "changed" event in `_value_container`
	 * @type {_tListener}
	 */
	_container_changed_listener: null,

	/**
	 * Listener for onPropertyChanged in data source of this scope (if data source is instance of {@link Lava.mixin.Properties})
	 * @type {_tListener}
	 */
	_property_changed_listener: null,
	/**
	 * Listener for {@link Lava.system.Enumerable#event:collection_changed} in data source of this scope
	 * (if data source is instance of {@link Lava.system.Enumerable})
	 * @type {_tListener}
	 */
	_enumerable_changed_listener: null,
	/**
	 * Data source for this scope, from which this scope gets it's value. Also, value of the `_value_container`
	 * @type {*}
	 */
	_property_container: null,

	/**
	 * Is `_property_container` an existing object, or this scope is not bound to an existing value
	 * @type {boolean}
	 */
	_is_connected: false,

	/**
	 * Create DataBinding instance
	 * @param {_iValueContainer} value_container The scope, which provides the data source for this instance
	 * @param {string} property_name
	 */
	init: function(value_container, property_name) {

		this.guid = Lava.guid++;
		this._value_container = value_container;
		this._property_name = property_name;
		this.level = value_container.level + 1;
		this._container_changed_listener = value_container.on('changed', this.onParentDataSourceChanged, this);
		this._refreshValue();

		Lava.schema.DEBUG_SCOPES && Lava.ScopeManager.debugTrackScope(this);

	},

	/**
	 * Get `_property_container` from `_value_container`, and get `_property_name` from `_property_container`
	 */
	_refreshValue: function() {

		var property_container = this._value_container.getValue(),
			value = null,
			is_connected = false;

		if (property_container != null) {

			// Collection implements Properties, so if _property_name is not a number - then `get` will be called
			if (property_container.isCollection && /^\d+$/.test(this._property_name)) {

				if (this._enumerable_changed_listener == null) {

					this._enumerable_changed_listener = property_container.on('collection_changed', this.onValueChanged, this);
					this._property_container = property_container;

				}

				value = property_container.getValueAt(+this._property_name);

			} else if (property_container.isProperties) {

				if (this._property_changed_listener == null) {

					this._property_changed_listener = property_container.onPropertyChanged(this._property_name, this.onValueChanged, this);
					this._property_container = property_container;

				}

				value = property_container.get(this._property_name);

			} else {

				value = property_container[this._property_name];

			}

			is_connected = true;

		}

		if (value !== this._value || this._is_connected != is_connected) {

			this._value = value;
			this._is_connected = is_connected;

			this._fire('changed');

		}

	},

	/**
	 * Get `_is_connected`
	 * @returns {boolean}
	 */
	isConnected: function() {

		return this._is_connected;

	},

	/**
	 * Data source for this instance has changed. Remove listeners to old data source and schedule refresh
	 */
	onParentDataSourceChanged: function() {

		if (this._property_changed_listener && (this._value_container.getValue() != this._property_container)) {

			// currently listening to the parent's old data source
			this._property_changed_listener && this._property_container.removePropertyListener(this._property_changed_listener);
			this._enumerable_changed_listener && this._property_container.removeListener(this._enumerable_changed_listener);
			this._property_changed_listener = null;
			this._enumerable_changed_listener = null;
			this._property_container = null;

		}

		this._queueForRefresh();

	},

	_doRefresh: function() {

		this._refreshValue();

	},

	/**
	 * Data source remains the same, but it's property has changed (property we are currently bound to)
	 */
	onValueChanged: function() {

		this._queueForRefresh();

	},

	/**
	 * If this instance is bound to existing object - set object's property value
	 * @param {*} value
	 */
	setValue: function(value) {

		var property_container = this._value_container.getValue();

		if (property_container) {

			if (this._property_changed_listener) {

				Lava.suspendListener(this._property_changed_listener);
				property_container.set(this._property_name, value);
				Lava.resumeListener(this._property_changed_listener);

			} else if (this._enumerable_changed_listener) {

				Lava.suspendListener(this._enumerable_changed_listener);
				property_container.replaceAt(+this._property_name, value);
				Lava.resumeListener(this._enumerable_changed_listener);

			} else if (property_container.isProperties) {

				property_container.set(this._property_name, value);

			} else {

				property_container[this._property_name] = value;

			}

			this._queueForRefresh();

		}

	},

	getValue: function() {

		return this._value;

	},

	destroy: function() {

		this._value_container.removeListener(this._container_changed_listener);

		this._property_changed_listener && this._property_container.removePropertyListener(this._property_changed_listener);
		this._enumerable_changed_listener && this._property_container.removeListener(this._enumerable_changed_listener);
		this._property_container = null;

		Lava.schema.DEBUG_SCOPES && Lava.ScopeManager.debugStopTracking(this);
		this.Abstract$destroy();

	}

});

/**
 * Content of scope's enumerable has changed
 * @event Lava.scope.Foreach#changed
 */

/**
 * Scope has created a new Enumerable instance. All old UIDs are now invalid
 * @event Lava.scope.Foreach#new_enumerable
 */

/**
 * Scope has refreshed it's value from argument.
 * This event is fired before 'changed' event and may be used to sort and filter data in Foreach views.
 * @event Lava.scope.Foreach#after_refresh
 */

Lava.define(
'Lava.scope.Foreach',
/**
 * Designed to serve data to Foreach view. Transforms value of Argument into Enumerable
 *
 * @lends Lava.scope.Foreach#
 * @extends Lava.mixin.Refreshable
 * @implements _iValueContainer
 */
{

	Extends: 'Lava.mixin.Refreshable',
	/**
	 * Sign that this instance implements {@link _iValueContainer}
	 * @type {boolean}
	 * @readonly
	 */
	isValueContainer: true,

	/**
	 * Scope's argument
	 * @type {Lava.scope.Argument}
	 */
	_argument: null,
	/**
	 * Listener for {@link Lava.scope.Argument#event:changed}
	 * @type {_tListener}
	 */
	_argument_changed_listener: null,

	/**
	 * The owner Foreach view
	 * @type {Lava.view.Foreach}
	 */
	_view: null,
	/**
	 * The nearest widget in hierarchy
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,
	/**
	 * Global unique identifier
	 * @type {_tGUID}
	 */
	guid: null,

	/**
	 * Listens to changes in `_observable`. Event name varies
	 * @type {_tListener}
	 */
	_observable_listener: null,
	/**
	 * Holds argument value, when it's instance of Observable. Used to remove listener
	 * @type {Lava.mixin.Observable}
	 */
	_observable: null,
	/**
	 * Has this instance created a new Enumerable instance to serve data, or is it using the instance
	 * which was returned from `_argument`
	 * @type {boolean}
	 */
	_own_collection: false,
	/**
	 * Scope options
	 * @type {?_cScopeForeach}
	 */
	_config: null,
	/**
	 * Scopes, on which this one depends. When they change - this scope is refreshed.
	 * @type {Array.<_iValueContainer>}
	 */
	_binds: null,
	/**
	 * Listeners for `_binds`
	 * @type {?Array.<_tListener>}
	 */
	_bind_changed_listeners: null,

	/**
	 * Create an instance of the Foreach scope. Refresh value
	 *
	 * @param {Lava.scope.Argument} argument
	 * @param {Lava.view.Foreach} view
	 * @param {Lava.widget.Standard} widget
	 * @param {?_cScopeForeach} config
	 */
	init: function(argument, view, widget, config) {

		var i = 0,
			count,
			depends,
			bind;

		this.guid = Lava.guid++;
		this._argument = argument;
		this._view = view;
		this._widget = widget;
		this.level = argument.level + 1;

		if (config) {

			if (Lava.schema.DEBUG && ['Enumerable', 'DataView'].indexOf(config['own_enumerable_mode']) == -1) Lava.t('Unknown value in own_enumerable_mode option: ' + config['own_enumerable_mode']);

			if (config['own_enumerable_mode'] == "DataView") {
				this._refreshDataSource = this._refreshDataSource_DataView;
				this._value = new Lava.system.DataView();
			} else {
				this._refreshDataSource = this._refreshDataSource_Enumerable;
				this._value = new Lava.system.Enumerable();
			}

			this._own_collection = true;

			if (config['depends']) {

				depends = config['depends'];
				this._binds = [];
				this._bind_changed_listeners = [];

				for (count = depends.length; i < count; i++) {

					if (depends[i].isDynamic) {

						bind = view.locateViewByPathConfig(depends[i]).getDynamicScope(view, depends[i]);

					} else {

						bind = view.getScopeByPathConfig(depends[i]);

					}

					this._binds.push(bind);
					this._bind_changed_listeners.push(bind.on('changed', this._onDependencyChanged, this));

				}

			}

		}

		this._argument_changed_listener = this._argument.on('changed', this.onDataSourceChanged, this);
		this.refreshDataSource();

	},

	/**
	 * One of scopes from `_binds` has changed, place this scope into refresh queue
	 */
	_onDependencyChanged: function() {

		this._queueForRefresh();

	},

	/**
	 * Perform refresh in regular mode (without "own_enumerable_mode" option)
	 * @param {(object|Array|Lava.mixin.Properties|Lava.system.Enumerable)} argument_value value, received from argument
	 */
	_refreshDataSource: function(argument_value) {

		if (argument_value.isCollection) {

			if (this._own_collection) {

				this._value.destroy();
				this._own_collection = false;
				this._value = null;

			}

			if (this._value != argument_value) {
				this._value = argument_value;
				this._fire('new_enumerable');
			}

		} else if (this._own_collection) {

			this._value.refreshFromDataSource(argument_value);

		} else {

			this._createCollection(argument_value);

		}

	},

	_refreshDataSource_Enumerable: function(argument_value) {

		if (Lava.schema.DEBUG && !argument_value.isCollection) Lava.t("Argument result must be Enumerable");
		// unlike DataView, Enumerable does not copy UIDs, so there is no need to fire "new_enumerable"
		this._value.refreshFromDataSource(argument_value);

	},

	_refreshDataSource_DataView: function(argument_value) {

		if (Lava.schema.DEBUG && !argument_value.isCollection) Lava.t("Argument result must be Enumerable");

		if (this._value.getDataSource() != argument_value) {
			// DataView copies UIDs from original Enumerable instance
			this._fire('new_enumerable');
		}

		this._value.refreshFromDataSource(argument_value);

	},

	/**
	 * Get new value from the `_argument`, and create a new instance of local Enumerable, or update the content of the old one
	 */
	refreshDataSource: function() {

		var argument_value = this._argument.getValue();

		if (argument_value) {

			this._refreshDataSource(argument_value);

			if (this._observable_listener == null) {

				if (argument_value.isCollection) {

					this._observable_listener = argument_value.on('collection_changed', this._onObservableChanged, this);
					this._observable = argument_value;

				} else if (argument_value.isProperties) {

					this._observable_listener = argument_value.on('property_changed', this._onObservableChanged, this);
					this._observable = argument_value;

				}

			}

		} else if (this._own_collection) {

			this._value.removeAll();

		} else {

			// will be called only when "own_enumerable_mode" is off, cause otherwise this._own_collection is always true
			this._createCollection(null);

		}

		this._fire('after_refresh');
		this._fire('changed');

	},

	createsOwnEnumerable: function() {

		return this._config['own_enumerable_mode'];

	},

	/**
	 * Create the local instance of Enumerable
	 * @param {*} argument_value
	 */
	_createCollection: function(argument_value) {

		this._value = new Lava.system.Enumerable(argument_value);
		this._own_collection = true;
		this._fire('new_enumerable');

	},

	/**
	 * Get rid of old Observable and it's listener (argument result has changed)
	 */
	_flushObservable: function() {

		this._observable.removeListener(this._observable_listener);
		this._observable_listener = null;
		this._observable = null;

	},

	/**
	 * Argument has changed
	 */
	onDataSourceChanged: function() {

		if (this._observable_listener) this._flushObservable();
		this._queueForRefresh();

	},

	/**
	 * Argument's result has not changed (the same object), but that object itself has changed
	 */
	_onObservableChanged: function() {

		this._queueForRefresh();

	},

	/**
	 * Update value from argument
	 */
	_doRefresh: function() {

		this.refreshDataSource();

	},

	/**
	 * Get scope's value
	 * @returns {Lava.system.Enumerable}
	 */
	getValue: function() {

		return this._value;

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		if (this._binds) {

			for (var i = 0, count = this._binds.length; i < count; i++) {
				this._binds[i].removeListener(this._bind_changed_listeners[i]);
			}

			this._binds = this._bind_changed_listeners = null;

		}

		this._argument.removeListener(this._argument_changed_listener);
		this._observable_listener && this._flushObservable();

		if (this._own_collection) {

			this._value.destroy();

		}

		this.suspendRefreshable();

	}

});

/**
 * Value of this PropertyBinding instance has changed
 * @event Lava.scope.PropertyBinding#changed
 */

Lava.define(
'Lava.scope.PropertyBinding',
/**
 * Scope, that is designed to bind to a property of a view
 * @lends Lava.scope.PropertyBinding#
 * @extends Lava.scope.Abstract
 * @implements _iValueContainer
 */
{

	Extends: 'Lava.scope.Abstract',
	/**
	 * This instance supports two-way data binding
	 * @type {boolean}
	 * @readonly
	 */
	isSetValue: true,
	/**
	 * Global unique identifier of this instance
	 * @type {_tGUID}
	 */
	guid: null,

	/**
	 * View's property name, to which this instance is bound
	 * @type {string}
	 */
	_property_name: null,

	/**
	 * Scope's bound view (also the scope's owner view, which created the instance)
	 * @type {Lava.view.Abstract}
	 */
	_view: null,
	/**
	 * Listener for onPropertyChanged in bound view
	 * @type {_tListener}
	 */
	_property_changed_listener: null,

	/**
	 * PropertyBinding supports "assigns" - one-way binding of widget's property to any {@link Lava.scope.Argument} value
	 * @type {Lava.scope.Argument}
	 */
	_assign_argument: null,

	/**
	 * Create the PropertyBinding instance. Refresh value from view's property or set value from assign
	 * @param {Lava.view.Abstract} view Scope's owner view, to which it's bound
	 * @param {string} property_name
	 * @param {_cAssign} assign_config Config for the Argument, in case this scope is created in "assign" mode
	 */
	init: function(view, property_name, assign_config) {

		this.guid = Lava.guid++;
		this._view = view;
		this._property_name = property_name;

		if (assign_config) {

			this._assign_argument = new Lava.scope.Argument(assign_config, view, view.getWidget());
			this._assign_argument.on('changed', this.onAssignChanged, this);
			this._value = this._assign_argument.getValue();
            if (typeof this._value == 'undefined' && !view.isset(this._property_name)) {
                // if property is not defined, and we assign undefined to it - nothing will happen.
                // We must define this property, cause inner views can be dependent on it
                view.set(this._property_name, null);
            }
			view.set(this._property_name, this._value);
			this.level = this._assign_argument.level + 1;

		} else {

			// this is needed to order implicit inheritance
			// (in custom widget property setters logic and in view.Foreach, while refreshing children).
			// Zero was added to simplify examples from site documentation - it's not needed by framework
			this.level = view.depth || 0;

			this._value = view.get(this._property_name);
			this._property_changed_listener = view.onPropertyChanged(property_name, this.onContainerPropertyChanged, this);

		}

		Lava.schema.DEBUG_SCOPES && Lava.ScopeManager.debugTrackScope(this);

	},

	/**
	 * PropertyBinding is always bound to it's view
	 * @returns {boolean} Always returns <kw>true</kw>
	 */
	isConnected: function() {

		return true;

	},

	/**
	 * Value of "assign" argument has changed. Set view's property and schedule refresh
	 */
	onAssignChanged: function() {

		this._view.set(this._property_name, this._assign_argument.getValue());
		this._queueForRefresh();

	},

	/**
	 * View's property has changed. Schedule refresh
	 */
	onContainerPropertyChanged: function() {

		this._queueForRefresh();

	},

	/**
	 * Get `_value`
	 * @returns {*}
	 */
	getValue: function() {

		return this._value;

	},

	/**
	 * Set property value to the bound view
	 * @param {*} value
	 */
	setValue: function(value) {

		Lava.suspendListener(this._property_changed_listener);
		this._view.set(this._property_name, value);
		Lava.resumeListener(this._property_changed_listener);

		this._queueForRefresh();

	},

	_doRefresh: function() {

		var new_value = this._view.get(this._property_name);

		if (new_value !== this._value) {

			this._value = new_value;

			this._fire('changed');

		}

	},

	destroy: function() {

		if (this._assign_argument) {

			this._assign_argument.destroy();

		} else {

			this._view.removePropertyListener(this._property_changed_listener);

		}

		Lava.schema.DEBUG_SCOPES && Lava.ScopeManager.debugStopTracking(this);
		this.Abstract$destroy();

	}

});

/**
 * Value of this Segment instance has changed
 * @event Lava.scope.Segment#changed
 */

Lava.define(
'Lava.scope.Segment',
/**
 * Scope, that can change name of it's bound property dynamically
 * @lends Lava.scope.Segment#
 * @extends Lava.scope.Abstract
 * @implements _iValueContainer
 */
{

	Extends: 'Lava.scope.Abstract',
	/**
	 * This instance supports two-way data binding
	 * @type {boolean}
	 * @readonly
	 */
	isSetValue: true,

	/**
	 * Either view or a scope with `getDataBinding()` - will be used to construct `_data_binding`
	 * @type {(Lava.view.Abstract|Lava.scope.Abstract)}
	 */
	_container: null,

	/**
	 * The scope, which provides the name of the property for the Segment
	 * @type {(Lava.scope.PropertyBinding|Lava.scope.DataBinding)}
	 */
	_name_source_container: null,
	/**
	 * Listener for "changed" event in `_name_source_container`
	 * @type {_tListener}
	 */
	_name_source_changed_listener: null,

	/**
	 * The name of the property, which this Segment is bound to
	 * @type {string}
	 */
	_property_name: null,
	/**
	 * Scope, which is bound to the `_property_name`. Serves as source of value for the Segment
	 * @type {(Lava.scope.DataBinding|Lava.scope.PropertyBinding)}
	 */
	_data_binding: null,
	/**
	 * Listener for "changed" event in `_data_binding`
	 * @type {_tListener}
	 */
	_data_binding_changed_listener: null,

	/**
	 * Create Segment instance. Refresh `_property_name`, `_data_binding` and get value
	 * @param {(Lava.view.Abstract|Lava.scope.Abstract)} container
	 * @param {(Lava.scope.PropertyBinding|Lava.scope.DataBinding)} name_source_container
	 */
	init: function(container, name_source_container) {

		if (Lava.schema.DEBUG && !name_source_container.isValueContainer) Lava.t();
		if (Lava.schema.DEBUG && !name_source_container.guid) Lava.t("Name source for segments must be either PropertyBinding or DataBinding");

		this._container = container;
		this._property_name = name_source_container.getValue();

		this._refreshDataBinding();

		if (container.isRefreshable) {
			this.level = container.level;
		}
		this.level = this.level > name_source_container.level ? this.level : name_source_container.level;
		this.level++;

		this._name_source_container = name_source_container;
		this._name_source_changed_listener = name_source_container.on('changed', this.onPropertyNameChanged, this);
		this._value = this._data_binding.getValue();
		Lava.schema.DEBUG_SCOPES && Lava.ScopeManager.debugTrackScope(this);

	},

	/**
	 * Return <kw>true</kw>, if the Segment is bound to existing object
	 * @returns {boolean}
	 */
	isConnected: function() {

		if (!this._data_binding) Lava.t();
		return this._data_binding.isConnected();

	},

	/**
	 * Create `_data_binding` and it's "changed" listener
	 */
	_refreshDataBinding: function() {

		this._data_binding = this._container.getDataBinding(this._property_name);
		this._data_binding_changed_listener = this._data_binding.on('changed', this.onDataBindingChanged, this);

	},

	/**
	 * Destroy `_data_binding` and it's "changed" listener
	 */
	_destroyDataBinding: function() {

		this._data_binding.removeListener(this._data_binding_changed_listener);
		this._data_binding = null;
		this._data_binding_changed_listener = null;

	},

	/**
	 * The value of bound scope has changed. Schedule refresh
	 */
	onDataBindingChanged: function() {

		this._queueForRefresh();

	},

	_doRefresh: function() {

		if (this._data_binding == null) {

			this._refreshDataBinding();

		}

		var new_value = this._data_binding.getValue();

		if (new_value !== this._value) {

			this._value = new_value;

			this._fire('changed');

		}

	},

	/**
	 * Segment must bind to new property name. Destroy old `_data_binding` and schedule refresh
	 */
	onPropertyNameChanged: function() {

		this._property_name = this._name_source_container.getValue();

		this._destroyDataBinding();
		this._queueForRefresh();

	},

	/**
	 * Get `_value`
	 * @returns {*}
	 */
	getValue: function() {

		return this._value;

	},

	/**
	 * Set `_property_name` of the bound object
	 * @param {*} value
	 */
	setValue: function(value) {

		if (this._data_binding) {
			this._data_binding.setValue(value);
		}

	},

	destroy: function() {

		this._name_source_container.removeListener(this._name_source_changed_listener);
		this._data_binding_changed_listener && this._data_binding.removeListener(this._data_binding_changed_listener);

		Lava.schema.DEBUG_SCOPES && Lava.ScopeManager.debugStopTracking(this);
		this.Abstract$destroy();

	}

});

Lava.define(
'Lava.view.container.Element',
/**
 * Container, that represents a DOM element
 * @lends Lava.view.container.Element#
 * @implements _iContainer
 */
{

	/**
	 * This instance belongs to Element container
	 * @type {boolean}
	 * @readonly
	 */
	isElementContainer: true,

	/**
	 * ID of DOM element that belongs to this container
	 * @type {string}
	 */
	_id: null,
	/**
	 * iew that owns the container
	 * @type {Lava.view.Abstract}
	 */
	_view: null,
	/**
	 * Settings for this instance
	 * @type {_cElementContainer}
	 */
	_config: null,
	/**
	 * Nearest widget in hierarchy
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,
	/**
	 * Tag name of the DOM element
	 * @type {string}
	 */
	_tag_name: null,

	/**
	 * List of static CSS classes, that are not bound to expressions
	 * @type {Array.<string>}
	 */
	_static_classes: [],
	/**
	 * Arguments, that produce dynamic class names. Keys are sequential numbers
	 * @type {!Object.<string, Lava.scope.Argument>}
	 */
	_class_bindings: null,
	/**
	 * Value of each argument from `_class_bindings`, split into array of class names
	 * @type {Object.<string, Array.<string>>}
	 */
	_class_bindings_values: {},

	/**
	 * Styles, that are not bound to expressions
	 * @type {Object.<string, string>}
	 */
	_static_styles: {},
	/**
	 * Arguments, that produce style values dynamically. Keys are names of CSS styles
	 * @type {!Object.<string, Lava.scope.Argument>}
	 */
	_style_bindings: null,

	/**
	 * Properties, that are not bound to an argument
	 * @type {Object.<string, string>}
	 */
	_static_properties: {}, // name => value
	/**
	 * Arguments, that produce property values. Keys are names of properties
	 * @type {!Object.<string, Lava.scope.Argument>}
	 */
	_property_bindings: null,

	/**
	 * Targets for DOM events, routed by {@link Lava.system.ViewManager}
	 * @type {Object.<string, Array.<_cTarget>>}
	 */
	_events: {},

	/**
	 * Is container's html element in DOM
	 * @type {boolean}
	 */
	_is_inDOM: false,
	/**
	 * Reference to the real DOM element, that belongs to this container
	 * @type {HTMLElement}
	 */
	_element: null,
	/**
	 * Is container's element void? (does not require closing tag)
	 * @type {boolean}
	 */
	_is_void: false,
	/**
	 * Element container can control an existing element on page. <kw>true</kw>, if container was rendered and inserted
	 * as new element, and <kw>false</kw>, if this instance was ordered to capture an existing DOM element on page
	 * @type {boolean}
	 */
	_is_element_owner: true,
	/**
	 * DEBUG-only flag, used to guarantee that Element's properties are not changed between rendered and inDOM states
	 * @type {boolean}
	 */
	_is_rendered: false,

	/**
	 * One-time static constructor, which modifies container's prototype and replaces itself with correct version
	 *
	 * @param {Lava.view.Abstract} view
	 * @param {_cElementContainer} config
	 * @param {Lava.widget.Standard} widget
	 */
	init: function(view, config, widget) {

		// About IOS bugfixes:
		// http://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
		// http://www.quirksmode.org/blog/archives/2010/10/click_event_del_1.html

		var needs_shim = Firestorm.Environment.platform == "ios";
		Lava.ClassManager.patch(this, "Element", "addEventTarget", needs_shim ? "addEventTarget_IOS" : "addEventTarget_Normal");
		Lava.ClassManager.patch(this, "Element", "informInDOM", needs_shim ? "informInDOM_IOS" : "informInDOM_Normal");

		this.init_Normal(view, config, widget);
		Lava.ClassManager.patch(this, "Element", "init", "init_Normal");

	},

	/**
	 * Real constructor
	 *
	 * @param {Lava.view.Abstract} view
	 * @param {_cElementContainer} config
	 * @param {Lava.widget.Standard} widget
	 */
	init_Normal: function(view, config, widget) {

		var name,
			resource_owner,
			container_resources,
			static_classes,
			static_properties,
			static_styles;

		this._id = Lava.ELEMENT_ID_PREFIX + view.guid;

		this._view = view;
		this._config = config;
		this._widget = widget;
		this._tag_name = config.tag_name;
		this._is_void = Lava.isVoidTag(this._tag_name);

		if (Lava.schema.RESOURCES_ENABLED && config.resource_id) {

			resource_owner = Lava.view_manager.locateTarget(widget, config.resource_id.locator_type, config.resource_id.locator);
			if (Lava.schema.DEBUG && !resource_owner) Lava.t("[Element container] resource owner not found: " + config.resource_id.locator_type + "=" + config.resource_id.locator);
			container_resources = resource_owner.getResource(config.resource_id.name);

		}

		if (Lava.schema.RESOURCES_ENABLED && container_resources) {

			if (Lava.schema.DEBUG && container_resources.type != 'container') Lava.t("Element container: received resource type is not container: " + container_resources.type);
			static_classes = container_resources.value['static_classes'];
			static_properties = container_resources.value['static_properties'];
			static_styles = container_resources.value['static_styles'];

		} else {

			static_classes = config['static_classes'];
			static_properties = config['static_properties'];
			static_styles = config['static_styles'];

		}

		if (Lava.schema.DEBUG && static_properties && ('id' in static_properties))
			Lava.t("Element container: id must not be set via resources or be in config.static_properties");

		// Must clone everything, cause additional statics can be added to the element at run time
		if (static_classes) this._static_classes = static_classes.slice();

        Firestorm.extend(this._static_styles, static_styles);
		Firestorm.extend(this._static_properties, static_properties);

		for (name in config.events) {
			this._events[name] = Firestorm.clone(config.events[name]); // Object.<string, Array.<_cTarget>>
		}

		this._property_bindings = this._createArguments(config.property_bindings, view, this._onPropertyBindingChanged);
		this._style_bindings = this._createArguments(config.style_bindings, view, this._onStyleBindingChanged);
		// note: class_bindings is also an object. TemplateParser names properties numerically, starting from zero.
		this._class_bindings = this._createArguments(config.class_bindings, view, this._onClassBindingChanged);

		for (name in this._class_bindings) {

			this._class_bindings_values[name] = this._toClassNames(this._class_bindings[name].getValue() || '');

		}

	},

	/**
	 * Get target routes for dom event
	 * @param {string} event_name
	 * @returns {Array.<_cTarget>}
	 */
	getEventTargets: function(event_name) {

		return this._events[event_name];

	},

	/**
	 * Add a route for DOM event
	 * @param {string} event_name
	 * @param {_cTarget} target
	 */
	addEventTarget: function(event_name, target) {

		Lava.t('Framework requires initialization');

	},

	/**
	 * Add a route for DOM event - IOS bugfix version
	 * @param {string} event_name
	 * @param {_cTarget} target
	 */
	addEventTarget_IOS: function(event_name, target) {

		if (this._is_inDOM && event_name == 'click' && !(event_name in this._events)) {
			this.getDOMElement().onclick = Lava.noop;
		}
		this.addEventTarget_Normal(event_name, target)

	},

	/**
	 * Add a route for DOM event - normal version
	 * @param {string} event_name
	 * @param {_cTarget} target
	 */
	addEventTarget_Normal: function(event_name, target) {

		if (!(event_name in this._events)) {

			this._events[event_name] = [target];

		} else {

			this._events[event_name].push(target);

		}

	},

	/**
	 * Add a property to `_static_properties` and synchronize it with DOM element
	 * @param {string} name
	 * @param {string} value
	 */
	setProperty: function(name, value) {

		this.storeProperty(name, value);
		if (this._is_inDOM) this.syncProperty(name);

	},

	/**
	 * Set static property to the container, but do not synchronize it with DOM element
	 * @param {string} name
	 * @param {string} value
	 */
	storeProperty: function(name, value) {

		if (Lava.schema.DEBUG) {
			if (this._is_rendered) Lava.t("Trying to set container's property/style/class while in rendered state");
			if (name == 'id') Lava.t(); // IDs belong to framework - you must not set them manually!
			if (name in this._property_bindings) Lava.t("Property is bound to an argument and cannot be set directly: " + name);
		}

		this._static_properties[name] = value;

	},

	/**
	 * Get static property
	 * @param {string} name Property name
	 * @returns {string}
	 */
	getProperty: function(name) {

		return this._static_properties[name];

	},

	/**
	 * Set locally stored property value into element
	 * @param {string} name
	 */
	syncProperty: function(name) {

		Firestorm.Element.setProperty(this.getDOMElement(), name, this._static_properties[name]);

	},

	/**
	 * Add static CSS class
	 * @param {string} class_name
	 * @param {boolean} cancel_sync If <kw>true</kw> - do not add that class to DOM element, just to local `_static_classes` array
	 */
	addClass: function(class_name, cancel_sync) {

		if (Lava.schema.DEBUG && (!class_name || class_name.indexOf(' ') != -1)) Lava.t("addClass: expected one class name, got: " + class_name);
		if (Lava.schema.DEBUG && this._is_rendered) Lava.t("Trying to set container's property/style/class while in rendered state");

		if (Firestorm.Array.include(this._static_classes, class_name)) {

			if (this._is_inDOM && !cancel_sync) Firestorm.Element.addClass(this.getDOMElement(), class_name);

		}

	},

	/**
	 * Remove a static CSS class
	 * @param {string} class_name
	 * @param {boolean} cancel_sync If <kw>true</kw> - do not remove the class from DOM element, just from local `_static_classes` array
	 */
	removeClass: function(class_name, cancel_sync) {

		if (Lava.schema.DEBUG && this._is_rendered) Lava.t("Trying to set container's property/style/class while in rendered state");
		if (Firestorm.Array.exclude(this._static_classes, class_name)) {

			if (this._is_inDOM && !cancel_sync) Firestorm.Element.removeClass(this.getDOMElement(), class_name);

		}

	},

	/**
	 * Add a list of static classes to the instance
	 * @param {Array.<string>} class_names
	 * @param {boolean} cancel_sync If <kw>true</kw> - do not add that classes to DOM element, just to local `_static_classes` array
	 */
	addClasses: function(class_names, cancel_sync) {

		if (Lava.schema.DEBUG && typeof(class_names) == 'string') Lava.t();

		for (var i = 0, count = class_names.length; i < count; i++) {

			this.addClass(class_names[i], cancel_sync);

		}

	},

	/**
	 * Does this instance have the given static class
	 * @param class_name Name of CSS class to search for
	 * @returns {boolean} <kw>true</kw>, if class exists in `_static_classes`
	 */
	hasStaticClass: function(class_name) {

		return this._static_classes.indexOf(class_name) != -1;

	},

	/**
	 * Refresh CSS classes on DOM element, including bound classes
	 */
	syncClasses: function() {

		Firestorm.Element.setClass(this.getDOMElement(), this._renderClasses());

	},

	/**
	 * Set static style value
	 * @param {string} name CSS property name
	 * @param {string} value CSS property value
	 * @param cancel_sync If <kw>true</kw> - do not add that style to DOM element, just to local `_static_styles` object
	 */
	setStyle: function(name, value, cancel_sync) {

		if (Lava.schema.DEBUG && this._is_rendered) Lava.t("Trying to set container's property/style/class while in rendered state");
		if (value == null) {

			this.removeStyle(name, cancel_sync);

		} else {

			this._static_styles[name] = value;
			if (this._is_inDOM && !cancel_sync) Firestorm.Element.setStyle(this.getDOMElement(), name, value);

		}

	},

	/**
	 * Remove static CSS style
	 * @param {string} name CSS style name
	 * @param {boolean} cancel_sync If <kw>true</kw> - do not remove that style from DOM element, just from local `_static_styles` object
	 */
	removeStyle: function(name, cancel_sync) {

		if (Lava.schema.DEBUG && this._is_rendered) Lava.t("Trying to set container's property/style/class while in rendered state");
		if (name in this._static_styles) {
			delete this._static_styles[name];
			if (this._is_inDOM && !cancel_sync) Firestorm.Element.setStyle(this.getDOMElement(), name, '');
		}

	},

	/**
	 * Get CSS style value
	 * @param {string} name
	 * @returns {string}
	 */
	getStyle: function(name) {

		return this._static_styles[name];

	},

	/**
	 * Refresh the "style" attribute on DOM element
	 */
	syncStyles: function() {

		Firestorm.Element.setProperty(this.getDOMElement(), 'style', this._renderStyles());

	},

	/**
	 * Helper method to create style, class and property bindings
	 * @param {?Object.<string, _cArgument>} configs
	 * @param {Lava.view.Abstract} view
	 * @param {!function} fn
	 * @returns {!Object.<string, Lava.scope.Argument>}
	 */
	_createArguments: function(configs, view, fn) {

		var result = {},
			argument;

		for (var name in configs) {

			argument = new Lava.scope.Argument(configs[name], view, this._widget);
			result[name] = argument;
			argument.on('changed', fn, this, {name: name})

		}

		return result;

	},

	/**
	 * Argument value for property binding has changed. If container's element is in DOM - update it's property value
	 * @param {Lava.scope.Argument} argument
	 * @param event_args
	 * @param listener_args
	 */
	_onPropertyBindingChanged: function(argument, event_args, listener_args) {

		if (this._is_inDOM) {

			var value = argument.getValue();
            if (listener_args.name.indexOf("data-") === 0) {

                if (value != null) {

                    Firestorm.Element.setAttribute(this.getDOMElement(), listener_args.name, value);

                } else {

                    Firestorm.Element.removeAttribute(this.getDOMElement(), listener_args.name);

                }

            } else if (value != null) { // filters out null and undefined

                Firestorm.Element.setProperty(this.getDOMElement(), listener_args.name, value);

            } else if (Lava.schema.DEBUG) {

                Firestorm.Element.removeAttribute(this.getDOMElement(), listener_args.name);
                Lava.logError("[container.Element] result of binding is null or undefined. Property name: " + listener_args.name);

            }

		}

	},

	/**
	 * Argument value for style binding has changed. If container's element is in DOM - update it's style
	 * @param {Lava.scope.Argument} argument
	 * @param event_args
	 * @param listener_args
	 */
	_onStyleBindingChanged: function(argument, event_args, listener_args) {

		var value = this._style_bindings[listener_args.name].getValue() || '';
		if (this._is_inDOM) Firestorm.Element.setStyle(this.getDOMElement(), listener_args.name, value.toString().trim());

	},

	/**
	 * Split a string into array of class names
	 * @param {string} classes_string
	 * @returns {Array}
	 */
	_toClassNames: function(classes_string) {

		var classes = [];

		if (Lava.schema.view.VALIDATE_CLASS_NAMES) {
			this.assertClassStringValid(classes_string);
		}

		if (classes_string != '') {

			classes = classes_string.split(/\s+/);

		}

		return classes;

	},

	/**
	 * Class binding argument has changed it's value. Refresh internal class values and element's classes
	 * @param {Lava.scope.Argument} argument
	 * @param event_args
	 * @param listener_args
	 */
	_onClassBindingChanged: function(argument, event_args, listener_args) {

		var new_classes = this._toClassNames(argument.getValue().toString().trim());

		if (this._is_inDOM) {

			Firestorm.Element.removeClasses(this.getDOMElement(), this._class_bindings_values[listener_args.name]);
			Firestorm.Element.addClasses(this.getDOMElement(), new_classes);

		}

		this._class_bindings_values[listener_args.name] = new_classes;

	},

	/**
	 * Assert, that style string does not contain any special characters, that can break HTML markup
	 * @param value
	 */
	assertStyleValid: function(value) {
		if (/\"\<\>/.test(value))
			Lava.t("Invalid symbols in style value: " + value + ". Please, use single quotes for string values and manually escape special characters.");
	},

	/**
	 * Assert, that class string does not contain any special characters
	 * @param value
	 */
	assertClassStringValid: function(value) {

		if (/\'\"\<\>\&\./.test(value)) Lava.t("Invalid class names: " + value);

	},

	/**
	 * Render value of the "class" attribute, including bound classes
	 * @returns {string}
	 */
	_renderClasses: function() {

		var resultClasses = this._static_classes.slice(),
			name,
			value;

		for (name in this._class_bindings) {

			// do not need to check or convert, cause join() will convert everything to string, and nulls to empty string
			resultClasses.push(
				this._class_bindings[name].getValue()
			);

		}

		value = resultClasses.join(' ');

		if (Lava.schema.view.VALIDATE_CLASS_NAMES) {
			this.assertClassStringValid(value);
		}

		return value;

	},

	/**
	 * Render content of the "style" attribute, including bound styles
	 * @returns {string}
	 */
	_renderStyles: function() {

		var result_styles = [],
			name,
			value;

		for (name in this._static_styles) {

			result_styles.push(name + ':' + this._static_styles[name]);

		}

		for (name in this._style_bindings) {

			value = this._style_bindings[name].getValue();
			if (value != null) {
				result_styles.push(name + ':' + value.toString().trim());
			}

		}

		value = result_styles.join(';');

		if (Lava.schema.view.VALIDATE_STYLES) {
			this.assertStyleValid(value);
		}

		return value;

	},

	/**
	 * Render one attribute
	 * @param {string} name
	 * @param {boolean|null|string} value
	 * @returns {string}
	 */
	_renderAttribute: function(name, value) {

		var result = '';

		if (value === true) {

			result = ' ' + name + '="' + name + '"';

		} else if (value != null && value !== false) {

			result = ' ' + name + '="' + this.escapeAttributeValue(value + '') + '"';

		}

		return result;

	},

	/**
	 * Render the opening HTML tag, including all attributes
	 * @returns {string}
	 */
	_renderOpeningTag: function() {

		var classes = this._renderClasses(),
			style = this._renderStyles(),
			properties_string = '',
			name;

		// see informInDOM_Normal
		// this._element = null;

		for (name in this._static_properties) {

			properties_string += this._renderAttribute(name, this._static_properties[name]);

		}

		for (name in this._property_bindings) {

			properties_string += this._renderAttribute(name, this._property_bindings[name].getValue());

		}

		if (classes) {

			properties_string += ' class="' + classes + '"';

		}

		if (style) {

			properties_string += ' style="' + style + '"';

		}

		return "<" + this._tag_name + " id=\"" + this._id + "\" "
			+ properties_string; //+ ">"

	},

	/**
	 * Render tag and wrap given HTML code inside it
	 * @param {string} html
	 * @returns {string}
	 */
	wrap: function(html) {

		if (Lava.schema.DEBUG && this._is_void) Lava.t('Trying to wrap content in void tag');
		if (Lava.schema.DEBUG) this._is_rendered = true;
		// _element is cleared in _renderOpeningTag
		return this._renderOpeningTag() + ">" + html + "</" + this._tag_name + ">";

	},

	/**
	 * Render the tag as void tag
	 * @returns {string}
	 */
	renderVoid: function() {

		if (Lava.schema.DEBUG && !this._is_void) Lava.t('Trying to render non-void container as void');
		if (Lava.schema.DEBUG) this._is_rendered = true;
		// _element is cleared in _renderOpeningTag
		return this._renderOpeningTag() + "/>";

	},

	/**
	 * Set innerHTML of container's element. Container must be in DOM
	 * @param {string} html
	 */
	setHTML: function(html) {

		if (!this._is_inDOM) Lava.t("setHTML: element is not in DOM");
		if (this._is_void) Lava.t('setHTML on void tag');

		Firestorm.Element.setHtml(this.getDOMElement(), html);

	},

	/**
	 * Insert given HTML markup at the bottom of container's DOM element
	 * @param {string} html
	 */
	appendHTML: function(html) {

		Firestorm.DOM.insertHTMLBottom(this.getDOMElement(), html);

	},

	/**
	 * Insert given HTML markup at the top of container's DOM element
	 * @param {string} html
	 */
	prependHTML: function(html) {

		Firestorm.DOM.insertHTMLTop(this.getDOMElement(), html);

	},

	/**
	 * Insert HTML markup after container's DOM element
	 * @param {string} html
	 */
	insertHTMLAfter: function(html) {

		Firestorm.DOM.insertHTMLAfter(this.getDOMElement(), html);

	},

	/**
	 * Insert HTML markup before container's DOM element
	 * @param {string} html
	 */
	insertHTMLBefore: function(html) {

		Firestorm.DOM.insertHTMLBefore(this.getDOMElement(), html);

	},

	/**
	 * Call this method, when container has been rendered and inserted into DOM
	 * Note: does not need to be called after capture
	 */
	informInDOM: function() {

		Lava.t();

	},

	/**
	 * Version of informInDOM with IOS bugfixes
	 */
	informInDOM_IOS: function() {

		this.informInDOM_Normal();
		this.getDOMElement().onclick = Lava.noop;

	},

	/**
	 * Normal version of informInDOM
	 */
	informInDOM_Normal: function() {

		this._is_inDOM = true;
		if (Lava.schema.DEBUG) this._is_rendered = false;
		// if <input> which is already in DOM is re-rendered and inserted back
		// - then "changed" event will fire in Chrome.
		// During the event - the DOM element may be retrieved by widget,
		// so at the moment, when informInDOM is called - it's already set.
		// if (Lava.schema.DEBUG && this._element) Lava.t();
		this._element = null;

	},

	/**
	 * Call this method before removing container's element from DOM
	 */
	informRemove: function() {

		this._is_inDOM = false;
		this._element = null;

	},

	/**
	 * Get current container's element from DOM
	 * @returns {HTMLElement}
	 */
	getDOMElement: function() {

		if (!this._element && this._is_inDOM) {

			this._element = Firestorm.getElementById(this._id);

		}

		return this._element;

	},

	/**
	 * For Element container this returns it's DOM element
	 * @returns {HTMLElement}
	 */
	getStartElement: function() {

		return this.getDOMElement();

	},

	/**
	 * For Element container this returns it's DOM element
	 * @returns {HTMLElement}
	 */
	getEndElement: function() {

		return this.getDOMElement();

	},

	/**
	 * Get `_id`
	 * @returns {string}
	 */
	getId: function() { return this._id; },

	/**
	 * Get `_is_inDOM`
	 * @returns {boolean}
	 */
	isInDOM: function() { return this._is_inDOM; },

	/**
	 * Get `_is_void`
	 * @returns {boolean}
	 */
	isVoid: function() { return this._is_void; },

	/**
	 * Clear internal reference to container's DOM element
	 */
	release: function() {

		this._element = null;

	},

	/**
	 * Call a method of all binding arguments
	 * @param {string} callback_name Method to call
	 * @param {*} callback_argument Argument for the method
	 */
	_withArguments: function(callback_name, callback_argument) {

		var name;

		for (name in this._property_bindings) this._property_bindings[name][callback_name](callback_argument);

		for (name in this._style_bindings) this._style_bindings[name][callback_name](callback_argument);

		for (name in this._class_bindings) this._class_bindings[name][callback_name](callback_argument);

	},

	/**
	 * Bind container to existing DOM element. Apply new styles, classes and properties
	 * @param {HTMLElement} element
	 */
	captureExistingElement: function(element) {

		var Element = Firestorm.Element,
			name;

		if (this._is_inDOM) Lava.t("Can not set duplicate id attribute on elements");
		// there must not be ID attribute
		if (Element.getAttribute(element, 'id')) Lava.t("Target element already has an ID, and could be owned by another container");
		if (Element.getTagName(element) != this._tag_name) Lava.t("Captured tag name differs from the container's tag name");

		Element.getAttribute(element, 'id', this._id);

		this._is_inDOM = true;
		this._element = element;

		for (name in this._static_properties) {

			// note: escaping must be handled by framework
			Element.setProperty(element, name, this._static_properties[name]);

		}

		for (name in this._property_bindings) {

			Element.setProperty(element, name, this._property_bindings[name].getValue());

		}

		this.syncClasses();
		this.syncStyles();
		this._is_element_owner = false;

	},

	/**
	 * Release an element after call to `captureExistingElement`. Does not clear any attributes, except ID
	 */
	releaseElement: function() {

		// keep original container in DOM
		this.setHTML('');
		Firestorm.Element.removeAttribute(this.getDOMElement(), 'id');
		this.informRemove();
		this._is_element_owner = true;

	},

	/**
	 * Get `_is_element_owner`
	 * @returns {boolean}
	 */
	isElementOwner: function() {

		return this._is_element_owner;

	},

	/**
	 * Perform escaping of an attribute value while rendering
	 * @param {string} string
	 * @returns {string}
	 */
	escapeAttributeValue: function(string) {

		return Firestorm.String.escape(string, Firestorm.String.ATTRIBUTE_ESCAPE_REGEX);

	},

	/**
	 * Remove container's element from DOM
	 */
	remove: function() {

		if (!this._is_inDOM) Lava.t("remove: container is not in DOM");
		Firestorm.Element.destroy(this.getDOMElement());

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		var name;

		for (name in this._property_bindings) {

			this._property_bindings[name].destroy();

		}

		for (name in this._style_bindings) {

			this._style_bindings[name].destroy();

		}

		for (name in this._class_bindings) {

			this._class_bindings[name].destroy();

		}

	}

});

Lava.define(
'Lava.view.container.CheckboxElement',
/**
 * Container for checkbox input, which implements fixes for IE and other defect browsers.
 * Fires custom ViewManager event "compatible_changed"
 *
 * @lends Lava.view.container.CheckboxElement#
 * @extends Lava.view.container.Element#
 */
{
	Extends: "Lava.view.container.Element",

	/**
	 * When running inside IE: bound "click" event handler
	 * @type {function}
	 */
	_IE_click_callback: null,

	init: function(view, config, widget) {

		var needs_shim = (Firestorm.Environment.browser_name == 'ie'),
			new_init_name = needs_shim ? "init_IE" : "Element$init";

		Lava.ClassManager.patch(this, "CheckboxElement", "informInDOM", needs_shim ? "informInDOM_IE" : "Element$informInDOM");
		Lava.ClassManager.patch(this, "CheckboxElement", "informRemove", needs_shim ? "informRemove_IE" : "Element$informRemove");

		this[new_init_name](view, config, widget);
		Lava.ClassManager.patch(this, "CheckboxElement", "init", new_init_name);

	},

	/**
	 * Constructor for IE environment
	 *
	 * @param view
	 * @param config
	 * @param widget
	 */
	init_IE: function(view, config, widget) {

		this.Element$init(view, config, widget);

		var self = this;

		this._IE_click_callback = function() {
			if (self._events['compatible_changed']) {
				Lava.view_manager.dispatchEvent(self._view, 'compatible_changed', null, self._events['compatible_changed']);
			}
		};

	},

	/**
	 * Dummy method, which will be replaced in static constructor
	 */
	informInDOM: function() {

		Lava.t();

	},

	/**
	 * Dummy method, which will be replaced in static constructor
	 */
	informRemove: function() {

		Lava.t();

	},

	/**
	 * IE version of `informInDOM` - applies IE fixes.
	 * IE 10, 11 and maybe other versions don't fire "change" when indeterminate state is cleared
	 */
	informInDOM_IE: function() {

		this.Element$informInDOM();

		var input_element = this.getDOMElement();
		Firestorm.Element.addListener(input_element, "click", this._IE_click_callback);

	},

	/**
	 * IE version of `informRemove` - clears IE fixes
	 */
	informRemove_IE: function() {

		var input_element = this.getDOMElement();
		Firestorm.Element.removeListener(input_element, "click", this._IE_click_callback);

		this.Element$informRemove();

	}

});

Lava.define(
'Lava.view.container.TextInputElement',
/**
 * Container for "text" and "password" inputs, which implements fixes for IE and other defect browsers.
 * Fires custom ViewManager event "compatible_changed".
 *
 * @lends Lava.view.container.TextInputElement#
 * @extends Lava.view.container.Element#
 */
{
	Extends: "Lava.view.container.Element",

	/**
	 * For IE8-9: input element listener callback, bound to this instance
	 * @type {function}
	 */
	_OldIE_refresh_callback: null,
	/**
	 * For IE8-9: `onpropertychange` callback, bound to this instance
	 * @type {function}
	 */
	_OldIE_property_change_callback: null,

	init: function(view, config, widget) {

		var needs_shim = Firestorm.Environment.capabilities[Firestorm.CAPABILITY_NAMES.NEEDS_INPUT_EVENT_SHIM],
			new_init_name = needs_shim ? "init_IE" : "Element$init";

		Lava.ClassManager.patch(this, "TextInputElement", "informInDOM", needs_shim ? "informInDOM_OldIE" : "Element$informInDOM");
		Lava.ClassManager.patch(this, "TextInputElement", "informRemove", needs_shim ? "informRemove_OldIE" : "Element$informRemove");

		this[new_init_name](view, config, widget);
		Lava.ClassManager.patch(this, "TextInputElement", "init", new_init_name);

	},

	/**
	 * Constructor for IE environment
	 *
	 * @param {Lava.view.Abstract} view
	 * @param {_cElementContainer} config
	 * @param {Lava.widget.Standard} widget
	 */
	init_IE: function(view, config, widget) {

		this.Element$init(view, config, widget);

		var self = this;

		this._OldIE_refresh_callback = function() {
			self._sendRefreshValue();
		};
		this._OldIE_property_change_callback = function(e) {
			if (e.propertyName == "value") {
				self._sendRefreshValue();
			}
		};

	},

	/**
	 * Dummy method, which will be replaced in static constructor
	 */
	informInDOM: function() {

		Lava.t();

	},

	/**
	 * Dummy method, which will be replaced in static constructor
	 */
	informRemove: function() {

		Lava.t();

	},

	/**
	 * Applies additional listeners for IE8-9 to track value changes.
	 * See http://benalpert.com/2013/06/18/a-near-perfect-oninput-shim-for-ie-8-and-9.html
	 */
	informInDOM_OldIE: function() {

		this.Element$informInDOM();

		var input_element = this.getDOMElement();
		Firestorm.Element.addListener(input_element, "onpropertychange", this._OldIE_property_change_callback);
		Firestorm.Element.addListener(input_element, "selectionchange", this._OldIE_refresh_callback);
		Firestorm.Element.addListener(input_element, "keyup", this._OldIE_refresh_callback);
		Firestorm.Element.addListener(input_element, "keydown", this._OldIE_refresh_callback);

	},

	/**
	 * Removes IE listeners
	 */
	informRemove_OldIE: function() {

		var input_element = this.getDOMElement();
		Firestorm.Element.removeListener(input_element, "onpropertychange", this._OldIE_property_change_callback);
		Firestorm.Element.removeListener(input_element, "selectionchange", this._OldIE_refresh_callback);
		Firestorm.Element.removeListener(input_element, "keyup", this._OldIE_refresh_callback);
		Firestorm.Element.removeListener(input_element, "keydown", this._OldIE_refresh_callback);

		this.Element$informRemove();

	},

	/**
	 * Dispatches custom ViewManager "compatible_changed" event
	 */
	_sendRefreshValue: function() {

		if (this._events['compatible_changed']) {
			Lava.view_manager.dispatchEvent(this._view, 'compatible_changed', null, this._events['compatible_changed']);
		}

	}

});

Lava.define(
'Lava.view.container.Morph',
/**
 * Container, that represents two &lt;script&gt; tags with content between them
 * @lends Lava.view.container.Morph#
 * @implements _iContainer
 *
 * Credits:
 * based on https://github.com/tomhuda/metamorph.js/
 */
{

	/**
	 * Instance belongs to Morph container
	 * @type {boolean}
	 * @readonly
	 */
	isMorphContainer: true,

	/**
	 * View, that owns this instance of container
	 * @type {Lava.view.Abstract}
	 */
	_view: null,
	/**
	 * Settings for the Morph container
	 * @type {Object}
	 */
	//_config: null,

	/**
	 * Nearest widget in hierarchy
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,

	/**
	 * Is this instance currently in DOM
	 * @type {boolean}
	 */
	_is_inDOM: false,
	/**
	 * ID of the first &lt;script&gt; tag
	 * @type {string}
	 */
	_start_script_id: null,
	/**
	 * ID of the second &lt;script&gt; tag
	 * @type {string}
	 */
	_end_script_id: null,

	/**
	 * Reference to the first &lt;script&gt; tag as DOM element
	 * @type {HTMLElement}
	 */
	_start_element: null,
	/**
	 * Reference to the second &lt;script&gt; tag as DOM element
	 * @type {HTMLElement}
	 */
	_end_element: null,

	/**
	 * Create Morph container instance
	 * @param {Lava.view.Abstract} view
	 * @param {Object} config
	 * @param {Lava.widget.Standard} widget
	 */
	init: function(view, config, widget) {

		this._view = view;
		//this._config = config;
		this._widget = widget;

		this._start_script_id = 'c' + view.guid + 's';
		this._end_script_id = 'c' + view.guid + 'e';

	},

	/**
	 * Retrieve both &lt;script&gt; tags from DOM into local references,
	 * at the same time applying fixes for old browsers
	 */
	_getElements: function() {

		var start_element = document.getElementById(this._start_script_id),
			end_element = document.getElementById(this._end_script_id);

		/**
		 * In some cases, Internet Explorer can create an anonymous node in
		 * the hierarchy with no tagName. You can create this scenario via:
		 *
		 *     div = document.createElement("div");
		 *     div.innerHTML = "<table>&shy<script></script><tr><td>hi</td></tr></table>";
		 *     div.firstChild.firstChild.tagName //=> ""
		 *
		 * If our script markers are inside such a node, we need to find that
		 * node and use *it* as the marker.
		 **/
		while (start_element.parentNode.tagName === "") {

			start_element = start_element.parentNode;

		}

		/**
		 * When automatically adding a tbody, Internet Explorer inserts the
		 * tbody immediately before the first <tr>. Other browsers create it
		 * before the first node, no matter what.
		 *
		 * This means the the following code:
		 *
		 *     div = document.createElement("div");
		 *     div.innerHTML = "<table><script id='first'></script><tr><td>hi</td></tr><script id='last'></script></table>
		 *
		 * Generates the following DOM in IE:
		 *
		 *     + div
		 *       + table
		 *         - script id='first'
		 *         + tbody
		 *           + tr
		 *             + td
		 *               - "hi"
		 *           - script id='last'
		 *
		 * Which means that the two script tags, even though they were
		 * inserted at the same point in the hierarchy in the original
		 * HTML, now have different parents.
		 *
		 * This code reparents the first script tag by making it the tbody's
		 * first child.
		 **/
		if (start_element.parentNode !== end_element.parentNode) {

			end_element.parentNode.insertBefore(start_element, end_element.parentNode.firstChild);

		}

		this._start_element = start_element;
		this._end_element = end_element;

	},

	/**
	 * Get `_start_element`
	 * @returns {HTMLElement}
	 */
	getStartElement: function() {

		if (this._start_element == null) {
			this._getElements();
		}

		return this._start_element;

	},

	/**
	 * Get `_end_element`
	 * @returns {HTMLElement}
	 */
	getEndElement: function() {

		if (this._end_element == null) {
			this._getElements();
		}

		return this._end_element;

	},

	/**
	 * Render the container with `html` inside
	 * @param {string} html
	 * @returns {string}
	 */
	wrap: function(html) {

		this._start_element = this._end_element = null;

		/*
		 * We replace chevron by its hex code in order to prevent escaping problems.
		 * Check this thread for more explaination:
		 * http://stackoverflow.com/questions/8231048/why-use-x3c-instead-of-when-generating-html-from-javascript
		 */
		return "<script id='" + this._start_script_id + "' type='x'>\x3C/script>"
			+ html
			+ "<script id='" + this._end_script_id + "' type='x'>\x3C/script>";

	},

	/**
	 * Replace the content between container's tags. Requires container to be in DOM
	 * @param {string} html
	 */
	setHTML: function(html) {

		if (!this._is_inDOM) Lava.t("setHTML: container is not in DOM");

		Firestorm.DOM.clearInnerRange(this.getStartElement(), this.getEndElement());
		Firestorm.DOM.insertHTMLBefore(this.getEndElement(), html);

	},

	/**
	 * Remove container's content and it's tags from DOM
	 */
	remove: function() {

		if (!this._is_inDOM) Lava.t("remove: container is not in DOM");
		Firestorm.DOM.clearOuterRange(this.getStartElement(), this.getEndElement());

	},

	/**
	 * Insert html before the second &lt;script&gt; tag
	 * @param {string} html
	 */
	appendHTML: function(html) {

		Firestorm.DOM.insertHTMLBefore(this.getEndElement(), html);

	},

	/**
	 * Insert html after the first &lt;script&gt; tag
	 * @param {string} html
	 */
	prependHTML: function(html) {

		Firestorm.DOM.insertHTMLAfter(this.getStartElement(), html);

	},

	/**
	 * Insert html after the second &lt;script&gt; tag
	 * @param {string} html
	 */
	insertHTMLAfter: function(html) {

		Firestorm.DOM.insertHTMLAfter(this.getEndElement(), html);

	},

	/**
	 * Insert html before the first &lt;script&gt; tag
	 * @param {string} html
	 */
	insertHTMLBefore: function(html) {

		Firestorm.DOM.insertHTMLBefore(this.getStartElement(), html);

	},

	/**
	 * Call this method after inserting rendered container into DOM
	 */
	informInDOM: function() { this._is_inDOM = true; },

	/**
	 * Call this method before removing container from DOM
	 */
	informRemove: function() {

		this._start_element = this._end_element = null;
		this._is_inDOM = false;

	},

	/**
	 * Forget references to both DOM &lt;script&gt; elements
	 */
	release: function() {

		this._start_element = this._end_element = null;

	},

	/** Does nothing */
	refresh: function() {},

	/**
	 * Get `_is_inDOM`
	 * @returns {boolean}
	 */
	isInDOM: function() { return this._is_inDOM; },
	/**
	 * Get `_widget`
	 * @returns {Lava.widget.Standard}
	 */
	getWidget: function() { return this._widget; },
	/**
	 * Get `_view`
	 * @returns {Lava.view.Abstract}
	 */
	getView: function() { return this._view; },

	/** Free resources and make this instance unusable */
	destroy: function() {}

});

Lava.define(
'Lava.view.container.Emulated',
/**
 * Virtual container that can simulate behaviour of Element and Morph containers
 * @lends Lava.view.container.Emulated#
 * @implements _iContainer
 */
{

	/**
	 * Instance belongs to Emulated container
	 * @type {boolean}
	 * @readonly
	 */
	isEmulatedContainer: true,

	/**
	 * View that owns this instance
	 * @type {Lava.view.Abstract}
	 */
	_view: null,
	/**
	 * Container's settings
	 * @type {Object}
	 */
	//_config: null,

	/**
	 * Nearest widget in hierarchy
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,

	/**
	 * Is instance in DOM
	 * @type {boolean}
	 */
	_is_inDOM: false,

	/**
	 * Create Emulated container instance
	 * @param {Lava.view.Abstract} view
	 * @param {_cEmulatedContainer} config
	 * @param {Lava.widget.Standard} widget
	 */
	init: function(view, config, widget) {

		this._view = view;
		//this._config = config;
		this._widget = widget;

		if (('options' in config)) {

			if ('appender' in config.options) {
				if (Lava.schema.DEBUG && !this['_append' + config.options.appender]) Lava.t('[Emulated container] wrong appender: ' + config.options.appender);
				this.appendHTML = this['_append' + config.options.appender]
			}

			if ('prepender' in config.options) {
				if (Lava.schema.DEBUG && !this['_append' + config.options.prepender]) Lava.t('[Emulated container] wrong prepender: ' + config.options.prepender);
				this.prependHTML = this['_append' + config.options.prepender]
			}

		}

	},

	/**
	 * Return `html` without modifications
	 * @param {string} html
	 * @returns {string} Returns argument as-is
	 */
	wrap: function(html) { return html; },

	/**
	 * Throws exception. May be overridden by user to provide exact method of inserting content
	 * @param {string} html
	 */
	setHTML: function(html) {

		if (!this._is_inDOM) Lava.t("setHTML: container is not in DOM");

		Lava.t('call to setHTML() in emulated container');

	},

	/**
	 * Throws exception. May be overridden by user to provide exact way of removing content
	 */
	remove: function() {

		if (!this._is_inDOM) Lava.t("remove: container is not in DOM");

		Lava.t('call to remove() in emulated container');

	},

	/**
	 * Append `html` to the bottom of parent container
	 * @param {string} html
	 */
	_appendBottom: function(html) {

		this._view.getParentView().getContainer().appendHTML(html);

	},

	/**
	 * Prepend `html` to the top of parent container
	 * @param {string} html
	 */
	_appendTop: function(html) {

		this._view.getParentView().getContainer().prependHTML(html);

	},

	/**
	 * Append `html` after previous view in template
	 * @param {string} html
	 */
	_appendAfterPrevious: function(html) {

		this._view.getTemplate().getPreviousView(this._view).getContainer().insertHTMLAfter(html);

	},

	/**
	 * Append `html` before next view in template
	 * @param {string} html
	 */
	_appendBeforeNext: function(html) {

		this._view.getTemplate().getNextView(this._view).getContainer().insertHTMLBefore(html);

	},

	/**
	 * Inserts `html` to where the bottom of container should be.
	 * Note: this method is replaced in constructor with exact algorithm
	 * @param {string} html
	 */
	appendHTML: function(html) {

		Lava.t("appendHTML is not supported or not configured");

	},

	/**
	 * Inserts `html` to where the top of container should be.
	 * Note: this method is replaced in constructor with exact algorithm
	 * @param {string} html
	 */
	prependHTML: function(html) {

		Lava.t("prependHTML is not supported or not configured");

	},

	/**
	 * Same as `prependHTML`
	 * @param {string} html
	 */
	insertHTMLBefore: function(html) {

		this.prependHTML(html);

	},

	/**
	 * Same as `appendHTML`
	 * @param {string} html
	 */
	insertHTMLAfter: function(html) {

		this.appendHTML(html);

	},

	/**
	 * Call this method immediately after content of the container has been inserted into DOM
	 */
	informInDOM: function() { this._is_inDOM = true; },

	/**
	 * Call this method before removing container's content from DOM
	 */
	informRemove: function() { this._is_inDOM = false; },

	/** Does nothing */
	refresh: function() {},

	/**
	 * Get `_is_inDOM`
	 * @returns {boolean}
	 */
	isInDOM: function() { return this._is_inDOM; },
	/**
	 * Get `_widget`
	 * @returns {Lava.widget.Standard}
	 */
	getWidget: function() { return this._widget; },
	/**
	 * Get `_view`
	 * @returns {Lava.view.Abstract}
	 */
	getView: function() { return this._view; },

	/** Does nothing */
	release: function() {},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {}

});

/**
 * Animation has ended and template was removed from DOM
 * @event Lava.view.refresher.Standard#removal_complete
 * @type {Lava.system.Template}
 * @lava-type-description Template, that was removed
 */

/**
 * Animation has expanded the template
 * @event Lava.view.refresher.Standard#insertion_complete
 * @type {Lava.system.Template}
 * @lava-type-description Template, that was inserted
 */

Lava.define(
'Lava.view.refresher.Standard',
/**
 * Base class for animation support in views. Standard refresher does not animate templates, but inserts and removes them separately
 * @lends Lava.view.refresher.Standard#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',

	/**
	 * Settings for this instance
	 * @type {_cRefresher}
	 */
	_config: null,
	/**
	 * View, that owns this refresher instance
	 * @type {Lava.view.Abstract}
	 */
	_view: null,
	/**
	 * View's container
	 * @type {_iContainer}
	 */
	_container: null,
	/**
	 * Temporary storage for templates which were removed during current refresh cycle
	 * @type {Object.<_tGUID, Lava.system.Template>}
	 */
	_remove_queue: {},
	/**
	 * Templates, that are currently in DOM
	 * @type {Object.<_tGUID, Lava.system.Template>}
	 */
	_current_templates: [],

	/**
	 * Create refresher instance
	 * @param {_cRefresher} config
	 * @param {Lava.view.Abstract} view
	 * @param {_iContainer} container
	 */
	init: function(config, view, container) {

		this._config = config;
		this._view = view;
		this._container = container;

		if (config.get_start_element_callback) {

			this._getStartElement = config.get_start_element_callback;

		}

		if (config.get_end_element_callback) {

			this._getEndElement = config.get_end_element_callback;

		}

	},

	/**
	 * Queue templates for removal
	 * @param {Array.<Lava.system.Template>} templates
	 */
	prepareRemoval: function(templates) {

		for (var i = 0, count = templates.length; i < count; i++) {

			this._remove_queue[templates[i].guid] = templates[i];

		}

	},

	/**
	 * Insert new templates into DOM and remove those, which are queued for removal. Reorder existing templates
	 * @param {Array.<Lava.system.Template>} current_templates Templates, that refresher must render and insert into DOM.
	 *  Some of them can be already in DOM.
	 */
	refresh: function(current_templates) {

		var i = 1,
			count = current_templates.length,
			guid,
			previous_template = current_templates[0];

		if (previous_template) { // if list is not empty

			delete this._remove_queue[previous_template.guid];

			// handle first template separately from others
			if (!previous_template.isInDOM()) {

				this._insertFirstTemplate(previous_template);
				this._fire('insertion_complete', previous_template);

			}

			for (; i < count; i++) {

				delete this._remove_queue[current_templates[i].guid];

				if (current_templates[i].isInDOM()) {

					this._moveTemplate(current_templates[i], previous_template, current_templates);

				} else {

					this._insertTemplate(current_templates[i], previous_template, i);
					this._fire('insertion_complete', current_templates[i]);

				}

				previous_template = current_templates[i];

			}

		}

		for (guid in this._remove_queue) {

			if (this._remove_queue[guid].isInDOM()) {

				this._removeTemplate(this._remove_queue[guid]);
				this._fire('removal_complete', this._remove_queue[guid]);

			}

		}

		this._remove_queue = {};

	},

	/**
	 * Insert template at the top of view's container
	 * @param {Lava.system.Template} template
	 */
	_insertFirstTemplate: function(template) {

		this._view.getContainer().prependHTML(template.render());
		template.broadcastInDOM();
		this._current_templates.unshift(template);

	},

	/**
	 * Move `template` after `previous_template` (both are in DOM)
	 * @param {Lava.system.Template} template
	 * @param {Lava.system.Template} new_previous_template
	 * @param {Array.<Lava.system.Template>} current_templates
	 */
	_moveTemplate: function (template, new_previous_template, current_templates) {

		var current_previous_index = this._current_templates.indexOf(template) - 1,
			current_previous_template = null;

		if (Lava.schema.DEBUG && current_previous_index == -2) Lava.t();

		// skip removed templates
		while (current_previous_index > -1 && current_templates.indexOf(this._current_templates[current_previous_index]) == -1) {
			current_previous_index--;
		}

		if (current_previous_index > -1) {
			current_previous_template = this._current_templates[current_previous_index];
		}

		if (new_previous_template != current_previous_template) {

			Firestorm.DOM.moveRegionAfter(
				this._getEndElement(new_previous_template),
				this._getStartElement(template),
				this._getEndElement(template)
			);

			// move it in local _current_templates array
			Firestorm.Array.exclude(this._current_templates, template);

			var previous_index = this._current_templates.indexOf(new_previous_template);
			if (Lava.schema.DEBUG && previous_index == -1) Lava.t();
			this._current_templates.splice(previous_index + 1, 0, template);

		}

	},

	/**
	 * Get top element of a template
	 * @param {Lava.system.Template} template
	 * @returns {HTMLElement}
	 */
	_getStartElement: function(template) {

		return template.getFirstView().getContainer().getDOMElement();

	},

	/**
	 * Get bottom element of a template
	 * @param template
	 * @returns {HTMLElement}
	 */
	_getEndElement: function(template) {

		return template.getLastView().getContainer().getDOMElement();

	},

	/**
	 * View's render callback
	 * @param {Array.<Lava.system.Template>} current_templates Templates that must be in DOM
	 */
	render: function(current_templates) {

		var i = 0,
			count = current_templates.length,
			guid;

		// from templates, which are prepared for removal, filter out those, which should be in DOM
		for (; i < count; i++) {

			delete this._remove_queue[current_templates[i].guid];

		}

		for (guid in this._remove_queue) {

			if (this._remove_queue[guid].isInDOM()) {

				this._remove_queue[guid].broadcastRemove();
				this._fire('removal_complete', this._remove_queue[guid]);

			}

		}

		this._current_templates = current_templates;
		this._remove_queue = {};

		return this._render();

	},

	/**
	 * Render current templates
	 * @returns {string}
	 */
	_render: function() {

		var buffer = '',
			i = 0,
			count = this._current_templates.length;

		for (; i < count; i++) {

			buffer += this._current_templates[i].render();

		}

		return buffer;

	},

	/**
	 * Insert template into DOM
	 * @param {Lava.system.Template} template
	 * @param {Lava.system.Template} previous_template
	 * @param {number} index Index of this template in list of all active templates
	 */
	_insertTemplate: function(template, previous_template, index) {

		Firestorm.DOM.insertHTMLAfter(this._getEndElement(previous_template), template.render());
		template.broadcastInDOM();

		var previous_index = this._current_templates.indexOf(previous_template);
		if (Lava.schema.DEBUG && previous_index == -1) Lava.t();
		this._current_templates.splice(previous_index + 1, 0, template);

	},

	/**
	 * Remove template from DOM
	 * @param {Lava.system.Template} template
	 */
	_removeTemplate: function(template) {

		// save, cause we can not retrieve container's DOM elements after broadcastRemove
		var start_element = this._getStartElement(template),
			end_element = this._getEndElement(template);

		// first, we must inform the template, that it's going to be removed: to allow it's child views to interact
		// with nodes while they are still in DOM
		template.broadcastRemove();

		if (start_element == end_element) {

			Firestorm.Element.destroy(start_element);

		} else {

			// remove everything between tags and tags themselves
			Firestorm.DOM.clearOuterRange(start_element, end_element);

		}

		Firestorm.Array.exclude(this._current_templates, template);

	},

	/**
	 * Are there any active animations
	 * @returns {boolean}
	 */
	hasAnimations: function() {

		return false;

	},

	/**
	 * Is insertion or removal animation enabled
	 * @returns {boolean} <kw>false</kw>
	 */
	isAnimationEnabled: function() {

		return false;

	},

	/**
	 * Actions to take after the view was rendered and inserted into DOM
	 */
	broadcastInDOM: function() {

		this._broadcast('broadcastInDOM');

	},

	/**
	 * Actions to take before owner view is removed from DOM
	 */
	broadcastRemove: function() {

		this._broadcast('broadcastRemove');

	},

	/**
	 * Broadcast callback to children
	 * @param {string} function_name
	 */
	_broadcast: function(function_name) {

		for (var i = 0, count = this._current_templates.length; i < count; i++) {

			this._current_templates[i][function_name]();

		}

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		this._current_templates = this._remove_queue = null;

	}

});

Lava.define(
'Lava.view.refresher.Animated',
/**
 * Base class for refreshers, which support animation
 * @lends Lava.view.refresher.Animated#
 * @extends Lava.view.refresher.Standard
 */
{

	Extends: 'Lava.view.refresher.Standard',

	/**
	 * Whether to perform template insertion and removal animations
	 * @type {boolean}
	 */
	_is_animation_enabled: true,
	/**
	 * Animation instances for each template
	 * @type {Object.<_tGUID, Lava.animation.Standard>}
	 */
	_animations_by_template_guid: {},
	/**
	 * Template of each animation
	 * @type {Object.<_tGUID, Lava.system.Template>}
	 */
	_templates_by_animation_guid: {},

	refresh: function(current_templates) {

		if (this.isAnimationEnabled()) {

			this._refreshAnimated(current_templates);

		} else {

			this.Standard$refresh(current_templates);

		}

	},

	/**
	 * Version of `refresh()`, which animates insertion and removal of templates
	 * @param {Array.<Lava.system.Template>} current_templates
	 */
	_refreshAnimated: function(current_templates) {

		var i = 0,
			count = current_templates.length,
			previous_template = null,
			guid;

		for (; i < count; i++) {

			delete this._remove_queue[current_templates[i].guid];
			this._animateInsertion(current_templates[i], previous_template, i, current_templates);
			previous_template = current_templates[i];

		}

		for (guid in this._remove_queue) {

			this._animateRemoval(this._remove_queue[guid]);

		}

		this._remove_queue = {};

	},

	/**
	 * View's render callback
	 * @param {Array.<Lava.system.Template>} current_templates
	 */
	render: function(current_templates) {

		this._finishAnimations();
		return this.Standard$render(current_templates);

	},

	/**
	 * Set `_is_animation_enabled` to <kw>true</kw>
	 */
	enableAnimation: function() {

		this._is_animation_enabled = true;

	},

	/**
	 * Set `_is_animation_enabled` to <kw>false</kw> and stop all animations
	 */
	disableAnimation: function() {

		this._is_animation_enabled = false;
		this._finishAnimations();

	},

	/**
	 * Get `_is_animation_enabled`
	 * @returns {boolean}
	 */
	isAnimationEnabled: function() {

		return this._is_animation_enabled;

	},

	/**
	 * Finish all active animations (rewind to end and raise "completed" events)
	 */
	_finishAnimations: function() {

		for (var guid in this._animations_by_template_guid) {

			// you can not just stop() them, cause you need onComplete events to fire
			this._animations_by_template_guid[guid].finish();

		}

		this._animations_by_template_guid = {};
		this._templates_by_animation_guid = {};

	},

	hasAnimations: function() {

		return !Firestorm.Object.isEmpty(this._animations_by_template_guid);

	},

	/**
	 * Insert the template into DOM and apply corresponding animation
	 * @param {Lava.system.Template} template
	 * @param {Lava.system.Template} previous_template
	 * @param {number} index Index of this template in list of all active templates
	 * @param {Array.<Lava.system.Template>} current_templates
	 */
	_animateInsertion: function(template, previous_template, index, current_templates) {

		var animation = this._animations_by_template_guid[template.guid];

		if (Lava.schema.DEBUG && animation && !template.isInDOM()) Lava.t();

		if (template.isInDOM()) {

			// first template does not require moving
			previous_template && this._moveTemplate(template, previous_template, current_templates);

		} else {

			if (previous_template) {

				this._insertTemplate(template, previous_template, index);

			} else {

				this._insertFirstTemplate(template);

			}

			animation = this._createAnimation(template, index);

		}

		if (animation) {

			animation.resetDirection();
			animation.safeStart();

		}

	},

	/**
	 * Apply template removal animation and remove element from DOM in the end of it
	 * @param {Lava.system.Template} template
	 */
	_animateRemoval: function(template) {

		var animation = this._animations_by_template_guid[template.guid];

		if (!animation && template.isInDOM()) {

			animation = this._createAnimation(template);

		}

		if (animation) {

			animation.reverseDirection();
			animation.safeStart();

		}

	},

	/**
	 * Cleanup animation instance and update state of it's template
	 * @param {Lava.animation.Abstract} animation
	 */
	_onAnimationComplete: function(animation) {

		var template = this._templates_by_animation_guid[animation.guid];

		if (animation.isReversed()) {

			this._onRemovalComplete(animation, template);
			this._fire('removal_complete', template);

		} else {

			this._onInsertionComplete(animation, template);
			this._fire('insertion_complete', template);

		}

		delete this._templates_by_animation_guid[animation.guid];
		delete this._animations_by_template_guid[template.guid];

	},

	/**
	 * Get the element of the template, that will be animated
	 * @param {Lava.system.Template} template
	 * @returns {HTMLElement}
	 */
	_getAnimationTarget: function(template) {

		// get the only element inside the template
		return template.getFirstView().getContainer().getDOMElement();

	},

	/**
	 * Removal animation has ended. Remove template from DOM
	 * @param {Lava.animation.Abstract} animation
	 * @param {Lava.system.Template} template
	 */
	_onRemovalComplete: function(animation, template) {

		this._removeTemplate(template);

	},

	/**
	 * Insertion animation has ended. Update state of the template
	 * @param {Lava.animation.Abstract} animation
	 * @param {Lava.system.Template} template
	 */
	_onInsertionComplete: function(animation, template) {



	},

	/**
	 * Create animation instance
	 * @param {Lava.system.Template} template
	 * @param {number} index Index of the template in the list of all active templates
	 */
	_createAnimation: function(template, index) {

		Lava.t("Abstract method call");

	},

	broadcastRemove: function() {

		this._finishAnimations();
		this.Standard$broadcastRemove();

	},

	destroy: function() {

		this._finishAnimations();
		this.Standard$destroy();

	}

});

Lava.define(
'Lava.view.refresher.Collapse',
/**
 * Animation that expands and collapses elements in one direction
 * @lends Lava.view.refresher.Collapse#
 * @extends Lava.view.refresher.Animated
 */
{

	Extends: 'Lava.view.refresher.Animated',

	/**
	 * Animation class to use when expanding and collapsing templates
	 * @type {string}
	 * @readonly
	 */
	ANIMATION_NAME: 'Lava.animation.Collapse',

	_createAnimation: function(template, index) {

		var element = this._getAnimationTarget(template),
			constructor,
			animation;

		constructor = Lava.ClassManager.getConstructor(this.ANIMATION_NAME, 'Lava.animation');
		animation = new constructor({}, element);
		animation.on('complete', this._onAnimationComplete, this);

		this._templates_by_animation_guid[animation.guid] = template;
		this._animations_by_template_guid[template.guid] = animation;

		return animation;

	}

});

/**
 * View has been destroyed and became unusable. You must not call any methods of a destroyed instance
 * @event Lava.view.Abstract#destroy
 */

Lava.define(
'Lava.view.Abstract',
/**
 * Base class for all views and widgets
 *
 * @lends Lava.view.Abstract#
 * @extends Lava.mixin.Properties
 * @implements _iViewHierarchyMember
 */
{

	Extends: 'Lava.mixin.Properties',
	/**
	 * Indicate that this class is instance of Lava.view.Abstract
	 * @type {boolean}
	 * @readonly
	 */
	isView: true,
	/**
	 * Global unique identifier
	 * @type {_tGUID}
	 * @readonly
	 */
	guid: null,
	/**
	 * Global unique user-assigned view's ID. Views can be retrieved by their ID from {@link Lava.system.ViewManager};
	 * and referenced in expressions. Note: this is not the same as "id" attribute of DOM element of view's container.
	 *
	 * Do not set this property directly! Use appropriate setter.
	 * @type {?string}
	 * @readonly
	 */
	id: null,
	/**
	 * Labels are used to find views when routing events and roles, or manually.
	 * Label is part of template config, so must be considered readonly
	 * @type {?string}
	 * @readonly
	 */
	label: null,
	/**
	 * How many parents does it have (until the root widget, which does not have a parent)
	 * @type {number}
	 * @readonly
	 */
	depth: 0,

	/**
	 * View's index in {@link Lava.system.Template#_content|_content} array of parent template
	 * @type {number}
	 * @readonly
	 */
	template_index: 0,

	/**
	 * Nearest widget in hierarchy of view's parents
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,

	/**
	 * The owner (parent) view of this instance
	 * @type {Lava.view.Abstract}
	 */
	_parent_view: null,

	/**
	 * Nearest parent view with it's own container
	 * @type {Lava.view.Abstract}
	 */
	_parent_with_container: null,

	/**
	 * View's container
	 * @type {_iContainer}
	 */
	_container: null,

	/**
	 * Settings for this instance
	 * @type {_cView}
	 */
	_config: null,

	/**
	 * The {@link Lava.system.Template} that owns the view
	 */
	_template: null,

	/**
	 * Is this view currently in DOM
	 * @type {boolean}
	 */
	_is_inDOM: false,
	/**
	 * Does this view need refresh
	 * @type {boolean}
	 */
	_is_dirty: false,
	/**
	 * Will it be refreshed by ViewManager
	 * @type {boolean}
	 */
	_is_queued_for_refresh: false,

	/**
	 * Bindings to properties of this view
	 * @type {Object.<string, Lava.scope.PropertyBinding>}
	 */
	_property_bindings_by_property: {},

	/**
	 * Segments, built over bindings to properties of this view (see {@link Lava.scope.Segment})
	 * @type {Object.<_tGUID, Lava.scope.Segment>}
	 */
	_data_segments: {},

	/**
	 * Each time the view is refreshed - it's assigned the id of the current refresh loop
	 * @type {number}
	 */
	_last_refresh_id: 0,
	/**
	 * How many times this view was refreshed during current refresh loop.
	 * Used for infinite loops protection.
	 * @type {number}
	 */
	_refresh_cycle_count: 0,

	/**
	 * Create an instance of the view, including container and assigns; dispatch roles
	 * @param {_cView} config
	 * @param {Lava.widget.Standard} widget
	 * @param {Lava.view.Abstract} parent_view
	 * @param {Lava.system.Template} template
	 * @param {Object} properties
	 */
	init: function(config, widget, parent_view, template, properties) {

		var name,
			argument,
			constructor;

		this.guid = Lava.guid++;
		if (Lava.schema.DEBUG && config.id && !Lava.isValidId(config.id)) Lava.t("Invalid view id: " + config.id);
		if ('id' in config) {
			this.id = config.id;
		}
		if ('label' in config) {
			this.label = config.label;
		}

		Lava.view_manager.registerView(this);

		this._config = config;
		this._widget = widget;
		this._template = template;

		if (parent_view) {

			this._parent_view = parent_view;
			this._parent_with_container = parent_view.getContainer() ? parent_view : parent_view.getParentWithContainer();
			this.depth = parent_view.depth + 1;

		}

		this._initMembers(properties);

		for (name in config.assigns) {

			if (config.assigns[name].once) {

				argument = new Lava.scope.Argument(config.assigns[name], this, this._widget);
				this.set(name, argument.getValue());
				argument.destroy();

			} else {

				if (name in this._property_bindings_by_property) Lava.t("Error initializing assign: property binding already created");

				this._property_bindings_by_property[name] = new Lava.scope.PropertyBinding(this, name, config.assigns[name]);

			}

		}

		if ('container' in config) {

			constructor = Lava.ClassManager.getConstructor(config.container['type'], 'Lava.view.container');
			this._container = new constructor(this, config.container, widget);

		}

		this._postInit();

		if ('roles' in  config) Lava.view_manager.dispatchRoles(this, config.roles);

	},

	/**
	 * Get `_container`
	 * @returns {_iContainer}
	 */
	getContainer: function() { return this._container; },

	/**
	 * Get `_parent_with_container`
	 * @returns {Lava.view.Abstract}
	 */
	getParentWithContainer: function() { return this._parent_with_container; },

	/**
	 * Get `_parent_view`
	 * @returns {Lava.view.Abstract}
	 */
	getParentView: function() { return this._parent_view; },

	/**
	 * Get `_widget`
	 * @returns {Lava.widget.Standard}
	 */
	getWidget: function() { return this._widget; },

	/**
	 * Get `_is_inDOM`
	 * @returns {boolean}
	 */
	isInDOM: function() { return this._is_inDOM; },

	/**
	 * Get `_template`
	 * @returns {Lava.system.Template}
	 */
	getTemplate: function() { return this._template; },

	/**
	 * Setter for the {@link Lava.view.Abstract#id} property
	 * @param {string} new_id
	 */
	setId: function(new_id) {

		if (Lava.schema.DEBUG && !Lava.isValidId(new_id)) Lava.t();
		Lava.view_manager.unregisterView(this);
		this.id = new_id;
		Lava.view_manager.registerView(this);

	},

	/**
	 * Set properties, that were passed to constructor
	 * @param {Object} properties
	 */
	_initMembers: function(properties) {

		for (var name in properties) {

			this.set(name, properties[name]);

		}

	},

	/**
	 * Called before registering roles
	 */
	_postInit: function() {

	},

	/**
	 * Get N'th parent of the view
	 * @param {number} depth The number of view's parent you want to get
	 * @returns {Lava.view.Abstract}
	 */
	getViewByDepth: function(depth) {

		var root = this;

		while (depth > 0) {

			root = root.getParentView();

			if (!root) Lava.t("Error evaluating depth: parent view does not exist");

			depth--;

		}

		return root;

	},

	/**
	 * This view needs to be refreshed. If it has a container - then it can refresh itself independently,
	 * but views without container must ask their parents to refresh them
	 */
	trySetDirty: function() {

		if (this._is_inDOM) {

			if (this._container) {

				this._is_dirty = true;

				if (!this._is_queued_for_refresh) {

					Lava.view_manager.scheduleViewRefresh(this);
					this._is_queued_for_refresh = true;

				}

			} else if (this._parent_with_container) {

				this._parent_with_container.trySetDirty();

			}

		}

	},

	/**
	 * Execute some state changing function on each child of the view
	 * Must be overridden in child classes (in those, that have children)
	 * @param {string} function_name
	 */
	_broadcastToChildren: function(function_name) {},

	/**
	 * Inform that this view is already in DOM. Now it can access it's container's elements
	 */
	broadcastInDOM: function() {

		this._is_inDOM = true;
		this._is_dirty = false;
		this._container && this._container.informInDOM();

		this._broadcastToChildren('broadcastInDOM');

	},

	/**
	 * Inform that this view is now going to be removed from DOM. It must suspend it's bindings,
	 * detach element listeners and stop animations, etc.
	 */
	broadcastRemove: function() {

		if (this._is_inDOM) {

			this._is_inDOM = false;
			this._is_dirty = false;
			this._container && this._container.informRemove();

			this._broadcastToChildren('broadcastRemove');

		}

	},

	/**
	 * Render the view, including container and all it's inner content
	 * @returns {string} The HTML representation of the view
	 */
	render: function() {

		var buffer = this._renderContent(),
			result;

		if (this._container) {

			result = this._container.wrap(buffer);

		} else {

			result = buffer;

		}

		return result;

	},

	/**
	 * Render the inner hierarchy
	 */
	_renderContent: function() {

		Lava.t("_renderContent must be overridden in inherited classes");

	},

	/**
	 * Refresh the view, if it's dirty (render the view's content and replace old content with the fresh version).
	 * This method is called by ViewManager, you should not call it directly.
	 *
	 * Warning: violates code style with multiple return statements
	 */
	refresh: function(refresh_id) {

		if (Lava.schema.DEBUG && !this._container) Lava.t("Refresh on a view without container");

		this._is_queued_for_refresh = false;

		if (this._is_inDOM && this._is_dirty) {

			if (this._last_refresh_id == refresh_id) {

				this._refresh_cycle_count++;
				if (this._refresh_cycle_count > Lava.schema.system.REFRESH_INFINITE_LOOP_THRESHOLD) {

					// schedule this view for refresh in the next refresh loop
					Lava.view_manager.scheduleViewRefresh(this);
					this._is_queued_for_refresh = true;
					// when refresh returns true - it means an infinite loop exception,
					// it stops current refresh loop.
					return true;

				}

			} else {

				this._last_refresh_id = refresh_id;
				this._refresh_cycle_count = 0;

			}

			this._refresh();
			this._is_dirty = false;

		}

		return false;

	},

	/**
	 * Perform refresh
	 */
	_refresh: function() {

		this._container.setHTML(this._renderContent());
		this._broadcastToChildren('broadcastInDOM');

	},

	/**
	 * Find a view with given label in hierarchy of view's parents. Recognizes some predefined labels, like:
	 * - "root" - the root widget (topmost widget with no parents)
	 * - "parent" - this view's parent view
	 * - "widget" - parent widget of this view
	 * - "this" - this view
	 * @param {string} label Label to search for
	 * @returns {Lava.view.Abstract} View with given label
	 */
	locateViewByLabel: function(label) {

		if (Lava.schema.DEBUG && !label) Lava.t();

		var result = this;

		if (label == 'root') {

			result = this._widget;

			while (result.getParentWidget()) {

				result = result.getParentWidget();

			}

		} else if (label == 'parent') {

			result = this._parent_view;

		} else if (label == 'widget') {

			result = this._widget;

		} else if (label != 'this') {

			while (result && result.label != label) {

				result = result.getParentView();

			}

		}

		return result;

	},

	/**
	 * Find a <b>widget</b> with given name in hierarchy of this view's parents
	 *
	 * @param {string} name Name of the widget
	 * @returns {Lava.widget.Standard}
	 */
	locateViewByName: function(name) {

		if (Lava.schema.DEBUG && !name) Lava.t();

		var result = this._widget;

		while (result && result.name != name) {

			result = result.getParentWidget();

		}

		return result;

	},

	/**
	 * Get a view with given user-defined id
	 * @param {string} id
	 * @returns {Lava.view.Abstract}
	 */
	locateViewById: function(id) {

		if (Lava.schema.DEBUG && !id) Lava.t();

		return Lava.view_manager.getViewById(id);

	},

	/**
	 * Get a view by GUID
	 * @param {_tGUID} guid
	 * @returns {Lava.view.Abstract}
	 */
	locateViewByGuid: function(guid) {

		if (Lava.schema.DEBUG && !guid) Lava.t();

		return Lava.view_manager.getViewByGuid(guid);

	},

	/**
	 * Find a view in hierarchy of parents by the given route
	 * @param {_cScopeLocator|_cKnownViewLocator} path_config
	 * @returns {Lava.view.Abstract}
	 */
	locateViewByPathConfig: function(path_config) {

		var result = this['locateViewBy' + path_config.locator_type](path_config.locator);

		if (Lava.schema.DEBUG && !result) Lava.t("View not found. " + path_config.locator_type + ':' + path_config.locator);

		if ('depth' in path_config) {

			result = result.getViewByDepth(path_config.depth);

		}

		return result;

	},

	/**
	 * Get a parent with property `name` defined
	 * @param {string} name
	 * @returns {Lava.view.Abstract}
	 */
	locateViewWithProperty: function(name) {

		var view = this;

		while (view && !view.isset(name)) {

			view = view.getParentView();

		}

		return view;

	},

	/**
	 * Get a scope or property binding by the given route
	 * @param {_cScopeLocator} path_config
	 * @returns {_iValueContainer}
	 */
	getScopeByPathConfig: function(path_config) {

		var view,
			i = 0,
			count,
			result,
			tail = path_config.tail;

		if ('property_name' in path_config) {

			view = ('locator_type' in path_config) ? this.locateViewByPathConfig(path_config) : this;

			view = view.locateViewWithProperty(path_config.property_name);

			if (Lava.schema.DEBUG && !view) Lava.t("Property not found: " + path_config.property_name);

			result = view.getDataBinding(path_config.property_name);

		} else {

			if (Lava.schema.DEBUG && !('locator_type' in path_config)) Lava.t("Malformed scope path (1)");
			if (Lava.schema.DEBUG && !tail) Lava.t("Malformed scope path (2)");

			result = this.locateViewByPathConfig(path_config);

			if (Lava.schema.DEBUG && !result) Lava.t("View not found. "
				+ path_config.locator_type + ": " + path_config.locator + ", depth:" + path_config.depth);

		}

		if (tail) {

			for (count = tail.length; i < count; i++) {

				result = (typeof(tail[i]) == 'object')
					? result.getSegment(this.getScopeByPathConfig(tail[i]))
					: result.getDataBinding(tail[i]);

			}

		}

		return result;

	},

	/**
	 * Get value of the route without creating scopes
	 * @param {_cScopeLocator} path_config
	 * @returns {*}
	 */
	evalPathConfig: function(path_config) {

		var view,
			i = 0,
			count,
			result,
			tail = path_config.tail,
			property_name;

		if ('property_name' in path_config) {

			view = ('locator_type' in path_config) ? this.locateViewByPathConfig(path_config) : this;

			view = view.locateViewWithProperty(path_config.property_name);

			result = view.get(path_config.property_name);

		} else {

			if (Lava.schema.DEBUG && !('locator_type' in path_config)) Lava.t("Malformed scope path (1)");
			if (Lava.schema.DEBUG && !tail) Lava.t("Malformed scope path (2)");

			result = this.locateViewByPathConfig(path_config);

			if (Lava.schema.DEBUG && !result) Lava.t("View not found. "
				+ path_config.locator_type + ": " + path_config.locator + ", depth:" + path_config.depth);

		}

		if (tail) {

			for (count = tail.length; i < count; i++) {

				property_name = (typeof(tail[i]) == 'object') ? this.evalPathConfig(tail[i]) : tail[i];

				if (result.isCollection && /^\d+$/.test(property_name)) {

					result = result.getValueAt(+property_name);

				} else if (result.isProperties) {

					result = result.get(property_name);

				} else {

					result = result[property_name];

				}

				if (!result) {

					break;

				}

			}

		}

		return result;

	},

	/**
	 * Get a binding to this view's property
	 * @param {string} property_name
	 * @returns {Lava.scope.PropertyBinding}
	 */
	getDataBinding: function(property_name) {

		if (!(property_name in this._property_bindings_by_property)) {

			this._property_bindings_by_property[property_name] = new Lava.scope.PropertyBinding(this, property_name);

		}

		return this._property_bindings_by_property[property_name];

	},

	/**
	 * Get a {@link Lava.scope.Segment}, bound to view's property
	 * @param {(Lava.scope.PropertyBinding|Lava.scope.DataBinding)} name_source_scope
	 * @returns {Lava.scope.Segment}
	 */
	getSegment: function(name_source_scope) {

		if (Lava.schema.DEBUG && !name_source_scope.guid) Lava.t("Only PropertyBinding and DataBinding may be used as name source for segments");

		if (!(name_source_scope.guid in this._data_segments)) {

			this._data_segments[name_source_scope.guid] = new Lava.scope.Segment(this, name_source_scope);

		}

		return this._data_segments[name_source_scope.guid];

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		var name;

		this._fire('destroy');

		Lava.view_manager.unregisterView(this);

		if (this._container) this._container.destroy();

		for (name in this._property_bindings_by_property) {

			this._property_bindings_by_property[name].destroy();

		}

		for (name in this._data_segments) {

			this._data_segments[name].destroy();

		}

		this._is_inDOM = false; // to prevent refresh

	}

});

Lava.define(
'Lava.view.View',
/**
 * @lends Lava.view.View#
 * @extends Lava.view.ContentContainerAbstract#
 */
{

	Extends: 'Lava.view.ContentContainerAbstract',

	_postInit: function() {

		if (
			Lava.schema.DEBUG
			&& (('argument' in this._config) || ('else_template' in this._config) || ('elseif_arguments' in this._config))
		) {
			Lava.t("Standard View does not support arguments and elseif/else blocks");
		}

	}

});

Lava.define(
'Lava.view.Expression',
/**
 * View that displays result of an Argument
 *
 * @lends Lava.view.Expression#
 * @extends Lava.view.Abstract
 * @implements _iViewHierarchyMember
 */
{

	Extends: 'Lava.view.Abstract',
	/**
	 * Argument that returns a string
	 * @type {Lava.scope.Argument}
	 */
	_argument: null,
	/**
	 * Listener for {@link Lava.scope.Argument#event:changed}
	 * @type {_tListener}
	 */
	_argument_changed_listener: null,

	/**
	 * Should the view escape HTML entities in argument's value. May be turned off via config switch
	 * @type {boolean}
	 */
	_escape: true,

	_postInit: function() {

		if (Lava.schema.DEBUG && !('argument' in this._config)) Lava.t("Expression view requires an argument");
		this._escape = !this._config.escape_off;
		this._argument = new Lava.scope.Argument(this._config.argument, this, this._widget);
		this._argument_changed_listener = this._argument.on('changed', this._onValueChanged, this);

	},

	/**
	 * Argument's value has changed, schedule refresh
	 */
	_onValueChanged: function() {

		this.trySetDirty();

	},

	_renderContent: function() {

		if (Lava.schema.DEBUG && this._argument.isWaitingRefresh()) Lava.t("Rendering a view in dirty state");

		var result = '',
			new_value = this._argument.getValue();

		if (new_value != null && typeof(new_value) != 'undefined') {

			result = this._escape
				? this.escapeArgumentValue(new_value.toString())
				: new_value.toString();

		}

		return result;

	},

	/**
	 * Perform escaping of HTML entities in argument's value
	 * @param {string} string Argument's value
	 * @returns {string} Escaped value
	 */
	escapeArgumentValue: function(string) {

		return Firestorm.String.escape(string, Firestorm.String.HTML_ESCAPE_REGEX);

	},

	destroy: function() {

		this._argument.destroy();
		this._argument = null;

		this.Abstract$destroy();

	}

});

Lava.define(
'Lava.view.Foreach',
/**
 * Iterate over a sequence of items and render a template for each item
 *
 * @lends Lava.view.Foreach#
 * @extends Lava.view.Abstract
 * @implements _iViewHierarchyMember
 */
{

	Extends: 'Lava.view.Abstract',

	/**
	 * Argument, that returns an array or Enumerable
	 * @type {Lava.scope.Argument}
	 */
	_argument: null,
	/**
	 * Scope, that is preparing results from argument
	 * @type {Lava.scope.Foreach}
	 */
	_foreach_scope: null,
	/**
	 * Listener for {@link Lava.scope.Foreach#event:changed} event
	 * @type {_tListener}
	 */
	_foreach_scope_changed_listener: null,

	/**
	 * Equals to `_current_uids.length`
	 * @type {number}
	 */
	_current_count: 0,
	/**
	 * Unique IDs, received from Enumerable, that was returned from Foreach scope
	 * @type {Array.<number>}
	 */
	_current_uids: [],
	/**
	 * Enumerable UID => Template
	 * @type {Object.<string, Lava.system.Template>}
	 */
	_current_hash: {},

	/**
	 * Templates that correspond to each item in Enumerable
	 * @type {Array.<Lava.system.Template>}
	 */
	_current_templates: [],

	/**
	 * The name of variable, holding the concrete record in child views
	 * @type {string}
	 */
	_as: null,

	/**
	 * Refreshers animate insertion and removal of templates.
	 * They can also insert and remove templates independently of each other
	 * @type {Lava.view.refresher.Standard}
	 */
	_refresher: null,

	_properties: {
		/**
		 * Number of items in Foreach
		 */
		count: 0
	},

	/**
	 * Set each time when scope changes - sign to refresh child templates in `refresh()` or `render()`
	 * @type {boolean}
	 */
	_requires_refresh_children: true,

	init: function(config, widget, parent_view, template, properties) {

		this.Abstract$init(config, widget, parent_view, template, properties);

		// setting count after roles registration, cause scope can be filtered
		this._setCount(this._foreach_scope.getValue().getCount());

	},

	_initMembers: function(properties) {

		if (Lava.schema.DEBUG && !('argument' in this._config)) Lava.t("Foreach view requires an argument");
		if (Lava.schema.DEBUG && !this._config.as) Lava.t("Foreach view requires 'as' hash parameter");
		if (Lava.schema.DEBUG && !this._config.template) Lava.t("Foreach view must not be empty");

		this.Abstract$_initMembers(properties);

		this._argument = new Lava.scope.Argument(this._config.argument, this, this._widget);
		this._foreach_scope = new Lava.scope.Foreach(this._argument, this, this._widget, this._config.scope);
		this._foreach_scope_changed_listener = this._foreach_scope.on('changed', this._onDataSourceChanged, this);
		this._foreach_scope.on('new_enumerable', this._onEnumerableChanged, this);
		this._as = this._config.as;

	},

	_postInit: function() {

		if (this._config.refresher) {
			this.createRefresher(this._config.refresher);
		}

	},

	set: function(name, value) {

		if (Lava.schema.DEBUG && name == "count") Lava.t("Tried to assign 'count' to Foreach view");
		this.Abstract$set(name, value);

	},

	/**
	 * Can be called during roles registration (at the time of `init()`), before children are created.
	 * Initializes a refresher instance with custom config.
	 *
	 * @param {_cRefresher} refresher_config
	 */
	createRefresher: function(refresher_config) {

		if (Lava.schema.DEBUG && (this._refresher || this._current_count)) Lava.t("Foreach: refresher is already created or createRefresher() was called outside of init()");
		if (Lava.schema.DEBUG && !this._container) Lava.t('View/Foreach: refresher needs container to work');

		var constructor = Lava.ClassManager.getConstructor(refresher_config['type'], 'Lava.view.refresher');
		this._refresher = /** @type {Lava.view.refresher.Standard} */ new constructor(refresher_config, this, this._container);

		this._refresher.on('removal_complete', this._onRemovalComplete, this);
		this._refresh = this._refresh_Refresher;
		this._removeTemplates = this._removeTemplates_Refresher;
		this._renderContent = this._renderContent_Refresher;
		this._broadcastToChildren = this._broadcastToChildren_Refresher;

	},

	/**
	 * Get `_refresher`
	 * @returns {Lava.view.refresher.Standard}
	 */
	getRefresher: function() {

		return this._refresher;

	},

	/**
	 * Scope has created a new instance of Enumerable.
	 * Now all UIDs belong to the old enumerable, so must get rid of all templates
	 */
	_onEnumerableChanged: function() {

		var i = 0,
			removed_templates = [];

		for (; i < this._current_count; i++) {

			removed_templates.push(this._current_hash[this._current_uids[i]]);

		}

		removed_templates.length && this._removeTemplates(removed_templates);

		this._current_count = 0;
		this._current_hash = {};
		this._current_uids = [];
		this._current_templates = [];
		this._setCount(0);

	},

	/**
	 * Callback that removes templates for removed Enumerable items.
	 * Version without Refresher support.
	 * @param {Array.<Lava.system.Template>} removed_templates
	 */
	_removeTemplates: function(removed_templates) {

		for (var i = 0, removed_count = removed_templates.length; i < removed_count; i++) {

			removed_templates[i].destroy();

		}

	},

	/**
	 * Callback that removes templates for removed Enumerable items.
	 * Version with Refresher support.
	 * @param {Array.<Lava.system.Template>} removed_templates
	 */
	_removeTemplates_Refresher: function(removed_templates) {

		this._refresher.prepareRemoval(removed_templates);

	},

	/**
	 * Remove old templates, create new
	 */
	_refreshChildren: function() {

		var data_source = this._foreach_scope.getValue(),
			new_uids = data_source.getUIDs(),
			new_uid_to_index_map = data_source.getUIDToIndexMap(),
			count = data_source.getCount(),
			i = 0,
			uid,
			template,
			removed_templates = [],
			child_properties,
			current_templates = [];

		for (; i < this._current_count; i++) {

			uid = this._current_uids[i];

			if (!(uid in new_uid_to_index_map)) {

				removed_templates.push(this._current_hash[uid]);
				delete this._current_hash[uid];

			}

		}

		for (i = 0; i < count; i++) {

			uid = new_uids[i];

			child_properties = {
				foreach_index: i,
				foreach_name: data_source.getNameAt(new_uid_to_index_map[uid])
			};
			child_properties[this._as] = data_source.getValueAt(new_uid_to_index_map[uid]);

			if (uid in this._current_hash) {

				template = this._current_hash[uid];
				template.batchSetProperties(child_properties);

			} else {

				template = new Lava.system.Template(this._config.template, this._widget, this, child_properties);
				this._current_hash[uid] = template;

			}

			current_templates.push(template);

		}

		removed_templates.length && this._removeTemplates(removed_templates);

		this._current_count = count;
		this._current_uids = new_uids;
		this._current_templates = current_templates;
		this._requires_refresh_children = false;

	},

	/**
	 * Callback for {@link Lava.scope.Foreach#event:changed} event
	 */
	_onDataSourceChanged: function() {

		this._setCount(this._foreach_scope.getValue().getCount());
		this._requires_refresh_children = true;
		this.trySetDirty();

	},

	/**
	 * Animation has ended and refresher has removed the `template` from DOM
	 * @param {Lava.view.refresher.Standard} refresher
	 * @param {Lava.system.Template} template
	 */
	_onRemovalComplete: function(refresher, template) {

		template.destroy();

	},

	_renderContent: function() {

		if (Lava.schema.DEBUG && (this._argument.isWaitingRefresh() || this._foreach_scope.isWaitingRefresh())) Lava.t("Rendering a view in dirty state");

		var buffer = '',
			i = 0;

		this._requires_refresh_children && this._refreshChildren();

		for (; i < this._current_count; i++) {

			buffer += this._current_templates[i].render();

		}

		return buffer;

	},

	/**
	 * Version of `_renderContent` for usage with refresher instance
	 * @returns {string}
	 */
	_renderContent_Refresher: function() {

		if (Lava.schema.DEBUG && (this._argument.isWaitingRefresh() || this._foreach_scope.isWaitingRefresh())) Lava.t("Rendering a view in dirty state");
		this._requires_refresh_children && this._refreshChildren();
		return this._refresher.render(this._current_templates);

	},

	_refresh: function() {

		this._requires_refresh_children && this._refreshChildren();
		this._container.setHTML(this._renderContent());
		this._broadcastToChildren('broadcastInDOM');

	},

	/**
	 * Version of `_refresh` for usage with created refresher instance
	 */
	_refresh_Refresher: function() {

		this._requires_refresh_children && this._refreshChildren();
		this._refresher.refresh(this._current_templates);

	},

	_broadcastToChildren: function(function_name) {

		for (var name in this._current_hash) {

			this._current_hash[name][function_name]();

		}

	},

	/**
	 * Version of _broadcastToChildren for usage with created refresher instance
	 * @param {string} function_name
	 */
	_broadcastToChildren_Refresher: function(function_name) {

		this._refresher[function_name]();

	},

	/**
	 * Get `_foreach_scope`. Can be used to sort and filter items.
	 * @returns {Lava.scope.Foreach}
	 */
	getScope: function() {

		return this._foreach_scope;

	},

	_setCount: function(new_count) {
		if (this._properties.count != new_count) {
			this._set("count", new_count);
		}
	},

	destroy: function() {

		var name;

		this._refresher && this._refresher.destroy();

		for (name in this._current_hash) {

			this._current_hash[name].destroy();

		}

		this._foreach_scope.destroy();
		this._argument.destroy();

		this.Abstract$destroy();

		// to speed up garbage collection and break this object forever (destroyed objects must not be used!)
		this._refresher = this._current_templates = this._current_hash = this._foreach_scope = this._argument = null;

	}

});

Lava.define(
'Lava.view.If',
/**
 * Display content depending on condition
 *
 * @lends Lava.view.If#
 * @extends Lava.view.Abstract
 * @implements _iViewHierarchyMember
 */
{

	Extends: 'Lava.view.Abstract',

	/**
	 * One argument for each if/elseif section
	 * @type {Array.<Lava.scope.Argument>}
	 */
	_arguments: [],
	/**
	 * For each argument: it's {@link Lava.scope.Argument#event:changed} listener
	 * @type {Array.<_tListener>}
	 */
	_argument_changed_listeners: [],
	/**
	 * Total number of if/elseif sections
	 * @type {number}
	 */
	_count_arguments: 0,
	/**
	 * Currently active if/elseif section id
	 * @type {number}
	 */
	_active_argument_index: -1,
	/**
	 * Content of each if/elseif section
	 * @type {Array.<Lava.system.Template>}
	 */
	_content: [],
	/**
	 * Template to display when all if/elseif conditions are <kw>false</kw>
	 * @type {Lava.system.Template}
	 */
	_else_content: null,

	/**
	 * Refreshers animate insertion and removal of templates.
	 * They can also insert and remove templates independently of each other
	 * @type {(Lava.view.refresher.Standard)}
	 */
	_refresher: null,
	/**
	 * Currently active Template instance, including the 'else' template
	 * @type {Lava.system.Template}
	 */
	_active_template: null,

	_postInit: function() {

		if (Lava.schema.DEBUG && !('argument' in this._config)) Lava.t("If view requires an argument");

		var i = 0,
			count,
			argument = new Lava.scope.Argument(this._config.argument, this, this._widget);

		this._argument_changed_listeners.push(argument.on('changed', this._onArgumentChanged, this));
		this._arguments.push(argument);

		if ('elseif_arguments' in this._config) {

			for (count = this._config.elseif_arguments.length; i < count; i++) {

				argument = new Lava.scope.Argument(this._config.elseif_arguments[i], this, this._widget);
				this._argument_changed_listeners.push(argument.on('changed', this._onArgumentChanged, this));
				this._arguments.push(argument);

			}

		}

		this._count_arguments = this._arguments.length;
		this._refreshActiveArgumentIndex();

		if (this._config.refresher) {
			this.createRefresher(this._config.refresher);
		}

	},

	/**
	 * Can be called during roles registration (at the time of `init()`), before children are created.
	 * Initializes a refresher instance with custom config.
	 *
	 * @param {_cRefresher} refresher_config
	 */
	createRefresher: function(refresher_config) {

		if (Lava.schema.DEBUG && (this._refresher || this._current_count)) Lava.t("If: refresher is already created or createRefresher() was called outside of init()");
		if (Lava.schema.DEBUG && !this._container) Lava.t('View/If: refresher needs container to work');

		var constructor = Lava.ClassManager.getConstructor(refresher_config['type'], 'Lava.view.refresher');
		this._refresher = /** @type {Lava.view.refresher.Standard} */ new constructor(refresher_config, this, this._container);

		this._refresher.on('removal_complete', this._onRemovalComplete, this);
		this._refresh = this._refresh_Refresher;
		this._removeTemplate = this._removeTemplate_Refresher;
		this._renderContent = this._renderContent_Refresher;
		this._broadcastToChildren = this._broadcastToChildren_Refresher;

	},

	/**
	 * Animation has ended and template was removed from DOM. Destroy it.
	 * @param {Lava.view.refresher.Standard} refresher
	 * @param {Lava.system.Template} template
	 */
	_onRemovalComplete: function(refresher, template) {

		this._destroyTemplate(template);

	},

	/**
	 * Get `_refresher`
	 * @returns {Lava.view.refresher.Standard}
	 */
	getRefresher: function() {

		return this._refresher;

	},

	/**
	 * Get index of the first argument which evaluates to <kw>true</kw>
	 * @returns {?number} Zero-based argument index, or <kw>null</kw>, if all arguments evaluate to <kw>false</kw>
	 */
	_refreshActiveArgumentIndex: function() {

		this._active_argument_index = -1;

		for (var i = 0; i < this._count_arguments; i++) {

			if (!!this._arguments[i].getValue()) {

				this._active_argument_index = i;
				break;

			}

		}

	},

	/**
	 * Get template that corresponds to argument that evaluates to <kw>true</kw>
	 * (or 'else' template, if there are no active arguments)
	 * @returns {?Lava.system.Template}
	 */
	_getActiveTemplate: function() {

		var result = null,
			index = this._active_argument_index;

		if (index != -1) {

			if (!this._content[index]) {

				this._content[index] = (index == 0)
					? new Lava.system.Template(this._config.template || [], this._widget, this, {if_index: index})
					: new Lava.system.Template(this._config.elseif_templates[index - 1] || [], this._widget, this, {if_index: index});

			}

			result = this._content[index];

		} else if ('else_template' in this._config) {

			if (this._else_content == null) {

				this._else_content = new Lava.system.Template(this._config.else_template || [], this._widget, this);

			}

			result = this._else_content;

		}

		return result;

	},

	/**
	 * Listener for argument's {@link Lava.scope.Argument#event:changed} event
	 */
	_onArgumentChanged: function() {

		var old_active_argument_index = this._active_argument_index;
		this._refreshActiveArgumentIndex();

		if (this._active_argument_index != old_active_argument_index) {

			if (this._active_template && this._is_inDOM) {

				this._removeTemplate(this._active_template);

			}

			this.trySetDirty();
			this._active_template = null;

		}

	},

	/**
	 * Branches that are not in DOM are destroyed
	 * @param {Lava.system.Template} template
	 */
	_destroyTemplate: function(template) {

		var index = this._content.indexOf(template);

		if (index == -1) {
			if (Lava.schema.DEBUG && template != this._else_content) Lava.t();
			this._else_content = null;
		} else {
			this._content[index] = null;
		}

		template.destroy();

	},

	/**
	 * Destroys branches, that are removed from DOM
	 * @param {Lava.system.Template} template
	 */
	_removeTemplate: function(template) {

		this._destroyTemplate(template);

	},

	/**
	 * Removes branches from DOM using a refresher instance
	 * @param {Lava.system.Template} template
	 */
	_removeTemplate_Refresher: function(template) {

		this._refresher.prepareRemoval([template]);

	},

	/**
	 * Render the currently active if/elseif section
	 * @returns {string}
	 */
	_renderContent: function() {

		if (Lava.schema.DEBUG) {

			for (var i = 0; i < this._count_arguments; i++) {

				this._arguments[i].isWaitingRefresh() && Lava.t("Rendering a view in dirty state");

			}

		}

		this._active_template = this._getActiveTemplate();
		return this._active_template ? this._active_template.render() : '';

	},

	/**
	 * Version of `_renderContent` which uses created refresher instance
	 * @returns {string}
	 */
	_renderContent_Refresher: function() {

		if (Lava.schema.DEBUG && this._active_argument_index != -1 && this._arguments[this._active_argument_index].isWaitingRefresh()) Lava.t();
		this._active_template = this._getActiveTemplate();
		return this._refresher.render(this._active_template ? [this._active_template] : []);

	},

	/**
	 * Broadcast to currently active if/elseif template
	 * @param {string} function_name
	 */
	_broadcastToChildren: function(function_name) {

		this._active_template && this._active_template[function_name]();

	},

	/**
	 * Version of `_broadcastToChildren` for use with refresher instance
	 * @param {string} function_name
	 */
	_broadcastToChildren_Refresher: function(function_name) {

		this._refresher[function_name]();

	},

	_refresh: function() {

		this._container.setHTML(this._renderContent());
		this._broadcastToChildren('broadcastInDOM');

	},

	/**
	 * Version of `_refresh` for use with refresher instance
	 */
	_refresh_Refresher: function() {

		if (!this._active_template) {
			this._active_template = this._getActiveTemplate();
		}
		this._refresher.refresh(this._active_template ? [this._active_template] : []);

	},

	destroy: function() {

		var i = 0;

		this._refresher && this._refresher.destroy();

		for (; i < this._count_arguments; i++) {

			this._arguments[i].destroy();
			this._content[i] && this._content[i].destroy();

		}

		this._else_content && this._else_content.destroy();

		// to speed up garbage collection and break this object forever (destroyed objects must not be used!)
		this._refresher = this._content = this._else_content = this._arguments = this._active_template
			= this._argument_changed_listeners = null;

		this.Abstract$destroy();

	}

});
Lava.define(
'Lava.view.Include',
/**
 * View, that displays a template, returned by an argument
 *
 * @lends Lava.view.Include#
 * @extends Lava.view.Abstract
 * @implements _iViewHierarchyMember
 */
{

	Extends: 'Lava.view.Abstract',
	/**
	 * Argument that returns a template config
	 * @type {Lava.scope.Argument}
	 */
	_argument: null,
	/**
	 * Listener for {@link Lava.scope.Argument#event:changed}
	 * @type {_tListener}
	 */
	_argument_changed_listener: null,
	/**
	 * Child template
	 * @type {Lava.system.Template}
	 */
	_content: null,

	_postInit: function() {

		if (Lava.schema.DEBUG && !('argument' in this._config)) Lava.t("Include view requires an argument");
		this._argument = new Lava.scope.Argument(this._config.argument, this, this._widget);
		this._argument_changed_listener = this._argument.on('changed', this._onValueChanged, this);

	},

	/**
	 * Argument's value has changed. Old content in not valid.
	 */
	_onValueChanged: function() {

		this._content && this._content.destroy();
		this._content = null;
		this.trySetDirty();

	},

	render: function() {

		if (Lava.schema.DEBUG && this._argument.isWaitingRefresh()) Lava.t("Rendering a view in dirty state");

		var result;

		if (this._container) {

			result = this._container.wrap(this._renderContent());

		} else {

			result = this._renderContent();

		}

		return result;

	},

	_renderContent: function() {

		return this._getContent().render();

	},

	_refresh: function() {

		this._container.setHTML(this._renderContent());
		this._broadcastToChildren('broadcastInDOM');

	},

	/**
	 * @param {string} function_name
	 */
	_broadcastToChildren: function(function_name) {

		if (this._content != null) {

			this._content[function_name]();

		}

	},

	/**
	 * Get `_content`. Create, if needed
	 * @returns {Lava.system.Template}
	 */
	_getContent: function() {

		if (this._content == null) {

			var argument_value = this._argument.getValue();
			if (Lava.schema.DEBUG && argument_value && !Array.isArray(argument_value)) Lava.t("Include view expects to receive a template from it's argument");

			this._content = new Lava.system.Template(
				this._argument.getValue() || this._config.template || [],
				this._widget,
				this
			)

		}

		return this._content;

	},

	destroy: function() {

		this._content && this._content.destroy();
		this._argument.destroy();
		this._argument_changed_listener
			= this._argument
			= this._content
			= null;

		this.Abstract$destroy();

	}

});

Lava.define(
'Lava.view.ContentContainerAbstract',
/**
 * A view, which can have a container and inner template. The only kind of view, which can have a void tag as container
 *
 * @lends Lava.view.ContentContainerAbstract#
 * @extends Lava.view.Abstract#
 * @implements _iViewHierarchyMember
 */
{

	Extends: 'Lava.view.Abstract',

	/**
	 * The content of the view
	 * @type {Lava.system.Template}
	 */
	_content: null,

	render: function() {

		var result;

		if (this._container) {

			// This is the only view, that can have void element containers.
			// Check is done to speed up the rendering process.
			result = (this._container.isElementContainer && this._container.isVoid())
				? this._container.renderVoid()
				: this._container.wrap(this._renderContent());

		} else {

			result = this._renderContent();

		}

		return result;

	},

	_refresh: function() {

		if (!this._container.isVoid()) {
			this._container.setHTML(this._renderContent());
			this._broadcastToChildren('broadcastInDOM');
		}

	},

	_renderContent: function() {

		return this._getContent().render();

	},

	/**
	 * @param {string} function_name
	 */
	_broadcastToChildren: function(function_name) {

		if (this._content != null) {

			this._content[function_name]();

		}

	},

	/**
	 * Get `_content`. Create, if needed
	 * @returns {Lava.system.Template}
	 */
	_getContent: function() {

		if (this._content == null) {

			this._content = new Lava.system.Template(this._config.template || [], this._widget, this)

		}

		return this._content;

	},

	destroy: function() {

		if (this._content) {
			this._content.destroy();
			this._content = null;
		}

		this.Abstract$destroy();

	}

});

Lava.define(
'Lava.view.TextArea',
/**
 * This view is intended for use with textarea container - it properly escapes the text inside.
 *
 * @lends Lava.view.TextArea#
 * @extends Lava.view.ContentContainerAbstract#
 */
{

	Extends: 'Lava.view.ContentContainerAbstract',

    _argument: null,

    _postInit: function() {

        if (Lava.schema.DEBUG && (('else_template' in this._config) || ('elseif_arguments' in this._config))) {
            Lava.t("TextArea View does not support elseif/else blocks");
        }

        if (Lava.schema.DEBUG && !('argument' in this._config)) Lava.t("TextArea view requires an argument");
        this._argument = new Lava.scope.Argument(this._config.argument, this, this._widget);

    },

	_renderContent: function() {

        if (Lava.schema.DEBUG && this._argument.isWaitingRefresh()) Lava.t("Rendering a view in dirty state");
		return Firestorm.String.escape(this._argument.getValue(), Firestorm.String.TEXTAREA_ESCAPE_REGEX);

	},

    destroy: function() {

        this._argument.destroy();
        this._argument = null;

        this.ContentContainerAbstract$destroy();

    }

});

Lava.define(
'Lava.widget.Standard',
/**
 * Base class for all widgets
 * @lends Lava.widget.Standard#
 * @extends Lava.view.View#
 * @implements _iViewHierarchyMember
 */
{

	Extends: 'Lava.view.View',
	Shared: ['_property_descriptors', '_event_handlers', '_role_handlers', '_include_handlers', '_modifiers'],

	/**
	 * Instance is widget
	 * @type {boolean}
	 * @readonly
	 */
	isWidget: true,
	/**
	 * Widget's name for referencing from templates. Each kind of widget should have it's own unique name
	 * @readonly
	 */
	name: 'widget',

	/**
	 * Rules for accessing widget's properties
	 * @type {Object.<string, _cPropertyDescriptor>}
	 */
	_property_descriptors: {},

	/**
	 * List of non-default template events, to which this widget responds
	 * @type {Array.<string>}
	 */
	_acquired_events: [],
	/**
	 * Map of template event handlers
	 * @type {Object.<string, string>}
	 */
	_event_handlers: {},
	/**
	 * Map of template role handlers
	 * @type {Object.<string, string>}
	 */
	_role_handlers: {},
	/**
	 * Map of template include handlers
	 * @type {Object.<string, string>}
	 */
	_include_handlers: {},

	/**
	 * Two-way bindings to properties of this widget
	 * @type {Object.<string, Lava.scope.Binding>}
	 */
	_bindings: {},
	/**
	 * Resources from widget config
	 * @type {Object}
	 */
	_resources: {},
	/**
	 * Nearest parent widget in hierarchy
	 * @type {?Lava.widget.Standard}
	 */
	_parent_widget: null,

	/**
	 * Map of template callbacks. Called in context of the widget
	 * @type {Object.<string, string>}
	 */
	_modifiers: {
		translate: 'translate',
		ntranslate: 'ntranslate',
		translateBoolean: 'translateBoolean'
	},

	/**
	 * Create widget instance
	 * @param {_cWidget} config
	 * @param {Lava.widget.Standard} widget
	 * @param {Lava.view.Abstract} parent_view
	 * @param {Lava.system.Template} template
	 * @param {Object} properties
	 */
	init: function(config, widget, parent_view, template, properties) {

		var name,
			count,
			i;

		if (Lava.schema.DEBUG && !config.is_extended) Lava.t("Widget was created with partial (unextended) config");

		if (Lava.schema.DEBUG) {
			for (name in this._property_descriptors) {
				if (!(name in this._properties)) Lava.t("All widget properties must have a default value");
			}
			if (config.default_events) {
				for (i = 0, count = config.default_events.length; i < count; i++) {
					if (!Lava.view_manager.isEventRouted(config.default_events[i])) Lava.t('Event is not routed: ' + config.default_events[i]);
				}
			}
		}

		this._parent_widget = widget;

		this.View$init(config, this, parent_view, template, properties);

		for (name in config.bindings) {

			this._bindings[name] = new Lava.scope.Binding(config.bindings[name], this);

		}

	},

	_initMembers: function(properties) {

		this.View$_initMembers(properties);

		for (var name in this._config.properties) {

			this.set(name, this._config.properties[name]);

		}

		if (Lava.schema.RESOURCES_ENABLED) {

			this._initResources(this._config);

		}

	},

	/**
	 * Get, merge and prepare resources for this widget
	 * @param {_cWidget} config
	 */
	_initResources: function(config) {

		var locale = Lava.schema.LOCALE,
			resource_owner,
			component_resource,
			resources;

		if ('resources_cache' in config) {

			resources = config.resources_cache[locale];

		}

		if ('resource_id' in config) {

			resource_owner = this['locateViewBy' + config.resource_id.locator_type](config.resource_id.locator);
			if (Lava.schema.DEBUG && (!resource_owner || !resource_owner.isWidget))
				Lava.t("Resource root not found: " + config.resource_id.locator_type + '=' + config.resource_id.locator);
			component_resource = resource_owner.getResource(config.resource_id.name, Lava.schema.LOCALE);

			if (component_resource) {

				if (Lava.schema.DEBUG && component_resource.type != 'component') Lava.t("resource value is not a component");

				resources = resources
					? Lava.resources.mergeResources(component_resource.value, resources)
					: component_resource.value;

			}

		}

		if (resources) {
			this._resources[locale] = resources;
			Lava.resources.mergeRootContainerStacks(resources);
		}

	},

	/**
	 * Get view's include
	 * @param {string} name Include name
	 * @param {Array} template_arguments Evaluated argument values from view's template
	 * @returns {?_tTemplate}
	 */
	getInclude: function(name, template_arguments) {

		var result = null;

		if (name in this._include_handlers) {

			result = this[this._include_handlers[name]](template_arguments);

		} else {

			result = this._config.includes[name];

		}

		return result;

	},

	/**
	 * Respond to DOM event, routed by {@link Lava.system.ViewManager}
	 * @param {string} dom_event_name
	 * @param event_object Browser event object, wrapped by the framework
	 * @param {string} handler_name Template event name
	 * @param {Lava.view.Abstract} source_view View, that is the source for this event
	 * @param {Array.<*>} template_arguments Evaluated argument values from view's template
	 * @returns {boolean} <kw>true</kw>, if event was handled, and <kw>false</kw> otherwise
	 */
	handleEvent: function(dom_event_name, event_object, handler_name, source_view, template_arguments) {

		var result = false;

		if (handler_name in this._event_handlers) {

			this[this._event_handlers[handler_name]](dom_event_name, event_object, source_view, template_arguments);
			result = true;

		}

		return result;

	},

	/**
	 * Render and insert the widget instance into DOM
	 * @param {HTMLElement} element
	 * @param {_eInsertPosition} position
	 */
	inject: function(element, position) {

		if (this._is_inDOM) Lava.t("inject: widget is already in DOM");
		if (Lava.schema.DEBUG && this._parent_view) Lava.t("Widget: only top-level widgets can be inserted into DOM");
		if (Lava.schema.DEBUG && !this._container) Lava.t("Widget: root widgets must have a container");

		// Otherwise, if you assign data to a widget, that was removed from DOM,
		// and then render it - it will render with old data.
		Lava.ScopeManager.refresh();

		// lock, cause render operation can change data. Although it's not recommended to change data in render().
		Lava.ScopeManager.lock();
		Firestorm.DOM.insertHTML(element, this.render(), position || 'Top');
		Lava.ScopeManager.unlock();
		this.broadcastInDOM();

	},

	/**
	 * The target element becomes container for this widget.
	 * Primary usage: inject a widget into the &lt;body&gt; element
	 * @param element
	 */
	injectIntoExistingElement: function(element) {

		if (this._is_inDOM) Lava.t("inject: widget is already in DOM");
		if (Lava.schema.DEBUG && this._parent_view) Lava.t("Widget: only top-level widgets can be inserted into DOM");
		if (Lava.schema.DEBUG && !this._container) Lava.t("Widget: root widgets must have a container");
		if (Lava.schema.DEBUG && !this._container.isElementContainer) Lava.t("injectIntoExistingElement expects an element containers");

		Lava.ScopeManager.refresh();

		Lava.ScopeManager.lock();
		this._container.captureExistingElement(element);
		this._container.setHTML(this._renderContent());
		Lava.ScopeManager.unlock();

		// rewritten broadcastInDOM - without this._container.informInDOM()
		this._is_inDOM = true;
		this._is_dirty = false;
		this._broadcastToChildren('broadcastInDOM');

	},

	/**
	 * Remove widget from DOM. Only `inject()`'ed (root) widgets may be removed this way
	 */
	remove: function() {

		if (!this._is_inDOM) Lava.t("remove: widget is not in DOM");
		if (Lava.schema.DEBUG && !this._container) Lava.t("remove: widget doesn't have a container");

		this._is_inDOM = false;
		this._is_dirty = false;
		this._broadcastToChildren('broadcastRemove');

		if (this._container.isElementContainer && !this._container.isElementOwner()) {

			this._container.releaseElement();

		} else {

			this._container.remove()

		}

	},

	/**
	 * Call a template method
	 * @param {string} name Modifier name
	 * @param {Array} arguments_array Evaluated template arguments
	 * @returns {*}
	 */
	callModifier: function(name, arguments_array) {

		if (Lava.schema.DEBUG && !(name in this._modifiers)) Lava.t("Unknown widget modifier: " + name);

		return this[this._modifiers[name]].apply(this, arguments_array);

	},

	/**
	 * Deprecated
	 * @param {string} name
	 * @param {Array} arguments_array
	 * @returns {*}
	 */
	callActiveModifier: function(name, arguments_array) {

		Lava.t("Alpha version. This functionality may be removed later.");

	},

	/**
	 * Get `_parent_widget`
	 * @returns {Lava.widget.Standard}
	 */
	getParentWidget: function() {

		return this._parent_widget;

	},

	/**
	 * Handle a view with a role in this widget
	 * @param {string} role Role name
	 * @param {Lava.view.Abstract} view
	 * @param {Array.<*>} template_arguments
	 * @returns {boolean} <kw>true</kw>, if the role was handled, and <kw>false</kw> otherwise
	 */
	handleRole: function(role, view, template_arguments) {

		var result = false;

		if (role in this._role_handlers) {

			this[this._role_handlers[role]](view, template_arguments);
			result = true;

		}

		return result;

	},

	set: function(name, value) {

		var descriptor;

		if (name in this._property_descriptors) {

			descriptor = this._property_descriptors[name];

			if (Lava.schema.DEBUG && descriptor.is_readonly) Lava.t("Trying to set readonly property: " + name);

			if (Lava.schema.widget.VALIDATE_PROPERTY_TYPES) {

				if (value === null) {

					if (!descriptor.is_nullable) Lava.t("Trying to assign NULL to non-nullable property");

				} else if (descriptor.type && !Lava.types[descriptor.type].isValidValue(value, descriptor)) {

					Lava.t("Assigned value does not match the property type: " + descriptor.type);

				}

			}

		}

		if (this._properties[name] !== value) {

			if (descriptor && descriptor.setter) {

				// you are forced to make setters private, cause type-checking will not work if setter is called directly.
				if (Lava.schema.DEBUG && descriptor.setter[0] != '_') Lava.t("Widget property setters must not be public: " + descriptor.setter);
				this[descriptor.setter](value, name);

			} else {

				this._set(name, value);

			}

		}

	},

	get: function(name) {

		return ((name in this._property_descriptors) && this._property_descriptors[name].getter)
			? this[this._property_descriptors[name].getter](name)
			: this.View$get(name);

	},

	/**
	 * Get constructor of a class, which is part of this widget
	 * @param {string} path Path suffix
	 * @returns {Function} Class constructor
	 */
	getPackageConstructor: function(path) {

		return Lava.ClassManager.getPackageConstructor(this.Class.path, path);

	},

	/**
	 * Get a resource object by it's name
	 * @param {string} resource_name
	 * @param {string} locale
	 * @returns {*}
	 */
	getResource: function(resource_name, locale) {

		locale = locale || Lava.schema.LOCALE;

		return ((locale in this._resources) && (resource_name in this._resources[locale]))
			? this._resources[locale][resource_name]
			: null;

	},

	/**
	 * Get a scope instance
	 * @param {Lava.view.Abstract} view
	 * @param {_cDynamicScope} config
	 */
	getDynamicScope: function(view, config) {

		Lava.t('Not implemented: getDynamicScope');

	},

	/**
	 * (modifier) Translate a string from resources. If `arguments_list` is present - then also replaces
	 * `{&lt;number&gt;}` sequences with corresponding value from array.
	 * @param {string} resource_name
	 * @param {Array} arguments_list
	 * @param {string} locale
	 * @returns {string}
	 */
	translate: function(resource_name, arguments_list, locale) {

		var string_descriptor = /** @type {_cTranslatableString} */ this.getResource(resource_name, locale || Lava.schema.LOCALE),
			result;

		if (string_descriptor) {

			if (Lava.schema.DEBUG && string_descriptor.type != 'string') Lava.t("[translate] resource is not a string: " + resource_name);

			if (arguments_list) {

				result = string_descriptor.value.replace(/\{(\d+)\}/g, function(dummy, index) {
					return arguments_list[index] || '';
				});

			} else {

				result = string_descriptor.value;

			}

		} else {

			result = '';
			Lava.logError("Resource string not found: " + resource_name);

		}

		return result;

	},

	/**
	 * (modifier) Translate a plural string from resources. If `arguments_list` is present - then also replaces
	 * `{&lt;number&gt;}` sequences with corresponding value from array.
	 * @param {string} string_name
	 * @param {number} n
	 * @param {Array} arguments_list
	 * @param {string} locale
	 * @returns {string}
	 */
	ntranslate: function(string_name, n, arguments_list, locale) {

		var string_descriptor = /** @type {_cTranslatablePlural} */ this.getResource(string_name, locale || Lava.schema.LOCALE),
			form_index = Lava.locales[Lava.schema.LOCALE].pluralize(n || 0),
			pluralform,
			result;

		if (string_descriptor) {

			if (Lava.schema.DEBUG && string_descriptor.type != 'plural_string') Lava.t("[ntranslate] resource is not a plural_string: " + string_name);
			pluralform = string_descriptor.value[form_index];
			if (Lava.schema.DEBUG && pluralform == null) Lava.t("[ntranslate] requested plural string is missing one of it's plural forms:" + string_name);

			if (arguments_list) {

				result = pluralform.replace(/\{(\d+)\}/g, function(dummy, index) {
					return arguments_list[index] || '';
				});

			} else {

				result = pluralform;

			}

		} else {

			result = '';
			Lava.logError("Resource string not found: " + string_name);

		}

		return result;

	},

	/**
	 * (modifier) Translate a boolean type into user language
	 * @param value
	 * @returns {string}
	 */
	translateBoolean: function(value) {

		if (Lava.schema.DEBUG && typeof(value) != 'boolean') Lava.t("translateBoolean: argument is not boolean type");
		return Lava.locales[Lava.schema.LOCALE].booleans[+value];

	},

	destroy: function() {

		var name;

		for (name in this._bindings) {

			this._bindings[name].destroy();

		}

		this._bindings = this._resources = null;

		this.View$destroy();

	}

});

Lava.define(
'Lava.widget.input.InputAbstract',
/**
 * Base class for support of html &lt;input&gt; fields
 * @lends Lava.widget.input.InputAbstract#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',
	Shared: ["DEFAULT_ROLES"],

	_property_descriptors: {
		name: {type: 'String', is_nullable: true},
		value: {type: 'String', is_nullable: true},
		is_disabled: {type: 'Boolean'},
		is_required: {type: 'Boolean'},
		is_readonly: {type: 'Boolean'},
		is_valid: {type: 'Boolean', is_readonly: true}
	},

	_properties: {
		/** Input's "name" attribute */
		name: null,
		/** Input's "value" attribute */
		value: null,
		/** "disabled" attribute of the input */
		is_disabled: false,
		/** "required" attribute of the input */
		is_required: false,
		/** "readonly" attribute of the input */
		is_readonly: false,
		/** Is current input of HTML element valid for this kind of field */
		is_valid: true
	},

	_role_handlers: {
		_input_view: '_handleInputView',
		label: '_handleLabel'
	},

	/**
	 * The input's "type" attribute
	 * @type {string}
	 */
	_type: null,
	/**
	 * DOM input element
	 * @type {Lava.view.container.Element}
	 */
	_input_container: null,

	/**
	 * Will be dispatched in `init()`. Needed to register input in forms and field groups.
	 * @type {Array.<_cTarget>}
	 */
	DEFAULT_ROLES: [{name: 'form_field'}],

	init: function(config, widget, parent_view, template, properties) {

		this.Standard$init(config, widget, parent_view, template, properties);
		Lava.view_manager.dispatchRoles(this, this.DEFAULT_ROLES);

	},

	/**
	 * Save container of the DOM input element and set it's type
	 * @param {Lava.view.Abstract} view
	 */
	_handleInputView: function(view) {

		this._input_container = view.getContainer();

		// type may be null in textarea
		if (!this._input_container.getProperty('type') && this._type) {
			this._input_container.storeProperty('type', this._type);
		}

		Lava.view_manager.cancelBubble();

	},

	/**
	 * Get `_input_container`
	 * @returns {Lava.view.container.Element}
	 */
	getMainContainer: function() {

		return this._input_container;

	},

	/**
	 * Focus the input's element, if it's currently in DOM
	 */
	focus: function() {

		if (this._input_container && this._input_container.isInDOM()) {
			this._input_container.getDOMElement().focus();
		}

	},

	/**
	 * Encode as part of GET request
	 * @returns {string}
	 */
	toQueryString: function() {

		return (this._properties.name && !this._properties.is_disabled && this._properties.value != null)
			? encodeURIComponent(this._properties.name) + '=' + encodeURIComponent(this._properties.value)
			: '';

	},

	/**
	 * Protected setter for readonly <wp>is_valid</wp> property
	 * @param {boolean} value New value for <wp>is_valid</wp> property
	 */
	_setValidity: function(value) {

		if (this._properties.is_valid != value) {
			this._set('is_valid', value);
		}

	},

	/**
	 * Assign "for" attribute to label
	 * @param view
	 */
	_handleLabel: function(view) {

		view.getContainer().setProperty('for', Lava.ELEMENT_ID_PREFIX + this.guid);

	},

	destroy: function() {
		this._input_container = null;
		this.Standard$destroy();
	}

});

Lava.define(
'Lava.widget.input.TextAbstract',
/**
 * Base class for text inputs
 * @lends Lava.widget.input.TextAbstract#
 * @extends Lava.widget.input.InputAbstract#
 */
{

	Extends: 'Lava.widget.input.InputAbstract',

	_property_descriptors: {
		value: {type: 'String', setter: '_setValue'}
	},

	_properties: {
		/** Current text inside the input element */
		value: ''
	},

	_event_handlers: {
		value_changed: '_refreshValue',
		input: '_onTextInput'
	},

	/**
	 * Set input's value
	 * @param {string} value
	 */
	_setValue: function(value) {

		this._set('value', value);
		if (this._input_container) {
			this._input_container.setProperty('value', this._valueToElementProperty(value));
		}

	},

	/**
	 * Convert value before setting it to Element
	 * @param {*} value
	 * @returns {string}
	 */
	_valueToElementProperty: function(value) {

		return value;

	},

	/**
	 * Get value from DOM input element and set local {@link Lava.widget.input.InputAbstract#property:value} property
	 */
	_refreshValue: function() {

		var value = this._input_container.getDOMElement().value;

		if (this._properties.value != value) {

			this._set('value', value);
			this._input_container.storeProperty('value', this._properties.value);

		}

	},

	/**
	 * DOM element's value changed: refresh local {@link Lava.widget.input.InputAbstract#property:value} property
	 */
	_onTextInput: function() {

		this._refreshValue();

	}

});

Lava.define(
'Lava.widget.input.TextArea',
/**
 * Multiline text input field
 * @lends Lava.widget.input.TextArea#
 * @extends Lava.widget.input.TextAbstract#
 */
{

	Extends: 'Lava.widget.input.TextAbstract',
	name: 'textarea'

});

Lava.define(
'Lava.widget.input.Text',
/**
 * Text input field
 * @lends Lava.widget.input.Text#
 * @extends Lava.widget.input.TextAbstract#
 */
{

	Extends: 'Lava.widget.input.TextAbstract',

	name: 'text_input',
	_type: "text",

	_handleInputView: function(view, template_arguments) {

		this.TextAbstract$_handleInputView(view, template_arguments);
		this._input_container.storeProperty('value', this._properties.value);

	}

});

Lava.define(
'Lava.widget.input.Password',
/**
 * Password input field
 * @lends Lava.widget.input.Password#
 * @extends Lava.widget.input.Text#
 */
{

	Extends: 'Lava.widget.input.Text',
	_type: "password"

});

/**
 * Radio or checkbox has changed it's "checked" or "indeterminate" state
 * @event Lava.widget.input.RadioAbstract#checked_changed
 */

Lava.define(
'Lava.widget.input.RadioAbstract',
/**
 * Base class for Radio and CheckBox classes
 * @lends Lava.widget.input.RadioAbstract#
 * @extends Lava.widget.input.InputAbstract#
 */
{

	Extends: 'Lava.widget.input.InputAbstract',

	_property_descriptors: {
		is_checked: {type: 'Boolean', setter: '_setIsChecked'}
	},

	_properties: {
		/** Is this checkbox or radio currently selected (checked)? */
		is_checked: false
	},

	_event_handlers: {
		checked_changed: '_onCheckedChanged'
	},

	_handleInputView: function(view, template_arguments) {

		this.InputAbstract$_handleInputView(view, template_arguments);
		this._input_container.storeProperty('checked', this._properties.is_checked ? 'checked' : null);

	},

	/**
	 * Set the "checked" property on checkbox or radio input element
	 * @param {boolean} value
	 */
	_setIsChecked: function(value) {

		this._set('is_checked', value);
		if (this._input_container) {
			this._input_container.setProperty('checked', this._properties.is_checked ? 'checked' : null);
		}

	},

	/**
	 * Element's checked state has changed. Update local <wp>is_checked</wp> property
	 */
	_onCheckedChanged: function() {

		this.set('is_checked', this._input_container.getDOMElement().checked);
		this._fire('checked_changed');

	},

	toQueryString: function() {

		return (this._properties.name && this._properties.is_checked)
			? this._properties.name + "=" + (this._properties.value || 'on')
			: '';

	}

});

Lava.define(
'Lava.widget.input.CheckBox',
/**
 * CheckBox input
 * @lends Lava.widget.input.CheckBox#
 * @extends Lava.widget.input.RadioAbstract#
 */
{

	Extends: 'Lava.widget.input.RadioAbstract',

	name: 'checkbox',
	_type: "checkbox",

	_property_descriptors: {
		is_indeterminate: {type: 'Boolean', setter: '_setIsIndeterminate'}
	},

	_properties: {
		/** Is checkbox in indeterminate state */
		is_indeterminate: false
	},

	/**
	 * Set "indeterminate" property on checkbox input element
	 */
	_refreshIndeterminate: function() {

		if (this._input_container && this._input_container.getDOMElement()) {
			this._input_container.getDOMElement().indeterminate = this._properties.is_indeterminate;
		}

	},

	broadcastInDOM: function() {

		this.RadioAbstract$broadcastInDOM();
		this._refreshIndeterminate();

	},

	_refresh: function() {

		this.RadioAbstract$_refresh();
		this._refreshIndeterminate();

	},

	_setIsChecked: function(value, name) {

		this.RadioAbstract$_setIsChecked(value, name);
		this._setIsIndeterminate(false);

	},

	/**
	 * Setter for <wp>is_indeterminate</wp> property
	 * @param {boolean} value
	 */
	_setIsIndeterminate: function(value) {

		if (this._properties.is_indeterminate != value) {
			this._set('is_indeterminate', value);
		}
		this._refreshIndeterminate(); // outside of condition: do not trust the browser and set anyway

	},

	_onCheckedChanged: function() {

		this.RadioAbstract$_onCheckedChanged();
		this.set('is_indeterminate', false);

	}

});

Lava.define(
'Lava.widget.input.Radio',
/**
 * Radio input
 * @lends Lava.widget.input.Radio#
 * @extends Lava.widget.input.RadioAbstract#
 */
{

	Extends: 'Lava.widget.input.RadioAbstract',

	name: 'radio',
	_type: "radio",

	broadcastInDOM: function() {

		this.RadioAbstract$broadcastInDOM();

		if (this._input_container) {
			// There may be situation, when several radios with same name are rendered as checked.
			// Only the last one of them will stay checked, others will be turned off by the browser.
			this.set('is_checked', this._input_container.getDOMElement().checked);
		}

	}

});

/**
 * Submit button was clicked
 * @event Lava.widget.input.Submit#clicked
 */

Lava.define(
'Lava.widget.input.Submit',
/**
 * Submit button input
 * @lends Lava.widget.input.Submit#
 * @extends Lava.widget.input.InputAbstract#
 */
{

	Extends: 'Lava.widget.input.InputAbstract',

	name: 'submit',
	_type: "submit",

	_event_handlers: {
		clicked: '_onClicked'
	},

	/**
	 * Submit button was clicked. Fire "clicked" event
	 * @param dom_event_name
	 * @param event_object
	 */
	_onClicked: function(dom_event_name, event_object) {

		this._fire('clicked');
		event_object.preventDefault();

	}

});

Lava.define(
'Lava.widget.input.SelectAbstract',
/**
 * Base class for select inputs
 * @lends Lava.widget.input.SelectAbstract#
 * @extends Lava.widget.input.InputAbstract#
 */
{

	Extends: 'Lava.widget.input.InputAbstract',

	name: 'select',

	_properties: {
		/**
		 * Option groups in this select input.
		 * &lt;optgroup&gt; tag is created only for those groups that have a title
		 */
		optgroups: null
	},

	_event_handlers: {
		value_changed: '_onValueChanged'
	},

	_modifiers: {
		isValueSelected: 'isValueSelected'
	},

	broadcastInDOM: function() {

		this.InputAbstract$broadcastInDOM();
		this._refreshValue();

	},

	/**
	 * DOM element's value has changed: refresh local <wp>value</wp> property
	 */
	_onValueChanged: function() {

		this._refreshValue();

	},

	_refresh: function() {

		// to synchronize the selected value after setting options and optgroups property
		this.InputAbstract$_refresh();
		this._refreshValue();

	},

	/**
	 * Refresh local <wp>value</wp> property from DOM input element
	 */
	_refreshValue: function() {

		Lava.t('Abstract method call');

	}

});

Lava.define(
'Lava.widget.input.Select',
/**
 * Dropdown select
 * @lends Lava.widget.input.Select#
 * @extends Lava.widget.input.SelectAbstract#
 */
{

	Extends: 'Lava.widget.input.SelectAbstract',

	_property_descriptors: {
		value: {type: 'String', setter: '_setValue'}
	},

	_refreshValue: function() {

		var element = this._input_container.getDOMElement();
		// https://mootools.lighthouseapp.com/projects/2706/tickets/578-elementgetselected-behaves-differently-between-ffie-safari
		//noinspection BadExpressionStatementJS
		element.selectedIndex;
		this.set('value', element.value);

	},

	/**
	 * Setter for the <wp>value</wp> property
	 * @param {string} value
	 */
	_setValue: function(value) {

		var element;

		if (this._input_container) {
			element = this._input_container.getDOMElement();
			element.value = value;
			if (value != element.value) { // workaround for nonexistent values
				Lava.logError("[Select] nonexistent value assigned: " + value);
				value = element.value;
			}
		}

		this._set('value', value);

	},

	/**
	 * {modifier} This widget does not use live bindings of "selected" property, so this modifier is used to speed up rendering
	 * @param {string} value
	 * @returns {boolean}
	 */
	isValueSelected: function(value) {
		return value == this._properties.value;
	}

});

Lava.define(
'Lava.widget.input.MultipleSelect',
/**
 * Select input with multiple choices
 * @lends Lava.widget.input.MultipleSelect#
 * @extends Lava.widget.input.SelectAbstract#
 */
{

	Extends: 'Lava.widget.input.SelectAbstract',

	name: 'select',

	_property_descriptors: {
		value: {type: 'Array', setter: '_setValue'}
	},

	_properties: {
		value: []
	},

	_handleInputView: function(view, template_arguments) {

		this.SelectAbstract$_handleInputView(view, template_arguments);
		this._input_container.storeProperty('multiple', true);

	},

	_refreshValue: function() {

		var element = this._input_container.getDOMElement(),
			options = element.selectedOptions || element.options,
			result = [],
			i = 0,
			count = options.length,
			option_value,
			differs = false;

		for (; i < count; i++) {
			if (options[i].selected) {
				option_value = options[i].value || options[i].text;
				result.push(option_value);
				if (this._properties.value.indexOf(option_value) == -1) {
					differs = true;
				}
			}
		}

		if (differs || this._properties.value.length != result.length) {

			this._set('value', result);

		}

	},

	/**
	 * Setter for the <wp>value</wp> property
	 * @param {Array.<string>} value
	 */
	_setValue: function(value) {

		var element,
			options,
			count,
			i = 0,
			option_value;

		if (this._input_container) {

			element = this._input_container.getDOMElement();
			options = element.options;
			count = options.length;
			for (; i < count; i++) {
				option_value = options[i].value || options[i].text;
				options[i].selected = (value.indexOf(option_value) != -1);
			}

		}

		this._set('value', value);

	},

	/**
	 * {modifier} This widget does not use bindings of "selected" property, so this modifier is used to speed up rendering
	 * @param {string} value
	 * @returns {boolean}
	 */
	isValueSelected: function(value) {

		return this._properties.value.indexOf(value) != -1;

	},

	toQueryString: function() {

		var result = [],
			name = this._properties.name,
			values = this._properties.value,
			i = 0,
			count = values.length;

		if (this._properties.name && !this._properties.is_disabled) {
			for (; i < count; i++) {
				result.push(
					encodeURIComponent(name) + '=' + encodeURIComponent(values[i])
				);
			}
		}

		return result.join('&');

	}

});

Lava.define(
'Lava.widget.input.Numeric',
/**
 * Numeric input
 * @lends Lava.widget.input.Numeric#
 * @extends Lava.widget.input.Text#
 */
{

	Extends: 'Lava.widget.input.Text',

	_property_descriptors: {
		value: {type: 'Number', setter: '_setValue'},
		input_value: {type: 'String', is_readonly: true}
	},

	_properties: {
		value: 0,
		/** Text, that is currently entered into the DOM element */
		input_value: ''
	},

	_type: "number",
	/**
	 * A type from {@link Lava.types}
	 * @type {string}
	 */
	_data_type: 'Number',

	/**
	 * @param config
	 * @param {string} config.options.type The only possible value is "text" - to change default &lt;input&gt; element
	 *  type from "number" to "text"
	 * @param {string} config.options.data_type Widget's value type from {@link Lava.types}.
	 *  Must produce valid JavaScript number. Defaults to "Number"
	 * @param widget
	 * @param parent_view
	 * @param template
	 * @param properties
	 */
	init: function(config, widget, parent_view, template, properties) {

		this.Text$init(config, widget, parent_view, template, properties);

		if (config.options) {

			if (config.options['type']) {

				if (config.options['type'] != 'text') Lava.t('Numeric input: the only recognized "type" option value in "text"');
				this._type = config.options['type'];

			}

			if (config.options['data_type']) {

				this._data_type = config.options['data_type'];

			}

		}

	},

	_valueToElementProperty: function(value) {

		return value + '';

	},

	_refreshValue: function() {

		var value = this._input_container.getDOMElement().value,
			is_valid = Lava.types[this._data_type].isValidString(value);

		if (this._properties.input_value != value) { // to bypass readonly check

			this._set('input_value', value);

		}

		if (is_valid) {

			if (this._properties.value != value) {

				this._set('value', value);
				this._input_container.storeProperty('value', value);

			}

			this._setValidity(true);

		}

		this._setValidity(is_valid);

	},

	_setValue: function(value, name) {

		this.Text$_setValue(value, name);
		this._setValidity(true);

	}

});

Lava.define(
'Lava.widget.FieldGroup',
/**
 * Manages a collection of form input fields
 * @lends Lava.widget.FieldGroup#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',

	name: 'field_group',

	_role_handlers: {
		form_field: '_handleFieldRole',
		form_group: '_handleGroupRole'
	},

	_event_handlers: {
		form_submit: '_onSubmit'
	},

	/**
	 * Input widgets, registered with the FieldGroup
	 * @type {Array.<Lava.widget.input.InputAbstract>}
	 */
	_fields: [],
	/**
	 * Other FieldGroup instances registered with this widget
	 * @type {Array.<Lava.widget.FieldGroup>}
	 */
	_groups: [],
	/**
	 * Submit button fields
	 * @type {Array.<Lava.widget.input.Submit>}
	 */
	_submit_fields: [],

	/**
	 * Register another FieldGroup widget with this one
	 * @param field_group_widget
	 */
	_handleGroupRole: function(field_group_widget) {

		this._groups.push(field_group_widget);

	},

	/**
	 * Register an input widget
	 * @param field_widget
	 */
	_handleFieldRole: function(field_widget) {

		if (field_widget.name == 'submit') {

			this._submit_fields.push(field_widget);
			field_widget.on('clicked', this._onSubmit, this);
			field_widget.on('destroy', this._onFieldDestroyed, this, this._submit_fields);

		} else {

			this._fields.push(field_widget);
			field_widget.on('destroy', this._onFieldDestroyed, this, this._fields);

		}

		Lava.view_manager.cancelBubble();

	},

	/**
	 * Submit input was clicked
	 */
	_onSubmit: function() {



	},

	/**
	 * Get `_fields`
	 * @returns {Array.<Lava.widget.input.InputAbstract>}
	 */
	getFields: function() {

		return this._fields.slice();

	},

	/**
	 * Get `_submit_fields`
	 * @returns {Array.<Lava.widget.input.InputAbstract>}
	 */
	getSubmitFields: function() {

		return this._submit_fields.slice();

	},

	/**
	 * Convert value of all registered inputs to query string, as in GET request
	 * @returns {string}
	 */
	toQueryString: function() {

		var i = 0,
			count = this._fields.length,
			result = [],
			value;

		for (; i < count; i++) {

			value = this._fields[i].toQueryString();
			if (value) {
				result.push(value);
			}

		}

		return result.join('&');

	},

	/**
	 * Cleanup destroyed fields from local members
	 * @param {Lava.widget.input.InputAbstract} field_widget
	 * @param event_args
	 * @param native_args Reference to local array with input widgets
	 */
	_onFieldDestroyed: function(field_widget, event_args, native_args) {

		Firestorm.Array.exclude(native_args, field_widget);

	}

});
/**
 * Panel is expanding
 * @event Lava.widget.Accordion#panel_expanding
 * @type {Object}
 * @property {Lava.widget.Standard} panel Panel, which triggered the event
 */

/**
 * Panel is collapsing
 * @event Lava.widget.Accordion#panel_collapsing
 * @type {Object}
 * @property {Lava.widget.Standard} panel Panel, which triggered the event
 */

Lava.define(
'Lava.widget.Accordion',
/**
 * Collection of expandable panels
 * @lends Lava.widget.Accordion#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',

	name: 'accordion',

	_property_descriptors: {
		is_enabled: {type: 'Boolean', setter: '_setIsEnabled'}
	},

	_properties: {
		/**
		 * Collection of "panel" <b>objects</b> (objects with properties for panel <b>widgets</b>)
		 * @type {Lava.system.Enumerable}
		 */
		_panels: null,
		/** If accordion is enabled - then it closes all other open panels when any panel is opened */
		is_enabled: true
	},

	_role_handlers: {
		panel: '_handlePanelRole'
	},

	/**
	 * Reference to the <wp>_panels</wp> property
	 * @type {Lava.system.Enumerable}
	 */
	_panels: null,
	/**
	 * Accordion's panels
	 * @type {Array.<Lava.widget.Standard>}
	 */
	_panel_widgets: [],
	/**
	 * Panels, that are currently expanded
	 * @type {Array.<Lava.widget.Standard>}
	 */
	_active_panels: [],
	/**
	 * Objects with listeners for accordion's panels
	 * @type {Object.<string, Object.<string, _tListener>>}
	 */
	_listeners_by_panel_guid: {},

	/**
	 * @param config
	 * @param {boolean} config.options.keep_new_panels_expanded If you add another expanded panel to accordion - it's collapsed by default.
	 *  You may set this option to keep it expanded - in this case all expanded panels will be collapsed as soon as any panel is expanded by user
	 * @param widget
	 * @param parent_view
	 * @param template
	 * @param properties
	 */
	init: function(config, widget, parent_view, template, properties) {

		this._panels = new Lava.system.Enumerable();
		this._properties._panels = this._panels;
		this.Standard$init(config, widget, parent_view, template, properties);

	},

	_initMembers: function(properties) {

		var data,
			i,
			count;

		this.Standard$_initMembers(properties);

		if (this._config.storage && this._config.storage.panels) {

			data = this._config.storage.panels;
			for (i = 0, count = data.length; i < count; i++) {

				this.addPanel({
					is_expanded: data[i].is_expanded || false,
					title_template: data[i].title,
					content_template: data[i].content
				});

			}

		}

	},

	/**
	 * Create a panel inside accordion
	 * @param {Object} properties Plain object with panel's data
	 * @param {boolean} properties.is_expanded Initial "expanded" state
	 * @param {_tTemplate} properties.title_template
	 * @param {_tTemplate} properties.content_template
	 * @returns {Lava.mixin.Properties} The {@link Lava.mixin.Properties} instance with panel's data
	 */
	addPanel: function(properties) {

		if (Lava.schema.DEBUG && properties.isProperties) Lava.t("Wrong argument to addPanel. Plain object expected.");

		var panel = new Lava.mixin.Properties({
			is_expanded: false,
			title_template: null,
			content_template: null
		});
		panel.setProperties(properties);
		this._panels.push(panel);
		return panel;

	},

	/**
	 * Get panel objects
	 * @returns {Array.<Lava.widget.Standard>}
	 */
	getPanelObjects: function() {

		return this._panels.getValues();

	},

	/**
	 * Get a copy of `_panel_widgets`
	 * @returns {Array}
	 */
	getPanelWidgets: function() {

		return this._panel_widgets.slice();

	},

	/**
	 * Handle a panel inside accordion instance
	 * @param {Lava.widget.Standard} view
	 */
	_handlePanelRole: function(view) {

		this.registerPanel(view);

	},

	/**
	 * Add panel widget instance to Accordion. Panel does not need to be inside accordion
	 * @param {Lava.widget.Standard} panel_widget
	 */
	registerPanel: function(panel_widget) {

		var collapse_on_add = !this._config.options || !this._config.options['keep_new_panels_expanded'];

		if (panel_widget.get('is_expanded')) {

			if (this._active_panels.length && collapse_on_add && this._properties.is_enabled) {

				panel_widget.set('is_expanded', false);

			} else {

				this._active_panels.push(panel_widget);

			}

		}

		this._panel_widgets.push(panel_widget);

		this._listeners_by_panel_guid[panel_widget.guid] = {
			// note: if panel is outside of the widget, this listener may never fire
			destroy: panel_widget.on('destroy', this._onPanelDestroy, this, null, true),
			expanding: panel_widget.on('expanding', this._onPanelExpanding, this),
			collapsing: panel_widget.on('collapsing', this._onPanelCollapsing, this)
		};

	},

	/**
	 * Remove all references to panel widget from local members
	 * @param {Lava.widget.Standard} panel_widget
	 */
	_removePanel: function(panel_widget) {

		Firestorm.Array.exclude(this._panel_widgets, panel_widget);
		Firestorm.Array.exclude(this._active_panels, panel_widget);
		delete this._listeners_by_panel_guid[panel_widget.guid];

	},

	/**
	 * Stop controlling this panel widget
	 * @param {Lava.widget.Standard} panel_widget
	 */
	unregisterPanel: function(panel_widget) {

		var listeners = this._listeners_by_panel_guid[panel_widget.guid];
		if (listeners) {
			panel_widget.removeListener(listeners.destroy);
			panel_widget.removeListener(listeners.expanding);
			panel_widget.removeListener(listeners.collapsing);
			this._removePanel(panel_widget);
		}

	},

	/**
	 * Panel is expanding. Close all other panels
	 * @param {Lava.widget.Standard} panel
	 */
	_onPanelExpanding: function(panel) {

		var turnoff_panels,
			i = 0,
			count;

		if (this._properties.is_enabled) {

			turnoff_panels = this._active_panels.slice();
			for (i = 0, count = turnoff_panels.length; i < count; i++) {

				turnoff_panels[i].set('is_expanded', false);

			}

			this._active_panels = [panel];

		} else {

			this._active_panels.push(panel);

		}

		this._fire('panel_expanding', {
			panel: panel
		});

	},

	/**
	 * Handler of panel's "collapsing" event
	 * @param {Lava.widget.Standard} panel
	 */
	_onPanelCollapsing: function(panel) {

		Firestorm.Array.exclude(this._active_panels, panel);
		this._fire('panel_collapsing', {
			panel: panel
		});

	},

	/**
	 * Turn accordion functionality on and off. When accordion is off - it will not control state of it's panels
	 * (when a panel is expanded - other panels are not closed)
	 * @param {boolean} value
	 * @param {string} name
	 */
	_setIsEnabled: function(value, name) {

		var turnoff_panels = [],
			i = 0,
			last_index;

		if (value) {

			if (this._active_panels.length > 1) {

				last_index = this._active_panels.length - 1;
				// slice is needed for the listeners
				turnoff_panels = this._active_panels.slice(0, last_index);
				for (; i < last_index; i++) {
					turnoff_panels[i].set('is_expanded', false);
				}
				// keep expanded only the last opened panel
				this._active_panels = [this._active_panels[last_index]];

			}

		}

		this._set(name, value);

	},

	/**
	 * Remove references to destroyed panel
	 * @param panel
	 */
	_onPanelDestroy: function(panel) {

		this._removePanel(panel);

	},

	/**
	 * Remove all panels, added by `addPanel`
	 */
	removeNativePanels: function() {

		this._panels.removeAll();

	},

	/**
	 * Stop controlling all panels and remove panels which were added by `addPanel`
	 */
	removeAllPanels: function() {

		var panel_widgets = this._panel_widgets.slice(); // cause array will be modified during unregisterPanel()

		for (var i = 0, count = panel_widgets.length; i < count; i++) {

			this.unregisterPanel(panel_widgets[i]);

		}

		this._panels.removeAll();

	},

	/**
	 * Remove a panel, added by `addPanel`
	 * @param {Lava.mixin.Properties} panel The panel object, returned by `addPanel`
	 */
	removePanel: function(panel) {

		this._panels.removeValue(panel); // everything else will be done by destroy listener

	},

	/**
	 * Collapse all panels in Accordion
	 */
	collapseAll: function() {

		var panels = this._active_panels.slice();

		for (var i = 0, count = panels.length; i < count; i++) {

			panels[i].set('is_expanded', false);

		}

	},

	destroy: function() {

		this.removeAllPanels();

		this._panels.destroy();
		this._panels = this._properties._panels = null;

		this.Standard$destroy();

	}

});

Lava.define(
'Lava.widget.Tabs',
/**
 * Tabs widget
 * @lends Lava.widget.Tabs#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',

	name: 'tabs',

	_properties: {
		/**
		 * Collection of objects with tab data
		 * @type {Lava.system.Enumerable}
		 */
		_tabs: null,
		/**
		 * Active tab object
		 * @type {Lava.mixin.Properties}
		 */
		active_tab: null
	},

	_property_descriptors: {
		active_tab: {setter: '_setActiveTab'}
	},

	_event_handlers: {
		header_click: '_onTabHeaderClicked'
	},

	/**
	 * Reference to <wp>_tabs</wp> property
	 * @type {Lava.system.Enumerable}
	 */
	_tab_objects: null,

	init: function(config, widget, parent_view, template, properties) {

		this._tab_objects = new Lava.system.Enumerable();
		this._properties._tabs = this._tab_objects;

		this.Standard$init(config, widget, parent_view, template, properties);

	},

	_initMembers: function(properties) {

		var sugar_tabs,
			i,
			count,
			tab;

		this.Standard$_initMembers(properties);

		if (this._config.storage && this._config.storage.tabs) {

			sugar_tabs = this._config.storage.tabs;
			i = 0;
			count = sugar_tabs.length;

			for (; i < count; i++) {

				tab = sugar_tabs[i];
				this.addTab({
					name: tab.name || '',
					is_enabled: ("is_enabled" in tab) ? tab.is_enabled : true,
					is_hidden: ("is_hidden" in tab) ? tab.is_hidden : false,
					is_active: ("is_active" in tab) ? tab.is_active : false,
					title_template: tab.title,
					content_template: tab.content
				});

			}

		}

	},

	/**
	 * Tab header was clicked. Switch active tab
	 * @param dom_event_name
	 * @param event_object
	 * @param view
	 * @param template_arguments
	 */
	_onTabHeaderClicked: function(dom_event_name, event_object, view, template_arguments) {

		var tab = template_arguments[0]; // tab object
		if (tab.get('is_enabled')) {
			this._setActiveTab(tab);
		}
		// to remove dotted outline in FF. This can be done with CSS, but CSS will disable it completely
		view.getContainer().getDOMElement().blur();
		event_object.preventDefault();

	},

	/**
	 * Create a new tab
	 * @param {Object} properties The properties of the new tab
	 * @param {string} properties.name
	 * @param {boolean} properties.is_enabled
	 * @param {boolean} properties.is_hidden
	 * @param {_tTemplate} properties.title_template
	 * @param {_tTemplate} properties.content_template
	 * @returns {Lava.mixin.Properties} Created object with tab data
	 */
	addTab: function(properties) {

		if (Lava.schema.DEBUG && properties.isProperties) Lava.t("Wrong argument to addTab. Plain object expected.");

		var tab = new Lava.mixin.Properties({
			guid: Lava.guid++,
			name: '',
			is_enabled: true,
			is_hidden: false,
			is_active: false,
			title_template: null,
			content_template: null
		});
		tab.setProperties(properties);

		if (Lava.schema.DEBUG && tab.get('is_active') && (!tab.get('is_enabled') || tab.get('is_hidden'))) Lava.t('Tabs: added tab cannot be active and disabled/hidden at the same time');

		if (this._properties.active_tab == null && tab.get('is_enabled') && !tab.get('is_hidden')) {

			this._setActiveTab(tab);

		}

		if (tab.get('is_active') && this._properties.active_tab != tab) {
			if (this._properties.active_tab) {
				this._properties.active_tab.set('is_active', false);
			}
			this._set('active_tab', tab);
		}

		this._tab_objects.push(tab);

		tab.onPropertyChanged('is_enabled', this._onTabStateChanged, this);
		tab.onPropertyChanged('is_hidden', this._onTabStateChanged, this);
		tab.onPropertyChanged('is_active', this._onTabIsActiveChanged, this);

		return tab;

	},

	/**
	 * "is_active" property of tab object has changed. Update active tab
	 * @param {Lava.mixin.Properties} tab
	 */
	_onTabIsActiveChanged: function(tab) {

		if (tab.get('is_active')) {

			this._setActiveTab(tab);

		} else if (this._properties.active_tab == tab) {

			this._setActiveTab(null);

		}

	},

	/**
	 * Change currently active tab
	 * @param {Lava.mixin.Properties} new_tab
	 */
	_setActiveTab: function(new_tab) {

		var old_active_tab = this._properties.active_tab;

		if (old_active_tab != new_tab) {

			this._set('active_tab', new_tab);
			if (new_tab) new_tab.set('is_active', true);
			if (old_active_tab) old_active_tab.set('is_active', false);

		}

	},

	/**
	 * If currently active tab was disabled or hidden - choose new active tab
	 * @param {Lava.mixin.Properties} tab
	 */
	_onTabStateChanged: function(tab) {

		if (tab.get('is_active') && (!tab.get('is_enabled') || tab.get('is_hidden'))) {

			this._fixActiveTab();

		}

	},

	/**
	 * Get all objects with tab data
	 * @returns {Array.<Lava.mixin.Properties>}
	 */
	getTabObjects: function() {

		return this._tab_objects.getValues();

	},

	/**
	 * Remove a tab object, returned by `addTab`
	 * @param {Lava.mixin.Properties} tab_object
	 */
	removeTab: function(tab_object) {

		this._tab_objects.removeValue(tab_object);

		if (this._properties.active_tab == tab_object) {

			this._fixActiveTab();

		}

	},

	/**
	 * Find first tab, that can be active and assign it as the current active tab
	 */
	_fixActiveTab: function() {

		var active_tab = null;

		this._tab_objects.each(function(tab) {
			var result = null;
			if (tab.get('is_enabled') && !tab.get('is_hidden')) {
				active_tab = tab;
				result = false;
			}
			return result;
		});

		this._setActiveTab(active_tab);

	},

	/**
	 * Remove all tabs
	 */
	removeAllTabs: function() {

		var tabs = this._tab_objects.getValues(),
			i = 0,
			count = tabs.length;

		for (; i < count; i++) {
			this.removeTab(tabs[i]);
		}

		this._setActiveTab(null);

	},

	/**
	 * Reorder tabs
	 * @param {Array.<number>} indices
	 */
	reorderTabs: function(indices) {

		this._tab_objects.reorder(indices);

	},

	/**
	 * Sort tabs
	 * @param {_tLessCallback} callback
	 */
	sortTabs: function(callback) {

		this._tab_objects.sort(callback);

	},

	destroy: function() {

		this.removeAllTabs();
		this._tab_objects.destroy();
		this._tab_objects = this._properties._tab_objects = null;

		this.Standard$destroy();

	}

});
/**
 * Panel started to expand
 * @event Lava.widget.Collapsible#expanding
 */

/**
 * Panel started to collapse
 * @event Lava.widget.Collapsible#collapsing
 */

/**
 * Panel has fully expanded
 * @event Lava.widget.Collapsible#expanded
 */

/**
 * Panel is collapsed
 * @event Lava.widget.Collapsible#collapsed
 */

Lava.define(
'Lava.widget.Collapsible',
/**
 * Animated HTML element, which can be shown and hidden
 * @lends Lava.widget.Collapsible#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',

	name: 'collapsible',

	_property_descriptors: {
		is_expanded: {type: 'Boolean', setter: '_setExpanded'},
		is_animation_enabled: {type: 'Boolean'}
	},

	_properties: {
		/** Is the element expanded */
		is_expanded: true,
		/** Use animation, while expanding and collapsing the element */
		is_animation_enabled: true,
		/** Content for default widget's template */
		content: ''
	},

	_role_handlers: {
		_container_view: '_handleContainerView'
	},

	/**
	 * Main container of the expandable DOM element
	 * @type {Lava.view.container.Element}
	 */
	_panel_container: null,
	/**
	 * DOM element's animation
	 * @type {Lava.animation.Abstract}
	 */
	_animation: null,
	/**
	 * The "display" CSS rule from container's element
	 * @type {string}
	 */
	_default_display: '',

	/**
	 * When animation is disabled, Toggle animation is used to show and hide the DOM element
	 * @type {string}
	 * @const
	 */
	TOGGLE_ANIMATION_CLASS: 'Toggle',

	/**
	 * Create animation, set it's direction and run it
	 * @param {boolean} is_forwards Is widget's element expanding
	 */
	_refreshAnimation: function(is_forwards) {

		var element = this._panel_container.getDOMElement(),
			animation_options;

		if (!this._animation) {

			animation_options = this._properties.is_animation_enabled ? this._config.options.animation : {"class": this.TOGGLE_ANIMATION_CLASS};
			this._animation = new Lava.animation[animation_options['class']](animation_options, element);
			this._animation.on('complete', this._onAnimationComplete, this);

		}

		// content may be re-rendered and the old element reference may become obsolete
		this._animation.setTarget(element);

		if (is_forwards) {

			this._animation.resetDirection();

		} else {

			this._animation.reverseDirection();

		}

		this._animation.safeStart();

	},

	/**
	 * Fire widget's events and fix element's "display" CSS rule
	 */
	_onAnimationComplete: function() {

		if (this._animation.isReversed()) {

			this._fire('collapsed');
			this._panel_container.setStyle('display', 'none');

		} else {

			this._fire('expanded');

		}

	},

	/**
	 * Setter for <wp>is_expanded</wp> property
	 * @param {boolean} value
	 * @param {string} name
	 */
	_setExpanded: function(value, name) {

		var new_display = 'none';

		this._set(name, value);

		if ((this._is_inDOM && this._properties.is_animation_enabled) || value) {

			new_display = this._default_display; // allow display:none only in case the panel must be collapsed and animation is disabled

		}

		// if this property is set in constructor - then container does not yet exist
		if (this._panel_container) {

			this._panel_container.setStyle('display', new_display);

		}

		if (this._is_inDOM) {

			this._fire(value ? 'expanding' : 'collapsing');

			if (this._properties.is_animation_enabled && this._panel_container) {

				this._refreshAnimation(value);

			} else {

				this._fire(value ? 'expanded' : 'collapsed');

			}

		}

	},

	/**
	 * Handle view with main container
	 * @param {Lava.view.Abstract} view
	 */
	_handleContainerView: function(view) {

		this._panel_container = view.getContainer();

		this._default_display = this._panel_container.getStyle('display') || '';

		if (!this._properties.is_expanded) {

			this._panel_container.setStyle('display', 'none');

		}

	},

	/**
	 * Get `_panel_container`
	 * @returns {Lava.view.container.Element}
	 */
	getMainContainer: function() {

		return this._panel_container;

	}

});

Lava.define(
'Lava.widget.CollapsiblePanel',
/**
 * An expandable panel with header and body
 * @lends Lava.widget.CollapsiblePanel#
 * @extends Lava.widget.Collapsible#
 */
{

	Extends: 'Lava.widget.Collapsible',

	name: 'collapsible_panel',

	_property_descriptors: {
		is_locked: {type: 'Boolean'}
	},

	_properties: {
		/** When panel is locked - it does not respond to header clicks */
		is_locked: false,
		/** Panel's title */
		title: ''
	},

	_event_handlers: {
		header_click: '_onHeaderClick'
	},

	/**
	 * Toggle <wp>is_expanded</wp> property, when not locked
	 */
	_onHeaderClick: function() {

		if (!this._properties.is_locked) {

			this.set('is_expanded', !this._properties.is_expanded);

		}

	}

});

/**
 * Panel started to expand it's body
 * @event Lava.widget.CollapsiblePanelExt#expanding
 */

/**
 * Panel started to collapse it's body
 * @event Lava.widget.CollapsiblePanelExt#collapsing
 */

/**
 * Panel's body has fully expanded
 * @event Lava.widget.CollapsiblePanelExt#expanded
 */

/**
 * Panel's body is collapsed
 * @event Lava.widget.CollapsiblePanelExt#collapsed
 */

Lava.define(
'Lava.widget.CollapsiblePanelExt',
/**
 * An expandable panel that removes it's content from DOM in collapsed state
 * @lends Lava.widget.CollapsiblePanelExt#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',

	name: 'collapsible_panel',

	_property_descriptors: {
		is_expanded: {type: 'Boolean'},
		is_locked: {type: 'Boolean'},
		is_animation_enabled: {type: 'Boolean', setter: '_setAnimationEnabled'}
	},

	_properties: {
		/** Is panel expanded */
		is_expanded: true,
		/** When panel is locked - it does not respond to header clicks */
		is_locked: false,
		/** Does panel use animation to expand and collapse it's body */
		is_animation_enabled: true,
		/** Panel's title */
		title: '',
		/** Content for the default panel's template */
		content: ''
	},

	_event_handlers: {
		header_click: '_onHeaderClick'
	},

	_role_handlers: {
		_content_if: '_handleContentIf'
	},

	/**
	 * Refresher of the panel's body
	 * @type {Lava.view.refresher.Standard}
	 */
	_content_refresher: null,

	/**
	 * Handle view with the panel's body
	 * @param {Lava.view.Abstract} view
	 */
	_handleContentIf: function(view) {

		var refresher = view.getRefresher();

		refresher.on('insertion_complete', this._onInsertionComplete, this);
		refresher.on('removal_complete', this._onRemovalComplete, this);

		if (!this._properties.is_animation_enabled) {
			refresher.disableAnimation();
		}

		this._content_refresher = refresher;

	},

	/**
	 * Refresher has expanded the body, fire "expanded" event
	 */
	_onInsertionComplete: function() {

		this._fire('expanded');

	},

	/**
	 * Refresher has collapsed and removed the body, fire "collapsed" event
	 */
	_onRemovalComplete: function() {

		this._fire('collapsed');

	},

	/**
	 * Toggle <wp>is_expanded</wp> property, if not locked
	 */
	_onHeaderClick: function() {

		if (!this._properties.is_locked) {

			this.set('is_expanded', !this._properties.is_expanded);

			// previous line has switched it's value, so events are also swapped
			this._fire(this._properties.is_expanded ? 'expanding' : 'collapsing');

		}

	},

	/**
	 * Setter for `is_animation_enabled`
	 * @param {boolean} value
	 * @param {string} name
	 */
	_setAnimationEnabled: function(value, name) {

		this._set(name, value);

		// it may be set via assign or right after creation. At this time refresher does not exist yet.
		if (this._content_refresher) {

			if (value) {

				this._content_refresher.enableAnimation();

			} else {

				this._content_refresher.disableAnimation();

			}

		}

	}

});

Lava.define(
'Lava.widget.DropDown',
/**
 * Widget with content, that is shown on click
 * @lends Lava.widget.DropDown#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',

	name: 'dropdown',

	_property_descriptors: {
		is_open: {type: 'Boolean', setter: '_setIsOpen'}
	},

	_properties: {
		/** Is the widget expanded */
		is_open: false
	},

	_event_handlers: {
		trigger_click: '_onTriggerClick'
	},

	_role_handlers: {
		trigger: '_registerTrigger', // the link which toggles the dropdown
		target: '_registerTarget' // the target to which the class 'open' is applied
	},

	/**
	 * A view that responds to the "click" event
	 * @type {Lava.view.Abstract}
	 */
	_trigger: null,
	/**
	 * A view, that is displayed when `_trigger` is clicked
	 * @type {Lava.view.Abstract}
	 */
	_target: null,

	/**
	 * Listener for global "click" anywhere on page
	 * @type {_tListener}
	 */
	_click_listener: null,

	/**
	 * @param config
	 * @param {string} config.options.target_class Class name to add to `_target` when `_trigger` is clicked
	 * @param widget
	 * @param parent_view
	 * @param template
	 * @param properties
	 */
	init: function(config, widget, parent_view, template, properties) {

		this.Standard$init(config, widget, parent_view, template, properties);
		Lava.app.on('close_popups', this._onClosePopups, this);

	},

	/**
	 * Handler for global {@link Lava.system.App} event "close_popups"
	 */
	_onClosePopups: function() {

		this.set('is_open', false);

	},

	/**
	 * Change <wp>is_open</wp> state (open dropdown which is closed and vice versa)
	 * @param dom_event_name
	 * @param event_object
	 */
	_onTriggerClick: function(dom_event_name, event_object) {

		if (this._properties.is_open) {

			this.set('is_open', false);

		} else {

			Lava.app.fireGlobalEvent('close_popups');
			if (!this._click_listener) {
				this._click_listener = Lava.Core.addGlobalHandler('click', this._onGlobalClick, this);
			}

			this.set('is_open', true);

		}

		event_object.preventDefault();

	},

	/**
	 * Click anywhere on page
	 */
	_onGlobalClick: function() {

		Lava.Core.removeGlobalHandler(this._click_listener);
		this._click_listener = null;
		this.set('is_open', false);

	},

	/**
	 * Get container of the element, which is shown, when widget is expanded
	 * @returns {_iContainer}
	 */
	_getTargetContainer: function() {

		return this._target && this._target.getContainer() || this._container;

	},

	/**
	 * Register `_trigger` view
	 * @param {Lava.view.Abstract} view
	 */
	_registerTrigger: function(view) {

		this._trigger = view;
		view.getContainer().addEventTarget('click', {locator_type: "Guid", locator: this.guid, name: "trigger_click"});

	},

	/**
	 * Register `_target` view
	 * @param {Lava.view.Abstract} view
	 */
	_registerTarget: function(view) {

		this._target = view;

	},

	/**
	 * Setter for <wp>is_open</wp> property
	 * @param {boolean} value
	 * @param {string} name
	 */
	_setIsOpen: function(value, name) {

		var open_target_container = this._getTargetContainer();
		if (Lava.schema.DEBUG && !open_target_container) Lava.t("DropDown was created without container and target");

		this._set(name, value);

		if (value) {

			open_target_container.addClass(this._config.options.target_class);

		} else {

			open_target_container.removeClass(this._config.options.target_class);

		}

	},

	destroy: function() {

		if (this._click_listener) {
			Lava.Core.removeGlobalHandler(this._click_listener);
			this._click_listener = null;
		}

		this._trigger = this._target = null;

		this.Standard$destroy();

	}

});

Lava.define(
'Lava.widget.Tree',
/**
 * Tree with expandable nodes
 * @lends Lava.widget.Tree#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',
	Shared: ['_meta_storage_config', '_default_if_refresher_config', '_foreach_refresher_config',
		'_direct_bind_configs', '_meta_storage_bind_configs'],

	name: 'tree',

	/**
	 * Dynamic scope configs which use direct bindings to record properties
	 */
	_direct_bind_configs: {
		is_expanded: Lava.ExpressionParser.parseScopeEval('node.is_expanded'),
		is_expandable: Lava.ExpressionParser.parseScopeEval('node.children.length')
	},

	/**
	 * Dynamic scope configs for columns from MetaStorage
	 * @type {Object}
	 */
	_meta_storage_bind_configs: {
		is_expanded: Lava.ExpressionParser.parseScopeEval('$tree.meta_storage[node.guid].is_expanded'),
		// can be used by inherited classes
		is_expandable: Lava.ExpressionParser.parseScopeEval('$tree.meta_storage[node.guid].is_expandable')
	},

	/**
	 * MetaStorage is used by Tree to store the `expanded` state
	 * @type {Object}
	 */
	_meta_storage_config: {
		fields: {
			is_expanded: {type:'Boolean'}
			// is_expandable: {type:'Boolean'}
		}
	},

	/**
	 * Default refresher for the If view with node children (without animation)
	 * @type {_cRefresher}
	 */
	_default_if_refresher_config: {
		type: 'Standard'
	},

	/**
	 * Config of refresher, that expands children
	 * @type {_cRefresher}
	 */
	_if_refresher_config: null,

	/**
	 * Refresher, that inserts and removes new child nodes in the `record.children` collection.
	 * @type {_cRefresher}
	 */
	_foreach_refresher_config: {
		type: 'Standard',
		get_end_element_callback: function(template) {

			// Last view is the If with node children.
			// "_foreach_view" property was set in "node_children" role.
			var children_foreach = template.getLastView().get('_foreach_view'),
				node_children_element = children_foreach ? children_foreach.getContainer().getDOMElement() : null;

			return node_children_element || template.getFirstView().getContainer().getDOMElement();

		}
	},

	_property_descriptors: {
		records: {setter: '_setRecords'},
		meta_storage: {is_readonly: true}
	},

	_properties: {
		/** User-assigned records in the root of the tree */
		records: null,
		meta_storage: null
	},

	_event_handlers: {
		node_click: '_onNodeClick'
	},

	_role_handlers: {
		node_children_view: '_handleNodeChildrenView',
		root_nodes_foreach: '_handleRootNodesForeach',
		nodes_foreach: '_handleNodesForeach'
	},

	/**
	 * MetaStorage instance for storage of "is_expanded" state of tree records
	 * @type {Lava.data.MetaStorage}
	 */
	_meta_storage: null,

	/**
	 * Columns, which are served from MetaStorage instead of record instance
	 * @type {Object.<string,true>}
	 */
	_meta_storage_columns: {},

	/**
	 * Dynamic scopes configuration
	 * @type {Object.<string,_cScopeLocator>}
	 */
	_column_bind_configs: {},

	/**
	 * May be overridden in inherited classes to force creation of MetaStorage in constructor
	 * @type {boolean}
	 */
	CREATE_META_STORAGE: false,

	/**
	 * @param config
	 * @param {Array.<string>} config.options.meta_storage_columns This setting allows you to define columns,
	 *  which will be stored in separate MetaStorage instance instead of record properties.
	 *  Commonly, you will want to store "is_expanded" property in MetaStorage.
	 * @param {Object} config.options.refresher You can assign custom refresher config for nodes (with animation support, etc).
	 * 	Use {type: 'Collapse'} to apply basic animation
	 * @param widget
	 * @param parent_view
	 * @param template
	 * @param properties
	 */
	init: function(config, widget, parent_view, template, properties) {

		var i = 0,
			count,
			columns_list,
			name;

		if (config.options && config.options.meta_storage_columns) {
			columns_list = config.options.meta_storage_columns;
			count = columns_list.length;
			for (; i < count; i++) {
				this._meta_storage_columns[columns_list[i]] = true;
			}
		}

		for (name in this._direct_bind_configs) {

			this._column_bind_configs[name] = (name in this._meta_storage_columns)
				? this._meta_storage_bind_configs[name]
				: this._direct_bind_configs[name];

		}

		if (this.CREATE_META_STORAGE || !Firestorm.Object.isEmpty(this._meta_storage_columns)) {
			this._meta_storage = new Lava.data.MetaStorage(this._meta_storage_config);
			this._properties.meta_storage = this._meta_storage;
		}

		this.Standard$init(config, widget, parent_view, template, properties);

		this._if_refresher_config = (config.options && config.options.refresher)
			? config.options.refresher
			: this._default_if_refresher_config

	},

	/**
	 * Setter for `records` property
	 * @param {?Array.<Object>} value
	 * @param {string} name
	 */
	_setRecords: function(value, name) {

		if (this._meta_storage) {
			this._meta_storage.destroy();
			this._meta_storage = new Lava.data.MetaStorage(this._meta_storage_config);
			this._set('meta_storage', this._meta_storage);
		}

		this._set(name, value);

	},

	/**
	 * Get or create an instance of MetaRecord, which is attached to record from data
	 * @param {Object} record
	 * @returns {Lava.data.MetaRecord}
	 */
	_getMetaRecord: function(record) {

		return this._meta_storage.get(record.get('guid')) || this._meta_storage.createMetaRecord(record.get('guid'));

	},

	/**
	 * Create refresher for the If view with node children
	 * @param {Lava.view.If} view
	 */
	_handleNodeChildrenView: function(view) {

		view.createRefresher(this._if_refresher_config);

	},

	/**
	 * Create refresher for the root Foreach view
	 * @param {Lava.view.Foreach} view
	 */
	_handleRootNodesForeach: function(view) {

		view.createRefresher(this._foreach_refresher_config);

	},

	/**
	 * Initialize Foreach views with node children
	 * @param {Lava.view.Foreach} view
	 */
	_handleNodesForeach: function(view) {

		view.createRefresher(this._foreach_refresher_config);
		view.getParentView().set('_foreach_view', view);

	},

	/**
	 * Expand or collapse the node
	 * @param dom_event_name
	 * @param event_object
	 * @param view
	 * @param template_arguments
	 */
	_onNodeClick: function(dom_event_name, event_object, view, template_arguments) {

		// template_arguments[0] - node record
		if (Lava.schema.DEBUG) {
			if (!template_arguments[0].isProperties) {
				Lava.t("Tree: record is not instance of Properties");
			}
			if ('is_expanded' in this._meta_storage_columns) {
				if (!template_arguments[0].get('guid')) Lava.t("Tree: record without GUID");
			}
		}
		var property_source = ('is_expanded' in this._meta_storage_columns) ? this._getMetaRecord(template_arguments[0]) : template_arguments[0];
		property_source.set('is_expanded', !property_source.get('is_expanded'));
		event_object.preventDefault(); // to prevent text selection

	},

	/**
	 * Switch expandable tree records to new state
	 * @param node
	 * @param {boolean} expanded_state
	 */
	_toggleTree: function(node, expanded_state) {

		var children = node.get('children'),
			child,
			i = 0,
			count = children.getCount(),
			property_source;

		if (count) {

			for (; i < count; i++) {
				child = children.getValueAt(i);
				if (child.get('children').getCount()) {
					this._toggleTree(child, expanded_state);
				}
			}

			property_source = ('is_expanded' in this._meta_storage_columns) ? this._getMetaRecord(node) : node;
			property_source.set('is_expanded', expanded_state);

		}

	},

	/**
	 * Switch expandable root records to new state
	 * @param {boolean} expanded_state
	 */
	_toggleRecords: function(expanded_state) {

		var records = this._properties.records,
			i = 0,
			count,
			record;

		if (records) {
			count = records.getCount(); // Enumerable
			for (; i < count; i++) {
				record = records.getValueAt(i);
				this._toggleTree(record, expanded_state);
			}
		}

	},

	/**
	 * Expand all records in the tree
	 */
	expandAll: function() {

		this._toggleRecords(true);

	},

	/**
	 * Collapse all records in the tree
	 */
	collapseAll: function() {

		this._toggleRecords(false);

	},

	/**
	 * Locate record field references for templates (like "is_expanded" property)
	 * @param {Lava.view.Abstract} view
	 * @param {_cDynamicScope} config
	 */
	getDynamicScope: function(view, config) {

		if (!(config.property_name in this._column_bind_configs)) Lava.t('unknown dynamic scope: ' + config.property_name);
		return view.getScopeByPathConfig(this._column_bind_configs[config.property_name]);

	},

	destroy: function() {

		if (this._meta_storage) {
			this._meta_storage.destroy();
			this._meta_storage = null;
		}

		this.Standard$destroy();

	}

});
Lava.define(
'Lava.widget.Table',
/**
 * Sortable table
 * @lends Lava.widget.Table#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',
	name: 'table',

	_properties: {
		/**
		 * User-assigned records collection for this table
		 * @type {Lava.system.Enumerable}
		 */
		records: null,
		/** Columns from table's options */
		_columns: null,
		/**
		 * The column, by which the records are sorted
		 * @type {string}
		 */
		_sort_column_name: null,
		/**
		 * Sort order
		 * @type {boolean}
		 */
		_sort_descending: false
	},

	_event_handlers: {
		column_header_click: '_onColumnHeaderClick'
	},

	_include_handlers: {
		cell: '_getCellInclude'
	},

	/**
	 * @param config
	 * @param {Array.<{name, title}>} config.options.columns Column descriptors. "title" is displayed in table head,
	 *  while "name" is name of the property in records
	 * @param widget
	 * @param parent_view
	 * @param template
	 * @param properties
	 */
	init: function(config, widget, parent_view, template, properties) {

		if (Lava.schema.DEBUG && (!config.options || !config.options.columns)) Lava.t("Table: config.options.columns is required");
		this._properties._columns = config.options.columns;
		this.Standard$init(config, widget, parent_view, template, properties);

	},

	/**
	 * Column header has been clicked. Apply sorting
	 * @param dom_event_name
	 * @param event_object
	 * @param view
	 * @param template_arguments
	 */
	_onColumnHeaderClick: function(dom_event_name, event_object, view, template_arguments) {

		var column_name = template_arguments[0].name,
			less;

		if (this._properties._sort_column_name != column_name) {

			this.set('_sort_column_name', column_name);
			this.set('_sort_descending', false);

		} else {

			this.set('_sort_descending', !this._properties._sort_descending);

		}

		less = this._properties._sort_descending
			? function(record_a, record_b) { return record_a.get(column_name) > record_b.get(column_name); }
			: function(record_a, record_b) { return record_a.get(column_name) < record_b.get(column_name); };

		if (this._properties.records) {
			this._properties.records.sort(less);
		}

	},

	/**
	 * Get include that renders content of a cell
	 * @param template_arguments
	 * @returns {_tTemplate}
	 */
	_getCellInclude: function(template_arguments) {

		// var column = template_arguments[0]; - column descriptor from options
		return this._config.storage.cells[template_arguments[0].type];

	}

});

Lava.define(
'Lava.widget.CalendarAbstract',
/**
 * Base class for calendar widgets
 * @lends Lava.widget.CalendarAbstract#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',
	name: 'calendar',

	_properties: {
		/** Currently selected year */
		_current_year: 0,
		/** Currently selected month */
		_current_month: 0,
		/** Currently selected day */
		_current_day: 0
	},

	/**
	 * Get data, which is used to build the month selection view
	 * @param {string} locale_name
	 * @returns {Array}
	 */
	_getMonthDescriptors: function(locale_name) {

		var i,
			result = [],
			month_names = Lava.locales[locale_name].short_month_names;

		for (i = 0; i < 12; i++) {

			result[i] = new Lava.mixin.Properties({
				index: i,
				title: month_names[i]
			});

		}

		return result;

	},

	/**
	 * Split array of month descriptors into rows
	 * @param {Array} descriptors
	 * @returns {Array}
	 */
	_getMonthDescriptorRows: function(descriptors) {

		var result = [];
		result.push(descriptors.slice(0, 4));
		result.push(descriptors.slice(4, 8));
		result.push(descriptors.slice(8, 12));
		return result;

	},

	/**
	 * Get descriptors for rendering the day names, with respect to cultural offset
	 * @param {string} locale
	 * @returns {Array}
	 */
	_getWeekDays: function(locale) {

		var culture_offset = Lava.locales[locale].first_day_offset,
			result = [],
			daynames = Lava.locales[locale].short_day_names,
			i,
			descriptor;

		for (i = 0; i < 7; i++) {
			descriptor = new Lava.mixin.Properties({
				index: i,
				title: daynames[culture_offset]
			});
			result.push(descriptor);
			culture_offset = (culture_offset + 1) % 7;
		}

		return result;

	},

	/**
	 * Get data, which is needed to display a month in template
	 * @param {number} year
	 * @param {number} month
	 * @param {string} locale_name
	 * @returns {{year: number, index: number, weeks: Array}}
	 */
	_renderMonthData: function(year, month, locale_name) {

		var culture_offset = Lava.locales[locale_name].first_day_offset,
			first_day_in_sequence = new Date(Date.UTC(year, month)),
			first_day_of_week = (first_day_in_sequence.getDay() - culture_offset + 7) % 7;

		if (first_day_of_week) { // the first day of month does not start at beginning of the row

			// Date object will correct the wrong arguments
			first_day_in_sequence = new Date(Date.UTC(year, month, 1 - first_day_of_week));

		}

		return {
			year: year,
			index: month,
			weeks: this._renderMonthWeeksData(first_day_in_sequence)
		}

	},

	/**
	 * Render 6 rows of 7 days
	 * @param {Date} start_date Date of the first day in the first row (day of week always starts from zero)
	 */
	_renderMonthWeeksData: function(start_date) {

		var year = start_date.getUTCFullYear(),
			month = start_date.getUTCMonth(),
			day = start_date.getUTCDate(),
			milliseconds = start_date.getTime(),
			day_of_week = 0, // 0 - 6
			days_in_month = Firestorm.Date.getDaysInMonth(year, month),
			i = 0,
			result = [],
			week = [];

		week.push(this._renderDayData(year, month, day, day_of_week, milliseconds));

		do {

			if (day == days_in_month) {
				day = 1;
				month++;
				if (month == 12) {
					month = 0;
					year++;
				}
				days_in_month = Firestorm.Date.getDaysInMonth(year, month);
			} else {
				day++;
			}
			day_of_week = (day_of_week + 1) % 7;
			i++;
			milliseconds += 86400000; // 24 hours

			if (day_of_week == 0) {
				result.push(week);
				week = [];
			}

			week.push(this._renderDayData(year, month, day, day_of_week, milliseconds));

		} while (i < 42); // 7*6

		return result;

	},

	/**
	 * Create a structure, which is used to display a day number in calendar template
	 * @param {number} year
	 * @param {number} month
	 * @param {number} day Day index in month, 0..30
	 * @param {number} day_of_week Weekday index, 0..6
	 * @param milliseconds Absolute time of the day
	 * @returns {{year: number, month: number, day: number, day_of_week: number, milliseconds: number, is_today: boolean}}
	 */
	_renderDayData: function(year, month, day, day_of_week, milliseconds) {
		return {
			year: year,
			month: month,
			day: day,
			day_of_week: day_of_week,
			milliseconds: milliseconds,
			is_today: this._properties._current_day == day
				&& this._properties._current_month == month
				&& this._properties._current_year == year
		};
	}

});

Lava.define(
'Lava.widget.Calendar',
/**
 * Calendar widget
 * @lends Lava.widget.Calendar#
 * @extends Lava.widget.CalendarAbstract#
 */
{

	Extends: 'Lava.widget.CalendarAbstract',

	_property_descriptors: {
		value: {type: 'Date', setter: '_setValue'}
	},

	_properties: {
		/**
		 * The current Date object
		 * @type {Date}
		 */
		value: null,
		/** Currently selected view: 'days' or 'months' */
		_selected_view: 'days',
		/** Culture-dependent list of week day descriptors */
		_weekdays: null,
		/** Displayed months for template */
		_months_data: null,
		/** Example: "May 2014" - displayed above the days_table */
		_month_year_string: null,
		/** Example: "24 May 2014" - displayed on the "today" link */
		_today_string: null,
		/**
		 * Start of selection, in milliseconds
		 * @type {number}
		 */
		_selection_start: 0,
		/**
		 * End of selection, in milliseconds (by default, always equals to <wp>_selection_start</wp>)
		 * @type {number}
		 */
		_selection_end: 0,
		/**
		 * Current year, displayed by calendar
		 * @type {number}
		 */
		_displayed_year: null,
		/**
		 * Current month of the displayed year
		 * @type {number}
		 */
		_displayed_month: null,
		/** Collection of template data, used to render month names */
		_month_descriptors: null,
		/** Month descriptors, split into rows - for the "months" selection view */
		_month_descriptor_rows: null
	},

	_event_handlers: {
		today_click: '_onTodayClick', // click on the current date to select it
		previous_month_click: '_onPreviousMonthClick',
		next_month_click: '_onNextMonthClick',
		days_view_month_name_click: '_onSwitchToMonthViewClick', // while in the 'days' view - click on the month name above the days
		//close_month_view_click: '_onCloseMonthsViewClick', // on 'months' select view: close it and return to the 'days' view
		month_click: '_onMonthClick', // on 'months' view - select month
		day_click: '_onDayClick',
		previous_year_click: '_onPreviousYearClick',
		next_year_click: '_onNextYearClick'
	},

	_role_handlers: {
		_year_input: '_handleYearInput'
	},

	/**
	 * Year input widget
	 * @type {Lava.widget.input.InputAbstract}
	 */
	_year_input: null,
	/**
	 * Cache of data for months rendering
	 * @type {Object}
	 */
	_months_cache: {},

	/**
	 * @param config
	 * @param {string} config.options.invalid_input_class Name of CSS class to apply to invalid year input field
	 * @param widget
	 * @param parent_view
	 * @param template
	 * @param properties
	 */
	init: function(config, widget, parent_view, template, properties) {

		var current_date = new Date(),
			storage = this._properties,
			locale_object = Lava.locales[Lava.schema.LOCALE];

		// not using UTC values here to allow user to see the day in his own timezone
		storage._current_year = current_date.getFullYear();
		storage._current_month = current_date.getMonth();
		storage._current_day = current_date.getDate();

		storage._displayed_year = storage._current_year;
		storage._displayed_month = storage._current_month;

		storage._weekdays = this._getWeekDays(Lava.schema.LOCALE);
		storage._month_descriptors = this._getMonthDescriptors(Lava.schema.LOCALE);
		storage._month_descriptor_rows = this._getMonthDescriptorRows(storage._month_descriptors);

		this.CalendarAbstract$init(config, widget, parent_view, template, properties);

		if (this._properties.value == null) {
			this._setValue(current_date, 'value');
		}

		this.set(
			'_today_string',
			storage._current_day + ' ' + locale_object.month_names[storage._current_month] + ' ' + storage._current_year
		);

		this._refreshData();

	},

	/**
	 * Refresh data for templates
	 */
	_refreshData: function() {

		var locale_object = Lava.locales[Lava.schema.LOCALE],
			month_data = this._getMonthData(this._properties._displayed_year, this._properties._displayed_month);

		this.set('_months_data', [month_data]);

		// Formatting by hands, cause in future there may be added a possibility to set locale in options
		this.set(
			'_month_year_string',
			locale_object.month_names[this._properties._displayed_month] + ' ' + this._properties._displayed_year
		);

	},

	/**
	 * Get cached template data for month rendering
	 * @param {number} year
	 * @param {number} month
	 * @returns {Object}
	 */
	_getMonthData: function(year, month) {

		var month_key = year + '' + month;

		if (!(month_key in this._months_cache)) {
			this._months_cache[month_key] = this._renderMonthData(year, month, Lava.schema.LOCALE);
		}

		return this._months_cache[month_key];

	},

	/**
	 * Show previous month
	 * @param dom_event_name
	 * @param event_object
	 */
	_onPreviousMonthClick: function(dom_event_name, event_object) {

		var month = this._properties._displayed_month;
		if (month == 0) {
			this.set('_displayed_year', this._properties._displayed_year - 1);
			this.set('_displayed_month', 11);
		} else {
			this.set('_displayed_month', month - 1);
		}
		this._refreshData();

		event_object.preventDefault();

	},

	/**
	 * Show next month
	 * @param dom_event_name
	 * @param event_object
	 */
	_onNextMonthClick: function(dom_event_name, event_object) {

		var month = this._properties._displayed_month;
		if (month == 11) {
			this.set('_displayed_year', this._properties._displayed_year + 1);
			this.set('_displayed_month', 0);
		} else {
			this.set('_displayed_month', month + 1);
		}
		this._refreshData();

		event_object.preventDefault();

	},

	/**
	 * Select current day
	 * @param dom_event_name
	 * @param event_object
	 */
	_onTodayClick: function(dom_event_name, event_object) {

		var time = Date.UTC(this._properties._current_year, this._properties._current_month, this._properties._current_day);
		this._select(this._properties._current_year, this._properties._current_month, time);
		event_object.preventDefault();

	},

	/**
	 * Select the clicked day
	 * @param dom_event_name
	 * @param event_object
	 * @param view
	 * @param template_arguments
	 */
	_onDayClick: function(dom_event_name, event_object, view, template_arguments) {

		var day = template_arguments[0]; // the rendered "day" structure
		this._select(day.year, day.month, day.milliseconds);
		event_object.preventDefault(); // cancel selection

	},

	/**
	 * Perform date selection
	 * @param {number} year
	 * @param {number} month
	 * @param {number} milliseconds
	 */
	_select: function(year, month, milliseconds) {

		this.set('_selection_start', milliseconds);
		this.set('_selection_end', milliseconds);
		if (this._properties._displayed_month != month) {
			this.set('_displayed_year', year);
			this.set('_displayed_month', month);
			this._refreshData();
		}

		this.set('value', new Date(milliseconds));

	},

	/**
	 * Switch current view to "months" selection
	 * @param dom_event_name
	 * @param event_object
	 */
	_onSwitchToMonthViewClick: function(dom_event_name, event_object) {

		this.set('_selected_view', 'months');
		if (this._year_input) {
			this._year_input.set('value', this._properties._displayed_year + '');
		}
		event_object.preventDefault();

	},

	/*_onCloseMonthsViewClick: function(dom_event_name, event_object, view, template_arguments) {

		this._refreshData();
		this.set('_selected_view', 'days');

	},*/

	/**
	 * Display previous year
	 * @param dom_event_name
	 * @param event_object
	 */
	_onPreviousYearClick: function(dom_event_name, event_object) {

		this.set('_displayed_year', this.get('_displayed_year') - 1);
		this._clearInvalidInputState();
		event_object.preventDefault();

	},

	/**
	 * Display next year
	 * @param dom_event_name
	 * @param event_object
	 */
	_onNextYearClick: function(dom_event_name, event_object) {

		this.set('_displayed_year', this.get('_displayed_year') + 1);
		this._clearInvalidInputState();
		event_object.preventDefault();

	},

	/**
	 * Display calendar for chosen month
	 * @param dom_event_name
	 * @param event_object
	 * @param view
	 * @param template_arguments
	 */
	_onMonthClick: function(dom_event_name, event_object, view, template_arguments) {

		var month_descriptor = template_arguments[0];
		this.set('_displayed_month', month_descriptor.get('index'));
		this.set('_selected_view', 'days');
		this._refreshData();

	},

	/**
	 * Register input for the year on months view
	 * @param {Lava.widget.input.InputAbstract} view
	 */
	_handleYearInput: function(view) {

		this._year_input = view;
		view.onPropertyChanged('value', this._onYearInputValueChanged, this);

	},

	/**
	 * Add predefined CSS class to the year input to mark it as invalid
	 */
	_markInputAsInvalid: function() {

		// do not add the class to the container itself, just to the element
		// cause we do not need it to stay after refresh or render
		var year_input_container = this._year_input.getMainContainer(),
			element;

		if (year_input_container) {
			element = year_input_container.getDOMElement();
			if (element) {
				Firestorm.Element.addClass(element, this._config.options['invalid_input_class']);
			}
		}

	},

	/**
	 * Remove "invalid_input_class" from input field
	 */
	_clearInvalidInputState: function() {

		var year_input_container = this._year_input.getMainContainer(),
			element;

		if (year_input_container) {
			element = year_input_container.getDOMElement();
			if (element) {
				Firestorm.Element.removeClass(element, this._config.options['invalid_input_class']);
			}
		}

	},

	/**
	 * Refresh <wp>_displayed_year</wp> property from year input
	 * @param {Lava.widget.input.InputAbstract} widget
	 */
	_onYearInputValueChanged: function(widget) {

		var value = widget.get('value');

		// maxlength is also set on input in the template
		if (value.length > 2 && value.length < 6 && /^\d+$/.test(value)) {
			this.set('_displayed_year', +value);
			this._clearInvalidInputState();
		} else {
			this._markInputAsInvalid();
		}

	},

	/**
	 * Set selected date. Setter for <wp>value</wp> property
	 * @param {Date} value
	 */
	_setValue: function(value) {

		var year = value.getFullYear(),
			month = value.getMonth(),
			day = value.getDate(),
			new_time = Date.UTC(year, month, day); // normalize for selection

		this.set('_displayed_year', year);
		this.set('_displayed_month', month);

		this.set('_selection_start', new_time);
		this.set('_selection_end', new_time);

		this._set('value', value);

		this._refreshData();

	}

});

Lava.define(
'Lava.widget.Tooltip',
/**
 * Tooltip instance
 * @lends Lava.widget.Tooltip#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',

	name: 'tooltip',

	_property_descriptors: {
		y: {type: 'Integer'},
		x: {type: 'Integer'},
		y_offset: {type: 'Integer'},
		x_offset: {type: 'Integer'},
		html: {type: 'String'},
		is_visible: {type: 'Boolean'}
	},

	_properties: {
		/** Vertical position of the tooltip */
		y: 0,
		/** Vertical position of the tooltip */
		x: 0,
		/** Vertical offset of the tooltip instance from cursor pointer */
		y_offset: -25,
		/** Horizontal tooltip offset */
		x_offset: 5,
		/** Tooltip's content */
		html: '',
		/** Is this tooltip instance visible */
		is_visible: false
	}

});
Lava.locales.en = {
	/**
	 * How many plural forms does this language have.
	 */
	count_plurals: 2,
	/**
	 * Get the index of plural form
	 * @param {number} n
	 * @returns {number}
	 */
	pluralize: function(n) {
		return +(n != 1);
	},
	booleans: ['No', 'Yes'],
	day_names: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	short_day_names: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	month_names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	short_month_names: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
	first_day_offset: 0 // starts from Sunday. Must be "1" if the first day of week is Monday.
};

Lava.locales.ru = {
	count_plurals: 3,
	pluralize: function(n) {
		return n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2;
	},
	booleans: ['Нет', 'Да'],
	day_names: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
	short_day_names: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
	month_names: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
	short_month_names: ["Янв", "Февр", "Март", "Апр", "Май", "Июнь", "Июль", "Авг", "Сент", "Окт", "Нояб", "Дек"],
	first_day_offset: 1 // week starts from Monday
};