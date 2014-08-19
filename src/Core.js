
Lava.Core = {

	// note: IE8 and below are not fully supported
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
	 */
	_event_listeners: {},
	_event_usage_counters: {},

	/**
	 * External listeners
	 * @type {Object.<string, Array.<_iListener>>}
	 */
	_event_handlers: {},

	_is_processing_event: false,

	_freeze_protected_events: ['mouseover', 'mouseout', 'mousemove'],

	/**
	 * @param {string} event_name
	 * @param {function} fn
	 * @param {Object} context
	 * @returns {_iListener}
	 */
	addGlobalHandler: function(event_name, fn, context) {

		var listener = {
				event_name: event_name,
				fn: fn,
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

	_createEventWrapper: function(event_name) {

		var self = this,
			freeze_protection = this._freeze_protected_events.indexOf(event_name) != -1;

		return function(event_object) {

			// Note: inside this wrapper 'this' will refer to window
			self._onDomEvent(event_name, event_object, freeze_protection);

		};

	},

	_initEvent: function(event_name) {

		this._event_listeners[event_name] = this._createEventWrapper(event_name);

		if ((event_name in this._dom_event_support) && this._dom_event_support[event_name].delegation) {

			Firestorm.Element.addDelegation(window, event_name, '*', this._event_listeners[event_name]);

		} else {

			Firestorm.Element.addListener(window, event_name, this._event_listeners[event_name]);

		}

	},

	_shutdownEvent: function(event_name) {

		if ((event_name in this._dom_event_support) && this._dom_event_support[event_name].delegation) {

			Firestorm.Element.removeDelegation(window, event_name, '*', this._event_listeners[event_name]);

		} else {

			Firestorm.Element.removeListener(window, event_name, this._event_listeners[event_name]);

		}

	},

	_onDomEvent: function(event_name, event_object, freeze_protection) {

		var handlers = this._event_handlers[event_name].slice(),
			i = 0,
			count = handlers.length;

		this._is_processing_event = true;

		for (; i < count; i++) {

			handlers[i].fn.call(handlers[i].context, event_name, event_object);

		}

		this._is_processing_event = false;

		if (!freeze_protection || !Lava.ScopeManager.hasInfiniteLoop()) {

			Lava.view_manager.refresh();

		}

	},

	isProcessingEvent: function() {

		return this._is_processing_event;

	}

};