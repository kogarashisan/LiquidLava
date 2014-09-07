
Lava.define(
'Lava.system.ViewManager',
/**
 * @lends Lava.system.ViewManager#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',

	// views and widgets, sorted by depth level. [level][views_array]
	_dirty_views: [],
	_views_refreshing: false,

	/**
	 * @type {Object.<string, Lava.view.Abstract>}
	 */
	_views_by_id: {},
	/**
	 * @type {Object.<*, Lava.view.Abstract>}
	 */
	_views_by_guid: {},

	/**
	 * @type {Object.<string, Array.<Lava.widget.Standard>>}
	 */
	_global_role_targets: {},
	/**
	 * @type {Object.<string, Array.<Lava.widget.Standard>>}
	 */
	_global_event_targets: {},

	_old_mouseover_target: null,
	_old_mouseover_view_stack: [],
	_new_mouseover_target: null,
	_new_mouseover_view_stack: [],

	_event_usage_counters: {},
	_events_listeners: {
		mouseover: null,
		mouseout: null
	},

	_cancel_bubble: false,
	_is_bubble_cancellable: false,

	init: function() {

		var default_events = Lava.schema.system.DEFAULT_EVENTS,
			i = 0,
			count = default_events.length;

		for (; i < count; i++) {

			this._event_usage_counters[default_events[i]] = 1;
			this._initEvent(default_events[i]);

		}

	},

	/**
	 * @param {Lava.view.Abstract} view
	 */
	scheduleViewRefresh: function(view) {

		if (this._views_refreshing) Lava.t("Views may not become dirty while they are being refreshed");

		if (view.depth in this._dirty_views) {

			this._dirty_views[view.depth].push(view);

		} else {

			this._dirty_views[view.depth] = [view];

		}

	},

	refresh: function() {

		var level = 0,
			deepness,
			views_list,
			i,
			count;

		if (Lava.Core.isProcessingEvent()) {
			Lava.logError("ViewManager::refresh() may not be manually called in event listeners");
			return;
		}

		Lava.ScopeManager.refreshScopes();

		deepness = this._dirty_views.length;

		if (deepness) {

			this._views_refreshing = true;

			for (; level < deepness; level++) {

				if (level in this._dirty_views) {

					views_list = this._dirty_views[level];

					for (i = 0, count = views_list.length; i < count; i++) {

						views_list[i].refresh();

					}

				}

			}

			this._views_refreshing = false;

			this._dirty_views = [];

		}

	},

	/**
	 * @param {Lava.view.Abstract} instance
	 */
	registerView: function(instance) {

		this._views_by_guid[instance.guid] = instance;

		if (instance.id) {

			if (instance.id in this._views_by_id) Lava.t("Duplicate view id: " + instance.id);

			if (Lava.schema.DEBUG && !Lava.isValidId(instance.id)) Lava.t(); // Element ID is either malformed or conflicts with framework id patterns

			this._views_by_id[instance.id] = instance;

		}

	},

	unregisterView: function(instance) {

		delete this._views_by_guid[instance.guid];

		if (instance.id) {

			delete this._views_by_id[instance.id];

		}

	},

	/**
	 * @param {string} id
	 * @returns {Lava.view.Abstract}
	 */
	getViewById: function(id) {

		return this._views_by_id[id];

	},

	/**
	 * @param {_tGUID} guid
	 * @returns {Lava.view.Abstract}
	 */
	getViewByGuid: function(guid) {

		return this._views_by_guid[guid];

	},

	_locateWidgetById: function(starting_widget, id) {

		if (Lava.schema.DEBUG && !id) Lava.t();

		return this._views_by_id[id];

	},

	_locateWidgetByGuid: function(starting_widget, guid) {

		if (Lava.schema.DEBUG && !guid) Lava.t();

		return this._views_by_guid[guid];

	},

	_locateWidgetByName: function(widget, name) {

		if (Lava.schema.DEBUG && !name) Lava.t();

		while (widget && widget.name != name) {

			widget = widget.getParentWidget();

		}

		return widget;

	},

	_locateWidgetByLabel: function(widget, label) {

		if (Lava.schema.DEBUG && !label) Lava.t();

		// Targets are different from view locators, there must be no hardcoded '@widget' label, like in views
		// (it may be very harmful. Use widget names instead!)

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
	 * @param {Lava.widget.Standard} starting_widget
	 * @param {string} locator_type
	 * @param {string} locator
	 * @returns {Lava.widget.Standard}
	 */
	locateTarget: function(starting_widget, locator_type, locator) {

		return this['_locateWidgetBy' + locator_type](starting_widget, locator);

	},

	/**
	 * Warning! Violates codestyle with multiple return statements.
	 *
	 * @param {Lava.view.Abstract} view
	 * @param {Array.<_cTarget>} targets
	 * @param {function} callback
	 * @param {*} callback_arguments
	 * @param {Object.<string, Array>} global_targets_object
	 */
	_dispatchCallback: function(view, targets, callback, callback_arguments, global_targets_object) {

		var i = 0,
			count = targets.length,
			target,
			target_name,
			widget,
			template_arguments,
			bubble_index = 0,
			bubble_targets_count;

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

					Lava.logError('ViewManager: callback target (widget) not found');

				} else if (!widget.isWidget) {

					Lava.logError('ViewManager: callback target is not a widget');

				} else if (!callback(widget, target_name, view, template_arguments, callback_arguments)) {

					Lava.logError('ViewManager: targeted widget did not handle the role or event: ' + target_name);

				}

			} else {

				// bubble
				widget = view.getWidget();

				do {

					callback(widget, target_name, view, template_arguments, callback_arguments);

					if (this._cancel_bubble) {
						return;
					}

					widget = widget.getParentWidget();

				} while (widget);

				if (target_name in global_targets_object) {

					for (bubble_targets_count = global_targets_object[target_name].length; bubble_index < bubble_targets_count; bubble_index++) {

						callback(
							global_targets_object[target_name][bubble_index],
							target_name,
							view,
							template_arguments,
							callback_arguments
						);

						if (this._cancel_bubble) {
							return;
						}

					}

				}

			}

		}

	},

	_callRegisterViewInRole: function(widget, target_name, view, template_arguments) {

		return widget.handleRole(target_name, view, template_arguments);

	},

	/**
	 * @param {Lava.view.Abstract} view
	 * @param {Array.<_cTarget>} targets
	 */
	dispatchRoles: function(view, targets) {

		this._cancel_bubble = false;
		this._is_bubble_cancellable = true; // there may be nested widgets of the same type (example: hierarchical menu items)

		this._dispatchCallback(view, targets, this._callRegisterViewInRole, null, this._global_role_targets);

	},

	_callHandleEvent: function(widget, target_name, view, template_arguments, callback_arguments) {

		return widget.handleEvent(
			callback_arguments.dom_event_name,
			callback_arguments.dom_event,
			target_name,
			view,
			template_arguments
		);

	},

	/**
	 * @param {Lava.view.Abstract} view
	 * @param {string} event_name
	 * @param dom_event
	 */
	_dispatchViewEvents: function(view, event_name, dom_event) {

		var targets = view.getContainer().getEventTargets(event_name);

		if (targets) {

			this._is_bubble_cancellable = true;
			this._cancel_bubble = false;

			this._dispatchCallback(
				view,
				targets,
				this._callHandleEvent,
				{
					dom_event_name: event_name,
					dom_event: dom_event
				},
				this._global_event_targets
			);

		}

	},

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
	 * @param {Lava.view.Abstract} starting_view
	 * @param {_cInclude} config
	 * @returns {_tTemplate}
	 */
	getInclude: function(starting_view, config) {

		var widget = starting_view.getWidget(),
			template_arguments = ('arguments' in config) ? this._evalTargetArguments(starting_view, config) : null;

		if ('locator_type' in config) {

			widget = this['_locateWidgetBy' + config.locator_type](widget, config.locator);

			if (!widget || !widget.isWidget) Lava.t();

		}

		return widget.getInclude(config.name, template_arguments);

	},

	addGlobalEventTarget: function(callback_name, widget) {

		this._addTarget(this._global_event_targets, callback_name, widget);

	},

	removeGlobalEventTarget: function(callback_name, widget) {

		this._removeTarget(this._global_event_targets, callback_name, widget);

	},

	addGlobalRoleTarget: function(callback_name, widget) {

		this._addTarget(this._global_role_targets, callback_name, widget);

	},

	removeGlobalRoleTarget: function(callback_name, widget) {

		this._removeTarget(this._global_role_targets, callback_name, widget);

	},

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

	_removeTarget: function(storage, name, widget) {

		if (!(name in storage)) Lava.t("Trying to remove a global event target for nonexistent event");

		var index = storage[name].indexOf(widget);

		if (index !== -1) {

			storage[name].splice(index, 1);

		}

	},

	/**
	 * @param element
	 * @returns {Lava.view.Abstract}
	 */
	getViewByElement: function(element) {

		var id = Firestorm.Element.getProperty(element, 'id'),
			result = null;

		if (id) {

			if (id.indexOf(Lava.ELEMENT_ID_PREFIX) == 0) {

				result = this.getViewByGuid(id.substr(Lava.ELEMENT_ID_PREFIX.length));

			}

		}

		return result;

	},

	getViewsByLabel: function(label) {

		var result = [];

		for (var guid in this._views_by_guid) {

			if (this._views_by_guid[guid].label == label) {

				result.push(this._views_by_guid[guid]);

			}

		}

		return result;

	},

	handleMouseMovement:  function(event_name, event_object) {

		var new_mouseover_target = (event_name == 'mouseover') ? event_object.target : event_object.relatedTarget,
			new_mouseover_view_stack = [],
			new_mouseover_element_stack,
			view,
			container,
			i,
			count;

		this._is_bubble_cancellable = false;

		if (this._new_mouseover_target !== new_mouseover_target) {

			if (this._hasListeners('mouseover_stack_changed')) {

				new_mouseover_element_stack = new_mouseover_target ? this._buildElementStack(new_mouseover_target) : [];
				// Warning! You must not modify this array!
				this._fire('mouseover_stack_changed', new_mouseover_element_stack);

			}

			if (new_mouseover_target) {

				// moved from one element to another or entered the window
				view = this._findNearestView(new_mouseover_target);

				while (view) {

					container = view.getContainer();

					if (container.isElementContainer) {

						new_mouseover_view_stack.push(view);

					}

					view = view.getParentWithContainer();

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

					this._dispatchViewEvents(this._old_mouseover_view_stack[i], 'mouseleave', event_object);

				}

				this._dispatchViewEvents(this._old_mouseover_view_stack[i], 'mouseout', event_object);

			}

		} else {

			for (i = 0, count = this._new_mouseover_view_stack.length; i < count; i++) {

				this._dispatchViewEvents(this._new_mouseover_view_stack[i], 'mouseover', event_object);

				if (this._old_mouseover_view_stack.indexOf(this._new_mouseover_view_stack[i]) == -1) {

					this._dispatchViewEvents(this._new_mouseover_view_stack[i], 'mouseenter', event_object);

				}

			}

		}

	},

	_buildElementStack: function(element) {

		var document_ref = window.document,
			result = [];

		while (element && element != document_ref) {

			result.push(element);
			element = element.parentNode;

		}

		if (Object.freeze) {
			Object.freeze(result);
		}

		return result;

	},

	_findNearestView: function(element) {

		var view,
			document_ref = window.document;

		while (!view && element && element != document_ref) {

			view = this.getViewByElement(element);

			element = element.parentNode;

		}

		return view;

	},

	onDOMEvent: function(event_name, event_object) {

		var target = event_object.target,
			view = this._findNearestView(target),
			container,
			stack_changed_event_name = event_name + '_stack_changed',
			stack;

		if (this._hasListeners(stack_changed_event_name)) {

			stack = target ? this._buildElementStack(target) : [];
			// Warning! You must not modify this array!
			this._fire(stack_changed_event_name, stack);

		}

		while (view && view.isSleeping()) {

			view = view.getParentWithContainer();

		}

		while (view) {

			container = view.getContainer();

			if (container.isElementContainer) {

				if (container.getEventTargets(event_name)) {

					this._dispatchViewEvents(view, event_name, event_object);
					if (this._cancel_bubble) {
						break;
					}

				}

			}

			view = view.getParentWithContainer();

		}

	},

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
	 * @param {Lava.widget.Standard} widget
	 * @param {Object.<string, Array.<_cTarget>>} targets
	 */
	dispatchBroadcast: function(widget, targets) {

		var event_name,
			event_targets,
			target,
			destination_widget,
			template_arguments,
			i,
			count;

		for (event_name in targets) {

			event_targets = targets[event_name];

			for (i = 0, count = event_targets.length; i < count; i++) {

				target = event_targets[i];
				if (Lava.schema.DEBUG && !('locator_type' in target)) Lava.t("dispatchBroadcast: malformed target");
				template_arguments = ('arguments' in target) ? this._evalTargetArguments(widget, target) : null;
				destination_widget = this['_locateWidgetBy' + target.locator_type](widget, target.locator);
				destination_widget.registerBroadcastTarget(widget, event_name, target.name, template_arguments);

			}

		}

	},

	cancelBubble: function() {

		if (Lava.schema.DEBUG && !this._is_bubble_cancellable) Lava.t("This event is not cancellable");

		if (this._is_bubble_cancellable) {
			this._cancel_bubble = true;
		}

	},

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