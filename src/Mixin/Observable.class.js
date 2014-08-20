
Lava.define(
'Lava.mixin.Observable',
/**
 * Provides support for events
 * @lends Lava.mixin.Observable#
 */
{

	/**
	 * Indicates that this class is inherited from Observable and supports events
	 * @const
	 */
	isObservable: true,

	/**
	 * The hash of listeners for each event
	 * @type {Object.<string, Array.<_iListener>>}
	 */
	_listeners: {},

	/**
	 * Add listener for event `event_name`
	 *
	 * @param {string} event_name
	 * @param {function} fn
	 * @param {Object} context
	 * @param {*} [listener_args]
	 * @returns {_iListener}
	 */
	on: function(event_name, fn, context, listener_args) {

		return this._addListener(event_name, fn, context, listener_args, this._listeners)

	},

	/**
	 * Create the listener construct and push into the listeners array for given event name
	 *
	 * @param {string} event_name
	 * @param {function} fn
	 * @param {Object} context
	 * @param {*} listener_args
	 * @param {Object} listeners_by_event
	 * @returns {_iListener}
	 */
	_addListener: function(event_name, fn, context, listener_args, listeners_by_event) {

		var listener = {
			event_name: event_name,
			fn: fn,
			fn_original: fn,
			context: context,
			listener_args: listener_args
		};

		if (listeners_by_event[event_name] != null) {

			listeners_by_event[event_name].push(listener);

		} else {

			listeners_by_event[event_name] = [listener];

		}

		return listener;

	},

	/**
	 * Remove the given listener object from event listeners array.
	 * @param {_iListener} listener
	 */
	removeListener: function(listener) {

		this._removeListener(listener, this._listeners);

	},

	/**
	 * Perform removal of the listener construct
	 * @param {_iListener} listener
	 * @param {Object} listeners_by_event
	 */
	_removeListener: function(listener, listeners_by_event) {

		var list = listeners_by_event[listener.event_name],
			index;

		if (list) {
			index = list.indexOf(listener);
			if (index != -1) {
				list.splice(index, 1);
				if (list.length == 0) {
					listeners_by_event[listener.event_name] = null;
				}
			}
		}

	},

	/**
	 * Fire an event
	 * @param {string} event_name
	 * @param {*} [event_args]
	 */
	_fire: function(event_name, event_args) {

		if (Lava.schema.DEBUG && typeof(event_name) == "undefined") Lava.t();

		if (this._listeners[event_name] != null) {

			this._callListeners(this._listeners[event_name], event_args);

		}

	},

	/**
	 * Perform fire
	 * @param {Array} listeners
	 * @param {*} event_args
	 */
	_callListeners: function(listeners, event_args) {

		var copy = listeners.slice(), // cause they may be removed during the fire cycle
			i = 0,
			count = listeners.length,
			listener;

		for (; i < count; i++) {

			listener = copy[i];
			listener.fn.call(listener.context, this, event_args, listener.listener_args);

		}

	},

	/**
	 * Does this object have any listeners for given event, including suspended instances.
	 * @param {string} event_name
	 * @returns {boolean}
	 */
	_hasListeners: function(event_name) {

		return this._listeners[event_name] != null;

	}

});