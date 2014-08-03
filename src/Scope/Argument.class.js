
Lava.define(
'Lava.scope.Argument',
/**
 * @lends Lava.scope.Argument#
 * @extends Lava.mixin.Refreshable
 * @implements _iValueContainer
 */
{

	Extends: 'Lava.mixin.Refreshable',
	isValueContainer: true,

	/**
	 * @type {Lava.view.View}
	 */
	_view: null,
	/**
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,
	/**
	 * @type {function}
	 */
	_evaluator: null,
	_value: null,

	/**
	 * @type {Array.<_iValueContainer>}
	 */
	_binds: [],
	_binds_count: 0,
	_bind_listeners: [],

	_modifiers: [],
	_active_modifiers: [],

	/**
	 * @param {_cArgument} config
	 * @param {Lava.view.Abstract} view
	 * @param {Lava.widget.Standard} widget
	 */
	init: function(config, view, widget) {

		this._view = view;
		this._widget = widget;
		this._evaluator = config.evaluator;

		var i = 0,
			count,
			bind,
			first_level;

		if ('binds' in config) {

			for (count = config.binds.length; i < count; i++) {

				bind = view.getScopeByPathConfig(config.binds[i]);
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

				if (i == 0) {

					first_level = bind.level;

				} else if (first_level != bind.level) {

					this._requeue = true;

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
	 * @param {_cKnownViewLocator} path_config
	 * @returns {Lava.widget.Standard}
	 */
	getWidgetByModifierConfig: function(path_config) {

		var widget = this._widget.locateViewByPathConfig(path_config);

		if (Lava.schema.DEBUG && !widget.isWidget) Lava.t("Tried to call a modifier from non-widget view");

		return widget;

	},

	onBindingChanged: function() {

		// Classes that can serve as a binding: PropertyBinding, DataBinding and Segment. They all will fire 'changed'
		// event only during the refresh cycle, so at this moment the Argument must be already in queue.
		if (!this._waits_refresh) Lava.t();

		this._is_dirty = true;

	},

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

	getValue: function() {

		return this._value;

	},

	_doRefresh: function() {

		var newValue = this._evaluate(),
			event_args;

		if (newValue !== this._value) {

			event_args = {old_value: this._value};
			this._value = newValue;
			this._fire('changed', event_args);

		}

	},

	_callModifier: function(index, arguments_array) {

		return this._modifiers[index].widget.callModifier(this._modifiers[index].callback_name, arguments_array);

	},

	_callActiveModifier: function(index, arguments_array) {

		return this._modifiers[index].widget.callActiveModifier(this._modifiers[index].callback_name, arguments_array);

	},

	_callGlobalModifier: function(name, arguments_array) {

		if (Lava.schema.DEBUG && !(name in Lava.modifiers)) Lava.t("Unknown global modifier: " + name);
		return Lava.modifiers[name].apply(Lava.modifiers, arguments_array);

	},

	sleep: function() {

		for (var i = 0, count = this._bind_listeners.length; i < count; i++) {

			Lava.suspendListener(this._bind_listeners[i].waits_refresh);
			Lava.suspendListener(this._bind_listeners[i].changed);
			Lava.suspendListener(this._bind_listeners[i].refreshed);

		}

		this.destroyRefreshable();

	},

	wakeup: function(fire_changed) {

		for (var i = 0, count = this._bind_listeners.length; i < count; i++) {

			if (this._binds[i].isWaitingRefresh()) {

				//this._count_dependencies_waiting_refresh++;
				Lava.t();

			}

			Lava.resumeListener(this._bind_listeners[i].waits_refresh);
			Lava.resumeListener(this._bind_listeners[i].changed);
			Lava.resumeListener(this._bind_listeners[i].refreshed);

		}

		//if (this._count_dependencies_waiting_refresh) {

		//	this._waits_refresh = true;

		//} else {

			var newValue = this._evaluate();

			if (newValue !== this._value) {

				this._value = newValue;

				if (fire_changed) {

					this._fire('changed');

				}

			}

			this._is_dirty = false;

		//}

	},

	destroy: function() {

		for (var i = 0, count = this._bind_listeners.length; i < count; i++) {

			this._binds[i].removeListener(this._bind_listeners[i].waits_refresh);
			this._binds[i].removeListener(this._bind_listeners[i].changed);
			this._binds[i].removeListener(this._bind_listeners[i].refreshed);

		}

		this._bind_listeners = null;
		this.destroyRefreshable();

	}

});