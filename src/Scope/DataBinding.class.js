
/**
 * Value of this DataBinding instance has changed
 * @event Lava.scope.DataBinding#changed
 */

Lava.define(
'Lava.scope.DataBinding',
/**
 * Binding to a property of a JavaScript object with special support for {@link Lava.mixin.Properties}
 * and {@link Lava.system.Enumerable} instances
 *
 * @lends Lava.scope.DataBinding#
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
	 * The name of property to which this scope is bound
	 * @type {string}
	 */
	_property_name: null,
	/**
	 * Current value of this instance (equals to property value in data source)
	 * @type {*}
	 */
	_value: null,

	/**
	 * Scope, that provides data source for this instance
	 * @type {_iValueContainer}
	 */
	_value_container: null,
	/**
	 * Listener for "changed" event in `_value_container`
	 * @type {_tListener}
	 */
	_container_changed_listener: null,

	/**
	 * Listener for onPropertyChanged in data source of this scope (if data source is instance of {@link Lava.mixin.Properties})
	 * @type {_tListener}
	 */
	_property_changed_listener: null,
	/**
	 * Listener for {@link Lava.system.Enumerable#event:collection_changed} in data source of this scope
	 * (if data source is instance of {@link Lava.system.Enumerable})
	 * @type {_tListener}
	 */
	_enumerable_changed_listener: null,
	/**
	 * Data source for this scope, from which this scope gets it's value. Also, value of the `_value_container`
	 * @type {*}
	 */
	_property_container: null,

	/**
	 * Is `_property_container` an existing object, or this scope is not bound to an existing value
	 * @type {boolean}
	 */
	_is_connected: false,

	/**
	 * Create DataBinding instance
	 * @param {_iValueContainer} value_container The scope, which provides the data source for this instance
	 * @param {string} property_name
	 */
	init: function(value_container, property_name) {

		this.guid = Lava.guid++;
		this._value_container = value_container;
		this._property_name = property_name;
		this.level = value_container.level + 1;
		this._container_changed_listener = value_container.on('changed', this.onParentDataSourceChanged, this);
		this._refreshValue();

		Lava.schema.DEBUG && Lava.ScopeManager.debugTrackScope(this);

	},

	/**
	 * Get `_property_container` from `_value_container`, and get `_property_name` from `_property_container`
	 */
	_refreshValue: function() {

		var property_container = this._value_container.getValue(),
			value = null,
			is_connected = false;

		if (property_container != null) {

			// Collection implements Properties, so if _property_name is not a number - then `get` will be called
			if (property_container.isCollection && /^\d+$/.test(this._property_name)) {

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

	/**
	 * Get `_is_connected`
	 * @returns {boolean}
	 */
	isConnected: function() {

		return this._is_connected;

	},

	/**
	 * Data source for this instance has changed. Remove listeners to old data source and schedule refresh
	 */
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

	},

	_doRefresh: function() {

		this._refreshValue();

	},

	/**
	 * Data source remains the same, but it's property has changed (property we are currently bound to)
	 */
	onValueChanged: function() {

		this._queueForRefresh();

	},

	/**
	 * If this instance is bound to existing object - set object's property value
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

		}

	},

	getValue: function() {

		return this._value;

	},

	destroy: function() {

		this._value_container.removeListener(this._container_changed_listener);

		this._property_changed_listener && this._property_container.removePropertyListener(this._property_changed_listener);
		this._enumerable_changed_listener && this._property_container.removeListener(this._enumerable_changed_listener);
		this._property_container = null;

		Lava.schema.DEBUG && Lava.ScopeManager.debugStopTracking(this);
		this.Abstract$destroy();

	}

});