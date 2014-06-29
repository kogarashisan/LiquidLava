Lava.ClassManager.define(
'Lava.widget.PanelExample1',
/** @extends {Lavadoc.widget.Standard} */
{

	Extends: 'Lava.widget.Standard',

	name: 'example_panel',

	_properties: {
		is_expanded: true
	},

	_event_handlers: {
		toggle_click: '_onToggleClick'
	},

	_onToggleClick: function(dom_event_name, dom_event, view, template_arguments) {

		/*H:The only significant line of code*/this.set('is_expanded', !this.get('is_expanded'));/*:H*/

	}

});