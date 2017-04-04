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
	 * Listeners from {@link Lava.DOMEvents} for each DOM event
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
    scheduleRefresh: function() {

        if (!this._refresh_timeout) {
            var self = this;
            this._refresh_timeout = window.setTimeout(function() {
                self._refresh_timeout = null;
                self.refresh();
            }, 0);
        }

    },

	/**
	 * View refresh cycle. Call {@link Lava.view.Abstract#refresh} of all views in the queue, starting from the root views
	 */
	refresh: function() {

		if (Lava.DOMEvents.isProcessingEvent()) {
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

		var result = true;

		try {

			result = widget.handleRole(target_name, view, template_arguments);

		} catch (e) {

			Lava.logException(e);

		}

		return result;

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

		var result = true;

		try {

			result = widget.handleEvent(
				callback_arguments.event_name,
				callback_arguments.event_object,
				target_name,
				view,
				template_arguments
			);

		} catch(e) {

			Lava.logException(e);

		}

		return result;

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
			result = [],
			template_arguments = ('arguments' in config) ? this._evalTargetArguments(starting_view, config) : null;

		if ('locator_type' in config) {

			widget = this['_locateWidgetBy' + config.locator_type](widget, config.locator);
			if (!widget || !widget.isWidget) Lava.t("getInclude: Unable to find widget with [" + config.locator_type + "=" + config.locator + "]");

		}

		try {

			result = widget.getInclude(config.name, template_arguments);

		} catch (e) {

			Lava.logException(e);

		}

		return result;

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

			this._events_listeners['mouseover'] = Lava.DOMEvents.addListener('mouseover', this.handleMouseMovement, this);
			this._events_listeners['mouseout'] = Lava.DOMEvents.addListener('mouseout', this.handleMouseMovement, this);

		} else {

			this._events_listeners[event_name] = Lava.DOMEvents.addListener(event_name, this.onDOMEvent, this);

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

			Lava.DOMEvents.removeListener(this._events_listeners['mouseover']);
			this._events_listeners['mouseover'] = null;
			Lava.DOMEvents.removeListener(this._events_listeners['mouseout']);
			this._events_listeners['mouseout'] = null;

		} else {

			Lava.DOMEvents.removeListener(this._events_listeners[event_name]);
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

				Lava.DOMEvents.removeListener(this._events_listeners[name]);
				this._events_listeners[name] = null;
				this._event_usage_counters[name] = 0;

			}

		}

	}

});