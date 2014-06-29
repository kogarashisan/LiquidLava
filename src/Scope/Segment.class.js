Lava.define(
'Lava.scope.Segment',
/**
 * @lends Lava.scope.Segment#
 * @implements _iValueContainer
 */
{

	Extends: 'Lava.scope.Abstract',
	isSetValue: true,

	_container: null,

	/**
	 * @type {_iValueContainer}
	 */
	_name_source_container: null,
	_name_source_waits_refresh_listener: null,
	_name_source_changed_listener: null,
	_name_source_refreshed_listener: null,

	_property_name: null,
	_data_binding: null,
	_data_binding_changed_listener: null,

	_value: null,

	/**
	 * @param {(Lava.view.Abstract|Lava.scope.Abstract)} container
	 * @param {(Lava.scope.PropertyBinding|Lava.scope.DataBinding)} name_source_container
	 * @param {number} level
	 */
	init: function(container, name_source_container, level) {

		if (Lava.schema.DEBUG && !name_source_container.isValueContainer) Lava.throw();
		if (Lava.schema.DEBUG && !name_source_container.guid) Lava.throw("Name source for segments must be either PropertyBinding or DataBinding");

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

	isConnected: function() {

		if (!this._data_binding) Lava.throw();
		return this._data_binding.isConnected();

	},

	_refreshDataBinding: function() {

		this._data_binding = this._container.getDataBinding(this._property_name);
		this._data_binding_changed_listener = this._data_binding.on('changed', this.onDataBindingChanged, this);

	},

	_destroyDataBinding: function() {

		this._data_binding.removeListener(this._data_binding_changed_listener);
		this._data_binding = null;
		this._data_binding_changed_listener = null;

	},

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

	onPropertyNameChanged: function() {

		this._property_name = this._name_source_container.getValue();

		this._destroyDataBinding();
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