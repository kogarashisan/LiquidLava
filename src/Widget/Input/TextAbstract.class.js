
Lava.define(
'Lava.widget.input.TextAbstract',
/**
 * Base class for text inputs
 * @lends Lava.widget.input.TextAbstract#
 * @extends Lava.widget.input.InputAbstract#
 */
{

	Class: {
		is_abstract: true
	},

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
	 * Set input's value
	 * @param {string} name "value"
	 * @param {string} value
	 */
	_setValue: function(name, value) {

		this._set(name, value);
		if (this._input_container) {
			this._input_container.setProperty(name, this._valueToElementProperty(value));
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

	}

});