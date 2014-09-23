Lava.define(
'Lava.animator.Color',
/**
 * Animate colors
 * @lends Lava.animator.Color#
 * @implements _iAnimator
 */
{

	/**
	 * Property to animate, like 'background-color'
	 * @type {string}
	 */
	property_name: null,
	/**
	 * Starting color
	 * @type {Array.<number>}
	 */
	from: null,
	/**
	 * End color
	 * @type {Array.<number>}
	 */
	to: null,
	/**
	 * Computed difference between starting and the end color
	 * @type {Array.<number>}
	 */
	delta: null,

	/**
	 * Create the animator instance
	 * @param {_cAnimator_Color} config
	 */
	init: function(config) {

		this.property_name = config.property;
		this.from = config.from || [0,0,0];
		this.to = config.to || [0,0,0];
		this.delta = [this.to[0] - this.from[0], this.to[1] - this.from[1], this.to[2] - this.from[2]];

	},

	/**
	 * Perform animation
	 * @param {HTMLElement} element
	 * @param {number} transition_value Value of animation. Usually between 0 and 1, but sometimes it may cross the bounds
	 */
	animate: function(element, transition_value) {

		var current_value = [
			Math.floor(this.from[0] + this.delta[0] * transition_value),
			Math.floor(this.from[1] + this.delta[1] * transition_value),
			Math.floor(this.from[2] + this.delta[2] * transition_value)
		];

		Firestorm.Element.setStyle(
			element,
			this.property_name,
			'rgb(' + current_value.join(',') + ')'
		);

	}

});