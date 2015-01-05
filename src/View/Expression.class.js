
Lava.define(
'Lava.view.Expression',
/**
 * View that displays result of an Argument
 *
 * @lends Lava.view.Expression#
 * @extends Lava.view.Abstract
 * @implements _iViewHierarchyMember
 */
{

	Extends: 'Lava.view.Abstract',
	/**
	 * Argument that returns a string
	 * @type {Lava.scope.Argument}
	 */
	_argument: null,
	/**
	 * Listener to {@link Lava.scope.Argument#event:changed}
	 * @type {_tListener}
	 */
	_argument_changed_listener: null,

	/**
	 * Should the view escape HTML entities in argument's value. May be turned off via config switch
	 * @type {boolean}
	 */
	_escape: true,

	_postInit: function() {

		if (Lava.schema.DEBUG && !('argument' in this._config)) Lava.t("Expression view requires an argument");
		this._escape = !this._config.escape_off;
		this._argument = new Lava.scope.Argument(this._config.argument, this, this._widget);
		this._argument_changed_listener = this._argument.on('changed', this._onValueChanged, this);

	},

	/**
	 * Argument's value has changed, schedule refresh
	 */
	_onValueChanged: function() {

		this.trySetDirty();

	},

	_renderContent: function() {

		if (Lava.schema.DEBUG && this._argument.isWaitingRefresh()) Lava.t();

		var result = '',
			new_value = this._argument.getValue();

		if (new_value != null && typeof(new_value) != 'undefined') {

			result = this._escape
				? this.escapeArgumentValue(new_value.toString())
				: new_value.toString();

		}

		return result;

	},

	/**
	 * Perform escaping of HTML entities in argument's value
	 * @param {string} string Argument's value
	 * @returns {string} Escaped value
	 */
	escapeArgumentValue: function(string) {

		return Firestorm.String.escape(string, Firestorm.String.HTML_ESCAPE_REGEX);

	},

	destroy: function() {

		this._argument.destroy();
		this._argument = null;

		this.Abstract$destroy();

	}

});