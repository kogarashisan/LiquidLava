
_cAnimator = {

	type: ''

};

/**
 * @extends _cAnimator
 */
_cAnimator_Units = {

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

	transition: 'linear',

	/**
	 * @type {Array.<_cAnimator>}
	 */
	animators: []

};