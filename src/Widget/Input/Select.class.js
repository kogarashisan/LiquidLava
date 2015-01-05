
Lava.define(
'Lava.widget.input.Select',
/**
 * Dropdown select
 * @lends Lava.widget.input.Select#
 * @extends Lava.widget.input.SelectAbstract#
 */
{

	Extends: 'Lava.widget.input.SelectAbstract',

	_property_descriptors: {
		value: {type: 'String', setter: '_setValue'}
	},

	_refreshValue: function() {

		var element = this._input_container.getDOMElement();
		// https://mootools.lighthouseapp.com/projects/2706/tickets/578-elementgetselected-behaves-differently-between-ffie-safari
		//noinspection BadExpressionStatementJS
		element.selectedIndex;
		this.set('value', element.value);

	},

	/**
	 * Setter for the <wp>value</wp> property
	 * @param {string} value
	 */
	_setValue: function(value) {

		var element;

		if (this._input_container) {
			element = this._input_container.getDOMElement();
			element.value = value;
			if (value != element.value) { // workaround for nonexistent values
				Lava.logError("[Select] nonexistent value assigned: " + value);
				value = element.value;
			}
		}

		this._set('value', value);

	},

	/**
	 * {modifier} This widget does not use live bindings of "selected" property, so this modifier is used to speed up rendering
	 * @param {string} value
	 * @returns {boolean}
	 */
	isValueSelected: function(value) {
		return value == this._properties.value;
	}

});