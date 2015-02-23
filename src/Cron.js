/**
 * Controls animations
 */
Lava.Cron = {

	/**
	 * Minimum delay between animation frames
	 * @type {number}
	 * @const
	 */
	DEFAULT_TIMER_DELAY: 20, // up to 50 fps

	/**
	 * window.setInterval reference
	 * @readonly
	 */
	_timer: null,
	/**
	 * Is animation currently running
	 * @type {boolean}
	 * @readonly
	 */
	is_running: false,
	/**
	 * Active animations
	 * @type {Array.<Lava.animation.Abstract>}
	 */
	_active_tasks: [],

	/**
	 * Initialize Lava.Cron object
	 */
	init: function() {

		this._enable = (Firestorm.Environment.requestAnimationFrame && Lava.schema.system.ALLOW_REQUEST_ANIMATION_FRAME)
			? this._enable_AnimationFrame
			: this._enable_Interval;

	},

	/**
	 * Callback for window.setInterval()
	 */
	timeout_callback: function() {

		var self = Lava.Cron;
		self.onTimer();
		if (!self.is_running) {
			clearInterval(self._timer);
			self._timer = null;
		}

	},

	/**
	 * Callback for requestAnimationFrame()
	 */
	animation_frame_callback: function() {

		var self = Lava.Cron;
		self.onTimer();
		if (self.is_running) Firestorm.Environment.requestAnimationFrame(self.animation_frame_callback);

	},

	/**
	 * Start animating
	 * @param {Lava.animation.Abstract} task
	 */
	acceptTask: function(task) {

		if (this._active_tasks.indexOf(task) == -1) {

			this._active_tasks.push(task);

		}

		this._enable();

		if (!this.is_running) {
			this._enable();
			this.is_running = true;
		}

	},

	/**
	 * Create a timer, which executes a callback at nearly equal intervals
	 */
	_enable: function() {

		Lava.t("Framework requires initialization");

	},

	/**
	 * Version of `_enable`, which uses requestAnimationFrame
	 */
	_enable_AnimationFrame: function() {

		Firestorm.Environment.requestAnimationFrame(this.animation_frame_callback);

	},

	/**
	 * Version of `_enable`, which uses setInterval
	 */
	_enable_Interval: function() {

		this._timer = window.setInterval(this.timeout_callback, this.DEFAULT_TIMER_DELAY);

	},

	/**
	 * Call {@link Lava.animation.Abstract#onTimer} of all animations
	 */
	onTimer: function() {

		var time = new Date().getTime(),
			i = 0,
			count = this._active_tasks.length,
			task,
			active_tasks = [];

		for (; i < count; i++) {

			task = this._active_tasks[i];

			if (task.isRunning()) {
				task.onTimer(time);
				// note: at this moment task may be already off, but it's not checked - to save processor resources.
				active_tasks.push(task);
			}

		}

		if (!active_tasks.length) {

			this.is_running = false;

		}

		this._active_tasks = active_tasks;

	}

};