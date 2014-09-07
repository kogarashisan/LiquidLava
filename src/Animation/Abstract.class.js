
Lava.define(
'Lava.animation.Abstract',
/**
 * @lends Lava.animation.Abstract#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',

	/**
	 * @type {number}
	 */
	_started_time: 0,
	/**
	 * @type {number}
	 */
	_end_time: 0,
	/**
	 * @type {number}
	 */
	_duration: 0,
	/**
	 * @type {*}
	 */
	_target: null,
	/**
	 * @type {boolean}
	 */
	_is_running: false,
	/**
	 * @type {boolean}
	 */
	_is_reversed: false,
	/**
	 * @type {_cAnimation}
	 */
	_config: null,

	/**
	 * @type {_tTransitionCallback}
	 */
	_transition: null,
	/**
	 * @type {_tGUID}
	 */
	guid: null,

	/**
	 * @param {_cAnimation} config
	 * @param {*} target
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
	 * Called by Cron. Assigned in constructor.
	 * @param {number} now The current time (=new Date().getTime())
	 */
	onTimer: function(now) {

		Lava.t("This method is assigned dynamically in constructor");

	},

	_start: function(now) {

	},

	_finish: function() {

		this._is_running = false;
		this._fire('complete');

	},

	/**
	 * Start only if it's not already running
	 * @param [started_time]
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
	 * The actual reversing algorithm
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