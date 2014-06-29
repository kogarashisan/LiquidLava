
Lava.define(
'Lava.widget.input.TextAbstract',
/**
 * @lends Lava.widget.input.TextAbstract#
 * @extends Lava.widget.input.Abstract#
 */
{

	Extends: 'Lava.widget.input.Abstract',

	_property_descriptors: {
		value: {type: 'String', setter: '_setValue'}
	},

	_properties: {
		value: ''
	},

	_event_handlers: {
		value_changed: '_refreshValue',
		input: '_onTextInput'
	},

	_refresh_on_input: true,

	init: function(config, widget, parent_view, template, properties) {

		this.Abstract$init(config, widget, parent_view, template, properties);

		if (config.options && config.options['cancel_refresh_on_input']) {
			this._refresh_on_input = false;
		}

	},

	_setValue: function(name, value) {

		if (this._properties.value != value) {

			this._set('value', value);
			if (this._input_container) {
				this._input_container.setProperty('value', this._valueToAttributeString(value));
			}

		}

	},

	_valueToAttributeString: function(value) {

		return value;

	},

	_refreshValue: function() {

		var value = this._input_container.getDOMElement().value;

		if (this._properties.value != value) {

			this._set('value', value);
			this._input_container.storeProperty('value', this._properties.value);

		}

	},

	_onTextInput: function() {

		if (this._refresh_on_input) {
			this._refreshValue();
		}

	}

});