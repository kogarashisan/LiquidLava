
Lava.define(
'Lava.widget.DropDown',
/**
 * Widget with content, that is shown on click
 * @lends Lava.widget.DropDown#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',

	name: 'dropdown',

	_property_descriptors: {
		is_open: {type: 'Boolean', setter: '_setIsOpen'}
	},

	_properties: {
		/** Is the widget expanded */
		is_open: false
	},

	_event_handlers: {
		trigger_click: '_onTriggerClick'
	},

	_role_handlers: {
		trigger: '_registerTrigger', // the link which toggles the dropdown
		target: '_registerTarget' // the target to which the class 'open' is applied
	},

	/**
	 * A view that responds to the "click" event
	 * @type {Lava.view.Abstract}
	 */
	_trigger: null,
	/**
	 * A view, that is displayed when `_trigger` is clicked
	 * @type {Lava.view.Abstract}
	 */
	_target: null,

	/**
	 * Listener for global "click" anywhere on page
	 * @type {_tListener}
	 */
	_click_listener: null,

	/**
	 * @param config
	 * @param {string} config.options.target_class Class name to add to `_target` when `_trigger` is clicked
	 * @param widget
	 * @param parent_view
	 * @param template
	 * @param properties
	 */
	init: function(config, widget, parent_view, template, properties) {

		this.Standard$init(config, widget, parent_view, template, properties);
		Lava.app.on('close_popups', this._onClosePopups, this);

	},

	/**
	 * Handler for global {@link Lava.system.App} event "close_popups"
	 */
	_onClosePopups: function() {

		this.set('is_open', false);

	},

	/**
	 * Change <i>is_open</i> state
	 * @param dom_event_name
	 * @param dom_event
	 */
	_onTriggerClick: function(dom_event_name, dom_event) {

		if (this._properties.is_open) {

			this.set('is_open', false);

		} else {

			Lava.app.fireGlobalEvent('close_popups');
			if (!this._click_listener) {
				this._click_listener = Lava.Core.addGlobalHandler('click', this._onGlobalClick, this);
			}

			this.set('is_open', true);

		}

		dom_event.preventDefault();

	},

	/**
	 * Click anywhere on page
	 */
	_onGlobalClick: function() {

		Lava.Core.removeGlobalHandler(this._click_listener);
		this._click_listener = null;
		this.set('is_open', false);

	},

	/**
	 * Get container of the element, which is shown, when widget is expanded
	 * @returns {_iContainer}
	 */
	_getTargetContainer: function() {

		return this._target && this._target.getContainer() || this._container;

	},

	/**
	 * Register `_trigger` view
	 * @param {Lava.view.Abstract} view
	 */
	_registerTrigger: function(view) {

		this._trigger = view;
		view.getContainer().addEventTarget('click', {locator_type: "Guid", locator: this.guid, name: "trigger_click"});

	},

	/**
	 * Register `_target` view
	 * @param {Lava.view.Abstract} view
	 */
	_registerTarget: function(view) {

		this._target = view;

	},

	/**
	 * Setter for <i>is_open</i> property
	 * @param {boolean} value
	 * @param {string} name
	 */
	_setIsOpen: function(value, name) {

		var open_target_container = this._getTargetContainer();
		if (Lava.schema.DEBUG && !open_target_container) Lava.t("DropDown was created without container and target");

		if (this._properties.is_expanded != value) {

			this._set(name, value);

			if (value) {

				open_target_container.addClass(this._config.options.target_class);

			} else {

				open_target_container.removeClass(this._config.options.target_class);

			}

		}

	},

	destroy: function() {

		if (this._click_listener) {
			Lava.Core.removeGlobalHandler(this._click_listener);
			this._click_listener = null;
		}

		this._trigger = this._target = null;

		this.Standard$destroy();

	}

});