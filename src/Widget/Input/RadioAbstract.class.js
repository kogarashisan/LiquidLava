
/**
 * Radio or checkbox has changed it's "checked" or "indeterminate" state
 * @event Lava.widget.input.RadioAbstract#checked_changed
 */

Lava.define(
'Lava.widget.input.RadioAbstract',
/**
 * Base class for Radio and CheckBox classes
 * @lends Lava.widget.input.RadioAbstract#
 * @extends Lava.widget.input.InputAbstract#
 */
{

	Extends: 'Lava.widget.input.InputAbstract',

	_property_descriptors: {
		is_checked: {type: 'Boolean', setter: '_setIsChecked'}
	},

	_properties: {
		/** Is this checkbox or radio currently selected (checked)? */
		is_checked: false
	},

	_event_handlers: {
		checked_changed: '_onCheckedChanged'
	},

	_handleInputView: function(view, template_arguments) {

		this.InputAbstract$_handleInputView(view, template_arguments);
		this._input_container.storeProperty('checked', this._properties.is_checked ? 'checked' : null);

	},

	/**
	 * Set the "checked" property on checkbox or radio input element
	 * @param {boolean} value
	 */
	_setIsChecked: function(value) {

		this._set('is_checked', value);
		if (this._input_container) {
			this._input_container.setProperty('checked', this._properties.is_checked ? 'checked' : null);
		}

	},

	/**
	 * Element's checked state has changed. Update local <wp>is_checked</wp> property
	 */
	_onCheckedChanged: function() {

		this.set('is_checked', this._input_container.getDOMElement().checked);
		this._fire('checked_changed');

	},

	toQueryString: function() {

		return (this._properties.name && this._properties.is_checked)
			? this._properties.name + "=" + (this._properties.value || 'on')
			: '';

	}

});