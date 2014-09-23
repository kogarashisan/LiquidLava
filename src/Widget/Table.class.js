Lava.define(
'Lava.widget.Table',
/**
 * Sortable table
 * @lends Lava.widget.Table#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',
	name: 'table',

	_properties: {
		/**
		 * User-assigned records collection for this table
		 * @type {Lava.system.Enumerable}
		 */
		records: null,
		/** Columns from table's options */
		_columns: null,
		/**
		 * The column, by which the records are sorted
		 * @type {string}
		 */
		_sort_column_name: null,
		/**
		 * Sort order
		 * @type {boolean}
		 */
		_sort_descending: false
	},

	_event_handlers: {
		column_header_click: '_onColumnHeaderClick'
	},

	_include_handlers: {
		cell: '_getCellInclude'
	},

	/**
	 * @param config
	 * @param {Array.<{name, title}>} config.options.columns Column descriptors. "title" is displayed in table head,
	 *  while "name" is name of the property in records
	 * @param widget
	 * @param parent_view
	 * @param template
	 * @param properties
	 */
	init: function(config, widget, parent_view, template, properties) {

		if (Lava.schema.DEBUG && (!config.options || !config.options.columns)) Lava.t("Table: config.options.columns is required");
		this._properties._columns = config.options.columns;
		this.Standard$init(config, widget, parent_view, template, properties);

	},

	/**
	 * Column header has been clicked. Apply sorting
	 * @param dom_event_name
	 * @param dom_event
	 * @param view
	 * @param template_arguments
	 */
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

	/**
	 * Get include that renders content of a cell
	 * @param template_arguments
	 * @returns {_tTemplate}
	 */
	_getCellInclude: function(template_arguments) {

		// var column = template_arguments[0]; - column descriptor from options
		return this._config.storage.cells[template_arguments[0].type];

	}

});