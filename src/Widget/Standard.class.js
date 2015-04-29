
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
	 * @const
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
	 * @param dom_event Browser event object, wrapped by the framework
	 * @param {string} target_name Template event name
	 * @param {Lava.view.Abstract} view View, that is the source for this event
	 * @param {Array.<*>} template_arguments Evaluated argument values from view's template
	 * @returns {boolean} <kw>true</kw>, if event was handled, and <kw>false</kw> otherwise
	 */
	handleEvent: function(dom_event_name, dom_event, target_name, view, template_arguments) {

		var result = false;

		if (target_name in this._event_handlers) {

			this[this._event_handlers[target_name]](dom_event_name, dom_event, view, template_arguments);
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