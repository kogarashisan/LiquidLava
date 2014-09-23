
Lava.define(
'Lava.system.App',
/**
 * Place for user-defined business-logic
 *
 * @lends Lava.system.App#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',

	/**
	 * Global named modules
	 * @type {Object.<string, Lava.data.Module>}
	 */
	_modules: {},

	/**
	 * Debug mode variable to print a user-friendly message in case of circular dependencies in modules
	 * @type {Array.<string>}
	 */
	_getmodule_recursion_protection: [],

	/**
	 * Get a global named module instance
	 * @param {string} name Module name
	 * @returns {Lava.data.Module}
	 */
	getModule: function(name) {

		if (!(name in this._modules)) {

			if (Lava.schema.DEBUG) {

				if (this._getmodule_recursion_protection.indexOf(name) != -1) Lava.t("Circular module dependency");
				this._getmodule_recursion_protection.push(name);

			}

			var config = Lava.schema.modules[name],
				className = config.type || Lava.schema.data.DEFAULT_MODULE_CLASS,
				constructor = Lava.ClassManager.getConstructor(className, 'Lava.data');

			this._modules[name] = new constructor(this, config, name);

			if (Lava.schema.DEBUG) {

				this._getmodule_recursion_protection.pop();

			}

		}

		return this._modules[name];

	},

	/**
	 * Allow user to fire an event from application's instance
	 * @param {string} event_name
	 * @param {*} event_args
	 */
	fireGlobalEvent: function(event_name, event_args) {

		this._fire(event_name, event_args);

	}

});