
/*
This file was generated via build script. See Gruntfile.js
*/


// Request class is from MooTools
var SafeRequest = new Class({
	Extends: Request,
	success: function(text, xml) {
		this.onSuccess(text, xml);
	}
});

var Examples = {

	/**
	 * Recursively turn argument into Enumerable and Properties.
	 * @param arg
	 */
	makeLive: function(arg) {

		var result,
			temp,
			i = 0,
			count,
			name;

		if (Array.isArray(arg)) {

			temp = [];

			for (count = arg.length; i < count; i++) {
				temp.push(this.makeLive(arg[i]));
			}

			result = new Lava.system.Enumerable(temp);

		} else if (Firestorm.getType(arg) == 'object') {

			result = new Lava.mixin.Properties();

			for (name in arg) {

				result.set(name, this.makeLive(arg[name]));

			}

		} else {

			result = arg;

		}

		return result;

	}

};


Lava.schema.modules['DemoTree'] = {
	fields: {
		//id: {type: 'Id'},
		guid: {type: 'Guid'}, // for MetaStorage
		title: {type: 'Basic', 'default': ''},
		type: {type: 'Basic', 'default': 'file'},
		parent: {type: 'Record', module: 'this'/*, foreign_key_field: 'parent_id'*/},
		//parent_id: {type: 'ForeignKey'},
		children: {type: 'Collection', module: 'this', record_field: 'parent'},

		is_expanded: {type: 'Basic', 'default': false},
		// for tree with checkboxes:
		is_checked: {type: 'Basic', 'default': false},
		is_indeterminate: {type: 'Basic', 'default': false}
	}
};

var ExampleData = {

	example_tree: [
		{title: "Node1"},
		{title: "Node2", type: 'folder'},
		{title: "Node3", type: 'folder', children: [
			{title: "Node5", type: 'folder'},
			{title: "Node6"},
			{title: "Node7", type: 'folder', children: [
				{title: "Node8"},
				{title: "Node9", type: 'folder', children: [
					{title: "Node11"}
				]},
				{title: "Node10"}
			]}
		]},
		{title: "Node4", type: 'file'}
	],

	circles: [
		{x:107, y:91, text:'1 year wearranty'},
		{x:164, y:326, text:'Blu-ray drive, FM radio'},
		{x:305, y:277, text:'170 watts active subwoofer'}
	],

	periodic_elements: [
		{title: 'Hydrogen', symbol: 'H', atomic_mass: 1.00797, is_gas: true},
		{title: 'Helium', symbol: 'He', atomic_mass: 4.0026, is_gas: true},
		{title: 'Lithium', symbol: 'Li', atomic_mass: 6.9412, is_gas: false},
		{title: 'Beryllium', symbol: 'Be', atomic_mass: 9.01218, is_gas: false},
		{title: 'Boron', symbol: 'B', atomic_mass: 10.812, is_gas: false},
		{title: 'Carbon', symbol: 'C', atomic_mass: 12.0108, is_gas: false},
		{title: 'Nitrogen', symbol: 'N', atomic_mass: 14.0067, is_gas: true},
		{title: 'Oxygen', symbol: 'O', atomic_mass: 15.9994, is_gas: true},
		{title: 'Fluorine', symbol: 'F', atomic_mass: 18.99840, is_gas: true},
		{title: 'Neon', symbol: 'Ne', atomic_mass: 20.179, is_gas: true}
	]

};
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
				? this._config.storage.edit_cells.value[column.type]
				: this._config.storage.cells.value[column.type];

		} else {

			result = this.Table$getInclude(name, template_arguments);

		}

		return result;

	},

	_handleTBodyRole: function(view) {

		this._tbody_container = view.getContainer();

	}

});

