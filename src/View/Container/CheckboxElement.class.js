
Lava.define(
'Lava.view.container.CheckboxElement',
/**
 * Container for checkbox input, which implements fixes for IE and other defect browsers.
 * Fires custom "compatible_changed" event for old IE
 *
 * @lends Lava.view.container.CheckboxElement#
 * @extends Lava.view.container.Element
 */
{
	Prepare: function() {

		if (Firestorm.Environment.browser_name == 'ie') {

			this.init = this.init_IE;
			this.informInDOM = this.informInDOM_IE;
			this.informRemove = this.informRemove_IE;
			/**
			 * When running inside IE: bound "click" event handler
			 * @type {function}
			 */
			this._IE_click_callback = null;

		}

	},

	Extends: "Lava.view.container.Element",

	/**
	 * Constructor for IE environment
	 *
	 * @param view
	 * @param config
	 * @param widget
	 */
	init_IE: function(view, config, widget) {

		this.Element$init(view, config, widget);

		var self = this;

		this._IE_click_callback = function() {
			if (self._events['compatible_changed']) {
				self._view.dispatchEvents(self._events['compatible_changed']);
			}
		};

	},

	/**
	 * IE version of `informInDOM` - applies IE fixes.
	 * IE 10, 11 and maybe other versions don't fire "change" when indeterminate state is cleared
	 */
	informInDOM_IE: function() {

		this.Element$informInDOM();

		var input_element = this.getDOMElement();
		Firestorm.Element.addListener(input_element, "click", this._IE_click_callback);

	},

	/**
	 * IE version of `informRemove` - clears IE fixes
	 */
	informRemove_IE: function() {

		var input_element = this.getDOMElement();
		Firestorm.Element.removeListener(input_element, "click", this._IE_click_callback);

		this.Element$informRemove();

	},

	storeProperty: function(name, value) {

		if (Lava.schema.DEBUG && name == 'type' && ['checkbox', 'radio'].indexOf(value) == -1) Lava.t("You must not change type of checkbox or radio inputs into other types (cause they have different container class)");
		this.Element$storeProperty(name, value);

	}

});