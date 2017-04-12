
Lava.define(
'Lava.view.container.TextInputElement',
/**
 * Container for "text" and "password" inputs, which implements fixes for IE and other defect browsers.
 * Fires custom ViewManager event "compatible_changed".
 *
 * @lends Lava.view.container.TextInputElement#
 * @extends Lava.view.container.Element#
 */
{
	Extends: "Lava.view.container.Element",

	Prepare: function() {

		if (Firestorm.Environment.capabilities[Firestorm.CAPABILITY_NAMES.NEEDS_INPUT_EVENT_SHIM]) {

			this.init = this.init_IE;
			this.informInDOM = this.informInDOM_OldIE;
			this.informRemove = this.informRemove_OldIE;
			/**
			 * For IE8-9: input element listener callback, bound to this instance
			 * @type {function}
			 */
			this._OldIE_refresh_callback = null;
			/**
			 * For IE8-9: `onpropertychange` callback, bound to this instance
			 * @type {function}
			 */
			this._OldIE_property_change_callback = null;

		}

	},

	/**
	 * Constructor for IE environment
	 *
	 * @param {Lava.view.Abstract} view
	 * @param {_cElementContainer} config
	 * @param {Lava.widget.Standard} widget
	 */
	init_IE: function(view, config, widget) {

		this.Element$init(view, config, widget);

		var self = this;

		this._OldIE_refresh_callback = function() {
			self._sendRefreshValue();
		};
		this._OldIE_property_change_callback = function(e) {
			if (e.propertyName == "value") {
				self._sendRefreshValue();
			}
		};

	},

	/**
	 * Applies additional listeners for IE8-9 to track value changes.
	 * See http://benalpert.com/2013/06/18/a-near-perfect-oninput-shim-for-ie-8-and-9.html
	 */
	informInDOM_OldIE: function() {

		this.Element$informInDOM();

		var input_element = this.getDOMElement();
		Firestorm.Element.addListener(input_element, "onpropertychange", this._OldIE_property_change_callback);
		Firestorm.Element.addListener(input_element, "selectionchange", this._OldIE_refresh_callback);
		Firestorm.Element.addListener(input_element, "keyup", this._OldIE_refresh_callback);
		Firestorm.Element.addListener(input_element, "keydown", this._OldIE_refresh_callback);

	},

	/**
	 * Removes IE listeners
	 */
	informRemove_OldIE: function() {

		var input_element = this.getDOMElement();
		Firestorm.Element.removeListener(input_element, "onpropertychange", this._OldIE_property_change_callback);
		Firestorm.Element.removeListener(input_element, "selectionchange", this._OldIE_refresh_callback);
		Firestorm.Element.removeListener(input_element, "keyup", this._OldIE_refresh_callback);
		Firestorm.Element.removeListener(input_element, "keydown", this._OldIE_refresh_callback);

		this.Element$informRemove();

	},

	/**
	 * Dispatches custom ViewManager "compatible_changed" event
	 */
	_sendRefreshValue: function() {

		if (this._events['compatible_changed']) {
			this._view.dispatchEvents(this._events['compatible_changed']);
		}

	}

});