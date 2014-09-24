
Lava.define(
'Lava.system.Template',
/**
 * Renderable collection of views and strings
 *
 * @lends Lava.system.Template#
 * @implements _iViewHierarchyMember
 */
{

	Shared: ['_block_handlers_map'],

	/**
	 * This class is instance of Lava.system.Template
	 */
	isTemplate: true,

	/**
	 * The nearest widget in hierarchy
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,
	/**
	 * The owner (parent) view
	 * @type {Lava.view.Abstract}
	 */
	_parent_view: null,
	/**
	 * Instance config
	 * @type {_tTemplate}
	 */
	_config: null,
	/**
	 * Count of renderable elements in template instance
	 * @type {number}
	 */
	_count: 0,
	/**
	 * The renderable items, constructed from `_config`
	 * @type {Array.<_tRenderable>}
	 */
	_content: [],
	/**
	 * Is the template currently in DOM
	 * @type {boolean}
	 */
	_is_inDOM: false,
	/**
	 * Is template currently sleeping
	 * @type {boolean}
	 */
	_is_sleeping: false,
	/**
	 * Global unique ID of the instance
	 * @type {_tGUID}
	 */
	guid: null,

	/**
	 * When creating content: handlers for every item type in `_config`
	 * @type {Object.<string, string>}
	 */
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
	 * Create an instance of Template. Create content from config
	 *
	 * @param {_tTemplate} template_config Config for content
	 * @param {Lava.widget.Standard} widget Nearest widget in hierarchy
	 * @param {Lava.view.Abstract} parent_view Owner (parent) view
	 * @param {Object} [child_properties] The properties to set to child views
	 */
	init: function(template_config, widget, parent_view, child_properties) {

		this.guid = Lava.guid++;
		this._parent_view = parent_view;
		this._widget = widget;
		this._config = template_config;

		this._createChildren(this._content, template_config, [], child_properties);
		this._count = this._content.length;

	},

	/**
	 * Create items from config and put them in `result`
	 * @param {Array.<_tRenderable>} result Where to put created items
	 * @param {_tTemplate} children_config Config for the Template
	 * @param {Array.<string>} include_name_stack Used to protect from recursive includes
	 * @param {Object} properties The properties for child views
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

	/**
	 * Handler for strings: push it into result
	 * @param {Array.<_tRenderable>} result Created items
	 * @param {string} childConfig String from Template config
	 */
	_createDirect: function(result, childConfig) {

		result.push(childConfig);

	},

	/**
	 * Handler for views. Create a view and push it into result
	 * @param {Array.<_tRenderable>} result
	 * @param {(_cView|_cWidget)} childConfig Config vor the view
	 * @param {Array.<string>} include_name_stack Used to protect from recursive includes
	 * @param {Object} properties Properties for that view
	 */
	_createView: function(result, childConfig, include_name_stack, properties) {

		var constructor = Lava.ClassManager.getConstructor(childConfig['class'], 'Lava.view'),
			view = new constructor(
				childConfig,
				this._widget,
				this._parent_view,
				this, // template
				properties
			);

		view.template_index = result.push(view) - 1;

	},

	/**
	 * Handler for includes. Get include from widget, then create and append all items from include
	 * @param {Array.<_tRenderable>} result
	 * @param {_cInclude} child_config
	 * @param {Array.<string>} include_name_stack
	 * @param {Object} properties
	 */
	_createInclude: function(result, child_config, include_name_stack, properties) {

		if (include_name_stack.indexOf(child_config.name) != -1) Lava.t("Infinite include recursion");
		var include = Lava.view_manager.getInclude(this._parent_view, child_config);
		if (Lava.schema.DEBUG && include == null) Lava.t("Include not found: " + child_config.name);

		include_name_stack.push(child_config.name);
		this._createChildren(result, include, include_name_stack, properties);
		include_name_stack.pop();

	},

	/**
	 * Handler for static_value: get the value from widget resources and push it into result
	 * @param {Array.<_tRenderable>} result
	 * @param {_cStaticValue} childConfig
	 */
	_createStaticValue: function(result, childConfig) {

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
	 * Handler for static_eval: evaluate the given Argument config and append evaluation result
	 * @param {Array.<_tRenderable>} result
	 * @param {_cStaticEval} childConfig
	 */
	_createStaticEval: function(result, childConfig) {

		var argument = new Lava.scope.Argument(childConfig.argument, this._view, this._widget);
		// if this happens - then you are probably doing something wrong
		if (argument.isWaitingRefresh()) {
			if (Lava.schema.DEBUG) Lava.t("static_eval wrong usage: created argument is dirty");
			Lava.logError("static_eval wrong usage: created argument is dirty");
		}
		result.push(argument.getValue + '');
		argument.destroy();

	},

	/**
	 * Handler for static tags: resolve it's resources, serialize it into string and push parts into result.
	 * The content of the tag is processed recursively
	 * @param {Array.<_tRenderable>} result
	 * @param {_cStaticTag} child_config
	 * @param {Array.<string>} include_name_stack
	 * @param {Object} properties
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
	 * Perform broadcast
	 * @param {string} function_name
	 */
	_broadcast: function(function_name) {

		for (var i = 0; i < this._count; i++) {

			if (this._content[i].isView) {

				this._content[i][function_name]();

			}

		}

	},

	/**
	 * Render template
	 * @returns {string} Rendered HTML
	 */
	render: function() {

		var buffer = '',
			i = 0,
			content = this._content;

		this._is_sleeping = false;

		for (; i < this._count; i++) {

			if (typeof(content[i]) == 'string') {

				buffer += content[i];

			} else if (typeof(content[i]) == 'function') {

				Lava.t("Not implemented");

			} else {

				buffer += content[i].render();

			}

		}

		return buffer;

	},

	/**
	 * Broadcast <str>"broadcastRemove"</str> to instance content
	 */
	broadcastRemove: function() {

		if (this._is_inDOM) {

			this._is_sleeping = true;
			this._is_inDOM = false;
			this._broadcast('broadcastRemove');

		}

	},

	/**
	 * Broadcast <str>"broadcastInDOM"</str> to instance content
	 */
	broadcastInDOM: function() {

		this._is_inDOM = true;
		this._broadcast('broadcastInDOM');

	},

	/**
	 * Broadcast <str>"broadcastSleep"</str> to instance content
	 */
	broadcastSleep: function() {

		if (Lava.schema.DEBUG && !this._is_inDOM) Lava.t();

		this._is_sleeping = true;
		this._broadcast('broadcastSleep');

	},

	/**
	 * Broadcast <str>"broadcastWakeup"</str> to instance content
	 */
	broadcastWakeup: function() {

		if (Lava.schema.DEBUG && !this._is_inDOM) Lava.t();

		this._is_sleeping = false;
		this._broadcast('broadcastWakeup');

	},

	/**
	 * Set this property to all views inside `_content`
	 * @param {string} name Property name
	 * @param {*} value Property value
	 */
	batchSetProperty: function(name, value) {

		for (var i = 0; i < this._count; i++) {

			if (this._content[i].isView) {

				this._content[i].set(name, value);

			}

		}

	},

	/**
	 * Set properties to all views inside `_content`
	 * @param {Object} properties_object
	 */
	batchSetProperties: function(properties_object) {

		for (var i = 0; i < this._count; i++) {

			if (this._content[i].isView) {

				this._content[i].setProperties(properties_object);

			}

		}

	},

	/**
	 * Find first view in `_content` and return it
	 * @returns {Lava.view.Abstract} First view
	 */
	getFirstView: function() {

		return this._seekForwards(0);

	},

	/**
	 * Find last view in `_content` and return it
	 * @returns {Lava.view.Abstract} Last view
	 */
	getLastView: function() {

		return this._seekBackwards(this._count - 1);

	},

	/**
	 * Find a view, preceding the given one
	 * @param {Lava.view.Abstract} view Current view
	 * @returns {Lava.view.Abstract} Previous view
	 */
	getPreviousView: function(view) {

		return this._seekBackwards(view.template_index - 1);

	},

	/**
	 * Find next view
	 * @param {Lava.view.Abstract} view Current view
	 * @returns {Lava.view.Abstract} Next view
	 */
	getNextView: function(view) {

		return this._seekForwards(view.template_index + 1);

	},

	/**
	 * Algorithm to find next view
	 * @returns {Lava.view.Abstract} Next view from index `i`
	 */
	_seekForwards: function(i) {

		var result = null;

		while (i < this._count) {
			if (this._content[i].isView) {
				result = this._content[i];
				break;
			}
			i++;
		}

		return result;

	},

	/**
	 * Algorithm to find previous view
	 * @returns {Lava.view.Abstract} Previous view to index `i`
	 */
	_seekBackwards: function(i) {

		var result = null;

		while (i >= 0) {
			if (this._content[i].isView) {
				result = this._content[i];
				break;
			}
			i--;
		}

		return result;

	},

	/**
	 * Search `_content` and find all views with given label
	 * @param {string} label Label to search for
	 * @returns {Array.<Lava.view.Abstract>} Views with given label
	 */
	getViewsByLabel: function(label) {

		var result = [],
			i = 0;

		for (; i < this._count; i++) {

			if (this._content[i].isView && this._content[i].label == label) {

				result.push(this._content[i]);

			}

		}

		return result;

	},

	/**
	 * Find all widgets with given name inside `_content`
	 * @param {string} name Name to search for
	 * @returns {Array.<Lava.widget.Standard>} Found widgets
	 */
	getWidgetsByName: function(name) {

		var result = [],
			i = 0;

		for (; i < this._count; i++) {

			if (this._content[i].isWidget && this._content[i].name == name) {

				result.push(this._content[i]);

			}

		}

		return result;

	},

	/**
	 * Get `_count`
	 * @returns {number} `_count`
	 */
	getCount: function() {

		return this._count;

	},

	/**
	 * Return an item from `_content` at given index
	 * @param {number} index Index in `_content`
	 * @returns {_tRenderable} Requested item
	 */
	getAt: function(index) {

		return this._content[index];

	},

	/**
	 * Get `_is_inDOM`
	 * @returns {boolean}
	 */
	isInDOM: function() {

		return this._is_inDOM;

	},

	/**
	 * Get `_is_sleeping`
	 * @returns {boolean}
	 */
	isSleeping: function() {

		return this._is_sleeping;

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		this._broadcast('destroy');
		this._content = null;

	}

});