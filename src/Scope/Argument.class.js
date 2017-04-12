
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
 * @extends Lava.scope.ArgumentCommonMixin
 * @implements _iValueContainer
 */
{

	Extends: 'Lava.mixin.Refreshable',
	Implements: ['Lava.scope.ArgumentCommonMixin'],

	/**
	 * Sign that this instance implements {@link _iValueContainer}
	 * @type {boolean}
	 * @readonly
	 */
	isValueContainer: true,
	/**
	 * Global unique identifier
	 * @type {_tGUID}
	 */
	guid: 0,
	/**
	 * Scopes that provide operands for the `_evaluator`
	 * @type {Array.<_iValueContainer>}
	 */
	_binds: [],
	/**
	 * Listeners for scope's <str>"changed"</str> events
	 * @type {Array.<_tListener>}
	 */
	_bind_changed_listeners: [],

	/**
	 * Create an Argument instance. Acquire binds, find modifier sources, apply correct state
	 * @param {_cArgument} config
	 * @param {Lava.view.Abstract} view Argument's view
	 */
	init: function(config, view) {

		this.guid = Lava.guid++;
		this._view = view;
		this._evaluator = config.evaluator;

		var widget = view.getWidget(),
			i = 0,
			count,
			bind,
			binds = config.binds,
			target;

		if (binds) {

			for (count = binds.length; i < count; i++) {

				if (binds[i].isDynamic) {

					bind = view.locateViewByPathConfig(binds[i]).getDynamicScope(view, binds[i]);

				} else {

					bind = view.getScopeByPathConfig(binds[i]);

				}

				this._binds.push(bind);
				this._bind_changed_listeners.push(bind.on('changed', this.onBindingChanged, this));

				if (this.level < bind.level) {

					this.level = bind.level;

				}

			}

			this.level++;

		}

		if ('targets' in config) {

			for (i = 0, count = config.targets.length; i < count; i++) {

				target = widget.locateViewByPathConfig(config.targets[i]);
				if (Lava.schema.DEBUG && !target) Lava.t("Widget not found: " + config.targets[i].locator_type + "=" + config.targets[i].locator);
				if (Lava.schema.DEBUG && !target.isWidget) Lava.t("Tried to call something from non-widget view");
				this._targets.push(target);

			}

		}

		this._value = this._evaluate();

	},

	/**
	 * One of evaluator's operands has changed. Instance is now dirty
	 */
	onBindingChanged: function() {

		this._queueForRefresh();

	},

	/**
	 * Execute `_evaluator` and return
	 * @returns {*} The Argument's result
	 */
	_evaluate: function() {

		var result = null;

		try {

			result = this._evaluator();

		} catch (e) {

			Lava.logException(e);

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
	 * Return value from a scope, used by `evaluator`
	 * @param {number} index
	 * @returns {*}
	 */
	_evalBind: function(index) {

		return this._binds[index].getValue();

	},

	/**
	 * Throws error, as Argument does not support events
	 */
	_callEvent: function() {

		Lava.t("Argument must not be used to dispatch events!");

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		for (var i = 0, count = this._bind_changed_listeners.length; i < count; i++) {

			this._binds[i].removeListener(this._bind_changed_listeners[i]);

		}

		this._bind_changed_listeners = null;
		this.suspendRefreshable();

	}

});