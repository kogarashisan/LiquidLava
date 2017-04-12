
Lava.define(
'Lava.scope.Evaluator',
/**
 * Similar to {@link Lava.scope.Argument} in it's functionality, but does not listen to scope changes
 * @lends Lava.scope.Evaluator#
 * @extends Lava.scope.ArgumentCommonMixin
 */
{
	Implements: ['Lava.scope.ArgumentCommonMixin'],

	/**
	 * Nearest widget in hierarchy
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,
	/**
	 * {_cArgument#binds} from evaluator's config
	 * @type {?Array.<(_cScopeLocator|_cDynamicScope)>}
	 */
	_bind_configs: null,

	/**
	 * Initialize the Evaluator instance
	 * @param {_cArgument} config
	 * @param {Lava.view.Abstract} view Argument's view
	 */
	init: function(config, view) {

		this._view = view;
		this._widget = view.getWidget();
		this._evaluator = config.evaluator;
		this._bind_configs = config.binds || null;

		var i = 0,
			count,
			target;

		if ('targets' in config) {

			for (i = 0, count = config.targets.length; i < count; i++) {

				target = this._widget.locateViewByPathConfig(config.targets[i]);
				if (Lava.schema.DEBUG && !target) Lava.t("Widget not found: " + config.targets[i].locator_type + "=" + config.targets[i].locator);
				if (Lava.schema.DEBUG && !target.isWidget) Lava.t("Tried to call something from non-widget view");
				this._targets.push(target);

			}

		}

	},

	/**
	 * Execute `_evaluator` and return
	 * @param {Firestorm.Event|*} event_object_or_event_args
	 * @returns {*} The result of expression
	 */
	evaluate: function(event_object_or_event_args) {

		var result = null;

		try {

			result = this._evaluator(event_object_or_event_args);

		} catch (e) {

			Lava.logException(e);

		}

		return result;

	},

	/**
	 * Call the event from widget
	 * @param {number} index Index of widget in `_targets`, from which we are calling the event
	 * @param {string} callback_name Name of the event to call
	 * @param {*} args Either DOM event object, or Observable's event_args
	 * @returns {boolean}
	 */
	_callEvent: function(index, callback_name, args) {

		var target = this._targets[index];
		if (Lava.schema.DEBUG && target.EVENT_HANDLERS.indexOf(callback_name) == -1) Lava.t("Method is not an allowed event in widget: " + callback_name);
		if (Lava.schema.DEBUG && !target[callback_name]) Lava.t("Trying to call nonexistent method from widget: " + callback_name);
		return target[callback_name].apply(target, args);

	},

	/**
	 * Return value from a scope, used by `evaluator`
	 * @param {number} index
	 * @returns {*}
	 */
	_evalBind: function(index) {

		var bind_config = this._bind_configs[index];

		return bind_config.isDynamic
			? this._view.locateViewByPathConfig(bind_config).getDynamicScope(this._view, bind_config).getValue()
			: this._view.evalPathConfig(bind_config);

	}

});