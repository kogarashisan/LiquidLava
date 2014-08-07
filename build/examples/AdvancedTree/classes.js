Lava.ClassManager.define(
'Lava.widget.TreeExample',
/** @extends {Lava.widget.Standard} */
{

	Extends: 'Lava.widget.Standard',

	name: 'tree_example',

	_properties: {
		records: null
	},

	_event_handlers: {
		expand_collapse: '_toggleTree'
	},

	_toggleTree: function(dom_event_name, dom_event, view, template_arguments) {

		var action = template_arguments[1] ? 'expandAll' : 'collapseAll';
		Lava.view_manager.getViewById(template_arguments[0])[action]();

	}

});