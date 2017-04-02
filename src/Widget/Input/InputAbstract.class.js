
Lava.define(
'Lava.widget.input.InputAbstract',
/**
 * Base class for support of html &lt;input&gt; fields
 * @lends Lava.widget.input.InputAbstract#
 * @extends Lava.widget.Standard#
 */
{

	Class: {
		is_abstract: true
	},

	Extends: 'Lava.widget.Standard',
	Shared: ["DEFAULT_ROLES"],

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

	_role_handlers: {
		_input_view: '_handleInputView',
		label: '_handleLabel'
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

	/**
	 * Will be dispatched in `init()`. Needed to register input in forms and field groups.
	 * @type {Array.<_cTarget>}
	 */
	DEFAULT_ROLES: [{name: 'form_field'}],

	init: function(config, widget, parent_view, template, properties) {

		this.Standard$init(config, widget, parent_view, template, properties);
		Lava.view_manager.dispatchRoles(this, this.DEFAULT_ROLES);

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
	 * Focus the input's element, if it's currently in DOM
	 */
	focus: function() {

		if (this._input_container && this._input_container.isInDOM()) {
			this._input_container.getDOMElement().focus();
		}

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

	},

	/**
	 * Assign "for" attribute to label
	 * @param view
	 */
	_handleLabel: function(view) {

		view.getContainer().setProperty('for', Lava.ELEMENT_ID_PREFIX + this.guid);

	},

	destroy: function() {
		this._input_container = null;
		this.Standard$destroy();
	}

});