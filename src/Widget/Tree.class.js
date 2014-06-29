
Lava.define(
'Lava.widget.Tree',
/**
 * @lends Lava.widget.Tree#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',
	Shared: '_shared',

	name: 'tree',

	_shared: {
		meta_storage_config: {
			fields: {
				'is_expanded': {type:'Boolean'}
			}
		}
	},

	_meta_storage: null,

	_properties: {
		records: null
	},

	_event_handlers: {
		node_click: '_onNodeClick'
	},

	init: function(config, widget, parent_view, template, properties) {

		this.Standard$init(config, widget, parent_view, template, properties);

		this._meta_storage = new Lava.data.MetaStorage(this._shared.meta_storage_config);
		this.set('meta_storage', this._meta_storage);

	},

	_onNodeClick: function(dom_event_name, dom_event, view, template_arguments) {

		var meta_record = this._meta_storage.get(template_arguments[0].guid);
		meta_record.set('is_expanded', !meta_record.get('is_expanded'));
		dom_event.preventDefault(); // to prevent text selection

	},

	_toggleTree: function(node, expanded_state) {

		var children = node.get('children'),
			child,
			i = 0,
			count = children.getCount(),
			meta_record;

		if (count) {

			for (; i < count; i++) {
				child = children.getValueAt(i);
				if (child.get('children').getCount()) {
					this._toggleTree(child, expanded_state);
				}
			}

			meta_record = this._meta_storage.get(node.guid);
			meta_record.set('is_expanded', expanded_state);

		}

	},

	_toggleRecords: function(expanded_state) {

		var records = this._properties.records,
			i = 0,
			count,
			record;

		if (records) {
			count = records.getCount(); // Enumerable
			for (; i < count; i++) {
				record = records.getValueAt(i);
				this._toggleTree(record, expanded_state);
			}
		}

	},

	expandAll: function() {

		this._toggleRecords(true);

	},

	collapseAll: function() {

		this._toggleRecords(false);

	},

	destroy: function() {

		this._meta_storage.destroy();
		this._meta_storage = null;

		this.Standard$destroy();

	}

});