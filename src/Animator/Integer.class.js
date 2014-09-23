Lava.define(
'Lava.animator.Integer',
/**
 * Animate integer units, like pixels
 * @lends Lava.animator.Integer#
 * @implements _iAnimator
 */
{

	/**
	 * Property to animate, like 'width' or 'height'
	 * @type {string}
	 */
	property_name: null,
	/**
	 * Starting property value
	 * @type {number}
	 */
	from: 0,
	/**
	 * End property value
	 * @type {number}
	 */
	delta: 0,
	/**
	 * CSS unit for animated property, like 'px'
	 */
	unit: null,

	/**
	 * Create the animator instance
	 * @param {_cAnimator_Integer} config
	 */
	init: function(config) {

		this.property_name = config.property;
		this.from = config.from || 0;
		this.delta = config.delta;
		this.unit = config.unit || 'px';

	},

	/**
	 * Perform animation
	 * @param {HTMLElement} element
	 * @param {number} transition_value Value of animation. Usually between 0 and 1, but sometimes it may cross the bounds
	 */
	animate: function(element, transition_value) {

		var raw_result = this.from + this.delta * transition_value;

		Firestorm.Element.setStyle(
			element,
			this.property_name,
			Math.floor(raw_result) + this.unit
		);

	}

});