Lava.define(
'Lava.widget.ContentLoader',
{

	Extends: 'Lava.widget.Standard',

	name: 'page',

	_properties: {
		is_loading: false
	},

	_event_handlers: {
		selectItem: '_selectItem'
	},

	_request: null,

	init: function(config, widget, parent_view, template, properties) {

		this.Standard$init(config, widget, parent_view, template, properties);

		if (window.location.hash) {

			var path = window.location.hash.substr(1),
				item = this._getItemByHash(path);

			if (item) {
				this._loadItem(item);
			} else {
				window.alert('Page not found: ' + path);
			}

		}

	},

	_exec: function(script_src) {

		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.text = script_src;
		document.head.appendChild(script);

	},

	_selectItem: function(dom_event_name, dom_event, view, template_arguments) {

		var item = template_arguments[0];

		if (this._request == null) {

			if (item.get('is_loaded')) {

				this._showItem(item);

			} else {

				this._loadItem(item);

			}

		}

	},

	_loadItem: function(item) {

		var self = this;
		this.set('is_loading', true);

		this._request = new SafeRequest({
			url: this._getFilePath(item),
			method: 'GET',
			onSuccess: function(text) {
				self._onRequestSuccess(text, item);
			},
			onFailure: function() {
				self._onRequestFailure(item);
			}
		});

		this._request.send();

	},

	_onRequestSuccess: function(text, item) {

		item.set('is_loaded', true);
		this.set('is_loading', false);
		this._request = null;

		this._onItemLoaded(text, item);
		this._showItem(item);

	},

	_onRequestFailure: function(item) {

		this.set('is_loading', false);
		this._request = null;

	},

	_getFilePath: function(item) {

		Lava.t('Abstract function call');

	},

	_getItemByHash: function(path) {

		Lava.t('Abstract function call');

	},

	_onItemLoaded: function(text, item) {

		Lava.t('Abstract function call');

	},

	_showItem: function(item) {

		Lava.t('Abstract function call');

	}

});

Lava.define(
'Lava.widget.ChangelogPage',
{

	Extends: 'Lava.widget.ContentLoader',

	_properties: {
		versions: null,
		selected_version: {
			title: 'Changelog'
		}
	},

	VERSIONS_DIR: 'versions/',

	init: function(config, widget, parent_view, template, properties) {

		this._properties.versions = Examples.makeLive(LavaVersions);
		this.ContentLoader$init(config, widget, parent_view, template, properties);

	},

	_onItemLoaded: function(text, item) {

		item.set('html', text);

	},

	_getItemByHash: function(path) {

		var version = null;

		this._properties.versions.each(function(value){
			if (value.get('name') == path) {
				version = value;
				return false;
			}
		});

		return version;

	},

	_showItem: function(item) {

		var example_content_container = Firestorm.getElementById('version_content_container');

		if (this._properties.selected_version != item) {

			if (this._properties.selected_version.isProperties) this._properties.selected_version.set('is_selected', false);
			Firestorm.Element.setProperty(example_content_container, 'html', item.get('html'));
			this._set('selected_version', item);
			item.set('is_selected', true);
			Lava.refreshViews();

		}

	},

	_getFilePath: function(item) {

		return this.VERSIONS_DIR + item.get('name') + '.html';

	}

});

