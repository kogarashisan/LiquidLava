
Lava.Cron = {

	DEFAULT_TIMER_DELAY: 20, // up to 50 fps

	_timer: null,
	_active_tasks: [],

	timeout_callback: function() {

		Lava.Cron.onTimer();

	},

	acceptTask: function(task) {

		if (this._active_tasks.indexOf(task) == -1) {

			this._active_tasks.push(task);

		}

		this._enable();

	},

	_enable: function() {

		if (this._timer == null) {

			this._timer = window.setInterval(this.timeout_callback, this.DEFAULT_TIMER_DELAY);

		}

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

			clearInterval(this._timer);
			this._timer = null;

		}

		this._active_tasks = active_tasks;

	}

};