
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
		// @todo not implemented
		member_grouping: true,
		meta_storage: null

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
		this.ContentLoader$init(config, widget, parent_view, template, properties);

	},

	_onNodeClick: function(dom_event_name, dom_event, view, template_arguments) {

		var node = template_arguments[0];
		if (node.get('type') == 'class') {

			this._selectItem(dom_event_name, dom_event, view, template_arguments);

		} else {

			node.set('is_expanded', !node.get('is_expanded'));

		}

		dom_event.preventDefault(); // to prevent text selection

	},

	_onMemberRowClick: function(dom_event_name, dom_event, view, template_arguments) {

		var member_descriptor = template_arguments[0];
		if (member_descriptor.isProperties && (member_descriptor.get('returns') || member_descriptor.get('params'))) {
			var meta_record = this._properties.meta_storage.get(template_arguments[0].get('guid'));
			meta_record.set('is_expanded', !meta_record.get('is_expanded'));
		}

	},

	_onItemLoaded: function(text, item) {

		var extended_descriptor = eval('(' + text + ')'),
			method_chain = extended_descriptor.method_chain,
			member_chain = extended_descriptor.member_chain,
			group_index = 0,
			group_count,
			i = 0,
			count,
			descriptors,
			all_method_descriptors = [],
			all_member_descriptors = [];

		item.set('extended_descriptor', extended_descriptor);

		if (method_chain) {
			for (group_count = method_chain.length; group_index < group_count; group_index++) {
				descriptors = method_chain[group_index].descriptors;
				for (i = 0, count = descriptors.length; i < count; i++) {
					descriptors[i].guid = Lava.guid++;
					descriptors[i] = new Lava.mixin.Properties(descriptors[i]);
					all_method_descriptors.push(descriptors[i]);
				}
			}
		}

		if (member_chain) {
			for (group_count = member_chain.length; group_index < group_count; group_index++) {
				descriptors = member_chain[group_index].descriptors;
				for (i = 0, count = descriptors.length; i < count; i++) {
					descriptors[i].guid = Lava.guid++;
					descriptors[i] = new Lava.mixin.Properties(descriptors[i]);
					all_member_descriptors.push(descriptors[i]);
				}
			}
		}

		item.set('all_methods', new Lava.system.Enumerable(all_method_descriptors));
		item.set('all_members', new Lava.system.Enumerable(all_member_descriptors));

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

	}

});