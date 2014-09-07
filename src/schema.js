
Lava.schema = {
	/** @const */
	//ELEMENT_EVENT_PREFIX: 'data-e-',
	/**
	 * This option should be turned off in production, but keep in mind: options, defined in template, are part of
	 * view configuration, and they must be valid JSON objects. Putting there anything else will most likely break
	 * existing and future functionality. Options must be serializable.
	 * @const
	 */
	VALIDATE_OPTIONS: true,
	/** @const */
	VALIDATE_OBJECT_PATHS: true,
	/** @const */
	DEFAULT_STABLE_SORT_ALGORITHM: 'mergeSort',
	DEFAULT_UNSTABLE_SORT_ALGORITHM: 'mergeSort',
	system: {
		/** @const */
		APP_CLASS: 'Lava.system.App',
		/** @const */
		VIEW_MANAGER_CLASS: 'Lava.system.ViewManager',
		/**
		 * ViewManager events (routed via templates), which are enabled by default, so does not require a call to lendEvent().
		 */
		DEFAULT_EVENTS: [
			'click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu',
			'mousewheel', 'keydown', 'keypress', 'keyup',
			'change', 'focus', 'blur'
		],

		/**
		 * Lava.Cron uses it for animation
		 */
		ALLOW_REQUEST_ANIMATION_FRAME: true
	},
	popover_manager: {
		IS_ENABLED: true,
		CLASS: 'Lava.system.PopoverManager',
		HIDE_EMPTY_TOOLTIPS: true
	},
	data: {
		/** @const */
		DEFAULT_MODULE_CLASS: 'Module',
		/** @const */
		DEFAULT_RECORD_CLASS: 'Record',
		/** @const */
		DEFAULT_FIELD_TYPE: 'Basic',
		/**
		 * Generally, it's NOT recommended to turn this off in production
		 */
		VALIDATE_IMPORT_DATA: true
	},
	modules: {},
	view: {
		/** @const */
		VALIDATE_CLASS_NAMES: true,
		/** @const */
		VALIDATE_STYLES: true,
		/** @const */
		REFRESH_INFINITE_LOOP_THRESHOLD: 3,
		DEFAULT_CLASS_LOCATOR_GATEWAY: 'Lava.ClassLocatorGateway'
	},
	parsers: {
		view_name_to_class_map: {
			'expression': 'Expression',
			'foreach': 'Foreach',
			'if': 'If',
			'view': 'View'
		},
		PRESERVE_VIEW_NAME: false,
		EXPORT_STRINGS: false
	},
	widget: {
		/**
		 * May be treated same as DEBUG switch (most likely, you will want to turn this off in production)
		 * @const
		 */
		VALIDATE_PROPERTY_TYPES: true,
		/** @const */
		DEFAULT_SUGAR_CLASS: 'Lava.system.Sugar',
		ALLOW_REDEFINITION: false,
		DEFAULT_EXTENSION_GATEWAY: 'Lava.WidgetConfigExtensionGateway',
		DEFAULT_CLASS_LOCATOR_GATEWAY: 'Lava.ClassLocatorGateway',
		DEFAULT_EXTENDER: 'Default'
	},
	SUGAR_CLASSES: ['Lava.system.Sugar'],

	/**
	 * Current locale. Must not be null or 'default'
	 */
	LOCALE: 'en',
	RESOURCES_ENABLED: true,

	/** @define */
	DEBUG: true
};