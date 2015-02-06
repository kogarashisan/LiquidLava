/**
 * Listens to DOM events and provides them to framework
 */
Lava.Core = {

	/**
	 * Map of events that require special support from Core
	 * Note: IE8 and below are not fully supported
	 * @type {Object.<string, Object>}
	 */
	_dom_event_support: {
		focus: {delegation: true},
		blur: {delegation: true},
		change: {delegation: true},
		reset: {delegation: true},
		select: {delegation: true},
		submit: {delegation: true},
		paste: {delegation: true},
		input: {delegation: true}
	},

	/**
	 * Core's own handlers, which then call attached listeners
	 * @type {Object.<string, function>}
	 */
	_event_listeners: {},
	/**
	 * Event listeners are attached only once to the window, and released when they are not needed anymore
	 * @type {Object.<string, number>}
	 */
	_event_usage_counters: {},

	/**
	 * Framework listeners
	 * @type {Object.<string, Array.<_tListener>>}
	 */
	_event_handlers: {},

	/**
	 * Incremented at the beginning of Core's DOM event listener and decremented at the end.
	 * Used to delay refresh of views until the end of event processing.
	 *
	 * @type {number}
	 */
	_nested_handlers_count: 0,

	/**
	 * In case of infinite loops in scope layer, there may be lags, when processing mousemove and other frequent events
	 * @type {Array.<string>}
	 */
	_freeze_protected_events: ['mouseover', 'mouseout', 'mousemove'],

	/**
	 * Add a listener for DOM event. Similar to {@link Lava.mixin.Observable#on}
	 * @param {string} event_name Name of DOM event
	 * @param {function} fn Callback
	 * @param {Object} context Callback owner
	 * @returns {_tListener} The listener structure, similar to {@link Lava.mixin.Observable#on} result
	 */
	addGlobalHandler: function(event_name, fn, context) {

		var listener = {
				event_name: event_name,
				fn: fn,
				fn_original: fn,
				context: context
			};

		if (this._event_usage_counters[event_name]) {

			this._event_usage_counters[event_name]++;
			this._event_handlers[event_name].push(listener);

		} else {

			this._event_usage_counters[event_name] = 1;
			this._event_handlers[event_name] = [listener];
			this._initEvent(event_name);

		}

		return listener;

	},

	/**
	 * Release the listener, acquired via call to {@link Lava.Core#addGlobalHandler}
	 * @param {_tListener} listener Listener structure
	 */
	removeGlobalHandler: function(listener) {

		var event_name = listener.event_name,
			index = this._event_handlers[event_name].indexOf(listener);
		if (Lava.schema.DEBUG && index == -1) Lava.t();
		this._event_handlers[event_name].splice(index, 1);

		this._event_usage_counters[event_name]--;

		if (this._event_usage_counters[event_name] == 0) {

			this._shutdownEvent(event_name);

		}

	},

	/**
	 * Used to bind `_onDomEvent` to Core instance
	 * @param {string} event_name DOM event name
	 * @returns {Function}
	 */
	_createEventWrapper: function(event_name) {

		var self = this,
			freeze_protection = this._freeze_protected_events.indexOf(event_name) != -1;

		// I'm not sure about this, but looks like the argument should be specifically named "event"
		// http://stackoverflow.com/questions/11188729/jquery-keyup-event-trouble-in-opera
		// see also this to understand the roots of such behaviour:
		// http://stackoverflow.com/questions/4968194/event-keyword-in-js
		return (Firestorm.Environment.browser_name == 'ie') ? function(event) {

			// IE bug: there can be fractional values for coordinates
			if ('x' in event.page) {
				event.page.x = Math.floor(event.page.x);
				event.page.y = Math.floor(event.page.y);
				event.client.x = Math.floor(event.client.x);
				event.client.y = Math.floor(event.client.y);
			}

			self._onDomEvent(event_name, event, freeze_protection);

		} : function(event) {

			self._onDomEvent(event_name, event, freeze_protection);

		};

	},

	/**
	 * Attach a listener to window object, start listening to the event
	 * @param {string} event_name DOM event name
	 */
	_initEvent: function(event_name) {

		this._event_listeners[event_name] = this._createEventWrapper(event_name);

		if ((event_name in this._dom_event_support) && this._dom_event_support[event_name].delegation) {

			Firestorm.Element.addDelegation(window, event_name, '*', this._event_listeners[event_name]);

		} else {

			Firestorm.Element.addListener(window, event_name, this._event_listeners[event_name]);

		}

	},

	/**
	 * Stop listening to DOM event
	 * @param {string} event_name DOM event name
	 */
	_shutdownEvent: function(event_name) {

		if ((event_name in this._dom_event_support) && this._dom_event_support[event_name].delegation) {

			Firestorm.Element.removeDelegation(window, event_name, '*', this._event_listeners[event_name]);

		} else {

			Firestorm.Element.removeListener(window, event_name, this._event_listeners[event_name]);

		}

	},

	/**
	 * Actual listener for DOM events. Calls framework listeners, attached via {@link Lava.Core#addGlobalHandler}
	 * @param {string} event_name DOM event name
	 * @param {Object} event_object Event object, returned by low-level framework
	 * @param {boolean} freeze_protection Is this a frequent event, which may cause lags
	 */
	_onDomEvent: function(event_name, event_object, freeze_protection) {

		// slice, cause handlers may be removed while they are called
		var handlers = this._event_handlers[event_name].slice(),
			i = 0,
			count = handlers.length;

		// unfortunately, browser can raise an event inside another event.
		// Example test case:
		// {$if(is_visible)}
		// 		<button x:click="remove_me">click me</button>
		// {/if}
		// Click handler should set `is_visible` to false, so the button is removed.
		// Button element will be removed from DOM inside click handler, in view_manager.refresh()
		// At the moment of removal, browser fires focusout event. Each event ends with view_manager.refresh(),
		// which will also try to remove the button.
		// Read more here:
		// for understanding, see http://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node
		this._nested_handlers_count++;

		for (; i < count; i++) {

			handlers[i].fn.call(handlers[i].context, event_name, event_object);

		}

		this._nested_handlers_count--;

		if (
			this._nested_handlers_count == 0
			&& !Lava.view_manager.isRefreshing()
			&& (!freeze_protection || !Lava.ScopeManager.hasInfiniteLoop())
		) {

			Lava.view_manager.refresh();

		}

	},

	/**
	 * Return <kw>true</kw>, if `_nested_handlers_count > 0`
	 * @returns {boolean} True, if Core is in the process of calling framework listeners
	 */
	isProcessingEvent: function() {

		return this._nested_handlers_count > 0;

	}

};