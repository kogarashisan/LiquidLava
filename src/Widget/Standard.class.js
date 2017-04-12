
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
	Shared: ['PROPERTY_DESCRIPTORS'],
	Merged: [
		'TEMPLATE_METHODS',
		'EVENT_HANDLERS'
	],

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
	 * Map of template event handlers
	 * @type {Array.<string, string>}
	 */
	EVENT_HANDLERS: [],
	/**
	 * Map of template callbacks. Called in context of the widget
	 * @type {Array.<string, string>}
	 */
	TEMPLATE_METHODS: [
		'translate',
		'ntranslate',
		'translateBoolean',
		'saveReference',
		'storeReference',
		'removeReference',
		'getReference',
		'getInclude'
	],

	/**
	 * Rules for accessing widget's properties
	 * @type {Object.<string, _cPropertyDescriptor>}
	 */
	PROPERTY_DESCRIPTORS: {},
	/**
	 * List of non-default template events, to which this widget responds
	 * @type {Array.<string>}
	 */
	_acquired_events: [],
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
	 * Saved references to inner views and widgets
	 * @type {Object.<string, Lava.view.Abstract>}
	 */
	_references: {},

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

		if (Lava.schema.DEBUG) {

			if (!config.is_extended) Lava.t("Widget was created with partial (unextended) config");

			for (name in this.PROPERTY_DESCRIPTORS) {
				if (!(name in this._properties)) Lava.t("All widget properties must have a default value");
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
	 * Render and insert the widget instance into DOM
	 * @param {HTMLElement} element
	 * @param {_eInsertPosition} position
	 */
	inject: function(element, position) {

		if (this._is_inDOM) Lava.t("inject: widget is already in DOM");
		if (Lava.schema.DEBUG && this._parent_view) Lava.t("Widget: only top-level widgets can be inserted into DOM");
		if (Lava.schema.DEBUG && !this._container) Lava.t("Widget: root widgets must have a container");

		// Otherwise, if you assign data to a widget, that was removed from DOM,
		// and then render it - it will render with old (stale) data.
		Lava.ScopeManager.refresh();

		// lock, cause render operation can change data. Although it's not recommended to change data in render().
		Lava.ScopeManager.lock();
		Firestorm.DOM.insertHTML(element, this.render(), position || 'Top');
		Lava.ScopeManager.unlock();
		this.broadcastInDOM();

	},

	/**
	 * Passed element becomes container for this widget, and widget inserts itself inside.
	 *
	 * Example usage: inject a widget into the &lt;body&gt; element
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
		this.broadcastInDOM();

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
	 * Get `_parent_widget`
	 * @returns {Lava.widget.Standard}
	 */
	getParentWidget: function() {

		return this._parent_widget;

	},

	set: function(name, value) {

		var descriptor;

		if (name in this.PROPERTY_DESCRIPTORS) {

			descriptor = this.PROPERTY_DESCRIPTORS[name];

			if (Lava.schema.DEBUG && descriptor.is_readonly) Lava.t("Trying to set readonly property: " + name);

			if (Lava.schema.widget.VALIDATE_PROPERTY_TYPES) {

				if (value === null) {

					if (!descriptor.is_nullable) Lava.t("Trying to assign NULL to non-nullable property");

				} else if (descriptor.type && !Firestorm.Types[descriptor.type].isValidValue(value, descriptor)) {

					Lava.t("Assigned value does not match the property type: " + descriptor.type);

				}

			}

		}

		// why we need IN operator: see Lava.view.Abstract#set
		if (this._properties[name] !== value || !(name in this._properties)) {

			if (descriptor && descriptor.setter) {

				// you are forced to make setters private, cause type-checking will not work if setter is called directly.
				if (Lava.schema.DEBUG && descriptor.setter[0] != '_') Lava.t("Widget property setters must not be public: " + descriptor.setter);
				this[descriptor.setter](name, value);

			} else {

				this._set(name, value);

			}

		}

	},

	get: function(name) {

		return ((name in this.PROPERTY_DESCRIPTORS) && this.PROPERTY_DESCRIPTORS[name].getter)
			? this[this.PROPERTY_DESCRIPTORS[name].getter](name)
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
	 * Get a dynamically constructed scope instance
	 * @param {Lava.view.Abstract} view
	 * @param {_cDynamicScope} config
	 */
	getDynamicScope: function(view, config) {

		Lava.t('Not implemented: getDynamicScope');

	},

	_fire: function(event_name, event_args) {

		if (('class_events' in this._config) && this._config.class_events[event_name]) {
			this.dispatchEvents(this._config.class_events[event_name], event_args);
		}

		this.View$_fire(event_name, event_args);

	},

	/**
	 * Dispatch event to this widget, and all it's parents (if any of them supports it)
	 *
	 * @param {string} callback_name Event name
	 * @param {*} args Either DOM event, or `event_args`
	 */
	sendBubblingEvent: function(callback_name, args) {

		try {

			var result,
				target = this;
			do {

				if (target.EVENT_HANDLERS.indexOf(callback_name) != -1) {
					if (Lava.schema.DEBUG && !target[callback_name]) Lava.t("Trying to call nonexistent method from widget: " + callback_name);
					result = target[callback_name].apply(target, args);
				} else {
					target = target.getParentWidget();
				}

			} while (target && result !== false);

		} catch (e) {

			Lava.logException(e);

		}

	},

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Template methods

	/**
	 * Get widget's include
	 * @param {string} name Include name
	 * @returns {?_tTemplate}
	 */
	getInclude: function(name) {

		if (Lava.schema.DEBUG && !this._config.includes) Lava.t("Include not found: " + name + ". Widget does not have any includes in it's config.");
		return this._config.includes[name];

	},

	/**
	 * Translate a string from resources. If `arguments_list` is present - then also replaces
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
	 * Translate a plural string from resources. If `arguments_list` is present - then also replaces
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
	 * Translate a boolean type into user language
	 * @param value
	 * @returns {string}
	 */
	translateBoolean: function(value) {

		if (Lava.schema.DEBUG && typeof(value) != 'boolean') Lava.t("translateBoolean: argument is not of boolean type");
		return Lava.locales[Lava.schema.LOCALE].booleans[+value];

	},

	/**
	 * Save the view into widget's property for later use.
	 * Reference will be removed, when referenced view is destroyed.
	 *
	 * @param {Lava.view.Abstract} view
	 * @param {string} name
	 */
	saveReference: function(view, name) {

		this._references[name] = view;
		view.on('destroy', this._onReferencedViewDestroyed, this, name);

	},

	/**
	 * Listener to saved view's `destroy` event - removes the view from references
	 * @param {Lava.view.Abstract} view
	 * @param {*} event_args
	 * @param {string} name
	 */
	_onReferencedViewDestroyed: function(view, event_args, name) {

		delete this._references[name];

	},

	/**
	 * Save reference, but don't listen to view's 'destroy' event
	 * (this way, when view is destroyed - it's reference stays active).
	 *
	 * May be used at later stage of development for micro-optimizations
	 * as faster alternative to `saveReference`.
	 * But keep in mind: using this method may lead to bugs in your code
	 * (if you do something with destroyed views).
	 *
	 * @param {Lava.view.Abstract} view
	 * @param {string} name
	 */
	storeReference: function(view, name) {

		this._references[name] = view;

	},

	/**
	 * Forget the view, referenced by `name`
	 * @param {string} name
	 */
	removeReference: function(name) {

		delete this._references[name];

	},

	/**
	 * Get the view, stored as `name`
	 * @param {string} name
	 * @returns {Lava.view.Abstract}
	 */
	getReference: function(name) {

		return this._references[name];

	},

	// end: template methods
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	destroy: function() {

		var name;

		for (name in this._bindings) {

			this._bindings[name].destroy();

		}

		this._bindings = this._resources = null;

		this.View$destroy();

	}

});