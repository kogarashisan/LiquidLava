
Lava.define(
'Lava.widget.input.TextArea',
/**
 * Multiline text input field
 * @lends Lava.widget.input.TextArea#
 * @extends Lava.widget.input.TextAbstract#
 */
{

	Extends: 'Lava.widget.input.TextAbstract',

	name: 'textarea',

	_renderContents: function() {

		return Firestorm.String.escape(this._properties.value, Firestorm.String.TEXTAREA_ESCAPE_REGEX);

	}

});