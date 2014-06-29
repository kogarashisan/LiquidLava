
Lava.define(
'Lava.scope.PropertyBinding',
/**
 * @lends Lava.scope.PropertyBinding#
 * @extends Lava.mixin.Refreshable
 * @implements _iValueContainer
 */
{

	Extends: 'Lava.scope.Abstract',
	isSetValue: true,
	guid: null,

	/**
	 * @type {string}
	 */
	_property_name: null,
	_value: null,

	/**
	 * @type {Lava.view.Abstract}
	 */
	_view: null,
	_property_changed_listener: null,

	_assign_argument: null,

	/**
	 * @param {Lava.view.Abstract} view
	 * @param {string} property_name
	 * @param {number} level
	 * @param {_cAssign} assign_config
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

	isConnected: function() {

		return true; // property binding is always connected to it's widget

	},

	onAssignChanged: function() {

		this._view.set(this._property_name, this._assign_argument.getValue());
		this._queueForRefresh();
		this._is_dirty = true;

	},

	onContainerPropertyChanged: function() {

		this._queueForRefresh();
		this._is_dirty = true;

	},

	getValue: function() {

		return this._value;

	},

	/**
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