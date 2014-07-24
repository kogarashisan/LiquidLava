Lava.define(
'Lava.scope.DataBinding',
/**
 * @lends Lava.scope.DataBinding#
 * @extends Lava.scope.Abstract
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
	 * @type {_iValueContainer}
	 */
	_value_container: null,
	_container_waits_refresh_listener: null,
	_container_changed_listener: null,
	_container_refreshed_listener: null,

	_property_changed_listener: null,
	_enumerable_changed_listener: null,
	_property_container: null,

	_is_connected: false,

	/**
	 * @param {_iValueContainer} value_container
	 * @param {string} property_name
	 * @param {number} level
	 */
	init: function(value_container, property_name, level) {

		this.guid = Lava.guid++;
		this._value_container = value_container;
		this._property_name = property_name;
		this.level = level;

		if (value_container.isWaitingRefresh()) {
			this._count_dependencies_waiting_refresh++;
			this._waits_refresh = true;
		}
		this._container_waits_refresh_listener = value_container.on('waits_refresh', this._onDependencyWaitsRefresh, this);
		this._container_changed_listener = value_container.on('changed', this.onParentDataSourceChanged, this);
		this._container_refreshed_listener = value_container.on('refreshed', this._onDependencyRefreshed, this);

		this._refreshValue();

		Lava.schema.DEBUG && Lava.ScopeManager.debugTrackScope(this);

	},

	_refreshValue: function() {

		var property_container = this._value_container.getValue(),
			value = null,
			is_connected = false;

		if (property_container != null) {

			if (property_container.isEnumerable && /^\d+$/.test(this._property_name)) {

				if (this._enumerable_changed_listener == null) {

					this._enumerable_changed_listener = property_container.on('collection_changed', this.onValueChanged, this);
					this._property_container = property_container;

				}

				value = property_container.getValueAt(+this._property_name);

			} else if (property_container.isProperties) {

				if (this._property_changed_listener == null) {

					this._property_changed_listener = property_container.onPropertyChanged(this._property_name, this.onValueChanged, this);
					this._property_container = property_container;

				}

				value = property_container.get(this._property_name);

			} else {

				value = property_container[this._property_name];

			}

			is_connected = true;

		}

		if (value !== this._value || this._is_connected != is_connected) {

			this._value = value;
			this._is_connected = is_connected;

			this._fire('changed');

		}

	},

	isConnected: function() {

		return this._is_connected;

	},

	onParentDataSourceChanged: function() {

		if (this._property_changed_listener && (this._value_container.getValue() != this._property_container)) {

			// currently listening to the parent's old data source
			this._property_changed_listener && this._property_container.removePropertyListener(this._property_changed_listener);
			this._enumerable_changed_listener && this._property_container.removeListener(this._enumerable_changed_listener);
			this._property_changed_listener = null;
			this._enumerable_changed_listener = null;
			this._property_container = null;

		}

		this._queueForRefresh();

		this._is_dirty = true;

	},

	_doRefresh: function() {

		this._refreshValue();

	},

	onValueChanged: function() {

		this._queueForRefresh();
		this._is_dirty = true;

	},

	/**
	 * @param {*} value
	 */
	setValue: function(value) {

		var property_container = this._value_container.getValue();

		if (property_container) {

			if (this._property_changed_listener) {

				Lava.suspendListener(this._property_changed_listener);
				property_container.set(this._property_name, value);
				Lava.resumeListener(this._property_changed_listener);

			} else if (this._enumerable_changed_listener) {

				Lava.suspendListener(this._enumerable_changed_listener);
				property_container.replaceAt(+this._property_name, value);
				Lava.resumeListener(this._enumerable_changed_listener);

			} else if (property_container.isProperties) {

				property_container.set(this._property_name, value);

			} else {

				property_container[this._property_name] = value;

			}

			this._queueForRefresh();
			this._is_dirty = true;

		}

	},

	getValue: function() {

		return this._value;

	},

	destroy: function() {

		this._value_container.removeListener(this._container_waits_refresh_listener);
		this._value_container.removeListener(this._container_changed_listener);
		this._value_container.removeListener(this._container_refreshed_listener);

		this._property_changed_listener && this._property_container.removePropertyListener(this._property_changed_listener);
		this._enumerable_changed_listener && this._property_container.removeListener(this._enumerable_changed_listener);
		this._property_container = null;

		Lava.schema.DEBUG && Lava.ScopeManager.debugStopTracking(this);
		this.Abstract$destroy();

	}

});