
Lava.define(
'Lava.system.App',
/**
 * @lends Lava.system.App#
 */
{

	Implements: 'Lava.mixin.Observable',

	_modules: {},

	_getmodule_recursion_protection: [],

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

	fireGlobalEvent: function(event_name, event_args) {

		this._fire(event_name, event_args);

	}

});