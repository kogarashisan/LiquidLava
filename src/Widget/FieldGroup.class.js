
Lava.define(
'Lava.widget.FieldGroup',
/**
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
	 * @type {Array.<Lava.widget.input.Abstract>}
	 */
	_fields: [],
	/**
	 * @type {Array.<Lava.widget.FieldGroup>}
	 */
	_groups: [],
	/**
	 * @type {Array.<Lava.widget.input.Submit>}
	 */
	_submit_fields: [],

	_handleGroupRole: function(formgroup_widget, template_arguments) {

		this._groups.push(formgroup_widget);

	},

	_handleFieldRole: function(field_widget, template_arguments) {

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

	_onSubmit: function() {



	},

	getFields: function() {

		return this._fields.slice();

	},

	getSubmitFields: function() {

		return this._fields.slice();

	},

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

	_onFieldDestroyed: function(field_widget, event_args, native_args) {

		Firestorm.Array.exclude(native_args, field_widget);

	}

});