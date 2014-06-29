
Lava.define(
'Lava.system.Template',
/**
 * @lends Lava.system.Template#
 * @implements _iViewHierarchyMember
 */
{

	Shared: ['_block_handlers_map'],

	isTemplate: true,

	_widget: null,
	_parent_view: null,
	_config: null,
	_count: 0,
	_contents: [],
	_is_inDOM: false,
	_is_sleeping: false,
	guid: null,

	_block_handlers_map: {
		'string': '_createDirect',
		view: '_createView',
		widget: '_createView',
		include: '_createInclude',
		static_value: '_createStaticValue',
		static_eval: '_createStaticEval',
		static_tag: '_createStaticTag'
	},

	/**
	 * @param {Lavadoc._tTemplate} template_config
	 * @param {Lava.widget.Standard} widget
	 * @param {Lava.view.Abstract} parent_view
	 * @param {Object} child_properties
	 */
	init: function(template_config, widget, parent_view, child_properties) {

		this.guid = Lava.guid++;
		this._parent_view = parent_view;
		this._widget = widget;
		this._config = template_config;

		this._createChildren(this._contents, template_config, [], child_properties);
		this._count = this._contents.length;

	},

	/**
	 * @param {Array.<Lavadoc._tRenderable>} result
	 * @param {Lavadoc._tTemplate} children_config
	 * @param {Array.<string>} include_name_stack
	 * @param {Object} properties
	 */
	_createChildren: function(result, children_config, include_name_stack, properties) {

		var i = 0,
			count = children_config.length,
			childConfig,
			type;

		for (; i < count; i++) {

			childConfig = children_config[i];
			type = typeof(childConfig);
			if (type == 'object') type = childConfig.type;

			if (Lava.schema.DEBUG && !(type in this._block_handlers_map)) Lava.t("Unsupported template item type: " + type);
			this[this._block_handlers_map[type]](result, childConfig, include_name_stack, properties);

		}

	},

	_createDirect: function(result, childConfig) {

		result.push(childConfig);

	},

	_createView: function(result, childConfig, include_name_stack, properties) {

		var constructor = Lava.ClassManager.getConstructor(childConfig.class, 'Lava.view'),
			view = new constructor(
				childConfig,
				this._widget,
				this._parent_view,
				this, // template
				properties
			);

		view.template_index = result.push(view) - 1;

	},

	_createInclude: function(result, child_config, include_name_stack, properties) {

		if (include_name_stack.indexOf(child_config.name) != -1) Lava.t("Infinite include recursion");
		var include = Lava.view_manager.getInclude(this._parent_view, child_config);
		if (Lava.schema.DEBUG && include == null) Lava.t("Include not found: " + child_config.name);

		include_name_stack.push(child_config.name);
		this._createChildren(result, include, include_name_stack, properties);
		include_name_stack.pop();

	},

	/**
	 * @param result
	 * @param {_cStaticValue} childConfig
	 * @param include_name_stack
	 * @param properties
	 */
	_createStaticValue: function(result, childConfig, include_name_stack, properties) {

		var resource_id = childConfig.resource_id,
			resource_owner = Lava.view_manager.locateTarget(this._widget, resource_id.locator_type, resource_id.locator),
			resource_value,
			type;

		if (!Lava.schema.RESOURCES_ENABLED) Lava.t("static_value: resources are disabled");
		if (Lava.schema.DEBUG && !resource_owner) Lava.t("Resource owner not found: " + resource_id.locator_type + '=' + resource_id.locator);

		resource_value = resource_owner.getResource(resource_id.name);
		if (Lava.schema.DEBUG && !resource_value) Lava.t("static_value: resource not found: " + resource_id.locator_type + '=' + resource_id.locator);
		if (['string', 'number', 'boolean', 'translate'].indexOf(resource_value.type) == -1) Lava.t("static_value: resource has wrong type");

		result.push(resource_value.value);

	},

	/**
	 * @param result
	 * @param {_cStaticEval} childConfig
	 * @param include_name_stack
	 * @param properties
	 */
	_createStaticEval: function(result, childConfig, include_name_stack, properties) {

		var argument = new Lava.scope.Argument(childConfig.argument, this._view, this._widget);
		// if this happens - than you are probably doing something wrong
		if (argument.isWaitingRefresh()) {
			if (Lava.schema.DEBUG) Lava.t("static_eval wrong usage: created argument is dirty");
			Lava.logError("static_eval wrong usage: created argument is dirty");
		}
		result.push(argument.getValue + '');
		argument.destroy();

	},

	/**
	 * @param result
	 * @param {_cStaticTag} child_config
	 * @param include_name_stack
	 * @param properties
	 */
	_createStaticTag: function(result, child_config, include_name_stack, properties) {

		var resource_id = child_config.resource_id,
			resource_owner,
			container_resources,
			serialized_tag = '<' + child_config.name,
			result_styles = [],
			name,
			is_void = Lava.isVoidTag(child_config.name),

			static_properties,
			static_classes,
			static_styles;

		if (Lava.schema.RESOURCES_ENABLED) {
			resource_owner = Lava.view_manager.locateTarget(this._widget, resource_id.locator_type, resource_id.locator);
			if (Lava.schema.DEBUG && !resource_owner) Lava.t("Resource owner not found: " + resource_id.locator_type + '=' + resource_id.locator);
			container_resources = resource_owner.getResource(resource_id.name);
		}

		if (Lava.schema.DEBUG && !Lava.schema.RESOURCES_ENABLED) Lava.t("Unable to render a static container: resources are disabled");
		if (Lava.schema.DEBUG && !container_resources) Lava.t("Static container, resources not found: " + resource_id.name);
		if (Lava.schema.DEBUG && container_resources.type != 'container') Lava.t("Malformed/invalid container resource: " + resource_id.locator_type + '=' + resource_id.locator);

		static_properties = container_resources.value['static_properties'];
		static_classes = container_resources.value['static_classes'];
		static_styles = container_resources.value['static_styles'];

		if (static_properties) {
			serialized_tag += Lava.parsers.Common.renderTagAttributes(static_properties);
		}

		if (static_classes) {
			serialized_tag += ' class="' + static_classes.join(' ') + '"';
		}

		if (static_styles) {

			for (name in static_styles) {

				result_styles.push(name + ':' + static_styles);

			}

			serialized_tag += ' style="' + result_styles.join(';') + '"';

		}

		if (child_config.template) {

			if (Lava.schema.DEBUG && is_void) Lava.t();

			result.push(serialized_tag + '>');
			this._createChildren(result, child_config.template, include_name_stack, properties);
			result.push('</' + child_config.name + '>');

		} else {

			serialized_tag += is_void ? '/>' : '></' + child_config.name + '>';
			result.push(serialized_tag);

		}

	},

	/**
	 * @param {string} function_name
	 */
	_broadcast: function(function_name) {

		for (var i = 0; i < this._count; i++) {

			if (this._contents[i].isView) {

				this._contents[i][function_name]();

			}

		}

	},

	/**
	 * @returns {string}
	 */
	render: function() {

		var buffer = '',
			i = 0,
			contents = this._contents;

		this._is_sleeping = false;

		for (; i < this._count; i++) {

			if (typeof(contents[i]) == 'string') {

				buffer += contents[i];

			} else if (typeof(contents[i]) == 'function') {

				Lava.t("Not implemented");

			} else {

				buffer += contents[i].render();

			}

		}

		return buffer;

	},

	broadcastRemove: function() {

		if (this._is_inDOM) {

			this._is_sleeping = true;
			this._is_inDOM = false;
			this._broadcast('broadcastRemove');

		}

	},

	broadcastInDOM: function() {

		this._is_inDOM = true;
		this._broadcast('broadcastInDOM');

	},

	broadcastSleep: function() {

		if (Lava.schema.DEBUG && !this._is_inDOM) Lava.t();

		this._is_sleeping = true;
		this._broadcast('broadcastSleep');

	},

	broadcastWakeup: function() {

		if (Lava.schema.DEBUG && !this._is_inDOM) Lava.t();

		this._is_sleeping = false;
		this._broadcast('broadcastWakeup');

	},

	batchSetProperty: function(name, value) {

		for (var i = 0; i < this._count; i++) {

			if (this._contents[i].isView) {

				this._contents[i].set(name, value);

			}

		}

	},

	batchSetProperties: function(properties_object) {

		for (var i = 0; i < this._count; i++) {

			if (this._contents[i].isView) {

				this._contents[i].setProperties(properties_object);

			}

		}

	},

	getFirstView: function() {

		return this._seekForwards(0);

	},

	getLastView: function() {

		return this._seekBackwards(this._count - 1);

	},

	getPreviousView: function(view) {

		return this._seekBackwards(view.template_index - 1);

	},

	getNextView: function(view) {

		return this._seekForwards(view.template_index + 1);

	},

	/**
	 * Warning: codestyle violation
	 * @returns {Lava.view.Abstract}
	 */
	_seekForwards: function(i) {

		while (i < this._count) {
			if (this._contents[i].isView) {
				return this._contents[i];
			}
			i++;
		}

		return null;

	},

	/**
	 * Warning: codestyle violation
	 * @returns {Lava.view.Abstract}
	 */
	_seekBackwards: function(i) {

		while (i >= 0) {
			if (this._contents[i].isView) {
				return this._contents[i];
			}
			i--;
		}

		return null;

	},

	getViewsByLabel: function(label) {

		var result = [],
			i = 0;

		for (; i < this._count; i++) {

			if (this._contents[i].isView && this._contents[i].label == label) {

				result.push(this._contents[i]);

			}

		}

		return result;

	},

	getWidgetsByName: function(name) {

		var result = [],
			i = 0;

		for (; i < this._count; i++) {

			if (this._contents[i].isWidget && this._contents[i].name == name) {

				result.push(this._contents[i]);

			}

		}

		return result;

	},

	getCount: function() {

		return this._count;

	},

	getAt: function(index) {

		return this._contents[index];

	},

	isInDOM: function() {

		return this._is_inDOM;

	},

	isSleeping: function() {

		return this._is_sleeping;

	},

	destroy: function() {

		this._broadcast('destroy');
		this._contents = null;

	}

});