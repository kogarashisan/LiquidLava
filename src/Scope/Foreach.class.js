Lava.define(
'Lava.scope.Foreach',
/**
 * @lends Lava.scope.Foreach#
 * @extends Lava.mixin.Refreshable
 * @implements _iValueContainer
 */
{

	Implements: 'Lava.mixin.Refreshable',
	isValueContainer: true,

	/**
	 * @type {Lava.scope.Argument}
	 */
	_argument: null,
	_argument_waits_refresh_listener: null,
	_argument_changed_listener: null,
	_argument_refreshed_listener: null,

	_view: null,
	_widget: null,

	/**
	 * @type {Lava.system.Enumerable}
	 */
	_value: null,
	_observable_listener: null,
	_observable: null,
	_own_enumerable: false,

	_create_own_enumerable: false,
	_after_refresh_callback: null,

	/**
	 * @param {Lava.scope.Argument} argument
	 * @param {Lava.view.Foreach} view
	 * @param {Lava.widget.Standard} widget
	 * @param {?_cScopeForeach} options
	 */
	init: function(argument, view, widget, options) {

		this._argument = argument;
		this._view = view;
		this._widget = widget;
		this.level = argument.level;

		if (this._argument.isWaitingRefresh()) {
			this._count_dependencies_waiting_refresh++;
			this._waits_refresh = true;
		}

		if (options) {
			this._create_own_enumerable = options['create_own_enumerable'] || false;
			this._after_refresh_callback = options['after_refresh_callback'] || null;
		}

		this._argument_waits_refresh_listener = this._argument.on('waits_refresh', this._onDependencyWaitsRefresh, this);
		this._argument_changed_listener = this._argument.on('changed', this.onDataSourceChanged, this);
		this._argument_refreshed_listener = this._argument.on('refreshed', this._onDependencyRefreshed, this);

		this._refreshDataSource();

	},

	_refreshDataSource: function() {

		var argument_value = this._argument.getValue();

		if (argument_value) {

			if (argument_value.isEnumerable) {

				if (this._create_own_enumerable) {

					this._createOrUpdateCollection(argument_value);

				} else {

					if (this._own_enumerable) {

						this._value.destroy();
						this._own_enumerable = false;
						this._value = null;

					}

					if (this._value != argument_value) {
						this._value = argument_value;
						this._fire('new_enumerable');
					}

				}

			} else {

				this._createOrUpdateCollection(argument_value);

			}

			if (this._observable_listener == null) {

				if (argument_value.isEnumerable) {

					this._observable_listener = argument_value.on('collection_changed', this._onObservableChanged, this);
					this._observable = argument_value;

				} else if (argument_value.isProperties) {

					this._observable_listener = argument_value.on('property_changed', this._onObservableChanged, this);
					this._observable = argument_value;

				}

			}

		} else if (this._own_enumerable) {

			this._value.removeAll();

		} else {

			this._createCollection(null);

		}

		if (this._after_refresh_callback) {
			this._widget[this._after_refresh_callback](this._value, argument_value, this._view);
		}

	},

	_createOrUpdateCollection: function(argument_value) {

		if (this._own_enumerable) {

			this._value.setSourceObject(argument_value);
			this._value.updateFromSourceObject();

		} else {

			this._createCollection(argument_value);

		}

	},

	_createCollection: function(argument_value) {

		this._value = new Lava.system.Enumerable(argument_value);
		this._own_enumerable = true;
		this._fire('new_enumerable');

	},

	_flushObservable: function() {

		this._observable.removeListener(this._observable_listener);
		this._observable_listener = null;
		this._observable = null;

	},

	onDataSourceChanged: function() {

		if (this._observable_listener) this._flushObservable();
		this._is_dirty = true;
		this._queueForRefresh();

	},

	_onObservableChanged: function() {

		this._is_dirty = true;
		this._queueForRefresh();

	},

	_doRefresh: function() {

		this._refreshDataSource();
		this._fire('changed');

	},

	getValue: function() {

		return this._value;

	},

	sleep: function() {

		Lava.suspendListener(this._argument_changed_listener);
		this._observable_listener && Lava.suspendListener(this._observable_listener);

	},

	wakeup: function() {

		if (this._observable_listener) {

			if (this._argument.getValue() != this._observable) {

				this._flushObservable();

			} else {

				Lava.resumeListener(this._observable_listener);

			}

		}

		this._refreshDataSource();
		Lava.resumeListener(this._argument_changed_listener);
		this._is_dirty = false;

	},

	destroy: function() {

		this._argument.removeListener(this._argument_waits_refresh_listener);
		this._argument.removeListener(this._argument_changed_listener);
		this._argument.removeListener(this._argument_refreshed_listener);
		this._observable_listener && this._flushObservable();

		if (this._own_enumerable) {

			this._value.destroy();

		}

		this.destroyRefreshable();

	}

});