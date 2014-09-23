
/**
 * Value of this Segment instance has changed
 * @event Lava.scope.Segment#changed
 */

Lava.define(
'Lava.scope.Segment',
/**
 * Scope, that can change name of it's bound property dynamically
 * @lends Lava.scope.Segment#
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
	 * Either view or a scope with `getDataBinding()` - will be used to construct `_data_binding`
	 * @type {(Lava.view.Abstract|Lava.scope.Abstract)}
	 */
	_container: null,

	/**
	 * The scope, which provides the name of the property for the Segment
	 * @type {(Lava.scope.PropertyBinding|Lava.scope.DataBinding)}
	 */
	_name_source_container: null,
	/**
	 * Listener for {Lava.mixin.Refreshable#event:waits_refresh} in `_name_source_container`
	 * @type {_tListener}
	 */
	_name_source_waits_refresh_listener: null,
	/**
	 * Listener for "changed" event in `_name_source_container`
	 * @type {_tListener}
	 */
	_name_source_changed_listener: null,
	/**
	 * Listener for {Lava.mixin.Refreshable#event:refreshed} in `_name_source_container`
	 * @type {_tListener}
	 */
	_name_source_refreshed_listener: null,

	/**
	 * The name of the property, which this Segment is bound to
	 * @type {string}
	 */
	_property_name: null,
	/**
	 * Scope, which is bound to the `_property_name`. Serves as source of value for the Segment
	 * @type {(Lava.scope.DataBinding|Lava.scope.PropertyBinding)}
	 */
	_data_binding: null,
	/**
	 * Listener for "changed" event in `_data_binding`
	 * @type {_tListener}
	 */
	_data_binding_changed_listener: null,

	/**
	 * Segment's current value
	 * @type {*}
	 */
	_value: null,

	/**
	 * Create Segment instance. Refresh `_property_name`, `_data_binding` and get value
	 * @param {(Lava.view.Abstract|Lava.scope.Abstract)} container
	 * @param {(Lava.scope.PropertyBinding|Lava.scope.DataBinding)} name_source_container
	 * @param {number} level
	 */
	init: function(container, name_source_container, level) {

		if (Lava.schema.DEBUG && !name_source_container.isValueContainer) Lava.t();
		if (Lava.schema.DEBUG && !name_source_container.guid) Lava.t("Name source for segments must be either PropertyBinding or DataBinding");

		this._container = container;
		this._property_name = name_source_container.getValue();

		this._refreshDataBinding();

		if (name_source_container.isWaitingRefresh()) {
			this._count_dependencies_waiting_refresh++;
			this._waits_refresh = true;
		}
		this._name_source_container = name_source_container;
		this._name_source_waits_refresh_listener = name_source_container.on('waits_refresh', this._onDependencyWaitsRefresh, this);
		this._name_source_changed_listener = name_source_container.on('changed', this.onPropertyNameChanged, this);
		this._name_source_refreshed_listener = name_source_container.on('refreshed', this._onDependencyRefreshed, this);

		this.level = level > name_source_container.level ? level : name_source_container.level;
		this._requeue = true;
		this._value = this._data_binding.getValue();

		Lava.schema.DEBUG && Lava.ScopeManager.debugTrackScope(this);

	},

	/**
	 * Return true, if the Segment is bound to existing object
	 * @returns {boolean}
	 */
	isConnected: function() {

		if (!this._data_binding) Lava.t();
		return this._data_binding.isConnected();

	},

	/**
	 * Create `_data_binding` and it's "changed" listener
	 */
	_refreshDataBinding: function() {

		this._data_binding = this._container.getDataBinding(this._property_name);
		this._data_binding_changed_listener = this._data_binding.on('changed', this.onDataBindingChanged, this);

	},

	/**
	 * Destroy `_data_binding` and it's "changed" listener
	 */
	_destroyDataBinding: function() {

		this._data_binding.removeListener(this._data_binding_changed_listener);
		this._data_binding = null;
		this._data_binding_changed_listener = null;

	},

	/**
	 * The value of bound scope has changed. Schedule refresh
	 */
	onDataBindingChanged: function() {

		this._queueForRefresh();
		this._is_dirty = true;

	},

	_doRefresh: function() {

		if (this._data_binding == null) {

			this._refreshDataBinding();

		}

		var new_value = this._data_binding.getValue();

		if (new_value !== this._value) {

			this._value = new_value;

			this._fire('changed');

		}

	},

	/**
	 * Segment must bind to new property name. Destroy old `_data_binding` and schedule refresh
	 */
	onPropertyNameChanged: function() {

		this._property_name = this._name_source_container.getValue();

		this._destroyDataBinding();
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
	 * Set `_property_name` of the bound object
	 * @param {*} value
	 */
	setValue: function(value) {

		if (this._data_binding) {
			this._data_binding.setValue(value);
		}

	},

	destroy: function() {

		this._name_source_container.removeListener(this._name_source_waits_refresh_listener);
		this._name_source_container.removeListener(this._name_source_changed_listener);
		this._name_source_container.removeListener(this._name_source_refreshed_listener);
		this._data_binding_changed_listener && this._data_binding.removeListener(this._data_binding_changed_listener);

		Lava.schema.DEBUG && Lava.ScopeManager.debugStopTracking(this);
		this.Abstract$destroy();

	}

});