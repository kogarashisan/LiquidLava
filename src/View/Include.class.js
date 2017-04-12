Lava.define(
'Lava.view.Include',
/**
 * View, that displays a template, returned by an argument
 *
 * @lends Lava.view.Include#
 * @extends Lava.view.Abstract
 * @implements _iViewHierarchyMember
 */
{

	Extends: 'Lava.view.Abstract',
	/**
	 * Argument that returns a template config
	 * @type {Lava.scope.Argument}
	 */
	_argument: null,
	/**
	 * Listener for {@link Lava.scope.Argument#event:changed}
	 * @type {_tListener}
	 */
	_argument_changed_listener: null,
	/**
	 * Child template
	 * @type {Lava.system.Template}
	 */
	_content: null,

	_afterInit: function() {

		if (Lava.schema.DEBUG && !('argument' in this._config)) Lava.t("Include view requires an argument");
		this._argument = new Lava.scope.Argument(this._config.argument, this);
		this._argument_changed_listener = this._argument.on('changed', this._onValueChanged, this);

		this.Abstract$_afterInit();

	},

	/**
	 * Argument's value has changed. Old content in not valid.
	 */
	_onValueChanged: function() {

		this._content && this._content.destroy();
		this._content = null;
		this.trySetDirty();

	},

	render: function() {

		if (Lava.schema.DEBUG && this._argument.isWaitingRefresh()) Lava.t("Rendering a view in dirty state");

		var result;

		if (this._container) {

			result = this._container.wrap(this._renderContent());

		} else {

			result = this._renderContent();

		}

		return result;

	},

	_renderContent: function() {

		return this._getContent().render();

	},

	_refresh: function() {

		this._container.setHTML(this._renderContent());
		this._broadcastToChildren('broadcastInDOM');

	},

	/**
	 * @param {string} function_name
	 */
	_broadcastToChildren: function(function_name) {

		if (this._content != null) {

			this._content[function_name]();

		}

	},

	/**
	 * Get `_content`. Create, if needed
	 * @returns {Lava.system.Template}
	 */
	_getContent: function() {

		if (this._content == null) {

			var argument_value = this._argument.getValue();
			if (Lava.schema.DEBUG && argument_value && !Array.isArray(argument_value)) Lava.t("Include view expects to receive a template from it's argument");

			this._content = new Lava.system.Template(
				this._argument.getValue() || this._config.template || [],
				this._widget,
				this
			)

		}

		return this._content;

	},

	destroy: function() {

		this._content && this._content.destroy();
		this._argument.destroy();
		this._argument_changed_listener
			= this._argument
			= this._content
			= null;

		this.Abstract$destroy();

	}

});