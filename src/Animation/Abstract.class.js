
Lava.define(
'Lava.animation.Abstract',
/**
 * @lends Lava.animation.Abstract#
 * @extends Lava.mixin.Observable
 */
{

	Extends: ['Lava.mixin.Observable'],

	_started_time: 0,
	_end_time: 0,
	_duration: 0,
	_target: null,
	_is_running: false,
	_is_reversed: false,
	_config: null,

	_transition: null,
	/**
	 * @type {Lavadoc._tGUID}
	 */
	guid: null,

	/**
	 * @param {_cAnimation} config
	 * @param target
	 */
	init: function(config, target) {

		this.guid = Lava.guid++;
		if (config.duration) {
			this._duration = config.duration;
		}
		this._target = target;
		this._transition = Lava.transitions[config.transition || 'linear'];
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
	 * @param started_time
	 */
	safeStart: function(started_time) {

		if (!this._is_running) {

			this.start(started_time);

		}

	},

	reverseDirection: function() {

		if (!this._is_reversed) {

			this._mirror();

		}

	},

	resetDirection: function() {

		if (this._is_reversed) {

			this._mirror();

		}

	},

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

	_afterMirror: function(now) {

	},

	isRunning: function() {

		return this._is_running;

	},

	getStartedTime: function() {

		return this._started_time;

	},

	getEndTime: function() {

		return this._end_time;

	},

	getDuration: function() {

		return this._duration;

	},

	isReversed: function() {

		return this._is_reversed;

	},

	getTarget: function() {

		return this._target;

	},

	setTarget: function(target) {

		this._target = target;

	}

});