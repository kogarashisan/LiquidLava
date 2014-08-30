Lava.define(
'Lava.widget.EditableTableExample',
{
	Extends: 'Lava.widget.Table',

	_properties: {
		_edit_record: null
	},

	_event_handlers: {
		row_click: '_onRowClick'
	},

	_role_handlers: {
		_tbody: '_handleTBodyRole'
	},

	_click_stack_changed_listener: null,
	_tbody_container: null,

	_onRowClick: function(dom_event_name, dom_event, view, template_arguments) {

		var edit_row = template_arguments[0];
		if (this._properties._edit_record == null) {

			if (Lava.schema.DEBUG && this._click_stack_changed_listener) Lava.t();
			this._click_stack_changed_listener = Lava.view_manager.on(
				'click_stack_changed',
				this._onClickStackChanged,
				this
			);

		}

		this.set('_edit_record', edit_row);

	},

	_onClickStackChanged: function(view_manager, stack) {

		var tbody_element = this._tbody_container.getDOMElement();

		if (stack.indexOf(tbody_element) == -1) { // click outside of tbody element
			Lava.view_manager.removeListener(this._click_stack_changed_listener);
			this._click_stack_changed_listener = null;
			this.set('_edit_record', null);
		}

	},

	getInclude: function(name, template_arguments) {

		var result = null,
			column;

		if (name == 'edit_cell') {

			column = template_arguments[0];
			result = column.is_editable
				? this._config.storage.edit_cells[column.type]
				: this._config.storage.cells[column.type];

		} else {

			result = this.Table$getInclude(name, template_arguments);

		}

		return result;

	},

	_handleTBodyRole: function(view) {

		this._tbody_container = view.getContainer();

	}

});