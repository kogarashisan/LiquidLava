
Lava.define(
'Lava.widget.input.TextAbstract',
/**
 * Base class for text inputs
 * @lends Lava.widget.input.TextAbstract#
 * @extends Lava.widget.input.InputAbstract#
 */
{

	Extends: 'Lava.widget.input.InputAbstract',

	_property_descriptors: {
		value: {type: 'String', setter: '_setValue'}
	},

	_properties: {
		/** Current text inside the input element */
		value: ''
	},

	_event_handlers: {
		value_changed: '_refreshValue',
		input: '_onTextInput'
	},

	/**
	 * For IE8-9: input element listener callback, bound to this instance
	 * @type {function}
	 */
	_OldIE_refresh_callback: null,
	/**
	 * For IE8-9: `onpropertychange` callback, bound to this instance
	 * @type {function}
	 */
	_OldIE_property_change_callback: null,

	init: function(config, widget, parent_view, template, properties) {

		this.InputAbstract$init(config, widget, parent_view, template, properties);

		if (this._isNeedsIEShim()) {

			var self = this;

			this._OldIE_refresh_callback = function() {
				self._refreshValue();
			};
			this._OldIE_property_change_callback = function(e) {
				if (e.propertyName === "value") {
					self._refreshValue();
				}
			};

		}

	},

	/**
	 * Set input's value
	 * @param {string} value
	 */
	_setValue: function(value) {

		if (this._properties.value != value) {

			this._set('value', value);
			if (this._input_container) {
				this._input_container.setProperty('value', this._valueToElementProperty(value));
			}

		}

	},

	/**
	 * Convert value before setting it to Element
	 * @param {*} value
	 * @returns {string}
	 */
	_valueToElementProperty: function(value) {

		return value;

	},

	/**
	 * Get value from DOM input element and set local {@link Lava.widget.input.InputAbstract#property:value} property
	 */
	_refreshValue: function() {

		var value = this._input_container.getDOMElement().value;

		if (this._properties.value != value) {

			this._set('value', value);
			this._input_container.storeProperty('value', this._properties.value);

		}

	},

	/**
	 * DOM element's value changed: refresh local {@link Lava.widget.input.InputAbstract#property:value} property
	 */
	_onTextInput: function() {

		this._refreshValue();

	},

	/**
	 * Are we in IE8-9?
	 * @returns {boolean}
	 */
	_isNeedsIEShim: function() {

		return (Firestorm.Environment.NEEDS_INPUT_EVENT_SHIM && (this._type == "text" || this._type == "password"));

	},

	/**
	 * One-time gateway, which replaces broadcastInDOM and broadcastRemove methods with their appropriate versions:
	 * either version, that has fixes for old IE, or parent methods.
	 * @param {string} called_name Name of the method, which was called. Will be called after patching.
	 */
	_applyIEShimGateway: function(called_name) {

		var needs_shim = this._isNeedsIEShim(),
			overridden_names = {
				// replacing local method with methods from InputAbstract$ - removes it like it never existed
				broadcastInDOM: Lava.ClassManager.patch(this, "TextAbstract", "broadcastInDOM", needs_shim ? this.broadcastInDOM_OldIE : this.InputAbstract$broadcastInDOM),
				broadcastRemove: Lava.ClassManager.patch(this, "TextAbstract", "broadcastRemove", needs_shim ? this.broadcastRemove_OldIE : this.InputAbstract$broadcastRemove)
			};

		this[overridden_names[called_name]]();

	},

	broadcastInDOM: function() {

		this._applyIEShimGateway("broadcastInDOM");

	},

	broadcastRemove: function() {

		this._applyIEShimGateway("broadcastRemove");

	},

	/**
	 * Applies additional listeners for IE8-9 to track value changes.
	 * See http://benalpert.com/2013/06/18/a-near-perfect-oninput-shim-for-ie-8-and-9.html
	 */
	broadcastInDOM_OldIE: function() {

		this.InputAbstract$broadcastInDOM();

		if (this._input_container) {

			var input_element = this._input_container.getDOMElement();
			Firestorm.Element.addListener(input_element, "onpropertychange", this._OldIE_property_change_callback);
			Firestorm.Element.addListener(input_element, "selectionchange", this._OldIE_refresh_callback);
			Firestorm.Element.addListener(input_element, "keyup", this._OldIE_refresh_callback);
			Firestorm.Element.addListener(input_element, "keydown", this._OldIE_refresh_callback);

		}

	},

	/**
	 * Removes IE listeners
	 */
	broadcastRemove_OldIE: function() {

		if (this._input_container) {

			var input_element = this._input_container.getDOMElement();
			Firestorm.Element.removeListener(input_element, "onpropertychange", this._OldIE_property_change_callback);
			Firestorm.Element.removeListener(input_element, "selectionchange", this._OldIE_refresh_callback);
			Firestorm.Element.removeListener(input_element, "keyup", this._OldIE_refresh_callback);
			Firestorm.Element.removeListener(input_element, "keydown", this._OldIE_refresh_callback);

		}

		this.InputAbstract$broadcastRemove();

	}

});