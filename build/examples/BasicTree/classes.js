Lava.ClassManager.define(
'Lava.widget.TreeView1',
/** @extends {Lava.widget.Standard} */
{

	Extends: 'Lava.widget.Standard',

	name: 'tree_view',

	_event_handlers: {
		node_click: '_onNodeClick'
	},

	_onNodeClick: function(dom_event_name, dom_event, view, template_arguments) {

		var node = template_arguments[0];
		node.set('is_expanded', !node.get('is_expanded'));/*H:The only significant line of code*/

	}

});