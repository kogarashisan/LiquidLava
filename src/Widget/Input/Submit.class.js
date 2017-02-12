
/**
 * Submit button was clicked
 * @event Lava.widget.input.Submit#clicked
 */

Lava.define(
'Lava.widget.input.Submit',
/**
 * Submit button input
 * @lends Lava.widget.input.Submit#
 * @extends Lava.widget.input.InputAbstract#
 */
{

	Extends: 'Lava.widget.input.InputAbstract',

	name: 'submit',
	_type: "submit",

	_event_handlers: {
		clicked: '_onClicked'
	},

	/**
	 * Submit button was clicked. Fire "clicked" event
	 * @param dom_event_name
	 * @param event_object
	 */
	_onClicked: function(dom_event_name, event_object) {

		this._fire('clicked');
		event_object.preventDefault();

	}

});