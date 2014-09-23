
Lava.define(
'Lava.widget.input.CheckBox',
/**
 * CheckBox input
 * @lends Lava.widget.input.CheckBox#
 * @extends Lava.widget.input.RadioAbstract#
 */
{

	Extends: 'Lava.widget.input.RadioAbstract',

	name: 'checkbox',
	_type: "checkbox",

	_property_descriptors: {
		is_indeterminate: {type: 'Boolean', setter: '_setIsIndeterminate'}
	},

	_properties: {
		/** Is checkbox in indeterminate state */
		is_indeterminate: false
	},

	/**
	 * Set "indeterminate" property on checkbox input element
	 */
	_refreshIndeterminate: function() {

		if (this._input_container && this._input_container.getDOMElement()) {
			this._input_container.getDOMElement().indeterminate = this._properties.is_indeterminate;
		}

	},

	broadcastInDOM: function() {

		this.RadioAbstract$broadcastInDOM();
		this._refreshIndeterminate();

	},

	_refresh: function() {

		this.RadioAbstract$_refresh();
		this._refreshIndeterminate();

	},

	_setIsChecked: function(value, name) {

		this.RadioAbstract$_setIsChecked(value, name);
		this._setIsIndeterminate(false);

	},

	/**
	 * Setter for <i>is_indeterminate</i> property
	 * @param {boolean} value
	 */
	_setIsIndeterminate: function(value) {

		if (this._properties.is_indeterminate != value) {
			this._set('is_indeterminate', value);
		}
		this._refreshIndeterminate(); // outside of condition: do not trust the browser and set anyway

	},

	_onCheckedChanged: function() {

		this.RadioAbstract$_onCheckedChanged();
		this.set('is_indeterminate', false);

	}

});