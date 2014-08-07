
Lava.define(
'Lava.mixin.Refreshable',
/**
 * @lends Lava.mixin.Refreshable#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',
	level: 0,
	_requeue: false,

	_count_dependencies_waiting_refresh: 0,
	_waits_refresh: false,
	_refresh_ticket: null,

	_last_refresh_id: 0,
	_refresh_cycle_count: 0,

	_is_dirty: false,

	/**
	 * Called by view manager during refresh loop.
	 * @param refresh_id
	 * @param is_safe
	 * @returns {boolean} true in case of infinite loop
	 */
	doRefresh: function(refresh_id, is_safe) {

		if (Lava.schema.DEBUG && this._count_dependencies_waiting_refresh) Lava.t();
		if (Lava.schema.DEBUG && !this._waits_refresh && this._refresh_ticket) Lava.t();

		if (this._waits_refresh) { // to counter exceptions

			// note: the order of the following operations is important
			if (this._last_refresh_id == refresh_id) {

				if (Lava.schema.DEBUG) Lava.logError('Scope was refreshed more than once during one refresh loop');

				this._refresh_cycle_count++;
				if (this._refresh_cycle_count == Lava.schema.REFRESH_INFINITE_LOOP_THRESHOLD && !is_safe) {

					return true; // infinite loop exception

				}

			} else {

				this._last_refresh_id = refresh_id;
				this._refresh_cycle_count = 0;

			}

			this._waits_refresh = false;
			this._refresh_ticket = null;

			if (this._is_dirty) {

				this._is_dirty = false;

				this._doRefresh();

			}

			this._fire('refreshed');

		}

		return false;

	},

	_onDependencyWaitsRefresh: function() {

		this._count_dependencies_waiting_refresh++;

		if (this._waits_refresh) {

			if (this._refresh_ticket) {
				Lava.ScopeManager.cancelScopeRefresh(this._refresh_ticket, this.level);
				this._refresh_ticket = null;
			}

		} else {

			if (Lava.schema.DEBUG && this._refresh_ticket) Lava.t();

			this._waits_refresh = true;
			this._fire('waits_refresh');

		}

	},

	_onDependencyRefreshed: function() {

		if (Lava.schema.DEBUG && !this._waits_refresh) Lava.t();
		if (Lava.schema.DEBUG && this._refresh_ticket) Lava.t();

		this._count_dependencies_waiting_refresh--;

		if (this._count_dependencies_waiting_refresh == 0) {

			if (this._requeue) {

				if (Lava.schema.DEBUG && this._refresh_ticket) Lava.t();

				this._refresh_ticket = Lava.ScopeManager.scheduleScopeRefresh(this, this.level);

			} else {

				this._waits_refresh = false;

				if (this._is_dirty) {

					this._is_dirty = false;

					this._doRefresh();

				}

				this._fire('refreshed');

			}

		}

	},

	_doRefresh: function() {

		// may be overridden in inherited classes

	},

	_queueForRefresh: function() {

		if (!this._waits_refresh) {

			if (Lava.schema.DEBUG && this._refresh_ticket) Lava.t();

			this._waits_refresh = true;
			this._refresh_ticket = Lava.ScopeManager.scheduleScopeRefresh(this, this.level);
			this._fire('waits_refresh');

		}

	},

	debugAssertClean: function() {

		if (this._waits_refresh || this._refresh_ticket || this._is_dirty) Lava.t("Refreshable::debugAssertClean() failed");

	},

	isWaitingRefresh: function() {

		return this._waits_refresh;

	},

	suspendRefreshable: function() {

		if (this._refresh_ticket) {
			Lava.ScopeManager.cancelScopeRefresh(this._refresh_ticket, this.level);
			this._refresh_ticket = null;
		}

		this._waits_refresh = false;
		this._count_dependencies_waiting_refresh = 0;
		this._is_dirty = true;

	}

});