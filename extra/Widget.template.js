
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

	PROPERTY_DESCRIPTORS: {
    	property_name: {setter: '_setPropertyName', type: '' /* Name from Firestorm.Types */}
	},

	_properties: {
		property_name: null
	},

	EVENT_HANDLERS: [
		'onEvent'
	],

	TEMPLATE_METHODS: [
		'doSomething'
	],

	init: function(config, widget, parent_view, template, properties) {

		this.Standard$init(config, widget, parent_view, template, properties);

	},

	onEvent: function(any_arguments) {

		Lava.t("Not implemented");

    },

	doSomething: function(any_arguments) {

		Lava.t("Not implemented");

	},

    _setPropertyName: function(name, value) {

		Lava.t("Not implemented");

    }

});