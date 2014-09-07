Lava.define(
'Lava.animator.Color',
/**
 * @lends Lava.animator.Color#
 */
{

	_property_name: null,
	from: null,
	to: null,
	delta: null,

	/**
	 * @param {_cAnimator} config
	 */
	init: function(config) {

		this._property_name = config.property;
		this.from = config.from || [0,0,0];
		this.to = config.to || [0,0,0];
		this.delta = [this.to[0] - this.from[0], this.to[1] - this.from[1], this.to[2] - this.from[2]];

	},

	animate: function(element, transition_value) {

		var current_value = [
			Math.floor(this.from[0] + this.delta[0] * transition_value),
			Math.floor(this.from[1] + this.delta[1] * transition_value),
			Math.floor(this.from[2] + this.delta[2] * transition_value)
		];

		Firestorm.Element.setStyle(
			element,
			this._property_name,
			'rgb(' + current_value.join(',') + ')'
		);

	}

});