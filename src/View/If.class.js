
Lava.define(
'Lava.view.If',
/**
 * Display content depending on condition
 *
 * @lends Lava.view.If#
 * @extends Lava.view.Abstract
 * @implements _iViewHierarchyMember
 */
{

	Extends: 'Lava.view.Abstract',

	/**
	 * One argument for each if/elseif section
	 * @type {Array.<Lava.scope.Argument>}
	 */
	_arguments: [],
	/**
	 * For each argument: it's {@link Lava.scope.Argument#event:changed} listener
	 * @type {Array.<_tListener>}
	 */
	_argument_changed_listeners: [],
	/**
	 * Total number of if/elseif sections
	 * @type {number}
	 */
	_count_arguments: 0,
	/**
	 * Currently active if/elseif section id
	 * @type {number}
	 */
	_active_argument_index: -1,
	/**
	 * Content of each if/elseif section
	 * @type {Array.<Lava.system.Template>}
	 */
	_content: [],
	/**
	 * Template to display when all if/elseif conditions are <kw>false</kw>
	 * @type {Lava.system.Template}
	 */
	_else_content: null,

	/**
	 * Refreshers animate insertion and removal of templates.
	 * They can also insert and remove templates independently of each other
	 * @type {(Lava.view.refresher.Standard)}
	 */
	_refresher: null,
	/**
	 * Currently active Template instance, including the 'else' template
	 * @type {Lava.system.Template}
	 */
	_active_template: null,

	_postInit: function() {

		if (Lava.schema.DEBUG && !('argument' in this._config)) Lava.t("If view requires an argument");

		var i = 0,
			count,
			argument = new Lava.scope.Argument(this._config.argument, this, this._widget);

		this._argument_changed_listeners.push(argument.on('changed', this._onArgumentChanged, this));
		this._arguments.push(argument);

		if ('elseif_arguments' in this._config) {

			for (count = this._config.elseif_arguments.length; i < count; i++) {

				argument = new Lava.scope.Argument(this._config.elseif_arguments[i], this, this._widget);
				this._argument_changed_listeners.push(argument.on('changed', this._onArgumentChanged, this));
				this._arguments.push(argument);

			}

		}

		this._count_arguments = this._arguments.length;
		this._refreshActiveArgumentIndex();

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

		if (Lava.schema.DEBUG && (this._refresher || this._current_count)) Lava.t("If: refresher is already created or createRefresher() was called outside of init()");
		if (Lava.schema.DEBUG && !this._container) Lava.t('View/If: refresher needs container to work');

		var constructor = Lava.ClassManager.getConstructor(refresher_config['type'], 'Lava.view.refresher');
		this._refresher = /** @type {Lava.view.refresher.Standard} */ new constructor(refresher_config, this, this._container);

		this._refresher.on('removal_complete', this._onRemovalComplete, this);
		this._refresh = this._refresh_Refresher;
		this._removeTemplate = this._removeTemplate_Refresher;
		this._renderContent = this._renderContent_Refresher;
		this._broadcastToChildren = this._broadcastToChildren_Refresher;

	},

	/**
	 * Animation has ended and template was removed from DOM. Destroy it.
	 * @param {Lava.view.refresher.Standard} refresher
	 * @param {Lava.system.Template} template
	 */
	_onRemovalComplete: function(refresher, template) {

		this._destroyTemplate(template);

	},

	/**
	 * Get `_refresher`
	 * @returns {Lava.view.refresher.Standard}
	 */
	getRefresher: function() {

		return this._refresher;

	},

	/**
	 * Get index of the first argument which evaluates to <kw>true</kw>
	 * @returns {?number} Zero-based argument index, or <kw>null</kw>, if all arguments evaluate to <kw>false</kw>
	 */
	_refreshActiveArgumentIndex: function() {

		this._active_argument_index = -1;

		for (var i = 0; i < this._count_arguments; i++) {

			if (!!this._arguments[i].getValue()) {

				this._active_argument_index = i;
				break;

			}

		}

	},

	/**
	 * Get template that corresponds to argument that evaluates to <kw>true</kw>
	 * (or 'else' template, if there are no active arguments)
	 * @returns {?Lava.system.Template}
	 */
	_getActiveTemplate: function() {

		var result = null,
			index = this._active_argument_index;

		if (index != -1) {

			if (!this._content[index]) {

				this._content[index] = (index == 0)
					? new Lava.system.Template(this._config.template || [], this._widget, this, {if_index: index})
					: new Lava.system.Template(this._config.elseif_templates[index - 1] || [], this._widget, this, {if_index: index});

			}

			result = this._content[index];

		} else if ('else_template' in this._config) {

			if (this._else_content == null) {

				this._else_content = new Lava.system.Template(this._config.else_template || [], this._widget, this);

			}

			result = this._else_content;

		}

		return result;

	},

	/**
	 * Listener for argument's {@link Lava.scope.Argument#event:changed} event
	 */
	_onArgumentChanged: function() {

		var old_active_argument_index = this._active_argument_index;
		this._refreshActiveArgumentIndex();

		if (this._active_argument_index != old_active_argument_index) {

			if (this._active_template && this._is_inDOM) {

				this._removeTemplate(this._active_template);

			}

			this.trySetDirty();
			this._active_template = null;

		}

	},

	/**
	 * Branches that are not in DOM are destroyed
	 * @param {Lava.system.Template} template
	 */
	_destroyTemplate: function(template) {

		var index = this._content.indexOf(template);

		if (index == -1) {
			if (Lava.schema.DEBUG && template != this._else_content) Lava.t();
			this._else_content = null;
		} else {
			this._content[index] = null;
		}

		template.destroy();

	},

	/**
	 * Destroys branches, that are removed from DOM
	 * @param {Lava.system.Template} template
	 */
	_removeTemplate: function(template) {

		this._destroyTemplate(template);

	},

	/**
	 * Removes branches from DOM using a refresher instance
	 * @param {Lava.system.Template} template
	 */
	_removeTemplate_Refresher: function(template) {

		this._refresher.prepareRemoval([template]);

	},

	/**
	 * Render the currently active if/elseif section
	 * @returns {string}
	 */
	_renderContent: function() {

		if (Lava.schema.DEBUG && this._active_argument_index != -1 && this._arguments[this._active_argument_index].isWaitingRefresh()) Lava.t();
		this._active_template = this._getActiveTemplate();
		return this._active_template ? this._active_template.render() : '';

	},

	/**
	 * Version of `_renderContent` which uses created refresher instance
	 * @returns {string}
	 */
	_renderContent_Refresher: function() {

		if (Lava.schema.DEBUG && this._active_argument_index != -1 && this._arguments[this._active_argument_index].isWaitingRefresh()) Lava.t();
		this._active_template = this._getActiveTemplate();
		return this._refresher.render(this._active_template ? [this._active_template] : []);

	},

	/**
	 * Broadcast to currently active if/elseif template
	 * @param {string} function_name
	 */
	_broadcastToChildren: function(function_name) {

		this._active_template && this._active_template[function_name]();

	},

	/**
	 * Version of `_broadcastToChildren` for use with refresher instance
	 * @param {string} function_name
	 */
	_broadcastToChildren_Refresher: function(function_name) {

		this._refresher[function_name]();

	},

	_refresh: function() {

		this._container.setHTML(this._renderContent());
		this._broadcastToChildren('broadcastInDOM');

	},

	/**
	 * Version of `_refresh` for use with refresher instance
	 */
	_refresh_Refresher: function() {

		if (!this._active_template) {
			this._active_template = this._getActiveTemplate();
		}
		this._refresher.refresh(this._active_template ? [this._active_template] : []);

	},

	destroy: function() {

		var i = 0;

		this._refresher && this._refresher.destroy();

		for (; i < this._count_arguments; i++) {

			this._arguments[i].destroy();
			this._content[i] && this._content[i].destroy();

		}

		this._else_content && this._else_content.destroy();

		// to speed up garbage collection and break this object forever (destroyed objects must not be used!)
		this._refresher = this._content = this._else_content = this._arguments = this._active_template
			= this._argument_changed_listeners = null;

		this.Abstract$destroy();

	}

});