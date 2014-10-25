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
		 * ViewManager events (routed via templates), which are enabled by default, so does not require a call to lendEvent()
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
		ALLOW_REQUEST_ANIMATION_FRAME: true
	},
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
		 * Whether to validate the data, which is loaded into modules.
		 * Generally, it's NOT recommended to turn this off in production
		 * @const
		 */
		VALIDATE_IMPORT_DATA: true
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
		 * How much times a scope may be refreshed during one refresh loop, before it's considered
		 * an infinite refresh loop
		 * @const
		 */
		REFRESH_INFINITE_LOOP_THRESHOLD: 3,
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
			'view': 'View'
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
	DEBUG: true
};