
/**
 * Animation has ended
 * @event Lava.animation.Abstract#complete
 */

Lava.define(
'Lava.animation.Abstract',
/**
 * Animation changes properties of HTML elements over time
 * @lends Lava.animation.Abstract#
 * @extends Lava.mixin.Observable
 */
{

	Class: {
		is_abstract: true
	},

	Extends: 'Lava.mixin.Observable',

	/**
	 * The time when animation was started, in milliseconds
	 * @type {number}
	 */
	_started_time: 0,
	/**
	 * The time animation ends (or has ended), in milliseconds
	 * @type {number}
	 */
	_end_time: 0,
	/**
	 * Animation duration, in milliseconds
	 * @type {number}
	 */
	_duration: 0,
	/**
	 * Usually, a HTML Element, properties of which this animation changes
	 * @type {*}
	 */
	_target: null,
	/**
	 * Is it currently running
	 * @type {boolean}
	 */
	_is_running: false,
	/**
	 * Does it run in reversed direction
	 * @type {boolean}
	 */
	_is_reversed: false,
	/**
	 * The settings for this instance
	 * @readonly
	 * @type {_cAnimation}
	 */
	_config: null,

	/**
	 * Transition is a function, which takes current elapsed time (in percent, from 0 to 1) and returns current animation position (also in percent)
	 * @type {_tTransitionCallback}
	 */
	_transition: null,
	/**
	 * Instance global unique identifier
	 * @type {_tGUID}
	 */
	guid: null,

	/**
	 * Constructs the class instance
	 * @param {_cAnimation} config Settings, `this._config`
	 * @param {*} target `this._target`
	 */
	init: function(config, target) {

		this.guid = Lava.guid++;
		if (config.duration) {
			this._duration = config.duration;
		}
		this._target = target;
		this._transition = config.transition || Lava.transitions[config.transition_name || 'linear'];
		this._config = config;

	},

	/**
	 * Called by Cron. Assigned in constructor
	 * @param {number} now The current time (=new Date().getTime())
	 */
	onTimer: function(now) {

		Lava.t("This method is assigned dynamically in constructor");

	},

	/**
	 * Set the animation state to 'not running' and fire the {@link Lava.animation.Abstract#event:complete} event
	 */
	_finish: function() {

		this._is_running = false;
		this._fire('complete');

	},

	/**
	 * Start only if it's not already running
	 * @param [started_time] Optionally, you can pass the time when animation has actually started.
	 *      Otherwise, the current system time will be taken
	 */
	safeStart: function(started_time) {

		if (!this._is_running) {

			this.start(started_time);

		}

	},

	/**
	 * If animation is running forwards - reverse it to backwards direction
	 */
	reverseDirection: function() {

		if (!this._is_reversed) {

			this._mirror();

		}

	},

	/**
	 * If animation is running backwards - reverse it to normal direction
	 */
	resetDirection: function() {

		if (this._is_reversed) {

			this._mirror();

		}

	},

	/**
	 * Reverse animation direction
	 */
	_mirror: function() {

		this._is_reversed = !this._is_reversed;

		if (this._is_running) {

			var now = new Date().getTime(),
				new_end = 2 * now - this._started_time;

			// it's possible in case of script lags. Must not allow negative transition values.
			if (now > this._end_time) {

				this._started_time = this._end_time;
				this._end_time = this._started_time + this._duration;

			} else {

				this._end_time = new_end;
				this._started_time = new_end - this._duration;

			}

			this._afterMirror(now);

		}

	},

	/**
	 * Callback to execute after `_mirror` is done
	 * @param {number} now The current time in milliseconds
	 */
	_afterMirror: function(now) {

	},

	/**
	 * Get `_is_running`
	 * @returns {boolean}
	 */
	isRunning: function() {

		return this._is_running;

	},

	/**
	 * Get `_started_time`
	 * @returns {number}
	 */
	getStartedTime: function() {

		return this._started_time;

	},

	/**
	 * Get `_end_time`
	 * @returns {number}
	 */
	getEndTime: function() {

		return this._end_time;

	},

	/**
	 * Get `_duration`
	 * @returns {number}
	 */
	getDuration: function() {

		return this._duration;

	},

	/**
	 * Get `_is_reversed`
	 * @returns {boolean}
	 */
	isReversed: function() {

		return this._is_reversed;

	},

	/**
	 * Get `_target`
	 * @returns {*}
	 */
	getTarget: function() {

		return this._target;

	},

	/**
	 * Set `_target`
	 * @param target
	 */
	setTarget: function(target) {

		this._target = target;

	}

});