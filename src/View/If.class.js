
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
	_active_argument_index: null,
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
	 * Refreshers animates insertion and removal of templates
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
			constructor,
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
		this._active_argument_index = this._getActiveArgumentIndex();

		if (this._config.refresher) {

			// otherwise, it will not be able to insert the template
			if (Lava.schema.DEBUG && !this._container) Lava.t('View/If: refresher needs container to work');
			constructor = Lava.ClassManager.getConstructor(this._config.refresher['class'], 'Lava.view.refresher');
			this._refresher = /** @type {Lava.view.refresher.Standard} */ new constructor(
				this._config.refresher,
				this, this._container
			);

		}

		this._active_template = this._getActiveTemplate();

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
	_getActiveArgumentIndex: function() {

		var i = 0,
			active_argument_index = null;

		for (; i < this._count_arguments; i++) {

			if (!!this._arguments[i].getValue()) {
				active_argument_index = i;
				break;
			}

		}

		return active_argument_index;

	},

	/**
	 * Get template that corresponds to argument that evaluates to <kw>true</kw>
	 * (or 'else' template, if there are no active arguments)
	 * @returns {?Lava.system.Template}
	 */
	_getActiveTemplate: function() {

		var result = null;

		if (this._active_argument_index != null) {

			this._createContent(this._active_argument_index);

			result = this._content[this._active_argument_index];

		} else if ('else_template' in this._config) {

			this._createElseContent();

			result = this._else_content;

		}

		return result;

	},

	/**
	 * Listener for argument's {@link Lava.scope.Argument#event:changed} event
	 */
	_onArgumentChanged: function() {

		var active_argument_index = this._getActiveArgumentIndex();

		if (this._active_argument_index != active_argument_index) {

			this._active_argument_index = active_argument_index;

			if (this._active_template && this._is_inDOM) {

				if (this._refresher) {

					this._refresher.removeTemplates([this._active_template]);

				} else {

					this._active_template.broadcastRemove();

				}

			}

			this._active_template = this._getActiveTemplate();

			this.trySetDirty();

		}

	},

	/**
	 * Render the currently active if/elseif section
	 * @returns {string}
	 */
	_renderContent: function() {

		if (Lava.schema.DEBUG && this._active_argument_index != null && this._arguments[this._active_argument_index].isWaitingRefresh()) Lava.t();

		this._refresher && this._refresher.onRender(this._active_template ? [this._active_template] : []);
		return this._active_template ? this._active_template.render() : '';

	},

	/**
	 * Broadcast to currently active if/elseif template
	 * @param {string} function_name
	 */
	_broadcastToChildren: function(function_name) {

		if (this._active_template) {

			this._active_template[function_name]();

		}

	},

	_sleep: function() {

		var i = 0,
			count = this._arguments.length;

		for (; i < count; i++) {

			this._arguments[i].sleep();

		}

		for (i = 0, count = this._argument_changed_listeners.length; i < count; i++) {

			Lava.suspendListener(this._argument_changed_listeners[i]);

		}

		this.Abstract$_sleep();

	},

	_wakeup: function() {

		for (i = 0, count = this._arguments.length; i < count; i++) {

			this._arguments[i].wakeup();

		}

		for (var i = 0, count = this._argument_changed_listeners.length; i < count; i++) {

			Lava.resumeListener(this._argument_changed_listeners[i]);

		}

		this._onArgumentChanged();

		this.Abstract$_wakeup();

	},

	/**
	 * Create the template that corresponds to a if/elseif section
	 * @param {number} index
	 */
	_createContent: function(index) {

		if (typeof(this._content[index]) == 'undefined') {

			this._content[index] = (index == 0)
				? new Lava.system.Template(this._config.template || [], this._widget, this)
				: new Lava.system.Template(this._config.elseif_templates[index - 1] || [], this._widget, this);

			this._content[index].batchSetProperty('if_index', index);

		}

	},

	/**
	 * Create the 'else' template
	 */
	_createElseContent: function() {

		if (this._else_content == null) {

			this._else_content = new Lava.system.Template(this._config.else_template || [], this._widget, this);

		}

	},

	_refresh: function() {

		if (this._refresher) {

			this._refresher.refresh(this._active_template ? [this._active_template] : []);

		} else {

			this._container.setHTML(this._renderContent());
			this._broadcastToChildren('broadcastInDOM');

		}

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