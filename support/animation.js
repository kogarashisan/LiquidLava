
_cAnimator = {

	type: ''

};

/**
 * @extends _cAnimator
 */
_cAnimator_Integer = {

	/**
	 * 'height' or 'width'
	 * @type {string}
	 */
	property: null,
	/**
	 * Starting value
	 * @type {number}
	 */
	from: null,
	/**
	 * Distance
	 * @type {number}
	 */
	delta: null,
	/**
	 * Will be appended to style value.
	 * @type {string}
	 */
	unit: 'px'

};

_cAnimation = {

	/**
	 * @type {number}
	 */
	duration: null,

	transition_name: 'linear',

	/** @type {_tTransitionCallback} */
	transition: null,

	/**
	 * @type {Array.<_cAnimator>}
	 */
	animators: []

};