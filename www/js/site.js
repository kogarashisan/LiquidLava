
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

	_properties: {
		records: null
	},

	init: function(config, widget, parent_view, template, properties) {

		this._properties.records = Examples.makeLive(api_tree_source);
		this.ContentLoader$init(config, widget, parent_view, template, properties);

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

Lava.define(
'Lava.widget.MainPageTree',
{

	Extends: 'Lava.widget.Standard',
	name: 'tree',

	_properties: {
		records: null
	},

	_event_handlers: {
		node_click: '_onNodeClick'
	},

	_onNodeClick: function(dom_event_name, dom_event, view, template_arguments) {

		var node = template_arguments[0];
		node.set('is_expanded', !node.get('is_expanded'));
		dom_event.preventDefault(); // to prevent text selection

	}

});
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

var MainPageTemplate = [{
	type: "widget",
	"class": "Lava.WidgetConfigExtensionGateway",
	extender_type: "Default",
	"extends": "Example",
	includes: {
		content: [
			"\r\n\t<div class=\"col-md-6\" style=\"padding: 1em;overflow: auto;height: 370px;position: relative;\">\r\n\t\t",
			{
				includes: {
					node_body: [
						"\r\n\t\t\t\t",
						{
							type: "view",
							"class": "View",
							container: {
								"class": "Element",
								tag_name: "div",
								static_classes: ["lava-tree-node"],
								static_properties: {unselectable: "on"},
								class_bindings: {
									"0": {
										evaluator: function() {
return ('level-' + this._binds[0].getValue());
},
										binds: [{property_name: "level"}]
									}
								}
							},
							template: [
								"\r\n\t\t\t\t\t",
								{
									type: "view",
									"class": "Expression",
									argument: {
										evaluator: function() {
return (this._binds[0].getValue());
},
										flags: {isScopeEval: true},
										binds: [{property_name: "pad"}]
									},
									escape_off: true,
									template: []
								},
								{
									type: "view",
									"class": "View",
									container: {
										"class": "Element",
										tag_name: "i",
										static_classes: ["lava-tree-expander"],
										events: {
											click: [{
												locator_type: "Name",
												locator: "tree",
												name: "node_click",
												arguments: [{
													type: 2,
													data: {property_name: "node"}
												}]
											}]
										},
										class_bindings: {
											"0": {
												evaluator: function() {
return ('lava-tree' + ((this._binds[0].getValue() == this._binds[1].getValue() - 1) ? '-bottom' : '-middle') + ((this._binds[2].getValue() == 'folder' && this._binds[3].getValue()) ? (this._binds[4].getValue() ? '-expanded' : '-collapsed') : '-node'));
},
												binds: [
													{property_name: "foreach_index"},
													{
														locator_type: "Label",
														locator: "parent",
														property_name: "count"
													},
													{
														property_name: "node",
														tail: ["type"]
													},
													{
														property_name: "node",
														tail: [
															"children",
															"length"
														]
													},
													{
														property_name: "node",
														tail: ["is_expanded"]
													}
												]
											}
										}
									}
								},
								{
									locator_type: "Name",
									locator: "tree",
									name: "icon",
									type: "include"
								},
								"\r\n\t\t\t\t\t",
								{
									locator_type: "Name",
									locator: "tree",
									name: "node_title",
									type: "include"
								},
								"\r\n\t\t\t\t"
							]
						},
						"\r\n\t\t\t"
					],
					node_children: [
						"\r\n\t\t\t\t",
						{
							type: "view",
							"class": "If",
							argument: {
								evaluator: function() {
return (this._binds[0].getValue() && this._binds[1].getValue());
},
								binds: [
									{
										property_name: "node",
										tail: [
											"children",
											"length"
										]
									},
									{
										property_name: "node",
										tail: ["is_expanded"]
									}
								]
							},
							container: {
								"class": "Emulated",
								options: {placement: "after-previous"}
							},
							refresher: {"class": "Collapse"},
							assigns: {
								pad: {
									evaluator: function() {
return ((this._binds[0].getValue() == this._binds[1].getValue() - 1) ? this._binds[2].getValue() + '<div class="lava-tree-pad"></div>' : this._binds[3].getValue() + '<div class="lava-tree-pad-line"></div>');
},
									binds: [
										{property_name: "foreach_index"},
										{property_name: "count"},
										{property_name: "pad"},
										{property_name: "pad"}
									]
								},
								level: {
									evaluator: function() {
return (this._binds[0].getValue() + 1);
},
									binds: [{
										locator_type: "Label",
										locator: "parent",
										property_name: "level"
									}]
								}
							},
							template: [
								"\r\n\t\t\t\t\t\r\n\t\t\t\t\t\r\n\t\t\t\t\t\r\n\t\t\t\t\t\r\n\t\t\t\t\t",
								{
									type: "view",
									"class": "Foreach",
									argument: {
										evaluator: function() {
return (this._binds[0].getValue());
},
										flags: {isScopeEval: true},
										binds: [{
											property_name: "node",
											tail: ["children"]
										}]
									},
									as: "node",
									template: [
										"\r\n\t\t\t\t\t\t\t",
										{
											locator_type: "Name",
											locator: "tree",
											name: "node",
											type: "include"
										},
										"\r\n\t\t\t\t\t\t"
									],
									container: {
										"class": "Element",
										tag_name: "div",
										static_classes: ["lava-tree-container"]
									}
								},
								"\r\n\t\t\t\t"
							]
						},
						"\r\n\t\t\t"
					]
				},
				real_class: "MainPageTree",
				"extends": "Tree",
				id: "main_page_tree",
				assigns: {
					records: {
						evaluator: function() {
return (this._binds[0].getValue());
},
						flags: {isScopeEval: true},
						binds: [{property_name: "tree_records"}]
					}
				},
				"class": "Lava.WidgetConfigExtensionGateway",
				extender_type: "Default",
				type: "widget"
			},
			"\r\n\t</div>\r\n\t<div class=\"col-md-6\" style=\"padding: 1em\">\r\n\t\t",
			{
				options: {
					columns: [
						{
							name: "title",
							title: "Title",
							type: "String",
							is_editable: true
						},
						{
							name: "type",
							title: "Type",
							type: "String"
						},
						{
							name: "is_expanded",
							title: "Expanded?",
							type: "Boolean",
							is_editable: true
						}
					]
				},
				"extends": "EditableTable",
				id: "main_page_table",
				assigns: {
					records: {
						evaluator: function() {
return (this._binds[0].getValue());
},
						flags: {isScopeEval: true},
						binds: [{property_name: "all_tree_records"}]
					}
				},
				"class": "Lava.WidgetConfigExtensionGateway",
				extender_type: "Default",
				type: "widget"
			},
			"\r\n\t</div>\r\n\t<div class=\"clearfix\"></div>\r\n"
		]
	},
	id: "main_page_example"
}];
