
Lava.define(
'Lava.widget.MainPageTree',
{

	Extends: 'Lava.widget.Standard',
	name: 'tree',

	_properties: {
		records: null
	},

	_event_handlers: {
		node_click: '_onNodeClick'
	},

	_onNodeClick: function(dom_event_name, dom_event, view, template_arguments) {

		var node = template_arguments[0];
		node.set('is_expanded', !node.get('is_expanded'));
		dom_event.preventDefault(); // to prevent text selection

	}

});