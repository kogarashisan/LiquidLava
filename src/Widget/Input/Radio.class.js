
Lava.define(
'Lava.widget.input.Radio',
/**
 * Radio input
 * @lends Lava.widget.input.Radio#
 * @extends Lava.widget.input.RadioAbstract#
 */
{

	Extends: 'Lava.widget.input.RadioAbstract',

	name: 'radio',
	_type: "radio",

	broadcastInDOM: function() {

		this.RadioAbstract$broadcastInDOM();

		if (this._input_container) {
			// There may be situation, when several radios with same name are rendered as checked.
			// Only the last one of them will stay checked, others will be turned off by the browser.
			this.set('is_checked', this._input_container.getDOMElement().checked);
		}

	}

});