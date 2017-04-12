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
 * Refreshes views and routes view events
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

    scheduleViewRefresh: null,

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
	 * Find first widget with `label`, starting from `widget` and ascending up the hierarchy.
	 *
	 * @param {Lava.widget.Standard} widget Starting widget
	 * @param {string} label
	 * @returns {?Lava.widget.Standard}
	 */
	_locateWidgetByLabel: function(widget, label) {

		if (Lava.schema.DEBUG && !label) Lava.t();

		// Event targets are different from view locators: there must be no hardcoded '@widget' label, like in views
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
	 * Helper method which checks for events presence on container and dispatches them
	 * @param {Lava.view.Abstract} view
	 * @param {Object} event_object
	 */
	_dispatchViewEvent: function(view, event_object) {

		var evaluator_configs = view.getContainer().getEventTargets(event_name);

		if (evaluator_configs) {

			view.dispatchEvents(evaluator_configs, event_object);

		}

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

					this._dispatchViewEvent(this._old_mouseover_view_stack[i], event_object);

				}

				this._dispatchViewEvent(this._old_mouseover_view_stack[i], event_object);

			}

		} else {

			for (i = 0, count = this._new_mouseover_view_stack.length; i < count; i++) {

				this._dispatchViewEvent(this._new_mouseover_view_stack[i], event_object);

				if (this._old_mouseover_view_stack.indexOf(this._new_mouseover_view_stack[i]) == -1) {

					this._dispatchViewEvent(this._new_mouseover_view_stack[i], event_object);

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
				if (container.isElementContainer && container.getEventTargets(event_name)) {
					view.dispatchEvents(container.getEventTargets(event_name), event_object);
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
	isEventEnabled: function(event_name) {

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