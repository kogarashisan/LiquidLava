
Lava.define(
'Lava.widget.ApiPage',
{

	Extends: 'Lava.widget.ContentLoader',

	_properties: {
		api_tree: null,
		descriptor: null,
		extended_descriptor: null,
		member_grouping: true
	},

	_event_handlers: {
		node_click: '_onNodeClick'
	},

	API_DIR: 'api/',

	_class_content_widget: null,

	init: function(config, widget, parent_view, template, properties) {

		this._properties.api_tree = Examples.makeLive(api_tree_source);
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

	_onItemLoaded: function(text, item) {

		item.set('extended_descriptor', eval('(' + text + ')'));

	},

	_getItemByHash: function(path) {

		/*var version = null;

		this._properties.versions.each(function(value){
			if (value.get('name') == path) {
				version = value;
				return false;
			}
		});

		return version;*/

	},

	_showItem: function(item) {

		if (this._properties.descriptor != item) {

			if (this._properties.descriptor) this._properties.descriptor.set('is_selected', false);

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

	}

});