
var Lava = {
	version: [],

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Default namespaces reservation. All root members must be reserved ahead - v8 optimization.

	schema: null,
	classes: {},
	/**
	 * @type {Object.<string, _cWidget>}
	 */
	widgets: {},
	/**
	 * @type {Object.<string, _cSugarSchema>}
	 */
	sugar_map: {},
	ClassManager: null,
	ExpressionParser: null,
	TemplateParser: null,
	ObjectParser: null,
	transitions: null,
	Cron: null,
	Core: null,
	ScopeManager: null,
	modifiers: null,
	Serializer: null,
	types: null,
	extenders: null,
	resources: null,
	algorithms: {
		sorting: {}
	},

	animation: {},
	animator: {},
	data: {
		field: {}
	},
	system: {},
	mixin: {},
	parsers: {},
	view: {
		refresher: {},
		container: {}
	},
	widget: {},
	scope: {},
	user: {
		// place for any other user defined classes and variables
	},

	/** @type {Lava.system.App} */
	app: null,
	/** @type {Lava.system.ViewManager} */
	view_manager: null,
	/** @type {Lava.system.PopoverManager} */
	popover_manager: null,

	locales: {},

	// end: default namespaces reservation
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// constants and predefined data

	/** @enum {number} */
	BINDING_DIRECTIONS: {
		/** @const */
		TO_WIDGET: 1,
		/** @const */
		FROM_WIDGET: 2
	},

	/** @enum {number} */
	TARGET_ARGUMENT_TYPES: {
		VALUE: 1,
		BIND: 2
	},

	/**
	 * When changing this, you must also change SYSTEM_ID_REGEX
	 * @const
	 * */
	ELEMENT_ID_PREFIX: 'e',
	SYSTEM_ID_REGEX: /^e?\\d+$/,
	VALID_PROPERTY_NAME_REGEX: /^[a-zA-Z0-9\_\$]+$/,
	EMPTY_REGEX: /^\s*$/,
	VALID_LABEL_REGEX: /^[A-Za-z\_][A-Za-z\_0-9]*$/,

	/** @returns {boolean} */
	DEFAULT_LESS: function(a, b) { return a < b; },
	// not sure if these obsolete tags should also be included: basefont, bgsound, frame, isindex
	VOID_TAGS: ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'],

	KNOWN_EXCEPTIONS: null,

	// end: constants and predefined data
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// class members

	_widget_title_to_sugar_instance: {},
	_sugar_instances: {},

	/** @type {Lavadoc._tGUID} */
	guid: 1,
	is_init_done: false,
	_refresh_timer: null,

	/**
	 * Must be called before bootstrap() or creating any widgets.
	 */
	init: function() {

		var path,
			i = 0,
			count = this.schema.sugar_classes.length;

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

		for (; i < count; i++) {

			this.registerSugar(this.schema.sugar_classes[i]);

		}

		this.is_init_done = true;

	},

	_initGlobals: function() {

		var constructor;
		constructor = this.ClassManager.getConstructor(Lava.schema.system.VIEW_MANAGER_CLASS);
		this.view_manager = new constructor();
		constructor = this.ClassManager.getConstructor(Lava.schema.system.APP_CLASS);
		this.app = new constructor();

		if (Lava.schema.system.POPOVER_MANAGER_ENABLED) {
			constructor = this.ClassManager.getConstructor(Lava.schema.system.POPOVER_MANAGER_CLASS);
			this.popover_manager = new constructor();
		}

	},

	/**
	 * Validate and then eval the passed string.
	 * String does not necessarily need to be in strict JSON format, just any valid plain JS object (without logic!).
	 * Obviously, you must use this function only with the code you trust.
	 * @param {string} serialized_object
	 */
	parseOptions: function(serialized_object) {
		Lava.schema.VALIDATE_OPTIONS && this.ObjectParser.parse(serialized_object);
		return eval('(' + serialized_object + ')');
	},

	/**
	 * @param {string} id
	 * @returns {boolean}
	 */
	isValidId: function(id) {

		return this.VALID_LABEL_REGEX.test(id) && !this.SYSTEM_ID_REGEX.test(id);

	},

	/**
	 * @param {string} msg
	 */
	logError: function(msg) {

		if (typeof(window) == 'undefined') throw new Error(msg); // Node environment

		if (window.console) {
			window.console.error(msg);
		}

	},

	logException: function(e) {

		this.logError((typeof(e) == 'string' || typeof(e) == 'number') ? e : e.message);

	},

	/**
	 * @param widget_title
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
	 * @param {string} title
	 * @param config
	 * @param properties
	 * @returns {Lava.widget.Standard}
	 */
	createWidget: function(title, config, properties) {

		var widget_config = this.getWidgetConfig(title),
			constructor;

		if (config) {

			if (Lava.schema.DEBUG && config.extends && config.extends != title) Lava.t("Malformed widget config");

			config.extends = title;
			Lava.extenders[config.extender_type || widget_config.extender_type](config);

		} else {

			// all widgets from schema must have their class present
			config = widget_config;

		}

		constructor = Lava.ClassManager.getConstructor(config.class);
		return /** @type {Lava.widget.Standard} */ new constructor(config, null, null, null, properties);

	},

	hasWidgetConfig: function(widget_title) {

		return widget_title in this.widgets;

	},

	/**
	 * Take an array of event names and leave those, which are not in DEFAULT_EVENTS schema setting,
	 * @param {Array.<string>} event_names
	 * @returns {Array.<string>}
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

	t: function(message) {

		if (typeof(message) == 'number' && this.KNOWN_EXCEPTIONS && (message in this.KNOWN_EXCEPTIONS)) {
			throw new Error(this.KNOWN_EXCEPTIONS[message]);
		}

		throw new Error(message || 'Debug assertion failed');

	},

	registerSugar: function(class_name) {

		if (Lava.schema.DEBUG && (class_name in this._sugar_instances)) Lava.t('Class is already registered as sugar');
		var constructor = this.ClassManager.getConstructor(class_name);
		this._sugar_instances[class_name] = new constructor();

	},

	getSugarInstance: function(class_name) {

		return this._sugar_instances[class_name];

	},

	/**
	 * @param {string} widget_title
	 * @returns {_iSugarParser}
	 */
	getWidgetSugarInstance: function(widget_title) {

		var sugar_class,
			widget_config;

		if (!(widget_title in this._widget_title_to_sugar_instance)) {

			widget_config = this.getWidgetConfig(widget_title);
			if (!('sugar' in widget_config)) Lava.t("Widget " + widget_title + " does not have sugar in configuration");
			sugar_class = widget_config.sugar.class || Lava.schema.widget.DEFAULT_SUGAR_CLASS;
			this._widget_title_to_sugar_instance[widget_title] = this._sugar_instances[sugar_class];

		}

		return this._widget_title_to_sugar_instance[widget_title];

	},

	/**
	 * @param {string} widget_title
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

	bootstrap: function() {

		var body = document.body,
			app_class = Firestorm.Element.getProperty(document.body, 'lava-app'),
			bootstrap_targets,
			element,
			result;

		if (!this.is_init_done) {
			this.init();
		}

		if (app_class != null) {

			result = this._elementToWidget(body, {class: 'Element', tag_name: 'body'});
			result.injectIntoExistingElement(body);

		} else {

			bootstrap_targets = Firestorm.selectElements('script[type="lava/app"],lava-app');
			for (var i = 0, count = bootstrap_targets.length; i < count; i ++) {

				//try {

					element = bootstrap_targets[i];
					result = this._elementToWidget(element, {class: 'Morph'});
					result.inject(element, 'After');
					element.destroy();

				//} catch (e) {

				//	Lava.logException(e);

				//}

			}

		}

		if (Lava.schema.system.POPOVER_MANAGER_ENABLED) {
			this.popover_manager.enable();
		}

	},

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
		return /** @type {Lava.widget.Standard} */ new constructor(config);

	},

	/**
	 * Behaves like a widget constructor, but accepts raw (unextended) widget config.
	 * Extends the config and creates the widget instance with the right class.
	 *
	 * @constructor
	 * @param {_cWidget} config
	 * @param {Lava.widget.Standard} widget
	 * @param {Lava.view.View} parent_view
	 * @param {Object} properties
	 * @param {Lava.system.Template} template
	 * @returns {Lava.widget.Standard}
	 */
	WidgetConfigExtensionGateway: function(config, widget, parent_view, template, properties) {

		// here we do not need to check if the config is already extended, cause otherwise it would have real class
		// and it's constructor would be called directly.
		Lava.extenders[config.extender_type](config);

		if ('class_locator' in config) {

			config.class = Lava.schema.widget.DEFAULT_CLASS_LOCATOR_GATEWAY;

		}

		if (Lava.schema.DEBUG && !config.class) Lava.t("Trying to create a widget without class");
		var constructor = Lava.ClassManager.getConstructor(config.class, 'Lava.widget');
		if (Lava.schema.DEBUG && !constructor) Lava.t("Class not found: " + config.class);
		return new constructor(config, widget, parent_view, template, properties);

	},

	ClassLocatorGateway: function(config, widget, parent_view, template, properties) {

		var target = Lava.view_manager.locateTarget(widget, config.class_locator.locator_type, config.class_locator.name);
		if (Lava.schema.DEBUG && (!target || !target.isWidget)) Lava.t("[ClassLocatorGateway] Target is null or not a widget");

		var constructor = target.getPackageConstructor(config.real_class);
		return new constructor(config, widget, parent_view, template, properties);

	},

	/**
	 * @param {string} class_name
	 * @param {Object} class_object
	 */
	define: function(class_name, class_object) {

		if (this.is_init_done) {

			this.ClassManager.define(class_name, class_object);

		} else {

			this.classes[class_name] = class_object;

		}

	},

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
	 * @param {*} config
	 * @returns {function}
	 */
	createCloner: function(config) {

		return new Function('return ' + Lava.Serializer.serialize(config));

	},

	/**
	 * Feature of the current binding system:
	 * sometimes, a view may be rendered with dirty bindings. They will be refreshed in the next refresh loop.
	 * This may happen during widget inject() outside of normal App lifecycle, and user may forget to call Lava.refreshViews().
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

	refreshViews: function() {

		if (!Lava.Core.isProcessingEvent()) {

			this.view_manager.refresh();

		}

		if (this._refresh_timer) {
			window.clearTimeout(this._refresh_timer);
			this._refresh_timer = null;
		}

	},

	isVoidTag: function(name) {

		return this.VOID_TAGS.indexOf(name) != -1;

	},

	suspendListener: function(listener) {
		listener.fn = this.noop;
	},

	resumeListener: function(listener) {
		listener.fn = listener.fn_original;
	},

	noop: function() {}

};