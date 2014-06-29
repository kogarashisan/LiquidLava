
Lava.define(
'Lava.animation.Emulated',
/**
 * @lends Lava.animation.Emulated#
 * @extends Lava.animation.Abstract
 */
{

	Extends: 'Lava.animation.Abstract',

	isEmulatedAnimation: true,

	_timeout: 0,

	init: function(config, target) {

		this.Abstract$init(config, target);

		var self = this;
		this.onTimer = function() {
			self._onTimeout();
		}

	},

	_onTimeout: function() {

		this._timeout = null;
		this._end();
		this._finish();

	},

	_end: function() {

	},

	_cancelTimeout: function() {
		if (this._timeout) {
			window.clearTimeout(this._timeout);
			this._timeout = null;
		}
	},

	start: function() {

		if (this._is_running) {
			this.stop();
		}

		this._is_running = true;
		this._start();
		this._timeout = window.setTimeout(this.onTimer, this._duration);

	},

	_start: function() {

	},

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
	 * Reverse the animation while it's still running
	 */
	_reverse: function() {

	},

	finish: function() {

		if (this._is_running) {
			this._cancelTimeout();
			this._onTimeout();
		}

	},

	_assertStopped: function() {

		if (this._is_running) {

			if (Lava.schema.DEBUG) {

				Lava.t("Emulated animation: call to state changing function while the animation is running");

			} else {

				Lava.logError("Emulated animation: call to state changing function while the animation is running");

			}

		}

	}

});