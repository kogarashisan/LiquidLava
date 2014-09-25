
/**
 * Argument's value has changed
 * @event Lava.scope.Argument#changed
 * @type {Object}
 * @property {*} old_value Optional: old value of the argument
 */

Lava.define(
'Lava.scope.Argument',
/**
 * Evaluates expression in context of it's view
 *
 * @lends Lava.scope.Argument#
 * @extends Lava.mixin.Refreshable
 * @implements _iValueContainer
 */
{

	Extends: 'Lava.mixin.Refreshable',
	/**
	 * Sign that this instance implements {@link _iValueContainer}
	 * @type {boolean}
	 * @const
	 */
	isValueContainer: true,

	/**
	 * Owner view
	 * @type {Lava.view.Abstract}
	 */
	_view: null,
	/**
	 * Nearest widget in hierarchy
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,
	/**
	 * Generated method that is called in context of Argument instance and produces the argument's result
	 * @type {function}
	 */
	_evaluator: null,
	/**
	 * The result of `_evaluator` call
	 * @type {*}
	 */
	_value: null,
	/**
	 * Global unique identifier
	 * @type {_tGUID}
	 */
	guid: null,

	/**
	 * Scopes that provide operands for the `_evaluator`
	 * @type {Array.<_iValueContainer>}
	 */
	_binds: [],
	/**
	 * Length of `_binds` array
	 * @type {number}
	 */
	_binds_count: 0,
	/**
	 * objects with listeners for {@link Lava.mixin.Refreshable#event:waits_refresh}, {@link Lava.mixin.Refreshable#event:refreshed}
	 * and <str>"changed"</str> events
	 * @type {Array.<Object>}
	 */
	_bind_listeners: [],

	/**
	 * Objects with a reference to modifier's widget (it's cached to speed up calling) and modifier name
	 * @type {Array.<Object>}
	 */
	_modifiers: [],
	/**
	 * Alpha version. Not used
	 */
	_active_modifiers: [],

	/**
	 * Create an Argument instance. Acquire binds, find modifier sources, apply correct state
	 * @param {_cArgument} config
	 * @param {Lava.view.Abstract} view Argument's view
	 * @param {Lava.widget.Standard} widget Nearest widget in hierarchy
	 */
	init: function(config, view, widget) {

		this.guid = Lava.guid++;
		this._view = view;
		this._widget = widget;
		this._evaluator = config.evaluator;

		var i = 0,
			count,
			bind,
			first_level = 0,
			binds = config.binds;

		if (binds) {

			for (count = binds.length; i < count; i++) {

				if (binds[i].isDynamic) {

					bind = view.locateViewByPathConfig(binds[i]).getDynamicScope(view, binds[i]);

				} else {

					bind = view.getScopeByPathConfig(binds[i]);

				}

				if (bind.isWaitingRefresh()) {
					this._count_dependencies_waiting_refresh++;
					this._waits_refresh = true;
				}
				this._binds.push(bind);
				this._bind_listeners.push({
					waits_refresh: bind.on('waits_refresh', this._onDependencyWaitsRefresh, this),
					changed: bind.on('changed', this.onBindingChanged, this),
					refreshed: bind.on('refreshed', this._onDependencyRefreshed, this)
				});

				if (this.level < bind.level) {

					this.level = bind.level;

				}

				if (first_level != bind.level) {

					if (i == 0) {

						first_level = bind.level; // replace default

					} else {

						this._requeue = true;

					}

				}

			}

		}

		if ('modifiers' in config) {

			for (i = 0, count = config.modifiers.length; i < count; i++) {

				this._modifiers.push({
					widget: this.getWidgetByModifierConfig(config.modifiers[i]),
					callback_name: config.modifiers[i].callback_name
				});

			}

		}

		/*if ('active_modifiers' in config) {

			for (i = 0, count = config.active_modifiers.length; i < count; i++) {

				this._active_modifiers.push({
					widget: this.getWidgetByModifierConfig(config.active_modifiers[i]),
					callback_name: config.active_modifiers[i].callback_name
				});

			}

		}*/

		this._binds_count = this._binds.length;
		this._value = this._evaluate();

	},

	/**
	 * Get widget, that will be used to call a modifier
	 * @param {_cKnownViewLocator} path_config Route to the widget
	 * @returns {Lava.widget.Standard}
	 */
	getWidgetByModifierConfig: function(path_config) {

		var widget = this._widget.locateViewByPathConfig(path_config);

		if (Lava.schema.DEBUG && !widget.isWidget) Lava.t("Tried to call a modifier from non-widget view");

		return /** @type {Lava.widget.Standard} */ widget;

	},

	/**
	 * One of evaluator's operands has changed. Instance is now dirty
	 */
	onBindingChanged: function() {

		// Classes that can serve as a binding: PropertyBinding, DataBinding and Segment. They all will fire 'changed'
		// event only during the refresh cycle, so at this moment the Argument must be already in queue.
		if (!this._waits_refresh) Lava.t();

		this._is_dirty = true;

	},

	/**
	 * Execute `_evaluator` and return
	 * @returns {*} The Argument's result
	 */
	_evaluate: function() {

		var result = null;

		// in production - wrap evaluation into try/catch block
		if (Lava.schema.DEBUG) {

			result = this._evaluator();

		} else {

			try {

				result = this._evaluator();

			} catch (e) {

				Lava.logException(e);

			}

		}

		return result;

	},

	/**
	 * Get `_value`
	 * @returns {*}
	 */
	getValue: function() {

		return this._value;

	},

	/**
	 * Refresh `_value` and fire {@link Lava.scope.Argument#event:changed}
	 * @private
	 */
	_doRefresh: function() {

		var new_value = this._evaluate(),
			event_args;

		if (new_value !== this._value) {

			event_args = {old_value: this._value};
			this._value = new_value;
			this._fire('changed', event_args);

		}

	},

	/**
	 * Call a modifier from widget
	 * @param {number} index
	 * @param {?Array.<*>} arguments_array
	 * @returns {*}
	 */
	_callModifier: function(index, arguments_array) {

		return this._modifiers[index].widget.callModifier(this._modifiers[index].callback_name, arguments_array);

	},

	/**
	 * Alpha. Not used
	 * @param index
	 * @param arguments_array
	 * @returns {*}
	 */
	_callActiveModifier: function(index, arguments_array) {

		return this._modifiers[index].widget.callActiveModifier(this._modifiers[index].callback_name, arguments_array);

	},

	/**
	 * Calls a global function from {@link Lava.modifiers}
	 * @param {string} name The function's name
	 * @param {?Array.<*>} arguments_array Evaluator's arguments
	 * @returns {*}
	 */
	_callGlobalModifier: function(name, arguments_array) {

		if (Lava.schema.DEBUG && !(name in Lava.modifiers)) Lava.t("Unknown global modifier: " + name);
		return Lava.modifiers[name].apply(Lava.modifiers, arguments_array);

	},

	/**
	 * Suspend argument's listeners
	 */
	sleep: function() {

		for (var i = 0, count = this._bind_listeners.length; i < count; i++) {

			Lava.suspendListener(this._bind_listeners[i].waits_refresh);
			Lava.suspendListener(this._bind_listeners[i].changed);
			Lava.suspendListener(this._bind_listeners[i].refreshed);

		}

		this.suspendRefreshable();

	},

	/**
	 * Resume argument's listeners and refresh state
	 * @param {boolean} fire_changed Whether to fire the <str>"changed"</str> event
	 */
	wakeup: function(fire_changed) {

		var i = 0,
			count = this._bind_listeners.length,
			new_value,
			event_args;

		for (; i < count; i++) {

			if (this._binds[i].isWaitingRefresh()) {

				this._count_dependencies_waiting_refresh++;

			}

			Lava.resumeListener(this._bind_listeners[i].waits_refresh);
			Lava.resumeListener(this._bind_listeners[i].changed);
			Lava.resumeListener(this._bind_listeners[i].refreshed);

		}

		if (this._count_dependencies_waiting_refresh) {

			this._waits_refresh = true;
			this._is_dirty = true;

		} else {

			new_value = this._evaluate();

			if (new_value !== this._value) {

				event_args = {old_value: this._value};
				this._value = new_value;

				if (fire_changed) {

					this._fire('changed', event_args);

				}

			}

			this._is_dirty = false;

		}

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		for (var i = 0, count = this._bind_listeners.length; i < count; i++) {

			this._binds[i].removeListener(this._bind_listeners[i].waits_refresh);
			this._binds[i].removeListener(this._bind_listeners[i].changed);
			this._binds[i].removeListener(this._bind_listeners[i].refreshed);

		}

		this._bind_listeners = null;
		this.suspendRefreshable();

	}

});