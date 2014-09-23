
Lava.define(
'Lava.widget.FieldGroup',
/**
 * Manages a collection of form input fields
 * @lends Lava.widget.FieldGroup#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',

	name: 'field_group',

	_role_handlers: {
		form_field: '_handleFieldRole',
		form_group: '_handleGroupRole'
	},

	_event_handlers: {
		form_submit: '_onSubmit'
	},

	/**
	 * Input widgets, registered with the FieldGroup
	 * @type {Array.<Lava.widget.input.Abstract>}
	 */
	_fields: [],
	/**
	 * Other FieldGroup instances registered with this widget
	 * @type {Array.<Lava.widget.FieldGroup>}
	 */
	_groups: [],
	/**
	 * Submit button fields
	 * @type {Array.<Lava.widget.input.Submit>}
	 */
	_submit_fields: [],

	/**
	 * Register another FieldGroup widget with this one
	 * @param field_group_widget
	 */
	_handleGroupRole: function(field_group_widget) {

		this._groups.push(field_group_widget);

	},

	/**
	 * Register an input widget
	 * @param field_widget
	 */
	_handleFieldRole: function(field_widget) {

		if (field_widget.name == 'submit') {

			this._submit_fields.push(field_widget);
			field_widget.on('clicked', this._onSubmit, this);
			field_widget.on('destroy', this._onFieldDestroyed, this, this._submit_fields);

		} else {

			this._fields.push(field_widget);
			field_widget.on('destroy', this._onFieldDestroyed, this, this._fields);

		}

		Lava.view_manager.cancelBubble();

	},

	/**
	 * Submit input was clicked
	 */
	_onSubmit: function() {



	},

	/**
	 * Get `_fields`
	 * @returns {Array.<Lava.widget.input.Abstract>}
	 */
	getFields: function() {

		return this._fields.slice();

	},

	/**
	 * Get `_submit_fields`
	 * @returns {Array.<Lava.widget.input.Abstract>}
	 */
	getSubmitFields: function() {

		return this._submit_fields.slice();

	},

	/**
	 * Convert value of all registered inputs to query string, as in GET request
	 * @returns {string}
	 */
	toQueryString: function() {

		var i = 0,
			count = this._fields.length,
			result = [],
			value;

		for (; i < count; i++) {

			value = this._fields[i].toQueryString();
			if (value) {
				result.push(value);
			}

		}

		return result.join('&');

	},

	/**
	 * Cleanup destroyed fields from local members
	 * @param {Lava.widget.input.Abstract} field_widget
	 * @param event_args
	 * @param native_args Reference to local array with input widgets
	 */
	_onFieldDestroyed: function(field_widget, event_args, native_args) {

		Firestorm.Array.exclude(native_args, field_widget);

	}

});