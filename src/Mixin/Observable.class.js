
Lava.define(
'Lava.mixin.Observable',
/**
 * Provides support for events
 * @lends Lava.mixin.Observable#
 */
{

	/**
	 * Indicates that this class is inherited from Observable and supports events
	 * @readonly
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

		// otherwise, listener would be called on window object
		if (Lava.schema.DEBUG && !context) Lava.t('Listener was created without a context');

		// note 1: member count for a plain object like this must not exceed 8
		// otherwise, chrome will slow down greatly (!)
		// note 2: there is no 'remove()' method inside the listener, cause depending on implementation,
		// it may either slow down script execution or lead to memory leaks
		var listener = {
			event_name: event_name,
			fn: fn,
			_fn: fn,
			context: context,
			listener_args: listener_args
		};

		if (this._listeners[event_name] != null) {

			this._listeners[event_name].push(listener);

		} else {

			this._listeners[event_name] = [listener];

		}

		return listener;

	},

    once: function(event_name, fn, context, listener_args) {

		var listener,
			callback = function(self, event_args, listener_args) {
				fn.call(context, self, event_args, listener_args);
				self.removeListener(listener);
			};

		listener = this.on(event_name, callback, context, listener_args);
		return listener;

    },

	/**
	 * Remove the given listener object from event listeners array
	 * @param {_tListener} listener Structure, which was returned by {@link Lava.mixin.Observable#on} method
	 */
	removeListener: function(listener) {

		var list = this._listeners[listener.event_name],
			index;

		if (list) {
			index = list.indexOf(listener);
			if (index != -1) {
				list.splice(index, 1);
				if (list.length == 0) {
					this._listeners[listener.event_name] = null;
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

		if (this._listeners[event_name]) {

			var copy = this._listeners[event_name].slice(), // cause they may be removed during the fire cycle
				i = 0,
				count = copy.length,
				listener;

			for (; i < count; i++) {

				listener = copy[i];
				listener.fn.call(listener.context, this, event_args, listener.listener_args);

			}

		}

	},

	/**
	 * Remove all listeners, which belong to `context`
	 * @param {object} context
	 */
    removeAllListenersByContext: function (context) {

        for (var event_name in this._listeners) {

            this.removeListenersByContext(event_name, context);

        }

    },

	/**
	 * Remove all listeners to `event_name`, which belong to `context`
	 * @param {string} event_name
	 * @param {object} context
	 */
    removeListenersByContext: function (event_name, context) {

        var listeners = this._listeners[event_name];
        if (listeners) {
            var result = [];
            for (var i = 0, count = listeners.length; i < count; i++) {
                if (listeners[i].context != context) {
                    result.push(listeners[i]);
                }
            }
            this._listeners[event_name] = result.length ? result : null;
        }

    }

});