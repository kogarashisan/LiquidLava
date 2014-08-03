
Lava.define(
'Lava.widget.Tooltip',
/**
 * @lends Lava.widget.Tooltip#
 * @extends Lava.widget.Standard#
 */
{

	Extends: 'Lava.widget.Standard',

	name: 'tooltip',

	_property_descriptors: {
		y: {type: 'Integer'},
		x: {type: 'Integer'},
		y_offset: {type: 'Integer'},
		x_offset: {type: 'Integer'},
		html: {type: 'String'},
		is_visible: {type: 'Boolean'}
	},

	_properties: {
		y: 0,
		x: 0,
		y_offset: -25,
		x_offset: 5,
		html: '',
		is_visible: false
	}

});