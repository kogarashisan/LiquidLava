
Lava.define(
'Lava.widget.DropDown',
/**
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
		is_open: false
	},

	_event_handlers: {
		trigger_click: '_onTriggerClick'
	},

	_role_handlers: {
		trigger: '_registerTrigger', // the link which toggles the dropdown
		target: '_registerTarget' // the target to which the class 'open' is applied
	},

	_is_focused: false,

	_trigger: null,
	_target: null,

	_click_listener: null,

	init: function(config, widget, parent_view, template, properties) {

		this.Standard$init(config, widget, parent_view, template, properties);
		Lava.app.on('close_popups', this._onClosePopups, this);

	},

	_onClosePopups: function() {

		this.set('is_open', false);

	},

	_onTriggerClick: function(dom_event_name, dom_event, view, template_arguments) {

		if (this._properties._is_open) {

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

	_onGlobalClick: function() {

		Lava.Core.removeGlobalHandler(this._click_listener);
		this._click_listener = null;
		this.set('is_open', false);

	},

	_getTargetContainer: function() {

		return this._target && this._target.getContainer() || this._container;

	},

	_registerTrigger: function(view, template_arguments) {

		this._trigger = view;
		view.getContainer().addEventTarget('click', {locator_type: "Guid", locator: this.guid, name: "trigger_click"});

	},

	_registerTarget: function(view, template_arguments) {

		this._target = view;

	},

	_setIsOpen: function(name, value) {

		var open_target_container = this._getTargetContainer();
		if (Lava.schema.DEBUG && !open_target_container) Lava.throw("DropDown was created without container and target");

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