Lava.define(
'Lava.widget.ApiPage',
{

	Extends: 'Lava.widget.ContentLoader',
	Shared: ['_shared'],

	_shared: {
		meta_storage_config: {
			fields: {
				is_expanded: {type: 'Boolean', 'default': false}
			}
		}
	},

	_properties: {
		// navigation tree to the left
		api_tree: null,
		// another navigation tree - for Firestorm API
		firestorm_api_tree: null,
		// current class descriptors (which are selected in the nav tree)
		descriptor: null,
		extended_descriptor: null,
		// how to display the members: grouped by class or all in one table
		member_grouping: true, // @todo not implemented
		meta_storage: null,

		sugar_descriptor: null,
		support_descriptor: null

		//_all_methods: null, // Enumerable
		//_all_members: null, // Enumerable

		//is_show_inherited: true,
		//is_show_mixins: true,
		//is_group_members: true
	},

	_event_handlers: {
		node_click: '_onNodeClick',
		member_row_click: '_onMemberRowClick',
		group_header_click: '_onGroupHeaderClicked'
	},

	_modifiers: {
		render_params: '_renderParams',
		render_method_extended: '_renderMethodExtended'
	},

	//_broadcast_handlers: {
	//	on_filter_changed: '_onFilterConditionChanged'
	//},

	API_DIR: 'api/',

	// one global instance
	_class_content_widget: null,
	// name -> short descriptor, for loading classes by hash
	_tree_hash: null,

	init: function(config, widget, parent_view, template, properties) {

		var children,
			hash = {};

		this._properties.api_tree = Examples.makeLive(api_tree_source);
		this._properties.firestorm_api_tree = Examples.makeLive(firestorm_api_tree_source);

		/*function prepareTree(collection, parent) {
			collection.each(function(record){
				record.set('parent', parent);
				if (record.get('type') == 'folder') {
					hash[record.get('name')] = record;
				}
				children = record.get('children');
				if (children) {
					prepareTree(children, record);
				}
			})
		}*/

		this._tree_hash = hash; // @todo
		this._class_content_widget = Lava.createWidget('ClassContent');
		this._properties.sugar_descriptor = new Lava.mixin.Properties({
			type: 'object',
			name: 'Sugar',
			title: 'Sugar'
		});
		this._properties.support_descriptor = new Lava.mixin.Properties({
			type: 'object',
			name: 'Support',
			title: 'Support'
		});
		this.ContentLoader$init(config, widget, parent_view, template, properties);

	},

	_onNodeClick: function(dom_event_name, dom_event, view, template_arguments) {

		var node = template_arguments[0];

		if (node.get('type') == 'class' || node.get('type') == 'object') {

			this._selectItem(dom_event_name, dom_event, view, template_arguments);

		} else if (node.get('type') == 'folder') {

			node.set('is_expanded', !node.get('is_expanded'));

		} else {

			Lava.t();

		}

		dom_event.preventDefault(); // @todo remove this to enable hash change

	},

	_onMemberRowClick: function(dom_event_name, dom_event, view, template_arguments) {

		var member_descriptor = template_arguments[0];
		if (member_descriptor.isProperties && (member_descriptor.get('returns') || member_descriptor.get('params'))) {
			var meta_record = this._properties.meta_storage.get(template_arguments[0].get('guid'));
			meta_record.set('is_expanded', !meta_record.get('is_expanded'));
		}

	},

	_loadGroup: function(chain) {

		var group_count = chain.length,
			group_index = 0,
			descriptors,
			i,
			count;

		for (; group_index < group_count; group_index++) {
			descriptors = chain[group_index].descriptors;
			for (i = 0, count = descriptors.length; i < count; i++) {
				descriptors[i].guid = Lava.guid++;
				descriptors[i] = new Lava.mixin.Properties(descriptors[i]);
				//all_member_descriptors.push(descriptors[i]);
			}
		}

	},

	_onItemLoaded: function(text, item) {

		var extended_descriptor = eval('(' + text + ')'),
			method_chain = extended_descriptor.method_chain,
			member_chain = extended_descriptor.member_chain,
			events = extended_descriptor.events,
			support_objects = extended_descriptor.support_objects,
			i = 0,
			count,
			all_method_descriptors = [],
			all_member_descriptors = [];

		item.set('extended_descriptor', extended_descriptor);

		if (method_chain) this._loadGroup(method_chain);
		//if (member_chain) this._loadGroup(member_chain);

		if (events) {
			for (i = 0, count = events.length; i < count; i++) {
				events[i].guid = Lava.guid++;
				events[i] = new Lava.mixin.Properties(events[i]);
			}
		}

		if (support_objects) {
			for (i = 0, count = support_objects.length; i < count; i++) {
				if (support_objects[i].method_chain) this._loadGroup(support_objects[i].method_chain);
			}
		}

		//item.set('all_methods', new Lava.system.Enumerable(all_method_descriptors));
		//item.set('all_members', new Lava.system.Enumerable(all_member_descriptors));

	},

	_getItemByHash: function(path) {

		var result = null,
			segments = path.split(';'),
			parts,
			i = 0,
			count = segments.length,
			hash = {};

		for (; i < count; i++) {
			parts = segments[i].split('=');
			if (parts.length == 2) {
				hash[parts[0]] = parts[1];
			}
		}

		if (('class' in hash) && (hash['class'] in this._tree_hash)) {
			result = this._tree_hash[hash['class']]
		}

		return result;

	},

	_showItem: function(item) {

		if (this._properties.descriptor != item) {

			// it may be null if the page has just loaded and no class was selected
			if (this._properties.descriptor) {
				this._properties.descriptor.set('is_selected', false);
				// each time a class is selected - the expanded state of all members needs to be forgotten
				this._properties.meta_storage.destroy();
			}
			this._set('meta_storage', new Lava.data.MetaStorage(this._shared.meta_storage_config));

			this._set('descriptor', item);
			this._set('extended_descriptor', item.get('extended_descriptor'));
			item.set('is_selected', true);

			if (!this._class_content_widget.isInDOM()) {
				this._class_content_widget.inject(Firestorm.getElementById('content_area'), 'Top');
			}

			Lava.refreshViews();

		}

	},

	_getFilePath: function(item) {

		return this.API_DIR + item.get('name') + '.js';

	},

	_onGroupHeaderClicked: function(dom_event_name, dom_event, view, template_arguments) {

		// @todo

	},

	_onFilterConditionChanged: function() {

		// @todo

	},

	_renderParams: function(params, table_class) {

		return ApiCommon.renderParamsTable(params, table_class);

	},

	_renderMethodExtended: function(descriptor, table_class) {

		var result = '';
		if (descriptor.get('params')) {
			result += '<b class="api-member-extended-header">Arguments</b>';
			result += ApiCommon.renderParamsTable(descriptor.get('params'), table_class);
		}
		if (descriptor.get('returns')) {
			if (result) result += '<br/>';
			result += ApiCommon.renderReturns(descriptor.get('returns'));
		}
		return result;

	}

});

