
_cAnimator = {

	/**
	 * Name of the animator class (default namespace is "Lava.animator")
	 * @type {string}
	 */
	type: null,

	/**
	 * Element's property name, like 'height' or 'background-color'
	 * @type {string}
	 */
	property: null

};

/**
 * @extends _cAnimator
 */
_cAnimator_Integer = {

	/**
	 * Starting value
	 * @type {number}
	 */
	from: null,
	/**
	 * Distance (may be negative)
	 * @type {number}
	 */
	delta: null,
	/**
	 * Will be appended to style value
	 * @type {string}
	 */
	unit: 'px'

};

/**
 * @extends _cAnimator
 */
_cAnimator_Color = {

	/**
	 * Starting color
	 * @type {Array}
	 */
	from: [0, 0, 0],
	/**
	 * End color
	 * @type {Array}
	 */
	to: [0, 0, 0]

};

_cAnimation = {

	/**
	 * Animation duration in milliseconds
	 * @type {number}
	 */
	duration: null,

	/**
	 * Name of transition from {@link Lava.transitions}
	 * @type {string}
	 */
	transition_name: 'linear',

	/**
	 * Custom transition method. Either `transition` or `transition_name` may be supplied
	 * @type {_tTransitionCallback}
	 */
	transition: null,

	/**
	 * Collection of animator configs
	 * @type {Array.<_cAnimator>}
	 */
	animators: []

};

_iAnimator = {
	/**
	 * Set current value of target's property
	 * @param {*} target
	 * @param {number} transition_value
	 */
	animate: function(target, transition_value) {}
};