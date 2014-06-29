
Lava.define(
'Lava.mixin.Observable',
/**
 * @lends Lava.mixin.Observable#
 * @implements _iObservable
 */
{

	isObservable: true,

	// [event_name] => array_of_listeners
	_listeners: {},

	/**
	 * @param {string} event_name
	 * @param {function} fn
	 * @param {Object} [context]
	 * @param {*} [listener_args]
	 * @returns {_iListener}
	 */
	on: function(event_name, fn, context, listener_args) {

		return this._addListener(event_name, fn, context, listener_args, this._listeners)

	},

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
	 * @param {_iListener} listener
	 */
	removeListener: function(listener) {

		this._removeListener(listener, this._listeners);

	},

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
	 * @param {string} event_name
	 * @param {*} [event_args]
	 */
	_fire: function(event_name, event_args) {

		if (Lava.schema.DEBUG && typeof(event_name) == "undefined") Lava.throw();

		if (this._listeners[event_name] != null) {

			this._callListeners(this._listeners[event_name], event_args);

		}

	},

	/**
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
	 * Does it have any listeners for given event, including suspended instances.
	 * @param {string} event_name
	 * @returns {boolean}
	 */
	_hasListeners: function(event_name) {

		return this._listeners[event_name] != null;

	}

});