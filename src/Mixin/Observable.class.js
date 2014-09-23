
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
	 * @type {Object.<string, Array.<_tListener>>}
	 */
	_listeners: {},

	/**
	 * Add listener for event `event_name`
	 *
	 * @param {string} event_name Name of the event to listen to
	 * @param {function} fn The callback
	 * @param {Object} context The context for callback execution (an object, to which the callback belongs)
	 * @param {*} [listener_args] Static listener arguments. May be usable when one callback responds to different events
	 * @returns {_tListener} Listener structure, which later may be suspended, or removed via call to {@link Lava.mixin.Observable#removeListener}
	 */
	on: function(event_name, fn, context, listener_args) {

		return this._addListener(event_name, fn, context, listener_args, this._listeners)

	},

	/**
	 * Create the listener construct and push it into the listeners array for given event name
	 *
	 * @param {string} event_name The name of event
	 * @param {function} fn The callback
	 * @param {Object} context The owner of the callback
	 * @param {*} listener_args Static listener arguments
	 * @param {Object.<string, Array.<_tListener>>} listeners_by_event {@link Lava.mixin.Observable#_listeners} or {@link Lava.mixin.Properties#_property_listeners}
	 * @returns {_tListener} Listener structure
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
	 * Remove the given listener object from event listeners array
	 * @param {_tListener} listener Structure, which was returned by {@link Lava.mixin.Observable#on} method
	 */
	removeListener: function(listener) {

		this._removeListener(listener, this._listeners);

	},

	/**
	 * Perform removal of the listener structure
	 * @param {_tListener} listener Structure, which was returned by {@link Lava.mixin.Observable#on} method
	 * @param {Object.<string, Array.<_tListener>>} listeners_by_event {@link Lava.mixin.Observable#_listeners} or {@link Lava.mixin.Properties#_property_listeners}
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
	 * @param {string} event_name The name of event
	 * @param {*} [event_args] Dynamic event arguments. Anything, that may be needed by listener
	 */
	_fire: function(event_name, event_args) {

		if (Lava.schema.DEBUG && typeof(event_name) == "undefined") Lava.t();

		if (this._listeners[event_name] != null) {

			this._callListeners(this._listeners[event_name], event_args);

		}

	},

	/**
	 * Perform fire - call listeners of an event
	 * @param {Array.<_tListener>} listeners An array with listener structures
	 * @param {*} event_args Dynamic event arguments
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
	 * Does this object have any listeners for given event, including suspended instances
	 * @param {string} event_name The name of event
	 * @returns {boolean} True, if there are listeners
	 */
	_hasListeners: function(event_name) {

		return this._listeners[event_name] != null;

	}

});