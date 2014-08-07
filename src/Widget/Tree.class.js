
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
		},
		is_expanded_meta_storage_bind_config: Lava.ExpressionParser.parseScopeEval('$tree.meta_storage[node.guid].is_expanded'),
		is_expanded_direct_bind_config: Lava.ExpressionParser.parseScopeEval('node.is_expanded')
	},

	_properties: {
		records: null
	},

	_event_handlers: {
		node_click: '_onNodeClick'
	},

	_meta_storage: null,
	_is_expanded_bind_config: null,

	init: function(config, widget, parent_view, template, properties) {

		this.Standard$init(config, widget, parent_view, template, properties);

		this._is_expanded_bind_config = this._shared.is_expanded_direct_bind_config;
		if (config.options && config.options.use_meta_storage) {
			this._meta_storage = new Lava.data.MetaStorage(this._shared.meta_storage_config);
			this.set('meta_storage', this._meta_storage);
			this._is_expanded_bind_config = this._shared.is_expanded_meta_storage_bind_config;
		}

	},

	_onNodeClick: function(dom_event_name, dom_event, view, template_arguments) {

		var property_source = this._meta_storage ? this._meta_storage.get(template_arguments[0].guid) : template_arguments[0];
		property_source.set('is_expanded', !property_source.get('is_expanded'));
		dom_event.preventDefault(); // to prevent text selection

	},

	_toggleTree: function(node, expanded_state) {

		var children = node.get('children'),
			child,
			i = 0,
			count = children.getCount(),
			property_source;

		if (count) {

			for (; i < count; i++) {
				child = children.getValueAt(i);
				if (child.get('children').getCount()) {
					this._toggleTree(child, expanded_state);
				}
			}

			property_source = this._meta_storage ? this._meta_storage.get(node.guid) : node;
			property_source.set('is_expanded', expanded_state);

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

	/**
	 * @param {Lava.view.Abstract} view
	 * @param {_cDynamicScope} config
	 */
	getDynamicScope: function(view, config) {

		if (config.property_name != 'is_expanded') Lava.t('unknown dynamic scope: ' + config.property_name);
		return view.getScopeByPathConfig(this._is_expanded_bind_config);

	},

	destroy: function() {

		if (this._meta_storage) {
			this._meta_storage.destroy();
			this._meta_storage = null;
		}

		this.Standard$destroy();

	}

});