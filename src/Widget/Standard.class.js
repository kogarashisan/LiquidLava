
Lava.define(
'Lava.widget.Standard',
/**
 * @lends Lava.widget.Standard#
 * @extends Lava.view.View#
 * @implements _iViewHierarchyMember
 */
{

	Extends: 'Lava.view.View',
	Shared: ['_property_descriptors', '_event_handlers', '_role_handlers', '_include_handlers', '_broadcast_handlers', '_modifiers'],

	isWidget: true,
	/** @readonly */
	name: null,

	/** @type {Object.<string, _cPropertyDescriptor>} */
	_property_descriptors: {},

	_acquired_events: [],
	_event_handlers: {},

	_role_handlers: {},
	_include_handlers: {},

	_broadcast_handlers: {},

	_bindings: {},
	_resources: {},

	_parent_widget: null,

	/**
	 * Called in context of the widget.
	 * modifier_name => class_method_name
	 */
	_modifiers: {
		translate: 'translate',
		ntranslate: 'ntranslate'
	},

	/**
	 * @param {_cWidget} config
	 * @param {Lava.widget.Standard} widget
	 * @param {Lava.view.View} parent_view
	 * @param {Object} properties
	 * @param {Lava.system.Template} template
	 */
	init: function(config, widget, parent_view, template, properties) {

		var name;

		if (Lava.schema.DEBUG && !config.is_extended) Lava.t("Widget was created with partial (unextended) config");

		if (Lava.schema.DEBUG) {
			for (name in this._property_descriptors) {
				if (!(name in this._properties)) Lava.t("All widget properties must have a default value");
			}
		}

		this._parent_widget = widget;

		this.View$init(config, this, parent_view, template, properties);

		for (name in config.bindings) {

			this._bindings[name] = new Lava.scope.Binding(config.bindings[name], this);

		}

		if ('broadcast' in config) {

			Lava.view_manager.dispatchBroadcast(this, config.broadcast);

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
					? Lava.resources.mergeResources(component_resource.value, resources, true)
					: component_resource.value;

			}

		}

		if (resources) {
			this._resources[locale] = resources;
			Lava.resources.mergeRootContainerStacks(resources);
		}

	},

	/**
	 * @param {string} name
	 * @param {Array} template_arguments
	 * @returns {Lavadoc._tTemplate}
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
	 * @param {string} dom_event_name
	 * @param dom_event
	 * @param {string} target_name
	 * @param {Lava.view.Abstract} view
	 * @param {Array.<*>} template_arguments
	 * @returns {boolean}
	 */
	handleEvent: function(dom_event_name, dom_event, target_name, view, template_arguments) {

		var result = false;

		if (target_name in this._event_handlers) {

			//try {

				this[this._event_handlers[target_name]](dom_event_name, dom_event, view, template_arguments);

			//} catch (e) {

			//	Lava.logException(e);

			//}

			result = true;

		}

		return result;

	},

	broadcastInDOM: function() {

		this.View$broadcastInDOM();
		this._acquireDefaultEvents();

	},

	broadcastRemove: function() {

		this.View$broadcastRemove();
		this._releaseAllEvents();

	},

	inject: function(element, position) {

		if (this._is_inDOM) Lava.t("inject: widget is already in DOM");
		if (Lava.schema.DEBUG && this._parent_view) Lava.t("Widget: only top-level widgets can be inserted into DOM");
		if (Lava.schema.DEBUG && !this._container) Lava.t("Widget: root widgets must have a container");

		var html = this.render();

		Firestorm.DOM.insertHTML(element, html, position);
		this.broadcastInDOM();

		Lava.scheduleRefresh(); // see comment for scheduleRefresh

	},

	/**
	 * The target element becomes container for this widget.
	 * Primary usage: inject a widget into the BODY element.
	 * @param element
	 */
	injectIntoExistingElement: function(element) {

		if (this._is_inDOM) Lava.t("inject: widget is already in DOM");
		if (Lava.schema.DEBUG && this._parent_view) Lava.t("Widget: only top-level widgets can be inserted into DOM");
		if (Lava.schema.DEBUG && !this._container) Lava.t("Widget: root widgets must have a container");
		if (Lava.schema.DEBUG && !this._container.isElementContainer) Lava.t("injectIntoExistingElement expects an element containers");

		this._container.captureExistingElement(element);
		this._container.setHTML(this._renderContents());

		// rewritten broadcastInDOM - without this._container.informInDOM()
		this._is_inDOM = true;
		this._is_dirty = false;
		this._broadcastToChildren('broadcastInDOM');
		this._acquireDefaultEvents();

	},

	_acquireDefaultEvents: function() {

		var i = 0,
			count;

		if (this._config.default_events) {
			count = this._config.default_events.length;
			for (; i < count; i++) {

				this._lendEvent(this._config.default_events[i]);

			}
		}

	},

	_lendEvent: function(event_name) {

		if (Firestorm.Array.include(this._acquired_events, event_name)) {

			Lava.view_manager.lendEvent(event_name);

		}

	},

	_releaseEvent: function(event_name) {

		if (Firestorm.Array.exclude(this._acquired_events, event_name)) {

			Lava.view_manager.releaseEvent(event_name);

		}

	},

	_releaseAllEvents: function() {

		var i = 0,
			count = this._acquired_events.length;

		for (; i < count; i++) {

			Lava.view_manager.releaseEvent(this._acquired_events[i]);

		}

		this._acquired_events = [];

	},

	remove: function() {

		if (!this._is_inDOM) Lava.t("remove: widget is not in DOM");
		if (Lava.schema.DEBUG && !this._container) Lava.t("remove: widget doesn't have a container");

		this._releaseAllEvents();
		if (!this._is_sleeping) this._sleep();
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
	 * @param {string} name
	 * @param {Array} arguments_array
	 * @returns {*}
	 */
	callModifier: function(name, arguments_array) {

		if (Lava.schema.DEBUG && !(name in this._modifiers)) Lava.t("Unknown widget modifier: " + name);

		return this[this._modifiers[name]].apply(this, arguments_array);

	},

	/**
	 * @param {string} name
	 * @param {Array} arguments_array
	 * @returns {*}
	 */
	callActiveModifier: function(name, arguments_array) {

		Lava.t("Alpha version. This functionality may be removed later.");

	},

	/**
	 * @returns {Lava.widget.Standard}
	 */
	getParentWidget: function() {

		return this._parent_widget;

	},

	/**
	 * @param {string} role
	 * @param {Lava.view.View} view
	 * @param {Array.<*>} template_arguments
	 * @returns {boolean}
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

			if (descriptor.setter) {

				// It's forced to make setters private, cause type-checking will not work if setter is called directly.
				if (Lava.schema.DEBUG && descriptor.setter[0] != '_') Lava.t("Widget property setters must not be public: " + descriptor.setter);

				//try { // additional protection from crash for the scope system
				//	this[descriptor.setter](name, value);
				//} catch (e) {
				//	Lava.logException(e);
				//}

				this[descriptor.setter](name, value);

			} else {

				this.View$set(name, value);

			}

		} else {

			this.View$set(name, value);

		}

	},

	get: function(name) {

		return ((name in this._property_descriptors) && this._property_descriptors[name].getter)
			? this[this._property_descriptors[name].getter](name)
			: this.View$get(name);

	},

	/**
	 * @param {Lava.widget.Standard} widget
	 * @param {string} event_name
	 * @param {string} handler_name
	 * @param {(Array.<*>|null)} template_arguments
	 */
	registerBroadcastTarget: function(widget, event_name, handler_name, template_arguments) {

		widget.on(
			event_name,
			this[this._broadcast_handlers[handler_name]],
			this,
			{
				event_name: event_name,
				template_arguments: template_arguments
			}
		);

	},

	/**
	 * Fire the received event. For usage with broadcast events from inner widgets.
	 *
	 * @param widget
	 * @param event_args
	 * @param listener_args
	 */
	_broadcastEvent: function(widget, event_args, listener_args) {

		this._fire(listener_args.event_name);

	},

	getPackageConstructor: function(path) {

		return Lava.ClassManager.getPackageConstructor(this.Class.path, path);

	},

	getResource: function(resource_name, locale) {

		locale = locale || Lava.schema.LOCALE;

		return ((locale in this._resources) && (resource_name in this._resources[locale]))
			? this._resources[locale][resource_name]
			: null;

	},

	/**
	 * (modifier)
	 * @param {string} resource_name
	 * @param {Array} arguments_list
	 * @param {string} locale
	 * @returns {string}
	 */
	translate: function(resource_name, arguments_list, locale) {

		var string_descriptor = /** @type {_cTranslatableString} */ this.getResource(resource_name, locale || Lava.schema.LOCALE),
			result;

		if (string_descriptor) {

			if (Lava.schema.DEBUG && string_descriptor.type != 'translate') Lava.t("[translate] resource is not a string: " + resource_name);

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
	 * (modifier)
	 * @param {string} string_name
	 * @param {number} n
	 * @param {Array} arguments_list
	 * @param {string} locale
	 * @returns {string}
	 */
	ntranslate: function(string_name, n, arguments_list, locale) {

		var string_descriptor = /** @type {_cTranslatablePlural} */ this.getResource(string_name, locale || Lava.schema.LOCALE),
			form_index = Lava.locales[Lava.schema.LOCALE].pluralize(n),
			pluralform,
			result;

		if (string_descriptor) {

			if (Lava.schema.DEBUG && string_descriptor.type != 'ntranslate') Lava.t("[ntranslate] resource is not a string: " + string_name);
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

	destroy: function() {

		var name,
			i,
			count;

		this._releaseAllEvents();

		for (name in this._bindings) {

			this._bindings[name].destroy();

		}

		this._bindings = this._resources = null;

		this.View$destroy();

	}

});