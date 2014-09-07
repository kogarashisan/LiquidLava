
Lava.Cron = {

	DEFAULT_TIMER_DELAY: 20, // up to 50 fps

	timer: null,
	is_running: false,
	_active_tasks: [],

	timeout_callback: function() {

		var self = Lava.Cron;
		self.onTimer();
		if (!self.is_running) {
			clearInterval(self.timer);
			self.timer = null;
		}

	},

	animation_frame_callback: function() {
		var self = Lava.Cron;
		self.onTimer();
		if (self.is_running) Firestorm.Environment.requestAnimationFrame(self.animation_frame_callback);

	},

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

	_enable: function() {

		this._enable = (Firestorm.Environment.requestAnimationFrame && Lava.schema.system.ALLOW_REQUEST_ANIMATION_FRAME)
			? function() { Firestorm.Environment.requestAnimationFrame(this.animation_frame_callback); }
			: function() { this.timer = window.setInterval(this.timeout_callback, this.DEFAULT_TIMER_DELAY); };

		this._enable();

	},

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