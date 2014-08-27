
Lava.define(
'Lava.view.Abstract',
/**
 * @lends Lava.view.Abstract#
 * @implements _iViewHierarchyMember
 * @extends Lava.mixin.Properties#
 */
{

	Extends: 'Lava.mixin.Properties',
	/** @const */
	isView: true,
	/** @readonly */
	guid: null,
	/**
	 * Do not set ID directly, use appropriate setter.
	 * @readonly
	 */
	id: null,
	/**
	 * Label is part of template config, so must be considered readonly.
	 * @readonly
	 */
	label: null,
	/**
	 * How many parents does it have
	 * @readonly
	 */
	depth: 0,

	/**
	 * @readonly
	 */
	template_index: 0,

	/**
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,

	/**
	 * @type {Lava.view.Abstract}
	 */
	_parent_view: null,

	/**
	 * Nearest parent view with it's own container.
	 * @type {Lava.view.Abstract}
	 */
	_parent_with_container: null,

	/**
	 * @type {_iContainer}
	 */
	_container: null,

	/**
	 * @type {_cView}
	 */
	_config: null,

	_template: null,

	_is_inDOM: false,
	_is_sleeping: false,
	_is_dirty: false,
	_is_queued_for_refresh: false,

	/**
	 * @type {Object.<string, Lava.scope.PropertyBinding>}
	 */
	_property_bindings_by_property: {},

	/**
	 * @type {Object.<_tGUID, Lava.scope.Segment>}
	 */
	_data_segments: {},

	/**
	 * @param {_cView} config
	 * @param {Lava.widget.Standard} widget
	 * @param {Lava.view.View} parent_view
	 * @param {Lava.system.Template} template
	 * @param {Object} properties
	 */
	init: function(config, widget, parent_view, template, properties) {

		var name,
			argument,
			constructor;

		this.guid = Lava.guid++;
		this.id = config.id || null;
		this.label = config.label || null;

		Lava.view_manager.registerView(this);

		this._config = config;
		this._widget = widget;
		this._template = template;

		if (parent_view) {

			this._parent_view = parent_view;
			this._parent_with_container = parent_view.getContainer() ? parent_view : parent_view.getParentWithContainer();
			this.depth = parent_view.depth + 1;

		}

		this._initMembers(properties);

		for (name in config.assigns) {

			if (config.assigns[name].once) {

				argument = new Lava.scope.Argument(config.assigns[name], this, this._widget);
				this.set(name, argument.getValue());
				argument.destroy();

			} else {

				if (name in this._property_bindings_by_property) Lava.t("Error initializing assign: property binding already created");

				this._property_bindings_by_property[name] = new Lava.scope.PropertyBinding(this, name, this.depth, config.assigns[name]);

			}

		}

		if ('container' in config) {

			constructor = Lava.ClassManager.getConstructor(config.container['class'], 'Lava.view.container');
			this._container = new constructor(this, config.container, widget);

		}

		this._postInit();

		if ('roles' in  config) Lava.view_manager.dispatchRoles(this, config.roles);

	},

	getContainer: function() { return this._container; },

	getParentWithContainer: function() { return this._parent_with_container; },

	getParentView: function() { return this._parent_view; },

	getWidget: function() { return this._widget; },

	isInDOM: function() { return this._is_inDOM; },

	isSleeping: function() { return this._is_sleeping; },

	/**
	 * @returns {Lava.system.Template}
	 */
	getTemplate: function() { return this._template; },

	setId: function(new_id) {

		Lava.view_manager.unregisterView(this);
		this.id = new_id;
		Lava.view_manager.registerView(this);

	},

	_initMembers: function(properties) {

		for (var name in properties) {

			this.set(name, properties[name]);

		}

	},

	/**
	 * Called before registering roles.
	 */
	_postInit: function() {

	},

	/**
	 * @param {number} depth
	 * @returns {Lava.view.Abstract}
	 */
	getViewByDepth: function(depth) {

		var root = this;

		while (depth > 0) {

			root = root.getParentView();

			if (!root) Lava.t("Error evaluating depth: parent view does not exist");

			depth--;

		}

		return root;

	},

	trySetDirty: function() {

		if (this._is_inDOM) {

			if (this._container) {

				this._is_dirty = true;

				if (!this._is_queued_for_refresh) {

					Lava.view_manager.scheduleViewRefresh(this);
					this._is_queued_for_refresh = true;

				}

			} else if (this._parent_with_container) {

				this._parent_with_container.trySetDirty();

			}

		}

	},

	/**
	 * @param {string} function_name
	 */
	_broadcastToChildren: function(function_name) {

		// must be overridden in child classes (in those, that have children)

	},

	broadcastInDOM: function() {

		this._is_inDOM = true;
		this._is_dirty = false;
		this._container && this._container.informInDOM();

		this._broadcastToChildren('broadcastInDOM');

	},

	broadcastRemove: function() {

		if (this._is_inDOM) {

			if (!this._is_sleeping) this._sleep();

			this._is_inDOM = false;
			this._is_dirty = false;
			this._container && this._container.informRemove();

			this._broadcastToChildren('broadcastRemove');

		}

	},

	broadcastSleep: function() {

		if (Lava.schema.DEBUG && !this._is_inDOM) Lava.t();

		if (!this._is_sleeping) {

			this._sleep();
			this._broadcastToChildren('broadcastSleep');

		}

	},

	_sleep: function() {

		this._is_sleeping = true;
		this._container && this._container.sleep();

	},

	broadcastWakeup: function() {

		if (Lava.schema.DEBUG && !this._is_inDOM) Lava.t();

		if (this._is_sleeping) {

			this._wakeup();
			this._broadcastToChildren('broadcastWakeup');

		}

	},

	_wakeup: function() {

		this._is_sleeping = false;
		this._container && this._container.wakeup();

		if (this._is_dirty && !this._is_queued_for_refresh) {

			Lava.view_manager.scheduleViewRefresh(this);
			this._is_queued_for_refresh = true;

		}

	},

	_renderContents: function() {

		Lava.t("_renderContents must be overridden in inherited classes");

	},

	render: function() {

		if (this._is_sleeping) this._wakeup();

		var buffer = this._renderContents(),
			result;

		if (this._container) {

			result = this._container.wrap(buffer);

		} else {

			result = buffer;

		}

		return result;

	},

	/**
	 * 'soft' refresh - only if needed
	 */
	refresh: function() {

		if (Lava.schema.DEBUG && !this._container) Lava.t("Refresh on a view without container");

		this._is_queued_for_refresh = false;

		if (this._is_inDOM && !this._is_sleeping) {

			if (this._is_dirty) {

				this._refresh();
				this._is_dirty = false;

			}

		}

	},

	_refresh: function() {

		this._container.setHTML(this._renderContents());
		this._broadcastToChildren('broadcastInDOM');

	},

	/**
	 * @param {string} label
	 * @returns {Lava.view.Abstract}
	 */
	locateViewByLabel: function(label) {

		if (Lava.schema.DEBUG && !label) Lava.t();

		var result = this;

		if (label == 'root') {

			result = this._widget;

			while (result.getParentWidget()) {

				result = result.getParentWidget();

			}

		} else if (label == 'parent') {

			result = this._parent_view;

		} else if (label == 'widget') {

			result = this._widget;

		} else if (label != 'this') {

			while (result && result.label != label) {

				result = result.getParentView();

			}

		}

		return result;

	},

	/**
	 * Actually, returns a widget.
	 *
	 * @param {string} name
	 * @returns {Lava.widget.Standard}
	 */
	locateViewByName: function(name) {

		if (Lava.schema.DEBUG && !name) Lava.t();

		var result = this._widget;

		while (result && result.name != name) {

			result = result.getParentWidget();

		}

		return result;

	},

	/**
	 * @param id
	 * @returns {Lava.view.Abstract}
	 */
	locateViewById: function(id) {

		if (Lava.schema.DEBUG && !id) Lava.t();

		return Lava.view_manager.getViewById(id);

	},

	/**
	 * @param guid
	 * @returns {Lava.view.Abstract}
	 */
	locateViewByGuid: function(guid) {

		if (Lava.schema.DEBUG && !guid) Lava.t();

		return Lava.view_manager.getViewByGuid(guid);

	},

	/**
	 * @param {_cScopeLocator|_cKnownViewLocator} path_config
	 * @returns {Lava.view.Abstract}
	 */
	locateViewByPathConfig: function(path_config) {

		var result = this['locateViewBy' + path_config.locator_type](path_config.locator);

		if (Lava.schema.DEBUG && !result) Lava.t("View not found. " + path_config.locator_type + ':' + path_config.locator);

		if ('depth' in path_config) {

			result = result.getViewByDepth(path_config.depth);

		}

		return result;

	},

	locateViewWithProperty: function(name) {

		var view = this;

		while (view && !view.isset(name)) {

			view = view.getParentView();

		}

		return view;

	},

	/**
	 * @param {_cScopeLocator} path_config
	 * @returns {_iValueContainer}
	 */
	getScopeByPathConfig: function(path_config) {

		var view,
			i = 0,
			count,
			result,
			tail = path_config.tail;

		if ('property_name' in path_config) {

			view = ('locator_type' in path_config) ? this.locateViewByPathConfig(path_config) : this;

			view = view.locateViewWithProperty(path_config.property_name);

			if (Lava.schema.DEBUG && !view) Lava.t("Property not found: " + path_config.property_name);

			result = view.getDataBinding(path_config.property_name);

		} else {

			if (Lava.schema.DEBUG && !('locator_type' in path_config)) Lava.t("Malformed scope path (1)");
			if (Lava.schema.DEBUG && !tail) Lava.t("Malformed scope path (2)");

			result = this.locateViewByPathConfig(path_config);

			if (Lava.schema.DEBUG && !result) Lava.t("View not found. "
				+ path_config.locator_type + ": " + path_config.locator + ", depth:" + path_config.depth);

		}

		if (tail) {

			for (count = tail.length; i < count; i++) {

				result = (typeof(tail[i]) == 'object')
					? result.getSegment(this.getScopeByPathConfig(tail[i]))
					: result.getDataBinding(tail[i]);

			}

		}

		return result;

	},

	/**
	 * @param {_cScopeLocator} path_config
	 * @returns {*}
	 */
	evalPathConfig: function(path_config) {

		var view,
			i = 0,
			count,
			result,
			tail = path_config.tail,
			property_name;

		if ('property_name' in path_config) {

			view = ('locator_type' in path_config) ? this.locateViewByPathConfig(path_config) : this;

			view = view.locateViewWithProperty(path_config.property_name);

			result = view.get(path_config.property_name);

		} else {

			if (Lava.schema.DEBUG && !('locator_type' in path_config)) Lava.t("Malformed scope path (1)");
			if (Lava.schema.DEBUG && !tail) Lava.t("Malformed scope path (2)");

			result = this.locateViewByPathConfig(path_config);

			if (Lava.schema.DEBUG && !result) Lava.t("View not found. "
				+ path_config.locator_type + ": " + path_config.locator + ", depth:" + path_config.depth);

		}

		if (tail) {

			for (count = tail.length; i < count; i++) {

				property_name = (typeof(tail[i]) == 'object') ? this.evalPathConfig(tail[i]) : tail[i];

				if (result.isEnumerable && /^\d+$/.test(property_name)) {

					result = result.getValueAt(+property_name);

				} else if (result.isProperties) {

					result = result.get(property_name);

				} else {

					result = result[property_name];

				}

				if (!result) {

					break;

				}

			}

		}

		return result;

	},

	/**
	 * @param {string} property_name
	 * @returns {Lava.scope.PropertyBinding}
	 */
	getDataBinding: function(property_name) {

		if (!(property_name in this._property_bindings_by_property)) {

			this._property_bindings_by_property[property_name] = new Lava.scope.PropertyBinding(this, property_name, this.depth);

		}

		return this._property_bindings_by_property[property_name];

	},

	/**
	 * @param {(Lava.scope.PropertyBinding|Lava.scope.DataBinding)} name_source_scope
	 * @returns {Lava.scope.Segment}
	 */
	getSegment: function(name_source_scope) {

		if (Lava.schema.DEBUG && !name_source_scope.guid) Lava.t("Only PropertyBinding and DataBinding may be used as name source for segments");

		if (!(name_source_scope.guid in this._data_segments)) {

			this._data_segments[name_source_scope.guid] = new Lava.scope.Segment(this, name_source_scope, this.depth);

		}

		return this._data_segments[name_source_scope.guid];

	},

	destroy: function() {

		var name;

		this._fire('destroy');

		Lava.view_manager.unregisterView(this);

		if (this._container) this._container.destroy();

		for (name in this._property_bindings_by_property) {

			this._property_bindings_by_property[name].destroy();

		}

		for (name in this._data_segments) {

			this._data_segments[name].destroy();

		}

		this._is_sleeping = true; // to prevent refresh

	}

});