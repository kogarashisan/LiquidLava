
Lava.define(
'Lava.widget.input.Numeric',
/**
 * Numeric input
 * @lends Lava.widget.input.Numeric#
 * @extends Lava.widget.input.Text#
 */
{

	Extends: 'Lava.widget.input.Text',

	PROPERTY_DESCRIPTORS: {
		value: {type: 'Number', setter: '_setValue'},
		input_value: {type: 'String', is_readonly: true}
	},

	_properties: {
		value: 0,
		/** Text, that is currently entered into the DOM element */
		input_value: ''
	},

	_type: "number",
	/**
	 * A type from {@link Firestorm.Types}
	 * @type {string}
	 */
	_data_type: 'Number',

	/**
	 * @param config
	 * @param {string} config.options.type The only possible value is "text" - to change default &lt;input&gt; element
	 *  type from "number" to "text"
	 * @param {string} config.options.data_type Widget's value type from {@link Firestorm.Types}.
	 *  Must produce valid JavaScript number. Defaults to "Number"
	 * @param widget
	 * @param parent_view
	 * @param template
	 * @param properties
	 */
	init: function(config, widget, parent_view, template, properties) {

		this.Text$init(config, widget, parent_view, template, properties);

		if (config.options) {

			if (config.options['type']) {

				if (config.options['type'] != 'text') Lava.t('Numeric input: the only recognized "type" option value in "text"');
				this._type = config.options['type'];

			}

			if (config.options['data_type']) {

				this._data_type = config.options['data_type'];

			}

		}

	},

	_valueToElementProperty: function(value) {

		return value + '';

	},

	_refreshValue: function() {

		var raw_value = this._input_container.getDOMElement().value + '',
			value,
			is_valid = Firestorm.Types[this._data_type].isValidString(raw_value);

		if (this._properties.input_value != raw_value) { // to bypass readonly check

			this._set('input_value', raw_value);

		}

		if (is_valid) {

			value = Firestorm.Types[this._data_type].fromSafeString(raw_value);
			if (this._properties.value != value) {

				this._set('value', value);
				this._input_container.storeProperty('value', raw_value);

			}

		}

		this._setValidity(is_valid);

	},

	_setValue: function(name, value) {

		this.Text$_setValue(name, value);
		this._setValidity(true);

	}

});