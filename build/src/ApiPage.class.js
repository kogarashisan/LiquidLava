
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