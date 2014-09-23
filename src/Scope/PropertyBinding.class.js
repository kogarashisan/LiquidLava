
/**
 * Value of this PropertyBinding instance has changed
 * @event Lava.scope.PropertyBinding#changed
 */

Lava.define(
'Lava.scope.PropertyBinding',
/**
 * Scope, that is designed to bind to a property of a view
 * @lends Lava.scope.PropertyBinding#
 * @extends Lava.scope.Abstract
 * @implements _iValueContainer
 */
{

	Extends: 'Lava.scope.Abstract',
	/**
	 * This instance supports two-way data binding
	 * @type {boolean}
	 * @const
	 */
	isSetValue: true,
	/**
	 * Global unique identifier of this instance
	 * @type {_tGUID}
	 */
	guid: null,

	/**
	 * View's property name, to which this instance is bound
	 * @type {string}
	 */
	_property_name: null,
	/**
	 * The value of this scope (equals to property value in bound view)
	 * @type {*}
	 */
	_value: null,

	/**
	 * Scope's bound view (also the scope's owner view, which created the instance)
	 * @type {Lava.view.Abstract}
	 */
	_view: null,
	/**
	 * Listener for onPropertyChanged in bound view
	 * @type {_tListener}
	 */
	_property_changed_listener: null,

	/**
	 * PropertyBinding supports "assigns" - one-way binding of widget's property to any {@link Lava.scope.Argument} value
	 * @type {Lava.scope.Argument}
	 */
	_assign_argument: null,

	/**
	 * Create the PropertyBinding instance. Refresh value from view's property or set value from assign
	 * @param {Lava.view.Abstract} view Scope's owner view, to which it's bound
	 * @param {string} property_name
	 * @param {number} level
	 * @param {_cAssign} assign_config Config for the Argument, in case this scope is created in "assign" mode
	 */
	init: function(view, property_name, level, assign_config) {

		this.guid = Lava.guid++;
		this._view = view;
		this._property_name = property_name;
		this.level = level;

		if (assign_config) {

			this._assign_argument = new Lava.scope.Argument(assign_config, view, view.getWidget());

			if (this._assign_argument.isWaitingRefresh()) {
				this._count_dependencies_waiting_refresh++;
				this._waits_refresh = true;
			}
			this._assign_argument.on('waits_refresh', this._onDependencyWaitsRefresh, this);
			this._assign_argument.on('changed', this.onAssignChanged, this);
			this._assign_argument.on('refreshed', this._onDependencyRefreshed, this);

			this._value = this._assign_argument.getValue();
			view.set(this._property_name, this._value);

		} else {

			this._value = view.get(this._property_name);
			this._property_changed_listener = view.onPropertyChanged(property_name, this.onContainerPropertyChanged, this);

		}

		Lava.schema.DEBUG && Lava.ScopeManager.debugTrackScope(this);

	},

	/**
	 * PropertyBinding is always bound to it's view
	 * @returns {boolean} Always returns <kw>true</kw>
	 */
	isConnected: function() {

		return true;

	},

	/**
	 * Value of "assign" argument has changed. Set view's property and schedule refresh
	 */
	onAssignChanged: function() {

		this._view.set(this._property_name, this._assign_argument.getValue());
		this._queueForRefresh();
		this._is_dirty = true;

	},

	/**
	 * View's property has changed. Schedule refresh
	 */
	onContainerPropertyChanged: function() {

		this._queueForRefresh();
		this._is_dirty = true;

	},

	/**
	 * Get `_value`
	 * @returns {*}
	 */
	getValue: function() {

		return this._value;

	},

	/**
	 * Set property value to the bound view
	 * @param {*} value
	 */
	setValue: function(value) {

		Lava.suspendListener(this._property_changed_listener);
		this._view.set(this._property_name, value);
		Lava.resumeListener(this._property_changed_listener);

		this._queueForRefresh();
		this._is_dirty = true;

	},

	_doRefresh: function() {

		var new_value = this._view.get(this._property_name);

		if (new_value !== this._value) {

			this._value = new_value;

			this._fire('changed');

		}

	},

	destroy: function() {

		if (this._assign_argument) {

			this._assign_argument.destroy();

		} else {

			this._view.removePropertyListener(this._property_changed_listener);

		}

		Lava.schema.DEBUG && Lava.ScopeManager.debugStopTracking(this);

		this.Abstract$destroy();

	}

});