/**
 * Traverse templates with provided "visitor" object
 */
Lava.TemplateWalker = {

	/**
	 * Callbacks for different types of items in template
	 * @type {Object.<string, string>}
	 */
	_handlers_map: {
		'string': '_handleString',
		view: '_handleView',
		widget: '_handleWidget',
		include: '_handleInclude',
		static_value: '_handleStaticValue',
		static_eval: '_handleStaticEval',
		static_tag: '_handleStaticTag'
	},

	/**
	 * The visitor object, which has callbacks for different traversal events
	 * @type {_iVisitor}
	 */
	_visitor: null,
	/**
	 * Stack of nested templates
	 * @type {Array.<_tTemplate>}
	 */
	_template_stack: [],
	/**
	 * Stack of indices in `_template_stack`
	 * @type {Array.<number>}
	 */
	_index_stack: [],
	/**
	 * Stack of nested view configs
	 * @type {Array.<(_cView|_cWidget)>}
	 */
	_view_config_stack: [],

	// local vars for advanced compression
	/**
	 * Does current visitor have `enter()`
	 * @type {boolean}
	 */
	_has_enter: false,
	/**
	 * Does current visitor have `leave()`
	 * @type {boolean}
	 */
	_has_leave: false,
	/**
	 * Does current visitor have `enter)region()`
	 * @type {boolean}
	 */
	_has_enter_region: false,
	/**
	 * Does current visitor have `leave_region()`
	 * @type {boolean}
	 */
	_has_leave_region: false,

	/**
	 * Traverse a template, executing visitor's callbacks
	 * @param {_tTemplate} template
	 * @param {_iVisitor} visitor
	 */
	walkTemplate: function(template, visitor) {

		if (Lava.schema.DEBUG && this._visitor) Lava.t();

		// in case of WALKER_STOP exception, they might be filled with old garbage
		this._template_stack = [];
		this._index_stack = [];
		this._view_config_stack = [];

		this._visitor = visitor;
		this._has_enter = !!this._visitor.enter;
		this._has_leave = !!this._visitor.leave;
		this._has_enter_region = !!this._visitor.enterRegion;
		this._has_leave_region = !!this._visitor.leaveRegion;

		this._has_enter_region && this._visitor.enterRegion(this, 'root_template');
		try {
			this._walkTemplate(template);
		} catch (e) {
			if (e != "WALKER_STOP") throw e;
		}
		this._has_leave_region && this._visitor.leaveRegion(this, 'root_template');

		this._visitor = null;

	},

	/**
	 * Throw an exception, which will be caught in `walkTemplate`
	 * @throws TemplateWalker internal exception that will be caught in `walkTemplate`
	 */
	interrupt: function() {
		throw "WALKER_STOP";
	},

	/**
	 * Get a copy of `_template_stack`
	 * @returns {Array.<_tTemplate>}
	 */
	getTemplateStack: function() {
		return this._template_stack.slice();
	},

	/**
	 * Get a copy of `_index_stack`
	 * @returns {Array.<number>}
	 */
	getIndexStack: function() {
		return this._index_stack.slice();
	},

	/**
	 * Get the template on top of `_template_stack`
	 * @returns {_tTemplate}
	 */
	getCurrentTemplate: function() {
		return this._template_stack[this._template_stack.length - 1];
	},

	/**
	 * Get the template index on top of `_index_stack`
	 * @returns {number}
	 */
	getCurrentIndex: function() {
		return this._index_stack[this._index_stack.length - 1];
	},

	/**
	 * Get a copy of `_view_config_stack`
	 * @returns {Array.<_cView|_cWidget>}
	 */
	getViewConfigStack: function() {
		return this._view_config_stack.slice();
	},

	/**
	 * Get view config on top of `_view_config_stack`
	 * @returns {_cView|_cWidget}
	 */
	getCurrentViewConfig: function() {
		return this._view_config_stack[this._view_config_stack.length];
	},

	/**
	 * Walk a single template
	 * @param {_tTemplate} template
	 */
	_walkTemplate: function(template) {

		if (Lava.schema.DEBUG && !Array.isArray(template)) Lava.t();

		var i = 0,
			count = template.length,
			type,
			stack_index;

		stack_index = this._template_stack.push(template) - 1;
		this._index_stack.push(0);
		this._has_enter_region && this._visitor.enterRegion(this, 'template');

		for (; i < count; i++) {

			this._index_stack[stack_index] = i;
			type = (typeof (template[i]) == 'string') ? 'string' : template[i].type;
			this._has_enter && this._visitor.enter(this, type, template[i]);
			this[this._handlers_map[type]](template[i]);
			this._has_leave && this._visitor.leave(this, type, template[i]);

		}

		this._has_leave_region && this._visitor.leaveRegion(this, 'template');
		this._template_stack.pop();
		this._index_stack.pop();

	},

	/**
	 * Walk the common part of {@link _cView} and {@link _cWidget}
	 * @param {_cView} node
	 */
	_handleViewCommon: function(node) {

		var i = 0,
			count;

		if ('template' in node) {
			this._has_enter_region && this._visitor.enterRegion(this, 'main_template');
			this._walkTemplate(node.template);
			this._has_leave_region && this._visitor.leaveRegion(this, 'main_template');
		}

		if ('else_template' in node) {
			this._has_enter_region && this._visitor.enterRegion(this, 'else_template');
			this._walkTemplate(node.else_template);
			this._has_leave_region && this._visitor.leaveRegion(this, 'else_template');
		}

		if ('elseif_templates' in node) {
			this._has_enter_region && this._visitor.enterRegion(this, 'elseif_templates');
			for (count = node.elseif_templates.length; i < count; i++) {
				this._walkTemplate(node.elseif_templates[i]);
			}
			this._has_leave_region && this._visitor.leaveRegion(this, 'elseif_templates');
		}

	},

	/**
	 * Walk {@link _cView}
	 * @param {_cView} node
	 */
	_handleView: function(node) {

		this._view_config_stack.push(node);
		this._visitor.visitView && this._visitor.visitView(this, node);
		this._handleViewCommon(node);
		this._view_config_stack.pop();

	},

	/**
	 * Walk an object in {@link _cWidget#storage}
	 * @param {Object} object
	 * @param {Object} properties_schema
	 */
	_walkStorageObject: function(object, properties_schema) {

		var name;

		this._has_enter_region && this._visitor.enterRegion(this, 'object');
		for (name in properties_schema) {
			if (properties_schema[name].type == 'template') {
				this._walkTemplate(object[name]);
			}
		}
		this._has_leave_region && this._visitor.leaveRegion(this, 'object');

	},

	/**
	 * Walk a widget config
	 * @param {_cWidget} node
	 */
	_handleWidget: function(node) {

		var name,
			item,
			i,
			count,
			tmp_name,
			item_schema,
			storage_schema;

		this._view_config_stack.push(node);
		this._visitor.visitWidget && this._visitor.visitWidget(this, node);
		this._handleViewCommon(node);

		if (node.includes) {
			this._has_enter_region && this._visitor.enterRegion(this, 'includes');
			for (name in node.includes) {
				this._walkTemplate(node.includes[name]);
			}
			this._has_leave_region && this._visitor.leaveRegion(this, 'includes');
		}

		if (node.storage) {

			storage_schema = Lava.parsers.Storage.getMergedStorageSchema(node);
			for (name in node.storage) {

				this._has_enter_region && this._visitor.enterRegion(this, 'storage');

				item_schema = storage_schema[name];
				item = node.storage[name];

				switch (item_schema.type) {
					case 'template_collection':
						this._has_enter_region && this._visitor.enterRegion(this, 'template_collection');
						for (i = 0, count = item.length; i < count; i++) {
							this._walkTemplate(item[i]);
						}
						this._has_leave_region && this._visitor.leaveRegion(this, 'template_collection');
						break;
					case 'object_collection':
						this._has_enter_region && this._visitor.enterRegion(this, 'object_collection');
						for (i = 0, count = item.length; i < count; i++) {
							this._walkStorageObject(item[i], item_schema.properties);
						}
						this._has_leave_region && this._visitor.leaveRegion(this, 'object_collection');
						break;
					case 'template_hash':
						this._has_enter_region && this._visitor.enterRegion(this, 'template_hash');
						for (tmp_name in item) {
							this._walkTemplate(item[tmp_name]);
						}
						this._has_leave_region && this._visitor.leaveRegion(this, 'template_hash');
						break;
					case 'object_hash':
						this._has_enter_region && this._visitor.enterRegion(this, 'object_hash');
						for (tmp_name in item) {
							this._walkStorageObject(item[tmp_name], item_schema.properties);
						}
						this._has_leave_region && this._visitor.leaveRegion(this, 'object_hash');
						break;
					case 'object':
						this._walkStorageObject(item, item_schema.properties);
						break;
					default:
						Lava.t();
				}

				this._has_leave_region && this._visitor.leaveRegion(this, 'storage');

			}

		}

		this._view_config_stack.pop();

	},

	/**
	 * Walk a string in template
	 * @param {string} node
	 */
	_handleString: function(node) {

		this._visitor.visitString && this._visitor.visitString(this, node);

	},

	/**
	 * Walk an include config
	 * @param {_cInclude} node
	 */
	_handleInclude: function(node) {

		this._visitor.visitInclude && this._visitor.visitInclude(this, node);

	},

	/**
	 * Walk {@link _cStaticValue}
	 * @param {_cStaticValue} node
	 */
	_handleStaticValue: function(node) {

		this._visitor.visitStaticValue && this._visitor.visitStaticValue(this, node);

	},

	/**
	 * Walk {@link _cStaticEval}
	 * @param {_cStaticEval} node
	 */
	_handleStaticEval: function(node) {

		this._visitor.visitStaticEval && this._visitor.visitStaticEval(this, node);

	},

	/**
	 * Walk {@link _cStaticTag}
	 * @param {_cStaticTag} node
	 */
	_handleStaticTag: function(node) {

		this._visitor.visitStaticTag && this._visitor.visitStaticTag(this, node);

	}

};