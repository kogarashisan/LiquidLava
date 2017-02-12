
Lava.define(
'Lava.widget.Tree',
/**
 * Tree with expandable nodes
 * @lends Lava.widget.Tree#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',
	Shared: ['_meta_storage_config', '_default_if_refresher_config', '_foreach_refresher_config',
		'_direct_bind_configs', '_meta_storage_bind_configs'],

	name: 'tree',

	/**
	 * Dynamic scope configs which use direct bindings to record properties
	 */
	_direct_bind_configs: {
		is_expanded: Lava.ExpressionParser.parseScopeEval('node.is_expanded'),
		is_expandable: Lava.ExpressionParser.parseScopeEval('node.children.length')
	},

	/**
	 * Dynamic scope configs for columns from MetaStorage
	 * @type {Object}
	 */
	_meta_storage_bind_configs: {
		is_expanded: Lava.ExpressionParser.parseScopeEval('$tree.meta_storage[node.guid].is_expanded'),
		// can be used by inherited classes
		is_expandable: Lava.ExpressionParser.parseScopeEval('$tree.meta_storage[node.guid].is_expandable')
	},

	/**
	 * MetaStorage is used by Tree to store the `expanded` state
	 * @type {Object}
	 */
	_meta_storage_config: {
		fields: {
			is_expanded: {type:'Boolean'}
			// is_expandable: {type:'Boolean'}
		}
	},

	/**
	 * Default refresher for the If view with node children (without animation)
	 * @type {_cRefresher}
	 */
	_default_if_refresher_config: {
		type: 'Standard'
	},

	/**
	 * Config of refresher, that expands children
	 * @type {_cRefresher}
	 */
	_if_refresher_config: null,

	/**
	 * Refresher, that inserts and removes new child nodes in the `record.children` collection.
	 * @type {_cRefresher}
	 */
	_foreach_refresher_config: {
		type: 'Standard',
		get_end_element_callback: function(template) {

			// Last view is the If with node children.
			// "_foreach_view" property was set in "node_children" role.
			var children_foreach = template.getLastView().get('_foreach_view'),
				node_children_element = children_foreach ? children_foreach.getContainer().getDOMElement() : null;

			return node_children_element || template.getFirstView().getContainer().getDOMElement();

		}
	},

	_property_descriptors: {
		records: {setter: '_setRecords'},
		meta_storage: {is_readonly: true}
	},

	_properties: {
		/** User-assigned records in the root of the tree */
		records: null,
		meta_storage: null
	},

	_event_handlers: {
		node_click: '_onNodeClick'
	},

	_role_handlers: {
		node_children_view: '_handleNodeChildrenView',
		root_nodes_foreach: '_handleRootNodesForeach',
		nodes_foreach: '_handleNodesForeach'
	},

	/**
	 * MetaStorage instance for storage of "is_expanded" state of tree records
	 * @type {Lava.data.MetaStorage}
	 */
	_meta_storage: null,

	/**
	 * Columns, which are served from MetaStorage instead of record instance
	 * @type {Object.<string,true>}
	 */
	_meta_storage_columns: {},

	/**
	 * Dynamic scopes configuration
	 * @type {Object.<string,_cScopeLocator>}
	 */
	_column_bind_configs: {},

	/**
	 * May be overridden in inherited classes to force creation of MetaStorage in constructor
	 * @type {boolean}
	 */
	CREATE_META_STORAGE: false,

	/**
	 * @param config
	 * @param {Array.<string>} config.options.meta_storage_columns This setting allows you to define columns,
	 *  which will be stored in separate MetaStorage instance instead of record properties.
	 *  Commonly, you will want to store "is_expanded" property in MetaStorage.
	 * @param {Object} config.options.refresher You can assign custom refresher config for nodes (with animation support, etc).
	 * 	Use {type: 'Collapse'} to apply basic animation
	 * @param widget
	 * @param parent_view
	 * @param template
	 * @param properties
	 */
	init: function(config, widget, parent_view, template, properties) {

		var i = 0,
			count,
			columns_list,
			name;

		if (config.options && config.options.meta_storage_columns) {
			columns_list = config.options.meta_storage_columns;
			count = columns_list.length;
			for (; i < count; i++) {
				this._meta_storage_columns[columns_list[i]] = true;
			}
		}

		for (name in this._direct_bind_configs) {

			this._column_bind_configs[name] = (name in this._meta_storage_columns)
				? this._meta_storage_bind_configs[name]
				: this._direct_bind_configs[name];

		}

		if (this.CREATE_META_STORAGE || !Firestorm.Object.isEmpty(this._meta_storage_columns)) {
			this._meta_storage = new Lava.data.MetaStorage(this._meta_storage_config);
			this._properties.meta_storage = this._meta_storage;
		}

		this.Standard$init(config, widget, parent_view, template, properties);

		this._if_refresher_config = (config.options && config.options.refresher)
			? config.options.refresher
			: this._default_if_refresher_config

	},

	/**
	 * Setter for `records` property
	 * @param {?Array.<Object>} value
	 * @param {string} name
	 */
	_setRecords: function(value, name) {

		if (this._meta_storage) {
			this._meta_storage.destroy();
			this._meta_storage = new Lava.data.MetaStorage(this._meta_storage_config);
			this._set('meta_storage', this._meta_storage);
		}

		this._set(name, value);

	},

	/**
	 * Get or create an instance of MetaRecord, which is attached to record from data
	 * @param {Object} record
	 * @returns {Lava.data.MetaRecord}
	 */
	_getMetaRecord: function(record) {

		return this._meta_storage.get(record.get('guid')) || this._meta_storage.createMetaRecord(record.get('guid'));

	},

	/**
	 * Create refresher for the If view with node children
	 * @param {Lava.view.If} view
	 */
	_handleNodeChildrenView: function(view) {

		view.createRefresher(this._if_refresher_config);

	},

	/**
	 * Create refresher for the root Foreach view
	 * @param {Lava.view.Foreach} view
	 */
	_handleRootNodesForeach: function(view) {

		view.createRefresher(this._foreach_refresher_config);

	},

	/**
	 * Initialize Foreach views with node children
	 * @param {Lava.view.Foreach} view
	 */
	_handleNodesForeach: function(view) {

		view.createRefresher(this._foreach_refresher_config);
		view.getParentView().set('_foreach_view', view);

	},

	/**
	 * Expand or collapse the node
	 * @param dom_event_name
	 * @param event_object
	 * @param view
	 * @param template_arguments
	 */
	_onNodeClick: function(dom_event_name, event_object, view, template_arguments) {

		// template_arguments[0] - node record
		if (Lava.schema.DEBUG) {
			if (!template_arguments[0].isProperties) {
				Lava.t("Tree: record is not instance of Properties");
			}
			if ('is_expanded' in this._meta_storage_columns) {
				if (!template_arguments[0].get('guid')) Lava.t("Tree: record without GUID");
			}
		}
		var property_source = ('is_expanded' in this._meta_storage_columns) ? this._getMetaRecord(template_arguments[0]) : template_arguments[0];
		property_source.set('is_expanded', !property_source.get('is_expanded'));
		event_object.preventDefault(); // to prevent text selection

	},

	/**
	 * Switch expandable tree records to new state
	 * @param node
	 * @param {boolean} expanded_state
	 */
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

			property_source = ('is_expanded' in this._meta_storage_columns) ? this._getMetaRecord(node) : node;
			property_source.set('is_expanded', expanded_state);

		}

	},

	/**
	 * Switch expandable root records to new state
	 * @param {boolean} expanded_state
	 */
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

	/**
	 * Expand all records in the tree
	 */
	expandAll: function() {

		this._toggleRecords(true);

	},

	/**
	 * Collapse all records in the tree
	 */
	collapseAll: function() {

		this._toggleRecords(false);

	},

	/**
	 * Locate record field references for templates (like "is_expanded" property)
	 * @param {Lava.view.Abstract} view
	 * @param {_cDynamicScope} config
	 */
	getDynamicScope: function(view, config) {

		if (!(config.property_name in this._column_bind_configs)) Lava.t('unknown dynamic scope: ' + config.property_name);
		return view.getScopeByPathConfig(this._column_bind_configs[config.property_name]);

	},

	destroy: function() {

		if (this._meta_storage) {
			this._meta_storage.destroy();
			this._meta_storage = null;
		}

		this.Standard$destroy();

	}

});