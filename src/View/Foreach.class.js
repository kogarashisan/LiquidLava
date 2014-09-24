
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
	 * Refreshers perform insertion, removal and animation of items
	 * @type {Lava.view.refresher.Standard}
	 */
	_refresher: null,

	_properties: {
		/**
		 * Number of items in Foreach
		 */
		count: 0
	},

	_postInit: function() {

		if (this._config.refresher) {

			if (Lava.schema.DEBUG && !this._container) Lava.t('View/Foreach: refresher needs container to work');
			var constructor = Lava.ClassManager.getConstructor(this._config.refresher['class'], 'Lava.view.refresher');
			this._refresher = /** @type {Lava.view.refresher.Standard} */ new constructor(
				this._config.refresher,
				this,
				this._container
			);

			this._refresher.on('removal_complete', this._onRemovalComplete, this);

		}

		this._refreshChildren();

	},

	/**
	 * Get `_refresher`
	 * @returns {Lava.view.refresher.Standard}
	 */
	getRefresher: function() {

		return this._refresher;

	},

	_initMembers: function(properties) {

		if (Lava.schema.DEBUG && !('argument' in this._config)) Lava.t("Foreach view requires an argument");
		if (Lava.schema.DEBUG && !this._config.as) Lava.t("Foreach view requires 'as' hash parameter");
		if (Lava.schema.DEBUG && !this._config.template) Lava.t("Foreach view must not be empty");

		this.Abstract$_initMembers(properties);

		this._argument = new Lava.scope.Argument(this._config.argument, this, this._widget);
		this._foreach_scope = new Lava.scope.Foreach(this._argument, this, this._widget, this._config.options ? this._config.options.scope : null);
		this._foreach_scope_changed_listener = this._foreach_scope.on('changed', this._onDataSourceChanged, this);
		this._foreach_scope.on('new_enumerable', this._onEnumerableChanged, this);
		this._as = this._config.as;
		// set the count before the view's container is created, cause if it depends on count
		// - it will be dirty right after creation
		this.set('count', this._foreach_scope.getValue().getCount());

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

	},

	/**
	 * Callback that removes templates for removed Enumerable items
	 * @param {Array.<Lava.system.Template>} removed_templates
	 */
	_removeTemplates: function(removed_templates) {

		var i = 0,
			removed_count;

		if (this._refresher) {

			this._refresher.removeTemplates(removed_templates);

		} else {

			for (i = 0, removed_count = removed_templates.length; i < removed_count; i++) {

				removed_templates[i].destroy();

			}

		}

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

		this.set('count', count);

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

	},

	/**
	 * Callback for {@link Lava.scope.Foreach#event:changed} event
	 */
	_onDataSourceChanged: function() {

		this._refreshChildren();
		this.trySetDirty();

	},

	/**
	 * Animation has ended and refresher has removed the `template` from DOM
	 * @param template
	 */
	_onRemovalComplete: function(template) {

		template.destroy();

	},

	_renderContent: function() {

		if (Lava.schema.DEBUG && (this._argument.isWaitingRefresh() || this._foreach_scope.isWaitingRefresh())) Lava.t();

		this._refresher && this._refresher.onRender(this._current_templates);

		var buffer = '',
			i = 0;

		for (; i < this._current_count; i++) {

			buffer += this._current_templates[i].render();

		}

		return buffer;

	},

	_refresh: function() {

		if (this._refresher) {

			this._refresher.refresh(this._current_templates);

		} else {

			this._container.setHTML(this._renderContent());
			this._broadcastToChildren('broadcastInDOM');

		}

	},

	_broadcastToChildren: function(function_name) {

		for (var name in this._current_hash) {

			this._current_hash[name][function_name]();

		}

	},

	_sleep: function() {

		Lava.suspendListener(this._foreach_scope_changed_listener);
		this._foreach_scope.sleep();
		this._argument.sleep();

		this.Abstract$_sleep();

	},

	_wakeup: function() {

		this._argument.wakeup();
		this._foreach_scope.wakeup();
		Lava.resumeListener(this._foreach_scope_changed_listener);

		this._refreshChildren();

		this.Abstract$_wakeup();

	},

	/**
	 * Get `_foreach_scope`.
	 * The only purpose of this method is to attach a listener to scope's {@link Lava.scope.Foreach#event:after_refresh} event
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