Lava.define(
'Lava.widget.ExamplesPage',
{

	Extends: 'Lava.widget.ContentLoader',

	_properties: {
		examples: null,
		all_tree_records: null,
		tree_records: null,
		selected_example: {
			title: 'Examples'
		},
		live_example_tree: null
	},

	_active_example_widget: null,

	EXAMPLES_DIR: 'examples/',

	init: function(config, widget, parent_view, template, properties) {

		this._properties.examples = Examples.makeLive(LavaExamples);

		var demo_module = Lava.app.getModule('DemoTree');
		// clone cause loading modifies the data
		demo_module.loadRecords(ExampleData.example_tree);
		this._properties.all_tree_records = new Lava.system.Enumerable(demo_module.getAllRecords());
		this._properties.tree_records = new Lava.system.Enumerable(demo_module.getAllRecords());
		this._properties.tree_records.filter(function(record) {
			return !record.get('parent')
		});

		// create a global data object to avoid need for destroy() and garbage collection issues
		this.set('live_example_tree', Examples.makeLive(ExampleData.example_tree));

		this.ContentLoader$init(config, widget, parent_view, template, properties);

	},

	_onItemLoaded: function(package_json, example) {

		var package_content = eval(package_json),
			widget_config;

		if (package_content['classes']) {
			Browser.exec(package_content['classes']);
			//this._exec(classes);
		}

		example.setProperties(package_content);

		widget_config = {
			type: 'widget',
			is_extended: true,
			template: package_content.template,
			container: {class: 'Morph'}
		};

		example.set('widget_config', widget_config);

	},

	_getItemByHash: function(path) {

		var example = null;

		this._properties.examples.each(function(value){
			if (value.get('name') == path) {
				example = value;
				return false;
			}
		});

		return example;

	},

	_getTabsWidget: function() {
		return Lava.view_manager.getViewById('example_tabs');
	},

	_addTab: function(title, text) {

		var tabs_widget = this._getTabsWidget();

		tabs_widget.addTab({
			title_template: [title],
			content_template: [text]
		});

	},

	_showItem: function(example) {

		var constructor,
			widget_config,
			example_content_container = Firestorm.getElementById('example_content_container'),
			tabs = example.get('tabs'),
			i = 0,
			count = tabs.length;

		if (this._properties.selected_example != example) {

			if (this._active_example_widget) {

				this._active_example_widget.remove();
				this._active_example_widget.destroy();
				this.get('selected_example').set('is_selected', false);

			} else {

				Firestorm.Element.setProperty(example_content_container, 'html', '');

			}

			this._set('selected_example', example);
			example.set('is_selected', true);

			widget_config = example.get('widget_config');

			constructor = Lava.ClassManager.getConstructor('Lava.widget.Standard');
			this._active_example_widget = new constructor(widget_config);
			//this._active_example_widget = Lava.createWidget('Example', widget_config);
			this._active_example_widget.inject(example_content_container);

			this._getTabsWidget().removeAllTabs();

			for (; i < count; i++) {
				this._addTab(tabs[i].title, tabs[i].content);
			}

			Lava.refreshViews();

		}

	},

	_getFilePath: function(item) {

		return this.EXAMPLES_DIR + item.get('name') + '.js';

	}

});

