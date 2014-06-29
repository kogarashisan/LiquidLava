Lava.define(
'Lava.widget.Table',
/**
 * @lends Lava.widget.Table#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',
	name: 'table',

	_properties: {
		records: null,
		_columns: null,
		_sort_column_name: null,
		_sort_descending: false
	},

	_event_handlers: {
		column_header_click: '_onColumnHeaderClick'
	},

	_include_handlers: {
		cell: '_getCellInclude'
	},

	init: function(config, widget, parent_view, template, properties) {

		if (Lava.schema.DEBUG && (!config.options || !config.options.columns)) Lava.t("Table: config.options.columns is required");
		this._properties._columns = config.options.columns;
		this.Standard$init(config, widget, parent_view, template, properties);

	},

	_onColumnHeaderClick: function(dom_event_name, dom_event, view, template_arguments) {

		var column_name = template_arguments[0].name,
			less;

		if (this._properties._sort_column_name != column_name) {

			this.set('_sort_column_name', column_name);
			this.set('_sort_descending', false);

		} else {

			this.set('_sort_descending', !this._properties._sort_descending);

		}

		less = this._properties._sort_descending
			? function(record_a, record_b) { return record_a.get(column_name) > record_b.get(column_name); }
			: function(record_a, record_b) { return record_a.get(column_name) < record_b.get(column_name); };

		if (this._properties.records) {
			this._properties.records.sort(less);
		}

	},

	_getCellInclude: function(template_arguments) {

		// var column = template_arguments[0];
		return this._config.storage.cells.value[template_arguments[0].type];

	}

});