
Lava.define(
'Lava.widget.input.Abstract',
/**
 * @lends Lava.widget.input.Abstract#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',

	/**
	 * @type {Object.<string, _cPropertyDescriptor>}
	 */
	_property_descriptors: {
		name: {type: 'String', is_nullable: true},
		value: {type: 'String', is_nullable: true},
		is_disabled: {type: 'Boolean'},
		is_required: {type: 'Boolean'},
		is_readonly: {type: 'Boolean'},
		is_valid: {type: 'Boolean', is_readonly: true}
	},

	_properties: {
		name: null,
		value: null,
		is_disabled: false,
		is_required: false,
		is_readonly: false,
		is_valid: true
	},

	_event_handlers: {
		_focused: '_onInputFocused',
		_blurred: '_onInputBlurred'
	},

	_role_handlers: {
		_input_view: '_handleInputView'
	},

	_type: null,
	_input_container: null,

	init: function(config, widget, parent_view, template, properties) {

		this.Standard$init(config, widget, parent_view, template, properties);
		Lava.view_manager.dispatchRoles(this, [{name: 'form_field'}]);

	},

	_handleInputView: function(view, template_arguments) {

		this._input_container = view.getContainer();

		// type may be null in textarea
		if (!this._input_container.getProperty('type') && this._type) {
			this._input_container.storeProperty('type', this._type);
		}

		Lava.view_manager.cancelBubble();

	},

	getMainContainer: function() {

		return this._input_container;

	},

	_onInputFocused: function() {

		this._fire('focused');

	},

	_onInputBlurred: function() {

		this._fire('blurred');

	},

	destroy: function() {
		this._input_container = null;
		this.Standard$destroy();
	},

	toQueryString: function() {

		return (this._properties.name && !this._properties.is_disabled && this._properties.value != null)
			? encodeURIComponent(this._properties.name) + '=' + encodeURIComponent(this._properties.value)
			: '';

	}

});