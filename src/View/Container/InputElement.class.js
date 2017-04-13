
Lava.define(
'Lava.view.container.InputElement',
/**
 * Container for all other inputs, which protects from wrong user actions
 *
 * @lends Lava.view.container.TextInputElement#
 * @extends Lava.view.container.Element
 */
{
	Extends: "Lava.view.container.Element",

	storeProperty: function(name, value) {

		if (
			Lava.schema.DEBUG
			&& name == 'type'
			&& (['checkbox', 'radio'].indexOf(value) != -1 || (value in Lava.parsers.Common.TEXTLIKE_INPUTS))
		) Lava.t("You can not change type of inputs freely (cause they have different container class).");
		this.Element$storeProperty(name, value);

	}

});