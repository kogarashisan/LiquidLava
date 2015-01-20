
Lava.define(
'Lava.view.Foreach',
/**
 * Iterate over a sequence of items and render a template for each item
 *
 * @lends Lava.view.Foreach#
 * @extends Lava.view.Abstract
 * @implements _iViewHierarchyMember
 */
{

	Extends: 'Lava.view.Abstract',

	/**
	 * Argument, that returns an array or Enumerable
	 * @type {Lava.scope.Argument}
	 */
	_argument: null,
	/**
	 * Scope, that is preparing results from argument
	 * @type {Lava.scope.Foreach}
	 */
	_foreach_scope: null,
	/**
	 * Listener for {@link Lava.scope.Foreach#event:changed} event
	 * @type {_tListener}
	 */
	_foreach_scope_changed_listener: null,

	/**
	 * Equals to `_current_uids.length`
	 * @type {number}
	 */
	_current_count: 0,
	/**
	 * Unique IDs, received from Enumerable, that was returned from Foreach scope
	 * @type {Array.<number>}
	 */
	_current_uids: [],
	/**
	 * Enumerable UID => Template
	 * @type {Object.<string, Lava.system.Template>}
	 */
	_current_hash: {},

	/**
	 * Templates that correspond to each item in Enumerable
	 * @type {Array.<Lava.system.Template>}
	 */
	_current_templates: [],

	/**
	 * The name of variable, holding the concrete record in child views
	 * @type {string}
	 */
	_as: null,

	/**
	 * Refreshers animate insertion and removal of templates.
	 * They can also insert and remove templates independently of each other
	 * @type {Lava.view.refresher.Standard}
	 */
	_refresher: null,

	_properties: {
		/**
		 * Number of items in Foreach
		 */
		count: 0
	},

	/**
	 * Set each time when scope changes - sign to refresh child templates in `refresh()` or `render()`
	 * @type {boolean}
	 */
	_requires_refresh_children: true,

	init: function(config, widget, parent_view, template, properties) {

		this.Abstract$init(config, widget, parent_view, template, properties);

		// setting count after roles registration, cause scope can be filtered
		this.set('count', this._foreach_scope.getValue().getCount());

	},

	_initMembers: function(properties) {

		if (Lava.schema.DEBUG && !('argument' in this._config)) Lava.t("Foreach view requires an argument");
		if (Lava.schema.DEBUG && !this._config.as) Lava.t("Foreach view requires 'as' hash parameter");
		if (Lava.schema.DEBUG && !this._config.template) Lava.t("Foreach view must not be empty");

		this.Abstract$_initMembers(properties);

		this._argument = new Lava.scope.Argument(this._config.argument, this, this._widget);
		this._foreach_scope = new Lava.scope.Foreach(this._argument, this, this._widget, this._config.scope);
		this._foreach_scope_changed_listener = this._foreach_scope.on('changed', this._onDataSourceChanged, this);
		this._foreach_scope.on('new_enumerable', this._onEnumerableChanged, this);
		this._as = this._config.as;

	},

	_postInit: function() {

		if (this._config.refresher) {
			this.createRefresher(this._config.refresher);
		}

	},

	/**
	 * Can be called during roles registration (at the time of `init()`), before children are created.
	 * Initializes a refresher instance with custom config.
	 *
	 * @param {_cRefresher} refresher_config
	 */
	createRefresher: function(refresher_config) {

		if (Lava.schema.DEBUG && (this._refresher || this._current_count)) Lava.t("Foreach: refresher is already created or createRefresher() was called outside of init()");
		if (Lava.schema.DEBUG && !this._container) Lava.t('View/Foreach: refresher needs container to work');

		var constructor = Lava.ClassManager.getConstructor(refresher_config['type'], 'Lava.view.refresher');
		this._refresher = /** @type {Lava.view.refresher.Standard} */ new constructor(refresher_config, this, this._container);

		this._refresher.on('removal_complete', this._onRemovalComplete, this);
		this._refresh = this._refresh_Refresher;
		this._removeTemplates = this._removeTemplates_Refresher;
		this._renderContent = this._renderContent_Refresher;
		this._broadcastToChildren = this._broadcastToChildren_Refresher;

	},

	/**
	 * Get `_refresher`
	 * @returns {Lava.view.refresher.Standard}
	 */
	getRefresher: function() {

		return this._refresher;

	},

	/**
	 * Scope has created a new instance of Enumerable.
	 * Now all UIDs belong to the old enumerable, so must get rid of all templates
	 */
	_onEnumerableChanged: function() {

		var i = 0,
			removed_templates = [];

		for (; i < this._current_count; i++) {

			removed_templates.push(this._current_hash[this._current_uids[i]]);

		}

		removed_templates.length && this._removeTemplates(removed_templates);

		this._current_count = 0;
		this._current_hash = {};
		this._current_uids = [];
		this._current_templates = [];
		this.set('count', 0);

	},

	/**
	 * Callback that removes templates for removed Enumerable items.
	 * Version without Refresher support.
	 * @param {Array.<Lava.system.Template>} removed_templates
	 */
	_removeTemplates: function(removed_templates) {

		for (var i = 0, removed_count = removed_templates.length; i < removed_count; i++) {

			removed_templates[i].destroy();

		}

	},

	/**
	 * Callback that removes templates for removed Enumerable items.
	 * Version with Refresher support.
	 * @param {Array.<Lava.system.Template>} removed_templates
	 */
	_removeTemplates_Refresher: function(removed_templates) {

		this._refresher.prepareRemoval(removed_templates);

	},

	/**
	 * Remove old templates, create new
	 */
	_refreshChildren: function() {

		var data_source = this._foreach_scope.getValue(),
			new_uids = data_source.getUIDs(),
			new_uid_to_index_map = data_source.getUIDToIndexMap(),
			count = data_source.getCount(),
			i = 0,
			uid,
			template,
			removed_templates = [],
			child_properties,
			current_templates = [];

		for (; i < this._current_count; i++) {

			uid = this._current_uids[i];

			if (!(uid in new_uid_to_index_map)) {

				removed_templates.push(this._current_hash[uid]);
				delete this._current_hash[uid];

			}

		}

		for (i = 0; i < count; i++) {

			uid = new_uids[i];

			child_properties = {
				foreach_index: i,
				foreach_name: data_source.getNameAt(new_uid_to_index_map[uid])
			};
			child_properties[this._as] = data_source.getValueAt(new_uid_to_index_map[uid]);

			if (uid in this._current_hash) {

				template = this._current_hash[uid];
				template.batchSetProperties(child_properties);

			} else {

				template = new Lava.system.Template(this._config.template, this._widget, this, child_properties);
				this._current_hash[uid] = template;

			}

			current_templates.push(template);

		}

		removed_templates.length && this._removeTemplates(removed_templates);

		this._current_count = count;
		this._current_uids = new_uids;
		this._current_templates = current_templates;
		this._requires_refresh_children = false;

	},

	/**
	 * Callback for {@link Lava.scope.Foreach#event:changed} event
	 */
	_onDataSourceChanged: function() {

		this.set('count', this._foreach_scope.getValue().getCount());
		this._requires_refresh_children = true;
		this.trySetDirty();

	},

	/**
	 * Animation has ended and refresher has removed the `template` from DOM
	 * @param {Lava.view.refresher.Standard} refresher
	 * @param {Lava.system.Template} template
	 */
	_onRemovalComplete: function(refresher, template) {

		template.destroy();

	},

	_renderContent: function() {

		if (Lava.schema.DEBUG && (this._argument.isWaitingRefresh() || this._foreach_scope.isWaitingRefresh())) Lava.t();

		var buffer = '',
			i = 0;

		this._requires_refresh_children && this._refreshChildren();

		for (; i < this._current_count; i++) {

			buffer += this._current_templates[i].render();

		}

		return buffer;

	},

	/**
	 * Version of `_renderContent` for usage with refresher instance
	 * @returns {string}
	 */
	_renderContent_Refresher: function() {

		if (Lava.schema.DEBUG && (this._argument.isWaitingRefresh() || this._foreach_scope.isWaitingRefresh())) Lava.t();
		this._requires_refresh_children && this._refreshChildren();
		return this._refresher.render(this._current_templates);

	},

	_refresh: function() {

		this._requires_refresh_children && this._refreshChildren();
		this._container.setHTML(this._renderContent());
		this._broadcastToChildren('broadcastInDOM');

	},

	/**
	 * Version of `_refresh` for usage with created refresher instance
	 */
	_refresh_Refresher: function() {

		this._requires_refresh_children && this._refreshChildren();
		this._refresher.refresh(this._current_templates);

	},

	_broadcastToChildren: function(function_name) {

		for (var name in this._current_hash) {

			this._current_hash[name][function_name]();

		}

	},

	/**
	 * Version of _broadcastToChildren for usage with created refresher instance
	 * @param {string} function_name
	 */
	_broadcastToChildren_Refresher: function(function_name) {

		this._refresher[function_name]();

	},

	/**
	 * Get `_foreach_scope`. Can be used to sort and filter items.
	 * @returns {Lava.scope.Foreach}
	 */
	getScope: function() {

		return this._foreach_scope;

	},

	destroy: function() {

		var name;

		this._refresher && this._refresher.destroy();

		for (name in this._current_hash) {

			this._current_hash[name].destroy();

		}

		this._foreach_scope.destroy();
		this._argument.destroy();

		this.Abstract$destroy();

		// to speed up garbage collection and break this object forever (destroyed objects must not be used!)
		this._refresher = this._current_templates = this._current_hash = this._foreach_scope = this._argument = null;

	}

});