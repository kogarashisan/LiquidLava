
Lava.TemplateWalker = {

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
	 * @type {_iVisitor}
	 */
	_visitor: null,
	_template_stack: [],
	_index_stack: [],
	_view_config_stack: [],

	// local vars for advanced compression
	_has_enter: false,
	_has_leave: false,
	_has_enter_region: false,
	_has_leave_region: false,

	/**
	 * @param template
	 * @param {_iVisitor} visitor
	 */
	walkTemplate: function(template, visitor) {

		if (Lava.schema.DEBUG && this._visitor) Lava.t();

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

	interrupt: function() {
		throw "WALKER_STOP";
	},

	getTemplateStack: function() {
		return this._template_stack;
	},

	getIndexStack: function() {
		return this._index_stack;
	},

	getCurrentTemplate: function() {
		return this._template_stack[this._template_stack.length - 1];
	},

	getCurrentIndex: function() {
		return this._index_stack[this._index_stack.length - 1];
	},

	getViewConfigStack: function() {
		return this._view_config_stack;
	},

	getCurrentViewConfig: function() {
		return this._view_config_stack[this._view_config_stack.length];
	},

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

	_handleView: function(node) {

		this._view_config_stack.push(node);
		this._visitor.visitView && this._visitor.visitView(this, node);
		this._handleViewCommon(node);
		this._view_config_stack.pop();

	},

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

	_handleString: function(node) {

		this._visitor.visitString && this._visitor.visitString(this, node);

	},

	_handleInclude: function(node) {

		this._visitor.visitInclude && this._visitor.visitInclude(this, node);

	},

	_handleStaticValue: function(node) {

		this._visitor.visitStaticValue && this._visitor.visitStaticValue(this, node);

	},

	_handleStaticEval: function(node) {

		this._visitor.visitStaticEval && this._visitor.visitStaticEval(this, node);

	},

	_handleStaticTag: function(node) {

		this._visitor.visitStaticTag && this._visitor.visitStaticTag(this, node);

	}

};