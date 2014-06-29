
Lava.define(
'Lava.widget.input.Submit',
/**
 * @lends Lava.widget.input.Submit#
 * @extends Lava.widget.input.Abstract#
 */
{

	Extends: 'Lava.widget.input.Abstract',

	name: 'submit',

	_event_handlers: {
		clicked: '_onClicked'
	},

	_type: "submit",

	_onClicked: function(dom_event_name, dom_event, view, template_arguments) {

		this._fire('clicked');
		dom_event.preventDefault();

	}

});