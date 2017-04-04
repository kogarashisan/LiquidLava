
(function(lava) {

	/**
	 * A listener class, returned from {@link Lava.mixin.Observable#on} and {@link Lava.mixin.Properties#onPropertyChanged} methods.
	 * @param {string} event_name Name of the event, to which it listens
	 * @param {function} fn The method of `context`, which will be called when listener fires
	 * @param {object} context Object, from which the `callback` is called
	 * @param {*} static_args
	 * @constructor
	 */
	var Listener = function(event_name, fn, context, static_args) {

		// otherwise, listener will be called on window object
		if (Lava.schema.DEBUG && (!fn || !context)) Lava.t('Listener was created without callback or context');

		this.event_name = event_name;
		this.fn
			= this._fn
			= fn;
		this.context = context;
		this.listener_args = static_args;

	};

	/**
	 * Run the `callback` from `context`. This method should not be called directly
	 * @param caller
	 * @param event_args
	 */
	Listener.prototype.fire = function(caller, event_args) {

		this.fn.call(this.context, caller, event_args, this.listener_args);

	};

	/**
	 * Suspend this listener. Suspended listener does nothing when `fire`'d.
	 */
	Listener.prototype.suspend = function() {

		this.fn = lava.noop;

	};

	/**
	 * Resume suspended listener
	 */
	Listener.prototype.resume = function() {

		this.fn = this._fn;

	};

	// note: there is no 'remove()' method inside the listener,
	// cause we will need to save listener's context in a property.
	// It may either slow down script execution or lead to memory leaks.

	lava.Listener = Listener;

})(Lava);
