
Lava.define(
'Lava.mixin.Refreshable',
/**
 * Auxiliary class for the scope refresh system. Allows to build hierarchy of dependent scopes
 * @lends Lava.mixin.Refreshable#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',
	/**
	 * Tell other classes that this instance is inherited from Refreshable
	 * @type {boolean}
	 * @readonly
	 */
	isRefreshable: true,
	/**
	 * Indicates the priority of this scope in the hierarchy. Scopes with lower priority are refreshed first
	 * @type {number}
	 * @readonly
	 */
	level: 0,

	/**
	 * The object, which is given by {@link Lava.ScopeManager} when the scope is added into the refresh queue
	 * @type {Object}
	 */
	_refresh_ticket: null,

	/**
	 * Each time the scope is refreshed - it's assigned the id of the current refresh loop
	 * @type {number}
	 */
	_last_refresh_id: 0,
	/**
	 * How many times this scope was refreshed during current refresh loop
	 * @type {number}
	 */
	_refresh_cycle_count: 0,
	/**
	 * Scope's value
	 * @type {*}
	 */
	_value: null,

	/**
	 * Called by {@link Lava.ScopeManager} during refresh loop. You should not call this method directly.
	 * Warning: violates code style with multiple return statements.
	 *
	 * @param {number} refresh_id The id of current refresh loop
	 * @param {boolean} [is_safe] Internal switch used to control infinite refresh loop exceptions
	 * @returns {boolean} <kw>true</kw> in case of infinite loop, and <kw>false</kw> in case of normal refresh
	 */
	refresh: function(refresh_id, is_safe) {

		// first, refresh ticket must be cleared, cause otherwise scope may stay dirty forever
		this._refresh_ticket = null;

		if (this._last_refresh_id == refresh_id) {

			this._refresh_cycle_count++;
			if (this._refresh_cycle_count > Lava.schema.system.REFRESH_INFINITE_LOOP_THRESHOLD && !is_safe) {

				return true; // infinite loop exception

			}

		} else {

			this._last_refresh_id = refresh_id;
			this._refresh_cycle_count = 0;

		}

		this._doRefresh();
		return false;

	},

	/**
	 * Must be overridden in classes that implement Refreshable to perform the actual refresh logic
	 */
	_doRefresh: function() {

		// may be overridden in inherited classes

	},

	/**
	 * Ensure that this scope will participate in the next refresh cycle
	 */
	_queueForRefresh: function() {

		if (!this._refresh_ticket) {

			this._refresh_ticket = Lava.ScopeManager.scheduleScopeRefresh(this, this.level);

		}

	},

	/**
	 * Internal debug assertion, called to verify that the scope does not need to be refreshed
	 */
	debugAssertClean: function() {

		if (this._refresh_ticket) Lava.t("Refreshable::debugAssertClean() failed");

	},

	/**
	 * Will the scope be refreshed in the next refresh cycle
	 * @returns {boolean} <kw>true</kw>, if scope is in refresh queue, and <kw>false</kw> otherwise
	 */
	isWaitingRefresh: function() {

		return !!this._refresh_ticket;

	},

	/**
	 * Cancel the current refresh ticket and ignore next refresh cycle. Does not destroy the Refreshable instance
	 */
	suspendRefreshable: function() {

		if (this._refresh_ticket) {
			Lava.ScopeManager.cancelScopeRefresh(this._refresh_ticket, this.level);
			this._refresh_ticket = null;
		}

	}

});