/**
 * Performs scope refresh
 */
Lava.ScopeManager = {

	/**
	 * There is a separate queue for each scope level
	 * @type {Array.<Array.<Lava.mixin.Refreshable>>}
	 */
	_scope_refresh_queues: [],
	/**
	 * Minimal index in `_scope_refresh_queues`
	 * @type {number}
	 */
	_min_scope_refresh_level: 0,
	/**
	 * Scopes are updated from lower to higher level, from first index in array to last.
	 * Update cycle may jump to lower level, if a scope is added there during the update cycle.
	 * For each scope level this array stores the number of already updated scopes on that level
	 * @type {Array.<number>}
	 */
	_scope_refresh_current_indices: [],

	/**
	 * User-accessible statistics with critical data
	 * @type {Object}
	 */
	statistics: {
		/**
		 * Each refresh loop has smaller cycles
		 * @type {number}
		 */
		max_refresh_cycles: 0,
		/**
		 * Number of times, when circular dependencies in scope tree has been encountered
		 * @type {number}
		 */
		count_dead_loop_exceptions: 0
	},

	/**
	 * Each refresh loop generates a new id
	 * @type {number}
	 */
	_refresh_id: 0,
	/**
	 * Sign of circular dependency for current loop
	 * @type {boolean}
	 */
	_has_exceptions: false,
	/**
	 * Sign of circular dependency for previous loop
	 * @type {boolean}
	 */
	_has_infinite_loop: false,
	/**
	 * Is refresh loop in progress
	 * @type {boolean}
	 */
	_is_refreshing: false,
	/**
	 * How many locks does it have, see the `lock()` method
	 * @type {number}
	 */
	_lock_count: 0,

	/**
	 * Initialize global ScopeManager object
	 */
	init: function() {

		this.scheduleScopeRefresh = this._scheduleScopeRefresh_Initial;

	},

	/**
	 * Queue a scope for update or refresh it immediately, depending on current ScopeManager state
	 * @param {Lava.mixin.Refreshable} target
	 * @param {number} level
	 * @returns {{index: number}} Refresh ticket
	 */
	scheduleScopeRefresh: function(target, level) {

		Lava.t("Framework requires initialization");

	},

    /**
     * Version to handle the first dirty scope in a refresh cycle.
     * Schedules refresh in view_manager.
     * @param {Lava.mixin.Refreshable} target
     * @param {number} level
     * @returns {{index: number}}
     */
    _scheduleScopeRefresh_Initial: function(target, level) {

        Lava.view_manager.scheduleRefresh();
        this.scheduleScopeRefresh = this._scheduleScopeRefresh_Normal;
	    return this._scheduleScopeRefresh_Normal(target, level);

    },

	/**
	 * Normal version outside of view refresh cycle - adds scope into refresh queue.
	 * @param {Lava.mixin.Refreshable} target
	 * @param {number} level
	 * @returns {{index: number}}
	 */
    _scheduleScopeRefresh_Normal: function(target, level) {

		if (!this._scope_refresh_queues[level]) {

			if (this._min_scope_refresh_level > level) {

				this._min_scope_refresh_level = level;

			}

			this._scope_refresh_queues[level] = [];

		}

		// It absolutely must be an object, but it has no methods for performance reasons - to stay as light as possible
		return {
			index: this._scope_refresh_queues[level].push(target) - 1
		}

	},

	/**
	 * Inside the refresh cycle - refreshes scope immediately
	 * @param {Lava.mixin.Refreshable} target
	 */
	_scheduleScopeRefresh_Locked: function(target) {

		if (target.refresh(this._refresh_id)) {
			Lava.logError('Scope Manager: infinite loop exception outside of normal refresh cycle');
		}

		return null;

	},

	/**
	 * Swap `scheduleScopeRefresh` algorithm to `_scheduleScopeRefresh_Locked`
	 */
	lock: function() {

		if (Lava.schema.DEBUG && this._is_refreshing) Lava.t();
		this.scheduleScopeRefresh = this._scheduleScopeRefresh_Locked;
		this._lock_count++;

	},

	/**
	 * Swap `scheduleScopeRefresh` algorithm to `_scheduleScopeRefresh_Initial`
	 */
	unlock: function() {

		if (this._lock_count == 0) Lava.t();
		this._lock_count--;
		if (this._lock_count == 0) {
			this.scheduleScopeRefresh = this._scheduleScopeRefresh_Initial;
		}

	},

	/**
	 * Remove a scope from update queue
	 * @param {{index: number}} refresh_ticket
	 * @param {number} level
	 */
	cancelScopeRefresh: function(refresh_ticket, level) {

		if (Lava.schema.DEBUG && refresh_ticket == null) Lava.t();
		this._scope_refresh_queues[level][refresh_ticket.index] = null;

	},

	/**
	 * Get `_has_infinite_loop`
	 * @returns {boolean}
	 */
	hasInfiniteLoop: function() {

		return this._has_infinite_loop;

	},

	/**
	 * The main refresh loop
	 */
	refresh: function() {

		if (this._is_refreshing) {
			Lava.logError("ScopeManager: recursive call to ScopeManager#refresh()");
			return;
		}

		var count_refresh_cycles = 0,
			count_levels = this._scope_refresh_queues.length;

		if (count_levels == 0) {

			return;

		}

		this._is_refreshing = true;

		this._has_exceptions = false;
		this._refresh_id++;

		// find the first existent queue
		while (this._min_scope_refresh_level < count_levels) {

			if (this._min_scope_refresh_level in this._scope_refresh_queues) {

				break;

			}

			this._min_scope_refresh_level++;

		}

		if (this._min_scope_refresh_level < count_levels) {

			while (this._scopeRefreshCycle()) {

				count_refresh_cycles++;

			}

		}

		this._scopeMalfunctionCycle();

		if (this._has_exceptions) {

			this._scope_refresh_queues = this._preserveScopeRefreshQueues();

		} else {

			Lava.schema.DEBUG_SCOPES && this.debugVerify();
			this._scope_refresh_queues = [];

		}

		this._scope_refresh_current_indices = [];

		if (this.statistics.max_refresh_cycles < count_refresh_cycles) {

			this.statistics.max_refresh_cycles = count_refresh_cycles;

		}

		this._has_infinite_loop = this._has_exceptions;

		this._is_refreshing = false;

        this.scheduleScopeRefresh = this._scheduleScopeRefresh_Initial;

	},

	/**
	 * One refresh cycle in the refresh loop.
	 * Warning: violates codestyle with multiple return statements
	 * @returns {boolean} <kw>true</kw> if another cycle is needed, <kw>false</kw> when done and queue is clean
	 */
	_scopeRefreshCycle: function() {

		var current_level = this._min_scope_refresh_level,
			current_level_queue = this._scope_refresh_queues[current_level],
			queue_length = current_level_queue.length,
			count_levels,
			i = 0; // 'i' is a copy of current index, for optimizations

		if (current_level in this._scope_refresh_current_indices) {

			i = this._scope_refresh_current_indices[current_level];

		} else {

			this._scope_refresh_current_indices[current_level] = 0;

		}

		do {

			while (i < queue_length) {

				if (current_level_queue[i]) {

					if (current_level_queue[i].refresh(this._refresh_id)) {

						this._has_exceptions = true;
						this.statistics.count_dead_loop_exceptions++;
						Lava.logError('Scope Manager: infinite loop exception, interrupting');
						return false;

					}

				}

				i++;
				this._scope_refresh_current_indices[current_level] = i;

				// during the refresh cycle, additional scopes may be added to the queue, sometimes from lower levels
				if (this._min_scope_refresh_level < current_level) {

					return true;

				}

			}

			queue_length = current_level_queue.length;

		} while (i < queue_length);

		this._scope_refresh_queues[current_level] = null;
		this._scope_refresh_current_indices[current_level] = 0;

		count_levels = this._scope_refresh_queues.length;

		do {

			this._min_scope_refresh_level++;

			if (this._scope_refresh_queues[this._min_scope_refresh_level]) {

				return true;

			}

		} while (this._min_scope_refresh_level < count_levels);

		return false;

	},

	/**
	 * A refresh cycle that is launched in case of circular scope dependency
	 * It will refresh all dirty scopes one time
	 */
	_scopeMalfunctionCycle: function() {

		var current_level = this._min_scope_refresh_level,
			count_levels = this._scope_refresh_queues.length,
			current_queue,
			i,
			count;

		for (;current_level < count_levels; current_level++) {

			if (current_level in this._scope_refresh_queues) {

				current_queue = this._scope_refresh_queues[current_level];
				count = current_queue.length;

				if (current_level in this._scope_refresh_current_indices) {

					i = this._scope_refresh_current_indices[current_level];

				} else {

					this._scope_refresh_current_indices[current_level] = 0;
					i = 0;

				}

				while (i < count) {

					if (current_queue[i]) {

						current_queue[i].refresh(this._refresh_id, true);

					}

					i++;
					this._scope_refresh_current_indices[current_level] = i;

				}

			}

		}

	},

	/**
	 * Launched in case of infinite loop exception:
	 * all existing tickets must be preserved for the next refresh cycle, otherwise the system will be broken
	 * @returns {Array}
	 */
	_preserveScopeRefreshQueues: function() {

		var new_refresh_queues = [],
			current_level = this._min_scope_refresh_level,
			count_levels = this._scope_refresh_queues.length,
			current_queue,
			i,
			count,
			new_level_queue,
			ticket;

		for (;current_level < count_levels; current_level++) {

			if (current_level in this._scope_refresh_queues) {

				current_queue = this._scope_refresh_queues[current_level];
				i = this._scope_refresh_current_indices[current_level] || 0;
				count = current_queue.length;
				new_level_queue = [];

				for (; i < count; i++) {

					if (current_queue[i]) {

						ticket = current_queue[i];
						ticket.index = new_level_queue.push(ticket) - 1;

					}

				}

				new_refresh_queues[current_level] = new_level_queue;

			}

		}

		return new_refresh_queues;

	},

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Debug-mode validations

	/**
	 * An array of all scopes in the framework, for debug purpose only
	 * @type {Array.<Lava.mixin.Refreshable>}
	 */
	_debug_all_scopes: [],

	/**
	 * Add a scope to `_debug_all_scopes`
	 * @param {Lava.mixin.Refreshable} scope
	 */
	debugTrackScope: function(scope) {

		this._debug_all_scopes.push(scope);

	},

	/**
	 * Remove a scope from `_debug_all_scopes`
	 * @param {Lava.mixin.Refreshable} scope
	 */
	debugStopTracking: function(scope) {

		var index = this._debug_all_scopes.indexOf(scope);
		if (index == -1) Lava.t();
		this._debug_all_scopes.splice(index, 1);

	},

	/**
	 * LiquidLava alpha: debug verification that scope refresh cycle works as expected
	 */
	debugVerify: function() {

		try {

			for (var i = 0, count = this._debug_all_scopes.length; i < count; i++) {
				this._debug_all_scopes[i].debugAssertClean();
			}

		} catch (e) {

			Lava.logException(e);

		}

	}

	// end: debug-mode validations
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

};