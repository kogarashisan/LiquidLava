/**
 * Root object of the Lava framework
 */
var Lava = {
	/**
	 * Version numbers, split by comma to allow easier comparison of versions
	 */
	version: [],

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
	TemplateWalker: null,
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
	Serializer: null,
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
	KNOWN_EXCEPTIONS: null,

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
	 * Used to delay refresh loop after the current JavaScript thread exits. See {@link Lava#scheduleRefresh}
	 */
	_refresh_timer: null,

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

		for (path in this.classes) {

			this._loadClass(path);

		}

		if (typeof(window) != 'undefined') {
			this._initGlobals();
			this.ClassManager.registerExistingConstructor('Lava.WidgetConfigExtensionGateway', this.WidgetConfigExtensionGateway);
			this.ClassManager.registerExistingConstructor('Lava.ClassLocatorGateway', this.ClassLocatorGateway);
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

		var constructor;
		constructor = this.ClassManager.getConstructor(Lava.schema.system.VIEW_MANAGER_CLASS);
		this.view_manager = new constructor();
		constructor = this.ClassManager.getConstructor(Lava.schema.system.APP_CLASS);
		this.app = new constructor();

		if (Lava.schema.popover_manager.IS_ENABLED) {
			constructor = this.ClassManager.getConstructor(Lava.schema.popover_manager.CLASS);
			this.popover_manager = new constructor();
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

		this.logError((typeof(e) == 'string' || typeof(e) == 'number') ? e : e.message);

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

			if (Lava.schema.DEBUG && config.extends && config.extends != extends_title) Lava.t("Malformed widget config");

			config.extends = extends_title;
			Lava.extenders[config.extender_type || widget_config.extender_type](config);

		} else {

			// all widgets from schema must have their class present
			config = widget_config;

		}

		constructor = Lava.ClassManager.getConstructor(config['class']);
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

		if (typeof(message) == 'number' && this.KNOWN_EXCEPTIONS && (message in this.KNOWN_EXCEPTIONS)) {
			throw new Error(this.KNOWN_EXCEPTIONS[message]);
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

		var body = document.body,
			app_class = Firestorm.Element.getProperty(document.body, 'lava-app'),
			bootstrap_targets,
			element,
			result;

		this.init && this.init();

		if (app_class != null) {

			result = this._elementToWidget(body, {type: 'Element', tag_name: 'body'});
			result.injectIntoExistingElement(body);

		} else {

			bootstrap_targets = Firestorm.selectElements('script[type="lava/app"],lava-app');
			for (var i = 0, count = bootstrap_targets.length; i < count; i ++) {

				element = bootstrap_targets[i];
				result = this._elementToWidget(element, {type: 'Morph'});
				result.inject(element, 'After');
				Firestorm.Element.destroy(element);

			}

		}

		if (Lava.schema.popover_manager.IS_ENABLED) {
			this.popover_manager.enable();
		}

	},

	/**
	 * Parse the DOM element instance as a widget template and create a widget
	 * @param {HTMLElement} element
	 * @param {Object} container_config
	 * @returns {Lava.widget.Standard}
	 */
	_elementToWidget: function(element, container_config) {

		var config,
			constructor,
			name = Firestorm.Element.getProperty(element, 'name'),
			id = Firestorm.Element.getProperty(element, 'id'),
			class_name = Firestorm.Element.getProperty(element, 'lava-app');

		config = {
			type: 'widget',
			is_extended: true,
			template: null,
			container: container_config
		};
		config.template = Lava.TemplateParser.parse(element.get('html'), config);

		if (id) {
			config.id = id;
			Firestorm.Element.removeProperty(element, 'id');
		}

		constructor = Lava.ClassManager.getConstructor(class_name || 'Lava.widget.Standard', 'Lava.widget');
		if (Lava.schema.DEBUG && !constructor) Lava.t('Class not found: ' + class_name);
		return /** @type {Lava.widget.Standard} */ new constructor(config);

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

		this.ClassManager.define(path, class_body);

	},

	/**
	 * Create a function, which returns a clone of given template or config.
	 * Note: widget configs must not be extended!
	 * @param {*} config Any clonable JavaScript object without circular references
	 * @returns {function}
	 */
	createCloner: function(config) {

		return new Function('return ' + Lava.Serializer.serialize(config));

	},

	/**
	 * Feature of the current binding system:
	 * sometimes, a view may be rendered with dirty bindings. They will be refreshed in the next refresh loop.
	 * This may happen during widget {@link Lava.widget.Standard#inject|inject()} outside of normal App lifecycle,
	 * and developer may forget to call Lava.refreshViews()
	 */
	scheduleRefresh: function() {

		var self;
		if (!this._refresh_timer && !Lava.Core.isProcessingEvent()) {

			self = this;
			this._refresh_timer = window.setTimeout(
				function(){
					self._refresh_timer = null;
					self.refreshViews();
				},
				0
			);

		}

	},

	/**
	 * Perform view refresh outside of normal application lifecycle (in the end of AJAX call, or from browser console).
	 * Note: call to this function does not guarantee, that views will be refreshed immediately
	 */
	refreshViews: function() {

		if (!Lava.Core.isProcessingEvent()) {

			this.view_manager.refresh();

		}

		if (this._refresh_timer) {
			window.clearTimeout(this._refresh_timer);
			this._refresh_timer = null;
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
		listener.fn = listener.fn_original;
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

		return instance.Class.hierarchy_paths.indexOf(class_name) != -1 || instance.Class.implements.indexOf(class_name) != -1;

	}

};