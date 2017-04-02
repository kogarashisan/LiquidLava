
Lava.define(
'Lava.widget.Tooltip',
/**
 * Tooltip instance.
 * Tooltips are controlled by {@link Lava.system.PopoverManager}
 *
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
		/** Vertical position of the tooltip */
		y: 0,
		/** Vertical position of the tooltip */
		x: 0,
		/** Vertical offset of the tooltip instance from cursor pointer */
		y_offset: -25,
		/** Horizontal tooltip offset */
		x_offset: 5,
		/** Tooltip's content */
		html: '',
		/** Is this tooltip instance visible */
		is_visible: false
	}

});