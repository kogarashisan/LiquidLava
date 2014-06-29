
Lava.define(
'Lava.widget.input.Numeric',
/**
 * @lends Lava.widget.input.Numeric#
 * @extends Lava.widget.input.Text#
 */
{

	Extends: 'Lava.widget.input.Text',

	_property_descriptors: {
		value: {type: 'Number', setter: '_setValue'},
		input_value: {type: 'String', is_readonly: true}
	},

	_properties: {
		value: 0,
		input_value: ''
	},

	_type: "number",
	_data_type: 'Number',

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

	_valueToAttributeString: function(value) {

		return value + '';

	},

	_refreshValue: function() {

		var value = this._input_container.getDOMElement().value,
			is_valid = Lava.types[this._data_type].isValidString(value);

		if (this._properties.input_value != value) { // to bypass readonly check

			this._set('input_value', value);

		}

		if (is_valid) {

			if (this._properties.value != value) {

				this._set('value', value);
				this._input_container.storeProperty('value', value);

			}

			this._setValidity(true);

		}

		this._setValidity(is_valid);

	},

	_setValue: function(name, value) {

		this.Text$_setValue(name, value);
		this._setValidity(true);

	},

	_setValidity: function(value) {

		if (this._properties.is_valid != value) {
			this._set('is_valid', value);
		}

	}

});