
Lava.define(
'Lava.widget.CollapsiblePanel',
/**
 * An expandable panel with header and body
 * @lends Lava.widget.CollapsiblePanel#
 * @extends Lava.widget.Collapsible#
 */
{

	Extends: 'Lava.widget.Collapsible',

	name: 'collapsible_panel',

	_property_descriptors: {
		is_locked: {type: 'Boolean'}
	},

	_properties: {
		/** When panel is locked - it does not respond to header clicks */
		is_locked: false,
		/** Panel's title */
		title: ''
	},

	_event_handlers: {
		header_click: '_onHeaderClick'
	},

	/**
	 * Toggle <wp>is_expanded</wp> property, when not locked
	 */
	_onHeaderClick: function() {

		if (!this._properties.is_locked) {

			this.set('is_expanded', !this._properties.is_expanded);

		}

	}

});