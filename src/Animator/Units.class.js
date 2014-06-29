Lava.define(
'Lava.animator.Units',
{

	_property_name: null,
	from: 0,
	delta: 0,
	unit: null,

	/**
	 * @param {_cAnimator_Units} config
	 */
	init: function(config) {

		this._property_name = config.property;
		this.from = config.from || 0;
		this.delta = config.delta;
		this.unit = config.unit || 'px';

	},

	animate: function(element, transition_value) {

		var raw_result = this.from + this.delta * transition_value;

		Firestorm.Element.setStyle(
			element,
			this._property_name,
			Math.floor(raw_result) + this.unit
		);

	}

});