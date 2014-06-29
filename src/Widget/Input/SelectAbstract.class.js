
Lava.define(
'Lava.widget.input.SelectAbstract',
/**
 * @lends Lava.widget.input.SelectAbstract#
 * @extends Lava.widget.input.Abstract#
 */
{

	Extends: 'Lava.widget.input.Abstract',

	name: 'select',

	_properties: {
		// optgroup tag is created only for those groups that have a title
		optgroups: null
	},

	_event_handlers: {
		value_changed: '_onValueChanged'
	},

	_modifiers: {
		isValueSelected: 'isValueSelected'
	},

	broadcastInDOM: function() {

		this.Abstract$broadcastInDOM();
		this._refreshValue();

	},

	_onValueChanged: function(dom_event_name, dom_event, view, template_arguments) {

		this._refreshValue();

	},

	_refresh: function() {

		// to synchronize the selected value after setting options and optgroups property
		this.Abstract$_refresh();
		this._refreshValue();

	},

	_refreshValue: function() {

		Lava.throw('Abstract function call: _refreshValue');

	}

});