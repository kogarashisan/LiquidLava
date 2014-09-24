
Lava.define(
'Lava.widget.input.TextAbstract',
/**
 * Base class for text inputs
 * @lends Lava.widget.input.TextAbstract#
 * @extends Lava.widget.input.Abstract#
 */
{

	Extends: 'Lava.widget.input.Abstract',

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
	 * Whether to update widget's {@link Lava.widget.input.Abstract#property:value} property
	 * on any change in DOM input element. Otherwise, value will be refreshed on input's "blur" event
	 */
	_refresh_on_input: true,

	/**
	 * @param config
	 * @param {boolean} config.options.cancel_refresh_on_input Update widget's <wp>value</wp> when input element loses focus.
	 *  By default, value is updated on each user input
	 * @param widget
	 * @param parent_view
	 * @param template
	 * @param properties
	 */
	init: function(config, widget, parent_view, template, properties) {

		this.Abstract$init(config, widget, parent_view, template, properties);

		if (config.options && config.options['cancel_refresh_on_input']) {
			this._refresh_on_input = false;
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
	 * Get value from DOM input element and set local {@link Lava.widget.input.Abstract#property:value} property
	 */
	_refreshValue: function() {

		var value = this._input_container.getDOMElement().value;

		if (this._properties.value != value) {

			this._set('value', value);
			this._input_container.storeProperty('value', this._properties.value);

		}

	},

	/**
	 * DOM element's value changed: refresh local {@link Lava.widget.input.Abstract#property:value} property
	 */
	_onTextInput: function() {

		if (this._refresh_on_input) {
			this._refreshValue();
		}

	}

});