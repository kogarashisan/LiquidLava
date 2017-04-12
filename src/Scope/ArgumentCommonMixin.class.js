Lava.define(
"Lava.scope.ArgumentCommonMixin",
/**
 * @lends Lava.scope.ArgumentCommonMixin#
 */
{

	Class: {
		is_abstract: true
	},

	/**
	 * Owner view
	 * @type {Lava.view.Abstract}
	 */
	_view: null,
	/**
	 * Generated method that is called in context of Argument/Evaluator instance, which calculates the result
	 * @type {function}
	 */
	_evaluator: null,
	/**
	 * Saved references to widgets, used by `_evaluator` function
	 * @type {Array.<Lava.widget.Standard>}
	 */
	_targets: [],

	/**
	 * Call a modifier from widget
	 * @param {number} index The index of referenced widget in `_targets`
	 * @param {string} callback_name
	 * @param {?Array.<*>} arguments_array
	 * @returns {*}
	 */
	_callModifier: function(index, callback_name, arguments_array) {

		var target = this._targets[index];
		if (Lava.schema.DEBUG && target.TEMPLATE_METHODS.indexOf(callback_name) == -1) Lava.t("Method is not allowed in TEMPLATE_METHODS: " + callback_name);
		if (Lava.schema.DEBUG && !target[callback_name]) Lava.t("Trying to call nonexistent method from widget: " + callback_name);
		return target[callback_name].apply(target, arguments_array);

	}

	/**
	 * Reserved for future functionality
	 * @param {string} callback_name The function's name
	 * @param {?Array.<*>} arguments_array Evaluator's arguments
	 * @returns {*}
	 */
	/*_callGlobalModifier: function(callback_name, arguments_array) {

		if (Lava.schema.DEBUG && !(name in Lava.modifiers)) Lava.t("Unknown global modifier: " + name);
		return Lava.modifiers[name].apply(Lava.modifiers, arguments_array);

	},*/

});