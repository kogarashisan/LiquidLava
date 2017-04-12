
Lava.define(
'Lava.view.TextArea',
/**
 * This view is intended for use with textarea container - it properly escapes the text inside.
 *
 * @lends Lava.view.TextArea#
 * @extends Lava.view.ContentContainerAbstract#
 */
{

	Extends: 'Lava.view.ContentContainerAbstract',

    _argument: null,

    _afterInit: function() {

        if (Lava.schema.DEBUG && (('else_template' in this._config) || ('elseif_arguments' in this._config))) {
            Lava.t("TextArea View does not support elseif/else blocks");
        }

        if (Lava.schema.DEBUG && !('argument' in this._config)) Lava.t("TextArea view requires an argument");
        this._argument = new Lava.scope.Argument(this._config.argument, this);

		this.Abstract$_afterInit();

    },

	_renderContent: function() {

        if (Lava.schema.DEBUG && this._argument.isWaitingRefresh()) Lava.t("Rendering a view in dirty state");
		return Firestorm.String.escape(this._argument.getValue(), Firestorm.String.TEXTAREA_ESCAPE_REGEX);

	},

    destroy: function() {

        this._argument.destroy();
        this._argument = null;

        this.ContentContainerAbstract$destroy();

    }

});