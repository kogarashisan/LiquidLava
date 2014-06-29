
function _cAnimator() {

	this.type = '';

}

/**
 * @extends _cAnimator
 */
function _cAnimator_Units() {

	/**
	 * 'height' or 'width'
	 * @type {string}
	 */
	this.property = null;
	/**
	 * Starting value
	 * @type {number}
	 */
	this.from = null;
	/**
	 * Distance
	 * @type {number}
	 */
	this.delta = null;
	/**
	 * Will be appended to style value.
	 * @type {string}
	 */
	this.unit = 'px';

}

function _cAnimation() {

	/**
	 * @type {number}
	 */
	this.duration = null;

	this.transition = 'linear';

	/**
	 * @type {Array.<_cAnimator>}
	 */
	this.animators = [];

}