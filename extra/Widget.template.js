
// You can use this template as an example, when creating your own widgets

Lava.define(
'Lava.widget.*',
/**
 * @lends Lava.widget.*#
 * @extends Lava.widget.*#
 */
{

	Extends: 'Lava.widget.Standard',

	name: null,

	_property_descriptors: {
    	property_name: {setter: '_setPropertyName', type: '' /* Name from Firestorm.Types */}
	},

	_properties: {
		property_name: null
	},

	_event_handlers: {
		event_name: '_eventHandler'
	},

	_role_handlers: {
		role_name: '_roleHandler'
	},

	_include_handlers: {
		my_include: '_getMyInclude'
	},

	init: function(config, widget, parent_view, template, properties) {

		this.Standard$init(config, widget, parent_view, template, properties);

	},

	_eventHandler: function(dom_event_name, event_object, view, template_arguments) {

    },

	_roleHandler: function(view, template_arguments) {

    },

	_getMyInclude: function(template_arguments) {

    },

    _setPropertyName: function(name, value) {

    }

});