
Lava.define(
'Lava.view.If',
/**
 * @lends Lava.view.If#
 * @extends Lava.view.Abstract
 * @implements _iViewHierarchyMember
 */
{

	Extends: 'Lava.view.Abstract',

	/**
	 * @type {Array.<Lava.scope.Argument>}
	 */
	_arguments: [],
	_argument_changed_listeners: [],
	_count_arguments: 0,
	_active_argument_index: null,
	/**
	 * @type {Array.<_tRenderable>}
	 */
	_contents: [],
	/**
	 * @type {_tRenderable}
	 */
	_else_contents: null,

	/**
	 * @type {(Lava.view.refresher.Default)}
	 */
	_refresher: null,
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
			this._refresher = /** @type {Lava.view.refresher.Default} */ new constructor(
				this._config.refresher,
				this, this._container
			);

		}

		this._active_template = this._getActiveTemplate();

	},

	getRefresher: function() {

		return this._refresher;

	},

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

	_getActiveTemplate: function() {

		var result = null;

		if (this._active_argument_index != null) {

			this._createContents(this._active_argument_index);

			result = this._contents[this._active_argument_index];

		} else if ('else_template' in this._config) {

			this._createElseContents();

			result = this._else_contents;

		}

		return result;

	},

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

	_renderContents: function() {

		if (Lava.schema.DEBUG && this._active_argument_index != null && this._arguments[this._active_argument_index].isWaitingRefresh()) Lava.t();

		this._refresher && this._refresher.onRender(this._active_template ? [this._active_template] : []);
		return this._active_template ? this._active_template.render() : '';

	},

	/**
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

	_createContents: function(index) {

		if (typeof(this._contents[index]) == 'undefined') {

			this._contents[index] = (index == 0)
				? new Lava.system.Template(this._config.template || [], this._widget, this)
				: new Lava.system.Template(this._config.elseif_templates[index - 1] || [], this._widget, this);

			this._contents[index].batchSetProperty('if_index', index);

		}

	},

	_createElseContents: function() {

		if (this._else_contents == null) {

			this._else_contents = new Lava.system.Template(this._config.else_template || [], this._widget, this);

		}

	},

	_refresh: function() {

		if (this._refresher) {

			this._refresher.refresh(this._active_template ? [this._active_template] : []);

		} else {

			this._container.setHTML(this._renderContents());
			this._broadcastToChildren('broadcastInDOM');

		}

	},

	destroy: function() {

		var i = 0;

		this._refresher && this._refresher.destroy();

		for (; i < this._count_arguments; i++) {

			this._arguments[i].destroy();
			this._contents[i] && this._contents[i].destroy();

		}

		this._else_contents && this._else_contents.destroy();

		// to speed up garbage collection and break this object forever (destroyed objects must not be used!)
		this._refresher = this._contents = this._else_contents = this._arguments = this._active_template
			= this._argument_changed_listeners = null;

		this.Abstract$destroy();

	}

});