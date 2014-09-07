
Lava.define(
'Lava.widget.input.RadioAbstract',
/**
 * @lends Lava.widget.input.RadioAbstract#
 * @extends Lava.widget.input.Abstract#
 */
{

	Extends: 'Lava.widget.input.Abstract',

	_property_descriptors: {
		is_checked: {type: 'Boolean', setter: '_setIsChecked'}
	},

	_properties: {
		is_checked: false
	},

	_event_handlers: {
		checked_changed: '_onCheckedChanged'
	},

	_handleInputView: function(view, template_arguments) {

		this.Abstract$_handleInputView(view, template_arguments);
		this._input_container.storeProperty('checked', this._properties.is_checked ? 'checked' : null);

	},

	_setIsChecked: function(value, name) {

		if (this._properties.is_checked != value) {

			this._set('is_checked', value);
			if (this._input_container) {
				this._input_container.setProperty('checked', this._properties.is_checked ? 'checked' : null);
			}

		}

	},

	_onCheckedChanged: function() {

		this.set('is_checked', this._input_container.getDOMElement().checked);
		this._fire('checked_changed');

	},

	toQueryString: function() {

		return this._properties.is_checked ? this.RadioAbstract$toQueryString() : '';

	}

});