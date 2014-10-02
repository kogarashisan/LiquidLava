
Lava.define(
'Lava.animation.Standard',
/**
 * Common JavaScript-driven animation. Uses {@link Lava.Cron}
 * @lends Lava.animation.Standard#
 * @extends Lava.animation.Abstract
 */
{

	Extends: 'Lava.animation.Abstract',

	Shared: '_shared',

	/**
	 * Shared data
	 */
	_shared: {
		// pre-generated variants of this._callAnimators function
		call_animators: [
			function(transition_value) {},
			function(transition_value) {
				this._animators[0].animate(this._target, transition_value);
			},
			function(transition_value) {
				this._animators[0].animate(this._target, transition_value);
				this._animators[1].animate(this._target, transition_value);
			},
			function(transition_value) {
				this._animators[0].animate(this._target, transition_value);
				this._animators[1].animate(this._target, transition_value);
				this._animators[2].animate(this._target, transition_value);
			},
			function(transition_value) {
				this._animators[0].animate(this._target, transition_value);
				this._animators[1].animate(this._target, transition_value);
				this._animators[2].animate(this._target, transition_value);
				this._animators[3].animate(this._target, transition_value);
			}
		]
	},

	/**
	 * Current animation percent, between 0 and 1
	 * @type {number}
	 */
	_percent: 0,

	/**
	 * Animator instances
	 * @type {Array.<_iAnimator>}
	 */
	_animators: [],

	/**
	 * Create the animation instance
	 * @param {_cAnimation} config
	 * @param {*} target
	 */
	init: function(config, target) {

		this.Abstract$init(config, target);

		var i = 0,
			count = 0,
			animator_config;

		if ('animators' in config) {

			count = config.animators.length;

			for (; i < count; i++) {

				animator_config = config.animators[i];
				this._animators.push(new Lava.animator[animator_config.type](animator_config));

			}

		}

		if (this._shared.call_animators.length <= count) {

			this._callAnimators = this._shared.call_animators[count];

		}

		this.onTimer = this._animateDirect;

	},

	/**
	 * Calls all animator instances.
	 * This function may be substituted with pre-generated version from `_shared`
	 *
	 * @param {number} transition_value The current percent of animation
	 */
	_callAnimators: function(transition_value) {

		for (var i = 0, count = this._animators.length; i < count; i++) {

			this._animators[i].animate(this._target, transition_value);

		}

	},

	/**
	 * Perform animation in normal direction
	 * @param {number} now The current global time in milliseconds
	 */
	_animateDirect: function(now) {

		if (now < this._end_time) {

			this._callAnimators(this._transition((now - this._started_time) / this._duration));

		} else {

			this._callAnimators(this._transition(1));
			this._finish();

		}

	},

	/**
	 * Perform animation in reversed direction
	 * @param {number} now The current global time in milliseconds
	 */
	_animateReverse: function(now) {

		if (now < this._end_time) {

			this._callAnimators(this._transition(1 - (now - this._started_time) / this._duration));

		} else {

			this._callAnimators(this._transition(0));
			this._finish();

		}

	},

	/**
	 * Start animating
	 * @param {number} [started_time] The global system time in milliseconds when animation has started.
	 *  May be used to synchronize multiple animations
	 */
	start: function(started_time) {

		var now = new Date().getTime();
		this._started_time = started_time || now;
		this._end_time = this._started_time + this._duration;

		if (now < this._end_time) {

			this._is_running = true;
			Lava.Cron.acceptTask(this);
			this.onTimer(now);

		} else {

			this.onTimer(this._end_time);

		}

	},

	/**
	 * Stop animation immediately where it is. Do not fire {@link Lava.animation.Abstract#event:complete}
	 */
	stop: function() {

		this._is_running = false;

	},

	_mirror: function() {

		this.onTimer = this._is_reversed ? this._animateDirect : this._animateReverse;
		this.Abstract$_mirror();

	},

	/**
	 * Act like the animation has ended naturally:
	 * apply the end state to the target and fire {@link Lava.animation.Abstract#event:complete}
	 */
	finish: function() {

		if (this._is_running) {

			this.onTimer(this._end_time);

		}

	},

	/**
	 * Set animation duration
	 * @param {number} duration New duration, in milliseconds
	 */
	setDuration: function(duration) {

		this._duration = duration;
		this._end_time = this._started_time + duration;

	}

});