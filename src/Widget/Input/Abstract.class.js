/**
 * Input's element got focus
 * @event Lava.widget.input.Abstract#focused
 */

/**
 * Input's element lost it's focus
 * @event Lava.widget.input.Abstract#blurred
 */

Lava.define(
'Lava.widget.input.Abstract',
/**
 * Base class for support of html &lt;input&gt; fields
 * @lends Lava.widget.input.Abstract#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',

	_property_descriptors: {
		name: {type: 'String', is_nullable: true},
		value: {type: 'String', is_nullable: true},
		is_disabled: {type: 'Boolean'},
		is_required: {type: 'Boolean'},
		is_readonly: {type: 'Boolean'},
		is_valid: {type: 'Boolean', is_readonly: true}
	},

	_properties: {
		/** Input's "name" attribute */
		name: null,
		/** Input's "value" attribute */
		value: null,
		/** "disabled" attribute of the input */
		is_disabled: false,
		/** "required" attribute of the input */
		is_required: false,
		/** "readonly" attribute of the input */
		is_readonly: false,
		/** Is current input of HTML element valid for this kind of field */
		is_valid: true
	},

	_event_handlers: {
		_focused: '_onInputFocused',
		_blurred: '_onInputBlurred'
	},

	_role_handlers: {
		_input_view: '_handleInputView'
	},

	/**
	 * The input's "type" attribute
	 * @type {string}
	 */
	_type: null,
	/**
	 * DOM input element
	 * @type {Lava.view.container.Element}
	 */
	_input_container: null,

	init: function(config, widget, parent_view, template, properties) {

		this.Standard$init(config, widget, parent_view, template, properties);
		Lava.view_manager.dispatchRoles(this, [{name: 'form_field'}]);

	},

	/**
	 * Save container of the DOM input element and set it's type
	 * @param {Lava.view.Abstract} view
	 */
	_handleInputView: function(view) {

		this._input_container = view.getContainer();

		// type may be null in textarea
		if (!this._input_container.getProperty('type') && this._type) {
			this._input_container.storeProperty('type', this._type);
		}

		Lava.view_manager.cancelBubble();

	},

	/**
	 * Get `_input_container`
	 * @returns {Lava.view.container.Element}
	 */
	getMainContainer: function() {

		return this._input_container;

	},

	/**
	 * Fire {@link Lava.widget.input.Abstract#event:focused}
	 */
	_onInputFocused: function() {

		this._fire('focused');

	},

	/**
	 * Fire {@link Lava.widget.input.Abstract#event:blurred}
	 */
	_onInputBlurred: function() {

		this._fire('blurred');

	},

	destroy: function() {
		this._input_container = null;
		this.Standard$destroy();
	},

	/**
	 * Encode as part of GET request
	 * @returns {string}
	 */
	toQueryString: function() {

		return (this._properties.name && !this._properties.is_disabled && this._properties.value != null)
			? encodeURIComponent(this._properties.name) + '=' + encodeURIComponent(this._properties.value)
			: '';

	},

	/**
	 * Protected setter for readonly <wp>is_valid</wp> property
	 * @param {boolean} value New value for <wp>is_valid</wp> property
	 */
	_setValidity: function(value) {

		if (this._properties.is_valid != value) {
			this._set('is_valid', value);
		}

	}

});