
Lava.define(
'Lava.animation.Emulated',
/**
 * Used to animate with CSS transitions. Does not have keyframes, just a single timeout event
 * @lends Lava.animation.Emulated#
 * @extends Lava.animation.Abstract
 */
{

	Extends: 'Lava.animation.Abstract',

	/**
	 * Tell other classes that this is instance of Lava.animation.Emulated
	 */
	isEmulatedAnimation: true,

	/**
	 * Window timeout id
	 * @type {?number}
	 */
	_timeout: null,

	/**
	 * Create an animation
	 * @param {_cAnimation} config
	 * @param {*} target
	 */
	init: function(config, target) {

		this.Abstract$init(config, target);

		var self = this;
		this.onTimer = function() {
			self._onTimeout();
		}

	},

	/**
	 * Callback for window timeout event
	 */
	_onTimeout: function() {

		this._timeout = null;
		this._end();
		this._finish();

	},

	/**
	 * Apply the ended state to the target
	 */
	_end: function() {

	},

	/**
	 * Clear old timeout, if it exists
	 */
	_cancelTimeout: function() {
		if (this._timeout) {
			window.clearTimeout(this._timeout);
			this._timeout = null;
		}
	},

	/**
	 * Start animation
	 */
	start: function() {

		if (this._is_running) {
			this.stop();
		}

		this._is_running = true;
		this._start();
		this._timeout = window.setTimeout(this.onTimer, this._duration);

	},

	/**
	 * Apply the started state to the target
	 */
	_start: function() {

	},

	/**
	 * Stop animation immediately where it is. Do not fire {@link Lava.animation.Abstract#event:complete}
	 */
	stop: function() {

		if (this._is_running) {
			this._is_running = false;
			this._cancelTimeout();
		}

	},

	_mirror: function() {

		if (this._is_running) {
			this.stop();
			this._reverse();
			this._is_running = true;
			// any CSS transition takes fixed amount of time
			this._timeout = window.setTimeout(this.onTimer, this._duration);
		}

		this._is_reversed = !this._is_reversed;

	},

	/**
	 * Actions to reverse Emulated animation while it's still running
	 */
	_reverse: function() {

	},

	/**
	 * End the animation and Apply the end state to target
	 */
	finish: function() {

		if (this._is_running) {
			this._cancelTimeout();
			this._onTimeout();
		}

	}

});