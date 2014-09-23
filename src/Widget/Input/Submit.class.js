
/**
 * Submit button was clicked
 * @event Lava.widget.input.Submit#clicked
 */

Lava.define(
'Lava.widget.input.Submit',
/**
 * Submit button input
 * @lends Lava.widget.input.Submit#
 * @extends Lava.widget.input.Abstract#
 */
{

	Extends: 'Lava.widget.input.Abstract',

	name: 'submit',
	_type: "submit",

	_event_handlers: {
		clicked: '_onClicked'
	},

	/**
	 * Submit button was clicked. Fire "clicked" event
	 * @param dom_event_name
	 * @param dom_event
	 */
	_onClicked: function(dom_event_name, dom_event) {

		this._fire('clicked');
		dom_event.preventDefault();

	}

});