Lava.define(
'Lava.widget.WidgetsPage',
{

	Extends: 'Lava.widget.Standard',

	name: 'widgets_page',

	_properties: {
		is_collapsible_expanded: true,
		periodic_elements: null
	},

	_event_handlers: {
		toggle_collapsible_expanded: '_toggleCollapsibleExpanded'
	},

	init: function(config, widget, parent_view, template, properties) {

		this._properties.periodic_elements = Examples.makeLive(ExampleData.periodic_elements);
		this.Standard$init(config, widget, parent_view, template, properties);

	},

	_toggleCollapsibleExpanded: function() {

		this.set('is_collapsible_expanded', !this._properties.is_collapsible_expanded);

	}

});
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
			table_attributes = '';

		if (options) {
			if (options.header_cell_attributes) header_cell_attributes = options.header_cell_attributes;
			if (options.column_cell_attributes) column_cell_attributes = options.column_cell_attributes;
			if (options.description_attributes) description_attributes = options.description_attributes;
			if (options.table_attributes) table_attributes = options.table_attributes;
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
			row_content = '<tr>';
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

	escapeTypeNames: function(type_names) {

		var result = [],
			i = 0,
			count = type_names.length;

		for (; i < count; i++) {
			result.push(Firestorm.String.escape(type_names[i], Firestorm.String.HTML_ESCAPE_REGEX))
		}

		return result;

	},

	renderParamsTable: function(params, table_class) {

		var row_index,
			row_count = params.length,
			column_index,
			column_count = 4,
			rows = [],
			descriptions = [],
			row,
			cell_content,
			param,
			i,
			count,
			tmp;

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
					row.push(this.escapeTypeNames(param.type_names).join('<br/>')); // 3
				} else {
					row.push(''); // 3
				}
				row.push(param.default_value || ''); // 4

				descriptions.push(param.description);
			}
			rows.push(row);
		}

		return this.renderAPITable(rows, descriptions, ['', 'Name', 'Types', 'Default'], {
			table_attributes: 'class="' + table_class + '"',
			header_cell_attributes: ['class="api-flag-td"'],
			column_cell_attributes: ['class="api-flag-td"', 'class="api-name-column"'],
			description_attributes: 'class="api-description-td"'
		});

	},

	renderReturns: function(returns) {

		var result = '<div><b>Returns:</b> ';
		if (returns.is_nullable) result += '<img title="Nullable" src="/www/design/nullable.png" />';
		if (returns.is_non_nullable) result += '<img title="Non-nullable" src="/www/design/non-nullable.png" />';
		if (returns.type_names) {
			if (returns.type_names.length > 1) {
				result += '(' + ApiCommon.escapeTypeNames(returns.type_names).join('|') + ')';
			} else {
				result += returns.type_names[0] || '';
			}
		}
		result += '</div>';
		if (returns.description) {
			result += '<div class="api-pad-left">' + returns.description + '</div>';
		}

		return result;

	}

};
Lava.widgets["Example"] = {
	type: "widget",
	"class": "Lava.WidgetConfigExtensionGateway",
	extender_type: "Default",
	template: [
		"\r\n\t\t\t",
		{
			name: "content",
			type: "include"
		},
		"\r\n\t\t"
	],
	container: {
		"class": "Element",
		tag_name: "div",
		static_classes: ["bs-example"]
	},
	sugar: {
		tag_name: "example",
		is_content_allowed: true,
		content_schema: {type: "template"}
	},
	real_class: "Standard",
	is_extended: false
};
Lava.sugar_map["example"] = {widget_title: "Example"};
Lava.widgets["FolderTree"] = {
	includes: {
		icon: [
			"\r\n\t\t",
			{
				type: "view",
				"class": "View",
				container: {
					"class": "Element",
					tag_name: "i",
					static_classes: ["lava-tree-icon"],
					class_bindings: {
						"0": {
							evaluator: function() {
return ('icon-' + this._binds[0].getValue());
},
							binds: [{
								property_name: "node",
								tail: ["type"]
							}]
						}
					}
				}
			},
			"\r\n\t"
		]
	},
	"extends": "Tree",
	"class": "Lava.WidgetConfigExtensionGateway",
	extender_type: "Default",
	is_extended: false
};
Lava.widgets["EditableTable"] = {
	includes: {
		tbody: [
			"\r\n\t\t",
			{
				type: "view",
				"class": "Foreach",
				argument: {
					evaluator: function() {
return (this._binds[0].getValue());
},
					flags: {isScopeEval: true},
					binds: [{
						locator_type: "Name",
						locator: "table",
						tail: ["records"]
					}]
				},
				as: "row",
				roles: [{
					locator_type: "Name",
					locator: "table",
					name: "_tbody"
				}],
				template: [
					"\r\n\t\t\t\t\r\n\t\t\t\t",
					{
						type: "view",
						"class": "Foreach",
						argument: {
							evaluator: function() {
return (this._binds[0].getValue());
},
							flags: {isScopeEval: true},
							binds: [{
								locator_type: "Name",
								locator: "table",
								tail: ["_columns"]
							}]
						},
						as: "column",
						template: [
							"\r\n\t\t\t\t\t\t",
							{
								type: "view",
								"class": "View",
								container: {
									"class": "Element",
									tag_name: "td"
								},
								template: [
									"\r\n\t\t\t\t\t\t\t",
									{
										type: "view",
										"class": "If",
										argument: {
											evaluator: function() {
return (this._binds[0].getValue() == this._binds[1].getValue());
},
											binds: [
												{property_name: "row"},
												{property_name: "_edit_record"}
											]
										},
										template: [
											"\r\n\t\t\t\t\t\t\t\t",
											{
												locator_type: "Name",
												locator: "table",
												name: "edit_cell",
												arguments: [{
													type: 2,
													data: {property_name: "column"}
												}],
												type: "include"
											},
											"\r\n\t\t\t\t\t\t\t"
										],
										else_template: [
											"\r\n\t\t\t\t\t\t\t\t",
											{
												locator_type: "Name",
												locator: "table",
												name: "cell",
												arguments: [{
													type: 2,
													data: {property_name: "column"}
												}],
												type: "include"
											},
											"\r\n\t\t\t\t\t\t\t"
										]
									},
									"\r\n\t\t\t\t\t\t"
								]
							},
							"\r\n\t\t\t\t\t"
						],
						container: {
							"class": "Element",
							tag_name: "tr",
							events: {
								click: [{
									locator_type: "Name",
									locator: "table",
									name: "row_click",
									arguments: [{
										type: 2,
										data: {property_name: "row"}
									}]
								}]
							}
						}
					},
					"\r\n\t\t\t"
				],
				container: {
					"class": "Element",
					tag_name: "tbody",
					resource_id: {
						locator_type: "Name",
						locator: "table",
						name: "TBODY_ELEMENT"
					}
				}
			},
			"\r\n\t"
		]
	},
	storage: {
		edit_cells: {
			type: "template_hash",
			schema: {
				type: "template_hash",
				tag_name: "template",
				name: "edit_cells"
			},
			value: {
				String: [
					"\r\n\t\t\t\t",
					{
						type: "widget",
						"class": "Lava.WidgetConfigExtensionGateway",
						extender_type: "Default",
						"extends": "TextInput",
						bindings: {
							value: {
								property_name: "value",
								path_config: {
									property_name: "row",
									tail: [{
										property_name: "column",
										tail: ["name"]
									}]
								}
							}
						}
					},
					"\r\n\t\t\t"
				],
				Boolean: [
					"\r\n\t\t\t\t",
					{
						type: "widget",
						"class": "Lava.WidgetConfigExtensionGateway",
						extender_type: "Default",
						"extends": "CheckBox",
						bindings: {
							is_checked: {
								property_name: "is_checked",
								path_config: {
									property_name: "row",
									tail: [{
										property_name: "column",
										tail: ["name"]
									}]
								}
							}
						}
					},
					"\r\n\t\t\t"
				]
			}
		}
	},
	resources: {
		"default": {
			TABLE_ELEMENT: {
				type: "container_stack",
				value: [{
					name: "add_classes",
					value: ["demo-table"]
				}]
			}
		}
	},
	real_class: "EditableTableExample",
	"extends": "Table",
	"class": "Lava.WidgetConfigExtensionGateway",
	extender_type: "Default",
	is_extended: false
};
