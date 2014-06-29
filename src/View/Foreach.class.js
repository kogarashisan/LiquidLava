
Lava.define(
'Lava.view.Foreach',
/**
 * @lends Lava.view.Foreach#
 * @extends Lava.view.Abstract
 * @implements _iViewHierarchyMember
 */
{

	Extends: 'Lava.view.Abstract',

	/**
	 * @type {Lava.scope.Argument}
	 */
	_argument: null,
	_foreach_scope: null,
	_foreach_scope_changed_listener: null,

	// = _current_uids.length
	_current_count: 0,
	// [index] => uid
	_current_uids: [],
	/**
	 * [guid] => template
	 * @type {Object.<string, Lavadoc._tRenderable>}
	 */
	_current_hash: {},

	_current_templates: [],

	/**
	 * The name of variable, holding the concrete record in child views
	 * @type {string}
	 */
	_as: null,

	/**
	 * @type {(Lava.view.refresher.Default)}
	 */
	_refresher: null,

	_properties: {
		count: 0
	},

	_postInit: function() {

		if (this._config.refresher) {

			if (Lava.schema.DEBUG && !this._container) Lava.t('View/Foreach: refresher needs container to work');
			var constructor = Lava.ClassManager.getConstructor(this._config.refresher['class'], 'Lava.view.refresher');
			this._refresher = /** @type {Lava.refresher.Default} */ new constructor(
				this._config.refresher,
				this,
				this._container
			);

			this._refresher.on('removal_complete', this._onRemovalComplete, this);

		}

		this._refreshChildren();

	},

	getRefresher: function() {

		return this._refresher;

	},

	_initMembers: function(properties) {

		if (Lava.schema.DEBUG && !('argument' in this._config)) Lava.t("Foreach view requires an argument");
		if (Lava.schema.DEBUG && !this._config.as) Lava.t("Foreach view requires 'as' hash parameter");
		if (Lava.schema.DEBUG && !this._config.template) Lava.t("Foreach view must not be empty");

		this.Abstract$_initMembers(properties);

		this._argument = new Lava.scope.Argument(this._config.argument, this, this._widget);
		this._foreach_scope = new Lava.scope.Foreach(this._argument);
		this._foreach_scope_changed_listener = this._foreach_scope.on('changed', this._onDataSourceChanged, this);
		this._foreach_scope.on('new_enumerable', this._onEnumerableChanged, this);
		this._as = this._config.as;
		// set the count before the view's container is created, cause if it depends on count
		// - it will be dirty right after creation
		this.set('count', this._foreach_scope.getValue().getCount());

	},

	/**
	 * Scope hac created a new instance of Enumerable.
	 * Now all UIDs belong to the old enumerable, so must get rid of all templates.
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

	_refreshChildren: function() {

		var data_source = this._foreach_scope.getValue(),
			new_uids = data_source.getLocalUIDs(),
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

	_onDataSourceChanged: function() {

		this._refreshChildren();
		this.trySetDirty();

	},

	_onRemovalComplete: function(template) {

		template.destroy();

	},

	_renderContents: function() {

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

			this._container.setHTML(this._renderContents());
			this._broadcastToChildren('broadcastInDOM');

		}

	},

	/**
	 * @param {string} function_name
	 */
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