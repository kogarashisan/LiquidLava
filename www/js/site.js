
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

	_loadItemByHash: function(hash) {

		var path = hash.substr(1),
			item = this._getItemByHash(path);

		if (item) {
			this._loadItem(item);
		} else {
			window.alert('Page not found: ' + path);
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
		Lava.refreshViews();

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
		Lava.refreshViews();

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

		var hash = window.location.hash;

		this._properties.versions = Examples.makeLive(LavaVersions);
		this.ContentLoader$init(config, widget, parent_view, template, properties);

		if (hash) {

			this._loadItemByHash(hash);

		}

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
'Lava.widget.DocPage',
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
	_tab_names: ['tutorials', 'reference', 'api'],
	_type_to_tab_map: {
		tutorial: 'tutorials',
		reference: 'reference',
		object: 'api',
		class: 'api'
	},

	_properties: {
		// navigation tree to the left
		api_tree: null,
		// another navigation tree - for Firestorm API
		firestorm_api_tree: null,
		reference_nav_tree: null,
		meta_storage: null,

		sugar_descriptor: null, // short descriptors for links in navigation tree
		support_descriptor: null
	},

	_event_handlers: {
		node_click: '_onNodeClick',
		member_row_click: '_onMemberRowClick',
		content_area_click: '_onContentAreaClick'
	},

	_role_handlers: {
		nav_tabs: '_handleNavTabs'
	},

	_modifiers: {
		render_params: '_renderParams',
		render_event_ext: '_renderEventExt',
		render_method_extended: '_renderMethodExtended'
	},

	DIRS: {
		object: 'api/',
		'class': 'api/',
		reference: 'reference/',
		tutorial: 'tutorial/'
	},

	_tabs_widget: null, // registered via role
	_color_animation: null,
	_hashchange_listener: null,
	_active_tab_changed_listener: null,

	_name_groups: {api: {}, reference: {}, tutorials: {}}, // used to find items from navigation trees by hash
	_tab_hash_data: {api: {}, reference: {}, tutorials: {}},
	_tab_content_widgets: {},
	_tab_items: {},
	_active_tab_name: 'reference',

	init: function(config, widget, parent_view, template, properties) {

		this._color_animation = new Lava.animation.Standard({
			duration: 1500,
			transition: function(x) {
				return (x < 0.5) ? Lava.transitions.inOutCubic(x*2) : Lava.transitions.inOutCubic(1 - (x - 0.5)*2);
			},
			animators: [
				{type: 'Color', from: [255, 255, 255], to: [255, 128, 128], property: 'background-color'}
			]
		}, null);

		this._properties.api_tree = Examples.makeLive(api_tree_source);
		this._prepareTree(this._name_groups.api, this._properties.api_tree, 'api', null);
		this._properties.firestorm_api_tree = Examples.makeLive(firestorm_api_tree_source);
		this._prepareTree(this._name_groups.api, this._properties.firestorm_api_tree, 'api', null);
		this._properties.reference_nav_tree = Examples.makeLive(reference_nav_tree_source);
		this._prepareTree(this._name_groups.reference, this._properties.reference_nav_tree, 'reference', null);

		this._tab_content_widgets.api = Lava.createWidget('ClassContent');
		this._properties.sugar_descriptor = new Lava.mixin.Properties({
			type: 'object', name: 'Widgets', title: 'Widgets', tab_name: 'api', parent: null
		});
		this._name_groups.api['Widgets'] = this._properties.sugar_descriptor;
		this._properties.support_descriptor = new Lava.mixin.Properties({
			type: 'object', name: 'Support', title: 'Support', tab_name: 'api', parent: null
		});
		this._name_groups.api['Support'] = this._properties.support_descriptor;

		this.ContentLoader$init(config, widget, parent_view, template, properties);

		this._hashchange_listener = Lava.Core.addGlobalHandler('hashchange', this._onHashChange, this);
		if (window.location.hash) {
			this._loadItemByHash(window.location.hash);
		}

	},

	_prepareTree: function(hash, collection, tab_name, parent) {

		var children,
			self = this;

		collection.each(function(record) {
			record.set('parent', parent);
			record.set('tab_name', tab_name);
			if (record.get('type') != 'folder') {
				hash[record.get('name')] = record;
			}
			children = record.get('children');
			if (children) {
				self._prepareTree(hash, children, tab_name, record);
			}
		})

	},

	_onNodeClick: function(dom_event_name, dom_event, view, template_arguments) {

		var node = template_arguments[0];

		if (node.get('type') == 'folder') {

			node.set('is_expanded', !node.get('is_expanded'));

		}

	},

	_onMemberRowClick: function(dom_event_name, dom_event, view, template_arguments) {

		var member_descriptor = template_arguments[0],
			may_be_expanded = member_descriptor.get('params') || member_descriptor.get('type_names') || member_descriptor.get('returns');

		if (dom_event.target.nodeName.toLowerCase() != 'a') { // links inside member description

			if (member_descriptor.isProperties && member_descriptor.get('guid') && may_be_expanded) {
				var meta_record = this._properties.meta_storage.get(template_arguments[0].get('guid'));
				meta_record.set('is_expanded', !meta_record.get('is_expanded'));
			}

		}

	},

	_onContentAreaClick: function(dom_event_name, dom_event) {
		var target = dom_event.target,
			hash = window.location.hash;
		if (target && target.nodeName.toLowerCase() == 'a' && target.href && target.href.substr(-hash.length) == hash) {
			this._scrollToTarget();
		}
	},

	_initItemChain: function(chain) {

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
			}
		}

	},

	_onItemLoaded: function(text, short_descriptor) {

		var type = short_descriptor.get('type'),
			extended_descriptor,
			events,
			support_objects,
			i = 0,
			count;

		if (type == 'class' || type == 'object') {

			extended_descriptor = eval('(' + text + ')');
			events = extended_descriptor.events;
			support_objects = extended_descriptor.support_objects;

			if (extended_descriptor.method_chain) this._initItemChain(extended_descriptor.method_chain);
			//if (extended_descriptor.member_chain) this._initItemChain(extended_descriptor.member_chain);

			if (events) {
				for (i = 0, count = events.length; i < count; i++) {
					events[i].guid = Lava.guid++;
					events[i] = new Lava.mixin.Properties(events[i]);
				}
			}

			if (support_objects) {
				for (i = 0, count = support_objects.length; i < count; i++) {
					if (support_objects[i].method_chain) this._initItemChain(support_objects[i].method_chain);
				}
			}

			short_descriptor.set('extended_descriptor', extended_descriptor);

		} else if (type == 'reference' || type == 'tutorials') {

			short_descriptor.set('widget_config', eval('(' + text + ')'));

		} else {

			Lava.t('unknown item type: ' + type);

		}

	},

	_parseHash: function(hash_string) {

		var result = {
				hash: hash_string,
				item_hash: null,
				item:null
			},
			segments = hash_string.substr(1).split(';'),
			parts,
			i = 0,
			count = segments.length,
			name_group,
			item_name,
			item_type,
			hash = {};

		for (; i < count; i++) {
			parts = segments[i].split('=');
			if (parts.length == 2) {
				hash[parts[0]] = parts[1];
			}
		}

		for (item_type in this._type_to_tab_map) {
			if (item_type in hash) {
				result['tab'] = this._type_to_tab_map[item_type];
				break;
			}
		}

		if (('tab' in hash) && result['tab'] && result['tab'] != hash['tab']) {
			result.is_invalid = true; // malformed URL
		}
		if (('tab' in hash)) {
			if (this._tab_names.indexOf(hash['tab']) == -1) {
				result.is_invalid = true;
			} else if (!result['tab']) {
				result['tab'] = hash['tab'];
			}
		}

		if (item_type && hash[item_type]) {
			name_group = this._name_groups[this._type_to_tab_map[item_type]];
			item_name = hash[item_type];
			if (item_name in name_group) {
				result['item'] = name_group[item_name];
				result.item_hash = '#' + item_type + '=' + item_name;
			} else {
				result.is_invalid = true;
			}
		}

		var scroll_targets = ['config', 'property', 'event', 'member'];
		for (i = 0, count = scroll_targets.length; i < count; i++) {
			if (scroll_targets[i] in hash) {
				result['scroll_target'] = scroll_targets[i] + ':' + hash[scroll_targets[i]];
			}
		}

		return result;

	},

	_loadItemByHash: function(hash) {

		var hash_data = this._parseHash(hash),
			item = hash_data['item'];

		if (hash_data['tab']) this._selectTab(hash_data['tab']);

		if (item) {

			this._tab_hash_data[hash_data['tab']] = hash_data;

			if (item.get('is_loaded')) {

				this._showItem(item);
				this._scrollToTarget();

			} else {

				this._loadItem(item);

			}

		} else if (hash_data.is_invalid) {

			window.alert('Invalid URL: ' + hash);

		}

	},

	_showItem: function(item) {

		var content_area = Lava.view_manager.getViewById('content_area').getContainer().getDOMElement(),
			item_tab = item.get('tab_name'),
			is_item_changed = (this._tab_items[item_tab] != item),
			is_tab_changed = (this._active_tab_name != item_tab),
			active_widget = this._tab_content_widgets[this._active_tab_name],
			tab_widget = this._tab_content_widgets[item_tab];

		this._selectTab(item_tab);
		if (is_item_changed || is_tab_changed) {
			if (item_tab != 'api' && active_widget && active_widget.isInDOM()) active_widget.remove();
		}

		if (is_item_changed) {

			if (item_tab == 'api') {
				// each time a class is selected - the expanded state of all members needs to be forgotten
				this._properties.meta_storage && this._properties.meta_storage.destroy();
				this._set('meta_storage', new Lava.data.MetaStorage(this._shared.meta_storage_config));
				tab_widget.set('descriptor', item);
				tab_widget.set('extended_descriptor', item.get('extended_descriptor'));
			} else {
				tab_widget && tab_widget.destroy();
				tab_widget = new Lava.widget.Standard(item.get('widget_config'));
				this._tab_content_widgets[item_tab] = tab_widget;
			}

			if (this._tab_items[item_tab]) {
				this._tab_items[item_tab].set('is_selected', false);
			}
			this._tab_items[item_tab] = item;
			this._expandItemParents(item);
			item.set('is_selected', true);
		}

		if (is_item_changed || is_tab_changed) {
			if (tab_widget && !tab_widget.isInDOM()) tab_widget.inject(content_area, 'Top');
		}
		Lava.refreshViews();

	},

	_scrollToTarget: function() {

		var self = this,
			content_area,
			scroll_animation,
			scroll_target_attribute = this._tab_hash_data[this._active_tab_name]['scroll_target'],
			scroll_target;

		if (scroll_target_attribute) {

			window.setTimeout(function(){

				content_area = Lava.view_manager.getViewById('content_area').getContainer().getDOMElement();
				scroll_target = Firestorm.Element.selectElements(content_area, '*[data-scroll-name=' + scroll_target_attribute + ']')[0];
				if (scroll_target) {

					scroll_animation = new Fx.Scroll(window, {duration: 1000}); // @todo MooTools dependency
					scroll_animation.addEvent('complete', function(){
						self._color_animation.finish(); // finish with the old target
						self._color_animation.setTarget(scroll_target);
						self._color_animation.start();
					});
					scroll_animation.toElementCenter(scroll_target);

				}

			}, 0);

		} else {

			window.scrollTo(0,0);

		}

	},

	_onTabSelected: function(tabs_widget) {

		var new_tab_name = tabs_widget.get('active_tab').get('name'),
			new_tab_hash_data = this._tab_hash_data[new_tab_name],
			new_tab_widget = this._tab_content_widgets[new_tab_name],
			current_active_widget = this._tab_content_widgets[this._active_tab_name];

		if (this._request == null && new_tab_name != this._active_tab_name) {

			current_active_widget && current_active_widget.isInDOM() && current_active_widget.remove();
			new_tab_widget && !new_tab_widget.isInDOM() && new_tab_widget.inject(
				Lava.view_manager.getViewById('content_area').getContainer().getDOMElement(),
				'Top'
			);
			this._setWindowHash(new_tab_hash_data.item_hash || 'tab=' + new_tab_name);
			this._active_tab_name = new_tab_name;

		}

	},

	_onHashChange: function(event_name, event) {

		if (this._request == null && window.location.hash) {

			this._loadItemByHash(window.location.hash);

		}

	},

	_onRequestSuccess: function(text, item) {

		this.ContentLoader$_onRequestSuccess(text, item);
		this._scrollToTarget();
		this._setWindowHash(this._tab_hash_data[this._active_tab_name].hash);

	},

	_renderParams: function(params, table_class, scroll_prefix) {

		return ApiCommon.renderParamsTable(params, table_class, scroll_prefix);

	},

	_renderEventExt: function(event_descriptor) {

		return ApiCommon.renderEventExt(event_descriptor.getProperties());

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

	},

	_getFilePath: function(item) {

		var path = item.get('type') == 'reference' ? item.get('relative_path') : item.get('name');
		return this.DIRS[item.get('type')] + path + '.js';

	},

	_handleNavTabs: function(tabs_widget) {

		this._tabs_widget = tabs_widget;
		tabs_widget.getTabObjects()[this._tab_names.indexOf(this._active_tab_name)].set('is_active', true);
		this._active_tab_changed_listener = tabs_widget.onPropertyChanged('active_tab', this._onTabSelected, this);

	},

	_setWindowHash: function(new_hash) {
		Lava.suspendListener(this._hashchange_listener);
		window.location.hash = new_hash;
		Lava.resumeListener(this._hashchange_listener);
	},
	
	_selectTab: function(tab_name) {

		if (this._tabs_widget) {
			Lava.suspendListener(this._active_tab_changed_listener);
			this._tabs_widget.getTabObjects()[this._tab_names.indexOf(tab_name)].set('is_active', true);
			Lava.resumeListener(this._active_tab_changed_listener);
		}
		this._active_tab_name = tab_name;

	},

	_expandItemParents: function(item) {
		var parent = item.get('parent');
		while (parent) {
			parent.set('is_expanded', true);
			parent = parent.get('parent');
		}
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

		var demo_module = Lava.app.getModule('DemoTree'),
			hash = window.location.hash;

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

		if (hash) {

			this._loadItemByHash(hash);

		}

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
			title: [title],
			content: [text]
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
MooTools.More = {
	version: '1.5.2-dev',
	build: '%build%'
};

/*
---

script: Fx.Scroll.js

name: Fx.Scroll

description: Effect to smoothly scroll any element, including the window.

license: MIT-style license

authors:
  - Valerio Proietti

requires:
  - Core/Fx
  - Core/Element.Event
  - Core/Element.Dimensions
  - MooTools.More

provides: [Fx.Scroll]

...
*/

(function(){

Fx.Scroll = new Class({

	Extends: Fx,

	options: {
		offset: {x: 0, y: 0},
		wheelStops: true
	},

	initialize: function(element, options){
		this.element = this.subject = document.id(element);
		this.parent(options);

		if (typeOf(this.element) != 'element') this.element = document.id(this.element.getDocument().body);

		if (this.options.wheelStops){
			var stopper = this.element,
				cancel = this.cancel.pass(false, this);
			this.addEvent('start', function(){
				stopper.addEvent('mousewheel', cancel);
			}, true);
			this.addEvent('complete', function(){
				stopper.removeEvent('mousewheel', cancel);
			}, true);
		}
	},

	set: function(){
		var now = Array.flatten(arguments);
		this.element.scrollTo(now[0], now[1]);
		return this;
	},

	compute: function(from, to, delta){
		return [0, 1].map(function(i){
			return Fx.compute(from[i], to[i], delta);
		});
	},

	start: function(x, y){
		if (!this.check(x, y)) return this;
		var scroll = this.element.getScroll();
		return this.parent([scroll.x, scroll.y], [x, y]);
	},

	calculateScroll: function(x, y){
		var element = this.element,
			scrollSize = element.getScrollSize(),
			scroll = element.getScroll(),
			size = element.getSize(),
			offset = this.options.offset,
			values = {x: x, y: y};

		for (var z in values){
			if (!values[z] && values[z] !== 0) values[z] = scroll[z];
			if (typeOf(values[z]) != 'number') values[z] = scrollSize[z] - size[z];
			values[z] += offset[z];
		}

		return [values.x, values.y];
	},

	toTop: function(){
		return this.start.apply(this, this.calculateScroll(false, 0));
	},

	toLeft: function(){
		return this.start.apply(this, this.calculateScroll(0, false));
	},

	toRight: function(){
		return this.start.apply(this, this.calculateScroll('right', false));
	},

	toBottom: function(){
		return this.start.apply(this, this.calculateScroll(false, 'bottom'));
	},

	toElement: function(el, axes){
		axes = axes ? Array.from(axes) : ['x', 'y'];
		var scroll = isBody(this.element) ? {x: 0, y: 0} : this.element.getScroll();
		var position = Object.map(document.id(el).getPosition(this.element), function(value, axis){
			return axes.contains(axis) ? value + scroll[axis] : false;
		});
		return this.start.apply(this, this.calculateScroll(position.x, position.y));
	},

	toElementEdge: function(el, axes, offset){
		axes = axes ? Array.from(axes) : ['x', 'y'];
		el = document.id(el);
		var to = {},
			position = el.getPosition(this.element),
			size = el.getSize(),
			scroll = this.element.getScroll(),
			containerSize = this.element.getSize(),
			edge = {
				x: position.x + size.x,
				y: position.y + size.y
			};

		['x', 'y'].each(function(axis){
			if (axes.contains(axis)){
				if (edge[axis] > scroll[axis] + containerSize[axis]) to[axis] = edge[axis] - containerSize[axis];
				if (position[axis] < scroll[axis]) to[axis] = position[axis];
			}
			if (to[axis] == null) to[axis] = scroll[axis];
			if (offset && offset[axis]) to[axis] = to[axis] + offset[axis];
		}, this);

		if (to.x != scroll.x || to.y != scroll.y) this.start(to.x, to.y);
		return this;
	},

	toElementCenter: function(el, axes, offset){
		axes = axes ? Array.from(axes) : ['x', 'y'];
		el = document.id(el);
		var to = {},
			position = el.getPosition(this.element),
			size = el.getSize(),
			scroll = this.element.getScroll(),
			containerSize = this.element.getSize();

		['x', 'y'].each(function(axis){
			if (axes.contains(axis)){
				to[axis] = position[axis] - (containerSize[axis] - size[axis]) / 2;
			}
			if (to[axis] == null) to[axis] = scroll[axis];
			if (offset && offset[axis]) to[axis] = to[axis] + offset[axis];
		}, this);

		if (to.x != scroll.x || to.y != scroll.y) this.start(to.x, to.y);
		return this;
	}

});

//<1.2compat>
Fx.Scroll.implement({
	scrollToCenter: function(){
		return this.toElementCenter.apply(this, arguments);
	},
	scrollIntoView: function(){
		return this.toElementEdge.apply(this, arguments);
	}
});
//</1.2compat>

function isBody(element){
	return (/^(?:body|html)$/i).test(element.tagName);
}

})();

Lava.widgets["Example"] = {
	type: "widget",
	"class": "Lava.WidgetConfigExtensionGateway",
	extender_type: "Standard",
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
		content_schema: {
			type: "include",
			name: "content"
		}
	},
	real_class: "Standard",
	is_extended: false
};
Lava.sugar_map["example"] = {widget_title: "Example"};
Lava.widgets["FolderTree"] = {
	"extends": "Tree",
	includes: {
		icon: [
			"\r\n\t\t",
			{
				type: "view",
				"class": "View",
				container: {
					"class": "Element",
					tag_name: "img",
					static_classes: ["lava-tree-icon"],
					property_bindings: {
						src: {
							evaluator: function() {
return ('/www/design/tree/' + this._binds[0].getValue() + '.gif');
},
							binds: [{
								property_name: "node",
								tail: ["type"]
							}]
						}
					},
					class_bindings: {
						"0": {
							evaluator: function() {
return ('lava-tree-icon-' + this._binds[0].getValue());
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
	"class": "Lava.WidgetConfigExtensionGateway",
	extender_type: "Standard",
	is_extended: false
};
Lava.widgets["EditableTable"] = {
	"extends": "Table",
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
	storage_schema: {
		edit_cells: {
			type: "template_hash",
			tag_name: "cell"
		}
	},
	storage: {
		edit_cells: {
			String: [
				"\r\n\t\t\t\t",
				{
					type: "widget",
					"class": "Lava.WidgetConfigExtensionGateway",
					extender_type: "Standard",
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
					extender_type: "Standard",
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
	"class": "Lava.WidgetConfigExtensionGateway",
	extender_type: "Standard",
	is_extended: false
};
