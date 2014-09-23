
Lava.define(
'Lava.widget.input.SelectAbstract',
/**
 * Base class for select inputs
 * @lends Lava.widget.input.SelectAbstract#
 * @extends Lava.widget.input.Abstract#
 */
{

	Extends: 'Lava.widget.input.Abstract',

	name: 'select',

	_properties: {
		/**
		 * Option groups in this select input.
		 * &lt;optgroup&gt; tag is created only for those groups that have a title
		 */
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

	/**
	 * DOM element's value has changed: refresh local <i>value</i> property
	 */
	_onValueChanged: function() {

		this._refreshValue();

	},

	_refresh: function() {

		// to synchronize the selected value after setting options and optgroups property
		this.Abstract$_refresh();
		this._refreshValue();

	},

	/**
	 * Refresh local <i>value</i> property from DOM input element
	 */
	_refreshValue: function() {

		Lava.t('Abstract function call: _refreshValue');

	}

});