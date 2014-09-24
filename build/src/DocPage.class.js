
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