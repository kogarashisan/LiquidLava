/**
 * Shared code between client and server
 */
var ApiCommon = {

	/**
	 * Does not render empty columns
	 */
	renderAPITable: function(rows, descriptions, header_titles, options) {

		var column_index,
			column_count = header_titles.length,
			row_index,
			row_count = rows.length,
			has_content_flags = new Array(column_count),
			columns_with_content = 0,
			thead_content = '',
			tbody_content = '',
			row_content = '',
			header_cell_attributes = new Array(column_count),
			column_cell_attributes = new Array(column_count),
			description_attributes = '',
			table_attributes = '',
			scroll_prefix = '';

		if (options) {
			if (options.header_cell_attributes) header_cell_attributes = options.header_cell_attributes;
			if (options.column_cell_attributes) column_cell_attributes = options.column_cell_attributes;
			if (options.description_attributes) description_attributes = options.description_attributes;
			if (options.table_attributes) table_attributes = options.table_attributes;
			if (options.scroll_prefix) scroll_prefix = options.scroll_prefix;
		}

		for (row_index = 0; row_index < row_count; row_index++) {
			for (column_index = 0; column_index < column_count; column_index++) {
				if (rows[row_index][column_index]) {
					has_content_flags[column_index] = true;
				}
			}
		}

		for (column_index = 0; column_index < column_count; column_index++) {
			if (has_content_flags[column_index]) {
				thead_content += '<td ' + (header_cell_attributes[column_index] || '') + '>' + header_titles[column_index] + '</td>';
				columns_with_content++;
			}
		}

		for (row_index = 0; row_index < row_count; row_index++) {
			row_content = '<tr' + (scroll_prefix ? (' data-scroll-name="' + scroll_prefix + '"') : '') + '>';
			for (column_index = 0; column_index < column_count; column_index++) {
				if (has_content_flags[column_index]) {
					row_content += '<td ' + (column_cell_attributes[column_index] || '') + '>' + rows[row_index][column_index] + '</td>';
				}
			}
			tbody_content += row_content + '</tr>';

			if (descriptions && descriptions[row_index]) {
				tbody_content += '<tr><td ' + description_attributes + ' colspan="' + columns_with_content + '">' + descriptions[row_index] + '</td></tr>';
			}
		}

		return '<table ' + table_attributes + '>'
				+ '<thead><tr>' + thead_content + '</tr></thead>'
				+ '<tbody>' + tbody_content + '</tbody>'
			+ '</table>';

	},

	renderParamsTable: function(params, table_class, scroll_prefix) {

		var row_index,
			row_count = params.length,
			column_index,
			column_count = 4,
			rows = [],
			descriptions = [],
			row,
			cell_content,
			param;

		for (row_index = 0; row_index < row_count; row_index++) {
			row = [];
			param = params[row_index];
			for (column_index = 0; column_index < column_count; column_index++) {
				cell_content = '';
				if (param.is_nullable) cell_content += '<img title="Nullable" src="/www/design/nullable.png" />';
				if (param.is_non_nullable) cell_content += '<img title="Non-nullable" src="/www/design/non-nullable.png" />';
				if (param.is_optional) cell_content += '[optional]';
				if (param.is_variable) cell_content += '[...variable]';
				row.push(cell_content); // 1 - flags
				row.push(param.name); // 2
				if (param.type_names) {
					row.push(param.type_names.join('<br/>')); // 3
				} else {
					row.push(''); // 3
				}
				row.push(param.default_value || ''); // 4
			}
			descriptions.push(param.description);
			rows.push(row);
		}

		return this.renderAPITable(rows, descriptions, ['', 'Name', 'Types', 'Default'], {
			table_attributes: 'class="' + table_class + '"',
			header_cell_attributes: ['class="api-flag-td"'],
			column_cell_attributes: ['class="api-flag-td"', 'class="api-name-column"'],
			description_attributes: 'class="api-description-td api-description-row-td"',
			scroll_prefix: scroll_prefix || ''
		});

	},

	renderReturns: function(returns) {

		var result = '<div><b>Returns:</b> ';
		if (returns.is_nullable) result += '<img title="Nullable" src="/www/design/nullable.png" />';
		if (returns.is_non_nullable) result += '<img title="Non-nullable" src="/www/design/non-nullable.png" />';
		if (returns.type_names) {
			if (returns.type_names.length > 1) {
				result += '(' + returns.type_names.join('|') + ')';
			} else {
				result += returns.type_names[0] || '';
			}
		}
		result += '</div>';
		if (returns.description) {
			result += '<div class="api-pad-left">' + returns.description + '</div>';
		}

		return result;

	},

	renderEventExt: function(descriptor) {

		var result = '';

		if (descriptor.type_names) {

			result = '<div><b>Event argument:</b> ';
			if (descriptor.is_nullable) result += '<img title="Nullable" src="/www/design/nullable.png" />';
			if (descriptor.is_non_nullable) result += '<img title="Non-nullable" src="/www/design/non-nullable.png" />';
			if (descriptor.is_optional) result += '[optional]';
			if (descriptor.type_names) {
				if (descriptor.type_names.length > 1) {
					result += '(' + descriptor.type_names.join('|') + ')';
				} else {
					result += descriptor.type_names[0] || '';
				}
			}
			result += '</div>';
			if (descriptor.argument_description) {
				result += '<div class="api-pad-left">' + descriptor.argument_description + '</div>';
			}

		}

		if (descriptor.params) {

			result += '<b class="api-member-extended-header">Argument properties</b>';
			result += ApiCommon.renderParamsTable(descriptor.params, 'api-member-inner-table');

		}

		return result;

	}

};