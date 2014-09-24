
Lava.define(
'Lava.widget.input.MultipleSelect',
/**
 * Select input with multiple choices
 * @lends Lava.widget.input.MultipleSelect#
 * @extends Lava.widget.input.SelectAbstract#
 */
{

	Extends: 'Lava.widget.input.SelectAbstract',

	name: 'select',

	_property_descriptors: {
		value: {type: 'Array', setter: '_setValue'}
	},

	_properties: {
		value: []
	},

	_handleInputView: function(view, template_arguments) {

		this.SelectAbstract$_handleInputView(view, template_arguments);
		this._input_container.storeProperty('multiple', true);

	},

	_refreshValue: function() {

		var element = this._input_container.getDOMElement(),
			options = element.selectedOptions || element.options,
			result = [],
			i = 0,
			count = options.length,
			option_value,
			differs = false;

		for (; i < count; i++) {
			if (options[i].selected) {
				option_value = options[i].value || options[i].text;
				result.push(option_value);
				if (this._properties.value.indexOf(option_value) == -1) {
					differs = true;
				}
			}
		}

		if (differs || this._properties.value.length != result.length) {

			this._set('value', result);

		}

	},

	/**
	 * Setter for the <wp>value</wp> property
	 * @param {Array.<string>} value
	 */
	_setValue: function(value) {

		var element,
			options,
			count,
			i = 0,
			option_value;

		if (this._input_container) {

			element = this._input_container.getDOMElement();
			options = element.options;
			count = options.length;
			for (; i < count; i++) {
				option_value = options[i].value || options[i].text;
				options[i].selected = (value.indexOf(option_value) != -1);
			}

		}

		this._set('value', value);

	},

	/**
	 * {modifier} This widget does not use bindings of "selected" property, so this modifier is used to speed up rendering
	 * @param {string} value
	 * @returns {boolean}
	 */
	isValueSelected: function(value) {

		return this._properties.value.indexOf(value) != -1;

	},

	toQueryString: function() {

		var result = [],
			name = this._properties.name,
			values = this._properties.value,
			i = 0,
			count = values.length;

		if (this._properties.name && !this._properties.is_disabled) {
			for (; i < count; i++) {
				result.push(
					encodeURIComponent(name) + '=' + encodeURIComponent(values[i])
				);
			}
		}

		return result.join('&');

	}

});