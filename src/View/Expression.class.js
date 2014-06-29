
Lava.define(
'Lava.view.Expression',
/**
 * @lends Lava.view.Expression#
 * @extends Lava.view.Abstract
 * @extends Lava.view.Abstract
 * @implements _iViewHierarchyMember
 */
{

	Extends: 'Lava.view.Abstract',
	/**
	 * @type {Lava.scope.Argument}
	 */
	_argument: null,
	_argument_changed_listener: null,

	_escape: true,

	_postInit: function() {

		if (Lava.schema.DEBUG && !('argument' in this._config)) Lava.t("Expression view requires an argument");
		this._escape = !this._config.escape_off;
		this._argument = new Lava.scope.Argument(this._config.argument, this, this._widget);
		this._argument_changed_listener = this._argument.on('changed', this.onValueChanged, this);

	},

	onValueChanged: function() {

		this.trySetDirty();

	},

	_renderContents: function() {

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

	_sleep: function() {

		this._argument.sleep();
		Lava.suspendListener(this._argument_changed_listener);

		this.Abstract$_sleep();

	},

	_wakeup: function() {

		Lava.resumeListener(this._argument_changed_listener);
		this._argument.wakeup(true);

		this.Abstract$_wakeup();

	},

	escapeArgumentValue: function(string) {

		return Firestorm.String.escape(string, Firestorm.String.HTML_ESCAPE_REGEX);

	},

	destroy: function() {

		this._argument.destroy();
		this._argument = null;

		this.Abstract$destroy();

	}

});