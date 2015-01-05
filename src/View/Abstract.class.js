
/**
 * View has been destroyed and became unusable. You must not call any methods of a destroyed instance
 * @event Lava.view.Abstract#destroy
 */

Lava.define(
'Lava.view.Abstract',
/**
 * Base class for all views and widgets
 *
 * @lends Lava.view.Abstract#
 * @extends Lava.mixin.Properties#
 * @implements _iViewHierarchyMember
 */
{

	Extends: 'Lava.mixin.Properties',
	/**
	 * Indicate that this class is instance of Lava.view.Abstract
	 * @type {boolean}
	 * @const
	 */
	isView: true,
	/**
	 * Global unique identifier
	 * @type {_tGUID}
	 * @readonly
	 */
	guid: null,
	/**
	 * Global unique user-assigned view's ID. Views can be retrieved by their ID from {@link Lava.system.ViewManager};
	 * and referenced in expressions. Note: this is not the same as "id" attribute of DOM element of view's container.
	 *
	 * Do not set this property directly! Use appropriate setter.
	 * @type {?string}
	 * @readonly
	 */
	id: null,
	/**
	 * Labels are used to find views when routing events and roles, or manually.
	 * Label is part of template config, so must be considered readonly
	 * @type {?string}
	 * @readonly
	 */
	label: null,
	/**
	 * How many parents does it have (until the root widget, which does not have a parent)
	 * @type {number}
	 * @readonly
	 */
	depth: 0,

	/**
	 * View's index in {@link Lava.system.Template#_content|_content} array of parent template
	 * @type {number}
	 * @readonly
	 */
	template_index: 0,

	/**
	 * Nearest widget in hierarchy of view's parents
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,

	/**
	 * The owner (parent) view of this instance
	 * @type {Lava.view.Abstract}
	 */
	_parent_view: null,

	/**
	 * Nearest parent view with it's own container
	 * @type {Lava.view.Abstract}
	 */
	_parent_with_container: null,

	/**
	 * View's container
	 * @type {_iContainer}
	 */
	_container: null,

	/**
	 * Settings for this instance
	 * @type {_cView}
	 */
	_config: null,

	/**
	 * The {@link Lava.system.Template} that owns the view
	 */
	_template: null,

	/**
	 * Is this view currently in DOM
	 * @type {boolean}
	 */
	_is_inDOM: false,
	/**
	 * Does this view need refresh
	 * @type {boolean}
	 */
	_is_dirty: false,
	/**
	 * Will it be refreshed by ViewManager
	 * @type {boolean}
	 */
	_is_queued_for_refresh: false,

	/**
	 * Bindings to properties of this view
	 * @type {Object.<string, Lava.scope.PropertyBinding>}
	 */
	_property_bindings_by_property: {},

	/**
	 * Segments, built over bindings to properties of this view (see {@link Lava.scope.Segment})
	 * @type {Object.<_tGUID, Lava.scope.Segment>}
	 */
	_data_segments: {},

	/**
	 * Each time the view is refreshed - it's assigned the id of the current refresh loop
	 * @type {number}
	 */
	_last_refresh_id: 0,
	/**
	 * How many times this view was refreshed during current refresh loop.
	 * Used for infinite loops protection.
	 * @type {number}
	 */
	_refresh_cycle_count: 0,

	/**
	 * Create an instance of the view, including container and assigns; dispatch roles
	 * @param {_cView} config
	 * @param {Lava.widget.Standard} widget
	 * @param {Lava.view.Abstract} parent_view
	 * @param {Lava.system.Template} template
	 * @param {Object} properties
	 */
	init: function(config, widget, parent_view, template, properties) {

		var name,
			argument,
			constructor;

		this.guid = Lava.guid++;
		if (Lava.schema.DEBUG && config.id && !Lava.isValidId(config.id)) Lava.t();
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

				this._property_bindings_by_property[name] = new Lava.scope.PropertyBinding(this, name, config.assigns[name]);

			}

		}

		if ('container' in config) {

			constructor = Lava.ClassManager.getConstructor(config.container['type'], 'Lava.view.container');
			this._container = new constructor(this, config.container, widget);

		}

		this._postInit();

		if ('roles' in  config) Lava.view_manager.dispatchRoles(this, config.roles);

	},

	/**
	 * Get `_container`
	 * @returns {_iContainer}
	 */
	getContainer: function() { return this._container; },

	/**
	 * Get `_parent_with_container`
	 * @returns {Lava.view.Abstract}
	 */
	getParentWithContainer: function() { return this._parent_with_container; },

	/**
	 * Get `_parent_view`
	 * @returns {Lava.view.Abstract}
	 */
	getParentView: function() { return this._parent_view; },

	/**
	 * Get `_widget`
	 * @returns {Lava.widget.Standard}
	 */
	getWidget: function() { return this._widget; },

	/**
	 * Get `_is_inDOM`
	 * @returns {boolean}
	 */
	isInDOM: function() { return this._is_inDOM; },

	/**
	 * Get `_template`
	 * @returns {Lava.system.Template}
	 */
	getTemplate: function() { return this._template; },

	/**
	 * Setter for the {@link Lava.view.Abstract#id} property
	 * @param {string} new_id
	 */
	setId: function(new_id) {

		if (Lava.schema.DEBUG && !Lava.isValidId(new_id)) Lava.t();
		Lava.view_manager.unregisterView(this);
		this.id = new_id;
		Lava.view_manager.registerView(this);

	},

	/**
	 * Set properties, that were passed to constructor
	 * @param {Object} properties
	 */
	_initMembers: function(properties) {

		for (var name in properties) {

			this.set(name, properties[name]);

		}

	},

	/**
	 * Called before registering roles
	 */
	_postInit: function() {

	},

	/**
	 * Get N'th parent of the view
	 * @param {number} depth The number of view's parent you want to get
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

	/**
	 * This view needs to be refreshed. If it has a container - then it can refresh itself independently,
	 * but views without container must ask their parents to refresh them
	 */
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
	 * Execute some state changing function on each child of the view
	 * Must be overridden in child classes (in those, that have children)
	 * @param {string} function_name
	 */
	_broadcastToChildren: function(function_name) {},

	/**
	 * Inform that this view is already in DOM. Now it can access it's container's elements
	 */
	broadcastInDOM: function() {

		this._is_inDOM = true;
		this._is_dirty = false;
		this._container && this._container.informInDOM();

		this._broadcastToChildren('broadcastInDOM');

	},

	/**
	 * Inform that this view is now going to be removed from DOM. It must suspend it's bindings,
	 * detach element listeners and stop animations, etc.
	 */
	broadcastRemove: function() {

		if (this._is_inDOM) {

			this._is_inDOM = false;
			this._is_dirty = false;
			this._container && this._container.informRemove();

			this._broadcastToChildren('broadcastRemove');

		}

	},

	/**
	 * Render the view, including container and all it's inner content
	 * @returns {string} The HTML representation of the view
	 */
	render: function() {

		var buffer = this._renderContent(),
			result;

		if (this._container) {

			result = this._container.wrap(buffer);

		} else {

			result = buffer;

		}

		return result;

	},

	/**
	 * Render the inner hierarchy
	 */
	_renderContent: function() {

		Lava.t("_renderContent must be overridden in inherited classes");

	},

	/**
	 * Refresh the view, if it's dirty (render the view's content and replace old content with the fresh version).
	 * This method is called by ViewManager, you should not call it directly.
	 */
	refresh: function(refresh_id) {

		if (Lava.schema.DEBUG && !this._container) Lava.t("Refresh on a view without container");

		this._is_queued_for_refresh = false;

		if (this._is_inDOM && this._is_dirty) {

			if (this._last_refresh_id == refresh_id) {

				this._refresh_cycle_count++;
				if (this._refresh_cycle_count > Lava.schema.system.REFRESH_INFINITE_LOOP_THRESHOLD) {

					return true; // infinite loop exception

				}

			} else {

				this._last_refresh_id = refresh_id;
				this._refresh_cycle_count = 0;

			}

			this._refresh();
			this._is_dirty = false;

		}

		return false;

	},

	/**
	 * Perform refresh
	 */
	_refresh: function() {

		this._container.setHTML(this._renderContent());
		this._broadcastToChildren('broadcastInDOM');

	},

	/**
	 * Find a view with given label in hierarchy of view's parents. Recognizes some predefined labels, like:
	 * - "root" - the root widget (topmost widget with no parents)
	 * - "parent" - this view's parent view
	 * - "widget" - parent widget of this view
	 * - "this" - this view
	 * @param {string} label Label to search for
	 * @returns {Lava.view.Abstract} View with given label
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
	 * Find a <b>widget</b> with given name in hierarchy of this view's parents
	 *
	 * @param {string} name Name of the widget
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
	 * Get a view with given user-defined id
	 * @param {string} id
	 * @returns {Lava.view.Abstract}
	 */
	locateViewById: function(id) {

		if (Lava.schema.DEBUG && !id) Lava.t();

		return Lava.view_manager.getViewById(id);

	},

	/**
	 * Get a view by GUID
	 * @param {_tGUID} guid
	 * @returns {Lava.view.Abstract}
	 */
	locateViewByGuid: function(guid) {

		if (Lava.schema.DEBUG && !guid) Lava.t();

		return Lava.view_manager.getViewByGuid(guid);

	},

	/**
	 * Find a view in hierarchy of parents by the given route
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

	/**
	 * Get a parent with property `name` defined
	 * @param {string} name
	 * @returns {Lava.view.Abstract}
	 */
	locateViewWithProperty: function(name) {

		var view = this;

		while (view && !view.isset(name)) {

			view = view.getParentView();

		}

		return view;

	},

	/**
	 * Get a scope or property binding by the given route
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
	 * Get value of the route without creating scopes
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

				if (result.isCollection && /^\d+$/.test(property_name)) {

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
	 * Get a binding to this view's property
	 * @param {string} property_name
	 * @returns {Lava.scope.PropertyBinding}
	 */
	getDataBinding: function(property_name) {

		if (!(property_name in this._property_bindings_by_property)) {

			this._property_bindings_by_property[property_name] = new Lava.scope.PropertyBinding(this, property_name);

		}

		return this._property_bindings_by_property[property_name];

	},

	/**
	 * Get a {@link Lava.scope.Segment}, bound to view's property
	 * @param {(Lava.scope.PropertyBinding|Lava.scope.DataBinding)} name_source_scope
	 * @returns {Lava.scope.Segment}
	 */
	getSegment: function(name_source_scope) {

		if (Lava.schema.DEBUG && !name_source_scope.guid) Lava.t("Only PropertyBinding and DataBinding may be used as name source for segments");

		if (!(name_source_scope.guid in this._data_segments)) {

			this._data_segments[name_source_scope.guid] = new Lava.scope.Segment(this, name_source_scope);

		}

		return this._data_segments[name_source_scope.guid];

	},

	/**
	 * Free resources and make this instance unusable
	 */
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

		this._is_inDOM = false; // to prevent refresh

	}

});