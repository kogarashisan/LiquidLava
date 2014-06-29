
Lava.define(
'Lava.widget.input.Text',
/**
 * @lends Lava.widget.input.Text#
 * @extends Lava.widget.input.TextAbstract#
 */
{

	Extends: 'Lava.widget.input.TextAbstract',

	name: 'text_input',

	_type: "text",

	_handleInputView: function(view, template_arguments) {

		this.TextAbstract$_handleInputView(view, template_arguments);
		this._input_container.storeProperty('value', this._properties.value);

	}

});