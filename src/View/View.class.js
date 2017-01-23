
Lava.define(
'Lava.view.View',
/**
 * @lends Lava.view.View#
 * @extends Lava.view.ContentContainerAbstract#
 */
{

	Extends: 'Lava.view.ContentContainerAbstract',

	_postInit: function() {

		if (
			Lava.schema.DEBUG
			&& (('argument' in this._config) || ('else_template' in this._config) || ('elseif_arguments' in this._config))
		) {
			Lava.t("Standard View does not support arguments and elseif/else blocks");
		}

	}

});