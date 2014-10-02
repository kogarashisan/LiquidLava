
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
	 * Get a global named module instance
	 * @param {string} name Module name
	 * @returns {Lava.data.Module}
	 */
	getModule: function(name) {

		if (!(name in this._modules)) {

			var config = Lava.schema.modules[name],
				className = config.type || Lava.schema.data.DEFAULT_MODULE_CLASS,
				constructor = Lava.ClassManager.getConstructor(className, 'Lava.data');

			// construction is split into two phases, cause initFields() may reference other modules
			// - this will result in recursive call to getModule().
			// In case of circular dependency, the first module must be already constructed.
			this._modules[name] = new constructor(this, config, name);
			this._modules[name].initFields();

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